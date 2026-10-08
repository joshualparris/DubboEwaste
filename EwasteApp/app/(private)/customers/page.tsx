import { ResponsiveTable } from "@/components/ResponsiveTable";
import { createCustomer } from "../operations/actions";
import { createClient } from "@/lib/supabase/server";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{error?:string;success?:string}> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: customers } = await supabase.from("customers").select("*").order("name");
  return <div className="stack">
    <div><div className="badge">P0</div><h1>Customers & sources</h1><p className="muted">Organisations and recurring sources linked to jobs and assets.</p></div>
    {params.error ? <div className="error">{params.error}</div> : null}
    {params.success ? <div className="success">{params.success}</div> : null}
    <form action={createCustomer} className="card form">
      <h2>Add customer/source</h2>
      <div className="two"><label>Name<input name="name" required /></label><label>Contact name<input name="contact_name" /></label></div>
      <div className="two"><label>Email<input name="contact_email" type="email" /></label><label>Phone<input name="contact_phone" /></label></div>
      <label>Notes<textarea name="notes" /></label>
      <button className="button" type="submit">Create customer</button>
    </form>
    <section className="card table-wrap"><ResponsiveTable><thead><tr><th>Name</th><th>Contact</th><th>Email</th><th>Phone</th></tr></thead>
      <tbody>{(customers ?? []).map(c => <tr key={c.id}><td><strong>{c.name}</strong></td><td>{c.contact_name || "—"}</td><td>{c.contact_email || "—"}</td><td>{c.contact_phone || "—"}</td></tr>)}</tbody>
    </ResponsiveTable></section>
  </div>;
}
