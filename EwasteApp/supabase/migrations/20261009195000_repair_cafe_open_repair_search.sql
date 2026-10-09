create or replace function public.repair_cafe_search_open_repair(
 p_query text, p_limit integer default 25
) returns setof public.repair_cafe_open_repair_data
language sql stable security invoker set search_path='' as $$
 select r.* from public.repair_cafe_open_repair_data r
 where auth.uid() is not null
   and private.has_program('repair_cafe')
   and length(trim(coalesce(p_query,''))) between 2 and 100
   and to_tsvector('simple',coalesce(r.category,'')||' '||coalesce(r.product,'')||' '||
     coalesce(r.brand,'')||' '||coalesce(r.model,'')||' '||coalesce(r.problem,''))
      @@ websearch_to_tsquery('simple', p_query)
 order by r.event_date desc,r.source_id
 limit least(greatest(coalesce(p_limit,25),1),50)
$$;
revoke execute on function public.repair_cafe_search_open_repair(text,integer) from public,anon;
grant execute on function public.repair_cafe_search_open_repair(text,integer) to authenticated;
comment on function public.repair_cafe_search_open_repair(text,integer) is 'Private Repair Café volunteer search of locally imported Open Repair Alliance records with existing GIN full-text index. Does not expose visitor data.';
