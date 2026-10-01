# Research 08: Category route sheets beyond the core laptop/phone lane

**Research date:** 2 October 2026 (AEST)

**Gap covered:** `codexGAPS.md` section 9: desktops and mini PCs, monitors and TVs, printers/scanners, consoles/controllers, cameras/lenses, networking/NAS, smart TVs/IoT, vintage gear, and high-risk power products.

**Relationship to existing research:** `claudegaps-research/02-CATEGORY-KNOWLEDGE.md` covers the core laptop, Apple, phone, tablet, TV and component knowledge. This report supplies the missing category-sheet format and conservative route rules for the less-developed categories.

**Status:** category route rules and tests drafted; local demand, exact sold prices, model-specific repair rates and specialist buyer routes still require pilot evidence.

## Executive decision

Do not launch every category at once. Use four lanes:

1. **Core reuse lane:** business laptops, desktops/mini PCs, phones and tablets already covered by the existing triage reports.
2. **Local-only trial lane:** selected monitors, premium recent TVs, simple consoles, cameras and working peripherals with a named buyer route.
3. **Partner/referral lane:** printers, NAS/networking from organisations, smart-home devices with cloud accounts, vintage items with uncertain provenance, and any device with specialist data or safety requirements.
4. **Reject/approved-downstream lane:** damaged power products, e-bike/e-scooter batteries, solar/UPS/EV batteries, unsafe mains gear, broken CRTs and unrouteable appliances.

The rule for every category is:

```text
safety → authority/data/lock → support/compatibility → functional test
→ realistic route → labour/packing cap → disclosure → release
```

## 1. Standard category-sheet template

Every category admitted to the pilot gets one completed sheet with these fields:

```text
category, accepted_models_or_boundary, safety_screen,
lock_and_data_screen, minimum_test_list, route_options,
labour_cap, minimum_value_confidence, listing_fields,
packing_or_local_only_rule, warranty_return_risk,
refusal_language, downstream_route, owner_and_review_date
```

The sheets below are a starting control. They are not proof that a particular model is profitable or safe.

## 2. Desktops and mini PCs

### Route decision

Accept for Phase 0 when the unit has an intact case, identifiable model/serial, compatible power supply, no unresolved BIOS/management lock, a safe data-storage route and a realistic local or shipped route. Prefer business mini PCs, small-form-factor systems and standard towers over obscure proprietary consumer systems.

### Safety screen

- inspect mains lead, plug, PSU case, fan openings and evidence of moisture/pest contamination;
- do not open the PSU or work on mains components;
- reject burnt smell, damaged insulation, cracked inlet, liquid damage or exposed conductors;
- keep large/heavy towers local pickup unless packaging has been proven;
- check fan noise, heat and dust before extended testing.

### Lock/data screen

- BIOS/UEFI password or Computrace/management state unresolved: hold/refuse;
- identify every HDD/SSD/USB/optical medium;
- check Windows Autopilot/Intune/organisation screens as for laptops;
- clear router-like management/configuration data in add-in cards where present;
- do not use a donor organisation’s licence or account.

### Minimum test

1. POST and firmware screen;
2. CPU/RAM/storage identification;
3. memory test;
4. storage health and sanitisation decision;
5. USB, display output, audio, Ethernet/Wi-Fi and front ports;
6. fan/thermal observation under a proportionate test;
7. shutdown/restart and clean OOBE or approved Linux route;
8. exact included power supply and missing-slot disclosure.

### Routes and caps

- working current mini PC: national listing if contribution covers freight, otherwise local;
- standard tower with upgradeable RAM/SSD: modular repair or parts;
- proprietary PSU or unusual form factor: local-only or wholesale quote first;
- old, noisy or unsupported unit: Linux/vintage only if a named buyer route exists.

Use a provisional 60-minute total bench cap after triage; re-price before any second repair. Record whether an upgrade creates more value than selling the system as-is.

### Listing fields

Exact CPU, RAM type/capacity, storage model/capacity, OS/support state, ports, Wi-Fi/Ethernet, power supply, noise/thermal result, cosmetic grade, data-clearance level, missing brackets/cables and delivery dimensions.

### Refusal language

> We cannot accept this desktop for reuse because the power/firmware/data state cannot be verified safely. We can return it to you or direct it to an approved recycling/downstream route.

## 3. Monitors and TVs

### Route decision

Treat large displays as local-first. A screen that works but has low value, no stand/remote, uncertain panel damage or high freight risk is not automatically a reusable asset.

### Safety and data screen

- no cracked, lifting, wet, burnt or sparking panel;
- no opening of mains/power boards in Phase 0;
- smart TVs require account unlinking, reset and cloud/privacy review;
- remove USB drives and memory cards;
- inspect remote, stand, wall-mount hardware and power cable separately;
- CRTs stay intact and are not opened.

### Minimum test

- power-on from cold;
- native resolution and all advertised inputs;
- full-screen red/green/blue/white/black/grey pattern;
- dead pixels, lines, flicker, burn-in, bright spots and uniformity;
- speakers, remote, buttons, network/app setup where relevant;
- stand stability and VESA hardware;
- thermal/odour observation and clean shutdown.

### Smart-TV reset evidence

Google’s current help guidance says removing the only account from many Google TV devices can trigger a factory reset, and that factory reset deletes device data; the exact process varies by manufacturer. Use the device maker’s process, confirm the first-run screen and record the model-specific guide. Do not claim a reset cleared external USB media or a separate account/cloud service without checking.

Sources:

- [Google TV: reset and remove accounts](https://support.google.com/googletv/answer/12360626?hl=en-GB)
- [Google Home/Wi-Fi: reset and account/cloud effects](https://support.google.com/googlehome/answer/6246619?hl=en-419)

### Routes and caps

- 50-inch-plus recent premium display, fully tested, remote/stand included: local pickup trial;
- small/old/low-resolution display: local bundle or recycling unless sold data supports it;
- cracked panel or unresolved smart-account state: reject/partner route;
- panel-board repair: specialist referral only until parts, safety and freight economics are measured.

Use a 30-minute bench cap and a separate packaging decision. A successful power-on test is not evidence that a TV can survive parcel freight.

### Listing fields

Diagonal size, exact model, panel technology, resolution, refresh rate, inputs, smart platform/update state, pixel/burn-in result, stand/remote, wall-mount hardware, cosmetic defects, local pickup boundary and tested date.

## 4. Printers and scanners

### Route decision

Printers are pre-approval only. Many have low resale value but consume space, ink/toner, transport time and support labour. Business laser printers can be exceptions only with a named local buyer and tested consumable path.

### Safety/data screen

- inspect mains lead, fuser/heat areas, toner spills and mechanical damage;
- do not open high-temperature fuser or mains sections without trained specialist controls;
- identify internal storage, scan-to-email credentials, address books, fax logs, Wi-Fi credentials and USB media;
- obtain owner/admin authority before resetting or clearing configuration;
- check recalls and consumable availability.

### Minimum test

- cold start and error screen;
- self-test/status page without exposing donor data;
- paper feed, duplex, alignment, print quality and scan quality;
- USB/network isolation and reset verification;
- toner/ink level and cost-to-replace;
- noise, warm-up and odour;
- confirm all accessories and trays.

### Route and cap

Accept only when expected local sale value exceeds consumables, transport, labour, storage and likely support. A 30-minute diagnostic cap applies; do not buy toner simply to discover a blocked or obsolete unit unless the value model supports it.

### Listing fields and refusal

List exact model, page count if available, consumable model/cost, tested functions, connection modes, included trays/cables, known configuration reset and local-only status.

> We do not take printers whose data, consumables, safety or buyer route cannot be verified. Please use the manufacturer or approved e-waste route.

## 5. Game consoles and controllers

### Route decision

Consoles can have collector and repair value, but accounts, parental controls, digital licences, removable storage, HDMI ports and disc drives create hidden risk. Controllers are a separate route because stick drift, battery and pairing faults are common.

### Data/identity screen

Nintendo’s official disposal guidance says to initialise a Switch before transfer/disposal, remove microSD media, and stop recurring Nintendo Switch Online payments separately because initialisation does not cancel them. The account itself is not deleted by device initialisation. Equivalent manufacturer account unlinking and reset steps are required for other platforms.

Source:

- [Nintendo: Switch transfer/disposal guidance](https://support.nintendo.com/jp/switch/disposal/index.html)

### Minimum test

- clean boot and account-free setup;
- HDMI/display output and audio;
- disc/cartridge reader where applicable;
- Wi-Fi, Ethernet and USB;
- controller pairing, every button, triggers, sticks, vibration and charging;
- fan noise/temperature and storage expansion;
- factory reset, removable media removal and account unlink evidence.

### Routes and caps

- complete current console with controller: national or local listing;
- controller with replaceable module/known fault: modular repair if tested;
- retro/collector item: research provenance and sold comparables before cleaning or modifying;
- account-locked, banned, water-damaged or HDMI-board fault: referral/parts only.

Use a 45-minute initial cap and do not open HDMI or board faults in Phase 0.

### Listing fields

Model/revision, storage, region, included controller/cables/stand, account/reset state, reader/output test, controller test, noise, cosmetic grade, serial redaction and warranty/return terms.

## 6. Cameras and lenses

### Route decision

Camera value is model-, lens- and condition-specific. Do not recycle a complete pre-2005 camera or lens before checking collector evidence, but do not accept specialist optics without a route.

### Data and safety screen

- remove SD/CF cards and batteries for separate handling;
- factory-reset accounts/Wi-Fi/GPS/location data;
- check battery swelling and charger compatibility;
- inspect lens fungus, haze, scratches, impact, aperture, zoom/focus and mount;
- do not disassemble optics or flash/high-voltage sections in Phase 0.

### Minimum test

- power and charge behaviour;
- sensor image at multiple exposures/ISO;
- autofocus/manual focus and zoom;
- shutter/actuation count where the model provides a reliable readout;
- flash, card writing, screen/viewfinder, ports and buttons;
- lens mount, stabilisation and image quality;
- reset and account/Wi-Fi clearance.

### Routes and caps

- complete, clean, supported interchangeable-lens systems: specialist/national route;
- common compact camera with charger and working sensor: local/national comparison;
- fungus, shutter failure, sticky aperture, unknown battery or missing proprietary charger: specialist quote or parts;
- vintage item: preserve originality and provenance; do not polish, open or modify before valuation.

Use a 45-minute test cap and a model-specific listing template.

## 7. Networking, NAS and storage appliances

### Route decision

Business networking gear may have homelab value, but it can retain credentials, keys, logs, topology and client data. Treat it as data-bearing infrastructure, not just metal/plastic.

### Data/lock screen

- ask the owner/admin whether configuration, certificates, logs and disks may be erased;
- record serial and model without publishing it;
- remove HDD/SSD/USB/SD media and sanitise under Research 05;
- factory reset or approved erase configuration/NVRAM;
- verify there is no cloud, licensing or tenant lock;
- never connect unknown network gear to the home LAN.

Google’s official Google Wifi guidance distinguishes an app reset that removes device and cloud data/account association from a physical reset that may leave app/cloud data until later deletion. This is a useful warning: a physical button reset is not always the same as account/cloud removal.

Source:

- [Google Wifi: factory-reset effects](https://support.google.com/googlehome/answer/6246619?hl=en-419)

### Minimum test

- boot and factory/default state;
- all ports/link rates where practical;
- PoE only with compatible test equipment;
- fan/temperature/noise;
- storage health and sanitisation;
- firmware support/EOL status;
- reset and clean admin setup without retaining donor credentials.

### Routes and caps

- current managed switch/access point/NAS with clean reset and homelab demand: national/local listing;
- enterprise unit with subscription/licence lock or obsolete firmware: wholesale/parts;
- unknown organisation config or storage: hold/referral;
- high-power PoE or rack gear: local pickup only until freight/energy economics are proven.

## 8. Smart speakers, cameras, streaming devices and IoT

### Route decision

IoT is a privacy and cloud-dependency category. Accept only when the account unlink, reset, supported-service life and buyer setup can be proven.

### Data/identity screen

- remove owner accounts and homes/locations;
- reset cloud registration, voice history, cameras, microphones and Wi-Fi credentials;
- remove SD cards and USB storage;
- identify whether the service is discontinued or region-locked;
- do not sell a device whose core function depends on a cloud service that no longer exists.

Google says a factory reset clears data on a smart speaker/display and disconnects it from home members, while some basic device data may remain connected to the home. This means the operator must record both local reset and cloud/account removal where relevant.

Source:

- [Google Home/Nest: factory reset](https://support.google.com/googlehome/answer/7073477?hl=en-uk)

### Minimum test

- clean onboarding without donor account;
- microphone/camera indicator and privacy control;
- Wi-Fi/Bluetooth and app compatibility;
- speaker/display/camera functionality;
- physical power/charging safety;
- current supported service and region.

### Routes and caps

- current, account-free, supported smart device: small national/local trial;
- cloud-dependent, region-locked or privacy state uncertain: reject/parts;
- security camera/NVR: treat as high-sensitivity business equipment and use specialist/referral route if storage or credentials are unresolved.

## 9. Vintage computers, media and collector electronics

### Route decision

Vintage gear is an exception to modern “old equals junk” rules. Value may come from authenticity, completeness, provenance, original packaging, working media drives or rarity rather than modern specifications.

### Safety/data screen

- no CRT opening or high-voltage repair;
- preserve original labels, screws, connectors and serials;
- remove floppy/SD/CF/IDE/SCSI media and assess data risk;
- do not power unknown equipment repeatedly;
- inspect capacitors, batteries, corrosion and rodent damage;
- separate historical value from safe electrical release.

### Minimum test

- visual/provenance record before cleaning;
- controlled power-on only after safety inspection;
- display/output, keyboard, ports and storage media separately;
- photograph internals only when safe and authorised;
- check sold comparables and named collector/dealer route before disassembly.

### Routes and caps

- complete and authentic: specialist valuation/consignment or national collector sale;
- incomplete but rare: parts/collector route;
- common old office PC: modern triage rules, not automatic vintage premium;
- unknown high-voltage/CRT condition: specialist/approved downstream.

## 10. Solar, UPS, e-bike/e-scooter, vape and power equipment

These categories are outside Phase 0.

Reasons include high-energy batteries, damaged-battery transport, mains/high-voltage sections, fire risk, approval/recall exposure, specialist testing and inadequate home-workshop controls. A working status light is not a safety test.

Use this refusal:

> We are not currently equipped or insured to accept this battery/power category safely. Please use the manufacturer, licensed specialist, council or approved hazardous-battery pathway. We do not take loose, damaged or unknown lithium batteries.

Do not dismantle, charge, ship or put these items into general e-waste stock merely to discover whether they have resale value.

## 11. Cross-category release fields

The inventory/listing record should include:

```text
asset_id, category, make, model, revision, serial_hash,
source_authority, safety_screen, battery_state,
lock_account_state, media_state, recall_check_date,
support_or_cloud_state, test_protocol, test_result,
route, labour_minutes, value_confidence,
listing_fields_complete, packing_rule, local_only,
known_defects, missing_accessories, warranty_return_risk,
downstream_route, refusal_language_used, reviewer
```

The `category` value must not be used as a substitute for the actual test result. “Console”, “camera” or “networking” is not a grade.

## 12. Category pilot order

Run the next category experiments in this order:

1. one business mini PC;
2. one monitor with local pickup route;
3. one current console/controller pair;
4. one camera/lens with known owner and removable media;
5. one router/NAS using synthetic credentials and storage;
6. one smart device with a volunteer owner performing account unlink;
7. one vintage item only after collector route confirmation.

Do not admit printers or high-risk power products to the pilot until the route is explicitly approved. For each category, require three successful outcomes and at least one refusal/failed outcome before relaxing the sheet.

## 13. Evidence still needed

- 20 Australian sold comparables per category before setting price floors;
- local Dubbo pickup demand and no-show rate;
- actual packing/damage experience for any display or fragile item;
- model-specific cloud/firmware end-of-life list;
- local specialist repair/valuation referrals for cameras, vintage, consoles and network gear;
- insurer confirmation for each accepted category;
- product recalls and Australian approval checks at listing time;
- exact downstream route for every rejected category.

## Sources consulted

- [Google TV: reset and remove accounts](https://support.google.com/googletv/answer/12360626?hl=en-GB)
- [Google Wifi: factory-reset effects](https://support.google.com/googlehome/answer/6246619?hl=en-419)
- [Google Home/Nest: factory reset](https://support.google.com/googlehome/answer/7073477?hl=en-uk)
- [Nintendo: Switch disposal and transfer](https://support.nintendo.com/jp/switch/disposal/index.html)
- [Dell: replacing common laptop parts](https://www.dell.com/support/kbdoc/en-us/000179828/how-to-replace-common-parts-in-your-dell-notebook)
- [Apple: Self Service Repair](https://support.apple.com/self-service-repair)
- [ACSC: secure device disposal](https://www.cyber.gov.au/protect-yourself/securing-your-devices/how-secure-your-device/how-dispose-your-device-securely)
- [Fire and Rescue NSW: damaged batteries](https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/battery-and-charging-safety/what-should-i-do-if-my-battery-is-damaged)

This is an operational research sheet, not legal, electrical, WHS, insurance, product-safety or specialist valuation advice.
