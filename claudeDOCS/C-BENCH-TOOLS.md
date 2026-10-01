# Group C — Bench tool pricing (questions 18–20)

**Researched:** 2 Oct 2026. Prices in USD unless marked AUD. Vendor pages or AU reseller listings, via search snippets [Secondary unless noted].

## Q18. PC-Doctor, PartedMagic, KillDisk, NSYS ✅ (NSYS 🟡)

| Tool | What it does | Price found | Fit for Phase 0 |
|---|---|---|---|
| **PC-Doctor Toolbox** | Windows hardware diagnostics | **Free on up to 5 PCs for personal use**; **commercial use US$19.99** (volume discounts) | Optional; the free Linux tools (03) cover the same tests |
| **Parted Magic** | Bootable disk toolkit incl. ATA/NVMe Secure Erase, partitioning, cloning | **US$17 single version · US$15/quarter · US$59/yr · US$199 "Forever"** (Feb 2026) | **Good value**: a polished GUI for SSD/NVMe secure erase if the command line is a barrier. Latest release 2026_03_20 (DistroWatch) |
| **Active@ KillDisk Professional** | Disk wiping with certificates | **US$64.95 personal**; perpetual licence with 1 year of updates. **Ultimate** (adds SSD Secure Erase, LiveCD) **US$119.95 personal / US$149.95 corporate** | A cheap certificate-producing alternative to Blancco; check the corporate licence terms for commercial use |
| **NSYS** | High-volume mobile diagnostics/erasure (industrial) | **Not public** | Not Phase 0 |

Sources: https://www.pc-doctor.com/the-pc-doctor-blog/toolbox-is-now-free-on-up-to-5-pcs ; https://www.pc-doctor.com/solutions/toolbox ; https://www.drivewipe.com/software/parted-magic-review ; https://distrowatch.com/12766 ; https://www.killdisk.com/pricing-licensing.htm

## Q19. Blancco smaller bundles / per-erasure; Blancco Mobile ✅

| Product (AU reseller pricing, AUD) | Price |
|---|---|
| **SMB Select 50 bundle** (50 Drive Eraser licences + Management Portal) | **A$982.30** (≈ A$19.65/erasure; already in repo) |
| Drive Eraser Enterprise Edition, 1-yr subscription, 50–499 units | **A$42.24 per licence** |
| … 500–999 units | A$20.90 |
| … 1,000–4,999 units | A$8.80 |
| **Blancco Mobile Diagnostics & Erasure (BMDE) Enterprise**, 1-yr, 50–499 | **A$31.14 per licence** |
| Blancco Eraser for Apple Devices | separate product, price not found |

Sources: AU distributor/reseller listings via https://au.ingrammicro.com/site/productdetail?id=A001-000000000004494774 ; https://au.ingrammicro.com/site/productdetail?id=A001-000000000004495080 ; https://acquireit.com.au/p/blancco/blancco-drive-eraser-subscription-1yr-licence-de-ee-20-9164049 ; Blancco pricing page https://blancco.com/blancco-cost-bundles-pricing/
**No sub-50 bundle was found.** The SMB Select 50 is the entry point. **[Derived]:** at Phase 0 volume, use the free tools or KillDisk/Parted Magic. Buy SMB Select 50 only when a B2B client requires Blancco-branded certificates (then it's about A$20 per device, recoverable in the service fee).

## Q20. iPad battery health: coconutBattery / 3uTools ✅

- **Why it's needed:** iPadOS doesn't show "Battery Health" the way iPhone does on most iPad models, so third-party readers are used. [Secondary — Apple Community]
- **coconutBattery** (Mac app, coconut-flavour.com) reads Mac, iPhone and iPad battery data over USB (Wi-Fi in the paid version). **Readings can differ from Apple Diagnostics by several percentage points.** [Primary vendor + Secondary] https://coconut-flavour.com/coconutbattery/ ; https://www.macworld.com/article/542901/coconutbattery-review-mac-gems.html
- **3uTools** (Windows): reports battery health from cycle count and capacity, but **accuracy varies** (some report 0 design capacity), and it isn't Apple-approved. It also bundles jailbreak/flash features and has raised **security/data-logging concerns**. [Secondary] https://www.ifixit.com/Answers/View/423774/ ; https://poweringautos.com/is-3utools-battery-health-accurate/
- **[Derived] Rule:** use **coconutBattery** on a Mac for iPads, and record the **cycle count + full-charge vs design capacity** rather than a single "%". **Don't use 3uTools on customer devices** (it isn't Apple-approved, has security concerns, and the data handling is unclear). In listings, write "battery health per coconutBattery: X% (indicative)".

## Sources
Inline above.
