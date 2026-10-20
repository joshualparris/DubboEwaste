-- 2026-10-20 compliance hardening: no unauthorised collection and no undocumented downstream closeout.
-- Intentionally preserves all existing asset statuses and records.
CREATE OR REPLACE FUNCTION private.council_pilot_batch_guard()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
 if tg_op='INSERT' and v_count>0 then raise exception 'Cannot attach an existing intake job to a new Council pilot; start a fresh draft'; end if;
 if exists(select 1 from public.resale_listings rl join public.assets a on a.id=rl.asset_id where a.job_id=new.job_id)
  or exists(select 1 from public.sales s join public.assets a on a.id=s.asset_id where a.job_id=new.job_id)
  or exists(select 1 from public.assets where job_id=new.job_id and status in ('READY_FOR_SALE','LISTED','SOLD'))
 then raise exception 'Cannot enrol commercial stock into a donation-only Council pilot'; end if;
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
end $function$
;

CREATE OR REPLACE FUNCTION private.council_pilot_capacity_guard()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_max int;
begin
 if tg_op='UPDATE' and old.job_id is distinct from new.job_id and
   exists(select 1 from public.council_pilot_batches where job_id=old.job_id) then
     raise exception 'Council pilot device cannot silently leave its governed batch';
 end if;
 if new.job_id is not null and (tg_op='INSERT' or old.job_id is distinct from new.job_id) then
   if exists(select 1 from public.council_pilot_batches where job_id=new.job_id) then
     if not exists(select 1 from public.council_pilot_batches where job_id=new.job_id and status='ACTIVE') then
       raise exception 'Council pilot is DRAFT or PAUSED: receiving or linking assets is prohibited';
     end if;
     perform 1 from public.jobs where id=new.job_id for update;
     select count(*) into v_max from public.assets where job_id=new.job_id;
     if v_max >= 20 then raise exception '20-device Council pilot limit reached'; end if;
     if new.category not in ('LAPTOP','DESKTOP','CHROMEBOOK') then
       raise exception 'Council pilot accepts laptops, desktops and Chromebooks only';
     end if;
   end if;
 end if;
 return new;
end $function$
;

CREATE OR REPLACE FUNCTION private.pilot_evidence_link_guard()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
 if not exists(select 1 from public.assets where id=new.asset_id and programme='dubbo_ewaste') then
   raise exception 'Evidence must belong to a Dubbo E-waste asset';
 end if;
 if tg_table_name='donation_handoffs' then
   if not exists(select 1 from public.evidence e where e.id=new.acceptance_evidence_id
     and e.entity_type='asset' and e.entity_id=new.asset_id and length(coalesce(e.sha256,''))=64)
   then raise exception 'A hashed, asset-linked recipient acceptance file is required'; end if;
 end if;
 if tg_table_name='pilot_custody_events' then
   if not exists(select 1 from public.assets a join public.council_pilot_batches b on b.job_id=a.job_id
       where a.id=new.asset_id and b.status='ACTIVE') then
     raise exception 'Custody movements require an ACTIVE authorised Council batch';
   end if;
   if new.event_type in ('COLLECTED','RECEIVED','RETURNED','HANDOVER') and new.evidence_id is null then
     raise exception 'A hashed receiving/collection/handover document is required';
   end if;
 end if;
 if tg_table_name='donation_handoffs' and
   not exists(select 1 from public.assets a join public.council_pilot_batches b on b.job_id=a.job_id
     where a.id=new.asset_id and b.status='ACTIVE') then
   raise exception 'Recipient handover requires an ACTIVE Council batch';
 end if;
 if tg_table_name='pilot_custody_events' and new.evidence_id is not null then
   if not exists(select 1 from public.evidence e where e.id=new.evidence_id
     and e.entity_type='asset' and e.entity_id=new.asset_id and length(coalesce(e.sha256,''))=64)
   then raise exception 'Custody evidence must belong to the same asset'; end if;
 end if;
 if new.created_by is distinct from auth.uid() then
   raise exception 'Custody and handover records must identify the signed-in operator';
 end if;
 return new;
end $function$
;

-- Do not allow a Council draft to be marked received, processed or closed.
create or replace function private.council_pilot_job_status_guard()
returns trigger language plpgsql security definer set search_path=''
as $gate$
begin
 if exists(select 1 from public.council_pilot_batches b where b.job_id=new.id and b.status<>'ACTIVE')
   and new.status not in ('DRAFT','SCHEDULED','CANCELLED')
 then raise exception 'Cannot progress a Council pilot inbound job without an ACTIVE signed approval batch'; end if;
 return new;
end $gate$;
revoke all on function private.council_pilot_job_status_guard() from public,anon,authenticated;
create trigger council_pilot_job_status_guard before update of status on public.jobs
 for each row execute function private.council_pilot_job_status_guard();

-- Recording recycled is a completed downstream delivery, not a suggested route.
-- This path deliberately does not self-certify media destruction; failed or
-- unverified drives remain HOLD until a separate inspected destruction procedure exists.
create or replace function private.council_pilot_recycling_guard()
returns trigger language plpgsql security definer set search_path=''
as $gate$
declare asset_row public.assets%rowtype; storage_row public.asset_storage_assessments%rowtype;
begin
 if tg_table_name='dispositions' then
   if new.disposition_type <> 'RECYCLE' then return new; end if;
   select * into asset_row from public.assets where id=new.asset_id;
 else
   if new.status <> 'RECYCLED' then return new; end if;
   asset_row:=new;
 end if;

 if not exists(select 1 from public.council_pilot_batches where job_id=asset_row.job_id) then return new; end if;
 if not exists(select 1 from public.council_pilot_batches where job_id=asset_row.job_id and status='ACTIVE')
 then raise exception 'Council pilot recycling cannot be closed without ACTIVE approval'; end if;

 if exists(select 1 from public.asset_quarantines q where q.asset_id=asset_row.id
    and q.status not in ('RELEASED','CLOSED'))
 then raise exception 'Cannot complete recycling with unresolved quarantine'; end if;

 select * into storage_row from public.asset_storage_assessments where asset_id=asset_row.id;
 if not found or storage_row.presence in ('NOT_INSPECTED','UNRESOLVED')
 then raise exception 'Storage inspection required before downstream closeout'; end if;

 if storage_row.presence='NO_MEDIA_AT_RECEIPT' then
    if asset_row.data_bearing or asset_row.data_state<>'NON_DATA_BEARING'
      or exists(select 1 from public.media where parent_asset_id=asset_row.id)
    then raise exception 'No-media claim conflicts with recorded data-bearing equipment'; end if;
 else
    if asset_row.data_state<>'VERIFIED_CLEARED'
       or not exists(select 1 from public.media where parent_asset_id=asset_row.id)
       or exists(select 1 from public.media m where m.parent_asset_id=asset_row.id and
           (m.data_state<>'VERIFIED_CLEARED' or not exists (
             select 1 from public.sanitisation_tasks t
             join public.sanitisation_report_imports r on r.media_id=t.media_id and r.evidence_id=t.report_evidence_id
             where t.media_id=m.id and t.status='PASSED' and r.status='APPROVED'
               and r.match_status='MATCH' and r.observed_result='PASSED')))
    then raise exception 'Every data-bearing medium must be independently sanitised before recycling closeout; failed media remain HOLD pending an approved destruction workflow'; end if;
    if not exists(select 1 from public.certificates c where c.asset_id=asset_row.id and c.certificate_type='SANITISATION' and c.status='ISSUED')
    then raise exception 'Current sanitisation certificate required before recycling closeout'; end if;
 end if;

 if not exists (
   select 1 from public.outbound_contents oc
   join public.outbound_orders o on o.id=oc.outbound_order_id
   join public.downstream_vendors v on v.id=o.vendor_id
   where oc.entity_type='ASSET' and oc.entity_id=asset_row.id
     and o.programme='dubbo_ewaste' and v.programme='dubbo_ewaste'
     and v.active and v.verification_status='VERIFIED'
     and v.last_confirmed_at is not null
     and o.status in ('RECEIVED','SETTLED','CLOSED')
     and o.pickup_at is not null
     and length(trim(coalesce(o.received_confirmation,'')))>=5
     and length(trim(coalesce(o.bol_reference,'')))>=3
     and exists (select 1 from public.evidence e where e.entity_type='outbound' and e.entity_id=o.id and length(coalesce(e.sha256,''))=64)
 ) then raise exception 'Verified recycler, serialised outbound entry, consignment reference, received confirmation and hashed downstream receipt required'; end if;
 return new;
end $gate$;
revoke all on function private.council_pilot_recycling_guard() from public,anon,authenticated;
create trigger council_pilot_recycle_disposition_guard before insert or update of disposition_type on public.dispositions
 for each row execute function private.council_pilot_recycling_guard();
create trigger council_pilot_recycle_asset_guard before insert or update of status on public.assets
 for each row execute function private.council_pilot_recycling_guard();

-- Existing custody and handover rows are empty at migration time. No backfill.
