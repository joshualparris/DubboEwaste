"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

async function userContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

async function reconcileLot(lotId: string) {
  const { supabase, user } = await userContext();
  const [{ data: lot }, { data: links }, { data: adjustments }] = await Promise.all([
    supabase.from("lots").select("id,gross_weight_kg,tare_weight_kg,mass_balance_tolerance_kg").eq("id", lotId).single(),
    supabase.from("lot_relationships").select("child_lot_id").eq("parent_lot_id", lotId),
    supabase.from("lot_adjustments").select("weight_kg").eq("lot_id", lotId),
  ]);
  if (!lot) return;

  const childIds = (links ?? []).map((x) => x.child_lot_id);
  const { data: children } = childIds.length
    ? await supabase.from("lots").select("id,gross_weight_kg,tare_weight_kg").in("id", childIds)
    : { data: [] as any[] };

  const input = Math.max(0, Number(lot.gross_weight_kg ?? 0) - Number(lot.tare_weight_kg ?? 0));
  const outputs = (children ?? []).reduce((sum, child) => sum + Math.max(0, Number(child.gross_weight_kg ?? 0) - Number(child.tare_weight_kg ?? 0)), 0);
  const adjusted = (adjustments ?? []).reduce((sum, row) => sum + Number(row.weight_kg ?? 0), 0);
  const variance = Number((input - outputs - adjusted).toFixed(3));
  const tolerance = Number(lot.mass_balance_tolerance_kg ?? 0.5);

  const { data: existing } = await supabase.from("exceptions")
    .select("id,status")
    .eq("entity_type", "lot")
    .eq("entity_id", lotId)
    .eq("exception_type", "MASS_BALANCE_VARIANCE")
    .in("status", ["OPEN","IN_REVIEW"])
    .maybeSingle();

  if (Math.abs(variance) > tolerance && childIds.length > 0) {
    const summary = `Mass balance variance ${variance.toFixed(3)} kg exceeds tolerance ${tolerance.toFixed(3)} kg.`;
    if (existing) {
      await supabase.from("exceptions").update({ summary, severity: Math.abs(variance) > Math.max(5, tolerance * 10) ? "HIGH" : "MEDIUM" }).eq("id", existing.id);
    } else {
      await supabase.from("exceptions").insert({
        entity_type: "lot",
        entity_id: lotId,
        exception_type: "MASS_BALANCE_VARIANCE",
        severity: Math.abs(variance) > Math.max(5, tolerance * 10) ? "HIGH" : "MEDIUM",
        summary,
        created_by: user.id,
      });
    }
  } else if (existing) {
    await supabase.from("exceptions").update({
      status: "RESOLVED",
      resolution: `Automatically reconciled within ${tolerance.toFixed(3)} kg tolerance. Final variance ${variance.toFixed(3)} kg.`,
      resolved_at: new Date().toISOString(),
    }).eq("id", existing.id);
  }

  await supabase.from("operational_events").insert({
    entity_type: "lot",
    entity_id: lotId,
    event_type: "MASS_BALANCE_RECALCULATED",
    actor_id: user.id,
    details: { input_kg: input, child_output_kg: outputs, adjustments_kg: adjusted, variance_kg: variance, tolerance_kg: tolerance },
  });
}

export async function splitLot(formData: FormData) {
  const parsed = z.object({
    parent_lot_id: z.string().uuid(),
    commodity: z.string().trim().min(2).max(200),
    weight_kg: z.preprocess((v) => Number(v), z.number().positive()),
    item_count: z.preprocess((v) => v === "" ? undefined : Number(v), z.number().int().nonnegative().optional()),
    notes: z.string().trim().max(2000).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/lots?error=Check%20split%20fields");

  const { supabase, user } = await userContext();
  const { data: parent } = await supabase.from("lots").select("job_id,location_id").eq("id", parsed.data.parent_lot_id).single();
  if (!parent) redirect("/lots?error=Parent%20lot%20not%20found");

  const { data: child, error } = await supabase.from("lots").insert({
    job_id: parent.job_id,
    commodity: parsed.data.commodity,
    gross_weight_kg: parsed.data.weight_kg,
    tare_weight_kg: 0,
    item_count: parsed.data.item_count ?? null,
    location_id: parent.location_id,
    status: "SORTING",
    notes: parsed.data.notes || null,
    created_by: user.id,
  }).select("id,lot_code").single();
  if (error || !child) redirect("/lots/" + parsed.data.parent_lot_id + "?error=Could%20not%20create%20child%20lot");

  await supabase.from("lot_relationships").insert({
    parent_lot_id: parsed.data.parent_lot_id,
    child_lot_id: child.id,
    relationship_type: "SPLIT",
    output_weight_kg: parsed.data.weight_kg,
    created_by: user.id,
  });
  await supabase.from("operational_events").insert({
    entity_type: "lot",
    entity_id: parsed.data.parent_lot_id,
    event_type: "LOT_SPLIT",
    actor_id: user.id,
    details: { child_lot_id: child.id, child_lot_code: child.lot_code, weight_kg: parsed.data.weight_kg },
  });
  await reconcileLot(parsed.data.parent_lot_id);
  revalidatePath("/lots");
  revalidatePath("/lots/" + parsed.data.parent_lot_id);
}

export async function addLotAdjustment(formData: FormData) {
  const parsed = z.object({
    lot_id: z.string().uuid(),
    adjustment_type: z.enum(["RESIDUAL","PROCESS_LOSS","OUTBOUND","CORRECTION"]),
    weight_kg: z.preprocess((v) => Number(v), z.number().nonnegative()),
    reason: z.string().trim().min(2).max(2000),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/lots");

  const { supabase, user } = await userContext();
  await supabase.from("lot_adjustments").insert({ ...parsed.data, created_by: user.id });
  await reconcileLot(parsed.data.lot_id);
  revalidatePath("/lots/" + parsed.data.lot_id);
}

export async function updateLotTolerance(formData: FormData) {
  const parsed = z.object({
    lot_id: z.string().uuid(),
    tolerance_kg: z.preprocess((v) => Number(v), z.number().nonnegative()),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/lots");
  const { supabase } = await userContext();
  await supabase.from("lots").update({ mass_balance_tolerance_kg: parsed.data.tolerance_kg }).eq("id", parsed.data.lot_id);
  await reconcileLot(parsed.data.lot_id);
  revalidatePath("/lots/" + parsed.data.lot_id);
}
