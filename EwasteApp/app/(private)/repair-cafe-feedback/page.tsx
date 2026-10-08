import { ResponsiveTable } from "@/components/ResponsiveTable";
import { createClient } from "@/lib/supabase/server";

function counts(rows: any[], key: string) {
  const map = new Map<string, number>();
  for (const row of rows) {
    const values = Array.isArray(row[key]) ? row[key] : row[key] ? [row[key]] : [];
    for (const value of values) map.set(String(value), (map.get(String(value)) || 0) + 1);
  }
  return [...map.entries()].sort((a,b) => b[1]-a[1]);
}

export default async function RepairCafeFeedbackPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="error">Sign in required.</div>;

  const [{ data: profile }, { data: access }] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
    supabase.from("program_access").select("program").eq("user_id", user.id),
  ]);

  const programs = new Set((access ?? []).map((row) => row.program));
  if (!profile || !["admin","manager"].includes(profile.role) || !programs.has("repair_cafe")) {
    return <div className="error">Repair Café public feedback is limited to Repair Café managers and administrators.</div>;
  }

  const { data, error } = await supabase
    .from("repair_cafe_public_feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return <div className="error">Could not load feedback: {error.message}</div>;
  const rows = data ?? [];
  const participation = counts(rows, "participation");
  const repairs = counts(rows, "repair_interests");
  const venues = counts(rows, "preferred_venue");

  return <div className="stack">
    <div>
      <div className="badge">Community research</div>
      <h1>Repair Café public feedback</h1>
      <p className="muted">Private responses from the public Repair Café Dubbo interest form. Contact details are shown only here and only when supplied.</p>
    </div>

    <div className="grid3">
      <section className="card"><h2>Responses</h2><div className="metric">{rows.length}</div><p className="muted">Latest 200 submissions</p></section>
      <section className="card"><h2>Top repair interests</h2>{repairs.slice(0,5).map(([v,n])=><p key={v}><strong>{n}</strong> · {v}</p>)}</section>
      <section className="card"><h2>Venue preferences</h2>{venues.slice(0,5).map(([v,n])=><p key={v}><strong>{n}</strong> · {v}</p>)}</section>
    </div>

    <section className="card">
      <h2>How people want to participate</h2>
      <div className="chips">{participation.map(([v,n])=><span className="chip" key={v}>{v}: {n}</span>)}</div>
    </section>

    <section className="card">
      <h2>Submissions</h2>
      {rows.length === 0 ? <p className="muted">No public responses yet.</p> :
      <div className="table-wrap"><ResponsiveTable><thead><tr>
        <th>Date</th><th>Name / postcode</th><th>Participation</th><th>Repair interests</th><th>Volunteer roles</th><th>Venue / timing</th><th>Ideas / access</th><th>Contact</th>
      </tr></thead><tbody>
        {rows.map((row:any)=><tr key={row.id}>
          <td>{new Date(row.created_at).toLocaleString("en-AU",{dateStyle:"medium",timeStyle:"short",timeZone:"Australia/Sydney"})}</td>
          <td>{row.first_name || "Anonymous"}{row.postcode ? <><br/><span className="muted">{row.postcode}</span></> : null}</td>
          <td>{(row.participation||[]).join(", ") || "—"}</td>
          <td>{(row.repair_interests||[]).join(", ") || "—"}</td>
          <td>{(row.volunteer_roles||[]).join(", ") || "—"}{row.experience_level ? <><br/><span className="muted">{row.experience_level}</span></> : null}</td>
          <td>{row.preferred_venue || "—"}{row.venue_suggestion ? <><br/><span>{row.venue_suggestion}</span></> : null}<br/><span className="muted">{(row.preferred_times||[]).join(", ")}</span></td>
          <td>{row.ideas || "—"}{row.accessibility_notes ? <><br/><strong>Access:</strong> {row.accessibility_notes}</> : null}{row.counterfactual ? <><br/><span className="muted">Without café: {row.counterfactual}</span></> : null}</td>
          <td>{row.contact_consent && row.email ? <a href={`mailto:${row.email}`}>{row.email}</a> : <span className="muted">No follow-up requested</span>}</td>
        </tr>)}
      </tbody></ResponsiveTable></div>}
    </section>
  </div>;
}
