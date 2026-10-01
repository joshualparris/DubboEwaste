# Research 13: Finance, time and unit economics

**Research date:** 2 October 2026 (AEST)

**Gap covered:** `codexGAPS.md` section 16: actual time-based economics, owner labour, travel, dead stock, disposal and the point where the current operating model should change.

**Status:** measurement design, not a financial forecast or tax advice.

## Executive decision

The core metric is **contribution per owner labour hour after route costs**, not revenue per device.

For every item or batch calculate:

```text
contribution = cash received
             - direct purchase/donation cost
             - repair parts and consumables
             - platform/payment/shipping costs
             - downstream fees
             - refunds/returns provision
             - allocated travel and incident cost

owner-hour yield = contribution / all owner hours
```

Count unpaid research, messages, collection, triage, data work, testing, repair, photography, listing, packing, delivery, bookkeeping, partner contact and cleanup. A “free” device can still be an expensive input.

## 1. What government guidance establishes

Business.gov.au recommends a startup-cost model, a budget, a cash-flow statement, regular stocktakes, records of income and costs, and review of profitability and cost trends. It specifically warns that unsold inventory ties up cash and shelf space. This supports a weekly stock-and-time ledger rather than an annual guess.

Business.gov.au also says business records include income, expenses, assets or stock, bank records and GST records where registered, and that records generally need to be retained for at least five years. Confirm the exact retention and tax treatment with the ATO or accountant for the chosen structure.

The ATO states that GST registration is generally mandatory when GST turnover reaches or is expected to reach $75,000, with different rules for some activities and not-for-profit organisations. The threshold is a trigger to monitor, not a pricing target. Do not add GST to invoices unless registered, and obtain current professional advice about second-hand goods, mixed personal/business assets and platform sales.

## 2. Cost ledger

Record one row per event, linked to `asset_id` or `batch_id`:

```text
event_id
asset_id / batch_id
date
route
minutes
worker
kilometres
cash_cost
cost_category
payment/refund reference
stock effect
notes
```

Use categories:

- acquisition and pickup;
- fuel, vehicle and parking;
- intake and triage;
- data sanitisation;
- testing and diagnostics;
- repair labour and parts;
- cleaning and consumables;
- photography/listing/messages;
- packing, postage and platform fees;
- customer support, returns and refunds;
- downstream disposal/recycling;
- tools and equipment depreciation;
- premises, electricity, insurance and software;
- bookkeeping, tax and compliance;
- training and partner development.

Separate cash cost from opportunity cost. The former reconciles to bank records; the latter shows whether the project is worth the owner’s time.

## 3. Route-level dashboard

Review each route weekly:

| Measure | Formula |
|---|---|
| gross revenue | payments received before refunds |
| contribution | revenue minus direct route costs |
| owner hours | total logged owner minutes / 60 |
| contribution/hour | contribution / owner hours |
| clearance time | arrival to final route |
| stock-days | sum of days held before final route |
| failure rate | failed/returned/refused items / items accepted |
| residual rate | downstream or landfill weight / received weight |
| record completeness | complete records / accepted items |
| cash conversion | days from outlay to cleared payment |

Compare whole-device resale, repair, parts, donation-supported work and material recovery separately. A high-revenue route can be worse than a lower-price route if it consumes more owner time or creates returns.

## 4. Time study for the first 30 items

Use a timer or simple start/stop event. Do not rely on end-of-day memory. Capture:

1. source contact and scheduling;
2. travel and loading;
3. intake, photos and ID;
4. ownership/data/hazard checks;
5. wiping or lock handling;
6. testing and diagnosis;
7. cleaning and repair;
8. parts sourcing;
9. photography, listing and customer messages;
10. packing, postage and handoff;
11. returns, warranty and after-sales support;
12. waste sorting and final dispatch;
13. bookkeeping and weekly review.

After 10, 20 and 30 items, replace estimates with medians by category. Track outliers separately because one difficult device can consume an entire batch’s margin.

## 5. Decision rule for acceptance

Before accepting an item, estimate:

```text
expected sale value × probability of successful route
- expected direct costs
- expected downstream/residual cost
- expected owner hours × target hourly value
- expected return/warranty reserve
```

If the result is below zero, accept only for a declared research, training or community purpose with a named budget and exit date. “Maybe valuable” is not an economic category.

Use a provisional target rather than pretending to know the correct wage. Set a target owner value, record actual contribution/hour, and review the target with an accountant or business adviser. The target should include unpaid admin and a reserve for non-selling work.

## 6. Inventory and cash controls

- record acquisition value or “donated/no cash cost” separately from fair-value assumptions;
- do not treat unsold stock as profit;
- age every item at 7, 14, 30 and 60 days;
- set a markdown, parts, donation or downstream decision at each age;
- cap open repair work and work-in-progress;
- keep a reserve for shipping damage, returns and warranty claims;
- reconcile marketplace payouts to item IDs and fees;
- reconcile cash paid for fuel, parts, packaging and disposal;
- record owner contributions and withdrawals separately;
- keep personal and business transactions clearly separated where practical;
- export the ledger and back it up monthly.

## 7. Travel and batch economics

For each collection or delivery run calculate:

```text
run contribution = batch contribution - fuel - parking - vehicle allocation
run owner-hour yield = run contribution / collection, driving and handoff hours
```

Do not make a trip for one low-value item unless it is an intentional partner experiment. Combine routes only if the combined load does not increase data, title, safety or storage risk.

## 8. Staffing and scale triggers

Ask a second person or contractor for a price only after measuring the actual task, not before. Candidate triggers include:

- lifting or loading cannot be done safely alone;
- customer appointments interrupt test/repair work;
- data sanitisation and listing queues exceed the time limit;
- a batch requires two-person verification;
- owner-hour yield falls below the target for three consecutive reviews;
- the opportunity cost of the owner’s time exceeds the cost of outsourcing;
- the operation needs a person with skills the owner cannot safely perform;
- premises or storage is the bottleneck rather than demand.

Compare total employment cost, contractor cost, training and supervision with the measured contribution. Business.gov.au advises including pay, leave, superannuation and other entitlements when planning employees; never compare a wage rate with owner gross revenue alone.

## 9. Four-week experiment

Run four weekly cohorts of 8–10 items:

- Week 1: mixed known-authority devices;
- Week 2: a single category such as laptops/phones;
- Week 3: controlled repair/parts candidates;
- Week 4: repeat the best route with no new tool purchases.

For every cohort report:

- total items and route mix;
- cash in/out;
- owner hours by task;
- contribution and contribution/hour;
- stock-days and unsold items;
- returns/rejections;
- residual weight and fee;
- data/safety incidents;
- what should be stopped, automated, outsourced or repeated.

Continue a route only if its measured contribution/hour is positive after all logged work and it does not create uncontrolled safety, privacy or premises risk. A route can remain experimental even when profitable if its downstream or legal evidence is incomplete.

## 10. Open questions

- What owner-hour value is appropriate for the user’s actual opportunity cost?
- Which costs are already paid personally and need allocation?
- What are the actual platform fees and return rates for the chosen channels?
- How should donated stock and personal equipment be treated in the selected business structure?
- When does the likely turnover require GST registration and BAS processes?
- What reserve is needed for consumer remedies, shipping damage and warranty work?
- What is the measured threshold at which premises, storage, vehicle or second-person cost becomes rational?

## 11. Sources consulted

- [business.gov.au: cash flow](https://business.gov.au/finance/cash-flow)
- [business.gov.au: guide to managing cash flow](https://business.gov.au/guide/guide-to-managing-cash-flow)
- [business.gov.au: financial tools and templates](https://business.gov.au/finance/financial-tools-and-templates)
- [business.gov.au: record keeping](https://business.gov.au/finance/payments-and-invoicing/record-keeping)
- [ATO: when you need to register for GST](https://www.ato.gov.au/api/public/content/0-1e92db95-a75c-4f4e-a3d4-39f43b1a3b25)
- [Research 04: resale pricing, channels and returns](RESEARCH-04-RESALE-PRICING-CHANNELS-RETURNS.md)
- [Research 07: repair economics and parts strategy](RESEARCH-07-REPAIR-ECONOMICS-PARTS-STRATEGY.md)
- [Research 09: inventory system of record](RESEARCH-09-INVENTORY-SYSTEM-OF-RECORD.md)

This report is research and measurement design, not tax, accounting, employment or financial advice. Confirm the user’s structure and current obligations with the ATO or a qualified adviser.
