-- AssetFlow internal automation: mass balance, defects, pricing and returns.
-- Applied to live DubboEwaste Supabase on 2 Oct 2026.

alter table public.lots add column if not exists mass_balance_tolerance_kg numeric(12,3) not null default 0.500 check (mass_balance_tolerance_kg >= 0);

create table if not exists public.lot_adjustments (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.lots(id) on delete cascade,
  adjustment_type text not null check (adjustment_type in ('RESIDUAL','PROCESS_LOSS','OUTBOUND','CORRECTION')),
  weight_kg numeric(12,3) not null check (weight_kg >= 0),
  reason text not null,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.defect_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  severity text not null default 'MINOR' check (severity in ('COSMETIC','MINOR','MAJOR','CRITICAL')),
  grade_penalty integer not null default 0 check (grade_penalty >= 0),
  value_penalty_fixed numeric(12,2) not null default 0 check (value_penalty_fixed >= 0),
  value_penalty_percent numeric(7,3) not null default 0 check (value_penalty_percent >= 0 and value_penalty_percent <= 100),
  route_override text,
  active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.asset_defects (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  template_id uuid references public.defect_templates(id),
  description text,
  applied_grade_penalty integer not null default 0,
  applied_value_penalty numeric(12,2) not null default 0,
  route_override text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.returns_rma (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid references public.sales(id),
  asset_id uuid not null references public.assets(id),
  reason text not null,
  status text not null default 'OPEN' check (status in ('OPEN','IN_TRANSIT','RECEIVED','ASSESSING','REFUNDED','REPAIRED','REPLACED','CLOSED','REJECTED')),
  received_at timestamptz,
  resolution text,
  refund_amount numeric(12,2) not null default 0,
  internal_cost numeric(12,2) not null default 0,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.market_observations (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  manufacturer text,
  model text,
  grade text,
  source text not null,
  observed_price numeric(12,2) not null check (observed_price >= 0),
  observed_at timestamptz not null default now(),
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.pricing_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  grade text,
  base_price numeric(12,2) not null default 0,
  min_price numeric(12,2) not null default 0,
  enabled boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.lot_adjustments enable row level security;
alter table public.defect_templates enable row level security;
alter table public.asset_defects enable row level security;
alter table public.returns_rma enable row level security;
alter table public.market_observations enable row level security;
alter table public.pricing_rules enable row level security;

grant select,insert on public.lot_adjustments,public.asset_defects,public.returns_rma,public.market_observations to authenticated;
grant update on public.returns_rma to authenticated;
grant select,insert,update on public.defect_templates,public.pricing_rules to authenticated;

create policy "active staff read lot adjustments" on public.lot_adjustments for select to authenticated using (private.is_active_staff());
create policy "ops insert lot adjustments" on public.lot_adjustments for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician','volunteer') and created_by=(select auth.uid()));
create policy "active staff read defect templates" on public.defect_templates for select to authenticated using (private.is_active_staff());
create policy "managers insert defect templates" on public.defect_templates for insert to authenticated with check (private.current_staff_role() in ('admin','manager') and created_by=(select auth.uid()));
create policy "managers update defect templates" on public.defect_templates for update to authenticated using (private.current_staff_role() in ('admin','manager')) with check (private.current_staff_role() in ('admin','manager'));
create policy "active staff read asset defects" on public.asset_defects for select to authenticated using (private.is_active_staff());
create policy "ops insert asset defects" on public.asset_defects for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by=(select auth.uid()));
create policy "active staff read returns" on public.returns_rma for select to authenticated using (private.is_active_staff());
create policy "ops insert returns" on public.returns_rma for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by=(select auth.uid()));
create policy "ops update returns" on public.returns_rma for update to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff read market observations" on public.market_observations for select to authenticated using (private.is_active_staff());
create policy "ops insert market observations" on public.market_observations for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by=(select auth.uid()));
create policy "active staff read pricing rules" on public.pricing_rules for select to authenticated using (private.is_active_staff());
create policy "managers insert pricing rules" on public.pricing_rules for insert to authenticated with check (private.current_staff_role() in ('admin','manager') and created_by=(select auth.uid()));
create policy "managers update pricing rules" on public.pricing_rules for update to authenticated using (private.current_staff_role() in ('admin','manager')) with check (private.current_staff_role() in ('admin','manager'));

create index if not exists lot_adjustments_lot_idx on public.lot_adjustments(lot_id,created_at);
create index if not exists asset_defects_asset_idx on public.asset_defects(asset_id,created_at);
create index if not exists returns_asset_idx on public.returns_rma(asset_id,created_at desc);
create index if not exists market_obs_lookup_idx on public.market_observations(category,manufacturer,model,grade,observed_at desc);
