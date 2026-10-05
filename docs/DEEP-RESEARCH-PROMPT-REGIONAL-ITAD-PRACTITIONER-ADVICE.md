# Deep Research Prompt: Regional ITAD, Refurbishment and E-waste Operations

Use this prompt with a deep-research system to investigate the practical advice contained in the companion **Regional ITAD Practitioner Field Guide** and the surrounding topics in much greater depth.

The goal is not a generic e-waste report. The goal is to build a **practical learning and operating knowledge base for a small regional Australian ITAD/refurbishment pilot**, especially one beginning with laptops, desktops and selected mobile devices rather than broad household e-waste.

## Research context

Assume this operating scenario:

- regional NSW, with Dubbo as the working geography;
- initially small scale;
- one primary operator;
- limited operating days;
- home/shed or similarly constrained premises during the earliest pilot;
- strong existing IT support skills;
- focus on laptops and desktops first;
- possible later expansion into mobiles, networking equipment and selected other categories;
- interest in secure data destruction, reuse, resale, refurbishment and responsible downstream processing;
- no assumption that a full warehouse, advanced electronics lab or industrial processing line exists;
- interest in partnering with MSPs, computer shops, schools, businesses, councils, recyclers and established ITAD operators;
- a custom internal system called AssetFlow for jobs, lots, assets, media, evidence, sanitisation, diagnostics, repairs, resale, downstream and certificates.

A private regional practitioner supplied the operational ideas behind this prompt. Do **not** identify or attempt to infer the identity of that person. Treat the practitioner comments as experience to investigate, not authoritative evidence.

---

# Primary research objective

Investigate whether the following broad operating thesis is sound:

> A small regional operator can begin with a tightly scoped ITAD/refurbishment lane focused on useful business IT equipment, prioritise reuse and secure data handling, rapidly bucket devices by likely outflow/value, cap repair effort, use downstream partners for specialist or low-value streams, and only add broader e-waste categories and deeper repair capability when real volume and economics justify it.

Test this thesis rigorously.

Find evidence that supports it, evidence that complicates it, and evidence that contradicts it.

---

# Research standards

Use current information as of the research date.

Prioritise:

1. Australian primary sources;
2. NSW-specific government and regulatory sources;
3. recognised standards bodies;
4. reputable ITAD/data-destruction vendors;
5. established recyclers/refurbishers;
6. credible industry associations;
7. academic or technical literature;
8. operator interviews, conference talks, podcasts and videos;
9. enthusiast/community sources only where they add practical detail that cannot be found elsewhere.

For every important claim, distinguish:

- **law/regulation**
- **standard or certification requirement**
- **industry best practice**
- **vendor claim**
- **operator experience**
- **inference**
- **unverified anecdote**

Do not blur these categories.

Where advice varies by jurisdiction, state explicitly whether the source applies to:

- Australia;
- NSW;
- another Australian state;
- the United States;
- the EU;
- another region.

Do not import US R2/e-Stewards practice into NSW as though it were Australian law.

---

# Part 1: ITAD versus broad e-waste operations

Research the practical and commercial differences between:

- IT asset disposition;
- electronics refurbishment;
- computer repair;
- reuse/resale;
- e-waste collection;
- e-waste recycling;
- product stewardship;
- scrap recovery;
- reverse logistics.

Answer:

- What does each model actually do?
- Where do they overlap?
- What capabilities and risks are unique to each?
- Why might a narrow ITAD/refurbishment model be easier for a small regional operator than broad public e-waste?
- What categories create the worst storage, handling or downstream problems?
- Which categories tend to produce the best recoverable value relative to labour?

Find Australian examples of businesses that are:

- primarily ITAD;
- ITAD plus refurbishment;
- broad e-waste;
- social-enterprise reuse;
- repair-led;
- recycler-led.

For each example, explain its operating model rather than merely listing the company.

---

# Part 2: The economics of "get in, refurbish, get out"

Research inventory velocity and throughput economics in refurbishment.

Investigate:

- why old electronics lose value while sitting;
- labour as the key constraint;
- days-to-sale;
- repair queue growth;
- parts delays;
- return risk;
- storage cost;
- opportunity cost;
- resale platform fees;
- testing overhead;
- warranty/consumer-law exposure.

Find practical metrics used by refurbishers or reverse-logistics operators, such as:

- revenue per technician hour;
- gross recovery value per device;
- net recovery after labour;
- average days in inventory;
- percentage routed to resale;
- percentage routed to parts;
- percentage recycled;
- wipe pass/failure rate;
- repair conversion rate;
- return rate;
- average parts spend;
- average processing minutes.

Build a suggested metric set for a 30-device pilot.

Also research how mature operators set:

- repair time caps;
- repair cost caps;
- minimum resale value;
- minimum margin;
- automatic recycle/parts thresholds.

---

# Part 3: Intake bucketing and routing

Research how real ITAD/refurbishment operations triage inbound devices.

Look for:

- grading trees;
- disposition rules;
- automated routing;
- visual screening;
- data-bearing versus non-data-bearing routes;
- high-value exceptions;
- parts-harvest triggers;
- repair economics;
- vintage/collector exceptions;
- battery/safety holds.

Create a practical routing taxonomy for:

- laptop;
- desktop;
- mini PC;
- all-in-one;
- monitor;
- smartphone;
- tablet;
- Chromebook;
- server;
- network hardware;
- gaming PC;
- gaming laptop.

For each, specify:

- minimum intake checks;
- common high-value routes;
- common failure routes;
- quick-refurb opportunities;
- reasons to stop work;
- when parts harvesting makes sense;
- when downstream recycling should happen immediately.

Test whether a small number of stable "buckets" plus an exception path is better than a highly granular workflow.

---

# Part 4: Data sanitisation

Research current data-sanitisation practice in depth.

Cover:

- DBAN;
- nwipe;
- Blancco;
- Parted Magic Secure Erase;
- manufacturer firmware erase/sanitize;
- NVMe Format/Sanitize;
- ATA Secure Erase;
- SCSI/SAS sanitize;
- cryptographic erase;
- OPAL/SED/PSID workflows;
- mobile-device reset and key destruction;
- Apple erase workflows;
- Chromebook/ChromeOS reset and enterprise deprovisioning;
- Android enterprise/FRP;
- iOS Activation Lock;
- BitLocker/FileVault implications;
- failed or damaged storage.

Explain what DBAN historically did well and where it is now unsuitable.

Compare open-source and commercial tooling on:

- media support;
- automation;
- verification;
- audit reports;
- digital signatures;
- APIs;
- licensing;
- per-device cost;
- offline use;
- scale;
- customer credibility;
- evidentiary value.

Research current versions and current vendor statements, not old forum advice.

Standards/guidance to investigate include at least:

- current NIST media-sanitisation guidance;
- current ACSC guidance;
- ISO/IEC standards relevant to information security and storage;
- ADISA where applicable;
- R2v3 and e-Stewards as industry comparators;
- customer-specific destruction requirements.

For each standard/guideline, state exactly what it does and does not require.

Build a recommended sanitisation decision tree for:

- SATA HDD;
- SATA SSD;
- NVMe;
- SAS;
- USB storage;
- eMMC/UFS;
- encrypted storage;
- failed drives;
- locked devices.

---

# Part 5: Chain of custody and evidence

Research what makes an ITAD data-destruction process credible.

Investigate:

- custody records;
- serialized intake;
- media-to-parent-asset linkage;
- tamper-evident handling;
- evidence photos;
- sanitisation logs;
- exception handling;
- witness/signature requirements;
- destruction evidence;
- certificates;
- customer reporting;
- retention periods;
- immutable audit logs.

Find examples of good evidence packs.

Propose what AssetFlow should record at each stage.

Distinguish between:

- operational convenience;
- defensible evidence;
- customer-facing certification;
- legally mandated recordkeeping.

---

# Part 6: Commercial ITAD software and internal systems

Research software used by ITAD/refurbishment/recycling operators.

Look for current products such as:

- ITAD ERP platforms;
- recycling ERP;
- asset disposition workflow tools;
- warehouse/inventory systems;
- sanitisation integrations;
- barcode/QR systems;
- grading systems;
- downstream settlement tools;
- customer portals.

Identify current pricing where publicly available.

Test the anecdotal claim that even relatively inexpensive industry-specific systems can cost hundreds of dollars per month.

Compare commercial platforms with building a lightweight internal system.

Assess what functions are genuinely valuable at very small scale:

- asset ID;
- job/lot;
- source/customer;
- location;
- chain of custody;
- photo evidence;
- serial/model;
- media;
- wipe state;
- diagnostics;
- repair;
- grade;
- route;
- listing;
- sale;
- recycling;
- certificate;
- settlement;
- search;
- barcode/QR.

Then identify functions that should wait until volume justifies them.

---

# Part 7: Barcode and QR workflows

Research practical asset-labelling systems used in warehouses, repair businesses and ITAD operations.

Compare:

- 1D barcode;
- QR code;
- Data Matrix;
- RFID/NFC where relevant.

Research:

- label durability;
- thermal printers;
- label sizes;
- scanner choices;
- phone-camera scanning;
- printed human-readable asset ID;
- batch printing;
- reprinting;
- label replacement;
- evidence linkage;
- offline workflows.

Design a low-cost workflow suitable for a shed pilot and a later higher-volume workflow.

---

# Part 8: Basic labels versus deep integration

Investigate the claim that modest manual double-handling can be cheaper than premature system integration.

Find examples or operations-research principles relevant to:

- manual handoffs;
- specialised workstations;
- small-volume batch processing;
- automation ROI;
- WMS/ERP implementation;
- barcode adoption;
- lean manufacturing;
- queueing theory;
- standard work.

Answer:

- At what volume does automation typically begin to pay?
- What errors are most worth automating first?
- What should stay manual at low volume?
- How do you measure whether an integration saves time?

Build an automation maturity model from a 10-device pilot to a multi-staff warehouse.

---

# Part 9: Refurbishment skill stack

Research the highest-return technical skills for laptop/desktop refurbishment.

Rank by:

- frequency;
- learning difficulty;
- tool cost;
- time saved;
- value recovered;
- safety risk.

Include:

- SSD installation;
- RAM;
- batteries;
- chargers;
- docks;
- keyboard;
- screen;
- hinge/case;
- fan;
- thermal work;
- CMOS/RTC;
- BIOS/UEFI;
- firmware;
- diagnostics;
- OS deployment;
- driver automation;
- battery testing;
- storage health;
- display/keyboard/touchpad/webcam/audio/Wi-Fi/Bluetooth testing.

Build a competency ladder from beginner to advanced refurbisher.

---

# Part 10: Soldering and board-level repair

Investigate how much board-level repair is actually used in:

- ordinary ex-office refurbishment;
- gaming laptop repair;
- gaming desktop/GPU repair;
- phone repair;
- console repair.

Identify:

- common soldering jobs;
- common micro-soldering jobs;
- equipment needed;
- realistic training path;
- when specialist outsourcing is better;
- safety/ventilation requirements;
- whether a "very expensive lab" is actually necessary for basic soldering;
- what equipment cost looks like at entry, intermediate and professional levels.

Separate:

- basic through-hole soldering;
- connector replacement;
- hot-air rework;
- BGA work;
- board-level diagnostics;
- GPU/VRAM work.

Build a decision framework for whether a small ITAD operation should develop this capability.

---

# Part 11: Office gear versus gaming hardware

Research failure patterns and economics for:

- business laptops;
- consumer laptops;
- gaming laptops;
- office desktops;
- gaming desktops;
- GPUs.

Compare:

- thermal issues;
- physical damage;
- liquid damage;
- board failures;
- parts cost;
- resale value;
- labour;
- buyer expectations.

Test the claim that gaming hardware tends to justify deeper physical repair more often than ordinary office fleet gear.

---

# Part 12: Computer shops and repair shops as partners

Research partnership models between:

- ITAD firms;
- MSPs;
- computer shops;
- repair shops;
- recyclers.

Look for examples of:

- referral relationships;
- white-label disposal;
- downstream processing;
- parts supply;
- unrepairable-device transfer;
- subcontracted board repair;
- revenue share;
- customer-value-add services.

Develop a partnership pitch for a regional MSP and a separate pitch for a local repair shop.

Do not assume either wants to give away valuable stock.

---

# Part 13: Schools and business sourcing

Research how Australian schools, SMEs, medical practices and professional firms dispose of retired devices.

Investigate:

- asset replacement cycles;
- leasing;
- vendor take-back;
- security requirements;
- procurement obligations;
- education department rules;
- approved recyclers;
- data handling;
- sustainability reporting;
- donations/reuse;
- resale restrictions.

Focus especially on NSW and regional contexts.

Find public tenders, disposal policies and case studies where possible.

Build a list of discovery questions to ask a school or business before proposing a service.

---

# Part 14: MSP-led drop-off and downstream processing

Investigate whether an MSP can realistically operate as:

- a scheduled handoff point;
- a customer-facing collection partner;
- a temporary secure drop-off;
- a white-label ITAD service.

Research:

- custody;
- insurance;
- premises;
- staff responsibility;
- data-bearing device storage;
- overflow;
- batteries;
- customer paperwork;
- service branding.

Design a safe process that avoids an uncontrolled public e-waste bin.

---

# Part 15: The psychology of "donation" versus "asset recovery"

Research how framing affects expectations.

Look for evidence from:

- reuse charities;
- recommerce;
- second-hand goods;
- corporate asset recovery;
- donation programs.

Explore why a person may be comfortable with "waste" being commercially recovered but uncomfortable with a "donation" being resold for profit.

Develop transparent language for:

- public intake;
- business intake;
- charity/community intake;
- revenue-share intake.

Avoid manipulative wording.

---

# Part 16: Never-pay acquisition strategy

Investigate the advantages and risks of:

- free intake;
- fee-for-service collection;
- paid acquisition;
- consignment;
- revenue share;
- buyback;
- rebate settlement.

Find examples in ITAD, scrap and recommerce.

Develop rules for when it becomes rational to pay for equipment.

Include anti-fraud and grading controls.

---

# Part 17: Op shops and community sources

Research what electronics streams Australian op shops commonly receive and how they handle them.

Investigate:

- safety;
- test-and-tag;
- product recalls;
- electrical goods policies;
- partnerships with recyclers;
- data-bearing devices;
- donation refusal categories.

Assess whether op shops are a good source for a laptop/desktop-focused operation or mainly a source of mixed low-value electronics.

---

# Part 18: Transfer stations, councils and official channels

Research the legal and operational reality of recovering reusable electronics from:

- council transfer stations;
- community recycling centres;
- e-waste collection events;
- product-stewardship sites.

Focus on NSW.

Answer:

- who owns deposited material;
- what contracts may govern it;
- whether reuse diversion is permitted;
- liability;
- site safety;
- operator agreements;
- data-bearing devices;
- batteries.

Find examples where councils deliberately partner with reuse organisations.

---

# Part 19: Home/shed versus warehouse operations

Research capacity thresholds that make a home/shed operation impractical.

Analyse:

- storage density;
- fire load;
- lithium battery risk;
- customer visits;
- vehicle movements;
- security;
- insurance;
- zoning/planning;
- neighbour impact;
- manual handling;
- egress;
- data security.

Find examples of small refurbishers transitioning from home to commercial premises.

Develop specific trigger metrics, such as:

- assets held;
- cubic metres;
- number of batteries;
- weekly inbound;
- weekly outbound;
- days inventory;
- customer collections;
- staff/volunteers.

---

# Part 20: Scale risk in a side business

Research why electronics accumulation can outrun a part-time operator.

Use queueing and capacity concepts to model:

- inbound rate;
- processing rate;
- rework;
- blocked items;
- downstream batch delays.

Show how even a small imbalance creates growing inventory.

Build a simple capacity model for:

- one operator;
- two days per week;
- 4, 8, 12 and 20 devices per week.

Identify safe WIP caps.

---

# Part 21: Parts harvesting

Research the economics of harvesting:

- RAM;
- SSDs;
- HDDs;
- screens;
- keyboards;
- chargers;
- docks;
- Wi-Fi cards;
- CPUs;
- GPUs;
- power supplies;
- fans;
- motherboards;
- cables.

Determine what is typically worth removing and what usually creates low-value clutter.

Include:

- test time;
- listing time;
- storage;
- buyer demand;
- failure/return risk.

Build a parts-harvest matrix for common business laptops/desktops.

---

# Part 22: Charger inventory

Research efficient ways to manage large mixed charger stocks.

Include:

- barrel connector identification;
- Lenovo slim-tip;
- Dell/HP identification pins;
- USB-C PD;
- wattage;
- polarity;
- universal chargers;
- counterfeit/safety risks;
- storage bins;
- labelling;
- compatibility database design.

Create a practical charger sorting system and data model for AssetFlow.

---

# Part 23: Vintage and collector preservation

Research when an old computer should be preserved instead of stripped.

Focus on:

- IBM ThinkPads;
- early Lenovo;
- beige PCs;
- Windows 95/98/XP-era systems;
- vintage Apple;
- unusual enterprise hardware;
- period gaming systems.

Use sold-market evidence where possible.

Develop a rapid "VINTAGE REVIEW" checklist that prevents accidental destruction of collectable equipment without turning every old machine into a museum project.

---

# Part 24: Community and charity reuse

Research models where commercial refurbishers work with:

- charities;
- social enterprises;
- community groups;
- volunteer repair groups.

Look at:

- donated refurbished devices;
- discounted devices;
- volunteer teardown;
- community learning;
- circular-economy partnerships.

Assess how to manage:

- liability;
- data;
- product safety;
- unusable leftovers;
- ownership;
- brand expectations.

Find Australian examples.

---

# Part 25: Scrap and commodity pricing

Research how electronics scrap is priced.

Cover:

- boards;
- CPUs;
- RAM;
- copper;
- aluminium;
- steel;
- power supplies;
- mixed computer scrap;
- hard-drive boards/magnets where relevant.

Explain:

- grades;
- contamination;
- minimum quantities;
- spot pricing;
- processor margins;
- transport;
- settlement.

Do not provide static prices without dates and source.

Create a method for maintaining a current downstream price book.

---

# Part 26: Trusted downstream settlement

Research models where a processor accepts material, grades it, then reports value and pays later.

Investigate:

- assay/settlement models;
- consignment;
- scrap settlement;
- weight tickets;
- audit rights;
- chain of custody;
- dispute handling;
- trust risk.

Design a reconciliation sheet suitable for AssetFlow.

---

# Part 27: Regional network strategy

Research how a regional operator can avoid duplicating expensive infrastructure.

Identify services that can sensibly remain external:

- certified destruction;
- specialist wipe;
- damaged battery handling;
- downstream recycling;
- commodity aggregation;
- micro-soldering;
- high-end diagnostics;
- logistics;
- resale channels.

Find Australian regional partnership examples.

Build a "local vs partner" decision matrix.

---

# Part 28: Collaboration without franchising

Research lightweight commercial structures for collaboration between an established operator and a new regional operator.

Compare:

- referral;
- subcontract;
- revenue share;
- joint venture;
- licence agreement;
- reseller;
- agency;
- franchise;
- co-brand;
- white label.

Analyse:

- control;
- IP;
- training;
- territory;
- customer ownership;
- liability;
- reporting;
- termination;
- branding.

Explain why a formal franchise may be unnecessary at pilot stage.

---

# Part 29: Relevant Australian regulation and compliance

Build a current regulatory map for a NSW ITAD/refurbishment pilot.

At minimum investigate:

- NSW EPA waste/e-waste rules;
- Protection of the Environment Operations framework;
- product stewardship / NTCRS / Recycling and Waste Reduction Act;
- Australian Privacy Act and current reforms;
- Notifiable Data Breaches;
- NSW Fair Trading;
- second-hand dealer/property rules if relevant;
- Australian Consumer Law;
- product safety;
- electrical safety;
- EESS where relevant;
- WHS;
- SafeWork NSW;
- lithium batteries;
- dangerous goods;
- fire safety;
- transport and postage;
- local planning/home business requirements;
- insurance implications.

For each item, state:

- what activity triggers it;
- whether it applies to this pilot;
- evidence required;
- unresolved questions.

Do not assume.

---

# Part 30: Media learning library

Build a high-quality learning library with direct links.

Create separate sections for:

## Podcasts

Find at least 20 strong episodes or series covering:

- ITAD;
- refurbishment;
- reverse logistics;
- e-waste;
- data destruction;
- electronics recycling;
- reuse;
- recommerce;
- refurb economics;
- regional operations.

Prefer Australian content where available, then strong global material.

For each include:

- title;
- show;
- speaker/company;
- date;
- length;
- direct link;
- why it matters;
- which topic in this prompt it covers;
- whether it is practical/operator-level or mostly promotional.

## YouTube/videos

Find at least 30 useful videos.

Prioritise:

- facility tours;
- refurb workflows;
- data sanitisation demonstrations;
- teardown/repair economics;
- warehouse flow;
- barcode/inventory systems;
- electronics recycling lines;
- reverse-logistics talks;
- R2/ADISA/standards explanations;
- Australian operators.

For each provide:

- title;
- channel;
- date;
- length;
- direct link;
- 2–4 sentence relevance note;
- timestamps for the most useful sections where available.

Avoid low-value clickbait.

## Reading

Find at least 30 strong documents/articles.

Include:

- government guidance;
- standards summaries;
- vendor technical papers;
- academic papers;
- industry reports;
- case studies;
- operator blogs;
- product documentation.

For each give:

- direct link;
- publication date;
- authority/source type;
- what to read it for.

---

# Part 31: Australian companies and case studies

Research public information about relevant Australian organisations and models, including where useful:

- FlipTech;
- Renew IT;
- SIR-CEL;
- PonyUp for Good;
- TechCollect;
- CompNow;
- Reconnect / device-reuse initiatives;
- established ITAD providers;
- regional e-waste operators;
- social-enterprise refurbishers.

Do not repeat private conversations.

Use only public, citable material.

For each organisation, analyse:

- intake;
- customers;
- data security;
- refurbishment;
- resale/reuse;
- downstream;
- geography;
- apparent scale;
- differentiator;
- lessons for a Dubbo pilot.

---

# Part 32: What the practitioner advice may be wrong about

Actively challenge the advice.

Find evidence against or caveats to claims such as:

- "never pay for equipment";
- "narrow ITAD is easier revenue";
- "soldering is rarely needed";
- "basic labels are cheaper than integration";
- "computer shops are strong sources";
- "op shops mostly generate low-value electronics";
- "commercial wipe software carries more weight";
- "side-volume grows quickly";
- "gaming hardware needs more physical repair";
- "trusted downstream settlement is efficient".

For each claim give:

- supporting evidence;
- contrary evidence;
- conditions under which it is true;
- conditions under which it fails.

---

# Required final deliverables

Produce all of the following.

## 1. Executive synthesis

A 2,000–3,000 word synthesis answering:

**What should a small regional NSW ITAD/refurbishment operator actually do first, and what should they deliberately not do yet?**

## 2. Evidence table

Columns:

- topic;
- practitioner claim;
- evidence status;
- strongest supporting source;
- strongest contrary/caveat source;
- Australian applicability;
- operational implication.

## 3. 30-device pilot design

Give:

- accepted categories;
- intake limits;
- WIP limits;
- routing buckets;
- repair caps;
- data controls;
- safety stops;
- downstream requirements;
- metrics;
- success/failure thresholds.

## 4. Skills roadmap

Create:

- first 10 skills;
- next 10 skills;
- advanced skills;
- skills not worth learning yet.

For each include recommended learning resources.

## 5. Watch/listen/read curriculum

Build:

- 10 hours of podcasts;
- 10 hours of videos;
- 10 hours of focused reading.

Order them from foundational to advanced.

## 6. 30-day learning plan

Assume approximately 30–60 minutes on workdays and 1–2 longer sessions per week.

Make it realistic.

## 7. Deep-dive reading list

Separate:

- data sanitisation;
- refurbishment;
- repair economics;
- warehouse/process design;
- ITAD sales;
- sourcing;
- e-waste downstream;
- regulation/compliance;
- software/automation;
- regional business models.

## 8. AssetFlow implications

For every major finding, say whether AssetFlow needs:

- no change;
- workflow change;
- new field;
- new status;
- new report;
- new integration;
- new safety gate.

Do not recommend features merely because they are technically possible.

## 9. "Questions to ask experienced operators"

Create at least 50 high-value questions that extract practical knowledge about:

- sourcing;
- triage;
- wipe;
- grading;
- repair;
- parts;
- resale;
- downstream;
- software;
- staffing;
- premises;
- mistakes;
- margins;
- customer acquisition.

Avoid generic interview questions.

## 10. Unknowns register

List what remains uncertain after research and the best next way to verify each unknown.

---

# Output quality rules

- Cite every material factual claim.
- Prefer current direct sources.
- Include dates.
- Give direct links.
- Do not hide weak evidence behind confident prose.
- Mark paywalled or inaccessible standards.
- Do not treat vendor marketing as independent evidence.
- Distinguish "what large certified ITADs do" from "what a tiny regional pilot needs".
- Keep recommendations proportional to the scale.
- Do not recommend expensive equipment without showing the volume/economic trigger.
- Do not recommend accepting a category unless a safe downstream route exists.
- Avoid romanticising refurbishment where labour economics do not work.
- Avoid treating recycling as failure when reuse is not safe/economic.
- Avoid treating reuse as automatically superior where data, safety or reliability risks dominate.
- Explicitly call out advice that should remain experimental rather than policy.

---

# Final research question

At the end, answer this in one page:

> If you had to build the safest, simplest, most economically sensible two-day-per-week ITAD/refurbishment operation in regional NSW from scratch, using mostly existing IT skills and a small shed, what exact operating model would you choose for the first 90 days, why, and what evidence would make you change direction?

