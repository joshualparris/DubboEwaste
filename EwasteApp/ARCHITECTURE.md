# EwasteApp architecture

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **Architecture update, 9 October 2026:** The title below is historical as a first-slice design. The live `EwasteApp/` now combines **private and selected public Next.js routes**, Supabase Auth/Postgres/RLS, three programme scopes, AssetFlow core entities, separate Library of Things lending records, Repair Café `repair_cafe_tickets` (canonical), `repair_cafe_stations`, `repair_cafe_ticket_activity`, rostering, learning and reporting. The legacy `repair_cafe_visits` / `repair_cafe_repair_tickets` are **not** another active ticket workflow. See [current feature register](../docs/LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md). Proposed future tables below should not be assumed missing or unapplied without inspecting the real schema.


## Product boundary

The existing GitHub Pages site remains public research/training.

`EwasteApp/` is the private operational system.

### Public site may contain
- training material
- research
- public service descriptions
- non-sensitive impact summaries

### Private app may contain
- supplier/customer contact details
- serials/IMEIs tied to people/businesses
- ownership declarations
- chain-of-custody
- wipe/diagnostic records
- internal prices/margins
- staff actions
- buyer contacts and recall traceability

Private operational data must never be committed to Git.

## First-slice data model

```text
auth.users
   |
profiles
   |
   +---- assets ---- asset_events
```

Asset event history is intentionally append-oriented so later triage, sanitisation, diagnostics, repairs, listing and sale transitions can use the same audit chain.

## Role model

| Role | Intended access |
|---|---|
| admin | all application/admin functions |
| manager | operations, finance, reports; no auth administration by default |
| technician | intake, diagnostics, wipe, repair |
| volunteer | controlled operational tasks |
| auditor | read-only records/reports |

RLS is mandatory even when UI navigation also hides restricted functions.

## Planned next data tables

- organisations / suppliers
- contacts
- intake declarations
- triage sessions + answers
- diagnostics
- storage media + sanitisation jobs
- repair jobs + parts
- model support catalogue
- prices / market observations
- listings / sales / returns
- downstream dispositions
- documents / generated certificates
- recalls
- settings / policy versions\n- editable operations library (repo-seeded documents with private working overrides)

## Security rules

- Supabase service-role key must never enter browser code.
- Deployment secrets live in Vercel/Supabase environment settings.
- Public sign-up stays disabled.
- RLS remains enabled on every private table.
- High-risk actions need explicit roles.
- Soft deletion/archiving is preferred over silent destructive deletion for operational records.
- Customer/supplier personal data should be minimised to what operations, warranty, legal or recall needs justify.


## Programme access

Authentication is shared across Dubbo E-waste, Dubbo Library of Things and Dubbo Repair Café. Each membership in `public.program_access` has its own `programme_role` and active flag. The legacy profile `admin` role is explicitly global; programme admins keep ordinary profile roles and receive an admin membership only for their programme.

An untrusted programme request header selects the working area; database helpers always validate it against active profile/membership records. The selector cookie conveys context only and never grants authority. Global admins can select `all`; other users cannot. SQL RLS applies restrictive programme and module gates to operational rows. Related FK and polymorphic attachments must have matching programmes. Evidence storage reads and uploads validate the same entity scope.

Signup codes are verified inside the database and only create volunteer membership in the matched programme. New programme assignments use trusted app metadata established by the signup trigger, never user-editable metadata for authorization. Existing E-waste/Repair Café codes are retained; programme admins can set or rotate their code in `/admin/programmes`.

`/programmes` selects a working programme, `/dashboard` adapts its content, and `/admin/programmes` manages scoped roles. The previous `/access` chooser redirects to `/programmes`. Navigation, the request proxy and database RLS enforce section boundaries. Global account and permission-template administration remains global-admin-only.

See [programme access notes](docs/programmes/README.md) for transfers, loans, implementation scope and the rollback-only security test suites.
