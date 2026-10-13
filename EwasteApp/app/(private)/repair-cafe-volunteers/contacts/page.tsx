import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {createContact} from "./actions";
import styles from "./contacts.module.css";
type Contact={id:string;email:string;organisation_name:string;town:string;state:string;website:string;contact_name:string;contact_status:string;contacted_on:string|null;follow_up_on:string|null;last_response_on:string|null;insurer:string;updated_at:string};
const statusNames:Record<string,string>={sent:"Awaiting reply",auto_acknowledged:"Auto acknowledged",human_replied:"Human reply",follow_up:"Follow-up sent",bounced:"Bounced",closed:"Closed"};
const states=["NSW","ACT","VIC","QLD","SA","WA","TAS","NT"];
function auToday(){return new Intl.DateTimeFormat("en-CA",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());}
export default async function RepairCafeContacts({searchParams}:{searchParams:Promise<{q?:string;state?:string;status?:string;success?:string;error?:string}>}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))redirect("/repair-cafe-volunteers");
 const p=await searchParams;
 const {data,error}=await supabase.from("repair_cafe_outreach_contacts").select("id,email,organisation_name,town,state,website,contact_name,contact_status,contacted_on,follow_up_on,last_response_on,insurer,updated_at").order("organisation_name",{ascending:true}).limit(300);
 const records=(data??[]) as Contact[],now=auToday();
 const search=(p.q||"").trim().toLowerCase();
 const filtered=records.filter(c=>(!search||[c.organisation_name,c.email,c.town,c.state,c.contact_name,c.insurer].join(" ").toLowerCase().includes(search))&&(!p.state||c.state===p.state)&&(!p.status||c.contact_status===p.status));
 const all=records.length,human=records.filter(c=>c.contact_status==="human_replied").length,auto=records.filter(c=>c.contact_status==="auto_acknowledged").length,due=records.filter(c=>c.follow_up_on&&c.follow_up_on<=now&&["sent","auto_acknowledged","follow_up"].includes(c.contact_status)).length;
 return <main className={styles.page}>
  <div className={styles.topLinks}><Link href="/repair-cafe-volunteers">← Repair Café Volunteer Hub</Link><Link href="/repair-cafe-volunteers/operations">Operations & safety</Link></div>
  <header className={styles.hero}><div><span className={styles.eyebrow}>Private coordinator workspace</span><h1>Australian Repair Café contacts</h1><p>Insurance outreach, contact directory, individual correspondence and next steps, all in your existing Repair Café login.</p></div><a className={styles.action} href="https://mail.google.com/mail/u/0/#search/Repair+Caf%C3%A9+insurance" target="_blank" rel="noopener noreferrer">Open Gmail ↗</a></header>
  <div className={styles.stats}><div><strong>{all}</strong><span>Contacts imported</span></div><div><strong>{human}</strong><span>Human replies</span></div><div><strong>{auto}</strong><span>Auto acknowledgements</span></div><div><strong>{due}</strong><span>Follow-ups due</span></div></div>
  <p className={styles.warning}>This tracker is private and manually maintained. Gmail does not automatically sync with this dashboard. The original message was sent in Bcc to 57 addresses on 13 October 2026; a contact record is not proof of email delivery. Website, location and insurance fields may still need verification.</p>
  {error?<p className={styles.error}>Could not load contacts: {error.message}</p>:null}
  {p.error?<p className={styles.error}>{p.error}</p>:null}{p.success?<p className={styles.success}>{p.success}</p>:null}
  <section className={styles.panel}>
   <div className={styles.heading}><h2>Contact directory</h2><span>{filtered.length} showing</span></div>
   <form method="get" className={styles.filters}>
    <label>Search<input type="search" name="q" defaultValue={p.q||""} placeholder="Name, town, email, insurer…" /></label>
    <label>State<select name="state" defaultValue={p.state||""}><option value="">All states</option>{states.map(s=><option key={s} value={s}>{s}</option>)}</select></label>
    <label>Response<select name="status" defaultValue={p.status||""}><option value="">All statuses</option>{Object.entries(statusNames).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
    <button className={styles.action} type="submit">Filter</button><Link className={styles.secondaryAction} href="/repair-cafe-volunteers/contacts">Clear</Link>
   </form>
   <div className={styles.tableScroll}><table className={styles.table}><thead><tr><th>Repair Café or organisation</th><th>Town, state</th><th>Status</th><th>Follow-up</th><th>Insurance</th></tr></thead><tbody>
    {filtered.map(c=><tr key={c.id}><td><Link className={styles.contactLink} href={"/repair-cafe-volunteers/contacts/"+c.id}>{c.organisation_name||"Name to verify"}</Link><small>{c.email}</small></td><td>{[c.town,c.state].filter(Boolean).join(", ")||"Unverified"}</td><td><span className={styles.status}>{statusNames[c.contact_status]||c.contact_status}</span></td><td>{c.follow_up_on||"Not set"}{c.follow_up_on&&c.follow_up_on<=now&&["sent","auto_acknowledged","follow_up"].includes(c.contact_status)?<small className={styles.due}>Review due</small>:null}</td><td>{c.insurer||<span className={styles.muted}>Unknown</span>}</td></tr>)}
   </tbody></table>{!filtered.length?<p className={styles.empty}>No contacts match these filters.</p>:null}</div>
  </section>
  <section className={styles.panel}><div className={styles.heading}><h2>Add a contact</h2><span>Records only · nothing is emailed</span></div>
   <form action={createContact} className={styles.formGrid}><label>Contact email *<input name="email" type="email" required maxLength={254}/></label><label>Organisation<input name="organisation_name" maxLength={180}/></label><label>Town<input name="town" maxLength={100}/></label><label>State<select name="state" defaultValue=""><option value="">Unknown</option>{states.map(s=><option key={s} value={s}>{s}</option>)}</select></label><div className={styles.formActions}><button className={styles.action} type="submit">Add contact</button></div></form>
  </section>
 </main>;
}