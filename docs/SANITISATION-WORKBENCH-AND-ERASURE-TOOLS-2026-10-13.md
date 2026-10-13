# AssetFlow sanitisation workbench: implementation and field-operating guide

**Date:** 13 October 2026  
**Application:** https://dubbo-ewaste-app.vercel.app/sanitisation-workbench  
**Existing controlled media queue:** https://dubbo-ewaste-app.vercel.app/media  
**Code repository:** https://github.com/joshualparris/DubboEwaste

## Explicit safety boundary

AssetFlow is **not an erasure engine**. A browser cannot erase disks from a URL. The links on the workbench are approved-source shortcuts to vendor/project documentation and downloads. Local bootable or properly authorised workstation tooling performs erasure. NIST SP 800-88 Revision 2 (September 2025) is a programme standard, not a certificate automatically granted by typing a dropdown value.

All physical media identification must be established from the actual item. Never use a filename, an operator-entered serial, or a PDF layout as sole proof that an erase succeeded.

## Implemented workflows

1. Asset-level storage inspection. Distinct outcomes: not inspected, no drive at receipt, physical drive present, removed after receipt, or unresolved. No drive at receipt **does not** make the asset 'VERIFIED_CLEARED'. RLS and append-only inspection change history are enabled.
2. Individual HDD, SSD, NVMe, USB etc media registration using existing `media` records. Actual serials and interfaces are recorded per physical medium. No empty media records are invented.
3. Raw text log upload. Accepts .txt/.log/.csv ≤2 MB. Stores the original in existing private evidence storage, computes SHA-256, registers source evidence, and attempts conservative per-drive row matching against the registered serial. Both UNKNOWN and mismatch are explicit outcomes. Not all vendor log formats are supported. **This is candidate extraction, not proven software authenticity.**
4. Independent reviewer control. Submitter cannot self-approve. Approval requires manager/admin programme role, a nontrivial recorded reason, an exact serial match, and an explicit known result. Changes to a completed review are blocked by the database.
5. Database-enforced `PASSED` gate on `sanitisation_tasks`. Requires active sanitisation policy, media serial/interface, method and version, resolved relevant preflight, verification PASS, private original evidence hash, and approved matching review from someone other than the operator. The approved report hash must equal the evidence record hash. Successful task insertion updates the media data state in the same database transaction.
6. Media- and asset-level `VERIFIED_CLEARED` cannot be set without matching successful evidence for registered drives. A SANITISATION certificate cannot be issued when the asset lacks physical media or any registered medium lacks verified PASSED evidence.
7. Certificate snapshots now include the independent report-review metadata and report hash for retrospective audit.
8. Official source shortcuts and warnings for ShredOS, nwipe, smartmontools, nvme-cli, Blancco trial, DBAN legacy and Ventoy.

## Leading Edge intake reconciliation

User confirmed on 13 October 2026 that all eight Leading Edge machines arrived without an HDD/SSD. The matching job DEW-J-2026-00003, asset codes DEW-2026-000076 through -000083 were linked to **NO_MEDIA_AT_RECEIPT**, accompanied by a user-attestation source note, with no false media rows or wipe/certification claims. Their original data-bearing flags and restricted data states were intentionally unchanged. One subsequently attached temporary Hitachi drive was external to the intake and requires independent provenance and verification if it is ever catalogued.

## Practical pilot: first HDD

1. Check ownership/authority to process and the drive's exact serial, model, capacity and interface.
2. Mark the asset's storage presence, then register the actual medium in Media. Keep other drives physically disconnected when practical.
3. Use the workbench to open the official ShredOS release or nwipe release and review its release checksums. Create approved boot media; explicitly confirm the target drive in the erasure tool before any destructive action.
4. Perform a method approved for this drive, source and data sensitivity. For HDDs, nwipe may be appropriate for an approved Clear operation; an overwrite on an SSD does not by itself establish an SSD Purge.
5. Save the original raw per-drive log and any PDF, with serial and outcome visible. Import the raw .txt/.log into AssetFlow. This step does not automatically mark PASSED.
6. Have a different authorised person inspect the original report and serial, verify tool/vendor authenticity and methodology, then APPROVE or REJECT with written reason.
7. Create a named sanitisation policy in the existing Media Queue; select it, complete preflight and record the result. AssetFlow's database will reject missing evidence or method/policy requirements.
8. Only after all media on the asset are verified may a Certificate of Sanitisation be issued; a SHA-256 snapshot is not a digital signature.

## Official links and suitability

- ShredOS releases (free): https://github.com/PartialVolume/shredos.x86_64/releases
- nwipe releases (free): https://github.com/martijnvanbrummelen/nwipe/releases
- smartmontools (free inspection, not erasure): https://github.com/smartmontools/smartmontools/
- nvme-cli (free advanced firmware tooling): https://github.com/linux-nvme/nvme-cli
- Blancco limited free trial (paid beyond trial): https://blancco.com/free-trial/
- DBAN (legacy personal HDD only, no SSD or certifiable report): https://dban.org/
- Ventoy: https://www.ventoy.net/en/download.html
- NIST 800-88r2: https://csrc.nist.gov/pubs/sp/800/88/r2/final

## Limitations and next acceptance tests

- No erasure execution, automatic booting, PXE scheduling or native NVMe/SATA firmware commands from AssetFlow.
- PDF/XML native Blancco report parsing, vendor signature verification, smartctl structured ingestion and automatic nwipe full-version parsing remain unimplemented.
- A free-text nwipe parser uses conservative exact-drive-row heuristics; it must be validated with reports from actual nwipe versions and diverse multi-drive cases before being used for production release decisions.
- Cryptographically signed certificates, HSM keys and vendor trust chains are not implemented. Existing certificate snapshots have hashes and internal verification links, not third-party signatures.
- Need signed-in end-to-end browser test with two distinct authorised accounts: one submitter and one reviewer; check rejection, expired/modified evidence, simultaneous operations and false/PASS release attempts.
- The eight no-media intake records were imported from user-confirmed historical facts, not independently re-inspected by the app. Reinspect before refurbishing.
