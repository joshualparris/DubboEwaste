# Research 16: Closure evidence register and next experiments

**Research date:** 2 October 2026 (AEST)

**Gap covered:** the closure evidence in `codexGAPS.md` sections 20–22 and the remaining unresolved P0/P1 actions across sections 2–19.

**Purpose:** distinguish what the repository has researched from what still requires an external answer, a real observation, a pilot dataset or a site-specific professional decision.

**Status:** this report is an audit of evidence maturity. It does not claim that any external approval, partnership, insurer decision, course enrolment, operator interview or commercial result has occurred.

## Executive decision

The documentary research is now broad enough to run a tightly controlled Phase 0 experiment, but it is not evidence that DubboEwaste is ready for public intake or institutional volume. The next work should prioritise **closure evidence**, not another general web search:

1. obtain written premises/planning/insurance boundaries;
2. test representative devices through the triage, lock and sanitisation paths;
3. run the synthetic tracker test and then a known-source pilot;
4. collect current provider/operator quotes and interviews;
5. measure actual labour, route outcomes and downstream receipts.

## 1. Evidence-status vocabulary

| Status | Meaning |
|---|---|
| `RESEARCHED` | current primary/public source or repository evidence explains the issue |
| `DESIGNED` | a checklist, schema, experiment or decision rule exists |
| `TESTED-SYNTHETIC` | the logic passed with fake data or a controlled local test |
| `CONFIRMED-EXTERNAL` | an authorised external person/entity gave current written evidence |
| `OBSERVED-PILOT` | real operational data exists under a declared pilot scope |
| `CLOSED` | the evidence supports a bounded decision and has an owner/review date |

Do not turn `RESEARCHED` or `DESIGNED` into `CONFIRMED-EXTERNAL` by repetition.

## 2. Closure matrix

Use [the expanded P0 gates](PHASE-0-LAUNCH-GATES.md) for operation-level criteria I01–I09 and item-level stop decisions. Fill a private copy of the [readiness/capacity record](../templates/phase-0-readiness-and-capacity-record.md) with the exact scope, evidence, shelf limits, routes and first-batch reservations. The template is designed; no external gate is closed by this expansion.

| Gap/closure item | Current state | Strong evidence still required | Next action |
|---|---|---|---|
| Council activity classification | `RESEARCHED`/`DESIGNED` | written response for exact premises, storage, testing, online sale and waste activity | send the Phase 0 description to Dubbo Regional Council planning |
| Lease/landlord/body corporate | `DESIGNED` | written permission or confirmed non-applicability | check documents before intake at home |
| Insurance | `DESIGNED` | insurer confirmation of stock, public liability, home workshop, batteries and e-waste | ask for written exclusions and limits |
| Fair Trading/ACL workflow | `RESEARCHED`/`DESIGNED` | reviewed listing, receipt, remedy and notice for second-hand goods | have the actual documents reviewed before sale |
| 60-second triage screen | `DESIGNED` | observed trials with representative offers and false-accept/false-reject review | run 20 simulated offers and revise |
| Category cut-offs | `RESEARCHED`/`DESIGNED` | sold-price, time, safety and route outcomes by category | collect 20+ comparable outcomes per priority lane |
| Bench SOP | `DESIGNED` | completed test sheets and repeatability across operators/items | test laptop, phone, tablet and one other category |
| Locks and sanitisation | `RESEARCHED`/`DESIGNED` | representative-device pass/fail records and failure route | build a test device set; never use private data |
| Battery incident response | `RESEARCHED`/`DESIGNED` | site-specific risk assessment and drill | consult insurer/WHS/fire authority before damaged-battery intake |
| Repair threshold | `RESEARCHED`/`DESIGNED` | actual labour, parts, failure and remedy dataset | log every repair attempt |
| Downstream routes | `RESEARCHED`/`DESIGNED` | written acceptance, fees, quantity, receipt and rejected-load rules | verify one route per material stream |
| FlipTech/comparable interview | `RESEARCHED` | non-confidential answers or site notes | request a bounded process interview |
| Course/RTO choice | `RESEARCHED` | current fees, availability, practical assessment and pathway fit | contact providers and record quotes |
| Study syllabus | `DESIGNED` | completed study log, notes and quizzes/practical checks | schedule the first 10-hour learning block |
| Inventory system | `DESIGNED`/`TESTED-SYNTHETIC` | export, restore, redaction and real pilot workflow | keep CSV for Phase 0; migrate only after measured pain |
| Supply/demand partners | `RESEARCHED`/`DESIGNED` | named contact, need/volume, authority and written pilot terms | run structured interviews and one controlled handoff |
| Community impact | `RESEARCHED`/`DESIGNED` | named recipient pathway and 30/90-day outcome | do not accept donation-targeted stock first |
| Marketing/trust | `RESEARCHED`/`DESIGNED` | actual listings, evidence and remedy observations | publish only claims backed by the claim register |
| First 20–30 items | `DESIGNED` | complete tracker, labour, route and safety results | pre-register scope and start with known-authority items |

## 3. Synthetic SQLite prototype: actual result

The repository’s Research 09 specified ten fake assets and validation queries. On 2 October 2026, an in-memory SQLite test was run with ten synthetic rows representing working, refused, failed-wipe, repaired, harvested, sold, returned, smart-device, printer and downstream cases.

Observed results:

```text
custody                         9
released_without_sanitisation  0
parts_linked                   1
downstream_receipts            2
safety_holds                   2
```

An additional local SQLite backup test created a synthetic database and backup, then returned:

```text
source count: 2
backup count: 2
source integrity: ok
backup integrity: ok
```

This proves only that the small test schema and backup command behaved as expected with fake data. It does not prove the existing CSV is migrated, that media attachments are backed up, or that production data is safe. No donor, buyer, serial, IMEI or other private data was used.

## 4. Available local tools

The current workstation has these useful open/free tools available:

| Tool | Availability | Phase 0 use |
|---|---|---|
| `sqlite3` | installed | synthetic relational tests and later local ledger |
| LibreOffice | installed | CSV review, protected formulas, export |
| `smartctl` | installed | drive health evidence where compatible |
| `nvme` | installed | NVMe health/identity checks where compatible |
| `inxi` | installed | hardware summary |
| `dmidecode` | installed | hardware identity where permissions permit |
| `fwupdmgr` | installed | firmware status where supported |
| `rg`, `git`, `gh` | installed | repository/source/search/publication workflow |
| `lshw` | unavailable | optional replacement, not a Phase 0 blocker |
| `ddrescue` | unavailable | do not add a recovery workflow until needed and safely installed |

The listed autonomous research-agent frameworks were not installed into the repository. They would add credentials, dependency, scraping and reproducibility overhead for the current closure work; primary-source browsing, local evidence files and small deterministic tests are currently the lower-risk research path. If one is later adopted, pin its version, record sources/prompts, keep private corpus data out of it and preserve claim-level citations.

## 5. Exact external-question pack

### Council/planning

> We propose a small, appointment-only operation at [address]: receiving pre-screened used computers/phones/electronics, recording ownership and data status, testing and cleaning devices, selling a limited number online, storing a capped quantity, and sending rejected material to confirmed downstream routes. We will not accept public drop-offs, damaged batteries, chemicals or unknown hazardous material during Phase 0. What planning, waste, fire, signage, traffic, premises or other approval/notification requirements apply to this exact activity?

Ask for the answer in writing and attach the floor-zone/capacity description.

### Insurer

> Please confirm in writing whether the policy covers stock belonging to us or in our custody, customer devices, testing/repair activity, online sales, collection/delivery, visitors, batteries, fire/smoke damage, data/privacy incidents, product liability and consumer remedies. Please list exclusions, sublimits, security conditions and any premises/business-use requirement.

Do not rely on a generic household policy summary.

### Downstream receiver

> Do you accept material from a small business/refurbisher, not only household residents? For [exact stream, condition and quantity], what are the fees, booking rules, packaging rules, excluded items, licence/transport requirements, and the receipt/certificate fields? What happens to rejected material?

### Operator interview

> We are researching a small regional electronics reuse operation. Could you answer non-confidential questions about front-door cut-offs, data/lock handling, minimum viable tests, repair versus parts decisions, downstream residuals, staffing and the first mistakes to avoid? We will not request customer data, prices under confidentiality or proprietary SOPs.

## 6. First controlled pilot specification

**Scope:** 20–30 known-authority items, prioritising laptops, phones/tablets and small PCs; no public drop-off; no damaged lithium batteries, chemicals or unknown commercial mixed loads.

**Pre-registered fields:** source authority, category, model, lock state, data state, safety state, initial route, every labour event, direct costs, final route, downstream evidence, acceptance decision and reason.

**Stop rules:** any uncontrolled battery/data/safety incident; storage cap breach; no safe route; repeated ownership ambiguity; or inability to meet the remedy/evidence requirement.

**Review points:** after items 5, 10, 20 and 30. At each point decide whether to repeat, redesign or stop each category separately.

**Success evidence:** complete records, safe handling, truthful listings, positive contribution/hour after all logged work, cleared stock within the cap and documented final outcome for every rejected item.

## 7. What is not closed

The following remain open by design and require external or real-world evidence:

- exact planning classification and premises suitability;
- insurance acceptance and exclusions;
- actual local commercial downstream terms;
- current operator/FlipTech process interview;
- current RTO/provider quotes and practical course fit;
- actual 20–30-item operating results;
- market demand and sale-through in the chosen categories;
- recipient need and 30/90-day social outcomes;
- production-grade backup/restore and media retention;
- any claim of certification, partnership, environmental benefit or commercial viability.

Until these are closed, the correct status is **research-ready and pilot-gated**, not “ready for general intake.”

## 8. Sources consulted

- [NSW Fair Trading: consumer guarantees](https://www.fairtrading.nsw.gov.au/trades-and-businesses/business-essentials/selling-goods-and-services/consumer-guarantees)
- [NSW Fair Trading: providing warranties](https://www.fairtrading.nsw.gov.au/trades-and-businesses/business-essentials/selling-goods-and-services/providing-warranties)
- [NSW Fair Trading: receipts](https://www.fairtrading.nsw.gov.au/trades-and-businesses/business-essentials/selling-goods-and-services/receipts)
- [NSW Fair Trading: selling online](https://www.fairtrading.nsw.gov.au/trades-and-businesses/business-essentials/selling-goods-and-services/selling-online)
- [ACCC Product Safety: sell safe products](https://www.productsafety.gov.au/business/know-how-to-sell-safe-products)
- [Research 09: inventory, software and information architecture](RESEARCH-09-INVENTORY-SYSTEM-OF-RECORD.md)
- [Research 12: premises, physical flow and capacity](RESEARCH-12-PREMISES-PHYSICAL-FLOW-CAPACITY.md)
- [Research 13: finance, time and unit economics](RESEARCH-13-FINANCE-TIME-UNIT-ECONOMICS.md)
- [Research 15: trust, marketing and pilot closure](RESEARCH-15-TRUST-MARKETING-PILOT-CLOSURE.md)

This is an evidence register and experiment plan, not planning, insurance, legal, tax, safety or professional advice.
