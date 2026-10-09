"use server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireProgrammeContext} from "@/lib/programme-context";
const root="/repair-cafe-volunteers/knowledge";
const v=(f:FormData,k:string)=>String(f.get(k)??"").trim();
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function fail(m:string):never{redirect(root+"?error="+encodeURIComponent(m))}
async function manager(){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role??"")))fail("Coordinator permission required.");
 return supabase;
}
export async function saveKnowledge(form:FormData){
 const supabase=await manager(),id=v(form,"id"),title=v(form,"title");
 const ticketId=v(form,"ticket_id");\n if(ticketId&&!uuid.test(ticketId))fail("Invalid repair ticket");\n if(ticketId){const {data:ticket}=await supabase.from("repair_cafe_tickets").select("id,status").eq("id",ticketId).single();\n if(!ticket||!["completed","referred","not_attempted"].includes(ticket.status))fail("Only closed tickets may become lessons");}\n const entry={title,category:v(form,"category")||"other",manufacturer:v(form,"manufacturer"),
 model:v(form,"model"),symptoms:v(form,"symptoms"),diagnosis:v(form,"diagnosis"),
 solution:v(form,"solution"),outcome:v(form,"outcome")||"unverified",
 safety_notes:v(form,"safety_notes"),guide_url:v(form,"guide_url"),
 updated_at:new Date().toISOString()};
 if(title.length<3||title.length>160||entry.category.length>60||entry.manufacturer.length>100||entry.model.length>120||entry.symptoms.length>1500||entry.diagnosis.length>2000||entry.solution.length>4000||entry.safety_notes.length>1000||entry.guide_url.length>500||
 !["worked","partially_worked","did_not_work","unverified"].includes(entry.outcome)||
 (entry.guide_url&&!/^https:\/\//i.test(entry.guide_url)))fail("Check the knowledge entry and secure guide URL.");
 if(id&&!uuid.test(id))fail("Invalid entry ID.");
 const payload={...entry,...(!id&&ticketId?{ticket_id:ticketId,review_status:"draft"}:{})};\n const {error}=id?await supabase.from("repair_cafe_knowledge").update(entry).eq("id",id):await supabase.from("repair_cafe_knowledge").insert(payload);
 if(error)fail("Unable to save: "+error.message);
 revalidatePath(root);redirect(root+"?success="+encodeURIComponent("Knowledge entry saved."));
}
export async function deleteKnowledge(form:FormData){
 const supabase=await manager(),id=v(form,"id");
 if(!uuid.test(id)||v(form,"confirm")!=="DELETE")fail("Type DELETE to remove this entry.");
 const {error}=await supabase.from("repair_cafe_knowledge").delete().eq("id",id);
 if(error)fail("Unable to delete: "+error.message);
 revalidatePath(root);redirect(root+"?success="+encodeURIComponent("Entry deleted."));
}

export async function reviewLesson(form:FormData){
 const supabase=await manager();const id=v(form,"id");const decision=v(form,"decision");
 if(!uuid.test(id)||!["approved","rejected"].includes(decision))fail("Invalid review");
 if(v(form,"privacy_reviewed")!=="yes")fail("Review the entire lesson for personal data before approving or rejecting.");
 const {data:lesson,error:readError}=await supabase.from("repair_cafe_knowledge")
  .select("id,title,symptoms,diagnosis,solution,safety_notes,ticket_id").eq("id",id).single();
 if(readError||!lesson)fail("Lesson not found");
 const {error}=await supabase.from("repair_cafe_knowledge").update({review_status:decision,
  privacy_confirmed_at:new Date().toISOString()}).eq("id",id);
 if(error)fail("Review failed: "+error.message);
 revalidatePath(root);redirect(root+"?success="+encodeURIComponent("Lesson review saved."));
}
