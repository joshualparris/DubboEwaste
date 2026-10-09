# EwasteApp roadmap

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **Status correction (9 October 2026):** This older AssetFlow roadmap predates the major Repair Café release and broader LMS work. See [live feature and verification register](../docs/LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md) and [Repair Café phase roadmap](../docs/REPAIR-CAFE-PRODUCT-COMPARISON-IMPLEMENTATION-ROADMAP-2026-10-09.md). The app now includes Repair Café tickets, station dispatch, QR attendance, self-service roster, local knowledge/search, incident/venue audit, reports and offline/realtime code; source presence, production migration, field tests and provider activation have **different** statuses. Commercial integration proposals below are not automatically completed by this change.


Original slice roadmap: 5 October 2026; current-product addendum: 9 October 2026

The detailed long-range platform backlog remains in [docs/ASSETFLOW-PLATFORM-BACKLOG.md](../docs/ASSETFLOW-PLATFORM-BACKLOG.md). This file tracks the production website itself.

## Status legend

- [x] shipped and operator-facing
- [~] useful foundation exists; more automation/integration can be added later
- [ ] not yet built
- External = depends on hardware, third-party credentials, vendor approval or a real-world decision

## Slice 1 — foundation — COMPLETE

- [x] Next.js app shell
- [x] private login and access-code signup
- [x] staff roles
- [x] Supabase schema/RLS
- [x] real Supabase production project
- [x] admin account and permission management
- [x] private Vercel deployment
- [x] asset register
- [x] new intake record
- [x] automatic asset codes
- [x] QR asset page
- [x] evidence/photos
- [x] audit events
- [x] editable operations-document library

## Slice 2 — interactive triage — PHASE 0 COMPLETE

- [x] front-door ACCEPT / HOLD / REJECT decision wizard
- [x] ownership and authority gate
- [x] lithium/physical safety gate
- [x] account-lock / MDM / Autopilot gate
- [~] category-specific lanes — Phase 0 categories are covered; deeper model/category playbooks remain ongoing
- [x] support/model lookup
- [x] multi-source device intelligence: Google Play devices, Open Icecat adapter, Lenovo PSREF, FCC, PCI/USB IDs, LVFS, Wikidata and Wikipedia fallback
- [~] rich vendor/specification enrichment — identity lookup is live; deeper per-model CPU/RAM/storage/display/support data will continue to expand
- [x] route selection and final-route gate
- [x] reason / required-evidence output
- [x] optional saved triage assessment against an existing asset

## Slice 3 — diagnostics + sanitisation — OPERATOR WORKFLOW SHIPPED

- [x] guided diagnostic checks
- [~] imported battery/SMART results — manual/external-report recording works; native parsers remain
- [x] wipe/sanitisation jobs and verification records
- [x] sanitisation capability matrix
- [x] certificates/reports
- [x] chain-of-custody status history
- External: workstation-local destructive commands and certified vendor integrations

## Slice 4 — inventory + economics — PHASE 0 SHIPPED

- [x] cost/labour/parts records
- [x] market observations and pricing rules
- [x] route recommendations
- [x] parts/scrap routes
- [x] do-not-accept rules through triage
- [x] WIP ageing reporting
- [~] automatic stale-stock repricing queue can be expanded later

## Slice 5 — selling + customer + CRM — PHASE 0 SHIPPED

- [x] customers/sources
- [x] leads and contact history
- [x] lead-to-customer conversion preserving CRM history
- [x] service/collection opportunity pipeline
- [x] overdue follow-up queue on CRM and dashboard
- [x] versioned quotes
- [x] printable / PDF-ready client quote layout
- [x] quote-to-job conversion
- [x] job lifecycle updates
- [x] safe deletion of empty/test jobs; jobs with operational history are cancelled instead
- [x] resale listings and sales
- [x] returns/RMA
- [x] recall/audit traceability through customer → job → asset → sale records
- [~] invoice/accounting export is later finance scope
- External: email delivery provider and marketplace APIs

## Slice 6 — integrations and scale

The current production website is usable without these. They are later automation/enterprise capabilities, not blockers for the bounded Phase 0 site.

- [~] bench diagnostic uploader/manual structured imports
- [ ] native nwipe/ShredOS + smartmontools parsers
- External: local processing agent
- External: direct barcode/label-printer, scale and carrier integrations
- External: marketplace/auction APIs
- [ ] customer portal with customer-scoped RLS
- [ ] approval matrix for high-risk actions
- [ ] multi-site/offline warehouse mode
- [ ] enterprise SSO
- [ ] advanced retention automation

## Current website completion boundary

For the bounded Dubbo Phase 0 operating model, the production website now has the required human workflows for:

triage → customer/source → quote/opportunity → job → intake → custody → diagnostics → sanitisation → repair/parts → grade → resale/recycling → certificate/reporting → follow-up.

Remaining items are primarily deeper automation, external integrations, customer-facing enterprise features or real-world business gates. They should not be treated as evidence that the current staff website is unfinished.
