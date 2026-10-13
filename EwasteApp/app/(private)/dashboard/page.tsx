import { ResponsiveTable } from "@/components/ResponsiveTable";
import Link from "next/link";

import { requireProgrammeContext } from "@/lib/programme-context";
import { PROGRAMMES } from "@/lib/programmes";

export default async function DashboardPage() {
  const { supabase, context } = await requireProgrammeContext();
  if (context.selected === "__denied__") return <section className="card"><h1>Programme access required</h1><Link href="/programmes">Choose your programme</Link></section>;
  if (context.selected && context.selected !== "dubbo_ewaste") {
    const [{ count: items }, { count: openRepairs }, { data: recent }] = await Promise.all([
      supabase.from("assets").select("id", { count:"exact",head:true }),
      supabase.from("repairs").select("id", { count:"exact",head:true }).in("status",["OPEN","APPROVED","IN_PROGRESS","WAITING_PARTS"]),
      supabase.from("assets").select("id,asset_code,category,manufacturer,model").order("created_at",{ascending:false}).limit(8)
    ]);
    return <div className="stack"><div><div className="badge">{context.role}</div><h1>{PROGRAMMES[context.selected]}</h1><p className="muted">Your programme's items and daily work.</p></div>
      <div className="grid"><Link className="card dashboard-metric-link" href="/assets" aria-label={`View ${items||0} tracked items`}><h2>Tracked items</h2><div className="metric">{items||0}</div><span className="dashboard-metric-hint">View items →</span></Link><Link className="card dashboard-metric-link" href="/repairs?view=open" aria-label={`View ${openRepairs||0} open repairs`}><h2>Open repairs</h2><div className="metric">{openRepairs||0}</div><span className="dashboard-metric-hint">View open repairs →</span></Link></div>
      <div className="actions"><Link href="/assets" className="button">View items</Link><Link href="/assets/new" className="button secondary">{context.selected === "repair_cafe" ? "Check in item" : "Catalogue item"}</Link><Link href={context.selected === "library_of_things" ? "/lending" : "/repair-cafe-volunteers"} className="button secondary">{context.selected === "library_of_things" ? "Loans & returns" : "Volunteer Hub"}</Link></div>
      <section className="card"><h2>Recent items</h2>{!recent?.length?<p className="muted">No items recorded yet.</p>:<div className="result-list">{recent.map(a=><Link className="result-row" key={a.id} href={"/assets/"+a.id}><strong>{a.asset_code}</strong><span>{[a.manufacturer,a.model].filter(Boolean).join(" ")||a.category}</span></Link>)}</div>}</section>
    </div>;
  }
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
      {[
        {label:"Total assets",count:all??0,href:"/assets",action:"Browse assets"},
        {label:"Open jobs",count:jobs??0,href:"/jobs?view=open",action:"View open jobs"},
        {label:"Active lots",count:lots??0,href:"/lots?view=active",action:"View active lots"},
        {label:"Media needing wipe/review",count:unwiped??0,href:"/media?view=review",action:"Review media"},
        {label:"Open exceptions",count:exceptions??0,href:"/exceptions?view=open",action:"Review exceptions"},
        {label:"Open repairs",count:repairs??0,href:"/repairs?view=open",action:"View open repairs"},
        {label:"Ready for sale",count:ready??0,href:"/assets?status=READY_FOR_SALE",action:"View sale-ready assets"},
        {label:"Overdue follow-ups",count:overdueCount,href:"/crm/follow-ups",action:"View follow-ups"},
        {label:"Certificates",count:certs??0,href:"/certificates",action:"View certificates"}
      ].map(item=><Link key={item.label} className="card dashboard-metric-link" href={item.href} aria-label={item.action+", "+item.count}>
        <span className="muted">{item.label}</span>
        <span className="metric">{item.count}</span>
        <span className="dashboard-metric-hint">{item.action} →</span>
      </Link>)}
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
