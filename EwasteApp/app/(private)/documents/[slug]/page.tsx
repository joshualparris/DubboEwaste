import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownDocument } from "@/components/MarkdownDocument";
import { createClient } from "@/lib/supabase/server";
import { OPERATIONAL_DOCUMENT_BY_SLUG, sourceUrl } from "@/lib/operational-documents";

type Override = {
  title: string;
  section: string;
  summary: string;
  body_markdown: string;
  version: number;
  updated_at: string;
};

export default async function DocumentPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { slug } = await params;
  const messages = await searchParams;
  const seed = OPERATIONAL_DOCUMENT_BY_SLUG.get(slug);
  if (!seed) notFound();

  const supabase = await createClient();
  const [{ data: override }, { data: { user } }] = await Promise.all([
    supabase.from("operational_document_overrides").select("title,section,summary,body_markdown,version,updated_at").eq("slug", slug).maybeSingle(),
    supabase.auth.getUser(),
  ]);

  let canEdit = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    canEdit = ["admin", "manager"].includes(profile?.role ?? "");
  }

  const working = override as Override | null;
  const document = {
    title: working?.title ?? seed.title,
    section: working?.section ?? seed.section,
    summary: working?.summary ?? seed.summary,
    body: working?.body_markdown ?? seed.bodyMarkdown,
    version: working?.version ?? 0,
    updatedAt: working?.updated_at ?? null,
  };

  const related = seed.relatedSlugs.map((relatedSlug) => OPERATIONAL_DOCUMENT_BY_SLUG.get(relatedSlug)).filter(Boolean);

  return <div className="stack">
    <div className="doc-breadcrumbs">
      <Link href="/documents">Documents</Link><span>›</span><span>{document.section}</span>
    </div>

    <div>
      <div className="actions">
        <span className="badge">{working ? `Editable working version · v${document.version}` : "Repository baseline"}</span>
      </div>
      <h1>{document.title}</h1>
      <p className="muted">{document.summary}</p>
      <div className="actions">
        {canEdit ? <Link className="button" href={`/documents/${slug}/edit`}>Edit document</Link> : null}
        <a className="button secondary" href={sourceUrl(seed.sourcePath)} target="_blank" rel="noreferrer">View repo source</a>
      </div>
      {document.updatedAt ? <p className="small muted">Working copy last edited {new Date(document.updatedAt).toLocaleString("en-AU")}.</p> : null}
    </div>

    {messages.error ? <div className="error">{messages.error}</div> : null}
    {messages.success ? <div className="success">{messages.success}</div> : null}

    <section className="card doc-paper">
      <MarkdownDocument body={document.body} />
    </section>

    {related.length ? <section className="stack">
      <div><h2>Related documents</h2><p className="muted small">Continue through the linked workflow without hunting through the repository.</p></div>
      <div className="grid">
        {related.map((item) => item ? <Link className="card doc-card" href={`/documents/${item.slug}`} key={item.slug}>
          <div className="badge">{item.section}</div>
          <h3>{item.title}</h3>
          <p className="muted">{item.summary}</p>
        </Link> : null)}
      </div>
    </section> : null}
  </div>;
}
