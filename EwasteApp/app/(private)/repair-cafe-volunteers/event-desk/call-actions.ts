"use server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireProgrammeContext} from "@/lib/programme-context";
const root="/repair-cafe-volunteers/event-desk";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function callNextVisitor(f:FormData){
 const ticket=String(f.get("ticket_id")??""),station=String(f.get("station_id")??""),event=String(f.get("event_id")??"");
 const q=event&&uuid.test(event)?"?event="+encodeURIComponent(event)+"&":"?";
 if(!uuid.test(ticket)||!uuid.test(station))redirect(root+q+"error=Choose%20a%20station");
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&context.selected!=="repair_cafe")redirect("/programmes");
 const {error}=await supabase.rpc("repair_cafe_call_visitor",{p_ticket_id:ticket,p_station_id:station});
 if(error)redirect(root+q+"error="+encodeURIComponent(error.message));
 revalidatePath(root);
 redirect(root+q+"success=Visitor%20called.%20Confirm%20they%20have%20reached%20the%20station%20before%20starting%20the%20repair.");
}
