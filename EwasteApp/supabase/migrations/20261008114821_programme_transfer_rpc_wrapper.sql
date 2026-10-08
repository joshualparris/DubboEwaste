create or replace function private.transfer_asset_programme(target_asset uuid,target_programme text,transfer_reason text) returns void language plpgsql security definer set search_path='' as $$
declare a public.assets; t text; begin
 select * into a from public.assets where id=target_asset for update;
 if a.id is null or auth.uid() is null or not private.is_programme_admin(a.programme) or not private.is_programme_admin(target_programme) then raise exception 'Admin access to both programmes is required'; end if;
 if target_programme not in ('dubbo_ewaste','library_of_things','repair_cafe') or target_programme=a.programme or length(trim(transfer_reason))<5 then raise exception 'Choose a different programme and record the transfer reason'; end if;
 if exists(select 1 from public.item_loans where asset_id=a.id and returned_at is null) then raise exception 'Return the loan before transferring this item'; end if;
 insert into public.asset_programme_transfers(asset_id,from_programme,to_programme,reason,source_context,transferred_by) values(a.id,a.programme,target_programme,trim(transfer_reason),jsonb_build_object('customer_id',a.customer_id,'job_id',a.job_id,'lot_id',a.lot_id,'location_id',a.location_id,'owner_kind',a.owner_kind,'owner_name',a.owner_name),auth.uid());
 perform set_config('assetflow.transfer','approved',true);
 update public.assets set programme=target_programme,customer_id=null,job_id=null,lot_id=null,location_id=null where id=a.id;
 foreach t in array array['asset_attributes','asset_authority_records','asset_defects','asset_events','asset_quarantines','asset_tests','asset_triage_assessments','diagnostic_runs','dispositions','grades','repairs','certificates'] loop
  if to_regclass('public.'||t) is not null then execute format('update public.%I set programme=$1 where asset_id=$2',t) using target_programme,a.id; end if;
 end loop;
 update public.media set programme=target_programme where parent_asset_id=a.id;
 update public.sanitisation_tasks set programme=target_programme where media_id in(select id from public.media where parent_asset_id=a.id);
 update public.certificate_vault_records set programme=target_programme where certificate_id in(select id from public.certificates where asset_id=a.id);
 update public.evidence set programme=target_programme where (entity_type='asset' and entity_id=a.id) or (entity_type='media' and entity_id in(select id from public.media where parent_asset_id=a.id));
 update public.exceptions set programme=target_programme where entity_type='asset' and entity_id=a.id;
 update public.operational_events set programme=target_programme where entity_type='asset' and entity_id=a.id;
 perform set_config('assetflow.transfer','',true);
end $$;
create or replace function public.transfer_asset_programme(target_asset uuid,target_programme text,transfer_reason text) returns void language sql security invoker set search_path='' as $$ select private.transfer_asset_programme($1,$2,$3) $$;
revoke all on function private.transfer_asset_programme(uuid,text,text) from public,anon;grant execute on function private.transfer_asset_programme(uuid,text,text) to authenticated;
