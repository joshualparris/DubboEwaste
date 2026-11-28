#!/usr/bin/env python3
"""Build the 28 Nov 2026 EcoCycle/EcoBatt Dubbo supply-chain datasets.

Outputs (all under data/ecocycle-dubbo-2026-11-28/ unless noted):
  evidence-register.csv / .json   claim-level register with status and confidence
  collection-network.csv          Dubbo collection points and known partners
  device-pathways.csv             device category -> pathway -> reuse possibility
  stakeholders.csv                publicly documented professional contacts only
  open-questions.csv              outstanding verification questions
  scenarios.csv                   planning-assumption economics (NOT quotes)
  diagrams/*.dot (+ .svg/.png when Graphviz is installed)
  ../evidence.yaml                appends EVD-ECO-* records (idempotent)

Run from the repository root:  python3 scripts/build_ecocycle_dubbo_2026_11_28.py
"""
import csv
import json
import math
import os
import shutil
import subprocess
import sys

import yaml

DATE = "2026-11-28"
OUT = os.path.join("data", "ecocycle-dubbo-2026-11-28")
DIAG = os.path.join(OUT, "diagrams")

# ---------------------------------------------------------------------------
# Sources (S-ids are cited from the report and the CSVs)
# ---------------------------------------------------------------------------
SOURCES = {
    "S01": ("EcoCycle — About EcoCycle (group companies)", "https://ecocycle.com.au/?p=6079"),
    "S02": ("Waste Management Review — EcoCycle celebrates 30 years", "https://wastemanagementreview.com.au/ecocycle-celebrates-30-years-of-specialist-recycling/"),
    "S03": ("EcoCycle — Ecocycle now under new ownership (2014)", "https://ecocycle.com.au/ecocycle-now-new-ownership"),
    "S04": ("EcoCycle — Certified destruction / what happens to your data", "https://ecocycle.com.au/certified-destruction-cma-ecocycle-destroys-personal-information-attached-items-recycled/"),
    "S05": ("EcoCycle — E-waste recycling and mercury recovery (Eco E-Waste)", "https://ecocycle.com.au/e-waste-recycling-mercury-recovery/"),
    "S06": ("EcoCycle — How do I safely recycle old hard drives? (AS 5377)", "https://ecocycle.com.au/?p=4687"),
    "S07": ("Waste Management Review — Ecocycle achieves R2v3 certification (Apr 2025)", "https://wastemanagementreview.com.au/ecocycle-achieves-global-certification/"),
    "S08": ("Ecocycle Pty Ltd NTCRS annual report FY23/24 (DCCEEW)", "https://www.dcceew.gov.au/sites/default/files/documents/ecocycle-ntcrs-annual-report-fy-23-24.pdf"),
    "S09": ("Victorian Premier — First of a kind battery recycling in Victoria", "https://www.premier.vic.gov.au/first-kind-battery-recycling-victoria"),
    "S10": ("Recycling Near You — World-first battery recycling plant opens (3 Sep 2025)", "https://recyclingnearyou.com.au/news/world-first-battery-recycling-plant-opens-in-melbourne"),
    "S11": ("Resource Recycling — Australia opens world's first BIDS plant (11 Sep 2025)", "https://resource-recycling.com/e-scrap/2025/09/11/australia-opens-worlds-first-battery-in-device-shredding-plant/"),
    "S12": ("Sustainability Victoria — funded project, Ecobatt battery plant", "https://sustainability.vic.gov.au/grants-funding-and-investment/grants-and-funding/ecobatts-turnkey-lithium-battery-processing-and-recycling-plant"),
    "S13": ("Victorian Premier — Boosting Victoria's battery recovery industry (Apr 2024)", "https://www.premier.vic.gov.au/boosting-victorias-battery-recovery-industry"),
    "S14": ("Energy Magazine — BMW teams up with BIDS plant (capacity)", "https://www.energymagazine.com.au/bmw-teams-up-with-australian-first-battery-shredding-plant/"),
    "S15": ("EcoCycle — Contact (sites)", "https://ecocycle.com.au/contact"),
    "S16": ("Business Recycling directory — CMA Ecocycle, 22 Christie St St Marys", "https://businessrecycling.com.au/business/17917"),
    "S17": ("Woolworths — Battery & mobile phone recycling unit", "https://woolworths.com.au/shop/discover/sustainability/recycling-unit"),
    "S18": ("Woolworths Group — national network of 1,000 collection bins (Apr 2021)", "https://woolworthsgroup.com.au/au/en/our-newsroom/latest-news/2021/woolworths-to-make-battery-recycling-easier-with-national-network-of-1000-collection-bins.html"),
    "S19": ("Woolworths Group — BIG W sustainability progress (2023)", "https://woolworthsgroup.com.au/au/en/our-newsroom/media-releases/latest-news/2023/big-w-says-goodbye-to-soft-plastic--shopping-bags-in-nationwide-.html"),
    "S20": ("Woolworths Group — National Recycling Week 2026", "https://woolworthsgroup.com.au/au/en/our-newsroom/media-releases/latest-news/2026/national-recycling-week.html"),
    "S21": ("Coles — Battery recycling", "https://www.coles.com.au/about/sustainability/our-commitment/battery-recycling"),
    "S22": ("Bunnings — Battery recycling", "https://www.bunnings.com.au/qr-cat-f-battery-recycling"),
    "S23": ("IGA — Ecobatt battery and phone units", "https://iga.com.au/?p=19968"),
    "S24": ("Mitre 10 — EcoBATT units in Mitre 10 / Home Hardware", "https://www.mitre10.com.au/diy/ecobatts-watt-this-battery-recycling-initiative-can-do-for-you"),
    "S25": ("Recycling Near You — Batteries (JB Hi-Fi collection points)", "https://recyclingnearyou.com.au/batteries"),
    "S26": ("MobileMuster — FAQs (processing locations)", "https://www.mobilemuster.com.au/faqs"),
    "S27": ("Waste Management Review Jul 2019 — MobileMuster: none of the phones are resold", "https://issuu.com/primecreativemedia-2016/docs/wmr0719_lr/s/10446164"),
    "S28": ("MobileMuster — Reuse (charity and trade-in partners)", "https://mobilemuster.com.au/reuse/"),
    "S29": ("Officeworks — Recycling at Officeworks / Bring it Back", "https://www.officeworks.com.au/information/about-us/sustainability/environment/recycling"),
    "S30": ("Wesfarmers FY2024 — Officeworks circularity and waste", "https://www.wesfarmers.com.au/sustainability/fy2024/our-businesses/officeworks/circularity-and-waste"),
    "S31": ("JB Hi-Fi Business — Buyback / ITAD", "https://www.jbhifi.business/services/buyback"),
    "S32": ("JB Hi-Fi — E-waste recycling with Ecoactiv", "https://www.jbhifi.com.au/pages/help-and-support/e-waste-recycling-with-ecoactiv"),
    "S33": ("The Good Guys — E-waste & battery recycling", "https://www.thegoodguys.com.au/e-waste-recycling"),
    "S34": ("Ecycle Solutions NTCRS annual report 2020 (QLS Group subsidiary)", "https://www.agriculture.gov.au/sites/default/files/documents/ecycle-solutions-annual-report-2020.pdf"),
    "S35": ("Telstra — Trade-in (managed by Assurant)", "https://telstra.com.au/trade-in"),
    "S36": ("Sustainability Matters — Vodafone and MobileMuster (Dec 2025)", "https://www.sustainabilitymatters.net.au/content/waste/news/vodafone-and-mobilemuster-team-up-to-tackle-e-waste-1487183861"),
    "S37": ("Dubbo Regional Council — Council waste facilities (CRC small stations)", "https://www.dubbo.nsw.gov.au/Households-Residents/Rubbish-Recycling-and-Sustainability/council-waste-facilities"),
    "S38": ("Dubbo Regional Council — Whylandra Waste and Recycling Centre", "https://www.dubbo.nsw.gov.au/Households-Residents/Rubbish-Recycling-and-Sustainability/whylandra-waste-recycling-centre"),
    "S39": ("Dubbo Regional Council — Weekly Wrap (July 2026, embedded battery trial)", "https://www.dubbo.nsw.gov.au/news-and-media/news-and-resources/council-news/weekly-wrap"),
    "S40": ("NSW EPA — Embedded batteries trial", "https://www.epa.nsw.gov.au/embedded-batteries"),
    "S41": ("NSW EPA — New trial targets embedded batteries (26 Sep 2024)", "https://www.epa.nsw.gov.au/News/Media-Releases/2024/EPAMedia240926-New-trial-targets-safe-disposal-of-embedded-batteries-including-vapes"),
    "S42": ("DCCEEW — National Television and Computer Recycling Scheme", "https://www.dcceew.gov.au/environment/protection/waste/product-stewardship/television-computer-recycling-scheme"),
    "S43": ("National EPA — NTCRS co-regulatory arrangements", "https://www.nationalepa.gov.au/node/269"),
    "S44": ("Productivity Commission — Circular economy final report page", "https://www.pc.gov.au/inquiries-and-research/circular-economy/report"),
    "S45": ("Productivity Commission — Circular economy interim report (Mar 2025)", "https://assets.pc.gov.au/2025-05/circular-economy-interim.pdf"),
    "S46": ("Productivity Commission — Circular economy submissions list (Ecocycle No. 217)", "https://www.pc.gov.au/inquiries-and-research/circular-economy/submissions/"),
    "S47": ("NSW Legislation — Product Lifecycle Responsibility Act 2025 No 22", "https://legislation.nsw.gov.au/view/html/inforce/2025-04-09/act-2025-022/lh"),
    "S48": ("NSW EPA — Regulatory updates (PLR Regulation 2026)", "https://epa.nsw.gov.au/Licensing-and-Regulation/Updates"),
    "S49": ("NSW Government — First state to regulate batteries (embedded batteries)", "https://www.nsw.gov.au/ministerial-releases/nsw-leads-way-first-state-to-regulate-batteries"),
    "S50": ("PC submission 089 — WorkVentures (NTCRS disincentivises reuse)", "https://pc.gov.au/__data/assets/pdf_file/0006/387465/sub089-circular-economy.pdf"),
    "S51": ("PC submission 195 — ANZRP comment on interim report", "https://assets.pc.gov.au/392246/sub195-circular-economy.pdf"),
    "S52": ("Harvey Norman — Dubbo store", "https://stores.harveynorman.com.au/harvey-norman-dubbo-nsw"),
    "S53": ("The Good Guys — Dubbo store", "https://www.thegoodguys.com.au/dubbo"),
    "S54": ("Officeworks — Dubbo store page", "https://officeworks.com.au/shop/officeworks/storepage/W218/NSW/Dubbo"),
    "S55": ("Visit NSW — Orana Mall (BIG W, Woolworths, JB Hi-Fi Home)", "https://www.visitnsw.com/uk/destinations/country-nsw/dubbo-area/dubbo/attractions/orana-mall-shopping-centre"),
    "S56": ("City Population — Dubbo Regional (ABS ERP series)", "https://www.citypopulation.de/en/australia/admin/new_south_wales/12390__dubbo_regional"),
    "S57": ("Officeworks media release Nov 2021 (23 kg per person, GEM 2019)", "https://www.Officeworks.Com.Au/resources/pdfs/media-centre/PressRelease_BringitBack_NOV21.pdf"),
    "S58": ("Channel News — emeals (JB Hi-Fi, The Good Guys, Ecoactiv, PonyUp)", "https://www.channelnews.com.au/emeals-turning-your-e-waste-into-free-meals-for-people-in-need/"),
    "S59": ("EcoCycle — Recycal sister operations (Brett Rowe)", "https://ecocycle.com.au/?p=6021"),
    "S60": ("Repo — AMR Dubbo reuse partnership results (25 Nov 2026)", "https://github.com/joshualparris/DubboEwaste/blob/main/docs/AMR-DUBBO-REUSE-PARTNERSHIP-RESEARCH-RESULTS-2026-11-25.md"),
    "S61": ("Repo — AMR Dubbo downstream forensic", "https://github.com/joshualparris/DubboEwaste/blob/main/docs/AMR-DUBBO-DOWNSTREAM-FORENSIC.md"),
    "S62": ("Repo — Council Whylandra approval dossier (20 Oct 2026)", "https://github.com/joshualparris/DubboEwaste/blob/main/docs/COUNCIL-WHYLANDRA-APPROVAL-DOSSIER-2026-10-20.md"),
    "C00": ("Companion report — EcoBatt/EcoCycle Dubbo investigation (28 Nov 2026)", "https://github.com/joshualparris/DubboEwaste/blob/main/docs/ECOBATT-ECOCYCLE-DUBBO-RESEARCH-2026-11-28.md"),
    "C01": ("ABR — ECOCYCLE PTY LTD, ABN 76 146 190 516 (via companion [1])", "https://abr.business.gov.au/ABN/View?id=76146190516"),
    "C03": ("Eco E-Waste — Secure data disposal (via companion [3])", "https://ecoewaste.com.au/secure-data-disposal/"),
    "C04": ("BIG W — Recycling unit (via companion [4])", "https://www.bigw.com.au/sustainability/recycling-unit"),
    "C06": ("NSW EPA public register — EPL 21136 (via companion [6])", "https://apps.epa.nsw.gov.au/prpoeoapp/ViewPOEOLicence.aspx?DOCID=211294&LICID=21136&SYSUID=1"),
    "C08": ("EcoBatt — Our site (via companion [8])", "https://www.ecobatt.com.au/our-site/"),
    "C12": ("Queensland Government statement 106498 (via companion [12])", "https://statements.qld.gov.au/statements/106498"),
    "C13": ("WA DWER decision report L2956/2025/1 (via companion [13])", "https://www.der.wa.gov.au/images/documents/our-work/licences-and-works-approvals/Decisions_/L2956/L2956%2016-10-2025%20DR.pdf"),
    "C22": ("Eco E-Waste — Recycle mobile phones (via companion [22])", "https://www.ecoewaste.net/recycle-mobile-phones/"),
    "C25": ("Recycling Near You — The Good Guys Dubbo listing (via companion [25])", "https://www.recyclingnearyou.com.au/business/14792"),
    "C27": ("Harvey Norman — E-waste (via companion [27])", "https://www.harveynorman.com.au/e-waste"),
    "C31": ("Dubbo Regional Council — Waste Strategy 2025 adopted, contract table p49 (via companion [31])", "https://www.dubbo.nsw.gov.au/ArticleDocuments/242/Waste_Strategy_2025_Adopted.pdf.aspx"),
    "C35": ("PC submission 217 — Ecocycle, p3 (via companion [35])", "https://assets.pc.gov.au/392368/sub217-circular-economy.pdf"),
}

# ---------------------------------------------------------------------------
# Evidence register
# status: VERIFIED | CORROBORATED (primary source read by the companion
#         28 Nov report, not re-read here) | PARTIAL | UNVERIFIED | INFERENCE
# class:  Independently verified fact | Company claim | Historical evidence |
#         Reasonable inference | Unknown
# prelim: Y if it tests a claim made in the preliminary (pre-research) summary
# ---------------------------------------------------------------------------
EVIDENCE = [
    ("E01", "EcoCycle Group describes itself as comprising EcoCycle, EcoBatt, EcoBatt Safety, Eco E-Waste, Recycal, Castings Tasmania and ACL Metal Powders.", "VERIFIED", "Company claim", "High", "S01", "Y", "Self-description; ASIC group structure not checked."),
    ("E02", "Doug Rowe is publicly described as EcoCycle Group Chief Executive Officer / Managing Director; Nick Dodd as EcoCycle General Manager; Tom Susen as Group Risk and Compliance Manager.", "VERIFIED", "Company claim", "High", "S02", "N", "Trade-press profile quoting the company."),
    ("E03", "The group is 'owned by the Rowe family'.", "PARTIAL", "Historical evidence", "Medium", "S03;S59", "Y", "2014: Ecocycle assets bought from CMA Recycling receivers and placed under management of Nick Dodd and Doug Rowe; Doug described as owner of Recycal; Recycal described as family-owned. Group-level shareholding needs an ASIC extract (companion report agrees ownership not established)."),
    ("E04", "EcoCycle publicly contrasts itself with recyclers that wipe and on-sell computers, stating that it physically destroys data-bearing items.", "VERIFIED", "Company claim", "High", "S04", "Y", "Supports the destruction-first characterisation for EcoCycle itself."),
    ("E05", "Eco E-Waste's secure data disposal page promises physical destruction and says it does not refurbish or resell e-waste.", "CORROBORATED", "Company claim", "Medium", "C03;C00", "Y", "Read by the companion 28 Nov report; this pass could not retrieve the page. Consistent with E04. Screenshot with date before quoting verbatim."),
    ("E06", "Eco E-Waste is EcoCycle's electronics recycling company with national pick-up coverage, sorting into material streams and robotic removal of mercury-containing parts.", "VERIFIED", "Company claim", "High", "S05", "N", ""),
    ("E07", "EcoCycle claims AS 5377 certification and was reported in April 2025 as achieving R2v3 certification.", "VERIFIED", "Company claim", "Medium", "S06;S07", "N", "Certificates, sites and R2v3 scope/appendices (e.g. any test-and-repair scope) not inspected."),
    ("E08", "Ecocycle Pty Ltd's FY23/24 NTCRS annual report records 85,333 kg collected against a co-regulatory recycling target of 77,466 kg.", "VERIFIED", "Independently verified fact", "High", "S08", "N", "Published on DCCEEW. Indicates a small NTCRS footprint relative to the scheme."),
    ("E09", "Ecocycle is a current approved NTCRS co-regulatory arrangement.", "VERIFIED", "Independently verified fact", "High", "S43;S61", "Y", "Prior repo research used the DCCEEW list of 20 May 2026; National EPA now administers the list — re-check before relying on it."),
    ("E10", "EcoBatt/EcoCycle opened a battery-in-device shredding (BIDS) plant in Campbellfield (launch reported 3 Sep 2025) with $2 million from Victoria's Circular Economy Infrastructure Fund: Hazardous Waste Round 3, recovering up to 95% of materials at up to 1 t/hour.", "VERIFIED", "Independently verified fact", "High", "S09;S10", "Y", "Government release plus industry report."),
    ("E11", "A separate April 2024 Victorian announcement awarded $2.5 million to Ecobatt for a lithium battery processing plant in Campbellfield; Sustainability Victoria lists Ecocycle Pty Ltd as project lead.", "VERIFIED", "Independently verified fact", "High", "S12;S13", "N", "Do not merge with the $2m BIDS grant without checking whether they are the same project."),
    ("E12", "EcoBatt claims about 7,500 public drop-off points and a company-owned transport fleet.", "VERIFIED", "Company claim", "Medium", "S10;S11", "N", "Claim reported in trade press; not independently audited."),
    ("E13", "Woolworths offers battery and mobile phone recycling units in all supermarkets with Ecobatt; items are collected by EcoCycle, sorted and sent for recycling; customers are told to delete data first.", "VERIFIED", "Company claim", "High", "S17", "Y", "Dubbo store-level presence not confirmed by visit."),
    ("E14", "In 2021 Woolworths said Ecobatt would split batteries for recycling and send remaining phone components to MobileMuster.", "VERIFIED", "Historical evidence", "Medium", "S18", "N", "May have changed since 2021."),
    ("E15", "BIG W added household battery and mobile phone recycling units to all 177 stores (from Oct 2022); BIG W's page names EcoBatt/EcoCycle, mentions MobileMuster and prohibits retrieval of deposited devices.", "CORROBORATED", "Company claim", "High", "S19;S20;C04;C00", "Y", "Store rollout verified in this pass; recycler and no-retrieval terms read by the companion report."),
    ("E16", "Coles battery bins are managed by Close the Loop and Ecobatt under B-cycle.", "VERIFIED", "Company claim", "High", "S21", "Y", "Batteries only; no phone collection stated."),
    ("E17", "Bunnings battery units are serviced by Ecobatt and do not accept products with embedded batteries.", "VERIFIED", "Company claim", "High", "S22", "N", ""),
    ("E18", "JB Hi-Fi stores have battery and phone collection points (Eco E-Waste names JB bins); JB's booked e-waste service is with Ecoactiv; consumer trade-in is via Assurant; JB Hi-Fi Business ITAD uses a certified partner with Blancco erasure.", "CORROBORATED", "Company claim", "Medium", "S25;S31;S32;C22;C00", "Y", "Eco E-Waste bin naming and Assurant trade-in read by the companion report; Dubbo store operator not confirmed."),
    ("E19", "The Good Guys accepts small e-waste and batteries in store, has TV e-waste cages at selected stores and runs a trade-in portal; a Dubbo listing names Ecycle Solutions for TVs/computers.", "CORROBORATED", "Company claim", "Medium", "S33;C25;C00", "Y", "Dubbo Ecycle Solutions listing read by the companion report; current contract to confirm. EcoBatt battery partnership unconfirmed."),
    ("E20", "Ecycle Solutions is a wholly owned QLS Group subsidiary and a separate NTCRS co-regulator, historically collecting via retailer drop-offs including Harvey Norman and The Good Guys.", "VERIFIED", "Independently verified fact", "High", "S34", "Y", "Not part of EcoCycle Group. Current Dubbo retail role unconfirmed."),
    ("E21", "MobileMuster says collected items are dismantled in Australia and that circuit boards, batteries and plastics are processed by its recycling partner in Singapore.", "VERIFIED", "Company claim", "High", "S26", "N", ""),
    ("E22", "In 2019 MobileMuster's manager said none of the phones it collects are resold and data is destroyed during disassembly.", "VERIFIED", "Historical evidence", "Medium", "S27", "N", "Policy may have changed; re-confirm."),
    ("E23", "MobileMuster partners with charities such as The Reconnect Project (reuse) and acts as recycling partner for commercial reuse programs.", "VERIFIED", "Company claim", "High", "S28", "N", "This is the most transferable reuse-partner model found."),
    ("E24", "Spyro Kalos was quoted in September 2025 as EcoCycle's National Partnerships Manager for Australia and New Zealand (he was previously MobileMuster's manager).", "VERIFIED", "Independently verified fact", "Medium", "S11;S27", "N", "Role may have changed; confirm before writing."),
    ("E25", "Officeworks Bring it Back says items may be reused or repurposed by charitable organisations where appropriate, or recycled through certified partners; over 11,000 tonnes collected since 2015 including trade-in.", "VERIFIED", "Company claim", "High", "S29", "N", "Reuse share and Dubbo handling unknown."),
    ("E26", "Officeworks' trade-in partner Moorup kept 4,753 products in use in 2024; Officeworks also partners with Circonomy.", "VERIFIED", "Company claim", "High", "S30", "N", ""),
    ("E27", "Dubbo has Officeworks, JB Hi-Fi Home and BIG W/Woolworths (Orana Mall), Harvey Norman (223 Cobra St) and The Good Guys stores.", "VERIFIED", "Independently verified fact", "High", "S52;S53;S54;S55", "N", "Coles, ALDI, Bunnings and telco store presence not checked this session."),
    ("E28", "Whylandra accepts household e-waste free, operates under EPL 6058 and participates in the NSW EPA embedded battery trial.", "VERIFIED", "Independently verified fact", "High", "S38;S39", "N", ""),
    ("E29", "The NSW EPA embedded batteries trial ran from September 2024 to September 2026, Dubbo was among the first 21 CRCs, and NTCRS products such as laptops are excluded and sent to e-waste collection.", "VERIFIED", "Independently verified fact", "High", "S40;S41", "N", "Processor and post-September 2026 status unknown."),
    ("E30", "Council small CRC stations at Dubbo and Wellington customer centres and Dubbo library accept mobile phones and accessories, smoke detectors and ink cartridges.", "VERIFIED", "Independently verified fact", "High", "S37", "N", "Downstream collector not named."),
    ("E31", "Council's recorded Matthews Metals e-waste arrangement expired 30 June 2025; the current contractor is not publicly verified.", "VERIFIED", "Historical evidence", "High", "S62;S61", "Y", "From prior repository research."),
    ("E32", "The NTCRS operates under the Recycling and Waste Reduction Act 2020 and 2021 Rules; the National EPA became its regulator on 1 July 2026.", "VERIFIED", "Independently verified fact", "High", "S42", "N", ""),
    ("E33", "The PC interim report found the NTCRS focus on recycling results in some functional or repairable products being dismantled or destroyed, and recommended reuse and repair targets (Rec 9.2).", "VERIFIED", "Independently verified fact", "High", "S45", "N", "Recommendation, not law."),
    ("E34", "The PC circular economy final report was handed to Government on 22 August 2025, released 16 January 2026 and tabled 23 January 2026.", "VERIFIED", "Independently verified fact", "High", "S44", "N", ""),
    ("E35", "Ecocycle lodged a final-round submission (No. 217) to the PC inquiry, received 11 April 2025.", "VERIFIED", "Independently verified fact", "High", "S46", "Y", "Existence only."),
    ("E36", "Ecocycle's submission prioritises NTCRS reform and audit transparency before reuse targets and stresses consumer expectations of destruction.", "CORROBORATED", "Independently verified fact", "Medium", "C35;C00", "Y", "Page 3 read by the companion report; not re-read in this pass."),
    ("E37", "NSW's Product Lifecycle Responsibility Act 2025 was assented 9 April 2025; the Product Lifecycle Responsibility Regulation 2026 creates a mandatory battery stewardship scheme, with embedded batteries in policy scope.", "VERIFIED", "Independently verified fact", "High", "S47;S48;S49", "N", "Commencement dates for specific obligations not confirmed."),
    ("E38", "WorkVentures told the PC that the NTCRS disincentivises device reuse for digital inclusion.", "VERIFIED", "Independently verified fact", "High", "S50", "N", "Stakeholder view."),
    ("E39", "ANZRP (TechCollect) told the PC that the NTCRS framework does not recognise or reward product reuse.", "VERIFIED", "Independently verified fact", "High", "S51", "N", "Stakeholder view from a co-regulator."),
    ("E40", "Telstra trade-in is managed by Assurant; Vodafone says traded-in devices may be refurbished, resold or recycled; telco stores host MobileMuster bins.", "VERIFIED", "Company claim", "High", "S35;S36", "N", "Trade-in is a reuse stream that bypasses recycling bins."),
    ("E41", "EcoCycle has a NSW site at 22 Christie Street, St Marys, under NSW EPL 21136.", "CORROBORATED", "Independently verified fact", "Medium", "C06;S16;C00", "Y", "EPL read by the companion report; licence scope/limits and the 02 9833 4155 number still to verify. Not evidence of a Dubbo route."),
    ("E42", "EcoCycle lists sites including Rocherlea (Tas), Kwinana (WA) and Auckland (NZ); its Campbellfield battery sorting and BIDS hub is at 5–11 Reo Crescent.", "CORROBORATED", "Company claim", "Medium", "S15;C08;C00", "Y", "Reo Crescent address from EcoBatt site page cited by the companion report."),
    ("E43", "Dubbo Regional LGA population is about 57,400 (ABS ERP series).", "VERIFIED", "Independently verified fact", "Medium", "S56", "N", "Secondary aggregator of ABS data."),
    ("E44", "Australia generates roughly 23 kg of e-waste per person per year (Global E-waste Monitor 2019 as cited by Officeworks).", "VERIFIED", "Independently verified fact", "Medium", "S57", "N", "National average, all electrical equipment by weight — not a Dubbo device count."),
    ("E45", "EcoCycle/EcoBatt's visible Dubbo footprint is retail battery and phone bins, not general computer collection.", "INFERENCE", "Reasonable inference", "Medium", "S13;S15;S16;S17;S21;S22", "Y", "Bin programmes accept batteries, phones and wearables; Bunnings excludes embedded-battery products. Store-by-store Dubbo bins not checked."),
    ("E46", "Phones placed in Woolworths/BIG W units are on a recycling and data-destruction pathway; diverting them to reuse would conflict with depositors' expectations and the programme's stated purpose.", "INFERENCE", "Reasonable inference", "Medium", "S17;S18;S22;S26", "N", "Legal title transfer at deposit not established."),
    ("E47", "EcoBatt and ecoe-waste are registered business names of ECOCYCLE PTY LTD (ABN 76 146 190 516), not necessarily separate legal subsidiaries.", "CORROBORATED", "Independently verified fact", "High", "C01;C00", "N", "ABR record cited by the companion report."),
    ("E48", "A WA regulator decision (Oct 2025) records EcoCycle's WA site routing embedded-battery products, including laptops, tablets and phones, to the Campbellfield BIDS plant.", "CORROBORATED", "Independently verified fact", "Medium", "C13;C00", "N", "WA route only; not evidence of the NSW/Dubbo route."),
    ("E49", "Council's adopted Waste Strategy records the Matthews Metals e-waste contract as 30 June 2023 to 30 June 2025, and names separate CRC battery contractors.", "CORROBORATED", "Historical evidence", "High", "C31;C00", "N", "Consistent with prior repo research (E31)."),
    ("E50", "Harvey Norman offers e-waste through Ecycle Solutions at participating stores.", "CORROBORATED", "Company claim", "Medium", "C27;C00", "N", "Dubbo participation unconfirmed."),
    ("E51", "Queensland announced a $10 million grant for an EcoBatt all-chemistries battery plant at Hemmant on 26 November 2026.", "CORROBORATED", "Independently verified fact", "Medium", "C12;C00", "N", "Planned infrastructure; not a Dubbo route."),
]

NETWORK = [
    # org, dubbo_presence, accepts, partner, status, reuse_signal, sources, notes
    ("Woolworths (Dubbo stores incl. Orana Mall)", "Yes (Orana Mall verified)", "Household batteries, mobile phones, accessories, wearables", "Ecobatt / EcoCycle; MobileMuster for phone components (2021)", "National VERIFIED; Dubbo bins not visited", "None — recycling only; delete-data instruction", "S17;S18;S55", "Phones and wearables only; not computers."),
    ("BIG W Dubbo (Orana Mall)", "Yes", "Household batteries, phones, chargers, modems, wearables; Toys for Joy", "EcoBatt/EcoCycle; MobileMuster referenced", "National CORROBORATED; Dubbo bin not visited", "None — BIG W prohibits retrieval of deposited devices", "S19;S20;S55;C04", "Recycler and no-retrieval terms per companion report."),
    ("Coles (Dubbo)", "Not checked", "Household batteries", "Close the Loop + Ecobatt (B-cycle)", "National VERIFIED", "None", "S21", "No phone collection stated."),
    ("ALDI (Dubbo)", "Not checked", "Household batteries (B-cycle)", "Not named in sources found", "UNVERIFIED", "None", "", ""),
    ("Bunnings (Dubbo)", "Not checked", "Household and power-tool batteries; no embedded-battery products", "Ecobatt", "National VERIFIED", "None", "S22", ""),
    ("IGA / Mitre 10 / Home Hardware (if present)", "Not checked", "Batteries, laptop batteries, mobile phones", "Ecobatt", "National VERIFIED", "None", "S23;S24", ""),
    ("JB Hi-Fi Home Dubbo (Orana Mall)", "Yes", "Batteries and phones in store; booked e-waste via Ecoactiv; trade-in; business ITAD buyback", "Eco E-Waste (bins, national); Ecoactiv; Assurant (trade-in); JB Business ITAD partner (Blancco)", "National CORROBORATED; Dubbo operator unconfirmed", "Trade-in and business buyback", "S25;S31;S32;S58;C22", ""),
    ("The Good Guys Dubbo", "Yes", "Small e-waste, batteries; TV cages at selected stores; trade-in", "Ecycle Solutions (Dubbo TV/computer listing); Eco E-Waste names Good Guys bins nationally", "CORROBORATED (listing); current contract unconfirmed", "Trade-in portal", "S33;S53;C25;C22", "Check whether Dubbo has a TV cage."),
    ("Officeworks Dubbo", "Yes", "Bring it Back: IT equipment, phones, cartridges; tech trade-in", "Certified recycling partners; MobileMuster (phones); Moorup (trade-in); Circonomy", "National VERIFIED", "Items may be reused by charities where appropriate", "S29;S30;S54", "Strongest retail reuse signal for computers."),
    ("Harvey Norman Dubbo (223 Cobra St)", "Yes", "E-waste at participating stores", "Ecycle Solutions (QLS Group)", "National CORROBORATED; Dubbo participation unconfirmed", "Unknown", "S34;S52;C27", "Ecycle Solutions is not EcoCycle."),
    ("Telstra / Optus / Vodafone (Dubbo stores)", "Not checked", "Phones, modems, accessories (MobileMuster); trade-in", "MobileMuster; Assurant (Telstra trade-in)", "National VERIFIED", "Trade-in refurbish/resell", "S35;S36;S26", ""),
    ("Dubbo Regional Council — Whylandra CRC", "Yes (Cooba Rd)", "Household e-waste free; embedded-battery devices (EPA trial); problem wastes", "E-waste contractor after 30 Jun 2025 unknown; trial processor unknown", "PARTIAL", "No public reuse step", "S38;S39;S40;S62", "Council declined a separate collection on 20 Oct 2026 — HOLD."),
    ("DRC small CRC stations (customer centres, library)", "Yes", "Mobile phones/accessories, smoke detectors, ink cartridges", "Not named (A–Z page points to MobileMuster)", "PARTIAL", "None", "S37", ""),
    ("Australian Metal Recycling Dubbo (34 Mountbatten Dr)", "Yes", "Free e-waste excluding lithium-ion", "Downstream partners unnamed", "PARTIAL", "See AMR results", "S60;S61", "Former Matthews Metal Management yard."),
    ("Matthews Metals (historic Council contract)", "Historic", "Council e-waste to 30 Jun 2025", "Historic TechCollect links", "VERIFIED (historic)", "n/a", "S61;S62", ""),
    ("Schools, hospitals, government, businesses", "Yes", "Retired fleets via ITAD/lease returns", "Contract-specific", "See prior repo research", "Device Reuse Principles (govt ICT)", "S60", "Separate from consumer bins."),
]

PATHWAYS = [
    # category, dubbo_entry, scheme, processing, tested_before_destruction, reuse_window, status
    ("Desktops, gaming PCs, workstations", "Whylandra; AMR; Officeworks Bring it Back; booked e-waste (Ecoactiv via JB); business ITAD", "NTCRS (household/small business); commercial ITAD", "Dismantle/shred at NTCRS-certified recycler (destination unverified for Dubbo)", "Unknown at council/AMR; ITAD tests by design", "Before drop-off (donor offer) or via ITAD/Officeworks charity reuse", "PARTIAL"),
    ("Laptops, Chromebooks, MacBooks", "As above; trade-in (Officeworks/Moorup, Good Guys, Apple)", "NTCRS; trade-in", "As above; embedded battery handled as e-waste, not EPA trial", "Trade-in grades; bins do not", "Trade-in and pre-collection donation", "PARTIAL"),
    ("Phones and tablets", "Woolworths/BIG W/JB/IGA units; telco stores; Officeworks; council small stations; MobileMuster satchels", "MobileMuster (voluntary accredited); retailer programmes", "Ecobatt/EcoCycle sort -> MobileMuster -> dismantled in Australia; boards/batteries/plastics processed in Singapore", "No (MobileMuster 2019: none resold)", "Only before deposit: trade-in or MobileMuster charity partners", "VERIFIED (chain); Dubbo bins not visited"),
    ("Servers and networking", "Business ITAD; modems via telco MobileMuster bins", "Commercial; MobileMuster (modems since Jul 2022)", "Contract-specific", "ITAD dependent", "Business ITAD / donation", "UNVERIFIED (Dubbo)"),
    ("GPUs, RAM, CPUs, boards", "Whylandra; AMR; Officeworks", "NTCRS (computer parts)", "Recycler dismantling", "No evidence of component harvest", "Before drop-off only", "PARTIAL"),
    ("Hard drives and SSDs", "Inside devices above; business destruction services", "NTCRS; commercial destruction", "EcoCycle physical destruction; MobileMuster destruction; ITAD erasure (Blancco) where contracted", "Destroyed, not tested, in destruction streams", "Erasure-based ITAD only", "VERIFIED (policies)"),
    ("POS, self-checkouts, scanners", "Retailer asset disposal (not consumer bins)", "Commercial", "Unknown", "Unknown", "Retailer asset-owner decision", "UNKNOWN"),
    ("Printers, monitors, TVs", "Whylandra; AMR; Good Guys TV cages (selected stores); Officeworks (printers)", "NTCRS", "Recycler dismantling", "Unknown", "Before drop-off", "PARTIAL"),
    ("Smartwatches, consoles, electronic toys", "Woolworths units (wearables); MobileMuster; Whylandra embedded-battery trial (toys, small devices); BIG W Toys for Joy", "MobileMuster; NSW EPA trial (to Sep 2026); e-waste", "Battery-in-device processing (processor for Dubbo trial unknown); BIDS-type shredding exists at Campbellfield", "No", "Before deposit", "PARTIAL"),
    ("Chargers, cables, batteries", "B-cycle bins (Woolworths, BIG W, Coles, Bunnings, ALDI); council stations; MobileMuster (chargers)", "B-cycle; MobileMuster; NSW PLR Regulation 2026 (batteries)", "Ecobatt / Close the Loop sorting and recycling", "n/a", "Cables/chargers reusable only before deposit", "VERIFIED (national)"),
]

STAKEHOLDERS = [
    # org, role, person_public, contact_public, purpose, source, priority
    ("EcoCycle Group", "National Partnerships Manager ANZ", "Spyro Kalos (quoted Sep 2025)", "ecocycle.com.au contact form; 1300 32 62 92 (EcoCycle general line on hard-drive page)", "Dubbo servicing facts; downstream/battery route for Dubbo eWaste residuals; any reuse-partner precedent", "S11;S06", 1),
    ("EcoCycle Group", "Risk and Compliance Manager", "Tom Susen (quoted)", "Via company contact", "Destruction policy scope; R2v3 scope; certificates", "S02", 2),
    ("EcoCycle Group", "Chief Executive Officer", "Doug Rowe (quoted)", "Via company contact", "Escalation only", "S02", 3),
    ("MobileMuster", "Reuse/charity partnerships", "Not named", "mobilemuster.com.au contact", "Regional reuse partner model (Reconnect Project precedent) with MobileMuster as downstream", "S28", 1),
    ("Officeworks Dubbo", "Store management", "Not named", "(02) 6883 4700", "Bring it Back handling in Dubbo; who decides 'reuse where appropriate'", "S54;S29", 1),
    ("Officeworks / Circonomy", "Sustainability / circularity", "Not named", "Via Officeworks corporate", "Regional reuse partner eligibility", "S29;S30", 1),
    ("JB Hi-Fi Dubbo / Ecoactiv", "Store / programme", "Not named", "JB support page", "Who services Dubbo battery/phone points; Ecoactiv reuse share", "S32;S25", 2),
    ("The Good Guys Dubbo", "Store", "Not named", "02 6841 9444", "Recycler for in-store e-waste; trade-in outcomes", "S53;S33", 2),
    ("Harvey Norman Dubbo", "Store", "Not named", "223 Cobra Street", "Current e-waste/take-back offer", "S52", 3),
    ("Dubbo Regional Council — Whylandra", "Resource recovery", "Not named here", "02 6801 4900 (Whylandra); 02 6801 4000 (Council)", "Information only: current e-waste contractor; trial processor; no collection request (HOLD)", "S38;S62", 2),
    ("NSW EPA", "Embedded batteries trial", "Not named", "131 555", "Trial processor and post-September 2026 status", "S40", 2),
    ("National EPA — NTCRS", "Co-regulatory arrangements", "Not named", "Via nationalepa.gov.au (legacy portal email ewaste@environment.gov.au — confirm current)", "How reuse before/after co-regulator custody is treated and reported", "S43;S42", 2),
    ("Woolworths Group", "Sustainability (media line found only)", "Not named", "Media 02 8885 1033 (routing only)", "BIG W recycler confirmation", "S18", 3),
]

QUESTIONS = [
    ("Q01", "Screenshot Eco E-Waste's secure data disposal page with date (companion report read it; this pass could not).", "EcoCycle website", "Screenshot", "Medium"),
    ("Q02", "Re-read PC submission No. 217 p3 and record a short verbatim quote before using it externally.", "PC website", "Read", "Low"),
    ("Q03", "Which EcoCycle entity services Dubbo's Woolworths, BIG W, Coles and Bunnings bins, how often, and via which consolidation point?", "EcoCycle", "Ask Spyro Kalos", "High"),
    ("Q04", "Do BIG W/Woolworths Dubbo bins feed EcoCycle directly or via MobileMuster for phones, and which consolidation point?", "EcoCycle / Woolworths Group", "Ask", "Medium"),
    ("Q05", "Does any EcoCycle stream test or grade devices before destruction? What do its R2v3 certificate scope and appendices cover?", "EcoCycle", "Certificate / ask", "High"),
    ("Q06", "Would EcoCycle accept residual devices and batteries from a small Dubbo refurbisher, on what terms and with what certificates?", "EcoCycle", "Ask", "High"),
    ("Q07", "Does MobileMuster accept regional reuse partners like The Reconnect Project, and what are the eligibility, data and reporting rules?", "MobileMuster", "Ask", "High"),
    ("Q08", "Who handles Officeworks Dubbo's Bring it Back IT equipment and who decides which items are reused by charities?", "Officeworks", "Ask store / corporate", "High"),
    ("Q09", "Does Circonomy have regional reuse partners and could one be in Dubbo?", "Officeworks/Circonomy", "Ask", "Medium"),
    ("Q10", "Who is Council's current e-waste contractor for Whylandra (post 30 June 2025)?", "Dubbo Regional Council", "Informal request / GIPA", "High"),
    ("Q11", "Who processed Whylandra's embedded-battery trial material and did the trial continue after September 2026?", "NSW EPA / Council", "Ask", "Medium"),
    ("Q12", "Are Coles, ALDI, Bunnings, IGA/Mitre 10 and telco stores in Dubbo running the bins described nationally?", "Site visits", "Photograph signage", "Medium"),
    ("Q13", "Does The Good Guys Dubbo have a TV cage and who collects its e-waste?", "The Good Guys Dubbo", "Ask", "Low"),
    ("Q14", "What, if anything, does Harvey Norman Dubbo offer for e-waste now?", "Harvey Norman Dubbo", "Ask", "Low"),
    ("Q15", "What does EPL 21136 (St Marys) authorise, and does any Dubbo material go there?", "NSW EPA register / EcoCycle", "Register check / ask", "Low"),
    ("Q16", "Does title in deposited items pass to the retailer or recycler at deposit, and does any programme term permit reuse?", "Retailers / legal", "Read programme terms", "Medium"),
    ("Q17", "Under current NTCRS rules and National EPA practice, can a co-regulator permit reuse of collected items and how is it reported?", "National EPA", "Ask", "Medium"),
    ("Q18", "When do NSW PLR Regulation 2026 battery obligations commence and do they affect a small refurbisher's battery handling?", "NSW EPA", "Read regulation", "Medium"),
    ("Q19", "Group ownership of EcoCycle: ASIC extract for the holding entity.", "ASIC", "Paid extract", "Low"),
    ("Q20", "What is the measured working/repairable share of devices arriving at Dubbo collection points? (No public data.)", "Field audit with permission", "Sample audit", "High"),
]

# ---------------------------------------------------------------------------
# Scenario model — the same planning assumptions as the 25 Nov AMR results
# document, extended to annual volumes. Illustrative only, not quotes.
# ---------------------------------------------------------------------------
ACQ, ERASE, INTAKE_MIN, RATE = 5.0, 12.0, 30, 30.0  # per input
PARTS, REFURB_MIN = 40.0, 45                        # per released unit
REJECT, BATCH_FIXED, BATCH_SIZE = 5.0, 50.0, 20
SALE = 150.0
VOLUMES = [100, 500, 1000, 5000]
YIELDS = [0.30, 0.60, 0.80]
FTE_HOURS = 1650  # approx productive hours in a full-time year (assumption)


def scenario_rows():
    rows = []
    for n in VOLUMES:
        for y in YIELDS:
            k = round(n * y)
            batches = math.ceil(n / BATCH_SIZE)
            intake_lab = n * INTAKE_MIN / 60 * RATE
            refurb_lab = k * REFURB_MIN / 60 * RATE
            cash = BATCH_FIXED * batches + n * (ACQ + ERASE) + k * PARTS + (n - k) * REJECT
            econ = cash + intake_lab + refurb_lab
            hours = n * INTAKE_MIN / 60 + k * REFURB_MIN / 60
            rows.append({
                "annual_inputs": n,
                "reuse_yield": f"{int(y*100)}%",
                "released_units": k,
                "batches_of_20": batches,
                "labour_hours": round(hours),
                "fte_equivalent": round(hours / FTE_HOURS, 2),
                "cash_cost_before_labour_aud": round(cash, 2),
                "economic_cost_incl_labour_aud": round(econ, 2),
                "cost_per_released_unit_aud": round(econ / k, 2) if k else None,
                "donation_model_funding_needed_aud": round(econ, 2),
                "sale_model_revenue_at_150_aud": round(k * SALE, 2),
                "sale_model_contribution_aud": round(k * SALE - econ, 2),
            })
    return rows


def write_csv(path, header, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        for r in rows:
            w.writerow(r)


def src_urls(ids):
    return " ".join(SOURCES[i][1] for i in ids.split(";") if i)


DOT = {
    "phones": r'''digraph phones {
  rankdir=TB; node [shape=box, style="rounded,filled", fillcolor="#f5f5f5", fontname="Helvetica", fontsize=10]; edge [fontname="Helvetica", fontsize=9];
  owner [label="Dubbo phone owner"];
  trade [label="Telco / retailer trade-in\n(e.g. Telstra via Assurant)", fillcolor="#e3f2e1"];
  charity [label="MobileMuster charity reuse partner\n(e.g. The Reconnect Project)", fillcolor="#e3f2e1"];
  bins [label="Woolworths / BIG W / JB / IGA units\nCouncil small stations"];
  telco [label="Telco store MobileMuster bin"];
  eco [label="Ecobatt / EcoCycle\ncollect + sort"];
  mm [label="MobileMuster\ndismantled in Australia"];
  sg [label="Boards, batteries, plastics\nprocessed in Singapore"];
  owner -> trade [label="reuse"]; owner -> charity [label="donate (reuse)"];
  owner -> bins [label="recycle"]; owner -> telco [label="recycle"];
  bins -> eco [label="verified nationally"]; eco -> mm [label="2021 statement", style=dashed];
  telco -> mm; mm -> sg;
  bins -> mm [label="council stations:\ncollector unnamed", style=dotted];
}''',
    "computers": r'''digraph computers {
  rankdir=LR; node [shape=box, style="rounded,filled", fillcolor="#f5f5f5", fontname="Helvetica", fontsize=10]; edge [fontname="Helvetica", fontsize=9];
  owner [label="Dubbo household /\nsmall business"];
  biz [label="Larger organisation\n(lease / ITAD contract)"];
  donate [label="Direct donation to\nDubbo eWaste (reuse-first)", fillcolor="#e3f2e1"];
  ow [label="Officeworks Bring it Back\n'may be reused by charities'", fillcolor="#fff7d6"];
  jb [label="JB / Good Guys e-waste\n(Ecoactiv booking, in-store)"];
  why [label="Whylandra CRC\n(contractor after Jun 2025 unknown)"];
  amr [label="AMR Dubbo yard\n(downstream unnamed)"];
  itad [label="ITAD erasure + remarketing\n(e.g. JB Business partner)", fillcolor="#e3f2e1"];
  rec [label="NTCRS-certified recycler\n(dismantle / shred)"];
  owner -> donate [label="before disposal"]; owner -> ow; owner -> jb; owner -> why; owner -> amr;
  biz -> itad; biz -> rec [label="destruction contracts"];
  ow -> rec; jb -> rec [style=dashed]; why -> rec [style=dashed, label="unverified"]; amr -> rec [style=dashed, label="partners unnamed"];
  itad -> rec [label="rejects"]; donate -> rec [label="rejects via\nverified downstream", style=dashed];
}''',
    "batteries": r'''digraph batteries {
  rankdir=TB; node [shape=box, style="rounded,filled", fillcolor="#f5f5f5", fontname="Helvetica", fontsize=10]; edge [fontname="Helvetica", fontsize=9];
  owner [label="Dubbo resident"];
  bcycle [label="B-cycle bins\n(Woolworths, BIG W, Coles, Bunnings, ALDI)"];
  trial [label="Whylandra embedded-battery\ntrial (Sep 2024 – Sep 2026)"];
  ewaste [label="E-waste stream\n(laptops excluded from trial)"];
  sort [label="Ecobatt / Close the Loop\nsort by chemistry"];
  bids [label="EcoBatt BIDS plant, Campbellfield\n(up to 95% material recovery)"];
  unk [label="Trial processor\n(not public)", fillcolor="#fde2e2"];
  owner -> bcycle; owner -> trial [label="toys, vapes,\nsmall devices"]; owner -> ewaste [label="laptops, controllers"];
  bcycle -> sort; trial -> unk [style=dashed]; unk -> bids [style=dotted, label="possible, not evidenced"];
}''',
}


def build_diagrams():
    os.makedirs(DIAG, exist_ok=True)
    have_dot = shutil.which("dot") is not None
    for name, src in DOT.items():
        p = os.path.join(DIAG, f"{name}.dot")
        with open(p, "w", encoding="utf-8") as f:
            f.write(src + "\n")
        if have_dot:
            for fmt in ("svg", "png"):
                subprocess.run(["dot", f"-T{fmt}", "-Gdpi=150" if fmt == "png" else "-Gdpi=72", p, "-o", os.path.join(DIAG, f"{name}.{fmt}")], check=True)


def append_evidence_yaml():
    path = os.path.join("data", "evidence.yaml")
    marker = "\n# EcoCycle / EcoBatt Dubbo supply-chain research — 28 November 2026\n"
    with open(path, encoding="utf-8") as f:
        text = f.read()
    if marker in text:  # regenerate this pass's block (always the last block)
        text = text[: text.index(marker)]
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
    existing = yaml.safe_load(text) or []
    ids = {r.get("id") for r in existing}
    type_map = {"VERIFIED": "Verified Fact", "CORROBORATED": "Verified Fact", "PARTIAL": "Research Lead", "UNVERIFIED": "Research Lead", "INFERENCE": "Hypothesis"}
    new = []
    for eid, claim, status, klass, conf, srcs, prelim, notes in EVIDENCE:
        rid = f"EVD-ECO-{eid[1:]}"
        if rid in ids:
            continue
        first = srcs.split(";")[0] if srcs else ""
        if status == "VERIFIED" and klass in ("Independently verified fact", "Historical evidence"):
            method = "Public registry" if first in ("S08", "S43", "S46", "S47") else "Primary source"
        elif status == "VERIFIED":
            method = "Primary source"
        elif status == "CORROBORATED":
            method = "Independent secondary source"
        elif status == "INFERENCE":
            method = "Industry inference"
        else:
            method = "Independent secondary source" if first else "Industry inference"
        if klass == "Company claim" and status == "VERIFIED":
            notes = ("Company/retailer self-description; " + notes).strip()
        new.append({
            "id": rid,
            "claim": claim,
            "type": type_map[status],
            "source": SOURCES[first][0] if first else "Not retrievable this session",
            "url": SOURCES[first][1] if first else "https://github.com/joshualparris/DubboEwaste/blob/main/docs/ECOCYCLE-ECOBATT-DUBBO-SUPPLY-CHAIN-RESEARCH-2026-11-28.md",
            "date_checked": DATE,
            "verification_method": method,
            "confidence": conf,
            "notes": f"[{status}; {klass}] {notes}".strip(),
        })
    if new:
        with open(path, "a", encoding="utf-8") as f:
            f.write(marker)
            f.write(yaml.safe_dump(new, sort_keys=False, allow_unicode=True, width=110))
    return len(new)


def main():
    if not os.path.exists(os.path.join("data", "evidence.yaml")):
        sys.exit("Run from the DubboEwaste repository root.")
    os.makedirs(OUT, exist_ok=True)

    ev_rows = [(e[0], e[1], e[2], e[3], e[4], e[6], e[5], src_urls(e[5]), DATE, e[7]) for e in EVIDENCE]
    write_csv(os.path.join(OUT, "evidence-register.csv"),
              ["id", "claim", "status", "evidence_class", "confidence", "tests_preliminary_claim", "source_ids", "source_urls", "date_checked", "notes"], ev_rows)
    with open(os.path.join(OUT, "evidence-register.json"), "w", encoding="utf-8") as f:
        json.dump({
            "title": "EcoCycle/EcoBatt and Dubbo e-waste supply chain — evidence register",
            "date_checked": DATE,
            "status_values": ["VERIFIED", "CORROBORATED", "PARTIAL", "UNVERIFIED", "INFERENCE"],
            "companion_report": SOURCES["C00"][1],
            "sources": {k: {"title": v[0], "url": v[1]} for k, v in SOURCES.items()},
            "evidence": [dict(zip(["id", "claim", "status", "evidence_class", "confidence", "tests_preliminary_claim", "source_ids", "source_urls", "date_checked", "notes"], r)) for r in ev_rows],
        }, f, indent=2, ensure_ascii=False)

    write_csv(os.path.join(OUT, "collection-network.csv"),
              ["organisation", "dubbo_presence", "accepts", "known_partner", "evidence_status", "reuse_signal", "source_ids", "notes"], NETWORK)
    write_csv(os.path.join(OUT, "device-pathways.csv"),
              ["device_category", "dubbo_entry_points", "scheme", "known_processing", "tested_before_destruction", "realistic_reuse_window", "evidence_status"], PATHWAYS)
    write_csv(os.path.join(OUT, "stakeholders.csv"),
              ["organisation", "role", "publicly_named_person", "public_contact", "purpose", "source_ids", "priority"], STAKEHOLDERS)
    write_csv(os.path.join(OUT, "open-questions.csv"),
              ["id", "question", "who_can_answer", "method", "priority"], QUESTIONS)

    sc = scenario_rows()
    write_csv(os.path.join(OUT, "scenarios.csv"), list(sc[0].keys()), [list(r.values()) for r in sc])
    with open(os.path.join(OUT, "sources.json"), "w", encoding="utf-8") as f:
        json.dump({k: {"title": v[0], "url": v[1]} for k, v in SOURCES.items()}, f, indent=2, ensure_ascii=False)

    build_diagrams()
    added = append_evidence_yaml()
    print(f"evidence rows: {len(EVIDENCE)}; network: {len(NETWORK)}; pathways: {len(PATHWAYS)}; stakeholders: {len(STAKEHOLDERS)}; questions: {len(QUESTIONS)}; scenarios: {len(sc)}; evidence.yaml added: {added}")


if __name__ == "__main__":
    main()
