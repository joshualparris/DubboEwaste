# Open Repair Alliance July 2025 import verification

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **9 October 2026 documentation reconciliation:** **Rechecked 9 October 2026:** live Supabase contained **305,649** historical Open Repair Alliance records during this documentation review. This verifies table population, not correctness of every mapping, quality of a search result or that a given item can be repaired safely. Source records are historical observational outcomes, **not repair instructions**. See [documentation index](DOCUMENTATION-INVENTORY-AND-FRESHNESS-2026-10-09.md).


**Date:** 9 October 2026  
**Target:** DubboEwaste Supabase, `public.repair_cafe_open_repair_data`  
**Status:** Full live import **verified complete**.

## Provenance

- User supplied `OpenRepairData_v0.3_aggregate_202507.zip`.
- Contained `202507/aggregate/OpenRepairData_v0.3_aggregate_202507.csv`, **58,453,790 bytes**.
- CSV inside ZIP has Git object SHA-1 **`74c911c383dd69c8be532283cd39de88db4a55a4`**, identical to the official published CSV at `https://github.com/openrepair/data/blob/master/aggregated/202507/OpenRepairData_v0.3_aggregate_202507.csv`. This provides byte-for-byte source matching without transferring the user's uploaded ZIP into the deployment.
- Source and rights: Open Repair Alliance, Open Repair Data Standard v0.3, July 2025, **CC BY-SA 4.0**. Preserve attribution when reusing/exporting records.

## Import and reconciliation

Imported in 16 separately completed ranges, each acknowledged with HTTP 200. The final range imported 15,649 records and reported `rowsSeen=305649`.

| Validation | Source ZIP | Live Supabase |
|---|---:|---:|
| Total rows | 305,649 | 305,649 |
| Unique IDs | 305,649 | 305,649 |
| Fixed | 165,144 | 165,144 |
| End of life | 77,709 | 77,709 |
| Repairable | 54,049 | 54,049 |
| Unknown | 8,747 | 8,747 |

Source metadata is retained per record (`source_id`, `dataset_version`, `source_license`). The database grants authenticated, Repair Café programme-scoped **read-only** access; no anonymous browsing of the internal dataset.

The temporary authenticated bulk-import service was **retired** after successful completion: its replacement returns HTTP 410 and requires valid JWT. No public upload endpoint remains open.

## App use

Private knowledge page: `/repair-cafe-volunteers/knowledge`. Search Open Repair Alliance records by product category, product description, brand and reported problem, using the indexed full-text RPC `repair_cafe_search_open_repair`. The function retains authenticated programme access and caps results at 50.

**Important data limitation:** the source CSV contains *no separate manufacturer model or repair instructions* columns. The imported `model` is empty, rather than invented. The `problem` field is the reported problem, not a verified solution; `repair_status` indicates observed outcome only. ORA results must never be mistaken for certified repair guides.

The existing local curated repair lessons, private event tickets, iFixit guide suggestions and Restarters Wiki search remain separate sources.

## Operational considerations

- Do not combine ORA source counts with Dubbo's own repair-impact totals.
- External content may include inaccurate, unsafe or sensitive free-text descriptions; display as user-reported historical evidence, not safety advice.
- Future refresh should use an intentional, audited import with source/version and rights checks, not an always-on public write endpoint.
- If search yields no hits, use broader terms. Full-text searches can match terms across the brand, category and problem fields.

Verified by a direct live row count, distinct-ID count and outcome group totals on 9 October 2026.
