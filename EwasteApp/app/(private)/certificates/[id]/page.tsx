import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrintButton } from "@/components/PrintButton";

export default async function CertificatePage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const supabase=await createClient();
  const {data:cert}=await supabase.from("certificates").select("*").eq("id",id).single();
  if(!cert) notFound();
  const snap:any=cert.snapshot || {};
  const asset=snap.asset || {};
  return <div className="stack certificate">
    <div className="actions no-print"><PrintButton />{cert.verification_token?<Link className="button secondary" href={"/verify/"+cert.verification_token}>Public verification</Link>:null}</div>
    <section className="card certificate-sheet">
      <div className="badge">{cert.certificate_type}</div>
      <h1>DubboEwaste Certificate</h1>
      <h2>{cert.certificate_code}</h2>
      <p className="muted">Issued {new Date(cert.issued_at).toLocaleString("en-AU")} · Status {cert.status||"ISSUED"}</p>
      <hr />
      <div className="grid">
        <div><strong>Asset</strong><p>{asset.asset_code || "—"}</p></div>
        <div><strong>Device</strong><p>{[asset.manufacturer,asset.model].filter(Boolean).join(" ") || asset.category || "—"}</p></div>
        <div><strong>Serial / IMEI</strong><p>{asset.serial_imei || "—"}</p></div>
        <div><strong>Data state</strong><p>{asset.data_state || "—"}</p></div>
      </div>
      <h2>Recorded tests</h2>
      {!snap.tests?.length?<p>No tests were present in the snapshot.</p>:<table><thead><tr><th>Test</th><th>Result</th><th>Notes</th></tr></thead><tbody>{snap.tests.map((t:any,i:number)=><tr key={i}><td>{t.test_type}</td><td>{t.result}</td><td>{t.notes||"—"}</td></tr>)}</tbody></table>}
      <h2>Media / sanitisation</h2>
      {!snap.media?.length?<p>No child media records were present in the snapshot.</p>:<table><thead><tr><th>Media</th><th>Type</th><th>Data state</th><th>Evidence</th></tr></thead><tbody>{snap.media.map((m:any)=><tr key={m.id}><td>{m.media_code}</td><td>{m.media_type}</td><td>{m.data_state}</td><td>{(m.sanitisation_tasks??[]).map((t:any,i:number)=><div key={i}>{t.status} · {t.tool_name||t.method||"manual"} {t.raw_report_hash?"· hash "+String(t.raw_report_hash).slice(0,16)+"…":""}</div>)}</td></tr>)}</tbody></table>}
      <h2>Disposition</h2>
      <p>{snap.disposition ? String(snap.disposition.disposition_type)+(snap.disposition.destination ? " → "+snap.disposition.destination : "") : "No disposition recorded at issue time."}</p>
      <hr />
      <p className="small"><strong>Snapshot SHA-256:</strong> {cert.snapshot_sha256||"Not recorded"}</p>
      <p className="small muted">This is a tamper-evident snapshot hash, not an asymmetric digital signature. Third-party erase/destruction claims are only represented when the underlying evidence is attached to the operational record.</p>
    </section>
  </div>;
}
