-- Authenticated self-service QR attendance; event UUID is a routing identifier, not a security credential.
create or replace function public.repair_cafe_self_attendance(p_event_id uuid,p_action text)
returns table(check_in_at timestamptz,check_out_at timestamptz)
language plpgsql security definer set search_path='' as $$
declare v_user uuid := (select auth.uid()); v_event public.repair_cafe_sessions%rowtype;
 v_record public.repair_cafe_attendance%rowtype;
begin
 if v_user is null or not (select private.has_program('repair_cafe')) then
  raise exception 'Active Repair Café membership and sign-in required' using errcode='42501';
 end if;
 if p_action not in ('in','out') then raise exception 'Invalid attendance action'; end if;
 select * into v_event from public.repair_cafe_sessions
  where id=p_event_id and deleted_at is null and status='published';
 if not found then raise exception 'Event unavailable for check-in'; end if;
 -- Sydney-local calendar day with six-hour grace at each end for setup and packdown.
 if now() < ((v_event.event_date::timestamp at time zone 'Australia/Sydney') - interval '6 hours')
    or now() >= ((v_event.event_date::timestamp at time zone 'Australia/Sydney') + interval '30 hours') then
  raise exception 'Volunteer attendance opens only around the event date';
 end if;
 -- Require volunteer membership for the Repair Café (global admin may check in if active).
 if not exists(select 1 from public.program_access p where p.user_id=v_user and p.program='repair_cafe' and p.active)
    and not exists(select 1 from public.profiles p where p.id=v_user and p.active and p.role::text='admin') then
  raise exception 'You are not an active Repair Café volunteer' using errcode='42501';
 end if;
 -- Serialize repeated simultaneous clicks per user/event before insert or update.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(p_event_id::text),pg_catalog.hashtext(v_user::text));
 select * into v_record from public.repair_cafe_attendance where event_id=p_event_id and user_id=v_user for update;
 if p_action='in' then
  if found and v_record.check_in_at is not null then
   raise exception 'Already checked in; check out when your shift finishes';
  end if;
  if found then
   update public.repair_cafe_attendance a set check_in_at=now(),check_out_at=null,updated_by=v_user where a.id=v_record.id;
  else
   insert into public.repair_cafe_attendance(event_id,user_id,check_in_at,updated_by)
   values(p_event_id,v_user,now(),v_user);
  end if;
 else
  if not found or v_record.check_in_at is null then raise exception 'Check in first'; end if;
  if v_record.check_out_at is not null then raise exception 'Already checked out'; end if;
  update public.repair_cafe_attendance a set check_out_at=now(),updated_by=v_user where a.id=v_record.id;
 end if;
 return query select a.check_in_at,a.check_out_at from public.repair_cafe_attendance a
  where a.event_id=p_event_id and a.user_id=v_user;
end $$;
revoke all on function public.repair_cafe_self_attendance(uuid,text) from public,anon;
grant execute on function public.repair_cafe_self_attendance(uuid,text) to authenticated;
create policy "volunteers read own attendance" on public.repair_cafe_attendance
 for select to authenticated using(user_id=(select auth.uid()) and (select private.has_program('repair_cafe')));
