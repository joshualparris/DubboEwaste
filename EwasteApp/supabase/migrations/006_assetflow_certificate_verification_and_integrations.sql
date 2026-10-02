-- Extended certificate types, public verification and integration configuration.

alter table public.certificates
  drop constraint if exists certificates_certificate_type_check;
alter table public.certificates
  add constraint certificates_certificate_type_check
  check (certificate_type in ('RECEIPT','DISPOSITION','DEVICE_HISTORY','SANITISATION','DESTRUCTION','RECYCLING','RECEIVING','ENVIRONMENTAL'));

alter table public.certificates add column if not exists template_version text not null default '1';
alter table public.certificates add column if not exists snapshot_sha256 text;
alter table public.certificates add column if not exists verification_token uuid not null default gen_random_uuid();
alter table public.certificates add column if not exists status text not null default 'ISSUED' check (status in ('ISSUED','SUPERSEDED','REVOKED'));
create unique index if not exists certificates_verification_token_idx on public.certificates(verification_token);

create table if not exists public.public_certificate_verification (
  verification_token uuid primary key,
  certificate_code text not null,
  certificate_type text not null,
  issued_at timestamptz not null,
  status text not null,
  snapshot_sha256 text,
  public_summary jsonb not null default '{}'::jsonb
);
alter table public.public_certificate_verification enable row level security;
grant select on public.public_certificate_verification to anon, authenticated;
grant insert,update on public.public_certificate_verification to authenticated;
create policy "public certificate verification read"
on public.public_certificate_verification for select to anon, authenticated using (true);
create policy "staff publish certificate verification"
on public.public_certificate_verification for insert to authenticated
with check (private.current_staff_role() in ('admin','manager','technician'));
create policy "staff update certificate verification"
on public.public_certificate_verification for update to authenticated
using (private.current_staff_role() in ('admin','manager','technician'))
with check (private.current_staff_role() in ('admin','manager','technician'));

create table if not exists public.environmental_methodologies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  version text not null,
  description text not null,
  source_url text,
  calculation jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique(name,version)
);
alter table public.environmental_methodologies enable row level security;
grant select,insert,update on public.environmental_methodologies to authenticated;
create policy "staff read methodologies" on public.environmental_methodologies for select to authenticated using (private.is_active_staff());
create policy "managers insert methodologies" on public.environmental_methodologies for insert to authenticated with check (private.current_staff_role() in ('admin','manager') and created_by=(select auth.uid()));
create policy "managers update methodologies" on public.environmental_methodologies for update to authenticated using (private.current_staff_role() in ('admin','manager')) with check (private.current_staff_role() in ('admin','manager'));

create table if not exists public.webhooks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  endpoint_url text not null,
  event_types text[] not null default '{}',
  secret_hash text,
  enabled boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
alter table public.webhooks enable row level security;
grant select,insert,update on public.webhooks to authenticated;
create policy "managers read webhooks" on public.webhooks for select to authenticated using (private.current_staff_role() in ('admin','manager'));
create policy "managers insert webhooks" on public.webhooks for insert to authenticated with check (private.current_staff_role() in ('admin','manager') and created_by=(select auth.uid()));
create policy "managers update webhooks" on public.webhooks for update to authenticated using (private.current_staff_role() in ('admin','manager')) with check (private.current_staff_role() in ('admin','manager'));

create table if not exists public.api_tokens (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  name text not null,
  token_prefix text not null,
  token_hash text not null unique,
  scopes text[] not null default '{}',
  last_used_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
alter table public.api_tokens enable row level security;
grant select,insert,update on public.api_tokens to authenticated;
create policy "managers read api tokens" on public.api_tokens for select to authenticated using (private.current_staff_role() in ('admin','manager'));
create policy "managers insert api tokens" on public.api_tokens for insert to authenticated with check (private.current_staff_role() in ('admin','manager') and created_by=(select auth.uid()));
create policy "managers update api tokens" on public.api_tokens for update to authenticated using (private.current_staff_role() in ('admin','manager')) with check (private.current_staff_role() in ('admin','manager'));
