# Production architecture handoff

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **Archived architectural handoff (9 October 2026):** This describes the legacy static prototype/early aspirations and should *not* be read as the current production architecture. Current Next.js + Supabase Auth/Postgres/RLS code lives under [`EwasteApp/`](../EwasteApp/), with per-programme scopes, Repair Café ticket/queue, knowledge, operations, LMS and Library of Things. Read [current architecture](../EwasteApp/ARCHITECTURE.md) and [verified features](../docs/LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md).


The MVP is intentionally static and safe for demonstrations. A production deployment should replace the demo adapters with:

## Identity and roles

- managed email/password or passkey authentication;
- invite-only staff accounts;
- roles: `admin`, `operator`, `volunteer`, `viewer`;
- server-side authorisation on every read and write;
- optional MFA for administrators;
- audit events for intake, lock status, sanitisation, route, sale and deletion changes.

## Private data model

```text
users(id, role, created_at, disabled_at)
assets(id, category, make_model, condition, route, status, created_by, created_at)
authority_records(asset_id, basis, source_type, recorded_at, private_location)
device_identifiers(asset_id, serial_or_imei_encrypted, access_policy)
triage_records(asset_id, battery, lock_state, decision, reason, operator_id, created_at)
bench_tests(asset_id, checks_json, result, operator_id, tested_at)
sanitisation_records(asset_id, media_type, method, tool_version, verification, result, tested_at)
inventory_costs(asset_id, acquisition, parts, labour_minutes, direct_costs)
listings(asset_id, channel, draft, status, listed_at, sold_at, sale_price)
routes(asset_id, destination_type, receiver, evidence_ref, completed_at)
audit_events(actor_id, action, entity_type, entity_id, before_json, after_json, created_at)
```

Do not store ownership documents, customer contact data, serial numbers or IMEIs in the public repository. The `private_location` and encrypted identifier fields represent protected storage, not a reason to collect more data than necessary.

## Integration boundary

The current UI uses `localStorage` only. A backend adapter can replace `load`, `save`, `activity`, login and listing-copy actions. The decision rules should remain explainable and versioned; AI may suggest a route, but a human operator must confirm safety, authority, locks and sanitisation.
