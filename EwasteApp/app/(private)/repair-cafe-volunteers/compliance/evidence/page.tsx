import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {submitEvidence,reviewEvidence} from "./actions";
export default async function EvidencePage({searchParams}:{searchParams:Promise<{error?:string;notice?:string}>}){
 const {context,supabase}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))redirect("/repair-cafe-volunteers");
 const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const p=await searchParams;
 const [{data:risks,error:rerr},{data:controls},{data:evidence,error:eerr},{data:history}]=await Promise.all([
 supabase.from("repair_cafe_risks").select("id,code,title").order("code"),
 supabase.from("repair_cafe_risk_controls").select("id,risk_id,description").order("sort_order"),
 supabase.from("repair_cafe_compliance_evidence").select("*").order("submitted_at",{ascending:false}).limit(200),
 supabase.from("repair_cafe_evidence_history").select("*").order("at",{ascending:false}).limit(40)
 ]);
 const records=evidence??[],expired=(d:string|null)=>!!d&&d<new Date().toISOString().slice(0,10);
 return <main style={{maxWidth:1080,padding:20,margin:"0 auto",lineHeight:1.65}}>
 <nav><Link href="/repair-cafe-volunteers/compliance">Risk Register</Link> · <Link href="/repair-cafe-volunteers/preflight">Event preflight</Link> · <Link href="/repair-cafe-volunteers">Volunteer Hub</Link></nav>
 <h1>Compliance evidence & independent review</h1><p>Reference documents, assign a different reviewer and retain immutable decisions. A document reference is not the same as a verified certificate or insurer approval.</p>
 {p.error?<p role="alert">{p.error}</p>:null}{p.notice?<p role="status">{p.notice}</p>:null}
 {rerr||eerr?<p role="alert">Unable to load secure records: {rerr?.message||eerr?.message}</p>:null}
 <p><strong>{records.filter(x=>x.status==="submitted").length} awaiting review</strong> · <strong>{records.filter(x=>x.status==="approved"&&!expired(x.expires_on)).length} accepted references</strong> · <strong>{records.filter(x=>expired(x.expires_on)).length} expired</strong></p>
 <section style={{border:"1px solid #8885",padding:18,borderRadius:12}}>
 <h2>Submit evidence for independent review</h2>
 <form action={submitEvidence} style={{display:"grid",gap:10,maxWidth:750}}>
 <label>Type<select name="kind"><option value="insurance">Insurance</option><option value="host_agreement">Host agreement</option><option value="role_acceptance">Role acceptance</option><option value="competency">Competency</option><option value="other">Other</option></select></label>
 <label>Document title<input name="title" required minLength={4} maxLength={180}/></label>
 <label>Related risk<select name="risk_id" required><option value="">Select risk</option>{(risks??[]).map(r=><option key={r.id} value={r.id}>{r.code} · {r.title}</option>)}</select></label>
 <label>Specific control (optional)<select name="control_id"><option value="">None</option>{(controls??[]).map(c=><option key={c.id} value={c.id}>{risks?.find(r=>r.id===c.risk_id)?.code} · {c.description.slice(0,80)}</option>)}</select></label>
 <label>Evidence reference or secure document location<input name="reference" maxLength={800} placeholder="Approved private file ID, case ID or document reference"/></label>
 <label>Expiry date (if applicable)<input name="expires_on" type="date"/></label>
 <label>Coverage, limitations and what remains to verify<textarea name="coverage_note" rows={3} maxLength={1200}/></label>
 <button type="submit">Submit for review</button></form>
 </section>
 <section><h2>Review queue and decisions</h2>
 {records.map(x=><article key={x.id} style={{border:"1px solid #8885",borderRadius:10,padding:16,margin:"12px 0"}}>
 <h3>{x.title}</h3><p>{x.kind.replaceAll("_"," ")} · {x.status.toUpperCase()}{expired(x.expires_on)?" · EXPIRED":""} · {risks?.find(r=>r.id===x.risk_id)?.code??"Linked control"}</p>
 <p><strong>Reference:</strong> {x.reference||"Not supplied"} · <strong>Expiry:</strong> {x.expires_on||"Not specified"}</p>
 <p>{x.coverage_note}</p>
 {x.status==="submitted"?(x.submitted_by===user.id?<p>Awaiting another authorised coordinator: you cannot review your own submission.</p>:<form action={reviewEvidence} style={{display:"grid",gap:10}}>
 <input type="hidden" name="id" value={x.id}/><label>Decision<select name="status"><option value="rejected">Reject / corrections needed</option><option value="approved">Approve evidence reference</option></select></label><label>Reason<textarea name="reason" required minLength={10} maxLength={1200}/></label><button type="submit">Record independent decision</button></form>):<p>Decision: {x.review_reason} · {x.reviewed_at?new Date(x.reviewed_at).toLocaleString("en-AU",{timeZone:"Australia/Sydney"}):"No review timestamp"}</p>}
 </article>)}
 </section>
 <section><h2>Audit timeline</h2><ul>{(history??[]).map(h=><li key={h.id}>{new Date(h.at).toLocaleString("en-AU",{timeZone:"Australia/Sydney"})} · {h.action} · {h.decision}</li>)}</ul></section>
 <p><small>Accepted evidence does not automatically close risks, grant insurance coverage or authorise public events. Verify the actual document independently.</small></p>
 </main>;
}