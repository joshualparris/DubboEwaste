import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {PrintButton} from "@/components/PrintButton";

const date=(d:string)=>new Date(d+"T12:00:00Z").toLocaleDateString("en-AU",{timeZone:"Australia/Sydney",day:"numeric",month:"short",year:"numeric"});
const pct=(n:number,d:number)=>d===0?"No data":(100*n/d).toFixed(1)+"%";
type Ticket={item_category:string;outcome:string|null;status:string;barrier:string|null;measured_weight_kg:number|null};
export default async function CafeReports({searchParams}:{searchParams:Promise<{event?:string}>}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))redirect("/repair-cafe-volunteers/sessions");
 const {data:events,error:eventsError}=await supabase.from("repair_cafe_sessions").select("id,event_date,title,status,deleted_at").order("event_date",{ascending:false}).limit(100);
 const active=(events??[]).filter(x=>!x.deleted_at),params=await searchParams;
 const selected=active.find(x=>x.id===params.event)??active[0];
 const eventId=selected?.id;
 const [ticketResult,attendanceResult,incidentResult]=eventId?await Promise.all([
  supabase.from("repair_cafe_tickets").select("item_category,outcome,status,barrier,measured_weight_kg").eq("event_id",eventId).limit(2500),
  supabase.from("repair_cafe_attendance").select("check_in_at,check_out_at").eq("event_id",eventId).limit(500),
  supabase.from("repair_cafe_incidents").select("severity,state").eq("event_id",eventId).limit(300)
 ]):[{data:[],error:null},{data:[],error:null},{data:[],error:null}];
 const rows=(ticketResult.data??[]) as Ticket[],valid=rows.filter(r=>r.status!=="void");
 const count=(name:string)=>valid.filter(r=>r.outcome===name).length;
 const successful=count("fixed"),partial=count("partially_fixed"),
  notFixed=count("not_fixed"),referred=count("referred"),notAttempted=count("not_attempted");
 const attempted=successful+partial+notFixed;
 const measured=valid.filter(r=>r.outcome==="fixed"||r.outcome==="partially_fixed")
  .filter(r=>r.measured_weight_kg!==null);
 const weighedKg=measured.reduce((sum,r)=>sum+Number(r.measured_weight_kg),0);
 const attend=attendanceResult.data??[];
 const closed=attend.filter(x=>x.check_in_at&&x.check_out_at);
 const hours=closed.reduce((sum,a)=>sum+(new Date(a.check_out_at!).getTime()-new Date(a.check_in_at!).getTime())/3600000,0);
 const cats=Object.entries(valid.reduce((o:Record<string,number>,r)=>{o[r.item_category]=(o[r.item_category]??0)+1;return o;},{})).sort((a,b)=>b[1]-a[1]);
 const barriers=Object.entries(valid.filter(x=>x.barrier).reduce((o:Record<string,number>,r)=>{const k=r.barrier!;o[k]=(o[k]??0)+1;return o;},{})).sort((a,b)=>b[1]-a[1]);
 const issues=[eventsError,ticketResult.error,attendanceResult.error,incidentResult.error].filter(Boolean);
 return <div className="stack" style={{maxWidth:1150,margin:"0 auto"}}>
  <nav className="actions no-print"><Link className="button secondary" href="/repair-cafe-volunteers">Volunteer Hub</Link><Link className="button secondary" href="/repair-cafe-volunteers/event-desk">Event Desk</Link><Link className="button secondary" href="/repair-cafe-volunteers/operations">Operations & safety</Link></nav>
  <div className="card" style={{background:"linear-gradient(110deg,#e6f3e8,#fbf6e9)"}}>
   <div className="badge">Private · Repair Café outcomes</div><h1>Impact and volunteer reports</h1>
   <p className="muted">Actual measured results only. No invented CO₂ savings, weight estimates or implied repair successes.</p>
   <div className="actions no-print"><PrintButton/><Link className="button secondary" href={eventId?"/repair-cafe-volunteers/reports/export?event="+eventId:"/repair-cafe-volunteers/reports/export"}>Export CSV</Link></div>
  </div>
  <section className="card"><h2>Choose a session</h2><div className="actions no-print">
   {active.map(s=><Link href={"?event="+s.id} key={s.id} className={"button "+(s.id===eventId?"":"secondary")}>{date(s.event_date)} · {s.status}</Link>)}
  </div>{!selected?<p>No active sessions have been created.</p>:<p><strong>{selected.title}</strong> · {date(selected.event_date)}</p>}
  </section>
  {issues.length?<div className="error" role="alert">Some report records could not load. Do not use these totals for grants yet: {issues.map(x=>x?.message).join("; ")}</div>:null}
  {selected?<><section className="grid" aria-label="Session reporting metrics">
   {[
    ["Items checked in",valid.length],
    ["Fixed",successful],
    ["Partially fixed",partial],
    ["Not fixed",notFixed],
    ["Referred",referred],
    ["Not attempted",notAttempted],
    ["Repair attempts",attempted],
    ["Success among attempts",pct(successful,attempted)],
    ["Volunteers checked in",attend.filter(x=>x.check_in_at).length],
    ["Completed volunteer hours",hours.toFixed(2)],
    ["Measured weight of fixed/partial items",weighedKg.toFixed(3)+" kg"],
    ["Items with usable weight evidence",measured.length]
   ].map(([label,num])=><article key={label} className="card"><div className="metric">{num}</div><p className="muted">{label}</p></article>)}
  </section>
  <section className="grid">
   <article className="card"><h2>Items by category</h2>{cats.length?cats.map(([label,total])=><p key={label}><strong>{label.replaceAll("_"," ")}</strong> · {total}</p>):<p className="muted">No recorded items</p>}</article>
   <article className="card"><h2>Repair barriers</h2>{barriers.length?barriers.map(([label,total])=><p key={label}><strong>{label.replaceAll("_"," ")}</strong> · {total}</p>):<p className="muted">No recorded barriers</p>}</article>
   <article className="card"><h2>Incident overview</h2>{(incidentResult.data??[]).length?<>{(incidentResult.data??[]).map((x,i)=><p key={i}>{x.severity.replaceAll("_"," ")} · {x.state}</p>)}</>:<p className="muted">No incidents recorded</p>}</article>
  </section>
  <section className="card"><h2>What the figures mean</h2>
   <p>Success rate uses only the attempts marked fixed, partially fixed, or not fixed. Referrals and not-attempted items are reported separately. A recorded item is not proof that it would otherwise have been thrown away.</p>
   <p>Weight is included only where a volunteer actually entered a measured weight and the recorded outcome was fixed or partially fixed. It is <strong>not</strong> a verified diversion or greenhouse-gas calculation. Missing weights are excluded instead of assumed zero-weight items.</p>
   <p>Attendance hours include only volunteers with both a check-in and check-out timestamp. Training completion, scheduled shifts and no-shows do not count as hours.</p>
   <p>Use these reports internally first. Check duplicate entries, unsafe outcomes, ticket closures and grant methodology before public environmental claims.</p>
  </section></>:null}
 </div>
}