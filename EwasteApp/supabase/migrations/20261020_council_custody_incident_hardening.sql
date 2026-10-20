-- Council custody production hardening: cross-check hash integrity, require named handovers, pause on discrepancies.
CREATE OR REPLACE FUNCTION private.council_custody_release_ok(p_asset uuid, p_type text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare b uuid; latest public.council_custody_transfers%rowtype; loc public.council_custody_locations%rowtype;
begin
 select p.id into b from public.council_pilot_batches p join public.assets a on a.job_id=p.job_id
 where a.id=p_asset;
 if b is null then return true;end if;
 if exists(select 1 from private.council_custody_chain_validation(p_asset)
   where hash_ok is distinct from true or link_ok is distinct from true) then
   return false;
 end if;
 if exists(select 1 from public.council_custody_discrepancies where batch_id=b and status='OPEN'
  and (asset_id=p_asset or asset_id is null)) then return false;end if;
 if exists(select 1 from public.council_custody_transfers where asset_id=p_asset and status='REQUESTED')
 then return false;end if;
 if not exists(select 1 from public.council_custody_transfers
    where asset_id=p_asset and event_type='RECEIVED' and status='CONFIRMED') then return false;end if;
 select * into latest from public.council_custody_transfers where asset_id=p_asset and status='CONFIRMED'
 order by confirmed_at desc,id desc limit 1;
 if latest.id is null or latest.event_type<>'HANDOVER' or latest.handover_route is distinct from p_type then return false;end if;
 select * into loc from public.council_custody_locations where id=latest.to_location_id;
 if loc.kind<>'EXTERNAL_HANDOVER' or loc.status<>'VERIFIED' then return false;end if;
 if not exists(select 1 from public.council_custody_reconciliations r
    where r.batch_id=b and r.location_id in(
      select id from public.council_custody_locations l where l.batch_id=b and l.kind<>'EXTERNAL_HANDOVER')
      and r.status='MATCH' and r.checked_at>=now()-interval '7 days'
      and exists(select 1 from public.assets a where a.id=p_asset and a.asset_code=any(r.observed_codes))) then return false;end if;
 return true;
end $function$
;
CREATE OR REPLACE FUNCTION private.council_custody_transfer_guard()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare a public.assets%rowtype; loc public.council_custody_locations%rowtype;
 b public.council_pilot_batches%rowtype; prior public.council_custody_transfers%rowtype;
 evidence_hash text; source_place text;
begin
 select * into a from public.assets where id=new.asset_id for update;
 if not found then raise exception 'Custody asset not found';end if;
 select * into b from public.council_pilot_batches where id=new.batch_id;
 select * into loc from public.council_custody_locations where id=new.to_location_id;
 if b.id is null or a.job_id is distinct from b.job_id or a.programme<>'dubbo_ewaste'
 then raise exception 'Asset and Council pilot mismatch';end if;
 if loc.id is null or loc.batch_id<>b.id or loc.status<>'VERIFIED'
 then raise exception 'Destination requires independently verified secure location in the same pilot';end if;
 if not private.is_ewaste_pilot_operator() then raise exception 'Operator authorisation required';end if;
 if new.releasing_user=new.receiving_user then
  raise exception 'Different authenticated people must release and accept custody';end if;
 if not exists(select 1 from public.profiles p join public.program_access access on access.user_id=p.id
    where p.id=new.receiving_user and p.active and access.program='dubbo_ewaste'
    and access.active and access.programme_role in ('admin','manager','technician'))
 then raise exception 'Receiving person must be an active authorised Dubbo E-waste operator';end if;
 if not private.council_custody_evidence_ok(new.evidence_id,a.id) then
  raise exception 'Original SHA-256 asset-linked handover/custody evidence required';end if;
 if new.event_type not in ('QUARANTINED','RETURNED') then
  if b.status<>'ACTIVE' then raise exception 'Council pilot not approved ACTIVE';end if;
  if not private.council_risk_ready(b.id) then raise exception 'Council risk stop-work gate blocks custody';end if;
  if not private.council_agreement_allows(b.id,
     case when new.event_type='COLLECTED' then 'COLLECT'
       when new.event_type='HANDOVER' then new.handover_route
       else 'STORE' end, a.category,
     case when new.event_type='COLLECTED' then new.from_location else null end)
  then raise exception 'Signed Council agreement does not authorise custody event';end if;
 end if;

 select * into prior from public.council_custody_transfers
   where asset_id=a.id and status='CONFIRMED' order by confirmed_at desc,id desc limit 1;
 if tg_op='INSERT' then
  if new.releasing_user is distinct from auth.uid() or new.status<>'REQUESTED'
    or new.incoming_scan is not null then
   raise exception 'Custody request requires authenticated releasing operator';end if;
  if not private.council_custody_scan_matches(new.outgoing_scan,a.id) then
   raise exception 'Outgoing QR scan does not match this asset';end if;
  if a.serial_imei is not null and length(trim(a.serial_imei))>0 and
     trim(coalesce(new.serial_readback,'')) <> trim(a.serial_imei) then
   raise exception 'Serial number read-back must match inventory';end if;
  if prior.id is null then
   if new.event_type<>'COLLECTED' or new.from_location is distinct from a.source_name then
    raise exception 'First verified movement must COLLECT from the approved original source';end if;
  else
   select name into source_place from public.council_custody_locations where id=prior.to_location_id;
   if new.from_location is distinct from source_place then
    raise exception 'Custody location mismatch: expected %',source_place;end if;
   if prior.event_type in ('HANDOVER','RETURNED') then
    raise exception 'Device has already left the pilot; new movements require a documented new intake';end if;
  end if;
  if new.event_type='COLLECTED' and prior.id is not null then raise exception 'Cannot collect the same asset twice';end if;
  if (new.event_type='HANDOVER') is distinct from (new.handover_route is not null) then
    raise exception 'Final handover must explicitly identify DONATE or RECYCLE route';end if;
  if new.event_type in ('COLLECTED','HANDOVER') and
     length(trim(coalesce(new.external_party,'')))<3 then
    raise exception 'Council/source or external receiving person must be named in signed handover';
  end if;
  if new.event_type='HANDOVER' and loc.kind<>'EXTERNAL_HANDOVER' then
    raise exception 'Final handover requires verified external handover destination';end if;
  if new.event_type='QUARANTINED' and loc.kind<>'QUARANTINE' then
    raise exception 'Quarantine movement requires an approved quarantine location';end if;
  new.requested_at=now();
  return new;
 end if;
 if old.status<>'REQUESTED' then raise exception 'Confirmed, rejected and cancelled custody records are immutable';end if;
 if new.status not in ('REQUESTED','CONFIRMED','REJECTED','CANCELLED') or
    (to_jsonb(new)-'status'-'incoming_scan'-'confirmed_at'-'prev_hash'-'entry_hash'-'rejection_reason')
    is distinct from
    (to_jsonb(old)-'status'-'incoming_scan'-'confirmed_at'-'prev_hash'-'entry_hash'-'rejection_reason')
 then raise exception 'Custody request fields cannot be rewritten or replaced';end if;
 if new.status='REQUESTED' then
   if to_jsonb(new) is distinct from to_jsonb(old) then
     raise exception 'Custody requests are immutable while awaiting acceptance';end if;
   return new;
 end if;
 if new.status='CANCELLED' then
   if old.releasing_user is distinct from auth.uid() then raise exception 'Only releasing operator may cancel pending request';end if;
   if length(trim(coalesce(new.rejection_reason,'')))<10 then raise exception 'Cancellation requires reason';end if;
   return new;
 end if;
 if new.receiving_user is distinct from auth.uid() then
  raise exception 'Only named receiving staff can digitally acknowledge or reject handover';end if;
 if length(trim(coalesce(new.rejection_reason,'')))>=10 and new.status='REJECTED' then
  return new;
 elsif new.status='REJECTED' then raise exception 'A rejected handover needs its discrepancy reason';end if;
 if not private.council_custody_scan_matches(new.incoming_scan,new.asset_id) then
   raise exception 'Receiving scan is missing or does not match equipment label';end if;
 if exists(select 1 from public.council_custody_discrepancies d
    where d.batch_id=new.batch_id and d.status='OPEN'
      and (d.asset_id=new.asset_id or d.asset_id is null)) then
   raise exception 'Open custody discrepancy blocks transfer acceptance';end if;
 -- Race/conflict detection: serialise on asset and validate previous hash/location.
 if coalesce(prior.entry_hash,'')<>coalesce(new.prev_hash,'') and new.prev_hash is not null then
   raise exception 'Custody ledger changed since request was created';end if;
 if prior.id is not null and prior.confirmed_at>old.requested_at then
    raise exception 'Another verified movement occurred after this request was initiated';end if;
 new.prev_hash=coalesce(prior.entry_hash,'GENESIS');
 select sha256 into evidence_hash from public.evidence where id=new.evidence_id;
 new.confirmed_at=now();
 new.entry_hash=encode(extensions.digest(convert_to(
    coalesce(new.prev_hash,'')||'|'||new.id::text||'|'||new.asset_id::text||'|'||
    new.event_type||'|'||coalesce(new.handover_route,'')||'|'||new.from_location||'|'||new.to_location_id::text||'|'||
    new.releasing_user::text||'|'||new.receiving_user::text||'|'||
    coalesce(new.external_party,'')||'|'||new.document_reference||'|'||
    evidence_hash||'|'||coalesce(new.serial_readback,'')||'|'||
    new.confirmed_at::text,'UTF8'),'sha256'),'hex');
 return new;
end $function$
;
CREATE OR REPLACE FUNCTION private.council_custody_location_guard()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_job uuid;
begin
 if not private.is_ewaste_pilot_supervisor() then raise exception 'Secure location approvals require a supervisor';end if;
 select job_id into v_job from public.council_pilot_batches where id=new.batch_id;
 if v_job is null then raise exception 'Council batch missing';end if;
 if tg_op='INSERT' then
  if new.created_by is distinct from auth.uid() or new.status<>'DRAFT' then
    raise exception 'Secure locations begin as attributed drafts';end if;
 elsif old.status='VERIFIED' then
   if new.status='RETIRED' and (
      exists(select 1 from public.council_custody_transfers where to_location_id=new.id and status='REQUESTED')
      or exists(select 1 from public.council_custody_transfers t where t.to_location_id=new.id
        and t.status='CONFIRMED' and t.event_type not in ('HANDOVER','RETURNED')
        and t.id=(select t2.id from public.council_custody_transfers t2
            where t2.asset_id=t.asset_id and t2.status='CONFIRMED'
            order by t2.confirmed_at desc,t2.id desc limit 1))
    ) then raise exception 'Cannot retire location with outstanding devices or open transfers';end if;
   if new.status<>'RETIRED' or (to_jsonb(new)-'status') is distinct from (to_jsonb(old)-'status')
   then raise exception 'Verified secure location immutable; retire and replace';end if;
 elsif old.status='RETIRED' then raise exception 'Retired location cannot be edited';
 elsif new.batch_id<>old.batch_id or new.created_by<>old.created_by or new.created_at<>old.created_at then
   raise exception 'Location identity immutable';
 end if;
 if new.status='VERIFIED' then
  if new.verified_by is distinct from auth.uid() or new.created_by=auth.uid()
    or not private.verify_job_evidence(new.evidence_id,v_job) then
   raise exception 'Secure location requires independent verifier and original job-linked proof';end if;
  new.verified_at=now();
 end if;
 return new;
end $function$
;

create or replace function private.council_custody_discrepancy_pause()
returns trigger language plpgsql security definer set search_path=''
as $f$
begin
 update public.council_pilot_batches set status='PAUSED'
 where id=new.batch_id and status='ACTIVE';
 return new;
end $f$;
revoke all on function private.council_custody_discrepancy_pause() from public,anon,authenticated;
create trigger council_custody_discrepancy_pause after insert on public.council_custody_discrepancies
for each row execute function private.council_custody_discrepancy_pause();

create or replace function private.council_custody_rejection_flag()
returns trigger language plpgsql security definer set search_path=''
as $f$
begin
 if new.status='REJECTED' and old.status='REQUESTED' then
  insert into public.council_custody_discrepancies(
   batch_id,asset_id,location_id,discrepancy_type,description,opened_by)
  values(new.batch_id,new.asset_id,new.to_location_id,'MISMATCHED_LABEL',
   'Rejected custody transfer '||new.id::text||': '||new.rejection_reason,new.receiving_user);
 end if;
 return new;
end $f$;
revoke all on function private.council_custody_rejection_flag() from public,anon,authenticated;
create trigger council_custody_rejection_flag after update of status on public.council_custody_transfers
for each row execute function private.council_custody_rejection_flag();
