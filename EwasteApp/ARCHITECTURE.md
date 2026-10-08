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


## Programme access

Authentication is shared, but application access is programme-scoped.

A profile has:
- one authority role in `public.profiles.role`;
- zero, one or more programme memberships in `public.program_access`.

Current programmes:
- `dubbo_ewaste` — AssetFlow operations;
- `repair_cafe` — Repair Café Volunteer Hub.

Signup access codes map to programmes in the private `signup_access_codes` table. Plaintext codes are never stored in Git or retained in auth metadata.

Default signup mapping:
- DubboEwaste code → `volunteer` role + `dubbo_ewaste`;
- Repair Café code → `repair_volunteer` role + `repair_cafe`.

The `repair_volunteer` role exists as defense-in-depth: it is deliberately absent from legacy AssetFlow write-role lists. AssetFlow's broad `is_active_staff()` and table-permission helpers additionally require `dubbo_ewaste` membership.

An account can hold both programme memberships. Admin/manager accounts were seeded with both; future volunteers can be granted an additional programme without creating a second identity.

Login destinations:
- DubboEwaste only → `/dashboard`;
- Repair Café only → `/repair-cafe-volunteers`;
- both → `/access`.

The edge proxy redirects Repair Café-only accounts away from AssetFlow routes even before page rendering. Database RLS remains the final authorization boundary.
