# EwasteApp architecture

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
