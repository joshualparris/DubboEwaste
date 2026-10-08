"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCourse } from "@/lib/learning/catalog";
import { mediaItems } from "@/lib/learning/media";

async function currentLearner() {
 const db=await createClient();
 const {data:{user}}=await db.auth.getUser();
 if(!user) redirect("/login");
 const [{data:profile},{data:programs}]=await Promise.all([
  db.from("profiles").select("active").eq("id",user.id).maybeSingle(),
  db.from("program_access").select("program,active").eq("user_id",user.id).eq("active",true),
 ]);
 if(!profile?.active || !programs?.length) redirect("/login?error=Account%20not%20active");
 return {db,user,programs};
}
export async function finishMedia(form:FormData) {
 const resource=mediaItems.find(x=>x.id===String(form.get("media")??""));
 if(!resource) redirect("/learn");
 const {db,user}=await currentLearner();
 const {data:enrol}=await db.from("learning_enrolments").select("course_slug").eq("user_id",user.id).eq("course_slug",resource.course).maybeSingle();
 if(!enrol) redirect("/learn/"+resource.course+"?error=Enrol%20first");
 if(form.get("reflection_ack")!=="yes") redirect("/learn/"+resource.course+"?error=Please%20consider%20the%20reflection%20first");
 const {error}=await db.from("learning_media_progress").upsert(
  {user_id:user.id,course_slug:resource.course,resource_slug:resource.id},
  {onConflict:"user_id,course_slug,resource_slug",ignoreDuplicates:true}
 );
 if(error) redirect("/learn/"+resource.course+"?error=Unable%20to%20save%20media%20progress");
 revalidatePath("/learn/"+resource.course);
 redirect("/learn/"+resource.course+"?message=media");
}
export async function submitPractical(form:FormData) {
 const course=getCourse(String(form.get("course")??""));
 if(!course) redirect("/learn");
 const path="/learn/"+course.id;
 const reflection=String(form.get("reflection")??"").trim();
 if(reflection.length<30 || reflection.length>3000) redirect(path+"?error=Please%20write%2030%20to%203000%20characters");
 const {db,user,programs}=await currentLearner();
 const own=new Set(programs.map(p=>p.program));
 const programme=String(form.get("programme")??"");
 if(!["repair_cafe","dubbo_ewaste","library_of_things"].includes(programme) || !own.has(programme)) redirect(path+"?error=Invalid%20programme");
 if(course.programme!=="all" && course.programme!==programme) redirect(path+"?error=Incorrect%20programme");
 const [{data:enrol},{data:lessons}]=await Promise.all([
  db.from("learning_enrolments").select("course_slug").eq("user_id",user.id).eq("course_slug",course.id).maybeSingle(),
  db.from("learning_progress").select("lesson_slug").eq("user_id",user.id).eq("course_slug",course.id)
 ]);
 if(!enrol || !course.lessons.every(l=>lessons?.some(x=>x.lesson_slug===l.id))) redirect(path+"?error=Finish%20the%20lessons%20first");
 const {error}=await db.from("learning_practical_submissions").insert({
  user_id:user.id,course_slug:course.id,programme,reflection,status:"submitted"
 });
 if(error) redirect(path+"?error=Unable%20to%20submit%20assessment");
 revalidatePath(path);
 revalidatePath("/learn/manage");
 redirect(path+"?message=submitted");
}
