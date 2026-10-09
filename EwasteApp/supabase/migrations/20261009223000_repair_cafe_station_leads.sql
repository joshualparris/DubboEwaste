alter table public.repair_cafe_stations add column if not exists lead_name text not null default '' check (char_length(lead_name)<=100);
create or replace function private.repair_cafe_station_capacity_change_guard()
returns trigger language plpgsql set search_path='' as $$
declare v_busy integer;
begin
 select count(*) into v_busy from public.repair_cafe_tickets where station_id=new.id and status='in_progress';
 if v_busy > new.capacity then raise exception 'Station capacity cannot be set below the number of active repairs'; end if;
 return new;
end $$;
drop trigger if exists rc_station_capacity_change on public.repair_cafe_stations;
create trigger rc_station_capacity_change before update of capacity on public.repair_cafe_stations
for each row execute function private.repair_cafe_station_capacity_change_guard();
