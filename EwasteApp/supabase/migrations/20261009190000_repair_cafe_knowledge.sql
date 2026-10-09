-- Repair Café knowledge library: curated, private programme-scoped entries.
create table if not exists public.repair_cafe_knowledge (
 id uuid primary key default gen_random_uuid(),
 title text not null check(char_length(trim(title)) between 3 and 160),
 category text not null default 'other' check(char_length(category) between 2 and 60),
 manufacturer text not null default '' check(char_length(manufacturer)<=100),
 model text not null default '' check(char_length(model)<=120),
 symptoms text not null default '' check(char_length(symptoms)<=1500),
 diagnosis text not null default '' check(char_length(diagnosis)<=2000),
 solution text not null default '' check(char_length(solution)<=4000),
 outcome text not null default 'unverified' check(outcome in ('worked','partially_worked','did_not_work','unverified')),
 safety_notes text not null default '' check(char_length(safety_notes)<=1000),
 guide_url text not null default '' check(char_length(guide_url)<=500),
 ticket_id uuid references public.repair_cafe_tickets(id) on delete set null,
 created_by uuid default auth.uid(),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists rc_knowledge_search on public.repair_cafe_knowledge(category,manufacturer,model);
alter table public.repair_cafe_knowledge enable row level security;
revoke all on public.repair_cafe_knowledge from anon,authenticated;
grant select,insert,update,delete on public.repair_cafe_knowledge to authenticated;
create policy "Repair Cafe team read knowledge" on public.repair_cafe_knowledge
 for select to authenticated using(private.has_program('repair_cafe'));
create policy "Repair Cafe coordinators add knowledge" on public.repair_cafe_knowledge
 for insert to authenticated with check(private.repair_cafe_can_manage());
create policy "Repair Cafe coordinators update knowledge" on public.repair_cafe_knowledge
 for update to authenticated using(private.repair_cafe_can_manage()) with check(private.repair_cafe_can_manage());
create policy "Repair Cafe coordinators delete knowledge" on public.repair_cafe_knowledge
 for delete to authenticated using(private.repair_cafe_can_manage());
comment on table public.repair_cafe_knowledge is 'Curated internal generic repair advice. Never copy visitor name, passwords or personal details from tickets.';
