alter table public.repair_cafe_knowledge
 add column if not exists review_status text not null default 'approved'
 check (review_status in ('draft','approved','rejected')),
 add column if not exists privacy_confirmed_at timestamptz;
create unique index if not exists repair_cafe_knowledge_ticket_unique
 on public.repair_cafe_knowledge(ticket_id) where ticket_id is not null;
create table if not exists public.repair_cafe_open_repair_data(
 source_id text primary key,
 dataset_version text not null,
 category text not null default '',
 product text not null default '',
 brand text not null default '',
 model text not null default '',
 problem text not null default '',
 repair_status text not null default '',
 country text not null default '',
 event_date text not null default '',
 source_license text not null default 'CC BY-SA 4.0',
 imported_at timestamptz not null default now()
);
create index if not exists rc_open_data_search on public.repair_cafe_open_repair_data using gin (
 to_tsvector('simple',coalesce(category,'')||' '||coalesce(product,'')||' '||
 coalesce(brand,'')||' '||coalesce(model,'')||' '||coalesce(problem,'')));
alter table public.repair_cafe_open_repair_data enable row level security;
revoke all on public.repair_cafe_open_repair_data from anon,authenticated;
grant select on public.repair_cafe_open_repair_data to authenticated;
create policy "repair cafe volunteers see public repair research"
 on public.repair_cafe_open_repair_data for select to authenticated
 using(private.has_program('repair_cafe'));
comment on table public.repair_cafe_open_repair_data is
 'Open Repair Alliance ORDS v0.3 excerpt, CC BY-SA 4.0; community repair attempt data, not repair instructions.';
