-- Extend the canonical Repair Cafe Event Desk tickets (not AssetFlow repair inventory).
-- Explicitly keep ownership with visitors. Measured weights are optional and never estimates.
alter table public.repair_cafe_tickets
 add column if not exists measured_weight_kg numeric(9,3)
 check(measured_weight_kg between 0 and 10000);
alter table public.repair_cafe_tickets
 add column if not exists owner_kept_item boolean not null default true;
create policy "coordinators correct measured ticket evidence"
 on public.repair_cafe_tickets for update to authenticated
 using (private.repair_cafe_can_manage()) with check(private.repair_cafe_can_manage());
grant update(measured_weight_kg,owner_kept_item) on public.repair_cafe_tickets to authenticated;

alter table public.repair_cafe_incidents
 add column if not exists ticket_id uuid references public.repair_cafe_tickets(id);
-- Attach photos to existing canonical tickets without creating a duplicate visitor identity.
alter table public.repair_cafe_visit_photos
 alter column visit_id drop not null;
alter table public.repair_cafe_visit_photos
 add column if not exists ticket_id uuid references public.repair_cafe_tickets(id);
alter table public.repair_cafe_visit_photos
 add constraint repair_cafe_photo_exactly_one_owner
 check ((visit_id is not null) <> (ticket_id is not null));
create index if not exists rc_ticket_photo_lookup on public.repair_cafe_visit_photos(ticket_id) where ticket_id is not null;

-- Date-aware verification for all existing confirmed assignments after a shift time edit.
create function private.repair_cafe_check_slot_timing() returns trigger language plpgsql security definer set search_path=''
as $$
declare event_day date;
begin
 select event_date into event_day from public.repair_cafe_sessions where id=new.event_id;
 if new.ends_at<=new.starts_at then raise exception 'Shift finish must be after start'; end if;
 if exists(
  select 1 from public.repair_cafe_shift_assignments a
  join public.repair_cafe_shift_assignments other on other.id<>a.id and other.status='confirmed'
   and ((a.user_id is not null and a.user_id=other.user_id)
    or (a.manual_volunteer_id is not null and a.manual_volunteer_id=other.manual_volunteer_id))
  join public.repair_cafe_shift_slots other_slot on other_slot.id=other.slot_id
  join public.repair_cafe_sessions other_event on other_event.id=other_slot.event_id
  where a.slot_id=new.id and a.status='confirmed'
   and other_event.event_date=event_day
   and other_slot.starts_at<new.ends_at and other_slot.ends_at>new.starts_at
 ) then raise exception 'Shift time change conflicts with another confirmed assignment'; end if;
 return new;
end $$;
create trigger rc_shift_time_change_guard
 before update of starts_at,ends_at,event_id on public.repair_cafe_shift_slots
 for each row execute function private.repair_cafe_check_slot_timing();

-- Canonical operational ticket history also gets private audit metadata without visitor data.
create trigger rc_ticket_audit after insert or update or delete on public.repair_cafe_tickets
 for each row execute function private.repair_cafe_audit_row();
create trigger rc_station_audit after insert or update or delete on public.repair_cafe_stations
 for each row execute function private.repair_cafe_audit_row();
create trigger rc_slot_audit after insert or update or delete on public.repair_cafe_shift_slots
 for each row execute function private.repair_cafe_audit_row();
create trigger rc_assignment_audit after insert or update or delete on public.repair_cafe_shift_assignments
 for each row execute function private.repair_cafe_audit_row();

-- Soft archived session cannot be displayed publicly after a restore.
drop policy if exists "public sees published sessions only" on public.repair_cafe_sessions;
create policy "public sees published active sessions only" on public.repair_cafe_sessions
 for select to anon using(status='published' and deleted_at is null);
-- The existing authenticated policy remains for privileged restoration views.
