# 03 — Diagnostic and wipe bench kit

**Answers:** `claudeGAPS.md` §3 (3.1–3.6)
**Researched:** 2 Oct 2026. GitHub repo facts were pulled live with `gh api` on that date.

---

## Bottom line

A capable **open-source** bench kit costs **$0 in software**. Every core tool below is GPL-licensed, actively maintained (commits within the last week) and had a release in 2025–26. The hard part isn't buying software. It's following **NIST SP 800-88 Rev. 2's rule that flash media (SSD/NVMe) needs the drive's own sanitize/secure-erase command**, not just an overwrite, and **recording verification**.

Paid suites (Blancco, Phonecheck) mainly buy *audit-grade certificates and automation*. They only become worth it when business clients ask for them.

---

## 3.1 Free USB triage stick: component check

| Tool | Role | Licence | Latest release | Activity | Notes |
|---|---|---|---|---|---|
| **Ventoy** | Multi-boot USB; drop ISOs on it | GPL-3.0 | v1.1.17 (2026-07-24) | 79.7k★, pushed 2026-09-30 | One stick holds ShredOS, a Linux live ISO and MemTest |
| **ShredOS** | Boots straight into nwipe | (no SPDX tag) | v2025.11_31 … _0.42 (2026-07-16) | 3.2k★ | Wipe many drives in parallel unattended |
| **nwipe** | Disk wipe engine | GPL-2.0 | v0.42 (2026-07-15) | 1.2k★ | Methods include zero/one fill, PRNG, DoD, Gutmann, HMG IS5, **Verify Zeros/Ones**; generates a **3-page PDF certificate** with drive serial and SMART data. v0.43 adds hardware-native secure erase. **Its own docs warn that an overwrite isn't enough for SSDs: run the drive's secure erase, then at least one PRNG pass.** |
| **nvme-cli** | NVMe `sanitize` / `format --ses` / `id-ctrl` capabilities | GPL-2.0 | v3.1 (2026-09-18) | 1.9k★ | The standard way to issue NVMe Sanitize (block erase / crypto erase) |
| **smartmontools** (`smartctl`) | Drive health: reallocated sectors, power-on hours, wear level | GPL-2.0 | 7.5 (2025-05-12) | 1.4k★ | Reject or downgrade drives with reallocated/pending sectors or wear over 80% |
| **stress-ng** | CPU/RAM/thermal load test | GPL-2.0 | V0.22.01 (2026-09-20) | 2.8k★ | 10-minute load reveals fan/thermal-paste faults |
| **MemTest86 Free** (PassMark) | RAM test | Free edition, no usage restrictions per vendor | — | — | Free edition supports up to 16 cores. Pro adds reports/automation, licensed per concurrent machine. https://www.memtest86.com/compare.html |
| `hdparm` | SATA ATA Secure Erase, HPA/DCO detection | GPL | — | — | Used by nwipe for HPA/DCO detection |
| `lshw`, `inxi`, `upower`, `dmidecode` | Hardware inventory, battery, serials | GPL | — | — | `dmidecode -s system-serial-number` gives the serial for the asset record |

Sources: `gh api repos/<repo>` results on 2 Oct 2026; nwipe README https://github.com/martijnvanbrummelen/nwipe ; MemTest86 editions https://www.memtest86.com/compare.html

### Proposed stick layout (to build and time in the pilot)
1. `ShredOS` ISO, for unattended bulk HDD wipes.
2. A current **Linux live ISO** (any mainstream one) with `nvme-cli`, `smartmontools`, `hdparm`, `stress-ng`, `lshw`, `upower` installed. This is the interactive triage and SSD sanitize environment.
3. `MemTest86` image.
4. Windows install media (for resale reinstall; see 2.1 licensing).

**[Open — TRY]:** time a full triage + wipe on three machine types (SATA SSD laptop, NVMe laptop, HDD desktop) and record the results in `templates/triage-fields-addendum.csv`.

---

## 3.4 Verification: what "proving the erase" means under NIST Rev. 2

From published summaries of **NIST SP 800-88 Rev. 2 (26 Sep 2025)**:
- **One overwrite pass is enough for magnetic HDDs** (Clear). Multi-pass is unnecessary.
- **Flash (SSD/NVMe):** overwrite may not reach remapped/over-provisioned blocks, so **use the device's native sanitize/secure-erase commands**.
- **Crypto-erase counts as Purge** only if encryption covered the data for its whole life, the key destruction is verifiable, and the implementation is trustworthy.
- Rev. 2 **separates verification** (did this erase succeed?) from **validation** (is this method proven for this device class? A documented, program-level approve/reject decision). **Sampling requirements were removed**; the organisation sets its own policy.
- Technique details now point to **IEEE 2883-2022**.

Sources **[Secondary]** (vendor summaries of the NIST text): https://blancco.com/resources/blog-nist-800-88-rev-2-updated-standard/ ; https://www.bitraser.com/blog/nist-800-88-rev-2-vs-rev-1/ ; https://www.drivewipe.com/standards/nist-800-88-rev-2

### [Derived] Dubbo verification procedure (v0.1)

| Media | Sanitize | Verify | Record |
|---|---|---|---|
| HDD (SATA) | nwipe single PRNG or zero pass (or ATA Secure Erase) | nwipe "Verify Zeros" or the built-in verify pass | nwipe PDF + serial |
| SATA SSD | `hdparm` ATA Secure Erase (Enhanced if supported), **then** one nwipe PRNG pass (per nwipe's SSD guidance) | Read back a sample of sectors (start/middle/end) and confirm the pattern; record `smartctl` before/after | Command log + nwipe PDF |
| NVMe SSD | `nvme sanitize` (crypto or block erase per `nvme id-ctrl` capabilities) or `nvme format --ses=1/2` | `nvme sanitize-log` shows completion; sample read-back | sanitize-log output + serial |
| Apple T2 / Apple Silicon Mac | Erase All Content and Settings / Recovery erase (crypto-erase of the always-on encrypted SSD) | Device boots to Setup Assistant; Activation Lock Disabled | Screenshot + serial |
| iPhone / Android | Factory reset with accounts removed (devices are encrypted by default, so reset = crypto-erase) | Setup screen with no FRP/Activation Lock prompt | Photo + IMEI |
| Network gear | `write erase` / factory reset | Boot shows default config | Config-reset note |
| **Fails any step** | — | — | **Remove the media → DESTROY route** (repo rule) |

**Validation (Rev. 2 sense):** before the pilot, test each method once per media class by writing known data, sanitising and then attempting recovery (e.g. with `photorec`/`testdisk`). Keep that record as the program-level "Approve" evidence. **[Open — TRY]**

---

## 3.2 / 3.3 Commercial suites: what's public

| Product | Public pricing | Notes |
|---|---|---|
| **Blancco** | SMB Select 50 bundle about **A$982.30** (AU reseller; already in repo), i.e. about A$19.65/erasure | Audit-grade certificates. ADISA-certified products (already in repo). Buy only when B2B clients require named-vendor certificates |
| **Phonecheck** | **Not public**: "request a demo", bulk/volume pricing, aimed at operators processing hundreds to thousands of phones a month | 80-point diagnostics, lock detection, battery health, authenticity, erasure, Device History Report. Used by AU refurbisher OzMobiles. https://www.phonecheck.com/ ; https://ozmobiles.com.au/blogs/smartphones/what-is-phonecheck-certification-and-why-it-matters-when-buying-a-refurbished-phone |
| Other mobile suites | Not researched in depth: NSYS, BlackBelt, FutureDial, Apkudo (named as the industry's core vendors) | https://secondarymarket.news/blog/diagnostics-software-smartphone-recommerce/ |
| PC-Doctor, PartedMagic, KillDisk | Not verified this pass | 🔎 |

**Free phone diagnostics:** Samsung `*#0*#` hardware test menu (see 02), Samsung Members diagnostics, Apple Diagnostics (via Apple support for iPhone; hold D at boot on Intel Macs, or a Recovery option on Apple Silicon). **[Derived]**: enough for Phase 0 volumes.

---

## 3.5 Minimum hardware bench (estimates; prices not quoted)

| Item | Why | Indicative cost |
|---|---|---|
| Precision driver kit (Torx, pentalobe, Phillips 00/000, tri-wing) + spudgers + suction cup | Open laptops/phones without damage | ~A$80–150 (iFixit Pro Tech Toolkit ~US$80) |
| ESD mat + wrist strap | Static protection for boards/RAM | ~A$30–60 |
| USB-C PD tester / USB power meter | Confirms charging negotiation and charger output | ~A$20–40 |
| Multimeter | Charger output, continuity, battery voltage | ~A$30–60 |
| Known-good chargers: USB-C 65 W PD, Dell barrel, Lenovo slim tip, HP 4.5 mm | Test without trusting donated chargers | ~A$100–200 |
| Spare known-good SSD + RAM sticks | Isolate faults fast | from parts stock |
| USB 3 sticks (×3) | Ventoy/test images | ~A$30 |
| Isopropyl 99%, lint-free wipes, thermal paste, compressed air/blower | Clean and re-paste | ~A$50 |
| **Lithium safety:** fire blanket, metal bin with sand/vermiculite lid, smoke alarm over the bench | See 13 | ~A$100–200 |
| **Total** | | **≈A$500–950** |

---

## 3.6 Asset labels

- **Brother P-touch** QR/barcode-capable laminated label printers in AU: **PT-P710BT about A$136**, PT-P750W about A$195, PT-P900W about A$536–735 (retail listings, Oct 2026). Laminated TZe tape survives handling and cleaning. [Secondary] https://www.brother.com.au/en/labellers/all-labellers/pt-p900w ; https://www.inkstation.com.au/printers/label/brother
- **[Derived] workflow:** print `DEW-2026-0001` plus a QR of the same ID on intake. The QR goes on the device underside, the matching nwipe/sanitize report, and the tracker row. Phone app scanning (e.g. any free QR scanner) can open the tracker row. Remove the internal asset label at sale and leave a small "serviced by" label only if the buyer wants it.

---

## Sources

- GitHub (live, 2 Oct 2026): ventoy/Ventoy, PartialVolume/shredos.x86_64, martijnvanbrummelen/nwipe, linux-nvme/nvme-cli, smartmontools/smartmontools, ColinIanKing/stress-ng
- nwipe README: https://github.com/martijnvanbrummelen/nwipe
- MemTest86 editions/licence: https://www.memtest86.com/compare.html ; https://www.memtest86.com/tech_license-information.html
- NIST 800-88 Rev. 2 summaries: https://blancco.com/resources/blog-nist-800-88-rev-2-updated-standard/ ; https://www.bitraser.com/blog/nist-800-88-rev-2-vs-rev-1/ ; https://www.drivewipe.com/standards/nist-800-88-rev-2
- Phonecheck: https://www.phonecheck.com/ · OzMobiles: https://ozmobiles.com.au/blogs/smartphones/what-is-phonecheck-certification-and-why-it-matters-when-buying-a-refurbished-phone
- Secondary Market News (diagnostics vendors): https://secondarymarket.news/blog/diagnostics-software-smartphone-recommerce/
- Brother AU label printers: https://www.brother.com.au/en/labellers/all-labellers/pt-p900w ; https://www.inkstation.com.au/printers/label/brother
