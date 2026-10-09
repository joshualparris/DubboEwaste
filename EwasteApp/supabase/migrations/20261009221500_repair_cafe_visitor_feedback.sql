create table if not exists public.repair_cafe_visitor_feedback (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.repair_cafe_sessions(id),
 rating integer not null check(rating between 1 and 5),
 repair_result text not null default 'unspecified' check (repair_result in ('fixed','partial','not_fixed','not_attempted','unspecified')),
 comment text not null default '' check (char_length(comment)<=600),
 created_at timestamptz not null default now()
);
alter table public.repair_cafe_visitor_feedback enable row level security;
grant insert on public.repair_cafe_visitor_feedback to anon,authenticated;
grant select on public.repair_cafe_visitor_feedback to authenticated;
create policy "visitors can submit anonymous feedback" on public.repair_cafe_visitor_feedback
 for insert to anon,authenticated with check (exists(select 1 from public.repair_cafe_sessions s where s.id=event_id and s.status in ('published','completed')));
create policy "coordinators may read visitor feedback" on public.repair_cafe_visitor_feedback
 for select to authenticated using(private.repair_cafe_can_manage());
