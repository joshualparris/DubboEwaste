# DubboEwaste

Research, operating design and software for a reuse-first e-waste / IT asset disposition pilot in Dubbo, NSW.

> **Reuse first. Recycle second.**

## Start here

If you are new to the repository, open **[START-HERE.md](START-HERE.md)**.

The three current authority documents are:

1. **[Current state](docs/CURRENT-STATE.md)** — what is verified, designed, blocked or still unknown.
2. **[Phase 0 launch gates](docs/PHASE-0-LAUNCH-GATES.md)** — what must be closed before broader intake.
3. **[Research index](docs/RESEARCH-INDEX.md)** — where detailed evidence and historical research lives.

For the complete documentation map, use **[docs/README.md](docs/README.md)**.

## Device-recovery research

- [National ITAD comparison](docs/NATIONAL-ITAD-OPERATORS-DUBBO-COVERAGE.md) — Greenbox, EraseIT, SLS and Renew IT: size, retired-device routes and advertised Dubbo coverage.
- [Dubbo independent operators](docs/DUBBO-INDEPENDENT-DEVICE-RECOVERY-OPERATORS.md) — publicly named businesses, recycling/refurbishment offers and unresolved backyard identities, with a [lead tracker](docs/dubbo-independent-device-recovery-leads.csv).
- [Dubbo disposal prospects](docs/DUBBO-DEVICE-DISPOSAL-PROSPECTS.md) — retired-device arrangements and open questions for 14 local prospects.
- [Dubbo non-government school ITAD research](docs/DUBBO-NON-GOVERNMENT-SCHOOL-IT-ASSET-EWASTE-2026-10-06.md) — school-by-school device ownership clues, BYOD versus institutional fleets, CEDB governance, NSW not-for-profit disposal rules and the current direct-contact gaps, with a [prospect tracker](data/dubbo-non-government-school-itad-prospects.csv).
- [Family-capacity review: ITAD + Repair Café](docs/FAMILY-CAPACITY-ITAD-REPAIR-CAFE.md) — evidence-led scheduling recommendation: capped fortnightly ITAD plus a monthly Repair Café for an 8–12 week pilot, with family-protection and stop/reduce rules.
- [Repair Café venue research](docs/DUBBO-REPAIR-CAFE-VENUE-RESEARCH-2026-10-08.md) — ranked Dubbo venue options, constraints and inspection questions for a rotating pilot.
- [Repair Café website engagement benchmark](docs/REPAIR-CAFE-WEBSITE-ENGAGEMENT-BENCHMARK-2026-10-08.md) — engagement patterns from Silicon Valley, Toronto, Bendigo, Waverley, Belfast and Repair Café International.
- [Repair Café public website specification](docs/DUBBO-REPAIR-CAFE-PUBLIC-SITE-SPEC-2026-10-08.md) — public participation site, privacy, feedback form and internal review design.
- [Dubbo circular economy in practice](docs/DUBBO-CIRCULAR-ECONOMY-IN-PRACTICE-2026-10-08.md) — system-level audit of repair, reuse, refurbishment, salvage and recycling across electronics, appliances, furniture, tools, bikes, textiles, C&D, automotive and farm machinery, with a further-investigation block wherever public evidence stops.
- [Repair First Dubbo deep research](docs/REPAIR-FIRST-DUBBO-DEEP-RESEARCH.md) — evidence on price, convenience, trust, repair bonuses, Repair Cafés, right-to-repair and the interventions most likely to make repair the default before replacement in Dubbo.
- [Repair First Dubbo 2026 evidence update](docs/REPAIR-FIRST-DUBBO-2026-EVIDENCE-UPDATE.md) — **newest evidence**: Australian household/electronics repair barriers, current Austria/France repair subsidies, Dubbo repair capacity, 2026/27 funding and a ranked incentive stack.
- [Repair First Dubbo implementation plan](docs/REPAIR-FIRST-DUBBO-IMPLEMENTATION-PLAN.md) — full evidence-based system design for Repair Check, local repair network, Repair Café, incentives, funding and measurement.
- [Repair First Dubbo 12-week pilot playbook](docs/REPAIR-FIRST-DUBBO-PILOT-PLAYBOOK.md) — bounded baseline + instant-incentive pilot, repairer standards, additionality and evaluation.
- [Repair First Dubbo field kit](docs/REPAIR-FIRST-DUBBO-FIELD-KIT.md) — interview, participant intake, outcome and follow-up templates.
- [Repair First Dubbo 6-month pilot](docs/REPAIR-FIRST-DUBBO-PILOT.md) — practical test design: free diagnosis, capped repair rebate, repair-business network, monthly Repair Café, loan devices, donor parts and measurable outcomes.
- [Device schematics & repair library](docs/DEVICE-SCHEMATICS-LIBRARY.md) — DadLAN/home-tech inventory, purchase-derived device evidence, official service manuals, board-schematic leads and exact-model/PCB checks.
- [31 genuine-gap deep-research pack](docs/DEEP-RESEARCH-2026-10-06-GENUINE-GAPS/00-INDEX-31-QUESTIONS.md) — 31 previously under-researched questions covering market size, procurement, tax, secure transport, cyber, electrical/parts compliance, recalls, Repair Café governance, environmental claims and right to repair; includes a structured closure register and source register.

## Field validation

- [Unknown-closure system](docs/FIELD-VALIDATION-UNKNOWN-CLOSURE-SYSTEM.md) — turns the ten remaining real-world unknowns into evidence requests, interviews, surveys, quotes and pilot measurements.
- AssetFlow private route: **/validation** — stores responses and measured results behind staff auth/RLS.

## Software

### Production operations app

**[EwasteApp/](EwasteApp/)** is the current private AssetFlow application.

- Next.js
- Supabase Auth + PostgreSQL
- Row Level Security
- customers, jobs, lots and assets
- intake and model lookup
- evidence, testing, grading and sanitisation
- repairs, resale and recycling workflows
- certificates and reporting
- admin CRUD, roles and per-user permissions

Production: https://dubbo-ewaste-app.vercel.app/

### GitHub Pages

The published `gh-pages` branch contains the public gateway and GitHub Pages admin console.

The `main/DubboEwasteApp/` directory is an **older static prototype source** and should not be confused with the production Next.js application or the newer generated Pages admin console. See [DubboEwasteApp/README.md](DubboEwasteApp/README.md).

## Repository map

| Path | Purpose |
|---|---|
| [START-HERE.md](START-HERE.md) | Human-friendly front door |
| [docs/](docs/) | Research, policy, operational guidance and evidence |
| [EwasteApp/](EwasteApp/) | Production private operations application |
| [OpenSourceSoftware/](OpenSourceSoftware/) | AssetFlow product specification, workflow reconstruction and backlog |
| [templates/](templates/) | Operational forms and evidence templates |
| [data/](data/) | Structured research/pilot datasets |
| [scripts/](scripts/) | Validators, analysis and safety/link checks |
| [examples/](examples/) | Synthetic examples safe for testing |
| [agyDOCS/](agyDOCS/) | Historical agent research retained for provenance |
| [claudeDOCS/](claudeDOCS/) | Historical agent research retained for provenance |
| [DubboEwasteApp/](DubboEwasteApp/) | Older static prototype source; not the production app |
| [GAPS.md](GAPS.md) | Historical detailed gap register |
| [codexToDO.md](codexToDO.md) | Current external/pilot closure backlog |
| [chatgptTODO.md](chatgptTODO.md) | Completed ChatGPT execution log; historical |
| [README.md](README.md) | This summary |
| [docs/MASTER-FINDINGS-ALL-CHATS.md](docs/MASTER-FINDINGS-ALL-CHATS.md) | **Master synthesis from all project chats:** top 10 takeaways, Officeworks clarification, planning/legal, downstream, reuse/ITAD, Device Bank/Dubbo links, corrections and the five biggest unanswered questions |
| [docs/PODCASTS-CANONICAL.md](docs/PODCASTS-CANONICAL.md) | **Canonical deduplicated podcast list:** Australia/NSW first, then ITAD, repair economics and downstream circular-economy listening |
| [docs/SPOTIFY-PODCASTS.md](docs/SPOTIFY-PODCASTS.md) | **Curated Spotify listening list:** 20 episodes/shows covering ITAD, data sanitisation, reuse/refurbishment, repair economics, Good360/digital inclusion, circular jobs and downstream e-waste processing |
| [docs/PODCASTS-CONSOLIDATED.md](docs/PODCASTS-CONSOLIDATED.md) | Canonical navigation and listening order for the overlapping podcast research files |
| [docs/EXISTING-AUSTRALIAN-EWASTE-ORGS-DUBBO-EXPANSION.md](docs/EXISTING-AUSTRALIAN-EWASTE-ORGS-DUBBO-EXPANSION.md) | **Australian organisations that could expand into Dubbo:** WorkVentures, Ecoactiv, Ecycle, TechCollect, PonyUp, Renew IT, FlipTech, Device Bank, MobileMuster, SK Tes and Sircel, with realistic partnership models |
| [docs/DOWNSTREAM-PROVIDER-DUBBO-COST-COMPARISON.md](docs/DOWNSTREAM-PROVIDER-DUBBO-COST-COMPARISON.md) | **Current provider comparison:** Dubbo coverage, published fees, quote-only routes, social-reuse costs and the first-call sequence |
| [docs/NSW-EDUCATION-EWASTE-DUBBO-LAPTOPS.md](docs/NSW-EDUCATION-EWASTE-DUBBO-LAPTOPS.md) | **NSW public-school laptop deep dive:** EDConnect/eWaste PowerApp, vendor sanitisation, Settlement Reports, C9826 suppliers, Device Bank comparison and the missing Dubbo downstream chain |
| [GAPS.md](GAPS.md) | Full list of what is known, found, and still unknown |
| [codexToDO.md](codexToDO.md) | **Executable closure plan:** repository work, external gates, pilot work and stop rules |
| [DubboEwasteApp/](DubboEwasteApp/) | **Interactive MVP:** staff login boundary, triage, model lookup, inventory, economics and listing drafts |
| [docs/CURRENT-STATE.md](docs/CURRENT-STATE.md) | **Canonical current-state register:** verified, designed, externally blocked and pilot-only claims |
| [docs/PHASE-0-LAUNCH-GATES.md](docs/PHASE-0-LAUNCH-GATES.md) | **Canonical launch sequence:** what blocks intake, resale, the pilot, and later scale-up |
| [docs/RESEARCH-INDEX.md](docs/RESEARCH-INDEX.md) | **Canonical research index:** where each topic lives and which files are historical or superseded |
| [docs/agyGAPS.md](docs/agyGAPS.md) | Original broad gap list covering triage, learning, competitors and sales |
| [docs/claudeGAPS.md](docs/claudeGAPS.md) | Detailed gap register and research opportunities |
| [docs/claudegaps-research/00-INDEX.md](docs/claudegaps-research/00-INDEX.md) | Claude research index, evidence labels and remaining call/try/learn work |
| [docs/codexGAPS.md](docs/codexGAPS.md) | **Codex gap audit:** research opportunities, unanswered questions and prioritised closure backlog |
| [docs/RESEARCH-01-FRONT-DOOR-TRIAGE.md](docs/RESEARCH-01-FRONT-DOOR-TRIAGE.md) through [docs/RESEARCH-16-CLOSURE-EVIDENCE-REGISTER.md](docs/RESEARCH-16-CLOSURE-EVIDENCE-REGISTER.md) | **Systematic Codex research series:** triage, skills, competitor mechanics, resale, privacy, safety, repair, categories, inventory, partners, downstream, premises, finance, community, trust, pilot closure and evidence maturity |
| [docs/PROJECT-HISTORY-ALL-CHATS.md](docs/PROJECT-HISTORY-ALL-CHATS.md) | **Cross-chat project history:** Bendigo 2025 origin, 10 donated laptops, DadLAN reuse experience, Dubbo pivot, Joe/Elise lessons, decisions, corrections and unresolved real-world questions |
| [docs/SPOTIFY-PODCAST-LIST.md](docs/SPOTIFY-PODCAST-LIST.md) | **Curated Spotify listening guide:** ITAD, e-waste, repair, data sanitisation, social reuse, resale economics and Kristy creative-business podcasts |
| [docs/SPOTIFY-AUSTRALIA-NSW-EWASTE.md](docs/SPOTIFY-AUSTRALIA-NSW-EWASTE.md) | **Preferred local Spotify list:** Australia/NSW e-waste, Renew IT/UNSW, refurbishment, reuse, right-to-repair and Australian reselling |
| [docs/PODCASTS-AUSTRALIAN-ITAD-COMPANIES.md](docs/PODCASTS-AUSTRALIAN-ITAD-COMPANIES.md) | **Company/founder podcast appearances:** FlipTech, Renew IT, Reconnect, WorkVentures, WV Technologies, Total Green, Close the Loop and Sims Lifecycle |
| [docs/ALL-CHAT-RESEARCH-SYNTHESIS.md](docs/ALL-CHAT-RESEARCH-SYNTHESIS.md) | Extended cross-chat strategic synthesis covering Council/AMR, Officeworks, regional routes, Sircel, TechCollect, Good360/Device Banks, Education, Phase 0, legal and pilot strategy |
| [docs/BACKLOG-01-16-INDEX.md](docs/BACKLOG-01-16-INDEX.md) | **Research handoff for backlog items 1–16, with status and remaining confirmations** |
| [docs/BACKLOG-01-05-PLANNING-LEGAL.md](docs/BACKLOG-01-05-PLANNING-LEGAL.md) | Property planning, NSW waste law, second-hand dealer and scrap-metal research |
| [docs/BACKLOG-06-12-DOWNSTREAM-STEWARDSHIP.md](docs/BACKLOG-06-12-DOWNSTREAM-STEWARDSHIP.md) | AMR/Council downstream, NTCRS, MobileMuster and B-cycle research |
| [docs/BACKLOG-13-16-REGIONAL-SUPPLY.md](docs/BACKLOG-13-16-REGIONAL-SUPPLY.md) | Surrounding councils, NetWaste/Sircel, volumes and supply-source research |
| [docs/BACKLOG-17-32-INDEX.md](docs/BACKLOG-17-32-INDEX.md) | **Research handoff for backlog items 17–32: market, costs, tax, compliance, devices, data, safety, Bendigo/Kristy, grants, templates and pilot metrics** |
| [docs/BACKLOG-17-20-MARKET-COST-TAX.md](docs/BACKLOG-17-20-MARKET-COST-TAX.md) | Dubbo competitor map, resale channels, corrected costs and tax/accounting |
| [docs/BACKLOG-21-25-COMPLIANCE-DATA-SAFETY.md](docs/BACKLOG-21-25-COMPLIANCE-DATA-SAFETY.md) | ACL/product safety, Windows/device viability, NIST/ASD sanitisation, WHS/lithium and postage |
| [docs/BACKLOG-26-29-BENDIGO-KRISTY-GRANTS.md](docs/BACKLOG-26-29-BENDIGO-KRISTY-GRANTS.md) | Joe/Elise early history, Kristy creative pathway and current grant landscape |
| [docs/BACKLOG-30-32-OPERATIONS-CORRECTIONS.md](docs/BACKLOG-30-32-OPERATIONS-CORRECTIONS.md) | Operating paperwork, expanded pilot metrics and explicit correction register |
| [docs/PHASE-0-OPERATING-BLUEPRINT.md](docs/PHASE-0-OPERATING-BLUEPRINT.md) | **Detailed cheapest-start blueprint: Tue/Sat intake, acceptance gates, storage, wiping, resale, safety and downstream** |
| [docs/LEGAL-LICENSING.md](docs/LEGAL-LICENSING.md) | Second-hand dealer licence, council/planning, EPA, in detail |
| [docs/COSTS.md](docs/COSTS.md) | Start-up and running cost picture |
| [docs/INTAKE-POLICY.md](docs/INTAKE-POLICY.md) | What to accept/refuse, wipe standard, safety rules |
| [docs/CALL-SCRIPTS.md](docs/CALL-SCRIPTS.md) | Who to ring, in order, with exact questions |
| [docs/EMAIL-DRAFTS.md](docs/EMAIL-DRAFTS.md) | Ready-to-send emails for Fair Trading, Council, EPA, Joe, Australian Metal Recycling and Avance |
| [docs/SOURCES.md](docs/SOURCES.md) | Sources and confidence levels |
| [docs/bendigo-early-days-deep-dive.md](docs/bendigo-early-days-deep-dive.md) | Deep source-led reconstruction of Joe Parker / Bendigo E-Waste's startup path |
| [docs/KRISTY-CREATIVE-MICROBUSINESS.md](docs/KRISTY-CREATIVE-MICROBUSINESS.md) | Research-backed hobby → microbusiness path for Kristy's creative/art work, modelled on The Painted Brush & Co |
| [templates/ownership-and-wipe-certificate.md](templates/ownership-and-wipe-certificate.md) | Client transfer-of-ownership and data-wipe certificate template |
| [templates/asset-transfer-and-chain-of-custody.md](templates/asset-transfer-and-chain-of-custody.md) | Detailed asset authority, transfer basis and custody-state record |
| [templates/partner-validation-record.md](templates/partner-validation-record.md) | Public-safe record for validating receivers, buyers, courses and social-reuse partners |
| [templates/data-sanitisation-certificate.md](templates/data-sanitisation-certificate.md) | Per-media sanitisation method, tool/version, verification and PASS/FAIL/DESTROY record |
| [templates/repair-notice.md](templates/repair-notice.md) | Customer repair/data-loss notice scaffold with ACCC prescribed-wording checkpoint |
| [templates/sale-and-recall-record.md](templates/sale-and-recall-record.md) | Sale condition, serial/buyer link and later recall-contact record |
| [pilot-tracker.csv](pilot-tracker.csv) | **Expanded 64-field pilot tracker:** provenance, support/locks, grading, sanitisation, labour, economics, returns and downstream outcome |
| [pilot-tracker.csv](pilot-tracker.csv) | **Expanded pilot tracker:** provenance, triage, data, labour, selling costs, stock days and downstream outcome |
| [docs/triage-matrix.csv](docs/triage-matrix.csv) | Category acceptance, hold/reject and evidence matrix |
| [docs/bench-test-sheet.md](docs/bench-test-sheet.md) | Printable per-asset bench test and sanitisation sheet |
| [docs/TRIAGE-COMPETENCY-CHECKLIST.md](docs/TRIAGE-COMPETENCY-CHECKLIST.md) | Operator skills assessment and reassessment checklist |
| [docs/LISTING-WARRANTY-CHECKLIST.md](docs/LISTING-WARRANTY-CHECKLIST.md) | Listing, warranty, return and recall pre-publication checks |
| [docs/GLOSSARY.md](docs/GLOSSARY.md) | Plain-language ITAD, lock, sanitisation and stewardship terms |
| [docs/AI-AGENT-OPERATING-SYSTEM.md](docs/AI-AGENT-OPERATING-SYSTEM.md) | What an AI agent can automate, what requires human/external evidence, and the safe handoff loop |
| [docs/RESEARCH-AI-WORKFLOW.md](docs/RESEARCH-AI-WORKFLOW.md) | Claim-level research decomposition, source hierarchy and agent review protocol |
| [docs/UNIT-ECONOMICS.md](docs/UNIT-ECONOMICS.md) | Per-asset contribution and labour-hour calculation specification |
| [docs/research.md](docs/research.md) | Earlier feasibility research retained for additional context |
| [docs/launch-checklist.md](docs/launch-checklist.md) | Earlier lean-launch checklist retained for operational planning |
| [docs/MATTHEWS-INFRABUILD-AMR.md](docs/MATTHEWS-INFRABUILD-AMR.md) | Current research on the Dubbo Matthews/InfraBuild/AMR yard and e-waste outlet |
| [docs/REGIONAL-EWASTE-PATHWAYS.md](docs/REGIONAL-EWASTE-PATHWAYS.md) | What surrounding towns do with e-waste, current drop-off pathways, downstream evidence and reuse opportunities |
| [docs/WHAT-HAPPENS-TO-EWASTE.md](docs/WHAT-HAPPENS-TO-EWASTE.md) | **Deep downstream trace:** AMR, council routes, Parkes/Sircel, historical Sims/St Marys shredding, Coonamble/Matthews, device-to-material flows and NTCRS recovery data |
| [docs/SIRCEL-ITAD-REUSE-MODEL.md](docs/SIRCEL-ITAD-REUSE-MODEL.md) | **Core business-model deep dive:** Sircel triage, Blancco wiping, hardware testing, buy-back/reuse, FY24 reuse metrics and a small-scale Dubbo adaptation |
| [docs/SIRCEL-REUSE-PARTNERS-WHERE-DOES-IT-GO.md](docs/SIRCEL-REUSE-PARTNERS-WHERE-DOES-IT-GO.md) | **After handoff:** traces reuse partners into Good360, Compnow, National Device Bank/WorkVentures, charities, schools and end users; separates proven routes from unknown broker paths |
| [docs/GOOD360-COMPNOW-NATIONAL-DEVICE-BANK-DUBBO.md](docs/GOOD360-COMPNOW-NATIONAL-DEVICE-BANK-DUBBO.md) | **Dubbo social-reuse ecosystem:** Good360, Compnow refurbishment, National/NSW Device Banks, WorkVentures, Good Things and the strongest specific Dubbo partner leads |
| [docs/SPOTIFY-PODCASTS-AU-NSW-EWASTE-REUSE.md](docs/SPOTIFY-PODCASTS-AU-NSW-EWASTE-REUSE.md) | **Spotify listening list:** Australia/NSW-first episodes on e-waste, ITAD, reuse, refurbishment, resale, charitable redistribution and circular business models |
| [docs/FLIPTECH-EQUIVALENTS-DUBBO-BRANCH-FEASIBILITY.md](docs/FLIPTECH-EQUIVALENTS-DUBBO-BRANCH-FEASIBILITY.md) | **Regional expansion deep dive:** Fliptech plus Renew IT, G1, WorkVentures, Compnow/SustainIT, 9R, Reconnect, ITC, LinkBytes and others; tests whether a Dubbo branch/satellite is commercially plausible |
| [docs/AMR-DUBBO-DOWNSTREAM-FORENSIC.md](docs/AMR-DUBBO-DOWNSTREAM-FORENSIC.md) | **Forensic trace:** attempts to identify the exact company/facility receiving AMR Dubbo e-waste, with candidates and evidence limits |
| [docs/TECHCOLLECT-REUSE-DEEP-DIVE.md](docs/TECHCOLLECT-REUSE-DEEP-DIVE.md) | **Reuse deep dive:** TechCollect's no-second-hand-reuse policy, ANZRP's separate reuse partnerships, and implications for Dubbo eWaste |
| [docs/REUSE-MODELS-PONYUP-RECONNECT-LAPTOP-INITIATIVE.md](docs/REUSE-MODELS-PONYUP-RECONNECT-LAPTOP-INITIATIVE.md) | **Reuse-first benchmark:** PonyUp commercial ITAD/resale, Reconnect repair/refurbishment, and The Laptop Initiative direct charity redistribution |
| [docs/NSW-FLIPTECH-EQUIVALENTS-DEEP-DIVE.md](docs/NSW-FLIPTECH-EQUIVALENTS-DEEP-DIVE.md) | **NSW FlipTech equivalents deep dive:** FlipTech, Renew IT, ITC Asset Management, Reconnect, WorkVentures and LinkBytes — origins, ITAD/refurb flows, revenue models and what Dubbo can copy |
| [docs/WHY-COUNCIL-ELECTRONICS-REUSE-IS-HARD.md](docs/WHY-COUNCIL-ELECTRONICS-REUSE-IS-HARD.md) | **Barrier deep dive:** staffing, safety, data, batteries, dumping, retail liability, economics and regional scale |
| [docs/DUBBO-WELLINGTON-NARROMINE-TRANGIE-REUSE-PROGRAMS.md](docs/DUBBO-WELLINGTON-NARROMINE-TRANGIE-REUSE-PROGRAMS.md) | **Closest-town official programs:** e-waste collection versus actual reuse/resale in Dubbo, Wellington, Narromine and Trangie |
| [docs/PONYUP-SECONDBITE-DUBBO.md](docs/PONYUP-SECONDBITE-DUBBO.md) | **Dubbo connection deep dive:** PonyUp's profit-to-SecondBite model, Connecting Community Services' real Dubbo link, and what is/not an electronics pathway |
| [docs/SPOTIFY-PODCASTS-EWASTE-REUSE-ITAD.md](docs/SPOTIFY-PODCASTS-EWASTE-REUSE-ITAD.md) | **Curated Spotify listening list:** ranked episodes on e-waste, reuse, refurbishment, ITAD, data wiping, right-to-repair, reverse logistics, digital inclusion and Australian circular electronics |
| [docs/FLIPTECH-DUBBO-BRANCH-FEASIBILITY.md](docs/FLIPTECH-DUBBO-BRANCH-FEASIBILITY.md) | **Fliptech deep dive:** corporate ITAD/reuse model, data security, growth signals and feasibility of a Dubbo/Central West regional hub or partner operation |
| [docs/AUSTRALIAN-ITAD-STAFFING-DUBBO-BRANCH-SHORTLIST.md](docs/AUSTRALIAN-ITAD-STAFFING-DUBBO-BRANCH-SHORTLIST.md) | **Filtered branch shortlist:** Australian Fliptech-style ITAD companies by public staffing signal, physical network and evidence that a Dubbo regional hub/branch is worth pursuing |
| [docs/DUBBO-ITAD-BRANCH-PATHWAYS-COSTS-PROCESS.md](docs/DUBBO-ITAD-BRANCH-PATHWAYS-COSTS-PROCESS.md) | **How to actually establish a Dubbo ITAD presence:** ranked G1/Greenbox/Fliptech/WV/Renew/Shred-X/Iron Mountain pathways, public onboarding processes, current Dubbo premises costs, staffing floors and 90-day launch plan |
| [docs/DUBBO-ITAD-BRANCH-ENTRY-PLAYBOOK.md](docs/DUBBO-ITAD-BRANCH-ENTRY-PLAYBOOK.md) | **Branch/partner playbook:** ranks Greenbox, G1, Fliptech, WV, Iron Mountain, Renew IT and Shred-X by ease/cost/payoff, gives public onboarding processes and current Dubbo cost benchmarks |

## Current project status

The repository supports a **research-ready, tightly gated pilot**, not unrestricted public intake. Planning, insurance, premises, Fair Trading, safety/data validation and downstream evidence still contain external gates. Read [docs/CURRENT-STATE.md](docs/CURRENT-STATE.md) before treating any historical research as current operational authority.

## Evidence rule

Historical files are retained deliberately. A detailed or older file is not automatically current. When sources conflict:

1. use `docs/CURRENT-STATE.md` for current status;
2. use `docs/RESEARCH-INDEX.md` to find the current topic authority;
3. preserve older material as provenance rather than silently deleting it.

## Development checks

The repository has CI for:

- EwasteApp typecheck/build;
- evidence validation;
- pilot tracker validation;
- external link auditing.

See [.github/workflows/](.github/workflows/).

---

A snapshot of the former long-form root README is preserved at [docs/archive/README-SNAPSHOT-2026-10-02.md](docs/archive/README-SNAPSHOT-2026-10-02.md).

## ITAD software feature benchmark

[25-product benchmark and combined AssetFlow requirements](ITAD-Feature-Benchmark/README.md) — public-source feature profiles, prioritised acceptance criteria, integration boundaries and research gaps. These are product goals, not shipped-feature claims.

| [docs/REPAIR-FIRST-DUBBO-IMPLEMENTATION-PLAN.md](docs/REPAIR-FIRST-DUBBO-IMPLEMENTATION-PLAN.md) | **Repair First Dubbo:** evidence-based plan for free diagnosis, instant repair incentives, Repair Café, local repair network, funding, behaviour change and measurement |
