import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { addLotAdjustment, splitLot, updateLotTolerance } from "../actions";

export default async function LotPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{error?:string}>}) {
  const {id}=await params;
  const query=await searchParams;
  const supabase=await createClient();
  const [{data:lot},{data:links},{data:adjustments},{data:assets},{data:events}] = await Promise.all([
    supabase.from("lots").select("*,jobs(job_code),locations(name)").eq("id",id).single(),
    supabase.from("lot_relationships").select("id,child_lot_id,relationship_type,output_weight_kg").eq("parent_lot_id",id),
    supabase.from("lot_adjustments").select("*").eq("lot_id",id).order("created_at"),
    supabase.from("assets").select("id,asset_code,category,manufacturer,model,status").eq("lot_id",id).order("created_at"),
    supabase.from("operational_events").select("id,event_type,details,created_at").eq("entity_type","lot").eq("entity_id",id).order("created_at",{ascending:false}).limit(30),
  ]);
  if(!lot) notFound();
  const childIds=(links??[]).map((x:any)=>x.child_lot_id);
  const {data:children}=childIds.length?await supabase.from("lots").select("id,lot_code,commodity,gross_weight_kg,tare_weight_kg,item_count,status").in("id",childIds):{data:[]};
  const input=Math.max(0,Number(lot.gross_weight_kg??0)-Number(lot.tare_weight_kg??0));
  const output=(children??[]).reduce((sum:number,c:any)=>sum+Math.max(0,Number(c.gross_weight_kg??0)-Number(c.tare_weight_kg??0)),0);
  const adjusted=(adjustments??[]).reduce((sum:number,a:any)=>sum+Number(a.weight_kg??0),0);
  const variance=Number((input-output-adjusted).toFixed(3));
  const tolerance=Number(lot.mass_balance_tolerance_kg??0.5);
  const balanced=Math.abs(variance)<=tolerance;

  return <div className="stack">
    <div><div className="badge">{lot.status}</div><h1>{lot.lot_code}</h1><p className="muted">{lot.commodity} · {lot.jobs?.job_code||"No job"} · {lot.locations?.name||"No location"}</p></div>
    {query.error?<div className="error">{query.error}</div>:null}
    <div className="grid">
      <div className="card"><div className="muted">Input net mass</div><div className="metric">{input.toFixed(3)} kg</div></div>
      <div className="card"><div className="muted">Child outputs</div><div className="metric">{output.toFixed(3)} kg</div></div>
      <div className="card"><div className="muted">Residual/loss/outbound</div><div className="metric">{adjusted.toFixed(3)} kg</div></div>
      <div className="card"><div className="muted">Variance</div><div className="metric">{variance.toFixed(3)} kg</div><span className="badge">{balanced?"WITHIN TOLERANCE":"EXCEPTION"}</span></div>
    </div>
    <div className="grid">
      <form action={splitLot} className="card form"><h2>Split / sort output</h2><input type="hidden" name="parent_lot_id" value={lot.id}/><label>Commodity<input name="commodity" required/></label><label>Output weight kg<input name="weight_kg" type="number" min="0.001" step="0.001" required/></label><label>Item count<input name="item_count" type="number" min="0"/></label><label>Notes<textarea name="notes"/></label><button className="button">Create child lot</button></form>
      <form action={addLotAdjustment} className="card form"><h2>Account for residual/loss</h2><input type="hidden" name="lot_id" value={lot.id}/><label>Type<select name="adjustment_type"><option>RESIDUAL</option><option>PROCESS_LOSS</option><option>OUTBOUND</option><option>CORRECTION</option></select></label><label>Weight kg<input name="weight_kg" type="number" min="0" step="0.001" required/></label><label>Reason<textarea name="reason" required/></label><button className="button secondary">Record adjustment</button></form>
      <form action={updateLotTolerance} className="card form"><h2>Mass-balance tolerance</h2><input type="hidden" name="lot_id" value={lot.id}/><label>Tolerance kg<input name="tolerance_kg" type="number" min="0" step="0.001" defaultValue={tolerance} required/></label><button className="button secondary">Update & reconcile</button></form>
    </div>
    <section className="card"><h2>Child lots</h2>{!(children??[]).length?<p className="muted">No split outputs yet.</p>:<div className="table-wrap"><table><thead><tr><th>Lot</th><th>Commodity</th><th>Net mass</th><th>Count</th><th>Status</th></tr></thead><tbody>{(children??[]).map((c:any)=><tr key={c.id}><td><Link href={"/lots/"+c.id}><strong>{c.lot_code}</strong></Link></td><td>{c.commodity}</td><td>{Math.max(0,Number(c.gross_weight_kg??0)-Number(c.tare_weight_kg??0)).toFixed(3)} kg</td><td>{c.item_count??"—"}</td><td>{c.status}</td></tr>)}</tbody></table></div>}</section>
    <section className="card"><h2>Adjustments</h2>{!(adjustments??[]).length?<p className="muted">No residual/loss/outbound adjustments.</p>:<div className="table-wrap"><table><thead><tr><th>Type</th><th>Weight</th><th>Reason</th><th>Time</th></tr></thead><tbody>{(adjustments??[]).map((a:any)=><tr key={a.id}><td>{a.adjustment_type}</td><td>{Number(a.weight_kg).toFixed(3)} kg</td><td>{a.reason}</td><td>{new Date(a.created_at).toLocaleString("en-AU")}</td></tr>)}</tbody></table></div>}</section>
    <section className="card"><h2>Serialized assets from this lot</h2><div className="table-wrap"><table><thead><tr><th>Asset</th><th>Device</th><th>Status</th></tr></thead><tbody>{(assets??[]).map((a:any)=><tr key={a.id}><td><Link href={"/assets/"+a.id}><strong>{a.asset_code}</strong></Link></td><td>{[a.manufacturer,a.model].filter(Boolean).join(" ")||a.category}</td><td>{a.status}</td></tr>)}</tbody></table></div></section>
    <section className="card"><h2>Lot event history</h2><div className="table-wrap"><table><thead><tr><th>Time</th><th>Event</th><th>Details</th></tr></thead><tbody>{(events??[]).map((e:any)=><tr key={e.id}><td>{new Date(e.created_at).toLocaleString("en-AU")}</td><td>{e.event_type}</td><td className="small">{JSON.stringify(e.details)}</td></tr>)}</tbody></table></div></section>
  </div>;
}
