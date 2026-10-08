# Dubbo Circular Learning · phase 2 rollout and test plan
Updated 8 October 2026 · source-controlled implementation, not an independent accreditation.

## Delivered
- 28 courses and 84 short lessons from the project's research corpus.
- 12 curated media items spanning videos, podcasts and illustrated/official guidance.
- Media with clear source type (primary, practitioner, vendor, community), caveats, prompts and a direct provider link; no iframe-only dependency. Recorded media progress is a learner's own acknowledgement, not verified watch time.
- Course assignments limited to programme administrators and eligible programme members, with target dates and My Assigned Learning.
- Practical written reflections unlocked only after finishing course lessons. Supervisor review needs an authorised programme admin; approval requires confirmed direct observation and specific notes. Self-review is prohibited by the database constraint.
- Separate Library of Things volunteer code rotation, available only to global administrators at Learning Hub > Supervisor desk. A 48-character high-entropy code is displayed once. The previous code stops working for new signups; existing accounts remain.
- Shared circular research sign-in: volunteer opens /circular-access on AssetFlow, authenticates there, then submits a one-time hand-off to Circular Economy Dubbo. An anonymous *redeem* API may only consume a pre-issued random ticket, valid two minutes. It never returns passwords or DB tokens. Legacy research codes remain as fallback. The research session expires in eight hours.

## User paths
- Learning catalogue: https://dubbo-ewaste-app.vercel.app/learn
- Supervisor desk: https://dubbo-ewaste-app.vercel.app/learn/manage (only authorised programme admins/global admins)
- Circular research SSO entry: https://dubbo-ewaste-app.vercel.app/circular-access
- Circular research public login: https://circular-economy-dubbo.vercel.app/login
- Public Repair Café: https://dubbo-ewaste-app.vercel.app/repair-cafe-dubbo

## Access boundaries
- All active volunteers may discover learning content across pathways, but operations remain assigned programme-only.
- Learner enrolment, progress, media acknowledgements, assignments and practice submissions have RLS.
- Programme administrators can assign and review **their own programme**, not others. A global admin manages all three.
- An approved practical means **supervisor-observed activity only**. It is not a trade certification, legal permission for electrical work, or evidence that all safety competency requirements are met.
- Never expose permanent Supabase credentials or access codes in documentation, GET query parameters, public repository files or logs.
- The SSO ticket is a one-time, two-minute POST hand-off. Tickets are stored hashed; consumption deletes the record. Circular's own SESSION_SECRET signs a limited research cookie and is not shared with AssetFlow.

## Known limitations and safety
- Videos are linked directly because providers may forbid playback on other websites; source links and documented language do not prove all 2026 playback/caption availability.
- Reflection checks are self-reported, not timed or monitored.
- No upload of visitor data, customer photos, device passwords or identifiable private evidence into practice reflections.
- The signup-code issuance button must be run by an authorised global admin before Library of Things volunteer registration is usable. It cannot be automatically emailed, and it is never written to Git.
- Existing Circular code-login remains temporarily usable for legacy coordinators. New volunteers should use the shared account.
- The external POST hand-off has not been tested with a human login until an authorised volunteer completes a full browser journey.
- Supervisors should verify their duties and approved work boundaries before treating any written exercise as observed practice.

## Acceptance tests (manual, needed before claiming complete end-to-end assurance)
1. Sign in as an active Repair Café-only volunteer; access Learning Hub and media, but not e-waste assets or CRM.
2. Join a course, complete three lessons, record media, submit reflection; refresh and verify progress persists.
3. Sign in as a programme supervisor; assign a course to a member of that programme. Verify another programme's roster isn't visible.
4. Review a practical; approval without direct observation fails, self-review fails, a valid directly observed review succeeds and appears to learner.
5. Sign in as a Library of Things-only volunteer using a coordinator-issued code; see courses and no Repair Café / ITAD operations.
6. Sign in via Circular Economy's primary button; complete the POST handoff, reach /internal, refresh, and confirm old ticket cannot be reused.
7. Verify the research site blocks an expired/invalid ticket and redirects safely without revealing any code.
8. Test 360px, 390px and tablet widths, focus order, keyboard controls and reduced motion; verify no horizontal scrolling.
9. Open every video/podcast URL and inspect captions or alternative text with a real browser. Repair broken/deleted links.
10. Record supervisor audit and ensure no programme admin can read other programmes' learner reflections.

Database migrations: 019 (existing learning), 020 (media, assignments, practice, library code), 021 (research one-time handoff). Keep migration history consistent with the live schema.
