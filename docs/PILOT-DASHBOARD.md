# Pilot Dashboard

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **9 October 2026 interpretation:** This is a physical reuse-first pilot scorecard, distinct from software metrics. The private Repair Café reports page records ticket outcomes and attendance separately and may show measured weights; do not sum public Repair Café tickets into donated E-waste asset totals or claim avoided CO₂ without an agreed method. [Software verification](LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md).


Calculate weekly from `pilot-tracker.csv`.

## Core KPIs
- units received
- accepted %
- rejected %
- refurb %
- parts %
- recycle %
- sold units
- median days in stock
- median intake minutes
- median total labour minutes
- median parts cost
- gross sales
- platform/postage/packaging cost
- net profit after labour
- net profit per sold unit
- revenue/profit per labour hour
- return/refund rate
- INAD/fault complaint rate
- repeat supplier count
- downstream recycling cost/rebate
- value recovered above scrap floor

## Quality targets
Use eBay Refurbished Program ceilings as an external benchmark, **not proof of DubboEwaste eligibility**:
- returns: keep well below 10%
- item-not-as-described: keep well below 4%
- unresolved cases: target zero

## Dashboard views
1. **Funnel:** received → accepted → refurb → listed → sold.
2. **Economics:** profit by category/model/source.
3. **Time:** labour and days-in-stock.
4. **Quality:** returns/failures by component.
5. **Source:** yield/profit per supplier.
6. **Rejects:** reason frequency.
