import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {saveRisk,saveControl,addInsurance,addRiskReview,saveInsuranceRenewal} from "../actions";
type R={id:string;code:string;title:string;category:string;status:string;owner_name:string;likelihood:number|null;impact:number|null;residual_likelihood:number|null;residual_impact:number|null;review_due:string|null;review_note:string};
const ratings=[1,2,3,4,5];
export default async function Assessment({searchParams}:{searchParams:Promise<{q?:string;category?:string;priority?:string}>}){
const {context,supabase}=await requireProgrammeContext();
if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))redirect("/repair-cafe-volunteers");
const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
const [{data:risks,error},{data:controls},{data:policies},{data:reviews}]=await Promise.all([
supabase.from("repair_cafe_risks").select("*").order("code"),
supabase.from("repair_cafe_risk_controls").select("*").order("sort_order"),
supabase.from("repair_cafe_insurance_policies").select("*").order("created_at",{ascending:false}),
supabase.from("repair_cafe_risk_reviews").select("*").order("reviewed_at",{ascending:false}).limit(30)
]);
const params=await searchParams,all=(risks||[]) as R[],score=(r:R)=>(r.likelihood||0)*(r.impact||0),now=new Date().toISOString().slice(0,10);
const categories=[...new Set(all.map(r=>r.category||"General"))].sort();
const selected=all.filter(r=>(!params.q||(r.code+" "+r.title).toLowerCase().includes(params.q.toLowerCase()))&&(!params.category||r.category===params.category)&&(!params.priority||(params.priority==="unrated"?score(r)===0:params.priority==="high"?score(r)>=15:params.priority==="overdue"?!!r.review_due&&r.review_due<now:r.status!=="closed")));
const input={padding:8,maxWidth:"100%"};return <main style={{maxWidth:1100,margin:"0 auto",padding:20,lineHeight:1.6}}>
<nav><Link href="/repair-cafe-volunteers/compliance">Existing control tracker</Link> · <Link href="/repair-cafe-volunteers">Volunteer hub</Link></nav>
<h1>Compliance assessment & insurance</h1><p>Private management: priority review, deadlines, insurance and sign-off recommendations. None of these entries proves an external approval.</p>
{error?<p role="alert">{error.message}</p>:null}
<p><strong>{all.length} risks</strong> · {all.filter(r=>!score(r)).length} not assessed · {all.filter(r=>score(r)>=15).length} rated high/critical · {all.filter(r=>r.review_due&&r.review_due<now).length} overdue reviews</p>
<form method="get" style={{display:"flex",flexWrap:"wrap",gap:10}}><label>Search<input style={input} name="q" defaultValue={params.q}/></label><label>Category<select style={input} name="category" defaultValue={params.category||""}><option value="">All</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label>Priority<select style={input} name="priority" defaultValue={params.priority||""}><option value="">All</option><option value="unrated">Unrated</option><option value="high">High 15+</option><option value="overdue">Overdue reviews</option><option value="open">Open</option></select></label><button type="submit">Filter</button><Link href="?">Clear</Link></form>
<p>{selected.length} matching records</p>
{selected.map(r=><details key={r.id} style={{border:"1px solid #aaa",borderRadius:10,padding:15,margin:"12px 0"}}><summary><strong>{r.code} · {r.title}</strong> — {r.category} — {score(r)?score(r)+"/25":"Unrated"}</summary>
<form action={saveRisk} style={{display:"grid",gap:10,paddingTop:15}}>
<input type="hidden" name="id" value={r.id}/><label>Owner<input style={input} name="owner_name" defaultValue={r.owner_name}/></label>
<label>Status<select name="status" defaultValue={r.status}>{["open","in_progress","awaiting_approval","closed"].map(s=><option value={s} key={s}>{s}</option>)}</select></label>
{(["likelihood","impact","residual_likelihood","residual_impact"] as const).map(k=><label key={k}>{k.replaceAll("_"," ")} (1–5)<select name={k} defaultValue={r[k]??""}><option value="">Not assessed</option>{ratings.map(n=><option key={n} value={n}>{n}</option>)}</select></label>)}
<label>Next review date<input style={input} type="date" name="review_due" defaultValue={r.review_due||""}/></label>
<label>Review note<textarea name="review_note" defaultValue={r.review_note} maxLength={2000}/></label><button type="submit">Save assessment</button></form>
<h3>Control deadlines</h3>{(controls||[]).filter(c=>c.risk_id===r.id).map(c=><form key={c.id} action={saveControl} style={{display:"grid",gap:5,borderTop:"1px solid #ddd",padding:10}}><strong>{c.description}</strong><input type="hidden" name="id" value={c.id}/><label>Owner<input name="owner_name" defaultValue={c.owner_name}/></label><label>Due<input type="date" name="due_on" defaultValue={c.due_on||""}/></label><label>Status<select name="status" defaultValue={c.status}>{["not_started","in_progress","awaiting_verification","verified"].map(s=><option key={s}>{s}</option>)}</select></label><label>Evidence reference<input name="evidence_reference" defaultValue={c.evidence_reference}/></label><button>Save control</button></form>)}
<h3>Review decision</h3><form action={addRiskReview} style={{display:"grid",gap:8}}><input type="hidden" name="risk_id" value={r.id}/><label>Findings<textarea name="findings" required minLength={10}/></label><label>Decision<select name="decision"><option value="keep_open">Keep open</option><option value="request_changes">Request changes</option><option value="recommend_approval">Recommend approval (not approval)</option></select></label><button>Save review</button></form>
</details>)}
<section><h2>Insurance policies</h2><p>Unknown insurance must remain unconfirmed until verified directly with the insurer.</p>
<form action={addInsurance} style={{display:"grid",gap:8,maxWidth:600}}>
<label>Policy type<input name="policy_type" required/></label><label>Provider<input name="provider"/></label><label>Insured entity<input name="insured_entity"/></label><label>Policy number/reference<input name="policy_reference"/></label><label>Expiry<input type="date" name="expiry_on"/></label><label>Coverage and exclusions<textarea name="coverage_note"/></label><label>Evidence link/reference<input name="evidence_reference"/></label><button>Add unconfirmed insurance record</button></form>
<div>{(policies||[]).map(p=>{const days=p.expiry_on?Math.ceil((new Date(p.expiry_on+"T00:00:00Z").getTime()-Date.now())/86400000):null;return <form key={p.id} action={saveInsuranceRenewal} style={{display:"grid",gap:7,border:"1px solid #aaa6",padding:14,marginTop:10,borderRadius:10}}>
 <strong>{p.policy_type} · {p.provider||"Insurer unknown"}</strong><span>Status: {p.status} · Expires: {p.expiry_on||"Unknown"}</span>
 <strong>{days===null?"Expiry unknown":days<0?"EXPIRED":days<=30?"Renewal urgent":days<=90?"Renewal due within 90 days":"Current date recorded"}</strong>
 <input name="id" type="hidden" value={p.id}/><label>Renewal owner<input name="renewal_owner" maxLength={120} defaultValue={p.renewal_owner??"Unassigned"}/></label>
 <label>Next renewal action<input name="renewal_action" maxLength={1000} defaultValue={p.renewal_action??""}/></label><label>Next follow-up date<input name="next_review_on" type="date" defaultValue={p.next_review_on??""}/></label><button type="submit">Save renewal plan</button>
 </form>})}</div></section>
<section><h2>Recorded reviews</h2><ul>{(reviews||[]).map(v=><li key={v.id}>{all.find(r=>r.id===v.risk_id)?.code}: {v.decision}, {v.findings}</li>)}</ul></section>
</main>
}