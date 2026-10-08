import { createBrowserClient } from "@supabase/ssr";

import { PROGRAMME_COOKIE, programmeHeader } from "@/lib/programmes";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { isSingleton: false, global: { headers: programmeHeader(document.cookie.split("; ").find(c => c.startsWith(PROGRAMME_COOKIE + "="))?.split("=").slice(1).join("=")) } },
  );
}
