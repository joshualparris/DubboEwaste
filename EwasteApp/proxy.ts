import { createServerClient } from "@supabase/ssr";
import { PROGRAMME_COOKIE, programmeHeader, canVisit, type ProgrammeContext } from "@/lib/programmes";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-assetflow-path", request.nextUrl.pathname);
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { headers: programmeHeader(request.cookies.get(PROGRAMME_COOKIE)?.value) },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const publicRoutes = ["/", "/login", "/signup", "/repair-cafe-dubbo", "/dubbo-repair-ewaste", "/dubbo-circular-economy", "/regional-computer-experts", "/repair-cafe-offline.html", "/repair-cafe-sw.js", "/ram-guide", "/ram-guide/gallery", "/storage-guide"];
  const privateRoute = !publicRoutes.includes(request.nextUrl.pathname) && !request.nextUrl.pathname.startsWith("/api/") && !request.nextUrl.pathname.startsWith("/verify/") && !request.nextUrl.pathname.startsWith("/_next/");
  if (user && privateRoute) {
    const { data } = await supabase.rpc("programme_context");
    const context = data as ProgrammeContext | null;
    if (context && !canVisit(request.nextUrl.pathname, context.selected, context.global_admin, context.role)) {
      const denied = NextResponse.redirect(new URL("/programmes?error=That%20section%20is%20not%20available%20in%20your%20programme", request.url));
      response.cookies.getAll().forEach(cookie => denied.cookies.set(cookie));
      return denied;
    }
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
