# Repair Café Dubbo — interim repair findings versus final outcome

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **9 October 2026 documentation reconciliation:** This is a **specific 9 October bug/workflow implementation record**, not a complete list of today's Event Desk functionality. The app now has separate interim notes/status and final repair outcomes with ticket history; test that progress notes remain available and never falsely imply a final outcome. See the live feature register for the current scope. See [current verified features](LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md) and [documentation freshness index](DOCUMENTATION-INVENTORY-AND-FRESHNESS-2026-10-09.md).


**Fixed:** 9 October 2026. **Route:** \`/repair-cafe-volunteers/event-desk\`.

## Why this exists

The old ticket form allowed selecting **Partially fixed** while the ticket remained **In progress**, but the underlying database correctly refused to write a *final* outcome before closing the ticket. This produced the confusing error: "Outcome must be empty until closed."

A partially working item does not automatically mean the repair attempt has ended. Volunteers need a simple way to record progress, setbacks and additional work over several steps.

## New volunteer workflow

1. Open a ticket in the Event Desk.
2. Choose **In progress**, assign a suitable station, and leave the repair ticket open.
3. Under **Progress so far**, record a status such as **Partly working / partially repaired**, **Awaiting replacement parts**, **Progress made, not yet working**, or **Further work still needed**.
4. Enter a **Repair notes / milestone** describing the actual work done (e.g., "power LED now lights, screen still blank"). Save.
5. Repeat as needed. The latest interim finding shows on the live ticket and a timestamped snapshot of each save appears in **Change history**.
6. When the attempt finishes, change the ticket to **Completed** and select a final outcome: **Fully fixed**, **Partially fixed** or **Not fixed**. **Referred** and **Not attempted** produce their corresponding final outcomes.
7. Impact reports still count actual final outcomes, not interim "partly working" milestones.

## Data and safety implementation

- Add \`progress_code\` to canonical \`public.repair_cafe_tickets\` and \`public.repair_cafe_ticket_activity\` (null by default for existing records).
- New restricted \`public.repair_cafe_save_ticket_with_progress\` RPC checks Repair Café programme membership, rejects stale \`updated_at\` editor submissions, calls the **existing** \`repair_cafe_save_ticket\` safety/closure RPC, then records the interim code on the ticket and its activity event in the same transaction.
- Existing status/outcome integrity constraints **remain unchanged**. An open ticket retains \`outcome = NULL\`.
- Interim progress is visible to the event-scoped Realtime subscription because it updates the canonical ticket.
- The UI switches between the interim progress selector and final closure selector based on ticket status, preventing the original ambiguous combination.
- The history retains each repair update, including its accompanying progress code and volunteer note.
- No extra visitor personal information is required and no records are deleted or reset.

## QA

- Applied \`EwasteApp/supabase/migrations/20261009192000_repair_cafe_interim_repair_progress.sql\`.
- Rolled-back synthetic SQL test passed: an open ticket accepted a \`partly_working\` milestone with final outcome NULL, activity history captured the milestone, a premature final outcome was rejected, an outdated editor save was rejected, and final \`partially_fixed\` worked after completion.
- Production build and signed-in browser test status must be confirmed separately; database QA does not imply delivery verification.

## Acceptance walkthrough

Use a clearly marked test event and visitor "Bob" with a test laptop. Start a repair; select **In progress**, the computer station and **Partly working**; record "power works, no display". Confirm the live ticket stays In progress and shows the interim note. Update a second time, then close as Partially fixed and confirm the actual reported repair outcome changes from unfinished to partially fixed. Repeat with a second browser to verify progress updates without refreshing.
