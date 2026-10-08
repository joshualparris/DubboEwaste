-- Circular Learning: enrolled courses and learner-owned progress.
-- Public course descriptions and lesson content remain versioned in application code.
-- No badges here should be interpreted as externally accredited qualifications.
-- This migration extends program access; it does not create or reveal any plaintext access codes.

alter table public.program_access
  drop constraint if exists program_access_program_check;
alter table public.program_access
  add constraint program_access_program_check
  check (program in ('dubbo_ewaste','repair_cafe','library_of_things'));

alter table private.signup_access_codes
  drop constraint if exists signup_access_codes_program_check;
alter table private.signup_access_codes
  add constraint signup_access_codes_program_check
  check (program in ('dubbo_ewaste','repair_cafe','library_of_things'));

-- Existing signup trigger already checks the access code against server-side SHA256.
-- Extend the role and membership assignment to the new Library of Things programme.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  authorized boolean;
  signup_program text;
  assigned_role public.staff_role;
begin
  authorized := coalesce((new.raw_user_meta_data ->> 'signup_authorized')::boolean, false);
  signup_program := new.raw_user_meta_data ->> 'signup_program';

  assigned_role := case
    when authorized and signup_program = 'repair_cafe'
      then 'repair_volunteer'::public.staff_role
    else 'volunteer'::public.staff_role
  end;

  insert into public.profiles(id, full_name, email, role, active)
  values (
    new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email, assigned_role, authorized
  )
  on conflict (id) do update
  set full_name = excluded.full_name, email = excluded.email,
      role = excluded.role, active = excluded.active;

  if authorized and signup_program in ('dubbo_ewaste','repair_cafe','library_of_things') then
    insert into public.program_access(user_id,program)
    values (new.id,signup_program)
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create table if not exists public.learning_enrolments (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_slug text not null check (course_slug ~ '^[a-z0-9-]{3,80}$'),
  enrolled_at timestamptz not null default now(),
  primary key (user_id, course_slug)
);
create table if not exists public.learning_progress (
  user_id uuid not null,
  course_slug text not null,
  lesson_slug text not null check (lesson_slug ~ '^lesson-[1-9][0-9]{0,2}$'),
  completed_at timestamptz not null default now(),
  primary key (user_id, course_slug, lesson_slug),
  foreign key (user_id, course_slug)
    references public.learning_enrolments(user_id, course_slug)
    on delete cascade
);
create index if not exists learning_enrolments_by_course on public.learning_enrolments(course_slug);
create index if not exists learning_progress_by_course on public.learning_progress(course_slug);

alter table public.learning_enrolments enable row level security;
alter table public.learning_progress enable row level security;
revoke all on public.learning_enrolments, public.learning_progress from anon;
grant select, insert, delete on public.learning_enrolments to authenticated;
grant select, insert on public.learning_progress to authenticated;

-- Reading someone else's progress is denied, including to unrelated volunteers.
create policy "read own learning enrolments"
  on public.learning_enrolments for select to authenticated
  using (user_id = (select auth.uid()));
create policy "enrol active programme members"
  on public.learning_enrolments for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p where p.id = (select auth.uid())
        and p.active = true
    )
    and exists (
      select 1 from public.program_access pa
      where pa.user_id = (select auth.uid())
    )
  );
create policy "leave own course"
  on public.learning_enrolments for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "read own learning progress"
  on public.learning_progress for select to authenticated
  using (user_id = (select auth.uid()));
create policy "record own enrolled lesson"
  on public.learning_progress for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p where p.id = (select auth.uid())
        and p.active = true
    )
    and exists (
      select 1 from public.program_access pa
      where pa.user_id = (select auth.uid())
    )
  );
