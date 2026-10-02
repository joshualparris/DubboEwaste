# Recall and Traceability System

Every sold device links:
**sale ID → asset ID → serial/IMEI → source → repairs/parts → buyer/contact → sale date/channel**

## Before listing
- search manufacturer recall/service-program pages for the exact model where practical;
- record unresolved safety recall as a stop condition;
- record battery replacement brand/part where replaced.

## Recall watch
Monthly during pilot:
- manufacturer recall pages for stocked/sold models;
- Product Safety Australia recalls;
- battery/charger recalls relevant to replacement parts.

## If a recall affects sold stock
1. identify affected serial/model range;
2. query sale records;
3. contact buyers using retained contact details;
4. give manufacturer/regulator remedy instructions;
5. log contact attempts and outcome;
6. quarantine any affected unsold stock.

## Minimum fields
sale_id,asset_id,serial_imei,buyer_contact,sale_date,model,replacement_parts,recall_checked_date,recall_reference,action_status,contact_log
