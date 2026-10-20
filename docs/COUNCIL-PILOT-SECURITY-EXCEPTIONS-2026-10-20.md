# AssetFlow security exception register — 20 October 2026

Status: **unresolved exceptions, not Council approval or certification**. This record is based on the connected **DubboEwaste** Supabase project at the date above.

## Verified configuration

- Supabase organisation billing tier: **Free** (read from connected organisation settings).
- Supabase leaked-password protection is **disabled**. The feature is only available on **Pro and above**, per [Supabase password security documentation](https://supabase.com/docs/guides/auth/password-security). Do not silently upgrade billing or claim it is enabled.
- Security adviser reports **three** anonymous-accessible `SECURITY DEFINER` functions and **18** authenticated-accessible `SECURITY DEFINER` functions. These are advisories, not proof of exploitation.
- All **131** public base tables had row-level security enabled at the most recent full count; audit **function-level** permissions separately. RLS alone does not protect a `SECURITY DEFINER` routine.
- All Council pilot access must be through an authorised Dubbo E-waste account. Database RLS checks showed a volunteer cannot read pilot batches and an authorised admin can.
- Council data clearance and disposition must not be marked complete based merely on hashed file upload or a UI label.

## Reviewer action — priority

1. **Authentication**: If a paid Supabase Pro subscription is approved later, enable leaked-password protection in Authentication settings and rerun the security adviser. Until then use long unique passwords, MFA where supported, access revocation and monitored login alerts; these mitigate but do not remove the platform warning.
2. **Anonymous `analytics_public_daily_report`**: public aggregate analytics is intentional; confirm no sensitive fields, parameter bounds and minimum aggregation thresholds. Move the implementation to an audited least-privilege/isolated schema or expose a tightly bounded edge function if practical.
3. **Anonymous `redeem_circular_handoff`**: one-time ticket flow is intentional; independently assess entropy, expiry, replay and rate limiting. Verify no ticket leaks, and require a signed-in identity where feasible before privilege elevation. Treat anonymous ticket redemption as an elevated threat-model concern.
4. **Anonymous `repair_cafe_recent_feedback_events`**: publicly readable event list is intentional; verify return columns and publication status, and consider `SECURITY INVOKER` or an explicitly public read-only view.
5. **Authenticated privileged functions**: review each function's role checks, `search_path`, object identifiers and `EXECUTE` grants before changing anything. Changing grants without checking public/Repair Café/parts workflows would risk production outages.
6. **Pilot field acceptance**: a software build, CI source test and rollback-safe database trigger test are **not** a real signed-in browser role audit, verified erasure on physical media, insurance certificate or written Council agreement.

## Technical validation performed

- Draft Council job: `DEW-J-2026-00004`, batch status **DRAFT**, zero actual device records.
- SQL test: 20 synthetic devices accepted and 21st rejected; entire test rolled back.
- SQL test: activation without five uploaded signed governance items blocked.
- SQL role simulations: admin access permitted; volunteer cannot view or act as a pilot operator.
- SQL test: donation insertion and forced `DONATED` status blocked without release evidence.
- SQL test: device intake and job receipt blocked while batch is DRAFT.
- Subsequent hardening additionally requires hashed physical custody evidence and authenticated downstream recycling receipt/verification before recording Council asset as `RECYCLED`. The latter has not been field-tested with a real recycler.
- Production GitHub build and Vercel deployment reported READY for merged changes.
- Signed-in browser end-to-end QA, disaster recovery test, 20 physical devices, insurance, Council approval and downstream/vendor certificates: **not performed**.

No production asset, sanitisation, recipient or custody row was fabricated to make acceptance appear complete.
