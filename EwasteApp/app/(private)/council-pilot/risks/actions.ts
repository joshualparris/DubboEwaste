"use server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {z} from "zod";
import {requireProgrammeContext} from "@/lib/programme-context";

const uuid=z.string().uuid();
const opt=z.union([uuid,z.literal("")]).transform(v=>v||null);
const location="/council-pilot/risks";
const categories=[
  "SAFETY","FIRE_BATTERY","DATA_PRIVACY","CUSTODY","ELECTRICAL","TRANSPORT",
  "ENVIRONMENT","GOVERNANCE","INSURANCE","BUSINESS_CONTINUITY","FRAUD","PROJECT_DELIVERY","OTHER"
] as const;
const stopCategories=[
 ["SAFETY","Unsafe work area or untrained volunteer", "Hazardous work carried out without approved safe-work instructions"],
 ["FIRE_BATTERY","Damaged lithium battery or thermal runaway", "Swollen or shorted lithium battery may ignite during transport or storage"],
 ["DATA_PRIVACY","Confidential data disclosed or inadequately sanitised", "Data-bearing storage leaves secure custody or sanitisation verification fails"],
 ["CUSTODY","Lost, incorrectly identified or unaccounted device", "Equipment changes custody without correct serial, signed authority or reconciliation"],
 ["ELECTRICAL","Unsafe power supply or mains electrical incident", "Faulty device, charger or unqualified electrical work causes shock or injury"],
 ["TRANSPORT","Vehicle, manual handling or waste transport incident", "Equipment is moved without secure loading, competent handlers or transport precautions"],
 ["ENVIRONMENT","Pollution or inappropriate battery/e-waste disposal", "Hazardous material enters unsuitable waste or downstream route without evidence"],
 ["GOVERNANCE","Activity without written Council approval", "Collection takes place outside signed site, delegation, title or agreement period"],
 ["INSURANCE","Uninsured or excluded activity or custody", "Public liability, care/custody/control, site or transport loss not covered by verified insurance"],
 ["BUSINESS_CONTINUITY","Storage failure, fire, breach or loss of records", "Operational disruption prevents secure custody, incident response or evidence retrieval"],
 ["FRAUD","False certificate, inventory or donation record", "Unauthorised alteration or fabrication of evidence creates legal and reputational exposure"],
 ["PROJECT_DELIVERY","Donations delayed or devices unsuitable", "Project schedule, resource capacity or unexpected costs prevent intended outcomes"]
] as const;

function done(batch:string,message:string,error=false):never{
 revalidatePath(location);revalidatePath("/council-pilot");
 redirect(location+"?"+new URLSearchParams({batch,[error?"error":"notice"]:message}));
}
async function actor(){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin && (context.selected!=="dubbo_ewaste" || !["admin","manager"].includes(context.role||""))){
   redirect("/programmes?error=Council%20risk%20register%20requires%20an%20E-waste%20supervisor");
 }
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) redirect("/login");
 return {supabase,user};
}
function parseBatch(fd:FormData){
 const v=uuid.safeParse(fd.get("batch_id"));
 if(!v.success) redirect("/council-pilot");
 return v.data;
}
function date(str:FormDataEntryValue|null){
 const v=z.iso.date().safeParse(str);
 return v.success?v.data:null;
}
export async function initialiseCouncilRisks(fd:FormData){
 const batch=parseBatch(fd);const {supabase,user}=await actor();
 const {data:current,error:readError}=await supabase.from("council_risks").select("reference").eq("batch_id",batch);
 if(readError)done(batch,readError.message,true);
 const known=new Set((current||[]).map(x=>x.reference));
 const newRows=stopCategories.map(([category,hazard,consequence],index)=>({
  batch_id:batch,reference:"PILOT-R"+String(index+1).padStart(2,"0"),category,
  classification:category==="PROJECT_DELIVERY"?"PROJECT":"OPERATIONAL",
  hazard,cause:"Not assessed",consequence,
  affected_people:"To assess with volunteers, Council and affected parties",
  legal_or_policy_basis:"To verify against Council's June 2026 risk policy, project framework and applicable NSW WHS codes",
  created_by:user.id,status:"OPEN",
 })).filter(x=>!known.has(x.reference));
 if(!newRows.length)done(batch,"Starter prompts already exist. Complete each assessment and verify actual controls.");
 const {error}=await supabase.from("council_risks").insert(newRows);
 if(error)done(batch,error.message,true);
 done(batch,"Created "+newRows.length+" unassessed risk prompts. No risk ratings or controls were invented.");
}
export async function addCouncilRisk(fd:FormData){
 const batch=parseBatch(fd);const {supabase,user}=await actor();
 const p=z.object({
  reference:z.string().trim().min(3).max(60),
  category:z.enum(categories),classification:z.enum(["PROJECT","OPERATIONAL","STRATEGIC"]),
  hazard:z.string().trim().min(10).max(1000),cause:z.string().trim().max(1500),
  consequence:z.string().trim().max(1500),affected_people:z.string().trim().max(1500),
  legal_or_policy_basis:z.string().trim().max(2000),owner_id:opt,
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)done(batch,"Please complete the risk reference, description and category",true);
 const {error}=await supabase.from("council_risks").insert({...p.data,batch_id:batch,created_by:user.id});
 if(error)done(batch,error.message,true);done(batch,"Unassessed risk added to register.");
}
export async function updateCouncilRisk(fd:FormData){
 const batch=parseBatch(fd);const {supabase}=await actor();
 const p=z.object({risk_id:uuid,owner_id:opt,
  cause:z.string().trim().max(1500),consequence:z.string().trim().max(1500),
  affected_people:z.string().trim().max(1500),legal_or_policy_basis:z.string().trim().max(2000),
  status:z.enum(["OPEN","MONITORING","CLOSED"]),
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)done(batch,"Invalid risk update",true);
 const {risk_id,...changes}=p.data;
 const {data,error}=await supabase.from("council_risks").update(changes).eq("id",risk_id).eq("batch_id",batch).select("id").maybeSingle();
 if(error||!data)done(batch,error?.message||"Risk not found",true);done(batch,"Risk ownership, classification context and monitoring status saved.");
}
export async function createRiskFramework(fd:FormData){
 const batch=parseBatch(fd);const {supabase,user}=await actor();
 const p=z.object({origin:z.enum(["UNCONFIRMED","COUNCIL_SUPPLIED","COUNCIL_ACCEPTED_OPERATOR"]),
   source_reference:z.string().trim().max(200),source_evidence_id:opt,
   likelihood_codes:z.string().trim().max(150),consequence_codes:z.string().trim().max(150),
   notes:z.string().trim().max(2000),
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)done(batch,"Invalid framework fields",true);
 const likelihood=p.data.likelihood_codes.split(",").map(x=>x.trim()).filter(Boolean);
 const consequence=p.data.consequence_codes.split(",").map(x=>x.trim()).filter(Boolean);
 if(likelihood.length<2||likelihood.length>7||consequence.length<2||consequence.length>7
  ||new Set(likelihood).size!==likelihood.length||new Set(consequence).size!==consequence.length
  ||[...likelihood,...consequence].some(x=>x.length>40))done(batch,"Enter 2–7 unique codes for each scale from the actual approved risk methodology",true);
 const {data:old,error:oldError}=await supabase.from("council_risk_frameworks").select("version").eq("batch_id",batch).order("version",{ascending:false}).limit(1);
 if(oldError)done(batch,oldError.message,true);
 const {error}=await supabase.from("council_risk_frameworks").insert({
   batch_id:batch,version:(old?.[0]?.version||0)+1,status:"DRAFT",
   origin:p.data.origin,source_reference:p.data.source_reference,
   source_evidence_id:p.data.source_evidence_id,
   likelihood_codes:likelihood,consequence_codes:consequence,
   notes:p.data.notes,created_by:user.id
 });
 if(error)done(batch,error.message,true);
 done(batch,"Unverified risk matrix framework created. Enter every matrix cell, then seek independent source verification.");
}
export async function recordRiskMatrixCell(fd:FormData){
 const batch=parseBatch(fd);const {supabase}=await actor();
 const p=z.object({framework_id:uuid,likelihood_code:z.string().min(1).max(40),
  consequence_code:z.string().min(1).max(40),rating:z.enum(["LOW","MODERATE","HIGH","EXTREME"]),
  response_instruction:z.string().trim().max(500),
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)done(batch,"Select source matrix coordinates and rating",true);
 const {data:framework}=await supabase.from("council_risk_frameworks").select("id").eq("id",p.data.framework_id).eq("batch_id",batch).eq("status","DRAFT").maybeSingle();
 if(!framework)done(batch,"Select an editable framework belonging to this pilot",true);
 const {error}=await supabase.from("council_risk_matrix_cells").upsert(p.data,{onConflict:"framework_id,likelihood_code,consequence_code"});
 if(error)done(batch,error.message,true);done(batch,"Matrix cell recorded from supplied framework. No Council values were inferred.");
}
export async function verifyRiskFramework(fd:FormData){
 const batch=parseBatch(fd);const {supabase,user}=await actor();
 const p=uuid.safeParse(fd.get("framework_id"));if(!p.success)done(batch,"Invalid framework",true);
 const {data,error}=await supabase.from("council_risk_frameworks").update({status:"VERIFIED",verified_by:user.id})
  .eq("batch_id",batch).eq("id",p.data).eq("status","DRAFT").select("id").maybeSingle();
 if(error||!data)done(batch,error?.message||"Framework unavailable",true);
 done(batch,"Source methodology and complete matrix independently verified in AssetFlow. This is not Council endorsement unless supported by actual documents.");
}
export async function addRiskControl(fd:FormData){
 const batch=parseBatch(fd);const {supabase,user}=await actor();
 const p=z.object({risk_id:uuid,hierarchy:z.enum(["ELIMINATION","SUBSTITUTION","ISOLATION","ENGINEERING","ADMINISTRATIVE","PPE"]),
  description:z.string().trim().min(12).max(3000),owner_id:uuid,
  due_on:z.iso.date(),critical:z.enum(["yes","no"]),
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)done(batch,"Control needs hierarchy, description, owner and implementation date",true);
 const {data:risk}=await supabase.from("council_risks").select("id").eq("id",p.data.risk_id).eq("batch_id",batch).maybeSingle();
 if(!risk)done(batch,"Risk does not belong to pilot",true);
 const {critical,...other}=p.data;
 const {error}=await supabase.from("council_risk_controls").insert({...other,critical:critical==="yes",created_by:user.id,status:"PLANNED"});
 if(error)done(batch,error.message,true);done(batch,"Control created as PLANNED; it is not yet verified.");
}
export async function updateRiskControl(fd:FormData){
 const batch=parseBatch(fd);const {supabase,user}=await actor();
 const p=z.object({control_id:uuid,status:z.enum(["PLANNED","IMPLEMENTED","VERIFIED","FAILED"]),
   evidence_id:opt,next_review_on:z.iso.date().or(z.literal("")).transform(v=>v||null),
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)done(batch,"Invalid verification fields",true);
 const {data:control}=await supabase.from("council_risk_controls").select("id,risk_id").eq("id",p.data.control_id).maybeSingle();
 const {data:risk}=await supabase.from("council_risks").select("id").eq("id",control?.risk_id||"00000000-0000-0000-0000-000000000000").eq("batch_id",batch).maybeSingle();
 if(!risk)done(batch,"Control is not in selected batch",true);
 const {error}=await supabase.from("council_risk_controls").update({
   status:p.data.status,evidence_id:p.data.evidence_id,next_review_on:p.data.next_review_on,
   verified_by:p.data.status==="VERIFIED"?user.id:null,
 }).eq("id",p.data.control_id);
 if(error)done(batch,error.message,true);done(batch,"Control status saved. Approved assessments will be invalidated if controls fail or review is overdue.");
}
export async function createRiskAssessment(fd:FormData){
 const batch=parseBatch(fd);const {supabase,user}=await actor();
 const p=z.object({risk_id:uuid,framework_id:uuid,
   inherent_likelihood:z.string().min(1).max(40),inherent_consequence:z.string().min(1).max(40),
   residual_likelihood:z.string().min(1).max(40),residual_consequence:z.string().min(1).max(40),
   assessment_reasoning:z.string().trim().min(15).max(5000),
   treatment_plan:z.string().trim().min(15).max(5000),
   consultation_summary:z.string().trim().max(3000),
   review_due:z.iso.date(),evidence_id:opt,
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)done(batch,"Assessment requires source scores, reasoning, treatment plan and review date",true);
 const {data:risk}=await supabase.from("council_risks").select("id").eq("id",p.data.risk_id).eq("batch_id",batch).maybeSingle();
 const {data:fw}=await supabase.from("council_risk_frameworks").select("id").eq("id",p.data.framework_id).eq("batch_id",batch).maybeSingle();
 if(!risk||!fw)done(batch,"Risk and framework must belong to same Council pilot",true);
 const {data:old}=await supabase.from("council_risk_assessments").select("version").eq("risk_id",p.data.risk_id).order("version",{ascending:false}).limit(1);
 const {error}=await supabase.from("council_risk_assessments").insert({...p.data,version:(old?.[0]?.version||0)+1,created_by:user.id});
 if(error)done(batch,error.message,true);done(batch,"Provisional assessment saved. It is not accepted until independent review and verified controls.");
}
export async function approveRiskAssessment(fd:FormData){
 const batch=parseBatch(fd);const {supabase,user}=await actor();
 const p=uuid.safeParse(fd.get("assessment_id"));if(!p.success)done(batch,"Select a valid assessment",true);
 const {data:assessment}=await supabase.from("council_risk_assessments").select("id,risk_id").eq("id",p.data).eq("status","DRAFT").maybeSingle();
 const {data:risk}=await supabase.from("council_risks").select("id").eq("id",assessment?.risk_id||"00000000-0000-0000-0000-000000000000").eq("batch_id",batch).maybeSingle();
 if(!risk)done(batch,"Assessment does not belong to Council pilot",true);
 const {error}=await supabase.from("council_risk_assessments").update({status:"APPROVED",approved_by:user.id}).eq("id",p.data);
 if(error)done(batch,error.message,true);done(batch,"Independently accepted assessment. Set risk to MONITORING if controls remain current.");
}
export async function addRiskAction(fd:FormData){
 const batch=parseBatch(fd);const {supabase,user}=await actor();
 const p=z.object({risk_id:uuid,description:z.string().trim().min(12).max(2500),owner_id:uuid,due_on:z.iso.date()}).safeParse(Object.fromEntries(fd));
 if(!p.success)done(batch,"Corrective action needs description, accountable owner and due date",true);
 const {data:risk}=await supabase.from("council_risks").select("id").eq("id",p.data.risk_id).eq("batch_id",batch).maybeSingle();
 if(!risk)done(batch,"Risk mismatch",true);
 const {error}=await supabase.from("council_risk_actions").insert({...p.data,created_by:user.id});
 if(error)done(batch,error.message,true);done(batch,"Corrective action opened; activation remains blocked until independently verified.");
}
export async function updateRiskAction(fd:FormData){
 const batch=parseBatch(fd);const {supabase,user}=await actor();
 const p=z.object({action_id:uuid,status:z.enum(["OPEN","IN_PROGRESS","VERIFIED"]),closure_evidence_id:opt}).safeParse(Object.fromEntries(fd));
 if(!p.success)done(batch,"Invalid corrective action",true);
 const {data:act}=await supabase.from("council_risk_actions").select("risk_id").eq("id",p.data.action_id).maybeSingle();
 const {data:risk}=await supabase.from("council_risks").select("id").eq("id",act?.risk_id||"00000000-0000-0000-0000-000000000000").eq("batch_id",batch).maybeSingle();
 if(!risk)done(batch,"Action not linked to pilot",true);
 const {error}=await supabase.from("council_risk_actions").update({...p.data,verified_by:p.data.status==="VERIFIED"?user.id:null})
  .eq("id",p.data.action_id);
 if(error)done(batch,error.message,true);done(batch,"Corrective action updated.");
}
export async function reportCouncilRiskIncident(fd:FormData){
 const batch=parseBatch(fd);const {supabase,user}=await actor();
 const p=z.object({
  risk_id:opt,category:z.enum(["INJURY","NEAR_MISS","FIRE","BATTERY","ELECTRICAL","DATA_BREACH","LOST_DEVICE","THEFT","ENVIRONMENT","OTHER"]),
  severity:z.enum(["NEAR_MISS","MINOR","SERIOUS","CRITICAL"]),occurred_at:z.string().min(10).max(40),
  description:z.string().trim().min(15).max(4000),immediate_actions:z.string().trim().min(10).max(4000),
  notified_authorities:z.string().trim().max(1000),notification_reference:z.string().trim().max(1000),
  evidence_id:opt,
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)done(batch,"Enter incident type, severity, time, description and immediate actions",true);
 const timestamp=new Date(p.data.occurred_at);
 if(Number.isNaN(timestamp.valueOf())||timestamp>Date.now()+5*60*1000)done(batch,"Incident time is invalid or in the future",true);
 if(p.data.risk_id){
  const {data:risk}=await supabase.from("council_risks").select("id").eq("id",p.data.risk_id).eq("batch_id",batch).maybeSingle();
  if(!risk)done(batch,"Selected risk does not belong to this pilot",true);
 }
 const {error}=await supabase.from("council_risk_incidents").insert({
  ...p.data,batch_id:batch,occurred_at:timestamp.toISOString(),created_by:user.id,status:"OPEN"
 });
 if(error)done(batch,error.message,true);
 done(batch,"Incident recorded. SERIOUS/CRITICAL incidents automatically PAUSE an active pilot. Seek emergency help and meet legal notification duties separately.");
}
export async function closeCouncilRiskIncident(fd:FormData){
 const batch=parseBatch(fd);const {supabase,user}=await actor();
 const p=z.object({incident_id:uuid,evidence_id:uuid,
  closure_reason:z.string().trim().min(15).max(2500),
  notified_authorities:z.string().trim().max(1000),
  notification_reference:z.string().trim().max(1000),
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)done(batch,"A full incident closeout needs independent supervisor, explanation and hashed evidence",true);
 const {data,error}=await supabase.from("council_risk_incidents").update({
  status:"CLOSED",closed_by:user.id,closure_reason:p.data.closure_reason,
  evidence_id:p.data.evidence_id,notified_authorities:p.data.notified_authorities,
  notification_reference:p.data.notification_reference,
 }).eq("id",p.data.incident_id).eq("batch_id",batch).select("id").maybeSingle();
 if(error||!data)done(batch,error?.message||"Incident unavailable",true);
 done(batch,"Incident independently closed; PAUSED batch requires explicit fresh approval before operations resume.");
}
