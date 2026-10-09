import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {saveKnowledge,deleteKnowledge,reviewLesson} from "./actions";
import {searchRestarters} from "@/lib/repair-cafe/restarters";

type Entry={id:string;review_status:string;ticket_id:string|null;title:string;category:string;manufacturer:string;model:string;symptoms:string;diagnosis:string;solution:string;outcome:string;safety_notes:string;guide_url:string};
type OpenRepairHit={source_id:string;brand:string;product:string;category:string;model:string;problem:string;repair_status:string;country:string};
type Suggest={dataType?:string;title?:string;url?:string;guideid?:number;locale?:string};
const clean=(x:string)=>x.toLowerCase();
const styles={panel:{border:"1px solid #cbd8ce",borderRadius:15,padding:"1rem",background:"var(--surface,#fff)"} as const,form:{display:"grid",gap:12} as const,grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,330px),1fr))",gap:16} as const};
export default async function Knowledge({searchParams}:{searchParams:Promise<{q?:string;ticket?:string;error?:string;success?:string}>}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&context.selected!=="repair_cafe")redirect("/programmes");
 const manage=context.global_admin||["admin","manager"].includes(context.role??"");
 const params=await searchParams,q=(params.q??"").trim().slice(0,100);
 const {data,error}=await supabase.from("repair_cafe_knowledge").select("id,ticket_id,review_status,title,category,manufacturer,model,symptoms,diagnosis,solution,outcome,safety_notes,guide_url").order("updated_at",{ascending:false}).limit(250);
 const {data:attemptData,error:attemptError}=await supabase.from("repair_cafe_tickets")
  .select("id,item_category,item_description,reported_problem,work_summary,outcome,barrier,parts_used,handover_advice,status")
  .in("status",["completed","referred","not_attempted"]).order("closed_at",{ascending:false}).limit(150);
 const attempts=(attemptData??[]) as {id:string;item_category:string;item_description:string;reported_problem:string;work_summary:string;outcome:string|null;barrier:string|null;parts_used:string;handover_advice:string}[];
 const {data:openRows,error:openError}=q.length>=2
  ?await supabase.rpc("repair_cafe_search_open_repair",{p_query:q,p_limit:25})
  :{data:[],error:null};
 const broadTerm=q.split(/\s+/).filter(Boolean).at(-1)??"";
 const broaden=q.length>=2&&!openError&&!(openRows??[]).length&&q.includes(" ")&&broadTerm.length>=2;
 const {data:broaderRows,error:broaderError}=broaden
  ?await supabase.rpc("repair_cafe_search_open_repair",{p_query:broadTerm,p_limit:15})
  :{data:[],error:null};
 const wiki=await searchRestarters(q);
 const selectedTicket=params.ticket&&/^[0-9a-f-]{36}$/i.test(params.ticket)?attempts.find(x=>x.id===params.ticket):undefined;
 const all=(data??[]) as Entry[],words=clean(q);
 const attemptsMatched=words?attempts.filter(x=>[x.item_category,x.item_description,x.reported_problem,x.work_summary,x.outcome??"",x.barrier??""].some(y=>clean(y).includes(words))):attempts;
 const entries=words?all.filter(x=>[x.title,x.category,x.manufacturer,x.model,x.symptoms,x.diagnosis,x.solution].some(y=>clean(y).includes(words))):all;
 // Public iFixit v2 API: external results shown as outbound links, never copied into private records without review.
 let guides:Suggest[]=[];let lookupFailed=false;
 if(q.length>=2){
  try{
   const response=await fetch("https://www.ifixit.com/api/2.0/suggest/"+encodeURIComponent(q)+"?doctypes=guide",{next:{revalidate:3600},signal:AbortSignal.timeout(3500)});
   if(!response.ok)throw new Error("Unavailable");
   const payload=await response.json() as {results?:Suggest[]};
   guides=(payload.results??[]).filter(x=>x.dataType==="guide"&&typeof x.url==="string"&&x.url.startsWith("https://www.ifixit.com/")).slice(0,8);
  }catch{lookupFailed=true}
 }
 return <main style={{maxWidth:1150,margin:"0 auto",display:"grid",gap:20,paddingBottom:60}}>
  <nav><Link href="/repair-cafe-volunteers">← Volunteer Hub</Link> · <Link href="/repair-cafe-volunteers/event-desk">Event Desk</Link></nav>
  <header><div className="badge">Repair Café · private volunteer resource</div><h1>Repair knowledge base</h1>
  <p>Find previous repair lessons, search free repair guides, and build a shared knowledge library. Do not enter visitor names, passwords or personal information.</p></header>
  {params.error?<div className="error" role="alert">{params.error}</div>:null}
  {params.success?<div className="success" role="status">{params.success}</div>:null}
  {error||attemptError||openError?<div className="error" role="alert">Some knowledge records could not load: {error?.message??attemptError?.message??openError?.message}</div>:null}
  <section style={styles.panel}><h2>Search repairs and guides</h2>
   <form style={{display:"flex",gap:8,flexWrap:"wrap"}} method="get"><input style={{flex:"1 1 230px",minWidth:0}} name="q" defaultValue={q} placeholder="e.g. HP laptop no power, sewing machine, broken zipper" maxLength={100} aria-label="Search repair knowledge"/><button className="button">Search</button></form>
   <p className="muted">Search local category, brand, model, symptom or fix. iFixit guide suggestions update for your query.</p></section>
  <section style={styles.panel}><h2>Previous Dubbo repair attempts ({attemptsMatched.length})</h2>
   <p className="muted">Completed/refused repair tickets, without visitor names. These are individual reports, not verified public how-to guides. Do not copy personal information from the notes into a shared lesson.</p>
   {!attemptsMatched.length?<p>No matching repair attempts recorded yet.</p>:null}
   <div style={styles.grid}>{attemptsMatched.slice(0,30).map(t=><details key={t.id} style={{padding:12,border:"1px solid #d8e1da",borderRadius:10}}>
    <summary><strong>{t.item_description}</strong> · {t.outcome?.replaceAll("_"," ")??"Unrecorded"}</summary>
    <p><strong>Problem:</strong> {t.reported_problem}</p><p><strong>What was tried:</strong> {t.work_summary||"Not recorded"}</p>
    {t.barrier?<p><strong>Barrier:</strong> {t.barrier}</p>:null}{t.parts_used?<p><strong>Parts:</strong> {t.parts_used}</p>:null}
    {t.handover_advice?<p><strong>Advice:</strong> {t.handover_advice}</p>:null}
   </details>)}</div>
  </section>
  <section style={styles.grid}>
   <div style={styles.panel}><h2>Dubbo repair lessons ({entries.length})</h2>
    {!entries.length?<p>No matching curated repair lessons yet. Coordinators can add a solution below.</p>:null}
    {entries.map(e=><details key={e.id} style={{borderBottom:"1px solid #ddd",padding:"12px 0"}}>
     <summary><strong>{e.title}</strong> {e.review_status==="draft"?"· Awaiting privacy approval":e.review_status==="rejected"?"· Rejected":""} · {e.manufacturer} {e.model}<div className="muted">{e.category} · {e.outcome.replaceAll("_"," ")}</div></summary>
     <p><strong>Symptoms:</strong> {e.symptoms||"Not recorded"}</p><p><strong>Diagnosis:</strong> {e.diagnosis||"Not recorded"}</p>
     <p><strong>Solution tried:</strong> {e.solution||"Not recorded"}</p>
     {e.safety_notes?<p><strong>Safety:</strong> {e.safety_notes}</p>:null}
     {e.guide_url?<p><a href={e.guide_url} target="_blank" rel="noopener noreferrer">Open referenced guide ↗</a></p>:null}
     {manage&&e.review_status==="draft"?<form action={reviewLesson} style={styles.form}>
      <input type="hidden" name="id" value={e.id}/>
      <label><input type="checkbox" name="privacy_reviewed" value="yes" required/> I checked the entire lesson for visitor names, passwords, contact information, private files and identifying details.</label>
      <div style={{display:"flex",gap:8}}><button className="button" name="decision" value="approved">Approve internal lesson</button><button className="button secondary" name="decision" value="rejected">Reject</button></div>
     </form>:null}
     {manage?<><details><summary>Edit lesson</summary><KnowledgeForm entry={e}/></details>
      <form action={deleteKnowledge}><input type="hidden" name="id" value={e.id}/><label>Type DELETE to remove <input name="confirm" required/></label><button className="button danger">Delete</button></form></>:null}
    </details>)}
   </div>
   <div style={styles.panel}><h2>Free external knowledge</h2>
    <h3>iFixit repair guides</h3>
    {!q?<p>Enter a device or problem to search the public iFixit API.</p>:lookupFailed?<p>iFixit search is temporarily unavailable. Use the direct search link below.</p>:guides.length===0?<p>No guide matches returned.</p>:null}
    {guides.map((g,i)=><p key={g.url??i}><a href={g.url} target="_blank" rel="noopener noreferrer">{g.title||"Repair guide"} ↗</a></p>)}
    {q?<p><a href={"https://www.ifixit.com/Search?query="+encodeURIComponent(q)} target="_blank" rel="noopener noreferrer">Search more on iFixit ↗</a></p>:null}
    <hr/>
    <h3>Restarters Wiki · embedded search</h3><p>Search results from the public wiki; check each guide and its safety warnings.</p>
    {q&&!wiki.available?<p className="muted">Live Wiki API unavailable; direct search remains available below.</p>:null}
    {wiki.hits.map(h=><p key={h.url}><a href={h.url} target="_blank" rel="noopener noreferrer">{h.title} ↗</a>{h.snippet?<small style={{display:"block"}}>{h.snippet}</small>:null}</p>)}
    <a href={q?"https://wiki.restarters.net/index.php?search="+encodeURIComponent(q):"https://wiki.restarters.net/"} target="_blank" rel="noopener noreferrer">Search Restarters Wiki ↗</a>
    <hr/><h3>Open Repair Alliance · 305,649 imported records</h3><p>Search the July 2025 ORDS v0.3 collection across category, product, brand and fault. These are repair outcomes, not step-by-step instructions. Source: Open Repair Alliance · CC BY-SA 4.0.</p>
    {((openRows??[]) as OpenRepairHit[]).map(r=><p key={r.source_id}><strong>{r.brand||r.product||r.category} {r.model}</strong><small style={{display:"block"}}>{r.problem||r.category} · {r.repair_status||"Outcome not supplied"} · {r.country}</small></p>)}
    {q&&!(openRows??[]).length&&!openError?<p className="muted">No records contained every search word. {broaden?"Broader results for “"+broadTerm+"” appear below.":"Try a broader category or single keyword."}</p>:null}
    {broaderError?<p className="muted">Broader search unavailable: {broaderError.message}</p>:null}
    {((broaderRows??[]) as OpenRepairHit[]).map(r=><p key={r.source_id}><strong>{r.brand||r.product||r.category} {r.model}</strong><small style={{display:"block"}}>{r.problem||r.category} · {r.repair_status||"Outcome not supplied"} · {r.country}</small></p>)}
    <a href="https://openrepair.org/open-data/downloads/" target="_blank" rel="noopener noreferrer">Browse open repair datasets ↗</a>
    <p className="muted">External sources retain their own licences. iFixit API use is non-commercial; guides are opened at their source. No visitor information is sent to these services, only the search terms entered here.</p>
   </div>
  </section>
  {manage?<section style={styles.panel}><h2>{selectedTicket?"Review and save a lesson from a repair ticket":"Record a repair lesson"}</h2><p className="muted">A ticket-derived lesson starts as a private draft requiring explicit privacy approval. Review and rewrite notes to remove names, contact details, passwords and any sensitive information.</p><KnowledgeForm sourceTicket={selectedTicket}/></section>:null}
 </main>;
}
function KnowledgeForm({entry,sourceTicket}:{entry?:Entry;sourceTicket?:{id:string;item_category:string;item_description:string;reported_problem:string;work_summary:string;outcome:string|null;handover_advice:string}}){
 const fields=[["title","Title",160],["category","Category",60],["manufacturer","Manufacturer / brand",100],["model","Model",120],["symptoms","Symptoms or reported fault",1500],["diagnosis","Diagnosis / checks",2000],["solution","Steps tried and what happened",4000],["safety_notes","Safety considerations",1000],["guide_url","Link to a public guide (HTTPS)",500]] as const;
 return <form action={saveKnowledge} style={styles.form}>
  {entry?<input type="hidden" name="id" value={entry.id}/>:null}
  {sourceTicket?<input type="hidden" name="ticket_id" value={sourceTicket.id}/>:null}
  {fields.map(([name,label,max])=><label key={name} style={{display:"grid",gap:4}}>{label}
   {["symptoms","diagnosis","solution","safety_notes"].includes(name)?<textarea name={name} maxLength={max} defaultValue={entry?.[name]??(sourceTicket?(name==="title"?sourceTicket.item_description:name==="category"?sourceTicket.item_category:name==="symptoms"?sourceTicket.reported_problem:name==="solution"?sourceTicket.work_summary:""):"")} rows={3}/>:<input name={name} maxLength={max} defaultValue={entry?.[name]??""} required={name==="title"} />}
  </label>)}
  <label>Outcome <select name="outcome" defaultValue={entry?.outcome??(sourceTicket?.outcome==="fixed"?"worked":sourceTicket?.outcome==="partially_fixed"?"partially_worked":sourceTicket?.outcome==="not_fixed"?"did_not_work":"unverified")}>
   <option value="unverified">Not verified</option><option value="worked">Worked</option><option value="partially_worked">Partly worked</option><option value="did_not_work">Did not work</option>
  </select></label>
  <button className="button">{entry?"Save changes":"Add repair lesson"}</button>
 </form>;
}
