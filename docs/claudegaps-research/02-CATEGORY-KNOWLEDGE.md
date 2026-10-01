# 02 — Category-specific knowledge

**Answers:** `claudeGAPS.md` §2 (laptops/desktops, Apple, phones/tablets, TVs/monitors, components/other)
**Researched:** 2 Oct 2026 · confidence key as in `01-TRIAGE-DECISION-SYSTEM.md`

---

## 2.1 Laptops and desktops

### Which lines to prefer
- **Business lines** (Dell Latitude/OptiPlex, Lenovo ThinkPad/ThinkCentre, HP EliteBook/ProBook/EliteDesk, Microsoft Surface) dominate every AU refurbished shop checked. WorkVentures' live shop is 100% business lines (see 01). **[Primary]**
- **Why:** each vendor publishes free per-model service documentation and part numbers:
  - Lenovo **PSREF** (spec sheets for every model and config) plus the Lenovo parts lookup: https://psrefstuff.lenovo.com/ , https://support.lenovo.com/us/en/parts-lookup **[Primary]**
  - HP **Maintenance and Service Guides** (spare-part lists, removal/replacement steps, customer-self-repair vs ASP-only parts), e.g. https://kaas.hpcloud.hp.com/pdf-public/pdf_5412640_en-US-1.pdf **[Primary]**
  - Dell per-model **Service Manuals** on dell.com/support **[Secondary]**
- **[Derived]** Rule: accept a consumer model only if its RAM/SSD are not soldered *or* it already meets the retail spec as-is. Use PSREF or the service manual at triage to check what's soldered.

### Windows 11 eligibility (the retail gate)
- Intel Core 8th gen+ / AMD Ryzen 2000+ / listed Snapdragon, **TPM 2.0**, **UEFI Secure Boot**. Check with Microsoft's **PC Health Check** app, or from a live USB by reading the CPU model and checking it against Microsoft's processor lists. **[Secondary]** (see sources in 01)
- Windows 10 consumer ESU runs to **12 Oct 2027** (already in repo). **[Derived]** After that date a Win10-only machine has no mainstream retail route in AU. Price Win10 stock to clear **before mid-2027**.

### Licensing on reinstall
- **[Derived from repo + Microsoft]:** business machines from 2015 on carry an **OEM key embedded in firmware (MSDM table)**, so a clean install of the matching edition (Home/Pro) activates automatically. Volume-licensed Enterprise installs do **not** transfer, so reinstall the edition matching the firmware key. Don't buy grey-market keys. The MAR/TPR route only applies at volume (already in repo). **[Open]**: confirm the firmware-key behaviour on the first 5 pilot machines (`wmic path SoftwareLicensingService get OA3xOriginalProductKey` or `strings /sys/firmware/acpi/tables/MSDM` on Linux).

### Chromebooks
- Google gives **10 years of automatic updates** to Chromebook platforms released **from 2021 onward**. The clock starts at **platform release, not purchase**. Look up each model on Google's official Auto Update policy page: https://support.google.com/chrome/a/answer/6220366 **[Primary]**
- Enterprise/education enrolment is the main lock (see 01 §1.4). Schools are the main source. **[Derived]** Accept only with a written deprovision confirmation, and only if AUE is ≥2 years away.

---

## 2.2 Apple

- **Activation Lock** now applies to **parts too**. Since Apple's 2024 change, a part taken from a device with Activation Lock or Lost Mode enabled gets **restricted calibration** in its new device. Harvesting parts from a locked iPhone is therefore close to worthless as well as risky. [Primary] https://www.apple.com/newsroom/2024/04/apple-to-expand-repair-options-with-support-for-used-genuine-parts/
- **Parts pairing / "Unknown Part":** since iOS 18 a **Repair Assistant** (Settings → General → About) can pair **used genuine** parts. Supported used-part models are iPhone 15 family and newer (16, 17, Air). Third-party displays get best-effort True Tone; third-party batteries show health with an "unable to verify" notice. Apple also shows **Parts and Service History** to buyers, so swapped parts are visible to the next owner. [Secondary] https://www.ifixforu.com/en/blog/apple-parts-pairing-explained ; Apple parts support: https://support.apple.com/en-za/120555
- **[Derived] Rules:**
  - iPhone 15+ with genuine harvested parts can be repaired normally. iPhone 14 and older will show "Unknown Part" for many swaps, so **disclose it in the listing** (ACL accuracy) and price it lower.
  - Never accept locked iPhones "for parts".
  - Build a Mac model table during the pilot from Apple's vintage/obsolete list (already linked in repo). Retail floor = still supported by the current macOS.

---

## 2.3 Phones and tablets

### Network / 000 viability
- After the 3G closures (Vodafone/TPG Dec 2023, Telstra and Optus Oct 2024), carriers must **block handsets that cannot reach 000**. ACMA requires operators to identify these handsets and notify customers, and to **not provide service** to them. [Primary page] https://www.acma.gov.au/ensuring-mobiles-can-reach-000-after-3g-shutdown (timed out during fetch; content via ACMA/news summaries)
- **Carriers block inconsistently.** The ABC reported Optus blocking models Telstra supports (May 2025), and Telstra found Samsung firmware variants that locked 000 calls to Vodafone. [Secondary] https://www.abc.net.au/news/2025-05-27/telstra-optus-inconsistent-blocking-phones/105319626 ; https://www.itnews.com.au/news/telstra-finds-firmware-locked-samsung-handsets-to-vodafone-for-triple-0-calls-621251
- **Check tools:** AMTA's "Check My Device" (https://amta.org.au/3g-closure/check-my-device-new/) plus each carrier's 3G-closure page (Telstra: https://www.telstra.com.au/support/mobiles-devices/3g-closure). **[Primary]**
- **[Derived] Rule:** for every phone, run (1) the AMTA IMEI lost/stolen check and (2) AMTA Check My Device / carrier compatibility, and **write "tested on <carrier> SIM, VoLTE + 000-capable per <tool> on <date>"** in the listing. Imported/grey phones are the highest risk. Avoid them unless they're on the carriers' supported lists.

### Samsung / Android specifics
- **OLED burn-in test:** Samsung's diagnostic menu `*#0*#` → Red/Green/Blue/Black tiles; also check a full-screen **mid-grey (#808080)**, where burn-in shows best. A ghost that stays across colours is burn-in; one that fades after 10–60 min of varied content is retention. **[Secondary]** https://sellup.com.sg/blogs/how-to-check-for-screen-burn-In-on-samsung-oled.php
- Burn-in is a **grade-reducing defect**, and on high-end Samsungs the screen is often the costliest part. **[Derived]**
- Knox Guard / carrier lock detection: still **[Open]**. Test on the first Samsung received.

### Grading standards to copy
- **Back Market:** Premium / Excellent / Good / Fair; all 100% functional; ≥80% battery (Premium ≥90%). **[Primary]** (see 01)
- **Reebelo AU:** Pristine / Excellent (light scratches invisible at 20 cm) / Very Good (visible at 20 cm); 12-month warranty minimum. **[Primary]**
- **[Derived] Dubbo grade scale (aligned with the repo's A/B/C):**

| Dubbo grade | Matches | Cosmetic test |
|---|---|---|
| A — Excellent | Back Market Excellent / Reebelo Excellent | Scratches invisible at 20 cm, screen flawless |
| B — Good | BM Good / Reebelo Very Good | Light marks visible at 20 cm, screen flawless |
| C — Fair | BM Fair | Visible scratches/dents; screen may have minor marks that don't affect use |
| Parts | — | Any functional fault, disclosed |

### Phone exits other than retail
- **Officeworks Tech Trade-in** gives a guaranteed price floor for selected phones (already in repo). **[Open — TRY]:** quote the first 5 phones there to set the floor.
- MobileMuster for dead handsets (already in repo).

---

## 2.4 TVs and monitors

- **AU asking prices (not sold prices)** for used 55" smart TVs: roughly **A$250 (Kogan)–A$300 (2025 TCL)–A$450 (LG 4K)–A$600 (LG OLED)**; a one-year-old premium 55" around A$900. [Secondary, live listings via search] https://www.gumtree.com.au/s-tvs/55+inch+tv/k0c21115 ; https://www.facebook.com/marketplace/brisbane/smart-tvs/
- **[Derived] Economics:** budget-brand TVs resell near the price of a **new** budget TV minus about 40–50%, and they're bulky, fragile and local-pickup-only. TVs only make sense when they're **premium (OLED/QLED/mini-LED), ≤5 years old, 50"+, fully working, with remote and stand**, and when pickup can be local. Every other TV is a recycling liability. This supports the repo's "TVs by prior approval only".
- **Repairs:** backlight strips and power boards are the classic economic fixes; a cracked panel is terminal. **[Open — LEARN]**: see videos in section 06.
- **Monitors:** the repo's checklist is adequate. Add: test at native resolution, full-screen colour cycle for dead pixels, check the stand height mechanism and the VESA screws. Sale value depends mainly on size and resolution (27" 1440p and up holds value; 19–22" 1080p is near zero). **[Derived — verify with sold listings]**

---

## 2.5 Components, networking, other

- **RAM/SSD/CPU used prices:** no AU index exists. Method: eBay AU sold filter plus r/bapcsalesaustralia 🔎. Typical pattern **[Derived]**: DDR4 SODIMM 8/16 GB and NVMe SSDs ≥256 GB move well; DDR3 and <128 GB SATA SSDs are close to scrap. **[Open — TRY]**
- **Enterprise networking:** **switch/router configs and NVRAM hold credentials and network topology**, so a factory reset/`write erase` is a data-sanitisation step and belongs on the sanitisation certificate. **[Derived]** Market (homelab buyers) **[Open]**.
- **Printers:** no evidence that small printers have resale value. Business lasers are possible but heavy, toner-dependent and fragile in transit. Keep "pre-approval only". **[Derived]**
- **Vintage/collector items** (retro consoles, early Apple, boxed items) can beat modern gear on value. Check eBay sold listings before recycling anything pre-2005 that's complete. **[Derived]**

---

## Sources

- Lenovo PSREF: https://psrefstuff.lenovo.com/ · Lenovo parts lookup: https://support.lenovo.com/us/en/parts-lookup
- HP Maintenance & Service Guide example: https://kaas.hpcloud.hp.com/pdf-public/pdf_5412640_en-US-1.pdf
- Google ChromeOS Auto Update policy: https://support.google.com/chrome/a/answer/6220366
- Apple used genuine parts / parts Activation Lock: https://www.apple.com/newsroom/2024/04/apple-to-expand-repair-options-with-support-for-used-genuine-parts/
- Apple parts support: https://support.apple.com/en-za/120555 · parts pairing explainer: https://www.ifixforu.com/en/blog/apple-parts-pairing-explained
- ACMA 000 after 3G: https://www.acma.gov.au/ensuring-mobiles-can-reach-000-after-3g-shutdown
- AMTA Check My Device: https://amta.org.au/3g-closure/check-my-device-new/ · Telstra 3G closure: https://www.telstra.com.au/support/mobiles-devices/3g-closure
- ABC on inconsistent blocking: https://www.abc.net.au/news/2025-05-27/telstra-optus-inconsistent-blocking-phones/105319626
- iTnews Samsung 000 firmware: https://www.itnews.com.au/news/telstra-finds-firmware-locked-samsung-handsets-to-vodafone-for-triple-0-calls-621251
- Samsung burn-in test: https://sellup.com.sg/blogs/how-to-check-for-screen-burn-In-on-samsung-oled.php
- Used TV listings: https://www.gumtree.com.au/s-tvs/55+inch+tv/k0c21115
