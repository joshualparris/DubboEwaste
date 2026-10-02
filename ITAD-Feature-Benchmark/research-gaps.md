# Corrections and remaining research

## Corrections to the starting list

- MAKOR and RazorERP are separate operational products.
- Vendor ERPs usually orchestrate and record sanitisation; they do not replace the device erasure engine.
- A Certificate of Sanitisation/Erasure differs from physical destruction and recycling documentation. Use the title appropriate to the evidenced outcome.
- Hashing, signing, tamper detection, immutable retention and independent erasure validation are different controls.
- SSD, cryptographic, mobile and controller-mediated erasure cannot be reduced to a generic overwrite claim.
- NIST SP 800-88 Revision 2 is the current final publication, released September 2025. Use a versioned policy rather than treating all old vendor blog wording as current. [NIST](https://csrc.nist.gov/pubs/sp/800/88/r2/final).
- Lock detection, owner-authorised MDM/Autopilot/activation release and carrier unlocking are different workflows. Do not promise universal OEM lock removal.
- MDM/lifecycle SaaS, ITSM registries, processing tools, managed ITAD services and robotic systems play different roles.
- Jira Service Desk is now Jira Service Management. Generic asset lifecycle support is not proof of native ITAD connectors.
- Ontrack currently documents Blancco-backed erasure support; resolve the actual engine/version before creating a distinct legacy Kroll adapter.
- UK EWC/Digital Waste Tracking features and US/European compliance claims are not automatically Australian requirements or approvals.
- No open-source licence was established for these 25 named products. MIST ITAD Software must not be confused with open-source mist.io.

## Per-product follow-up

All 25 profiles include demo questions. Highest uncertainty: reVESTED's current packaged module scope; MIST availability and performance claims; BlueIQ current partner/API access; YouWipe/Certus supported report schemas; exact erasure standards and model coverage; local mobile-check databases; which Total Recall modules are included; customer-specific ITSM retirement mapping.

Request vendor sample outputs, support matrices, API schemas, licence/add-on schedules and failure demonstrations before estimating connector implementation. Do not contact vendors automatically: this task authorised research and repository publication, not outreach.

## What has not been established

No exhaustive private feature inventories, independent throughput comparisons, commercial quotes, certification-register validation, paid-account screen reconstructions, model-by-model hardware tests, or implementation audit of the existing AssetFlow app. Therefore there is no defensible claim yet that AssetFlow exceeds the union of these products.

## Demo checklist

For each vendor demonstrate: multi-media unit; failed wipe; unreadable serial; duplicate import; locked phone; offline operation; unsupported model; repaired unit; substituted return; revoked certificate; expired connector credential; customer access isolation. Capture version, edition, result, limitation and supporting evidence for each case.
