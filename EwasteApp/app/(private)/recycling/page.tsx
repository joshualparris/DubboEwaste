import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createOutboundOrder, createPallet } from "../processing/actions";
import {
  addAssetToOutbound,
  addAssetToPallet,
  addPalletToOutbound,
  completeOutbound,
  createDownstreamProvider,
  updateDownstreamProvider,
} from "../workflow/actions";

const providerTypes=["RECYCLER","ITAD","COUNCIL","STEWARDSHIP","SOCIAL_REUSE","BATTERY","OTHER"] as const;
const verificationStates=["RESEARCH_LEAD","CONTACTED","TERMS_RECEIVED","CONFIRMED","NOT_SUITABLE"] as const;

export default async function RecyclingPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const params=await searchParams;
  const supabase=await createClient();
  const [
    {data:pallets},
    {data:vendors},
    {data:outbound},
    {data:locations},
    {data:customers},
    {data:recycleAssets},
  ] = await Promise.all([
    supabase.from("pallets").select("*,locations(name),customers(name)").order("created_at",{ascending:false}),
    supabase.from("downstream_vendors").select("*").order("name"),
    supabase.from("outbound_orders").select("*,downstream_vendors(name),outbound_contents(id,entity_type,entity_id,weight_kg)").order("created_at",{ascending:false}),
    supabase.from("locations").select("id,name").eq("active",true).order("name"),
    supabase.from("customers").select("id,name").order("name"),
    supabase.from("assets").select("id,asset_code,manufacturer,model,status").in("status",["READY_FOR_RECYCLING","OUTBOUND"]).order("updated_at",{ascending:false}),
  ]);

  const openPallets=(pallets??[]).filter((p:any)=>p.status!=="CLOSED");
  const openOutbound=(outbound??[]).filter((o:any)=>!["RECEIVED","COMPLETED","CANCELLED"].includes(o.status));

  return <div className="stack">
    <div>
      <div className="badge">Recycling & outbound</div>
      <h1>Downstream operations</h1>
      <p className="muted">Provider due diligence, containers, outbound chain of custody and downstream receipt. Selecting RECYCLE on an asset no longer means it has actually been recycled.</p>
    </div>
    {params.error?<div className="error">{params.error}</div>:null}

    <div className="grid">
      <form action={createDownstreamProvider} className="card form">
        <h2>Add downstream provider</h2>
        <div className="two"><label>Name<input name="name" required/></label><label>ABN<input name="abn"/></label></div>
        <div className="two"><label>Provider type<select name="provider_type">{providerTypes.map(x=><option key={x}>{x}</option>)}</select></label><label>Verification<select name="verification_status">{verificationStates.map(x=><option key={x}>{x}</option>)}</select></label></div>
        <label>Website<input name="website" type="url"/></label>
        <div className="two"><label>Contact<input name="contact_name"/></label><label>Phone<input name="phone"/></label></div>
        <label>Email<input name="email" type="email"/></label>
        <label>Address<input name="address"/></label>
        <label>Accepted streams<textarea name="accepted_streams" placeholder="Laptops, desktops, monitors... one per line or comma-separated"/></label>
        <label>Commercial terms<textarea name="commercial_terms" placeholder="Business eligibility, account requirement, limits"/></label>
        <div className="two"><label>Pricing / fees<textarea name="pricing_notes"/></label><label>Minimum quantity<textarea name="minimum_quantity"/></label></div>
        <div className="two"><label>Lithium policy<textarea name="lithium_policy"/></label><label>CRT policy<textarea name="crt_policy"/></label></div>
        <label>Documentation available<textarea name="documentation_available" placeholder="Weight docket, recycling certificate, destruction report..."/></label>
        <label>Certifications<textarea name="certifications" placeholder="AS/NZS 5377 scope/certificate if verified"/></label>
        <label>NTCRS relationship<textarea name="ntcrs_relationship"/></label>
        <label>First downstream facility<textarea name="first_downstream_facility"/></label>
        <label>Confirmation source<textarea name="confirmation_source" placeholder="Staff name, email, date, published source"/></label>
        <label>Capabilities<textarea name="capabilities"/></label>
        <label>Evidence requirements<textarea name="evidence_requirements"/></label>
        <button className="button">Add provider</button>
      </form>

      <form action={createPallet} className="card form">
        <h2>Create pallet/container</h2>
        <label>Type<input name="container_type" defaultValue="PALLET"/></label>
        <label>Tare kg<input name="tare_weight_kg" type="number" min="0" step="0.001" defaultValue="0"/></label>
        <label>Location<select name="location_id" defaultValue=""><option value="">Unassigned</option>{(locations??[]).map((l:any)=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
        <label>Customer segregation<select name="customer_id" defaultValue=""><option value="">None</option>{(customers??[]).map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label>Hazardous?<select name="hazardous" defaultValue="no"><option value="no">No</option><option value="yes">Yes</option></select></label>
        <label>Seal<input name="seal"/></label>
        <button className="button">Create</button>
      </form>

      <form action={createOutboundOrder} className="card form">
        <h2>Create outbound order</h2>
        <label>Vendor<select name="vendor_id" defaultValue=""><option value="">Unassigned</option>{(vendors??[]).filter((v:any)=>v.active).map((v:any)=><option key={v.id} value={v.id}>{v.name} · {v.verification_status}</option>)}</select></label>
        <label>Destination<input name="destination"/></label>
        <label>Carrier<input name="carrier"/></label>
        <label>BOL / consignment<input name="bol_reference"/></label>
        <label>Expected kg<input name="expected_weight_kg" type="number" min="0" step="0.001"/></label>
        <label>Notes<textarea name="notes"/></label>
        <button className="button">Create outbound</button>
      </form>
    </div>

    <section className="card">
      <h2>Provider register</h2>
      <p className="muted small">RESEARCH_LEAD means useful public information only. CONFIRMED should be used only when current operational terms have been directly verified.</p>
      <div className="stack">{(vendors??[]).map((v:any)=><details key={v.id}>
        <summary><strong>{v.name}</strong> · {v.provider_type} · <span className="badge">{v.verification_status}</span>{v.last_confirmed_at?" · confirmed "+new Date(v.last_confirmed_at).toLocaleDateString("en-AU"):""}</summary>
        <div className="grid" style={{marginTop:12}}>
          <div><p><strong>Accepted:</strong> {(v.accepted_streams??[]).join(", ")||"—"}</p><p><strong>Commercial:</strong> {v.commercial_terms||"—"}</p><p><strong>Pricing:</strong> {v.pricing_notes||"—"}</p><p><strong>Minimum:</strong> {v.minimum_quantity||"—"}</p><p><strong>Lithium:</strong> {v.lithium_policy||"—"}</p><p><strong>CRT:</strong> {v.crt_policy||"—"}</p></div>
          <div><p><strong>Documents:</strong> {v.documentation_available||"—"}</p><p><strong>Certifications:</strong> {v.certifications||"—"}</p><p><strong>NTCRS:</strong> {v.ntcrs_relationship||"—"}</p><p><strong>Next facility:</strong> {v.first_downstream_facility||"—"}</p><p><strong>Source:</strong> {v.confirmation_source||"—"}</p>{v.website?<p><a href={v.website} target="_blank" rel="noreferrer">Website ↗</a></p>:null}</div>
        </div>
        <form action={updateDownstreamProvider} className="form" style={{marginTop:12}}>
          <input type="hidden" name="vendor_id" value={v.id}/>
          <div className="two"><label>Name<input name="name" required defaultValue={v.name}/></label><label>ABN<input name="abn" defaultValue={v.abn||""}/></label></div>
          <div className="two"><label>Provider type<select name="provider_type" defaultValue={v.provider_type}>{providerTypes.map(x=><option key={x}>{x}</option>)}</select></label><label>Verification<select name="verification_status" defaultValue={v.verification_status}>{verificationStates.map(x=><option key={x}>{x}</option>)}</select></label></div>
          <label>Website<input name="website" type="url" defaultValue={v.website||""}/></label>
          <div className="two"><label>Contact<input name="contact_name" defaultValue={v.contact_name||""}/></label><label>Phone<input name="phone" defaultValue={v.phone||""}/></label></div>
          <label>Email<input name="email" type="email" defaultValue={v.email||""}/></label>
          <label>Address<input name="address" defaultValue={v.address||""}/></label>
          <label>Accepted streams<textarea name="accepted_streams" defaultValue={(v.accepted_streams??[]).join("\n")}/></label>
          <label>Commercial terms<textarea name="commercial_terms" defaultValue={v.commercial_terms||""}/></label>
          <div className="two"><label>Pricing / fees<textarea name="pricing_notes" defaultValue={v.pricing_notes||""}/></label><label>Minimum quantity<textarea name="minimum_quantity" defaultValue={v.minimum_quantity||""}/></label></div>
          <div className="two"><label>Lithium policy<textarea name="lithium_policy" defaultValue={v.lithium_policy||""}/></label><label>CRT policy<textarea name="crt_policy" defaultValue={v.crt_policy||""}/></label></div>
          <label>Documentation available<textarea name="documentation_available" defaultValue={v.documentation_available||""}/></label>
          <label>Certifications<textarea name="certifications" defaultValue={v.certifications||""}/></label>
          <label>NTCRS relationship<textarea name="ntcrs_relationship" defaultValue={v.ntcrs_relationship||""}/></label>
          <label>First downstream facility<textarea name="first_downstream_facility" defaultValue={v.first_downstream_facility||""}/></label>
          <label>Confirmation source<textarea name="confirmation_source" defaultValue={v.confirmation_source||""}/></label>
          <label>Capabilities<textarea name="capabilities" defaultValue={v.capabilities||""}/></label>
          <label>Evidence requirements<textarea name="evidence_requirements" defaultValue={v.evidence_requirements||""}/></label>
          <button className="button secondary">Update provider</button>
        </form>
      </details>)}</div>
    </section>

    <div className="grid">
      <form action={addAssetToPallet} className="card form">
        <h2>Add recycle-ready asset to pallet</h2>
        <label>Asset<select name="asset_id" required defaultValue=""><option value="" disabled>Select asset</option>{(recycleAssets??[]).filter((a:any)=>a.status==="READY_FOR_RECYCLING").map((a:any)=><option key={a.id} value={a.id}>{a.asset_code} · {[a.manufacturer,a.model].filter(Boolean).join(" ")||"asset"}</option>)}</select></label>
        <label>Pallet<select name="pallet_id" required defaultValue=""><option value="" disabled>Select pallet</option>{openPallets.map((p:any)=><option key={p.id} value={p.id}>{p.pallet_code}</option>)}</select></label>
        <button className="button secondary">Add to pallet</button>
      </form>

      <form action={addAssetToOutbound} className="card form">
        <h2>Attach asset directly to outbound</h2>
        <label>Asset<select name="asset_id" required defaultValue=""><option value="" disabled>Select asset</option>{(recycleAssets??[]).map((a:any)=><option key={a.id} value={a.id}>{a.asset_code} · {a.status}</option>)}</select></label>
        <label>Outbound order<select name="outbound_order_id" required defaultValue=""><option value="" disabled>Select order</option>{openOutbound.map((o:any)=><option key={o.id} value={o.id}>{o.outbound_code} · {o.downstream_vendors?.name||"unassigned"}</option>)}</select></label>
        <label>Weight kg<input name="weight_kg" type="number" min="0" step="0.001"/></label>
        <button className="button">Attach & mark OUTBOUND</button>
      </form>

      <form action={addPalletToOutbound} className="card form">
        <h2>Attach pallet to outbound</h2>
        <label>Pallet<select name="pallet_id" required defaultValue=""><option value="" disabled>Select pallet</option>{openPallets.map((p:any)=><option key={p.id} value={p.id}>{p.pallet_code}</option>)}</select></label>
        <label>Outbound order<select name="outbound_order_id" required defaultValue=""><option value="" disabled>Select order</option>{openOutbound.map((o:any)=><option key={o.id} value={o.id}>{o.outbound_code} · {o.downstream_vendors?.name||"unassigned"}</option>)}</select></label>
        <label>Weight kg<input name="weight_kg" type="number" min="0" step="0.001"/></label>
        <button className="button secondary">Attach pallet</button>
      </form>
    </div>

    <section className="card"><h2>Pallets / containers</h2><div className="table-wrap"><table><thead><tr><th>ID</th><th>Type</th><th>Location</th><th>Customer</th><th>Hazard</th><th>Status</th></tr></thead><tbody>{(pallets??[]).map((p:any)=><tr key={p.id}><td><strong>{p.pallet_code}</strong></td><td>{p.container_type}</td><td>{p.locations?.name||"—"}</td><td>{p.customers?.name||"—"}</td><td>{p.hazardous?"Yes":"No"}</td><td>{p.status}</td></tr>)}</tbody></table></div></section>

    <section className="card"><h2>Outbound orders</h2><div className="table-wrap"><table><thead><tr><th>Order</th><th>Vendor</th><th>Contents</th><th>Expected</th><th>Status</th><th>Downstream receipt</th></tr></thead><tbody>{(outbound??[]).map((o:any)=><tr key={o.id}><td><strong>{o.outbound_code}</strong><div className="small muted">{o.bol_reference||"No BOL"}</div></td><td>{o.downstream_vendors?.name||"—"}</td><td>{o.outbound_contents?.length??0}</td><td>{o.expected_weight_kg??"—"} kg</td><td><span className="badge">{o.status}</span></td><td>{["RECEIVED","COMPLETED"].includes(o.status)?<>{o.received_confirmation||"Received"}{o.scale_weight_kg!=null?<div className="small">{o.scale_weight_kg} kg</div>:null}</>:<form action={completeOutbound} className="mini-form"><input type="hidden" name="outbound_order_id" value={o.id}/><input name="scale_weight_kg" type="number" min="0" step="0.001" placeholder="Received kg"/><input name="received_confirmation" required placeholder="Receipt / docket / staff confirmation"/><button className="button secondary">Confirm received</button></form>}</td></tr>)}</tbody></table></div></section>

    <section className="card">
      <h2>Recycling gate</h2>
      <p className="muted">An asset is only set to <strong>RECYCLED</strong> after a RECYCLE disposition, attachment to an outbound order, and downstream receipt. The resulting outbound evidence can then support a Recycling Certificate.</p>
      <p><Link href="/workflow"><strong>Open lifecycle queue →</strong></Link></p>
    </section>
  </div>;
}
