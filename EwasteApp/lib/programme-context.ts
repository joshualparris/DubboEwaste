import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProgrammeContext } from "./programmes";

export async function getProgrammeContext() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("programme_context");
  if (error) throw new Error("Programme access could not be loaded. Please try again.");
  return { supabase, context: data as ProgrammeContext | null };
}
export async function requireProgrammeContext() {
  const result = await getProgrammeContext();
  if (!result.context) redirect("/login?error=Please%20sign%20in%20with%20an%20active%20account");
  return { ...result, context: result.context };
}
