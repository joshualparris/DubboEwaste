import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { evaluateAssetLifecycle } from "@/lib/asset-lifecycle";

function group(rows: any[] | null | undefined, key: string) {
  const out = new Map<string, any[]>();
  for (const row of rows ?? []) {
    const id = String(row[key] ?? "");
    if (!id) continue;
    const current = out.get(id) ?? [];
    current.push(row);
    out.set(id, current);
  }
  return out;
}

export default async function WorkflowPage() {
  const supabase = await createClient();
  const [
    assetsResult,
    authorityResult,
    triageResult,
    quarantineResult,
    mediaResult,
    testsResult,
    gradesResult,
    repairsResult,
    dispositionsResult,
    partsResult,
    listingsResult,
    salesResult,
    outboundResult,
    palletContentsResult,
    certificatesResult,
    exceptionsResult,
  ] = await Promise.all([
    supabase.from("assets").select("id,asset_code,category,manufacturer,model,ownership_verified,data_bearing,data_state,status,created_at").order("created_at",{ascending:false}),
    supabase.from("asset_authority_records").select("*"),
    supabase.from("asset_triage_assessments").select("*"),
    supabase.from("asset_quarantines").select("*"),
    supabase.from("media").select("id,parent_asset_id,data_state"),
    supabase.from("asset_tests").select("*"),
    supabase.from("grades").select("*"),
    supabase.from("repairs").select("*"),
    supabase.from("dispositions").select("*"),
    supabase.from("parts").select("*"),
    supabase.from("resale_listings").select("*"),
    supabase.from("sales").select("*"),
    supabase.from("outbound_contents").select("entity_type,entity_id,outbound_orders(status,outbound_code)"),
    supabase.from("pallet_contents").select("pallet_id,entity_type,entity_id").eq("entity_type","ASSET").is("removed_at",null),
    supabase.from("certificates").select("*"),
    supabase.from("exceptions").select("*").eq("entity_type","asset"),
  ]);

  const assets = assetsResult.data ?? [];
  const authority = group(authorityResult.data,"asset_id");
  const triage = group(triageResult.data,"asset_id");
  const quarantines = group(quarantineResult.data,"asset_id");
  const media = group(mediaResult.data,"parent_asset_id");
  const tests = group(testsResult.data,"asset_id");
  const grades = group(gradesResult.data,"asset_id");
  const repairs = group(repairsResult.data,"asset_id");
  const dispositions = group(dispositionsResult.data,"asset_id");
  const parts = group(partsResult.data,"origin_asset_id");
  const listings = group(listingsResult.data,"asset_id");
  const sales = group(salesResult.data,"asset_id");
  const certs = group(certificatesResult.data,"asset_id");
  const exceptions = group(exceptionsResult.data,"entity_id");

  const outbound = new Map<string,any[]>();
  const assetsByPallet=new Map<string,string[]>();
  for(const row of palletContentsResult.data ?? []){
    const current=assetsByPallet.get(row.pallet_id)??[];
    current.push(row.entity_id);
    assetsByPallet.set(row.pallet_id,current);
  }
  for (const row of outboundResult.data ?? []) {
    const record={
      status:(row as any).outbound_orders?.status,
      outbound_code:(row as any).outbound_orders?.outbound_code,
    };
    const assetIds = row.entity_type === "ASSET"
      ? [row.entity_id]
      : row.entity_type === "PALLET"
        ? (assetsByPallet.get(row.entity_id)??[])
        : [];
    for(const assetId of assetIds){
      const current = outbound.get(assetId) ?? [];
      current.push(record);
      outbound.set(assetId,current);
    }
  }

  const evaluated = assets.map((asset:any)=>({
    asset,
    lifecycle:evaluateAssetLifecycle({
      asset,
      authorityRecords:authority.get(asset.id),
      triageAssessments:triage.get(asset.id),
      quarantines:quarantines.get(asset.id),
      media:media.get(asset.id),
      tests:tests.get(asset.id),
      grades:grades.get(asset.id),
      repairs:repairs.get(asset.id),
      dispositions:dispositions.get(asset.id),
      parts:parts.get(asset.id),
      listings:listings.get(asset.id),
      sales:sales.get(asset.id),
      outbound:outbound.get(asset.id),
      certificates:certs.get(asset.id),
      exceptions:exceptions.get(asset.id),
    }),
  }));

  const blocked=evaluated.filter((x)=>x.lifecycle.blockers.length>0);
  const done=evaluated.filter((x)=>x.lifecycle.progress===100);
  const active=evaluated.filter((x)=>x.lifecycle.progress<100);

  return <div className="stack">
    <div>
      <div className="badge">Lifecycle control</div>
      <h1>Asset workflow</h1>
      <p className="muted">One queue from receipt and authority through triage, sanitisation, diagnostics, grade, repair, final route, certificate and reporting evidence.</p>
    </div>

    <div className="grid">
      <div className="card"><div className="muted">Active assets</div><div className="metric">{active.length}</div></div>
      <div className="card"><div className="muted">Blocked / exceptions</div><div className="metric">{blocked.length}</div></div>
      <div className="card"><div className="muted">Lifecycle complete</div><div className="metric">{done.length}</div></div>
      <div className="card"><div className="muted">Total tracked</div><div className="metric">{evaluated.length}</div></div>
    </div>

    <section className="card">
      <h2>Workflow queue</h2>
      {!evaluated.length ? <p className="muted">No assets yet.</p> :
      <div className="table-wrap"><table>
        <thead><tr><th>Asset</th><th>Current database status</th><th>Lifecycle</th><th>Next action</th><th>Blockers</th></tr></thead>
        <tbody>{evaluated.map(({asset,lifecycle})=><tr key={asset.id}>
          <td><Link href={"/assets/"+asset.id}><strong>{asset.asset_code}</strong></Link><div className="small muted">{[asset.manufacturer,asset.model].filter(Boolean).join(" ")||asset.category}</div></td>
          <td><span className="badge">{asset.status}</span><div className="small muted">{asset.data_state}</div></td>
          <td><strong>{lifecycle.progress}%</strong><div className="small muted">{lifecycle.finalRoute ? "Final route: "+lifecycle.finalRoute : "No final route yet"}</div></td>
          <td>{lifecycle.next ? <Link href={lifecycle.next.href}><strong>{lifecycle.next.label} →</strong><div className="small muted">{lifecycle.next.summary}</div></Link> : <strong>Complete</strong>}</td>
          <td>{lifecycle.blockers.length ? <details><summary>{lifecycle.blockers.length} blocker{lifecycle.blockers.length===1?"":"s"}</summary><ul>{lifecycle.blockers.map((b:string,i:number)=><li key={i}>{b}</li>)}</ul></details> : <span className="muted">None</span>}</td>
        </tr>)}</tbody>
      </table></div>}
    </section>

    <section className="card">
      <h2>Stage model</h2>
      <p className="muted">Received → ownership/authority → intake triage → quarantine clearance → model identity → sanitisation → diagnostics → grade → repair if required → final disposition → route completion → certificate.</p>
      <p className="small">The lifecycle is derived from source records. AssetFlow does not mark a step complete merely because someone manually changes a status label.</p>
    </section>
  </div>;
}
