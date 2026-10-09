-- Repair tickets in this optional auxiliary table use visit_id as primary key.
drop trigger if exists rc_repair_history on public.repair_cafe_repair_tickets;
create function private.repair_cafe_aux_repair_audit() returns trigger
language plpgsql security definer set search_path=''
as $$
declare k uuid; old_j jsonb; new_j jsonb; fields text[];
begin
 k:=case when tg_op='DELETE' then old.visit_id else new.visit_id end;
 old_j:=case when tg_op='INSERT' then '{}'::jsonb else to_jsonb(old) end;
 new_j:=case when tg_op='DELETE' then '{}'::jsonb else to_jsonb(new) end;
 select array_agg(key) into fields from jsonb_object_keys(old_j||new_j) as key
 where old_j->key is distinct from new_j->key;
 insert into public.repair_cafe_audit(entity,entity_id,operation,changed_fields,actor)
 values('repair_cafe_repair_tickets',k,tg_op,coalesce(fields,'{}'),auth.uid());
 return case when tg_op='DELETE' then old else new end;
end $$;
create trigger rc_repair_history after insert or update or delete
 on public.repair_cafe_repair_tickets for each row execute function private.repair_cafe_aux_repair_audit();
