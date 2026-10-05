import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { createAdminRecord, deleteAdminRecord, updateAdminRecord } from "./actions";

type Target = {
  table_name: string;
  label: string;
  category: string;
};

function editableRecord(row: Record<string, unknown>) {
  const copy = { ...row };
  for (const key of [
    "id", "created_by", "decided_by", "graded_by", "added_by",
    "created_at", "updated_at", "captured_at", "graded_at", "decided_at",
  ]) {
    delete copy[key];
  }
  return copy;
}

export default async function AdminDataPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string; error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();

  const { data: targetData } = await supabase
    .from("permission_targets")
    .select("table_name,label,category")
    .eq("mutable", true)
    .neq("table_name", "operational_document_overrides")
    .order("category")
    .order("label");

  const targets = (targetData ?? []) as Target[];
  const selected = targets.some((target) => target.table_name === params.table)
    ? params.table!
    : (targets.find((target) => target.table_name === "customers")?.table_name ?? targets[0]?.table_name);

  if (!selected) {
    return <div className="error">No mutable permission targets are configured.</div>;
  }

  const { data, error } = await supabase.from(selected).select("*").limit(50);
  const rows = ((data ?? []) as Record<string, unknown>[]);
  const selectedTarget = targets.find((target) => target.table_name === selected);

  return (
    <div className="stack">
      <div>
        <div className="badge">Admin · CRUD console</div>
        <h1>Admin Data</h1>
        <p className="muted">
          Direct CRUD for mutable operational tables. Audit/history tables are intentionally excluded.
        </p>
        <div className="actions">
          <Link className="button secondary" href="/admin/permissions">Roles & permissions</Link>
        </div>
      </div>

      {params.error ? <div className="error">{params.error}</div> : null}
      {params.success ? <div className="success">{params.success}</div> : null}
      {error ? <div className="error">{error.message}</div> : null}

      <section className="card form">
        <div>
          <strong>Table: {selectedTarget?.label ?? selected}</strong>
          <div className="muted small">{selectedTarget?.category ?? "Operations"} · {selected}</div>
        </div>
        <div className="actions">
          {targets.map((target) => (
            <Link
              key={target.table_name}
              className="button secondary"
              href={`/admin/data?table=${encodeURIComponent(target.table_name)}`}
            >
              {target.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="card form">
        <h2>Create in {selectedTarget?.label ?? selected}</h2>
        <p className="muted small">
          Enter a JSON object containing the fields for the new record. Actor fields such as created_by are filled automatically.
        </p>
        <form action={createAdminRecord} className="form">
          <input type="hidden" name="table_name" value={selected} />
          <textarea name="json" defaultValue={"{}"} spellCheck={false} required />
          <button className="button" type="submit">Create record</button>
        </form>
      </section>

      <section className="stack">
        <div><h2>Latest records</h2><p className="muted small">Showing up to 50 rows.</p></div>
        {rows.length === 0 ? <div className="card muted">No records.</div> : null}
        {rows.map((row, index) => {
          const id = String(row.id ?? "");
          return (
            <details className="card" key={id || index}>
              <summary><strong>{id || `Row ${index + 1}`}</strong></summary>
              <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                {JSON.stringify(row, null, 2)}
              </pre>
              {id ? (
                <div className="stack">
                  <form action={updateAdminRecord} className="form">
                    <input type="hidden" name="table_name" value={selected} />
                    <input type="hidden" name="id" value={id} />
                    <label>
                      Editable fields
                      <textarea
                        name="json"
                        defaultValue={JSON.stringify(editableRecord(row), null, 2)}
                        spellCheck={false}
                        required
                      />
                    </label>
                    <button className="button" type="submit">Update record</button>
                  </form>
                  <form action={deleteAdminRecord}>
                    <input type="hidden" name="table_name" value={selected} />
                    <input type="hidden" name="id" value={id} />
                    <button className="button secondary" type="submit">Delete record</button>
                  </form>
                </div>
              ) : null}
            </details>
          );
        })}
      </section>
    </div>
  );
}
