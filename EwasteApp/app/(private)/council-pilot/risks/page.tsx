import Link from "next/link";
import {redirect,notFound} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {EvidenceUpload} from "@/components/EvidenceUpload";
import {
 initialiseCouncilRisks,addCouncilRisk,updateCouncilRisk,createRiskFramework,
 recordRiskMatrixCell,verifyRiskFramework,addRiskControl,updateRiskControl,
 createRiskAssessment,approveRiskAssessment,addRiskAction,updateRiskAction,
 reportCouncilRiskIncident,closeCouncilRiskIncident
} from "./actions";

type Row=Record<string,any>;
const cats=["SAFETY","FIRE_BATTERY","DATA_PRIVACY","CUSTODY","ELECTRICAL","TRANSPORT",
  "ENVIRONMENT","GOVERNANCE","INSURANCE","BUSINESS_CONTINUITY","FRAUD","PROJECT_DELIVERY","OTHER"];
const hierarchies=["ELIMINATION","SUBSTITUTION","ISOLATION","ENGINEERING","ADMINISTRATIVE","PPE"];
const ratings=["LOW","MODERATE","HIGH","EXTREME"];
export default async function CouncilRiskPage({searchParams}:{searchParams:Promise<{batch?:string;error?:string;notice?:string}>}){
 const search=await searchParams;
 if(!search.batch)redirect("/council-pilot");
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin && (context.selected!=="dubbo_ewaste" ||
     !["admin","manager","technician"].includes(context.role||"")))redirect("/programmes");
 const manager=context.global_admin||["admin","manager"].includes(context.role||"");
 const {data:batch}=await supabase.from("council_pilot_batches")
  .select("id,job_id,status").eq("id",search.batch).maybeSingle();
 if(!batch)notFound();
 const [riskQuery,controlQuery,frameworkQuery,cellQuery,assessQuery,actionQuery,incidentQuery,
  dashboardQuery,evidenceQuery,staffQuery,auditQuery]=await Promise.all([
  supabase.from("council_risks").select("*").eq("batch_id",batch.id).order("reference"),
  supabase.from("council_risk_controls").select("*").order("created_at"),
  supabase.from("council_risk_frameworks").select("*").eq("batch_id",batch.id).order("version",{ascending:false}),
  supabase.from("council_risk_matrix_cells").select("*"),
  supabase.from("council_risk_assessments").select("*").order("version",{ascending:false}),
  supabase.from("council_risk_actions").select("*").order("due_on"),
  supabase.from("council_risk_incidents").select("*").eq("batch_id",batch.id).order("created_at",{ascending:false}),
  supabase.from("council_risk_dashboard").select("*").eq("batch_id",batch.id).maybeSingle(),
  supabase.from("evidence").select("id,filename,sha256").eq("entity_type","job").eq("entity_id",batch.job_id)
   .order("captured_at",{ascending:false}),
  supabase.from("program_access").select("user_id,programme_role,profiles(full_name)").eq("program","dubbo_ewaste").eq("active",true),
  supabase.from("council_risk_audit").select("id,object_type,event,actor_id,created_at")
   .eq("batch_id",batch.id).order("created_at",{ascending:false}).limit(30),
 ]);
 const risks=(riskQuery.data||[]) as Row[];
 const ids=new Set(risks.map(r=>r.id));
 const controls=((controlQuery.data||[]) as Row[]).filter(x=>ids.has(x.risk_id));
 const assessments=((assessQuery.data||[]) as Row[]).filter(x=>ids.has(x.risk_id));
 const actions=((actionQuery.data||[]) as Row[]).filter(x=>ids.has(x.risk_id));
 const frameworks=(frameworkQuery.data||[]) as Row[];
 const fwids=new Set(frameworks.map(x=>x.id));
 const cells=((cellQuery.data||[]) as Row[]).filter(x=>fwids.has(x.framework_id));
 const incidents=(incidentQuery.data||[]) as Row[];
 const metrics=dashboardQuery.data;
 const docs=(evidenceQuery.data||[]) as Row[];
 const people=((staffQuery.data||[]) as Row[]).map(x=>({
  id:x.user_id,label:(x.profiles?.full_name||"Staff member")+" ("+x.programme_role+")"
 }));
 const now=new Date();
 const today=new Intl.DateTimeFormat("en-CA",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
 const options=(selected?:string)=><><option value="">Choose an uploaded original, SHA-256 hashed file</option>
  {docs.map(d=><option key={d.id} value={d.id}>{d.filename} · {String(d.sha256||"no hash").slice(0,12)}</option>)}</>;
 const peopleOptions=(empty=true)=><>{empty?<option value="">Assign named accountable owner</option>:null}
  {people.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</>;
 const errors=[riskQuery.error,controlQuery.error,frameworkQuery.error,cellQuery.error,assessQuery.error,
   actionQuery.error,incidentQuery.error,dashboardQuery.error,evidenceQuery.error,staffQuery.error].filter(Boolean);
 const activeFramework=frameworks.find(x=>x.status==="VERIFIED");
 const draftFramework=frameworks.find(x=>x.status==="DRAFT");
 const approvedCount=risks.filter(x=>assessments.some(a=>a.risk_id===x.id&&a.status==="APPROVED")).length;
 return <div className="stack">
  <div>
   <div className="badge">Council 20-device pilot · Risk Management</div>
   <h1>Risk register and stop-work controls</h1>
   <p className="muted">Council adopted a refreshed Risk Management Policy in June 2026. Its project framework and matrix must be obtained from Council; ratings shown here only come from explicitly recorded source methodology.</p>
   <div className="actions">
    <Link className="button secondary" href={"/council-pilot?batch="+batch.id}>Pilot readiness</Link>
    <Link className="button secondary" href={"/council-pilot/agreements?batch="+batch.id}>Signed agreement</Link>
    <Link className="button secondary" href={"/api/council-pilot/risks/export?batch="+batch.id}>Download private risk CSV</Link>
   </div>
  </div>
  {search.error?<p className="error" role="alert">{search.error}</p>:null}
  {search.notice?<p className="success" role="status">{search.notice}</p>:null}
  {errors.length?<p className="error">Risk records could not all be loaded: {errors.map(e=>e?.message).join(" | ")}</p>:null}
  <section className="card stack">
   <h2>Operational stop-work status</h2>
   <p><strong>{metrics?.ready?"Recorded risk controls READY":"STOP — risk acceptance incomplete"}</strong> · Pilot {batch.status}</p>
   <div className="grid">
    <p><strong>{metrics?.risk_count||0}</strong> registered hazards</p>
    <p><strong>{approvedCount}</strong> approved assessments</p>
    <p><strong>{metrics?.unverified_controls||0}</strong> unverified controls</p>
    <p><strong>{metrics?.open_actions||0}</strong> open actions</p>
    <p><strong>{metrics?.open_incidents||0}</strong> open incidents</p>
    <p><strong>{metrics?.overdue_reviews||0}</strong> overdue assessments</p>
   </div>
   <p className="muted">Risk clearance is continuously checked in the database. Missing or expired reviews, failed controls, open corrective actions or serious incidents block activity. Quarantine and safe return remain permitted.</p>
  </section>
  {manager?<section className="card stack">
   <h2>Start with the Council pilot hazard prompts</h2>
   <p className="muted">Creates 12 proposed hazards for assessment (battery, electrical, privacy, transport, governance and more). They start OPEN and unassessed, without inventing controls or approval.</p>
   <form action={initialiseCouncilRisks}><input type="hidden" name="batch_id" value={batch.id}/>
    <button className="button secondary">Add missing unassessed risk prompts</button>
   </form>
   <details><summary>Add another risk identified during consultation</summary>
    <form className="form" action={addCouncilRisk}>
     <input type="hidden" name="batch_id" value={batch.id}/>
     <label>Reference<input name="reference" required minLength={3} maxLength={60}/></label>
     <label>Risk category<select name="category">{cats.map(x=><option key={x}>{x}</option>)}</select></label>
     <label>Risk classification<select name="classification"><option>PROJECT</option><option>OPERATIONAL</option><option>STRATEGIC</option></select></label>
     <label>Hazard and risk event<textarea name="hazard" required minLength={10}/></label>
     <label>Causes<textarea name="cause" defaultValue="To be assessed"/></label>
     <label>Potential consequences<textarea name="consequence" defaultValue="To be assessed"/></label>
     <label>People and assets affected<textarea name="affected_people" defaultValue="To be assessed"/></label>
     <label>Legal and policy basis<textarea name="legal_or_policy_basis" defaultValue="To be verified"/></label>
     <label>Accountable risk owner<select name="owner_id">{peopleOptions()}</select></label>
     <button className="button">Add unassessed hazard</button>
    </form>
   </details>
  </section>:null}
  <section className="card stack">
   <h2>Source risk framework and exact matrix</h2>
   <p className="muted">No 5×5 Council matrix is assumed. First obtain Council's project-specific risk criteria, or written acceptance of an alternative. Enter the exact likelihood/consequence codes and every mapping cell from that evidence, then a different supervisor must verify it.</p>
   <EvidenceUpload entityType="job" entityId={batch.job_id} label="Upload actual Council risk framework, site assessments, verified control photographs and consultation records"/>
   <p>{activeFramework?"Verified framework v"+activeFramework.version+" · "+activeFramework.source_reference:
     "No verified matrix. Formal risk acceptance is blocked."}</p>
   {frameworks.map(f=>{
    const n=cells.filter(x=>x.framework_id===f.id).length;
    const possible=(f.likelihood_codes?.length||0)*(f.consequence_codes?.length||0);
    return <details key={f.id}>
     <summary><strong>Framework v{f.version}</strong> · {f.status} · {n}/{possible} cells · {f.source_reference||"No source reference"}</summary>
     <p>Source: {f.origin}. Original evidence: {f.source_evidence_id||"missing"}. Verified by: {f.verified_by||"not verified"}.</p>
     <p>Likelihood: {(f.likelihood_codes||[]).join(", ")} · Consequence: {(f.consequence_codes||[]).join(", ")}</p>
     <p>Recorded cells: {cells.filter(x=>x.framework_id===f.id).map(c=>c.likelihood_code+"/"+c.consequence_code+"="+c.rating).join(" · ")||"none"}</p>
     {manager&&f.status==="DRAFT"?<>
      <form className="form" action={recordRiskMatrixCell}>
       <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="framework_id" value={f.id}/>
       <label>Likelihood code<select name="likelihood_code">{(f.likelihood_codes||[]).map((x:string)=><option key={x}>{x}</option>)}</select></label>
       <label>Consequence code<select name="consequence_code">{(f.consequence_codes||[]).map((x:string)=><option key={x}>{x}</option>)}</select></label>
       <label>Rating exactly from supplied matrix<select name="rating">{ratings.map(x=><option key={x}>{x}</option>)}</select></label>
       <label>Source-matrix response requirement<input name="response_instruction" maxLength={500}/></label>
       <button className="button secondary">Record / replace matrix cell</button>
      </form>
      <form action={verifyRiskFramework}><input type="hidden" name="batch_id" value={batch.id}/>
       <input type="hidden" name="framework_id" value={f.id}/>
       <button className="button">Independently verify complete framework</button></form>
     </>:null}
    </details>;
   })}
   {manager?<details><summary>Create new unverified matrix version</summary>
    <form className="form" action={createRiskFramework}>
     <input type="hidden" name="batch_id" value={batch.id}/>
     <label>Source type<select name="origin"><option value="UNCONFIRMED">Unconfirmed — cannot verify</option>
      <option value="COUNCIL_SUPPLIED">Council-supplied project matrix</option>
      <option value="COUNCIL_ACCEPTED_OPERATOR">Operator matrix explicitly accepted in Council correspondence</option></select></label>
     <label>Source reference<input name="source_reference" maxLength={200}/></label>
     <label>Actual source file<select name="source_evidence_id">{options()}</select></label>
     <label>Likelihood codes, comma-separated<input name="likelihood_codes" placeholder="Use exact supplied matrix labels, not invented values" required/></label>
     <label>Consequence codes, comma-separated<input name="consequence_codes" placeholder="Use exact supplied matrix labels, not invented values" required/></label>
     <label>Framework notes<textarea name="notes" defaultValue="Awaiting independent source verification"/></label>
     <button className="button secondary">Create unverified matrix version</button>
    </form>
   </details>:null}
  </section>
  <section className="card stack">
   <h2>Risk register · {risks.length} identified</h2>
   {risks.length===0?<p>No hazards recorded yet. Add the 12 unassessed starters, then assign owners and verify controls.</p>:null}
   {risks.map(risk=>{
    const ct=controls.filter(c=>c.risk_id===risk.id);
    const ass=assessments.filter(a=>a.risk_id===risk.id);
    const act=actions.filter(a=>a.risk_id===risk.id);
    return <details className="card" key={risk.id}>
     <summary><strong>{risk.reference}</strong> · {risk.category} · {risk.status} · {risk.hazard}
      {" · "}{ct.filter(c=>c.status==="VERIFIED").length}/{ct.length} verified controls</summary>
     <div className="stack">
      <p><strong>Cause:</strong> {risk.cause||"Not assessed"}</p>
      <p><strong>Impact:</strong> {risk.consequence||"Not assessed"}</p>
      <p><strong>Risk owner:</strong> {people.find(p=>p.id===risk.owner_id)?.label||"Not assigned"}</p>
      <p><strong>Classification:</strong> {risk.classification}</p>
      {manager?<form className="form" action={updateCouncilRisk}>
       <h3>Owner, risk context and monitoring</h3>
       <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="risk_id" value={risk.id}/>
       <label>Accountable owner<select name="owner_id" defaultValue={risk.owner_id||""}>{peopleOptions()}</select></label>
       <label>Causes<textarea name="cause" defaultValue={risk.cause}/></label>
       <label>Consequences<textarea name="consequence" defaultValue={risk.consequence}/></label>
       <label>Affected people/locations<textarea name="affected_people" defaultValue={risk.affected_people}/></label>
       <label>WHS, Council policy and evidence basis<textarea name="legal_or_policy_basis" defaultValue={risk.legal_or_policy_basis}/></label>
       <label>Risk status<select name="status" defaultValue={risk.status}>
        <option value="OPEN">OPEN — unaccepted or unresolved</option><option value="MONITORING">MONITORING — accepted with controls</option>
        <option value="CLOSED">CLOSED — only after pilot ended</option></select></label>
       <button className="button secondary">Save risk register entry</button>
      </form>:null}
      <h3>Control hierarchy and independent verification</h3>
      {ct.map(c=><div className="card" key={c.id}>
       <p><strong>{c.hierarchy}</strong> · {c.status}{c.critical?" · CRITICAL":""} · {c.description}</p>
       <p className="muted">Assigned: {people.find(p=>p.id===c.owner_id)?.label||"Unknown"} · Implementation due {c.due_on} · Review {c.next_review_on||"not scheduled"}</p>
       {manager?<form className="form" action={updateRiskControl}>
        <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="control_id" value={c.id}/>
        <label>Control status<select name="status" defaultValue={c.status}><option>PLANNED</option><option>IMPLEMENTED</option>
         <option>VERIFIED</option><option>FAILED</option></select></label>
        <label>Original proof of implementation<select name="evidence_id" defaultValue={c.evidence_id||""}>{options()}</select></label>
        <label>Next control effectiveness review<input name="next_review_on" type="date" defaultValue={c.next_review_on||""}/></label>
        <button className="button secondary">Verify or update control</button>
       </form>:null}
      </div>)}
      {manager?<details><summary>Add required control (use highest practicable hierarchy)</summary>
       <form className="form" action={addRiskControl}>
        <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="risk_id" value={risk.id}/>
        <label>Hierarchy of controls<select name="hierarchy">{hierarchies.map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Precise proposed control<textarea name="description" minLength={12} required/></label>
        <label>Person responsible<select name="owner_id" required>{peopleOptions()}</select></label>
        <label>Implementation due<input type="date" name="due_on" required/></label>
        <label>Critical control<select name="critical"><option value="yes">Yes — release-critical</option><option value="no">No</option></select></label>
        <button className="button secondary">Add PLANNED control</button>
       </form>
      </details>:null}
      <h3>Inherent and residual risk assessment</h3>
      {ass.map(a=><div className="card" key={a.id}>
       <p><strong>Assessment v{a.version} · {a.status}</strong> · inherent {a.inherent_rating||"UNRATED"} · residual {a.residual_rating||"UNRATED"}</p>
       <p className="muted">{a.assessment_reasoning} · review due {a.review_due}</p>
       <p>Treatment: {a.treatment_plan}</p>
       {a.status==="DRAFT"&&manager?<form action={approveRiskAssessment}>
        <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="assessment_id" value={a.id}/>
        <button className="button secondary">Independently approve assessment and verified controls</button>
       </form>:null}
      </div>)}
      {manager&&frameworks.length?<details><summary>Record risk assessment using actual source-matrix codes</summary>
       <form className="form" action={createRiskAssessment}>
        <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="risk_id" value={risk.id}/>
        <label>Documented framework version<select name="framework_id">{frameworks.filter(f=>f.status!=="RETIRED").map(f=><option key={f.id} value={f.id}>v{f.version} · {f.status}</option>)}</select></label>
        <p className="muted">Use only codes from the selected matrix. The database rejects unknown combinations and derives the actual ratings from saved cells.</p>
        <label>Inherent likelihood code<input name="inherent_likelihood" required/></label>
        <label>Inherent consequence code<input name="inherent_consequence" required/></label>
        <label>Residual likelihood code<input name="residual_likelihood" required/></label>
        <label>Residual consequence code<input name="residual_consequence" required/></label>
        <label>Risk reasoning and affected people<textarea name="assessment_reasoning" required minLength={15}/></label>
        <label>Treatment, elimination considerations and remaining risk<textarea name="treatment_plan" required minLength={15}/></label>
        <label>Documented worker/stakeholder consultation<textarea name="consultation_summary"/></label>
        <label>Next risk review<input name="review_due" type="date" required/></label>
        <label>Uploaded signed assessment/consultation document<select name="evidence_id">{options()}</select></label>
        <button className="button secondary">Save unapproved assessment</button>
       </form>
      </details>:null}
      <h3>Corrective actions</h3>
      {act.map(a=><div className="card" key={a.id}><p>{a.status} · {a.description} · due {a.due_on}</p>
       {manager?<form className="form" action={updateRiskAction}>
        <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="action_id" value={a.id}/>
        <label>Status<select name="status" defaultValue={a.status}><option>OPEN</option><option>IN_PROGRESS</option><option>VERIFIED</option></select></label>
        <label>Closeout proof<select name="closure_evidence_id" defaultValue={a.closure_evidence_id||""}>{options()}</select></label>
        <button className="button secondary">Update corrective action</button>
       </form>:null}
      </div>)}
      {manager?<details><summary>Create corrective action (blocks risk clearance)</summary>
       <form className="form" action={addRiskAction}>
        <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="risk_id" value={risk.id}/>
        <label>Required treatment<textarea name="description" minLength={12} required/></label>
        <label>Accountable owner<select name="owner_id" required>{peopleOptions()}</select></label>
        <label>Due date<input type="date" name="due_on" required/></label>
        <button className="button secondary">Open corrective action</button>
       </form>
      </details>:null}
     </div>
    </details>;
   })}
  </section>
  <section className="card stack">
   <h2>Report injuries, near misses, privacy breaches and safety incidents</h2>
   <p className="muted">Emergency response takes priority over form entry. Serious or critical incidents pause an ACTIVE pilot automatically. Notify SafeWork NSW or other authorities when legally required; this screen does not send notifications.</p>
   {incidents.map(i=><details key={i.id}>
    <summary><strong>{i.severity} · {i.category} · {i.status}</strong> · {new Date(i.occurred_at).toLocaleString("en-AU",{timeZone:"Australia/Sydney"})}</summary>
    <p>{i.description}</p><p>Immediate response: {i.immediate_actions}</p>
    <p>Notification: {i.notified_authorities||"Not recorded"} · {i.notification_reference||"No reference"}</p>
    {manager&&i.status!=="CLOSED"?<form action={closeCouncilRiskIncident} className="form">
     <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="incident_id" value={i.id}/>
     <label>Incident and closeout evidence<select name="evidence_id" required>{options()}</select></label>
     <label>Independent investigation and reason for closure<textarea name="closure_reason" minLength={15} required/></label>
     <label>Authorities notified (or reasons for none)<input name="notified_authorities" defaultValue={i.notified_authorities||""}/></label>
     <label>Legal notification / case reference<input name="notification_reference" defaultValue={i.notification_reference||""}/></label>
     <button className="button secondary">Independently close verified incident</button>
    </form>:null}
   </details>)}
   {<form className="form" action={reportCouncilRiskIncident}>
    <h3>Record a new actual incident (never create test incidents in production)</h3>
    <input type="hidden" name="batch_id" value={batch.id}/>
    <label>Related risk<select name="risk_id"><option value="">General incident</option>{risks.map(r=><option key={r.id} value={r.id}>{r.reference} · {r.hazard}</option>)}</select></label>
    <label>Incident type<select name="category">{["INJURY","NEAR_MISS","FIRE","BATTERY","ELECTRICAL","DATA_BREACH","LOST_DEVICE","THEFT","ENVIRONMENT","OTHER"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Severity<select name="severity"><option>NEAR_MISS</option><option>MINOR</option><option>SERIOUS</option><option>CRITICAL</option></select></label>
    <label>Actual event date/time including offset (e.g. 2026-10-20T17:00:00+11:00)
     <input name="occurred_at" required placeholder="YYYY-MM-DDTHH:mm:ss+11:00"/></label>
    <label>What actually happened<textarea name="description" minLength={15} required/></label>
    <label>Immediate first aid, stop-work, quarantine, containment or escalation<textarea name="immediate_actions" minLength={10} required/></label>
    <label>Authority notified<input name="notified_authorities"/></label>
    <label>Notification or incident number<input name="notification_reference"/></label>
    <label>Original incident evidence<select name="evidence_id">{options()}</select></label>
    <button className="button">Record incident and apply stop-work rules</button>
   </form>}
  </section>
  <section className="card stack">
   <h2>Change and decision history</h2>
   <p className="muted">Append-only database history of risk, assessment, control, matrix, action and incident changes.</p>
   <ul>{((auditQuery.data||[]) as Row[]).map(a=><li key={a.id}>
    {new Date(a.created_at).toLocaleString("en-AU",{timeZone:"Australia/Sydney"})} · {a.object_type} {a.event}
   </li>)}</ul>
  </section>
 </div>;
}
