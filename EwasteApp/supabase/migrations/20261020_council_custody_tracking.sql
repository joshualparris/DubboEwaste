-- 20 October 2026. Council custody v2: two-person handover, location proof,
-- QR/readback checks, independently acknowledged hash-linked ledger and reconciliation.
-- Existing Council job stays DRAFT. No asset, ownership or pickup records are fabricated.

create table public.council_custody_locations (
 id uuid primary key default gen_random_uuid(),
 batch_id uuid not null references public.council_pilot_batches(id) on delete restrict,
 name text not null check(length(trim(name)) between 5 and 160),
 kind text not null check(kind in ('SECURE_TRANSPORT','LOCKED_STORAGE','SECURE_WORKSHOP','QUARANTINE','EXTERNAL_HANDOVER')),
 controls text not null check(length(trim(controls))>=12),
 status text not null default 'DRAFT' check(status in('DRAFT','VERIFIED','RETIRED')),
 evidence_id uuid references public.evidence(id),
 created_by uuid not null references public.profiles(id),
 created_at timestamptz not null default now(),
 verified_by uuid references public.profiles(id),
 verified_at timestamptz,
 unique(batch_id,name)
);

create table public.council_custody_transfers (
 id uuid primary key default gen_random_uuid(),
 batch_id uuid not null references public.council_pilot_batches(id) on delete restrict,
 asset_id uuid not null references public.assets(id) on delete restrict,
 event_type text not null check(event_type in ('COLLECTED','RECEIVED','INTERNAL_MOVE','QUARANTINED','RETURNED','HANDOVER')),
 from_location text not null check(length(trim(from_location))>=5),
 to_location_id uuid not null references public.council_custody_locations(id),
 releasing_user uuid not null references public.profiles(id),
 receiving_user uuid not null references public.profiles(id),
 external_party text,
 outgoing_scan text not null,
 incoming_scan text,
 serial_readback text,
 document_reference text not null check(length(trim(document_reference))>=3),
 evidence_id uuid not null references public.evidence(id),
 status text not null default 'REQUESTED' check(status in('REQUESTED','CONFIRMED','REJECTED','CANCELLED')),
 request_notes text not null default '',
 rejection_reason text,
 prev_hash text,
 entry_hash text,
 requested_at timestamptz not null default now(),
 confirmed_at timestamptz
);
create unique index council_custody_one_pending_per_asset on public.council_custody_transfers(asset_id)
 where status='REQUESTED';
create index council_custody_chain_idx on public.council_custody_transfers(asset_id,confirmed_at desc,id);
create index council_custody_batch_idx on public.council_custody_transfers(batch_id,status);

create table public.council_custody_discrepancies(
 id uuid primary key default gen_random_uuid(),
 batch_id uuid not null references public.council_pilot_batches(id) on delete restrict,
 asset_id uuid references public.assets(id) on delete restrict,
 location_id uuid references public.council_custody_locations(id),
 discrepancy_type text not null check(discrepancy_type in
  ('MISSING','UNEXPECTED','MISMATCHED_LABEL','BROKEN_SEAL','DAMAGED','UNAUTHORISED_MOVEMENT','OTHER')),
 description text not null check(length(trim(description))>=10),
 status text not null default 'OPEN' check(status in('OPEN','RESOLVED')),
 opened_by uuid not null references public.profiles(id),
 opened_at timestamptz not null default now(),
 resolution text,
 resolution_evidence_id uuid references public.evidence(id),
 resolved_by uuid references public.profiles(id),
 resolved_at timestamptz
);
create index council_custody_discrepancy_batch on public.council_custody_discrepancies(batch_id,status);

create table public.council_custody_reconciliations(
 id uuid primary key default gen_random_uuid(),
 batch_id uuid not null references public.council_pilot_batches(id) on delete restrict,
 location_id uuid not null references public.council_custody_locations(id),
 observed_codes text[] not null default '{}',
 expected_codes text[] not null default '{}',
 missing_codes text[] not null default '{}',
 unexpected_codes text[] not null default '{}',
 status text not null default 'MISMATCH' check(status in('MATCH','MISMATCH')),
 evidence_id uuid references public.evidence(id),
 checked_by uuid not null references public.profiles(id),
 checked_at timestamptz not null default now(),
 notes text not null default ''
);
create index council_custody_reconcile_latest on public.council_custody_reconciliations(batch_id,location_id,checked_at desc);

alter table public.pilot_custody_events add column if not exists verified_transfer_id uuid
  references public.council_custody_transfers(id) on delete restrict;
create unique index if not exists pilot_custody_verified_ref on public.pilot_custody_events(verified_transfer_id)
 where verified_transfer_id is not null;

do $pol$ declare n text; begin
 foreach n in array array['council_custody_locations','council_custody_transfers','council_custody_discrepancies','council_custody_reconciliations'] loop
 execute format('alter table public.%I enable row level security',n);
 execute format('revoke all on public.%I from anon',n);
 execute format('grant select,insert,update on public.%I to authenticated',n);
 execute format('create policy %I on public.%I for select to authenticated using (private.is_ewaste_pilot_operator())',n||'_read',n);
 execute format('create policy %I on public.%I for insert to authenticated with check (private.is_ewaste_pilot_operator())',n||'_append',n);
 execute format('create policy %I on public.%I for update to authenticated using (private.is_ewaste_pilot_operator()) with check (private.is_ewaste_pilot_operator())',n||'_change',n);
 end loop;
end $pol$;
-- Old one-person custody endpoint may read history but may no longer append entries.
revoke insert on public.pilot_custody_events from authenticated;

create or replace function private.council_custody_evidence_ok(p_evidence uuid,p_asset uuid)
returns boolean language sql stable security definer set search_path=''
as $f$
 select exists(select 1 from public.evidence e where e.id=p_evidence
   and e.entity_type='asset' and e.entity_id=p_asset
   and e.programme='dubbo_ewaste' and length(coalesce(e.sha256,''))=64
   and length(trim(e.storage_key))>0)
$f$;
revoke all on function private.council_custody_evidence_ok(uuid,uuid) from public,anon,authenticated;

create or replace function private.council_custody_location_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
declare v_job uuid;
begin
 if not private.is_ewaste_pilot_supervisor() then raise exception 'Secure location approvals require a supervisor';end if;
 select job_id into v_job from public.council_pilot_batches where id=new.batch_id;
 if v_job is null then raise exception 'Council batch missing';end if;
 if tg_op='INSERT' then
  if new.created_by is distinct from auth.uid() or new.status<>'DRAFT' then
    raise exception 'Secure locations begin as attributed drafts';end if;
 elsif old.status='VERIFIED' then
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
end $f$;
revoke all on function private.council_custody_location_guard() from public,anon,authenticated;
create trigger council_custody_location_guard before insert or update on public.council_custody_locations
for each row execute function private.council_custody_location_guard();

create or replace function private.council_custody_scan_matches(p_scan text,p_asset uuid)
returns boolean language sql stable security definer set search_path=''
as $f$
select exists(select 1 from public.assets a where a.id=p_asset and (
 upper(trim(p_scan))=upper(a.asset_code)
 or upper(trim(p_scan))='AF:'||upper(a.asset_code)
 or trim(p_scan)='https://dubbo-ewaste-app.vercel.app/assets/'||a.id::text
 or trim(p_scan)='https://dubbo-ewaste-app.vercel.app/assets/'||a.id::text||'/'
))
$f$;
revoke all on function private.council_custody_scan_matches(text,uuid) from public,anon,authenticated;

create or replace function private.council_custody_transfer_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
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
       when new.event_type='HANDOVER' then 'DONATE'
       else 'STORE' end, a.category,
     case when new.event_type='COLLECTED' then new.from_location else null end)
  then raise exception 'Signed Council agreement does not authorise custody event';end if;
 end if;

 select * into prior from public.council_custody_transfers
   where asset_id=a.id and status='CONFIRMED' order by confirmed_at desc,id desc limit 1;
 if tg_op='INSERT' then
  if new.releasing_user is distinct from auth.uid() or new.status<>'REQUESTED'
    or new.received_by is not null then
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
   if new.incoming_scan is distinct from old.incoming_scan then
    raise exception 'Use formal acceptance, not editable scan field';end if;
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
    new.event_type||'|'||new.from_location||'|'||new.to_location_id::text||'|'||
    new.releasing_user::text||'|'||new.receiving_user::text||'|'||
    coalesce(new.external_party,'')||'|'||new.document_reference||'|'||
    evidence_hash||'|'||coalesce(new.serial_readback,'')||'|'||
    new.confirmed_at::text,'UTF8'),'sha256'),'hex');
 return new;
end $f$;
-- Error corrected in migration review below: no received_by field exists.
revoke all on function private.council_custody_transfer_guard() from public,anon,authenticated;
create trigger council_custody_transfer_guard before insert or update on public.council_custody_transfers
 for each row execute function private.council_custody_transfer_guard();

create or replace function private.council_custody_mirror_legacy()
returns trigger language plpgsql security definer set search_path=''
as $f$
declare target_name text;
begin
 if new.status='CONFIRMED' and old.status='REQUESTED' then
  select name into target_name from public.council_custody_locations where id=new.to_location_id;
  insert into public.pilot_custody_events(asset_id,event_type,from_location,to_location,
    reference,evidence_id,created_by,occurred_at,verified_transfer_id)
  values(new.asset_id,new.event_type,new.from_location,target_name,new.document_reference,
    new.evidence_id,new.receiving_user,new.confirmed_at,new.id);
 end if;
 return new;
end $f$;
revoke all on function private.council_custody_mirror_legacy() from public,anon,authenticated;
create trigger council_custody_verified_mirror after update of status on public.council_custody_transfers
for each row execute function private.council_custody_mirror_legacy();

create or replace function private.council_custody_legacy_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
begin
 if exists(select 1 from public.assets a join public.council_pilot_batches b on b.job_id=a.job_id
   where a.id=new.asset_id) then
   if new.verified_transfer_id is null or not exists(select 1 from public.council_custody_transfers t
      where t.id=new.verified_transfer_id and t.asset_id=new.asset_id and t.status='CONFIRMED'
      and t.event_type=new.event_type and t.receiving_user=new.created_by
      and t.document_reference=new.reference) then
     raise exception 'Direct one-person custody logs are disabled; use independently accepted Council handover';
   end if;
 end if;
 return new;
end $f$;
revoke all on function private.council_custody_legacy_guard() from public,anon,authenticated;
create trigger council_custody_legacy_guard before insert on public.pilot_custody_events
for each row execute function private.council_custody_legacy_guard();

create or replace function private.council_custody_discrepancy_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
declare job uuid;
begin
 select job_id into job from public.council_pilot_batches where id=new.batch_id;
 if tg_op='INSERT' then
  if new.opened_by is distinct from auth.uid() then raise exception 'Discrepancy author required';end if;
  if new.asset_id is not null and not exists(select 1 from public.assets
     where id=new.asset_id and job_id=job) then raise exception 'Discrepancy asset not in this Council batch';end if;
  if new.location_id is not null and not exists(select 1 from public.council_custody_locations
     where id=new.location_id and batch_id=new.batch_id) then raise exception 'Discrepancy location outside pilot';end if;
  if new.status<>'OPEN' then raise exception 'A discrepancy must first be OPEN';end if;
 else
  if old.status='RESOLVED' or
   (to_jsonb(new)-'status'-'resolution'-'resolution_evidence_id'-'resolved_by'-'resolved_at')
   is distinct from (to_jsonb(old)-'status'-'resolution'-'resolution_evidence_id'-'resolved_by'-'resolved_at') then
     raise exception 'Discrepancy facts are append-only; only signed resolution may change';end if;
  if new.status='RESOLVED' then
    if new.resolved_by is distinct from auth.uid() or new.resolved_by=old.opened_by or
       not private.is_ewaste_pilot_supervisor() or
       length(trim(coalesce(new.resolution,'')))<15 or
       not private.verify_job_evidence(new.resolution_evidence_id,job) then
       raise exception 'Independent supervisor and hashed resolution evidence required';end if;
    new.resolved_at=now();
  end if;
 end if;
 return new;
end $f$;
revoke all on function private.council_custody_discrepancy_guard() from public,anon,authenticated;
create trigger council_custody_discrepancy_guard before insert or update on public.council_custody_discrepancies
for each row execute function private.council_custody_discrepancy_guard();

create or replace function private.council_custody_reconcile_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
declare expected text[]; normalized text[]; missing text[]; unexpected text[]; ct int;
begin
 if tg_op='UPDATE' then raise exception 'Physical reconciliation snapshots cannot be edited';end if;
 if new.checked_by is distinct from auth.uid() or not private.is_ewaste_pilot_operator() then
   raise exception 'Authenticated staff author required';end if;
 if not exists(select 1 from public.council_custody_locations where id=new.location_id
   and batch_id=new.batch_id and status='VERIFIED') then
   raise exception 'Reconciliation requires verified location in this pilot';end if;
 if not private.verify_job_evidence(new.evidence_id,
   (select job_id from public.council_pilot_batches where id=new.batch_id)) then
   raise exception 'Reconciliation requires original hashed proof (count sheet / photos)';end if;
 select coalesce(array_agg(a.asset_code order by a.asset_code),'{}'::text[]) into expected
 from public.assets a join lateral (
   select t.to_location_id,t.event_type from public.council_custody_transfers t
     where t.asset_id=a.id and t.status='CONFIRMED'
     order by t.confirmed_at desc,t.id desc limit 1
 ) latest on true
 where a.job_id=(select job_id from public.council_pilot_batches where id=new.batch_id)
   and latest.to_location_id=new.location_id and latest.event_type not in('HANDOVER','RETURNED');
 select coalesce(array_agg(trim(x) order by trim(x)),'{}'::text[]) into normalized
 from unnest(new.observed_codes) x where length(trim(x))>0;
 if (select count(*) from unnest(normalized))<>(select count(distinct x) from unnest(normalized) x) then
   raise exception 'Duplicate scans cannot count as two separate assets';end if;
 select coalesce(array_agg(x),'{}'::text[]) into missing
 from unnest(expected) x where not (x=any(normalized));
 select coalesce(array_agg(x),'{}'::text[]) into unexpected
 from unnest(normalized) x where not (x=any(expected));
 new.observed_codes=normalized;new.expected_codes=expected;
 new.missing_codes=missing;new.unexpected_codes=unexpected;
 new.status=case when cardinality(missing)=0 and cardinality(unexpected)=0 then 'MATCH' else 'MISMATCH' end;
 new.checked_at=now();
 return new;
end $f$;
revoke all on function private.council_custody_reconcile_guard() from public,anon,authenticated;
create trigger council_custody_reconcile_guard before insert or update on public.council_custody_reconciliations
for each row execute function private.council_custody_reconcile_guard();

create or replace function private.council_custody_reconcile_exceptions()
returns trigger language plpgsql security definer set search_path=''
as $f$
declare code text; a uuid; descr text;
begin
 if new.status='MISMATCH' then
   foreach code in array new.missing_codes loop
     select id into a from public.assets where asset_code=code and job_id=
       (select job_id from public.council_pilot_batches where id=new.batch_id);
     insert into public.council_custody_discrepancies(batch_id,asset_id,location_id,
        discrepancy_type,description,opened_by)
     values(new.batch_id,a,new.location_id,'MISSING',
        'Reconciliation '||new.id::text||': expected label '||code||' not scanned',new.checked_by);
   end loop;
   foreach code in array new.unexpected_codes loop
     insert into public.council_custody_discrepancies(batch_id,asset_id,location_id,
        discrepancy_type,description,opened_by)
     values(new.batch_id,null,new.location_id,'UNEXPECTED',
        'Reconciliation '||new.id::text||': unexpected label '||code||' scanned',new.checked_by);
   end loop;
   update public.council_pilot_batches set status='PAUSED' where id=new.batch_id and status='ACTIVE';
 end if;
 return new;
end $f$;
revoke all on function private.council_custody_reconcile_exceptions() from public,anon,authenticated;
create trigger council_custody_reconcile_exceptions after insert on public.council_custody_reconciliations
 for each row execute function private.council_custody_reconcile_exceptions();

create or replace function private.council_custody_release_ok(p_asset uuid,p_type text)
returns boolean language plpgsql stable security definer set search_path=''
as $f$
declare b uuid; latest public.council_custody_transfers%rowtype; loc public.council_custody_locations%rowtype;
begin
 select p.id into b from public.council_pilot_batches p join public.assets a on a.job_id=p.job_id
 where a.id=p_asset;
 if b is null then return true;end if;
 if exists(select 1 from public.council_custody_discrepancies where batch_id=b and status='OPEN'
  and (asset_id=p_asset or asset_id is null)) then return false;end if;
 if exists(select 1 from public.council_custody_transfers where asset_id=p_asset and status='REQUESTED')
 then return false;end if;
 if not exists(select 1 from public.council_custody_transfers
    where asset_id=p_asset and event_type='RECEIVED' and status='CONFIRMED') then return false;end if;
 select * into latest from public.council_custody_transfers where asset_id=p_asset and status='CONFIRMED'
 order by confirmed_at desc,id desc limit 1;
 if latest.id is null or latest.event_type<>'HANDOVER' then return false;end if;
 select * into loc from public.council_custody_locations where id=latest.to_location_id;
 if loc.kind<>'EXTERNAL_HANDOVER' or loc.status<>'VERIFIED' then return false;end if;
 if not exists(select 1 from public.council_custody_reconciliations r
    where r.batch_id=b and r.location_id in(
      select id from public.council_custody_locations l where l.batch_id=b and l.kind<>'EXTERNAL_HANDOVER')
      and r.status='MATCH' and r.checked_at>=now()-interval '7 days') then return false;end if;
 return true;
end $f$;
revoke all on function private.council_custody_release_ok(uuid,text) from public,anon;
grant execute on function private.council_custody_release_ok(uuid,text) to authenticated;

create or replace function private.council_custody_disposition_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
begin
 if new.disposition_type in ('DONATE','RECYCLE') and
  not private.council_custody_release_ok(new.asset_id,new.disposition_type) then
    raise exception 'Custody release BLOCKED: second-person QR handover, secure-location reconciliation and zero open discrepancies required';
 end if;
 return new;
end $f$;
revoke all on function private.council_custody_disposition_guard() from public,anon,authenticated;
create trigger council_custody_disposition_guard before insert or update of disposition_type
 on public.dispositions for each row execute function private.council_custody_disposition_guard();

create or replace view public.council_custody_asset_status with(security_invoker=true) as
select b.id batch_id,a.id asset_id,a.asset_code,a.serial_imei,
 t.id last_transfer_id,t.event_type last_event,t.to_location_id current_location_id,
 l.name current_location,l.kind current_location_kind,
 t.confirmed_at last_confirmed_at,t.entry_hash latest_hash,
 (select count(*) from public.council_custody_transfers p
  where p.asset_id=a.id and p.status='REQUESTED') pending_handoffs,
 (select count(*) from public.council_custody_discrepancies d
  where d.batch_id=b.id and d.status='OPEN' and (d.asset_id=a.id or d.asset_id is null)) open_discrepancies,
 private.council_custody_release_ok(a.id,'DONATE') release_evidence_complete
from public.assets a join public.council_pilot_batches b on b.job_id=a.job_id
left join lateral(select id,event_type,to_location_id,confirmed_at,entry_hash
 from public.council_custody_transfers t where t.asset_id=a.id and t.status='CONFIRMED'
 order by t.confirmed_at desc,t.id desc limit 1)t on true
left join public.council_custody_locations l on l.id=t.to_location_id;
revoke all on public.council_custody_asset_status from public,anon;
grant select on public.council_custody_asset_status to authenticated;
