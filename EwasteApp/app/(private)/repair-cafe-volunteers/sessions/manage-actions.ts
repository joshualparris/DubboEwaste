"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProgrammeContext } from "@/lib/programme-context";

const root="/repair-cafe-volunteers/sessions";
const people="/repair-cafe-volunteers/people";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const value=(f:FormData,k:string)=>String(f.get(k)??"").trim();
function fail(reason:string,to=root):never{redirect(to+"?error="+encodeURIComponent(reason));}
function done(message:string,to=root):never{
 for(const path of [root,people,"/repair-cafe-volunteers","/repair-cafe-dubbo"])revalidatePath(path);
 redirect(to+"?success="+encodeURIComponent(message));
}
async function coordinator(){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin && (context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))
   fail("Repair Café manager or admin access required.");
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/login");
 return {supabase,user};
}
function checkId(id:string){if(!uuid.test(id))fail("Invalid record reference.");}
function assertResult(error:{message:string}|null,what:string){if(error)fail(what+": "+error.message);}
function skillsFrom(text:string){
 const items=[...new Set(text.split(",").map(x=>x.trim()).filter(Boolean))];
 if(items.length>20||items.some(x=>x.length>60))fail("Use up to 20 skills, 60 characters each.");
 return items;
}
function details(f:FormData) {
 const full_name=value(f,"full_name"),email=value(f,"email"),phone=value(f,"phone"),
 notes=value(f,"notes"),contact_consent=value(f,"contact_consent")==="yes",
 skills=skillsFrom(value(f,"skills"));
 if(full_name.length<2||full_name.length>120||email.length>254||phone.length>40||notes.length>500)
  fail("Check volunteer name, contact information and notes.");
 if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail("Enter a valid email address.");
 if((email||phone)&&!contact_consent)fail("Record the volunteer's permission before saving private contact details.");
 return {full_name,email,phone,notes,contact_consent,skills,updated_at:new Date().toISOString()};
}

// Quick add creates a non-login directory record. Optional event/shift lets
// coordinator add a person and roster them in one operation.
export async function createManualVolunteer(form:FormData){
 const {supabase}=await coordinator();
 const info=details(form);
 const event_id=value(form,"event_id"),slot_id=value(form,"slot_id");
 const confirmed=value(form,"confirmed_by_contact")==="yes";
 if(event_id)checkId(event_id);
 if(slot_id)checkId(slot_id);
 if(slot_id&&!event_id)fail("Select a session before choosing a position.");
 if(slot_id&&!confirmed)fail("Confirm that the volunteer personally agreed to the shift.");
 if(event_id && value(form,"confirmed_availability")!=="yes")
  fail("Only mark someone available after they agreed to that particular session.");
 if(event_id){
  const {data:event}=await supabase.from("repair_cafe_sessions").select("id,status").eq("id",event_id).single();
  if(!event||["completed","cancelled"].includes(event.status))fail("That session is closed or missing.");
 }
 if(slot_id){
  const {data:slot}=await supabase.from("repair_cafe_shift_slots").select("event_id").eq("id",slot_id).single();
  if(!slot||slot.event_id!==event_id)fail("That volunteer position belongs to a different session.");
 }
 const {data:person,error}=await supabase.from("repair_cafe_manual_volunteers").insert(info).select("id").single();
 assertResult(error,"Could not add volunteer");
 if(!person)fail("Volunteer was not saved.");
 if(event_id){
  const {error:availabilityError}=await supabase.from("repair_cafe_manual_availability")
   .insert({event_id,manual_volunteer_id:person.id,response:"available",note:"Recorded by coordinator after speaking to volunteer"});
  if(availabilityError){
   await supabase.from("repair_cafe_manual_volunteers").delete().eq("id",person.id);
   fail("Volunteer was not added to the event: "+availabilityError.message);
  }
  if(slot_id){
   const {error:assignmentError}=await supabase.from("repair_cafe_shift_assignments")
    .insert({slot_id,manual_volunteer_id:person.id,status:"confirmed"});
   if(assignmentError){
    await supabase.from("repair_cafe_manual_volunteers").delete().eq("id",person.id);
    fail("Could not confirm the position; no new volunteer was kept: "+assignmentError.message);
   }
  }
 }
 done(slot_id?"Volunteer added and directly confirmed for this session.":event_id?
  "Volunteer added and marked available for this session.":"Volunteer added to the manual directory.",
  value(form,"return_to")==="people"?people:root);
}

export async function updateManualVolunteer(form:FormData){
 const {supabase}=await coordinator();
 const id=value(form,"manual_volunteer_id");checkId(id);
 const {error}=await supabase.from("repair_cafe_manual_volunteers").update(details(form)).eq("id",id);
 assertResult(error,"Could not update volunteer");
 done("Volunteer details updated.",people);
}
export async function deleteManualVolunteer(form:FormData){
 const {supabase}=await coordinator();
 const id=value(form,"manual_volunteer_id");checkId(id);
 if(value(form,"confirm")!=="DELETE")fail("Type DELETE to remove this volunteer and their rosters.",people);
 const {error}=await supabase.from("repair_cafe_manual_volunteers").delete().eq("id",id);
 assertResult(error,"Could not delete volunteer");
 done("Manual volunteer removed, including their availability and shift records.",people);
}
export async function setManualAvailability(form:FormData){
 const {supabase}=await coordinator();
 const event_id=value(form,"event_id"),manual_volunteer_id=value(form,"manual_volunteer_id"),
 response=value(form,"response"),note=value(form,"note");
 checkId(event_id);checkId(manual_volunteer_id);
 if(!["available","maybe","unavailable"].includes(response)||note.length>250)fail("Invalid response or note.");
 const {data:event}=await supabase.from("repair_cafe_sessions").select("status").eq("id",event_id).single();
 if(!event||["cancelled","completed"].includes(event.status))fail("This session is closed.");
 if(response==="unavailable"){
  const {data:slotRows}=await supabase.from("repair_cafe_shift_slots").select("id").eq("event_id",event_id);
  if(slotRows?.length){
   const {data:confirmed}=await supabase.from("repair_cafe_shift_assignments").select("id")
    .in("slot_id",slotRows.map(s=>s.id)).eq("manual_volunteer_id",manual_volunteer_id).eq("status","confirmed").limit(1);
   if(confirmed?.length)fail("Remove this person's confirmed shift before marking them unavailable.");
  }
 }
 const {error}=await supabase.from("repair_cafe_manual_availability")
  .upsert({event_id,manual_volunteer_id,response,note,updated_at:new Date().toISOString()},{onConflict:"event_id,manual_volunteer_id"});
 assertResult(error,"Could not save manual availability");
 done("Availability recorded for the manual volunteer.");
}
export async function deleteAvailability(form:FormData){
 const {supabase}=await coordinator();
 const event_id=value(form,"event_id"),person_id=value(form,"person_id"),
 kind=value(form,"kind");
 checkId(event_id);checkId(person_id);
 if(!["manual","account"].includes(kind))fail("Invalid volunteer type.");
 const table=kind==="manual"?"repair_cafe_manual_availability":"repair_cafe_availability";
 const column=kind==="manual"?"manual_volunteer_id":"user_id";
 const {data:slots}=await supabase.from("repair_cafe_shift_slots").select("id").eq("event_id",event_id);
 if(slots?.length){
  const {data:rostered}=await supabase.from("repair_cafe_shift_assignments").select("id").in("slot_id",slots.map(s=>s.id))
   .eq(column==="manual_volunteer_id"?"manual_volunteer_id":"user_id",person_id)
   .in("status",["offered","confirmed"]).limit(1);
  if(rostered?.length)fail("Remove active shift offers before deleting this person's availability.");
 }
 const {error}=await supabase.from(table).delete().eq("event_id",event_id).eq(column,person_id);
 assertResult(error,"Could not delete availability");done("Availability entry deleted.");
}
export async function setAccountAvailability(form:FormData){
 const {supabase}=await coordinator();
 const event_id=value(form,"event_id"),user_id=value(form,"user_id"),response=value(form,"response");
 checkId(event_id);checkId(user_id);
 if(!["available","maybe","unavailable"].includes(response)||value(form,"note").length>250)
  fail("Check the availability response.");
 if(value(form,"confirmed_by_contact")!=="yes")fail("Only record someone's availability after checking with them.");
 const {data:membership}=await supabase.from("program_access").select("user_id")
  .eq("user_id",user_id).eq("program","repair_cafe").eq("active",true).maybeSingle();
 if(!membership)fail("This account is not an active Repair Café volunteer.");
 const {error}=await supabase.from("repair_cafe_availability")
  .upsert({event_id,user_id,response,note:value(form,"note"),updated_at:new Date().toISOString()},
    {onConflict:"event_id,user_id"});
 assertResult(error,"Could not save availability");done("Availability recorded after volunteer confirmation.");
}
export async function assignManualShift(form:FormData){
 const {supabase}=await coordinator();
 const slot_id=value(form,"slot_id"),manual_volunteer_id=value(form,"manual_volunteer_id");
 checkId(slot_id);checkId(manual_volunteer_id);
 if(value(form,"confirmed_by_contact")!=="yes")fail("Confirm the volunteer has personally agreed to this position.");
 const {data:slot}=await supabase.from("repair_cafe_shift_slots").select("event_id").eq("id",slot_id).single();
 if(!slot)fail("Position missing.");
 const {data:availability}=await supabase.from("repair_cafe_manual_availability").select("response")
  .eq("event_id",slot.event_id).eq("manual_volunteer_id",manual_volunteer_id).maybeSingle();
 if(availability?.response!=="available")fail("Mark this volunteer available for the event before assigning them.");
 const {error}=await supabase.from("repair_cafe_shift_assignments")
  .insert({slot_id,manual_volunteer_id,status:"confirmed"});
 assertResult(error,"Could not assign manual volunteer");
 done("Volunteer confirmed for this position.");
}
export async function changeAssignmentStatus(form:FormData){
 const {supabase}=await coordinator();
 const id=value(form,"assignment_id"),status=value(form,"status");checkId(id);
 if(!["offered","confirmed","declined","withdrawn"].includes(status))fail("Invalid position status.");
 if(status==="confirmed" && value(form,"confirmed_by_contact")!=="yes")
  fail("Before confirming, tick that the volunteer personally agreed.");
 const {error}=await supabase.from("repair_cafe_shift_assignments").update({status}).eq("id",id);
 assertResult(error,"Could not change shift status");
 done("Shift status updated.");
}
export async function updateSlot(form:FormData){
 const {supabase}=await coordinator();
 const id=value(form,"slot_id"),role_name=value(form,"role_name"),
 notes=value(form,"notes"),required_count=Number(value(form,"required_count"));
 checkId(id);
 if(role_name.length<2||role_name.length>80||notes.length>250||
    !Number.isInteger(required_count)||required_count<1||required_count>20)
  fail("Check the position name, capacity and notes.");
 const {error}=await supabase.from("repair_cafe_shift_slots")
  .update({role_name,notes,required_count}).eq("id",id);
 assertResult(error,"Could not update position");
 done("Position updated. Check whether any public event needs re-publication.");
}
export async function deleteSlot(form:FormData){
 const {supabase}=await coordinator();
 const id=value(form,"slot_id");checkId(id);
 if(value(form,"confirm")!=="DELETE")fail("Type DELETE to remove this position and its assigned volunteers.");
 const {data:slot}=await supabase.from("repair_cafe_shift_slots").select("event_id").eq("id",id).single();
 if(!slot)fail("Position missing.");
 const {data:event}=await supabase.from("repair_cafe_sessions").select("status").eq("id",slot.event_id).single();
 if(event?.status==="published")fail("Unpublish the event first and tell affected volunteers.");
 const {error}=await supabase.from("repair_cafe_shift_slots").delete().eq("id",id);
 assertResult(error,"Could not remove position");done("Position and attached assignments removed.");
}
export async function deleteSession(form:FormData){
 const {supabase}=await coordinator();
 const id=value(form,"event_id");checkId(id);
 if(value(form,"confirm")!=="DELETE")fail("Type DELETE to remove this session, availability and roster.");
 const {data:event}=await supabase.from("repair_cafe_sessions").select("status").eq("id",id).single();
 if(!event)fail("Session not found.");
 if(event.status==="published")fail("Unpublish the session before deleting; notify affected people.");
 const {error}=await supabase.from("repair_cafe_sessions").delete().eq("id",id);
 assertResult(error,"Could not delete session");done("Session removed with its availability and roster records.");
}
export async function deleteVenue(form:FormData){
 const {supabase}=await coordinator();
 const id=value(form,"venue_id");checkId(id);
 if(value(form,"confirm")!=="DELETE")fail("Type DELETE to remove this venue.");
 const {data:linked}=await supabase.from("repair_cafe_sessions").select("id").eq("venue_id",id).limit(1);
 if(linked?.length)fail("This venue belongs to an event. Change that event's venue before deleting.");
 const {error}=await supabase.from("repair_cafe_venues").delete().eq("id",id);
 assertResult(error,"Could not delete venue");done("Venue removed from directory.");
}
