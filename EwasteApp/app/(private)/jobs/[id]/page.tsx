import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function JobPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const supabase=await createClient();
  const [{data:job},{data:assets},{data:lots},{data:events}]=await Promise.all([
    supabase.from("jobs").select("*,customers(name,contact_name,contact_email,contact_phone)").eq("id",id).single(),
    supabase.from("assets").select("id,asset_code,category,manufacturer,model,status").eq("job_id",id).order("created_at",{ascending:false}),
    supabase.from("lots").select("*").eq("job_id",id).order("created_at",{ascending:false}),
    supabase.from("operational_events").select("*").eq("entity_type","job").eq("entity_id",id).order("created_at",{ascending:false}).limit(30),
  ]);
  if(!job) notFound();
  const customer:any=job.customers;
  return <div className="stack">
    <div><div className="badge">{job.status}</div><h1>{job.job_code}</h1><p className="muted">{customer?.name || job.source_site || "Unassigned source"}</p></div>
    <div className="grid">
      <section className="card"><h2>Job details</h2><p><strong>Source site:</strong> {job.source_site||"—"}</p><p><strong>Contact:</strong> {job.contact_name||customer?.contact_name||"—"}</p><p><strong>Expected assets:</strong> {job.expected_asset_count??"—"}</p><p><strong>Expected weight:</strong> {job.expected_weight_kg??"—"} kg</p></section>
      <section className="card"><h2>Work instructions</h2><p>{job.work_instructions||"No special instructions."}</p></section>
    </div>
    <section className="card"><div className="actions"><Link className="button" href={`/assets/new?job=${id}`}>Receive serialized asset</Link><Link className="button secondary" href="/lots">Create lot</Link></div></section>
    <section className="card"><h2>Assets</h2><div className="table-wrap"><table><thead><tr><th>Asset</th><th>Device</th><th>Status</th></tr></thead><tbody>{(assets??[]).map(a=><tr key={a.id}><td><Link href={`/assets/${a.id}`}><strong>{a.asset_code}</strong></Link></td><td>{[a.manufacturer,a.model].filter(Boolean).join(" ")||a.category}</td><td>{a.status}</td></tr>)}</tbody></table></div></section>
    <section className="card"><h2>Lots</h2><div className="table-wrap"><table><thead><tr><th>Lot</th><th>Commodity</th><th>Weight</th><th>Status</th></tr></thead><tbody>{(lots??[]).map(l=><tr key={l.id}><td>{l.lot_code}</td><td>{l.commodity}</td><td>{l.gross_weight_kg??"—"} kg</td><td>{l.status}</td></tr>)}</tbody></table></div></section>
    <section className="card"><h2>Event history</h2>{!events?.length?<p className="muted">No job events yet.</p>:<div className="table-wrap"><table><thead><tr><th>Time</th><th>Event</th></tr></thead><tbody>{events.map(e=><tr key={e.id}><td>{new Date(e.created_at).toLocaleString("en-AU")}</td><td>{e.event_type}</td></tr>)}</tbody></table></div>}</section>
  </div>;
}
