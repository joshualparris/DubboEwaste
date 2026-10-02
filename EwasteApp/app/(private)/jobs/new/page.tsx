import { createJob } from "../../operations/actions";
import { createClient } from "@/lib/supabase/server";

export default async function NewJobPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const params=await searchParams;
  const supabase=await createClient();
  const {data:customers}=await supabase.from("customers").select("id,name").order("name");
  return <div className="stack">
    <div><div className="badge">P0</div><h1>New inbound job</h1><p className="muted">Create the chain-of-custody container before receiving lots or devices.</p></div>
    {params.error ? <div className="error">{params.error}</div>:null}
    <form action={createJob} className="card form">
      <label>Customer/source<select name="customer_id" defaultValue=""><option value="">Unassigned / one-off source</option>{(customers??[]).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <div className="two"><label>Source site<input name="source_site" /></label><label>Contact<input name="contact_name" /></label></div>
      <div className="two"><label>Status<select name="status" defaultValue="DRAFT"><option>DRAFT</option><option>SCHEDULED</option><option>DELIVERED</option><option>RECEIVED</option><option>PROCESSING</option></select></label><label>Expected asset count<input name="expected_asset_count" type="number" min="0" /></label></div>
      <label>Expected weight (kg)<input name="expected_weight_kg" type="number" min="0" step="0.001" /></label>
      <label>Work instructions<textarea name="work_instructions" placeholder="Customer handling, data, segregation or reporting instructions" /></label>
      <button className="button" type="submit">Create job</button>
    </form>
  </div>;
}
