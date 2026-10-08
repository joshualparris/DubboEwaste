import { LocalDateTimeInput } from "@/components/LocalDateTimeInput";
import Link from "next/link";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { requireProgrammeContext } from "@/lib/programme-context";
import { checkoutItem, returnItem } from "./actions";

export default async function LendingPage({searchParams}:{searchParams:Promise<{error?:string;success?:string}>}) {
  const {supabase,context}=await requireProgrammeContext();
  const [{data:assets},{data:borrowers},{data:loans}]=await Promise.all([
    supabase.from("assets").select("id,asset_code,category,manufacturer,model").eq("programme","library_of_things").eq("owner_kind","PROGRAMME").order("asset_code"),
    supabase.from("customers").select("id,name").eq("programme","library_of_things").order("name"),
    supabase.from("item_loans").select("*,assets(asset_code),customers(name)").order("checked_out_at",{ascending:false})
  ]);
  const {error,success}=await searchParams;
  const open=(loans||[]).filter(l=>!l.returned_at);
  const available=(assets||[]).filter(a=>!open.some(l=>l.asset_id===a.id));
  const canEdit=context.role!=="auditor";
  return <div className="stack"><div><div className="badge">Library of Things</div><h1>Loans & returns</h1><p className="muted">Catalogue items, record borrowers and inspect each item when it comes back.</p></div>
    {error?<div className="error">{error}</div>:null}{success?<div className="success">{success}</div>:null}
    <div className="actions"><Link className="button secondary" href="/assets/new">Catalogue item</Link><Link className="button secondary" href="/customers">Borrowers</Link></div>
    {canEdit?<form action={checkoutItem} className="card form"><h2>Lend an item</h2><p className="muted small">Only programme-owned items without an open loan are available.</p><label>Item<select name="asset_id" required defaultValue=""><option value="" disabled>Choose item</option>{available.map(a=><option key={a.id} value={a.id}>{a.asset_code} · {[a.manufacturer,a.model].filter(Boolean).join(" ")||a.category}</option>)}</select></label><label>Borrower<select name="borrower_id" required defaultValue=""><option value="" disabled>Choose borrower</option>{(borrowers||[]).map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label><label>Due back<LocalDateTimeInput name="due_at"/></label><label>Condition at checkout<textarea name="condition_out" required maxLength={1000}/></label><label>Notes<textarea name="notes" maxLength={2000}/></label><button className="button" disabled={!available.length||!borrowers?.length}>Check out</button></form>:null}
    <section className="card"><h2>Loan history</h2>{!loans?.length?<p className="muted">No loans yet.</p>:<div className="table-wrap"><ResponsiveTable><thead><tr><th>Item</th><th>Borrower</th><th>Due</th><th>Status / return</th></tr></thead><tbody>{loans.map(l=><tr key={l.id}><td><Link href={"/assets/"+l.asset_id}>{l.assets?.asset_code||l.asset_id}</Link></td><td>{l.customers?.name||"Borrower"}</td><td>{new Date(l.due_at).toLocaleString("en-AU")}</td><td>{l.returned_at?"Returned "+new Date(l.returned_at).toLocaleDateString("en-AU"):canEdit?<form action={returnItem} className="mini-form"><input type="hidden" name="loan_id" value={l.id}/><label>Condition on return<input name="condition_in" required maxLength={1000}/></label><button className="button secondary">Return & inspect</button></form>:"On loan"}</td></tr>)}</tbody></ResponsiveTable></div>}</section>
  </div>;
}
