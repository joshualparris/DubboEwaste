# G. Selling channels and auction supply — questions 45–48

**Researched:** 2 Oct 2026  
**Method:** current Australian auction-house/help pages and primary marketplace program rules were preferred.

## 45. What buyer's premium and fees does Grays charge, and what does Sydney→Dubbo freight cost?

**Status: 🟡 Partly answered — fees are lot-specific; no single Sydney→Dubbo freight price exists.**

Grays does **not** have one universal buyer's premium. Its own help centre says the buyer's premium may be:
- fixed;
- a standard percentage;
- or variable by final bid price.

Current IT/computer examples found:
- mixed IT lots commonly show **20% buyer's premium**;
- some general-goods terms show **25% incl. GST up to $35,000, then 15% above $35,000**;
- credit/debit-card surcharges vary by sale, with current examples around 0.7% debit, 1.2% Visa/Mastercard, and 2.5% Amex/Diners;
- some lots also mention an administration fee.

Primary sources:
- https://support.grays.com/hc/en-au/articles/900000810063-What-is-Buyer-s-Premium
- https://www.grays.com/lot/0059-23500727/computers-and-it-equipment/p-mixed-it-goods-p
- https://www.grays.com/lot/0051-5061702/computers-and-it-equipment/assorted-it-electronic-items

### Sydney → Dubbo freight
There is **no fixed Grays Sydney→Dubbo freight tariff**. Many IT auctions are pickup-only, and Grays says the buyer must organise packing and third-party collection. Its current recommended small-item carriers include Pack & Send, Australia Post, StarTrack, CouriersPlease and Aramex.

For delivery-enabled lots, Grays uses a postcode shipping calculator on the specific lot page. I could not obtain a reliable generic Dubbo quote independent of a particular lot's dimensions, weight, origin and packing.

Sources:
- https://support.grays.com/hc/en-au/articles/57861697618201-Recommended-Couriers-Small-Items
- https://support.grays.com/hc/en-au/articles/5882687412121-Third-Party-Collections-Recommended-Carriers
- https://support.grays.com/hc/en-au/articles/900000810903-Where-do-you-deliver-to
- https://www.grays.com/sale/2586911/computers-it-equipment/dell-systems-peripherals?tab=Delivery

**DubboEwaste rule:** calculate the *landed* auction cost as bid + buyer's premium + GST treatment + admin/payment surcharge + packing + Sydney→Dubbo freight before deciding whether an auction lot is profitable.

---

## 46. Do ex-government laptop lots state that devices are released from Autopilot/Intune?

**Status: 🟡 No positive evidence found; treat release status as unknown unless explicitly stated.**

I searched indexed Grays, Pickles and Slattery IT/laptop listings for **Autopilot** and **Intune** wording. I did not find ex-government computer listings that affirmatively state devices have been removed from Microsoft Autopilot, Intune or another organisation's MDM tenant.

What the public listings commonly say instead:
- **sold as-is / untested**;
- unknown condition;
- no operating system;
- inspection recommended.

One useful current example is a Slattery ex-council lot containing HP/Dell all-in-ones described as **"Unknown Conditions Computers Sold As Is, Untested."** That is not evidence that tenant/Autopilot release was checked.

Sources:
- https://slatteryauctions.com.au/assets/138812
- https://www.grays.com/lot/0051-5061702/computers-and-it-equipment/assorted-it-electronic-items
- https://www.pickles.com.au/upcoming-auctions/auction-info/online-general-goods/vic-tas-council-government-general-goods-it-workshop-light-industrial-equipment-sale/auction-15406

**DubboEwaste takeaway:** do **not** assume ex-government provenance means Autopilot/Intune has been released. For any auction laptop lot, ask specifically whether devices have been removed from:
- Microsoft Autopilot / Entra / Intune;
- Apple Business/School Manager / MDM;
- Absolute/Computrace;
- Google enterprise enrolment;
and price the lot as lock-risk if the seller will not confirm.

---

## 47. Which other auction houses sell government IT (Pickles, Manheim, Slattery), and at what prices?

**Status: ✅🟡 Answered with current examples, not a complete historical price database.**

### Pickles
Pickles runs recurring **Council/Government General Goods, IT, Workshop & Light Industrial Equipment** auctions under instructions from government accounts. These are often pickup-only and charge processing/other fees.

Pickles also lists individual devices such as Microsoft Surface units in its national general-goods/IT sales.

Sources:
- https://www.pickles.com.au/upcoming-auctions/auction-info/online-general-goods/vic-tas-council-government-general-goods-it-workshop-light-industrial-equipment-sale/australia-wide/auction-15694
- https://www.pickles.com.au/used/details/computers-smartphones-office-machines/microsoft-corporationsurface-go-1825/62370048

### Slattery Auctions
Slattery actively sells computers, phones and tablets. Current/recent indexed examples include:
- Apple MacBook Air A2337 lots;
- Microsoft Surface Pro;
- an **ex-council** lot of 5 HP + 2 Dell all-in-one computers;
- a September 2026 Sydney IT auction with iPhones and Surface Pro devices.

The ex-council all-in-one lot was listed as unknown condition / untested; its current page exposes the fee structure but not a reliable final sale price in the indexed result.

Sources:
- https://slatteryauctions.com.au/assets/138812
- https://slatteryauctions.com.au/assets/136890
- https://slatteryauctions.com.au/auctions/11855

### Manheim
Manheim is primarily known for vehicles, but its industrial/machinery auction catalogue does include IT equipment. A 2026 Moorebank catalogue showed:
- lot of **3 Dell/HP/Acer laptops** with current bid around **$136** at crawl time;
- HP desktop lots;
- iPhone 13 and iPhone 15 lots.

These were live/current-bid figures, **not final sold prices**, and the catalogue was a packaging/processing equipment liquidation rather than a government IT fleet sale.

Source:
- https://www.manheim.com.au/trucks-machinery/auctions/pms0526/page2

**Price warning:** current bids are not clearing prices. For procurement decisions, record the final hammer price plus premium/fees and lock/condition risk.

---

## 48. Are there more authoritative figures on refurbished-laptop return and complaint rates?

**Status: ✅ Useful marketplace thresholds found; true industry-wide laptop failure/return rate remains unavailable.**

The strongest current Australian benchmark I found is **eBay Australia's Refurbished Program**. It does not publish an industry average return rate, but it publishes hard seller-performance ceilings required to participate:

- **Return Rate: <10%**
- **Item Not As Described (INAD): <4%**
- **Item Not Received (INR): <1%**
- **Stockout: <2%**
- **Cases closed without seller resolution: <0.3%**
- positive feedback >98%

eBay also requires at least 30-day returns, a minimum one-year warranty, and technical quality-control checks. Sellers undergo secret-shop vetting; the terms say at least three secret shops during a 90-day evaluation period and ongoing secret shopping afterwards.

These figures are **eligibility/performance thresholds, not observed average return rates**. But they are much more useful operational targets than unsourced blog claims.

Primary sources:
- https://www.ebay.com.au/sellercentre/refurbished-program
- https://www.ebay.com.au/sellercentre/refurb-terms
- https://www.ebay.com.au/sellercentre/refurb-categories

I found academic work on laptop remanufacturing/failure modelling, but it does not provide a clean current Australian consumer return-rate benchmark that should be used as a business target.

**DubboEwaste suggested KPI targets for a pilot:**
- total return rate: aim **well below 10%**;
- INAD/fault-mismatch complaints: aim **well below 4%**;
- unresolved cases: effectively zero;
- log every return reason by component/failure mode so a local evidence base replaces generic assumptions.

---

# Batch conclusions

1. Auction margin calculations must include buyer's premium, surcharges, pickup/packing and freight; the hammer price alone is misleading.
2. Auction lots should be treated as **MDM/Autopilot-risk unless explicitly released**.
3. Pickles, Slattery and Manheim all provide real online IT sourcing opportunities, but lot condition and sale context vary substantially.
4. eBay Australia's Refurbished Program provides a defensible operational quality ceiling: <10% returns and <4% INAD, with much tighter targets preferable for DubboEwaste.
