# Deep research — 31 genuine gaps

**Research date:** 6 October 2026 (AEDT)  
**Scope:** 31 questions deliberately selected only after a repo-wide duplication check.  
**Evidence rule:** prefer Australian primary/regulator/government sources; use vendor/operator material only for operational examples. Estimates are labelled as scenarios, not facts.

This research deliberately does **not** duplicate the mature repo work on NSW Education e-waste, AMR downstream forensics, Dubbo schools/SMEs, general Repair Café setup, NIST sanitisation, the Australian carrier matrix, Device Bank/Good360, or the 25-product ITAD software benchmark.

## Executive findings

1. **Dubbo has a large enough computer-use base to justify a bounded repair/refurb market test**, but no public dataset measures local laptop ownership or annual repair demand directly. A defensible LGA adult-laptop-user planning range is roughly **27,800–30,300** using 2021 LGA age counts plus 2024 regional / 2025 national ACMA laptop-use rates. It is a scenario, not a device count.
2. **Government entry is easier at small scale than “win a statewide tender”.** NSW permits direct purchase from a regional business up to $150k and from an SME up to $250k for non-construction goods/services, subject to applicable rules. Supplier Hub, VendorPanel and subcontracting are realistic entry routes.
3. **Second-hand tax treatment is materially more nuanced than the old repo summary.** GST Division 66 can allow credits for eligible second-hand goods acquired from unregistered sellers for resale; special global accounting rules matter when goods are divided into parts. ITAA 1997 s70-30 also has explicit rules for putting personally owned/free-acquired property into trading stock.
4. **Secure logistics should be an explicit workflow, not “put laptops in the car”.** NSW contract 9826 requires customer consent before offsite disposal and supports audit of contractor/third-party sites. OAIC and ASD guidance support movement records, controlled access, manifests and tamper evidence.
5. **AssetFlow has a credible app-security foundation but lacks a documented cyber baseline.** Supabase Auth/RLS/audit controls exist, while MFA evidence, tested production backup/restore, formal secrets/key rotation and incident-response testing remain weak or absent in repo evidence.
6. **Chargers are a bigger compliance issue than laptop batteries.** Extra-low-voltage battery-powered equipment is outside current EESS scope, but household/personal power supplies/chargers are specifically in-scope and can be Level 3. Importing generic chargers is a very different risk from buying compliant stock from an Australian registered supplier.
7. **Recall screening deserves a formal intake/release gate.** Product Safety Australia currently contains 100+ computer/laptop-accessory recalls and dozens of lithium-battery recalls. ACCC guidance expressly says recall plans must cover second-hand goods and products containing a recalled part.
8. **Australia has a usable repair-parts ecosystem.** EMPR provides authorised genuine parts for major business brands; iFixit AU and specialist screen/parts suppliers create alternative channels. Dubbo should keep universal/fast-moving parts only and order model-specific batteries/screens on demand.
9. **The Repair Café should begin under an independent community host/auspice if possible.** A new NSW incorporated association is possible but brings committee, membership and reporting overhead. The strongest conflict-control design keeps money, stock, tools, grants and referrals separate from Dubbo ITAD.
10. **Reuse has real environmental value, but carbon claims need disciplined accounting.** LCA evidence strongly supports life extension; manufacturer product-carbon footprints show production is often the dominant phase. ACCC guidance means Dubbo ITAD should report measured mass/device outcomes first and only make CO2e claims under a documented model and substitution assumption.
11. **Australia still has no general electronics “right to repair” law equivalent to the motor-vehicle scheme.** Consumer guarantees require reasonable availability of parts/repair facilities unless disclosed otherwise, but the broader 2021 Productivity Commission recommendations have not become a universal electronics repair-information regime.

## The 31 questions

### A. Local market size
1. How many Dubbo Regional adults plausibly use laptops/desktops?
2. What is the plausible organisational endpoint base?
3. What annual replacement/failure volume is defensible?
4. What is a realistic addressable low-cost repair/refurbishment market?

→ [01-DUBBO-MARKET-SIZE.md](01-DUBBO-MARKET-SIZE.md)

### B. Procurement access
5. Which procurement portals/panels matter?
6. What registration/evidence is required?
7. Which thresholds/preferences favour SMEs/regional/local suppliers?
8. How can a tiny operator enter through direct procurement or subcontracting?

→ [02-PROCUREMENT-ENTRY.md](02-PROCUREMENT-ENTRY.md)

### C. Tax/accounting
9. How does GST Division 66 apply to eligible second-hand goods?
10. How should free/donated and personally owned stock be treated?
11. How do trading stock, dismantling/parts and scrap interact?
12. What changes when devices are donated to a charity/DGR?

→ [03-TAX-AND-ACCOUNTING.md](03-TAX-AND-ACCOUNTING.md)

### D. Secure transport
13. What physical controls are appropriate in transit?
14. What should a chain-of-custody transport record contain?
15. What is a proportionate Phase 0 regional-Dubbo transport model?

→ [04-SECURE-TRANSPORT.md](04-SECURE-TRANSPORT.md)

### E. Cybersecurity
16. What cyber baseline is appropriate?
17. What Privacy Act/NDB issues can apply to customer devices?
18. What are the current AssetFlow security gaps?

→ [05-CYBERSECURITY-ASSETFLOW.md](05-CYBERSECURITY-ASSETFLOW.md)

### F. Batteries / chargers / replacement parts
19. What electrical-safety position applies to replacement batteries?
20. What EESS/RCM position applies to chargers/power supplies?
21. What evidence should Dubbo ITAD demand from parts suppliers?

→ [06-BATTERY-CHARGER-PARTS-COMPLIANCE.md](06-BATTERY-CHARGER-PARTS-COMPLIANCE.md)

### G. Product recalls
22. Which recall sources matter?
23. How should recall screening work in AssetFlow/intake/resale?

→ [07-PRODUCT-RECALL-SCREENING.md](07-PRODUCT-RECALL-SCREENING.md)

### H. Parts supply
24. Which Australian suppliers cover the common repair categories?
25. How should genuine/OEM vs aftermarket quality risk be handled?
26. What stocking/freight model makes sense in Dubbo?

→ [08-AUSTRALIAN-REPAIR-PARTS-SUPPLY.md](08-AUSTRALIAN-REPAIR-PARTS-SUPPLY.md)

### I. Repair Café governance
27. What legal/governance structures are realistic?
28. How should insurance/funding/conflict separation from Dubbo ITAD work?

→ [09-REPAIR-CAFE-GOVERNANCE.md](09-REPAIR-CAFE-GOVERNANCE.md)

### J. Environmental impact / green claims
29. What does LCA evidence support about computer reuse?
30. What environmental claims can Dubbo ITAD safely make?

→ [10-ENVIRONMENTAL-IMPACT-GREEN-CLAIMS.md](10-ENVIRONMENTAL-IMPACT-GREEN-CLAIMS.md)

### K. Right to repair
31. What is the Australian electronics right-to-repair position in October 2026?

→ [11-AUSTRALIAN-RIGHT-TO-REPAIR-2026.md](11-AUSTRALIAN-RIGHT-TO-REPAIR-2026.md)

## What remains real-world-only after this pass

This pack does not close:

- accountant/tax advice for the actual entity and GST status;
- a Council procurement award or customer agreement;
- insurer coverage;
- a Repair Café host/auspice agreement;
- actual local repair demand, conversion, sale-through or failure rate;
- real production backup/restore tests;
- legal advice on borderline Privacy Act, product-safety or electrical-equipment cases;
- supplier-specific compliance evidence for any exact aftermarket charger/battery;
- measured carbon savings from actual pilot assets.

That is intentional. The purpose is to move every question as far as defensible online research can take it, then identify the smallest real-world test that closes the rest.
