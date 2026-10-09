# Repair Café Dubbo — integrated operations build

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **9 October 2026 documentation reconciliation:** **Current navigation/status supplement:** Private Event Desk, monthly sessions, volunteer directory, self-service/QR, station leads/dispatch, knowledge base, operations/safety and event/annual reports now have routes. Distinguish stored attendance from verified real work, generated QR from successful phone check-in, source-only offline from tested sync, notification outbox from actual external delivery, and LMS completion from verified qualifications. The [live feature matrix](LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md) is the point-in-time status authority. See [documentation index](DOCUMENTATION-INVENTORY-AND-FRESHNESS-2026-10-09.md).


**Updated:** 9 October 2026. **Repository:** \`joshualparris/DubboEwaste\`, \`EwasteApp\`.
**Scope:** Existing private Repair Café programme, NOT a second login, SaaS subscription or separate public website.
**Intent:** Pilot-grade event-day and volunteer operations. It is **not** a substitute for real venue permission, insurance, electrical compliance or appropriately trained supervision.

## What is now in the repository

| Area | Implemented | Important boundary |
|---|---|---|
| Volunteer shift hours and collision checks | Start and finish per role; overlapping confirmed allocations rejected by Postgres; safe replacements in one assignment update; edits/rescheduling checked | No overnight shifts; individual shifts use local wall time |
| Venue administration | Venue directory, per-event booking state, contact-log method/outcome and written evidence reference | A logged host call does not equal signed venue permission |
| Training and competency | Shared LMS course IDs, coordinator assessments as training/supervised/verified/expired, expiry date, optional *verified* prerequisite per shift | Self-reported skills and LMS completion never automatically authorise regulated work |
| Notifications | Opt-in email/SMS destinations, outbox records, automated queued 48-hour reminders, shift confirmations and event-change/cancellation notices; secure dispatcher with idempotency/retries | **Sending is NOT ACTIVE without configured provider credentials, service-role key, cron secret and verified sender**; queued ≠ sent |
| Event Desk | Existing canonical \`repair_cafe_tickets\` + \`repair_cafe_stations\` with visitor acknowledgement, risk screening, safe queue, station selection, attempted work, outcomes, parts, advice, and per-ticket activity log | This is a community repair record, not AssetFlow E-waste intake or a commercial ticket |
| Photos and consent | Separate timestamped photo consent, JPG/PNG/WebP validation, private Supabase bucket, coordinator-only signed URLs, deletion | Never upload faces, passwords, personal papers or unconsented images |
| Safety and incidents | Visitor acknowledgement and safety state in Event Desk; private incident log with severity, immediate action, follow-up and states | On-site emergency response and venue policy take precedence over any app |
| Attendance | Coordinator-verified per-event in/out times for account and manually added volunteers | Volunteer hours count **completed** in/out pairs only |
| Repair impact | Tickets by outcome/category/barrier, attempted repair success rate, measured weight only, non-estimated hours | No inferred CO₂, waste avoided, or invented weights |
| Audit, archive, exports | Field-level change history metadata, selected operational activity trail, recoverable archives for sessions, manual volunteers and venues, CSV downloads and print view | Field-level history is **not** arbitrary point-in-time restore; archived volunteer shifts remain withdrawn |
| Mobile layouts | Responsive event-desk, roster and operations panels | Human signed-in phone/browser regression still needed |

## Where to use it

- **Sessions and rosters:** \`/repair-cafe-volunteers/sessions\` — monthly dates, venue booking stage, required role skills, shift times, substitutions and confirmed roster.
- **Manual volunteer directory:** \`/repair-cafe-volunteers/people\` — register people without app accounts, record permission, archive.
- **Visitor Event Desk:** \`/repair-cafe-volunteers/event-desk\` — check in portable items, safety and owner acknowledgement, stations, queue and repair outcome.
- **Operations and safety:** \`/repair-cafe-volunteers/operations\` — venue contact diary, verified competencies, real attendance, private images, incidents, opt-in communications, audit and restoration.
- **Reports and exports:** \`/repair-cafe-volunteers/reports\` — event outcomes and measured volunteer hours, printing and \`/repair-cafe-volunteers/reports/export?event=<uuid>&kind=tickets|hours|incidents|audit|venue_contacts\`.
- **Public page:** \`/repair-cafe-dubbo\` — only published, future, confirmed sessions.
- **Volunteer learning:** \`/learn?track=repair_cafe\` — courses and lessons; supervisors verify safe competence separately.

All links above live under \`https://dubbo-ewaste-app.vercel.app\`.

## Setup before the first live event

1. Confirm the organising group, insurance, safety and incident processes. Ask each venue what activities and tools are allowed, and retain written permission outside the public website.
2. Create a session and venue in **Sessions**. Log contact dates and host permission evidence in **Operations**. Record actual booking state and session-specific safety approval.
3. Set shifts including realistic setup/opening/pack-down times and competencies. A general welcome shift should ordinarily have no regulated-work prerequisite.
4. Invite or manually enrol volunteers only with consent. They mark the date available. Coordinators offer confirmed shifts; people confirm, or coordinators document an already agreed manual commitment. Beware overlapping shifts.
5. Volunteers can use the LMS, but an authorised coordinator must verify practical skill for any shift configured to require it. The database prevents unverified assignment into those slots.
6. Confirm venue and mandatory staffing; publish the public event only after readiness is verified. **Do not treat a draft date as an actual booking.**
7. Event day: check in a portable item, obtain acknowledgement, screen for hazard, then use the queue to direct safe work to a suitable station. Record outcomes even when nothing is fixed; enter advice.
8. Confirm separate consent for a photo. Only upload relevant item photos into the private storage bucket.
9. Record volunteer check-in/out, non-sensitive incident details and follow-ups; process incident emergencies outside the app immediately.
10. Close repair records, review duplicates, then export/print a defensible report. Do not multiply incomplete outcomes into invented environmental claims.

## Communication delivery (requires user-supplied provider setup)

The database queues reminder, confirmation, cancellation and change messages **only for opted-in event participants**. The dispatcher is \`GET /api/repair-cafe/dispatch\`, protected by \`Authorization: Bearer <CRON_SECRET>\`. Vercel is configured for one daily cron attempt at 21:00 UTC. NSW local execution is approximately 7am in standard time or 8am in daylight-saving time.

The following server-side Vercel environment variables must be configured for real delivery; **none should be committed into GitHub**:

| Variable | Purpose |
|---|---|
| \`CRON_SECRET\` | Long random secret; Vercel scheduled request Bearer protection |
| \`NEXT_PUBLIC_SUPABASE_URL\` | Existing Supabase project URL |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Server-only Supabase service role (never in browser or client source) |
| \`RESEND_API_KEY\` | Email provider credential |
| \`REPAIR_CAFE_FROM_EMAIL\` | Verified sender domain/from address |
| \`TWILIO_ACCOUNT_SID\`, \`TWILIO_AUTH_TOKEN\`, \`TWILIO_FROM_NUMBER\` | Optional SMS provider credentials and permitted sender |

The dispatcher claims only channels for which a provider has credentials, retries transient failure up to three attempts, and records \`sent\` only after a provider success. Provider status must be confirmed in the dashboard and at the provider before declaring delivery. Setting only the schedule without keys **will not send reminders**. Australian sender/regulatory conditions must be checked. Manual messaging is available as an application outbox, not an uncontrolled mailing list.

**Do not** attach a personal Gmail account to a background sender or assume connected Gmail is a safe production email service. Opt-in records can be revoked by volunteers. The application has no public messaging or venue-host portal.

## Photo and privacy notes

- The private \`repair-cafe-private\` Supabase Storage bucket permits only JPG, PNG and WebP, up to 5 MB per image.
- Photos need distinct consent from general repair participation; the time is stored and upload is blocked until consent is recorded.
- Anonymous visitors cannot read photos, the volunteer directory, incidents, hours, ticket notes, roster or communication destinations.
- Operational RLS is coordinator-gated; the canonical ticket desk also permits authorised Repair Café volunteers for safe, published-event ticket operations.
- No personal visitor name/email is required for an item check-in; identify the repair by queue/ticket number.
- Public-interest form submissions stay recruitment leads, not automatic volunteer accounts.
- Audit logs record changed **field names**, actor and timestamp but intentionally do not store visitor images or contact text in audit metadata.
- Data retention, incident legal requirements and external insurance/safety documentation need an agreed community policy before launch.

## Database and application additions

Additive migrations under \`EwasteApp/supabase/migrations\`:
- \`20261009170000_repair_cafe_event_operations.sql\`
- \`20261009171500_repair_cafe_ticket_operations_link.sql\`
- \`20261009173000_repair_cafe_optin_notice_scheduler.sql\`
- \`20261009173500_repair_cafe_provider_scoped_claim.sql\`
- \`20261009174500_repair_cafe_confirmations_event_conflicts.sql\`
- \`20261009175500_repair_cafe_archival_and_audit.sql\`
- \`20261009180000_repair_cafe_audit_key_fix.sql\`
- \`20261009181000_repair_cafe_atomic_substitution.sql\`
- \`20261009183000_repair_cafe_competency_assignment_guard.sql\`
- \`20261009184500_repair_cafe_photo_consent.sql\`

The **canonical** check-in/repair queue is in \`repair_cafe_tickets\` and \`repair_cafe_stations\`, with their existing RPC, not in general E-waste repair inventory. An auxiliary \`repair_cafe_visits\` schema was created additively during development, but the Event Desk is still canonical and volunteers should not double-enter visits into it. Do not introduce a second public booking record without a migration plan.

## Tests run / further acceptance needed

**Database tests (executed with BEGIN + ROLLBACK and synthetic records; none persisted):**
- Assignment conflicts for overlapping confirmed shifts are rejected.
- A valid partial shift time update is accepted.
- Coordinators can record attendance, incident and venue histories with private audit metadata.
- Archiving a manually recorded volunteer withdraws confirmed assignments; archived dates can be reused without losing history.
- Missing verification blocks a shift with a required course; a verified person can be assigned; changing an already occupied role to a prerequisite the person does not meet fails.
- Publication readiness refuses unqualified/missing roles and accepts verified, filled positions.

**Automated build:** project uses existing Learning, Mobile (source guard), Programme Auth and Next.js TypeScript gates. A green build does **not** prove all signed-in journeys work on Android/iPhone. Browser end-to-end with 2 different roles, queue numbering, photo upload, network recovery, email and SMS delivery is still required before a live public event.

**Important remaining external steps:** obtain real venue permissions and risk/insurance approval; configure and verify sender domains, SMS regulatory permissions and service secrets; perform an authorised multi-account end-to-end browser test; decide local privacy retention policy. None of these can be honestly marked complete by pushing code.
