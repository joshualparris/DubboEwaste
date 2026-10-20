import Link from "next/link";
import {notFound,redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {EvidenceUpload} from "@/components/EvidenceUpload";
import {createCouncilAgreement,saveCouncilAgreement,changeCouncilAgreementStatus} from "./actions";

const availableCategories=["LAPTOP","DESKTOP","CHROMEBOOK"];
const availableActivities=["COLLECT","TRANSPORT","STORE","SANITISE","REFURBISH","DONATE","RECYCLE"];
type Row=Record<string,any>;
export default async function Agreements({
  searchParams,
}: {
  searchParams:Promise<{batch?:string;agreement?:string;error?:string;notice?:string}>;
}) {
  const search=await searchParams;
  if(!search.batch) redirect("/council-pilot");
  const {supabase,context}=await requireProgrammeContext();
  if(!context.global_admin && (context.selected!=="dubbo_ewaste" ||
      !["admin","manager","technician"].includes(context.role||""))) {
    redirect("/programmes?error=Council%20agreement%20records%20require%20E-waste%20access");
  }
  const canEdit=context.global_admin||["admin","manager"].includes(context.role||"");
  const {data:batch,error:batchError}=await supabase.from("council_pilot_batches")
    .select("id,job_id,status,approved_agreement_id,council_reference").eq("id",search.batch).maybeSingle();
  if(batchError||!batch)notFound();
  const [{data:agreements},{data:files},{data:events},{data:readiness},{data:job}]=await Promise.all([
    supabase.from("council_pilot_agreements").select("*").eq("batch_id",batch.id).order("revision_number",{ascending:false}),
    supabase.from("evidence").select("id,filename,sha256,captured_at").eq("entity_type","job")
      .eq("entity_id",batch.job_id).order("captured_at",{ascending:false}),
    supabase.from("council_agreement_events").select("id,agreement_id,event_type,created_at,actor_id,details")
      .eq("batch_id",batch.id).order("created_at",{ascending:false}).limit(100),
    supabase.from("council_pilot_agreement_readiness").select("*").eq("batch_id",batch.id).maybeSingle(),
    supabase.from("jobs").select("job_code,source_site").eq("id",batch.job_id).maybeSingle(),
  ]);
  const rows=(agreements||[]) as Row[];
  const chosen=rows.find(x=>x.id===search.agreement) || rows[0] || null;
  const draft=chosen?.status==="DRAFT";
  const documentList=(files||[]) as Row[];
  const docOptions=(current:string|null)=>{
    return <><option value="">No signed document selected</option>
      {documentList.map(f=><option key={f.id} value={f.id}>{f.filename} · SHA-256 {String(f.sha256||"").slice(0,10)}…</option>)}
    </>;
  };
  const formValues:Row=chosen||{};
  const active=readiness?.collection_authorised===true;
  const due=readiness?.days_until_expiry;
  const red=chosen?.status==="REVOKED" || chosen?.status==="SUPERSEDED" || (typeof due==="number"&&due<0);

  function agreementFields(){
    return <>
      <label>Council agreement/reference number<input name="reference" required minLength={5} maxLength={200} defaultValue={formValues.reference||""} placeholder="Exact reference from the actual signed agreement"/></label>
      <div className="two">
        <label>Council signing officer<input name="council_signatory" defaultValue={formValues.council_signatory||""}/></label>
        <label>Council officer's authorised position<input name="council_signatory_position" defaultValue={formValues.council_signatory_position||""}/></label>
      </div>
      <label>Evidence of Council's signing authority / delegation<textarea name="council_delegation_basis" defaultValue={formValues.council_delegation_basis||""} placeholder="State the resolution or written delegation reference; verify it independently"/></label>
      <div className="two">
        <label>Dubbo E-waste signing officer<input name="operator_signatory" defaultValue={formValues.operator_signatory||""}/></label>
        <label>Signer's capacity<input name="operator_signatory_position" defaultValue={formValues.operator_signatory_position||""}/></label>
      </div>
      <div className="two">
        <label>Council signed date<input type="date" name="council_signed_on" defaultValue={formValues.council_signed_on||""}/></label>
        <label>Operator signed date<input type="date" name="operator_signed_on" defaultValue={formValues.operator_signed_on||""}/></label>
      </div>
      <label>Signed Council document<select name="council_document_evidence_id" defaultValue={formValues.council_document_evidence_id||""}>{docOptions(formValues.council_document_evidence_id)}</select></label>
      <label>Signed operator agreement / counterpart<select name="operator_document_evidence_id" defaultValue={formValues.operator_document_evidence_id||""}>{docOptions(formValues.operator_document_evidence_id)}</select></label>
      <div className="two">
        <label>Effective from<input type="date" name="effective_from" defaultValue={formValues.effective_from||""}/></label>
        <label>Expires on (Sydney date)<input type="date" name="expires_on" defaultValue={formValues.expires_on||""}/></label>
      </div>
      <label>Permitted collection sites, one exact site per line<textarea rows={3} name="collection_sites" defaultValue={(formValues.collection_sites||[]).join("\n")} placeholder="Site and address as specified in signed agreement; no guessed locations"/></label>
      <label>Maximum total devices permitted<input type="number" min={1} max={20} name="max_devices" required defaultValue={formValues.max_devices??20}/></label>
      <fieldset className="card">
        <legend>Permitted device categories (tick only authorised categories)</legend>
        {availableCategories.map(x=><label key={x} style={{display:"inline-flex",gap:"6px",marginRight:"14px",alignItems:"center"}}>
          <input type="checkbox" name="device_categories" value={x} defaultChecked={(formValues.device_categories||[]).includes(x)}/>{x}
        </label>)}
      </fieldset>
      <fieldset className="card">
        <legend>Permitted activities (do not assume blanket authorisation)</legend>
        {availableActivities.map(x=><label key={x} style={{display:"inline-flex",gap:"6px",marginRight:"14px",alignItems:"center"}}>
          <input type="checkbox" name="permitted_activities" value={x} defaultChecked={(formValues.permitted_activities||[]).includes(x)}/>{x}
        </label>)}
      </fieldset>
      <label>Point at which Council transfers legal title
        <select name="title_transfer_point" defaultValue={formValues.title_transfer_point||"NOT_AGREED"}>
          <option value="NOT_AGREED">Not yet agreed — blocks approval</option>
          <option value="ON_COLLECTION">On authorised collection</option>
          <option value="ON_RECEIPT">On documented receipt</option>
          <option value="ON_SIGNED_RELEASE">Only on separate signed release</option>
        </select>
      </label>
      <label>Exact ownership, transfer and liability wording<textarea rows={3} name="title_transfer_terms" defaultValue={formValues.title_transfer_terms||""}/></label>
      <label>Contractor constraints and clearance / collection arrangements<textarea rows={3} name="contractor_arrangements" defaultValue={formValues.contractor_arrangements||""} placeholder="Describe the signed agreement's interaction with the current e-waste contractor"/></label>
      <label>Other conditions, safe handling, approved delivery or reporting requirements<textarea rows={3} name="conditions" defaultValue={formValues.conditions||""}/></label>
    </>;
  }

  return <div className="stack">
    <div><div className="badge">Council governance · Versioned agreement</div>
      <h1>Signed agreement management</h1>
      <p className="muted">Batch {job?.job_code||batch.id} · {batch.status}. Only record real signed documents, dates and authority. An internal APPROVED decision is not proof Council granted permission.</p>
      <div className="actions">
        <Link className="button secondary" href={"/council-pilot?batch="+batch.id}>Back to Council pilot</Link>
        <Link className="button secondary" href={"/jobs/"+batch.job_id}>Inbound job</Link>
      </div>
    </div>
    {search.error ? <div role="alert" className="error">{search.error}</div> : null}
    {search.notice ? <div role="status" className="success">{search.notice}</div> : null}
    <section className="card stack">
      <h2>Real-time permission status</h2>
      <p><strong>{active?"Collection currently authorised by recorded agreement":"Collection blocked"}</strong>
        {" · "}Agreement {readiness?.agreement_status||"NOT LINKED"}
        {" · "}Batch {batch.status}
        {typeof due==="number"?" · "+(due<0?"Expired "+Math.abs(due)+" days ago":due+" days remaining"):""}
      </p>
      <p className="muted">Permissions are checked on every attempted device intake, custody transfer, disposition and job progression. Expiry/revocation is immediate; no nightly task is needed. Council's actual approval still requires external verification.</p>
      {red ? <p className="error">Expired, revoked or superseded: operations stop until a new reviewed agreement is linked and the batch re-authorised.</p>:null}
    </section>
    {canEdit ? <section className="card stack">
      <h2>Upload signed agreement evidence</h2>
      <EvidenceUpload entityType="job" entityId={batch.job_id} label="Attach signed Council and operator agreement originals" />
      <p className="muted">Documents must be real, complete and clearly signed. SHA-256 proves the uploaded bytes can be identified; it does not prove that a signatory is authorised.</p>
    </section>:null}
    {rows.length>0?<section className="card stack">
      <h2>Immutable revisions</h2>
      <div className="actions">{rows.map(a=><Link key={a.id} className="button secondary"
        href={"/council-pilot/agreements?batch="+batch.id+"&agreement="+a.id}>
        Rev {a.revision_number} · {a.status}{a.id===batch.approved_agreement_id?" · SELECTED":""}
      </Link>)}</div>
      <p className="muted">An approved revision cannot be silently edited. Supersede it and create the next version for changed conditions.</p>
    </section>:null}
    {canEdit && (!chosen||draft)?<section className="card stack">
      <h2>{draft?"Edit draft revision "+chosen.revision_number:"Create first agreement draft"}</h2>
      <form className="form" action={draft?saveCouncilAgreement:createCouncilAgreement}>
        <input type="hidden" name="batch_id" value={batch.id}/>
        {draft?<input type="hidden" name="agreement_id" value={chosen.id}/>:null}
        {agreementFields()}
        <button className="button" type="submit">{draft?"Save unapproved draft":"Create unapproved revision"}</button>
      </form>
    </section>:null}
    {chosen ? <section className="card stack">
      <h2>Agreement rev {chosen.revision_number} · {chosen.status}</h2>
      <p><strong>Reference:</strong> {chosen.reference}</p>
      <p><strong>Effective dates:</strong> {chosen.effective_from||"Not recorded"} to {chosen.expires_on||"Not recorded"} (Sydney)</p>
      <p><strong>Permitted sites:</strong> {(chosen.collection_sites||[]).join("; ")||"Not specified"}</p>
      <p><strong>Device categories:</strong> {(chosen.device_categories||[]).join(", ")||"None"}</p>
      <p><strong>Activities:</strong> {(chosen.permitted_activities||[]).join(", ")||"None"}</p>
      <p><strong>Title-transfer conditions:</strong> {chosen.title_transfer_point}; {chosen.title_transfer_terms||"None recorded"}</p>
      <p><strong>Council signatory:</strong> {chosen.council_signatory||"Not yet identified"} ({chosen.council_signatory_position||"Unknown"})</p>
      <p><strong>Reviewer ID:</strong> {chosen.reviewed_by||"Not reviewed"}</p>
      <p><strong>Approver ID:</strong> {chosen.approved_by||"Not approved"}</p>
      {canEdit&&chosen.status==="DRAFT"?<form action={changeCouncilAgreementStatus}>
        <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="agreement_id" value={chosen.id}/>
        <input type="hidden" name="decision" value="REVIEWED"/>
        <button className="button secondary">Independently review signed terms</button>
        <p className="muted small">The reviewer must use a different account from the author and check Council delegation and original signed documents.</p>
      </form>:null}
      {canEdit&&chosen.status==="REVIEWED"?<div className="actions">
        <form action={changeCouncilAgreementStatus}><input type="hidden" name="batch_id" value={batch.id}/>
          <input type="hidden" name="agreement_id" value={chosen.id}/><input type="hidden" name="decision" value="APPROVED"/>
          <button className="button">Approve reviewed revision</button></form>
        <form action={changeCouncilAgreementStatus}><input type="hidden" name="batch_id" value={batch.id}/>
          <input type="hidden" name="agreement_id" value={chosen.id}/><input type="hidden" name="decision" value="DRAFT"/>
          <button className="button secondary">Return for corrections</button></form>
      </div>:null}
      {canEdit&&chosen.status==="APPROVED"?<form className="form" action={changeCouncilAgreementStatus}>
        <h3>Stop or replace this approval</h3>
        <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="agreement_id" value={chosen.id}/>
        <label>Decision<select name="decision"><option value="REVOKED">REVOKED — withdraw permission immediately</option><option value="SUPERSEDED">SUPERSEDED — replace with a newer version</option></select></label>
        <label>Reason / Council communication reference<textarea name="reason" required minLength={10}/></label>
        <button className="button danger">Revoke or supersede agreement</button>
      </form>:null}
      {chosen.revocation_reason?<p className="error"><strong>Ended:</strong> {chosen.revocation_reason}</p>:null}
    </section>:null}
    {canEdit&&chosen&&chosen.status!=="DRAFT"?<section className="card stack">
      <h2>Change of terms requires a new revision</h2>
      <p className="muted">Use an additional draft rather than overwriting an approved, reviewed, revoked or superseded agreement. The previous version remains in the audit history.</p>
      <form className="form" action={createCouncilAgreement}>
        <input type="hidden" name="batch_id" value={batch.id}/>
        {agreementFields()}
        <button className="button secondary">Create next DRAFT revision</button>
      </form>
    </section>:null}
    <section className="card stack">
      <h2>Agreement audit history</h2>
      {(events||[]).length? <ul>{(events||[]).map(e=><li key={e.id}>
        {new Date(e.created_at).toLocaleString("en-AU",{timeZone:"Australia/Sydney"})} · {e.event_type}
        {" · "}Revision {e.details?.revision} · Actor {e.actor_id?.slice(0,8)||"unknown"}
      </li>)}</ul>:<p className="muted">No transitions recorded yet.</p>}
    </section>
  </div>;
}
