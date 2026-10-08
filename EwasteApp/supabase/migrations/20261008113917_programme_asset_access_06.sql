create or replace function private.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
declare pr text:=new.raw_app_meta_data->>'signup_program'; begin
 insert into public.profiles(id,full_name,email,role,active) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',new.email),new.email,'volunteer',pr in ('dubbo_ewaste','library_of_things','repair_cafe'));
 if pr in ('dubbo_ewaste','library_of_things','repair_cafe') then insert into public.program_access(user_id,program,programme_role) values(new.id,pr,'volunteer'); end if;
 return new;
end $$;
create or replace function public.rotate_programme_signup_code(pr text,new_code text) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not private.is_programme_admin(pr) then raise exception 'Programme admin required'; end if;
 if pr not in ('dubbo_ewaste','library_of_things','repair_cafe') or length(new_code)<10 then raise exception 'Use a code of at least 10 characters'; end if;
 insert into private.signup_access_codes(program,access_code_sha256,active) values(pr,encode(extensions.digest(new_code,'sha256'),'hex'),true)
 on conflict(program) do update set access_code_sha256=excluded.access_code_sha256,active=true,updated_at=now();
end $$;

alter table public.assets add column owner_kind text not null default 'UNCONFIRMED' check(owner_kind in ('UNCONFIRMED','PROGRAMME','CUSTOMER','THIRD_PARTY'));
alter table public.assets add column owner_name text;
create table public.asset_programme_transfers(
 id uuid primary key default gen_random_uuid(),asset_id uuid not null references public.assets(id),
 from_programme text not null,to_programme text not null,reason text not null,source_context jsonb not null,
 transferred_by uuid not null references public.profiles(id),transferred_at timestamptz not null default now()
);
alter table public.asset_programme_transfers enable row level security;
grant select on public.asset_programme_transfers to authenticated;
create policy "read accessible transfer history" on public.asset_programme_transfers for select to authenticated using(private.programme_visible(from_programme,'assets') or private.programme_visible(to_programme,'assets'));
