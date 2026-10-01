# 09 — What FlipTech and its peers actually do on the floor

**Answers:** `claudeGAPS.md` §9 (9.1–9.13)
**Researched:** 2 Oct 2026

**Method note:** Fliptech's website is a JavaScript single-page app that returns an empty shell to normal fetch tools, which is probably why earlier repo research only found summaries. For this pass the site's public JavaScript bundle (`/assets/index-*.js`) was downloaded and its **published page copy and client terms** extracted. All Fliptech quotes below are Fliptech's own public website text **[Primary]**, read 2 Oct 2026.

---

## Bottom line

1. **Fliptech's process is now documented from its own site.** Unmarked locked vehicles → secure facility under 24-h CCTV → **every data-bearing asset tagged and registered in asset-tracking software**, with company asset tags and serials recorded → **Blancco** erasure to **NIST 800-88 Clear or Purge** under CCTV → **physical destruction if erasure fails** → **"double verified"** (a second validation step on every asset) → **itemised report and certificates within about 15 business days**.
2. **Fliptech's client terms answer the "junk" question:** **title passes to Fliptech on collection**, and Fliptech may "recycle, refurbish, reuse, remarket, resell" or, "in the worst-case scenario", send material to landfill. It **reserves the right to re-quote collection fees if the waste "differs significantly" from the client's description**, and **charges a fee for erasure certificates**. Its bin agreements run for **five service instances**. This is how a mature operator protects itself from junk and funds free collection.
3. **Every serious AU refurbisher uses the same grading skeleton:** 2–4 cosmetic grades, all fully functional, a battery threshold, and **a 12-month warranty** (ACT, Reebelo, Back Market). WorkVentures offers 6 months.
4. **Australian Computer Traders (ACT) publishes the most explicit reject list in AU**: broken hinges, missing parts, severe screen damage, dead keyboards, swollen batteries, **software locks (remote management, BIOS locks, activation locks)**. Rejects are "recycled or dismantled for parts". This independently confirms the triage matrix in 01.
5. **Marketplace gatekeeping:** **Reebelo requires sellers to hold a valid second-hand dealer registration** plus approvals for trading telecommunications equipment; it charges **USD 99/month + 10–15% commission**. Back Market requires a professional refurbishing/testing process and a **12-month warranty**; commission is about **15–20%**. This links the **Fair Trading licence gap** (`GAPS.md` §A.3) directly to channel access.

---

## 9.1 How Fliptech handles intake (bins and collections)

| Step | Fliptech's published practice | Source text (paraphrased or quoted) |
|---|---|---|
| Bin | "We deliver an E-Waste bin directly to your location… When your bin is full, simply give us a call. We'll promptly pick it up and replace it with a new one during the same trip." | fliptech.com.au/bins (bundle copy) |
| Sorting | "At our facility, we sort all E-Waste and securely erase any data-bearing assets. Our goal is to recycle 100% of the materials we receive." | same |
| Transport | "Unmarked, locked, and unbranded vehicles, carefully monitored" | data-security article |
| Receiving | "All data bearing assets that enter the warehouse are **tagged and registered into our asset-tracking software**. All assets are **checked for company asset tags and serial numbers**." | data-security page |
| Storage | "Secured area… constant 24-hour surveillance… only authorised personnel" | data-security article |
| Erasure | "**Blancco**… Hard drives and media are erased under CCTV surveillance… to the NIST 800-88 (Clear or Purge) standard" | data-security page |
| Failures | "When digital erasure fails, physical destruction of storage media becomes necessary." Terms: "if a hard drive cannot be wiped, Fliptech will destroy that hard drive immediately and as such no Certificate can be generated." | page + client terms §5 |
| Verification | "All assets are **double verified**… every single asset undergoes a secondary validation step" | data-security page |
| Non-standard data bearers | "Switches, IP Phones, and even printers, all contain confidential information… we employ… wiping, sanitisation and physical destruction" | data-security page |
| Reporting | "Detailed reports… serials, models, erasure standards, verification methods and erasure, destruction and recycling certificates… **generally within 15 business days** of reception" | data-security page |
| Reach | "We serve all Australian capital cities and **can facilitate regional collections**" | site copy |
| Throughput case study | "**1,100 laptops, 200 desktops and 450 loose hard drives**… collected nationally for processing in our Sydney facility… [in 14 days], outperform[ing] the industry standard 28 day wait time" | case study |
| Other revenue | **On-site erasure** in client clean rooms (ASX medical company); **national office refresh** "from on-site asset decommissioning to installation"; "We install, test and quality-check every asset" | case studies / installations page |
| Certifications claimed | ISO 9001, ISO 14001, ISO 45001, "JASANZ endorsement"; NSW Government registered supplier | certification page. **Certificate numbers/scope still not independently verified** (repo caution stands) |
| Social reuse | Royal Far West: "donate laptops back to Australian children in remote areas" | article |

### Fliptech client terms that matter for Dubbo [Primary — Fliptech client terms]
- "Upon collection of the Electronic Waste from the Collection Site, **title in the Electronic Waste will pass to Fliptech**."
- Fliptech may deal with it "in whatever way it sees fit, including recycling, refurbishing, reusing, remarketing, reselling, or otherwise sending any of the Electronic Waste to landfill in the worst-case scenario."
- Fliptech "reserves the right to **quote a Client fees for collection if it deems the Electronic Waste in question differs significantly from what is described in any Client Form**", with the quote to be accepted in writing before collection.
- Erasure **certificates for a fee** "agreed in writing"; data erasure terms "do not apply to E-Waste bins or their contents".
- Agreement applies "for **five (5) instances** (service provisions)".
- Fliptech may decline or postpone a collection it reasonably considers unsafe.

**[Derived] Copy into Dubbo's own terms:** title transfer on collection; a client form describing the load, with the **right to re-quote if the load doesn't match**; certificates as a priced add-on; the right to refuse unsafe items; and a fixed-term (e.g. 5-collection) agreement for business clients. These directly solve claudeGAPS §1.10–1.11.

---

## 9.2–9.3 Grading scales and minimum specs: AU comparison

| Operator | Grades | Battery | Warranty | Rejects / floor | Source |
|---|---|---|---|---|---|
| **Australian Computer Traders** (ex-government business IT, since 1993) | **A:** minor use; ≤2 minor screen scratches invisible when on; ≤5 imperceptible dents. **B:** moderate use; moderate screen marks; ≤5 visible dents; moderate keyboard wear | **A ≥80%; B 50–79%** | **12 months, all grades** | Broken hinges/missing parts, severe screen damage, dead keyboard, swollen batteries, **remote-management/BIOS/activation locks**, inaccessible damage → recycled or parted. Fresh licensed OS installed | https://www.australiancomputertraders.com.au/our-refurbishment-process-quality-grading-explained/ **[Primary]** |
| **WorkVentures** | Shop grades (not extracted) | — | **6 months** (some campaigns 12) | Oldest live stock is Intel 8th gen (see 01) | repo + live shop |
| **Reebelo AU** (marketplace) | Pristine / Excellent / Very Good (20 cm visibility test) | ≥80% | **12 months min** | — | see 01 |
| **Back Market** (marketplace) | Premium / Excellent / Good / Fair | ≥80% (Premium ≥90%) | **12 months min** | — | see 01 |

**[Derived] Dubbo grade v0.2:** adopt ACT's numeric limits (they're concrete and AU-tested): **A** = ≤2 minor screen scratches invisible when on, ≤5 imperceptible dents, battery ≥80%. **B** = moderate marks, ≤5 visible dents, battery ≥70% *and disclosed*. **C** = functional with heavier wear, disclosed. Pricing must undercut ACT, because **ACT gives 12 months of warranty on everything**.

**Price ceiling reminder:** ACT 11th-gen Latitude / 16 GB about A$400–450 (Whirlpool, see 08); WorkVentures 8th–11th gen A$359–699 (see 01).

---

## 9.4 Software stack

| Option | Type | Cost | Fit |
|---|---|---|---|
| **Spreadsheet** (`pilot-tracker.csv` + `templates/triage-fields-addendum.csv`) | — | $0 | Fine for the 30-item pilot |
| **Snipe-IT** | Open-source IT asset management (AGPL-3.0, about 15k★, active 2026-10-01) | $0 self-hosted | Per-asset records, custom fields, QR labels, check-in/out history. **Best free step up** after the pilot |
| **InvenTree** | Open-source inventory (MIT, about 7.7k★) | $0 | Parts/stock and serialised items; good for harvested-parts stock |
| **Odoo** (community) | Open-source ERP | $0 community | Inventory + sales + invoicing in one, but heavier to set up |
| **RazorERP** | Commercial ITAD/e-waste ERP (R2-oriented, grading, lot tracking, multichannel sync) | **about US$450/user/month** | Only at real ITAD scale |
| **Makor ERP** | Commercial ITAD/e-waste ERP (intake → testing → erasure → harvesting → resale) | Quote only | Same |

Sources: `gh api` (grokability/snipe-it, inventree/InvenTree, odoo/odoo) 2 Oct 2026; https://www.capterra.com/p/148503/RazorERP/ ; https://www.makorerp.com/the-software/

**[Derived] Trigger to leave the spreadsheet:** about 50+ assets in stock at once, or the first B2B client needing per-serial reports → **Snipe-IT**. Fliptech's "asset-tracking software" is the same idea at scale.

## 9.5 Throughput benchmarks
- Fliptech: about **1,750 devices/drives in 14 days** (1,100 laptops + 200 desktops + 450 drives) with a team (size not stated): roughly 125 items a day facility-wide. **[Primary]**
- ITAD technician job descriptions (US): receive → inventory → test → wipe → disassemble → log disposition; "production expectations" exist but quotas aren't published. **[Secondary]** https://www.ziprecruiter.com/e/What-are-the-typical-day-to-day-responsibilities-of-an-ITAD-Technician
- **[Derived]** A solo operator with parallel wiping (ShredOS can wipe several drives at once) could plausibly do **8–15 laptops per day** through wipe + test, but listing and photos are the bottleneck. **[Open — TRY]**

## 9.6 Cosmetic refurbishment
Covered by video (06 §F4–F5): isopropyl cleaning, adhesive removal, light scratch polishing, keyboard/keycap replacement. **[Derived]** A cosmetic C→B uplift is usually worth A$30–60 of resale; only do it when it takes ≤20 minutes.

## 9.7 Imaging / OS deployment
- ACT installs "a fresh, fully licensed operating system" on every unit. **[Primary]**
- Free tooling: **FOG Project** (open-source network imaging, GPL-3.0, active) for many identical fleet machines. At low volume, a USB Windows install that uses the firmware-embedded key (see 02 §2.1) is simpler.
- **[Derived]** Ship Windows units at **OOBE (first-boot setup screen)** so the buyer creates their own account. This also proves no Autopilot/organisation screen appears (see 01 §1.4).

## 9.8 Packaging and shipping
- **Australia Post:** lithium-ion batteries **installed in equipment** are allowed domestically when ≤100 Wh per battery (≤20 Wh per cell). The device must be **unable to switch on accidentally**, with strong inner cushioning and a sturdy outer box. AusPost's quick-reference guide covers the labelling. [Primary PDF] https://auspost.com.au/content/dam/auspost_corp/media/documents/lithium-batteries-quick-reference-guide.pdf ; https://auspost.com.au/sending/guidelines/dangerous-prohibited-items
- The repo already notes courier-specific lithium restrictions (BACKLOG-21-25 §25).
- **[Derived]** Standard kit: laptop box with foam end-caps or double-boxing, ≥5 cm cushioning on all sides, power off fully (not sleep), charger bagged separately. **Never post a battery-damaged device.**

## 9.9 Warranty norms
**12 months is the AU market norm for professional refurbished laptops/phones** (ACT, Reebelo, Back Market); WorkVentures offers 6. **[Derived]** Dubbo can offer **3–6 months** at a lower price point, stated clearly and without excluding ACL rights. Track every claim in the tracker (`refund_return_cost`).

## 9.10 How buyback value is calculated (ITC)
ITC Asset Management values fleets on **"current demand, specification, condition and volume"**, explicitly **market value, not book value**. It returns recovered value **"as a rebate on every quote"** (its "Buy-Residual Flywheel"). It also points out that instant-asset-write-off clients hold zero book-value assets that still have market value. [Primary] https://www.itcassetmanagement.com.au/asset-buyback/ ; https://www.itcassetmanagement.com.au/services/it-asset-buyback-sydney/
**[Derived] Dubbo quote formula** (consistent with 01 §1.10): `quote = collection + data service + per-item disposal for non-reusables − Σ(expected net resale × share returned to client)`.

## 9.11 Residue cost
Not published by Fliptech/Renew IT. Fliptech's terms show it absorbs residue under its "recycle 100%" goal but re-quotes off-spec loads. **[Open — CALL]** (AMR/Sircel/ACE per-kg terms remain the repo's open downstream gap.)

## 9.12 Skills profile from job descriptions
ITAD technician duties (consistent across listings): receive and inventory; record specs/condition; **diagnostic testing**; **erase drives with specialist software and separate failures**; disassemble for parts/recycling; log disposition in a tracking system; safe use of hand tools and a small soldering iron. [Secondary] https://www.ziprecruiter.com/e/What-are-the-typical-day-to-day-responsibilities-of-an-ITAD-Technician
This maps exactly onto the learning path in 05 (A+ Core 1 + Core 2 + bench practice). **No AU Seek listing could be fetched automatically.** **[Open]**: search Seek manually for "ITAD technician" (Renew IT, Sims Lifecycle, WorkVentures, Greenbox) and record pay rates.

## 9.13 International analogues
- **Free Geek** (Portland): volunteer refurb model (videos in 06 §E4). **Back Market**: professional-only, vetted sellers with mystery-order quality testing (see 01). **Reebelo**: vetting on "operational quality, product authenticity, refurbishment expertise, customer service" plus the **second-hand dealer registration requirement**. https://support.channelengine.com/hc/en-us/articles/23773685387933-Reebelo-marketplace-guide ; https://reebelo.com.au/policies/terms-of-service

---

## Sources
- Fliptech public site copy and client terms (JS bundle of https://www.fliptech.com.au/, sitemap pages /bins /data-security /our-certification /it-recycling /sustainability), retrieved 2 Oct 2026
- ACT refurbishment and grading: https://www.australiancomputertraders.com.au/our-refurbishment-process-quality-grading-explained/
- ITC buyback: https://www.itcassetmanagement.com.au/asset-buyback/
- Reebelo seller guide: https://support.channelengine.com/hc/en-us/articles/23773685387933-Reebelo-marketplace-guide · Reebelo terms: https://reebelo.com.au/policies/terms-of-service
- Back Market sellers: https://www.backmarket.com/en-us/c/news/who-sells-on-back-market ; https://www.globalsources.com/knowledge/how-to-become-a-seller-on-backmarket/
- RazorERP: https://www.capterra.com/p/148503/RazorERP/ · Makor: https://www.makorerp.com/the-software/
- GitHub (live): grokability/snipe-it, inventree/InvenTree, odoo/odoo, FOGProject/fogproject
- Australia Post lithium: https://auspost.com.au/content/dam/auspost_corp/media/documents/lithium-batteries-quick-reference-guide.pdf
- ITAD technician duties: https://www.ziprecruiter.com/e/What-are-the-typical-day-to-day-responsibilities-of-an-ITAD-Technician
