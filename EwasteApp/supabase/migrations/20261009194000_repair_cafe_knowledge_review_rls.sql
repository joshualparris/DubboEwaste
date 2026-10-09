drop policy if exists "Repair Cafe team read knowledge" on public.repair_cafe_knowledge;
create policy "Approved lessons for volunteers drafts for coordinators"
 on public.repair_cafe_knowledge for select to authenticated
 using(private.has_program('repair_cafe') and
       (review_status='approved' or private.repair_cafe_can_manage()));
-- Existing legacy entries were not ticket-derived; default approved is retained for those.
