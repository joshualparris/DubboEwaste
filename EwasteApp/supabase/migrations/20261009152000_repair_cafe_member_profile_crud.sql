-- Coordinator can maintain self-declared Repair Cafe skills for existing members.
-- This does not grant permission to alter or delete Supabase Auth accounts.

create function private.repair_cafe_member_skills_identity()
returns trigger language plpgsql set search_path=''
as $$
begin
 if new.user_id<>old.user_id then
  raise exception 'A volunteer skill record cannot be moved to another user';
 end if;
 return new;
end
$$;
create trigger repair_cafe_member_skills_identity_guard
 before update on public.repair_cafe_volunteer_profiles
 for each row execute function private.repair_cafe_member_skills_identity();

create policy "coordinators create skill records for members"
 on public.repair_cafe_volunteer_profiles for insert to authenticated
 with check(private.repair_cafe_can_manage() and exists(
   select 1 from public.profiles p
   join public.program_access pa on pa.user_id=p.id
   where p.id=repair_cafe_volunteer_profiles.user_id and p.active
     and pa.program='repair_cafe' and pa.active
 ));
create policy "coordinators edit skill records for members"
 on public.repair_cafe_volunteer_profiles for update to authenticated
 using(private.repair_cafe_can_manage())
 with check(private.repair_cafe_can_manage() and exists(
   select 1 from public.profiles p
   join public.program_access pa on pa.user_id=p.id
   where p.id=repair_cafe_volunteer_profiles.user_id and p.active
     and pa.program='repair_cafe' and pa.active
 ));
