# Research Gaps & Unexplored Opportunities (agyGAPS)

This document outlines new research opportunities and operational gaps not yet fully covered in the existing documentation. The current research heavily focuses on downstream processing, legal/council compliance, and licensing. The following areas represent the next critical phase of research to ensure the business doesn't become a dumping ground for worthless junk.

## 1. Triage Skills & Avoidance of "Junk"

Currently, there is no documented Standard Operating Procedure (SOP) for front-of-house triage. To avoid taking on junk that costs money to dispose of, we need to research and define:

- **Visual Inspection Protocols:** What are the immediate red flags for a device (e.g., swollen batteries, heavy liquid damage indicators, vintage vs. obsolete age cutoffs)?
- **Component Value Thresholds:** At what point is a device worth more in parts than whole? (e.g., minimum RAM size, CPU generation cutoffs).
- **Testing Software/Hardware:** What are the industry-standard USB bootable diagnostic tools used by refurbishers (e.g., PC-Doctor, Eurosoft, MemTest86, smartmontools) for rapid triage at the door?
- **Battery Health Assessment:** How to quickly test battery cycle counts and health on laptops/phones before accepting them (e.g., CoconutBattery, 3uTools).
- **Apple/Android Activation Locks:** Strict procedures for identifying and rejecting iCloud-locked, MDM-locked, or Google FRP-locked devices, which are essentially bricks.

**Actionable Gap:** We need a one-page "Triage Matrix" or checklist that a minimally trained staff member can use to say "Yes" or "No" to a donation within 60 seconds.

## 2. Educational Resources: Courses, Podcasts, and Videos

While there is some podcast research (`SPOTIFY-PODCASTS.md`), it seems focused on industry news and Australian ITAD companies. We need practical, hands-on learning resources for the refurbishment and reselling side:

- **Online Courses (Repair & Refurbishment):**
  - *iFixit Technical Training:* Look into iFixit's commercial repair programs or free guides.
  - *CompTIA A+:* The foundational hardware skills needed for PC/laptop repair. Does the operator need this, or just practical experience?
  - *Udemy/Coursera:* Look for courses specifically on "Smartphone Repair", "Motherboard Micro-soldering" (if getting advanced), and "IT Asset Disposition (ITAD) Fundamentals".
- **YouTube Channels (Flipping, Repair, e-Waste):**
  - *Hugh Jeffreys:* Excellent Australian creator focusing on repairing, un-bricking, and restoring e-waste phones and laptops.
  - *eWaste Ben:* Australian e-waste scrapper/recycler; great for understanding the scrap value of boards, gold recovery, and tear-downs.
  - *Tech Yes City:* Australian PC builder who frequently buys used parts and flips them; great for market pricing on used PC components.
  - *NorthridgeFix / Louis Rossmann:* For understanding board-level repair and what makes a device "unrepairable" vs "easily fixable".
- **Podcasts/Communities:**
  - Finding niche Discord communities or subreddits (e.g., `r/Flipping`, `r/hardwareSwap`, `r/eWaste`) for real-time pricing and triage advice.

**Actionable Gap:** Compile a "Learning Path" curriculum for the founder/staff, ranging from beginner triage to advanced parts harvesting.

## 3. Deep Dive into Competitor Operations (Fliptech & Others)

The current research on Fliptech and others (Sircel, PonyUp) establishes *that* they exist and their high-level business models, but not the *mechanics* of how they operate on the floor.

- **Intake Mechanics:** How exactly do companies like Fliptech receive gear? Do they use specific bins, pallets, or cages? How is chain-of-custody tracked from the moment it hits the dock?
- **Data Sanitization Tooling:** What exact software are they using? (e.g., Blancco, KillDisk, PartedMagic). How do they print and attach the certificates of destruction to the physical devices?
- **Grading Systems:** How do they grade cosmetics? (e.g., A/B/C/D grading). We need to adopt a standard grading system for resale listings to manage buyer expectations.
- **Inventory Management Software:** What CRM/Inventory systems do these ITADs use to track a laptop from intake -> wipe -> repair -> parts/resale? (e.g., Makor ERP, RazorERP, or bespoke solutions).
- **Pricing Algorithms:** How do they determine the market value of a refurbished item vs. its parts? Do they use automated eBay scrapers or static price lists?

**Actionable Gap:** We need to research the *software stack* and *physical workflow* of a successful ITAD facility, not just their corporate structure or downstream partners. 

## 4. Market and Sales Channels (The "Flipping" Side)

- **Platform Economics:** Deep dive into the exact fee structures of eBay vs. Facebook Marketplace vs. Gumtree vs. a dedicated Shopify store.
- **Shipping Logistics:** How to safely pack monitors, laptops, and batteries for Australia Post or couriers without damage, and what those average shipping costs are.
- **Warranties and Returns:** What are the legal obligations for warranties on refurbished electronics in NSW/Australia, and how do we price in return rates?

