# DubboEwaste Operations App

This is the **production private operations application** for DubboEwaste staff and volunteers.

Production: https://dubbo-ewaste-app.vercel.app/

The application is separate from the public research material and the GitHub Pages gateway/admin console.

## Stack

- Next.js
- Supabase Auth
- PostgreSQL
- Row Level Security
- Vercel
- server-side actions for operational writes

## Current capability

AssetFlow now includes:

- access-code staff signup plus email confirmation
- staff roles: `admin`, `manager`, `technician`, `volunteer`, `auditor`
- role-level CRUD permissions and per-user overrides
- customers / sources
- jobs
- lots and lot relationships
- serialized assets
- QR labels
- locations
- evidence and photos
- model lookup
- attributes, tests and grading
- media and sanitisation workflows
- repairs and parts
- pallets and outbound orders
- resale listings and sales
- recycling/downstream records
- exceptions
- certificates and public verification
- reports
- admin data console
- audit/event records
- sanitisation capability matrix for SATA, SCSI, SAS, USB, NVMe and OPAL media
- NIST SP 800-88 / legacy DoD method selection with HPA, DCO, OPAL and freeze-lock preflight capture
- structured diagnostic runs for manual, local-agent, boot-media and external-report execution
- controlled deployment profiles and planned runs for Blancco, ServiceNow, Microsoft Endpoint Manager and PXE/netboot
- hash-chained certificate audit-vault records with explicit unsigned/signature status

## Security model

- private routes require Supabase authentication
- new users require the configured signup access code and email confirmation
- profiles can be active/inactive
- Supabase RLS is the final database authorization boundary
- admins can configure role and individual table permissions
- audit/history records are intentionally more restrictive than ordinary operational tables
- attribution fields such as `created_by` are protected
- private customer/device information must never be committed to the public Git repository

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local`.
3. Configure the Supabase project URL and publishable key.
4. Apply the database migrations in the order documented in [supabase/migrations/README.md](supabase/migrations/README.md).
5. Run:

```bash
npm run dev
```

Open http://localhost:3000/login.

## Development checks

```bash
npm run typecheck
npm run build
```

GitHub Actions runs both checks for application pull requests.

## Important folders

| Path | Purpose |
|---|---|
| `app/(private)/` | authenticated screens and operations |
| `app/api/` | API routes |
| `components/` | reusable UI |
| `lib/` | Supabase/admin/workflow helpers |
| `supabase/migrations/` | database schema and policy history |

## Product specification / backlog

See [../OpenSourceSoftware/README.md](../OpenSourceSoftware/README.md) and [../OpenSourceSoftware/feature-backlog.md](../OpenSourceSoftware/feature-backlog.md).

The boundary and remaining workstation/enterprise integration work are documented in [../docs/ASSETFLOW-ERASURE-DIAGNOSTICS-INTEGRATIONS.md](../docs/ASSETFLOW-ERASURE-DIAGNOSTICS-INTEGRATIONS.md).

## GitHub Pages distinction

`../DubboEwasteApp/` on `main` is an older static prototype source. The published `gh-pages` branch now contains a separate gateway/admin experience. Do not treat the old static prototype as the production application.
