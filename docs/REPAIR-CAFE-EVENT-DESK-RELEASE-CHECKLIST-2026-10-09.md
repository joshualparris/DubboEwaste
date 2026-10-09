# Event Desk implementation and release checklist (9 October 2026)

## Implemented in GitHub
- Authenticated private Event Desk page: `EwasteApp/app/(private)/repair-cafe-volunteers/event-desk/page.tsx`.
- Server actions: `event-desk/actions.ts`, selecting a session, check-in, station CRUD, status/outcome changes.
- Responsive screen and printable blank-paper fallback: `event-desk/event-desk.module.css`.
- Added links through the Repair Café Volunteer Hub and navigation.
- Event Desk DB and RPCs: `20261009173000_repair_cafe_event_desk_workflow.sql`. Separate RLS-secured tickets, stations, activity entries. No public/anonymous access.
- Earlier `20261009170000_repair_cafe_event_operations.sql` also introduces `repair_cafe_visits` and `repair_cafe_repair_tickets`; **these are distinct from Event Desk ticket records**. **Do not claim this duplication is resolved.** Before expanding functionality, consolidate into one canonical visit/ticket data model and migrate records carefully.

## Release blockers (not verified)
1. Production migration application, execution order and any divergence from checked-in migrations.
2. Build/typecheck in actual Next.js environment.
3. SQL transaction/RLS tests with anonymous, Repair Café volunteer, coordinator, programme-specific admin, E-waste-only volunteer and global admin.
4. End-to-end check-in to handover, signed-in browser/mobile checks and concurrent updates.
5. Confirm permission and scope for visitor consent and collection of repair details with the actual organising entity; the current acknowledgement is a recorded staff statement, not a signed legal form.
6. Define handling of incorrect/duplicate records, retention, erasure, photos and complaint/incident escalation. There is no public self-service and no automatic communications.
7. Consolidate the earlier `repair_cafe_visits`/`repair_cafe_repair_tickets` schema and the new Event Desk ticket table before reporting grant metrics. **Do not count both.**
8. Verification that published events and the venue/safety/insurance gates are genuinely ready; draft sessions support planning rehearsals only.

## Minimum acceptance tests
- Anonymous client cannot select or mutate stations/tickets/activity.
- E-waste-only and Library-only users cannot read or write Repair Café tickets.
- Repair Café member can check in a permitted item with clear safety status and acknowledgement.
- Missing acknowledgement/safety screen is rejected server-side.
- A review or unsafe ticket cannot begin work; unsafe check-in closes as not attempted.
- No cross-session station allocation.
- Non-coordinator cannot void, alter safety screening, or bypass coordinator scope.
- In progress requires station; completion requires a valid outcome.
- Ticket history records creation and each update.
- Closed ticket cannot reopen.
- Mobile testing at 320, 375 and 430 px; queue controls and screen-reader labels readable.
- Print fallback works without exposing real people's contact details.
- Counts reflect one canonical data source and exclude void tickets.

## Status
**Committed source, not verified deployed or production-ready.** This checklist documents outstanding work rather than claiming the above tests passed.
