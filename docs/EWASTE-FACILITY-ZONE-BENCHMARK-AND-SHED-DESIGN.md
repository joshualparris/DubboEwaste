# E-waste facility zone benchmark and Phase 0 shed design

**Research date:** 5 October 2026 (AEST)  
**Scope:** how Australian e-waste, ITAD, refurbishment and reuse operators publicly describe receiving, secure storage, quarantine, data sanitisation, testing, refurbishment, sale/reuse and downstream processing; then translate those controls into a practical small back-shed model for Dubbo Phase 0.  
**Status:** `DESIGNED / RESEARCHED`, not site approval and not evidence that the current shed is suitable. Exact physical placement still requires a measured/photo-based shed map plus the open Council, lease/landlord, insurer, moisture, fire and downstream gates.

This report complements:

- [RESEARCH-03-COMPETITOR-OPERATING-MECHANICS.md](RESEARCH-03-COMPETITOR-OPERATING-MECHANICS.md) — operator workflow mechanics;
- [RESEARCH-06-BATTERY-ELECTRICAL-WORKSHOP-SAFETY.md](RESEARCH-06-BATTERY-ELECTRICAL-WORKSHOP-SAFETY.md) — battery/electrical safety boundary;
- [RESEARCH-12-PREMISES-PHYSICAL-FLOW-CAPACITY.md](RESEARCH-12-PREMISES-PHYSICAL-FLOW-CAPACITY.md) — zone/capacity design;
- [BENCH-SOP-AND-LAYOUT.md](BENCH-SOP-AND-LAYOUT.md) — canonical bench workflow;
- [PHASE-0-LAUNCH-GATES.md](PHASE-0-LAUNCH-GATES.md) — launch gates and evidence required before broader intake.

## Executive conclusion

The public evidence does **not** reveal detailed floor plans for most commercial ITAD facilities. It does, however, reveal a strong and repeated operating architecture.

Professional operators separate at least four different states:

1. **received but not yet trusted/processed**;
2. **data-bearing/restricted or sanitisation-pending**;
3. **assessed/tested/repair work in progress**;
4. **released reuse/resale stock or segregated outbound recycling/destruction**.

The strongest facilities add serial-level tracking, controlled access, secure transport, batch/lot identification, asset reconciliation, sanitisation evidence, downstream records and physical separation.

For a one-person Dubbo shed, the right lesson is **not** to copy warehouse scale. It is to copy the boundaries.

### Recommended Dubbo Phase 0 physical model

Use a one-way, dirty-to-clean flow:

```text
HANDOFF / DOOR
      ↓
A  INTAKE / UNASSESSED
      ↓
B  UNWIPED — RESTRICTED
      ↓
C  PROCESSING BENCH
   sanitise → verify → diagnose
      ↓
D  REPAIR / WIP
      ↓
E  CLEARED QA
      ↓
F  READY FOR SALE / REUSE

Side exits:
A/B/C/D → G PARTS / DONOR
A/B/C/D → H RETURN / DOWNSTREAM OUTBOUND

BATTERY HAZARD = exception / stop-work path, not normal inventory.
```

The physical device and its AssetFlow status should change together. If the physical location and record disagree, the safer status wins: **hold it and reconcile it**.

The main design decision is to create a hard **red/dirty boundary** between received/unwiped equipment and a **green/clean boundary** for sanitised, released stock. Do not use one miscellaneous shelf for both.

---

# 1. What real operators publicly show

## 1.1 EraseIT: quarantine is a real lifecycle state

EraseIT describes real-time asset tracking through its decommissioning lifecycle and says assets are placed in **quarantine until fully processed**. Assets are then sanitised or released from quarantine for purchase/disposal. Its facilities are described as secure, high-volume sites designed for receipt, decommissioning and disposal.

**Useful control to copy:**

- “received” is not the same as “available”;
- every received device starts in a restricted state;
- release from quarantine requires a recorded processing event;
- physical location and lifecycle status are tracked together.

**Dubbo adaptation:** a lockable **UNWIPED — RESTRICTED** cabinet/shelf is the small-shed version of enterprise quarantine.

Sources:

- https://www.eraseit.com.au/equipment-decommissioning/
- https://www.eraseit.com.au/about-us/

## 1.2 WorkVentures: secure warehouse → scan → separate → batch → destroy data → triage

WorkVentures publishes an unusually useful warehouse-level sequence. Its decommissioning process includes:

1. secure collection;
2. secure warehouse;
3. asset management;
4. secure data destruction;
5. recycling;
6. reuse;
7. reporting.

It specifically says that, in the secure warehouse, items are **scanned, separated into device types and unique batches are created**. Asset management then includes physical inventory, reconciliation against a client master list, reporting, auditing and triage.

Its e-waste process separately describes secure transport to a secure facility, triage/sorting, data sanitation, reuse/recycling determination and traceability.

**Useful controls to copy:**

- receive into a defined batch rather than a loose pile;
- label before shelving;
- separate device types when that improves handling;
- reconcile what physically arrived against what the record says;
- sanitisation is before unrestricted reuse/recycling release;
- provide a final outcome record.

**Dubbo adaptation:** one labelled tray/batch at a time on the intake shelf; asset ID at the door; no “I’ll enter it later” pile.

Sources:

- https://workventures.com.au/decommissioning/
- https://workventures.com.au/e-waste/
- https://workventures.com.au/refurbishment/

## 1.3 Greenbox: scan, test, sanitise, de-identify, report, remarket/recycle

Greenbox’s asset-recovery process says equipment is transported to a secure disposal centre, then the load is **scanned, tested, sanitised and entered into its database**. It also describes de-identification of assets and granular reporting that supports reconciliation with customer asset registers.

Greenbox also publishes that its Australian facilities are R2v3 certified and describes secure transport, background-checked staff and tracking.

**Useful controls to copy:**

- the processing bench is not just repair: it is a controlled record-producing station;
- labels/asset tags/branding need an intentional de-identification step;
- sanitisation evidence belongs to the same asset record as testing and route outcome;
- remarketing should only occur after the release controls are complete.

**Dubbo adaptation:** add **de-badge / asset-label removal** to the clean-side checklist after ownership and data release, not as the first thing done to an incoming device.

Sources:

- https://www.greenbox.com.au/services/asset-recovery/
- https://www.greenbox.com.au/faqs/
- https://www.greenbox.com.au/about/

## 1.4 FlipTech: collection convenience is paired with secure data-area controls

FlipTech describes a public collection-bin model followed by sorting and erasure at its facility. Its data-security material says data-bearing equipment is transported in locked/unmarked vehicles, enters a secured facility under surveillance, and access to data-handling areas is limited to authorised personnel.

**Useful controls to copy:**

- a convenient collection method does not eliminate the need for a secure internal data lane;
- access control is a physical control, not only a software permission;
- data-bearing stock awaiting erasure should not be accessible to visitors.

**Do not copy in Phase 0:** public bins or unattended drop-off. Those create uncontrolled volume, mixed condition, battery and dumping risk that the current Dubbo model is deliberately avoiding.

**Dubbo adaptation:** handoff stays at the door/driveway boundary; customers do not enter the processing or unwiped area.

Sources:

- https://www.fliptech.com.au/bins
- https://www.fliptech.com.au/articles/8e4e2ca7-22e2-4d68-bf22-d0420c297db4

## 1.5 Sircel: receival gets a tracking number; triage separates reuse before material processing

Sircel’s published large-scale process is useful because it separates **receival**, **triage**, ITAD/reuse and destructive materials processing.

At receival, loads are logged on a weighbridge or pallet scale and receive a unique tracking number. Triage then removes/segregates problem or distinct streams and identifies equipment suitable for reuse/repurposing; non-end-of-life equipment is diverted to the ITAD team rather than continuing into material processing.

**Useful controls to copy:**

- assign a lot/job identity as soon as equipment arrives;
- make the reuse decision before destructive processing;
- route devices deliberately rather than letting them drift into “scrap”;
- distinguish a reuse/refurb lane from a materials-recycling lane.

**Dubbo adaptation:** no weighbridge is needed. Use source/job ID + device asset ID + destination state. “PARTS” and “DOWNSTREAM” are explicit exits, not the floor under the bench.

Sources:

- https://sircel.com/how-we-work/our-process/
- https://sircel.com/services/
- https://sircel.com/services/itad-asset-recovery-repurposing/

## 1.6 CompNow / SustainIT: formal assessment before value recovery

CompNow’s SustainIT buyback process publishes a clean lifecycle:

1. identify end-of-life assets;
2. quote;
3. securely collect/transport;
4. detailed auditable assessment and secure data/identity cleansing;
5. formal itemised assessment/buyback offer;
6. payment;
7. refurbish, resell, reuse or recycle.

**Useful controls to copy:**

- the device should reach a defined **assessed** state before it becomes resale stock;
- data/identity cleansing is part of processing, not a post-sale task;
- route decisions can be financial as well as technical, but only after security and custody controls.

**Dubbo adaptation:** keep “accepted at door” separate from “economically accepted for refurbishment”. Phase 0 may accept subject to inspection, then route to repair/parts/downstream based on measured results.

Sources:

- https://www.compnow.com.au/it-knowledge-base/laptop-buyback-offer/
- https://www.compnow.com.au/capabilities/lifecycle-management/

## 1.7 PonyUp for Good: serial registers and a defined failed-sanitisation route

PonyUp publicly describes complete asset registers containing serial/asset tags, Blancco/Aiken sanitisation, certificates and a fallback route for media that does not successfully sanitise. It states that failed sanitisation and equipment not suitable for reuse go to accredited recycling partners.

**Useful controls to copy:**

- failed wipe is a **route**, not an indefinite shelf status;
- sanitisation evidence should be serial-linked;
- reuse and recycling can share one intake system while still having separate release outcomes.

**Dubbo adaptation:** create a “FAILED SANITISATION / DATA HOLD” status but do not create a permanent junk pile for it. It needs a named next action and review date.

Sources:

- https://www.ponyupforgood.com/our-services
- https://www.ponyupforgood.com/partners-data-security
- https://www.ponyupforgood.com/faq

## 1.8 The Reconnect Project: repair, donor-parts and recycling are distinct routes

The Reconnect Project publishes a smaller-scale, repair-heavy model. Incoming devices are triaged, spare-parts needs identified, devices repaired and securely erased. If a device cannot be repaired/refurbished it may be retained as a donor; broken residual parts/devices are then sent to Australian reprocessors.

**Useful controls to copy:**

- “not worth repairing” and “no value” are not identical;
- donor devices need their own bounded storage;
- parts recovery can reduce waste, but only if the parts bins are controlled and actually used.

**Dubbo adaptation:** limit parts to named, useful categories and fixed bins. No unlabelled “maybe useful one day” pile.

Source:

- https://thereconnectproject.com.au/donate/

## 1.9 Close the Loop: collection/assessment → erase → test/process → QA → reuse/recycling

Close the Loop publishes a staged IT asset recovery model: collection and assessment, secure data erasure, testing/processing, multi-point QA and reuse or recycling through approved channels. It also describes serial tracking and documentation for enterprise ITAD.

**Useful controls to copy:**

- final QA is a separate release step after repair/testing;
- physical work completion should not automatically mean sale-ready;
- reuse stock and recycling stock should end in clearly different lanes.

**Dubbo adaptation:** keep a small **CLEARED QA** shelf/tray between bench/WIP and **READY FOR SALE**. This catches incomplete accessories, missing disclosures, bad batteries, failed final tests and listing gaps.

Source:

- https://closetheloop.com.au/it-refurb

## 1.10 Bendigo E-Waste: a mature small operator is broader than the Dubbo starting point

Bendigo E-Waste publicly describes a family-run operation that began with the founder processing his own e-waste and then friends/family equipment. Its current warehouse accepts a broad range, offers collection, data destruction and valuation, and uses a circular hierarchy of repurpose/repair/donor parts before base-resource recovery.

Its current public model includes 24/7 drop-off and broad category acceptance. That is evidence of what a more mature small regional operator can grow into, **not evidence that Dubbo should begin there**.

Its public guidance also says complete devices are preferred over pre-destroyed equipment because the first objective is restoration/recovery before scrap.

**Useful controls to copy:**

- reuse-first hierarchy;
- preserve complete devices until triage;
- repairs/donor use before material recovery;
- explicit data-destruction service where appropriate.

**Do not copy initially:**

- broad category intake;
- 24/7 unattended drop-off;
- loose-battery/media streams;
- warehouse-scale accumulation.

Sources:

- https://www.bendigoewaste.com.au/
- https://www.bendigoewaste.com.au/services-7
- https://www.bendigoewaste.com.au/about-1

---

# 2. Standards and regulator patterns that reinforce the operator design

## 2.1 R2v3 / SERI: dedicated secured data areas are an explicit control model

SERI guidance for R2v3 data sanitisation asks facilities to establish appropriate security controls for data-containing devices and specifically discusses **dedicated secured areas for data sanitisation**, restricted access, locked rooms or partitioned areas, monitored access, labelled secure areas, receiving/storage procedures and access authorisation.

Dubbo Phase 0 is **not claiming R2 certification**. The value here is the control model:

- mark the restricted zone;
- physically restrict it;
- control who may enter;
- document receiving/storage;
- track devices through sanitisation.

Sources:

- https://sustainableelectronics.org/knowledge-base/guidance-for-developing-an-r2v3-data-sanitization-plan-version-1/
- https://sustainableelectronics.org/knowledge-base/r2v3-appendix-applicability-guidance/
- https://sustainableelectronics.org/knowledge-base/r2v3-appendix-determination-tool/

## 2.2 ANZRP / TechCollect: collection sites are audited for HSE, handling and storage

ANZRP says TechCollect collection partners must pass HSE assessment, provide compliance/risk-assessment evidence and undergo ongoing audits. Recycling partners are required to be certified to AS/NZS 5377 and ISO 14001. ANZRP describes its audit model as covering the e-waste value chain, including collection, logistics and recycling.

Dubbo should not claim AS/NZS 5377 compliance unless it is actually assessed/certified where required. However, the program shows that **safe handling/storage at the collection point itself** is a meaningful control, not something deferred until the recycler.

Source:

- https://www.anzrp.com.au/about/compliance/

## 2.3 NSW fire guidance: a site plan with designated drop-off, transfer and storage areas is a recognised waste-facility control

Fire & Rescue NSW’s published waste-facility guidance calls for an operations plan with:

- a site-plan drawing;
- identified storage, handling and processing locations;
- expected/maximum inventory;
- procedures preventing stock limits being exceeded;
- separate, clearly designated material drop-off, transfer and storage areas.

This guidance is written for waste facilities and does not automatically classify this small shed as one. The design principle is nevertheless directly useful: **draw the zones and set caps before material accumulates**.

Source:

- https://www.fire.nsw.gov.au/fire-safety/building-fire-safety/publications/guidelines-and-technical-information

## 2.4 NSW lithium-battery guidance: damaged batteries are an exception lane, not ordinary stock

SafeWork NSW says damaged batteries should be isolated from other materials, kept cool/dry and away from heat/flammables, appropriately contained/labelled and managed under an emergency plan. Current NSW public guidance also says damaged batteries must not be used or charged.

For this project the safer Phase 0 design remains **refuse visibly damaged/swollen/wet/fire-affected battery devices before custody transfers**.

If battery damage is only discovered after acceptance:

- stop work;
- do not charge/test;
- keep people away;
- follow the site-specific emergency/isolation procedure and current NSW guidance;
- arrange an appropriate receiver/advice pathway promptly;
- do not let “battery quarantine” become ordinary long-term inventory.

Sources:

- https://www.safework.nsw.gov.au/hazards-a-z/lithium-ion-batteries
- https://www.smallbusiness.nsw.gov.au/news-podcasts/news/lithium-ion-battery-safety-what-small-businesses-need-to-know
- https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/topics/shop-charge-and-recycle-safely

## 2.5 NIST SP 800-88 Rev. 2: sanitisation is a program, not a magic wipe button

NIST SP 800-88 Rev. 2 was finalised in September 2025. It shifts emphasis toward an organisational media-sanitisation program, including choosing appropriate methods, validating sanitisation and establishing trust in the implementation.

For the shed, this means the “wipe bench” is not enough by itself. The control is:

**identify media → choose method → sanitise → validate → record → release or exception-route**.

Source:

- https://csrc.nist.gov/pubs/sp/800/88/r2/final

---

# 3. Common facility architecture derived from the evidence

The following is a synthesis, not a claim that every company uses these exact room names.

| Functional state | Enterprise examples | Why it exists | Dubbo physical equivalent |
|---|---|---|---|
| Handoff / receiving | collections, loading bay, bins/cages, receival logging | custody begins cleanly | door/driveway handoff; no public workshop access |
| Intake / unassessed | scan, lot ID, device separation | nothing disappears into a pile | one labelled intake shelf/tray |
| Quarantine / restricted | EraseIT quarantine; secure data areas; controlled warehouse | protects data and blocks premature release | lockable cabinet/shelf for all unwiped data devices |
| Sanitisation | Blancco/Aiken/NIST-aligned workflows | clear/verify data before release | isolated processing bench + sanitisation record |
| Test / triage | WorkVentures triage; Greenbox test; Sircel triage | determine actual condition/route | same bench after wipe, or controlled dirty-side test where justified |
| Repair / WIP | refurb teams, donor parts | bounded active work | small WIP rack with work order and review date |
| Final QA / release | inspection, grading, compliance check | separates “worked on” from “ready” | small CLEARED QA tray/shelf |
| Sale/reuse stock | remarketing, donation, redeployment | clean inventory ready to leave | separate clean shelving, physically apart from unwiped |
| Parts | donor devices/components | recover useful value | fixed lidded bins only |
| Downstream / return | recycle, destruction, client return | stops residuals becoming permanent stock | labelled outbound crate/shelf near exit |
| Records | asset register, certificate, audit report | traceability | AssetFlow + protected backups; minimal paper |

Three important boundaries appear repeatedly:

### Boundary 1 — custody
Nothing crosses the door without a source/job record and an available location.

### Boundary 2 — data/security
Nothing containing possible data crosses from restricted/dirty stock into clean/reuse stock without a completed media decision and release record.

### Boundary 3 — release
Nothing becomes sale-ready merely because it powers on or a repair finished. It passes final QA, disclosures, accessories and route/release checks.

---

# 4. Recommended physical implementation for the Dubbo back shed

This is a **default topology**, not an exact measured floor plan. Do not infer that a particular wall, shelf or square metre is suitable until the shed is inspected/measured and the premises gates are closed.

## Zone 0 — HANDOFF / VISITOR BOUNDARY

**Location:** outside the workshop or immediately at the doorway, without a visitor entering the processing area.

**Purpose:**

- confirm booking/source;
- check item count/model;
- visible safety screen;
- verify authority/lock expectations;
- decide accept/refuse before the device disappears into storage.

**Rules:**

- no unattended drop-off;
- no “leave it at the gate”;
- one source/batch at a time;
- rejected device leaves with presenter where legally appropriate;
- no customer access to unwiped, repair or sale stock.

## Zone A — INTAKE / UNASSESSED

**Physical form:** one clearly labelled shelf, tray or trolley immediately accessible from the handoff point.

**Recommended Phase 0 WIP cap:** **2 devices or one small labelled batch**, whichever is lower. This is an operating cap to force same-day triage, not a site-safety determination.

**Rules:**

- asset ID attached immediately;
- source/job linked immediately;
- no connection to home LAN;
- no overnight “mystery item” if the record is incomplete;
- intake shelf is not long-term storage.

**Why:** copies WorkVentures scanning/batching and Sircel receival tracking without warehouse infrastructure.

## Zone B — UNWIPED — RESTRICTED

**Physical form:** the best lockable cabinet, lockable room section or physically restricted shelving available after site suitability is proven.

**Recommended initial WIP cap:** **4 data-bearing devices**. Increase only after measured throughput and security/capacity review.

**Rules:**

- all data-bearing devices default here;
- no visitor access;
- no sale-ready equipment in the same cabinet;
- every item has asset ID + media state + next action;
- oldest item reviewed first;
- full zone = no new data-bearing intake.

**Why:** small-scale translation of EraseIT quarantine, FlipTech secure data area and R2v3 security controls.

## Zone C — DIAGNOSTICS / SANITISATION BENCH

**Physical form:** one main bench. The bench is a **processing position, not storage**.

**Capacity:** **one active device per operator work position**.

### Bench operating mode

Use a visible bench state:

- **RED / RESTRICTED:** unwiped device currently being identified/sanitised;
- **AMBER / WORK:** cleared device under diagnostics/repair;
- **GREEN / CLEAN:** final QA/configuration/listing preparation.

If the same physical bench is used for all three modes, perform a **bench reset** before switching to green/clean work:

1. finish/secure the previous asset;
2. update its AssetFlow location/status;
3. remove media/adapters/labels belonging to it;
4. clear loose screws/parts;
5. clean the work surface as appropriate;
6. confirm no restricted device/media remains;
7. start the next asset.

Unknown equipment remains off the normal home LAN; use offline tools or an isolated/segregated test network per the existing SOP.

**Why:** a one-person shed does not need three expensive benches, but it needs disciplined state separation.

## Zone D — REPAIR / WIP

**Physical form:** one small rack next to, but not on, the bench.

**Recommended initial WIP cap:** **3 active devices**.

Every device needs:

- fault/goal;
- work order or task;
- parts needed;
- money/time ceiling;
- next action;
- review date.

**Age rule recommendation:** any device with no meaningful action for **14 days** is reviewed for return, parts or downstream route. This is a management rule for the pilot, not a legal disposal authority.

**Why:** Reconnect-style donor/repair value is useful, but uncontrolled WIP is how a shed becomes a graveyard.

## Zone E — CLEARED QA

**Physical form:** small clean shelf/tray separate from Zone B and the active repair rack.

**Recommended initial WIP cap:** **2 devices**.

A unit enters only when:

- data state is released;
- repair/testing work is complete;
- final test is pending or just completed.

A unit leaves for READY FOR SALE only when:

- final function check passes;
- battery/charger/accessories are recorded;
- cosmetic/functional grade is recorded;
- locks/MDM/account state is clean;
- software/support position is known;
- disclosures are written;
- serial/asset evidence is reconciled.

**Why:** copies Close the Loop/enterprise QA logic without creating bureaucracy.

## Zone F — READY FOR SALE / REUSE

**Physical form:** dedicated clean shelving physically separated from the unwiped zone. If the shed allows, place this on the opposite side of the room from Zone B.

**Recommended initial WIP cap:** **4 devices**.

**Rules:**

- only released assets;
- listing ID/channel linked;
- charger/accessories stored with or clearly linked to the unit;
- no repairs performed on this shelf;
- stock-age review weekly;
- sale-ready stock is not used as spare-parts storage.

**Why:** the clean-stock boundary is one of the most important controls in the whole shed.

## Zone G — PARTS / DONOR

**Physical form:** a very small number of labelled, lidded bins.

Start with categories that are genuinely likely to be reused, for example:

- RAM;
- SSD/HDD **only when each media item has a known sanitisation state**;
- chargers/adapters;
- laptop donor parts;
- cables/known-good accessories.

**Rules:**

- no loose unidentified storage media;
- no swollen/unsafe batteries;
- donor chassis retain an asset ID until fully dispositioned;
- one-in/one-out or bin-cap rule;
- when the bin is full, sort/use/outbound before creating another bin.

**Why:** copy Reconnect’s donor-parts value, not the stereotypical repair-shop mountain of unsorted parts.

## Zone H — RETURN / DOWNSTREAM / OUTBOUND

**Physical form:** labelled shelf/crate near the exit, separate from clean sale stock.

**Purpose:**

- owner returns;
- failed sanitisation route;
- recycler/downstream batch;
- sold/packed dispatch.

**Rules:**

- every item has a named destination and next date;
- no “outbound someday” status;
- do not mix assets headed to different custody destinations without labels;
- keep sanitisation status linked even when the final route is destruction/recycling.

**Why:** professional operators close the chain. The shed needs a visible way to get material **out**, not only in.

## Battery hazard exception — NOT a normal inventory zone

The existing canonical workflow includes a battery-hazard hold for risks discovered after acceptance. Keep that as an **exception control**, but do not design Phase 0 around storing damaged batteries.

Recommended rule:

> If visibly damaged/swollen/wet/fire-affected battery risk is found before acceptance, refuse normal intake. If discovered only after custody, stop work, do not charge/test, isolate people from the hazard and follow the current site-specific NSW emergency/receiver procedure.

Do not create a permanent “battery bin” in the shed and assume that makes the risk controlled.

---

# 5. Suggested shed topology

Without dimensions, use the flow rather than compass directions.

```text
                     CLEAN SIDE
┌───────────────────────────────────────────────┐
│  F READY FOR SALE      E CLEARED QA          │
│  [clean shelving]      [small shelf]          │
│                                               │
│  G PARTS BINS          D REPAIR / WIP         │
│  [bounded bins]        [3-position rack]      │
│                                               │
│                  C PROCESSING BENCH           │
│                  [1 active asset]             │
│                                               │
│  B UNWIPED — RESTRICTED       A INTAKE       │
│  [LOCKED / restricted]        [2 positions]  │
│                                               │
│  H OUTBOUND / RETURN                 DOOR     │
│  [named destination]          ← HANDOFF OUTSIDE
└───────────────────────────────────────────────┘
                     DIRTY SIDE
```

### Placement principles

1. **Intake close to the door.** New/untrusted devices travel the shortest possible distance before identification.
2. **Restricted unwiped storage not in the visitor path.**
3. **Workbench between dirty and clean states.** The bench is the controlled crossing point.
4. **Sale-ready stock furthest from the intake/unwiped lane where practical.**
5. **Outbound close to the door** so rejected/recycling material does not travel through clean stock.
6. **Nothing blocks the exit.**
7. **No inventory on the floor.**
8. **No stock against known damp/mould/water-affected surfaces.**
9. **No charging station beside the only exit.**
10. **No children, pets, food or household overflow in controlled work zones while operating.**

If the actual shed shape makes this exact arrangement impossible, preserve the **boundaries** even if the walls change.

---

# 6. Phase 0 WIP limits: deliberately small

The cumulative first pilot may involve 20–30 devices over time. It should **not** mean 20–30 simultaneous devices in the shed.

Suggested starting operating limits, pending real site measurement and approvals:

| Zone | Initial WIP limit | Overflow action |
|---|---:|---|
| A Intake | 2 | stop/reschedule intake |
| B Unwiped restricted | 4 | no new data-bearing intake |
| C Bench | 1 active | finish/secure current job |
| D Repair/WIP | 3 | route/close oldest jobs |
| E Cleared QA | 2 | complete QA before new repair completion |
| F Sale-ready | 4 | sell/dispatch before new listings |
| G Parts | fixed labelled bins | sort/use/outbound, do not add bins automatically |
| H Outbound/return | one small batch by destination | book handoff/collection |

**Recommended overall initial serialized-device cap:** **12 devices physically held at once**, excluding already packed sold goods awaiting immediate dispatch only if the premises capacity record supports it.

Why 12? It is deliberately below the sum of every zone’s theoretical maximum. It prevents “every shelf is full at once” becoming normal and gives room for movement and exceptions. It is an **operational experiment cap**, not a regulatory, fire, insurance or structural limit.

Review after the first 5 and 10 devices. Increase only if:

- the shed is proven suitable;
- every asset is locatable;
- no data-state confusion occurs;
- no zone is chronically >70% full;
- outbound routes work;
- work-in-progress age stays controlled;
- insurer/premises conditions allow it.

---

# 7. AssetFlow should mirror the physical shed

Recommended location records:

- `SHED-HANDOFF`
- `SHED-A-INTAKE`
- `SHED-B-UNWIPED-RESTRICTED`
- `SHED-C-BENCH`
- `SHED-D-REPAIR-WIP`
- `SHED-E-CLEARED-QA`
- `SHED-F-SALE-READY`
- `SHED-G-PARTS`
- `SHED-H-OUTBOUND`

Recommended rule:

> **No physical move without a location/status event. No status release without a physical move.**

At minimum record:

- asset ID;
- source/job;
- current location;
- data state;
- lock/MDM state;
- route;
- hold/review reason;
- next action;
- last movement timestamp;
- final destination.

For Phase 0, QR labels are useful but not mandatory if a human-readable ID and fast location update are reliable.

---

# 8. Signage and visual control recommendation

Use simple, non-ambiguous labels.

### RED
**UNASSESSED / UNWIPED — RESTRICTED**  
No sale. No donation. No ordinary recycling release. No home LAN.

### AMBER
**WORK IN PROGRESS**  
Sanitisation / test / repair incomplete.

### GREEN
**CLEARED / RELEASED**  
Data state resolved. Final QA/reuse route controlled.

### BLUE or neutral
**OUTBOUND / RETURN**  
Named destination required.

Colour is only a secondary cue. The text and asset record are authoritative so the system remains usable for colour-vision differences and when labels are printed monochrome.

---

# 9. What not to buy yet

The research does **not** justify buying warehouse-style infrastructure before the shed and pilot are proven.

Do not buy yet purely to imitate enterprise operators:

- commercial cages/stillages;
- pallet racking;
- pallet jack;
- industrial battery cabinet without competent site-specific advice;
- CCTV system solely so the business can claim “secure facility”;
- multiple wiping benches;
- dedicated shredding/destruction equipment;
- weighbridge/scales for tonnage operations;
- large quantities of shelving;
- public drop-off bin;
- industrial extraction/processing equipment.

Cheap useful items **after the premises itself is cleared** may include:

- strong labelled shelving;
- lockable restricted cabinet;
- asset labels/label printer;
- lidded parts tubs;
- ESD-safe bench basics;
- safe lighting;
- appropriate smoke/fire controls following competent advice;
- simple signage;
- network isolation/segmentation equipment already justified by the data SOP.

---

# 10. What the Dubbo operation should deliberately do differently from a warehouse

| Warehouse operator | Dubbo Phase 0 |
|---|---|
| truck/pallet receival | booked handoff, one small batch |
| weighbridge | count + asset IDs; weight only where useful |
| secure warehouse | dry/secure shed only after gate closure |
| multiple staff areas | one operator, explicit bench states |
| separate wipe/testing stations | one controlled bench with reset protocol |
| hundreds/thousands of assets | 12-device initial total WIP cap |
| large parts inventory | bounded labelled bins |
| public/corporate bins | pre-screened appointment intake |
| industrial processing | external downstream partner |
| enterprise certification | honest internal evidence; no unsupported certification claims |
| 24/7 operations | Tuesday/Saturday controlled processing/intake model |

The small operation can be **more disciplined than its size suggests** without pretending to possess enterprise security infrastructure or certifications.

---

# 11. Concrete setup sequence

## Before placing business inventory in the shed

1. Resolve current moisture/water/mould suitability.
2. Confirm the exact work/storage area under the premises/lease/landlord position.
3. Obtain insurer response for the described scope.
4. Draw a measured shed plan including door, exit path, power, windows, shelving, bench and any unusable/damp area.
5. Mark the visitor boundary.
6. Decide where the restricted cabinet can actually be secured.
7. Confirm charging/fire/emergency controls with appropriate advice.
8. Confirm downstream routes before accepting their streams.

## Then physically mark Phase 0

1. Label Zones A–H.
2. Enter the same locations in AssetFlow.
3. Set WIP caps.
4. Put no stock in the zones yet.
5. Run a synthetic drill with personally owned/authorised equipment.
6. Simulate:
   - normal accept;
   - full unwiped zone;
   - failed wipe;
   - MDM lock;
   - repair abandoned;
   - sale-ready release;
   - downstream pickup;
   - discovered battery hazard.
7. Reconcile every physical asset to AssetFlow.
8. Fix the flow before accepting a real pilot batch.

---

# 12. Recommended next repository/premises action

The next missing artifact is no longer “what should the zones be?” It is:

> **A measured, photo-backed private shed map that assigns the canonical A–H zones to actual shelves, bench positions and access paths.**

Because the repository is public, do not commit the home address, identifiable property-security details, key/lock details or photographs that reveal private access/security information. Keep the exact plan in a private working record if necessary, and commit only a sanitised layout/capacity version.

The plan should record:

- internal dimensions;
- doors/exits;
- dry/usable area;
- excluded damp/mould area;
- bench;
- power points;
- fixed shelving;
- lockable restricted position;
- clean sale-ready shelving;
- parts bins;
- outbound position;
- charging position if approved;
- emergency access/no-storage area;
- per-zone maximum count/weight based on the real furniture and advice.

---

# 13. Research limitations

Public company websites show service architecture, security promises and high-level processing steps. They rarely expose:

- exact warehouse floor plans;
- exact cage/shelf capacities;
- internal CCTV coverage maps;
- restricted-room access lists;
- specific fire compartmentation;
- repair-bench layout;
- WIP ageing limits;
- labour thresholds;
- detailed insurer requirements.

Those details should not be invented.

The recommendations in this report are therefore a controlled synthesis of published operator practice, R2/SERI guidance, Australian stewardship/compliance practice and NSW safety guidance, scaled down to the current Dubbo Phase 0 model.

They do not establish:

- planning approval;
- lawful waste-facility classification;
- lease permission;
- insurance cover;
- fire-engineering adequacy;
- electrical compliance;
- R2 or AS/NZS 5377 certification;
- permission to store damaged batteries;
- permission for public drop-off.

---

# 14. Sources checked

**Australian operators**

- Bendigo E-Waste — https://www.bendigoewaste.com.au/
- Bendigo E-Waste accepted streams — https://www.bendigoewaste.com.au/services-7
- Bendigo E-Waste history — https://www.bendigoewaste.com.au/about-1
- FlipTech bins — https://www.fliptech.com.au/bins
- FlipTech data-security controls — https://www.fliptech.com.au/articles/8e4e2ca7-22e2-4d68-bf22-d0420c297db4
- WorkVentures decommissioning — https://workventures.com.au/decommissioning/
- WorkVentures e-waste — https://workventures.com.au/e-waste/
- WorkVentures refurbishment — https://workventures.com.au/refurbishment/
- EraseIT decommissioning/quarantine — https://www.eraseit.com.au/equipment-decommissioning/
- EraseIT facilities — https://www.eraseit.com.au/about-us/
- Greenbox asset recovery — https://www.greenbox.com.au/services/asset-recovery/
- Greenbox FAQ — https://www.greenbox.com.au/faqs/
- Sircel process — https://sircel.com/how-we-work/our-process/
- Sircel services — https://sircel.com/services/
- Sircel ITAD — https://sircel.com/services/itad-asset-recovery-repurposing/
- CompNow SustainIT buyback — https://www.compnow.com.au/it-knowledge-base/laptop-buyback-offer/
- CompNow lifecycle — https://www.compnow.com.au/capabilities/lifecycle-management/
- PonyUp services — https://www.ponyupforgood.com/our-services
- PonyUp data security — https://www.ponyupforgood.com/partners-data-security
- PonyUp FAQ — https://www.ponyupforgood.com/faq
- Reconnect donation/repair flow — https://thereconnectproject.com.au/donate/
- Close the Loop IT refurbishment/ITAD — https://closetheloop.com.au/it-refurb

**Standards / regulators / stewardship**

- SERI R2v3 sanitisation-plan guidance — https://sustainableelectronics.org/knowledge-base/guidance-for-developing-an-r2v3-data-sanitization-plan-version-1/
- SERI Appendix B applicability — https://sustainableelectronics.org/knowledge-base/r2v3-appendix-applicability-guidance/
- ANZRP compliance model — https://www.anzrp.com.au/about/compliance/
- SafeWork NSW lithium-ion battery guidance — https://www.safework.nsw.gov.au/hazards-a-z/lithium-ion-batteries
- NSW Small Business Commissioner lithium battery safety — https://www.smallbusiness.nsw.gov.au/news-podcasts/news/lithium-ion-battery-safety-what-small-businesses-need-to-know
- Fire & Rescue NSW fire-safety guidance index — https://www.fire.nsw.gov.au/fire-safety/building-fire-safety/publications/guidelines-and-technical-information
- NIST SP 800-88 Rev. 2 — https://csrc.nist.gov/pubs/sp/800/88/r2/final
