// Source contract checks; does not replace authenticated browser or SQL RLS tests.
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve} from "node:path";

const root=process.cwd();
const get=(file)=>readFileSync(resolve(root,file),"utf8");
const checks=[
 ["public page","app/repair-cafe-dubbo/page.tsx"],
 ["event desk","app/(private)/repair-cafe-volunteers/event-desk/page.tsx"],
 ["event desk actions","app/(private)/repair-cafe-volunteers/event-desk/actions.ts"],
 ["event desk report CSV","app/(private)/repair-cafe-volunteers/event-desk/export/route.ts"],
 ["operations","app/(private)/repair-cafe-volunteers/operations/page.tsx"],
 ["reports","app/(private)/repair-cafe-volunteers/reports/page.tsx"],
 ["volunteer directory","app/(private)/repair-cafe-volunteers/people/page.tsx"],
 ["monthly rosters","app/(private)/repair-cafe-volunteers/sessions/page.tsx"],
 ["canonical ticket migration","supabase/migrations/20261009163000_repair_cafe_event_desk.sql"],
 ["operations migration","supabase/migrations/20261009170000_repair_cafe_event_operations.sql"],
 ["audit and reporting integration","supabase/migrations/20261009171500_repair_cafe_ticket_operations_link.sql"]
];
for(const [name,file] of checks)assert.ok(existsSync(resolve(root,file)),name+" missing: "+file);
const desk=get(checks[1][1]),actions=get(checks[2][1]),csv=get(checks[3][1]),
 sql=get(checks[8][1]),ops=get(checks[4][1]),reports=get(checks[5][1]),
 nav=get("components/AppNav.tsx");
assert.match(actions,/requireProgrammeContext/,"Repair Café event actions must check signed-in context");
assert.match(actions,/repair_cafe_check_in/,"Event Desk must use the guarded check-in RPC");
assert.match(actions,/repair_cafe_save_ticket/,"Event Desk must use the guarded repair RPC");
assert.match(desk,/risk_notes/,"Event Desk safety screening missing");
assert.match(desk,/Visitor check-in/,"Visitor check-in UI missing");
assert.match(desk,/Repair stations/,"Station allocation UI missing");
assert.match(desk,/Live queue/,"Repair queue UI missing");
assert.match(desk,/Offline paper fallback/,"Paper fallback instructions missing");
assert.match(sql,/repair_cafe_tickets enable row level security/,"Ticket RLS must be on");
assert.match(sql,/repair_cafe_ticket_activity enable row level security/,"Repair history RLS must be on");
assert.match(sql,/revoke all on public\.repair_cafe_stations, public\.repair_cafe_tickets/,
 "Ticket access must not rely solely on hidden menu routes");
assert.match(sql,/private\.has_program\('repair_cafe'\)/,"Ticket operations must check programme membership");
assert.match(sql,/pg_advisory_xact_lock/,"Queue number generation must be serialized");
assert.match(sql,/risk_level.*unsafe/,"Unsafe item guard missing");
assert.match(ops,/requireProgrammeContext/,"Organiser operations must check programme access");
assert.match(reports,/requireProgrammeContext/,"Reports must check programme access");
assert.match(csv,/context\.selected/,"CSV must verify programme context");
assert.match(csv,/no-store/,"Export caching must be private");
assert.doesNotMatch(csv,/reported_problem|work_summary|visitor_label|contact_note/,
 "De-identified CSV must not export narrative faults or private details");
assert.match(nav,/\/repair-cafe-volunteers\/event-desk/,"Event Desk must be reachable from the menu");
assert.match(nav,/\/repair-cafe-volunteers\/operations/,"Operations must be reachable from menu");
assert.match(nav,/\/repair-cafe-volunteers\/reports/,"Reports must be reachable from menu");
assert.ok(!existsSync(resolve(root,"supabase/migrations/20261009164000_repair_cafe_attendance_shift_times.sql")),
 "Unapplied duplicate attendance migration would break fresh installations");
assert.ok(!existsSync(resolve(root,"supabase/migrations/20261009173000_repair_cafe_event_desk_workflow.sql")),
 "Unapplied duplicate Event Desk migration would break fresh installations");
console.log("Repair Café source QA PASS: route presence, auth guards, intake, risk checks, isolated records, CSV privacy and migration deduplication.");
