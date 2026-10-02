# Unit economics specification

Use one row per asset. Keep estimates separate from realised figures and never treat a blank field as zero when making a go/no-go decision.

## Core calculation

```text
gross contribution = sale price + recycling rebate
                     - acquisition cost - parts cost - direct costs
                     - platform fee - postage - packaging - returns
                     - recycling cost

contribution per labour hour = gross contribution / (total labour minutes / 60)
```

Include collection time and travel when comparing supply sources. Record whether a value is estimated, quoted, or realised. A device with a positive gross contribution can still be a bad intake if it consumes scarce storage, creates safety exposure, or has no verified route.

## Minimum decision fields

- authority and source type;
- device category and condition;
- triage, repair, sanitisation, listing, packing and return minutes;
- parts, platform, postage, packaging, downstream and other direct costs;
- realised sale price and sale date;
- route if unsold;
- reason for rejecting or accepting again.

## Agent use

Codex may calculate, compare and visualise supplied figures. It must not invent sold prices, quote fees, labour values or environmental benefits. Use `scripts/analyse_pilot.py` for a descriptive summary; use an accountant for tax, GST and financial reporting decisions.
