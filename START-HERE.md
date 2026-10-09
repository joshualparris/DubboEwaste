# Start here

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **Reviewed 9 October 2026:** Start with the [verified product feature register](docs/LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md), then the [full documentation inventory](docs/DOCUMENTATION-INVENTORY-AND-FRESHNESS-2026-10-09.md). For Repair Café volunteers: [Event Desk](https://dubbo-ewaste-app.vercel.app/repair-cafe-volunteers/event-desk), [sessions](https://dubbo-ewaste-app.vercel.app/repair-cafe-volunteers/sessions), [station dispatch](https://dubbo-ewaste-app.vercel.app/repair-cafe-volunteers/stations), [knowledge](https://dubbo-ewaste-app.vercel.app/repair-cafe-volunteers/knowledge), [operations](https://dubbo-ewaste-app.vercel.app/repair-cafe-volunteers/operations) and [reports](https://dubbo-ewaste-app.vercel.app/repair-cafe-volunteers/reports). Those pages are private; mobile/offline and external notification delivery still require specific verification.


**Last reviewed:** 9 October 2026

This page is the quickest way into the DubboEwaste repository. It is a navigation layer, not an exhaustive list of the repository's files. The 9 October documentation catalogue indexes 318 tracked Markdown/text documents. For the full documentation map use [docs/README.md](docs/README.md) and [docs/RESEARCH-INDEX.md](docs/RESEARCH-INDEX.md).

## I want to know the current status

Read these first, in order:

1. [docs/CURRENT-STATE.md](docs/CURRENT-STATE.md) — canonical status and what is still blocked.
2. [docs/PHASE-0-LAUNCH-GATES.md](docs/PHASE-0-LAUNCH-GATES.md) — what must be closed before broader intake/resale.
3. [docs/RESEARCH-INDEX.md](docs/RESEARCH-INDEX.md) — current research authority map.
4. [codexToDO.md](codexToDO.md) — executable external/pilot closure backlog.

The repository currently supports a **research-ready, tightly gated pilot**, not unrestricted public intake. New desk research, sourcing leads and software features do not by themselves close Council, insurance, Fair Trading, premises, safety/data or downstream gates.

## I want to use or develop the operations app

Go to [EwasteApp/README.md](EwasteApp/README.md).

Production app: https://dubbo-ewaste-app.vercel.app/

Important folders:

- `EwasteApp/app/` — routes and server actions
- `EwasteApp/components/` — reusable UI
- `EwasteApp/lib/` — shared app/database helpers
- `EwasteApp/supabase/migrations/` — database history
- `EwasteApp/supabase/migrations/README.md` — migration order and caveats

Current application work includes intake/model lookup, camera barcode/QR scanning, device evidence/photos, label printing, processing configuration CRUD, sanitisation/diagnostics, repairs, resale/recycling, reporting, permissions and the device repair/schematic library.

### Deployment / CI

- GitHub Actions still typechecks and builds `EwasteApp`.
- Automatic Vercel Git deployment is intentionally disabled to avoid Hobby-plan build-rate-limit failures during bursts of research/docs commits.
- Production Vercel deployment is deliberate/manual via [.github/workflows/deploy-ewaste-app.yml](.github/workflows/deploy-ewaste-app.yml).
- [render.yaml](render.yaml) defines the Render backup service from `EwasteApp/`.
- `DubboEwasteApp/` is an older static prototype and is **not** the production Next.js app.
- The published `gh-pages` branch is a separate public gateway/admin experience.

## I want to close the remaining real-world unknowns

Use [docs/FIELD-VALIDATION-UNKNOWN-CLOSURE-SYSTEM.md](docs/FIELD-VALIDATION-UNKNOWN-CLOSURE-SYSTEM.md).

The private AssetFlow **Field Validation** screen records GIPA/informal responses, organisation disposal interviews, Repair Café demand, private commercial terms and measured per-device economics. It is deliberately separate from the public repository so private correspondence/quotes do not leak.

Key request/survey templates are in [templates/](templates/).

## I want the business / Phase 0 operating plan

Start with:

- [docs/PHASE-0-OPERATING-BLUEPRINT.md](docs/PHASE-0-OPERATING-BLUEPRINT.md)
- [docs/INTAKE-POLICY.md](docs/INTAKE-POLICY.md)
- [docs/FRONT-DOOR-TRIAGE-CARD.md](docs/FRONT-DOOR-TRIAGE-CARD.md)
- [docs/BENCH-SOP-AND-LAYOUT.md](docs/BENCH-SOP-AND-LAYOUT.md)
- [docs/DUBBOEWASTE-GRADING-STANDARD.md](docs/DUBBOEWASTE-GRADING-STANDARD.md)
- [docs/FIRST-30-DEVICE-EXPERIMENT.md](docs/FIRST-30-DEVICE-EXPERIMENT.md)
- [docs/FAMILY-CAPACITY-ITAD-REPAIR-CAFE.md](docs/FAMILY-CAPACITY-ITAD-REPAIR-CAFE.md)

The current capacity recommendation is a bounded pilot, not standing Tuesday/Saturday public intake.

## I want supply / device-sourcing research

Use:

- [docs/DUBBO-SME-DEVICE-SOURCING-DEEP-RESEARCH-2026-10-06.md](docs/DUBBO-SME-DEVICE-SOURCING-DEEP-RESEARCH-2026-10-06.md) — ranked local SME prospects and barriers.
- [data/dubbo-sme-device-sourcing-prospects-2026-10-06.csv](data/dubbo-sme-device-sourcing-prospects-2026-10-06.csv) — structured SME prospect register.
- [docs/DUBBO-NON-GOVERNMENT-SCHOOL-IT-ASSET-EWASTE-2026-10-06.md](docs/DUBBO-NON-GOVERNMENT-SCHOOL-IT-ASSET-EWASTE-2026-10-06.md) — Dubbo independent/Catholic school asset-retirement research.
- [data/dubbo-non-government-school-itad-prospects.csv](data/dubbo-non-government-school-itad-prospects.csv) — school prospect tracker.
- [docs/DUBBO-DEVICE-DISPOSAL-PROSPECTS.md](docs/DUBBO-DEVICE-DISPOSAL-PROSPECTS.md) — broader local disposal prospects.
- [docs/DEEP-RESEARCH-2026-10-05-SOURCING-PARTNERSHIPS-BUSINESS.md](docs/DEEP-RESEARCH-2026-10-05-SOURCING-PARTNERSHIPS-BUSINESS.md) — channel strategy and partnership research.

A prospect score or public fleet clue is **not evidence that devices are available**. Direct verification of ownership, incumbent disposal route and refresh timing is still required.

## I want repair, reuse or Repair Café research

Use:

- [docs/DUBBO-COMPUTER-REPAIR-REUSE-EWASTE-DIRECTORY-2026-10-06.md](docs/DUBBO-COMPUTER-REPAIR-REUSE-EWASTE-DIRECTORY-2026-10-06.md) — Dubbo/Central West repair, reuse and e-waste people/services.
- [docs/FAMILY-CAPACITY-ITAD-REPAIR-CAFE.md](docs/FAMILY-CAPACITY-ITAD-REPAIR-CAFE.md) — evidence-led family-capacity and cadence recommendation.
- [docs/DEVICE-SCHEMATICS-LIBRARY.md](docs/DEVICE-SCHEMATICS-LIBRARY.md) — exact-device service manuals, repair guides and board-schematic leads.
- [docs/DEEP-RESEARCH-2026-10-05-REFURB-SKILLS-REPAIR.md](docs/DEEP-RESEARCH-2026-10-05-REFURB-SKILLS-REPAIR.md) — refurb skills and repair economics.
- [docs/RESEARCH-07-REPAIR-ECONOMICS-PARTS-STRATEGY.md](docs/RESEARCH-07-REPAIR-ECONOMICS-PARTS-STRATEGY.md) — repair/parts strategy.

## I want legal / planning / compliance

Use:

- [docs/LEGAL-LICENSING.md](docs/LEGAL-LICENSING.md)
- [docs/COMPLIANCE-REGISTER.md](docs/COMPLIANCE-REGISTER.md)
- [docs/CALL-SCRIPTS.md](docs/CALL-SCRIPTS.md)
- [docs/EXTERNAL-CONFIRMATION-PACK.md](docs/EXTERNAL-CONFIRMATION-PACK.md)
- [docs/RESEARCH-16-CLOSURE-EVIDENCE-REGISTER.md](docs/RESEARCH-16-CLOSURE-EVIDENCE-REGISTER.md)
- [docs/FACT-CHECK-NOTEBOOKLM-ITAD-2026-10-06.md](docs/FACT-CHECK-NOTEBOOKLM-ITAD-2026-10-06.md)

Do not treat older legal research as a substitute for the current-state/launch-gate documents.

## I want Australian e-waste / ITAD market research

Start with:

- [docs/DUBBO-ITAD-DEEP-RESEARCH-2026.md](docs/DUBBO-ITAD-DEEP-RESEARCH-2026.md)
- [docs/AUSTRALIAN-EWASTE-ITAD-MAJOR-PLAYERS.md](docs/AUSTRALIAN-EWASTE-ITAD-MAJOR-PLAYERS.md)
- [docs/NATIONAL-ITAD-OPERATORS-DUBBO-COVERAGE.md](docs/NATIONAL-ITAD-OPERATORS-DUBBO-COVERAGE.md)
- [docs/RESEARCH-03-COMPETITOR-OPERATING-MECHANICS.md](docs/RESEARCH-03-COMPETITOR-OPERATING-MECHANICS.md)
- [docs/EXISTING-AUSTRALIAN-EWASTE-ORGS-DUBBO-EXPANSION.md](docs/EXISTING-AUSTRALIAN-EWASTE-ORGS-DUBBO-EXPANSION.md)
- [docs/DUBBO-ITAD-BRANCH-ENTRY-PLAYBOOK.md](docs/DUBBO-ITAD-BRANCH-ENTRY-PLAYBOOK.md)
- [docs/REGIONAL-ITAD-PRACTITIONER-FIELD-GUIDE.md](docs/REGIONAL-ITAD-PRACTITIONER-FIELD-GUIDE.md)

## I want Dubbo / Central West downstream research

Use:

- [docs/WHAT-HAPPENS-TO-EWASTE.md](docs/WHAT-HAPPENS-TO-EWASTE.md)
- [docs/AMR-DUBBO-DOWNSTREAM-FORENSIC.md](docs/AMR-DUBBO-DOWNSTREAM-FORENSIC.md)
- [docs/REGIONAL-EWASTE-PATHWAYS.md](docs/REGIONAL-EWASTE-PATHWAYS.md)
- [docs/SIRCEL-ITAD-REUSE-MODEL.md](docs/SIRCEL-ITAD-REUSE-MODEL.md)
- [docs/TECHCOLLECT-REUSE-DEEP-DIVE.md](docs/TECHCOLLECT-REUSE-DEEP-DIVE.md)

## I want reuse / donation / digital inclusion research

Use:

- [docs/GOOD360-COMPNOW-NATIONAL-DEVICE-BANK-DUBBO.md](docs/GOOD360-COMPNOW-NATIONAL-DEVICE-BANK-DUBBO.md)
- [docs/REUSE-MODELS-PONYUP-RECONNECT-LAPTOP-INITIATIVE.md](docs/REUSE-MODELS-PONYUP-RECONNECT-LAPTOP-INITIATIVE.md)
- [docs/DUBBO-WELLINGTON-NARROMINE-TRANGIE-REUSE-PROGRAMS.md](docs/DUBBO-WELLINGTON-NARROMINE-TRANGIE-REUSE-PROGRAMS.md)
- [docs/NSW-EDUCATION-EWASTE-DUBBO-LAPTOPS.md](docs/NSW-EDUCATION-EWASTE-DUBBO-LAPTOPS.md)

## I want device lookup / AssetFlow software research

Use:

- [docs/ASSETFLOW-DEVICE-DATA-SOURCES.md](docs/ASSETFLOW-DEVICE-DATA-SOURCES.md) — current lookup sources and ranking rules.
- [OpenSourceSoftware/README.md](OpenSourceSoftware/README.md) — AssetFlow product specification/backlog.
- [ITAD-Feature-Benchmark/README.md](ITAD-Feature-Benchmark/README.md) — 25-product ITAD software benchmark and requirements.

## I want the 31 genuine-gap deep-research pack

Use [docs/DEEP-RESEARCH-2026-10-06-GENUINE-GAPS/00-INDEX-31-QUESTIONS.md](docs/DEEP-RESEARCH-2026-10-06-GENUINE-GAPS/00-INDEX-31-QUESTIONS.md).

This 6 October 2026 pack was created only after checking the current repository for duplication. It answers 31 previously under-researched online questions across:

- Dubbo computer/repair market sizing;
- NSW procurement entry for regional SMEs;
- second-hand GST/trading-stock/accounting issues;
- secure IT-asset transport and chain of custody;
- cybersecurity and AssetFlow controls;
- battery/charger/parts compliance;
- product-recall screening;
- Australian repair-parts supply;
- Repair Café governance and commercial separation;
- environmental impact / green claims; and
- the current Australian electronics right-to-repair position.

Use the [31-question closure register](docs/DEEP-RESEARCH-2026-10-06-GENUINE-GAPS/31-QUESTION-REGISTER.csv) to see which questions were researched online, which remain scenario estimates, and what still requires real-world closure.

## I want the NotebookLM research pack

Open [notebooklm/2026-10-06-100-pdf-pack/README.md](notebooklm/2026-10-06-100-pdf-pack/README.md).

The corrected pack contains exactly **100 PDFs**: 1 master index, 44 full repository documents and 55 original publisher PDFs. The ZIP is:

[notebooklm/2026-10-06-100-pdf-pack/DubboEwaste-NotebookLM-100-PDF-Pack.zip](notebooklm/2026-10-06-100-pdf-pack/DubboEwaste-NotebookLM-100-PDF-Pack.zip)

Use [manifest.json](notebooklm/2026-10-06-100-pdf-pack/manifest.json) for source URLs, page counts and SHA-256 hashes.

## I want templates / forms

Go straight to [templates/](templates/).

Useful starting points:

- [templates/asset-transfer-and-chain-of-custody.md](templates/asset-transfer-and-chain-of-custody.md)
- [templates/data-sanitisation-certificate.md](templates/data-sanitisation-certificate.md)
- [templates/partner-validation-record.md](templates/partner-validation-record.md)
- [templates/sale-and-recall-record.md](templates/sale-and-recall-record.md)

## I want structured data / pilot files

Use [data/](data/) and [pilot-tracker.csv](pilot-tracker.csv).

## I want the full research catalogue

Open **[docs/README.md](docs/README.md)** and then **[docs/RESEARCH-INDEX.md](docs/RESEARCH-INDEX.md)**.

## I found an old GAPS / BACKLOG / agent document

That material is intentionally retained for provenance. Do not assume it is current.

Historical/provenance material includes:

- [GAPS.md](GAPS.md)
- [chatgptTODO.md](chatgptTODO.md)
- [docs/agyGAPS.md](docs/agyGAPS.md)
- [docs/claudeGAPS.md](docs/claudeGAPS.md)
- [docs/codexGAPS.md](docs/codexGAPS.md)
- [agyDOCS/](agyDOCS/)
- [claudeDOCS/](claudeDOCS/)
- [docs/claudegaps-research/](docs/claudegaps-research/)
- older `BACKLOG-*` files

See [docs/archive/README.md](docs/archive/README.md) for the archive policy.
