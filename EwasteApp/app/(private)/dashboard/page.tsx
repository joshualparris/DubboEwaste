import { ResponsiveTable } from "@/components/ResponsiveTable";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const [
    {count:all},{count:unwiped},{count:ready},{count:jobs},{count:lots},{count:certs},
    {count:exceptions},{count:repairs},{data:recent},{data:leadFollowUps},{data:opportunityFollowUps}
  ] = await Promise.all([
    supabase.from("assets").select("*",{count:"exact",head:true}),
    supabase.from("media").select("*",{count:"exact",head:true}).in("data_state",["UNWIPED_RESTRICTED","SANITISATION_FAILED"]),
    supabase.from("assets").select("*",{count:"exact",head:true}).eq("status","READY_FOR_SALE"),
    supabase.from("jobs").select("*",{count:"exact",head:true}).not("status","in",'("CLOSED","CANCELLED")'),
    supabase.from("lots").select("*",{count:"exact",head:true}).not("status","in",'("CLOSED","CONSUMED")'),
    supabase.from("certificates").select("*",{count:"exact",head:true}),
    supabase.from("exceptions").select("*",{count:"exact",head:true}).in("status",["OPEN","IN_REVIEW"]),
    supabase.from("repairs").select("*",{count:"exact",head:true}).in("status",["OPEN","APPROVED","IN_PROGRESS","WAITING_PARTS"]),
    supabase.from("assets").select("id,asset_code,category,manufacturer,model,status,created_at").order("created_at",{ascending:false}).limit(8),
    supabase.from("crm_leads").select("id,name,organisation,next_action,next_action_at,stage").lt("next_action_at",now).not("stage","in",'("WON","LOST")').order("next_action_at").limit(8),
    supabase.from("crm_opportunities").select("id,name,next_action,next_action_at,stage").lt("next_action_at",now).not("stage","in",'("COMPLETED","INVOICED","LOST")').order("next_action_at").limit(8),
  ]);

  const overdueCount=(leadFollowUps?.length??0)+(opportunityFollowUps?.length??0);

  return <div className="stack">
    <div><div className="badge">AssetFlow</div><h1>Operations dashboard</h1><p className="muted">Receiving, chain of custody, sanitisation, diagnostics, repair, resale, recycling, CRM and evidence.</p></div>
    <div className="grid">
      <div className="card"><div className="muted">Total assets</div><div className="metric">{all??0}</div></div>
      <div className="card"><div className="muted">Open jobs</div><div className="metric">{jobs??0}</div></div>
      <div className="card"><div className="muted">Active lots</div><div className="metric">{lots??0}</div></div>
      <div className="card"><div className="muted">Media needing wipe/review</div><div className="metric">{unwiped??0}</div></div>
      <div className="card"><div className="muted">Open exceptions</div><div className="metric">{exceptions??0}</div></div>
      <div className="card"><div className="muted">Open repairs</div><div className="metric">{repairs??0}</div></div>
      <div className="card"><div className="muted">Ready for sale</div><div className="metric">{ready??0}</div></div>
      <div className="card"><div className="muted">Overdue follow-ups</div><div className="metric">{overdueCount}</div></div>
      <div className="card"><div className="muted">Certificates</div><div className="metric">{certs??0}</div></div>
    </div>

    <div className="actions">
      <Link className="button" href="/triage">Run triage</Link>
      <Link className="button secondary" href="/assets/new">Receive asset</Link>
      <Link className="button secondary" href="/jobs/new">Create inbound job</Link>
      <Link className="button secondary" href="/crm/opportunities">Sales pipeline</Link>
      <Link className="button secondary" href="/search">Scan / search</Link>
      <Link className="button secondary" href="/exceptions">Review exceptions</Link>
    </div>

    {overdueCount ? <section className="card"><h2>Overdue follow-up</h2><div className="result-list">
      {(leadFollowUps??[]).map((lead:any)=><Link className="result-row overdue" href="/crm" key={"lead-"+lead.id}><strong>{lead.name}{lead.organisation?" · "+lead.organisation:""}</strong><span>Lead · {lead.next_action||"Follow up"} · due {new Date(lead.next_action_at).toLocaleString("en-AU")}</span></Link>)}
      {(opportunityFollowUps??[]).map((item:any)=><Link className="result-row overdue" href="/crm/opportunities" key={"opp-"+item.id}><strong>{item.name}</strong><span>Opportunity · {item.next_action||"Follow up"} · due {new Date(item.next_action_at).toLocaleString("en-AU")}</span></Link>)}
    </div></section> : null}

    <section className="card"><h2>Recent assets</h2>{!recent?.length?<p className="muted">No assets yet.</p>:<div className="table-wrap"><ResponsiveTable><thead><tr><th>Asset</th><th>Device</th><th>Status</th></tr></thead><tbody>{recent.map((a:any)=><tr key={a.id}><td><Link href={"/assets/"+a.id}><strong>{a.asset_code}</strong></Link></td><td>{[a.manufacturer,a.model].filter(Boolean).join(" ")||a.category}</td><td><span className="badge">{a.status}</span></td></tr>)}</tbody></ResponsiveTable></div>}</section>
  </div>;
}
