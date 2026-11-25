-- Delete mistaken intake records only. Keep an immutable operational snapshot.
create or replace function private.guard_mistaken_asset_delete()
returns trigger language plpgsql security definer set search_path='' as $$
declare ref record; linked boolean; reason text; history jsonb; attributes jsonb;
begin
  reason:=nullif(trim(current_setting('assetflow.delete_reason',true)),'');
  if auth.uid() is null or private.current_staff_role() is distinct from 'admin'::public.staff_role or not private.has_table_permission('assets','delete') then
    raise exception 'Administrator access required';
  end if;
  if reason is null or length(reason)>500 then raise exception 'A removal reason is required'; end if;
  if old.programme <> 'dubbo_ewaste' or old.status::text not in ('INTAKE','HOLD') or old.owner_kind not in ('UNCONFIRMED','PROGRAMME') or old.data_state::text not in ('UNWIPED_RESTRICTED','NON_DATA_BEARING') then
    raise exception 'Only mistaken E-waste intake or hold records without completed sanitisation may be removed';
  end if;
  if exists(select 1 from public.council_pilot_batches b where b.job_id=old.job_id) then raise exception 'Council custody records cannot be removed'; end if;
  -- Block all linked operational data, including cascading and SET NULL references.
  -- Only the initial asset history and descriptive attributes may be removed after snapshotting.
  for ref in select c.conrelid::regclass as rel, a.attname as col, cardinality(c.conkey) as keys
    from pg_catalog.pg_constraint c join pg_catalog.pg_attribute a on a.attrelid=c.conrelid and a.attnum=c.conkey[1]
    where c.contype='f' and c.confrelid='public.assets'::regclass
      and c.conrelid not in ('public.asset_events'::regclass,'public.asset_attributes'::regclass)
  loop
    if ref.keys<>1 then raise exception 'Asset has an unsupported dependency constraint'; end if;
    execute format('select exists(select 1 from %s where %I=$1)',ref.rel,ref.col) into linked using old.id;
    if linked then raise exception 'Asset has linked operational records and cannot be deleted'; end if;
  end loop;
  select coalesce(jsonb_agg(to_jsonb(e)),'[]'::jsonb) into history from public.asset_events e where e.asset_id=old.id;
  select coalesce(jsonb_agg(to_jsonb(a)),'[]'::jsonb) into attributes from public.asset_attributes a where a.asset_id=old.id;
  insert into public.operational_events(programme,entity_type,entity_id,event_type,actor_id,details)
    values(old.programme,'asset',old.id,'ASSET_REMOVED_IN_ERROR',auth.uid(),jsonb_build_object('reason',reason,'asset_code',old.asset_code,'snapshot',to_jsonb(old),'asset_history',history,'attributes',attributes));
  return old;
end $$;
revoke all on function private.guard_mistaken_asset_delete() from public, anon, authenticated;
create trigger guard_mistaken_asset_delete before delete on public.assets for each row execute function private.guard_mistaken_asset_delete();

create or replace function public.remove_mistaken_assets(p_ids uuid[],p_reason text)
returns integer language plpgsql security invoker set search_path='' as $$
declare removed integer;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_ids is null or cardinality(p_ids) not between 1 and 100 or array_position(p_ids,null) is not null or cardinality(p_ids)<>(select count(distinct i) from unnest(p_ids) i) then raise exception 'Select between 1 and 100 distinct assets'; end if;
  if p_reason is null or length(trim(p_reason)) not between 3 and 500 then raise exception 'Enter a removal reason'; end if;
  perform set_config('assetflow.delete_reason',trim(p_reason),true);
  delete from public.assets where id=any(p_ids);
  get diagnostics removed=row_count;
  if removed<>cardinality(p_ids) then raise exception 'One or more assets are unavailable or you lack permission; nothing was removed'; end if;
  return removed;
end $$;
revoke all on function public.remove_mistaken_assets(uuid[],text) from public,anon;
grant execute on function public.remove_mistaken_assets(uuid[],text) to authenticated;

