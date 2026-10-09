# Repair Café Event Desk: consolidation and verification record

**Date:** 9 October 2026. **Scope:** live DubboEwaste Supabase project and GitHub's Next.js app.

## Completed
- Chosen **public.repair_cafe_tickets** as the operational source of truth for visitor-owned repair cases and outcomes, with **public.repair_cafe_ticket_activity** as change history and **public.repair_cafe_stations** for workstations.
- Confirmed **all three competing data stores were empty** before consolidation: `repair_cafe_tickets=0`, `repair_cafe_visits=0`, `repair_cafe_repair_tickets=0`. No existing repair records required conversion.
- Committed and applied `EwasteApp/supabase/migrations/20261009174500_repair_cafe_ticket_canonical.sql` to production using the Supabase migration API. Deployment returned `success: true`.
- Retained the legacy `repair_cafe_visits` and `repair_cafe_repair_tickets` tables for schema compatibility, but revoked user write grants, removed coordinator write policies and installed blocking triggers for **INSERT, UPDATE and DELETE**, including privileged legacy write attempts. Prevents divergence and accidental double counting.
- Confirmed `rc_legacy_visit_read_only` and `rc_legacy_repair_read_only` triggers are enabled (PostgreSQL `tgenabled='O'`).
- Confirmed row-level security enabled on four tables: canonical tickets, ticket activity and both retired legacy tables.
- Vercel production deployment automatically queued/built for commit `3a7a27b`; verified **READY** in Vercel production for commit `3a7a27b` (this confirms successful deployment, not signed-in workflow acceptance).

## Important distinction
This is a **schema/data-consistency** fix, not proof the complete event-day app is production tested.

## Remaining verifications
1. **Vercel deployment READY:** completed. Inspect authenticated runtime and console/API responses to verify functioning, not just build.
2. Validate migration order, deployed app/database consistency and permissions in a signed-in browser.
3. Run end-to-end tests using disposable test tickets (no real visitor names): check-in, safety rejection, station assignment, completion, referral, unsafe item, closed-ticket immutability and history.
4. Run signed-in RLS matrix for anonymous, E-waste-only, Library-only, Repair Café member, Repair Café coordinator, Repair Café admin and global admin. Don't treat a metadata query as a substitute for these tests.
5. Verify concurrent ticket edits, duplicate submissions, invalid outcome and session/status transitions.
6. Validate mobile widths (320/375/430px), keyboard access, paper fallback and safe privacy handling.
7. Check whether non-coordinator volunteer members should see **all** ticket fault notes (currently RLS grants Repair Café members select); refine least-privilege before allowing real visitor details.
8. Repair Café Supabase security advisors also warn about intentionally authenticated `SECURITY DEFINER` ticket RPCs. They need function-level authorisation tests; an advisor warning is not itself proof of an exploit. Broader application warnings (circular handoff and leaked-password protection) are tracked separately.

## Definition of done
A verified Vercel build, tested roles and end-to-end flow, written consent/retention process, and confirmed venue/insurance/safety authority. **Do not invite public intake or claim a live successful repair session until those checks pass.**

## Source references
- Canonical migration: https://github.com/joshualparris/DubboEwaste/blob/main/EwasteApp/supabase/migrations/20261009174500_repair_cafe_ticket_canonical.sql
- Event Desk page: https://github.com/joshualparris/DubboEwaste/blob/main/EwasteApp/app/(private)/repair-cafe-volunteers/event-desk/page.tsx
- Data migration applied to Supabase DubboEwaste project `kukwydsfhlmwwxpgnbpn`.
