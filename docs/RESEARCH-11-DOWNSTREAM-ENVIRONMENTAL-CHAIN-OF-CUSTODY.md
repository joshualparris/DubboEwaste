# Research 11: Downstream environmental chain of custody

**Research date:** 2 October 2026 (AEST)

**Gap covered:** `codexGAPS.md` section 14: proving the destination, treatment, recovery and environmental outcome of material that is not reused.

**Status:** this is an operating and evidence framework. It does not claim that any particular recycler, council facility, transport route or certification is available to DubboEwaste until the current written acceptance terms are obtained and checked.

## Executive decision

DubboEwaste should treat every item as having two separate decisions:

1. **Can it safely and lawfully remain in the operation while its next route is arranged?**
2. **What documented outcome will occur after it leaves?**

The second answer must be one of `reuse`, `repair`, `parts harvest`, `material recovery`, `destruction`, `return to owner`, or `refusal`. “Recycled” is not a sufficient outcome label. A public drop-off point proves that a service exists; it does not prove that DubboEwaste may use it for commercial loads, that the recipient accepts the exact material, or that the final processor will issue a certificate.

For the first pilot, accept only streams with a pre-identified outlet and a documented cap: saleable whole devices, small parts lots, ordinary household batteries within the receiving program, and ordinary computer/TV e-waste that the receiving facility confirms it accepts. Hold or refuse unknown liquids, damaged lithium batteries, loose hazardous components, business loads, CRTs, large lead-acid quantities and mixed loads until the correct licensed route is confirmed.

## 1. What the current primary sources establish

### 1.1 Dubbo has local public household routes, not an automatic commercial handoff

Dubbo Regional Council lists e-waste as items powered by a cord or battery and directs residents to Council waste depots; it also warns against kerbside bins. The Council’s facility page lists e-waste, old TVs and domestic quantities of household and car batteries at Whylandra and Wellington, with small drop-off cabinets for household batteries, phones/accessories, smoke detectors and ink cartridges. These are useful local reference points, but the pages do not grant a private operator an unlimited commercial intake entitlement or specify every downstream processor.

The working rule is therefore: record the exact facility, date, material, quantity, staff confirmation and any fee before using a council route for operational stock. Do not advertise “free recycling” based only on a resident-facing page.

### 1.2 Batteries are a fire and regulatory boundary

NSW EPA says a battery can spark a fire in collection and processing; it directs users to tape loose terminals, keep them in a ventilated glass container and use an appropriate collection point. SafeWork NSW says lithium-ion batteries can cause fires during collection, transport, handling and processing, and that procedures should cover storage, charging, transport and disposal.

The EPA also distinguishes categories: small loose batteries, larger removable household batteries, embedded batteries, mobile-phone batteries and lead-acid batteries. Lead-acid rules include licensing thresholds for transport and off-site storage, and interstate movement is trackable. This is enough to require a separate battery register and escalation path; it is not enough to infer that every battery can be placed in a general e-waste cage.

### 1.3 Trackable waste and licensed facilities must be checked before transport

The NSW EPA hazardous-waste public register says trackable waste can require a consignment authorisation and that licensees may have additional restrictions or refuse waste from external businesses. The register should be used to identify candidate transporters and receiving facilities, followed by direct confirmation of the exact material, quantity, source and business status.

### 1.4 NTCRS access and NTCRS recycling are different claims

The Australian Government’s National Television and Computer Recycling Scheme (NTCRS) gives households and small businesses access to collection and recycling for televisions, computers, printers, computer parts and peripherals. It supplements state, territory and local-government services.

For recycling under the NTCRS, DCCEEW says co-regulatory arrangements must use service providers certified to AS 5377 for safe and environmentally sound collection, storage, transport and treatment. This does not mean every local drop-off site is an AS 5377-certified recycler, nor that a small operator can describe its own sorting or resale as NTCRS recycling. Use scheme language only when the receiving arrangement confirms it in writing.

### 1.5 Environmental claims need a defined boundary

The strongest defensible claim for a pilot is narrow: “This item was transferred on [date] to [named receiving entity] under [accepted stream], with [weight/count] recorded and [receipt/certificate] retained.”

Do not claim percentage recycled, landfill avoided, carbon saved, material recovered, ethical export or certified destruction without a source document that supports the exact claim. A council acceptance page, a recycler logo, or a photograph of a full pallet is not mass-balance evidence.

## 2. Route taxonomy and proof required

| Route | Meaning | Minimum proof before handoff | Minimum proof after handoff |
|---|---|---|---|
| Reuse | Whole item transferred for continued use | recipient, purpose, title and data status | handoff record; recipient confirmation where appropriate |
| Repair | Item goes to a named repairer for return to service | repair scope, ownership and liability | repair result, parts/labour record, return or sale decision |
| Parts harvest | Device is intentionally dismantled for identified parts | safe dismantling boundary and parts destination | part IDs or a weighed residual record |
| Material recovery | Item is sent to a facility for processing into materials | facility accepts exact stream and quantity | receipt, weight/category and downstream statement if available |
| Destruction | Device/media is rendered unusable | authorised owner and method | certificate or signed destruction record |
| Return to owner | Item is declined or returned | owner identity and reason | dated handoff acknowledgement |
| Refusal | Intake does not occur | refusal reason and safe advice | no custody created |

“Sent to recycler” is an activity, not an outcome. The record must say which taxonomy row applies.

## 3. Downstream source register

Create one record per receiving entity, not one record per website:

```text
downstream_id
legal_name
trading_name
ABN/ licence or certification identifier (where relevant)
facility_address
contact_name and role
phone/email
material_streams accepted
excluded items and condition limits
minimum/maximum quantity
commercial vs household acceptance
fees, rebates or transport terms
data-destruction capability and evidence
battery/CRT/toner/lead-acid rules
certificate or receipt fields
claimed certification and issuing body
last verified date
source URL/document and captured version/date
verification status: lead / contacted / written / tested / expired
next review date
owner of the relationship
```

A route is `written` only when an authorised contact confirms the relevant material and terms. A web page remains `lead` or `public-information-only` unless it expressly applies to the proposed load.

## 4. Handoff packet for each load

Every outbound load should have a packet that can be reconstructed without memory:

1. source asset IDs and item count;
2. route decision and reason;
3. condition and hazard flags;
4. battery/toner/CRT/lead-acid count or weight;
5. data status and sanitisation evidence;
6. owner/title authority;
7. destination record and acceptance confirmation;
8. transporter, vehicle and date where relevant;
9. pre-handoff photos or weight ticket;
10. receiving signature, receipt, certificate or rejection notice;
11. unresolved remainder and next action;
12. claim language approved for public reporting.

For mixed loads, keep the stream-level quantities separate. A single “one pallet e-waste” line is not adequate evidence if it combines reusable devices, batteries, CRTs and scrap.

## 5. Acceptance matrix for the pilot

| Stream | Pilot posture | Gate |
|---|---|---|
| Working whole computers, phones and peripherals | accept for triage/reuse | title, data route, safe power-on, pre-identified sale/donation route |
| Non-working ordinary computer/TV e-waste | limited accept | named receiving facility confirms business quantity and condition |
| Small loose household batteries | limited accept | terminals protected; container and capacity recorded; receiving route confirmed |
| Embedded-battery devices | accept only with device route | no crushing, puncturing or unsafe removal; isolate damaged units |
| Swollen, hot, leaking, smoking or physically damaged lithium battery | refuse/incident route | isolate only if safe; seek expert/regulator/fire guidance; do not test or ship |
| Car/lead-acid batteries | controlled only | quantity, storage, transport and licensing requirements checked |
| CRT displays/TVs | controlled only | exact facility acceptance, handling and fee confirmed |
| Toner, fluorescent lamps, chemicals and unknown liquids | refuse initially | identify product and licensed route before custody |
| Mixed business load | no automatic acceptance | written source authority, inventory and downstream terms |
| Unidentified loose boards/cables | limited parts route | safe storage, contamination check, expected value and residual outlet |

This is an operational screening rule, not a substitute for NSW EPA, SafeWork NSW, council, insurer or licensed-receiver advice.

## 6. Downstream due-diligence scorecard

Score each candidate 0, 1 or 2:

- 0 = unknown, refused, expired or contradicted;
- 1 = public claim or informal answer, not enough for a load;
- 2 = current written evidence for the proposed stream.

| Field | Question |
|---|---|
| Legal identity | Who exactly receives the material and where? |
| Stream scope | Does the written acceptance name this item type and condition? |
| Quantity scope | Is the proposed count/weight and commercial status covered? |
| Safety | Are battery, CRT, toner, damaged-device and packaging rules explicit? |
| Licence | Is a licence, certification or exemption required and current? |
| Transport | Who may move it, and are tracking/consignment rules triggered? |
| Data | Can the receiver accept data-bearing devices, and what evidence is returned? |
| Outcome | Is the next processor or material outcome described? |
| Evidence | Will a receipt state date, category, quantity/weight and destination? |
| Economics | Are fees, minimums, rebates and rejected-load costs known? |
| Continuity | Is there a backup route if the facility closes or rejects a load? |
| Claims | What can be said publicly without overstating the outcome? |

Require 2 on legal identity, stream scope, safety, transport, outcome and evidence before a normal pilot handoff. Any 0 in safety, licence or acceptance is a hold/refuse result.

## 7. Local Dubbo route-verification procedure

For a proposed route:

1. capture the public page/PDF and date;
2. call the named facility or council contact;
3. identify DubboEwaste as a business/operator, not a household resident;
4. describe the exact stream, condition, quantity and packaging;
5. ask whether the facility accepts it from an external business;
6. ask for current fees, booking, quantity limits and rejected-material rules;
7. ask what receipt or certificate is issued;
8. record the staff member, date and written follow-up;
9. run one small test load;
10. reconcile what was accepted against what was promised;
11. set an expiry/review date.

If the contact will not confirm the route in writing, classify it as `contacted`, cap the load to the lowest-risk amount, or do not use it. Do not create a public partnership claim from a phone conversation.

## 8. Mass-balance and impact ledger

For every outbound batch, maintain:

```text
batch_id
source_asset_ids
received_count / received_weight
reuse_count / reuse_weight
repair_count
parts_harvest_count / weight
material_recovery_weight
battery_weight by chemistry/category where known
CRT/toner/other controlled weight
residual_weight
destination_id
handoff_date
receipt/certificate reference
rejected_weight and reason
unresolved_weight
```

The reconciliation check is:

`received weight = reuse + repair inventory + parts + material route + controlled route + residual + unresolved weight`.

Do not force the numbers to balance by inventing a destination. Keep an `unresolved` bucket and investigate it before publishing an environmental percentage.

## 9. Incident, rejection and recall procedure

Create a linked incident record when a receiver rejects a load, a battery changes condition, a device is found to contain unexpected data, a package is damaged, or a certificate does not match the load.

Record:

- asset/batch ID;
- time and location;
- people present;
- immediate isolation or emergency action;
- photographs if safe;
- material and suspected hazard;
- receiver/regulator/insurer contact;
- whether any transport or public claim is paused;
- corrective action and owner;
- final disposition and review date.

If a load is rejected, quarantine the rejected portion, preserve the rejection notice, recalculate the mass balance and suspend that route until the acceptance rule is clarified. Never blend a rejected load into another stream merely to clear storage.

## 10. Practical open/free tools

- **CSV/LibreOffice Calc:** first-stage route register and batch ledger; use validation lists and protected formula columns.
- **SQLite:** reliable local event and mass-balance store once multiple batches or concurrent editing make CSV unsafe; use a backup/export test.
- **Barcode/QR labels:** encode only the internal asset or batch ID, not names, addresses or data-bearing notes.
- **Phone camera:** capture label, condition, packaging and receipt evidence; store filenames linked to IDs and exclude private content from public exports.
- **Public registers and official webpages:** source discovery only; record page date and verify directly.
- **Digital scales:** use one scale consistently, record tare and units, and retain a photo or ticket for controlled loads.

The tools are not evidence by themselves. The evidence is the linked record, source, acceptance confirmation and receiving document.

## 11. Research and pilot actions

### Before accepting material

- create a route record for Council/CRC, one AS 5377-certified NTCRS pathway candidate and one commercial downstream candidate;
- confirm whether each accepts business-origin material and the exact categories;
- write the refusal list on the intake form;
- buy/prepare labelled battery containers and a scale only after the safe storage route is approved;
- set a maximum on-site count and maximum days awaiting downstream.

### During the first ten batches

- weigh and photograph each non-reuse stream;
- use one batch ID per destination and date;
- obtain a receipt every time;
- log rejections and unexplained weight;
- calculate labour, travel, fees and storage days;
- review the route after batch 1, 3, 5 and 10.

### Continue only if

- zero uncontrolled battery incidents;
- 100% of controlled outbound loads have an acceptance record;
- unresolved weight is below the agreed threshold and trending down;
- no receiver has rejected material for a condition that the intake form should have caught;
- the route remains economically and operationally repeatable.

## 12. Open questions that require direct confirmation

- Which named facility receives Dubbo Regional Council’s e-waste after collection, and what evidence is available to a business operator?
- Does any local facility accept commercial or mixed loads from a small refurbisher, and at what fee/quantity limit?
- Which NSW EPA licence or tracking rules apply to the proposed volumes of batteries, CRTs and other controlled streams?
- Which receiving entity can issue a weight/category/date receipt rather than only a generic docket?
- Which downstream partner accepts pre-sorted reusable devices and rejects only residuals?
- What insurance, fire and premises controls are required before storing damaged or embedded-battery devices?
- What exact public environmental claim can be supported after ten reconciled batches?

## 13. Sources consulted

- [Dubbo Regional Council A–Z recycling](https://www.dubbo.nsw.gov.au/Households-Residents/Rubbish-Recycling-and-Sustainability/Domestic-Waste-Services/a-z-recycling)
- [Dubbo Regional Council waste facilities and CRC limits](https://www.dubbo.nsw.gov.au/Households-Residents/Rubbish-Recycling-and-Sustainability/council-waste-facilities)
- [NSW EPA: Never bin a battery](https://www.epa.nsw.gov.au/Your-environment/Recycling-and-reuse/never-bin-a-battery)
- [NSW EPA: licensing and training for dangerous goods](https://www.epa.nsw.gov.au/Your-environment/Dangerous-goods/licensing-training)
- [NSW EPA: waste lead-acid batteries](https://www.epa.nsw.gov.au/Your-environment/Waste/industrial-waste/lead-acid-batteries)
- [NSW EPA hazardous-waste public register](https://app.epa.nsw.gov.au/PRHWapp/ReceivingFacilityAndTransporter.aspx)
- [SafeWork NSW: lithium-ion batteries](https://www.safework.nsw.gov.au/hazards-a-z/lithium-ion-batteries)
- [DCCEEW: National Television and Computer Recycling Scheme](https://www.dcceew.gov.au/environment/protection/waste/product-stewardship/television-computer-recycling-scheme)
- [DCCEEW: information for NTCRS recyclers and AS 5377](https://www.dcceew.gov.au/environment/protection/waste/product-stewardship/products-schemes/television-computer-recycling-scheme/recyclers)
- [DCCEEW: approved NTCRS co-regulatory arrangements](https://www.dcceew.gov.au/environment/protection/waste/product-stewardship/products-schemes/television-computer-recycling-scheme/coreg-arrangements)
- [Research 06: battery, electrical and workshop safety](RESEARCH-06-BATTERY-ELECTRICAL-WORKSHOP-SAFETY.md)
- [Research 09: inventory system of record](RESEARCH-09-INVENTORY-SYSTEM-OF-RECORD.md)

This report is operational research, not legal, environmental, dangerous-goods, insurance or fire-safety advice. Confirm the current requirements with the relevant regulator, council, insurer and receiving facility before taking a controlled stream.
