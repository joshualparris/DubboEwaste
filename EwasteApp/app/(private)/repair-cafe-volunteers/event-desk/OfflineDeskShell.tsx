"use client";
import {useCallback,useEffect,useRef,useState,type FormEvent,type ReactNode} from "react";
import {createClient} from "@/lib/supabase/browser";
import {
 getWorkspaceState,openTrustedWorkspace,migrateLegacyWorkspace,
 readOperations,writeOperation,updateOperationState,
 dropOperation,registerOfflineEvent,writeOfflineSnapshot,
 type OfflineOperation,type OfflineKind,type OfflineWorkspaceState
} from "./offline-store";
import styles from "./event-desk.module.css";

const fields:Record<OfflineKind,string[]>={
 check_in:["visitor_name","category","item","fault","risk","risk_notes"],
 queue_notes:["ticket_id","revision","reported_problem","queue_notes"],
 ticket_update:["ticket_id","revision","status","station_id","outcome","barrier",
  "note","advice","parts","risk","risk_notes","progress_code"]
};
function asPayload(form:FormData,kind:OfflineKind):Record<string,string|boolean>{
 const p:Record<string,string|boolean>={};
 for(const field of fields[kind])p[field]=String(form.get(field)||"").trim();
 if(kind==="check_in"){
  p.acknowledged=form.get("acknowledged")==="yes";
  p.screened=form.get("screened")==="yes";
 }
 return p;
}
function operationLabel(op:OfflineOperation){
 if(op.kind==="check_in")return "New item: "+String(op.payload.visitor_name||"Visitor")+
  " · "+String(op.payload.item||"");
 if(op.kind==="queue_notes")return "Queue notes · ticket "+String(op.payload.ticket_id).slice(0,8);
 return "Repair update · "+String(op.payload.status||"")+
  " · ticket "+String(op.payload.ticket_id).slice(0,8);
}
function messageFor(e:unknown){return e instanceof Error?e.message:"Offline storage failed"}
const conflictPattern=/changed on another|revision|closed|not found|ticket is|no longer|not open|not permitted|can't|cannot|outcome|risk|unsafe|cancelled|conflict/i;

export default function OfflineDeskShell({eventId,ownerId,initialTickets,initialStations,children}:{
 eventId:string;ownerId:string;initialTickets:unknown[];initialStations:unknown[];children:ReactNode;
}){
 const [phrase,setPhrase]=useState("");
 const [workspaceState,setWorkspaceState]=useState<OfflineWorkspaceState|null>(null);
 const [ready,setReady]=useState(false);
 const [online,setOnline]=useState(true);
 const [forceOffline,setForceOffline]=useState(false);
 const [operations,setOperations]=useState<OfflineOperation[]>([]);
 const [busy,setBusy]=useState(false);
 const [syncing,setSyncing]=useState(false);
 const [notice,setNotice]=useState("");
 const [error,setError]=useState("");
 const keyRef=useRef<CryptoKey|null>(null);
 const opsRef=useRef<OfflineOperation[]>([]);
 const lockRef=useRef(false);
 const submitLock=useRef(false);
 const refresh=useCallback(async()=>{
  if(!keyRef.current)return;
  const all=await readOperations(ownerId,keyRef.current);
  opsRef.current=all;
  setOperations(all);
 },[ownerId]);
 useEffect(()=>{
  setOnline(navigator.onLine);
  let current=true;
  void getWorkspaceState(ownerId).then(mode=>{if(current)setWorkspaceState(mode)})
   .catch(e=>{if(current)setError(messageFor(e))});
  const up=()=>setOnline(true),down=()=>setOnline(false);
  window.addEventListener("online",up);window.addEventListener("offline",down);
  // The user's online account is the authorisation boundary. Lock in-memory
  // keys and sensitive pending notes on sign-out, even though this trusted
  // browser deliberately keeps a key on disk for offline restart.
  const client=createClient();
  const {data:{subscription}}=client.auth.onAuthStateChange((event,session)=>{
   if(event==="SIGNED_OUT"||(session?.user&&session.user.id!==ownerId)){
    keyRef.current=null;opsRef.current=[];setOperations([]);
    setReady(false);setWorkspaceState(null);setNotice("Signed out. Sign in with the same volunteer account to continue.");
   }
  });
  return ()=>{
   current=false;
   subscription.unsubscribe();
   window.removeEventListener("online",up);window.removeEventListener("offline",down);
   keyRef.current=null;opsRef.current=[];
  };
 },[ownerId]);

 const sync=useCallback(async()=>{
  if(!keyRef.current||lockRef.current||forceOffline||!navigator.onLine)return;
  lockRef.current=true;setSyncing(true);setError("");
  try{
   const db=createClient();
   const {data:{user},error:sessionError}=await db.auth.getUser();
   if(sessionError||!user||user.id!==ownerId){
    setError("Sign in as the same volunteer before synchronising saved work.");
    return;
   }
   const all=await readOperations(ownerId,keyRef.current);
   for(const item of all){
    if(item.status!=="pending")continue;
    if(!navigator.onLine)break;
    const {error:sendError}=await db.rpc("repair_cafe_apply_offline_operation",{
     p_operation_id:item.id,p_event_id:item.eventId,p_kind:item.kind,p_payload:item.payload
    });
    if(sendError){
     const description=sendError.message||"Unable to synchronise";
     if(/Failed to fetch|network|fetch failed|timeout/i.test(description)||!navigator.onLine){
      setNotice("Connection lost. The encrypted work remains saved on this device.");
      break;
     }
     const status=conflictPattern.test(description)?"conflict":"blocked";
     await updateOperationState(ownerId,item.id,status,description);
     setNotice("A saved change needs review. Nothing was overwritten.");
     continue;
    }
    await dropOperation(ownerId,item.id);
    setNotice("Saved work synchronised successfully. No duplicate tickets were created.");
    window.dispatchEvent(new CustomEvent("repair-cafe-offline-synced",{detail:{eventId:item.eventId}}));
   }
   await refresh();
  }catch(e){setError(messageFor(e)+" · Saved work was not discarded.");}
  finally{lockRef.current=false;setSyncing(false)}
 },[ownerId,refresh,forceOffline]);
 useEffect(()=>{
  if(ready&&online&&!forceOffline)void sync();
 },[ready,online,forceOffline,sync]);
 useEffect(()=>{
  if(!ready||!keyRef.current)return;
  const onSnapshot=(event:Event)=>{
   const detail=(event as CustomEvent<{eventId:string;tickets:unknown[];stations:unknown[]}>).detail;
   if(!detail||detail.eventId!==eventId||!keyRef.current)return;
   void writeOfflineSnapshot(ownerId,eventId,keyRef.current,{
    tickets:detail.tickets,stations:detail.stations
   }).catch(e=>setError("Unable to update offline snapshot: "+messageFor(e)));
  };
  window.addEventListener("repair-cafe-snapshot",onSnapshot);
  return ()=>window.removeEventListener("repair-cafe-snapshot",onSnapshot);
 },[ready,eventId,ownerId]);
 useEffect(()=>{
  if(!ready)return;
  const onFocus=()=>{if(navigator.onLine)void sync()};
  const interval=setInterval(()=>{if(document.visibilityState==="visible")void sync()},30000);
  window.addEventListener("focus",onFocus);
  return ()=>{clearInterval(interval);window.removeEventListener("focus",onFocus)};
 },[ready,sync]);

 const prepare=useCallback(async(key:CryptoKey)=>{
  keyRef.current=key;
  if(eventId){
   await registerOfflineEvent(ownerId,eventId);
   await writeOfflineSnapshot(ownerId,eventId,key,{
    tickets:initialTickets,stations:initialStations
   });
  }
  if("serviceWorker" in navigator){
   try{await navigator.serviceWorker.register("/repair-cafe-sw.js",{scope:"/"});}
   catch{setNotice("Offline saves work, but reopening the page without internet may be unavailable in this browser.");}
  }
  await refresh();
  setReady(true);
 },[ownerId,eventId,initialTickets,initialStations,refresh]);
 const enable=async()=>{
  setBusy(true);setError("");
  try{
   // A legacy passphrase is requested only once when old unsynchronised work
   // actually exists. Never overwrite it to remove the prompt.
   const key=workspaceState==="legacy"?
    await migrateLegacyWorkspace(ownerId,phrase):
    await openTrustedWorkspace(ownerId);
   await prepare(key);
   setWorkspaceState("trusted");setPhrase("");
   setNotice(workspaceState==="legacy"?
    "Existing offline records safely migrated. Future visits need no second passphrase.":
    "Offline saving enabled for this trusted device. No additional passphrase required.");
  }catch(e){setError(messageFor(e))}
  finally{setBusy(false)}
 };
 // Returning as the same authenticated account opens its local trusted
 // workspace automatically. Never enable a new device without an explicit click.
 useEffect(()=>{
  if(workspaceState!=="trusted"||ready||busy||keyRef.current)return;
  let current=true;
  void openTrustedWorkspace(ownerId).then(async key=>{
   if(!current)return;
   await prepare(key);
  }).catch(e=>{if(current)setError(messageFor(e))});
  return ()=>{current=false};
 },[workspaceState,ownerId,ready,busy,prepare]);

 const submit=async(ev:FormEvent<HTMLDivElement>)=>{
  const form=ev.target;
  if(!(form instanceof HTMLFormElement))return;
  const kind=form.dataset.offlineKind as OfflineKind|undefined;
  // When online with an unlocked vault, route *all* supported forms via the
  // idempotent RPC too: a dropped response must not duplicate a check-in.
  const useOfflineSync=kind&&ready;
  if(!useOfflineSync){
   if(!online||forceOffline){
    ev.preventDefault();
    setError("This action cannot be submitted offline. Enable offline on this trusted device for check-ins, queue notes and ticket updates; other management forms require internet.");
   }
   return;
  }
  ev.preventDefault();
  if(!kind||!(kind in fields))return;
  if(submitLock.current)return;
  submitLock.current=true;setError("");
  try{
   const data=new FormData(form);
   if(String(data.get("event_id")||"")!==eventId)throw Error("Select the same event before saving");
   const payload=asPayload(data,kind);
   if(kind==="check_in"&&(!payload.screened||!payload.acknowledged))
    throw Error("Record both safety screening and the visitor acknowledgement first");
   const ticketId=String(payload.ticket_id||"");
   if(kind!=="check_in"&&opsRef.current.some(x=>x.eventId===eventId&&
    String(x.payload.ticket_id||"")===ticketId))
    throw Error("An edit for this ticket is already saved offline. Synchronise or review that change before adding another.");
   if(kind!=="check_in"&&!payload.revision)throw Error("Original ticket revision is required for safe sync");
   if(!keyRef.current)throw Error("Enable offline on this device first");
   const entry:OfflineOperation={id:crypto.randomUUID(),owner:ownerId,
    eventId,kind,payload,createdAt:Date.now(),status:"pending"};
   await writeOperation(entry,keyRef.current);
   await refresh();
   if(kind==="check_in")form.reset();
   setNotice("Saved and encrypted on this device. "+(online&&!forceOffline?
    "Synchronising now.":"It will synchronise when back online. The queue number is assigned only after syncing."));
   if(online&&!forceOffline)void sync();
  }catch(e){setError(messageFor(e)+". The form has not been cleared.");}
  finally{submitLock.current=false}
 };
 const discard=async(item:OfflineOperation)=>{
  if(!confirm("Discard this encrypted unsynchronised operation? This cannot be undone. Download a backup first if you may need these notes."))return;
  try{await dropOperation(ownerId,item.id);await refresh();setNotice("Local operation discarded. The server was not changed.")}
  catch(e){setError(messageFor(e))}
 };
 const retry=async(item:OfflineOperation)=>{
  try{
   await updateOperationState(ownerId,item.id,"pending","");
   await refresh();setNotice("Marked for retry. Review current server details before overwriting anything.");
   if(online&&!forceOffline)void sync();
  }catch(e){setError(messageFor(e))}
 };
 return <div onSubmitCapture={e=>{void submit(e)}} className={styles.offlineShell}>
  <section className={styles.offlinePanel} aria-label="Offline event workspace">
   <div className={styles.offlineTitle}>
    <strong>Offline Event Desk</strong>
    <span>{!online?"No internet":forceOffline?"Save locally mode":ready?"Encrypted local storage ready":"Not enabled"}</span>
   </div>
   <p className={styles.hint}>Enable before the event to protect check-ins, queue notes and repair updates if Wi-Fi drops. Saved items are <strong>not on the shared queue</strong> until synchronised.</p>
   {!ready?<div className={styles.offlineSetup}>
    {workspaceState==="legacy"?<>
     <label>One-time recovery of existing encrypted work
      <input type="password" value={phrase} onChange={e=>setPhrase(e.target.value)}
       autoComplete="off" placeholder="Your previous offline passphrase" minLength={12}/>
     </label>
     <p className={styles.hint}>This device contains older offline records.
      Enter the previous passphrase <strong>once</strong> to migrate them without losing work.
      After migration, it won't be requested again.</p>
    </>:<p className={styles.hint}>Use only a trusted, screen-locked volunteer device.
      Anyone using this browser profile could read its locally saved information.
      You will still need your normal volunteer login when syncing.</p>}
    <button className="button secondary" type="button"
     disabled={busy||workspaceState===null||(workspaceState==="legacy"&&phrase.length<12)}
     onClick={()=>{void enable()}}>
     {busy?"Preparing…":workspaceState==="legacy"?"Migrate existing offline work":
      workspaceState==="trusted"?"Opening trusted offline storage":"Enable offline on this device"}
    </button>
   </div>:<div className={styles.offlineActions}>
    <label><input type="checkbox" checked={forceOffline} onChange={e=>setForceOffline(e.target.checked)}/> Save locally for offline rehearsal</label>
    <button className="button secondary" type="button" disabled={syncing||!online||forceOffline} onClick={()=>{void sync()}}>
     {syncing?"Synchronising…":"Sync saved work"}
    </button>
    <span className={styles.hint}>This browser stores a non-exportable encryption key. Sync before changing devices.</span>
   </div>}
   {notice?<p role="status" className={styles.offlineNotice}>{notice}</p>:null}
   {error?<p role="alert" className={styles.warning}>{error}</p>:null}
   {ready?<div className={styles.offlineOutbox}>
    <strong>{operations.length} unsynchronised item(s) {operations.some(x=>x.status==="conflict")?" · Conflicts need review":""}</strong>
    {operations.filter(x=>x.eventId!==eventId).length?<p className={styles.hint}>Saved items from other events are also kept and synchronised with their original event IDs.</p>:null}
    {operations.map(item=><div key={item.id} className={styles.offlineEntry}>
     <div><strong>{operationLabel(item)}</strong>
      <small> {new Date(item.createdAt).toLocaleString("en-AU")} · {item.status==="pending"?"Waiting to sync":item.status==="conflict"?"CONFLICT · Needs review":"Could not sync"}</small>
      {item.error?<p className={styles.warning}>{item.error}</p>:null}
      {item.status==="conflict"?<p className={styles.hint}>The server may have newer information. Compare the ticket with these saved notes before retrying; retries never bypass the revision check. Copy needed text before discarding.</p>:null}
      {item.status!=="pending"?<details><summary>Review my saved values</summary><pre className={styles.offlinePayload}>{JSON.stringify(item.payload,null,2)}</pre></details>:null}
     </div>
     <div className={styles.offlineButtons}>
      {item.status!=="pending"?<button type="button" className="button secondary" onClick={()=>{void retry(item)}}>Retry unchanged</button>:null}
      <button type="button" className="button secondary" onClick={()=>{void discard(item)}}>Discard</button>
     </div>
    </div>)}
   </div>:null}
  </section>
  {children}
 </div>;
}
