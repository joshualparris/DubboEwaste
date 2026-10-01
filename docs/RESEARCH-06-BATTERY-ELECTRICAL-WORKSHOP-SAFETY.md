# Research 06: Battery, electrical and workshop safety

**Research date:** 2 October 2026 (AEST)

**Gap covered:** `codexGAPS.md` section 7: battery quarantine, electrical work, workshop controls, charging, chemicals, soldering, emergency response and product-safety boundaries.
**Relationship to existing research:** this report turns the broader findings in [`BACKLOG-21-25-COMPLIANCE-DATA-SAFETY.md`](BACKLOG-21-25-COMPLIANCE-DATA-SAFETY.md) into a Phase 0 operating boundary. It does not replace a site-specific WHS risk assessment, insurer confirmation, licensed electrical advice or emergency-services advice.

## Executive decision

Phase 0 should be a **low-voltage, healthy-battery, no-mains-repair lane**:

- accept ordinary laptops, phones, tablets, desktops and peripherals only after a visual battery/safety screen;
- do not advertise loose-battery collection or damaged-battery handling;
- do not charge, test, dismantle or ship visibly swollen, leaking, crushed, punctured, wet, overheated, smoking, recalled or fire-affected lithium devices;
- do not open mains power supplies, alter mains wiring, repair plugs/leads, or perform work that falls within licensed electrical work without a licensed person;
- do not use a damp, dusty, chemically contaminated or poorly ventilated shed as a workshop until its suitability is assessed;
- defer CRT dismantling, e-bike/e-scooter batteries, solar/storage batteries, large UPS batteries, unknown industrial batteries and board-level hot-air work;
- make the premises, insurer, emergency plan, RCD/portable-equipment controls and downstream damaged-battery route pass before public intake.

The most important control is elimination: refuse a hazardous item before it enters the bench. A “fireproof battery box”, extinguisher or online video is not a complete control system.

## 1. Current primary-source findings

### 1.1 NSW second-hand electrical goods

NSW Government states that new and second-hand electrical goods are covered by the Gas and Electricity (Consumer Safety) Act 2017. A second-hand electrical article must have been approved as required when originally sold new, and sellers/suppliers have safety obligations. NSW also describes acceptable quality as including fitness for purpose, acceptable appearance, freedom from defects, safety and durability.

Sources:

- [NSW Government: Buying and using electrical appliances](https://www.nsw.gov.au/housing-and-construction/safety-home/electrical-safety/buying-and-using-electrical-appliances)
- [NSW Government: Selling safe products and electrical products](https://www.nsw.gov.au/business-and-economy/running-a-business/selling-goods-and-services/selling-safe-products)
- [EESS: Second-hand equipment](https://www.eess.gov.au/equipment/second-hand-equipment/)

The EESS says its framework does not apply to second-hand equipment previously sold in Australia that met requirements when first offered, while individual jurisdictions can have additional second-hand requirements. This is not permission to sell any unsafe or unapproved imported item.

**Operating rule:** record the product’s origin/approval clues, condition and safety decision. Do not claim that a CE mark alone proves Australian electrical approval; NSW guidance identifies Australian approval marks as the relevant evidence for goods sold in Australia.

### 1.2 Workplace electrical equipment

SafeWork NSW says a PCBU must manage electrical risks. Plug-in equipment used in a hostile operating environment must be regularly inspected and tested by a competent person; unsafe equipment must be disconnected or isolated until repaired, tested safe, replaced or permanently removed. SafeWork also says RCDs used at a workplace must be tested regularly by a competent person, with records kept between tests.

Sources:

- [SafeWork NSW: Electrical inspection and testing](https://www.safework.nsw.gov.au/hazards-a-z/electrical-and-power/electrical-inspection-and-testing)
- [SafeWork NSW: Electrical risks at the workplace](https://www.safework.nsw.gov.au/resource-library/construction/electrical-services/electrical-risks-at-the-workplace-fact-sheet)
- [Safe Work Australia: Managing electrical risks in the workplace](https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-electrical-risks-workplace)

The relevant question is not “does every used laptop need a test-and-tag sticker?” The questions are:

1. What plug-in equipment is being used by the business?
2. Is the shed environment hostile because of moisture, dust, heat, chemicals, mechanical damage or similar exposure?
3. Who is competent to inspect/test it, at what interval, and what records will prove it?
4. What electrical work is being attempted, and does it require a licensed electrical worker?
5. Are RCDs installed/tested as required for the actual workplace?

### 1.3 Product safety and recalls

NSW Government says goods supplied by a business must be free from defects that could harm consumers, and businesses should check banned products, recalls, mandatory standards and information requirements. It also states that a supplier must report to the Commonwealth Minister within two days if a supplied product has caused or may have caused death, serious injury or illness. Product recalls have their own notification requirements.

Source:

- [NSW Government: Selling safe products and electrical products](https://www.nsw.gov.au/business-and-economy/running-a-business/selling-goods-and-services/selling-safe-products)

**Operating rule:** run a recall/product-safety check before listing items in a category with known battery, charger, power-supply or fire-risk recalls. Save the check date and result in the private asset record. If a sold item is later found unsafe, stop sale, identify affected buyers and obtain professional/regulator advice about notification and recall duties.

### 1.4 Lithium battery hazards

Fire and Rescue NSW describes lithium-ion batteries as energy-dense and capable of thermal runaway, with risks including overcharging, non-compliant chargers, overheating, physical abuse, short circuit and manufacturing defects. It identifies swelling/bulging, leaking, cracks, dents, punctures, crushing, water ingress, overheating, smoke and fire exposure as damaged-battery indicators.

Sources:

- [Fire and Rescue NSW: Battery and charging safety](https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/battery-and-charging-safety)
- [Fire and Rescue NSW: What to do if a battery is damaged](https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/battery-and-charging-safety/what-should-i-do-if-my-battery-is-damaged)
- [Fire and Rescue NSW: Shop, charge and recycle safely](https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/topics/shop-charge-and-recycle-safely)

FRNSW says never charge or use a damaged battery and never place it in regular waste/recycling or ordinary battery-recycling bins. Its damaged-battery guidance distinguishes leaking/damaged but not overheated or off-gassing items from fire/smoke-damaged or overheating items; the latter require an emergency/site-safety response, not casual transport to a collection point.

**Operating rule:** the operator does not improvise a damaged-battery rescue. Follow the current FRNSW emergency guidance, evacuate/call 000 when there is smoke, fire, off-gassing or immediate danger, and obtain the disposal route before moving the item.

### 1.5 Battery transport and shipping

Australia Post limits lithium batteries by chemistry, watt-hour capacity, packaging and whether the battery is installed. Damaged, recalled or non-conforming batteries are prohibited. A device that is safe to sell locally may still be ineligible for a particular postal or courier service.

Source:

- [Australia Post: Dangerous, prohibited and restricted items](https://auspost.com.au/business/shipping/shipping-guidelines/dangerous-prohibited-items)
- [Australia Post: Lithium batteries quick reference guide](https://auspost.com.au/content/dam/auspost_corp/media/documents/lithium-batteries-quick-reference-guide.pdf)

**Operating rule:** shipping is a separate release gate. Record battery state, Wh rating if available, installed/loose status, carrier, service and packaging check. Never post a damaged or recalled battery/device.

### 1.6 Workplace duty and facilities

Safe Work Australia describes a PCBU’s primary duty as ensuring, so far as reasonably practicable, a safe work environment, safe plant and structures, safe systems of work, safe handling/storage of substances, training, supervision and suitable facilities for workers and others affected by the work. Its workplace-environment model code includes lighting, ventilation, emergency plans and safe facilities.

Sources:

- [Safe Work Australia: Duties of a PCBU](https://www.safeworkaustralia.gov.au/law-and-regulation/duties-under-whs-laws/duties-pcbu)
- [Safe Work Australia: Work environment and facilities](https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-work-environment-and-facilities)

**Operating rule:** customer visits, volunteers and helpers count in the risk design. A home shed is not automatically a compliant commercial workshop because the equipment is small.

## 2. Phase 0 accepted and refused lanes

### Accept only after visual safety screen

- laptops, phones and tablets with no visible battery damage;
- desktops, mini PCs and peripherals with intact cases and cords;
- monitors and TVs for local-only routes if panel, stand and power condition are safe;
- low-voltage adapters and chargers with intact insulation, correct rating and appropriate Australian approval evidence where required;
- removable parts only when removal itself is safe and the storage/data route is documented.

### Inspect/quarantine, not bench-test immediately

- battery state cannot be determined;
- device is wet, dirty with unknown contamination, unusually hot, chemically contaminated or smells burnt;
- case is bulging, lifting or cracked around a battery;
- charger is damaged, counterfeit-looking, wrong-voltage, frayed or unidentifiable;
- device has been in a fire, flood or severe impact;
- power supply, UPS or mains section is opened or damaged;
- item is recalled or has an unresolved safety notice;
- donor requests battery removal but the operator lacks the skills, PPE, tools or downstream route.

### Refuse Phase 0

- smoking, off-gassing, actively overheating or flaming batteries/devices;
- swollen, leaking, punctured, crushed, wet/submerged or fire-affected lithium devices;
- loose or damaged lithium batteries;
- e-bike/e-scooter/hoverboard batteries and large battery packs;
- solar/storage batteries, EV batteries and unknown industrial packs;
- CRT dismantling or broken CRT glass;
- mains wiring, plug replacement, PSU repair or other work requiring licensed electrical work;
- unsafe or unapproved imported electrical goods without a verified compliant route;
- any item whose safe storage or approved downstream route cannot be established.

“Refuse” means do not take custody unless a competent specialist/downstream provider has agreed the route. It does not mean putting the device in general waste.

## 3. Battery decision card

At first contact, do not power or charge the device if any red flag is present.

| Check | Green | Red/stop |
|---|---|---|
| Case | intact, no lifting/gap | bulge, lifting trackpad/case, crack over battery |
| Surface | cool/dry | hot, wet, sticky, leaking or chemical residue |
| Odour | normal | solvent, burnt, sweet/chemical or electrical smell |
| Battery | no visible damage | swelling, puncture, dent, crush, corrosion or unknown loose cell |
| History | ordinary use | flood, fire, impact, overheating or recall |
| Charger | correct/intact and identified | frayed, hot, wrong rating, loose or counterfeit concern |
| Sound | silent | hissing, popping, crackling or venting |
| Location | away from exits/combustibles | inside living area, blocked exit or near combustible stock |

If a red condition appears, stop, disconnect power only if safe, keep people away, follow the current FRNSW emergency route and record the incident. Do not carry a hot/smoking device through the building to a generic bin or outside location.

## 4. Quarantine and emergency design

### 4.1 Normal suspicious-but-not-active condition

The site risk assessment should define a designated quarantine location before intake. It should be:

- separated from ordinary stock, exits, vehicles, customer areas and combustible waste;
- accessible to emergency services and not inside a sealed cupboard or occupied living space;
- weather-protected but adequately ventilated where the chosen route requires it;
- signed, access-controlled and capable of keeping the item stable without crushing or stacking;
- supported by a written contact/route to a specialist battery handler or approved waste facility.

Do not specify one generic “fireproof battery bin” as the answer. The correct container, spacing, monitoring and emergency method depend on battery type, condition, quantity, site and advice from fire/WHS/insurer/downstream specialists.

### 4.2 Hot, smoking, off-gassing or fire-affected device

The written emergency card must say:

1. warn people and stop work;
2. move away and evacuate if there is smoke, fire, violent venting or immediate danger;
3. call 000 and state that a lithium battery/device may be involved;
4. do not re-enter or attempt casual transport;
5. only disconnect power or move an item if it is safe and consistent with emergency-services instruction;
6. preserve the area after the incident and follow FRNSW/site-owner directions;
7. record the asset, time, location, symptoms and actions without delaying evacuation;
8. arrange specialist disposal after the site is released.

This is intentionally conservative. FRNSW guidance is the controlling public safety reference; the site-specific plan and emergency-services direction override an informal bench procedure.

### 4.3 After any near miss

Quarantine the batch and stop the activity that caused it. Record:

```text
incident_id, date_time, asset_id, location, people_present,
symptoms, battery/device type, charger/power source,
what happened, immediate actions, injury/damage,
000/FRNSW/SafeWork/insurer contact, disposal route,
root cause, corrective action, restart approval
```

Restart only after the root cause, control and responsible approval are documented.

## 5. Charging and bench power

Phase 0 charging rules:

- charge only healthy devices with an identified compatible charger;
- charge while attended and on a non-combustible, uncluttered surface;
- keep charging away from exits, sleeping/living areas, paper/cardboard stock and flammable liquids;
- do not charge unknown, damaged, swollen, wet or recalled batteries;
- do not daisy-chain power boards or use damaged leads;
- do not charge overnight or while the operator is away until an insurer/WHS-approved system says otherwise;
- record device, charger, start/end time and observed abnormal heat where charging is part of the test;
- stop charging if abnormal heat, smell, noise, swelling or smoke appears;
- use RCD protection and inspect/test workplace equipment as required for the premises and environment;
- ensure a competent person checks the power setup and any electrical installation issue is handled by a licensed electrician.

Do not use a cheap USB tester or bench power supply as a substitute for compatible charging control. A measurement tool can help diagnose a device; it does not make a damaged battery safe.

## 6. Electrical work boundary

The operator may perform only low-voltage diagnostic and modular repair work that is within their demonstrated competence and insurance scope. The following are referral/stop points:

- altering fixed wiring or electrical installations;
- replacing plugs, power cords or mains connectors where the work is regulated;
- opening or repairing mains power supplies, UPS mains sections or high-voltage inverter sections;
- defeating earth, safety interlocks or protective devices;
- working on energised mains equipment;
- modifying a charger or using an unapproved charger to test a device;
- repairing a product where approval/safety characteristics may be changed without qualified assessment.

Before taking customer/public stock, ask a licensed electrician and insurer to define the exact boundary in writing. “It is only a computer” is not a safety classification.

## 7. Workshop controls beyond batteries

### Electrical environment

- inspect roof, walls, floor and benches for water ingress, damp, dust and pests;
- keep leads off walkways and protect them from crushing and trip hazards;
- maintain clear access to exits, extinguishers, switchboard and first aid;
- separate dirty intake, clean bench, data/media hold and released stock;
- keep food/drink away from electronics and chemicals;
- label equipment that is unsafe or awaiting test; isolate it so it cannot be accidentally reconnected.

### ESD

Use ESD controls only after understanding the bench/equipment relationship: grounded mat/strap where appropriate, ESD-safe storage, humidity/housekeeping control and a documented inspection routine. Do not clip a wrist strap to an unknown or unsafe electrical point. ESD controls protect components; they do not protect against mains shock or battery fire.

### Solder, flux and fumes

Phase 0 should defer board-level rework until there is a proper risk assessment, fume extraction, training, eye protection, cleanable bench and insurer approval. Lead/flux residue must not be spread to food or living spaces. Store and dispose of solder, contaminated wipes and waste according to SDS and applicable waste controls.

### Isopropyl alcohol, adhesives and cleaners

- retain the product label and SDS;
- use only the minimum quantity in a ventilated, ignition-controlled area;
- keep containers closed and labelled;
- store away from batteries, chargers, heat and incompatible chemicals;
- use suitable gloves/eye protection based on the SDS;
- do not use solvents on powered equipment or near an ignition source;
- manage contaminated wipes and empty containers as directed by the SDS/local waste route.

### Toner and dust

Do not shake toner cartridges or blow contaminated dust through the room. Keep printer/toner work separate from the clean electronics bench and use the manufacturer/SDS handling advice.

### CRTs

No Phase 0 CRT dismantling. Keep intact units stable, prevent glass impact and use an approved downstream route. Broken CRT glass, leaded components and high-voltage sections need specialist controls; a collector’s interest does not justify casual opening.

## 8. Product release safety checklist

Before listing or donating a mains-powered or battery-powered item, confirm:

- identity and provenance recorded;
- recall/product-safety search completed;
- no visible battery damage;
- charger/adapter correct, intact and included condition stated;
- case, cable, plug, insulation and ports visually safe;
- applicable Australian approval/marking evidence considered;
- functional test completed without unsafe behaviour;
- battery health/condition disclosure recorded;
- data and account-lock gates passed;
- intended channel’s shipping restrictions checked;
- defects and limitations disclosed in plain language;
- evidence pack linked to the asset;
- insurer/business/legal review completed for the lane.

If any safety item is unknown, use `HOLD-SAFETY` rather than guessing.

## 9. Low-cost/open-source support tools

Tools do not replace training or controls, but a Phase 0 can use free or open tools for evidence:

| Need | Suitable tool/process | Control |
|---|---|---|
| Asset log | CSV/LibreOffice Calc or local SQLite | fake-data test first; encrypted storage; no public serials |
| Temperature observation | manufacturer diagnostics or a non-contact thermometer | never rely on a reading to override swelling/smoke/odour |
| Electrical test record | competent-person equipment and signed record | do not improvise a legal test-and-tag regime |
| Incident record | Markdown/CSV template plus immutable export | restrict access; preserve original facts |
| SDS register | local PDF folder with product/expiry review | keep chemicals labelled and closed |
| Recall check | Product Safety Australia and manufacturer pages | save date, model and result |
| Battery shipping check | carrier’s current dangerous-goods page | check per service and destination |
| ESD/bench checklist | printed or local Markdown checklist | inspect grounding and safe connection separately |

Avoid unmaintained “battery fire database” scripts, cloud uploads of donor photos, or online diagnostic services that receive personal data. Any tool that touches a device must be assessed for data exposure in accordance with Research 05.

## 10. Pre-launch validation and drills

Before public intake, complete and retain evidence for:

1. premises inspection: damp, dust, ventilation, exits, power, storage, lighting and customer access;
2. insurer review of the exact activities: receiving, testing, charging, opening, cleaning, soldering, storing and selling;
3. licensed electrician review of the bench power/RCD/extension setup;
4. competent-person inspection/testing plan for workplace plug-in equipment;
5. battery red-flag training using photographs or inert examples, not live damaged cells;
6. normal quarantine drill using a healthy device labelled “hold”;
7. emergency tabletop drill for smoke/off-gassing, with evacuation and 000 call script;
8. data/identity hold drill using a locked test device;
9. product recall/unsafe-item withdrawal drill;
10. downstream confirmation for healthy embedded-battery devices and a separate route for damaged/failed batteries;
11. packaging/shipping check for healthy batteries under the chosen carrier’s current rules;
12. waste and chemical cleanup drill.

Pass criteria:

- every helper can stop work and call the responsible person;
- no one moves or charges a red-flag battery as part of a drill;
- exits and emergency equipment remain accessible;
- no unknown device is connected to the home network or charging bench;
- the asset record distinguishes `healthy`, `hold`, `damaged`, `emergency` and `released`;
- the insurer/electrician/WHS questions have written answers or an explicit launch blocker;
- the downstream route accepts the exact classes of item the pilot intends to take.

## 11. Open questions requiring written answers

- Will the insurer cover the exact home/shed premises and activities, including customer visits, helpers, charging, lithium devices, soldering, chemicals and sale of refurbished goods?
- Is the proposed premises classified and approved for the intended business activity and storage?
- Which electrical work can the operator legally perform, and what must be referred?
- What inspection/testing and RCD regime applies to the actual environment?
- Which local provider accepts healthy embedded-lithium devices, and which accepts damaged batteries/devices?
- What is the emergency-service and insurer preferred response for a hot, leaking, smoking or fire-affected device at the site?
- What fire detection, separation, ventilation and monitoring controls are required by the actual risk assessment?
- What records, training and PPE are required for solder, lead, flux, alcohol, toner, dust and CRT refusal?
- What product-safety/recall checks are required for the chosen categories?
- What evidence of approval/marking should be retained for second-hand mains-powered goods?

Do not fill these gaps with assumptions from a different state, commercial facility or online video.

## 12. Recommended Phase 0 operating policy

Until the open questions are answered in writing:

- no public battery drop-off;
- no loose or damaged lithium;
- no e-bike/e-scooter, solar, EV, large UPS or industrial battery;
- no overnight/unattended charging;
- no mains electrical repair or modification;
- no CRT opening;
- no board-level rework;
- no customer access to the working bench;
- no device accepted without a safe storage and downstream route;
- no claim that a product is “electrically tested”, “certified”, “safe” or “NIST sanitised” unless the exact evidence supports that wording.

This deliberately limits the launch lane. The restriction can be relaxed only after the premises, insurer, competent-person and specialist-route evidence exists.

## Sources consulted

- [NSW Government: Buying and using electrical appliances](https://www.nsw.gov.au/housing-and-construction/safety-home/electrical-safety/buying-and-using-electrical-appliances)
- [NSW Government: Selling safe products and electrical products](https://www.nsw.gov.au/business-and-economy/running-a-business/selling-goods-and-services/selling-safe-products)
- [NSW Government: Electrical safety requirements and consumer rights](https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/safety/electrical-safety/electrical-safety-requirements-and-consumer-rights)
- [EESS: Second-hand equipment](https://www.eess.gov.au/equipment/second-hand-equipment/)
- [SafeWork NSW: Electrical inspection and testing](https://www.safework.nsw.gov.au/hazards-a-z/electrical-and-power/electrical-inspection-and-testing)
- [SafeWork NSW: Electrical risks at the workplace](https://www.safework.nsw.gov.au/resource-library/construction/electrical-services/electrical-risks-at-the-workplace-fact-sheet)
- [Safe Work Australia: Duties of a PCBU](https://www.safeworkaustralia.gov.au/law-and-regulation/duties-under-whs-laws/duties-pcbu)
- [Safe Work Australia: Managing electrical risks](https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-electrical-risks-workplace)
- [Fire and Rescue NSW: Battery and charging safety](https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/battery-and-charging-safety)
- [Fire and Rescue NSW: Damaged batteries](https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/battery-and-charging-safety/what-should-i-do-if-my-battery-is-damaged)
- [Australia Post: Dangerous, prohibited and restricted items](https://auspost.com.au/business/shipping/shipping-guidelines/dangerous-prohibited-items)

This report is operational research, not legal, insurance, electrical, WHS or emergency-services advice. Obtain written advice for the actual premises and business activity before expanding the lane.
