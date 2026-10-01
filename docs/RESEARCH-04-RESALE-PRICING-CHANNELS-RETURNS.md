# Research 04: Resale channels, pricing, shipping and returns

**Research date:** 2 October 2026 (AEST)

**Scope:** the next unresolved gaps in [`codexGAPS.md`](codexGAPS.md), especially sections 10 and 11: repeatable pricing, local versus national channels, shipping, returns, consumer guarantees, warranty reserves, and a practical pilot dataset.
**Status:** desk research complete; local sell-through, carrier damage, return rate and wholesale-floor assumptions remain pilot measurements or interview questions.

## Executive decision

For a Dubbo pilot, use a two-lane channel policy:

1. **Local pickup first** for low-value, bulky, fragile or battery-risk items: monitors, TVs, desktops, printers, large speakers and anything whose shipped margin is uncertain. Use a written test summary, appointment windows and a no-untracked-cash rule.
2. **National e-commerce** for compact, identifiable, tested items with enough contribution margin to absorb packaging, postage and a return. eBay is the first test channel because its Australian seller documentation exposes completed listings and Product Research; it is not automatically the cheapest channel once labour, postage, ads, disputes and returns are included.
3. **Parts/wholesale exit** for items that fail the retail rule. Do not let a hopeful retail price justify accepting a device whose lock, battery, safety or data state is unknown.

The first pilot should not ask “what is this worth?” It should record four separate values:

| Value | Meaning | Used for |
|---|---|---|
| `market_price` | Observed price for comparable sold goods | Price anchor |
| `realised_revenue` | Actual buyer payment, excluding refunded amounts | Revenue |
| `contribution_after_sale` | Revenue less channel, shipping, packaging, parts and return reserve | Go/no-go |
| `contribution_per_labour_hour` | Contribution divided by measured intake, test, clean, list, pack and support time | Capacity decision |

## 1. What current primary sources establish

### eBay Australia

eBay’s current Australian pages say that selling is free for eligible Australia-based sellers without a Pro plan, while also stating that free selling is unavailable to Pro sellers, sellers outside Australia, and sellers with more than AU$25,000 in sales in the previous 12 months. Other costs can still apply, including optional upgrades, international charges, promoted listings, shipping labels, Money Back Guarantee refunds and payment disputes. The fee page also lists a AU$24.20 dispute fee when eBay finds the seller responsible for a disputed amount.

Sources:

- [eBay: Start selling](https://www.ebay.com.au/help/selling/getting-started-selling/getting-started-selling?id=4081&ra=true)
- [eBay: Fees and selling costs](https://www.ebay.com.au/help/selling/selling-fees/fees-selling-costs-charged?id=5297&ra=true)
- [eBay: Selling fees without a Pro plan](https://www.ebay.com.au/help/selling/selling-fees/selling-fees-managed-payments-sellers?id=4822)

**Operational conclusion:** never put a hard “eBay costs X%” constant in the tracker. At listing time, save the fee estimate shown by the account, then reconcile the actual payout in Seller Hub. The free-selling threshold, account status, category, promotion choice and destination can change the result.

eBay’s official material is internally inconsistent about Product Research. One current Seller Centre page says it is free to all sellers, while another help page says Product Research is available to Pro sellers. The general pricing help confirms that completed listings can be searched, and the Product Research help describes sold-price, postage and sell-through metrics. Treat this as an account-level test, not a planning assumption.

Sources:

- [eBay Seller Centre: Product Research and Sourcing Insights](https://www.ebay.com.au/sellercentre/product-research)
- [eBay Help: Product research](https://www.ebay.com.au/help/selling/selling-tools/terapeak-research-and-SEO?id=4853)
- [eBay Help: Pricing your items](https://www.ebay.com.au/help/selling/selling/pricing-items?id=4133)

The useful distinction is:

- ordinary completed-listing search: recent sold results, suitable for a free manual check;
- Product Research: potentially longer history, accepted-offer prices, average postage, sell-through and trend information, subject to what the account currently exposes;
- the operator’s own sales ledger: the only reliable source for actual labour, return and realised-margin economics.

### Shipping and lithium batteries

Australia Post treats lithium batteries as dangerous goods. Its current guidance limits capacity and requires batteries to be installed in equipment for some air and international services. Damaged, recalled or non-conforming batteries are prohibited. Spare batteries and some packed-with-equipment cases require domestic road transport and specific packaging/labels. A device with a swollen, punctured, leaking or otherwise damaged battery must not enter normal resale shipping.

Sources:

- [Australia Post: Dangerous, prohibited and restricted items](https://auspost.com.au/business/shipping/shipping-guidelines/dangerous-prohibited-items)
- [Australia Post: Lithium batteries quick reference guide](https://auspost.com.au/content/dam/auspost_corp/media/documents/lithium-batteries-quick-reference-guide.pdf)

**Operational conclusion:** the listing decision and shipping decision are separate gates. “The laptop works” does not prove “the laptop can be mailed.” Record battery state, watt-hour rating where available, installed/spare status, transport service and packaging check.

### Australian Consumer Law and second-hand goods

The ACCC states that consumer guarantees apply to goods supplied in trade or commerce, including second-hand goods; age, price and disclosed condition affect what acceptable quality and durability mean. A known defect can be sold at a reduced price when the buyer is alerted to that defect before sale, but disclosure is not a blanket waiver of all guarantees. Businesses must not use “no refunds”, “no warranty” or similar wording to remove non-excludable consumer guarantees.

For a minor failure, the business can generally choose repair, replacement or refund. For a major failure, the consumer can generally choose a refund or replacement and may have other remedies. A written voluntary warranty can add promises but cannot reduce ACL rights.

Sources:

- [ACCC: Consumer guarantees](https://www.accc.gov.au/business/selling-products-and-services/consumer-guarantees)
- [ACCC: Second-hand, leased or hired goods](https://www.accc.gov.au/system/files/Consumer%20guarantees%20-%20A%20guide%20for%20businesses%20and%20legal%20practitioners.pdf)
- [ACCC: Repair, replace, refund](https://www.accc.gov.au/consumers/problem-with-a-product-or-service-you-bought/repair-replace-refund)

**Operational conclusion:** use “tested used/refurbished” as a factual condition description, not as a legal escape hatch. Have a consumer-law adviser review the final terms before public trading.

## 2. Channel fit for the Dubbo pilot

| Channel | Best first use | Advantages | Main risks/control |
|---|---|---|---|
| Local pickup / local classified | TVs, monitors, desktops, low-value laptops, fragile items | No parcel damage, instant inspection, no platform shipping fee | No-shows, cash/payment fraud, privacy at pickup; use appointment log, public/controlled handover and cleared payment |
| eBay Australia | Compact laptops, phones, tablets, components and unusual models | National demand, completed listings, structured order/tracking records | Fees can vary, buyer disputes, return freight, account policy; calculate with live fee estimate and reserve |
| Direct B2B / school / community partner | Tested batches and student devices | Lower listing labour, repeat demand, local relationship | ACL still applies if in trade or commerce; record recipient, condition and remedy path |
| Wholesale / parts buyer | Untested, locked-out, uneconomic or aged stock | Fast exit and less listing labour | Low price, opaque grading and freight; obtain written quote and use as a floor, not a fantasy retail price |
| Market stall / event | Simple, low-ticket tested stock and chargers | Demand discovery and trust building | Time cost, public returns handling and payment records; trial only after channel margin is measured |
| Back Market/Reebelo-style marketplace | Later scale experiment | Existing buyer demand and structured recommerce | Onboarding, grading, warranty, fees and volume requirements not yet verified for this business; do not make this a pilot dependency |

The pilot should run no more than two active retail channels at once: one local and one national. Otherwise the operator cannot tell whether a sale came from the item, the channel, seasonality or listing effort.

## 3. A repeatable pricing method

### 3.1 Comparable selection

For each item, search by exact manufacturer, model/MPN, CPU, RAM, storage, screen size, cellular capacity, colour and carrier/lock status where relevant. Separate:

- tested working from untested, parts-only and faulty;
- complete from missing charger, stand, stylus, dock or proprietary cable;
- battery-health disclosed from battery-health unknown;
- local pickup from delivered listings;
- Australian stock from overseas stock;
- sold price from current asking price.

Use at least 20 usable comparables for a category/model family when possible. If there are fewer than 8 genuinely comparable sales, mark confidence low and use a wider model-family range or a wholesale quote rather than false precision. Record the search date and the evidence URL or screenshot reference in the private ledger; do not scrape or republish platform data in breach of terms.

Recommended observation window:

- common current laptops/phones/components: 90 days;
- thinly traded or seasonal goods: 180–365 days, with older observations down-weighted;
- vintage or unusual items: expand until there are enough true comparables, documenting the expansion;
- any device with a current support/lock/recall event: recheck immediately before listing.

Use the median as the default price anchor, not the highest observed sale. Remove obvious bundles, miscategorised listings, damaged units and outliers. A trimmed median of the middle 80% is a useful spreadsheet approximation when the sample is small, but retain the raw observations so the judgement can be audited.

### 3.2 Condition adjustments

Do not invent a universal A/B/C grade. Use a plain-language grade plus mandatory facts:

| Field | Minimum values |
|---|---|
| Function | tested working / tested with fault / untested / parts-only |
| Display | clear / scratches / bright spots / dead pixels / lines / cracked |
| Battery | health or runtime measured / holds charge but unknown health / does not hold charge / swollen or unsafe |
| Identity and locks | model/serial recorded / Activation Lock, FRP, MDM, Autopilot or BIOS lock clear / unresolved lock |
| Completeness | charger included / compatible charger / no charger / missing proprietary accessory |
| Cosmetic | clean / normal wear / heavy wear / cracked or bent |
| Data state | sanitised and verified / reset only / data-bearing or quarantine |
| Repair history | original parts known / repaired with disclosed parts / unknown / parts-only |

A condition adjustment is allowed only where the comparable sample supports it. Until local evidence exists, use a conservative range rather than fixed deductions such as “battery minus $50”. Record the reason for every deduction.

### 3.3 Maximum acquisition cost

Use this formula before accepting an item or lot:

```text
maximum acquisition cost
= expected realised sale price
 - channel and payment costs
 - outbound postage and packaging
 - expected return/refund reserve
 - parts and consumables
 - downstream/wholesale exit cost
 - measured labour cost
 - target contribution
```

For a donated item, acquisition cost may be zero, but labour, risk and downstream disposal are not zero. For a mixed lot, allocate the lot cost across units by expected realised value, then model the non-saleable residue separately. If the lot only works when every unit sells at the optimistic price, reject or renegotiate it.

### 3.4 Example with variables, not fixed platform assumptions

Suppose a tested laptop has a conservative expected realised price of `$P`. Let:

```text
channel_cost = live fee estimate + promotion + payment/dispute allowance
delivery_cost = postage + packaging + insurance/signature if chosen
return_reserve = probability of return or fault × average all-in return cost
labour_cost = measured hours × internal hourly rate
exit_cost = expected cost of recycling/wholesale for a failed outcome
```

Then accept only if:

```text
P - channel_cost - delivery_cost - return_reserve
  - parts - labour_cost - exit_cost >= target contribution
```

The ledger must preserve both the estimate at acceptance and the actual result after sale. This makes forecast error visible instead of silently rewriting the rule after the item sells.

## 4. Returns, remedies and warranty economics

### 4.1 Before listing

Create an item evidence pack:

1. asset ID and intake source;
2. model, serial/IMEI and lock result, with sensitive identifiers redacted in public photos;
3. test checklist and date;
4. battery result and shipping classification;
5. sanitisation method and verification result;
6. cosmetic photos under consistent lighting;
7. every known defect, missing accessory and non-original part;
8. listing copy and the comparable-price record;
9. packed weight, dimensions and chosen delivery service.

The public listing should be accurate enough that the buyer is not surprised. The private evidence pack should be detailed enough to diagnose a complaint without relying on memory.

### 4.2 When a complaint arrives

Use one intake record for all channels:

```text
complaint_id, asset_id, order_id, received_at, buyer_claim,
failure_date, photos/video, return_required, shipping_direction,
initial_triage, likely_minor_or_major, chosen_remedy,
parts/labour/refund_cost, final_outcome, root_cause
```

Do not make the first response “used items have no warranty”. Acknowledge the issue, preserve evidence, check the listing and test pack, and offer the remedy required by the applicable circumstances. The operator can diagnose whether the fault is a disclosed condition, transport damage, misuse, an ordinary wear item, or a failure that triggers a consumer guarantee; do not assume from the buyer’s first message.

### 4.3 Reserve method

Until there are 30–50 completed sales in a category, use scenario reserves rather than pretending to know the fault rate:

| Scenario | Reserve approach |
|---|---|
| Low-value local pickup | Track every complaint; reserve mainly for reasonable remedy time and consumables |
| Shipped laptop/phone | Set aside a percentage of realised revenue plus a minimum dollar floor equal to return postage, inspection and likely re-listing loss |
| High-value or fragile item | Price in return freight both directions, packaging replacement and a temporary cash hold |
| Parts-only/untested | Do not use “parts-only” to conceal a known functional defect; disclose the tested state and keep an exit-cost reserve |

After each 10 sales, calculate actual complaint rate, return rate, average remedy cost, median days-to-resolution and failure mode. Replace the scenario reserve with category-specific evidence only after the sample is large enough to be meaningful.

## 5. Shipping and packaging SOP to test

### Compact laptop/phone/tablet

- Photograph powered-off condition and serial/IMEI privately before packing.
- Remove or isolate loose accessories so they cannot impact the device.
- Prevent accidental power-on; protect ports and screens from pressure.
- Use a rigid box with void fill; do not let the device move inside the box.
- For lithium devices, verify capacity/condition and Australia Post or carrier rules before selecting the service.
- Record packed weight, dimensions, carrier, service, tracking and declared contents.

### Monitor/TV/large desktop

- Prefer local pickup until a tested packaging design has passed a small damage trial.
- If shipping, protect the panel face with a rigid surface, immobilise the stand/accessories and use a box that resists corner crush.
- Photograph packaging before closing and retain the tracking/insurance choice.
- Model a single damaged-panel event separately; its loss can erase the contribution of many small sales.

This report does not set a carrier price because rates depend on dimensions, destination, account discounts and service. The tracker should capture the checkout quote on the day rather than use a stale average.

## 6. Pilot dataset and spreadsheet schema

Add one row per accepted item and one row per declined offer. Suggested accepted-item fields:

```text
asset_id, intake_date, category, make, model, exact_spec,
condition_grade, battery_state, lock_state, charger_state,
acquisition_cost, expected_channel, comparable_count,
price_anchor, price_confidence, listed_at, list_price,
promoted, quoted_postage, quoted_packaging, quoted_channel_cost,
labour_minutes_intake, labour_minutes_test, labour_minutes_clean,
labour_minutes_list, labour_minutes_pack, realised_price,
actual_postage, actual_packaging, actual_channel_cost,
return_reserve, sold_at, days_to_sale, returned,
remedy_cost, final_contribution, final_contribution_per_hour,
exit_route_if_unsold, disposal_cost, notes
```

Suggested declined-offer fields:

```text
offer_id, date, source, category, model_or_description,
quantity, visible_red_flags, reason_declined, estimated_exit_cost,
estimated_retail_value, estimated_wholesale_value,
was_pre_screened, photo_reference, follow_up_needed
```

Free/open tools are sufficient for the pilot: LibreOffice Calc or a CSV ledger, SQLite for queries, a phone camera, a label/asset-ID convention and a private folder for evidence. Do not place buyer personal data, IMEI lists, addresses or payment exports in the public repository.

## 7. Weekly decisions and experiments

Run these experiments in order:

### Experiment A: local versus national

List matched pairs of 5–10 compact items: one local listing and one eBay listing, or sequentially use the same item with controlled copy. Measure views, enquiries, days to sale, actual labour, realised price and complaints. Do not double-sell; end the other listing immediately after sale.

### Experiment B: pricing confidence

For 20 items, have the operator price from a 20-comparable median, then compare forecast with realised price. Record whether the error came from condition, channel, postage, seasonality or weak demand.

### Experiment C: packaging damage

Before shipping expensive or fragile stock, send a low-consequence test package through the intended service or obtain packaging feedback from a specialist. A home drop test is not evidence of carrier safety and should not replace the carrier’s rules.

### Experiment D: return reserve

After the first 30 completed sales, compare a conservative reserve, a category-specific reserve and actual cost. Keep the reserve if the sample is too small; do not release it merely because no complaint has arrived yet.

## 8. Open questions requiring local evidence

These remain research opportunities rather than established facts:

- actual Dubbo sell-through by category and season;
- local no-show and scam rate by selling channel;
- wholesale/parts buyer floors for mixed lots;
- accepted shipping services and damage rates for laptops, monitors and TVs from Dubbo;
- return and fault rates by category and condition grade;
- whether local schools, TAFE, community groups or employers prefer direct batches over individual listings;
- the account-specific availability and fee treatment of eBay Product Research;
- Back Market/Reebelo seller onboarding, fees, warranty obligations and minimum volume;
- the business structure, GST and recordkeeping treatment appropriate to the actual operation.

These should be answered through the pilot ledger, written buyer/seller enquiries and professional advice where legal or tax consequences are involved—not by copying an online seller’s claimed margin.

## 9. Recommended acceptance rule

For Phase 0, accept an item for retail only when all are true:

- identity and ownership/provenance concerns are resolved;
- no unresolved activation, FRP, MDM, Autopilot, BIOS or carrier lock;
- safety and battery state permit the proposed channel;
- data sanitisation is complete and evidenced;
- the exact condition and defects can be stated plainly;
- at least one realistic exit route exists;
- expected contribution remains positive after measured labour, shipping, channel cost and a return reserve;
- the item will not consume more bench time than the category cap without an explicit exception.

Otherwise route it to inspect, parts/wholesale, approved recycling or reject. The pricing sheet is a decision aid, not permission to override a safety, data, lock or legal gate.

## Sources consulted

- eBay Australia, [Start selling](https://www.ebay.com.au/help/selling/getting-started-selling/getting-started-selling?id=4081&ra=true).
- eBay Australia, [Fees and selling costs](https://www.ebay.com.au/help/selling/selling-fees/fees-selling-costs-charged?id=5297&ra=true).
- eBay Australia, [Selling fees without a Pro plan](https://www.ebay.com.au/help/selling/selling-fees/selling-fees-managed-payments-sellers?id=4822).
- eBay Australia, [Product Research](https://www.ebay.com.au/help/selling/selling-tools/terapeak-research-and-SEO?id=4853).
- eBay Australia, [Product Research and Sourcing Insights](https://www.ebay.com.au/sellercentre/product-research).
- eBay Australia, [Pricing your items](https://www.ebay.com.au/help/selling/selling/pricing-items?id=4133).
- Australia Post, [Dangerous, prohibited and restricted items](https://auspost.com.au/business/shipping/shipping-guidelines/dangerous-prohibited-items).
- Australia Post, [Lithium batteries quick reference guide](https://auspost.com.au/content/dam/auspost_corp/media/documents/lithium-batteries-quick-reference-guide.pdf).
- ACCC, [Consumer guarantees](https://www.accc.gov.au/business/selling-products-and-services/consumer-guarantees).
- ACCC, [Repair, replace, refund](https://www.accc.gov.au/consumers/problem-with-a-product-or-service-you-bought/repair-replace-refund).
- ACCC, [Consumer guarantees: second-hand, leased or hired goods](https://www.accc.gov.au/system/files/Consumer%20guarantees%20-%20A%20guide%20for%20businesses%20and%20legal%20practitioners.pdf).

This is operational research, not legal, tax, dangerous-goods or financial advice. Verify live platform rules and obtain professional advice before relying on a public policy or a business tax treatment.
