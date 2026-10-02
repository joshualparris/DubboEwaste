import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AssetsPage() {
  const supabase = await createClient();
  const { data: assets } = await supabase
    .from("assets")
    .select("id,asset_code,category,manufacturer,model,serial_imei,status,data_state,initial_route,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="stack">
      <div>
        <h1>Assets</h1>
        <p className="muted">The canonical operational inventory.</p>
      </div>
      <div className="actions"><Link className="button" href="/assets/new">New intake</Link></div>
      <section className="card table-wrap">
        <table>
          <thead>
            <tr><th>Asset</th><th>Category</th><th>Device</th><th>Serial / IMEI</th><th>Status</th><th>Data</th><th>Route</th></tr>
          </thead>
          <tbody>
            {(assets ?? []).map((asset) => (
              <tr key={asset.id}>
                <td><Link href={`/assets/${asset.id}`}><strong>{asset.asset_code}</strong></Link></td>
                <td>{asset.category}</td>
                <td>{[asset.manufacturer, asset.model].filter(Boolean).join(" ") || "—"}</td>
                <td>{asset.serial_imei || "—"}</td>
                <td><span className="badge">{asset.status}</span></td>
                <td>{asset.data_state}</td>
                <td>{asset.initial_route || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
