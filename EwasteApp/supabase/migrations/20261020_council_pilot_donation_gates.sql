-- 2026-10-20: Controlled, donation-only 20-device Council pilot.
-- Fail closed: this migration does not imply Council approval or certify a device.
-- The production app and database must use the same release requirements.

create table if not exists public.council_pilot_batches (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references public.jobs(id) on delete restrict,
  council_reference text,
  approval_evidence_id uuid references public.evidence(id),
  insurance_evidence_id uuid references public.evidence(id),
  risk_assessment_evidence_id uuid references public.evidence(id),
  site_evidence_id uuid references public.evidence(id),
  downstream_plan_evidence_id uuid references public.evidence(id),
  status text not null default 'DRAFT' check (status in ('DRAFT','ACTIVE','PAUSED','CLOSED')),
  operator_notes text,
  authorised_by uuid references public.profiles(id),
  authorised_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.council_pilot_batches is
  '20-item maximum, donation-only proposed Council pilot; ACTIVE requires independently obtained and uploaded written approvals.';

create table if not exists public.pilot_custody_events (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete restrict,
  event_type text not null check (event_type in ('COLLECTED','RECEIVED','INTERNAL_MOVE','QUARANTINED','RETURNED','HANDOVER')),
  from_location text,
  to_location text,
  reference text not null check (length(trim(reference)) >= 3),
  evidence_id uuid references public.evidence(id),
  occurred_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
comment on table public.pilot_custody_events is 'Append-only custody record; does not substitute for a signed Council collection agreement.';

create table if not exists public.donation_handoffs (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null unique references public.assets(id) on delete restrict,
  recipient_organisation text not null check (length(trim(recipient_organisation)) >= 3),
  recipient_name text not null check (length(trim(recipient_name)) >= 3),
  receipt_reference text not null check (length(trim(receipt_reference)) >= 3),
  acceptance_evidence_id uuid not null references public.evidence(id),
  condition_disclosure text not null check (length(trim(condition_disclosure)) >= 10),
  acknowledged_at timestamptz not null,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
comment on table public.donation_handoffs is 'Signed recipient evidence is required before a DONATE disposition can be recorded.';

create index if not exists pilot_custody_asset_time_idx on public.pilot_custody_events(asset_id,occurred_at desc);
create index if not exists assets_pilot_job_idx on public.assets(job_id) where job_id is not null;

create or replace function private.is_ewaste_pilot_operator()
returns boolean language sql stable security definer set search_path = ''
as $$
 select exists (
   select 1 from public.profiles p
   where p.id = (select auth.uid()) and p.active and
     (p.role = 'admin' or exists (
       select 1 from public.program_access pa
       where pa.user_id=p.id and pa.program='dubbo_ewaste' and pa.active
         and pa.programme_role in ('admin','manager','technician')
     ))
 )
$$;
revoke all on function private.is_ewaste_pilot_operator() from public,anon;
grant execute on function private.is_ewaste_pilot_operator() to authenticated;

alter table public.council_pilot_batches enable row level security;
alter table public.pilot_custody_events enable row level security;
alter table public.donation_handoffs enable row level security;
revoke all on public.council_pilot_batches,public.pilot_custody_events,public.donation_handoffs from anon;
grant select,insert,update on public.council_pilot_batches to authenticated;
grant select,insert on public.pilot_custody_events,public.donation_handoffs to authenticated;
create policy council_pilot_read on public.council_pilot_batches for select to authenticated
 using (private.is_ewaste_pilot_operator());
create policy council_pilot_create on public.council_pilot_batches for insert to authenticated
 with check (private.is_ewaste_pilot_operator() and created_by=(select auth.uid()));
create policy council_pilot_change on public.council_pilot_batches for update to authenticated
 using (private.is_ewaste_pilot_operator())
 with check (private.is_ewaste_pilot_operator() and created_by=created_by);
create policy pilot_custody_read on public.pilot_custody_events for select to authenticated
 using (private.is_ewaste_pilot_operator());
create policy pilot_custody_append on public.pilot_custody_events for insert to authenticated
 with check (private.is_ewaste_pilot_operator() and created_by=(select auth.uid()));
create policy donation_handoffs_read on public.donation_handoffs for select to authenticated
 using (private.is_ewaste_pilot_operator());
create policy donation_handoffs_create on public.donation_handoffs for insert to authenticated
 with check (private.is_ewaste_pilot_operator() and created_by=(select auth.uid()));

create or replace function private.verify_job_evidence(p_id uuid,p_job uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
 select exists (select 1 from public.evidence
   where id=p_id and entity_type='job' and entity_id=p_job and sha256 is not null
     and length(sha256)=64 and storage_key <> '')
$$;
revoke all on function private.verify_job_evidence(uuid,uuid) from public,anon,authenticated;

create or replace function private.council_pilot_batch_guard()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare v_count int; v_expected int;
begin
 if tg_op='UPDATE' and old.status='CLOSED' then
   raise exception 'Closed Council pilot batches are immutable';
 end if;
 if tg_op='UPDATE' and old.status='ACTIVE' and (
    new.job_id is distinct from old.job_id or
    new.council_reference is distinct from old.council_reference or
    new.approval_evidence_id is distinct from old.approval_evidence_id or
    new.insurance_evidence_id is distinct from old.insurance_evidence_id or
    new.risk_assessment_evidence_id is distinct from old.risk_assessment_evidence_id or
    new.site_evidence_id is distinct from old.site_evidence_id or
    new.downstream_plan_evidence_id is distinct from old.downstream_plan_evidence_id
 ) then raise exception 'Active pilot approvals cannot be silently replaced'; end if;
 select count(*) into v_count from public.assets where job_id=new.job_id;
 select expected_asset_count into v_expected from public.jobs where id=new.job_id and programme='dubbo_ewaste';
 if not found then raise exception 'Council pilot must use a Dubbo E-waste job'; end if;
 if v_count>20 or v_expected>20 then raise exception 'Council pilot is limited to 20 devices'; end if;
 if new.status in ('ACTIVE','CLOSED') then
   if coalesce(length(trim(new.council_reference)),0)<5 or
      not private.verify_job_evidence(new.approval_evidence_id,new.job_id) or
      not private.verify_job_evidence(new.insurance_evidence_id,new.job_id) or
      not private.verify_job_evidence(new.risk_assessment_evidence_id,new.job_id) or
      not private.verify_job_evidence(new.site_evidence_id,new.job_id) or
      not private.verify_job_evidence(new.downstream_plan_evidence_id,new.job_id)
   then raise exception 'Council approval, insurer response, site, risk and downstream documents must be uploaded before activating'; end if;
   if tg_op='INSERT' or old.status is distinct from new.status then
     if new.authorised_by is distinct from auth.uid() then
       raise exception 'Pilot activation requires the signed-in authoriser';
     end if;
     new.authorised_at=now();
   end if;
 end if;
 if tg_op='UPDATE' then new.created_by=old.created_by; end if;
 new.updated_at=now();
 return new;
end $$;
revoke all on function private.council_pilot_batch_guard() from public,anon,authenticated;
create trigger council_pilot_batch_guard before insert or update on public.council_pilot_batches
 for each row execute function private.council_pilot_batch_guard();

create or replace function private.council_pilot_capacity_guard()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare v_max int;
begin
 if new.job_id is not null and (tg_op='INSERT' or old.job_id is distinct from new.job_id) then
   if exists(select 1 from public.council_pilot_batches where job_id=new.job_id) then
     perform 1 from public.jobs where id=new.job_id for update;
     select count(*) into v_max from public.assets where job_id=new.job_id;
     if v_max >= 20 then raise exception '20-device Council pilot limit reached'; end if;
     if new.category not in ('LAPTOP','DESKTOP','CHROMEBOOK') then
       raise exception 'Council pilot accepts laptops, desktops and Chromebooks only';
     end if;
   end if;
 end if;
 return new;
end $$;
revoke all on function private.council_pilot_capacity_guard() from public,anon,authenticated;
create trigger council_pilot_capacity_guard before insert or update of job_id on public.assets
 for each row execute function private.council_pilot_capacity_guard();

create or replace function private.pilot_evidence_link_guard()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
 if not exists(select 1 from public.assets where id=new.asset_id and programme='dubbo_ewaste') then
   raise exception 'Evidence must belong to a Dubbo E-waste asset';
 end if;
 if tg_table_name='donation_handoffs' then
   if not exists(select 1 from public.evidence e where e.id=new.acceptance_evidence_id
     and e.entity_type='asset' and e.entity_id=new.asset_id and length(coalesce(e.sha256,''))=64)
   then raise exception 'A hashed, asset-linked recipient acceptance file is required'; end if;
 end if;
 if tg_table_name='pilot_custody_events' and new.evidence_id is not null then
   if not exists(select 1 from public.evidence e where e.id=new.evidence_id
     and e.entity_type='asset' and e.entity_id=new.asset_id)
   then raise exception 'Custody evidence must belong to the same asset'; end if;
 end if;
 if new.created_by is distinct from auth.uid() then
   raise exception 'Custody and handover records must identify the signed-in operator';
 end if;
 return new;
end $$;
revoke all on function private.pilot_evidence_link_guard() from public,anon,authenticated;
create trigger pilot_custody_evidence_check before insert on public.pilot_custody_events
 for each row execute function private.pilot_evidence_link_guard();
create trigger donation_handoff_evidence_check before insert on public.donation_handoffs
 for each row execute function private.pilot_evidence_link_guard();

-- No media/no drive is a separate documented inspection, never a silent "wipe pass".
-- Historical assets do not automatically gain authority, safety or release approval.
create or replace function private.pilot_release_blockers(p_asset uuid)
returns text[] language plpgsql stable security definer set search_path = ''
as $$
declare v_asset public.assets%rowtype; v_triage public.asset_triage_assessments%rowtype;
 v_storage public.asset_storage_assessments%rowtype;
 v_batch public.council_pilot_batches%rowtype;
 blockers text[] := array[]::text[];
begin
 select * into v_asset from public.assets where id=p_asset and programme='dubbo_ewaste';
 if not found then return array['Not a Dubbo E-waste asset']; end if;

 if not v_asset.ownership_verified or not exists (
    select 1 from public.asset_authority_records r where r.asset_id=p_asset
      and r.authority_type in ('OWNER_TRANSFER','DONATION','BUSINESS_DISPOSAL_AUTHORITY')
      and r.evidence_id is not null
      and exists(select 1 from public.evidence e where e.id=r.evidence_id
       and e.entity_type='asset' and e.entity_id=p_asset and length(coalesce(e.sha256,''))=64)
 ) then blockers:=array_append(blockers,'Signed ownership/transfer authority is missing'); end if;

 select * into v_triage from public.asset_triage_assessments
   where asset_id=p_asset order by created_at desc limit 1;
 if not found or v_triage.decision <> 'ACCEPT' or v_triage.safety_state <> 'SAFE'
   or v_triage.battery_state not in ('OK','MISSING','NOT_APPLICABLE')
   or v_triage.lock_state not in ('CLEAR','NOT_APPLICABLE')
   or v_triage.physical_state = 'UNSAFE'
 then blockers:=array_append(blockers,'Latest recorded safety/battery/lock triage is not ACCEPT and SAFE'); end if;

 if exists(select 1 from public.asset_quarantines
    where asset_id=p_asset and status not in ('RELEASED','CLOSED'))
 then blockers:=array_append(blockers,'Unresolved quarantine'); end if;

 if not exists(select 1 from public.asset_tests where asset_id=p_asset and test_type='ELECTRICAL_SAFETY' and result='PASS')
 then blockers:=array_append(blockers,'Electrical safety test PASS missing'); end if;
 if not exists(select 1 from public.asset_tests where asset_id=p_asset and test_type='FUNCTIONAL_CHECK' and result='PASS')
 then blockers:=array_append(blockers,'Functional test PASS missing'); end if;

 select * into v_storage from public.asset_storage_assessments where asset_id=p_asset;
 if not found or v_storage.presence in ('NOT_INSPECTED','UNRESOLVED') then
   blockers:=array_append(blockers,'Physical storage-media inspection incomplete');
 elsif v_storage.presence='NO_MEDIA_AT_RECEIPT' then
   if v_asset.data_bearing or v_asset.data_state<>'NON_DATA_BEARING' or exists(select 1 from public.media where parent_asset_id=p_asset)
   then blockers:=array_append(blockers,'No-media declaration conflicts with asset/media records'); end if;
 else
   if v_asset.data_state <> 'VERIFIED_CLEARED' or
      not exists(select 1 from public.media where parent_asset_id=p_asset) or
      exists(select 1 from public.media m where m.parent_asset_id=p_asset and
         (m.data_state <> 'VERIFIED_CLEARED' or not exists (
           select 1 from public.sanitisation_tasks t
           join public.sanitisation_report_imports r on r.media_id=t.media_id and r.evidence_id=t.report_evidence_id
           where t.media_id=m.id and t.status='PASSED' and r.status='APPROVED'
             and r.match_status='MATCH' and r.observed_result='PASSED'
         )))
   then blockers:=array_append(blockers,'Verified sanitisation missing for one or more media'); end if;
   if not exists(select 1 from public.certificates where asset_id=p_asset
      and certificate_type='SANITISATION' and status='ISSUED')
   then blockers:=array_append(blockers,'Sanitisation certificate missing'); end if;
 end if;

 if not exists(select 1 from public.donation_handoffs where asset_id=p_asset)
 then blockers:=array_append(blockers,'Signed recipient acceptance/condition disclosure missing'); end if;

 select * into v_batch from public.council_pilot_batches where job_id=v_asset.job_id;
 if found then
   if v_batch.status<>'ACTIVE' then blockers:=array_append(blockers,'Council pilot is not authorised ACTIVE'); end if;
   if v_asset.category not in ('LAPTOP','DESKTOP','CHROMEBOOK') then
      blockers:=array_append(blockers,'Device outside approved laptop/desktop scope'); end if;
   if not exists(select 1 from public.pilot_custody_events where asset_id=p_asset and event_type='RECEIVED')
   then blockers:=array_append(blockers,'Council custody receipt is missing'); end if;
 end if;
 return blockers;
end $$;
revoke all on function private.pilot_release_blockers(uuid) from public,anon;
grant execute on function private.pilot_release_blockers(uuid) to authenticated;

create or replace function private.pilot_donation_disposition_guard()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare v_blockers text[];
begin
 if new.disposition_type='DONATE' then
   if length(trim(coalesce(new.destination,'')))<3 then
     raise exception 'Donation destination organisation is required';
   end if;
   select private.pilot_release_blockers(new.asset_id) into v_blockers;
   if cardinality(v_blockers)>0 then
     raise exception 'Donation release BLOCKED: %', array_to_string(v_blockers,'; ');
   end if;
 end if;
 return new;
end $$;
revoke all on function private.pilot_donation_disposition_guard() from public,anon,authenticated;
create trigger pilot_donation_disposition_guard before insert or update of disposition_type on public.dispositions
 for each row execute function private.pilot_donation_disposition_guard();

create or replace function private.pilot_donated_asset_guard()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare v_blockers text[];
begin
 if new.status='DONATED' and (tg_op='INSERT' or old.status is distinct from new.status) then
   select private.pilot_release_blockers(new.id) into v_blockers;
   if cardinality(v_blockers)>0 then
     raise exception 'Donation status BLOCKED: %', array_to_string(v_blockers,'; ');
   end if;
   if not exists(select 1 from public.dispositions d
      where d.asset_id=new.id and d.disposition_type='DONATE')
   then raise exception 'Donation status requires an approved donation disposition'; end if;
 end if;
 return new;
end $$;
revoke all on function private.pilot_donated_asset_guard() from public,anon,authenticated;
create trigger pilot_donated_asset_guard before insert or update of status on public.assets
 for each row execute function private.pilot_donated_asset_guard();

-- Authenticated-only read-only report. RLS on underlying assets/batches remains effective.
create or replace view public.council_pilot_readiness
with (security_invoker=true) as
 select b.id batch_id,b.job_id,b.status batch_status,a.id asset_id,a.asset_code,
   a.category,a.status asset_status,a.data_state,
   private.pilot_release_blockers(a.id) blockers,
   cardinality(private.pilot_release_blockers(a.id))=0 as ready_to_donate
 from public.council_pilot_batches b join public.assets a on a.job_id=b.job_id;
revoke all on public.council_pilot_readiness from public,anon;
grant select on public.council_pilot_readiness to authenticated;

-- A trigger function is not a public RPC. Other flagged anonymous functions have
-- intentional public usage and must be separately reviewed before any restriction.
revoke all on function public.asset_storage_assessment_audit() from public,anon,authenticated;
