-- Repair Café Event Desk: isolated event-specific community repair intake and outcomes.
-- No visitor names, contact details, passwords or asset custody fields.
-- Migrations are additive. Existing E-waste repairs and inventory stay untouched.

create table public.repair_cafe_stations (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.repair_cafe_sessions(id) on delete cascade,
 name text not null check (char_length(trim(name)) between 2 and 80),
 category text not null default 'general' check (category in ('general','electrical','computers','sewing','bikes','mechanical','woodwork','other')),
 location_note text not null default '' check (char_length(location_note)<=240),
 created_at timestamptz not null default now()
);
create unique index repair_cafe_stations_event_name_unique on public.repair_cafe_stations(event_id,lower(name));

create table public.repair_cafe_tickets (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.repair_cafe_sessions(id) on delete restrict,
 ticket_number integer not null check (ticket_number between 1 and 99999),
 item_category text not null check (item_category in ('electronics','computers','small_appliance','textiles','bicycle','furniture','household','other')),
 item_description text not null check (char_length(trim(item_description)) between 2 and 160),
 reported_problem text not null check (char_length(trim(reported_problem)) between 3 and 700),
 visitor_acknowledged boolean not null check (visitor_acknowledged=true),
 safety_screened boolean not null check (safety_screened=true),
 risk_level text not null default 'clear' check (risk_level in ('clear','review','unsafe')),
 risk_notes text not null default '' check (char_length(risk_notes)<=500),
 status text not null default 'waiting' check(status in ('waiting','in_progress','completed','referred','not_attempted','void')),
 outcome text check(outcome in ('fixed','partially_fixed','not_fixed','referred','not_attempted')),
 barrier text check(barrier in ('parts','time','skills','safety','cost','not_repairable','other')),
 station_id uuid references public.repair_cafe_stations(id) on delete restrict,
 work_summary text not null default '' check(char_length(work_summary)<=1200),
 parts_used text not null default '' check(char_length(parts_used)<=300),
 handover_advice text not null default '' check(char_length(handover_advice)<=700),
 created_by uuid not null references public.profiles(id),
 updated_by uuid references public.profiles(id),
 arrived_at timestamptz not null default now(),
 started_at timestamptz,
 closed_at timestamptz,
 updated_at timestamptz not null default now(),
 unique(event_id,ticket_number),
 constraint event_desk_closed_result check (
  (status='completed' and outcome in ('fixed','partially_fixed','not_fixed')) or
  (status='referred' and outcome='referred') or
  (status='not_attempted' and outcome='not_attempted') or
  (status='void' and outcome is null) or
  (status in ('waiting','in_progress') and outcome is null)
 ),
 constraint event_desk_risk_note check (risk_level='clear' or char_length(trim(risk_notes))>=3),
 constraint event_desk_started_at check (status<>'in_progress' or started_at is not null),
 constraint event_desk_closed_at check (
  (status in ('completed','referred','not_attempted','void') and closed_at is not null)
  or (status in ('waiting','in_progress') and closed_at is null)
 )
);
create index repair_cafe_tickets_event_status on public.repair_cafe_tickets(event_id,status,arrived_at);

create table public.repair_cafe_ticket_activity (
 id uuid primary key default gen_random_uuid(),
 ticket_id uuid not null references public.repair_cafe_tickets(id) on delete restrict,
 actor_id uuid not null references public.profiles(id),
 from_status text,
 to_status text not null,
 note text not null default '' check(char_length(note)<=1200),
 created_at timestamptz not null default now()
);
create index repair_cafe_ticket_activity_ticket_idx on public.repair_cafe_ticket_activity(ticket_id,created_at);

alter table public.repair_cafe_stations enable row level security;
alter table public.repair_cafe_tickets enable row level security;
alter table public.repair_cafe_ticket_activity enable row level security;
revoke all on public.repair_cafe_stations, public.repair_cafe_tickets, public.repair_cafe_ticket_activity from public,anon,authenticated;
grant select,insert,update,delete on public.repair_cafe_stations to authenticated;
grant select on public.repair_cafe_tickets,public.repair_cafe_ticket_activity to authenticated;
create policy "repair cafe team reads their stations" on public.repair_cafe_stations
 for select to authenticated using(private.has_program('repair_cafe'));
create policy "coordinator creates stations" on public.repair_cafe_stations
 for insert to authenticated with check(private.repair_cafe_can_manage());
create policy "coordinator edits stations" on public.repair_cafe_stations
 for update to authenticated using(private.repair_cafe_can_manage())
 with check(private.repair_cafe_can_manage());
create policy "coordinator deletes stations" on public.repair_cafe_stations
 for delete to authenticated using(private.repair_cafe_can_manage());
create policy "repair cafe team reads event ticket records" on public.repair_cafe_tickets
 for select to authenticated using(private.has_program('repair_cafe'));
create policy "repair cafe team reads ticket history" on public.repair_cafe_ticket_activity
 for select to authenticated using(private.has_program('repair_cafe'));

-- Prevent moving a station to another event once it is assigned.
create function private.repair_cafe_station_identity()
returns trigger language plpgsql set search_path=''
as $$
begin
 if new.event_id <> old.event_id then raise exception 'Cannot move an existing station to another event'; end if;
 return new;
end
$$;
create trigger repair_cafe_station_event_immutable before update on public.repair_cafe_stations
for each row execute function private.repair_cafe_station_identity();

create function public.repair_cafe_check_in(
 p_event_id uuid, p_category text, p_item text, p_problem text,
 p_acknowledged boolean, p_screened boolean, p_risk text, p_risk_notes text default ''
)
returns table(ticket_id uuid, queue_number integer)
language plpgsql security definer set search_path=''
as $$
declare e_status text; next_no int; inserted uuid; initial_state text; initial_outcome text; end_time timestamptz;
begin
 if auth.uid() is null or not private.has_program('repair_cafe') then
  raise exception 'Repair Café membership required' using errcode='42501';
 end if;
 select status into e_status from public.repair_cafe_sessions where id=p_event_id;
 if e_status is null or e_status in ('completed','cancelled') then raise exception 'This event is closed or not found'; end if;
 if e_status<>'published' and not private.repair_cafe_can_manage() then
  raise exception 'Only coordinators can trial intake on draft events';
 end if;
 if p_acknowledged is distinct from true or p_screened is distinct from true then
  raise exception 'Visitor acknowledgement and safety screening are required';
 end if;
 if p_category not in ('electronics','computers','small_appliance','textiles','bicycle','furniture','household','other')
    or char_length(trim(coalesce(p_item,''))) not between 2 and 160
    or char_length(trim(coalesce(p_problem,''))) not between 3 and 700
    or coalesce(p_risk,'') not in ('clear','review','unsafe')
    or char_length(coalesce(p_risk_notes,''))>500
    or (p_risk<>'clear' and char_length(trim(coalesce(p_risk_notes,'')))<3)
 then raise exception 'Check the repair item, problem and risk screening'; end if;
 -- Lock queue numbering at event scope; unique index is a second line of defence.
 perform pg_advisory_xact_lock(hashtext('repair_cafe_ticket'),hashtext(p_event_id::text));
 select coalesce(max(t.ticket_number),0)+1 into next_no from public.repair_cafe_tickets t where t.event_id=p_event_id;
 initial_state:=case when p_risk='unsafe' then 'not_attempted' else 'waiting' end;
 initial_outcome:=case when p_risk='unsafe' then 'not_attempted' else null end;
 end_time:=case when p_risk='unsafe' then now() else null end;
 insert into public.repair_cafe_tickets (
  event_id,ticket_number,item_category,item_description,reported_problem,
  visitor_acknowledged,safety_screened,risk_level,risk_notes,status,outcome,closed_at,created_by,updated_by
 ) values (
  p_event_id,next_no,p_category,trim(p_item),trim(p_problem),
  true,true,p_risk,coalesce(p_risk_notes,''),initial_state,initial_outcome,end_time,auth.uid(),auth.uid()
 ) returning id into inserted;
 insert into public.repair_cafe_ticket_activity(ticket_id,actor_id,to_status,note)
 values(inserted,auth.uid(),initial_state,case when p_risk='unsafe'
   then 'Safety refusal: no repair attempted.' else 'Visitor checked in and screened.' end);
 return query select inserted,next_no;
end
$$;
revoke all on function public.repair_cafe_check_in(uuid,text,text,text,boolean,boolean,text,text) from public,anon;
grant execute on function public.repair_cafe_check_in(uuid,text,text,text,boolean,boolean,text,text) to authenticated;

create function public.repair_cafe_save_ticket(
 p_ticket_id uuid, p_status text, p_station_id uuid default null,
 p_outcome text default null, p_barrier text default null,
 p_note text default '', p_advice text default '',p_parts text default '',
 p_risk text default null, p_risk_notes text default null
)
returns void language plpgsql security definer set search_path=''
as $$
declare old_ticket public.repair_cafe_tickets%rowtype;
        e_status text; new_risk text; new_risk_notes text;
        new_outcome text; new_started timestamptz; new_closed timestamptz;
        new_station uuid;
begin
 if auth.uid() is null or not private.has_program('repair_cafe') then
  raise exception 'Repair Café membership required' using errcode='42501';
 end if;
 select * into old_ticket from public.repair_cafe_tickets where id=p_ticket_id for update;
 if not found then raise exception 'Ticket not found'; end if;
 select status into e_status from public.repair_cafe_sessions where id=old_ticket.event_id;
 if e_status in ('completed','cancelled') or (e_status<>'published' and not private.repair_cafe_can_manage()) then
  raise exception 'Event is not open for volunteer work';
 end if;
 if p_status not in ('waiting','in_progress','completed','referred','not_attempted','void')
    or char_length(coalesce(p_note,''))>1200 or char_length(coalesce(p_advice,''))>700
    or char_length(coalesce(p_parts,''))>300 or char_length(coalesce(p_risk_notes,''))>500
 then raise exception 'Invalid status or note length'; end if;
 if p_status='void' and not private.repair_cafe_can_manage() then
   raise exception 'Coordinator required to void a ticket';
 end if;
 if old_ticket.status in ('completed','referred','not_attempted','void')
    and not private.repair_cafe_can_manage() then
  raise exception 'Closed tickets can only be corrected by a coordinator';
 end if;
 new_risk:=coalesce(p_risk,old_ticket.risk_level);
 new_risk_notes:=coalesce(p_risk_notes,old_ticket.risk_notes);
 if new_risk not in ('clear','review','unsafe') or
    (new_risk <> 'clear' and char_length(trim(new_risk_notes))<3) then
  raise exception 'Invalid risk assessment';
 end if;
 if (new_risk is distinct from old_ticket.risk_level or new_risk_notes is distinct from old_ticket.risk_notes)
    and not private.repair_cafe_can_manage() then
  raise exception 'Only coordinators can change a safety assessment';
 end if;
 new_station:=coalesce(p_station_id,old_ticket.station_id);
 if new_station is not null and not exists (
  select 1 from public.repair_cafe_stations s where s.id=new_station and s.event_id=old_ticket.event_id
 ) then raise exception 'Station belongs to a different session'; end if;
 if p_status='in_progress' and (new_risk <> 'clear' or not old_ticket.visitor_acknowledged
   or not old_ticket.safety_screened or new_station is null) then
  raise exception 'Only cleared items with consent and an assigned station may enter repair';
 end if;
 if new_risk='unsafe' and p_status not in ('not_attempted','referred','void') then
  raise exception 'Unsafe items cannot be queued or repaired'; end if;
 if p_status='completed' and p_outcome not in ('fixed','partially_fixed','not_fixed') then
  raise exception 'Choose fixed, partially fixed, or not fixed'; end if;
 if p_status='referred' and p_outcome is distinct from 'referred' then
  raise exception 'Referral outcome required'; end if;
 if p_status='not_attempted' and p_outcome is distinct from 'not_attempted' then
  raise exception 'Not attempted outcome required'; end if;
 if p_status in ('waiting','in_progress','void') and p_outcome is not null then
  raise exception 'Outcome must be empty until closed'; end if;
 if p_barrier is not null and p_barrier not in
    ('parts','time','skills','safety','cost','not_repairable','other') then
  raise exception 'Invalid repair barrier'; end if;
 new_outcome:=p_outcome;
 new_started:=case when p_status='waiting' then null
   when p_status='in_progress' then coalesce(old_ticket.started_at,now())
   else old_ticket.started_at end;
 new_closed:=case when p_status in ('completed','referred','not_attempted','void')
   then now() else null end;
 update public.repair_cafe_tickets set
  status=p_status,station_id=new_station,outcome=new_outcome,barrier=p_barrier,
  work_summary=case when trim(coalesce(p_note,''))<>'' then trim(p_note) else work_summary end,
  parts_used=case when trim(coalesce(p_parts,''))<>'' then trim(p_parts) else parts_used end,
  handover_advice=case when trim(coalesce(p_advice,''))<>'' then trim(p_advice) else handover_advice end,
  risk_level=new_risk,risk_notes=new_risk_notes,
  started_at=new_started,closed_at=new_closed,
  updated_at=now(),updated_by=auth.uid()
 where id=p_ticket_id;
 insert into public.repair_cafe_ticket_activity(ticket_id,actor_id,from_status,to_status,note)
 values(p_ticket_id,auth.uid(),old_ticket.status,p_status,coalesce(p_note,''));
end
$$;
revoke all on function public.repair_cafe_save_ticket(uuid,text,uuid,text,text,text,text,text,text,text) from public,anon;
grant execute on function public.repair_cafe_save_ticket(uuid,text,uuid,text,text,text,text,text,text,text) to authenticated;

-- Don't accidentally erase real repair history through session deletion.
create function private.repair_cafe_preserve_tickets()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 if exists(select 1 from public.repair_cafe_tickets t where t.event_id=old.id) then
   raise exception 'An event with repair records cannot be deleted. Cancel/archive it instead.';
 end if;
 return old;
end
$$;
create trigger repair_cafe_preserve_event_history before delete on public.repair_cafe_sessions
 for each row execute function private.repair_cafe_preserve_tickets();

comment on table public.repair_cafe_tickets is
 'Community Repair Café temporary visitor items; not E-waste assets or transferable property.';
