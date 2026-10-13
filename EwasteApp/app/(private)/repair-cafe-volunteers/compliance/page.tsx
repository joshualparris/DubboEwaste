import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {saveControl,saveRisk} from "./actions";
type Risk={id:string;code:string;title:string;description:string;status:string;owner_name:string;host_approved:boolean};
type Control={id:string;risk_id:string;description:string;status:string;owner_name:string;evidence_reference:string;verified_at:string|null;sort_order:number};
const states=["not_started","in_progress","awaiting_verification","verified"];
const label=(s:string)=>s.replaceAll("_"," ").replace(/^./,c=>c.toUpperCase());
export default async function CompliancePage({searchParams}:{searchParams:Promise<{error?:string;notice?:string}>}){
 const {context,supabase}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role??"")))redirect("/repair-cafe-volunteers");
 const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const [{data:risks,error:riskError},{data:controls,error:controlError},{data:history,error:historyError}]=await Promise.all([
 supabase.from("repair_cafe_risks").select("*").order("code"),
 supabase.from("repair_cafe_risk_controls").select("*").order("sort_order"),
 supabase.from("repair_cafe_risk_history").select("id,risk_id,action,occurred_at,actor").order("occurred_at",{ascending:false}).limit(30)
 ]);
 const query=await searchParams;
 const rr=(risks??[]) as Risk[],cc=(controls??[]) as Control[];
 return <main style={{maxWidth:1050,margin:"0 auto",padding:"32px 18px",lineHeight:1.6}}>
 <nav><Link href="/repair-cafe-volunteers">Volunteer Hub</Link> · <Link href="/repair-cafe-volunteers/operations">Operations</Link> · <Link href="/repair-cafe-volunteers/sessions">Events</Link></nav>
 <header><p>REPAIR CAFÉ DUBBO · PRIVATE MANAGEMENT</p><h1>Risks & compliance</h1><p>Assign control owners, collect evidence references and verify real-world responsibilities. A draft does not mean the event is approved.</p></header>
 {query.error?<p role="alert" style={{color:"#b91c1c"}}>{query.error}</p>:null}
 {query.notice?<p role="status">{query.notice}</p>:null}
 {riskError||controlError||historyError?<p role="alert">Unable to load protected compliance records: {[riskError?.message,controlError?.message,historyError?.message].filter(Boolean).join("; ")}. Contact an administrator to confirm Repair Café programme access.</p>:null}
 <section aria-label="Summary" style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:25}}>
 <strong>{rr.filter(r=>r.status!=="closed").length} open risks</strong>
 <strong>{cc.filter(c=>c.status==="verified").length}/{cc.length} controls verified</strong>
 <strong>{rr.filter(r=>r.status==="closed").length} closed risks</strong>
 </section>
 {rr.map(r=>{const items=cc.filter(c=>c.risk_id===r.id),verified=items.filter(c=>c.status==="verified").length,ready=items.length>0&&verified===items.length&&r.host_approved;
 return <section key={r.id} style={{border:"1px solid #8886",borderRadius:12,padding:20,marginBottom:24}}>
 <h2>{r.code}: {r.title}</h2><p>{r.description}</p>
 <p><b>Status:</b> {label(r.status)} · <b>Controls:</b> {verified}/{items.length} verified · <b>Host approval:</b> {r.host_approved?"Recorded":"Not recorded"}</p>
 <form action={saveRisk} style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"end",marginBottom:20}}>
 <input type="hidden" name="id" value={r.id}/>
 <label>Responsible coordinator<br/><input name="owner_name" defaultValue={r.owner_name} maxLength={120} required style={{padding:8}}/></label>
 <label>Risk status<br/><select name="status" defaultValue={r.status} style={{padding:8}}>{["open","in_progress","awaiting_approval","closed"].map(s=><option key={s} value={s} disabled={s==="closed"&&!ready}>{label(s)}</option>)}</select></label>
 <button type="submit" style={{padding:9}}>Save risk</button>
 </form>
 <h3>Required controls</h3>
 {items.map((c,i)=><form key={c.id} action={saveControl} style={{borderTop:"1px solid #8884",padding:"15px 0",display:"grid",gap:9}}>
 <input type="hidden" name="id" value={c.id}/>
 <label><strong>{i+1}. {c.description}</strong></label>
 <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
 <label>Owner<br/><input name="owner_name" defaultValue={c.owner_name} maxLength={120} style={{padding:7}}/></label>
 <label>Status<br/><select name="status" defaultValue={c.status} style={{padding:7}}>{states.map(s=><option key={s} value={s}>{label(s)}</option>)}</select></label>
 </div>
 <label>Evidence reference (private document URL / identifier; do not paste sensitive personal details)<br/><input name="evidence_reference" defaultValue={c.evidence_reference} maxLength={1000} style={{width:"100%",padding:8}} placeholder="Evidence identifier, document path or approved record"/></label>
 {c.verified_at?<small>Verified: {new Date(c.verified_at).toLocaleString("en-AU",{timeZone:"Australia/Sydney"})}</small>:null}
 <button style={{justifySelf:"start",padding:"8px 14px"}} type="submit">Save control</button>
 </form>)}
 <p><strong>Closure gate:</strong> {ready?"All controls verified and host approved. Closure may be requested.":"Blocked until all eight controls are verified and legal host approval is formally recorded."}</p>
 </section>})}
 <section><h2>Recent activity</h2>{(history??[]).length?<ul>{(history??[]).map(h=><li key={h.id}>{new Date(h.occurred_at).toLocaleString("en-AU",{timeZone:"Australia/Sydney"})}: {label(h.action)}</li>)}</ul>:<p>No changes recorded yet.</p>}</section>
 <p><small>Stop-work and reopening decisions remain real-world human decisions. This screen does not approve electrical work or establish insurance cover.</small></p>
 </main>;
}
