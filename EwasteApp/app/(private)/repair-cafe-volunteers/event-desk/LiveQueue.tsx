"use client";

import {useCallback,useEffect,useMemo,useRef,useState} from "react";
import {createClient} from "@/lib/supabase/browser";
import Link from "next/link";
import {saveRepairTicket} from "./actions";
import ProgressOutcomeFields,{progressChoices} from "./ProgressOutcomeFields";
import WaitingQueueNotes from "./WaitingQueueNotes";
import styles from "./event-desk.module.css";

export type LiveTicket={
 id:string;event_id:string;ticket_number:number;visitor_display_name:string;item_category:string;
 item_description:string;reported_problem:string;queue_notes:string;risk_level:string;risk_notes:string;
 status:string;outcome:string|null;progress_code:string|null;barrier:string|null;station_id:string|null;
 work_summary:string;parts_used:string;handover_advice:string;
 arrived_at:string;started_at:string|null;closed_at:string|null;updated_at:string;
};
export type LiveStation={id:string;event_id:string;name:string;category:string;location_note:string};
export type LiveActivity={id:string;ticket_id:string;from_status:string|null;to_status:string;note:string;progress_code:string|null;problem_snapshot:string|null;queue_note_snapshot:string|null;created_at:string};

const barriers=[["","Not specified"],["parts","Parts unavailable"],["time","Time / capacity"],
 ["skills","Skills / tools"],["safety","Safety"],["cost","Cost"],
 ["not_repairable","Not repairable"],["other","Other"]];
const pretty=(x:string|null|undefined)=>(x||"—").replaceAll("_"," ").replace(/^./,c=>c.toUpperCase());
const auTime=(s:string)=>new Date(s).toLocaleTimeString("en-AU",{timeZone:"Australia/Sydney",hour:"numeric",minute:"2-digit"});
const columns="id,event_id,ticket_number,visitor_display_name,item_category,item_description,reported_problem,queue_notes,risk_level,risk_notes,status,outcome,progress_code,barrier,station_id,work_summary,parts_used,handover_advice,arrived_at,started_at,closed_at,updated_at";
const stationColumns="id,event_id,name,category,location_note";
const activityColumns="id,ticket_id,from_status,to_status,note,progress_code,problem_snapshot,queue_note_snapshot,created_at";
type Connection="connecting"|"live"|"reconnecting"|"offline"|"restricted";
type View="queue"|"stations"|"closed"|"all";
type Props={
 eventId:string;active:boolean;canManage:boolean;
 initialTickets:LiveTicket[];initialStations:LiveStation[];initialActivities:LiveActivity[];
};

export default function LiveQueue({eventId,active,canManage,initialTickets,initialStations,initialActivities}:Props){
 const [tickets,setTickets]=useState(initialTickets);
 const [stations,setStations]=useState(initialStations);
 const [activities,setActivities]=useState(initialActivities);
 const [connection,setConnection]=useState<Connection>("connecting");
 const [warning,setWarning]=useState("");
 const [lastUpdated,setLastUpdated]=useState<number|null>(null);
 const [view,setView]=useState<View>("queue");
 const [editing,setEditing]=useState<{id:string;revision:string}|null>(null);
 const [refreshing,setRefreshing]=useState(false);
 const syncRef=useRef<(()=>Promise<void>)|null>(null);
 const requestSync=useCallback(()=>{void syncRef.current?.()},[]);
 // On changing events, replace the snapshot immediately; the effect below also
 // creates a new subscription and cancels work from the previous event.
 useEffect(()=>{
  setTickets(initialTickets);
  setStations(initialStations);
  setActivities(initialActivities);
  setConnection("connecting");
  setWarning("");
  setLastUpdated(null);
  setEditing(null);
  setView("queue");
 },[eventId,initialTickets,initialStations,initialActivities]);

 useEffect(()=>{
  let disposed=false,job:ReturnType<typeof setTimeout>|null=null;
  let inflight=false,repeat=false;
  const db=createClient();
  const sync=async()=>{
   if(disposed){return;}
   if(inflight){repeat=true;return;}
   inflight=true;setRefreshing(true);
   try{
    const [t,s]=await Promise.all([
     db.from("repair_cafe_tickets").select(columns).eq("event_id",eventId)
      .order("ticket_number",{ascending:false}).limit(500),
     db.from("repair_cafe_stations").select(stationColumns).eq("event_id",eventId)
      .order("name").limit(100)
    ]);
    if(t.error||s.error)throw Error(t.error?.message||s.error?.message||"Queue data could not be read");
    const nextTickets=(t.data??[]) as LiveTicket[];
    const ids=nextTickets.map(x=>x.id);
    let nextActivities:LiveActivity[]=[];
    if(ids.length){
     const a=await db.from("repair_cafe_ticket_activity").select(activityColumns)
      .in("ticket_id",ids).order("created_at",{ascending:false}).limit(1500);
     if(a.error)throw Error(a.error.message);
     nextActivities=(a.data??[]) as LiveActivity[];
    }
    if(disposed)return;
    setTickets(nextTickets);
    setStations((s.data??[]) as LiveStation[]);
    setActivities(nextActivities);
    window.dispatchEvent(new CustomEvent("repair-cafe-snapshot",{
     detail:{eventId,tickets:nextTickets,stations:(s.data??[])}
    }));
    setLastUpdated(Date.now());
    setWarning("");
   }catch(e){
    if(!disposed){setWarning(e instanceof Error?e.message:"Live queue couldn't sync");}
   }finally{
    inflight=false;
    if(!disposed)setRefreshing(false);
    if(repeat&&!disposed){repeat=false;void sync();}
   }
  };
  const schedule=()=>{
   if(disposed)return;
   if(job)clearTimeout(job);
   job=setTimeout(()=>{job=null;void sync()},300);
  };
  syncRef.current=sync;
  // Supabase Postgres Changes checks read permission using ticket/station RLS.
  // Scope events in the replication filter, never subscribe to all programmes.
  const channel=db.channel("repair-cafe-live-"+eventId+"-"+Math.random().toString(36).slice(2))
   .on("postgres_changes",{event:"*",schema:"public",table:"repair_cafe_tickets",
      filter:"event_id=eq."+eventId},schedule)
   .on("postgres_changes",{event:"*",schema:"public",table:"repair_cafe_stations",
      filter:"event_id=eq."+eventId},schedule)
   .subscribe(status=>{
    if(disposed)return;
    if(status==="SUBSCRIBED"){setConnection("live");schedule();}
    else if(status==="CHANNEL_ERROR"||status==="TIMED_OUT"||status==="CLOSED"){
     setConnection(navigator.onLine?"reconnecting":"offline");
    }
   });
  const onOnline=()=>{setConnection("reconnecting");void sync()};
  const onOffline=()=>setConnection("offline");
  const onVisible=()=>{if(document.visibilityState==="visible")void sync()};
  const offlineSynced=(e:Event)=>{
   const message=e as CustomEvent<{eventId:string}>;
   if(message.detail?.eventId===eventId)void sync();
  };
  window.addEventListener("online",onOnline);
  window.addEventListener("offline",onOffline);
  window.addEventListener("repair-cafe-offline-synced",offlineSynced);
  document.addEventListener("visibilitychange",onVisible);
  // Poll as a safety net for short-lived disconnections / missed messages.
  // Keeps the queue usable even when the realtime WebSocket is unavailable.
  const interval=setInterval(()=>{
   if(!disposed&&document.visibilityState==="visible"&&navigator.onLine)void sync();
  },30000);
  void sync();
  return ()=>{
   disposed=true;
   if(job)clearTimeout(job);
   clearInterval(interval);
   window.removeEventListener("online",onOnline);
   window.removeEventListener("offline",onOffline);
   window.removeEventListener("repair-cafe-offline-synced",offlineSynced);
   document.removeEventListener("visibilitychange",onVisible);
   syncRef.current=null;
   void db.removeChannel(channel);
  };
 },[eventId]);

 const count=useCallback((s:string)=>tickets.filter(t=>t.status===s).length,[tickets]);
 const outcomes=useMemo(()=>({
  fixed:tickets.filter(t=>t.outcome==="fixed").length,
  partial:tickets.filter(t=>t.outcome==="partially_fixed").length,
  unsuccessful:tickets.filter(t=>t.outcome==="not_fixed").length,
  referred:count("referred"),notAttempted:count("not_attempted")
 }),[tickets,count]);
 const waiting=useMemo(()=>tickets.filter(t=>t.status==="waiting")
  .sort((a,b)=>a.ticket_number-b.ticket_number),[tickets]);
 const repairing=useMemo(()=>tickets.filter(t=>t.status==="in_progress")
  .sort((a,b)=>a.ticket_number-b.ticket_number),[tickets]);
 // Station assignment and starting work are independent. An assigned ticket
 // can remain Waiting until its volunteer actually begins the repair.
 const atStations=useMemo(()=>tickets.filter(t=>t.station_id!==null&&
  ["waiting","in_progress"].includes(t.status))
  .sort((a,b)=>a.ticket_number-b.ticket_number),[tickets]);
 const closed=useMemo(()=>tickets.filter(t=>["completed","referred","not_attempted","void"].includes(t.status))
  .sort((a,b)=>b.ticket_number-a.ticket_number),[tickets]);
 const displayed=view==="queue"?[...waiting,...repairing]:
  view==="closed"?closed:view==="stations"?atStations:[...waiting,...repairing,...closed];
 const statusLabel=connection==="live"?"Live updates connected":
  connection==="connecting"?"Connecting to live updates":
  connection==="offline"?"Offline · reconnect when online":
  connection==="restricted"?"Permission unavailable":"Reconnecting · checking every 30 seconds";
 const liveNow=lastUpdated?new Date(lastUpdated).toLocaleTimeString("en-AU",
  {hour:"numeric",minute:"2-digit",second:"2-digit",timeZone:"Australia/Sydney"}):"Waiting for first sync";

 return <div className={styles.liveWorkspace}>
  <div className={styles.liveToolbar}>
   <div className={styles.liveStatus} role="status" aria-live="polite">
    <span className={connection==="live"?styles.liveDot:styles.fallbackDot} aria-hidden="true"/>
    <strong>{statusLabel}</strong>
    <span className={styles.hint}>Last checked {liveNow}</span>
   </div>
   <button type="button" className="button secondary" onClick={requestSync} disabled={refreshing}>
    {refreshing?"Checking…":"Sync now"}
   </button>
  </div>
  {warning?<div className={styles.warning} role="alert">
   Could not update the live queue: {warning}. Previously loaded information is shown.
   <button type="button" className="button secondary" onClick={requestSync}>Try again</button>
  </div>:null}

  <section className={styles.stats} aria-label="Live event totals">
   {[
    ["Checked in",tickets.filter(t=>t.status!=="void").length],
    ["Waiting",waiting.length],["At stations",atStations.length],
    ["Fixed",outcomes.fixed],["Partial",outcomes.partial],
    ["Referred",outcomes.referred],["Not fixed",outcomes.unsuccessful],
    ["Not attempted",outcomes.notAttempted]
   ].map(([label,n])=><div className={styles.metric} key={label}>
    <strong>{n}</strong><span>{label}</span>
   </div>)}
  </section>

  <section className={styles.liveBoard}>
   <div className={styles.sectionHeader}>
    <div><h2>Live reception and station board</h2>
     <p className={styles.hint}>Visitor call-outs and station allocations update on all signed-in devices. No page refresh needed.</p></div>
   </div>
   <div className={styles.liveBoardColumns}>
    <div className={styles.liveBoardGroup}>
     <h3>Waiting · {waiting.length}</h3>
     {waiting.length?waiting.map(t=><p key={t.id} className={styles.boardItem}>
      <strong>#{t.ticket_number} · {t.visitor_display_name||"Visitor"}</strong>
      <span>{t.item_description}</span>
      {t.risk_level!=="clear"?<small>Safety: {pretty(t.risk_level)}</small>:null}
     </p>):<p className={styles.hint}>No visitors waiting.</p>}
    </div>
    <div className={styles.liveBoardGroup}>
     <h3>Repair stations · {atStations.length} assigned ({repairing.filter(t=>t.station_id!==null).length} in progress)</h3>
     {stations.length?stations.map(st=><div key={st.id} className={styles.boardStation}>
      <strong>{st.name}</strong>
      {atStations.filter(t=>t.station_id===st.id).map(t=><p key={t.id}>
       #{t.ticket_number} · {t.visitor_display_name||"Visitor"} · {t.item_description}
       {" · "}{t.status==="waiting"?"Assigned, waiting to start":"In progress"}
      </p>)}
      {!atStations.some(t=>t.station_id===st.id)?<span className={styles.hint}>No tickets assigned</span>:null}
     </div>):<p className={styles.hint}>No repair stations added yet.</p>}
     {repairing.filter(t=>!t.station_id).map(t=><p key={t.id} className={styles.warning}>#{t.ticket_number} · In progress, no station assigned</p>)}
    </div>
   </div>
  </section>

  <section className={styles.queue} aria-label="Live queue and repair tickets">
   <div className={styles.sectionHeader}>
    <div><h2>3 · Live queue and repair outcomes</h2>
     <p className={styles.hint}>At stations includes assigned waiting tickets and repairs in progress. An assigned ticket stays Waiting until work begins. Other devices update automatically.</p></div>
    <strong>{tickets.length} ticket records</strong>
   </div>
   <div className={styles.queueTabs} role="group" aria-label="Filter repair queue">
    {([["queue","Waiting & active"],["stations","At stations ("+atStations.length+")"],["closed","Finished"],["all","All tickets"]] as [View,string][])
     .map(([key,label])=><button key={key} type="button" onClick={()=>setView(key)}
       className={view===key?styles.queueTabActive:styles.queueTab}
       aria-pressed={view===key}>{label}</button>)}
   </div>
   {displayed.length===0?<div className={styles.empty}>
    {tickets.length===0?"No repairs recorded for this session. Start with visitor check-in.":"No tickets in this view."}
   </div>:null}
   <div className={styles.ticketGrid}>
    {displayed.map(t=>{
     const currentEdit=editing?.id===t.id;
     const stale=currentEdit&&editing.revision!==t.updated_at;
     return <article className={styles.ticket} key={t.id}>
      <div className={styles.ticketHeader}><span className={styles.queueNumber}>#{t.ticket_number}</span>
       <span className={styles.state}>{t.status==="waiting"&&t.station_id?"Waiting · assigned":pretty(t.status)}</span></div>
      <h3>{t.visitor_display_name?t.visitor_display_name+" · ":""}{t.item_description}</h3>
      {t.visitor_display_name&&t.status==="waiting"?<p className={styles.hint}>
       <strong>Call out:</strong> “{t.visitor_display_name}, we’re ready to help you with your {t.item_description}.”
      </p>:null}
      <p className={styles.problem}>{t.reported_problem}</p>
      {t.queue_notes?<p className={styles.queueNoteText}><strong>Queue notes:</strong> {t.queue_notes}</p>:null}
      {active&&t.status==="waiting"?<WaitingQueueNotes eventId={eventId} ticket={t}/>:null}
      <div className={styles.ticketMeta}>
       <span>{pretty(t.item_category)}</span><span>Arrived {auTime(t.arrived_at)}</span>
       <span>Station: {stations.find(st=>st.id===t.station_id)?.name||"Unassigned"}</span>
       {t.risk_level!=="clear"?<span className={styles.risk}>{pretty(t.risk_level)} safety flag</span>:null}
      </div>
      {t.progress_code?<p className={styles.outcome}><strong>Progress so far:</strong>{" "}
       {progressChoices.find(([code])=>code===t.progress_code)?.[1]||pretty(t.progress_code)}
       {!t.outcome?" · Still open":""}
      </p>:null}
      {t.outcome?<p className={styles.outcome}><strong>Final outcome:</strong> {pretty(t.outcome)}{t.barrier?" · "+pretty(t.barrier):""}</p>:null}
      {canManage&&["completed","referred","not_attempted"].includes(t.status)?<p><Link href={"/repair-cafe-volunteers/knowledge?ticket="+t.id}>Save as repair lesson →</Link></p>:null}
      {t.handover_advice?<p className={styles.hint}><strong>Handover:</strong> {t.handover_advice}</p>:null}
      <details className={styles.ticketDetails} onToggle={e=>{
       if(e.currentTarget.open)setEditing({id:t.id,revision:t.updated_at});
       else setEditing(old=>old?.id===t.id?null:old);
      }}>
       <summary>{active?"Update ticket / record repair":"Review ticket and history"}</summary>
       {stale?<div role="alert" className={styles.warning}>
        This ticket changed on another device while you were editing. Close and reopen it to load the latest values before saving.
       </div>:null}
       {active?<form data-offline-kind="ticket_update" action={saveRepairTicket} className={styles.form}>
        <input type="hidden" name="event_id" value={eventId}/>
        <input type="hidden" name="ticket_id" value={t.id}/>
        <input type="hidden" name="revision" value={t.updated_at}/>
        <ProgressOutcomeFields status={t.status} outcome={t.outcome} progressCode={t.progress_code} canManage={canManage}/>
        <label>Repair station <select name="station_id" defaultValue={t.station_id||""}>
         <option value="">Not assigned</option>{stations.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
        </select></label>

        <label>Reason repair couldn't be completed <select name="barrier" defaultValue={t.barrier||""}>
         {barriers.map(([v,n])=><option key={v} value={v}>{n}</option>)}
        </select></label>
        <label>Repair notes / milestone <textarea name="note" rows={3} maxLength={1200}
          placeholder="E.g. power now works, but the screen is still blank"/></label>
        <label>Parts or materials used <input name="parts" defaultValue={t.parts_used} maxLength={300}/></label>
        <label>Advice to visitor <textarea name="advice" defaultValue={t.handover_advice} rows={2} maxLength={700}/></label>
        {canManage?<><label>Safety state <select name="risk" defaultValue={t.risk_level}>
         <option value="clear">Cleared within scope</option><option value="review">Review required</option><option value="unsafe">Unsafe</option>
        </select></label>
        <label>Safety notes <textarea name="risk_notes" defaultValue={t.risk_notes} rows={2} maxLength={500}/></label></>:
        <><input type="hidden" name="risk" value={t.risk_level}/><input type="hidden" name="risk_notes" value={t.risk_notes}/></>}
        <p className={styles.hint}>To begin: choose In progress and a station. Record interim findings freely while the ticket remains open. Select Completed only for the final handover. Changes are logged.</p>
        <button className="button" disabled={!!stale}>Save repair update</button>
       </form>:null}
       {activities.filter(a=>a.ticket_id===t.id).length?<div className={styles.history}>
        <h4>Change history</h4>
        {activities.filter(a=>a.ticket_id===t.id).map(a=><div key={a.id}>
         <span>{auTime(a.created_at)} · {pretty(a.to_status)}
          {a.progress_code?" · "+(progressChoices.find(([code])=>code===a.progress_code)?.[1]||pretty(a.progress_code)):""}</span>
         {a.note?<p>{a.note}</p>:null}
         {a.problem_snapshot!==null?<p><strong>Problem after edit:</strong> {a.problem_snapshot}</p>:null}
         {a.queue_note_snapshot!==null?<p><strong>Queue notes after edit:</strong> {a.queue_note_snapshot||"Cleared"}</p>:null}
        </div>)}
       </div>:null}
      </details>
     </article>
    })}
   </div>
  </section>
 </div>;
}
