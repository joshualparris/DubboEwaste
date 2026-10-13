"use server";
import {randomUUID} from "crypto";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireProgrammeContext} from "@/lib/programme-context";
const home="/repair-cafe-volunteers/compliance/evidence";
const val=(f:FormData,k:string)=>String(f.get(k)??"").trim();
const uuid=(s:string)=>/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(s);
async function manager(){const {context,supabase}=await requireProgrammeContext();if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))redirect("/repair-cafe-volunteers");const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");return {supabase,user};}
function finish(msg:string,error=false):never{revalidatePath(home);redirect(home+"?"+(error?"error":"notice")+"="+encodeURIComponent(msg));}
export async function submitEvidence(f:FormData){
 const {supabase,user}=await manager();
 const kind=val(f,"kind"),title=val(f,"title"),reference=val(f,"reference"),risk_id=val(f,"risk_id"),control_id=val(f,"control_id");
 if(!["insurance","host_agreement","role_acceptance","competency","other"].includes(kind)||title.length<4||title.length>180||reference.length>800||(!uuid(risk_id)&&!uuid(control_id)))finish("Check document details and select a risk or control",true);
 const upload=f.get("document");
 let storage_path:string|null=null;
 if(upload instanceof File && upload.size>0){
  const allowed=["application/pdf","image/jpeg","image/png","image/webp"];
  if(upload.size>10*1024*1024||!allowed.includes(upload.type))finish("Only PDF/JPEG/PNG/WebP files up to 10 MB are allowed",true);
  const ext=upload.type==="application/pdf"?"pdf":upload.type==="image/jpeg"?"jpg":upload.type==="image/png"?"png":"webp";
  storage_path=user.id+"/"+randomUUID()+"."+ext;
  const {error:uploadError}=await supabase.storage.from("repair-cafe-compliance").upload(storage_path,upload,{contentType:upload.type,upsert:false});
  if(uploadError)finish("Private upload failed: "+uploadError.message,true);
 }
 const {error}=await supabase.from("repair_cafe_compliance_evidence").insert({kind,title,reference,storage_path,risk_id:uuid(risk_id)?risk_id:null,control_id:uuid(control_id)?control_id:null,expires_on:val(f,"expires_on")||null,coverage_note:val(f,"coverage_note").slice(0,1200),submitted_by:user.id,status:"submitted"});
 if(error){if(storage_path)await supabase.storage.from("repair-cafe-compliance").remove([storage_path]);finish(error.message,true)}finish("Evidence submitted for independent review; any attachment is private.");
}
export async function reviewEvidence(f:FormData){
 const {supabase,user}=await manager(),id=val(f,"id"),status=val(f,"status"),reason=val(f,"reason");
 if(!uuid(id)||!["approved","rejected"].includes(status)||reason.length<10||reason.length>1200)finish("Valid decision and a detailed reason required",true);
 const {error}=await supabase.from("repair_cafe_compliance_evidence").update({status,review_reason:reason,reviewed_by:user.id}).eq("id",id).eq("status","submitted");
 if(error)finish(error.message,true);finish("Independent review decision recorded.");
}
