-- Repair Café outreach CRM, private to programme coordinators.
-- 2026-10-13: add-on to existing programme auth, no public browsing or signup.
create table if not exists public.repair_cafe_outreach_contacts (
 id uuid primary key default gen_random_uuid(),
 email text not null check(length(trim(email)) between 5 and 254 and position('@' in email)>1),
 organisation_name text not null default '' check(length(organisation_name)<=180),
 town text not null default '' check(length(town)<=100),
 state text not null default '' check(state in ('','NSW','ACT','VIC','QLD','SA','WA','TAS','NT')),
 website text not null default '' check(length(website)<=500),
 contact_name text not null default '' check(length(contact_name)<=160),
 phone text not null default '' check(length(phone)<=80),
 venue_description text not null default '' check(length(venue_description)<=500),
 legal_structure text not null default '' check(length(legal_structure)<=500),
 insurer text not null default '' check(length(insurer)<=180),
 public_liability text not null default '' check(length(public_liability)<=500),
 products_liability text not null default '' check(length(products_liability)<=500),
 volunteer_cover text not null default '' check(length(volunteer_cover)<=500),
 device_damage_cover text not null default '' check(length(device_damage_cover)<=500),
 annual_premium_aud numeric(12,2) check(annual_premium_aud>=0),
 funding_source text not null default '' check(length(funding_source)<=500),
 insurance_notes text not null default '' check(length(insurance_notes)<=3000),
 evidence_url text not null default '' check(length(evidence_url)<=500),
 notes text not null default '' check(length(notes)<=5000),
 contact_status text not null default 'sent' check(contact_status in ('sent','auto_acknowledged','human_replied','follow_up','bounced','closed')),
 contacted_on date,
 follow_up_on date,
 last_response_on date,
 created_by uuid default auth.uid(),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create unique index if not exists rc_outreach_contact_email_unique on public.repair_cafe_outreach_contacts (lower(email));
create index if not exists rc_outreach_status_next on public.repair_cafe_outreach_contacts (contact_status,follow_up_on);
create table if not exists public.repair_cafe_outreach_correspondence (
 id uuid primary key default gen_random_uuid(),
 contact_id uuid not null references public.repair_cafe_outreach_contacts(id) on delete cascade,
 happened_at timestamptz not null default now(),
 kind text not null check(kind in ('sent','auto_acknowledgement','human_reply','follow_up','phone_call','note','bounce')),
 subject text not null default '' check(length(subject)<=300),
 summary text not null default '' check(length(summary)<=5000),
 source_email text not null default '' check(length(source_email)<=254),
 gmail_message_id text not null default '' check(length(gmail_message_id)<=120),
 gmail_url text not null default '' check(length(gmail_url)<=600),
 created_by uuid default auth.uid(),
 created_at timestamptz not null default now()
);
create unique index if not exists rc_outreach_correspondence_source_unique on public.repair_cafe_outreach_correspondence (contact_id,gmail_message_id) where gmail_message_id<>'';
create index if not exists rc_outreach_correspondence_lookup on public.repair_cafe_outreach_correspondence (contact_id,happened_at desc);
alter table public.repair_cafe_outreach_contacts enable row level security;
alter table public.repair_cafe_outreach_correspondence enable row level security;
revoke all on public.repair_cafe_outreach_contacts,public.repair_cafe_outreach_correspondence from anon,authenticated;
grant select,insert,update,delete on public.repair_cafe_outreach_contacts,public.repair_cafe_outreach_correspondence to authenticated;
create policy "rc outreach coordinators read contacts" on public.repair_cafe_outreach_contacts for select to authenticated using ((select private.repair_cafe_can_manage()));
create policy "rc outreach coordinators add contacts" on public.repair_cafe_outreach_contacts for insert to authenticated with check ((select private.repair_cafe_can_manage()));
create policy "rc outreach coordinators edit contacts" on public.repair_cafe_outreach_contacts for update to authenticated using ((select private.repair_cafe_can_manage())) with check ((select private.repair_cafe_can_manage()));
create policy "rc outreach coordinators remove contacts" on public.repair_cafe_outreach_contacts for delete to authenticated using ((select private.repair_cafe_can_manage()));
create policy "rc outreach coordinators read correspondence" on public.repair_cafe_outreach_correspondence for select to authenticated using ((select private.repair_cafe_can_manage()));
create policy "rc outreach coordinators add correspondence" on public.repair_cafe_outreach_correspondence for insert to authenticated with check ((select private.repair_cafe_can_manage()) and exists (select 1 from public.repair_cafe_outreach_contacts c where c.id=contact_id));
create policy "rc outreach coordinators edit correspondence" on public.repair_cafe_outreach_correspondence for update to authenticated using ((select private.repair_cafe_can_manage())) with check ((select private.repair_cafe_can_manage()));
create policy "rc outreach coordinators delete correspondence" on public.repair_cafe_outreach_correspondence for delete to authenticated using ((select private.repair_cafe_can_manage()));
comment on table public.repair_cafe_outreach_contacts is 'Private insurance outreach CRM. Coordinator-only RLS; never show publicly.';
comment on table public.repair_cafe_outreach_correspondence is 'Private provenance-linked manual correspondence. No automatic Gmail sync.';