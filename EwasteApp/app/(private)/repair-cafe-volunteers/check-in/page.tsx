import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {selfCheckAttendance} from "./actions";
import QRPoster from "./QRPoster";
type Event={id:string;title:string;event_date:string;status:string;starts_at:string;ends_at:string};
const date=(d:string)=>new Date(d+"T12:00:00Z").toLocaleDateString("en-AU",{timeZone:"Australia/Sydney",weekday:"long",day:"numeric",month:"long",year:"numeric"});
const time=(d:string)=>new Date(d).toLocaleString("en-AU",{timeZone:"Australia/Sydney",hour:"numeric",minute:"2-digit"});
export default async function VolunteerCheckIn({searchParams}:{searchParams:Promise<{event?:string;error?:string;success?:string}>}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&context.selected!=="repair_cafe")redirect("/programmes?error=Select%20Repair%20Cafe");
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/login");
 const manage=context.global_admin||["manager","admin"].includes(context.role??"");
 const p=await searchParams;
 const {data:events,error:eventsError}=await supabase.from("repair_cafe_sessions")
  .select("id,title,event_date,status,starts_at,ends_at").is("deleted_at",null).order("event_date",{ascending:false}).limit(100);
 const rows=(events??[]) as Event[];
 const current=rows.find(x=>x.id===p.event)??rows.find(x=>x.status==="published")??rows[0];
 const {data:attendance,error:attendanceError}=current?await supabase.from("repair_cafe_attendance")
  .select("check_in_at,check_out_at").eq("event_id",current.id).eq("user_id",user.id).maybeSingle():{data:null,error:null};
 const checkedIn=!!attendance?.check_in_at;
 const checkedOut=!!attendance?.check_out_at;
 const hours=checkedIn&&checkedOut?Math.max(0,(new Date(attendance!.check_out_at!).getTime()-new Date(attendance!.check_in_at!).getTime())/3600000):null;
 const today=new Intl.DateTimeFormat("en-CA",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
 const eventDay=current?.event_date===today;
 return <main style={{maxWidth:840,margin:"auto",padding:"20px 12px 60px",display:"grid",gap:18}}>
  <nav><Link href="/repair-cafe-volunteers">← Volunteer Hub</Link> · <Link href="/repair-cafe-volunteers/operations">Operations</Link></nav>
  <header><div className="badge">Repair Café Dubbo · volunteers only</div><h1>Volunteer QR check-in</h1><p>Use your phone to record your arrival and departure. Times are saved by the server and count towards actual volunteer hours.</p></header>
  {p.error?<div className="error" role="alert">{p.error}</div>:null}{p.success?<div className="success" role="status">{p.success}</div>:null}
  {eventsError||attendanceError?<div className="error" role="alert">{eventsError?.message??attendanceError?.message}</div>:null}
  <form method="get" style={{display:"grid",gap:8}}><label>Repair Café event</label>
   <select name="event" defaultValue={current?.id??""}>{rows.map(e=><option key={e.id} value={e.id}>{date(e.event_date)} · {e.title} · {e.status}</option>)}</select>
   <button className="button secondary">Show event</button>
  </form>
  {!current?<p>No events exist yet. Ask a coordinator to create a session.</p>:<>
   <section className="card" style={{padding:20,display:"grid",gap:14}}>
    <h2>{current.title}</h2><p>{date(current.event_date)} · {time(current.starts_at)} to {time(current.ends_at)}</p>
    <p><strong>Your attendance:</strong> {!checkedIn?"Not checked in":checkedOut?"Checked out":"Checked in"}</p>
    {attendance?.check_in_at?<p>Arrived: {time(attendance.check_in_at)}</p>:null}
    {attendance?.check_out_at?<p>Finished: {time(attendance.check_out_at)}</p>:null}
    {hours!==null?<p><strong>Recorded volunteer hours: {hours.toFixed(2)}</strong></p>:null}
    {current.status!=="published"?<p className="muted">This event is not published. Check-in is closed.</p>:!eventDay?<p className="muted">Attendance is available only around the event day, including setup and pack-down.</p>:null}
    <form action={selfCheckAttendance}>
     <input type="hidden" name="event_id" value={current.id}/>
     <button className="button" style={{width:"100%",padding:16}} name="action" value={checkedIn?"out":"in"} disabled={checkedOut||current.status!=="published"||!eventDay}>
      {checkedOut?"Attendance complete":checkedIn?"Check out · finish shift":"Check in · start shift"}
     </button>
    </form>
    <p className="muted">Only signed-in Repair Café volunteers may record their own attendance. If you forget to check out, ask a coordinator to correct your hours.</p>
   </section>
   {manage?<QRPoster eventId={current.id} title={current.title} date={date(current.event_date)}/>:null}
  </>}
 </main>;
}
