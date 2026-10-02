import { redirect } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { createClient } from "@/lib/supabase/server";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, active")
    .eq("id", user.id)
    .single();

  if (!profile?.active) redirect("/login?error=Account%20inactive");

  return (
    <div className="shell">
      <AppNav fullName={profile.full_name} role={profile.role} />
      <main className="container">{children}</main>
    </div>
  );
}
