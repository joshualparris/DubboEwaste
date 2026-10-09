-- Repair Café monthly sessions and roster, 2026-10-09.
-- Do not treat expressions of interest as confirmed volunteers, venues or bookings.
-- All write permissions derive from authenticated programme membership.

create or replace function private.repair_cafe_can_manage()
returns boolean language sql stable security definer set search_path = ''
as $$
 select private.is_global_admin()
 or exists (
   select 1 from public.profiles p
   join public.program_access pa on pa.user_id=p.id
   where p.id=auth.uid() and p.active and pa.active
     and pa.program='repair_cafe' and pa.programme_role in ('admin','manager')
 );
$$;
revoke all on function private.repair_cafe_can_manage() from public,anon;
grant execute on function private.repair_cafe_can_manage() to authenticated;

create table public.repair_cafe_venues (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(trim(name)) between 2 and 120),
 address text not null default '' check (char_length(address)<=250),
 accessibility text not null default '' check (char_length(accessibility)<=500),
 permitted_activities text not null default '' check (char_length(permitted_activities)<=600),
 created_at timestamptz not null default now()
);
create unique index repair_cafe_venues_name_unique on public.repair_cafe_venues (lower(name));

create table public.repair_cafe_sessions (
 id uuid primary key default gen_random_uuid(),
 event_date date not null unique,
 starts_at time without time zone not null default '10:00',
 ends_at time without time zone not null default '13:00',
 title text not null default 'Repair Café Dubbo' check (char_length(title) between 3 and 150),
 focus text not null default '' check (char_length(focus)<=350),
 venue_id uuid references public.repair_cafe_venues(id) on delete set null,
 venue_status text not null default 'unknown' check (venue_status in ('unknown','offered','tentative','confirmed','declined')),
 status text not null default 'draft' check (status in ('draft','collecting','published','completed','cancelled')),
 safety_checked boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint session_hours_valid check (ends_at > starts_at),
 constraint publish_requires_confirmation check (
   status <> 'published' or (venue_id is not null and venue_status='confirmed' and safety_checked)
 )
);
create index repair_cafe_sessions_date_idx on public.repair_cafe_sessions(event_date);

create table public.repair_cafe_volunteer_profiles (
 user_id uuid primary key references public.profiles(id) on delete cascade,
 skills text[] not null default '{}'::text[] check (cardinality(skills)<=20),
 preference text not null default '' check (char_length(preference)<=240),
 updated_at timestamptz not null default now()
);

create table public.repair_cafe_availability (
 event_id uuid not null references public.repair_cafe_sessions(id) on delete cascade,
 user_id uuid not null references public.profiles(id) on delete cascade,
 response text not null check (response in ('available','maybe','unavailable')),
 note text not null default '' check (char_length(note)<=250),
 updated_at timestamptz not null default now(),
 primary key (event_id,user_id)
);
create index repair_cafe_availability_user_idx on public.repair_cafe_availability(user_id);

create table public.repair_cafe_shift_slots (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.repair_cafe_sessions(id) on delete cascade,
 role_name text not null check (char_length(trim(role_name)) between 2 and 80),
 required_count int not null default 1 check (required_count between 1 and 20),
 notes text not null default '' check (char_length(notes)<=250),
 created_at timestamptz not null default now()
);
create index repair_cafe_slots_event_idx on public.repair_cafe_shift_slots(event_id);

create table public.repair_cafe_shift_assignments (
 id uuid primary key default gen_random_uuid(),
 slot_id uuid not null references public.repair_cafe_shift_slots(id) on delete cascade,
 user_id uuid not null references public.profiles(id) on delete cascade,
 status text not null default 'offered' check (status in ('offered','confirmed','declined','withdrawn')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(slot_id,user_id)
);
create index repair_cafe_assignments_user_idx on public.repair_cafe_shift_assignments(user_id);

-- Prevent overbooking when two people accept the last seat concurrently.
create function private.repair_cafe_check_capacity()
returns trigger language plpgsql security definer set search_path=''
as $$
declare max_seats int; used_seats int;
begin
 if new.status='confirmed' then
   select required_count into max_seats from public.repair_cafe_shift_slots where id=new.slot_id for update;
   if max_seats is null then raise exception 'Unknown shift'; end if;
   select count(*) into used_seats from public.repair_cafe_shift_assignments
    where slot_id=new.slot_id and status='confirmed' and id<>new.id;
   if used_seats>=max_seats then raise exception 'This shift is already full'; end if;
 end if;
 return new;
end;
$$;
create trigger repair_cafe_assignment_capacity
 before insert or update of status,slot_id on public.repair_cafe_shift_assignments
 for each row execute function private.repair_cafe_check_capacity();

alter table public.repair_cafe_venues enable row level security;
alter table public.repair_cafe_sessions enable row level security;
alter table public.repair_cafe_volunteer_profiles enable row level security;
alter table public.repair_cafe_availability enable row level security;
alter table public.repair_cafe_shift_slots enable row level security;
alter table public.repair_cafe_shift_assignments enable row level security;

-- New Supabase projects require explicit Data API grants.
revoke all on table public.repair_cafe_venues,public.repair_cafe_sessions,
 public.repair_cafe_volunteer_profiles,public.repair_cafe_availability,
 public.repair_cafe_shift_slots,public.repair_cafe_shift_assignments from anon,authenticated;
grant select on public.repair_cafe_venues,public.repair_cafe_sessions to anon;
grant select,insert,update on public.repair_cafe_venues,public.repair_cafe_sessions to authenticated;
grant select,insert,update on public.repair_cafe_volunteer_profiles,public.repair_cafe_availability to authenticated;
grant select,insert,update,delete on public.repair_cafe_shift_slots to authenticated;
grant select,insert,delete on public.repair_cafe_shift_assignments to authenticated;
grant update(status) on public.repair_cafe_shift_assignments to authenticated;

create policy "venues visible to members or when hosting public event"
 on public.repair_cafe_venues for select to anon,authenticated
 using (
  exists(select 1 from public.repair_cafe_sessions e where e.venue_id=id and e.status='published')
  or (auth.uid() is not null and private.has_program('repair_cafe'))
 );
create policy "coordinators add venues"
 on public.repair_cafe_venues for insert to authenticated
 with check (private.repair_cafe_can_manage());
create policy "coordinators update venues"
 on public.repair_cafe_venues for update to authenticated
 using (private.repair_cafe_can_manage()) with check (private.repair_cafe_can_manage());

create policy "sessions visible to volunteers or publicly when published"
 on public.repair_cafe_sessions for select to anon,authenticated
 using (status='published' or (auth.uid() is not null and private.has_program('repair_cafe')));
create policy "coordinators create sessions"
 on public.repair_cafe_sessions for insert to authenticated
 with check (private.repair_cafe_can_manage());
create policy "coordinators update sessions"
 on public.repair_cafe_sessions for update to authenticated
 using (private.repair_cafe_can_manage()) with check (private.repair_cafe_can_manage());

create policy "volunteers or coordinators read profiles"
 on public.repair_cafe_volunteer_profiles for select to authenticated
 using (user_id=auth.uid() or private.repair_cafe_can_manage());
create policy "members create own skill profile"
 on public.repair_cafe_volunteer_profiles for insert to authenticated
 with check (user_id=auth.uid() and private.has_program('repair_cafe'));
create policy "members update own skill profile"
 on public.repair_cafe_volunteer_profiles for update to authenticated
 using (user_id=auth.uid() and private.has_program('repair_cafe'))
 with check (user_id=auth.uid() and private.has_program('repair_cafe'));

create policy "availability visible to owner and coordinators"
 on public.repair_cafe_availability for select to authenticated
 using (user_id=auth.uid() or private.repair_cafe_can_manage());
create policy "volunteers record own availability"
 on public.repair_cafe_availability for insert to authenticated
 with check (user_id=auth.uid() and private.has_program('repair_cafe'));
create policy "volunteers revise own availability"
 on public.repair_cafe_availability for update to authenticated
 using (user_id=auth.uid() and private.has_program('repair_cafe'))
 with check (user_id=auth.uid() and private.has_program('repair_cafe'));

create policy "shifts visible to repair cafe members"
 on public.repair_cafe_shift_slots for select to authenticated
 using (private.has_program('repair_cafe'));
create policy "coordinators edit shifts"
 on public.repair_cafe_shift_slots for update to authenticated
 using (private.repair_cafe_can_manage()) with check (private.repair_cafe_can_manage());
create policy "coordinators remove shifts"
 on public.repair_cafe_shift_slots for delete to authenticated
 using (private.repair_cafe_can_manage());
create policy "coordinators create shifts"
 on public.repair_cafe_shift_slots for insert to authenticated
 with check (private.repair_cafe_can_manage());

create policy "assignments visible to owner and coordinators"
 on public.repair_cafe_shift_assignments for select to authenticated
 using (user_id=auth.uid() or private.repair_cafe_can_manage());
create policy "coordinators offer shifts"
 on public.repair_cafe_shift_assignments for insert to authenticated
 with check (
  private.repair_cafe_can_manage()
  and exists(select 1 from public.program_access pa join public.profiles p on p.id=pa.user_id
   where pa.user_id=repair_cafe_shift_assignments.user_id and pa.active and p.active and pa.program='repair_cafe')
 );
create policy "volunteers respond to offered shifts"
 on public.repair_cafe_shift_assignments for update to authenticated
 using (
  private.repair_cafe_can_manage()
  or (user_id=auth.uid() and status in ('offered','confirmed'))
 )
 with check (
  private.repair_cafe_can_manage()
  or (user_id=auth.uid() and status in ('confirmed','declined','withdrawn'))
 );
create policy "coordinators remove assignments"
 on public.repair_cafe_shift_assignments for delete to authenticated
 using (private.repair_cafe_can_manage());

-- Restricted manager directory: only active RC members; no emails or contact info.
create function public.repair_cafe_roster_directory()
returns table (user_id uuid, display_name text, skills text[])
language plpgsql stable security definer set search_path=''
as $$
begin
 if auth.uid() is null or not private.repair_cafe_can_manage() then
   raise exception 'Repair Café coordinator access required' using errcode='42501';
 end if;
 return query
 select p.id,coalesce(nullif(p.full_name,''),'Volunteer')::text,
        coalesce(v.skills,'{}'::text[])
 from public.profiles p
 join public.program_access pa on pa.user_id=p.id and pa.program='repair_cafe' and pa.active
 left join public.repair_cafe_volunteer_profiles v on v.user_id=p.id
 where p.active order by p.full_name;
end;
$$;
revoke all on function public.repair_cafe_roster_directory() from public,anon;
grant execute on function public.repair_cafe_roster_directory() to authenticated;
