import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {changeWaitlist} from "./actions";
import {setAvailability,respondShift} from "../sessions/actions";
type Event={id:string;title:string;event_date:string;status:string};
type Slot={id:string;event_id:string;role_name:string;starts_at:string;ends_at:string;required_count:number};
type Assignment={id:string;slot_id:string;status:string};
export default async function MyShifts({searchParams}:{searchParams:Promise<{error?:string;success?:string}>}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&context.selected!=="repair_cafe")redirect("/programmes");
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/login");
 const p=await searchParams;
 const [er,sr,ar,vr,wr]=await Promise.all([
  supabase.from("repair_cafe_sessions").select("id,title,event_date,status").is("deleted_at",null).order("event_date").limit(100),
  supabase.from("repair_cafe_shift_slots").select("id,event_id,role_name,starts_at,ends_at,required_count").limit(500),
  supabase.from("repair_cafe_shift_assignments").select("id,slot_id,status").eq("user_id",user.id).limit(500),
  supabase.from("repair_cafe_availability").select("event_id,response").eq("user_id",user.id).limit(100),
  supabase.from("repair_cafe_shift_waitlist").select("slot_id,state").eq("user_id",user.id).limit(500)
 ]);
 const events=(er.data??[]) as Event[],slots=(sr.data??[]) as Slot[],assignments=(ar.data??[]) as Assignment[],avail=vr.data??[],wait=wr.data??[];
 const errors=[er.error,sr.error,ar.error,vr.error,wr.error].filter(Boolean);
 return <main style={{maxWidth:900,margin:"auto",padding:18,display:"grid",gap:16}}>
  <nav><Link href="/repair-cafe-volunteers">← Volunteer Hub</Link> · <Link href="/repair-cafe-volunteers/check-in">QR attendance</Link></nav>
  <h1>My shifts and availability</h1><p>Choose when you can help. Waitlist requests are not confirmed shifts; coordinators must assign volunteers.</p>
  {p.error?<div className="error" role="alert">{p.error}</div>:null}{p.success?<div className="success" role="status">{p.success}</div>:null}
  {errors.length?<div className="error" role="alert">{errors.map(e=>e?.message).join("; ")}</div>:null}
  {events.filter(e=>!["cancelled","completed"].includes(e.status)).map(e=><section key={e.id} className="card" style={{padding:18}}>
   <h2>{e.title} · {e.event_date}</h2>
   <form action={setAvailability} style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"end"}}>
    <input type="hidden" name="event_id" value={e.id}/>
    <label>Your availability <select name="response" defaultValue={avail.find(x=>x.event_id===e.id)?.response??"maybe"}>
     <option value="available">Available</option><option value="maybe">Maybe</option><option value="unavailable">Unavailable</option>
    </select></label><input name="note" aria-label="Availability note" maxLength={250} placeholder="Optional note"/>
    <button className="button secondary">Save availability</button>
   </form>
   <div style={{display:"grid",gap:10,marginTop:14}}>{slots.filter(s=>s.event_id===e.id).map(s=>{
    const a=assignments.find(x=>x.slot_id===s.id),w=wait.find(x=>x.slot_id===s.id);
    return <article key={s.id} style={{border:"1px solid #d1dbd4",borderRadius:12,padding:12}}>
     <strong>{s.role_name}</strong><p>{s.starts_at}–{s.ends_at} · {s.required_count} places</p>
     {a?<><p><strong>Your assignment:</strong> {a.status}</p>
      {a.status==="offered"?<form action={respondShift}><input type="hidden" name="assignment_id" value={a.id}/><button className="button" name="status" value="confirmed">Accept shift</button> <button className="button secondary" name="status" value="declined">Decline</button></form>:null}
      {a.status==="confirmed"?<form action={respondShift}><input type="hidden" name="assignment_id" value={a.id}/><button className="button secondary" name="status" value="withdrawn">Withdraw</button></form>:null}
     </>:<form action={changeWaitlist}><input type="hidden" name="slot_id" value={s.id}/>
      <p>{w?.state==="waiting"?"You are waiting for an offer.":"Not assigned."}</p>
      <button className="button secondary" name="action" value={w?.state==="waiting"?"leave":"join"}>{w?.state==="waiting"?"Leave waiting list":"Join waiting list"}</button></form>}
    </article>;
   })}</div>
  </section>)}
 </main>;
}
