create or replace function public.transfer_asset_programme(target_asset uuid,target_programme text,transfer_reason text) returns void language plpgsql security definer set search_path='' as $$
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

-- Restrict callable definer helpers and public RPCs to their intended roles.
do $$ declare f record; begin
 for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='private' and p.proname in ('is_global_admin','has_program','selected_programme','current_staff_role','is_active_staff','is_programme_admin','programme_table_allowed','programme_visible','has_table_permission','entity_programme','guard_programme_record','evidence_path_access') loop
  execute format('revoke all on function %s from public,anon',f.sig); execute format('grant execute on function %s to authenticated',f.sig);
 end loop;
 for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('programme_context','set_programme_membership','rotate_programme_signup_code','transfer_asset_programme') loop
  execute format('revoke all on function %s from public,anon',f.sig); execute format('grant execute on function %s to authenticated',f.sig);
 end loop;
end $$;
create or replace function private.current_staff_role() returns public.staff_role language plpgsql stable security definer set search_path='' as $$
declare r text; begin
 if private.is_global_admin() then return 'admin'::public.staff_role; end if;
 select pa.programme_role into r from public.program_access pa join public.profiles p on p.id=pa.user_id where pa.user_id=auth.uid() and p.active and pa.active and pa.program=private.selected_programme();
 return r::public.staff_role;
end $$;
create or replace function private.is_active_staff() returns boolean language sql stable security definer set search_path='' as $$
 select private.is_global_admin() or private.has_program(private.selected_programme())
$$;
