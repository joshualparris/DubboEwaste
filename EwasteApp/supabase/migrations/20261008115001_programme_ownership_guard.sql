create or replace function private.guard_programme_record() returns trigger language plpgsql security definer set search_path='' as $$
declare j jsonb:=to_jsonb(new); prev jsonb; fk record; pr text; related text; eid uuid; begin
 if current_setting('assetflow.transfer',true)='approved' and tg_op='UPDATE' then return new; end if;
 if tg_op='UPDATE' then prev:=to_jsonb(old); if new.programme is distinct from old.programme then raise exception 'Use the authorised asset transfer action'; end if; end if;
 pr:=case when current_setting('assetflow.transfer',true)='approved' then null else new.programme end;
 for fk in select a.attname as col,p.relname as parent,pa.attname as parent_col from pg_constraint c join pg_class p on p.oid=c.confrelid
 join pg_attribute a on a.attrelid=c.conrelid and a.attnum=c.conkey[1] join pg_attribute pa on pa.attrelid=c.confrelid and pa.attnum=c.confkey[1]
 join private.programme_tables pt on pt.table_name=p.relname where c.conrelid=tg_relid and c.contype='f' and array_length(c.conkey,1)=1 loop
  if j->>fk.col is null or (tg_op='UPDATE' and j->>fk.col is not distinct from prev->>fk.col) then continue; end if;
  execute format('select programme from public.%I where %I::text=$1',fk.parent,fk.parent_col) into related using j->>fk.col;
  if related is null then raise exception 'Related record unavailable'; end if;
  if pr is null then pr:=related; end if;
  if pr<>related then raise exception 'Related records must belong to the same programme'; end if;
 end loop;
 if j ? 'entity_type' and j->>'entity_id' is not null then
  if tg_op='INSERT' or j->>'entity_id' is distinct from prev->>'entity_id' or j->>'entity_type' is distinct from prev->>'entity_type' then
   related:=private.entity_programme(j->>'entity_type',(j->>'entity_id')::uuid);
   if related is null then raise exception 'Attachment entity unavailable'; end if;
   if pr is null then pr:=related; end if;
   if pr<>related then raise exception 'Attachment belongs to another programme'; end if;
  end if;
 end if;
 if tg_table_name='assets' and tg_op='UPDATE' and j->>'owner_kind' is distinct from prev->>'owner_kind' and exists(select 1 from public.item_loans where asset_id=(j->>'id')::uuid and returned_at is null) then raise exception 'Return the loan before changing item ownership'; end if;
 if tg_table_name='item_loans' then
  if not exists(select 1 from public.assets where id=(j->>'asset_id')::uuid and programme='library_of_things' and owner_kind='PROGRAMME') then raise exception 'Only programme-owned library items can be lent'; end if;
  if tg_op='UPDATE' and (prev->>'returned_at' is not null or j->>'asset_id' is distinct from prev->>'asset_id' or j->>'borrower_id' is distinct from prev->>'borrower_id' or j->>'created_by' is distinct from prev->>'created_by' or j->>'checked_out_at' is distinct from prev->>'checked_out_at' or j->>'condition_out' is distinct from prev->>'condition_out') then raise exception 'Loan identity and completed returns are immutable'; end if;
 end if;
 if pr is null then raise exception 'Choose one programme before creating records'; end if;
 if auth.uid() is not null and tg_table_name<>'repair_cafe_public_feedback' and coalesce(current_setting('assetflow.transfer',true),'')<>'approved' and not private.programme_visible(pr,tg_table_name) then raise exception 'Programme access denied'; end if;
 new.programme:=pr;
 if tg_table_name='evidence' and j->>'storage_key' not like (j->>'entity_type')||'/'||(j->>'entity_id')||'/%' then raise exception 'Evidence path must match its entity'; end if;
 return new;
end $$;
insert into private.signup_access_codes(program,access_code_sha256,active) select 'dubbo_ewaste',access_code_sha256,true from private.signup_config on conflict do nothing;
