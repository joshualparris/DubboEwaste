import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrintButton } from "@/components/PrintButton";

const descriptions:Record<string,string>={
  RECEIPT:"Evidence of receipt, authority and intake state at the time of issue.",
  RECEIVING:"Chain-of-custody snapshot for received equipment.",
  SANITISATION:"Evidence snapshot of tracked media and recorded sanitisation outcomes.",
  DESTRUCTION:"Evidence snapshot of media recorded as physically destroyed.",
  DISPOSITION:"Final route decision with supporting grade/test evidence.",
  RECYCLING:"Completed downstream recycling handoff and receipt snapshot.",
  DEVICE_HISTORY:"Broader asset lifecycle snapshot.",
  ENVIRONMENTAL:"Environmental reporting snapshot tied to a versioned methodology.",
};

export default async function CertificatePage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const supabase=await createClient();
  const {data:cert}=await supabase.from("certificates").select("*,certificate_vault_records(*)").eq("id",id).single();
  if(!cert) notFound();
  const snap:any=cert.snapshot || {};
  const asset=snap.asset || {};
  return <div className="stack certificate">
    <div className="actions no-print"><PrintButton />{cert.verification_token?<Link className="button secondary" href={"/verify/"+cert.verification_token}>Public verification</Link>:null}</div>
    <section className="card certificate-sheet">
      <div className="badge">{cert.certificate_type}</div>
      <h1>DubboEwaste {String(cert.certificate_type).replaceAll("_"," ")} Certificate</h1>
      <h2>{cert.certificate_code}</h2>
      <p>{descriptions[cert.certificate_type]||"Immutable operational evidence snapshot."}</p>
      <p className="muted">Issued {new Date(cert.issued_at).toLocaleString("en-AU")} · Status {cert.status||"ISSUED"} · Template v{cert.template_version||"1"}</p>
      <hr />
      <div className="grid">
        <div><strong>Asset</strong><p>{asset.asset_code || "—"}</p></div>
        <div><strong>Device</strong><p>{[asset.manufacturer,asset.model].filter(Boolean).join(" ") || asset.category || "—"}</p></div>
        <div><strong>Serial / IMEI</strong><p>{asset.serial_imei || "—"}</p></div>
        <div><strong>Data state</strong><p>{asset.data_state || "—"}</p></div>
      </div>

      {snap.authority?.length?<><h2>Authority / ownership</h2><table><thead><tr><th>Basis</th><th>Source</th><th>Reference</th><th>Recorded</th></tr></thead><tbody>{snap.authority.map((r:any,i:number)=><tr key={i}><td>{r.authority_type}</td><td>{r.source_party||"—"}</td><td>{r.reference||"—"}</td><td>{r.created_at?new Date(r.created_at).toLocaleString("en-AU"):"—"}</td></tr>)}</tbody></table></>:null}

      {snap.triage?<><h2>Intake triage</h2><p><strong>{snap.triage.decision}</strong> · Safety {snap.triage.safety_state} · Battery {snap.triage.battery_state} · Lock {snap.triage.lock_state} · Physical {snap.triage.physical_state}</p>{snap.triage.notes?<p>{snap.triage.notes}</p>:null}</>:null}

      {snap.tests?.length?<><h2>Recorded tests</h2><table><thead><tr><th>Test</th><th>Result</th><th>Notes</th></tr></thead><tbody>{snap.tests.map((t:any,i:number)=><tr key={i}><td>{t.test_type}</td><td>{t.result}</td><td>{t.notes||"—"}</td></tr>)}</tbody></table></>:null}

      {snap.grade?<><h2>Grade</h2><p><strong>Final:</strong> {snap.grade.final_grade||"—"} · Functional {snap.grade.functional_grade||"—"} · Cosmetic {snap.grade.cosmetic_grade||"—"} · Battery {snap.grade.battery_grade||"—"} · Completeness {snap.grade.completeness_grade||"—"}</p></>:null}

      {snap.media?.length?<><h2>Media / sanitisation</h2><table><thead><tr><th>Media</th><th>Type</th><th>Data state</th><th>Evidence</th></tr></thead><tbody>{snap.media.map((m:any)=><tr key={m.id}><td>{m.media_code}</td><td>{m.media_type}</td><td>{m.data_state}</td><td>{(m.sanitisation_tasks??[]).map((t:any,i:number)=><div key={i}>{t.status} · {t.tool_name||t.method||"manual"} {t.verification_result?"· "+t.verification_result:""} {t.raw_report_hash?"· hash "+String(t.raw_report_hash).slice(0,16)+"…":""}</div>)}</td></tr>)}</tbody></table></>:null}

      {snap.disposition?<><h2>Disposition</h2><p>{String(snap.disposition.disposition_type)+(snap.disposition.destination ? " → "+snap.disposition.destination : "")}</p>{snap.disposition.notes?<p>{snap.disposition.notes}</p>:null}</>:null}

      {snap.outbound?.length?<><h2>Downstream handoff</h2><table><thead><tr><th>Order</th><th>Status</th><th>Provider</th><th>Destination / evidence</th></tr></thead><tbody>{snap.outbound.map((o:any,i:number)=>{const order=o.outbound_orders||{};const vendor=order.downstream_vendors||{};return <tr key={i}><td>{order.outbound_code||"—"}</td><td>{order.status||"—"}</td><td>{vendor.name||"—"}</td><td>{order.destination||vendor.first_downstream_facility||order.received_confirmation||"—"}</td></tr>})}</tbody></table></>:null}

      {snap.methodologies?.length?<><h2>Environmental methodology</h2>{snap.methodologies.map((m:any,i:number)=><div key={i}><p><strong>{m.name} v{m.version}</strong></p><p>{m.description}</p>{m.source_url?<p>{m.source_url}</p>:null}</div>)}</>:null}

      <hr />
      <p className="small"><strong>Snapshot SHA-256:</strong> {cert.snapshot_sha256||"Not recorded"}</p>
      {cert.certificate_vault_records ? <p className="small"><strong>Audit vault chain:</strong> {cert.certificate_vault_records.chain_sha256} · {cert.certificate_vault_records.vault_status} · signature {cert.certificate_vault_records.signature_status}</p> : <p className="small"><strong>Audit vault:</strong> Not recorded</p>}
      <p className="small muted">This is a tamper-evident snapshot hash, not an asymmetric digital signature. Third-party erase, destruction, recycling or certification claims are represented only when supported by records/evidence captured at issue time.</p>
    </section>
  </div>;
}
