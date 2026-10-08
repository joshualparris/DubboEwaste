import { ResponsiveTable } from "@/components/ResponsiveTable";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createCampaign, createEmailTemplate } from "../../operations/actions";

export default async function CrmCampaignsPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: templates }, { data: campaigns }] = await Promise.all([
    supabase.from("crm_email_templates").select("*").order("name"),
    supabase.from("crm_campaigns").select("*,crm_email_templates(name),crm_campaign_recipients(status)").order("created_at", { ascending: false }),
  ]);
  return <div className="stack">
    <div><div className="badge">CRM communications</div><h1>Templates & campaigns</h1><p className="muted">Campaign audiences are snapshotted from leads with explicit marketing opt-in. This records the campaign; it does not send email.</p></div>
    <div className="actions"><Link className="button secondary" href="/crm">Leads</Link><Link className="button secondary" href="/crm/quotes">Quotes</Link><Link className="button secondary" href="/crm/report">CRM report</Link></div>
    {params.error ? <div className="error">{params.error}</div> : null}{params.success ? <div className="success">{params.success}</div> : null}
    <div className="grid"><form action={createEmailTemplate} className="card form"><h2>Email template</h2><label>Name<input name="name" required placeholder="Collection follow-up" /></label><label>Purpose<input name="purpose" required placeholder="Operational follow-up" /></label><label>Subject<input name="subject" required /></label><label>Body<textarea name="body" required placeholder="Use named placeholders only after documenting them." /></label><button className="button" type="submit">Save template</button></form>
    <form action={createCampaign} className="card form"><h2>Create campaign</h2><label>Name<input name="name" required /></label><label>Template<select name="template_id" defaultValue=""><option value="">No template</option>{(templates ?? []).map((template: any) => <option key={template.id} value={template.id}>{template.name}</option>)}</select></label><label>Audience description<textarea name="audience_description" required placeholder="Why this audience is appropriate" /></label><button className="button" type="submit">Snapshot opt-in audience</button></form></div>
    <section className="card table-wrap"><h2>Campaign register</h2><ResponsiveTable><thead><tr><th>Campaign</th><th>Template</th><th>Status</th><th>Recipients</th></tr></thead><tbody>{(campaigns ?? []).map((campaign: any) => <tr key={campaign.id}><td><strong>{campaign.name}</strong><br /><span className="muted small">{campaign.audience_description}</span></td><td>{campaign.crm_email_templates?.name || "—"}</td><td>{campaign.status}</td><td>{(campaign.crm_campaign_recipients ?? []).length} snapshotted · {(campaign.crm_campaign_recipients ?? []).filter((r: any) => r.status === "SENT").length} sent</td></tr>)}</tbody></ResponsiveTable></section>
  </div>;
}
