"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { decideTriage } from "@/lib/triage";

export async function runTriage(formData: FormData) {
  const parsed = z.object({
    asset_id: z.string().uuid().optional().or(z.literal("")),
    device_category: z.string().min(1),
    transfer_authority_recorded: z.enum(["yes","no"]),
    battery_condition: z.string().min(1),
    account_lock_status: z.string().min(1),
    data_bearing: z.enum(["yes","no"]),
    sanitisation_result: z.string().min(1),
    final_route: z.string().min(1),
    physical_state: z.enum(["GOOD","FAIR","POOR","UNSAFE"]),
  }).safeParse(Object.fromEntries(formData));

  if (!parsed.success) redirect("/triage?error=Check%20the%20triage%20answers");

  const decision = decideTriage({
    deviceCategory: parsed.data.device_category,
    transferAuthorityRecorded: parsed.data.transfer_authority_recorded === "yes",
    batteryCondition: parsed.data.battery_condition,
    accountLockStatus: parsed.data.account_lock_status,
    dataBearing: parsed.data.data_bearing === "yes",
    sanitisationResult: parsed.data.sanitisation_result,
    finalRoute: parsed.data.final_route,
    physicalState: parsed.data.physical_state,
  });

  let saved = false;
  if (parsed.data.asset_id) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const batteryState =
      parsed.data.battery_condition === "swollen" ? "SWOLLEN" :
      ["damaged","hot","leaking","punctured"].includes(parsed.data.battery_condition) ? "DAMAGED" :
      parsed.data.battery_condition === "unknown" ? "UNKNOWN" :
      parsed.data.battery_condition === "not_applicable" ? "NOT_APPLICABLE" :
      "OK";

    const lockState =
      parsed.data.account_lock_status === "clear" ? "CLEAR" :
      parsed.data.account_lock_status === "not_applicable" ? "NOT_APPLICABLE" :
      ["locked","activation lock","frp","mdm","autopilot"].includes(parsed.data.account_lock_status) ? "LOCKED" :
      "UNKNOWN";

    const safetyState =
      parsed.data.physical_state === "UNSAFE" || ["swollen","damaged","hot","leaking","punctured"].includes(parsed.data.battery_condition) ? "UNSAFE" :
      parsed.data.battery_condition === "unknown" ? "HOLD" :
      "SAFE";

    const notes = [
      "Reasons: " + (decision.reasons.join("; ") || "All recorded gates passed."),
      "Required evidence: " + (decision.requiredEvidence.join("; ") || "None additional from this triage."),
      "Final route: " + parsed.data.final_route,
      "Sanitisation result: " + parsed.data.sanitisation_result,
    ].join("\\n");

    const { error } = await supabase.from("asset_triage_assessments").insert({
      asset_id: parsed.data.asset_id,
      safety_state: safetyState,
      battery_state: batteryState,
      lock_state: lockState,
      physical_state: parsed.data.physical_state,
      decision: decision.decision,
      notes,
      created_by: user.id,
    });

    if (!error) {
      saved = true;
      await supabase.from("operational_events").insert({
        entity_type: "asset",
        entity_id: parsed.data.asset_id,
        event_type: "TRIAGE_ASSESSMENT_RECORDED",
        actor_id: user.id,
        details: { decision: decision.decision, reasons: decision.reasons },
      });
    }
  }

  const query = new URLSearchParams();
  query.set("decision", decision.decision);
  query.set("reasons", decision.reasons.join("|"));
  query.set("required", decision.requiredEvidence.join("|"));
  if (saved) query.set("saved", "1");
  redirect("/triage?" + query.toString());
}
