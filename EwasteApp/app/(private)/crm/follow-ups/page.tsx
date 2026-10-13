import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type FollowUp={id:string;name:string;next_action:string|null;next_action_at:string|null;stage:string;organisation?:string|null};
const formatDue=(value:string|null)=>value?new Date(value).toLocaleString("en-AU",{dateStyle:"medium",timeStyle:"short",timeZone:"Australia/Sydney"}):"No date";

export default async function OverdueFollowUpsPage(){
 const supabase=await createClient();
 const now=new Date().toISOString();
 const [{data:leads,error:leadError},{data:opportunities,error:oppError}]=await Promise.all([
  supabase.from("crm_leads").select("id,name,organisation,next_action,next_action_at,stage").lt("next_action_at",now).not("stage","in",'("WON","LOST")').order("next_action_at",{ascending:true}),
  supabase.from("crm_opportunities").select("id,name,next_action,next_action_at,stage").lt("next_action_at",now).not("stage","in",'("COMPLETED","INVOICED","LOST")').order("next_action_at",{ascending:true})
 ]);
 const entries=[
  ...((leads??[]) as FollowUp[]).map(x=>({...x,type:"Lead" as const,href:"/crm"})),
  ...((opportunities??[]) as FollowUp[]).map(x=>({...x,type:"Opportunity" as const,href:"/crm/opportunities"}))
 ].sort((a,b)=>(a.next_action_at??"").localeCompare(b.next_action_at??""));
 return <div className="stack">
  <div><Link href="/dashboard" className="small">← Operations dashboard</Link><div className="badge">CRM</div>
   <h1>Overdue follow-ups</h1><p className="muted">Leads and opportunities with next actions dated before now that are not marked finished or lost.</p></div>
  <div className="actions"><Link className="button secondary" href="/crm">Open leads</Link><Link className="button secondary" href="/crm/opportunities">Open opportunities</Link></div>
  {leadError||oppError?<p className="error">Could not load all follow-ups. Please retry.</p>:null}
  <section className="card">
   <h2>{entries.length} overdue follow-up{entries.length===1?"":"s"}</h2>
   {!entries.length?<p className="muted">Nothing overdue. You're up to date.</p>:<div className="result-list">
    {entries.map(x=><Link className="result-row overdue" href={x.href} key={x.type+"-"+x.id}>
     <strong>{x.name}{x.organisation?" · "+x.organisation:""}</strong>
     <span>{x.type} · {x.next_action||"Follow up"} · due {formatDue(x.next_action_at)}</span>
     <span>Stage: {x.stage} · Open {x.type.toLowerCase()} list →</span>
    </Link>)}
   </div>}
  </section>
 </div>;
}
