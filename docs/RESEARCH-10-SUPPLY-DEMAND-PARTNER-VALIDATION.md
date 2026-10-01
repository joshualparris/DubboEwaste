# Research 10: Supply, demand and partner validation

**Research date:** 2 October 2026 (AEST)

**Gap covered:** `codexGAPS.md` section 13: repeatable supply discovery, demand discovery and partner terms.

**Relationship to existing research:** the repository already contains Dubbo source lists, MSP/fleet research, school and government boundaries, partner/white-label comparisons and outreach scripts. This report supplies the missing validation system: how to classify evidence, run a small test, compare sources, and avoid treating a public profile as an agreement.

**Status:** validation framework complete; no supply, buyer, partner, exclusivity or commercial term is confirmed until the written-evidence gates in this report pass.

## Executive decision

The first 20–30 devices should come from **known-authority, low-complexity sources**, not a general public collection campaign:

1. owner-authorised household/sole-trader devices with a clear data route;
2. local repairers’ donor stock where title and safety are documented;
3. small business/MSP refresh lots where the organisation’s disposal authority is clear;
4. community/charity recipients identified before the device is accepted;
5. approved downstream routes for everything that fails.

Treat schools, councils, government fleets, large corporate accounts and national ITAD partners as **future institutional channels** until procurement, title, data and handoff terms are written. NSW public schools have a dedicated eWaste contract/process, so a school’s possession of old devices is not evidence that it may donate them to a local operator.

## 1. Evidence classes

Every supply, demand or partner claim gets one of these statuses:

| Status | Evidence | What it permits |
|---|---|---|
| `LEAD` | website, directory entry, public logo, social post, unverified profile | contact and ask questions only |
| `RESPONDED` | person replies but no terms/volume/authority confirmed | schedule a discovery call; no intake promise |
| `QUALIFIED` | named contact, source category, approximate volume, authority and route evidence | controlled pilot proposal |
| `PILOT-AGREED` | written scope, dates, ownership, data, safety and rejected-material terms | accept within the stated pilot |
| `ACTIVE` | completed handoffs and measured outcomes | forecast repeatability from actual data |
| `CLOSED` | partner/source ended or failed | retain reason and do not silently reactivate |

Do not upgrade a lead because it has a large website, a famous customer, a government logo or a public partner page.

## 2. Supply funnel

### 2.1 Source record

Create one source record per organisation or recurring source:

```text
source_id, name, source_type, location, contact_role,
first_contact, evidence_url, evidence_status,
authority_owner, likely_categories, expected_units,
frequency, data_state, battery_mix, pickup_distance,
storage_requirement, rejected_materials, downstream_need,
decision_maker, next_action, last_verified, outcome
```

`expected_units` is a range, not an optimistic single number. Record the basis: one completed refresh, a stated annual cycle, an estimate, or a public procurement record.

### 2.2 Supply-source comparison

| Source | Advantages | Main unknowns | Phase 0 action |
|---|---|---|---|
| Known household/sole trader | fastest authority, small volume, direct feedback | inconsistent quality and repeatability | pre-screen and accept only safe routes |
| Local repairer donor stock | already triaged by someone, model concentration possible | title, battery/data state and residual value | request a 5–10 item test lot with written terms |
| MSP/client refresh | repeatability and business models | client authority, data, contract, pickup and rejected residue | discovery interview, no intake until work order |
| Independent school/charity | potential community impact and local demand | asset ownership, governance, market-value/donation rules | ask procurement/asset custodian first |
| NSW public school | identifiable process and volumes | dedicated department contract, no casual diversion | future authorised supplier/partner route only |
| Council/transfer station | high volume and public visibility | ownership/property transfer, reuse rights, contamination, contract | written council permission before diversion |
| Auction/liquidation | identifiable lots and exact inventory | paid acquisition, mixed junk, warranty, freight | price a small lot only after exit model |
| National ITAD partner | standards, certificates, corporate supply | onboarding, minimums, margin, geography and audit | partner qualification, not informal collection |
| General public campaign | broad awareness | high junk rate, safety and storage risk | defer until triage/rejected route is proven |

## 3. Supply qualification gate

Before accepting a repeat source, obtain answers to all of these:

### Authority and title

- Who owns the equipment?
- Who can authorise disposal, resale, donation and disassembly?
- Is there a lease, finance, grant, school asset or customer-property restriction?
- What document or work order proves authority?
- When does title transfer, if at all?

### Data and identity

- What types of data may be present?
- Does the source require NIST/ISM-aligned sanitisation or destruction evidence?
- Who handles account/MDM/Autopilot/Activation Lock removal?
- What happens when a device cannot be unlocked or sanitised?
- Is the source allowed to disclose serials/IMEIs and owner information?

### Physical and financial

- approximate units, mix and refresh cadence;
- location, access, loading and packaging;
- batteries, CRTs, toner, damaged items and prohibited categories;
- pickup cost, freight, payment, rebate or processing charge;
- accepted/rejected-material rules;
- expected response time and decision-maker.

### Outcome and reporting

- reuse, repair, donation, parts and recycling preferences;
- whether resale is permitted;
- recipient geography and eligibility;
- reporting fields, certificates and impact measures;
- branding/photography permissions;
- review date and termination process.

If the source cannot answer authority, data, safety or rejected-material questions, it is not qualified.

## 4. Primary-source boundaries discovered

### NSW public schools

The NSW Department of Education’s technology policy says principals must keep records of disposed/deactivated equipment, ensure memory/data is wiped, and use the department’s dedicated eWaste service through EDConnect. A current school notice also says schools have been confused about eWaste collection and describes a formal booking process and backlog.

Sources:

- [NSW Department of Education: Technology in schools procedures](https://education.nsw.gov.au/policy-library/policies/pd-2024-0481-01)
- [NSW Department of Education: school eWaste process notice](https://education.nsw.gov.au/teaching-and-learning/technology-for-learning/news-t4l/2025/issue122)

**Conclusion:** a NSW public school is not a casual Phase 0 donation source. A valid future route would require an authorised procurement/contract/partner arrangement and clear title/data terms.

### NSW Government procurement

The NSW ICT End User Devices and Services Contract describes disposal/sanitisation, asset tags, formal certificates, asset-register updates, reuse/donation, supply-chain reinsertion, proven recycling and consent before off-site disposal. The NSW Supplier Hub says public supplier profiles are not necessarily verified and that procurement arrangements/rules apply.

Sources:

- [NSW ICT End User Devices and Services Contract](https://www.info.buy.nsw.gov.au/contracts/ict-end-user-devices-and-services)
- [NSW Supplier Hub](https://buy.nsw.gov.au/suppliers/find-opportunities)
- [NSW ICT and digital procurement](https://buy.nsw.gov.au/categories/ict)

**Conclusion:** a local operator can study the requirements and potentially seek an approved supplier/partner route, but cannot represent a public profile as a government contract or accept government assets outside the authorised chain.

### NSW Government waste procurement

The current NSW waste-management contract is a mandatory whole-of-government arrangement for eligible agencies, with regional availability and specific supplier/order processes. This is relevant to council/government outreach: the customer may already be bound to a contract and cannot simply redirect equipment based on a friendly conversation.

Source:

- [NSW Waste Management Contract](https://buy.nsw.gov.au/contracts/waste-management)

### ITAD supplier evidence

The current Buy NSW profile for ITC Asset Management publicly describes chain of custody, data destruction, refurbishment, certified recycling and government/council/health/university customers, while noting that detailed supplier information is available to registered buyers. This is evidence of a capable incumbent, not evidence that ITC will subcontract or supply a Dubbo operator.

Source:

- [ITC Asset Management on Buy NSW](https://buy.nsw.gov.au/supplier/profile/89282)

### Community demand context

Good360’s current Digital Access report describes ongoing need for laptops, phones and reliable internet among vulnerable Australians and the role of donated digital devices. Need does not itself prove a local recipient, eligibility, support capacity or acceptance of the exact grade/model.

Source:

- [Good360 Digital Access Report](https://good360.org.au/wp-content/uploads/2025/01/Good360_Digital_Access_Report_2025.pdf)

## 5. Demand discovery system

### 5.1 Buyer/recipient record

```text
demand_id, organisation_or_segment, location,
buyer_or_recipient_type, device_need, minimum_spec,
budget_or_funding, OS_preference, battery_expectation,
cosmetic_tolerance, warranty_need, delivery/setup_need,
accessibility_need, support_capacity, desired_quantity,
decision_maker, evidence_status, next_action, last_verified
```

Do not collect more personal information than necessary. For an individual recipient, use a referral/partner route rather than building a public waiting list containing sensitive circumstances.

### 5.2 Demand segments to test

- students/families needing a basic supported laptop;
- trades and farms needing a rugged local machine;
- small businesses needing identical replacement PCs;
- community organisations needing a supported device and setup;
- collectors seeking vintage/retro gear;
- homelab buyers seeking networking/servers;
- repairers seeking donor parts;
- charities/partners able to distribute but not support devices;
- buyers who need accessibility hardware or screen size rather than maximum specification.

Each segment needs a different support promise. A cheap device with no support may be less useful than a slightly more expensive tested device with setup and a clear remedy route.

## 6. Three demand experiments

### Experiment A: structured interviews

Interview at least five representatives in each of two segments before building stock. Ask:

1. What device/model/spec do you currently need?
2. What is the lowest acceptable supported OS and battery state?
3. How far will you travel or what delivery cost will you accept?
4. What cosmetic defects are acceptable?
5. Do you need setup, migration, accessibility or training?
6. What happens if the device fails?
7. Is a receipt, warranty, sanitisation evidence or serial record required?
8. What quantity and timing is realistic?
9. Who approves purchase or allocation?
10. What would make you reject a refurbished device?

Record answers as ranges and observed objections, not as promises.

### Experiment B: controlled listings

Use five matched items and one channel at a time. Measure:

- views and enquiries;
- qualified enquiries versus no-shows;
- offers and realised price;
- time answering questions;
- requests for battery/support details;
- days-to-sale;
- return/complaint outcome.

Do not infer demand from views alone. A qualified buyer with a completed payment or signed allocation is stronger evidence.

### Experiment C: pre-order/waitlist without risky stock

Publish a category/specification interest form without collecting unnecessary personal details. Ask for desired model/spec, budget range, local pickup/delivery and support needs. Do not promise availability or reserve inventory until authority, price and condition are known.

Success requires a repeatable conversion from interest to paid/approved order, not a large number of vague responses.

## 7. Partner due-diligence scorecard

Score each potential partner 0–2 per field:

| Field | 0 | 1 | 2 |
|---|---|---|---|
| authority/title | unclear | verbal/partial | written and named |
| data responsibility | unknown | general promise | exact owner/process/certificate |
| safety/rejected items | no route | route discussed | written accepted/rejected matrix |
| volume/cadence | none | estimate | measured or scheduled |
| economics | unknown | indicative | written price/rebate/charge |
| custody/logistics | unclear | informal | documented handoff/tracking |
| quality/route | no buyer | possible buyer | named downstream/recipient |
| warranty/remedies | absent | discussed | written responsibility |
| insurance/indemnity | unknown | certificate requested | reviewed/accepted |
| reporting | none | ad hoc | agreed fields/frequency |
| privacy/security | unknown | general policy | contract/control evidence |
| termination/stranded stock | absent | verbal | written exit path |

Gate:

- 18–24: eligible for a controlled pilot subject to legal/insurance review;
- 12–17: discovery only, close missing evidence;
- below 12: do not accept stock or make public partnership claims;
- any score of 0 in authority, data, safety or title: automatic hold regardless of total.

The score is a prioritisation tool, not a certification.

## 8. Pilot handoff agreement

Before a source or partner supplies devices, write a one-page scope containing:

- parties and authorised contacts;
- asset categories and approximate quantity;
- title/ownership and transfer point;
- authority to test, wipe, repair, dismantle, sell, donate or recycle;
- account/lock/MDM responsibilities;
- data classification and sanitisation certificate requirements;
- accepted/rejected battery, CRT, toner and hazardous items;
- pickup, packaging, freight and storage;
- pricing, fee, rebate or donation terms;
- resale/recipient restrictions;
- warranty/return/complaint responsibility;
- reporting, photos and branding permission;
- term, review, termination and stranded-stock treatment;
- governing documents and dispute contact.

No verbal “you can take whatever is useful” arrangement should govern a business, school, charity or government lot.

## 9. Outreach order

### First wave: low-authority friction

- two local repairers;
- three MSPs or small business IT providers;
- two local employers with a known refresh cycle;
- one community/charity recipient partner;
- one approved downstream route.

Ask for a 5–10-item controlled sample, not an indefinite donation stream.

### Second wave: structured institutions

- independent schools and community organisations with asset custodians;
- larger employers and local government procurement contacts;
- national ITADs with formal partner programmes;
- approved auction/liquidation suppliers.

### Third wave: public campaign

Only after the acceptance matrix, storage cap, battery route, data SOP, rejected-item language and pilot metrics pass. Public intake without these controls optimises for volume, not reuse.

## 10. Short outreach script

> I am testing a small Dubbo reuse/refurbishment pathway for clearly authorised laptops, desktops, phones and selected electronics. I am not a general e-waste drop-off point. Could you tell me what retired equipment you handle, who owns it, how disposal authority and data are managed, which categories you reject, and whether a documented 5–10-item pilot with asset IDs, sanitisation records and outcome reporting would be useful? I will not accept locked, unsafe or unauthorised equipment.

The script intentionally asks about the source’s process before offering capacity.

## 11. Repeatability metrics

For each source after every handoff, calculate:

```text
accepted_unit_rate = accepted devices / offered devices
safe_reuse_rate = whole-device reuse / accepted devices
repair_rate = repaired devices / accepted devices
parts_rate = parts route / accepted devices
rejection_rate = refused or returned / offered devices
usable_value_per_source_hour = final contribution / outreach + pickup hours
repeat_interval = days between accepted handoffs
data_exception_rate = data/lock holds / accepted devices
residue_cost_per_unit = downstream costs / accepted devices
```

Keep supply quantity and supply quality separate. Ten mixed boxes may be less valuable than three model-concentrated laptops with clean authority and data records.

## 12. Stop and escalation rules

Stop accepting a source when:

- title or authority becomes unclear;
- the source repeatedly includes prohibited batteries/unsafe items;
- data/lock exceptions exceed the agreed rate;
- rejected material is being shifted to Dubbo eWaste without a route;
- actual pickup/storage/labour cost exceeds the agreed model;
- the source expects undocumented certificates or public claims;
- the partner changes ownership, procurement or downstream terms;
- the operator cannot process existing stock before the storage cap.

Escalate to a written review; do not “make it work” by silently changing the route.

## 13. Open questions remaining after this research

- Which two local repairers will provide a controlled donor lot?
- Which Dubbo/Orana MSPs have recurring refresh cycles and authority to introduce their clients?
- Which independent schools/charities have a lawful asset-disposal route and recipient need?
- What current commercial terms would Greenbox, G1, WV, FlipTech or another ITAD require for a regional pilot?
- Which local buyers can support devices after sale, especially for accessibility or low digital literacy?
- What is the actual repeat supply rate after the first handoff?
- What percentage of offers are safe, authorised and economically processable?
- Which partner will accept residual parts, failed media, batteries and rejected devices under written terms?

These are now call/interview/pilot questions, not reasons to invent a forecast.

## 14. Sources consulted

- [NSW Department of Education: Technology in schools procedures](https://education.nsw.gov.au/policy-library/policies/pd-2024-0481-01)
- [NSW Department of Education: school eWaste process](https://education.nsw.gov.au/teaching-and-learning/technology-for-learning/news-t4l/2025/issue122)
- [NSW ICT End User Devices and Services Contract](https://www.info.buy.nsw.gov.au/contracts/ict-end-user-devices-and-services)
- [NSW Supplier Hub](https://buy.nsw.gov.au/suppliers/find-opportunities)
- [NSW ICT and digital procurement](https://buy.nsw.gov.au/categories/ict)
- [NSW Waste Management Contract](https://buy.nsw.gov.au/contracts/waste-management)
- [ITC Asset Management Buy NSW profile](https://buy.nsw.gov.au/supplier/profile/89282)
- [Good360 Digital Access Report](https://good360.org.au/wp-content/uploads/2025/01/Good360_Digital_Access_Report_2025.pdf)
- [Research 01: front-door triage](RESEARCH-01-FRONT-DOOR-TRIAGE.md)
- [Research 04: resale pricing and returns](RESEARCH-04-RESALE-PRICING-CHANNELS-RETURNS.md)
- [Research 05: data, identity and privacy](RESEARCH-05-DATA-IDENTITY-PRIVACY-SOP.md)

This is a validation and outreach framework, not a partnership, procurement, legal, tax, privacy or insurance commitment.
