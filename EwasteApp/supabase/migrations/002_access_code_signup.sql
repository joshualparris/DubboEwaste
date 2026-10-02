-- Public access-code signup.
-- The plaintext access code is never stored in Git or in this table.

create table if not exists private.signup_config (
  singleton boolean primary key default true check (singleton = true),
  access_code_sha256 text not null,
  updated_at timestamptz not null default now()
);

revoke all on table private.signup_config from public, anon, authenticated;

-- The initial hash is installed in the live Supabase migration.
-- For a fresh environment, set this value directly in Supabase rather than committing a plaintext code.
-- Example:
-- update private.signup_config
-- set access_code_sha256 = encode(extensions.digest('<new access code>', 'sha256'), 'hex'),
--     updated_at = now()
-- where singleton = true;

create or replace function private.authorize_signup()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  submitted_digest text;
  expected_digest text;
  meta jsonb;
begin
  meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  submitted_digest := coalesce(meta ->> 'signup_code_digest', '');

  select access_code_sha256
  into expected_digest
  from private.signup_config
  where singleton = true;

  meta := meta - 'signup_code_digest' - 'signup_authorized';

  meta := meta || jsonb_build_object(
    'signup_authorized',
    submitted_digest <> '' and submitted_digest = expected_digest
  );

  new.raw_user_meta_data := meta;
  return new;
end;
$$;

drop trigger if exists authorize_public_signup on auth.users;
create trigger authorize_public_signup
before insert on auth.users
for each row execute procedure private.authorize_signup();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles(id, full_name, role, active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    'volunteer'::public.staff_role,
    coalesce((new.raw_user_meta_data ->> 'signup_authorized')::boolean, false)
  );
  return new;
end;
$$;

create or replace function public.verify_signup_access_code(input_code text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.signup_config
    where singleton = true
      and access_code_sha256 = encode(extensions.digest(input_code, 'sha256'), 'hex')
  )
$$;

revoke all on function public.verify_signup_access_code(text) from public;
grant execute on function public.verify_signup_access_code(text) to anon, authenticated;
