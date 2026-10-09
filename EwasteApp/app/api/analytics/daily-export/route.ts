import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Public by design: returns only >=5-event daily aggregate buckets (enforced in SQL).
 *  Never expose the detailed administrator report through this route. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function yesterdaySydney(): string {
  const dt = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const tokens = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Australia/Sydney", day: "2-digit", month: "2-digit", year: "numeric"
  }).formatToParts(dt);
  const part = (key: string) => tokens.find(v => v.type === key)?.value ?? "";
  return [part("year"), part("month"), part("day")].join("-");
}

export async function GET(request: Request) {
  const given = new URL(request.url).searchParams.get("day");
  const day = given ?? yesterdaySydney();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("analytics_public_daily_report", { p_day: day });
  if (error) {
    console.error("Public daily analytics failed:", error.code);
    return NextResponse.json({ error: "Report not available" }, { status: error.code === "22023" ? 400 : 503 });
  }
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=1800",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
