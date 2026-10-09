create or replace function public.repair_cafe_recent_feedback_events()
returns table(id uuid,title text,event_date date)
language sql stable security definer set search_path='' as $$
 select s.id,s.title,s.event_date from public.repair_cafe_sessions s
 where s.deleted_at is null and s.status in ('published','completed')
 and s.event_date between ((now() at time zone 'Australia/Sydney')::date - 45)
 and (now() at time zone 'Australia/Sydney')::date
 order by s.event_date desc limit 30
$$;
grant execute on function public.repair_cafe_recent_feedback_events() to anon,authenticated;
create or replace function private.repair_cafe_feedback_allowed(p_event uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.repair_cafe_sessions s where s.id=p_event
 and s.deleted_at is null and s.status in ('published','completed')
 and s.event_date between ((now() at time zone 'Australia/Sydney')::date - 45)
 and (now() at time zone 'Australia/Sydney')::date)
$$;
drop policy if exists "visitors submit feedback" on public.repair_cafe_visitor_feedback;
create policy "visitors submit feedback" on public.repair_cafe_visitor_feedback for insert to anon,authenticated
with check(private.repair_cafe_feedback_allowed(event_id));
