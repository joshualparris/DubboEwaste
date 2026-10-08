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
set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000002',true),set_config('request.headers','{"x-assetflow-programme":"library_of_things"}',true);
insert into public.item_loans(id,asset_id,borrower_id,due_at,condition_out,created_by) values('ee000000-0000-4000-8000-000000000001','bb000000-0000-4000-8000-000000000002','cc000000-0000-4000-8000-000000000002',now()+interval '1 day','Synthetic condition','aa000000-0000-4000-8000-000000000002');
do $$ begin
 begin insert into public.item_loans(asset_id,borrower_id,due_at,condition_out,created_by) values('bb000000-0000-4000-8000-000000000002','cc000000-0000-4000-8000-000000000002',now()+interval '1 day','Duplicate',auth.uid());raise exception 'QA duplicate loan';exception when unique_violation then null;end;
end $$;
do $$ begin begin update public.assets set owner_kind='CUSTOMER' where id='bb000000-0000-4000-8000-000000000002';raise exception 'QA ownership change during loan';exception when others then if sqlerrm='QA ownership change during loan' then raise;end if;end;end $$;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000100',true),set_config('request.headers','{"x-assetflow-programme":"all"}',true);
do $$ begin
 if (select count(*) from public.assets where id::text like 'bb000000-%')<>3 then raise exception 'QA global all view';end if;
 begin perform public.transfer_asset_programme('bb000000-0000-4000-8000-000000000002','repair_cafe','Synthetic transfer');raise exception 'QA active loan transfer';exception when others then if sqlerrm='QA active loan transfer' then raise;end if;end;
end $$;
update public.item_loans set returned_at=now(),condition_in='Inspected' where id='ee000000-0000-4000-8000-000000000001';
select public.transfer_asset_programme('bb000000-0000-4000-8000-000000000002','repair_cafe','Synthetic transfer after return');
do $$ begin
 if not exists(select 1 from public.assets where id='bb000000-0000-4000-8000-000000000002' and programme='repair_cafe' and owner_kind='PROGRAMME') then raise exception 'QA transfer asset ownership';end if;
 if not exists(select 1 from public.repairs where id='dd000000-0000-4000-8000-000000000002' and programme='repair_cafe') then raise exception 'QA transfer repair history';end if;
 if not exists(select 1 from public.asset_programme_transfers where asset_id='bb000000-0000-4000-8000-000000000002') then raise exception 'QA transfer audit';end if;
end $$;
reset role;
select 'Loans, returns, transfer blocking, global view and transfer history passed' as result;

ROLLBACK;
