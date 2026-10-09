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
console.log("Repair Café operations source QA PASS: 12 feature/privacy checks. Not a browser delivery test.");
