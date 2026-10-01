# 04 — Pricing and valuation skills

**Answers:** `claudeGAPS.md` §4
**Researched:** 2 Oct 2026

---

## Bottom line

1. **eBay's Product Research (formerly Terapeak)** is **free to every eBay seller** in Seller Hub, with **about 3 years of sold data**, and lets you pick **eBay Australia** as the marketplace. It's also available on mobile. It's the best free pricing tool available. The repo's earlier note ("account/tool dependent") can now be resolved: it only needs an eBay seller account. [Secondary, consistent across sources incl. eBay AU community announcement] https://community.ebay.com.au/t5/eBay-Announcements/Product-Research-formerly-Terapeak-is-now-on-mobile/ba-p/2572468 ; https://shopfront.app/answers/terapeak-guide-ebay-australia
2. **Facebook Marketplace has no sold-price data.** Treat its asking prices as a ceiling, never as evidence.
3. **Guaranteed-exit "floor" prices** are available on demand from AU instant-quote buyback services (Mobile Monster, Mobile Guru, Boomerang Buyback, Officeworks Tech Trade-in). None publishes a price list. Each requires model + condition entry, so the floor has to be **collected per device** (5 minutes each). **[Open — TRY]**
4. **Bulk/wholesale IT buyers exist in AU:** LinkBytes (Sydney; ITAD + buyback + wholesale refurb), Techbuyer (has an AU "sell your used IT" program), Australian Computer Traders (wholesale/reseller program) and EZYPC (Adelaide). None publishes a rate card. **[Open — CALL]** for a lot quote.
5. **Seasonality:** back-to-school demand peaks from the **second week of January through February**, with all major AU retailers and refurbishers running "back to school" laptop campaigns. Stock should be ready to list **by early January**. [Secondary] https://www.techradar.com/au/seasonal-sales/best-back-to-school-sales ; https://www.recompute.com.au/blog/backtoschool-2026-the-ultimate-tech-supplies-guide-for-aussie-families/

---

## Pricing method (v0.1) — replaces "use comparable sold listings"

1. **Identify exactly:** model, CPU, RAM, storage, screen (resolution/touch), battery %, grade, charger yes/no.
2. **Pull comps:** eBay Product Research → Sold → Australia → last **90 days** → filter "Used" → exclude "for parts" and bundles. Take **at least 5 comparables** of the same model and CPU tier. If there are fewer than 5, widen to 180 days or to the sibling model, and note it.
3. **Price the median, then adjust:**
   - grade A: +10% · grade C: −15%
   - battery <80%: −A$40–80 (or cost of replacement)
   - no charger: −cost of a genuine/compliant charger
   - local pickup only (TVs/desktops): use local comps, not eBay national
4. **Check the ceiling:** a WorkVentures / Reebelo / Australian Computer Traders refurbished price for the same model, which includes warranty. **Don't price above them**; they offer 6–12 months of warranty.
5. **Check the floor:** the instant-quote buyback price (Mobile Monster/Mobile Guru/Officeworks). **If floor ≥ 70% of your expected net retail, sell to the floor**, because it saves listing, support and returns labour.
6. **Record** comps, median, adjustments, ceiling and floor in the tracker `notes` (or an addendum column) so pricing accuracy can be audited after the pilot.

### Parts-only pricing
- Price harvested parts against **eBay AU sold "for parts" and part-number searches** (use the part number from PSREF/HP MSG/Dell manual; see 02).
- **[Derived]** A part is only worth listing individually if expected net is ≥ A$25 after fees and postage. Otherwise bundle it, or keep it as internal repair stock.

---

## Local vs online demand [Derived — validate in pilot]

| Sell locally (Dubbo FB/Gumtree, pickup) | Sell nationally (eBay/Back Market/Reebelo) |
|---|---|
| Budget laptops for students/families (A$150–400) | MacBooks, iPhones, iPads |
| TVs, monitors, desktops (bulky/fragile) | Business ultrabooks with good specs |
| Bundles (laptop + mouse + bag) | Components (RAM, SSD, GPUs), collectables |
| Quick-clearance items | Niche/enthusiast networking gear |

---

## Seasonality calendar [Derived]

| When | What |
|---|---|
| **Early Jan – Feb** | Back-to-school peak for laptops/tablets. Have stock wiped, imaged and listed by early January |
| **June (EOFY)** | Businesses spend remaining budget on new fleets, so **retired fleets become available Jul–Sep** (supply window) |
| **Oct 2026 – Oct 2027** | Windows 10 ESU end (12 Oct 2027) forces Win10-only machines out of business use: **supply up, Win10 resale value down**. Clear Win10 stock early |
| **Nov – Dec** | Christmas gifting: phones, tablets, consoles |
| Corporate refresh cycles | Most businesses depreciate laptops over **3–5 years**, so fleets bought in FY2021–23 are due now. [Secondary] https://esevel.com/blog/laptop-depreciation-rate |

---

## Buyback / wholesale contacts to quote (the floor list)

| Buyer | Type | Notes | Source |
|---|---|---|---|
| Officeworks Tech Trade-in | Retail trade-in (gift card) | Dubbo store at 10 Erskine St (repo) | repo |
| Mobile Monster | Instant-quote phone/laptop buyback | Grades "As New / Working / Dead"; dead/water-damaged units accepted at a low price; pays 3–5 business days after receipt | https://mobilemonster.com.au/sell-your-laptop/apple/laptops |
| Mobile Guru | Instant-quote buyback | Free express shipping; paid within 24 h of inspection | https://www.mobileguruaustralia.com.au/ |
| Boomerang Buyback | Instant-quote buyback | Freepost; wipes data on arrival | https://www.boomerangbuyback.com.au/ |
| LinkBytes | ITAD + wholesale | 500+ businesses, 50k+ devices (company claim) | https://linkbytes.com.au/ |
| Techbuyer AU | Bulk IT buyer | Page bot-protected; call | https://www.techbuyer.com/au/sell-your-used-it-equipment |
| Australian Computer Traders | Wholesale refurb (reseller registration) | Potential source **and** buyer | https://www.australiancomputertraders.com.au/wholesale-resellers-registration |
| EZYPC (Adelaide) | Buys used IT | — | https://ezypctech.com.au/pages/sell-used-it-equipment-australia |

**[Open — TRY]:** for the first 10 pilot devices, record the **floor** (best instant quote), the **ceiling** (refurbished-shop price) and the **actual sale** to calibrate the 70% rule.

---

## Sources
- eBay AU Product Research announcement: https://community.ebay.com.au/t5/eBay-Announcements/Product-Research-formerly-Terapeak-is-now-on-mobile/ba-p/2572468
- Terapeak AU guide: https://shopfront.app/answers/terapeak-guide-ebay-australia
- Mobile Monster: https://mobilemonster.com.au/sell-your-laptop/apple/laptops
- Mobile Guru: https://www.mobileguruaustralia.com.au/
- Boomerang Buyback: https://www.boomerangbuyback.com.au/
- LinkBytes: https://linkbytes.com.au/
- Techbuyer AU: https://www.techbuyer.com/au/sell-your-used-it-equipment
- Australian Computer Traders: https://www.australiancomputertraders.com.au/wholesale-resellers-registration
- EZYPC: https://ezypctech.com.au/pages/sell-used-it-equipment-australia
- Back to school: https://www.techradar.com/au/seasonal-sales/best-back-to-school-sales ; https://www.recompute.com.au/blog/backtoschool-2026-the-ultimate-tech-supplies-guide-for-aussie-families/
- Depreciation schedules: https://esevel.com/blog/laptop-depreciation-rate
