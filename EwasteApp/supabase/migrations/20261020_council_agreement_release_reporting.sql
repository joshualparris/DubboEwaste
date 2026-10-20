-- Reconcile report/export readiness with the enforced, real-time agreement conditions.
-- Keeps NIST, ownership and safety checks in the existing release blocker function.
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
