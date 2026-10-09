"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ENDPOINT = "/api/analytics";
function enabled(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return !nav.globalPrivacyControl && nav.doNotTrack !== "1";
}
function submit(event: "page_view" | "click", page: string, target?: string) {
  if (!enabled()) return;
  const payload = JSON.stringify({ event, page, target });
  try {
    const blob = new Blob([payload], { type: "text/plain" });
    if (navigator.sendBeacon?.(ENDPOINT, blob)) return;
    void fetch(ENDPOINT, { method: "POST", body: payload, headers: { "Content-Type": "text/plain" },
      keepalive: true, credentials: "same-origin" }).catch(() => undefined);
  } catch { /* analytics must not block the application */ }
}
export function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => { if (pathname) submit("page_view", pathname); }, [pathname]);
  useEffect(() => {
    function clicked(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const el = event.target.closest("a,button,[data-analytics-event]");
      if (!el || el.closest("[data-no-analytics]")) return;
      const explicit = el.getAttribute("data-analytics-event");
      let target = explicit || (el.tagName === "BUTTON" ? "button" : "interaction");
      if (el instanceof HTMLAnchorElement) {
        try {
          const url = new URL(el.href, window.location.href);
          target = url.origin === window.location.origin ? url.pathname : "external:" + url.hostname;
        } catch { target = "link"; }
      }
      submit("click", window.location.pathname, target);
    }
    document.addEventListener("click", clicked, { capture: true });
    return () => document.removeEventListener("click", clicked, { capture: true });
  }, []);
  return null;
}
