-- Claim only channels for which configured providers are available.
create function public.repair_cafe_claim_notifications(p_limit int,p_channels text[])
returns setof public.repair_cafe_notifications
language plpgsql security definer set search_path=''
as $$
begin
 if auth.role()<>'service_role' then
  raise exception 'Service role required' using errcode='42501';
 end if;
 return query
 with jobs as (
  select id from public.repair_cafe_notifications
  where channel=any(p_channels)
   and ((state='pending' and scheduled_for<=now())
    or (state='sending' and scheduled_for<now()-interval '15 minutes'))
   and attempt_count<3
  order by scheduled_for,id
  for update skip locked
  limit least(greatest(p_limit,1),50)
 )
 update public.repair_cafe_notifications n
  set state='sending',attempt_count=n.attempt_count+1,scheduled_for=now()
 from jobs where n.id=jobs.id returning n.*;
end $$;
revoke all on function public.repair_cafe_claim_notifications(int,text[]) from public,anon,authenticated;
grant execute on function public.repair_cafe_claim_notifications(int,text[]) to service_role;
