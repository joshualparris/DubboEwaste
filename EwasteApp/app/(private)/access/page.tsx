import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccessPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: access } = await supabase
    .from("program_access")
    .select("program")
    .eq("user_id", user.id);

  const programs = new Set((access ?? []).map((row) => row.program));
  const ewaste = programs.has("dubbo_ewaste");
  const repairCafe = programs.has("repair_cafe");

  if (repairCafe && !ewaste) redirect("/repair-cafe-volunteers");
  if (ewaste && !repairCafe) redirect("/dashboard");
  if (!ewaste && !repairCafe) redirect("/login?error=No%20active%20volunteer%20area%20is%20assigned.");

  return <div className="stack">
    <div>
      <div className="badge">Choose an area</div>
      <h1>Where do you want to go?</h1>
      <p className="muted">Your account has access to both DubboEwaste and Repair Café Dubbo.</p>
    </div>

    <div className="grid">
      <section className="card">
        <h2>DubboEwaste · AssetFlow</h2>
        <p>Intake, inventory, sanitisation, repairs, resale, recycling and operational records.</p>
        <Link className="button" href="/dashboard">Open AssetFlow</Link>
      </section>

      <section className="card">
        <h2>Repair Café Dubbo</h2>
        <p>Volunteer planning, venue research, repair scope, safety guidance and pilot preparation.</p>
        <Link className="button" href="/repair-cafe-volunteers">Open Volunteer Hub</Link>
      </section>
    </div>
  </div>;
}
