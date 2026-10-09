/** Analytics path grouping is intentionally lossy: no query strings, IDs or free text. */
const allowedSecond = new Set([
  "sessions", "event-desk", "training", "learning", "volunteers", "venues",
  "library-of-things", "repair-cafe", "opportunities", "new", "settings",
  "assets", "roles", "inventory", "certificates", "calendar"
]);
export function analyticsPath(raw: unknown): string {
  if (typeof raw !== "string") return "/";
  const segments = raw.split(/[?#]/, 1)[0].toLowerCase().split("/").filter(Boolean);
  const first = segments[0]?.replace(/[^a-z0-9-]/g, "") || "";
  if (!first) return "/";
  const second = segments[1]?.replace(/[^a-z0-9-]/g, "") || "";
  return "/" + first + (allowedSecond.has(second) ? "/" + second : "");
}
export function analyticsTarget(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw || raw.length > 250) return null;
  if (raw.startsWith("/")) return analyticsPath(raw);
  if (raw.startsWith("external:")) {
    const host = raw.slice(9).toLowerCase();
    return /^[a-z0-9.-]{1,69}$/.test(host) ? "external:" + host : "external";
  }
  return /^[a-z0-9_-]{1,60}$/.test(raw) ? raw : null;
}
export function geoFromHeaders(h: Headers) {
  const country = h.get("x-vercel-ip-country")?.toUpperCase() || "";
  const region = h.get("x-vercel-ip-country-region")?.toUpperCase() || "";
  return {
    country: /^[A-Z]{2}$/.test(country) ? country : null,
    region: /^[A-Z0-9-]{1,8}$/.test(region) ? region : null
  };
}
export function deviceFromUserAgent(ua: string): "mobile" | "tablet" | "desktop" | "unknown" {
  if (!ua) return "unknown";
  if (/ipad|tablet|kindle/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}
