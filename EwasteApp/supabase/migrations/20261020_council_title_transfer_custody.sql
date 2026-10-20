-- Council ownership title-transfer timing: custody is not ownership.
-- Only applies to records explicitly governed by a signed active Council agreement.
create or replace function private.council_title_transfer_guard()
returns trigger language plpgsql security definer set search_path=''
as $title$
declare v_transfer text;
begin
 if new.job_id is null then return new; end if;
 select g.title_transfer_point into v_transfer
 from public.council_pilot_batches b
 join public.council_pilot_agreements g on g.id=b.approved_agreement_id and g.batch_id=b.id
 where b.job_id=new.job_id;
 if v_transfer is distinct from 'ON_SIGNED_RELEASE' then return new; end if;
 if tg_op='INSERT' then
   if new.ownership_verified or new.owner_kind <> 'THIRD_PARTY' or length(trim(coalesce(new.owner_name,'')))<3 then
     raise exception 'Council retains title: record custody under a named third-party owner with ownership NOT verified';
   end if;
 elsif new.ownership_verified and not old.ownership_verified then
   if not exists(
      select 1 from public.asset_authority_records r
      join public.evidence e on e.id=r.evidence_id
      where r.asset_id=new.id and r.authority_type='OWNER_TRANSFER'
        and e.entity_type='asset' and e.entity_id=new.id and length(coalesce(e.sha256,''))=64
    ) then raise exception 'Signed per-device OWNER_TRANSFER authority required before confirming Council title transfer'; end if;
 end if;
 return new;
end $title$;
revoke all on function private.council_title_transfer_guard() from public,anon,authenticated;
create trigger council_title_transfer_guard before insert or update of ownership_verified on public.assets
for each row execute function private.council_title_transfer_guard();
