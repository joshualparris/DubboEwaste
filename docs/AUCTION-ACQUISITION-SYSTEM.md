# Auction Acquisition System

## Never bid from hammer price alone

**Landed batch cost =**
hammer + buyer premium + payment/admin fees + GST treatment + packing + freight + collection travel + expected lock/reject losses + repair parts.

## Expected sellable-unit cost
```
landed batch cost
÷ expected sellable units
```

Expected sellable units must discount:
- untested/non-booting;
- cracked screens/structural damage;
- missing chargers;
- Autopilot/MDM/BIOS locks;
- unsupported CPUs;
- failed batteries/storage;
- parts-only units.

## Maximum safe bid
```
Expected resale revenue
- platform/payment fees
- shipping/packaging
- parts
- labour value
- warranty/return reserve
- desired profit
- freight/premium/admin
= MAX HAMMER BID
```

## Required lot fields
auction_house,lot_url,close_date,location,qty,models,known_specs,condition_text,mdm_release_confirmed,buyer_premium,payment_fee,packing_cost,freight_quote,travel_cost,expected_sellable_pct,expected_parts_value,expected_scrap_value,max_bid,hammer_price,result

## Rules
- “ex-government” does not mean Autopilot/Intune released;
- “untested” is priced as real failure risk;
- no bid without a downstream value floor;
- record final sold/hammer results for four weeks before relying on an auction source;
- Grays/Pickles/Slattery/Manheim each have sale-specific fees and collection terms.
