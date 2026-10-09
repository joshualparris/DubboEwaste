import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
type T={event_id:string;item_category:string;status:string;outcome:string|null;barrier:string|null;measured_weight_kg:number|null};
export default async function AnnualImpact({searchParams}:{searchParams:Promise<{year?:string}>}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role??"")))redirect("/repair-cafe-volunteers");
 const p=await searchParams,year=/^20\d{2}$/.test(p.year??"")?p.year!:String(new Date().getFullYear());
 const [er,tr,ar,fr]=await Promise.all([
  supabase.from("repair_cafe_sessions").select("id,event_date,title").gte("event_date",year+"-01-01").lte("event_date",year+"-12-31").limit(1000),
  supabase.from("repair_cafe_tickets").select("event_id,item_category,status,outcome,barrier,measured_weight_kg").limit(10000),
  supabase.from("repair_cafe_attendance").select("event_id,check_in_at,check_out_at").limit(10000),
  supabase.from("repair_cafe_visitor_feedback").select("event_id,rating").limit(10000)
 ]);
 const ids=new Set((er.data??[]).map(e=>e.id)),tickets=((tr.data??[]) as T[]).filter(t=>ids.has(t.event_id)&&t.status!=="void");
 const completed=tickets.filter(t=>["completed","referred","not_attempted"].includes(t.status));
 const fixed=tickets.filter(t=>t.outcome==="fixed").length,partial=tickets.filter(t=>t.outcome==="partially_fixed").length;
 const weight=tickets.filter(t=>["fixed","partially_fixed"].includes(t.outcome??"")&&t.measured_weight_kg!==null).reduce((n,t)=>n+Number(t.measured_weight_kg),0);
 const attendance=(ar.data??[]).filter(x=>ids.has(x.event_id));
 const hours=attendance.filter(x=>x.check_in_at&&x.check_out_at).reduce((n,x)=>n+(new Date(x.check_out_at!).getTime()-new Date(x.check_in_at!).getTime())/3600000,0);
 const responses=(fr.data??[]).filter(x=>ids.has(x.event_id));
 const avg=responses.length?responses.reduce((s,x)=>s+x.rating,0)/responses.length:null;
 const issues=[er.error,tr.error,ar.error,fr.error].filter(Boolean);
 const categories=Object.entries(tickets.reduce((acc:Record<string,number>,x)=>(acc[x.item_category]=(acc[x.item_category]??0)+1,acc),{})).sort((a,b)=>b[1]-a[1]);
 const max=Math.max(1,...categories.map(x=>x[1]));
 return <main style={{maxWidth:1000,margin:"auto",padding:18,display:"grid",gap:18}}>
  <nav><Link href="/repair-cafe-volunteers/reports">← Reports</Link></nav>
  <h1>Annual Repair Café impact</h1>
  <form method="get"><label>Reporting year <input name="year" type="number" min="2020" max="2100" defaultValue={year}/></label> <button className="button secondary">Show year</button></form>
  {issues.length?<p className="error">Data unavailable: {issues.map(e=>e?.message).join("; ")}. Do not publish these figures.</p>:null}
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
   {([["Events",(er.data??[]).length],["Items",tickets.length],["Closed repairs",completed.length],["Fixed",fixed],["Partially fixed",partial],["Verified hours",hours.toFixed(2)],["Measured weight",weight.toFixed(2)+" kg"],["Visitor rating",avg===null?"No data":avg.toFixed(1)+"/5"]] as [string,string|number][]).map(([label,value])=><article className="card" key={label}><strong style={{fontSize:24}}>{value}</strong><p>{label}</p></article>)}
  </div>
  <section className="card"><h2>Repairs by category</h2>
  {categories.map(([label,value])=><div key={label} style={{marginBottom:12}}><strong>{label} · {value}</strong><div style={{height:12,background:"#dce5df",borderRadius:12}}><div style={{width:(value/max*100)+"%",height:"100%",background:"#26734c",borderRadius:12}}/></div></div>)}
  {!categories.length?<p>No repair records for this year.</p>:null}
  </section>
  <p className="muted">Counts describe documented outcomes, not items saved from landfill. Weight includes only physically measured fixed or partially fixed items. No estimated carbon savings are claimed. Open volunteer shifts are excluded from completed hours.</p>
  <p className="muted">Data-quality note: results include up to 10,000 ticket and attendance rows each. Request a complete paginated export if volume exceeds that cap.</p>
  <p><Link href="/repair-cafe-volunteers/reports/open-data">Open Repair data export →</Link></p>
 </main>;
}
