import { redirect } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { createClient } from "@/lib/supabase/server";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: access }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, role, active")
      .eq("id", user.id)
      .single(),
    supabase
      .from("program_access")
      .select("program")
      .eq("user_id", user.id),
  ]);

  if (!profile?.active) redirect("/login?error=Account%20inactive");

  const programs = (access ?? []).map((row) => row.program);
  if (programs.length === 0) redirect("/login?error=No%20active%20volunteer%20area%20is%20assigned.");

  return (
    <div className="shell">
      <AppNav fullName={profile.full_name} role={profile.role} programs={programs} />
      <main className="container">{children}</main>
    </div>
  );
}
