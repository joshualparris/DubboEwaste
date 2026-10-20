import Link from "next/link";
import { redirect } from "next/navigation";
import { EvidenceUpload } from "@/components/EvidenceUpload";
import { requireProgrammeContext } from "@/lib/programme-context";
import { createPilotBatch, updatePilotBatch, recordPilotCustody, recordDonationHandover, recordPilotTransferAuthority } from "./actions";

const roles = ["admin", "manager", "technician"];
const documentFields = [
  ["approval_evidence_id", "Council's written approval and custody/ownership terms"],
  ["insurance_evidence_id", "Insurer's written coverage response"],
  ["risk_assessment_evidence_id", "Site-specific risk assessment"],
  ["site_evidence_id", "Site safety / premises approval evidence"],
  ["downstream_plan_evidence_id", "Verified rejected-device and battery downstream plan"],
] as const;

type Row = Record<string, any>;
export default async function CouncilPilotPage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string; error?: string; notice?: string }>;
}) {
  const params = await searchParams;
  const { supabase, context } = await requireProgrammeContext();
  if (!context.global_admin && (context.selected !== "dubbo_ewaste" || !roles.includes(context.role || ""))) {
    redirect("/programmes?error=Choose%20an%20authorised%20E-waste%20programme");
  }
  const canSupervise = context.global_admin || ["admin", "manager"].includes(context.role || "");
  const [{ data: batches, error: listError }, { data: jobs }] = await Promise.all([
    supabase.from("council_pilot_batches").select("*").order("created_at", { ascending: false }),
    supabase.from("jobs").select("id,job_code,expected_asset_count,source_site").eq("programme", "dubbo_ewaste").order("created_at", { ascending: false }),
  ]);
  const rows = (batches || []) as Row[];
  const selected = rows.find(b => b.id === params.batch) || rows[0];
  const [{ data: readiness }, { data: jobEvidence }, { data: allAssetEvidence }, { data: custody }, { data: handoffs }] = selected
    ? await Promise.all([
      supabase.from("council_pilot_readiness").select("*").eq("batch_id", selected.id).order("asset_code"),
      supabase.from("evidence").select("id,filename,sha256,captured_at").eq("entity_type", "job").eq("entity_id", selected.job_id).order("captured_at", { ascending: false }),
      supabase.from("evidence").select("id,entity_id,filename,sha256").eq("entity_type", "asset").order("captured_at", { ascending: false }).limit(500),
      supabase.from("pilot_custody_events").select("id,asset_id,event_type,reference,created_at").order("created_at", { ascending: false }).limit(300),
      supabase.from("donation_handoffs").select("asset_id,recipient_organisation,receipt_reference,acknowledged_at"),
    ]) : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }];
  const devices = (readiness || []) as Row[];
  const passed = devices.filter(r => r.ready_to_donate).length;
  const [{data:agreements},{data:agreementReadiness}] = selected
    ? await Promise.all([
      supabase.from("council_pilot_agreements").select("id,reference,revision_number,status,expires_on").eq("batch_id",selected.id).order("revision_number",{ascending:false}),
      supabase.from("council_pilot_agreement_readiness").select("*").eq("batch_id",selected.id).maybeSingle(),
    ])
    : [{data:[]},{data:null}];
  const {data:riskReadiness}=selected
    ? await supabase.from("council_risk_dashboard").select("*").eq("batch_id",selected.id).maybeSingle()
    : {data:null};
  const {data:custodyStatus}=selected ? await supabase.from("council_custody_asset_status")
    .select("asset_id,release_evidence_complete,open_discrepancies,pending_handoffs").eq("batch_id",selected.id)
    : {data:[]};
  const operationalActive = agreementReadiness?.collection_authorised === true && riskReadiness?.ready===true;
  const job = (jobs || []).find(j => j.id === selected?.job_id);
  const jobFiles = (jobEvidence || []) as Row[];
  const assetFiles = (allAssetEvidence || []) as Row[];
  const events = (custody || []) as Row[];
  const acknowledgements = (handoffs || []) as Row[];

  function evidenceOptions(files: Row[], current?: string) {
    return <><option value="">Not yet uploaded / selected</option>{files.map(e =>
      <option key={e.id} value={e.id}>{e.filename}{e.id === current ? " (selected)" : ""}</option>)}</>;
  }

  return <div className="stack">
    <div>
      <div className="badge">Controlled 20-device donation-only pilot</div>
      <h1>Dubbo Council pilot readiness</h1>
      <p className="muted">Designed for a proposed Council-authorised reuse trial, not general intake. Council approval, insurance, premises permission, physical inspections and external arrangements must be genuine and documented.</p>
      <div className="actions">
        <Link className="button secondary" href="/jobs">Inbound jobs</Link>
        <Link className="button secondary" href="/media">Sanitisation workbench</Link>
        <Link className="button secondary" href="/recycling">Downstream recycling</Link>
        {selected ? <>
          <Link className="button secondary" href={"/council-pilot/agreements?batch="+selected.id}>Manage signed Council agreement</Link>
          <Link className="button secondary" href={"/council-pilot/risks?batch="+selected.id}>Risk register and stop-work</Link>
        </> : null}
        <Link className="button secondary" href="/triage">Safety triage</Link>
        {selected ? <>
          <Link className="button secondary" href={"/council-pilot/custody?batch="+selected.id}>QR custody and stocktake</Link>
          <Link className="button secondary" href={"/api/council-pilot/export?batch=" + selected.id}>Export private Council CSV</Link>
        </> : null}
      </div>
    </div>
    {params.error ? <div className="error" role="alert">{params.error}</div> : null}
    {params.notice ? <div className="success" role="status">{params.notice}</div> : null}
    {listError ? <div className="error">Council pilot tables are not available. Apply the reviewed database migration before using this page: {listError.message}</div> : null}

    {canSupervise ? <section className="card">
      <h2>Create a Council batch (draft only)</h2>
      <p className="muted">Use a dedicated inbound job with expected count 20 or fewer. Draft creation does not authorise any collection.</p>
      <form action={createPilotBatch} className="form">
        <label>Existing job
          <select name="job_id" required defaultValue="">
            <option value="">Choose an E-waste inbound job</option>
            {(jobs || []).filter(j => !rows.some(b => b.job_id === j.id)).map(j =>
              <option key={j.id} value={j.id}>{j.job_code} · {j.source_site || "No source"} · {j.expected_asset_count ?? "?"} expected</option>)}
          </select>
        </label>
        <button className="button" type="submit">Create draft batch</button>
      </form>
    </section> : null}

    {rows.length > 1 ? <section className="card">
      <h2>Existing pilot batches</h2>
      <div className="actions">{rows.map(b => <Link key={b.id} className="button secondary" href={"/council-pilot?batch=" + b.id}>
        {(jobs || []).find(j => j.id === b.job_id)?.job_code || b.id.slice(0,8)} · {b.status}
      </Link>)}</div>
    </section> : null}

    {selected ? <>
      <section className="card">
        <h2>{job?.job_code || "Council pilot"} · {selected.status}</h2>
        <p>Registered devices: <strong>{devices.length}/20</strong> · Fully release-ready: <strong>{passed}</strong> · Blocked: <strong>{devices.length - passed}</strong></p>
        <p><strong>Verified custody release:</strong> {(custodyStatus||[]).filter(x=>x.release_evidence_complete===true).length} device(s) have a complete independently acknowledged chain, signed stocktake and no unresolved discrepancies.</p>
        <p><strong>Risk and safety release:</strong> {riskReadiness?.ready===true?"Recorded risk requirements passed":"BLOCKED — missing Council-approved matrix, accepted assessments or verified controls"}</p>
        <p><Link href={"/council-pilot/risks?batch="+selected.id}>Review hazards, outstanding controls and emergency stop-work rules</Link>.</p>
        <p><strong>Signed Council agreement:</strong> {operationalActive ? "Currently within recorded collection scope" : "BLOCKED — no valid linked agreement, or expired/revoked/paused"}</p>
        <p className="muted">The agreement's real dates, allowed collection sites and permitted activities are enforced independently of the batch ACTIVE flag.</p>
        <p className="muted">Draft and paused batches cannot accept devices. Donation is blocked without the required records. Recycling closeout also requires a verified downstream receipt. These records do not replace physical testing or Council approval.</p>
      </section>

      {canSupervise ? <section className="card">
        <h2>Governance and activation</h2>
        <EvidenceUpload entityType="job" entityId={selected.job_id} label="Upload Council approval / insurance / risk / site / downstream files" />
        <p className="muted">Documents are stored privately with SHA-256 evidence digests. Upload them first, then select each file below. Never use a quote or unaccepted proposal as if it were written approval.</p>
        <form action={updatePilotBatch} className="form">
          <input type="hidden" name="batch_id" value={selected.id} />
          <label>Versioned, independently reviewed Council agreement
            <select name="approved_agreement_id" defaultValue={selected.approved_agreement_id || ""}>
              <option value="">No agreement linked — activation blocked</option>
              {(agreements||[]).filter(a=>a.status==="APPROVED").map(a=>
                <option key={a.id} value={a.id}>Revision {a.revision_number} · {a.reference} · expires {a.expires_on}</option>)}
            </select>
          </label>
          <p className="muted small">First <Link href={"/council-pilot/agreements?batch="+selected.id}>record, independently review and approve the signed agreement</Link>. Then link it here and activate with the other five governance documents.</p>
          <label>Written Council approval / trial reference<input name="council_reference" defaultValue={selected.council_reference || ""} maxLength={200}/></label>
          {documentFields.map(([key,label]) => <label key={key}>{label}
            <select name={key} defaultValue={selected[key] || ""}>{evidenceOptions(jobFiles, selected[key])}</select>
          </label>)}
          <label>Authorisation state
            <select name="status" defaultValue={selected.status}>
              <option value="DRAFT">DRAFT: no Council collection</option>
              <option value="ACTIVE">ACTIVE: signed evidence verified by supervisor</option>
              <option value="PAUSED">PAUSED: collection/release stopped</option>
              <option value="CLOSED">CLOSED: complete and locked</option>
            </select>
          </label>
          <label>Governance notes<textarea name="operator_notes" defaultValue={selected.operator_notes || ""} /></label>
          <button className="button" type="submit">Save governance / activation decision</button>
        </form>
      </section> : null}

      <section className="card">
        <h2>Device readiness and next actions</h2>
        <div className="stack">
          {devices.length === 0 ? <p>No devices assigned. {operationalActive ? <Link href={"/assets/new?job=" + selected.job_id}>Receive the first serialised asset</Link> : <strong>Device receipt is locked until the Council pilot is ACTIVE with genuine approvals.</strong>}</p> : null}
          {devices.map(asset => {
            const files = assetFiles.filter(e => e.entity_id === asset.asset_id);
            const blockers = Array.isArray(asset.blockers) ? asset.blockers as string[] : [];
            const acknowledgement = acknowledgements.find(h => h.asset_id === asset.asset_id);
            return <details className="card" key={asset.asset_id}>
              <summary><strong>{asset.asset_code}</strong> · {asset.category} · {asset.asset_status} · {asset.ready_to_donate ? "RELEASE CHECKS PASSED" : blockers.length + " open blockers"}</summary>
              <div className="stack">
                <p><Link href={"/assets/" + asset.asset_id}>Open asset, tests, media and certificates</Link></p>
                {blockers.length ? <ul>{blockers.map((blocker,i) => <li key={i}>{blocker}</li>)}</ul> : <p className="success">All recorded release prerequisites present. Confirm physical equipment and recipient before dispatch.</p>}
                <EvidenceUpload entityType="asset" entityId={asset.asset_id} label="Attach custody, ownership or signed recipient evidence" />
                <h3>Signed Council transfer / donation authority</h3>
                <form action={recordPilotTransferAuthority} className="form">
                  <input type="hidden" name="batch_id" value={selected.id} />
                  <input type="hidden" name="asset_id" value={asset.asset_id} />
                  <label>Legal authority type<select name="authority_type"><option value="OWNER_TRANSFER">OWNER_TRANSFER</option><option value="DONATION">DONATION</option><option value="BUSINESS_DISPOSAL_AUTHORITY">BUSINESS_DISPOSAL_AUTHORITY</option></select></label>
                  <label>Owner / source name<input name="source_party" required minLength={3}/></label>
                  <label>Signed transfer reference<input name="reference" required minLength={3}/></label>
                  <label>Signed transfer document (upload above first)<select name="evidence_id" required defaultValue="">{evidenceOptions(files)}</select></label>
                  <button className="button secondary">Record signed transfer authority</button>
                </form>
                <h3>Two-person QR custody ledger</h3>
                <p className="muted">Direct one-person custody entries are disabled. Both operators must scan the physical device, provide original evidence and acknowledge handover before custody becomes verified.</p>
                <Link className="button secondary" href={"/council-pilot/custody?batch="+selected.id}>Open secure custody and reconciliation</Link>
                <h3>Recipient acceptance and handover</h3>
                {acknowledgement ? <p>Receipt {acknowledgement.receipt_reference} · {acknowledgement.recipient_organisation} · {new Date(acknowledgement.acknowledged_at).toLocaleString("en-AU")}</p>
                  : <form action={recordDonationHandover} className="form">
                    <input type="hidden" name="batch_id" value={selected.id} />
                    <input type="hidden" name="asset_id" value={asset.asset_id} />
                    <label>Community organisation<input name="recipient_organisation" required minLength={3}/></label>
                    <label>Person who signed for the equipment<input name="recipient_name" required minLength={3}/></label>
                    <label>Receipt / acceptance reference<input name="receipt_reference" required minLength={3}/></label>
                    <label>Signed recipient acceptance evidence<select name="acceptance_evidence_id" required defaultValue="">{evidenceOptions(files)}</select></label>
                    <label>Disclosed condition, OS/support, charger and limitations<textarea name="condition_disclosure" required minLength={10}/></label>
                    <button className="button secondary">Record signed recipient acceptance</button>
                  </form>}
                <p className="muted">Only after all blockers disappear, record DONATE from the asset page. Do not physically dispatch earlier.</p>
              </div>
            </details>;
          })}
        </div>
      </section>
      <p className="muted">Private operational records and identifiable receipt details must not be published to GitHub or included in public environmental impact figures.</p>
    </> : <section className="card"><p>No Council batch exists. Create an inbound job first; written approval is still required before collection.</p></section>}
  </div>;
}
