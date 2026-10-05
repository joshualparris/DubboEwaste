import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function JobsPage({searchParams}:{searchParams:Promise<{error?:string;success?:string}>}) {\n  const messages=await searchParams;
  const supabase = await createClient();
  const { data: jobs } = await supabase.from("jobs").select("id,job_code,source_site,status,expected_asset_count,expected_weight_kg,created_at,customers(name)").order("created_at",{ascending:false});
  return <div className="stack">
    <div><div className="badge">P0</div><h1>Inbound jobs</h1><p className="muted">A job groups a customer/source, work instructions, lots and serialized assets.</p></div>\n    {messages.error ? <div className="error">{messages.error}</div> : null}\n    {messages.success ? <div className="success">{messages.success}</div> : null}
    <div className="actions"><Link className="button" href="/jobs/new">New job</Link></div>
    <section className="card table-wrap"><table><thead><tr><th>Job</th><th>Customer</th><th>Source site</th><th>Status</th><th>Expected</th></tr></thead>
      <tbody>{(jobs ?? []).map((j:any) => <tr key={j.id}><td><Link href={`/jobs/${j.id}`}><strong>{j.job_code}</strong></Link></td><td>{j.customers?.name || "—"}</td><td>{j.source_site || "—"}</td><td><span className="badge">{j.status}</span></td><td>{j.expected_asset_count ?? "—"} assets · {j.expected_weight_kg ?? "—"} kg</td></tr>)}</tbody>
    </table></section>
  </div>;
}
