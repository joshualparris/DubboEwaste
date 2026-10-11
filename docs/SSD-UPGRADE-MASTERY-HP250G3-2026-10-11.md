# Laptop refurbishment masterclass: HDD-to-SSD upgrade, safeguarding and verification

**Learning standard:** applied workshop training, not a certificate to access somebody's files. Updated 11 October 2026.
**Linked course:** `repair-laptop-refurb` in AssetFlow → Learning hub.
**Case anchor:** HP 250 G3, Intel Core i5-5200U, Windows 10, **HDD confirmed by owner**, RAM and HDD health not yet verified. A name visible in a screenshot is *not* evidence of ownership or consent.

## Competence target

An assessed learner can (1) identify the actual drive and its interface; (2) obtain and record specific authority; (3) discriminate HDD latency from RAM pressure, malware, thermal throttling and file-system damage; (4) choose backup, clone, clean install or specialist recovery; (5) check part compatibility against a model-specific service manual; (6) safely perform or supervise a drive replacement; (7) produce independently repeatable boot, integrity, health and data-handover evidence; and (8) give a fair, realistic quote.

**Not competence:** watching a video, passing a generic quiz, getting into Windows once, or ticking a lesson complete.

## Learning map

1. **Diagnose and protect (before opening).** Evidence, hypotheses, custody, battery, data.
2. **Choose and carry out the method.** Compatibility, backup versus clone versus reinstall, controlled disassembly.
3. **Verify and hand over.** Boot path, SMART interpretation, file checks, disclosure, quote and observed assessment.

### A. Diagnosis: why an HDD-to-SSD upgrade helps, and when it does not

A 2.5-inch SATA HDD typically incurs mechanical seek latency on many small random accesses. A SATA SSD avoids seek-arm delays; it often improves boots, application start-up and responsiveness even on a 2015 CPU. This is **not** a promise of a particular boot time or gaming-frame-rate improvement. The interface, controller, OS, background work and RAM remain constraints. Replacing storage will not fix an unstable power rail, a damaged display or insufficient memory for a task.

**Baseline log, with owner permission:**
- Device make, exact model/product number, assigned asset ID, power state and adapter condition. Do not put personal names, serials or drive data in a public training report.
- Actual drive model, capacity, interface and bay/connector observations. Use Task Manager → Performance → Disk, Device Manager and manufacturer identification; confirm physically against approved instructions if needed.
- Windows or Linux version, firmware mode (UEFI/legacy), boot path and free disk space.
- Subjective symptom stated in owner's words, 3 timed *repeatable* tasks before and after, plus Task Manager disk active time and RAM pressure.
- Read-only SMART summary where possible. Record model and raw/normalised attributes with tool/version and known limitations. A SMART overall "PASSED" is not a guarantee of reliability.
- Check for clicking, repeated I/O resets, pending/reallocated sectors, failed self-tests or unreadable sectors. If failure is plausible, stop ordinary cloning/full-disk testing and seek data-recovery advice before high-stress retries.

**Differential diagnosis:** high active-disk time + low throughput can suggest seek/queue bottleneck; it does not prove a failing HDD. Near-full drive, startup software, RAM paging, indexing, malware, SATA link problems and thermal throttling can produce overlapping symptoms. Propose the *next least-invasive discriminating observation* before replacing parts.

### B. Authority and data boundaries (mandatory gate)

Before a device is opened or read: establish who owns the machine **and** who may authorise access to and modification of its storage. A donated chassis with an unknown-owner HDD is not permission to inspect, copy, overwrite, boot into accounts, or erase that HDD.

Record the customer's choice explicitly:
- **Backup and restore:** copy specified authorised files to independent storage; verify sample files and integrity as appropriate; do not assume cloud sync covers everything.
- **Clone:** preserves an authorised existing OS and partitions where legally and technically possible; a clone also copies old corruption, unwanted software and configuration. Source must be readable; target must fit used partitions/capacity constraints. Some encryption/licensing/partition situations complicate migration.
- **Fresh install:** install a legitimate supported OS onto the **new** SSD; preserve existing HDD untouched until backup/data decision. In October 2026, Windows 10 standard support has ended and this fifth-generation i5 is not on Microsoft's normal Windows 11 support list; consider a suitable supported Linux distribution where practical.
- **Recover/hold:** if drive is failing, encrypted, locked, contested or data rights are unclear, stop and quarantine/refer. No unapproved attempts to defeat locks or recover private data.

**Do not mistake cloning for backup.** A verified independent backup is the resilience measure. For data-bearing devices, source and destination must be identified positively before any destructive operation. A dry run with blank test media is appropriate for novices.

### C. Compatibility: four checks, not just "SSD"

1. **Technology** — HDD vs flash SSD affects performance and sanitisation method.
2. **Form factor** — existing 2.5-inch bay and thickness; bracket, screws and caddy must fit.
3. **Electrical interface** — 2.5-inch SATA uses SATA signalling; a loose M.2 NVMe board is not plug-compatible.
4. **Firmware / mechanical context** — BIOS recognition, UEFI boot mode, available power, connector orientation and physical access.

For the photographed **HP 250 G3**, start at HP's **250 G3 / 256 G3 Maintenance and Service Guide**, not an unrelated HP 250 generation. A 2.5-inch SATA SSD is the likely replacement for the current 2.5-inch HDD, subject to the exact caddy, drive height and service-guide procedure. Record any model-specific screws, battery removal and drive handling procedures before beginning.

For learning, compare the public **Storage Explorer**: https://dubbo-ewaste-app.vercel.app/storage-guide

### D. Safe installation pathway (authorised device only)

1. Read exact model service instructions; check the battery for swelling, case damage or liquid ingress. An unsafe battery is a stop-work condition. No mains-power-supply disassembly.
2. Record the customer-approved plan; verify independent backup and target capacity; capture old-drive condition.
3. Shut down fully, disconnect external power and follow the service manual for battery isolation/removal, ESD handling, case opening and HDD bracket extraction.
4. Photograph screw placement and caddy orientation *without customer data*, transfer bracket to a compatible SSD, and seat SATA connector correctly. Do not force a mismatched plug.
5. Reassemble and boot BIOS/UEFI. Confirm the SSD is detected at the expected capacity. If not: stop, power down and review interface/connection/firmware settings before attributing drive failure.
6. Perform the authorised clone or fresh install; explicitly identify *source and target* twice. Never use a previous owner's drive as a practice medium.
7. Verify OS start, correct firmware boot entry, drive health, device manager, restart/cold boot, ports, network, sleep/wake, battery charging, basic thermal and memory health.
8. If files were migrated, compare a representative sample against the backup/source under explicit authorisation, checking documents/photos and user-critical application settings. Test recoverability rather than assuming a "completed" transfer was valid.
9. Log what remains unknown and make a written handover. Hold the old drive securely for the agreed retention/disposition policy; do not casually wipe, discard or gift it.

### E. Worked repair economics (AU$, fictional only)

A customer has an i5-5200U laptop with HDD. The quotation is **illustrative, not current market pricing**:
- SSD material A$30
- Labour 45 minutes at an assumed A$60/h = A$45
- Consumables/test allowance A$5
- **Cost base: A$80**
- Target gross margin 20% (before GST if applicable): A$80 / 0.80 = **A$100 ex-GST**
- A 20% **markup** would instead be A$96 (only 16.7% gross margin).
- Backup, recovery, unexpected damaged caddy, tax treatment and disposal are distinct quoted issues; data work must be consented. Do not imply a fixed price is warranted without inspecting the device.

**Avoid selling an upgrade if:** the battery is swollen, the HDD is making failure noises and data recovery is unresolved, the screen/power system is unreliable, repair exceeds reasonable useful life or a secure/maintainable operating system cannot be planned.

### F. Advanced cases (do not reveal until you commit your own answer)

**Case 1 — Owner's HP 250 G3, HDD verified, health unknown.** Owner wants faster boots but has family photos. What is your evidence threshold to proceed?
> Worked response: verify authority, inventory device, photograph non-sensitive bay conditions, capture read-only health and a baseline, agree backup/clone/reinstall, make and verify an independent backup, consult exact HP guide, only then approve SSD part and proceed. Stop on failing-media signs or battery safety issues.

**Case 2 — Donated laptop boots to a stranger's Windows desktop.** A volunteer says "we can copy the interesting files then wipe it".
> Worked response: reject the idea. Restricted media; log asset/media identities privately; establish rights and approved chain of custody; do not open files or sanitise without authority and approved workflow. A new blank SSD can be used to diagnose chassis only with appropriate consent and isolation.

**Case 3 — SSD installed; BIOS sees it but "no boot device".** Another technician says it is faulty.
> Worked response: compare target device, UEFI/legacy mode, EFI system partition, boot order and whether an OS or bootloader was actually installed; check connector and firmware first. Do not erase the old drive to "test" anything. A detected storage device with no bootloader is not necessarily faulty.

**Case 4 — HDD SMART self-test errors, owner wants an immediate clone.**
> Worked response: explain that repeated reads and retries can worsen recoverability; stop nonessential testing, ask the owner about data value and criticality, and refer to a recovery specialist if appropriate. Never run a casual destructive diagnostic.

**Case 5 — A 256 GB SSD quote for a 500 GB HDD.** The owner has 300 GB used.
> Worked response: raw used volume does not fit the target. Agree files reduction and independent backup or purchase sufficient capacity. Partition shrink is not guaranteed; account for EFI/recovery partitions, alignment and spare free space. Do not start a clone and hope.

### G. What an assessor must see

A reviewer should request these **redacted** artefacts, not merely a learner's "I did it":
- Intake and authorisation checklist with clear ownership/data decision.
- Diagnostic decision log: symptoms, two competing hypotheses, discriminating observations and stop-work points.
- Exact device and drive interface compatibility justification, citing model manual.
- Backup/clone/install plan naming risks and rollback; *never include private contents*.
- Pre/post evidence with three repeatable tasks, relevant health data, detection and boot verification.
- A clear invoice/quote calculation, disclosure of uncertainty and handover/disposition of old drive.

**Rubric (each 0–3, /18 total):** consent/data custody; diagnostic reasoning; part compatibility; procedural safety; verification/evidence; communication and economic judgement. Score **at least 15/18**, **no zero** in consent or safety, and satisfactory directly observed practical handling for a supervised mastery claim. An online simulation is **practice**, not proof of hardware competence.

### H. Spaced retrieval

Without notes: next day, day 3, day 7, day 21, describe the decision tree and two reasons a successful Windows boot can still hide a failed repair. Interleave a healthy HDD case, a failing HDD case, and an unknown-owner drive case. Make the next review focus on previous misses, not memorising the correct letter.

### Sources and learning media (verified 11 October 2026)

- HP 250 G3 / HP 256 G3 Maintenance and Service Guide (select PDF): https://support.hp.com/au-en/product/setup-user-guides/hp-250-g3-notebook-pc/6732462
- iFixit 2.5-inch SATA drive replacement *for a different HP model* (visual reference, **not** your device's service instructions): https://www.ifixit.com/Guide/hard+drive+replacement+(2.5-inch+SATA)/145417
- Crucial video **Copy**, 2019 (a vendor-specific workflow; verify current tools and encryption): https://www.youtube.com/watch?v=pQw4E8ecL5c
- Crucial video **Install**, 2019 (generic SATA techniques; follow your model's manual): https://www.youtube.com/watch?v=dy7An1DkieQ
- Microsoft Windows recovery options: https://support.microsoft.com/en-us/windows/experience/backup-recovery/recovery-options-in-windows
- Microsoft reinstall media preparation and backup warnings: https://support.microsoft.com/en-US/Windows/deployment/install-upgrade/reinstall-windows-with-the-installation-media
- smartctl reference: https://manpages.debian.org/testing/smartmontools/smartctl.8.en.html
- Podnutz **Computer Repair Podcast #228**, technician conversation about the boundaries of hardware repair vs software problems (contextual listening; **not** an SSD procedure): https://podnutz.com/podnutz228/

Last verified means the named pages were retrieved, not that external links are guaranteed to remain live.
