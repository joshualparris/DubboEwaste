create or replace function private.programme_visible(pr text,t text) returns boolean language sql stable security definer set search_path='' as $$
 select private.has_program(pr) and (private.selected_programme()=pr or (private.is_global_admin() and private.selected_programme() is null))
 and (private.is_global_admin() and private.selected_programme() is null or private.programme_table_allowed(t,pr))
$$;
-- Global permission templates and global profiles cannot be changed by a programme admin.
do $$ declare t text; begin
 foreach t in array array['permission_targets','role_table_permissions','user_table_permission_overrides'] loop
  execute format('create policy "global administration only" on public.%I as restrictive for all to authenticated using (private.is_global_admin()) with check (private.is_global_admin())',t);
 end loop;
end $$;
drop policy if exists "admins manage profiles" on public.profiles;
create policy "global admins manage profiles" on public.profiles for update to authenticated using(private.is_global_admin()) with check(private.is_global_admin());
drop policy if exists "staff can read own profile or managers can read all" on public.profiles;
create policy "programme staff directory" on public.profiles for select to authenticated using(id=auth.uid() or private.is_global_admin() or exists(select 1 from public.program_access pa where pa.user_id=profiles.id and private.is_programme_admin(pa.program)));
alter table public.program_access enable row level security;
grant select,insert,update,delete on public.program_access to authenticated;
do $$ declare c record; begin for c in select policyname from pg_policies where schemaname='public' and tablename='program_access' loop execute format('drop policy %I on public.program_access',c.policyname); end loop; end $$;
create policy "read programme memberships" on public.program_access for select to authenticated using(user_id=auth.uid() or private.is_programme_admin(program));
-- Membership mutations use the checked RPC below. Direct self promotion is never allowed.

create table public.item_loans(
 id uuid primary key default gen_random_uuid(), asset_id uuid not null references public.assets(id),
 borrower_id uuid not null references public.customers(id), checked_out_at timestamptz not null default now(),
 due_at timestamptz not null, returned_at timestamptz, condition_out text not null, condition_in text,
 notes text, created_by uuid not null references public.profiles(id), created_at timestamptz not null default now(),
 check(due_at>=checked_out_at), check(returned_at is null or returned_at>=checked_out_at)
);
create unique index item_loans_one_open_per_asset on public.item_loans(asset_id) where returned_at is null;
alter table public.item_loans enable row level security;
grant select,insert,update on public.item_loans to authenticated;
create policy "staff read loans" on public.item_loans for select to authenticated using(private.is_active_staff());
create policy "staff create loans" on public.item_loans for insert to authenticated with check(private.current_staff_role()::text in ('admin','manager','technician','volunteer') and created_by=auth.uid());
create policy "staff return loans" on public.item_loans for update to authenticated using(private.current_staff_role()::text in ('admin','manager','technician','volunteer')) with check(private.current_staff_role()::text in ('admin','manager','technician','volunteer'));

create table private.programme_tables(table_name text primary key);
insert into private.programme_tables select tablename from pg_tables where schemaname='public' and tablename not in ('profiles','program_access','permission_targets','role_table_permissions','user_table_permission_overrides','model_support','public_certificate_verification','learning_enrolments','learning_progress');
revoke all on private.programme_tables from public,anon,authenticated;
