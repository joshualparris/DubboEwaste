# Backlog 30–32: operating paperwork, pilot metrics and correction register

**Researched / implemented:** 2 October 2026  
**Scope:** backlog items 30–32.  
**Purpose:** turn the research into controls that can actually be used during a pilot, and explicitly identify older repo assumptions that are now superseded.

---

# 30. Operating paperwork requirements

The project's paperwork should be designed around **asset identity, authority to transfer, data custody, safety, resale disclosure and traceability**.

Do not build a giant compliance system before Fair Trading/Council decisions are known. Use the smallest records that preserve the evidence the pilot genuinely needs.

## A. Asset transfer / intake

New template:

- [asset-transfer-and-chain-of-custody.md](../templates/asset-transfer-and-chain-of-custody.md)

Minimum useful fields:

- job/intake number;
- source type;
- source/organisation;
- authorised person;
- transfer basis — donation, purchase, paid collection, customer property;
- asset ID;
- category;
- make/model;
- serial/IMEI;
- condition;
- battery condition;
- data-bearing status;
- account/MDM/activation-lock status;
- intended initial route;
- custody events.

### Important Fair Trading dependency

If NSW Fair Trading confirms the second-hand dealer regime applies, the forms/database must then include all **statutory supplier-ID, ownership-statement, reporting, stock-number and retention fields**.

Do not assume this generic chain-of-custody form alone satisfies that Act.

## B. Customer repair notice

New template:

- [repair-notice.md](../templates/repair-notice.md)

This is needed **before accepting customer-owned data-bearing devices for repair**.

Current ACCC guidance requires:

- written warning that repair may result in loss of user-generated data;
- where refurbished replacement goods/parts may be used, the exact prescribed refurbished-goods notice must be given before acceptance.

Because the exact prescribed wording should remain current, the template deliberately links to the ACCC source and includes a clearly marked insertion point.

Source:
- https://www.accc.gov.au/consumers/problem-with-a-product-or-service-you-bought/repair-notices

## C. Data sanitisation certificate

New template:

- [data-sanitisation-certificate.md](../templates/data-sanitisation-certificate.md)

Fields include:

- certificate/job number;
- client;
- asset/device/media serials;
- media type/capacity;
- policy/standard referenced;
- sanitisation method/command;
- tool + version;
- start/finish;
- verification/validation;
- PASS / FAIL / DESTROY;
- failure escalation;
- final disposition;
- operator.

### Wording rule

Use:

> **documented media sanitisation / secure data erasure**

unless the business later obtains an independent certification/accreditation that supports stronger wording.

Do not market a home-created certificate as third-party "certified destruction".

## D. Sales / recall record

New template:

- [sale-and-recall-record.md](../templates/sale-and-recall-record.md)

It links:

- buyer/contact;
- asset ID;
- serial/IMEI;
- exact condition/configuration;
- battery/OS status;
- known defects;
- test/recall check;
- sale price/channel;
- delivery/tracking;
- later recall contact.

This gives the business a practical way to contact buyers if a safety recall later emerges.

## E. Ownership-and-wipe legacy template

The existing [ownership-and-wipe-certificate.md](../templates/ownership-and-wipe-certificate.md) is useful but now too compressed to be the only record.

Recommended use:

- retain it as a quick client-facing summary;
- use the new chain-of-custody + sanitisation records as the detailed operational evidence.

Do not delete the old template until the final Fair Trading record requirements are known.

## F. Privacy / supplier identity

If supplier ID or personal details are collected, the business should document:

- why the information is collected;
- legal/operational purpose;
- where it is stored;
- who can access it;
- retention period;
- secure deletion process;
- disclosure to NSW Police/Fair Trading where legally required.

The Privacy Act may not automatically apply to every small business under $3 million turnover, but exceptions exist and business clients may contractually require stronger controls.

Source:
- https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business

The correct approach is **privacy-by-design even where a statutory small-business exemption may apply**.

## G. Uncollected repair goods

If repair services are offered, do not write:

> "After 30 days the device becomes our property."

Use the NSW Uncollected Goods Act process.

Source:
- https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/repairs-replacements-and-refunds/uncollected-goods

## H. Battery / incident record

The full pilot tracker now records battery condition.

If a thermal/safety incident occurs, retain a separate incident record with:

- date/time;
- asset ID;
- observed symptoms;
- whether charging/testing was occurring;
- charger used;
- location;
- action taken;
- emergency service contact if any;
- photographs where safe;
- disposal/isolation pathway;
- corrective action.

Do not create a public battery-drop program in Phase 0.

---

# 31. Pilot tracker redesign

The original CSV tracked only:

- date/client/item/model;
- age/specs/condition;
- decision;
- wipe;
- parts/time;
- sale price/channel/date;
- profit.

That is not enough to answer the project's core questions.

The tracker has now been expanded so the first 20–30 devices can measure:

## Provenance / intake

- asset ID;
- date;
- source type/name;
- transfer basis;
- authority recorded;
- category;
- make/model;
- serial/IMEI;
- age estimate/specs;
- intake condition;
- battery condition;
- account-lock/MDM state;
- data-bearing status.

## Acceptance decision

- initial route;
- estimated resale value;
- intake time;
- collection kilometres/time.

## Data

- sanitisation required;
- method;
- tool/version;
- result;
- date.

## Repair

- repair labour;
- parts;
- other direct costs;
- ready date.

## Selling

- listing date;
- list price;
- sale channel/date;
- sale price;
- platform fee;
- postage;
- packaging;
- refund/return cost.

## Downstream

- downstream provider;
- recycling cost;
- recycling rebate;
- final route.

## Outcome

- days in stock;
- total labour minutes;
- gross margin;
- accept-same-item-again decision;
- notes.

## Gross-margin definition

For Phase 0, use a deliberately simple direct-margin measure:

**gross margin = sale price + recycling rebate - parts cost - other direct cost - platform fee - postage cost - packaging cost - refund/return cost - recycling cost**

Do **not** quietly treat this as net business profit.

It excludes:

- rent/home occupancy;
- insurance;
- licence fees;
- tax/GST;
- vehicle depreciation;
- tools;
- electricity;
- unpaid admin;
- general overhead.

Those should be reviewed separately.

## Labour metric

**margin per labour hour = gross margin ÷ (total labour minutes / 60)**

Track labour even if Josh does not "pay himself" in the pilot.

Otherwise a $100 margin after five hours of work looks falsely attractive.

## Pilot KPIs after 30 devices

Calculate:

- acceptance rate;
- whole-device reuse/resale rate;
- repaired-then-sold rate;
- parts/donor rate;
- recycling rate;
- reject/liability rate;
- average and median gross margin;
- average and median labour minutes;
- gross margin per labour hour;
- average/median days in stock;
- return/refund rate;
- average collection kilometres/time;
- average sanitisation time;
- average downstream cost;
- best/worst device categories;
- percentage Josh would accept again.

## Scaling gate

Do not scale because revenue looks exciting.

Scale only if:

- gross margin remains positive after real direct costs;
- labour return is worthwhile;
- stock turns over;
- rejects/recycling stay manageable;
- safe storage remains within physical capacity;
- data sanitisation remains controlled;
- returns/warranty issues are manageable;
- supply quality is repeatable.

---

# 32. Correction register — older repo statements superseded by new research

This section is intentionally explicit because this repository was built rapidly across multiple research passes.

Where an older file conflicts with the findings below, **the newer dated source-led finding should win until the older file is edited**.

## Correction 1 — eBay "roughly 13%" fee

**OLD:** small/business resale budget assumes roughly 13%.

**CURRENT:** Australian sellers with no eBay Pro plan and **AU$25,000 or less in eBay sales in the prior 12 months** currently pay **no eBay transaction/final-value fee** on eBay.com.au.

Optional upgrades, postage, international and other applicable fees remain.

Source:
- https://www.ebay.com.au/help/selling/fees-credits-invoices/selling-fees-managed-payments-sellers?id=4822

### Action

Do not deduct 13% in the Phase 0 tracker unless the actual account/plan/category requires it.

## Correction 2 — Gumtree seller fee

**OLD:** no stable assumption.

**CURRENT:** Gumtree's own live pages currently conflict: one says Gumtree Pay is free for sellers; another current/cached guide references a small seller platform fee.

### Action

Keep Gumtree fee as **verify-at-use**, not a fixed percentage.

## Correction 3 — insurance $800–$1,500

**OLD:** generic estimate.

**CURRENT:** not sufficiently sourced for this exact risk.

### Action

Replace with **quote required**.

The relevant disclosure must include home operation, customer visits, product liability, embedded lithium batteries, repair/refurbishment, data-bearing stock and expected maximum stock.

## Correction 4 — metal battery bin $100–$500

**OLD:** metal battery bin treated as a standard startup item.

**CURRENT:** Phase 0 rejects loose/damaged lithium batteries. Official guidance requires risk-based isolation/handling; a random metal bin is not itself a compliant solution.

### Action

Buy only controls justified by the actual risk assessment and insurer/fire guidance.

## Correction 5 — Windows 10 viability

**OLD:** non-Windows-11 devices default to Linux/vintage/parts.

**CURRENT:** Windows 10 normal support ended 14 October 2025, but Microsoft now offers Australian consumer ESU through **12 October 2027**, including a **AU$44.95 one-time option** subject to current enrollment terms.

### Action

Windows 11 remains the preferred resale target, but some Windows 10 22H2 machines can have a transparent **temporary ESU-supported** use case.

Source:
- https://www.microsoft.com/en-AU/windows/end-of-support

## Correction 6 — NIST sanitisation reference

**OLD risk:** references to "NIST 800-88" can be read as Rev. 1 or as a simple overwrite recipe.

**CURRENT:** **NIST SP 800-88 Rev. 2** was published September 2025 and supersedes Rev. 1.

### Action

Reference Rev. 2 specifically and document the actual sanitisation method and verification.

Source:
- https://csrc.nist.gov/pubs/sp/800/88/r2/final

## Correction 7 — "certified data destruction"

**OLD risk:** client-facing language can overstate what an internally generated certificate proves.

**CURRENT:** a home-created record does not create independent certification.

### Action

Use **documented media sanitisation / secure data erasure** unless later accreditation/provider evidence supports stronger wording.

## Correction 8 — customer repairs

**OLD omission:** intake/reuse research did not fully capture the mandatory repair-notice issue.

**CURRENT:** before accepting data-bearing goods for repair, provide the current written data-loss notice; if refurbished goods/parts may be used, provide the prescribed ACCC notice.

Source:
- https://www.accc.gov.au/consumers/problem-with-a-product-or-service-you-bought/repair-notices

## Correction 9 — uncollected repairs

**OLD omission:** no complete process.

**CURRENT:** NSW uses value-based notice/disposal rules under the Uncollected Goods Act.

### Action

No automatic "30 days = ours" clause.

## Correction 10 — NSW WHS Codes of Practice

**NEW:** from **1 July 2026**, NSW says Codes of Practice are minimum performance standards a PCBU is expected to comply with under s26A.

Source:
- https://www.safework.nsw.gov.au/resource-library/codes-of-practice

### Action

Risk assessments/workshop controls should be checked against current Codes, not treated as optional reading.

## Correction 11 — lithium transport threshold

**NEW detail:** a dangerous-goods driver/vehicle licence is not required solely because lithium-ion batteries are being carried; a **1,000 kg battery-mass** threshold is relevant to placard-load controls.

This is far beyond Phase 0, but transport safety rules still apply below that level.

Source:
- https://www.epa.nsw.gov.au/Your-environment/Dangerous-goods/licensing-training

## Correction 12 — Australia Post lithium shipping

**NEW:** current limits include:

- 20 Wh max per lithium-ion cell;
- 100 Wh max per battery;
- damaged/recalled batteries prohibited;
- additional installed-in-device/quantity rules for air/international transport.

Source:
- https://auspost.com.au/business/shipping/shipping-guidelines/dangerous-prohibited-items

### Action

Do not ship damaged batteries. Check carrier rules per shipment.

## Correction 13 — GST threshold

**OLD:** "$75k as I understand it; confirm."

**CURRENT:** confirmed from ATO: **$75,000 GST turnover**.

Source:
- https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst

## Correction 14 — business-name fees

**CURRENT 2026–27:**

- $47 / 1 year;
- $108 / 3 years.

Source:
- https://business.gov.au/news/changes-for-businesses-from-1-july-2026

## Correction 15 — second-hand GST

**NEW:** if later GST-registered, Division 66 can provide special treatment for qualifying second-hand goods acquired from a non-GST-registered supplier for resale.

### Action

Do not assume donated $0 stock creates the same credit. Get accounting advice before applying Division 66.

## Correction 16 — Painted Brush story

**OLD simplified lesson:** hallway -> shed -> store -> warehouse growth.

**CURRENT 2026 update:** The Painted Brush says its physical studio closed **1 February 2026** and the business moved to a smaller **online-only** model.

Source:
- https://www.thepaintedbrush.com.au/

### Action

The real lesson is **flexible scale**, not permanent growth in premises.

## Correction 17 — grants

**OLD risk:** historical grant programs can look like current startup funding.

**CURRENT:**

- Dubbo Small Business Grant 2026: **closed 14 Sep 2026**;
- EPA Bin Trim Equipment Rebates: **closed**;
- Orana Arts 2026 Small Grants: recipients already announced;
- many 2026 Create NSW individual-project rounds are closed.

### Action

Phase 0 must work without grant money.

## Correction 18 — Bendigo return terms

Bendigo E-Waste's current public product page uses a 7-day DOA / as-is / no-implied-warranty policy.

### Action

Do **not** copy that as the Dubbo NSW consumer policy. ACL guarantees for business sales must be handled independently.

## Correction 19 — Microsoft refurbisher ecosystem

**NEW:** Microsoft's current Authorized Refurbisher program still exists and can support Third Party Refurbishers through MAR partners.

### Action

Do not buy grey-market Windows keys. Investigate a legitimate MAR/TPR route only if refurb volume warrants it.

## Correction 20 — data privacy

**NEW nuance:** small businesses under $3m turnover are generally outside the Privacy Act, but important exceptions exist.

### Action

Do not claim generic "Privacy Act compliant" status without checking the entity/activity/client. Treat unwiped data as sensitive regardless.

## Correction 21 — NotebookLM ITAD guide and older wipe-tool shorthand

**OLD risk:** AI-generated summaries and some earlier repo research used shorthand such as:

- “DoD 5220.22-M or NIST” as equivalent current standards;
- “one-pass HDD / secure-erase SSD” as a universal NIST recipe;
- “ShredOS + nvme-cli = fully NIST compliant”;
- stable nwipe already having native ATA/NVMe secure erase;
- A$19.65 as a stable Blancco per-erasure price;
- locked devices/motherboards being “bricked”.

**CURRENT:** these claims are corrected in:

- [FACT-CHECK-NOTEBOOKLM-ITAD-2026-10-06.md](FACT-CHECK-NOTEBOOKLM-ITAD-2026-10-06.md)
- [claudegaps-research/03-BENCH-TOOLKIT.md](claudegaps-research/03-BENCH-TOOLKIT.md)
- [DEEP-RESEARCH-2026-10-05-EXECUTIVE-SYNTHESIS.md](DEEP-RESEARCH-2026-10-05-EXECUTIVE-SYNTHESIS.md)

### Action

Use NIST SP 800-88 Rev. 2 **Clear / Purge / Destroy** terminology; prefer Purge over Clear where appropriate; use media/device-specific current guidance; retain verification/validation evidence; and never infer compliance from a tool name or completed command alone.

DoD 5220.22-M may appear as a legacy overwrite-pattern label or vendor option but is **not** the current sanitisation compliance baseline.

The project’s **20–30 item pilot** and **Phase 0 damaged-lithium rejection** remain deliberate conservative local policies, not universal industry thresholds.

---

---

# Remaining web limits from 17–32

After this research pass, the genuinely unresolved items are mostly things the public web cannot reliably settle:

- exact insurance premium;
- login/account-specific eBay/Gumtree conditions at time of sale;
- robust average sold prices across each future device category;
- exact courier quotes for each packed item;
- Joe's pre-Bendigo-E-Waste employer/job title and first-year business figures;
- exact historical Painted Brush revenue/costs;
- future grant rounds not yet announced;
- whether Fair Trading's second-hand dealer regime applies to the final exact model — covered by backlog 1–16;
- the final Council/planning decision — covered by backlog 1–16;
- actual pilot economics — only real transactions can answer these.

That is a good boundary: **research has reached the point where the next major business unknowns increasingly require real-world pilot data rather than more generic internet reading.**
