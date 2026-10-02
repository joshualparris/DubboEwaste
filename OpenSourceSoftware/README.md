# Open Source Software for Dubbo E-Waste / ITAD

Research into software used by IT asset disposition (ITAD), refurbishment and e-waste operators, with a focus on free/open-source tools and functionality that could be built in-house.

## Core finding

A mature ITAD operation usually does **not** rely on one application. The normal pattern is a combination of:

1. intake and asset/serial tracking
2. chain-of-custody records
3. hardware discovery and diagnostics
4. data sanitisation
5. refurbishment/imaging
6. repair and parts workflows
7. resale/donation/recycling disposition
8. downstream recycler records
9. customer reports and certificates
10. accounting/marketplace integrations

Commercial products such as MAKOR ERP and RazorERP combine many of these functions. A smaller Dubbo operation could begin with open-source specialist tools plus a thin custom orchestration layer rather than attempting to recreate every specialist system.

## Strong open-source candidates

| Function | Tool | Open source/free | Suggested use |
|---|---|---:|---|
| Asset tracking | Snipe-IT | Yes | Asset register, QR/barcodes, status, location and API |
| ITSM/inventory | GLPI | Yes | Broader service desk + asset system |
| Automated inventory | OCS Inventory NG | Yes | Discover hardware/software automatically |
| Disk health | smartmontools | Yes | SMART/NVMe health capture |
| RAM test | Memtest86+ | Yes | Memory validation |
| Imaging/PXE | FOG Project | Yes | Imaging, PXE, batch refurbishment |
| Disk wiping | nwipe | Yes | Sanitisation engine |
| Bootable wipe environment | ShredOS | Yes | Portable nwipe-based wipe station |
| ERP/business workflow | ERPNext | Yes | Optional accounting/CRM/inventory foundation |

## Best custom-build opportunities

The strongest areas to build ourselves are the **workflow and evidence layer**, not the low-level erase algorithms.

Good custom modules include:

- intake forms
- QR/barcode generation and scanning
- chain of custody
- device event timeline
- test result aggregation
- repair/parts workflow
- reuse / donate / sell / recycle routing
- customer/job/project tracking
- downstream recycler tracking
- weight/mass-balance records
- resale and recovery-value tracking
- Certificates of Destruction / Sanitisation / Recycling
- customer portal
- eBay/API integrations
- audit and evidence exports

## Important design principle

Do **not** invent a custom secure-erasure algorithm.

Use established sanitisation software or manufacturer-supported secure erase methods, then build the workflow around them:

```text
Asset QR
   ↓
Drive serial detected
   ↓
Approved erase method
   ↓
Erase starts
   ↓
Verification
   ↓
Log retained
   ↓
Operator + timestamp recorded
   ↓
Certificate generated
```

See:

- [software-landscape.md](software-landscape.md)
- [assetflow-concept.md](assetflow-concept.md)
- [sources.md](sources.md)

Research captured 2 October 2026.


## Detailed AssetFlow specification

The vendor reverse-engineering pass added a much more complete target design:

- [vendor-workflow-reconstruction.md](vendor-workflow-reconstruction.md) — public MAKOR/RazorERP/Blancco/Phonecheck workflow reconstruction
- [assetflow-software-specification.md](assetflow-software-specification.md) — complete functional specification
- [screen-map.md](screen-map.md) — proposed operator, admin and client screens
- [data-model.md](data-model.md) — conceptual entities and relationships
- [feature-backlog.md](feature-backlog.md) — P0–P3 implementation backlog

### Important additions from this research

AssetFlow now explicitly includes:

- both bulk **lots** and serialized **assets**
- individual **media/drive records** under parent devices
- lot sorting and **mass balance**
- configurable **workstation/station processing**
- customer-specific sanitisation and routing policies
- wipe evidence preservation and hashing
- separate functional/cosmetic grading
- devaluation templates
- automatic/conditional routing
- repair economics
- part harvesting with provenance
- pallets/containers
- outbound/downstream tracking
- settlement and revenue-share workflows
- client Asset Vision / device history
- certificate register and verification
- environmental reporting with explicit methodology
- exception queues
- a visual workflow/rules engine roadmap
