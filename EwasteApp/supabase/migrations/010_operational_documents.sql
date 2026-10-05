-- Editable operations-document working copies for AssetFlow.
-- Repository Markdown remains the seeded baseline; this table stores private website overrides.

create table if not exists public.operational_document_overrides (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 1 and 180),
  section text not null check (char_length(section) between 1 and 80),
  summary text not null default '' check (char_length(summary) <= 500),
  body_markdown text not null check (char_length(body_markdown) between 1 and 500000),
  source_path text not null,
  version integer not null default 1 check (version > 0),
  updated_by uuid not null references public.profiles(id),
  updated_at timestamptz not null default now()
);

create index if not exists operational_document_overrides_updated_by_idx on public.operational_document_overrides(updated_by);\n\nalter table public.operational_document_overrides enable row level security;

revoke all on table public.operational_document_overrides from anon;
grant select, insert, update, delete on table public.operational_document_overrides to authenticated;

insert into public.permission_targets(table_name,label,category,mutable)
values ('operational_document_overrides','Operations documents','Configuration',true)
on conflict (table_name) do update
set label=excluded.label, category=excluded.category, mutable=excluded.mutable;

insert into public.role_table_permissions(role,table_name,can_create,can_read,can_update,can_delete)
values
  ('admin'::public.staff_role,'operational_document_overrides',true,true,true,true),
  ('manager'::public.staff_role,'operational_document_overrides',true,true,true,true),
  ('technician'::public.staff_role,'operational_document_overrides',false,true,false,false),
  ('volunteer'::public.staff_role,'operational_document_overrides',false,true,false,false),
  ('auditor'::public.staff_role,'operational_document_overrides',false,true,false,false)
on conflict (role,table_name) do update
set can_create=excluded.can_create,
    can_read=excluded.can_read,
    can_update=excluded.can_update,
    can_delete=excluded.can_delete,
    updated_at=now();

drop policy if exists "operations docs active staff select" on public.operational_document_overrides;
create policy "operations docs active staff select"
on public.operational_document_overrides for select to authenticated
using ((select private.is_active_staff()));

drop policy if exists "operations docs permission select" on public.operational_document_overrides;
create policy "operations docs permission select"
on public.operational_document_overrides as restrictive for select to authenticated
using ((select private.has_table_permission('operational_document_overrides','read')));

drop policy if exists "operations docs active staff insert" on public.operational_document_overrides;
create policy "operations docs active staff insert"
on public.operational_document_overrides for insert to authenticated
with check ((select private.is_active_staff()));

drop policy if exists "operations docs permission insert" on public.operational_document_overrides;
create policy "operations docs permission insert"
on public.operational_document_overrides as restrictive for insert to authenticated
with check ((select private.has_table_permission('operational_document_overrides','create')) and updated_by=(select auth.uid()));

drop policy if exists "operations docs active staff update" on public.operational_document_overrides;
create policy "operations docs active staff update"
on public.operational_document_overrides for update to authenticated
using ((select private.is_active_staff()))
with check ((select private.is_active_staff()));

drop policy if exists "operations docs permission update" on public.operational_document_overrides;
create policy "operations docs permission update"
on public.operational_document_overrides as restrictive for update to authenticated
using ((select private.has_table_permission('operational_document_overrides','update')))
with check ((select private.has_table_permission('operational_document_overrides','update')) and updated_by=(select auth.uid()));

drop policy if exists "operations docs active staff delete" on public.operational_document_overrides;
create policy "operations docs active staff delete"
on public.operational_document_overrides for delete to authenticated
using ((select private.is_active_staff()));

drop policy if exists "operations docs permission delete" on public.operational_document_overrides;
create policy "operations docs permission delete"
on public.operational_document_overrides as restrictive for delete to authenticated
using ((select private.has_table_permission('operational_document_overrides','delete')));
