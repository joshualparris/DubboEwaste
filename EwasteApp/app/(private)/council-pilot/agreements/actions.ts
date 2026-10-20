"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireProgrammeContext } from "@/lib/programme-context";

const uuid = z.string().uuid();
const date = z.union([z.literal(""), z.iso.date()]).transform(value => value || null);
const optionalId = z.union([z.literal(""), uuid]).transform(value => value || null);
const activities = ["COLLECT","TRANSPORT","STORE","SANITISE","REFURBISH","DONATE","RECYCLE"] as const;
const categories = ["LAPTOP","DESKTOP","CHROMEBOOK"] as const;
const base = "/council-pilot/agreements";

function done(batch: string, agreement: string | null, message: string, error = false): never {
  revalidatePath(base);
  revalidatePath("/council-pilot");
  const params = new URLSearchParams({batch,[error ? "error":"notice"]:message});
  if (agreement) params.set("agreement",agreement);
  redirect(base + "?" + params);
}
async function supervisor() {
  const {supabase,context} = await requireProgrammeContext();
  if (!context.global_admin && (context.selected !== "dubbo_ewaste" ||
    !["admin","manager"].includes(context.role || ""))) {
      redirect("/programmes?error=Council%20agreement%20requires%20an%20E-waste%20supervisor");
  }
  const {data:{user}} = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return {supabase,user};
}
function parsedTerms(fd: FormData) {
  const data = z.object({
    reference:z.string().trim().min(5).max(200),
    council_signatory:z.string().trim().max(200),
    council_signatory_position:z.string().trim().max(200),
    council_delegation_basis:z.string().trim().max(1500),
    operator_signatory:z.string().trim().max(200),
    operator_signatory_position:z.string().trim().max(200),
    council_signed_on:date,
    operator_signed_on:date,
    council_document_evidence_id:optionalId,
    operator_document_evidence_id:optionalId,
    effective_from:date,
    expires_on:date,
    max_devices:z.coerce.number().int().min(1).max(20),
    title_transfer_point:z.enum(["NOT_AGREED","ON_COLLECTION","ON_RECEIPT","ON_SIGNED_RELEASE"]),
    title_transfer_terms:z.string().trim().max(3000),
    contractor_arrangements:z.string().trim().max(3000),
    conditions:z.string().trim().max(4000),
    collection_sites:z.string().trim().max(3000),
    device_categories:z.array(z.enum(categories)),
    permitted_activities:z.array(z.enum(activities)),
  }).safeParse({
    ...Object.fromEntries(fd),
    collection_sites: fd.get("collection_sites") || "",
    device_categories:fd.getAll("device_categories"),
    permitted_activities:fd.getAll("permitted_activities"),
  });
  if (!data.success) return null;
  const {collection_sites,...rest}=data.data;
  const sites=[...new Set(collection_sites.split(/\r?\n/).map(x=>x.trim()).filter(Boolean))];
  if (sites.length>20 || sites.some(s=>s.length<5 || s.length>250)) return null;
  return {...rest,collection_sites:sites};
}
export async function createCouncilAgreement(formData:FormData) {
  const batch=z.string().uuid().safeParse(formData.get("batch_id"));
  if (!batch.success) redirect("/council-pilot");
  const terms=parsedTerms(formData);
  if (!terms) done(batch.data,null,"Check agreement fields, dates, site names and device categories",true);
  const {supabase,user}=await supervisor();
  const {data:revisions,error:revsError}=await supabase.from("council_pilot_agreements")
    .select("revision_number").eq("batch_id",batch.data).order("revision_number",{ascending:false}).limit(1);
  if (revsError) done(batch.data,null,revsError.message,true);
  const revision=(revisions?.[0]?.revision_number||0)+1;
  const {data,error}=await supabase.from("council_pilot_agreements").insert({
    ...terms,batch_id:batch.data,revision_number:revision,status:"DRAFT",created_by:user.id,
  }).select("id").single();
  if(error||!data) done(batch.data,null,error?.message||"Unable to create agreement",true);
  done(batch.data,data.id,"Draft revision created. This does not authorise collection.");
}
export async function saveCouncilAgreement(formData:FormData) {
  const batch=z.string().uuid().safeParse(formData.get("batch_id"));
  const agreement=z.string().uuid().safeParse(formData.get("agreement_id"));
  if(!batch.success||!agreement.success) redirect("/council-pilot");
  const terms=parsedTerms(formData);
  if(!terms) done(batch.data,agreement.data,"Check dates, sites, categories and agreement fields",true);
  const {supabase}=await supervisor();
  const {data,error}=await supabase.from("council_pilot_agreements").update(terms)
    .eq("id",agreement.data).eq("batch_id",batch.data).eq("status","DRAFT").select("id").maybeSingle();
  if(error||!data) done(batch.data,agreement.data,error?.message||"Only an existing draft can be edited",true);
  done(batch.data,agreement.data,"Draft terms saved; a separate supervisor must review them.");
}
export async function changeCouncilAgreementStatus(formData:FormData) {
  const parsed=z.object({
    batch_id:uuid,
    agreement_id:uuid,
    decision:z.enum(["REVIEWED","DRAFT","APPROVED","REVOKED","SUPERSEDED"]),
    reason:z.string().trim().max(1500).optional(),
  }).safeParse(Object.fromEntries(formData));
  if(!parsed.success) redirect("/council-pilot");
  const x=parsed.data;const {supabase}=await supervisor();
  if(["REVOKED","SUPERSEDED"].includes(x.decision) && (x.reason?.length||0)<10) {
    done(x.batch_id,x.agreement_id,"Explain revocation or supersession (minimum 10 characters)",true);
  }
  const {data,error}=await supabase.from("council_pilot_agreements")
    .update({status:x.decision,...(["REVOKED","SUPERSEDED"].includes(x.decision)?{revocation_reason:x.reason}: {})})
    .eq("id",x.agreement_id).eq("batch_id",x.batch_id)
    .select("id").maybeSingle();
  if(error||!data) done(x.batch_id,x.agreement_id,error?.message||"Agreement transition was not saved",true);
  done(x.batch_id,x.agreement_id, x.decision==="APPROVED"?
    "Agreement approved in AssetFlow. Validate its legal authority independently before activating the pilot." :
    "Agreement status changed to "+x.decision+". This does not automatically release any device.");
}
