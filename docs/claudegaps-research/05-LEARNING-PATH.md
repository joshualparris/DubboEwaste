# 05 — Learning path: courses, certifications and local learning

**Answers:** `claudeGAPS.md` §5 and the skills parts of §13
**Researched:** 2 Oct 2026

> **CORRECTIONS (2 Oct 2026, from `claudeDOCS/D-LEARNING-AND-ELECTRICAL-LAW.md`):** (1) **iFixit MasterTech is on hold**, so drop step 8. (2) **UEE30920 requires an apprenticeship or current industry employment**, so it isn't an option; use **ICT30120 under Fee-Free TAFE (commence by 31 Dec 2026)**. (3) Add the **ADISA Foundation Data Sanitisation course (£250)** before offering B2B data services. (4) The free alternative to Messer is Coursera's Google IT Support certificate.

---

## Bottom line

- **Free first.** Professor Messer's complete CompTIA A+ video courses (about 10 hours for Core 1), UNSW's free 4-hour lithium-ion battery safety course, iFixit guides and the YouTube list in section 06 cover nearly everything Phase 0 needs, at **$0**.
- **Pay for one thing early:** a **one-day test-and-tag course (UEERL0003, about A$284–500 in NSW)**. NSW's legal position on testing second-hand electrical goods before resale is **contested** between sources (see 5.3). Being competent and owning a tester (or labelling items "untested") is the cheap hedge.
- **CompTIA A+ certification (about A$700–860 in exam fees)** is optional. It's worth it only when pitching B2B/ITAD clients who want credentials.
- Microsoldering (iFixit Pro Repair Academy, about US$7,900+) is **not** a Phase 0 skill.

---

## 5.1 Recommended learning path (in order)

| Step | What | Cost | Time | Why | Source |
|---|---|---|---|---|---|
| 1 | **UNSW "Understanding the Risks of Lithium-Ion Battery Safety"** (4 modules, self-paced) | Free | ~4 h | Safety before anything else. Australian. | https://www.dgfi.unsw.edu.au/just-launched-free-battery-safety-short-course-online-self-paced **[Primary]** |
| 2 | **Professor Messer CompTIA A+ 220-1201 (Core 1)**: hardware, laptops, mobile devices, networking, troubleshooting | Free | 63 videos / 10 h 11 min | Structured hardware/triage knowledge | https://www.professormesser.com/free-a-plus-training/220-1201/220-1201-video/220-1201-training-course/ **[Primary]** |
| 3 | **Professor Messer 220-1202 (Core 2)**: OS install, security, data destruction, operational procedures | Free | ~similar | OS reinstall, wipe concepts, procedures | https://www.professormesser.com/free-a-plus-training/220-1202/220-1202-video/220-1202-training-course/ **[Primary]** |
| 4 | **Bench practice** on the 10 Bendigo laptops already in hand (see `PROJECT-HISTORY-ALL-CHATS.md`): build the section 03 USB kit, time triage and wipes | Free | 2–3 weekends | Turns theory into timed skill | — |
| 5 | **Test and tag (UEERL0003)**, one day, nationally recognised | ~A$284–500 | 1 day (some virtual + practical) | Electrical safety competence for mains items (TVs, desktops, chargers) | Provider list: https://testtagcourses.com.au/courses/ ; https://www.licences4work.com.au/test-tag-electrical **[Secondary — prices from provider pages]** |
| 6 | **iFixit guides** for each model family accepted | Free | per device | Disassembly/repair | https://www.ifixit.com/ |
| 7 (optional) | **CompTIA A+ certification exams** (Core 1 + Core 2) | ~A$350–430 per exam (×2) | after steps 2–3 | B2B credibility | https://www.logitrain.com.au/courses/comptia/comptia-aplus.html ; https://prepforcerts.org/comptia-a-plus-exam-cost **[Secondary]** |
| 8 (optional) | **iFixit MasterTech** smartphone repair certification | 🔎 price | — | Only if phone repair becomes a revenue line | https://www.ifixit.com/Info/MasterTech |
| Later | Blancco/ADISA/R2/e-Stewards training | — | — | Only when chasing enterprise ITAD work | see 09 |

## 5.2 Formal qualifications (TAFE)

| Qualification | Status | Notes |
|---|---|---|
| **UEE30920 Certificate III in Electronics and Communications** (TAFE NSW) | ✅ offered by TAFE NSW | Install/test/repair electronic equipment. It's an apprenticeship-scale course, **overkill for Phase 0**. Dubbo/TAFE Western campus availability **[Open — CALL TAFE NSW 131 601]**. https://www.tafensw.edu.au/course-areas/electrotechnology/courses/certificate-iii-in-electronics-and-communications--UEE30920-01 |
| **ICT30120 Certificate III in Information Technology** | ✅ TAFE NSW offers it, with fee-free/reduced-fee options per Skills NSW | Closer to IT support. Check Dubbo/online delivery and Fee-Free TAFE eligibility. https://skills.education.nsw.gov.au/ict30120-t ; https://www.tafensw.edu.au/course-areas/information-and-communication-technology/information-technology-and-networking |
| Certificate II in Computer Assembly and Repair | ✅ exists (WA, VIC) | Not confirmed in NSW. Possibly online interstate. https://www.southmetrotafe.wa.edu.au/courses/certificate-ii-computer-assembly-and-repair |

**[Derived]** A formal qualification isn't needed to start. If one is wanted, **ICT30120 via Fee-Free TAFE** is the best value. Confirm eligibility with Skills NSW.

## 5.3 Test-and-tag and NSW second-hand electrical law: CONFLICTING EVIDENCE

| Claim | Source | Weight |
|---|---|---|
| "In NSW, dealers in second-hand electrical goods must test and tag items before offering them for sale" | Test-and-tag industry blog: https://roshaaco.com/test-and-tag-required-second-hand-goods-sold-australia/ | **Low**: commercial blog, no clause cited |
| NSW Government: second-hand electrical articles are covered by the Gas and Electricity (Consumer Safety) Act 2017; a second-hand article must have been approved when sold new; sellers "have legal obligations to ensure your safety". **No explicit test/tag/label rule on the page.** | https://www.nsw.gov.au/housing-and-construction/safety-home/electrical-safety/buying-and-using-electrical-appliances | **High**, but silent on the specific point |
| Repo (BACKLOG-21-25): SafeWork's test-and-tag duty applies to *workplace equipment in hostile environments*; **no evidence of a blanket resale rule** | `BACKLOG-21-25-COMPLIANCE-DATA-SAFETY.md` | Medium |
| Some states (e.g. Tasmania, per the CBOS regulatory guide) require a **label on second-hand electrical articles sold in business**: either "tested by a competent person and found safe" or "not tested". **AS/NZS 5761** is the standard for testing second-hand equipment before sale | https://www.cbos.tas.gov.au/__data/assets/pdf_file/0006/457341/CBOS-ESS-Regulatory-Guide-Selling-second-hand-electrical-articles.pdf (403 to automated fetch; content via search snippet) | Medium (other state) |

**The NSW regulation text (Gas and Electricity (Consumer Safety) Regulation 2018, Part 6 "general restrictions on sale")** sits behind Cloudflare and couldn't be read automatically. **[Open — read Part 6 in a browser, or ask NSW Fair Trading's electrical safety team.]** Exact question: *"Does a business selling second-hand mains-powered electrical articles in NSW have to test them to AS/NZS 5761 or attach a tested/untested label before sale?"*

**[Derived] Safe interim policy:** for any mains-powered item sold (TVs, desktops, monitors, chargers), either (a) test to AS/NZS 3760/5761 practice with a PAT tester after the course and attach a tag, or (b) don't sell it. Laptop/phone power bricks: sell only original, approval-marked chargers.

## 5.4 Local, in-person learning and networks

| Resource | Finding | Next step |
|---|---|---|
| **Dubbo Community Men's Shed Inc.**, 171 Talbragar St, Dubbo. Mon 9–1, Thu 1–5, Sat 1–5. Contact listed as Peter Cluff, 02 6881 6987 | Woodwork/metalwork focus; no electronics program found | Ask if members include retired electronics/IT techs; offer to run a "fix your old laptop" session there. https://mensshed.org/sheds/dubbo-community-mens-shed-inc/ |
| **South Dubbo Veterans & Community Men's Shed**, 60 Palmer St. 0411 054 832 | Lists "Workshop & Repair Activities" | Same approach. https://mensshed.org/sheds/south-dubbo-veterans-community-mens-shed/ |
| **Repair Café** | **No Repair Café found in Dubbo or the Central West** (Orange/Bathurst/Mudgee/Parkes searched). Repair Café Australia lists 40+ nationally | **Opportunity:** start "Repair Café Dubbo" (free skills practice, supply leads, council goodwill). Registration via Repair Café International/Australia. https://www.facebook.com/RepairCafeAustralia/ ; https://transitionaustralia.net/community-repair-cafes-hubs/ |
| **NSW Business Connect → "Small Business Advisory"** | Free one-on-one advice. **Being replaced by a A$37m "Small Business Advisory" program with full services from Feb 2027**; Central NSW Business HQ has delivered Business Connect regionally | Book a session before the transition. https://business.nsw.gov.au/support-for-business/businessconnect/connecting-with-an-advisor ; https://www.smartcompany.com.au/business-advice/business-connect-replacement-small-business-advisory/ ; https://bizhq.com.au/business-connect-advisors/ |
| Local repairers (CBM Computers, Tech Savvy Dubbo, phone shops) | Not contacted | **[Open — CALL]** paid shadowing or a parts/referral relationship |
| Bendigo E-Waste / Reconnect site visit | Not arranged | **[Open — CALL]** highest-value single learning day |

## Sources
- UNSW battery safety course: https://www.dgfi.unsw.edu.au/just-launched-free-battery-safety-short-course-online-self-paced
- Professor Messer A+: https://www.professormesser.com/free-a-plus-training/220-1201/220-1201-video/220-1201-training-course/ ; https://www.professormesser.com/free-a-plus-training/220-1202/220-1202-video/220-1202-training-course/
- Test and tag providers: https://testtagcourses.com.au/courses/ ; https://www.licences4work.com.au/test-tag-electrical ; https://www.wamtraining.com.au/courses/electrical-test-and-tag/
- NSW electrical appliances: https://www.nsw.gov.au/housing-and-construction/safety-home/electrical-safety/buying-and-using-electrical-appliances
- NSW regulation (blocked to automation): https://legislation.nsw.gov.au/view/html/inforce/current/sl-2018-0501
- Tasmania CBOS guide: https://www.cbos.tas.gov.au/__data/assets/pdf_file/0006/457341/CBOS-ESS-Regulatory-Guide-Selling-second-hand-electrical-articles.pdf
- TAFE NSW / Skills NSW: https://www.tafensw.edu.au/course-areas/electrotechnology/courses/certificate-iii-in-electronics-and-communications--UEE30920-01 ; https://skills.education.nsw.gov.au/ict30120-t
- CompTIA pricing: https://www.logitrain.com.au/courses/comptia/comptia-aplus.html ; https://prepforcerts.org/comptia-a-plus-exam-cost
- iFixit: https://www.ifixit.com/Info/MasterTech ; https://www.ifixit.com/ifixit-pro-repair-academy
- Men's Sheds: https://mensshed.org/sheds/dubbo-community-mens-shed-inc/ ; https://mensshed.org/sheds/south-dubbo-veterans-community-mens-shed/
- Business Connect: https://business.nsw.gov.au/support-for-business/businessconnect/connecting-with-an-advisor ; https://www.smartcompany.com.au/business-advice/business-connect-replacement-small-business-advisory/
