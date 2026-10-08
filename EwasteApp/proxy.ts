import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function repairCafeOnlyPathAllowed(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/repair-cafe-dubbo") ||
    pathname.startsWith("/repair-cafe-volunteers") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api/repair-cafe-feedback")
  );
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: access } = await supabase
      .from("program_access")
      .select("program")
      .eq("user_id", user.id);

    const programs = new Set((access ?? []).map((row) => row.program));
    const hasEwaste = programs.has("dubbo_ewaste");
    const hasRepairCafe = programs.has("repair_cafe");

    if (hasRepairCafe && !hasEwaste && !repairCafeOnlyPathAllowed(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/repair-cafe-volunteers", request.url));
    }

    if (!hasRepairCafe && !hasEwaste && !request.nextUrl.pathname.startsWith("/login") && !request.nextUrl.pathname.startsWith("/signup")) {
      return NextResponse.redirect(new URL("/login?error=No%20active%20volunteer%20area%20is%20assigned.", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
