-- Reconcile the simultaneously added learning portal with trusted programme signup.
create or replace function private.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
declare pr text:=new.raw_app_meta_data->>'signup_program'; begin
 insert into public.profiles(id,full_name,email,role,active) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',new.email),new.email,'volunteer',pr in ('dubbo_ewaste','library_of_things','repair_cafe'));
 if pr in ('dubbo_ewaste','library_of_things','repair_cafe') then insert into public.program_access(user_id,program,programme_role) values(new.id,pr,'volunteer'); end if;
 return new;
end $$;
update public.profiles set role='volunteer' where role::text='repair_volunteer';
