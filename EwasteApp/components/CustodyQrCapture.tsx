"use client";
import {useEffect,useRef,useState} from "react";
type DetectorLike={detect(source:HTMLVideoElement):Promise<{rawValue?:string}[]>};
type DetectorConstructor=new(options?:{formats?:string[]})=>DetectorLike;
type AssetLabel={id:string;code:string};
export function CustodyQrCapture({name,label,assets,multiple=false,required=false}:{
 name:string;label:string;assets:AssetLabel[];multiple?:boolean;required?:boolean;
}){
 const [value,setValue]=useState("");
 const [message,setMessage]=useState("");
 const [active,setActive]=useState(false);
 const ref=useRef<HTMLVideoElement>(null);
 const stream=useRef<MediaStream|null>(null);
 const timer=useRef<number|null>(null);
 const scanSeen=useRef<Set<string>>(new Set());
 const stop=()=>{
  if(timer.current!==null)window.clearTimeout(timer.current);
  timer.current=null;stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;
  if(ref.current)ref.current.srcObject=null;setActive(false);
 };
 useEffect(()=>()=>{if(timer.current!==null)window.clearTimeout(timer.current);stream.current?.getTracks().forEach(t=>t.stop());},[]);
 const canonical=(raw:string)=>{
  const v=raw.trim();
  if(!v)return "";
  const byCode=assets.find(a=>a.code.toLowerCase()===v.replace(/^AF:/i,"").toLowerCase());
  if(byCode)return byCode.code;
  try{
   const u=new URL(v);
   // Existing AssetFlow QR labels contain /assets/<asset UUID>.
   const match=u.pathname.match(/^\/assets\/([0-9a-f-]{36})\/?$/i);
   if(match){
    const byId=assets.find(a=>a.id.toLowerCase()===match[1].toLowerCase());
    if(byId)return byId.code;
   }
  }catch{}
  return v;
 };
 const accept=(raw:string)=>{
  const decoded=canonical(raw);
  if(!decoded)return;
  const known=assets.some(a=>a.code.toLowerCase()===decoded.toLowerCase());
  if(!known){setMessage("This QR label does not match an asset in the selected Council pilot.");return;}
  if(multiple){
    if(scanSeen.current.has(decoded))return;
    scanSeen.current.add(decoded);
    setValue(v=>[...new Set([...v.split(/\s*\n\s*/).filter(Boolean),decoded])].join("\n"));
    setMessage("Recorded "+decoded+". Scan the next physical item.");
  }else{setValue(decoded);setMessage("QR verified: "+decoded);stop();}
 };
 const start=async()=>{
  setMessage("");
  const Detector=(window as Window&{BarcodeDetector?:DetectorConstructor}).BarcodeDetector;
  if(!Detector||!navigator.mediaDevices?.getUserMedia){
   setMessage("Camera scanner unavailable in this browser. Type the printed asset code or use a USB/Bluetooth scanner.");
   return;
  }
  try{
   const d=new Detector({formats:["qr_code"]});
   const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});
   stream.current=media;
   const video=ref.current;if(!video){media.getTracks().forEach(t=>t.stop());return;}
   video.srcObject=media;await video.play();setActive(true);
   const tick=async()=>{
    if(!stream.current||!ref.current)return;
    try{
     const items=await d.detect(ref.current);
     const qr=items.find(i=>i.rawValue)?.rawValue;
     if(qr)accept(qr);
    }catch{}
    if(stream.current)timer.current=window.setTimeout(tick,250);
   };
   tick();
  }catch(e){
   stop();
   setMessage(e instanceof DOMException&&e.name==="NotAllowedError"?
    "Camera permission denied; enable camera access for AssetFlow.":"Unable to start camera. Manual scan is available.");
  }
 };
 return <div className="stack">
  <label>{label}{multiple?
   <textarea name={name} value={value} onChange={e=>{setValue(e.target.value);scanSeen.current=new Set(e.target.value.split("\n").map(v=>v.trim()).filter(Boolean));}} rows={3} required={required} placeholder="Scan one QR label per line"/>:
   <input name={name} value={value} onChange={e=>setValue(e.target.value)} required={required} placeholder="Asset code / Bluetooth scanner" autoComplete="off"/>}
  </label>
  <div className="actions">
   {!active?<button className="button secondary" type="button" onClick={start}>Scan QR with camera</button>:
   <button className="button secondary" type="button" onClick={stop}>Stop camera</button>}
   {multiple?<button className="button secondary" type="button" onClick={()=>{setValue("");scanSeen.current.clear();setMessage("");}}>Clear scans</button>:null}
  </div>
  <video ref={ref} playsInline muted aria-label="Custody QR scanner camera" style={{display:active?"block":"none",width:"min(100%,360px)",maxHeight:260,objectFit:"contain"}}/>
  {message?<p className="muted" role="status">{message}</p>:null}
  <p className="muted">QR confirms the *label identifier* only, not physical identity or ownership. Independently compare the device serial and signed documents.</p>
 </div>;
}
