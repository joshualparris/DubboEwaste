create or replace function public.analytics_daily_report(p_day date)
returns jsonb language plpgsql security definer set search_path = pg_catalog, public
as $$
declare result jsonb;
begin
  if current_setting('request.jwt.claim.role', true) is distinct from 'service_role'
     and not exists (
       select 1 from public.profiles p where p.id = auth.uid() and p.active and p.role::text = 'admin'
     )
  then
    raise exception 'Analytics report restricted to administrators' using errcode='42501';
  end if;
  select jsonb_build_object(
    'day_sydney',p_day,
    'events_total',(select count(*) from public.analytics_events where (occurred_at at time zone 'Australia/Sydney')::date=p_day),
    'by_site',(
      select coalesce(jsonb_agg(to_jsonb(t) order by t.site,t.event_name),'[]'::jsonb)
      from (select site,event_name,count(*) as total
            from public.analytics_events where (occurred_at at time zone 'Australia/Sydney')::date=p_day
            group by site,event_name) t),
    'pages',(
      select coalesce(jsonb_agg(to_jsonb(t) order by t.total desc,t.site,t.page_group),'[]'::jsonb)
      from (select site,page_group,count(*) as total
            from public.analytics_events where event_name='page_view' and (occurred_at at time zone 'Australia/Sydney')::date=p_day
            group by site,page_group) t),
    'clicks',(
      select coalesce(jsonb_agg(to_jsonb(t) order by t.total desc,t.site,t.target_group),'[]'::jsonb)
      from (select site,coalesce(target_group,'unlabelled') as target_group,count(*) as total
            from public.analytics_events where event_name='click' and (occurred_at at time zone 'Australia/Sydney')::date=p_day
            group by site,coalesce(target_group,'unlabelled')) t),
    'locations',(
      select coalesce(jsonb_agg(to_jsonb(t) order by t.total desc,t.site,t.country,t.region),'[]'::jsonb)
      from (select site,coalesce(country,'unknown') as country,
                    case when count(*)>=5 then coalesce(region,'unknown') else 'withheld' end as region,
                    count(*) as total
            from public.analytics_events
            where (occurred_at at time zone 'Australia/Sydney')::date=p_day
            group by site,country,region) t),
    'devices',(
      select coalesce(jsonb_agg(to_jsonb(t) order by t.total desc,t.site,t.device_class),'[]'::jsonb)
      from (select site,coalesce(device_class,'unknown') as device_class,count(*) as total
            from public.analytics_events where (occurred_at at time zone 'Australia/Sydney')::date=p_day
            group by site,device_class) t),
    'referrers',(
      select coalesce(jsonb_agg(to_jsonb(t) order by t.total desc,t.site,t.referrer_domain),'[]'::jsonb)
      from (select site,coalesce(referrer_domain,'unknown') as referrer_domain,count(*) as total
            from public.analytics_events where (occurred_at at time zone 'Australia/Sydney')::date=p_day
            group by site,referrer_domain) t)
  ) into result;
  return result;
end
$$;
revoke all on function public.analytics_daily_report(date) from public, anon;
grant execute on function public.analytics_daily_report(date) to authenticated, service_role;
