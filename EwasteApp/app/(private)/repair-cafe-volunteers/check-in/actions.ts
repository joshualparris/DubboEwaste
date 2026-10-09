"use server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireProgrammeContext} from "@/lib/programme-context";
const root="/repair-cafe-volunteers/check-in";
export async function selfCheckAttendance(data:FormData){
 const id=String(data.get("event_id")??"");
 const action=String(data.get("action")??"");
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)||!["in","out"].includes(action))
  redirect(root+"?error=Invalid%20event%20or%20action");
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&context.selected!=="repair_cafe")redirect("/programmes?error=Select%20Repair%20Cafe");
 const {error}=await supabase.rpc("repair_cafe_self_attendance",{p_event_id:id,p_action:action});
 const suffix="event="+encodeURIComponent(id)+"&";
 if(error)redirect(root+"?"+suffix+"error="+encodeURIComponent(error.message));
 revalidatePath(root);
 revalidatePath("/repair-cafe-volunteers/operations");
 revalidatePath("/repair-cafe-volunteers/reports");
 redirect(root+"?"+suffix+"success="+encodeURIComponent(action==="in"?"Checked in. Thank you!":"Checked out. Your volunteer hours are recorded."));
}
