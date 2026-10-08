-- Separate programme access for DubboEwaste and Repair Cafe Dubbo.
-- Existing DubboEwaste signup code is copied without exposing plaintext.
-- The Repair Cafe code hash is installed directly in the live Supabase
-- environment and is intentionally not committed to Git.

create table if not exists private.signup_access_codes (
  program text primary key check (program in ('dubbo_ewaste','repair_cafe')),
  access_code_sha256 text not null unique,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

revoke all on table private.signup_access_codes from public, anon, authenticated;

insert into private.signup_access_codes(program,access_code_sha256,active,updated_at)
select 'dubbo_ewaste', access_code_sha256, true, updated_at
from private.signup_config
where singleton = true
on conflict (program) do update
set access_code_sha256 = excluded.access_code_sha256,
    active = true,
    updated_at = excluded.updated_at;

create table if not exists public.program_access (
  user_id uuid not null references public.profiles(id) on delete cascade,
  program text not null check (program in ('dubbo_ewaste','repair_cafe')),
  granted_at timestamptz not null default now(),
  granted_by uuid references public.profiles(id),
  primary key (user_id, program)
);

alter table public.program_access enable row level security;

grant select,insert,delete on public.program_access to authenticated;

drop policy if exists "users read own program access" on public.program_access;
create policy "users read own program access"
on public.program_access for select
to authenticated
using (
  user_id = (select auth.uid())
  or private.current_staff_role() in ('admin','manager')
);

drop policy if exists "admins managers grant program access" on public.program_access;
create policy "admins managers grant program access"
on public.program_access for insert
to authenticated
with check (
  private.current_staff_role() in ('admin','manager')
);

drop policy if exists "admins managers revoke program access" on public.program_access;
create policy "admins managers revoke program access"
on public.program_access for delete
to authenticated
using (
  private.current_staff_role() in ('admin','manager')
);

-- Existing active accounts are DubboEwaste accounts.
insert into public.program_access(user_id,program)
select id,'dubbo_ewaste'
from public.profiles
where active = true
on conflict do nothing;

-- Managers/admins need both areas.
insert into public.program_access(user_id,program)
select id,'repair_cafe'
from public.profiles
where active = true
  and role in ('admin','manager')
on conflict do nothing;

create or replace function private.has_program(target_program text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(
    select 1
    from public.profiles p
    join public.program_access pa on pa.user_id = p.id
    where p.id = auth.uid()
      and p.active = true
      and pa.program = target_program
  )
$$;

revoke all on function private.has_program(text) from public;
grant execute on function private.has_program(text) to authenticated;

-- "Active staff" now means active DubboEwaste staff/volunteer.
-- Repair Cafe-only accounts must not inherit old operational read policies.
create or replace function private.is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(
    select 1
    from public.profiles p
    join public.program_access pa on pa.user_id = p.id
    where p.id = auth.uid()
      and p.active = true
      and pa.program = 'dubbo_ewaste'
  )
$$;

-- Permission-table access is also explicitly scoped to DubboEwaste.
create or replace function private.has_table_permission(target_table text, action_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid;
  staff_role public.staff_role;
  active_staff boolean;
  has_ewaste_access boolean;
  override_value boolean;
  role_value boolean;
begin
  uid := auth.uid();
  if uid is null then
    return false;
  end if;

  select p.role, p.active,
         exists(
           select 1 from public.program_access pa
           where pa.user_id = p.id and pa.program = 'dubbo_ewaste'
         )
    into staff_role, active_staff, has_ewaste_access
  from public.profiles p
  where p.id = uid;

  if coalesce(active_staff, false) is not true
     or coalesce(has_ewaste_access, false) is not true then
    return false;
  end if;

  select case action_name
    when 'create' then u.can_create
    when 'read' then u.can_read
    when 'update' then u.can_update
    when 'delete' then u.can_delete
    else null
  end
  into override_value
  from public.user_table_permission_overrides u
  where u.user_id = uid
    and u.table_name = target_table;

  if found and override_value is not null then
    return override_value;
  end if;

  select case action_name
    when 'create' then r.can_create
    when 'read' then r.can_read
    when 'update' then r.can_update
    when 'delete' then r.can_delete
    else false
  end
  into role_value
  from public.role_table_permissions r
  where r.role = staff_role
    and r.table_name = target_table;

  return coalesce(role_value, false);
end;
$$;

-- Match either access-code hash. The plaintext code is removed before the
-- auth.users row is stored.
create or replace function private.authorize_signup()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  submitted_code text;
  submitted_digest text;
  matched_program text;
  meta jsonb;
begin
  meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  submitted_code := coalesce(meta ->> 'signup_access_code', '');

  submitted_digest := case
    when submitted_code = '' then ''
    else encode(extensions.digest(submitted_code, 'sha256'), 'hex')
  end;

  select program
  into matched_program
  from private.signup_access_codes
  where active = true
    and access_code_sha256 = submitted_digest
  limit 1;

  meta := meta
    - 'signup_access_code'
    - 'signup_authorized'
    - 'signup_program';

  if submitted_digest = '' or matched_program is null then
    raise exception 'Invalid volunteer signup access code'
      using errcode = '28000';
  end if;

  new.raw_user_meta_data :=
    meta || jsonb_build_object(
      'signup_authorized', true,
      'signup_program', matched_program
    );

  return new;
end;
$$;

-- New users receive a role and programme based on the verified code.
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
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email,
    assigned_role,
    authorized
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      role = excluded.role,
      active = excluded.active;

  if authorized and signup_program in ('dubbo_ewaste','repair_cafe') then
    insert into public.program_access(user_id,program)
    values (new.id,signup_program)
    on conflict do nothing;
  end if;

  return new;
end;
$$;
