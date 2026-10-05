"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const statuses = ["DRAFT","SCHEDULED","DELIVERED","PARTIALLY_RECEIVED","RECEIVED","PROCESSING","READY_TO_CLOSE","CLOSED","CANCELLED"] as const;

export async function updateJobLifecycle(formData: FormData) {
  const parsed = z.object({
    job_id: z.string().uuid(),
    status: z.enum(statuses),
    scheduled_at: z.string().trim().optional(),
  }).safeParse(Object.fromEntries(formData));

  if (!parsed.success) redirect("/jobs?error=Invalid%20job%20update");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: current } = await supabase.from("jobs").select("status,received_at").eq("id", parsed.data.job_id).single();
  if (!current) redirect("/jobs");

  const update: Record<string, unknown> = {
    status: parsed.data.status,
    scheduled_at: parsed.data.scheduled_at || null,
  };
  if (["RECEIVED","PROCESSING","READY_TO_CLOSE","CLOSED"].includes(parsed.data.status) && !current.received_at) {
    update.received_at = new Date().toISOString();
  }

  const { error } = await supabase.from("jobs").update(update).eq("id", parsed.data.job_id);
  if (error) redirect("/jobs/"+parsed.data.job_id+"?error="+encodeURIComponent(error.message));

  const opportunityStage =
    parsed.data.status === "PROCESSING" ? "PROCESSING" :
    ["READY_TO_CLOSE","CLOSED"].includes(parsed.data.status) ? "COMPLETED" :
    parsed.data.status === "CANCELLED" ? "LOST" :
    ["SCHEDULED","DELIVERED","PARTIALLY_RECEIVED","RECEIVED"].includes(parsed.data.status) ? "SCHEDULED" :
    null;

  if (opportunityStage) {
    await supabase.from("crm_opportunities").update({
      stage: opportunityStage,
      lost_reason: opportunityStage === "LOST" ? "Linked job cancelled" : null,
    }).eq("job_id", parsed.data.job_id);
  }

  await supabase.from("operational_events").insert({
    entity_type: "job",
    entity_id: parsed.data.job_id,
    event_type: "JOB_STATUS_CHANGED",
    actor_id: user.id,
    details: { from: current.status, to: parsed.data.status },
  });

  revalidatePath("/jobs");
  revalidatePath("/jobs/"+parsed.data.job_id);
  revalidatePath("/crm/opportunities");
  revalidatePath("/dashboard");
  redirect("/jobs/"+parsed.data.job_id+"?success=Job%20status%20updated");
}


export async function deleteJob(formData: FormData) {
  const parsed = z.object({ job_id: z.string().uuid() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/jobs?error=Invalid%20job");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role,active").eq("id", user.id).single();
  if (!profile?.active || !["admin","manager"].includes(profile.role)) {
    redirect("/jobs/" + parsed.data.job_id + "?error=Only%20admins%20or%20managers%20can%20delete%20jobs");
  }

  const [
    { count: assets },
    { count: lots },
    { count: certificates },
    { count: deployments },
    { count: settlements },
    { count: parts },
    { count: quotes },
    { count: opportunities },
  ] = await Promise.all([
    supabase.from("assets").select("*",{count:"exact",head:true}).eq("job_id", parsed.data.job_id),
    supabase.from("lots").select("*",{count:"exact",head:true}).eq("job_id", parsed.data.job_id),
    supabase.from("certificates").select("*",{count:"exact",head:true}).eq("job_id", parsed.data.job_id),
    supabase.from("deployment_runs").select("*",{count:"exact",head:true}).eq("job_id", parsed.data.job_id),
    supabase.from("settlements").select("*",{count:"exact",head:true}).eq("job_id", parsed.data.job_id),
    supabase.from("parts").select("*",{count:"exact",head:true}).eq("origin_job_id", parsed.data.job_id),
    supabase.from("crm_quotes").select("*",{count:"exact",head:true}).eq("converted_job_id", parsed.data.job_id),
    supabase.from("crm_opportunities").select("*",{count:"exact",head:true}).eq("job_id", parsed.data.job_id),
  ]);

  const linked = (assets??0)+(lots??0)+(certificates??0)+(deployments??0)+(settlements??0)+(parts??0)+(quotes??0)+(opportunities??0);
  if (linked > 0) {
    redirect("/jobs/" + parsed.data.job_id + "?error=This%20job%20has%20linked%20records%20and%20cannot%20be%20deleted.%20Cancel%20it%20instead.");
  }

  await supabase.from("operational_events").delete().eq("entity_type","job").eq("entity_id",parsed.data.job_id);
  const { error } = await supabase.from("jobs").delete().eq("id", parsed.data.job_id);
  if (error) redirect("/jobs/" + parsed.data.job_id + "?error=" + encodeURIComponent(error.message));

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  redirect("/jobs?success=Job%20deleted");
}
