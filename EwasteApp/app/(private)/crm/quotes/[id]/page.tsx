import { ResponsiveTable } from "@/components/ResponsiveTable";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/PrintButton";
import { createClient } from "@/lib/supabase/server";

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: quote } = await supabase
    .from("crm_quotes")
    .select("*,crm_leads(name,organisation,email,phone),customers(name,contact_name,contact_email,contact_phone),crm_quote_versions(id,version_number,scope,notes,currency,subtotal,tax,total,created_at,crm_quote_items(id,description,quantity,unit_price,line_total))")
    .eq("id", id)
    .single();

  if (!quote) notFound();

  const versions = [...(quote.crm_quote_versions ?? [])].sort((a:any,b:any)=>b.version_number-a.version_number);
  const latest:any = versions[0];
  const clientName = quote.customers?.name || quote.crm_leads?.organisation || quote.crm_leads?.name || "Prospective customer";
  const contactName = quote.customers?.contact_name || (quote.crm_leads?.organisation ? quote.crm_leads?.name : null);
  const contactEmail = quote.customers?.contact_email || quote.crm_leads?.email;
  const contactPhone = quote.customers?.contact_phone || quote.crm_leads?.phone;

  return <div className="stack">
    <div className="no-print actions">
      <Link className="button secondary" href="/crm/quotes">Back to quotes</Link>
      <PrintButton />
      {quote.converted_job_id ? <Link className="button secondary" href={"/jobs/"+quote.converted_job_id}>Open converted job</Link> : null}
    </div>

    <section className="card quote-sheet">
      <div className="quote-header">
        <div>
          <div className="badge">DubboEwaste · AssetFlow</div>
          <h1>Quote {quote.quote_number}</h1>
          <p className="muted">IT asset reuse, refurbishment, data-handling and downstream services</p>
        </div>
        <div className="quote-meta">
          <p><strong>Status:</strong> {quote.status}</p>
          <p><strong>Version:</strong> {latest?.version_number ?? quote.current_version}</p>
          <p><strong>Created:</strong> {new Date(quote.created_at).toLocaleDateString("en-AU")}</p>
          <p><strong>Valid until:</strong> {quote.valid_until ? new Date(quote.valid_until+"T00:00:00").toLocaleDateString("en-AU") : "Not specified"}</p>
        </div>
      </div>

      <hr />

      <div className="two quote-client">
        <div>
          <h2>Prepared for</h2>
          <p><strong>{clientName}</strong></p>
          {contactName ? <p>{contactName}</p> : null}
          {contactEmail ? <p>{contactEmail}</p> : null}
          {contactPhone ? <p>{contactPhone}</p> : null}
        </div>
        <div>
          <h2>Prepared by</h2>
          <p><strong>DubboEwaste</strong></p>
          <p>Dubbo, NSW</p>
          <p className="muted small">This quote describes the recorded service scope only. Acceptance, custody, data handling and downstream work remain subject to the agreed operating terms and actual device condition.</p>
        </div>
      </div>

      <hr />

      <h2>Scope</h2>
      <p className="quote-scope">{latest?.scope || "No scope recorded."}</p>

      <div className="table-wrap">
        <ResponsiveTable mobile="scroll">
          <thead><tr><th>Description</th><th>Qty</th><th>Unit price</th><th>Total</th></tr></thead>
          <tbody>{(latest?.crm_quote_items ?? []).map((item:any)=><tr key={item.id}>
            <td>{item.description}</td>
            <td>{Number(item.quantity).toLocaleString("en-AU")}</td>
            <td>{"$"+Number(item.unit_price).toFixed(2)}</td>
            <td>{"$"+Number(item.line_total).toFixed(2)}</td>
          </tr>)}</tbody>
          <tfoot>
            <tr><th colSpan={3}>Subtotal</th><th>{"$"+Number(latest?.subtotal || 0).toFixed(2)}</th></tr>
            {Number(latest?.tax || 0) ? <tr><th colSpan={3}>Tax</th><th>{"$"+Number(latest.tax).toFixed(2)}</th></tr> : null}
            <tr><th colSpan={3}>Total AUD</th><th>{"$"+Number(latest?.total || 0).toFixed(2)}</th></tr>
          </tfoot>
        </ResponsiveTable>
      </div>

      {latest?.notes ? <><h2>Notes</h2><p>{latest.notes}</p></> : null}

      <hr />
      <p className="small muted">Quote reference: {quote.quote_number} · version {latest?.version_number ?? quote.current_version}. Keep the accepted version with the job record so later scope or price changes remain traceable.</p>
    </section>
  </div>;
}
