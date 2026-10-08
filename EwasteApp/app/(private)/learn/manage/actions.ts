"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCourse } from "@/lib/learning/catalog";

async function coordinator() {
 const db=await createClient();
 const {data:{user}}=await db.auth.getUser();
 if(!user) redirect("/login");
 const [{data:profile},{data:memberships}]=await Promise.all([
  db.from("profiles").select("id,active,role").eq("id",user.id).maybeSingle(),
  db.from("program_access").select("program,programme_role,active").eq("user_id",user.id).eq("active",true)
 ]);
 if(!profile?.active) redirect("/learn");
 const global=profile.role==="admin";
 const programmes=new Set((memberships??[]).filter(x=>x.programme_role==="admin").map(x=>x.program));
 if(!global && !programmes.size) redirect("/learn");
 return {db,user,global,programmes};
}
function permitted(programme:string, actor:{global:boolean,programmes:Set<string>}) {
 return ["dubbo_ewaste","repair_cafe","library_of_things"].includes(programme)
  && (actor.global || actor.programmes.has(programme));
}
export async function assignCourse(form:FormData) {
 const course=getCourse(String(form.get("course")??""));
 const userId=String(form.get("learner")??"");
 const programme=String(form.get("programme")??"");
 const due=String(form.get("due")??"");
 const path="/learn/manage";
 const actor=await coordinator();
 if(!course || !permitted(programme,actor) || (course.programme!=="all" && course.programme!==programme) || !/^[0-9a-f-]{36}$/i.test(userId)) {
  redirect(path+"?error=Invalid%20assignment");
 }
 if(due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) redirect(path+"?error=Invalid%20date");
 const {data:membership}=await actor.db.from("program_access").select("user_id").eq("user_id",userId).eq("program",programme).eq("active",true).maybeSingle();
 if(!membership) redirect(path+"?error=Learner%20is%20not%20part%20of%20this%20programme");
 const {error}=await actor.db.from("learning_assignments").insert({user_id:userId,course_slug:course.id,programme,assigned_by:actor.user.id,due_date:due||null});
 if(error) redirect(path+"?error=Assignment%20may%20already%20exist");
 revalidatePath("/learn/manage");
 revalidatePath("/learn");
 redirect(path+"?message=assigned");
}
export async function reviewPractical(form:FormData) {
 const id=String(form.get("submission")??"");
 const decision=String(form.get("decision")??"");
 const feedback=String(form.get("feedback")??"").trim();
 const observed=form.get("observed")==="yes";
 const actor=await coordinator();
 const path="/learn/manage";
 if(!/^[0-9a-f-]{36}$/i.test(id)||!["approved","changes_requested"].includes(decision)||feedback.length<10||feedback.length>2000){
  redirect(path+"?error=Please%20include%20a%20decision%20and%20specific%20feedback");
 }
 if(decision==="approved"&&!observed) redirect(path+"?error=Approval%20requires%20direct%20observation");
 const {data:record}=await actor.db.from("learning_practical_submissions")
  .select("id,user_id,programme,status").eq("id",id).maybeSingle();
 if(!record||!permitted(record.programme,actor)||record.user_id===actor.user.id||record.status!=="submitted") redirect(path+"?error=Unable%20to%20review%20this%20submission");
 const {error}=await actor.db.from("learning_practical_submissions").update({
  status:decision,feedback,reviewer_id:actor.user.id,reviewed_at:new Date().toISOString(),directly_observed:observed
 }).eq("id",id).eq("status","submitted");
 if(error) redirect(path+"?error=Review%20could%20not%20be%20saved");
 revalidatePath(path);
 redirect(path+"?message=reviewed");
}
export async function rotateLibraryCode(previous:{code:string|null,error:string|null},_form:FormData):Promise<{code:string|null,error:string|null}> {
 const actor=await coordinator();
 if(!actor.global) return {code:null,error:"Only a global administrator can issue Library of Things codes."};
 const {data,error}=await actor.db.rpc("issue_library_signup_code");
 if(error||typeof data!=="string") return {code:null,error:error?.message??"Could not issue an access code."};
 return {code:data,error:null};
}
