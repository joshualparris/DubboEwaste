import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OPERATIONAL_DOCUMENT_BY_SLUG } from "@/lib/operational-documents";
import { resetOperationalDocument, saveOperationalDocument } from "../../actions";

type Override = {
  title: string;
  section: string;
  summary: string;
  body_markdown: string;
  version: number;
};

export default async function EditDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seed = OPERATIONAL_DOCUMENT_BY_SLUG.get(slug);
  if (!seed) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role,active").eq("id", user.id).single();
  if (!profile?.active) redirect("/login?error=Account%20inactive");
  if (!["admin", "manager"].includes(profile.role)) redirect(`/documents/${slug}?error=You%20do%20not%20have%20permission%20to%20edit%20operations%20documents.`);

  const { data } = await supabase.from("operational_document_overrides").select("title,section,summary,body_markdown,version").eq("slug", slug).maybeSingle();
  const override = data as Override | null;

  return <div className="stack">
    <div className="doc-breadcrumbs"><Link href="/documents">Documents</Link><span>›</span><Link href={`/documents/${slug}`}>{override?.title ?? seed.title}</Link><span>›</span><span>Edit</span></div>
    <div>
      <div className="badge">Editable operations document</div>
      <h1>Edit {override?.title ?? seed.title}</h1>
      <p className="muted">Markdown is supported. Saving creates or updates the private AssetFlow working copy; the GitHub source remains unchanged.</p>
    </div>

    <form action={saveOperationalDocument} className="card form document-editor">
      <input type="hidden" name="slug" value={slug} />
      <label>Title<input name="title" defaultValue={override?.title ?? seed.title} maxLength={180} required /></label>
      <div className="two">
        <label>Section<input name="section" defaultValue={override?.section ?? seed.section} maxLength={80} required /></label>
        <label>Source<input value={seed.sourcePath} readOnly /></label>
      </div>
      <label>Summary<textarea name="summary" defaultValue={override?.summary ?? seed.summary} maxLength={500} /></label>
      <label>Document Markdown<textarea className="doc-editor-body" name="body_markdown" defaultValue={override?.body_markdown ?? seed.bodyMarkdown} required spellCheck={false} /></label>
      <div className="actions">
        <button className="button" type="submit">Save working copy</button>
        <Link className="button secondary" href={`/documents/${slug}`}>Cancel</Link>
      </div>
    </form>

    {override ? <form action={resetOperationalDocument} className="card form">
      <input type="hidden" name="slug" value={slug} />
      <div>
        <h2>Restore repository version</h2>
        <p className="muted">Deletes the private override and returns this website document to the current seeded repo version.</p>
      </div>
      <button className="button secondary" type="submit">Restore repo baseline</button>
    </form> : null}
  </div>;
}
