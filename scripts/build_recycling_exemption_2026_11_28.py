#!/usr/bin/env python3
"""Build data files and evidence records for the NSW recycling-program exemption research (28 Nov 2026).

Usage: python3 scripts/build_recycling_exemption_2026_11_28.py

Writes data/recycling-exemption-2026-11-28/*.csv|json and regenerates the EVD-RPE-* block in
data/evidence.yaml (everything after the marker line below, up to the next top-level '# ' marker or EOF).
"""
import csv
import json
import os
import re

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "recycling-exemption-2026-11-28")
MARKER = "# Recycling-program exemption research — 28 November 2026"
CHECKED = "2026-11-28"

# ---------------------------------------------------------------------------
# Sources. 'access' records how the text was actually read.
# ---------------------------------------------------------------------------
SOURCES = [
    ("S01", "Pawnbrokers and Second-hand Dealers Regulation 2026 (2026 No 442), version from 21 Aug 2026",
     "https://legislation.nsw.gov.au/view/whole/html/inforce/2026-08-21/sl-2026-0442",
     "Official text read through search-index excerpts (cl 1-2, 5(1), 7, 33, government purchase and factory seconds clauses). Direct page fetch failed twice (client error)."),
    ("S02", "NSW legislation notification, bulletin 23 Aug 2026",
     "https://legislation.nsw.gov.au/epub?bulletin=20260823",
     "Search excerpt: Regulation 2026 (2026-442) published LW 21 August 2026."),
    ("S03", "Pawnbrokers and Second-hand Dealers Regulation 2021, cl 6 and Sch 1",
     "https://legislation.nsw.gov.au/view/whole/html/inforce/current/sl-2021-0044",
     "Page fetched 28 Nov 2026 plus search excerpts of the 12 Feb 2025 version."),
    ("S04", "Pawnbrokers and Second-hand Dealers Regulation 2015, version 28 Aug 2015, cl 6",
     "https://legislation.nsw.gov.au/view/whole/html/inforce/2015-08-28/sl-2015-0500",
     "Search excerpt."),
    ("S05", "Regulation 2015 compare view 28 Aug 2015 to 26 Jul 2019, cl 6(3)",
     "https://legislation.nsw.gov.au/view/html/compare/2015-08-28/2019-07-26/sl-2015-0500",
     "Search excerpt; amending instrument not identified."),
    ("S06", "Pawnbrokers and Second-hand Dealers Regulation 2003, version 1 Jul 2007, cl 6",
     "https://legislation.nsw.gov.au/view/whole/html/2007-07-01/sl-2003-0627",
     "Search excerpt."),
    ("S07", "Pawnbrokers and Second-hand Dealers Regulation 1997, versions 2001-2003, cl 6A",
     "https://legislation.nsw.gov.au/view/whole/html/2001-03-31/sl-1997-0163",
     "Search excerpts; history note 'cl 6A: Ins 24.7.1998'."),
    ("S08", "Regulatory Impact Statement, proposed Regulation 2020 (NSW Customer Service)",
     "https://www.productivity.nsw.gov.au/sites/default/files/2020-09/Pawnbrokers%20and%20Second-hand%20Dealers%20Draft%20Regulation%202020.pdf",
     "PDF fetched 28 Nov 2026: s 5.3 p 13, Appendix 4 p 29, objectives p 4, s 5.2 p 11."),
    ("S09", "Pawnbrokers and Second-hand Dealers Act 1996, version from 20 Aug 2024",
     "https://legislation.nsw.gov.au/view/whole/html/inforce/2024-08-20/act-1996-013",
     "Search excerpts: s 4(1), s 7 penalty, s 38."),
    ("S10", "Pawnbrokers and Second-hand Dealers Act 1996, version 1 Dec 2014",
     "https://legislation.nsw.gov.au/view/whole/html/inforce/2014-12-01/act-1996-013",
     "Search excerpts: s 3 definition of second-hand goods, s 4(2)(a)-(b), s 7. Direct fetch failed."),
    ("S11", "Pawnbrokers and Second-hand Dealers Act 1996, XML export 11 Aug 2024 (s 38)",
     "https://legislation.nsw.gov.au/export/xml/2024-08-11/act-1996-013",
     "Search excerpt."),
    ("S12", "Act PDF, status page",
     "https://legislation.nsw.gov.au/view/whole/pdf/inforce/2025-11-12/act-1996-013",
     "Search excerpt: 'Current version for 20 August 2024 to date (accessed 10 December 2025)'. Direct fetch failed."),
    ("S13", "Act contents, version 2 Jul 2022",
     "https://legislation.nsw.gov.au/view/html/inforce/2022-07-02/act-1996-13",
     "Search excerpt: contents list includes 'Forfeiture of goods dealt with by unlicensed persons'."),
    ("S14", "NSW Government: Pawnbroker and second-hand dealer licences (updated 1 Sep 2026)",
     "https://www.nsw.gov.au/business-and-economy/running-a-business/industry-specific-business-requirements/pawnbrokers-and-second-hand-dealers/pawnbroker-and-second-hand-dealer-licences",
     "Page fetched 28 Nov 2026."),
    ("S15", "NSW Government: Running a market stall selling second-hand goods (updated 1 Sep 2026)",
     "https://www.nsw.gov.au/business-and-economy/running-a-business/industry-specific-business-requirements/running-a-second-hand-market-stall",
     "Page fetched 28 Nov 2026."),
    ("S16", "NSW Government: Limited exemptions for pawnbrokers and second-hand dealers (list as of 27 Feb 2025)",
     "https://www.nsw.gov.au/business-and-economy/running-a-business/industry-specific-business-requirements/pawnbrokers-and-second-hand-dealers/limited-exemptions-for-pawnbrokers-and-second-hand-dealers",
     "Page fetched 28 Nov 2026."),
    ("S17", "Waste Avoidance and Resource Recovery Act 2001, s 3 (version 1 Jul 2008)",
     "https://legislation.nsw.gov.au/view/whole/html/inforce/2008-07-01/act-2001-058",
     "Search excerpt; current version not opened."),
    ("S18", "NSW EPA: The waste hierarchy",
     "https://www.epa.nsw.gov.au/Your-environment/Recycling-and-reuse/warr-strategy/The-waste-hierarchy",
     "Search excerpt."),
    ("S19", "NSW Government: Authority to fundraise in NSW",
     "https://www.nsw.gov.au/money-and-taxes/charitable-fundraising/charitable-fundraising-guidelines/authority-to-fundraise-nsw",
     "Search excerpt."),
    ("S20", "NSW Government: Conducting an appeal",
     "https://www.nsw.gov.au/money-and-taxes/charitable-fundraising/charitable-fundraising-guidelines/conducting-an-appeal",
     "Search excerpt."),
    ("S21", "ABLIS: Authority to Fundraise for Charitable Purposes (NSW)",
     "https://ablis.business.gov.au/Redirect/Service/52114e3c-a421-4790-80dd-c2340bf3ef6c",
     "Search excerpt."),
    ("S22", "ABLIS: Pawnbroker or Second-Hand Dealer's Licence (NSW)",
     "https://ablis.business.gov.au/service/nsw/pawnbroker-or-second-hand-dealers-licence/16617",
     "Search excerpts (names Regulation 2026; eligibility)."),
    ("S23", "DubboEwaste docs/LEGAL-LICENSING.md (fees recorded from the 1 Sep 2026 Fair Trading page)",
     "https://github.com/joshualparris/DubboEwaste/blob/main/docs/LEGAL-LICENSING.md",
     "Repo record; fees not re-read in this pass."),
    ("S24", "WorkVentures website (home, CircularIT, NSW Device Bank EOI)",
     "https://workventures.com.au/",
     "Search excerpts."),
    ("S25", "Fair Trading and Building Legislation Amendment Bill 2026, first print (Schedule 14)",
     "https://www.parliament.nsw.gov.au/bill/files/18857/First%20Print.pdf",
     "Search excerpt; passage status not checked."),
    ("S26", "Service NSW: Apply for a pawnbroker licence",
     "https://www.service.nsw.gov.au/transaction/apply-for-a-pawnbroker-licence",
     "Search excerpt."),
    ("S27", "Pawnbrokers and Second-hand Dealers Regulation 2008, version 4 Mar 2015, cl 5(3)",
     "https://legislation.nsw.gov.au/view/whole/html/2015-03-04/sl-2008-0391",
     "Search excerpt."),
    ("S28", "Pawnbrokers and Second-hand Dealers Act 1996, current version (s 4A Exemptions)",
     "https://legislation.nsw.gov.au/view/whole/html/inforce/current/act-1996-013",
     "Search excerpts of the official current page: s 4A(1)-(3); history note 's 4A: Ins 2020 No 25'."),
    ("S29", "Pawnbrokers and Second-hand Dealers Regulation 2021, version 12 Feb 2025 (fee waiver clause)",
     "https://legislation.nsw.gov.au/view/whole/html/inforce/2025-02-12/sl-2021-0044",
     "Search excerpt."),
    ("S30", "Companion report: docs/NSW-RECYCLING-PROGRAMME-LICENCE-EXEMPTION-2026-11-28.md (other session, same day)",
     "https://github.com/joshualparris/DubboEwaste/blob/main/docs/NSW-RECYCLING-PROGRAMME-LICENCE-EXEMPTION-2026-11-28.md",
     "Repo record; its findings not re-verified here unless also cited to another source."),
]

# ---------------------------------------------------------------------------
# Evidence. status: VERIFIED | PARTIAL | INFERENCE | UNRESOLVED | NOT_FOUND
# ---------------------------------------------------------------------------
EVIDENCE = [
    ("E01", "VERIFIED", "The current instrument is the Pawnbrokers and Second-hand Dealers Regulation 2026 (2026 No 442), published on the NSW legislation website on 21 August 2026. It repeals and replaces the 2021 Regulation.", "S01;S02;S22", "High"),
    ("E02", "VERIFIED", "Regulation 2026 cl 33 'Exemption for recycling programs': the Act does not apply to acts or omissions relating to (a) buying or selling goods collected in a recycling program or rubbish collection program, or (b) contracting with another person to give the person ownership of goods collected in such a program.", "S01", "High"),
    ("E03", "PARTIAL", "Compared with 2021 cl 6(1), the 2026 clause no longer has a separate limb for 'conducting a recycling program', and limb (a) now covers buying as well as selling. Whether cl 33 has further subclauses was not seen, because the full page could not be opened.", "S01;S03", "Medium"),
    ("E04", "VERIFIED", "Neither the Act, the 2026 clause text seen, nor Fair Trading's guidance defines 'recycling program' or 'rubbish collection program'. No registration, approval, minimum volume, entity type, non-profit condition or downstream-recycler condition appears in the text seen.", "S01;S09;S14", "Medium"),
    ("E05", "VERIFIED", "History: from 24 Jul 1998 (1997 Reg cl 6A) the exemption covered only acts by a local government council or its employees.", "S07", "High"),
    ("E06", "VERIFIED", "2003 and 2015 Regulations limited the exemption to an 'approved person', which included a contractor acting for a council under a contract won by tender.", "S04;S06", "High"),
    ("E07", "PARTIAL", "By 26 Jul 2019 the 2015 Regulation also said recycling-program activity carried out in the course of, or ancillary to, a business that does not need a licence was not carrying on a dealer business. The amending instrument and date were not identified.", "S05", "Medium"),
    ("E08", "VERIFIED", "2021 Regulation cl 6(1) removed the 'approved person' limit: the Act did not apply to acts in connection with conducting a recycling or rubbish collection program, selling goods collected in one, or contracting to give ownership of such goods.", "S03", "High"),
    ("E09", "VERIFIED", "The 2020 RIS says the change expanded the council-only exemption 'to include all recycling programs as well as rubbish collection programs', giving examples of programs run by the Australian Government and community recycling schemes. It states no criteria and does not mention charities, private recyclers or e-waste.", "S08", "High"),
    ("E10", "VERIFIED", "The 2020 RIS gives the Act's implied objectives as limiting the traffic in stolen goods through dealer businesses and enhancing NSW Police capability to combat property theft.", "S08", "High"),
    ("E11", "VERIFIED", "Act s 7: a person must not carry on a business of buying or selling second-hand goods except in accordance with a licence held by the person. Maximum penalty 100 penalty units.", "S09;S10", "High"),
    ("E12", "VERIFIED", "Act s 38: in proceedings, a person who sold second-hand goods on more than 6 days in any 12 months is presumed to be carrying on a business of buying or selling second-hand goods; the presumption can be rebutted.", "S09;S11", "High"),
    ("E13", "VERIFIED", "Electronic goods are a prescribed class (2026 Reg cl 5(1)(b)); 2021 wording was 'electric or electronic goods, including mobile phones, global positioning system equipment and audio devices'.", "S01;S03;S14", "High"),
    ("E14", "VERIFIED", "Act s 4(2): the Act does not apply to dealing in second-hand goods in the course of a fundraising appeal authorised under the Charitable Fundraising Act 1991, or to the business of an auctioneer.", "S10;S14", "High"),
    ("E15", "VERIFIED", "Act s 4(1): the Act does not require a licence for an activity authorised by a licence, permit or other authority under another Act.", "S09;S10", "High"),
    ("E16", "VERIFIED", "2026 Reg: the Act does not apply to a person to the extent the person buys second-hand goods from a government sector agency, a statutory public authority or a State owned corporation; nor to a person dealing only in factory seconds.", "S01", "High"),
    ("E17", "PARTIAL", "2026 Reg keeps an ancillary-business carve-out (a business not otherwise required to be licensed; uncollected goods, trade-ins and rental goods in the 2021 version). Full 2026 wording not seen.", "S01;S03;S14", "Medium"),
    ("E18", "VERIFIED", "Penalty notice for unlicensed dealing (Act s 7) under the 2021 Regulation Sch 1: $1,100 for an individual, $2,200 for a corporation. The 2026 Schedule amount was not read.", "S03", "Medium"),
    ("E19", "PARTIAL", "Fees 2026-27 (recorded in repo from the Fair Trading page): new licence $692 for 1 year, $1,574 for 3 years, $2,456 for 5 years; no fee concession found.", "S23", "Medium"),
    ("E20", "VERIFIED", "You cannot operate as a second-hand dealer while a licence application is being assessed.", "S14;S26", "High"),
    ("E21", "VERIFIED", "Every published limited exemption (list as of 27 Feb 2025) belongs to a named licensee with a licence number and lifts specific duties (ID evidence s 15, records s 16, retention s 21). None removes the licence requirement.", "S16", "High"),
    ("E22", "VERIFIED", "Licensed technology businesses on that list include TES-AMM (2PS04726), Asurion (2PS16175), Assurant (2PS20872), Kingfisher Mobile (2PS22126), Industry Trading (2PS23292) and Likewise (2PS26174, 2PS26251).", "S16", "High"),
    ("E23", "VERIFIED", "NSW waste law lists reuse, reprocessing, recycling and energy recovery as separate parts of 'resource recovery' (WARR Act s 3; EPA waste hierarchy).", "S17;S18", "High"),
    ("E24", "INFERENCE", "Because 'recycling' sits beside 'reuse' in NSW waste law, a regulator or court could read 'recycling program' narrowly and treat a refurbish-and-resell operation as reuse trading, not recycling. Equally, the 2021 RIS intent to cover 'all recycling programs' and community schemes, and industry usage (e.g. WorkVentures calls its reuse work an 'e-waste recycling program'), support a wider reading.", "S08;S17;S24", "Medium"),
    ("E25", "VERIFIED", "An individual or organisation conducting a charitable fundraising appeal in NSW needs an authority unless exempt; ACNC charities are eligible; small volunteer-only fundraisers are exempt; ABLIS lists no fee, a $15,000-a-year trigger and 28-day processing.", "S19;S21", "Medium"),
    ("E26", "VERIFIED", "A participant may only take part in a fundraising appeal with written authority from the authority holder.", "S20", "High"),
    ("E27", "UNRESOLVED", "Whether an appeal by a fundraiser exempt from holding an authority counts as 'authorised under the Charitable Fundraising Act' for Act s 4(2)(a).", "S10;S19", "Low"),
    ("E28", "NOT_FOUND", "No NSW court or tribunal decision interpreting 'recycling program' in this legislation was found; no 2026 RIS or consultation paper for the 2026 Regulation was found.", "S01", "Low"),
    ("E29", "NOT_FOUND", "The NSW public register for second-hand dealer licences could not be reached with the tools available, so licence status of comparable organisations other than those on the exemptions list was not checked.", "S16", "Low"),
    ("E30", "PARTIAL", "A Fair Trading and Building Legislation Amendment Bill 2026 proposes amendments to the Act (Schedule 14, licence cancellation orders). Passage and effect were not checked.", "S25", "Low"),
    ("E31", "VERIFIED", "The Act's version current from 20 Aug 2024 was still current when accessed on 10 Dec 2025; the Act includes a provision for forfeiture of goods dealt with by unlicensed persons.", "S12;S13", "Medium"),
    ("E32", "VERIFIED", "Act s 4A (inserted 2020): the Secretary may, by written notice, exempt a person from the operation of the Act or specified provisions; an exemption can have conditions and an expiry, can be amended or revoked, and its details must be published.", "S28", "High"),
    ("E33", "PARTIAL", "Regulation 2026 has a clause headed 'Powers to waive, reduce, postpone or refund fees' (cl 32). Its wording was not read; the 2021 equivalent allowed this where the person suffers financial hardship or special circumstances exist.", "S01;S29", "Medium"),
    ("E34", "VERIFIED", "Regulation 2026 notes the processing fee is discounted for applications made electronically, and that if an application is refused or withdrawn all fees except the processing fee are refunded.", "S01", "Medium"),
    ("E35", "PARTIAL", "A companion report the same day reached the same direction (seek written classification; no licence purchase just to remove doubt) but could not read the 2026 wording. It adds Scrap Metal Industry Act obligations for scrap streams, the Service NSW Small Business Advisory program and comparator details; those were not re-verified here.", "S30", "Medium"),
]

# ---------------------------------------------------------------------------
# Legislation history
# ---------------------------------------------------------------------------
HISTORY = [
    ("1997 Reg cl 6A (inserted 24 Jul 1998)", "Local government council or its employees only", "Conducting a recycling program; selling goods collected in one; contracting to give ownership", "S07"),
    ("2003 Reg cl 6(1)", "'Approved person': council, or contractor acting for a council under a tendered contract", "Same three limbs", "S06"),
    ("2008 Reg", "'Approved person' (council or tendered council contractor)", "Same three limbs", "S27"),
    ("2015 Reg cl 6(1)", "'Approved person' (council or tendered council contractor)", "Same three limbs", "S04"),
    ("2015 Reg cl 6(3) (by Jul 2019)", "Any person acting in the course of, or ancillary to, a business that does not need a licence", "Same three limbs treated as not carrying on a dealer business", "S05"),
    ("2021 Reg cl 6(1)", "Anyone ('approved person' removed)", "Conducting a recycling or rubbish collection program; selling goods collected in one; contracting to give ownership", "S03;S08"),
    ("2026 Reg cl 33 (from 21 Aug 2026)", "Anyone (no person limit seen)", "Buying or selling goods collected in a recycling or rubbish collection program; contracting to give ownership. No separate 'conducting' limb seen.", "S01"),
]

# ---------------------------------------------------------------------------
# Activity matrix. position vocabulary:
#   NOT DEALING | EXEMPT IF GENUINE PROGRAM | OTHER EXEMPTION | UNCERTAIN | LICENCE LIKELY
# ---------------------------------------------------------------------------
ACTIVITIES = [
    ("A01", "Free donated computers and laptops, given away free after refurbishment", "No buying or selling", "NOT DEALING", "s 7 covers a business of buying or selling; gifting is neither.", "Any payment, 'donation' required in return, or swaps.", "High"),
    ("A02", "Free donated computers and laptops, refurbished and sold", "Selling", "EXEMPT IF GENUINE PROGRAM", "Reg 2026 cl 33(a) covers selling goods collected in a recycling program; 'program' undefined.", "Fair Trading's written view; whether the operation looks like a genuine program or ordinary trading.", "Medium"),
    ("A03", "Unwanted phones and tablets collected free, sold", "Selling", "UNCERTAIN", "Same as A02, but phones are the classic high-theft goods the Act targets, so scrutiny is likelier.", "Fair Trading's view; IMEI and lock checks.", "Low"),
    ("A04", "Bulk graphics cards and components bought", "Buying and selling", "LICENCE LIKELY", "Buying from the public or traders is not goods collected in a program, unless bought from a program (cl 33(a)), a government body, or as factory seconds.", "Source of the lots.", "Medium"),
    ("A05", "Equipment purchased for refurbishment", "Buying and selling", "LICENCE LIKELY", "Same as A04.", "Buying only from government bodies or from a recycling program.", "Medium"),
    ("A06", "Equipment collected free from businesses", "Selling (if sold)", "EXEMPT IF GENUINE PROGRAM", "As A02; business origin does not change the clause.", "If the business is paid a price, it becomes buying.", "Medium"),
    ("A07", "Repairs to customer-owned devices", "Neither", "NOT DEALING", "Repair for a fee is a service; the owner keeps title.", "Taking devices as trade-ins or buying them.", "High"),
    ("A08", "Refurbished electronics sold on eBay or Facebook Marketplace", "Selling", "EXEMPT IF GENUINE PROGRAM", "Online selling is not treated separately in the text seen; s 38 presumption applies above 6 selling days in 12 months.", "Source of the goods; Fair Trading's view.", "Medium"),
    ("A09", "Parts harvested from unusable collected devices, sold", "Selling", "UNCERTAIN", "Arguably still 'goods collected in' the program; not addressed in text or guidance.", "Fair Trading's view.", "Low"),
    ("A10", "Personal belongings sold occasionally", "Selling", "NOT DEALING", "Not carrying on a business, but selling on more than 6 days in 12 months raises the s 38 presumption.", "Frequency; mixing with Dubbo eWaste stock.", "Medium"),
    ("A11", "Commercial IT asset disposal (paid to take corporate gear, then resell)", "Selling", "UNCERTAIN", "Goods are collected, but a paid ITAD contract looks like ordinary trade.", "Fair Trading's view; contract terms on title.", "Low"),
    ("A12", "Repair Cafe sessions", "Neither", "NOT DEALING", "Owners keep their items.", "Selling unclaimed items.", "High"),
    ("A13", "Selling through a partner charity's fundraising appeal", "Selling (by charity)", "OTHER EXEMPTION", "Act s 4(2)(a): dealing in the course of a fundraising appeal authorised under the Charitable Fundraising Act 1991. Participants need written authority.", "Charity's authority status; whether an exempt small fundraiser counts as 'authorised'.", "Medium"),
    ("A14", "Commission or consignment sales for other people", "Selling", "LICENCE LIKELY", "Selling for others is selling; no exemption found.", "None found.", "Medium"),
    ("A15", "Government or public-authority surplus bought", "Buying", "OTHER EXEMPTION", "2026 Reg: the Act does not apply to the extent a person buys from a government sector agency, statutory authority or State owned corporation.", "Whether the onward sale is also covered ('to the extent' wording).", "Medium"),
    ("A16", "Rejects and scrap given or sold to recyclers", "Selling (if paid)", "EXEMPT IF GENUINE PROGRAM", "Giving away is not dealing; selling collected goods falls under cl 33(a).", "Payment and the program question.", "Medium"),
]

ORGS = [
    ("TES-AMM Australia", "ITAD and e-waste", "Licensed (2PS04726)", "S16", "Limited exemption from s 16(5A) police furnishing; condition to notify if buying from individuals."),
    ("Asurion Australia", "Device insurance and trade-in", "Licensed (2PS16175)", "S16", "Exempt from s 16(5A) and s 21(1) for IMEI/serial devices."),
    ("Assurant Services Australia", "Telco trade-in and protection", "Licensed (2PS20872)", "S16", "Exemptions tied to Optus and Telstra programs."),
    ("Kingfisher Mobile Australia", "Telstra-sourced phones", "Licensed (2PS22126)", "S16", "Exempt from s 15, s 16 and s 21 for listed programs."),
    ("Industry Trading", "Goods type not stated", "Licensed (2PS23292)", "S16", "Exempt from s 15, s 16, s 21; notify if buying from individuals."),
    ("Likewise Device Protection / Likewise Olive", "Device swap and upgrade programs", "Licensed (2PS26174, 2PS26251)", "S16", "Program-specific exemptions."),
    ("Alegre Pty Ltd", "Devices tracked by serial/IMEI", "Licensed (2PS11940)", "S16", "Exempt from ID, records and retention with tracking conditions."),
    ("Egans Asset Management", "Asset management", "Licensed (2PS25943)", "S16", "Exempt from electronic records requirement."),
    ("WorkVentures", "Charity refurbishing donated laptops; runs NSW Device Bank pilot", "Not checked", "S24", "Describes its work as an 'e-waste recycling program'. Licence status unknown."),
    ("The Reconnect Project; PonyUp for Good; The Laptop Initiative; Fliptech; EcoCycle; Sircel; MobileMuster; PhoneCycle; TechCollect; Good360; Compnow; Sims Lifecycle Services; Greenbox; G1 Asset Management; local refurbishers; Repair Cafes; council reuse shops; Men's Sheds", "Various", "Not checked", "", "Register not reachable in this pass. Absence of a check is not evidence that any is licensed, unlicensed or exempt."),
]

MODELS = [
    (1, "Donate-only", "$0", "Gift refurbished devices; give rejects to recyclers; no sales.", "No resale income.", "High: no buying or selling, so s 7 is not engaged.", "Keep records anyway; never take payment or 'donations' in exchange for a device."),
    (2, "Repair service plus donate-only", "$0", "Paid repairs of customer-owned devices; donate surplus.", "No sale of collected stock.", "High.", "Don't buy devices or take trade-ins."),
    (3, "Partner charity sells under its fundraising authority", "$0 licence; authority has no fee", "Charity sells refurbished devices you donate to it; you volunteer with written authority.", "You can't sell in your own name; proceeds belong to the charity's appeal.", "Medium: depends on the charity's authority and Fair Trading's reading of s 4(2)(a).", "Written participant authority; charity controls sales and proceeds."),
    (4, "Genuine recycling program selling collected goods (cl 33)", "$0", "Collect free through a public program; refurbish; sell collected goods; recycle the rest.", "No buying stock from the public; scope of 'program' unconfirmed.", "Low to medium until Fair Trading answers in writing.", "Only after a written Fair Trading view; keep purchased stock out entirely."),
    ("4a", "Section 4A exemption from s 7 or specific duties (discretionary)", "Not published", "Whatever the written notice allows.", "No whole-licence precedent; conditions; published; revocable.", "Low until Fair Trading indicates it would consider one.", "Ask first; narrow, tracked scope."),
    (5, "Hybrid: licence for traded stock", "$692 (1 yr) / $1,574 (3 yr) / $2,456 (5 yr)", "Buy, sell and consign any electronic goods.", "ID checks, police reporting within 3 days, 14-day hold with no alteration, records, notified premises.", "High once licensed.", "Can't trade while the application is pending."),
]


def write_csv(name, header, rows):
    path = os.path.join(OUT, name)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)


def yaml_records():
    src = {s[0]: s for s in SOURCES}
    out = []
    type_map = {"VERIFIED": "Verified Fact", "PARTIAL": "Verified Fact", "INFERENCE": "Hypothesis",
                "UNRESOLVED": "Research Lead", "NOT_FOUND": "Research Lead"}
    method_map = {"VERIFIED": "Primary source", "PARTIAL": "Primary source", "INFERENCE": "Industry inference",
                  "UNRESOLVED": "Primary source", "NOT_FOUND": "Primary source"}
    for i, (eid, status, claim, sids, conf) in enumerate(EVIDENCE, 1):
        first = sids.split(";")[0]
        out.append({
            "id": f"EVD-RPE-{i:03d}",
            "claim": claim,
            "type": type_map[status],
            "source": f"Recycling-program exemption research {eid}: {src[first][1]}",
            "url": src[first][2],
            "date_checked": CHECKED,
            "verification_method": method_map[status],
            "confidence": conf,
            "notes": f"[{status}] Sources {sids.replace(';', ', ')}. {src[first][3]}",
        })
    return out


def update_evidence_yaml():
    path = os.path.join(ROOT, "data", "evidence.yaml")
    with open(path, encoding="utf-8") as f:
        text = f.read()
    block = MARKER + "\n" + yaml.safe_dump(yaml_records(), sort_keys=False, allow_unicode=True, width=110)
    if MARKER in text:
        start = text.index(MARKER)
        nxt = re.search(r"^# ", text[start + len(MARKER):], flags=re.M)
        end = start + len(MARKER) + nxt.start() if nxt else len(text)
        text = text[:start] + block + text[end:]
    else:
        text = text.rstrip("\n") + "\n" + block
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def main():
    os.makedirs(OUT, exist_ok=True)
    write_csv("sources.csv", ["id", "title", "url", "access"], SOURCES)
    write_csv("evidence-register.csv", ["id", "status", "claim", "sources", "confidence"], EVIDENCE)
    write_csv("legislation-history.csv", ["instrument", "who_is_covered", "activities_covered", "sources"], HISTORY)
    write_csv("activity-matrix.csv", ["id", "activity", "buying_or_selling", "likely_position", "basis", "what_would_change_it", "confidence"], ACTIVITIES)
    write_csv("organisations.csv", ["organisation", "activity", "licence_status_found", "source", "notes"], ORGS)
    write_csv("operating-models.csv", ["rank", "model", "licence_cost", "what_you_can_do", "limits", "legal_certainty", "conditions"], MODELS)
    with open(os.path.join(OUT, "evidence-register.json"), "w", encoding="utf-8") as f:
        json.dump({"checked": CHECKED,
                   "sources": [dict(zip(["id", "title", "url", "access"], s)) for s in SOURCES],
                   "evidence": [dict(zip(["id", "status", "claim", "sources", "confidence"], e)) for e in EVIDENCE],
                   "activities": [dict(zip(["id", "activity", "buying_or_selling", "likely_position", "basis", "what_would_change_it", "confidence"], a)) for a in ACTIVITIES]},
                  f, indent=2, ensure_ascii=False)
    update_evidence_yaml()
    print(f"sources={len(SOURCES)} evidence={len(EVIDENCE)} activities={len(ACTIVITIES)} models={len(MODELS)}")


if __name__ == "__main__":
    main()
