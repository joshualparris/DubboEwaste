"use server";
import {createHash,randomUUID} from "node:crypto";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
import {parseEraseReport} from "@/lib/sanitisation-report-parser";
const home="/sanitisation-workbench";
const val=(f:FormData,key:string)=>String(f.get(key)??"").trim();
const uuid=(s:string)=>/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(s);
function finish(msg:string,error=false):never{revalidatePath(home);redirect(home+"?"+(error?"error":"notice")+"="+encodeURIComponent(msg));}
async function operator(){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="dubbo_ewaste"||!["admin","manager","technician"].includes(context.role??"")))redirect("/dashboard");
 const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 return {supabase,user,role:context.role};
}
export async function recordStoragePresence(f:FormData){
 const {supabase,user}=await operator(),asset_id=val(f,"asset_id"),presence=val(f,"presence"),notes=val(f,"notes");
 if(!uuid(asset_id)||!["NOT_INSPECTED","NO_MEDIA_AT_RECEIPT","MEDIA_PRESENT","REMOVED_AFTER_RECEIPT","UNRESOLVED"].includes(presence)||notes.length>1200)finish("Choose the asset and inspection result",true);
 const {data:asset}=await supabase.from("assets").select("id").eq("id",asset_id).eq("programme","dubbo_ewaste").maybeSingle();
 if(!asset)finish("DubboEwaste asset not found",true);
 const {error}=await supabase.from("asset_storage_assessments").upsert({asset_id,presence,notes,assessed_by:user.id,assessed_at:new Date().toISOString()},{onConflict:"asset_id"});
 if(error)finish(error.message,true);
 finish(presence==="NO_MEDIA_AT_RECEIPT"?"No drive on arrival recorded. This is NOT a sanitisation certificate.":"Storage inspection saved.");
}
export async function importSanitisationReport(f:FormData){
 const {supabase,user}=await operator(),media_id=val(f,"media_id");
 const file=f.get("report");
 if(!uuid(media_id)||!(file instanceof File)||file.size<10||file.size>2*1024*1024||!/\.(txt|log|csv)$/i.test(file.name))finish("Choose a medium and a text/log/CSV report under 2 MB",true);
 const {data:media}=await supabase.from("media").select("id,serial,media_code").eq("id",media_id).eq("programme","dubbo_ewaste").maybeSingle();
 if(!media)finish("Medium not found in the DubboEwaste programme",true);
 const bytes=Buffer.from(await file.arrayBuffer());
 if(bytes.includes(0))finish("Binary files are not parsed. Upload PDF evidence through Media and request manual verification.",true);
 const body=bytes.toString("utf-8");
 const parsed=parseEraseReport(body,media.serial??"",file.name);
 const sha256=createHash("sha256").update(bytes).digest("hex");
 const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_").slice(0,140);
 const key="media/"+media_id+"/"+randomUUID()+"-"+safeName;
 const {error:storageError}=await supabase.storage.from("evidence").upload(key,bytes,{contentType:"text/plain",upsert:false});
 if(storageError)finish("Could not upload raw report: "+storageError.message,true);
 const {data:evidence,error:evidenceError}=await supabase.from("evidence").insert({entity_type:"media",entity_id:media_id,evidence_type:"ATTACHMENT",filename:file.name.slice(0,300),mime_type:"text/plain",size_bytes:bytes.length,storage_key:key,sha256,source:"SANITISATION_REPORT_IMPORT",captured_by:user.id,metadata:{parser:parsed.format}}).select("id").single();
 if(evidenceError||!evidence){await supabase.storage.from("evidence").remove([key]);finish("Report evidence record failed: "+(evidenceError?.message||"Unknown error"),true);}
 const {error}=await supabase.from("sanitisation_report_imports").insert({media_id,evidence_id:evidence.id,report_sha256:sha256,source_tool:parsed.format==="NWIPE_LOG"?"nwipe/ShredOS (text detected)":"Externally supplied text",source_format:parsed.format,observed_serial:parsed.observed_serial,observed_result:parsed.observed_result,match_status:parsed.match_status,parser_version:"nwipe-text-v1",notes:parsed.note,submitted_by:user.id});
 if(error)finish("Raw evidence was retained, but review entry failed: "+error.message,true);
 finish("Report imported. Parser: "+parsed.match_status+" / "+parsed.observed_result+". Independent reviewer approval is required.");
}
export async function reviewSanitisationReport(f:FormData){
 const {supabase,user,role}=await operator();
 if(!["admin","manager"].includes(role??""))finish("Independent review requires manager access",true);
 const id=val(f,"id"),status=val(f,"status"),reason=val(f,"reason");
 if(!uuid(id)||!["APPROVED","REJECTED"].includes(status)||reason.length<10||reason.length>1500)finish("Select review decision and explain it in at least ten characters",true);
 const {data,error}=await supabase.from("sanitisation_report_imports").update({status,reviewed_by:user.id,review_reason:reason}).eq("id",id).eq("status","PENDING").select("id").single();
 if(error||!data)finish(error?.message||"No pending review found",true);
 finish("Review decision recorded. This alone does not mark the drive erased.");
}
