# Dubbo Repair Café local repairer referral directory — 10 October 2026

## Purpose and scope
An evidence-linked **first-pass** volunteer directory, built into `EwasteApp` at `/repair-cafe-volunteers/referrals`. It is a **referral leads directory**, not a certification, recommendation or partner registry. As of 10 October 2026 it contains **59 business/outlet records**, including **20 with a primary-business/organisation source** and **39 supported only by an online listing**. **1** are located in nearby towns (Geurie).

## Method
Public web research and local-business searches across computer/device repair, appliance specialists, textile and footwear repairs, upholstery/furniture, bikes and mobility equipment, tool and small-engine repairs, musical instruments, jewellery, glass and locksmiths, and vehicle / caravan services.

Each record has:
- specific equipment/services (with questions to ask where exact repair scope remains unclear);
- public business location, phone, email where found;
- source URL and classification as primary-source or listing-only;
- locality and a stable row identifier.

Business sources were checked online, **not** by phoning businesses. Missing fields are deliberately omitted. Online listings and primary websites can become stale.

## Data quality and exclusions
- Cases Indulgence appears twice because two distinct Dubbo shopfronts were identified.
- One Macquarie Appliance Repair row covers listings describing Macquarie Appliances at another address and the same public phone; contact them to confirm the current location.
- Some broader businesses, including spare-parts retailers, may only act as referral or parts suppliers. Ask about repairs before sending a visitor.
- The historical 'Techy/Experimax' listing for Orana Mall was **not** counted separately from Tech Savvy given possible legacy branding; verify before considering a separate repairer.
- Automotive repairs are included in a distinct lower-priority category for breadth; these are not suitable for pop-up community work.
- No independent audits of trades licences, insurance, workmanship, prices, availability or warranties were carried out. Do not infer authorisation/endorsement.
- Contact details are publicly advertised business contacts only. No private volunteers or customer details are included.

## Next verification pass
1. Call the most relevant 20 repairers and verify current trading status, address, repair scope, diagnostic charge and willingness to receive referrals.
2. Get consent before listing **partnership** status (do not mark anyone as a Repair Café partner without confirmation).
3. Investigate under-covered categories separately: sewing-machine services, vintage radios, cameras, clocks, toys and dolls, luggage, tents and camping gear, scooters and e-bike batteries, coffee machines and vacuum cleaners, agricultural electronics, general mechanics and independent small home-based repairers.
4. Confirm any safety-regulated trade credentials through relevant NSW regulatory bodies before providing advice.
5. Review the directory quarterly; remove or archive businesses confirmed closed.

## How to update
Source of truth: `EwasteApp/lib/repair-cafe/local-repairers.ts`. Add/update a single typed record with a source URL, rerun typecheck/QA, commit and deliberately deploy `EwasteApp` (automatic Git deployments are disabled). The volunteers' filtered search reads these records at build/runtime.

Spreadsheet-friendly dataset: `docs/REPAIR-CAFE-DUBBO-LOCAL-REPAIRERS-2026-10-10.csv`.

**Safety:** Repair Café volunteers do not perform specialist electrical, refrigerant, gas or structural work without relevant competence/licences and an approved event safety process. Record a referral only with visitor consent; protect personal data.
