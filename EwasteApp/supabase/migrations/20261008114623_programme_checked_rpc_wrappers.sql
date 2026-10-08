create or replace function private.set_programme_membership(target_user uuid,target_programme text,target_role text,enabled boolean default true) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not private.is_programme_admin(target_programme) then raise exception 'Programme admin required'; end if;
 if target_programme not in ('dubbo_ewaste','library_of_things','repair_cafe') or target_role not in ('admin','manager','technician','volunteer','auditor') then raise exception 'Invalid programme membership'; end if;
 if not exists(select 1 from public.profiles where id=target_user and active) then raise exception 'Active staff account required'; end if;
 insert into public.program_access(user_id,program,programme_role,active,granted_by) values(target_user,target_programme,target_role,enabled,auth.uid()) on conflict(user_id,program) do update set programme_role=excluded.programme_role,active=excluded.active,granted_by=excluded.granted_by;
end $$;
create or replace function public.set_programme_membership(target_user uuid,target_programme text,target_role text,enabled boolean default true) returns void language sql security invoker set search_path='' as $$ select private.set_programme_membership($1,$2,$3,$4) $$;
revoke all on function private.set_programme_membership(uuid,text,text,boolean) from public,anon;grant execute on function private.set_programme_membership(uuid,text,text,boolean) to authenticated;
create or replace function private.rotate_programme_signup_code(pr text,new_code text) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not private.is_programme_admin(pr) then raise exception 'Programme admin required'; end if;
 if pr not in ('dubbo_ewaste','library_of_things','repair_cafe') or length(new_code)<10 then raise exception 'Use a code of at least 10 characters'; end if;
 insert into private.signup_access_codes(program,access_code_sha256,active) values(pr,encode(extensions.digest(new_code,'sha256'),'hex'),true)
 on conflict(program) do update set access_code_sha256=excluded.access_code_sha256,active=true,updated_at=now();
end $$;
create or replace function public.rotate_programme_signup_code(pr text,new_code text) returns void language sql security invoker set search_path='' as $$ select private.rotate_programme_signup_code($1,$2) $$;
revoke all on function private.rotate_programme_signup_code(text,text) from public,anon;grant execute on function private.rotate_programme_signup_code(text,text) to authenticated;
alter function public.programme_context() security invoker;
update public.profiles set role='volunteer' where role::text='repair_volunteer';
