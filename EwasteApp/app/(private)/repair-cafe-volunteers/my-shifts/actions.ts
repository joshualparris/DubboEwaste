"use server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireProgrammeContext} from "@/lib/programme-context";
const root="/repair-cafe-volunteers/my-shifts";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function changeWaitlist(form:FormData){
 const id=String(form.get("slot_id")??""),action=String(form.get("action")??"");
 if(!uuid.test(id)||!["join","leave"].includes(action))redirect(root+"?error=Invalid%20shift");
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&context.selected!=="repair_cafe")redirect("/programmes");
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/login");
 const {data:slot}=await supabase.from("repair_cafe_shift_slots").select("event_id").eq("id",id).single();
 if(!slot)redirect(root+"?error=Shift%20not%20found");
 if(action==="join"){
  const {data:e}=await supabase.from("repair_cafe_sessions").select("status").eq("id",slot.event_id).single();
  if(!e||["completed","cancelled"].includes(e.status))redirect(root+"?error=Event%20closed");
  const {data:a}=await supabase.from("repair_cafe_availability").select("response").eq("event_id",slot.event_id).eq("user_id",user.id).maybeSingle();
  if(!a||a.response==="unavailable")redirect(root+"?error=Please%20set%20your%20availability%20first");
 }
 const {error}=await supabase.from("repair_cafe_shift_waitlist").upsert({slot_id:id,user_id:user.id,state:action==="join"?"waiting":"withdrawn"},{onConflict:"slot_id,user_id"});
 if(error)redirect(root+"?error="+encodeURIComponent(error.message));
 revalidatePath(root);
 redirect(root+"?success="+encodeURIComponent(action==="join"?"You are on the waiting list. This is not a confirmed shift.":"You have left the waiting list."));
}
