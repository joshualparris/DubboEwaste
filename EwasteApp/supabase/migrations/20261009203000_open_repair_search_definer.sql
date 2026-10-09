create or replace function public.repair_cafe_search_open_repair(p_query text,p_limit integer default 25)
returns setof public.repair_cafe_open_repair_data
language plpgsql stable security definer set search_path = '' as $$
begin
 if (select auth.uid()) is null or not (select private.has_program('repair_cafe')) then
  raise exception 'Repair Cafe membership required' using errcode='42501';
 end if;
 if length(trim(coalesce(p_query,''))) not between 2 and 100 then return; end if;
 return query select r.* from public.repair_cafe_open_repair_data r
 where to_tsvector('simple',coalesce(r.category,'')||' '||coalesce(r.product,'')||' '||
 coalesce(r.brand,'')||' '||coalesce(r.model,'')||' '||coalesce(r.problem,''))
 @@ websearch_to_tsquery('simple',p_query)
 order by r.event_date desc,r.source_id
 limit least(greatest(coalesce(p_limit,25),1),50);
end $$;
revoke all on function public.repair_cafe_search_open_repair(text,integer) from public,anon;
grant execute on function public.repair_cafe_search_open_repair(text,integer) to authenticated;