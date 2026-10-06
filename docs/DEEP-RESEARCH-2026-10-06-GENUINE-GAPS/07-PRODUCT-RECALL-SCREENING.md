# 07 — Product-recall screening for refurbished electronics

**Questions answered:** 22–23  
**Research date:** 6 October 2026

## 22. Which recall sources matter?

### Primary Australian source

**ACCC Product Safety Australia — Search consumer product recalls**

https://www.productsafety.gov.au/recalls

At the time of research, its taxonomy showed more than:

- **120 computer/laptop/accessory recalls**;
- **80 lithium-ion battery recalls**;
- hundreds of power-supply/storage recalls.

Counts change as the database updates.

The database supports full-text/date/topic search and should be treated as the Australian primary recall source.

### Manufacturer sources

After Product Safety Australia, check the manufacturer's Australian/global recall/security advisory page where a model or battery family has a potential match.

Manufacturer source is particularly important for serial/date-range eligibility.

### Example showing why model-only screening is insufficient

HP's extended notebook-battery recall affected batteries installed in a range of laptops and separately purchased replacement batteries; eligibility depended on the battery/model program rather than simply “all HP laptops”.

Source:
https://www.productsafety.gov.au/search-consumer-product-recalls/internal-battery-for-hp-laptop-computers-extended-recall

## ACCC makes second-hand relevance explicit

Current ACCC recall guidance says suppliers should:

- identify affected product name/model/serial/batch/production date;
- stop sale/import/advertising;
- keep good records;
- plan how to recall products **sold second-hand**;
- include products containing a **recalled part**.

Source:
https://www.productsafety.gov.au/business/recall-an-unsafe-product/recall-tools-and-guidelines/supplier-checklist-for-conducting-a-recall

This turns recall checking from a “nice extra” into an important resale-control process.

## 23. Proposed AssetFlow/intake workflow

### Status field

`recall_status`:

- NOT_CHECKED
- NO_MATCH_FOUND
- POSSIBLE_MATCH
- CONFIRMED_AFFECTED
- REMEDIED
- NOT_APPLICABLE

Additional fields:

- checked_at
- checked_by
- source_url
- recall_title/reference
- component involved
- matching basis: model / serial / batch / date / battery PN
- remedy
- evidence file/reference
- next review

### Gate

**No retail/reuse release unless recall status is NO_MATCH_FOUND, REMEDIED or NOT_APPLICABLE.**

A possible match = HOLD.

### Intake procedure

1. identify exact model;
2. identify battery/adapter part number where accessible safely;
3. search Product Safety Australia for manufacturer + model/family;
4. search manufacturer recall/advisory site if relevant;
5. compare exact serial/date/part criteria;
6. record evidence URL/date;
7. route:
   - clear → continue;
   - possible → hold/investigate;
   - affected → stop sale and follow official remedy.

### Re-check points

- intake;
- after installing a replacement safety-critical part;
- immediately before listing if stock has aged significantly;
- when notified of a new recall;
- periodically for long-held inventory.

## Recall management after sale

If Dubbo ITAD supplied an item later found affected:

1. identify sold asset/customer from sale record;
2. stop sale of similar stock;
3. determine whether Dubbo ITAD or upstream supplier/manufacturer is recall lead;
4. contact affected buyers where appropriate;
5. follow official remedy;
6. preserve communications/outcomes.

If Dubbo ITAD itself initiates a recall action, current ACCC guidance can require notification to the ACCC within 2 days.

Source:
https://www.productsafety.gov.au/business/recall-an-unsafe-product/tell-the-accc-of-the-recall

## Automation boundary

Do **not** silently declare “no recall” from an AI/model-name match.

The final result must tie to:

- the authoritative recall source;
- exact matching criteria;
- operator evidence.

An automated search can create a POSSIBLE_MATCH queue, but release should remain human-reviewed.
