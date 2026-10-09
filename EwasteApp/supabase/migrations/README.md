# Supabase migration guide

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **9 October 2026 live migration warning:** The Repair Café has many additive migrations (events/venues/rosters, manual volunteers, canonical tickets/stations/history, incident and audit, notification outbox, archive/restore, knowledge, offline sync, QR, station dispatch, training and waitlist additions). The production Supabase migration history does **not** automatically match filename timestamps; some migrations were applied under different Supabase-generated versions. Do **not** run all `.sql` files alphabetically in production or assume the late 20261009 waitlist/training/feedback migrations are applied merely because the files exist. Compare deployed migration history against repository SQL; check dependencies, RLS, functions and triggers in the actual environment; prefer tested incremental migrations. Legacy duplicate ticket tables are not the operational write path. See [live feature verification](../../../docs/LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md).


The SQL files in this directory reflect how the schema evolved during rapid AssetFlow development.

## Important: numbering is historical, not a reliable execution order

There are duplicate numeric prefixes:

- `002_access_code_signup.sql`
- `002_model_support.sql`
- `007_admin_permissions.sql`
- `007_assetflow_internal_automation.sql`

Do **not** sort these filenames lexicographically and assume that is a safe fresh-install migration plan.

The live Supabase project has also had some changes applied directly through SQL during development, so the repository should be treated as schema history until a clean baseline migration is generated and tested from an empty project.

## Current intended logical order

1. `001_initial.sql`
2. `002_access_code_signup.sql`
3. `002_model_support.sql`
4. `003_lookup_events.sql`
5. `004_assetflow_p0.sql`
6. `005_assetflow_p0_p1_core_entities.sql`
7. `006_assetflow_certificate_verification_and_integrations.sql`
8. `007_assetflow_internal_automation.sql`
9. `007_admin_permissions.sql`
10. `008_assetflow_crm.sql`
11. `009_assetflow_crm_sales.sql`
12. `009_sanitisation_diagnostics_integrations.sql`\n13. `010_operational_documents.sql`\n14. `011_crm_completion.sql`
15. `012_job_submission_idempotency.sql`
16. `013_field_validation.sql`

This list documents intent; it is **not yet a fresh-install guarantee**.

## Recommended cleanup

Create a tested baseline migration from the current production schema, then keep future migrations timestamped or strictly monotonic. Once that baseline is verified:

- move these development-era SQL files to a migration-history/archive directory;
- add a clean-schema CI test;
- stop manually applying untracked production SQL.

Until then, do not rename or reorder these files merely to make the directory look tidy: doing so could obscure the actual development history.
