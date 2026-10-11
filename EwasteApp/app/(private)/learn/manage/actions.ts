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
const laptopCriteria=[
 "skill_consent","skill_diagnosis","skill_compatibility",
 "skill_safety","skill_verification","skill_handover"
] as const;

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
  .select("id,user_id,programme,course_slug,status").eq("id",id).maybeSingle();
 if(!record||!permitted(record.programme,actor)||record.user_id===actor.user.id||record.status!=="submitted"){
  redirect(path+"?error=Unable%20to%20review%20this%20submission");
 }
 const isLaptopCapstone=record.course_slug==="repair-laptop-refurb"&&decision==="approved";
 const rubric:Record<string,number>={};
 let observedOn:string|null=null;
 let observationMethod:string|null=null;
 let evidenceReference:string|null=null;
 const attested=form.get("assessor_attested")==="yes";
 if(isLaptopCapstone){
  for(const criterion of laptopCriteria){
   const raw=String(form.get(criterion)??"");
   if(!/^[0-3]$/.test(raw))redirect(path+"?error=All%20six%20practical%20skills%20must%20be%20scored");
   rubric[criterion]=Number(raw);
  }
  const sum=laptopCriteria.reduce((total,criterion)=>total+rubric[criterion],0);
  if(sum<15||rubric.skill_consent<2||rubric.skill_safety<2){
   redirect(path+"?error=Skill%20scores%20below%20the%20practical%20approval%20standard");
  }
  observedOn=String(form.get("observed_on")??"");
  observationMethod=String(form.get("observation_method")??"");
  evidenceReference=String(form.get("evidence_reference")??"").trim();
  const validDate=/^\d{4}-\d{2}-\d{2}$/.test(observedOn)
    && !Number.isNaN(Date.parse(observedOn+"T00:00:00Z"))
    && observedOn>= "2020-01-01";
  if(!validDate||!["in_person","live_remote"].includes(observationMethod)
   ||! /^[A-Za-z0-9][A-Za-z0-9._/-]{7,159}$/.test(evidenceReference)
   || !attested || feedback.length<30){
    redirect(path+"?error=Supply%20date%2C%20mode%2C%20redacted%20evidence%2C%20attestation%20and%20detailed%20feedback");
  }
 }
 const update:Record<string,unknown>={
  status:decision,
  feedback,
  reviewer_id:actor.user.id,
  reviewed_at:new Date().toISOString(),
  directly_observed:observed
 };
 if(isLaptopCapstone){
  Object.assign(update,rubric,{
   observed_on:observedOn,observation_method:observationMethod,
   evidence_reference:evidenceReference,assessor_attested:true
  });
 }
 const {data:saved,error}=await actor.db.from("learning_practical_submissions")
  .update(update).eq("id",id).eq("status","submitted").select("id").maybeSingle();
 if(error||!saved)redirect(path+"?error=Review%20could%20not%20be%20saved%3B%20check%20the%20assessment%20schema");
 revalidatePath(path);
 revalidatePath("/learn/"+record.course_slug);
 redirect(path+"?message=reviewed");
}

export async function rotateLibraryCode(previous:{code:string|null,error:string|null},_form:FormData):Promise<{code:string|null,error:string|null}> {
 const actor=await coordinator();
 if(!actor.global) return {code:null,error:"Only a global administrator can issue Library of Things codes."};
 const {data,error}=await actor.db.rpc("issue_library_signup_code");
 if(error||typeof data!=="string") return {code:null,error:error?.message??"Could not issue an access code."};
 return {code:data,error:null};
}
