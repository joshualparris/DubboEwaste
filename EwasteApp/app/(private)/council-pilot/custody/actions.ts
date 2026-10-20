"use server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {z} from "zod";
import {requireProgrammeContext} from "@/lib/programme-context";

const uuid=z.string().uuid();
const optionalId=z.union([uuid,z.literal("")]).transform(x=>x||null);
const base="/council-pilot/custody";
function finish(batch:string,message:string,error=false):never{
 revalidatePath(base);revalidatePath("/council-pilot");
 redirect(base+"?"+new URLSearchParams({batch,[error?"error":"notice"]:message}));
}
const string=(v:FormDataEntryValue|null)=>String(v||"").trim();
function batchOf(fd:FormData){const parsed=uuid.safeParse(fd.get("batch_id"));if(!parsed.success)redirect("/council-pilot");return parsed.data;}
async function access(supervisor=false){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="dubbo_ewaste"||
   !(supervisor?["admin","manager"]:["admin","manager","technician"]).includes(context.role||"")))
   redirect("/programmes?error=Authorised%20E-waste%20custody%20access%20required");
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/login");return {supabase,user};
}
async function belongs(supabase:Awaited<ReturnType<typeof access>>["supabase"],batch:string,asset:string){
 const [{data:a},{data:b}]=await Promise.all([
  supabase.from("assets").select("id,job_id,asset_code").eq("id",asset).maybeSingle(),
  supabase.from("council_pilot_batches").select("job_id").eq("id",batch).maybeSingle(),
 ]);
 return !!a&&!!b&&a.job_id===b.job_id;
}
export async function createCustodyLocation(fd:FormData){
 const batch=batchOf(fd);const {supabase,user}=await access(true);
 const p=z.object({name:z.string().trim().min(5).max(160),
  kind:z.enum(["SECURE_TRANSPORT","LOCKED_STORAGE","SECURE_WORKSHOP","QUARANTINE","EXTERNAL_HANDOVER"]),
  controls:z.string().trim().min(12).max(3000),
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)finish(batch,"Secure location needs a name, category and physical protection details",true);
 const {error}=await supabase.from("council_custody_locations").insert({...p.data,batch_id:batch,created_by:user.id,status:"DRAFT"});
 if(error)finish(batch,error.message,true);
 finish(batch,"Secure location saved as DRAFT. Independent site verification and evidence are still required.");
}
export async function verifyCustodyLocation(fd:FormData){
 const batch=batchOf(fd);const {supabase,user}=await access(true);
 const p=z.object({location_id:uuid,evidence_id:uuid}).safeParse(Object.fromEntries(fd));
 if(!p.success)finish(batch,"Select location and job-linked inspection evidence",true);
 const {data,error}=await supabase.from("council_custody_locations")
  .update({status:"VERIFIED",evidence_id:p.data.evidence_id,verified_by:user.id})
  .eq("id",p.data.location_id).eq("batch_id",batch).eq("status","DRAFT")
  .select("id").maybeSingle();
 if(error||!data)finish(batch,error?.message||"Draft location not found",true);
 finish(batch,"Secure location independently verified; actual access, locks and site conditions remain operator responsibilities.");
}
export async function initiateCustodyTransfer(fd:FormData){
 const batch=batchOf(fd);const {supabase,user}=await access();
 const p=z.object({asset_id:uuid,receiving_user:uuid,to_location_id:uuid,
   event_type:z.enum(["COLLECTED","RECEIVED","INTERNAL_MOVE","QUARANTINED","RETURNED","HANDOVER"]),
   handover_route:z.union([z.enum(["DONATE","RECYCLE"]),z.literal("")]).transform(v=>v||null),
   from_location:z.string().trim().min(5).max(160),
   outgoing_scan:z.string().trim().min(3).max(600),
   serial_readback:z.string().trim().max(160),
   document_reference:z.string().trim().min(3).max(200),
   evidence_id:uuid,
   external_party:z.string().trim().max(200).optional(),
   request_notes:z.string().trim().max(1800).optional(),
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)finish(batch,"Provide equipment QR, serial, both staff, location and original handover evidence",true);
 if(!await belongs(supabase,batch,p.data.asset_id))finish(batch,"Asset is not part of this Council pilot",true);
 const {error}=await supabase.from("council_custody_transfers").insert({
  ...p.data,batch_id:batch,releasing_user:user.id,status:"REQUESTED",
 });
 if(error)finish(batch,error.message,true);
 finish(batch,"Custody REQUESTED only. Equipment has not changed verified custody until the named second person scans and accepts.");
}
export async function decideCustodyTransfer(fd:FormData){
 const batch=batchOf(fd);const {supabase,user}=await access();
 const p=z.object({transfer_id:uuid,decision:z.enum(["CONFIRMED","REJECTED","CANCELLED"]),
  incoming_scan:z.string().trim().max(600).optional(),
  rejection_reason:z.string().trim().max(1800).optional(),
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)finish(batch,"Invalid transfer decision",true);
 const {data:row}=await supabase.from("council_custody_transfers")
  .select("id,receiving_user,releasing_user,status").eq("id",p.data.transfer_id)
  .eq("batch_id",batch).maybeSingle();
 if(!row||row.status!=="REQUESTED")finish(batch,"Transfer is no longer awaiting acknowledgement",true);
 if(p.data.decision==="CANCELLED"&&row.releasing_user!==user.id)finish(batch,"Only the releasing person can cancel",true);
 if(p.data.decision!=="CANCELLED"&&row.receiving_user!==user.id)finish(batch,"Only the named receiving operator can accept or reject this transfer",true);
 if(p.data.decision==="CONFIRMED"&&!p.data.incoming_scan)finish(batch,"Second independent QR scan required",true);
 if(p.data.decision!=="CONFIRMED"&&(p.data.rejection_reason?.length||0)<10)finish(batch,"Record a meaningful rejection/cancellation reason",true);
 const {data,error}=await supabase.from("council_custody_transfers")
 .update({status:p.data.decision,incoming_scan:p.data.decision==="CONFIRMED"?p.data.incoming_scan:null,
    rejection_reason:p.data.decision==="CONFIRMED"?null:p.data.rejection_reason||null})
 .eq("id",p.data.transfer_id).eq("batch_id",batch).eq("status","REQUESTED").select("id").maybeSingle();
 if(error||!data)finish(batch,error?.message||"Transfer changed while you were reviewing it",true);
 finish(batch,p.data.decision==="CONFIRMED"?
  "Independent custody confirmation recorded. The hash-linked ledger and original receipt are now committed.":
  "Transfer "+p.data.decision.toLowerCase()+". This never constitutes a confirmed custody movement.");
}
export async function reportCustodyDiscrepancy(fd:FormData){
 const batch=batchOf(fd);const {supabase,user}=await access();
 const p=z.object({asset_id:optionalId,location_id:optionalId,
  discrepancy_type:z.enum(["MISSING","UNEXPECTED","MISMATCHED_LABEL","BROKEN_SEAL","DAMAGED","UNAUTHORISED_MOVEMENT","OTHER"]),
  description:z.string().trim().min(10).max(2500),
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)finish(batch,"Describe an actual missing, damaged, unverified or mismatched item",true);
 if(p.data.asset_id&&!await belongs(supabase,batch,p.data.asset_id))finish(batch,"Discrepancy asset outside pilot",true);
 const {error}=await supabase.from("council_custody_discrepancies").insert({...p.data,batch_id:batch,opened_by:user.id});
 if(error)finish(batch,error.message,true);
 finish(batch,"Open discrepancy recorded; any affected release is blocked. Contact the responsible supervisor and report legally notifiable incidents.");
}
export async function resolveCustodyDiscrepancy(fd:FormData){
 const batch=batchOf(fd);const {supabase,user}=await access(true);
 const p=z.object({discrepancy_id:uuid,resolution:z.string().trim().min(15).max(3000),resolution_evidence_id:uuid}).safeParse(Object.fromEntries(fd));
 if(!p.success)finish(batch,"Independent resolution must include a full explanation and original job-linked file",true);
 const {data,error}=await supabase.from("council_custody_discrepancies").update({
  status:"RESOLVED",resolution:p.data.resolution,resolution_evidence_id:p.data.resolution_evidence_id,resolved_by:user.id,
 }).eq("id",p.data.discrepancy_id).eq("batch_id",batch).eq("status","OPEN").select("id").maybeSingle();
 if(error||!data)finish(batch,error?.message||"Discrepancy not open or unavailable",true);
 finish(batch,"Evidence-linked discrepancy independently resolved. Physical verification and incident duties remain separate.");
}
export async function reconcileCustodyLocation(fd:FormData){
 const batch=batchOf(fd);const {supabase,user}=await access();
 const p=z.object({location_id:uuid,evidence_id:uuid,
   observed_codes:z.string().trim().max(8000),notes:z.string().trim().max(2000),
 }).safeParse(Object.fromEntries(fd));
 if(!p.success)finish(batch,"Choose a location, scan its physical devices and attach signed reconciliation evidence",true);
 const entries=p.data.observed_codes.split(/[\r\n]+/).map(s=>s.trim()).filter(Boolean);
 if(entries.length>20)finish(batch,"The Council pilot holds no more than 20 devices",true);
 const {data,error}=await supabase.from("council_custody_reconciliations").insert({
   batch_id:batch,location_id:p.data.location_id,evidence_id:p.data.evidence_id,
   observed_codes:entries,checked_by:user.id,notes:p.data.notes,
 }).select("status,missing_codes,unexpected_codes").single();
 if(error||!data)finish(batch,error?.message||"Unable to verify physical inventory",true);
 finish(batch,data.status==="MATCH"?"Physical labels matched the ledger snapshot; signed count evidence recorded.":
  "MISMATCH: missing/unexpected devices recorded as discrepancies; active pilot paused automatically. Investigate before any release.");
}
