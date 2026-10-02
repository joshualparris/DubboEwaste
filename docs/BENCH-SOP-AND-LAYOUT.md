# Bench SOP and Physical Workflow

## Zones
1. **INTAKE / UNASSESSED** — no connection to home LAN.
2. **UNWIPED — RESTRICTED** — locked storage, controlled access.
3. **BATTERY HAZARD HOLD** — only for unexpectedly discovered risk while arranging safe action; not a public battery drop-off.
4. **DIAGNOSTICS / SANITISATION BENCH** — isolated/offline or segregated test network.
5. **REPAIR QUEUE**
6. **VERIFIED CLEARED**
7. **READY FOR SALE**
8. **PARTS**
9. **DOWNSTREAM / OUTBOUND**

Never mix unwiped and cleared assets.

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
- no safe storage position.
