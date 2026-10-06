"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

function validationRedirect(key: "error" | "success", message: string): never {
  redirect("/validation?" + key + "=" + encodeURIComponent(message));
}

function emptyToNull(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text === "" ? null : text;
}

function numberOrNull(value: FormDataEntryValue | null) {
  const text = emptyToNull(value);
  if (text === null) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

function intOrNull(value: FormDataEntryValue | null) {
  const n = numberOrNull(value);
  return n === null ? null : Math.trunc(n);
}

function boolOrNull(value: FormDataEntryValue | null) {
  const text = emptyToNull(value);
  if (text === null || text === "UNKNOWN") return null;
  return text === "YES";
}

async function currentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function addValidationEvidence(formData: FormData) {
  const parsed = z.object({
    topic: z.enum(["AMR_DOWNSTREAM","COUNCIL_CONTRACT","EDUCATION_VENDOR","ORGANISATION_DISPOSAL","LOCAL_VOLUMES","LOCAL_ECONOMICS","APPROVALS","SUPPLY_WILLINGNESS","REPAIR_CAFE_DEMAND","COMMERCIAL_TERMS"]),
    subject_name: z.string().trim().min(1).max(200),
    method: z.enum(["PUBLIC_SOURCE","INFORMAL_REQUEST","GIPA","INTERVIEW","WRITTEN_RESPONSE","QUOTE","PILOT","SURVEY","OTHER"]),
    status: z.enum(["OPEN","REQUESTED","PARTIAL","VERIFIED","REFUSED","BLOCKED"]),
    evidence_date: z.string().min(1),
    answer_summary: z.string().trim().min(1).max(5000),
    confidence: z.enum(["LOW","MEDIUM","HIGH"]),
  }).safeParse(Object.fromEntries(formData));

  if (!parsed.success) validationRedirect("error", "Check the evidence fields.");
  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("validation_evidence").insert({
    ...parsed.data,
    source_url: emptyToNull(formData.get("source_url")),
    quantitative_value: numberOrNull(formData.get("quantitative_value")),
    quantitative_unit: emptyToNull(formData.get("quantitative_unit")),
    next_action: emptyToNull(formData.get("next_action")),
    next_action_at: emptyToNull(formData.get("next_action_at")),
    created_by: user.id,
  });
  if (error) validationRedirect("error", error.message);
  revalidatePath("/validation");
  validationRedirect("success", "Evidence recorded.");
}

export async function addOrganisationInterview(formData: FormData) {
  const organisation = String(formData.get("organisation") || "").trim();
  if (!organisation) validationRedirect("error", "Organisation is required.");

  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("organisation_disposal_interviews").insert({
    organisation,
    sector: emptyToNull(formData.get("sector")),
    respondent_role: emptyToNull(formData.get("respondent_role")),
    interview_date: emptyToNull(formData.get("interview_date")) || new Date().toISOString().slice(0,10),
    approximate_device_count: intOrNull(formData.get("approximate_device_count")),
    annual_retired_devices: intOrNull(formData.get("annual_retired_devices")),
    refresh_cycle_months: intOrNull(formData.get("refresh_cycle_months")),
    current_route: emptyToNull(formData.get("current_route")),
    current_provider: emptyToNull(formData.get("current_provider")),
    sanitisation_evidence: emptyToNull(formData.get("sanitisation_evidence")),
    reuse_before_recycle: boolOrNull(formData.get("reuse_before_recycle")),
    disposal_cost_or_rebate: emptyToNull(formData.get("disposal_cost_or_rebate")),
    decision_control: emptyToNull(formData.get("decision_control")),
    willing_to_trial: emptyToNull(formData.get("willing_to_trial")) || "UNKNOWN",
    likely_trial_units: intOrNull(formData.get("likely_trial_units")),
    conditions_for_trial: emptyToNull(formData.get("conditions_for_trial")),
    next_action: emptyToNull(formData.get("next_action")),
    notes: emptyToNull(formData.get("notes")),
    created_by: user.id,
  });
  if (error) validationRedirect("error", error.message);
  revalidatePath("/validation");
  validationRedirect("success", "Organisation interview recorded.");
}

export async function addRepairCafeDemand(formData: FormData) {
  const deviceType = String(formData.get("device_type") || "").trim();
  const fault = String(formData.get("fault_category") || "").trim();
  if (!deviceType || !fault) validationRedirect("error", "Device type and fault category are required.");

  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("repair_cafe_demand_observations").insert({
    observed_on: emptyToNull(formData.get("observed_on")) || new Date().toISOString().slice(0,10),
    source_channel: emptyToNull(formData.get("source_channel")),
    postcode: emptyToNull(formData.get("postcode")),
    device_type: deviceType,
    fault_category: fault,
    current_alternative: emptyToNull(formData.get("current_alternative")),
    affordability_barrier: boolOrNull(formData.get("affordability_barrier")),
    would_attend: emptyToNull(formData.get("would_attend")) || "MAYBE",
    preferred_timing: emptyToNull(formData.get("preferred_timing")),
    willing_to_learn: boolOrNull(formData.get("willing_to_learn")),
    estimated_repair_spend: numberOrNull(formData.get("estimated_repair_spend")),
    notes: emptyToNull(formData.get("notes")),
    created_by: user.id,
  });
  if (error) validationRedirect("error", error.message);
  revalidatePath("/validation");
  validationRedirect("success", "Repair Café demand observation recorded.");
}

export async function addCommercialTermsQuote(formData: FormData) {
  const provider = String(formData.get("provider") || "").trim();
  const serviceType = String(formData.get("service_type") || "").trim();
  if (!provider || !serviceType) validationRedirect("error", "Provider and service type are required.");

  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("commercial_terms_quotes").insert({
    provider,
    service_type: serviceType,
    quote_date: emptyToNull(formData.get("quote_date")) || new Date().toISOString().slice(0,10),
    valid_until: emptyToNull(formData.get("valid_until")),
    minimum_units: intOrNull(formData.get("minimum_units")),
    minimum_weight_kg: numberOrNull(formData.get("minimum_weight_kg")),
    pickup_fee: numberOrNull(formData.get("pickup_fee")),
    per_unit_fee: numberOrNull(formData.get("per_unit_fee")),
    per_kg_fee: numberOrNull(formData.get("per_kg_fee")),
    rebate_or_buyback: emptyToNull(formData.get("rebate_or_buyback")),
    transport_terms: emptyToNull(formData.get("transport_terms")),
    battery_terms: emptyToNull(formData.get("battery_terms")),
    data_terms: emptyToNull(formData.get("data_terms")),
    certificates_reports: emptyToNull(formData.get("certificates_reports")),
    insurance_or_contract_requirements: emptyToNull(formData.get("insurance_or_contract_requirements")),
    source_reference: emptyToNull(formData.get("source_reference")),
    notes: emptyToNull(formData.get("notes")),
    created_by: user.id,
  });
  if (error) validationRedirect("error", error.message);
  revalidatePath("/validation");
  validationRedirect("success", "Commercial terms recorded.");
}

export async function addPilotEconomics(formData: FormData) {
  const { supabase, user } = await currentUser();
  const money = (name: string) => numberOrNull(formData.get(name)) ?? 0;
  const mins = (name: string) => intOrNull(formData.get(name)) ?? 0;

  const { error } = await supabase.from("pilot_economics_observations").insert({
    asset_id: emptyToNull(formData.get("asset_id")),
    observed_on: emptyToNull(formData.get("observed_on")) || new Date().toISOString().slice(0,10),
    category: emptyToNull(formData.get("category")),
    acquisition_cost: money("acquisition_cost"),
    collection_freight: money("collection_freight"),
    parts_cost: money("parts_cost"),
    downstream_cost: money("downstream_cost"),
    marketplace_fees: money("marketplace_fees"),
    outbound_freight: money("outbound_freight"),
    return_cost: money("return_cost"),
    other_cost: money("other_cost"),
    intake_minutes: mins("intake_minutes"),
    diagnostic_minutes: mins("diagnostic_minutes"),
    sanitisation_minutes: mins("sanitisation_minutes"),
    repair_minutes: mins("repair_minutes"),
    listing_admin_minutes: mins("listing_admin_minutes"),
    realised_revenue: money("realised_revenue"),
    final_route: emptyToNull(formData.get("final_route")),
    sold_or_closed_on: emptyToNull(formData.get("sold_or_closed_on")),
    notes: emptyToNull(formData.get("notes")),
    created_by: user.id,
  });
  if (error) validationRedirect("error", error.message);
  revalidatePath("/validation");
  validationRedirect("success", "Pilot economics recorded.");
}
