BEGIN;
do $$ declare pr text; i int:=0; u uuid; a uuid; begin
 foreach pr in array array['dubbo_ewaste','library_of_things','repair_cafe'] loop
  i:=i+1;u:=('aa000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid;a:=('bb000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid;
  insert into private.signup_access_codes(program,access_code_sha256,active) values(pr,encode(extensions.digest('qa-only-rollback-'||pr,'sha256'),'hex'),true) on conflict(program) do update set access_code_sha256=excluded.access_code_sha256,active=true;
  insert into auth.users(id,email,raw_user_meta_data,raw_app_meta_data) values(u,'programme-qa-'||i||'@example.invalid',jsonb_build_object('full_name','Synthetic volunteer','signup_access_code','qa-only-rollback-'||pr),'{}');
  insert into public.assets(id,programme,category,ownership_verified,data_bearing,created_by,owner_kind) values(a,pr,'LAPTOP',true,false,u,'PROGRAMME');
  insert into public.customers(id,programme,name,created_by) values(('cc000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,pr,'Synthetic borrower',u);
  insert into public.repairs(id,programme,asset_id,diagnosis,created_by) values(('dd000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,pr,a,'Synthetic repair',u);
  insert into public.evidence(programme,entity_type,entity_id,evidence_type,filename,size_bytes,storage_key,sha256,captured_by) values(pr,'asset',a,'PHOTO','qa.jpg',1,'asset/'||a||'/qa.jpg',repeat('0',64),u);
  insert into storage.objects(bucket_id,name) values('evidence','asset/'||a||'/qa.jpg');
 end loop;
 insert into auth.users(id,email,raw_user_meta_data,raw_app_meta_data) values('aa000000-0000-4000-8000-000000000100','programme-qa-global@example.invalid',jsonb_build_object('signup_access_code','qa-only-rollback-dubbo_ewaste'),'{}');
 update public.profiles set role='admin' where id='aa000000-0000-4000-8000-000000000100';
end $$;
-- Programme admin manages own team; the same person can be a volunteer elsewhere.
update public.program_access set programme_role='admin' where user_id='aa000000-0000-4000-8000-000000000001';
insert into public.program_access(user_id,program,programme_role) values('aa000000-0000-4000-8000-000000000001','repair_cafe','volunteer');
set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000001',true),set_config('request.headers','{"x-assetflow-programme":"dubbo_ewaste"}',true);
select public.set_programme_membership('aa000000-0000-4000-8000-000000000001','dubbo_ewaste','admin',true);
do $$ begin if private.current_staff_role()::text<>'admin' then raise exception 'QA programme admin';end if;end $$;
select set_config('request.headers','{"x-assetflow-programme":"repair_cafe"}',true);
do $$ begin
 if private.current_staff_role()::text<>'volunteer' then raise exception 'QA mixed programme roles';end if;
 begin perform public.set_programme_membership(auth.uid(),'repair_cafe','admin',true);raise exception 'QA self promotion';exception when others then if sqlerrm='QA self promotion' then raise;end if;end;
 begin perform public.transfer_asset_programme('bb000000-0000-4000-8000-000000000001','repair_cafe','Forbidden transfer');raise exception 'QA transfer without both admin roles';exception when others then if sqlerrm='QA transfer without both admin roles' then raise;end if;end;
end $$;
select set_config('request.headers','{"x-assetflow-programme":"all"}',true);
do $$ begin if exists(select 1 from public.assets) then raise exception 'QA forged all header';end if;end $$;
select set_config('request.headers','{"x-assetflow-programme":"library_of_things"}',true);
do $$ begin if exists(select 1 from public.assets) then raise exception 'QA forged programme header';end if;end $$;
reset role;
update public.program_access set active=false where user_id='aa000000-0000-4000-8000-000000000003';
set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000003',true),set_config('request.headers','{"x-assetflow-programme":"repair_cafe"}',true);
do $$ begin if exists(select 1 from public.assets) then raise exception 'QA revoked membership';end if;end $$;
reset role;
update public.profiles set active=false where id='aa000000-0000-4000-8000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000001',true),set_config('request.headers','{"x-assetflow-programme":"dubbo_ewaste"}',true);
do $$ begin if exists(select 1 from public.assets) then raise exception 'QA inactive profile';end if;end $$;
reset role;
set local role anon;
select set_config('request.jwt.claim.sub','',true),set_config('request.headers','{}',true);
do $$ begin if exists(select 1 from public.assets) then raise exception 'QA anonymous private assets';end if;end $$;
reset role;
select 'Scoped administration, independent roles, transfer denial, forged headers, revocation, inactive and anonymous denial passed' as result;

ROLLBACK;
