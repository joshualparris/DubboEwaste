-- Risk management for 20-device Council pilot. No assumed Council risk matrix.
-- Approval requires real documented assessment criteria, independent review and proof of controls.
create table public.council_risk_frameworks (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.council_pilot_batches(id) on delete restrict,
  version integer not null check(version>=1),
  status text not null default 'DRAFT' check(status in('DRAFT','VERIFIED','RETIRED')),
  origin text not null default 'UNCONFIRMED' check(origin in('UNCONFIRMED','COUNCIL_SUPPLIED','COUNCIL_ACCEPTED_OPERATOR')),
  source_reference text not null default '',
  source_evidence_id uuid references public.evidence(id),
  likelihood_codes text[] not null default '{}'::text[],
  consequence_codes text[] not null default '{}'::text[],
  notes text not null default '',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  unique(batch_id,version)
);
create unique index council_one_risk_framework on public.council_risk_frameworks(batch_id) where status='VERIFIED';
create table public.council_risk_matrix_cells (
  id uuid primary key default gen_random_uuid(),
  framework_id uuid not null references public.council_risk_frameworks(id) on delete restrict,
  likelihood_code text not null,
  consequence_code text not null,
  rating text not null check(rating in ('LOW','MODERATE','HIGH','EXTREME')),
  response_instruction text not null default '',
  unique(framework_id,likelihood_code,consequence_code)
);
create table public.council_risks (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.council_pilot_batches(id) on delete restrict,
  reference text not null check(length(trim(reference))>=3),
  category text not null check(category in('SAFETY','FIRE_BATTERY','DATA_PRIVACY','CUSTODY','ELECTRICAL','TRANSPORT','ENVIRONMENT','GOVERNANCE','INSURANCE','BUSINESS_CONTINUITY','FRAUD','PROJECT_DELIVERY','OTHER')),
  classification text not null default 'PROJECT' check(classification in('PROJECT','OPERATIONAL','STRATEGIC')),
  hazard text not null check(length(trim(hazard))>=10),
  cause text not null default '',
  consequence text not null default '',
  affected_people text not null default '',
  legal_or_policy_basis text not null default '',
  owner_id uuid references public.profiles(id),
  status text not null default 'OPEN' check(status in('OPEN','MONITORING','CLOSED')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(batch_id,reference)
);
create table public.council_risk_controls (
  id uuid primary key default gen_random_uuid(),
  risk_id uuid not null references public.council_risks(id) on delete restrict,
  hierarchy text not null check(hierarchy in('ELIMINATION','SUBSTITUTION','ISOLATION','ENGINEERING','ADMINISTRATIVE','PPE')),
  description text not null check(length(trim(description))>=12),
  critical boolean not null default false,
  owner_id uuid not null references public.profiles(id),
  due_on date not null,
  next_review_on date,
  status text not null default 'PLANNED' check(status in('PLANNED','IMPLEMENTED','VERIFIED','FAILED')),
  evidence_id uuid references public.evidence(id),
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.council_risk_assessments (
  id uuid primary key default gen_random_uuid(),
  risk_id uuid not null references public.council_risks(id) on delete restrict,
  framework_id uuid not null references public.council_risk_frameworks(id),
  version integer not null check(version>=1),
  status text not null default 'DRAFT' check(status in('DRAFT','APPROVED','SUPERSEDED')),
  inherent_likelihood text not null,
  inherent_consequence text not null,
  residual_likelihood text not null,
  residual_consequence text not null,
  inherent_rating text,
  residual_rating text,
  assessment_reasoning text not null check(length(trim(assessment_reasoning))>=15),
  treatment_plan text not null check(length(trim(treatment_plan))>=15),
  consultation_summary text not null default '',
  review_due date not null,
  evidence_id uuid references public.evidence(id),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  unique(risk_id,version)
);
create unique index council_one_risk_assessment on public.council_risk_assessments(risk_id) where status='APPROVED';

create table public.council_risk_actions (
  id uuid primary key default gen_random_uuid(),
  risk_id uuid not null references public.council_risks(id) on delete restrict,
  description text not null check(length(trim(description))>=12),
  owner_id uuid not null references public.profiles(id),
  due_on date not null,
  status text not null default 'OPEN' check(status in('OPEN','IN_PROGRESS','VERIFIED')),
  closure_evidence_id uuid references public.evidence(id),
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
create table public.council_risk_incidents (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.council_pilot_batches(id) on delete restrict,
  risk_id uuid references public.council_risks(id),
  category text not null check(category in('INJURY','NEAR_MISS','FIRE','BATTERY','ELECTRICAL','DATA_BREACH','LOST_DEVICE','THEFT','ENVIRONMENT','OTHER')),
  severity text not null check(severity in('NEAR_MISS','MINOR','SERIOUS','CRITICAL')),
  occurred_at timestamptz not null,
  description text not null check(length(trim(description))>=15),
  immediate_actions text not null check(length(trim(immediate_actions))>=10),
  status text not null default 'OPEN' check(status in('OPEN','UNDER_REVIEW','CLOSED')),
  notified_authorities text not null default '',
  notification_reference text not null default '',
  evidence_id uuid references public.evidence(id),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  closed_by uuid references public.profiles(id),
  closed_at timestamptz,
  closure_reason text
);
create table public.council_risk_audit (
  id bigint generated always as identity primary key,
  batch_id uuid not null references public.council_pilot_batches(id) on delete restrict,
  object_type text not null check(object_type in('FRAMEWORK','MATRIX','RISK','CONTROL','ASSESSMENT','ACTION','INCIDENT')),
  object_id uuid not null,
  event text not null,
  actor_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);
create index council_risk_by_batch on public.council_risks(batch_id,category);
create index council_risk_incident_by_batch on public.council_risk_incidents(batch_id,status);
create index council_risk_control_by_risk on public.council_risk_controls(risk_id,status);
create index council_risk_assessment_by_risk on public.council_risk_assessments(risk_id,created_at desc);
create index council_risk_audit_by_batch on public.council_risk_audit(batch_id,created_at desc);

alter table public.council_risk_frameworks enable row level security;
alter table public.council_risk_matrix_cells enable row level security;
alter table public.council_risks enable row level security;
alter table public.council_risk_controls enable row level security;
alter table public.council_risk_assessments enable row level security;
alter table public.council_risk_actions enable row level security;
alter table public.council_risk_incidents enable row level security;
alter table public.council_risk_audit enable row level security;

-- RLS is scoped by programme, not merely authenticated status.
grant select,insert,update on public.council_risk_frameworks,public.council_risk_matrix_cells,public.council_risks,
 public.council_risk_controls,public.council_risk_assessments,public.council_risk_actions,public.council_risk_incidents to authenticated;
grant select on public.council_risk_audit to authenticated;
revoke all on public.council_risk_frameworks,public.council_risk_matrix_cells,public.council_risks,
 public.council_risk_controls,public.council_risk_assessments,public.council_risk_actions,
 public.council_risk_incidents,public.council_risk_audit from anon;
do $pol$
declare n text; begin
 foreach n in array array['council_risk_frameworks','council_risk_matrix_cells','council_risks',
  'council_risk_controls','council_risk_assessments','council_risk_actions','council_risk_incidents'] loop
 execute format('create policy %I on public.%I for select to authenticated using (private.is_ewaste_pilot_operator())',n||'_read',n);
 execute format('create policy %I on public.%I for insert to authenticated with check (private.is_ewaste_pilot_supervisor())',n||'_insert',n);
 execute format('create policy %I on public.%I for update to authenticated using (private.is_ewaste_pilot_supervisor()) with check (private.is_ewaste_pilot_supervisor())',n||'_update',n);
 end loop;
end $pol$;

-- Technicians may report genuine safety incidents; only supervisors may close them.
drop policy council_risk_incidents_insert on public.council_risk_incidents;
create policy council_risk_incidents_insert on public.council_risk_incidents for insert to authenticated
 with check (private.is_ewaste_pilot_operator() and created_by=auth.uid());
create policy council_risk_audit_read on public.council_risk_audit for select to authenticated
 using(private.is_ewaste_pilot_operator());

create or replace function private.risk_same_batch_evidence(p_id uuid,p_batch uuid)
returns boolean language sql stable security definer set search_path=''
as $f$
 select exists(select 1 from public.evidence e join public.council_pilot_batches b
  on b.job_id=e.entity_id and b.id=p_batch
  where e.id=p_id and e.entity_type='job' and e.programme='dubbo_ewaste'
    and length(coalesce(e.sha256,''))=64 and length(coalesce(e.storage_key,''))>0)
$f$;
revoke all on function private.risk_same_batch_evidence(uuid,uuid) from public,anon,authenticated;

create or replace function private.risk_matrix_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
declare fw public.council_risk_frameworks%rowtype;
begin
 select * into fw from public.council_risk_frameworks where id=new.framework_id;
 if not found or fw.status<>'DRAFT' then raise exception 'Matrix cells belong to a DRAFT framework only';end if;
 if not (new.likelihood_code=any(fw.likelihood_codes)) or not (new.consequence_code=any(fw.consequence_codes)) then
  raise exception 'Matrix coordinate not in supplied scales';end if;
 return new;
end $f$;
revoke all on function private.risk_matrix_guard() from public,anon,authenticated;
create trigger council_risk_matrix_guard before insert or update on public.council_risk_matrix_cells
for each row execute function private.risk_matrix_guard();

create or replace function private.risk_framework_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
declare v_job uuid; v_count int; v_expected int;
begin
 select job_id into v_job from public.council_pilot_batches where id=new.batch_id for update;
 if v_job is null then raise exception 'Unknown Council batch'; end if;
 if tg_op='INSERT' then
  if new.created_by is distinct from auth.uid() or new.status<>'DRAFT' then
   raise exception 'Framework must start as an attributed DRAFT';end if;
  select coalesce(max(version),0)+1 into v_expected from public.council_risk_frameworks where batch_id=new.batch_id;
  if new.version<>v_expected then raise exception 'Risk framework versions must be sequential';end if;
 else
  if old.status<>'DRAFT' then
   if new.status<>'RETIRED' or
    (to_jsonb(new)-'status') is distinct from (to_jsonb(old)-'status') then
     raise exception 'Verified framework is immutable; create a new version';end if;
  elsif new.status='VERIFIED' then
   if new.verified_by is distinct from auth.uid() or new.created_by=auth.uid() then
    raise exception 'Independent supervisor must verify the risk framework';end if;
   if new.origin not in ('COUNCIL_SUPPLIED','COUNCIL_ACCEPTED_OPERATOR')
     or length(trim(new.source_reference))<5
     or not private.risk_same_batch_evidence(new.source_evidence_id,new.batch_id)
     or cardinality(new.likelihood_codes)<2 or cardinality(new.consequence_codes)<2
     or cardinality(new.likelihood_codes)>7 or cardinality(new.consequence_codes)>7
     or array_position(new.likelihood_codes,'') is not null
     or array_position(new.consequence_codes,'') is not null
   then raise exception 'Source evidence, authorised origin and complete documented scales required';end if;
   select count(*) into v_count from public.council_risk_matrix_cells where framework_id=new.id;
   if v_count<>cardinality(new.likelihood_codes)*cardinality(new.consequence_codes)
      or exists(select 1 from unnest(new.likelihood_codes) l cross join unnest(new.consequence_codes) c
        where not exists(select 1 from public.council_risk_matrix_cells m
          where m.framework_id=new.id and m.likelihood_code=l and m.consequence_code=c))
   then raise exception 'Every likelihood/consequence matrix cell must be explicitly recorded';end if;
   new.verified_at=now();
  elsif new.status<>'DRAFT' then raise exception 'Cannot skip framework review';end if;
  if old.batch_id<>new.batch_id or old.version<>new.version or old.created_by<>new.created_by then
    raise exception 'Framework identity and attribution immutable';end if;
 end if;
 return new;
end $f$;
revoke all on function private.risk_framework_guard() from public,anon,authenticated;
create trigger council_risk_framework_guard before insert or update on public.council_risk_frameworks
for each row execute function private.risk_framework_guard();

create or replace function private.risk_assessment_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
declare rr public.council_risks%rowtype; fw public.council_risk_frameworks%rowtype; inh text; res text;
begin
 select * into rr from public.council_risks where id=new.risk_id;
 select * into fw from public.council_risk_frameworks where id=new.framework_id;
 if rr.id is null or fw.id is null or rr.batch_id<>fw.batch_id then raise exception 'Risk and matrix batch mismatch';end if;
 if tg_op='INSERT' then
  if new.created_by is distinct from auth.uid() or new.status<>'DRAFT' then raise exception 'Assessment must start DRAFT';end if;
  if new.version<>(select coalesce(max(version),0)+1 from public.council_risk_assessments where risk_id=new.risk_id) then
    raise exception 'Assessment revision must be consecutive';end if;
 elsif tg_op='UPDATE' and (new.risk_id<>old.risk_id or new.framework_id<>old.framework_id or new.created_by<>old.created_by or new.version<>old.version) then
  raise exception 'Risk assessment identity and authorship cannot change';
 elsif old.status='APPROVED' then
  if new.status<>'SUPERSEDED' or (to_jsonb(new)-'status') is distinct from (to_jsonb(old)-'status') then
    raise exception 'Approved assessment is immutable; create a new revision';end if;
 elsif old.status<>'DRAFT' then
  raise exception 'Superseded assessment is immutable';
 elsif new.status='APPROVED' then
  if fw.status<>'VERIFIED' or new.approved_by is distinct from auth.uid() or new.created_by=auth.uid()
    or rr.owner_id is null or new.review_due < (now() at time zone 'Australia/Sydney')::date
    or new.evidence_id is null or not private.risk_same_batch_evidence(new.evidence_id,rr.batch_id)
    or length(trim(new.consultation_summary))<12
  then raise exception 'Approval requires verified source matrix, separate assessor/approver, owner, worker consultation, dated review and job evidence';end if;
  if not exists(select 1 from public.council_risk_controls where risk_id=rr.id and status='VERIFIED')
    or exists(select 1 from public.council_risk_controls where risk_id=rr.id and
       (status<>'VERIFIED' or next_review_on is null or next_review_on < (now() at time zone 'Australia/Sydney')::date))
  then raise exception 'All risk controls need current independent verification';end if;
  if exists(select 1 from public.council_risk_actions where risk_id=rr.id and status<>'VERIFIED')
  then raise exception 'Open corrective actions block risk acceptance';end if;
  if exists(select 1 from public.council_risk_assessments where risk_id=rr.id and status='APPROVED' and id<>new.id)
  then raise exception 'Supersede previous approved assessment before accepting another';end if;
  new.approved_at=now();
 end if;
 if new.status in ('DRAFT','APPROVED') then
  if not (new.inherent_likelihood=any(fw.likelihood_codes))
    or not (new.inherent_consequence=any(fw.consequence_codes))
    or not (new.residual_likelihood=any(fw.likelihood_codes))
    or not (new.residual_consequence=any(fw.consequence_codes))
  then raise exception 'Assessment codes must match documented source matrix';end if;
  select m.rating into inh from public.council_risk_matrix_cells m where m.framework_id=fw.id
     and m.likelihood_code=new.inherent_likelihood and m.consequence_code=new.inherent_consequence;
  select m.rating into res from public.council_risk_matrix_cells m where m.framework_id=fw.id
     and m.likelihood_code=new.residual_likelihood and m.consequence_code=new.residual_consequence;
  if new.status='APPROVED' and (inh is null or res is null) then raise exception 'Matrix cells missing';end if;
  new.inherent_rating=inh; new.residual_rating=res;
 end if;
 return new;
end $f$;
revoke all on function private.risk_assessment_guard() from public,anon,authenticated;
create trigger council_risk_assessment_guard before insert or update on public.council_risk_assessments
for each row execute function private.risk_assessment_guard();

create or replace function private.risk_register_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
begin
 if tg_op='UPDATE' then
  if new.batch_id<>old.batch_id or new.reference<>old.reference or new.created_by<>old.created_by
  then raise exception 'Risk reference, attribution and batch are immutable';end if;
 end if;
 if new.status='MONITORING' then
  if new.owner_id is null or not exists (
   select 1 from public.council_risk_assessments a where a.risk_id=new.id
     and a.status='APPROVED' and a.review_due>=(now() at time zone 'Australia/Sydney')::date
  ) then raise exception 'Cannot monitor risk without approved current independent assessment';end if;
 end if;
 if new.status='CLOSED' and exists(select 1 from public.council_pilot_batches
  where id=new.batch_id and status='ACTIVE')
 then raise exception 'Active Council pilot risk cannot be silently closed';end if;
 new.updated_at=now();return new;
end $f$;
revoke all on function private.risk_register_guard() from public,anon,authenticated;
create trigger council_risk_register_guard before insert or update on public.council_risks
for each row execute function private.risk_register_guard();

create or replace function private.risk_control_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
declare v_batch uuid;
begin
 select batch_id into v_batch from public.council_risks where id=new.risk_id;
 if v_batch is null then raise exception 'Risk not found'; end if;
 if tg_op='UPDATE' then
  if new.risk_id<>old.risk_id or new.created_by<>old.created_by then raise exception 'Control identity immutable';end if;
  if old.status='VERIFIED' and new.status='VERIFIED' and
    (to_jsonb(new)-'updated_at') is distinct from (to_jsonb(old)-'updated_at')
    then raise exception 'Verified controls cannot be silently rewritten; mark FAILED and reassess';end if;
 end if;
 if new.status='VERIFIED' then
  if new.verified_by is distinct from auth.uid() or new.verified_by=new.created_by
    or new.next_review_on is null or new.next_review_on < (now() at time zone 'Australia/Sydney')::date
    or not private.risk_same_batch_evidence(new.evidence_id,v_batch) then
    raise exception 'Control verification requires independent reviewer and hashed job evidence';end if;
  if tg_op='INSERT' or old.status is distinct from new.status then new.verified_at=now();end if;
 else
  new.verified_at=null;new.verified_by=null;
 end if;
 new.updated_at=now();return new;
end $f$;
revoke all on function private.risk_control_guard() from public,anon,authenticated;
create trigger council_risk_control_guard before insert or update on public.council_risk_controls
for each row execute function private.risk_control_guard();

create or replace function private.risk_action_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
declare v_batch uuid;
begin
 select batch_id into v_batch from public.council_risks where id=new.risk_id;
 if tg_op='UPDATE' and (new.risk_id<>old.risk_id or new.created_by<>old.created_by) then
  raise exception 'Risk action identity immutable';end if;
 if new.status='VERIFIED' then
  if new.verified_by is distinct from auth.uid() or new.verified_by=new.created_by or
    not private.risk_same_batch_evidence(new.closure_evidence_id,v_batch) then
   raise exception 'Closure requires different verifier and original hashed evidence';end if;
  if tg_op='INSERT' or old.status is distinct from new.status then new.verified_at=now();end if;
 end if;
 return new;
end $f$;
revoke all on function private.risk_action_guard() from public,anon,authenticated;
create trigger council_risk_action_guard before insert or update on public.council_risk_actions
for each row execute function private.risk_action_guard();

create or replace function private.risk_incident_guard()
returns trigger language plpgsql security definer set search_path=''
as $f$
begin
 if tg_op='INSERT' then
  if new.created_by is distinct from auth.uid() then raise exception 'Reporter identity required';end if;
  if new.risk_id is not null and not exists(select 1 from public.council_risks where id=new.risk_id and batch_id=new.batch_id) then
   raise exception 'Incident references a risk outside the Council pilot';end if;
 elsif old.status='CLOSED' then raise exception 'Closed incident immutable';
 elsif new.batch_id<>old.batch_id or new.risk_id is distinct from old.risk_id
   or new.severity<>old.severity or new.category<>old.category
   or new.created_by<>old.created_by or new.description<>old.description
   or new.occurred_at<>old.occurred_at then
   raise exception 'Reported incident details are immutable; add a correction in the audit notes';
 elsif new.status='CLOSED' then
  if new.closed_by is distinct from auth.uid() or new.closed_by=old.created_by
     or length(trim(coalesce(new.closure_reason,'')))<15
     or not private.risk_same_batch_evidence(new.evidence_id,new.batch_id) then
    raise exception 'Independent closure, explanation and original hashed evidence required';end if;
  new.closed_at=now();
 end if;
 return new;
end $f$;
revoke all on function private.risk_incident_guard() from public,anon,authenticated;
create trigger council_risk_incident_guard before insert or update on public.council_risk_incidents
for each row execute function private.risk_incident_guard();

create or replace function private.risk_stop_work()
returns trigger language plpgsql security definer set search_path=''
as $f$
begin
 if new.severity in ('SERIOUS','CRITICAL') and new.status<>'CLOSED' then
   update public.council_pilot_batches set status='PAUSED' where id=new.batch_id and status='ACTIVE';
 end if;
 return new;
end $f$;
revoke all on function private.risk_stop_work() from public,anon,authenticated;
create trigger council_risk_stop_work after insert or update of severity,status
on public.council_risk_incidents for each row execute function private.risk_stop_work();

-- Append-only change log, no DELETE or UPDATE privileges for operational tables.
create or replace function private.council_risk_audit_trigger()
returns trigger language plpgsql security definer set search_path=''
as $f$
declare b uuid; obj uuid;
begin
 if tg_table_name='council_risks' or tg_table_name='council_risk_incidents' or tg_table_name='council_risk_frameworks' then
  b=new.batch_id;obj=new.id;
 elsif tg_table_name='council_risk_matrix_cells' then
  select batch_id into b from public.council_risk_frameworks where id=new.framework_id; obj=new.id;
 else
  select batch_id into b from public.council_risks where id=new.risk_id; obj=new.id;
 end if;
 insert into public.council_risk_audit(batch_id,object_type,object_id,event,actor_id,old_data,new_data)
 values(b,case tg_table_name
  when 'council_risks' then 'RISK' when 'council_risk_frameworks' then 'FRAMEWORK'
  when 'council_risk_matrix_cells' then 'MATRIX'
  when 'council_risk_assessments' then 'ASSESSMENT'
  when 'council_risk_controls' then 'CONTROL'
  when 'council_risk_actions' then 'ACTION'
  else 'INCIDENT' end,
  obj,tg_op,auth.uid(),case when tg_op='UPDATE' then to_jsonb(old) else null end,to_jsonb(new));
 return new;
end $f$;
revoke all on function private.council_risk_audit_trigger() from public,anon,authenticated;
do $audit$
declare n text;begin
 foreach n in array array['council_risk_frameworks','council_risk_matrix_cells','council_risks',
  'council_risk_controls','council_risk_assessments','council_risk_actions','council_risk_incidents'] loop
 execute format('create trigger %I after insert or update on public.%I for each row execute function private.council_risk_audit_trigger()',n||'_audit',n);
 end loop;end $audit$;

-- Whole-pilot risk go/no-go: no false claim of Council matrix acceptance.
create or replace function private.council_risk_ready(p_batch uuid)
returns boolean language plpgsql stable security definer set search_path=''
as $f$
declare r record; req text; total int;
begin
 if not exists(select 1 from public.council_risk_frameworks f where f.batch_id=p_batch and f.status='VERIFIED') then return false;end if;
 select count(*) into total from public.council_risks where batch_id=p_batch;
 if total<10 then return false;end if;
 foreach req in array array['SAFETY','FIRE_BATTERY','DATA_PRIVACY','CUSTODY','ELECTRICAL','TRANSPORT',
  'ENVIRONMENT','GOVERNANCE','INSURANCE','BUSINESS_CONTINUITY'] loop
  if not exists(select 1 from public.council_risks where batch_id=p_batch and category=req and status='MONITORING') then return false;end if;
 end loop;
 for r in select id,owner_id from public.council_risks where batch_id=p_batch loop
  if r.owner_id is null then return false;end if;
  if not exists(select 1 from public.council_risk_assessments
   where risk_id=r.id and status='APPROVED' and review_due>=(now() at time zone 'Australia/Sydney')::date) then return false;end if;
  if not exists(select 1 from public.council_risk_controls where risk_id=r.id and status='VERIFIED') then return false;end if;
  if exists(select 1 from public.council_risk_controls where risk_id=r.id and (status<>'VERIFIED' or next_review_on is null or next_review_on<(now() at time zone 'Australia/Sydney')::date)) then return false;end if;
  if exists(select 1 from public.council_risk_actions where risk_id=r.id and status<>'VERIFIED') then return false;end if;
 end loop;
 if exists(select 1 from public.council_risk_incidents where batch_id=p_batch and status<>'CLOSED' and severity in('SERIOUS','CRITICAL')) then return false;end if;
 return true;
end $f$;
revoke all on function private.council_risk_ready(uuid) from public,anon;
grant execute on function private.council_risk_ready(uuid) to authenticated;

create or replace function private.council_risk_batch_gate()
returns trigger language plpgsql security definer set search_path=''
as $f$
begin
 if new.status='ACTIVE' and (tg_op='INSERT' or old.status is distinct from new.status) then
  if not private.council_risk_ready(new.id) then
   raise exception 'Council risk gate BLOCKED: verified source matrix, 10 approved risk categories, independent controls, reviews and incident closeout required';end if;
 end if;
 return new;
end $f$;
revoke all on function private.council_risk_batch_gate() from public,anon,authenticated;
create trigger council_risk_batch_gate before insert or update of status on public.council_pilot_batches
 for each row execute function private.council_risk_batch_gate();

-- Runtime guard against overdue controls after a batch was already active.
create or replace function private.council_risk_operations_gate()
returns trigger language plpgsql security definer set search_path=''
as $f$
declare b uuid; j uuid;
begin
 if tg_table_name='assets' then
  if tg_op='UPDATE' and new.status in ('HOLD','REJECTED') then return new;end if;
  j=new.job_id;
 elsif tg_table_name='jobs' then
  if new.status in ('DRAFT','CANCELLED') then return new;end if;
  j=new.id;
 elsif tg_table_name='pilot_custody_events' then
  if new.event_type in ('QUARANTINED','RETURNED') then return new;end if;
  select job_id into j from public.assets where id=new.asset_id;
 elsif tg_table_name='dispositions' then
  if new.disposition_type in ('HOLD','REJECT','RETURN') then return new;end if;
  select job_id into j from public.assets where id=new.asset_id;
 else return new;end if;
 select id into b from public.council_pilot_batches where job_id=j;
 if b is not null and not private.council_risk_ready(b) then
   raise exception 'Council risk STOP WORK: missing/overdue assessment, failed control, corrective action or serious incident';end if;
 return new;
end $f$;
revoke all on function private.council_risk_operations_gate() from public,anon,authenticated;
create trigger council_risk_asset_gate before insert or update of job_id,status on public.assets
 for each row execute function private.council_risk_operations_gate();
create trigger council_risk_job_gate before update of status on public.jobs
 for each row execute function private.council_risk_operations_gate();
create trigger council_risk_custody_gate before insert on public.pilot_custody_events
 for each row execute function private.council_risk_operations_gate();
create trigger council_risk_disposition_gate before insert or update of disposition_type on public.dispositions
 for each row execute function private.council_risk_operations_gate();

create or replace view public.council_risk_dashboard with(security_invoker=true) as
select b.id as batch_id,b.job_id,b.status batch_status,
 (select count(*) from public.council_risks r where r.batch_id=b.id) risk_count,
 (select count(*) from public.council_risks r where r.batch_id=b.id and r.status='MONITORING') monitored_count,
 (select count(*) from public.council_risk_controls c join public.council_risks r on r.id=c.risk_id
   where r.batch_id=b.id and c.status<>'VERIFIED') unverified_controls,
 (select count(*) from public.council_risk_actions a join public.council_risks r on r.id=a.risk_id
   where r.batch_id=b.id and a.status<>'VERIFIED') open_actions,
 (select count(*) from public.council_risk_incidents i where i.batch_id=b.id and i.status<>'CLOSED') open_incidents,
 (select count(*) from public.council_risk_assessments a join public.council_risks r on r.id=a.risk_id
   where r.batch_id=b.id and a.status='APPROVED' and a.review_due<(now() at time zone 'Australia/Sydney')::date) overdue_reviews,
 private.council_risk_ready(b.id) ready
from public.council_pilot_batches b;
revoke all on public.council_risk_dashboard from public,anon;
grant select on public.council_risk_dashboard to authenticated;
