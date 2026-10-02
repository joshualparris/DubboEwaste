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
3. Copy `.env.example` to `.env.local`.
4. Add the project URL and publishable/anon key.
5. Create the first staff user in Supabase Auth.
6. Promote that profile to `admin` in the database.
7. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000/login.

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
3. model/support lookup integration
4. diagnostics and sanitisation workflow
5. inventory/economics/route recommendations
6. listing/invoice/report generation
7. marketplace and bench-tool integrations
