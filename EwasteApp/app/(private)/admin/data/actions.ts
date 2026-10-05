"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

const actorColumn: Record<string, string> = {
  api_tokens: "created_by",
  asset_attributes: "created_by",
  asset_defects: "created_by",
  asset_tests: "created_by",
  assets: "created_by",
  customers: "created_by",
  crm_opportunities: "created_by",
  defect_templates: "created_by",
  dispositions: "decided_by",
  downstream_vendors: "created_by",
  environmental_methodologies: "created_by",
  exceptions: "created_by",
  grades: "graded_by",
  jobs: "created_by",
  locations: "created_by",
  lot_adjustments: "created_by",
  lot_relationships: "created_by",
  lots: "created_by",
  market_observations: "created_by",
  media: "created_by",
  model_support: "created_by",
  outbound_contents: "created_by",
  outbound_orders: "created_by",
  pallet_contents: "added_by",
  pallets: "created_by",
  parts: "created_by",
  pricing_rules: "created_by",
  repairs: "created_by",
  resale_listings: "created_by",
  returns_rma: "created_by",
  sales: "created_by",
  sanitisation_policies: "created_by",
  settlements: "created_by",
  webhooks: "created_by",
  workflow_rules: "created_by",
  workstations: "created_by",
};

const protectedKeys = new Set([
  "id", "created_by", "decided_by", "graded_by", "added_by",
  "created_at", "updated_at", "captured_at", "graded_at", "decided_at",
]);

function fail(table: string, value: string): never {
  redirect(`/admin/data?table=${encodeURIComponent(table)}&error=${encodeURIComponent(value)}`);
}

function success(table: string, value: string): never {
  redirect(`/admin/data?table=${encodeURIComponent(table)}&success=${encodeURIComponent(value)}`);
}

function parseObject(raw: string): Record<string, unknown> {
  const value: unknown = JSON.parse(raw);
  if (!value || Array.isArray(value) || typeof value !== "object") {
    throw new Error("JSON must be an object.");
  }
  return value as Record<string, unknown>;
}

async function targetFor(table: string) {
  const { supabase, user } = await requireAdmin();
  const { data: target } = await supabase
    .from("permission_targets")
    .select("table_name,mutable")
    .eq("table_name", table)
    .eq("mutable", true)
    .single();

  if (!target) fail(table || "customers", "Unknown or immutable table.");
  return { supabase, user };
}

export async function createAdminRecord(formData: FormData) {
  const table = String(formData.get("table_name") ?? "");
  const raw = String(formData.get("json") ?? "{}");
  const { supabase, user } = await targetFor(table);

  let payload: Record<string, unknown>;
  try {
    payload = parseObject(raw);
  } catch (error) {
    fail(table, error instanceof Error ? error.message : "Invalid JSON.");
  }

  delete payload.id;
  const actor = actorColumn[table];
  if (actor) payload[actor] = user.id;

  const { error } = await supabase.from(table).insert(payload);
  if (error) fail(table, error.message);

  revalidatePath("/admin/data");
  success(table, "Record created.");
}

export async function updateAdminRecord(formData: FormData) {
  const table = String(formData.get("table_name") ?? "");
  const id = String(formData.get("id") ?? "");
  const raw = String(formData.get("json") ?? "{}");
  const { supabase } = await targetFor(table);

  let parsed: Record<string, unknown>;
  try {
    parsed = parseObject(raw);
  } catch (error) {
    fail(table, error instanceof Error ? error.message : "Invalid JSON.");
  }

  const payload = Object.fromEntries(
    Object.entries(parsed).filter(([key]) => !protectedKeys.has(key)),
  );

  const { error } = await supabase.from(table).update(payload).eq("id", id);
  if (error) fail(table, error.message);

  revalidatePath("/admin/data");
  success(table, "Record updated.");
}

export async function deleteAdminRecord(formData: FormData) {
  const table = String(formData.get("table_name") ?? "");
  const id = String(formData.get("id") ?? "");
  const { supabase } = await targetFor(table);

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) fail(table, error.message);

  revalidatePath("/admin/data");
  success(table, "Record deleted.");
}
