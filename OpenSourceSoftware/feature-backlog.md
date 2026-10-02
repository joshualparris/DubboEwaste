# AssetFlow Feature Backlog

Derived from the MAKOR, RazorERP, Blancco and Phonecheck workflow research.

Updated: 2 October 2026

The broader vendor-feature backlog is tracked in [docs/ASSETFLOW-PLATFORM-BACKLOG.md](../docs/ASSETFLOW-PLATFORM-BACKLOG.md), including CRM, logistics, finance, certified erasure, triage platforms and integration work. This file remains the detailed implementation inventory for the shipped AssetFlow core.

## Status legend

- [x] **Shipped** — implemented in the AssetFlow app/database with an operator-facing workflow.
- [~] **Foundation** — schema/API/workflow foundation exists, but automation or integration is not yet complete.
- [ ] **Backlog** — not yet implemented.
- **External** — depends on third-party credentials, hardware, vendor access or a documented external format.

A checkbox is only marked shipped when the feature is represented by real operational data and can be used from the application or an implemented endpoint. A table alone is not enough.

## P0 — operating spine

- [x] Customers/sites/contacts — customer/source records and job/source linkage.
- [x] Inbound jobs — human-readable job IDs, lifecycle status, expected count/weight.
- [x] Work instructions — per-job operational instructions.
- [x] Attachments/photos — private Supabase Storage evidence bucket, SHA-256 hashing, asset/media upload and secure download.
- [x] Quick receiving — serialized receiving flow plus bulk-lot receiving.
- [x] Bulk lots — quantity/weight/location/status.
- [x] Serialized assets — canonical DEW asset records.
- [x] QR/barcode labels — QR label on asset record; scanner-friendly global search.
- [x] Locations — site/zone/shelf/bench/quarantine records.
- [x] Device timeline/event ledger — asset_events plus cross-entity operational_events.
- [x] Dynamic device attributes — arbitrary key/value attributes with provenance source.
- [x] Data-bearing flag — intake flag and data-state lifecycle.
- [x] Separate media records — HDD/SSD/NVMe/eMMC/USB/SD/tape records with independent IDs.
- [x] Manual sanitisation record — per-media sanitisation tasks, tool/method/version/verification/evidence hash.
- [x] Basic diagnostics checklist — device test records with pass/fail/review/not-present/not-tested.
- [x] Grade — independent functional/cosmetic/battery/completeness/marketability and final grade.
- [x] Disposition — traceable disposition decisions.
- [x] Reuse / sale / donation / parts / recycle routes.
- [x] Basic certificate PDF — printable receipt/disposition/history/sanitisation/destruction/recycling snapshots.
- [x] Global serial/asset search — assets, media, jobs, lots, certificates, customers, parts, BOL/outbound IDs.
- [x] Exception queue — severity/status/resolution workflow; wipe failures create exceptions.
- [x] Role permissions — Supabase Auth + active staff profiles + RLS role gates.

**P0 status: complete.**

## P1 — high-value ITAD / recycling workflow

### Data sanitisation and diagnostics

- [~] nwipe/ShredOS report ingestion — raw report upload, hash retention and normalized manual result are shipped; automatic parser for native nwipe/ShredOS report formats remains.
- [x] raw wipe evidence retention + hashes — immutable Storage object reference + SHA-256 + evidence metadata.
- [ ] smartmontools ingestion — **External format adapter** still to build.
- [~] automated hardware discovery — asset dynamic attributes/media model can ingest discovered data; local discovery adapter remains.
- [x] sanitisation policies — named standard/method/retry/fallback policies.
- [~] wipe retry/fallback workflow — retry/failure/destruction/supervisor states and exceptions exist; automatic policy executor remains.
- [x] Device History Report — certificate snapshot includes asset, diagnostics, media, sanitisation, grade, evidence and disposition history.

### Repair, parts and grading

- [x] repair tickets — diagnosis, labour/parts estimate, expected value uplift, state and technician.
- [x] parts harvesting — traceable part records generated from an origin asset.
- [x] component provenance — inherited origin asset/job/customer.
- [x] cosmetic + functional grades — plus battery/completeness/marketability.
- [x] defect/devaluation templates — reusable severity/category templates calculate fixed + percentage value penalties, grade penalties and optional route overrides.
- [x] automatic routing recommendations — ordered JSON conditions are evaluated against live asset/grade context and matching recommendations can be applied with an audit event.

### Bulk recycling / outbound

- [x] pallets/containers — type, tare, location, customer segregation, hazard/seal/status.
- [x] lot splitting/sorting — parent lots can create traceable child lots with inherited job/location context.
- [x] mass balance — parent input, child outputs and residual/loss/outbound adjustments reconcile against configurable tolerance; variance opens/resolves exceptions automatically.
- [x] downstream vendors — capabilities/evidence requirements and contact details.
- [x] outbound orders — destination/carrier/BOL/weight/status.
- [~] downstream evidence — generic hashed evidence model accepts outbound evidence; dedicated receipt-evidence panel remains.
- [x] Certificate of Recycling — certificate type and hashed snapshot.
- [x] Certificate of Destruction — certificate type and hashed snapshot.
- [x] Certificate of Sanitisation — certificate type and media/sanitisation evidence snapshot.
- [x] receiving report — receipt/receiving certificate snapshots.

## P2 — scaling and automation

### Workflow / workstation automation

- [ ] visual workflow editor — JSON rule editor exists, but not a visual node editor.
- [x] rules engine — deterministic equality/in/not/exists/range/contains/all/any condition evaluator is live.
- [~] automatic routing — matching rules are evaluated automatically, but route changes still require a human Apply action so conflicting rules remain visible and auditable.
- [x] configurable workstation profiles — receiving/wipe/diagnostics/repair/grading/parts profiles.
- [ ] local processing agent — **External workstation component** still required.
- [ ] scale integration — **External hardware adapter**.
- [ ] printer integration — QR generation exists; direct label-printer adapter remains.
- [ ] FOG integration — **External service adapter**.
- [ ] BIOS/UEFI data integration — dynamic attributes support it; discovery adapter remains.

### Resale / commercial

- [x] automated pricing — configurable category/grade pricing rules with minimums; matching market-observation median is used as fallback when no manual asking price is supplied.
- [x] resale qualification gate — ownership + cleared/non-data-bearing state + grade are required before listing.
- [ ] eBay API — **External credentials/API approval**; listing model is ready for an adapter.
- [x] sale/fees/freight — sale events record sold value, marketplace fees and freight.
- [x] returns/RMA — sale-linked returns can be opened, held, costed and resolved as refunded/repaired/replaced/closed/rejected.
- [x] settlement — job settlement calculator automatically pulls resale revenue, marketplace fees, freight and repair parts, then combines service/material/scrap/labour inputs.
- [x] consignment/revenue share — customer share is calculated as a configurable percentage of positive contribution and stored in the settlement evidence.

### Reporting / portal / API

- [x] environmental dashboard — measured reuse/recycle/mass metrics only; no unsupported emissions claims.
- [~] productivity dashboard — stage/WIP/test metrics exist; per-operator touch-time metrics remain.
- [x] WIP ageing — dashboard/report derives age from receipt time for open assets.
- [~] processing throughput — current counts/pass rate exist; time-series throughput remains.
- [ ] customer portal — staff app remains private; customer-scoped portal RLS/UI still required.
- [~] Asset Vision — global search + device history provide the staff-side foundation; customer portal view remains.
- [~] customer-scoped API tokens — secure hashed token table exists; issuance/API authentication endpoints remain.
- [~] webhooks — configuration model exists; signed delivery/retry worker remains.

## P3 — mature enterprise

### Integrity and verification

- [~] cryptographic certificate signing — SHA-256 tamper-evident snapshot hashes are shipped; asymmetric signing/HSM-backed keys remain.
- [x] public certificate verification endpoint — public verification token page exposes certificate code/type/status/hash and minimal asset summary only.
- [ ] remote sanitisation orchestration — deliberately not enabled until local-agent authentication, policy enforcement and safe execution boundaries exist.
- [ ] enterprise SSO.
- [ ] advanced retention policy.

### Multi-site / governance / scale

- [ ] multi-site warehouses.
- [ ] cross-site transfers.
- [ ] approval matrix.
- [ ] automated client-specific report packs.
- [x] sustainability methodology/version registry — versioned methodology records prevent undocumented calculations.
- [ ] reusable workflow/template marketplace.
- [ ] high-volume batch station management.
- [ ] advanced employee productivity metrics.
- [ ] destruction/shred/bale capacity thresholds.
- [ ] mobile warehouse app / offline mode.

## Current implementation map

The live application is in EwasteApp/.

Key routes:
- /dashboard — operational queues
- /search — global lookup / scanner entry
- /jobs — inbound jobs
- /lots — bulk material
- /assets and /assets/[id] — serialized asset, evidence, attributes, media, tests, grade, repair, parts, disposition
- /media — sanitisation queue/policies/evidence
- /processing — processing queues, workflow rules and workstation profiles
- /repairs — repair/parts inventory
- /resale — qualification, listings and sales
- /recycling — pallets, downstream vendors and outbound
- /exceptions — central exception queue
- /certificates — certificate register
- /reports — operational/environmental metrics and methodology registry
- /verify/[token] — public certificate verification

Database migrations:
- 004_assetflow_p0.sql — customer/job/lot/location/test/disposition/certificate spine
- 005_assetflow_p0_p1_core_entities.sql — evidence, media, sanitisation, grade, exceptions, repair/parts, pallets, downstream/outbound, workflow/workstation, resale/settlement
- 006_assetflow_certificate_verification_and_integrations.sql — extended certificates, public verification, sustainability methodology registry, API-token/webhook configuration

## Next build order

The highest-value remaining work is:

1. Native nwipe/ShredOS + smartmontools parsers.
2. Merge/consolidation UI and outbound content loading on top of the shipped split/mass-balance engine.
3. Automatic rule execution policies and conflict/override approval on top of the shipped deterministic evaluator.
4. Local processing agent for hardware discovery, printers/scales and tool report ingestion.
5. Repair approval thresholds and actual-vs-estimate economics on top of shipped defect/devaluation templates.
6. Settlement approval/finalisation and accounting export on top of the shipped calculator.
7. eBay adapter once Production Buy/Sell API credentials and approvals are available.
8. Customer portal with customer-scoped RLS, then token-authenticated API/webhooks.
9. Asymmetric certificate signing/key management.
10. Multi-site/offline/high-volume enterprise features.

## Explicit non-goals

Do not build from scratch:
- secure-erasure algorithms
- cryptographic primitives
- drive firmware commands
- SSD controller internals
- hardware diagnostic algorithms already provided by mature open-source tools

AssetFlow owns orchestration, evidence, routing, traceability and reporting. Specialist tools do the destructive/security-sensitive work; AssetFlow records and verifies what they did.
