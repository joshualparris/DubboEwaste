# Dubbo E-Waste App MVP

This folder contains a working, dependency-free prototype of the volunteer-facing operations app described in `../codexToDO.md`.

The production database, role and audit design is documented in [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Run it

From the repository root:

```bash
python3 -m http.server 4173 --directory DubboEwasteApp
```

Open <http://localhost:4173>.

Demo login: enter any email and the password `demo`.

## Included in this MVP

- staff login boundary and role selector;
- dashboard with intake, inventory, route and margin summaries;
- one-page triage workflow with ownership, battery, lock, condition and route gates;
- category-specific guidance for laptops, Macs, mobile devices, Chromebooks, desktops, monitors, TVs and networking gear;
- model lookup records with support, lock, battery and route fields;
- local inventory records and audit events;
- unit-economics calculator;
- listing-draft generator;
- responsive layout suitable for a shed tablet or laptop.

## Security boundary

This is a front-end prototype. Its demo login and `localStorage` records are not secure authentication or a private database. Do not enter real names, addresses, IMEIs, serial numbers, ownership documents or customer data.

Production deployment requires a server-backed identity provider, role-based access control, encrypted database, row-level permissions, audit logging, backups, retention rules and redacted exports. The UI is deliberately structured so those services can replace the demo adapters without changing the operating workflows.
