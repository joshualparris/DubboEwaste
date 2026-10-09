-- Send opted-in shift confirmations only, and prevent date edits that create overlapping rosters.
create or replace function private.repair_cafe_enqueue_shift_confirmation()
returns trigger language plpgsql security definer set search_path=''
as $$
declare e_id uuid; e_date date; e_start time; e_venue text; content text; key_prefix text;
begin
 if new.status<>'confirmed' or (tg_op='UPDATE' and old.status='confirmed') then return new; end if;
 select e.id,e.event_date,s.starts_at into e_id,e_date,e_start
 from public.repair_cafe_shift_slots s join public.repair_cafe_sessions e on e.id=s.event_id where s.id=new.slot_id;
 content:='Your Repair Café Dubbo volunteer shift has been confirmed for '||
 to_char(e_date,'DD Mon YYYY')||' at '||left(e_start::text,5)||
 '. Please check the Volunteer Hub for current venue and role details. Reply to your coordinator if unavailable.';
 key_prefix:=new.id::text||':shift-confirmed';
 if new.user_id is not null then
  insert into public.repair_cafe_notifications(event_id,channel,destination,kind,subject,message,dedupe_key)
  select e_id,'email',p.email,'shift_confirmation','Repair Café volunteer shift confirmed',content,
    key_prefix||':email'
  from public.repair_cafe_notification_preferences p where p.user_id=new.user_id and p.email_opt_in and p.email<>''
  on conflict(dedupe_key) do nothing;
  insert into public.repair_cafe_notifications(event_id,channel,destination,kind,subject,message,dedupe_key)
  select e_id,'sms',p.phone,'shift_confirmation','Repair Café',content,key_prefix||':sms'
  from public.repair_cafe_notification_preferences p where p.user_id=new.user_id and p.sms_opt_in and p.phone<>''
  on conflict(dedupe_key) do nothing;
 else
  insert into public.repair_cafe_notifications(event_id,channel,destination,kind,subject,message,dedupe_key)
  select e_id,'email',p.email,'shift_confirmation','Repair Café volunteer shift confirmed',content,key_prefix||':email'
  from public.repair_cafe_manual_volunteers p where p.id=new.manual_volunteer_id
   and p.deleted_at is null and p.contact_consent and p.notify_email and p.email<>''
  on conflict(dedupe_key) do nothing;
  insert into public.repair_cafe_notifications(event_id,channel,destination,kind,subject,message,dedupe_key)
  select e_id,'sms',p.phone,'shift_confirmation','Repair Café',content,key_prefix||':sms'
  from public.repair_cafe_manual_volunteers p where p.id=new.manual_volunteer_id
   and p.deleted_at is null and p.contact_consent and p.notify_sms and p.phone<>''
  on conflict(dedupe_key) do nothing;
 end if;
 return new;
end $$;
create trigger rc_shift_confirmation after insert or update of status
 on public.repair_cafe_shift_assignments for each row
 execute function private.repair_cafe_enqueue_shift_confirmation();

create or replace function private.repair_cafe_guard_rescheduled_confirmed_shifts()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 if new.event_date=old.event_date then return new; end if;
 if exists(
  select 1 from public.repair_cafe_shift_assignments a
  join public.repair_cafe_shift_slots s on s.id=a.slot_id
  join public.repair_cafe_shift_assignments b on b.status='confirmed' and b.id<>a.id
    and ((a.user_id is not null and a.user_id=b.user_id)
     or (a.manual_volunteer_id is not null and a.manual_volunteer_id=b.manual_volunteer_id))
  join public.repair_cafe_shift_slots sb on sb.id=b.slot_id
  join public.repair_cafe_sessions eb on eb.id=sb.event_id
  where s.event_id=new.id and a.status='confirmed' and eb.id<>new.id
    and eb.event_date=new.event_date and s.starts_at<sb.ends_at and s.ends_at>sb.starts_at
 ) then raise exception 'A confirmed volunteer already has an overlapping shift on this date'; end if;
 return new;
end $$;
create trigger rc_reschedule_conflict_guard before update of event_date on public.repair_cafe_sessions
 for each row execute function private.repair_cafe_guard_rescheduled_confirmed_shifts();
