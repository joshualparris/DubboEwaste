"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { buildAssetWorkflowContext, workflowMatches } from "@/lib/workflow";

const optionalUuid = z.preprocess((v) => v === "" || v == null ? undefined : v, z.string().uuid().optional());
const optionalNumber = z.preprocess((v) => v === "" || v == null ? undefined : Number(v), z.number().optional());
const optionalInt = z.preprocess((v) => v === "" || v == null ? undefined : Number(v), z.number().int().optional());

async function currentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

async function event(entityType: string, entityId: string, eventType: string, details: Record<string, unknown> = {}) {
  const { supabase, user } = await currentUser();
  await supabase.from("operational_events").insert({
    entity_type: entityType,
    entity_id: entityId,
    event_type: eventType,
    actor_id: user.id,
    details,
  });
}

export async function addAssetAttribute(formData: FormData) {
  const parsed = z.object({
    asset_id: z.string().uuid(),
    attribute_key: z.string().trim().min(1).max(100),
    attribute_value: z.string().trim().max(1000).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/assets");
  const { supabase, user } = await currentUser();
  await supabase.from("asset_attributes").upsert({
    asset_id: parsed.data.asset_id,
    attribute_key: parsed.data.attribute_key,
    attribute_value: parsed.data.attribute_value || null,
    source: "MANUAL",
    created_by: user.id,
  }, { onConflict: "asset_id,attribute_key" });
  await event("asset", parsed.data.asset_id, "ATTRIBUTE_RECORDED", { key: parsed.data.attribute_key });
  revalidatePath(`/assets/${parsed.data.asset_id}`);
}

export async function addMedia(formData: FormData) {
  const parsed = z.object({
    asset_id: z.string().uuid(),
    media_type: z.enum(["HDD","SATA_SSD","NVME","EMMC_UFS","USB","SD","TAPE","OTHER"]),
    manufacturer: z.string().trim().max(100).optional(),
    model: z.string().trim().max(160).optional(),
    serial: z.string().trim().max(160).optional(),
    capacity_gb: optionalNumber,
    interface: z.string().trim().max(80).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/assets");
  const { supabase, user } = await currentUser();
  const { data } = await supabase.from("media").insert({
    parent_asset_id: parsed.data.asset_id,
    origin_asset_id: parsed.data.asset_id,
    media_type: parsed.data.media_type,
    manufacturer: parsed.data.manufacturer || null,
    model: parsed.data.model || null,
    serial: parsed.data.serial || null,
    capacity_bytes: parsed.data.capacity_gb == null ? null : Math.round(parsed.data.capacity_gb * 1_000_000_000),
    interface: parsed.data.interface || null,
    created_by: user.id,
  }).select("id,media_code").single();
  if (data) await event("asset", parsed.data.asset_id, "MEDIA_DISCOVERED", { media_id: data.id, media_code: data.media_code });
  revalidatePath(`/assets/${parsed.data.asset_id}`);
  revalidatePath("/media");
}

export async function createSanitisationPolicy(formData: FormData) {
  const parsed = z.object({
    name: z.string().trim().min(2).max(120),
    standard: z.string().trim().min(2).max(160),
    method: z.string().trim().min(2).max(160),
    max_retries: optionalInt,
    fallback_route: z.string().trim().max(120).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/media?error=Check%20policy%20fields");
  const { supabase, user } = await currentUser();
  await supabase.from("sanitisation_policies").insert({
    name: parsed.data.name,
    standard: parsed.data.standard,
    method: parsed.data.method,
    max_retries: parsed.data.max_retries ?? 1,
    fallback_route: parsed.data.fallback_route || "SUPERVISOR_REVIEW",
    created_by: user.id,
  });
  revalidatePath("/media");
}

export async function createDeploymentProfile(formData: FormData) {
  const parsed = z.object({
    name: z.string().trim().min(2).max(120),
    provider: z.enum(["BLANCCO", "SERVICE_NOW", "MICROSOFT_ENDPOINT_MANAGER", "PXE_NETBOOT", "OTHER"]),
    package_reference: z.string().trim().max(500).optional(),
    command_reference: z.string().trim().max(1000).optional(),
    target_environment: z.string().trim().max(240).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/processing?error=Check%20deployment%20profile%20fields");
  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("deployment_profiles").insert({
    ...parsed.data,
    package_reference: parsed.data.package_reference || null,
    command_reference: parsed.data.command_reference || null,
    target_environment: parsed.data.target_environment || null,
    created_by: user.id,
  });
  if (error) redirect("/processing?error=Could%20not%20save%20deployment%20profile");
  revalidatePath("/processing");
}

export async function planDeploymentRun(formData: FormData) {
  const parsed = z.object({ profile_id: z.string().uuid(), asset_id: optionalUuid, job_id: optionalUuid, notes: z.string().trim().max(2000).optional() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/processing?error=Check%20deployment%20run%20fields");
  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("deployment_runs").insert({
    profile_id: parsed.data.profile_id,
    asset_id: parsed.data.asset_id || null,
    job_id: parsed.data.job_id || null,
    requested_by: user.id,
    notes: parsed.data.notes || null,
  });
  if (error) redirect("/processing?error=Could%20not%20plan%20deployment");
  revalidatePath("/processing");
}

export async function recordSanitisation(formData: FormData) {
  const parsed = z.object({
    media_id: z.string().uuid(),
    asset_id: optionalUuid,
    policy_id: optionalUuid,
    status: z.enum(["NOT_REQUIRED","QUEUED","RUNNING","VERIFYING","PASSED","FAILED","RETRY","DESTRUCTION_REQUIRED","DESTROYED","SUPERVISOR_REVIEW"]),
    tool_name: z.string().trim().max(120).optional(),
    tool_version: z.string().trim().max(80).optional(),
    method: z.string().trim().max(160).optional(),
    verification_result: z.string().trim().max(160).optional(),
    standard: z.string().trim().max(160).optional(),
    operation: z.string().trim().max(160).optional(),
    report_format: z.enum(["PDF", "XML", "JSON", "CSV", "TEXT", "OTHER"]).optional(),
    freeze_lock_state: z.enum(["UNKNOWN", "NOT_PRESENT", "PRESENT", "CLEARED", "UNABLE_TO_CLEAR"]).optional(),
    hpa_state: z.enum(["NOT_CHECKED", "NOT_PRESENT", "PRESENT", "REMOVED", "UNABLE_TO_CHECK"]).optional(),
    dco_state: z.enum(["NOT_CHECKED", "NOT_PRESENT", "PRESENT", "REMOVED", "UNABLE_TO_CHECK"]).optional(),
    opal_state: z.enum(["UNKNOWN", "NOT_PRESENT", "LOCKED", "UNLOCKED", "PSID_REQUIRED", "UNABLE_TO_CHECK"]).optional(),
    raw_report_hash: z.string().trim().max(128).optional(),
    workstation: z.string().trim().max(120).optional(),
    notes: z.string().trim().max(2000).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/media?error=Check%20sanitisation%20fields");
  const { supabase, user } = await currentUser();

  const preflight = {
    freeze_lock_state: parsed.data.freeze_lock_state || "UNKNOWN",
    hpa_state: parsed.data.hpa_state || "NOT_CHECKED",
    dco_state: parsed.data.dco_state || "NOT_CHECKED",
    opal_state: parsed.data.opal_state || "UNKNOWN",
  };
  if (parsed.data.asset_id) {
    await supabase.from("media").update({
      freeze_lock_state: preflight.freeze_lock_state,
      hpa_state: preflight.hpa_state,
      dco_state: preflight.dco_state,
      opal_state: preflight.opal_state,
    }).eq("id", parsed.data.media_id);
  }

  const { data: evidence } = await supabase.from("evidence")
    .select("id,sha256")
    .eq("entity_type", "media")
    .eq("entity_id", parsed.data.media_id)
    .order("captured_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const terminal = ["PASSED","FAILED","DESTROYED","NOT_REQUIRED"].includes(parsed.data.status);
  await supabase.from("sanitisation_tasks").insert({
    media_id: parsed.data.media_id,
    policy_id: parsed.data.policy_id || null,
    status: parsed.data.status,
    tool_name: parsed.data.tool_name || null,
    tool_version: parsed.data.tool_version || null,
    method: parsed.data.method || null,
    standard: parsed.data.standard || null,
    operation: parsed.data.operation || null,
    verification_result: parsed.data.verification_result || null,
    report_format: parsed.data.report_format || null,
    preflight_snapshot: preflight,
    capability_snapshot: { recorded_by_operator: true, interface_checks: ["SATA", "SCSI", "SAS", "USB", "NVMe", "OPAL"] },
    raw_report_hash: parsed.data.raw_report_hash || evidence?.sha256 || null,
    report_evidence_id: evidence?.id || null,
    operator_id: user.id,
    workstation: parsed.data.workstation || null,
    notes: parsed.data.notes || null,
    started_at: parsed.data.status === "RUNNING" ? new Date().toISOString() : null,
    completed_at: terminal ? new Date().toISOString() : null,
  });

  if (parsed.data.status === "PASSED") {
    await supabase.from("media").update({ data_state: "VERIFIED_CLEARED" }).eq("id", parsed.data.media_id);
  } else if (parsed.data.status === "FAILED") {
    await supabase.from("media").update({ data_state: "SANITISATION_FAILED" }).eq("id", parsed.data.media_id);
    await supabase.from("exceptions").insert({
      entity_type: "media",
      entity_id: parsed.data.media_id,
      exception_type: "WIPE_FAILURE",
      severity: "HIGH",
      summary: "Sanitisation failed and requires retry, fallback or supervisor review.",
      created_by: user.id,
    });
  } else if (parsed.data.status === "RUNNING" || parsed.data.status === "VERIFYING" || parsed.data.status === "RETRY") {
    await supabase.from("media").update({ data_state: "SANITISATION_IN_PROGRESS" }).eq("id", parsed.data.media_id);
  }

  if (parsed.data.asset_id) {
    const { data: mediaStates } = await supabase.from("media").select("data_state").eq("parent_asset_id", parsed.data.asset_id);
    if (mediaStates?.length && mediaStates.every((m) => ["VERIFIED_CLEARED","NON_DATA_BEARING"].includes(m.data_state))) {
      await supabase.from("assets").update({ data_state: "VERIFIED_CLEARED", status: "DIAGNOSTICS" }).eq("id", parsed.data.asset_id);
    }
    await event("asset", parsed.data.asset_id, "SANITISATION_RECORDED", { media_id: parsed.data.media_id, status: parsed.data.status });
    revalidatePath(`/assets/${parsed.data.asset_id}`);
  }
  revalidatePath("/media");
  revalidatePath("/exceptions");
}

export async function recordGrade(formData: FormData) {
  const parsed = z.object({
    asset_id: z.string().uuid(),
    functional_grade: z.string().trim().max(40).optional(),
    cosmetic_grade: z.string().trim().max(40).optional(),
    battery_grade: z.string().trim().max(40).optional(),
    completeness_grade: z.string().trim().max(40).optional(),
    marketability_grade: z.string().trim().max(40).optional(),
    final_grade: z.string().trim().min(1).max(40),
    override_reason: z.string().trim().max(1000).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/assets");
  const { supabase, user } = await currentUser();
  await supabase.from("grades").insert({
    ...parsed.data,
    calculated_grade: parsed.data.final_grade,
    override_reason: parsed.data.override_reason || null,
    graded_by: user.id,
  });
  await event("asset", parsed.data.asset_id, "ASSET_GRADED", { final_grade: parsed.data.final_grade });
  revalidatePath(`/assets/${parsed.data.asset_id}`);
}

export async function createException(formData: FormData) {
  const parsed = z.object({
    entity_type: z.string().trim().min(1).max(60),
    entity_id: z.string().uuid(),
    exception_type: z.string().trim().min(2).max(100),
    severity: z.enum(["LOW","MEDIUM","HIGH","CRITICAL"]),
    summary: z.string().trim().min(2).max(2000),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/exceptions");
  const { supabase, user } = await currentUser();
  await supabase.from("exceptions").insert({ ...parsed.data, created_by: user.id });
  await event(parsed.data.entity_type, parsed.data.entity_id, "EXCEPTION_OPENED", {
    type: parsed.data.exception_type,
    severity: parsed.data.severity,
  });
  revalidatePath("/exceptions");
  if (parsed.data.entity_type === "asset") revalidatePath(`/assets/${parsed.data.entity_id}`);
}

export async function resolveException(formData: FormData) {
  const parsed = z.object({
    exception_id: z.string().uuid(),
    resolution: z.string().trim().min(2).max(3000),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/exceptions");
  const { supabase } = await currentUser();
  await supabase.from("exceptions").update({
    status: "RESOLVED",
    resolution: parsed.data.resolution,
    resolved_at: new Date().toISOString(),
  }).eq("id", parsed.data.exception_id);
  revalidatePath("/exceptions");
}

export async function createRepair(formData: FormData) {
  const parsed = z.object({
    asset_id: z.string().uuid(),
    diagnosis: z.string().trim().min(2).max(3000),
    estimated_labour_minutes: optionalInt,
    estimated_parts_cost: optionalNumber,
    expected_value_uplift: optionalNumber,
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/repairs");
  const { supabase, user } = await currentUser();
  await supabase.from("repairs").insert({
    ...parsed.data,
    created_by: user.id,
    technician_id: user.id,
  });
  await supabase.from("assets").update({ status: "REPAIR" }).eq("id", parsed.data.asset_id);
  await event("asset", parsed.data.asset_id, "REPAIR_OPENED", { diagnosis: parsed.data.diagnosis });
  revalidatePath("/repairs");
  revalidatePath(`/assets/${parsed.data.asset_id}`);
}

export async function harvestPart(formData: FormData) {
  const parsed = z.object({
    asset_id: z.string().uuid(),
    part_type: z.string().trim().min(2).max(120),
    manufacturer: z.string().trim().max(100).optional(),
    model: z.string().trim().max(160).optional(),
    serial: z.string().trim().max(160).optional(),
    specification: z.string().trim().max(1000).optional(),
    test_status: z.string().trim().max(80).optional(),
    grade: z.string().trim().max(40).optional(),
    estimated_value: optionalNumber,
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/repairs");
  const { supabase, user } = await currentUser();
  const { data: asset } = await supabase.from("assets").select("job_id,customer_id").eq("id", parsed.data.asset_id).single();
  const { data } = await supabase.from("parts").insert({
    origin_asset_id: parsed.data.asset_id,
    origin_job_id: asset?.job_id || null,
    origin_customer_id: asset?.customer_id || null,
    part_type: parsed.data.part_type,
    manufacturer: parsed.data.manufacturer || null,
    model: parsed.data.model || null,
    serial: parsed.data.serial || null,
    specification: parsed.data.specification || null,
    test_status: parsed.data.test_status || null,
    grade: parsed.data.grade || null,
    estimated_value: parsed.data.estimated_value ?? null,
    created_by: user.id,
  }).select("part_code").single();
  await event("asset", parsed.data.asset_id, "PART_HARVESTED", { part_code: data?.part_code, part_type: parsed.data.part_type });
  revalidatePath("/repairs");
  revalidatePath(`/assets/${parsed.data.asset_id}`);
}

export async function createPallet(formData: FormData) {
  const parsed = z.object({
    container_type: z.string().trim().min(2).max(80),
    tare_weight_kg: z.preprocess((v) => v === "" ? 0 : Number(v), z.number().nonnegative()),
    location_id: optionalUuid,
    customer_id: optionalUuid,
    hazardous: z.enum(["yes","no"]),
    seal: z.string().trim().max(100).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/recycling?error=Check%20pallet%20fields");
  const { supabase, user } = await currentUser();
  await supabase.from("pallets").insert({
    container_type: parsed.data.container_type,
    tare_weight_kg: parsed.data.tare_weight_kg,
    location_id: parsed.data.location_id || null,
    customer_id: parsed.data.customer_id || null,
    hazardous: parsed.data.hazardous === "yes",
    seal: parsed.data.seal || null,
    created_by: user.id,
  });
  revalidatePath("/recycling");
}

export async function createDownstreamVendor(formData: FormData) {
  const parsed = z.object({
    name: z.string().trim().min(2).max(200),
    abn: z.string().trim().max(40).optional(),
    contact_name: z.string().trim().max(160).optional(),
    email: z.string().trim().max(200).optional(),
    phone: z.string().trim().max(80).optional(),
    address: z.string().trim().max(500).optional(),
    capabilities: z.string().trim().max(3000).optional(),
    evidence_requirements: z.string().trim().max(3000).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/recycling?error=Check%20vendor%20fields");
  const { supabase, user } = await currentUser();
  await supabase.from("downstream_vendors").insert({ ...parsed.data, created_by: user.id });
  revalidatePath("/recycling");
}

export async function createOutboundOrder(formData: FormData) {
  const parsed = z.object({
    vendor_id: optionalUuid,
    destination: z.string().trim().max(500).optional(),
    carrier: z.string().trim().max(200).optional(),
    bol_reference: z.string().trim().max(160).optional(),
    expected_weight_kg: optionalNumber,
    notes: z.string().trim().max(3000).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/recycling?error=Check%20outbound%20fields");
  const { supabase, user } = await currentUser();
  await supabase.from("outbound_orders").insert({
    vendor_id: parsed.data.vendor_id || null,
    destination: parsed.data.destination || null,
    carrier: parsed.data.carrier || null,
    bol_reference: parsed.data.bol_reference || null,
    expected_weight_kg: parsed.data.expected_weight_kg ?? null,
    notes: parsed.data.notes || null,
    created_by: user.id,
  });
  revalidatePath("/recycling");
}

export async function createResaleListing(formData: FormData) {
  const parsed = z.object({
    asset_id: z.string().uuid(),
    sku: z.string().trim().min(2).max(120),
    channel: z.string().trim().max(100).optional(),
    title: z.string().trim().min(2).max(250),
    description: z.string().trim().max(5000).optional(),
    asking_price: z.preprocess((v) => Number(v), z.number().nonnegative()),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/resale?error=Check%20listing%20fields");
  const { supabase, user } = await currentUser();
  const [{ data: asset }, { data: grade }] = await Promise.all([
    supabase.from("assets").select("ownership_verified,data_state,status").eq("id", parsed.data.asset_id).single(),
    supabase.from("grades").select("final_grade").eq("asset_id", parsed.data.asset_id).order("graded_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (!asset?.ownership_verified || !["VERIFIED_CLEARED","NON_DATA_BEARING"].includes(asset.data_state) || !grade?.final_grade) {
    redirect("/resale?error=Asset%20does%20not%20pass%20the%20resale%20qualification%20gate");
  }
  await supabase.from("resale_listings").insert({
    ...parsed.data,
    channel: parsed.data.channel || null,
    description: parsed.data.description || null,
    status: "QUALIFIED",
    created_by: user.id,
  });
  await supabase.from("assets").update({ status: "READY_FOR_SALE" }).eq("id", parsed.data.asset_id);
  await event("asset", parsed.data.asset_id, "RESALE_QUALIFIED", { sku: parsed.data.sku });
  revalidatePath("/resale");
  revalidatePath(`/assets/${parsed.data.asset_id}`);
}

export async function recordSale(formData: FormData) {
  const parsed = z.object({
    listing_id: z.string().uuid(),
    sold_price: z.preprocess((v) => Number(v), z.number().nonnegative()),
    fees: z.preprocess((v) => v === "" ? 0 : Number(v), z.number().nonnegative()),
    freight: z.preprocess((v) => v === "" ? 0 : Number(v), z.number().nonnegative()),
    channel_order_id: z.string().trim().max(160).optional(),
    tracking: z.string().trim().max(200).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/resale?error=Check%20sale%20fields");
  const { supabase, user } = await currentUser();
  const { data: listing } = await supabase.from("resale_listings").select("asset_id").eq("id", parsed.data.listing_id).single();
  if (!listing) redirect("/resale?error=Listing%20not%20found");
  await supabase.from("sales").insert({
    listing_id: parsed.data.listing_id,
    asset_id: listing.asset_id,
    sold_price: parsed.data.sold_price,
    fees: parsed.data.fees,
    freight: parsed.data.freight,
    channel_order_id: parsed.data.channel_order_id || null,
    tracking: parsed.data.tracking || null,
    created_by: user.id,
  });
  await supabase.from("resale_listings").update({ status: "SOLD" }).eq("id", parsed.data.listing_id);
  await supabase.from("assets").update({ status: "SOLD" }).eq("id", listing.asset_id);
  await event("asset", listing.asset_id, "SOLD", { sold_price: parsed.data.sold_price });
  revalidatePath("/resale");
  revalidatePath(`/assets/${listing.asset_id}`);
}

export async function createWorkflowRule(formData: FormData) {
  const parsed = z.object({
    name: z.string().trim().min(2).max(160),
    priority: z.preprocess((v) => Number(v), z.number().int()),
    conditions: z.string().trim().min(2),
    action: z.string().trim().min(2),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/processing?error=Invalid%20workflow%20rule");
  let conditions: unknown;
  let action: unknown;
  try {
    conditions = JSON.parse(parsed.data.conditions);
    action = JSON.parse(parsed.data.action);
  } catch {
    redirect("/processing?error=Workflow%20conditions%20and%20action%20must%20be%20valid%20JSON");
  }
  const { supabase, user } = await currentUser();
  await supabase.from("workflow_rules").insert({
    name: parsed.data.name,
    priority: parsed.data.priority,
    conditions,
    action,
    created_by: user.id,
  });
  revalidatePath("/processing");
}

export async function createWorkstation(formData: FormData) {
  const parsed = z.object({
    name: z.string().trim().min(2).max(160),
    profile_type: z.enum(["RECEIVING","WIPE","DIAGNOSTICS","REPAIR","GRADING","PARTS","OTHER"]),
    location_id: optionalUuid,
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/processing?error=Invalid%20workstation");
  const { supabase, user } = await currentUser();
  await supabase.from("workstations").insert({
    name: parsed.data.name,
    profile_type: parsed.data.profile_type,
    location_id: parsed.data.location_id || null,
    created_by: user.id,
  });
  revalidatePath("/processing");
}

export async function createEnvironmentalMethodology(formData: FormData) {
  const parsed = z.object({
    name: z.string().trim().min(2).max(160),
    version: z.string().trim().min(1).max(80),
    description: z.string().trim().min(5).max(4000),
    source_url: z.string().trim().max(1000).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/reports?error=Check%20methodology%20fields");
  const { supabase, user } = await currentUser();
  await supabase.from("environmental_methodologies").insert({
    ...parsed.data,
    source_url: parsed.data.source_url || null,
    created_by: user.id,
  });
  revalidatePath("/reports");
}


export async function createDefectTemplate(formData: FormData) {
  const parsed = z.object({
    name: z.string().trim().min(2).max(160),
    category: z.string().trim().max(80).optional(),
    severity: z.enum(["COSMETIC","MINOR","MAJOR","CRITICAL"]),
    grade_penalty: z.preprocess((v) => v === "" ? 0 : Number(v), z.number().int().nonnegative()),
    value_penalty_fixed: z.preprocess((v) => v === "" ? 0 : Number(v), z.number().nonnegative()),
    value_penalty_percent: z.preprocess((v) => v === "" ? 0 : Number(v), z.number().min(0).max(100)),
    route_override: z.string().trim().max(80).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/processing?error=Check%20defect%20template%20fields");
  const { supabase, user } = await currentUser();
  await supabase.from("defect_templates").insert({
    ...parsed.data,
    category: parsed.data.category || null,
    route_override: parsed.data.route_override || null,
    created_by: user.id,
  });
  revalidatePath("/processing");
}


export async function updateWorkflowRule(formData: FormData) {
  const parsed = z.object({
    rule_id: z.string().uuid(),
    name: z.string().trim().min(2).max(160),
    priority: z.preprocess((v) => Number(v), z.number().int()),
    conditions: z.string().trim().min(2),
    action: z.string().trim().min(2),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/processing?error=Invalid%20workflow%20rule%20update");

  let conditions: unknown;
  let action: unknown;
  try {
    conditions = JSON.parse(parsed.data.conditions);
    action = JSON.parse(parsed.data.action);
  } catch {
    redirect("/processing?error=Workflow%20conditions%20and%20action%20must%20be%20valid%20JSON");
  }

  const { supabase, user } = await currentUser();
  const enabled = formData.get("enabled") === "on";
  const { error } = await supabase.from("workflow_rules").update({
    name: parsed.data.name,
    priority: parsed.data.priority,
    conditions,
    action,
    enabled,
  }).eq("id", parsed.data.rule_id);

  if (error) redirect("/processing?error=" + encodeURIComponent(error.message));

  await supabase.from("operational_events").insert({
    entity_type: "workflow_rule",
    entity_id: parsed.data.rule_id,
    event_type: "WORKFLOW_RULE_UPDATED",
    actor_id: user.id,
    details: { name: parsed.data.name, priority: parsed.data.priority, enabled },
  });

  revalidatePath("/processing");
  redirect("/processing?success=Workflow%20rule%20updated");
}

export async function deleteWorkflowRule(formData: FormData) {
  const parsed = z.object({ rule_id: z.string().uuid() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/processing?error=Invalid%20workflow%20rule");

  const { supabase } = await currentUser();
  const { error } = await supabase.from("workflow_rules").delete().eq("id", parsed.data.rule_id);
  if (error) redirect("/processing?error=" + encodeURIComponent(error.message));

  revalidatePath("/processing");
  redirect("/processing?success=Workflow%20rule%20deleted");
}

export async function updateWorkstation(formData: FormData) {
  const parsed = z.object({
    workstation_id: z.string().uuid(),
    name: z.string().trim().min(2).max(160),
    profile_type: z.enum(["RECEIVING","WIPE","DIAGNOSTICS","REPAIR","GRADING","PARTS","OTHER"]),
    location_id: optionalUuid,
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/processing?error=Invalid%20workstation%20update");

  const { supabase, user } = await currentUser();
  const active = formData.get("active") === "on";
  const { error } = await supabase.from("workstations").update({
    name: parsed.data.name,
    profile_type: parsed.data.profile_type,
    location_id: parsed.data.location_id || null,
    active,
  }).eq("id", parsed.data.workstation_id);

  if (error) redirect("/processing?error=" + encodeURIComponent(error.message));

  await supabase.from("operational_events").insert({
    entity_type: "workstation",
    entity_id: parsed.data.workstation_id,
    event_type: "WORKSTATION_UPDATED",
    actor_id: user.id,
    details: { name: parsed.data.name, profile_type: parsed.data.profile_type, active },
  });

  revalidatePath("/processing");
  redirect("/processing?success=Workstation%20updated");
}

export async function deleteWorkstation(formData: FormData) {
  const parsed = z.object({ workstation_id: z.string().uuid() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/processing?error=Invalid%20workstation");

  const { supabase } = await currentUser();
  const { error } = await supabase.from("workstations").delete().eq("id", parsed.data.workstation_id);
  if (error) redirect("/processing?error=" + encodeURIComponent(error.message));

  revalidatePath("/processing");
  redirect("/processing?success=Workstation%20deleted");
}

export async function updateDefectTemplate(formData: FormData) {
  const parsed = z.object({
    template_id: z.string().uuid(),
    name: z.string().trim().min(2).max(160),
    category: z.string().trim().max(80).optional(),
    severity: z.enum(["COSMETIC","MINOR","MAJOR","CRITICAL"]),
    grade_penalty: z.preprocess((v) => v === "" ? 0 : Number(v), z.number().int().nonnegative()),
    value_penalty_fixed: z.preprocess((v) => v === "" ? 0 : Number(v), z.number().nonnegative()),
    value_penalty_percent: z.preprocess((v) => v === "" ? 0 : Number(v), z.number().min(0).max(100)),
    route_override: z.string().trim().max(80).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/processing?error=Check%20defect%20template%20fields");

  const { supabase, user } = await currentUser();
  const active = formData.get("active") === "on";
  const { error } = await supabase.from("defect_templates").update({
    name: parsed.data.name,
    category: parsed.data.category || null,
    severity: parsed.data.severity,
    grade_penalty: parsed.data.grade_penalty,
    value_penalty_fixed: parsed.data.value_penalty_fixed,
    value_penalty_percent: parsed.data.value_penalty_percent,
    route_override: parsed.data.route_override || null,
    active,
  }).eq("id", parsed.data.template_id);

  if (error) redirect("/processing?error=" + encodeURIComponent(error.message));

  await supabase.from("operational_events").insert({
    entity_type: "defect_template",
    entity_id: parsed.data.template_id,
    event_type: "DEFECT_TEMPLATE_UPDATED",
    actor_id: user.id,
    details: { name: parsed.data.name, severity: parsed.data.severity, active },
  });

  revalidatePath("/processing");
  redirect("/processing?success=Defect%20template%20updated");
}

export async function deleteDefectTemplate(formData: FormData) {
  const parsed = z.object({ template_id: z.string().uuid() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/processing?error=Invalid%20defect%20template");

  const { supabase } = await currentUser();
  const { error } = await supabase.from("defect_templates").delete().eq("id", parsed.data.template_id);
  if (error) redirect("/processing?error=" + encodeURIComponent(error.message));

  revalidatePath("/processing");
  redirect("/processing?success=Defect%20template%20deleted");
}

export async function applyDefect(formData: FormData) {
  const parsed = z.object({
    asset_id: z.string().uuid(),
    template_id: z.string().uuid(),
    reference_value: z.preprocess((v) => v === "" ? 0 : Number(v), z.number().nonnegative()),
    description: z.string().trim().max(2000).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/assets");

  const { supabase, user } = await currentUser();
  const { data: template } = await supabase.from("defect_templates").select("*").eq("id", parsed.data.template_id).single();
  if (!template) redirect("/assets/" + parsed.data.asset_id + "?error=Defect%20template%20not%20found");

  const valuePenalty = Number((Number(template.value_penalty_fixed || 0) + parsed.data.reference_value * Number(template.value_penalty_percent || 0) / 100).toFixed(2));
  await supabase.from("asset_defects").insert({
    asset_id: parsed.data.asset_id,
    template_id: template.id,
    description: parsed.data.description || template.name,
    applied_grade_penalty: template.grade_penalty,
    applied_value_penalty: valuePenalty,
    route_override: template.route_override,
    created_by: user.id,
  });

  if (template.route_override && ["REFURBISH","PARTS","DONATE","RECYCLE","HOLD"].includes(template.route_override)) {
    await supabase.from("assets").update({ initial_route: template.route_override }).eq("id", parsed.data.asset_id);
  }
  if (template.severity === "CRITICAL") {
    await supabase.from("exceptions").insert({
      entity_type: "asset",
      entity_id: parsed.data.asset_id,
      exception_type: "CRITICAL_DEFECT",
      severity: "CRITICAL",
      summary: template.name + (parsed.data.description ? ": " + parsed.data.description : ""),
      created_by: user.id,
    });
  }
  await event("asset", parsed.data.asset_id, "DEFECT_APPLIED", {
    template: template.name,
    grade_penalty: template.grade_penalty,
    value_penalty: valuePenalty,
    route_override: template.route_override,
  });
  revalidatePath("/assets/" + parsed.data.asset_id);
  revalidatePath("/exceptions");
}

export async function applyWorkflowRule(formData: FormData) {
  const parsed = z.object({
    asset_id: z.string().uuid(),
    rule_id: z.string().uuid(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/assets");

  const { supabase } = await currentUser();
  const [{ data: asset }, { data: rule }, { data: grade }] = await Promise.all([
    supabase.from("assets").select("*").eq("id", parsed.data.asset_id).single(),
    supabase.from("workflow_rules").select("*").eq("id", parsed.data.rule_id).eq("enabled", true).single(),
    supabase.from("grades").select("*").eq("asset_id", parsed.data.asset_id).order("graded_at",{ascending:false}).limit(1).maybeSingle(),
  ]);
  if (!asset || !rule) redirect("/assets/" + parsed.data.asset_id + "?error=Workflow%20rule%20not%20found");

  const context = buildAssetWorkflowContext(asset, grade);
  if (!workflowMatches(rule.conditions, context)) {
    redirect("/assets/" + parsed.data.asset_id + "?error=Workflow%20rule%20no%20longer%20matches");
  }

  const action = (rule.action ?? {}) as Record<string, unknown>;
  const update: Record<string, unknown> = {};
  const statuses = ["INTAKE","UNWIPED_RESTRICTED","TRIAGE","SANITISATION","DIAGNOSTICS","REPAIR","READY_FOR_SALE","LISTED","SOLD","PARTS","DONATED","RECYCLED","REJECTED","HOLD"];
  const routes = ["REFURBISH","PARTS","DONATE","RECYCLE","HOLD"];
  if (typeof action.status === "string" && statuses.includes(action.status)) update.status = action.status;
  if (typeof action.route === "string" && routes.includes(action.route)) update.initial_route = action.route;
  if (!Object.keys(update).length) redirect("/assets/" + parsed.data.asset_id + "?error=Workflow%20action%20has%20no%20supported%20fields");

  await supabase.from("assets").update(update).eq("id", parsed.data.asset_id);
  await event("asset", parsed.data.asset_id, "WORKFLOW_RULE_APPLIED", { rule_id: rule.id, rule_name: rule.name, action: update });
  revalidatePath("/assets/" + parsed.data.asset_id);
  revalidatePath("/dashboard");
}
