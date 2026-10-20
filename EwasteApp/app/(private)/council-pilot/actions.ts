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
      approval_evidence_id: row.approval_evidence_id,
      insurance_evidence_id: row.insurance_evidence_id,
      risk_assessment_evidence_id: row.risk_assessment_evidence_id,
      site_evidence_id: row.site_evidence_id,
      downstream_plan_evidence_id: row.downstream_plan_evidence_id,
      status: row.status,
      operator_notes: row.operator_notes || null,
      authorised_by: row.status === "ACTIVE" ? user.id : null,
    }).eq("id", row.batch_id).select("id").single();
  if (error) finish(error.message, true, row.batch_id);
  finish(row.status === "ACTIVE" ? "Pilot activated against uploaded evidence. This is not proof of Council approval." : "Pilot batch saved.", false, row.batch_id);
}

export async function recordPilotCustody(formData: FormData) {
  const parsed = z.object({
    batch_id: uuid, asset_id: uuid,
    event_type: z.enum(["COLLECTED", "RECEIVED", "INTERNAL_MOVE", "QUARANTINED", "RETURNED", "HANDOVER"]),
    from_location: z.string().trim().max(240).optional(),
    to_location: z.string().trim().max(240).optional(),
    reference: z.string().trim().min(3).max(240),
    evidence_id: optionalId,
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) finish("Enter asset, custody event and a reference", true);
  const { supabase, user } = await operator();
  const row = parsed.data;
  const { data: asset } = await supabase.from("assets").select("job_id,programme").eq("id", row.asset_id).maybeSingle();
  const { data: batch } = await supabase.from("council_pilot_batches").select("job_id").eq("id", row.batch_id).maybeSingle();
  if (!asset || !batch || asset.job_id !== batch.job_id || asset.programme !== "dubbo_ewaste") {
    finish("Asset is not part of the selected Council batch", true, row.batch_id);
  }
  if (row.event_type === "RECEIVED" && !row.evidence_id) {
    finish("Attach a hashed collection/receiving record to the asset before confirming custody", true, row.batch_id);
  }
  const { error } = await supabase.from("pilot_custody_events").insert({
    asset_id: row.asset_id, event_type: row.event_type,
    from_location: row.from_location || null, to_location: row.to_location || null,
    reference: row.reference, evidence_id: row.evidence_id, created_by: user.id,
  });
  if (error) finish(error.message, true, row.batch_id);
  finish("Append-only custody event recorded.", false, row.batch_id);
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
