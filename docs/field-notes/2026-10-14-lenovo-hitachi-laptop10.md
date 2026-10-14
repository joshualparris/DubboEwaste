# Lenovo ThinkCentre M710s refurbishment test — 14 October 2026

**Project:** DubboEwaste / Leading Edge eight-computer intake.  
**Provenance:** Josh confirmed all eight received machines were supplied **without HDDs/SSDs**. The testing HDD is **his own former DadLAN Laptop #10 Hitachi 120 GB HDD**, temporarily attached to a Lenovo; it is **not intake-supplied storage**.

## Test machine

- Lenovo **ThinkCentre M710s**, system model **10M7A005AU**, **Intel i5-7400 3.00 GHz (4 cores)**, **8 GB RAM fitted**.
- The test HDD booted **Windows 10 Home build 19045, x86/32-bit**, so Windows only reported about **3.42 GB usable RAM** despite 8 GB physically installed.
- BIOS was in **Legacy** mode; 2018 firmware reported. A later 64-bit OS installation would address the 32-bit RAM limit.
- Windows 11 64-bit was discussed as a test/refurb option, but the **7th-gen i5-7400 is not officially supported for Windows 11**. Do not represent an unsupported Win11 installation as fully supported or automatically suitable for a recipient.

## Protecting the personal source HDD before reuse

- Source **Hitachi HTS543212L9A300**, nominal **120 GB / 111.8 GiB**, original DadLAN Laptop **#10** disk, currently `/dev/sda` only because fitted to the Lenovo.
- Two NTFS partitions observed: **100 MB System Reserved** and **~111.7 GiB Windows**.
- Clonezilla Live **3.3.3-37** booted using Ventoy on **USB #6** (SanDisk Cruzer Edge). Normal Mode graphics glitch was avoided by Ventoy **GRUB2 Mode**, then Clonezilla's 800×600 boot choice.
- Initial direct backup to Josh's personal QNAP NAS on the workplace network did not establish network access; abandoned without creating an image.
- Chosen local fallback: **USB #21** (General UDisk **32 GB / 29.3 GiB**, FAT32), selected as Clonezilla `device-image` repository via `local_dev`, `savedisk` source `sda`, `zstdmt` compression.
- Image directory name: **`2026-10-14-12-img`** on USB #21.
- **Evidence limit:** Last sighted progress copying `sda2` at **4.14% around 12:19 AEDT**; **successful completion, full image integrity and restoration are not yet confirmed**. USB capacity is tight, and FAT32 images must be split into smaller parts.
- **Gate:** No erasure, reformatting, new Windows install or reallocating the Hitachi HDD until the whole-disk image has completed and passed verification.

Canonical technical record, checklist and USB identity: [DadLAN Laptop #10 preservation session](https://github.com/Parris-Tech-Services/DadlanControlCentre/blob/main/docs/backup-records/2026-10-14-dadlan-laptop10-hitachi-to-usb21.md).

**Privacy:** No raw image, personal files, NAS passwords or internal-network IP addresses in this public documentation. Record this HDD as *temporary personal test equipment*, not a drive received from Leading Edge.
