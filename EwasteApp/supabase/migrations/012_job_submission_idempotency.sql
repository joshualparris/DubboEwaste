-- Prevent accidental duplicate inbound jobs from repeated form submissions.
alter table public.jobs
  add column if not exists submission_key uuid;

create unique index if not exists jobs_submission_key_uidx
  on public.jobs(submission_key)
  where submission_key is not null;
