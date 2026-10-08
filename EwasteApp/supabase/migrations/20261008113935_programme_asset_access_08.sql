create or replace function private.has_table_permission(target_table text,action_name text) returns boolean language plpgsql stable security definer set search_path='' as $$
declare v boolean; r public.staff_role; begin
 if not private.is_active_staff() then return false; end if;
 r:=private.current_staff_role();
 if r='admin' then return true; end if;
 select case action_name when 'create' then can_create when 'read' then can_read when 'update' then can_update when 'delete' then can_delete end into v
 from public.user_table_permission_overrides where user_id=auth.uid() and table_name=target_table;
 if v is not null then return v; end if;
 select case action_name when 'create' then can_create when 'read' then can_read when 'update' then can_update when 'delete' then can_delete end into v
 from public.role_table_permissions where role=r and table_name=target_table;
 return coalesce(v,false);
end $$;
