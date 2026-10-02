import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: all }, { count: unwiped }, { count: ready }, { data: recent }] = await Promise.all([
    supabase.from("assets").select("*", { count: "exact", head: true }),
    supabase.from("assets").select("*", { count: "exact", head: true }).eq("data_state", "UNWIPED_RESTRICTED"),
    supabase.from("assets").select("*", { count: "exact", head: true }).eq("status", "READY_FOR_SALE"),
    supabase.from("assets").select("id,asset_code,category,manufacturer,model,status,created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  return (
    <div className="stack">
      <div>
        <div className="badge">First slice</div>
        <h1>Operations dashboard</h1>
        <p className="muted">Private asset register, intake and chain-of-custody foundation.</p>
      </div>

      <div className="grid">
        <div className="card"><div className="muted">Total assets</div><div className="metric">{all ?? 0}</div></div>
        <div className="card"><div className="muted">Unwiped restricted</div><div className="metric">{unwiped ?? 0}</div></div>
        <div className="card"><div className="muted">Ready for sale</div><div className="metric">{ready ?? 0}</div></div>
      </div>

      <div className="actions">
        <Link className="button" href="/assets/new">Start new intake</Link>
        <Link className="button secondary" href="/assets">View inventory</Link>
      </div>

      <section className="card">
        <h2>Recent assets</h2>
        {!recent?.length ? (
          <p className="muted">No assets yet. Create the first intake record.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Asset</th><th>Device</th><th>Status</th></tr></thead>
              <tbody>
                {recent.map((asset) => (
                  <tr key={asset.id}>
                    <td><Link href={`/assets/${asset.id}`}><strong>{asset.asset_code}</strong></Link></td>
                    <td>{[asset.manufacturer, asset.model].filter(Boolean).join(" ") || asset.category}</td>
                    <td><span className="badge">{asset.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
