-- Programme membership and row isolation. Existing operational inventory remains E-waste.
create table if not exists public.program_access (
 user_id uuid not null references public.profiles(id) on delete cascade,
 program text not null, granted_at timestamptz not null default now(),
 granted_by uuid references public.profiles(id), primary key(user_id,program)
);
do $$ declare c record; begin
 for c in select conname from pg_constraint where conrelid='public.program_access'::regclass and contype='c' loop
  execute format('alter table public.program_access drop constraint %I',c.conname);
 end loop;
end $$;
alter table public.program_access add constraint program_access_program_check check(program in ('dubbo_ewaste','library_of_things','repair_cafe'));
alter table public.program_access add column if not exists programme_role text not null default 'volunteer' check(programme_role in ('admin','manager','technician','volunteer','auditor'));
alter table public.program_access add column if not exists active boolean not null default true;
update public.program_access pa set programme_role=case when p.role::text='repair_volunteer' then 'volunteer' else p.role::text end from public.profiles p where p.id=pa.user_id;
insert into public.program_access(user_id,program,programme_role)
select p.id,pr.program,case when p.role::text='repair_volunteer' then 'volunteer' else p.role::text end
from public.profiles p cross join (values('dubbo_ewaste'),('library_of_things'),('repair_cafe')) pr(program)
where p.role::text='admin' on conflict do nothing;
insert into public.program_access(user_id,program,programme_role)
select id,case when role::text='repair_volunteer' then 'repair_cafe' else 'dubbo_ewaste' end,
case when role::text='repair_volunteer' then 'volunteer' else role::text end from public.profiles
where not exists(select 1 from public.program_access pa where pa.user_id=profiles.id) on conflict do nothing;

create or replace function private.is_global_admin() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.profiles where id=auth.uid() and active and role::text='admin')
$$;
create or replace function private.has_program(target_program text) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.profiles p where p.id=auth.uid() and p.active and
 (p.role::text='admin' or exists(select 1 from public.program_access pa where pa.user_id=p.id and pa.program=target_program and pa.active)))
$$;
create or replace function private.selected_programme() returns text language plpgsql stable security definer set search_path='' as $$
declare wanted text; begin
 if auth.uid() is null then return null; end if;
 wanted:=nullif(coalesce(nullif(current_setting('request.headers',true),''),'{}')::jsonb->>'x-assetflow-programme','');
 if wanted='all' then if private.is_global_admin() then return null; else return '__denied__'; end if; end if;
 if wanted is not null then if private.has_program(wanted) then return wanted; else return '__denied__'; end if; end if;
 if private.is_global_admin() then return null; end if;
 select pa.program into wanted from public.program_access pa join public.profiles p on p.id=pa.user_id where pa.user_id=auth.uid() and pa.active and p.active order by pa.program limit 1;
 return coalesce(wanted,'__denied__');
end $$;
create or replace function private.is_programme_admin(pr text) returns boolean language sql stable security definer set search_path='' as $$
 select private.is_global_admin() or exists(select 1 from public.program_access pa join public.profiles p on p.id=pa.user_id where pa.user_id=auth.uid() and p.active and pa.active and pa.program=pr and pa.programme_role='admin')
$$;
create or replace function private.programme_table_allowed(t text,pr text) returns boolean language sql immutable set search_path='' as $$
 select case
 when pr='dubbo_ewaste' then t not in ('repair_cafe_public_feedback','repair_cafe_demand_observations','item_loans')
 when pr in ('library_of_things','repair_cafe') then t=any(array[
 'assets','asset_attributes','asset_authority_records','asset_defects','asset_events','asset_quarantines','asset_tests','asset_triage_assessments',
 'customers','defect_templates','diagnostic_profiles','diagnostic_runs','evidence','exceptions','grades','jobs','locations','operational_events','parts','repairs','workstations',
 case when pr='library_of_things' then 'item_loans' else 'repair_cafe_public_feedback' end,
 case when pr='repair_cafe' then 'repair_cafe_demand_observations' else 'item_loans' end])
 else false end
$$;
