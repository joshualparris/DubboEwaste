import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {savePreflight,recordHold} from "./actions";
const checks=[["host","Legal host and responsible coordinator confirmed"],["insurance","Insurance covers venue, activities, volunteers and visitor property"],["venue","Written venue permission and accessible layout checked"],["fire","Fire, exits, evacuation and first-aid equipment checked"],["electrical","Electrical scope, RCDs and testing procedures approved"],["battery","Lithium-battery isolation and disposal arrangements checked"],["people","Safety lead, deputy and competent station leads present"],["briefing","Volunteer safety briefing and stop-work authority communicated"],["scope","Every offered repair category has approval and necessary safeguards"]] as const;
export default async function Preflight({searchParams}:{searchParams:Promise<{event?:string;notice?:string;error?:string}>}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))redirect("/repair-cafe-volunteers");
 const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const params=await searchParams;
 const {data:events,error:eventError}=await supabase.from("repair_cafe_sessions").select("id,title,event_date,status").is("deleted_at",null).order("event_date",{ascending:false}).limit(100);
 const selected=events?.find(x=>x.id===params.event)??events?.[0];
 const fetched=selected?await Promise.all([
 supabase.from("repair_cafe_event_inspections").select("item_key,result,notes,inspected_at").eq("event_id",selected.id),
 supabase.from("repair_cafe_event_go_nogo").select("decision,rationale,decided_at").eq("event_id",selected.id).maybeSingle(),
 supabase.from("repair_cafe_risks").select("code,title,status").in("code",["RC-001","RC-002","RC-008","RC-009","RC-010","RC-020","RC-039"]).neq("status","closed")
 ]):null;
 const results=fetched?.[0].data??[];
 const decision=fetched?.[1].data??null;
 const blockers=fetched?.[2].data??[];
 const checkError=fetched?.[0].error??null;
 const decisionError=fetched?.[1].error??null;
 const passing=checks.filter(c=>results?.some(x=>x.item_key===c[0]&&x.result==="pass")).length;
 const errors=[eventError,checkError,decisionError].filter(Boolean);
 const style={padding:10,border:"1px solid #aaa",borderRadius:8};
 return <main style={{maxWidth:1000,margin:"0 auto",padding:"25px 18px",lineHeight:1.6}}>
 <nav><Link href="/repair-cafe-volunteers">Volunteer Hub</Link> · <Link href="/repair-cafe-volunteers/compliance">Risk Register</Link> · <Link href="/repair-cafe-volunteers/sessions">Sessions</Link></nav>
 <h1>Repair Café · Event safety preflight</h1><p>Inspired by field inspection workflows. No event is approved through this page: the event remains blocked until a legally authorised host and safety lead complete the real-world authorisation.</p>
 {params.error?<p role="alert">{params.error}</p>:null}{params.notice?<p role="status">{params.notice}</p>:null}
 {errors.length?<p role="alert">Unable to load records: {errors.map(e=>e?.message).join("; ")}</p>:null}
 <div style={style}><h2>Choose event</h2><div style={{display:"flex",flexWrap:"wrap",gap:10}}>{(events||[]).map(e=><Link key={e.id} href={"?event="+e.id}>{e.event_date} · {e.title}</Link>)}</div></div>
 {selected?<><h2>{selected.title} · {selected.event_date}</h2>
 <p><strong>{passing}/{checks.length} mandatory checks passed</strong> · Decision: <strong>{decision?.decision||"BLOCKED (no decision recorded)"}</strong></p>
 <section style={{border:"1px solid #e5a35a",padding:15,borderRadius:10}}>
 <h3>Unresolved global launch gates</h3><ul>{(blockers||[]).map(r=><li key={r.code}>{r.code} · {r.title} ({r.status})</li>)}</ul>
 <p>Inspection passes alone cannot override unresolved host, insurance or governance risks.</p></section>
 {checks.map((c,i)=>{const current=results?.find(x=>x.item_key===c[0]);return <form key={c[0]} action={savePreflight} style={{...style,marginTop:12,display:"grid",gap:8}}>
 <input name="event" type="hidden" value={selected.id}/><input name="key" type="hidden" value={c[0]}/>
 <strong>{i+1}. {c[1]}</strong><label>Result <select name="result" defaultValue={current?.result||"unchecked"}><option value="unchecked">Not checked</option><option value="pass">Passed with evidence</option><option value="fail">Failed / action needed</option><option value="not_applicable">Not applicable (requires scope review)</option></select></label>
 <label>Inspection notes and evidence reference<textarea name="notes" defaultValue={current?.notes||""} maxLength={1500} rows={2} style={{width:"100%"}}/></label>
 <button type="submit">Save check</button></form>})}
 <section style={{...style,marginTop:20}}><h2>Stop / hold the event</h2><p>Use immediately if unsafe. This does not replace calling emergency services.</p>
 <form action={recordHold}><input type="hidden" name="event" value={selected.id}/><label>Why the event must remain on hold <textarea name="reason" required minLength={5} maxLength={1500}/></label><button type="submit">Record safety hold</button></form></section>
 </>:<p>No active event records. Create an event in Sessions first.</p>}
 </main>;
}