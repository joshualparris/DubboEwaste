# Backlog 21–25: consumer law, device viability, data, WHS and transport

**Researched:** 2 October 2026  
**Scope:** online-research backlog items 21–25 only.  
**Status:** source-led operating guidance for a small NSW electronics reuse/refurbishment pilot. It is not a substitute for legal, electrical or WHS advice where licensed work is required.

---

# 21. Consumer law and product safety

## Consumer guarantees apply to second-hand goods sold by a business

Second-hand goods sold in trade or commerce remain covered by Australian Consumer Law consumer guarantees.

Age, price, disclosed condition and reasonable expectations matter, but a business cannot remove the guarantees with wording such as:

- "no refunds";
- "sold as-is";
- "no warranty expressed or implied".

NSW guidance expressly says consumer-guarantee rights have **no fixed expiry date** and may continue beyond a business's voluntary written warranty.

Source:
- https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/repairs-replacements-and-refunds/rights-to-a-repair

### Phase 0 policy

A listing can disclose that an item is second-hand, cosmetically worn or has a particular known defect.

It should **not** imply that statutory rights disappear.

Use wording such as:

> Second-hand/refurbished item. Known condition and defects are described above. Australian Consumer Law rights apply.

A separate **change-of-mind** policy can be more restrictive.

## Major versus minor failures

Under ACL:

- a minor problem can generally be remedied by the business, commonly by repair;
- where there is a major problem, the consumer has stronger remedy choices including refund/replacement, subject to the ACL rules.

Do not attempt to encode a universal "7-day warranty" as the complete consumer remedy.

### Bendigo benchmark warning

Bendigo E-Waste's public policies have used very short DOA/as-is language. That is **not** a safe template to copy for an NSW consumer-facing resale business.

The Dubbo project should build its own ACL-compatible policy.

## Receipts

For a robust Phase 0 process, issue a receipt/invoice for **every sale**, even where the statutory minimum would not force one.

Keep:

- legal/business seller name;
- ABN where applicable;
- date;
- description;
- serial/asset ID;
- amount;
- GST treatment where applicable;
- condition/known defects reference.

## Critical repair-notice requirement

If Dubbo E-Waste ever accepts **customer-owned devices for repair**, repair notices become important.

ACCC says a written repair notice must be provided **before accepting** a product for repair when:

- the product can store user-generated data; or
- refurbished parts may be used; or
- the repairer's practice may be to replace goods with refurbished goods.

For user-data devices, the notice must warn that repair may result in loss of user data.

If refurbished goods/parts may be used, the notice must include this exact prescribed wording:

> Goods presented for repair may be replaced by refurbished goods of the same type rather than being repaired. Refurbished parts may be used to repair the goods.

Source:
- https://www.accc.gov.au/consumers/problem-with-a-product-or-service-you-bought/repair-notices
- https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/repairs-replacements-and-refunds/rights-to-a-repair

A template has been added to templates/repair-notice.md.

## Uncollected repair goods

NSW's Uncollected Goods Act process matters if repair work is added.

Current NSW guidance:

| Estimated value | Notice | Minimum notice period | Disposal |
|---|---|---:|---|
| rubbish/perishable | none | none | appropriate manner |
| personal documents | written | 28 days | return to author or securely destroy |
| other goods < $1,000 | verbal or written | 14 days | appropriate manner |
| $1,000–$20,000 | written | 28 days | public auction or fair-value private sale |
| > $20,000 | Tribunal order | per order | per order |

A business can generally recover agreed repair/treatment charges and actual removal/storage/maintenance/insurance/disposal costs, but those costs should not contain a profit component.

Source:
- https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/repairs-replacements-and-refunds/uncollected-goods

Do not simply write "devices left 30 days become ours" into repair terms.

## Product recalls

A refurbisher/reseller is part of the supply chain.

Current ACCC guidance says:

- suppliers have safety responsibilities;
- if the business starts a safety recall, it must notify the ACCC within **2 days**;
- serious injury, illness or death associated with a supplied consumer product must also be reported within 2 days;
- recall preparation should identify product name/model/serial/batch where relevant and affected customers.

Sources:
- https://www.productsafety.gov.au/business/recall-an-unsafe-product/tell-the-accc-of-the-recall
- https://www.productsafety.gov.au/business/recall-an-unsafe-product/recall-tools-and-guidelines/supplier-checklist-for-conducting-a-recall
- https://www.accc.gov.au/business/selling-products-and-services/product-safety-responsibilities

### Phase 0 implication

Keep buyer contact + serial/asset ID linkage for sold electronics.

That is useful not just for accounting but for safety recalls.

## NSW second-hand electrical goods

NSW Government says new **and second-hand** electrical goods are covered by the Gas and Electricity (Consumer Safety) Act 2017.

For a second-hand electrical article, it must have been approved as required when originally sold new.

Sellers/suppliers of second-hand electrical equipment have safety obligations.

Source:
- https://www.nsw.gov.au/housing-and-construction/safety-home/electrical-safety/buying-and-using-electrical-appliances

### Chargers / power supplies

Phase 0 should avoid:

- unknown/no-name mains chargers;
- chargers with questionable markings;
- damaged mains leads;
- overseas-only plugs/adapters being represented as compliant Australian supplies.

Use known compliant chargers/power supplies and retain model/approval information where practical.

## Test-and-tag

SafeWork NSW requires regular inspection/testing of plug-in workplace equipment where it is used in a **hostile operating environment** such as wet/dusty/corrosive/damage-prone locations.

Source:
- https://www.safework.nsw.gov.au/resource-library/construction/electrical-services/electrical-risks-at-the-workplace-fact-sheet

This is **not evidence of a blanket rule that every second-hand electrical product must be test-and-tagged before retail resale**.

The resale safety procedure should instead be based on:

- product category;
- electrical approval/marking;
- visual inspection;
- functional testing;
- applicable electrical safety law;
- licensed electrical work rules where relevant.

Do not perform mains electrical work that legally requires a licensed electrical worker.

---

# 22. Windows/Linux/device resale legality and viability

## Windows 11 remains the preferred default

Microsoft's current Windows 11 minimums include:

- compatible 64-bit processor, 1 GHz+, 2+ cores;
- 4 GB RAM;
- 64 GB storage;
- UEFI / Secure Boot capable;
- TPM 2.0;
- DirectX 12 / WDDM 2.0 graphics;
- 720p display >9 inches.

Sources:
- https://www.microsoft.com/en-AU/windows/windows-11-specifications
- https://learn.microsoft.com/en-au/windows/whats-new/windows-11-requirements

For normal consumer/business resale in late 2026, a genuinely supported Windows 11 machine remains the cleanest default.

## Important Windows 10 correction

Normal Windows 10 support ended 14 October 2025.

However Microsoft now offers the **consumer Extended Security Updates (ESU)** programme in Australia through **12 October 2027**.

Current Australian enrollment options shown by Microsoft include:

- no additional cost where eligible settings sync is used;
- 1,000 Microsoft Rewards points;
- **AU$44.95 one-time purchase**, including tax.

Source:
- https://www.microsoft.com/en-AU/windows/end-of-support

### What this changes

The old repo policy effectively treated a non-Windows-11 PC as Linux/vintage/parts only.

That is too absolute.

A better rule is:

> **Windows 11 compatible is the default commercial target. A Windows 10 22H2 PC may still have a temporary supported consumer pathway through ESU, but the customer must understand that ESU ends 12 October 2027 and enrollment/account conditions apply.**

Do not advertise an old PC as long-term supported merely because ESU exists.

## Windows licensing for professional refurbishment

Microsoft still operates the **Microsoft Authorized Refurbisher (MAR)** ecosystem.

Current Microsoft material says MAR is aimed at large refurbishers and provides:

- discounted genuine Windows licences for refurbished devices;
- data wiping/reporting expectations;
- ability for participating MARs to supply licences to Third Party Refurbishers (TPRs).

Source:
- https://devicepartner.microsoft.com/en-US/communications/comm-resource-center-microsoft-authorized-refurbisher

### Phase 0 implication

Do not assume that finding an existing OEM key automatically settles every refurbishment/licensing scenario.

For low-volume devices:

- preserve/document genuine existing activation where lawful and appropriate;
- don't install pirated/grey-market keys;
- if volume grows, investigate a current Australian MAR/TPR relationship.

## Linux

No single Linux distribution is a universal safe answer for unsupported Windows hardware.

For older machines, a Linux resale path is viable only if:

- hardware works reliably;
- chosen distribution is actively supported;
- Wi-Fi/audio/suspend/webcam/etc are tested;
- buyer is clearly told it is Linux;
- the target use case makes sense.

Linux should be a **product category**, not a way to hide obsolete hardware.

## Apple viability

Apple currently defines:

- **vintage:** more than 5 and less than 7 years since Apple stopped distributing the product;
- **obsolete:** more than 7 years since Apple stopped distribution.

Hardware service normally ends for obsolete products, with limited exceptions such as some Mac laptop battery-only repair availability up to 10 years subject to parts.

Source:
- https://support.apple.com/en-au/102772

This should be checked **model by model** before accepting older Macs/iPhones/iPads.

## Android support

Support periods vary by manufacturer/model.

Example from Google's current policy:

- Pixel 8 and later: **7 years** of OS/security/Pixel Drop updates from first US Google Store availability;
- Pixel 6/6a/6 Pro/7/7 Pro/7a/Fold: **5 years**;
- Pixel 5a and earlier listed models no longer receive updates.

Source:
- https://support.google.com/pixelphone/answer/4457705

Phase 0 should record the actual **security support end date** for a phone/tablet where it can be verified.

## Australian mobile-network viability

ACMA says the 3G shutdown affects all 3G and **some 4G devices**, particularly where Triple Zero capability is affected.

Users can currently text **3 to 3498** for a free compatibility/status response from their service provider.

Source:
- https://www.acma.gov.au/3g-network-switch

### Resale rule

Do not list a phone as Australian-network compatible simply because it gets signal on one test SIM.

For older/imported devices:

- identify exact model/submodel;
- check carrier/000 compatibility;
- disclose limitations;
- reject blocked/unusable models for ordinary phone resale.

## Battery-health disclosure

No universal Australian statutory percentage threshold for "acceptable used battery health" was found.

Best practice is therefore factual disclosure:

- measured health/cycle count where device exposes it;
- observed runtime/test result;
- any warning/service message;
- whether battery is original/replaced where known.

Do not invent a "minimum legal battery percentage".

---

# 23. Data sanitisation and ITAD

## NIST has changed

**NIST SP 800-88 Rev. 2**, published September 2025, supersedes Rev. 1.

Rev. 2 is more program/risk focused and no longer acts mainly as a fixed catalogue of device-specific commands. It places stronger emphasis on:

- a media sanitisation programme;
- information sensitivity;
- appropriate Clear/Purge/Destroy techniques;
- validation/verification;
- cryptographic erase;
- trusted implementations;
- standards such as IEEE 2883.

Sources:
- https://csrc.nist.gov/pubs/sp/800/88/r2/final
- https://www.nist.gov/news-events/news/2025/09/guidelines-media-sanitization-nist-publishes-sp-800-88r2

### Repo correction

Do not describe a generic one-pass wipe as "NIST 800-88 certified".

A better Phase 0 marketing phrase remains:

> **documented media sanitisation / secure data erasure**

and the internal procedure should define the standard/method actually used.

## Current ASD/ACSC guidance

ASD's current ISM media guidance gives concrete Australian government sanitisation controls.

Examples:

### Magnetic HDD

Current ISM guidance includes:

- overwrite the drive in its entirety at least once with a random pattern;
- read back for verification;
- reset HPA/DCO;
- use ATA Secure Erase in addition to block overwriting for the growth defect table.

### Flash / SSD media

Current ISM guidance says non-volatile flash memory is overwritten at least **twice** with a random pattern followed by read-back verification.

If media cannot be successfully sanitised/verified, it is destroyed before disposal.

Source:
- https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/ism/cyber-security-guidelines/guidelines-for-media

### Important distinction

Dubbo E-Waste is not automatically required to apply government-classified-media controls to every consumer disk.

But ISM provides a strong benchmark for commercial clients who want a documented, defensible process.

## Apple Silicon / T2 Macs

Apple says Erase All Content and Settings on supported Apple Silicon or T2 Macs renders user data cryptographically inaccessible by obliterating relevant keys in effaceable storage.

Source:
- https://support.apple.com/en-au/guide/deployment/dep0a819891e/web

Use supported Apple erase workflows rather than treating every modern Mac SSD as a generic overwrite target.

## Android/iPhone

Modern mobile devices generally rely heavily on encrypted storage and platform erase/reset mechanisms.

Operational requirements remain:

- legitimate account/activation-lock removal;
- complete factory erase/reset using manufacturer-supported workflow;
- verification that device activates to clean setup;
- no retained donor/customer account password.

Do not promise forensic destruction based merely on clicking Factory Reset.

## Sanitisation certificate fields

A useful sanitisation record should identify:

- business/client;
- asset ID;
- device serial/IMEI;
- storage media type;
- storage media serial where accessible;
- media capacity;
- data classification/instruction if client supplies one;
- chosen sanitisation policy/standard;
- method/command;
- tool and version;
- date/time;
- operator;
- verification/read-back/validation result;
- PASS/FAIL;
- failure reason;
- escalation to destruction if failed;
- final disposition;
- certificate/job number.

A new templates/data-sanitisation-certificate.md file has been added.

## Physical destruction provider

Public web research found **Shred-X Secure Destruction** as a NSW provider offering secure destruction/recycling of electronics, including commercial quantities. The surfaced directory result points to Wetherill Park rather than a Dubbo facility.

Source:
- https://recyclingnearyou.com.au/material/home/computers/MidWesternNSW

HP Australia also offers enterprise ITAD with certified data wiping/destruction, but public material does not establish whether a tiny Dubbo pilot is commercially eligible.

Source:
- https://www.hp.com/au-en/services/workforce-solutions/workforce-computing/it-asset-disposition.html

### Still unresolved

No clearly Dubbo-based public provider with published **serialised HDD/SSD destruction pricing** was found in this pass.

Get quotes only when the project has client demand.

## Privacy Act / NDB

OAIC says most small businesses with annual turnover of **$3 million or less** are not covered by the Privacy Act, **but important exceptions exist**, including some health-service providers, businesses trading in personal information, Commonwealth contractors, TFN recipients and others.

Sources:
- https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business
- https://www.oaic.gov.au/privacy/notifiable-data-breaches/quick-reference-guide-for-responding-to-data-breaches

### Operational conclusion

Do not market the service as generically "Privacy Act compliant" without checking the actual legal entity/client/data.

Even where the Act does not directly apply, business clients can impose stronger contractual data-security requirements.

Treat all unwiped client media as sensitive.

---

# 24. WHS, lithium and workshop safety

## Sole trader = PCBU

A self-employed person/sole trader can be a **PCBU** under NSW WHS law and owes duties to workers and other people affected by the work, including visitors.

Phase 0 is not outside WHS merely because it is small or home based.

## NSW Codes of Practice changed in 2026

SafeWork NSW says that from **1 July 2026**, s26A of the Work Health and Safety Act makes Codes of Practice the **minimum performance standards a PCBU is expected to comply with**.

Source:
- https://www.safework.nsw.gov.au/resource-library/codes-of-practice

This is important for every risk-control document in the project.

## Lithium-ion handling

Current SafeWork NSW guidance says:

- follow manufacturer storage/handling instructions;
- keep batteries cool/dry and away from sunlight/heat/flammables;
- inspect regularly;
- stop using damaged/swollen units;
- use correct chargers;
- do not charge unattended/for long periods;
- isolate damaged batteries;
- use suitable/fire-resistant storage or bags for damaged batteries;
- label damaged-battery packaging;
- follow ADG transport requirements;
- maintain an emergency plan.

Source:
- https://www.safework.nsw.gov.au/hazards-a-z/lithium-ion-batteries

### Large-quantity threshold

SafeWork NSW notes special emergency-plan notification requirements for workplaces storing/handling/installing **25,000 kg** of lithium-ion batteries.

That threshold is irrelevant to Phase 0 volumes, but normal WHS risk duties apply well below it.

## FRNSW practical guidance

Fire and Rescue NSW says:

- charge on hard, non-flammable surfaces;
- don't charge while sleeping or away;
- use approved/compatible chargers;
- don't use/charge swollen, leaking, overheated, cracked, dented, punctured or crushed batteries/devices;
- damaged batteries should not go into regular waste/recycling or ordinary battery recycling bins;
- damaged batteries should be kept away from structures/combustibles, with FRNSW guidance referring to at least **3 metres** where safe.

Source:
- https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/battery-and-charging-safety/shop-charge-and-recycle-safely
- https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/battery-and-charging-safety/what-should-i-do-if-my-battery-is-damaged

### Correction to old cost model

Do not automatically buy a generic **"metal battery bin"** and assume the problem is solved.

The Phase 0 policy is to **reject loose/damaged batteries**, minimise storage, supervise charging and have an appropriate emergency/isolation process.

Equipment should follow the actual risk assessment and official guidance.

## Dangerous-goods transport

NSW EPA says a dangerous-goods **driver or vehicle licence is not required solely for transporting lithium-ion batteries**, because they are treated as articles under the ADG Code.

For lithium batteries:

- over **1,000 kg battery mass** becomes a placard-load issue;
- controls still apply below licensing/placard thresholds;
- waste transport law can separately apply.

Source:
- https://www.epa.nsw.gov.au/Your-environment/Dangerous-goods/licensing-training

Phase 0 will be nowhere near 1,000 kg.

This does **not** mean damaged batteries can be casually placed loose in a car.

## Workplace electrical equipment

Where workshop plug-in equipment is used in a hostile operating environment, SafeWork NSW requires regular inspection/testing by a competent person and RCD controls where applicable.

Source:
- https://www.safework.nsw.gov.au/resource-library/construction/electrical-services/electrical-risks-at-the-workplace-fact-sheet

A damp/mould-affected shed is therefore a particularly poor place to operate electrical test equipment until the premises issue is resolved.

## CRTs

The existing Phase 0 CRT refusal remains sensible.

Practical distinction:

- intact CRT equipment can be managed as e-waste;
- breaking/crushing CRT glass creates materially greater lead/handling risk.

Do not dismantle CRTs casually at home.

## Solder / lead / fumes

Electronics repair can expose workers to solder fumes and, depending on material, lead/other contaminants.

Risk control should prioritise elimination/substitution/engineering controls such as local exhaust ventilation where relevant, not simply PPE.

Phase 0 should avoid building a high-volume board-rework/dismantling line in the home shed.

## Printer toner

No strong current NSW-specific public source surfaced that creates a special licence for ordinary toner handling at this tiny scale.

Practical rule remains:

- don't accept loose/spilled toner;
- keep cartridges contained;
- follow manufacturer SDS information;
- pre-approve printers.

---

# 25. Transport and postage

## Australia Post lithium limits

Australia Post's current dangerous/restricted-items guidance says it can carry lithium batteries only within specified limits, including:

- lithium-ion cell: **20 Wh max per cell**;
- lithium-ion battery: **100 Wh max per battery**.

For international or domestic **air** carriage:

- batteries/cells must be installed in the device;
- maximum two batteries or four individual cells;
- packaging requirements apply.

Australia Post prohibits:

- recalled lithium batteries;
- damaged batteries;
- non-conforming batteries.

Source:
- https://auspost.com.au/business/shipping/shipping-guidelines/dangerous-prohibited-items

## Packaging rule

Australia Post says:

- device must be protected from accidental activation;
- strong internal/external packaging is required;
- lithium batteries must not be packed by themselves or simply alongside a device for the services described.

### Phase 0 shipping policy

1. **Never post swollen/damaged/recalled lithium batteries or devices containing them.**
2. Identify battery Wh rating before shipping.
3. Default to device-with-battery-installed where permitted.
4. Use rigid protective packaging and prevent device movement/activation.
5. Re-check the carrier rules for each shipment, especially international.
6. Do not assume a courier follows Australia Post rules; every carrier has its own dangerous-goods acceptance conditions.

## High-value shipping

For every shipment track:

- device serial/asset ID;
- photos before packing;
- packaging method;
- tracking number;
- declared/covered value;
- signature option where used;
- dispatch date;
- delivery result.

Shipping-damage/return risk must be in the margin model.

## Local delivery versus postage

For large monitors/TVs, local pickup/delivery is likely much more defensible during the pilot than courier freight because:

- high breakage risk;
- oversize freight;
- difficult claims;
- low margin relative to freight.

No national TV-shipping policy should be adopted without testing packaging and carrier cost on actual models.

---

# Operating changes from 21–25

1. Add the **ACL repair notice** before accepting any customer repair.
2. Add an uncollected-goods process; never rely on "30 days = ours".
3. Keep buyer/serial records sufficient to run a recall.
4. Do not use "no warranty/as-is" as a substitute for ACL rights.
5. Keep Windows 11 as default, but recognise Windows 10 consumer ESU through **12 Oct 2027**.
6. Investigate MAR/TPR licensing only if Windows-refurb volume becomes meaningful.
7. Use NIST SP 800-88 Rev. 2 / ASD guidance as programme standards, not marketing buzzwords.
8. Treat modern Apple erase as cryptographic sanitisation where Apple documents it.
9. Keep Privacy Act claims conditional; small-business exemption has exceptions.
10. Update WHS documents for NSW's **1 July 2026 Code of Practice** change.
11. Do not accept damaged lithium in Phase 0.
12. Never post damaged/recalled lithium batteries.
13. Replace the generic "metal battery bin" assumption with risk-assessed charging/isolation controls.

---

# Primary sources

## Consumer/product
- https://www.accc.gov.au/consumers/problem-with-a-product-or-service-you-bought/repair-notices
- https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/repairs-replacements-and-refunds/rights-to-a-repair
- https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/repairs-replacements-and-refunds/uncollected-goods
- https://www.productsafety.gov.au/business/recall-an-unsafe-product/tell-the-accc-of-the-recall
- https://www.nsw.gov.au/housing-and-construction/safety-home/electrical-safety/buying-and-using-electrical-appliances

## Devices/OS
- https://www.microsoft.com/en-AU/windows/windows-11-specifications
- https://www.microsoft.com/en-AU/windows/end-of-support
- https://devicepartner.microsoft.com/en-US/communications/comm-resource-center-microsoft-authorized-refurbisher
- https://support.apple.com/en-au/102772
- https://support.google.com/pixelphone/answer/4457705
- https://www.acma.gov.au/3g-network-switch

## Data
- https://csrc.nist.gov/pubs/sp/800/88/r2/final
- https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/ism/cyber-security-guidelines/guidelines-for-media
- https://support.apple.com/en-au/guide/deployment/dep0a819891e/web
- https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business

## WHS/transport
- https://www.safework.nsw.gov.au/resource-library/codes-of-practice
- https://www.safework.nsw.gov.au/hazards-a-z/lithium-ion-batteries
- https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/battery-and-charging-safety/shop-charge-and-recycle-safely
- https://www.epa.nsw.gov.au/Your-environment/Dangerous-goods/licensing-training
- https://auspost.com.au/business/shipping/shipping-guidelines/dangerous-prohibited-items


---

# Supplementary compliance/tooling findings — 2 October 2026

## EESS / RCM nuance for second-hand equipment

The Electrical Equipment Safety System (EESS) states that the EESS framework itself does **not** apply to second-hand electrical equipment that was previously sold in Australia and was compliant when originally offered for sale.

That is important: ordinary resale of legitimately Australian-market second-hand equipment does **not automatically turn Dubbo E-Waste into an EESS Responsible Supplier**.

However:

- individual state/territory second-hand electrical safety requirements still apply;
- if the business imports or manufactures new in-scope electrical equipment, Responsible Supplier / registration / RCM obligations can arise;
- suppliers of new in-scope equipment should source compliant/registered products and observe RCM requirements.

Sources:
- https://www.eess.gov.au/equipment/second-hand-electrical-equipment/
- https://www.eess.gov.au/responsible-suppliers/
- https://www.eess.gov.au/equipment/electrical-equipment-safety-system/

### Phase 0 implication

Prefer original/compliant Australian chargers and power supplies. Do not import generic mains chargers and assume second-hand-device rules cover them.

## Electrical repair licensing

NSW Government says a licence/certificate is required to do **electrical wiring work**, regardless of cost or location.

Source:
- https://www.nsw.gov.au/business-and-economy/licences-and-credentials/electrical-work-licences

That does not mean every low-voltage computer repair is licensed electrical wiring work.

It does mean the project should draw a firm boundary around mains wiring/electrical work and use an appropriately licensed person where the legal definition is triggered.

## Practical sanitisation tooling

### nwipe

Current nwipe documentation says recent releases, including v0.43, add native secure-erase support for ATA SSDs and NVMe devices where the hardware/firmware supports it.

The project's tool policy can therefore distinguish between:

- magnetic-drive overwrite/verification;
- drive-native ATA secure erase;
- NVMe native erase/sanitize capabilities.

Source:
- https://github.com/martijnvanbrummelen/nwipe

### nvme-cli

NVM Express documentation describes the NVMe **Sanitize** command as supporting operations including:

- block erase;
- cryptographic erase;
- overwrite;

with the purpose of making prior user data unrecoverable from media, cache and relevant overprovisioned areas where the controller implements the feature.

Sources:
- https://nvmexpress.org/resources/nvm-express-base-specification/
- https://github.com/linux-nvme/nvme-cli

### Operational warning

Do not turn tool availability into a compliance claim.

For every medium:

1. detect capabilities;
2. select the documented appropriate method;
3. capture tool/version and result;
4. verify/validate;
5. if sanitisation cannot be successfully completed/verified, route the medium to destruction.

Destructive firmware commands such as ATA security erase should be used only under a controlled SOP by someone who understands the device and risks.

## Lithium fire response / extinguishers

Fire and Rescue NSW's current guidance is more nuanced than "buy extinguisher type X".

For a small overheating phone/tablet, if safe, FRNSW guidance includes disconnecting power and moving it away from structures/combustibles. Small lithium-ion devices may be cooled with clean water where safe, and water may be used on a small lithium-ion fire where there is no energised-electrical hazard.

FRNSW also warns that dry-chemical-powder or CO₂ extinguishers may help stop fire spread but are **unlikely to fully extinguish a lithium-ion cell fire**; reignition remains a risk and **000 should be called**.

Sources:
- https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/battery-and-charging-safety/what-should-i-do-if-my-battery-is-damaged
- https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/battery-and-charging-safety/shop-charge-and-recycle-safely

### Phase 0 conclusion

Do not specify one extinguisher as "the lithium solution".

Final fire equipment/detection should follow:

- the actual premises risk assessment;
- insurer requirements;
- FRNSW guidance;
- electrical risks present in the workspace.

No authoritative source found in this pass justified a universal **smoke-vs-heat detector** answer for this exact shed.

## Courier-specific lithium restrictions

Australia Post is not the only rule set.

Sendle's current dangerous-goods policy is notably restrictive for electronics with lithium batteries. Its public policy allows only defined small quantities/conditions and does **not** provide a safe basis for assuming old phones being sent for recycling are acceptable. International lithium-ion carriage is restricted.

Source:
- https://try.sendle.com/en-au/dangerous-goods

### Shipping rule

Before booking each courier:

- check that carrier's current lithium/device policy;
- confirm whether **used/refurbished** battery devices are eligible;
- retain battery Wh/model details;
- never ship damaged/swollen/recalled batteries;
- do not assume Australia Post acceptance means another courier accepts the parcel.

StarTrack/other carriers should be treated as **carrier-confirmation required** until their current service-specific terms are checked at booking.
