# AssetFlow Feature Backlog

Derived from MAKOR, RazorERP, Blancco and Phonecheck research.

Legend:
- P0 = essential operating spine
- P1 = high-value next
- P2 = scaling/automation
- P3 = mature-enterprise feature

## P0

- [ ] Customers/sites/contacts
- [ ] Inbound jobs
- [ ] Work instructions
- [ ] Attachments/photos
- [ ] Quick receiving
- [ ] Bulk lots
- [ ] Serialized assets
- [ ] QR/barcode labels
- [ ] Locations
- [ ] Device timeline/event ledger
- [ ] Dynamic device attributes
- [ ] Data-bearing flag
- [ ] Separate media records
- [ ] Manual sanitisation record
- [ ] Basic diagnostics checklist
- [ ] Grade
- [ ] Disposition
- [ ] Reuse / sale / donation / parts / recycle routes
- [ ] Basic certificate PDF
- [ ] Global serial/asset search
- [ ] Exception queue
- [ ] Role permissions

## P1

- [ ] nwipe/ShredOS report ingestion
- [ ] raw wipe evidence retention + hashes
- [ ] smartmontools ingestion
- [ ] automated hardware discovery
- [ ] sanitisation policies
- [ ] wipe retry/fallback workflow
- [ ] Device History Report
- [ ] repair tickets
- [ ] parts harvesting
- [ ] component provenance
- [ ] cosmetic + functional grades
- [ ] defect/devaluation templates
- [ ] automatic routing recommendations
- [ ] pallets/containers
- [ ] lot splitting/sorting
- [ ] mass balance
- [ ] downstream vendors
- [ ] outbound orders
- [ ] downstream evidence
- [ ] Certificate of Recycling
- [ ] Certificate of Destruction
- [ ] Certificate of Sanitisation
- [ ] receiving report

## P2

- [ ] visual workflow editor
- [ ] rules engine
- [ ] automatic routing
- [ ] configurable workstation profiles
- [ ] local processing agent
- [ ] scale integration
- [ ] printer integration
- [ ] FOG integration
- [ ] BIOS/UEFI data integration
- [ ] automated pricing
- [ ] resale qualification gate
- [ ] eBay API
- [ ] sale/fees/freight
- [ ] returns/RMA
- [ ] settlement
- [ ] consignment/revenue share
- [ ] environmental dashboard
- [ ] productivity dashboard
- [ ] WIP ageing
- [ ] processing throughput
- [ ] customer portal
- [ ] Asset Vision
- [ ] customer-scoped API tokens
- [ ] webhooks

## P3

- [ ] cryptographic certificate signing
- [ ] public certificate verification endpoint
- [ ] remote sanitisation orchestration
- [ ] enterprise SSO
- [ ] advanced retention policy
- [ ] multi-site warehouses
- [ ] cross-site transfers
- [ ] approval matrix
- [ ] automated client-specific report packs
- [ ] sustainability methodology/version registry
- [ ] reusable workflow/template marketplace
- [ ] high-volume batch station management
- [ ] advanced employee productivity metrics
- [ ] destruction/shred/bale capacity thresholds
- [ ] mobile warehouse app / offline mode

## Explicit non-goals

Do not build from scratch:
- secure-erasure algorithms
- cryptographic primitives
- drive firmware commands
- SSD controller internals
- hardware diagnostic algorithms already provided by mature open-source tools

AssetFlow owns orchestration, evidence, routing, traceability and reporting.
