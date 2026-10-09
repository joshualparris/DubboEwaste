"use client";

import {useState} from "react";
import styles from "./event-desk.module.css";

export const progressChoices=[
 ["","No interim result recorded"],
 ["diagnosing","Diagnosing / testing"],
 ["progress_made","Progress made, not yet working"],
 ["partly_working","Partly working / partially repaired"],
 ["awaiting_parts","Awaiting replacement parts"],
 ["blocked","Blocked: tools, skills or safety review"],
 ["needs_more_work","Further work still needed"]
] as const;

type Props={
 status:string;
 outcome:string|null;
 progressCode:string|null;
 canManage:boolean;
};
const finalStatus=(s:string)=>["completed","referred","not_attempted"].includes(s);

export default function ProgressOutcomeFields({status:initialStatus,outcome,progressCode,canManage}:Props){
 const [status,setStatus]=useState(initialStatus);
 return <>
  <label>Ticket status
   <select name="status" value={status} onChange={e=>setStatus(e.target.value)} required>
    {["waiting","in_progress","completed","referred","not_attempted","void"]
     .filter(s=>canManage||s!=="void").map(s=>
      <option key={s} value={s}>{s.replaceAll("_"," ").replace(/^./,c=>c.toUpperCase())}</option>)}
   </select>
  </label>
  {!finalStatus(status)&&status!=="void"?<>
   <label>Progress so far (not the final result)
    <select name="progress_code" defaultValue={progressCode||""}>
     {progressChoices.map(([code,label])=><option value={code} key={code}>{label}</option>)}
    </select>
   </label>
   <input type="hidden" name="outcome" value=""/>
   <p className={styles.hint}>You can save a partial success or setback as often as needed.
    The ticket stays open. Write what happened in the repair notes below.</p>
  </>:status==="completed"?<>
   <input type="hidden" name="progress_code" value={progressCode||""}/>
   <label>Final repair outcome (closing the ticket)
    <select name="outcome" required defaultValue={["fixed","partially_fixed","not_fixed"].includes(outcome||"")?outcome||"":""}>
     <option value="" disabled>Choose final result</option>
     <option value="fixed">Fully fixed</option>
     <option value="partially_fixed">Partially fixed</option>
     <option value="not_fixed">Not fixed</option>
    </select>
   </label>
   <p className={styles.hint}>Only choose a final outcome once the repair attempt has ended.
    Earlier progress remains in the history.</p>
  </>:<>
   <input type="hidden" name="progress_code" value={progressCode||""}/>
   <input type="hidden" name="outcome" value={status==="referred"?"referred":status==="not_attempted"?"not_attempted":""}/>
   {status==="void"?<p className={styles.hint}>Voided tickets are excluded from final results.</p>:
    <p className={styles.hint}>Final result: {status==="referred"?"Referred elsewhere":"Not attempted"}.</p>}
  </>}
 </>;
}
