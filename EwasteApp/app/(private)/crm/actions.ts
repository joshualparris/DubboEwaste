"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

function crmRedirect(key: "error" | "success", message: string): never {
  redirect("/crm?" + key + "=" + encodeURIComponent(message));
}

async function currentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function convertLeadToCustomer(formData: FormData) {
  const parsed = z.object({ lead_id: z.string().uuid() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) crmRedirect("error", "Invalid lead.");

  const { supabase, user } = await currentUser();
  const { data: lead } = await supabase
    .from("crm_leads")
    .select("id,customer_id,name,organisation,email,phone,notes,stage")
    .eq("id", parsed.data.lead_id)
    .single();

  if (!lead) crmRedirect("error", "Lead not found.");
  if (lead.customer_id) crmRedirect("success", "Lead is already linked to a customer.");

  const customerName = (lead.organisation || lead.name).trim();
  const { data: customer, error } = await supabase.from("customers").insert({
    name: customerName,
    contact_name: lead.organisation ? lead.name : null,
    contact_email: lead.email || null,
    contact_phone: lead.phone || null,
    notes: ["Converted from CRM lead " + lead.id + ".", lead.notes || ""].filter(Boolean).join("\n\n"),
    created_by: user.id,
  }).select("id").single();

  if (error || !customer) crmRedirect("error", error?.message || "Could not create customer.");

  const { error: linkError } = await supabase
    .from("crm_leads")
    .update({ customer_id: customer.id })
    .eq("id", lead.id);

  if (linkError) crmRedirect("error", "Customer was created but the lead link failed.");

  await supabase.from("crm_activities").insert({
    lead_id: lead.id,
    activity_type: "NOTE",
    summary: "Converted to customer: " + customerName,
    created_by: user.id,
  });

  await supabase.from("operational_events").insert({
    entity_type: "customer",
    entity_id: customer.id,
    event_type: "CUSTOMER_CREATED_FROM_CRM_LEAD",
    actor_id: user.id,
    details: { lead_id: lead.id },
  });

  revalidatePath("/crm");
  revalidatePath("/customers");
  revalidatePath("/dashboard");
  crmRedirect("success", "Lead converted to customer and history preserved.");
}

export async function updateLeadFollowUp(formData: FormData) {
  const parsed = z.object({
    lead_id: z.string().uuid(),
    next_action: z.string().trim().max(300).optional(),
    next_action_at: z.string().trim().optional(),
  }).safeParse(Object.fromEntries(formData));

  if (!parsed.success) crmRedirect("error", "Check the follow-up fields.");

  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("crm_leads").update({
    next_action: parsed.data.next_action || null,
    next_action_at: parsed.data.next_action_at || null,
  }).eq("id", parsed.data.lead_id);

  if (error) crmRedirect("error", error.message);

  const summary = parsed.data.next_action
    ? "Follow-up set: " + parsed.data.next_action + (parsed.data.next_action_at ? " due " + parsed.data.next_action_at : "")
    : "Follow-up cleared";

  await supabase.from("crm_activities").insert({
    lead_id: parsed.data.lead_id,
    activity_type: "NOTE",
    summary,
    created_by: user.id,
  });

  revalidatePath("/crm");
  revalidatePath("/dashboard");
  crmRedirect("success", "Follow-up updated.");
}
