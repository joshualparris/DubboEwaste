-- Allow a coordinator to replace the person on an existing confirmed assignment
-- in one transaction without momentarily unpublishing an otherwise safe event.
grant update(user_id,manual_volunteer_id) on public.repair_cafe_shift_assignments to authenticated;
