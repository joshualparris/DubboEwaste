-- DubboEwaste Operations — first slice
-- Run inside a dedicated Supabase project.

create extension if not exists pgcrypto;

create type public.staff_role as enum ('admin','manager','technician','volunteer','auditor');
create type public.asset_status as enum (
  'INTAKE',
  'UNWIPED_RESTRICTED',
  'TRIAGE',
  'SANITISATION',
  'DIAGNOSTICS',
  'REPAIR',
  'READY_FOR_SALE',
  'LISTED',
  'SOLD',
  'PARTS',
  'DONATED',
  'RECYCLED',
  'REJECTED',
  'HOLD'
);
create type public.data_state as enum (
  'UNWIPED_RESTRICTED',
  'SANITISATION_IN_PROGRESS',
  'VERIFIED_CLEARED',
  'SANITISATION_FAILED',
  'NON_DATA_BEARING'
);

create sequence public.asset_code_seq start 1;

create or replace function public.next_asset_code()
returns text
language sql
volatile
as $$
  select 'DEW-' || extract(year from now())::int || '-' || lpad(nextval('public.asset_code_seq')::text, 6, '0')
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.staff_role not null default 'volunteer',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  asset_code text not null unique default public.next_asset_code(),
  category text not null,
  manufacturer text,
  model text,
  serial_imei text,
  source_name text,
  ownership_verified boolean not null default false,
  data_bearing boolean not null default true,
  data_state public.data_state not null default 'UNWIPED_RESTRICTED',
  status public.asset_status not null default 'INTAKE',
  initial_route text,
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index assets_serial_imei_idx on public.assets(serial_imei);
create index assets_status_idx on public.assets(status);
create index assets_created_at_idx on public.assets(created_at desc);

create table public.asset_events (
  id bigint generated always as identity primary key,
  asset_id uuid not null references public.assets(id) on delete cascade,
  event_type text not null,
  actor_id uuid references public.profiles(id),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index asset_events_asset_idx on public.asset_events(asset_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles(id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.current_staff_role()
returns public.staff_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = auth.uid() and active = true
$$;

create or replace function public.is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and active = true)
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $
begin
  new.updated_at = now();
  return new;
end;
$;

create trigger assets_set_updated_at
before update on public.assets
for each row execute procedure public.set_updated_at();

create or replace function public.audit_asset_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $
begin
  if tg_op = 'INSERT' then
    insert into public.asset_events(asset_id,event_type,actor_id,details)
    values(new.id,'ASSET_CREATED',auth.uid(),jsonb_build_object('new',to_jsonb(new)));
  elsif tg_op = 'UPDATE' then
    insert into public.asset_events(asset_id,event_type,actor_id,details)
    values(new.id,'ASSET_UPDATED',auth.uid(),jsonb_build_object('old',to_jsonb(old),'new',to_jsonb(new)));
  end if;
  return new;
end;
$;

create trigger assets_audit
after insert or update on public.assets
for each row execute procedure public.audit_asset_changes();

alter table public.profiles enable row level security;
alter table public.assets enable row level security;
alter table public.asset_events enable row level security;

create policy "staff can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.current_staff_role() in ('admin','manager'));

create policy "admins manage profiles"
on public.profiles for all
to authenticated
using (public.current_staff_role() = 'admin')
with check (public.current_staff_role() = 'admin');

create policy "active staff read assets"
on public.assets for select
to authenticated
using (public.is_active_staff());

create policy "operations staff create assets"
on public.assets for insert
to authenticated
with check (
  public.current_staff_role() in ('admin','manager','technician','volunteer')
  and created_by = auth.uid()
);

create policy "operations staff update assets"
on public.assets for update
to authenticated
using (public.current_staff_role() in ('admin','manager','technician','volunteer'))
with check (public.current_staff_role() in ('admin','manager','technician','volunteer'));

create policy "admin manager delete assets"
on public.assets for delete
to authenticated
using (public.current_staff_role() in ('admin','manager'));

create policy "active staff read asset events"
on public.asset_events for select
to authenticated
using (public.is_active_staff());

create policy "operations staff add asset events"
on public.asset_events for insert
to authenticated
with check (
  public.current_staff_role() in ('admin','manager','technician','volunteer')
  and actor_id = auth.uid()
);

-- Auditors deliberately have read-only access through SELECT policies.
-- Promote the first user manually:
-- update public.profiles set role='admin' where id='<auth-user-uuid>';
