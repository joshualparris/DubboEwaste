import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {saveStationDispatch} from "./actions";
type E={id:string;title:string;event_date:string};
type S={id:string;event_id:string;name:string;category:string;capacity:number;lead_name:string};
export default async function Stations({searchParams}:{searchParams:Promise<{event?:string;error?:string;success?:string}>}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role??"")))redirect("/repair-cafe-volunteers");
 const p=await searchParams;
 const er=await supabase.from("repair_cafe_sessions").select("id,title,event_date").is("deleted_at",null).order("event_date",{ascending:false}).limit(60);
 const events=(er.data??[]) as E[],selected=events.find(x=>x.id===p.event)??events[0];
 const [st,tk]=selected?await Promise.all([
  supabase.from("repair_cafe_stations").select("id,event_id,name,category,capacity,lead_name").eq("event_id",selected.id).order("name"),
  supabase.from("repair_cafe_tickets").select("station_id,status").eq("event_id",selected.id).eq("status","in_progress")
 ]):[{data:[],error:null},{data:[],error:null}];
 const issues=[er.error,st.error,tk.error].filter(Boolean);
 return <main style={{maxWidth:940,margin:"auto",padding:18,display:"grid",gap:18}}>
  <nav><Link href="/repair-cafe-volunteers">← Volunteer Hub</Link> · <Link href="/repair-cafe-volunteers/event-desk">Event Desk</Link></nav>
  <h1>Repair station dispatch</h1><p>Set who is running each station, and how many items it can safely handle at once. The database blocks sending additional repairs to a full station.</p>
  {p.error?<div className="error" role="alert">{p.error}</div>:null}{p.success?<div className="success" role="status">{p.success}</div>:null}
  {issues.length?<div className="error" role="alert">{issues.map(e=>e?.message).join("; ")}</div>:null}
  <form method="get"><label>Event <select name="event" defaultValue={selected?.id??""}>{events.map(e=><option key={e.id} value={e.id}>{e.event_date} · {e.title}</option>)}</select></label> <button className="button secondary">Select</button></form>
  {((st.data??[]) as S[]).map(s=>{
   const busy=(tk.data??[]).filter(t=>t.station_id===s.id).length;
   return <section key={s.id} className="card" style={{padding:18}}>
    <h2>{s.name}</h2><p><strong>{busy} active / {s.capacity} capacity</strong> · {s.category}</p>
    <p>{busy>=s.capacity?"Station full · do not assign more items":"Places available: "+(s.capacity-busy)}</p>
    <form action={saveStationDispatch} style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"end"}}>
     <input type="hidden" name="station_id" value={s.id}/><input type="hidden" name="event" value={selected!.id}/>
     <label>Station lead / repairer name <input name="lead" defaultValue={s.lead_name} maxLength={100} placeholder="Name of responsible volunteer"/></label>
     <label>Maximum simultaneous repairs <input name="capacity" type="number" min={1} max={20} defaultValue={s.capacity} required/></label>
     <button className="button">Save station</button>
    </form>
   </section>;
  })}
  {selected&&!st.data?.length?<p>Add stations through the Event Desk first.</p>:null}
 </main>;
}
