"use server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
const root="/repair-cafe-volunteers/contacts";
const uuid=/^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i;
const val=(f:FormData,k:string)=>String(f.get(k)??"").trim();
const safeDate=(s:string)=>s===""||/^\d{4}-\d{2}-\d{2}$/.test(s);
const statuses=["sent","auto_acknowledged","human_replied","follow_up","bounced","closed"];
const kinds=["sent","auto_acknowledgement","human_reply","follow_up","phone_call","note","bounce"];
const limit=(s:string,max:number)=>s.length<=max;
function bad(message:string):never {redirect(root+"?error="+encodeURIComponent(message));}
async function authorised(){
 const r=await requireProgrammeContext();
 const c=r.context;
 if(!c.global_admin&&(c.selected!=="repair_cafe"||!["admin","manager"].includes(c.role||""))) redirect("/repair-cafe-volunteers");
 const {data:{user}}=await r.supabase.auth.getUser();
 if(!user)redirect("/login");
 return {...r,user};
}
function cleanedUrl(s:string){
 if(!s)return "";
 try {const u=new URL(s);if(!["https:","http:"].includes(u.protocol))throw Error("invalid");return u.toString();}
 catch {bad("Website or evidence link needs a valid http/https URL.");}
}
function done(id:string,message:string):never {
 revalidatePath(root);revalidatePath(root+"/"+id);
 redirect(root+"/"+id+"?success="+encodeURIComponent(message));
}
export async function createContact(form:FormData) {
 const {supabase}=await authorised();
 const email=val(form,"email").toLowerCase();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)bad("Enter a valid contact email.");
 const name=val(form,"organisation_name"),town=val(form,"town"),state=val(form,"state");
 if(name.length>180||town.length>100||!["","NSW","ACT","VIC","QLD","SA","WA","TAS","NT"].includes(state))bad("Check the contact details.");
 const {data,error}=await supabase.from("repair_cafe_outreach_contacts").insert({email,organisation_name:name,town,state,contact_status:"sent"}).select("id").single();
 if(error||!data)bad("Could not create contact (it might already exist).");
 done(data.id,"Contact added. No outreach email was sent.");
}
export async function saveContact(form:FormData) {
 const {supabase}=await authorised();const id=val(form,"contact_id");
 if(!uuid.test(id))bad("Invalid contact.");
 const short=["email","organisation_name","town","state","website","contact_name","phone","venue_description","legal_structure","insurer","public_liability","products_liability","volunteer_cover","device_damage_cover","funding_source","insurance_notes","evidence_url","notes","contact_status","follow_up_on"];
 const v=Object.fromEntries(short.map(k=>[k,val(form,k)]));
 const constraints:Record<string,number>={email:254,organisation_name:180,town:100,website:500,contact_name:160,phone:80,venue_description:500,legal_structure:500,insurer:180,public_liability:500,products_liability:500,volunteer_cover:500,device_damage_cover:500,funding_source:500,insurance_notes:3000,evidence_url:500,notes:5000};
 if(Object.entries(constraints).some(([k,max])=>!limit(v[k],max)))bad("One or more fields are too long.");
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)||!statuses.includes(v.contact_status)||!["","NSW","ACT","VIC","QLD","SA","WA","TAS","NT"].includes(v.state)||!safeDate(v.follow_up_on))bad("Check email, state, status and follow-up date.");
 const premiumText=val(form,"annual_premium_aud");
 const premium=premiumText===""?null:Number(premiumText);
 if(premium!==null&&(!Number.isFinite(premium)||premium<0||premium>99999999))bad("Invalid annual premium.");
 const updates={...v,email:v.email.toLowerCase(),website:cleanedUrl(v.website),evidence_url:cleanedUrl(v.evidence_url),annual_premium_aud:premium,follow_up_on:v.follow_up_on||null,updated_at:new Date().toISOString()};
 const {error}=await supabase.from("repair_cafe_outreach_contacts").update(updates).eq("id",id);
 if(error)bad("Could not update contact: "+error.message);
 done(id,"Contact information saved.");
}
export async function addCorrespondence(form:FormData) {
 const {supabase}=await authorised();const contact_id=val(form,"contact_id");
 if(!uuid.test(contact_id))bad("Invalid contact.");
 const kind=val(form,"kind"),subject=val(form,"subject"),summary=val(form,"summary"),source_email=val(form,"source_email"),gmail_url=cleanedUrl(val(form,"gmail_url"));
 if(!kinds.includes(kind)||subject.length>300||summary.length>5000||!summary||source_email.length>254||gmail_url.length>600)bad("Check correspondence details.");
 const happened_at=val(form,"happened_at");
 if(happened_at&&Number.isNaN(new Date(happened_at).getTime()))bad("Invalid correspondence date.");
 const {error}=await supabase.from("repair_cafe_outreach_correspondence").insert({contact_id,kind,subject,summary,source_email,gmail_url,happened_at:happened_at?new Date(happened_at).toISOString():new Date().toISOString()});
 if(error)bad("Could not save correspondence: "+error.message);
 if(kind==="human_reply"||kind==="auto_acknowledgement"||kind==="bounce"){
  const status=kind==="human_reply"?"human_replied":kind==="bounce"?"bounced":"auto_acknowledged";
  await supabase.from("repair_cafe_outreach_contacts").update({contact_status:status,last_response_on:new Date().toISOString().slice(0,10),updated_at:new Date().toISOString()}).eq("id",contact_id);
 }
 done(contact_id,"Correspondence recorded. Gmail was not contacted or modified.");
}
export async function deleteCorrespondence(form:FormData) {
 const {supabase}=await authorised(),contact_id=val(form,"contact_id"),id=val(form,"entry_id");
 if(!uuid.test(contact_id)||!uuid.test(id)||val(form,"confirm")!=="yes")bad("Confirm deletion.");
 const {error}=await supabase.from("repair_cafe_outreach_correspondence").delete().eq("id",id).eq("contact_id",contact_id);
 if(error)bad("Could not delete correspondence.");
 done(contact_id,"Entry deleted. Gmail remains unchanged.");
}
export async function deleteContact(form:FormData){
 const {supabase}=await authorised(),id=val(form,"contact_id");
 if(!uuid.test(id)||val(form,"confirm")!=="yes")bad("Confirm contact deletion.");
 const {error}=await supabase.from("repair_cafe_outreach_contacts").delete().eq("id",id);
 if(error)bad("Could not delete contact.");
 revalidatePath(root);redirect(root+"?success="+encodeURIComponent("Contact and its local correspondence entries deleted. Gmail messages were not changed."));
}
