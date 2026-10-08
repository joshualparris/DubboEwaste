"use server";

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
  if (!accessCode) signupError("Enter your programme access code.");

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        signup_access_code: accessCode,
      },
    },
  });

  if (error) {
    signupError(
      error.message.toLowerCase().includes("already")
        ? "An account with that email already exists."
        : "Could not create the account. Check the access code and details, then try again.",
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
