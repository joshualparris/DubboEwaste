alter table public.repair_cafe_tickets add column if not exists called_at timestamptz;
alter table public.repair_cafe_tickets add column if not exists called_station_id uuid references public.repair_cafe_stations(id);
create or replace function public.repair_cafe_call_visitor(p_ticket_id uuid,p_station_id uuid)
returns void language plpgsql security definer set search_path='' as $$
declare v_ticket public.repair_cafe_tickets%rowtype;v_station public.repair_cafe_stations%rowtype;v_busy integer;
begin
 if (select auth.uid()) is null or not (select private.has_program('repair_cafe')) then
  raise exception 'Repair Cafe membership required' using errcode='42501';
 end if;
 select * into v_ticket from public.repair_cafe_tickets where id=p_ticket_id for update;
 if not found or v_ticket.status<>'waiting' then raise exception 'Visitor is not waiting'; end if;
 if v_ticket.risk_level<>'clear' or not v_ticket.visitor_acknowledged or not v_ticket.safety_screened then
  raise exception 'Safety review or consent is required before calling to a repair station';
 end if;
 if not exists(select 1 from public.repair_cafe_sessions e where e.id=v_ticket.event_id and e.status='published') then
  raise exception 'Event is not open';
 end if;
 select * into v_station from public.repair_cafe_stations
 where id=p_station_id and event_id=v_ticket.event_id for update;
 if not found then raise exception 'Choose a station for this event'; end if;
 select count(*) into v_busy from public.repair_cafe_tickets where station_id=p_station_id and status='in_progress';
 if v_busy>=v_station.capacity then raise exception 'Station is full; choose another station'; end if;
 update public.repair_cafe_tickets set called_at=now(),called_station_id=p_station_id,
  updated_at=clock_timestamp(),updated_by=auth.uid() where id=p_ticket_id;
 insert into public.repair_cafe_ticket_activity(ticket_id,actor_id,from_status,to_status,note)
 values(p_ticket_id,auth.uid(),'waiting','waiting','Visitor called to station '||v_station.name);
end $$;
revoke all on function public.repair_cafe_call_visitor(uuid,uuid) from public,anon;
grant execute on function public.repair_cafe_call_visitor(uuid,uuid) to authenticated;
