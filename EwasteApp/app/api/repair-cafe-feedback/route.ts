import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const shortText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

const schema = z.object({
  participation: z.array(z.string().trim().min(1).max(80)).min(1).max(8),
  repair_interests: z.array(z.string().trim().min(1).max(80)).max(16).default([]),
  volunteer_roles: z.array(z.string().trim().min(1).max(80)).max(16).default([]),
  experience_level: z.enum(["LEARN","BEGINNER","HOBBYIST","EXPERIENCED","TRADE_PRO"]).optional().nullable(),
  preferred_venue: shortText(120),
  venue_suggestion: shortText(800),
  preferred_times: z.array(z.string().trim().min(1).max(80)).max(8).default([]),
  counterfactual: shortText(120),
  ideas: shortText(2000),
  accessibility_notes: shortText(1000),
  first_name: shortText(80),
  postcode: shortText(12),
  email: z.string().trim().email().max(254).optional().or(z.literal("")),
  contact_consent: z.boolean().default(false),
  privacy_acknowledged: z.literal(true),
  started_at: z.number().int().positive(),
  website: z.string().max(200).optional().default(""),
});

function clean(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const body = parsed.data;
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const elapsed = Date.now() - body.started_at;
  if (elapsed < 1800 || elapsed > 86_400_000) {
    return NextResponse.json({ error: "Please reload the page and try again." }, { status: 400 });
  }

  if (body.contact_consent && !body.email) {
    return NextResponse.json({ error: "Add an email address if you would like us to contact you." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("repair_cafe_public_feedback").insert({
    participation: body.participation,
    repair_interests: body.repair_interests,
    volunteer_roles: body.volunteer_roles,
    experience_level: body.experience_level || null,
    preferred_venue: clean(body.preferred_venue),
    venue_suggestion: clean(body.venue_suggestion),
    preferred_times: body.preferred_times,
    counterfactual: clean(body.counterfactual),
    ideas: clean(body.ideas),
    accessibility_notes: clean(body.accessibility_notes),
    first_name: clean(body.first_name),
    postcode: clean(body.postcode),
    email: clean(body.email),
    contact_consent: body.contact_consent,
    privacy_acknowledged: true,
  });

  if (error) {
    console.error("Repair Cafe feedback insert failed", error.code);
    return NextResponse.json({ error: "We couldn't save that response. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
