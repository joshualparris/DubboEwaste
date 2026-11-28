# DubboEwaste master gap research v2 — results

> **Correction after corpus audit:** [audit and reconciliation](CORPUS-AUDIT-AND-GAP-RECONCILIATION-2026-11-28.md). Sircel entered receivership/administration on **31 October 2025**, not 2026; current route unverified. LEP 2025 consolidation clause 5.4 shows 30 m² for home business, 50 m² for home industry; current legal version and site classification still require confirmation. NSW official Sept 2026 guidance and Parliament identify Regulation 2026 No 442. Battery commencement/transition discrepancy is not closed without proclamation and PSO evidence.


**28 November 2026 AEDT.** Executes the [v2 prompt](MASTER-GAP-RESEARCH-V2-PROMPT-2026-11-28.md), building on the same-day [120-question results](MASTER-GAP-RESEARCH-RESULTS-2026-11-28.md). Public desk research only — not legal advice. No organisation has been contacted and nothing has been sent.

**Scope.** A machine sweep of every research file found 1,458 open-gap lines across four repos. They consolidate into 69 questions: 35 desk questions and 34 that need a contact, a pilot measurement or an owner decision. Of the 35 desk questions, this pass **answered 16**, found **partial** answers to 11, **found nothing** for 2, left 1 **unresolved** and didn't reach 5. Register: [question-register.csv](../data/master-gap-v2-2026-11-28/question-register.csv) · evidence: `EVD-GAP2-*` in [data/evidence.yaml](../data/evidence.yaml).

## What changed

1. **Sircel is in voluntary administration** (KordaMentha appointed 31 October 2025). The repo's strongest regional downstream lead, Sircel Parkes, can't be relied on. Dated notes added to the AMR forensic and "what happens to e-waste" docs. (WP05-01)
2. **NSW's mandatory battery stewardship scheme is live** — it commenced 1 October 2026, with no Product Stewardship Organisation appointed yet. Obligations sit with brand owners. Ask the EPA whether a refurbisher that imports replacement batteries counts as one; buying batteries from local suppliers probably avoids it. (WP08-01)
3. **Don't resell e-bikes or e-scooters.** Since 1 February 2026, second-hand e-micromobility devices and their batteries must be tested, certified and marked before sale in NSW. Intake policy note added. (WP02-05)
4. **No NSW test-and-tag rule for second-hand electrical resale was found** — but declared articles must have been approved when new, and sellers must still make sure goods are safe. Sell only items with original compliance marks, record a safety check, and state test status in listings. (WP02-04)
5. **Repairing plug-in devices isn't licensed electrical work** under the NSW definitions — the licence covers work on electrical installations. Stay off hard-wired equipment and mains internals. (WP08-02)
6. **A home business can be exempt development** if it meets the definition, stays within the LEP floor-area cap (statewide floor 30 m²), has at most two non-resident staff and one 1 m² sign. Dubbo's exact clause 5.4 figure still needs reading off the LEP, and Council should confirm the activity fits. (WP01-01, WP01-02)
7. **Windows 10 donations have until 12 October 2027** on consumer ESU (extended in June 2026). The intake policy already says this — confirmed. (WP07-01)
8. **Device banks are real and short of devices.** The NSW Device Bank (May 2026 pilot) distributes through regional community organisations, and the National Device Bank says demand exceeds supply. A Dubbo charity partner, not Dubbo eWaste itself, is the eligible applicant. (WP06-01)
9. **Privacy Act small business exemption survives the 2026 reform draft.** Keep good data handling anyway. (WP02-06)
10. **No suitable grant is open now**, and national reform isn't heading for computer reuse targets soon — September's Environment Ministers' Meeting prioritised packaging, batteries and solar. Budget zero grant income. (WP12-01, WP12-02)

**Time-sensitive:** the EPA's regional Waste and Circular Infrastructure Plan consultation closes **5pm Monday 30 November 2026** (draft submission in the 120-question results). Dubbo's 2026/27 community funding closes 28 February 2027.

## Launch gates — what moved

| Gate | Status | What this pass added | Still needed |
| --- | --- | --- | --- |
| Premises/planning | EXTERNAL-BLOCKED | Exempt home-business conditions confirmed | Dubbo clause 5.4 figure; Council written classification |
| Lease, workspace, insurance | EXTERNAL-BLOCKED | Premium range for budgeting | Landlord consent; written insurer acceptance naming lithium and second-hand electronics |
| Fair Trading / resale | EXTERNAL-BLOCKED | Retention rule; electrical resale position; e-micromobility exclusion | Which Regulation is current; Fair Trading's written view on the recycling-program exemption |
| Data and battery workflow | DESIGNED / PILOT-ONLY | ESU date; licence boundary; incident notification; battery-scheme question | Representative device tests; EPA answer on brand-owner status |
| Downstream route | EXTERNAL-BLOCKED | Sircel removed as a lead | EcoCycle/MobileMuster/AMR written terms |

No gate closes on desk research alone — that matches CURRENT-STATE.

## Desk findings by work package

Each row's sources are numbered links. Rows marked *Not researched in this pass* stay open for the next pass.

### WP01 — Premises, planning and property

| ID | Status | Finding | Next |
| --- | --- | --- | --- |
| WP01-01 | **Answered** | Yes, if the use meets the Standard Instrument definitions: the Codes SEPP lets a dwelling be used for a home business, home industry or home occupation as exempt development, with up to 2 non-resident employees, one sign up to 1 m², and the floor-area cap in the council LEP's clause 5.4 (no less than 30 m²). Exclusions (food manufacture, skin penetration, sex services) don't affect electronics. Sources: [1](https://planning.nsw.gov.au/the-planning-system/development-assessment/planning-approval-pathways/development-types/home-based-enterprises) [2](https://www.planning.nsw.gov.au/sites/default/files/2023-02/home-based-enterprises-rules-for-exempt-and-complying-development.pdf) | Read Dubbo LEP 2022 cl 5.4 for the exact m² figure; then ask Council planning to confirm the activity fits 'home business' (WP01-04). |
| WP01-02 | **Partial** | The amendment history lists changes to clause 5.5, the R5 land-use table, Boundary Road clause 7.13, group homes and map amendments; none listed touches clause 5.4. The figure itself wasn't retrieved (the legislation site fetch failed). The statewide floor is 30 m². Sources: [1](https://legislation.nsw.gov.au/view/html/inforce/2023-11-01/epi-2022-0108/lh) [2](https://legislation.nsw.gov.au/view/pdf/asmade/epi-2022-108) | Open the current LEP on legislation.nsw.gov.au, clause 5.4(2)–(3), and record the number. |
| WP01-03 | **Partial** | Prior research (other session A04) found these can be separate land uses and that being under EPA thresholds does not settle land use. Not re-researched in this pass.  | Ask Council planning in the same written enquiry as WP01-04. |

### WP02 — Legal entity, second-hand dealing, tax and privacy

| ID | Status | Finding | Next |
| --- | --- | --- | --- |
| WP02-01 | **Unresolved** | The regulation text found says the Act does not apply to conducting a recycling or rubbish collection program, selling goods collected in one, or contracting to give someone ownership of such goods. That text is in the Pawnbrokers and Second-hand Dealers Regulation 2021. NSW's staged repeal would have ended the 2021 Regulation around 1 September 2026, so a 2026 remake may now be current — other repo notes cite 'Regulation 2026'. Which instrument is in force wasn't confirmed. Sources: [1](https://legislation.nsw.gov.au/view/whole/html/inforce/current/sl-2021-0044) | Check legislation.nsw.gov.au for a 2026 Regulation and compare the exemption wording; then ask Fair Trading in writing whether refurbish-and-sell of donated devices is a 'recycling program'. |
| WP02-02 | **Answered** | No alteration until the retention period ends, and goods must be kept on notified premises (NSW business obligations page). Fair Trading grants some licensees limited exemptions, including from retention where the seller already held the goods for the required period. Whether data wiping is 'alteration' isn't stated. Sources: [1](https://www.nsw.gov.au/business-and-economy/running-a-business/industry-specific-business-requirements/pawnbrokers-and-second-hand-dealers) [2](https://www.nsw.gov.au/business-and-economy/running-a-business/industry-specific-business-requirements/pawnbrokers-and-second-hand-dealers/limited-exemptions-for-pawnbrokers-and-second-hand-dealers) | If licensed, don't wipe during the hold; ask Fair Trading whether data erasure counts as alteration. |
| WP02-04 | **Answered** | No NSW clause requiring test-and-tag or an 'untested' label for second-hand articles was found: Part 6 of the Gas and Electricity (Consumer Safety) Regulation covers safety-direction notices and disposal of non-conforming articles. NSW guidance says a second-hand declared article must have been approved when sold new, and sellers of second-hand electrical equipment have obligations to ensure it's safe. Queensland, by contrast, requires sellers to tell buyers if an item is untested. Sources: [1](https://legislation.nsw.gov.au/view/whole/html/inforce/2020-09-02/sl-2018-0501) [2](https://www.nsw.gov.au/housing-and-construction/electrical-safety/buying-and-using-electrical-appliances) [3](https://www.nsw.gov.au/topics/electrical-safety/buying-and-using-appliances) [4](https://worksafe.qld.gov.au/safety-and-prevention/hazards/electricity/electrical-products-and-equipment/selling-electrical-equipment/selling-second-hand) | Only resell items with original compliance marks; run and record a safety check; disclose test status in listings as good practice. Check the current Regulation version for changes since 2020. |
| WP02-05 | **Answered** | Not without testing, certification and marking: from 1 February 2026 e-micromobility devices and their lithium-ion batteries sold in NSW, including second-hand ones and former hire fleets, must be tested, certified and marked. They are now declared electrical articles. Sources: [1](https://www.nsw.gov.au/housing-and-construction/safety-home/electrical-safety/lithium-ion-battery-safety/new-standards-for-lithium-ion-batteries-e-micromobility-devices) [2](https://www.eess.gov.au/wp-content/uploads/2026/05/General-Safety-tips-for-Lithium-ion-battery-powered-equipment-v1.0-EESS-Template-new.pdf) | Exclude e-micromobility from intake and resale; add to INTAKE-POLICY reject list. |
| WP02-06 | **Answered** | Yes for now: the tranche 2 exposure draft (Privacy Amendment (Personal Data Protection) Bill 2026, released 31 August 2026) does not remove the small business exemption, so businesses under $3 million turnover stay outside the Act unless another trigger applies. Sources: [1](https://www.sparke.com.au/insights/a-new-era-for-privacy-in-australia-implications-of-privacy-act-reform-tranche-2/) [2](https://www.aoshearman.com/en/insights/new-rules-of-engagement-australias-draft-privacy-bill-and-what-it-means-for-your-business) | Keep APP 11-style controls anyway; donors and partners will expect them. |
| WP02-07 | **Partial** | Other session (B07): Division 66 may allow credits on qualifying second-hand goods acquired for resale, not automatically on free devices. Not re-researched.  | Accountant. |

> **WP02-01 update (28 Nov 2026):** answered in part. The current instrument is Regulation 2026 No 442 (published 21 Aug 2026); the exemption is now cl 33 and covers *buying or selling goods collected in* a recycling or rubbish collection program. Whether this model is a "program" still needs Fair Trading (WP02-03). See [RECYCLING-PROGRAM-EXEMPTION-RESEARCH-2026-11-28.md](RECYCLING-PROGRAM-EXEMPTION-RESEARCH-2026-11-28.md).

### WP03 — Insurance and liability

| ID | Status | Finding | Next |
| --- | --- | --- | --- |
| WP03-01 | **Answered** | Typical public and products liability premiums were $370–$840 a year (median around $605) across 2,000+ policies arranged by one broker in 2022–26; BizCover's FY24 average for NSW was about $39 a month. These are all-industry figures, not electronics-refurbishment quotes. Sources: [1](https://www.upcover.com/blog/public-liability-insurance-cost-australia) [2](https://www.bizcover.com.au/public-liability-insurance-cost/) | Get two written quotes naming second-hand electronics resale and lithium batteries. |

### WP04 — Council, Whylandra and regional waste flow

| ID | Status | Finding | Next |
| --- | --- | --- | --- |
| WP04-01 | **Not found** | No e-waste award appears in Council's 2025 meeting outcomes or its 'recently awarded tenders' page (checked 28 Nov 2026), consistent with the 20 Nov 2026 GIPA register check. It may sit under purchase-order thresholds or a regional arrangement (inference). Sources: [1](https://www.dubbo.nsw.gov.au/about-council/work-at-council/doing-business-with-council) | Informal information request to Council (templates/drc-ewaste-information-request.md). |
| WP04-03 | **Partial** | Dubbo was one of the first 21 CRCs in the NSW EPA trial (September 2024 to September 2026), and Council was still promoting it in July 2026. NTCRS products such as laptops are excluded. The processor, volumes and post-September 2026 status aren't public. Sources: [1](https://www.epa.nsw.gov.au/embedded-batteries) [2](https://www.dubbo.nsw.gov.au/news-and-media/news-and-resources/council-news/weekly-wrap) | Ask NSW EPA (draft in the EcoCycle enquiry templates). |
| WP04-04 | **Answered** | Draft Chapter 2 of the Waste and Circular Infrastructure Plan covers regional NSW — underinvestment, capacity shortages and high transport and recycling costs — and consultation closes Monday 30 November 2026. Sources: [1](https://newshub.medianet.com.au/2026/10/regional-waste-solutions-on-the-table/177204/) [2](https://yoursay.epa.nsw.gov.au/draft-nsw-waste-and-circular-infrastructure-plan-chapter-2) | Optional: lodge a short submission by 5pm Monday 30 November (draft in the other session's results doc). |
| WP04-05 | **Partial** | Other session (C06): adopted strategy proposes it; no funding or completion evidence. Not re-researched.  | — |
| WP04-07 | **Partial** | Council extended the pre-booked bulky rubbish collection trial to 30 June 2026; electronics rules and post-June status weren't checked. Sources: [1](https://www.dubbo.nsw.gov.au/news-and-media/news-and-resources/council-news/2025/pre-booked-bulky-rubbish-collection-trial-extended) | — |

### WP05 — Downstream recyclers and stewardship schemes

| ID | Status | Finding | Next |
| --- | --- | --- | --- |
| WP05-01 | **Answered** | Sircel entered voluntary administration: KordaMentha's Richard Tucker and Ryan Rabbitt were appointed on 31 October 2025, with a first creditors' meeting on 12 November. Sircel had six sites including its Parkes solar-panel plant. Sources: [1](https://reneweconomy.com.au/shock-and-dismay-as-one-of-australias-biggest-solar-recycling-hopes-put-into-administration) [2](https://mraconsulting.com.au/?p=8274) | Drop Sircel Parkes as a planning assumption; ask TechCollect/ANZRP who now services NSW collections. |
| WP05-02 | **Partial** | No current TechCollect Dubbo site was found. A 2019 NetWaste e-waste poster listed Wellington (inside Dubbo Regional LGA), Narromine, Orange and Mudgee among drop-off points; that's historical. Council's A–Z guide points residents to Council depots and says Officeworks accepts some e-waste. Sources: [1](https://www.oberon.nsw.gov.au/files/assets/public/v/1/waste-garbage-services/191204-e_waste_acceptableitems_a4poster_print-1.pdf) [2](https://www.dubbo.nsw.gov.au/Households-Residents/Rubbish-Recycling-and-Sustainability/Domestic-Waste-Services/a-z-recycling) | Check TechCollect's and Ecycle Solutions' site finders. |
| WP05-07 | **Open** | Not researched this pass; see DOWNSTREAM-PROVIDER-DUBBO-COST-COMPARISON.md (October). Sircel's administration changes that comparison.  | — |

### WP06 — Supply, institutional disposal and procurement

| ID | Status | Finding | Next |
| --- | --- | --- | --- |
| WP06-01 | **Answered** | The NSW Device Bank launched in May 2026 as a 12-month pilot run by NSW Telco Authority with WorkVentures. It refurbishes surplus government laptops and distributes them, with Good Things Australia, through community organisations and charities in metro, regional and remote NSW; the first laptops went out by late July 2026. Community organisations apply through WorkVentures' EOI. The separate National Device Bank (WorkVentures and Good Things Australia) takes business and government donations, and reported in February 2026 that demand exceeded devices committed. Sources: [1](https://jodieharrison.com.au/news/latest-news/nsw-device-bank-delivers-first-laptops-to-help-hurdle-digital-barriers/) [2](https://www.theindiansun.com.au/2026/05/21/refurbished-laptop-program-targets-digital-access-gap-across-nsw/) [3](https://workventures.com.au/nswdb-eoi) [4](https://itbrief.com.au/story/call-for-device-donations-as-digital-divide-widens) | Point a Dubbo charity partner at the WorkVentures EOI; Dubbo eWaste itself isn't the eligible applicant. |
| WP06-02 | **Partial** | Other session: dedicated contract confirmed (June 2026 procedure), vendor not named. Not re-researched.  | — |
| WP06-05 | **Answered** | About 57,400 (ABS estimated resident population series via City Population). Sources: [1](https://www.citypopulation.de/en/australia/admin/new_south_wales/12390__dubbo_regional) | — |
| WP06-06 | **Open** | Not researched this pass.  | — |

### WP07 — Data sanitisation, operating systems, locks and ownership

| ID | Status | Finding | Next |
| --- | --- | --- | --- |
| WP07-01 | **Answered** | Windows 10 support ended 14 October 2025. On 25 June 2026 Microsoft extended consumer Extended Security Updates by a year, so enrolled personal devices get security updates until 12 October 2027 (Microsoft's Australian page confirms). Microsoft 365 apps keep security updates on Windows 10 until 10 October 2028. Sources: [1](https://www.microsoft.com/en-AU/windows/end-of-support) [2](https://bleepingcomputer.com/news/microsoft/microsoft-quietly-extends-free-windows-10-esu-support-to-october-2027) | Confirms INTAKE-POLICY.md (already says 12 October 2027). Ship Windows 11 where eligible; otherwise tell recipients to enrol in ESU and plan Linux or ChromeOS Flex before October 2027. |

### WP08 — Battery, electrical safety and WHS

| ID | Status | Finding | Next |
| --- | --- | --- | --- |
| WP08-01 | **Partial** | The Product Lifecycle Responsibility Regulation 2026 commenced on 1 October 2026 as Australia's first mandatory battery stewardship scheme; obligations fall on brand owners, and with no Product Stewardship Organisation appointed yet, brand owners must comply individually. Whether a refurbisher that imports replacement batteries or supplies devices containing batteries is a 'brand owner' wasn't established. Sources: [1](https://hamiltonlocke.com.au/new-energy-bulletin-new-south-wales-battery-stewardship-scheme-now-in-effect/) [2](https://hamiltonlocke.com.au/new-energy-bulletin-australias-first-mandatory-battery-stewardship-scheme-what-you-need-to-know/) | Ask NSW EPA whether buying replacement batteries from local suppliers (not importing) keeps Dubbo eWaste out of brand-owner obligations. |
| WP08-02 | **Answered** | An electrical licence is needed for 'electrical wiring work' — physical work on an electrical installation. Older NSW definitions exclude appliances connected through a socket from the installation, and disconnecting or reconnecting hard-wired equipment needs its own certificate. So repairing plug-in laptops and power supplies isn't licensed wiring work (inference from definitions); general safety duties still apply. Sources: [1](https://www.nsw.gov.au/business-and-economy/licences-and-credentials/building-and-trade-licences-and-registrations/electrical) [2](https://ablis.business.gov.au/service/nsw/contractor-licence-electrical-individual/16548) [3](https://legislation.nsw.gov.au/view/whole/pdf/repealed/2024-12-28/sl-1998-0499) | Don't open mains-side PSUs or hard-wired equipment; confirm with Building Commission NSW if in doubt. |
| WP08-03 | **Answered** | A PCBU must notify SafeWork NSW immediately on 13 10 50 of a serious injury, illness, death or dangerous incident caused by a lithium-ion battery; SafeWork, FRNSW, Fair Trading and the EPA publish joint charge/store/recycle guidance. Sources: [1](https://www.safework.nsw.gov.au/hazards-a-z/lithium-ion-batteries) [2](https://www.nsw.gov.au/shop-charge-recycle) | Add the notification step to SAFETY-DECISION-TREES.md. |
| WP08-05 | **Open** | Not re-researched this pass (prior answer ✅🟡 in claudeDOCS F).  | — |

### WP09 — Triage, repair, testing, parts and skills

| ID | Status | Finding | Next |
| --- | --- | --- | --- |
| WP09-01 | **Answered** | TAFE NSW opened fee-free applications on 8 November 2026 for courses starting from 1 January 2027. The NSW Fee Free list includes Certificate II in Electrotechnology (Career Start), standard fee $5,450 and estimated $0–$1,000, delivered online or mixed. TAFE NSW Dubbo runs the Certificate III Electrician at Myall Street. Sources: [1](https://www.tafensw.edu.au/jobtrainer) [2](https://skills.education.nsw.gov.au/nsw-fee-free/information-media-telecommunications?is_nff=1) [3](https://www.tafensw.edu.au/offering/-/o/o/UEE30820-01V01-22DUB-021/Certificate-III-in-Electrotechnology-Electrician) | Check eligibility; places are limited. |
| WP09-03 | **Open** | Not researched this pass.  | — |
| WP09-04 | **Partial** | Prior 🟡 answers in claudeDOCS A; not refreshed.  | — |

### WP10 — Market, pricing, economics and capacity

| ID | Status | Finding | Next |
| --- | --- | --- | --- |
| WP10-02 | **Open** | Not researched this pass.  | — |

### WP11 — Repair Café, digital inclusion and community

| ID | Status | Finding | Next |
| --- | --- | --- | --- |
| WP11-01 | **Not found** | None surfaced in 2026 web results, while many metropolitan and Victorian councils run them (Hornsby runs electronics-only sessions with one item per person and bookings). Absence of a listing doesn't prove there isn't one. Sources: [1](https://www.hornsby.nsw.gov.au/Community/Events/Sustainability-waste-events-folder/Repair-Caf%C3%A9-Electronic-Sessions) | Ask Macquarie Regional Library, Men's Sheds and Council's sustainability team. |

### WP12 — Policy, funding, circular economy and impact

| ID | Status | Finding | Next |
| --- | --- | --- | --- |
| WP12-01 | **Partial** | Nothing suitable is open. The EPA's Local Government Waste Solutions Fund is for councils in the waste-levy area (Round 4 closed October 2025; it funded a Port Macquarie reuse/repair event pilot) — Dubbo is likely outside the levy area (inference). The Environmental Trust's 2026 rounds have closed. The EPA's Together on Country program supports Aboriginal communities' circular-economy work and business partnerships and may fit a partnership. Dubbo's 2026/27 community funding closes 28 February 2027 (other session). Sources: [1](https://www.epa.nsw.gov.au/Working-together/Grants) [2](https://www.nsw.gov.au/grants-and-funding/local-government-waste-solutions-fund-round-4/recipients) [3](https://www.environment.nsw.gov.au/node/21836) [4](https://www.epa.nsw.gov.au/Working-together/Grants/Illegal-dumping/together-on-country) | Budget zero grant income; watch the EPA grants calendar. |
| WP12-02 | **Answered** | Not soon. At the 18 September 2026 Environment Ministers' Meeting, ministers agreed a Circular Economy Roadmap with packaging, batteries and solar panels as the first national harmonisation priorities. The Productivity Commission's reuse/repair target recommendation for the NTCRS remains a recommendation. Sources: [1](https://enviliance.com/regions/oceania/au/report_17822) [2](https://www.pc.gov.au/inquiries-and-research/circular-economy/report) | Plan without NTCRS reuse credit. |

### WP13 — Governance, records, software and research integrity

| ID | Status | Finding | Next |
| --- | --- | --- | --- |
| WP13-01 | **Answered** | From this pass: (1) Sircel Parkes as a live downstream lead — Sircel is in administration (dated notes added to AMR-DUBBO-DOWNSTREAM-FORENSIC.md and WHAT-HAPPENS-TO-EWASTE.md); (2) whole e-bikes and e-scooters now need certification before resale (note added to INTAKE-POLICY.md); (3) the NSW battery scheme described as pending elsewhere commenced 1 October 2026. Windows 10 ESU in INTAKE-POLICY.md (12 October 2027) was checked and is correct. Which second-hand dealer Regulation is current stays unresolved.  | Annotate the affected docs with a dated correction note rather than rewriting them. |

## Field-closure pack — contact, pilot and decision questions

These can't be closed by research. Use the existing templates in [templates/](../templates/) — notably the approval request pack, the Council information request, the AMR evidence request and the 28 November EcoCycle/MobileMuster/Officeworks drafts.

| ID | Type | Question | Who / how |
| --- | --- | --- | --- |
| WP01-04 | Contact | Will Council confirm in writing that the actual activity (appointment-only, capped storage, online sales, no public drop-off) is an exempt home business at the actual site? | Use templates/phase-0-approval-request-pack.md; keep the address private. |
| WP01-05 | Contact | Does the lease or landlord allow a home business, storage and visitors? | Written landlord consent. |
| WP01-06 | Contact | What re-classification is triggered if public drop-off, a sign or extra traffic is added later? | — |
| WP01-07 | Pilot | Is the shed dry, secure and within work-in-progress caps in practice? | Inspection record using MINIMUM-PHYSICAL-SHED-SETUP-CHECKLIST.md. |
| WP01-08 | Decision | Home shed versus a small rented workspace versus a host venue for the first 12 months? | — |
| WP02-03 | Contact | Will Fair Trading confirm in writing whether the exemption applies, or whether a licence is needed? | — |
| WP02-08 | Decision | Which entity: Parris Tech Services sole trader, a separate business name, an incorporated association or a company limited by guarantee? | Decide after Fair Trading and insurer answers; charity/DGR only if donation-only. |
| WP02-09 | Contact | Which records software and ID checks will Fair Trading accept if licensing applies? | — |
| WP03-02 | Contact | Will an insurer cover refurbishing and selling second-hand electronics with lithium batteries from a home shed, and what are the exclusions? | — |
| WP03-03 | Contact | Does home and contents insurance exclude business stock and equipment at the site? | — |
| WP03-04 | Contact | Which insurance covers a Repair Café (host venue, organiser, volunteers' personal accident)? | — |
| WP03-05 | Decision | Is cyber or data-breach cover needed given the privacy exemption? | — |
| WP04-02 | Contact | Who processes Whylandra's e-waste now, and what tonnes were collected FY2023–26? | — |
| WP04-06 | Contact | Would Council consider any reuse arrangement later (declined 20 Oct 2026)? | Return only with pilot evidence. |
| WP05-03 | Contact | What would EcoCycle charge to accept Dubbo eWaste's rejects and batteries, with what certificates? | Draft enquiry exists (templates/ecocycle-...-drafts). |
| WP05-04 | Contact | Can Dubbo eWaste become a MobileMuster reuse or collection partner? | Draft enquiry exists. |
| WP05-05 | Contact | What downstream does AMR use, and will it share redacted receipts? | — |
| WP05-06 | Contact | Can Dubbo eWaste register as a B-cycle / Batteries 4 Planet Ark collection point for its own battery outflow? | — |
| WP06-03 | Contact | How many devices do Dubbo schools, TAFE, health, Council and major SMEs retire a year, and where do they go? | — |
| WP06-04 | Contact | Which named donor will give a 20–30 device known-authority batch first? | — |
| WP07-02 | Pilot | Which erase method and tool works per media type on real donor devices (HDD, SATA SSD, NVMe, eMMC)? | — |
| WP07-03 | Contact | Can owners remove Activation Lock, FRP, Autopilot and MDM through official channels for donated devices? | Owner-side release only; see FRP docs. |
| WP07-04 | Contact | Is a paid Blancco licence available for Dubbo eWaste's own entity and site? | — |
| WP07-05 | Decision | What evidence pack goes to donors (certificate fields, serial capture)? | — |
| WP08-04 | Pilot | Site risk assessment for the actual shed (storage, charging, damaged-battery quarantine), with sign-off. | — |
| WP09-02 | Pilot | Timed repairs and pass/fail rates per device category on 20–30 devices. | — |
| WP10-01 | Pilot | Sold prices, sale-through and returns on the first 20–30 devices. | — |
| WP10-03 | Decision | Donation-only, sale-only or hybrid model for the pilot? | Both scenario models in the repo show yield decides viability. |
| WP11-02 | Contact | Which Dubbo charity would receive refurbished devices and join the NSW Device Bank EOI? | — |
| WP11-03 | Contact | Host venue, insurance and volunteer roster for a first Repair Café session. | — |
| WP11-04 | Pilot | Measured attendance, item mix and fix rate over three sessions. | — |
| WP12-03 | Contact | Lodge a submission to EPA WCIP Chapter 2 by 30 November? | Owner decision; draft exists. |
| WP12-04 | Pilot | Avoided-emissions method once real reuse data exists. | — |
| WP13-02 | Decision | Keep private stakeholder records in ResearchAtlas and AssetFlow only. | — |

## Not reached in this pass

Desk questions still open: certified recycler fees after Sircel (WP05-07), ex-government auction lots and freight (WP06-06), courier lithium rules (WP08-05), ChromeOS Flex and Linux options (WP09-03) and marketplace fees (WP10-02). Partial answers carried from earlier work and not refreshed: WP01-03, WP02-07, WP04-05, WP06-02, WP09-04.

## Files

- [v2 prompt](MASTER-GAP-RESEARCH-V2-PROMPT-2026-11-28.md)
- [question-register.csv](../data/master-gap-v2-2026-11-28/question-register.csv) and [.json](../data/master-gap-v2-2026-11-28/question-register.json)
- [mined-gap-lines.csv](../data/master-gap-v2-2026-11-28/mined-gap-lines.csv) (1,445 public lines with work-package mapping) and [wp-coverage.csv](../data/master-gap-v2-2026-11-28/wp-coverage.csv)
- `EVD-GAP2-*` records in [data/evidence.yaml](../data/evidence.yaml)
- Rebuild: `python3 scripts/build_master_gap_v2_2026_11_28.py <mined-gaps-classified.csv>`
