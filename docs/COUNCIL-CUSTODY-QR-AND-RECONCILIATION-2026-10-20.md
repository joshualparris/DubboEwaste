# Council pilot — QR chain-of-custody and physical reconciliation

**Date:** 20 October 2026. **Scope:** Up to 20 donation-only devices, subject to an independently signed Dubbo Regional Council agreement. This app does **not** assert Council certification.

## Chain-of-custody operation

1. **Intake identity:** record actual serial and printed AssetFlow asset QR. The collection source must precisely match the site authorised by Council's current signed agreement. Existing device identity and origin cannot be silently changed.
2. **Secure destinations:** record the physical transport container, locked storage shelf, quarantine bay, workshop or recipient handover point. A manager creates an unverified location; another manager verifies the real access/lock safeguards with hashed job evidence before any transfer is accepted.
3. **First collection:** releasing worker opens a request `COLLECTED`, scans the item, reads its serial, identifies an independently authorised receiving worker, destination and original signed paperwork. This is NOT a completed custody event.
4. **Independent acceptance:** the named receiving worker physically checks device/serial and scans the label separately. Only a matching scan, proper source/location, original evidence and current Council/risk authorisation creates a `CONFIRMED` custody movement.
5. **History:** confirmed movements generate a server-calculated SHA-256 hash linked to the prior accepted record, a second-person receipt and a compatibility entry in the old `pilot_custody_events` table. Normal staff cannot delete or rewrite accepted transfers. The hash detects altered record contents **within the application/database trust boundary**; it is not an immutable external notarisation or independent digital signature.
6. **Internal movement:** source must match the ledger's previous verified destination; mismatched or duplicate location transitions are rejected.
7. **Final movement:** the destination must be a verified `EXTERNAL_HANDOVER` site and the purpose explicitly `DONATE` or `RECYCLE`. For donations the separately signed recipient acceptance and sanitisation gates still apply. Recycling requires the verified downstream evidence already built in improvement 1/10.
8. **Physical reconciliation:** scan every device at a verified secure location, upload a signed count sheet or contemporaneous photos, and have the database compare observed labels against the last independently confirmed ledger positions. Duplicate scans cannot count twice. Missing/unexpected labels create OPEN discrepancy records and pause any active Council batch.
9. **Discrepancy closeout:** an independently authorised supervisor who did not report the discrepancy must provide original job-linked SHA-256 resolution evidence, explanation and actual item investigation. An open discrepancy blocks affected releases. Do not invent success by closing records without physical reconciliation.
10. **Exit gate:** both donation and recycling require a complete confirmed `RECEIVED` entry, a matching `HANDOVER` route, no pending handoff, no open discrepancy, and a scanned MATCH physical location reconciliation completed within the preceding seven days. The existing ownership, erasure, safety, Council agreement and risk gates remain in force.

## Actual supported QR labels

The current AssetFlow `AssetQr` QR payload is the asset's URL, while the printed human-readable code is `asset_code`. The new scanner supports both, and a handheld keyboard scanner or manual entry if Android Chromium's `BarcodeDetector` is unavailable. **A scanned label only proves the *label data* matches**, not that it was attached to the correct physical machine. Workers must compare serials and original papers.

## Emergency conditions

- Quarantine and safe return remain possible when Council authorisation is PAUSED or REVOKED, but transfers still require original evidence and an independent acknowledgement to count as *confirmed*. **Physical emergency action must not wait for software**. Stop work, protect people, move equipment when safe and record/document the actual response afterwards.
- Serious injuries, suspected privacy breaches, theft or significant battery fires must be handled using the incident policy and applicable statutory notification routes. This software does not notify SafeWork NSW, privacy authorities, emergency services or Council by itself.
- A hash chain in the same PostgreSQL database is **tamper evident for ordinary operators**, not proof against privileged administrators or deleted database backups. Export and separately preserve signed evidence, audit CSVs and independent reconciliation documents.

## Negative tests required

- Wrong/outdated QR, wrong serial, non-Council asset, draft/paused Council batch, old/expired agreement, absent original receipt and unverified destination: request or acknowledgement rejected.
- Same person initiates and accepts: rejected.
- Another staff member tries to accept instead of the named receiver: rejected.
- Stale last known location, two parallel requests, modification of verified event, forged prev hash: rejected.
- Direct legacy single-person custody entry: rejected.
- Repeated QR in a stocktake: rejected.
- Real missing device/unknown QR: mismatched reconciliation, new discrepancy and active pilot paused.
- A second person closes their own reported discrepancy: rejected.
- DONATE or RECYCLE before verified stocktake, signed handover or complete custody ledger: rejected.
- Council field unchanged: **DRAFT**, zero accepted devices, no fabricated collection activity.

## External requirements

Before collection, obtain Council's actual ownership and contractor constraints, written trial agreement, insurance approval, validated workshop and transport/storage inspections, approved privacy/erasure procedures and a real person-to-person handover process. Obtain and retain signatures or appropriate countersignature of Council representatives; the staff-to-staff acknowledgement in AssetFlow alone is not a Council official's legal signature.

The current documentation and test status appear in the GitHub PR; deployed software does not itself establish Council compliance.
