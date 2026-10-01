# Research 07: Repair economics, parts strategy and board-level boundaries

**Research date:** 2 October 2026 (AEST)

**Gap covered:** `codexGAPS.md` section 8: repair decision data, local parts inventory, donor harvesting, repair/refurbished-part disclosure, and the board-level repair boundary.

**Relationship to existing research:** `claudegaps-research/11-PARTS-SCRAP-DESTRUCTION.md` covers parts/scrap buyers, drive destruction and indicative part categories. This report addresses the remaining operating decision: when a device should be repaired, harvested, referred or abandoned, and how to prove that choice economically.

**Status:** decision framework complete; the actual labour ceilings, model-specific part sell-through and board-repair referral prices require the pilot ledger and local enquiries.

## Executive decision

The first repair lane should be **modular, reversible and model-concentrated**:

- prioritise common business laptops, desktops and selected phones/tablets with documented service procedures;
- repair only faults that can be diagnosed, reversed and retested with the available tools;
- harvest only parts with a named compatible model, a safe storage route and a realistic sale or internal-repair use;
- treat batteries as safety-controlled consumables, not ordinary inventory;
- refer board-level, data-recovery, liquid-damage and mains/high-voltage faults until a specialist relationship, price and warranty boundary exist;
- stop a repair when the expected contribution per remaining labour hour falls below the predeclared threshold.

The correct question is not “can this be fixed?” It is:

```text
Is the expected incremental contribution from repair greater than
the remaining labour value + parts risk + return risk + opportunity cost,
while staying within the safety, data, licensing and warranty boundary?
```

## 1. Primary-source findings

### 1.1 Manufacturer procedures are the baseline for modular repair

Dell’s current repair guidance instructs the technician to disconnect power before opening, handle cards by their edges, avoid pulling cables, replace covers/screws before reconnecting power and use ESD precautions. Dell points technicians to model-specific manuals. Lenovo publishes Hardware Maintenance Manuals for ThinkPad families. These are stronger starting points than a generic teardown because they identify model-specific disassembly order, parts, hazards and reassembly requirements.

Sources:

- [Dell: replacing common laptop parts](https://www.dell.com/support/kbdoc/en-us/000179828/how-to-replace-common-parts-in-your-dell-notebook)
- [Lenovo: ThinkPad Hardware Maintenance Manual example](https://download.lenovo.com/pccbbs/mobiles_pdf/t440_hmm_en.pdf)
- [iFixit: free repair guides](https://www.ifixit.com/)
- [iFixit: repair-guide structure and time/tool fields](https://www.ifixit.com/Info/Repair_Guide)

**Operational consequence:** every repair job should link to a model-specific manual or guide, list the required tools, record estimated and actual time, and capture the final functional test. If no trustworthy procedure exists, route the item to inspection/referral rather than improvising on resale stock.

### 1.2 Apple parts and service history can change the resale result

Apple’s Australian Self Service Repair information provides genuine parts, tools and manuals for experienced users. Apple’s repair terms also distinguish new, used and reconditioned parts, describe diagnostic fees and state that repair can result in data loss. Apple’s support material explains that independent repair providers are not Apple-authorised merely because they have access to genuine parts/resources.

Sources:

- [Apple: Self Service Repair](https://support.apple.com/self-service-repair)
- [Apple Australia: repair terms](https://www.apple.com/au/legal/sales-support/terms/repair/retail_repair_australia_terms_conditions.html)
- [Apple: service and repair](https://support.apple.com/en-au/repair)

**Operational consequence:** Apple repair records must disclose known replacement/repair history and avoid wording that implies Apple-authorised service. A part that works electrically may still carry pairing, configuration, warning or resale implications. Test the finished device and record any service-history/parts warning exposed by the supported software.

### 1.3 Customer repair creates a different liability and workflow

The existing compliance research identifies the ACCC repair-notice requirement where refurbished parts may be used or goods may be replaced with refurbished goods, and where repair may result in data loss. This report therefore treats customer-owned repair as a separate lane from owned-inventory refurbishment. A customer repair needs an intake notice, data instruction, quote/approval, custody record and uncollected-goods process.

Source:

- [ACCC: repair notices](https://www.accc.gov.au/consumers/problem-with-a-product-or-service-you-bought/repair-notices)

**Operating rule:** do not quietly accept customer repair jobs during the resale pilot. If customer repair is introduced, use the reviewed repair notice and separate customer-owned stock, records and remedy policy.

## 2. Repair route matrix

| Route | Typical condition | Action | Required evidence |
|---|---|---|---|
| `WHOLE-DEVICE` | Works or needs quick clean/configuration | Sanitise, test, grade, list/donate | full test and data evidence |
| `MODULAR-REPAIR` | Known replaceable part, documented procedure, positive margin | Quote/obtain part, repair, retest | manual, part identity, times, post-test |
| `DONOR-HARVEST` | Whole device uneconomic but named components likely useful | Sanitise storage, harvest safe parts, label immediately | part test, compatibility, storage location |
| `PARTS-SALE` | Part has a buyer route and expected net exceeds threshold | List with exact part number and tested state | photos, test result, condition/disclosure |
| `SPECIALIST-REFERRAL` | Board fault, data recovery, liquid damage, locked device or regulated work | Obtain quote/route or return | referral contact, quote and custody |
| `MATERIAL-RECOVERY` | No safe/value route remains | Approved downstream route | downstream receipt/certificate |
| `REJECT/RETURN` | Authority, safety or data gate unresolved | Do not take or retain | refusal reason |

Do not make `DONOR-HARVEST` the default for every broken device. Disassembly, storage, testing and later disposal can cost more than the part is worth.

## 3. Repair go/no-go formula

### 3.1 Before parts are ordered

Record a conservative estimate:

```text
expected post-repair realised value
 - channel cost
 - postage and packaging
 - return/warranty reserve
 - part purchase + freight + GST
 - consumables
 - labour already spent
 - remaining estimated labour
 - failure/rework reserve
 - downstream exit cost
 = expected contribution after repair
```

Compare that with the best no-repair route:

```text
expected contribution after repair
 - contribution from immediate parts/wholesale/recycling route
 = incremental repair contribution
```

Continue only if incremental contribution is positive and the result meets the category’s minimum contribution-per-hour threshold. The threshold should be set before the next repair, not after a sunk-cost emotional decision.

### 3.2 Labour ceiling

For each category, calculate:

```text
remaining labour ceiling (minutes)
= 60 × incremental contribution available for labour
  / target contribution per labour hour
```

Example with variables:

```text
incremental contribution available for labour = $C
target contribution per labour hour = $R
remaining labour ceiling = 60 × C / R minutes
```

If a repair has 25 minutes left in the estimate but only 10 minutes of labour ceiling remains, stop or refer it. If the next diagnostic step materially changes the value estimate, permit one defined diagnostic exception and re-price the job; do not continue indefinitely.

### 3.3 Two-stop rule

Use two independent stop points:

1. **Technical stop:** the fault is not isolated, the procedure becomes unsafe, a second failure appears, a screw/connector is damaged, or the post-repair test cannot be defined.
2. **Economic stop:** the remaining contribution no longer pays for the remaining labour and risk.

Either stop is sufficient. A technically possible repair may still be an economic failure.

## 4. Repair record schema

Add one record per repair attempt, including failed attempts:

```text
asset_id, repair_id, route_before, fault_reported,
diagnostic_start, diagnostic_end, diagnosis_confidence,
manual_or_guide_url, tools_required, safety_exception,
parts_searched_minutes, part_supplier, part_number,
part_state_new_used_refurbished_salvaged, part_price,
freight, gst, consumables, labour_minutes_before,
repair_start, repair_end, rework_minutes, repair_result,
post_repair_test, test_duration, cosmetic_change,
data_or_lock_state_after, warranty_or_return_exposure,
expected_value_before, expected_value_after,
best_no_repair_route, expected_incremental_contribution,
remaining_labour_ceiling, final_route, reviewer, notes
```

Required result values:

- `fixed-and-tested`;
- `fixed-with-disclosed-limitation`;
- `intermittent-do-not-sell-as-working`;
- `failed-repair`;
- `partially-harvested`;
- `referred`;
- `recycled`;
- `returned-to-owner`.

“It powered on after repair” is not a sufficient result. The test must cover the functions represented in the listing and any function touched by the repair.

## 5. Pilot labour caps to measure, not assume

Until 20–30 outcomes exist in a category, use a provisional cap and record every exception:

| Category | Phase 0 repair candidates | Provisional rule |
|---|---|---|
| Business laptop/desktop | RAM/SSD, fan, keyboard, display, storage cable, charger, cleaning | one diagnosis plus one modular repair attempt; re-price before a second attempt |
| Android/iPhone | screen/battery only where safety, lock, parts pairing and post-test path are known | no board work; do not fit an unknown battery |
| Monitor/TV | stand/cable/input/obvious external accessory | no panel opening or mains-board repair in Phase 0 |
| Console/controller | controller parts, known modular storage/drive/accessory | no HDMI/board rework until specialist route exists |
| Camera/lens | cleaning/accessory/known battery or charger route | no optical disassembly or fungus treatment without specialist skill |
| Router/NAS | reset/configuration only after data review | no release with unknown credentials, keys or storage |
| Printer | simple consumable/accessory replacement | stop if firmware lock, cartridge economics or internal storage is unclear |

These are scope controls, not claims that every device in the category is safely repairable.

## 6. Parts inventory policy

### 6.1 Hold only three kinds of parts

1. **Ready-to-use stock:** identified, tested parts for a model family with a near-term repair candidate.
2. **Sellable stock:** tested parts with an exact part number, buyer route and expected net above the listing threshold.
3. **Quarantine stock:** untested, incompatible, aged, damaged or uncertain parts awaiting decision.

Everything else should be returned, bundled, referred to scrap, or removed from inventory. “Maybe useful someday” is not a category.

### 6.2 Part label

Every retained part gets:

```text
part_id, donor_asset_id, exact_part_number,
compatible_models, revision_or_connector,
new_used_refurbished_salvaged, test_result, test_date,
battery_state_if_applicable, cosmetic_grade,
data_state, storage_location, acquisition_cost,
harvest_minutes, expected_internal_value,
expected_sale_value, listed_at, sold_at,
review_date, expiry_or_write_down_date, disposition
```

For screws, brackets, cables and mixed accessories, label the kit by exact model and quantity. Do not put anonymous “Dell screws”, “USB-C charger” or “RAM” into the active bin.

### 6.3 Inventory ageing

Set a review date at intake:

- 30 days: confirm the compatible repair candidate still exists;
- 60 days: check whether the part has a sale route or bundle route;
- 90 days: write down, bundle or scrap unless evidence justifies retention;
- sooner for batteries, adhesives, fragile screens and rapidly obsolete parts.

Ageing is measured from the part’s own label date, not the donor device’s intake date.

## 7. What to harvest first

The existing parts research identifies screens, genuine chargers, RAM, SSDs, keyboards and model-specific housings as potential value areas, while batteries carry degradation and transport risk. The following order is safer for a small operation:

### Tier 1: test and retain immediately

- genuine, identified laptop chargers;
- removable RAM with capacity/type/working test;
- SATA/NVMe drives only after the data-sanitisation gate;
- model-specific keyboard, fan, cable or dock when a matching repair candidate exists;
- intact, identified stands and proprietary adapters.

### Tier 2: retain only against a named job

- display assemblies/panels;
- hinges, palmrests, bottom cases and trackpads;
- camera modules, speakers and daughterboards;
- console drives/controllers;
- networking modules and antennas.

### Tier 3: do not build stock in Phase 0

- used lithium batteries, unless an approved specialist route and model-specific health evidence exist;
- untested logic boards;
- mixed screws/connectors;
- generic low-value cables;
- cracked screens, water-damaged boards and unknown chargers;
- parts whose compatibility depends on account pairing or vendor service configuration.

## 8. Part valuation method

Use the same evidence discipline as whole-device pricing:

1. search the exact part number, revision and connector;
2. separate tested working, untested, faulty and salvaged;
3. use Australian sold results where available and record date/channel;
4. subtract fees, packing, postage, labour, return reserve and expected dead-on-arrival rate;
5. compare the net sale value with internal repair value and scrap value;
6. keep the higher route only if it does not create an unsafe or data-bearing exception.

Recommended minimum sale threshold for the pilot:

```text
expected net part sale
>= listing labour + packing labour + expected return reserve
  + target contribution
```

The threshold is intentionally a formula rather than a fixed dollar amount. Test it with 20 part outcomes; the existing report’s indicative `$25` net floor is a hypothesis, not an AU fact.

## 9. Donor yield experiment

Run a controlled donor experiment on one concentrated model family, not a random mixed lot.

For 10–20 units of the same family, record:

- whole-unit condition;
- parts harvested;
- harvest minutes;
- test success;
- compatibility failures;
- storage volume;
- parts sold or used internally within 90 days;
- disposal cost of leftovers;
- value that would have been obtained by immediate wholesale/scrap route.

Calculate:

```text
donor yield = usable parts or completed repairs / donors opened
harvest contribution per hour
= (internal value + realised part revenue - direct costs - disposal costs)
  / total harvest, test, list and pack hours
```

Do not infer a donor-parts strategy from one successful screen or charger. The experiment must include unsaleable parts and time spent labelling them.

## 10. Board-level boundary

Board-level repair becomes a separate service line, not an incidental extension of laptop refurbishment. Before entering it, prove:

- a competent technician or supervised training path;
- ESD controls and safe bench power;
- microscope, illumination and controlled hot-air/iron equipment;
- fume extraction and chemical controls;
- schematics/board-view resources obtained lawfully;
- diagnosis and data-recovery boundaries;
- replacement-parts traceability;
- post-repair test fixture and minimum burn-in period;
- rework failure and warranty policy;
- insurer approval and premises suitability;
- referral route for work beyond the bench.

### Board-level no-go triggers

Refer or scrap rather than experiment on resale stock when:

- there is liquid/corrosion damage and data may be present;
- the board is part of a locked or managed device;
- the fault is intermittent and no reproducible test exists;
- the repair requires bypassing security, pairing or ownership controls;
- the work touches mains/high-voltage sections;
- the board is needed for a customer-owned device without a reviewed repair agreement;
- a failed attempt could erase data or make a recoverable device unrecoverable;
- the expected contribution does not pay for diagnosis, rework and warranty exposure.

Practice boards must be physically and digitally separated from customer/resale stock and labelled `TRAINING-NOT-FOR-SALE`.

## 11. Open-source and free bench support

Use free/open tools where they reduce measurement uncertainty without uploading private data:

| Function | Tool/process | Limitation |
|---|---|---|
| Storage health | `smartmontools`, `nvme-cli` | health output does not prove data sanitisation or future reliability |
| Memory | Memtest86+ | a pass is evidence for the tested run, not a lifetime guarantee |
| Hardware inventory | `lshw`, `inxi`, `dmidecode` where appropriate | avoid exposing serials in public reports |
| Disk recovery decision | GNU `ddrescue` in a controlled, authorised workflow | never image donor data casually; follow Research 05 |
| Firmware/driver state | `fwupd` and manufacturer support tools | do not use updates to bypass ownership/management controls |
| Test records | CSV/SQLite/LibreOffice | encrypt; back up; use asset IDs |
| Repair documentation | manufacturer manuals and iFixit guides | check model/revision and licence/terms |

Do not run stress tests, charging experiments or board rework merely because a free tool exists. The safety and data gate comes first.

## 12. Warranty and disclosure controls

For a repaired or harvested item, listing/receipt language must state, where known:

- what was repaired or replaced;
- whether the part is new, genuine, used, refurbished or salvaged;
- battery health and whether the battery was replaced;
- known limitations and functions not tested;
- whether the device is sold as working, tested-with-fault, parts-only or untested;
- the data-sanitisation state;
- the remedy/return process consistent with ACL rights.

Do not say “fully refurbished” when only a charger or cosmetic part was changed. Do not say “tested” without naming the meaningful tests. Do not use “no warranty” to remove non-excludable consumer guarantees.

If customer-owned repair is introduced, use the required repair notice before acceptance and separately manage data-loss warnings, refurbished-part disclosure, quote approval, custody and uncollected goods.

## 13. Repair review dashboard

Review every 10 repair outcomes by category:

| Metric | Why it matters |
|---|---|
| diagnosis success rate | detects weak front-door triage |
| repair success rate | measures technical capability |
| median total labour minutes | sets realistic caps |
| part cost as percentage of expected value | detects low-value repairs |
| rework/failure rate | prices risk and training need |
| return/defect rate | measures buyer-facing exposure |
| parts used internally | measures donor value |
| parts sold within 90 days | tests inventory assumptions |
| leftover/disposal rate | exposes hidden cost |
| contribution per labour hour | go/no-go metric |
| referral conversion and price | tests specialist boundary |
| incidents/near misses | safety stop metric |

Change a category rule only after recording the evidence and the new effective date. Preserve old decisions so the pilot does not become an untraceable memory exercise.

## 14. Local research actions still required

- obtain current written repair/diagnostic quotes from at least two Dubbo or regional NSW specialists for board-level, liquid-damage and phone-board work;
- ask local repairers which models/parts they actually buy, reject and stock;
- request supplier terms for part returns, DOA windows, counterfeit controls and warranty;
- query eBay Australia Product Research or completed sales for the exact parts the pilot encounters;
- measure three common laptop model families end to end;
- ask the insurer whether owned-inventory repair and customer-owned repair are treated differently;
- have a consumer-law adviser review repaired/refurbished-part disclosure and any customer-repair notice;
- confirm with downstream buyers how harvested boards, batteries and failed drives must be packaged and labelled.

## 15. Recommended Phase 0 repair policy

Until the pilot data exists:

1. Repair only modular parts with a known procedure and test.
2. Do not open mains/high-voltage sections.
3. Do not bypass locks, pairing, MDM or account controls.
4. Do not repair or resell damaged lithium batteries.
5. Do not retain a part without an ID, compatibility note and review date.
6. Do not order a part before calculating the repair ceiling.
7. Stop after the technical or economic stop point.
8. Refer board-level, liquid-damage and data-recovery work.
9. Keep practice boards separate from saleable stock.
10. Record failed repairs and leftover parts, not only successful sales.

## Sources consulted

- [Dell: replacing common laptop parts](https://www.dell.com/support/kbdoc/en-us/000179828/how-to-replace-common-parts-in-your-dell-notebook)
- [Lenovo: ThinkPad Hardware Maintenance Manual](https://download.lenovo.com/pccbbs/mobiles_pdf/t440_hmm_en.pdf)
- [iFixit: free repair guides](https://www.ifixit.com/)
- [iFixit: creating a repair guide](https://www.ifixit.com/Info/Repair_Guide)
- [Apple: Self Service Repair](https://support.apple.com/self-service-repair)
- [Apple Australia: repair terms](https://www.apple.com/au/legal/sales-support/terms/repair/retail_repair_australia_terms_conditions.html)
- [Apple: service and repair](https://support.apple.com/en-au/repair)
- [ACCC: repair notices](https://www.accc.gov.au/consumers/problem-with-a-product-or-service-you-bought/repair-notices)
- [ACCC: consumer guarantees](https://www.accc.gov.au/business/selling-products-and-services/consumer-guarantees)

This is operational research, not legal, electrical, WHS, insurance, tax or professional repair advice. Verify the exact activity, premises and warranty wording before offering customer repairs or board-level work.
