"use server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireProgrammeContext} from "@/lib/programme-context";
const root="/repair-cafe-volunteers/preflight";
export const checks=[
 ["host","Legal host and responsible coordinator confirmed"],
 ["insurance","Insurance covers venue, activities, volunteers and visitor property"],
 ["venue","Written venue permission and accessible layout checked"],
 ["fire","Fire, exits, evacuation and first-aid equipment checked"],
 ["electrical","Electrical scope, RCDs and testing procedures approved"],
 ["battery","Lithium-battery isolation and disposal arrangements checked"],
 ["people","Safety lead, deputy and competent station leads present"],
 ["briefing","Volunteer safety briefing and stop-work authority communicated"],
 ["scope","Every offered repair category has approval and necessary safeguards"]
] as const;
async function manager(){const {supabase,context}=await requireProgrammeContext();if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))redirect("/repair-cafe-volunteers");const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");return {supabase,user};}
const goodId=(s:string)=>/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(s);
export async function savePreflight(f:FormData){
 const {supabase,user}=await manager();
 const event=String(f.get("event")||""),key=String(f.get("key")||""),result=String(f.get("result")||""),notes=String(f.get("notes")||"").trim();
 if(!goodId(event)||!checks.some(c=>c[0]===key)||!["unchecked","pass","fail","not_applicable"].includes(result)||notes.length>1500)redirect(root+"?error=Invalid%20inspection");
 const {data:session}=await supabase.from("repair_cafe_sessions").select("id").eq("id",event).is("deleted_at",null).maybeSingle();
 if(!session)redirect(root+"?error=Event%20not%20found");
 const label=checks.find(c=>c[0]===key)![1];
 const {error}=await supabase.from("repair_cafe_event_inspections").upsert({event_id:event,item_key:key,item_label:label,result,notes,inspected_by:user.id,inspected_at:new Date().toISOString(),updated_at:new Date().toISOString()},{onConflict:"event_id,item_key"});
 if(error)redirect(root+"?event="+event+"&error="+encodeURIComponent(error.message));
 revalidatePath(root);redirect(root+"?event="+event+"&notice=Inspection%20saved");
}
export async function recordHold(f:FormData){
 const {supabase,user}=await manager();const event=String(f.get("event")||""),reason=String(f.get("reason")||"").trim();
 if(!goodId(event)||reason.length<5||reason.length>1500)redirect(root+"?error=Enter%20a%20reason");
 const {data:session}=await supabase.from("repair_cafe_sessions").select("id").eq("id",event).is("deleted_at",null).maybeSingle();
 if(!session)redirect(root+"?error=Event%20not%20found");
 const {error}=await supabase.from("repair_cafe_event_go_nogo").upsert({event_id:event,decision:"hold",rationale:reason,decided_by:user.id,decided_at:new Date().toISOString(),updated_at:new Date().toISOString()},{onConflict:"event_id"});
 if(error)redirect(root+"?event="+event+"&error="+encodeURIComponent(error.message));
 revalidatePath(root);redirect(root+"?event="+event+"&notice=Safety%20hold%20recorded");
}
