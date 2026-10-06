# 04 — Secure regional transport and chain of custody

**Questions answered:** 13–15  
**Research date:** 6 October 2026

## 13. What physical controls are appropriate?

There is no single Australian statute found that says a small ITAD operator must use one particular lockbox/GPS/two-person recipe for every laptop collection.

The defensible model is **risk-based chain of custody**.

### NSW Government benchmark

Contract 9826 requires, among other things:

- recovery of equipment from customer site/staff work location;
- appropriate sanitisation confirmation;
- disposal;
- asset-register updates;
- written customer consent before disposal services occur offsite;
- contractor or third-party processing sites may be audited/inspected/approved;
- devices must not be sent offshore before sanitisation.

Source:
https://www.info.buy.nsw.gov.au/contracts/ict-end-user-devices-and-services

### OAIC physical-security benchmark

OAIC's security guidance asks organisations to consider:

- how movement of physical files/personal information is recorded;
- whether movement/storage is audited/monitored;
- access basis;
- lockable cabinets/storage;
- key control;
- procedures governing transport to offsite locations.

Although written around personal information generally, these principles map directly to an unwiped laptop containing personal information.

Source:
https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/handling-personal-information/guide-to-securing-personal-information

### ASD supply-chain benchmark

ASD guidance identifies:

- tamper-evident seals;
- serial validation;
- manifest confirmation;
- secure transport/storage;
- physical delivery validation.

Source:
https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/gateway-security-guidance-package/gateway-security-guidance-package-gateway-operations-management

### Australian market benchmark

NSW Supplier Hub ITAD profiles show secure logistics/tamper-evident containers as an advertised government ITAD capability. This is useful as a market benchmark, not a universal legal mandate.

Example:
https://buy.nsw.gov.au/supplier/profile/89282

## 14. What should a transport record contain?

### Collection manifest

- job ID;
- customer/source;
- authorised release contact;
- collection site;
- destination;
- date/time;
- operator;
- vehicle/reference;
- container/pallet count;
- expected asset count;
- asset IDs/serials where available;
- data-bearing count;
- battery exceptions;
- seal ID(s);
- source signature/approval;
- collector signature.

### In-transit events

Only record exceptions unless high-security contract requires more:

- unscheduled stop;
- seal change/break;
- vehicle incident;
- count discrepancy;
- custody transfer;
- delay/overnight hold.

### Receipt reconciliation

At destination:

- arrival time;
- receiver;
- seal intact Y/N;
- container count;
- asset count;
- serial/ID exceptions;
- damaged/missing units;
- data/battery exceptions;
- receiving signature;
- incident link if mismatch.

The manifest should be immutable after sign-off except through a correction/event trail.

## 15. Proportionate Phase 0 Dubbo model

For **known-source, 20–30-device pilot collections**:

### Minimum

1. pre-approved pickup/job;
2. source authority recorded;
3. serial/asset list or sealed lot count;
4. data-bearing devices powered off;
5. sturdy opaque lidded containers;
6. numbered tamper-evident seal for any unwiped lot;
7. containers kept out of public view and secured against casual removal;
8. direct trip to approved secure storage;
9. no unattended overnight vehicle storage;
10. arrival reconciliation immediately;
11. discrepancy = incident/HOLD;
12. custody timestamp in AssetFlow.

### Increase controls when risk increases

Use locked cages/stronger containers, GPS/tracking, two-person reconciliation or specialist courier when:

- high-value or high-volume batch;
- health/legal/government data;
- customer contract requires it;
- multiple handoffs;
- overnight route;
- high theft exposure;
- > one vehicle/site;
- customer requires audit-grade logistics.

### What not to do

- loose laptops visible on vehicle seats;
- “I remember there were about 12”;
- mixed customer lots without separable IDs;
- unrecorded handoff to another person;
- unattended trailer/ute tray;
- leave unwiped devices in vehicle overnight;
- change a manifest silently after delivery.

## AssetFlow fields to add/verify

Suggested entity: `shipment`

- shipment_id
- job_id
- source_site
- destination_site
- scheduled/collected/in_transit/delivered/reconciled
- vehicle/carrier reference
- container IDs
- seal IDs
- expected_count
- received_count
- collected_at / received_at
- collected_by / received_by
- discrepancy status
- incident_id

Suggested child event:
`shipment_custody_event`

No GPS integration is justified for Phase 0 unless a customer contract requires it.

## Main conclusion

Secure transport is primarily an **identity-continuity problem**:

> the same assets authorised at pickup must be demonstrably the assets received into controlled storage.

Fancy vehicles do not fix weak manifests.
