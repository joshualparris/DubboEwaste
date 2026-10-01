# Research 01 — front-door triage and route decisions

**Status:** first deep research tranche; operational draft, not legal or electrical advice
**Research date:** 2 October 2026
**Scope:** decide whether an offered electronic item should be accepted, refused, held for inspection, routed to a partner, or sent to material recycling.

This report closes the first P0 gap from [`codexGAPS.md`](codexGAPS.md). It is intentionally narrower than the rest of the repository: it does not attempt to resolve premises approval, second-hand-dealer licensing, insurance, downstream contracts, or a complete product-testing certification programme. It defines the evidence and workflow needed before those decisions can be made safely.

## Executive finding

The most defensible Phase 0 triage rule is:

> Accept an item only when ownership, safety, data/lock status, a realistic route, and a storage position are all sufficiently known. If any one of those gates is unresolved, do not accept it as ordinary stock.

There is no honest universal “older than X years = junk” or “i5 = good” rule. The route depends on category, exact model, battery, lock state, supported software, condition, local demand, labour, parts, shipping, warranty exposure, and the cost of a failed exit. The first version should therefore use conservative category lanes and learn thresholds from a closed pilot.

The proposed system has three stages:

1. **Pre-screen:** photos and questions before the person travels.
2. **60-second arrival screen:** safety, ownership, data/lock, and obvious route.
3. **Bench triage:** controlled testing, sanitisation, route decision, and record.

The front door must not become a place where unknown batteries are charged, locked devices are accepted on promises, or mixed junk is accumulated for later sorting.

## Evidence and limits

### Confirmed from current primary sources

- The ACCC says businesses supplying products, including second-hand products sold online, are responsible for product safety and consumer guarantees. It recommends sourcing and testing processes, recall/ban checks, and records. See [Know how to sell safe products](https://www.productsafety.gov.au/business/know-how-to-sell-safe-products) and [How to source and test products](https://www.productsafety.gov.au/business/know-how-to-sell-safe-products/how-to-source-and-test-products).
- NSW EPA guidance says damaged batteries must not be binned, some Community Recycling Centres accept embedded batteries, and businesses are not eligible for household CRC services in the ordinary way. See [Never bin a battery](https://www.epa.nsw.gov.au/Your-environment/Recycling-and-reuse/never-bin-a-battery), [Embedded batteries](https://www.epa.nsw.gov.au/Your-environment/Recycling-and-reuse/household-recycling-overview/embedded-batteries), and [Find Community Recycling Centres](https://www.epa.nsw.gov.au/Your-environment/Recycling-and-reuse/household-recycling-overview/find-crcs-or-hcco).
- Apple says Activation Lock must be removed before an Apple device is ready for a new owner. See [Remove a device from Find My](https://support.apple.com/en-euro/guide/iphone/ipha94b7686e/27/ios/27).
- Microsoft says an organisation must remove a device from Windows Autopilot and MDM/tenant associations when it leaves the organisation. See [Remove association from a device](https://learn.microsoft.com/en-us/autopilot/device-preparation/device-association/remove-association).
- Microsoft publishes current Windows 11 minimum requirements and PC Health Check guidance, but those requirements do not establish resale value or reliability. See [Windows 11 system requirements](https://support.microsoft.com/en-us/windows/experience/compatibility/windows-11-system-requirements) and [PC Health Check](https://support.microsoft.com/en-us/windows/experience/compatibility/how-to-use-the-pc-health-check-app).
- The national training register describes [UEE20520 Certificate II in Computer Assembly and Repair](https://training.gov.au/Training/Details/UEE20520/qualdetails?pageSize=50&tableUnits-page=1) as covering computer assembly and routine hardware repairs, generally by replacement of known faulty components. This is a possible skills pathway, not a finding that the business must hold the qualification.

### Important limits

- A visual inspection or boot test is not proof that a device is electrically safe, free of malware, data-free, or suitable for resale.
- A factory reset is not a universal media-sanitisation method for every computer, SSD, removable medium, network appliance, or managed device.
- A public recycler’s acceptance list is not proof that the recycler provides secure data destruction or accepts a small business’s exact load.
- A device passing Windows 11 compatibility is not proof of battery health, durability, performance, licence status, or buyer demand.
- Online creator videos can teach techniques and failure patterns but cannot replace Australian safety, privacy, consumer-law, or manufacturer instructions.

## Tool and research-agent assessment

The requested research-agent projects were checked for local availability and repository metadata before this tranche.

### Available locally

- `curl`, `git`, `gh`, Node/npm, and Python 3 were available.
- `gpt-researcher`, `deep-research`, `ollama`, `ddgr`, and `uv` were not installed.
- No local model endpoint was available, so a local-first LLM workflow could not be honestly claimed.

### Why the listed agents were not installed into the repository

Installing a multi-agent framework would add dependencies, credentials, network/API assumptions, and a second research pipeline before the first question was defined. The first tranche therefore used the available web search, direct source opening, GitHub metadata, repository search, and source-by-source synthesis.

The projects also are not uniformly turnkey or cost-free in operation:

- [GPT Researcher](https://github.com/assafelovic/gpt-researcher) is Apache-2.0, but its setup documents Python dependencies plus provider/search API keys. The software may be free; the complete research run may not be.
- [dzhng/deep-research](https://github.com/dzhng/deep-research) is MIT, but its setup expects an OpenAI-compatible model endpoint and search/provider configuration. A local endpoint would still need to be installed and provisioned.
- [K-Dense scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) is MIT and can be installed as skills, but it is primarily a collection of research capabilities rather than a zero-configuration evidence engine.
- [lifan0127/ai-research-assistant](https://github.com/lifan0127/ai-research-assistant) is AGPL-3.0 and its README expects an OpenAI API key and a Zotero-oriented workflow; it is not a direct fit for this local business audit.
- Several names in the user’s list did not resolve to the exact GitHub repositories stated, so no attribution or installation was guessed for them.

The tool decision can be revisited after the research schema and source ledger stabilise. Any future agent must emit URLs, retrieval dates, claims, quotations/paraphrases, confidence, and unresolved contradictions; a long report without provenance is not a research improvement.

## The triage decision model

### Gate 0 — pre-screen

Ask for:

1. category and exact make/model;
2. clear photographs of front, rear, labels, ports, battery area, charger, and damage;
3. whether it powers on and what it does;
4. known liquid, heat, smoke, impact, swelling, or fire exposure;
5. whether it has an Apple, Google, Microsoft, Samsung, carrier, MDM, Autopilot, BIOS, or other account/management lock;
6. whether the person owns it or has written authority to transfer it;
7. serial/IMEI if visible;
8. included charger/accessories;
9. quantity and source;
10. whether it contains business, customer, school, health, financial, or other sensitive data.

Return exactly one preliminary outcome:

- **ACCEPT FOR ARRIVAL SCREEN** — no obvious hazard and a plausible route;
- **ACCEPT ONLY WITH MORE INFORMATION** — model, ownership, lock, or condition is unclear;
- **PARTNER-ONLY** — likely useful but outside Phase 0 capability or requires a specialist route;
- **REJECT / KEEP IT** — obvious safety, lock, ownership, contamination, or no-route failure.

Do not promise that an item will be accepted merely because it appears in a category list.

### Gate 1 — 60-second arrival screen

Do not plug in or charge anything during this screen.

| Check | Pass signal | Immediate outcome if failed or uncertain |
|---|---|---|
| Battery/physical safety | no swelling, leaking, puncture, crushing, heat, smoke, corrosion, liquid/fire history, or suspicious smell | reject; do not charge; use an approved advice/referral route |
| Electrical/contamination | intact casing, no exposed mains parts, infestation, mould, wetness, toner spill, or unsafe charger | reject or partner-only |
| Ownership | credible owner or authority to transfer; serial/IMEI not suspiciously altered | reject/hold until authority is evidenced |
| Data/lock | donor can legitimately remove accounts/management, or a documented specialist route exists | reject ordinary resale intake if unresolved |
| Category route | exact item has a possible whole, repair, donor, collector, donation, or named recycling route | reject if no realistic route |
| Storage | labelled, dry, secure position exists | defer intake; do not create a pile |

If the item fails one check, record the reason and return it with the donor where safe. Do not accept hazardous material merely to be helpful.

### Gate 2 — controlled bench triage

Only items that pass the arrival screen enter this sequence:

1. assign an asset ID;
2. photograph condition and labels;
3. record serial/IMEI privately;
4. record ownership and transfer basis;
5. identify all data-bearing media and management/account state;
6. isolate as `UNWIPED — RESTRICTED`;
7. inspect battery, charger, casing, connectors, ports, and liquid indicators;
8. perform a safe power-on test only if the device passes the safety check;
9. run category-specific tests;
10. determine whole-device, repair, parts, donation, partner, recycling, or reject route;
11. sanitise using a media-appropriate method before repair/resale/donation where data is present;
12. verify sanitisation and record the result;
13. repair only with an approved time/parts ceiling;
14. retest all affected functions;
15. photograph and describe defects honestly;
16. move the asset to one labelled route location.

## Category triage matrix — provisional Phase 0 version

These are conservative starting lanes, not permanent thresholds. They must be tested against actual local outcomes.

### Laptops, desktops, and mini PCs

**Accept for inspection when:** identifiable model, intact casing, no battery hazard, credible ownership, no unresolved management/account lock, and a plausible resale/parts route.

**Quick tests:** visual/serial, charger, POST/UEFI, display, keyboard/trackpad, USB and video ports, storage detection/health, memory, Wi-Fi/Bluetooth, camera/mic/speakers, thermals/fan, sleep/wake, charging, and shutdown.

**Route modifiers:**

- Windows 11 compatibility is a useful listing/route field, not a complete quality grade.
- Record TPM/Secure Boot/CPU eligibility and use PC Health Check or equivalent evidence rather than an age guess.
- Check BitLocker, BIOS passwords, Windows Autopilot, Intune/MDM, and organisation ownership.
- Unsupported hardware may still have a named Linux, vintage, collector, parts, or donation route, but do not assume a buyer exists.
- A dead storage device is not automatically a dead computer; a board with no POST, liquid damage, or severe hinge/panel damage needs a repair-cost decision.

**Provisional reject/partner-only:** exposed battery, liquid/fire damage, no authority, tenant lock, unsafe charger, missing identity, severe structural damage, or no route after a bounded test.

### Phones and tablets

**Accept for inspection when:** model/IMEI is identifiable, battery is not damaged, account/activation protection can be legitimately cleared, ownership is credible, and Australian network use or a parts route is plausible.

**Quick tests:** power, touch/display, cameras, microphones/speakers, charging port, Wi-Fi/Bluetooth, SIM/eSIM/network status where appropriate, buttons, biometrics where appropriate, battery health indicators, serial/IMEI, and clean setup screen after authorised reset.

**Hard stop:** Apple Activation Lock, Google Factory Reset Protection, MDM, carrier lock that cannot be resolved, suspicious IMEI, swollen battery, liquid/fire damage, or no named parts/collector route.

Apple’s current support documentation says removing the device from Find My removes Activation Lock so another person can activate it. For Google devices, use manufacturer instructions and test the post-reset setup state; do not rely on a donor’s assertion that “it was reset”.

### TVs and monitors

**Accept only by prior approval in Phase 0.**

Record model, panel type/size, power condition, cracks, lines, dead pixels, backlight, inputs, remote, stand, and local-pickup constraints. A working flat panel with an intact screen is a different route from a cracked panel, CRT, or unknown high-voltage fault.

**Do not accept:** CRTs, cracked panels, exposed mains components, water/fire damage, or a large display without dry storage and a realistic local buyer/repair route.

### Printers and scanners

Treat as a separate lane. Research toner/ink, embedded storage, account/network data, consumables, firmware locks, transport, and whether resale value exceeds handling and disposal. Do not accept mixed office printer loads merely because they power on.

### Consoles and controllers

Check account/network state, HDMI/video, storage, disc/cart drive, controllers, ports, overheating, fan noise, and known safety/recall issues. Stick drift and HDMI faults need a repair/parts ceiling. Unresolved account locks or missing proprietary accessories can make an apparently working unit uneconomic.

### Cameras, audio, networking, NAS, and smart devices

Create separate category sheets before accepting volume. These devices may contain removable media, credentials, Wi-Fi keys, paired accounts, microphones/cameras, cloud dependencies, subscription locks, or specialist markets. A router/NAS that works but retains configuration data is not ready for resale.

### Loose, removable, embedded, and damaged batteries

Phase 0 should not be a battery-drop service. NSW EPA guidance distinguishes loose batteries, embedded batteries, laptops/computers, mobile phones, and participating collection locations. The exact route depends on the item, local facility, and whether the material is household or business waste.

**Reject immediately:** loose lithium batteries, swollen/leaking/punctured/crushed/overheated/fire/water-affected devices, vapes, e-bike/e-scooter batteries, and unknown battery chemistry.

Do not place a damaged battery in ordinary recycling or a standard collection box. Do not charge it to “see if it works”. Record the refusal and give the donor the current safe-disposal direction only when the receiving route is confirmed.

## Free/open-source bench toolkit to investigate

Use only tools appropriate to the operator’s skill and the device’s safety state. Download from the project’s official source, verify hashes where provided, and record version in the test log.

| Tool | Use | Caution |
|---|---|---|
| [smartmontools](https://www.smartmontools.org/) | HDD/SSD SMART health and identity | SMART is evidence, not a complete life prediction |
| [nvme-cli](https://github.com/linux-nvme/nvme-cli) | NVMe identity, health, error information | avoid destructive commands; preserve output |
| [Memtest86+](https://memtest.org/) | memory testing from boot media | test duration and interpretation need a written policy |
| [stress-ng](https://github.com/ColinIanKing/stress-ng) | bounded CPU/memory/load testing | heat and battery risk; never run blindly on suspect hardware |
| [lm-sensors](https://github.com/lm-sensors/lm-sensors) | Linux sensor/temperature observations | sensor readings vary by hardware and firmware |
| [fwts](https://github.com/fwts/fwts) | firmware/ACPI/platform checks on supported systems | not a resale safety certificate |
| Linux live environment | inspect hardware without trusting an old installed OS | booting can expose or alter data; sanitise and isolate first |
| Windows PC Health Check | Windows 11 eligibility and battery information | Microsoft’s tool is not a full refurbisher test |

Avoid adding closed or questionable phone utilities merely because they are popular. For phones, prefer manufacturer-supported account removal, reset, diagnostic, and service procedures. Do not request or retain a customer’s password.

## Minimum records for each accepted item

The existing `pilot-tracker.csv` is a strong base. Add or clarify:

- `pre_screen_result` and `arrival_screen_result`;
- `refusal_reason_code` or `hold_reason_code`;
- `hazard_observed` and `battery_route`;
- `authority_evidence_type`;
- `account_lock_type` and `lock_clear_evidence`;
- `test_protocol_version`;
- `test_start` and `test_end`;
- `tool_versions` and retained diagnostic output path;
- `route_before_test` and `route_after_test`;
- `repair_attempt_count` and `rework_minutes`;
- `specialist_referral`;
- `listing_condition_grade`;
- `buyer/recipient suitability`;
- `return/defect/recall event`;
- `final_evidence_id` for downstream or donation proof;
- `accept_same_model_again` and the reason.

Never put full names, addresses, passwords, recovery codes, or unnecessary personal data in the public repository. Use private local records and redacted aggregate results.

## Pilot experiment

### Design

Run a closed pilot with 20–30 known-source items, not an open public tip. Suggested initial mix:

- 8–10 laptops/desktops/mini PCs;
- 4–6 phones/tablets;
- 2–4 monitors/flat TVs only if storage and transport are safe;
- 2–4 consoles/cameras/networking items;
- 2–4 deliberate refusals or partner-only cases documented without accepting them.

Do not deliberately acquire hazardous material for training. Use already-safe practice devices or non-powered shells where appropriate.

### Pre-register stop rules

Stop the pilot and review if any of the following occurs:

- battery heat, smoke, swelling, leak, fire, or unexplained odour;
- data exposure or unauthorised account access;
- ownership dispute or suspicious provenance;
- device is accepted without a storage position;
- more than the declared open-repair limit;
- a failed test is recorded as a pass;
- a device is listed before sanitisation/lock clearance;
- downstream provider refuses the material;
- the operator cannot explain the route and expected cost.

### Metrics

Measure by category and route:

- pre-screen acceptance rate;
- arrival refusal rate and reason;
- median front-door minutes;
- bench minutes;
- wipe minutes and failure rate;
- repair minutes, parts cost, and rework;
- resale/listing minutes;
- days to sale/donation/recycling;
- gross contribution per owner labour hour;
- return/defect rate;
- storage occupancy;
- disposal cost and rejected-material count;
- completeness of ownership, lock, test, and final-route evidence;
- near misses and incidents;
- whether the operator would accept the same model again.

Do not use the first successful sale as proof of a viable category. Include failed repairs, unsold stock, returns, refused items, and disposal costs.

## Questions that remain open after this tranche

1. Which current Dubbo/Orana RTOs offer relevant practical units, at what cost and with what equipment?
2. What exact test-and-tag, electrical, battery, soldering, and insurance requirements apply to the proposed scope?
3. Which current local facilities accept business quantities of laptops, phones, embedded batteries, CRTs, printers, and damaged devices?
4. What written evidence will AMR, council, or another downstream provider supply for data-bearing and battery-bearing items?
5. Which exact Windows, Apple, Android, MDM, Autopilot, carrier, and firmware-lock cases are commonly encountered by local repairers?
6. What model/category thresholds emerge from 20–30 actual items and 20 comparable sold listings per category?
7. Which free tools are reliable enough for a sale report, and which are only exploratory diagnostics?
8. Can a local repairer or ITAD operator review the SOP and observe a mock triage session?
9. What is the correct handling route for a device that is safe but contains inaccessible or failed storage?
10. Can a partner accept pre-triaged devices without transferring legal, data, warranty, or battery liability back to the operator?

## Recommended next actions

1. Convert the Gate 1 table into a one-page printed checklist.
2. Add the missing tracker fields in a private test copy before changing the public CSV schema.
3. Obtain written Council/Fair Trading/insurer/WHS answers before public intake.
4. Build a clean, offline diagnostic USB using only verified tools and a test log template.
5. Practise on safe known devices and record time, uncertainty, and false positives.
6. Contact two RTOs, two local repairers, one ITAD operator, and the relevant downstream providers with a short non-confidential question set.
7. Run the closed pilot only after the premises, safety, ownership, data, and storage gates are ready.
8. Update `codexGAPS.md` with findings and move only the questions supported by evidence from **Open** to **Confirmed**.

## Sources consulted

- [ACCC Product Safety — sell safe products](https://www.productsafety.gov.au/business/know-how-to-sell-safe-products)
- [ACCC Product Safety — source and test products](https://www.productsafety.gov.au/business/know-how-to-sell-safe-products/how-to-source-and-test-products)
- [ACCC — second-hand products online](https://www.productsafety.gov.au/consumers/know-your-product-safety-rights/buy-safe-second-hand-products-online)
- [NSW EPA — never bin a battery](https://www.epa.nsw.gov.au/Your-environment/Recycling-and-reuse/never-bin-a-battery)
- [NSW EPA — embedded batteries](https://www.epa.nsw.gov.au/Your-environment/Recycling-and-reuse/household-recycling-overview/embedded-batteries)
- [NSW EPA — Community Recycling Centres](https://www.epa.nsw.gov.au/Your-environment/Recycling-and-reuse/household-recycling-overview/community-recycling-centres)
- [Apple — remove Activation Lock](https://support.apple.com/en-euro/guide/iphone/ipha94b7686e/27/ios/27)
- [Google Pixel — factory reset](https://support.google.com/pixelphone/answer/4596836?hl=en-AU)
- [Microsoft — remove Windows Autopilot association](https://learn.microsoft.com/en-us/autopilot/device-preparation/device-association/remove-association)
- [Microsoft — Windows 11 requirements](https://support.microsoft.com/en-us/windows/experience/compatibility/windows-11-system-requirements)
- [Microsoft — PC Health Check](https://support.microsoft.com/en-us/windows/experience/compatibility/how-to-use-the-pc-health-check-app)
- [Training.gov.au — UEE20520](https://training.gov.au/Training/Details/UEE20520/qualdetails?pageSize=50&tableUnits-page=1)
- [NIST SP 800-88 Rev. 2](https://csrc.nist.gov/pubs/sp/800/88/r2/final)
- [smartmontools](https://www.smartmontools.org/)
- [nvme-cli](https://github.com/linux-nvme/nvme-cli)
- [Memtest86+](https://memtest.org/)
- [stress-ng](https://github.com/ColinIanKing/stress-ng)
- [lm-sensors](https://github.com/lm-sensors/lm-sensors)
- [fwts](https://github.com/fwts/fwts)
