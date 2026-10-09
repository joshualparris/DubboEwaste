import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {courses} from "@/lib/learning/catalog";
import {
 addVenueHistory,removeVenueHistory,recordCompetency,removeCompetency,recordAttendance,
 createIncident,amendIncident,saveTicketWeight,uploadTicketPhoto,removeTicketPhoto,
 saveNoticePreferences,saveManualNoticePreferences,queueVolunteerNotice,
 restoreArchivedEvent,archiveActiveEvent,restoreArchivedVolunteer,restoreArchivedVenue
} from "./actions";
import styles from "./operations.module.css";
type Event={id:string;event_date:string;title:string;status:string;venue_id:string|null;venue_status:string;deleted_at:string|null};
type Person={user_id:string;display_name:string;skills:string[]};
type Manual={id:string;full_name:string;notify_email:boolean;notify_sms:boolean};
type Ticket={id:string;ticket_number:number;item_description:string;outcome:string|null;status:string;measured_weight_kg:number|null;owner_kept_item:boolean};
const dateText=(d:string)=>new Date(d+"T12:00:00Z").toLocaleDateString("en-AU",{timeZone:"Australia/Sydney",weekday:"short",day:"numeric",month:"short",year:"numeric"});
const timeText=(d:string)=>new Date(d).toLocaleString("en-AU",{timeZone:"Australia/Sydney",dateStyle:"medium",timeStyle:"short"});
function short(s:string|null|undefined){return s||"—"}
export default async function OperationsPage({searchParams}:{searchParams:Promise<{event?:string;error?:string;success?:string}>}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))
  redirect("/repair-cafe-volunteers/sessions?error=Coordinator%20access%20required");
 const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const params=await searchParams;
 const [{data:eventsData,error:eventError},{data:manualData},{data:profiles,error:rosterError},
  {data:venues},{data:prefs}]=await Promise.all([
  supabase.from("repair_cafe_sessions").select("id,event_date,title,status,venue_id,venue_status,deleted_at").order("event_date",{ascending:false}).limit(100),
  supabase.from("repair_cafe_manual_volunteers").select("id,full_name,notify_email,notify_sms").is("deleted_at",null).order("full_name"),
  supabase.rpc("repair_cafe_roster_directory"),
  supabase.from("repair_cafe_venues").select("id,name").is("deleted_at",null).order("name"),
  supabase.from("repair_cafe_notification_preferences").select("email,phone,email_opt_in,sms_opt_in").eq("user_id",user.id).maybeSingle()
 ]);
 const events=(eventsData??[]) as Event[],members=(profiles??[]) as Person[],manual=(manualData??[]) as Manual[];
 const [{data:archivedVolunteers},{data:archivedVenues}]=await Promise.all([
  supabase.from("repair_cafe_manual_volunteers").select("id,full_name").not("deleted_at","is",null).order("full_name").limit(100),
  supabase.from("repair_cafe_venues").select("id,name").not("deleted_at","is",null).order("name").limit(100)
 ]);
 const e=events.find(s=>s.id===params.event&&!s.deleted_at)??events.find(s=>!s.deleted_at)??null;
 const event=e?.id??"";
 const personName=(user_id:string|null,manual_id:string|null)=>manual_id?manual.find(v=>v.id===manual_id)?.full_name??"Manual volunteer":members.find(v=>v.user_id===user_id)?.display_name??"Member";
 const [contacts,skills,attendance,incidents,tickets,photos,audit,notifications]=e?await Promise.all([
  supabase.from("repair_cafe_venue_contacts").select("*").eq("event_id",event).order("contacted_at",{ascending:false}).limit(100),
  supabase.from("repair_cafe_competencies").select("*").order("verified_at",{ascending:false}).limit(150),
  supabase.from("repair_cafe_attendance").select("*").eq("event_id",event).limit(200),
  supabase.from("repair_cafe_incidents").select("*").eq("event_id",event).order("recorded_at",{ascending:false}).limit(100),
  supabase.from("repair_cafe_tickets").select("id,ticket_number,item_description,outcome,status,measured_weight_kg,owner_kept_item").eq("event_id",event).order("ticket_number").limit(250),
  supabase.from("repair_cafe_visit_photos").select("id,ticket_id,object_path,note,uploaded_at").limit(150),
  supabase.from("repair_cafe_audit").select("id,entity,entity_id,operation,changed_fields,occurred_at").order("occurred_at",{ascending:false}).limit(100),
  supabase.from("repair_cafe_notifications").select("id,channel,kind,state,scheduled_for,sent_at,last_error").eq("event_id",event).order("created_at",{ascending:false}).limit(75)
 ]):Array.from({length:8},()=>({data:[],error:null}));
 const ticketRows=(tickets.data??[]) as Ticket[];
 const imageRows=(photos.data??[]).filter(p=>ticketRows.some(t=>t.id===p.ticket_id)).slice(0,30);
 const signed=await Promise.all(imageRows.map(async p=>{
  const {data}=await supabase.storage.from("repair-cafe-private").createSignedUrl(p.object_path,60*10);
  return {...p,url:data?.signedUrl??null};
 }));
 const errors=[eventError,rosterError,contacts.error,skills.error,attendance.error,incidents.error,tickets.error,photos.error,audit.error,notifications.error].filter(Boolean);
 const verified=(skills.data??[]).filter(k=>k.verification==="verified"&&(!k.expires_on||k.expires_on>=new Date().toISOString().slice(0,10)));
 const totalHours=(attendance.data??[]).reduce((sum,a)=>{
  if(!a.check_in_at||!a.check_out_at)return sum;
  return sum+Math.max(0,(new Date(a.check_out_at).getTime()-new Date(a.check_in_at).getTime())/3600000)
 },0);
 const rcCourses=courses.filter(c=>c.programme==="repair_cafe"||c.programme==="all");
 return <div className={styles.page}>
  <nav className={styles.links}><Link href="/repair-cafe-volunteers">Volunteer Hub</Link><Link href="/repair-cafe-volunteers/sessions">Sessions & rosters</Link><Link href="/repair-cafe-volunteers/event-desk">Event Desk</Link><Link href="/repair-cafe-volunteers/reports">Reports & exports</Link></nav>
  <header className={styles.hero}><div><span className={styles.eyebrow}>Repair Café · Coordinator workspace</span>
   <h1>Operations & safety</h1><p>Venue bookings, verified training, check-in hours, incident follow-up, repair photos, opt-in communications and recoverable session records.</p></div></header>
  {params.error?<div role="alert" className={styles.error}>{params.error}</div>:null}
  {params.success?<div role="status" className={styles.success}>{params.success}</div>:null}
  {errors.length?<div role="alert" className={styles.error}>Some data could not load: {errors.map(x=>x?.message).join("; ")}</div>:null}
  <section className={styles.panel}><div className={styles.heading}><h2>Select an event</h2><span>{events.filter(v=>!v.deleted_at).length} active drafts/events</span></div>
   <div className={styles.eventLinks}>{events.filter(v=>!v.deleted_at).map(s=>
    <Link key={s.id} href={"?event="+s.id} className={s.id===event?styles.chosen:styles.unchosen}>{dateText(s.event_date)} <small>{s.status}</small></Link>)}</div>
   {!events.some(x=>!x.deleted_at)?<p>Create an event in the <Link href="/repair-cafe-volunteers/sessions">session planner</Link> first.</p>:null}
  </section>
  {e?<><div className={styles.stats}>
   <div><strong>{(attendance.data??[]).filter(x=>x.check_in_at).length}</strong><span>Volunteers checked in</span></div>
   <div><strong>{totalHours.toFixed(1)}</strong><span>Verified completed hours</span></div>
   <div><strong>{verified.length}</strong><span>Current verified competency records</span></div>
   <div><strong>{ticketRows.length}</strong><span>Item tickets</span></div>
  </div>
  <section className={styles.panel}><h2>1 · Venue bookings and correspondence</h2>
   <p className={styles.hint}>Document actual contact with the venue host. The booking stage in Sessions & rosters must still be explicitly confirmed, with written host permission.</p>
   <form action={addVenueHistory} className={styles.form}><input type="hidden" name="event_id" value={event}/>
    <div className={styles.cols}><label>Venue<select name="venue_id" required defaultValue={e.venue_id??""}><option value="">Choose venue</option>{(venues??[]).map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></label>
     <label>Contact method<select name="method" defaultValue="email"><option value="email">Email</option><option value="phone">Phone</option><option value="in_person">In person</option><option value="other">Other</option></select></label>
     <label>Outcome<select name="result" defaultValue="enquiry">{["enquiry","offered","hold","confirmed","declined","cancelled","follow_up"].map(v=><option value={v} key={v}>{v}</option>)}</select></label>
    </div>
    <label>Host / contact person<input name="contact_name" maxLength={120}/></label>
    <label>Meeting / email summary<textarea name="note" rows={2} maxLength={1500}/></label>
    <label>Evidence reference (e.g. document ID or correspondence date)<input name="evidence_reference" maxLength={500}/></label>
    <button className="button">Record contact</button>
   </form>
   <div className={styles.entries}>{(contacts.data??[]).map(c=><div key={c.id} className={styles.entry}><strong>{c.result} · {c.method} · {timeText(c.contacted_at)}</strong><span>{short(c.contact_name)} · {short(c.evidence_reference)}</span><p>{c.note}</p>
    <form action={removeVenueHistory} className={styles.inline}><input type="hidden" name="event_id" value={event}/><input type="hidden" name="entry_id" value={c.id}/><input name="confirm" aria-label="Type DELETE to remove correspondence" placeholder="DELETE" required/><button className="button secondary">Remove entry</button></form>
   </div>)}</div>
  </section>
  <section className={styles.panel}><h2>2 · Verified volunteer competencies</h2>
   <p className={styles.hint}>This verification is separate from simply completing an online course. Only mark Verified after suitable practical assessment. Do not treat a course as an electrical trade licence.</p>
   <form action={recordCompetency} className={styles.form}><input type="hidden" name="event_id" value={event}/>
    <div className={styles.cols}><label>Volunteer type<select name="kind"><option value="account">Member with login</option><option value="manual">Manually added</option></select></label>
     <label>Volunteer (select matching type)<select name="person_id" required defaultValue=""><option value="">Choose person</option><optgroup label="Members">{members.map(p=><option key={p.user_id} value={p.user_id}>{p.display_name}</option>)}</optgroup><optgroup label="Manually added">{manual.map(p=><option key={p.id} value={p.id}>{p.full_name}</option>)}</optgroup></select></label>
     <label>Course / competency<select name="course_slug">{rcCourses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
    </div>
    <div className={styles.cols}><label>Review result<select name="verification"><option value="training">Training needed</option><option value="supervised">Supervised practice</option><option value="verified">Verified by coordinator</option><option value="expired">Expired</option></select></label>
     <label>Expires (if needed)<input name="expires_on" type="date"/></label>
    </div><label>Evidence of practical assessment<input name="evidence_note" maxLength={500} placeholder="Observed during supervised station setup"/></label>
    <button className="button">Save competency</button>
   </form>
   <div className={styles.entries}>{(skills.data??[]).map(c=><div key={c.id} className={styles.entry}><strong>{personName(c.user_id,c.manual_volunteer_id)} · {c.course_slug} · {c.verification}</strong><span>{short(c.evidence_note)} {c.expires_on?" · Expires "+c.expires_on:""}</span>
    <form action={removeCompetency}><input type="hidden" name="event_id" value={event}/><input type="hidden" name="competency_id" value={c.id}/><button className="button secondary">Remove record</button></form></div>)}</div>
  </section>
  <section className={styles.panel}><h2>3 · Volunteer attendance and real hours</h2>
   <p className={styles.hint}>Only completed check-in/check-out pairs count towards reported volunteer hours. Absence or scheduled availability does not count.</p>
   <div className={styles.entries}>
    {[...members.map(p=>({id:p.user_id,kind:"account",name:p.display_name})),...manual.map(p=>({id:p.id,kind:"manual",name:p.full_name}))].map(p=>{
      const a=(attendance.data??[]).find(x=>p.kind==="account"?x.user_id===p.id:x.manual_volunteer_id===p.id);
      return <form action={recordAttendance} key={p.kind+p.id} className={styles.attendance}>
       <input type="hidden" name="event_id" value={event}/><input type="hidden" name="person_id" value={p.id}/><input type="hidden" name="kind" value={p.kind}/>
       <div><strong>{p.name}</strong><small>{a?.check_in_at?"Arrived "+timeText(a.check_in_at):"Not checked in"}{a?.check_out_at?" · Left "+timeText(a.check_out_at):""}</small></div>
       <select name="mode" aria-label={"Attendance action for "+p.name}><option value="in">Check in</option><option value="out">Check out</option><option value="reset">Reset</option></select><button className="button secondary">Record</button>
      </form>
    })}
   </div>
  </section>
  <section className={styles.panel}><h2>4 · Safety incident log</h2>
   <p className={styles.hint}>For immediate danger, follow the real-life emergency procedure first. Avoid unnecessary names or medical details. Only coordinators can view these records.</p>
   <form action={createIncident} className={styles.form}><input type="hidden" name="event_id" value={event}/>
    <div className={styles.cols}><label>Severity<select name="severity"><option value="near_miss">Near miss</option><option value="minor">Minor</option><option value="major">Major</option></select></label>
     <label>Optional ticket<select name="ticket_id"><option value="">General event issue</option>{ticketRows.map(t=><option key={t.id} value={t.id}>#{t.ticket_number} {t.item_description}</option>)}</select></label></div>
    <label>What happened<textarea name="details" minLength={3} maxLength={3000} required rows={2}/></label>
    <label>Immediate action<textarea name="immediate_action" rows={2} maxLength={3000}/></label>
    <label>Further follow-up<textarea name="follow_up" rows={2} maxLength={2000}/></label>
    <button className="button">Record incident</button>
   </form>
   <div className={styles.entries}>{(incidents.data??[]).map(x=><details key={x.id} className={styles.entry}><summary>{x.severity} · {x.state} · {timeText(x.recorded_at)}</summary>
    <p>{x.details}</p><form action={amendIncident} className={styles.form}>
     <input type="hidden" name="event_id" value={event}/><input type="hidden" name="incident_id" value={x.id}/>
     <label>State<select name="state" defaultValue={x.state}><option value="open">Open</option><option value="reviewing">Reviewing</option><option value="closed">Closed</option></select></label>
     <label>Immediate action<textarea name="immediate_action" defaultValue={x.immediate_action} maxLength={3000}/></label>
     <label>Follow-up<textarea name="follow_up" defaultValue={x.follow_up} maxLength={2000}/></label>
     <button className="button secondary">Save incident update</button></form></details>)}</div>
  </section>
  <section className={styles.panel}><h2>5 · Repair photos and measured impact evidence</h2>
   <p className={styles.hint}>Photos are private and temporary signed links. Ask the visitor before taking a photo. Record a weight only if actually measured, not inferred. Repairs are recorded in the main <Link href={"/repair-cafe-volunteers/event-desk?event="+event}>Event Desk</Link>.</p>
   {ticketRows.map(t=><details key={t.id} className={styles.entry}>
    <summary>#{t.ticket_number} · {t.item_description} · {t.status}</summary>
    <form action={saveTicketWeight} className={styles.form}>
     <input type="hidden" name="event_id" value={event}/><input type="hidden" name="ticket_id" value={t.id}/>
     <label>Measured weight, kg (optional)<input type="number" step=".001" min="0" max="10000" name="weight" defaultValue={t.measured_weight_kg??""} placeholder="Leave blank if not measured"/></label>
     <label className={styles.check}><input type="checkbox" name="owner_kept_item" value="yes" defaultChecked={t.owner_kept_item}/> The visitor kept ownership of their item</label>
     <button className="button secondary">Save measured evidence</button>
    </form>
    <form action={uploadTicketPhoto} className={styles.form}>
     <input type="hidden" name="event_id" value={event}/><input type="hidden" name="ticket_id" value={t.id}/>
     <label>Private repair photo (5 MB maximum)<input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required/></label>
     <label className={styles.check}><input type="checkbox" name="photo_consent" value="yes" required/> Visitor separately consented to a private item photograph. Do not photograph people, passwords or identifiable documents.</label>
     <label>Photo description<input name="note" maxLength={200}/></label>
     <label className={styles.checkbox}><input type="checkbox" name="photo_permission" value="yes" required/> The item owner explicitly agreed to this photo being kept privately for repair documentation.</label>
     <button className="button secondary">Upload private photo</button>
    </form>
    <div className={styles.photos}>{signed.filter(p=>p.ticket_id===t.id).map(p=><figure key={p.id}>
     {p.url?<a href={p.url} target="_blank" rel="noreferrer"><img src={p.url} alt={p.note||"Private repair evidence"} width={160} height={110}/></a>:<span>Photo unavailable</span>}
     <figcaption>{p.note||"Repair photo"}</figcaption>
     <form action={removeTicketPhoto}><input type="hidden" name="event_id" value={event}/><input type="hidden" name="photo_id" value={p.id}/><button className="button secondary">Delete photo</button></form>
    </figure>)}</div>
   </details>)}
  </section>
  <section className={styles.panel}><h2>6 · Volunteer messages and preferences</h2>
   <p className={styles.hint}>Messages are strictly opt-in. Queueing is not sending. Delivery only works after an email/SMS provider, sender and authorised dispatch schedule are configured.</p>
   <form action={saveNoticePreferences} className={styles.form}>
    <div className={styles.cols}><label>My reminder email<input type="email" name="email" maxLength={254} defaultValue={prefs?.email??""}/></label>
     <label>My reminder phone<input type="tel" name="phone" maxLength={40} defaultValue={prefs?.phone??""}/></label></div>
    <label className={styles.check}><input type="checkbox" name="email_opt_in" value="yes" defaultChecked={prefs?.email_opt_in??false}/> I agree to Repair Café email reminders</label>
    <label className={styles.check}><input type="checkbox" name="sms_opt_in" value="yes" defaultChecked={prefs?.sms_opt_in??false}/> I agree to SMS reminders</label>
    <button className="button secondary">Save my preferences</button>
   </form>
   <h3>Manual volunteer opt-in</h3><div className={styles.entries}>{manual.map(p=><form key={p.id} action={saveManualNoticePreferences} className={styles.attendance}>
    <input type="hidden" name="event_id" value={event}/><input type="hidden" name="manual_volunteer_id" value={p.id}/>
    <strong>{p.full_name}</strong><label className={styles.check}><input type="checkbox" name="notify_email" value="yes" defaultChecked={p.notify_email}/> Email</label>
    <label className={styles.check}><input type="checkbox" name="notify_sms" value="yes" defaultChecked={p.notify_sms}/> SMS</label>
    <button className="button secondary">Save</button></form>)}</div>
   <h3>Compose a message to this event's opted-in volunteers</h3>
   <form action={queueVolunteerNotice} className={styles.form}><input type="hidden" name="event_id" value={event}/>
    <label>Message type<select name="kind"><option value="manual">General update</option><option value="change">Time or venue change</option><option value="cancellation">Cancellation</option></select></label>
    <label>Subject<input name="subject" maxLength={200} required defaultValue={"Repair Café Dubbo · "+dateText(e.event_date)}/></label>
    <label>Message<textarea name="message" maxLength={2000} required rows={4}/></label>
    <button className="button secondary">Queue opted-in notifications</button>
   </form>
   <h3>Delivery status</h3><div className={styles.entries}>{(notifications.data??[]).map(n=><p key={n.id}>{n.kind} · {n.channel} · <strong>{n.state}</strong>{n.sent_at?" · sent "+timeText(n.sent_at):""}{n.last_error?" · error "+n.last_error:""}</p>)}</div>
  </section>
  <section className={styles.panel}><h2>7 · Change history and restore</h2>
   <p className={styles.hint}>Audit records contain changed field names, not visitor details or contact information. Archived sessions can be restored, rather than permanently erased.</p>
   <div className={styles.entries}>{(audit.data??[]).map(a=><p key={a.id}>{timeText(a.occurred_at)} · <strong>{a.entity}</strong> · {a.operation} · {(a.changed_fields||[]).join(", ")}</p>)}</div>
   {e.status!=="published"?<form action={archiveActiveEvent} className={styles.inline}>
    <input type="hidden" name="event_id" value={event}/><label>Type ARCHIVE to hide session<input name="confirm" placeholder="ARCHIVE" required/></label>
    <button className="button secondary">Archive this session</button>
   </form>:<p className={styles.hint}>Unpublish the session before archiving it.</p>}

  </section></>:null}
  <section className={styles.panel}><h2>Recover archived records</h2>
   <p className={styles.hint}>Restoring an event always leaves it a draft. Restoring a venue or volunteer does not re-confirm bookings or previously withdrawn shifts.</p>
   <div className={styles.cols}>
    <div><h3>Sessions</h3>{events.filter(x=>x.deleted_at).length===0?<p className={styles.hint}>None archived</p>:null}
     {events.filter(x=>x.deleted_at).map(x=><form action={restoreArchivedEvent} key={x.id} className={styles.attendance}>
      <span>{dateText(x.event_date)} · {x.title}</span><input type="hidden" name="event_id" value={x.id}/>
      <button className="button secondary">Restore draft</button></form>)}</div>
    <div><h3>Volunteers</h3>{(archivedVolunteers??[]).length===0?<p className={styles.hint}>None archived</p>:null}
     {(archivedVolunteers??[]).map(x=><form action={restoreArchivedVolunteer} key={x.id} className={styles.attendance}>
      <span>{x.full_name}</span><input type="hidden" name="manual_volunteer_id" value={x.id}/>
      <button className="button secondary">Restore person</button></form>)}</div>
    <div><h3>Venues</h3>{(archivedVenues??[]).length===0?<p className={styles.hint}>None archived</p>:null}
     {(archivedVenues??[]).map(x=><form action={restoreArchivedVenue} key={x.id} className={styles.attendance}>
      <span>{x.name}</span><input type="hidden" name="venue_id" value={x.id}/>
      <button className="button secondary">Restore venue</button></form>)}</div>
   </div>
  </section>
  <footer className={styles.hint}>This volunteer workspace is not a medical or electrical compliance certification. Confirm insurance, child safety, permitted repairs and real-world incident escalation locally before the first public event.</footer>
 </div>;
}