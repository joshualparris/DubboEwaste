"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireProgrammeContext } from "@/lib/programme-context";

const uuid = z.string().uuid();
const optionalId = z.union([uuid, z.literal("")]).transform(value => value || null);
const home = "/council-pilot";

function finish(message: string, error = false, batchId?: string): never {
  revalidatePath(home);
  const query = new URLSearchParams({ [error ? "error" : "notice"]: message });
  if (batchId) query.set("batch", batchId);
  redirect(home + "?" + query);
}

async function operator(supervisorOnly = false) {
  const { supabase, context } = await requireProgrammeContext();
  const role = context.role;
  if (!context.global_admin &&
      (context.selected !== "dubbo_ewaste" ||
       !["admin", "manager", "technician"].includes(role || "") ||
       (supervisorOnly && !["admin", "manager"].includes(role || "")))) {
    redirect("/programmes?error=Council%20pilot%20requires%20an%20authorised%20E-waste%20operator");
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function createPilotBatch(formData: FormData) {
  const parsed = z.object({ job_id: uuid }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) finish("Choose a valid inbound job", true);
  const { supabase, user } = await operator(true);
  const { data: job } = await supabase.from("jobs").select("id,programme").eq("id", parsed.data.job_id).maybeSingle();
  if (!job || job.programme !== "dubbo_ewaste") finish("The job must belong to Dubbo E-waste", true);
  const { data, error } = await supabase.from("council_pilot_batches").insert({
    job_id: job.id, status: "DRAFT", created_by: user.id,
  }).select("id").single();
  if (error || !data) finish(error?.message || "Could not create pilot batch", true);
  finish("Draft Council pilot created. Upload the five written approval and safety documents before activation.", false, data.id);
}

export async function updatePilotBatch(formData: FormData) {
  const parsed = z.object({
    batch_id: uuid,
    council_reference: z.string().trim().max(200),
    approved_agreement_id: optionalId,
    approval_evidence_id: optionalId,
    insurance_evidence_id: optionalId,
    risk_assessment_evidence_id: optionalId,
    site_evidence_id: optionalId,
    downstream_plan_evidence_id: optionalId,
    status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "CLOSED"]),
    operator_notes: z.string().trim().max(1200).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) finish("Check pilot reference, evidence files and status", true);
  const { supabase, user } = await operator(true);
  const row = parsed.data;
  const { error } = await supabase.from("council_pilot_batches")
    .update({
      council_reference: row.council_reference || null,
      approved_agreement_id: row.approved_agreement_id,
      approval_evidence_id: row.approval_evidence_id,
      insurance_evidence_id: row.insurance_evidence_id,
      risk_assessment_evidence_id: row.risk_assessment_evidence_id,
      site_evidence_id: row.site_evidence_id,
      downstream_plan_evidence_id: row.downstream_plan_evidence_id,
      status: row.status,
      operator_notes: row.operator_notes || null,
      // Preserve the previous authoriser when pausing; sign ACTIVE/CLOSED transitions.
      ...(row.status === "ACTIVE" || row.status === "CLOSED" ? { authorised_by: user.id } : {}),
    }).eq("id", row.batch_id).select("id").single();
  if (error) finish(error.message, true, row.batch_id);
  finish(row.status === "ACTIVE" ? "Pilot activated against uploaded evidence. This is not proof of Council approval." : "Pilot batch saved.", false, row.batch_id);
}

// Retained as an explicit fail-closed redirect for stale links and old clients.
export async function recordPilotCustody(formData: FormData) {
  const id = uuid.safeParse(formData.get("batch_id"));
  if (!id.success) redirect("/council-pilot");
  redirect("/council-pilot/custody?batch="+id.data+"&error="+
    encodeURIComponent("Single-person custody recording is disabled. Create a two-person QR-confirmed transfer."));
}

export async function recordDonationHandover(formData: FormData) {
  const parsed = z.object({
    batch_id: uuid, asset_id: uuid,
    recipient_organisation: z.string().trim().min(3).max(200),
    recipient_name: z.string().trim().min(3).max(160),
    receipt_reference: z.string().trim().min(3).max(200),
    acceptance_evidence_id: uuid,
    condition_disclosure: z.string().trim().min(10).max(3000),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) finish("Enter recipient details, condition disclosure and a signed acceptance file", true);
  const { supabase, user } = await operator();
  const row = parsed.data;
  const { data: asset } = await supabase.from("assets").select("job_id,programme").eq("id", row.asset_id).maybeSingle();
  const { data: batch } = await supabase.from("council_pilot_batches").select("job_id").eq("id", row.batch_id).maybeSingle();
  if (!asset || !batch || asset.job_id !== batch.job_id || asset.programme !== "dubbo_ewaste") {
    finish("Asset is not part of the selected Council batch", true, row.batch_id);
  }
  const { error } = await supabase.from("donation_handoffs").insert({
    asset_id: row.asset_id, recipient_organisation: row.recipient_organisation,
    recipient_name: row.recipient_name, receipt_reference: row.receipt_reference,
    acceptance_evidence_id: row.acceptance_evidence_id,
    condition_disclosure: row.condition_disclosure, acknowledged_at: new Date().toISOString(), created_by: user.id,
  });
  if (error) finish(error.message, true, row.batch_id);
  finish("Recipient acceptance recorded. Confirm the readiness checks before recording DONATE on the asset.", false, row.batch_id);
}


export async function recordPilotTransferAuthority(formData: FormData) {
  const parsed = z.object({
    batch_id: uuid,
    asset_id: uuid,
    authority_type: z.enum(["OWNER_TRANSFER","DONATION","BUSINESS_DISPOSAL_AUTHORITY"]),
    source_party: z.string().trim().min(3).max(200),
    reference: z.string().trim().min(3).max(240),
    evidence_id: uuid,
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) finish("Signed ownership authority, source, and asset-linked document required", true);
  const { supabase, user } = await operator();
  const row = parsed.data;
  const { data: asset } = await supabase.from("assets").select("job_id,programme").eq("id", row.asset_id).maybeSingle();
  const { data: batch } = await supabase.from("council_pilot_batches").select("job_id").eq("id", row.batch_id).maybeSingle();
  if (!asset || !batch || asset.job_id !== batch.job_id || asset.programme !== "dubbo_ewaste") {
    finish("Asset is not part of the Council pilot", true, row.batch_id);
  }
  const { data: evidence } = await supabase.from("evidence").select("id").eq("id", row.evidence_id)
    .eq("entity_type","asset").eq("entity_id",row.asset_id).maybeSingle();
  if (!evidence) finish("Authority document must be uploaded against this specific asset", true, row.batch_id);
  const { error } = await supabase.from("asset_authority_records").insert({
    asset_id: row.asset_id, authority_type: row.authority_type, source_party: row.source_party,
    reference: row.reference, evidence_id: row.evidence_id, created_by: user.id,
  });
  if (error) finish(error.message, true, row.batch_id);
  const { error: flagError } = await supabase.from("assets").update({ownership_verified: true}).eq("id",row.asset_id);
  if (flagError) finish("Document saved, but ownership flag was not updated: "+flagError.message, true,row.batch_id);
  finish("Signed authority linked to this asset. Validate Council's legal transfer terms separately.", false,row.batch_id);
}
