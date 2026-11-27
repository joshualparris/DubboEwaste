# Manufacturer-authorised FRP recovery — Dubbo ITAD
Date: 27 November 2026 (AEDT). Status: research and enquiry only; no accreditation obtained.

## Evidence and current position
- Huawei Australia consumer support stated in a chat supplied by the project operator that Roadhound Electronics can process Huawei FRP removal after proof of purchase and a completed Unlocking Agreement, with data erased. This is reported support guidance, not an executed service or formal agreement.
- A subsequent Roadhound conversation reportedly directed the operator to seek authorisation directly from manufacturers rather than through Roadhound. The claim that Roadhound is the sole Australian authorised provider needs written confirmation of brand, service, geography and time scope.
- Roadhound service contact supplied by Huawei: service@roadhound.com.au, 02 4949 3030, 14 Pendlebury Road, Cardiff NSW. Confirm postal postcode and instructions before dispatch (2285/2286 discrepancy).
- Roadhound is a potential commercial and recycling partner; verify current brand relationships, MobileMuster participation, bulk pricing and postal service independently. No cost for Roadhound's accreditation has been established.
- No public fixed-price Australian FRP-only accreditation programme was identified in preliminary research. Manufacturer fees, eligibility, training, tooling, annual charges and per-device fees are unknown, not zero.
- General repair certification, enterprise service-provider accreditation, MDM enrolment and Apple's free Independent Repair Provider programme do not themselves confer account-lock removal authority.
- Goal: reuse-first recovery for lawfully acquired, documented donated and decommissioned devices in regional NSW, with manufacturer-approved erasure and ownership verification. Do not assume existing authorisation, accept unverified provenance or access former owners' data.

## Cost and requirements evidence — second pass (27 Nov 2026, ~11:20 AEDT)
Question asked: how much does it cost to become authorised for FRP unlocks the way Roadhound is? Sources accessed 27 Nov 2026. Evidence grades: **A** official manufacturer page · **B** leaked/reported contract or reputable press · **C** forum or anecdotal.

| Brand | What authorisation involves | Cost signals found | Grants account-lock removal? | Grade |
|---|---|---|---|---|
| Samsung (US Independent Service Provider contract, 2024 leak) | Genuine parts only; WISE-certified location plus at least one WISE Level 2 technician on site during all service hours; launch readiness evaluation; per-technician G-SPN accounts; uploads of IMEI, parts and repair data to Samsung; one-year term | Parts bought at Samsung list price, prepaid in USD; proprietary equipment at operator's cost; Samsung pays nothing for services; general liability insurance US$1M per occurrence / US$5M aggregate with Samsung as additional insured. One US provider lists WISE certification at about US$400 per technician | **No** — the contract states Level-1 service excludes FRP unlock | B |
| Samsung (Canada) | Same ISP model launched in 2025 | Not published | Not stated | A |
| Samsung (Australia) | No Australian ISP-style programme found | Unknown | Unknown | — |
| Apple Independent Repair Provider | Accepting Australian applications; established business with verification documents; commercial walk-in premises (residential address not acceptable); business-domain email; Apple-certified technicians re-certified annually | No joining fee listed; certification exam fees waived for approved providers. Contract (reported Feb 2020): unannounced audits, continuing up to five years after leaving; if over 2% of audited transactions used prohibited parts, US$1,000 penalty per transaction plus investigation costs | **No** — Activation Lock is handled by Apple's own support-request process with proof of purchase; proof of ownership must include serial number, IMEI or MEID | A (programme) / B (contract) |
| Huawei (Australia) | 2019 service network built through a Happytel partnership (56 collection points, two service centres) — a chain-partner model. Huawei AU support currently points FRP cases to Roadhound (see above). Huawei's enterprise Certified Service Partner tiers relate to enterprise ICT, not consumer FRP | No public application route or fee for small operators found | Via authorised centre with proof of purchase (reported) | B/C |
| Motorola | Searches surfaced Motorola **Solutions** (radio) partner programmes, a different company from Motorola Mobility (Lenovo). No Motorola Mobility AU service-partner programme found | Unknown | Unknown | — |

Third-party FRP tool licences sold to repair shops on per-credit or time-based terms exist. They are **not** manufacturer authorisation and remain out of scope under this project's rules.

### Conclusions from the second pass
1. **No manufacturer publishes an accreditation price.** Authorisation is a contract you apply for and are accepted into; the cost is overheads and compliance (commercial premises, certification, insurance, prepaid parts, audits, data reporting), not a fee.
2. **The programmes open to independents do not grant account-lock removal.** Samsung's ISP Level-1 explicitly excludes FRP; Apple keeps Activation Lock removal in-house.
3. **Even authorised channels appear to require original-owner proof of purchase.** Apple community reports suggest requests from non-original owners are refused (grade C). If Android OEMs in Australia work the same way, donated devices without paperwork stay ineligible even for an authorised operator. This is the top open question.
4. **Phase 0 premises would not qualify.** A home-based or residential workshop fails Apple's commercial-premises requirement, and Samsung's model requires a certified location.
5. **Highest-leverage action remains upstream release at intake** — actions 1 and 3 in [FRP ownership transfer and mobile reuse](FRP-OWNERSHIP-TRANSFER-AND-MOBILE-REUSE-2026-11-25.md): donor signs out of Google/Huawei/Samsung/Apple accounts at drop-off; business donors release devices from accounts and MDM before handover; locked units without paperwork go to HOLD, parts or recycling.

### Second-pass sources
- Samsung ISP agreement (as published by 404 Media, May 2024): https://www.404media.co/content/files/2024/05/samsungrecreated.pdf
- Samsung Canada ISP launch (2025): https://news.samsung.com/ca/samsung-electronics-canada-expands-service-capabilities-with-launch-of-independent-service-provider-program
- WISE certification pricing example (iResQ): https://www.iresq.com/?p=20769
- Apple IRP, Australia: https://support.apple.com/en-au/irp-program
- Apple IRP contract reporting: https://www.vice.com/en/article/apples-independent-repair-program-is-invasive-to-shops-and-their-customers-contract-shows/ and https://digitaltrends.com/?p=2451106
- Apple Activation Lock removal: https://support.apple.com/kb/ts4515 · non-original-owner refusals (anecdotal): https://discussions.apple.com/thread/255816876
- Huawei–Happytel partnership (2019): https://eftm.com/2019/07/exclusive-huawei-launches-customer-service-through-happytel-stores-across-australia-63009
- Huawei FRP needing proof of purchase (UK, anecdotal): https://community.ee.co.uk/t5/Orders/Proof-of-purchase-of-an-old-device/td-p/1249158
- Huawei enterprise Certified Service Partner tiers: https://e.huawei.com/th/special_topic/event/2020q2/AP_EBG_Services_Price_Changes

## Deep research prompt (v2 — gap-closing)
Supersedes the earlier v1 prompt (see git history before this commit). Paste-ready and self-contained.

```text
Act as an evidence-first Australian researcher in IT asset disposition (ITAD), device refurbishment and manufacturer service partnerships.

CONTEXT
A sole trader (Parris Tech Services, Dubbo, regional NSW) runs a small, non-commercial device reuse project: legitimately donated and decommissioned phones, tablets and laptops are securely erased, refurbished and donated to community organisations. Some phones arrive Factory Reset Protection (FRP) / account locked. Huawei Australia support refers Huawei FRP cases to Roadhound Electronics (Cardiff NSW), subject to proof of purchase and an unlocking agreement. Roadhound reportedly said it is the only authorised provider in Australia and advised approaching manufacturers directly. The operator wants the cheapest legitimate way to recover locked devices, ideally a limited manufacturer-approved recovery authority rather than a full warranty service centre.

ALREADY KNOWN (verify Australian applicability; do not re-research from scratch)
- No manufacturer publishes an accreditation fee; costs are premises, certification, insurance, prepaid parts and audits.
- Samsung's US/Canada Independent Service Provider contract requires WISE certification and US$1M/US$5M liability cover, and its Level-1 service excludes FRP unlock.
- Apple's Independent Repair Provider programme accepts Australian applicants, has no listed joining fee, requires commercial (non-residential) premises, and does not grant Activation Lock removal; Apple handles Activation Lock requests itself with proof of purchase.
- Huawei's Australian service network was built via a 2019 Happytel partnership.

ANSWER THESE, IN PRIORITY ORDER
1. Proof of ownership: for Huawei, Samsung, Apple, Motorola/Lenovo, OPPO, Xiaomi, Google Pixel, HMD/Nokia and TCL/Alcatel in Australia, what evidence lets a non-original owner (donation recipient, ITAD, recycler) have an account lock removed? Is a signed donor transfer form, donor consent, statutory declaration, business asset register or chain-of-custody record ever accepted? How are business-owned devices released (e.g. Android Enterprise, Samsung Knox, Apple Business Manager)?
2. Roadhound: which brands and services (including FRP) is it authorised for, per manufacturer AU service locators? Test the "only authorised provider" claim brand by brand. Per-device FRP price, turnaround, mail-in/bulk options, accepted proof, MobileMuster role.
3. Each brand's Australian service network: current authorised providers, whether new partners are accepted, official application route and contact, any limited, subcontractor, refurbisher or regional-pilot pathway, and any published or quoted AUD costs (application, training, software, renewals, per-device fees, insurance, premises, minimum volumes).
4. Australian refurbishers and trade-in processors (ReUse Mobiles, telco trade-in partners, Tech Reuse Charter members, MobileMuster): how do they handle locked stock? Any manufacturer release arrangements? Share of intake locked? Disposition of unrecoverable units?
5. Certification: is CTIA WISE available in Australia, and what are the Australian equivalents and costs for a small operator (e.g. R2v3, e-Stewards, AS/NZS 5377, NAID AAA)?
6. Regulation: does NSW second-hand dealer licensing apply to donated, non-commercial redistribution? Home-business approval in Dubbo Regional Council area. Typical public liability minimums in AU repair-partner contracts. Australian law relevant to account-lock removal (Copyright Act technological protection measures, Criminal Code computer offences) — summarise only; not legal advice.
7. Advocacy: any 2025–2026 Australian right-to-repair or e-waste policy developments on activation locks, and any overseas manufacturer-refurbisher release schemes that could be proposed locally.
8. Cost model: total and per-recovered-device cost at 10, 50, 100 and 250 devices/year for (a) Roadhound per-device, (b) manufacturer authorisation if attainable, (c) donor release at intake with no unlocking. Label every assumption.

RULES
- Never provide, recommend or describe FRP or Activation Lock bypass tools, exploits or techniques.
- Do not contact anyone or submit applications.
- Do not invent prices or terms. Write "unknown" and name who to ask for a written quote.
- Prefer primary Australian sources; use overseas examples only as leads. Grade evidence (A official, B reputable report or contract, C anecdotal) and record contradictions.
- Quote no more than a short phrase from any source; otherwise paraphrase.

OUTPUT
1. A one-paragraph bottom line.
2. A brand-by-brand table: network operator, partner pathway, account-lock policy, accepted proof, costs, evidence grade, source.
3. Answers to questions 1–8.
4. Unknowns, plus the exact questions and contact to use for written quotes.
5. Draft enquiry emails (do not send).
6. A 30/60/90-day plan with stop/go gates.
7. A source list with access dates.
```

## Starting sources to verify
- Roadhound: https://roadhound.com.au/
- Huawei Australia: https://consumer.huawei.com/au/support/ and https://www.huawei.com/au/contact-us
- Samsung Australia: https://www.samsung.com/au/business/
- Motorola Australia: https://en-au.support.motorola.com/
- HMD: https://www.hmd.com/en_au/support
- TCL Australia: https://www.tcl.com/au/en/support
- Apple IRP: https://support.apple.com/en-au/irp-program
- MobileMuster: https://www.mobilemuster.com.au/
- Australian Productivity Commission right to repair: https://www.pc.gov.au/inquiries/completed/repair/report
These are research starting points, not proof of programme eligibility or specific fees.

## Next decision
Obtain written manufacturer confirmation of whether limited authority exists and what donated-device proof is accepted before committing funds. No private device identifiers or individual support staff names are included in this public record.
