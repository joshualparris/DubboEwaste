-- Expand model_support reference data with common donated mobile phones.
--
-- Rationale: model_support is AssetFlow's authoritative intake compatibility /
-- reuse-routing reference. Before this migration it covered laptops, Macs and a
-- large Realme/android import, but had ZERO rows for the most frequently donated
-- phone brands (Samsung, Motorola, LG, Sony, Nokia, Huawei, HTC). This adds a
-- small, hand-curated, desk-researched set so intake staff get routing guidance
-- for these devices instead of a blank lookup.
--
-- Safety / evidence discipline:
--   * Purely ADDITIVE. No schema change, no UPDATE, no DELETE.
--   * Idempotent: ON CONFLICT (manufacturer, model_name) DO NOTHING, so it is
--     safe to run more than once and will never overwrite a curator's edits.
--   * confidence = 'RESEARCH LEAD' (desk research, not bench-verified), matching
--     the existing rows. These are routing hints to confirm at intake, not
--     guarantees. Exact hardware variant / codename and any alternative-OS build
--     availability must be confirmed on the bench before relying on them.
--   * lock_risks records the Factory Reset Protection (Google account) era fact
--     only. It is NOT a claim any lock can be removed; an account-locked handset
--     must be cleared through the owner or a manufacturer-supported process.
--   * Phones also carry an Australian network caveat: after the 2024 3G
--     shutdown, a reused handset must support VoLTE and be on the carrier's
--     whitelist to place calls, including emergency calls. Confirm before reuse.

insert into public.model_support
  (manufacturer, model_name, category, support_summary, lock_risks, battery_notes, likely_route, source_url, source_checked, confidence, active, aliases, identifiers)
values
  ('Samsung','Galaxy S5','phone',
   'Android 6.0-era handset (klte family). Common donor; a well-supported LineageOS target historically, so alternative-OS reuse is plausible once the exact variant is confirmed.',
   'Factory Reset Protection applies from the shipped OS; verify no Google account lock and no carrier/MDM lock before acceptance.',
   'Removable battery on most variants - inspect for swelling, test a known-good pack.',
   'Reuse/refurbish or educational/appliance reuse if unlocked and tested; parts if screen or board economics fail.',
   'https://wiki.lineageos.org/devices/klte','2026-11-26','RESEARCH LEAD',true,
   array['galaxy s5','sm-g900','klte'], array['sm-g900f','sm-g900i','klte']),

  ('Samsung','Galaxy S7','phone',
   'Android 8.0-era handset (herolte family). Frequent donor; historically a maintained LineageOS target. Good candidate for extended reuse or alternative-OS appliance use after bench testing.',
   'Factory Reset Protection applies; confirm Google account and carrier/MDM state before acceptance.',
   'Sealed battery - check health and swelling; replacement requires a safe route.',
   'Reuse/refurbish if unlocked, supported and tested; alternative-OS or appliance reuse; parts otherwise.',
   'https://wiki.lineageos.org/devices/herolte','2026-11-26','RESEARCH LEAD',true,
   array['galaxy s7','sm-g930','herolte'], array['sm-g930f','sm-g930i','herolte']),

  ('Samsung','Galaxy S8','phone',
   'Android 9-era handset (dreamlte family). Common higher-value donor; confirm current security-update and alternative-OS build status before relying on it.',
   'Factory Reset Protection applies; confirm Google account and carrier/MDM state before acceptance.',
   'Sealed battery and curved glass - inspect carefully; repairs need a safe route.',
   'Reuse/refurbish if unlocked and tested; alternative-OS reuse plausible; parts if economics fail.',
   'https://wiki.lineageos.org/devices/dreamlte','2026-11-26','RESEARCH LEAD',true,
   array['galaxy s8','sm-g950','dreamlte'], array['sm-g950f','dreamlte']),

  ('Samsung','Galaxy J5 (2016)','phone',
   'Budget Android 6.0-era handset; very common donor. Limited official alternative-OS support - treat as existing-OS reuse or appliance/educational reuse.',
   'Factory Reset Protection applies; verify no Google account lock before acceptance.',
   'Removable battery on the 2016 variant - inspect and test.',
   'Existing-OS reuse, appliance/educational reuse (clock, calculator, media) if tested; parts otherwise.',
   'https://www.gsmarena.com/samsung_galaxy_j5-7284.php','2026-11-26','RESEARCH LEAD',true,
   array['galaxy j5','sm-j510'], array['sm-j510fn','sm-j500']),

  ('Samsung','Galaxy Tab A 10.1','tablet',
   'Common donated budget tablet. Strong candidate for fixed-purpose reuse (display, learning content, media) where native OS is adequate.',
   'Factory Reset Protection applies; verify no Google account lock and no MDM enrolment before acceptance.',
   'Sealed battery - check health and swelling.',
   'Appliance/display/educational reuse or existing-OS reuse if tested; parts otherwise.',
   'https://www.gsmarena.com/samsung_galaxy_tab_a_10_1_(2016)-8160.php','2026-11-26','RESEARCH LEAD',true,
   array['galaxy tab a','tab a 10.1'], array['sm-t580','sm-t585']),

  ('Motorola','Moto G (3rd gen)','phone',
   'Android 6.0-era handset (osprey). Popular budget donor; historically had community alternative-OS support. Confirm exact variant before relying on it.',
   'Factory Reset Protection applies; verify no Google account lock before acceptance.',
   'Sealed battery - inspect and test.',
   'Existing-OS or alternative-OS reuse if tested; appliance/educational reuse; parts otherwise.',
   'https://www.gsmarena.com/motorola_moto_g_(3rd_gen)-7251.php','2026-11-26','RESEARCH LEAD',true,
   array['moto g 2015','moto g3','osprey'], array['xt1540','xt1541','osprey']),

  ('Motorola','Moto G4 / G4 Plus','phone',
   'Android 7/8-era handset (athene). Common donor; historically a maintained LineageOS target, so alternative-OS reuse is plausible after bench testing.',
   'Factory Reset Protection applies; verify no Google account lock before acceptance.',
   'Sealed battery - check health and swelling.',
   'Reuse/refurbish or alternative-OS reuse if unlocked and tested; parts otherwise.',
   'https://wiki.lineageos.org/devices/athene','2026-11-26','RESEARCH LEAD',true,
   array['moto g4','moto g4 plus','athene'], array['xt1622','xt1640','athene']),

  ('LG','Nexus 5','phone',
   'Android 6.0-era developer-friendly handset (hammerhead). Unlockable bootloader and long community alternative-OS support make it a good reuse/appliance candidate; note the aged battery.',
   'Google account lock applies; verify ownership. No carrier lock on most units.',
   'Sealed battery, now very aged - expect reduced capacity; check for swelling.',
   'Alternative-OS or appliance/educational reuse if tested; parts otherwise.',
   'https://wiki.lineageos.org/devices/hammerhead','2026-11-26','RESEARCH LEAD',true,
   array['nexus 5','lg-d820','lg-d821','hammerhead'], array['lg-d820','lg-d821','hammerhead']),

  ('LG','G5','phone',
   'Android 7/8-era handset. Confirm current alternative-OS build status; otherwise existing-OS or appliance reuse.',
   'Factory Reset Protection applies; verify no Google account lock before acceptance.',
   'Removable modular battery - inspect and test a known-good pack.',
   'Existing-OS/alternative-OS reuse if tested; parts otherwise.',
   'https://www.gsmarena.com/lg_g5-7815.php','2026-11-26','RESEARCH LEAD',true,
   array['lg g5','h850'], array['lg-h850','h850']),

  ('Sony','Xperia Z3','phone',
   'Android 6.0-era handset (z3). Sony historically published AOSP/alternative-OS-friendly resources; confirm current build status. Waterproof-era seals degrade with age.',
   'Factory Reset Protection applies; verify no Google account lock before acceptance.',
   'Sealed battery and aged waterproof seals - check health and ingress integrity.',
   'Alternative-OS or existing-OS reuse if tested; appliance/educational reuse; parts otherwise.',
   'https://wiki.lineageos.org/devices/z3','2026-11-26','RESEARCH LEAD',true,
   array['xperia z3','d6603'], array['d6603','d6653','z3']),

  ('Nokia','Nokia 6 (2017)','phone',
   'Android One / near-stock handset; HMD devices received clean updates and are generally straightforward reuse candidates. Confirm the exact model and OS ceiling.',
   'Factory Reset Protection applies; verify no Google account lock before acceptance.',
   'Sealed battery - check health and swelling.',
   'Existing-OS reuse if unlocked and tested; appliance/educational reuse; parts otherwise.',
   'https://www.gsmarena.com/nokia_6-8513.php','2026-11-26','RESEARCH LEAD',true,
   array['nokia 6','ta-1000','ta-1021'], array['ta-1000','ta-1021']),

  ('Huawei','P8 lite','phone',
   'Android 5/6-era budget handset; common donor. Pre-2019 Huawei includes Google services. Limited alternative-OS support - treat as existing-OS or appliance reuse.',
   'Factory Reset Protection applies; verify no Google account lock. Note Huawei ID / activation state.',
   'Sealed battery - inspect and test.',
   'Existing-OS/appliance/educational reuse if tested; parts otherwise.',
   'https://www.gsmarena.com/huawei_p8lite-7201.php','2026-11-26','RESEARCH LEAD',true,
   array['p8 lite','ale-l21'], array['ale-l21','ale-l04']),

  ('HTC','Desire 530','phone',
   'Snapdragon 210 (MSM8909) Android 6.0 budget handset - the Dubbo pilot reference device (model 2PST1). No official LineageOS; MSM8909 has only generic/experimental postmarketOS. Best suited to single-purpose appliance reuse (clock, calculator, stopwatch) via the Dubbo Reuse app where ownership is cleared.',
   'Factory Reset Protection applies. The pilot unit is FRP/Google-account locked and on refurbishment hold pending authorised recovery - do not attempt any lock bypass.',
   'Sealed battery - check health and swelling before any reuse.',
   'Appliance/educational reuse via existing OS once ownership is cleared; parts otherwise. Whole-device alternative-OS only experimental.',
   'https://www.gsmarena.com/htc_desire_530-7980.php','2026-11-26','RESEARCH LEAD',true,
   array['desire 530','2pst1','htc desire 530','msm8909'], array['2pst1','0pm1'])
on conflict (manufacturer, model_name) do nothing;
