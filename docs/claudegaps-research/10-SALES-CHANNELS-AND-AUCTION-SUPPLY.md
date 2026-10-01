# 10 — Selling channels, marketplace access and auction supply

**Answers:** `claudeGAPS.md` §10
**Researched:** 2 Oct 2026

---

## Bottom line

1. **eBay is the only national channel open to a tiny unlicensed-or-just-licensed operator from day one.** Non-Pro AU sellers with **≤A$25k sales in the last 12 months pay no final value fee** (rolled out around late April–May 2026). Once on a **Pro** plan, it's **13.4% up to A$4,000 + 2.5% above + A$0.30/order** (Pro Starter). [Secondary, consistent across fee guides] https://www.valueaddedresource.net/ebay-australia-fee-free-selling/ ; https://linkmybooks.com/blog/aus-ebay-fees
2. **Reebelo and Back Market are gated:** Reebelo requires a **second-hand dealer registration** and charges about **US$99/month + 10–15%**; Back Market requires a professional refurb/test process and a **12-month warranty**, at about **15–20%** commission (see 09). **[Derived]** These channels are for **after** the Fair Trading question is settled and the pilot has proven quality.
3. **Ex-government IT auctions are a cheap, legitimate, documented supply source**, possibly better than random donations. Grays lists ex-government laptops roughly **A$16–166 per unit** (e.g. ThinkPad T14s Gen 1 ≈ A$166; HP ProBook 11 ≈ A$16), plus **bulk untested lots from A$9 starting bids**. The buyer's premium, GST and freight to Dubbo come on top. [Secondary, listing snapshot via search] https://www.grays.com/items/ex-government-laptops ; https://www.graysonline.com/computers-and-electronics/computers-and-it-equipment?item-type=auction ; aggregator: https://govauctions.app/au/auctions/electronics
4. **Return/complaint drivers** in refurbished laptops: **battery-health misrepresentation (about 22% of complaints)** and **Windows 11 compatibility (about 17%)**. Uniform testing is associated with **<4% return rates**. [Secondary, market-analysis site; treat as indicative] https://www.shelftrend.com/electronics/refurbished-pc-laptops-market-analysis-seller-profit-guide

---

## 10.1 Channel matrix

| Channel | Access | Fees | Warranty expectation | Best for | When |
|---|---|---|---|---|---|
| eBay AU (non-Pro) | Anyone | **0% FVF ≤A$25k/12 mo** (optional upgrades extra) | ACL only | Laptops, Macs, phones, parts | **Phase 0** |
| eBay AU (Pro Starter) | Business | 13.4% ≤A$4k + 2.5% above + A$0.30 | ACL | Volume | Once >A$25k/yr |
| Facebook Marketplace (Dubbo) | Anyone | ~0 for local pickup | ACL | Bulky (TVs, desktops), budget laptops | Phase 0 (watch the planning "retail at home" issue: arrange handovers off-site or by delivery) |
| Gumtree | Anyone | Conflicting fee info (repo) | ACL | Local | Optional |
| Reebelo AU | **Second-hand dealer registration required**, vetting, SLAs | ~US$99/mo + 10–15% | 12 mo | Phones, Macs, laptops | After Fair Trading + pilot |
| Back Market AU | Professional refurbisher, vetting + mystery orders | ~15–20% | 12 mo | Same | After Fair Trading + pilot |
| Instant buyback (Mobile Monster/Guru, Boomerang, Officeworks) | Anyone | Implicit discount | None (sold to them) | Floor exit (see 04) | Any time |
| Wholesale (LinkBytes, ACT, Techbuyer) | Business | Lot price | None | Batches of the same model | When ≥10 similar units |
| Social partner (Device Bank / Dubbo Support Center) | Partnership | — | Partner terms | Below-retail-spec but working (6th–7th gen) | Phase 1 |

## 10.2 Ex-government auctions as supply [Derived from listings, verify per lot]

| Pros | Cons |
|---|---|
| Clear legal provenance (government disposal), likely simplifying ownership records | Bought, not donated, so the **second-hand dealer licence question is sharper** (buying and selling prescribed goods) |
| Batches of identical business models: easier triage, parts swaps, listings | "Untested" lots often have **missing drives/RAM, BIOS locks or Autopilot/Intune registration**. Check lot photos for asset-tag removal and "no HDD" notes |
| Price per unit can be lower than the labour cost of collecting donations | Buyer's premium (often 15–20%+ at AU auction houses 🔎), GST and **freight to Dubbo** |
| Windows 11-eligible stock appears (e.g. T14s Gen 1 = 10th gen Intel) | Competes with established refurbishers bidding on the same lots |

**[Open — TRY]:** watch Grays' ex-government laptop listings for 4 weeks and record lot size, condition notes, hammer price, premium and freight to 2830. Compute landed cost per sellable unit using the 01 triage yield. Ask the auctioneer whether lots are deregistered from Autopilot/Intune before sale.

## 10.3 Listing craft (minimum standard)

From the complaint data plus the ACL rules already in the repo:
- **State battery health as a number** ("Battery 86% of design capacity, 312 cycles"). This removes the #1 complaint driver.
- **State Windows 11 eligibility explicitly** ("Windows 11 Pro installed and activated; CPU officially supported"). This removes the #2 driver.
- Photos: lid, keyboard, screen on a white/grey test image, base, ports both sides, every defect close-up, the charger. Use the same background and lighting every time (a light tent costs about A$40 🔎).
- Title: `Brand Model | CPU gen | RAM | SSD | screen | grade | battery %`.
- Body: test checklist summary (from `INTAKE-POLICY.md`), warranty length, "data securely erased", what's included, known defects.

## 10.4 Local selling formats [Open — TRY]
- A **January back-to-school student laptop day** (see 04 seasonality), run through a community venue or school partnership rather than at the home site (planning).
- Partnering with **TAFE Western / CSU Dubbo** student services for discounted student laptops. Not yet contacted.

## Sources
- eBay AU fees: https://www.valueaddedresource.net/ebay-australia-fee-free-selling/ ; https://linkmybooks.com/blog/aus-ebay-fees ; https://www.ebay.com/sellercenter/selling/start-selling-on-ebay/seller-fees
- Reebelo: https://support.channelengine.com/hc/en-us/articles/23773685387933-Reebelo-marketplace-guide
- Back Market: https://www.globalsources.com/knowledge/how-to-become-a-seller-on-backmarket/
- Grays ex-government: https://www.grays.com/items/ex-government-laptops ; https://www.graysonline.com/computers-and-electronics/computers-and-it-equipment?item-type=auction
- GovAuctions aggregator: https://govauctions.app/au/auctions/electronics
- Whirlpool ex-govt bulk discussion: https://forums.whirlpool.net.au/archive/2609075
- Complaint drivers: https://www.shelftrend.com/electronics/refurbished-pc-laptops-market-analysis-seller-profit-guide
