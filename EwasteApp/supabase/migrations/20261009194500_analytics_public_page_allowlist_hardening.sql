-- Public reports only reveal predefined public page groups; all private route names are redacted.
create or replace function public.analytics_public_daily_report(p_day date)
returns jsonb
language plpgsql security definer
set search_path = ''
as $$
declare
  result jsonb;
  local_today date := (now() at time zone 'Australia/Sydney')::date;
begin
  if p_day is null or p_day >= local_today or p_day < local_today - 31 then
    raise exception 'Only completed Sydney-local days from the past 31 days are available'
      using errcode='22023';
  end if;
  with event_rows as (
    select site, event_name, is_authenticated,
      case when not is_authenticated and ((site in ('dubbo_ewaste','render_backup') and page_group in ('/','/repair-cafe-dubbo','/dubbo-repair-ewaste','/dubbo-circular-economy','/regional-computer-experts','/privacy-analytics'))
      or (site='circular_economy' and page_group in ('/','/repair-cafe','/library-of-things','/where-next','/privacy-analytics'))
      or (site='github_pages' and page_group in ('/field-school','/glossary','/itad-research','/multimeter-training')))
        then page_group else '/private' end as safe_page,
      case when not is_authenticated and ((site in ('dubbo_ewaste','render_backup') and page_group in ('/','/repair-cafe-dubbo','/dubbo-repair-ewaste','/dubbo-circular-economy','/regional-computer-experts','/privacy-analytics'))
      or (site='circular_economy' and page_group in ('/','/repair-cafe','/library-of-things','/where-next','/privacy-analytics'))
      or (site='github_pages' and page_group in ('/field-school','/glossary','/itad-research','/multimeter-training')))
        then coalesce(target_group,'other') else 'private-action' end as safe_click,
      country, region, device_class, referrer_domain
    from public.analytics_events
    where (occurred_at at time zone 'Australia/Sydney')::date = p_day
  )
  select jsonb_build_object(
    'day_sydney', p_day,
    'privacy', 'Public aggregate only. Counts under 5 are omitted, including private-section events. No identifiable records.',
    'by_site', (
      select coalesce(jsonb_agg(to_jsonb(s) order by s.site,s.event_name),'[]'::jsonb)
      from (select site,event_name,count(*) as total from event_rows
            group by site,event_name having count(*) >=5) s
    ),
    'pages', (
      select coalesce(jsonb_agg(to_jsonb(s) order by s.total desc,s.site),'[]'::jsonb)
      from (select site,safe_page as page_group,count(*) as total from event_rows
            where event_name='page_view'
            group by site,safe_page having count(*) >=5) s
    ),
    'clicks', (
      select coalesce(jsonb_agg(to_jsonb(s) order by s.total desc,s.site),'[]'::jsonb)
      from (select site,safe_click as target_group,count(*) as total from event_rows
            where event_name='click'
            group by site,safe_click having count(*) >=5) s
    ),
    'locations', (
      select coalesce(jsonb_agg(to_jsonb(s) order by s.total desc,s.site),'[]'::jsonb)
      from (select site,coalesce(country,'unknown') as country,
                   case when count(*)>=10 then coalesce(region,'unknown') else 'withheld' end as region,
                   count(*) as total from event_rows
            group by site,country,region having count(*)>=5) s
    ),
    'devices', (
      select coalesce(jsonb_agg(to_jsonb(s) order by s.total desc,s.site),'[]'::jsonb)
      from (select site,coalesce(device_class,'unknown') as device_class,count(*) as total
            from event_rows group by site,device_class having count(*)>=5) s
    ),
    'referrers', (
      select coalesce(jsonb_agg(to_jsonb(s) order by s.total desc,s.site),'[]'::jsonb)
      from (select site,coalesce(referrer_domain,'unknown') as referrer_domain,count(*) as total
            from event_rows group by site,referrer_domain having count(*)>=5) s
    )
  ) into result;
  return result;
end
$$;
