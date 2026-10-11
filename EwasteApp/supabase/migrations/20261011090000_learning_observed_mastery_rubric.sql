-- Skills sign-off v3, 11 Oct 2026.
-- Adds redacted, assessor-attested evidence to the EXISTING laptop-refurb course.
-- Additive to migration 020; no learner data is populated or certified by this migration.
-- Approval only for repair-laptop-refurb requires a directly observed demonstration;
-- the catalogue and simulations must never manufacture mastery.

alter table public.learning_practical_submissions
 add column if not exists observed_on date,
 add column if not exists observation_method text check (observation_method in ('in_person','live_remote')),
 add column if not exists evidence_reference text check (evidence_reference is null or char_length(evidence_reference) <= 160),
 add column if not exists skill_consent smallint check (skill_consent between 0 and 3),
 add column if not exists skill_diagnosis smallint check (skill_diagnosis between 0 and 3),
 add column if not exists skill_compatibility smallint check (skill_compatibility between 0 and 3),
 add column if not exists skill_safety smallint check (skill_safety between 0 and 3),
 add column if not exists skill_verification smallint check (skill_verification between 0 and 3),
 add column if not exists skill_handover smallint check (skill_handover between 0 and 3),
 add column if not exists assessor_attested boolean not null default false;

-- A six-criterion rubric is compulsory for this technical capstone only.
-- Threshold: 15/18, consent and safety at least 2/3, directly seen by
-- an independent authorised reviewer. Existing unrelated courses keep
-- their historical approved/changes-requested workflow.
alter table public.learning_practical_submissions
 add constraint learning_refurb_observed_mastery_guard check (
  course_slug <> 'repair-laptop-refurb' or status <> 'approved' or (
    directly_observed
    and reviewer_id is not null and reviewer_id <> user_id
    and observed_on is not null
    and observation_method in ('in_person','live_remote')
    and char_length(coalesce(trim(evidence_reference),'')) between 8 and 160
    and assessor_attested
    and char_length(coalesce(trim(feedback),'')) >= 30
    and num_nonnulls(skill_consent,skill_diagnosis,skill_compatibility,
       skill_safety,skill_verification,skill_handover)=6
    and skill_consent >= 2
    and skill_safety >= 2
    and (coalesce(skill_consent,0)+coalesce(skill_diagnosis,0)+coalesce(skill_compatibility,0)
       +coalesce(skill_safety,0)+coalesce(skill_verification,0)+coalesce(skill_handover,0)) >= 15
  )
 );

-- These are authenticated-column grants; the EXISTING RLS rules still
-- restrict who can review, to programme administrators who are NOT the learner.
grant update (observed_on,observation_method,evidence_reference,
 skill_consent,skill_diagnosis,skill_compatibility,skill_safety,
 skill_verification,skill_handover,assessor_attested)
 on public.learning_practical_submissions to authenticated;

-- Keep past reviews immutable: preserve the sign-off audit trail after approval
-- or changes-requested, while permitting the first transition from submitted.
create or replace function public.learning_practical_review_lock()
returns trigger language plpgsql set search_path = '' as $$
begin
 if old.status <> 'submitted' then
   raise exception 'Reviewed practical assessments cannot be modified; submit a new attempt'
     using errcode = '23514';
 end if;
 return new;
end $$;
drop trigger if exists learning_practical_review_immutable on public.learning_practical_submissions;
create trigger learning_practical_review_immutable
 before update on public.learning_practical_submissions
 for each row execute function public.learning_practical_review_lock();

comment on constraint learning_refurb_observed_mastery_guard
 on public.learning_practical_submissions is
 'Only actual, recorded supervised hardware evidence qualifies laptop-refurb capstone approval. 15/18 minimum; two critical gates.';
