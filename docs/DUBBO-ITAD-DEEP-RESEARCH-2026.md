# ITAD / Refurb Business in Regional NSW — Deep Research Review

**Research date:** 5 October 2026  
**Geographic focus:** Dubbo / regional NSW, Australia  
**Business context:** small, part-time, reuse-first IT asset disposition (ITAD) / refurbishment pilot focused initially on laptops, desktops and mobile devices  
**Evidence approach:** Australian and NSW primary sources first; operator first-party material second; international standards and practitioner experience are labelled where they are not Australian law.

> This is operational research, not legal, tax, insurance, planning, privacy, WHS or electrical advice. A public webpage, operator practice or industry standard does not override the law, a contract, a regulator, Council, an insurer or site-specific professional advice.

## Evidence labels

- **STRONG** — current legislation/regulator/government/standards body or clear first-party contractual/process evidence.
- **MODERATE** — current first-party operator, vendor or market evidence that is useful but not independently audited.
- **WEAK / ANECDOTAL** — practitioner experience, informal operator advice, community commentary or claims that need validation.
- **SCENARIO** — deliberately modelled numbers for decision-making, not claimed industry averages.

---

# Executive summary

1. **Start as a selective ITAD/refurbishment service, not a general e-waste depot.** The commercial value in ITAD is secure collection, serial-level custody, sanitisation, testing, reuse and reporting. Broad e-waste adds low-value material, storage, transport, battery/hazard streams and commodity-processing complexity.

2. **Calling the activity “ITAD”, “tech recovery” or “refurbishment” does not make NSW waste law disappear.** NSW planning and waste classification turn on the actual activity, material and site, not the marketing label. A home business may sometimes be exempt development, but Dubbo Council still needs to confirm the correct land-use classification for the proposed operation.

3. **Do not run public drop-off at Phase 0.** Use pre-screened, appointment-only business/source collections. This sharply reduces dumping, unknown ownership, unsafe batteries, storage pressure and household disruption.

4. **Do not promise to buy incoming equipment.** Free transfer, paid service/collection, or a post-assessment residual-value share are safer early models. “Never pay” is not an industry rule: mature Australian ITAD providers do offer buyback/FMV arrangements when asset quality and volume justify it.

5. **Data handling is the trust product.** Build around source authority, unique asset IDs, restricted unwiped storage, tool/version/method/result records, validation, exception handling and release controls. NIST SP 800-88 Rev.2 is the current NIST publication; ASD’s 2026 ISM media guidance is an important Australian government benchmark.

6. **nwipe can be commercially useful at small scale, but it is not a magic certification.** Modern nwipe can create PDF records and supports ATA/NVMe secure-erase/sanitise functions. A credible service still requires media-specific methods, validation, failure handling and records. Enterprise contracts may require Blancco, R2-style controls or another specified platform.

7. **In 2026, Windows 11 compatibility is an economic gate.** Windows 10 standard support ended on 14 October 2025. Prioritise business-class devices that are officially Windows 11 compatible. “Intel 8th gen+” is a useful shorthand, not the rule; check exact CPU, TPM 2.0, UEFI/Secure Boot and Microsoft support lists.

8. **You do not need a $100,000 microsoldering setup.** Basic professional hot-air/soldering stations are hundreds of dollars, not six figures. What is expensive is the skill, microscopy/ESD/fume setup, fault isolation, BGA/X-ray class equipment and warranty risk. Modular repair should come first.

9. **Do not buy a large ITAD ERP at Phase 0.** A small operation needs immutable-ish custody/event records, barcode/QR IDs, sanitisation evidence, locations, WIP ageing and sale/downstream outcomes. The existing AssetFlow system already covers the useful small-scale core.

10. **Recommendation: START SMALL, but do not broaden intake yet.** Continue the controlled build and synthetic/owned-device testing now. Do the first external 5–10 device business pilot only after Council/premises, insurance, employer-conflict, resale/Fair Trading, battery/electrical and downstream gates are closed in writing.

---

# 1. ITAD vs e-waste vs refurb/reuse

## Findings

### ITAD

IT asset disposition is an asset-lifecycle service rather than simply “recycling computers”. Mature ITAD offerings commonly bundle:

- secure collection/decommissioning;
- chain of custody;
- serial/asset-register reconciliation;
- data sanitisation or destruction;
- testing and grading;
- refurbishment/redeployment;
- remarketing/value recovery;
- downstream recycling for failures;
- customer reporting and certificates.

WorkVentures publicly describes a sequence of customer service → secure collection → secure warehouse → asset management → secure data destruction → recycling → reuse → sustainability reporting. Sircel similarly combines secure collection, Blancco erasure, verified certificates, recovery/repurpose, resale/broker channels and in-house recycling.

**Evidence strength: STRONG for the advertised operating model; MODERATE for actual economics because operator margins are private.**

### E-waste recycling

E-waste recycling focuses on discarded electrical/electronic equipment and the recovery of materials or safe downstream treatment. It is broader than ITAD and can include TVs, printers, peripherals, cables, small appliances, batteries and low-value or unusable material.

A recycler must solve problems that a selective refurbisher can initially avoid:

- large-volume storage;
- mixed/negative-value streams;
- hazardous components;
- transport and downstream contracts;
- commodity sorting;
- environmental controls;
- fire/battery risk;
- contamination;
- public drop-off behaviour and illegal dumping.

### Refurbishment / reuse

Refurbishment is the preparation of usable equipment for another life: sanitise, test, repair, clean, grade, image/configure and release. It can sit inside ITAD, a repair business, a social enterprise or a reseller.

The Reconnect Project, for example, publicly describes triage, repair, Blancco erasure, reuse, donor-parts harvesting and Australian downstream recycling of failures. WorkVentures similarly integrates refurbishment with logistics/ITAD.

### Why ITAD can be “lighter weight”

The experienced-operator advice that ITAD can be less stressful than running a full e-waste operation is plausible **only if the scope stays selective**.

The lighter model is:

> good source → defined batch → custody → sanitisation → test/grade → reuse/resale → known residual route

The heavier model is:

> anyone can dump almost anything → sort unknown material → store it → find multiple downstream routes → manage hazards/negative value

The word **ITAD** itself creates no legal exemption. The lighter burden comes from product and source selection, not branding.

### Australian positioning examples

| Model | Example | Public positioning |
|---|---|---|
| Enterprise ITAD + recycling | Sircel | Sanitisation, certificates, FMV/buyback, repurpose, recycle failures |
| Social-enterprise ITAD | WorkVentures | Secure decommissioning, sanitisation, refurbishment, reuse, reporting |
| Asset recovery / lifecycle | Greenbox | Secure transport, scan/test/sanitise, database reconciliation, remarketing |
| Corporate reuse/social impact | PonyUp for Good | Asset registers, Blancco, remarketing/social impact, ANZRP residuals |
| Repair/refurb/social reuse | The Reconnect Project | Triage, repair, Blancco, donor parts, community distribution |
| Small regional reuse/e-waste | Regional operators | Often broader practical mix of repair, reuse, parts and recycling |

## What I should do next

Define DubboEwaste Phase 0 publicly as:

> **Pre-arranged IT asset recovery and refurbishment for selected business electronics, with secure data handling and responsible downstream recycling for equipment that cannot be reused. No public drop-off.**

Do not market as a full e-waste facility while the site and downstream capacity are intentionally small.

## What I should ask an expert

- Council: “How do you classify this exact activity at this exact residential premises if intake is appointment-only, low volume, mainly laptops/desktops/mobile devices, with no public bins and no mechanical recycling?”
- Insurer: “Do you cover custody of third-party electronics, stored client data-bearing devices, repair/testing/charging, resale and small amounts of e-waste awaiting downstream transport?”
- Established ITAD operator: “Which parts of your margin come from service fees versus remarketing versus downstream rebates?”

## Reading / listening

- WorkVentures — Decommissioning: https://workventures.com.au/decommissioning/
- Sircel — ITAD Asset Recovery & Repurposing: https://sircel.com/services/itad-asset-recovery-repurposing/
- The Reconnect Project — Donate / process: https://thereconnectproject.com.au/donate/
- SERI / R2 Knowledge Base: https://sustainableelectronics.org/knowledge-base/
- All Things Circular episodes featuring Australian and international circular-IT operators.

---

# 2. Positioning and sourcing

## “Tech recovery / refurb” versus “e-waste”

### Finding

Using a reuse/refurbishment framing is commercially sensible but **not a safe way to assume away NSW waste regulation**.

The NSW Planning Portal says some home-based businesses can operate as exempt development, including within a detached garage/studio, if the relevant standards are met. Dubbo Regional Council says land-use activities can be permitted without consent, permitted with consent, or prohibited depending on the LEP/zone and actual activity.

NSW EPA waste licensing thresholds for resource recovery, waste processing and waste storage are vastly above a six-device shed pilot. That is useful, but being below an Environment Protection Licence threshold is **not the same thing as being outside waste/planning/pollution law**.

The correct question is therefore not “what word avoids regulation?” It is:

> “What is the actual planning and waste classification of a low-volume, reuse-first home operation handling pre-arranged retired electronics?”

**Evidence strength: STRONG.**

## Why “donation” can be risky

“Donation” is not a banned word, but a for-profit collector must not create the misleading impression that it is a charity or that the donor receives tax-deductible treatment.

The ACCC has previously required a commercial recycler to clarify that it was not a charity where its collection presentation created that impression.

Safer commercial wording:

- “free transfer of ownership”;
- “asset recovery collection”;
- “pre-approved retired-device collection”;
- “equipment transferred for reuse, refurbishment, parts recovery or responsible recycling”;
- “no charitable tax deduction is offered”.

If a charity/social-enterprise partner is involved, state exactly which entity is the charity and what the relationship is.

**Evidence strength: STRONG for misleading-conduct risk; MODERATE for preferred wording.**

## Should I ever pay for incoming equipment?

The practitioner rule “never pay” is too absolute.

Mature ITADs may provide:

- guaranteed/fair market value;
- buyback;
- revenue share;
- residual-value credits;
- staff purchase/redeployment schemes.

Sircel publicly offers an agreed-value buyback scheme for qualifying devices.

For a tiny startup, however, **no up-front purchasing is a good Phase 0 control**. You do not yet have enough grading, failure-rate and resale data to price unknown lots safely.

Recommended progression:

1. **Phase 0:** free transfer or client-paid service/collection.
2. **Phase 1:** post-assessment residual-value share for known business fleets.
3. **Later:** pre-agreed buyback tables only after real model/condition/failure data exists.

## Free collection versus paid collection

### Free collection

Pros:
- easy offer;
- good for nearby, clean, known batches;
- helps create source relationships.

Cons:
- fuel/time can exceed asset value;
- sources may send poor material;
- can train customers to expect free logistics forever.

### Paid collection / ITAD service

Pros:
- values custody, labour and reporting independently of resale;
- protects margin when hardware is old;
- easier to support certificates and detailed reporting.

Cons:
- harder initial sale;
- customer compares against free recyclers/NTCRS outlets.

### Recommended pricing architecture

Do not force one model on every job.

Quote separately:

- collection/logistics;
- data sanitisation/certificate;
- decommissioning/project labour;
- special destruction/downstream charges;
- asset-value credit after grading.

That keeps “the laptops are worth less than expected” from destroying the service economics.

## Sourcing channel assessment

| Source | Likely device quality | Access cost / friction | Phase 0 view |
|---|---|---|---|
| Local computer/repair shops | mixed parts + older PCs + occasional good trade-ins | relationship/time; possible incumbent downstream arrangements | **Good lead** if ownership transfer is explicit |
| Small/medium businesses | business-class laptops/desktops, predictable refreshes | outreach + pickup + security expectations | **Best first target** |
| MSP clients | potentially excellent fleet-quality equipment | conflict/contract/channel risk | **Only with written employer/client authority** |
| Private schools | Chromebooks/laptops, mixed age; privacy/account-lock issues | procurement/policy/approval | **Possible later**, not casual |
| NSW public schools | fleet devices under Department process | central contract / EDConnect | **Not an informal sourcing channel** |
| Medical practices | useful business hardware but high sensitivity | privacy/security/insurance expectations | **Later**, after stronger data controls/insurance |
| Councils/government | volume and repeatability | procurement panels/contracts, compliance | **Partner/subcontract route later** |
| Transfer stations | high volume but mixed/low value, public waste stream | Council/concession/contract/regulatory issues | **Avoid Phase 0** |
| Op shops | irregular and often older/untested | relationship; charity policies | **Selective only** |
| Deceased estates | mixed consumer gear, provenance issues, Apple/Google locks | executor authority, time, low repeatability | **Ad hoc**, not core supply |
| Households | very mixed quality and dumping risk | high screening labour | **Referral/pre-approval only** |

### NSW public schools specifically

The NSW Department of Education’s current Technology in schools procedure requires disposal/deactivation records and secure wiping and says the Department has a dedicated eWaste contract accessed through EDConnect.

NSW Government Contract 9826 is a mandatory whole-of-government ICT end-user device/services contract through 30 September 2028 and includes decommissioning and lifecycle services.

Therefore:

> Do not approach a NSW public school principal as if they can simply give a pile of Department laptops to a local startup.

A future route is to become a subcontractor/regional field partner to an approved vendor or scheme, not to bypass the Department process.

## MSP employee conflict of interest

Business.gov.au’s employment-contract guidance explicitly treats running a similar business as a possible conflict of interest.

Minimum ethical controls:

- disclose the side business in writing to the employer;
- obtain written agreement if required;
- do not use employer time, vehicles, tools, software, client lists or confidential pricing;
- do not solicit employer clients without explicit consent;
- do not divert disposal opportunities learned through work;
- do not accept a client device because “they were throwing it out” without written authority;
- make the source of every batch independently auditable.

## What I should do next

Build a sourcing list of 20 **non-conflicted** local SMEs and computer/repair businesses. Offer a small pre-arranged pilot, not an open-ended “give me all your e-waste” service.

Create three commercial offers:

1. **Free local recovery** — only for pre-approved batches with likely reuse value.
2. **Paid secure ITAD** — collection + serial register + sanitisation + report.
3. **Value-share** — assessed devices receive a credit after processing.

## What I should ask an expert

- Employer/HR/manager: “What exact boundaries would make this side business acceptable?”
- Private school/business: “Who has authority to transfer ownership, and what data/custody certificate do you require?”
- Public-sector vendor: “Can a regional Dubbo operator subcontract collection, triage or field services under your existing panel?”

## Reading / listening

- NSW DoE Technology in schools: https://education.nsw.gov.au/policy-library/policies/pd-2024-0481-01
- NSW Contract 9826: https://www.info.buy.nsw.gov.au/contracts/ict-end-user-devices-and-services
- business.gov.au conflict-of-interest guidance/tooling: https://employ.business.gov.au/categories
- ACCC commercial-recycler charity case: https://www.accc.gov.au/media-release/commercial-recycler-makes-clear-it-is-not-a-charity

---

# 3. Data destruction and certification

## DBAN, nwipe and Blancco

### DBAN

DBAN (Darik’s Boot and Nuke) made multi-pass HDD wiping familiar, but it is a legacy tool and should not be treated as a modern commercial assurance platform, especially for SSD/NVMe media.

Its important historical legacy for this project is the **dwipe** engine.

### nwipe

nwipe is an open-source continuation/fork of DBAN’s dwipe engine that runs on modern Linux environments.

Current nwipe supports:

- parallel drive erasure;
- multiple overwrite/verification methods;
- SMART information when supporting tools are available;
- HPA/DCO detection support;
- PDF erasure certificates;
- current ATA and NVMe secure-erase/sanitise capabilities;
- explicit failure outcomes for bad drives.

The project itself warns that ordinary host-addressable overwrite is not sufficient assurance for flash media because wear levelling, remapped blocks and over-provisioning can make some NAND inaccessible to normal writes.

**Evidence strength: STRONG for tool capability; MODERATE for commercial suitability because acceptance depends on client/contract.**

### Blancco

Blancco is a mature commercial platform widely used by Australian ITAD operators because it combines supported erasure methods with centralised records/certificates.

Current Australian reseller list prices found during this review included roughly:

- Drive Eraser Enterprise, 50–499 volume: **A$22.59 per erasure**;
- 500–999: **A$18.07**;
- 1000+: **A$14.47**;
- an SMB 50-erasure + management bundle around **A$982**;
- Essentials platform examples around **A$2,750** plus per-erasure pricing.

These are **public reseller list prices observed in October 2026, not a Blancco quote and not guaranteed to include every required component/service**.

## Current standards

### NIST SP 800-88 Rev.2

NIST finalised **SP 800-88 Rev.2 in September 2025**, superseding Rev.1.

The important strategic change is that sanitisation should be a **program** based on information sensitivity, approved techniques, validation and disposal/reuse controls. Rev.2 moves away from being merely a cookbook of overwrite patterns.

Do not market “NIST-certified wiping”. NIST publishes guidance; it does not certify your particular wipe event.

### ASD ISM media guidance

The Australian Signals Directorate published updated **Guidelines for media** in September 2026 for government/large-organisation contexts.

Use it as an Australian high-assurance benchmark, especially when talking to government/security-sensitive customers. Do not claim that every private SME contract legally requires the ISM.

### AS 5377:2022

The current Australian standard is:

**AS 5377:2022 — Management of electrical and electronic equipment for re-use or recycling.**

It covers collection/storage, preparation for reuse, treatment, transport, data security, traceability, risk and quality management.

Some current scheme/operator pages still refer to **AS/NZS 5377:2013**. That is legacy wording: AS 5377:2022 superseded the 2013 joint standard.

### R2v3

R2v3 is not Australian legislation. It is a voluntary certification framework that can matter commercially.

For an R2-certified facility doing logical sanitisation, Appendix B adds strong controls. SERI’s binding interpretation says simple operator-created spreadsheets are not enough to meet its “software sanitisation” record expectations. It recommends automated/controlled records linked to unique media identities and validation.

That does **not** mean a small non-R2 refurbisher is prohibited from using a spreadsheet/nwipe workflow. It means you must not imply that a basic spreadsheet workflow meets R2 Appendix B certification requirements.

## What a defensible certificate should record

At minimum:

- client/source;
- job/batch ID;
- asset ID;
- drive/media manufacturer/model/serial;
- media type and capacity;
- sanitisation class/outcome, e.g. Clear/Purge/Destroy;
- method/command;
- tool and version;
- start/end date/time;
- operator;
- result PASS/FAIL;
- validation/verification method;
- exception/failure reason;
- final route;
- certificate/report ID;
- immutable/raw evidence reference where possible.

A certificate is only as trustworthy as the underlying evidence.

## HDD versus SSD/NVMe/eMMC/mobile

### Magnetic HDD

A supported overwrite/verification method can be appropriate depending on the risk/customer standard. Modern practice does not gain meaningful security simply by doing 7 or 35 passes.

### SSD / NVMe

Do not assume a normal overwrite reaches every physical flash cell. Prefer supported device/firmware sanitise/secure-erase/block-erase/cryptographic methods appropriate to the media, then validate.

### eMMC / soldered flash

Device-specific. You may have no removable media and no universal low-level command path. Use manufacturer-supported sanitisation / cryptographic reset where appropriate, with account/management locks removed and recorded.

### Mobile devices

A factory reset is not automatically an enterprise sanitisation certificate.

For modern encrypted phones/tablets, a correctly executed manufacturer erase can be a strong sanitisation mechanism because it can destroy encryption keys, but the policy must verify:

- correct supported reset process;
- device completed the reset;
- activation lock / FRP removed;
- MDM/enterprise enrolment removed;
- no external/removable media remains;
- OS/vendor guidance is current;
- the customer’s required standard accepts the method.

R2’s rules are stricter: where automated sanitisation software exists, an R2 Appendix B facility is generally expected to use it rather than a purely manual factory reset.

## Physical destruction

Use destruction when:

- logical sanitisation fails;
- media is dead/inaccessible;
- customer contract mandates destruction;
- sensitivity/risk makes reuse unacceptable;
- device is not economically repairable and secure processing is required.

Do not destroy functioning assets by default if secure reuse is contractually acceptable; it sacrifices residual value and reuse benefit.

## Privacy and liability

OAIC says most businesses with turnover ≤A$3m are exempt from the Privacy Act, **but there are important exceptions**, including health service providers, businesses trading in personal information and Commonwealth contractors.

Even when the startup itself may fall outside the Privacy Act:

- the client may be regulated;
- the contract may impose privacy/security controls;
- health/school/government data can be extremely sensitive;
- negligence, confidentiality, breach-response and reputational consequences remain.

Treat every business device as data-bearing until proven otherwise.

Insurance questions should explicitly mention:

- custody of third-party data;
- cyber/privacy incidents;
- media loss/theft;
- professional/IT services;
- product/public liability;
- transport;
- stock/assets in custody.

## Can nwipe work commercially?

**Yes, for a bounded small-business lane, if the client accepts it and the process is stronger than “I clicked wipe”.**

Recommended small-commercial nwipe lane:

1. scan asset/media ID;
2. capture model/serial/capacity/SMART/HPA/DCO where applicable;
3. choose a media-appropriate method;
4. run current supported nwipe/ShredOS/vendor tool;
5. retain raw log/PDF;
6. record tool/version/method/operator/time;
7. independently verify/validate according to policy;
8. fail closed;
9. route failed/dead media to physical destruction/downstream;
10. issue certificate only from recorded evidence.

For medical, government, financial or enterprise customers, expect some to insist on Blancco or another approved platform/certification.

## What I should do next

Build two sanitisation service levels:

- **Phase 0 documented sanitisation:** current nwipe/vendor methods + AssetFlow evidence + PASS/FAIL + certificate.
- **Enterprise specified sanitisation:** commercial/approved tooling such as Blancco when contractually required.

Do not buy Blancco volume until a customer requirement or throughput justifies it.

## What I should ask an expert

- Data-security specialist: “For this media type and data sensitivity, what Clear/Purge/Destroy method and validation do you accept?”
- Insurer: “What cyber/privacy coverage applies while I hold unwiped third-party drives?”
- Prospective customer: “Do you specify NIST, ASD ISM, IEEE 2883, R2, Blancco or another standard/tool?”
- R2-certified operator: “What evidence do your auditors actually inspect per device?”

## Reading / listening

- NIST SP 800-88 Rev.2: https://csrc.nist.gov/pubs/sp/800/88/r2/final
- ASD ISM Guidelines for media: https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/ism/cyber-security-guidelines/guidelines-for-media
- nwipe: https://github.com/martijnvanbrummelen/nwipe
- SERI R2 Data Sanitization knowledge base: https://sustainableelectronics.org/knowledge-base/category/r2v3-process-req/appendixb/
- Sircel ITAD model: https://sircel.com/services/itad-asset-recovery-repurposing/

---

# 4. Refurbishment workflows

## Standard small-refurb pipeline

A practical flow is:

1. **Authority/intake** — source, ownership/authority, job/asset ID.
2. **Safety screen** — battery/physical/electrical red flags.
3. **Restricted data state** — no uncontrolled network use.
4. **Identify/spec** — manufacturer/model/serial/CPU/RAM/storage/locks.
5. **Sanitise / verify** — before normal reuse workflow.
6. **Hardware diagnostics** — memory, storage health, ports, display, battery, thermals.
7. **Route gate** — refurb / repair / donor / return / downstream.
8. **Repair/upgrade** — only if expected value justifies parts + labour + risk.
9. **OS/image/configure** — licensing-valid supported OS.
10. **Final QA** — repeat critical functional checks after repair/image.
11. **Cosmetic clean / grade**.
12. **Photograph / list / sell or deploy**.
13. **Warranty/returns / recall traceability**.
14. **Close record** with sale/reuse/downstream outcome.

The key small-scale rule is that **the asset record and physical device move together**. If digital state and shelf location disagree, stop and reconcile.

## Grading

There is no universal Australian A/B/C grading definition. Sellers use their own condition schemes.

A defensible system defines grades in measurable dimensions rather than labels alone:

- screen condition;
- housing damage;
- keyboard/touchpad;
- ports;
- battery health/cycle/condition;
- functional defects;
- included charger;
- cosmetic marks;
- repair history;
- warranty.

Example internal scheme:

- **A:** fully functional, light cosmetic wear, no material display/chassis damage.
- **B:** fully functional, visible wear/small dents/scratches that do not affect use.
- **C:** functional with significant cosmetic wear or clearly disclosed non-critical limitations.
- **Parts / not retail:** incomplete, unreliable, unsafe, locked or uneconomic.

Photograph defects and state the actual condition in the listing. A grade never replaces disclosure.

## Which Windows PCs are worth refurbishing in 2026?

Windows 10 standard support ended **14 October 2025**.

Windows 11 requires, among other things, TPM 2.0 and UEFI/Secure Boot capability and a supported processor.

Therefore the default 2026 business-refurb intake is:

- Windows-11-compatible business laptops/desktops;
- supported BIOS/firmware;
- no unresolved Autopilot/MDM/BIOS/activation lock;
- adequate battery/SSD/RAM economics;
- parts availability;
- enough resale value to cover labour/warranty.

“Intel 8th generation or newer” is a useful field heuristic, but Microsoft publishes the actual supported CPU list. Check the exact model. AMD eligibility is also model-specific.

### Older PCs

Possible routes:

- Linux for a clearly matched user/community purpose;
- retro/gaming/collector niche;
- donor parts;
- bulk/wholesale;
- responsible recycling.

Do not bypass Windows 11 requirements and sell an unsupported Windows install as if it were an ordinary supported Windows 11 PC.

## Windows licensing / MAR / TPR

Microsoft’s current Authorized Refurbisher page says MAR is aimed at the world’s largest refurbishers and that a proven Third Party Refurbisher (TPR) path is the normal route for smaller organisations.

Microsoft specifically says MARs can sub-distribute genuine refurbisher licences to TPRs and tells smaller refurbishers to contact a MAR in their region to learn about TPR.

Therefore:

- do not rely on obsolete blog posts describing the discontinued Registered Refurbisher Program;
- do not assume an old Windows sticker/digital activation is sufficient legal authority for every reimage/resale scenario;
- document the Windows entitlement on each machine;
- investigate an Australian MAR/TPR relationship before scaling Windows refurbishment.

## Board-level repair

The claim that microsoldering requires “$100,000” is misleading for entry-level equipment.

Australian retail examples found in this research put competent soldering/hot-air stations in the **hundreds of dollars**, not six figures.

The expensive part is a serious production capability:

- quality microscope;
- ESD bench;
- extraction/ventilation;
- preheater;
- board fixtures;
- test equipment;
- consumables;
- donor boards;
- BGA/rework equipment;
- training;
- diagnosis time;
- failed-repair/warranty risk;
- potentially X-ray inspection in advanced BGA work.

### Phase 0 rule

Do first:

- SSD/RAM;
- battery;
- keyboard;
- screen;
- fan;
- Wi-Fi;
- modular daughterboards;
- cleaning/paste where appropriate.

Defer systematic board-level repair until real repair-volume and margin data justify the skill investment.

## Gaming hardware

Gaming devices can have higher resale values but are not automatically better economics.

Watch for:

- GPU/VRAM failure;
- thermal abuse;
- liquid-metal/paste history;
- overclocking;
- power-supply quality;
- unsupported/modified firmware;
- missing proprietary chargers;
- cracked hinges/cases;
- expensive return freight.

A gaming laptop that needs two hours of fault-finding and a A$300 board is often worse business than three boring corporate Latitudes/EliteBooks/ThinkPads with predictable parts.

## What I should do next

Adopt an **economic repair gate**:

> repair only when expected sale/reuse value − parts − selling cost − warranty reserve − expected labour is clearly positive.

Track actual touch-time from the first batch. Do not let interesting repairs consume the side business.

## What I should ask an expert

- Australian MAR: “Can you onboard a tiny TPR, what licences can you supply, and what reporting/volume/security requirements apply?”
- Experienced refurbisher: “What failure/return rate makes you stop accepting a model?”
- Board-repair specialist: “Which recurring laptop faults genuinely pay at your labour rate?”

## Reading / listening

- Microsoft MAR resource centre: https://devicepartner.microsoft.com/en-US/communications/comm-resource-center-microsoft-authorized-refurbisher
- Windows 11 requirements: https://learn.microsoft.com/en-au/windows/whats-new/windows-11-requirements
- Windows supported processors: https://learn.microsoft.com/en-us/windows-hardware/design/minimum/supported/
- Windows 10 end of support: https://learn.microsoft.com/en-us/lifecycle/announcements/windows-10-end-of-support
- WorkVentures refurbishment/technical services: https://workventures.com.au/

---

# 5. Operations and systems

## Intake “bucketing”

The best small-operator bucketing system is based on **next action**, not vague piles.

Recommended states:

1. **INTAKE / UNASSESSED**
2. **UNWIPED — RESTRICTED**
3. **PROCESSING BENCH**
4. **REPAIR / WIP**
5. **CLEARED QA**
6. **READY FOR SALE / REUSE**
7. **PARTS / DONOR**
8. **RETURN / DOWNSTREAM / OUTBOUND**
9. **SAFETY EXCEPTION** — stop-work, not ordinary inventory.

Each physical position needs a cap. Full zone = stop intake.

## Minimal chain of custody

A one-person shed does not need a bank vault, but it needs a reproducible trail:

- source / customer;
- authority / transfer basis;
- date/time;
- job/batch/lot;
- unique asset ID + serial;
- physical location;
- data state;
- operator/action/time;
- sanitisation result/evidence;
- repair/grade;
- disposition;
- recipient/downstream;
- certificate/report.

For data-bearing devices, the restricted state starts at custody, not when wiping begins.

## QR/barcode tracking

### Spreadsheet/Airtable

Pros:
- quick;
- cheap;
- easy prototype.

Cons:
- accidental edits;
- poor event history;
- permissions/attachments can become messy;
- no automatic integrity between physical location, asset status, sanitisation and downstream.

### Generic asset systems

Snipe-IT:
- self-hosted open source;
- hosted plans publicly advertised in US dollars;
- good generic asset assignment/inventory;
- not an ITAD disposition/workflow system by default.

AssetTiger/Airtable/other SaaS:
- can provide quick labels/fields;
- pricing and plan limits change;
- require custom ITAD workflow design.

### Purpose-built ITAD ERP

Useful later for:

- high-volume intake;
- automated serial discovery;
- sanitisation platform integration;
- value recovery;
- settlement/revenue share;
- downstream/material reporting;
- multi-site custody;
- customer portal.

At Phase 0, buying a A$300+/month platform before real throughput exists is backwards.

The existing **AssetFlow** application already implements the core value:

- jobs/lots/assets;
- QR labels;
- locations;
- evidence;
- sanitisation/diagnostics;
- repairs/parts;
- resale/recycling;
- certificates;
- reporting;
- permissions and audit events.

The next software improvements should come from real pilot friction, not feature shopping.

## Double handling

Bad small-scale workflow:

> unload → write paper → put in pile → later type spreadsheet → later move → later create wipe record → later relabel

Better:

> scan/create at handoff → label immediately → assign physical location → every state change creates the next required action/evidence.

One touch should produce both the physical move and the digital event.

## One-person shed layout

Use one-way dirty-to-clean flow:

> Handoff → Intake → Restricted unwiped → Processing → Repair/WIP → Cleared QA → Ready for sale

with side exits to Parts/Donor and Outbound.

The current actual shed plan should stay at a **six serialized-device starting cap** until the operator demonstrates clean flow and turnover.

## What I should do next

Do not buy another ITAD platform.

Run three synthetic AssetFlow drills:

1. clean resale candidate;
2. locked/wipe-failure device;
3. uneconomic device routed to parts/downstream.

Time every click and every physical touch. Remove duplicate entry before adding features.

## What I should ask an expert

- ITAD floor manager: “Which fields are actually scanned automatically versus manually typed?”
- Auditor: “Which custody events are most often missing when you audit a small operator?”
- Software vendor: “Can I export my full asset/certificate/evidence dataset if I leave?”

## Reading / listening

- WorkVentures decommissioning workflow: https://workventures.com.au/decommissioning/
- SERI sanitisation/records guidance: https://sustainableelectronics.org/knowledge-base/
- Snipe-IT: https://snipeitapp.com/
- Repo: [BENCH-SOP-AND-LAYOUT.md](BENCH-SOP-AND-LAYOUT.md)
- Repo: [SHED-ZONE-PLAN.md](SHED-ZONE-PLAN.md)

---

# 6. Markets and pricing

## Australian resale channels

### eBay Australia

Strengths:
- national demand;
- good for business laptops, Macs, phones, components and niche models;
- structured order/tracking;
- useful sold-item research.

Risks:
- returns/disputes;
- postage;
- packaging damage;
- listing labour;
- seller-policy changes.

eBay Australia’s current fee structure depends on account/seller type and eligibility. Do not hard-code old “13%” or “8%” advice into unit economics without checking the live account terms.

### Facebook Marketplace

Good for:
- local lower-value laptops/desktops;
- bulky desktops/monitors;
- no shipping.

Costs:
- messages/no-shows;
- scam risk;
- cash/payment handling;
- safety of pickup;
- weaker standardised evidence.

Use public/neutral handoff locations where practical; do not invite retail customers into the working shed.

### Direct B2B

Potentially the best long-term channel for repeated tested devices because it reduces listing labour.

Requires:
- consistent specification/grade;
- warranty/remedy process;
- invoices;
- stock availability;
- support boundaries.

### Schools / charities / community

Can be strong for social reuse but is not an excuse to dump unsupported stock on recipients.

Match:
- supported OS;
- battery condition;
- charger;
- Wi-Fi/camera;
- use case;
- expected support;
- ownership;
- warranty/remedy;
- privacy/account setup.

For public schools/government, procurement rules may control who can supply.

## Realistic margins

Published “ITAD margin per laptop” data is poor. Most operators do not publish acquisition cost, failure rate, labour and realised sale price.

Therefore this report uses a **SCENARIO, not an industry benchmark**.

### Example A — free-source business laptop

Sale price: A$300  
Parts/cleaning/packaging: A$70  
Wipe/licence/certificate cost: A$0–25  
Warranty/return reserve: A$20  
Contribution before labour: about **A$185–210**

At 1.5 hours direct touch-time valued internally at A$40/hour:

Contribution after direct labour: about **A$125–150**.

At A$1,000/month target contribution, that suggests around **7–10 good comparable units per month**.

This is deliberately illustrative. Real Dubbo data must replace it.

### Example B — pay A$100 for the same unknown unit

The same economics fall to about **A$25–50 after direct labour**.

That is why “don’t pay up front” is sensible for the pilot.

## Parts lots / aged stock

Bulk parts lots can be useful when:

- labour to test/list individually exceeds likely value;
- platform shipping simplifies the lot;
- data-bearing media is removed/sanitised;
- condition is accurately described.

Aging stock is a cost. Set a review date and exit rule.

Example:
- day 0 normal price;
- day 30 review;
- day 60 reduce/bundle;
- day 90 wholesale/parts/community/downstream unless there is a documented reason to hold.

## Scrap commodities

Public NSW/Sydney scrap-price guides during this research show why grade separation matters, but local Dubbo prices must be quoted live.

Principles:

- weigh your own batch;
- separate ferrous, aluminium, copper/brass and board grades where your downstream wants it;
- obtain two quotes;
- ask about contamination/deductions;
- document who receives e-waste/boards;
- compare whole-device/parts value before scrapping.

For almost any viable laptop, whole-device reuse or parts harvesting should beat commodity scrap value.

## NSW downstream

Potential categories/partners include:

- Sircel and other certified electronics recyclers;
- ANZRP/TechCollect ecosystem for covered e-waste;
- local metal/e-waste receivers where the exact accepted stream and downstream route are confirmed;
- specialist battery routes.

A website saying “we take e-waste” is not enough for the business evidence pack. Obtain written confirmation for:

- exact item class;
- embedded/removable batteries;
- loose/damaged batteries;
- commercial loads;
- fees;
- certificates/weights;
- data-bearing residuals;
- downstream facility/standard where relevant.

## What I should do next

Build a **real 10-device economics dataset** before making margin claims.

For every unit track:

- acquisition/collection cost;
- test time;
- wipe time;
- repair time;
- parts;
- platform/payment fee;
- packaging/postage;
- sale price;
- warranty/return;
- stock days;
- residual value.

## What I should ask an expert

- Reseller: “What is your actual 90-day sell-through and return rate for business laptops?”
- Recycler: “What are today’s rates/fees for sorted laptops, boards, cables, steel and batteries, and what deductions apply?”
- Accountant: “How should I record acquired-for-free inventory, parts harvested, GST and stock on hand?”

## Reading / listening

- eBay Australia seller fees: https://www.ebay.com.au/help/selling/fees-credits-invoices/fees-private-sellers?id=4822
- WorkVentures refurbished store/catalogue for asking-price context
- Repo unit economics: [RESEARCH-13-FINANCE-TIME-UNIT-ECONOMICS.md](RESEARCH-13-FINANCE-TIME-UNIT-ECONOMICS.md)
- Repo resale research: [RESEARCH-04-RESALE-PRICING-CHANNELS-RETURNS.md](RESEARCH-04-RESALE-PRICING-CHANNELS-RETURNS.md)

---

# 7. Regulation and compliance — NSW / Australia

## NSW EPA licensing thresholds

NSW EPA publishes high volume thresholds for resource recovery, non-thermal treatment and waste storage.

For regulated areas, the published thresholds include:

- 1,000 tonnes or 1,000 m³ onsite;
- more than 6,000 tonnes/year processing/storage thresholds depending activity.

Outside the regulated area, larger thresholds apply.

A six-device home pilot is nowhere near those numbers.

**But:** “below EPL threshold” does not equal “all approvals satisfied”. Planning, waste classification, pollution, WHS, fire, electrical, tenancy, insurance and product-safety obligations remain separate.

## Home business / Council

NSW Planning says a home business can sometimes be exempt development and can operate from a detached garage/studio if standards are met.

Dubbo Council says the LEP classifies activities as permitted without consent, with consent, or prohibited depending on the zone/activity.

Open question that must be answered by Council for this exact site:

> Is pre-arranged receiving, temporary storage, testing, refurbishment, resale and downstream routing of retired electronics from a residential shed classified as a home business/home industry, or as another use because some received equipment may legally be “waste”?

Do not solve that question by renaming the activity.

## NTCRS

The National Television and Computer Recycling Scheme is an industry-funded co-regulatory scheme.

The liable-party thresholds apply to corporations that **import/manufacture** more than:

- 5,000 televisions;
- 5,000 computers or printers;
- 15,000 computer parts/peripherals;

in the prior financial year.

A tiny refurbisher handling locally acquired used equipment is not automatically a liable party merely because it recovers/recycles old computers.

If later participating as an NTCRS collection/recycling partner, scheme-specific standards, contracts and reporting apply.

## Batteries / dangerous goods

SafeWork NSW identifies lithium-ion risks including fire/explosion/thermal runaway and requires risk management.

Phase 0 should refuse:

- swollen/hot/leaking/punctured/crushed/wet/fire-affected lithium devices;
- loose damaged lithium batteries;
- e-bike/e-scooter packs;
- solar/large UPS/industrial battery packs.

Do not improvise long-term damaged-battery storage.

Normal healthy devices still require:

- attended charging policy;
- correct chargers;
- clear exits;
- separation from combustibles;
- incident/emergency plan;
- current transport/carrier checks.

## CRTs, mercury and hazardous material

Do not dismantle CRTs in Phase 0.

Printers/lamps/older display gear can add toner, mercury-containing lamps, capacitors and other material-management complexity. Narrowing intake to laptops/desktops/mobile devices and selected monitors avoids unnecessary streams.

## WHS

If operating a business, WHS duties apply to the work and anyone exposed to it.

Controls include:

- safe workplace/access;
- electrical risk management;
- battery hazards;
- manual handling;
- slips/trips;
- chemicals/SDS;
- solder/flux fumes if introduced;
- training/competency;
- emergency procedures.

Family/shared premises makes separation more important, not less.

## Electrical

Do not assume computer repair permits mains electrical work.

Phase 0 boundary:

- low-voltage/module-level computer work;
- no fixed wiring;
- no mains PSU repair;
- no unsafe chargers;
- no improvised power-board chains;
- competent-person / licensed-electrician advice for the actual shed power arrangement.

## Insurance

Home/contents insurance may not cover business activity.

Ask explicitly about:

- home business;
- customer/client property in custody;
- stock;
- fire/lithium;
- product liability;
- public liability;
- professional/cyber/privacy liability;
- goods in transit;
- theft;
- customer visits;
- resale of refurbished electrical goods.

## Business structure

A sole trader is simple and may be suitable initially, but structure does not remove personal liability.

Discuss with an accountant/lawyer when:

- turnover/stock/client risk rises;
- employees/volunteers are used;
- enterprise contracts require a company;
- a partner/JV is proposed;
- significant product/privacy liabilities are being accepted.

## Second-hand resale / Fair Trading

The repo already identifies NSW second-hand/resale questions as an external gate. Confirm the current licensing/record obligations for the exact device categories and acquisition model before trading at scale.

## Certifications

### AS 5377:2022

Current Australian standard for management of electronic equipment for reuse/recycling. Relevant to the industry even where certification is not mandatory for the small pilot.

### R2v3

Voluntary international certification. Not a Phase 0 prerequisite. Valuable later for enterprise/data-security credibility or as a partner qualification.

### e-Stewards

Primarily a North American voluntary certification/market signal. It is not a NSW legal requirement and is lower priority than Australian planning, insurance, downstream and AS 5377 alignment.

## What I should do next

Close six written gates before the first external batch:

1. Dubbo Council land-use/planning classification.
2. insurer acceptance of exact activities.
3. Fair Trading / second-hand resale obligations.
4. employer side-business conflict approval/boundaries.
5. battery/electrical/shed controls.
6. downstream written acceptance for residuals.

## What I should ask an expert

Use exact activity descriptions, volumes and site conditions. Do not ask vague “Can I run an e-waste business?” questions.

Ask:
- “six to twelve laptops/desktops at a time”;
- “appointment-only”;
- “no public bin/drop-off”;
- “no shredding/mechanical processing”;
- “test/repair/sanitise/resell”;
- “residuals sent to approved downstream partner”.

## Reading / listening

- NSW Planning home enterprises: https://www.planningportal.nsw.gov.au/development-and-assessment/planning-approval-pathways/exempt-development/home-based-enterprises
- Dubbo Council application types: https://www.dubbo.nsw.gov.au/Builders-Developers/Overview-of-Application-Process/types-of-das
- NSW EPA licensing thresholds: https://www.epa.nsw.gov.au/Your-environment/Waste/waste-overview/licensing/reduced-licensing-thresholds
- DCCEEW NTCRS: https://www.dcceew.gov.au/environment/protection/waste/product-stewardship/television-computer-recycling-scheme
- SafeWork NSW lithium-ion batteries: https://www.safework.nsw.gov.au/hazards-a-z/lithium-ion-batteries
- AS 5377:2022 — Standards Australia / authorised reseller listing
- ANZRP compliance: https://www.anzrp.com.au/about/compliance/

---

# 8. Business models and partnerships

## “Fly the flag” / regional affiliate models

There is no reliable universal “ITAD affiliate percentage”. Do not accept invented 50/50 or 70/30 norms as evidence.

Real structures can include:

### Referral

You introduce a client; the national operator contracts directly. You receive a referral fee if agreed.

**Low risk / low control / low margin.**

### Regional collection subcontractor

You collect, manifest, palletise or stage equipment under the principal’s procedures.

**Good regional entry model** if insurance, custody, security and transport responsibilities are written.

### Local depot / agent

You hold stock temporarily and may perform triage/basic work before linehaul.

**Higher site/security/regulatory burden.**

### White-label field service

You perform decommissioning, device audits, collection or onsite work under another operator’s brand.

**Strong fit with IT support skills.**

### Resale/refurb partner

Principal sends reuse-qualified assets or you buy/revenue-share stock after sanitisation.

Requires:
- grading rules;
- pricing;
- warranty ownership;
- return rules;
- licensing;
- customer ownership/non-circumvention.

### Joint venture / franchise / brand licence

Highest commitment. Requires legal documentation, brand/IP rules and exit mechanics.

Not the first step for an unproven six-device shed.

## Written partnership protections

At minimum define:

- legal entities;
- services/scope;
- territory;
- lead ownership;
- customer ownership;
- non-solicitation/confidentiality;
- who owns assets and when title transfers;
- who is data controller/custodian at each stage;
- sanitisation standard;
- certificates;
- insurance;
- transport risk;
- losses/theft;
- residual downstream cost;
- pricing/revenue share;
- invoice/settlement timing;
- brand/IP use;
- audit rights;
- complaint/warranty ownership;
- termination;
- inventory on exit;
- unpaid receivables on exit.

For data-bearing client assets, a handshake is not enough.

## Competitive dynamics

Quality retired business equipment is finite.

Small operators protect supply by being useful rather than merely paying the most:

- show up reliably;
- collect quickly;
- provide serial reconciliation;
- communicate outcome;
- erase data professionally;
- give certificates;
- take only agreed scope;
- do not cherry-pick then leave the customer with surprises;
- pay/revenue-share only where economics support it.

Relationships beat a one-time high bid when the source wants disposal pain removed.

## Social-enterprise / DadLAN-style community reuse

Keep commercial and social outcomes legible.

Recommended model:

**Commercial lane**
- business source;
- ITAD/recovery contract;
- sanitise/test;
- remarket;
- residual downstream;
- commercial records.

**Social-reuse lane**
- device meets support/quality standard;
- named charity/community partner;
- written transfer;
- data and account reset;
- recipient/support boundaries;
- impact recorded.

Do not imply DubboEwaste is itself a charity unless it becomes one. Do not promise donated devices as a destination before a recipient program accepts them.

## Preventing side-business scope creep

Hard controls:

- two operating days/week;
- six-device initial site cap;
- no public drop-off;
- category whitelist;
- no dangerous batteries;
- one active repair per bench position;
- ageing/WIP limits;
- no purchase of mixed junk lots;
- no new device class without a downstream route;
- no board-level repair because it looks interesting;
- pause intake when any zone is full.

## What I should do next

Ask potential national/regional partners for **one specific pilot structure**, not a vague partnership.

Example:

> “Could I act as a Dubbo field/collection subcontractor for a 20–50 device business job under your chain-of-custody and downstream process, with responsibilities and payment agreed in writing?”

## What I should ask an expert

- “Who owns the client relationship?”
- “Who carries data liability while equipment is with me?”
- “Who pays if residuals are negative value?”
- “What happens if a device is missing?”
- “What margin/fee belongs to collection, wiping, resale and recycling?”
- “Can I use your brand? What claims/certifications may I make?”
- “What happens to stock and clients when the arrangement ends?”

## Reading / listening

- Sircel ITAD model
- WorkVentures decommissioning
- PonyUp data security / asset registers
- ANZRP partner compliance
- Repo: [DUBBO-ITAD-BRANCH-ENTRY-PLAYBOOK.md](DUBBO-ITAD-BRANCH-ENTRY-PLAYBOOK.md)
- Repo: [EXISTING-AUSTRALIAN-EWASTE-ORGS-DUBBO-EXPANSION.md](EXISTING-AUSTRALIAN-EWASTE-ORGS-DUBBO-EXPANSION.md)

---

# 9. 90-day learning and pilot plan

## Days 1–30 — close the legal/operating boundary

### Learn

Read in this order:

1. NIST SP 800-88 Rev.2.
2. ASD ISM Guidelines for media.
3. NSW Planning home-business material + Dubbo LEP/application guidance.
4. SafeWork NSW lithium/electrical guidance.
5. AS 5377:2022 scope/requirements.
6. SERI R2v3 data-sanitisation guidance.
7. WorkVentures/Sircel/PonyUp/Reconnect process pages.
8. Microsoft Windows 11 + MAR/TPR material.

### Build

- finish the back-left ITAD work cell;
- lockable unwiped cabinet;
- dirty-to-clean workflow;
- AssetFlow locations;
- six-device cap;
- no public intake;
- synthetic data only.

### Close externally

Obtain written/recorded answers from:

- Dubbo Council;
- insurer/broker;
- NSW Fair Trading / relevant adviser;
- employer;
- downstream receiver;
- electrician/competent person for shed power controls.

### Test

Run at least five synthetic/owned-device workflows through:

> intake → authority → restricted → sanitise → diagnose → repair/grade → QA → sale/reuse/downstream → close.

## Days 31–60 — learn economics on real but controlled stock

Use 5–10 devices that you own or have indisputable transfer authority for.

Measure:

- sanitisation success/failure;
- touch time;
- repair rate;
- parts spend;
- Windows 11 eligibility;
- realised sale/exit price;
- stock days;
- return/failure;
- downstream cost.

Do not count donated/free stock as “100% margin”. Labour, warranty, transport and unsold inventory are real costs.

### Interview five operators

1. large national ITAD;
2. social-enterprise refurbisher;
3. regional e-waste/recycler;
4. independent refurb/reseller;
5. data-sanitisation specialist/R2 operator.

Approach:

> “I’m validating a tiny regional reuse-first pilot and want to understand where I should *not* reinvent mature processes. I’m not asking for customer lists or confidential prices. Could I ask 10 operational questions about intake, data, grading, residuals and what beginners get wrong?”

### Ten questions

1. What do you refuse at the door?
2. What makes a lot financially attractive?
3. What percentage is reuse / parts / recycle?
4. What is your most common sanitisation failure?
5. What records do customers actually ask for?
6. Which hardware ages/models stop paying?
7. What is the biggest hidden cost?
8. What causes returns/warranty losses?
9. How do you price negative-value residuals?
10. What would you change if starting again at 10 devices/month?

## Days 61–90 — one bounded external pilot

Only if the external gates are closed:

- one business/source;
- 5–10 devices;
- appointment/pre-arranged;
- signed transfer/authority;
- asset manifest;
- no unsafe battery lane;
- serial/QR intake;
- sanitisation + verification;
- grade/test;
- resale/reuse route;
- downstream residuals;
- customer outcome report;
- retrospective.

### Stop / do not scale if

- stock exceeds cap;
- unwiped devices cannot be locked;
- wipe failures linger without route;
- Council/insurance answer is unclear;
- the employer conflict is unresolved;
- devices are worth less than processing labour;
- returns consume the margin;
- household/workshop separation breaks down.

## Common beginner mistakes

- accepting everything;
- confusing free inventory with free processing;
- paying for unknown lots;
- keeping “maybe useful” parts forever;
- wiping before ownership is clear;
- treating a factory reset as universal sanitisation;
- keeping old Windows PCs because “someone might want them”;
- using retail asking prices instead of sold/realised prices;
- ignoring return/warranty reserve;
- mixing unwiped and sale-ready stock;
- letting physical location drift from digital status;
- promising charity impact before a recipient exists;
- assuming a public-school principal owns the disposal decision;
- copying enterprise certifications/claims without actually holding them;
- turning a two-day side business into a warehouse.

---

# Consolidated reading / listening list

## Tier 1 — read first: standards, regulators, official Australian guidance

1. **NIST SP 800-88 Rev.2 — Guidelines for Media Sanitization**  
   https://csrc.nist.gov/pubs/sp/800/88/r2/final

2. **Australian Signals Directorate — Guidelines for media (ISM)**  
   https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/ism/cyber-security-guidelines/guidelines-for-media

3. **NSW Planning Portal — Home-based enterprises**  
   https://www.planningportal.nsw.gov.au/development-and-assessment/planning-approval-pathways/exempt-development/home-based-enterprises

4. **Dubbo Regional Council — Application Types / LEP**  
   https://www.dubbo.nsw.gov.au/Builders-Developers/Overview-of-Application-Process/types-of-das

5. **NSW EPA — waste activity licensing thresholds**  
   https://www.epa.nsw.gov.au/Your-environment/Waste/waste-overview/licensing/reduced-licensing-thresholds

6. **SafeWork NSW — lithium-ion batteries**  
   https://www.safework.nsw.gov.au/hazards-a-z/lithium-ion-batteries

7. **DCCEEW — National Television and Computer Recycling Scheme**  
   https://www.dcceew.gov.au/environment/protection/waste/product-stewardship/television-computer-recycling-scheme

8. **OAIC — Small business and the Privacy Act**  
   https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business

9. **AS 5377:2022 — Management of electrical and electronic equipment for re-use or recycling**  
   Purchase/view through Standards Australia / authorised standards provider.

10. **Microsoft MAR/TPR**  
    https://devicepartner.microsoft.com/en-US/communications/comm-resource-center-microsoft-authorized-refurbisher

## Tier 2 — operator process pages

1. WorkVentures decommissioning — https://workventures.com.au/decommissioning/
2. WorkVentures e-waste — https://workventures.com.au/e-waste/
3. Sircel ITAD — https://sircel.com/services/itad-asset-recovery-repurposing/
4. PonyUp data security — https://www.ponyupforgood.com/partners-data-security
5. The Reconnect Project — https://thereconnectproject.com.au/donate/
6. ANZRP compliance — https://www.anzrp.com.au/about/compliance/
7. nwipe — https://github.com/martijnvanbrummelen/nwipe

## Tier 3 — podcasts / videos

Use these for operator context, not as legal authority.

- **ABC Nightlife — “Tackling e-waste”** (Australia, 2026): useful broad Australian context.
- **UNSW / Renew IT — IT Upgrade: the future of recycling office e-waste**: Australian enterprise/reuse perspective.
- **All Things Circular — Renew IT episode**: Australian refurb/reuse operator perspective.
- **All Things Circular — Foxway / ITAD episode**: international enterprise circular-IT comparison.
- **SERI “Inside e” media**: data sanitisation, test/repair and R2 process explanations.
- **Iron Mountain ITAD facility tours**: useful for seeing chain-of-custody and industrial workflow; US/global context, not NSW legal guidance.
- **WorkVentures / Reconnect / circular-economy interviews**: useful for social-enterprise and digital-inclusion context.

## Tier 4 — repo study material

- [REGIONAL-ITAD-PRACTITIONER-FIELD-GUIDE.md](REGIONAL-ITAD-PRACTITIONER-FIELD-GUIDE.md)
- [RESEARCH-03-COMPETITOR-OPERATING-MECHANICS.md](RESEARCH-03-COMPETITOR-OPERATING-MECHANICS.md)
- [RESEARCH-05-DATA-IDENTITY-PRIVACY-SOP.md](RESEARCH-05-DATA-IDENTITY-PRIVACY-SOP.md)
- [RESEARCH-06-BATTERY-ELECTRICAL-WORKSHOP-SAFETY.md](RESEARCH-06-BATTERY-ELECTRICAL-WORKSHOP-SAFETY.md)
- [RESEARCH-12-PREMISES-PHYSICAL-FLOW-CAPACITY.md](RESEARCH-12-PREMISES-PHYSICAL-FLOW-CAPACITY.md)
- [PHASE-0-OPERATING-BLUEPRINT.md](PHASE-0-OPERATING-BLUEPRINT.md)
- [DUBBO-ITAD-BRANCH-ENTRY-PLAYBOOK.md](DUBBO-ITAD-BRANCH-ENTRY-PLAYBOOK.md)

---

# Risks and unknowns

## External blockers

1. **Exact Council classification of the home-shed activity** — unresolved until Dubbo Council assesses the actual proposal/site.
2. **Insurance acceptance** — home insurance should not be assumed to cover business stock, customer property, cyber/data, lithium risk or refurbished-product liability.
3. **Second-hand/resale licensing/record requirements** — needs authoritative NSW confirmation for the actual acquisition/resale model.
4. **Employer conflict boundary** — must be explicit before pursuing any source or customer connected to employment.
5. **Downstream acceptance** — exact residual/battery/e-waste classes, commercial fees and certificates must be confirmed in writing.
6. **Electrical/workshop adequacy** — photographs are not electrical or structural approval.
7. **Privacy applicability** — small-business exemption can be complex; contract/customer duties can exceed the statute.
8. **Microsoft refurbisher licensing path** — identify an Australian MAR willing to support TPR and document device licensing.
9. **Real local sell-through and return rate** — no public source can substitute for the pilot dataset.
10. **Real acquisition quality** — business source mix determines economics more than scrap price.

## Claims not to make

Do not advertise:

- “Council approved” until it is;
- “NIST certified” sanitisation;
- “R2 certified” unless certified;
- “AS 5377 certified” unless certified;
- “Blancco certified” when using nwipe;
- “government approved” because you read ASD guidance;
- “100% secure” without defensible scope/evidence;
- “zero landfill” without auditable downstream evidence;
- “charitable donation” / tax deduction unless through the appropriate charity/DGR structure;
- guaranteed residual value before grading.

---

# One-page decision guide

## Decision: START SMALL, CHANGE THE SCOPE AWAY FROM GENERAL E-WASTE, AND WAIT ON EXTERNAL CUSTOMER INTAKE UNTIL GATES CLOSE

### Start now

You can safely keep doing:

- research;
- operator interviews;
- AssetFlow development;
- shed setup;
- synthetic workflows;
- owned-device refurbishment;
- sanitisation lab/testing;
- reseller-market research;
- downstream quote gathering;
- MAR/TPR enquiries;
- non-conflicted prospect discovery.

### Do not start yet

Do not yet:

- advertise general public drop-off;
- put an e-waste bin outside;
- accept unknown household piles;
- hold damaged lithium;
- accept health/school/government data on informal terms;
- promise enterprise-grade sanitisation without the required tool/evidence;
- pay up front for unknown device lots;
- expand beyond the six-device initial site cap;
- imply Council/insurance/licence approval.

### Best Phase 0 business definition

> **A small regional IT asset recovery and refurbishment service for pre-approved laptops, desktops and mobile devices. Assets are collected by arrangement, individually tracked, securely sanitised, tested and reused where viable. Equipment that cannot be responsibly reused is routed to an approved downstream recycler. No public drop-off.**

### First commercial target

A **5–10 device batch from one small independent Dubbo business**, unrelated to the operator’s employment, where:

- title/authority is written;
- device list is known;
- batteries appear healthy;
- no unusual regulated stream is present;
- customer accepts the documented sanitisation method;
- downstream route is already confirmed.

### Success criteria before increasing volume

- zero custody mismatches;
- 100% data-bearing devices have PASS/Destroy outcome;
- no device sits in intake/unwiped beyond the defined limit;
- actual margin is positive after labour and warranty reserve;
- no household/workshop conflict;
- no unsafe battery event;
- customer accepts the report/certificate;
- residual material leaves promptly;
- operator wants to do another batch.

If those conditions are not met, **do not solve the problem by adding more volume**.

---

# Source register — key sources checked 5 October 2026

## Government / regulator / standards

- NSW Planning Portal — Home-based enterprises:  
  https://www.planningportal.nsw.gov.au/development-and-assessment/planning-approval-pathways/exempt-development/home-based-enterprises
- Dubbo Regional Council — Application types:  
  https://www.dubbo.nsw.gov.au/Builders-Developers/Overview-of-Application-Process/types-of-das
- Dubbo Regional Council — LEP 2022:  
  https://www.dubbo.nsw.gov.au/Builders-Developers/Planning-Controls-Tools-and-Resources/Dubbo-Regional-Local-Environmental-Plan-2022
- NSW EPA — Reduced licensing thresholds for waste activities:  
  https://www.epa.nsw.gov.au/Your-environment/Waste/waste-overview/licensing/reduced-licensing-thresholds
- DCCEEW — NTCRS roles and responsibilities / liable parties:  
  https://www.dcceew.gov.au/environment/protection/waste/product-stewardship/products-schemes/television-computer-recycling-scheme
- NSW Department of Education — Technology in schools procedures:  
  https://education.nsw.gov.au/policy-library/policies/pd-2024-0481-01
- NSW Government — Contract 9826:  
  https://www.info.buy.nsw.gov.au/contracts/ict-end-user-devices-and-services
- OAIC — Small business:  
  https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business
- SafeWork NSW — Lithium-ion batteries:  
  https://www.safework.nsw.gov.au/hazards-a-z/lithium-ion-batteries
- NIST SP 800-88 Rev.2:  
  https://csrc.nist.gov/pubs/sp/800/88/r2/final
- ASD ISM — Guidelines for media:  
  https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/ism/cyber-security-guidelines/guidelines-for-media
- AS 5377:2022 — Standards Australia, current standard, superseding AS/NZS 5377:2013.
- SERI R2v3 Appendix B and Formal Interpretation:  
  https://sustainableelectronics.org/knowledge-base/r2v3-formal-interpretation-1-0-data-sanitization-software/
- ACCC — Commercial recycler makes clear it is not a charity:  
  https://www.accc.gov.au/media-release/commercial-recycler-makes-clear-it-is-not-a-charity
- Microsoft Authorized Refurbisher resource centre:  
  https://devicepartner.microsoft.com/en-US/communications/comm-resource-center-microsoft-authorized-refurbisher
- Microsoft Windows 11 requirements:  
  https://learn.microsoft.com/en-au/windows/whats-new/windows-11-requirements
- Microsoft Windows 10 end of support:  
  https://learn.microsoft.com/en-us/lifecycle/announcements/windows-10-end-of-support

## Australian operators / industry

- WorkVentures — Decommissioning: https://workventures.com.au/decommissioning/
- WorkVentures — E-waste: https://workventures.com.au/e-waste/
- Sircel — ITAD Asset Recovery & Repurposing: https://sircel.com/services/itad-asset-recovery-repurposing/
- PonyUp — Data Security: https://www.ponyupforgood.com/partners-data-security
- The Reconnect Project — Donate/process: https://thereconnectproject.com.au/donate/
- ANZRP — Compliance: https://www.anzrp.com.au/about/compliance/
- nwipe project: https://github.com/martijnvanbrummelen/nwipe
- Tech2000 public Blancco reseller listings: https://shop.tech2000.com.au/brand/blancco/

---

# Final recommendation

The evidence supports a **narrow, low-volume, professional ITAD/refurbishment pilot in Dubbo**, provided it remains pre-arranged and reuse-first.

The evidence does **not** support launching a public shed-based e-waste depot now.

The decisive competitive advantage is not scrap processing. It is:

> **regional convenience + trustworthy custody + documented sanitisation + competent refurbishment + honest routing + fast reporting.**

That is a business small enough to test from the current shed, while retaining clear stop rules before it becomes an uncontrolled waste/storage operation.
