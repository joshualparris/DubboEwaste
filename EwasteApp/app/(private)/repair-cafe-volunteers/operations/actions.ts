"use server";
import {randomUUID} from "crypto";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireProgrammeContext} from "@/lib/programme-context";

const root="/repair-cafe-volunteers/operations";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const field=(f:FormData,k:string)=>String(f.get(k)??"").trim();
function fail(event:string,s:string):never{redirect(root+"?event="+encodeURIComponent(event)+"&error="+encodeURIComponent(s))}
function done(event:string,s:string):never{for(const path of [root,"/repair-cafe-volunteers/sessions","/repair-cafe-volunteers/event-desk","/repair-cafe-volunteers/reports"])revalidatePath(path);redirect(root+"?event="+encodeURIComponent(event)+"&success="+encodeURIComponent(s))}
function asId(event:string,id:string){if(!uuid.test(id))fail(event,"Invalid record ID");return id}
function limit(event:string,s:string,max:number){if(s.length>max)fail(event,"Input exceeds allowed length");return s}
function check(event:string,error:{message:string}|null,operation:string){if(error)fail(event,operation+": "+error.message)}
async function mgr(){
 const {context,supabase}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))redirect("/repair-cafe-volunteers/sessions?error=Coordinator%20access%20required");
 const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 return {supabase,user};
}
export async function addVenueHistory(f:FormData){
 const {supabase}=await mgr();const event=field(f,"event_id"),venue=asId(event,field(f,"venue_id"));
 const method=field(f,"method"),result=field(f,"result");
 if(!["email","phone","in_person","other"].includes(method)||!["enquiry","offered","hold","confirmed","declined","cancelled","follow_up"].includes(result))fail(event,"Invalid correspondence method or outcome");
 const {error}=await supabase.from("repair_cafe_venue_contacts").insert({
  venue_id:venue,event_id:event||null,method,result,contact_name:limit(event,field(f,"contact_name"),120),
  note:limit(event,field(f,"note"),1500),evidence_reference:limit(event,field(f,"evidence_reference"),500)});
 check(event,error,"Recording contact");done(event,"Venue correspondence recorded. This does not itself confirm a booking.");
}
export async function removeVenueHistory(f:FormData){
 const {supabase}=await mgr(),event=field(f,"event_id"),id=asId(event,field(f,"entry_id"));
 if(field(f,"confirm")!=="DELETE")fail(event,"Type DELETE");
 const {error}=await supabase.from("repair_cafe_venue_contacts").delete().eq("id",id).eq("event_id",event);
 check(event,error,"Deleting correspondence");done(event,"Correspondence entry deleted");
}
export async function recordCompetency(f:FormData){
 const {supabase,user}=await mgr(),event=field(f,"event_id"),person=asId(event,field(f,"person_id"));
 const kind=field(f,"kind"),state=field(f,"verification"),course=limit(event,field(f,"course_slug"),120);
 if(!["account","manual"].includes(kind)||!["training","supervised","verified","expired"].includes(state)||course.length<2)fail(event,"Check competency details");
 const column=kind==="account"?"user_id":"manual_volunteer_id";
 const {data:old}=await supabase.from("repair_cafe_competencies").select("id").eq(column,person).eq("course_slug",course).maybeSingle();
 const row={course_slug:course,verification:state,evidence_note:limit(event,field(f,"evidence_note"),500),
  user_id:kind==="account"?person:null,manual_volunteer_id:kind==="manual"?person:null,
  verified_by:state==="verified"?user.id:null,verified_at:state==="verified"?new Date().toISOString():null,
  expires_on:field(f,"expires_on")||null};
 const {error}=old?await supabase.from("repair_cafe_competencies").update(row).eq("id",old.id):
  await supabase.from("repair_cafe_competencies").insert(row);
 check(event,error,"Saving competency");done(event,"Competency status saved; this is separate from self-declared skills and LMS progress");
}
export async function removeCompetency(f:FormData){
 const {supabase}=await mgr(),event=field(f,"event_id"),id=asId(event,field(f,"competency_id"));
 const {error}=await supabase.from("repair_cafe_competencies").delete().eq("id",id);
 check(event,error,"Removing competency");done(event,"Competency record removed");
}
export async function recordAttendance(f:FormData){
 const {supabase}=await mgr(),event=asId("",field(f,"event_id")),person=asId(event,field(f,"person_id"));
 const kind=field(f,"kind"),mode=field(f,"mode");if(!["account","manual"].includes(kind)||!["in","out","reset"].includes(mode))fail(event,"Invalid attendance selection");
 const col=kind==="account"?"user_id":"manual_volunteer_id";
 const {data:membership,error:memberError}=kind==="account"
  ?await supabase.from("program_access").select("user_id").eq("user_id",person).eq("program","repair_cafe").eq("active",true).maybeSingle()
  :await supabase.from("repair_cafe_manual_volunteers").select("id").eq("id",person).is("deleted_at",null).maybeSingle();
 check(event,memberError,"Checking volunteer membership");
 if(!membership)fail(event,"Only an active Repair Café volunteer can be checked in or out.");
 const {data:old}=await supabase.from("repair_cafe_attendance").select("id,check_in_at").eq("event_id",event).eq(col,person).maybeSingle();
 if(mode==="out"&&!old?.check_in_at)fail(event,"Check this volunteer in first");
 const now=new Date().toISOString();
 const values=mode==="in"?{check_in_at:now,check_out_at:null}:mode==="out"?{check_out_at:now}:{check_in_at:null,check_out_at:null};
 const {error}=old?await supabase.from("repair_cafe_attendance").update(values).eq("id",old.id):
  await supabase.from("repair_cafe_attendance").insert({event_id:event,[col]:person,...values});
 check(event,error,"Recording attendance");done(event,mode==="in"?"Volunteer checked in":mode==="out"?"Volunteer checked out":"Attendance reset");
}
export async function createIncident(f:FormData){
 const {supabase}=await mgr(),event=asId("",field(f,"event_id"));
 const severity=field(f,"severity"),details=limit(event,field(f,"details"),3000);
 if(!["near_miss","minor","major"].includes(severity)||details.length<3)fail(event,"Describe the incident and choose severity");
 const ticket=field(f,"ticket_id");if(ticket){
  asId(event,ticket);
  const {data:related}=await supabase.from("repair_cafe_tickets").select("event_id").eq("id",ticket).maybeSingle();
  if(!related||related.event_id!==event)fail(event,"The incident ticket must belong to this event.");
 }
 const {error}=await supabase.from("repair_cafe_incidents").insert({
  event_id:event,ticket_id:ticket||null,severity,details,
  immediate_action:limit(event,field(f,"immediate_action"),3000),
  follow_up:limit(event,field(f,"follow_up"),2000)});
 check(event,error,"Recording incident");done(event,"Incident recorded. Escalate urgent issues using your real-world emergency plan");
}
export async function amendIncident(f:FormData){
 const {supabase}=await mgr(),event=asId("",field(f,"event_id")),entry=asId(event,field(f,"incident_id"));
 const state=field(f,"state");if(!["open","reviewing","closed"].includes(state))fail(event,"Invalid incident state");
 const {error}=await supabase.from("repair_cafe_incidents").update({
  state,immediate_action:limit(event,field(f,"immediate_action"),3000),
  follow_up:limit(event,field(f,"follow_up"),2000)
 }).eq("id",entry).eq("event_id",event);
 check(event,error,"Updating incident");done(event,"Incident follow-up saved");
}
export async function saveTicketWeight(f:FormData){
 const {supabase}=await mgr(),event=asId("",field(f,"event_id")),ticket=asId(event,field(f,"ticket_id"));
 const weight=field(f,"weight");
 if(weight&&(!Number.isFinite(Number(weight))||Number(weight)<0||Number(weight)>10000))fail(event,"Only enter a physically measured weight in kg");
 const {error}=await supabase.from("repair_cafe_tickets").update({
  measured_weight_kg:weight?Number(weight):null,owner_kept_item:field(f,"owner_kept_item")==="yes"
 }).eq("id",ticket).eq("event_id",event);
 check(event,error,"Saving weight");done(event,"Measured evidence saved. No estimated CO₂ claims have been calculated");
}
export async function uploadTicketPhoto(f:FormData){
 const {supabase,user}=await mgr(),event=asId("",field(f,"event_id")),ticket=asId(event,field(f,"ticket_id"));
 const {data:found}=await supabase.from("repair_cafe_tickets").select("id").eq("id",ticket).eq("event_id",event).single();
 if(!found)fail(event,"Ticket not found");
 if(field(f,"photo_permission")!=="yes")
  fail(event,"Ask the item owner for explicit permission to store the photo privately before uploading.");
 const file=f.get("photo");
 if(!(file instanceof File))fail(event,"Select a photo");
 const ext:{[key:string]:string}={"image/jpeg":"jpg","image/png":"png","image/webp":"webp"};
 if(!ext[file.type]||file.size<20||file.size>5*1024*1024)fail(event,"Photo must be JPG, PNG or WebP, under 5 MB");
 const h=new Uint8Array(await file.slice(0,12).arrayBuffer());
 const good=(file.type==="image/jpeg"&&h[0]===255&&h[1]===216)
  ||(file.type==="image/png"&&h[0]===137&&h[1]===80&&h[2]===78&&h[3]===71)
  ||(file.type==="image/webp"&&String.fromCharCode(...h.slice(0,4))==="RIFF"&&String.fromCharCode(...h.slice(8,12))==="WEBP");
 if(!good)fail(event,"Photo contents do not match the file type");
 const object_path=event+"/"+ticket+"/"+randomUUID()+"."+ext[file.type];
 const {error:up}=await supabase.storage.from("repair-cafe-private").upload(object_path,file,{contentType:file.type,upsert:false});
 check(event,up,"Uploading private photo");
 const {error:db}=await supabase.from("repair_cafe_visit_photos").insert({
  ticket_id:ticket,object_path,mime_type:file.type,note:limit(event,field(f,"note"),200),uploaded_by:user.id
 });
 if(db){await supabase.storage.from("repair-cafe-private").remove([object_path]);fail(event,"Photo metadata failed: "+db.message)}
 done(event,"Photo saved privately. It is never displayed on the public website.");
}
export async function removeTicketPhoto(f:FormData){
 const {supabase}=await mgr(),event=asId("",field(f,"event_id")),id=asId(event,field(f,"photo_id"));
 const {data:photo}=await supabase.from("repair_cafe_visit_photos").select("object_path").eq("id",id).single();
 if(!photo)fail(event,"Photo not found");
 const {error:removed}=await supabase.storage.from("repair-cafe-private").remove([photo.object_path]);
 check(event,removed,"Deleting private photo");
 const {error}=await supabase.from("repair_cafe_visit_photos").delete().eq("id",id);
 check(event,error,"Deleting photo index");done(event,"Photo deleted");
}
export async function saveNoticePreferences(f:FormData){
 const {supabase}=await requireProgrammeContext();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/login");
 const email=field(f,"email"),phone=field(f,"phone"),email_opt_in=field(f,"email_opt_in")==="yes",sms_opt_in=field(f,"sms_opt_in")==="yes";
 if(email.length>254||phone.length>40||(email_opt_in&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))||
  (sms_opt_in&&!/^\+?[0-9 ]{9,20}$/.test(phone)))fail("","Enter a valid opted-in contact address");
 const {error}=await supabase.from("repair_cafe_notification_preferences").upsert({
  user_id:user.id,email,phone,email_opt_in,sms_opt_in,updated_at:new Date().toISOString()
 },{onConflict:"user_id"});
 check("",error,"Saving notification preferences");done("","Notification preferences saved (delivery requires a configured provider)");
}
export async function saveManualNoticePreferences(f:FormData){
 const {supabase}=await mgr(),event=field(f,"event_id"),id=asId(event,field(f,"manual_volunteer_id"));
 const {data:volunteer}=await supabase.from("repair_cafe_manual_volunteers").select("contact_consent,email,phone").eq("id",id).single();
 if(!volunteer?.contact_consent)fail(event,"Contact permission must be recorded first");
 const email=field(f,"notify_email")==="yes",sms=field(f,"notify_sms")==="yes";
 if((email&&!volunteer.email)||(sms&&!volunteer.phone))fail(event,"A valid opted-in destination is required");
 const {error}=await supabase.from("repair_cafe_manual_volunteers").update({notify_email:email,notify_sms:sms}).eq("id",id);
 check(event,error,"Saving opt-in");done(event,"Volunteer contact preferences updated");
}
export async function queueVolunteerNotice(f:FormData){
 const {supabase}=await mgr(),event=asId("",field(f,"event_id")),kind=field(f,"kind");
 if(!["manual","change","cancellation"].includes(kind))fail(event,"Unknown message type");
 const subject=limit(event,field(f,"subject"),200),message=limit(event,field(f,"message"),2000);
 if(message.length<5)fail(event,"Write a meaningful message");
 const [man,acc,ma,aa]=await Promise.all([
  supabase.from("repair_cafe_manual_volunteers").select("id,email,phone,notify_email,notify_sms,contact_consent").is("deleted_at",null),
  supabase.from("repair_cafe_notification_preferences").select("user_id,email,phone,email_opt_in,sms_opt_in"),
  supabase.from("repair_cafe_manual_availability").select("manual_volunteer_id").eq("event_id",event).neq("response","unavailable"),
  supabase.from("repair_cafe_availability").select("user_id").eq("event_id",event).neq("response","unavailable")
 ]);
 for(const q of [man,acc,ma,aa])check(event,q.error,"Finding opted-in recipients");
 const mids=new Set((ma.data||[]).map(x=>x.manual_volunteer_id)),aids=new Set((aa.data||[]).map(x=>x.user_id));
 const recipients=[
  ...(man.data||[]).filter(p=>mids.has(p.id)&&p.contact_consent).flatMap(p=>[
   ...(p.notify_email&&p.email?[{channel:"email",destination:p.email}]:[]),
   ...(p.notify_sms&&p.phone?[{channel:"sms",destination:p.phone}]:[])
  ]),
  ...(acc.data||[]).filter(p=>aids.has(p.user_id)).flatMap(p=>[
   ...(p.email_opt_in&&p.email?[{channel:"email",destination:p.email}]:[]),
   ...(p.sms_opt_in&&p.phone?[{channel:"sms",destination:p.phone}]:[])
  ])
 ];
 if(!recipients.length)fail(event,"No volunteers for this event have explicitly opted in to messages");
 const batch=randomUUID();
 const {error}=await supabase.from("repair_cafe_notifications").insert(recipients.map((r,i)=>({
  event_id:event,...r,kind,subject,message,dedupe_key:batch+"-"+i
 })));
 check(event,error,"Queueing notifications");done(event,recipients.length+" messages queued, not yet sent. Email/SMS delivery requires provider setup.");
}
export async function restoreArchivedEvent(f:FormData){
 const {supabase}=await mgr(),id=asId("",field(f,"event_id"));
 const {error}=await supabase.from("repair_cafe_sessions").update({deleted_at:null,status:"draft"}).eq("id",id);
 check("",error,"Restoring session");done(id,"Restored session as a private draft");
}
export async function archiveActiveEvent(f:FormData){
 const {supabase}=await mgr(),event=asId("",field(f,"event_id"));
 if(field(f,"confirm")!=="ARCHIVE")fail(event,"Type ARCHIVE to hide the session");
 const {data:s}=await supabase.from("repair_cafe_sessions").select("status").eq("id",event).single();
 if(!s||s.status==="published")fail(event,"Unpublish and notify attendees before archiving");
 const {error}=await supabase.from("repair_cafe_sessions").update({deleted_at:new Date().toISOString()}).eq("id",event);
 check(event,error,"Archiving session");done("","Session archived; it can be restored from the operations page");
}
