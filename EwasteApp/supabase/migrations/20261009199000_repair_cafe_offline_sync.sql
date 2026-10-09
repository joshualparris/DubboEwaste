-- Offline Event Desk v1: atomic, idempotent and optimistic-concurrency guarded sync.
-- Do not expose direct INSERT/UPDATE rights to operational ticket tables.
create table public.repair_cafe_offline_receipts (
 operation_id uuid primary key,
 user_id uuid not null references auth.users(id),
 event_id uuid not null references public.repair_cafe_sessions(id),
 kind text not null check(kind in ('check_in','queue_notes','ticket_update')),
 payload_hash text not null,
 result jsonb not null,
 created_at timestamptz not null default now()
);
create index repair_cafe_offline_receipts_owner on public.repair_cafe_offline_receipts(user_id,created_at desc);
alter table public.repair_cafe_offline_receipts enable row level security;
revoke all on public.repair_cafe_offline_receipts from public,anon,authenticated;
grant select on public.repair_cafe_offline_receipts to authenticated;
create policy "volunteer reads own sync confirmations" on public.repair_cafe_offline_receipts
 for select to authenticated using(user_id=auth.uid() and private.has_program('repair_cafe'));

create function public.repair_cafe_apply_offline_operation(
 p_operation_id uuid,p_event_id uuid,p_kind text,p_payload jsonb
) returns jsonb language plpgsql security definer set search_path=''
as $$
declare uid uuid:=auth.uid();
        old_row public.repair_cafe_offline_receipts%rowtype;
        payload_hash text;
        rec_id uuid;
        ticket_id uuid;
        ticket_event uuid;
        queue_no int;
        result jsonb;
        expected timestamptz;
        station uuid;
        outcome text;
        risk text;
        status text;
        prior_event_status text;
begin
 if uid is null or not private.has_program('repair_cafe') then
  raise exception 'Repair Café membership required' using errcode='42501';
 end if;
 if p_operation_id is null or p_event_id is null
    or p_kind not in ('check_in','queue_notes','ticket_update')
    or p_payload is null or jsonb_typeof(p_payload)<>'object'
    or octet_length(p_payload::text)>12000 then
  raise exception 'Invalid offline operation';
 end if;
 -- Same operation ID is processed at most once, even across two tabs/retries.
 perform pg_advisory_xact_lock(hashtextextended(p_operation_id::text,0));
 payload_hash:=md5(p_event_id::text||':'||p_kind||':'||p_payload::text);
 select * into old_row from public.repair_cafe_offline_receipts
  where operation_id=p_operation_id;
 if found then
  if old_row.user_id<>uid or old_row.event_id<>p_event_id
    or old_row.kind<>p_kind or old_row.payload_hash<>payload_hash then
   raise exception 'Offline operation ID was already used for different data';
  end if;
  return old_row.result;
 end if;
 select status into prior_event_status from public.repair_cafe_sessions
  where id=p_event_id and deleted_at is null;
 if prior_event_status is null or prior_event_status in ('completed','cancelled') then
  raise exception 'Event is closed, cancelled or unavailable; review the queued operation';
 end if;
 if p_kind='check_in' then
  select t.ticket_id,t.queue_number into ticket_id,queue_no
  from public.repair_cafe_check_in_named(
   p_event_id,
   p_payload->>'category',p_payload->>'item',p_payload->>'fault',
   (p_payload->>'acknowledged')='true',(p_payload->>'screened')='true',
   p_payload->>'risk',p_payload->>'risk_notes',p_payload->>'visitor_name'
  ) t;
  result:=jsonb_build_object('operation_id',p_operation_id,'ticket_id',ticket_id,
   'queue_number',queue_no,'state','synced');
 else
  if coalesce(p_payload->>'ticket_id','')='' then
   raise exception 'Missing ticket for offline edit';
  end if;
  ticket_id:=(p_payload->>'ticket_id')::uuid;
  select event_id into ticket_event from public.repair_cafe_tickets where id=ticket_id;
  if ticket_event is distinct from p_event_id then
   raise exception 'The selected ticket is not in this event';
  end if;
  expected:=(p_payload->>'revision')::timestamptz;
  if expected is null then raise exception 'Offline changes require the original ticket revision'; end if;
  if p_kind='queue_notes' then
   perform public.repair_cafe_edit_waiting_notes(ticket_id,expected,
    p_payload->>'reported_problem',p_payload->>'queue_notes');
  else
   status:=p_payload->>'status';
   risk:=p_payload->>'risk';
   outcome:=nullif(p_payload->>'outcome','');
   station:=nullif(p_payload->>'station_id','')::uuid;
   perform public.repair_cafe_save_ticket_with_progress(
    ticket_id,status,station,outcome,nullif(p_payload->>'barrier',''),
    coalesce(p_payload->>'note',''),coalesce(p_payload->>'advice',''),
    coalesce(p_payload->>'parts',''),risk,coalesce(p_payload->>'risk_notes',''),
    nullif(p_payload->>'progress_code',''),expected
   );
  end if;
  result:=jsonb_build_object('operation_id',p_operation_id,'ticket_id',ticket_id,
   'state','synced');
 end if;
 -- Save receipt only after all ticket changes passed validation. Any failure
 -- rolls back the entire transaction, including ticket and activity changes.
 insert into public.repair_cafe_offline_receipts(operation_id,user_id,event_id,kind,payload_hash,result)
 values(p_operation_id,uid,p_event_id,p_kind,payload_hash,result);
 return result;
end
$$;
revoke all on function public.repair_cafe_apply_offline_operation(uuid,uuid,text,jsonb)
 from public,anon;
grant execute on function public.repair_cafe_apply_offline_operation(uuid,uuid,text,jsonb)
 to authenticated;
comment on table public.repair_cafe_offline_receipts is
 'No visitor data; immutable sync acknowledgements to prevent duplicate check-ins and replay across devices. Define local retention/deletion policy before pilot.';
