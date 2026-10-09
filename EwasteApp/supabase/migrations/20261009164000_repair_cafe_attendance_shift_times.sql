-- Day-of-event volunteer attendance and real shift times.
-- Attendance is internal; no payroll claims. Time is local at the Dubbo venue.

create table public.repair_cafe_attendance (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.repair_cafe_sessions(id) on delete restrict,
 user_id uuid references public.profiles(id) on delete restrict,
 manual_volunteer_id uuid references public.repair_cafe_manual_volunteers(id) on delete restrict,
 checked_in_at timestamptz not null default now(),
 checked_out_at timestamptz,
 noted_by uuid not null references public.profiles(id),
 updated_at timestamptz not null default now(),
 constraint one_attendee_identity check((user_id is not null) <> (manual_volunteer_id is not null)),
 constraint attendance_end_after_start check(checked_out_at is null or checked_out_at>=checked_in_at)
);
create unique index repair_cafe_attendance_account_unique on public.repair_cafe_attendance(event_id,user_id)
 where user_id is not null;
create unique index repair_cafe_attendance_manual_unique on public.repair_cafe_attendance(event_id,manual_volunteer_id)
 where manual_volunteer_id is not null;
create index repair_cafe_attendance_event_idx on public.repair_cafe_attendance(event_id,checked_in_at);

alter table public.repair_cafe_attendance enable row level security;
revoke all on public.repair_cafe_attendance from public,anon,authenticated;
grant select,insert,update,delete on public.repair_cafe_attendance to authenticated;
create policy "coordinators or attendee view checkin"
 on public.repair_cafe_attendance for select to authenticated
 using(private.repair_cafe_can_manage() or user_id=auth.uid());
create policy "coordinators check volunteer in"
 on public.repair_cafe_attendance for insert to authenticated
 with check(private.repair_cafe_can_manage());
create policy "coordinators check volunteer out"
 on public.repair_cafe_attendance for update to authenticated
 using(private.repair_cafe_can_manage()) with check(private.repair_cafe_can_manage());
create policy "coordinators correct attendance"
 on public.repair_cafe_attendance for delete to authenticated
 using(private.repair_cafe_can_manage());

create function private.repair_cafe_attendance_protect_identity()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 if (new.event_id,new.user_id,new.manual_volunteer_id,new.checked_in_at) is distinct from
    (old.event_id,old.user_id,old.manual_volunteer_id,old.checked_in_at) then
    raise exception 'Volunteer attendance identity and arrival cannot be reassigned';
 end if;
 return new;
end
$$;
create trigger repair_cafe_attendance_identity_guard
 before update on public.repair_cafe_attendance for each row
 execute function private.repair_cafe_attendance_protect_identity();

alter table public.repair_cafe_shift_slots
 add column shift_start time without time zone,
 add column shift_end time without time zone,
 add constraint repair_cafe_slot_time_pair check(
  (shift_start is null and shift_end is null)
  or (shift_start is not null and shift_end is not null and shift_end>shift_start)
 );

create function private.repair_cafe_validate_slot_time()
returns trigger language plpgsql security definer set search_path=''
as $$
declare e_start time; e_end time;
begin
 if new.shift_start is not null then
  select starts_at,ends_at into e_start,e_end from public.repair_cafe_sessions where id=new.event_id;
  -- Allow up to 2h early setup and 2h pack down relative to public opening.
  if new.shift_start < e_start-interval '2 hours' or new.shift_end > e_end+interval '2 hours' then
   raise exception 'Volunteer shifts must remain within two hours either side of public opening';
  end if;
 end if;
 if tg_op='UPDATE' and new.event_id<>old.event_id then
  raise exception 'Shift position cannot move to a different event';
 end if;
 return new;
end
$$;
create trigger repair_cafe_shift_hours_guard before insert or update
 on public.repair_cafe_shift_slots for each row execute function private.repair_cafe_validate_slot_time();

-- Protect overlapping confirmed shifts for the same volunteer on the same date.
create function private.repair_cafe_prevent_shift_overlap()
returns trigger language plpgsql security definer set search_path=''
as $$
declare mydate date; mystart time; myend time; person_key text;
begin
 if new.status<>'confirmed' then return new; end if;
 person_key:=coalesce(new.user_id::text,new.manual_volunteer_id::text);
 perform pg_advisory_xact_lock(hashtext('repair_cafe_shift_person'),hashtext(person_key));
 select e.event_date,coalesce(s.shift_start,e.starts_at),coalesce(s.shift_end,e.ends_at)
 into mydate,mystart,myend from public.repair_cafe_shift_slots s
 join public.repair_cafe_sessions e on e.id=s.event_id where s.id=new.slot_id;
 if exists(
  select 1 from public.repair_cafe_shift_assignments a
   join public.repair_cafe_shift_slots s on s.id=a.slot_id
   join public.repair_cafe_sessions e on e.id=s.event_id
  where a.id<>new.id and a.status='confirmed'
   and (
     (new.user_id is not null and a.user_id=new.user_id) or
     (new.manual_volunteer_id is not null and a.manual_volunteer_id=new.manual_volunteer_id)
   )
   and e.event_date=mydate
   and coalesce(s.shift_start,e.starts_at)<myend
   and coalesce(s.shift_end,e.ends_at)>mystart
 ) then raise exception 'Volunteer is already confirmed for an overlapping shift'; end if;
 return new;
end
$$;
create trigger repair_cafe_shift_overlap_guard before insert or update of status,slot_id
 on public.repair_cafe_shift_assignments
 for each row execute function private.repair_cafe_prevent_shift_overlap();
