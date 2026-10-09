# Dubbo Repair Café local repairer referral directory — 10 October 2026

## Purpose and scope
An evidence-linked **first-pass** volunteer directory, built into `EwasteApp` at `/repair-cafe-volunteers/referrals`. It is a **referral leads directory**, not a certification, recommendation or partner registry. As of 10 October 2026, after a second research pass, it contains **101 business/outlet records**, including **44 with business/primary-source evidence** and **57 supported only by an online listing**. **1** are located in nearby towns (Geurie).

## Method
Public web research and local-business searches across computer/device repair, appliance specialists, textile and footwear repairs, upholstery/furniture, bikes and mobility equipment, tool and small-engine repairs, musical instruments, jewellery, glass and locksmiths, and vehicle / caravan services.

Each record has:
- specific equipment/services (with questions to ask where exact repair scope remains unclear);
- public business location, phone, email where found;
- source URL and classification as primary-source or listing-only;
- locality and a stable row identifier.

Business sources were checked online, **not** by phoning businesses. Missing fields are deliberately omitted. Online listings and primary websites can become stale.

## Second-pass additions (10 October 2026)

**42 new non-duplicate directory leads** were added, broadening the previous 59 to **101** (24 new business/primary-source records, 18 new third-party/listing leads). Source URLs appear on every record, and the updated CSV has all 101.

New categories and examples:
- Computer and phone: Custom Computer Creations, Orana Business Solutions (printers), Viatek, Right Click Go, Revelation I.T., Tech Exe, Nova Computers, Cracked Your iDevice, Wellington Computer Services.
- Sewing, fabric, leather: Dubbo Stitching Studio, Saddler & Co, Western Tarps and Motor Trimming; three directory-only alterations businesses, and Charlie's sewing-machine repair lead.
- Spectacles / musical: Burgun & Williams spectacle frame repair, Music Lounge piano-repair listing (service to be confirmed).
- Garden and machinery: M.M & Mechanical, Dubbo Machinery Service, Michell Machinery, AquaWest, JME generator/welder repair.
- Welding, fabrication and hydraulic/diesel: DND Welding, Agriweld Engineering, WF Industries, RJM Fabrications, Rust and Dust, Iron Earth, Logical Hydraulics, diesel and hydraulic specialists, Narromine's Walkerbout Welding.
- Home and regulated trades: Byrnes Doors, Western Garage Doors, SCR Electrical, Williams Oriel, Jordan Wheatland, Forever Electrical.

**Source-validation note:** "official" means a business/operator website or primary institutional listing describes the service. It does **not** mean the business has been contacted, inspected, licence-checked or agreed to be a referral partner. "listing" entries are more tentative: some are based on historic directories; for example Charlie's Sewing Machines and several alteration listings **must be called to establish whether they still trade**. Two repair leads in nearby towns (Wellington and Narromine) were intentionally included as regional options.

Excluded probable duplicates: Techy Experimax at the existing Tech Savvy address; Orana Mobility Solutions as an apparent renamed/parallel listing for existing Orana Disability Sales & Service; Vivid Shade Solutions associated with the same published ABN and workshop address as Western Tarps (not counted as a separate repairer). These should be individually validated before treating them as distinct businesses.

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
