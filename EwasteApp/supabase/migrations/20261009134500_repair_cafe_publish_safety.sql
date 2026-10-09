-- Follow-up hardening: public RLS and fail-closed publication when coverage changes.
-- Anonymous browsers must not need EXECUTE on private.has_program().

drop policy if exists "venues visible to members or when hosting public event" on public.repair_cafe_venues;
drop policy if exists "sessions visible to volunteers or publicly when published" on public.repair_cafe_sessions;
create policy "public sees confirmed venues only"
 on public.repair_cafe_venues for select to anon
 using (exists(select 1 from public.repair_cafe_sessions e
  where e.venue_id=repair_cafe_venues.id and e.status='published'));
create policy "members see venue directory"
 on public.repair_cafe_venues for select to authenticated
 using (private.has_program('repair_cafe') or exists(select 1 from public.repair_cafe_sessions e
  where e.venue_id=repair_cafe_venues.id and e.status='published'));
create policy "public sees published sessions only"
 on public.repair_cafe_sessions for select to anon using(status='published');
create policy "members see repair cafe sessions"
 on public.repair_cafe_sessions for select to authenticated
 using (status='published' or private.has_program('repair_cafe'));

-- Check roster coverage even for direct Data API writes.
create function private.repair_cafe_validate_publish()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 if new.status='published' then
  if new.venue_id is null or new.venue_status<>'confirmed' or not new.safety_checked
    or char_length(trim(new.focus))=0 then
    raise exception 'Venue, safety and public repair scope must be confirmed before publication';
  end if;
  if not exists(select 1 from public.repair_cafe_shift_slots s where s.event_id=new.id) then
    raise exception 'At least one volunteer position is required before publication';
  end if;
  if exists(
    select 1 from public.repair_cafe_shift_slots s
    where s.event_id=new.id
    and (select count(*) from public.repair_cafe_shift_assignments a
         where a.slot_id=s.id and a.status='confirmed')<s.required_count
  ) then
   raise exception 'Every required volunteer position must be confirmed before publication';
  end if;
 end if;
 return new;
end;
$$;
create trigger repair_cafe_publish_guard
 before insert or update on public.repair_cafe_sessions
 for each row execute function private.repair_cafe_validate_publish();

-- A lost confirmed volunteer immediately removes public publication,
-- preventing an advertised category from persisting despite lost coverage.
create function private.repair_cafe_coverage_changed()
returns trigger language plpgsql security definer set search_path=''
as $$
declare affected uuid;
begin
 if tg_op='DELETE' then
  if old.status<>'confirmed' then return old; end if;
  select event_id into affected from public.repair_cafe_shift_slots where id=old.slot_id;
 elsif tg_op='UPDATE' then
  if old.status<>'confirmed' or new.status='confirmed' then return new; end if;
  select event_id into affected from public.repair_cafe_shift_slots where id=old.slot_id;
 end if;
 update public.repair_cafe_sessions set status='collecting',updated_at=now()
  where id=affected and status='published';
 if tg_op='DELETE' then return old; else return new; end if;
end;
$$;
create trigger repair_cafe_coverage_watch
 after update of status or delete on public.repair_cafe_shift_assignments
 for each row execute function private.repair_cafe_coverage_changed();

create function private.repair_cafe_slots_changed()
returns trigger language plpgsql security definer set search_path=''
as $$
declare affected uuid;
begin
 affected:=case when tg_op='DELETE' then old.event_id else new.event_id end;
 update public.repair_cafe_sessions set status='collecting',updated_at=now()
  where id=affected and status='published';
 if tg_op='DELETE' then return old; else return new; end if;
end;
$$;
create trigger repair_cafe_slots_watch
 after insert or update or delete on public.repair_cafe_shift_slots
 for each row execute function private.repair_cafe_slots_changed();

-- Venue details modified after public announcement require a new review.
create function private.repair_cafe_venue_changed()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 if (new.address,new.accessibility,new.permitted_activities) is distinct from
    (old.address,old.accessibility,old.permitted_activities) then
  update public.repair_cafe_sessions
    set status='draft',safety_checked=false,updated_at=now()
    where venue_id=new.id and status='published';
 end if;
 return new;
end;
$$;
create trigger repair_cafe_venue_watch
 after update on public.repair_cafe_venues
 for each row execute function private.repair_cafe_venue_changed();
