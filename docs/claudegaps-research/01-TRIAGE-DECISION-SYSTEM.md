# 01 — Front-door triage decision system

**Answers:** `claudeGAPS.md` §1 (items 1.1–1.12)
**Researched:** 2 Oct 2026, web research by Claude Code (search → primary-source fetch → cross-check)
**Confidence key:** **[Primary]** = read from the operator/vendor/regulator's own page · **[Secondary]** = third-party summary, treat as indicative · **[Derived]** = my synthesis from the sources · **[Open]** = can only be closed by a call or hands-on test

> **CORRECTIONS (2 Oct 2026, from `claudeDOCS/A-TRIAGE-SPECS-LOCKS.md`):**
> 1. The Windows 11 floor for **AMD laptops is Ryzen 3000-series mobile**. Mobile Ryzen 2000 (2500U/2700U) is **not** on Microsoft's 24H2 list; desktop Ryzen 2000 is. Read "Ryzen 2000+" below as "Ryzen 2000+ desktop / 3000+ laptop".
> 2. AMTA's free IMEI checker is licensed for **personal use only** and must not be used "in connection with any other products or services". Have the donor/seller run it and show the result, or find a commercial service (§1.5 below is superseded).

---

## Bottom line

1. The market has already agreed a **resale floor** for laptops: **Windows 11-eligible hardware (Intel 8th gen+ / AMD Ryzen 2000+)**. The oldest laptop in WorkVentures' live refurbished shop today is the Dell Latitude 5300, an 8th-gen Intel machine from 2019. Anything older is a parts, Linux, donation or recycling decision, not a retail one.
2. The market has also agreed a **battery floor**: Back Market and Reebelo both require **≥80% battery health** for every resale grade, and Back Market "Premium" requires ≥90%. A device under 80% is either "battery replacement first" or "disclose and discount". It can't go into a normal graded listing.
3. **Locks are the top junk trap.** Activation Lock, Google FRP, Windows Autopilot, Chromebook enterprise enrolment and ThinkPad supervisor passwords can all make a perfect-looking device worth $0. Only the **previous owner/organisation** can remove most of them, so they have to be cleared **before the device changes hands**, not afterwards.
4. Every phone can be checked against the **free AMTA IMEI lookup** (blocked lost/stolen handsets) before acceptance.
5. Bendigo E-Waste, the benchmark, takes most electronics **free** but **charges per kg for loose batteries and media**, charges **from $150 per collection**, refuses vapes and toner, and explicitly processes locked devices "as such" (recycling only).

---

## 1.1 Minimum spec per category (resale floor)

### Evidence

| Benchmark | What it shows | Source |
|---|---|---|
| **Windows 11 CPU floor** | Intel Core 8th gen+ and AMD Ryzen 2000+ (plus listed Qualcomm), together with TPM 2.0 and Secure Boot. | [Secondary] summaries of Microsoft's supported-processor lists, e.g. [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/4132262/window-11-cpu-requirements); Microsoft's official lists are at learn.microsoft.com "Windows processor requirements" |
| **WorkVentures live refurbished shop (2 Oct 2026)** | 13 laptops listed: Latitude 5300 (8th gen) i5/i7, Dynabook Portégé X30L-J, EliteBook 830 G7, EliteBook 840 G8, ThinkPad X13, X1 Carbon Gen 9, Surface Laptop 4, Surface Pro 7/8. Prices roughly **A$359–699**. **Oldest CPU generation offered: Intel 8th gen.** | [Primary] scraped from https://shop.workventures.com.au/product-category/refurbished-laptop/ |
| **National Device Bank free-laptop spec** | i5 6th gen+, 8 GB RAM, 128 GB SSD, webcam, 13.3"+. This is the *donation* floor, lower than the retail floor. | Already in repo (`GOOD360-COMPNOW-NATIONAL-DEVICE-BANK-DUBBO.md`) |
| **The Laptop Initiative** | Usually ≤4 years old, working, charger and webcam included. | Already in repo |
| **Reconnect** | Laptops under about 8 years old; phones and tablets of any age. | Already in repo |

### Derived triage floor — laptops/desktops (Phase 0)

| Tier | Rule | Route |
|---|---|---|
| **RETAIL** | Intel 8th gen+ / Ryzen 2000+, SSD (or SSD-upgradeable), ≥8 GB RAM (or upgradeable), working screen, battery ≥80% (laptops) | Wipe → test → grade → sell |
| **RETAIL-WITH-WORK** | As above but battery <80%, no charger, HDD, 4 GB RAM | Only if the part cost plus labour still leaves margin (§4 pricing) |
| **DONATION / LINUX** | Intel 6th–7th gen with 8 GB/SSD, otherwise healthy | Social stream (Device Bank spec), or a clearly labelled Linux machine. Note the Windows 10 consumer ESU ends **12 Oct 2027**, so a Win10 sale has a fixed shelf life |
| **PARTS** | ≤5th gen, or terminal faults on a better machine | Harvest RAM/SSD/charger/screen if a buyer exists, then recycle |
| **REJECT AT DOOR** | Locked (any type), swollen/damaged battery, liquid-damaged with corrosion, no exit route | Leaves with the owner |

### Still open
- Mac floor: Apple's vintage/obsolete lists apply (already noted in repo). The practical retail floor is "still supported by current macOS". Build a model table during the pilot. **[Open]**
- Phone floor: needs AU network/000 compatibility (already in repo) plus OS-support status. Build per brand. **[Open]**

---

## 1.2 Age → value curves

**Public evidence quality is poor.** Most "depreciation rate" content comes from US buy-back vendor blogs. They agree on direction but are not AU data:
- Typical claims: laptops lose about **25%/yr**; **premium/business lines (ThinkPad X1, Latitude, EliteBook, MacBook) drop 25–35% in year 1 and then 10–15%/yr**; mid-range consumer Windows laptops drop 40–50% in year 1, then about 20%/yr ([Secondary] e.g. https://buybackxstores.com/blog/how-much-is-my-laptop-worth, https://www.gadgetsalvation.com/blog/dell-laptops-depreciation-how-to-maximize-resale-value/).
- **[Derived] Practical implication:** prefer business-line and Apple stock, because it **holds value longer** and so survives the time cost of wiping and testing. Consumer mid-range laptops more than about 3 years old are usually not worth the labour.

**How to get real AU curves [Open — TRY]:** for 10 common fleet models (Latitude 5x00, EliteBook 8x0, ThinkPad T/X, Surface, MacBook Air M1/M2, iPhone 11–14, Galaxy S2x, iPad 9th gen), record 5 eBay AU **sold** prices per model-year once a month during the pilot. WorkVentures' shop gives a refurb *retail* ceiling (A$359–699 for 2019–2021 business laptops).

---

## 1.3 The 60-second visual red-flag list

Compiled from FRNSW damaged-battery definitions (already in repo), Apple LCI guidance and refurbisher checklists:

| Look for | Means | Action |
|---|---|---|
| Trackpad raised or clicking oddly, gaps at case seams, screen lifting, back cover bulging, device rocks on a flat table | **Swollen battery** | **Reject.** Never charge it |
| Red/pink liquid contact indicator (iPhone 5–13: inside SIM-tray slot; MacBook: in a port) | Liquid contact | Inspect further. Reject if there's corrosion or it won't power on. Note humidity can trigger LCIs. ([Apple](https://support.apple.com/en-us/109350), [Primary]) |
| Green/white crust on ports or screws, sticky keys, stained keyboard | Liquid damage | Reject unless it's high value and parts-only |
| Missing screws, stripped screw heads, pry marks, mismatched panel colours | Previous repair or harvesting | Inspect: may be missing RAM/SSD/battery |
| Cracked hinge, lid wobbles, display cable visible | Hinge failure (common and often expensive) | Price as repair, or reject |
| Burnt smell, scorch marks, melted charger tip | Electrical or thermal failure | **Reject** |
| No charger, or an unbranded/unmarked charger | Unknown safety; adds cost | Deduct the charger cost; never use an unmarked charger |
| Asset tags or "property of ..." labels with no paperwork; sanded or defaced serial | Provenance risk | **Reject** without credible authority to transfer |
| Heavy dust, nicotine film, pet hair, insects | Contamination, health and cleaning time | Reject at Phase 0 (already policy) |

---

## 1.4 Lock detection: how to find each lock before accepting

| Lock | How to detect | Who can remove it | Source |
|---|---|---|---|
| **Apple Activation Lock (iPhone/iPad)** | There's **no remote check any more** (Apple removed its IMEI checker around 2017). With the device in hand: Settings → name → if an Apple ID is shown, it's linked. After an erase, if setup asks for the previous Apple ID, it's locked. | Only the owner (or Apple with proof of purchase) | [Secondary] https://www.imore.com/how-check-activation-lock-buying-used-iphone |
| **Apple Activation Lock (Mac)** | System Information → Hardware → **"Activation Lock Status: Enabled/Disabled"**. | Owner | [Secondary] https://appleinsider.com/articles/25/12/05/how-to-buy-a-used-mac-and-not-get-ripped-off |
| **Apple Business Manager / DEP (supervised)** | After an erase, Setup Assistant shows a **"Remote Management"** screen naming the organisation. | Only the organisation: release the device from ABM | [Secondary] https://www.ibm.com/support/pages/adding-ios-device-apple-business-manager-using-apple-configurator-and-converting-dep |
| **Google FRP (Android)** | After a factory reset, setup asks to "verify the Google account previously synced". Pre-acceptance test: ask the donor to remove the Google account *before* reset, then check Settings → Accounts is empty. | Owner | Already in repo |
| **Samsung Knox / carrier lock** | Knox Guard/MDM screens on setup; carrier lock shows when a different SIM is inserted. | Org / carrier | **[Open]** |
| **Windows Autopilot** | Microsoft: the device is auto-enrolled to the tenant "on first boot-up during OOBE". During setup the OOBE shows the **organisation's welcome/sign-in page**. The **Company Portal** app on a running machine is another hint. | Only the registering org (Intune/M365) or its OEM/CSP. A refurbisher **cannot** deregister. Microsoft: "whenever a device permanently leaves an organization, the device should always be deregistered." If another org's welcome page appears, a Microsoft support case is the only fix. | [Primary] https://learn.microsoft.com/en-us/autopilot/autopilot-motherboard-replacement |
| **Chromebook enterprise enrolment / forced re-enrolment** | Sign-in screen says "This device is managed by ...". After a Powerwash with forced re-enrolment on, it re-enrols automatically. | Only the org (deprovision in the Google Admin console). Dell notes enrolled Chromebooks "can't be sold as a refurbished system". | [Primary] https://www.dell.com/support/kbdoc/en-us/000132776/ ; [Secondary] https://www.incidentiq.com/blog/how-to-deprovision-a-k-12-chromebook-with-ease |
| **ThinkPad supervisor (BIOS) password** | Password prompt on F1/Enter at boot. | **Nobody, practically.** Lenovo: no master password or backdoor. The remedy is a **system-board replacement** with proof of purchase. | [Secondary, quoting Lenovo docs] https://forums.lenovo.com/t5/Lenovo-All-In-One-AIO-Desktops/Forgot-BIOS-supervisor-password/m-p/5236104 |
| **Dell/HP BIOS admin passwords** | Prompt on F2/F10 setup. | Varies by model; some need a vendor unlock code with proof of ownership | **[Open]** |
| **Computrace / Absolute persistence** | BIOS security menu shows "Absolute/Computrace: Activated". | Owner org via the Absolute console | Already flagged in repo; detection method **[Open]** |

**[Derived] Operating rule:** for any organisation-sourced fleet, the transfer form must include a **signed declaration that the devices are released from ABM/Autopilot/Intune/Google Admin/Absolute and that BIOS passwords have been removed**, with a list of serials. Then **spot-check 10%** by erasing and booting to setup before collection. This matches the repo's existing WorkVentures/Reconnect lesson ("MDM locks destroy reuse value").

---

## 1.5 Stolen / blocked device checks

- **AMTA IMEI check** (free): confirms whether a handset is **blocked on Australian networks** after being reported lost or stolen. A blocked phone can't make calls, send texts or use data, and a new SIM won't fix it. **There can be a 3–5 day delay** between a report and the block showing. Find the IMEI with `*#06#`. AMTA also publishes **terms for its IMEI Lookup Service** (a separate bulk/API service; the T&Cs PDF exists, but the terms weren't readable during this research). Sources: https://amta.org.au/consumer-advice/check-the-status-of-your-handset/ , https://amta.org.au/wp-content/uploads/2024/05/AMTA-IMEI-Lookup-Service-TCs.pdf [Primary page; it returned 403 to automated fetch, content via search snippets]
- **Rule:** run the AMTA check at intake **and again just before sale** (the delay window matters).
- **Laptops have no equivalent public register.** Rely on provenance paperwork. If a second-hand dealer licence applies, the statutory police-reporting system becomes the check. **[Open — Fair Trading]**

---

## 1.6 Battery-health thresholds and how to read them

| Standard | Threshold |
|---|---|
| Back Market (all grades) | **≥80%** capacity; Premium **≥90%** genuine battery. [Primary] https://pro.backmarket.com/pages/grading |
| Reebelo AU | **80–100%**; minimum guarantee 80%, 85%+ on selected products; **12-month warranty minimum**; 30-day change-of-mind. [Primary/Secondary] https://reebelo.com.au/policies/warranty-and-refund-policy |
| Apple MacBooks | Most 2010+ models are rated to **1,000 cycles**. "Service Recommended" usually appears below about 80%. [Secondary] https://www.turtlebar.app/guides/macbook-battery-cycle-count |

**How to read battery health (free):**
- **Windows:** `powercfg /batteryreport` → compare *Full charge capacity* with *Design capacity*.
- **macOS:** System Information → Power → Cycle Count and Condition.
- **iPhone:** Settings → Battery → Battery Health. iPadOS/older iOS need a Mac tool (coconutBattery, 🔎 not verified).
- **Linux live USB:** `upower -i /org/freedesktop/UPower/devices/battery_BAT0` (energy-full vs energy-full-design).

**[Derived] Rule:** ≥80% → list normally and state the %. 70–79% → replace the battery if a part is under about 20% of the sale price, otherwise disclose and discount. <70%, or Apple/Windows says "service" → replace or treat as parts. Swollen at any % → reject.

---

## 1.7 Time budget per stage

No public benchmark exists for a one-person operation. The repo's only figure is Reconnect's **~A$200 average restore cost**. **[Open — TRY]:** time the first 30 items. Suggested starting budgets to test:

| Stage | Budget |
|---|---|
| Pre-screen (phone/photos) | 5 min |
| Door triage (look, locks, power-on) | 5–10 min |
| Wipe (unattended, parallel) | 10 min hands-on |
| Function test | 20 min |
| Clean + photos + listing | 30 min |
| **Total target per resale laptop** | **≤75 min hands-on** |

At a A$400 sale with about A$100 of costs, 75 min gives roughly A$240/hr gross, which is clearly worth it. At 3 hours it drops to about A$100/hr.

---

## 1.8–1.9 Rejection log and missing tracker fields

These were added as new **template files** (not edits to `pilot-tracker.csv`, to avoid conflicting with other agents working in this repo):

- `templates/triage-reject-log.csv`: one row per *declined* enquiry or item, recording the reason code.
- `templates/triage-fields-addendum.csv`: extra columns to join to `pilot-tracker.csv` by `asset_id` (cosmetic grade, battery %, cycle count, CPU generation, lock checks, triage minutes, decision reason, pre-screen accuracy).

Reason codes: `LOCK-APPLE`, `LOCK-FRP`, `LOCK-MDM`, `LOCK-BIOS`, `IMEI-BLOCKED`, `BATTERY-DAMAGE`, `LIQUID`, `BELOW-SPEC`, `NO-EXIT`, `PROVENANCE`, `CONTAMINATED`, `STORAGE-FULL`, `CATEGORY-REFUSED`, `OTHER`.

---

## 1.10–1.11 Bulk lots and junk fees: what the benchmarks charge

| Operator | Policy found |
|---|---|
| **Bendigo E-Waste** | Drop-off is **free 24/7** for computers/IT, TVs, consoles, audio, printers, small whitegoods and mobiles. **Charged per kg:** loose household batteries, media (tapes/DVDs/CDs), other battery types (rate not published). **Collections from A$150** within 10 km of the CBD. **Not accepted:** vapes, used toner/cartridges, general waste. **"Items must arrive complete and unlocked"**; locked devices are "processed as such". Data destruction is offered at "affordable prices". [Primary] https://www.bendigoewaste.com.au/services-7 , https://www.bendigoewaste.com.au/book-a-collection |
| **Reconnect** | Asks **A$5/device** for a Blancco erasure certificate (already in repo). |
| **FlipTech / ITC** | Quote-based. Pricing not public (already in repo). **[Open — CALL]** |

**[Derived] Dubbo rule for mixed business lots:** quote the **whole lot** as `collection fee + A$X per non-reusable item (or per kg) − buyback for reusable items`, and require an asset list and photos beforehand. This mirrors the "service fee − residual value" structure already in `NSW-FLIPTECH-EQUIVALENTS-DEEP-DIVE.md` §11. Don't take "all or nothing" lots unless the junk share is priced in.

---

## 1.12 Donor-to-whole ratios

There's no public data. **[Open — TRY]:** if a business lot of one model arrives, record how many units become sellable whole, how many become donors, and which parts were actually reused.

---

## Draft one-page triage matrix (v0.1 — validate in the pilot)

| Category | ACCEPT if | INSPECT if | REJECT if |
|---|---|---|---|
| Laptop (Windows) | Intel 8th+/Ryzen 2000+, unlocked, no damage | 6th–7th gen (donation/Linux), battery <80%, no charger | Locked/BIOS-pw/Autopilot, swollen, liquid corrosion, ≤5th gen consumer |
| MacBook | macOS-supported model, Activation Lock **Disabled**, no Remote Management screen | Battery "Service", cosmetic damage | Activation Lock Enabled, MDM, liquid |
| Desktop / mini PC | 8th gen+ SFF/mini | Older business desktops (parts value only) | Big towers ≤4th gen, no exit |
| iPhone / iPad | Supported iOS, Apple ID signed out, AMTA clear, battery ≥80% | Battery 70–79%, cracked back | Activation Lock, AMTA blocked, swollen, 3G-only |
| Android phone | Supported Android, Google account removed, AMTA clear | Screen burn-in, battery wear | FRP lock, blocked, swollen, 3G-only |
| Chromebook | Auto-update expiry ≥2 years away, not enterprise-enrolled | — | "Managed by" screen, expired updates |
| Monitor | ≥22" 1080p, stand present, no dead pixels | Missing stand | Cracked, CRT |
| TV | Pre-approved flat panel, working | — | Cracked panel, CRT, no storage space |

## Sources (this section)

- Back Market Pro grading: https://pro.backmarket.com/pages/grading
- Back Market battery guide: https://www.backmarket.com/en-us/c/smartphone-guides/refurbished-phone-battery
- Reebelo AU warranty/refund: https://reebelo.com.au/policies/warranty-and-refund-policy
- AMTA IMEI status check: https://amta.org.au/consumer-advice/check-the-status-of-your-handset/
- AMTA lost/stolen: https://amta.org.au/lost-stolen/
- Microsoft Autopilot repair/deregistration: https://learn.microsoft.com/en-us/autopilot/autopilot-motherboard-replacement
- Dell Chromebook enrolled-return issue: https://www.dell.com/support/kbdoc/en-us/000132776/
- Lenovo supervisor-password policy (community thread quoting Lenovo docs): https://forums.lenovo.com/t5/Lenovo-All-In-One-AIO-Desktops/Forgot-BIOS-supervisor-password/m-p/5236104
- Apple liquid damage: https://support.apple.com/en-us/109350
- Activation Lock checks: https://www.imore.com/how-check-activation-lock-buying-used-iphone ; https://appleinsider.com/articles/25/12/05/how-to-buy-a-used-mac-and-not-get-ripped-off
- WorkVentures refurbished laptop shop: https://shop.workventures.com.au/product-category/refurbished-laptop/
- Bendigo E-Waste what we accept / collections: https://www.bendigoewaste.com.au/services-7 ; https://www.bendigoewaste.com.au/book-a-collection
- Depreciation (secondary, US vendor blogs): https://buybackxstores.com/blog/how-much-is-my-laptop-worth ; https://www.gadgetsalvation.com/blog/dell-laptops-depreciation-how-to-maximize-resale-value/
