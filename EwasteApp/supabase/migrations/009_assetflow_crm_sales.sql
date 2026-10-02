-- AssetFlow CRM sales layer: immutable quote versions, consent-safe campaigns and templates.
-- Run after 008_assetflow_crm.sql.

create sequence if not exists public.crm_quote_number_seq start 1;

create or replace function public.next_crm_quote_number()
returns text language sql volatile set search_path=public as $$
  select 'DEW-Q-' || extract(year from now())::int || '-' || lpad(nextval('public.crm_quote_number_seq')::text, 5, '0')
$$;

create table if not exists public.crm_quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique default public.next_crm_quote_number(),
  lead_id uuid references public.crm_leads(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  status text not null default 'DRAFT' check (status in ('DRAFT','ISSUED','ACCEPTED','DECLINED','EXPIRED','CONVERTED')),
  current_version integer not null default 1 check (current_version > 0),
  valid_until date,
  accepted_at timestamptz,
  converted_job_id uuid references public.jobs(id) on delete set null,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_quote_versions (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.crm_quotes(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  scope text not null,
  notes text,
  currency text not null default 'AUD' check (char_length(currency) = 3),
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  tax numeric(12,2) not null default 0 check (tax >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (quote_id, version_number)
);

create table if not exists public.crm_quote_items (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.crm_quote_versions(id) on delete cascade,
  description text not null,
  quantity numeric(12,3) not null default 1 check (quantity > 0),
  unit_price numeric(12,2) not null default 0 check (unit_price >= 0),
  line_total numeric(12,2) not null default 0 check (line_total >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.crm_email_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  subject text not null,
  body text not null,
  purpose text not null,
  active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  template_id uuid references public.crm_email_templates(id) on delete set null,
  status text not null default 'DRAFT' check (status in ('DRAFT','READY','SENT','PAUSED','CANCELLED')),
  audience_description text not null,
  consent_snapshot_at timestamptz,
  sent_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.crm_campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.crm_campaigns(id) on delete cascade,
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  consent_status text not null,
  status text not null default 'QUEUED' check (status in ('QUEUED','SENT','BOUNCED','UNSUBSCRIBED','SKIPPED')),
  delivered_at timestamptz,
  unique (campaign_id, lead_id)
);

create index if not exists crm_quotes_lead_idx on public.crm_quotes(lead_id, created_at desc);
create index if not exists crm_quote_versions_quote_idx on public.crm_quote_versions(quote_id, version_number desc);
create index if not exists crm_campaign_status_idx on public.crm_campaigns(status, created_at desc);
create index if not exists crm_campaign_recipients_campaign_idx on public.crm_campaign_recipients(campaign_id, status);

alter table public.crm_quotes enable row level security;
alter table public.crm_quote_versions enable row level security;
alter table public.crm_quote_items enable row level security;
alter table public.crm_email_templates enable row level security;
alter table public.crm_campaigns enable row level security;
alter table public.crm_campaign_recipients enable row level security;

grant select, insert, update on public.crm_quotes, public.crm_quote_versions, public.crm_quote_items, public.crm_email_templates, public.crm_campaigns, public.crm_campaign_recipients to authenticated;
grant usage, select on sequence public.crm_quote_number_seq to authenticated;

create policy "active staff read crm quotes" on public.crm_quotes for select to authenticated using (private.is_active_staff());
create policy "operations staff create crm quotes" on public.crm_quotes for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by = auth.uid());
create policy "operations staff update crm quotes" on public.crm_quotes for update to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff read crm quote versions" on public.crm_quote_versions for select to authenticated using (private.is_active_staff());
create policy "operations staff create crm quote versions" on public.crm_quote_versions for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician') and created_by = auth.uid());
create policy "active staff read crm quote items" on public.crm_quote_items for select to authenticated using (private.is_active_staff());
create policy "operations staff create crm quote items" on public.crm_quote_items for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff read crm templates" on public.crm_email_templates for select to authenticated using (private.is_active_staff());
create policy "operations staff manage crm templates" on public.crm_email_templates for all to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff read crm campaigns" on public.crm_campaigns for select to authenticated using (private.is_active_staff());
create policy "operations staff manage crm campaigns" on public.crm_campaigns for all to authenticated using (private.current_staff_role() in ('admin','manager','technician')) with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "active staff read crm campaign recipients" on public.crm_campaign_recipients for select to authenticated using (private.is_active_staff());
create policy "operations staff create crm campaign recipients" on public.crm_campaign_recipients for insert to authenticated with check (private.current_staff_role() in ('admin','manager','technician'));
