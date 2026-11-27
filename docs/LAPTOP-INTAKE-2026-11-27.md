# Numbered laptop intake — 27 November 2026 (Dubbo)

**Status:** photo-based preliminary triage only; no power-on, functional, battery, ownership, sanitisation or resale clearance confirmed. Intake numbers 1–10 are physical batch labels, not AssetFlow asset IDs. This public field note deliberately omits serials, service tags, customer/job labels, Windows keys, MAC addresses and raw photos. Private evidence and serialized inventory belong in the authenticated AssetFlow workflow.

## Inventory

| # | Identification / confidence | Observed condition and components | Preliminary disposition |
|---|---|---|---|
| 1 | Lenovo Miix 520-12IKB (20M3/20M4 family); board FRU 5B20Q58600 supports Core i5-8250U and 8 GB onboard RAM | Fan present but CPU heatpipe/heatsink absent; exposed thermal paste; battery and apparent M.2 storage absent. Display/keyboard and charger condition unknown. | High potential, hold power until correct cooling assembly fitted. |
| 2 | ASUS ZenBook Pro Duo UX581L (cover label), likely UX581LV (2020) | RTX Studio label; twin fans, extensive dust, missing battery and apparent M.2 SSD; 16/32 GB soldered RAM per ASUS UX581LV specifications. Loose internal speaker; exposed chip appears to be PCH, not CPU; exact chip identity and cooling requirements not independently verified. | First restoration candidate; clean, secure speaker, verify correct adapter and cooling before POST. |
| 3 | HP laptop; previous working hypothesis Pavilion dv6-6025tx, not yet independently confirmed | One installed SO-DIMM, second slot appears empty, Wi-Fi card present; battery and 2.5-inch drive appear absent. Windows-era licence sticker present (not recorded). | Fastest fallback POST candidate with compatible charger and existing RAM; confirm HP product ID and module specs. |
| 4 | Toshiba Satellite C650D/006 (PSC16A-006011) | Empty visible RAM slots, empty 2.5-inch bay, no battery; DC label 19 V / 3.42 A. DDR3 family; CPU not verified on physical unit. | Low-cost donor/retro Linux candidate; test with known-good compatible DDR3 only if worthwhile. |
| 5 | Dell XPS 15 L502X (P11F003, confirmed from label crop) | DDR3-marked area with visible empty slots; cracked underside, very dusty fan, battery absent. Drive status not established. Exact CPU/GPU unknown. | Medium; clean, inspect structural damage, install compatible RAM for POST. |
| 6 | ASUS F55A (label) | Empty visible SO-DIMM slot, empty drive bay, absent battery; Wi-Fi card present. DDR3-era platform; exact CPU, soldered memory and voltage requirements need checking. | Medium; inexpensive POST check with compatible parts. |
| 7 | Dell PP22L, likely Inspiron 1520 or related chassis | DDR2 ONLY label; visible empty SO-DIMM slot (other slot not inspected), battery absent; WLAN card present; other internal components/storage not checked. | Low; retro or parts donor, no DDR3 substitution. |
| 8 | Label NT16-PRO-C-E, date-like marking 20170908.13 | Exterior only; some screw positions empty. Exact manufacturer, CPU, memory, storage and battery unknown. Prototype hypothesis unverified. | Investigate labels/internal configuration before spending. |
| 9 | Label LI9 C1-C-Test (second character ambiguous: I or 1) | Exterior label explicitly states regulatory approvals incomplete and not for sale or lease; lists CPU, RAM and HDD as NO, 11.6-inch HD display, 802.11ac and 15 V / 2 A adapter. These describe label configuration, not verified current contents. | Segregate from sale/lease stock; possible engineering sample or test chassis. Check ownership, internals and regulatory status. |
| 10 | Unidentified white laptop | Exterior only; no model visible, some screw positions empty. Internal components uninspected. | Identify make/model and inspect before power. |

## First restoration: #2

Prioritise potential performance/reuse value with an intact cooling assembly. #1 has a known modern CPU but requires cooling parts before any power-on; #3 is the quickest fallback for a low-effort POST.

1. Record exact ASUS model/board ID privately; verify charger voltage, polarity, connector and wattage against manufacturer documentation. Check battery connector, board damage, corrosion and loose metal; disconnect all power.
2. Clean both fans and heatsink exhaust fins, holding fan blades stationary during air cleaning; avoid disturbing heatsink unnecessarily. If removed, replace thermal paste and preserve correct thermal pad thickness.
3. Confirm RAM topology and fit only compatible known-good memory if required. Reconnect required display, keyboard/power-button and cooling leads.
4. With no donor storage attached and a compatible known-good adapter, attempt POST/UEFI. Watch for abnormal heat, smoke, smell or fan failure; stop on any anomaly. No assumption that this unit can run without a battery until tested.
5. If POST succeeds, record CPU/GPU/RAM, check for management/firmware locks through authorised means, run a bootable diagnostic or Linux live USB, and test temperatures, screen, keyboard, Wi-Fi and ports. Do not run heavy GPU stress before confirming cooling.
6. Only then estimate parts cost and decide on SSD/battery replacement. Use new or verified sanitised media. Complete documented ownership, data sanitisation, electrical/battery safety, grading and functionality checks before release.

Fallback order: #3 for quick POST; #1 once correct heatsink is available; #5 and #6 for low-cost tests; #8–10 for identification (hold #9 from sale/lease); #4 and #7 for donor/retro assessment. No unit is classified dead from photos alone.

## Verification references

- Lenovo board FRU lookup: https://store.emprgroup.com.au/p-492173-5b20q58600.aspx
- Lenovo model cross-reference: https://store.emprgroup.com.au/lenovo-898966-20m40000au-miix-520-12ikb-type-20m3-20m4-tablet-lenovo-type-20m4-20m40000au.aspx
- Toshiba model support: https://support.dynabook.com/support/modelHome?freeText=1200014042
- Dell regulatory model mapping: https://www.dell.com/en-us/legal/lp/product-info-datasheets-archived
- Dell PP22L cross-reference: https://www.parts-people.com/blog/2016/03/16/dell-laptop-regulatory-model-reference-guide/
- ASUS F55A platform reference: https://www.notebookcheck.net/Review-Asus-F55A-Notebook.88064.0.html

Related local procedures: [intake policy](INTAKE-POLICY.md), [bench test sheet](bench-test-sheet.md), [bench SOP](BENCH-SOP-AND-LAYOUT.md), [battery/electrical safety](RESEARCH-06-BATTERY-ELECTRICAL-WORKSHOP-SAFETY.md), [grading standard](DUBBOEWASTE-GRADING-STANDARD.md).

## Follow-up inspection — #2 (27 November 2026)

Cover label UX581L and RTX Studio branding identify ASUS ZenBook Pro Duo; likely UX581LV. ASUS publishes i7-10750H or i9-10980HK, RTX 2060 6 GB, 16/32 GB soldered DDR4, M.2 PCIe NVMe, 15.6-inch 4K OLED and 14-inch secondary display, and 230 W adapter (19.5 V / 11.8 A, 6.0 mm connector). Exact fitted CPU/RAM and functionality remain untested. No RAM purchase needed for this model. The uncovered die appears to be the chipset/PCH; do not apply paste or add a heatsink without confirming factory configuration. The loose wired component appears to be a speaker; refit it to its rubber mounts or disconnect it safely before power, and check for loose screws, damaged wires, missing insulating sheets and thermal contact materials. Clean fan blades and exhaust fins with power disconnected and blades held still. Refit bottom cover before power where practicable. Attempt BIOS with correct ASUS adapter, no SSD or battery; adapter-only boot not guaranteed. No purchase of battery or SSD before POST confirmation.

- ASUS specifications: https://www.asus.com/laptops/for-home/zenbook/zenbook-pro-duo-ux581/techspec/
- ASUS repair guide: https://dlcdnets.asus.com/pub/ASUS/nb/Customer_self_repair_guide/UX581LV_Customer_Self_Repair_Guide_20210706.pdf

## Second-pass review — label zoom and batch notes (27 November 2026)

Photo crops re-checked against the inventory table. Still no power-on; nothing below changes the "no unit classified dead from photos" rule.

- **First restoration stays #2.** It has the highest reuse value in the batch, and none of its known gaps (battery, SSD) needs a purchase before a POST attempt. The real gate is the correct 230 W ASUS adapter; if one isn't on hand, #3 is the quick POST fallback.
- **#3 product number.** The base label carries HP product number LR735PA#ABG (Australian SKU). Use it on HP support to confirm or reject the dv6-6025tx hypothesis before buying RAM or a charger.
- **#5 confirmed.** Regulatory label reads Reg Model P11F / Reg Type P11F003, matching XPS 15 L502X.
- **#6 drive bay.** The silver plate in the 2.5-inch bay carries an ASUS part label, consistent with a bracket/shield rather than a drive. Lift it to confirm before recording the unit as non-data-bearing.
- **#6 previous-repairer job sticker.** A third-party repair shop's job label with a previous customer's details is on the base (deliberately not transcribed). Remove it physically before the unit goes anywhere, and treat it as a provenance flag: confirm transfer authority covers this unit.
- **#9 label detail.** LCD listed as B116XTN02.3 (11.6-inch HD, anti-glare), a common AUO panel worth keeping as a spare even if the chassis stays segregated. Adapter listed as 15 V / 2 A (PA-1300-43QD). Model, serial and P/N share the same LI9/L19 prefix.
- **Batch pattern.** Batteries are absent on every opened unit and storage on most; several also had RAM pulled. Treat the batch as shells: estimate parts cost per unit before committing labour, and don't promise any unit to a recipient until it has posted.
- **AMR returns (conditional).** If this batch came through the AMR set-aside arrangement, #4 and #7 are the clearest return candidates unless wanted as parts donors. #9 needs an ownership/regulatory decision rather than a default return.

## Adapter matching — loose charger pile (27 November 2026)

Matched from label photos only; no plug has been measured and no adapter has been metered. Rule for any match: same voltage, centre-positive polarity, correct plug size, and wattage at or above the laptop's requirement. An undersized adapter is for a BIOS/POST check only, never for release with a unit. Adapter serials and barcodes deliberately not recorded.

| Adapter (label) | Output | Plug | Batch match |
|---|---|---|---|
| Lenovo ADP-65ME B (PN GX21J75537) | 20 V 3.25 A, 65 W | Lenovo round tip | **#1 Miix 520** (Lenovo specifies a 45 W round-tip adapter). Hold power until #1's cooling assembly is fitted. |
| HP TPC-LA58 / PA-1650-39HA | 19.5 V 3.33 A, 65 W | 7.4 × 5.0 mm HP smart pin | **#3 HP** (dv6 family uses 7.4 mm). Undersized against the 120 W adapter listed for dv6-6000: POST/BIOS only. |
| ASUS square 65 W | 19 V 3.42 A | Unmeasured: 5.5 × 2.5 or 4.0 × 1.35 mm | **#6 F55A** if 5.5 × 2.5 mm. Same rating and plug as **#4 C650D** if 5.5 × 2.5 mm. |
| Generic "Replacement AC Adapter" HLY19004740 | 19 V 4.74 A, 90 W | Unmeasured | #4 or #6 if 5.5 × 2.5 mm. Unknown maker: meter output under load before use. |
| Toshiba PA3822E-1AC3 (two units) | 19 V 2.37 A, 45 W | Toshiba 5.5 × 2.5 mm | Fits #4 C650D but undersized (unit needs 19 V 3.42 A): POST only. |
| Toshiba PA3378E-3AC3 | 15 V 5 A | Toshiba 15 V series | No 19 V match. Voltage matches #9's label (15 V) only; #9 remains segregated. |
| Toshiba PA3378E-2ACA | 15 V series | — | Casing wrapped in electrical tape: treat as damaged; reject and recycle. |
| Dell LA65NM190 | USB-C PD, up to 20 V 3.25 A, 65 W | USB-C | No match in this batch (see #2 below). Keep for other stock. |
| Lenovo ADLX90NCC3A | 20 V 4.5 A, 90 W | Lenovo slim tip | No match in this batch. |
| Unbranded 65 W (model string suggests 19.5 V / 3.33 A) | 19.5 V 3.33 A (partly legible) | Unmeasured | Unknown until plug identified. |
| LG ADS-24NP-12-1; UES24-120200SPA3; Delta DA-48M12 | 12 V (2 A, 2 A, 4 A) | — | Not laptop supplies. Keep off the laptop bench; some may physically fit laptop jacks. |

**No adapter in the pile for:** #2 (needs the ASUS 230 W, 19.5 V / 11.8 A, 6.0 mm adapter; ASUS states the Pro Duo's USB-C port supplies power out but does not accept power in), #5 and #7 (both need a Dell 19.5 V barrel adapter; the only Dell unit here is USB-C), #8 and #10 (unidentified).

**Consequence for bench order:** #2 remains the restoration priority but is blocked on sourcing the 230 W adapter. #3 is the only unit that can reach BIOS with what is on hand today (RAM fitted, matching plug).

References (official sources first; retailer listings are lower-confidence cross-checks):
- Lenovo PSREF, Miix 520-12IKB (45 W round-tip adapter): https://psref.lenovo.com/syspool/Sys/PDF/Lenovo_Tablets/Miix_520_12IKB_BE/Miix_520_12IKB_BE_Spec.pdf
- ASUS ZenTalk, Pro Duo USB-C power-out only (UX581GV sibling model): https://zentalk.asus.com/t5/zenbook/charging-the-asus-zenbook-pro-duo-through-the-thunderbolt-port/m-p/151050
- Retailer: ADP-65ME B / GX21J75537 listed as 65 W round tip: https://www.flipkart.com/lenovo-adlx65clgi2a-65-w-round-tip-ac-adapter/p/itm12fc7618402e6
- Retailer: PA-1650-39HA listed with 7.4 × 5.0 mm plug: https://www.newegg.com/p/2S7-07JP-1CED2
- Retailer: HP 120 W adapter listed for dv6-6000: https://pages.cs.wisc.edu/~qing/CS784/Stage1/Amazon_html/httpwww.amazon.comHP-Smart-Adapter-120W-VE025AAdpB002UACM0Y.html
