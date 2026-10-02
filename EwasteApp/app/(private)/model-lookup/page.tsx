import { createClient } from "@/lib/supabase/server";

type ModelRow = {
  id: string;
  manufacturer: string;
  model_name: string;
  category: string;
  support_summary: string;
  lock_risks: string;
  battery_notes: string;
  likely_route: string;
  source_url: string;
  source_checked: string;
  confidence: string;
};

export default async function ModelLookupPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const category = params.category ?? "";
  const supabase = await createClient();
  let query = supabase
    .from("model_support")
    .select("id,manufacturer,model_name,category,support_summary,lock_risks,battery_notes,likely_route,source_url,source_checked,confidence")
    .order("manufacturer")
    .order("model_name");

  if (category) query = query.eq("category", category);
  if (q) {
    const safe = q.replace(/[,%()]/g, " ");
    query = query.or(`manufacturer.ilike.%${safe}%,model_name.ilike.%${safe}%,category.ilike.%${safe}%`);
  }

  const { data, error } = await query;
  const models = (data ?? []) as ModelRow[];
  const categories = [...new Set(models.map((model) => model.category))].sort();

  return (
    <div className="stack">
      <div>
        <div className="badge">Evidence-backed lookup</div>
        <h1>Model lookup</h1>
        <p className="muted">Use this as a starting point, then verify the exact device, lock state, battery and support status.</p>
      </div>

      <form className="card form" method="get">
        <div className="two">
          <label>Search model or manufacturer<input name="q" defaultValue={q} placeholder="ThinkPad, iPhone, Chromebook" /></label>
          <label>Category<select name="category" defaultValue={category}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        </div>
        <div className="actions"><button className="button" type="submit">Search catalogue</button><a className="button secondary" href="/model-lookup">Clear</a></div>
      </form>

      {error ? <div className="error">The model catalogue could not be read. Apply migration 002 and confirm the signed-in user is active.</div> : null}
      {!error && !models.length ? <div className="card"><p className="muted">No matching model records. Add a source-dated record after verifying the exact model.</p></div> : null}
      <div className="grid">
        {models.map((model) => (
          <article className="card" key={model.id}>
            <div className="actions"><span className="badge">{model.category}</span><span className="muted small">{model.confidence}</span></div>
            <h2>{model.manufacturer} {model.model_name}</h2>
            <p>{model.support_summary}</p>
            <dl className="kv"><dt>Lock risks</dt><dd>{model.lock_risks}</dd><dt>Battery</dt><dd>{model.battery_notes}</dd><dt>Likely route</dt><dd>{model.likely_route}</dd></dl>
            <p className="muted small">Checked {model.source_checked} · <a href={model.source_url} target="_blank" rel="noreferrer">Source ↗</a></p>
          </article>
        ))}
      </div>
    </div>
  );
}
