"use client";

import {useEffect,useState} from "react";
import {saveWaitingQueueNotes} from "./actions";
import type {LiveTicket} from "./LiveQueue";
import styles from "./event-desk.module.css";

export default function WaitingQueueNotes({
 eventId,ticket
}:{eventId:string;ticket:LiveTicket}){
 const [open,setOpen]=useState(false);
 const [revision,setRevision]=useState(ticket.updated_at);
 const [problem,setProblem]=useState(ticket.reported_problem);
 const [notes,setNotes]=useState(ticket.queue_notes??"");
 const outdated=open&&revision!==ticket.updated_at;

 useEffect(()=>{
  if(!open){
   setRevision(ticket.updated_at);
   setProblem(ticket.reported_problem);
   setNotes(ticket.queue_notes??"");
  }
 },[ticket.updated_at,ticket.reported_problem,ticket.queue_notes,open]);

 return <details className={styles.queueNotesEditor} onToggle={e=>{
  const next=e.currentTarget.open;
  if(next){
   setRevision(ticket.updated_at);
   setProblem(ticket.reported_problem);
   setNotes(ticket.queue_notes??"");
  }
  setOpen(next);
 }}>
  <summary><span>Edit queue notes</span><small>No need to start the repair</small></summary>
  {outdated?<div className={styles.warning} role="alert">
   Another volunteer updated this ticket. Your unsaved text is still here.
   Copy it if needed, then close and reopen this editor to load the newest version.
  </div>:null}
  <form data-offline-kind="queue_notes" action={saveWaitingQueueNotes} className={styles.form}>
   <input type="hidden" name="event_id" value={eventId}/>
   <input type="hidden" name="ticket_id" value={ticket.id}/>
   <input type="hidden" name="revision" value={revision}/>
   <label>Visitor's reported problem
    <textarea name="reported_problem" minLength={3} maxLength={700} rows={2} required
     value={problem} onChange={e=>setProblem(e.target.value)}/>
   </label>
   <label>Additional queue notes
    <textarea name="queue_notes" rows={3} maxLength={1000}
     placeholder="E.g. three buttons needed; visitor has spare buttons"
     value={notes} onChange={e=>setNotes(e.target.value)}/>
   </label>
   <p className={styles.hint}>For reception and triage while this ticket is waiting.
    Saving keeps its place in the queue and doesn't set a repair outcome.
    Avoid passwords or sensitive personal details.</p>
   <button className="button secondary" disabled={outdated}>Save queue notes</button>
  </form>
 </details>;
}
