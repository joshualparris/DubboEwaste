import { ResponsiveTable } from "@/components/ResponsiveTable";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { convertQuoteToJob, createQuote, createQuoteVersion, updateQuoteStatus } from "../../operations/actions";

export default async function CrmQuotesPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: leads }, { data: customers }, { data: quotes }] = await Promise.all([
    supabase.from("crm_leads").select("id,name,organisation").order("name"),
    supabase.from("customers").select("id,name").order("name"),
    supabase.from("crm_quotes").select("*,crm_leads(name,organisation),customers(name),crm_quote_versions(id,version_number,scope,total,crm_quote_items(description,quantity,unit_price,line_total))").order("created_at", { ascending: false }),
  ]);
  return <div className="stack">
    <div><div className="badge">CRM sales</div><h1>Quotes</h1><p className="muted">Every revision is retained. Only issued or accepted quotes can become inbound jobs.</p></div>
    <div className="actions"><Link className="button secondary" href="/crm">Leads</Link><Link className="button secondary" href="/crm/opportunities">Opportunities</Link><Link className="button secondary" href="/crm/campaigns">Templates & campaigns</Link><Link className="button secondary" href="/crm/report">CRM report</Link></div>
    {params.error ? <div className="error">{params.error}</div> : null}{params.success ? <div className="success">{params.success}</div> : null}
    <form action={createQuote} className="card form">
      <h2>Create quote</h2>
      <div className="two"><label>Lead<select name="lead_id" defaultValue=""><option value="">No linked lead</option>{(leads ?? []).map((lead: any) => <option key={lead.id} value={lead.id}>{lead.name} · {lead.organisation || "individual"}</option>)}</select></label><label>Customer<select name="customer_id" defaultValue=""><option value="">No customer</option>{(customers ?? []).map((customer: any) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label></div>
      <div className="two"><label>Valid until<input name="valid_until" type="date" /></label><label>Items JSON<input name="items_json" required defaultValue='[{"description":"Collection and processing","quantity":1,"unit_price":0}]' /></label></div>
      <label>Scope<textarea name="scope" required placeholder="What is included, excluded and the evidence/reporting terms" /></label><label>Notes<textarea name="notes" /></label>
      <p className="muted small">Items JSON format: [{`{"description":"Service","quantity":1,"unit_price":100}`}]. This initial slice calculates AUD subtotal/total without tax.</p>
      <button className="button" type="submit">Create quote</button>
    </form>
    <section className="card table-wrap"><h2>Quote register</h2><ResponsiveTable><thead><tr><th>Quote</th><th>Lead/customer</th><th>Status</th><th>Versions</th><th>Actions</th></tr></thead><tbody>
      {(quotes ?? []).map((quote: any) => { const latest = [...(quote.crm_quote_versions ?? [])].sort((a: any, b: any) => b.version_number - a.version_number)[0]; return <tr key={quote.id}><td><Link href={"/crm/quotes/"+quote.id}><strong>{quote.quote_number}</strong></Link><br /><span className="muted small">Version {quote.current_version} · {latest?.total ? "$"+Number(latest.total).toFixed(2)+" AUD" : "$0.00 AUD"}</span><br/><Link className="small" href={"/crm/quotes/"+quote.id}>Open printable quote →</Link></td><td>{quote.crm_leads?.name || quote.customers?.name || "—"}</td><td><form action={updateQuoteStatus} className="inline-form"><input type="hidden" name="quote_id" value={quote.id} /><select name="status" defaultValue={quote.status}><option>DRAFT</option><option>ISSUED</option><option>ACCEPTED</option><option>DECLINED</option><option>EXPIRED</option></select><button className="button secondary" type="submit">Save</button></form></td><td>{(quote.crm_quote_versions ?? []).map((version: any) => <details key={version.id}><summary>v{version.version_number} · ${Number(version.total).toFixed(2)}</summary><p>{version.scope}</p><ul>{(version.crm_quote_items ?? []).map((item: any) => <li key={item.id}>{item.quantity} × {item.description} — ${Number(item.line_total).toFixed(2)}</li>)}</ul></details>)}</td><td><form action={createQuoteVersion} className="mini-form"><input type="hidden" name="quote_id" value={quote.id} /><textarea name="scope" required placeholder="New version scope" /><input name="items_json" required defaultValue='[{"description":"Updated service","quantity":1,"unit_price":0}]' /><textarea name="notes" placeholder="Version notes" /><button className="button secondary" type="submit">New version</button></form>{["ISSUED","ACCEPTED"].includes(quote.status) ? <form action={convertQuoteToJob} className="mini-form"><input type="hidden" name="quote_id" value={quote.id} /><input name="source_site" placeholder="Source site" /><textarea name="work_instructions" placeholder="Job instructions" /><button className="button" type="submit">Convert to job</button></form> : null}</td></tr>; })}
    </tbody></ResponsiveTable></section>
  </div>;
}
