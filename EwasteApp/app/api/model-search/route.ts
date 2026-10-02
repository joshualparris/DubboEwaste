import { NextRequest, NextResponse } from "next/server";

type WikidataSearchItem = {
  id: string;
  label?: string;
  description?: string;
};

type WikidataSearchResponse = {
  search?: WikidataSearchItem[];
};

const DEVICE_WORDS =
  /smartphone|mobile phone|cell phone|tablet|laptop|notebook|chromebook|personal computer|desktop computer|workstation|computer model|electronic device|router|wireless access point|network switch|monitor|display|printer|iphone|macbook/i;

const BRANDS = [
  "Apple", "Samsung", "Google", "Dell", "Lenovo", "HP", "Hewlett-Packard",
  "Acer", "ASUS", "Microsoft", "Realme", "OPPO", "OnePlus", "Xiaomi",
  "Motorola", "Nokia", "Huawei", "Toshiba", "Sony", "LG", "Ubiquiti", "Cisco",
];

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferManufacturer(label: string, query: string) {
  const brand = BRANDS.find((item) =>
    label.toLowerCase().startsWith(item.toLowerCase() + " ") ||
    label.toLowerCase() === item.toLowerCase()
  );
  if (brand) return brand === "Hewlett-Packard" ? "HP" : brand;

  const firstQueryToken = query.trim().split(/\s+/)[0] ?? "";
  if (
    firstQueryToken.length >= 2 &&
    label.toLowerCase().startsWith(firstQueryToken.toLowerCase() + " ")
  ) {
    return titleCase(firstQueryToken);
  }
  return "";
}

function inferCategory(label: string, description: string) {
  const text = `${label} ${description}`.toLowerCase();
  if (/chromebook/.test(text)) return "chromebook";
  if (/smartphone|mobile phone|cell phone|iphone/.test(text)) return "phone";
  if (/tablet|ipad/.test(text)) return "tablet";
  if (/laptop|notebook|macbook/.test(text)) return "laptop";
  if (/desktop|workstation|personal computer|computer model/.test(text)) return "desktop";
  if (/router|wireless access point|network switch/.test(text)) return "networking";
  if (/monitor|display/.test(text)) return "monitor";
  if (/printer/.test(text)) return "printer";
  return "other";
}

function modelName(label: string, manufacturer: string) {
  if (!manufacturer) return label;
  const prefix = new RegExp(`^${manufacturer.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\s+`, "i");
  const stripped = label.replace(prefix, "").trim();
  return stripped || label;
}

async function searchWikidata(term: string) {
  const url = new URL("https://www.wikidata.org/w/api.php");
  url.searchParams.set("action", "wbsearchentities");
  url.searchParams.set("format", "json");
  url.searchParams.set("language", "en");
  url.searchParams.set("uselang", "en");
  url.searchParams.set("type", "item");
  url.searchParams.set("limit", "10");
  url.searchParams.set("search", term);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "DubboEwaste/0.1 (https://github.com/joshualparris/DubboEwaste)",
    },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Wikidata returned ${response.status}`);
  const body = (await response.json()) as WikidataSearchResponse;
  return body.search ?? [];
}

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 80);
  if (query.length < 2) return NextResponse.json({ results: [] });

  const generic = /smartphone|phone|tablet|laptop|notebook|chromebook|computer|router|monitor|printer/i.test(query);
  const terms = generic
    ? [query]
    : [query, `${query} smartphone`, `${query} laptop`, `${query} tablet`];

  try {
    const batches = await Promise.all(terms.map(searchWikidata));
    const seen = new Set<string>();
    const rows = batches
      .flat()
      .filter((item) => {
        if (!item.id || seen.has(item.id)) return false;
        seen.add(item.id);
        const text = `${item.label ?? ""} ${item.description ?? ""}`;
        return DEVICE_WORDS.test(text);
      })
      .map((item) => {
        const label = item.label ?? item.id;
        const description = item.description ?? "Wikidata device record";
        const manufacturer = inferManufacturer(label, query);
        const category = inferCategory(label, description);
        return {
          manufacturer: manufacturer || "Unknown",
          model_name: modelName(label, manufacturer),
          category,
          support_summary: `Live Wikidata match: ${description}. Verify the exact model and current vendor support before routing.`,
          lock_risks:
            category === "phone" || category === "tablet"
              ? "Check activation/account lock, MDM and blacklist/carrier status."
              : "Check firmware/BIOS password, MDM/Autopilot and organisation ownership.",
          battery_notes:
            ["phone", "tablet", "laptop", "chromebook"].includes(category)
              ? "Inspect battery health, swelling, heat and charging before reuse."
              : "Check power supply, ports and electrical condition.",
          likely_route: "Hold / further triage until exact model and condition are verified.",
          source_url: `https://www.wikidata.org/wiki/${item.id}`,
          source_checked: new Date().toISOString().slice(0, 10),
          confidence: "RESEARCH LEAD",
          external_source: "Wikidata",
          source_id: item.id,
        };
      })
      .filter((row) => row.model_name.length > 1)
      .slice(0, 12);

    return NextResponse.json(
      { results: rows },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch (error) {
    console.error("Wikidata lookup failed", error);
    return NextResponse.json({ results: [], error: "Live model lookup unavailable" }, { status: 502 });
  }
}
