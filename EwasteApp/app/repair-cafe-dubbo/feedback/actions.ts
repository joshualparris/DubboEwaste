"use server";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
const root="/repair-cafe-dubbo/feedback";
export async function submitFeedback(f:FormData){
 const event=String(f.get("event")??""),rating=Number(f.get("rating")),result=String(f.get("result")??"unspecified"),comment=String(f.get("comment")??"").trim();
 if(String(f.get("website")??""))redirect(root+"?thanks=1");
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(event)||!Number.isInteger(rating)||rating<1||rating>5||
 !["fixed","partial","not_fixed","not_attempted","unspecified"].includes(result)||comment.length>600)
  redirect(root+"?error=Please%20check%20your%20feedback");
 const db=await createClient();
 const {error}=await db.from("repair_cafe_visitor_feedback").insert({event_id:event,rating,repair_result:result,comment});
 if(error)redirect(root+"?error="+encodeURIComponent("Unable to save feedback: "+error.message));
 redirect(root+"?thanks=1");
}
