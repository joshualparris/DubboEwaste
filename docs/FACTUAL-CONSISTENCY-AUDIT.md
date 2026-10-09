# Factual Consistency Audit — 2 Oct 2026

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **Precedence updated 9 October 2026:** For product implementation and production deployment, [live features & verification](LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md) supersedes 2 October notes; for physical business gates [CURRENT-STATE](CURRENT-STATE.md) remains authoritative. The legal, sourcing and market assertions below are dated research and require fresh official-source verification. Do not confuse newer source code with confirmed partner approval.


**Scope:** whole-repo cross-check of recurring claims after the Agy/Claude/ChatGPT research passes. Historical research files are preserved, but this document records which newer position wins when files disagree.

## Canonical precedence
1. `docs/CURRENT-STATE.md`
2. `docs/RESEARCH-INDEX.md` and the newer topic-specific canonical docs
3. `claudeDOCS/` 68-question research series
4. older BACKLOG/RESEARCH files as evidence/history
5. `agyDOCS/` only as legacy/provenance

## Contradictions and resolutions

### Windows 11 / AMD
**Old simplification:** “Ryzen 2000+” for all systems.  
**Current resolution:** Ryzen 2000 desktop can be supported; mobile Ryzen support begins later in the official list. Always check exact CPU.  
**Canonical:** `claudeDOCS/A-TRIAGE-SPECS-LOCKS.md`, `data/model-support-lookup.csv`.

### RAM / battery thresholds
**Old wording:** 8 GB and >80% battery presented as universal industry minimums.  
**Current resolution:** these are internal policy/reporting thresholds unless a marketplace/operator publishes its own rule.  
**Canonical:** `docs/DUBBOEWASTE-GRADING-STANDARD.md`.

### Lithium shipping
**Old wording:** universal Road Transport Only / detached-battery advice.  
**Current resolution:** carrier + service + battery configuration specific. Damaged/recalled batteries are not normal parcel items.  
**Canonical:** `docs/AU-SHIPPING-MATRIX.md`.

### eBay fees
**Old wording:** private-vs-business distinction and blanket ~13% fee assumptions.  
**Current resolution:** current Australian fee treatment depends on sales threshold/account plan and can change. Do not infer Pro fees merely from business registration.  
**Canonical:** `claudeDOCS/B-PRICING-VALUATION.md`, `docs/RESALE-CHANNEL-MATRIX.md`.

### Facebook Marketplace shipping
**Old wording:** integrated national checkout/shipping described as available in Australia.  
**Current resolution:** not a verified Australian feature; Phase 0 treats Facebook as local-first unless Meta publishes current AU availability.  
**Canonical:** `docs/RESALE-CHANNEL-MATRIX.md`.

### Gumtree
**Old wording:** fixed/current fee claims.  
**Current resolution:** Gumtree's own pages have changed/conflicted; verify the live flow at time of sale.  
**Canonical:** `claudeDOCS/B-PRICING-VALUATION.md`.

### iFixit MasterTech
**Old wording:** current certification pathway.  
**Current resolution:** not available for new candidates; do not include in active learning plan.  
**Canonical:** `docs/LEARNING-CURRICULUM.md`.

### TAFE UEE30920
**Old wording:** practical short electronics/microsoldering course.  
**Current resolution:** long trade qualification requiring relevant employment/apprenticeship context; not Phase 0 default.  
**Canonical:** `claudeDOCS/D-LEARNING-AND-ELECTRICAL-LAW.md`.

### OCAU
**Old wording:** 90 days + 100 posts + ISP email.  
**Current resolution:** >90-day membership is supported by OCAU material; 100-post requirement was not verified.  
**Canonical:** `docs/AU-COMMUNITY-RULES.md`.

### eWaste Ben / unverified podcasts
**Old wording:** confident biographies/descriptions without verification.  
**Current resolution:** removed from Agy operational recommendations; use canonical podcast file.  
**Canonical:** `docs/PODCASTS-CANONICAL.md`.

### Fliptech / Sircel / other operator internals
**Old wording:** generic ERP/grading/pricing/chain-of-custody practices blended into named-company descriptions.  
**Current resolution:** attribute only practices actually documented by the operator. Generic workflow remains generic.  
**Canonical:** `claudeDOCS/F-FLIPTECH-PEERS-OPERATIONS.md`.

### Sircel status
**Old wording:** stable operating benchmark without qualification.  
**Current resolution:** operations continued under receivership/administration from late 2025; final sale/exit from administration not verified.  
**Canonical:** `docs/RESEARCH-DELTA-2026-10-02.md`.

### AMR Dubbo downstream
**Old inference risk:** Sircel/ACE treated as likely actual recipient.  
**Current resolution:** candidates only; exact downstream processor remains unverified.  
**Canonical:** `docs/AMR-DUBBO-DOWNSTREAM-FORENSIC.md`, `docs/CURRENT-STATE.md`.

### NSW Education e-waste
**Old gap:** whether a dedicated vendor/process exists.  
**Current resolution:** Department publicly confirms a dedicated eWaste contract, but vendor name is not public in the material found.  
**Canonical:** `docs/RESEARCH-DELTA-2026-10-02.md`.

### Electrical safety / test-and-tag
**Old risk:** some files imply a blanket test/tag rule.  
**Current resolution:** exact NSW second-hand resale requirement is unresolved; seek written regulator guidance.  
**Canonical:** `docs/EXTERNAL-CONFIRMATION-PACK.md`.

### Planning
**Old risk:** assuming low scale automatically means exempt home business.  
**Current resolution:** floor area/amenity rules help, but exact property/use classification remains a written-Council gate.  
**Canonical:** `docs/CURRENT-STATE.md`.

## Historical-file policy
Older files are not deleted because they preserve research trails and sources. If a historical file contradicts this audit or a canonical document, **do not silently average the two positions**. Use the newer canonical conclusion and recheck the underlying primary source if the decision matters operationally.
