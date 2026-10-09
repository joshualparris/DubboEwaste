# Repair Café Dubbo: monthly events, volunteer rostering and venue operations

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **9 October 2026 documentation reconciliation:** **The original first-slice plan has been overtaken.** Coordinator CRUD/date edits, programme-scoped manual volunteers, assignment management, timed shifts, check-in hours, archive/restore, safety/audit history, QR route, volunteer self-service and more are now represented in the app/code and live schema. Read sections labelled 'proposed model', 'not yet included' and suggested future phases as **historical requirements**, not definitive current gaps. Waitlist, training gate, dispatch and email delivery still require individual migration/deployment/browser/provider checks. No real venue is confirmed in the 9 October database snapshot. See [documentation index](DOCUMENTATION-INVENTORY-AND-FRESHNESS-2026-10-09.md).


**Prepared:** 9 October 2026  
**Status:** foundational event and roster system built 9 October 2026; public dates and volunteer/venue commitments still need to be entered and confirmed. The remaining phases below are proposals, not completed features.  
**Owner:** Repair Café Dubbo programme, within the existing DubboEwaste operational platform.  
**Guiding principle:** one event record per month; volunteers nominate dates, coordinators approve rosters, venues are separately confirmed; nothing is announced publicly prematurely.

## Full CRUD and easy volunteer entry update (9 October 2026)

**Built and database-applied:** all Repair Café coordinators (per-programme admin/manager and global admin) can create, view, edit and delete individual unpublished sessions, including changing dates and opening hours; create/edit/delete venues once detached from sessions; add, amend or delete required roster roles; manage availability records and assignment status; and manage a separate manual volunteer directory without creating login accounts. Session deletions cascade to its shift/availability records. Publicly advertised events must be unpublished before deletion. Editing an advertised date/scope explicitly unpublishes it and requires the coordinator to handle manual notifications.

**Fast workflow:** open `/repair-cafe-volunteers/sessions`, find the month, expand **Edit date & time** or **Add volunteer to this date**. For volunteer management across months, open `/repair-cafe-volunteers/people`, add name, skills and optional consented contact details; optionally select a session to mark available. Existing logged-in Repair Café volunteer profiles can have their self-declared skills amended or removed, but login accounts and programme memberships remain controlled by the existing auth/admin workflows.

**Manual roster safeguard:** a coordinator must confirm the person personally agreed to the date before marking them available and must explicitly confirm their acceptance before assigning a shift. Manually entered people are coordinator-only records, never implicit authenticated accounts. The public interest form is not auto-converted to volunteers.

**Schema migrations:** `20261009150000_repair_cafe_full_crud_manual_volunteers.sql`, `20261009151000_repair_cafe_roster_consistency.sql` and `20261009152000_repair_cafe_member_profile_crud.sql`. They add coordinator-only manual records, changes to assignment foreign keys, RLS CRUD policies, capacity/availability guards and account-member skill management. No existing session or account records are deleted by these migrations.

**Tests:** a transaction-rolled-back database test created/updated/deleted an example venue, session, two manual volunteers, a shift and assignment; verified overbooking is refused, confirmed volunteers cannot be marked unavailable, and published dates cannot change silently. Vercel build verification is tracked separately from this database test. An authenticated multi-account browser E2E test and automatic notifications are still outstanding.

## Implementation update (9 October 2026)

**Built in the existing Next.js + Supabase platform:**
- New protected `/repair-cafe-volunteers/sessions` workspace, linked from the Volunteer Hub and app navigation.
- Create one-off session drafts or 12 third-Saturday monthly draft dates for a selected year without overwriting existing entries.
- Volunteer self-managed skill and availability profiles per event; voluntary response is **not** a commitment.
- Coordinator role and capacity fields, shift offers, volunteer acceptance/decline/withdrawal; database-enforced capacity check.
- Venue directory, booking stages (unknown/offered/tentative/confirmed/declined), confirmed-in-writing checkbox and safety check.
- Protected public publication state. Publishing requires confirmed venue, safety approval, nonempty repair scope and a complete accepted roster; losing coverage automatically unpublishes the event.
- Public page queries upcoming **published** events only. It does not expose draft events, private volunteers or unapproved venues.
- Two applied Supabase migrations: `20261009133500_repair_cafe_sessions_rosters.sql` and `20261009134500_repair_cafe_publish_safety.sql`.

**First-release historical gap list (now partly superseded):** external email/SMS delivery and external venue-host accounts remain separate; attendance, outcomes, audit history and queue functionality have since gained dedicated implementation. Consult the 9 October reconciliation above and the live feature matrix. Those are separate development phases. Do not imply an automated message has been sent. No real 2027 booking, Barry or Jill assignment was inserted.

**Verification:** the first Vercel production build passed, including the application’s existing Learning, Mobile and Programme Auth QA gates and Next.js compile. An authenticated browser end-to-end test with actual volunteer accounts has not yet been completed; this document does not claim otherwise.

## 1. Decision and boundaries

Build this as a **Repair Café programme module inside the existing AssetFlow / DubboEwaste Next.js app**, rather than a stand-alone calendar, separate accounts, a second roster app, or an LMS replacement. Keep the current resident feedback form and public website. Use the existing Supabase authentication, programme memberships, role-scoping and learning hub.

Default to **one event per month, nominally the third Saturday**, with the ability to move or cancel a single month's event. Rotating pop-up venues are supported. The monthly recurrence is a *planning template*, never an automatic public commitment.

Keep the Repair Café community/non-commercial: owners stay with items; no automatic conversion into Dubbo E-waste ITAD inventory, customer accounts or commercial jobs. Public visitors do not need staff accounts.

This document describes a build and the operating process; it does not assert that venue bookings, volunteers, training certifications, insurance, email delivery or new database tables already exist.

## 2. Verified starting point in repository (9 Oct 2026)

| Existing capability | Current source | Reuse / gap |
|---|---|---|
| Public community expression of interest | EwasteApp/app/repair-cafe-dubbo/page.tsx and components/RepairCafeInterestForm.tsx | Captures preferred repair areas, volunteer roles, preferred times, suggested venue and permission to contact. **Not a session signup.** |
| Persisted public feedback | Supabase migration 014_repair_cafe_public_feedback.sql | Separate from authenticated volunteer identity. Form submissions do not become staff accounts without a consented onboarding process. |
| Manager feedback dashboard | EwasteApp/app/(private)/repair-cafe-feedback/page.tsx | Read-only response review. Useful recruitment source, not a volunteer schedule. |
| Private Volunteer Hub | EwasteApp/app/(private)/repair-cafe-volunteers/page.tsx | Shows venue shortlist, role definitions, safety and pilot checklist. **Currently no date-by-date roster or venue confirmation state.** |
| Programme accounts and access | EwasteApp/lib/programmes.ts, lib/programme-context.ts, programme migrations (Oct 2026) | Reuse Supabase user IDs and programme membership 'repair_cafe'; scope data and menus by programme. |
| Shared Learning Hub | EwasteApp/app/(private)/learn and learning migrations 019–020 | Use for induction/learning evidence; not as a volunteer diary or rota. |
| Rotating venue research | docs/DUBBO-REPAIR-CAFE-VENUE-RESEARCH-2026-10-08.md | Starting shortlist only; venue consent, booking and permitted activities still need independent confirmation. |
| Circular-economy research portal | CircularEconomyDubbo /internal/repair-cafe | Currently redirects to operational Volunteer Hub. Do not duplicate rostering state in that separate site. |

**Important schema caveat:** The Supabase migrations README warns that numbering is historical and some production changes were applied manually. Inspect the *actual production schema and RLS* before writing a fresh, timestamped migration. In the 8 October programme-access migration, private.is_programme_admin(pr) specifically checks a programme 'admin' (and global admin), **not programme 'manager'**; a new manage-roster permission must explicitly define authorised Repair Café coordinator/admin permissions instead of assuming all helper functions cover managers.

## 3. Concrete four-month example — illustrative, not real offers

All four dates below are the **third Saturday**; each may be changed by a coordinator. 'Borders' is a hypothetical host name from the planning example, not a researched/confirmed partner.

| Date | Venue planning | Volunteer intent | Result |
|---|---|---|---|
| Sat 16 Jan 2027 | Borders — offered, needs host verification, safety/insurance approval and written booking | Roster not yet filled | **Not publicly confirmed** |
| Sat 20 Feb 2027 | Dubbo Library — proposed, subject to explicit venue approval for allowed repair types | Barry: available / interested in volunteering | **Not yet assigned or published** |
| Sat 20 Mar 2027 | Venue not decided | Jill: willing to help with sewing | Requires sewing station approval, shift confirmation and venue |
| Sat 17 Apr 2027 | Venue not decided | Jill: unavailable | Do not assign or repeatedly chase Jill; consider a different category or no sewing station |

**State separation:** venue suggestion/offer ≠ provisional hold ≠ confirmed booking. Volunteer availability ≠ volunteered for a specific shift ≠ coordinator-approved assignment ≠ final confirmation. Public event status is a separate gate.

## 4. Experiences inside the current application

### A. Volunteer experience (phone first)

Under programme 'Repair Café', add **My sessions** to the Volunteer Hub/menu:

1. See upcoming months as readable cards or calendar/list (date, suburb/venue if confirmed, session hours and skills requested).
2. Select a month, choose **Available / Maybe / Not available** and optional preferred role/shift (or change previous response). A decline is not treated as a negative performance record.
3. View requested positions and skill fit: sewing, laptops, bikes, welcome, intake, setup, first-aid support, lead/coordinator, etc. People may have multiple skills, and non-fixers are welcome.
4. Volunteer can request a particular shift. A coordinator may propose a shift to a suitable volunteer, who still accepts it.
5. See clear status: **Availability received → Pending assignment → Confirmed shift**, or **Unavailable**. Display address and arrival instructions to assigned volunteers when confirmed.
6. Withdraw or request a change from the same mobile page; system highlights the now-uncovered role to coordinators. Do not silently replace them.
7. Volunteer can maintain skills and reasonable safety/training evidence. Personal phone/email, emergency information, accessibility needs and private notes are not shown to other volunteers.
8. A volunteer who offers to host a venue sees a separate **Offer a venue** flow rather than being automatically rostered.
9. Users with no specialist skill should have obvious welcome, intake, setup, hospitality and learner options.

**Do not** make a recurring opt-in equivalent to committing every third Saturday. Confirm each month individually. Allow volunteers to opt into notice about new sessions, with separate consent for direct contact.

### B. Coordinator view

Add **Sessions & rosters** inside Repair Café, visible to an authorised programme coordinator/admin:

- Month-board with date, status, venue stage, volunteer totals, skill coverage and next task.
- Session detail tabs: Overview, Volunteers/positions, Venue/host, Safety/readiness, Communications, Visitor capacity/outcomes.
- Create one draft from a monthly template; alter time, date or venue, including one-off non-Saturday sessions.
- Define required shifts and minimum coverage for *this* event; call for availability and assign only after an explicit selection/acceptance workflow.
- Show gaps, e.g. "Sewing: 0/1", "Welcome: 1/1", "Safety lead: missing", "Venue: not confirmed".
- Contact opted-in volunteers, print/CSV-export a roster for the event lead, and keep cancellation/replacement history.
- Require written venue confirmation and completion of launch gates before public publication.
- Keep notes about event activity separate from private participant data. Limit contact exports to coordinators.

### C. Venue host and organiser experience

Internal venue directory may start with the researched shortlist. Each entry stores venue name, contact person and preferred method, approximate capacity, room type, accessibility, electrical outlets, work restrictions (soldering, bikes, batteries, mains, etc.), insurance/hirer details, hire cost, storage/parking, and evidence/update date. Unknown = **unknown**, not presumed approved.

An organiser records each *offer or booking* against a **specific session**:
- Proposed / host offered / enquiry sent / provisional hold / confirmed / declined / cancelled.
- Offer date, approver, expiry on tentative holds, written permission/evidence reference, booking confirmation date and special conditions.
- One session can have multiple candidate offers but only **one active primary confirmed venue** unless a deliberate multi-site event is supported later.
- When a location changes, reassess permitted repair categories, accessible layout, volunteers, public notice, capacity and risk controls. Do not assume a venue is transferable to every date.
- Do not publish private host contact details on the public page.

### D. Public visitor experience

Keep the public page simple. Only if a session passes publish checks, show **Next Repair Café**: local date/time, confirmed venue/address, accessible arrival details, categories available that month, limits/exclusions, how queues or bookings work, and cancellation updates. With zero confirmed events, retain the existing truthful "idea being tested / no event operating yet" wording.

Volunteers are account holders; visitors are not required to create accounts. The existing anonymous expression-of-interest form is not an event ticket or repair booking. A separate lightweight visitor booking/queue can be phase 2 if demand justifies it.

## 5. Proposed Supabase data model (new tables, not yet created)

Use new timestamped, reviewed migrations and strict row-level security (RLS). Names below are proposed. Use UUID primary keys, created_at/updated_at where needed, foreign keys and indexed event/user relationships; store timestamps in UTC and render in **Australia/Sydney**.

| Table | Essential fields | Notes |
|---|---|---|
| repair_cafe_events | id, start_at, end_at, timezone, status, capacity, notes, public_summary, published_at, organiser_user_id, confirmed_venue_id | Unique event occurrence, not the month name. Status draft/collecting/ready/published/completed/cancelled. |
| repair_cafe_venues | id, name, general location, private host contacts, room/features, allowed/prohibited activities, access, capacity, price info, last_verified_at | Host may have multiple rooms; do not expose private notes publicly. |
| repair_cafe_venue_offers | id, event_id, venue_id, offer_status, enquiry_at, hold_expires_at, confirmed_at, evidence_reference, conditions | Specific date/room booking; never infer confirmed from a form. |
| repair_cafe_volunteer_profiles | user_id (references profiles.id), skills/tags, competence level, interests, preferred roles, notification preferences, approved contact consent, last_reviewed_at | Join to existing authenticated accounts; protect private notes; safety-critical competence should be explicitly verified. |
| repair_cafe_availability | event_id, user_id, response available/maybe/unavailable, preferred_roles, note, updated_at | Unique(event_id,user_id); a simple preference, **not** an assignment. |
| repair_cafe_shift_slots | id, event_id, name/role, start_at, end_at, required_count, optional_skill, requirements | Eg sewing fixer 09:00–12:00, welcome 08:30–12:30. Supports half shifts. |
| repair_cafe_shift_assignments | id, slot_id, user_id, status requested/offered/accepted/confirmed/withdrawn/cancelled/no_show, confirmed_at, assigned_by | Unique(slot_id,user_id); prevent overlapping confirmed shifts and overfilling in a transaction/RPC. |
| repair_cafe_readiness_checks | event_id, key, status, checked_by, checked_at, note/reference | Venue, insurance, consent, risk plan, first aid, skills, repair exclusions, accessible layout, intake, comms. |
| repair_cafe_event_audit | event_id, actor_id, action, changed_at, safe metadata | Trace venue changes, assignment approvals, publication and cancellations; no secrets or bulk personal data. |
| repair_cafe_message_log (phase 2) | event_id, recipient/user_id, message_type, channel, sent_at, outcome | Never log secret tokens or full messages with unnecessary private details. |

Design note: skills are not licences. Add a separate verified-training/competency link to existing LMS assessments where safety matters; a self-declared "electrical" interest must never authorise mains work. Add a per-session station/category schedule so an advertised skill matches actual confirmed coverage and venue approval.

**DB safeguards:** event end after start; at most one confirmed primary venue per event; availability unique per volunteer+event; assignment requires appropriate programme membership and coordinator approval; shifts fall within setup/event/packdown windows; check selected programme server-side; safe transactional capacity/reassignment; no public direct select on private records. Use idempotent generation and double-submit protection.

## 6. Authorisation and privacy

- **Repair Café volunteer** (active Repair Café membership): read published/internal upcoming session basics and own availability, own profile, own assignments; edit own responses only.
- **Repair Café manager/coordinator** (an explicit per-programme manage-events permission): roster and venue management; read contact details only when necessary and consented; access repair café feedback if authorised.
- **Repair Café programme admin:** all Repair Café records and membership assignment, no unrelated E-waste/Library of Things data.
- **Global admin:** visibility across all programmes, with audited privileged writes.
- **Public/anonymous:** confirmed public event fields only; continue to submit the existing interest form without accessing roster data.

Use the current Supabase session + selected programme and enforce membership in both routes/actions and **RLS**. Do not rely on hidden navigation links for security. Distinguish the historic global profile role from the current per-programme membership role. Verify actual production definitions of private.is_programme_admin and related policies before reuse; specifically decide whether 'manager' may edit or only 'admin'. Never store access codes, private contacts or real roster data in GitHub or public source.

Consent-based onboarding: an interest form response with a contact email is a **lead to follow up**, not permission to auto-create an account or publish the person's name on a roster. Invite them to existing Repair Café volunteer sign-up, allow preference/profile completion, then offer monthly availability.

Volunteer names on event rosters should only be visible to coordinators and assigned on-the-day team members with a need to know; the public sees skills/categories and capacities, not contact details. Provide retention/deletion rules, an incident escalation path, and a manual fallback if internet is unavailable.

## 7. Publication, coverage and cancellation rules

### Event readiness gates

An organiser can save a draft at any point. The **Publish** action must fail with actionable errors unless:
1. Venue booking and specific repair activities are explicitly confirmed in writing.
2. Insurance/organising entity, risk assessment, first-aid and emergency arrangements are confirmed for that venue and date.
3. The required coordinator, welcome/intake and repair/safety competence coverage is **confirmed**, not merely "available".
4. Public opening hours, item limits, permitted categories and visitor instructions are complete.
5. Accessibility, child/public-space precautions, battery and mains boundaries, privacy/intake consent and safe exit routes are checked.
6. A contingency contact and cancellation/public update route is nominated.

These gates are configurable but **cannot be bypassed silently**. The initial guide suggests a bounded 3-hour pilot with 8–12 items, not a guaranteed capacity. Final thresholds and insurance rules need competent local review.

If a confirmed volunteer withdraws, flag a gap immediately. If a critical role or venue is missing, mark the event **at risk**, stop taking new visitor commitments, notify the coordinator and decide to replace, reduce repair scope, postpone or cancel. Never auto-reassign someone who marked unavailable. An advertised sewing station must disappear/be marked unavailable if no competent sewing fixer remains.

A cancelled or relocated *public* event must promptly update the public page and send opted-in notifications to affected visitors/volunteers. Keep previous statuses in audit history.

### Avoid these automation traps

- **No** automatic publishing just because the month begins or someone offers a hall.
- **No** auto-confirming a volunteer solely from their "available" tick.
- **No** implied volunteer commitment from their enduring skills profile.
- **No** sending direct messages to people who didn't opt in.
- **No** duplicate email/schedule messages when a form is refreshed/retried.
- **No** false "booking confirmed" UI before the backend commits state.

## 8. Monthly operating checklist (suggested; adjust with team)

**6–8 weeks ahead:** create/inspect next month's draft, approach venue hosts, propose repair scope and coordinator. Start availability collection; confirm insurance/host permissions.

**4 weeks ahead:** review volunteer responses and skills, propose shifts, request acceptance, confirm primary venue in writing and any activity restrictions. Start draft accessibility/safety layout.

**2–3 weeks ahead:** complete required coverage and readiness checks. Only then publish date/venue/categories publicly. Arrange promotion and any optional visitor booking slots.

**7 days ahead:** confirm roster, arrival times, transport/accessibility, tools and supplies; identify substitutes and a weather/venue cancellation decision owner.

**48 hours ahead:** short final reminder to confirmed volunteers and host, clear "reply if unable to attend" link, re-check published details.

**Event day:** lead checks in volunteers and visitors; record training/safety briefing; capture non-sensitive repair outcomes (fixed/diagnosed/referred/not attempted) and incidents through appropriate separate incident process.

**Within 7 days:** thank volunteers/host, record attendance and outcomes, close the event, reconcile venue cost and lessons learned, and open next month's draft.

**Capped admin effort:** review whether coordination is genuinely shared, not concentrated on one person. If coverage, host, safety or family/community capacity is inadequate, reschedule rather than push through.

## 9. Notifications and calendar

**MVP:** in-app status + optional, explicitly consented email from an approved service. Don't presume connected personal Gmail is an application notification backend. Admin should be able to copy a suggested message for manual sending until an email integration is configured.

Possible events:
- new monthly availability call;
- offer/accept/confirm shift;
- unfilled critical role alert to coordinator;
- booking confirmation;
- venue or time change;
- 7-day/48-hour reminder;
- cancellation;
- post-event thank you.

Each notification should have subject, relevant date/location, clear one-tap action, unsubscribe/preferences, safe idempotency key and delivery status. Respect time zone and quiet hours. Provide per-session downloadable ICS calendar links only for confirmed details; update or cancel the ICS when details change. A calendar invitation is **not** evidence of venue hire or volunteer acceptance.

## 10. Recommended route and rollout plan

| Phase | Internal/public routes to add or update | Shippable outcome |
|---|---|---|
| 0: this document | Existing Volunteer Hub links to this SOP/spec | Shared agreement about roles, process, permissions and scope. No invented bookings. |
| 1: MVP | /repair-cafe-volunteers (landing); /repair-cafe-volunteers/sessions; /repair-cafe-volunteers/sessions/[id]; /repair-cafe-volunteers/my-availability; /repair-cafe-volunteers/venues (coordinator) | Four-month drafts, venue offers, own availability, coordinator-approved shifts, missing-skill board. Database/RLS/auth tests; mobile layout. |
| 2: launch controls | readiness checklist; public /repair-cafe-dubbo "Next event" from confirmed published record | Safe public event display and cancellation flow; optionally downloadable calendar. |
| 3: communication/operations | notification prefs, reminders, roster print/export, attendance and outcome summary | More efficient recurring month-to-month administration. |
| 4: if demand supports | Public repair booking/queue, skills-driven shift suggestions, venue hosting portal | Only after pilot experience demonstrates a need. |

Do not create a second login at CircularEconomyDubbo. That site's internal Repair Café route already redirects to the canonical Volunteer Hub; retain the single hand-off/identity source. The existing LMS can link back to events and provide optional training/induction references, but must not duplicate roster records.

### Suggested internal navigation (Repair Café context only)

- Volunteer Hub
- My sessions
- My availability
- Skills & training (link to existing Learning Hub)
- Sessions & rosters (**coordinator only**)
- Venues & offers (**coordinator only**)
- Public feedback (**authorised managers/admins only**)
- Public page

Use an accessible list/card view on narrow screens (no horizontal multi-column roster as the only option). Test on common Android/iPhone widths. Provide a printable one-page event-day roster with only minimum necessary information.

## 11. Acceptance tests before calling this built

1. Barry marks **available for Feb 20**: he appears as available but **not confirmed**. He can mark March unavailable independently. No unwanted auto-assignments.
2. Jill lists sewing as a skill and marks **available Mar 20**, **unavailable Apr 17**: coordinator sees March sewing coverage candidate; April never lists her as available.
3. Venue host offers January: venue remains **offered**, January is **not published**. Only written confirmation and all safety/roster gates permit publication.
4. Library venue is confirmed for February but forbids soldering: approved categories exclude soldering; relevant shifts/advertising adapt.
5. Two coordinators attempt to fill the final single-seat shift concurrently: at most one confirmed assignment; loser gets a clear capacity message.
6. Volunteer withdraws from a confirmed shift: coverage decreases, coordinator sees at-risk warning, public repair category is reconciled.
7. Repair Café-only volunteer cannot view E-waste customers, Library-of-Things loans, another person's contacts, or manage any other programme. Programme-specific admin sees only their own programme.
8. Unauthenticated visitor sees only published date/venue/categories, not offers, private notes, names or emails.
9. Changing a public venue/time sends correct update (only to opted-in affected people) and preserves history.
10. Third Saturday schedule generated for Jan–Apr 2027 is 16 Jan, 20 Feb, 20 Mar, 17 Apr; manual changes override template without rewriting other months.
11. Refreshing, double-clicking or retrying availability/assignment doesn't create duplicate records or messages.
12. Mobile tests verify readable cards, visible status/actions, accessible form errors, keyboard operation and success/error feedback.
13. Empty data state shows **no confirmed events** and does not fabricate attendance, host commitments or volunteer bookings.
14. Production migrations have been checked against the actual schema; staging RLS and SQL tests pass *before* production release.

## 12. Open decisions for organisers

- Which group/entity legally operates each event and holds insurance? Does the host venue cover any activities or only premises?
- Who holds Repair Café **coordinator** permissions, and who approves venues and safety checklists?
- Is the third Saturday a target or a confirmed recurring preference? What are standard public and volunteer setup times?
- What minimum roster and repair categories are realistic at each venue?
- Which real host partners will be approached first, and are their written permissions adequate for the activities?
- How will the first volunteers be invited from consented public expressions of interest?
- Who can send official messages, handle consent, retain contact details and manage cancellations?
- Do we need a per-event public item booking workflow at all, or is capped walk-in triage enough for the first pilot?

## Related records

- [Venue research](DUBBO-REPAIR-CAFE-VENUE-RESEARCH-2026-10-08.md)
- [Public site specification](DUBBO-REPAIR-CAFE-PUBLIC-SITE-SPEC-2026-10-08.md)
- [Repair Café governance](DEEP-RESEARCH-2026-10-06-GENUINE-GAPS/09-REPAIR-CAFE-GOVERNANCE.md)
- [Family and organiser capacity](FAMILY-CAPACITY-ITAD-REPAIR-CAFE.md)
- [Learning phase 2](CIRCULAR-LEARNING-PHASE-2-ROLLOUT.md)
- [Current operations application](https://dubbo-ewaste-app.vercel.app/repair-cafe-volunteers)
