"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const optionalUuid = z.string().uuid().optional().or(z.literal(""));
const stages = ["QUALIFIED","QUOTED","ACCEPTED","SCHEDULED","PROCESSING","COMPLETED","INVOICED","LOST"] as const;
const serviceTypes = ["COLLECTION","DROP_OFF","ITAD","REFURBISHMENT","DATA_SANITISATION","REUSE_PROGRAM","OTHER"] as const;

function go(key: "error" | "success", message: string): never {
  redirect(\`/crm/opportunities?\${key}=\${encodeURIComponent(message)}\`);
}

async function currentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function createOpportunity(formData: FormData) {
  const parsed = z.object({
    lead_id: optionalUuid,
    customer_id: optionalUuid,
    quote_id: optionalUuid,
    job_id: optionalUuid,
    name: z.string().trim().min(2).max(200),
    service_type: z.enum(serviceTypes),
    stage: z.enum(stages),
    estimated_value: z.preprocess(v => v === "" ? undefined : Number(v), z.number().nonnegative().optional()),
    expected_asset_count: z.preprocess(v => v === "" ? undefined : Number(v), z.number().int().nonnegative().optional()),
    expected_weight_kg: z.preprocess(v => v === "" ? undefined : Number(v), z.number().nonnegative().optional()),
    source_site: z.string().trim().max(250).optional(),
    target_date: z.string().trim().optional(),
    next_action: z.string().trim().max(300).optional(),
    next_action_at: z.string().trim().optional(),
    notes: z.string().trim().max(5000).optional(),
  }).safeParse(Object.fromEntries(formData));

  if (!parsed.success) go("error", "Check the opportunity fields.");

  const { supabase, user } = await currentUser();
  const payload = {
    ...parsed.data,
    lead_id: parsed.data.lead_id || null,
    customer_id: parsed.data.customer_id || null,
    quote_id: parsed.data.quote_id || null,
    job_id: parsed.data.job_id || null,
    source_site: parsed.data.source_site || null,
    target_date: parsed.data.target_date || null,
    next_action: parsed.data.next_action || null,
    next_action_at: parsed.data.next_action_at || null,
    notes: parsed.data.notes || null,
    created_by: user.id,
  };

  const { data, error } = await supabase.from("crm_opportunities").insert(payload).select("id").single();
  if (error || !data) go("error", error?.message || "Could not create opportunity.");

  if (parsed.data.lead_id) {
    await supabase.from("crm_activities").insert({
      lead_id: parsed.data.lead_id,
      activity_type: "NOTE",
      summary: \`Opportunity created: \${parsed.data.name}\`,
      created_by: user.id,
    });
  }

  await supabase.from("operational_events").insert({
    entity_type: "crm_opportunity",
    entity_id: data.id,
    event_type: "CRM_OPPORTUNITY_CREATED",
    actor_id: user.id,
    details: { stage: parsed.data.stage, service_type: parsed.data.service_type },
  });

  revalidatePath("/crm");
  revalidatePath("/crm/opportunities");
  revalidatePath("/dashboard");
  go("success", "Opportunity created.");
}

export async function updateOpportunity(formData: FormData) {
  const parsed = z.object({
    opportunity_id: z.string().uuid(),
    stage: z.enum(stages),
    quote_id: optionalUuid,
    job_id: optionalUuid,
    next_action: z.string().trim().max(300).optional(),
    next_action_at: z.string().trim().optional(),
    lost_reason: z.string().trim().max(800).optional(),
  }).safeParse(Object.fromEntries(formData));

  if (!parsed.success) go("error", "Check the opportunity update.");

  const { supabase, user } = await currentUser();
  const { data: previous } = await supabase
    .from("crm_opportunities")
    .select("stage,lead_id,name")
    .eq("id", parsed.data.opportunity_id)
    .single();

  const { error } = await supabase.from("crm_opportunities").update({
    stage: parsed.data.stage,
    quote_id: parsed.data.quote_id || null,
    job_id: parsed.data.job_id || null,
    next_action: parsed.data.next_action || null,
    next_action_at: parsed.data.next_action_at || null,
    lost_reason: parsed.data.stage === "LOST" ? parsed.data.lost_reason || "Not recorded" : null,
  }).eq("id", parsed.data.opportunity_id);

  if (error) go("error", error.message);

  if (previous?.lead_id && previous.stage !== parsed.data.stage) {
    await supabase.from("crm_activities").insert({
      lead_id: previous.lead_id,
      activity_type: "STAGE_CHANGE",
      summary: \`Opportunity \${previous.name} changed from \${previous.stage} to \${parsed.data.stage}\`,
      created_by: user.id,
    });
  }

  await supabase.from("operational_events").insert({
    entity_type: "crm_opportunity",
    entity_id: parsed.data.opportunity_id,
    event_type: "CRM_OPPORTUNITY_UPDATED",
    actor_id: user.id,
    details: { from_stage: previous?.stage || null, to_stage: parsed.data.stage },
  });

  revalidatePath("/crm/opportunities");
  revalidatePath("/dashboard");
  go("success", "Opportunity updated.");
}
