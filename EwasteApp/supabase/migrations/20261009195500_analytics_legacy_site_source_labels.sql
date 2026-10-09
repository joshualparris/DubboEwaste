-- Classify legacy traffic correctly while an older Vercel build remains cached/live.
-- Event host/path labels are not account identifiers.
create or replace function private.analytics_relabel_legacy_source()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.site = 'dubbo_ewaste' then
    if new.page_group in ('/field-school','/glossary','/itad-research','/multimeter-training',
                          '/legacy-admin','/legacy-gateway')
       or new.referrer_domain = 'joshualparris.github.io' then
      new.site := 'github_pages';
    elsif new.referrer_domain = 'assetflow-backup.onrender.com' then
      new.site := 'render_backup';
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists analytics_relabel_legacy_source on public.analytics_events;
create trigger analytics_relabel_legacy_source
before insert on public.analytics_events
for each row execute function private.analytics_relabel_legacy_source();
