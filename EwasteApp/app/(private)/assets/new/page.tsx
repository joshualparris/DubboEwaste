import { createAsset } from "../actions";
import { ModelAutofill } from "@/components/ModelAutofill";
import { createClient } from "@/lib/supabase/server";

export default async function NewAssetPage({ searchParams }: { searchParams: Promise<{ error?: string; job?: string }> }) {
  const { error, job } = await searchParams;
  const supabase = await createClient();
  const [{ data: models }, { data: customers }, { data: jobs }, { data: lots }, { data: locations }] = await Promise.all([
    supabase.from("model_support").select("manufacturer,model_name,aliases,identifiers,category,support_summary,lock_risks,battery_notes,likely_route,source_url,source_checked,confidence").order("manufacturer").order("model_name"),
    supabase.from("customers").select("id,name").order("name"),
    supabase.from("jobs").select("id,job_code").order("created_at",{ascending:false}),
    supabase.from("lots").select("id,lot_code,commodity").order("created_at",{ascending:false}),
    supabase.from("locations").select("id,name").eq("active",true).order("name"),
  ]);

  return <div className="stack">
    <div><div className="badge">AssetFlow P0</div><h1>Receive serialized asset</h1><p className="muted">Create the device record and anchor it to its customer, inbound job, lot and custody location.</p></div>
    {error ? <div className="error">{error}</div> : null}
    <form action={createAsset} className="card form">
      <div className="two"><label>Customer/source<select name="customer_id" defaultValue=""><option value="">Unassigned</option>{(customers??[]).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Inbound job<select name="job_id" defaultValue={job || ""}><option value="">No job</option>{(jobs??[]).map(j=><option key={j.id} value={j.id}>{j.job_code}</option>)}</select></label></div>
      <div className="two"><label>Origin lot<select name="lot_id" defaultValue=""><option value="">No lot / directly serialized</option>{(lots??[]).map(l=><option key={l.id} value={l.id}>{l.lot_code} · {l.commodity}</option>)}</select></label>
      <label>Current location<select name="location_id" defaultValue=""><option value="">Unassigned</option>{(locations??[]).map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label></div>
      <div className="two"><label>Category<select name="category" required defaultValue="LAPTOP"><option value="LAPTOP">Windows/Mac laptop</option><option value="DESKTOP">Desktop</option><option value="PHONE">Phone</option><option value="TABLET">Tablet</option><option value="CHROMEBOOK">Chromebook</option><option value="MONITOR">Monitor</option><option value="TV">TV</option><option value="NETWORKING">Networking</option><option value="PRINTER">Printer</option><option value="PARTS">Parts</option><option value="OTHER">Other</option></select></label>
      <label>One-off source / supplier<input name="source_name" placeholder="Optional free-text source" /></label></div>
      <ModelAutofill models={models ?? []} />
      <label>Serial / IMEI<input name="serial_imei" placeholder="Record before the device moves further" /></label>
      <div className="two"><label>Ownership / authority verified?<select name="ownership_verified" required defaultValue="yes"><option value="yes">Yes</option><option value="no">No — do not accept</option></select></label>
      <label>Data-bearing?<select name="data_bearing" required defaultValue="yes"><option value="yes">Yes / assume yes</option><option value="no">No</option></select></label></div>
      <label>Initial route<select name="initial_route" required defaultValue="HOLD"><option value="HOLD">Hold / further triage</option><option value="REFURBISH">Refurbish candidate</option><option value="PARTS">Parts candidate</option><option value="DONATE">Donation candidate</option><option value="RECYCLE">Recycle candidate</option></select></label>
      <label>Notes<textarea name="notes" placeholder="Visible damage, accessories, source context, immediate observations" /></label>
      <button className="button" type="submit">Accept and create asset</button>
    </form>
  </div>;
}
