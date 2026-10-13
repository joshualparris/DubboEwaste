import Link from "next/link";
import { AssetBatchTable } from "@/components/AssetBatchTable";
import { createClient } from "@/lib/supabase/server";

export default async function AssetsPage({searchParams}:{searchParams:Promise<{status?:string}>}) {
  const params=await searchParams;
  const readyForSale=params.status==="READY_FOR_SALE";
  const supabase = await createClient();
  let assetsQuery=supabase.from("assets")
    .select("id,programme,asset_code,category,manufacturer,model,serial_imei,status,data_state,initial_route,created_at");
  if(readyForSale) assetsQuery=assetsQuery.eq("status","READY_FOR_SALE");
  const {data:assets}=await assetsQuery.order("created_at",{ascending:false}).limit(100);

  return (
    <div className="stack">
      <div>
        <h1>{readyForSale?"Assets ready for sale":"Assets"}</h1>
        <p className="muted">{readyForSale?"Assets marked READY_FOR_SALE; listing and sanitisation gates still apply.":"The canonical operational inventory."}</p>
      </div>
      <div className="actions"><Link className="button secondary" href={readyForSale?"/assets":"/assets?status=READY_FOR_SALE"}>{readyForSale?"Show all assets":"Show sale-ready assets"}</Link><Link className="button" href="/assets/new">New intake</Link></div>
      <AssetBatchTable assets={assets ?? []} />
    </div>
  );
}
