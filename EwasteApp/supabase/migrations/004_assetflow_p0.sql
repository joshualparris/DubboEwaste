-- AssetFlow P0 core operational schema.
-- Applied to the DubboEwaste Supabase project on 2 Oct 2026.

create sequence if not exists public.job_code_seq start 1;
create sequence if not exists public.lot_code_seq start 1;
create sequence if not exists public.certificate_code_seq start 1;

create or replace function public.next_job_code()
returns text language sql volatile set search_path=public as $$
  select 'DEW-J-' || extract(year from now())::int || '-' || lpad(nextval('public.job_code_seq')::text, 5, '0')
$$;

create or replace function public.next_lot_code()
returns text language sql volatile set search_path=public as $$
  select 'DEW-L-' || lpad(nextval('public.lot_code_seq')::text, 6, '0')
$$;

create or replace function public.next_certificate_code()
returns text language sql volatile set search_path=public as $$
  select 'DEW-C-' || extract(year from now())::int || '-' || lpad(nextval('public.certificate_code_seq')::text, 6, '0')
$$;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  kind text not null default 'ZONE' check (kind in ('SITE','ZONE','SHELF','BENCH','QUARANTINE','OTHER')),
  parent_id uuid references public.locations(id),
  active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  job_code text not null unique default public.next_job_code(),
  customer_id uuid references public.customers(id),
  source_site text,
  contact_name text,
  status text not null default 'DRAFT' check (status in ('DRAFT','SCHEDULED','DELIVERED','PARTIALLY_RECEIVED','RECEIVED','PROCESSING','READY_TO_CLOSE','CLOSED','CANCELLED')),
  scheduled_at timestamptz,
  received_at timestamptz,
  expected_asset_count integer check (expected_asset_count is null or expected_asset_count >= 0),
  expected_weight_kg numeric(12,3) check (expected_weight_kg is null or expected_weight_kg >= 0),
  work_instructions text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lots (
  id uuid primary key default gen_random_uuid(),
  lot_code text not null unique default public.next_lot_code(),
  job_id uuid references public.jobs(id),
  commodity text not null,
  gross_weight_kg numeric(12,3) check (gross_weight_kg is null or gross_weight_kg >= 0),
  tare_weight_kg numeric(12,3) check (tare_weight_kg is null or tare_weight_kg >= 0),
  item_count integer check (item_count is null or item_count >= 0),
  location_id uuid references public.locations(id),
  status text not null default 'RECEIVED' check (status in ('RECEIVED','SORTING','PROCESSING','CONSUMED','OUTBOUND','CLOSED','HOLD')),
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lots_weight_check check (gross_weight_kg is null or tare_weight_kg is null or gross_weight_kg >= tare_weight_kg)
);

alter table public.assets add column if not exists customer_id uuid references public.customers(id);
alter table public.assets add column if not exists job_id uuid references public.jobs(id);
alter table public.assets add column if not exists lot_id uuid references public.lots(id);
alter table public.assets add column if not exists location_id uuid references public.locations(id);
alter table public.assets add column if not exists received_at timestamptz not null default now();

create table if not exists public.asset_tests (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  test_type text not null,
  result text not null check (result in ('PASS','FAIL','NOT_PRESENT','NOT_TESTED','REVIEW')),
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.dispositions (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  disposition_type text not null check (disposition_type in ('REFURBISH','SELL','DONATE','PARTS','RECYCLE','RETURN','HOLD','REJECT')),
  destination text,
  notes text,
  decided_by uuid not null references public.profiles(id),
  decided_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_code text not null unique default public.next_certificate_code(),
  certificate_type text not null check (certificate_type in ('RECEIPT','DISPOSITION','DEVICE_HISTORY')),
  asset_id uuid references public.assets(id),
  job_id uuid references public.jobs(id),
  snapshot jsonb not null default '{}'::jsonb,
  issued_by uuid not null references public.profiles(id),
  issued_at timestamptz not null default now()
);

create table if not exists public.operational_events (
  id bigint generated always as identity primary key,
  entity_type text not null,
  entity_id uuid not null,
  event_type text not null,
  actor_id uuid references public.profiles(id),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists jobs_customer_idx on public.jobs(customer_id);
create index if not exists lots_job_idx on public.lots(job_id);
create index if not exists assets_job_idx on public.assets(job_id);
create index if not exists assets_customer_idx on public.assets(customer_id);
create index if not exists asset_tests_asset_idx on public.asset_tests(asset_id, created_at desc);
create index if not exists dispositions_asset_idx on public.dispositions(asset_id, decided_at desc);
create index if not exists certificates_asset_idx on public.certificates(asset_id, issued_at desc);
create index if not exists operational_events_entity_idx on public.operational_events(entity_type, entity_id, created_at desc);

alter table public.customers enable row level security;
alter table public.locations enable row level security;
alter table public.jobs enable row level security;
alter table public.lots enable row level security;
alter table public.asset_tests enable row level security;
alter table public.dispositions enable row level security;
alter table public.certificates enable row level security;
alter table public.operational_events enable row level security;

grant select, insert, update on public.customers to authenticated;
grant select, insert, update on public.locations to authenticated;
grant select, insert, update on public.jobs to authenticated;
grant select, insert, update on public.lots to authenticated;
grant select, insert on public.asset_tests to authenticated;
grant select, insert on public.dispositions to authenticated;
grant select, insert on public.certificates to authenticated;
grant select, insert on public.operational_events to authenticated;
grant usage, select on sequence public.job_code_seq to authenticated;
grant usage, select on sequence public.lot_code_seq to authenticated;
grant usage, select on sequence public.certificate_code_seq to authenticated;
grant usage, select on sequence public.operational_events_id_seq to authenticated;

create policy "active staff read customers" on public.customers for select to authenticated using (private.is_active_staff());
create policy "operations staff create customers" on public.customers for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "operations staff update customers" on public.customers for update to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff read locations" on public.locations for select to authenticated using (private.is_active_staff());
create policy "operations staff create locations" on public.locations for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "operations staff update locations" on public.locations for update to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff read jobs" on public.jobs for select to authenticated using (private.is_active_staff());
create policy "operations staff create jobs" on public.jobs for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician','volunteer'));
create policy "operations staff update jobs" on public.jobs for update to authenticated using (private.current_staff_role() in ('admin','manager','technician','volunteer')) with check (private.current_staff_role() in ('admin','manager','technician','volunteer'));
create policy "active staff read lots" on public.lots for select to authenticated using (private.is_active_staff());
create policy "operations staff create lots" on public.lots for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician','volunteer'));
create policy "operations staff update lots" on public.lots for update to authenticated using (private.current_staff_role() in ('admin','manager','technician','volunteer')) with check (private.current_staff_role() in ('admin','manager','technician','volunteer'));
create policy "active staff read asset tests" on public.asset_tests for select to authenticated using (private.is_active_staff());
create policy "operations staff create asset tests" on public.asset_tests for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician','volunteer') and created_by = (select auth.uid()));
create policy "active staff read dispositions" on public.dispositions for select to authenticated using (private.is_active_staff());
create policy "operations staff create dispositions" on public.dispositions for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and decided_by = (select auth.uid()));
create policy "active staff read certificates" on public.certificates for select to authenticated using (private.is_active_staff());
create policy "operations staff issue certificates" on public.certificates for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and issued_by = (select auth.uid()));
create policy "active staff read operational events" on public.operational_events for select to authenticated using (private.is_active_staff());
create policy "operations staff append operational events" on public.operational_events for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician','volunteer') and actor_id = (select auth.uid()));
