-- Add a minimal first-name/nickname call-out label, not a legal identity.
alter table public.repair_cafe_tickets
 add column if not exists visitor_display_name text not null default ''
 check (char_length(visitor_display_name)<=50);

create or replace function public.repair_cafe_check_in_named(
 p_event_id uuid,p_category text,p_item text,p_problem text,
 p_acknowledged boolean,p_screened boolean,p_risk text,
 p_risk_notes text,p_visitor_name text
) returns table(ticket_id uuid,queue_number integer)
language plpgsql security definer set search_path='' as $$
declare v_id uuid; v_number integer; v_name text;
begin
 if auth.uid() is null or not private.has_program('repair_cafe') then
  raise exception 'Repair Café membership required' using errcode='42501';
 end if;
 v_name:=trim(coalesce(p_visitor_name,''));
 if char_length(v_name) not between 1 and 50 or v_name ~ '[[:cntrl:]]' then
  raise exception 'Enter a first name or nickname (1–50 characters)';
 end if;
 select x.ticket_id,x.queue_number into v_id,v_number
 from public.repair_cafe_check_in(p_event_id,p_category,p_item,p_problem,p_acknowledged,p_screened,p_risk,p_risk_notes) x;
 update public.repair_cafe_tickets set visitor_display_name=v_name where id=v_id;
 return query select v_id,v_number;
end $$;
revoke all on function public.repair_cafe_check_in_named(uuid,text,text,text,boolean,boolean,text,text,text) from public,anon;
grant execute on function public.repair_cafe_check_in_named(uuid,text,text,text,boolean,boolean,text,text,text) to authenticated;
