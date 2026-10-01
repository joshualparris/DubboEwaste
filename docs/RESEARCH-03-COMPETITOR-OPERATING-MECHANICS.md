# Research 03 — competitor operating mechanics

**Status:** public-evidence deep dive; internal thresholds remain unverified
**Research date:** 2 October 2026
**Scope:** understand how Australian ITAD, refurbishment, social-enterprise, and e-waste operators move equipment from receipt to data clearance, triage, repair, resale/donation, parts, and recycling.

This report follows [`RESEARCH-01-FRONT-DOOR-TRIAGE.md`](RESEARCH-01-FRONT-DOOR-TRIAGE.md) and [`RESEARCH-02-SKILLS-LEARNING-PATH.md`](RESEARCH-02-SKILLS-LEARNING-PATH.md). It researches mechanics rather than repeating company histories or assuming that a public service claim reveals the full internal workflow.

## Executive finding

The strongest common pattern across the public operator material is not a particular brand of software or a fixed CPU cut-off. It is a controlled sequence:

**scope the intake → collect securely → identify/manifest → isolate data-bearing assets → sanitise or destroy → assess/grade → repair/refurbish → test → route to resale/donation/parts/recycling → report the result**

The small Dubbo operation should copy the control points, not the scale:

- one asset ID from receipt to final route;
- a separate unwiped/restricted state;
- explicit lock and ownership clearance;
- a bounded triage decision;
- a repair/parts/recycling route hierarchy;
- evidence attached to each route;
- an honest exception path when sanitisation or reuse fails;
- stock ageing and storage limits;
- a final report that distinguishes reuse, donation, parts, material recovery, destruction, and unknown.

The public sources do **not** establish:

- exact internal CPU/RAM/age cut-offs;
- actual labour-minute ceilings;
- actual repair failure rates;
- the complete software/ERP stack;
- all resale channels or margins;
- each operator’s regional minimum volume;
- the full chain after an item leaves a partner’s control.

Those are interview or pilot questions, not facts to fill in by inference.

## 1. Evidence quality and method

### First-party operating sources

The strongest material for this report came from operator process pages, service pages, FAQs, and partner case studies:

- [FlipTech bin process](https://www.fliptech.com.au/bins) and [FlipTech data-erasure description](https://www.fliptech.com.au/articles/8e4e2ca7-22e2-4d68-bf22-d0420c297db4);
- [WorkVentures decommissioning](https://workventures.com.au/decommissioning/), [CircularIT](https://workventures.com.au/circularit/), [refurbishment](https://workventures.com.au/refurbishment/), and [3PL services](https://workventures.com.au/3pl-services/);
- [Sircel services](https://sircel.com/services/);
- [PonyUp services](https://www.ponyupforgood.com/our-services), [data security](https://www.ponyupforgood.com/partners-data-security), and [FAQ](https://www.ponyupforgood.com/faq);
- [The Reconnect Project donation process](https://thereconnectproject.com.au/donate/);
- [Renew IT services](https://renew-it.com/services/) and [security/certification](https://renew-it.com/security-certification/);
- [Good360/Compnow case study](https://good360.org.au/wp-content/uploads/2024/07/Compnow-Good360-CaseStudy.pdf) and [Good360 Digital Divide process](https://good360.org.au/digital-divide/).

### Evidence rule

An operator’s marketing page establishes what the operator says it offers. It does not independently prove every performance, environmental, security, or downstream claim. For Dubbo decisions, record:

- **Published process:** explicitly described by the operator;
- **Partner/case-study evidence:** described by a named partner or case study;
- **Inferred control point:** a reasonable design implication, not an operator fact;
- **Unknown:** requires a direct answer, contract, certificate, audit, or pilot observation.

## 2. Public mechanics by operator

### 2.1 FlipTech Australia

**Published process:**

- delivers e-waste bins to buildings;
- client fills the bin and requests pickup;
- replaces the bin during pickup;
- sorts e-waste at its facility;
- securely erases data-bearing assets;
- publicly describes data-security controls including locked/unbranded vehicles, controlled facilities, access restrictions, surveillance, and certificates;
- describes reuse/donation and recycling outcomes in public material.

**What this teaches Dubbo:**

- collection design is a product, not an afterthought;
- a bin reduces friction but also creates uncontrolled mixed intake unless the client is educated;
- data-bearing assets need a distinct security flow;
- a credible service needs an evidence/reporting layer, not only a truck and a shed;
- corporate clients value discretion, chain of custody, and certificates.

**Still unknown:**

- exact receipt inspection and quarantine steps;
- exact grading bands and resale minimums;
- repair-versus-parts decision rule;
- internal asset-management system;
- wipe-tool configuration and media exceptions;
- percentage reused, donated, parted, destroyed, and recycled;
- average turnaround and regional collection minimum;
- warranty/returns and stock-age policy;
- whether a regional feeder can operate under its procedures.

### 2.2 WorkVentures CircularIT and decommissioning

**Published process:**

1. inventory and assess refreshable assets;
2. secure collection and transport using manifests, containers, and controlled logistics;
3. catalogue, scan, separate by device type, and create batches in a secure warehouse;
4. sanitise or destroy storage media;
5. assess and triage;
6. repair/refurbish, redeploy, resell, donate, or recycle;
7. provide certificates, asset reports, sustainability and impact reporting.

WorkVentures says it uses Blancco IBR to sanitise and grade controlled assets, maintains an in-house database for stock integrity/traceability, and uses R2-certified downstream recycling partners for equipment that cannot be reused. It also publishes an MDM-lock explanation: a managed device may be technically fine but unusable for redistribution until the owner’s administrator removes the management association.

**What this teaches Dubbo:**

- the asset register and physical process are one system;
- batches can reduce handling complexity, but serial-level evidence still matters;
- a “donation” service has the same data, testing, and reporting burden as resale;
- MDM/Autopilot is an intake gate, not a late-stage cleanup task;
- partner route and recipient suitability must be known before accepting donation-targeted inventory;
- inventory systems must support rework, kitting, storage, and final testing.

**Still unknown:**

- exact pass/fail thresholds by category;
- which repairs happen in-house versus through specialists;
- labour and parts ceilings;
- stock ageing and write-down rules;
- how battery health affects grade;
- how residual value is calculated;
- partner audit terms and regional minimums.

### 2.3 Sircel

Sircel’s public services page describes an end-to-end model:

- design collection methods, events, bins/cages, marketing, education, and triage;
- perform onsite decommissioning for corporate ICT and infrastructure;
- manage logistics through its fleet or trusted partners;
- prioritise reuse through an ITAD asset-recovery/repurposing department;
- securely erase data before repurposing;
- recycle non-reusable material through its in-house Australian processing model;
- operate specialist processing including PCB and Parkes solar-panel lines.

**What this teaches Dubbo:**

- collection and education influence the quality of the incoming stream;
- triage is a designed service before transport, not merely sorting after a pile forms;
- ITAD/reuse and material recycling are separate capability lanes;
- a regional operator can be valuable as a pre-triage or aggregation layer only if the receiving partner accepts that role;
- “in-house” claims still need scope: which categories, facilities, and fractions?

**Still unknown:**

- exact device-level pass/fail tests;
- minimum specifications and battery grades;
- repair versus resale versus parts thresholds;
- partner/broker allocation after reuse triage;
- serial-level visibility after handoff;
- whether Parkes or another facility accepts a small pre-triaged Dubbo stream;
- current commercial terms and continuity for a local feeder.

### 2.4 PonyUp for Good

**Published process:**

- targets corporate decommissioned technology and a reuse-first route;
- creates asset registers with serial/asset tags;
- provides secure de-badging/data cleansing through operations partners;
- uses Blancco and, through an operations partner, Aiken Workbench;
- Aiken output can include serial/model, erase method, timestamp, and an encrypted database record;
- failed sanitisation or non-reusable equipment is destroyed/recycled through accredited partners;
- remanufactures/remarkets viable equipment and links profit to social impact;
- focuses primarily on 2–5-year-old technology but says it can handle other redundant technology too.

**What this teaches Dubbo:**

- a serialised asset register is useful for owners, accountants, and final reporting;
- sanitisation failure needs a predetermined destruction route;
- corporate sourcing reduces random-junk exposure;
- impact value can support a service, but it does not remove the need for unit economics;
- de-badging, asset records, and chain of custody are part of the product.

**Still unknown:**

- floor-level diagnostic sequence;
- exact cosmetic/battery grading;
- average repair time and reuse rate by category;
- regional collection minimums;
- whether a Dubbo partner could pre-triage or aggregate under PonyUp’s controls;
- how fees, resale, and social contribution are split.

### 2.5 The Reconnect Project

The Reconnect Project publishes a more human-scale model:

- accepts phones/tablets of any age/condition and laptops under about eight years;
- triages donated equipment;
- identifies spare parts needed;
- repairs through technicians/trainees;
- uses Blancco for secure erasure and can provide a certificate for a contribution;
- uses unrepairable devices as parts donors;
- sends residual broken parts/devices to Australian reprocessors;
- combines repair income, distribution, and employment/social outcomes.

**What this teaches Dubbo:**

- a broad intake can work only when the organisation has a parts ecosystem and repair labour;
- “unrepairable” does not automatically mean immediate recycling—donor parts can be a route;
- social enterprise economics can subsidise repair, but the subsidy must be identified;
- the repair pathway can be an employment/training pathway when supervised.

**Do not copy automatically:**

- broad age/condition acceptance;
- volunteer/trainee labour assumptions;
- charity funding model;
- repair scope without specialist support;
- a Sydney workshop’s downstream access in a Dubbo shed.

### 2.6 Renew IT

Renew IT publicly describes:

- asset buyback;
- national logistics and deinstallation;
- serial-level asset reporting;
- Blancco data destruction on purchased assets;
- a ten-year cloud record for drives whose data was destroyed;
- refurbishment/resale;
- material processing partnerships for older devices;
- enterprise certifications and a larger multi-facility operation.

**What this teaches Dubbo:**

- retention period and report retrieval are part of data-service value;
- buyback/resale and recycling can be different commercial contracts;
- enterprise scale is built around repeatable logistics, inventory, and certifications;
- a local partner should ask what minimum evidence is required before it can feed such a system.

**Still unknown:**

- whether small regional lots are economical;
- local collection price/minimum;
- whether a small operator can become a supplier or subcontractor;
- exact grading and repair thresholds;
- how battery-bearing consumer devices are treated.

### 2.7 Good360 and Compnow

The Good360/Compnow case study describes a donation-oriented workflow:

- corporate lease fleets are sourced;
- data/IP is wiped;
- cosmetic wear, missing keys, battery life, speakers, and cameras are assessed;
- Mac/iOS is reinstalled where applicable;
- missing power adapters are sourced;
- devices are individually boxed and labelled;
- suitable devices go to schools/students through the Good360 network;
- unsuitable categories can be on-sold and the funds returned to Good360.

**What this teaches Dubbo:**

- a donation route still needs a quality bar and complete accessories;
- the recipient experience is part of refurbishment quality;
- the route can include a commercial residual-value fallback;
- matching supply to a named recipient network reduces indefinite storage.

**Still unknown:**

- whether a small local refurbisher can become an accredited partner;
- current minimum lots, processing cost, and regional logistics;
- exact device specifications accepted for current programs;
- warranty/support responsibility after distribution;
- how local organisations are selected and supported.

## 3. Common operating architecture

### Stage 1 — scope the source

Professional operators usually start with a corporate, school, government, leasing, or campaign source rather than an unbounded public tip. The source provides some combination of:

- asset list;
- quantities and categories;
- authority to transfer;
- data sensitivity;
- collection location/access;
- target timing;
- donation, resale, or recycling objective.

**Dubbo adaptation:** require a pre-screen form and photos for public donors; prefer known-source business lots once the pilot starts.

### Stage 2 — secure collection and custody

Common controls described publicly include:

- locked/controlled transport;
- manifests and asset lists;
- bins, cages, or labelled batches;
- authorised workers;
- secure warehouse receipt;
- scan/receipt event;
- client report of collected assets.

**Dubbo adaptation:** an intake ID, transfer record, private serial record, labelled storage position, and one-person-at-a-time handover may be enough for Phase 0. Do not advertise a security level that the physical premises cannot support.

### Stage 3 — isolate and sanitise

Across the operators, data-bearing assets are treated as a distinct security lane. Publicly described controls include Blancco, Aiken Workbench, serial-linked certificates, physical destruction for failed sanitisation, and restricted facilities.

**Dubbo adaptation:** use `UNWIPED — RESTRICTED`; never list, donate, part out, or send ordinary recycling before the media route is complete. Record exceptions for failed media, encrypted storage, embedded memory, phones, routers, printers, and managed devices.

### Stage 4 — inventory and triage

Published enterprise mechanics include:

- scanning/cataloguing;
- device-type separation;
- batch creation;
- condition/residual-value assessment;
- triage and route assignment;
- MDM/account-lock checks;
- asset-register reconciliation.

**Dubbo adaptation:** start with a spreadsheet/local database, but use stable asset IDs and route states from day one so migrating to a partner system remains possible.

### Stage 5 — repair/refurbish/test

Public case studies mention:

- hardware and cosmetic tests;
- battery, speaker, camera, keyboard, and display checks;
- OS reinstall;
- missing accessory completion;
- repair, rework, and final inspection;
- donor-parts harvesting.

**Dubbo adaptation:** define a category test sheet, a labour/parts ceiling, a rework limit, a test-result evidence path, and a buyer-facing disclosure. A device that only “boots” is not refurbished.

### Stage 6 — route and report

Common routes are:

- redeployment;
- donation;
- resale/buyback;
- parts recovery;
- material recycling;
- destruction for failed sanitisation or unsafe/uneconomic equipment.

Common reporting outputs are:

- manifest/asset register;
- data-destruction certificate;
- condition/outcome report;
- residual value or buyback summary;
- reuse/recycling split;
- impact/sustainability report;
- handover/delivery evidence.

**Dubbo adaptation:** report the route that actually occurred, not an aspirational “recycled” label.

## 4. What a small operation should copy now

### Minimum viable mechanics

1. `asset_id` assigned before bench handling.
2. Private serial/IMEI record and public-photo redaction.
3. `UNWIPED`, `SANITISING`, `SANITISED`, `REPAIR`, `READY`, `PARTS`, `DONATION`, `RECYCLING`, and `REJECTED` states.
4. One labelled physical position per asset.
5. Ownership/authority record.
6. Lock/MDM status and evidence.
7. Category-specific test sheet and tool versions.
8. Labour/parts ceiling before repair begins.
9. Route-change reason when a whole-device plan becomes parts/recycling.
10. Final evidence ID for sale, donation, or downstream handoff.
11. Stock-age review date and storage-capacity stop rule.
12. Incident/near-miss record.

### What to defer

- enterprise ERP;
- public drop bins;
- a broad “all e-waste” promise;
- advanced certification claims;
- internal battery recycling;
- high-voltage/CRT work;
- board-level work;
- regional collections without a costed route;
- accepting locked business devices on a promise;
- claiming an operator’s accreditation or partner status without a contract.

## 5. Interview and site-visit questions

Ask operators for process knowledge, not confidential client data.

### Intake and custody

- What arrives pre-listed versus mixed?
- What are the first five checks at receipt?
- Which categories are rejected immediately?
- How are unknown batteries isolated?
- What evidence of ownership/authority is required?
- How are serials, asset tags, and batches linked?
- What happens when the physical count does not match the manifest?
- What is the maximum time an unwiped asset may remain before sanitisation?

### Locks and data

- How are Apple Activation Lock, Google FRP, MDM, Autopilot, BIOS passwords, and carrier locks recorded?
- Who is authorised to clear an organisation’s management association?
- What happens when sanitisation fails?
- Which fields appear on the certificate?
- How long are certificates and asset records retained?
- How are embedded-memory devices, routers, printers, and NAS devices handled?

### Triage and repair

- What minimum tests are required by category?
- What are the grade definitions?
- How is battery health measured and disclosed?
- What labour/parts cost triggers parts or recycling?
- What repair classes are excluded?
- How many rework attempts are allowed?
- What percentage is reused, repaired, parted, donated, sold, destroyed, and recycled?
- How is stock ageing handled?

### Commercial and regional

- What is the minimum regional pickup volume?
- Are small feeder or aggregation partners accepted?
- Who pays rejected-material and freight costs?
- What insurance and training must a partner carry?
- What audit rights and branding rules apply?
- What happens to unsold or returned stock?
- Who owns warranty and consumer-law obligations after resale?

### Downstream and impact

- Which legal entity receives each non-reusable stream?
- What certificate or mass-balance evidence is supplied?
- Does “recycled” mean dismantled, shredded, recovered, exported, or destroyed?
- What does the operator report after an asset enters a partner’s control?
- Can a small operator report reuse/parts/recycling outcomes at serial level?

## 6. Proposed small-operator workflow derived from the comparison

### Intake state machine

```text
PRE-SCREEN
  -> ARRIVAL-SCREEN
      -> REJECTED / RETURNED
      -> HOLD-FOR-AUTHORITY-OR-INFO
      -> UNWIPED-RESTRICTED
          -> SANITISING
              -> SANITISED
                  -> TESTING
                      -> READY-FOR-SALE
                      -> REPAIR
                          -> RETEST
                              -> READY-FOR-SALE
                              -> PARTS
                      -> DONATION
                      -> PARTS
                      -> PARTNER
                      -> RECYCLING
                      -> DESTRUCTION
```

No state should be skipped silently. Every transition needs operator/date/reason, and a failed transition must remain visible.

### Minimum private asset record

```text
asset_id
source / transfer authority
make / model / category
serial / IMEI
received_at / received_by
physical location
battery and safety state
data-bearing media
account / MDM / Autopilot / activation state
sanitisation method / tool / result / evidence
test protocol / result / evidence
repair attempts / labour / parts
route and route-change reason
list/sale/donation/recycling/destruction evidence
return/incident/recall state
final outcome
```

### Grade vocabulary to test

Do not borrow an A/B/C system without defining it. Pilot a plain-language version:

- **Ready:** tested, sanitised, complete enough for the advertised use;
- **Refurbished:** repaired or upgraded, with work disclosed;
- **Used/tested:** functional checks completed, cosmetic wear disclosed;
- **Parts/donor:** not sold as a working device;
- **Untested:** not suitable for ordinary resale claims;
- **Recycling:** no reuse route or failed safety/data/viability gate.

The category sheet must define what “tested” means. “Powers on” is not enough.

## 7. Public-claim contradictions and caution points

- FlipTech’s public bin page says it sorts and securely erases data-bearing assets, but does not publish its full reuse/recycling split or triage thresholds.
- WorkVentures describes R2-certified downstream partners and detailed reporting, but a partner’s certificate still needs to identify the relevant material/asset route.
- Sircel describes in-house Australian recycling and reuse prioritisation, but the exact path for a particular small regional load still requires confirmation.
- Good360’s current public material shows different programme cost/lot figures across pages and dates; verify the live programme before using any number in a Dubbo plan.
- Reconnect’s broad acceptance model is supported by repair labour, parts harvesting, social enterprise income, and established reprocessors; it is not evidence that a one-person home operation should accept the same range.
- PonyUp’s social-impact model and enterprise data controls are built around corporate collection and partner operations; they are not a free template for residential public intake.

## 8. Highest-value unknowns to close next

1. Obtain a non-confidential FlipTech interview focused on the first five intake checks, grade thresholds, and regional-partner requirements.
2. Ask WorkVentures or PonyUp for a redacted sample asset register, sanitisation certificate, and route/outcome report.
3. Ask Sircel whether Parkes accepts pre-triaged regional reuse candidates and what minimum batch/evidence is required.
4. Ask Reconnect which repair classes it accepts, what it refuses, and what its donor-parts decision looks like.
5. Ask Good360/Compnow what current device age/specification/lot/partner rules apply to a Dubbo feeder.
6. Build a 20-item local pilot using the common control points but without claiming any operator’s accreditation.
7. Compare actual local labour and disposal economics with the partner route before buying equipment or accepting public volume.

## Recommended next action

Create a one-page **Dubbo operator process pack** containing:

- triage card;
- asset-state diagram;
- private asset-register fields;
- category test sheets;
- sanitisation exception form;
- repair/parts ceiling form;
- route/outcome report;
- partner-question email.

This is the smallest useful translation of the public operator research into a controlled Phase 0 system.

## Sources consulted

- [FlipTech bins](https://www.fliptech.com.au/bins)
- [FlipTech data security](https://www.fliptech.com.au/articles/8e4e2ca7-22e2-4d68-bf22-d0420c297db4)
- [WorkVentures CircularIT](https://workventures.com.au/circularit/)
- [WorkVentures decommissioning](https://workventures.com.au/decommissioning/)
- [WorkVentures refurbishment](https://workventures.com.au/refurbishment/)
- [WorkVentures 3PL services](https://workventures.com.au/3pl-services/)
- [Sircel services](https://sircel.com/services/)
- [PonyUp services](https://www.ponyupforgood.com/our-services)
- [PonyUp data security](https://www.ponyupforgood.com/partners-data-security)
- [PonyUp FAQ](https://www.ponyupforgood.com/faq)
- [The Reconnect Project donation process](https://thereconnectproject.com.au/donate/)
- [Renew IT services](https://renew-it.com/services/)
- [Renew IT security and certification](https://renew-it.com/security-certification/)
- [Good360/Compnow case study](https://good360.org.au/wp-content/uploads/2024/07/Compnow-Good360-CaseStudy.pdf)
- [Good360 Digital Divide](https://good360.org.au/digital-divide/)
