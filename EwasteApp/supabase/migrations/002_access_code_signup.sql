-- Public access-code signup.
-- The plaintext access code is never stored in Git or persisted in auth metadata.

create table if not exists private.signup_config (
  singleton boolean primary key default true check (singleton = true),
  access_code_sha256 text not null,
  updated_at timestamptz not null default now()
);

revoke all on table private.signup_config from public, anon, authenticated;

-- The initial hash is installed directly in the live Supabase environment.
-- To rotate the access code:
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
  submitted_code text;
  expected_digest text;
  submitted_digest text;
  meta jsonb;
begin
  meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  submitted_code := coalesce(meta ->> 'signup_access_code', '');

  select access_code_sha256
  into expected_digest
  from private.signup_config
  where singleton = true;

  submitted_digest := case
    when submitted_code = '' then ''
    else encode(extensions.digest(submitted_code, 'sha256'), 'hex')
  end;

  meta := meta - 'signup_access_code' - 'signup_authorized';

  if submitted_digest = '' or submitted_digest <> expected_digest then
    raise exception 'Invalid DubboEwaste signup access code'
      using errcode = '28000';
  end if;

  new.raw_user_meta_data :=
    meta || jsonb_build_object('signup_authorized', true);

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
