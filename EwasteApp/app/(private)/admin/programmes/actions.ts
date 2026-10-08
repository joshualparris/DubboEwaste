"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProgrammeContext } from "@/lib/programme-context";
import { PROGRAMME_ROLES, validProgramme } from "@/lib/programmes";
function done(error?: string): never { redirect("/admin/programmes?" + (error ? "error=" + encodeURIComponent(error) : "success=Programme%20access%20updated")); }
export async function saveMembership(form: FormData) {
  const programme = String(form.get("programme") || "");
  const user = z.string().uuid().safeParse(form.get("user_id"));
  const role = z.enum(PROGRAMME_ROLES).safeParse(form.get("programme_role"));
  if (!user.success || !role.success || !validProgramme(programme)) done("Invalid membership fields.");
  const { supabase } = await requireProgrammeContext();
  const { error } = await supabase.rpc("set_programme_membership", { target_user: user.data, target_programme: programme, target_role: role.data, enabled: form.get("enabled") === "on" });
  if (error) done(error.message);
  revalidatePath("/admin/programmes"); done();
}
export async function rotateSignupCode(form: FormData) {
  const programme = String(form.get("programme") || "");
  const code = String(form.get("new_code") || "");
  if (!validProgramme(programme) || code.length < 10) done("Choose a programme and a code of at least 10 characters.");
  const { supabase } = await requireProgrammeContext();
  const { error } = await supabase.rpc("rotate_programme_signup_code", { pr: programme, new_code: code });
  if (error) done(error.message); done();
}
