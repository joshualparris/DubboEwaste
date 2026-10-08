import { ResponsiveTable } from "@/components/ResponsiveTable";
import { createLocation } from "../operations/actions";
import { createClient } from "@/lib/supabase/server";

export default async function LocationsPage({ searchParams }: { searchParams: Promise<{error?:string;success?:string}> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: locations } = await supabase.from("locations").select("*").order("name");
  return <div className="stack">
    <div><div className="badge">P0</div><h1>Locations</h1><p className="muted">Physical custody locations: sites, zones, benches, shelves and quarantine areas.</p></div>
    {params.error ? <div className="error">{params.error}</div> : null}
    {params.success ? <div className="success">{params.success}</div> : null}
    <form action={createLocation} className="card form">
      <h2>Add location</h2>
      <div className="two"><label>Name<input name="name" required placeholder="Wipe Bench 1" /></label>
      <label>Kind<select name="kind" defaultValue="ZONE"><option>SITE</option><option>ZONE</option><option>SHELF</option><option>BENCH</option><option>QUARANTINE</option><option>OTHER</option></select></label></div>
      <button className="button" type="submit">Create location</button>
    </form>
    <section className="card table-wrap"><ResponsiveTable><thead><tr><th>Location</th><th>Kind</th><th>Active</th></tr></thead>
      <tbody>{(locations ?? []).map(l => <tr key={l.id}><td><strong>{l.name}</strong></td><td>{l.kind}</td><td>{l.active ? "Yes" : "No"}</td></tr>)}</tbody>
    </ResponsiveTable></section>
  </div>;
}
