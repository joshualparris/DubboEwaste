# Research 09: Inventory, software and information architecture

**Research date:** 2 October 2026 (AEST)

**Gap covered:** `codexGAPS.md` section 12: asset IDs, serial/IMEI privacy, photos, custody, sanitisation certificates, repairs, parts, listings, sales, returns, ageing, downstream evidence, backups, retention and export.

**Status:** Phase 0 architecture and tool comparison complete; the proposed schema needs a synthetic-data pilot before any production system is selected.

## Executive decision

Use the existing CSV tracker as the **initial source of truth**, with a protected evidence folder and deterministic asset IDs. Do not install enterprise ITAD software yet.

Move to SQLite only when one or more of these become true:

- more than one person is editing records;
- one asset has multiple media, repairs, parts and custody events;
- photos/certificates are being lost or mismatched;
- reporting requires joins across assets, sales, returns and downstream routes;
- spreadsheet validation is no longer preventing duplicate IDs and missing gates.

Snipe-IT is a plausible later asset-management trial; InvenTree is more suitable for reusable parts and stock; Paperless-ngx is suitable for searchable certificates and supporting documents. None should replace the canonical asset ledger without export, backup, privacy and failure testing.

## 1. System-of-record principles

### One asset, one immutable identity

Assign a sequential internal ID at first custody, such as `DWE-2026-0001`. Never reuse it, even if the device is returned, recycled, split into parts or merged into a bundle. Derived part IDs should retain the donor relationship, for example `DWE-2026-0001-P01`.

The manufacturer serial, IMEI and media serial are attributes, not the primary key. They may be absent, duplicated, unreadable or sensitive.

### Append events; do not rewrite history

A device changes route through events:

```text
received → screened → accepted/held/refused → sanitised → repaired
→ tested → listed → sold/donated/returned → downstream closed
```

Correct a mistaken event with a new correction event. Do not silently overwrite the previous owner, test result, price or custody history.

### Keep the public and private layers separate

Private records may contain donor/buyer contact, full serial/IMEI, certificates, addresses, messages, payment references and photos. Public reports should use asset IDs, redacted identifiers, category, result and evidence references only.

This follows the data/identity controls in [Research 05](RESEARCH-05-DATA-IDENTITY-PRIVACY-SOP.md): a spreadsheet or self-hosted tool is not privacy-safe by default.

## 2. Current repository assets and gaps

The repository already contains:

- `pilot-tracker.csv` for one-row-per-asset outcomes;
- `templates/triage-fields-addendum.csv` for category/lock/battery fields;
- `templates/triage-reject-log.csv` for declined offers;
- ownership/transfer and chain-of-custody templates;
- sanitisation certificates;
- repair notice and sale/recall records.

The missing architecture is the relationship between them. The same `asset_id` must connect:

```text
asset
├── custody events
├── media records
├── triage decisions
├── repair attempts
├── parts harvested
├── sanitisation certificates
├── listings and offers
├── sale/donation/return events
├── complaints/warranty
└── downstream evidence
```

Do not create separate spreadsheets with independently typed asset IDs. That is how a valid certificate gets attached to the wrong item.

## 3. Minimum relational model

The following tables are sufficient for a later local SQLite prototype:

### `assets`

```text
asset_id PRIMARY KEY
received_at, source_type, source_name, authority_reference
category, make, model, revision, serial_hash, imei_hash
current_state, current_route, storage_location
battery_state, lock_state, data_state, safety_state
created_by, updated_at
```

### `events`

```text
event_id PRIMARY KEY
asset_id FOREIGN KEY
event_at, event_type, from_state, to_state
operator, notes, evidence_ref
```

### `media`

```text
media_id PRIMARY KEY
asset_id FOREIGN KEY
media_type, make_model, serial_hash, capacity
encryption_state, sanitisation_state
method, tool_version, started_at, completed_at
verification_result, certificate_ref, disposition
```

### `triage`

```text
triage_id PRIMARY KEY
asset_id FOREIGN KEY
protocol_version, started_at, completed_at
red_flags, lock_checks, battery_result, test_result
initial_route, decision_reason, reviewer
```

### `repairs`

```text
repair_id PRIMARY KEY
asset_id FOREIGN KEY
fault, diagnosis_confidence, guide_ref
parts_cost, freight, consumables
labour_minutes, result, rework_minutes
post_test, final_route, evidence_ref
```

### `parts`

```text
part_id PRIMARY KEY
donor_asset_id FOREIGN KEY
part_number, compatible_models, condition_state
test_result, storage_location, acquisition_cost
harvest_minutes, review_date, sale_route, disposition
```

### `listings`, `orders`, `remedies`

```text
listing_id PRIMARY KEY, asset_id FOREIGN KEY
channel, URL, listed_at, asking_price, status

order_id PRIMARY KEY, listing_id FOREIGN KEY
buyer_reference, sold_at, realised_price, postage
fees, packaging, tracking_ref, payment_state

remedy_id PRIMARY KEY, order_id FOREIGN KEY
opened_at, complaint_type, decision, refund
return_postage, repair_cost, resolved_at, root_cause
```

### `downstream`

```text
downstream_id PRIMARY KEY
asset_id or part_id FOREIGN KEY
provider, accepted_at, route, weight
receipt_ref, certificate_ref, cost, rebate, closed_at
```

The CSV can remain the export/view for the pilot. A database becomes useful because it prevents one asset from having contradictory current states and permits repeatable reports.

## 4. Spreadsheet phase: safe minimum

Until SQLite is justified:

1. keep one protected `pilot-tracker.csv` or spreadsheet as the summary table;
2. use a separate append-only `events.csv` and `parts.csv` rather than adding dozens of columns to one row;
3. validate `asset_id` uniqueness and required release fields before every export;
4. use controlled vocabulary values for routes, states, categories and result codes;
5. store full serial/IMEI only in a protected private sheet or encrypted sidecar;
6. keep evidence filenames deterministic: `DWE-2026-0001/2026-10-02-intake-front.jpg`;
7. never use donor names in filenames;
8. export a dated, read-only snapshot after each intake/sale batch;
9. test a restore from a snapshot monthly;
10. do not place the spreadsheet, raw photos or certificates in the public Git repository.

## 5. Tool comparison

| Option | Good fit | Weakness | Decision |
|---|---|---|---|
| CSV/LibreOffice | one operator, 20–50 pilot assets, offline, easy export | weak relationships, accidental edits, limited permissions | use now |
| SQLite + small local UI/scripts | one operator needing linked events/media/repairs, private/offline, strong queries | needs schema, backup discipline and a UI or SQL skill | prototype with synthetic data |
| Snipe-IT | accountable asset checkout, unique tags, custom fields, web UI | server/admin overhead; less natural for repair events, parts and resale orders | trial only after workflow stabilises |
| InvenTree | parts, suppliers, stock locations, quantities and part relationships | designed around inventory/parts rather than donor custody and ACL sales | use later for a growing parts store |
| Paperless-ngx | local document archive, OCR, tags, certificate/evidence search | not an asset ledger; document permissions/backups still need design | optional companion, not source of truth |
| SaaS inventory/ITAD | multi-user support, integrations and vendor support | cost, privacy, lock-in, internet dependence and mismatch to a tiny pilot | defer |
| partner ITAD system | customer-grade chain-of-custody and certificates | partner ownership, fees, process restrictions and export dependency | use when a partner requires it |

### Why Snipe-IT is a later candidate

Snipe-IT describes itself as a FOSS asset-management system for tracking assets, users, licences and accessories. Its documentation supports unique asset tags and custom fields, which maps well to device IDs and category attributes. It is web-based, so it adds server, authentication, backup and exposure decisions.

Sources:

- [Snipe-IT introduction](https://snipe-it.readme.io/docs/introduction)
- [Snipe-IT managing assets](https://snipe-it.readme.io/docs/managing-assets)
- [Snipe-IT custom fields](https://snipe-it.readme.io/docs/custom-fields)

Use Snipe-IT only if the operator can keep it offline/private or safely secured, export all records, and preserve the asset/event model outside the application.

### Why InvenTree is a later parts companion

InvenTree is an open-source inventory system with part categories, suppliers, stock and integrations. Its model is attractive once the operation has many chargers, RAM sticks, screens and other identified parts, but it should not become the place where authority, sanitisation and buyer remedies disappear.

Sources:

- [InvenTree](https://inventree.org/)
- [InvenTree project overview](https://github.com/Inventree/Inventree)

### Why Paperless-ngx is optional

Paperless-ngx provides local document organisation, OCR, tags, document types and a REST API. It could index scanned authorities, certificates, receipts, recall notices and supplier invoices, but OCR may expose sensitive text and document storage still needs access/backup/retention controls.

Sources:

- [Paperless-ngx](https://docs.paperless-ngx.com/)
- [Paperless-ngx REST API](https://docs.paperless-ngx.com/api/)

Do not feed donor data to optional AI features. Keep the asset ID and document permissions authoritative outside an OCR result.

### Why SQLite is the likely next step

SQLite provides transactional, ACID behaviour and a small local file/database model, suitable for one operator who needs reliable linked records without deploying a server. SQLite permits multiple readers but only one simultaneous writer, which is acceptable for a single-person pilot and a reason not to pretend it is a multi-user ITAD platform.

Sources:

- [SQLite transactional guarantees](https://www.sqlite.org/transactional.html)
- [SQLite transaction documentation](https://www.sqlite.org/lang_transaction.html)

Include the database’s rollback journal/WAL files in backup and restore testing; copying only the main file during an active transaction is not a complete backup strategy.

## 6. Asset-ID and barcode design

### Printed label

Label contains:

- human-readable asset ID;
- a QR/barcode encoding only the asset ID or an internal lookup key;
- no donor name, full serial, IMEI, address or password;
- durable placement that does not cover ventilation, regulatory marks or manufacturer identifiers.

The label is not proof of ownership. It links the physical object to the private record.

### Duplicate prevention

Before creating an ID:

1. check the current tracker and last-issued sequence;
2. generate the next ID in one controlled place;
3. print/attach it before moving the item;
4. photograph the ID next to the device;
5. require the ID in every evidence filename and transfer record.

If a label is lost, do not issue a new asset without a `LABEL-REPLACED` event linking the old and new label evidence.

## 7. Evidence and photo architecture

Directory structure:

```text
private-dubboewaste/
  assets/
    DWE-2026-0001/
      intake/
      triage/
      media/
      repair/
      listing/
      sale-return/
      downstream/
      certificates/
  exports/
  backups/
  retention-log/
```

Minimum photo names:

```text
asset-id/phase-sequence-description.ext
DWE-2026-0001/intake-01-front.jpg
DWE-2026-0001/triage-02-serial-private.jpg
DWE-2026-0001/listing-01-front-redacted.jpg
```

The public listing set must be copied/exported from a reviewed redacted set; never use the private serial photo as the listing original.

## 8. Backups and recovery

Use a simple 3-2-1-inspired policy:

- three copies of the current ledger/evidence where practical;
- two different storage media;
- one copy offline or otherwise isolated from the working device.

At minimum:

1. working encrypted storage;
2. versioned local backup;
3. offline/export copy held separately;
4. monthly restore test using synthetic or redacted data;
5. documented recovery order: ledger → asset folders → certificates → finance/listings;
6. record backup date, scope and restore result.

Do not put private raw data into Git merely because Git supplies version history. Public Git is the wrong backup boundary for donor and buyer records.

## 9. Access, deletion and retention

Access roles for Phase 0:

- `OWNER`: full private records, exports and deletion decisions;
- `HELPER-TRIAGE`: category/testing fields, no donor contact or payment data;
- `HELPER-BENCH`: test/repair fields, no buyer contact or raw personal data;
- `PUBLIC-EXPORT`: redacted reports only.

If there is only one operator, keep the role model in the design so later helpers do not inherit unrestricted access by accident.

Retention is purpose-based and must be confirmed with legal, tax, insurer and partner advice. When a record reaches its end date:

1. identify all copies, exports, thumbnails, cloud recycle bins and backups;
2. check whether a legal/contractual hold applies;
3. securely delete or de-identify the data;
4. record the deletion event without retaining the deleted personal content;
5. keep only the minimum non-identifying statistics needed for impact/learning.

## 10. Export and migration test

Before selecting any application, prove it can export:

- assets and asset IDs;
- event history and custody;
- media/sanitisation records;
- repair and parts relationships;
- listings/orders/remedies;
- downstream evidence references;
- attachments or stable file paths;
- created/updated timestamps and operator identity.

Import the export into a clean test environment and verify that five synthetic assets preserve identity, relationships, evidence links and current state. A PDF report alone is not a migration export.

## 11. Synthetic-data prototype

Build the first prototype with ten fake assets:

- one accepted working laptop;
- one refused locked phone;
- one failed-wipe drive;
- one repaired mini PC;
- one harvested part;
- one sold monitor;
- one returned console;
- one smart speaker with account removal;
- one printer routed to recycling;
- one mixed lot with shared custody and downstream records.

Test these queries:

1. Which assets are still in custody?
2. Which assets are released without sanitisation evidence?
3. Which parts came from a particular donor?
4. Which listings are ageing beyond the review date?
5. Which sold items have an unresolved remedy?
6. Which assets have a safety hold?
7. Which downstream receipt closes each rejected item?
8. Can a certificate be matched to exactly one asset/media record?

The prototype passes only when every query returns the expected synthetic result and a restore reproduces it.

## 12. Recommended implementation order

1. Lock the controlled vocabularies and asset-ID format.
2. Repair the tracker’s missing relationships with append-only event/reject/parts files.
3. Use fake data to test duplicate IDs, redaction, evidence naming and backup/restore.
4. Run the first 20–30-item pilot in the spreadsheet phase.
5. Review the time spent maintaining records.
6. Prototype SQLite only if the relationship/validation pain is real.
7. Compare Snipe-IT for whole assets and InvenTree for parts only after the local model works.
8. Add Paperless-ngx only if certificate/document retrieval is a measured bottleneck.
9. Export and migrate before relying on any hosted or partner platform.

## 13. Acceptance criteria for a system-of-record choice

The chosen system must:

- work offline for intake/bench work or provide a safe offline queue;
- produce unique IDs and prevent duplicates;
- link an asset to many media, events, repairs, parts and documents;
- hide or encrypt sensitive identifiers;
- record operator/time/version history;
- support evidence files without confusing private/public copies;
- export all relationships and attachments;
- survive an accidental delete or device failure;
- support retention/deletion decisions;
- avoid sending donor data to third-party AI or analytics by default;
- be maintainable by the actual operator within the pilot budget.

## 14. Open questions

- How many assets and parts will be active after 30, 90 and 180 days?
- Will helpers or volunteers need access, and which fields should they see?
- Which certificates do prospective B2B partners require, and in what format?
- Does the chosen printer/label workflow work with asset IDs and redacted identifiers?
- Which local/offline backup media can be encrypted and restored reliably?
- Is a Snipe-IT/InvenTree deployment maintainable without exposing the system to the internet?
- Which retention periods apply to receipts, repair notices, ACL remedies, tax records, insurer evidence and donor authority?
- Does a downstream partner require API/export or only a certificate bundle?

## Sources consulted

- [Snipe-IT introduction](https://snipe-it.readme.io/docs/introduction)
- [Snipe-IT managing assets](https://snipe-it.readme.io/docs/managing-assets)
- [Snipe-IT custom fields](https://snipe-it.readme.io/docs/custom-fields)
- [InvenTree](https://inventree.org/)
- [InvenTree project](https://github.com/Inventree/Inventree)
- [Paperless-ngx](https://docs.paperless-ngx.com/)
- [Paperless-ngx API](https://docs.paperless-ngx.com/api/)
- [SQLite transactional guarantees](https://www.sqlite.org/transactional.html)
- [SQLite transactions](https://www.sqlite.org/lang_transaction.html)
- [Research 05: data, identity and privacy SOP](RESEARCH-05-DATA-IDENTITY-PRIVACY-SOP.md)

This is an information-architecture recommendation, not a guarantee of security or compliance. Test the actual implementation with synthetic data and obtain professional advice for privacy, tax, consumer, insurance and partner obligations.
