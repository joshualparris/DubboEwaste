# AssetFlow Conceptual Data Model

## Core entities

```text
Customer
 ├─ Site
 ├─ Contact
 ├─ Contract
 ├─ Policy
 └─ PortalUser

InboundJob
 ├─ Pickup
 ├─ Document
 ├─ Lot
 │   ├─ ChildLot
 │   └─ Asset
 │       ├─ Media
 │       │   └─ SanitisationTask
 │       ├─ Component
 │       ├─ DiagnosticRun
 │       ├─ Grade
 │       ├─ RepairTicket
 │       ├─ Disposition
 │       └─ Certificate
 └─ Settlement

Pallet/Container
 ├─ Lot
 ├─ Asset
 └─ OutboundOrder

OutboundOrder
 ├─ DownstreamVendor
 ├─ TransportDocument
 ├─ ReceiptEvidence
 └─ Certificate

Every entity
 └─ Event
     └─ Evidence
```

## Key design decisions

### Asset and Media are separate

A laptop with two drives is one Asset with two Media records.

A drive removed from a laptop can continue independently without losing provenance.

### Lot and Asset are both first-class

A mixed cage of electronics may arrive by weight before every item is identified.

Lots permit:
- mass balance
- sorting
- commodity handling
- downstream recycling

Assets permit:
- serial tracking
- testing
- sanitisation
- reuse/resale

### Components retain provenance

Harvested RAM/SSD/charger records inherit:
- originating asset
- originating job
- original customer/source

### Evidence is immutable-by-reference

Evidence object:
- evidence ID
- type
- source
- filename
- MIME
- object-storage key
- SHA-256
- captured timestamp
- captured by
- parser/tool version
- retention policy

Never replace the original evidence file when parsing it.

### Events provide history

Event types include:
- received
- scanned
- weighed
- moved
- serialized
- media discovered
- wipe queued
- wipe started
- wipe passed
- wipe failed
- test completed
- graded
- repair opened
- part harvested
- listed
- sold
- donated
- recycled
- palletized
- dispatched
- downstream received
- certificate issued
- override
- correction

## Suggested PostgreSQL tables

- customers
- customer_sites
- contacts
- contracts
- policies
- jobs
- job_services
- lots
- lot_relationships
- assets
- asset_attributes
- media
- components
- locations
- location_movements
- pallets
- pallet_contents
- workflow_definitions
- workflow_nodes
- workflow_transitions
- processing_tasks
- diagnostic_templates
- diagnostic_runs
- diagnostic_results
- sanitisation_policies
- sanitisation_tasks
- sanitisation_reports
- grades
- defects
- grade_templates
- repairs
- repair_actions
- harvested_parts
- dispositions
- resale_listings
- sales
- outbound_orders
- outbound_contents
- downstream_vendors
- settlements
- certificates
- certificate_entities
- evidence
- events
- exceptions
- users
- roles
- permissions
- workstations
- integrations
- api_keys
- webhooks

## Identifier strategy

Human-friendly IDs plus UUIDs.

Examples:
- Asset: DWE-A-000184
- Job: DWE-J-2026-0042
- Lot: DWE-L-000731
- Media: DWE-M-001104
- Pallet: DWE-P-000091
- Certificate: DWE-C-2026-00184

Database joins use UUIDs; labels use the readable IDs.
