# AssetFlow: Council donation-only pilot acceptance plan (20 October 2026)

## Claim boundary

This is a **technical readiness control**, not a Council approval, legal opinion, insured activity, independent data-erasure certification, or permission to handle Council materials. No Council property is to be collected without written approval and an accepted scope. The current plan is laptops/desktops/Chromebooks, maximum 20 serialised devices, no sale: fit devices are donated to local community organisations; unfit parts/materials go through a verified downstream route.

**Sources:** Council correspondence 20 October 2026 (held privately, never copy identifiable emails here); NIST SP 800-88 Rev. 2 (Sept 2025): https://csrc.nist.gov/pubs/sp/800/88/r2/final ; SafeWork NSW Codes of Practice update effective 1 July 2026: https://www.safework.nsw.gov.au/resource-library/codes-of-practice .

## Software controls delivered in this change

1. **Governance batch** — use /council-pilot to register one E-waste job, maximum 20 laptop/desktop/Chromebook records. Draft/paused/cancelled arrangements must never be described as approved. Activation refuses absent approval reference and five asset-independent, job-linked evidence documents (written Council acceptance, insurer response, risk assessment, site permission/safety, downstream route). Only E-waste supervisors may activate.
2. **Authority** — each device must have an uploaded hashed asset-linked transfer/donation document, a matching authority record and ownership_verified=true. No blanket permission for all equipment is inferred from a collection conversation.
3. **Safety** — latest triage must ACCEPT, SAFE, no unsafe battery or unresolved locks; electrical safety and functional checks must both have latest PASS. A quarantined device cannot be released. A PASS is a staff assertion and must match actual competent physical tests. Never carry out unlicensed mains electrical work.
4. **Media** — the physical storage presence inspection must be recorded; for real data-bearing media, every registered medium must have independent matching approved original sanitisation evidence, VERIFIED_CLEARED state and a current sanitisation certificate. NIST SP 800-88 Rev. 2 is **guidance for a sanitisation programme**, not a generic certification of nwipe or Blancco. A confirmed no-media device uses a distinct no-media assessment and NON_DATA_BEARING state, *not* a fictional wipe certificate. All internal storage, embedded flash/eMMC and removable media must be included in the assessment.
5. **Chain of custody** — append-only receiving/movement records link operator, time, source/destination, reference and optionally original hashed evidence. Council-batch release requires a receiving record. Records must match physical asset QR/serial and locked storage location.
6. **Recipient** — the community organisation and receiving person's acknowledgement, document reference, condition disclosures and signed/hashed evidence are linked to each asset. An asset cannot be marked DONATED merely by selecting a dropdown. Donation disposition and the final DONATED status change commit in one database transaction; errors return visible blockers.
7. **Export** — authenticated, programme-restricted CSV includes per-device blockers, storage identifiers, custody, recipient organisation and handover reference, with formula injection protection and no public caching. Do not send unnecessary names, email addresses, signatures or media filenames in public summaries.
8. **Security** — all three new tables have RLS and no anonymous rights. Council activation requires E-waste supervisor. The anon-executable storage trigger function was revoked. Other intentionally public SECURITY DEFINER routines and compromised-password detection remain separate review items.

## Production acceptance / go–no-go

Run these before any Council-owned asset is collected:

- [ ] Written Council trial agreement actually signed: list authority/ownership point, rights to collect, any contractor constraints, scope and conditions. Upload the genuine source.
- [ ] Site-specific planning/lease approval, insurance endorsements (public liability, care/custody/control, fire/lithium, privacy and any applicable transit risk), confirmed site safety plan and emergency contacts.
- [ ] Only a named, verified recipient may accept donated assets; disclosure of unsupported OS, hardware limitations, battery health and included chargers is recorded.
- [ ] Named/verified downstream recovery route accepts each rejected stream and can provide proof of receipt and any required serialised destruction record. Do not put failed confidential drives in an ordinary e-waste load.
- [ ] Inspect and label 20 synthetic or known-authority devices and exercise all 20 records; no actual Council ownership is inferred from tests.
- [ ] Try 21st asset: INSERT and job reassignment must fail. Try non-laptop/desktop category: must fail for Council job.
- [ ] Try DONATE with missing title, absent agreement, incomplete triage, failed battery, unverified/unknown/extra drive, missing electrical or function check, quarantine, mismatched/failed wipe, missing sanitisation certificate, missing custody event, missing signed recipient file: **each must fail**. Test a media-free, independently inspected device separately.
- [ ] Two different signed-in roles: admin/manager activation succeeds only when authentic evidence is present; technician and outsider cannot activate; anonymous visitor cannot access documents or Council export; ordinary volunteers cannot view pilot private records.
- [ ] Verify original wipe reports, certificate consistency, media serial, tool/version and operator/reviewer separation on a real HDD and SSD. Independently review for skipped/hidden/embedded media; treat unresolved uncertainty as HOLD.
- [ ] Stop/pause test: Council batch PAUSED blocks DONATE, remains blocked even if all device fields are marked PASS.
- [ ] Reconcile all physical labels, locations, records, recipient receipts and downstream receipts against the 20-device CSV. Investigate missing/duplicate devices and document the outcome.
- [ ] Test backup/restore into nonproduction, user revocation, evidence access, audit/event immutability and incident handling. Record dates/testers/results.
- [ ] Check latest Supabase security and performance advisers, CI build and exact deployed commit. Never claim a green build is a field pass.

## Explicit unresolved conditions

* No official Council approval, insurance policy, planning/lease permission or physical workshop inspection has been furnished to this software change.
* Enabling breached-password detection is a Supabase Auth **project setting** (availability depends on plan); the connector used for this change has no Auth configuration setter. If available, turn on via the project's Authentication password-security settings, then rerun adviser.
* Supabase security adviser may still flag public read-only functions whose anonymous use is intentional (for example a thresholded analytics report) and a one-time ticket redemption endpoint. These require a role-by-role threat-model review; do not globally revoke them or break the public site.
* A certificate record or SHA-256 hash is evidence integrity metadata, not proof of external accreditation. Council controls must be validated against the actual signed agreement.
* Do not change production Auth sign-up/access codes, users' personal data or existing stock states during demonstration. Use fresh authorised test stock, then archive it separately.

## Verification status

Source-level regression checks: automated via \`npm run qa:council-pilot\`. GitHub CI runs \`npm run build\` on pull requests. At commit time, signed-in browser QA, multi-role RLS tests, real media erasure, 20-device physical dry run, restore test, insurer/Council paperwork and downstream handover **remain required**.
