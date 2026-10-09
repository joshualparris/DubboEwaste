-- Event Desk tables and secure workflow for existing Event Desk UI.
-- Apply after 20261009170000_repair_cafe_event_operations.sql.
-- No public access; volunteers need Repair Café programme membership.
create table public.repair_cafe_stations (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.repair_cafe_sessions(id),
 name text not null check(length(trim(name)) between 2 and 80),
 category text not null check(category in ('general','electrical','computers','sewing','bikes','mechanical','woodwork','other')),
 location_note text not null default '' check(length(location_note)<=240),
 created_at timestamptz not null default now()
);
create index on public.repair_cafe_stations(event_id);
create table public.repair_cafe_tickets (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.repair_cafe_sessions(id),
 ticket_number bigint generated always as identity unique,
 item_category text not null check(item_category in ('electronics','computers','small_appliance','textiles','bicycle','furniture','household','other')),
 item_description text not null check(length(trim(item_description)) between 2 and 160),
 reported_problem text not null check(length(reported_problem) between 3 and 700),
 risk_level text not null check(risk_level in ('clear','review','unsafe')),
 risk_notes text not null default '' check(length(risk_notes)<=500),
 acknowledged boolean not null default false,
 screened boolean not null default false,
 status text not null default 'waiting' check(status in ('waiting','in_progress','completed','referred','not_attempted','void')),
 outcome text check(outcome in ('fixed','partially_fixed','not_fixed','referred','not_attempted')),
 barrier text check(barrier in ('parts','time','skills','safety','cost','not_repairable','other')),
 station_id uuid references public.repair_cafe_stations(id),
 work_summary text not null default '' check(length(work_summary)<=1200),
 parts_used text not null default '' check(length(parts_used)<=300),
 handover_advice text not null default '' check(length(handover_advice)<=700),
 arrived_at timestamptz not null default now(),
 started_at timestamptz,
 closed_at timestamptz,
 created_by uuid default auth.uid(),
 check(status not in ('in_progress','completed') or (acknowledged and screened)),
 check(risk_level='clear' or status not in ('in_progress','completed')),
 check(status not in ('completed','referred','not_attempted') or outcome is not null),
 check(risk_level='clear' or length(risk_notes)>0)
);
create index on public.repair_cafe_tickets(event_id,status,ticket_number);
create table public.repair_cafe_ticket_activity (
 id uuid primary key default gen_random_uuid(),
 ticket_id uuid not null references public.repair_cafe_tickets(id),
 from_status text,
 to_status text not null,
 note text not null default '' check(length(note)<=1200),
 created_at timestamptz not null default now(),
 actor uuid default auth.uid()
);
create index on public.repair_cafe_ticket_activity(ticket_id,created_at desc);

alter table public.repair_cafe_stations enable row level security;
alter table public.repair_cafe_tickets enable row level security;
alter table public.repair_cafe_ticket_activity enable row level security;
revoke all on public.repair_cafe_stations,public.repair_cafe_tickets,public.repair_cafe_ticket_activity from anon,authenticated;
grant select,insert,update,delete on public.repair_cafe_stations to authenticated;
grant select on public.repair_cafe_tickets,public.repair_cafe_ticket_activity to authenticated;
create policy "repair station member select" on public.repair_cafe_stations for select to authenticated
 using(private.has_program('repair_cafe'));
create policy "repair station coordinator insert" on public.repair_cafe_stations for insert to authenticated
 with check(private.repair_cafe_can_manage());
create policy "repair station coordinator edit" on public.repair_cafe_stations for update to authenticated
 using(private.repair_cafe_can_manage()) with check(private.repair_cafe_can_manage());
create policy "repair station coordinator delete" on public.repair_cafe_stations for delete to authenticated
 using(private.repair_cafe_can_manage());
create policy "repair tickets member view" on public.repair_cafe_tickets for select to authenticated
 using(private.has_program('repair_cafe'));
create policy "repair activity member view" on public.repair_cafe_ticket_activity for select to authenticated
 using(private.has_program('repair_cafe'));

create function public.repair_cafe_check_in(
 p_event_id uuid,p_category text,p_item text,p_problem text,
 p_acknowledged boolean,p_screened boolean,p_risk text,p_risk_notes text
) returns table(queue_number bigint)
language plpgsql security definer set search_path='' as $$
declare v_id uuid; v_number bigint; v_status text;
begin
 if not private.has_program('repair_cafe') then raise exception 'Repair Cafe membership required'; end if;
 select status into v_status from public.repair_cafe_sessions where id=p_event_id;
 if v_status is null or v_status in ('cancelled','completed') then raise exception 'Session unavailable'; end if;
 if not p_acknowledged or not p_screened then raise exception 'Acknowledgement and safety screening required'; end if;
 if p_risk not in ('clear','review','unsafe') or (p_risk<>'clear' and trim(coalesce(p_risk_notes,''))='')
 then raise exception 'Invalid risk assessment'; end if;
 insert into public.repair_cafe_tickets(event_id,item_category,item_description,reported_problem,risk_level,risk_notes,acknowledged,screened,status,outcome)
 values(p_event_id,p_category,p_item,p_problem,p_risk,coalesce(p_risk_notes,''),true,true,
  case when p_risk='unsafe' then 'not_attempted' else 'waiting' end,
  case when p_risk='unsafe' then 'not_attempted' else null end)
 returning id,ticket_number into v_id,v_number;
 insert into public.repair_cafe_ticket_activity(ticket_id,to_status,note)
 values(v_id,case when p_risk='unsafe' then 'not_attempted' else 'waiting' end,'Item checked in');
 return query select v_number;
end $$;
revoke all on function public.repair_cafe_check_in(uuid,text,text,text,boolean,boolean,text,text) from public,anon;
grant execute on function public.repair_cafe_check_in(uuid,text,text,text,boolean,boolean,text,text) to authenticated;

create function public.repair_cafe_save_ticket(
 p_ticket_id uuid,p_status text,p_station_id uuid,p_outcome text,p_barrier text,
 p_note text,p_advice text,p_parts text,p_risk text,p_risk_notes text
) returns void language plpgsql security definer set search_path='' as $$
declare t public.repair_cafe_tickets%rowtype; v_event uuid;
begin
 if not private.has_program('repair_cafe') then raise exception 'Repair Cafe membership required'; end if;
 select * into t from public.repair_cafe_tickets where id=p_ticket_id for update;
 if not found then raise exception 'Ticket not found'; end if;
 if t.status in ('completed','referred','not_attempted','void') and p_status<>t.status
 then raise exception 'Closed ticket cannot be reopened'; end if;
 if p_status not in ('waiting','in_progress','completed','referred','not_attempted','void')
 then raise exception 'Invalid status'; end if;
 if p_risk not in ('clear','review','unsafe') or (p_risk<>'clear' and trim(coalesce(p_risk_notes,''))='')
 then raise exception 'Safety notes required'; end if;
 if p_status in ('in_progress','completed') and (p_risk<>'clear' or not t.acknowledged or not t.screened)
 then raise exception 'Safety clearance and acknowledgement required'; end if;
 if p_status='in_progress' and p_station_id is null then raise exception 'Allocate a station'; end if;
 if p_status in ('completed','referred','not_attempted') and p_outcome is null then raise exception 'Outcome required'; end if;
 if p_station_id is not null then
  select event_id into v_event from public.repair_cafe_stations where id=p_station_id;
  if v_event is distinct from t.event_id then raise exception 'Station is from another event'; end if;
 end if;
 if not private.repair_cafe_can_manage() and (p_risk<>t.risk_level or p_risk_notes<>t.risk_notes or p_status='void')
 then raise exception 'Coordinator required for safety changes or void'; end if;
 update public.repair_cafe_tickets
 set status=p_status,station_id=p_station_id,outcome=p_outcome,barrier=p_barrier,
  work_summary=coalesce(p_note,''),handover_advice=coalesce(p_advice,''),
  parts_used=coalesce(p_parts,''),risk_level=p_risk,risk_notes=coalesce(p_risk_notes,''),
  started_at=case when p_status='in_progress' then coalesce(started_at,now()) else started_at end,
  closed_at=case when p_status in ('completed','referred','not_attempted','void') then coalesce(closed_at,now()) else closed_at end
 where id=p_ticket_id;
 insert into public.repair_cafe_ticket_activity(ticket_id,from_status,to_status,note)
 values(p_ticket_id,t.status,p_status,coalesce(p_note,''));
end $$;
revoke all on function public.repair_cafe_save_ticket(uuid,text,uuid,text,text,text,text,text,text,text) from public,anon;
grant execute on function public.repair_cafe_save_ticket(uuid,text,uuid,text,text,text,text,text,text,text) to authenticated;
