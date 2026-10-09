-- Repair Cafe session-management expansion: manual volunteer records + secure CRUD.
-- Does not create auth users or convert public feedback into volunteers.
-- Apply after repair_cafe_sessions_rosters and repair_cafe_publish_safety.

create table public.repair_cafe_manual_volunteers (
 id uuid primary key default gen_random_uuid(),
 full_name text not null check (char_length(trim(full_name)) between 2 and 120),
 email text not null default '' check (char_length(email)<=254),
 phone text not null default '' check (char_length(phone)<=40),
 skills text[] not null default '{}'::text[] check (cardinality(skills)<=20),
 notes text not null default '' check (char_length(notes)<=500),
 contact_consent boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint manual_volunteer_contact_consent check
   ((email='' and phone='') or contact_consent)
);
create unique index repair_cafe_manual_volunteer_email_unique
 on public.repair_cafe_manual_volunteers(lower(email)) where email<>'';
create index repair_cafe_manual_volunteer_name_idx
 on public.repair_cafe_manual_volunteers(full_name);

create table public.repair_cafe_manual_availability (
 event_id uuid not null references public.repair_cafe_sessions(id) on delete cascade,
 manual_volunteer_id uuid not null references public.repair_cafe_manual_volunteers(id) on delete cascade,
 response text not null check (response in ('available','maybe','unavailable')),
 note text not null default '' check(char_length(note)<=250),
 updated_at timestamptz not null default now(),
 primary key(event_id,manual_volunteer_id)
);
create index repair_cafe_manual_availability_person_idx
 on public.repair_cafe_manual_availability(manual_volunteer_id);

alter table public.repair_cafe_shift_assignments
 alter column user_id drop not null;
alter table public.repair_cafe_shift_assignments
 add column manual_volunteer_id uuid
 references public.repair_cafe_manual_volunteers(id) on delete cascade;
alter table public.repair_cafe_shift_assignments
 add constraint repair_cafe_one_volunteer_per_shift
 check ((user_id is not null) <> (manual_volunteer_id is not null));
create unique index repair_cafe_manual_shift_unique
 on public.repair_cafe_shift_assignments(slot_id,manual_volunteer_id)
 where manual_volunteer_id is not null;

-- Data API access is explicit and every new table has RLS.
alter table public.repair_cafe_manual_volunteers enable row level security;
alter table public.repair_cafe_manual_availability enable row level security;
revoke all on public.repair_cafe_manual_volunteers,public.repair_cafe_manual_availability
 from anon,authenticated;
grant select,insert,update,delete on public.repair_cafe_manual_volunteers,
 public.repair_cafe_manual_availability to authenticated;

create policy "coordinators read manually entered volunteers"
 on public.repair_cafe_manual_volunteers for select to authenticated
 using(private.repair_cafe_can_manage());
create policy "coordinators add manually entered volunteers"
 on public.repair_cafe_manual_volunteers for insert to authenticated
 with check(private.repair_cafe_can_manage());
create policy "coordinators edit manually entered volunteers"
 on public.repair_cafe_manual_volunteers for update to authenticated
 using(private.repair_cafe_can_manage())
 with check(private.repair_cafe_can_manage());
create policy "coordinators delete manually entered volunteers"
 on public.repair_cafe_manual_volunteers for delete to authenticated
 using(private.repair_cafe_can_manage());

create policy "coordinators read manual availability"
 on public.repair_cafe_manual_availability for select to authenticated
 using(private.repair_cafe_can_manage());
create policy "coordinators add manual availability"
 on public.repair_cafe_manual_availability for insert to authenticated
 with check(private.repair_cafe_can_manage());
create policy "coordinators change manual availability"
 on public.repair_cafe_manual_availability for update to authenticated
 using(private.repair_cafe_can_manage())
 with check(private.repair_cafe_can_manage());
create policy "coordinators delete manual availability"
 on public.repair_cafe_manual_availability for delete to authenticated
 using(private.repair_cafe_can_manage());

-- Coordinator CRUD on sessions, venues, positions, volunteer profile and availability.
grant delete on public.repair_cafe_sessions,public.repair_cafe_venues,
 public.repair_cafe_volunteer_profiles,public.repair_cafe_availability to authenticated;
create policy "coordinators delete unpublished sessions"
 on public.repair_cafe_sessions for delete to authenticated
 using (private.repair_cafe_can_manage() and status<>'published');
create policy "coordinators delete unlinked venues"
 on public.repair_cafe_venues for delete to authenticated
 using (private.repair_cafe_can_manage() and not exists (
  select 1 from public.repair_cafe_sessions s where s.venue_id=id
 ));
create policy "coordinators remove volunteer skill record"
 on public.repair_cafe_volunteer_profiles for delete to authenticated
 using(private.repair_cafe_can_manage());
create policy "coordinators delete recorded availability"
 on public.repair_cafe_availability for delete to authenticated
 using(private.repair_cafe_can_manage());
-- Coordinator may record availability after speaking to an existing logged-in volunteer.
create policy "coordinators add recorded availability"
 on public.repair_cafe_availability for insert to authenticated
 with check(
  private.repair_cafe_can_manage() and
  exists(select 1 from public.program_access pa join public.profiles p on p.id=pa.user_id
   where pa.user_id=repair_cafe_availability.user_id
    and pa.program='repair_cafe' and pa.active and p.active)
 );
create policy "coordinators correct availability"
 on public.repair_cafe_availability for update to authenticated
 using(private.repair_cafe_can_manage())
 with check(private.repair_cafe_can_manage());

-- Prevent changing the identity of an existing availability entry.
create function private.repair_cafe_availability_identity()
returns trigger language plpgsql set search_path=''
as $$
begin
 if (new.event_id,new.user_id) is distinct from (old.event_id,old.user_id)
 then raise exception 'Availability identity cannot be changed'; end if;
 return new;
end
$$;
create trigger repair_cafe_availability_identity_guard
 before update on public.repair_cafe_availability for each row
 execute function private.repair_cafe_availability_identity();

-- Existing coordinator insert policy required an auth account. Allow a manual
-- participant instead, but NEVER give manual volunteers access to logged-in APIs.
drop policy if exists "coordinators offer shifts" on public.repair_cafe_shift_assignments;
create policy "coordinators offer shifts"
 on public.repair_cafe_shift_assignments for insert to authenticated
 with check (
  private.repair_cafe_can_manage()
  and (
   (user_id is not null and manual_volunteer_id is null
    and exists(select 1 from public.program_access pa join public.profiles p on p.id=pa.user_id
     where pa.user_id=repair_cafe_shift_assignments.user_id
      and pa.program='repair_cafe' and pa.active and p.active))
   or (user_id is null and manual_volunteer_id is not null
       and exists(select 1 from public.repair_cafe_manual_volunteers mv
        where mv.id=manual_volunteer_id))
  )
 );
-- Existing SELECT/UPDATE/DELETE policies already permit coordinators,
-- and allow logged-in volunteers to act on their own user_id only.

-- Manager can edit required positions; modification of an already published
-- event automatically unpublishes via the existing slots/coverage triggers.
create or replace function private.repair_cafe_validate_slot_capacity()
returns trigger language plpgsql security definer set search_path=''
as $$
declare used int;
begin
 select count(*) into used
 from public.repair_cafe_shift_assignments a
 where a.slot_id=new.id and a.status='confirmed';
 if new.required_count<used then
  raise exception 'Required places cannot be less than already confirmed volunteers';
 end if;
 return new;
end;
$$;
create trigger repair_cafe_slot_capacity_guard
 before update of required_count on public.repair_cafe_shift_slots
 for each row execute function private.repair_cafe_validate_slot_capacity();
