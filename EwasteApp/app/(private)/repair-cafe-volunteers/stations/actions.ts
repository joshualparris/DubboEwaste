"use server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireProgrammeContext} from "@/lib/programme-context";
const root="/repair-cafe-volunteers/stations";
export async function saveStationDispatch(form:FormData){
 const id=String(form.get("station_id")??""),event=String(form.get("event")??""),
  capacity=Number(form.get("capacity")),lead=String(form.get("lead")??"").trim();
 const pattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
 const back=String(form.get("return_to")??"")==="event-desk"?"/repair-cafe-volunteers/event-desk":root;
 const query="?event="+encodeURIComponent(event)+"&";
 if(!pattern.test(id)||!pattern.test(event)||!Number.isInteger(capacity)||capacity<1||capacity>20||lead.length>100)
  redirect(back+query+"error=Invalid%20station%20settings");
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role??"")))redirect("/repair-cafe-volunteers");
 const {error}=await supabase.from("repair_cafe_stations").update({capacity,lead_name:lead}).eq("id",id).eq("event_id",event);
 if(error)redirect(back+query+"error="+encodeURIComponent(error.message));
 revalidatePath(root);revalidatePath("/repair-cafe-volunteers/event-desk");
 redirect(back+query+"success=Station%20updated");
}
