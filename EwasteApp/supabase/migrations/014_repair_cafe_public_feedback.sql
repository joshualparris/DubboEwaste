-- Public Repair Cafe Dubbo interest / feedback capture.
-- Public can INSERT only. No public SELECT/UPDATE/DELETE access.
create table if not exists public.repair_cafe_public_feedback (
  id uuid primary key default gen_random_uuid(),
  participation text[] not null default '{}'::text[],
  repair_interests text[] not null default '{}'::text[],
  volunteer_roles text[] not null default '{}'::text[],
  experience_level text,
  preferred_venue text,
  venue_suggestion text,
  preferred_times text[] not null default '{}'::text[],
  counterfactual text,
  ideas text,
  accessibility_notes text,
  first_name text,
  postcode text,
  email text,
  contact_consent boolean not null default false,
  privacy_acknowledged boolean not null default false,
  source text not null default 'repair-cafe-dubbo-web',
  created_at timestamptz not null default now(),
  constraint repair_cafe_feedback_participation_len check (cardinality(participation) <= 8),
  constraint repair_cafe_feedback_repair_interests_len check (cardinality(repair_interests) <= 16),
  constraint repair_cafe_feedback_volunteer_roles_len check (cardinality(volunteer_roles) <= 16),
  constraint repair_cafe_feedback_times_len check (cardinality(preferred_times) <= 8),
  constraint repair_cafe_feedback_experience check (
    experience_level is null or experience_level in ('LEARN','BEGINNER','HOBBYIST','EXPERIENCED','TRADE_PRO')
  ),
  constraint repair_cafe_feedback_first_name_len check (first_name is null or char_length(first_name) <= 80),
  constraint repair_cafe_feedback_postcode_len check (postcode is null or char_length(postcode) <= 12),
  constraint repair_cafe_feedback_email_len check (email is null or char_length(email) <= 254),
  constraint repair_cafe_feedback_venue_len check (preferred_venue is null or char_length(preferred_venue) <= 120),
  constraint repair_cafe_feedback_venue_suggestion_len check (venue_suggestion is null or char_length(venue_suggestion) <= 800),
  constraint repair_cafe_feedback_ideas_len check (ideas is null or char_length(ideas) <= 2000),
  constraint repair_cafe_feedback_accessibility_len check (accessibility_notes is null or char_length(accessibility_notes) <= 1000),
  constraint repair_cafe_feedback_counterfactual_len check (counterfactual is null or char_length(counterfactual) <= 120),
  constraint repair_cafe_feedback_privacy_required check (privacy_acknowledged = true),
  constraint repair_cafe_feedback_contact_email check (
    contact_consent = false or (email is not null and position('@' in email) > 1)
  )
);

create index if not exists repair_cafe_public_feedback_created_idx
  on public.repair_cafe_public_feedback(created_at desc);

alter table public.repair_cafe_public_feedback enable row level security;

grant insert on public.repair_cafe_public_feedback to anon;
grant select on public.repair_cafe_public_feedback to authenticated;

drop policy if exists "public submit repair cafe feedback" on public.repair_cafe_public_feedback;
create policy "public submit repair cafe feedback"
on public.repair_cafe_public_feedback
for insert
to anon
with check (
  privacy_acknowledged = true
  and cardinality(participation) > 0
  and (
    contact_consent = false
    or (email is not null and position('@' in email) > 1)
  )
);

drop policy if exists "managers read repair cafe feedback" on public.repair_cafe_public_feedback;
create policy "managers read repair cafe feedback"
on public.repair_cafe_public_feedback
for select
to authenticated
using (private.current_staff_role() in ('admin','manager'));
