import Link from "next/link";
import { notFound } from "next/navigation";
import { AssetQr } from "@/components/AssetQr";
import { EvidenceUpload } from "@/components/EvidenceUpload";
import { createClient } from "@/lib/supabase/server";
import { buildAssetWorkflowContext, workflowMatches } from "@/lib/workflow";
import { issueCertificate, recordDisposition, recordTest } from "../../operations/actions";
import { addAssetAttribute, addMedia, applyDefect, applyWorkflowRule, createException, createRepair, harvestPart, recordGrade } from "../../processing/actions";

export default async function AssetPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{error?:string}> }) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const [
    { data: asset }, { data: events }, { data: tests }, { data: dispositions }, { data: certs },
    { data: attributes }, { data: media }, { data: grades }, { data: evidence }, { data: exceptions },
    { data: repairs }, { data: parts }, { data: defectTemplates }, { data: defects }, { data: workflowRules }
  ] = await Promise.all([
    supabase.from("assets").select("*,customers(name),jobs(job_code),lots(lot_code),locations(name)").eq("id", id).single(),
    supabase.from("asset_events").select("id,event_type,created_at,details").eq("asset_id", id).order("created_at", { ascending: false }).limit(25),
    supabase.from("asset_tests").select("*").eq("asset_id", id).order("created_at", { ascending: false }),
    supabase.from("dispositions").select("*").eq("asset_id", id).order("decided_at", { ascending: false }),
    supabase.from("certificates").select("id,certificate_code,certificate_type,issued_at,status,verification_token").eq("asset_id", id).order("issued_at", { ascending: false }),
    supabase.from("asset_attributes").select("*").eq("asset_id", id).order("attribute_key"),
    supabase.from("media").select("*,sanitisation_tasks(status,tool_name,method,completed_at,created_at)").eq("parent_asset_id", id).order("created_at"),
    supabase.from("grades").select("*").eq("asset_id", id).order("graded_at", { ascending: false }),
    supabase.from("evidence").select("*").eq("entity_type", "asset").eq("entity_id", id).order("captured_at", { ascending: false }),
    supabase.from("exceptions").select("*").eq("entity_type", "asset").eq("entity_id", id).order("created_at", { ascending: false }),
    supabase.from("repairs").select("*").eq("asset_id", id).order("created_at", { ascending: false }),
    supabase.from("parts").select("*").eq("origin_asset_id", id).order("created_at", { ascending: false }),
    supabase.from("defect_templates").select("*").eq("active",true).order("name"),
    supabase.from("asset_defects").select("*,defect_templates(name,severity)").eq("asset_id",id).order("created_at",{ascending:false}),
    supabase.from("workflow_rules").select("*").eq("enabled",true).order("priority"),
  ]);
  if (!asset) notFound();
  const a:any=asset;
  const latestGrade:any=grades?.[0] ?? null;
  const certTypes = ["RECEIPT","RECEIVING","DISPOSITION","DEVICE_HISTORY","SANITISATION","DESTRUCTION","RECYCLING"] as const;
  const workflowContext=buildAssetWorkflowContext(a,latestGrade);
  const matchingRules=(workflowRules??[]).filter((rule:any)=>workflowMatches(rule.conditions,workflowContext));

  return <div className="stack">
    <div><div className="badge">{a.status}</div><h1>{a.asset_code}</h1><p className="muted">{[a.manufacturer,a.model].filter(Boolean).join(" ")||a.category}</p></div>
    {query.error ? <div className="error">{query.error}</div> : null}
    <div className="grid">
      <section className="card"><h2>Asset label</h2><AssetQr assetCode={a.asset_code} assetId={a.id} /></section>
      <section className="card"><h2>Custody</h2><p><strong>Customer:</strong> {a.customers?.name||a.source_name||"—"}</p><p><strong>Job:</strong> {a.jobs?.job_code||"—"}</p><p><strong>Origin lot:</strong> {a.lots?.lot_code||"—"}</p><p><strong>Location:</strong> {a.locations?.name||"—"}</p><p><strong>Received:</strong> {new Date(a.received_at).toLocaleString("en-AU")}</p></section>
      <section className="card"><h2>Intake state</h2><p><strong>Category:</strong> {a.category}</p><p><strong>Serial / IMEI:</strong> {a.serial_imei||"—"}</p><p><strong>Ownership verified:</strong> {a.ownership_verified?"Yes":"No"}</p><p><strong>Data state:</strong> {a.data_state}</p><p><strong>Initial route:</strong> {a.initial_route||"—"}</p><p><strong>Grade:</strong> {latestGrade?.final_grade||"Not graded"}</p></section>
    </div>

    <section className="card"><h2>Evidence / photos</h2><EvidenceUpload entityType="asset" entityId={a.id} /><div className="result-list">{(evidence??[]).map((e:any)=><a className="result-row" href={"/api/evidence/"+e.id+"/download"} key={e.id}><strong>{e.filename}</strong><span>{e.evidence_type} · SHA-256 {e.sha256?.slice(0,16)||"—"}… · {new Date(e.captured_at).toLocaleString("en-AU")}</span></a>)}</div></section>

    <div className="grid">
      <form action={addAssetAttribute} className="card form"><h2>Dynamic attribute</h2><input type="hidden" name="asset_id" value={a.id}/><label>Key<input name="attribute_key" required placeholder="RAM"/></label><label>Value<input name="attribute_value" placeholder="16 GB"/></label><button className="button secondary">Save attribute</button></form>
      <form action={addMedia} className="card form"><h2>Add child media</h2><input type="hidden" name="asset_id" value={a.id}/><label>Type<select name="media_type"><option>HDD</option><option>SATA_SSD</option><option>NVME</option><option>EMMC_UFS</option><option>USB</option><option>SD</option><option>TAPE</option><option>OTHER</option></select></label><div className="two"><label>Manufacturer<input name="manufacturer"/></label><label>Model<input name="model"/></label></div><label>Serial<input name="serial"/></label><div className="two"><label>Capacity GB<input name="capacity_gb" type="number" min="0" step="0.1"/></label><label>Interface<input name="interface"/></label></div><button className="button secondary">Add media</button></form>
      <form action={recordGrade} className="card form"><h2>Grade asset</h2><input type="hidden" name="asset_id" value={a.id}/><div className="two"><label>Functional<input name="functional_grade" placeholder="A/B/C"/></label><label>Cosmetic<input name="cosmetic_grade" placeholder="A/B/C"/></label></div><div className="two"><label>Battery<input name="battery_grade"/></label><label>Completeness<input name="completeness_grade"/></label></div><label>Marketability<input name="marketability_grade"/></label><label>Final grade<input name="final_grade" required/></label><label>Override reason<input name="override_reason"/></label><button className="button secondary">Record grade</button></form>
    </div>

    <section className="card"><h2>Attributes</h2>{!(attributes??[]).length?<p className="muted">No dynamic attributes.</p>:<div className="tag-cloud">{(attributes??[]).map((x:any)=><span className="badge" key={x.id}>{x.attribute_key}: {x.attribute_value||"—"}</span>)}</div>}</section>
    <section className="card"><h2>Child media</h2>{!(media??[]).length?<p className="muted">No media records yet.</p>:<div className="table-wrap"><table><thead><tr><th>Media</th><th>Type</th><th>Serial</th><th>Capacity</th><th>Data state</th><th>Latest wipe</th></tr></thead><tbody>{(media??[]).map((m:any)=>{const ts=[...(m.sanitisation_tasks??[])].sort((x:any,y:any)=>String(y.created_at).localeCompare(String(x.created_at)));return <tr key={m.id}><td><strong>{m.media_code}</strong></td><td>{m.media_type}</td><td>{m.serial||"—"}</td><td>{m.capacity_bytes?Math.round(Number(m.capacity_bytes)/1_000_000_000)+" GB":"—"}</td><td>{m.data_state}</td><td>{ts[0]?.status||"—"}</td></tr>})}</tbody></table></div>}<p><Link href="/media"><strong>Open media sanitisation queue →</strong></Link></p></section>

    <div className="grid">
      <form action={recordTest} className="card form"><h2>Record diagnostic</h2><input type="hidden" name="asset_id" value={a.id}/><label>Test<select name="test_type" defaultValue="Boot / POST"><option>Boot / POST</option><option>CPU</option><option>Memory</option><option>Storage health</option><option>Battery</option><option>Display</option><option>Keyboard</option><option>Touchpad</option><option>Webcam</option><option>Microphone</option><option>Speakers</option><option>Wi-Fi</option><option>Bluetooth</option><option>Ethernet</option><option>USB</option><option>HDMI / video out</option><option>Charging</option><option>Thermals</option><option>BIOS / UEFI</option><option>Physical condition</option></select></label><label>Result<select name="result" defaultValue="PASS"><option>PASS</option><option>FAIL</option><option>REVIEW</option><option>NOT_PRESENT</option><option>NOT_TESTED</option></select></label><label>Notes<textarea name="notes"/></label><button className="button">Record test</button></form>
      <form action={recordDisposition} className="card form"><h2>Record disposition</h2><input type="hidden" name="asset_id" value={a.id}/><label>Route<select name="disposition_type" defaultValue="HOLD"><option>REFURBISH</option><option>SELL</option><option>DONATE</option><option>PARTS</option><option>RECYCLE</option><option>RETURN</option><option>HOLD</option><option>REJECT</option></select></label><label>Destination<input name="destination" placeholder="Buyer, charity, downstream recycler..." /></label><label>Notes<textarea name="notes"/></label><button className="button">Record disposition</button></form>
    </div>

    <div className="grid">
      <form action={createRepair} className="card form"><h2>Open repair ticket</h2><input type="hidden" name="asset_id" value={a.id}/><label>Diagnosis<textarea name="diagnosis" required/></label><div className="two"><label>Labour minutes<input name="estimated_labour_minutes" type="number" min="0"/></label><label>Parts cost<input name="estimated_parts_cost" type="number" min="0" step="0.01"/></label></div><label>Expected value uplift<input name="expected_value_uplift" type="number" step="0.01"/></label><button className="button secondary">Open repair</button></form>
      <form action={harvestPart} className="card form"><h2>Harvest part</h2><input type="hidden" name="asset_id" value={a.id}/><label>Part type<input name="part_type" required placeholder="RAM / SSD / charger"/></label><div className="two"><label>Manufacturer<input name="manufacturer"/></label><label>Model<input name="model"/></label></div><label>Serial<input name="serial"/></label><label>Specification<input name="specification"/></label><div className="two"><label>Test status<input name="test_status"/></label><label>Grade<input name="grade"/></label></div><label>Estimated value<input name="estimated_value" type="number" min="0" step="0.01"/></label><button className="button secondary">Create part record</button></form>
      <form action={createException} className="card form"><h2>Open exception</h2><input type="hidden" name="entity_type" value="asset"/><input type="hidden" name="entity_id" value={a.id}/><label>Type<input name="exception_type" required placeholder="DAMAGED_BATTERY"/></label><label>Severity<select name="severity" defaultValue="MEDIUM"><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></select></label><label>Summary<textarea name="summary" required/></label><button className="button secondary">Open exception</button></form>
    </div>

    <div className="grid">
      <form action={applyDefect} className="card form"><h2>Apply defect / devaluation</h2><input type="hidden" name="asset_id" value={a.id}/><label>Template<select name="template_id" required defaultValue=""><option value="" disabled>Select defect</option>{(defectTemplates??[]).filter((d:any)=>!d.category||d.category===a.category).map((d:any)=><option key={d.id} value={d.id}>{d.name} · {d.severity}</option>)}</select></label><label>Reference value<input name="reference_value" type="number" min="0" step="0.01" placeholder="Used for % devaluation"/></label><label>Specific notes<textarea name="description"/></label><button className="button secondary">Apply defect</button></form>
      <section className="card"><h2>Routing recommendations</h2>{!matchingRules.length?<p className="muted">No enabled rule matches this asset.</p>:<div className="result-list">{matchingRules.map((rule:any)=><form action={applyWorkflowRule} className="result-row" key={rule.id}><input type="hidden" name="asset_id" value={a.id}/><input type="hidden" name="rule_id" value={rule.id}/><strong>{rule.name}</strong><span>{JSON.stringify(rule.action)}</span><button className="button secondary">Apply recommendation</button></form>)}</div>}</section>
    </div>
    <section className="card"><h2>Defects / devaluation</h2>{!(defects??[]).length?<p className="muted">No defects applied.</p>:<div className="table-wrap"><table><thead><tr><th>Defect</th><th>Severity</th><th>Grade penalty</th><th>Value penalty</th><th>Route override</th></tr></thead><tbody>{(defects??[]).map((d:any)=><tr key={d.id}><td>{d.defect_templates?.name||d.description||"Defect"}</td><td>{d.defect_templates?.severity||"—"}</td><td>{d.applied_grade_penalty}</td><td>{"$"+Number(d.applied_value_penalty||0).toFixed(2)}</td><td>{d.route_override||"—"}</td></tr>)}</tbody></table></div>}</section>

    <section className="card"><h2>Tests</h2>{!tests?.length?<p className="muted">No tests recorded.</p>:<div className="table-wrap"><table><thead><tr><th>Time</th><th>Test</th><th>Result</th><th>Notes</th></tr></thead><tbody>{tests.map((t:any)=><tr key={t.id}><td>{new Date(t.created_at).toLocaleString("en-AU")}</td><td>{t.test_type}</td><td><span className="badge">{t.result}</span></td><td>{t.notes||"—"}</td></tr>)}</tbody></table></div>}</section>
    <section className="card"><h2>Repair / parts / exception summary</h2><p>Repairs: {repairs?.length??0} · Harvested parts: {parts?.length??0} · Exceptions: {exceptions?.filter((x:any)=>x.status!=="RESOLVED").length??0} open</p></section>
    <section className="card"><h2>Disposition history</h2>{!dispositions?.length?<p className="muted">No disposition recorded.</p>:<div className="table-wrap"><table><thead><tr><th>Time</th><th>Route</th><th>Destination</th><th>Notes</th></tr></thead><tbody>{dispositions.map((d:any)=><tr key={d.id}><td>{new Date(d.decided_at).toLocaleString("en-AU")}</td><td>{d.disposition_type}</td><td>{d.destination||"—"}</td><td>{d.notes||"—"}</td></tr>)}</tbody></table></div>}</section>

    <section className="card"><h2>Certificates</h2><div className="actions">{certTypes.map(type=><form action={issueCertificate} key={type}><input type="hidden" name="asset_id" value={a.id}/><input type="hidden" name="certificate_type" value={type}/><button className="button secondary" type="submit">Issue {type.replace("_"," ")}</button></form>)}</div>
      {!!certs?.length && <div className="table-wrap"><table><thead><tr><th>Certificate</th><th>Type</th><th>Status</th><th>Issued</th></tr></thead><tbody>{certs.map((c:any)=><tr key={c.id}><td><Link href={"/certificates/"+c.id}><strong>{c.certificate_code}</strong></Link></td><td>{c.certificate_type}</td><td>{c.status}</td><td>{new Date(c.issued_at).toLocaleString("en-AU")}</td></tr>)}</tbody></table></div>}</section>

    <section className="card"><h2>Asset audit history</h2>{!events?.length?<p className="muted">No events yet.</p>:<div className="table-wrap"><table><thead><tr><th>Time</th><th>Event</th></tr></thead><tbody>{events.map((e:any)=><tr key={e.id}><td>{new Date(e.created_at).toLocaleString("en-AU")}</td><td>{e.event_type}</td></tr>)}</tbody></table></div>}</section>
  </div>;
}
