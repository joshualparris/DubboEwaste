-- Dubbo Circular Learning v2: self-paced media, supervisor assignments and practical sign-offs.
-- Applies alongside 019. Personal learning data is readable only by its owner
-- and by an authorised programme administrator for their programme.
create table public.learning_media_progress (
 user_id uuid not null,
 course_slug text not null,
 resource_slug text not null check (resource_slug ~ '^[a-z0-9-]{3,80}$'),
 completed_at timestamptz not null default now(),
 primary key(user_id,course_slug,resource_slug),
 foreign key(user_id,course_slug) references public.learning_enrolments(user_id,course_slug) on delete cascade
);
alter table public.learning_media_progress enable row level security;
revoke all on public.learning_media_progress from anon;
grant select,insert on public.learning_media_progress to authenticated;
create policy "learner reads own media" on public.learning_media_progress
 for select to authenticated using (user_id=(select auth.uid()));
create policy "learner records own media" on public.learning_media_progress
 for insert to authenticated with check (
 user_id=(select auth.uid())
 and exists(select 1 from public.profiles p where p.id=auth.uid() and p.active)
 and exists(select 1 from public.program_access pa where pa.user_id=auth.uid() and pa.active)
 );

create table public.learning_assignments (
 user_id uuid not null references public.profiles(id) on delete cascade,
 course_slug text not null check (course_slug ~ '^[a-z0-9-]{3,80}$'),
 programme text not null check (programme in ('dubbo_ewaste','repair_cafe','library_of_things')),
 assigned_by uuid not null references public.profiles(id),
 assigned_at timestamptz not null default now(),
 due_date date,
 primary key(user_id,course_slug,programme)
);
create index learning_assignments_programme on public.learning_assignments(programme,assigned_at desc);
alter table public.learning_assignments enable row level security;
revoke all on public.learning_assignments from anon;
grant select,insert,delete on public.learning_assignments to authenticated;
create policy "learner or programme admin reads assignments" on public.learning_assignments
 for select to authenticated using (
 user_id=(select auth.uid()) or private.is_programme_admin(programme)
 );
create policy "programme admins can assign" on public.learning_assignments
 for insert to authenticated with check (
 assigned_by=(select auth.uid()) and private.is_programme_admin(programme)
 and exists (select 1 from public.program_access pa where pa.user_id=learning_assignments.user_id and pa.program=learning_assignments.programme and pa.active)
 );
create policy "programme admins can unassign" on public.learning_assignments
 for delete to authenticated using (private.is_programme_admin(programme));

create table public.learning_practical_submissions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id) on delete cascade,
 course_slug text not null check (course_slug ~ '^[a-z0-9-]{3,80}$'),
 programme text not null check (programme in ('dubbo_ewaste','repair_cafe','library_of_things')),
 reflection text not null check (char_length(trim(reflection)) between 30 and 3000),
 submitted_at timestamptz not null default now(),
 status text not null default 'submitted' check (status in ('submitted','approved','changes_requested')),
 reviewer_id uuid references public.profiles(id),
 reviewed_at timestamptz,
 feedback text check (feedback is null or char_length(feedback) <= 2000),
 directly_observed boolean not null default false,
 foreign key(user_id,course_slug) references public.learning_enrolments(user_id,course_slug) on delete cascade,
 constraint reviewed_consistency check (
    (status='submitted' and reviewer_id is null and reviewed_at is null and feedback is null and not directly_observed)
    or (status='changes_requested' and reviewer_id is not null and reviewed_at is not null and char_length(coalesce(trim(feedback),'')) >= 10)
    or (status='approved' and reviewer_id is not null and reviewed_at is not null and directly_observed and reviewer_id<>user_id)
 )
);
create index learning_practical_by_programme on public.learning_practical_submissions(programme,status,submitted_at);
create index learning_practical_by_learner on public.learning_practical_submissions(user_id,course_slug,submitted_at desc);
alter table public.learning_practical_submissions enable row level security;
revoke all on public.learning_practical_submissions from anon,authenticated;
grant select,insert on public.learning_practical_submissions to authenticated;
grant update (status,reviewer_id,reviewed_at,feedback,directly_observed) on public.learning_practical_submissions to authenticated;
create policy "learner or programme admin views practical submissions" on public.learning_practical_submissions
 for select to authenticated using (
 user_id=(select auth.uid()) or private.is_programme_admin(programme)
 );
create policy "learner submits own enrolled practice" on public.learning_practical_submissions
 for insert to authenticated with check (
 user_id=(select auth.uid()) and status='submitted'
 and reviewer_id is null and reviewed_at is null and feedback is null and not directly_observed
 and exists(select 1 from public.profiles p where p.id=auth.uid() and p.active)
 and exists(select 1 from public.program_access pa where pa.user_id=auth.uid() and pa.program=learning_practical_submissions.programme and pa.active)
 );
create policy "programme admin reviews practice" on public.learning_practical_submissions
 for update to authenticated using (private.is_programme_admin(programme))
 with check (private.is_programme_admin(programme) and reviewer_id=auth.uid() and reviewer_id<>user_id and status in ('approved','changes_requested'));

-- A globally authorised admin can generate the Library of Things signup code
-- without a plaintext value stored in Git, logs, database or URL.
-- The random code is returned once by RPC to that admin, who must store it securely.
create or replace function public.issue_library_signup_code()
returns text language plpgsql security definer set search_path='' as $$
declare generated text;
begin
 if not private.is_global_admin() then raise exception 'Not authorised' using errcode='42501'; end if;
 generated := encode(extensions.gen_random_bytes(24),'hex');
 insert into private.signup_access_codes(program,access_code_sha256,active,updated_at)
 values('library_of_things',encode(extensions.digest(generated,'sha256'),'hex'),true,now())
 on conflict(program) do update set access_code_sha256=excluded.access_code_sha256,active=true,updated_at=now();
 return generated;
end $$;
revoke all on function public.issue_library_signup_code() from public,anon,authenticated;
grant execute on function public.issue_library_signup_code() to authenticated;
