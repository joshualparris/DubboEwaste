import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { OPERATIONAL_DOCUMENTS, OPERATIONAL_DOCUMENT_SECTIONS } from "@/lib/operational-documents";

type OverrideSummary = {
  slug: string;
  title: string;
  section: string;
  summary: string;
  updated_at: string;
  version: number;
};

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("operational_document_overrides")
    .select("slug,title,section,summary,updated_at,version");

  const overrides = new Map(((data ?? []) as OverrideSummary[]).map((item) => [item.slug, item]));
  const merged = OPERATIONAL_DOCUMENTS.map((seed) => {
    const override = overrides.get(seed.slug);
    return {
      ...seed,
      title: override?.title ?? seed.title,
      section: override?.section ?? seed.section,
      summary: override?.summary ?? seed.summary,
      updatedAt: override?.updated_at ?? null,
      version: override?.version ?? 0,
      edited: Boolean(override),
    };
  });

  const sections = Array.from(new Set([...OPERATIONAL_DOCUMENT_SECTIONS, ...merged.map((document) => document.section)]));

  return <div className="stack">
    <div>
      <div className="badge">Operations library</div>
      <h1>Documents</h1>
      <p className="muted">Editable checklists, maps, SOPs and launch processes. Repository documents are the seeded baseline; AssetFlow edits are private working overrides.</p>
    </div>

    <nav className="doc-section-nav" aria-label="Document sections">
      {sections.map((section) => <a key={section} href={`#${section.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{section}</a>)}
    </nav>

    {sections.map((section) => {
      const documents = merged.filter((document) => document.section === section).sort((a, b) => a.sortOrder - b.sortOrder);
      if (!documents.length) return null;
      const id = section.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return <section className="stack" id={id} key={section}>
        <div><h2>{section}</h2><p className="muted small">{documents.length} document{documents.length === 1 ? "" : "s"}</p></div>
        <div className="grid">
          {documents.map((document) => <Link className="card doc-card" href={`/documents/${document.slug}`} key={document.slug}>
            <div className="actions">
              <span className="badge">{document.edited ? `Working v${document.version}` : "Repo baseline"}</span>
            </div>
            <h3>{document.title}</h3>
            <p className="muted">{document.summary}</p>
            {document.updatedAt ? <div className="small muted">Edited {new Date(document.updatedAt).toLocaleString("en-AU")}</div> : <div className="small muted">{document.sourcePath}</div>}
          </Link>)}
        </div>
      </section>;
    })}
  </div>;
}
