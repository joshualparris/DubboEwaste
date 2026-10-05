import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { runTriage } from "./actions";

export default async function TriagePage({ searchParams }: { searchParams: Promise<{ error?: string; decision?: string; reasons?: string; required?: string; saved?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: assets } = await supabase.from("assets").select("id,asset_code,category,manufacturer,model,status").order("created_at",{ascending:false}).limit(100);
  const reasons = params.reasons ? params.reasons.split("|").filter(Boolean) : [];
  const required = params.required ? params.required.split("|").filter(Boolean) : [];

  return <div className="stack">
    <div>
      <div className="badge">Front-door decision support</div>
      <h1>Guided triage</h1>
      <p className="muted">Deterministic Phase 0 ACCEPT / HOLD / REJECT logic. It defaults to HOLD when authority, safety, lock, sanitisation or route evidence is incomplete.</p>
      <div className="actions"><Link className="button secondary" href="/documents/front-door-triage">Open triage procedure</Link><Link className="button secondary" href="/assets/new">Receive asset</Link></div>
    </div>

    {params.error ? <div className="error">{params.error}</div> : null}

    {params.decision ? <section className={params.decision === "ACCEPT" ? "success decision-card" : params.decision === "REJECT" ? "error decision-card" : "card decision-card"}>
      <div className="badge">{params.decision}</div>
      <h2>{params.decision === "ACCEPT" ? "Recorded gates passed" : params.decision === "REJECT" ? "Do not accept as ordinary stock" : "Hold until the missing gates are resolved"}</h2>
      {reasons.length ? <><strong>Reasons</strong><ul>{reasons.map((reason,index)=><li key={index}>{reason}</li>)}</ul></> : <p>No blocking reasons were returned.</p>}
      {required.length ? <><strong>Required evidence / action</strong><ul>{required.map((item,index)=><li key={index}>{item}</li>)}</ul></> : null}
      {params.saved === "1" ? <p><strong>Saved:</strong> this assessment was attached to the selected asset.</p> : <p className="small">Pre-screen only. Select an existing asset below if you want the assessment stored in its operational record.</p>}
    </section> : null}

    <form action={runTriage} className="card form">
      <h2>Run arrival / intake triage</h2>
      <label>Existing asset (optional)<select name="asset_id" defaultValue=""><option value="">Pre-screen only / asset not yet created</option>{(assets??[]).map((asset:any)=><option key={asset.id} value={asset.id}>{asset.asset_code} · {[asset.manufacturer,asset.model].filter(Boolean).join(" ")||asset.category} · {asset.status}</option>)}</select></label>
      <div className="two">
        <label>Device category<select name="device_category" defaultValue="laptop"><option value="laptop">Laptop</option><option value="desktop/mini-pc">Desktop / mini-PC</option><option value="phone/tablet">Phone / tablet</option><option value="monitor">Monitor</option><option value="tv">TV · prior approval</option><option value="printer">Printer · prior approval</option><option value="mixed_business_lot">Mixed business lot · prior approval</option><option value="loose_battery">Loose battery · not accepted</option><option value="other">Other / unknown</option></select></label>
        <label>Physical condition<select name="physical_state" defaultValue="GOOD"><option>GOOD</option><option>FAIR</option><option>POOR</option><option>UNSAFE</option></select></label>
      </div>
      <div className="two">
        <label>Transfer authority recorded?<select name="transfer_authority_recorded" defaultValue="yes"><option value="yes">Yes</option><option value="no">No / unclear</option></select></label>
        <label>Battery condition<select name="battery_condition" defaultValue="ok"><option value="ok">No visible hazard</option><option value="unknown">Unknown / not screened</option><option value="swollen">Swollen / bulging</option><option value="damaged">Damaged / crushed</option><option value="hot">Hot / overheated</option><option value="leaking">Leaking</option><option value="punctured">Punctured</option><option value="not_applicable">Not applicable</option></select></label>
      </div>
      <div className="two">
        <label>Account / management lock<select name="account_lock_status" defaultValue="clear"><option value="clear">Clear / legitimately released</option><option value="unknown">Unknown / not checked</option><option value="locked">Locked</option><option value="activation lock">Apple Activation Lock</option><option value="frp">Google FRP</option><option value="mdm">MDM / enterprise enrolment</option><option value="autopilot">Windows Autopilot</option><option value="not_applicable">Not applicable</option></select></label>
        <label>Data-bearing?<select name="data_bearing" defaultValue="yes"><option value="yes">Yes / assume yes</option><option value="no">No</option></select></label>
      </div>
      <div className="two">
        <label>Sanitisation result<select name="sanitisation_result" defaultValue="NOT_YET"><option value="PASS">PASS recorded</option><option value="NOT_YET">Not yet / not verified</option><option value="NOT_APPLICABLE">Not applicable</option></select></label>
        <label>Realistic final route<select name="final_route" defaultValue="NONE"><option value="NONE">Not yet known</option><option value="REFURBISH">Refurbish / resale</option><option value="DONATE">Approved reuse / donation</option><option value="PARTS">Parts / donor</option><option value="RECYCLE">Named downstream recycler</option><option value="RETURN">Return to owner/source</option></select></label>
      </div>
      <button className="button" type="submit">Run triage decision</button>
      <p className="muted small">Decision support only. It is not a physical safety inspection, legal determination or sanitisation certificate.</p>
    </form>
  </div>;
}
