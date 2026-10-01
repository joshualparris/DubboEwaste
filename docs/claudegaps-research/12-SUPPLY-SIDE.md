# 12 — Supply side: who actually holds retired IT in Dubbo

**Answers:** `claudeGAPS.md` §12
**Researched:** 2 Oct 2026

---

## Bottom line

- **There are at least 13 IT service providers/MSPs serving Dubbo** (list below). They're the strongest repeat-supply channel, because every client fleet refresh passes through them. **None has been asked yet** what they do with retired client hardware.
- **Avance Business Technology** (Dubbo MSP) appears in this list. The repo already flags Avance as a **conflict-of-interest / employment-permission** issue (`GAPS.md` §A.3, §E; `CALL-SCRIPTS.md` §8). **Resolve that before approaching any other MSP**, because competitors will ask.
- **Largest local fleet owner: Western NSW Local Health District** (about 1,166 employees on one directory count; Dubbo Hospital) plus NSW Government agencies, Dubbo Regional Council, schools, and the retail, construction and education sectors. Government fleets mostly go through **whole-of-government disposal contracts** (C9826, see repo) or **public auctions** (Grays, see 10), not to local operators.
- **Catholic schools in Dubbo are under the Catholic Education Diocese of Bathurst**, with shared ICT through **CEnet**. Their disposal process is separate from the NSW Department's EDConnect contract and hasn't been researched. **[Open — CALL]**
- **The Windows 10 wave is a marketed event.** Fliptech publicised a 7News segment on "Win 10 redundancy" (its site copy). Supply of Win10-only business PCs is **up now through Oct 2027**; their **retail value is falling**. Use them for parts, Linux/donation (see 02), or sell to the floor quickly.

---

## 12.1 Dubbo IT service providers / MSPs (outreach list)

| Provider | Publicly stated Dubbo presence | Source |
|---|---|---|
| **Avance Business Technology** | Dubbo; managed IT, software, cloud, cyber | https://avance.technology/solutions (**conflict-of-interest flag — see repo**) |
| Hi Tech ITworX | "Workshop in Dubbo"; remote + on-site | https://htw.net.au/locations/managed-it-dubbo/ |
| Dubbo ITS | Managed IT for Dubbo & Central West | https://dubboits.com.au/it-support-dubbo/ |
| Gravity IT | Local technicians in Dubbo | https://gravityit.com.au/dubbo/ |
| Toim | Dubbo team | https://toim.com.au/toim-dubbo |
| TechSend | Same-day on-site Dubbo | https://www.techsend.com.au/locations/sydney/dubbo/ |
| Colton Computer Technologies | Orange, Bathurst & Dubbo | https://coltoncomputers.com.au/managed-it-services/ |
| CBM Computers | Dubbo (already in repo competitor map) | localsearch listing |
| Revelation I.T. Solutions | Dubbo listing | https://www.localsearch.com.au/find/it-services-support/dubbo-nsw |
| Tech Exe | Dubbo listing | same |
| Viatek Central West NSW Pty Ltd | Dubbo listing | same |
| R & R Communications | Dubbo listing | same |
| Right Click Go | Dubbo listing | same |
| Orana Business Solutions, Tech Savvy Dubbo, Leading Edge Computers | Already in repo competitor map | `BACKLOG-17-20-MARKET-COST-TAX.md` §17 |

### Proposed MSP pitch [Derived from 09 Fliptech/ITC practice]
> "When your clients refresh, we collect the old fleet in Dubbo, record serials, securely erase to NIST 800-88 with a per-device report, and return a residual-value credit for reusable units, so you don't have to store or ship e-waste to Sydney. You keep the client relationship."

Three questions per MSP:
1. What happens to client hardware at refresh today: Sydney ITAD, Council, a storeroom, or the client keeps it?
2. Roughly how many devices a year across all clients?
3. Would a local per-device erasure report plus a buyback credit be useful?

Record the answers in a simple CRM sheet (provider, date, volume estimate, current route, interest 1–5).

## 12.2 Fleet owners

| Sector | Dubbo examples | Likely disposal route | Opportunity |
|---|---|---|---|
| Health | Western NSW LHD / Dubbo Hospital | NSW Health / whole-of-government contracts | Low (contracted); ask WNSWLHD procurement only later |
| Local government | Dubbo Regional Council (about 129 staff on one count; actual workforce likely larger) | Council procurement | Medium: Council relationship also matters for planning/waste |
| State agencies | Multiple NSW agencies with Dubbo offices | C9826 suppliers (G1, Greenbox, WorkVentures, Sims Lifecycle, etc.) | Low; possible subcontract via those suppliers (see repo branch docs) |
| Catholic schools | St John's College, St John's Primary etc. (Diocese of Bathurst; CEnet) | Unknown | **[Open — CALL]** the Diocese ICT team |
| Independent schools | e.g. Dubbo Christian School 🔎 | Unknown | **[Open — CALL]** |
| SMEs (law, accounting, agribusiness, medical practices, real estate) | ~4,500 businesses (repo) | Often via their MSP (see 12.1) or ad hoc | **High**: the target segment |
| Mining/energy services in the region | 🔎 | Corporate head-office ITAD | Low–medium |

Sources: https://www.nsw.gov.au/departments-and-agencies/wnswlhd/careers/our-communities/dubbo ; https://www.bth.catholic.edu.au/contact-us/ ; https://cenet.catholic.edu.au/ ; https://www.stjohnsdubbo.catholic.edu.au/_file/media/62/student_acceptable_use_of_technology_agreement_v2019.pdf

## 12.3 Pre-screen conversion
Not measurable until the rejection log (`templates/triage-reject-log.csv`, see 01) is in use. **[Open — TRY]**

## Sources
- Localsearch Dubbo IT: https://www.localsearch.com.au/find/it-services-support/dubbo-nsw
- Provider pages as linked in the table
- WNSWLHD: https://www.nsw.gov.au/departments-and-agencies/wnswlhd/careers/our-communities/dubbo
- Catholic Education Diocese of Bathurst: https://www.bth.catholic.edu.au/contact-us/ ; CEnet: https://cenet.catholic.edu.au/
- Fliptech Win10 copy: see 09 sources
