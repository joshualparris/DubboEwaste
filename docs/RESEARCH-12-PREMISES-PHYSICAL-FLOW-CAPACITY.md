# Research 12: Premises, physical flow and capacity

**Research date:** 2 October 2026 (AEST)

**Gap covered:** `codexGAPS.md` section 15: proving that a home or small workshop can safely receive, isolate, test, store and dispatch equipment without turning into an uncontrolled waste pile.

**Status:** design and measurement framework. It is not confirmation that the present residence, lease, insurer, council approval, fire controls or waste permissions are adequate.

## Executive decision

Start with a **no-public-drop-off, appointment-only, low-volume** model. The first premises experiment should accept only pre-screened items, keep customer traffic outside private areas, and use labelled shelves and a one-way flow. A device should never be simultaneously “unwiped,” “sale-ready,” and “awaiting disposal” in the same physical location.

The capacity limit is the smallest of:

- safe shelf/bin capacity;
- insurer or landlord limit;
- planning/amenity limit;
- downstream batch capacity;
- available owner labour;
- data-security capacity;
- battery and fire-control capacity.

Do not use floor area or a full garage as the capacity calculation. Use labelled positions with a maximum item count and a maximum number of days in each state.

## 1. Current planning and WHS boundary

NSW guidance describes a home business as work carried on in a dwelling or an ancillary building such as a garage or studio. Some low-impact home businesses may be exempt from council approval, but the exemption depends on conditions including people, floor area, noise, fumes, dust, waste, traffic and local environmental-plan requirements. Online sales of goods not produced on site can be included in the home-business category, but that does not answer whether receiving, storing, dismantling or transporting e-waste creates a different impact.

If the residence is rented, NSW Small Business Commissioner guidance says the lease, landlord/body-corporate permission and possible bond/property impacts must be checked. A business should not assume that online selling permission equals permission to store customer devices, batteries or waste.

SafeWork NSW treats a sole trader or other business as a PCBU and requires hazards to be identified, risks assessed and controls implemented. Its guidance specifically includes the workplace, plant, visitors, training, emergency plans and the need to manage risks so far as reasonably practicable. A residence used for business can therefore become a workplace for the relevant activity.

These sources establish a need to check the exact activity and premises; they do not decide whether this particular operation is approved. Contact Dubbo Regional Council planning, the landlord/body corporate, insurer and relevant regulator before public intake or storing controlled streams.

## 2. Zone design

Use a visible label and a capacity for every zone:

| Zone | Purpose | Access | Maximum state |
|---|---|---|---|
| A — arrival | photo, ID, source authority, hazard screen | operator only | same day or return/refuse |
| B — unwiped | devices containing possible data | restricted | until sanitisation decision |
| C — test queue | safe power and diagnosis | operator only | one labelled tray per batch |
| D — repair | authorised repair work | operator only | active work orders only |
| E — sale-ready | sanitised, tested, disclosed items | controlled | listing cap and expiry |
| F — parts/donor | stripped parts and donor devices | controlled | bin count and residual route |
| G — battery quarantine | abnormal or awaiting advice | no charging | incident/destination time limit |
| H — rejected/return | owner return or refusal | restricted | short deadline |
| I — outbound | packed by destination | operator only | dispatch date |
| J — records | forms, labels, backups | restricted | no loose personal data |

Use physical separation between B and E. Use separate containers for batteries and damaged devices. Keep a “no-go” shelf for anything that cannot be safely tested or routed.

## 3. Intake-to-outbound flow

```text
appointment/source record
        ↓
arrival photo + asset ID + ownership/data/hazard screen
        ↓
accept / refuse / hold for advice
        ↓
unwiped quarantine → sanitisation record
        ↓
safe test → repair / resale / donation / parts / downstream
        ↓
labelled shelf with expiry date
        ↓
dispatch packet + receipt + mass-balance update
```

The physical item and digital record must change state together. If an item moves without a scan or written event, treat its status as unknown and hold it.

## 4. Capacity model

For each zone, record:

```text
zone_id
shelf/bin IDs
usable positions
maximum item count
maximum safe weight
maximum days in state
hazard restrictions
owner of daily check
overflow action
```

The operating cap should be set before accepting the first batch:

`cap = min(physical positions, downstream capacity, safe labour capacity, approved storage limit)`.

Example: if there are 20 sale-ready positions but only five devices can be tested and listed per week, the cap is not 20 sale-ready items indefinitely; it is the number that can clear within the expiry rule without blocking intake.

Use a red/amber/green board:

- **Green:** below 70% of a zone cap and all items have current records;
- **Amber:** 70–90%, pause low-value intake and schedule a dispatch/return day;
- **Red:** above 90%, stop intake for that route and clear stock before accepting more.

Do not count an unsafe battery quarantine area as normal storage capacity.

## 5. Daily open and close controls

### Open

- inspect for heat, smell, smoke, swelling, leaks, water and trip hazards;
- confirm battery quarantine is isolated and labelled;
- check chargers, power boards and test leads for damage;
- verify the clean bench is free of unwiped devices;
- reconcile yesterday’s open items against the inventory system;
- check emergency access and exits;
- record temperature/ventilation observations where relevant.

### Close

- power down test equipment and unplug non-essential chargers;
- isolate all active repair jobs;
- move data-bearing devices to the restricted zone;
- secure keys, records, labels and backups;
- confirm no battery is charging unattended;
- remove packaging and keep aisles/exits clear;
- photograph or sign the zone board;
- record incidents, rejected items and next-day actions.

## 6. Safety controls to validate

- clear walkways, stable shelving and a safe lifting method;
- no stacking that can fall or hide a swollen battery;
- adequate lighting and ventilation for inspection and cleaning;
- ESD precautions where electronics are opened;
- eye protection and suitable gloves for specific tasks;
- isolation of damaged lithium batteries and no improvised puncture/crush tests;
- no customer access to the workshop or unwiped zone;
- fire/emergency equipment appropriate to the premises and insurer advice;
- first-aid and incident contacts visible;
- no food, children, pets or personal items in work zones;
- chargers and power boards used within manufacturer and electrical-safety limits;
- dust and e-waste residues cleaned without spreading contamination.

The operator should make a written task risk assessment for intake, power-on testing, opening cases, battery handling, data wiping, packing, vehicle loading and customer handoff. A generic “be careful” note is not a control.

## 7. Appointment and visitor boundary

The safest first model is collection by appointment or delivery to a neutral partner, not unscheduled public entry. Before a handoff, record:

- what the visitor is bringing;
- whether the item is data-bearing or battery-bearing;
- approximate count and size;
- who owns it and who may transfer it;
- where the handoff occurs;
- whether the device is accepted, refused or held;
- the return/refusal process.

If customer visits become routine, assess traffic, parking, accessibility, privacy, children/pets, insurance and the risk of a visitor entering the workshop. A public-facing premises is a different operating model from a home-based online refurbisher.

## 8. Evidence pack before scaling

Keep these documents together:

1. property/lease and landlord or body-corporate permission, if relevant;
2. council planning response or documented exemption assessment;
3. insurer’s written description of stock, business activity and battery/e-waste exposure;
4. WHS risk assessment and emergency plan;
5. zone map and capacity table;
6. downstream acceptance records and refusal list;
7. equipment inspection and maintenance log;
8. incident and injury register;
9. daily close-down checklist;
10. inventory export and backup/restore test;
11. review date and scale-up trigger.

This pack is evidence of due diligence, not a substitute for an approval or licence that the regulator says is required.

## 9. Scale gates

### Gate 0 — private bench

No public drop-off. Process five to ten known-authority items. Prove IDs, data state, safe test, route and close-down.

### Gate 1 — controlled pilot

Accept one small scheduled batch from a named source. Prove the zone flow, capacity cap, downstream handoff and incident procedure. No hazardous or unknown stream unless separately approved.

### Gate 2 — repeat source

Run three batches with reconciled records, zero uncontrolled battery incidents, no unexplained stock and a clear outlet for residuals. Reconfirm insurer and premises conditions.

### Gate 3 — public or institutional intake

Only after written planning/insurance/regulatory review, a published refusal list, trained second-person coverage where needed, and enough downstream capacity to handle the promised volume.

## 10. Stop conditions

Stop intake immediately when:

- any item is hot, smoking, leaking, swelling or otherwise unsafe;
- the item cannot be linked to an owner/source record;
- a data-bearing item enters sale-ready stock without a sanitisation decision;
- an exit, aisle, fire control or battery area is obstructed;
- a receiving outlet rejects or changes terms;
- the storage cap is reached;
- a visitor/customer cannot be kept out of the restricted zone;
- the activity creates noise, dust, traffic, waste or other amenity impact outside the checked premises assumptions;
- the operator is working alone on a task assessed as requiring assistance.

When stopped, isolate the cause, record it, contact the appropriate advisor and clear existing stock before resuming.

## 11. Measurement experiment

For the first four weeks, record per item:

- minutes in arrival, triage, wiping, testing, repair, listing, packing and travel;
- shelf-days in each zone;
- floor/shelf positions used;
- power/charger faults and incidents;
- number of moves or relabels;
- customer/source visits and access issues;
- downstream rejections;
- whether the next zone was available when needed.

At the end of each week calculate:

- items processed per usable position;
- median days from arrival to final route;
- percentage with complete records;
- percentage that exceeded a zone time limit;
- owner hours per cleared item;
- near misses and incidents;
- overflow or unplanned storage events.

The first premises success criterion is not maximum volume. It is predictable flow with no hidden stock, uncontrolled hazards or private-data exposure.

## 12. Open questions for direct confirmation

- What is the property’s actual usable dry and secure area after excluding exits and private living space?
- Is the planned activity exempt, permitted, or approval-requiring under the Dubbo Regional Council LEP and the exact State policy conditions?
- Does the lease, landlord, body corporate and insurer permit device storage, repair and batteries?
- What quantity and category of e-waste can be held before a different waste, fire, storage or insurance control applies?
- Which tasks require a second person or a separate workshop?
- What is the practical maximum shelf count before the operation becomes unsafe or unprofitable?
- Where can rejected batteries and other controlled items be safely held while advice is obtained?

## 13. Sources consulted

- [NSW Small Business Commissioner: getting approval for a home business](https://www.smallbusiness.nsw.gov.au/help/common-questions/getting-approval-for-a-home-business)
- [NSW Planning Portal: home-based enterprises](https://www.planningportal.nsw.gov.au/development-and-assessment/planning-approval-pathways/exempt-development/home-based-enterprises)
- [Service NSW: work health and safety for business](https://www.service.nsw.gov.au/guide/work-health-and-safety-whs-for-business)
- [SafeWork NSW: managing hazards and risks](https://www.safework.nsw.gov.au/legal-obligations/employer-business-obligations/managing-hazards-and-risks)
- [NSW Small Business Commissioner: running a home business from a rental property](https://www.smallbusiness.nsw.gov.au/help/common-questions/running-a-home-business-from-your-rental-property)
- [NSW EPA: Never bin a battery](https://www.epa.nsw.gov.au/Your-environment/Recycling-and-reuse/never-bin-a-battery)
- [SafeWork NSW: lithium-ion batteries](https://www.safework.nsw.gov.au/hazards-a-z/lithium-ion-batteries)
- [Research 06: battery, electrical and workshop safety](RESEARCH-06-BATTERY-ELECTRICAL-WORKSHOP-SAFETY.md)
- [Research 09: inventory system of record](RESEARCH-09-INVENTORY-SYSTEM-OF-RECORD.md)
- [Research 11: downstream environmental chain of custody](RESEARCH-11-DOWNSTREAM-ENVIRONMENTAL-CHAIN-OF-CUSTODY.md)

This report is operational research, not planning, WHS, electrical, fire, insurance, tenancy or legal advice. Obtain current written advice for the actual premises and proposed activity before scaling.
