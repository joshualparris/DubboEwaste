"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const optionalUuid = z.preprocess((v) => v === "" || v == null ? undefined : v, z.string().uuid().optional());
const money = z.preprocess((v) => v === "" || v == null ? 0 : Number(v), z.number().nonnegative());

async function ctx() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function createPricingRule(formData: FormData) {
  const parsed=z.object({
    name:z.string().trim().min(2).max(160),
    category:z.string().trim().max(80).optional(),
    grade:z.string().trim().max(40).optional(),
    base_price:money,
    min_price:money,
  }).safeParse(Object.fromEntries(formData));
  if(!parsed.success) redirect("/resale?error=Check%20pricing%20rule");
  const {supabase,user}=await ctx();
  await supabase.from("pricing_rules").insert({
    name:parsed.data.name,
    category:parsed.data.category||null,
    grade:parsed.data.grade||null,
    base_price:parsed.data.base_price,
    min_price:parsed.data.min_price,
    created_by:user.id,
  });
  revalidatePath("/resale");
}

export async function addMarketObservation(formData: FormData) {
  const parsed=z.object({
    category:z.string().trim().min(1).max(80),
    manufacturer:z.string().trim().max(100).optional(),
    model:z.string().trim().max(160).optional(),
    grade:z.string().trim().max(40).optional(),
    source:z.string().trim().min(2).max(160),
    observed_price:z.preprocess((v)=>Number(v),z.number().nonnegative()),
    notes:z.string().trim().max(2000).optional(),
  }).safeParse(Object.fromEntries(formData));
  if(!parsed.success) redirect("/resale?error=Check%20market%20observation");
  const {supabase,user}=await ctx();
  await supabase.from("market_observations").insert({
    ...parsed.data,
    manufacturer:parsed.data.manufacturer||null,
    model:parsed.data.model||null,
    grade:parsed.data.grade||null,
    notes:parsed.data.notes||null,
    created_by:user.id,
  });
  revalidatePath("/resale");
}

export async function createAutoPricedListing(formData: FormData) {
  const parsed=z.object({
    asset_id:z.string().uuid(),
    sku:z.string().trim().min(2).max(120),
    channel:z.string().trim().max(100).optional(),
    title:z.string().trim().min(2).max(250),
    description:z.string().trim().max(5000).optional(),
    asking_price:z.preprocess((v)=>v===""||v==null?undefined:Number(v),z.number().nonnegative().optional()),
  }).safeParse(Object.fromEntries(formData));
  if(!parsed.success) redirect("/resale?error=Check%20listing%20fields");

  const {supabase,user}=await ctx();
  const [{data:asset},{data:grade},{data:rules}] = await Promise.all([
    supabase.from("assets").select("*").eq("id",parsed.data.asset_id).single(),
    supabase.from("grades").select("*").eq("asset_id",parsed.data.asset_id).order("graded_at",{ascending:false}).limit(1).maybeSingle(),
    supabase.from("pricing_rules").select("*").eq("enabled",true),
  ]);
  if(!asset?.ownership_verified || !["VERIFIED_CLEARED","NON_DATA_BEARING"].includes(asset.data_state) || !grade?.final_grade){
    redirect("/resale?error=Asset%20does%20not%20pass%20the%20resale%20qualification%20gate");
  }

  const {data:observations}=await supabase.from("market_observations").select("*").eq("category",asset.category).order("observed_at",{ascending:false}).limit(100);
  let price=parsed.data.asking_price;
  let priceSource="MANUAL";

  if(price===undefined){
    const candidates=(rules??[]).filter((r:any)=>
      (!r.category || r.category===asset.category) && (!r.grade || r.grade===grade.final_grade)
    ).sort((a:any,b:any)=>{
      const sa=(a.category?1:0)+(a.grade?1:0);
      const sb=(b.category?1:0)+(b.grade?1:0);
      return sb-sa;
    });
    const rule=candidates[0];
    if(rule){
      price=Math.max(Number(rule.min_price??0),Number(rule.base_price??0));
      priceSource="RULE:"+rule.name;
    } else {
      const matching=(observations??[]).filter((o:any)=>
        (!o.model || !asset.model || String(o.model).toLowerCase()===String(asset.model).toLowerCase()) &&
        (!o.grade || o.grade===grade.final_grade)
      ).map((o:any)=>Number(o.observed_price)).filter((n:number)=>Number.isFinite(n)).sort((a:number,b:number)=>a-b);
      if(matching.length){
        const mid=Math.floor(matching.length/2);
        price=matching.length%2?matching[mid]:(matching[mid-1]+matching[mid])/2;
        priceSource="MARKET_MEDIAN";
      }
    }
  }
  if(price===undefined) redirect("/resale?error=No%20manual%20price%20or%20pricing%20rule%2Fmarket%20observation%20available");

  await supabase.from("resale_listings").insert({
    asset_id:parsed.data.asset_id,
    sku:parsed.data.sku,
    channel:parsed.data.channel||null,
    title:parsed.data.title,
    description:parsed.data.description||null,
    asking_price:Number(price.toFixed(2)),
    status:"QUALIFIED",
    created_by:user.id,
  });
  await supabase.from("assets").update({status:"READY_FOR_SALE"}).eq("id",parsed.data.asset_id);
  await supabase.from("operational_events").insert({
    entity_type:"asset",entity_id:parsed.data.asset_id,event_type:"RESALE_QUALIFIED",actor_id:user.id,
    details:{sku:parsed.data.sku,asking_price:Number(price.toFixed(2)),pricing_source:priceSource}
  });
  revalidatePath("/resale");
  revalidatePath("/assets/"+parsed.data.asset_id);
}

export async function openReturn(formData: FormData) {
  const parsed=z.object({
    sale_id:optionalUuid,
    asset_id:z.string().uuid(),
    reason:z.string().trim().min(2).max(3000),
  }).safeParse(Object.fromEntries(formData));
  if(!parsed.success) redirect("/resale?error=Check%20return%20fields");
  const {supabase,user}=await ctx();
  await supabase.from("returns_rma").insert({
    sale_id:parsed.data.sale_id||null,
    asset_id:parsed.data.asset_id,
    reason:parsed.data.reason,
    created_by:user.id,
  });
  await supabase.from("assets").update({status:"HOLD"}).eq("id",parsed.data.asset_id);
  await supabase.from("operational_events").insert({
    entity_type:"asset",entity_id:parsed.data.asset_id,event_type:"RETURN_OPENED",actor_id:user.id,details:{reason:parsed.data.reason}
  });
  revalidatePath("/resale");
  revalidatePath("/assets/"+parsed.data.asset_id);
}

export async function resolveReturn(formData: FormData) {
  const parsed=z.object({
    return_id:z.string().uuid(),
    status:z.enum(["REFUNDED","REPAIRED","REPLACED","CLOSED","REJECTED"]),
    resolution:z.string().trim().min(2).max(3000),
    refund_amount:money,
    internal_cost:money,
  }).safeParse(Object.fromEntries(formData));
  if(!parsed.success) redirect("/resale?error=Check%20return%20resolution");
  const {supabase}=await ctx();
  const {data:r}=await supabase.from("returns_rma").select("asset_id").eq("id",parsed.data.return_id).single();
  if(!r) redirect("/resale?error=Return%20not%20found");
  await supabase.from("returns_rma").update({
    status:parsed.data.status,
    resolution:parsed.data.resolution,
    refund_amount:parsed.data.refund_amount,
    internal_cost:parsed.data.internal_cost,
    resolved_at:new Date().toISOString(),
  }).eq("id",parsed.data.return_id);
  if(parsed.data.status==="REPAIRED") await supabase.from("assets").update({status:"READY_FOR_SALE"}).eq("id",r.asset_id);
  revalidatePath("/resale");
  revalidatePath("/assets/"+r.asset_id);
}

export async function createSettlement(formData: FormData) {
  const parsed=z.object({
    job_id:z.string().uuid(),
    customer_id:optionalUuid,
    material_revenue:money,
    service_revenue:money,
    scrap_value:money,
    labour_cost:money,
    customer_share_percent:z.preprocess((v)=>v===""?0:Number(v),z.number().min(0).max(100)),
  }).safeParse(Object.fromEntries(formData));
  if(!parsed.success) redirect("/settlements?error=Check%20settlement%20fields");

  const {supabase,user}=await ctx();
  const {data:assets}=await supabase.from("assets").select("id,customer_id").eq("job_id",parsed.data.job_id);
  const ids=(assets??[]).map((a)=>a.id);
  let sales:any[]=[];
  let repairs:any[]=[];
  if(ids.length){
    const [salesResult,repairResult]=await Promise.all([
      supabase.from("sales").select("sold_price,fees,freight").in("asset_id",ids),
      supabase.from("repairs").select("actual_parts_cost,estimated_parts_cost").in("asset_id",ids),
    ]);
    sales=salesResult.data??[];
    repairs=repairResult.data??[];
  }

  const resaleRevenue=sales.reduce((n,s)=>n+Number(s.sold_price??0),0);
  const marketplaceFees=sales.reduce((n,s)=>n+Number(s.fees??0),0);
  const freight=sales.reduce((n,s)=>n+Number(s.freight??0),0);
  const partsCost=repairs.reduce((n,r)=>n+Number(r.actual_parts_cost??r.estimated_parts_cost??0),0);
  const gross=parsed.data.material_revenue+resaleRevenue+parsed.data.service_revenue+parsed.data.scrap_value;
  const costs=freight+marketplaceFees+partsCost+parsed.data.labour_cost;
  const contribution=Math.max(0,gross-costs);
  const customerShare=Number((contribution*parsed.data.customer_share_percent/100).toFixed(2));

  await supabase.from("settlements").insert({
    job_id:parsed.data.job_id,
    customer_id:parsed.data.customer_id||(assets?.[0]?.customer_id??null),
    model:parsed.data.customer_share_percent>0?"CONSIGNMENT":"SERVICE_OR_BUYOUT",
    material_revenue:parsed.data.material_revenue,
    resale_revenue:resaleRevenue,
    service_revenue:parsed.data.service_revenue,
    scrap_value:parsed.data.scrap_value,
    freight,
    marketplace_fees:marketplaceFees,
    parts_cost:partsCost,
    labour_cost:parsed.data.labour_cost,
    customer_share:customerShare,
    status:"DRAFT",
    created_by:user.id,
  });
  await supabase.from("operational_events").insert({
    entity_type:"job",entity_id:parsed.data.job_id,event_type:"SETTLEMENT_CALCULATED",actor_id:user.id,
    details:{gross_revenue:gross,direct_costs:costs,contribution,customer_share:customerShare}
  });
  revalidatePath("/settlements");
}
