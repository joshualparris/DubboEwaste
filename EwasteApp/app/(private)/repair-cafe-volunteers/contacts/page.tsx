import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {createContact} from "./actions";
import styles from "./contacts.module.css";

type Contact={id:string;email:string;organisation_name:string;town:string;state:string;website:string;contact_name:string;contact_status:string;contacted_on:string|null;follow_up_on:string|null;last_response_on:string|null;insurer:string;evidence_url:string;updated_at:string};
const statusNames:Record<string,string>={sent:"Waiting for reply",auto_acknowledged:"Auto acknowledgement",human_replied:"Human reply received",follow_up:"Follow-up sent",bounced:"Delivery failed",closed:"Closed"};
const states=["NSW","ACT","VIC","QLD","SA","WA","TAS","NT"];
const today=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const shortDate=(s:string|null)=>s?new Date(s+"T12:00:00Z").toLocaleDateString("en-AU",{timeZone:"Australia/Sydney",day:"numeric",month:"short",year:"numeric"}):"Not set";
export default async function RepairCafeContacts({searchParams}:{searchParams:Promise<{q?:string;state?:string;status?:string;success?:string;error?:string}>}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))redirect("/repair-cafe-volunteers");
 const params=await searchParams;
 const {data,error}=await supabase.from("repair_cafe_outreach_contacts").select("id,email,organisation_name,town,state,website,contact_name,contact_status,contacted_on,follow_up_on,last_response_on,insurer,evidence_url,updated_at").order("organisation_name",{ascending:true}).limit(300);
 const records=(data??[]) as Contact[],date=today(),term=(params.q||"").trim().toLowerCase();
 const results=records.filter(c=>(!term||[c.organisation_name,c.email,c.town,c.state,c.contact_name,c.insurer].join(" ").toLowerCase().includes(term))&&(!params.state||c.state===params.state)&&(!params.status||c.contact_status===params.status));
 const human=records.filter(c=>c.contact_status==="human_replied").length,acks=records.filter(c=>c.contact_status==="auto_acknowledged").length,due=records.filter(c=>c.follow_up_on&&c.follow_up_on<=date&&["sent","auto_acknowledged","follow_up"].includes(c.contact_status)).length;
 return <main className={styles.page}>
  <nav className={styles.topLinks} aria-label="Breadcrumb"><Link href="/repair-cafe-volunteers">← Volunteer Hub</Link><Link href="/repair-cafe-volunteers/operations">Operations &amp; safety</Link></nav>
  <header className={styles.hero}>
   <div><span className={styles.eyebrow}>Repair Café Dubbo · coordinator access</span><h1>Australian Repair Café contacts</h1><p>All the Repair Cafés you emailed, with verified locations, insurance research, correspondence and follow-up notes.</p></div>
   <a className={styles.heroAction} href="https://mail.google.com/mail/u/0/#search/Repair+Caf%C3%A9+insurance" target="_blank" rel="noopener noreferrer">Open Gmail ↗</a>
  </header>
  <section className={styles.stats} aria-label="Outreach summary">
   <div><strong>{records.length}</strong><span>Contacts</span></div><div><strong>{human}</strong><span>Human replies</span></div><div><strong>{acks}</strong><span>Automatic replies</span></div><div><strong>{due}</strong><span>Follow-ups due</span></div>
  </section>
  {error?<p className={styles.error}>Unable to load the contact directory: {error.message}</p>:null}
  {params.error?<p className={styles.error}>{params.error}</p>:null}
  {params.success?<p className={styles.success}>{params.success}</p>:null}
  <section className={styles.panel}>
   <div className={styles.heading}><div><h2>Contact directory</h2><p>Search by name, town, state, email or insurer.</p></div><span className={styles.count}>{results.length} showing</span></div>
   <form method="get" className={styles.filters} role="search">
    <label>Search<input name="q" type="search" defaultValue={params.q||""} placeholder="e.g. Castlemaine or VIC"/></label>
    <label>State<select name="state" defaultValue={params.state||""}><option value="">All states</option>{states.map(s=><option key={s} value={s}>{s}</option>)}</select></label>
    <label>Reply status<select name="status" defaultValue={params.status||""}><option value="">All statuses</option>{Object.entries(statusNames).map(([s,name])=><option key={s} value={s}>{name}</option>)}</select></label>
    <div className={styles.filterActions}><button type="submit" className={styles.action}>Apply filters</button><Link className={styles.secondaryAction} href="/repair-cafe-volunteers/contacts">Clear filters</Link></div>
   </form>
   <div className={styles.cardGrid}>
    {results.map(c=>{
     const overdue=!!(c.follow_up_on&&c.follow_up_on<=date&&["sent","auto_acknowledged","follow_up"].includes(c.contact_status));
     return <article className={styles.contactCard} key={c.id}>
      <div className={styles.cardHeader}><div className={styles.cardState}>{c.state||"State unknown"}</div><span className={styles.status} data-status={c.contact_status}>{statusNames[c.contact_status]||c.contact_status}</span></div>
      <h3 className={styles.cardTitle}><Link href={"/repair-cafe-volunteers/contacts/"+c.id}>{c.organisation_name||"Organisation not verified"}</Link></h3>
      <p className={styles.cardTown}>{c.town||"Town not verified"}{c.state?", "+c.state:""}</p>
      {c.contact_name?<p className={styles.cardPerson}>Contact: {c.contact_name}</p>:null}
      <a className={styles.emailLink} href={"mailto:"+c.email}>{c.email}</a>
      <div className={styles.cardMeta}><span>Next follow-up</span><strong>{shortDate(c.follow_up_on)}</strong>{overdue?<span className={styles.overdue}>Due to review</span>:null}</div>
      <div className={styles.cardFooter}><Link className={styles.cardOpen} href={"/repair-cafe-volunteers/contacts/"+c.id}>View details &amp; messages →</Link>
       {c.website?<a href={c.website} target="_blank" rel="noopener noreferrer">Website ↗</a>:c.evidence_url?<a href={c.evidence_url} target="_blank" rel="noopener noreferrer">Source ↗</a>:null}
      </div>
     </article>;
    })}
   </div>
   {results.length===0?<p className={styles.empty}>No cafés match those filters. Try clearing them.</p>:null}
  </section>
  <section className={styles.panel}>
   <div className={styles.heading}><div><h2>Add another contact</h2><p>Only saves to this private tracker, and does not send an email.</p></div></div>
   <form action={createContact} className={styles.formGrid}>
    <label>Contact email *<input name="email" type="email" required maxLength={254}/></label>
    <label>Organisation<input name="organisation_name" maxLength={180}/></label>
    <label>Town<input name="town" maxLength={100}/></label>
    <label>State<select name="state" defaultValue=""><option value="">Unknown</option>{states.map(s=><option key={s} value={s}>{s}</option>)}</select></label>
    <div className={styles.formActions}><button type="submit" className={styles.action}>Add contact</button></div>
   </form>
  </section>
  <p className={styles.footnote}>Private organiser records; Gmail does not yet sync automatically. Location and website links come from published sources and may need reconfirming. Insurance coverage is unknown unless supported by evidence.</p>
 </main>;
}