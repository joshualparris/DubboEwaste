-- Allow a logged-in staff member to use the same public community form.
grant insert on public.repair_cafe_public_feedback to authenticated;

drop policy if exists "authenticated submit repair cafe feedback" on public.repair_cafe_public_feedback;
create policy "authenticated submit repair cafe feedback"
on public.repair_cafe_public_feedback
for insert
to authenticated
with check (
  privacy_acknowledged = true
  and cardinality(participation) > 0
  and (
    contact_consent = false
    or (email is not null and position('@' in email) > 1)
  )
);
