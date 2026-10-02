-- Admin CRUD and permission management.
-- Applied to the live DubboEwaste Supabase project on 2 Oct 2026.
-- Individual overrides take precedence over role permissions.
-- Permission-management tables remain admin-only to prevent lockout.

alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id
  and p.email is distinct from u.email;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles(id, full_name, email, role, active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email,
    'volunteer'::public.staff_role,
    coalesce((new.raw_user_meta_data ->> 'signup_authorized')::boolean, false)
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email;
  return new;
end;
$$;

create or replace function private.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email = new.email,
      updated_at = now()
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists sync_profile_email_after_update on auth.users;
create trigger sync_profile_email_after_update
after update of email on auth.users
for each row
when (old.email is distinct from new.email)
execute function private.sync_profile_email();

create table if not exists public.permission_targets (
  table_name text primary key,
  label text not null,
  category text not null default 'Operations',
  mutable boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.role_table_permissions (
  role public.staff_role not null,
  table_name text not null references public.permission_targets(table_name) on delete cascade,
  can_create boolean not null default false,
  can_read boolean not null default false,
  can_update boolean not null default false,
  can_delete boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (role, table_name)
);

create table if not exists public.user_table_permission_overrides (
  user_id uuid not null references public.profiles(id) on delete cascade,
  table_name text not null references public.permission_targets(table_name) on delete cascade,
  can_create boolean,
  can_read boolean,
  can_update boolean,
  can_delete boolean,
  updated_at timestamptz not null default now(),
  primary key (user_id, table_name)
);

alter table public.permission_targets enable row level security;
alter table public.role_table_permissions enable row level security;
alter table public.user_table_permission_overrides enable row level security;

grant select,insert,update,delete on public.permission_targets to authenticated;
grant select,insert,update,delete on public.role_table_permissions to authenticated;
grant select,insert,update,delete on public.user_table_permission_overrides to authenticated;

drop policy if exists "admins manage permission targets" on public.permission_targets;
create policy "admins manage permission targets"
on public.permission_targets for all to authenticated
using ((select private.current_staff_role()) = 'admin'::public.staff_role)
with check ((select private.current_staff_role()) = 'admin'::public.staff_role);

drop policy if exists "admins manage role permissions" on public.role_table_permissions;
create policy "admins manage role permissions"
on public.role_table_permissions for all to authenticated
using ((select private.current_staff_role()) = 'admin'::public.staff_role)
with check ((select private.current_staff_role()) = 'admin'::public.staff_role);

drop policy if exists "admins manage user permission overrides" on public.user_table_permission_overrides;
create policy "admins manage user permission overrides"
on public.user_table_permission_overrides for all to authenticated
using ((select private.current_staff_role()) = 'admin'::public.staff_role)
with check ((select private.current_staff_role()) = 'admin'::public.staff_role);

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
  override_value boolean;
  role_value boolean;
begin
  uid := auth.uid();
  if uid is null then return false; end if;

  select p.role, p.active
  into staff_role, active_staff
  from public.profiles p
  where p.id = uid;

  if coalesce(active_staff, false) is not true then
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

revoke all on function private.has_table_permission(text,text) from public;
grant execute on function private.has_table_permission(text,text) to authenticated;

insert into public.permission_targets(table_name,label,category,mutable) values
('api_tokens','API tokens','Integrations',true),
('asset_attributes','Asset attributes','Assets',true),
('asset_defects','Asset defects','Assets',true),
('asset_tests','Asset tests','Assets',true),
('assets','Assets','Assets',true),
('customers','Customers & sources','Core',true),
('defect_templates','Defect templates','Reference',true),
('dispositions','Dispositions','Assets',true),
('downstream_vendors','Downstream vendors','Recycling',true),
('environmental_methodologies','Environmental methodologies','Recycling',true),
('exceptions','Exceptions','Operations',true),
('grades','Asset grades','Assets',true),
('jobs','Jobs','Core',true),
('locations','Locations','Core',true),
('lot_adjustments','Lot adjustments','Lots',true),
('lot_relationships','Lot relationships','Lots',true),
('lots','Lots','Lots',true),
('market_observations','Market observations','Resale',true),
('media','Media / data-bearing devices','Sanitisation',true),
('model_support','Model catalogue','Reference',true),
('outbound_contents','Outbound contents','Recycling',true),
('outbound_orders','Outbound orders','Recycling',true),
('pallet_contents','Pallet contents','Lots',true),
('pallets','Pallets','Lots',true),
('parts','Parts inventory','Assets',true),
('pricing_rules','Pricing rules','Resale',true),
('repairs','Repairs','Assets',true),
('resale_listings','Resale listings','Resale',true),
('returns_rma','Returns / RMA','Resale',true),
('sales','Sales','Resale',true),
('sanitisation_policies','Sanitisation policies','Sanitisation',true),
('sanitisation_tasks','Sanitisation tasks','Sanitisation',true),
('settlements','Settlements','Finance',true),
('webhooks','Webhooks','Integrations',true),
('workflow_rules','Workflow rules','Configuration',true),
('workstations','Workstations','Configuration',true),
('asset_events','Asset audit events','Audit',false),
('certificates','Certificates','Audit',false),
('evidence','Evidence','Audit',false),
('lookup_events','Lookup audit events','Audit',false),
('operational_events','Operational audit events','Audit',false),
('public_certificate_verification','Public certificate verification','Audit',false)
on conflict (table_name) do update
set label=excluded.label, category=excluded.category, mutable=excluded.mutable;

insert into public.role_table_permissions(role,table_name,can_create,can_read,can_update,can_delete)
select r.role, t.table_name,
  case
    when r.role='admin' and t.mutable then true
    when r.role='manager' and t.mutable and t.category <> 'Integrations' then true
    when r.role='technician' and t.mutable and t.category in ('Assets','Core','Operations','Lots','Sanitisation','Resale','Recycling') then true
    when r.role='volunteer' and t.table_name in (
      'asset_attributes','asset_defects','asset_tests','assets','customers','exceptions',
      'jobs','locations','lot_adjustments','lot_relationships','lots','market_observations',
      'media','pallet_contents','pallets','repairs','sanitisation_tasks'
    ) then true
    else false
  end,
  case
    when t.table_name in ('api_tokens','webhooks') then r.role in ('admin','manager')
    else true
  end,
  case
    when r.role='admin' and t.mutable then true
    when r.role='manager' and t.mutable and t.category <> 'Integrations' then true
    when r.role='technician' and t.mutable and t.category in ('Assets','Core','Operations','Lots','Sanitisation','Resale','Recycling') then true
    when r.role='volunteer' and t.table_name in (
      'asset_defects','assets','customers','exceptions','jobs','locations',
      'lot_adjustments','lots','market_observations','media','pallet_contents',
      'pallets','repairs','sanitisation_tasks'
    ) then true
    else false
  end,
  case when r.role='admin' and t.mutable then true else false end
from (values
  ('admin'::public.staff_role),
  ('manager'::public.staff_role),
  ('technician'::public.staff_role),
  ('volunteer'::public.staff_role),
  ('auditor'::public.staff_role)
) r(role)
cross join public.permission_targets t
on conflict (role,table_name) do update
set can_create=excluded.can_create,
    can_read=excluded.can_read,
    can_update=excluded.can_update,
    can_delete=excluded.can_delete,
    updated_at=now();

do $$
declare
  t record;
begin
  for t in select table_name from public.permission_targets where mutable=true loop
    execute format('drop policy if exists %I on public.%I','admins full crud',t.table_name);
    execute format('drop policy if exists %I on public.%I','permission base select',t.table_name);
    execute format('drop policy if exists %I on public.%I','permission base insert',t.table_name);
    execute format('drop policy if exists %I on public.%I','permission base update',t.table_name);
    execute format('drop policy if exists %I on public.%I','permission base delete',t.table_name);
    execute format('drop policy if exists %I on public.%I','permission gate select',t.table_name);
    execute format('drop policy if exists %I on public.%I','permission gate insert',t.table_name);
    execute format('drop policy if exists %I on public.%I','permission gate update',t.table_name);
    execute format('drop policy if exists %I on public.%I','permission gate delete',t.table_name);

    execute format('create policy %I on public.%I for select to authenticated using ((select private.is_active_staff()))','permission base select',t.table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select private.is_active_staff()))','permission base insert',t.table_name);
    execute format('create policy %I on public.%I for update to authenticated using ((select private.is_active_staff())) with check ((select private.is_active_staff()))','permission base update',t.table_name);
    execute format('create policy %I on public.%I for delete to authenticated using ((select private.is_active_staff()))','permission base delete',t.table_name);

    execute format('create policy %I on public.%I as restrictive for select to authenticated using ((select private.has_table_permission(%L,%L)))','permission gate select',t.table_name,t.table_name,'read');
    execute format('create policy %I on public.%I as restrictive for insert to authenticated with check ((select private.has_table_permission(%L,%L)))','permission gate insert',t.table_name,t.table_name,'create');
    execute format('create policy %I on public.%I as restrictive for update to authenticated using ((select private.has_table_permission(%L,%L))) with check ((select private.has_table_permission(%L,%L)))','permission gate update',t.table_name,t.table_name,'update',t.table_name,'update');
    execute format('create policy %I on public.%I as restrictive for delete to authenticated using ((select private.has_table_permission(%L,%L)))','permission gate delete',t.table_name,t.table_name,'delete');
  end loop;
end $$;

do $$
declare
  t record;
begin
  for t in select table_name from public.permission_targets where mutable=false loop
    execute format('drop policy if exists %I on public.%I','permission gate read',t.table_name);
    execute format('create policy %I on public.%I as restrictive for select to authenticated using ((select private.has_table_permission(%L,%L)))','permission gate read',t.table_name,t.table_name,'read');
  end loop;
end $$;

create or replace function private.prevent_actor_field_change()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  col text := tg_argv[0];
begin
  if (to_jsonb(old) ->> col) is distinct from (to_jsonb(new) ->> col) then
    raise exception 'Audit attribution field % cannot be changed', col;
  end if;
  return new;
end;
$$;

do $$
declare
  c record;
begin
  for c in
    select cols.table_name, cols.column_name
    from information_schema.columns cols
    join public.permission_targets t on t.table_name=cols.table_name and t.mutable=true
    where cols.table_schema='public'
      and cols.is_nullable='NO'
      and cols.column_name in ('created_by','decided_by','graded_by','added_by')
  loop
    execute format('drop policy if exists %I on public.%I','actor integrity insert',c.table_name);
    execute format('create policy %I on public.%I as restrictive for insert to authenticated with check (%I=(select auth.uid()))','actor integrity insert',c.table_name,c.column_name);
    execute format('drop trigger if exists %I on public.%I','protect_actor_field',c.table_name);
    execute format('create trigger %I before update on public.%I for each row execute function private.prevent_actor_field_change(%L)','protect_actor_field',c.table_name,c.column_name);
  end loop;
end $$;
