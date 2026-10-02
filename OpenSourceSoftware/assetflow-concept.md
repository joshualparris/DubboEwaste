# Dubbo E-Waste AssetFlow Concept

Working concept for a lightweight, open-source ITAD orchestration platform.

## Purpose

AssetFlow would not try to replace every specialist utility.

It would provide the central device/job record while orchestrating tools for inventory, diagnostics, sanitisation and imaging.

```text
                      DUBBO E-WASTE
                         AssetFlow
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
        Intake            Processing         Disposition
          │                  │                  │
       QR/Barcode        smartmontools          Sale
          │              Memtest86+           Donation
     OCS Inventory          nwipe               Parts
          │                 FOG               Recycler
          └──────────────────┼──────────────────┘
                             │
                      Asset Event Ledger
                             │
                ┌────────────┴────────────┐
                │                         │
          Customer portal              Reports
                                   CoD / sanitisation /
                                   recycling / recovery
```

## Device record

Example:

### Identity

- Asset ID: DWE-000184
- Manufacturer: Lenovo
- Model: ThinkPad L480
- serial number
- customer/source
- received date
- received by
- current physical location/bin/rack

### Hardware

Automatically or manually capture:

- CPU
- RAM
- storage devices
- storage serial numbers
- GPU
- battery details
- network interfaces
- charger/accessories
- cosmetic grade

### Security

- data-bearing: yes/no
- drive serial(s)
- sanitisation required
- sanitisation method
- software/tool used
- tool/version
- operator
- start/end timestamp
- verification outcome
- raw log/evidence attachment
- certificate ID

### Testing

Possible checklist:

- boots
- RAM
- storage health
- display
- keyboard
- touchpad
- webcam
- speakers
- microphone
- Wi-Fi
- Ethernet
- USB
- Bluetooth
- charger
- battery
- thermals

### Disposition

Final or intermediate route:

```text
REFURBISH
DONATE
SELL
PARTS HARVEST
RECYCLE
RETURN TO CLIENT
QUARANTINE
```

### Financial recovery

- estimated resale value
- parts required
- parts cost
- labour time
- final sale value
- marketplace fees
- freight
- client rebate/revenue share
- net recovery

### Recycling / downstream

For non-reused assets/components:

- material/component category
- weight
- container/pallet
- recycler
- pickup/transfer date
- consignment/reference number
- evidence/document
- final known downstream route

## Event ledger

Every meaningful change creates an event rather than silently overwriting history.

Example:

```text
09:14  Asset received
09:21  Serial recorded
09:33  SSD serial detected
10:02  Sanitisation started
10:48  Sanitisation verified
11:10  Hardware test completed
11:12  Routed to refurbishment
14 Oct Sold
14 Oct Chain of custody closed
      Certificate DWE-2026-00184 generated
```

Useful event fields:

- event ID
- asset ID
- timestamp
- operator
- event type
- before/after state where appropriate
- workstation/tool
- evidence hash
- attachment/log
- notes

## Suggested MVP

### Phase 1

Build only:

1. customers/sources
2. jobs/intakes
3. assets
4. QR labels
5. device statuses
6. chain-of-custody event ledger
7. test checklist
8. sanitisation record
9. disposition
10. PDF certificate/report

This is enough to test whether the workflow works in the real shed/workshop.

### Phase 2

Integrate:

- smartmontools
- OCS Inventory
- nwipe/ShredOS logs
- FOG
- barcode scanner/mobile camera
- bulk CSV import/export

### Phase 3

Add:

- parts harvesting and component relationships
- pallet/container tracking
- weight/mass balance
- downstream recycler records
- resale pricing
- eBay integration
- financial recovery
- customer portal
- automatic certificates
- dashboards

## Possible technical shape

A small web app could use:

- web/PWA interface usable on phone, tablet and PC
- PostgreSQL database
- QR codes linking directly to an asset
- immutable/event-style audit table
- object storage for logs/photos/certificates
- REST API
- worker/agent on local processing PCs for hardware tests
- optional integrations with Snipe-IT/FOG/etc.

A local processing agent could submit signed/test-result payloads to AssetFlow while the main application remains browser based.

## Build versus integrate

### Build

- workflows
- statuses
- event ledger
- QR interface
- job/intake records
- repair workflow
- parts relationships
- disposition
- downstream tracking
- reports
- customer-facing records

### Integrate

- secure erase engines
- SMART interpretation source data
- RAM test engines
- imaging/deployment
- hardware inventory
- marketplace APIs

### Do not casually recreate

- cryptography
- secure-erasure algorithms
- filesystem/storage-controller erase primitives
- hardware diagnostic algorithms where established tools already exist

## Longer-term possibility

If the workflow proves useful, AssetFlow could potentially become a standalone open-source project aimed at small refurbishers, community reuse organisations and regional ITAD operators that cannot justify a large commercial recycling ERP.
