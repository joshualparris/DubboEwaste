import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyticsPath, analyticsTarget, geoFromHeaders, deviceFromUserAgent } from "@/lib/analytics";

export const runtime = "nodejs";
const allowed = new Map([
  ["https://dubbo-ewaste-app.vercel.app", "dubbo_ewaste"],
  ["https://circular-economy-dubbo.vercel.app", "circular_economy"]
]);

function cors(origin: string | null): HeadersInit {
  return origin && allowed.has(origin)
    ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type", Vary: "Origin" }
    : {};
}
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new Response(null, { status: allowed.has(origin || "") ? 204 : 403, headers: cors(origin) });
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const site = allowed.get(origin || "");
  if (!site) return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 1200)
    return NextResponse.json({ error: "Too large" }, { status: 413, headers: cors(origin) });
  let payload: { event?: unknown; page?: unknown; target?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 1200) throw new Error("Large payload");
    payload = JSON.parse(raw);
    if (!payload || typeof payload !== "object") throw new Error("Invalid");
  } catch {
    return NextResponse.json({ error: "Invalid event" }, { status: 400, headers: cors(origin) });
  }
  if (payload.event !== "page_view" && payload.event !== "click")
    return NextResponse.json({ error: "Event not allowed" }, { status: 400, headers: cors(origin) });

  const supabase = await createClient();
  // Auth only comes from a verified same-origin session, never from a browser-supplied flag.
  const isAuthenticated = site === "dubbo_ewaste" &&
    (await supabase.auth.getUser()).data.user != null;
  const geo = geoFromHeaders(request.headers);
  const ref = request.headers.get("referer") || "";
  let referrerDomain: string | null = null;
  try {
    const host = new URL(ref).hostname.toLowerCase();
    if (/^[a-z0-9.-]{1,100}$/.test(host)) referrerDomain = host;
  } catch { /* no referrer */ }

  const { error } = await supabase.from("analytics_events").insert({
    site, event_name: payload.event, page_group: analyticsPath(payload.page),
    target_group: analyticsTarget(payload.target), ...geo,
    device_class: deviceFromUserAgent(request.headers.get("user-agent") || ""),
    referrer_domain: referrerDomain, is_authenticated: isAuthenticated
  });
  if (error) {
    console.error("Analytics event write failed:", error.code);
    return NextResponse.json({ error: "Unavailable" }, { status: 503, headers: cors(origin) });
  }
  return new Response(null, { status: 204, headers: cors(origin) });
}
