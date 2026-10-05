import Link from "next/link";
import { addLeadActivity, createLead, updateLeadStage } from "../operations/actions";
import { convertLeadToCustomer, updateLeadFollowUp } from "./actions";
import { createClient } from "@/lib/supabase/server";

export default async function CrmPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: leads } = await supabase.from("crm_leads").select("*,crm_activities(id,activity_type,summary,occurred_at)").order("next_action_at", { ascending: true, nullsFirst: false }).order("created_at", { ascending: false });

  return <div className="stack">
    <div><div className="badge">CRM</div><h1>Leads & follow-up</h1><p className="muted">Track prospects, next actions and communication history before they become customers or inbound jobs.</p><div className="actions"><Link className="button secondary" href="/crm/opportunities">Opportunities</Link><Link className="button secondary" href="/crm/quotes">Quotes</Link><Link className="button secondary" href="/crm/campaigns">Templates & campaigns</Link><Link className="button secondary" href="/crm/report">CRM report</Link></div></div>
    {params.error ? <div className="error">{params.error}</div> : null}
    {params.success ? <div className="success">{params.success}</div> : null}
    <form action={createLead} className="card form">
      <h2>New lead</h2>
      <div className="two"><label>Contact name<input name="name" required /></label><label>Organisation<input name="organisation" /></label></div>
      <div className="two"><label>Email<input name="email" type="email" /></label><label>Phone<input name="phone" /></label></div>
      <div className="two"><label>Source<input name="source" placeholder="Referral, school, MSP, website…" /></label><label>Estimated value<input name="estimated_value" type="number" min="0" step="0.01" /></label></div>
      <div className="two"><label>Next action<input name="next_action" placeholder="Call about collection quote" /></label><label>Due<input name="next_action_at" type="datetime-local" /></label></div>
      <label>Marketing consent<select name="consent_status" defaultValue="UNKNOWN"><option>UNKNOWN</option><option>OPERATIONAL_ONLY</option><option>MARKETING_OPT_IN</option><option>MARKETING_OPT_OUT</option></select></label>
      <label>Notes<textarea name="notes" /></label>
      <button className="button" type="submit">Create lead</button>
    </form>
    <section className="card table-wrap"><h2>Lead pipeline</h2><table><thead><tr><th>Lead</th><th>Stage</th><th>Follow-up</th><th>Consent</th><th>Activity</th><th>Customer</th></tr></thead><tbody>
      {(leads ?? []).map((lead: any) => <tr key={lead.id}><td><strong>{lead.name}</strong><br /><span className="muted small">{lead.organisation || lead.email || lead.phone || "—"}</span></td><td><form action={updateLeadStage} className="inline-form"><input type="hidden" name="lead_id" value={lead.id} /><select name="stage" defaultValue={lead.stage}><option>NEW</option><option>QUALIFIED</option><option>QUOTED</option><option>WON</option><option>LOST</option><option>NURTURE</option></select><input name="lost_reason" placeholder="Lost reason if relevant" /><button className="button secondary" type="submit">Save</button></form></td><td className={lead.next_action_at && new Date(lead.next_action_at).getTime() < Date.now() && !["WON","LOST"].includes(lead.stage) ? "overdue" : ""}><form action={updateLeadFollowUp} className="mini-form"><input type="hidden" name="lead_id" value={lead.id} /><input name="next_action" defaultValue={lead.next_action || ""} placeholder="Next action" /><input name="next_action_at" type="datetime-local" defaultValue={lead.next_action_at ? new Date(lead.next_action_at).toISOString().slice(0,16) : ""} /><button className="button secondary" type="submit">Save follow-up</button></form></td><td>{lead.consent_status}</td><td><form action={addLeadActivity} className="inline-form"><input type="hidden" name="lead_id" value={lead.id} /><select name="activity_type"><option>NOTE</option><option>CALL</option><option>EMAIL</option><option>MEETING</option><option>QUOTE</option></select><input name="summary" required placeholder="What happened?" /><button className="button secondary" type="submit">Log</button></form><span className="muted small">{lead.crm_activities?.length || 0} recorded</span></td><td>{lead.customer_id ? <span className="badge">Linked</span> : <form action={convertLeadToCustomer}><input type="hidden" name="lead_id" value={lead.id} /><button className="button secondary" type="submit">Convert to customer</button></form>}<div className="muted small">{lead.estimated_value ? "$"+Number(lead.estimated_value).toFixed(2)+" estimated" : "No value estimate"}</div></td></tr>)}
    </tbody></table></section>
  </div>;
}
