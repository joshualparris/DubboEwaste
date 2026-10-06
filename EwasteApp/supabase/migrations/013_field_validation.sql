-- Field validation system for unresolved Dubbo e-waste questions.
-- Append-only evidence capture; no public access.

create table if not exists public.validation_evidence (
  id uuid primary key default gen_random_uuid(),
  topic text not null check (topic in (
    'AMR_DOWNSTREAM','COUNCIL_CONTRACT','EDUCATION_VENDOR','ORGANISATION_DISPOSAL',
    'LOCAL_VOLUMES','LOCAL_ECONOMICS','APPROVALS','SUPPLY_WILLINGNESS',
    'REPAIR_CAFE_DEMAND','COMMERCIAL_TERMS'
  )),
  subject_name text not null,
  method text not null check (method in ('PUBLIC_SOURCE','INFORMAL_REQUEST','GIPA','INTERVIEW','WRITTEN_RESPONSE','QUOTE','PILOT','SURVEY','OTHER')),
  status text not null default 'OPEN' check (status in ('OPEN','REQUESTED','PARTIAL','VERIFIED','REFUSED','BLOCKED')),
  evidence_date date not null default current_date,
  source_url text,
  answer_summary text not null,
  quantitative_value numeric(14,3),
  quantitative_unit text,
  confidence text not null default 'MEDIUM' check (confidence in ('LOW','MEDIUM','HIGH')),
  next_action text,
  next_action_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.organisation_disposal_interviews (
  id uuid primary key default gen_random_uuid(),
  organisation text not null,
  sector text,
  respondent_role text,
  interview_date date not null default current_date,
  approximate_device_count integer check (approximate_device_count is null or approximate_device_count >= 0),
  annual_retired_devices integer check (annual_retired_devices is null or annual_retired_devices >= 0),
  refresh_cycle_months integer check (refresh_cycle_months is null or refresh_cycle_months > 0),
  current_route text,
  current_provider text,
  sanitisation_evidence text,
  reuse_before_recycle boolean,
  disposal_cost_or_rebate text,
  decision_control text,
  willing_to_trial text not null default 'UNKNOWN' check (willing_to_trial in ('YES','MAYBE','NO','UNKNOWN')),
  likely_trial_units integer check (likely_trial_units is null or likely_trial_units >= 0),
  conditions_for_trial text,
  next_action text,
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.repair_cafe_demand_observations (
  id uuid primary key default gen_random_uuid(),
  observed_on date not null default current_date,
  source_channel text,
  postcode text,
  device_type text not null,
  fault_category text not null,
  current_alternative text,
  affordability_barrier boolean,
  would_attend text not null default 'MAYBE' check (would_attend in ('YES','MAYBE','NO')),
  preferred_timing text,
  willing_to_learn boolean,
  estimated_repair_spend numeric(10,2) check (estimated_repair_spend is null or estimated_repair_spend >= 0),
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.commercial_terms_quotes (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  service_type text not null,
  quote_date date not null default current_date,
  valid_until date,
  minimum_units integer check (minimum_units is null or minimum_units >= 0),
  minimum_weight_kg numeric(12,3) check (minimum_weight_kg is null or minimum_weight_kg >= 0),
  pickup_fee numeric(12,2),
  per_unit_fee numeric(12,2),
  per_kg_fee numeric(12,2),
  rebate_or_buyback text,
  transport_terms text,
  battery_terms text,
  data_terms text,
  certificates_reports text,
  insurance_or_contract_requirements text,
  source_reference text,
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.pilot_economics_observations (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.assets(id) on delete set null,
  observed_on date not null default current_date,
  category text,
  acquisition_cost numeric(12,2) not null default 0,
  collection_freight numeric(12,2) not null default 0,
  parts_cost numeric(12,2) not null default 0,
  downstream_cost numeric(12,2) not null default 0,
  marketplace_fees numeric(12,2) not null default 0,
  outbound_freight numeric(12,2) not null default 0,
  return_cost numeric(12,2) not null default 0,
  other_cost numeric(12,2) not null default 0,
  intake_minutes integer not null default 0,
  diagnostic_minutes integer not null default 0,
  sanitisation_minutes integer not null default 0,
  repair_minutes integer not null default 0,
  listing_admin_minutes integer not null default 0,
  realised_revenue numeric(12,2) not null default 0,
  final_route text,
  sold_or_closed_on date,
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists validation_evidence_topic_idx on public.validation_evidence(topic,status,evidence_date desc);
create index if not exists organisation_disposal_interviews_org_idx on public.organisation_disposal_interviews(organisation,interview_date desc);
create index if not exists repair_cafe_demand_date_idx on public.repair_cafe_demand_observations(observed_on desc);
create index if not exists commercial_terms_provider_idx on public.commercial_terms_quotes(provider,quote_date desc);
create index if not exists pilot_economics_asset_idx on public.pilot_economics_observations(asset_id,observed_on desc);

alter table public.validation_evidence enable row level security;
alter table public.organisation_disposal_interviews enable row level security;
alter table public.repair_cafe_demand_observations enable row level security;
alter table public.commercial_terms_quotes enable row level security;
alter table public.pilot_economics_observations enable row level security;

grant select,insert on public.validation_evidence,public.organisation_disposal_interviews,public.repair_cafe_demand_observations,public.commercial_terms_quotes,public.pilot_economics_observations to authenticated;

create policy "active staff read validation evidence" on public.validation_evidence for select to authenticated using (private.is_active_staff());
create policy "ops insert validation evidence" on public.validation_evidence for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by=auth.uid());

create policy "active staff read disposal interviews" on public.organisation_disposal_interviews for select to authenticated using (private.is_active_staff());
create policy "ops insert disposal interviews" on public.organisation_disposal_interviews for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by=auth.uid());

create policy "active staff read repair cafe demand" on public.repair_cafe_demand_observations for select to authenticated using (private.is_active_staff());
create policy "ops insert repair cafe demand" on public.repair_cafe_demand_observations for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician','volunteer') and created_by=auth.uid());

create policy "active staff read commercial quotes" on public.commercial_terms_quotes for select to authenticated using (private.is_active_staff());
create policy "ops insert commercial quotes" on public.commercial_terms_quotes for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by=auth.uid());

create policy "active staff read pilot economics" on public.pilot_economics_observations for select to authenticated using (private.is_active_staff());
create policy "ops insert pilot economics" on public.pilot_economics_observations for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by=auth.uid());
