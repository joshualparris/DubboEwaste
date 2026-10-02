import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { completeRepair } from "../workflow/actions";

export default async function RepairsPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const params=await searchParams;
  const supabase=await createClient();
  const [{data:repairs},{data:parts}] = await Promise.all([
    supabase.from("repairs").select("*,assets(asset_code,manufacturer,model)").order("created_at",{ascending:false}),
    supabase.from("parts").select("*,assets!parts_origin_asset_id_fkey(asset_code)").order("created_at",{ascending:false}),
  ]);
  return <div className="stack">
    <div><div className="badge">Repair & parts</div><h1>Repairs and harvested parts</h1><p className="muted">Repair economics and part provenance stay tied to the originating asset/job/customer. Completing a repair returns the asset to diagnostics for verification.</p></div>
    {params.error?<div className="error">{params.error}</div>:null}
    <section className="card"><h2>Repair tickets</h2><div className="table-wrap"><table><thead><tr><th>Asset</th><th>Status</th><th>Diagnosis</th><th>Estimate</th><th>Value uplift</th><th>Complete</th></tr></thead><tbody>{(repairs??[]).map((r:any)=><tr key={r.id}><td>{r.assets?<Link href={"/assets/"+r.asset_id}><strong>{r.assets.asset_code}</strong></Link>:"—"}</td><td><span className="badge">{r.status}</span></td><td>{r.diagnosis||"—"}{r.actions?<div className="small muted">{r.actions}</div>:null}</td><td>{r.estimated_labour_minutes??"—"} min · {"$"+Number(r.estimated_parts_cost??0).toFixed(2)}</td><td>{"$"+Number(r.expected_value_uplift??0).toFixed(2)}</td><td>{["COMPLETED","CANCELLED","DECLINED"].includes(r.status)?<>{r.completed_at?new Date(r.completed_at).toLocaleString("en-AU"):"Closed"}<div className="small">Actual: {r.actual_labour_minutes??"—"} min · {"$"+Number(r.actual_parts_cost??0).toFixed(2)}</div></>:<form action={completeRepair} className="mini-form"><input type="hidden" name="repair_id" value={r.id}/><input type="hidden" name="asset_id" value={r.asset_id}/><input name="actual_labour_minutes" type="number" min="0" required placeholder="Minutes"/><input name="actual_parts_cost" type="number" min="0" step="0.01" required placeholder="Parts $"/><input name="actions" required placeholder="Work completed"/><button className="button secondary">Complete & retest</button></form>}</td></tr>)}</tbody></table></div></section>
    <section className="card"><h2>Harvested parts</h2><div className="table-wrap"><table><thead><tr><th>Part</th><th>Type</th><th>Origin</th><th>Spec</th><th>Grade</th><th>Value</th></tr></thead><tbody>{(parts??[]).map((p:any)=><tr key={p.id}><td><strong>{p.part_code}</strong></td><td>{p.part_type}</td><td>{p.assets?.asset_code||"—"}</td><td>{p.specification||[p.manufacturer,p.model].filter(Boolean).join(" ")||"—"}</td><td>{p.grade||"—"}</td><td>{"$"+Number(p.estimated_value??0).toFixed(2)}</td></tr>)}</tbody></table></div></section>
  </div>;
}
