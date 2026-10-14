# USB #13 — verified QNAP file preservation (14 October 2026)

## Outcome
**File-level preservation: VERIFIED. Full raw-device imaging: NOT COMPLETE.**

This record is based on the operator-provided terminal transcript from 14 October 2026. It documents reported commands and outcomes; this GitHub commit does not itself re-run any verification against the NAS or USB.

| Item | Reported result |
|---|---|
| Source device | USB #13, volume label `ESD-USB` |
| Source mount | `/run/media/josh/ESD-USB` (mounted read-only for copy/verification) |
| Device path at time of attempt | `/dev/sda`, partition `/dev/sda1` (DO NOT reuse without checking identifiers) |
| QNAP network share | `smb://10.245.173.111/USB` |
| Backup directory relative to share | `USB13-preservation-20261014/source-files/ESD-USB` |
| Files | 1,274 |
| Total bytes in file tree | 4,052,656,970 |
| Filename sets | Exact match |
| SHA-256 | Every per-file hash matched source against independent QNAP readback |
| Raw device size reported | 30,784,094,208 bytes |
| Raw image | Not acquired — `blockdev` opening `/dev/sda` returned `Permission denied` |
| Device disposition | Safely ejected unchanged |

## Method and evidence
1. Dolphin displayed the authenticated QNAP SMB folder and the local USB.
2. KDE KIO `kioclient` could list the authenticated SMB share; USB source had a regular local mount path.
3. QNAP preservation directory was created. A complete file-tree copy was performed through the existing authenticated KIO session, with source read-only.
4. QNAP copy was read back to a local staging directory `/home/josh/USB13-qnap-readback-20261014`. The initial readback-path check used an incorrect directory name but was corrected.
5. Independent verification reported matching filenames, 1,274 files, 4,052,656,970 bytes, and matching SHA-256 for *every file*.
6. Raw disk image attempt stopped after device permissions denied reading `/dev/sda`; no raw image or compressed image was recorded.
7. USB #13 was safely ejected, reportedly unchanged.

## Remaining work
- [ ] If sector-level/boot-sector/deleted-data preservation is needed, reconnect USB #13 and **reidentify the exact physical device using model, serial, size and `lsblk`** before any imaging. `/dev/sda` is not a stable identity.
- [ ] With local administrator authorization, acquire a read-only whole-device image to a destination with sufficient space (at least 30,784,094,208 bytes before compression), then hash the source/image and independently verify any uploaded QNAP copy.
- [ ] Preserve imaging tool version, commands, hashes, timestamps and device identifiers with the evidence.
- [ ] Decide whether the now-verified file-level backup meets the practical need before undertaking extra imaging.

**Privacy/security:** NAS IP and filesystem paths are operational context; no passwords or credentials are stored here. The QNAP itself is not publicly accessible from this document.
