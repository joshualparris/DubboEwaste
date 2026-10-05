-- CRM completion: service opportunities and an operator-facing sales pipeline.

create table if not exists public.crm_opportunities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.crm_leads(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  quote_id uuid references public.crm_quotes(id) on delete set null,
  job_id uuid references public.jobs(id) on delete set null,
  name text not null check (char_length(name) between 2 and 200),
  service_type text not null default 'ITAD' check (service_type in ('COLLECTION','DROP_OFF','ITAD','REFURBISHMENT','DATA_SANITISATION','REUSE_PROGRAM','OTHER')),
  stage text not null default 'QUALIFIED' check (stage in ('QUALIFIED','QUOTED','ACCEPTED','SCHEDULED','PROCESSING','COMPLETED','INVOICED','LOST')),
  estimated_value numeric(12,2) check (estimated_value is null or estimated_value >= 0),
  expected_asset_count integer check (expected_asset_count is null or expected_asset_count >= 0),
  expected_weight_kg numeric(12,3) check (expected_weight_kg is null or expected_weight_kg >= 0),
  source_site text,
  target_date date,
  next_action text,
  next_action_at timestamptz,
  lost_reason text,
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_opportunities_stage_idx on public.crm_opportunities(stage, next_action_at);
create index if not exists crm_opportunities_lead_idx on public.crm_opportunities(lead_id);
create index if not exists crm_opportunities_customer_idx on public.crm_opportunities(customer_id);
create index if not exists crm_opportunities_quote_idx on public.crm_opportunities(quote_id);
create index if not exists crm_opportunities_job_idx on public.crm_opportunities(job_id);
create index if not exists crm_opportunities_created_by_idx on public.crm_opportunities(created_by);

drop trigger if exists crm_opportunities_set_updated_at on public.crm_opportunities;
create trigger crm_opportunities_set_updated_at
before update on public.crm_opportunities
for each row execute procedure private.set_updated_at();

alter table public.crm_opportunities enable row level security;
revoke all on table public.crm_opportunities from anon;
grant select, insert, update, delete on table public.crm_opportunities to authenticated;

insert into public.permission_targets(table_name,label,category,mutable)
values ('crm_opportunities','CRM opportunities','CRM',true)
on conflict (table_name) do update
set label=excluded.label, category=excluded.category, mutable=excluded.mutable;

insert into public.role_table_permissions(role,table_name,can_create,can_read,can_update,can_delete)
values
  ('admin'::public.staff_role,'crm_opportunities',true,true,true,true),
  ('manager'::public.staff_role,'crm_opportunities',true,true,true,true),
  ('technician'::public.staff_role,'crm_opportunities',true,true,true,false),
  ('volunteer'::public.staff_role,'crm_opportunities',false,true,false,false),
  ('auditor'::public.staff_role,'crm_opportunities',false,true,false,false)
on conflict (role,table_name) do update
set can_create=excluded.can_create,
    can_read=excluded.can_read,
    can_update=excluded.can_update,
    can_delete=excluded.can_delete,
    updated_at=now();

drop policy if exists "crm opportunities active staff select" on public.crm_opportunities;
create policy "crm opportunities active staff select"
on public.crm_opportunities for select to authenticated
using ((select private.is_active_staff()));

drop policy if exists "crm opportunities permission select" on public.crm_opportunities;
create policy "crm opportunities permission select"
on public.crm_opportunities as restrictive for select to authenticated
using ((select private.has_table_permission('crm_opportunities','read')));

drop policy if exists "crm opportunities active staff insert" on public.crm_opportunities;
create policy "crm opportunities active staff insert"
on public.crm_opportunities for insert to authenticated
with check ((select private.is_active_staff()));

drop policy if exists "crm opportunities permission insert" on public.crm_opportunities;
create policy "crm opportunities permission insert"
on public.crm_opportunities as restrictive for insert to authenticated
with check (
  (select private.has_table_permission('crm_opportunities','create'))
  and created_by=(select auth.uid())
);

drop policy if exists "crm opportunities active staff update" on public.crm_opportunities;
create policy "crm opportunities active staff update"
on public.crm_opportunities for update to authenticated
using ((select private.is_active_staff()))
with check ((select private.is_active_staff()));

drop policy if exists "crm opportunities permission update" on public.crm_opportunities;
create policy "crm opportunities permission update"
on public.crm_opportunities as restrictive for update to authenticated
using ((select private.has_table_permission('crm_opportunities','update')))
with check ((select private.has_table_permission('crm_opportunities','update')));

drop policy if exists "crm opportunities active staff delete" on public.crm_opportunities;
create policy "crm opportunities active staff delete"
on public.crm_opportunities for delete to authenticated
using ((select private.is_active_staff()));

drop policy if exists "crm opportunities permission delete" on public.crm_opportunities;
create policy "crm opportunities permission delete"
on public.crm_opportunities as restrictive for delete to authenticated
using ((select private.has_table_permission('crm_opportunities','delete')));
