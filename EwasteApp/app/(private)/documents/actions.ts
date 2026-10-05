"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OPERATIONAL_DOCUMENT_BY_SLUG } from "@/lib/operational-documents";

function go(slug: string, key: "error" | "success", message: string): never {
  redirect(`/documents/${slug}?${key}=${encodeURIComponent(message)}`);
}

async function editor(slug: string) {
  const seed = OPERATIONAL_DOCUMENT_BY_SLUG.get(slug);
  if (!seed) go(slug, "error", "Unknown operations document.");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,active")
    .eq("id", user.id)
    .single();

  if (!profile?.active) redirect("/login?error=Account%20inactive");
  if (!["admin", "manager"].includes(profile.role)) go(slug, "error", "You do not have permission to edit operations documents.");

  return { supabase, user, seed };
}

export async function saveOperationalDocument(formData: FormData) {
  const slug = String(formData.get("slug") || "");
  const { supabase, user, seed } = await editor(slug);
  const title = String(formData.get("title") || "").trim();
  const section = String(formData.get("section") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const body = String(formData.get("body_markdown") || "");

  if (!title || !section || !body.trim()) go(slug, "error", "Title, section and document body are required.");
  if (title.length > 180 || section.length > 80 || summary.length > 500 || body.length > 500000) {
    go(slug, "error", "Document exceeds the allowed size.");
  }

  const { data: current } = await supabase
    .from("operational_document_overrides")
    .select("version")
    .eq("slug", slug)
    .maybeSingle();

  const { error } = await supabase.from("operational_document_overrides").upsert({
    slug,
    title,
    section,
    summary,
    body_markdown: body,
    source_path: seed.sourcePath,
    version: (current?.version ?? 0) + 1,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) go(slug, "error", error.message);
  revalidatePath("/documents");
  revalidatePath(`/documents/${slug}`);
  go(slug, "success", "Document saved.");
}

export async function resetOperationalDocument(formData: FormData) {
  const slug = String(formData.get("slug") || "");
  const { supabase } = await editor(slug);
  const { error } = await supabase.from("operational_document_overrides").delete().eq("slug", slug);
  if (error) go(slug, "error", error.message);
  revalidatePath("/documents");
  revalidatePath(`/documents/${slug}`);
  go(slug, "success", "Restored the repository version.");
}
