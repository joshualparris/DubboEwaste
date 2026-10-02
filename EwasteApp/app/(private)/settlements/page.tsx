import { createClient } from "@/lib/supabase/server";
import { createSettlement } from "../commercial/actions";

export default async function SettlementsPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const query=await searchParams;
  const supabase=await createClient();
  const [{data:jobs},{data:customers},{data:settlements}] = await Promise.all([
    supabase.from("jobs").select("id,job_code,customer_id,customers(name)").order("created_at",{ascending:false}),
    supabase.from("customers").select("id,name").order("name"),
    supabase.from("settlements").select("*,jobs(job_code),customers(name)").order("created_at",{ascending:false}),
  ]);
  return <div className="stack">
    <div><div className="badge">Commercial settlement</div><h1>Settlements</h1><p className="muted">Resale, fees, freight and repair parts are pulled from the job automatically. Add service/material/scrap/labour inputs and a customer-share percentage.</p></div>
    {query.error?<div className="error">{query.error}</div>:null}
    <form action={createSettlement} className="card form">
      <h2>Calculate settlement</h2>
      <label>Job<select name="job_id" required defaultValue=""><option value="" disabled>Select job</option>{(jobs??[]).map((j:any)=><option key={j.id} value={j.id}>{j.job_code} · {j.customers?.name||"unassigned"}</option>)}</select></label>
      <label>Customer override<select name="customer_id" defaultValue=""><option value="">Use job customer</option>{(customers??[]).map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <div className="two"><label>Material revenue<input name="material_revenue" type="number" min="0" step="0.01" defaultValue="0"/></label><label>Service revenue<input name="service_revenue" type="number" min="0" step="0.01" defaultValue="0"/></label></div>
      <div className="two"><label>Scrap value<input name="scrap_value" type="number" min="0" step="0.01" defaultValue="0"/></label><label>Labour cost<input name="labour_cost" type="number" min="0" step="0.01" defaultValue="0"/></label></div>
      <label>Customer share of contribution %<input name="customer_share_percent" type="number" min="0" max="100" step="0.1" defaultValue="0"/></label>
      <button className="button">Calculate settlement</button>
    </form>
    <section className="card"><h2>Settlement history</h2><div className="table-wrap"><table><thead><tr><th>Job</th><th>Customer</th><th>Revenue</th><th>Direct costs</th><th>Contribution</th><th>Customer share</th><th>Status</th></tr></thead><tbody>
      {(settlements??[]).map((s:any)=>{
        const revenue=Number(s.material_revenue)+Number(s.resale_revenue)+Number(s.service_revenue)+Number(s.scrap_value);
        const costs=Number(s.freight)+Number(s.marketplace_fees)+Number(s.parts_cost)+Number(s.labour_cost);
        return <tr key={s.id}><td><strong>{s.jobs?.job_code||"—"}</strong></td><td>{s.customers?.name||"—"}</td><td>{"$"+revenue.toFixed(2)}</td><td>{"$"+costs.toFixed(2)}</td><td>{"$"+(revenue-costs).toFixed(2)}</td><td>{"$"+Number(s.customer_share).toFixed(2)}</td><td>{s.status}</td></tr>
      })}
    </tbody></table></div></section>
  </div>;
}
