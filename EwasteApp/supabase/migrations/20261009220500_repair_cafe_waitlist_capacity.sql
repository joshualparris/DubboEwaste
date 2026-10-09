create table if not exists public.repair_cafe_shift_waitlist (
 id uuid primary key default gen_random_uuid(),
 slot_id uuid not null references public.repair_cafe_shift_slots(id) on delete cascade,
 user_id uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 state text not null default 'waiting' check (state in ('waiting','offered','withdrawn')),
 unique(slot_id,user_id)
);
alter table public.repair_cafe_shift_waitlist enable row level security;
grant select,insert,update on public.repair_cafe_shift_waitlist to authenticated;
create policy "self waitlist read" on public.repair_cafe_shift_waitlist for select to authenticated using(user_id=auth.uid() or private.repair_cafe_can_manage());
create policy "self waitlist join" on public.repair_cafe_shift_waitlist for insert to authenticated with check(user_id=auth.uid() and private.has_program('repair_cafe'));
create policy "self waitlist update" on public.repair_cafe_shift_waitlist for update to authenticated using(user_id=auth.uid() or private.repair_cafe_can_manage()) with check(user_id=auth.uid() or private.repair_cafe_can_manage());
alter table public.repair_cafe_stations add column if not exists capacity integer not null default 1 check(capacity between 1 and 20);