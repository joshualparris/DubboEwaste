do $$ declare t record; init text; begin
 for t in select table_name from private.programme_tables loop
  init:=case when t.table_name in ('repair_cafe_public_feedback','repair_cafe_demand_observations') then 'repair_cafe' when t.table_name='item_loans' then 'library_of_things' else 'dubbo_ewaste' end;
  execute format('alter table public.%I add column programme text not null default %L check(programme in (''dubbo_ewaste'',''library_of_things'',''repair_cafe''))',t.table_name,init);
  if t.table_name<>'repair_cafe_public_feedback' then execute format('alter table public.%I alter column programme set default private.selected_programme()',t.table_name); end if;
  execute format('create index %I on public.%I(programme)',t.table_name||'_programme_idx',t.table_name);
  execute format('alter table public.%I enable row level security',t.table_name);
  execute format('create policy "programme row scope" on public.%I as restrictive for all to authenticated using(private.programme_visible(programme,%L)) with check(private.programme_visible(programme,%L))',t.table_name,t.table_name,t.table_name);
 end loop;
end $$;

-- Foreign-key and polymorphic attachments must belong to the same programme.
create or replace function private.entity_programme(kind text,entity uuid) returns text language plpgsql stable security definer set search_path='' as $$
declare t text; pr text; begin
 t:=case lower(kind) when 'asset' then 'assets' when 'job' then 'jobs' when 'lot' then 'lots' when 'media' then 'media' when 'outbound' then 'outbound_orders' when 'pallet' then 'pallets' when 'exception' then 'exceptions' else null end;
 if t is null then return null; end if;
 execute format('select programme from public.%I where id=$1',t) into pr using entity;
 return pr;
end $$;
