-- One authoritative operational record: repair_cafe_tickets.
-- Retain unused historical tables for backwards-compatible schema inspection,
-- but forbid new writes, preventing two independent repair journeys.
-- Existing data was verified empty in production on 2026-10-09.
revoke insert,update,delete on public.repair_cafe_visits,public.repair_cafe_repair_tickets from authenticated;
drop policy if exists "coordinators insert" on public.repair_cafe_visits;
drop policy if exists "coordinators update" on public.repair_cafe_visits;
drop policy if exists "coordinators delete" on public.repair_cafe_visits;
drop policy if exists "coordinators insert" on public.repair_cafe_repair_tickets;
drop policy if exists "coordinators update" on public.repair_cafe_repair_tickets;
drop policy if exists "coordinators delete" on public.repair_cafe_repair_tickets;
comment on table public.repair_cafe_visits is 'DEPRECATED. Use repair_cafe_tickets. No new records; retained for backwards-compatible review.';
comment on table public.repair_cafe_repair_tickets is 'DEPRECATED. Use repair_cafe_tickets. No new records.';
-- Definer functions bypass RLS; guard legacy writes at trigger level too.
create or replace function private.repair_cafe_legacy_write_block() returns trigger
language plpgsql set search_path='' as $$
begin raise exception 'Legacy repair records retired: use repair_cafe_tickets'; end $$;
create trigger rc_legacy_visit_read_only before insert or update or delete
 on public.repair_cafe_visits for each row execute function private.repair_cafe_legacy_write_block();
create trigger rc_legacy_repair_read_only before insert or update or delete
 on public.repair_cafe_repair_tickets for each row execute function private.repair_cafe_legacy_write_block();
