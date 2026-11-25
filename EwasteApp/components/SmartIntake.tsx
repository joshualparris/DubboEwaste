"use client";
import {useEffect,useRef,useState} from "react";
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
  const [autoSave,setAutoSave]=useState(false),[autoCount,setAutoCount]=useState(0);
  const [cameraOpen,setCameraOpen]=useState(false),[cameraStarting,setCameraStarting]=useState(false),[cameraReady,setCameraReady]=useState(false);
  const video=useRef<HTMLVideoElement>(null),stream=useRef<MediaStream|null>(null),cameraInput=useRef<HTMLInputElement>(null),galleryInput=useRef<HTMLInputElement>(null),cameraGeneration=useRef(0),inFlight=useRef(false);
  function stopCamera(){
    cameraGeneration.current++;
    stream.current?.getTracks().forEach(t=>t.stop());
    stream.current=null;
    if(video.current)video.current.srcObject=null;
    setCameraOpen(false);setCameraStarting(false);setCameraReady(false);
  }
  useEffect(()=>{
    function hidden(){if(document.visibilityState==="hidden")stopCamera();}
    document.addEventListener("visibilitychange",hidden);
    return ()=>{document.removeEventListener("visibilitychange",hidden);cameraGeneration.current++;stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;};
  },[]);
  async function openCamera(){
    if(!consent||busy||cameraStarting)return;
    if(!navigator.mediaDevices?.getUserMedia){cameraInput.current?.click();return;}
    const generation=++cameraGeneration.current;
    setError("");setCameraStarting(true);setCameraOpen(true);
    try{
      const next=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:"environment"},width:{ideal:1920},height:{ideal:1080}}});
      if(generation!==cameraGeneration.current){next.getTracks().forEach(t=>t.stop());return;}
      stream.current=next;
      if(!video.current)throw Error("Camera preview unavailable");
      video.current.srcObject=next;
      await video.current.play();
      if(generation===cameraGeneration.current)setCameraReady(true);
    }catch{
      if(generation!==cameraGeneration.current)return;
      stopCamera();
      setError("Live camera unavailable. Try the phone camera button or choose a gallery photo.");
    }finally{if(generation===cameraGeneration.current)setCameraStarting(false);}
  }
  async function shutter(){
    const frame=video.current;
    if(!cameraReady||!frame||!frame.videoWidth||!frame.videoHeight||inFlight.current)return;
    const canvas=document.createElement("canvas");
    const scale=Math.min(1,1800/Math.max(frame.videoWidth,frame.videoHeight));
    canvas.width=Math.round(frame.videoWidth*scale);canvas.height=Math.round(frame.videoHeight*scale);
    const ctx=canvas.getContext("2d");if(!ctx){setError("Could not capture photo.");return;}
    ctx.drawImage(frame,0,0,canvas.width,canvas.height);
    // Lock during asynchronous image encoding so two shutter taps cannot overlap.
    inFlight.current=true;setBusy(true);
    try{
      const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error("Could not encode photo")),"image/jpeg",0.9));
      inFlight.current=false;
      await analyse(new File([blob],"camera-"+Date.now()+".jpg",{type:"image/jpeg"}));
    }catch(e){inFlight.current=false;setBusy(false);setError((e as Error).message);}
  }
  function pickPhoto(event:React.ChangeEvent<HTMLInputElement>){
    const file=event.currentTarget.files?.[0];event.currentTarget.value="";
    if(file&&consent&&!inFlight.current)void analyse(file);
  }
  function append(drafts:Draft[]){
    if(rows.length+drafts.length>80)throw Error("Maximum 80 draft rows per intake.");
    setRows(old=>[...old,...drafts.map(d=>({...d,id:crypto.randomUUID()}))]);setConfirmed(false);
  }
  function update(id:string,patch:Partial<Draft>){setRows(old=>old.map(r=>r.id===id?{...r,...patch}:r));setConfirmed(false);}
  async function analyse(file:File|null=photo){
    if(!consent||inFlight.current||(!file&&!description.trim()))return;
    inFlight.current=true;
    setPhoto(file);
    setBusy(true);setError("");setMessage("");
    try{const image=file?await compress(file):undefined;const result=await call({action:"analyse",image,description:target?("Read the label of this single existing device. "+description):description,consent});if(target){const found=parseDrafts(JSON.stringify(result.rows));if(found.length!==1||found[0].kind!=="asset")throw Error("Label scan must identify one asset. Try a closer photo.");const d=found[0];setRows(old=>old.map(r=>r.id===target?{...r,manufacturer:d.manufacturer||r.manufacturer,model:d.model||r.model,serial:d.serial||r.serial,notes:[r.notes,d.notes].filter(Boolean).join(" ").slice(0,1000)}:r));setConfirmed(false);setTarget(""); }else{
      const found=parseDrafts(JSON.stringify(result.rows));
      const d=found[0];
      if(autoSave&&job&&file&&rows.length<80&&found.length===1&&d.kind==="asset"&&d.category!=="OTHER"&&d.manufacturer&&d.model&&/^[A-Za-z0-9-]{5,80}$/.test(d.serial)){
        const row:Row={...d,id:crypto.randomUUID()};
        // Preserve the same row ID if the response is lost; never rescan automatically.
        setPhoto(null);setDescription("");
        try{
          const saved=await call({action:"import",job,location,confirmed:true,automatic:true,kind:"asset",rows:[row]});
          setAutoCount(n=>n+saved.created);
          setMessage("Saved "+[d.manufacturer,d.model,d.serial].join(" · ")+". Take the next photo."+ (saved.auditWarning?" Audit warning: check inventory before continuing.":""));
          if(saved.auditWarning)setAutoSave(false);
        }catch(e){
          setAutoSave(false);
          if(rows.length<80)setRows(old=>[...old,row]);
          setConfirmed(false);
          setError((e as Error).message+" Automatic saving stopped. Check inventory before manually importing this draft.");
        }
        return;
      }
      append(found);
    }setPhoto(null);setDescription("");setMessage(autoSave?"Photo needs review (multiple items or missing model/serial). Drafts updated.":"Photo analysed. Drafts updated. Take the next photo or review below.");}
    catch(e){setError((e as Error).message);}finally{inFlight.current=false;setBusy(false);}
  }
  async function save(kind:"asset"|"lot"){
    if(inFlight.current)return;
    inFlight.current=true;stopCamera();setBusy(true);setError("");setMessage("");
    const selected=rows.filter(r=>r.kind===kind);
    try{const result=await call({action:"import",job,location,confirmed,kind,rows:selected});setRows(old=>old.filter(r=>r.kind!==kind));setConfirmed(false);setMessage(result.created+" records created."+ (result.auditWarning?" Audit event failed; check the inventory and audit log before continuing.":" Open inventory to print QR labels."));}
    catch(e){setError((e as Error).message+" Check existing inventory before retrying.");}finally{inFlight.current=false;setBusy(false);}
  }
  return <div className="stack">
    <section className="card form"><h2>1. Capture</h2>
      <p className="muted">Take a photo and AI automatically adds drafts. Keep the camera open to scan the next device. Review and confirm once at the end.</p>
      <label><input type="checkbox" checked={consent} disabled={busy} onChange={e=>{setConsent(e.target.checked);if(!e.target.checked){stopCamera();setPhoto(null);setAutoSave(false);}}}/> Allow AI photo processing for this session (external Cloudflare Workers AI (Mistral); only authorised equipment photos, no private documents or screen contents).</label>
      <details open={autoSave}><summary>Automatic inventory registration ({autoCount} saved)</summary>
      <p className="muted">For individual devices, photograph the manufacturer's label clearly. AI will save a provisional HOLD record immediately when one device, model and serial are identified. Mixed or unclear photos remain drafts. No tests or data erasure are confirmed.</p>
      <label>Inbound job<select value={job} disabled={busy} onChange={e=>{setJob(e.target.value);setAutoSave(false);setConfirmed(false);}}><option value="">Select an existing job</option>{jobs.map(j=><option key={j.id} value={j.id}>{j.job_code} · {j.source_site||"Unknown source"}</option>)}</select></label>
      <label>Location<select value={location} disabled={busy} onChange={e=>{setLocation(e.target.value);setAutoSave(false);setConfirmed(false);}}><option value="">Unassigned</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
      <label><input type="checkbox" checked={autoSave} disabled={busy||!job||!consent||!!target||rows.length>=80} onChange={e=>setAutoSave(e.target.checked)}/> I confirm the programme owns this batch (not Council custody or customer repairs) and authorise automatic registration of AI-identified individual devices. Model and serial still require physical verification.</label>
      </details>
      <label>Capture mode<select value={target} disabled={busy} onChange={e=>{setTarget(e.target.value);setAutoSave(false);}}><option value="">Add new equipment</option>{rows.filter(r=>r.kind==="asset").map((r,i)=><option key={r.id} value={r.id}>Update label for asset {i+1} — {[r.manufacturer,r.model,r.category].filter(Boolean).join(" ")}</option>)}</select></label>
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden disabled={busy||!consent} onChange={pickPhoto}/>
      <input ref={galleryInput} type="file" accept="image/*" hidden disabled={busy||!consent} onChange={pickPhoto}/>
      <div className="actions">
        {!cameraOpen?<button className="button" type="button" disabled={!consent||busy} onClick={()=>void openCamera()}>Open live camera</button>:null}
        <button className="button" type="button" disabled={!consent||busy||cameraStarting} onClick={()=>{stopCamera();cameraInput.current?.click();}}>Take photo</button>
        <button className="button secondary" type="button" disabled={!consent||busy||cameraStarting} onClick={()=>{stopCamera();galleryInput.current?.click();}}>Choose photo</button>
      </div>
      <div hidden={!cameraOpen}>
        <video ref={video} playsInline muted autoPlay style={{width:"100%",maxHeight:"50vh",objectFit:"contain",background:"#000",borderRadius:12}} aria-label="Live equipment camera preview"/>
        <div className="actions">
          <button className="button" type="button" disabled={!cameraReady||busy} onClick={()=>void shutter()}>{busy?"Analysing…":"Capture and analyse"}</button>
          <button className="button secondary" type="button" onClick={stopCamera}>Close camera</button>
        </div>
        {cameraStarting?<p role="status">Opening rear camera…</p>:null}
      </div>
      <div aria-live="polite" role="status">{busy?"Analysing photo / saving records…":message||rows.length+" drafts ready"}</div>
      {error?<p className="error" role="alert">{error}</p>:null}
      {photo&&!busy?<div className="actions"><button className="button secondary" type="button" disabled={!consent} onClick={()=>void analyse(photo)}>Retry last photo</button><button className="button secondary" type="button" onClick={()=>setPhoto(null)}>Discard photo</button></div>:null}
      <details><summary>Dictate or type equipment instead</summary><label>Description<textarea value={description} disabled={busy} onChange={e=>setDescription(e.target.value)} maxLength={4000} placeholder="Three Dell laptops, two monitors and a tub of cables…"/></label><button className="button" type="button" disabled={busy||!consent||!description.trim()} onClick={()=>void analyse(null)}>Analyse description</button></details>
      <details><summary>Use ChatGPT or another AI instead (no gateway required)</summary><p>Ask your AI to analyse an authorised photo with this prompt, then paste its JSON below.</p><button className="button secondary" type="button" onClick={async()=>{try{await navigator.clipboard.writeText(prompt);setMessage("Prompt copied.");}catch{setError("Could not copy. Select the prompt below.");}}}>Copy prompt</button><pre style={{whiteSpace:"pre-wrap"}}>{prompt}</pre><label>JSON inventory<textarea value={paste} onChange={e=>setPaste(e.target.value)}/></label><button className="button secondary" type="button" disabled={busy} onClick={()=>{try{append(parseDrafts(paste));setPaste("");setError("");}catch{setError("Invalid JSON or too many rows. Use the provided prompt.");}}}>Add JSON drafts</button></details>
    </section>
    <fieldset disabled={busy} style={{border:0,padding:0,margin:0,minWidth:0}}><section className="card form"><h2>2. Review {rows.length} draft rows</h2><p className="muted">Each asset row is one physical device. Use a bulk lot for cables or an uncounted pile. Unknown model/serial is fine. Never import overlapping views twice. Photos are not retained by AssetFlow.</p>
      {rows.map((r,i)=><div key={r.id} className="card form"><strong>Draft {i+1}</strong><label>Type<select value={r.kind} onChange={e=>update(r.id,{kind:e.target.value as Draft["kind"]})}><option value="asset">Individual asset</option><option value="lot">Bulk lot</option></select></label>{r.kind==="asset"?<><label>Category<select value={r.category} onChange={e=>update(r.id,{category:e.target.value as Draft["category"]})}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><div className="two"><label>Manufacturer<input value={r.manufacturer} maxLength={100} onChange={e=>update(r.id,{manufacturer:e.target.value})}/></label><label>Model<input value={r.model} maxLength={160} onChange={e=>update(r.id,{model:e.target.value})}/></label></div><label>Serial / IMEI (verify label)<input value={r.serial} maxLength={160} onChange={e=>update(r.id,{serial:e.target.value})}/></label></>:<><label>Commodity<input value={r.commodity} maxLength={200} onChange={e=>update(r.id,{commodity:e.target.value})}/></label><label>Verified item count (blank if unknown)<input type="number" min="1" max="500" value={r.count??""} onChange={e=>update(r.id,{count:e.target.value?Number(e.target.value):null})}/></label></>}<label>Observations<textarea value={r.notes} maxLength={1000} onChange={e=>update(r.id,{notes:e.target.value})}/></label><button className="button secondary" type="button" disabled={busy} onClick={()=>{setRows(old=>old.filter(x=>x.id!==r.id));setConfirmed(false);}}>Remove draft</button></div>)}
      <button className="button secondary" type="button" disabled={busy||rows.length>=80} onClick={()=>append([emptyDraft])}>Add missing item</button>
    </section>
    <section className="card form"><h2>3. Confirm custody and import</h2><label>Inbound job<select value={job} onChange={e=>{setJob(e.target.value);setAutoSave(false);setConfirmed(false);}}><option value="">Select an existing job</option>{jobs.map(j=><option key={j.id} value={j.id}>{j.job_code} · {j.source_site||"Unknown source"}</option>)}</select></label><label>Location<select value={location} onChange={e=>{setLocation(e.target.value);setAutoSave(false);setConfirmed(false);}}><option value="">Unassigned</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
      <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> I have checked these rows, quantities and serials, confirmed the programme owns this equipment, and removed duplicates. This is not Council custody or a customer repair.</label>
      <p>All assets start in HOLD / UNWIPED_RESTRICTED. AI never verifies erasure or tests.</p><div className="actions">{(["asset","lot"] as const).map(kind=><button className="button" type="button" key={kind} disabled={busy||!job||!confirmed||!rows.some(r=>r.kind===kind)} onClick={()=>save(kind)}>Import {rows.filter(r=>r.kind===kind).length} {kind==="asset"?"assets":"lots"}</button>)}</div>
    </section>
    </fieldset>
    {message?<p className="success" role="status">{message}</p>:null}
  </div>;
}
