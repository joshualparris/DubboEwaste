-- Execute in a disposable transaction; all synthetic fixtures are rolled back.
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
do $$ declare pr text;r text;i int:=0;u uuid;a uuid;other uuid;n int;begin
 foreach pr in array array['dubbo_ewaste','library_of_things','repair_cafe'] loop
  i:=i+1;u:=('aa000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid;a:=('bb000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid;other:=('bb000000-0000-4000-8000-'||lpad((i%3+1)::text,12,'0'))::uuid;
  foreach r in array array['volunteer','technician','manager','auditor','admin'] loop
   execute 'reset role';update public.program_access set programme_role=r where user_id=u;
   perform set_config('request.jwt.claim.sub',u::text,true);perform set_config('request.headers',jsonb_build_object('x-assetflow-programme',pr)::text,true);
   execute 'set local role authenticated';
   if (select count(*) from public.assets where id=a)<>1 then raise exception 'QA own asset hidden: %/%',pr,r;end if;
   if exists(select 1 from public.assets where id=other) then raise exception 'QA cross asset read: %/%',pr,r;end if;
   if (select count(*) from public.repairs where asset_id in(a,other))<>1 then raise exception 'QA repair scope';end if;
   if (select count(*) from public.evidence where entity_id in(a,other))<>1 then raise exception 'QA evidence scope';end if;
   if (select count(*) from storage.objects where name like 'asset/bb000000-%/qa.jpg')<>1 then raise exception 'QA evidence storage';end if;
   update public.assets set owner_name='Forbidden' where id=other;get diagnostics n=row_count;if n<>0 then raise exception 'QA cross update';end if;
   delete from public.assets where id=other;get diagnostics n=row_count;if n<>0 then raise exception 'QA cross delete';end if;
   begin insert into public.assets(programme,category,created_by) values(case when pr='dubbo_ewaste' then 'repair_cafe' else 'dubbo_ewaste' end,'LAPTOP',u);raise exception 'QA cross insert allowed';exception when others then if sqlerrm='QA cross insert allowed' then raise;end if;end;
   begin insert into public.repairs(programme,asset_id,diagnosis,created_by) values(pr,other,'Forbidden',u);raise exception 'QA cross attachment allowed';exception when others then if sqlerrm='QA cross attachment allowed' then raise;end if;end;
   update public.profiles set role='admin' where id=u;get diagnostics n=row_count;if n<>0 then raise exception 'QA global role escalation';end if;
   update public.role_table_permissions set can_delete=true where role='volunteer';get diagnostics n=row_count;if n<>0 then raise exception 'QA global template escalation';end if;
   begin perform public.set_programme_membership(u,case when pr='dubbo_ewaste' then 'repair_cafe' else 'dubbo_ewaste' end,'admin',true);raise exception 'QA cross membership escalation';exception when others then if sqlerrm='QA cross membership escalation' then raise;end if;end;
   if r<>'auditor' then insert into public.assets(programme,category,created_by) values(pr,'LAPTOP',u);
   else begin insert into public.assets(programme,category,created_by) values(pr,'LAPTOP',u);raise exception 'QA auditor write';exception when others then if sqlerrm='QA auditor write' then raise;end if;end;end if;
  end loop;
 end loop;
 execute 'reset role';
end $$;
select '15 programme/role combinations passed' as result;

ROLLBACK;
