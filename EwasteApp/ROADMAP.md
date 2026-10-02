# EwasteApp roadmap

The detailed platform backlog is maintained in [docs/ASSETFLOW-PLATFORM-BACKLOG.md](../docs/ASSETFLOW-PLATFORM-BACKLOG.md). The first active expansion is CRM, sales and marketing; existing customer/source records are the foundation, not the finished CRM.

## Slice 1 — foundation — STARTED
- [x] Next.js app shell
- [x] private login
- [x] staff roles
- [x] Supabase schema/RLS
- [x] asset register
- [x] new intake record
- [x] automatic asset codes
- [x] QR asset page
- [x] audit events
- [ ] connect a real Supabase project
- [ ] configure first admin
- [ ] deploy private app

## Slice 2 — interactive triage
- front-door decision wizard
- ownership and authority
- lithium/electrical safety
- lock/MDM checks
- category-specific questions
- support/model lookup
- accept / hold / reject / parts / recycle recommendation
- reason/evidence trail

## Slice 3 — diagnostics + sanitisation
- guided checks
- imported battery/SMART results
- wipe jobs + verification
- certificates/reports
- chain-of-custody status changes

## Slice 4 — inventory + economics
- cost/labour/parts
- market evidence
- route recommendation
- parts/scrap floor
- do-not-accept rules
- ageing/reprice queue

## Slice 5 — selling/customer
- listing generator
- receipts/invoices
- warranty/returns
- customers
- recall traceability
- community/donation reports

## Slice 6 — integrations
- bench diagnostic uploader
- barcode/label printing
- marketplace/auction imports where lawful and technically available
- notification/report automation
