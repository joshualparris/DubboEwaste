"use client";
import {useMemo,useState} from "react";
import {assignCourse} from "./actions";

type Person={id:string;name:string;programmes:string[]};
type Course={id:string;title:string;programme:string};
type Programme={id:string;label:string};
export function AssignmentForm({people,courses,programmes}:{people:Person[];courses:Course[];programmes:Programme[]}){
 const [programme,setProgramme]=useState(programmes[0]?.id??"");
 const eligible=useMemo(()=>people.filter(p=>p.programmes.includes(programme)),[people,programme]);
 const offered=useMemo(()=>courses.filter(c=>c.programme==="all"||c.programme===programme),[courses,programme]);
 return <form action={assignCourse} className="form">
   <label>Programme
     <select name="programme" value={programme} onChange={e=>setProgramme(e.target.value)} required>
       {programmes.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
     </select>
   </label>
   <label>Volunteer
     <select key={"person-"+programme} name="learner" required disabled={!eligible.length}>
       {eligible.length?eligible.map(p=><option key={p.id} value={p.id}>{p.name}</option>):<option value="">No active volunteers in this programme</option>}
     </select>
   </label>
   <label>Course
     <select key={"course-"+programme} name="course" required>
       {offered.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
     </select>
   </label>
   <label>Target date (optional)<input type="date" name="due"/></label>
   <button className="button" type="submit" disabled={!programme||!eligible.length}>Assign course →</button>
   <p className="muted small">Only members of this programme appear, and only applicable courses can be selected. Staff will see the assignment on their Learning Hub home.</p>
 </form>;
}
