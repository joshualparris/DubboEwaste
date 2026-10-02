-- AssetFlow CRM foundation: lead pipeline and contact history.
-- Run after 007 migrations.

create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  name text not null,
  organisation text,
  email text,
  phone text,
  source text,
  stage text not null default 'NEW' check (stage in ('NEW','QUALIFIED','QUOTED','WON','LOST','NURTURE')),
  estimated_value numeric(12,2) check (estimated_value is null or estimated_value >= 0),
  next_action text,
  next_action_at timestamptz,
  lost_reason text,
  consent_status text not null default 'UNKNOWN' check (consent_status in ('UNKNOWN','OPERATIONAL_ONLY','MARKETING_OPT_IN','MARKETING_OPT_OUT')),
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  activity_type text not null check (activity_type in ('NOTE','CALL','EMAIL','MEETING','STAGE_CHANGE','QUOTE')),
  summary text not null,
  occurred_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists crm_leads_stage_idx on public.crm_leads(stage, next_action_at);
create index if not exists crm_leads_customer_idx on public.crm_leads(customer_id);
create index if not exists crm_activities_lead_idx on public.crm_activities(lead_id, occurred_at desc);

create trigger crm_leads_set_updated_at
before update on public.crm_leads
for each row execute procedure private.set_updated_at();

alter table public.crm_leads enable row level security;
alter table public.crm_activities enable row level security;

grant select, insert, update on public.crm_leads to authenticated;
grant select, insert on public.crm_activities to authenticated;

create policy "active staff read crm leads" on public.crm_leads for select to authenticated using (private.is_active_staff());
create policy "operations staff create crm leads" on public.crm_leads for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by = auth.uid());
create policy "operations staff update crm leads" on public.crm_leads for update to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff read crm activities" on public.crm_activities for select to authenticated using (private.is_active_staff());
create policy "operations staff create crm activities" on public.crm_activities for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by = auth.uid());
