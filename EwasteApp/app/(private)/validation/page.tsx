import { ResponsiveTable } from "@/components/ResponsiveTable";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addCommercialTermsQuote, addOrganisationInterview, addPilotEconomics, addRepairCafeDemand, addValidationEvidence } from "./actions";

const topicLabels: Record<string,string> = {
  AMR_DOWNSTREAM: "AMR Dubbo downstream",
  COUNCIL_CONTRACT: "Council e-waste contract / flow",
  EDUCATION_VENDOR: "NSW Education vendor / outcomes",
  ORGANISATION_DISPOSAL: "Organisation disposal practice",
  LOCAL_VOLUMES: "Local volumes",
  LOCAL_ECONOMICS: "Local economics",
  APPROVALS: "Council / Fair Trading / insurer approvals",
  SUPPLY_WILLINGNESS: "Organisation willingness to supply",
  REPAIR_CAFE_DEMAND: "Repair Café demand",
  COMMERCIAL_TERMS: "Private commercial terms",
};

const topics = Object.keys(topicLabels);

function dollars(n:number) { return "$" + n.toFixed(2); }

export default async function ValidationPage({ searchParams }: { searchParams: Promise<{error?:string;success?:string}> }) {
  const params = await searchParams;
  const supabase = await createClient();

  const [{data:evidence},{data:interviews},{data:demand},{data:quotes},{data:econ},{data:assets}] = await Promise.all([
    supabase.from("validation_evidence").select("*").order("evidence_date",{ascending:false}).order("created_at",{ascending:false}).limit(100),
    supabase.from("organisation_disposal_interviews").select("*").order("interview_date",{ascending:false}).limit(100),
    supabase.from("repair_cafe_demand_observations").select("*").order("observed_on",{ascending:false}).limit(200),
    supabase.from("commercial_terms_quotes").select("*").order("quote_date",{ascending:false}).limit(100),
    supabase.from("pilot_economics_observations").select("*,assets(asset_code,manufacturer,model)").order("observed_on",{ascending:false}).limit(200),
    supabase.from("assets").select("id,asset_code,manufacturer,model").order("created_at",{ascending:false}).limit(200),
  ]);

  const verified = new Set((evidence??[]).filter((x:any)=>x.status==="VERIFIED").map((x:any)=>x.topic));
  const requested = new Set((evidence??[]).filter((x:any)=>["REQUESTED","PARTIAL"].includes(x.status)).map((x:any)=>x.topic));
  const yesDemand = (demand??[]).filter((x:any)=>x.would_attend==="YES").length;
  const costBarrier = (demand??[]).filter((x:any)=>x.affordability_barrier===true).length;
  const willingOrgs = (interviews??[]).filter((x:any)=>x.willing_to_trial==="YES").length;
  const econRows = econ??[];
  const totalRevenue = econRows.reduce((s:number,x:any)=>s+Number(x.realised_revenue||0),0);
  const totalCosts = econRows.reduce((s:number,x:any)=>s+["acquisition_cost","collection_freight","parts_cost","downstream_cost","marketplace_fees","outbound_freight","return_cost","other_cost"].reduce((t,k)=>t+Number(x[k]||0),0),0);
  const totalMinutes = econRows.reduce((s:number,x:any)=>s+["intake_minutes","diagnostic_minutes","sanitisation_minutes","repair_minutes","listing_admin_minutes"].reduce((t,k)=>t+Number(x[k]||0),0),0);

  return <div className="stack">
    <div>
      <div className="badge">Field validation</div>
      <h1>Close the remaining Dubbo unknowns</h1>
      <p className="muted">Private evidence workspace for GIPA/informal requests, organisation interviews, Repair Café demand, commercial terms and real pilot economics. Do not put private responses into the public GitHub repo.</p>
      <div className="actions"><Link className="button secondary" href="/crm">CRM</Link><Link className="button secondary" href="/reports">Reports</Link></div>
    </div>

    {params.error?<div className="error">{params.error}</div>:null}
    {params.success?<div className="success">{params.success}</div>:null}

    <div className="grid">
      <div className="card"><div className="muted">Unknowns verified</div><div className="metric">{verified.size} / 10</div></div>
      <div className="card"><div className="muted">In progress</div><div className="metric">{requested.size}</div></div>
      <div className="card"><div className="muted">Organisations interviewed</div><div className="metric">{interviews?.length??0}</div><div className="small muted">{willingOrgs} willing to trial</div></div>
      <div className="card"><div className="muted">Repair Café observations</div><div className="metric">{demand?.length??0}</div><div className="small muted">{yesDemand} yes · {costBarrier} affordability barrier</div></div>
      <div className="card"><div className="muted">Pilot contribution before labour</div><div className="metric">{dollars(totalRevenue-totalCosts)}</div><div className="small muted">{totalMinutes} recorded minutes</div></div>
    </div>

    <section className="card">
      <h2>Ten unresolved questions</h2>
      <div className="table-wrap"><ResponsiveTable><thead><tr><th>Question</th><th>Status</th><th>Evidence records</th></tr></thead><tbody>
        {topics.map(topic => {
          const count=(evidence??[]).filter((x:any)=>x.topic===topic).length;
          const status=verified.has(topic)?"VERIFIED":requested.has(topic)?"IN PROGRESS":"OPEN";
          return <tr key={topic}><td>{topicLabels[topic]}</td><td><span className="badge">{status}</span></td><td>{count}</td></tr>;
        })}
      </tbody></ResponsiveTable></div>
    </section>

    <details className="card" open>
      <summary><strong>Record evidence / official response</strong></summary>
      <form action={addValidationEvidence} className="form" style={{marginTop:"12px"}}>
        <div className="two"><label>Topic<select name="topic">{topics.map(t=><option key={t} value={t}>{topicLabels[t]}</option>)}</select></label><label>Subject<input name="subject_name" required placeholder="Dubbo Regional Council / AMR / NSW Education"/></label></div>
        <div className="two"><label>Method<select name="method"><option>PUBLIC_SOURCE</option><option>INFORMAL_REQUEST</option><option>GIPA</option><option>INTERVIEW</option><option>WRITTEN_RESPONSE</option><option>QUOTE</option><option>PILOT</option><option>SURVEY</option><option>OTHER</option></select></label><label>Status<select name="status"><option>OPEN</option><option>REQUESTED</option><option>PARTIAL</option><option>VERIFIED</option><option>REFUSED</option><option>BLOCKED</option></select></label></div>
        <div className="two"><label>Evidence date<input name="evidence_date" type="date" defaultValue={new Date().toISOString().slice(0,10)}/></label><label>Confidence<select name="confidence" defaultValue="MEDIUM"><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select></label></div>
        <label>Answer / evidence summary<textarea name="answer_summary" required/></label>
        <label>Source URL / reference<input name="source_url"/></label>
        <div className="two"><label>Quantity<input name="quantitative_value" type="number" step="0.001"/></label><label>Unit<input name="quantitative_unit" placeholder="tonnes/year, devices, $/kg"/></label></div>
        <div className="two"><label>Next action<input name="next_action"/></label><label>Due<input name="next_action_at" type="datetime-local"/></label></div>
        <button className="button" type="submit">Save evidence</button>
      </form>
    </details>

    <details className="card">
      <summary><strong>Organisation disposal interview</strong></summary>
      <form action={addOrganisationInterview} className="form" style={{marginTop:"12px"}}>
        <div className="two"><label>Organisation<input name="organisation" required/></label><label>Sector<input name="sector" placeholder="School / health / law / council / SME"/></label></div>
        <div className="two"><label>Respondent role only<input name="respondent_role" placeholder="Business manager / ICT manager"/></label><label>Interview date<input name="interview_date" type="date" defaultValue={new Date().toISOString().slice(0,10)}/></label></div>
        <div className="two"><label>Approx device fleet<input name="approximate_device_count" type="number" min="0"/></label><label>Retired devices/year<input name="annual_retired_devices" type="number" min="0"/></label></div>
        <label>Refresh cycle (months)<input name="refresh_cycle_months" type="number" min="1"/></label>
        <label>Current disposal / retirement route<textarea name="current_route"/></label>
        <div className="two"><label>Current provider<input name="current_provider"/></label><label>Sanitisation evidence<input name="sanitisation_evidence" placeholder="Certificate / destruction / none"/></label></div>
        <div className="two"><label>Reuse before recycling?<select name="reuse_before_recycle" defaultValue="UNKNOWN"><option>UNKNOWN</option><option>YES</option><option>NO</option></select></label><label>Cost or rebate<input name="disposal_cost_or_rebate"/></label></div>
        <label>Who controls the decision?<input name="decision_control" placeholder="Local office / head office / diocese / central procurement"/></label>
        <div className="two"><label>Open to small pilot?<select name="willing_to_trial" defaultValue="UNKNOWN"><option>UNKNOWN</option><option>YES</option><option>MAYBE</option><option>NO</option></select></label><label>Likely pilot units<input name="likely_trial_units" type="number" min="0"/></label></div>
        <label>Conditions for trial<textarea name="conditions_for_trial"/></label>
        <label>Next action<input name="next_action"/></label><label>Notes<textarea name="notes"/></label>
        <button className="button" type="submit">Save interview</button>
      </form>
    </details>

    <details className="card">
      <summary><strong>Repair Café demand observation</strong></summary>
      <form action={addRepairCafeDemand} className="form" style={{marginTop:"12px"}}>
        <p className="muted small">Privacy-minimised: record no name, email, phone or street address.</p>
        <div className="two"><label>Date<input name="observed_on" type="date" defaultValue={new Date().toISOString().slice(0,10)}/></label><label>Source<input name="source_channel" placeholder="Conversation / survey / event"/></label></div>
        <div className="two"><label>Postcode<input name="postcode" maxLength={4}/></label><label>Device type<input name="device_type" required placeholder="Laptop / desktop"/></label></div>
        <label>Fault category<input name="fault_category" required placeholder="Won't boot / slow / battery / screen / software"/></label>
        <label>What would they do without a Repair Café?<input name="current_alternative" placeholder="Replace / commercial repair / live with it / discard"/></label>
        <div className="two"><label>Cost barrier?<select name="affordability_barrier" defaultValue="UNKNOWN"><option>UNKNOWN</option><option>YES</option><option>NO</option></select></label><label>Would attend?<select name="would_attend" defaultValue="MAYBE"><option>YES</option><option>MAYBE</option><option>NO</option></select></label></div>
        <div className="two"><label>Preferred timing<input name="preferred_timing" placeholder="Saturday morning"/></label><label>Willing to learn alongside volunteer?<select name="willing_to_learn" defaultValue="UNKNOWN"><option>UNKNOWN</option><option>YES</option><option>NO</option></select></label></div>
        <label>Affordable parts/repair spend ($)<input name="estimated_repair_spend" type="number" min="0" step="0.01"/></label><label>Notes<textarea name="notes"/></label>
        <button className="button" type="submit">Record demand</button>
      </form>
    </details>

    <details className="card">
      <summary><strong>Commercial/private terms</strong></summary>
      <form action={addCommercialTermsQuote} className="form" style={{marginTop:"12px"}}>
        <div className="two"><label>Provider<input name="provider" required/></label><label>Service type<input name="service_type" required placeholder="Downstream / Blancco / insurance / ITAD subcontract"/></label></div>
        <div className="two"><label>Quote date<input name="quote_date" type="date" defaultValue={new Date().toISOString().slice(0,10)}/></label><label>Valid until<input name="valid_until" type="date"/></label></div>
        <div className="two"><label>Minimum units<input name="minimum_units" type="number" min="0"/></label><label>Minimum kg<input name="minimum_weight_kg" type="number" min="0" step="0.001"/></label></div>
        <div className="two"><label>Pickup fee<input name="pickup_fee" type="number" step="0.01"/></label><label>Per unit fee<input name="per_unit_fee" type="number" step="0.01"/></label></div>
        <label>Per kg fee/rebate<input name="per_kg_fee" type="number" step="0.01"/></label>
        <label>Rebate / buyback basis<textarea name="rebate_or_buyback"/></label><label>Transport terms<textarea name="transport_terms"/></label><label>Battery terms<textarea name="battery_terms"/></label><label>Data terms<textarea name="data_terms"/></label><label>Certificates / reports<textarea name="certificates_reports"/></label><label>Insurance / contract requirements<textarea name="insurance_or_contract_requirements"/></label><label>Quote/source reference<input name="source_reference"/></label><label>Notes<textarea name="notes"/></label>
        <button className="button" type="submit">Save commercial terms</button>
      </form>
    </details>

    <details className="card">
      <summary><strong>Real pilot economics per asset</strong></summary>
      <form action={addPilotEconomics} className="form" style={{marginTop:"12px"}}>
        <div className="two"><label>Asset<select name="asset_id" defaultValue=""><option value="">Unlinked / aggregate observation</option>{(assets??[]).map((a:any)=><option key={a.id} value={a.id}>{a.asset_code} · {[a.manufacturer,a.model].filter(Boolean).join(" ")}</option>)}</select></label><label>Date<input name="observed_on" type="date" defaultValue={new Date().toISOString().slice(0,10)}/></label></div>
        <label>Category<input name="category" placeholder="Laptop / desktop"/></label>
        <div className="two"><label>Acquisition cost<input name="acquisition_cost" type="number" min="0" step="0.01"/></label><label>Collection freight<input name="collection_freight" type="number" min="0" step="0.01"/></label></div>
        <div className="two"><label>Parts cost<input name="parts_cost" type="number" min="0" step="0.01"/></label><label>Downstream cost<input name="downstream_cost" type="number" min="0" step="0.01"/></label></div>
        <div className="two"><label>Marketplace fees<input name="marketplace_fees" type="number" min="0" step="0.01"/></label><label>Outbound freight<input name="outbound_freight" type="number" min="0" step="0.01"/></label></div>
        <div className="two"><label>Return cost<input name="return_cost" type="number" min="0" step="0.01"/></label><label>Other cost<input name="other_cost" type="number" min="0" step="0.01"/></label></div>
        <div className="two"><label>Intake minutes<input name="intake_minutes" type="number" min="0"/></label><label>Diagnostics minutes<input name="diagnostic_minutes" type="number" min="0"/></label></div>
        <div className="two"><label>Sanitisation minutes<input name="sanitisation_minutes" type="number" min="0"/></label><label>Repair minutes<input name="repair_minutes" type="number" min="0"/></label></div>
        <div className="two"><label>Listing/admin minutes<input name="listing_admin_minutes" type="number" min="0"/></label><label>Realised revenue<input name="realised_revenue" type="number" min="0" step="0.01"/></label></div>
        <div className="two"><label>Final route<input name="final_route" placeholder="RESELL / DONATE / PARTS / RECYCLE"/></label><label>Sold/closed date<input name="sold_or_closed_on" type="date"/></label></div>
        <label>Notes<textarea name="notes"/></label>
        <button className="button" type="submit">Save economics</button>
      </form>
    </details>

    <section className="card"><h2>Recent evidence</h2><div className="table-wrap"><ResponsiveTable><thead><tr><th>Date</th><th>Topic</th><th>Subject</th><th>Status</th><th>Finding</th><th>Next</th></tr></thead><tbody>
      {(evidence??[]).slice(0,50).map((x:any)=><tr key={x.id}><td>{x.evidence_date}</td><td>{topicLabels[x.topic]||x.topic}</td><td>{x.subject_name}</td><td>{x.status}</td><td>{x.answer_summary}</td><td>{x.next_action||"—"}</td></tr>)}
    </tbody></ResponsiveTable></div></section>

    <section className="card"><h2>Organisation interviews</h2><div className="table-wrap"><ResponsiveTable><thead><tr><th>Organisation</th><th>Annual retired</th><th>Current route</th><th>Provider</th><th>Pilot?</th></tr></thead><tbody>
      {(interviews??[]).map((x:any)=><tr key={x.id}><td><strong>{x.organisation}</strong><br/><span className="small muted">{x.sector||"—"} · {x.respondent_role||"role not recorded"}</span></td><td>{x.annual_retired_devices??"—"}</td><td>{x.current_route||"—"}</td><td>{x.current_provider||"—"}</td><td>{x.willing_to_trial}{x.likely_trial_units!=null?" · "+x.likely_trial_units+" units":""}</td></tr>)}
    </tbody></ResponsiveTable></div></section>

    <section className="card"><h2>Commercial terms</h2><div className="table-wrap"><ResponsiveTable><thead><tr><th>Provider</th><th>Service</th><th>Minimum</th><th>Fees</th><th>Key terms</th></tr></thead><tbody>
      {(quotes??[]).map((x:any)=><tr key={x.id}><td>{x.provider}</td><td>{x.service_type}</td><td>{x.minimum_units??"—"} units / {x.minimum_weight_kg??"—"} kg</td><td>Pickup {x.pickup_fee!=null?dollars(Number(x.pickup_fee)):"—"} · unit {x.per_unit_fee!=null?dollars(Number(x.per_unit_fee)):"—"} · kg {x.per_kg_fee!=null?dollars(Number(x.per_kg_fee)):"—"}</td><td>{x.rebate_or_buyback||x.data_terms||x.transport_terms||"—"}</td></tr>)}
    </tbody></ResponsiveTable></div></section>

    <section className="card"><h2>Pilot economics observations</h2><div className="table-wrap"><ResponsiveTable><thead><tr><th>Asset</th><th>Revenue</th><th>Cash costs</th><th>Minutes</th><th>Contribution before labour</th><th>Route</th></tr></thead><tbody>
      {econRows.map((x:any)=>{const costs=["acquisition_cost","collection_freight","parts_cost","downstream_cost","marketplace_fees","outbound_freight","return_cost","other_cost"].reduce((t,k)=>t+Number(x[k]||0),0); const mins=["intake_minutes","diagnostic_minutes","sanitisation_minutes","repair_minutes","listing_admin_minutes"].reduce((t,k)=>t+Number(x[k]||0),0); return <tr key={x.id}><td>{x.assets?.asset_code||"Unlinked"}</td><td>{dollars(Number(x.realised_revenue||0))}</td><td>{dollars(costs)}</td><td>{mins}</td><td>{dollars(Number(x.realised_revenue||0)-costs)}</td><td>{x.final_route||"—"}</td></tr>})}
    </tbody></ResponsiveTable></div></section>
  </div>;
}
