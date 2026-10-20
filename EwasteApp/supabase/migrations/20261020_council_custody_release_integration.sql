-- Integrate independently confirmed custody chain with existing release rules.
CREATE OR REPLACE FUNCTION private.council_agreement_operations_guard()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_batch uuid; v_activity text; v_category text; v_site text; v_asset uuid; v_job uuid;
begin
 if tg_table_name='assets' then
   v_job=new.job_id;v_category=new.category;v_site=new.source_name;
   if tg_op='UPDATE' then
     if new.job_id is not distinct from old.job_id
       and new.category is not distinct from old.category
       and new.source_name is not distinct from old.source_name
       and new.status is not distinct from old.status then return new; end if;
   end if;
   if tg_op='INSERT' or (tg_op='UPDATE' and (new.job_id is distinct from old.job_id
       or new.category is distinct from old.category or new.source_name is distinct from old.source_name)) then
      v_activity='COLLECT';
   elsif new.status='DONATED' then v_activity='DONATE';
   elsif new.status='RECYCLED' then v_activity='RECYCLE';
   elsif new.status in ('HOLD','REJECTED','UNWIPED_RESTRICTED') then return new;
   else v_activity='STORE';end if;
 elsif tg_table_name='pilot_custody_events' then
   select a.job_id,a.category into v_job,v_category from public.assets a where a.id=new.asset_id;
   if new.event_type in ('RETURNED','QUARANTINED') then return new;end if;
   if new.event_type='COLLECTED' then
     v_activity='COLLECT';v_site=new.from_location;
   elsif new.event_type='HANDOVER' then
     select handover_route into v_activity from public.council_custody_transfers
       where id=new.verified_transfer_id and status='CONFIRMED';
     if v_activity not in ('DONATE','RECYCLE') then
       raise exception 'Verified custody handover route missing';end if;
   elsif new.event_type='INTERNAL_MOVE' then v_activity='STORE';
   else v_activity='STORE';end if;
 elsif tg_table_name='donation_handoffs' then
   select a.job_id,a.category into v_job,v_category from public.assets a where a.id=new.asset_id;
   v_activity='DONATE';
 elsif tg_table_name='dispositions' then
   if new.disposition_type in ('HOLD','RETURN','REJECT') then return new;end if;
   select a.job_id,a.category into v_job,v_category from public.assets a where a.id=new.asset_id;
   v_activity=case when new.disposition_type='DONATE' then 'DONATE'
    when new.disposition_type='RECYCLE' then 'RECYCLE'
    when new.disposition_type='SELL' then 'DONATE'
    else 'REFURBISH' end;
 elsif tg_table_name='jobs' then
   if new.status in ('DRAFT','SCHEDULED','CANCELLED') then return new; end if;
   v_job=new.id;v_activity='COLLECT';
 else return new;end if;
 select b.id into v_batch from public.council_pilot_batches b where b.job_id=v_job;
 if v_batch is null then return new;end if;
 if v_activity='COLLECT' and v_site is null and tg_table_name in ('assets','pilot_custody_events') then
   raise exception 'A signed-agreement collection site must be recorded for Council pilot assets';
 end if;
 if tg_table_name='assets' and tg_op='INSERT' then
   perform 1 from public.jobs where id=v_job for update;
   if (select count(*) from public.assets where job_id=v_job) >=
      (select a.max_devices from public.council_pilot_batches b
        join public.council_pilot_agreements a on a.id=b.approved_agreement_id
        where b.id=v_batch) then
     raise exception 'Council agreement device limit reached';
   end if;
 end if;
 if not private.council_agreement_allows(v_batch,v_activity,v_category,v_site) then
   raise exception 'Council agreement blocks %: approval absent, expired/revoked/paused, or site/category/activity outside signed scope',v_activity;
 end if;
 return new;
end $function$
;

CREATE OR REPLACE FUNCTION private.pilot_release_blockers(p_asset uuid)
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
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

 if (select result from public.asset_tests where asset_id=p_asset and test_type='ELECTRICAL_SAFETY' order by created_at desc,id desc limit 1) is distinct from 'PASS'
 then blockers:=array_append(blockers,'Electrical safety test PASS missing'); end if;
 if (select result from public.asset_tests where asset_id=p_asset and test_type='FUNCTIONAL_CHECK' order by created_at desc,id desc limit 1) is distinct from 'PASS'
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
   if not exists(select 1 from public.certificates c where c.asset_id=p_asset
      and c.certificate_type='SANITISATION' and c.status='ISSUED'
      and length(coalesce(c.snapshot_sha256,''))=64
      and c.issued_at >= all (
        select coalesce(t.completed_at,t.created_at)
        from public.media m join public.sanitisation_tasks t on t.media_id=m.id
        where m.parent_asset_id=p_asset and t.status='PASSED'
      ))
   then blockers:=array_append(blockers,'Current sanitisation certificate missing or predates media erasure'); end if;
 end if;

 if not exists(select 1 from public.donation_handoffs where asset_id=p_asset)
 then blockers:=array_append(blockers,'Signed recipient acceptance/condition disclosure missing'); end if;

 select * into v_batch from public.council_pilot_batches where job_id=v_asset.job_id;
 if found then
   if not private.council_custody_release_ok(p_asset,'DONATE') then
     blockers:=array_append(blockers,'Two-person QR receipt, verified physical stocktake, and zero custody discrepancies are required');end if;
   if not private.council_agreement_allows(v_batch.id,'DONATE',v_asset.category,v_asset.source_name)
   then blockers:=array_append(blockers,'No currently valid Council agreement authorises donation of this device from its recorded collection site'); end if;
   if v_batch.status<>'ACTIVE' then blockers:=array_append(blockers,'Council pilot is not authorised ACTIVE'); end if;
   if v_asset.category not in ('LAPTOP','DESKTOP','CHROMEBOOK') then
      blockers:=array_append(blockers,'Device outside approved laptop/desktop scope'); end if;
   if not exists(select 1 from public.pilot_custody_events where asset_id=p_asset and event_type='RECEIVED')
   then blockers:=array_append(blockers,'Council custody receipt is missing'); end if;
 end if;
 return blockers;
end $function$
;

create or replace function private.council_custody_asset_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
declare is_pilot boolean; old_pilot boolean;
begin
 select exists(select 1 from public.council_pilot_batches where job_id=new.job_id) into is_pilot;
 if tg_op='INSERT' then
   if is_pilot and (length(trim(coalesce(new.serial_imei,'')))<4 or new.location_id is not null) then
     raise exception 'Council intake requires identified physical device serial; location follows verified custody ledger';end if;
   return new;
 end if;
 select exists(select 1 from public.council_pilot_batches where job_id=old.job_id) into old_pilot;
 if old_pilot then
   if new.asset_code is distinct from old.asset_code or new.serial_imei is distinct from old.serial_imei or
       new.source_name is distinct from old.source_name or new.job_id is distinct from old.job_id or
       new.location_id is distinct from old.location_id then
     raise exception 'Council asset identity and origin are immutable; custody location changes only in approved ledger';end if;
 end if;
 if is_pilot and new.status in ('DONATED','RECYCLED') and old.status is distinct from new.status and
   not private.council_custody_release_ok(new.id,
     case when new.status='DONATED' then 'DONATE' else 'RECYCLE' end) then
    raise exception 'Direct release is blocked by unverified Council custody, physical count or open discrepancy';end if;
 return new;
end $f$;
revoke all on function private.council_custody_asset_guard() from public,anon,authenticated;
create trigger council_custody_asset_guard before insert or update of serial_imei,source_name,location_id,job_id,status
on public.assets for each row execute function private.council_custody_asset_guard();

create or replace function private.council_custody_chain_validation(p_asset uuid)
returns table(transfer_id uuid,ledger_position bigint,hash_ok boolean,link_ok boolean)
language sql stable security definer set search_path=''
as $f$
with ordered as(
 select t.*,e.sha256 evidence_sha,
  row_number() over(order by t.confirmed_at,t.id) seq,
  lag(t.entry_hash) over(order by t.confirmed_at,t.id) preceding_hash
 from public.council_custody_transfers t join public.evidence e on e.id=t.evidence_id
 where t.asset_id=p_asset and t.status='CONFIRMED'
)
select id,seq,
 entry_hash=encode(extensions.digest(convert_to(
  coalesce(prev_hash,'')||'|'||id::text||'|'||asset_id::text||'|'||
  event_type||'|'||coalesce(handover_route,'')||'|'||from_location||'|'||to_location_id::text||'|'||
  releasing_user::text||'|'||receiving_user::text||'|'||coalesce(external_party,'')||'|'||
  document_reference||'|'||evidence_sha||'|'||coalesce(serial_readback,'')||'|'||
  confirmed_at::text,'UTF8'),'sha256'),'hex') hash_ok,
 prev_hash=coalesce(preceding_hash,'GENESIS') link_ok
from ordered;
$f$;
revoke all on function private.council_custody_chain_validation(uuid) from public,anon,authenticated;
