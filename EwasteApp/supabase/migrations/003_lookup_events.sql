-- Lookup provenance. Store the method and outcome, never raw IMEI/serial values.
-- Run after 002_model_support.sql.

-- Keep this migration safe for projects where 002 was already applied.
alter table public.model_support add column if not exists aliases text[] not null default '{}';
alter table public.model_support add column if not exists identifiers text[] not null default '{}';
create index if not exists model_support_aliases_idx on public.model_support using gin (aliases);
create index if not exists model_support_identifiers_idx on public.model_support using gin (identifiers);

update public.model_support set
  aliases = case manufacturer || ':' || model_name
    when 'Lenovo:ThinkPad T14 Gen 2' then '{"t14 gen 2","thinkpad t14","20w0","20w1"}'::text[]
    when 'Dell:Latitude 5420' then '{"latitude 5420","latitude 5000"}'::text[]
    when 'Apple:MacBook Air M1' then '{"macbook air m1","macbookair10,1","a2337"}'::text[]
    when 'Apple:iPhone 11' then '{"iphone 11","iphone12,1","a2111","a2221","a2223"}'::text[]
    when 'Google/Lenovo:Lenovo 300e Chromebook' then '{"300e chromebook","300e","300e 2nd gen"}'::text[]
    when 'Ubiquiti:UniFi AP AC Lite' then '{"unifi ap ac lite","uap-ac-lite","uap ac lite"}'::text[]
    else aliases end,
  identifiers = case manufacturer || ':' || model_name
    when 'Lenovo:ThinkPad T14 Gen 2' then '{"type 20w0","type 20w1"}'::text[]
    when 'Dell:Latitude 5420' then '{"latitude 5420"}'::text[]
    when 'Apple:MacBook Air M1' then '{"a2337"}'::text[]
    when 'Apple:iPhone 11' then '{"iphone12,1","a2111","a2221","a2223"}'::text[]
    when 'Google/Lenovo:Lenovo 300e Chromebook' then '{"81h0","81h1"}'::text[]
    when 'Ubiquiti:UniFi AP AC Lite' then '{"uap-ac-lite"}'::text[]
    else identifiers end;

create table public.lookup_events (
  id uuid primary key default gen_random_uuid(),
  query_redacted text not null,
  method text not null check (method in ('text','alias','identifier','barcode','serial','smbios','imei_tac')),
  model_support_id uuid references public.model_support(id),
  confidence text not null check (confidence in ('EXACT','LIKELY','AMBIGUOUS','UNKNOWN')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.lookup_events enable row level security;

create policy "active staff read lookup events"
on public.lookup_events for select
to authenticated
using (public.is_active_staff());

create policy "active staff create lookup events"
on public.lookup_events for insert
to authenticated
with check (public.is_active_staff() and created_by = auth.uid());
