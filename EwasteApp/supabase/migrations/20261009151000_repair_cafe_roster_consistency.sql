-- Additional integrity checks for manual and authenticated volunteers.
-- Save this after the full CRUD migration.

create or replace function private.repair_cafe_check_capacity()
returns trigger language plpgsql security definer set search_path=''
as $$
declare max_seats int; used_seats int; event_uuid uuid;
begin
 if new.status='confirmed' then
   select s.required_count,s.event_id into max_seats,event_uuid
   from public.repair_cafe_shift_slots s where s.id=new.slot_id for update;
   if max_seats is null then raise exception 'Unknown volunteer position'; end if;
   if new.manual_volunteer_id is not null and not exists(
     select 1 from public.repair_cafe_manual_availability ma
     where ma.event_id=event_uuid and ma.manual_volunteer_id=new.manual_volunteer_id
       and ma.response='available'
   ) then raise exception 'Manual volunteer must be available for the event before confirmation'; end if;
   if new.user_id is not null and not exists(
     select 1 from public.repair_cafe_availability a
     where a.event_id=event_uuid and a.user_id=new.user_id
       and a.response in ('available','maybe')
   ) then raise exception 'Account volunteer must nominate availability before confirmation'; end if;
   select count(*) into used_seats from public.repair_cafe_shift_assignments a
    where a.slot_id=new.slot_id and a.status='confirmed' and a.id<>new.id;
   if used_seats>=max_seats then raise exception 'This volunteer position is already full'; end if;
 end if;
 return new;
end
$$;

create function private.repair_cafe_prevent_unavailable_rostered()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 if new.response='unavailable' and exists(
  select 1 from public.repair_cafe_shift_assignments a
  join public.repair_cafe_shift_slots s on s.id=a.slot_id
  where s.event_id=new.event_id and a.user_id=new.user_id and a.status='confirmed'
 ) then raise exception 'Withdraw the volunteer from confirmed shifts before marking unavailable'; end if;
 return new;
end
$$;
create trigger repair_cafe_available_after_shift
 before insert or update of response on public.repair_cafe_availability
 for each row execute function private.repair_cafe_prevent_unavailable_rostered();

create function private.repair_cafe_prevent_manual_unavailable_rostered()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 if new.response='unavailable' and exists(
  select 1 from public.repair_cafe_shift_assignments a
  join public.repair_cafe_shift_slots s on s.id=a.slot_id
  where s.event_id=new.event_id
   and a.manual_volunteer_id=new.manual_volunteer_id and a.status='confirmed'
 ) then raise exception 'Remove the confirmed shift before marking manual volunteer unavailable'; end if;
 return new;
end
$$;
create trigger repair_cafe_manual_available_after_shift
 before insert or update of response on public.repair_cafe_manual_availability
 for each row execute function private.repair_cafe_prevent_manual_unavailable_rostered();

create function private.repair_cafe_no_silent_public_changes()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 if old.status='published' and new.status='published'
 and (new.event_date,new.starts_at,new.ends_at,new.title,new.focus)
  is distinct from
  (old.event_date,old.starts_at,old.ends_at,old.title,old.focus)
 then raise exception 'Unpublish before changing advertised session details'; end if;
 return new;
end
$$;
create trigger repair_cafe_public_details_guard
 before update on public.repair_cafe_sessions
 for each row execute function private.repair_cafe_no_silent_public_changes();
