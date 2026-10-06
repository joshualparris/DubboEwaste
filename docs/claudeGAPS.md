# claudeGAPS — unexplored research opportunities

**Compiled:** 2 October 2026 (AEST) by Claude Code after a read-through of the whole repo (README, `GAPS.md`, every file in `docs/`, `templates/` and `pilot-tracker.csv`).
**Purpose:** list the research that has **not yet been done**, especially the practical, hands-on side: how to triage incoming gear so the business does not take on junk, what to learn and where (courses, videos, podcasts, communities), and what FlipTech-style operators actually do on the floor.

> **Research results (2 Oct 2026):** every section below has been researched. See [`claudegaps-research/00-INDEX.md`](claudegaps-research/00-INDEX.md) for findings, sources and the remaining CALL/TRY items.

## How this file relates to the other gap lists

- [`GAPS.md`](../GAPS.md) is thorough on **legal, planning, downstream and partner** unknowns (Council classification, Fair Trading exemption, AMR's downstream recycler, Device Bank, branch economics). Those are **not repeated here**. Section 14 just points to them.
- [`agyGAPS.md`](agyGAPS.md), committed earlier the same day, sketches triage, learning resources, competitor mechanics and sales channels in about 60 lines. This file goes into much more detail on the same themes and adds many gaps it doesn't cover.
- The repo's research so far answers **"what is the business and is it allowed?"** in depth. It barely touches **"can the operator reliably tell a $300 laptop from a $30 liability in five minutes, and how would they learn to?"** That is the biggest unexplored area.

## Legend

- **Priority:** P1 = do before taking any public intake · P2 = do during the 30-item pilot · P3 = later or scale-up.
- **Method:** DESK = web/document research · CALL = ask a person or organisation · TRY = hands-on experiment or measurement · LEARN = course, video or practice.
- **Status of named resources:** ✅ = confirmed to exist via a web check on 2 Oct 2026 · 🔎 = lead only, verify before relying on it.

---

## 1. The front-door triage decision system (the "no junk" filter)

The repo has strong *acceptance rules* (`INTAKE-POLICY.md`: four gates, a reject list, "shelf full = pause") and a Sircel-style gate model (`SIRCEL-ITAD-REUSE-MODEL.md` §11). What is missing is the **operational knowledge to apply those rules quickly and correctly**.

| # | Gap | Why it matters | Method | Pri |
|---|---|---|---|---|
| 1.1 | **No quantified minimum spec per category.** The only hard benchmark in the repo is the National Device Bank's free-laptop spec (i5 6th gen+, 8 GB, 128 GB SSD). Nothing defines the *commercial resale* floor (e.g. "below Intel 8th gen / Ryzen 2000 = parts or Linux only") or the equivalents for Macs, phones, tablets, monitors and TVs. | This is the single rule that stops junk at the door. | DESK + TRY | P1 |
| 1.2 | **No "age → value" curves.** How fast does a business laptop, iPhone, Galaxy, iPad or TV lose value in the AU second-hand market, year by year? | It lets you reject by model year before inspection. | DESK (sold listings) | P1 |
| 1.3 | **No 60-second visual red-flag list.** Examples: swelling (trackpad lifting, case gaps, screen lifting), liquid indicators, corrosion at ports, hinge cracks, missing screws (evidence of a previous repair or parted machine), burnt smell, non-genuine charger, asset tags or "property of" stickers, sanded or defaced serials. | Lets anyone say no fast and safely. | DESK + LEARN | P1 |
| 1.4 | **No lock-detection procedure.** The repo says to *reject* Activation Lock, FRP, MDM and Autopilot devices but never says *how to detect them at the door*: Apple's Activation Lock status check, the Android FRP prompt after reset, Windows Autopilot/OOBE "organisation" screens, BIOS/supervisor passwords, Computrace/Absolute persistence, Chromebook enterprise enrolment, Apple DEP/ABM remote-management screens. | Locked devices are worth about $0 and are the most common "looks good, is junk" trap. | DESK + TRY | P1 |
| 1.5 | **No blacklist/stolen-device check.** There's no research on IMEI blacklist checks in Australia (the AMTA/carrier blocked-device register, or third-party IMEI checkers) or on checking laptop serials against police/NPRS-style stolen-goods databases. | Provenance risk, and it ties into Fair Trading obligations. | DESK + CALL (AMTA, police) | P1 |
| 1.6 | **No battery-health thresholds.** What cycle count or %-of-design capacity makes a battery "disclose", "replace before sale" or "reject"? There's no research on tools to read it (macOS System Information / coconutBattery 🔎, Windows `powercfg /batteryreport`, iOS Battery Health, Android/Samsung diagnostics, 3uTools 🔎). | Batteries drive both resale value and fire risk. | DESK + TRY | P1 |
| 1.7 | **No time budget per triage stage.** How long should first-look, power-on test, wipe and full test take before an item is "not worth it"? Reconnect's ~$200 restore cost is the only labour benchmark in the repo. | Margin per labour hour is the pilot's key metric, but there's no target. | TRY (time 30 items) | P2 |
| 1.8 | **No rejection log.** `pilot-tracker.csv` only records **accepted** items, so declined offers, why they were declined and what they were never get measured. | Without it you can't learn the junk rate or tune the pre-screen. | TRY (add a reject sheet) | P1 |
| 1.9 | **No missing tracker fields for triage learning:** cosmetic grade, battery health %, triage minutes, triage decision reason, pre-screen photo verdict vs actual condition, and "would the pre-screen have caught this?". | These fields are needed to improve the filter. | TRY | P1 |
| 1.10 | **No "bulk lot" rule.** How should an offer of 20 mixed items from a business (some good, some junk) be handled? Is "take all or nothing" OK, or should it be a split price or a fee for the junk? | Business lots are the preferred supply, and they always contain junk. | DESK + CALL (Fliptech, ITC, Bendigo) | P1 |
| 1.11 | **No "junk fee" pricing research.** What do Bendigo E-Waste, Fliptech, ITC and Reconnect charge to take low-value items (per item, per kg, per bin)? Reconnect's $5/device erasure contribution is the only figure in the repo. | Charging for liabilities funds free intake of good gear. | DESK + CALL | P2 |
| 1.12 | **No donor-to-whole ratios.** For a common fleet model (e.g. Latitude 5400, EliteBook 840 G5, ThinkPad T480), how many broken units does it take to make one good one, and what parts are actually worth harvesting? | It decides whether "parts value" is real or imaginary. | TRY | P2 |

**What to produce at the end:** a one-page **triage matrix** per category (accept / inspect / reject, with thresholds) plus a phone-script pre-screen. `agyGAPS.md` also asks for this. It doesn't exist yet in either file.

---

## 2. Category-specific knowledge gaps

### 2.1 Laptops and desktops
- **Which models do refurbishers want?** Find out which business lines (Latitude, EliteBook, ThinkPad, ProBook, Surface) have the best parts availability, repair documentation and resale demand in AU, and which consumer lines to avoid (soldered RAM/storage, weak hinges, rare chargers). DESK. P1
- **Common failure modes by model family**, such as known hinge, keyboard-ribbon, GPU and swollen-battery issues. iFixit and forums cover this; nothing is captured in the repo. DESK. P2
- **Windows 11 eligibility check method** (CPU list, TPM 2.0, Secure Boot), plus the practical impact of the Windows 10 ESU end date (12 Oct 2027) on 2027 pricing. DESK. P1
- **Licensing on reinstall.** How do digital entitlements and OEM keys survive a wipe? The repo flags MAR/TPR but not the practical day-to-day process. DESK. P2
- **Chromebooks.** These haven't been researched at all: auto-update expiry dates, enterprise enrolment locks and schools as the main source. DESK. P2

### 2.2 Apple
- **How the T2 and Apple Silicon erase and Activation Lock flow works** in practice, including what a donor must do to release a Mac, and how to check MDM/DEP enrolment before acceptance. DESK + TRY. P1
- **Which Mac/iPad/iPhone models are still worth taking** against Apple's vintage/obsolete lists and current iOS/macOS support. The repo cites Apple's definitions but has no model cut-off table. DESK. P1
- **Parts pairing (serialised parts).** Swapping screens, batteries or cameras between iPhones triggers "unknown part" messages that reduce resale value. Research Apple's Self Service Repair and its system-configuration step. DESK. P2

### 2.3 Phones and tablets
- **Phone network viability lookup.** ACMA and carriers publish 000/VoLTE compatibility; there's no worked process or handset list. DESK. P1
- **Samsung/Android specifics:** Knox, carrier locks, FRP behaviour across versions, and burn-in on OLED screens, which is a key grading defect. DESK + LEARN. P1
- **Grading standards used by AU refurbishers** (e.g. Reebelo's and Back Market's condition definitions, and Phonecheck-style cosmetic grades ✅ [phonecheck.com](https://www.phonecheck.com/)). DESK. P2
- **Whether a phone-only wholesale buyer is cheaper than retailing** (trade-in programs, Mobileciti-style refurbishers 🔎, MobileMonster 🔎, Officeworks Tech Trade-in as a price floor). DESK + CALL. P2

### 2.4 TVs and monitors
- **The TV economics haven't been researched.** What do used flat-panel TVs sell for in Dubbo by size and age? What do they cost to ship or deliver, and how does the panel break rate change that? The repo only says "by prior approval". DESK + TRY. P1
- **Common repairable TV faults** (backlight strips, power boards, T-con) versus terminal ones (cracked panel, vertical lines). Parts availability in AU. LEARN. P3
- **Monitors:** which sizes and resolutions sell, VESA mount and stand completeness, and dead-pixel and burn-in tests. DESK. P2

### 2.5 Components, networking and "other good electronics"
- **Used-component price bands** (RAM by generation, SSDs, GPUs, CPUs, PSUs) and which ones are worth testing and listing individually. DESK. P2
- **Enterprise networking and servers.** These aren't covered: what is saleable (managed switches, Wi-Fi APs, small servers, homelab demand) versus scrap, and the data/config-wipe needs (switch configs and NVRAM hold credentials). DESK. P3
- **Consoles, cameras, audio, vintage computing:** the collector markets and their pricing sources are not researched (e.g. vintage Apple/IBM and retro consoles can be worth far more than modern gear). DESK. P3
- **Printers.** The repo's refuse/approval rule is clear, but there's no research on whether any printer category (e.g. business lasers) has resale value. DESK. P3

---

## 3. Diagnostic and wipe tooling: a real bench kit hasn't been chosen

The repo mentions nwipe, nvme-cli and Blancco, and `agyGAPS.md` lists some tool names. **Nobody has assembled, tested or timed a bench kit.**

| # | Gap | Method | Pri |
|---|---|---|---|
| 3.1 | Build and test a USB triage stick (e.g. a Ventoy multi-boot 🔎 with ShredOS/nwipe 🔎, MemTest86 🔎, a Linux live environment with `smartctl`, `nvme`, `lshw`, `stress-ng`). Time each step on 3 typical machines. | TRY | P1 |
| 3.2 | Compare commercial diagnostic and wipe suites by cost per device at pilot volume: Blancco (already priced at $982.30 for 50), PC-Doctor 🔎, Phonecheck ✅, NSYS 🔎, PartedMagic 🔎, KillDisk 🔎. | DESK + CALL | P2 |
| 3.3 | **Phone diagnostics without paid software.** What can be done with built-in diagnostics (Samsung Members, Apple Diagnostics, `*#0*#` test menus) versus Phonecheck-style tools? | DESK + TRY | P2 |
| 3.4 | **Verification method for the sanitisation certificate.** How do you *prove* an SSD erase (sample read-back, tool report hash)? The template has fields but no procedure. | DESK | P1 |
| 3.5 | **Minimum hardware bench:** USB-C PD tester, known-good chargers, multimeter, ESD mat and strap, pentalobe/Torx bits, spudgers, heat gun or iOpener, thermal paste, isopropyl, a spare-screen test rig. Not costed anywhere. | DESK | P1 |
| 3.6 | **Label printer / asset tag workflow** (QR codes for asset ID, so the device, tracker and certificate all link). Not researched. | DESK + TRY | P2 |

---

## 4. Pricing and valuation skills

- **No repeatable pricing method** beyond "use comparable sold listings" (`BACKLOG-17-20`). Missing: how many comparables to use, which date window, how to adjust for condition, charger and battery, and how to price parts-only units. DESK + TRY. P1
- **Tool access:** eBay Terapeak/Product Research availability on an AU account, Facebook Marketplace sold data (it isn't public), and price-history tools 🔎. DESK. P2
- **Wholesale floor prices.** What would a bulk buyer (LinkBytes, Renew IT, phone buyback services) pay for an untested or tested lot? This gives the "guaranteed exit" price for triage decisions. CALL. P1
- **Dubbo local demand vs online:** what sells locally (cheap student/family laptops, TVs) versus what needs national reach (Macs, components, collectables). TRY. P2
- **Seasonality:** back-to-school (Jan–Feb), end of financial year and Christmas demand peaks, and corporate refresh cycles (often aligned to the financial year). DESK. P2

---

## 5. Learning path: courses and certifications (nothing in the repo yet)

There's no curriculum in the repo. The operator's background (DadLAN reuse experience, the 10 Bendigo laptops) is recorded in `PROJECT-HISTORY-ALL-CHATS.md`, but no skills gap analysis has been done.

### 5.1 Candidate courses and certifications to evaluate

| Resource | What it is | Status | Notes / gap to resolve |
|---|---|---|---|
| **CompTIA A+** (Core 1 + Core 2) | Industry-standard hardware/OS support certification | ✅ (AU exam vouchers are roughly A$350–430 each, two exams; [Logitrain](https://www.logitrain.com.au/courses/comptia/comptia-aplus.html), [prepforcerts](https://prepforcerts.org/comptia-a-plus-exam-cost)) | Is the certificate itself worth paying for, or is the free study material (Professor Messer 🔎) enough? A cert may help with B2B/ITAD credibility. |
| **TAFE NSW Certificate III in Electronics and Communications (UEE30920)** | Install, test, repair and maintain electronic equipment | ✅ ([TAFE NSW](https://www.tafensw.edu.au/course-areas/electrotechnology/courses/certificate-iii-in-electronics-and-communications--UEE30920-01)) | Is it available at TAFE Western (Dubbo) or online? Is it Smart & Skilled fee-free or subsidised? Is it overkill? |
| **Certificate II in Computer Assembly and Repair** | Entry-level PC/laptop repair | ✅ exists in WA/VIC ([South Metro TAFE](https://www.southmetrotafe.wa.edu.au/courses/certificate-ii-computer-assembly-and-repair)) | Not confirmed as offered in NSW. Is there a remote option? |
| **iFixit MasterTech** | Smartphone repair certification | ✅ ([iFixit](https://www.ifixit.com/Info/MasterTech)) | Is the online exam available from AU? Cost? |
| **iFixit Pro Repair Academy** | 13-day microsoldering/board-repair bootcamp (US) | ✅ about US$7,900–9,900 ([iFixit](https://www.ifixit.com/ifixit-pro-repair-academy)) | Almost certainly P3/never for Phase 0. It's listed so the ceiling of the skill tree is known. |
| **Free Geek Mobile Refurbishment Intensive** | Nonprofit refurb training model (Portland, US) | ✅ ([Free Geek](https://www.freegeek.org/mastertech)) | Not attendable, but **Free Geek's whole volunteer/refurb model is unresearched** and is a close analogue of a community reuse operation. |
| **Test and tag (AS/NZS 3760) competency** | Electrical safety testing of mains equipment | 🔎 | The repo mentions test/tag once (Cessnock). Is it needed to sell mains-powered second-hand goods in NSW? Course cost and tester cost. P1 |
| **Lithium battery safe-handling training** | WHS/dangerous-goods awareness | 🔎 | Is there a short AU course (e.g. through a DG training provider or FRNSW resources)? P1 |
| **Blancco / ADISA / NAID AAA training or certification** | ITAD data-sanitisation credentials | 🔎 | Is there an individual technician certification rather than facility-level? Cost? It matters before using stronger "certified" wording. P3 |
| **R2v3 / e-Stewards / AS 5377 awareness** | Facility standards for responsible recycling/ITAD | 🔎 | Is there a free overview course? Which standard do AU ITAD clients actually ask for? P3 |
| **Udemy/Coursera/LinkedIn Learning:** laptop repair, phone repair, ITAD fundamentals | Cheap self-paced options | 🔎 | Which ones have good reviews? Any ITAD-specific course at all? |
| **Business skills:** NSW Business Connect advisers, Service NSW small-business workshops | Free local business mentoring | 🔎 | Dubbo availability. Free help with pricing, structure and grants. P2 |

### 5.2 Local, in-person learning that hasn't been researched
- **Repair Café in Dubbo?** None was found in a quick search. [Repair Café Australia](https://www.facebook.com/RepairCafeAustralia/) and the [Transition Australia repair hub list](https://transitionaustralia.net/community-repair-cafes-hubs/) cover 40+ cafés, but the nearest active one to Dubbo is unknown. **Starting one is itself an opportunity**: it gives free skills practice, a community supply lead and council goodwill. DESK + CALL. P2
- **Dubbo Men's Shed / makerspace / TAFE Western electronics staff** as mentors or bench space. The repo mentions Men's Sheds only as donation beneficiaries. CALL. P2
- **Working alongside an existing repairer** (CBM Computers, Tech Savvy Dubbo or a phone-repair shop) for a few sessions. This is the fastest way to learn local failure patterns. It hasn't been explored, and could double as a partnership. CALL. P2
- **A day at Bendigo E-Waste or Reconnect** (watching their actual triage bench) would beat any course. The repo has interview *questions* for Joe but nothing about a site visit. CALL. P1

---

## 6. Videos and YouTube (no video research in the repo)

Not one YouTube channel or video is cited in the repo outside `agyGAPS.md`. Candidates to review and curate into a watch list, the same way the Spotify files were done:

| Channel | Why relevant | Status |
|---|---|---|
| **Hugh Jeffreys** (Australian) | Restores e-waste phones and laptops bought broken on eBay. Shows parts pairing, sourcing and what's fixable. About 989K subscribers. | ✅ ([YouTube](https://www.youtube.com/@HughJeffreys)) |
| **eWaste Ben** (Melbourne) | One-person backyard e-waste business. Scrap values, copper, board grading, "week in the life" operations. **Probably the closest video analogue to a Dubbo back-shed operator.** | ✅ ([YouTube](https://www.youtube.com/watch?v=QCZBX8rVFjc), 650+ videos) |
| **Tech Yes City** (Australian) | Used PC parts flipping and AU market pricing. | 🔎 (well known, not checked this session) |
| **Louis Rossmann** | Board-level repair economics, right to repair, and what makes a device unrepairable. | 🔎 |
| **NorthridgeFix** | Shop-floor phone/console/laptop repair: realistic time and parts costs. | 🔎 |
| **iFixit** (channel + guides) | Teardowns and repairability per model. | ✅ ([ifixit.com](https://www.ifixit.com/)) |
| Laptop/PC flipping channels (e.g. "flipping laptops for profit" genre) | Pricing, sourcing and listing practice. Quality varies widely. | 🔎 Needs a curated shortlist |
| Corporate ITAD facility tours (Sims Lifecycle, SK tes, Renew IT, WorkVentures, Blancco demos) | **Shows the physical intake → wipe → grade → pack workflow.** This is the nearest thing to seeing what FlipTech-type operators do on the floor. | 🔎 Search each company's YouTube/LinkedIn video |

**Gap:** produce a `docs/YOUTUBE-WATCHLIST.md` with 15–25 vetted videos grouped by skill (triage, wipe, repair, pricing, scrap, ITAD operations). Prefer specific *episodes* over channels.

---

## 7. Podcasts: what's covered and what's missing

**Covered (heavily):** the repo has **six** overlapping podcast files (`SPOTIFY-PODCASTS.md`, `SPOTIFY-PODCAST-LIST.md`, `SPOTIFY-AUSTRALIA-NSW-EWASTE.md`, `SPOTIFY-PODCASTS-AU-NSW-EWASTE-REUSE.md`, `SPOTIFY-PODCASTS-EWASTE-REUSE-ITAD.md`, `PODCASTS-AUSTRALIAN-ITAD-COMPANIES.md`). They're strong on ITAD industry, circular-economy strategy, founder stories (Austin Turpin/FlipTech, James Lancaster/Renew IT, Annette Brodie/Reconnect) and digital inclusion.

**Not covered:**
- **Hands-on repair/refurb-shop podcasts:** shows run by repair-shop owners about pricing repairs, parts sourcing and shop economics (e.g. iFixit-adjacent or repair-industry shows 🔎).
- **Recommerce/secondary-market industry audio:** e.g. the [Resource Recycling Podcast](https://www.iheart.com/podcast/1333-resource-recycling-podcas-343014722/) ✅ (2026 season on circular electronics, including an iFixit episode) and Secondary Market News content ✅ ([secondarymarket.news](https://secondarymarket.news/blog/diagnostics-software-smartphone-recommerce/)) on phone grading and diagnostics automation.
- **Reseller/flipper podcasts beyond the two already listed** (Flip Weekly and Everything Reselling are in the repo). Electronics-specific reselling shows haven't been searched.
- **Non-Spotify sources:** ABC RN, conference talks (E-Scrap conference recordings, ✅ [e-scrapconference.com](https://www.e-scrapconference.com/)) and webinars (Blancco, R2/SERI 🔎).
- **Repo hygiene:** the six podcast files duplicate many of the same episodes. A single deduplicated, ranked file would be easier to use. A "listen for" note on **triage specifically** is missing from almost every entry.

---

## 8. Communities and forums (not researched)

- Reddit: r/ITAD 🔎, r/eWaste 🔎, r/Flipping 🔎, r/homelab, r/buildapcsales, r/AussieFlips 🔎, r/AusFinance side-hustle threads. Good for real price points and "is this worth fixing?" judgement.
- **Whirlpool forums (AU)**, which have trading and hardware sections with Australian pricing and buyer behaviour. 🔎
- Repair forums: Badcaps 🔎, MacRumors repair threads, iFixit Answers ✅.
- Facebook groups: Australian PC buy/sell groups, Dubbo buy/swap/sell groups (local demand testing), phone-repair technician groups. 🔎
- Industry bodies: **ANZRP**, **Australian Council of Recycling**, **WMRR (Waste Management and Resource Recovery Association)** and **Charitable Reuse Australia**, for membership, events and member directories. The repo cites some as sources, but nobody has looked into **joining them or attending events** as a networking channel. P2

---

## 9. What FlipTech and peers do on the floor (mechanics, not corporate structure)

The repo has excellent *corporate* profiles and long question lists for FlipTech, Renew IT, ITC, Reconnect, WorkVentures, LinkBytes, Sircel, PonyUp, G1 and Greenbox. Their **floor-level operations** are still unresearched:

| # | Unanswered mechanic | Best source to try | Pri |
|---|---|---|---|
| 9.1 | **How FlipTech sorts a bin** when it arrives at Brookvale: who sorts it, in what order, what goes straight to recycling, and how long per bin. | Austin Turpin podcasts (already listed, re-listen *for triage specifically*), LinkedIn posts/videos, direct call | P1 |
| 9.2 | **Their grading scale.** FlipTech, WorkVentures (6-month warranty shop) and LinkBytes all sell graded stock. What are their A/B/C definitions? Their public shop listings can be scraped and compared. | DESK (shop.workventures.com.au, LinkBytes, Reebelo listings) | P1 |
| 9.3 | **Minimum specs used for "refurbish vs recycle".** Sircel withholds this. WorkVentures shop stock (Latitude 5300, EliteBook 830 G7, ThinkPad X13) implies a practical floor of about 8th–10th gen Intel. Verify this. | DESK + CALL | P1 |
| 9.4 | **Software stack:** inventory/ERP (e.g. Makor ERP 🔎, Razor ERP 🔎, the e-scrap ERP software covered by [Resource Recycling](https://resource-recycling.com/e-scrap-news-magazine/2025/10/24/enterprise-resource-planning-for-the-e-scrap-industry/) ✅), wipe-report integration and asset-tag printing. A spreadsheet is fine for 30 items. When does it stop being enough? | DESK + CALL | P2 |
| 9.5 | **Bench layout and throughput:** how many devices per technician per day at each stage (wipe in parallel, test, clean, image, pack)? This decides whether one person can run the business part-time. | Facility videos, Reconnect visit, Bendigo visit | P2 |
| 9.6 | **Cleaning and cosmetic refurbishment process:** cleaning agents, sticker and adhesive removal, keyboard replacement and lid skins. These make an item look "refurbished" rather than "used". | LEARN (YouTube) + DESK | P2 |
| 9.7 | **Imaging/OS deployment:** do they ship with a fresh OEM image, a generic Windows install or OOBE-ready? What tools (WDS/FOG 🔎, Windows Media Creation, Apple Internet Recovery)? | DESK | P2 |
| 9.8 | **Packaging and shipping** of refurbished laptops and monitors (box sourcing, foam, double-boxing, insured couriers) and their damage and return rates. | DESK + CALL | P2 |
| 9.9 | **Warranty handling:** what warranty length each operator offers, and their claim rate and cost. This prices ACL risk. | DESK (warranty pages) + CALL | P2 |
| 9.10 | **How buyback quotes are calculated** for business fleets (FlipTech "hardware buybacks", ITC, Renew IT): price sheets, model lookup tables, condition deductions. | CALL (request a sample quote using the repo's "100-laptop comparison request") | P2 |
| 9.11 | **What residue costs them**: FlipTech/Renew IT's per-kg downstream cost for non-reusable fractions. It sets the true cost of accepting junk. | CALL | P2 |
| 9.12 | **Staff skill profiles:** job ads for "ITAD technician", "refurbishment technician" and "test and grade technician" at Renew IT, WorkVentures, Greenbox and Sims Lifecycle list the exact skills, tools and certs they expect. **This is the cheapest way to build the skills list in §5.** | DESK (Seek/LinkedIn job ads) | P1 |
| 9.13 | **International analogues not yet researched:** Free Geek (Portland, US), Restart Project (UK), Back Market's refurbisher onboarding standards, Reboxed (UK) and Foxway (Nordics). They publish more process detail than the AU operators do. | DESK | P3 |

---

## 10. Selling channels and recommerce buyers

- **Become a seller on Back Market AU / Reebelo?** Their seller onboarding requirements, grading standards, warranty obligations, fees and minimum volumes aren't researched. Reconnect already sells through Reebelo (`NSW-FLIPTECH-EQUIVALENTS-DEEP-DIVE.md`). DESK + CALL. P2
- **Bulk/wholesale buyers for lots:** LinkBytes is named, but no wholesale price was obtained. Find other AU used-IT wholesalers, phone buyback exporters and "untested lot" buyers on eBay. CALL. P1
- **Government/corporate disposal auctions as a *supply* source:** GraysOnline, Pickles and Manheim government IT lots 🔎. What do ex-government laptop lots cost per unit, and could buying lots beat waiting for donations? This hasn't been researched. DESK. P2
- **Local selling formats:** Dubbo market stalls, a school-term "student laptop" sale and partnering with TAFE/CSU Dubbo for student devices. Untested. TRY. P2
- **Listing craft:** photography setup, standard listing template and condition-disclosure wording that satisfies ACL. Not researched. DESK + TRY. P2
- **Returns data:** real return/fault rates for refurbished laptops and phones (from Back Market/Reebelo reports or operator interviews). It prices warranty risk. DESK. P2

---

## 11. Parts harvesting and scrap knowledge

- **Which harvested parts actually sell** (screens, batteries, keyboards, chargers, RAM, SSDs, logic boards for parts) and their typical prices and sell-through. DESK + TRY. P2
- **Scrap grading of e-waste fractions** (high/medium/low-grade boards, CPUs, RAM sticks, hard-drive platters, copper cable). eWaste Ben's channel covers this in AU terms. Who in NSW buys sorted boards and at what rate? The repo only has AMR copper/brass prices. DESK + CALL. P2
- **Hard-drive destruction options** for drives that fail erasure: local shredding services or DIY drilling/degaussing, and whether a destruction record is acceptable to B2B clients. DESK + CALL. P1

---

## 12. Supply-side research opportunities

- **Dubbo MSP / IT-provider list.** The repo names Orana Business Solutions, Tech Savvy and CBM, but no full list of Dubbo/Orana MSPs exists, and nobody has asked what they currently do with clients' retired fleets. MSPs are the strongest repeat-supply channel. DESK + CALL. P1
- **Fleet-refresh calendars:** when do Dubbo's big employers (council, health district, mines, agribusiness, banks, law/accounting firms) refresh, and who controls disposal (head office vs local)? CALL. P2
- **The Windows 10 → 11 refresh wave:** businesses forced to retire Win10-only hardware before October 2027 ESU end. Quantify the local opportunity and the timing. DESK. P1
- **Catholic and independent schools** (outside the Department's EDConnect contract): **desk research completed 6 Oct 2026** in `DUBBO-NON-GOVERNMENT-SCHOOL-IT-ASSET-EWASTE-2026-10-06.md`. Device-ownership/governance clues are mapped, but the current disposal provider, most recent retired batch, sanitisation evidence, residual-value treatment and next refresh still require direct confirmation. CALL. P2
- **Pre-screen conversion rate:** of people who enquire, how many have acceptable gear? Only measurable with the rejection log (§1.8). TRY. P2

---

## 13. Safety and compliance *skills* (as opposed to rules)

The repo states the rules; it doesn't say **how the operator becomes competent**:
- **Test-and-tag competency** and whether it's legally needed for resale (see §5.1). P1
- **Lithium incident response drill:** what equipment (fire blanket, sand bucket, metal container, lithium-rated extinguisher), where it sits and when to call 000. Practise it. TRY. P1
- **ESD and soldering fume practice:** cheap fume extraction and safe lead-solder handling at home. DESK. P3
- **Data-handling competence:** a written self-check that the operator can prove an erase for each media type (HDD, SATA SSD, NVMe, eMMC, Apple Silicon, phone). TRY. P1

---

## 14. Gaps already catalogued elsewhere (pointers only)

These are real and still open, but already documented in detail:
- Council land-use classification, lease/landlord position, shed condition, insurance → `GAPS.md` §A, "Five biggest" Q1; `PHASE-0-OPERATING-BLUEPRINT.md` §25.
- Fair Trading recycling-program exemption and 14-day-hold alteration question → `GAPS.md` §A.3.
- AMR Dubbo's downstream recycler, embedded-lithium rule, CRTs, AS 5377, Council's post-June-2025 contractor → `GAPS.md` §B; `AMR-DUBBO-DOWNSTREAM-FORENSIC.md`.
- Regional council contractors, reuse rights and volumes → `GAPS.md` §I.
- NSW Education vendor and settlement reports → `GAPS.md` §J.
- Device Bank / Good360 / WorkVentures / Dubbo Support Center partnership → `GAPS.md` Good360 section.
- Branch/partner commercial terms (Greenbox, G1, Fliptech, WV, etc.) → `GAPS.md` §K–L; `CALL-SCRIPTS.md`.
- Joe/Bendigo early-days questions → `bendigo-early-days-deep-dive.md`; `PHASE-0-OPERATING-BLUEPRINT.md` §25.

---

## 15. Repo-level gaps noticed while reading

1. **`GAPS.md` has duplicate section letters** (two "I", two "J", two "L" sections), which makes cross-referencing ambiguous.
2. **The README file table doesn't list `GAPS.md`'s companions** (`agyGAPS.md`, this file) and doesn't list several podcast files consistently.
3. **Six overlapping podcast files.** Consolidate them into one ranked list.
4. **`pilot-tracker.csv` can't measure junk:** it has no rejection rows, cosmetic grade, battery %, triage minutes or decision reason (see §1.8–1.9).
5. **There's no skills/competency file.** All the knowledge is about the business environment, none about the operator's bench ability.
6. **There's no glossary** (ITAD, FMV, FRP, MDM, Autopilot, NTCRS, AS 5377, R2, etc.) for someone new to the field.
7. **Templates exist for paperwork but not for operations:** no triage-matrix template, no test-checklist printable, no listing template, no reject-reason log.

---

## 16. Suggested next research sprint (highest value first)

1. **Build the triage matrix** (§1.1–1.6) from WorkVentures/LinkBytes/Reebelo listings, iFixit and job ads (§9.12).
2. **Add a rejection log and the triage fields** to the pilot tracker (§1.8–1.9).
3. **Assemble and time a USB bench kit** on 3 machines (§3.1, §3.4).
4. **Ask Joe (Bendigo) and Reconnect if you can watch their triage bench for a day** (§5.2, §9.5).
5. **Get two wholesale floor prices** (LinkBytes or another lot buyer) to set the "guaranteed exit" price (§4, §10).
6. **Curate a 20-video YouTube watch list**, starting with eWaste Ben, Hugh Jeffreys and ITAD facility tours (§6).
7. **Decide on CompTIA A+ vs self-study, and on test-and-tag**, after checking whether test-and-tag is legally needed for resale (§5.1, §13).
8. **Map Dubbo MSPs** and ask what they do with retired client fleets (§12).
9. **Re-listen to the Austin Turpin/FlipTech and Renew IT episodes**, taking notes only on triage, grading and junk handling (§7, §9.1).
10. **Consolidate the podcast files and fix the `GAPS.md` section lettering** (§15).

---

## Sources checked for this file (2 Oct 2026)

- iFixit Pro Repair Academy: https://www.ifixit.com/ifixit-pro-repair-academy
- iFixit MasterTech: https://www.ifixit.com/Info/MasterTech
- Free Geek Mobile Refurbishment Intensive: https://www.freegeek.org/mastertech
- TAFE NSW Cert III Electronics and Communications (UEE30920): https://www.tafensw.edu.au/course-areas/electrotechnology/courses/certificate-iii-in-electronics-and-communications--UEE30920-01
- Cert II Computer Assembly and Repair (WA example): https://www.southmetrotafe.wa.edu.au/courses/certificate-ii-computer-assembly-and-repair
- CompTIA A+ AU pricing examples: https://www.logitrain.com.au/courses/comptia/comptia-aplus.html · https://prepforcerts.org/comptia-a-plus-exam-cost
- Phonecheck: https://www.phonecheck.com/
- Secondary Market News, diagnostics in recommerce: https://secondarymarket.news/blog/diagnostics-software-smartphone-recommerce/
- Hugh Jeffreys: https://www.youtube.com/@HughJeffreys
- eWaste Ben: https://www.youtube.com/watch?v=QCZBX8rVFjc · https://playboard.co/en/channel/UCMNtGapF13fwDLMR_sHmi6g
- Resource Recycling Podcast: https://www.iheart.com/podcast/1333-resource-recycling-podcas-343014722/
- Resource Recycling, ERP for e-scrap: https://resource-recycling.com/e-scrap-news-magazine/2025/10/24/enterprise-resource-planning-for-the-e-scrap-industry/
- Repair Café Australia / repair hubs: https://www.facebook.com/RepairCafeAustralia/ · https://transitionaustralia.net/community-repair-cafes-hubs/
- E-Scrap conference: https://www.e-scrapconference.com/

Everything marked 🔎 is an unverified lead.
