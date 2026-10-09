"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";

const base="/repair-cafe-volunteers/event-desk";
const validUuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const field=(form:FormData,key:string)=>String(form.get(key)??"").trim();
function target(eventId:string){
 return base+(validUuid.test(eventId)?"?event="+encodeURIComponent(eventId):"");
}
function message(eventId:string,type:"error"|"success",value:string):never {
 const separator=validUuid.test(eventId)?"&":"?";
 redirect(target(eventId)+separator+type+"="+encodeURIComponent(value));
}
async function requireDesk(coordinator=false){
 const result=await requireProgrammeContext();
 const {context,supabase}=result;
 if(!context.global_admin&&context.selected!=="repair_cafe")
  redirect("/programmes?error=Switch%20to%20Repair%20Caf%C3%A9");
 if(coordinator&&!context.global_admin&&!["admin","manager"].includes(context.role??""))
  redirect(base+"?error=Coordinator%20permissions%20required");
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/login");
 return {...result,user};
}
function fail(eventId:string,error:string):never{message(eventId,"error",error);}
function succeed(eventId:string,notice:string):never{
 revalidatePath(base);
 revalidatePath("/repair-cafe-volunteers/sessions");
 message(eventId,"success",notice);
}
function formError(error:{message:string}|null,eventId:string,context:string){
 if(error)fail(eventId,context+": "+error.message);
}

export async function checkInRepairItem(form:FormData){
 const {supabase}=await requireDesk();
 const eventId=field(form,"event_id");
 if(!validUuid.test(eventId))fail(eventId,"Choose an event.");
 const category=field(form,"category"),item=field(form,"item"),fault=field(form,"fault"),visitorName=field(form,"visitor_name");
 const risk=field(form,"risk"),riskNotes=field(form,"risk_notes");
 if(!["electronics","computers","small_appliance","textiles","bicycle","furniture","household","other"].includes(category)
  ||item.length<2||item.length>160||fault.length<3||fault.length>700||riskNotes.length>500
  ||visitorName.length<1||visitorName.length>50||/[\x00-\x1f\x7f]/.test(visitorName)
  ||!["clear","review","unsafe"].includes(risk))
  fail(eventId,"Check the item, fault and safety assessment.");
 if(field(form,"screened")!=="yes"||field(form,"acknowledged")!=="yes")
  fail(eventId,"Safety screen and the visitor's acknowledgement are required.");
 const {data,error}=await supabase.rpc("repair_cafe_check_in_named",{
  p_event_id:eventId,p_category:category,p_item:item,p_problem:fault,
  p_acknowledged:true,p_screened:true,p_risk:risk,p_risk_notes:riskNotes,p_visitor_name:visitorName
 });
 formError(error,eventId,"Check-in failed");
 const number=(data??[])[0]?.queue_number;
 succeed(eventId,number?visitorName+" · item #"+number+" checked in. "+(risk==="unsafe"?"Unsafe item recorded as not attempted.":"It is now in the queue."):"Item checked in.");
}
export async function saveRepairTicket(form:FormData){
 const {supabase}=await requireDesk();
 const eventId=field(form,"event_id"),ticketId=field(form,"ticket_id");
 if(!validUuid.test(eventId)||!validUuid.test(ticketId))fail(eventId,"Invalid ticket.");
 const status=field(form,"status"),risk=field(form,"risk"),riskNotes=field(form,"risk_notes");
 const stationId=field(form,"station_id"),note=field(form,"note"),advice=field(form,"advice"),parts=field(form,"parts");
 const outcome=field(form,"outcome"),barrier=field(form,"barrier");
 const progressCode=field(form,"progress_code"),revision=field(form,"revision");
 const allowedProgress=["","diagnosing","progress_made","partly_working","awaiting_parts","blocked","needs_more_work"];
 if(!allowedProgress.includes(progressCode))fail(eventId,"Choose a valid progress update.");
 if(!revision||!Number.isFinite(Date.parse(revision)))fail(eventId,"Please refresh this ticket and try saving again.");
 if(["waiting","in_progress"].includes(status)&&outcome)
  fail(eventId,"The ticket is still open. Record a partial result under Progress so far, or close the ticket for a final outcome.");
 if(status==="completed"&&!["fixed","partially_fixed","not_fixed"].includes(outcome))
  fail(eventId,"Choose a final result when closing a completed ticket.");
 if(status==="referred"&&outcome!=="referred")fail(eventId,"Choose the referred outcome to close this ticket.");
 if(status==="not_attempted"&&outcome!=="not_attempted")fail(eventId,"Choose not attempted to close this ticket.");
 if(!["waiting","in_progress","completed","referred","not_attempted","void"].includes(status)
  ||!["clear","review","unsafe"].includes(risk)||riskNotes.length>500
  ||(stationId!==""&&!validUuid.test(stationId))
  ||note.length>1200||advice.length>700||parts.length>300)
  fail(eventId,"Invalid repair update.");
 const {data:ticket,error:readError}=await supabase.from("repair_cafe_tickets")
  .select("id,event_id").eq("id",ticketId).single();
 if(readError||!ticket||ticket.event_id!==eventId)fail(eventId,"Ticket not found in this session.");
 const {error}=await supabase.rpc("repair_cafe_save_ticket_with_progress",{
  p_ticket_id:ticketId,p_status:status,p_station_id:stationId||null,
  p_outcome:outcome||null,p_barrier:barrier||null,
  p_note:note,p_advice:advice,p_parts:parts,p_risk:risk,p_risk_notes:riskNotes,
  p_progress_code:progressCode||null,p_expected_updated_at:revision
 });
 formError(error,eventId,"Could not update the ticket");
 succeed(eventId,["waiting","in_progress"].includes(status)&&progressCode?
  "Interim repair progress saved; this ticket is still open.":
  "Repair ticket updated: "+status.replaceAll("_"," ")+".");
}

export async function saveWaitingQueueNotes(form:FormData){
 const {supabase}=await requireDesk();
 const eventId=field(form,"event_id"),ticketId=field(form,"ticket_id");
 const revision=field(form,"revision");
 const reportedProblem=field(form,"reported_problem"),queueNotes=field(form,"queue_notes");
 if(!validUuid.test(eventId)||!validUuid.test(ticketId))fail(eventId,"Choose a valid queue ticket.");
 if(!revision||!Number.isFinite(Date.parse(revision)))fail(eventId,"Please reopen queue notes to edit the latest version.");
 if(reportedProblem.length<3||reportedProblem.length>700||queueNotes.length>1000)
  fail(eventId,"Check the problem description (3–700 characters) and queue notes (maximum 1000 characters).");
 // Check event ownership, and then recheck queue status, event eligibility and
 // optimistic revision in the security-definer RPC under a row lock.
 const {data:ticket,error:readError}=await supabase.from("repair_cafe_tickets")
  .select("event_id").eq("id",ticketId).single();
 if(readError||!ticket||ticket.event_id!==eventId)fail(eventId,"Ticket not found in this session.");
 const {error}=await supabase.rpc("repair_cafe_edit_waiting_notes",{
  p_ticket_id:ticketId,p_expected_updated_at:revision,
  p_reported_problem:reportedProblem,p_queue_notes:queueNotes
 });
 formError(error,eventId,"Could not save queue notes");
 succeed(eventId,"Queue notes saved. The ticket is still waiting.");
}

export async function addRepairStation(form:FormData){
 const {supabase}=await requireDesk(true);
 const eventId=field(form,"event_id"),name=field(form,"name"),category=field(form,"category"),location=field(form,"location_note");
 if(!validUuid.test(eventId)||name.length<2||name.length>80||location.length>240
  ||!["general","electrical","computers","sewing","bikes","mechanical","woodwork","other"].includes(category))
  fail(eventId,"Check station name, type and location.");
 const {error}=await supabase.from("repair_cafe_stations")
  .insert({event_id:eventId,name,category,location_note:location});
 formError(error,eventId,"Could not create station");
 succeed(eventId,"Repair station added.");
}
export async function updateRepairStation(form:FormData){
 const {supabase}=await requireDesk(true);
 const eventId=field(form,"event_id"),stationId=field(form,"station_id"),name=field(form,"name"),
  category=field(form,"category"),location=field(form,"location_note");
 if(!validUuid.test(eventId)||!validUuid.test(stationId)||name.length<2||name.length>80
  ||location.length>240||!["general","electrical","computers","sewing","bikes","mechanical","woodwork","other"].includes(category))
  fail(eventId,"Check station details.");
 const {data:station}=await supabase.from("repair_cafe_stations").select("event_id").eq("id",stationId).single();
 if(!station||station.event_id!==eventId)fail(eventId,"Station not found in this session.");
 const {error}=await supabase.from("repair_cafe_stations")
  .update({name,category,location_note:location}).eq("id",stationId);
 formError(error,eventId,"Could not update station");
 succeed(eventId,"Station updated.");
}
export async function deleteRepairStation(form:FormData){
 const {supabase}=await requireDesk(true);
 const eventId=field(form,"event_id"),stationId=field(form,"station_id");
 if(!validUuid.test(eventId)||!validUuid.test(stationId)||field(form,"confirm")!=="DELETE")
  fail(eventId,"Type DELETE before removing a station.");
 const {data:station}=await supabase.from("repair_cafe_stations").select("event_id").eq("id",stationId).single();
 if(!station||station.event_id!==eventId)fail(eventId,"Station not found.");
 const {data:linked}=await supabase.from("repair_cafe_tickets").select("id").eq("station_id",stationId).limit(1);
 if(linked?.length)fail(eventId,"This station has repair history and cannot be deleted. Rename it instead.");
 const {error}=await supabase.from("repair_cafe_stations").delete().eq("id",stationId);
 formError(error,eventId,"Could not remove station");succeed(eventId,"Unused station removed.");
}
