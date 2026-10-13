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
 const {supabase,user}=await actor();
 const origin=str(f,"origin_asset_id"),code=str(f,"part_type_code"),preset=str(f,"spec_preset"),status=str(f,"test_status");
 if(!uuid(origin))done("Search for a donor and tap the correct asset before saving",true);
 if(str(f,"donor_authorised")!=="yes")done("Confirm that this item is available for component recovery",true);
 const {data:type,error:typeError}=await supabase.from("part_type_catalog").select("code,label,spec_options,default_storage").eq("code",code).eq("active",true).maybeSingle();
 if(typeError||!type)done("Choose a recognised part type",true);
 let description=type.label;
 if(code==="OTHER"){
   const other=str(f,"other_type");
   if(other.length<3||other.length>70)done("Describe the part type",true);
   description=other;
 }
 const options=Array.isArray(type.spec_options)?type.spec_options.filter((s:unknown):s is string=>typeof s==="string"):[];
 let specification="";
 if(preset==="CUSTOM")specification=str(f,"specification");
 else if(preset==="")specification="";
 else if(options.includes(preset))specification=preset;
 else done("Select a listed specification, or choose custom",true);
 if(specification.length>500)done("Specification is too long",true);
 if(!["UNTESTED","PASS","FAILED"].includes(status))done("Choose a testing status",true);
 const evidence=str(f,"test_evidence");
 if(status==="PASS"&&evidence.length<8)done("Please record the real testing performed before marking a part tested-good",true);
 if(evidence.length>500)done("Testing notes are too long",true);
 const {data:asset}=await supabase.from("assets").select("id,programme,job_id,customer_id").eq("id",origin).eq("programme","dubbo_ewaste").maybeSingle();
 if(!asset)done("Donor not found in the DubboEwaste programme",true);
 const cost=Number(str(f,"estimated_value")||"0");
 if(!Number.isFinite(cost)||cost<0||cost>100000)done("Enter a valid part value",true);
 const {data:part,error}=await supabase.from("parts").insert({
   estimated_value:cost,origin_asset_id:asset.id,origin_job_id:asset.job_id,origin_customer_id:asset.customer_id,
   part_type:description,part_type_code:code,specification,
   manufacturer:str(f,"manufacturer").slice(0,100),model:str(f,"model").slice(0,100),serial:str(f,"serial").slice(0,140),
   compatibility_notes:str(f,"compatibility_notes").slice(0,500),
   storage_label:(str(f,"storage_label")||type.default_storage).slice(0,120),
   test_evidence:evidence,tested_at:status==="PASS"?new Date().toISOString():null,
   test_status:status,route:"STOCK",created_by:user.id,programme:"dubbo_ewaste"
 }).select("part_code").single();
 if(error)done(error.message,true);
 done("Component saved as "+part.part_code+". Its ID was generated automatically.");
}
export async function installPart(f:FormData){
 const {supabase}=await actor(),part=str(f,"part_id"),repair=str(f,"repair_id"),notes=str(f,"notes");
 if(!uuid(part)||!uuid(repair)||notes.length>1000)done("Choose a part and repair",true);
 if(str(f,"fit_confirmed")!=="yes")done("Confirm physical and electrical compatibility before installing",true);
 const {error}=await supabase.rpc("install_stock_part",{p_part_id:part,p_repair_id:repair,p_notes:"Fit and specifications checked: "+notes});
 if(error)done(error.message,true);done("Part installed, reserved from stock and recorded in installation history.");
}

export async function returnPart(f:FormData){
 const {supabase}=await actor(),part=str(f,"part_id"),reason=str(f,"reason");
 if(!uuid(part)||reason.length<10||reason.length>1000)done("A detailed removal reason is required",true);
 const {error}=await supabase.rpc("return_installed_part",{p_part_id:part,p_reason:reason});
 if(error)done(error.message,true);done("Removed part returned to quarantine: test again before reuse.");
}

export async function moveConsumable(f:FormData){
 const {supabase}=await actor(),id=str(f,"consumable_id"),direction=str(f,"direction"),amount=Number(str(f,"quantity")),repair=str(f,"repair_id");
 if(!uuid(id)||!["receive","use"].includes(direction)||!Number.isFinite(amount)||amount<=0||amount>10000||(repair&&!uuid(repair)))done("Choose receipt/use and a positive quantity",true);
 const detail=str(f,"reason");
 if(detail.length>500)done("Notes are too long",true);
 const delta=direction==="receive"?amount:-amount;
 const reason=detail|| (direction==="receive"?"Stock receipt":repair?"Consumed for linked repair":"General workshop consumption");
 const {error}=await supabase.rpc("adjust_part_consumable",{p_id:id,p_delta:delta,p_reason:reason,p_repair:direction==="use"?(repair||null):null});
 if(error)done(error.message,true);done(direction==="receive"?"Received "+amount+" units of stock.":"Recorded "+amount+" units used.");
}

export async function createConsumable(f:FormData){
 const {supabase}=await actor(),category=str(f,"category_code"),name=str(f,"name"),unit=str(f,"unit"),cost=Number(str(f,"unit_cost")||"0"),opening=Number(str(f,"initial_qty")||"0");
 if(category.length<2||category.length>50||name.length<3||name.length>150||!unit||unit.length>30||!Number.isFinite(cost)||cost<0||cost>100000||!Number.isFinite(opening)||opening<0||opening>1000000)done("Check the item name, category, unit, cost and opening quantity",true);
 const {data,error}=await supabase.rpc("create_part_consumable_auto",{p_name:name,p_category:category,p_unit:unit,p_unit_cost:cost,p_initial_qty:opening});
 if(error)done(error.message,true);
 done("Created "+data+". SKU generated automatically"+(opening>0?" and opening stock recorded.":"."));
}
