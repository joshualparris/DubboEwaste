# Repair Café Dubbo — editing notes while waiting

Updated 9 October 2026.

## Change

Waiting tickets in the private [Event Desk](https://dubbo-ewaste-app.vercel.app/repair-cafe-volunteers/event-desk) have a new **Edit queue notes** panel directly below the reported problem. The receptionist or other signed-in Repair Café volunteer can:
- Correct the visitor's original **reported problem**, e.g. "Needs three buttons sewn" instead of "Needs buttons sewn".
- Add or update **additional queue notes**, e.g. "Visitor brought replacement buttons", up to 1,000 characters.
- Save without assigning a repair station, starting a repair, marking partial progress, or closing the ticket.

The current fault description and extra queue notes are immediately shown on the ticket and updated on other signed-in screens through the existing event-scoped Realtime subscription. A timestamped ticket activity entry records the corrected description and notes. The ticket remains **Waiting** and is not counted as a completed repair.

Once **In progress**, volunteers should use **Repair notes / milestone** and **Progress so far**, rather than rewriting intake notes.

## Security and integrity

- Database migration: \`EwasteApp/supabase/migrations/20261009195000_repair_cafe_waiting_queue_notes.sql\`.
- Existing \`repair_cafe_tickets\` and \`repair_cafe_ticket_activity\` tables; no second queue or visitor record.
- \`public.repair_cafe_edit_waiting_notes\` requires authenticated Repair Café membership, checks that the event is active for that user, locks the ticket, checks status is **Waiting**, rejects stale \`updated_at\` submissions, validates lengths, and records a history snapshot. No public access to notes is created.
- The existing repair ticket save/outcome logic remains unchanged.
- Form warns if another volunteer changes the ticket while it is being edited, and disables saving until reopened.

## Validation

A rollback-only SQL test verified: correcting the reported problem, adding notes without changing the waiting status or final outcome, writing history, rejecting stale edits, and preventing queue-only edits once work begins. No synthetic ticket persisted.

Automated Next.js source checks verify the new editor, RPC restrictions and event-scoped data are included. A signed-in two-browser UI test remains necessary before a public Repair Café session.
