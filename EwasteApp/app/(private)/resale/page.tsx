import { createClient } from "@/lib/supabase/server";
import { createResaleListing, recordSale } from "../processing/actions";

export default async function ResalePage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const params=await searchParams;
  const supabase=await createClient();
  const [{data:assets},{data:listings},{data:sales}] = await Promise.all([
    supabase.from("assets").select("id,asset_code,manufacturer,model,data_state,ownership_verified,status").in("data_state",["VERIFIED_CLEARED","NON_DATA_BEARING"]).eq("ownership_verified",true).order("created_at",{ascending:false}),
    supabase.from("resale_listings").select("*,assets(asset_code,manufacturer,model)").order("created_at",{ascending:false}),
    supabase.from("sales").select("*").order("sold_at",{ascending:false}).limit(50),
  ]);
  return <div className="stack"><div><div className="badge">Resale</div><h1>Resale qualification & sales</h1><p className="muted">Listings are blocked unless ownership is verified, data requirements are satisfied and a grade exists.</p></div>
    {params.error?<div className="error">{params.error}</div>:null}
    <form action={createResaleListing} className="card form"><h2>Qualify / create listing</h2><label>Asset<select name="asset_id" required defaultValue=""><option value="" disabled>Select asset</option>{(assets??[]).map((a:any)=><option key={a.id} value={a.id}>{a.asset_code} · {[a.manufacturer,a.model].filter(Boolean).join(" ")||"asset"}</option>)}</select></label><div className="two"><label>SKU<input name="sku" required/></label><label>Channel<input name="channel" placeholder="eBay / direct / other"/></label></div><label>Title<input name="title" required/></label><label>Description<textarea name="description"/></label><label>Asking price<input name="asking_price" type="number" min="0" step="0.01" required/></label><button className="button">Run gate & create listing</button></form>
    <section className="card"><h2>Listings</h2><div className="table-wrap"><table><thead><tr><th>SKU</th><th>Asset</th><th>Channel</th><th>Price</th><th>Status</th><th>Record sale</th></tr></thead><tbody>{(listings??[]).map((l:any)=><tr key={l.id}><td><strong>{l.sku}</strong></td><td>{l.assets?.asset_code||"—"}</td><td>{l.channel||"—"}</td><td>${l.asking_price??0}</td><td>{l.status}</td><td>{l.status==="SOLD"?"Sold":<form action={recordSale} className="mini-form"><input type="hidden" name="listing_id" value={l.id}/><input name="sold_price" type="number" min="0" step="0.01" required placeholder="Sold $"/><input name="fees" type="number" min="0" step="0.01" placeholder="Fees"/><input name="freight" type="number" min="0" step="0.01" placeholder="Freight"/><input name="channel_order_id" placeholder="Order ref"/><input name="tracking" placeholder="Tracking"/><button className="button secondary">Sold</button></form>}</td></tr>)}</tbody></table></div></section>
    <section className="card"><h2>Recent sales</h2><p className="muted">{sales?.length??0} recorded sale{sales?.length===1?"":"s"}.</p></section>
  </div>;
}
