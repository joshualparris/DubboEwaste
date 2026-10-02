"use server";

import { createHash } from "node:crypto";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function signupError(message: string): never {
  redirect(`/signup?error=${encodeURIComponent(message)}`);
}

export async function signup(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");
  const accessCode = String(formData.get("access_code") ?? "");

  if (!fullName || fullName.length > 120) signupError("Enter your name.");
  if (!email || !email.includes("@") || email.length > 254) signupError("Enter a valid email address.");
  if (password.length < 10) signupError("Password must be at least 10 characters.");
  if (password !== confirmPassword) signupError("Passwords do not match.");
  if (!accessCode) signupError("Enter the DubboEwaste access code.");

  const supabase = await createClient();

  const { data: validCode, error: codeError } = await supabase.rpc(
    "verify_signup_access_code",
    { input_code: accessCode },
  );

  if (codeError) signupError("Signup service is temporarily unavailable.");
  if (validCode !== true) signupError("Invalid access code.");

  const accessCodeDigest = createHash("sha256").update(accessCode).digest("hex");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        signup_code_digest: accessCodeDigest,
      },
    },
  });

  if (error) {
    signupError(
      error.message.toLowerCase().includes("already")
        ? "An account with that email already exists."
        : "Could not create the account. Please try again.",
    );
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirect(
    "/login?message=" +
      encodeURIComponent("Account created. If Supabase asks you to confirm your email, do that first, then sign in."),
  );
}
