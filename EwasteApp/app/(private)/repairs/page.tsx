import { ResponsiveTable } from "@/components/ResponsiveTable";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function RepairsPage() {
  const supabase=await createClient();
  const [{data:repairs},{data:parts}] = await Promise.all([
    supabase.from("repairs").select("*,assets(asset_code,manufacturer,model)").order("created_at",{ascending:false}),
    supabase.from("parts").select("*,assets!parts_origin_asset_id_fkey(asset_code)").order("created_at",{ascending:false}),
  ]);
  return <div className="stack"><div><div className="badge">Repair & parts</div><h1>Repairs and harvested parts</h1><p className="muted">Repair economics and part provenance stay tied to the originating asset/job/customer.</p></div>
    <section className="card"><h2>Repair tickets</h2><div className="table-wrap"><ResponsiveTable><thead><tr><th>Asset</th><th>Status</th><th>Diagnosis</th><th>Estimate</th><th>Value uplift</th></tr></thead><tbody>{(repairs??[]).map((r:any)=><tr key={r.id}><td>{r.assets?<Link href={"/assets/"+r.asset_id}><strong>{r.assets.asset_code}</strong></Link>:"—"}</td><td>{r.status}</td><td>{r.diagnosis||"—"}</td><td>{r.estimated_labour_minutes??"—"} min · ${r.estimated_parts_cost??0}</td><td>${r.expected_value_uplift??0}</td></tr>)}</tbody></ResponsiveTable></div></section>
    <section className="card"><h2>Harvested parts</h2><div className="table-wrap"><ResponsiveTable><thead><tr><th>Part</th><th>Type</th><th>Origin</th><th>Spec</th><th>Grade</th><th>Value</th></tr></thead><tbody>{(parts??[]).map((p:any)=><tr key={p.id}><td><strong>{p.part_code}</strong></td><td>{p.part_type}</td><td>{p.assets?.asset_code||"—"}</td><td>{p.specification||[p.manufacturer,p.model].filter(Boolean).join(" ")||"—"}</td><td>{p.grade||"—"}</td><td>${p.estimated_value??0}</td></tr>)}</tbody></ResponsiveTable></div></section>
  </div>;
}
