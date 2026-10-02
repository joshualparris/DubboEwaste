# Supabase migration guide

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
12. `009_sanitisation_diagnostics_integrations.sql`

This list documents intent; it is **not yet a fresh-install guarantee**.

## Recommended cleanup

Create a tested baseline migration from the current production schema, then keep future migrations timestamped or strictly monotonic. Once that baseline is verified:

- move these development-era SQL files to a migration-history/archive directory;
- add a clean-schema CI test;
- stop manually applying untracked production SQL.

Until then, do not rename or reorder these files merely to make the directory look tidy: doing so could obscure the actual development history.
