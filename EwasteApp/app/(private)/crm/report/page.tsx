import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function CrmReportPage() {
  const supabase = await createClient();
  const [{ data: leads }, { data: quotes }, { data: campaigns }] = await Promise.all([
    supabase.from("crm_leads").select("stage,estimated_value,consent_status,created_at,next_action_at"),
    supabase.from("crm_quotes").select("status,crm_quote_versions(total)"),
    supabase.from("crm_campaigns").select("status,crm_campaign_recipients(status)"),
  ]);
  const stageCounts = (leads ?? []).reduce((result: Record<string, number>, lead: any) => { result[lead.stage] = (result[lead.stage] || 0) + 1; return result; }, {});
  const quoteCounts = (quotes ?? []).reduce((result: Record<string, number>, quote: any) => { result[quote.status] = (result[quote.status] || 0) + 1; return result; }, {});
  const pipelineValue = (leads ?? []).filter((lead: any) => !["LOST", "WON"].includes(lead.stage)).reduce((sum, lead: any) => sum + Number(lead.estimated_value || 0), 0);
  const optedIn = (leads ?? []).filter((lead: any) => lead.consent_status === "MARKETING_OPT_IN").length;
  return <div className="stack"><div><div className="badge">CRM reporting</div><h1>Pipeline report</h1><p className="muted">Operational counts from CRM records. No revenue or campaign delivery is inferred from a draft record.</p></div><div className="actions"><Link className="button secondary" href="/crm">Leads</Link><Link className="button secondary" href="/crm/quotes">Quotes</Link><Link className="button secondary" href="/crm/campaigns">Campaigns</Link></div><div className="grid"><section className="card"><div className="muted">Open pipeline estimate</div><div className="metric">${pipelineValue.toFixed(2)}</div></section><section className="card"><div className="muted">Marketing opt-ins</div><div className="metric">{optedIn}</div></section><section className="card"><div className="muted">Leads</div><div className="metric">{(leads ?? []).length}</div></section><section className="card"><div className="muted">Quotes</div><div className="metric">{(quotes ?? []).length}</div></section></div><section className="card"><h2>Lead stages</h2><table><tbody>{Object.entries(stageCounts).sort(([a], [b]) => a.localeCompare(b)).map(([stage, count]) => <tr key={stage}><th>{stage}</th><td>{count}</td></tr>)}</tbody></table></section><section className="card"><h2>Quote statuses</h2><table><tbody>{Object.entries(quoteCounts).sort(([a], [b]) => a.localeCompare(b)).map(([status, count]) => <tr key={status}><th>{status}</th><td>{count}</td></tr>)}</tbody></table></section><section className="card"><h2>Campaign delivery records</h2><table><thead><tr><th>Status</th><th>Campaigns</th><th>Recipient events</th></tr></thead><tbody>{(campaigns ?? []).map((campaign: any) => <tr key={campaign.status}><td>{campaign.status}</td><td>1</td><td>{(campaign.crm_campaign_recipients ?? []).length}</td></tr>)}</tbody></table></section></div>;
}
