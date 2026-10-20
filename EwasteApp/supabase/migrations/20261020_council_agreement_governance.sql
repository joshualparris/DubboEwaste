-- Council pilot agreement governance: versioned, evidence-backed, fail closed.
-- Not a legal determination: staff must validate Council signatory authority externally.
-- Existing pilot stays DRAFT, and no unapproved legacy record becomes authorised.

create table public.council_pilot_agreements (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.council_pilot_batches(id) on delete restrict,
  revision_number integer not null check (revision_number between 1 and 999),
  reference text not null check (length(trim(reference)) between 5 and 200),
  status text not null default 'DRAFT'
    check (status in ('DRAFT','REVIEWED','APPROVED','REVOKED','SUPERSEDED')),
  council_signatory text not null default '',
  council_signatory_position text not null default '',
  council_delegation_basis text not null default '',
  operator_signatory text not null default '',
  operator_signatory_position text not null default '',
  council_signed_on date,
  operator_signed_on date,
  council_document_evidence_id uuid references public.evidence(id),
  operator_document_evidence_id uuid references public.evidence(id),
  effective_from date,
  expires_on date,
  collection_sites text[] not null default '{}'::text[],
  device_categories text[] not null default '{}'::text[],
  permitted_activities text[] not null default '{}'::text[],
  max_devices integer not null default 20 check(max_devices between 1 and 20),
  title_transfer_point text not null default 'NOT_AGREED'
    check(title_transfer_point in ('NOT_AGREED','ON_COLLECTION','ON_RECEIPT','ON_SIGNED_RELEASE')),
  title_transfer_terms text not null default '',
  contractor_arrangements text not null default '',
  conditions text not null default '',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  revoked_by uuid references public.profiles(id),
  revoked_at timestamptz,
  revocation_reason text,
  unique(batch_id,revision_number),
  constraint council_valid_dates check (effective_from is null or expires_on is null or expires_on>=effective_from),
  constraint council_known_categories check(device_categories <@ array['LAPTOP','DESKTOP','CHROMEBOOK']::text[]),
  constraint council_known_activities check(permitted_activities <@ array['COLLECT','TRANSPORT','STORE','SANITISE','REFURBISH','DONATE','RECYCLE']::text[])
);
create unique index council_agreement_one_approved_per_batch
  on public.council_pilot_agreements(batch_id) where status='APPROVED';
create index council_agreement_batch_idx on public.council_pilot_agreements(batch_id,revision_number desc);
alter table public.council_pilot_batches add column approved_agreement_id uuid
  references public.council_pilot_agreements(id) on delete restrict;

create table public.council_agreement_events (
  id bigint generated always as identity primary key,
  agreement_id uuid not null references public.council_pilot_agreements(id) on delete restrict,
  batch_id uuid not null references public.council_pilot_batches(id) on delete restrict,
  actor_id uuid references public.profiles(id),
  event_type text not null check(event_type in ('CREATED','DRAFT_UPDATED','REVIEWED','REOPENED','APPROVED','REVOKED','SUPERSEDED')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index council_agreement_events_idx on public.council_agreement_events(agreement_id,created_at desc);

alter table public.council_pilot_agreements enable row level security;
alter table public.council_agreement_events enable row level security;
revoke all on public.council_pilot_agreements,public.council_agreement_events from public,anon;
grant select,insert,update on public.council_pilot_agreements to authenticated;
grant select on public.council_agreement_events to authenticated;
create policy council_agreements_read on public.council_pilot_agreements for select to authenticated
  using (private.is_ewaste_pilot_operator());
create policy council_agreements_create on public.council_pilot_agreements for insert to authenticated
  with check(private.is_ewaste_pilot_supervisor() and created_by=auth.uid());
create policy council_agreements_update on public.council_pilot_agreements for update to authenticated
  using(private.is_ewaste_pilot_supervisor())
  with check(private.is_ewaste_pilot_supervisor());
create policy council_agreement_events_read on public.council_agreement_events for select to authenticated
  using(private.is_ewaste_pilot_operator());

create or replace function private.council_agreement_guard()
returns trigger language plpgsql security definer set search_path=''
as $guard$
declare v_job uuid; v_required text; v_version integer;
begin
 if not private.is_ewaste_pilot_supervisor() then
   raise exception 'Only an authorised E-waste supervisor can change Council agreement governance';
 end if;
 select b.job_id into v_job from public.council_pilot_batches b where b.id=new.batch_id for update;
 if v_job is null then raise exception 'Council pilot batch not found'; end if;
 if tg_op='INSERT' then
   if new.status<>'DRAFT' or new.created_by is distinct from auth.uid() then
     raise exception 'New agreements must begin as an attributed DRAFT';
   end if;
   select coalesce(max(revision_number),0)+1 into v_version
     from public.council_pilot_agreements where batch_id=new.batch_id;
   if new.revision_number<>v_version then
     raise exception 'Agreement revisions must be consecutive: expected %',v_version;
   end if;
   new.reviewed_by=null;new.reviewed_at=null;
   new.approved_by=null;new.approved_at=null;
   new.revoked_by=null;new.revoked_at=null;
 else
   if new.id is distinct from old.id or new.batch_id is distinct from old.batch_id or
      new.revision_number is distinct from old.revision_number or
      new.created_by is distinct from old.created_by or
      new.created_at is distinct from old.created_at then
      raise exception 'Agreement identity and attribution cannot change';
   end if;
   if old.status in ('APPROVED','REVOKED','SUPERSEDED') then
     if old.status <> 'APPROVED' or new.status not in ('REVOKED','SUPERSEDED') then
       raise exception 'Approved agreement may only be revoked or superseded; add a new revision for changed terms';
     end if;
     if (to_jsonb(new)-'status'-'updated_at'-'revoked_by'-'revoked_at'-'revocation_reason')
        is distinct from
        (to_jsonb(old)-'status'-'updated_at'-'revoked_by'-'revoked_at'-'revocation_reason') then
       raise exception 'Approved terms and signatures are immutable';
     end if;
     if length(trim(coalesce(new.revocation_reason,'')))<10 then
       raise exception 'Revocation or supersession requires a recorded explanation';
     end if;
     new.revoked_by=auth.uid();
     new.revoked_at=now();
   elsif old.status='DRAFT' then
     if new.status not in ('DRAFT','REVIEWED') then
       raise exception 'Draft requires independent review before approval';
     end if;
     if new.status='REVIEWED' then
       if auth.uid()=new.created_by then raise exception 'Independent reviewer must differ from draft author'; end if;
       new.reviewed_by=auth.uid();new.reviewed_at=now();
     else
       new.reviewed_by=null;new.reviewed_at=null;
     end if;
   elsif old.status='REVIEWED' then
     if new.status not in ('REVIEWED','DRAFT','APPROVED') then
       raise exception 'Reviewed agreement can only be returned to draft or approved';
     end if;
     if new.status='DRAFT' then
       new.reviewed_by=null;new.reviewed_at=null;
     elsif new.status='APPROVED' then
       if new.reviewed_by is distinct from old.reviewed_by or new.reviewed_at is distinct from old.reviewed_at then
         raise exception 'Reviewer attribution cannot be modified during approval';
       end if;
       if auth.uid()=old.reviewed_by then raise exception 'Reviewer cannot self-approve'; end if;
       if (to_jsonb(new)-'status'-'updated_at'-'approved_by'-'approved_at')
          is distinct from
          (to_jsonb(old)-'status'-'updated_at'-'approved_by'-'approved_at') then
          raise exception 'Agreement terms changed after review; return to draft and review again';
       end if;
       new.approved_by=auth.uid();new.approved_at=now();
     else
       if (to_jsonb(new)-'updated_at')
          is distinct from (to_jsonb(old)-'updated_at') then
         raise exception 'Reviewed agreement is locked; return to draft before editing';
       end if;
     end if;
   end if;
 end if;

 if new.status in ('REVIEWED','APPROVED') then
   if length(trim(new.council_signatory))<3 or length(trim(new.council_signatory_position))<3
     or length(trim(new.operator_signatory))<3 or length(trim(new.operator_signatory_position))<3
     or length(trim(new.council_delegation_basis))<10
     or length(trim(new.contractor_arrangements))<10
     or length(trim(new.title_transfer_terms))<10
     or new.title_transfer_point='NOT_AGREED'
     or new.effective_from is null or new.expires_on is null
     or new.expires_on<new.effective_from
     or new.council_signed_on is null or new.operator_signed_on is null
     or new.council_signed_on>(now() at time zone 'Australia/Sydney')::date
     or new.operator_signed_on>(now() at time zone 'Australia/Sydney')::date
     or new.council_signed_on>new.expires_on or new.operator_signed_on>new.expires_on
     or cardinality(new.collection_sites)=0
     or cardinality(new.device_categories)=0
     or cardinality(new.permitted_activities)=0
     or not ('COLLECT'=any(new.permitted_activities))
     or exists(select 1 from unnest(new.collection_sites) site where length(trim(site))<5)
     or not private.verify_job_evidence(new.council_document_evidence_id,v_job)
     or not private.verify_job_evidence(new.operator_document_evidence_id,v_job)
   then raise exception 'Agreement incomplete: both signed originals, authorised signatories and delegation, contractor/title terms, dates, sites, categories and activities are mandatory';
   end if;
   if exists(select 1 from public.council_pilot_agreements a where a.batch_id=new.batch_id
        and a.status='APPROVED' and a.id<>new.id) and new.status='APPROVED' then
     raise exception 'Supersede the existing approved agreement before approving a new version';
   end if;
 end if;
 new.updated_at=now();
 return new;
end $guard$;
revoke all on function private.council_agreement_guard() from public,anon,authenticated;
create trigger council_agreement_guard before insert or update on public.council_pilot_agreements
for each row execute function private.council_agreement_guard();

create or replace function private.council_agreement_audit()
returns trigger language plpgsql security definer set search_path=''
as $audit$
begin
 insert into public.council_agreement_events(agreement_id,batch_id,actor_id,event_type,details)
 values(
   new.id,new.batch_id,auth.uid(),
   case when tg_op='INSERT' then 'CREATED'
     when new.status='REVIEWED' and old.status='DRAFT' then 'REVIEWED'
     when new.status='APPROVED' and old.status='REVIEWED' then 'APPROVED'
     when new.status='REVOKED' then 'REVOKED'
     when new.status='SUPERSEDED' then 'SUPERSEDED'
     when new.status='DRAFT' and old.status='REVIEWED' then 'REOPENED'
     else 'DRAFT_UPDATED' end,
   jsonb_build_object('revision',new.revision_number,'reference',new.reference,
       'from',case when tg_op='INSERT' then null else old.status end,
       'to',new.status,'reason',new.revocation_reason)
 );
 return new;
end $audit$;
revoke all on function private.council_agreement_audit() from public,anon,authenticated;
create trigger council_agreement_audit after insert or update on public.council_pilot_agreements
for each row execute function private.council_agreement_audit();

-- Dynamic permission checking: no cron or manual EXPIRED flag required.
create or replace function private.council_agreement_allows(
  p_batch uuid,p_activity text,p_category text default null,p_site text default null)
returns boolean language sql stable security definer set search_path=''
as $allow$
 select exists(
   select 1 from public.council_pilot_batches b
   join public.council_pilot_agreements a on a.id=b.approved_agreement_id and a.batch_id=b.id
   where b.id=p_batch and b.status='ACTIVE' and a.status='APPROVED'
     and (now() at time zone 'Australia/Sydney')::date between a.effective_from and a.expires_on
     and p_activity=any(a.permitted_activities)
     and (p_category is null or p_category=any(a.device_categories))
     and (p_site is null or trim(p_site)=any(a.collection_sites))
     and a.approved_by is not null and a.reviewed_by is not null
     and a.approved_by<>a.reviewed_by
     and a.max_devices>= (select count(*) from public.assets d where d.job_id=b.job_id)
     and private.verify_job_evidence(a.council_document_evidence_id,b.job_id)
     and private.verify_job_evidence(a.operator_document_evidence_id,b.job_id)
 )
$allow$;
revoke all on function private.council_agreement_allows(uuid,text,text,text) from public,anon,authenticated;

-- Validate activation before the batch can claim ACTIVE.
create or replace function private.council_agreement_batch_activation_guard()
returns trigger language plpgsql security definer set search_path=''
as $activate$
declare v public.council_pilot_agreements%rowtype;
begin
 if tg_op='UPDATE' and old.status='ACTIVE' and
   new.approved_agreement_id is distinct from old.approved_agreement_id then
    raise exception 'Cannot replace an agreement while batch is ACTIVE: pause, supersede and re-authorise';
 end if;
 if new.status='ACTIVE' then
   select * into v from public.council_pilot_agreements a
     where a.id=new.approved_agreement_id and a.batch_id=new.id;
   if not found or v.status<>'APPROVED'
      or (now() at time zone 'Australia/Sydney')::date not between v.effective_from and v.expires_on
      or v.max_devices < (select count(*) from public.assets where job_id=new.job_id)
      or not ('COLLECT'=any(v.permitted_activities))
   then raise exception 'Council agreement missing, unapproved, expired or outside authorised scope'; end if;
 end if;
 return new;
end $activate$;
revoke all on function private.council_agreement_batch_activation_guard() from public,anon,authenticated;
create trigger council_agreement_batch_activation_guard
before insert or update on public.council_pilot_batches
for each row execute function private.council_agreement_batch_activation_guard();

-- Event-time enforcement. PAUSED, REVOKED and expired approvals all deny new activity.
-- Emergency quarantine and return are still available after expiry/revocation.
create or replace function private.council_agreement_operations_guard()
returns trigger language plpgsql security definer set search_path=''
as $ops$
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
   elsif new.event_type='HANDOVER' then v_activity='DONATE';
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
 if not private.council_agreement_allows(v_batch,v_activity,v_category,v_site) then
   raise exception 'Council agreement blocks %: approval absent, expired/revoked/paused, or site/category/activity outside signed scope',v_activity;
 end if;
 return new;
end $ops$;
revoke all on function private.council_agreement_operations_guard() from public,anon,authenticated;
create trigger council_agreement_asset_operations before insert or update of job_id,category,source_name,status
on public.assets for each row execute function private.council_agreement_operations_guard();
create trigger council_agreement_custody_operations before insert
on public.pilot_custody_events for each row execute function private.council_agreement_operations_guard();
create trigger council_agreement_handoff_operations before insert
on public.donation_handoffs for each row execute function private.council_agreement_operations_guard();
create trigger council_agreement_disposition_operations before insert or update of disposition_type
on public.dispositions for each row execute function private.council_agreement_operations_guard();
create trigger council_agreement_job_operations before update of status
on public.jobs for each row execute function private.council_agreement_operations_guard();

-- Show truthful derived validity even if an ACTIVE flag remains after expiry.
create or replace view public.council_pilot_agreement_readiness with(security_invoker=true) as
select b.id as batch_id,b.job_id,b.status as batch_status,b.approved_agreement_id,
 a.revision_number,a.reference,a.status as agreement_status,a.effective_from,a.expires_on,
 a.collection_sites,a.device_categories,a.permitted_activities,a.max_devices,
 (now() at time zone 'Australia/Sydney')::date as today_sydney,
 (a.expires_on-(now() at time zone 'Australia/Sydney')::date) as days_until_expiry,
 private.council_agreement_allows(b.id,'COLLECT') as collection_authorised,
 private.council_agreement_allows(b.id,'DONATE') as donation_authorised,
 private.council_agreement_allows(b.id,'RECYCLE') as recycling_authorised
from public.council_pilot_batches b
left join public.council_pilot_agreements a on a.id=b.approved_agreement_id;
revoke all on public.council_pilot_agreement_readiness from public,anon;
grant select on public.council_pilot_agreement_readiness to authenticated;
