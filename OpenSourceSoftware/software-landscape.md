# ITAD Software Landscape

## What commercial ITAD platforms reveal

Commercial ITAD platforms are useful as functional references because they show which workflows become important as an operation grows.

### MAKOR ERP

MAKOR markets software specifically for electronics recycling and ITAD. Its advertised workflow areas include:

- CRM/leads and quotations
- contracts and service jobs
- pickups/logistics
- receiving
- serialisation and barcode tracking
- temporary storage/location tracking
- data security
- testing
- repair
- upgrading
- component harvesting
- teardown
- pallet/container tracking
- resale
- downstream disposition
- customer settlements
- certificates and reporting
- customer portal functions

For Dubbo E-Waste, MAKOR is more useful initially as a **feature map** than as something we necessarily need to buy.

### RazorERP

RazorERP is another commercial platform oriented toward electronics recyclers and ITAD businesses. Particularly relevant capabilities include:

- inventory and asset tracking
- grading
- processing workflows
- fair-market-value/resale logic
- service contracts
- customer settlements
- marketplace integrations
- integrations with specialist sanitisation software

It is especially useful as a reference for the resale/value-recovery side of ITAD.

### Phonecheck

Phonecheck is device-focused and demonstrates a useful record model:

- identify device
- capture serial/IMEI
- maintain chain of custody
- perform diagnostics
- perform/record sanitisation
- attach certification to the device record

That same record model can apply to laptops, desktops, drives and other data-bearing assets.

---

# Open-source tools

## Snipe-IT

**Role:** asset management.

Useful existing concepts:

- unique asset IDs
- serial numbers
- manufacturers/models
- asset status
- locations
- custom fields
- QR/barcode labels
- attachments
- REST API

Possible Dubbo E-Waste statuses:

```text
Received
↓
Quarantine
↓
Data-bearing
↓
Wiping
↓
Tested
↓
Repair / Refurbish
↓
Reuse / Donate / Sell / Parts / Recycle
↓
Completed
```

### Recommendation

Investigate Snipe-IT as either:

1. the initial asset database behind a custom front-end; or
2. a reference data model.

Avoid a deep fork unless necessary. API integration or a purpose-built database may remain cleaner.

---

## GLPI

**Role:** IT asset management + service desk.

Relevant functions include:

- assets
- inventory
- tickets
- contracts
- software
- users
- locations
- lifecycle records
- APIs

GLPI may make sense if Dubbo E-Waste evolves into a combined:

```text
ITAD + Refurbishment + Repair + IT Support
```

For a small pure e-waste operation it may be more complexity than needed.

---

## OCS Inventory NG

**Role:** automated hardware/software discovery.

Potential workflow:

```text
Scan asset QR
↓
Boot/agent identifies computer
↓
CPU / RAM / storage / NIC / OS / serial data collected
↓
Data automatically attached to asset
```

This can greatly reduce manual transcription during intake/testing.

---

## smartmontools

**Role:** disk health and identity.

Useful information can include:

- manufacturer/model
- serial number
- capacity
- SMART status
- error history
- power-on hours
- temperature
- SSD/NVMe wear indicators

A custom interface could convert raw `smartctl` output into operator-friendly results.

Example:

```text
Samsung 870 EVO 250 GB
Health: PASS
Power-on hours: 4,821
Errors: 0
Wear indicator: acceptable
Reuse route: eligible
```

The final reuse decision should be based on documented test policy rather than one SMART field alone.

---

## Memtest86+

**Role:** RAM testing.

Could form part of a standard refurbishment test suite alongside:

- storage test
- battery health
- CPU/stability check
- display
- keyboard
- trackpad/mouse
- Wi-Fi/Ethernet
- USB
- audio
- webcam
- charging

Results should feed into the central device record.

---

## FOG Project

**Role:** PXE deployment, imaging and batch processing.

Potential ITAD/refurbishment uses:

- PXE boot
- disk imaging
- operating-system deployment
- inventory collection
- scripted jobs
- disk tests
- memory tests
- wipe tasks
- multicast deployment

This becomes increasingly useful when processing batches of ex-business or ex-school computers.

---

## nwipe and ShredOS

**Role:** data sanitisation.

`nwipe` is an open-source disk wiping tool. ShredOS provides a lightweight bootable environment built around nwipe.

Potential pilot use:

- wipe station
- multiple disk processing
- method selection
- verification
- log capture

### Boundary

Dubbo E-Waste should build the **evidence and workflow wrapper**, not its own low-level erasure algorithm.

For higher-assurance enterprise/government ITAD, commercial products such as Blancco or other independently validated sanitisation tools may still be required depending on customer, contractual, regulatory and assurance requirements.

---

# Functional comparison

| Area | Commercial examples | Open-source starting point | Custom-build suitability |
|---|---|---|---|
| Receiving/intake | MAKOR, RazorERP | Snipe-IT / GLPI | High |
| Barcode/QR tracking | MAKOR, RazorERP | Snipe-IT | High |
| Chain of custody | ITAD platforms | Custom | **Very high** |
| Customer/job management | MAKOR, RazorERP | ERPNext / GLPI | High |
| Hardware discovery | ITAD diagnostics | OCS Inventory | High as integration |
| Storage diagnostics | Commercial suites | smartmontools | High as integration |
| Memory testing | Commercial suites | Memtest86+ | High as integration |
| Imaging | ITAD tools | FOG | High as integration |
| Erasure | Blancco, BitRaser etc. | nwipe/ShredOS | Integrate, don't reinvent |
| Erasure certificates | Commercial tools | Logs + custom reporting | **Very high** |
| Repair workflow | MAKOR | GLPI/custom | High |
| Parts harvesting | MAKOR | Custom | **Very high** |
| Resale inventory | RazorERP, MAKOR | ERPNext/Snipe-IT | High |
| Marketplace integration | RazorERP | eBay APIs | High |
| Client settlements | RazorERP/MAKOR | ERPNext + custom | Medium |
| Weight/mass balance | Recycling ERPs | Custom | High |
| Downstream tracking | Recycling ERPs | Custom | **Very high** |
| Recycling certificates | Recycling ERPs | Custom PDF/reporting | **Very high** |
| Customer portal | MAKOR etc. | Custom | High |

## Bottom line

The specialist utilities are already available.

The gap worth building is a lightweight ITAD orchestration system that answers:

> **What happened to this exact device from the moment it entered our custody until its final reuse, resale, donation, parts harvest or recycling destination?**
