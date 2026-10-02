import Link from "next/link";
import { createLot } from "../operations/actions";
import { createClient } from "@/lib/supabase/server";

export default async function LotsPage({searchParams}:{searchParams:Promise<{error?:string;success?:string}>}) {
  const params=await searchParams;
  const supabase=await createClient();
  const [{data:lots},{data:jobs},{data:locations}]=await Promise.all([
    supabase.from("lots").select("*,jobs(job_code)").order("created_at",{ascending:false}),
    supabase.from("jobs").select("id,job_code").order("created_at",{ascending:false}),
    supabase.from("locations").select("id,name").eq("active",true).order("name"),
  ]);
  return <div className="stack">
    <div><div className="badge">P0</div><h1>Lots</h1><p className="muted">Bulk or mixed material can remain traceable before individual devices are serialized.</p></div>
    {params.error?<div className="error">{params.error}</div>:null}{params.success?<div className="success">{params.success}</div>:null}
    <form action={createLot} className="card form"><h2>Create lot</h2>
      <div className="two"><label>Job<select name="job_id" defaultValue=""><option value="">No job</option>{(jobs??[]).map(j=><option key={j.id} value={j.id}>{j.job_code}</option>)}</select></label><label>Commodity<input name="commodity" required placeholder="Mixed laptops" /></label></div>
      <div className="two"><label>Gross kg<input name="gross_weight_kg" type="number" min="0" step="0.001" /></label><label>Tare kg<input name="tare_weight_kg" type="number" min="0" step="0.001" /></label></div>
      <div className="two"><label>Item count<input name="item_count" type="number" min="0" /></label><label>Location<select name="location_id" defaultValue=""><option value="">Unassigned</option>{(locations??[]).map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label></div>
      <label>Notes<textarea name="notes" /></label><button className="button" type="submit">Create lot</button>
    </form>
    <section className="card table-wrap"><table><thead><tr><th>Lot</th><th>Job</th><th>Commodity</th><th>Gross</th><th>Count</th><th>Status</th></tr></thead><tbody>{(lots??[]).map((l:any)=><tr key={l.id}><td><Link href={"/lots/"+l.id}><strong>{l.lot_code}</strong></Link></td><td>{l.jobs?.job_code||"—"}</td><td>{l.commodity}</td><td>{l.gross_weight_kg??"—"} kg</td><td>{l.item_count??"—"}</td><td>{l.status}</td></tr>)}</tbody></table></section>
  </div>;
}
