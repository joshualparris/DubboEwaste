// Static regression guard for Repair Café operations. This complements, but never
// replaces, end-to-end RLS, database transaction and authenticated browser tests.
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const migrations=read("supabase/migrations/20261009170000_repair_cafe_event_operations.sql");
const training=read("supabase/migrations/20261009183000_repair_cafe_competency_assignment_guard.sql");
const reminders=read("supabase/migrations/20261009173000_repair_cafe_optin_notice_scheduler.sql");
const photos=read("supabase/migrations/20261009184500_repair_cafe_photo_consent.sql");
const actions=read("app/(private)/repair-cafe-volunteers/operations/actions.ts");
const shiftActions=read("app/(private)/repair-cafe-volunteers/sessions/manage-actions.ts");
const desk=read("app/(private)/repair-cafe-volunteers/event-desk/page.tsx");
const reports=read("app/(private)/repair-cafe-volunteers/reports/page.tsx");
const dispatcher=read("app/api/repair-cafe/dispatch/route.ts");
const csv=read("app/(private)/repair-cafe-volunteers/reports/export/route.ts");
const cron=JSON.parse(read("vercel.json"));
for(const name of ["repair_cafe_venue_contacts","repair_cafe_competencies","repair_cafe_incidents",
 "repair_cafe_attendance","repair_cafe_notifications","repair_cafe_audit"])
 assert(migrations.includes(name),"Missing operational table "+name);
assert(migrations.includes("public,file_size_limit"),"Private image bucket requirement missing");
assert(training.includes("verified")&&training.includes("rc_roster_competency_guard"),"Missing competency gate");
assert(reminders.includes("notify_email")&&reminders.includes("email_opt_in"),"Reminder opt-in predicate missing");
assert(photos.includes("rc_photo_consent_guard"),"Photo consent enforcement missing");
assert(actions.includes('field(f,"photo_consent")!=="yes"'),"Photo consent must be required in upload action");
assert(desk.includes("visitor")&&desk.includes("queue"),"Canonical Event Desk missing");
assert(shiftActions.includes("substituteVolunteer")&&shiftActions.includes("starts_at"),"Partial shift substitution missing");
assert(reports.includes("measured_weight_kg")&&!reports.includes("co2_avoided_kg"),"Measured-only reporting lost");
assert(csv.includes("Coordinator access required")&&csv.includes("Content-Disposition"),"Protected report export missing");
assert(dispatcher.includes("process.env.CRON_SECRET")&&dispatcher.includes("process.env.SUPABASE_SERVICE_ROLE_KEY"),
 "Dispatcher must fail closed without service secrets");
assert(!dispatcher.includes("console.log(job.destination)"),"No recipient logging");
assert(cron.crons?.some(c=>c.path==="/api/repair-cafe/dispatch"),"Daily dispatcher schedule missing");
const live=read("app/(private)/repair-cafe-volunteers/event-desk/LiveQueue.tsx");
const realtime=read("supabase/migrations/20261009190000_repair_cafe_live_queue.sql");
const deskPage=read("app/(private)/repair-cafe-volunteers/event-desk/page.tsx");
assert(realtime.includes("alter publication supabase_realtime add table public.repair_cafe_tickets")&&
  realtime.includes("alter publication supabase_realtime add table public.repair_cafe_stations"),"Realtime publication missing the scoped operational tables");
assert(!realtime.includes("add table public.repair_cafe_manual_volunteers"),"Private volunteer contacts cannot be replicated");
assert(live.includes('filter:"event_id=eq."+eventId')&&
  live.includes('schema:"public",table:"repair_cafe_tickets"')&&
  live.includes('schema:"public",table:"repair_cafe_stations"'),"Subscriptions must be filtered to selected event");
assert(live.includes("setInterval")&&live.includes("visibilitychange")&&
  live.includes("navigator.onLine"),"Realtime must include reliable fallback refresh");
assert(live.includes("Live updates connected")&&live.includes("Last checked"),
 "Show a truthful live connection/synchronisation status");
assert(deskPage.includes("<LiveQueue")&&!deskPage.includes("Refresh to see another volunteer"),
 "The Event Desk must render live queue instead of a stale manual-refresh board");
const progressSql=read("supabase/migrations/20261009192000_repair_cafe_interim_repair_progress.sql");
const progressUI=read("app/(private)/repair-cafe-volunteers/event-desk/ProgressOutcomeFields.tsx");
const deskActions=read("app/(private)/repair-cafe-volunteers/event-desk/actions.ts");
assert(progressSql.includes("progress_code")&&progressSql.includes("p_expected_updated_at"),
 "Interim progress and server-side conflict prevention are required");
assert(progressSql.includes("perform public.repair_cafe_save_ticket(")&&progressSql.includes("progress_code=p_progress_code"),
 "Progress writes must reuse the original permission/safety rules");
assert(progressUI.includes('name="progress_code"')&&progressUI.includes('name="outcome"')&&
 progressUI.includes('status==="completed"'),"Interim finding must not be counted as final outcome");
assert(deskActions.includes('repair_cafe_save_ticket_with_progress')&&
 deskActions.includes("p_expected_updated_at:revision"),
 "Ticket updates must use checked, audited progress RPC");
assert(live.includes("progressChoices")&&live.includes("Progress so far:")&&
 live.includes("a.progress_code"),"Live view and timeline must show partial findings");
assert(deskPage.includes("note,progress_code,created_at")&&
 deskPage.includes("outcome,progress_code,barrier"),"SSR snapshot must include progress");
const queueNoteSQL=read("supabase/migrations/20261009195000_repair_cafe_waiting_queue_notes.sql");
const queueNoteUI=read("app/(private)/repair-cafe-volunteers/event-desk/WaitingQueueNotes.tsx");
assert(queueNoteSQL.includes("old_ticket.status<>'waiting'")&&
 queueNoteSQL.includes("old_ticket.updated_at is distinct from p_expected_updated_at")&&
 queueNoteSQL.includes("private.has_program('repair_cafe')"),
 "Queue editing must require waiting status, current revision and Repair Café membership");
assert(queueNoteSQL.includes("problem_snapshot")&&queueNoteSQL.includes("queue_note_snapshot")&&
 queueNoteSQL.includes("insert into public.repair_cafe_ticket_activity"),
 "Queue note corrections must be recorded in repair history");
assert(queueNoteUI.includes('name="reported_problem"')&&queueNoteUI.includes('name="queue_notes"')&&
 queueNoteUI.includes("outdated"),
 "The waiting editor must support intake corrections, additional notes and stale-form protection");
assert(live.includes("<WaitingQueueNotes")&&live.includes("t.status===\"waiting\"")&&
 live.includes("queue_note_snapshot"),
 "Live queue must show editable notes only while waiting and display their edit history");
assert(deskPage.includes("reported_problem,queue_notes")&&
 deskPage.includes("problem_snapshot,queue_note_snapshot"),
 "First page load must include updated queue notes and history");
console.log("Repair Café operations source QA PASS: 29 feature/privacy checks. Not a signed-in browser test.");
