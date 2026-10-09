"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProgrammeContext } from "@/lib/programme-context";

const root="/repair-cafe-volunteers/sessions";
const idPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const datePattern=/^\d{4}-\d{2}-\d{2}$/;
const timePattern=/^(?:[01]\d|2[0-3]):[0-5]\d$/;
const value=(f:FormData,k:string)=>String(f.get(k)??"").trim();
function fail(message:string):never { redirect(root+"?error="+encodeURIComponent(message)); }
function done(message:string):never {
 revalidatePath(root);
 revalidatePath("/repair-cafe-volunteers");
 revalidatePath("/repair-cafe-dubbo");
 redirect(root+"?success="+encodeURIComponent(message));
}
async function actor(manager=false) {
 const result=await requireProgrammeContext();
 const context=result.context;
 if (!context.global_admin && context.selected!=="repair_cafe") fail("Switch to the Repair Café programme first.");
 if (manager && !context.global_admin && !["admin","manager"].includes(context.role||"")) fail("Only Repair Café coordinators can make that change.");
 const {data:{user}}=await result.supabase.auth.getUser();
 if(!user) redirect("/login");
 return {...result,user};
}
function validDate(s:string){return datePattern.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;}
function validId(s:string){return idPattern.test(s);}
function errMessage(error:{message:string}|null,message:string){if(error)fail(message+": "+error.message);}

export async function createVenue(form:FormData) {
 const {supabase}=await actor(true);
 const name=value(form,"name"), address=value(form,"address"), accessibility=value(form,"accessibility"), permitted=value(form,"permitted_activities");
 if(name.length<2||name.length>120||address.length>250||accessibility.length>500||permitted.length>600)fail("Check the venue details.");
 const {error}=await supabase.from("repair_cafe_venues").insert({name,address,accessibility,permitted_activities:permitted});
 errMessage(error,"Could not add venue");done("Venue added. A venue record is not a confirmed booking.");
}
export async function updateVenue(form:FormData) {
 const {supabase}=await actor(true);
 const id=value(form,"venue_id"),name=value(form,"name"),address=value(form,"address"),accessibility=value(form,"accessibility"),permitted=value(form,"permitted_activities");
 if(!validId(id)||name.length<2||name.length>120||address.length>250||accessibility.length>500||permitted.length>600)fail("Check the venue details.");
 const {error}=await supabase.from("repair_cafe_venues").update({name,address,accessibility,permitted_activities:permitted}).eq("id",id);
 errMessage(error,"Could not update venue");done("Venue details updated.");
}
export async function createSession(form:FormData) {
 const {supabase}=await actor(true);
 const event_date=value(form,"event_date"),title=value(form,"title"),starts_at=value(form,"starts_at"),ends_at=value(form,"ends_at"),focus=value(form,"focus");
 if(!validDate(event_date)||!timePattern.test(starts_at)||!timePattern.test(ends_at)||ends_at<=starts_at||title.length<3||title.length>150||focus.length>350)fail("Check the date, time, name and repair focus.");
 const {error}=await supabase.from("repair_cafe_sessions").insert({event_date,title,starts_at,ends_at,focus});
 errMessage(error,"Could not create session");done("Planning session created. It has not been announced publicly.");
}
export async function createMonthlyDrafts(form:FormData) {
 const {supabase}=await actor(true);
 const year=Number(value(form,"year"));
 if(!Number.isInteger(year)||year<2026||year>2035)fail("Choose a year from 2026 to 2035.");
 const rows=Array.from({length:12},(_,i)=>{
  const first=new Date(Date.UTC(year,i,1)).getUTCDay();
  const day=1+(6-first+7)%7+14;
  return {event_date:year+"-"+String(i+1).padStart(2,"0")+"-"+String(day).padStart(2,"0"),title:"Repair Café Dubbo"};
 });
 const {error}=await supabase.from("repair_cafe_sessions").upsert(rows,{onConflict:"event_date",ignoreDuplicates:true});
 errMessage(error,"Could not create monthly drafts");done("Monthly planning drafts added (existing events were left unchanged). No dates were published.");
}
export async function updateSession(form:FormData) {
 const {supabase}=await actor(true);
 const id=value(form,"event_id"),event_date=value(form,"event_date"),title=value(form,"title"),starts_at=value(form,"starts_at"),ends_at=value(form,"ends_at"),focus=value(form,"focus");
 if(!validId(id)||!validDate(event_date)||!timePattern.test(starts_at)||!timePattern.test(ends_at)||ends_at<=starts_at||title.length<3||title.length>150||focus.length>350)fail("Check the session details.");
 const {data:old,error:readError}=await supabase.from("repair_cafe_sessions").select("status,event_date,starts_at,ends_at,title,focus").eq("id",id).single();
 if(readError||!old)fail("Session not found.");
 const changed=event_date!==old.event_date||starts_at!==old.starts_at?.slice(0,5)||
  ends_at!==old.ends_at?.slice(0,5)||title!==old.title||focus!==old.focus;
 if(old.status==="published"&&changed&&value(form,"acknowledge_public_change")!=="yes")
  fail("Tick the acknowledgement before editing a published event. It will be unpublished and people must be notified.");
 const changes={event_date,title,starts_at,ends_at,focus,
  status:old.status==="published"&&changed?"draft":old.status,updated_at:new Date().toISOString()};
 const {error}=await supabase.from("repair_cafe_sessions").update(changes).eq("id",id);
 errMessage(error,"Could not save session");done(old.status==="published"&&changed?"Session changed and unpublished. Notify affected people before re-publishing.":"Session details saved.");
}
export async function setVenueForSession(form:FormData) {
 const {supabase}=await actor(true);
 const id=value(form,"event_id"),venue_id=value(form,"venue_id"),venue_status=value(form,"venue_status");
 if(!validId(id)||!(venue_id===""||validId(venue_id))||!["unknown","offered","tentative","confirmed","declined"].includes(venue_status))fail("Choose a valid venue and booking stage.");
 if(venue_status==="confirmed"&&(!venue_id||value(form,"written_confirmation")!=="yes"))fail("A venue can be marked confirmed only after the host confirms the date and permitted activity in writing.");
 const {data:old}=await supabase.from("repair_cafe_sessions").select("status").eq("id",id).single();
 if(!old)fail("Session not found.");
 const changes={venue_id:venue_id||null,venue_status:venue_id?venue_status:"unknown",safety_checked:false,
  status:old.status==="published"?"draft":old.status,updated_at:new Date().toISOString()};
 const {error}=await supabase.from("repair_cafe_sessions").update(changes).eq("id",id);
 errMessage(error,"Could not update venue");done("Venue stage saved. Safety readiness was reset; a new confirmation check is required.");
}
export async function setSessionStatus(form:FormData) {
 const {supabase}=await actor(true);
 const id=value(form,"event_id"),status=value(form,"status");
 if(!validId(id)||!["draft","collecting","published","completed","cancelled"].includes(status))fail("Choose a valid session status.");
 const {data:e,error:readError}=await supabase.from("repair_cafe_sessions").select("venue_id,venue_status,safety_checked,focus,status,event_date").eq("id",id).single();
 if(readError||!e)fail("Session not found.");
 if(status==="published"){
  if(!e.venue_id||e.venue_status!=="confirmed"||!e.safety_checked||!e.focus.trim())fail("Before publishing, confirm the venue, safety readiness and repair scope.");
  const {data:slots,error:slotsError}=await supabase.from("repair_cafe_shift_slots").select("id,role_name,required_count").eq("event_id",id);
  if(slotsError||!slots?.length)fail("Create the required volunteer positions before publishing.");
  const {data:assignments,error:assignError}=await supabase.from("repair_cafe_shift_assignments").select("slot_id,status").in("slot_id",slots.map(s=>s.id));
  if(assignError)fail("Cannot verify the roster right now.");
  const missing=slots.filter(s=>(assignments||[]).filter(a=>a.slot_id===s.id&&a.status==="confirmed").length<s.required_count);
  if(missing.length)fail("Fill and confirm all required volunteer positions before publishing: "+missing.map(s=>s.role_name).join(", "));
 }
 const {error}=await supabase.from("repair_cafe_sessions").update({status}).eq("id",id);
 errMessage(error,"Could not change session status");
 done(status==="published"?"Session published on the public Repair Café page.":"Session status saved. If it was public, manually notify affected people of changes.");
}
export async function setSafetyChecked(form:FormData) {
 const {supabase}=await actor(true);
 const id=value(form,"event_id");
 if(!validId(id))fail("Invalid event.");
 const {data:e}=await supabase.from("repair_cafe_sessions").select("venue_status,status").eq("id",id).single();
 if(!e||e.venue_status!=="confirmed")fail("Confirm the venue before approving readiness.");
 const {error}=await supabase.from("repair_cafe_sessions").update({safety_checked:value(form,"safety_checked")==="yes",updated_at:new Date().toISOString()}).eq("id",id);
 errMessage(error,"Could not update readiness");done("Safety readiness recorded by the coordinator.");
}
export async function saveSkills(form:FormData) {
 const {supabase,user}=await actor();
 const skills=value(form,"skills").split(",").map(s=>s.trim()).filter(Boolean).slice(0,20);
 const preference=value(form,"preference");
 if(skills.some(s=>s.length>60)||preference.length>240)fail("Shorten skills or preferences.");
 const {error}=await supabase.from("repair_cafe_volunteer_profiles").upsert({user_id:user.id,skills,preference,updated_at:new Date().toISOString()},{onConflict:"user_id"});
 errMessage(error,"Could not save skills");done("Your volunteer profile was saved. Skills are self-declared, not a safety qualification.");
}
export async function setAvailability(form:FormData) {
 const {supabase,user}=await actor();
 const event_id=value(form,"event_id"),response=value(form,"response"),note=value(form,"note");
 if(!validId(event_id)||!["available","maybe","unavailable"].includes(response)||note.length>250)fail("Check your availability.");
 const {data:e}=await supabase.from("repair_cafe_sessions").select("status,event_date").eq("id",event_id).single();
 if(!e||["completed","cancelled"].includes(e.status))fail("This session is closed.");
 const {error}=await supabase.from("repair_cafe_availability").upsert({event_id,user_id:user.id,response,note,updated_at:new Date().toISOString()},{onConflict:"event_id,user_id"});
 errMessage(error,"Could not save availability");done("Availability saved. This does not confirm a shift.");
}
export async function createSlot(form:FormData) {
 const {supabase}=await actor(true);
 const event_id=value(form,"event_id"),role_name=value(form,"role_name"),notes=value(form,"notes"),required_count=Number(value(form,"required_count")),starts_at=value(form,"starts_at"),ends_at=value(form,"ends_at"),required_competency=value(form,"required_competency");
 if(!validId(event_id)||role_name.length<2||role_name.length>80||notes.length>250||!Number.isInteger(required_count)||required_count<1||required_count>20||!timePattern.test(starts_at)||!timePattern.test(ends_at)||ends_at<=starts_at||required_competency.length>120)fail("Check shift position, start, finish and competency.");
 const {error}=await supabase.from("repair_cafe_shift_slots").insert({event_id,role_name,required_count,notes,starts_at,ends_at,required_competency:required_competency||null});
 errMessage(error,"Could not add position");done("Volunteer position created.");
}
export async function offerShift(form:FormData) {
 const {supabase}=await actor(true);
 const slot_id=value(form,"slot_id"),user_id=value(form,"user_id");
 if(!validId(slot_id)||!validId(user_id))fail("Choose a volunteer and position.");
 const {data:slot}=await supabase.from("repair_cafe_shift_slots").select("event_id").eq("id",slot_id).single();
 if(!slot)fail("Unknown position.");
 const {data:availability}=await supabase.from("repair_cafe_availability").select("response").eq("event_id",slot.event_id).eq("user_id",user_id).maybeSingle();
 if(!availability||availability.response==="unavailable")fail("This volunteer has not nominated availability for this month.");
 const {error}=await supabase.from("repair_cafe_shift_assignments").insert({slot_id,user_id,status:"offered"});
 errMessage(error,"Could not offer shift");done("Shift offered. The volunteer must accept it before they count towards coverage.");
}
export async function respondShift(form:FormData) {
 const {supabase,user}=await actor();
 const id=value(form,"assignment_id"),status=value(form,"status");
 if(!validId(id)||!["confirmed","declined","withdrawn"].includes(status))fail("Invalid response.");
 const {data:a}=await supabase.from("repair_cafe_shift_assignments").select("user_id,status").eq("id",id).single();
 if(!a||a.user_id!==user.id)fail("This is not your shift offer.");
 if((a.status==="offered"&&!["confirmed","declined"].includes(status))||(a.status==="confirmed"&&status!=="withdrawn"))fail("This shift response is no longer available.");
 const {error}=await supabase.from("repair_cafe_shift_assignments").update({status}).eq("id",id);
 errMessage(error,"Could not update shift");done(status==="confirmed"?"Shift accepted and confirmed.":status==="withdrawn"?"You have withdrawn; the coordinator needs to refill this position.":"Shift declined.");
}
export async function removeShiftOffer(form:FormData) {
 const {supabase}=await actor(true);
 const id=value(form,"assignment_id");
 if(!validId(id))fail("Invalid assignment.");
 const {error}=await supabase.from("repair_cafe_shift_assignments").delete().eq("id",id);
 errMessage(error,"Could not remove assignment");done("Roster assignment removed.");
}
