import Link from "next/link";
import { notFound } from "next/navigation";
import { AssetQr } from "@/components/AssetQr";
import { createClient } from "@/lib/supabase/server";
import { issueCertificate, recordDisposition, recordTest } from "../../operations/actions";

export default async function AssetPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{error?:string}> }) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const [{ data: asset }, { data: events }, { data: tests }, { data: dispositions }, { data: certs }] = await Promise.all([
    supabase.from("assets").select("*,customers(name),jobs(job_code),lots(lot_code),locations(name)").eq("id", id).single(),
    supabase.from("asset_events").select("id,event_type,created_at,details").eq("asset_id", id).order("created_at", { ascending: false }).limit(25),
    supabase.from("asset_tests").select("*").eq("asset_id", id).order("created_at", { ascending: false }),
    supabase.from("dispositions").select("*").eq("asset_id", id).order("decided_at", { ascending: false }),
    supabase.from("certificates").select("id,certificate_code,certificate_type,issued_at").eq("asset_id", id).order("issued_at", { ascending: false }),
  ]);
  if (!asset) notFound();
  const a:any=asset;

  return <div className="stack">
    <div><div className="badge">{a.status}</div><h1>{a.asset_code}</h1><p className="muted">{[a.manufacturer,a.model].filter(Boolean).join(" ")||a.category}</p></div>
    {query.error ? <div className="error">{query.error}</div> : null}
    <div className="grid">
      <section className="card"><h2>Asset label</h2><AssetQr assetCode={a.asset_code} assetId={a.id} /></section>
      <section className="card"><h2>Custody</h2><p><strong>Customer:</strong> {a.customers?.name||a.source_name||"—"}</p><p><strong>Job:</strong> {a.jobs?.job_code||"—"}</p><p><strong>Origin lot:</strong> {a.lots?.lot_code||"—"}</p><p><strong>Location:</strong> {a.locations?.name||"—"}</p><p><strong>Received:</strong> {new Date(a.received_at).toLocaleString("en-AU")}</p></section>
      <section className="card"><h2>Intake state</h2><p><strong>Category:</strong> {a.category}</p><p><strong>Serial / IMEI:</strong> {a.serial_imei||"—"}</p><p><strong>Ownership verified:</strong> {a.ownership_verified?"Yes":"No"}</p><p><strong>Data state:</strong> {a.data_state}</p><p><strong>Initial route:</strong> {a.initial_route||"—"}</p></section>
    </div>
    <section className="card"><h2>Notes</h2><p>{a.notes||"No notes yet."}</p></section>

    <div className="grid">
      <form action={recordTest} className="card form"><h2>Record basic test</h2><input type="hidden" name="asset_id" value={a.id}/><label>Test<select name="test_type" defaultValue="Boot / POST"><option>Boot / POST</option><option>Storage health</option><option>Memory</option><option>Display</option><option>Keyboard</option><option>Wi-Fi</option><option>Battery</option><option>Charging</option><option>Physical condition</option></select></label><label>Result<select name="result" defaultValue="PASS"><option>PASS</option><option>FAIL</option><option>REVIEW</option><option>NOT_PRESENT</option><option>NOT_TESTED</option></select></label><label>Notes<textarea name="notes"/></label><button className="button" type="submit">Record test</button></form>
      <form action={recordDisposition} className="card form"><h2>Record disposition</h2><input type="hidden" name="asset_id" value={a.id}/><label>Route<select name="disposition_type" defaultValue="HOLD"><option>REFURBISH</option><option>SELL</option><option>DONATE</option><option>PARTS</option><option>RECYCLE</option><option>RETURN</option><option>HOLD</option><option>REJECT</option></select></label><label>Destination<input name="destination" placeholder="Buyer, charity, downstream recycler..." /></label><label>Notes<textarea name="notes"/></label><button className="button" type="submit">Record disposition</button></form>
    </div>

    <section className="card"><h2>Tests</h2>{!tests?.length?<p className="muted">No tests recorded.</p>:<div className="table-wrap"><table><thead><tr><th>Time</th><th>Test</th><th>Result</th><th>Notes</th></tr></thead><tbody>{tests.map(t=><tr key={t.id}><td>{new Date(t.created_at).toLocaleString("en-AU")}</td><td>{t.test_type}</td><td><span className="badge">{t.result}</span></td><td>{t.notes||"—"}</td></tr>)}</tbody></table></div>}</section>
    <section className="card"><h2>Disposition history</h2>{!dispositions?.length?<p className="muted">No disposition recorded.</p>:<div className="table-wrap"><table><thead><tr><th>Time</th><th>Route</th><th>Destination</th><th>Notes</th></tr></thead><tbody>{dispositions.map(d=><tr key={d.id}><td>{new Date(d.decided_at).toLocaleString("en-AU")}</td><td>{d.disposition_type}</td><td>{d.destination||"—"}</td><td>{d.notes||"—"}</td></tr>)}</tbody></table></div>}</section>

    <section className="card"><h2>Certificates</h2><div className="actions">{(["RECEIPT","DISPOSITION","DEVICE_HISTORY"] as const).map(type=><form action={issueCertificate} key={type}><input type="hidden" name="asset_id" value={a.id}/><input type="hidden" name="certificate_type" value={type}/><button className="button secondary" type="submit">Issue {type.replace("_"," ")}</button></form>)}</div>
      {!!certs?.length && <div className="table-wrap"><table><thead><tr><th>Certificate</th><th>Type</th><th>Issued</th></tr></thead><tbody>{certs.map(c=><tr key={c.id}><td><Link href={`/certificates/${c.id}`}><strong>{c.certificate_code}</strong></Link></td><td>{c.certificate_type}</td><td>{new Date(c.issued_at).toLocaleString("en-AU")}</td></tr>)}</tbody></table></div>}</section>

    <section className="card"><h2>Asset audit history</h2>{!events?.length?<p className="muted">No events yet.</p>:<div className="table-wrap"><table><thead><tr><th>Time</th><th>Event</th></tr></thead><tbody>{events.map(e=><tr key={e.id}><td>{new Date(e.created_at).toLocaleString("en-AU")}</td><td>{e.event_type}</td></tr>)}</tbody></table></div>}</section>
  </div>;
}
