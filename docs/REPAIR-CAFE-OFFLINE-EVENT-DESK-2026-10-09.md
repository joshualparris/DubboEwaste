# Repair Café Dubbo — encrypted offline Event Desk

**Implemented:** 9 October 2026. **App:** \`EwasteApp\` within \`joshualparris/DubboEwaste\`.

## What it supports

### The existing Event Desk tab stays open
1. Sign in and select the correct session at \`/repair-cafe-volunteers/event-desk\`.
2. Enable **Offline Event Desk** while online, choosing a private passphrase of **at least 12 characters**. The passphrase is never stored; AES-GCM with PBKDF2 (220,000 iterations) encrypts all queued action payloads in IndexedDB.
3. If the internet drops, continue entering **visitor check-ins**, **waiting queue notes** and **repair updates/milestones**. The Event Desk saves them in an encrypted device-only outbox. Each action receives an immutable random UUID.
4. A saved offline check-in has **no official queue number**. Record temporary paper numbers if needed; tell visitors that the shared station board is not current.
5. The visible outbox counts and lists unprocessed actions. The existing board is a cached in-memory snapshot and should **not** be treated as live while offline.
6. On reconnection, the app checks the signed-in account against the original account, synchronises operations in order and refreshes the live board. If a ticket has changed since the last snapshot, the pending edit becomes **Conflict** and remains available for manual review.
7. You can view saved values for conflicts, retry the original version (which will NOT bypass optimistic concurrency), save an encrypted JSON backup or deliberately discard a local record after confirming.

### Browser tab closed or reloaded during an outage
After a successful vault unlock while online, the app registers a limited service worker. Its **only cached page** is a public, non-personalised offline fallback. It never caches a private Next.js Event Desk response, private repair records, photos, cookies, API responses or Supabase requests.

If someone reopens the Event Desk while still offline, \`/repair-cafe-offline.html\` opens automatically. Enter the same offline passphrase to decrypt:
- the last **encrypted queue and station snapshot** (marked stale);
- the existing encrypted pending outbox;
- a minimal check-in form and editors for waiting notes or interim repair milestones on snapshot tickets.

The fallback does **not** issue queue numbers, send messages or claim to have coordinated multiple devices. When internet returns, open the normal Event Desk as the same volunteer and unlock the vault to synchronise.

**Supported offline writes:** check-in, queue-note correction, ticket state/progress and repair milestones. **Requires internet:** account login/registration, rosters, venues, safety incident forms, photo uploads, notifications, learning, reporting, and station directory CRUD. Existing browser session must be valid again for synchronisation.

## Database deduplication and conflict prevention

\`20261009199000_repair_cafe_offline_sync.sql\` and follow-up \`20261009199100_repair_cafe_offline_sync_qualified_status.sql\` provide:
- \`repair_cafe_offline_receipts\`: unique operation UUID, authenticated user ID, event ID, kind, payload hash and non-sensitive acknowledgement. No visitor text is stored in receipts.
- \`repair_cafe_apply_offline_operation\`: membership-authenticated RPC with advisory transaction lock on operation UUID.
- **Idempotency:** when a request succeeds but the acknowledgement is lost, retrying the **same operation ID and payload** returns its original receipt, not another check-in. Reusing that ID for different payloads is rejected.
- **Ticket conflicts:** queue notes and ticket updates include the original \`updated_at\`. The existing guarded functions refuse stale edits. The original safety checks, station rules, repair closure constraints and activity history remain in force.
- **Atomic commits:** a receipt is written only if the ticket operation succeeds, in the same PostgreSQL transaction. No partial check-in or false success acknowledgement.
- **Events:** cancelled/completed events reject new operations. Session permissions are rechecked at sync time, not assumed from offline access.
- **Authorisation:** signed-in user must match the local vault owner. No service-role keys are shipped to browsers; direct ticket write privileges are not granted.

## Privacy / recovery / limitations

- Device storage is encrypted under a phrase the organiser/user must remember. Neither Supabase nor GitHub can recover a forgotten phrase.
- Use **trusted devices only**, with device lock, and do not type surnames, passwords, health notes or document photos. Someone who knows the offline phrase can unlock that device's saved data.
- Private/incognito browser storage may be discarded by the browser. A user can export an **encrypted JSON backup**, but the current UI does not provide self-service restore/import of that backup.
- Local browser storage can be lost if the user clears site data, uninstalls their browser or the device fails. Agree on data retention and device-lending policy before a real public event.
- A missing or invalid account session will block synchronisation until the user signs in again. Conflict edits are retained, **never automatically overwritten**.
- If two devices are offline at the same time, they have independent draft queues; offline numbers and arrivals will not be coordinated until both synchronise. Keep a paper attendance/intake sheet for safety.
- Do not use the offline snapshot to determine whether another repairer is free, assess new hazards or authorise work. Physical reception controls the floor.
- Offline mode has been implemented as a browser feature, **not** a native installable app; installation to the phone's home screen is optional and not tested.

## Testing completed

Ran Supabase SQL in a rolled-back transaction with a synthetic event and tickets, verifying:
1. Replaying an offline check-in UUID doesn't create a duplicate ticket.
2. Replaying that UUID with different content is rejected.
3. An offline waiting-note edit is recorded in the canonical ticket and activity log.
4. A competing stale note edit is rejected.
5. An interim repair milestone can be saved without closing its ticket, including ticket activity history.
6. A stale closure based on the old revision is rejected.

The Vercel build gate also tests the presence of encrypted local storage, privacy-safe service worker, event-scoped ticket snapshot, conflict handling and the intended offline form wiring.

**Still required before relying on it at a real event:** run a signed-in browser test on Android/iPhone and desktop: unlock once online, disconnect Wi-Fi, add three actions, reload while offline, unlock fallback, reconnect, check official queue numbering, confirm no duplicates, test stale conflicts and verify that revoking a membership stops synchronisation. Also test closing/reopening tabs, private browsing differences and storage quotas.

## Files

- \`EwasteApp/app/(private)/repair-cafe-volunteers/event-desk/offline-store.ts\`
- \`EwasteApp/app/(private)/repair-cafe-volunteers/event-desk/OfflineDeskShell.tsx\`
- \`EwasteApp/public/repair-cafe-offline.html\`
- \`EwasteApp/public/repair-cafe-sw.js\`
- \`EwasteApp/supabase/migrations/20261009199000_repair_cafe_offline_sync.sql\`
- \`EwasteApp/supabase/migrations/20261009199100_repair_cafe_offline_sync_qualified_status.sql\`

\`docs/REPAIR-CAFE-OFFLINE-EVENT-DESK-2026-10-09.md\` is the operator handover.
