# AssetFlow platform backlog

This is the implementation backlog for the broader AssetFlow product. It translates the Recycly, Razor ERP, Blancco, BitRaser and reCore feature comparison into work that is appropriate for DubboEwaste.

Updated: 2 October 2026

## Status legend

- `[x]` Shipped and usable in the application.
- `[~]` Foundation exists, but the complete workflow, automation or integration is still required.
- `[ ]` Not yet built.
- `External` requires a vendor account, hardware, API approval or an external decision.

Do not mark a feature shipped merely because a database field or research note exists. It needs an operator-facing workflow and evidence appropriate to the feature.

## Current priority

### 1. CRM, sales and marketing — START HERE

- `[~]` Customer and source records — basic customer/source records already exist.
- `[ ]` Lead pipeline — lead capture, qualification, owner, next action, stage, value estimate and lost reason.
- `[ ]` Contact history — dated calls, emails, meetings, notes and linked jobs/assets.
- `[ ]` Lead-to-customer conversion — preserve the lead history when a prospect becomes a customer.
- `[ ]` Service/collection opportunity — link a lead to an intake collection, job, quote or recurring program.
- `[ ]` Quote builder — reusable service, collection, processing, resale and downstream line items with expiry and approval state.
- `[ ]` Quote versions — immutable revisions showing who changed the price, scope or conditions.
- `[ ]` Quote-to-job conversion — approved quote becomes an inbound job without re-entering customer or asset information.
- `[ ]` Sales pipeline — qualified, quoted, accepted, scheduled, processing, completed, invoiced, lost.
- `[ ]` Follow-up queue — overdue next actions and reminders visible on the dashboard.
- `[ ]` Marketing consent — record lawful basis, channel, source, opt-in/opt-out and suppression status before campaigns.
- `[ ]` Email templates — operational templates for quotes, collection bookings, certificates, settlement notices and follow-ups.
- `[ ]` Campaign tracking — campaign name, audience, send status, delivery/bounce/unsubscribe evidence; no mass marketing before consent controls exist.
- `[ ]` CRM reporting — conversion rate, quote value, win/loss reasons, source quality, repeat customers and response time.
- `External` Email delivery provider — choose and configure a provider only after consent, privacy and unsubscribe requirements are documented.

Acceptance gate: a staff member can create a lead, record a contact, issue a versioned quote, convert an accepted quote to a job, and prove the communication/consent history without storing unnecessary personal information.

## Category 1 — ITAD ERP and core operations

### Logistics and collections

- `[ ]` Client web booking form with configurable intake questions and appointment windows.
- `[ ]` Collection booking queue with address, contact, access notes, expected count/weight and safety flags.
- `[ ]` Pickup barcode scanning and manifest creation.
- `[ ]` Driver/vehicle assignment, route status and pickup proof.
- `[ ]` Multi-site warehouse inventory, stock receipts, bins and inter-site transfers.
- `[ ]` Workstation/bench stock snapshots synchronized from local processing agents.
- `[ ]` Freight-carrier rate comparison.
- `[ ]` Shipping-label generation and tracking integration.
- `External` ShipStation/carrier APIs, scales, label printers and driver mobile hardware.

### Contracts, compliance and finance

- `[ ]` Customer contract records with service-level agreements, processing constraints and required evidence.
- `[ ]` Client-specific acceptance, retention, reporting and destruction rules.
- `[ ]` Fair-market-value pricing matrices by category, model, specification and grade.
- `[ ]` Defect deductions and grade-linked value adjustments.
- `[~]` Settlement calculator — revenue, fees, freight, parts, labour and customer share exist; approval/finalisation and accounting export remain.
- `[ ]` Invoicing, credit notes, payouts and payment status.
- `External` Xero/QuickBooks integration and accounting chart-of-accounts mapping.
- `[ ]` Compliance report templates by customer, job, weight, route, certificate and downstream evidence.
- `[ ]` Waste-tonnage and regulator export formats where legally required.

### Inventory, resale and reporting

- `[~]` Resale listings and qualification gate — implemented; marketplace synchronisation remains.
- `[ ]` Multi-channel listing synchroniser.
- `[ ]` Refurbished-device storefront/eCommerce catalogue.
- `[ ]` Automatic stock ageing, repricing and stale-stock queues.
- `[ ]` Carbon/impact calculation methodology and customer-facing ESG reports.
- `[~]` Environmental dashboard — measured reuse/recycle/mass metrics exist; methodology-backed CO2e reporting remains.
- `[ ]` Secure JSON API for customers and approved integrations.
- `[ ]` Webhook delivery, retry and signed-event monitoring.

## Category 2 — certified data erasure and sanitisation

### Specialist erasure capabilities

- `[~]` Manual sanitisation records, tools, versions, verification and certificate references.
- `[~]` Certificate register, hashes and public verification foundation.
- `[ ]` NIST SP 800-88 Rev. 2 method mapping with Clear/Purge/Destroy and media-specific applicability.
- `[ ]` Native nwipe/ShredOS report parser and normalized result importer.
- `[ ]` smartmontools/SMART report ingestion.
- `[ ]` SATA, SAS, SCSI, USB, NVMe, OPAL and removable-media evidence adapters.
- `[ ]` HPA/DCO/freeze-lock and remapped-sector result capture where the selected tool supports it.
- `[ ]` RAID and server erasure workflow.
- `[ ]` OOB erasure orchestration for iDRAC/iLO.
- `[ ]` PXE/network boot and mass-station scheduling.
- `External` Blancco, BitRaser or other certified erasure software licensing and export formats.

### Evidence and governance

- `[~]` Tamper-evident certificate snapshots and evidence hashes.
- `[ ]` Signed PDF/XML certificate import and controlled vault storage.
- `[ ]` Certificate issuer, verifier and separation-of-duties controls.
- `[ ]` Prevent the same operator from initiating and independently validating a wipe where policy requires separation.
- `[ ]` Failed-drive/destruction path with chain of custody, witness and destruction evidence.
- `[ ]` Remote sanitisation orchestration only after a local processing agent and safe authentication boundary exist.
- `External` HSM/key-management and vendor certificate validation.

## Category 3 — device management and triage

- `[~]` Triage, lithium/physical/lock evidence and route decisions.
- `[~]` Model lookup and support catalogue.
- `[x]` Asset, media, QR/barcode and audit history foundations.
- `[x]` Functional, cosmetic, battery, completeness and marketability grade records.
- `[ ]` Guided category-specific triage wizard for laptops, phones, tablets, Chromebooks, TVs, monitors, networking and printers.
- `[ ]` Automated hardware discovery adapter for CPU, RAM, storage, battery, display and ports.
- `[ ]` Automated diagnostic import from supported bench tools.
- `[ ]` Seven-component or equivalent uniform defect matrix with lowest-component grade rule, if adopted as the DubboEwaste standard.
- `[ ]` Technician productivity metrics by operator, station, stage, touch time and rework.
- `[ ]` KPI dashboard for throughput, pass rate, wipe rate, route yield, labour return and exception rate.
- `[ ]` Enforced separation of duties across triage, sanitisation and certificate validation.
- `External` Local processing agent, USB/PXE boot, diagnostic hardware, printers and scales.

## Cross-platform integration backlog

- `[ ]` API contract for asset, job, media, sanitisation, certificate, listing and disposition events.
- `[ ]` Import/export adapters for Recycly/Razor-style ERP data.
- `[ ]` Import/export adapters for Blancco and BitRaser evidence.
- `[ ]` Customer portal with customer-scoped RLS.
- `[~]` Customer-scoped API token foundation; issuance and authenticated endpoints remain.
- `[ ]` Marketplace adapters, beginning with an approved channel whose API access is available.
- `[ ]` Offline/mobile warehouse mode.
- `[ ]` Multi-site and cross-site transfer controls.
- `[ ]` Approval matrix for quotes, repairs, write-offs, destruction and settlements.
- `[ ]` Advanced retention policies and scheduled evidence expiry review.

## Recommended build order after CRM

1. Lead/contact/quote pipeline and CRM consent controls.
2. Native nwipe/ShredOS and smartmontools report ingestion.
3. Customer/job booking and collection manifest workflow.
4. Quote-to-job and job-to-settlement finalisation.
5. Local processing agent for discovery, diagnostics and evidence import.
6. Carrier labels, barcode scanning and printer/scale adapters.
7. Customer portal, API tokens and signed webhooks.
8. Marketplace/eCommerce adapters after access and legal terms are confirmed.
9. Multi-site, offline and enterprise governance features.

## Explicit non-goals

AssetFlow should orchestrate evidence, permissions, routing and reporting. It should not implement secure-erasure algorithms, drive firmware commands, cryptographic primitives or undocumented hardware-controller behavior from scratch.
