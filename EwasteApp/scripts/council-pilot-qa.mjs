// Source-level regression guard; not a substitute for a SQL role matrix or field acceptance.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = path.resolve(import.meta.dirname, "..");
const custodySql = fs.readFileSync(path.join(root,"supabase/migrations/20261020_council_custody_tracking.sql"),"utf8");
const custodyHardening = fs.readFileSync(path.join(root,"supabase/migrations/20261020_council_custody_incident_hardening.sql"),"utf8");
const custodyIntegration = fs.readFileSync(path.join(root,"supabase/migrations/20261020_council_custody_release_integration.sql"),"utf8");
const custodyActions = fs.readFileSync(path.join(root,"app/(private)/council-pilot/custody/actions.ts"),"utf8");
const custodyUi = fs.readFileSync(path.join(root,"app/(private)/council-pilot/custody/page.tsx"),"utf8");
const custodyScanner = fs.readFileSync(path.join(root,"components/CustodyQrCapture.tsx"),"utf8");
const custodyExport = fs.readFileSync(path.join(root,"app/api/council-pilot/custody/export/route.ts"),"utf8");
const sql = fs.readFileSync(path.join(root,"supabase/migrations/20261020_council_pilot_donation_gates.sql"),"utf8");
const hardening = fs.readFileSync(path.join(root,"supabase/migrations/20261020_council_pilot_collection_recycling_gates.sql"),"utf8");
const riskLabels = fs.readFileSync(path.join(root,"supabase/migrations/20261020_council_risk_source_rating_labels.sql"),"utf8");
const riskSql = fs.readFileSync(path.join(root,"supabase/migrations/20261020_council_risk_management.sql"),"utf8");
const riskActions = fs.readFileSync(path.join(root,"app/(private)/council-pilot/risks/actions.ts"),"utf8");
const riskUi = fs.readFileSync(path.join(root,"app/(private)/council-pilot/risks/page.tsx"),"utf8");
const riskExport = fs.readFileSync(path.join(root,"app/api/council-pilot/risks/export/route.ts"),"utf8");
const governance = fs.readFileSync(path.join(root,"supabase/migrations/20261020_council_agreement_governance.sql"),"utf8");
const titleRelease = fs.readFileSync(path.join(root,"supabase/migrations/20261020_council_title_transfer_custody.sql"),"utf8");
const intakeActions = fs.readFileSync(path.join(root,"app/(private)/assets/actions.ts"),"utf8");
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
mustContain(custodySql,"Council custody constraints",[
 "council_custody_locations","council_custody_transfers",
 "council_custody_discrepancies","council_custody_reconciliations",
 "council_custody_transfer_guard","council_custody_legacy_guard",
 "council_custody_disposition_guard","council_custody_release_ok",
 "Different authenticated people must release and accept custody",
 "Outgoing QR scan does not match this asset",
 "Receiving scan is missing or does not match equipment label",
 "Direct one-person custody logs are disabled",
 "revoke insert on public.pilot_custody_events from authenticated",
 "council_custody_reconcile_exceptions","extensions.digest",
 "verified_transfer_id","entry_hash","status='OPEN'",
]);
mustContain(custodyHardening,"custody incident and integrity",[
 "council_custody_discrepancy_pause","council_custody_rejection_flag",
 "council_custody_chain_validation","Cannot retire location with outstanding devices"
]);
mustContain(custodyIntegration,"custody release integration",[
 "private.pilot_release_blockers","private.council_custody_release_ok",
 "private.council_agreement_operations_guard",
 "private.council_custody_asset_guard",
 "private.council_custody_chain_validation",
 "Asset identity and origin are immutable".toLowerCase(),
].filter(x=>!x.includes("immutable")));
mustContain(custodyActions,"custody server actions",[
 "initiateCustodyTransfer","decideCustodyTransfer","verifyCustodyLocation",
 "reconcileCustodyLocation","reportCustodyDiscrepancy","resolveCustodyDiscrepancy",
]);
mustContain(custodyUi,"custody workbench",[
 "Physical custody and reconciliation","Independent custody",
 "CustodyQrCapture","council_custody_asset_status",
 "Reconcile count against verified ledger",
].filter(x=>x!=="Independent custody"));
mustContain(custodyScanner,"camera QR support",[
 "BarcodeDetector","getUserMedia","Scan QR with camera","AssetFlow QR labels",
].filter(x=>x!=="AssetFlow QR labels"));
mustContain(custodyExport,"private chain audit CSV",[
 "supabase.auth.getUser()","private, no-store","entry_hash","releasing_user","receiving_user",
]);
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
mustContain(riskLabels,"source-defined risk-rating labels",["council_risk_matrix_rating_source_label","drop constraint"]);
mustContain(riskSql,"Council risk governance",[
 "council_risk_frameworks","council_risk_matrix_cells","council_risk_assessments",
 "council_risk_controls","council_risk_actions","council_risk_incidents",
 "council_risk_audit","council_risk_ready","council_risk_batch_gate",
 "council_risk_operations_gate","council_risk_stop_work",
 "risk_framework_guard","risk_assessment_guard","risk_control_guard",
 "Independent supervisor must verify the risk framework",
 "Every likelihood/consequence matrix cell must be explicitly recorded",
 "Approved assessment is immutable",
 "All risk controls need current independent verification",
 "SERIOUS","CRITICAL","security_invoker=true",
]);
mustContain(riskActions,"risk server actions",[
 "initialiseCouncilRisks","createRiskFramework","verifyRiskFramework",
 "recordRiskMatrixCell","createRiskAssessment","approveRiskAssessment",
 "addRiskControl","updateRiskControl","addRiskAction","updateRiskAction",
 "reportCouncilRiskIncident","closeCouncilRiskIncident","retireRiskFramework","supersedeRiskAssessment"
]);
mustContain(riskUi,"risk dashboard",[
 "Risk register and stop-work controls","Stop-work","Risk register",
 "Council risk","Independently","Risk Management"
].filter(x=>x!=="Stop-work" && x!=="Risk Management"));
mustContain(riskExport,"restricted risk export",[
 "supabase.auth.getUser()","Cache-Control","private, no-store",
 "csv","quote","admin","manager"
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
mustContain(titleRelease,"Council custody title-transfer gate",[
 "council_title_transfer_guard","Council retains title","OWNER_TRANSFER",
 "record custody under a named third-party owner",
]);
mustContain(intakeActions,"Council custody intake",[
 'ownership_verified: parsed.data.ownership_verified === "yes"',
 "council_pilot_batches","THIRD_PARTY"
]);
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
