# Repair Café Dubbo: product comparison, gaps and implementation roadmap

**Date:** 9 October 2026  
**Repository:** joshualparris/DubboEwaste, EwasteApp  
**Scope:** Community Repair Café operations and volunteer coordination only. Do not conflate items temporarily handled at events with donated E-waste, commercial repair jobs or Library of Things loans.

## Executive judgement

The existing Repair Café has a promising public concept site, volunteer/venue directory, 2027 monthly session planning, manual and authenticated volunteers, skill declarations, availability, shift assignment, role-based access, basic venue verification, and links to circular-learning courses. It currently lacks the complete **day-of-event journey**: visitor intake → safety screen and consent → triage / station queue → repair notes and outcome → aggregated, defensible reports. A build-complete feature is not necessarily browser-tested or field-ready.

### Comparators (features published by providers; not hands-on tests)

- [Restarters.net](https://www.restarters.net/): community event coordination and the Fixometer approach to collaborative repair / impact records. Comparator for repair-session operations.
- [RepairMonitor](https://www.repairmonitor.org/en): Repair Café International item, fault, repair outcome and barriers reporting. Comparator for consistent item-level repair capture.
- [Open Repair Data Standard](https://openrepair.org/open-data/open-standard/): cross-organisation item taxonomy, category, repair status/barriers and shareable de-identified data. Schema compatibility target, not a claim of compliance.
- [Better Impact](https://www.betterimpact.com.au/): volunteer recruitment, scheduling, onboarding, timesheets, communications and reports. Comparator for people operations.
- [SignUpGenius](https://www.signupgenius.com/): low-friction self-signup for shifts, reminders, simple calendars and limits.
- [POINT](https://pointapp.org/pricing/): volunteer scheduling and impact reporting, useful as a build-versus-integrate benchmark.
- [RepairShopr](https://www.repairshopr.com/features): commercial tickets/inventory model; **do not** copy invoicing, customer CRM or sales workflows into a community Repair Café without need.

## Verified code and database on 9 October 2026

- Private volunteer sessions/rosters UI: \`EwasteApp/app/(private)/repair-cafe-volunteers/sessions/\`.
- Coordinator volunteer directory (manual and account): \`.../repair-cafe-volunteers/people/\`.
- Private research and safety guidance hub: \`.../repair-cafe-volunteers/page.tsx\`.
- Public concept, feedback and upcoming published date: \`EwasteApp/app/repair-cafe-dubbo/page.tsx\`.
- LMS: \`EwasteApp/app/(private)/learn/\`, learning course catalogue, programme membership and assignment tables.
- Existing generic \`/repairs\` and \`/reports\` belong to asset-based E-waste / ITAD and are **not** Repair Café visitor tickets / outcomes.
- Supabase: sessions, venues, volunteers, availability, shift slots, assignments, public feedback and learning tables; database RLS per-programme.
- Live database snapshot (09/10/2026): 13 sessions, 0 venues, 3 shift slots, 1 account availability, 0 assigned volunteers, 3 public feedback responses. These counts are an observed snapshot, not a live counter in this document.

## Priority features by phase

| Phase | Priority / goal | Deliverables | Completion criterion |
|---|---|---|---|
| P0: Event Desk MVP | **Do first**: operate a real pop-up session | Visitor check-in; one event-specific repair item ticket with non-sensitive item info; owner stays present; refusal/triage; queue and station assignment; worker notes; result and repair barrier; internal event totals; minimal printable summary | One event can be run from check-in to a completed outcome without touching ITAD inventory |
| P0: Safety/privacy foundations | Do alongside Event Desk | Clear intake acknowledgement, no implicit storage of passwords, battery/mains hazard escalation, refusal route, incident flags, minimum-data and retention boundaries, only authenticated Repair Café team can see internal records | Readiness blocks unsafe public claims, tests prove E-waste / other programmes cannot read tickets |
| P1: Day-of-event operations | High | Repair station directory per event; actual volunteer attendance and hours; station capacity; internal handovers; queue ages; offline paper intake template; exports | Organiser can see busy stations, volunteer hours and outstanding tickets |
| P1: Complete scheduling | High | Start/end time per shift, overlap/conflict checks, skill/verified competence where applicable, backup volunteers, venue confirmation evidence, event audit log, calendar invites | Roster is practical for setup / lunch / packdown and venue changes leave a trail |
| P1: Impact and reporting | High | Data quality and anonymisation, Open Repair Data mappings, unique issue categories, repair outcomes / reason, per-session and yearly report / CSV, validated estimates | Counts can be reproduced and any weight/carbon claims require explicitly documented method |
| P2: Communication | Medium | Opt-in emails, shift confirmations, reminders, reschedules/cancellations, delivery logging, unsubscribe / consent | Nobody receives unconsented automated messages or assumes a calendar invite proves attendance |
| P2: Community self-service | Medium | Visitor pre-registration only if needed, simple walk-in ticket code, low-friction volunteer invite, optional host offer portal, accessibility / multiple-language needs | Does not require public visitor accounts for walk-ins |
| P3: Optimisation | Later | Training to skill verification, donation / consumable finance records, grants dashboard, satisfaction follow-up, RepairMonitor export | Improve only after real pilot data shows demand |

### Explicit non-goals for first pilot

Native smartphone app, AI repair diagnosis, complex billing, customer contracts, full asset tracking, public visitor identity accounts, electronic mains-voltage approvals, and excessive required intake fields. No feature implies that events, insurance, permissions, host partnerships, skill qualifications or volunteer communications are actually confirmed.

## Reference operational flow

1. Coordinator publishes **a verified event**, with safe venue, roles, and scope.
2. On event day volunteers check in; organiser runs briefing and displays stations.
3. Visitor arrives, describes **one portable item**, acknowledges terms, and keeps ownership and control. Screen obvious safety risks. For children or sensitive devices apply extra caution and clear consent; do not retain passwords.
4. Intake creates ticket with queue number, category, brief fault, category/weight if appropriate; no full name/address required by default.
5. Triage status: **waiting**, **assigned/in_progress**, **referred**, **not_attempted** (including unsafe), or **completed**. Track wait time based on timestamps where possible, with no invented precision.
6. Repair volunteer adds observable actions, part(s) supplied by owner/volunteer and outcome: fixed, partially fixed, not fixed, not attempted/referral. Capture reason and safe advice, keep uncertain outcomes uncertain.
7. Close-out shows instructions, consent/data policy, opt-in only for follow-up. No assumption of warranty or guaranteed repair.
8. Aggregate **de-identified** categories/outcomes/volunteer hours. Review quality and share credible results with hosts/grant makers. If direct RepairMonitor import isn't supported, export only mapped fields with provenance.

## Roles and data restrictions

| Principal | Event Desk access |
|---|---|
| Public visitor | Confirmed public event details only; no internal repair ticket or other visitor records |
| Repair Café volunteer | Read event's minimal tickets, add intake/work notes/outcomes, assign within allowed on-the-day workflow; not other programmes |
| Repair Café manager/admin | Full Repair Café event desks, ticket management, internal reports, incident escalation; no other programme inventory |
| Global admin | Cross-programme administrative oversight, audit-sensitive changes |
| E-waste/LoT-only member | No Repair Café event ticket visibility |

Use the existing authenticated Supabase context and database RLS, **not** route hiding alone. Do not expose private contacts in Repair Café event public-facing responses. Keep visitor details optional and purposeful. Prefer recording tickets under an opaque UUID and short per-event queue number. No hard deletes of safety/incidents without an auditable retention policy.

## Database model target

New \`repair_cafe_tickets\`: event FK, event-local ticket number, item type / product category, problem, status (waiting, in_progress, complete, referred, not_attempted), safety screening/owner acknowledgement, station/assignment, result (fixed, partial, not_fixed, not_attempted), reason/barrier, repair notes, timestamp fields, created_by, updated_by. Explicit status/result constraints and triggers; DB RLS restricted to Repair Café members. Separate nonidentifying aggregate query; no public direct SELECT. Possible later: \`repair_cafe_ticket_activities\`, \`repair_cafe_stations\`, \`repair_cafe_attendance\`, \`repair_cafe_incidents\`, \`repair_cafe_event_audit\`, \`repair_cafe_message_outbox\`. Retain source provenance for any future ORDS export.

**Guardrail:** a self-declared volunteer skill never equals a regulatory or safety qualification. Test direct DB writes, unauthorised roles, double submits, capacity race, public queries, cancellation, unpublish and mobile accessibility.

## Pilot operation kit

- Bring one-page, printable visitor intake and repair outcome form for network failure; note that the paper copy must be securely handled/destroyed according to an agreed retention policy.
- Show coordinator: session scope and host contact, readiness, role roster, number queued/in progress/closed, any flagged risk, contacts for emergency response. Show volunteers: only information necessary to safely triage and repair.
- Never treat an item as donated inventory solely because it attended a Repair Café.
- Run a dry-run with fictitious tickets using a non-public staging environment before processing a real person's item.

## Acceptance tests across implementation

1. A signed-in Repair Café volunteer creates a ticket for their authorised programme event; E-waste-only volunteer cannot read/write it.
2. Public anonymous queries cannot retrieve ticket descriptions or safety notes.
3. Visitor item with unsafe/swollen lithium battery can be refused without ever marking a repair successful.
4. Two simultaneous registrations receive distinct event-local queue numbers.
5. Item status transition obeys allowed states. A completed outcome records a completion timestamp, responsible volunteer and result.
6. Unsuccessful, partially fixed, and referred items count separately from successful repairs.
7. Closed or cancelled sessions reject new walk-ins; missing/unknown venue does not create a public promise.
8. Manual/unauthenticated volunteers cannot forge a privileged event ticket role.
9. Print view and narrow Android/iPhone view retain all essential labels/actions.
10. Source/build tests + SQL RLS and integrity tests + signed-in browser checks must pass before claiming full launch readiness.

## Implementation notes

The first production increment should prefer **one coherent vertical slice** (intake → queue → repair work → outcome → report) over a broad but nonworking feature scaffold. Later phases remain tracked as *unimplemented* until source, database and relevant tests exist. Amend this document with deployment and verification status after each increment.
