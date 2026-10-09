import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {submitFeedback} from "./actions";
export default async function Feedback({searchParams}:{searchParams:Promise<{event?:string;thanks?:string;error?:string}>}){
 const p=await searchParams,db=await createClient();
 const {data:events,error}=await db.rpc("repair_cafe_recent_feedback_events");
 return <main style={{maxWidth:640,margin:"auto",padding:"30px 16px"}}>
 <Link href="/repair-cafe-dubbo">← Repair Café Dubbo</Link><h1>How did your visit go?</h1>
 <p>Optional anonymous feedback to help us improve. No account, name, email, item serial number or contact details required. Please avoid personal information in your comment.</p>
 {p.thanks?<p className="success">Thank you for sharing your experience.</p>:null}
 {p.error?<p className="error" role="alert">{p.error}</p>:null}
 {error?<p className="error">Events could not load. Please try later.</p>:null}
 {!p.thanks&&!!events?.length?<form action={submitFeedback} style={{display:"grid",gap:14}}>
 <label>Which event? <select name="event" required defaultValue={events.some(e=>e.id===p.event)?p.event:events[0].id}>
 {events.map(e=><option value={e.id} key={e.id}>{e.title} · {e.event_date}</option>)}</select></label>
 <label>How was your visit? <select name="rating" required defaultValue=""><option value="" disabled>Choose 1 to 5 stars</option>
 {[5,4,3,2,1].map(n=><option value={n} key={n}>{n} out of 5</option>)}</select></label>
 <label>Repair result (optional) <select name="result"><option value="unspecified">Prefer not to say</option><option value="fixed">Fixed</option><option value="partial">Partly fixed</option><option value="not_fixed">Not fixed</option><option value="not_attempted">No repair attempted</option></select></label>
 <label>What could we improve? <textarea name="comment" maxLength={600} rows={4} placeholder="Optional feedback, without identifying information"/></label>
 <div style={{display:"none"}} aria-hidden="true"><label>Website <input name="website" tabIndex={-1} autoComplete="off"/></label></div>
 <button className="button">Submit anonymous feedback</button>
 </form>:!p.thanks?<p>There are no available events for feedback yet.</p>:null}
 </main>;
}
