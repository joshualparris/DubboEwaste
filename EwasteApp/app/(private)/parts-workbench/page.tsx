import Link from "next/link";
import {QuickPartForm,QuickConsumableForm,QuickStockMovement} from "./QuickStockForms";
import styles from "./QuickStockForms.module.css";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {harvestPart,installPart,returnPart,moveConsumable,createConsumable} from "./actions";
export default async function PartsWorkbench({searchParams}:{searchParams:Promise<{error?:string;notice?:string;q?:string;state?:string}>}){
 const {context,supabase}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="dubbo_ewaste"||!["admin","manager","technician"].includes(context.role||"")))redirect("/dashboard");
 const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const p=await searchParams;
 const [{data:consumables},{data:partTypes,error:catalogError},{data:consumableTemplates,error:templateError}]=await Promise.all([
 supabase.from("part_consumables").select("*").order("name"),
 supabase.from("part_type_catalog").select("code,label,category,spec_options,default_storage,data_bearing").eq("active",true).order("sort_order"),
 supabase.from("part_consumable_templates").select("code,label,default_unit,example_name").order("sort_order")
 ]);
 const [{data:parts,error:partError},{data:assets,error:assetError},{data:repairs,error:repairError},{data:history}]=await Promise.all([
 supabase.from("parts").select("id,part_code,part_type,specification,manufacturer,model,serial,test_status,origin_asset_id,installed_asset_id,installed_at,compatibility_notes,storage_label,test_evidence,tested_at").eq("programme","dubbo_ewaste").order("created_at",{ascending:false}).limit(300),
 supabase.from("assets").select("id,asset_code,manufacturer,model,serial_imei").eq("programme","dubbo_ewaste").order("created_at",{ascending:false}).limit(400),
 supabase.from("repairs").select("id,asset_id,status").eq("programme","dubbo_ewaste").order("created_at",{ascending:false}).limit(200),
 supabase.from("part_install_events").select("id,part_id,repair_id,target_asset_id,installed_at,estimated_cost_at_install").order("installed_at",{ascending:false}).limit(50)
 ]);
 const {data:consumption}=await supabase.from("part_consumable_movements").select("repair_id,quantity_delta,unit_cost_at_movement").not("repair_id","is",null).order("created_at",{ascending:false}).limit(400);
 const visible=(parts||[]).filter(x=>(!p.q||(x.part_code+" "+x.part_type+" "+x.specification+" "+x.storage_label).toLowerCase().includes(p.q.toLowerCase()))&&(!p.state||(p.state==="installed"?!!x.installed_at:p.state==="tested"?x.test_status==="PASS"&&!x.installed_at:!x.installed_at)));
 const available=(parts||[]).filter(x=>!x.installed_at),availableTested=available.filter(x=>x.test_status==="PASS"),code=(id:string|null)=>assets?.find(a=>a.id===id)?.asset_code||"Unknown";
 return <main className="stack"><nav><Link href="/repairs">Repairs</Link> · <Link href="/assets">Assets</Link> · <Link href="/workshop-inventory">Workshop tools</Link></nav>
 <h1>Parts & donor-component workbench</h1><p>Print a component label with its generated part code from the ledger. QR labels and consumable stock movements are available. Bulk imports remain a future enhancement.</p><p>Use the existing AssetFlow asset and repair IDs. Only a tested-good physical part with a recorded donor can be installed.</p>
 {p.error?<p role="alert">{p.error}</p>:null}{p.notice?<p role="status">{p.notice}</p>:null}
 {partError||assetError||repairError||catalogError||templateError?<p role="alert">Failed to load records: {partError?.message||assetError?.message||repairError?.message||catalogError?.message||templateError?.message}</p>:null}
 <section className="card"><h2>Stock overview</h2><p>{parts?.length||0} components · {available.length} available · {availableTested.length} tested and available · {(parts||[]).filter(x=>x.installed_at).length} installed</p></section>
 <section className="card"><h2>1. Add a donor component</h2><p>Choose the computer and a standard part. Known specs and storage bins are suggested, and optional fields stay tucked away.</p>
 {partTypes?.length?<QuickPartForm assets={assets??[]} types={partTypes.map(t=>({...t,spec_options:Array.isArray(t.spec_options)?t.spec_options:[]}))} action={harvestPart}/>:<p role="alert">Component catalogue is unavailable. The form is disabled to prevent incorrect entries.</p>}
 </section>
 <section className="card"><h2>2. Install tested part</h2>{!availableTested.length?<p>No eligible parts have passed testing yet.</p>:<form action={installPart} className="stack"><label>Tested available part<select name="part_id" required><option value="">Choose part</option>{availableTested.map(x=><option key={x.id} value={x.id}>{x.part_code} · {x.part_type} · {x.specification} · from {code(x.origin_asset_id)}</option>)}</select></label>
 <label>Recipient repair<select name="repair_id" required><option value="">Choose repair</option>{(repairs||[]).filter(r=>r.asset_id).map(r=><option key={r.id} value={r.id}>{code(r.asset_id)} · {r.status}</option>)}</select></label>
 <label>Compatibility confirmation: compare form factor, keyed connector, RAM type, voltage and model support before installation. <input type="checkbox" name="fit_confirmed" value="yes" required/> I checked actual compatibility.</label><label>Installation notes<textarea name="notes" maxLength={1000} placeholder="Exact fit and post-installation checks"/></label><button type="submit">Record installation</button></form>}
 <p>Database checks prevent duplicate installation and reject untested parts; you must independently check electrical and physical compatibility.</p></section>
 <section className="card"><h2>Consumable stock & SKU generator</h2>
 <p>Pick a common category, check the suggested name, and enter the quantity. SKU numbers are assigned safely by the database.</p>
 {consumableTemplates?.length?<QuickConsumableForm templates={consumableTemplates} action={createConsumable}/>:<p role="alert">Consumable catalogue is not available. Try refreshing.</p>}
 <h3>Existing stock</h3>
 {(consumables||[]).length===0?<p>No stock SKUs yet. Create one above to get started.</p>:null}
 {(consumables||[]).map(x=><details key={x.id} className={styles.details}><summary>{x.name} · {x.quantity} {x.unit} · <code>{x.sku}</code></summary>
 <QuickStockMovement sku={x.id} name={x.name} quantity={Number(x.quantity)} unit={x.unit} repairs={(repairs||[]).map(r=>({id:r.id,label:code(r.asset_id)}))} action={moveConsumable}/></details>)}
 </section>
 <section className="card"><h2>3. Component ledger</h2><form method="get"><label>Search components<input name="q" defaultValue={p.q||""}/></label><label>Status<select name="state" defaultValue={p.state||""}><option value="">All</option><option value="available">Available</option><option value="tested">Tested available</option><option value="installed">Installed</option></select></label><button>Filter</button></form><p>{visible.length} matching parts</p><div className="table-wrap"><table><thead><tr><th>Part</th><th>Donor</th><th>Specification</th><th>Test</th><th>Current location/state</th></tr></thead><tbody>{visible.map(x=><tr key={x.id}><td><Link href={"/parts-workbench/label?part="+x.id}>{x.part_code}</Link> · {x.part_type}</td><td>{code(x.origin_asset_id)}</td><td>{x.specification||x.model}</td><td>{x.test_status||"Unverified"}</td><td>{x.installed_at?"Installed into "+code(x.installed_asset_id):"Available"} · {x.storage_label||"Storage unrecorded"}</td></tr>)}</tbody></table></div></section>
 <section className="card"><h2>4. Remove a previously installed part</h2><p>Returning a part requires a reason and moves it to untested stock until re-verified.</p>{(parts||[]).some(x=>x.installed_at)?<form action={returnPart} className="stack"><label>Installed part<select name="part_id" required><option value="">Choose installed component</option>{(parts||[]).filter(x=>x.installed_at).map(x=><option key={x.id} value={x.id}>{x.part_code} · {x.part_type} · {code(x.installed_asset_id)}</option>)}</select></label><label>Removal reason<textarea name="reason" minLength={10} maxLength={1000} required/></label><button>Remove part and quarantine</button></form>:<p>No installed parts yet.</p>}</section>
 <section className="card"><h2>Recorded parts cost by repair</h2><p>Informational ledger values, not invoices or automatically verified cash costs. Returns are shown separately in the movement history.</p><ul>{(repairs||[]).map(r=>{const partCost=(history||[]).filter(h=>h.repair_id===r.id).reduce((sum,h)=>sum+Number(h.estimated_cost_at_install||0),0);const usedCost=(consumption||[]).filter(m=>m.repair_id===r.id&&Number(m.quantity_delta)<0).reduce((sum,m)=>sum-Math.abs(Number(m.quantity_delta))*Number(m.unit_cost_at_movement||0),0);return {id:r.id,asset:r.asset_id,partCost,consumablesCost:Math.abs(usedCost)};}).filter(r=>r.partCost||r.consumablesCost).map(r=><li key={r.id}>{code(r.asset)} · Components ${r.partCost.toFixed(2)} · Consumables ${r.consumablesCost.toFixed(2)}</li>)}</ul></section><section className="card"><h2>Installation history</h2><ul>{(history||[]).map(x=><li key={x.id}>{new Date(x.installed_at).toLocaleDateString("en-AU")} · {parts?.find(v=>v.id===x.part_id)?.part_code||"Part"} → {code(x.target_asset_id)}</li>)}</ul></section>
 </main>;
}
