# AssetFlow Detailed Software Specification

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **Specification versus production (9 October 2026):** This 2 October v0.2 document remains a *design proposal*, not a completed or certified implementation specification. The live Next.js `EwasteApp/` includes AssetFlow modules, CRM, Learning, the Library of Things and separate Repair Café operations. For working routes, migration parity and outstanding QA see [verified product register](../docs/LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md).


Version: research specification v0.2  
Date: 2 October 2026

AssetFlow is a proposed open-source ITAD and e-waste operations platform designed first for a small/regional operator but with architecture capable of scaling into professional ITAD workflows.

---

# 1. Product principles

1. **Reuse before recycling**
2. **Evidence before assertion**
3. **Every serialized asset has a traceable history**
4. **Every data-bearing medium has its own sanitisation record**
5. **Bulk material remains traceable through mass balance**
6. **Routine routing should be automated; exceptions should get human attention**
7. **Specialist security/diagnostic tools should be integrated, not reinvented**
8. **All manual overrides are auditable**
9. **Client-visible evidence is generated from operational records, not manually reconstructed later**
10. **The system must work quickly on a warehouse floor**

---

# 2. User roles

## Warehouse operator
- receive
- scan
- weigh
- sort
- move assets
- capture photos

## ITAD technician
- inventory
- test
- sanitize
- repair
- grade
- harvest parts

## Supervisor
- exceptions
- override routes
- review failures
- close jobs
- approve certificates

## Sales/resale
- qualify inventory
- price
- list
- fulfill
- record sale

## Compliance/auditor
- read audit trail
- verify evidence
- export reports
- inspect mass balance

## Customer/client
- scoped portal access
- job/asset status
- reports/certificates
- environmental reports
- pickup requests

## Administrator
- workflows
- users/roles
- integrations
- templates
- customer policies

---

# 3. Navigation

Proposed main navigation:

- Dashboard
- Jobs
- Receiving
- Lots
- Assets
- Processing
- Media Sanitisation
- Repairs
- Parts
- Resale
- Recycling
- Outbound
- Settlements
- Certificates
- Reports
- Clients
- Locations
- Workflows
- Integrations
- Administration

---

# 4. Dashboard

Operational cards:
- pickups today
- inbound jobs waiting
- assets received today
- assets awaiting wipe
- sanitisation failures
- diagnostics queue
- repairs waiting
- resale-ready
- outbound recycling waiting
- overdue jobs
- unresolved exceptions

Performance:
- devices/hour
- average touch time
- first-pass wipe success
- first-pass test success
- reuse rate
- repair yield
- parts yield
- recycling mass
- recovered value
- average days from receipt to disposition

---

# 5. Job / customer module

## Customer
Fields:
- legal name
- trading name
- ABN
- addresses
- contacts
- billing
- service agreement
- sanitisation policy
- disposition rules
- revenue-share terms
- reporting preferences
- data-retention requirements
- certificate templates
- portal users

## Inbound Job
Fields:
- job ID
- customer
- source site
- contact
- scheduled pickup
- received date
- service types
- work instructions
- expected asset count
- expected weight
- BOL/consignment reference
- destruction type
- priority
- assigned team
- warehouse
- attachments
- photos
- contract/pricing template
- status

Lifecycle:
```text
Draft → Quote → Approved → Scheduled → In Transit → Delivered
→ Partially Received → Received → Processing → Ready to Settle
→ Settled → Closed
```

---

# 6. Receiving

Two receipt modes:

## A. Bulk
Creates lots by:
- commodity
- packaging
- quantity
- weight

## B. Serialized
Creates individual assets immediately.

Features:
- barcode/QR
- scanner keyboard mode
- camera scanning
- quick receive
- repeat previous
- session defaults
- scale integration
- mandatory photos by customer policy
- duplicate serial warnings
- customer asset-tag capture
- printer integration

---

# 7. Lot and mass-balance system

Lot supports:
- inbound origin
- ownership/customer provenance
- commodity
- parent/children
- quantity
- gross/tare/net weights
- location
- pallet/container
- workflow status

Operations:
- split
- merge
- sort
- consume
- serialize items from lot
- move
- outbound
- adjust with reason

Mass balance:

```text
input weight
- serialized assets removed
- outputs from sort
- residual waste
- process loss/variance
= expected balance
```

Configurable tolerance produces warning/exception.

---

# 8. Asset model

Core:
- AssetFlow ID
- QR code
- customer
- job
- originating lot
- category
- manufacturer
- model
- serial
- customer tag
- acquisition/source
- current owner
- current location
- assigned workflow
- current state
- assigned operator
- received timestamp

Dynamic attributes vary by device class.

Important:
A device may contain child components/media.

---

# 9. Media model

Media must be first-class records.

Types:
- HDD
- SATA SSD
- NVMe
- eMMC/UFS where accessible
- USB storage
- SD card
- tape
- other removable media

Fields:
- media ID
- parent asset
- serial
- model
- capacity
- interface
- encryption
- SMART/health
- detected hidden areas if available
- policy
- sanitisation task
- final route

Media can detach from one parent and become independent inventory while retaining provenance.

---

# 10. Sanitisation subsystem

## Queue
States:
- not required
- required
- queued
- running
- verifying
- passed
- failed
- retry
- destruction required
- destroyed
- supervisor review

## Policy engine
Policy decided from:
- customer
- device class
- media type
- requested standard
- condition
- tool capability

## Tool adapter architecture
Adapters may ingest:
- nwipe/ShredOS
- Blancco
- manufacturer commands
- future approved tools

Adapter produces a normalized result.

## Evidence
Retain:
- original report/log
- parsed fields
- source tool/version
- raw report hash
- timestamp
- operator
- workstation
- result
- verification result

## Failure workflow
Failure never silently becomes success.

Options:
- retry approved method
- alternate approved method
- quarantine
- physical destruction
- supervisor exception

---

# 11. Diagnostics

Tests are templates by asset class.

Laptop example:
- POST/boot
- CPU
- RAM
- storage health
- battery health
- display
- keyboard
- touchpad
- webcam
- microphone
- speakers
- Wi-Fi
- Bluetooth
- Ethernet
- USB
- HDMI/video output
- charging
- thermals
- BIOS/UEFI
- physical condition

Result types:
- pass
- fail
- not present
- not tested
- manual review

Automated results and human test results must be distinguishable.

---

# 12. Grading

Maintain independent dimensions:
- functional
- cosmetic
- battery
- completeness
- marketability

Defects can trigger:
- grade devaluation
- dollar devaluation
- repair route
- parts route
- recycling route

The system stores:
- calculated grade
- final grade
- reason for override

---

# 13. Workflow/rules engine

Workflow should be configurable as nodes and transitions.

Node types:
- intake
- data collection
- sanitisation
- diagnostics
- manual checklist
- grading
- repair
- parts harvest
- approval
- resale
- recycling
- outbound
- certificate
- webhook/API

Condition examples:
- data-bearing?
- wipe passed?
- grade?
- repair cost?
- expected resale value?
- device age?
- customer policy?
- hazardous component?
- destination eligibility?

This avoids hard-coding a single conveyor.

---

# 14. Workstation mode

Each physical bench can have a profile.

Examples:
- receiving bench
- wipe station
- diagnostics bench
- repair bench
- grading bench
- parts harvest bench

Profile controls:
- screens shown
- tests available
- printers
- scanners
- connected scales
- local integration agent
- default workflow
- permissions

---

# 15. Repair

Repair ticket:
- asset
- diagnosis
- parts required
- estimated labour
- estimated parts cost
- expected value uplift
- approval threshold
- technician
- actions
- parts installed
- removed parts
- test after repair
- final cost

Auto-rule example:
```text
repair when expected resale uplift > repair cost + configured margin
```

Human approval remains available.

---

# 16. Parts harvest

Harvesting creates traceable child stock.

Part fields:
- part ID
- parent asset
- type
- manufacturer/model
- serial
- specification
- test status
- grade
- location
- value
- route

Parent asset configuration updates after removal.

---

# 17. Resale

Qualification gate requires:
- ownership/provenance cleared
- sanitisation requirements satisfied
- minimum diagnostics complete
- grade complete
- item not quarantined

Listing:
- SKU
- title
- description
- specifications
- photos
- grade
- warranty
- price
- cost basis
- channel

Integrations:
- eBay first
- CSV/feed
- future Shopify/other marketplaces

Sale event:
- channel order
- buyer reference
- sold price
- fees
- freight
- dispatch
- tracking
- return/RMA

---

# 18. Recycling and downstream

For non-reuse route:
- commodity classification
- hazardous classification
- pallet/container
- weight
- storage zone
- downstream vendor
- outbound order
- transport docs
- received confirmation
- downstream certificate/evidence

Support chained downstream destinations if one vendor transfers material onward.

---

# 19. Pallets / containers

Entity:
- pallet/container ID
- type
- tare
- location
- contents
- total weight
- customer segregation
- hazardous status
- seal
- status
- outbound order

Allow scan-to-add and scan-to-remove.

---

# 20. Outbound orders

For recyclers, buyers or transfer locations.

Fields:
- consignee
- destination
- carrier
- pickup time
- BOL
- seal
- lots/pallets/assets
- expected weight
- scale weight
- received confirmation
- pricing
- downstream documents

States:
Draft → Scheduled → Loading → Dispatched → Received → Settled → Closed

---

# 21. Settlement

Models:
- service invoice
- asset purchase
- consignment
- revenue share
- rebate
- mixed settlement

Calculations:
- material revenue
- resale revenue
- service revenue
- scrap value
- freight
- marketplace fees
- parts
- labour
- internal cost
- customer share
- net margin

---

# 22. Certificates

Certificate types:
- Receipt
- Sanitisation
- Destruction
- Recycling
- Reuse/Disposition
- Device History
- Environmental/Sustainability

Certificate metadata:
- certificate ID
- template version
- issuing organisation
- customer
- job
- included assets/media
- issue timestamp
- signer
- hash
- QR verification link
- superseded/revoked state

---

# 23. Client portal

Customer sees only scoped data.

Pages:
- dashboard
- request pickup
- inbound jobs
- assets
- certificates
- sanitisation reports
- outbound/downstream
- resale/consignment
- environmental impact
- files
- API tokens
- portal users

Search:
- serial
- customer tag
- AssetFlow ID
- job
- date

---

# 24. Environmental reporting

Track:
- units reused
- units donated
- mass reused
- mass recycled
- material categories
- destination
- estimated embodied-emissions avoidance only where methodology is explicitly documented

Do not invent sustainability claims.

Every metric needs:
- method
- source data
- calculation version

---

# 25. Audit/event ledger

Every material event:
- event UUID
- entity type
- entity ID
- event type
- timestamp
- user/operator
- workstation
- previous state
- new state
- reason
- evidence references
- request/session ID

Events are append-only from the application perspective.

Corrections create new correction events instead of deleting history.

---

# 26. Exceptions

Central Exception Queue:
- wipe failure
- duplicate serial
- missing ownership evidence
- mass-balance variance
- unknown commodity
- damaged battery
- suspected hazardous condition
- failed diagnostics
- missing customer instruction
- route conflict
- missing downstream evidence
- certificate generation failure

Each exception:
- severity
- owner
- due date
- resolution
- evidence
- approval

---

# 27. Search

Global search should find:
- asset ID
- serial
- media serial
- customer tag
- job
- lot
- pallet
- BOL
- certificate
- SKU
- customer
- downstream order

Barcode scan should work from any appropriate screen.

---

# 28. Reporting

Operational:
- assets by stage
- ageing/WIP
- technician throughput
- wipe success/failure
- repair yield
- reuse yield
- resale margin

Compliance:
- chain of custody
- sanitisation
- certificate register
- mass balance
- downstream chain

Customer:
- receiving
- serialized asset report
- picture report
- settlement
- device history
- environmental impact

---

# 29. Integrations

Priority:
1. QR/barcode printer
2. USB/Bluetooth scanner
3. scales
4. smartmontools
5. nwipe/ShredOS
6. local hardware inventory agent
7. FOG
8. eBay
9. accounting
10. customer/API/webhooks

Architecture:
```text
Browser/PWA
   ↓
AssetFlow API
   ↓
PostgreSQL + object storage
   ↓
Job queue
   ↓
Local Agent
   ├─ scanners/printers/scales
   ├─ smartctl
   ├─ wipe report ingest
   ├─ hardware discovery
   └─ FOG/PXE hooks
```

---

# 30. Security requirements

- MFA for privileged roles
- customer data isolation
- least privilege
- encrypted transport
- secure secrets storage
- signed webhook requests
- tamper-evident logs
- evidence hashes
- session timeout
- export logging
- certificate access logging
- backup + restore testing

Do not store unnecessary recovered customer data from devices.

---

# 31. MVP scope

## MVP 1: operational spine
- customers
- inbound jobs
- receiving
- assets
- lots
- QR
- event ledger
- locations
- processing stages
- basic tests
- disposition
- basic certificates

## MVP 2: ITAD
- media records
- wipe queue
- nwipe/ShredOS import
- SMART import
- grading
- repair
- parts harvesting
- Device History Report

## MVP 3: recycling/resale
- pallets
- mass balance
- downstream
- outbound orders
- resale inventory
- eBay integration
- settlement

## MVP 4: client/compliance
- portal
- rules engine UI
- environmental reports
- API
- advanced certificate signing
- dashboards
