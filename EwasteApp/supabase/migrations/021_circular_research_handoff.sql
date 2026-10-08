-- One-time same-account handoff from authenticated AssetFlow to Circular Economy.
-- Tickets travel via user-initiated POST (never URL query parameters).
-- Exchanging a ticket grants only a limited Circular research session, not DB access.
create table private.circular_handoff_tickets (
 ticket_digest text primary key,
 user_id uuid not null references public.profiles(id) on delete cascade,
 role text not null check(role in ('volunteer','staff','admin')),
 issued_at timestamptz not null default now(),
 expires_at timestamptz not null default (now() + interval '2 minutes')
);
create index circular_handoff_expiry on private.circular_handoff_tickets(expires_at);
revoke all on private.circular_handoff_tickets from public,anon,authenticated;

create or replace function public.issue_circular_handoff()
returns text language plpgsql security definer set search_path='' as $$
declare result text; grant_role text;
begin
 if auth.uid() is null then raise exception 'Authentication required' using errcode='42501'; end if;
 if not exists (
   select 1 from public.profiles p where p.id=auth.uid() and p.active
 ) or not exists (
   select 1 from public.program_access pa where pa.user_id=auth.uid() and pa.active
 ) then raise exception 'Active programme membership required' using errcode='42501'; end if;

 grant_role:=case when private.is_global_admin() then 'admin'
  when exists (select 1 from public.program_access pa where pa.user_id=auth.uid() and pa.active and pa.programme_role='admin') then 'staff'
  else 'volunteer' end;
 delete from private.circular_handoff_tickets where user_id=auth.uid() or expires_at<now();
 result:=encode(extensions.gen_random_bytes(32),'hex');
 insert into private.circular_handoff_tickets(ticket_digest,user_id,role)
 values(encode(extensions.digest(result,'sha256'),'hex'),auth.uid(),grant_role);
 return result;
end $$;
revoke all on function public.issue_circular_handoff() from public,anon,authenticated;
grant execute on function public.issue_circular_handoff() to authenticated;

create or replace function public.redeem_circular_handoff(in_ticket text)
returns text language plpgsql security definer set search_path='' as $$
declare item record;
begin
 if in_ticket is null or in_ticket !~ '^[0-9a-f]{64}$' then return null; end if;
 delete from private.circular_handoff_tickets
 where ticket_digest=encode(extensions.digest(in_ticket,'sha256'),'hex')
 returning user_id,role,expires_at into item;
 if not found or item.expires_at<=now() then return null; end if;
 if not exists (
   select 1 from public.profiles p join public.program_access pa on pa.user_id=p.id
   where p.id=item.user_id and p.active and pa.active
 ) then return null; end if;
 return item.role;
end $$;
revoke all on function public.redeem_circular_handoff(text) from public,anon,authenticated;
grant execute on function public.redeem_circular_handoff(text) to anon;
