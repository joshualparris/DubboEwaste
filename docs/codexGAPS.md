# codexGAPS — research opportunities not yet closed

**Audit date:** 2 October 2026
**Repository audited:** `joshualparris/DubboEwaste`, local checkout `/home/josh/DubboEwaste`
**Purpose:** identify the remaining research and validation work needed to decide whether a small Dubbo electronics-reuse/refurbishment operation should accept, repair, resell, donate, partner, or refuse particular equipment.

## How to read this document

This is a delta audit, not a replacement for `GAPS.md`. The repository already contains substantial work on planning and licensing, council and downstream pathways, data sanitisation, safety, consumer law, costs, Fliptech and comparable ITAD businesses, schools, charities, podcasts, templates, and a pilot tracker. `docs/agyGAPS.md` also already identified triage, learning resources, competitor mechanics, and sales channels as broad opportunities.

This document turns those themes into a fuller research programme and records gaps found after reading the repository's Markdown, CSV and templates. It deliberately does not repeat every already-researched fact.

Evidence labels:

- **Confirmed:** supported by a current first-party, government, standards, or repository source.
- **Working hypothesis:** plausible model to test; not evidence that the business can operate that way.
- **Open:** requires a call, written answer, quote, observation, or pilot data.
- **Do not infer:** a tempting conclusion that the current evidence does not support.

The date matters. Prices, courses, platform fees, laws, company operations, software support, and partner programmes can change. Re-check live sources before making a decision.

## Executive summary

The largest unexplored opportunity is not another list of recyclers. It is a repeatable **acceptance-and-routing system** that can answer, before taking an item:

1. Is the person entitled to transfer it?
2. Is it safe to touch, transport, store, test, charge, open, or post?
3. Can its data and account locks be handled lawfully?
4. Is there a realistic whole-device, repair, donor-parts, collector, donation, resale, or downstream route?
5. What is the maximum labour, parts, storage, warranty, and disposal cost?
6. What evidence will prove the outcome to the owner, buyer, partner, insurer, and regulator?

The repository has the policy principles but not yet enough measured evidence to set reliable model-specific cut-offs. The next phase should therefore produce:

- a 60-second intake screen and a longer bench-triage SOP;
- a model/category matrix with explicit `accept`, `conditional`, `reject`, and `partner-only` outcomes;
- a learning curriculum with practical pass/fail assessments;
- a small controlled pilot that measures time and outcome rather than only item count;
- a documented comparison of whole-device resale, repair, parts, donation, and recycling economics;
- direct evidence of how FlipTech and other operators actually set thresholds;
- a partner/downstream evidence pack that does not rely on marketing language;
- an explicit stop rule for unsafe, locked, unprofitable, untraceable, or legally uncertain items.

## 1. Audit coverage and existing boundaries

The audit covered the repository README, `GAPS.md`, all research files under `docs/`, all five templates under `templates/`, and `pilot-tracker.csv`. The repository is research-stage documentation, not an operating approval. It contains no code test suite; checks for this change are therefore document/link/status checks.

The following are already strong enough to reuse rather than restart:

- the four intake gates in `docs/INTAKE-POLICY.md`;
- the `UNWIPED — RESTRICTED` data workflow;
- the ownership, chain-of-custody, sanitisation, repair-notice, and sale/recall templates;
- the 47-field pilot tracker;
- the Phase 0 controlled-intake concept;
- the distinction between material recycling and secure ITAD;
- the warning that AMR's exact downstream e-waste chain remains unconfirmed;
- the research on Sircel, PonyUp, Reconnect, The Laptop Initiative, WorkVentures, Good360, Compnow, TechCollect, councils, schools, and regional routes;
- the existing FlipTech branch/partner questions and Australian podcast lists.

The gaps below are the missing operational evidence, decision rules, or primary-source checks needed to make those documents executable.

## 2. P0: front-door triage — the highest-value unexplored work

### 2.1 The 60-second donation screen is not yet modelled

**Open:** turn the policy into a one-page card a minimally trained person can use without improvising.

Research and test:

- the minimum questions that can be answered at the door;
- which defects require immediate refusal rather than bench inspection;
- how to identify swollen, hot, leaking, punctured, wet, crushed, fire-exposed, or unknown lithium batteries without charging them;
- how to recognise CRTs, toner, mercury-containing equipment, no-name chargers, mains-voltage hazards, and contaminated/pest-infested gear;
- whether a photo/model pre-screen can reduce bad arrivals;
- how to record a refusal without inviting an argument or creating a promise of disposal;
- whether staff can apply the screen consistently after a short training session.

**Deliverable:** a laminated decision tree with no more than four outcomes: `ACCEPT`, `ACCEPT SUBJECT TO INSPECTION`, `PARTNER-ONLY`, `REJECT / TAKE IT BACK`.

### 2.2 The repository has no evidence-based category cut-offs

Current laptop, phone, tablet, TV, console, camera, networking, printer, and vintage-computing preferences are sensible but mostly policy choices.

Still open:

- minimum CPU generation, RAM, storage, screen size, battery health, camera quality, and OS support for each resale category;
- whether the cut-off differs for local resale, donation, parts, collector, and Linux use;
- minimum expected sale price after fees, postage, labour, warranty reserve, and return risk;
- maximum age by category rather than one blanket age rule;
- when a cracked screen is a donor, a repair, or an immediate reject;
- whether gaming PCs, GPUs, monitors, printers, projectors, consoles, cameras, networking gear, musical equipment, and appliances deserve separate lanes;
- whether obscure or vintage gear should be accepted only against a named buyer or specialist route;
- whether whole-device value is greater than the sum of parts after disassembly time;
- how much uncertainty is acceptable when the model number or serial is missing.

**Pilot method:** choose 10–15 categories, record every item for 20–30 items, and calculate outcome and labour by category. Do not set permanent cut-offs from online asking prices alone.

### 2.3 The bench-triage SOP is incomplete

The current testing list names many checks but does not specify order, tools, test duration, pass criteria, or failure handling.

Research and define:

- a non-destructive visual inspection sequence;
- a safe power-on decision and stop conditions;
- POST/UEFI, display, input, storage, memory, thermals, charging, wireless, ports, camera, microphone, speakers, sleep/wake, and shutdown tests;
- a standard test duration for quick triage versus sale certification;
- how to distinguish a bad charger, battery, DC jack, USB-C port, display, storage device, RAM, operating-system problem, and motherboard problem;
- which tests can run offline and which expose data or account information;
- how to test machines with no working storage without accidentally accepting an unrepairable board;
- when a diagnostic should stop and a specialist repairer should be contacted;
- what evidence is captured: screenshots, photos, SMART/NVMe output, battery report, test log, or video;
- how to prevent a failed test from being treated as a successful intake.

### 2.4 Create a route matrix, not only an accept/reject list

Every accepted item needs a pre-declared route:

| Route | When it is appropriate | Evidence still needed |
|---|---|---|
| Whole-device resale | safe, unlocked, supported, tested, and likely to clear the margin floor | sold-price sample, test record, buyer/warranty plan |
| Repair then resale | fault is bounded and repair time/parts are predictable | repair estimate, donor/parts availability, post-repair test |
| Parts donor | one or more components have a named market or internal use | part demand, extraction time, storage life |
| Donation | named recipient/partner and suitability criteria exist | written acceptance, data/ownership proof, delivery/outcome record |
| Collector/vintage | specialist buyer or documented market exists | buyer contact, authenticity/condition method |
| Material recycling | no higher-value safe route remains | current provider acceptance and lawful downstream evidence |
| Refuse | safety, ownership, lock, contamination, storage, or uncertainty gate fails | refusal reason and return instruction |

**Open:** who owns the decision when multiple routes look plausible, and when must the operator choose the cheapest safe exit rather than the highest theoretical value?

## 3. Skills and training gaps

### 3.1 Build a staged learning path

The current repository recommends resources, but it does not say what to study first, what competence looks like, or when a person is allowed to handle a category independently.

Suggested path for research and practical assessment:

#### Stage A — safe handling and business controls

- battery hazard recognition and emergency response;
- electrical isolation and safe work area;
- ownership, privacy, activation locks, MDM, and data-bearing intake;
- chain of custody and incident recording;
- customer communication and refusal scripts;
- Australian Consumer Law basics for second-hand and repaired goods.

**Assessment:** correctly triage a mixed box without charging or opening unsafe items and complete the transfer/refusal record.

#### Stage B — computer assembly and routine repair

The current national register describes **UEE20520 Certificate II in Computer Assembly and Repair** as covering assembly and routine hardware repairs, generally by replacement of known faulty components. Relevant units include computer assembly/testing, OS installation, hardware fault replacement, storage/equipment handling, documentation, and small-office networking. This is a formal qualification route to investigate, not a claim that it is legally required for this project.

Sources:

- [UEE20520 on training.gov.au](https://training.gov.au/Training/Details/UEE20520/qualdetails?pageSize=50&tableUnits-page=1)
- [UEECS0003 Assemble, set up and test computing devices](https://training.gov.au/Training/Details/UEECS0003?pageSize=20&tableQualifications-page=1)

**Open:** which Dubbo/online RTOs deliver the relevant units, cost, duration, practical equipment, recognition of prior learning, and whether the training maps to the actual gear expected at intake.

#### Stage C — diagnostics and operating systems

- Windows hardware and device-manager troubleshooting;
- Linux live environments and hardware inventory;
- storage health and failure interpretation;
- memory testing;
- battery health and charging diagnostics;
- driver, firmware, Secure Boot, TPM, BitLocker, Autopilot, and Windows 11 compatibility;
- Android/iOS restore, activation-lock, carrier, IMEI, and battery checks;
- documenting a reproducible pass/fail result.

Useful starting points:

- [Microsoft Learn: physical hardware troubleshooting](https://learn.microsoft.com/en-us/training/modules/explore-physical-hardware-troubleshooting/)
- [Microsoft Learn: Windows client device and driver troubleshooting](https://learn.microsoft.com/en-us/troubleshoot/windows-client/setup-upgrade-and-drivers/windows-device-and-driver-management-overview)
- [Microsoft Windows Hardware Lab Kit](https://learn.microsoft.com/windows-hardware/test/hlk/)
- [MemTest86](https://www.memtest86.com/)
- [smartmontools](https://www.smartmontools.org/)
- [nvme-cli](https://github.com/linux-nvme/nvme-cli)

**Do not infer:** Windows Hardware Lab Kit is not a general refurbisher acceptance certificate. Research what is proportionate for resale testing instead of adopting an enterprise certification workflow.

#### Stage D — disassembly and component replacement

- ESD and screw/connector discipline;
- laptop battery, keyboard, fan, display, hinge, storage, RAM, and port replacement;
- phone/tablet screen and battery risk;
- donor-part identification and compatibility;
- adhesive, torque, thermal interface, and reassembly quality;
- post-repair test and warranty documentation.

[iFixit’s repair-guide guidance](https://www.ifixit.com/Info/Repair_Guide) is useful because it requires warnings, time, difficulty, tools, photographs, and step-by-step evidence. [iFixit EDU](https://edu.ifixit.com/) is a possible structured technical-writing/repair resource.

**Open:** which repairs are safe and economically sensible in a low-volume shed, and which should always be referred out.

#### Stage E — board-level repair

Microsoldering, board tracing, rework, BGA work, liquid-damage recovery, and data recovery are separate specialisms. They should not be treated as a natural extension of basic laptop triage.

**Open:** whether the business has enough recurring volume to justify this skill, whether insurance permits it, what extraction controls are required, and whether referral or donor-part sales produce a better return.

### 3.2 Course-selection gaps

For each proposed course, record:

- provider and current accreditation status;
- Australian relevance;
- hands-on device access;
- battery/electrical/WHS coverage;
- data privacy and account-lock coverage;
- assessment method;
- total price including tools and consumables;
- refund/renewal policy;
- whether the certificate is marketing only or recognised by an RTO/industry;
- whether the material is current for Windows 11, USB-C, NVMe, Apple Silicon, Android security, and Australian networks.

Candidate research lanes:

- UEE20520 or relevant current units through an RTO;
- ICT hardware technician skill sets on [training.gov.au](https://training.gov.au/);
- Microsoft Learn for Windows diagnostics;
- iFixit guides and EDU;
- CompTIA A+ exam objectives as a knowledge map, not automatic proof of repair competence: [CompTIA A+](https://www.comptia.org/certifications/a);
- vendor service manuals and parts programmes for common Dell, Lenovo, HP, Apple, Samsung, Google, and Microsoft devices;
- manufacturer battery and safety documentation;
- local repair-community or TAFE practical workshops.

**Open:** exact local availability, cost, and whether the operator needs formal certification at all for the intended scope. Ask Fair Trading, Council, insurer, and any commercial partner rather than assuming a certificate solves a licensing or liability issue.

## 4. Practical video, podcast, and community research

### 4.1 What to watch for a specific purpose

The repository already has many podcast lists. The missing piece is a viewing/listening syllabus with questions and a warning that creator content is not Australian legal or safety advice.

| Resource | Use it to learn | Do not use it as proof of |
|---|---|---|
| [Hugh Jeffreys](https://www.hughjeffreys.com/) | Australian repair/restoration thinking, device teardown, parts and practical problem solving | safe handling of every battery or legal permission to operate |
| [eWaste Ben](https://www.youtube.com/watch?v=04FVYFX-dW4) | scrap sorting, board/cable value, the difference between recovery streams | a business case for accepting mixed junk or melting materials |
| [Tech YES City](https://www.youtube.com/@TechYESCity) | used PC-part sourcing, testing, price discovery, and buyer behaviour | current Australian sold prices or a substitute for a controlled pilot |
| [NorthridgeFix](https://northridgefix.com/videos/) | board-level diagnostic reasoning and repair-failure patterns | beginner authorisation to perform microsoldering |
| [Rossmann Group](https://rossmanngroup.com/louis-rossmann) | component-level Mac logic-board repair and right-to-repair issues | Australian consumer-law, electrical, or data-recovery guidance |
| [iFixit troubleshooting](https://www.ifixit.com/Wiki/Troubleshoot) | structured fault isolation and model-specific guides | a universal pass/fail test without checking the device manual |
| [Life on Planet A #82 with Austin Turpin](https://podcasts.apple.com/au/podcast/82-e-waste-revolution-with-austin-turpin/id1508865350?i=1000705662337) | FlipTech founder story, regulation, startup assumptions, and e-waste framing | a public disclosure of FlipTech’s internal floor thresholds |

For every video or episode, capture: device/category, test sequence, tools, safety assumptions, repair time, parts cost, failure rate if given, resale/disposal outcome, and what is specific to another country.

### 4.2 The gap in the existing podcast work

**Open:** the current lists identify episodes, but do not yet answer:

- which episodes teach intake triage rather than general sustainability;
- which explain actual margin, labour, returns, warranty, or inventory ageing;
- which demonstrate data wiping and chain of custody;
- which show a failed repair and a stop decision;
- which are Australian and current enough to inform local practice;
- whether any company will allow a site visit, job shadow, or structured interview.

**Deliverable:** a 10-hour curriculum with timestamps, learning objective, practical exercise, and a short quiz for each item.

### 4.3 Communities and expert checks

Research whether the following can provide safe, local learning without exposing customer data or encouraging unsafe repairs:

- repair cafés and community repair groups;
- TAFE/RTO electronics teachers;
- local computer repairers and phone repairers;
- manufacturer-authorised repair networks;
- Australian ITAD and refurbishment staff;
- relevant professional or trade associations;
- moderated hardware and repair forums.

**Open:** moderation, insurance, confidentiality, conflict of interest, and whether a community will accept an operator bringing customer devices for advice.

## 5. What FlipTech and comparable operators actually do

### 5.1 Publicly observable but incomplete

FlipTech publicly describes collection bins, sorting, secure erasure, data certificates, reuse/donation and recycling. Its public pages do not disclose the detailed thresholds that matter for a one-person regional operation.

Sources:

- [FlipTech bin process](https://www.fliptech.com.au/bins)
- [FlipTech data-erasure article](https://www.fliptech.com.au/articles/8e4e2ca7-22e2-4d68-bf22-d0420c297db4)
- [Konica Minolta / TechCollect 2026 drive](https://www.konicaminolta.com.au/promotions/rethink-e-recycling-2026), which describes a FlipTech-linked erasure and asset-report process

### 5.2 Questions still unanswered about FlipTech

Ask for a written or interview answer, without requesting confidential client information:

- what are the first five physical triage checks at receipt;
- which categories are rejected before entering the facility;
- what minimum resale specifications apply by device type;
- how are battery health, cosmetic condition, screen defects, and missing chargers graded;
- what repair cost or labour-minute ceiling triggers parts or recycling;
- which tests are mandatory before resale;
- how are devices with MDM, Autopilot, Activation Lock, Google FRP, carrier lock, BIOS password, or BitLocker handled;
- what inventory/asset-management system tracks serial, media, custody, wipe, repair, sale, donation, and final disposition;
- how are wipe certificates associated with physical devices and media;
- what percentage of intake is reused, parted, donated, sold, and recycled by broad category;
- what is the average time from receipt to route decision and from route decision to sale/donation;
- what are the minimum regional collection volumes and pickup cadence;
- what warranty/return policy applies to refurbished resale;
- how are failed repair experiments and unsold inventory written down;
- whether a Dubbo feeder/triage partner could operate under written scope and audit rights.

**Do not infer:** “secure erasure” or “recycling” marketing language does not reveal the tool, verification level, chain of custody, reuse rate, or downstream destination.

### 5.3 Compare at least five operating models

The existing research names FlipTech, Sircel, PonyUp, Reconnect, WorkVentures, Compnow, The Laptop Initiative, G1, Greenbox, Renew IT and others. The missing comparison is operational:

| Model | Research opportunity |
|---|---|
| Corporate ITAD | high traceability, predictable refresh lots, data obligations, lower community walk-in dependence |
| Repair/refurbishment shop | diagnostic skill, customer warranty, parts purchasing, smaller lots |
| Donation/social enterprise | recipient eligibility, grants, impact evidence, less resale margin |
| Local reuse/collector | obscure gear, relationship-based pricing, high uncertainty |
| Material recycler | volume, safety, commodity exposure, little whole-device value |

**Open:** which model best fits Dubbo supply, the operator’s skills, the shed constraint, and the desired working hours. A hybrid should be proved by data, not assumed to combine all benefits without all costs.

## 6. Data, identity, locks, and privacy gaps

The repository has a strong media-sanitisation direction, but the front-door identity and exception workflow needs more work.

Research and define:

- a legitimate owner-authorisation script for consumers, businesses, schools, and managed-service providers;
- what to do when the donor forgot an Apple ID, Google account, Microsoft account, BIOS password, MDM, Autopilot, or carrier lock;
- a no-password policy and a safe handover process;
- proof that an organisation has authority to dispose of customer or employee data;
- handling of removable media, cameras, game consoles, printers, routers, NAS devices, phones, smart TVs, and IoT equipment;
- treatment of devices that cannot boot but contain storage;
- a destruction/referral rule for encrypted or damaged media;
- privacy breach response, access logs, incident notification, and retention/deletion periods;
- whether photos used for listings can reveal serials, IMEIs, faces, locations, Wi-Fi names, or residual data;
- whether a buyer can recover previous owner data from firmware, diagnostics, browser caches, or cloud links after a nominal reset;
- secure deletion of intake spreadsheets, photographs, certificates, and marketplace messages.

Useful references to compare with the existing ASD/ACSC and NIST work:

- [ASD Information Security Manual](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism)
- [ACSC advice on disposing of devices](https://www.cyber.gov.au/protect-yourself/securing-your-devices/how-secure-your-device/how-dispose-your-device-securely)
- [NIST SP 800-88 Rev. 2](https://csrc.nist.gov/pubs/sp/800/88/r2/final)

**Open:** whether the proposed record system is proportionate and whether any commercial partner requires a particular software, certificate, accreditation, or audit trail.

## 7. Battery, electrical, and workshop capability gaps

Existing documents correctly reject damaged batteries and limit Phase 0. The missing work is a practical facility and incident design.

Research:

- exact quarantine location and container for a suspicious device;
- how to isolate a hot, swollen, leaking, wet, or smoking device without moving it unnecessarily;
- emergency contacts and escalation sequence;
- fire detection, separation, ventilation, thermal monitoring, and evacuation suitability;
- whether the insurer accepts battery testing, charging, disassembly, soldering, and customer visits;
- safe charger/power-board/RCD/extension-lead setup;
- ESD controls and whether they reduce rather than introduce risk;
- soldering fumes, lead/flux, cleaning chemicals, isopropyl alcohol, dust, toner, and CRT hazards;
- test-and-tag or other electrical-equipment obligations for equipment offered for sale;
- safe packaging and transport of devices with batteries;
- whether a device should ever be charged overnight or unattended;
- a written stop-work and incident-reporting drill.

**Open:** obtain insurer and WHS advice for the exact activity. Do not use an online video, a fire blanket, or a generic battery box as a substitute for a site-specific risk assessment.

## 8. Repair economics and parts strategy gaps

### 8.1 Repair decision data

For every repair attempt, record:

- diagnosis time;
- parts search time;
- parts, shipping, GST, and minimum-order cost;
- repair labour time;
- failure or rework time;
- test/reassembly time;
- value before and after repair;
- warranty/return exposure;
- salvage value if repair fails;
- whether the repair created reusable donor parts;
- whether a specialist referral would have been better.

**Open:** set category-specific labour ceilings and a minimum gross contribution per labour hour. The ceiling must include the opportunity cost of stock that could have been processed instead.

### 8.2 Parts inventory

Research and decide:

- which parts are worth holding locally;
- donor-part labelling and compatibility records;
- battery age and storage-life rules;
- genuine, aftermarket, refurbished, and salvaged part disclosure;
- return-to-supplier and dead-on-arrival handling;
- obsolete/slow-moving parts write-downs;
- whether parts are sold individually, bundled, or reserved for internal repair;
- whether harvesting a part is safe and profitable after disassembly;
- how to prevent mixed screws, unknown chargers, and untested RAM from becoming hidden junk.

### 8.3 Board-level boundary

Research the referral network and price of board-level work before buying a microscope or hot-air station. A board-level lane needs:

- ESD and thermal controls;
- microscopy and measurement capability;
- board-view/schematic access;
- fume extraction;
- rework/inspection skill;
- data-recovery boundaries;
- a rework warranty policy;
- a clear distinction between practice boards and customer/resale stock.

## 9. Product categories not yet adequately researched

The repository is strongest on laptops, phones, tablets, TVs, and general electronics. Separate category studies remain useful because failure modes and markets differ.

- **Desktops and mini PCs:** OEM locks, proprietary power supplies, Windows licensing, GPU value, noise, and local pickup economics.
- **Monitors and TVs:** panel breakage, backlight/driver-board diagnosis, dead-pixel disclosure, freight damage, CRT hazards, and local-only sales.
- **Printers and scanners:** toner, ink, firmware locks, consumables, low resale value, and whether a working unit is worth moving.
- **Game consoles and controllers:** account locks, disc drives, HDMI ports, stick drift, repair parts, and recall/safety checks.
- **Cameras and lenses:** fungus, sensor dust, shutter count, battery/charger compatibility, and specialist resale markets.
- **Networking gear and NAS:** stored data, enterprise licensing, PoE safety, firmware support, and business-security concerns.
- **Smart TVs, speakers, and IoT:** account unlinking, factory resets, microphones/cameras, cloud service expiry, and privacy.
- **Vintage computers and media:** authenticity, provenance, data media, collector grading, and a named buyer route.
- **Solar, UPS, e-bike, e-scooter, vape, and power equipment:** battery and electrical boundaries; likely partner-only or refuse categories.

**Deliverable:** one category sheet per accepted category containing safety screen, lock/data screen, test list, route options, labour cap, listing fields, packing rule, and refusal language.

## 10. Resale, pricing, and market evidence gaps

Existing documents discuss eBay, Facebook Marketplace, Gumtree, costs, and sold-price research, but the business still lacks a repeatable pricing dataset.

Research and measure:

- sold prices rather than asking prices by exact model/spec/condition;
- local pickup versus shipped price difference in regional NSW;
- platform fee, payment, promotion, postage, packaging, insurance, and return costs;
- time to create a listing and answer buyers;
- cancellation, no-show, scam, payment, and chargeback risk;
- buyer demand for Linux or unsupported Windows hardware;
- how much battery health and cosmetic disclosure change conversion;
- local demand from students, families, trades, small businesses, schools, charities, and collectors;
- whether bundles outperform individual sales;
- whether a warranty or return period increases price enough to pay for itself;
- dead stock ageing and markdown rules;
- tax/GST/accounting treatment for donated goods, parts, repairs, and mixed bundles;
- whether a business name, ABN, marketplace account, or payment provider imposes requirements not covered in the current notes.

**Minimum dataset:** 20 comparable sold items per major category, with date, exact specification, condition, channel, delivery method, price, fee, and days-to-sale. Do not scrape or republish platform data in a way that breaches terms.

## 11. Listings, consumer guarantees, warranty, and returns

The repository contains strong consumer-law warnings and templates. The remaining gaps are operational:

- a standard condition-grade vocabulary that a buyer can understand;
- mandatory defect and battery-health disclosures by category;
- how to disclose repaired, refurbished, salvaged, replacement, or non-original parts;
- standard listing photographs and serial/IMEI redaction;
- a DOA, return, refund, repair, replacement, and uncollected-goods workflow;
- warranty duration and exclusions that do not misstate Australian Consumer Law rights;
- a reserve for return postage and failed repairs;
- a recall check before listing and a customer-contact process after sale;
- how to handle a buyer who reports data exposure, account lock, fire risk, or safety defect;
- records needed to prove what was disclosed at sale.

**Open:** have a consumer-law adviser review the actual listing, receipt, warranty, repair notice, and return language together. Templates alone do not establish compliance.

## 12. Inventory, software, and information architecture gaps

The tracker is a good start but does not yet specify the system of record.

Research and choose a low-cost workflow for:

- sequential asset IDs and duplicate prevention;
- barcode/QR labels;
- serial/IMEI validation without exposing identifiers publicly;
- photos linked to the correct asset;
- custody events and user permissions;
- wipe certificates and media records;
- repair tickets and parts consumed;
- listing links, offers, buyers, invoices, shipping, refunds, and warranty;
- stock ageing and automatic review dates;
- disposal authorisation and downstream certificate;
- backups, encryption, retention, and offline recovery;
- export if the operator changes tools or joins a partner.

Compare a spreadsheet, SQLite/local-first system, inventory SaaS, and a partner’s ITAD system on cost, privacy, auditability, offline use, serial support, exports, and failure recovery. Do not buy Makor/RazorERP-style enterprise software before the pilot proves the fields and workflow.

## 13. Supply, demand, and partnership gaps

### 13.1 Supply discovery

The repository names promising sources but does not yet quantify repeatability:

- local businesses and MSP refresh cycles;
- schools and government disposal rules;
- councils and transfer stations before material enters a recycling cage;
- repair shops’ donor stock;
- office liquidations and auction houses;
- charities, housing organisations, and community groups;
- farms, trades, and regional service businesses;
- residents who need a secure data-aware disposal option;
- formal collection campaigns with a partner.

For each source, research volume, device mix, ownership authority, data state, pickup cost, expected reuse rate, storage/packaging, and whether the source can supply the same category repeatedly.

### 13.2 Demand discovery

Interview or survey prospective buyers/recipients about:

- device needs, budget, location, OS, screen size, battery expectations, and warranty;
- willingness to buy refurbished versus accept donated equipment;
- need for setup, delivery, data, peripherals, training, or support;
- acceptable cosmetic grade and turnaround;
- accessibility requirements;
- reasons they reject refurbished electronics;
- what failure support they can realistically use.

### 13.3 Partner terms

For FlipTech, G1, Greenbox, Sircel, WorkVentures, Good360, Device Bank, councils, schools, local businesses, and recyclers, obtain written answers on:

- ownership and title at each handoff;
- data responsibility and certificates;
- minimum volume and pickup cadence;
- rejected-material rules and charges;
- insurance and indemnity;
- geography/exclusivity;
- training and audit rights;
- branding/white-label permissions;
- resale and donation revenue split;
- warranty responsibility;
- reporting and impact metrics;
- termination and stranded-stock treatment;
- whether local triage is allowed and what processes must be followed.

**Do not infer:** a public partner logo, supplier profile, or collection point proves neither an open partnership nor a right to divert items from a council/recycler stream.

## 14. Downstream and environmental evidence gaps

The AMR forensic research appropriately stops short of naming an unproven downstream recipient. The next evidence targets are:

- current written AMR acceptance rules for whole battery-bearing devices, loose lithium, CRTs, toner, business loads, and small quantities;
- the legal entity and first facility receiving each relevant material stream;
- whether a certificate identifies weight, category, date, and downstream route;
- NTCRS/AS 5377 or other applicable scheme status and scope;
- council contract ownership, reuse-diversion rights, and property transfer point;
- current routes for surrounding councils where the public record is incomplete;
- whether a downstream partner accepts pre-sorted reusable candidates;
- export controls, approved destinations, and final material recovery evidence;
- the carbon/material/landfill claim that can honestly be made for each route;
- mass-balance or serial-level tracking after handoff.

Research also needs to distinguish **reuse**, **repair**, **parts harvesting**, **material recovery**, **destruction**, and **disposal** in every impact report. “Recycled” should not be used as a substitute for a documented outcome.

## 15. Local operations and premises gaps

Even if Council, Fair Trading, landlord, and insurer permit the model, the practical layout is unresolved.

Design and test:

- clean intake zone;
- restricted unwiped zone;
- battery quarantine area;
- test bench;
- repair bench;
- sale-ready shelves;
- parts/donor shelves;
- rejected/awaiting-return area;
- outbound packing area;
- secure records and backup location;
- visitor movement and separation from private home areas;
- dust, moisture, heat, ventilation, lighting, ESD, and pest controls;
- maximum item count and floor load;
- one-way flow that prevents an unwiped device being listed or mixed with parts;
- daily close-down checklist for tools, chargers, batteries, data, and doors.

**Open:** measure the actual usable dry secure area and calculate capacity from labelled shelf positions, not floor piles.

## 16. Finance, staffing, and time gaps

The current documents include cost estimates and wage corrections, but the work still needs actual time-based economics.

Track:

- owner hours by intake, testing, wiping, repair, listing, messaging, packing, delivery, and administration;
- unpaid research and partner-contact time;
- travel kilometres and vehicle cost;
- tool depreciation and consumables;
- electricity and charging;
- insurance and compliance cost;
- storage occupancy and opportunity cost;
- failed repairs, dead stock, returns, and disposal fees;
- bookkeeping, tax, GST, and payment-processing time;
- cost of a second person for safe lifting, customer visits, or battery incidents;
- the point where a partner, employee, or warehouse becomes cheaper than continuing from home.

**Key metric:** gross contribution per owner labour hour by route, not revenue per item.

## 17. Community, accessibility, and social-impact opportunities

The research identifies digital inclusion partners, but the operating design can investigate more carefully:

- whether recipients need data/connectivity/training as well as a device;
- accessibility modifications and assistive technology;
- culturally safe referral and support through local organisations;
- device setup and digital-literacy sessions;
- repair workshops that do not expose customer data;
- paid training or supported employment pathways;
- First Nations, disability, youth, and regional skills opportunities;
- whether donating a device without ongoing support creates a predictable failure or exclusion;
- outcome measures beyond “device handed over”: continued use, study/work outcome, repairability, support calls, and return/recycling.

**Open:** identify one partner with a real device need and one partner with technical/support capacity before accepting donation-targeted inventory.

## 18. Marketing and trust gaps

Research and test:

- whether “e-waste”, “refurbished”, “secure data erasure”, “recycled”, “sustainable”, and “ITAD” mean the same thing to local customers;
- a plain-language public intake page that does not promise acceptance of all electronics;
- privacy notice for intake data, photos, messages, and certificates;
- consent to photograph equipment and publish impact figures;
- how to publish refusals and limits without appearing unreliable;
- local SEO and directory claims that may create an unwanted waste-drop expectation;
- a complaints and correction process;
- trust signals that can be earned at small scale: serialised records, test report, clear condition, honest warranty, and named downstream route.

Avoid claims such as “zero landfill”, “military-grade”, “100% recycled”, “secure destruction”, or “certified” unless the exact claim is supported by the process and evidence.

## 19. Pilot design: unanswered questions that only experiments can close

### 19.1 First 20–30 items

Before broad advertising, define:

- category quotas;
- acceptable sources;
- storage cap;
- maximum open repairs;
- no-go categories;
- test and wipe tools;
- stop-work triggers;
- owner-hour budget;
- disposal budget;
- buyer/recipient routes before intake;
- review date and go/no-go criteria.

### 19.2 Minimum outcome fields to add or clarify

The existing tracker should be reviewed for:

- triage start/end timestamps;
- refusal reason taxonomy;
- exact test protocol/version;
- battery quarantine/incident field;
- account-lock exception field;
- repair attempt count and rework;
- route changes and why they changed;
- listing views/messages/offers where available;
- time to sale/donation/recycling;
- warranty/return event;
- final downstream evidence ID;
- owner labour cost at a declared rate;
- confidence level for estimated value;
- whether a future item of the same model would be accepted.

### 19.3 Suggested go/no-go metrics

Set thresholds before seeing results, then record any change:

- safe acceptance rate;
- reusable/repairable/parts/donation/recycling/refusal proportions;
- median triage minutes by category;
- median repair minutes and parts cost;
- gross contribution per labour hour;
- days in stock;
- return/defect rate;
- proportion with complete ownership/data records;
- disposal cost per rejected or failed item;
- incidents and near misses;
- partner response rate;
- repeat supply rate;
- percentage of outcomes supported by evidence.

**Do not infer:** a profitable first item or a high resale price proves nothing about mixed intake. The pilot must include refusals, failed repairs, dead stock, returns, and end-of-life handling.

## 20. Prioritised research backlog

| Priority | Research item | Closure evidence | Owner/next action |
|---|---|---|---|
| P0 | Council classification and premises suitability | written Council response plus dry/secure workspace evidence | ask Council with the exact Phase 0 description |
| P0 | Fair Trading and insurer boundary | written/licensed advice and insurance confirmation | ask before public intake |
| P0 | 60-second safety/ownership/lock screen | tested one-page checklist | draft, train, observe, revise |
| P0 | Battery incident and quarantine procedure | site-specific risk assessment and drill | consult WHS/fire/insurer |
| P0 | Media/account sanitisation exceptions | approved SOP and failure route | test on representative devices |
| P0 | First 20–30 item pilot | complete tracker with outcomes and labour | pre-register quotas and stop rules |
| P1 | Model/category acceptance matrix | sold-price and pilot outcome dataset | collect 20+ comparable outcomes/category |
| P1 | Repair versus parts thresholds | labour/parts/failure dataset | measure every repair attempt |
| P1 | FlipTech/partner operating interview | written answers or site visit notes | request non-confidential process information |
| P1 | RTO/course comparison | current provider quotes and practical assessment | contact Dubbo/online RTOs |
| P1 | Practical learning syllabus | 10-hour watch/listen/read plan and quizzes | annotate resources in a study log |
| P1 | Inventory system choice | tested workflow and export/backup | prototype with fake data first |
| P1 | Local supply/demand interviews | structured notes from both sides | speak to businesses, buyers, charities |
| P1 | Sale/warranty/return workflow | reviewed listing, receipt, notice, and test report | consumer-law review |
| P2 | Category expansions | separate safety/economic/route sheets | only after core lanes pass |
| P2 | Board-level repair | volume, cost, insurance, referral comparison | defer equipment purchase |
| P2 | Impact/accounting method | defensible mass, reuse, and outcome definitions | align with partner/reporting needs |
| P2 | Social/support model | named partner and outcome measures | design only after device pathway exists |

## 21. Recommended next 30 days

1. Read the existing `INTAKE-POLICY.md`, `PHASE-0-OPERATING-BLUEPRINT.md`, templates, and this document together; resolve contradictions into one controlled version.
2. Ask Council, Fair Trading, landlord/agent, insurer, and WHS adviser the exact written questions already identified in the repository.
3. Build the 60-second triage card and a bench-test sheet for laptops, phones, tablets, and one “other” category.
4. Create a study log using UEE20520/ICT hardware units, Microsoft Learn, iFixit, and the selected Australian repair/resale videos and podcast episode.
5. Request a non-confidential FlipTech or comparable operator interview about thresholds, workflow, tools, and partner requirements.
6. Use fake asset IDs to test the tracker, certificates, photos, listing workflow, backup, and deletion/retention rules.
7. Run a closed pilot with known-source devices only. Do not open general public intake while the premises, insurer, battery, and legal gates remain open.
8. Review results by labour hour and safe final outcome. Expand categories only when a route is repeatable and documented.

## 22. Final decision rule

The unanswered question is not “can old electronics sometimes be sold?” It is:

> Can this operator repeatedly accept a defined class of devices, protect people and data, make a truthful value decision quickly, complete the work within a known labour budget, and prove a lawful final outcome without accumulating junk?

Until the evidence says yes for a specific category, the correct research result is **do not accept that category yet**.
