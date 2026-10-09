import Link from "next/link";
import { requireProgrammeContext } from "@/lib/programme-context";
import {
 createVenue,updateVenue,createSession,createMonthlyDrafts,updateSession,setVenueForSession,
 setSessionStatus,setSafetyChecked,saveSkills,setAvailability,createSlot,offerShift,respondShift,removeShiftOffer
} from "./actions";
import {
 createManualVolunteer,assignManualShift,setManualAvailability,
 setAccountAvailability,deleteAvailability,changeAssignmentStatus,
 updateSlot,deleteSlot,deleteSession,deleteVenue,substituteVolunteer
} from "./manage-actions";
import styles from "./sessions.module.css";

type Event={id:string;event_date:string;starts_at:string;ends_at:string;title:string;focus:string;status:string;venue_id:string|null;venue_status:string;safety_checked:boolean};
type Venue={id:string;name:string;address:string;accessibility:string;permitted_activities:string};
type Available={event_id:string;user_id:string;response:string;note:string};
type Slot={id:string;event_id:string;role_name:string;required_count:number;notes:string;starts_at:string;ends_at:string};
type Assignment={id:string;slot_id:string;user_id:string|null;manual_volunteer_id:string|null;status:string};
type Manual={id:string;full_name:string;skills:string[]};
type ManualAvailability={event_id:string;manual_volunteer_id:string;response:string;note:string};
type Person={user_id:string;display_name:string;skills:string[]};
const friendlyDate=(date:string)=>new Date(date+"T12:00:00Z").toLocaleDateString("en-AU",{timeZone:"Australia/Sydney",weekday:"short",day:"numeric",month:"short",year:"numeric"});
const friendlyStatus=(v:string)=>v.replaceAll("_"," ").replace(/^./,m=>m.toUpperCase());
const roleSuggestions=["Welcome / hospitality","Intake / triage","Sewing & textiles","Computers & laptops","Bicycles & mechanical","Safety / first aid","Setup / pack-down","Event coordinator"];
export default async function RepairCafeSessions({searchParams}:{searchParams:Promise<{error?:string;success?:string}>}) {
 const {supabase,context}=await requireProgrammeContext();
 const canManage=context.global_admin||context.selected==="repair_cafe"&&["admin","manager"].includes(context.role||"");
 const {data:{user}}=await supabase.auth.getUser();
 const [{data:eventData,error:eventsError},{data:venueData,error:venueError},
        {data:availData,error:availError},{data:slotData,error:slotError},
        {data:assignData,error:assignError},{data:profileData}]=await Promise.all([
  supabase.from("repair_cafe_sessions").select("id,event_date,starts_at,ends_at,title,focus,status,venue_id,venue_status,safety_checked").is("deleted_at",null).order("event_date",{ascending:true}).limit(48),
  supabase.from("repair_cafe_venues").select("id,name,address,accessibility,permitted_activities").is("deleted_at",null).order("name"),
  supabase.from("repair_cafe_availability").select("event_id,user_id,response,note").limit(1000),
  supabase.from("repair_cafe_shift_slots").select("id,event_id,role_name,required_count,notes,starts_at,ends_at").limit(500),
  supabase.from("repair_cafe_shift_assignments").select("id,slot_id,user_id,status").limit(1000),
  supabase.from("repair_cafe_volunteer_profiles").select("skills,preference").eq("user_id",user?.id??"00000000-0000-0000-0000-000000000000").maybeSingle()
 ]);
 const directoryResult=canManage?await supabase.rpc("repair_cafe_roster_directory"):null;
 const [manualPeopleResult,manualAvailResult]=canManage?await Promise.all([
  supabase.from("repair_cafe_manual_volunteers").select("id,full_name,skills").is("deleted_at",null).order("full_name"),
  supabase.from("repair_cafe_manual_availability").select("event_id,manual_volunteer_id,response,note").limit(1000)
 ]):[{data:[],error:null},{data:[],error:null}];
 const errors=[eventsError,venueError,availError,slotError,assignError,directoryResult?.error,
  manualPeopleResult.error,manualAvailResult.error].filter(Boolean);
 const events=(eventData??[]) as Event[],venues=(venueData??[]) as Venue[],availability=(availData??[]) as Available[],slots=(slotData??[]) as Slot[],assignments=(assignData??[]) as Assignment[];
 const people=((directoryResult?.data??[]) as Person[]).sort((a,b)=>a.display_name.localeCompare(b.display_name));
 const manualPeople=(manualPeopleResult.data??[]) as Manual[];
 const manualAvailability=(manualAvailResult.data??[]) as ManualAvailability[];
 const nameOf=(id:string,manualId:string="")=>manualId
  ?manualPeople.find(p=>p.id===manualId)?.full_name??"Manual volunteer"
  :people.find(p=>p.user_id===id)?.display_name??"Volunteer";
 const {error,success}=await searchParams;
 return <div className={styles.page}>
  <nav className={styles.breadcrumb}><Link href="/repair-cafe-volunteers">Volunteer Hub</Link><span>›</span>Sessions & rosters</nav>
  <header className={styles.hero}>
   <div><div className="badge">Repair Café · private workspace</div><h1>Monthly sessions</h1>
   <p>Choose when you can help. Coordinators arrange volunteers and venues before announcing each event.</p></div>
   <Link className="button secondary" href="/learn">Volunteer learning ↗</Link>
  </header>
  {error?<div className="error" role="alert">{error}</div>:null}
  {success?<div className="success" role="status">{success}</div>:null}
  {errors.length?<div className="error" role="alert">Some roster records could not load. {errors.map(e=>e?.message).join("; ")}. No changes have been made on this page.</div>:null}
  <section className={styles.topGrid}>
   <article className={styles.panel}>
    <h2>My volunteer profile</h2>
    <p className={styles.help}>Skills help coordinators match people to tasks. You can volunteer for welcome or setup without repair skills. This is not proof of qualification.</p>
    <form action={saveSkills} className={styles.form}>
     <label>Skills or interests <input name="skills" maxLength={1200} defaultValue={(profileData?.skills??[]).join(", ")} placeholder="Sewing, laptops, greeting visitors"/></label>
     <label>My preferences <input name="preference" maxLength={240} defaultValue={profileData?.preference??""} placeholder="Prefer mornings or quieter activities"/></label>
     <button className="button">Save skills</button>
    </form>
   </article>
   <article className={styles.panel}>
    <h2>How rostering works</h2>
    <div className={styles.steps}>
     <p><strong>1 · Availability</strong><span>Tell us which individual months suit you.</span></p>
     <p><strong>2 · Offer</strong><span>A coordinator offers a particular shift.</span></p>
     <p><strong>3 · Confirm</strong><span>Accept it to appear on the confirmed roster.</span></p>
    </div>
    <p className={styles.help}>A venue being offered does not mean a booking exists. Unavailable months never automatically carry into your next month.</p>
   </article>
  </section>
  {canManage?<section className={styles.coordinator}>
   <div className={styles.sectionTitle}><h2>Coordinator desk</h2><span className={styles.pill}>Managers & admins</span></div>
   <div className={styles.buttonRow}><Link href="/repair-cafe-volunteers/people" className="button secondary">Manage all volunteers ↗</Link>
   <Link href="/repair-cafe-volunteers/event-desk" className="button secondary">Event Desk ↗</Link>
   <Link href="/repair-cafe-volunteers/operations" className="button secondary">Operations & safety ↗</Link>
   <Link href="/repair-cafe-volunteers/reports" className="button secondary">Reports ↗</Link></div>
   <p className={styles.help}>Every session below has an Edit date & time control. You can also add someone directly to a single date without creating a login.</p>
   <div className={styles.manageGrid}>
    <details className={styles.panel}><summary>Create an event</summary>
     <form action={createSession} className={styles.form}>
      <label>Date <input type="date" name="event_date" required/></label>
      <label>Title <input name="title" required minLength={3} maxLength={150} defaultValue="Repair Café Dubbo"/></label>
      <div className={styles.two}><label>From <input type="time" name="starts_at" defaultValue="10:00" required/></label><label>To <input type="time" name="ends_at" defaultValue="13:00" required/></label></div>
      <label>Planned repair focus <input name="focus" maxLength={350} placeholder="Computers, sewing, small mechanical"/></label>
      <button className="button">Create draft event</button>
     </form>
    </details>
    <details className={styles.panel}><summary>Generate monthly dates</summary>
     <p className={styles.help}>Creates third-Saturday planning drafts only. Existing dates are left unchanged; nothing is made public.</p>
     <form action={createMonthlyDrafts} className={styles.form}><label>Year <input type="number" name="year" min={2026} max={2035} defaultValue={2027} required/></label>
      <button className="button secondary">Create monthly drafts</button></form>
    </details>
    <details className={styles.panel}><summary>Add a venue</summary>
     <form action={createVenue} className={styles.form}>
      <label>Venue or organisation name <input name="name" required maxLength={120}/></label>
      <label>Address (only use public location details) <input name="address" maxLength={250}/></label>
      <label>Accessibility <textarea name="accessibility" maxLength={500} rows={2}/></label>
      <label>Approved activities / restrictions <textarea name="permitted_activities" maxLength={600} rows={2}/></label>
      <button className="button">Add to venue directory</button>
     </form>
    </details>
   </div>
   {venues.length?<details className={styles.panel}><summary>Venue directory ({venues.length})</summary>
    <div className={styles.venues}>{venues.map(v=><details key={v.id} className={styles.venue}><summary>{v.name} <small>{v.address||"Address not supplied"}</small></summary>
     <form action={updateVenue} className={styles.form}>
      <input type="hidden" name="venue_id" value={v.id}/>
      <label>Name <input name="name" defaultValue={v.name} required maxLength={120}/></label>
      <label>Address <input name="address" defaultValue={v.address} maxLength={250}/></label>
      <label>Accessibility <textarea name="accessibility" rows={2} maxLength={500} defaultValue={v.accessibility}/></label>
      <label>Approved activities / restrictions <textarea name="permitted_activities" rows={2} maxLength={600} defaultValue={v.permitted_activities}/></label>
      <button className="button secondary">Save venue details</button>
     </form>
     <form action={deleteVenue} className={styles.dangerForm}>
      <input type="hidden" name="venue_id" value={v.id}/>
      <p className={styles.help}>First detach this venue from any linked sessions.</p>
      <label>Type DELETE to remove this venue <input name="confirm" required autoComplete="off" placeholder="DELETE"/></label>
      <button className="button danger">Archive venue</button>
     </form></details>)}</div>
   </details>:null}
  </section>:null}
  <section className={styles.events}>
   <div className={styles.sectionTitle}><h2>Upcoming and planned sessions</h2><span>{events.length} in the calendar</span></div>
   {events.length===0?<div className={styles.empty}><h3>No sessions scheduled yet</h3><p>The organiser can create an individual draft or generate third-Saturday drafts. No future date or venue has been confirmed.</p></div>:null}
   {events.map(e=>{
    const mine=availability.find(a=>a.event_id===e.id&&a.user_id===user?.id);
    const eventSlots=slots.filter(s=>s.event_id===e.id);
    const eventSlotIds=new Set(eventSlots.map(s=>s.id));
    const eventAssignments=assignments.filter(a=>eventSlotIds.has(a.slot_id));
    const myAssignments=eventAssignments.filter(a=>a.user_id===user?.id);
    const eventAvailability=availability.filter(a=>a.event_id===e.id);
    const eventManualAvailability=manualAvailability.filter(a=>a.event_id===e.id);
    const availableManual=manualPeople.filter(p=>eventManualAvailability.some(a=>a.manual_volunteer_id===p.id&&a.response==="available"));
    const possiblePeople=people.filter(p=>eventAvailability.some(a=>a.user_id===p.user_id&&a.response!=="unavailable"));
    const venue=venues.find(v=>v.id===e.venue_id);
    const isClosed=e.status==="completed"||e.status==="cancelled";
    const filled=eventSlots.reduce((sum,s)=>sum+eventAssignments.filter(a=>a.slot_id===s.id&&a.status==="confirmed").length,0);
    const needed=eventSlots.reduce((sum,s)=>sum+s.required_count,0);
    return <article key={e.id} className={styles.event}>
     <div className={styles.eventHead}>
      <div><p className={styles.kicker}>{friendlyDate(e.event_date)}</p><h3>{e.title}</h3>
      <p>{e.starts_at.slice(0,5)}–{e.ends_at.slice(0,5)} · {venue?.name??"Venue not selected"}</p>
      {e.focus?<p className={styles.help}>Planned focus: {e.focus}</p>:null}</div>
      <div className={styles.statusStack}><span className={styles.pill}>{friendlyStatus(e.status)}</span>
       <span className={styles.small}>Venue: {friendlyStatus(e.venue_status)}</span>
       <span className={styles.small}>Confirmed: {filled}/{needed} positions</span></div>
     </div>
     {canManage?<div className={styles.eventToolsBar}>
       <details className={styles.eventTool}>
        <summary>✎ Edit date & time</summary>
        <form action={updateSession} className={styles.form}>
         <input type="hidden" name="event_id" value={e.id}/>
         <label>Session date <input type="date" name="event_date" defaultValue={e.event_date} required/></label>
         <label>Title <input name="title" defaultValue={e.title} minLength={3} maxLength={150} required/></label>
         <div className={styles.two}>
          <label>Start <input type="time" name="starts_at" defaultValue={e.starts_at.slice(0,5)} required/></label>
          <label>Finish <input type="time" name="ends_at" defaultValue={e.ends_at.slice(0,5)} required/></label>
         </div>
         <label>Repair categories / focus <input name="focus" defaultValue={e.focus} maxLength={350}/></label>
         {e.status==="published"?<label className={styles.checkbox}>
          <input type="checkbox" name="acknowledge_public_change" value="yes"/>
          I understand changing published details will unpublish this event. I will notify affected people manually.
         </label>:null}
         <button className="button">Save session changes</button>
        </form>
       </details>
       {!isClosed?<details className={styles.eventTool}>
        <summary>+ Add volunteer to this date</summary>
        <form action={createManualVolunteer} className={styles.form}>
         <input type="hidden" name="event_id" value={e.id}/>
         <label>Volunteer name <input name="full_name" required minLength={2} maxLength={120} placeholder="e.g. Jill"/></label>
         <label>Skills / interests <input name="skills" maxLength={1200} placeholder="Sewing, computers, welcome"/></label>
         <div className={styles.two}>
          <label>Email (optional) <input type="email" name="email" maxLength={254}/></label>
          <label>Phone (optional) <input type="tel" name="phone" maxLength={40}/></label>
         </div>
         <label className={styles.checkbox}><input type="checkbox" name="contact_consent" value="yes"/> They agreed to these contact details being kept for Repair Café.</label>
         <label className={styles.checkbox}><input type="checkbox" name="confirmed_availability" value="yes"/> This person agreed they are available on {friendlyDate(e.event_date)}.</label>
         <label>Optional confirmed position <select name="slot_id" defaultValue="">
          <option value="">Just add as available for {friendlyDate(e.event_date)}</option>
          {eventSlots.map(sl=><option value={sl.id} key={sl.id}>{sl.role_name}</option>)}
         </select></label>
         <label className={styles.checkbox}><input type="checkbox" name="confirmed_by_contact" value="yes"/> If assigning a position, I have personally confirmed their agreement to attend and do this role.</label>
         <button className="button">Add volunteer to this date</button>
        </form>
       </details>:null}
     </div>:null}
     <div className={styles.eventGrid}>
      <section className={styles.subpanel}>
       <h4>My availability</h4>
       {isClosed?<p className={styles.help}>This event is closed.</p>:<form action={setAvailability} className={styles.form}>
        <input type="hidden" name="event_id" value={e.id}/>
        <label>Can you help? <select name="response" defaultValue={mine?.response??""} required>
         <option value="" disabled>Choose for this month</option><option value="available">Yes, available</option><option value="maybe">Maybe</option><option value="unavailable">Not available</option>
        </select></label>
        <label>Notes (optional) <input name="note" maxLength={250} defaultValue={mine?.note??""} placeholder="Could do an early shift"/></label>
        <button className="button secondary">Save my availability</button>
       </form>}
       <p className={styles.help}>Current answer: <strong>{mine?friendlyStatus(mine.response):"Not submitted"}</strong>. This is not a confirmed shift.</p>
       {myAssignments.length>0?<div className={styles.myOffers}>
        <h4>My shift offers</h4>
        {myAssignments.map(a=>{
         const slot=eventSlots.find(s=>s.id===a.slot_id);
         return <div key={a.id} className={styles.offer}><strong>{slot?.role_name??"Volunteer role"}</strong><span>{friendlyStatus(a.status)}</span>
          {a.status==="offered"?<div className={styles.buttonRow}>
           <form action={respondShift}><input type="hidden" name="assignment_id" value={a.id}/><input type="hidden" name="status" value="confirmed"/><button className="button">Accept</button></form>
           <form action={respondShift}><input type="hidden" name="assignment_id" value={a.id}/><input type="hidden" name="status" value="declined"/><button className="button secondary">Decline</button></form></div>:null}
          {a.status==="confirmed"?<form action={respondShift}><input type="hidden" name="assignment_id" value={a.id}/><input type="hidden" name="status" value="withdrawn"/><button className="button secondary">Withdraw</button></form>:null}
         </div>})}
       </div>:null}
      </section>
      <section className={styles.subpanel}>
       <h4>Volunteer positions</h4>
       {eventSlots.length===0?<p className={styles.help}>Positions have not been set up yet.</p>:eventSlots.map(s=>{
        const occupants=eventAssignments.filter(a=>a.slot_id===s.id);
        const confirmed=occupants.filter(a=>a.status==="confirmed").length;
        return <div className={styles.position} key={s.id}>
         <div className={styles.positionHead}><strong>{s.role_name} · {s.starts_at.slice(0,5)}–{s.ends_at.slice(0,5)}</strong><span>{confirmed}/{s.required_count} confirmed</span></div>
         {s.notes?<p className={styles.help}>{s.notes}</p>:null}
         {canManage?<div className={styles.roster}>
          {occupants.length?occupants.map(a=><div key={a.id} className={styles.rosterEntry}>
           <div className={styles.rosterPerson}><span>{nameOf(a.user_id??"",a.manual_volunteer_id??"")} · {friendlyStatus(a.status)}{a.manual_volunteer_id?" · Manually added":""}</span>
            <form action={removeShiftOffer}><input type="hidden" name="assignment_id" value={a.id}/>
             <button className={styles.linkButton} aria-label={"Remove "+nameOf(a.user_id??"",a.manual_volunteer_id??"")+" from "+s.role_name}>Remove</button>
            </form>
           </div>
           <form action={substituteVolunteer} className={styles.form}>
            <input type="hidden" name="assignment_id" value={a.id}/>
            <label>Substitute with a confirmed-available volunteer
             <select name="replacement" defaultValue="" required>
              <option value="" disabled>Choose replacement</option>
              <optgroup label="Registered">{people.filter(p=>eventAvailability.some(av=>av.user_id===p.user_id&&av.response==="available")&&p.user_id!==a.user_id)
               .map(p=><option key={p.user_id} value={"account:"+p.user_id}>{p.display_name}</option>)}</optgroup>
              <optgroup label="Manual">{availableManual.filter(p=>p.id!==a.manual_volunteer_id)
               .map(p=><option key={p.id} value={"manual:"+p.id}>{p.full_name}</option>)}</optgroup>
             </select>
            </label>
            <label className={styles.checkbox}><input type="checkbox" name="confirmed_by_contact" value="yes"/> Replacement agreed to this shift.</label>
            <button className="button secondary">Substitute volunteer</button>
           </form>
           <form action={changeAssignmentStatus} className={styles.inlineForm}>
            <input type="hidden" name="assignment_id" value={a.id}/>
            <label className={styles.srOnly} htmlFor={"status-"+a.id}>Status for {nameOf(a.user_id??"",a.manual_volunteer_id??"")}</label>
            <select name="status" id={"status-"+a.id} defaultValue={a.status}>
             <option value="offered">Offered</option><option value="confirmed">Confirmed</option><option value="declined">Declined</option><option value="withdrawn">Withdrawn</option>
            </select>
            <label className={styles.checkbox}><input type="checkbox" name="confirmed_by_contact" value="yes"/> Confirmed with volunteer</label>
            <button className="button secondary">Update</button>
           </form>
          </div>):<p className={styles.help}>No one offered this position.</p>}
          {!isClosed?<form action={offerShift} className={styles.inlineForm}><input type="hidden" name="slot_id" value={s.id}/>
           <label className={styles.srOnly} htmlFor={"person-"+s.id}>Volunteer for {s.role_name}</label>
           <select name="user_id" id={"person-"+s.id} defaultValue="" required>
            <option value="" disabled>Choose available volunteer</option>
            {possiblePeople.filter(p=>!occupants.some(a=>a.user_id===p.user_id)).map(p=><option key={p.user_id} value={p.user_id}>{p.display_name}{p.skills.length?" · "+p.skills.slice(0,3).join(", "):""}</option>)}
           </select><button className="button secondary" disabled={!possiblePeople.some(p=>!occupants.some(a=>a.user_id===p.user_id))}>Offer shift</button>
          </form>:null}
          {!isClosed?<form action={assignManualShift} className={styles.form}>
           <input type="hidden" name="slot_id" value={s.id}/>
           <label>Assign a manually added volunteer
            <select name="manual_volunteer_id" defaultValue="" required>
             <option value="" disabled>Choose someone marked available</option>
             {availableManual.filter(p=>!occupants.some(a=>a.manual_volunteer_id===p.id)).map(p=>
              <option value={p.id} key={p.id}>{p.full_name}{p.skills.length?" · "+p.skills.slice(0,2).join(", "):""}</option>)}
            </select>
           </label>
           <label className={styles.checkbox}><input type="checkbox" name="confirmed_by_contact" value="yes"/> They personally agreed to this role.</label>
           <button className="button secondary" disabled={!availableManual.some(p=>!occupants.some(a=>a.manual_volunteer_id===p.id))}>Confirm manual volunteer</button>
          </form>:null}
         </div>:<p className={styles.help}>{occupants.find(a=>a.user_id===user?.id)?.status==="confirmed"?"You are confirmed for this position.":"Coordinator assigns volunteers after they register availability."}</p>}
         {canManage?<details className={styles.inlineManage}>
          <summary>Edit or delete this position</summary>
          <form action={updateSlot} className={styles.form}>
           <input type="hidden" name="slot_id" value={s.id}/>
           <label>Role name <input name="role_name" defaultValue={s.role_name} minLength={2} maxLength={80} required/></label>
           <label>People needed <input type="number" name="required_count" defaultValue={s.required_count} min={1} max={20} required/></label>
           <div className={styles.two}><label>Shift starts <input type="time" name="starts_at" defaultValue={s.starts_at.slice(0,5)} required/></label><label>Shift ends <input type="time" name="ends_at" defaultValue={s.ends_at.slice(0,5)} required/></label></div>
           <label>Notes <input name="notes" defaultValue={s.notes} maxLength={250}/></label>
           <button className="button secondary">Save position</button>
          </form>
          <form action={deleteSlot} className={styles.dangerForm}>
           <input type="hidden" name="slot_id" value={s.id}/>
           <label>Type DELETE to remove this position and assignments <input name="confirm" required placeholder="DELETE"/></label>
           <button className="button danger">Delete position</button>
          </form>
         </details>:null}
        </div>
       })}
       {canManage&&!isClosed?<form action={createSlot} className={styles.form}>
        <h4>Add a required position</h4><input type="hidden" name="event_id" value={e.id}/>
        <label>Role <input name="role_name" list="repair-roles" required maxLength={80} placeholder="Sewing & textiles"/></label>
        <div className={styles.two}><label>People required <input type="number" name="required_count" min={1} max={20} defaultValue={1} required/></label>
        <label>Notes <input name="notes" maxLength={250} placeholder="Arrive 9:30"/></label></div>
        <div className={styles.two}><label>Starts at <input type="time" name="starts_at" defaultValue={e.starts_at.slice(0,5)} required/></label><label>Ends at <input type="time" name="ends_at" defaultValue={e.ends_at.slice(0,5)} required/></label></div>
        <button className="button secondary">Add position</button>
       </form>:null}
      </section>
     </div>
     {canManage?<details className={styles.adminDetails}><summary>Venue, publication, availability &amp; deletion · {eventAvailability.length+eventManualAvailability.length} responses</summary>
      <div className={styles.manageGrid}>
       <div className={styles.form}><h4>Venue booking</h4>
        <p className={styles.help}>An offered or tentative space must not be displayed as confirmed.</p>
        <form action={setVenueForSession} className={styles.form}>
         <input type="hidden" name="event_id" value={e.id}/>
         <label>Venue <select name="venue_id" defaultValue={e.venue_id??""}><option value="">Not chosen</option>{venues.map(v=><option value={v.id} key={v.id}>{v.name}</option>)}</select></label>
         <label>Booking stage <select name="venue_status" defaultValue={e.venue_status}>
          <option value="unknown">Not approached</option><option value="offered">Host offered</option><option value="tentative">Provisional hold</option><option value="confirmed">Confirmed</option><option value="declined">Declined / unavailable</option>
         </select></label>
         <label className={styles.checkbox}><input type="checkbox" name="written_confirmation" value="yes"/> If marking confirmed, I have written approval for this date and planned activities.</label>
         <button className="button secondary">Save booking stage</button>
        </form>
        <form action={setSafetyChecked} className={styles.form}>
         <input type="hidden" name="event_id" value={e.id}/>
         <label className={styles.checkbox}><input type="checkbox" name="safety_checked" value="yes" defaultChecked={e.safety_checked}/> I have verified insurance, permitted activities, first aid, accessible layout and safety readiness for this venue.</label>
         <button className="button secondary" disabled={e.venue_status!=="confirmed"}>Record safety check</button>
        </form>
       </div>
       <div className={styles.form}><h4>Open, publish or cancel</h4>
        <p className={styles.help}>Public publication requires a confirmed venue, checked safety, a stated repair focus and every required position accepted.</p>
        <form action={setSessionStatus} className={styles.form}><input type="hidden" name="event_id" value={e.id}/>
         <label>Status <select name="status" defaultValue={e.status}>
          <option value="draft">Draft only</option><option value="collecting">Collecting volunteers</option><option value="published">Publish confirmed event</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
         </select></label>
         <button className="button">Save status</button>
        </form>
        <h4>Volunteer availability</h4>
        {eventAvailability.length===0&&eventManualAvailability.length===0?<p className={styles.help}>No responses yet.</p>:null}
        {eventAvailability.map(a=><div className={styles.availLine} key={a.user_id}>
         <strong>{nameOf(a.user_id)}</strong> · {friendlyStatus(a.response)}{a.note?" · "+a.note:""}
         <form action={deleteAvailability}><input type="hidden" name="event_id" value={e.id}/><input type="hidden" name="kind" value="account"/><input type="hidden" name="person_id" value={a.user_id}/>
          <button className={styles.linkButton}>Remove availability</button></form>
        </div>)}
        {eventManualAvailability.map(a=><div className={styles.availLine} key={a.manual_volunteer_id}>
         <strong>{nameOf("",a.manual_volunteer_id)}</strong> · {friendlyStatus(a.response)}{a.note?" · "+a.note:""}
         <form action={deleteAvailability}><input type="hidden" name="event_id" value={e.id}/><input type="hidden" name="kind" value="manual"/><input type="hidden" name="person_id" value={a.manual_volunteer_id}/>
          <button className={styles.linkButton}>Remove availability</button></form>
        </div>)}
        <form action={setManualAvailability} className={styles.form}>
         <h4>Record or edit manual volunteer availability</h4>
         <input type="hidden" name="event_id" value={e.id}/>
         <label>Volunteer <select name="manual_volunteer_id" defaultValue="" required>
          <option value="" disabled>Choose manually added volunteer</option>
          {manualPeople.map(p=><option key={p.id} value={p.id}>{p.full_name}</option>)}
         </select></label>
         <label>Availability <select name="response" defaultValue="available">
          <option value="available">Available</option><option value="maybe">Maybe</option><option value="unavailable">Unavailable</option>
         </select></label>
         <label>Note <input name="note" maxLength={250} placeholder="Spoke with Jill on Friday"/></label>
         <button className="button secondary" disabled={!manualPeople.length}>Save manual availability</button>
        </form>
        <form action={setAccountAvailability} className={styles.form}>
         <h4>Record availability for a registered volunteer</h4>
         <input type="hidden" name="event_id" value={e.id}/>
         <label>Volunteer <select name="user_id" required defaultValue=""><option value="" disabled>Choose account volunteer</option>
          {people.map(p=><option key={p.user_id} value={p.user_id}>{p.display_name}</option>)}</select></label>
         <label>Availability <select name="response" defaultValue="available">
          <option value="available">Available</option><option value="maybe">Maybe</option><option value="unavailable">Unavailable</option>
         </select></label>
         <label>Note <input name="note" maxLength={250}/></label>
         <label className={styles.checkbox}><input type="checkbox" name="confirmed_by_contact" value="yes"/> I checked with this person.</label>
         <button className="button secondary">Save availability</button>
        </form>
       </div>
      </div>
      <form action={deleteSession} className={styles.dangerForm}>
       <h4>Delete this session</h4>
       <p className={styles.help}>This archives the session and hides it from the calendar while preserving its roster and history. Restore it from Operations & safety. Notify attendees before archiving.</p>
       <input type="hidden" name="event_id" value={e.id}/>
       <label>Type DELETE to confirm <input name="confirm" required autoComplete="off" placeholder="DELETE"/></label>
       <button className="button danger" disabled={e.status==="published"}>Archive session (recoverable)</button>
      </form>
     </details>:null}
    </article>;
   })}
  </section>
  <datalist id="repair-roles">{roleSuggestions.map(role=><option value={role} key={role}/>)}</datalist>
  <p className={styles.footerNote}>Dates and volunteer answers are kept in the Repair Café programme, separate from E-waste and Library of Things inventories. The calendar uses Dubbo local dates. Venue and shift changes do not yet send automatic emails.</p>
 </div>;
}
