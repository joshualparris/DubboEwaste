# Codex TODO — Dubbo E-Waste closure plan

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **Backlog clarification (9 October 2026):** This is a dated E-waste Phase 0 closure list, **not** a single master backlog for the newer Repair Café/LMS/Library of Things product. The [live feature register](docs/LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md), [Repair Café product roadmap](docs/REPAIR-CAFE-PRODUCT-COMPARISON-IMPLEMENTATION-ROADMAP-2026-10-09.md) and [GitHub readiness issue #24](https://github.com/joshualparris/DubboEwaste/issues/24) cover those systems. A checkmark for a research task never substitutes for a signed community/insurance/legal agreement.


**Created:** 2 October 2026  
**Repository:** `joshualparris/DubboEwaste`  
**Purpose:** convert the repository's research gaps into an executable closure plan. A checked item means the repository now contains the relevant document, template or deterministic check. It does not mean an external approval, course, partnership or real-world pilot has happened.

## Current decision

The research phase is broad enough for a tightly controlled, known-source Phase 0 experiment. It is not evidence that public intake, home-site operation, institutional volume, or any category outside the initial acceptance matrix is ready.

## Completed in this pass

- [x] Add this master TODO and distinguish repository work from external/pilot work.
- [x] Add a printable triage competency and assessment checklist.
- [x] Add a category/route acceptance matrix with explicit HOLD and REJECT gates.
- [x] Add a bench test sheet for laptops, phones/tablets, small PCs and other electronics.
- [x] Add a listing/warranty/return checklist tied to the existing templates.
- [x] Add a glossary for ITAD, locks, sanitisation and stewardship terms.
- [x] Add a rejection-log operating guide and connect it to the pilot tracker.
- [x] Add a deterministic pilot-tracker schema validator and run it against the blank CSV schema.
- [x] Add the gap indexes to the README.
- [x] Add the Fair Trading wipe/hold follow-up to the call script.
- [x] Add the current external closure pack below to the repository index.

## P0 — must close before public or institutional intake

- [ ] **UN-20261024-002-0031** **Council:** obtain written planning/use classification for the exact premises, storage, traffic, online sales, testing and waste activity. Owner: operator + Dubbo Regional Council.
- [ ] **UN-20261024-002-0032** **Fair Trading:** obtain written interpretation of recycling exemption, donated/free devices, prescribed electronics, 14-day hold, alteration, wiping and premises notification. Owner: operator + NSW Fair Trading.
- [ ] **UN-20261024-002-0033** **Insurance:** obtain written quote/exclusions for customer devices in custody, repair, resale, batteries, fire, data/privacy, visitors, collection/delivery and product liability. Owner: operator + broker/insurer.
- [ ] **UN-20261024-002-0034** **Premises:** prove the shed is dry, secure, ventilated, electrically safe, separated from living areas and within the storage cap. Owner: operator.
- [ ] **UN-20261024-002-0035** **Battery:** complete site-specific quarantine, damaged-battery response and evacuation/000 drill with insurer/WHS/fire guidance. Owner: operator.
- [ ] **UN-20261024-002-0036** **Downstream:** obtain written AMR/alternative acceptance, lithium, CRT, commercial-load, fee, weight-ticket, certificate and rejected-load terms. Owner: operator + receiver.
- [ ] **UN-20261024-002-0037** **Data:** test and document a safe route for HDD, SATA SSD, NVMe, eMMC, Apple/Android devices and failed wipes before taking customer data.

## P1 — prove the operating model

- [ ] **UN-20261024-002-0041** Build and time the USB diagnostic/sanitisation kit on three representative machines.
- [ ] **UN-20261024-002-0042** Run the competency checklist and record pass/fail evidence for each device class.
- [ ] **UN-20261024-002-0043** Use the rejection log for every enquiry, including declined offers.
- [ ] **UN-20261024-002-0044** Pre-register a 20–30-item known-authority pilot with stop rules.
- [ ] **UN-20261024-002-0045** Measure triage, repair, sanitisation, listing, packing, return and downstream labour.
- [ ] **UN-20261024-002-0046** Track sold prices, days in stock, returns, disposal cost and gross contribution per labour hour.
- [ ] **UN-20261024-002-0047** Interview FlipTech or a comparable operator about thresholds, residue, staffing and regional partnership terms.
- [ ] **UN-20261024-002-0048** Interview Dubbo MSPs, Catholic/independent schools, local repairers and potential social-reuse partners.
- [ ] **UN-20261024-002-0049** Obtain current RTO/course quotes and complete the practical learning syllabus.
- [ ] **UN-20261024-002-0050** Test tracker export, backup, restore, redaction and retention with synthetic data.
- [ ] **UN-20261024-002-0051** Confirm a named recipient pathway before accepting donation-targeted stock.

## P2 — expand only after the pilot passes

- [ ] **UN-20261024-002-0055** Add TVs, consoles, printers, monitors, board-level repair, batteries or mixed loads only with separate safety/economic/route evidence.
- [ ] **UN-20261024-002-0056** Compare wholesale buyers and parts/scrap routes using actual quotes and sell-through.
- [ ] **UN-20261024-002-0057** Formalise warranty, recall, repair-notice and consumer-remedy workflows.
- [ ] **UN-20261024-002-0058** Define impact accounting only after mass, reuse and final-route evidence is available.
- [ ] **UN-20261024-002-0059** Consider a regional ITAD partnership or branch only after pilot economics and written partner terms support it.

## External closure pack

The ready-to-use scripts and evidence fields are in:

- [`docs/CALL-SCRIPTS.md`](docs/CALL-SCRIPTS.md)
- [`docs/EMAIL-DRAFTS.md`](docs/EMAIL-DRAFTS.md)
- [`docs/RESEARCH-16-CLOSURE-EVIDENCE-REGISTER.md`](docs/RESEARCH-16-CLOSURE-EVIDENCE-REGISTER.md)
- [`docs/INTAKE-POLICY.md`](docs/INTAKE-POLICY.md)
- [`docs/triage-matrix.csv`](docs/triage-matrix.csv)
- [`docs/bench-test-sheet.md`](docs/bench-test-sheet.md)
- [`docs/TRIAGE-COMPETENCY-CHECKLIST.md`](docs/TRIAGE-COMPETENCY-CHECKLIST.md)
- [`docs/LISTING-WARRANTY-CHECKLIST.md`](docs/LISTING-WARRANTY-CHECKLIST.md)
- [`docs/GLOSSARY.md`](docs/GLOSSARY.md)
- [`templates/triage-reject-log.csv`](templates/triage-reject-log.csv)
- [`pilot-tracker.csv`](pilot-tracker.csv)

## Stop rule

Do not open general public intake, accept unknown commercial mixed loads, handle damaged lithium batteries, or make claims of certification/partnership/downstream destination until the applicable P0 evidence is written and current.

## AI-agent work package

This section captures the wider set of useful work an AI coding/research agent can do. The checked items are repository deliverables; unchecked items require external access, real equipment, or operator judgment.

### A. Operating system and intake desk

- [x] Add `DubboEwasteApp/`, a responsive interactive MVP for staff login boundary, triage, inventory, model lookup and economics.
- [x] Add the production security/database handoff so the MVP is not mistaken for secure private storage.
- [x] Document the AI-agent operating model, permissions, evidence boundaries and hand-off rules.
- [x] Add a deterministic intake decision tool that emits ACCEPT, HOLD or REJECT with reasons and required evidence.
- [x] Add a pilot-analysis tool for time, margin, sell-through, rejection and route metrics.
- [x] Add a public-safety/redaction checker for reports and exports.
- [x] Add synthetic examples so the tools can be exercised without personal data or real device identifiers.
- [x] Convert the intake tool into the production browser app with guided triage, QR asset IDs and private evidence/photo attachments.
- [x] Replace the MVP demo login/local storage model with Supabase Auth, server-side/RLS permissions, private Storage evidence, audit logging and the production database.
- [ ] **UN-20261024-002-0096** Test a physical diagnostic/sanitisation USB kit on representative equipment.
- [ ] **UN-20261024-002-0097** Perform real backup/restore and retention testing with the operator's chosen storage system.

### B. Inventory, resale and technical workflows

- [x] Define the inventory fields needed for provenance, triage, sanitisation, labour, route and sale economics.
- [x] Add a repeatable unit-economics calculation specification.
- [x] Add listing, warranty, returns, recall and repair-notice workflow links.
- [x] Add category-specific triage and route rules.
- [ ] **UN-20261024-002-0105** Import actual sold-price observations from approved marketplace exports or manual research.
- [ ] **UN-20261024-002-0106** Validate repair and wipe scripts on real devices; never infer a wipe from a software exit code alone.
- [ ] **UN-20261024-002-0107** Establish real parts, wholesale and downstream quotes.

### C. Research and evidence production

- [x] Add an AI research workflow with claim-level citations and evidence labels.
- [x] Add a research backlog covering legal, safety, competitors, courses, resale, community and downstream questions.
- [x] Add source freshness and unresolved-claim review guidance.
- [ ] **UN-20261024-002-0114** Recheck time-sensitive sources and record new date-checked evidence.
- [ ] **UN-20261024-002-0115** Conduct operator, MSP, school, repairer, recycler and social-recipient interviews.
- [ ] **UN-20261024-002-0116** Obtain current course, insurance, premises, Council, Fair Trading and receiver quotes or written answers.

### D. Business development and communications

- [x] Maintain ready-to-review call scripts, email drafts, partner questions and capability-document structure.
- [x] Add a partner/recipient validation checklist and no-claim rules.
- [ ] **UN-20261024-002-0122** Send outreach through an approved account and record replies in the evidence register.
- [ ] **UN-20261024-002-0123** Prepare grant, sponsorship, collection and community-impact applications using verified figures only.

### E. Safety, privacy and governance

- [x] Keep raw personal data, device identifiers and private session outputs out of the public repository.
- [x] Define safe handling boundaries for batteries, data-bearing devices, ownership and downstream claims.
- [x] Add deterministic validation to CI for evidence and pilot schemas.
- [ ] **UN-20261024-002-0130** Complete site-specific battery, fire, electrical, insurance, privacy and incident drills.
- [ ] **UN-20261024-002-0131** Obtain qualified advice where legal, accounting, electrical, battery or WHS decisions are material.

### AI completion boundary

Codex can create documents, schemas, checklists, validators, calculations, synthetic tests, research drafts and reviewable communications. It cannot honestly complete a physical inspection, regulatory approval, insurance placement, external interview, real sale, device wipe, downstream handoff or safety drill without the operator and the relevant external party. Those remain explicitly gated above.
