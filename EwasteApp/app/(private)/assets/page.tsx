import Link from "next/link";
import { AssetBatchTable } from "@/components/AssetBatchTable";
import { createClient } from "@/lib/supabase/server";

export default async function AssetsPage() {
  const supabase = await createClient();
  const { data: assets } = await supabase
    .from("assets")
    .select("id,programme,asset_code,category,manufacturer,model,serial_imei,status,data_state,initial_route,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="stack">
      <div>
        <h1>Assets</h1>
        <p className="muted">The canonical operational inventory.</p>
      </div>
      <div className="actions"><Link className="button" href="/assets/new">New intake</Link></div>
      <AssetBatchTable assets={assets ?? []} />
    </div>
  );
}
