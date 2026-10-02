import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data: evidence } = await supabase.from("evidence").select("storage_key").eq("id", id).single();
  if (!evidence) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await supabase.storage.from("evidence").createSignedUrl(evidence.storage_key, 60);
  if (error || !data?.signedUrl) return NextResponse.json({ error: "Could not create secure link" }, { status: 500 });
  return NextResponse.redirect(data.signedUrl);
}
