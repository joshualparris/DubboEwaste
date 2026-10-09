-- Queue planned reminders and event changes for consenting volunteers ONLY.
-- Actual sending requires an external delivery provider and authenticated dispatcher.
create or replace function private.repair_cafe_enqueue_event_messages()
returns trigger language plpgsql security definer set search_path=''
as $$
declare msg_kind text; note text; due timestamptz; key_prefix text;
begin
 if tg_op<>'UPDATE' then return new; end if;
 if new.status='published' and old.status<>'published' then
   msg_kind:='session_reminder';
   note:='Reminder: Repair Café Dubbo is planned for '||to_char(new.event_date,'DD Mon YYYY')||
        ', '||left(new.starts_at::text,5)||'-'||left(new.ends_at::text,5)||
        '. Check your assigned shift and confirmed venue details in the volunteer hub.';
   due:=greatest(now(),(new.event_date::timestamp+new.starts_at) at time zone 'Australia/Sydney' - interval '48 hours');
   key_prefix:=new.id::text||':48h:'||new.event_date::text||':'||new.starts_at::text;
 elsif new.status='cancelled' and old.status<>'cancelled' then
   msg_kind:='cancellation';
   note:='Repair Café Dubbo session on '||to_char(new.event_date,'DD Mon YYYY')||
      ' is cancelled. Please do not attend. Contact your coordinator if unsure.';
   due:=now();
   key_prefix:=new.id::text||':cancel:'||to_char(now(),'YYYYMMDDHH24MI');
 elsif old.status='published' and new.status in ('draft','collecting') then
   msg_kind:='change';
   note:='Repair Café Dubbo session on '||to_char(old.event_date,'DD Mon YYYY')||
    ' has had a change and is no longer confirmed. Please check with your coordinator before attending.';
   due:=now();
   key_prefix:=new.id::text||':changed:'||to_char(now(),'YYYYMMDDHH24MI');
 else
   return new;
 end if;
 insert into public.repair_cafe_notifications(event_id,channel,destination,kind,subject,message,scheduled_for,dedupe_key)
 select new.id,'email',p.email,msg_kind,'Repair Café Dubbo · '||to_char(new.event_date,'DD Mon YYYY'),
   note,due,key_prefix||':account-email:'||p.user_id
 from public.repair_cafe_notification_preferences p
 where p.email_opt_in and p.email<>''
 and exists(select 1 from public.repair_cafe_availability a where a.event_id=new.id
  and a.user_id=p.user_id and a.response<>'unavailable')
 on conflict(dedupe_key) do nothing;
 insert into public.repair_cafe_notifications(event_id,channel,destination,kind,subject,message,scheduled_for,dedupe_key)
 select new.id,'sms',p.phone,msg_kind,'Repair Café Dubbo',note,due,key_prefix||':account-sms:'||p.user_id
 from public.repair_cafe_notification_preferences p
 where p.sms_opt_in and p.phone<>''
 and exists(select 1 from public.repair_cafe_availability a where a.event_id=new.id
  and a.user_id=p.user_id and a.response<>'unavailable')
 on conflict(dedupe_key) do nothing;
 insert into public.repair_cafe_notifications(event_id,channel,destination,kind,subject,message,scheduled_for,dedupe_key)
 select new.id,'email',v.email,msg_kind,'Repair Café Dubbo · '||to_char(new.event_date,'DD Mon YYYY'),
  note,due,key_prefix||':manual-email:'||v.id
 from public.repair_cafe_manual_volunteers v
 where v.deleted_at is null and v.contact_consent and v.notify_email and v.email<>''
 and exists(select 1 from public.repair_cafe_manual_availability a where a.event_id=new.id
  and a.manual_volunteer_id=v.id and a.response<>'unavailable')
 on conflict(dedupe_key) do nothing;
 insert into public.repair_cafe_notifications(event_id,channel,destination,kind,subject,message,scheduled_for,dedupe_key)
 select new.id,'sms',v.phone,msg_kind,'Repair Café Dubbo',
  note,due,key_prefix||':manual-sms:'||v.id
 from public.repair_cafe_manual_volunteers v
 where v.deleted_at is null and v.contact_consent and v.notify_sms and v.phone<>''
 and exists(select 1 from public.repair_cafe_manual_availability a where a.event_id=new.id
  and a.manual_volunteer_id=v.id and a.response<>'unavailable')
 on conflict(dedupe_key) do nothing;
 return new;
end;
$$;
create trigger rc_session_outbound_notifications
 after update of status on public.repair_cafe_sessions
 for each row execute function private.repair_cafe_enqueue_event_messages();

-- An atomic queue claim prevents two concurrently running dispatchers double-sending.
-- A stalled "sending" lease becomes claimable after 15 min. Failed messages
-- stay failed for explicit coordinator review; retries max 3.
create function public.repair_cafe_claim_notifications(p_limit int default 20)
returns setof public.repair_cafe_notifications
language plpgsql security definer set search_path=''
as $$
begin
 if auth.role() <> 'service_role' then
  raise exception 'Service role only' using errcode='42501';
 end if;
 return query
 with jobs as (
  select id from public.repair_cafe_notifications
  where ((state='pending' and scheduled_for<=now())
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
revoke all on function public.repair_cafe_claim_notifications(int) from public,anon,authenticated;
grant execute on function public.repair_cafe_claim_notifications(int) to service_role;
-- Prevent a visitor, authenticated volunteer, or admin UI from marking messages sent.
