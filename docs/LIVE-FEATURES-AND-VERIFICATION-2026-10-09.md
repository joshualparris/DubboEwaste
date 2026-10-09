# DubboEwaste / AssetFlow — current product feature and verification register

**Snapshot:** 9 October 2026, Australia/Sydney.  
**Scope:** \`joshualparris/DubboEwaste\`, principally the production Next.js app at \`EwasteApp/\`, its Supabase project and the Vercel site.  
**Authority:** this is a **point-in-time product inventory**, not a certification that every route works for every role. Subsequent source, migrations and deployments take precedence when they are verified. See [CURRENT-STATE](CURRENT-STATE.md) for the distinct real-world business launch status.

## How to interpret status

- **Code present:** route/action/data model exists in the repository. Not necessarily accessible, migrated, configured or tested.
- **Database applied:** the migration appears in the connected production project's migration history, or the live object was independently inspected. Schema presence alone does not establish secure operation.
- **Build verified:** an identified Vercel production deployment completed successfully; it proves compile/build checks, *not* end-to-end behaviour.
- **Workflow dry-run:** authenticated-context SQL transaction tested a scenario and rolled back. This is not equivalent to a user using two devices.
- **Field verified:** someone checked the signed-in operational flow with relevant roles and equipment in the intended setting. **Not established for the complete Repair Café system.**
- **Planned / partial:** code, provider credentials, migrations, approvals or integration tests still missing. Do not present these as functioning production services.

## Products, sites and their boundaries

| Site / path | Actual purpose | Boundary |
|---|---|---|
| [dubbo-ewaste-app.vercel.app](https://dubbo-ewaste-app.vercel.app/) | Production private operations platform, AssetFlow modules and three programmes | Account and per-programme authorisation required |
| [/repair-cafe-dubbo](https://dubbo-ewaste-app.vercel.app/repair-cafe-dubbo) | Public Repair Café information and expression of interest | Public-facing, not a statement a venue or pilot is booked |
| [/repair-cafe-volunteers](https://dubbo-ewaste-app.vercel.app/repair-cafe-volunteers) | Private Repair Café volunteer hub | Repair Café members |
| [circular-economy-dubbo.vercel.app](https://circular-economy-dubbo.vercel.app/) | Related Circular Economy Dubbo portal | Separate application/repository; this repository does not by itself verify its deployed state |
| [joshualparris.github.io/DubboEwaste](https://joshualparris.github.io/DubboEwaste/) | Public research, idea hub and legacy links | GitHub Pages prototype is not the private source of truth |
| \`DubboEwasteApp/\` | Older static prototype | **Not** the current Next.js production app |
| E-waste asset inventory, Library of Things loans and Repair Café visitor tickets | Three separate activity types | A visitor-owned repair item is never automatically a donated E-waste asset or a LoT loan |

## AssetFlow / E-waste and shared functions (code present)

Private application routes include:
- **Operations:** dashboard, jobs (new/edit/detail), lots, assets (new/detail), triage, processing, media/sanitisation, repairs, resale, recycling, certificates, exceptions, locations, workshop inventory, model lookup/device reference and device library.
- **Commercial:** customers, CRM leads/opportunities, quotes and versions, campaigns, reports, settlements.
- **Administration:** programme chooser and membership management, staff access, role/permission matrix and admin data tools.
- **Shared:** learning catalogue/course lessons/assignments, documents and editable overrides, search/scanning, device references, field validation, project-network links, public research/guides.
- **Library of Things:** loan and return workflows under \`/lending\` with programme separation.
- **Programme membership:** \`dubbo_ewaste\`, \`repair_cafe\`, \`library_of_things\`; global admin and programme-scoped roles. Public signup uses programme access codes, but coordinator controls and server/DB checks remain required.

**Important:** module presence does not mean full integrations with erasure software, external CRM, messaging, payment services, actual waste vendors, stock feeds, transport providers or certified chain-of-custody organisations. The connected service integrations and legal/business launch gates must be independently verified.

## Repair Café — current route and feature map

| Route | Implemented application surface | Verification / limitation |
|---|---|---|
| \`/repair-cafe-dubbo\` and \`/repair-cafe-dubbo/feedback\` | Public concept, current published event details when appropriate, interest/feedback flows | No public operational launch assumed |
| \`/repair-cafe-volunteers\` | Volunteer guidance and links | Private membership |
| \`/repair-cafe-volunteers/sessions\` | Monthly drafts, date/time edit, venue planning, positions, availability, assignments and coordinator CRUD | Published-event, capacity and role rules exist; signed-in browser E2E not fully verified |
| \`/repair-cafe-volunteers/people\` | Create/edit/archive/restore manually entered volunteers and skills/contact preferences | Manual volunteer is **not** a login identity; contact opt-in recorded separately |
| \`/repair-cafe-volunteers/my-shifts\` | Volunteer self-service shifts/availability and waitlist UI | Waitlist migrations and actual offer/cancellation flow must be checked on the target project |
| \`/repair-cafe-volunteers/check-in\` | Volunteer QR attendance phone flow | QR code display / source exists; dual-user/mobile signed-in E2E outstanding |
| \`/repair-cafe-volunteers/event-desk\` | Owner-acknowledged visitor intake, safety screening, item-specific tickets, numbered queue, station assignment, progress, outcomes and history | Core SQL rollback dry-run passed; real shift/browser workflow not fully field-tested |
| \`/repair-cafe-volunteers/stations\` | Station lead and capacity dispatch screens | Station lead/call-next migrations exist and applied; explicit assignment UX and dispatch acceptance tests still required |
| \`/repair-cafe-volunteers/knowledge\` | Local privacy-reviewed repair lessons, previous tickets, external resource search and Open Repair Alliance data | External repair-data matches are **not** certified instructions or diagnosis; knowledge review/privacy workflows need human oversight |
| \`/repair-cafe-volunteers/operations\` | Venue correspondence, competency evidence, attendance/hours, incidents, photos, notification preferences/outbox, audit and archive/restore | Coordination functions exist; regulatory competency, photo retention and delivery provider remain separate real-world concerns |
| \`/repair-cafe-volunteers/reports\` and \`/reports/annual\` | Event/annual totals, category/outcome breakdown, measured-weight reporting, volunteer hours | Cannot assert environmental savings without approved methodology; report reconciliation still needs signed-in tests |
| \`/repair-cafe-volunteers/reports/export\`, \`/reports/open-data\`, \`/event-desk/export\` | Coordinator exports including privacy-aware event outcome and Open Repair mapping | Verify complete imports/exports against actual dataset and schema before external submissions |
| \`/repair-cafe-feedback\` | Private public interest/feedback review | Separate from voluntary post-repair satisfaction |
| \`/api/repair-cafe/dispatch\` | Scoped message delivery endpoint | **Endpoint/outbox is not proof any message was delivered**. Provider keys, sender/domain and delivery logs must be checked |

### Core workflow and safety behaviour already evidenced

- Production schema \`repair_cafe_tickets\`, \`repair_cafe_stations\`, \`repair_cafe_ticket_activity\`; visitor items stay separate from E-waste inventory. The duplicate legacy \`repair_cafe_visits\` / \`repair_cafe_repair_tickets\` write path is retired in the canonical schema migration; do not double-count those tables.
- Event-local queue number is allocated transactionally. User acknowledgement and safety screening are enforced; unsafe items cannot be marked as successfully worked on.
- Coordinator-only safety changes, status/outcome validation, station-event binding, capacity safeguards and ticket activity are implemented.
- Authenticated/anonymous permission spot checks and post-migration rollback-only repair-ticket scenarios passed on 9 October. They do not prove the offline queue, volunteer photo flow, two-device realtime updates or all user roles.
- Repair Café volunteers use their selected programme. Other programme members and anonymous visitors must not access internal tickets; RLS and secure RPCs, not UI hiding, are the security boundary.

### Recent functions requiring explicit qualification

| Feature | Code/data status | Qualification before relying on it |
|---|---|---|
| Open Repair Alliance historical search | **305,649 historical records present** in live \`repair_cafe_open_repair_data\` at snapshot | Search records are past observations; not repair instructions. Verify index/search from a live account |
| Local repair knowledge base | Page, review model and RLS are present | Zero local knowledge entries in snapshot; privacy approval required before publication |
| Live queue / Realtime | UI and subscription implementation present | Test two authenticated browsers, reconnect, membership revocation and race conditions |
| Encrypted offline Event Desk | Offline client logic, reconciliation and receipt migrations present | Browser-specific offline capture/reload/sync/conflict/revocation checks outstanding; no promise of seamless sync |
| QR attendance | UI and database migration present | Android/iPhone camera, session and time accuracy checks required |
| Shift waitlist / station capacity / role training | UI and some migration files present | Confirm each latest SQL migration is actually applied; do not infer working behaviour solely from repo files |
| Optional post-repair feedback | Public-facing flow and visitor feedback table present | Confirm consent, submission/visibility and retention by end-to-end test |
| Automatic email/SMS | Notification consent/outbox and dispatch endpoint present | Verify provider identity, successful sends, retries, delivery receipts and unsubscribe; **not claimed connected** |
| Safety/licensing | Software safety flags and incident form present | Insurance, organiser authority, NSW electrical restrictions, staff competency and host approval are **not** granted by software |

## Live database snapshot (9 October 2026)

The connected Supabase project was queried during this documentation review. Counts may change immediately after this snapshot.

| Record group | Observed count |
|---|---:|
| Active Repair Café event records | 13 |
| Active venue records | 0 |
| Repair Café tickets | 2 |
| Repair stations | 2 |
| Volunteer attendance entries | 1 |
| Manual volunteer records (not archived) | 0 |
| Local knowledge entries | 0 |
| Imported Open Repair Alliance rows | 305,649 |
| Notification outbox rows | 0 |

These are **records**; they are not proof of booked venues, genuine visitors, actual volunteer shifts, completed consent, delivered reminders or a successful event. Do not characterise all rows as test records or as real interactions without provenance.

## Deployment, tests and database migrations

- Production domain is \`https://dubbo-ewaste-app.vercel.app/\` (Vercel project \`dubbo-ewaste-app\`). The deployment SHA and aliases should be checked at time of release, not inferred from the presence of a GitHub commit.
- The app runs \`qa:learning\`, \`qa:mobile\`, \`qa:programme-auth\`, \`qa:repair-cafe\`, then \`next build\`. \`qa:mobile\` is a source guard, not visual verification; separate \`qa:mobile:browser\` exists.
- Supabase has a **migration history that differs from a simple filename sort**, including migration names/timestamps recorded when changes were applied. A local SQL file's presence does not mean production applied it.
- The repository contains multiple \`2026100919...\` and \`2026100922...\` Repair Café migration files. Some late migrations (notably waitlist, training or feedback enhancements) are not reflected in the live migration list at this snapshot: **migration parity check is a release gate**.
- The canonical database tables are in \`EwasteApp/supabase/migrations/\`; consult [the migration guide](../EwasteApp/supabase/migrations/README.md) before installing to a new Supabase project.
- For specific Repair Café acceptance gates see [roadmap](REPAIR-CAFE-PRODUCT-COMPARISON-IMPLEMENTATION-ROADMAP-2026-10-09.md), [operations guide](REPAIR-CAFE-OPERATIONS-V1-2026-10-09.md), and [GitHub issue #24](https://github.com/joshualparris/DubboEwaste/issues/24).

## Business and community pilot are separate from software completion

A working website is **not** a booked Repair Café or approved E-waste facility. Real-world gates remain host/auspice agreement, venue's permission and insurance, workshop scope and first aid, relevant licensing/planning, volunteer competence, privacy/consent, battery/mains safety and documented downstream. See [Phase 0 launch gates](PHASE-0-LAUNCH-GATES.md) and [Repair Café low-cost launch evidence](REPAIR-CAFE-DUBBO-GRANTS-ZERO-COST-LAUNCH-2026-10-09.md).

## Documentation rule

Start at [Documentation status and index](DOCUMENTATION-INVENTORY-AND-FRESHNESS-2026-10-09.md). Historical research, proposals, templates and dated implementation reports are retained as **source snapshots**, not continuously updated product claims. Always follow the actual source, database state, deployment and test evidence when a 6–8 October document conflicts with this register. Update the snapshot when new QA or deployment evidence exists.
