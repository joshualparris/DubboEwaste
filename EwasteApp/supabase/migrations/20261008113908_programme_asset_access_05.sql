create or replace function private.evidence_path_access(object_name text,writing boolean) returns boolean language plpgsql stable security definer set search_path='' as $$
declare kind text; eid uuid; pr text; begin
 if auth.uid() is null then return false; end if;
 if not writing then return exists(select 1 from public.evidence e where e.storage_key=object_name and private.programme_visible(e.programme,'evidence') and private.has_table_permission('evidence','read')); end if;
 kind:=split_part(object_name,'/',1);
 begin eid:=split_part(object_name,'/',2)::uuid; exception when invalid_text_representation then return false; end;
 pr:=private.entity_programme(kind,eid);
 return private.programme_visible(pr,'evidence') and private.current_staff_role()::text in ('admin','manager','technician','volunteer');
end $$;
create policy "programme evidence storage" on storage.objects as restrictive for all to authenticated using(bucket_id<>'evidence' or private.evidence_path_access(name,false)) with check(bucket_id<>'evidence' or private.evidence_path_access(name,true));

create or replace function public.programme_context() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare p public.profiles; memberships jsonb; begin
 select * into p from public.profiles where id=auth.uid();
 if p.id is null or not p.active then return null; end if;
 select coalesce(jsonb_agg(jsonb_build_object('program',program,'role',programme_role) order by program),'[]'::jsonb) into memberships from public.program_access where user_id=p.id and active;
 return jsonb_build_object('id',p.id,'full_name',p.full_name,'global_admin',p.role::text='admin','selected',private.selected_programme(),'role',private.current_staff_role(),'memberships',memberships);
end $$;
create or replace function public.set_programme_membership(target_user uuid,target_programme text,target_role text,enabled boolean default true) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not private.is_programme_admin(target_programme) then raise exception 'Programme admin required'; end if;
 if target_programme not in ('dubbo_ewaste','library_of_things','repair_cafe') or target_role not in ('admin','manager','technician','volunteer','auditor') then raise exception 'Invalid programme membership'; end if;
 if not exists(select 1 from public.profiles where id=target_user and active) then raise exception 'Active staff account required'; end if;
 insert into public.program_access(user_id,program,programme_role,active,granted_by) values(target_user,target_programme,target_role,enabled,auth.uid()) on conflict(user_id,program) do update set programme_role=excluded.programme_role,active=excluded.active,granted_by=excluded.granted_by;
end $$;
-- Signup programme is established by the database after verifying a programme-specific code.
create table if not exists private.signup_access_codes(program text primary key,access_code_sha256 text not null unique,active boolean not null default true,updated_at timestamptz not null default now());
do $$ declare c record; begin for c in select conname from pg_constraint where conrelid='private.signup_access_codes'::regclass and contype='c' loop execute format('alter table private.signup_access_codes drop constraint %I',c.conname); end loop; end $$;
alter table private.signup_access_codes add constraint signup_program_check check(program in ('dubbo_ewaste','library_of_things','repair_cafe'));
revoke all on private.signup_access_codes from public,anon,authenticated;
create or replace function private.authorize_signup() returns trigger language plpgsql security definer set search_path='' as $$
declare meta jsonb:=coalesce(new.raw_user_meta_data,'{}'); matched text; submitted text; begin
 submitted:=meta->>'signup_access_code';
 select program into matched from private.signup_access_codes where active and access_code_sha256=encode(extensions.digest(coalesce(submitted,''),'sha256'),'hex') limit 1;
 if matched is null or coalesce(submitted,'')='' then raise exception 'Invalid volunteer signup access code' using errcode='28000'; end if;
 new.raw_user_meta_data:=(meta-'signup_access_code'-'signup_authorized'-'signup_program')||jsonb_build_object('signup_authorized',true,'signup_program',matched);
 new.raw_app_meta_data:=coalesce(new.raw_app_meta_data,'{}')||jsonb_build_object('signup_program',matched);
 return new;
end $$;
