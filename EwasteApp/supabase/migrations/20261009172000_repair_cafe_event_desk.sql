-- Repair Cafe Event Desk: anonymous-to-public visitors do not use this table.
-- Apply after 20261009150000. Review against production schema before deploy.
create table public.repair_cafe_tickets (
 id uuid primary key default gen_random_uuid(),
 session_id uuid not null references public.repair_cafe_sessions(id) on delete restrict,
 ticket_number bigint generated always as identity,
 item_name text not null check(char_length(trim(item_name)) between 2 and 120),
 category text not null check(category in ('textiles','electronics','computer','bicycle','toy','mechanical','other')),
 fault text not null default '' check(char_length(fault)<=800),
 visitor_label text not null default '' check(char_length(visitor_label)<=100),
 consent_acknowledged boolean not null default false,
 safety_screened boolean not null default false,
 safety_notes text not null default '' check(char_length(safety_notes)<=500),
 status text not null default 'waiting' check(status in ('waiting','in_progress','completed','declined')),
 station text not null default '' check(char_length(station)<=100),
 repair_notes text not null default '' check(char_length(repair_notes)<=1500),
 outcome text check(outcome in ('fixed','partly_fixed','diagnosed','referred','not_fixed','not_attempted')),
 created_at timestamptz not null default now(),
 started_at timestamptz,
 finished_at timestamptz,
 updated_at timestamptz not null default now(),
 constraint repair_desk_progress_requires_safety check(status not in ('in_progress','completed') or (consent_acknowledged and safety_screened)),
 constraint repair_desk_completed_has_outcome check(status <> 'completed' or outcome is not null),
 constraint repair_desk_finished_consistency check(finished_at is null or status in ('completed','declined'))
);
create index repair_cafe_tickets_queue_idx on public.repair_cafe_tickets(session_id,status,created_at);
create unique index repair_cafe_tickets_session_number_idx on public.repair_cafe_tickets(session_id,ticket_number);
alter table public.repair_cafe_tickets enable row level security;
revoke all on public.repair_cafe_tickets from anon,authenticated;
grant select,insert,update on public.repair_cafe_tickets to authenticated;
create policy "repair desk coordinators view" on public.repair_cafe_tickets for select to authenticated
 using (private.repair_cafe_can_manage());
create policy "repair desk coordinators check in" on public.repair_cafe_tickets for insert to authenticated
 with check (private.repair_cafe_can_manage());
create policy "repair desk coordinators update" on public.repair_cafe_tickets for update to authenticated
 using (private.repair_cafe_can_manage()) with check (private.repair_cafe_can_manage());

-- Never expose direct public read or delete; records need a separately approved retention process.
create or replace function private.repair_cafe_ticket_guard()
returns trigger language plpgsql set search_path='' as $$
begin
 if tg_op='UPDATE' then
  if new.session_id<>old.session_id or new.ticket_number<>old.ticket_number
    then raise exception 'Ticket identity cannot be changed'; end if;
  if old.status in ('completed','declined') and new.status<>old.status
    then raise exception 'Closed tickets cannot be reopened'; end if;
 end if;
 if new.status='in_progress' and new.started_at is null then new.started_at=now(); end if;
 if new.status in ('completed','declined') and new.finished_at is null then new.finished_at=now(); end if;
 new.updated_at=now();
 return new;
end $$;
create trigger repair_cafe_ticket_guard_trigger before update or insert on public.repair_cafe_tickets
 for each row execute function private.repair_cafe_ticket_guard();
comment on table public.repair_cafe_tickets is 'Repair Café community visitor-owned items. Not AssetFlow assets. Do not store visitor contact details or device passwords.';
