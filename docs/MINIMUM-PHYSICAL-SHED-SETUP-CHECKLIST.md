# Minimum Physical Shed Setup Checklist

**Purpose:** the smallest practical physical setup needed to run the Dubbo Phase 0 ITAD / electronics reuse pilot without pretending the shed is a warehouse.

**Status:** operational setup checklist only. Completing this checklist does **not** by itself establish Council approval, lease/landlord permission, insurance cover, Fair Trading compliance, fire/electrical adequacy, downstream acceptance or permission for general public intake.

Use with:

- [PHASE-0-LAUNCH-GATES.md](PHASE-0-LAUNCH-GATES.md)
- [BENCH-SOP-AND-LAYOUT.md](BENCH-SOP-AND-LAYOUT.md)
- [EWASTE-FACILITY-ZONE-BENCHMARK-AND-SHED-DESIGN.md](EWASTE-FACILITY-ZONE-BENCHMARK-AND-SHED-DESIGN.md)
- [RESEARCH-12-PREMISES-PHYSICAL-FLOW-CAPACITY.md](RESEARCH-12-PREMISES-PHYSICAL-FLOW-CAPACITY.md)
- [../templates/phase-0-readiness-and-capacity-record.md](../templates/phase-0-readiness-and-capacity-record.md)

---

## 1. Premises basics

- [ ] Shed/work area is **dry, watertight and secure**.
- [ ] No active mould, water ingress or known damp surface is used for equipment storage.
- [ ] Entry/exit is clear and usable.
- [ ] Walkway stays clear.
- [ ] No ordinary inventory is stored on the floor.
- [ ] Work/storage area is separate enough from household use to keep children, pets, food and personal clutter out while operating.
- [ ] The exact area intended for business use is measured and documented privately.
- [ ] Any unusable/damp/no-storage area is marked as excluded.

**Hard stop:** do not store valuable resale stock or unwiped client/business devices in a shed that is not demonstrably dry, secure and suitable.

---

## 2. Minimum furniture and storage

### Workbench

- [ ] One solid workbench is available.
- [ ] Bench has adequate lighting.
- [ ] Bench is kept as a **processing position, not storage**.
- [ ] Only one active device per operator work position.
- [ ] Bench can be reset between restricted/unwiped and clean/cleared work.

You do **not** need separate wipe, test and repair benches for Phase 0.

### A — Intake / unassessed

- [ ] One clearly labelled intake tray/shelf exists near the handoff point.
- [ ] Initial cap: **2 devices or one small labelled batch**, whichever is lower.
- [ ] Every accepted device gets an asset/source ID immediately.
- [ ] Intake shelf is not used for long-term storage.

### B — Unwiped / restricted

- [ ] One lockable cabinet, lockable cupboard or genuinely restricted storage position exists.
- [ ] It is clearly labelled **UNWIPED — RESTRICTED**.
- [ ] It is not accessible to visitors.
- [ ] Sale-ready stock is never stored in the same location.
- [ ] Initial cap: **4 data-bearing devices**.
- [ ] Full zone = no new data-bearing intake.

### D — Repair / WIP

- [ ] One small repair/WIP shelf or rack exists beside the bench.
- [ ] Initial cap: **3 active devices**.
- [ ] Each device has a fault/goal, next action and review date.
- [ ] No device is allowed to become indefinite “I’ll get to it later” stock.

### E/F — Cleared QA / sale-ready

- [ ] One clean shelf exists for cleared/QA stock.
- [ ] One clean shelf or clearly separated section exists for **READY FOR SALE / REUSE**.
- [ ] Clean/released stock is physically separated from unwiped devices.
- [ ] Initial QA cap: **2 devices**.
- [ ] Initial sale-ready cap: **4 devices**.

### G — Parts / donor

- [ ] A small fixed number of labelled, lidded tubs exists.
- [ ] Suggested initial categories:
  - [ ] RAM
  - [ ] known-status SSD/HDD/media
  - [ ] chargers/adapters
  - [ ] laptop donor parts
  - [ ] cables/known-good accessories
- [ ] No loose unidentified storage media.
- [ ] No unsafe/swollen batteries.
- [ ] Bin full = sort/use/outbound before adding another bin.
- [ ] No miscellaneous “might be useful one day” pile.

### H — Return / downstream / outbound

- [ ] One labelled outbound crate/shelf exists near the exit where practical.
- [ ] Every item in outbound has a named destination and next date.
- [ ] Return, recycler/destruction and sold dispatch assets remain identifiable.
- [ ] No indefinite “outbound someday” stock.

---

## 3. Physical flow

The physical shed should support this simple one-way flow:

```text
HANDOFF OUTSIDE
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
A/B/C/D → H RETURN / DOWNSTREAM / OUTBOUND
```

- [ ] Intake is close to the door.
- [ ] Unwiped storage is outside the visitor path.
- [ ] Bench acts as the controlled crossing point between dirty/restricted and clean/released states.
- [ ] Sale-ready stock is as far from the unwiped/intake lane as practical.
- [ ] Outbound is near the exit where practical.
- [ ] Nothing blocks the exit.

---

## 4. Electrical and charging basics

- [ ] Power boards, chargers and leads are visibly sound and suitable for use.
- [ ] Appropriate RCD/electrical protection for the actual workspace is confirmed.
- [ ] No damaged leads/plugs are used.
- [ ] No unattended charging.
- [ ] No overnight charging.
- [ ] No charging beside the only exit.
- [ ] Charging/testing happens on a suitable, stable work surface.
- [ ] Opened mains PSUs, mains wiring and other licensed electrical work are outside Phase 0 unless handled by a competent/licensed person as required.

---

## 5. Battery boundary

Phase 0 is **not** a damaged-battery collection service.

- [ ] Loose lithium batteries are not accepted as a normal Phase 0 stream.
- [ ] Visibly swollen, leaking, crushed, punctured, wet, overheated, smoking or fire-affected battery devices are refused before normal intake.
- [ ] There is a written response for battery danger discovered only after acceptance.
- [ ] If discovered after acceptance:
  - [ ] stop work;
  - [ ] do not charge or test;
  - [ ] keep people away from the hazard;
  - [ ] follow current NSW/site-specific emergency/isolation guidance;
  - [ ] arrange an appropriate receiver/advice pathway promptly.
- [ ] A generic metal box or improvised “battery bin” is **not** treated as proof of safe storage.

Battery hazard is an **exception / stop-work path**, not ordinary inventory.

---

## 6. Network and data basics

- [ ] Unknown devices do **not** join the normal home/business LAN during ordinary triage.
- [ ] Offline tools or an isolated/segregated test network are available where needed.
- [ ] Every possible data-bearing device goes to **UNWIPED — RESTRICTED** by default.
- [ ] No data-bearing asset moves to clean/sale stock without a recorded media decision and verification.
- [ ] Removed drives/media stay linked to the parent asset or their own media record.
- [ ] No loose unidentified drives.

---

## 7. Visitor and handoff boundary

- [ ] Customer/source handoff occurs outside the workshop or at the doorway.
- [ ] Visitors do not enter unwiped, repair, parts or sale-ready zones.
- [ ] No unattended drop-off.
- [ ] No gate pile.
- [ ] No public e-waste bin.
- [ ] No outdoor stockpile.
- [ ] One source/batch at a time where practical.
- [ ] A device is refused/rescheduled if there is no safe physical location available.

---

## 8. Labels and AssetFlow

Minimum physical labels:

- [ ] **INTAKE / UNASSESSED**
- [ ] **UNWIPED — RESTRICTED**
- [ ] **PROCESSING BENCH**
- [ ] **REPAIR / WIP**
- [ ] **CLEARED QA**
- [ ] **READY FOR SALE / REUSE**
- [ ] **PARTS / DONOR**
- [ ] **OUTBOUND / RETURN**

Recommended AssetFlow locations:

- [ ] `SHED-HANDOFF`
- [ ] `SHED-A-INTAKE`
- [ ] `SHED-B-UNWIPED-RESTRICTED`
- [ ] `SHED-C-BENCH`
- [ ] `SHED-D-REPAIR-WIP`
- [ ] `SHED-E-CLEARED-QA`
- [ ] `SHED-F-SALE-READY`
- [ ] `SHED-G-PARTS`
- [ ] `SHED-H-OUTBOUND`

Operational rule:

> **No physical move without a location/status event. No status release without a physical move.**

If the physical location and AssetFlow record disagree, hold the asset and reconcile it before release.

---

## 9. Initial stock limit

The 20–30 device Phase 0 pilot is a **cumulative sample**, not simultaneous storage permission.

- [ ] Start with a provisional overall cap of **12 serialized devices physically held at once**.
- [ ] Review the cap after device 5.
- [ ] Review again after device 10.
- [ ] Do not raise the cap unless:
  - [ ] every asset is easy to locate;
  - [ ] no data-state confusion has occurred;
  - [ ] no zone is chronically full;
  - [ ] repair/WIP is moving;
  - [ ] sale-ready stock is actually leaving;
  - [ ] downstream routes work;
  - [ ] the actual premises/insurance/capacity evidence permits it.

The 12-device figure is an **operating experiment cap**, not a fire, structural, insurance or regulatory limit.

---

## 10. What you do NOT need to buy yet

Do not buy warehouse infrastructure just to look professional.

You do **not** need for the first bounded pilot:

- [ ] warehouse
- [ ] pallet racking
- [ ] pallet jack
- [ ] forklift
- [ ] commercial cages/stillages
- [ ] industrial shredder
- [ ] dedicated destruction machine
- [ ] multiple wipe benches
- [ ] large public drop-off bin
- [ ] dedicated van
- [ ] elaborate CCTV system solely to claim “secure facility”
- [ ] industrial battery cabinet without competent site-specific advice
- [ ] large quantities of shelving
- [ ] industrial extraction/processing equipment

Buy only what the measured pilot proves you need.

---

## 11. Small useful items after the premises is cleared

Potential low-cost basics:

- [ ] strong shelving
- [ ] lockable restricted cabinet
- [ ] labels / label printer
- [ ] lidded parts tubs
- [ ] ESD-safe bench basics
- [ ] good task lighting
- [ ] appropriate smoke/fire controls after competent advice
- [ ] simple zone signage
- [ ] network isolation/segmentation equipment already justified by the data SOP

Do not buy these merely because they are listed. Reuse existing suitable equipment first.

---

# Readiness sign-off

## NOT READY

Use this status if any of these apply:

- [ ] shed is not demonstrably dry/secure/suitable;
- [ ] exit/walkway is obstructed;
- [ ] there is no restricted unwiped storage;
- [ ] there is no clean/released storage;
- [ ] battery response is undefined;
- [ ] unknown devices would need to join the home LAN;
- [ ] devices cannot be uniquely identified and located;
- [ ] stock would overflow into living/outdoor/emergency areas.

**Decision:** `NOT READY`

---

## READY FOR SYNTHETIC TEST

All minimum physical controls above are in place, but external launch gates may still be open.

- [ ] Zone labels installed.
- [ ] AssetFlow locations created.
- [ ] Walkway/exit clear.
- [ ] Restricted and clean stock are physically separate.
- [ ] Bench reset procedure understood.
- [ ] Synthetic normal-intake drill passed.
- [ ] Synthetic full-unwiped-zone drill passed.
- [ ] Synthetic failed-wipe/data-hold drill passed.
- [ ] Synthetic MDM/lock drill passed.
- [ ] Synthetic outbound/recycler rejection drill passed.
- [ ] Battery emergency tabletop drill passed.

**Decision:** `READY FOR SYNTHETIC TEST`

---

## READY FOR BOUNDED PHASE 0 PILOT

This status is only available when the physical setup is ready **and** the relevant Phase 0 launch gates for the exact pilot scope are closed/evidenced.

- [ ] Physical shed checklist complete.
- [ ] Synthetic drills passed.
- [ ] First real batch fits every zone/capacity limit.
- [ ] Council/premises position for the scope is evidenced.
- [ ] Lease/landlord position is evidenced.
- [ ] Insurance is in force for the scope.
- [ ] Fair Trading/licence/hold workflow is resolved for the scope.
- [ ] Battery/emergency procedure is evidenced.
- [ ] Data/custody records are ready.
- [ ] Downstream route exists for every accepted category.
- [ ] First batch has reserved physical positions before booking.

**Decision:** `READY FOR BOUNDED PHASE 0 PILOT`

Do not convert this status into “general public intake approved”. Public/broader intake remains a separate scale gate.
