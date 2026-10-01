# Group B — Pricing and valuation (questions 11–17)

**Researched:** 2 Oct 2026

---

## Headline

**Australian Computer Traders' live refurbished prices (12-month warranty included) are the real ceiling, and they're low.** On 2 Oct 2026 its laptop category page listed an **8th-gen Dell Latitude 7400 at A$255**, **11th-gen Latitude 5420 at A$315 and 7420 at A$316**, Latitude 5320 2-in-1 A$306, ThinkPad T14s Gen 2 A$380, Surface Pro 6 A$349 and Surface Pro 7 A$399. A Dubbo-refurbished 8th-gen business laptop with a shorter warranty has to sell for **about A$150–230** to compete nationally. That changes the pilot economics: **labour per laptop has to stay well under an hour.**

---

## Q11. eBay AU sold prices for 10 fleet models ⛔ (online) / 🟡 (proxy)

- **eBay blocks automated access** (HTTP 403 for both direct fetch and the fetch tool). Sold-listing data needs a logged-in browser or the free **eBay Product Research** tool in Seller Hub (see `docs/claudegaps-research/04`). **[Open — TRY with an eBay seller account]**
- **Proxy: refurbished retail prices from ACT** (scraped from https://www.australiancomputertraders.com.au/laptop-computers, 2 Oct 2026). These are probably "from" prices for the base configuration:

| Model | CPU gen | ACT price (AUD, 12-mo warranty) |
|---|---|---|
| Dell Latitude 7400 14" | 8th | **255** |
| Dell Latitude 5420 14" | 11th | **315** |
| Dell Latitude 7420 14" | 11th | **316** |
| Dell Latitude 5320 2-in-1 | 11th | 306 |
| Lenovo ThinkPad T14s Gen 2 | 11th / Ryzen 5000 | 380 |
| Microsoft Surface Pro 6 | 8th | 349 |
| Microsoft Surface Pro 7 | 10th | 399 |
| Dell Latitude 7320 13.3" | 11th | 595 |
| Dell Latitude 5520 15.6" | 11th | 775 |
| Dell Latitude 5530 / 5340 / 5450 / 7450 | 12th–Core Ultra | 939–1,029 |
| Apple MacBook Pro 13" 2018 | Intel (obsolete) | 745 (was 828) |
| Apple MacBook Pro 15" 2018 | Intel (obsolete) | 881 (was 979) |

Cross-check with earlier findings: WorkVentures A$359–699 (8th–11th gen); Whirlpool forum reports of ACT 11th-gen Latitudes at A$400–450 (with 16 GB). The ACT category page shows lower "from" prices.

**[Derived] Pricing implication:** for Windows laptops, Dubbo's national-channel price ≈ **60–80% of the ACT price for the same model**, because of ACT's 12-month warranty and brand trust. Local Facebook sales can sit closer to the ACT price because there's no shipping and you can inspect in person.

## Q12. Depreciation with Australian data 🟡

No published AU depreciation dataset was found. The ACT price ladder above **is** an AU curve for business laptops: **about A$250–400 for 5–7-year-old business machines, A$600–1,000+ for 2–4-year-old ones (12th gen → Core Ultra).** The steepest drop comes once a model falls out of current corporate use, when large ex-government volumes reach refurbishers. **[Derived]**
For **Macs**, the 2018 Intel MacBook Pros still list at A$745–881 despite being Apple-obsolete. Apple stock holds value far better than Windows stock.

## Q13. Used TV sold prices ⛔
Same eBay/Facebook restriction (no public sold data). Asking-price evidence is already in `docs/claudegaps-research/02` §2.4. **[Open — TRY]:** record 20 local Facebook TV listings and whether they sold (status changes) over 4 weeks.

## Q14. Used RAM/SSD/CPU prices ✅ (ceiling from new) / ⛔ (used sold)

**New** prices in AU (StaticICE comparison across AU retailers, 2 Oct 2026) [Primary — retailer listings via https://www.staticice.com.au/]:

| Part | Cheapest new | 25th percentile | Median |
|---|---|---|---|
| 8 GB DDR4 SODIMM | A$36 | A$60 | A$75 |
| 16 GB DDR4 SODIMM | A$59 | A$99 | A$118 |
| 256 GB NVMe M.2 | A$37.50 | A$71 | A$76 |
| 512 GB NVMe M.2 | A$109 | A$123 | A$132 |
| Dell 65 W USB-C adapter (genuine 450-BFXC) | A$27.73 | A$35 | A$39 |
| Lenovo 65 W USB-C (genuine OCLN028 about A$55; generics from A$42) | A$42 | A$60 | A$69 |

**[Derived]:** used parts realistically sell at **40–60% of the cheapest new price**: about A$15–25 for 8 GB DDR4, A$30–40 for 16 GB, A$20–30 for 256 GB NVMe, A$50–65 for 512 GB. RAM/SSD prices are **high in 2026** (the 16 GB median is over A$100), which **raises** the value of harvesting and of RAM upgrades for resale. Upgrading an 8 GB laptop to 16 GB with a harvested stick is worth doing.

## Q15. Replacement battery costs (AU) ✅

| Battery | Genuine (AU) | Compatible |
|---|---|---|
| Dell Latitude 5490 68 Wh (GJKNX) | **A$192.50** incl. GST, 12-month warranty (EMPR) | A$60.50 (Genixit, EMPR) |
| Lenovo ThinkPad T480 (01AV452) | **A$175.13** incl. GST (EMPR) | A$60.99 (72 Wh, Amazon AU) |

Sources: https://store.emprgroup.com.au/dell-laptop-battery-for-dell-latitude-5490.aspx ; https://store.emprgroup.com.au/lenovo-laptop-battery-for-t480-type-20l5-20l6-laptop-thinkpad.aspx ; https://www.amazon.com.au/SB10K97584-01AV452-SB10K97585-Battery-Thinkpad/dp/B0C2C8HZB8 [Primary retailer pages via search]

**[Derived] Rule:** a **genuine** battery (about A$175–195) costs **more than ACT charges for a whole refurbished 8th-gen laptop** (A$255). So genuine batteries are uneconomic on 8th–11th gen stock. A compatible battery (about A$60) only makes sense if the laptop then sells for ≥ A$250 locally. Otherwise **disclose the battery health and price it lower** (as ACT's grade B, 50–79%, does).

## Q16. Instant trade-in floor quotes 🟡
- **Officeworks Tech Trade-in is run by Moorup** (Australian B-Corp). Quotes come from an online assessment at https://officeworks.moorup.com.au/, paid as a digital Officeworks **gift card**, with the device returned using a prepaid label. [Primary/Secondary] https://www.officeworks.com.au/information/about-us/peopleandplanet/device-trade-in ; https://www.ozbargain.com.au/node/775492
- Moorup, Mobile Monster and Mobile Guru all generate quotes **interactively in JavaScript**, so automated quotes couldn't be pulled. ⛔ **[Open — TRY]:** run 5 manual quotes (e.g. iPhone 11 64 GB, iPhone 12 128 GB, Galaxy S21, MacBook Air M1, Latitude 7400).
- **Note:** a gift-card floor isn't cash. Mobile Monster/Mobile Guru pay cash.

## Q17. Gumtree fees ✅
- **General listings (including electronics) are free**: no listing, insertion or store fee for casual selling. Paid optional promotions (Bump Up, Featured, Urgent, Top Ad) cost about **A$5–30+**. Mandatory fees apply only to cars, caravans, real estate, jobs, pets, services and boats. Business subscriptions are aimed at car dealers. [Secondary + Gumtree help pages] https://help.gumtree.com.au/AU/articles/en_US/KB_Article/Which-categories-have-a-listing-fee-AU/ ; https://listinggenie.co/guides/gumtree-fees-explained
- This **resolves the repo's "Gumtree fees conflict"**: electronics listing is free, and only optional promotion costs money.

## Sources (group B)
Inline above. Key: ACT laptop category page (scraped), StaticICE AU price comparison, EMPR battery listings, Officeworks/Moorup trade-in page, Gumtree help centre.
