import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{count:all},{count:unwiped},{count:ready},{count:jobs},{count:lots},{count:certs},{data:recent}] = await Promise.all([
    supabase.from("assets").select("*",{count:"exact",head:true}),
    supabase.from("assets").select("*",{count:"exact",head:true}).eq("data_state","UNWIPED_RESTRICTED"),
    supabase.from("assets").select("*",{count:"exact",head:true}).eq("status","READY_FOR_SALE"),
    supabase.from("jobs").select("*",{count:"exact",head:true}).neq("status","CLOSED"),
    supabase.from("lots").select("*",{count:"exact",head:true}).not("status","in",'("CLOSED","CONSUMED")'),
    supabase.from("certificates").select("*",{count:"exact",head:true}),
    supabase.from("assets").select("id,asset_code,category,manufacturer,model,status,created_at").order("created_at",{ascending:false}).limit(8),
  ]);
  return <div className="stack">
    <div><div className="badge">AssetFlow P0</div><h1>Operations dashboard</h1><p className="muted">Chain-of-custody spine for receiving, tracking, testing, disposition and evidence.</p></div>
    <div className="grid">
      <div className="card"><div className="muted">Total assets</div><div className="metric">{all??0}</div></div>
      <div className="card"><div className="muted">Open jobs</div><div className="metric">{jobs??0}</div></div>
      <div className="card"><div className="muted">Active lots</div><div className="metric">{lots??0}</div></div>
      <div className="card"><div className="muted">Unwiped restricted</div><div className="metric">{unwiped??0}</div></div>
      <div className="card"><div className="muted">Ready for sale</div><div className="metric">{ready??0}</div></div>
      <div className="card"><div className="muted">Certificates</div><div className="metric">{certs??0}</div></div>
    </div>
    <div className="actions"><Link className="button" href="/assets/new">Receive asset</Link><Link className="button secondary" href="/jobs/new">Create inbound job</Link><Link className="button secondary" href="/lots">Create lot</Link></div>
    <section className="card"><h2>Recent assets</h2>{!recent?.length?<p className="muted">No assets yet.</p>:<div className="table-wrap"><table><thead><tr><th>Asset</th><th>Device</th><th>Status</th></tr></thead><tbody>{recent.map(a=><tr key={a.id}><td><Link href={`/assets/${a.id}`}><strong>{a.asset_code}</strong></Link></td><td>{[a.manufacturer,a.model].filter(Boolean).join(" ")||a.category}</td><td><span className="badge">{a.status}</span></td></tr>)}</tbody></table></div>}</section>
  </div>;
}
