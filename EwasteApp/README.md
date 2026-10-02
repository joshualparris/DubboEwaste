# DubboEwaste Operations App

Private operations app for DubboEwaste staff and volunteers.

The existing GitHub Pages research/training site remains public. This folder is a separate authenticated application for private operational data.

## First slice

This initial slice includes:

- Supabase email/password authentication
- role profiles: `admin`, `manager`, `technician`, `volunteer`, `auditor`
- protected staff routes
- PostgreSQL/Supabase schema with Row Level Security
- asset register
- automatic asset IDs such as `DEW-2026-000001`
- asset audit/event history
- new-asset intake form
- QR code on each asset page
- dashboard and inventory list
- source-dated model/support lookup backed by Supabase
- CI build workflow

## Architecture

```text
Existing public GitHub Pages site
        |
        +-- public research/training

EwasteApp (Next.js)
        |
        +-- Supabase Auth
        +-- PostgreSQL
        +-- Row Level Security
        +-- audit log
        +-- staff UI
```

Private customer, supplier, asset and chain-of-custody data must never be committed to the public Git repository.

## Local setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial.sql` in the SQL editor or with the Supabase CLI.
3. Run `supabase/migrations/002_model_support.sql` after the first migration.
4. Run `supabase/migrations/003_lookup_events.sql` after the model catalogue.
5. Copy `.env.example` to `.env.local`.
6. Add the project URL and publishable/anon key.
7. Create the first staff user in Supabase Auth.
8. Promote that profile to `admin` in the database.
9. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000/login.

## Lookup behaviour

The intake lookup ranks exact names, approved aliases and known identifiers before
falling back to token matching. Selecting a result fills the editable manufacturer,
model, category and initial-route fields, but always labels the result as a candidate
to verify. A broad term such as `Intel Core i5` cannot identify a laptop: the exact
processor, manufacturer/model, serial/service tag or an on-device observation is
still required.

The catalogue is deliberately source-dated rather than populated from an
uncontrolled “free device API”. The next resolver steps are an internal Dubbo asset
QR/barcode, a camera/Bluetooth scanner, and a diagnostic observation from the device
(SMBIOS or platform settings). `lookup_events` records the method and redacted query
for a future audit trail without storing raw IMEI or serial values. The current
pilot UI does not yet write lookup events.

## Security model

- no public sign-up page
- authentication is required for private routes
- inactive profiles are blocked
- RLS remains the final database security boundary
- volunteers can work with assets but cannot administer users
- auditors are read-only
- important asset changes are recorded in `asset_events`
- secrets belong in deployment environment variables, never Git

## Next slices

1. Interactive front-door triage wizard
2. Category-specific intake flows
3. richer model/support imports and source review
4. diagnostics and sanitisation workflow
5. inventory/economics/route recommendations
6. listing/invoice/report generation
7. marketplace and bench-tool integrations


## AssetFlow P0 status — 2 Oct 2026

P0 is implemented end-to-end: customers, inbound jobs, work instructions, bulk lots, serialized assets, QR labels, locations, evidence/photos with SHA-256, dynamic attributes, separate media records, manual sanitisation evidence, diagnostics, grading, disposition, certificates, global search, exception queue and RLS role permissions.

P1 foundations now also include repair tickets, harvested-part provenance, sanitisation policies/tasks, pallets, downstream vendors, outbound orders, resale qualification/listings/sales, environmental reporting, workstation profiles and configurable workflow rules.

See OpenSourceSoftware/feature-backlog.md for the authoritative shipped/foundation/backlog matrix.
