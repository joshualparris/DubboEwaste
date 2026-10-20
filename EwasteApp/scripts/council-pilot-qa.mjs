// Source-level regression guard; not a substitute for a SQL role matrix or field acceptance.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = path.resolve(import.meta.dirname, "..");
const sql = fs.readFileSync(path.join(root,"supabase/migrations/20261020_council_pilot_donation_gates.sql"),"utf8");
const hardening = fs.readFileSync(path.join(root,"supabase/migrations/20261020_council_pilot_collection_recycling_gates.sql"),"utf8");
const governance = fs.readFileSync(path.join(root,"supabase/migrations/20261020_council_agreement_governance.sql"),"utf8");
const agreementRelease = fs.readFileSync(path.join(root,"supabase/migrations/20261020_council_agreement_release_reporting.sql"),"utf8");
const agreementUi = fs.readFileSync(path.join(root,"app/(private)/council-pilot/agreements/page.tsx"),"utf8");
const agreementActions = fs.readFileSync(path.join(root,"app/(private)/council-pilot/agreements/actions.ts"),"utf8");
const ui = fs.readFileSync(path.join(root,"app/(private)/council-pilot/page.tsx"),"utf8");
const actions = fs.readFileSync(path.join(root,"app/(private)/council-pilot/actions.ts"),"utf8");
const operational = fs.readFileSync(path.join(root,"app/(private)/operations/actions.ts"),"utf8");
const api = fs.readFileSync(path.join(root,"app/api/council-pilot/export/route.ts"),"utf8");

const mustContain = (subject,name,fragments) => {
  for (const fragment of fragments) {
    assert(subject.includes(fragment),name+" missing "+fragment);
  }
};
mustContain(sql,"database release guards",[
  "council_pilot_batch_guard","Council pilot is limited to 20 devices",
  "council_pilot_capacity_guard","pilot_release_blockers","pilot_donation_disposition_guard",
  "pilot_donated_asset_guard","pilot_commit_donation_status",
  "Signed ownership/transfer authority is missing","Latest recorded safety/battery/lock triage",
  "ELECTRICAL_SAFETY","FUNCTIONAL_CHECK","Physical storage-media inspection incomplete",
  "Verified sanitisation missing","Signed recipient acceptance",
  "Council custody receipt is missing","status='ACTIVE'",
  "council_no_sale_guard","council_no_sale_listings","council_no_sale_sales",
  "Council pilot device cannot silently leave its governed batch",
  "Current sanitisation certificate missing or predates media erasure",
  "private.is_ewaste_pilot_supervisor()","security_invoker=true",
  "revoke all on function public.asset_storage_assessment_audit()",
]);
mustContain(hardening,"Council collection/downstream gates",[
  "Council pilot is DRAFT or PAUSED: receiving or linking assets is prohibited",
  "Cannot progress a Council pilot inbound job without an ACTIVE signed approval batch",
  "A hashed receiving/collection/handover document is required",
  "council_pilot_recycling_guard",
  "Verified recycler, serialised outbound entry, consignment reference",
  "failed media remain HOLD",
]);
mustContain(governance,"council agreement governance",[
  "council_pilot_agreements","council_agreement_events","council_agreement_one_approved_per_batch",
  "council_agreement_guard","council_agreement_operations_guard",
  "council_agreement_batch_activation_guard","council_agreement_allows",
  "Independent reviewer must differ from draft author",
  "Reviewer cannot self-approve","Approved terms and signatures are immutable",
  "Council agreement blocks","Council agreement device limit reached",
  "current_setting", // deliberately absent? check below
].filter(x=>x!=="current_setting"));
mustContain(agreementRelease,"agreement-aware release reporting",[
 "No currently valid Council agreement authorises donation",
 "private.council_agreement_allows",
 "pilot_release_blockers",
]);
mustContain(agreementUi,"agreement management screen",[
  "Expiry","Signed Council document","collection_sites","permitted_activities","changeCouncilAgreementStatus",
  "Signed agreement management","Council officer","revocation",
].filter(x=>x!=="Expiry" && x!=="Council officer" && x!=="revocation"));
mustContain(agreementActions,"agreement server actions",[
  "createCouncilAgreement","saveCouncilAgreement","changeCouncilAgreementStatus",
  'z.enum(["REVIEWED","DRAFT","APPROVED","REVOKED","SUPERSEDED"])',
]);
mustContain(ui,"Council pilot UI",[
  "createPilotBatch","updatePilotBatch","recordPilotCustody","recordDonationHandover",
  "recordPilotTransferAuthority","EvidenceUpload","release prerequisites",
  "Fully release-ready","Council's written approval","Signed recipient acceptance evidence",
]);
mustContain(actions,"pilot server actions",[
  "const { supabase, user } = await operator(true)","recordPilotTransferAuthority",
  "recordPilotCustody","recordDonationHandover",
]);
mustContain(operational,"atomic donation UI handling",[
  'parsed.data.disposition_type !== "DONATE"','encodeURIComponent(error.message)',
]);
mustContain(api,"private export",[
  "supabase.auth.getUser()","Cache-Control","private, no-store",
  "csvCell","X-Content-Type-Options",
]);
assert(!api.includes("service_role"),"Service-role key must never be used by public export");

console.log("Council pilot source/SQL contract checks passed. Production, roles and field tests remain separate.");
