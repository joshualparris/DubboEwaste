import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createOpportunity, updateOpportunity } from "./actions";

const stages = ["QUALIFIED","QUOTED","ACCEPTED","SCHEDULED","PROCESSING","COMPLETED","INVOICED","LOST"] as const;

export default async function OpportunitiesPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: leads }, { data: customers }, { data: quotes }, { data: jobs }, { data: opportunities }] = await Promise.all([
    supabase.from("crm_leads").select("id,name,organisation,customer_id").neq("stage","LOST").order("name"),
    supabase.from("customers").select("id,name").order("name"),
    supabase.from("crm_quotes").select("id,quote_number,status").order("created_at",{ascending:false}).limit(100),
    supabase.from("jobs").select("id,job_code,status").order("created_at",{ascending:false}).limit(100),
    supabase.from("crm_opportunities").select("*,crm_leads(name,organisation),customers(name),crm_quotes(quote_number,status),jobs(job_code,status)").order("next_action_at",{ascending:true,nullsFirst:false}).order("created_at",{ascending:false}),
  ]);

  const now = Date.now();
  const active = (opportunities ?? []).filter((o:any) => !["COMPLETED","INVOICED","LOST"].includes(o.stage));
  const overdue = active.filter((o:any) => o.next_action_at && new Date(o.next_action_at).getTime() < now);

  return <div className="stack">
    <div>
      <div className="badge">CRM sales pipeline</div>
      <h1>Opportunities</h1>
      <p className="muted">Link a real service or collection opportunity from prospect through quote, job, processing and completion.</p>
      <div className="actions"><Link className="button secondary" href="/crm">Leads</Link><Link className="button secondary" href="/crm/quotes">Quotes</Link><Link className="button secondary" href="/crm/report">CRM report</Link></div>
    </div>

    {params.error ? <div className="error">{params.error}</div> : null}
    {params.success ? <div className="success">{params.success}</div> : null}

    <div className="grid">
      <div className="card"><div className="muted">Active opportunities</div><div className="metric">{active.length}</div></div>
      <div className="card"><div className="muted">Overdue follow-ups</div><div className="metric">{overdue.length}</div></div>
      <div className="card"><div className="muted">Pipeline value</div><div className="metric">{"$"+active.reduce((sum:number,o:any)=>sum+Number(o.estimated_value||0),0).toFixed(0)}</div></div>
    </div>

    <form action={createOpportunity} className="card form">
      <h2>New service / collection opportunity</h2>
      <div className="two">
        <label>Name<input name="name" required placeholder="Dubbo office laptop refresh" /></label>
        <label>Service<select name="service_type" defaultValue="ITAD"><option>ITAD</option><option>COLLECTION</option><option>DROP_OFF</option><option>REFURBISHMENT</option><option>DATA_SANITISATION</option><option>REUSE_PROGRAM</option><option>OTHER</option></select></label>
      </div>
      <div className="two">
        <label>Lead<select name="lead_id" defaultValue=""><option value="">No lead</option>{(leads??[]).map((x:any)=><option key={x.id} value={x.id}>{x.name} · {x.organisation||"individual"}</option>)}</select></label>
        <label>Customer<select name="customer_id" defaultValue=""><option value="">No customer</option>{(customers??[]).map((x:any)=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      </div>
      <div className="two">
        <label>Stage<select name="stage" defaultValue="QUALIFIED">{stages.map(stage=><option key={stage}>{stage}</option>)}</select></label>
        <label>Estimated value<input name="estimated_value" type="number" min="0" step="0.01" /></label>
      </div>
      <div className="two">
        <label>Expected asset count<input name="expected_asset_count" type="number" min="0" /></label>
        <label>Expected weight (kg)<input name="expected_weight_kg" type="number" min="0" step="0.001" /></label>
      </div>
      <div className="two">
        <label>Source/site<input name="source_site" /></label>
        <label>Target date<input name="target_date" type="date" /></label>
      </div>
      <div className="two">
        <label>Next action<input name="next_action" placeholder="Call IT manager for device count" /></label>
        <label>Follow-up due<input name="next_action_at" type="datetime-local" /></label>
      </div>
      <label>Notes<textarea name="notes" /></label>
      <button className="button" type="submit">Create opportunity</button>
    </form>

    <section className="stack">
      {stages.map(stage => {
        const items=(opportunities??[]).filter((o:any)=>o.stage===stage);
        if(!items.length) return null;
        return <details className="card" key={stage} open={!["COMPLETED","INVOICED","LOST"].includes(stage)}>
          <summary><strong>{stage}</strong> · {items.length}</summary>
          <div className="table-wrap" style={{marginTop:"12px"}}><table><thead><tr><th>Opportunity</th><th>Links</th><th>Value / size</th><th>Follow-up</th><th>Update</th></tr></thead><tbody>
            {items.map((o:any)=><tr key={o.id}>
              <td><strong>{o.name}</strong><br/><span className="muted small">{o.service_type} · {o.source_site||"site not set"}</span></td>
              <td><div className="small">
                {o.crm_leads?.name?<>Lead: {o.crm_leads.name}</>:null}
                {o.customers?.name?<><br/>Customer: {o.customers.name}</>:null}
                {o.crm_quotes?.quote_number?<><br/><Link href={"/crm/quotes/"+o.quote_id}>{o.crm_quotes.quote_number}</Link></>:null}
                {o.jobs?.job_code?<><br/><Link href={"/jobs/"+o.job_id}>{o.jobs.job_code}</Link></>:null}
              </div></td>
              <td>{o.estimated_value!=null?"$"+Number(o.estimated_value).toFixed(2):"—"}<br/><span className="small muted">{o.expected_asset_count??"—"} assets · {o.expected_weight_kg??"—"} kg</span></td>
              <td className={o.next_action_at && new Date(o.next_action_at).getTime()<now && !["COMPLETED","INVOICED","LOST"].includes(o.stage)?"overdue":""}>{o.next_action||"—"}<br/><span className="small">{o.next_action_at?new Date(o.next_action_at).toLocaleString("en-AU"):"No due date"}</span></td>
              <td><form action={updateOpportunity} className="mini-form">
                <input type="hidden" name="opportunity_id" value={o.id}/>
                <select name="stage" defaultValue={o.stage}>{stages.map(s=><option key={s}>{s}</option>)}</select>
                <select name="quote_id" defaultValue={o.quote_id||""}><option value="">No quote</option>{(quotes??[]).map((q:any)=><option key={q.id} value={q.id}>{q.quote_number} · {q.status}</option>)}</select>
                <select name="job_id" defaultValue={o.job_id||""}><option value="">No job</option>{(jobs??[]).map((j:any)=><option key={j.id} value={j.id}>{j.job_code} · {j.status}</option>)}</select>
                <input name="next_action" defaultValue={o.next_action||""} placeholder="Next action"/>
                <input name="next_action_at" type="datetime-local" defaultValue={o.next_action_at?new Date(o.next_action_at).toISOString().slice(0,16):""}/>
                <input name="lost_reason" defaultValue={o.lost_reason||""} placeholder="Lost reason if relevant"/>
                <button className="button secondary" type="submit">Save</button>
              </form></td>
            </tr>)}
          </tbody></table></div>
        </details>;
      })}
    </section>
  </div>;
}
