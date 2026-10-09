-- Track progress DURING a Repair Café repair separately from its final outcome.
-- Waiting/in-progress ticket outcomes stay null, preserving accurate repair-impact reporting.
alter table public.repair_cafe_tickets
  add column progress_code text check (
    progress_code is null or progress_code in (
      'diagnosing','progress_made','partly_working','awaiting_parts','blocked','needs_more_work'
    )
  );
alter table public.repair_cafe_ticket_activity
  add column progress_code text check (
    progress_code is null or progress_code in (
      'diagnosing','progress_made','partly_working','awaiting_parts','blocked','needs_more_work'
    )
  );

-- Single transactional operation: check stale form, perform existing membership/safety/status
-- rules, then preserve the current interim finding in both the ticket and its activity history.
-- Do NOT weaken the original completed-outcome constraint or expose direct ticket writes.
create function public.repair_cafe_save_ticket_with_progress(
 p_ticket_id uuid,p_status text,p_station_id uuid,
 p_outcome text,p_barrier text,p_note text,p_advice text,p_parts text,
 p_risk text,p_risk_notes text,p_progress_code text,p_expected_updated_at timestamptz
)
returns void language plpgsql security definer set search_path=''
as $$
declare previous public.repair_cafe_tickets%rowtype;
begin
 if auth.uid() is null or not private.has_program('repair_cafe') then
  raise exception 'Repair Café membership required' using errcode='42501';
 end if;
 select * into previous from public.repair_cafe_tickets where id=p_ticket_id for update;
 if not found then raise exception 'Ticket not found'; end if;
 if p_expected_updated_at is null or previous.updated_at is distinct from p_expected_updated_at then
  raise exception 'This ticket changed on another device. Close and reopen it before saving.';
 end if;
 if p_progress_code is not null and p_progress_code not in (
  'diagnosing','progress_made','partly_working','awaiting_parts','blocked','needs_more_work'
 ) then raise exception 'Invalid interim repair progress'; end if;
 if p_status in ('waiting','in_progress') and p_outcome is not null then
  raise exception 'Choose an interim progress update while the ticket is open, not a final outcome';
 end if;

 -- Existing RPC maintains programme access, safe risk screening, station scope,
 -- closed-ticket permissions, ticket state/closure rules and immutable history.
 perform public.repair_cafe_save_ticket(
  p_ticket_id,p_status,p_station_id,p_outcome,p_barrier,
  p_note,p_advice,p_parts,p_risk,p_risk_notes
 );
 update public.repair_cafe_tickets set
  progress_code=p_progress_code,updated_at=clock_timestamp(),updated_by=auth.uid()
 where id=p_ticket_id;

 -- The canonical save RPC inserts precisely one activity record while this row is locked.
 -- Attach the progress snapshot to that log entry rather than duplicating it.
 update public.repair_cafe_ticket_activity set progress_code=p_progress_code
 where id=(
  select a.id from public.repair_cafe_ticket_activity a
  where a.ticket_id=p_ticket_id and a.actor_id=auth.uid()
  order by a.created_at desc,a.id desc limit 1
 );
end
$$;
revoke all on function public.repair_cafe_save_ticket_with_progress(uuid,text,uuid,text,text,text,text,text,text,text,text,timestamptz)
 from public,anon;
grant execute on function public.repair_cafe_save_ticket_with_progress(uuid,text,uuid,text,text,text,text,text,text,text,text,timestamptz)
 to authenticated;
comment on column public.repair_cafe_tickets.progress_code is
 'Interim finding; does NOT mean the repair is finished or count as a final repair outcome.';
