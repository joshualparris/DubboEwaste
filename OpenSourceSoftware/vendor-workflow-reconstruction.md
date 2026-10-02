# Vendor Workflow Reconstruction

Research date: 2 October 2026.

This document reconstructs publicly documented workflows from MAKOR ERP, RazorERP, Blancco and Phonecheck. It is **not** a claim that every private screen or proprietary implementation has been observed. Where public documentation exposes a named screen or workflow, it is recorded directly; where only feature descriptions are public, the likely AssetFlow equivalent is derived and marked as a design interpretation.

---

# 1. RazorERP

RazorERP exposes the clearest public end-to-end ITAD/recycling workflow.

## 1.1 Inbound Orders screen

Public documentation shows order states including:

- Pending
- Scheduled
- Delivered
- Partially Received
- Received
- Settlement Complete
- Cancelled
- Quotes
- Portal Quotes

Useful screen features:

- search/filter
- saved searches
- customisable columns
- work instructions
- service options
- BOL/attachments
- pictures
- internal comments
- onsite contact
- expected material/commodity
- warehouse
- estimated weight
- scheduled date/time
- destruction type
- contract/pricing information

### AssetFlow equivalent

**Screen: Inbound Jobs**

Columns:
- job ID
- customer/source
- site
- scheduled date
- received date
- status
- estimated weight
- actual weight
- service type
- sanitisation requirement
- destruction requirement
- assigned operator
- warehouse/location
- settlement status

Actions:
- Create
- Schedule
- Receive
- Print labels
- Upload documents
- Generate receiving report
- Open client-visible status

---

## 1.2 Receive Order screen

Razor publicly documents:

- order information dialog
- service options
- work instructions
- BOL attachments
- pictures
- internal comments
- quick/common received items
- repeat previous item
- commodity quick-search
- labels
- session defaults for packaging, location, workflow, tare and count

### AssetFlow equivalent

**Screen: Receive Job**

Optimised for very fast floor use.

Features:
- barcode/QR scanner focus
- large touch targets
- saved session defaults
- repeat last line
- quick commodity buttons
- tare presets
- count + gross/net weight
- photo capture
- label print
- route to lot or serialized intake
- warnings if customer instructions require special handling

---

## 1.3 Lot / bulk-material workflow

Razor documents a lifecycle broadly like:

```text
Inbound order
  ↓
Received as lot
  ↓
Optional sort
  ↓
Audit/Test or Outbound
  ↓
Consumed / Resale / further processing
```

A lot records commodity, weight and quantity and remains tied to its inbound order. Sorting can split a mixed lot into more specific child lots.

### AssetFlow equivalent

**Entity: Lot**

Required fields:
- lot ID
- inbound job
- original customer
- commodity
- gross weight
- tare weight
- net weight
- item count
- packaging
- location
- status
- parent lot
- child lots
- source evidence
- chain-of-custody state

**Screen: Sort Lot**
- input lot
- input weight
- output bins/lots
- commodity per output
- tare per output
- output weights
- variance
- mass-balance %
- operator
- sort zone
- photographs
- label printing

---

## 1.4 Audit / ITAD processing screen

Razor's public Audit screen exposes three modes:

1. Standard
2. Quick Scan
3. Commodity

The Standard view contains workflow areas including:
- Data Collection
- Data Erasure
- Grading
- Part Harvest

Its ITAD conveyor further documents:
- Data Wipe
- Data Collection
- Detag
- Grading
- Part Harvest
- Repair
- Completed → Resale or Scrap

The required fields vary by next workflow step.

### AssetFlow equivalent

**Screen: Processing Station**

The station view must be configurable by workflow.

Modes:
- Serialized asset
- Quick scan
- Bulk commodity
- Exception/review

Core layout:
- scanned asset
- parent job + lot
- customer work instructions
- current workflow step
- test/attribute panel
- evidence panel
- next-step recommendation
- manual override with reason
- print label
- photo capture
- exception button

---

## 1.5 Data Wipe screen

Razor documents:
- routing to wipe when drive count is Yes or Not Sure
- discovering actual drive count
- recording individual drives inside the parent computer
- per-drive details/attributes
- labels for each drive

### AssetFlow equivalent

**Screen: Data-Bearing Media**

Parent device can contain zero or many media devices.

Per media device:
- media ID
- parent asset ID
- media type
- make/model
- serial
- capacity
- interface
- encryption state
- sanitisation policy
- sanitisation method
- sanitisation tool + version
- result
- verification result
- failure reason
- operator
- workstation
- start/end times
- raw report
- report hash
- certificate ID

Key feature:
**A computer and its drives must be separate linked records.**

---

## 1.6 Data Collection screen

Razor uses device-type-specific attributes connected to models/categories.

### AssetFlow equivalent

**Screen: Device Data Collection**

Dynamic schema by equipment type.

Example laptop fields:
- manufacturer/model
- serial
- CPU
- RAM
- storage
- GPU
- screen size
- charger
- battery
- Wi-Fi
- webcam
- operating system/licence state
- BIOS/UEFI information
- asset tags
- cosmetic observations

Fields can be:
- required
- optional
- automatically populated
- hidden
- conditional

---

## 1.7 Detag screen

Razor explicitly includes a step for removing existing labels/tags and recording that action.

### AssetFlow equivalent

**Station: Detag / De-identify**

Checklist:
- old organisation asset tags removed
- ownership labels removed
- user-identifying stickers removed
- engraving photographed/escalated if relevant
- BIOS asset tag checked
- device hostname/account remnants checked after sanitisation
- evidence photo optional
- operator/timestamp recorded

---

## 1.8 Grading screen

Razor documents:
- grade letter
- defect options
- defect points
- devaluation templates
- suggested next disposition based on selected defects

### AssetFlow equivalent

**Screen: Grade Asset**

Two separate outcomes must exist:

1. **Functional grade**
2. **Cosmetic grade**

Configurable defect catalogue:
- defect
- severity
- point value
- financial devaluation
- repairability
- routing effect

Outputs:
- evaluated grade
- final grade
- recommended route
- estimated resale value
- estimated repair cost
- expected recovery margin

Manual override:
- permitted only with reason
- recorded in audit trail

---

## 1.9 Part Harvest screen

Razor supports removing parts from a parent asset and tracking them.

### AssetFlow equivalent

**Screen: Harvest Parts**

Actions:
- scan parent asset
- select/remove component
- create component asset/stock record
- inherit provenance from parent
- assign serial where available
- test component
- grade component
- route to stock/resale/recycling
- update parent configuration automatically

Relationships:
```text
Parent Asset
 ├─ RAM module
 ├─ SSD
 ├─ Wi-Fi card
 ├─ charger
 └─ display assembly
```

Every harvested part retains original source/customer provenance.

---

## 1.10 Resale qualification

Razor documents:
- inventory → SKU
- qualification
- description
- price
- marketplace publishing
- order/sale
- sold inventory

### AssetFlow equivalent

**Screen: Resale Qualification**

Fields:
- final test status
- sanitisation status
- grade
- included accessories
- SKU
- listing title
- description
- photos
- cost basis
- asking price
- floor price
- marketplace
- warranty
- postage/freight
- client revenue share
- publish eligibility

Hard block:
**No data-bearing asset may be listed if sanitisation policy is incomplete.**

---

## 1.11 Settlement

Razor exposes order settlement with:
- lot/item values
- fair-market-value concepts
- devaluation
- final grade
- consignment percentage
- settlement reports
- picture reports
- certificate of recycling

### AssetFlow equivalent

**Screen: Customer Settlement**

Per asset/lot:
- gross recovered revenue
- marketplace fees
- freight
- parts
- labour
- service fees
- scrap/material value
- client share
- retained margin
- final payout/credit

Support:
- fixed-price
- consignment %
- revenue share
- service-fee offset
- zero-value recycling
- donation

---

## 1.12 Client Portal

Razor publicly documents portal pages for:
- dashboard
- pickup/order requests
- inbound orders
- outbound orders
- inventory summary
- Asset Vision
- environmental reporting
- files
- resale orders/invoices
- user management
- API tokens

### AssetFlow equivalent

Client portal should support:
- live job status
- asset search by serial/asset ID
- per-device lifecycle
- certificates
- receiving reports
- sanitisation reports
- downstream/recycling documents
- resale/recovery values where contract permits
- environmental impact
- pickup request
- file exchange
- customer-scoped API key

---

# 2. Phonecheck

Phonecheck provides a very strong model for per-device lifecycle processing.

Publicly documented flow:

```text
Receiving
  ↓
Diagnostics
  ↓
Erasure
  ↓
Conditional routing
  ├─ Resale
  ├─ Repair/refurbish → re-grade → resale
  └─ Recycling
```

Phonecheck also documents:
- machine-read intake data
- immutable/timestamped device history
- tester attribution
- lock detection
- battery health
- repair history
- cosmetic grade
- large diagnostic test suite
- signed erasure certificate
- Device History Report
- conditional routing
- remote certification

## AssetFlow features derived from Phonecheck

### Device History Report

Every asset should have a single shareable report containing:

- identity
- provenance
- intake time
- operators/stations
- diagnostic results
- grade
- media/sanitisation status
- repair history
- parts replaced/removed
- disposition
- certificate references
- final closure event

### Rules engine

Example:

```text
IF data_bearing = true
THEN require sanitisation

IF wipe_failed = true
THEN route secure-media-review

IF functional_grade >= B AND repair_cost < threshold
THEN route refurbish

IF functional_grade = A AND sanitation_verified = true
THEN route resale

IF end_of_life = true
THEN route recycling
```

### Exception-first processing

Routine assets should flow automatically.

Operators mainly deal with:
- failed tests
- unknown devices
- missing serials
- locked devices
- wipe failures
- conflicting ownership tags
- expensive repair decisions

---

# 3. Blancco

Blancco's public material provides a model for the sanitisation and evidence subsystem.

Publicly documented capabilities include:
- centralized reports
- erasure status
- digitally signed/tamper-resistant reports
- PDF/XML/CSV/JSON exports depending product/API
- user/role management
- API access
- workflow automation
- fallback erasure
- report sending
- initial grading
- remote erasure
- report search/filter/custom views
- ESG/sustainability dashboard

## AssetFlow features derived from Blancco

### Sanitisation Policy screen

Policy fields:
- policy name
- customer
- asset class
- media type
- required sanitisation class
- approved methods/tools
- verification requirement
- retry/fallback path
- destruction fallback
- certificate template
- retention period

### Sanitisation Operations dashboard

Cards:
- queued
- running
- passed
- failed
- needs review
- awaiting destruction
- certificates generated

Filters:
- customer
- job
- asset
- media serial
- workstation
- operator
- method
- date
- status

### Raw evidence preservation

Never reduce evidence to only a boolean PASS.

Store:
- raw tool output
- normalized parsed result
- cryptographic hash
- ingestion timestamp
- source workstation
- parser version
- original filename/report ID

### Signed certificates

AssetFlow should support:
- internal certificate signing
- verifiable certificate ID
- QR verification URL
- immutable certificate snapshot
- revocation/supersession state
- PDF export
- JSON export for machine use

It must **not** present a home-grown certificate as equivalent to a third-party certified Blancco report.

---

# 4. MAKOR ERP

MAKOR publishes fewer screen-level details publicly, but its feature map exposes mature ITAD/recycling requirements.

Documented feature groups include:
- receipts and certificate generation
- scale integration
- sorting
- serialization
- data security processing
- disposition routing
- received-material validation
- asset barcoding
- high-value part sorting
- testing/repair/upgrade
- configurable work benches
- tracked upgrade/harvest
- compliance plug-ins
- BIOS reader integration
- automated grading
- automated pricing
- pallet tracking
- part harvesting
- teardown
- shred/bale thresholds
- employee productivity
- real-time certificates
- order-specific reports
- detailed audit
- lot mass balance
- COR/COD/COS certificates

## AssetFlow features derived from MAKOR

Add:
- physical scales
- weighbridge/bench-scale capture
- automated weight ingestion
- workbench profiles
- operator productivity metrics
- pallet/container management
- capacity/threshold alerts
- shred/bale batching
- high-value-component queue
- BIOS/firmware reader integrations
- configurable compliance rules
- certificate templates by outcome
- customer/order-specific report templates

---

# 5. Combined target workflow

```text
CUSTOMER / SOURCE
      ↓
QUOTE / CONTRACT / PICKUP
      ↓
INBOUND JOB
      ↓
RECEIVING
      ├───────────────┐
      ↓               ↓
BULK LOT          SERIALIZED ASSET
      ↓               ↓
SORT              DATA-BEARING CHECK
      ↓               ↓
SERIALIZE ←────── MEDIA DISCOVERY
      ↓               ↓
DATA COLLECTION   SANITISATION
      ↓               ↓
DETAGS            VERIFY / CERTIFY
      └──────┬────────┘
             ↓
         DIAGNOSTICS
             ↓
           GRADE
             ↓
       RULES / ROUTING
     ┌───────┼───────────────┐
     ↓       ↓               ↓
  RESALE   REPAIR        PART HARVEST
     │       │               │
     │     RE-TEST           ├─ reusable parts
     │       │               └─ residual recycling
     └───────┴────────┐
                      ↓
                 FINAL ROUTE
          ┌───────────┼────────────┐
          ↓           ↓            ↓
        SOLD       DONATED      RECYCLED
                                  ↓
                             OUTBOUND LOT
                                  ↓
                           DOWNSTREAM VENDOR
                                  ↓
                            EVIDENCE / WEIGHT
                                  ↓
                               CLOSED
```
