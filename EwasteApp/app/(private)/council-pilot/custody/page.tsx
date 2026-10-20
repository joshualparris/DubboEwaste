import Link from "next/link";
import {notFound,redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {EvidenceUpload} from "@/components/EvidenceUpload";
import {AssetQr} from "@/components/AssetQr";
import {CustodyQrCapture} from "@/components/CustodyQrCapture";
import {
 createCustodyLocation,verifyCustodyLocation,initiateCustodyTransfer,decideCustodyTransfer,
 reportCustodyDiscrepancy,resolveCustodyDiscrepancy,reconcileCustodyLocation,
} from "./actions";
type Row=Record<string,any>;
export default async function CouncilCustodyPage({searchParams}:{
 searchParams:Promise<{batch?:string;error?:string;notice?:string}>;
}){
 const search=await searchParams;
 if(!search.batch)redirect("/council-pilot");
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="dubbo_ewaste"||!
  ["admin","manager","technician"].includes(context.role||"")))redirect("/programmes");
 const manager=context.global_admin||["admin","manager"].includes(context.role||"");
 const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const {data:batch}=await supabase.from("council_pilot_batches")
  .select("id,job_id,status").eq("id",search.batch).maybeSingle();
 if(!batch)notFound();
 const [assetsQ,locationsQ,transfersQ,discrepQ,reconsQ,jobEvidenceQ,assetEvidenceQ,peopleQ,statusQ]=await Promise.all([
  supabase.from("assets").select("id,asset_code,serial_imei,category,source_name,status").eq("job_id",batch.job_id).order("asset_code"),
  supabase.from("council_custody_locations").select("*").eq("batch_id",batch.id).order("name"),
  supabase.from("council_custody_transfers").select("*").eq("batch_id",batch.id).order("requested_at",{ascending:false}).limit(250),
  supabase.from("council_custody_discrepancies").select("*").eq("batch_id",batch.id).order("opened_at",{ascending:false}),
  supabase.from("council_custody_reconciliations").select("*").eq("batch_id",batch.id).order("checked_at",{ascending:false}).limit(100),
  supabase.from("evidence").select("id,filename,sha256").eq("entity_type","job").eq("entity_id",batch.job_id).order("captured_at",{ascending:false}),
  supabase.from("evidence").select("id,entity_id,filename,sha256").eq("entity_type","asset").order("captured_at",{ascending:false}).limit(500),
  supabase.from("program_access").select("user_id,programme_role,profiles(full_name)").eq("program","dubbo_ewaste").eq("active",true),
  supabase.from("council_custody_asset_status").select("*").eq("batch_id",batch.id),
 ]);
 const assets=(assetsQ.data||[]) as Row[],locations=(locationsQ.data||[]) as Row[];
 const transfers=(transfersQ.data||[]) as Row[],discreps=(discrepQ.data||[]) as Row[];
 const recons=(reconsQ.data||[]) as Row[],jobEvidence=(jobEvidenceQ.data||[]) as Row[];
 const assetEvidence=(assetEvidenceQ.data||[]) as Row[],states=(statusQ.data||[]) as Row[];
 const staff=((peopleQ.data||[]) as Row[]).filter(r=>["admin","manager","technician"].includes(r.programme_role))
  .map(x=>({id:x.user_id,name:x.profiles?.full_name||"Authorised staff",role:x.programme_role}));
 const errors=[assetsQ.error,locationsQ.error,transfersQ.error,discrepQ.error,reconsQ.error,jobEvidenceQ.error,assetEvidenceQ.error,peopleQ.error,statusQ.error]
  .filter(Boolean);
 const verified=locations.filter(l=>l.status==="VERIFIED");
 const active=transfers.filter(t=>t.status==="REQUESTED");
 const confirmed=transfers.filter(t=>t.status==="CONFIRMED");
 const unresolved=discreps.filter(d=>d.status==="OPEN");
 const evidenceChoices=(files:Row[],initial="")=><><option value="">Select actual uploaded document</option>
  {files.filter(f=>typeof f.sha256==="string"&&f.sha256.length===64).map(f=>
   <option key={f.id} value={f.id}>{f.filename} · SHA256 {f.sha256.slice(0,10)}</option>)}</>;
 const badge=(status:string)=>status==="CONFIRMED"?"Verified":status==="REQUESTED"?"Awaiting second person":status;
 const scans=assets.map(a=>({id:a.id,code:a.asset_code}));
 const locationName=(id:string)=>locations.find(l=>l.id===id)?.name||"Unknown location";
 const currentState=(id:string)=>states.find(s=>s.asset_id===id);
 return <div className="stack">
  <div>
   <div className="badge">Council · Chain of Custody · 3/10</div>
   <h1>Physical custody and reconciliation</h1>
   <p className="muted">Two independent staff acknowledgements, same-device QR and serial readback, document evidence, secure-location verification and hash-linked acceptance history. QR alone is not proof of identity or a digital signature.</p>
   <div className="actions">
    <Link className="button secondary" href={"/council-pilot?batch="+batch.id}>Council pilot dashboard</Link>
    <Link className="button secondary" href={"/council-pilot/risks?batch="+batch.id}>Risk and incident register</Link>
    <Link className="button secondary" href={"/api/council-pilot/custody/export?batch="+batch.id}>Private custody audit CSV</Link>
   </div>
  </div>
  {search.notice?<p className="success" role="status">{search.notice}</p>:null}
  {search.error?<p className="error" role="alert">{search.error}</p>:null}
  {errors.length?<p className="error">Custody records could not all be loaded: {errors.map(e=>e?.message).join(" | ")}</p>:null}
  <section className="card">
   <h2>Current controls</h2>
   <p><strong>Pilot:</strong> {batch.status} · <strong>Physical assets:</strong> {assets.length}/20 ·
   <strong> Accepted movements:</strong> {confirmed.length} ·
   <strong> Awaiting second staff:</strong> {active.length} ·
   <strong> Open discrepancies:</strong> {unresolved.length}</p>
   <p className="muted">This pilot remains locked until signed Council authorisation and risk controls are validated. Do not scan synthetic stock into a real receipt or claim that the site has been inspected.</p>
  </section>
  <section className="card stack">
   <h2>Verified secure places</h2>
   <p className="muted">Location names describe actual lockable shelves, custody vehicles, workshops, quarantine zones or external handover points. A second supervisor must verify documented security before they can be used.</p>
   <EvidenceUpload entityType="job" entityId={batch.job_id} label="Upload location inspection, locked-storage, key-control, stocktake and discrepancy-resolution documents"/>
   {locations.length?<ul>{locations.map(l=><li key={l.id}><strong>{l.name}</strong> · {l.kind} · {l.status} · {l.controls}
    {manager&&l.status==="DRAFT"?<form action={verifyCustodyLocation} className="form">
     <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="location_id" value={l.id}/>
     <label>Independent inspection document<select name="evidence_id" required>{evidenceChoices(jobEvidence)}</select></label>
     <button className="button secondary">Independently verify location</button>
    </form>:null}
   </li>)}</ul>:<p>No secure locations registered yet.</p>}
   {manager?<details><summary>Register a physical location (initially unverified)</summary>
    <form action={createCustodyLocation} className="form">
     <input type="hidden" name="batch_id" value={batch.id}/>
     <label>Real place and specific address / secure bay<input name="name" required minLength={5} maxLength={160}/></label>
     <label>Location type<select name="kind">
      {["SECURE_TRANSPORT","LOCKED_STORAGE","SECURE_WORKSHOP","QUARANTINE","EXTERNAL_HANDOVER"].map(x=><option key={x}>{x}</option>)}
     </select></label>
     <label>Verified physical protection and access-control measures<textarea name="controls" minLength={12} required/></label>
     <button className="button secondary">Save unverified location</button>
    </form>
   </details>:null}
  </section>
  <section className="card stack">
   <h2>Transfer register: {transfers.length} requests</h2>
   {active.length?<div className="stack">{active.map(t=>{
    const a=assets.find(x=>x.id===t.asset_id),isReceiver=user.id===t.receiving_user,isReleaser=user.id===t.releasing_user;
    return <details className="card" key={t.id}>
     <summary><strong>{a?.asset_code||t.asset_id}</strong> · {t.event_type} · Awaiting {staff.find(x=>x.id===t.receiving_user)?.name||"receiver"} · from {t.from_location} to {locationName(t.to_location_id)}</summary>
     <p><strong>Releasing operator:</strong> {staff.find(x=>x.id===t.releasing_user)?.name||t.releasing_user} · <strong>Receiving:</strong> {staff.find(x=>x.id===t.receiving_user)?.name||t.receiving_user}</p>
     <p><strong>Document reference:</strong> {t.document_reference} · <strong>Route:</strong> {t.handover_route||"Internal custody"} · External signatory: {t.external_party||"Not applicable"}</p>
     <p><strong>Serial readback:</strong> {t.serial_readback||"No device serial recorded"} · <strong>First QR:</strong> {t.outgoing_scan}</p>
     {isReceiver&&a?<div className="stack">
      <p className="muted">Check physical device serial, correct destination and source documents. The receiver must scan again independently, without relying on the releasing person's scan.</p>
      <form action={decideCustodyTransfer} className="form">
       <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="transfer_id" value={t.id}/>
       <input type="hidden" name="decision" value="CONFIRMED"/>
       <CustodyQrCapture name="incoming_scan" label="Receiver's independent QR scan" assets={[{id:a.id,code:a.asset_code}]} required/>
       <button className="button" type="submit">Accept verified handover</button>
      </form>
      <form action={decideCustodyTransfer} className="form">
       <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="transfer_id" value={t.id}/>
       <input type="hidden" name="decision" value="REJECTED"/>
       <label>Why this device cannot be accepted<textarea name="rejection_reason" required minLength={10}/></label>
       <button className="button secondary">Reject and investigate mismatch</button>
      </form>
     </div>:<p className="muted">Only the specifically named receiver can accept or reject.</p>}
     {isReleaser?<form action={decideCustodyTransfer} className="form">
      <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="transfer_id" value={t.id}/>
      <input type="hidden" name="decision" value="CANCELLED"/>
      <label>Reason for cancelling<textarea name="rejection_reason" required minLength={10}/></label>
      <button className="button secondary">Cancel unconfirmed transfer</button>
     </form>:null}
    </details>;
   })}</div>:<p>No pending transfers.</p>}
   {confirmed.length?<details><summary>View {confirmed.length} independently confirmed movements and hash references</summary>
    <ul>{confirmed.map(t=><li key={t.id}><strong>{assets.find(a=>a.id===t.asset_id)?.asset_code||"Asset"}</strong>
     {" · "}{t.event_type} {t.handover_route||""} · {t.from_location} → {locationName(t.to_location_id)} ·
     {new Date(t.confirmed_at).toLocaleString("en-AU",{timeZone:"Australia/Sydney"})} ·
     chain {String(t.entry_hash).slice(0,16)}…
    </li>)}</ul>
   </details>:null}
  </section>
  <section className="card stack">
   <h2>Asset-by-asset custody</h2>
   {assets.length===0?<p>No Council devices have been received. Intake is blocked until Council, insurance, risk and site approvals are genuine.</p>:null}
   {assets.map(a=>{
    const recent=transfers.find(t=>t.asset_id===a.id&&t.status==="CONFIRMED");
    const state=currentState(a.id);
    const fileList=assetEvidence.filter(e=>e.entity_id===a.id);
    const from=recent?locationName(recent.to_location_id):(a.source_name||"");
    return <details className="card" key={a.id}>
     <summary><strong>{a.asset_code}</strong> · {a.category} · {a.status}
      {" · "}{state?.current_location||"No accepted custody event"} {state?.open_discrepancies?(" · "+state.open_discrepancies+" discrepancy"):null}</summary>
     <div className="stack">
      <p><Link href={"/assets/"+a.id}>Asset record and QR label</Link> · Serial: {a.serial_imei||"MISSING — inspect before accepting"}</p>
      <AssetQr assetCode={a.asset_code} assetId={a.id} productName={a.category}/>
      <p>Last accepted custody: {recent?recent.event_type+" → "+locationName(recent.to_location_id):"NONE"}. Hash: {state?.latest_hash||"Not established"}.</p>
      <EvidenceUpload entityType="asset" entityId={a.id} label="Attach signed custody, Council collection and recipient delivery documents"/>
      <form action={initiateCustodyTransfer} className="form">
       <h3>Start a verified transfer</h3>
       <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="asset_id" value={a.id}/>
       <label>Movement type<select name="event_type">
        {["COLLECTED","RECEIVED","INTERNAL_MOVE","QUARANTINED","RETURNED","HANDOVER"].map(x=><option key={x}>{x}</option>)}
       </select></label>
       <label>Final handover route<select name="handover_route"><option value="">Not final handover</option><option value="DONATE">DONATE · community group</option><option value="RECYCLE">RECYCLE · verified downstream partner</option></select></label>
       <label>Releasing location — must match last verified custody<input name="from_location" defaultValue={from} required minLength={5}/></label>
       <label>Verified destination<select name="to_location_id" required><option value="">Choose independently inspected secure location</option>
        {verified.map(l=><option key={l.id} value={l.id}>{l.name} · {l.kind}</option>)}
       </select></label>
       <label>Receiving operator (must not be you)<select name="receiving_user" required><option value="">Choose second authorised person</option>
        {staff.filter(p=>p.id!==user.id).map(p=><option key={p.id} value={p.id}>{p.name} · {p.role}</option>)}
       </select></label>
       <CustodyQrCapture name="outgoing_scan" label="Releasing operator's QR label scan" assets={[{id:a.id,code:a.asset_code}]} required/>
       <label>Serial independently read from device casing<input name="serial_readback" required={!!a.serial_imei} placeholder={a.serial_imei||"Device serial unavailable — supervisor review required"}/></label>
       <label>External party's real name (collection or handover, where applicable)<input name="external_party"/></label>
       <label>Signed handover/collection receipt number<input name="document_reference" required minLength={3}/></label>
       <label>Original asset-linked custody file<select name="evidence_id" required>{evidenceChoices(fileList)}</select></label>
       <label>Notes, condition and seals<textarea name="request_notes"/></label>
       <button className="button" type="submit">Request custody transfer (not complete until second scan)</button>
      </form>
     </div>
    </details>;
   })}
  </section>
  <section className="card stack">
   <h2>Physical inventory reconciliation</h2>
   <p className="muted">Walk to the actual secure location, scan every device, and upload a signed count sheet or photos. The database compares the scans with the most recent independent custody records. Missing/unexpected devices create OPEN discrepancies and pause an active pilot.</p>
   {recons.length?<details><summary>Recent physical count results</summary><ul>{recons.map(c=>
    <li key={c.id}>{locationName(c.location_id)} · {c.status} ·
     {new Date(c.checked_at).toLocaleString("en-AU",{timeZone:"Australia/Sydney"})} ·
     {c.observed_codes.length} scanned, {c.expected_codes.length} expected · Missing {(c.missing_codes||[]).join(", ")||"none"} · Unexpected {(c.unexpected_codes||[]).join(", ")||"none"}
    </li>)}</ul></details>:null}
   <form action={reconcileCustodyLocation} className="form">
    <input type="hidden" name="batch_id" value={batch.id}/>
    <label>Physically inspected secure place<select name="location_id" required><option value="">Choose verified location</option>
     {verified.filter(l=>l.kind!=="EXTERNAL_HANDOVER").map(l=><option value={l.id} key={l.id}>{l.name}</option>)}
    </select></label>
    <CustodyQrCapture name="observed_codes" label="Scan actual devices, one QR label per line (0 is allowed for a verified empty location)" assets={scans} multiple/>
    <label>Original job-linked signed physical count evidence<select name="evidence_id" required>{evidenceChoices(jobEvidence)}</select></label>
    <label>Count notes / inspector and conditions<textarea name="notes"/></label>
    <button className="button secondary" type="submit">Reconcile count against verified ledger</button>
   </form>
  </section>
  <section className="card stack">
   <h2>Discrepancies and missing-device alerts</h2>
   {discreps.length===0?<p>No discrepancies have been recorded. This does not establish that any physical inspection has occurred.</p>:null}
   {discreps.map(d=><details key={d.id}>
    <summary><strong>{d.status}</strong> · {d.discrepancy_type} · {d.description}</summary>
    <p>Asset: {assets.find(a=>a.id===d.asset_id)?.asset_code||"Not matched"} · Location: {locationName(d.location_id)} · Opened {new Date(d.opened_at).toLocaleString("en-AU",{timeZone:"Australia/Sydney"})}</p>
    {d.status==="RESOLVED"?<p>Resolved: {d.resolution}</p>:null}
    {manager&&d.status==="OPEN"?<form action={resolveCustodyDiscrepancy} className="form">
     <input type="hidden" name="batch_id" value={batch.id}/><input type="hidden" name="discrepancy_id" value={d.id}/>
     <label>Independent investigation and actual physical reconciliation<textarea name="resolution" required minLength={15}/></label>
     <label>Original job-linked resolution evidence<select name="resolution_evidence_id" required>{evidenceChoices(jobEvidence)}</select></label>
     <button className="button secondary">Independently resolve discrepancy</button>
    </form>:null}
   </details>)}
   <form action={reportCustodyDiscrepancy} className="form">
    <h3>Report actual discrepancy</h3>
    <input type="hidden" name="batch_id" value={batch.id}/>
    <label>Device<select name="asset_id"><option value="">Unknown/unidentified</option>
     {assets.map(a=><option key={a.id} value={a.id}>{a.asset_code}</option>)}
    </select></label>
    <label>Place<select name="location_id"><option value="">Unknown location</option>
     {locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
    </select></label>
    <label>Discrepancy type<select name="discrepancy_type">
     {["MISSING","UNEXPECTED","MISMATCHED_LABEL","BROKEN_SEAL","DAMAGED","UNAUTHORISED_MOVEMENT","OTHER"].map(x=><option key={x}>{x}</option>)}
    </select></label>
    <label>What was actually discovered?<textarea name="description" minLength={10} required/></label>
    <button className="button secondary">Record and escalate discrepancy</button>
   </form>
   <p className="muted">Reporting here is not an emergency service or statutory notification. If equipment is missing or data may be exposed, secure the area, inform the responsible supervisor and follow the real incident-response procedures.</p>
  </section>
 </div>;
}
