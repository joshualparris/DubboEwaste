-- Recoverable archival and audit coverage. Never revive a public event automatically.
create function private.repair_cafe_archive_manual_volunteer()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 if old.deleted_at is null and new.deleted_at is not null then
  update public.repair_cafe_shift_assignments set status='withdrawn',updated_at=now()
   where manual_volunteer_id=new.id and status in ('offered','confirmed');
 end if;
 return new;
end $$;
create trigger rc_archive_manual_volunteer
 after update of deleted_at on public.repair_cafe_manual_volunteers
 for each row execute function private.repair_cafe_archive_manual_volunteer();

create function private.repair_cafe_guard_archived_manual_assignment()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 if new.status='confirmed' and new.manual_volunteer_id is not null
  and not exists(select 1 from public.repair_cafe_manual_volunteers
   where id=new.manual_volunteer_id and deleted_at is null)
 then raise exception 'Archived volunteer cannot be rostered'; end if;
 return new;
end $$;
create trigger rc_no_roster_archived_person
 before insert or update of status,manual_volunteer_id on public.repair_cafe_shift_assignments
 for each row execute function private.repair_cafe_guard_archived_manual_assignment();

-- Audit field names only: no visitor names, contacts, photos, or incident descriptions.
create trigger rc_venue_contact_history after insert or update or delete
 on public.repair_cafe_venue_contacts for each row execute function private.repair_cafe_audit_row();
create trigger rc_competency_history after insert or update or delete
 on public.repair_cafe_competencies for each row execute function private.repair_cafe_audit_row();
create trigger rc_attendance_history after insert or update or delete
 on public.repair_cafe_attendance for each row execute function private.repair_cafe_audit_row();
create trigger rc_photo_history after insert or update or delete
 on public.repair_cafe_visit_photos for each row execute function private.repair_cafe_audit_row();
create trigger rc_notifications_history after insert or update or delete
 on public.repair_cafe_notifications for each row execute function private.repair_cafe_audit_row();
create trigger rc_repair_history after insert or update or delete
 on public.repair_cafe_repair_tickets for each row execute function private.repair_cafe_audit_row();
-- Visit consents have visit_id PK rather than an id, and already retain
-- agreed_at, consent_version and recorded_by as their accountability record.
