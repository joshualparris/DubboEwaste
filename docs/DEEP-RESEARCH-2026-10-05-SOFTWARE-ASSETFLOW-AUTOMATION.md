# Regional ITAD Deep Research 2026 — Software, AssetFlow & Automation

**Research date:** 5 October 2026  
**Purpose:** compare mature ITAD software with the needs of a very small Dubbo pilot and define what AssetFlow should and should not automate.

---

# Executive conclusion

Purpose-built ITAD ERP is real and expensive enough that the practitioner’s “hundreds per month” comment is credible.

Current public examples:

- **RecyclyERP:** £3,000 onboarding plus £54 per user/month, minimum three users. It includes collection/drop-off, CRM, contracts, erase integrations, inventory/demanufacturing, customer portal, e-commerce, finance and fleet features.
- **RazorERP:** specialised ITAD features include service contracts, fair-market-value pricing, grading devaluation and automated settlements. Capterra Australia lists a starting price of US$450 per user/month.
- **AssetTiger:** generic asset management starts at US$20/month for 500 assets and unlimited users, illustrating how much cheaper generic tracking can be when ITAD-specific workflow is absent.

Sources:
- https://recyclyerp.com/pricing
- https://www.razorerp.com/itad-software/
- https://www.capterra.com.au/software/148503/razorerp
- https://www.assettiger.com/pricing

For a tiny pilot, AssetFlow is rational **only if it stays simpler than the business**.

---

# 1. What mature ITAD ERP actually solves

Commercial ITAD systems commonly combine:

- CRM/customer;
- contracts;
- inbound collections;
- jobs/lots;
- serialized inventory;
- grading;
- FMV;
- wipe integrations;
- component harvesting;
- warehouse locations;
- resale;
- settlement;
- customer portals;
- regulatory documents;
- finance integrations;
- reporting.

That confirms AssetFlow’s direction, but it does not mean every feature belongs in Phase 0.

---

# 2. Phase 0 minimum system

AssetFlow needs to answer seven questions instantly:

1. **What is it?**
2. **Who did it come from?**
3. **Where is it?**
4. **What is its data state?**
5. **What has happened to it?**
6. **What happens next?**
7. **Where did it finally go?**

Everything else is secondary.

Minimum fields:
- asset ID;
- serial/IMEI;
- manufacturer/model/category;
- source/customer/job/lot;
- current location;
- status/route;
- data state;
- evidence;
- final destination.

---

# 3. Feature priority matrix

## P0 — must be reliable now

- authentication/RBAC;
- jobs/lots/assets;
- QR/barcode;
- search/scan;
- location;
- source/customer;
- chain-of-custody events;
- media links;
- data-state gate;
- photos/evidence;
- basic sanitisation record;
- diagnostics;
- grade;
- route;
- downstream;
- basic resale record;
- certificates/evidence export;
- immutable event history.

## P1 — build when pilot produces repeated pain

- hands-on time tracking;
- WIP caps;
- ageing/backlog dashboard;
- source-quality metrics;
- repair parts/labour caps;
- charger inventory;
- parts harvesting inventory;
- downstream price book;
- batch scan/move;
- batch label print;
- recall check;
- release authorisation;
- ownership-lock state;
- shipping eligibility.

## P2 — wait for actual scale

- automated FMV feeds;
- sophisticated settlement engine;
- customer portal;
- automatic ecommerce listing;
- accounting integration;
- multi-site optimisation;
- SLA workflow;
- external wipe API automation;
- advanced BI.

## P3 — avoid until warehouse scale

- RFID;
- robotic/automatic stations;
- complex route engines;
- broad marketplace integrations;
- ML valuation without enough local data.

---

# 4. Barcode versus QR versus RFID

## QR now

Best Phase 0 choice:
- cheap labels;
- phone scan;
- enough data to encode URL/token;
- human-readable ID printed alongside.

## 1D barcode

Useful with inexpensive laser scanners and simple asset IDs, but less convenient for embedded URLs and phone scanning.

## Data Matrix

Compact and robust, useful in manufacturing, but less familiar to operators and customers.

## RFID

Powerful for:
- bulk count;
- no line-of-sight;
- warehouse cycle counting.

Too much infrastructure for a shed pilot.

Trigger:
- repeated evidence that manual scanning is a material labour bottleneck.

---

# 5. Recommended label

Human readable:

```
DEW-2026-000123
Lenovo ThinkPad T14 Gen 2
```

QR:
```
https://assetflow.../assets/<stable-id-or-token>
```

Optional:
- data-state warning;
- source/job shorthand.

Do not encode private donor/customer data into the QR.

---

# 6. Workflow-rule philosophy

AssetFlow workflow rules should be **recommendations with explainable reasons**, not opaque automation that silently moves assets.

Example:

```json
{
  "conditions": {
    "data_bearing": true,
    "data_state": "UNWIPED_RESTRICTED"
  },
  "action": {
    "route": "SANITISATION",
    "reason": "All data-bearing media must pass the data gate before release."
  }
}
```

Good automation:
- catches missing steps;
- reduces duplicate entry;
- preselects likely workflow;
- warns about caps;
- creates evidence consistency.

Bad automation:
- hides why route changed;
- overrides safety exceptions;
- automatically claims sanitisation success;
- releases assets without operator approval.

---

# 7. Workstation model

A workstation is a logical processing profile:

- RECEIVING;
- WIPE;
- DIAGNOSTICS;
- REPAIR;
- GRADING;
- PARTS.

Store:
- workstation ID;
- location;
- tool/profile;
- operator;
- active state.

A physical bench can serve multiple profiles at Phase 0.

---

# 8. Data sanitisation integration maturity

## Stage 1
Manual run + upload raw report.

## Stage 2
Parse report into:
- asset/media ID;
- tool;
- method;
- start/end;
- result;
- validation.

## Stage 3
Controlled launch hook to external tool.

## Stage 4
API/integration with signed results.

## Stage 5
Batch orchestration and exception queue.

Do not let AssetFlow itself claim to wipe drives merely because it stores a wipe record.

---

# 9. Fair-market value and settlements

RazorERP’s public ITAD positioning shows why mature platforms connect:
- base FMV;
- grade deductions;
- contracts;
- settlement.

For Phase 0, keep this simpler.

Suggested record:
- model/spec;
- reference price source/date;
- expected grade;
- expected sale range;
- actual grade;
- actual sale;
- fees;
- parts;
- labour minutes;
- net recovery.

After enough records, AssetFlow can derive local FMV.

Do not use AI-generated price estimates as settlement truth without market evidence.

---

# 10. Charger data model

Suggested fields:

```
charger_id
manufacturer
model
connector_type
voltage
amps
watts
polarity
usb_c_pd
oem_status
condition
tested_status
compatible_families
location_id
source_asset_id
sale_status
notes
```

High practical value because accessory clutter was a real practitioner pain point.

---

# 11. Parts inventory model

Fields:

```
part_id
parent_asset_id
part_type
manufacturer
part_number
spec
condition
test_status
data_bearing
location
compatible_models
harvested_at
used_in_asset_id
sold_at
downstreamed_at
```

Rule:
**No unidentified data-bearing media in parts stock.**

---

# 12. Backlog dashboard

Add four headline measures:

```
inbound_this_week
closed_this_week
current_wip
assets_over_age_limit
```

Warn when:
- inbound > closed for two weeks;
- any zone over cap;
- unwiped asset ageing exceeds threshold;
- repair WIP has no next action/review date.

---

# 13. Data quality rules

High value:
- serial uniqueness where applicable;
- required source/job before intake complete;
- data-bearing defaults to restricted;
- release requires final data state;
- current location cannot be null after intake;
- route change creates event;
- media removal creates parent-child link;
- deletion of audit history prohibited.

These controls create more value than cosmetic automation.

---

# 14. Build-versus-buy trigger

Continue AssetFlow while:
- one/few operators;
- workflow still changing;
- custom regional process matters;
- hosting/development cost is low;
- it reliably protects custody/data state.

Reassess commercial ERP when:
- multiple staff/sites;
- customer portals become mandatory;
- finance/settlement complexity grows;
- major ITAD contracts demand mature reporting;
- integration maintenance consumes more labour than licence cost;
- uptime/support expectations exceed hobby/custom software tolerance.

---

# 15. Total-cost test

For any automation feature:

```
annual benefit
= minutes saved per transaction
× transactions/year
× loaded labour rate
+ expected error/risk reduction

annual cost
= build time
+ hosting/licence
+ maintenance
+ training
+ failure/rework
```

If benefit cannot be articulated, defer it.

---

# 16. Recommended AssetFlow backlog from this research

## Immediate

1. backlog/WIP dashboard;
2. release-authorisation gate;
3. ownership-lock field;
4. hands-on minutes;
5. repair cap fields;
6. recall check;
7. shipping/battery eligibility;
8. charger inventory;
9. downstream price book;
10. evidence retention class.

## Next

11. parts harvesting inventory;
12. batch scan/move;
13. source-quality score;
14. route ageing;
15. settlement reconciliation;
16. sanitisation report parser;
17. customer-facing manifest export.

## Later

18. external data-erasure API;
19. FMV automation;
20. accounting integration;
21. customer portal;
22. RFID.

---

# 17. Security principle

AssetFlow is an operational system containing:
- serials/IMEIs;
- customer/source contacts;
- chain-of-custody;
- wipe reports;
- prices/margins;
- buyer details.

Therefore:
- keep production records behind authentication;
- RLS/least privilege;
- no service-role secret in browser;
- minimise personal data;
- protect evidence;
- back up database;
- keep audit history;
- do not expose operational data in the public GitHub repository.

The public repository can contain schema/process documentation, not live private records.

---

# 18. Conclusion

AssetFlow should not try to beat a mature ERP feature-for-feature.

Its competitive advantage in Phase 0 is:
- exact fit;
- low cost;
- fast iteration;
- clear custody;
- regional workflow;
- evidence-first design.

If it becomes slower than the physical work, simplify it.

