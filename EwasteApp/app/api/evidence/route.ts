import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  entity_type: z.enum(["asset","job","lot","media","outbound","pallet","exception"]),
  entity_id: z.string().uuid(),
  evidence_type: z.string().trim().min(1).max(80),
  filename: z.string().trim().min(1).max(300),
  mime_type: z.string().max(200).nullable().optional(),
  size_bytes: z.number().int().nonnegative(),
  storage_key: z.string().trim().min(1).max(1000),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  source: z.string().max(120).optional(),
});

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid evidence metadata" }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data, error } = await supabase.from("evidence").insert({
    ...body.data,
    mime_type: body.data.mime_type || null,
    source: body.data.source || null,
    captured_by: user.id,
  }).select("id").single();

  if (error || !data) return NextResponse.json({ error: error?.message || "Could not record evidence" }, { status: 400 });
  await supabase.from("operational_events").insert({
    entity_type: body.data.entity_type,
    entity_id: body.data.entity_id,
    event_type: "EVIDENCE_ATTACHED",
    actor_id: user.id,
    details: { evidence_id: data.id, filename: body.data.filename, sha256: body.data.sha256 },
  });
  return NextResponse.json({ id: data.id });
}
