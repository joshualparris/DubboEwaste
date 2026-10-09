create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  site text not null check (site in ('dubbo_ewaste','circular_economy')),
  event_name text not null check (event_name in ('page_view','click','login_success','logout')),
  page_group text not null check (length(page_group) between 1 and 80 and page_group ~ '^/[a-z0-9/_-]*$'),
  target_group text check (length(target_group) <= 80 and target_group ~ '^[a-z0-9/_:.-]*$'),
  country text check (country is null or country ~ '^[A-Z]{2}$'),
  region text check (region is null or region ~ '^[A-Z0-9-]{1,8}$'),
  device_class text check (device_class is null or device_class in ('mobile','tablet','desktop','unknown')),
  referrer_domain text check (referrer_domain is null or (length(referrer_domain) <= 100 and referrer_domain ~ '^[a-z0-9.-]+$')),
  is_authenticated boolean not null default false
);
alter table public.analytics_events enable row level security;
revoke all on public.analytics_events from public, anon, authenticated;
grant insert (site,event_name,page_group,target_group,country,region,device_class,referrer_domain,is_authenticated)
  on public.analytics_events to anon, authenticated;
create policy analytics_insert_anonymous on public.analytics_events for insert to anon
  with check (event_name in ('page_view','click') and is_authenticated = false);
create policy analytics_insert_member on public.analytics_events for insert to authenticated
  with check (event_name in ('page_view','click','login_success','logout'));
create index analytics_events_date_site_idx on public.analytics_events (occurred_at desc,site,event_name);
comment on table public.analytics_events is
'Minimal analytics. No user identifiers, IPs, exact locations, content, query strings or fingerprinting. No client SELECT. Remove after 90 days.';

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
      select coalesce(jsonb_agg(to_jsonb(t) order by t.total desc,t.country,t.region),'[]'::jsonb)
      from (select coalesce(country,'unknown') as country,
                    case when count(*)>=5 then coalesce(region,'unknown') else 'withheld' end as region,
                    count(*) as total
            from public.analytics_events
            where (occurred_at at time zone 'Australia/Sydney')::date=p_day
            group by country,region) t),
    'devices',(
      select coalesce(jsonb_agg(to_jsonb(t) order by t.total desc),'[]'::jsonb)
      from (select coalesce(device_class,'unknown') as device_class,count(*) as total
            from public.analytics_events where (occurred_at at time zone 'Australia/Sydney')::date=p_day
            group by device_class) t)
  ) into result;
  return result;
end
$$;
revoke all on function public.analytics_daily_report(date) from public, anon;
grant execute on function public.analytics_daily_report(date) to authenticated, service_role;
comment on function public.analytics_daily_report(date) is
'Administrator-only daily aggregate report in Australia/Sydney timezone; no raw event export.';
