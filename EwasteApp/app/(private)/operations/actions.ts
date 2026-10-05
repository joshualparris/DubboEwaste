"use server";

// AssetFlow operational server actions.

import { createHash } from "node:crypto";

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

export async function createLead(formData: FormData) {
  const schema = z.object({
    name: z.string().trim().min(2).max(200),
    organisation: z.string().trim().max(200).optional(),
    email: z.string().trim().email().optional().or(z.literal("")),
    phone: z.string().trim().max(80).optional(),
    source: z.string().trim().max(120).optional(),
    estimated_value: z.preprocess(v => v === "" ? undefined : Number(v), z.number().nonnegative().optional()),
    next_action: z.string().trim().max(300).optional(),
    next_action_at: z.string().trim().optional(),
    consent_status: z.enum(["UNKNOWN", "OPERATIONAL_ONLY", "MARKETING_OPT_IN", "MARKETING_OPT_OUT"]),
    notes: z.string().trim().max(4000).optional(),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/crm?error=Please%20check%20the%20lead%20fields");
  const { supabase, user } = await currentUser();
  const { data, error } = await supabase.from("crm_leads").insert({
    ...parsed.data,
    organisation: parsed.data.organisation || null,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    source: parsed.data.source || null,
    next_action: parsed.data.next_action || null,
    next_action_at: parsed.data.next_action_at || null,
    notes: parsed.data.notes || null,
    created_by: user.id,
  }).select("id").single();
  if (error || !data) redirect("/crm?error=Could%20not%20create%20lead");
  await appendEvent(supabase, user.id, "crm_lead", data.id, "CRM_LEAD_CREATED", { stage: "NEW" });
  revalidatePath("/crm");
  redirect("/crm?success=Lead%20created");
}

export async function updateLeadStage(formData: FormData) {
  const schema = z.object({ lead_id: z.string().uuid(), stage: z.enum(["NEW","QUALIFIED","QUOTED","WON","LOST","NURTURE"]), lost_reason: z.string().trim().max(500).optional() });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/crm?error=Please%20check%20the%20stage%20change");
  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("crm_leads").update({ stage: parsed.data.stage, lost_reason: parsed.data.lost_reason || null }).eq("id", parsed.data.lead_id);
  if (error) redirect("/crm?error=Could%20not%20update%20lead");
  await supabase.from("crm_activities").insert({ lead_id: parsed.data.lead_id, activity_type: "STAGE_CHANGE", summary: `Stage changed to ${parsed.data.stage}`, created_by: user.id });
  await appendEvent(supabase, user.id, "crm_lead", parsed.data.lead_id, "CRM_LEAD_STAGE_CHANGED", { stage: parsed.data.stage });
  revalidatePath("/crm");
  redirect("/crm?success=Lead%20updated");
}

export async function addLeadActivity(formData: FormData) {
  const schema = z.object({ lead_id: z.string().uuid(), activity_type: z.enum(["NOTE","CALL","EMAIL","MEETING","QUOTE"]), summary: z.string().trim().min(2).max(2000) });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/crm?error=Please%20check%20the%20activity");
  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("crm_activities").insert({ ...parsed.data, created_by: user.id });
  if (error) redirect("/crm?error=Could%20not%20record%20activity");
  revalidatePath("/crm");
  redirect("/crm?success=Activity%20recorded");
}

export async function createQuote(formData: FormData) {
  const schema = z.object({
    lead_id: optionalUuid,
    customer_id: optionalUuid,
    scope: z.string().trim().min(3).max(6000),
    notes: z.string().trim().max(4000).optional(),
    valid_until: z.string().trim().optional(),
    items_json: z.string().trim().min(2).max(12000),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/crm/quotes?error=Please%20check%20the%20quote%20fields");
  let rawItems: unknown;
  try { rawItems = JSON.parse(parsed.data.items_json); } catch { redirect("/crm/quotes?error=Quote%20items%20must%20be%20valid%20JSON"); }
  const items = z.array(z.object({ description: z.string().trim().min(2).max(500), quantity: z.number().positive().max(100000), unit_price: z.number().nonnegative().max(1000000) })).min(1).safeParse(rawItems);
  if (!items.success) redirect("/crm/quotes?error=Add%20at%20least%20one%20valid%20quote%20item");
  const { supabase, user } = await currentUser();
  const subtotal = items.data.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const { data: quote, error } = await supabase.from("crm_quotes").insert({ lead_id: parsed.data.lead_id || null, customer_id: parsed.data.customer_id || null, valid_until: parsed.data.valid_until || null, created_by: user.id }).select("id,quote_number").single();
  if (error || !quote) redirect("/crm/quotes?error=Could%20not%20create%20quote");
  const { data: version, error: versionError } = await supabase.from("crm_quote_versions").insert({ quote_id: quote.id, version_number: 1, scope: parsed.data.scope, notes: parsed.data.notes || null, subtotal: Number(subtotal.toFixed(2)), total: Number(subtotal.toFixed(2)), created_by: user.id }).select("id").single();
  if (versionError || !version) redirect("/crm/quotes?error=Could%20not%20create%20quote%20version");
  const { error: itemError } = await supabase.from("crm_quote_items").insert(items.data.map(item => ({ version_id: version.id, description: item.description, quantity: item.quantity, unit_price: item.unit_price, line_total: Number((item.quantity * item.unit_price).toFixed(2)) })));
  if (itemError) redirect("/crm/quotes?error=Could%20not%20save%20quote%20items");
  if (parsed.data.lead_id) await supabase.from("crm_activities").insert({ lead_id: parsed.data.lead_id, activity_type: "QUOTE", summary: `Quote ${quote.quote_number} created`, created_by: user.id });
  await appendEvent(supabase, user.id, "crm_quote", quote.id, "CRM_QUOTE_CREATED", { quote_number: quote.quote_number, total: Number(subtotal.toFixed(2)) });
  revalidatePath("/crm"); revalidatePath("/crm/quotes");
  redirect(`/crm/quotes?success=Quote%20${encodeURIComponent(quote.quote_number)}%20created`);
}

export async function createQuoteVersion(formData: FormData) {
  const schema = z.object({ quote_id: z.string().uuid(), scope: z.string().trim().min(3).max(6000), notes: z.string().trim().max(4000).optional(), items_json: z.string().trim().min(2).max(12000) });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/crm/quotes?error=Please%20check%20the%20new%20version");
  let rawItems: unknown;
  try { rawItems = JSON.parse(parsed.data.items_json); } catch { redirect("/crm/quotes?error=Quote%20items%20must%20be%20valid%20JSON"); }
  const items = z.array(z.object({ description: z.string().trim().min(2).max(500), quantity: z.number().positive().max(100000), unit_price: z.number().nonnegative().max(1000000) })).min(1).safeParse(rawItems);
  if (!items.success) redirect("/crm/quotes?error=Add%20at%20least%20one%20valid%20quote%20item");
  const { supabase, user } = await currentUser();
  const { data: quote } = await supabase.from("crm_quotes").select("id,current_version,lead_id,quote_number").eq("id", parsed.data.quote_id).single();
  if (!quote) redirect("/crm/quotes?error=Quote%20not%20found");
  const versionNumber = Number(quote.current_version) + 1;
  const subtotal = items.data.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const { data: version, error } = await supabase.from("crm_quote_versions").insert({ quote_id: quote.id, version_number: versionNumber, scope: parsed.data.scope, notes: parsed.data.notes || null, subtotal: Number(subtotal.toFixed(2)), total: Number(subtotal.toFixed(2)), created_by: user.id }).select("id").single();
  if (error || !version) redirect("/crm/quotes?error=Could%20not%20create%20quote%20version");
  await supabase.from("crm_quote_items").insert(items.data.map(item => ({ version_id: version.id, description: item.description, quantity: item.quantity, unit_price: item.unit_price, line_total: Number((item.quantity * item.unit_price).toFixed(2)) })));
  await supabase.from("crm_quotes").update({ current_version: versionNumber, status: "DRAFT" }).eq("id", quote.id);
  if (quote.lead_id) await supabase.from("crm_activities").insert({ lead_id: quote.lead_id, activity_type: "QUOTE", summary: `Quote ${quote.quote_number} version ${versionNumber} created`, created_by: user.id });
  revalidatePath("/crm/quotes"); redirect("/crm/quotes?success=New%20quote%20version%20created");
}

export async function convertQuoteToJob(formData: FormData) {
  const schema = z.object({ quote_id: z.string().uuid(), source_site: z.string().trim().max(200).optional(), work_instructions: z.string().trim().max(6000).optional() });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/crm/quotes?error=Please%20check%20the%20job%20conversion");
  const { supabase, user } = await currentUser();
  const { data: quote } = await supabase.from("crm_quotes").select("*,crm_leads(name,organisation),crm_quote_versions(total)").eq("id", parsed.data.quote_id).single();
  if (!quote || !["ACCEPTED", "ISSUED"].includes(quote.status)) redirect("/crm/quotes?error=Only%20issued%20or%20accepted%20quotes%20can%20be%20converted");
  const lead = quote.crm_leads;
  const { data: job, error } = await supabase.from("jobs").insert({ customer_id: quote.customer_id || null, source_site: parsed.data.source_site || lead?.organisation || null, contact_name: lead?.name || null, status: "DRAFT", work_instructions: parsed.data.work_instructions || `Created from ${quote.quote_number}`, created_by: user.id }).select("id,job_code").single();
  if (error || !job) redirect("/crm/quotes?error=Could%20not%20create%20job");
  await supabase.from("crm_quotes").update({ status: "CONVERTED", converted_job_id: job.id, accepted_at: new Date().toISOString() }).eq("id", quote.id);
  await supabase.from("crm_opportunities").update({ job_id: job.id, stage: "ACCEPTED" }).eq("quote_id", quote.id);
  if (quote.lead_id) {
    await supabase.from("crm_leads").update({ stage: "WON" }).eq("id", quote.lead_id);
    await supabase.from("crm_activities").insert({ lead_id: quote.lead_id, activity_type: "STAGE_CHANGE", summary: `Quote ${quote.quote_number} converted to ${job.job_code}`, created_by: user.id });
  }
  await appendEvent(supabase, user.id, "job", job.id, "JOB_CREATED_FROM_QUOTE", { quote_id: quote.id, quote_number: quote.quote_number });
  revalidatePath("/crm"); revalidatePath("/crm/quotes"); revalidatePath("/crm/opportunities"); revalidatePath("/jobs"); revalidatePath("/dashboard");
  redirect(`/jobs/${job.id}`);
}

export async function updateQuoteStatus(formData: FormData) {
  const schema = z.object({ quote_id: z.string().uuid(), status: z.enum(["DRAFT","ISSUED","ACCEPTED","DECLINED","EXPIRED"]) });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/crm/quotes?error=Please%20check%20the%20quote%20status");
  const { supabase, user } = await currentUser();
  const { data: quote } = await supabase.from("crm_quotes").select("lead_id,quote_number").eq("id", parsed.data.quote_id).single();
  if (!quote) redirect("/crm/quotes?error=Quote%20not%20found");
  const { error } = await supabase.from("crm_quotes").update({ status: parsed.data.status, accepted_at: parsed.data.status === "ACCEPTED" ? new Date().toISOString() : null }).eq("id", parsed.data.quote_id);
  if (error) redirect("/crm/quotes?error=Could%20not%20update%20quote");
  if (quote.lead_id) await supabase.from("crm_activities").insert({ lead_id: quote.lead_id, activity_type: "QUOTE", summary: `Quote ${quote.quote_number} marked ${parsed.data.status}`, created_by: user.id });
  const opportunityStage = parsed.data.status === "ISSUED" ? "QUOTED" : parsed.data.status === "ACCEPTED" ? "ACCEPTED" : ["DECLINED","EXPIRED"].includes(parsed.data.status) ? "LOST" : null;
  if (opportunityStage) await supabase.from("crm_opportunities").update({ stage: opportunityStage, lost_reason: opportunityStage === "LOST" ? `Quote ${parsed.data.status.toLowerCase()}` : null }).eq("quote_id", parsed.data.quote_id);
  revalidatePath("/crm/quotes"); revalidatePath("/crm/opportunities"); revalidatePath("/dashboard"); redirect("/crm/quotes?success=Quote%20status%20updated");
}

export async function createEmailTemplate(formData: FormData) {
  const schema = z.object({ name: z.string().trim().min(2).max(160), subject: z.string().trim().min(2).max(250), purpose: z.string().trim().min(2).max(300), body: z.string().trim().min(2).max(12000) });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/crm/campaigns?error=Please%20check%20the%20template");
  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("crm_email_templates").insert({ ...parsed.data, created_by: user.id });
  if (error) redirect("/crm/campaigns?error=Could%20not%20create%20template");
  revalidatePath("/crm/campaigns"); redirect("/crm/campaigns?success=Template%20created");
}

export async function createCampaign(formData: FormData) {
  const schema = z.object({ name: z.string().trim().min(2).max(160), template_id: optionalUuid, audience_description: z.string().trim().min(2).max(1000) });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/crm/campaigns?error=Please%20check%20the%20campaign");
  const { supabase, user } = await currentUser();
  const { data: campaign, error } = await supabase.from("crm_campaigns").insert({ ...parsed.data, template_id: parsed.data.template_id || null, created_by: user.id }).select("id").single();
  if (error || !campaign) redirect("/crm/campaigns?error=Could%20not%20create%20campaign");
  const { data: recipients } = await supabase.from("crm_leads").select("id,consent_status").eq("consent_status", "MARKETING_OPT_IN");
  if (recipients?.length) await supabase.from("crm_campaign_recipients").insert(recipients.map(recipient => ({ campaign_id: campaign.id, lead_id: recipient.id, consent_status: recipient.consent_status })));
  await supabase.from("crm_campaigns").update({ status: "READY", consent_snapshot_at: new Date().toISOString() }).eq("id", campaign.id);
  revalidatePath("/crm/campaigns"); redirect("/crm/campaigns?success=Campaign%20created%20with%20consent-safe%20audience");
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
    submission_key: z.string().uuid(),
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

  const { data: existing } = await supabase
    .from("jobs")
    .select("id")
    .eq("submission_key", parsed.data.submission_key)
    .maybeSingle();
  if (existing) redirect("/jobs/" + existing.id);

  const { data, error } = await supabase.from("jobs").insert({
    ...parsed.data,
    customer_id: parsed.data.customer_id || null,
    source_site: parsed.data.source_site || null,
    contact_name: parsed.data.contact_name || null,
    work_instructions: parsed.data.work_instructions || null,
    created_by: user.id,
  }).select("id,job_code").single();
  if (error || !data) {
    if (error?.code === "23505") {
      const { data: duplicate } = await supabase
        .from("jobs")
        .select("id")
        .eq("submission_key", parsed.data.submission_key)
        .maybeSingle();
      if (duplicate) redirect("/jobs/" + duplicate.id);
    }
    redirect("/jobs/new?error=Could%20not%20create%20job");
  }
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

export async function recordDiagnosticRun(formData: FormData) {
  const schema = z.object({
    asset_id: z.string().uuid(),
    profile_id: optionalUuid,
    execution_mode: z.enum(["MANUAL", "LOCAL_AGENT", "BOOT_MEDIA", "EXTERNAL_REPORT"]),
    status: z.enum(["QUEUED", "RUNNING", "PASSED", "FAILED", "REVIEW", "CANCELLED"]),
    results: z.string().trim().min(2).max(30000),
    notes: z.string().trim().max(3000).optional(),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/processing?error=Check%20diagnostic%20run%20fields");
  let results: Array<{ test_type: string; result: "PASS" | "FAIL" | "NOT_PRESENT" | "NOT_TESTED" | "REVIEW"; notes?: string }>;
  try {
    const value = JSON.parse(parsed.data.results);
    if (!Array.isArray(value)) throw new Error("results must be an array");
    results = value.map((item) => ({
      test_type: String(item.test_type ?? "").trim(),
      result: item.result,
      notes: item.notes ? String(item.notes).slice(0, 2000) : undefined,
    }));
    if (!results.length || results.some((item) => !item.test_type || !["PASS", "FAIL", "NOT_PRESENT", "NOT_TESTED", "REVIEW"].includes(item.result))) throw new Error("invalid test result");
  } catch {
    redirect("/processing?error=Results%20must%20be%20valid%20JSON%20test%20objects");
  }
  const { supabase, user } = await currentUser();
  const passCount = results.filter((result) => result.result === "PASS").length;
  const failCount = results.filter((result) => result.result === "FAIL").length;
  const { data: run, error } = await supabase.from("diagnostic_runs").insert({
    asset_id: parsed.data.asset_id,
    profile_id: parsed.data.profile_id || null,
    execution_mode: parsed.data.execution_mode,
    status: parsed.data.status,
    test_count: results.length,
    pass_count: passCount,
    fail_count: failCount,
    operator_id: user.id,
    notes: parsed.data.notes || null,
    started_at: ["RUNNING", "PASSED", "FAILED", "REVIEW"].includes(parsed.data.status) ? new Date().toISOString() : null,
    completed_at: ["PASSED", "FAILED", "REVIEW", "CANCELLED"].includes(parsed.data.status) ? new Date().toISOString() : null,
  }).select("id").single();
  if (error || !run) redirect("/processing?error=Could%20not%20record%20diagnostic%20run");
  const { error: testsError } = await supabase.from("asset_tests").insert(results.map((result) => ({
    asset_id: parsed.data.asset_id,
    test_type: result.test_type,
    result: result.result,
    notes: result.notes || null,
    created_by: user.id,
  })));
  if (testsError) redirect("/processing?error=Run%20saved%20but%20test%20records%20failed");
  await appendEvent(supabase, user.id, "asset", parsed.data.asset_id, "DIAGNOSTIC_RUN_RECORDED", {
    run_id: run.id, test_count: results.length, pass_count: passCount, fail_count: failCount,
  });
  revalidatePath(`/assets/${parsed.data.asset_id}`);
  revalidatePath("/processing");
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
    certificate_type: z.enum(["RECEIPT","RECEIVING","DISPOSITION","DEVICE_HISTORY","SANITISATION","DESTRUCTION","RECYCLING","ENVIRONMENTAL"]),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/certificates");
  const { supabase, user } = await currentUser();

  const [{ data: asset }, { data: tests }, { data: dispositions }, { data: media }, { data: grades }, { data: evidence }] = await Promise.all([
    supabase.from("assets").select("*").eq("id", parsed.data.asset_id).single(),
    supabase.from("asset_tests").select("test_type,result,notes,created_at").eq("asset_id", parsed.data.asset_id).order("created_at"),
    supabase.from("dispositions").select("disposition_type,destination,notes,decided_at").eq("asset_id", parsed.data.asset_id).order("decided_at", { ascending: false }),
    supabase.from("media").select("id,media_code,media_type,serial,capacity_bytes,data_state,sanitisation_tasks(status,tool_name,tool_version,method,verification_result,raw_report_hash,completed_at)").eq("parent_asset_id", parsed.data.asset_id),
    supabase.from("grades").select("functional_grade,cosmetic_grade,battery_grade,completeness_grade,marketability_grade,final_grade,graded_at").eq("asset_id", parsed.data.asset_id).order("graded_at",{ascending:false}),
    supabase.from("evidence").select("evidence_type,filename,mime_type,sha256,captured_at").eq("entity_type","asset").eq("entity_id",parsed.data.asset_id).order("captured_at"),
  ]);
  if (!asset) redirect("/certificates?error=Asset%20not%20found");

  const snapshot = {
    generated_at: new Date().toISOString(),
    asset,
    tests: tests ?? [],
    disposition: dispositions?.[0] ?? null,
    disposition_history: dispositions ?? [],
    media: media ?? [],
    grade: grades?.[0] ?? null,
    evidence: evidence ?? [],
  };
  const snapshotSha256 = createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
  const { data, error } = await supabase.from("certificates").insert({
    certificate_type: parsed.data.certificate_type,
    asset_id: asset.id,
    job_id: asset.job_id,
    snapshot,
    snapshot_sha256: snapshotSha256,
    issued_by: user.id,
  }).select("id,certificate_code,verification_token,issued_at,status").single();
  if (error || !data) redirect("/assets/" + asset.id + "?error=Could%20not%20issue%20certificate");

  await supabase.from("public_certificate_verification").insert({
    verification_token: data.verification_token,
    certificate_code: data.certificate_code,
    certificate_type: parsed.data.certificate_type,
    issued_at: data.issued_at,
    status: data.status,
    snapshot_sha256: snapshotSha256,
    public_summary: { asset_code: asset.asset_code, category: asset.category },
  });

  const { data: previousVault } = await supabase.from("certificate_vault_records")
    .select("chain_sha256").order("created_at", { ascending: false }).limit(1).maybeSingle();
  const previousRecordSha256 = previousVault?.chain_sha256 || null;
  const chainSha256 = createHash("sha256").update(`${snapshotSha256}:${previousRecordSha256 || "GENESIS"}`).digest("hex");
  await supabase.from("certificate_vault_records").insert({
    certificate_id: data.id,
    canonical_sha256: snapshotSha256,
    previous_record_sha256: previousRecordSha256,
    chain_sha256: chainSha256,
    created_by: user.id,
  });

  await appendEvent(supabase, user.id, "asset", asset.id, "CERTIFICATE_ISSUED", {
    certificate_code: data.certificate_code,
    certificate_type: parsed.data.certificate_type,
    snapshot_sha256: snapshotSha256,
  });
  revalidatePath("/certificates");
  redirect("/certificates/" + data.id);
}
