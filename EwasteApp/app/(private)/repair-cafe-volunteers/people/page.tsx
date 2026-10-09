import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {createManualVolunteer,updateManualVolunteer,deleteManualVolunteer} from "../sessions/manage-actions";
import styles from "../sessions/sessions.module.css";

type Manual={id:string;full_name:string;email:string;phone:string;skills:string[];notes:string;contact_consent:boolean};
type Event={id:string;event_date:string;title:string;status:string};
const nice=(d:string)=>new Date(d+"T12:00:00Z").toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short",year:"numeric",timeZone:"Australia/Sydney"});
export default async function PeoplePage({searchParams}:{searchParams:Promise<{error?:string;success?:string}>}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))
  redirect("/repair-cafe-volunteers/sessions?error=Only%20coordinators%20can%20manage%20volunteer%20contact%20details");
 const [{data:manual,error:peopleError},{data:events},directory]=await Promise.all([
  supabase.from("repair_cafe_manual_volunteers")
   .select("id,full_name,email,phone,skills,notes,contact_consent").order("full_name"),
  supabase.from("repair_cafe_sessions").select("id,event_date,title,status").order("event_date"),
  supabase.rpc("repair_cafe_roster_directory")
 ]);
 const people=(manual??[]) as Manual[],sessions=((events??[]) as Event[]).filter(e=>!["completed","cancelled"].includes(e.status));
 const accounts=(directory.data??[]) as {user_id:string;display_name:string;skills:string[]}[];
 const {error,success}=await searchParams;
 return <div className={styles.page}>
  <nav className={styles.breadcrumb}><Link href="/repair-cafe-volunteers/sessions">Sessions & rosters</Link><span>›</span>Volunteer directory</nav>
  <header className={styles.hero}>
   <div><div className="badge">Private · Repair Café coordinators</div>
    <h1>Volunteer directory</h1>
    <p>Add people you have spoken with, even if they have not registered online. Manage their skills, contact permission and monthly availability separately.</p>
   </div>
   <Link className="button secondary" href="/repair-cafe-volunteers/sessions">Back to sessions</Link>
  </header>
  {error?<div className="error" role="alert">{error}</div>:null}
  {success?<div className="success" role="status">{success}</div>:null}
  {peopleError||directory.error?<div className="error" role="alert">Could not load the full volunteer directory. No records have been changed.</div>:null}
  <section className={styles.panel}>
   <div className={styles.sectionTitle}><h2>Add a volunteer</h2><span className={styles.pill}>No account needed</span></div>
   <p className={styles.help}>Only add a genuine person who has agreed to be involved. Enter just their name if they have not permitted you to keep an email or phone number.</p>
   <form action={createManualVolunteer} className={styles.form}>
    <input type="hidden" name="return_to" value="people"/>
    <div className={styles.two}><label>Name <input name="full_name" maxLength={120} minLength={2} required placeholder="e.g. Barry Smith"/></label>
    <label>Skills / interests <input name="skills" maxLength={1200} placeholder="Sewing, laptops, welcome"/></label></div>
    <div className={styles.two}><label>Email (optional) <input type="email" name="email" maxLength={254}/></label>
    <label>Phone (optional) <input type="tel" name="phone" maxLength={40}/></label></div>
    <label>Coordinator notes <textarea name="notes" rows={2} maxLength={500} placeholder="Only details needed for helping with Repair Café"/></label>
    <label className={styles.checkbox}><input type="checkbox" name="contact_consent" value="yes"/> Volunteer has agreed to the contact details entered above being kept for Repair Café coordination.</label>
    <label>Optionally add them to this month as available
     <select name="event_id" defaultValue="">
      <option value="">Directory only (choose a session later)</option>
      {sessions.map(e=><option key={e.id} value={e.id}>{nice(e.event_date)} · {e.title}</option>)}
     </select>
    </label>
    <label className={styles.checkbox}><input type="checkbox" name="confirmed_availability" value="yes"/> If I selected a session, I have checked this person can help on that date.</label>
    <button className="button">Add volunteer</button>
   </form>
  </section>
  <section className={styles.panel}>
   <div className={styles.sectionTitle}><h2>Manually added volunteers</h2><span>{people.length} people</span></div>
   {people.length===0?<p className={styles.help}>No manually entered volunteers yet. Use the form above, or add someone directly from a particular session.</p>:null}
   <div className={styles.directoryGrid}>
    {people.map(p=><details key={p.id} className={styles.directoryCard}>
     <summary><span>{p.full_name}<small>{p.skills.join(" · ")||"No skills yet"} · Manual record</small></span></summary>
     <form action={updateManualVolunteer} className={styles.form}>
      <input type="hidden" name="manual_volunteer_id" value={p.id}/>
      <label>Name <input name="full_name" defaultValue={p.full_name} minLength={2} maxLength={120} required/></label>
      <label>Skills <input name="skills" defaultValue={p.skills.join(", ")} maxLength={1200}/></label>
      <div className={styles.two}><label>Email <input type="email" name="email" defaultValue={p.email} maxLength={254}/></label>
       <label>Phone <input type="tel" name="phone" defaultValue={p.phone} maxLength={40}/></label></div>
      <label>Notes <textarea name="notes" defaultValue={p.notes} maxLength={500} rows={2}/></label>
      <label className={styles.checkbox}><input type="checkbox" name="contact_consent" value="yes" defaultChecked={p.contact_consent}/> Volunteer permitted recording their contact details.</label>
      <button className="button secondary">Save volunteer changes</button>
     </form>
     <form action={deleteManualVolunteer} className={styles.dangerForm}>
      <input type="hidden" name="manual_volunteer_id" value={p.id}/>
      <p className={styles.help}>Deleting also removes this person's availability and roster assignments, including confirmed shifts. Review their sessions first.</p>
      <label>Type DELETE to confirm <input name="confirm" autoComplete="off" placeholder="DELETE" required/></label>
      <button className="button danger">Delete volunteer and their rosters</button>
     </form>
    </details>)}
   </div>
  </section>
  <section className={styles.panel}>
   <h2>Volunteers with logins ({accounts.length})</h2>
   <p className={styles.help}>These are existing authenticated Repair Café members. Their accounts are managed through programme memberships, not the manual directory. You can still assign them to sessions from the roster once they have indicated availability.</p>
   <div className={styles.directoryGrid}>{accounts.map(a=><div key={a.user_id} className={styles.directoryCard}>
    <strong>{a.display_name}</strong><p className={styles.help}>{a.skills.join(", ")||"Skills not provided"}</p>
   </div>)}</div>
  </section>
 </div>;
}