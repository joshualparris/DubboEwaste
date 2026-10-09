-- Photo permission is distinct from repair participation consent.
alter table public.repair_cafe_tickets
 add column if not exists photo_consent boolean not null default false;
alter table public.repair_cafe_tickets
 add column if not exists photo_consent_at timestamptz;
alter table public.repair_cafe_tickets
 add column if not exists visitor_acknowledged_at timestamptz;
alter table public.repair_cafe_tickets
 add column if not exists visitor_consent_version text not null default 'pilot-v1';
grant update(photo_consent,photo_consent_at) on public.repair_cafe_tickets to authenticated;
-- Capture time on new tickets. Historical visitor acknowledgement dates cannot be
-- inferred, so old rows remain null instead of inventing a timestamp.
create function private.repair_cafe_capture_visitor_consent()
returns trigger language plpgsql set search_path=''
as $$
begin
 if new.visitor_acknowledged and new.visitor_acknowledged_at is null then
  new.visitor_acknowledged_at:=now();
 end if;
 return new;
end $$;
create trigger rc_ticket_consent_timestamp
 before insert on public.repair_cafe_tickets
 for each row execute function private.repair_cafe_capture_visitor_consent();

-- Do not allow writing a ticket photo without the separate photo consent.
create function private.repair_cafe_photo_consent_guard()
returns trigger language plpgsql security definer set search_path=''
as $$
declare permitted boolean;
begin
 if new.ticket_id is not null then
  select photo_consent into permitted from public.repair_cafe_tickets where id=new.ticket_id;
  if not coalesce(permitted,false) then raise exception 'Visitor photo consent must be recorded first'; end if;
 end if;
 return new;
end $$;
create trigger rc_photo_consent_guard
 before insert or update on public.repair_cafe_visit_photos
 for each row execute function private.repair_cafe_photo_consent_guard();
