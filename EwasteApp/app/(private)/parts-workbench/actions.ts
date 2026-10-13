"use server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireProgrammeContext} from "@/lib/programme-context";
const home="/parts-workbench";
const str=(f:FormData,k:string)=>String(f.get(k)??"").trim();
const uuid=(s:string)=>/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(s);
async function actor(){const {context,supabase}=await requireProgrammeContext();if(!context.global_admin&&(context.selected!=="dubbo_ewaste"||!["admin","manager","technician"].includes(context.role||"")))redirect("/dashboard");const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");return {supabase,user};}
function done(msg:string,error=false):never{revalidatePath(home);redirect(home+"?"+(error?"error":"notice")+"="+encodeURIComponent(msg));}
export async function harvestPart(f:FormData){
 const {supabase,user}=await actor(),origin=str(f,"origin_asset_id"),part_type=str(f,"part_type"),specification=str(f,"specification"),status=str(f,"test_status");
 if(!uuid(origin)||part_type.length<2||part_type.length>90||specification.length>500||!["UNTESTED","PASS","FAILED"].includes(status))done("Complete donor, part type and test state",true);
 const {data:asset}=await supabase.from("assets").select("id,programme,job_id,customer_id").eq("id",origin).eq("programme","dubbo_ewaste").maybeSingle();
 if(!asset)done("Donor not found in this programme",true);
 const {error}=await supabase.from("parts").insert({origin_asset_id:asset.id,origin_job_id:asset.job_id,origin_customer_id:asset.customer_id,part_type,specification,manufacturer:str(f,"manufacturer").slice(0,100),model:str(f,"model").slice(0,100),serial:str(f,"serial").slice(0,140),compatibility_notes:str(f,"compatibility_notes").slice(0,500),storage_label:str(f,"storage_label").slice(0,120),test_evidence:str(f,"test_evidence").slice(0,500),tested_at:status==="PASS"?new Date().toISOString():null,test_status:status,route:"STOCK",created_by:user.id,programme:"dubbo_ewaste"});
 if(error)done(error.message,true);done("Donor component recorded in available inventory.");
}
export async function installPart(f:FormData){
 const {supabase}=await actor(),part=str(f,"part_id"),repair=str(f,"repair_id"),notes=str(f,"notes");
 if(!uuid(part)||!uuid(repair)||notes.length>1000)done("Choose a part and repair",true);
 const {error}=await supabase.rpc("install_stock_part",{p_part_id:part,p_repair_id:repair,p_notes:notes});
 if(error)done(error.message,true);done("Part installed, reserved from stock and recorded in installation history.");
}

export async function returnPart(f:FormData){
 const {supabase}=await actor(),part=str(f,"part_id"),reason=str(f,"reason");
 if(!uuid(part)||reason.length<10||reason.length>1000)done("A detailed removal reason is required",true);
 const {error}=await supabase.rpc("return_installed_part",{p_part_id:part,p_reason:reason});
 if(error)done(error.message,true);done("Removed part returned to quarantine: test again before reuse.");
}

export async function moveConsumable(f:FormData){
 const {supabase}=await actor(),id=str(f,"consumable_id"),delta=Number(str(f,"delta")),reason=str(f,"reason"),repair=str(f,"repair_id");
 if(!uuid(id)||!Number.isFinite(delta)||delta===0||Math.abs(delta)>10000||reason.length<5||reason.length>500||(repair&&!uuid(repair)))done("Invalid stock movement",true);
 const {error}=await supabase.rpc("adjust_part_consumable",{p_id:id,p_delta:delta,p_reason:reason,p_repair:repair||null});
 if(error)done(error.message,true);done("Consumable quantity and movement ledger updated.");
}

export async function createConsumable(f:FormData){
 const {supabase}=await actor(),sku=str(f,"sku"),name=str(f,"name"),unit=str(f,"unit"),cost=Number(str(f,"unit_cost")||"0");
 if(sku.length<3||sku.length>60||name.length<3||name.length>150||!unit||unit.length>30||!Number.isFinite(cost)||cost<0)done("Enter valid SKU, name and unit cost",true);
 const {error}=await supabase.rpc("create_part_consumable",{p_sku:sku,p_name:name,p_unit:unit,p_unit_cost:cost});
 if(error)done(error.message,true);done("Consumable SKU created. Record stock received as a separate movement.");
}
