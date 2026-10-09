-- Private, event-filtered Postgres Changes for Repair Café event desks.
-- Only existing authenticated programme members may read the rows (RLS).
-- Do not publish volunteers, incidents, photos or communication tables.
do $$
begin
 if not exists(select 1 from pg_publication where pubname='supabase_realtime') then
   raise exception 'Supabase Realtime publication is missing; no changes applied';
 end if;
 if not exists (
   select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='repair_cafe_tickets'
 ) then
   alter publication supabase_realtime add table public.repair_cafe_tickets;
 end if;
 if not exists (
   select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='repair_cafe_stations'
 ) then
   alter publication supabase_realtime add table public.repair_cafe_stations;
 end if;
end $$;
-- No REPLICA IDENTITY FULL: clients receive only the new row for inserts/updates.
-- Membership RLS in the original Event Desk migration governs who receives rows.
comment on table public.repair_cafe_tickets is
 'Private per-event Repair Café tickets; authenticated members can subscribe to changes via Supabase Realtime, never anonymous users.';
