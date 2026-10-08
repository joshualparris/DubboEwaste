"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireProgrammeContext } from "@/lib/programme-context";
import { PROGRAMME_COOKIE, validProgramme } from "@/lib/programmes";

export async function switchProgramme(form: FormData) {
  const { context } = await requireProgrammeContext();
  const selected = String(form.get("programme") || "");
  if (!(context.global_admin && selected === "all") && !(validProgramme(selected) && (context.global_admin || context.memberships.some(m => m.program === selected)))) redirect("/programmes?error=Programme%20access%20denied");
  (await cookies()).set(PROGRAMME_COOKIE, selected, { path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30 });
  redirect("/dashboard");
}
