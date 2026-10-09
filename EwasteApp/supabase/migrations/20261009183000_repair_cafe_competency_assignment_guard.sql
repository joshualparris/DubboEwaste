-- Verified competencies can be required for safety-critical roster positions.
-- LMS completion alone never equals permission for regulated electrical work.
alter table public.repair_cafe_shift_slots
 add column required_competency text check(length(required_competency)<=120);

create or replace function private.repair_cafe_check_assignment_competency()
returns trigger language plpgsql security definer set search_path=''
as $$
declare need_course text;
begin
 if new.status<>'confirmed' then return new; end if;
 select required_competency into need_course from public.repair_cafe_shift_slots where id=new.slot_id;
 if need_course is null or need_course='' then return new; end if;
 if not exists (
  select 1 from public.repair_cafe_competencies c where c.course_slug=need_course
    and c.verification='verified' and (c.expires_on is null or c.expires_on>=current_date)
    and ((new.user_id is not null and c.user_id=new.user_id)
      or (new.manual_volunteer_id is not null and c.manual_volunteer_id=new.manual_volunteer_id))
 ) then raise exception 'A current verified competency is required for this shift'; end if;
 return new;
end $$;
create trigger rc_roster_competency_guard
 before insert or update of status,slot_id,user_id,manual_volunteer_id
 on public.repair_cafe_shift_assignments for each row
 execute function private.repair_cafe_check_assignment_competency();

create function private.repair_cafe_check_slot_competency_change()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 if new.required_competency is not distinct from old.required_competency then return new; end if;
 if new.required_competency is not null and exists (
  select 1 from public.repair_cafe_shift_assignments a
  where a.slot_id=new.id and a.status='confirmed' and not exists(
   select 1 from public.repair_cafe_competencies c
   where c.course_slug=new.required_competency and c.verification='verified'
     and (c.expires_on is null or c.expires_on>=current_date)
     and ((a.user_id is not null and c.user_id=a.user_id)
      or (a.manual_volunteer_id is not null and c.manual_volunteer_id=a.manual_volunteer_id))
  )
 ) then raise exception 'Existing confirmed volunteers lack the proposed verified competency'; end if;
 return new;
end $$;
create trigger rc_slot_competency_edit_guard
 before update of required_competency on public.repair_cafe_shift_slots
 for each row execute function private.repair_cafe_check_slot_competency_change();
