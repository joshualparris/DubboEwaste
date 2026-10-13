import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {addMedia} from "../processing/actions";
import {recordStoragePresence,importSanitisationReport,reviewSanitisationReport} from "./actions";
import {SanitisationPicker} from "./SanitisationPicker";

const resources=[
 {name:"ShredOS",cost:"Free / open source",url:"https://github.com/PartialVolume/shredos.x86_64/releases",description:"Recommended starting point for a bootable nwipe USB or ISO; works with your Ventoy workflow. Download from official releases.",note:"Boot only on the target machine. Verify the full drive identity before starting. Save its raw log and PDF report."},
 {name:"nwipe",cost:"Free / open source",url:"https://github.com/martijnvanbrummelen/nwipe/releases",description:"Linux erasure application, also included in ShredOS. It supports parallel disks and drive-specific reports.",note:"Primarily an overwrite tool. Do not assume overwriting an SSD's logical blocks purges internal flash areas."},
 {name:"smartmontools / smartctl",cost:"Free / open source",url:"https://github.com/smartmontools/smartmontools",description:"Identify drive model/serial, SMART health and error data before and after wiping.",note:"Inspection only: SMART health is not evidence that user data was erased."},
 {name:"nvme-cli",cost:"Free / open source",url:"https://github.com/linux-nvme/nvme-cli",description:"Advanced Linux NVMe identification and firmware sanitize controls.",note:"Requires technical assessment of firmware and physical identity. A wrong sanitize command permanently destroys data."},
 {name:"Blancco Drive Eraser",cost:"Paid; limited free trial",url:"https://blancco.com/free-trial/",description:"Enterprise device erasure, verification and signed reports. Trial subject to vendor terms.",note:"Requires its own licensed local/boot environment; AssetFlow does not launch licensed wipes."},
 {name:"DBAN (legacy)",cost:"Free; personal HDD use only",url:"https://dban.org/",description:"Legacy bootable HDD overwrite tool. Listed for completeness, not the recommended DubboEwaste workflow.",note:"NOT for SSD/NVMe, no certifiable erase report, and its site restricts it to personal use."},
 {name:"Ventoy",cost:"Free",url:"https://www.ventoy.net/en/download.html",description:"Prepare a multiboot USB with compatible bootable ISOs.",note:"Adding an ISO to Ventoy doesn't erase a drive; launching the erase tool and selecting a target does."},
];
type Incoming={id:string;asset_code:string;manufacturer:string|null;model:string|null;serial_imei:string|null};
type Medium={id:string;media_code:string;parent_asset_id:string|null;media_type:string;serial:string|null;interface:string|null;data_state:string};
export default async function SanitisationWorkbench({searchParams}:{searchParams:Promise<{error?:string;notice?:string}>}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="dubbo_ewaste"||!["admin","manager","technician"].includes(context.role??"")))redirect("/dashboard");
 const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const p=await searchParams;
 const [{data:assets,error:assetError},{data:media,error:mediaError},{data:inspections,error:inspectionError},{data:reports,error:reportError},{data:history}]=await Promise.all([
  supabase.from("assets").select("id,asset_code,manufacturer,model,serial_imei").eq("programme","dubbo_ewaste").order("created_at",{ascending:false}).limit(300),
  supabase.from("media").select("id,media_code,parent_asset_id,media_type,serial,interface,data_state").eq("programme","dubbo_ewaste").order("created_at",{ascending:false}).limit(300),
  supabase.from("asset_storage_assessments").select("asset_id,presence,notes,assessed_at").order("assessed_at",{ascending:false}).limit(300),
  supabase.from("sanitisation_report_imports").select("*").order("submitted_at",{ascending:false}).limit(100),
  supabase.from("asset_storage_assessment_history").select("asset_id,new_presence,actor,happened_at").order("happened_at",{ascending:false}).limit(30)
 ]);
 const machines=(assets??[]) as Incoming[],drives=(media??[]) as Medium[];
 const inspectionsMap=new Map((inspections??[]).map(v=>[v.asset_id,v]));
 const reportsList=reports??[];
 const ids=reportsList.map(v=>v.evidence_id);
 const {data:rawEvidence}=ids.length?await supabase.from("evidence").select("id,storage_key").in("id",ids):{data:[]};
 const links=await Promise.all((rawEvidence??[]).map(async e=>{
  const {data}=await supabase.storage.from("evidence").createSignedUrl(e.storage_key,120);
  return {id:e.id,url:data?.signedUrl||""};
 }));
 const checked=machines.filter(m=>inspectionsMap.has(m.id)).length;
 const absent=machines.filter(m=>inspectionsMap.get(m.id)?.presence==="NO_MEDIA_AT_RECEIPT").length;
 const pending=reportsList.filter(v=>v.status==="PENDING").length;
 const hasError=[assetError,mediaError,inspectionError,reportError].filter(Boolean).map(x=>x?.message).join("; ");
 const machineChoices=machines.map(a=>({id:a.id,label:a.asset_code+" · "+[a.manufacturer,a.model].filter(Boolean).join(" "),searchText:a.serial_imei||""}));
 const driveChoices=drives.map(d=>({id:d.id,label:d.media_code+" · "+d.media_type+" · "+(d.serial||"SERIAL UNKNOWN"),searchText:[d.interface,d.serial].filter(Boolean).join(" ")}));
 return <main style={{maxWidth:1100,padding:"18px 16px",margin:"0 auto",lineHeight:1.6}}>
  <nav style={{display:"flex",gap:12,flexWrap:"wrap"}}><Link href="/media">Existing Media Queue</Link><Link href="/processing">Processing</Link><Link href="/assets">Assets</Link></nav>
  <h1>Sanitisation workbench</h1>
  <p>Track every physical storage device separately, link original logs, request independent verification and safely choose local erasure tools. The website does not wipe drives.</p>
  {p.error?<p role="alert" style={{border:"1px solid #b66",padding:10}}>{p.error}</p>:null}
  {p.notice?<p role="status" style={{border:"1px solid #6a6",padding:10}}>{p.notice}</p>:null}
  {hasError?<p role="alert">Unable to load private records: {hasError}</p>:null}
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10}}>
  {[[machines.length,"Registered assets"],[checked,"Storage inspected"],[absent,"No drive on arrival"],[drives.length,"Identified media"],[pending,"Reports awaiting review"]].map(([n,label])=><div key={String(label)} style={{padding:14,border:"1px solid #8886",borderRadius:10}}><strong style={{fontSize:23}}>{n}</strong><p style={{margin:0}}>{label}</p></div>)}
  </div>
  <section style={{border:"1px solid #8886",borderRadius:12,padding:16,marginTop:20}}>
   <h2>1. Inspect a computer for drives</h2>
   <p>Choose <strong>No drive at receipt</strong> only if the machine physically arrived without storage. This is not a successful wipe or an exemption from inspecting other drives.</p>
   <form action={recordStoragePresence} style={{display:"grid",gap:12,maxWidth:700}}>
    <SanitisationPicker key="assessment" name="asset_id" label="Computer / asset" items={machineChoices}/>
    <label style={{display:"grid",gap:6}}>Result<select required name="presence" defaultValue="NOT_INSPECTED" style={{minHeight:48,fontSize:16}}>
     <option value="NOT_INSPECTED">Not inspected yet</option>
     <option value="NO_MEDIA_AT_RECEIPT">Confirmed no drive on arrival</option>
     <option value="MEDIA_PRESENT">Storage drive found: register it below</option>
     <option value="REMOVED_AFTER_RECEIPT">Storage drive removed after receipt</option>
     <option value="UNRESOLVED">Unable to confirm / further checks required</option>
    </select></label>
    <label style={{display:"grid",gap:6}}>Inspection evidence or notes<textarea name="notes" rows={2} maxLength={1200} placeholder="e.g. inspected M.2 and SATA bays, no HDD or SSD supplied"/></label>
    <button type="submit" style={{padding:12,minHeight:48}}>Save storage inspection</button>
   </form>
   <details style={{marginTop:12}}><summary><strong>Show latest inspection records</strong></summary>
    <ul>{(inspections??[]).slice(0,35).map(v=><li key={v.asset_id}>{machines.find(a=>a.id===v.asset_id)?.asset_code||"Asset"}: {v.presence} · {v.notes||"no notes"}</li>)}</ul>
    {(history??[]).length>0?<p>Earlier decisions are retained in the private inspection history.</p>:null}
   </details>
  </section>
  <section style={{border:"1px solid #8886",borderRadius:12,padding:16,marginTop:20}}>
   <h2>2. Register an identified physical drive</h2>
   <p>A drive can be inside a computer or separately removed. Record the real drive's serial, type and interface. Never create dummy drives for computers received without storage.</p>
   <form action={addMedia} style={{display:"grid",gap:12,maxWidth:700}}>
    <SanitisationPicker key="media-target" name="asset_id" label="Computer the drive belongs to" items={machineChoices}/>
    <label style={{display:"grid",gap:6}}>Media type<select name="media_type" required style={{minHeight:48,fontSize:16}}>
     {["HDD","SATA_SSD","NVME","EMMC_UFS","USB","SD","TAPE","OTHER"].map(s=><option key={s}>{s}</option>)}</select></label>
    <label style={{display:"grid",gap:6}}>Drive serial number<input name="serial" maxLength={160} required style={{minHeight:46,fontSize:16,padding:9}} placeholder="Exact serial printed on disk"/></label>
    <label style={{display:"grid",gap:6}}>Interface<select name="interface" style={{minHeight:46,fontSize:16}}>
     <option value="">Unknown, investigate</option>{["SATA","NVMe","SAS","SCSI","USB","OPAL"].map(s=><option key={s}>{s}</option>)}</select></label>
    <details><summary>Additional drive details</summary>
    <label style={{display:"grid",gap:6}}>Manufacturer<input name="manufacturer"/></label>
    <label style={{display:"grid",gap:6}}>Model<input name="model"/></label>
    <label style={{display:"grid",gap:6}}>Capacity (GB)<input type="number" name="capacity_gb" min="0"/></label>
    </details>
    <button type="submit" style={{padding:12,minHeight:48}}>Register physical drive</button>
   </form>
  </section>
  <section style={{border:"1px solid #8886",borderRadius:12,padding:16,marginTop:20}}>
   <h2>3. Import a raw erasure report</h2>
   <p>Supports nwipe/ShredOS text logs and CSV/text candidates (maximum 2 MB). The parser searches for a per-drive result and matches the complete registered serial. If it cannot establish a match, the file remains unapproved. This does not independently authenticate the source software.</p>
   {drives.length?<form action={importSanitisationReport} style={{display:"grid",gap:12,maxWidth:700}}>
    <SanitisationPicker key="report-media" name="media_id" label="Select the exact drive" items={driveChoices}/>
    <label style={{display:"grid",gap:6}}>Original .txt, .log or .csv<input type="file" name="report" accept=".txt,.log,.csv,text/plain,text/csv" required/></label>
    <button type="submit" style={{padding:12,minHeight:48}}>Import, hash and compare report</button>
   </form>:<p><strong>First register a real drive above.</strong> No media records exist to match reports against yet.</p>}
   <p>Vendor PDF/XML reports can still be retained using the <Link href="/media">existing Media evidence upload</Link>, but this parser does not automatically validate those formats or their digital signatures.</p>
  </section>
  <section style={{border:"1px solid #8886",borderRadius:12,padding:16,marginTop:20}}>
   <h2>4. Independently review reported results</h2>
   {!reportsList.length?<p>No imported reports yet.</p>:reportsList.map(r=>{
    const label=drives.find(d=>d.id===r.media_id)?.media_code??"Media";
    const link=links.find(l=>l.id===r.evidence_id)?.url;
    const self=r.submitted_by===user.id;
    return <article key={r.id} style={{borderTop:"1px solid #8885",padding:"12px 0"}}>
     <strong>{label}: {r.observed_result}</strong> · {r.match_status} · {r.status}<p>SHA-256: <code style={{overflowWrap:"anywhere"}}>{r.report_sha256}</code></p>
     <p>{r.notes||"No parser note"} {link?<a href={link} rel="noopener noreferrer" target="_blank">View private original report (temporary link)</a>:null}</p>
     {r.status==="PENDING"?(self?<p>Awaiting another authorised reviewer; you cannot approve your own report.</p>:<form action={reviewSanitisationReport} style={{display:"grid",gap:8,maxWidth:630}}>
      <input type="hidden" name="id" value={r.id}/>
      <label>Decision<select name="status"><option value="REJECTED">Reject / investigate</option><option value="APPROVED">Approve report evidence</option></select></label>
      <label>Independent review findings<textarea name="reason" required minLength={10} maxLength={1500} rows={2}/></label>
      <button type="submit">Save independent decision</button>
     </form>):<p>Decision: {r.review_reason||"No reason recorded"}</p>}
    </article>;
   })}
   <p>An approved report still requires a named sanitisation policy, verified operation and successful release checks in the <Link href="/media">Media Queue</Link>. Separate people must submit and approve the report.</p>
  </section>
  <section style={{border:"1px solid #8886",borderRadius:12,padding:16,marginTop:20}}>
   <h2>5. Open an erasure or drive-inspection tool</h2>
   <p>These buttons open official download or documentation pages. They do <strong>not</strong> execute a wipe on your phone, browser or computer.</p>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
    {resources.map(t=><article key={t.name} style={{border:"1px solid #8886",borderRadius:10,padding:14}}>
     <h3 style={{margin:"0 0 4px"}}>{t.name}</h3><p><strong>{t.cost}</strong></p>
     <p>{t.description}</p><p style={{fontSize:13}}>{t.note}</p>
     <a href={t.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",padding:"12px 15px",border:"1px solid #888",borderRadius:8}}>Open official site ↗</a>
    </article>)}
   </div>
  </section>
  <p style={{marginTop:20}}>Safety: confirm physical serial and capacity immediately before any wipe. Keep unrelated drives disconnected where practical, retain original reports and never treat a PDF layout or self-entered status as proof of erasure.</p>
 </main>;
}
