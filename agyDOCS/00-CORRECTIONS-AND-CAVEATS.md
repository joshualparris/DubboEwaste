# Corrections and Caveats (rewritten 2 Oct 2026)

This file replaces the earlier version. The earlier "Phase 1" and "Phase 2" corrections were produced by the same agent that wrote the docs, and several of them were wrong (see "Withdrawn corrections" below). The documents in this folder were AI-generated and mostly **not sourced**. Treat every figure and rule in them as a lead to check, not a fact.

## Status key

| Tag | Meaning |
| :--- | :--- |
| **VERIFIED** | Matches a primary source (official site or government), URL given |
| **SECONDARY** | Only seen on third-party sites (blogs, calculators, aggregators). Probably right, check the official page before relying on it |
| **WRONG / OUTDATED** | A primary or secondary source contradicts the doc |
| **UNVERIFIED** | No evidence found either way. Do not rely on it |
| **REPORTED** | Raised in Josh's own earlier fact-check with sources, not re-checked in this pass |

## Withdrawn corrections (the previous version of this file was wrong here)

1. **Windows 11 "8GB" (old item 5):** `Triage-Skills-Guide.md` never says 8GB is the Windows 11 minimum. It says 8GB is the minimum for basic computing, which is a business choice. Only the CPU generation is discussed under Windows 11. Nothing needs correcting except to keep the two ideas separate. (Microsoft's official minimums are 4GB RAM and TPM 2.0. REPORTED, not re-fetched.)
2. **"No refunds" signs (old item 6):** calling these illegal was **not** an overstatement. See the ACL section below.
3. **KillDisk "$64.95" (old Phase 2):** this is not a business price. See the data wiping section below.
4. **Facebook "hallucinated" fees (old Phase 2):** the doc's range blends an older and a newer fee structure. See the Facebook section below.
5. **Gumtree Pay 3% / $1 min / $200 max / PayTo 90% discount and OCAU "100 posts + ISP email":** these were presented as verified. They are **UNVERIFIED** (nothing found on official pages).

## 1. `NSW-Market-Sales-Channels.md`

### eBay Australia

| Claim in doc | Status | Evidence / action |
| :--- | :--- | :--- |
| Free selling under AU$25,000, introduced May 2026 | **VERIFIED** | eBay says free selling started 12 May 2026 for Australia-based casual sellers at or under AU$25,000 over 12 months: https://www.ebay.com.au/sell |
| Free tier is about "private" sellers; "registered business" pays fees | **WRONG** | The test is the AU$25,000 rolling total and not holding a Pro plan, not private vs business status: https://www.ebay.com.au/sellercentre/news-offers/more-info-on-recent-selling-updates |
| $25,000 includes tax and postage | **VERIFIED** | https://pages.ebay.com.au/sell-on-ebay |
| Over $25,000 you move to Pro Starter, which charges fees | **VERIFIED** | Same eBay page as above (automatic upgrade to Pro Starter, no monthly fee, final value fees apply) |
| Buyer protection fee "approximately 8%" | **WRONG** | eBay says it is not a flat 8%. It is a flat $0.30 per item plus a percentage (the percentage is cut off in the sources I could read): https://www.ebay.com.au/sellercentre/news-offers/more-info-on-recent-selling-updates |
| Pro Starter final value fee "8% to 12%" | **WRONG (secondary)** | A fee calculator that cites eBay's pages gives 13.4% (GST incl.) up to AU$4,000, then 2.5%, plus $0.30 per order: https://www.salehoo.com/ebay-au-fee-calculator . Check eBay's Pro fees page before pricing |
| Free-tier sellers must buy postage labels through eBay | **VERIFIED (reported)** | From Josh's earlier check of eBay's page; also reported by https://www.valueaddedresource.net/ebay-australia-fee-free-selling/ (secondary) |
| Refurbished Program requirements (Top Rated, 1-year warranty, free shipping, 30-day returns) | **UNVERIFIED** | Not checked. Read eBay's Refurbished Program page before applying |

### Facebook Marketplace

| Claim | Status | Evidence / action |
| :--- | :--- | :--- |
| Local pickup is free | **SECONDARY** | https://crosslist.com/fee-calculators/facebook |
| Shipped orders "5% to 10%" with "$0.40 to $0.80" minimum | **SECONDARY, outdated blend** | Third-party sources say the fee rose from 5% to 10% in April 2024 (https://crosslist.com/fee-calculators/facebook), and older guides give 5% with a $0.40 minimum (https://influencermarketinghub.com/facebook-marketplace-selling-fees/). The doc mixes old and new. Neither source is Australia-specific. **Current Australian fee: UNVERIFIED** |

### Gumtree

| Claim | Status |
| :--- | :--- |
| Gumtree Pay exists in Australia | **SECONDARY** (https://cfotech.com.au/story/gumtree-australia-adds-paypal-pay-in-4-for-flexible-payments) |
| Buyer pays about 3%, reduced with PayTo | **UNVERIFIED** (no official page found; no confirmation of any minimum, cap or discount figure) |
| Seller fee-free via Gumtree Pay; feature packages "$10 to $50+" | **UNVERIFIED** |

### Shopify

| Claim | Status | Evidence |
| :--- | :--- | :--- |
| Basic $56/month, $42/month annual; card rate 1.75% + 30c | **SECONDARY** | https://aspireapp.com/au/blog/shopify-fees-australia (the official page was not retrievable in this pass; Josh's earlier check reported the official page shows $42 annual and 1.75% + 30c) |
| Third-party gateway penalty "0.5% to 2%", POS Pro $129 | **UNVERIFIED / SECONDARY** | A different third-party source puts the surcharge at 1.0% (Grow) and 0.6% (Advanced), 2% on Basic: https://wpcreative.com.au/?p=19896 . Check Shopify's page |

### Shipping

| Claim | Status | Evidence / action |
| :--- | :--- | :--- |
| Extra Cover free for first $100, then $2.50 per extra $100 | **VERIFIED** | https://auspost.com.au/personal/sending/parcels/sending-in-australia/optional-extras |
| Signature on Delivery costs $3.50 and should always be added | **WRONG** | The same page lists $2.95, and says it must be added when the item is valued above $500 |
| "Road Transport Only" label must be applied (sticker or red marker) | **UNVERIFIED** | Not found on Australia Post's current page |
| Ship the battery detached but wrapped | **WRONG / DANGEROUS** | Australia Post's current page says lithium batteries must not be packed by themselves or alongside a device, and damaged or recalled batteries are prohibited: https://auspost.com.au/business/shipping/check-sending-guidelines/dangerous-prohibited-items . Follow Australia Post's quick reference guide linked from that page |
| "Express Post is completely prohibited" (Agy's claim) | **UNVERIFIED** | The official page I could read says electronics containing lithium cells are prohibited on International Courier. I did not confirm the Express Post wording |
| Packing advice (5cm padding, "Kick Test") | **UNVERIFIED** | General practice, not sourced |

### Australian Consumer Law

| Claim | Status | Evidence / action |
| :--- | :--- | :--- |
| Consumer guarantees can't be excluded by a business | **VERIFIED** | ACCC: https://www.accc.gov.au/business/selling-products-and-services/consumer-rights-and-guarantees |
| Displaying "No refunds" is unlawful for a business | **VERIFIED** | ACCC says "No Refunds" signs are unlawful because they imply no refund is possible even for faulty goods: https://accc.gov.au/media-release/faulty-fashion-%E2%80%93-use-your-rights ; also https://www.consumerprotection.wa.gov.au/consumer-protection/no-refunds-0 |
| "Sold As Is" is illegal | **UNVERIFIED** | The sources above name "no refunds" style signs. I found no source naming "sold as is" specifically. The safe position: it cannot override guarantees, and it won't protect you |
| Law is NSW-specific | **WRONG** | The Australian Consumer Law is national. NSW Fair Trading enforces it in NSW |
| No claim for defects you pointed out before sale | **VERIFIED** | https://www.consumerprotection.wa.gov.au/consumer-protection/no-refunds-0 . Disclose specific faults clearly, in writing, before the sale |
| "Change of mind" signs are acceptable | **VERIFIED** | Same WA page. A sign saying no refunds if you simply changed your mind is fine |
| Private sellers are not covered by guarantees | **VERIFIED (general)** | ACCC: guarantees apply to purchases from a business (same ACCC page). Where "regular flipping" becomes a business is a legal question. Ask NSW Fair Trading or a lawyer |

## 2. `Triage-Skills-Guide.md`

| Claim | Status |
| :--- | :--- |
| Windows 11 CPU baseline Intel 8th gen / Ryzen 2000 | **REPORTED** (right, with a few 7th-gen exceptions) |
| 8GB RAM as a refurb minimum, 16GB "gold standard", 256GB SSD floor | **OPINION**, not a standard |
| Age cutoff 5 to 7 years | **UNVERIFIED** (no source) |
| Battery thresholds (>80% good, 60-79% fair, <60% replace) | **UNVERIFIED**, a reasonable rule of thumb, not an industry standard |
| `powercfg /batteryreport`, MemTest86, smartmontools, PC-Doctor, Eurosoft | **UNVERIFIED in this pass**, but these are well-known tools |
| iCloud / FRP / MDM lock handling | **UNVERIFIED in this pass**. The advice "don't try to bypass locks" is sound |

## 3. `Education-Directory.md`

| Claim | Status | Evidence / action |
| :--- | :--- | :--- |
| iFixit MasterTech Certification as an option | **WRONG / OUTDATED** | iFixit says it is no longer offering new MasterTech certifications: https://www.ifixit.com/Info/MasterTech |
| iFixit Pro Repair Academy | **VERIFIED, with a catch** | It exists but is hosted at iFixit's warehouse in Chattanooga, Tennessee, USA: https://www.ifixit.com/ifixit-pro-repair-academy |
| IAITAM CITAD (Certified IT Asset Disposition) | **VERIFIED, with a catch** | Real. IAITAM lists it at US$2,400 and describes it as covering disposition vendors, data security and chain of custody: https://iaitam.org/?p=69818 . It's aimed at people managing disposal programs, so it is not "essential" for a small refurbisher |
| TAFE NSW UEE30920 | **REPORTED** | Real but about 3 years, on-campus, needs employment or an apprenticeship. Not a quick path |
| AIM Training / Chemtools | **REPORTED** | Real IPC-7711/7721 rework and repair training in St Marys, but "micro-soldering and logic-board repair" is a stretch |
| Paul's Mobile Tech & Okay Technologies "3-day workshops" | **UNVERIFIED** | Course length not confirmed for either. Okay Technologies was not checked at all |
| Hugh Jeffreys: Australian, restores broken devices | **VERIFIED (secondary)** | Notebookcheck describes him as an Australian phone-repair vlogger: https://www.notebookcheck.net/A-device-repair-YouTuber-condemns-the-US-market-version-of-the-iPhone-12-as-almost-impossible-to-restore-independently.540673.0.html |
| Tech YES City: Australian, "PC flipping guide" | **PARTLY WRONG** | Channel is Australian (listed location Australia; PO box in Nerang, QLD) but describes itself as examining used and new PC gaming hardware, not as flipping tutorials: https://vidiq.com/youtube-stats/channel/UC9Tn-atYOt8qZP-oqui7bhw |
| eWaste Ben (Australian scrap-recovery channel) | **UNVERIFIED** | No evidence found that this channel exists. Remove unless you can find it |
| Podcasts: The Smart Flip, The Flipping Ninja, The Circular Future, Repair Don't Waste | **UNVERIFIED** | "Repair Don't Waste" appears to be an ABI Electronics initiative about obsolescence management for critical electronic systems, which is not a device-flipping podcast |
| OCAU needs 90 days' membership for the trading section | **UNVERIFIED** | No OCAU rules found. Other forums differ (e.g. Overclockers UK: 1,000 posts and 180 days, https://forums.overclockers.co.uk/threads/hi.18853153). Check OCAU's own rules |
| Substation33 (Logan, QLD) | **REPORTED** | Real, but sources are 2019 to 2020 and the address was Kingston, not Meadowbrook. Current status unverified. Contact them before relying on them |
| Google IT Support Certificate, CompTIA A+, Grays/Pickles, r/bapcsalesaustralia | **UNVERIFIED in this pass** | Probably fine, not checked |

## 4. `ITAD-Operations-Blueprint.md`

| Claim | Status | Evidence / action |
| :--- | :--- | :--- |
| Describes how Fliptech, Sircel and PonyUp operate | **WRONG framing** | It is generic industry practice. No public source describes those companies' grading, triage or ERP use. Treat the whole blueprint as an aspirational template |
| Makor ERP "dominant"; RazorERP; Snipe-IT | **UNVERIFIED** | The products exist; "dominant" is unsourced |
| Blancco $1 to $3 per wipe | **UNVERIFIED** | Blancco doesn't publish flat per-wipe pricing on its site (reported in the earlier check). Treat the figure as invented |
| Blancco PXE deployment, one licence per erased drive | **REPORTED** | From Josh's earlier check of Blancco's documentation |
| KillDisk: perpetual licences, no per-wipe fees | **VERIFIED** | "No cost-per-erase": https://ntfs.com/killdisk/ |
| KillDisk industrial: parallel erasure of 100+ disks | **VERIFIED** | https://www.killdisk.com/killdisk-enterprise-all.htm |
| KillDisk "$1,000 to $3,000+" | **WRONG / MISLEADING** | Official page: Corporate licence US$149.95 (one PC per licence), Site licence US$3,999, Enterprise US$5,999: https://www.killdisk.com/killdisk-enterprise.html . A third-party listing shows Industrial software from US$40 per slot and Industrial Desktop from US$2,900 (SECONDARY): https://us.fitgap.com/products/016993/active-killdisk . The cheaper "Professional / Personal" prices are for non-commercial use, so a business needs a Corporate licence |
| PartedMagic "under $100 per user" | **PARTLY WRONG** | Official store has subscription, single-version and "Forever" options: https://partedmagic.com/store/ . Price figures vary by third-party listing (US$49 vs US$59 yearly, Forever US$199): https://us.fitgap.com/products/parted-magic . Check the store before relying on the "<$100" figure; the one-off lifetime price may be higher |
| PartedMagic runs from USB or PXE, supports ATA Secure Erase | **UNVERIFIED (partly secondary)** | A secondary source describes it as a live CD/USB/PXE environment |
| Grading A/B/C/D, CCTV 90-day retention, 3-4% monthly depreciation, 60-80% revenue shares, $15 per unit | **UNVERIFIED** | No sources. Treat as examples only |

## How this was checked

- Each claim was searched individually, with preference for official sites (eBay, Australia Post, ACCC, KillDisk, IAITAM, iFixit, Parted Magic).
- Where an official page could not be retrieved, the claim is tagged **SECONDARY** and the third-party URL is given.
- "Not found" means a search turned up nothing relevant. It does not prove a claim is false.
- Prices are as seen on 2 Oct 2026 and can change.

## What has not been checked

Most triage thresholds, the grading definitions, the Reddit and Discord community descriptions, shipping courier alternatives (Pack & Send, Aramex), Shopify's official page, eBay's Refurbished Program rules, the Windows 11 Microsoft page (not re-fetched), and any claim not listed above.
