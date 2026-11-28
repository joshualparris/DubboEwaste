# DubboEwaste master gap research prompt — v2 (every open question)

**28 November 2026 AEDT.** Results of executing this prompt: [MASTER-GAP-RESEARCH-V2-RESULTS-2026-11-28.md](MASTER-GAP-RESEARCH-V2-RESULTS-2026-11-28.md).

This prompt builds on, and does not replace, the same-day [120-question master gap prompt](MASTER-GAP-RESEARCH-PROMPT-2026-11-28.md) and its [results](MASTER-GAP-RESEARCH-RESULTS-2026-11-28.md). Those were drafted from a reviewed subset of documents. This version starts from a **machine sweep of every research file** so no recorded gap is missed, then consolidates the gaps into one question set with a closure mode for each.

## 1. What was read

| Source | Coverage |
| --- | --- |
| DubboEwaste (public) | Every Markdown, CSV, text and YAML research file outside app code, archived app folders and generated reports: **1,444 open-gap lines** across 253 files |
| CircularEconomyDubbo (public) | Research folder (mostly mirrors DubboEwaste; duplicates removed): 1 unique line |
| ResearchAtlas (private) | `docs/internal-research` and `docs/research`: 10 e-waste-relevant lines (counted, not republished) |
| ResearchLibrary (private) | README index: 3 lines (counted, not republished) |
| Registers re-read in full | [CURRENT-STATE](CURRENT-STATE.md), [Phase 0 gates](PHASE-0-LAUNCH-GATES.md), [68 remaining online questions](../claudeDOCS/00-REMAINING-ONLINE-QUESTIONS.md), [31-question register](DEEP-RESEARCH-2026-10-06-GENUINE-GAPS/31-QUESTION-REGISTER.csv), the 120-question register, and both 28 November EcoCycle reports |

A line counts as an open gap if it says something is open, unknown, unverified, unresolved, not found, not established, pending, blocked, on hold, or still needs confirming. Exact duplicates were removed (1,550 raw → 1,458). Every line is mapped to one or more work packages in [mined-gap-lines.csv](../data/master-gap-v2-2026-11-28/mined-gap-lines.csv); per-package counts are in [wp-coverage.csv](../data/master-gap-v2-2026-11-28/wp-coverage.csv). About 250 lines are headings or navigation text with no question in them.

## 2. Rules for whoever runs this

1. **Close by evidence, not by assertion.** Each answer needs a dated source; label it Answered, Partial, Not found, Unresolved or Open.
2. **Respect closure modes.** *Desk* questions can be answered from public sources now. *Contact* questions need a written answer, quote or record from a named organisation — desk research can only prepare the ask. *Pilot* questions need measurement on real devices or events. *Decision* questions belong to the owner.
3. **Don't contact anyone or send anything** without the owner's approval. Drafts only.
4. **Keep private material private.** No addresses, personal names from private correspondence, quotes or emails in the public repos.
5. **Correct, don't overwrite.** Where a finding makes an older statement wrong, add a dated correction note next to it.
6. **Coverage check.** After answering, walk the mined gap lines: each must map to a question here or in the 120-question register, or be marked closed, historical or out of scope (non-electronics circular-economy topics belong to CircularEconomyDubbo).

## 3. The questions

Each row lists the older IDs it also closes: A01–L10 from the 120-question register, O1–O68 from the remaining-online list, and Q-numbers from the EcoCycle research. Every A01–L10 question not listed here stays in scope through the 120-question register.

### WP01 — Premises, planning and property

| ID | Mode | Question | Also closes |
| --- | --- | --- | --- |
| WP01-01 | Desk | Can a home business or home industry run as exempt development in NSW, and on what conditions? | A02; O60 |
| WP01-02 | Desk | What floor-area limit does Dubbo Regional LEP 2022 clause 5.4 set for home businesses and home industries, and has it been amended? | A02 |
| WP01-03 | Desk | Do 'goods repair and reuse premises' or 'waste or resource management facility' definitions capture device refurbishment or dismantling at home? | A04 |
| WP01-04 | Contact | Will Council confirm in writing that the actual activity (appointment-only, capped storage, online sales, no public drop-off) is an exempt home business at the actual site? | A01; A03; A10; CURRENT-STATE gate 1 |
| WP01-05 | Contact | Does the lease or landlord allow a home business, storage and visitors? | A06 |
| WP01-06 | Contact | What re-classification is triggered if public drop-off, a sign or extra traffic is added later? | A09 |
| WP01-07 | Pilot | Is the shed dry, secure and within work-in-progress caps in practice? | A08 |
| WP01-08 | Decision | Home shed versus a small rented workspace versus a host venue for the first 12 months? | A07 |

### WP02 — Legal entity, second-hand dealing, tax and privacy

| ID | Mode | Question | Also closes |
| --- | --- | --- | --- |
| WP02-01 | Desk | What does the second-hand dealer law exempt for recycling programs, and which regulation is current? | B01; B03; O58 |
| WP02-02 | Desk | Can a licensed dealer wipe, test or repair goods during the retention period? | B04 |
| WP02-03 | Contact | Will Fair Trading confirm in writing whether the exemption applies, or whether a licence is needed? | B01; B05; CURRENT-STATE gate 3 |
| WP02-04 | Desk | Must second-hand electrical goods be tested, tagged or labelled before resale in NSW? | O21; G07 |
| WP02-05 | Desk | Can second-hand e-bikes, e-scooters and their batteries be resold in NSW? | new |
| WP02-06 | Desk | Does the Privacy Act's small business exemption still apply after the 2026 reform draft? | new |
| WP02-07 | Desk | What GST, Division 66 and trading-stock treatment applies to donated and harvested items? | B07 |
| WP02-08 | Decision | Which entity: Parris Tech Services sole trader, a separate business name, an incorporated association or a company limited by guarantee? | B07; new |
| WP02-09 | Contact | Which records software and ID checks will Fair Trading accept if licensing applies? | B05; B06 |

### WP03 — Insurance and liability

| ID | Mode | Question | Also closes |
| --- | --- | --- | --- |
| WP03-01 | Desk | What does public and products liability cover cost a micro-business in Australia? | O61 |
| WP03-02 | Contact | Will an insurer cover refurbishing and selling second-hand electronics with lithium batteries from a home shed, and what are the exclusions? | CURRENT-STATE gate 2 |
| WP03-03 | Contact | Does home and contents insurance exclude business stock and equipment at the site? | new |
| WP03-04 | Contact | Which insurance covers a Repair Café (host venue, organiser, volunteers' personal accident)? | J-series; REPAIR-CAFE insurance audit |
| WP03-05 | Decision | Is cyber or data-breach cover needed given the privacy exemption? | new |

### WP04 — Council, Whylandra and regional waste flow

| ID | Mode | Question | Also closes |
| --- | --- | --- | --- |
| WP04-01 | Desk | Has Council publicly awarded a successor e-waste contract after Matthews (30 June 2025)? | C01; O55 |
| WP04-02 | Contact | Who processes Whylandra's e-waste now, and what tonnes were collected FY2023–26? | C02; C04; C05 |
| WP04-03 | Desk | What is the status of the Whylandra embedded-battery trial? | C09 |
| WP04-04 | Desk | What is the NSW EPA proposing for regional waste infrastructure, and when do submissions close? | K01 |
| WP04-05 | Desk | What is happening with the Whylandra resource recovery park and reuse shop? | C06 |
| WP04-06 | Contact | Would Council consider any reuse arrangement later (declined 20 Oct 2026)? | HOLD |
| WP04-07 | Desk | What bulky-waste service applies to electronics in Dubbo? | new |

### WP05 — Downstream recyclers and stewardship schemes

| ID | Mode | Question | Also closes |
| --- | --- | --- | --- |
| WP05-01 | Desk | What is Sircel's current status (the repo's strongest regional downstream lead)? | O66; C08 |
| WP05-02 | Desk | Is there a free NTCRS drop-off in or near Dubbo besides Whylandra? | O57 |
| WP05-03 | Contact | What would EcoCycle charge to accept Dubbo eWaste's rejects and batteries, with what certificates? | EcoCycle Q06 |
| WP05-04 | Contact | Can Dubbo eWaste become a MobileMuster reuse or collection partner? | EcoCycle Q07 |
| WP05-05 | Contact | What downstream does AMR use, and will it share redacted receipts? | D01–D04 |
| WP05-06 | Contact | Can Dubbo eWaste register as a B-cycle / Batteries 4 Planet Ark collection point for its own battery outflow? | new |
| WP05-07 | Desk | Which certified recyclers accept small-business e-waste from regional NSW, at what published fees? | DOWNSTREAM cost comparison |

### WP06 — Supply, institutional disposal and procurement

| ID | Mode | Question | Also closes |
| --- | --- | --- | --- |
| WP06-01 | Desk | How do the NSW and National Device Banks work, and can Dubbo organisations take part? | E09; J07; J08; O63 |
| WP06-02 | Desk | Who is the NSW Education e-waste vendor for Western NSW? | E01; O67 |
| WP06-03 | Contact | How many devices do Dubbo schools, TAFE, health, Council and major SMEs retire a year, and where do they go? | E02–E06; I01 |
| WP06-04 | Contact | Which named donor will give a 20–30 device known-authority batch first? | E10; FIRST-30-DEVICE-EXPERIMENT |
| WP06-05 | Desk | What is Dubbo Regional LGA's population for sizing? | I01 |
| WP06-06 | Desk | Do ex-government auction lots state Autopilot/Intune release, and what freight to Dubbo costs? | O45; O46 |

### WP07 — Data sanitisation, operating systems, locks and ownership

| ID | Mode | Question | Also closes |
| --- | --- | --- | --- |
| WP07-01 | Desk | When do Windows 10 security updates end for donated home PCs? | H07 |
| WP07-02 | Pilot | Which erase method and tool works per media type on real donor devices (HDD, SATA SSD, NVMe, eMMC)? | F02; F03 |
| WP07-03 | Contact | Can owners remove Activation Lock, FRP, Autopilot and MDM through official channels for donated devices? | F06 |
| WP07-04 | Contact | Is a paid Blancco licence available for Dubbo eWaste's own entity and site? | AMR results A09 |
| WP07-05 | Decision | What evidence pack goes to donors (certificate fields, serial capture)? | F04 |

### WP08 — Battery, electrical safety and WHS

| ID | Mode | Question | Also closes |
| --- | --- | --- | --- |
| WP08-01 | Desk | Does NSW's new battery stewardship regulation affect Dubbo eWaste? | G05; K05 |
| WP08-02 | Desk | Does repairing plug-in devices need an electrical licence in NSW? | G06 |
| WP08-03 | Desk | What must a workplace do about lithium-ion incidents in NSW? | G01–G03 |
| WP08-04 | Pilot | Site risk assessment for the actual shed (storage, charging, damaged-battery quarantine), with sign-off. | G04; G08 |
| WP08-05 | Desk | Current lithium shipping rules for Australia Post and couriers, including damaged batteries. | O44 |

### WP09 — Triage, repair, testing, parts and skills

| ID | Mode | Question | Also closes |
| --- | --- | --- | --- |
| WP09-01 | Desk | Which fee-free courses suit the operator in 2027? | H08; O22 |
| WP09-02 | Pilot | Timed repairs and pass/fail rates per device category on 20–30 devices. | H01–H05 |
| WP09-03 | Desk | ChromeOS Flex certified models and Linux options for Windows 11-ineligible donations. | H07 |
| WP09-04 | Desk | Android and Chromebook update end dates for common donated models. | O04; O05 |

### WP10 — Market, pricing, economics and capacity

| ID | Mode | Question | Also closes |
| --- | --- | --- | --- |
| WP10-01 | Pilot | Sold prices, sale-through and returns on the first 20–30 devices. | I02–I06; O11 |
| WP10-02 | Desk | Current marketplace fees (Facebook Marketplace, eBay, Gumtree) for small sellers. | O17 |
| WP10-03 | Decision | Donation-only, sale-only or hybrid model for the pilot? | I07 |

### WP11 — Repair Café, digital inclusion and community

| ID | Mode | Question | Also closes |
| --- | --- | --- | --- |
| WP11-01 | Desk | Is there an active Repair Café in Dubbo or Orana? | J01 |
| WP11-02 | Contact | Which Dubbo charity would receive refurbished devices and join the NSW Device Bank EOI? | J07; J08 |
| WP11-03 | Contact | Host venue, insurance and volunteer roster for a first Repair Café session. | J02–J05 |
| WP11-04 | Pilot | Measured attendance, item mix and fix rate over three sessions. | J06 |

### WP12 — Policy, funding, circular economy and impact

| ID | Mode | Question | Also closes |
| --- | --- | --- | --- |
| WP12-01 | Desk | Are there open grants that fit right now? | K02; J09; O62 |
| WP12-02 | Desk | Will national reform add reuse targets for computers soon? | K04; K05 |
| WP12-03 | Contact | Lodge a submission to EPA WCIP Chapter 2 by 30 November? | K01 |
| WP12-04 | Pilot | Avoided-emissions method once real reuse data exists. | K07; K08 |

### WP13 — Governance, records, software and research integrity

| ID | Mode | Question | Also closes |
| --- | --- | --- | --- |
| WP13-01 | Desk | Which repo statements are now outdated? | L03 |
| WP13-02 | Decision | Keep private stakeholder records in ResearchAtlas and AssetFlow only. | L04 |

## 4. Deliverables

1. Results document with a short "what changed" section first.
2. Updated question register (CSV and JSON) with status, answer, sources and next action for every row.
3. `EVD-*` records in `data/evidence.yaml` for every answered desk question; validator must pass.
4. A field-closure pack: the Contact, Pilot and Decision questions in one table, with who to ask and which existing template to use.
5. Dated correction notes for anything now outdated.
6. Cross-links from ResearchAtlas, ResearchLibrary and CircularEconomyDubbo.
