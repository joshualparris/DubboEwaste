# Group A — Triage, specs and locks (questions 1–10)

**Researched:** 2 Oct 2026 · labels: [Primary] / [Secondary] / [Derived] / [Open]
**Two corrections to `docs/claudegaps-research/01-TRIAGE-DECISION-SYSTEM.md` come out of this group. See the boxes under Q1 and Q9.**

---

## Q1. Windows 11 supported CPUs: model-level lookup ✅

**Source:** Microsoft's current OEM lists for Windows 11 24H2 [Primary]
- Intel (page updated 27 Feb 2025; doc updated Feb 2026): https://learn.microsoft.com/en-us/windows-hardware/design/minimum/supported/windows-11-24h2-supported-intel-processors
- AMD (doc updated Oct 2025): https://learn.microsoft.com/en-us/windows-hardware/design/minimum/supported/windows-11-24h2-supported-amd-processors

**Intel:** the 24H2 list begins at **8th-gen Core (i3/i5/i7/i9/m)** and runs through 14th gen and Core Ultra Series 1–3. It also includes Celeron 3000–7000, G4000–G6000, J4000, N4000/N5000; Pentium Gold 4000U+ / Silver J5000/N6000; N-series (N100/N200/N300); Xeon E-2100+ and W series. **No 7th-gen-or-older Core part is listed on the 24H2 page.** (The original 2021 list's handful of 7th-gen exceptions, such as the Surface Studio 2's i7-7820HQ, doesn't appear here.)

**AMD:**
- **Desktop:** Ryzen 2000 is listed (2300X, 2500X, 2600/2600X/E, 2700/2700X/E, PRO 2600/2700/2700X).
- **Laptop:** the list starts at **Ryzen 3000-series mobile** (3200U, 3250U, 3300U, 3450U, 3500U/C, 3550H, 3700U/C, 3750H, the Surface 3580U/3780U, PRO 3300U/3500U/3700U), plus Athlon 300U/3050U/3150U.
- **Mobile Ryzen 2000 (2200U/2500U/2700U, "Raven Ridge") is not listed.**

> **Correction to 01:** the triage floor must read **"Intel Core 8th gen+ · AMD Ryzen 2000+ desktop / Ryzen 3000+ laptop"**, not "Ryzen 2000+".

### Fleet-model → CPU generation lookup [Derived from model naming; verify each unit with PSREF or the spec sheet / CPU string]

| Family | 7th gen (NOT eligible) | 8th gen (eligible) | 10th gen | 11th gen |
|---|---|---|---|---|
| Dell Latitude 5000 | 5480 / 5580 | 5490 / 5590, **5300 / 5400 / 5500** | 5310 / 5410 / 5510 | 5320 / 5420 / 5520 |
| Dell Latitude 7000 | 7280 / 7480 | 7290 / 7390 / 7490, 7300 / 7400 | 7310 / 7410 | 7320 / 7420 |
| Lenovo ThinkPad T | T470 / T470s | T480 / T480s, T490 / T490s | T14 Gen 1 (Intel) | T14 Gen 2 (Intel) |
| Lenovo ThinkPad X | X270 | X280, X390 | X13 Gen 1 | X13 Gen 2 |
| ThinkPad X1 Carbon | Gen 5 | Gen 6, Gen 7 | Gen 8 | Gen 9 |
| HP EliteBook 840 | G4 | G5, G6 | G7 | G8 |
| HP EliteBook 830 | G4 (n/a) | G5, G6 | G7 | G8 |
| Microsoft Surface Pro | Pro (2017) "5" | Pro 6 | Pro 7 | Pro 8 |
| Surface Laptop | Laptop 1 | Laptop 2 | Laptop 3 (Intel) | Laptop 4 (Intel) |

**Caveat:** AMD variants (e.g. ThinkPad T495 = Ryzen 3000 mobile → eligible; EliteBook 745 G5 = Ryzen 2000 mobile → **not** eligible) break the pattern. Always read the actual CPU string.

---

## Q2. Mac accept/reject table ✅

- **macOS 27 "Golden Gate" shipped 14 Sep 2026 and is Apple-silicon only.** Supported: MacBook Neo (2026), MacBook Air with Apple silicon (2020+), MacBook Pro with Apple silicon (2020+), iMac Apple silicon (2021+), Mac mini Apple silicon (2020+), Mac Studio (2022+), Mac Pro Apple silicon. [Secondary, consistent across MacRumors / iClarified / EveryMac] https://www.macrumors.com/2026/04/18/macos-27-compatibility-change/ ; https://www.iclarified.com/101131/macos-27-golden-gate-supported-devices-full-list-of-compatible-macs
- The last Intel Macs (16" MBP 2019, 13" MBP 2020 4-port, 27" iMac 2020, Mac Pro 2019) stop at **macOS 26 Tahoe**.
- **Apple vintage list (current)**, i.e. hardware service only while parts last: MacBook Air Retina 13" 2019–2020 (Intel); MacBook Pro 13" 2019; MacBook Pro 15" 2019. **Obsolete:** MBP 2016–2018, MacBook Air Retina 2018, MBP Early 2015. [Primary] https://support.apple.com/en-au/102772

| Mac | Retail decision |
|---|---|
| Any Apple-silicon Mac (M1+) | **ACCEPT**: current macOS, top resale |
| Intel Mac that runs macOS 26 (2019–2020 top models) | **INSPECT**: sell as "macOS 26, no further major upgrades", priced low; clear quickly |
| Intel Mac 2018 or older | **PARTS / donation / Linux only.** Obsolete for Apple service |
| Any Mac with Activation Lock "Enabled" or a Remote Management screen | **REJECT** |

---

## Q3. iPhone / iPad support ✅

- **iOS 27 (and iOS 26) support iPhone 11 and later, plus iPhone SE (2nd gen+).** iPhone XS/XS Max/XR are dropped. [Secondary] https://9to5mac.com/2026/06/08/ios-27-here-are-all-the-compatible-iphone-models/
- **iPadOS 27** supports iPad Pro 12.9" (4th gen+), iPad Pro 11" (2nd gen+), iPad Air (4th gen+), **iPad (9th gen+)**, iPad (A16), iPad mini (6th gen+). It **drops all A12/A12X devices** (iPad 8th gen, mini 5, Air 3, Pro 11" 1st gen, Pro 12.9" 3rd gen). [Secondary] https://www.iclarified.com/101128/ipados-27-supported-devices-full-list-of-compatible-ipads
- Vintage iPhones include 8/8 Plus, XS/XS Max, **11 Pro/11 Pro Max**; obsolete includes iPhone X, SE 1st gen. [Primary] Apple 102772.

**[Derived] Rule:** retail iPhones = **11 or newer, or SE 2/3**. Retail iPads = **9th gen+, Air 4+, mini 6+, Pro 11" 2nd gen+**. Everything older is parts, donation or recycling.

---

## Q4. Android security-support end dates ✅ (framework) / 🟡 (per-model)

| Brand | Policy / status found | Source |
|---|---|---|
| **Samsung** | Monthly → quarterly → biannual → end. **Galaxy S21/S21+/Ultra removed from update lists in early 2026** after 5 years (S21 FE still quarterly). **S22 now quarterly, expected security updates to about Feb 2027.** Flagships from S24 on promise 7 years. Official list: security.samsungmobile.com | [Secondary] https://www.androidauthority.com/samsung-galaxy-s21-series-end-of-updates-3637553/ ; https://sammyguru.com/samsung-support-policy-devices-currently-eligible-for-updates/ |
| **Google Pixel** | Pixel 8+ 7 years; 6/7 series 5 years; 5a and earlier ended (already in repo) | repo BACKLOG-21-25 |
| **OPPO** | Find X8/X9: 5 OS + 6 years security. 2023+ flagships: 4 OS + 5 yrs. Pre-2023 flagships: 3 + 4 yrs. Mid-range: 2 OS + 4 yrs. Budget: 1 OS + 3 yrs. **AU budget A5 4G / A5x 4G: 3 OS + 6 years security** | [Secondary] https://www.androidauthority.com/phone-update-policies-1658633/ ; https://www.whistleout.com.au/MobilePhones/News/OPPO-A5-4G-OPPO-A5x-Australia ; OPPO PSTI page https://www.oppo.com/uk/psti/ |
| **Motorola** | Budget lines often only 1 OS upgrade + 2 years of patches; 7 years only on the new "Signature" model | [Secondary] Android Authority as above |

**[Derived] Rule:** retail Android = **still on Samsung's monthly or quarterly list, or ≥18 months of promised security support left**. Budget Motorola older than 2 years = parts or recycling. **[Open]** Build per-model end dates as phones actually arrive (check security.samsungmobile.com at intake).

---

## Q5. Chromebook AUE for common school models 🟡

Third-party compilations of Google's AUE list [Secondary — confirm each on Google's page https://support.google.com/chrome/a/answer/6220366]:

| Model | AUE |
|---|---|
| Lenovo 100e Chromebook Gen 3 | Jun 2031 |
| Lenovo 300e Chromebook Gen 3 | Jun 2031 |
| Acer Chromebook Spin 511 | Jun 2031 |
| Dell Chromebook 3100 | Jun 2029 |
| **HP Chromebook 11 G9 EE** | **Jun 2026: already expired** |

Sources: https://chromebookfixes.com/buying-guides/lenovo-chromebook-aue-dates-by-model/ ; https://chromebookfixes.com/buying-guides/acer-chromebook-aue-dates-by-model/ ; https://chromebookfixes.com/buying-guides/dell-chromebook-aue-dates-by-model/
**Caveat:** some model names cover several hardware variants with different AUEs. Read the AUE on the device (Settings → About ChromeOS → Additional details → Update schedule).

---

## Q6. Dell / HP BIOS admin passwords ✅

| Vendor | Official route | Source |
|---|---|---|
| **Dell** | Enter a wrong password 3–5 times → note the **error/service code** → contact Dell Technical Support with the **Service Tag and proof of ownership/purchase** → Dell supplies a **release code**. If recovery isn't possible, a motherboard replacement may be needed. Organisation-managed devices: ask the org's IT. | [Primary] https://www.dell.com/support/kbdoc/en-us/000140298/dell-support-for-lost-bios-password ; https://www.dell.com/support/kbdoc/en-us/000131024/how-to-clear-the-bios-password |
| **HP** | If the owner set up **HP SpareKey**, press F7 at the password prompt and answer 3 security questions. Otherwise HP Services may reset with proof of ownership (historically a UUID-specific SMC.bin file; community reports say HP has stopped supplying it). An 8-digit halt code shown after 3 wrong tries goes to HP support. | [Secondary — HP community] https://h30434.www3.hp.com/t5/Notebook-Operating-System-and-Recovery/EliteBook-BIOS-Admin-password/td-p/7156281 |
| **Lenovo ThinkPad** | Supervisor password: system-board replacement only (see 01) | — |

**[Derived] Rule:** all three need the **original owner's proof of purchase**, so a BIOS-locked donated laptop is effectively the donor's problem to fix **before** handover. Otherwise reject it (or parts-only, with the board not reused).

---

## Q7. Detecting Computrace / Absolute ✅

- **Where to look:** BIOS/UEFI → Security → "Absolute Persistence" / "Computrace". States: **Inactive** (disabled, can be enabled), **Active** (bound to a subscription, or not yet told it's decommissioned), **Permanently Disabled** (can't be re-enabled, even by a BIOS flash). Many business laptops show the setting simply because the model supports it. [Secondary] https://forum.thinkpads.com/viewtopic.php?t=114641 ; Dell KB on the Absolute module: https://www.dell.com/support/kbdoc/en-au/000142862/computrace-replaced-by-absolute-module-in-newest-bios-revisions
- **Behaviour:** the firmware module reinstalls the Windows agent after a wipe/reinstall; a Linux install doesn't get the self-healing agent. [Secondary]
- **[Derived] Rule:** "**Activated**" = treat like an MDM lock. The donor org must release it in the Absolute console before handover. "Inactive" / "Permanently Disabled" = OK. Record the state in the triage addendum (add a column `absolute_state`).

---

## Q8. Samsung Knox Guard / carrier lock ✅

- **Knox Guard** is mostly used by carriers/financiers on **instalment-sold phones**. It's registered against the IMEI. Statuses: OFF / Active / Locked / Completed. An active Knox Guard device can become unusable. [Secondary] https://swappa.com/blog/samsung-reactivation-lock-knox-used-galaxy/ ; Samsung admin docs: https://docs.samsungknox.com/admin/knox-guard/how-to-guides/manage-devices/lock-and-unlock-devices/
- **Hands-on check:** boot to **Download Mode** and read **"KG STATE"** (formerly RMM state): "Completed" / "Checking" / "Prenormal". **"Prenormal" or an active lock screen = reject.** [Secondary — XDA/TheCustomDroid] https://www.thecustomdroid.com/prenormal-rmm-state-on-samsung-galaxy-guide/
- Also: Samsung account / **Reactivation Lock / Find My Mobile** must be signed out (the Samsung equivalent of FRP).
- **Carrier lock:** insert a SIM from another carrier. A "SIM not supported / network lock" message means it's carrier-locked. **[Derived]**

---

## Q9. AMTA IMEI Lookup terms ✅ — important

AMTA's IMEI Lookup Service T&Cs (PDF, May 2024) [Primary] https://amta.org.au/wp-content/uploads/2024/05/AMTA-IMEI-Lookup-Service-TCs.pdf :
- Titled "**(Personal Use)**". Grants "a single non-exclusive non-transferable '**one use**' licence".
- **3.1 "You must only use the IMEI Lookup Service for personal use."**
- **3.2 "You must not use… the IMEI Lookup Service in connection with any other products or services."**
- 3.3 No disclosure of results to third parties (except as required by law).
- 1.6.2: the database "**is not an accurate record**" at the time of lookup, and there can be "a substantial delay".

> **Correction to 01 (§1.5) and 02:** the free AMTA checker **can't lawfully be built into a business's intake/resale workflow** under these terms. Options: (a) ask the **donor/seller to run the AMTA check themselves** and show you the result (personal use, their phone); (b) **[Open — CALL AMTA]** ask whether a commercial/dealer IMEI service exists (none was found publicly); (c) commercial global IMEI/blacklist services exist (e.g. GSMA device-check-type services 🔎), but they're paid and their AU coverage is unverified.

---

## Q10. Common failure modes by business family ✅ (top items)

| Family | Known issue | Triage check | Source |
|---|---|---|---|
| Dell Latitude 5490/7490 (and peers) | **Swollen batteries** strong enough to pop the bottom cover; stiff/loud keys are an early sign | Look for a raised palmrest/trackpad, keys clicking unevenly, the case rocking | [Primary] Dell swollen battery guidance https://www.dell.com/support/kbdoc/en-ed/000128491/swollen-battery-information-and-guidance ; community threads |
| **ThinkPad T480 (and 2018–19 ThinkPads)** | **Thunderbolt controller firmware failure** kills USB-C charging/video (Lenovo blamed firmware; update the TB firmware). The **charge port is on the motherboard** on the T480 | Charge via USB-C and test video out; check that the TB firmware is updated | [Secondary] https://www.notebookcheck.net/Lenovo-statement-Thunderbolt-firmware-responsible-for-ThinkPad-USB-C-failures.451307.0.html ; https://repair.wiki/w/Thinkpad_T480 |
| HP EliteBook 840 G5 | USB-C won't charge until a hard reset (hold power about 20 s, unplugged); fan runs constantly on AC; touchpad phantom clicks (some cases) | Test USB-C charging after a cold start; listen to the fan | [Secondary] HP community; https://www.ifixit.com/Wiki/HP_EliteBook_840_G5_Troubleshooting |
| **Surface Pro 4 (also 5/6)** | **Swollen battery lifting the screen ("Surfacegate")**; **Pro 4 hardware screen flicker ("Flickergate")** that software can't fix | Check the screen edges for lift; run a flicker test. **Surface Pro 4 = reject** (also 6th gen, not Win11-eligible) | [Secondary] https://www.ifixit.com/News/32723/got-a-surface-book-or-surface-pro-4-watch-out-for-screen-bulging-batteries |

---

## Sources (group A)
All links are inline above. Key primaries: Microsoft Intel/AMD 24H2 processor lists; Apple 102772; Dell BIOS-password KBs; AMTA IMEI Lookup T&Cs PDF; Samsung Knox docs; Google Auto Update policy.
