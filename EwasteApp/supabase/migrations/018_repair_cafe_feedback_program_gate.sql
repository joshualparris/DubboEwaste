-- Repair Cafe public feedback is a programme-specific dataset.
-- Manager/admin authority alone is not enough without Repair Cafe access.
drop policy if exists "managers read repair cafe feedback" on public.repair_cafe_public_feedback;
create policy "repair cafe managers read feedback"
on public.repair_cafe_public_feedback
for select
to authenticated
using (
  private.has_program('repair_cafe')
  and private.current_staff_role() in ('admin','manager')
);
