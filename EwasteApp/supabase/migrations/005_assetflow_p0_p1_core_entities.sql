-- AssetFlow P0/P1 core entities
-- Applied to the live DubboEwaste Supabase project on 2 Oct 2026.

create sequence if not exists public.media_code_seq start 1;
create sequence if not exists public.part_code_seq start 1;
create sequence if not exists public.pallet_code_seq start 1;
create sequence if not exists public.outbound_code_seq start 1;

create or replace function public.next_media_code()
returns text language sql volatile set search_path=public as $$
  select 'DEW-M-' || lpad(nextval('public.media_code_seq')::text, 6, '0')
$$;
create or replace function public.next_part_code()
returns text language sql volatile set search_path=public as $$
  select 'DEW-PART-' || lpad(nextval('public.part_code_seq')::text, 6, '0')
$$;
create or replace function public.next_pallet_code()
returns text language sql volatile set search_path=public as $$
  select 'DEW-P-' || lpad(nextval('public.pallet_code_seq')::text, 6, '0')
$$;
create or replace function public.next_outbound_code()
returns text language sql volatile set search_path=public as $$
  select 'DEW-O-' || extract(year from now())::int || '-' || lpad(nextval('public.outbound_code_seq')::text, 5, '0')
$$;

create table if not exists public.asset_attributes (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  attribute_key text not null,
  attribute_value text,
  source text not null default 'MANUAL' check (source in ('MANUAL','DIAGNOSTIC','IMPORT','LOOKUP')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique(asset_id, attribute_key)
);

create table if not exists public.evidence (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  evidence_type text not null default 'ATTACHMENT',
  filename text not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  storage_key text not null unique,
  sha256 text,
  source text,
  captured_by uuid not null references public.profiles(id),
  captured_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  media_code text not null unique default public.next_media_code(),
  parent_asset_id uuid references public.assets(id) on delete set null,
  origin_asset_id uuid references public.assets(id) on delete set null,
  media_type text not null check (media_type in ('HDD','SATA_SSD','NVME','EMMC_UFS','USB','SD','TAPE','OTHER')),
  manufacturer text,
  model text,
  serial text,
  capacity_bytes bigint check (capacity_bytes is null or capacity_bytes >= 0),
  interface text,
  encryption_state text,
  smart_health text,
  hidden_areas text,
  data_state public.data_state not null default 'UNWIPED_RESTRICTED',
  final_route text,
  location_id uuid references public.locations(id),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sanitisation_policies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  standard text not null,
  method text not null,
  verification_required boolean not null default true,
  max_retries integer not null default 1 check (max_retries >= 0),
  fallback_route text not null default 'SUPERVISOR_REVIEW',
  active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.sanitisation_tasks (
  id uuid primary key default gen_random_uuid(),
  media_id uuid not null references public.media(id) on delete cascade,
  policy_id uuid references public.sanitisation_policies(id),
  status text not null default 'QUEUED' check (status in ('NOT_REQUIRED','QUEUED','RUNNING','VERIFYING','PASSED','FAILED','RETRY','DESTRUCTION_REQUIRED','DESTROYED','SUPERVISOR_REVIEW')),
  tool_name text,
  tool_version text,
  method text,
  attempt integer not null default 1 check (attempt > 0),
  verification_result text,
  raw_report_hash text,
  report_evidence_id uuid references public.evidence(id),
  started_at timestamptz,
  completed_at timestamptz,
  operator_id uuid references public.profiles(id),
  workstation text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  functional_grade text,
  cosmetic_grade text,
  battery_grade text,
  completeness_grade text,
  marketability_grade text,
  calculated_grade text,
  final_grade text,
  override_reason text,
  graded_by uuid not null references public.profiles(id),
  graded_at timestamptz not null default now()
);

create table if not exists public.exceptions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  exception_type text not null,
  severity text not null default 'MEDIUM' check (severity in ('LOW','MEDIUM','HIGH','CRITICAL')),
  status text not null default 'OPEN' check (status in ('OPEN','IN_REVIEW','RESOLVED','WAIVED')),
  summary text not null,
  owner_id uuid references public.profiles(id),
  due_at timestamptz,
  resolution text,
  evidence_id uuid references public.evidence(id),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.repairs (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  status text not null default 'OPEN' check (status in ('OPEN','APPROVED','IN_PROGRESS','WAITING_PARTS','COMPLETE','DECLINED','CANCELLED')),
  diagnosis text,
  estimated_labour_minutes integer check (estimated_labour_minutes is null or estimated_labour_minutes >= 0),
  estimated_parts_cost numeric(12,2) check (estimated_parts_cost is null or estimated_parts_cost >= 0),
  expected_value_uplift numeric(12,2),
  actual_parts_cost numeric(12,2),
  actual_labour_minutes integer,
  actions text,
  technician_id uuid references public.profiles(id),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.parts (
  id uuid primary key default gen_random_uuid(),
  part_code text not null unique default public.next_part_code(),
  origin_asset_id uuid references public.assets(id) on delete set null,
  origin_job_id uuid references public.jobs(id) on delete set null,
  origin_customer_id uuid references public.customers(id) on delete set null,
  part_type text not null,
  manufacturer text,
  model text,
  serial text,
  specification text,
  test_status text,
  grade text,
  location_id uuid references public.locations(id),
  estimated_value numeric(12,2),
  route text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.pallets (
  id uuid primary key default gen_random_uuid(),
  pallet_code text not null unique default public.next_pallet_code(),
  container_type text not null default 'PALLET',
  tare_weight_kg numeric(12,3) not null default 0 check (tare_weight_kg >= 0),
  location_id uuid references public.locations(id),
  customer_id uuid references public.customers(id),
  hazardous boolean not null default false,
  seal text,
  status text not null default 'OPEN' check (status in ('OPEN','SEALED','OUTBOUND','CLOSED','HOLD')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.pallet_contents (
  id uuid primary key default gen_random_uuid(),
  pallet_id uuid not null references public.pallets(id) on delete cascade,
  entity_type text not null check (entity_type in ('ASSET','LOT','PART')),
  entity_id uuid not null,
  added_by uuid not null references public.profiles(id),
  added_at timestamptz not null default now(),
  removed_at timestamptz
);

create table if not exists public.lot_relationships (
  id uuid primary key default gen_random_uuid(),
  parent_lot_id uuid not null references public.lots(id) on delete cascade,
  child_lot_id uuid not null references public.lots(id) on delete cascade,
  relationship_type text not null default 'SPLIT',
  input_weight_kg numeric(12,3),
  output_weight_kg numeric(12,3),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique(parent_lot_id, child_lot_id)
);

create table if not exists public.downstream_vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  abn text,
  contact_name text,
  email text,
  phone text,
  address text,
  capabilities text,
  evidence_requirements text,
  active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.outbound_orders (
  id uuid primary key default gen_random_uuid(),
  outbound_code text not null unique default public.next_outbound_code(),
  vendor_id uuid references public.downstream_vendors(id),
  destination text,
  carrier text,
  status text not null default 'DRAFT' check (status in ('DRAFT','SCHEDULED','LOADING','DISPATCHED','RECEIVED','SETTLED','CLOSED')),
  pickup_at timestamptz,
  bol_reference text,
  seal text,
  expected_weight_kg numeric(12,3),
  scale_weight_kg numeric(12,3),
  received_confirmation text,
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.outbound_contents (
  id uuid primary key default gen_random_uuid(),
  outbound_order_id uuid not null references public.outbound_orders(id) on delete cascade,
  entity_type text not null check (entity_type in ('ASSET','LOT','PALLET','PART')),
  entity_id uuid not null,
  weight_kg numeric(12,3),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.workflow_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  priority integer not null default 100,
  enabled boolean not null default true,
  conditions jsonb not null default '{}'::jsonb,
  action jsonb not null default '{}'::jsonb,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.workstations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  profile_type text not null check (profile_type in ('RECEIVING','WIPE','DIAGNOSTICS','REPAIR','GRADING','PARTS','OTHER')),
  location_id uuid references public.locations(id),
  config jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.resale_listings (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  sku text unique,
  channel text,
  title text,
  description text,
  asking_price numeric(12,2),
  status text not null default 'DRAFT' check (status in ('DRAFT','QUALIFIED','LISTED','SOLD','ENDED','HOLD')),
  external_listing_id text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.resale_listings(id),
  asset_id uuid references public.assets(id),
  channel_order_id text,
  sold_price numeric(12,2),
  fees numeric(12,2),
  freight numeric(12,2),
  dispatch_reference text,
  tracking text,
  sold_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id)
);

create table if not exists public.settlements (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id),
  customer_id uuid references public.customers(id),
  model text not null default 'MIXED',
  material_revenue numeric(12,2) not null default 0,
  resale_revenue numeric(12,2) not null default 0,
  service_revenue numeric(12,2) not null default 0,
  scrap_value numeric(12,2) not null default 0,
  freight numeric(12,2) not null default 0,
  marketplace_fees numeric(12,2) not null default 0,
  parts_cost numeric(12,2) not null default 0,
  labour_cost numeric(12,2) not null default 0,
  customer_share numeric(12,2) not null default 0,
  status text not null default 'DRAFT',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

insert into storage.buckets(id,name,public)
values ('evidence','evidence',false)
on conflict (id) do nothing;

alter table public.asset_attributes enable row level security;
alter table public.evidence enable row level security;
alter table public.media enable row level security;
alter table public.sanitisation_policies enable row level security;
alter table public.sanitisation_tasks enable row level security;
alter table public.grades enable row level security;
alter table public.exceptions enable row level security;
alter table public.repairs enable row level security;
alter table public.parts enable row level security;
alter table public.pallets enable row level security;
alter table public.pallet_contents enable row level security;
alter table public.lot_relationships enable row level security;
alter table public.downstream_vendors enable row level security;
alter table public.outbound_orders enable row level security;
alter table public.outbound_contents enable row level security;
alter table public.workflow_rules enable row level security;
alter table public.workstations enable row level security;
alter table public.resale_listings enable row level security;
alter table public.sales enable row level security;
alter table public.settlements enable row level security;

grant select,insert,update on public.asset_attributes,public.evidence,public.media,public.sanitisation_tasks,public.grades,public.exceptions,public.repairs,public.parts,public.pallets,public.pallet_contents,public.lot_relationships,public.outbound_orders,public.outbound_contents,public.resale_listings,public.sales,public.settlements to authenticated;
grant select,insert,update on public.sanitisation_policies,public.downstream_vendors,public.workflow_rules,public.workstations to authenticated;
grant usage,select on sequence public.media_code_seq,public.part_code_seq,public.pallet_code_seq,public.outbound_code_seq to authenticated;

create policy "active staff asset attributes" on public.asset_attributes for select to authenticated using (private.is_active_staff());
create policy "ops insert asset attributes" on public.asset_attributes for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician','volunteer') and created_by=(select auth.uid()));
create policy "ops update asset attributes" on public.asset_attributes for update to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff evidence" on public.evidence for select to authenticated using (private.is_active_staff());
create policy "ops insert evidence" on public.evidence for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician','volunteer') and captured_by=(select auth.uid()));
create policy "active staff media" on public.media for select to authenticated using (private.is_active_staff());
create policy "ops insert media" on public.media for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician','volunteer') and created_by=(select auth.uid()));
create policy "ops update media" on public.media for update to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff sanitisation policies" on public.sanitisation_policies for select to authenticated using (private.is_active_staff());
create policy "managers create sanitisation policies" on public.sanitisation_policies for insert to authenticated with check (private.current_staff_role() in ('admin','manager') and created_by=(select auth.uid()));
create policy "managers update sanitisation policies" on public.sanitisation_policies for update to authenticated using (private.current_staff_role() in ('admin','manager')) with check (private.current_staff_role() in ('admin','manager'));
create policy "active staff sanitisation tasks" on public.sanitisation_tasks for select to authenticated using (private.is_active_staff());
create policy "ops insert sanitisation tasks" on public.sanitisation_tasks for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "ops update sanitisation tasks" on public.sanitisation_tasks for update to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff grades" on public.grades for select to authenticated using (private.is_active_staff());
create policy "ops insert grades" on public.grades for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and graded_by=(select auth.uid()));
create policy "active staff exceptions" on public.exceptions for select to authenticated using (private.is_active_staff());
create policy "ops insert exceptions" on public.exceptions for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician','volunteer') and created_by=(select auth.uid()));
create policy "ops update exceptions" on public.exceptions for update to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff repairs" on public.repairs for select to authenticated using (private.is_active_staff());
create policy "ops insert repairs" on public.repairs for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by=(select auth.uid()));
create policy "ops update repairs" on public.repairs for update to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff parts" on public.parts for select to authenticated using (private.is_active_staff());
create policy "ops insert parts" on public.parts for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by=(select auth.uid()));
create policy "ops update parts" on public.parts for update to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff pallets" on public.pallets for select to authenticated using (private.is_active_staff());
create policy "ops insert pallets" on public.pallets for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician','volunteer') and created_by=(select auth.uid()));
create policy "ops update pallets" on public.pallets for update to authenticated using (private.current_staff_role() in ('admin','manager','technician','volunteer')) with check (private.current_staff_role() in ('admin','manager','technician','volunteer'));
create policy "active staff pallet contents" on public.pallet_contents for select to authenticated using (private.is_active_staff());
create policy "ops insert pallet contents" on public.pallet_contents for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician','volunteer') and added_by=(select auth.uid()));
create policy "ops update pallet contents" on public.pallet_contents for update to authenticated using (private.current_staff_role() in ('admin','manager','technician','volunteer')) with check (private.current_staff_role() in ('admin','manager','technician','volunteer'));
create policy "active staff lot relationships" on public.lot_relationships for select to authenticated using (private.is_active_staff());
create policy "ops insert lot relationships" on public.lot_relationships for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician','volunteer') and created_by=(select auth.uid()));
create policy "active staff downstream vendors" on public.downstream_vendors for select to authenticated using (private.is_active_staff());
create policy "managers insert downstream vendors" on public.downstream_vendors for insert to authenticated with check (private.current_staff_role() in ('admin','manager') and created_by=(select auth.uid()));
create policy "managers update downstream vendors" on public.downstream_vendors for update to authenticated using (private.current_staff_role() in ('admin','manager')) with check (private.current_staff_role() in ('admin','manager'));
create policy "active staff outbound orders" on public.outbound_orders for select to authenticated using (private.is_active_staff());
create policy "ops insert outbound orders" on public.outbound_orders for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by=(select auth.uid()));
create policy "ops update outbound orders" on public.outbound_orders for update to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff outbound contents" on public.outbound_contents for select to authenticated using (private.is_active_staff());
create policy "ops insert outbound contents" on public.outbound_contents for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by=(select auth.uid()));
create policy "active staff workflow rules" on public.workflow_rules for select to authenticated using (private.is_active_staff());
create policy "managers insert workflow rules" on public.workflow_rules for insert to authenticated with check (private.current_staff_role() in ('admin','manager') and created_by=(select auth.uid()));
create policy "managers update workflow rules" on public.workflow_rules for update to authenticated using (private.current_staff_role() in ('admin','manager')) with check (private.current_staff_role() in ('admin','manager'));
create policy "active staff workstations" on public.workstations for select to authenticated using (private.is_active_staff());
create policy "managers insert workstations" on public.workstations for insert to authenticated with check (private.current_staff_role() in ('admin','manager') and created_by=(select auth.uid()));
create policy "managers update workstations" on public.workstations for update to authenticated using (private.current_staff_role() in ('admin','manager')) with check (private.current_staff_role() in ('admin','manager'));
create policy "active staff resale listings" on public.resale_listings for select to authenticated using (private.is_active_staff());
create policy "ops insert resale listings" on public.resale_listings for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by=(select auth.uid()));
create policy "ops update resale listings" on public.resale_listings for update to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff sales" on public.sales for select to authenticated using (private.is_active_staff());
create policy "ops insert sales" on public.sales for insert to authenticated with check (private.current_staff_role() in ('admin','manager') and created_by=(select auth.uid()));
create policy "active staff settlements" on public.settlements for select to authenticated using (private.is_active_staff());
create policy "managers insert settlements" on public.settlements for insert to authenticated with check (private.current_staff_role() in ('admin','manager') and created_by=(select auth.uid()));
create policy "managers update settlements" on public.settlements for update to authenticated using (private.current_staff_role() in ('admin','manager')) with check (private.current_staff_role() in ('admin','manager'));

create policy "active staff read evidence objects" on storage.objects for select to authenticated using (bucket_id='evidence' and private.is_active_staff());
create policy "active staff upload evidence objects" on storage.objects for insert to authenticated with check (bucket_id='evidence' and private.is_active_staff());

create index if not exists media_parent_asset_idx on public.media(parent_asset_id);
create index if not exists media_serial_idx on public.media(serial);
create index if not exists sanitisation_tasks_media_idx on public.sanitisation_tasks(media_id,created_at desc);
create index if not exists grades_asset_idx on public.grades(asset_id,graded_at desc);
create index if not exists exceptions_status_idx on public.exceptions(status,severity,created_at desc);
create index if not exists repairs_asset_idx on public.repairs(asset_id,created_at desc);
create index if not exists parts_origin_asset_idx on public.parts(origin_asset_id);
create index if not exists pallets_location_idx on public.pallets(location_id);
create index if not exists outbound_orders_vendor_idx on public.outbound_orders(vendor_id);
create index if not exists resale_listings_asset_idx on public.resale_listings(asset_id);
