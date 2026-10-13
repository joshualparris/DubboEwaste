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
 const {error}=await db.from("repair_cafe_risk_controls").update({status,owner_name:owner||"Unassigned",evidence_reference:evidence}).eq("id",id);
 if(error)response(error.message,true);
 response("Control updated and audit event recorded");
}
export async function saveRisk(f:FormData){
 const db=await manager(),id=field(f,"id"),status=field(f,"status"),owner=field(f,"owner_name");
 if(!/^[\da-f-]{36}$/i.test(id)||!["open","in_progress","awaiting_approval","closed"].includes(status)||owner.length>120)response("Invalid risk data",true);
 const {error}=await db.from("repair_cafe_risks").update({status,owner_name:owner||"Unassigned"}).eq("id",id);
 if(error)response(error.message,true);
 response(status==="closed"?"Risk closed with validated controls":"Risk saved and audit event recorded");
}
