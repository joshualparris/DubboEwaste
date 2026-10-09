-- Repair Cafe event operations v1. Isolated from E-waste/Library inventory.
-- Migrate additively. No real visitor data is seeded or emailed.

alter table public.repair_cafe_shift_slots
 add column starts_at time not null default '10:00',
 add column ends_at time not null default '13:00';
alter table public.repair_cafe_shift_slots add constraint rc_shift_hours_valid check(ends_at>starts_at);
alter table public.repair_cafe_sessions add column deleted_at timestamptz;
alter table public.repair_cafe_manual_volunteers add column deleted_at timestamptz;
alter table public.repair_cafe_venues add column deleted_at timestamptz;
alter table public.repair_cafe_manual_volunteers add column notify_email boolean not null default false;
alter table public.repair_cafe_manual_volunteers add column notify_sms boolean not null default false;
-- Only active events consume a date. Existing records are preserved.
alter table public.repair_cafe_sessions drop constraint if exists repair_cafe_sessions_event_date_key;
create unique index if not exists rc_active_event_date on public.repair_cafe_sessions(event_date) where deleted_at is null;
drop index if exists public.repair_cafe_manual_volunteer_email_unique;
create unique index rc_active_manual_email on public.repair_cafe_manual_volunteers(lower(email))
 where email<>'' and deleted_at is null;
drop index if exists public.repair_cafe_venues_name_unique;
create unique index rc_active_venue_name on public.repair_cafe_venues(lower(name)) where deleted_at is null;

create table public.repair_cafe_venue_contacts(
 id uuid primary key default gen_random_uuid(),
 venue_id uuid not null references public.repair_cafe_venues(id),
 event_id uuid references public.repair_cafe_sessions(id),
 contacted_at timestamptz not null default now(),
 method text not null check(method in ('email','phone','in_person','other')),
 result text not null check(result in ('enquiry','offered','hold','confirmed','declined','cancelled','follow_up')),
 contact_name text not null default '' check(length(contact_name)<=120),
 note text not null default '' check(length(note)<=1500),
 evidence_reference text not null default '' check(length(evidence_reference)<=500),
 created_by uuid default auth.uid()
);
create index rc_venue_contacts_lookup on public.repair_cafe_venue_contacts(venue_id,contacted_at desc);

create table public.repair_cafe_competencies(
 id uuid primary key default gen_random_uuid(),
 user_id uuid references public.profiles(id),
 manual_volunteer_id uuid references public.repair_cafe_manual_volunteers(id),
 course_slug text not null check(length(course_slug) between 2 and 120),
 verification text not null check(verification in ('training','supervised','verified','expired')),
 verified_by uuid references public.profiles(id),
 verified_at timestamptz,
 expires_on date,
 evidence_note text not null default '' check(length(evidence_note)<=500),
 check ((user_id is not null) <> (manual_volunteer_id is not null))
);
create unique index rc_verified_member_course on public.repair_cafe_competencies(user_id,course_slug) where user_id is not null;
create unique index rc_verified_manual_course on public.repair_cafe_competencies(manual_volunteer_id,course_slug) where manual_volunteer_id is not null;

create table public.repair_cafe_visits(
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.repair_cafe_sessions(id),
 queue_no bigint generated always as identity unique,
 visitor_label text not null default 'Visitor' check(length(visitor_label) between 1 and 100),
 contact_note text not null default '' check(length(contact_note)<=200),
 item_category text not null check(length(item_category) between 2 and 100),
 item_description text not null check(length(item_description)<=300),
 fault_reported text not null default '' check(length(fault_reported)<=2000),
 status text not null default 'waiting' check(status in ('waiting','triage','in_repair','completed','declined','departed')),
 station text not null default '' check(length(station)<=100),
 owner_consent boolean not null default false,
 safety_screened boolean not null default false,
 risk_note text not null default '' check(length(risk_note)<=750),
 arrived_at timestamptz not null default now(),
 started_at timestamptz,
 finished_at timestamptz,
 deleted_at timestamptz,
 created_by uuid default auth.uid(),
 check(finished_at is null or finished_at>=arrived_at)
);
create index rc_visits_event_queue on public.repair_cafe_visits(event_id,status,queue_no);
create index rc_visits_active on public.repair_cafe_visits(event_id) where deleted_at is null;

create table public.repair_cafe_visit_consents(
 visit_id uuid primary key references public.repair_cafe_visits(id),
 consent_version text not null default 'pilot-v1',
 agreed_at timestamptz not null default now(),
 recorded_by uuid references public.profiles(id),
 visitor_acknowledged boolean not null check(visitor_acknowledged),
 repair_not_guaranteed boolean not null check(repair_not_guaranteed),
 data_handling_explained boolean not null check(data_handling_explained),
 note text not null default '' check(length(note)<=500)
);

create table public.repair_cafe_repair_tickets(
 visit_id uuid primary key references public.repair_cafe_visits(id),
 observed_fault text not null default '' check(length(observed_fault)<=2000),
 work_performed text not null default '' check(length(work_performed)<=5000),
 parts_used text not null default '' check(length(parts_used)<=1000),
 result text check(result in ('fixed','partly_fixed','repairable','not_fixed','unsafe','referred')),
 barrier text check(barrier in ('none','parts','time','tools','skills','cost','unsafe','other')),
 measured_weight_kg numeric(9,3) check(measured_weight_kg between 0 and 10000),
 item_kept_by_owner boolean not null default true,
 volunteer_user_id uuid references public.profiles(id),
 volunteer_manual_id uuid references public.repair_cafe_manual_volunteers(id),
 updated_at timestamptz not null default now(),
 check(not (volunteer_user_id is not null and volunteer_manual_id is not null))
);

create table public.repair_cafe_incidents(
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.repair_cafe_sessions(id),
 visit_id uuid references public.repair_cafe_visits(id),
 severity text not null check(severity in ('near_miss','minor','major')),
 details text not null check(length(details) between 3 and 3000),
 immediate_action text not null default '' check(length(immediate_action)<=3000),
 follow_up text not null default '' check(length(follow_up)<=2000),
 state text not null default 'open' check(state in ('open','reviewing','closed')),
 recorded_at timestamptz not null default now(),
 recorded_by uuid default auth.uid()
);

create table public.repair_cafe_attendance(
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.repair_cafe_sessions(id),
 user_id uuid references public.profiles(id),
 manual_volunteer_id uuid references public.repair_cafe_manual_volunteers(id),
 check_in_at timestamptz,
 check_out_at timestamptz,
 note text not null default '' check(length(note)<=250),
 updated_by uuid default auth.uid(),
 check((user_id is not null) <> (manual_volunteer_id is not null)),
 check(check_out_at is null or (check_in_at is not null and check_out_at>=check_in_at))
);
create unique index rc_attendance_account_unique on public.repair_cafe_attendance(event_id,user_id) where user_id is not null;
create unique index rc_attendance_manual_unique on public.repair_cafe_attendance(event_id,manual_volunteer_id) where manual_volunteer_id is not null;

create table public.repair_cafe_visit_photos(
 id uuid primary key default gen_random_uuid(),
 visit_id uuid not null references public.repair_cafe_visits(id),
 object_path text not null unique check(length(object_path)<=500),
 mime_type text not null check(mime_type in ('image/jpeg','image/png','image/webp')),
 note text not null default '' check(length(note)<=200),
 uploaded_at timestamptz not null default now(),
 uploaded_by uuid default auth.uid()
);

create table public.repair_cafe_notification_preferences(
 user_id uuid primary key references public.profiles(id),
 email text not null default '' check(length(email)<=254),
 phone text not null default '' check(length(phone)<=40),
 email_opt_in boolean not null default false,
 sms_opt_in boolean not null default false,
 updated_at timestamptz not null default now(),
 check(not email_opt_in or email<>''),
 check(not sms_opt_in or phone<>'')
);
create table public.repair_cafe_notifications(
 id uuid primary key default gen_random_uuid(),
 event_id uuid references public.repair_cafe_sessions(id),
 channel text not null check(channel in ('email','sms')),
 destination text not null check(length(destination) between 3 and 254),
 kind text not null check(kind in ('session_reminder','shift_confirmation','change','cancellation','manual')),
 subject text not null default '' check(length(subject)<=200),
 message text not null check(length(message) between 5 and 2000),
 scheduled_for timestamptz not null default now(),
 state text not null default 'pending' check(state in ('pending','sending','sent','failed','cancelled')),
 attempt_count int not null default 0,
 last_error text not null default '',
 sent_at timestamptz,
 dedupe_key text not null unique,
 created_at timestamptz not null default now()
);
create index rc_notifications_pending on public.repair_cafe_notifications(state,scheduled_for);

create table public.repair_cafe_audit(
 id bigint generated always as identity primary key,
 entity text not null,
 entity_id uuid not null,
 operation text not null check(operation in ('INSERT','UPDATE','DELETE')),
 changed_fields text[] not null default '{}',
 actor uuid,
 occurred_at timestamptz not null default now(),
 event_id uuid,
 metadata jsonb not null default '{}'::jsonb
);
create index rc_audit_entity on public.repair_cafe_audit(entity,entity_id,occurred_at desc);

-- Private photo bucket. Signed URLs require an authenticated programme coordinator.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('repair-cafe-private','repair-cafe-private',false,5242880,array['image/jpeg','image/png','image/webp'])
 on conflict(id) do nothing;
create policy "Repair Cafe coordinators can add photos" on storage.objects
 for insert to authenticated with check(bucket_id='repair-cafe-private' and private.repair_cafe_can_manage());
create policy "Repair Cafe coordinators can read photos" on storage.objects
 for select to authenticated using(bucket_id='repair-cafe-private' and private.repair_cafe_can_manage());
create policy "Repair Cafe coordinators can delete photos" on storage.objects
 for delete to authenticated using(bucket_id='repair-cafe-private' and private.repair_cafe_can_manage());

-- All new operational records are private. No anon access.
do $$
declare tab text;
begin
 foreach tab in array array[
  'repair_cafe_venue_contacts','repair_cafe_competencies','repair_cafe_visits',
  'repair_cafe_visit_consents','repair_cafe_repair_tickets','repair_cafe_incidents',
  'repair_cafe_attendance','repair_cafe_visit_photos','repair_cafe_notification_preferences',
  'repair_cafe_notifications','repair_cafe_audit'
 ] loop
  execute format('alter table public.%I enable row level security',tab);
  execute format('revoke all on public.%I from anon,authenticated',tab);
  execute format('grant select,insert,update,delete on public.%I to authenticated',tab);
  if tab not in ('repair_cafe_notification_preferences','repair_cafe_audit','repair_cafe_notifications') then
   execute format('create policy "coordinators read" on public.%I for select to authenticated using(private.repair_cafe_can_manage())',tab);
   execute format('create policy "coordinators insert" on public.%I for insert to authenticated with check(private.repair_cafe_can_manage())',tab);
   execute format('create policy "coordinators update" on public.%I for update to authenticated using(private.repair_cafe_can_manage()) with check(private.repair_cafe_can_manage())',tab);
   execute format('create policy "coordinators delete" on public.%I for delete to authenticated using(private.repair_cafe_can_manage())',tab);
  end if;
 end loop;
end $$;
create policy "read personal preferences or manage" on public.repair_cafe_notification_preferences
 for select to authenticated using(user_id=auth.uid() or private.repair_cafe_can_manage());
create policy "insert personal preferences" on public.repair_cafe_notification_preferences
 for insert to authenticated with check(user_id=auth.uid() and private.has_program('repair_cafe'));
create policy "update personal preferences" on public.repair_cafe_notification_preferences
 for update to authenticated using(user_id=auth.uid() and private.has_program('repair_cafe'))
 with check(user_id=auth.uid() and private.has_program('repair_cafe'));
create policy "coordinator read outbox" on public.repair_cafe_notifications
 for select to authenticated using(private.repair_cafe_can_manage());
create policy "coordinator enqueue messages" on public.repair_cafe_notifications
 for insert to authenticated with check(private.repair_cafe_can_manage() and state='pending');
create policy "coordinator read audit" on public.repair_cafe_audit
 for select to authenticated using(private.repair_cafe_can_manage());
-- Audit insert via triggers only. No client edit/delete grants.
revoke insert,update,delete on public.repair_cafe_audit from authenticated;
-- Outbox can only be sent by trusted service role, not a web client.
revoke update,delete on public.repair_cafe_notifications from authenticated;

-- Audit only field names, not visitor names, phone numbers, fault descriptions, contact details or images.
create function private.repair_cafe_audit_row() returns trigger
language plpgsql security definer set search_path=''
as $$
declare before_j jsonb; after_j jsonb; keys text[]; oid uuid; ev uuid;
begin
 before_j:=case when tg_op='INSERT' then '{}'::jsonb else to_jsonb(old) end;
 after_j:=case when tg_op='DELETE' then '{}'::jsonb else to_jsonb(new) end;
 select array_agg(k) into keys from (
  select key as k from jsonb_object_keys(before_j||after_j) key
  where before_j->key is distinct from after_j->key
 ) diffs;
 oid:=case when tg_op='DELETE' then old.id else new.id end;
 ev:=case when tg_table_name='repair_cafe_sessions' then oid else null end;
 insert into public.repair_cafe_audit(entity,entity_id,operation,changed_fields,actor,event_id)
 values(tg_table_name,oid,tg_op,coalesce(keys,'{}'),auth.uid(),ev);
 return case when tg_op='DELETE' then old else new end;
end $$;
create trigger rc_event_history after insert or update or delete on public.repair_cafe_sessions
 for each row execute function private.repair_cafe_audit_row();
create trigger rc_venue_history after insert or update or delete on public.repair_cafe_venues
 for each row execute function private.repair_cafe_audit_row();
create trigger rc_manual_volunteer_history after insert or update or delete on public.repair_cafe_manual_volunteers
 for each row execute function private.repair_cafe_audit_row();
create trigger rc_visits_history after insert or update or delete on public.repair_cafe_visits
 for each row execute function private.repair_cafe_audit_row();
create trigger rc_incidents_history after insert or update or delete on public.repair_cafe_incidents
 for each row execute function private.repair_cafe_audit_row();

-- Correct shift conflicts for same person, across event days, including partial shifts.
create function private.repair_cafe_prevent_shift_overlap() returns trigger
language plpgsql security definer set search_path=''
as $$
declare cur_day date; start_t time; end_t time;
begin
 if new.status<>'confirmed' then return new; end if;
 select e.event_date,s.starts_at,s.ends_at into cur_day,start_t,end_t
 from public.repair_cafe_shift_slots s join public.repair_cafe_sessions e on e.id=s.event_id
 where s.id=new.slot_id;
 if cur_day is null then raise exception 'Unknown shift'; end if;
 -- Serialize assignments per volunteer to avoid simultaneous double booking.
 perform pg_advisory_xact_lock(hashtextextended(coalesce(new.user_id::text,new.manual_volunteer_id::text),0));
 if exists(
 select 1 from public.repair_cafe_shift_assignments a
 join public.repair_cafe_shift_slots s on s.id=a.slot_id
 join public.repair_cafe_sessions e on e.id=s.event_id
 where a.id<>new.id and a.status='confirmed'
 and e.event_date=cur_day
 and ((new.user_id is not null and a.user_id=new.user_id)
   or (new.manual_volunteer_id is not null and a.manual_volunteer_id=new.manual_volunteer_id))
 and s.starts_at<end_t and s.ends_at>start_t
 ) then raise exception 'Volunteer already has an overlapping confirmed shift'; end if;
 return new;
end $$;
create trigger rc_shift_overlap before insert or update of status,slot_id,user_id,manual_volunteer_id
 on public.repair_cafe_shift_assignments for each row
 execute function private.repair_cafe_prevent_shift_overlap();

-- Do not allow event publication of an archived record.
create function private.repair_cafe_archived_event_guard() returns trigger
language plpgsql set search_path=''
as $$
begin
 if new.deleted_at is not null and new.status='published' then
  raise exception 'Archived events cannot be publicly published'; end if;
 return new;
end $$;
create trigger rc_archived_event_guard before insert or update on public.repair_cafe_sessions
 for each row execute function private.repair_cafe_archived_event_guard();
