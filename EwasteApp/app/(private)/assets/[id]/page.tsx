import { notFound } from "next/navigation";
import { AssetQr } from "@/components/AssetQr";
import { createClient } from "@/lib/supabase/server";

export default async function AssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: asset }, { data: events }] = await Promise.all([
    supabase.from("assets").select("*").eq("id", id).single(),
    supabase.from("asset_events").select("id,event_type,created_at,actor_id,details").eq("asset_id", id).order("created_at", { ascending: false }).limit(25),
  ]);

  if (!asset) notFound();

  return (
    <div className="stack">
      <div>
        <div className="badge">{asset.status}</div>
        <h1>{asset.asset_code}</h1>
        <p className="muted">{[asset.manufacturer, asset.model].filter(Boolean).join(" ") || asset.category}</p>
      </div>

      <div className="grid">
        <section className="card">
          <h2>Asset label</h2>
          <AssetQr assetCode={asset.asset_code} assetId={asset.id} />
        </section>

        <section className="card">
          <h2>Intake state</h2>
          <p><strong>Category:</strong> {asset.category}</p>
          <p><strong>Serial / IMEI:</strong> {asset.serial_imei || "—"}</p>
          <p><strong>Source:</strong> {asset.source_name || "—"}</p>
          <p><strong>Ownership verified:</strong> {asset.ownership_verified ? "Yes" : "No"}</p>
          <p><strong>Data state:</strong> {asset.data_state}</p>
          <p><strong>Initial route:</strong> {asset.initial_route || "—"}</p>
        </section>
      </div>

      <section className="card">
        <h2>Notes</h2>
        <p>{asset.notes || "No notes yet."}</p>
      </section>

      <section className="card">
        <h2>Audit history</h2>
        {!events?.length ? <p className="muted">No events yet.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Time</th><th>Event</th><th>Details</th></tr></thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{new Date(event.created_at).toLocaleString("en-AU")}</td>
                    <td>{event.event_type}</td>
                    <td className="small">{JSON.stringify(event.details)}</td>
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
