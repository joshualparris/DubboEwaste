"use server";

import { cookies, headers } from "next/headers";
import { geoFromHeaders, deviceFromUserAgent } from "@/lib/analytics";
import { PROGRAMME_COOKIE, type ProgrammeContext } from "@/lib/programmes";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const LIVE_SITE = "https://dubbo-ewaste-app.vercel.app";

async function destinationForUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "/login";

  const { data: profile } = await supabase
    .from("profiles")
    .select("active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.active) return "/login?error=Account%20inactive";

  const {data} = await supabase.rpc("programme_context");
  const context = data as ProgrammeContext | null;
  if (context?.global_admin || context?.memberships.length) return "/dashboard";
  return "/programmes";
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("email") && message.includes("confirm")) {
      redirect("/login?error=Please%20confirm%20your%20email%20before%20signing%20in.");
    }
    redirect("/login?error=Invalid%20email%20or%20password");
  }

  (await cookies()).delete(PROGRAMME_COOKIE);
  const destination = await destinationForUser();
  if (destination.startsWith("/login")) redirect(destination);
  // Log a successful sign-in count only, never the email, account ID or password.
  try {
    const h = await headers();
    await supabase.from("analytics_events").insert({
      site: "dubbo_ewaste", event_name: "login_success", page_group: "/login",
      ...geoFromHeaders(h), device_class: deviceFromUserAgent(h.get("user-agent") || ""),
      is_authenticated: true
    });
  } catch { /* sign-in must never depend on analytics */ }
  if (formData.get("next") === "/circular-access") redirect("/circular-access");
  redirect(destination);
}

export async function resendConfirmation(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    redirect("/login?error=Enter%20your%20email%20address%20to%20resend%20confirmation.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${LIVE_SITE}/login?message=Email%20confirmed.%20You%20can%20sign%20in%20now.`,
    },
  });

  if (error) {
    redirect("/login?error=Could%20not%20resend%20the%20confirmation%20email.%20Please%20try%20again.");
  }

  redirect("/login?message=Confirmation%20email%20sent.%20Open%20the%20newest%20email%20and%20click%20Confirm.");
}

export async function logout() {
  const supabase = await createClient();
  (await cookies()).delete(PROGRAMME_COOKIE);
  try {
    const h = await headers();
    await supabase.from("analytics_events").insert({
      site: "dubbo_ewaste", event_name: "logout", page_group: "/login",
      ...geoFromHeaders(h), device_class: deviceFromUserAgent(h.get("user-agent") || ""),
      is_authenticated: true
    });
  } catch { /* logout must never depend on analytics */ }
  await supabase.auth.signOut();
  redirect("/login");
}
