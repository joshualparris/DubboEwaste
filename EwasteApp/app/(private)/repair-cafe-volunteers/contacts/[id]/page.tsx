import Link from "next/link";
import {notFound,redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {saveContact,addCorrespondence,deleteContact,deleteCorrespondence} from "../actions";
import styles from "../contacts.module.css";
type Contact={id:string;email:string;organisation_name:string;town:string;state:string;website:string;contact_name:string;phone:string;venue_description:string;legal_structure:string;insurer:string;public_liability:string;products_liability:string;volunteer_cover:string;device_damage_cover:string;annual_premium_aud:number|null;funding_source:string;insurance_notes:string;evidence_url:string;notes:string;contact_status:string;contacted_on:string|null;follow_up_on:string|null;last_response_on:string|null};
type Correspondence={id:string;kind:string;subject:string;summary:string;source_email:string;happened_at:string;gmail_url:string};
const statuses:Record<string,string>={sent:"Awaiting reply",auto_acknowledged:"Auto acknowledged",human_replied:"Human reply",follow_up:"Follow-up sent",bounced:"Bounced",closed:"Closed"};
const kinds:Record<string,string>={sent:"Sent email",auto_acknowledgement:"Automatic reply",human_reply:"Human reply",follow_up:"Follow-up",phone_call:"Phone call",note:"Research note",bounce:"Delivery failure"};
const fields:{name:keyof Contact;label:string;kind?:"url"|"text"|"date"|"number";max?:number}[]=[
 {name:"organisation_name",label:"Repair Café / organisation",max:180},{name:"email",label:"Contact email",max:254},{name:"contact_name",label:"Contact person",max:160},
 {name:"phone",label:"Phone",max:80},{name:"town",label:"Town / locality",max:100},{name:"website",label:"Website or directory listing",kind:"url",max:500},
 {name:"venue_description",label:"Venue(s) / rotating locations",max:500},{name:"legal_structure",label:"Organiser, Council and auspicing relationship",max:500},
 {name:"insurer",label:"Insurer / broker",max:180},{name:"public_liability",label:"Public liability coverage, limits and evidence",max:500},
 {name:"products_liability",label:"Products / completed work after handback",max:500},{name:"volunteer_cover",label:"Volunteer accident insurance",max:500},
 {name:"device_damage_cover",label:"Device damage / care and custody coverage",max:500},{name:"annual_premium_aud",label:"Annual insurance premium (AUD)",kind:"number"},
 {name:"funding_source",label:"Grants / donations / memberships / funding",max:500},
 {name:"evidence_url",label:"Evidence or source URL",kind:"url",max:500},{name:"follow_up_on",label:"Next follow-up date",kind:"date"}
];
const fmtDate=(s:string)=>new Date(s).toLocaleString("en-AU",{timeZone:"Australia/Sydney",dateStyle:"medium",timeStyle:"short"});
export default async function ContactProfile({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{success?:string}>}){
 const {id}=await params,p=await searchParams,{supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))redirect("/repair-cafe-volunteers");
 const [{data,error},{data:messages,error:msgError}]=await Promise.all([
 supabase.from("repair_cafe_outreach_contacts").select("*").eq("id",id).maybeSingle(),
 supabase.from("repair_cafe_outreach_correspondence").select("id,kind,subject,summary,source_email,happened_at,gmail_url").eq("contact_id",id).order("happened_at",{ascending:false}).limit(150)]);
 if(error||!data)notFound();
 const c=data as Contact,correspondence=(messages??[]) as Correspondence[];
 const gmailSearch="https://mail.google.com/mail/u/0/#search/"+encodeURIComponent(c.email);
 return <main className={styles.page}>
  <div className={styles.topLinks}><Link href="/repair-cafe-volunteers/contacts">← All Australian contacts</Link><Link href="/repair-cafe-volunteers">Volunteer Hub</Link></div>
  <header className={styles.hero}><div><span className={styles.eyebrow}>Private correspondence and insurance research</span><h1>{c.organisation_name||"Organisation to verify"}</h1><p>{[c.town,c.state].filter(Boolean).join(", ")||"Location to verify"} · {c.email}</p><p className={styles.micro}>Contact status: {statuses[c.contact_status]||c.contact_status}. Initial enquiry 13 October 2026. Insurance questions remain unverified unless supported by correspondence or a policy.</p></div><div className={styles.heroButtons}><a className={styles.action} href={gmailSearch} target="_blank" rel="noopener noreferrer">Find messages in Gmail ↗</a><a className={styles.secondaryAction} href={"mailto:"+c.email+"?subject="+encodeURIComponent("Follow-up: Repair Café Dubbo insurance enquiry")}>Email contact ↗</a></div></header>
  {p.success?<p className={styles.success}>{p.success}</p>:null}
  {msgError?<p className={styles.error}>Could not load correspondence: {msgError.message}</p>:null}
  <div className={styles.twoColumn}><section className={styles.panel}><div className={styles.heading}><h2>Contact and insurance details</h2><span>Fields are editable</span></div>
    <form action={saveContact} className={styles.detailForm}><input type="hidden" name="contact_id" value={c.id}/>
    <div className={styles.formGrid}>{fields.slice(0,6).map(f=><label key={f.name}>{f.label}<input name={f.name} type={f.kind==="url"?"url":f.kind==="number"?"number":f.kind==="date"?"date":f.name==="email"?"email":"text"} defaultValue={String(c[f.name]??"")} maxLength={f.max} step={f.kind==="number"?"0.01":undefined} min={f.kind==="number"?"0":undefined} required={f.name==="email"}/></label>)}
    <label>State<select name="state" defaultValue={c.state}><option value="">Unknown</option>{["NSW","ACT","VIC","QLD","SA","WA","TAS","NT"].map(s=><option key={s} value={s}>{s}</option>)}</select></label>
    <label>Reply status<select name="contact_status" defaultValue={c.contact_status}>{Object.entries(statuses).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
    {fields.slice(6).map(f=><label key={f.name} className={["legal_structure","public_liability","products_liability","volunteer_cover","device_damage_cover"].includes(f.name)?styles.wide:""}>{f.label}<input name={f.name} type={f.kind||"text"} defaultValue={String(c[f.name]??"")} maxLength={f.max} min={f.kind==="number"?"0":undefined} step={f.kind==="number"?"0.01":undefined}/></label>)}</div>
    <label>Insurance findings and policy exclusions<textarea name="insurance_notes" maxLength={3000} rows={4} defaultValue={c.insurance_notes}/></label>
    <label>Correspondence notes and next actions<textarea name="notes" maxLength={5000} rows={5} defaultValue={c.notes}/></label>
    <div className={styles.formActions}><button className={styles.action} type="submit">Save all details</button></div>
   </form>
  </section>
  <div className={styles.side}>
    <section className={styles.panel}><div className={styles.heading}><h2>Correspondence timeline</h2><span>{correspondence.length} entries</span></div>
     <p className={styles.warning}>Gmail messages do not sync automatically. Add important replies below and keep a link to the original email.</p>
     {correspondence.map(m=><article key={m.id} className={styles.timelineEntry}><div className={styles.entryTitle}><strong>{kinds[m.kind]||m.kind}</strong><small>{fmtDate(m.happened_at)}</small></div>{m.subject?<div className={styles.subject}>{m.subject}</div>:null}<p className={styles.entryBody}>{m.summary}</p>{m.source_email?<small>From: {m.source_email}</small>:null}<div className={styles.entryActions}>{m.gmail_url?<a href={m.gmail_url} target="_blank" rel="noopener noreferrer">View original in Gmail ↗</a>:null}<form action={deleteCorrespondence}><input type="hidden" name="contact_id" value={c.id}/><input type="hidden" name="entry_id" value={m.id}/><button name="confirm" value="yes" type="submit" className={styles.deleteLink}>Delete entry</button></form></div></article>)}
     {!correspondence.length?<p className={styles.empty}>No messages logged yet.</p>:null}
    </section>
    <section className={styles.panel}><h2>Record a reply, call or note</h2>
     <form action={addCorrespondence} className={styles.detailForm}><input name="contact_id" type="hidden" value={c.id}/>
      <label>Type<select name="kind" defaultValue="human_reply">{Object.entries(kinds).filter(([k])=>k!=="sent").map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
      <label>Subject<input name="subject" maxLength={300} placeholder="Reply to our insurance question"/></label>
      <label>From email<input name="source_email" type="email" maxLength={254} defaultValue={c.email}/></label>
      <label>Correspondence date/time (optional)<input name="happened_at" type="datetime-local"/></label>
      <label>Message link (optional)<input name="gmail_url" type="url" maxLength={600} placeholder="https://mail.google.com/…"/></label>
      <label>Reply summary or full notes *<textarea name="summary" rows={5} maxLength={5000} required placeholder="What did they confirm? Insurer name, cover, premiums, exclusions and next steps…"/></label>
      <button className={styles.action} type="submit">Save correspondence</button>
     </form>
    </section>
    <section className={styles.panel}><h2>Remove contact</h2><p className={styles.micro}>Deletes this dashboard record and its local timeline, but does not delete any Gmail messages.</p><form action={deleteContact} className={styles.formActions}><input type="hidden" name="contact_id" value={c.id}/><label className={styles.confirm}><input type="checkbox" required/> I understand this removes the record</label><button type="submit" name="confirm" value="yes" className={styles.danger}>Delete contact</button></form></section>
  </div></div>
 </main>;
}