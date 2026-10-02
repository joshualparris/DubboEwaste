# Refurb Economics Calculator

## Per-device model

Inputs:
- acquisition cost
- collection/freight allocation
- intake labour minutes
- wipe/test labour minutes
- repair labour minutes
- parts cost
- packaging
- postage
- platform/payment fee
- expected warranty/return reserve
- downstream cost or rebate if unsold
- expected sale price
- labour hourly value

Formulas:
```
labour_cost = total_labour_minutes / 60 * hourly_value

net_sale_proceeds =
sale_price
- platform_fee
- postage
- packaging
- warranty_reserve

net_profit =
net_sale_proceeds
- acquisition_cost
- collection_allocation
- parts_cost
- other_direct_cost
- labour_cost

revenue_per_labour_hour =
net_profit / (total_labour_minutes/60)
```

## Maximum acquisition price
```
max_acquisition =
expected_sale_price
- fees
- shipping
- packaging
- parts
- labour
- warranty_reserve
- target_profit
```

## Route comparison
For every intake, compare:
1. refurb whole;
2. sell as-is/repair;
3. harvest parts;
4. scrap/recycle.

Choose the highest **risk-adjusted** value, not the highest headline price.

## Minimum evidence
A category should not be expanded until the pilot shows:
- repeat supply;
- positive net profit after labour;
- acceptable return rate;
- manageable days in stock;
- known downstream route.
