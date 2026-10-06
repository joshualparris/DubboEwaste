# 10 — Environmental impact accounting and green claims

**Questions answered:** 29–30  
**Research date:** 6 October 2026

## 29. What does LCA evidence actually support?

### Strong result: life extension matters

A peer-reviewed commercial laptop-reuse LCA found that:

- the operational activities needed to enable reuse were small relative to the benefit;
- extending use reduced impacts because laptops contain large embedded impacts;
- routing non-reusable laptops to modern recycling added resource/toxicity benefits.

Source:
H. André, M. Ljunggren Söderman, A. Nordelöf, *Resource and environmental impacts of using second-hand laptop computers*, Waste Management 88 (2019).
https://pubmed.ncbi.nlm.nih.gov/31079639/

The EU Joint Research Centre similarly states that extending product lifetime is one of the most effective ways of reducing tech-product environmental impacts.

Source:
https://joint-research-centre.ec.europa.eu/jrc-explains/why-repairability-matters-future-tech-products_en

### But the number is not universal

A 2023/24 real-world preparation-for-reuse LCA found benefits varied by product category and assumptions. Laptops/desktops/monitors showed lower benefits in some scenarios than smartphones.

This is why a universal claim such as:

> “Every repaired laptop saves 300 kg CO2e”

is not defensible.

### Manufacturer footprints illustrate scale and variation

Examples:

- Apple's 2023 14-inch MacBook Pro report gave a **243 kg CO2e** lifecycle footprint, with **79% production** in that configuration/report.
- Lenovo published a ThinkPad P1/X1 Extreme Gen 3 example with a mean estimate around **533 kg CO2e** and a reported 95th-percentile value of 699 kg, explicitly noting modelling uncertainty.

Sources:
- https://images.apple.com/au/environment/pdf/products/notebooks/14-inch_MacBook_Pro_PER_Jan2023.pdf
- https://static.lenovo.com/ww/docs/regulatory/eco-declaration/pcf-thinkpad-p1_x1-extreme-gen-3.pdf

These figures **must not be applied indiscriminately to other models**.

## Environmental hierarchy for reporting

### Level 1 — strongest / measure directly

Report:

- devices received;
- devices returned to use;
- devices repaired;
- devices sold/redeployed;
- devices harvested;
- devices recycled;
- residual;
- kilograms by route;
- average life-extension period where actually known.

Example:

> “42 laptops were returned to use and 96 kg of residual material was sent to [documented receiver].”

### Level 2 — evidence-backed proxy

Use published manufacturer PCF for the **same model/configuration or defensibly close product**, and clearly label it.

### Level 3 — scenario estimate

If estimating avoided production:

`number returned to use × product production footprint × displacement factor`

The **displacement factor** is the hard part.

A used laptop sale does not prove the buyer would otherwise have purchased a new laptop.

Show scenarios such as 25%, 50%, 75% displacement rather than silently assuming 100%.

### Level 4 — do not claim

Avoid unsupported:

- “carbon neutral”;
- “zero waste”;
- “100% recycled”;
- “saves X kg carbon per laptop” without model/method;
- “nothing goes to landfill” without complete downstream mass balance;
- “eco-friendly”/“green” as broad unqualified claims.

## 30. What does ACCC guidance require?

Current ACCC environmental-claims guidance says businesses should:

- make accurate/truthful claims;
- have evidence;
- not hide important qualifications;
- explain conditions;
- avoid broad vague claims;
- make evidence reasonably accessible;
- have a reasonable basis for future claims.

Sources:
- https://www.accc.gov.au/business/advertising-and-promotions/environmental-and-sustainability-claims
- https://www.accc.gov.au/about-us/publications/a-guide-to-making-environmental-claims-for-business

### Recommended Dubbo ITAD public language

Good:

> “We prioritise reuse before recycling. For the period [date–date], 37 of 52 devices received were returned to use. The remaining material followed the documented routes in our impact report.”

Good:

> “Estimated production emissions potentially displaced: X–Y kg CO2e under a 25–50% new-device-displacement scenario, using [specific PCF/method]. This is a scenario estimate, not measured atmospheric emissions.”

Avoid:

> “We saved 10 tonnes of carbon.”

unless the methodology, boundaries, source factors and assumptions really support it.

## Impact ledger to add to AssetFlow

Per asset:

- mass;
- original category;
- final route;
- returned_to_use_at;
- estimated additional service life (only if supportable);
- downstream receipt;
- exact PCF source if used;
- production share if available;
- displacement assumption;
- calculated scenario;
- methodology version.

Portfolio report:

- received mass/count;
- reuse count/mass;
- repair count;
- parts count/mass;
- documented recycling mass;
- unresolved/residual mass;
- data completeness;
- scenario emissions range separately from measured physical outcomes.

## Strongest conclusion

The environmental case for reuse is real.

The trust advantage comes from being **more conservative than competitors**, not from publishing the biggest carbon number.
