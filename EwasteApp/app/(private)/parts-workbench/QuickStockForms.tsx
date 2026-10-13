"use client";
import {useState} from "react";
import {DonorAssetPicker} from "./DonorAssetPicker";
import styles from "./QuickStockForms.module.css";

type Asset={id:string;asset_code:string;manufacturer:string|null;model:string|null;serial_imei?:string|null};
type Type={code:string;label:string;category:string;spec_options:string[];default_storage:string;data_bearing:boolean};
type Template={code:string;label:string;default_unit:string;example_name:string};
type FormAction=(data:FormData)=>void|Promise<void>;

const favourites=["RAM","SSD","HDD","CPU","MOTHERBOARD","FAN","OPTICAL","PSU"];
const manufacturers=["Samsung","SK hynix","Micron","Crucial","Kingston","Intel","AMD","Dell","HP","Lenovo","Toshiba","Western Digital","Seagate","Lite-On","Delta","ASUS","Acer","LG"];

export function QuickPartForm({assets,types,action}:{assets:Asset[];types:Type[];action:FormAction}){
 const [code,setCode]=useState("");
 const [preset,setPreset]=useState("");
 const [storage,setStorage]=useState("");
 const [tested,setTested]=useState("UNTESTED");
 const selected=types.find(x=>x.code===code);
 function choose(next:string){
   setCode(next);setPreset("");
   setStorage(types.find(x=>x.code===next)?.default_storage??"");
 }
 return <form action={action} className={styles.form}>
   <p className={styles.helper}>Three quick steps. You only need to open extra fields if you know the details.</p>
   <div className={styles.step}><span className={styles.stepNumber}>1</span><strong>Which computer did this part come from?</strong></div>
   <DonorAssetPicker assets={assets}/>
   <div className={styles.step}><span className={styles.stepNumber}>2</span><strong>What part have you removed?</strong></div>
   <div className={styles.quickOptions} role="group" aria-label="Common component types">
     {favourites.map(c=>{const t=types.find(x=>x.code===c);return t?<button key={c} className={code===c?styles.pillSelected:styles.pill} type="button" aria-pressed={code===c} onClick={()=>choose(c)}>{t.label}</button>:null})}
   </div>
   <label className={styles.field}>Part type
     <select required name="part_type_code" value={code} onChange={e=>choose(e.target.value)}>
       <option value="">Select a component type</option>
       {types.map(t=><option value={t.code} key={t.code}>{t.label}</option>)}
     </select>
   </label>
   {selected&&<>
     {code==="OTHER"&&<label className={styles.field}>Describe this part
       <input name="other_type" required maxLength={70} placeholder="e.g. laptop hinge bracket"/>
     </label>}
     <label className={styles.field}>Common specification <span className={styles.subtle}>(optional)</span>
       <select key={code} name="spec_preset" value={preset} onChange={e=>setPreset(e.target.value)}>
         <option value="">Unknown / not listed</option>
         {selected.spec_options.map(s=><option value={s} key={s}>{s}</option>)}
         <option value="CUSTOM">Enter exact specification</option>
       </select>
     </label>
     {preset==="CUSTOM"&&<label className={styles.field}>Exact specification
       <input name="specification" maxLength={500} placeholder="e.g. 8GB DDR4-2666 SODIMM"/>
     </label>}
     {selected.data_bearing&&<p className={styles.note}>Drive inventory records are allowed, but installation is blocked until the separate data-sanitisation workflow has been completed and verified.</p>}
   </>}
   <div className={styles.step}><span className={styles.stepNumber}>3</span><strong>Where is it, and has it been tested?</strong></div>
   <label className={styles.field}>Storage location
     <input name="storage_label" value={storage} onChange={e=>setStorage(e.target.value)} maxLength={120} placeholder="Unknown / not yet assigned"/>
   </label>
   <label className={styles.field}>Testing status
     <select name="test_status" value={tested} onChange={e=>setTested(e.target.value)}>
       <option value="UNTESTED">Not tested yet (recommended)</option>
       <option value="PASS">Tested good</option>
       <option value="FAILED">Failed test / faulty</option>
     </select>
   </label>
   {tested!=="UNTESTED"&&<label className={styles.field}>What test did you perform? {tested==="PASS"?"(required)":""}
     <textarea name="test_evidence" required={tested==="PASS"} minLength={tested==="PASS"?8:undefined} maxLength={500} rows={2} placeholder="e.g. MemTest86 passed 2 full passes, date"/>
   </label>}
   <details className={styles.details}><summary>Optional details: brand, serial, compatibility and cost</summary>
     <div className={styles.form}>
       <label className={styles.field}>Manufacturer
         <input name="manufacturer" list="part-manufacturers" maxLength={100} placeholder="Choose or type"/>
         <datalist id="part-manufacturers">{manufacturers.map(s=><option key={s} value={s}/>)}</datalist>
       </label>
       <label className={styles.field}>Part model
         <input name="model" maxLength={100} placeholder="Exact part number, if visible"/>
       </label>
       <label className={styles.field}>Serial number
         <input name="serial" maxLength={140} placeholder="Leave blank if absent"/>
       </label>
       <label className={styles.field}>Compatibility notes
         <textarea name="compatibility_notes" maxLength={500} rows={2} placeholder="Socket, voltage, connector, physical fit"/>
       </label>
       <label className={styles.field}>Estimated part value (AUD)
         <input name="estimated_value" type="number" min="0" step="0.01" defaultValue="0"/>
       </label>
     </div>
   </details>
   <label className={styles.confirm}><input name="donor_authorised" type="checkbox" value="yes" required/> I have this physical component and permission to harvest it from the selected donor.</label>
   <button className={styles.primary} type="submit" disabled={!code}>Save component — generate part ID</button>
   <p className={styles.helper}>Part ID is generated automatically after saving. Never mark a part as tested unless you actually performed the test.</p>
 </form>;
}

const categoriesQuick=["SCREWS","THERMAL","CLEAN","SOLDER","TAPE","TIES"];
export function QuickConsumableForm({templates,action}:{templates:Template[];action:FormAction}){
 const [category,setCategory]=useState("");
 const [name,setName]=useState("");
 const [unit,setUnit]=useState("each");
 const [initial,setInitial]=useState("0");
 const selected=templates.find(x=>x.code===category);
 function choose(next:string){
   const template=templates.find(x=>x.code===next);
   setCategory(next);setName(template?.example_name??"");setUnit(template?.default_unit??"each");
 }
 const preview="SUP-"+(category||"CATEGORY")+"-"+(name?name.toUpperCase().replace(/[^A-Z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,22):"ITEM")+"-#####";
 return <form action={action} className={styles.form}>
   <div className={styles.quickOptions} role="group" aria-label="Common consumable categories">
     {categoriesQuick.map(c=>{const t=templates.find(x=>x.code===c);return t?<button type="button" key={c} className={category===c?styles.pillSelected:styles.pill} onClick={()=>choose(c)} aria-pressed={category===c}>{t.label}</button>:null})}
   </div>
   <label className={styles.field}>Category
     <select required name="category_code" value={category} onChange={e=>choose(e.target.value)}>
       <option value="">Choose a stock category</option>
       {templates.map(t=><option key={t.code} value={t.code}>{t.label}</option>)}
     </select>
   </label>
   <label className={styles.field}>Item description
     <input name="name" required minLength={3} maxLength={150} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. M2 3mm laptop screws"/>
   </label>
   <div className={styles.twoCols}>
     <label className={styles.field}>Starting quantity
       <input name="initial_qty" type="number" min="0" max="1000000" step="0.01" required value={initial} onChange={e=>setInitial(e.target.value)}/>
     </label>
     <label className={styles.field}>Unit
       <select name="unit" value={unit} onChange={e=>setUnit(e.target.value)}>
         {["each","gram","ml","roll","pack","metre","tube","sheet"].map(x=><option key={x} value={x}>{x}</option>)}
       </select>
     </label>
   </div>
   <div className={styles.preview}><strong>Auto-generated SKU</strong><code>{preview}</code><span className={styles.subtle}>The last digits are assigned uniquely when you save.</span></div>
   <details className={styles.details}><summary>Optional: cost per unit</summary>
     <label className={styles.field}>Cost per unit (AUD)
       <input name="unit_cost" type="number" min="0" max="100000" step="0.01" defaultValue="0"/>
     </label>
   </details>
   <button className={styles.primary} type="submit" disabled={!category||name.trim().length<3}>Create stock item & generate SKU</button>
   <p className={styles.helper}>If you enter starting stock, its receipt is recorded automatically. Stock cannot go negative.</p>
 </form>;
}
