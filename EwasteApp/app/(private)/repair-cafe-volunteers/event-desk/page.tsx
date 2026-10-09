import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {PrintButton} from "@/components/PrintButton";
import {checkInRepairItem,saveRepairTicket,addRepairStation,updateRepairStation,deleteRepairStation} from "./actions";
import styles from "./event-desk.module.css";

type Session={id:string;event_date:string;title:string;starts_at:string;ends_at:string;status:string;focus:string;venue_status:string};
type Station={id:string;event_id:string;name:string;category:string;location_note:string};
type Ticket={
 id:string;event_id:string;ticket_number:number;item_category:string;item_description:string;
 reported_problem:string;risk_level:string;risk_notes:string;status:string;outcome:string|null;
 barrier:string|null;station_id:string|null;work_summary:string;parts_used:string;
 handover_advice:string;arrived_at:string;started_at:string|null;closed_at:string|null;
};
type Activity={id:string;ticket_id:string;from_status:string|null;to_status:string;note:string;created_at:string};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const statuses=["waiting","in_progress","completed","referred","not_attempted","void"];
const categories=[
 ["electronics","Electronics"],["computers","Computers / laptops"],["small_appliance","Small appliances"],
 ["textiles","Clothing / sewing"],["bicycle","Bicycle"],["furniture","Furniture / wood"],
 ["household","Household items"],["other","Other portable item"]
] as const;
const stationTypes=[["general","General"],["electrical","Electrical (approved only)"],
 ["computers","Computers"],["sewing","Sewing"],["bikes","Bikes"],["mechanical","Mechanical"],
 ["woodwork","Woodwork"],["other","Other"]] as const;
const resultTypes=[
 ["","No outcome yet"],["fixed","Fixed"],["partially_fixed","Partially fixed"],
 ["not_fixed","Not fixed"],["referred","Referred elsewhere"],
 ["not_attempted","Not attempted"]
] as const;
const barrierTypes=[["","Not specified"],["parts","Parts unavailable"],["time","Time / capacity"],
 ["skills","Skills / tools"],["safety","Safety"],["cost","Cost"],
 ["not_repairable","Not repairable"],["other","Other"]] as const;
const pretty=(value:string|null|undefined)=>(value||"—").replaceAll("_"," ").replace(/^./,x=>x.toUpperCase());
const shortTime=(date:string)=>
 new Date(date).toLocaleTimeString("en-AU",{timeZone:"Australia/Sydney",hour:"numeric",minute:"2-digit"});
const day=(date:string)=>new Date(date+"T12:00:00Z").toLocaleDateString("en-AU",
 {timeZone:"Australia/Sydney",weekday:"short",day:"numeric",month:"short",year:"numeric"});

export default async function EventDesk({searchParams}:{
 searchParams:Promise<{event?:string;error?:string;success?:string}>
}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&context.selected!=="repair_cafe")redirect("/programmes?error=Select%20Repair%20Caf%C3%A9");
 const canManage=context.global_admin||["manager","admin"].includes(context.role??"");
 const params=await searchParams;
 const {data:sessionData,error:sessionError}=await supabase.from("repair_cafe_sessions")
  .select("id,event_date,title,starts_at,ends_at,status,focus,venue_status")
  .order("event_date",{ascending:true}).limit(100);
 const sessions=(sessionData??[]) as Session[];
 const requested=params.event&&uuid.test(params.event)?params.event:null;
 const session=sessions.find(s=>s.id===requested)??sessions.find(s=>!["completed","cancelled"].includes(s.status))??sessions[0]??null;
 const active=!!session&&!["completed","cancelled"].includes(session.status)&&
  (session.status==="published"||canManage);
 const [stationResult,ticketResult]=session?await Promise.all([
  supabase.from("repair_cafe_stations").select("id,event_id,name,category,location_note")
   .eq("event_id",session.id).order("name"),
  supabase.from("repair_cafe_tickets").select("id,event_id,ticket_number,item_category,item_description,reported_problem,risk_level,risk_notes,status,outcome,barrier,station_id,work_summary,parts_used,handover_advice,arrived_at,started_at,closed_at")
   .eq("event_id",session.id).order("ticket_number",{ascending:false}).limit(500)
 ]):[{data:[],error:null},{data:[],error:null}];
 const stations=(stationResult.data??[]) as Station[];
 const tickets=(ticketResult.data??[]) as Ticket[];
 const activityResult=tickets.length?await supabase.from("repair_cafe_ticket_activity")
  .select("id,ticket_id,from_status,to_status,note,created_at")
  .in("ticket_id",tickets.map(t=>t.id)).order("created_at",{ascending:false}).limit(1500)
  :{data:[],error:null};
 const activities=(activityResult.data??[]) as Activity[];
 const count=(type:string)=>tickets.filter(t=>t.status===type).length;
 const outcomes={fixed:tickets.filter(t=>t.outcome==="fixed").length,partial:tickets.filter(t=>t.outcome==="partially_fixed").length,
  unsuccessful:tickets.filter(t=>t.outcome==="not_fixed").length,referred:count("referred"),
  notAttempted:count("not_attempted")};
 const error=stationResult.error||ticketResult.error||activityResult.error||sessionError;
 return <div className={styles.page}>
  <div className={styles.navigation}>
   <Link href="/repair-cafe-volunteers">← Volunteer Hub</Link>
   <Link href="/repair-cafe-volunteers/sessions">Sessions & rosters</Link>
   <Link href="/learn?track=repair_cafe">Learning</Link>
  </div>
  <header className={styles.hero}>
   <div><div className={styles.eyebrow}>Private volunteer workspace · Community repairs</div>
    <h1>Repair Café Event Desk</h1>
    <p>Check in a visitor's item, keep the queue moving, record repair outcomes and hand over useful advice.</p></div>
   <div className={styles.headerActions}>
    {canManage&&session?<Link className="button secondary" href={"/repair-cafe-volunteers/event-desk/export?event="+session.id}>Export de-identified outcomes CSV</Link>:null}
    <PrintButton/>
   </div>
  </header>
  {params.error?<div className="error" role="alert">{params.error}</div>:null}
  {params.success?<div className="success" role="status">{params.success}</div>:null}
  {error?<div className="error" role="alert">Some event data could not load: {error.message}. Please do not rely on these counts.</div>:null}
  <section className={styles.sessionBox}>
   <div className={styles.sectionHeader}><h2>Choose your event</h2><span>{sessions.length} session records</span></div>
   {sessions.length===0?<p>No Repair Café sessions exist yet. <Link href="/repair-cafe-volunteers/sessions">Create a draft session</Link> first.</p>:null}
   <div className={styles.eventChooser}>{sessions.map(e=><Link key={e.id}
    className={e.id===session?.id?styles.eventSelected:styles.eventLink}
    href={"/repair-cafe-volunteers/event-desk?event="+e.id}>
    <strong>{day(e.event_date)}</strong><span>{pretty(e.status)}</span>
   </Link>)}</div>
   {session?<div className={styles.sessionSummary}>
     <div><h3>{session.title}</h3><p>{day(session.event_date)} · {session.starts_at.slice(0,5)}–{session.ends_at.slice(0,5)}</p>
      <p>{session.focus||"Repair focus not set"} · Venue {pretty(session.venue_status)}</p></div>
     <span className={session.status==="published"?styles.greenBadge:styles.amberBadge}>
      {session.status==="published"?"Published event":"Planning / "+pretty(session.status)}
     </span>
   </div>:null}
   {session?.status!=="published"&&session?<p className={styles.warning}>
     {canManage?"This is a planning event. Test entries here are internal and are not proof of a public Repair Café event. Only use real visitor intake after publishing and completing safety/venue checks.":"This session is not open for volunteer intake yet."}
   </p>:null}
  </section>
  {session?<><section className={styles.stats} aria-label="Event status totals">
   {[
    ["Checked in",tickets.filter(t=>t.status!=="void").length],
    ["Waiting",count("waiting")],["At stations",count("in_progress")],
    ["Fixed",outcomes.fixed],["Partial",outcomes.partial],
    ["Referred",outcomes.referred],["Not fixed",outcomes.unsuccessful],
    ["Not attempted",outcomes.notAttempted]
   ].map(([label,num])=><div className={styles.metric} key={label}><strong>{num}</strong><span>{label}</span></div>)}
  </section>
  <div className={styles.columns}>
   <section className={styles.panel}>
    <div className={styles.sectionHeader}><h2>1 · Visitor check-in</h2></div>
    <p className={styles.hint}>One item per ticket. Visitors keep ownership and stay with their belongings. Don't record names, passwords or personal documents here.</p>
    {active?<form action={checkInRepairItem} className={styles.form}>
     <input type="hidden" name="event_id" value={session.id}/>
     <label>Item category <select name="category" defaultValue="" required><option value="" disabled>Choose a category</option>
      {categories.map(([v,n])=><option key={v} value={v}>{n}</option>)}</select></label>
     <label>What item is it? <input name="item" minLength={2} maxLength={160} required placeholder="e.g. toaster, jacket, bike"/></label>
     <label>What is wrong? <textarea name="fault" minLength={3} maxLength={700} required rows={2} placeholder="Visitor's description of the problem"/></label>
     <label>Safety screening <select name="risk" defaultValue="" required>
      <option value="" disabled>Choose the assessment</option>
      <option value="clear">No obvious hazard in the permitted scope</option>
      <option value="review">Requires coordinator review (not yet cleared)</option>
      <option value="unsafe">Unsafe / decline attempt</option>
     </select></label>
     <label>Safety concerns or screening notes <textarea name="risk_notes" rows={2} maxLength={500} placeholder="Mandatory if review/unsafe; no passwords or sensitive data"/></label>
     <label className={styles.checkbox}><input type="checkbox" name="screened" value="yes" required/>
      <span>I screened the item and checked permitted repair scope.</span></label>
     <label className={styles.checkbox}><input type="checkbox" name="acknowledged" value="yes" required/>
      <span>The visitor understands this is volunteer help, repair is not guaranteed, and the item remains theirs. Their acknowledgement was obtained.</span></label>
     <button className="button">Create queue ticket</button>
    </form>:<p className={styles.warning}>Intake is unavailable for this session. Publish it first, or ask a coordinator to run a planning rehearsal.</p>}
   </section>
   <section className={styles.panel}>
    <div className={styles.sectionHeader}><h2>2 · Repair stations</h2><span>{stations.length} total</span></div>
    <p className={styles.hint}>A cleared item needs a station before work begins. An electrical category label does not authorise mains work.</p>
    {stations.length===0?<p>No stations set up yet.</p>:<div className={styles.stationList}>
     {stations.map(st=><details className={styles.station} key={st.id}>
      <summary><strong>{st.name}</strong><small>{pretty(st.category)} · {tickets.filter(t=>t.station_id===st.id&&t.status==="in_progress").length} active</small></summary>
      <p className={styles.hint}>{st.location_note||"Location not noted"}</p>
      {canManage?<><form action={updateRepairStation} className={styles.form}>
       <input type="hidden" name="event_id" value={session.id}/><input type="hidden" name="station_id" value={st.id}/>
       <label>Name <input name="name" defaultValue={st.name} maxLength={80} minLength={2} required/></label>
       <label>Area <select name="category" defaultValue={st.category}>{stationTypes.map(([v,n])=><option key={v} value={v}>{n}</option>)}</select></label>
       <label>Location note <input name="location_note" defaultValue={st.location_note} maxLength={240}/></label>
       <button className="button secondary">Save station</button>
      </form>
      <form action={deleteRepairStation} className={styles.deleteForm}>
       <input type="hidden" name="event_id" value={session.id}/><input type="hidden" name="station_id" value={st.id}/>
       <label>Type DELETE (unused stations only) <input name="confirm" required placeholder="DELETE"/></label>
       <button className="button danger">Delete station</button>
      </form></>:null}
     </details>)}
    </div>}
    {canManage&&active?<details className={styles.addStation}><summary>+ Add repair station</summary>
     <form action={addRepairStation} className={styles.form}>
      <input type="hidden" name="event_id" value={session.id}/>
      <label>Station name <input name="name" required minLength={2} maxLength={80} placeholder="e.g. Sewing table"/></label>
      <label>Category <select name="category" defaultValue="general">{stationTypes.map(([v,n])=><option key={v} value={v}>{n}</option>)}</select></label>
      <label>Where is it? <input name="location_note" maxLength={240} placeholder="Main hall, left wall"/></label>
      <button className="button">Add station</button>
     </form>
    </details>:null}
   </section>
  </div>
  <section className={styles.queue}>
   <div className={styles.sectionHeader}><div><h2>3 · Live queue and repair outcomes</h2><p className={styles.hint}>Tap a ticket to allocate a station, record work and close it. Refresh to see another volunteer's updates.</p></div>
   <strong>{tickets.length} ticket records</strong></div>
   {tickets.length===0?<div className={styles.empty}>No repairs recorded for this session. Start with check-in.</div>:null}
   <div className={styles.ticketGrid}>
    {tickets.map(t=><article className={styles.ticket} key={t.id}>
     <div className={styles.ticketHeader}><span className={styles.queueNumber}>#{t.ticket_number}</span>
      <span className={styles.state}>{pretty(t.status)}</span></div>
     <h3>{t.item_description}</h3>
     <p className={styles.problem}>{t.reported_problem}</p>
     <div className={styles.ticketMeta}>
      <span>{pretty(t.item_category)}</span><span>Arrived {shortTime(t.arrived_at)}</span>
      <span>Station: {stations.find(st=>st.id===t.station_id)?.name||"Unassigned"}</span>
      {t.risk_level!=="clear"?<span className={styles.risk}>{pretty(t.risk_level)} safety flag</span>:null}
     </div>
     {t.outcome?<p className={styles.outcome}><strong>Outcome:</strong> {pretty(t.outcome)}{t.barrier?" · "+pretty(t.barrier):""}</p>:null}
     {t.handover_advice?<p className={styles.hint}><strong>Handover:</strong> {t.handover_advice}</p>:null}
     <details className={styles.ticketDetails}>
      <summary>{active?"Update ticket / record repair":"Review ticket and history"}</summary>
      {active?<form action={saveRepairTicket} className={styles.form}>
       <input type="hidden" name="event_id" value={session.id}/>
       <input type="hidden" name="ticket_id" value={t.id}/>
       <label>Status <select name="status" defaultValue={t.status} required>
        {statuses.filter(st=>canManage||st!=="void").map(st=><option value={st} key={st}>{pretty(st)}</option>)}
       </select></label>
       <label>Repair station <select name="station_id" defaultValue={t.station_id||""}>
        <option value="">Not assigned</option>
        {stations.map(st=><option key={st.id} value={st.id}>{st.name}</option>)}
       </select></label>
       <label>Outcome (required for completed / referred / not attempted) <select name="outcome" defaultValue={t.outcome||""}>
        {resultTypes.map(([v,n])=><option key={v} value={v}>{n}</option>)}
       </select></label>
       <label>Reason repair could not be completed <select name="barrier" defaultValue={t.barrier||""}>
        {barrierTypes.map(([v,n])=><option key={v} value={v}>{n}</option>)}
       </select></label>
       <label>Repair note / summary <textarea name="note" maxLength={1200} rows={3} placeholder="What did you check, try or observe?"/></label>
       <label>Parts or materials used <input name="parts" maxLength={300} defaultValue={t.parts_used}/></label>
       <label>Advice to visitor <textarea name="advice" maxLength={700} defaultValue={t.handover_advice} rows={2}/></label>
       {canManage?<><label>Safety state <select name="risk" defaultValue={t.risk_level}>
        <option value="clear">Cleared within scope</option><option value="review">Review required</option><option value="unsafe">Unsafe</option>
       </select></label>
        <label>Safety notes <textarea name="risk_notes" maxLength={500} defaultValue={t.risk_notes} rows={2}/></label></>
       :<><input type="hidden" name="risk" value={t.risk_level}/><input type="hidden" name="risk_notes" value={t.risk_notes}/></>}
       <p className={styles.hint}>To start: choose In progress and a station. To close: choose Completed and an outcome. Unsafe items cannot be repaired. Changes are logged.</p>
       <button className="button">Save repair update</button>
      </form>:null}
      {activities.filter(a=>a.ticket_id===t.id).length?<div className={styles.history}>
       <h4>Change history</h4>
       {activities.filter(a=>a.ticket_id===t.id).map(a=><div key={a.id}>
        <span>{shortTime(a.created_at)} · {pretty(a.to_status)}</span>
        {a.note?<p>{a.note}</p>:null}</div>)}
      </div>:null}
     </details>
    </article>)}
   </div>
  </section>
  <section className={styles.panel}>
   <div className={styles.sectionHeader}><h2>4 · End-of-session report</h2></div>
   <div className={styles.reportGrid}>
    <p><strong>{outcomes.fixed}</strong><span>Successfully fixed</span></p>
    <p><strong>{outcomes.partial}</strong><span>Partially fixed</span></p>
    <p><strong>{outcomes.unsuccessful}</strong><span>Not fixed</span></p>
    <p><strong>{outcomes.referred}</strong><span>Referred</span></p>
    <p><strong>{outcomes.notAttempted}</strong><span>Not attempted</span></p>
   </div>
   <p className={styles.hint}>These are observed ticket outcomes, not estimates of kilograms saved or CO₂ avoided. Duplicate/void tickets are excluded from the checked-in count. Figures are internal until reviewed.</p>
   <div className={styles.printSection}>
    <h3>Offline paper fallback</h3>
    <p className={styles.hint}>If internet fails, note the queue number, item and repair steps on paper; enter records later. Keep completed sheets secure and follow the agreed retention policy.</p>
    <div className={styles.paperForm}>
     <p>Event: {day(session.event_date)} · Ticket #: __________</p>
     <p>Item/category: ___________________________________</p>
     <p>Reported problem: ________________________________</p>
     <p>Visitor acknowledgement: □ &nbsp; Safety screened: □ &nbsp; Risk / refusal: __________________</p>
     <p>Station / repair steps: ____________________________</p>
     <p>Outcome: □ Fixed &nbsp; □ Partial &nbsp; □ Not fixed &nbsp; □ Referred &nbsp; □ Not attempted</p>
     <p>Advice / handover: ________________________________</p>
    </div>
   </div>
  </section>
  </>:null}
  <footer className={styles.footer}>Community Repair Café visits are not E-waste donations or commercial work orders. Please keep passwords and visitor personal data out of repair notes. Formal incident reporting, automated notifications and offline synchronisation still need dedicated development.</footer>
 </div>;
}
