#!/usr/bin/env python3
"""Build the 28 Nov 2026 master gap research v2 pack (prompt + results data).

Run from the DubboEwaste repository root:
    python3 scripts/build_master_gap_v2_2026_11_28.py [mined-gaps-classified.csv]

Outputs under data/master-gap-v2-2026-11-28/:
  question-register.csv / .json  every question: work package, closure mode,
                                 legacy IDs, status, answer, sources, next action
  wp-coverage.csv                mined gap lines per work package
  mined-gap-lines.csv            public mined gap lines (DubboEwaste and
                                 CircularEconomyDubbo only; private repos counted, not copied)
and appends EVD-GAP2-* records to data/evidence.yaml (regenerated idempotently).
"""
import csv
import json
import os
import sys
from collections import Counter

import yaml

DATE = "2026-11-28"
OUT = os.path.join("data", "master-gap-v2-2026-11-28")

WPS = {
    "WP01": "Premises, planning and property",
    "WP02": "Legal entity, second-hand dealing, tax and privacy",
    "WP03": "Insurance and liability",
    "WP04": "Council, Whylandra and regional waste flow",
    "WP05": "Downstream recyclers and stewardship schemes",
    "WP06": "Supply, institutional disposal and procurement",
    "WP07": "Data sanitisation, operating systems, locks and ownership",
    "WP08": "Battery, electrical safety and WHS",
    "WP09": "Triage, repair, testing, parts and skills",
    "WP10": "Market, pricing, economics and capacity",
    "WP11": "Repair Café, digital inclusion and community",
    "WP12": "Policy, funding, circular economy and impact",
    "WP13": "Governance, records, software and research integrity",
}
MODES = {
    "D": "Desk — answerable from public sources now",
    "C": "Contact — needs a written answer, quote or record from an organisation",
    "P": "Pilot — needs measurement on real devices or events",
    "O": "Owner decision",
}
# status: ANSWERED | PARTIAL | NOT_FOUND | UNRESOLVED | OPEN (C/P/O not closable by desk research)

Q = []


def q(wp, mode, question, legacy="", status="OPEN", answer="", sources="", nxt="", evidence=False, confidence=""):
    n = sum(1 for x in Q if x["wp"] == wp) + 1
    Q.append(dict(id=f"{wp}-{n:02d}", wp=wp, work_package=WPS[wp], mode=mode, question=question,
                  legacy_ids=legacy, status=status, answer=answer, sources=sources, next_action=nxt,
                  evidence=evidence, confidence=confidence))


# ---------------------------------------------------------------- WP01
q("WP01", "D", "Can a home business or home industry run as exempt development in NSW, and on what conditions?", "A02; O60",
  "ANSWERED", "Yes, if the use meets the Standard Instrument definitions: the Codes SEPP lets a dwelling be used for a home business, home industry or home occupation as exempt development, with up to 2 non-resident employees, one sign up to 1 m², and the floor-area cap in the council LEP's clause 5.4 (no less than 30 m²). Exclusions (food manufacture, skin penetration, sex services) don't affect electronics.",
  "https://planning.nsw.gov.au/the-planning-system/development-assessment/planning-approval-pathways/development-types/home-based-enterprises; https://www.planning.nsw.gov.au/sites/default/files/2023-02/home-based-enterprises-rules-for-exempt-and-complying-development.pdf",
  "Read Dubbo LEP 2022 cl 5.4 for the exact m² figure; then ask Council planning to confirm the activity fits 'home business' (WP01-04).", True, "High")
q("WP01", "D", "What floor-area limit does Dubbo Regional LEP 2022 clause 5.4 set for home businesses and home industries, and has it been amended?", "A02",
  "PARTIAL", "The amendment history lists changes to clause 5.5, the R5 land-use table, Boundary Road clause 7.13, group homes and map amendments; none listed touches clause 5.4. The figure itself wasn't retrieved (the legislation site fetch failed). The statewide floor is 30 m².",
  "https://legislation.nsw.gov.au/view/html/inforce/2023-11-01/epi-2022-0108/lh; https://legislation.nsw.gov.au/view/pdf/asmade/epi-2022-108",
  "Open the current LEP on legislation.nsw.gov.au, clause 5.4(2)–(3), and record the number.", False, "Medium")
q("WP01", "D", "Do 'goods repair and reuse premises' or 'waste or resource management facility' definitions capture device refurbishment or dismantling at home?", "A04",
  "PARTIAL", "Prior research (other session A04) found these can be separate land uses and that being under EPA thresholds does not settle land use. Not re-researched in this pass.", "", "Ask Council planning in the same written enquiry as WP01-04.")
q("WP01", "C", "Will Council confirm in writing that the actual activity (appointment-only, capped storage, online sales, no public drop-off) is an exempt home business at the actual site?", "A01; A03; A10; CURRENT-STATE gate 1",
  nxt="Use templates/phase-0-approval-request-pack.md; keep the address private.")
q("WP01", "C", "Does the lease or landlord allow a home business, storage and visitors?", "A06", nxt="Written landlord consent.")
q("WP01", "C", "What re-classification is triggered if public drop-off, a sign or extra traffic is added later?", "A09")
q("WP01", "P", "Is the shed dry, secure and within work-in-progress caps in practice?", "A08", nxt="Inspection record using MINIMUM-PHYSICAL-SHED-SETUP-CHECKLIST.md.")
q("WP01", "O", "Home shed versus a small rented workspace versus a host venue for the first 12 months?", "A07")

# ---------------------------------------------------------------- WP02
q("WP02", "D", "What does the second-hand dealer law exempt for recycling programs, and which regulation is current?", "B01; B03; O58",
  "UNRESOLVED", "The regulation text found says the Act does not apply to conducting a recycling or rubbish collection program, selling goods collected in one, or contracting to give someone ownership of such goods. That text is in the Pawnbrokers and Second-hand Dealers Regulation 2021. NSW's staged repeal would have ended the 2021 Regulation around 1 September 2026, so a 2026 remake may now be current — other repo notes cite 'Regulation 2026'. Which instrument is in force wasn't confirmed.",
  "https://legislation.nsw.gov.au/view/whole/html/inforce/current/sl-2021-0044",
  "Check legislation.nsw.gov.au for a 2026 Regulation and compare the exemption wording; then ask Fair Trading in writing whether refurbish-and-sell of donated devices is a 'recycling program'.", True, "Medium")
q("WP02", "D", "Can a licensed dealer wipe, test or repair goods during the retention period?", "B04",
  "ANSWERED", "No alteration until the retention period ends, and goods must be kept on notified premises (NSW business obligations page). Fair Trading grants some licensees limited exemptions, including from retention where the seller already held the goods for the required period. Whether data wiping is 'alteration' isn't stated.",
  "https://www.nsw.gov.au/business-and-economy/running-a-business/industry-specific-business-requirements/pawnbrokers-and-second-hand-dealers; https://www.nsw.gov.au/business-and-economy/running-a-business/industry-specific-business-requirements/pawnbrokers-and-second-hand-dealers/limited-exemptions-for-pawnbrokers-and-second-hand-dealers",
  "If licensed, don't wipe during the hold; ask Fair Trading whether data erasure counts as alteration.", True, "High")
q("WP02", "C", "Will Fair Trading confirm in writing whether the exemption applies, or whether a licence is needed?", "B01; B05; CURRENT-STATE gate 3")
q("WP02", "D", "Must second-hand electrical goods be tested, tagged or labelled before resale in NSW?", "O21; G07",
  "ANSWERED", "No NSW clause requiring test-and-tag or an 'untested' label for second-hand articles was found: Part 6 of the Gas and Electricity (Consumer Safety) Regulation covers safety-direction notices and disposal of non-conforming articles. NSW guidance says a second-hand declared article must have been approved when sold new, and sellers of second-hand electrical equipment have obligations to ensure it's safe. Queensland, by contrast, requires sellers to tell buyers if an item is untested.",
  "https://legislation.nsw.gov.au/view/whole/html/inforce/2020-09-02/sl-2018-0501; https://www.nsw.gov.au/housing-and-construction/electrical-safety/buying-and-using-electrical-appliances; https://www.nsw.gov.au/topics/electrical-safety/buying-and-using-appliances; https://worksafe.qld.gov.au/safety-and-prevention/hazards/electricity/electrical-products-and-equipment/selling-electrical-equipment/selling-second-hand",
  "Only resell items with original compliance marks; run and record a safety check; disclose test status in listings as good practice. Check the current Regulation version for changes since 2020.", True, "Medium")
q("WP02", "D", "Can second-hand e-bikes, e-scooters and their batteries be resold in NSW?", "new",
  "ANSWERED", "Not without testing, certification and marking: from 1 February 2026 e-micromobility devices and their lithium-ion batteries sold in NSW, including second-hand ones and former hire fleets, must be tested, certified and marked. They are now declared electrical articles.",
  "https://www.nsw.gov.au/housing-and-construction/safety-home/electrical-safety/lithium-ion-battery-safety/new-standards-for-lithium-ion-batteries-e-micromobility-devices; https://www.eess.gov.au/wp-content/uploads/2026/05/General-Safety-tips-for-Lithium-ion-battery-powered-equipment-v1.0-EESS-Template-new.pdf",
  "Exclude e-micromobility from intake and resale; add to INTAKE-POLICY reject list.", True, "High")
q("WP02", "D", "Does the Privacy Act's small business exemption still apply after the 2026 reform draft?", "new",
  "ANSWERED", "Yes for now: the tranche 2 exposure draft (Privacy Amendment (Personal Data Protection) Bill 2026, released 31 August 2026) does not remove the small business exemption, so businesses under $3 million turnover stay outside the Act unless another trigger applies.",
  "https://www.sparke.com.au/insights/a-new-era-for-privacy-in-australia-implications-of-privacy-act-reform-tranche-2/; https://www.aoshearman.com/en/insights/new-rules-of-engagement-australias-draft-privacy-bill-and-what-it-means-for-your-business",
  "Keep APP 11-style controls anyway; donors and partners will expect them.", True, "High")
q("WP02", "D", "What GST, Division 66 and trading-stock treatment applies to donated and harvested items?", "B07",
  "PARTIAL", "Other session (B07): Division 66 may allow credits on qualifying second-hand goods acquired for resale, not automatically on free devices. Not re-researched.", "", "Accountant.")
q("WP02", "O", "Which entity: Parris Tech Services sole trader, a separate business name, an incorporated association or a company limited by guarantee?", "B07; new", nxt="Decide after Fair Trading and insurer answers; charity/DGR only if donation-only.")
q("WP02", "C", "Which records software and ID checks will Fair Trading accept if licensing applies?", "B05; B06")

# ---------------------------------------------------------------- WP03
q("WP03", "D", "What does public and products liability cover cost a micro-business in Australia?", "O61",
  "ANSWERED", "Typical public and products liability premiums were $370–$840 a year (median around $605) across 2,000+ policies arranged by one broker in 2022–26; BizCover's FY24 average for NSW was about $39 a month. These are all-industry figures, not electronics-refurbishment quotes.",
  "https://www.upcover.com/blog/public-liability-insurance-cost-australia; https://www.bizcover.com.au/public-liability-insurance-cost/",
  "Get two written quotes naming second-hand electronics resale and lithium batteries.", True, "Medium")
q("WP03", "C", "Will an insurer cover refurbishing and selling second-hand electronics with lithium batteries from a home shed, and what are the exclusions?", "CURRENT-STATE gate 2")
q("WP03", "C", "Does home and contents insurance exclude business stock and equipment at the site?", "new")
q("WP03", "C", "Which insurance covers a Repair Café (host venue, organiser, volunteers' personal accident)?", "J-series; REPAIR-CAFE insurance audit")
q("WP03", "O", "Is cyber or data-breach cover needed given the privacy exemption?", "new")

# ---------------------------------------------------------------- WP04
q("WP04", "D", "Has Council publicly awarded a successor e-waste contract after Matthews (30 June 2025)?", "C01; O55",
  "NOT_FOUND", "No e-waste award appears in Council's 2025 meeting outcomes or its 'recently awarded tenders' page (checked 28 Nov 2026), consistent with the 20 Nov 2026 GIPA register check. It may sit under purchase-order thresholds or a regional arrangement (inference).",
  "https://www.dubbo.nsw.gov.au/about-council/work-at-council/doing-business-with-council",
  "Informal information request to Council (templates/drc-ewaste-information-request.md).", False, "Medium")
q("WP04", "C", "Who processes Whylandra's e-waste now, and what tonnes were collected FY2023–26?", "C02; C04; C05")
q("WP04", "D", "What is the status of the Whylandra embedded-battery trial?", "C09",
  "PARTIAL", "Dubbo was one of the first 21 CRCs in the NSW EPA trial (September 2024 to September 2026), and Council was still promoting it in July 2026. NTCRS products such as laptops are excluded. The processor, volumes and post-September 2026 status aren't public.",
  "https://www.epa.nsw.gov.au/embedded-batteries; https://www.dubbo.nsw.gov.au/news-and-media/news-and-resources/council-news/weekly-wrap",
  "Ask NSW EPA (draft in the EcoCycle enquiry templates).", True, "High")
q("WP04", "D", "What is the NSW EPA proposing for regional waste infrastructure, and when do submissions close?", "K01",
  "ANSWERED", "Draft Chapter 2 of the Waste and Circular Infrastructure Plan covers regional NSW — underinvestment, capacity shortages and high transport and recycling costs — and consultation closes Monday 30 November 2026.",
  "https://newshub.medianet.com.au/2026/10/regional-waste-solutions-on-the-table/177204/; https://yoursay.epa.nsw.gov.au/draft-nsw-waste-and-circular-infrastructure-plan-chapter-2",
  "Optional: lodge a short submission by 5pm Monday 30 November (draft in the other session's results doc).", True, "High")
q("WP04", "D", "What is happening with the Whylandra resource recovery park and reuse shop?", "C06",
  "PARTIAL", "Other session (C06): adopted strategy proposes it; no funding or completion evidence. Not re-researched.")
q("WP04", "C", "Would Council consider any reuse arrangement later (declined 20 Oct 2026)?", "HOLD", nxt="Return only with pilot evidence.")
q("WP04", "D", "What bulky-waste service applies to electronics in Dubbo?", "new",
  "PARTIAL", "Council extended the pre-booked bulky rubbish collection trial to 30 June 2026; electronics rules and post-June status weren't checked.",
  "https://www.dubbo.nsw.gov.au/news-and-media/news-and-resources/council-news/2025/pre-booked-bulky-rubbish-collection-trial-extended")

# ---------------------------------------------------------------- WP05
q("WP05", "D", "What is Sircel's current status (the repo's strongest regional downstream lead)?", "O66; C08",
  "ANSWERED", "Sircel entered voluntary administration: KordaMentha's Richard Tucker and Ryan Rabbitt were appointed on 31 October 2026, with a first creditors' meeting on 12 November. Sircel had six sites including its Parkes solar-panel plant.",
  "https://reneweconomy.com.au/shock-and-dismay-as-one-of-australias-biggest-solar-recycling-hopes-put-into-administration; https://mraconsulting.com.au/?p=8274",
  "Drop Sircel Parkes as a planning assumption; ask TechCollect/ANZRP who now services NSW collections.", True, "High")
q("WP05", "D", "Is there a free NTCRS drop-off in or near Dubbo besides Whylandra?", "O57",
  "PARTIAL", "No current TechCollect Dubbo site was found. A 2019 NetWaste e-waste poster listed Wellington (inside Dubbo Regional LGA), Narromine, Orange and Mudgee among drop-off points; that's historical. Council's A–Z guide points residents to Council depots and says Officeworks accepts some e-waste.",
  "https://www.oberon.nsw.gov.au/files/assets/public/v/1/waste-garbage-services/191204-e_waste_acceptableitems_a4poster_print-1.pdf; https://www.dubbo.nsw.gov.au/Households-Residents/Rubbish-Recycling-and-Sustainability/Domestic-Waste-Services/a-z-recycling",
  "Check TechCollect's and Ecycle Solutions' site finders.")
q("WP05", "C", "What would EcoCycle charge to accept Dubbo eWaste's rejects and batteries, with what certificates?", "EcoCycle Q06", nxt="Draft enquiry exists (templates/ecocycle-...-drafts).")
q("WP05", "C", "Can Dubbo eWaste become a MobileMuster reuse or collection partner?", "EcoCycle Q07", nxt="Draft enquiry exists.")
q("WP05", "C", "What downstream does AMR use, and will it share redacted receipts?", "D01–D04")
q("WP05", "C", "Can Dubbo eWaste register as a B-cycle / Batteries 4 Planet Ark collection point for its own battery outflow?", "new")
q("WP05", "D", "Which certified recyclers accept small-business e-waste from regional NSW, at what published fees?", "DOWNSTREAM cost comparison",
  "OPEN", "Not researched this pass; see DOWNSTREAM-PROVIDER-DUBBO-COST-COMPARISON.md (October). Sircel's administration changes that comparison.")

# ---------------------------------------------------------------- WP06
q("WP06", "D", "How do the NSW and National Device Banks work, and can Dubbo organisations take part?", "E09; J07; J08; O63",
  "ANSWERED", "The NSW Device Bank launched in May 2026 as a 12-month pilot run by NSW Telco Authority with WorkVentures. It refurbishes surplus government laptops and distributes them, with Good Things Australia, through community organisations and charities in metro, regional and remote NSW; the first laptops went out by late July 2026. Community organisations apply through WorkVentures' EOI. The separate National Device Bank (WorkVentures and Good Things Australia) takes business and government donations, and reported in February 2026 that demand exceeded devices committed.",
  "https://jodieharrison.com.au/news/latest-news/nsw-device-bank-delivers-first-laptops-to-help-hurdle-digital-barriers/; https://www.theindiansun.com.au/2026/05/21/refurbished-laptop-program-targets-digital-access-gap-across-nsw/; https://workventures.com.au/nswdb-eoi; https://itbrief.com.au/story/call-for-device-donations-as-digital-divide-widens",
  "Point a Dubbo charity partner at the WorkVentures EOI; Dubbo eWaste itself isn't the eligible applicant.", True, "High")
q("WP06", "D", "Who is the NSW Education e-waste vendor for Western NSW?", "E01; O67", "PARTIAL", "Other session: dedicated contract confirmed (June 2026 procedure), vendor not named. Not re-researched.")
q("WP06", "C", "How many devices do Dubbo schools, TAFE, health, Council and major SMEs retire a year, and where do they go?", "E02–E06; I01")
q("WP06", "C", "Which named donor will give a 20–30 device known-authority batch first?", "E10; FIRST-30-DEVICE-EXPERIMENT")
q("WP06", "D", "What is Dubbo Regional LGA's population for sizing?", "I01",
  "ANSWERED", "About 57,400 (ABS estimated resident population series via City Population).",
  "https://www.citypopulation.de/en/australia/admin/new_south_wales/12390__dubbo_regional", "", True, "Medium")
q("WP06", "D", "Do ex-government auction lots state Autopilot/Intune release, and what freight to Dubbo costs?", "O45; O46", "OPEN", "Not researched this pass.")

# ---------------------------------------------------------------- WP07
q("WP07", "D", "When do Windows 10 security updates end for donated home PCs?", "H07",
  "ANSWERED", "Windows 10 support ended 14 October 2025. On 25 June 2026 Microsoft extended consumer Extended Security Updates by a year, so enrolled personal devices get security updates until 12 October 2027 (Microsoft's Australian page confirms). Microsoft 365 apps keep security updates on Windows 10 until 10 October 2028.",
  "https://www.microsoft.com/en-AU/windows/end-of-support; https://bleepingcomputer.com/news/microsoft/microsoft-quietly-extends-free-windows-10-esu-support-to-october-2027",
  "Confirms INTAKE-POLICY.md (already says 12 October 2027). Ship Windows 11 where eligible; otherwise tell recipients to enrol in ESU and plan Linux or ChromeOS Flex before October 2027.", True, "High")
q("WP07", "P", "Which erase method and tool works per media type on real donor devices (HDD, SATA SSD, NVMe, eMMC)?", "F02; F03")
q("WP07", "C", "Can owners remove Activation Lock, FRP, Autopilot and MDM through official channels for donated devices?", "F06", nxt="Owner-side release only; see FRP docs.")
q("WP07", "C", "Is a paid Blancco licence available for Dubbo eWaste's own entity and site?", "AMR results A09")
q("WP07", "O", "What evidence pack goes to donors (certificate fields, serial capture)?", "F04")

# ---------------------------------------------------------------- WP08
q("WP08", "D", "Does NSW's new battery stewardship regulation affect Dubbo eWaste?", "G05; K05",
  "PARTIAL", "The Product Lifecycle Responsibility Regulation 2026 commenced on 1 October 2026 as Australia's first mandatory battery stewardship scheme; obligations fall on brand owners, and with no Product Stewardship Organisation appointed yet, brand owners must comply individually. Whether a refurbisher that imports replacement batteries or supplies devices containing batteries is a 'brand owner' wasn't established.",
  "https://hamiltonlocke.com.au/new-energy-bulletin-new-south-wales-battery-stewardship-scheme-now-in-effect/; https://hamiltonlocke.com.au/new-energy-bulletin-australias-first-mandatory-battery-stewardship-scheme-what-you-need-to-know/",
  "Ask NSW EPA whether buying replacement batteries from local suppliers (not importing) keeps Dubbo eWaste out of brand-owner obligations.", True, "High")
q("WP08", "D", "Does repairing plug-in devices need an electrical licence in NSW?", "G06",
  "ANSWERED", "An electrical licence is needed for 'electrical wiring work' — physical work on an electrical installation. Older NSW definitions exclude appliances connected through a socket from the installation, and disconnecting or reconnecting hard-wired equipment needs its own certificate. So repairing plug-in laptops and power supplies isn't licensed wiring work (inference from definitions); general safety duties still apply.",
  "https://www.nsw.gov.au/business-and-economy/licences-and-credentials/building-and-trade-licences-and-registrations/electrical; https://ablis.business.gov.au/service/nsw/contractor-licence-electrical-individual/16548; https://legislation.nsw.gov.au/view/whole/pdf/repealed/2024-12-28/sl-1998-0499",
  "Don't open mains-side PSUs or hard-wired equipment; confirm with Building Commission NSW if in doubt.", True, "Medium")
q("WP08", "D", "What must a workplace do about lithium-ion incidents in NSW?", "G01–G03",
  "ANSWERED", "A PCBU must notify SafeWork NSW immediately on 13 10 50 of a serious injury, illness, death or dangerous incident caused by a lithium-ion battery; SafeWork, FRNSW, Fair Trading and the EPA publish joint charge/store/recycle guidance.",
  "https://www.safework.nsw.gov.au/hazards-a-z/lithium-ion-batteries; https://www.nsw.gov.au/shop-charge-recycle",
  "Add the notification step to SAFETY-DECISION-TREES.md.", True, "High")
q("WP08", "P", "Site risk assessment for the actual shed (storage, charging, damaged-battery quarantine), with sign-off.", "G04; G08")
q("WP08", "D", "Current lithium shipping rules for Australia Post and couriers, including damaged batteries.", "O44", "OPEN", "Not re-researched this pass (prior answer ✅🟡 in claudeDOCS F).")

# ---------------------------------------------------------------- WP09
q("WP09", "D", "Which fee-free courses suit the operator in 2027?", "H08; O22",
  "ANSWERED", "TAFE NSW opened fee-free applications on 8 November 2026 for courses starting from 1 January 2027. The NSW Fee Free list includes Certificate II in Electrotechnology (Career Start), standard fee $5,450 and estimated $0–$1,000, delivered online or mixed. TAFE NSW Dubbo runs the Certificate III Electrician at Myall Street.",
  "https://www.tafensw.edu.au/jobtrainer; https://skills.education.nsw.gov.au/nsw-fee-free/information-media-telecommunications?is_nff=1; https://www.tafensw.edu.au/offering/-/o/o/UEE30820-01V01-22DUB-021/Certificate-III-in-Electrotechnology-Electrician",
  "Check eligibility; places are limited.", True, "Medium")
q("WP09", "P", "Timed repairs and pass/fail rates per device category on 20–30 devices.", "H01–H05")
q("WP09", "D", "ChromeOS Flex certified models and Linux options for Windows 11-ineligible donations.", "H07", "OPEN", "Not researched this pass.")
q("WP09", "D", "Android and Chromebook update end dates for common donated models.", "O04; O05", "PARTIAL", "Prior 🟡 answers in claudeDOCS A; not refreshed.")

# ---------------------------------------------------------------- WP10
q("WP10", "P", "Sold prices, sale-through and returns on the first 20–30 devices.", "I02–I06; O11")
q("WP10", "D", "Current marketplace fees (Facebook Marketplace, eBay, Gumtree) for small sellers.", "O17", "OPEN", "Not researched this pass.")
q("WP10", "O", "Donation-only, sale-only or hybrid model for the pilot?", "I07", nxt="Both scenario models in the repo show yield decides viability.")

# ---------------------------------------------------------------- WP11
q("WP11", "D", "Is there an active Repair Café in Dubbo or Orana?", "J01",
  "NOT_FOUND", "None surfaced in 2026 web results, while many metropolitan and Victorian councils run them (Hornsby runs electronics-only sessions with one item per person and bookings). Absence of a listing doesn't prove there isn't one.",
  "https://www.hornsby.nsw.gov.au/Community/Events/Sustainability-waste-events-folder/Repair-Caf%C3%A9-Electronic-Sessions",
  "Ask Macquarie Regional Library, Men's Sheds and Council's sustainability team.", False, "Medium")
q("WP11", "C", "Which Dubbo charity would receive refurbished devices and join the NSW Device Bank EOI?", "J07; J08")
q("WP11", "C", "Host venue, insurance and volunteer roster for a first Repair Café session.", "J02–J05")
q("WP11", "P", "Measured attendance, item mix and fix rate over three sessions.", "J06")

# ---------------------------------------------------------------- WP12
q("WP12", "D", "Are there open grants that fit right now?", "K02; J09; O62",
  "PARTIAL", "Nothing suitable is open. The EPA's Local Government Waste Solutions Fund is for councils in the waste-levy area (Round 4 closed October 2025; it funded a Port Macquarie reuse/repair event pilot) — Dubbo is likely outside the levy area (inference). The Environmental Trust's 2026 rounds have closed. The EPA's Together on Country program supports Aboriginal communities' circular-economy work and business partnerships and may fit a partnership. Dubbo's 2026/27 community funding closes 28 February 2027 (other session).",
  "https://www.epa.nsw.gov.au/Working-together/Grants; https://www.nsw.gov.au/grants-and-funding/local-government-waste-solutions-fund-round-4/recipients; https://www.environment.nsw.gov.au/node/21836; https://www.epa.nsw.gov.au/Working-together/Grants/Illegal-dumping/together-on-country",
  "Budget zero grant income; watch the EPA grants calendar.", True, "Medium")
q("WP12", "D", "Will national reform add reuse targets for computers soon?", "K04; K05",
  "ANSWERED", "Not soon. At the 18 September 2026 Environment Ministers' Meeting, ministers agreed a Circular Economy Roadmap with packaging, batteries and solar panels as the first national harmonisation priorities. The Productivity Commission's reuse/repair target recommendation for the NTCRS remains a recommendation.",
  "https://enviliance.com/regions/oceania/au/report_17822; https://www.pc.gov.au/inquiries-and-research/circular-economy/report",
  "Plan without NTCRS reuse credit.", True, "Medium")
q("WP12", "C", "Lodge a submission to EPA WCIP Chapter 2 by 30 November?", "K01", nxt="Owner decision; draft exists.")
q("WP12", "P", "Avoided-emissions method once real reuse data exists.", "K07; K08")

# ---------------------------------------------------------------- WP13
q("WP13", "D", "Which repo statements are now outdated?", "L03",
  "ANSWERED", "From this pass: (1) Sircel Parkes as a live downstream lead — Sircel is in administration (dated notes added to AMR-DUBBO-DOWNSTREAM-FORENSIC.md and WHAT-HAPPENS-TO-EWASTE.md); (2) whole e-bikes and e-scooters now need certification before resale (note added to INTAKE-POLICY.md); (3) the NSW battery scheme described as pending elsewhere commenced 1 October 2026. Windows 10 ESU in INTAKE-POLICY.md (12 October 2027) was checked and is correct. Which second-hand dealer Regulation is current stays unresolved.",
  "", "Annotate the affected docs with a dated correction note rather than rewriting them.", False, "High")
q("WP13", "O", "Keep private stakeholder records in ResearchAtlas and AssetFlow only.", "L04")


def mined():
    path = sys.argv[1] if len(sys.argv) > 1 else None
    if not path or not os.path.exists(path):
        return None
    rows = list(csv.DictReader(open(path, encoding="utf-8")))
    return rows


def write_csv(path, rows, fields):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow(r)


def append_evidence():
    path = os.path.join("data", "evidence.yaml")
    marker = "\n# Master gap research v2 — 28 November 2026\n"
    text = open(path, encoding="utf-8").read()
    if marker in text:
        text = text[: text.index(marker)]
        open(path, "w", encoding="utf-8").write(text)
    new = []
    for x in Q:
        if not x["evidence"]:
            continue
        first = x["sources"].split(";")[0].strip()
        new.append({
            "id": f"EVD-GAP2-{x['id']}",
            "claim": x["answer"],
            "type": "Verified Fact" if x["status"] == "ANSWERED" else "Research Lead",
            "source": f"Master gap v2 {x['id']} — {x['question'][:80]}",
            "url": first,
            "date_checked": DATE,
            "verification_method": "Primary source" if any(d in first for d in ("gov.au", "legislation", "microsoft.com", "tafensw")) else "Independent secondary source",
            "confidence": x["confidence"] or "Medium",
            "notes": f"[{x['status']}] Next: {x['next_action']}".strip(),
        })
    with open(path, "a", encoding="utf-8") as f:
        f.write(marker)
        f.write(yaml.safe_dump(new, sort_keys=False, allow_unicode=True, width=110))
    return len(new)


def main():
    if not os.path.exists(os.path.join("data", "evidence.yaml")):
        sys.exit("Run from the DubboEwaste repository root.")
    os.makedirs(OUT, exist_ok=True)
    fields = ["id", "wp", "work_package", "mode", "question", "legacy_ids", "status", "answer", "sources", "next_action", "confidence"]
    write_csv(os.path.join(OUT, "question-register.csv"), Q, fields)
    json.dump({"date": DATE, "work_packages": WPS, "modes": MODES,
               "questions": [{k: x[k] for k in fields} for x in Q]},
              open(os.path.join(OUT, "question-register.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)

    rows = mined()
    if rows is not None:
        pub = [r for r in rows if r["repo"] in ("DubboEwaste", "CircularEconomyDubbo")]
        write_csv(os.path.join(OUT, "mined-gap-lines.csv"), pub, ["repo", "file", "line", "primary_wp", "work_packages", "text"])
        cov = Counter()
        prim = Counter()
        for r in rows:
            prim[r["primary_wp"]] += 1
            for w in r["work_packages"].split(";"):
                cov[w] += 1
        files = Counter((r["repo"], r["file"]) for r in rows)
        with open(os.path.join(OUT, "wp-coverage.csv"), "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["work_package", "name", "mined_lines_primary", "mined_lines_any", "questions_in_register"])
            for k in ["WP00"] + list(WPS):
                w.writerow([k, WPS.get(k, "Unclassified / navigation"), prim.get(k, 0), cov.get(k, 0), sum(1 for x in Q if x["wp"] == k)])
        print(f"mined lines {len(rows)} (public {len(pub)}), files {len(files)}")
    n = append_evidence()
    c = Counter(x["status"] for x in Q)
    m = Counter(x["mode"] for x in Q)
    print(f"questions {len(Q)}; modes {dict(m)}; status {dict(c)}; evidence added {n}")


if __name__ == "__main__":
    main()
