# Repair Café Dubbo — live reception and station queue

**Implementation:** 9 October 2026 · existing DubboEwaste/AssetFlow Repair Café programme.

## User experience

At \`/repair-cafe-volunteers/event-desk\`, signed-in programme volunteers now see:
- **Connection status:** Live updates connected / Connecting / Reconnecting with periodic checks / Offline.
- **Live event totals:** checked in, waiting, at stations and closed outcomes.
- **Reception board:** current waiting queue with ticket number, first name/nickname, item and hazard-review flags.
- **Station board:** each station's active tickets and availability.
- **Live ticket editor:** queue tabs (waiting and active / at stations / finished / all), station allocation, safety checks, work and outcome entry, and existing ticket history.
- **Sync now:** a manual recovery option, but not required during normal work.

All changes are scoped to the **selected event ID**. The original visitor consent/safety RPC and session/role checks remain authoritative; the browser never bypasses these writes. The event desk uses one canonical \`repair_cafe_tickets\` record per visitor item.

## Data flow

1. The server page loads the initial station, ticket and activity snapshot using an authorised Supabase session.
2. The client component uses \`lib/supabase/browser.ts\` and subscribes to the \`supabase_realtime\` publication for \`repair_cafe_tickets\` and \`repair_cafe_stations\` with \`event_id=eq.<selectedEventId>\` filters.
3. On insert/update/delete notifications, it debounces changes then re-fetches **only the selected event** using the current authenticated user's RLS-protected client session.
4. It updates ticket cards, counts, reception list, station occupancy and activity history without a full page navigation or refresh.
5. A 30-second foreground poll and browser online/visibility listeners recover from missed events and disconnections. Offline displays the last available snapshot with a warning; it does **not** pretend to support offline writes.
6. During an open ticket edit, if that ticket's \`updated_at\` changes elsewhere, saving is disabled until the editor is closed and reopened to avoid accidentally overwriting newer information.

## Privacy

- The Realtime publication includes **only** event ticket and station tables.
- Supabase Postgres Changes enforces the existing **Repair Café membership RLS**. Anonymous users do not have SELECT grants on those tables.
- Subscriber filters use an event UUID; moving to another event destroys the old subscription.
- These rows can include volunteer-entered repair notes and visitor first names, so this workspace must only be used by authorised staff or volunteers; do not broadcast it publicly.
- Volunteer contacts, incidents, learning records, photo storage, and notification destinations are **not** added to the Realtime publication.
- Never expose the Supabase service role or privileged API keys to browsers.

## Source files

- \`EwasteApp/app/(private)/repair-cafe-volunteers/event-desk/LiveQueue.tsx\`
- \`EwasteApp/app/(private)/repair-cafe-volunteers/event-desk/page.tsx\`
- \`EwasteApp/app/(private)/repair-cafe-volunteers/event-desk/event-desk.module.css\`
- \`EwasteApp/supabase/migrations/20261009190000_repair_cafe_live_queue.sql\`
- \`EwasteApp/scripts/repair-cafe-operations-qa.mjs\`

## Validation and deployment checklist

- [x] Add ticket and station tables to Supabase Realtime (without changing member RLS)
- [x] Query and verify publication membership includes only the two intended Repair Café tables
- [x] Check anon SELECT grant is absent on tickets/stations
- [x] Add compile/build-time test for event-scoped subscription, fallback and live UI
- [ ] Verify **live websocket delivery in two simultaneously signed-in browsers** using a test event and test users
- [ ] Verify reception inserts a ticket and second screen displays first name, item and position automatically
- [ ] Verify station A takes the ticket and station B sees changed station assignment without navigation
- [ ] Verify completion updates all clients' counts and ticket status
- [ ] Verify reception cannot see another programme and signed-out user cannot receive events
- [ ] Verify Android/mobile behaviour with on-screen keyboard and open editor during someone else's update
- [ ] Verify reconnect after turning Wi-Fi off/on, background tab wake, and safe recovery after access revocation

**Important:** A green Vercel TypeScript build and Postgres publication membership do not prove that two-user WebSocket delivery works. Field-test those before relying on this system at a live Repair Café.

## Operator rehearsal

1. Create or select a non-public **draft test event** as a coordinator; add a sewing and computer station.
2. Sign in as a Repair Café volunteer on a second device and open the **same** event desk.
3. Check in test visitor **Bob** with item **laptop** on device A.
4. Confirm device B shows **Bob / laptop** in Waiting, then allocate the computer station and save In progress.
5. Confirm both boards update; complete the ticket and check live outcome counts.
6. Re-run the test after disconnecting Wi-Fi and reconnecting. The fallback poll refreshes within 30 seconds while the tab is visible.
7. Keep synthetic entries in the test event clearly labelled, then clean them up using the permitted correction flow.

Do not enter real visitors' legal names, phone numbers, passwords, photos or identifying documents for the rehearsal.
