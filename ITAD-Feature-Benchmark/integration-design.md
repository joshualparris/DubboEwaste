# Integration contracts

All designs here are proposed. Naming an adapter does not mean vendor access exists.

## Common event envelope

`event_id`, `source_system`, `source_version`, `schema_version`, `external_job_id`, `external_asset_id`, observed serial/IMEI/media IDs, `occurred_at`, `received_at`, operator/workstation identity, action, outcome, failure codes, evidence object reference, SHA-256, signature-validation status, policy/version and idempotency key.

Reject unknown customer/asset mappings into a review queue. Retain original bytes before normalising. A hash detects changes against a trusted baseline; it does not prove the producer or make storage immutable. Preserve failed/partial results. Never convert unknown into pass.

| Family | Initial contract | External dependency | Release consequence |
|---|---|---|---|
| Blancco / BitRaser / Ziperase / YouWipe / Certus / Ontrack | Authentic report import before live control | Vendor format/API rights, version, signature trust and licence | Media remains blocked on missing, mismatched or failed result |
| Aiken / MIST | Hardware/test/imaging report | Local network/client software; supported models and export samples | Mandatory tests and media accounting still apply |
| CellDe / NSYS / MobiCode / FutureDial / Apkudo | Device identity, lock, tests and grade events | Vendor entitlement, model support, lookup rights and possibly robotics | Unknown locks or ownership keep resale blocked |
| Recycly / MAKOR / Razor / reVESTED / Total Recall / ITADCollect | Customer/job/asset/report mapping | API agreement; schema; system-of-record decision | No dual-master state or untracked ownership changes |
| ServiceNow / Jira Assets / Alloy | Approved disposal request and evidence-backed outcome | Customer credentials and configured schema/transition mapping | Erasure does not automatically mean retirement; redeployment remains possible |
| ZenAdmin / Unduit / BlueIQ | Recovery request and custody/status exchange | Service relationship, partner access and documented API | Pickup notification does not mean receiving or final disposition |
| Accounting / commerce / carriers | Invoice, reservation, order and shipment events | Provider credentials, rate limits and tax/shipping setup | Retries cannot create duplicate sale, invoice or payout |
| Printers / scales | Scoped local device bridge | Physical hardware, calibration and supported protocol | Preserve raw reading/print result and allow recorded failure |

## Failure acceptance tests

- Duplicate webhook yields one event; invalid signature is rejected.
- Delayed older update cannot overwrite newer verified state.
- Serial conflict is quarantined without changing another customer's unit.
- Batch partial success blocks only unresolved media, and device release still checks all media.
- Credentials expire: queue persists, operator sees failure, retries resume safely.
- Customer deletion/permission change immediately revokes portal and connector access as applicable.
- Report claims success but signature is invalid: evidence remains retained; release denied under policy.
- Manual override needs authorised actor, reason and preserved prior state; cannot manufacture vendor certification.
