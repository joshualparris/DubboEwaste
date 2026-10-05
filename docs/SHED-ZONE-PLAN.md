# Photo-derived shed zone plan

**Review date:** 5 October 2026  
**Basis:** private photo review of the proposed Dubbo shed/workshop. Raw site photographs are intentionally **not** stored in this public repository because they show private access points, windows and household/security details.  
**Status:** `PHOTO-DERIVED / NOT YET MEASURED / NOT SITE APPROVAL`

Use with:

- [MINIMUM-PHYSICAL-SHED-SETUP-CHECKLIST.md](MINIMUM-PHYSICAL-SHED-SETUP-CHECKLIST.md)
- [BENCH-SOP-AND-LAYOUT.md](BENCH-SOP-AND-LAYOUT.md)
- [RESEARCH-12-PREMISES-PHYSICAL-FLOW-CAPACITY.md](RESEARCH-12-PREMISES-PHYSICAL-FLOW-CAPACITY.md)
- [EWASTE-FACILITY-ZONE-BENCHMARK-AND-SHED-DESIGN.md](EWASTE-FACILITY-ZONE-BENCHMARK-AND-SHED-DESIGN.md)

This document converts the real visible shed into a practical Phase 0 layout. It does **not** establish Council approval, tenancy permission, insurance cover, electrical/fire adequacy, structural adequacy or moisture suitability.

## Current decision from the photographs

**Physical readiness today: NOT READY.**

The shed has useful bones for a small controlled pilot, especially the inner finished-ceiling room and existing long work surfaces, but the photographed state is still household/storage space rather than a controlled ITAD workshop.

The visible physical blockers are:

- the main travel path is obstructed by household items, boxes, children’s equipment and furniture;
- floor area is being used as storage;
- the workbenches are not clear processing positions;
- household, garden, child and possible business areas are mixed together;
- there is no clearly established lockable **UNWIPED — RESTRICTED** position;
- there is no clearly established clean **CLEARED QA / READY FOR SALE** position;
- cardboard and other combustible storage is concentrated around areas that could otherwise become work/storage positions;
- the front/exposed-roof bay needs dryness, weather, temperature and electrical suitability confirmed before it is used for sensitive stock;
- electrical/RCD suitability for repeated device testing and charging cannot be confirmed from photographs;
- the side access and large exterior opening must both remain clear rather than becoming stock locations.

The correct response is **not** to fill the shed with more racks. First remove most non-business material and deliberately shrink the initial business footprint.

---

# 1. Use the shed as two different spaces

The photographs show a natural split:

## Space 1 — front / exposed-roof utility bay

This is the section closest to the large exterior opening, with exposed rafters/roof structure, built-in cupboards/counter and substantial general storage.

**Phase 0 role:** visitor buffer, same-day handoff/outbound and household/tool storage only.

Do **not** use this as normal overnight storage for unwiped client devices, sale stock or batteries until the area is separately proven dry, weather-tight, secure and suitable.

Use it for:

- **HANDOFF OUTSIDE** at the paved exterior edge;
- a small **A — INTAKE / UNASSESSED** trolley/tray just inside the opening during an active appointment;
- **H — OUTBOUND / RETURN** on the opposite side of the opening for short-duration staged dispatch;
- ladders, garden tools and remaining household/tool storage kept on the perimeter and out of the aisle;
- the existing red/built-in cabinetry as **tools and consumables only**, not data-bearing client stock.

The centre of this bay becomes a **clear transit aisle**, not storage.

## Space 2 — inner finished-ceiling room

This is the room farther inside with the finished ceiling/fan, long dark workbench and wall shelving.

**Phase 0 role:** the controlled ITAD workshop.

This is where normal device inventory and processing should live after dryness/security/power are confirmed.

Use it for:

- **B — UNWIPED / RESTRICTED**
- **C — PROCESSING BENCH**
- **D — REPAIR / WIP**
- **E — CLEARED QA**
- **F — READY FOR SALE / REUSE**
- **G — PARTS / DONOR**

Visitors do not enter this room during business handoff.

---

# 2. Exact zone placement

## HANDOFF — outside the large exterior opening

Use the paved area immediately outside the large opening as the customer/source handoff point.

Rules:

- customer stays outside;
- count and visually screen the item before custody transfer;
- no unattended drop-off;
- no gate pile;
- no device is accepted unless a free labelled internal position already exists.

AssetFlow location: `SHED-HANDOFF`.

## A — Intake / unassessed

**Location:** just inside the large exterior opening in the front utility bay, on a dedicated tray or small trolley.

Do not put intake items on the floor or on the general cardboard pile.

Site-specific cap:

- **1 active handoff or maximum 2 devices**;
- same-day triage;
- if it cannot move to B, C, H or refusal promptly, stop intake.

AssetFlow: `SHED-A-INTAKE`.

## H — Outbound / return

**Location:** near the large exterior opening, physically opposite A so incoming and outgoing items do not get mixed.

Use one labelled crate/trolley.

Rules:

- destination and next date required;
- sold/return/recycler items remain asset-labelled;
- no indefinite outbound pile;
- no data-bearing item waits here unless its data state permits release.

AssetFlow: `SHED-H-OUTBOUND`.

## Dirty/visitor boundary

Create a visible floor line at the transition from the front utility bay into the inner finished room.

Sign it:

> **STAFF WORK AREA — NO CUSTOMER ENTRY**

This line is the practical visitor boundary. The only reason an incoming device crosses it is after it has been accepted, labelled and recorded.

## B — Unwiped / restricted

**Best location:** immediately inside the inner finished room, close to the transition line but outside the visitor path.

Use a **lockable cabinet** or genuinely lockable existing cupboard only after it is confirmed dry and suitable. Do not use an open shelf.

Initial site-specific cap:

- **2 data-bearing devices** while the shed is being proven;
- later maximum under the canonical Phase 0 design: 4, but only after measured capacity and drills support it.

Sign:

> **UNWIPED — RESTRICTED — DO NOT RELEASE**

AssetFlow: `SHED-B-UNWIPED-RESTRICTED`.

## C — Processing bench

**Location:** use the existing long dark workbench in the inner finished-ceiling room.

This is the best visible candidate for the main wipe/test/diagnostic bench after it is completely cleared.

Before use:

- remove all household storage from the surface and underneath it;
- remove cardboard, coolers, bags and unrelated tools;
- add good task lighting;
- confirm the power/RCD arrangement with the appropriate competent/licensed person;
- keep leads off the travel path;
- provide only the tools needed for the active device.

Bench rule:

- **one active device at a time**;
- RED mode = unwiped/sanitisation;
- AMBER mode = diagnostics/repair;
- GREEN mode = final clean QA;
- reset the bench between states.

AssetFlow: `SHED-C-BENCH`.

## D — Repair / WIP

**Location:** a small dedicated rack directly beside the processing bench in the inner room.

Do not use the bench itself as WIP storage.

Initial cap: **2 devices** for this site until the room is measured and operating smoothly.

Each device needs:

- asset ID;
- fault/goal;
- next action;
- parts/time ceiling;
- review date.

AssetFlow: `SHED-D-REPAIR-WIP`.

## G — Parts / donor

**Location:** lower shelf or small rack beside/under the processing bench, using lidded labelled tubs.

Initial categories:

- RAM;
- known-status SSD/HDD/media;
- chargers/adapters;
- laptop donor parts;
- known-good cables/accessories.

Rules:

- no loose unidentified drives;
- no swollen/unsafe batteries;
- no overflowing miscellaneous parts pile;
- bin full = sort/use/outbound before adding another bin.

AssetFlow: `SHED-G-PARTS`.

## E — Cleared QA

**Location:** on the clean side of the inner room, using the wall side farthest practical from the visitor/intake boundary.

The existing wall shelf may be used only if it is deep, stable and suitable for the device weight. Otherwise use one small strong shelving unit.

Initial cap: **1 device**.

This shelf is for sanitised/repaired devices awaiting final release checks only.

AssetFlow: `SHED-E-CLEARED-QA`.

## F — Ready for sale / reuse

**Location:** the clean shelving position farthest from the front intake path in the inner finished room.

Prefer a dedicated strong shelving unit against the clean-side wall rather than balancing laptops on a shallow decorative shelf.

Initial site-specific cap: **2 devices**. Increase only after stock turnover is proven.

Rules:

- only released/sanitised devices;
- no donor parts;
- no repairs;
- accessories linked to the device;
- listing/sale status recorded.

AssetFlow: `SHED-F-SALE-READY`.

---

# 3. Photo-derived topology

Not to scale:

```text
                     OUTSIDE / PAVED HANDOFF
                              |
                    [ LARGE EXTERIOR OPENING ]
                              |
             +----------------+----------------+
             |                                 |
       H OUTBOUND                         A INTAKE
       short-term                         same-day
             |                                 |
             +---------- CLEAR AISLE ----------+
                        FRONT UTILITY BAY
                  household/tools at perimeter
                    NO LONG-TERM IT STOCK
                              |
                 ===== VISITOR / RED LINE =====
                              |
               B LOCKED UNWIPED / RESTRICTED
                              |
                     INNER FINISHED ROOM
                              |
                    C PROCESSING BENCH
                    /                 \
             G PARTS BINS          D REPAIR WIP
                                      |
                                  E CLEARED QA
                                      |
                              F READY FOR SALE

SIDE ACCESS DOOR: KEEP COMPLETELY CLEAR.
```

The flow should feel like a one-way funnel. Incoming devices do not wander around the room.

---

# 4. What to do with the existing household contents

## Remove from the business footprint entirely

The photographed operational room should not continue to store:

- children’s bicycles, scooters and ride-on toys;
- stroller/pram;
- high chair;
- child seats;
- recliner/chair;
- mattress;
- plastic outdoor chairs/tables;
- pool/inflatable equipment;
- drying rack;
- coolers/esky;
- loose bags of household items;
- large unused furniture panels;
- loose cardboard piles.

Move these to the house, covered patio, another storage shed, off-site storage, sell/donate/dispose appropriately, or consolidate into a **clearly separate household-only area outside the ITAD room**.

The inner finished room should stop being general family storage.

## Cardboard

Do not keep the photographed volume of cardboard around the workshop.

Action:

1. flatten/recycle damaged or unnecessary boxes;
2. keep only a small selection of known-useful shipping boxes;
3. store retained boxes flat on a high dry shelf away from charging/testing;
4. no cardboard beside the processing bench.

## Garden and powered equipment

Move the mower, pressure washer and similar garden equipment out of the controlled electronics room.

If any fuel-powered equipment is retained on the property, store it in an appropriate separate location rather than beside electronics testing/charging and resale inventory.

## Ladders and long items

Keep the ladders and long poles in the front utility area on proper wall hooks or a fixed rack.

Nothing long should lean into the aisle or against clean stock.

## Existing red/built-in cabinetry

Keep and reuse it for:

- hand tools;
- PPE;
- cleaning supplies appropriate to the workflow;
- spare labels;
- packaging tools;
- non-sensitive consumables.

Do not use it as the primary restricted-data cabinet unless its security, dryness and access control are separately proven.

## Existing overhead cupboards

Useful for tools/consumables after cleaning and inspection.

Do not place valuable devices in a high cupboard simply to create more capacity.

## Chemicals and sprays

Remove ordinary household/garden chemicals from the electronics work zone.

Only keep workshop cleaning products that are actually required, labelled and stored according to their product/SDS requirements, away from charging and batteries.

---

# 5. Clear-aisle rule

Create one obvious no-storage path connecting:

- the large exterior opening;
- the inner workshop;
- the side access/exit.

Aim for roughly **900 mm of unobstructed walking width where the real structure allows**, but obtain site-specific advice for any legally required exit/access width.

Nothing lives in this aisle:

- no boxes;
- no bikes;
- no cords;
- no device crates;
- no ladders;
- no repair jobs.

Floor tape is cheap and useful. The tape means **NO STORAGE**, not “storage until tomorrow”.

---

# 6. Minimum purchases after decluttering

Reuse existing furniture wherever it is actually suitable. The photos suggest the shed does **not** need a warehouse fit-out.

Likely minimum additions:

1. **one lockable cabinet** for B — UNWIPED / RESTRICTED;
2. **one strong adjustable shelf** for E/F — QA and sale-ready;
3. **one small WIP rack** beside the bench;
4. **4–5 lidded parts tubs**;
5. **zone labels / label printer supplies**;
6. **task lighting** over the processing bench;
7. **floor tape/signage** for aisle and visitor boundary;
8. **ESD bench basics** once the electrical/grounding arrangement is understood;
9. fire/smoke/electrical controls only after the actual premises is reviewed by the relevant competent person/insurer.

Do **not** buy pallet racking, cages, a forklift, industrial battery cabinets, multiple benches or large stock shelving for this Phase 0 shed.

---

# 7. Electrical and building checks before powering customer equipment

The photographs show an older mixed-finish shed with visible wiring and unfinished/exposed roof/wall areas in part of the building. A photograph cannot determine whether those systems are safe or compliant.

Before business device testing/charging:

- confirm the work area is dry and weather-tight;
- confirm there is no active water ingress or unsuitable damp area;
- have the bench power/RCD arrangement checked as appropriate;
- do not run extension leads across the aisle;
- do not daisy-chain power boards;
- remove damaged/unknown leads;
- no unattended or overnight charging;
- no charging beside the exit, cardboard, household chemicals or garden/fuel equipment;
- keep the open/exposed-roof utility bay out of normal sensitive-stock storage until its suitability is proven.

The current photographs do not justify a claim that the shed is electrically, structurally or fire compliant.

---

# 8. Site-specific starting capacity

The repository-wide provisional ceiling remains **12 serialized devices physically held at once**, but this photo review supports starting lower.

**Start this actual shed at a maximum of 6 serialized devices total.**

Suggested early-state limits:

| Zone | Initial site cap |
|---|---:|
| A — Intake | 1 active handoff / max 2 devices |
| B — Unwiped | 2 |
| C — Bench | 1 active |
| D — Repair WIP | 2 |
| E — Cleared QA | 1 |
| F — Sale-ready | 2 |
| Total physically held | **6 maximum** |

The zone figures are workflow ceilings, not permission to fill every zone simultaneously beyond the six-device total.

Review after:

- the synthetic normal-intake drill;
- the full-unwiped-zone drill;
- five real devices;
- confirmed shelf dimensions;
- confirmed dryness/power/security.

Only then consider raising toward the canonical 12-device provisional cap.

---

# 9. Exact cleanup order

Do this in order.

## Pass 1 — make it safe to walk

- remove bikes/scooters/toys from the floor;
- remove stroller, high chair and recliner;
- remove loose boards/panels;
- move ladders to a fixed wall position;
- flatten/remove cardboard;
- clear both access points;
- establish the centre aisle.

**Stop after this pass and take new photos.**

## Pass 2 — empty the future ITAD room

- remove all remaining household storage from the inner finished room;
- completely clear the long dark workbench;
- clear underneath the bench;
- empty the clean-side wall shelf;
- move garden/powered equipment out of this room.

## Pass 3 — create the dirty/clean boundary

- tape the visitor boundary at the room transition;
- put A and H near the exterior opening;
- install/identify B just inside the controlled room;
- label the processing bench C.

## Pass 4 — build the clean side

- install D WIP rack next to C;
- install G parts tubs;
- establish E QA shelf;
- establish F sale-ready shelf;
- confirm B and F are physically distinct.

## Pass 5 — test the workflow with no customer data

Use fake/inert/test devices and walk:

```text
HANDOFF → A → B → C → D → E → F
                    ↘ G
A/B/C/D → H when returning/downstream
```

If an item cannot be moved without putting it on the floor, crossing household storage or losing its label, the layout is not ready.

---

# 10. What “ready” looks like

Before the first bounded real batch, a new photograph of the same shed should show:

- clear centre aisle;
- no children’s equipment in the controlled room;
- no floor inventory;
- no cardboard pile around the bench;
- one empty processing bench;
- one clearly labelled lockable unwiped cabinet;
- one WIP rack;
- one QA shelf;
- one sale-ready shelf;
- labelled parts tubs;
- intake/outbound positions at the exterior opening;
- both access/exit routes clear;
- no sensitive stock in the exposed-roof utility bay unless that area has been proven suitable.

That is the minimum visual standard for the physical setup. External launch gates remain separate.
