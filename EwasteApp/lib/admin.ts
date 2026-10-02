import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const STAFF_ROLES = ["admin", "manager", "technician", "volunteer", "auditor"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,full_name,email,role,active")
    .eq("id", user.id)
    .single();

  if (!profile?.active) redirect("/login?error=Account%20inactive");
  if (profile.role !== "admin") redirect("/dashboard");

  return { supabase, user, profile };
}
