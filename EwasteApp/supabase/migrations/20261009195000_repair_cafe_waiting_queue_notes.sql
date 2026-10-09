-- Volunteer-editable intake notes without changing a ticket's queued status.
-- Keep reported problem and internal queue notes separate from repair milestones/final outcomes.
alter table public.repair_cafe_tickets
 add column queue_notes text not null default '' check (char_length(queue_notes)<=1000);
alter table public.repair_cafe_ticket_activity
 add column queue_note_snapshot text check(char_length(queue_note_snapshot)<=1000),
 add column problem_snapshot text check(char_length(problem_snapshot)<=700);

create function public.repair_cafe_edit_waiting_notes(
 p_ticket_id uuid,
 p_expected_updated_at timestamptz,
 p_reported_problem text,
 p_queue_notes text
)
returns void language plpgsql security definer set search_path=''
as $$
declare old_ticket public.repair_cafe_tickets%rowtype;
        event_status text;
begin
 if auth.uid() is null or not private.has_program('repair_cafe') then
  raise exception 'Repair Café membership required' using errcode='42501';
 end if;
 select * into old_ticket from public.repair_cafe_tickets where id=p_ticket_id for update;
 if not found then raise exception 'Ticket not found'; end if;
 if old_ticket.status<>'waiting' then
  raise exception 'Queue notes can be edited while the ticket is waiting. Use repair milestones once work begins.';
 end if;
 select status into event_status from public.repair_cafe_sessions
 where id=old_ticket.event_id and deleted_at is null;
 if event_status is null or event_status in ('completed','cancelled')
    or (event_status<>'published' and not private.repair_cafe_can_manage()) then
  raise exception 'The event is not open for updating queue notes';
 end if;
 if p_expected_updated_at is null or old_ticket.updated_at is distinct from p_expected_updated_at then
  raise exception 'This ticket changed on another device. Close and reopen queue notes before saving.';
 end if;
 p_reported_problem:=trim(coalesce(p_reported_problem,''));
 p_queue_notes:=trim(coalesce(p_queue_notes,''));
 if length(p_reported_problem)<3 or length(p_reported_problem)>700 or length(p_queue_notes)>1000 then
  raise exception 'Problem must have 3–700 characters and queue notes at most 1000 characters';
 end if;
 if p_reported_problem is not distinct from old_ticket.reported_problem
    and p_queue_notes is not distinct from old_ticket.queue_notes then
  return;
 end if;
 update public.repair_cafe_tickets set
  reported_problem=p_reported_problem,queue_notes=p_queue_notes,
  updated_by=auth.uid(),updated_at=clock_timestamp()
 where id=p_ticket_id;
 insert into public.repair_cafe_ticket_activity(
  ticket_id,actor_id,from_status,to_status,note,problem_snapshot,queue_note_snapshot
 ) values(
  p_ticket_id,auth.uid(),'waiting','waiting',
  case when p_reported_problem is distinct from old_ticket.reported_problem
       and p_queue_notes is distinct from old_ticket.queue_notes
       then 'Updated reported problem and queue notes'
       when p_reported_problem is distinct from old_ticket.reported_problem
       then 'Updated reported problem'
       else 'Updated queue notes' end,
  p_reported_problem,p_queue_notes
 );
end
$$;
revoke all on function public.repair_cafe_edit_waiting_notes(uuid,timestamptz,text,text)
 from public,anon;
grant execute on function public.repair_cafe_edit_waiting_notes(uuid,timestamptz,text,text)
 to authenticated;
comment on column public.repair_cafe_tickets.queue_notes is
 'Private reception/triage notes, editable while waiting; not a completed repair outcome.';
