-- AssetFlow lifecycle authority, triage, quarantine and downstream-provider structure.
-- Applied live to the DubboEwaste Supabase project on 2 Oct 2026.

alter type public.asset_status add value if not exists 'READY_FOR_RECYCLING';
alter type public.asset_status add value if not exists 'OUTBOUND';

create table if not exists public.asset_authority_records (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  authority_type text not null check (authority_type in (
    'OWNER_TRANSFER','DONATION','BUSINESS_DISPOSAL_AUTHORITY','REPAIR_CUSTODY','PERSONAL_PROPERTY','OTHER'
  )),
  source_party text,
  reference text,
  evidence_id uuid references public.evidence(id) on delete set null,
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists asset_authority_records_asset_idx
  on public.asset_authority_records(asset_id, created_at desc);

create table if not exists public.asset_triage_assessments (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  safety_state text not null check (safety_state in ('SAFE','HOLD','UNSAFE')),
  battery_state text not null check (battery_state in ('OK','UNKNOWN','DAMAGED','SWOLLEN','MISSING','NOT_APPLICABLE')),
  lock_state text not null check (lock_state in ('CLEAR','UNKNOWN','LOCKED','NOT_APPLICABLE')),
  physical_state text not null check (physical_state in ('GOOD','FAIR','POOR','UNSAFE')),
  decision text not null check (decision in ('ACCEPT','HOLD','REJECT')),
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists asset_triage_assessments_asset_idx
  on public.asset_triage_assessments(asset_id, created_at desc);

create table if not exists public.asset_quarantines (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  reason_type text not null check (reason_type in (
    'BATTERY','DATA','OWNERSHIP','LOCK','PHYSICAL_DAMAGE','CONTAMINATION','SAFETY','OTHER'
  )),
  reason text not null,
  location_id uuid references public.locations(id) on delete set null,
  status text not null default 'OPEN' check (status in ('OPEN','RELEASED')),
  opened_by uuid not null references public.profiles(id),
  opened_at timestamptz not null default now(),
  released_by uuid references public.profiles(id),
  released_at timestamptz,
  release_notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  check (
    (status='OPEN' and released_at is null)
    or
    (status='RELEASED' and released_at is not null and released_by is not null)
  )
);

create unique index if not exists asset_quarantines_one_open_idx
  on public.asset_quarantines(asset_id)
  where status='OPEN';

create index if not exists asset_quarantines_asset_idx
  on public.asset_quarantines(asset_id, opened_at desc);

alter table public.downstream_vendors
  add column if not exists website text,
  add column if not exists provider_type text not null default 'RECYCLER',
  add column if not exists verification_status text not null default 'RESEARCH_LEAD',
  add column if not exists accepted_streams text[] not null default '{}',
  add column if not exists commercial_terms text,
  add column if not exists pricing_notes text,
  add column if not exists minimum_quantity text,
  add column if not exists lithium_policy text,
  add column if not exists crt_policy text,
  add column if not exists documentation_available text,
  add column if not exists certifications text,
  add column if not exists ntcrs_relationship text,
  add column if not exists first_downstream_facility text,
  add column if not exists confirmation_source text,
  add column if not exists last_confirmed_at timestamptz;

insert into public.permission_targets(table_name,label,category,mutable) values
  ('asset_authority_records','Asset authority / ownership records','Assets',true),
  ('asset_triage_assessments','Asset intake triage assessments','Assets',true),
  ('asset_quarantines','Asset quarantine records','Assets',true)
on conflict (table_name) do update
set label=excluded.label, category=excluded.category, mutable=excluded.mutable;

insert into public.role_table_permissions(role,table_name,can_create,can_read,can_update,can_delete)
select role, table_name, can_create, can_read, can_update, can_delete
from (values
  ('admin'::public.staff_role,'asset_authority_records',true,true,false,false),
  ('manager'::public.staff_role,'asset_authority_records',true,true,false,false),
  ('technician'::public.staff_role,'asset_authority_records',true,true,false,false),
  ('volunteer'::public.staff_role,'asset_authority_records',true,true,false,false),
  ('auditor'::public.staff_role,'asset_authority_records',false,true,false,false),
  ('admin'::public.staff_role,'asset_triage_assessments',true,true,false,false),
  ('manager'::public.staff_role,'asset_triage_assessments',true,true,false,false),
  ('technician'::public.staff_role,'asset_triage_assessments',true,true,false,false),
  ('volunteer'::public.staff_role,'asset_triage_assessments',true,true,false,false),
  ('auditor'::public.staff_role,'asset_triage_assessments',false,true,false,false),
  ('admin'::public.staff_role,'asset_quarantines',true,true,true,false),
  ('manager'::public.staff_role,'asset_quarantines',true,true,true,false),
  ('technician'::public.staff_role,'asset_quarantines',true,true,true,false),
  ('volunteer'::public.staff_role,'asset_quarantines',true,true,true,false),
  ('auditor'::public.staff_role,'asset_quarantines',false,true,false,false)
) p(role,table_name,can_create,can_read,can_update,can_delete)
on conflict (role,table_name) do update
set can_create=excluded.can_create,
    can_read=excluded.can_read,
    can_update=excluded.can_update,
    can_delete=excluded.can_delete,
    updated_at=now();

do $$
declare
  t text;
begin
  foreach t in array array['asset_authority_records','asset_triage_assessments','asset_quarantines']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select,insert,update,delete on public.%I to authenticated', t);

    execute format('drop policy if exists %I on public.%I','permission base select',t);
    execute format('drop policy if exists %I on public.%I','permission base insert',t);
    execute format('drop policy if exists %I on public.%I','permission base update',t);
    execute format('drop policy if exists %I on public.%I','permission base delete',t);
    execute format('drop policy if exists %I on public.%I','permission gate select',t);
    execute format('drop policy if exists %I on public.%I','permission gate insert',t);
    execute format('drop policy if exists %I on public.%I','permission gate update',t);
    execute format('drop policy if exists %I on public.%I','permission gate delete',t);

    execute format('create policy %I on public.%I for select to authenticated using ((select private.is_active_staff()))','permission base select',t);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select private.is_active_staff()))','permission base insert',t);
    execute format('create policy %I on public.%I for update to authenticated using ((select private.is_active_staff())) with check ((select private.is_active_staff()))','permission base update',t);
    execute format('create policy %I on public.%I for delete to authenticated using ((select private.is_active_staff()))','permission base delete',t);

    execute format('create policy %I on public.%I as restrictive for select to authenticated using ((select private.has_table_permission(%L,%L)))','permission gate select',t,t,'read');
    execute format('create policy %I on public.%I as restrictive for insert to authenticated with check ((select private.has_table_permission(%L,%L)))','permission gate insert',t,t,'create');
    execute format('create policy %I on public.%I as restrictive for update to authenticated using ((select private.has_table_permission(%L,%L))) with check ((select private.has_table_permission(%L,%L)))','permission gate update',t,t,'update',t,'update');
    execute format('create policy %I on public.%I as restrictive for delete to authenticated using ((select private.has_table_permission(%L,%L)))','permission gate delete',t,t,'delete');
  end loop;
end $$;

drop policy if exists "authority actor integrity" on public.asset_authority_records;
create policy "authority actor integrity"
on public.asset_authority_records
as restrictive for insert to authenticated
with check (created_by=(select auth.uid()));

drop policy if exists "triage actor integrity" on public.asset_triage_assessments;
create policy "triage actor integrity"
on public.asset_triage_assessments
as restrictive for insert to authenticated
with check (created_by=(select auth.uid()));

drop policy if exists "quarantine actor integrity" on public.asset_quarantines;
create policy "quarantine actor integrity"
on public.asset_quarantines
as restrictive for insert to authenticated
with check (created_by=(select auth.uid()) and opened_by=(select auth.uid()));

drop trigger if exists protect_actor_field on public.asset_authority_records;
create trigger protect_actor_field
before update on public.asset_authority_records
for each row execute function private.prevent_actor_field_change('created_by');

drop trigger if exists protect_actor_field on public.asset_triage_assessments;
create trigger protect_actor_field
before update on public.asset_triage_assessments
for each row execute function private.prevent_actor_field_change('created_by');

drop trigger if exists protect_actor_field on public.asset_quarantines;
create trigger protect_actor_field
before update on public.asset_quarantines
for each row execute function private.prevent_actor_field_change('created_by');
