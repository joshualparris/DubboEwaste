-- AssetFlow sanitisation, diagnostics and deployment control plane.
-- This migration records capabilities and evidence; it never performs drive
-- erasure, firmware changes, endpoint deployment or signing from the web app.

alter table public.media add column if not exists protocol text;
alter table public.media add column if not exists freeze_lock_state text not null default 'UNKNOWN'
  check (freeze_lock_state in ('UNKNOWN','NOT_PRESENT','PRESENT','CLEARED','UNABLE_TO_CLEAR'));
alter table public.media add column if not exists hpa_state text not null default 'NOT_CHECKED'
  check (hpa_state in ('NOT_CHECKED','NOT_PRESENT','PRESENT','REMOVED','UNABLE_TO_CHECK'));
alter table public.media add column if not exists dco_state text not null default 'NOT_CHECKED'
  check (dco_state in ('NOT_CHECKED','NOT_PRESENT','PRESENT','REMOVED','UNABLE_TO_CHECK'));
alter table public.media add column if not exists opal_state text not null default 'UNKNOWN'
  check (opal_state in ('UNKNOWN','NOT_PRESENT','LOCKED','UNLOCKED','PSID_REQUIRED','UNABLE_TO_CHECK'));

alter table public.sanitisation_tasks add column if not exists standard text;
alter table public.sanitisation_tasks add column if not exists operation text;
alter table public.sanitisation_tasks add column if not exists capability_snapshot jsonb not null default '{}'::jsonb;
alter table public.sanitisation_tasks add column if not exists preflight_snapshot jsonb not null default '{}'::jsonb;
alter table public.sanitisation_tasks add column if not exists report_format text check (report_format is null or report_format in ('PDF','XML','JSON','CSV','TEXT','OTHER'));
alter table public.sanitisation_tasks add column if not exists report_signature_status text not null default 'NOT_APPLICABLE'
  check (report_signature_status in ('NOT_APPLICABLE','UNSIGNED','VERIFIED','FAILED','PENDING'));

create table if not exists public.sanitisation_capabilities (
  id uuid primary key default gen_random_uuid(),
  interface text not null unique,
  media_families text[] not null default '{}',
  clear_supported boolean not null default false,
  purge_supported boolean not null default false,
  opal_supported boolean not null default false,
  hpa_dco_check_supported boolean not null default false,
  notes text,
  source_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.sanitisation_capabilities enable row level security;
grant select on public.sanitisation_capabilities to authenticated;
create policy "staff read sanitisation capabilities" on public.sanitisation_capabilities
  for select to authenticated using (private.is_active_staff());

insert into public.sanitisation_capabilities
  (interface, media_families, clear_supported, purge_supported, opal_supported, hpa_dco_check_supported, notes)
values
  ('SATA', '{HDD,SATA_SSD}', true, true, true, true, 'Capability must be confirmed by the selected tool and drive firmware.'),
  ('SCSI', '{HDD,SAS}', true, true, false, true, 'Use a certified tool profile and preserve the raw report.'),
  ('SAS', '{HDD,SAS}', true, true, false, true, 'Use a certified tool profile and preserve the raw report.'),
  ('USB', '{USB}', true, false, false, false, 'USB bridges may hide native drive commands; escalate when verification is unavailable.'),
  ('NVMe', '{NVME}', true, true, true, true, 'Prefer firmware sanitize/format or approved purge workflow where supported.'),
  ('OPAL', '{SATA_SSD,NVME}', false, true, true, false, 'Locked OPAL media may require PSID revert or destruction under approved procedure.')
on conflict (interface) do nothing;

create table if not exists public.diagnostic_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  tests jsonb not null default '[]'::jsonb,
  minimum_passes integer not null default 0 check (minimum_passes >= 0),
  active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create table if not exists public.diagnostic_runs (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  profile_id uuid references public.diagnostic_profiles(id),
  status text not null default 'QUEUED' check (status in ('QUEUED','RUNNING','PASSED','FAILED','REVIEW','CANCELLED')),
  execution_mode text not null default 'MANUAL' check (execution_mode in ('MANUAL','LOCAL_AGENT','BOOT_MEDIA','EXTERNAL_REPORT')),
  test_count integer not null default 0 check (test_count >= 0),
  pass_count integer not null default 0 check (pass_count >= 0),
  fail_count integer not null default 0 check (fail_count >= 0),
  report_evidence_id uuid references public.evidence(id),
  started_at timestamptz,
  completed_at timestamptz,
  operator_id uuid not null references public.profiles(id),
  notes text,
  created_at timestamptz not null default now()
);
alter table public.diagnostic_profiles enable row level security;
alter table public.diagnostic_runs enable row level security;
grant select,insert,update on public.diagnostic_profiles, public.diagnostic_runs to authenticated;
create policy "staff read diagnostic profiles" on public.diagnostic_profiles for select to authenticated using (private.is_active_staff());
create policy "managers write diagnostic profiles" on public.diagnostic_profiles for all to authenticated
  using (private.current_staff_role() in ('admin','manager')) with check (private.current_staff_role() in ('admin','manager'));
create policy "staff read diagnostic runs" on public.diagnostic_runs for select to authenticated using (private.is_active_staff());
create policy "staff write diagnostic runs" on public.diagnostic_runs for insert to authenticated with check (private.is_active_staff() and operator_id = auth.uid());
create policy "staff update diagnostic runs" on public.diagnostic_runs for update to authenticated using (private.is_active_staff());

create table if not exists public.deployment_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  provider text not null check (provider in ('BLANCCO','SERVICE_NOW','MICROSOFT_ENDPOINT_MANAGER','PXE_NETBOOT','OTHER')),
  package_reference text,
  command_reference text,
  target_environment text,
  capabilities jsonb not null default '{}'::jsonb,
  enabled boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
create table if not exists public.deployment_runs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.deployment_profiles(id),
  asset_id uuid references public.assets(id),
  job_id uuid references public.jobs(id),
  status text not null default 'PLANNED' check (status in ('PLANNED','QUEUED','RUNNING','SUCCEEDED','FAILED','CANCELLED')),
  external_run_id text,
  report_evidence_id uuid references public.evidence(id),
  requested_by uuid not null references public.profiles(id),
  started_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);
alter table public.deployment_profiles enable row level security;
alter table public.deployment_runs enable row level security;
grant select,insert,update on public.deployment_profiles, public.deployment_runs to authenticated;
create policy "managers read deployment profiles" on public.deployment_profiles for select to authenticated using (private.current_staff_role() in ('admin','manager'));
create policy "managers write deployment profiles" on public.deployment_profiles for all to authenticated
  using (private.current_staff_role() in ('admin','manager')) with check (private.current_staff_role() in ('admin','manager') and created_by = auth.uid());
create policy "staff read deployment runs" on public.deployment_runs for select to authenticated using (private.is_active_staff());
create policy "staff create deployment runs" on public.deployment_runs for insert to authenticated with check (private.is_active_staff() and requested_by = auth.uid());
create policy "staff update deployment runs" on public.deployment_runs for update to authenticated using (private.is_active_staff());

create table if not exists public.certificate_vault_records (
  id uuid primary key default gen_random_uuid(),
  certificate_id uuid not null unique references public.certificates(id) on delete cascade,
  canonical_sha256 text not null,
  previous_record_sha256 text,
  chain_sha256 text not null,
  vault_status text not null default 'RECORDED' check (vault_status in ('RECORDED','EXPORTED','VERIFIED','REVOKED')),
  pdf_evidence_id uuid references public.evidence(id),
  xml_evidence_id uuid references public.evidence(id),
  signature_status text not null default 'UNSIGNED' check (signature_status in ('UNSIGNED','PENDING','VERIFIED','FAILED')),
  signed_by text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
alter table public.certificate_vault_records enable row level security;
grant select,insert,update on public.certificate_vault_records to authenticated;
create policy "staff read certificate vault" on public.certificate_vault_records for select to authenticated using (private.is_active_staff());
create policy "staff create certificate vault" on public.certificate_vault_records for insert to authenticated with check (private.is_active_staff() and created_by = auth.uid());
create policy "managers update certificate vault" on public.certificate_vault_records for update to authenticated using (private.current_staff_role() in ('admin','manager'));
