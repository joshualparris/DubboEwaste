import Link from "next/link";
import { AssetBatchTable } from "@/components/AssetBatchTable";
import { requireProgrammeContext } from "@/lib/programme-context";
import { canUseSmartIntake } from "@/lib/programmes";

export default async function AssetsPage({searchParams}:{searchParams:Promise<{status?:string}>}) {
  const params=await searchParams;
  const readyForSale=params.status==="READY_FOR_SALE";
  const { supabase, context } = await requireProgrammeContext();
  // Read all available inventory in bounded pages, preserving the signed-in RLS scope.
  const fields="id,programme,asset_code,category,manufacturer,model,serial_imei,status,data_state,initial_route,created_at,location_id,job_id";
  const query=()=>{const q=supabase.from("assets").select(fields);return readyForSale?q.eq("status","READY_FOR_SALE"):q;};
  const first=await query().order("created_at",{ascending:false}).order("id",{ascending:true}).range(0,499);
  const assets=[...(first.data??[])];
  let loadError=!!first.error, truncated=false;
  if(!loadError&&assets.length===500){
    for(let offset=500;offset<5000;offset+=500){
      const result=await query().order("created_at",{ascending:false}).order("id",{ascending:true}).range(offset,offset+499);
      if(result.error){loadError=true;break;}
      assets.push(...(result.data??[]));
      if((result.data??[]).length<500)break;
      if(offset===4500)truncated=true;
    }
  }
  const [{data:locations},{data:jobs}]=await Promise.all([supabase.from("locations").select("id,name").order("name"),supabase.from("jobs").select("id,job_code,source_site").order("created_at",{ascending:false})]);

  return (
    <div className="stack">
      <div>
        <h1>{readyForSale?"Assets ready for sale":"Assets"}</h1>
        <p className="muted">{readyForSale?"Assets marked READY_FOR_SALE; listing and sanitisation gates still apply.":"The canonical operational inventory."}</p>
      </div>
      <div className="actions"><Link className="button secondary" href={readyForSale?"/assets":"/assets?status=READY_FOR_SALE"}>{readyForSale?"Show all assets":"Show sale-ready assets"}</Link>{canUseSmartIntake(context) ? <Link className="button" href="/assets/smart-intake">Smart Intake</Link> : null}<Link className="button secondary" href="/assets/new">Manual intake</Link></div>
      {loadError?<p className="error">Inventory could not be loaded completely. Refresh before selecting assets.</p>:null}{truncated?<p className="muted">Showing the newest 5,000 assets; filters apply to this loaded inventory.</p>:null}<AssetBatchTable assets={assets} canRemove={!loadError&&canUseSmartIntake(context)} locations={locations??[]} jobs={jobs??[]} />
    </div>
  );
}
