# 13 — Safety and compliance skills (competence, not just rules)

**Answers:** `claudeGAPS.md` §13 (plus the test-and-tag question in 05 §5.3)
**Researched:** 2 Oct 2026

---

## Bottom line

- **FRNSW's position is to not fight a lithium-ion battery fire: evacuate and call 000.** A bucket of water or a hose on *small* flames is acceptable to stop spread, and a fire blanket or **dry-chemical-powder / CO₂ extinguisher** may be used **only if trained** and only from a distance, to protect the surroundings. They are "**not likely to fully extinguish**" the battery. **Call 000 even if the fire seems out**, because batteries re-ignite. If it's safe, move the device outside, away from combustibles, windows and doors. [Primary] https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/battery-and-charging-safety/what-should-i-do-if-my-battery-is-smoking-or-on-fire
- **SafeWork NSW** treats lithium-ion batteries as a named workplace hazard. The PCBU (which includes a sole trader) must assess risk and control use, storage, handling and charging. It has a dedicated hazard page, a webinar and a toolkit. [Primary] https://www.safework.nsw.gov.au/hazards-a-z/lithium-ion-batteries
- **Free competence path:** UNSW's free 4-hour battery safety course (05) + the FRNSW page + SafeWork's hazard page + a practised drill.

---

## 13.1 Lithium incident drill (write it, post it, practise it twice a year)

1. **Stop**: unplug the charger at the wall if it's safe to reach. Don't touch a hot or swelling device with bare hands.
2. **Assess**: hissing, popping, white/grey vapour or smoke means thermal runaway. **Get out and call 000.**
3. **If there are small flames and you're trained:** water (bucket/hose) on the flames to stop spread, or a fire blanket / DCP / CO₂ extinguisher **from a distance** to protect surroundings. Expect it **not** to go out fully.
4. **If it's only smoking / hot / swelling and can be moved safely** with tongs or a shovel into a metal container: take it **outside**, onto bare ground or concrete away from the house, windows and combustibles. Leave it there.
5. **Call 000 regardless.** Re-ignition risk lasts for hours.
6. **Afterwards:** don't bin it. Follow the repo's damaged-battery downstream route (not B-cycle drop-off points; see `INTAKE-POLICY.md`). Record it on the incident record (BACKLOG-30-32 §H).

## 13.2 Bench safety kit (costed in 03 §3.5)
- Smoke alarm (photoelectric) above the bench; a heat alarm in the shed.
- **Fire blanket** and a **DCP or CO₂ extinguisher** mounted by the exit (for surroundings, per FRNSW).
- A **metal bucket with sand/vermiculite** and a lid, plus long tongs, for moving a hot device outside.
- Charging only on a **non-combustible surface** (ceramic tile/steel sheet), never unattended or overnight (repo rule; consistent with SafeWork guidance).
- Charging/storage cabinet: SafeWork-adjacent guidance recommends purpose-built **ventilated battery charging cabinets** where batteries are stored or charged in quantity. **[Derived]** That's not needed at Phase 0 volumes if no loose batteries are accepted (current policy), but revisit if battery stock grows.

## 13.3 Electrical safety competence
See 05 §5.3. A one-day **UEERL0003 test-and-tag** course (about A$284–500) plus a PAT tester gives defensible competence for mains items (TVs, desktops, monitors, chargers), whatever the final reading of NSW second-hand electrical law. Don't do mains wiring work (repo rule).

## 13.4 Data-handling competence (self-check)
Before accepting the first business client, demonstrate for each media class in 03 §3.4 (HDD, SATA SSD, NVMe, Apple T2/Silicon, iPhone, Android, network gear):
- sanitise → verify → produce the record;
- a recovery attempt on the test media (e.g. `photorec`) finds nothing.
Keep these "validation" records (NIST Rev. 2 sense). This is the competence evidence behind the "documented secure data erasure" wording.

## 13.5 Soldering and fumes (later)
Only relevant once board-level repair starts (not Phase 0). Lead-free solder, a fume extractor with carbon filter, ventilation, and no eating at the bench. **[Open]**: cost a basic setup if repair becomes a revenue line.

## Sources
- FRNSW — battery smoking or on fire: https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/battery-and-charging-safety/what-should-i-do-if-my-battery-is-smoking-or-on-fire
- FRNSW — battery and charging safety: https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/battery-and-charging-safety
- FRNSW position statement — emergency plans at sites with lithium batteries: https://www.fire.nsw.gov.au/__data/assets/pdf_file/0012/4323/Position-statement-summary-Emergency-plan-requirements-at-sites-having-lithium-batteries.pdf
- FRNSW SARET literature review (2025): https://www.fire.nsw.gov.au/__data/assets/pdf_file/0018/8316/SARET-Report-001-Management-of-Lithium-ion-Battery-Safety-Risks-A-Literature-Review-of-Current-Knowledge-and-Best-Practices-V1.0.pdf
- SafeWork NSW — lithium-ion batteries: https://www.safework.nsw.gov.au/hazards-a-z/lithium-ion-batteries
- NSW — shop, charge, recycle safely: https://www.nsw.gov.au/energy/shop-charge-and-recycle-lithium-ion-batteries-safely
- UNSW free course: https://www.dgfi.unsw.edu.au/just-launched-free-battery-safety-short-course-online-self-paced
