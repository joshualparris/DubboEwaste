-- Public GitHub repositories may receive only thresholded, grouped statistics.
-- Keep all raw events and detailed/admin reporting inside Supabase.
alter table public.analytics_events drop constraint if exists analytics_events_site_check;
alter table public.analytics_events add constraint analytics_events_site_check
  check (site in ('dubbo_ewaste','circular_economy','github_pages','render_backup'));

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
      case when is_authenticated or page_group ~ '^/(admin|dashboard|assets|crm|jobs|learn|repair-cafe-volunteers|programmes|login|signup|verify)'
              or (site = 'github_pages' and page_group='/dubboewasteapp')
        then '/private' else page_group end as safe_page,
      case when is_authenticated or page_group ~ '^/(admin|dashboard|assets|crm|jobs|learn|repair-cafe-volunteers|programmes|login|signup|verify)'
              or (site='github_pages' and page_group='/dubboewasteapp')
        then 'private-action' else coalesce(target_group,'other') end as safe_click,
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
revoke all on function public.analytics_public_daily_report(date) from public, anon, authenticated;
grant execute on function public.analytics_public_daily_report(date) to anon, authenticated, service_role;
comment on function public.analytics_public_daily_report(date) is
'PUBLIC by design: only completed dates, recent 31 days, min bucket >=5. Suppresses private routes/actions. Used for scheduled public GitHub aggregate reports.';

-- Retention runs in the database, regardless of repository workflow status.
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule(
  'analytics-purge-older-than-90-days',
  '19 3 * * *',
  $$delete from public.analytics_events where occurred_at < now() - interval '90 days'$$
);
