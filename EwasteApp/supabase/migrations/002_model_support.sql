-- Model/support catalogue. Keep records conservative and source-dated.
-- Run after 001_initial.sql in the same Supabase project.

create table public.model_support (
  id uuid primary key default gen_random_uuid(),
  manufacturer text not null,
  model_name text not null,
  category text not null,
  support_summary text not null,
  lock_risks text not null,
  battery_notes text not null,
  likely_route text not null,
  source_url text not null,
  source_checked date not null,
  confidence text not null check (confidence in ('VERIFIED','PROPOSED','RESEARCH LEAD')),
  active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (manufacturer, model_name)
);

create index model_support_search_idx
  on public.model_support using gin (to_tsvector('simple', manufacturer || ' ' || model_name || ' ' || category));

alter table public.model_support enable row level security;

create policy "active staff read model support"
on public.model_support for select
to authenticated
using (private.is_active_staff() and active = true);

create policy "admins and managers manage model support"
on public.model_support for all
to authenticated
using (private.current_staff_role() in ('admin','manager'))
with check (private.current_staff_role() in ('admin','manager'));

create trigger model_support_set_updated_at
before update on public.model_support
for each row execute procedure private.set_updated_at();

insert into public.model_support
  (manufacturer, model_name, category, support_summary, lock_risks, battery_notes, likely_route, source_url, source_checked, confidence)
values
  ('Lenovo', 'ThinkPad T14 Gen 2', 'laptop', 'Verify the installed CPU/TPM against current Windows requirements; model family is a reuse candidate.', 'Check BIOS password, Autopilot and organisation management before acceptance.', 'Inspect health, swelling, charger and hinge; replacement availability varies by exact pack.', 'Reuse/refurbish if tested and unlocked; parts if board, display or battery economics fail.', 'https://www.microsoft.com/en-au/windows/windows-11-specifications', '2026-10-02', 'RESEARCH LEAD'),
  ('Dell', 'Latitude 5420', 'laptop', 'Verify the installed CPU/TPM against current Windows requirements; business-laptop repair path is usually practical.', 'Check BIOS password, Autopilot and MDM before acceptance.', 'Inspect health, swelling, charger and USB-C charging.', 'Reuse/refurbish or parts after bench testing.', 'https://www.microsoft.com/en-au/windows/windows-11-specifications', '2026-10-02', 'RESEARCH LEAD'),
  ('Apple', 'MacBook Air M1', 'mac', 'Check the exact macOS support status at intake; do not infer support from appearance or age.', 'Activation Lock and Find My must be cleared legitimately before resale.', 'Check cycle health, swelling, charging and keyboard; built-in battery work needs a safe route.', 'Reuse/refurbish if unlocked, supported and tested.', 'https://support.apple.com/en-au/108794', '2026-10-02', 'RESEARCH LEAD'),
  ('Apple', 'iPhone 11', 'phone', 'Check current iOS support and Australian network/emergency-call compatibility before listing.', 'Activation Lock, Find My and carrier/blacklist state must be checked.', 'Record battery health and reject swelling or heat.', 'Reuse/social reuse if unlocked and tested; parts if screen or board economics fail.', 'https://support.apple.com/en-au/108794', '2026-10-02', 'RESEARCH LEAD'),
  ('Google/Lenovo', 'Lenovo 300e Chromebook', 'chromebook', 'The ChromeOS Auto Update Expiration date is decisive; verify the exact model on the official list.', 'Check forced re-enrolment and administrator management.', 'Inspect charging, swelling, keyboard and screen.', 'Reuse before AUE if unlocked; otherwise parts or verified recycling.', 'https://support.google.com/chrome/a/answer/6220366', '2026-10-02', 'RESEARCH LEAD'),
  ('Ubiquiti', 'UniFi AP AC Lite', 'networking', 'Check firmware/controller compatibility and whether the unit can be factory reset.', 'Confirm the previous owner has released controller ownership.', 'No internal battery; inspect power supply and PoE path.', 'Specialist resale or parts after reset and port testing.', 'https://help.ui.com/hc/en-us/articles/205146110-UniFi-Device-LEDs', '2026-10-02', 'RESEARCH LEAD')
on conflict (manufacturer, model_name) do nothing;
