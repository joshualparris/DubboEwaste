import { ResponsiveTable } from "@/components/ResponsiveTable";
import { createClient } from "@/lib/supabase/server";
import { createDownstreamVendor, createOutboundOrder, createPallet } from "../processing/actions";

export default async function RecyclingPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const params=await searchParams;
  const supabase=await createClient();
  const [{data:pallets},{data:vendors},{data:outbound},{data:locations},{data:customers}] = await Promise.all([
    supabase.from("pallets").select("*,locations(name),customers(name)").order("created_at",{ascending:false}),
    supabase.from("downstream_vendors").select("*").order("name"),
    supabase.from("outbound_orders").select("*,downstream_vendors(name)").order("created_at",{ascending:false}),
    supabase.from("locations").select("id,name").eq("active",true).order("name"),
    supabase.from("customers").select("id,name").order("name"),
  ]);
  return <div className="stack"><div><div className="badge">Recycling & outbound</div><h1>Downstream operations</h1><p className="muted">Containers, recyclers and outbound chain-of-custody records.</p></div>
    {params.error?<div className="error">{params.error}</div>:null}
    <div className="grid">
      <form action={createPallet} className="card form"><h2>Create pallet/container</h2><label>Type<input name="container_type" defaultValue="PALLET"/></label><label>Tare kg<input name="tare_weight_kg" type="number" min="0" step="0.001" defaultValue="0"/></label><label>Location<select name="location_id" defaultValue=""><option value="">Unassigned</option>{(locations??[]).map((l:any)=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label><label>Customer segregation<select name="customer_id" defaultValue=""><option value="">None</option>{(customers??[]).map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Hazardous?<select name="hazardous" defaultValue="no"><option value="no">No</option><option value="yes">Yes</option></select></label><label>Seal<input name="seal"/></label><button className="button">Create</button></form>
      <form action={createDownstreamVendor} className="card form"><h2>Add downstream vendor</h2><label>Name<input name="name" required/></label><div className="two"><label>ABN<input name="abn"/></label><label>Contact<input name="contact_name"/></label></div><div className="two"><label>Email<input name="email"/></label><label>Phone<input name="phone"/></label></div><label>Address<input name="address"/></label><label>Capabilities<textarea name="capabilities"/></label><label>Evidence requirements<textarea name="evidence_requirements"/></label><button className="button">Add vendor</button></form>
      <form action={createOutboundOrder} className="card form"><h2>Create outbound order</h2><label>Vendor<select name="vendor_id" defaultValue=""><option value="">Unassigned</option>{(vendors??[]).map((v:any)=><option key={v.id} value={v.id}>{v.name}</option>)}</select></label><label>Destination<input name="destination"/></label><label>Carrier<input name="carrier"/></label><label>BOL / consignment<input name="bol_reference"/></label><label>Expected kg<input name="expected_weight_kg" type="number" min="0" step="0.001"/></label><label>Notes<textarea name="notes"/></label><button className="button">Create outbound</button></form>
    </div>
    <section className="card"><h2>Pallets / containers</h2><div className="table-wrap"><ResponsiveTable><thead><tr><th>ID</th><th>Type</th><th>Location</th><th>Customer</th><th>Hazard</th><th>Status</th></tr></thead><tbody>{(pallets??[]).map((p:any)=><tr key={p.id}><td><strong>{p.pallet_code}</strong></td><td>{p.container_type}</td><td>{p.locations?.name||"—"}</td><td>{p.customers?.name||"—"}</td><td>{p.hazardous?"Yes":"No"}</td><td>{p.status}</td></tr>)}</tbody></ResponsiveTable></div></section>
    <section className="card"><h2>Outbound orders</h2><div className="table-wrap"><ResponsiveTable><thead><tr><th>Order</th><th>Vendor</th><th>BOL</th><th>Expected</th><th>Status</th></tr></thead><tbody>{(outbound??[]).map((o:any)=><tr key={o.id}><td><strong>{o.outbound_code}</strong></td><td>{o.downstream_vendors?.name||"—"}</td><td>{o.bol_reference||"—"}</td><td>{o.expected_weight_kg??"—"} kg</td><td>{o.status}</td></tr>)}</tbody></ResponsiveTable></div></section>
  </div>;
}
