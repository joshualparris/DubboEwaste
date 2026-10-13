"use server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireProgrammeContext} from "@/lib/programme-context";
const root="/repair-cafe-volunteers/compliance";
function field(f:FormData,k:string){return String(f.get(k)??"").trim()}
async function manager(){
 const {context,supabase}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role??"")))redirect("/repair-cafe-volunteers");
 const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 // DB enforces programme-specific membership even for global admins.
 return supabase;
}
function response(message:string,isError=false):never{revalidatePath(root);redirect(root+"?"+(isError?"error":"notice")+"="+encodeURIComponent(message))}
export async function saveControl(f:FormData){
 const db=await manager();
 const id=field(f,"id"),owner=field(f,"owner_name"),evidence=field(f,"evidence_reference"),status=field(f,"status");
 if(!/^[\da-f-]{36}$/i.test(id)||!["not_started","in_progress","awaiting_verification","verified"].includes(status)||owner.length>120||evidence.length>1000)response("Invalid control data",true);
 const {error}=await db.from("repair_cafe_risk_controls").update({status,owner_name:owner||"Unassigned",evidence_reference:evidence,...(f.has("due_on")?{due_on:field(f,"due_on")||null}:{})}).eq("id",id);
 if(error)response(error.message,true);
 response("Control updated and audit event recorded");
}
export async function saveRisk(f:FormData){
 const db=await manager(),id=field(f,"id"),status=field(f,"status"),owner=field(f,"owner_name");
 if(!/^[\da-f-]{36}$/i.test(id)||!["open","in_progress","awaiting_approval","closed"].includes(status)||owner.length>120)response("Invalid risk data",true);
 const rating=(key:string)=>field(f,key)?Number(field(f,key)):null;
 const nums=["likelihood","impact","residual_likelihood","residual_impact"].map(rating);
 if(nums.some(v=>v!==null&&(!Number.isInteger(v)||v<1||v>5)))response("Ratings must be between 1 and 5",true);
 const assessment=f.has("likelihood")?{likelihood:nums[0],impact:nums[1],residual_likelihood:nums[2],residual_impact:nums[3],review_due:field(f,"review_due")||null,review_note:field(f,"review_note").slice(0,2000)}:{};
 const {error}=await db.from("repair_cafe_risks").update({status,owner_name:owner||"Unassigned",...assessment}).eq("id",id);
 if(error)response(error.message,true);
 response(status==="closed"?"Risk closed with validated controls":"Risk saved and audit event recorded");
}

export async function addInsurance(f:FormData){
 const db=await manager();
 const policy_type=field(f,"policy_type"),provider=field(f,"provider"),insured_entity=field(f,"insured_entity");
 if(policy_type.length<3||policy_type.length>120||provider.length>180||insured_entity.length>180)response("Check insurance details",true);
 const {error}=await db.from("repair_cafe_insurance_policies").insert({policy_type,provider,insured_entity,policy_reference:field(f,"policy_reference").slice(0,180),expiry_on:field(f,"expiry_on")||null,coverage_note:field(f,"coverage_note").slice(0,1500),evidence_reference:field(f,"evidence_reference").slice(0,500),status:"unconfirmed"});
 if(error)response(error.message,true);response("Insurance entry saved as unconfirmed");
}
export async function addRiskReview(f:FormData){
 const {context,supabase}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role??"")))redirect("/repair-cafe-volunteers");
 const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const risk_id=field(f,"risk_id"),findings=field(f,"findings"),decision=field(f,"decision");
 if(!/^[0-9a-f-]{36}$/i.test(risk_id)||findings.length<10||findings.length>2000||!["keep_open","request_changes","recommend_approval"].includes(decision))response("Review requires a valid risk and at least ten characters",true);
 const {error}=await supabase.from("repair_cafe_risk_reviews").insert({risk_id,reviewer:user.id,findings,decision});
 if(error)response(error.message,true);response("Review recorded; this does not itself approve closure");
}

export async function saveInsuranceRenewal(f:FormData){
 const db=await manager(),id=field(f,"id"),owner=field(f,"renewal_owner"),action=field(f,"renewal_action"),review=field(f,"next_review_on");
 if(!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)||owner.length>120||action.length>1000||review&&!/^\d{4}-\d{2}-\d{2}$/.test(review))response("Invalid renewal information",true);
 const {error}=await db.from("repair_cafe_insurance_policies").update({renewal_owner:owner||"Unassigned",renewal_action:action,next_review_on:review||null,updated_at:new Date().toISOString()}).eq("id",id);
 if(error)response(error.message,true);response("Renewal tracking saved");
}
