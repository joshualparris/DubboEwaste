# 03 — Diagnostic and wipe bench kit

**Answers:** `claudeGAPS.md` §3 (3.1–3.6)
**Researched:** 2 Oct 2026. GitHub repo facts were pulled live with `gh api` on that date.

---

## Bottom line

A capable **open-source** bench kit can cost **$0 in software**, but the tool stack does not itself create compliance. Current NIST SP 800-88 Rev. 2 requires a sanitisation program that selects an appropriate **Clear, Purge or Destroy** outcome, verifies successful completion and validates that the chosen technique is appropriate for the media/risk case. For SSD/NVMe, ordinary host overwriting must not be assumed to reach all user-data locations; use current IEEE 2883/vendor/device guidance for the actual technique.

Paid suites (Blancco, Phonecheck) mainly buy *audit-grade certificates and automation*. They only become worth it when business clients ask for them.

---

## 3.1 Free USB triage stick: component check

| Tool | Role | Licence | Latest release | Activity | Notes |
|---|---|---|---|---|---|
| **Ventoy** | Multi-boot USB; drop ISOs on it | GPL-3.0 | v1.1.17 (2026-07-24) | 79.7k★, pushed 2026-09-30 | One stick holds ShredOS, a Linux live ISO and MemTest |
| **ShredOS** | Boots straight into nwipe | (no SPDX tag) | v2025.11_31 … _0.42 (2026-07-16) | 3.2k★ | Wipe many drives in parallel unattended |
| **nwipe** | Disk wipe engine | GPL-2.0 | v0.42 (2026-07-15) | 1.2k★ | Methods include overwrite/verify modes and PDF reporting. **Stable v0.42 should not be described as already having native ATA/NVMe secure erase; that capability is documented for v0.43.** ShredOS separately bundles `hdparm`, `nvme-cli`, `smartctl` and other tools. Do not add an extra PRNG overwrite after a device-native purge merely as a universal “NIST” recipe. |
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

Current **NIST SP 800-88 Rev. 2 (September 2025)** position:
- Select a **Clear, Purge or Destroy** outcome according to risk, intended reuse and policy. NIST says **Purge should be preferred over Clear when possible**.
- For magnetic media, old multi-pass overwrite schemes are unnecessary; a Clear overwrite technique may be appropriate where Clear is the approved outcome.
- For flash/SSD/NVMe, ordinary host overwriting may not reach remapped/over-provisioned blocks. Rev. 2 deliberately does not prescribe one universal ATA/NVMe command sequence; use current **IEEE 2883**, vendor/device guidance or another approved standard.
- Cryptographic erase is only as trustworthy as the encryption/key-management prerequisites and implementation.
- Rev. 2 separates **verification** (did the sanitisation operation complete successfully, including errors/anomalies?) from **validation** (does the evidence support accepting the result for this media/risk case?). Elaborate sector sampling is not a universal requirement.

Primary sources: https://csrc.nist.gov/pubs/sp/800/88/r2/final ; https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-88r2.pdf ; https://standards.ieee.org/ieee/2883/10277/

### [Derived] Dubbo verification procedure (v0.1)

| Media | Sanitize | Verify | Record |
|---|---|---|---|
| Media / device | Phase 0 method-selection rule | Verification / evidence |
|---|---|---|
| Magnetic HDD | Use a policy-approved **Clear** overwrite when Clear is sufficient, or an approved Purge/Destroy technique where the risk requires it. Do not add multiple overwrite passes merely because an old “DoD” pattern exists. | Record media identity, tool/version, completion result and any errors/anomalies; retain the wipe report. |
| SATA SSD | Inspect supported device sanitisation capabilities and use the **approved media-specific Purge/Clear technique** from current IEEE 2883/vendor guidance. Do not automatically append an nwipe PRNG pass after a device-native sanitisation. | Retain command/tool output, device identity and health/error evidence; validation determines PASS/HOLD/DESTROY. |
| NVMe SSD | Inspect controller capabilities (for example with `nvme id-ctrl`) and use an approved NVMe sanitisation/format technique where appropriate. | Retain `sanitize-log`/tool output and errors; validate the result against the selected policy. |
| Apple / phone / tablet | Use the vendor-supported erase/reset path and confirm account/Activation Lock/FRP/MDM state. Do not claim every factory reset is automatically a NIST Purge. | Record serial/IMEI and setup/lock state plus the method used. |
| Network gear | Use the documented vendor reset/configuration-erasure procedure. | Record model/serial, method and post-reset state. |
| Failure / anomaly | **Quarantine and escalate.** Try another approved technique or route to Destroy when the risk/policy requires it. | Preserve the failed evidence and final disposition. |

**Validation (Rev. 2 sense):** document why the selected technique is appropriate for the media/risk case and review the actual verification evidence, errors/anomalies and device health before accepting the result. Recovery testing on synthetic media can be useful during procedure development, but is **not a universal NIST requirement for every media class or every wipe**. **[Open — TRY]**

---

## 3.2 / 3.3 Commercial suites: what's public

| Product | Public pricing | Notes |
|---|---|---|
| **Blancco** | **Current quote / reseller price required.** The former A$982.30 / A$19.65-per-erase figure is a historical reseller snapshot, not a universal current price. | Signed/auditable reporting and enterprise automation can justify the platform when client requirements warrant it; buying the tool does not by itself make the process NIST-compliant. |
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
| **Lithium safety:** controls selected by the actual site/battery risk assessment and insurer/WHS/fire guidance; do **not** assume a generic metal bin with sand/vermiculite is a complete or compliant control | See current battery safety docs | quote / risk-assessment dependent |
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
