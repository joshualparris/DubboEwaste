-- Add a dedicated role for Repair Cafe-only volunteer accounts.
-- Kept separate from the generic AssetFlow volunteer role so existing
-- operational policies do not accidentally grant Repair Cafe users access.
alter type public.staff_role add value if not exists 'repair_volunteer';
