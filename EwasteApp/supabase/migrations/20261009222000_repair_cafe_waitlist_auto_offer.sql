create or replace function private.repair_cafe_offer_waitlisted()
returns trigger language plpgsql security definer set search_path='' as $$
declare v_slot public.repair_cafe_shift_slots%rowtype; v_current integer; v_member uuid;
begin
 if tg_op <> 'UPDATE' or old.status not in ('offered','confirmed') or
    new.status not in ('withdrawn','declined') or old.status=new.status then return new; end if;
 select * into v_slot from public.repair_cafe_shift_slots where id=new.slot_id for update;
 if not found then return new; end if;
 if exists(select 1 from public.repair_cafe_sessions e where e.id=v_slot.event_id and e.status in ('cancelled','completed')) then return new; end if;
 select count(*) into v_current from public.repair_cafe_shift_assignments
 where slot_id=new.slot_id and status in ('offered','confirmed');
 if v_current >= v_slot.required_count then return new; end if;
 select w.user_id into v_member from public.repair_cafe_shift_waitlist w
 join public.program_access pa on pa.user_id=w.user_id and pa.program='repair_cafe' and pa.active
 join public.repair_cafe_availability av on av.user_id=w.user_id and av.event_id=v_slot.event_id and av.response in ('available','maybe')
 where w.slot_id=v_slot.id and w.state='waiting'
 and not exists(select 1 from public.repair_cafe_shift_assignments a where a.slot_id=v_slot.id and a.user_id=w.user_id)
 and (v_slot.required_competency is null or exists(select 1 from public.repair_cafe_competencies c
  where c.user_id=w.user_id and c.course_slug=v_slot.required_competency and c.verification='verified'
   and (c.expires_on is null or c.expires_on>=current_date)))
 order by w.created_at,w.id limit 1 for update of w skip locked;
 if v_member is null then return new; end if;
 insert into public.repair_cafe_shift_assignments(slot_id,user_id,status)
 values(v_slot.id,v_member,'offered');
 update public.repair_cafe_shift_waitlist set state='offered' where slot_id=v_slot.id and user_id=v_member;
 return new;
end $$;
drop trigger if exists rc_waitlist_offer_on_release on public.repair_cafe_shift_assignments;
create trigger rc_waitlist_offer_on_release after update of status on public.repair_cafe_shift_assignments
for each row execute function private.repair_cafe_offer_waitlisted();
