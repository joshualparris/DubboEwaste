create or replace function private.repair_cafe_shift_training_guard()
returns trigger language plpgsql security definer set search_path='' as $$
declare v_required text;
begin
 if new.status not in ('offered','confirmed') then return new; end if;
 select required_competency into v_required from public.repair_cafe_shift_slots where id=new.slot_id;
 if v_required is null or trim(v_required)='' then return new; end if;
 if not exists(select 1 from public.repair_cafe_competencies c where c.course_slug=v_required
  and c.verification='verified' and c.verified_by is not null
  and (c.expires_on is null or c.expires_on>=current_date)
  and ((new.user_id is not null and c.user_id=new.user_id)
    or (new.manual_volunteer_id is not null and c.manual_volunteer_id=new.manual_volunteer_id))) then
  raise exception 'Verified competency required for this shift. Complete coordinator approval first.';
 end if;
 return new;
end $$;
drop trigger if exists rc_shift_training_guard on public.repair_cafe_shift_assignments;
create trigger rc_shift_training_guard before insert or update of slot_id,user_id,manual_volunteer_id,status
on public.repair_cafe_shift_assignments for each row execute function private.repair_cafe_shift_training_guard();
