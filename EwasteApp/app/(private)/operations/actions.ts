"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

async function currentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

async function appendEvent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  actorId: string,
  entityType: string,
  entityId: string,
  eventType: string,
  details: Record<string, unknown> = {},
) {
  await supabase.from("operational_events").insert({
    entity_type: entityType,
    entity_id: entityId,
    event_type: eventType,
    actor_id: actorId,
    details,
  });
}

const optionalUuid = z.preprocess((v) => v === "" || v == null ? undefined : v, z.string().uuid().optional());

export async function createCustomer(formData: FormData) {
  const schema = z.object({
    name: z.string().trim().min(2).max(200),
    contact_name: z.string().trim().max(160).optional(),
    contact_email: z.string().trim().email().optional().or(z.literal("")),
    contact_phone: z.string().trim().max(80).optional(),
    notes: z.string().trim().max(4000).optional(),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/customers?error=Please%20check%20the%20customer%20fields");
  const { supabase, user } = await currentUser();
  const { data, error } = await supabase.from("customers").insert({
    ...parsed.data,
    contact_email: parsed.data.contact_email || null,
    contact_name: parsed.data.contact_name || null,
    contact_phone: parsed.data.contact_phone || null,
    notes: parsed.data.notes || null,
    created_by: user.id,
  }).select("id").single();
  if (error || !data) redirect("/customers?error=Could%20not%20create%20customer");
  await appendEvent(supabase, user.id, "customer", data.id, "CUSTOMER_CREATED", { name: parsed.data.name });
  revalidatePath("/customers");
  redirect("/customers?success=Customer%20created");
}

export async function createLocation(formData: FormData) {
  const schema = z.object({
    name: z.string().trim().min(2).max(160),
    kind: z.enum(["SITE","ZONE","SHELF","BENCH","QUARANTINE","OTHER"]),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/locations?error=Please%20check%20the%20location%20fields");
  const { supabase, user } = await currentUser();
  const { data, error } = await supabase.from("locations").insert({
    name: parsed.data.name,
    kind: parsed.data.kind,
    created_by: user.id,
  }).select("id").single();
  if (error || !data) redirect("/locations?error=Could%20not%20create%20location");
  await appendEvent(supabase, user.id, "location", data.id, "LOCATION_CREATED", { name: parsed.data.name });
  revalidatePath("/locations");
  redirect("/locations?success=Location%20created");
}

export async function createJob(formData: FormData) {
  const schema = z.object({
    customer_id: optionalUuid,
    source_site: z.string().trim().max(200).optional(),
    contact_name: z.string().trim().max(160).optional(),
    status: z.enum(["DRAFT","SCHEDULED","DELIVERED","PARTIALLY_RECEIVED","RECEIVED","PROCESSING","READY_TO_CLOSE","CLOSED","CANCELLED"]),
    expected_asset_count: z.preprocess(v => v === "" ? undefined : Number(v), z.number().int().nonnegative().optional()),
    expected_weight_kg: z.preprocess(v => v === "" ? undefined : Number(v), z.number().nonnegative().optional()),
    work_instructions: z.string().trim().max(6000).optional(),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/jobs/new?error=Please%20check%20the%20job%20fields");
  const { supabase, user } = await currentUser();
  const { data, error } = await supabase.from("jobs").insert({
    ...parsed.data,
    customer_id: parsed.data.customer_id || null,
    source_site: parsed.data.source_site || null,
    contact_name: parsed.data.contact_name || null,
    work_instructions: parsed.data.work_instructions || null,
    created_by: user.id,
  }).select("id,job_code").single();
  if (error || !data) redirect("/jobs/new?error=Could%20not%20create%20job");
  await appendEvent(supabase, user.id, "job", data.id, "JOB_CREATED", { job_code: data.job_code });
  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  redirect(`/jobs/${data.id}`);
}

export async function createLot(formData: FormData) {
  const schema = z.object({
    job_id: optionalUuid,
    commodity: z.string().trim().min(2).max(200),
    gross_weight_kg: z.preprocess(v => v === "" ? undefined : Number(v), z.number().nonnegative().optional()),
    tare_weight_kg: z.preprocess(v => v === "" ? undefined : Number(v), z.number().nonnegative().optional()),
    item_count: z.preprocess(v => v === "" ? undefined : Number(v), z.number().int().nonnegative().optional()),
    location_id: optionalUuid,
    notes: z.string().trim().max(4000).optional(),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/lots?error=Please%20check%20the%20lot%20fields");
  const { supabase, user } = await currentUser();
  const { data, error } = await supabase.from("lots").insert({
    ...parsed.data,
    job_id: parsed.data.job_id || null,
    location_id: parsed.data.location_id || null,
    notes: parsed.data.notes || null,
    created_by: user.id,
  }).select("id,lot_code").single();
  if (error || !data) redirect("/lots?error=Could%20not%20create%20lot");
  await appendEvent(supabase, user.id, "lot", data.id, "LOT_CREATED", { lot_code: data.lot_code });
  revalidatePath("/lots");
  revalidatePath("/dashboard");
  redirect("/lots?success=Lot%20created");
}

export async function recordTest(formData: FormData) {
  const schema = z.object({
    asset_id: z.string().uuid(),
    test_type: z.string().trim().min(2).max(120),
    result: z.enum(["PASS","FAIL","NOT_PRESENT","NOT_TESTED","REVIEW"]),
    notes: z.string().trim().max(2000).optional(),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/assets");
  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("asset_tests").insert({
    asset_id: parsed.data.asset_id,
    test_type: parsed.data.test_type,
    result: parsed.data.result,
    notes: parsed.data.notes || null,
    created_by: user.id,
  });
  if (!error) await appendEvent(supabase, user.id, "asset", parsed.data.asset_id, "TEST_RECORDED", {
    test_type: parsed.data.test_type,
    result: parsed.data.result,
  });
  revalidatePath(`/assets/${parsed.data.asset_id}`);
  redirect(`/assets/${parsed.data.asset_id}`);
}

export async function recordDisposition(formData: FormData) {
  const schema = z.object({
    asset_id: z.string().uuid(),
    disposition_type: z.enum(["REFURBISH","SELL","DONATE","PARTS","RECYCLE","RETURN","HOLD","REJECT"]),
    destination: z.string().trim().max(240).optional(),
    notes: z.string().trim().max(3000).optional(),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/assets");
  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("dispositions").insert({
    asset_id: parsed.data.asset_id,
    disposition_type: parsed.data.disposition_type,
    destination: parsed.data.destination || null,
    notes: parsed.data.notes || null,
    decided_by: user.id,
  });
  if (!error) {
    const statusMap: Record<string,string> = {
      REFURBISH: "TRIAGE", SELL: "READY_FOR_SALE", DONATE: "DONATED", PARTS: "PARTS",
      RECYCLE: "RECYCLED", RETURN: "HOLD", HOLD: "HOLD", REJECT: "REJECTED",
    };
    await supabase.from("assets").update({ status: statusMap[parsed.data.disposition_type] }).eq("id", parsed.data.asset_id);
    await appendEvent(supabase, user.id, "asset", parsed.data.asset_id, "DISPOSITION_RECORDED", parsed.data);
  }
  revalidatePath(`/assets/${parsed.data.asset_id}`);
  revalidatePath("/dashboard");
  redirect(`/assets/${parsed.data.asset_id}`);
}

export async function issueCertificate(formData: FormData) {
  const schema = z.object({
    asset_id: z.string().uuid(),
    certificate_type: z.enum(["RECEIPT","DISPOSITION","DEVICE_HISTORY"]),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/certificates");
  const { supabase, user } = await currentUser();

  const [{ data: asset }, { data: tests }, { data: dispositions }] = await Promise.all([
    supabase.from("assets").select("*").eq("id", parsed.data.asset_id).single(),
    supabase.from("asset_tests").select("test_type,result,notes,created_at").eq("asset_id", parsed.data.asset_id).order("created_at"),
    supabase.from("dispositions").select("disposition_type,destination,notes,decided_at").eq("asset_id", parsed.data.asset_id).order("decided_at", { ascending: false }).limit(1),
  ]);
  if (!asset) redirect("/certificates?error=Asset%20not%20found");

  const snapshot = {
    generated_at: new Date().toISOString(),
    asset,
    tests: tests ?? [],
    disposition: dispositions?.[0] ?? null,
  };
  const { data, error } = await supabase.from("certificates").insert({
    certificate_type: parsed.data.certificate_type,
    asset_id: asset.id,
    job_id: asset.job_id,
    snapshot,
    issued_by: user.id,
  }).select("id,certificate_code").single();
  if (error || !data) redirect(`/assets/${asset.id}?error=Could%20not%20issue%20certificate`);
  await appendEvent(supabase, user.id, "asset", asset.id, "CERTIFICATE_ISSUED", {
    certificate_code: data.certificate_code,
    certificate_type: parsed.data.certificate_type,
  });
  revalidatePath("/certificates");
  redirect(`/certificates/${data.id}`);
}
