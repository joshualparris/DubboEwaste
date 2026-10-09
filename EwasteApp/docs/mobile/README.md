# AssetFlow mobile audit

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **Coverage note (9 October 2026):** This document records the *particular Chromium fixture run described below*, not certification of all newly added private Repair Café pages. Additional routes include Event Desk, live queue, offline capture, QR check-in, station dispatch, volunteer self-service, knowledge, safety and reports. `npm run qa:mobile` is a source-level guard; `npm run qa:mobile:browser` is the rendered-browser check. Complete **authenticated, populated, role-scoped Android/iPhone walkthroughs** before claiming all mobile screens are correct. See [feature verification](../../../docs/LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md).


All 50 route page components and all 23 seeded documents were rendered in Chromium at 320, 390, 768 and 1280 pixels. Populated and empty list/form states use synthetic database records and mocked Next.js/server-action boundaries. Detail routes use populated records. The root redirect is recorded separately. This is not a live authenticated data or backend audit.

The report records 452 route/document viewport cases plus one client interaction case. Checks cover viewport overflow (with root clipping disabled), control bounds, 16px input text and readable mobile record widths. Mounted client components verify batch selection, selected QR label count, print cleanup, clearing selection, bounded navigation, Escape and menu-link dismissal.

Run `npm install`, `npx playwright install chromium`, then `npm run qa:mobile:browser`. Reports and screenshots are written to a temporary directory, or to `MOBILE_QA_OUTPUT`. The lighter `npm run qa:mobile` checks source structure only.

Operational tables become labelled records at phone widths, retaining the same forms and checkboxes. Quotes and Markdown document tables keep horizontal scrolling to preserve column relationships. Desktop and print layouts retain tables. Navigation uses a bounded scrolling overlay.

See [audit-results.json](audit-results.json) for per-page cases and [assets-mobile.png](assets-mobile.png) for the synthetic client-component preview.
