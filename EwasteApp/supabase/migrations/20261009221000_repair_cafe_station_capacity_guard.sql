create or replace function private.repair_cafe_station_capacity_guard()
returns trigger language plpgsql security definer set search_path='' as $$
declare max_items integer; in_use integer;
begin
 if new.status <> 'in_progress' or new.station_id is null then return new; end if;
 select capacity into max_items from public.repair_cafe_stations where id=new.station_id and event_id=new.event_id for update;
 if max_items is null then raise exception 'Station not found for this event'; end if;
 select count(*) into in_use from public.repair_cafe_tickets
 where station_id=new.station_id and status='in_progress' and id<>new.id;
 if in_use >= max_items then raise exception 'Station is at capacity. Choose another station or wait.';
 end if;
 return new;
end $$;
drop trigger if exists repair_cafe_station_capacity on public.repair_cafe_tickets;
create trigger repair_cafe_station_capacity before insert or update of status,station_id
on public.repair_cafe_tickets for each row execute function private.repair_cafe_station_capacity_guard();
