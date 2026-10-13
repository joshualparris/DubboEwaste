import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {harvestPart,installPart} from "./actions";
export default async function PartsWorkbench({searchParams}:{searchParams:Promise<{error?:string;notice?:string}>}){
 const {context,supabase}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="dubbo_ewaste"||!["admin","manager","technician"].includes(context.role||"")))redirect("/dashboard");
 const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const p=await searchParams;
 const [{data:parts,error:partError},{data:assets,error:assetError},{data:repairs,error:repairError},{data:history}]=await Promise.all([
 supabase.from("parts").select("id,part_code,part_type,specification,manufacturer,model,serial,test_status,origin_asset_id,installed_asset_id,installed_at,compatibility_notes").eq("programme","dubbo_ewaste").order("created_at",{ascending:false}).limit(300),
 supabase.from("assets").select("id,asset_code,manufacturer,model").eq("programme","dubbo_ewaste").order("created_at",{ascending:false}).limit(400),
 supabase.from("repairs").select("id,asset_id,status").eq("programme","dubbo_ewaste").order("created_at",{ascending:false}).limit(200),
 supabase.from("part_install_events").select("id,part_id,repair_id,target_asset_id,installed_at").order("installed_at",{ascending:false}).limit(50)
 ]);
 const available=(parts||[]).filter(x=>!x.installed_at),availableTested=available.filter(x=>x.test_status==="PASS"),code=(id:string|null)=>assets?.find(a=>a.id===id)?.asset_code||"Unknown";
 return <main className="stack"><nav><Link href="/repairs">Repairs</Link> · <Link href="/assets">Assets</Link> · <Link href="/workshop-inventory">Workshop tools</Link></nav>
 <h1>Parts & donor-component workbench</h1><p>Use the existing AssetFlow asset and repair IDs. Only a tested-good physical part with a recorded donor can be installed.</p>
 {p.error?<p role="alert">{p.error}</p>:null}{p.notice?<p role="status">{p.notice}</p>:null}
 {partError||assetError||repairError?<p role="alert">Failed to load records: {partError?.message||assetError?.message||repairError?.message}</p>:null}
 <section className="card"><h2>Stock overview</h2><p>{parts?.length||0} components · {available.length} available · {availableTested.length} tested and available · {(parts||[]).filter(x=>x.installed_at).length} installed</p></section>
 <section className="card"><h2>1. Harvest a component</h2><form action={harvestPart} className="stack">
 <label>Donor asset<select name="origin_asset_id" required><option value="">Choose actual donor</option>{(assets||[]).map(a=><option key={a.id} value={a.id}>{a.asset_code} · {a.manufacturer} {a.model}</option>)}</select></label>
 <label>Component type<input name="part_type" required placeholder="DDR4 RAM, SATA SSD, charger"/></label>
 <label>Specification<input name="specification" maxLength={500} placeholder="8GB DDR4-2400 SODIMM"/></label>
 <label>Manufacturer<input name="manufacturer"/></label><label>Model<input name="model"/></label><label>Serial<input name="serial"/></label>
 <label>Compatibility / connector / voltage notes<textarea name="compatibility_notes" maxLength={500}/></label>
 <label>Test state<select name="test_status"><option value="UNTESTED">Unverified</option><option value="PASS">Tested good (confirm real test)</option><option value="FAILED">Failed</option></select></label>
 <button type="submit">Add harvested part</button></form></section>
 <section className="card"><h2>2. Install tested part</h2>{!availableTested.length?<p>No eligible parts have passed testing yet.</p>:<form action={installPart} className="stack"><label>Tested available part<select name="part_id" required><option value="">Choose part</option>{availableTested.map(x=><option key={x.id} value={x.id}>{x.part_code} · {x.part_type} · {x.specification} · from {code(x.origin_asset_id)}</option>)}</select></label>
 <label>Recipient repair<select name="repair_id" required><option value="">Choose repair</option>{(repairs||[]).filter(r=>r.asset_id).map(r=><option key={r.id} value={r.id}>{code(r.asset_id)} · {r.status}</option>)}</select></label>
 <label>Installation notes<textarea name="notes" maxLength={1000} placeholder="Exact fit and post-installation checks"/></label><button type="submit">Record installation</button></form>}
 <p>Database checks prevent duplicate installation and reject untested parts; you must independently check electrical and physical compatibility.</p></section>
 <section className="card"><h2>3. Component ledger</h2><div className="table-wrap"><table><thead><tr><th>Part</th><th>Donor</th><th>Specification</th><th>Test</th><th>Current location/state</th></tr></thead><tbody>{(parts||[]).map(x=><tr key={x.id}><td>{x.part_code} · {x.part_type}</td><td>{code(x.origin_asset_id)}</td><td>{x.specification||x.model}</td><td>{x.test_status||"Unverified"}</td><td>{x.installed_at?"Installed into "+code(x.installed_asset_id):"Available"}</td></tr>)}</tbody></table></div></section>
 <section className="card"><h2>Installation history</h2><ul>{(history||[]).map(x=><li key={x.id}>{new Date(x.installed_at).toLocaleDateString("en-AU")} · {parts?.find(v=>v.id===x.part_id)?.part_code||"Part"} → {code(x.target_asset_id)}</li>)}</ul></section>
 </main>;
}
