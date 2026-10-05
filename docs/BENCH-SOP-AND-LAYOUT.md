# Bench SOP and Physical Workflow

**Actual shed placement:** [SHED-ZONE-PLAN.md](SHED-ZONE-PLAN.md) maps these controls onto the photographed Phase 0 shed without publishing the private site photographs.\n\n**Benchmark reference:** [EWASTE-FACILITY-ZONE-BENCHMARK-AND-SHED-DESIGN.md](EWASTE-FACILITY-ZONE-BENCHMARK-AND-SHED-DESIGN.md) compares Bendigo E-Waste, FlipTech, WorkVentures, EraseIT, Greenbox, Sircel, CompNow/SustainIT, PonyUp, Reconnect and Close the Loop, plus R2/SERI, ANZRP and NSW safety guidance. The zones below are the canonical Phase 0 workflow; the exact shed wall/shelf map still requires a measured private site plan.

## Zones

1. **INTAKE / UNASSESSED** — no connection to home LAN.
2. **UNWIPED — RESTRICTED** — locked storage, controlled access.
3. **BATTERY HAZARD HOLD / EXCEPTION** — only for unexpectedly discovered risk while arranging safe action; not a normal inventory zone and not a public battery drop-off.
4. **DIAGNOSTICS / SANITISATION BENCH** — isolated/offline or segregated test network.
5. **REPAIR QUEUE / WIP**
6. **VERIFIED CLEARED / QA**
7. **READY FOR SALE / REUSE**
8. **PARTS / DONOR**
9. **DOWNSTREAM / RETURN / OUTBOUND**

Never mix unwiped and cleared assets.

## Phase 0 physical implementation

The professional pattern is a one-way **received/restricted → sanitise/test → repair/QA → released/outbound** flow. For a small shed, copy the boundaries rather than warehouse scale.

### Visitor / handoff boundary

- Customer/source handoff stays outside the controlled workshop area or at the doorway.
- No visitor access to unwiped, repair, parts or sale-ready stock.
- No unattended drop-off or gate pile.
- Confirm source, item count, visible safety condition and available storage position before custody transfers.

### A — Intake / unassessed

- One labelled tray/shelf near the handoff point.
- Phase 0 operating cap: **2 devices or one small labelled batch**, whichever is lower.
- Asset/source ID attached immediately.
- Same-day triage preferred; this is not long-term storage.

### B — Unwiped / restricted

- Best available lockable or physically restricted storage after the premises itself is proven suitable.
- Phase 0 operating cap: **4 data-bearing devices**.
- All possible data-bearing equipment defaults here until the media decision is complete.
- Full zone = no further data-bearing intake.
- No sale-ready stock shares this location.

### C — Diagnostics / sanitisation bench

The bench is a **processing position, not storage**.

- One active asset per work position.
- Unknown devices stay off the normal home LAN.
- Use a visible bench mode:
  - **RED / RESTRICTED** — unwiped identification/sanitisation;
  - **AMBER / WORK** — cleared diagnostics/repair;
  - **GREEN / CLEAN** — final QA/configuration/listing preparation.

If the same bench changes mode, perform a bench reset: secure/update the prior asset, remove its media/parts/labels, clear the surface, confirm no restricted material remains, then begin the next asset.

### D — Repair / WIP

- Small rack beside the bench, not on the bench.
- Phase 0 operating cap: **3 active devices**.
- Every item needs fault/goal, next action, parts/time ceiling and review date.
- Devices with no meaningful action for 14 days are reviewed for lawful return, parts or downstream routing. This is a pilot management rule, not disposal authority.

### E — Verified cleared / QA

- Small clean shelf physically separate from unwiped stock.
- Phase 0 operating cap: **2 devices**.
- Enter only after data release and repair/testing work is complete.
- Final QA covers function, battery/charger/accessories, lock/MDM state, software/support, grade, disclosure and record reconciliation.

### F — Ready for sale / reuse

- Dedicated clean shelving, physically separated from Zone B.
- Phase 0 operating cap: **4 devices**.
- Only released assets.
- Listing/channel and accessories linked to the asset.
- No repairs or donor-parts harvesting on this shelf.

### G — Parts / donor

Use a **fixed number of labelled lidded bins**, not an expanding miscellaneous pile.

- No loose unidentified storage media.
- No unsafe/swollen batteries.
- Donor chassis retain an asset ID until final disposition.
- Bin full = sort/use/outbound before adding capacity.

### H — Downstream / return / outbound

- Labelled shelf/crate near the exit where practical.
- Every item has a named destination and next date.
- Keep return, recycler/destruction and sold dispatch assets identifiable.
- No indefinite “outbound someday” pile.

## Battery hazard exception

Phase 0 does not intentionally accept damaged/swollen/wet/fire-affected battery devices.

If battery danger is discovered only after acceptance:

- stop work;
- do not charge or test;
- keep people away from the hazard;
- follow current NSW/site-specific emergency and isolation advice;
- arrange the appropriate receiver/advice pathway promptly;
- do not allow the exception area to become ordinary storage.

A generic metal box or “battery bin” must not be assumed to make damaged-battery storage safe.

## Suggested topology

The exact walls depend on the real shed, but preserve the flow:

```text
                     CLEAN SIDE
┌───────────────────────────────────────────────┐
│  READY FOR SALE        CLEARED QA            │
│                                               │
│  PARTS BINS            REPAIR / WIP           │
│                                               │
│                  PROCESSING BENCH             │
│                                               │
│  UNWIPED — RESTRICTED          INTAKE        │
│                                               │
│  OUTBOUND / RETURN                    DOOR    │
│                               ← HANDOFF OUTSIDE
└───────────────────────────────────────────────┘
                     DIRTY SIDE
```

Placement principles:

1. Intake near the door.
2. Restricted unwiped storage outside the visitor path.
3. Bench acts as the controlled crossing point between dirty and clean states.
4. Sale-ready stock as far from the unwiped/intake lane as practical.
5. Outbound near the door so residuals do not travel through clean inventory.
6. Nothing blocks the exit.
7. No ordinary inventory on the floor.
8. No stock against damp/mould/water-affected surfaces.
9. No charging beside the only exit.
10. Physical device location and AssetFlow status move together.

## Phase 0 total WIP limit

The first 20–30 devices are a **cumulative pilot**, not simultaneous storage permission.

Start with a provisional operational cap of **12 serialized devices physically held at once**, subject to the actual premises/capacity record and all external limits. Review after devices 5 and 10. Do not raise the cap unless stock remains locatable, routes clear promptly and the real site/insurance/premises constraints permit it.

## AssetFlow location IDs

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

Rule:

> **No physical move without a location/status event. No status release without a physical move.**

If the physical location and digital record disagree, hold the asset and reconcile it before release.

## SOP

1. **Receive** — assign intake ID, record authority/source/serial, photograph.
2. **Safety screen** — battery, contamination, mains damage.
3. **Lock screen** — account/MDM/BIOS/carrier/enterprise.
4. **Isolate data** — data-bearing assets go to restricted zone.
5. **Identify/spec** — model, CPU, RAM, storage, support horizon.
6. **Route decision 1** — reject / refurb / parts / recycle.
7. **Sanitise** — media-appropriate NIST SP 800-88 Rev.2-aligned method where applicable.
8. **Verify** — check outcome and retain logs.
9. **Diagnostics** — memory, storage health, CPU/GPU stress as appropriate, ports, battery, display/input/network.
10. **Repair/upgrade** — only after legal hold issues are resolved; record parts/labour.
11. **Final test** — repeat category checklist.
12. **Grade** — cosmetic + functional + battery.
13. **Clean** — safe non-damaging process.
14. **Price** — sold-data ceiling minus costs/risk; never below rational parts/scrap exit without reason.
15. **List/sell** — disclose defects; create sale record.
16. **Return/recall handling** — link to asset ID.
17. **Downstream** — record provider, weight/cost/rebate/certificate.

## Network rule

Unknown devices do not join the normal home/business LAN during ordinary triage. Use offline boot tools or an isolated/segmented test network until assessed.

## Stop-work conditions

- swollen/leaking/hot/smoking lithium battery;
- damaged mains wiring or opened mains PSU work outside competence/licensing;
- unclear ownership;
- unresolved enterprise/activation lock;
- unexpected sensitive data requiring escalation;
- no safe storage position;
- restricted/sale-ready location mismatch;
- any relevant zone at its approved capacity.
