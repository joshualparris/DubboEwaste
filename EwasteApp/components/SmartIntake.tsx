"use client";
import {useState} from "react";
import {categories,emptyDraft,parseDrafts,prompt,type Draft,type Row} from "@/lib/smart-intake";

async function compress(file:File){
  const url=URL.createObjectURL(file);
  try{
    const image=new Image(); image.src=url;await image.decode();
    const scale=Math.min(1,1800/Math.max(image.width,image.height));
    const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
    const ctx=canvas.getContext("2d");if(!ctx)throw Error("Photo conversion unavailable");
    ctx.drawImage(image,0,0,canvas.width,canvas.height);
    let data=canvas.toDataURL("image/jpeg",0.84);
    if(data.length>2_900_000)data=canvas.toDataURL("image/jpeg",0.6);
    if(data.length>2_900_000)throw Error("Photo too large. Crop it first.");
    return data;
  }finally{URL.revokeObjectURL(url);}
}
async function call(payload:unknown){
  const response=await fetch("/api/smart-intake",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const body=await response.json();if(!response.ok)throw Error(body.error||"Request failed");return body;
}
export function SmartIntake({jobs,locations,initialJob}:{jobs:{id:string;job_code:string;source_site:string|null}[];locations:{id:string;name:string}[];initialJob:string}){
  const [job,setJob]=useState(initialJob),[location,setLocation]=useState(""),[description,setDescription]=useState(""),[photo,setPhoto]=useState<File|null>(null),[target,setTarget]=useState(""),[consent,setConsent]=useState(false),[confirmed,setConfirmed]=useState(false),[rows,setRows]=useState<Row[]>([]),[paste,setPaste]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState("");
  function append(drafts:Draft[]){
    if(rows.length+drafts.length>80)throw Error("Maximum 80 draft rows per intake.");
    setRows(old=>[...old,...drafts.map(d=>({...d,id:crypto.randomUUID()}))]);setConfirmed(false);
  }
  function update(id:string,patch:Partial<Draft>){setRows(old=>old.map(r=>r.id===id?{...r,...patch}:r));setConfirmed(false);}
  async function analyse(){
    setBusy(true);setError("");setMessage("");
    try{const image=photo?await compress(photo):undefined;const result=await call({action:"analyse",image,description:target?("Read the label of this single existing device. "+description):description,consent});if(target){const found=parseDrafts(JSON.stringify(result.rows));if(found.length!==1||found[0].kind!=="asset")throw Error("Label scan must identify one asset. Try a closer photo.");const d=found[0];setRows(old=>old.map(r=>r.id===target?{...r,manufacturer:d.manufacturer||r.manufacturer,model:d.model||r.model,serial:d.serial||r.serial,notes:[r.notes,d.notes].filter(Boolean).join(" ").slice(0,1000)}:r));setConfirmed(false);setTarget("");}else{append(result.rows);}setPhoto(null);setDescription("");setMessage("Review updated drafts. Verify each device; do not add overlapping photos twice.");}
    catch(e){setError((e as Error).message);}finally{setBusy(false);}
  }
  async function save(kind:"asset"|"lot"){
    setBusy(true);setError("");setMessage("");
    const selected=rows.filter(r=>r.kind===kind);
    try{const result=await call({action:"import",job,location,confirmed,kind,rows:selected});setRows(old=>old.filter(r=>r.kind!==kind));setConfirmed(false);setMessage(result.created+" records created."+ (result.auditWarning?" Audit event failed; check the inventory and audit log before continuing.":" Open inventory to print QR labels."));}
    catch(e){setError((e as Error).message+" Check existing inventory before retrying.");}finally{setBusy(false);}
  }
  return <div className="stack">
    <section className="card form"><h2>1. Capture</h2>
      <label>Capture mode<select value={target} disabled={busy} onChange={e=>setTarget(e.target.value)}><option value="">Add new equipment</option>{rows.filter(r=>r.kind==="asset").map((r,i)=><option key={r.id} value={r.id}>Update label for asset {i+1} — {[r.manufacturer,r.model,r.category].filter(Boolean).join(" ")}</option>)}</select></label><label>Photo (one haul or individual label)<input type="file" accept="image/*" disabled={busy} onChange={e=>setPhoto(e.target.files?.[0]||null)}/></label>
      {photo?<p>{photo.name}</p>:null}
      <label>Description (use your phone keyboard microphone to dictate)<textarea value={description} onChange={e=>setDescription(e.target.value)} maxLength={4000} placeholder="Three Dell laptops, two monitors and a tub of cables…"/></label>
      <label><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> I have authority to send this image/description to the external AI provider (Vercel AI Gateway). No personal documents, private screen contents or unauthorised identifiers.</label>
      <button className="button" type="button" disabled={busy||!consent||(!photo&&!description.trim())} onClick={analyse}>{busy?"Working…":"Analyse and add drafts"}</button>
      <details><summary>Use ChatGPT or another AI instead (no gateway required)</summary><p>Ask your AI to analyse an authorised photo with this prompt, then paste its JSON below.</p><button className="button secondary" type="button" onClick={async()=>{try{await navigator.clipboard.writeText(prompt);setMessage("Prompt copied.");}catch{setError("Could not copy. Select the prompt below.");}}}>Copy prompt</button><pre style={{whiteSpace:"pre-wrap"}}>{prompt}</pre><label>JSON inventory<textarea value={paste} onChange={e=>setPaste(e.target.value)}/></label><button className="button secondary" type="button" disabled={busy} onClick={()=>{try{append(parseDrafts(paste));setPaste("");setError("");}catch{setError("Invalid JSON or too many rows. Use the provided prompt.");}}}>Add JSON drafts</button></details>
    </section>
    <section className="card form"><h2>2. Review {rows.length} draft rows</h2><p className="muted">Each asset row is one physical device. Use a bulk lot for cables or an uncounted pile. Unknown model/serial is fine. Never import overlapping views twice. Photos are not retained by AssetFlow.</p>
      {rows.map((r,i)=><div key={r.id} className="card form"><strong>Draft {i+1}</strong><label>Type<select value={r.kind} onChange={e=>update(r.id,{kind:e.target.value as Draft["kind"]})}><option value="asset">Individual asset</option><option value="lot">Bulk lot</option></select></label>{r.kind==="asset"?<><label>Category<select value={r.category} onChange={e=>update(r.id,{category:e.target.value as Draft["category"]})}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><div className="two"><label>Manufacturer<input value={r.manufacturer} maxLength={100} onChange={e=>update(r.id,{manufacturer:e.target.value})}/></label><label>Model<input value={r.model} maxLength={160} onChange={e=>update(r.id,{model:e.target.value})}/></label></div><label>Serial / IMEI (verify label)<input value={r.serial} maxLength={160} onChange={e=>update(r.id,{serial:e.target.value})}/></label></>:<><label>Commodity<input value={r.commodity} maxLength={200} onChange={e=>update(r.id,{commodity:e.target.value})}/></label><label>Verified item count (blank if unknown)<input type="number" min="1" max="500" value={r.count??""} onChange={e=>update(r.id,{count:e.target.value?Number(e.target.value):null})}/></label></>}<label>Observations<textarea value={r.notes} maxLength={1000} onChange={e=>update(r.id,{notes:e.target.value})}/></label><button className="button secondary" type="button" disabled={busy} onClick={()=>{setRows(old=>old.filter(x=>x.id!==r.id));setConfirmed(false);}}>Remove draft</button></div>)}
      <button className="button secondary" type="button" disabled={busy||rows.length>=80} onClick={()=>append([emptyDraft])}>Add missing item</button>
    </section>
    <section className="card form"><h2>3. Confirm custody and import</h2><label>Inbound job<select value={job} onChange={e=>{setJob(e.target.value);setConfirmed(false);}}><option value="">Select an existing job</option>{jobs.map(j=><option key={j.id} value={j.id}>{j.job_code} · {j.source_site||"Unknown source"}</option>)}</select></label><label>Location<select value={location} onChange={e=>{setLocation(e.target.value);setConfirmed(false);}}><option value="">Unassigned</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
      <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> I have checked these rows, quantities and serials, confirmed the programme owns this equipment, and removed duplicates. This is not Council custody or a customer repair.</label>
      <p>All assets start in HOLD / UNWIPED_RESTRICTED. AI never verifies erasure or tests.</p><div className="actions">{(["asset","lot"] as const).map(kind=><button className="button" type="button" key={kind} disabled={busy||!job||!confirmed||!rows.some(r=>r.kind===kind)} onClick={()=>save(kind)}>Import {rows.filter(r=>r.kind===kind).length} {kind==="asset"?"assets":"lots"}</button>)}</div>
    </section>
    {error?<p className="error" role="alert">{error}</p>:null}{message?<p className="success" role="status">{message}</p>:null}
  </div>;
}
