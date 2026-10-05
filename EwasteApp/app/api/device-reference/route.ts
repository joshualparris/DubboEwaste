import { NextRequest, NextResponse } from "next/server";
import { gunzipSync } from "node:zlib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ModelRecord = {
  manufacturer: string;
  model_name: string;
  aliases?: string[];
  identifiers?: string[];
  category: string;
  support_summary: string;
  lock_risks: string;
  battery_notes: string;
  likely_route: string;
  source_url: string;
  source_checked: string;
  confidence: string;
  external_source: string;
  source_id: string;
};

type GoogleDevice = {
  brand: string;
  marketingName: string;
  device: string;
  model: string;
};

type FccRecord = {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  fccid?: string;
  grantee?: string;
  grantDate?: string;
  applicationPurpose?: string;
};

const GOOGLE_DEVICES_URL =
  "https://storage.googleapis.com/play_public/supported_devices.csv";
const PCI_IDS_URL = "https://pci-ids.ucw.cz/v2.2/pci.ids";
const USB_IDS_URL = "https://usb-ids.gowdy.us/usb.ids";
const LVFS_METADATA_URL = "https://cdn.fwupd.org/downloads/firmware.xml.gz";
const ICECAT_URL = "https://live.icecat.biz/api/";

const KNOWN_BRANDS = [
  "Apple",
  "Samsung",
  "Google",
  "Dell",
  "Lenovo",
  "HP",
  "Hewlett-Packard",
  "Acer",
  "ASUS",
  "Microsoft",
  "Realme",
  "OPPO",
  "OnePlus",
  "Xiaomi",
  "Motorola",
  "Nokia",
  "Huawei",
  "Toshiba",
  "Sony",
  "LG",
  "Ubiquiti",
  "Cisco",
];

const FAMILY_BRANDS: Array<[RegExp, string]> = [
  [/\bimac\b|\bmacbook\b|\biphone\b|\bipad\b/i, "Apple"],
  [/\blatitude\b|\boptiplex\b|\bprecision\b|\bxps\b/i, "Dell"],
  [/\bthinkpad\b|\bthinkcentre\b|\bthinkbook\b|\bideapad\b|\blegion\b/i, "Lenovo"],
  [/\belitebook\b|\bprobook\b|\bzbook\b|\belitedesk\b|\bprodesk\b/i, "HP"],
  [/\bsurface\b/i, "Microsoft"],
  [/\bgalaxy\b/i, "Samsung"],
  [/\bpixel\b/i, "Google"],
];

let googleCatalogPromise: Promise<GoogleDevice[]> | null = null;
let pciIdsPromise: Promise<string> | null = null;
let usbIdsPromise: Promise<string> | null = null;
let lvfsXmlPromise: Promise<string> | null = null;

function checkedToday() {
  return new Date().toISOString().slice(0, 10);
}

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function tokens(value: string) {
  return normalise(value).split(" ").filter(Boolean);
}

function inferManufacturer(query: string) {
  const family = FAMILY_BRANDS.find(([pattern]) => pattern.test(query))?.[1];
  if (family) return family;

  const lower = query.toLowerCase();
  const brand = KNOWN_BRANDS.find(
    (item) =>
      lower === item.toLowerCase() ||
      lower.startsWith(item.toLowerCase() + " "),
  );
  if (brand === "Hewlett-Packard") return "HP";
  return brand ?? "";
}

function inferCategory(value: string) {
  const text = value.toLowerCase();
  if (/chromebook/.test(text)) return "chromebook";
  if (/tablet|ipad|tab\b/.test(text)) return "tablet";
  if (/tv|television/.test(text)) return "tv";
  if (/phone|smartphone|iphone|galaxy|pixel|android/.test(text)) return "phone";
  if (/laptop|notebook|macbook|thinkpad|ideapad|probook|elitebook|zbook|latitude|xps/.test(text)) return "laptop";
  if (/desktop|workstation|imac|optiplex|thinkcentre|prodesk|elitedesk/.test(text)) return "desktop";
  if (/monitor|display/.test(text)) return "monitor";
  if (/printer/.test(text)) return "printer";
  if (/router|switch|wireless|network|access point/.test(text)) return "networking";
  return "other";
}

function modelRecord(
  partial: Pick<ModelRecord, "manufacturer" | "model_name" | "category" | "support_summary" | "source_url" | "confidence" | "external_source" | "source_id"> &
    Partial<ModelRecord>,
): ModelRecord {
  return {
    aliases: [],
    identifiers: [],
    lock_risks:
      partial.lock_risks ??
      "Verify ownership and any account, firmware, MDM or organisation-management locks before reuse.",
    battery_notes:
      partial.battery_notes ??
      "Inspect battery, charging, power and physical condition as applicable.",
    likely_route:
      partial.likely_route ??
      "Hold / further triage until exact identity, lock state and condition are verified.",
    source_checked: partial.source_checked ?? checkedToday(),
    ...partial,
  };
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

async function fetchGoogleCatalog() {
  if (!googleCatalogPromise) {
    googleCatalogPromise = (async () => {
      const response = await fetch(GOOGLE_DEVICES_URL, {
        headers: { "User-Agent": "DubboEwaste AssetFlow/0.1" },
        next: { revalidate: 86400 },
      });
      if (!response.ok) throw new Error(`Google device catalog returned ${response.status}`);

      const bytes = new Uint8Array(await response.arrayBuffer());
      const text = new TextDecoder("utf-16le").decode(bytes).replace(/^\uFEFF/, "");
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return [];

      const header = parseCsvLine(lines[0]).map((value) => normalise(value));
      const brandIndex = Math.max(
        header.indexOf("retail branding"),
        header.indexOf("manufacturer"),
      );
      const marketingIndex = Math.max(
        header.indexOf("marketing name"),
        header.indexOf("model name"),
      );
      const deviceIndex = Math.max(
        header.indexOf("device"),
        header.indexOf("device code"),
      );
      const modelIndex = Math.max(
        header.indexOf("model"),
        header.indexOf("model code"),
      );

      return lines.slice(1).flatMap((line) => {
        const row = parseCsvLine(line);
        const brand = row[brandIndex >= 0 ? brandIndex : 0]?.trim() ?? "";
        const marketingName =
          row[marketingIndex >= 0 ? marketingIndex : 1]?.trim() ?? "";
        const device = row[deviceIndex >= 0 ? deviceIndex : 2]?.trim() ?? "";
        const model = row[modelIndex >= 0 ? modelIndex : 3]?.trim() ?? "";
        if (!marketingName && !model) return [];
        return [{ brand, marketingName, device, model }];
      });
    })().catch((error) => {
      googleCatalogPromise = null;
      throw error;
    });
  }
  return googleCatalogPromise;
}

function googleScore(row: GoogleDevice, query: string) {
  const needle = normalise(query);
  const full = normalise(
    `${row.brand} ${row.marketingName} ${row.device} ${row.model}`,
  );
  if ([row.model, row.device, row.marketingName, `${row.brand} ${row.marketingName}`]
    .map(normalise)
    .includes(needle)) {
    return 100;
  }
  const queryTokens = tokens(query);
  const hits = queryTokens.filter((token) => full.includes(token)).length;
  return queryTokens.length ? Math.round((hits / queryTokens.length) * 90) : 0;
}

async function searchGooglePlay(query: string) {
  if (query.length < 3) return [];
  const rows = await fetchGoogleCatalog();
  return rows
    .map((row) => ({ row, score: googleScore(row, query) }))
    .filter(({ score }) => score >= 65)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ row, score }) =>
      modelRecord({
        manufacturer: row.brand || "Unknown",
        model_name: row.marketingName || row.model,
        identifiers: [row.device, row.model].filter(Boolean),
        aliases: [row.model, row.device].filter(Boolean),
        category: inferCategory(`${row.marketingName} ${row.model}`) || "phone",
        support_summary:
          `Google Play supported-device match. Marketing name: ${row.marketingName || "unknown"}; device code: ${row.device || "unknown"}; model code: ${row.model || "unknown"}. Google lists publicly launched Android devices that passed the Android Compatibility Program.`,
        source_url:
          "https://support.google.com/googleplay/android-developer/answer/9859371",
        confidence: score >= 95 ? "EXACT IDENTIFIER" : "STRONG CATALOG MATCH",
        external_source: "Google Play supported devices",
        source_id: `google-play:${row.device || row.model || row.marketingName}`,
      }),
    );
}

function extractGtin(query: string) {
  const explicit = query.match(/(?:gtin|ean|upc|icecat)\s*[:#=]?\s*(\d{8,14})/i)?.[1];
  const compact = query.replace(/\D/g, "");
  if (explicit) return explicit;
  if ([8, 12, 13, 14].includes(compact.length) && /^\d+$/.test(query.trim())) return compact;
  return "";
}

function extractMpn(query: string) {
  const explicit = query.match(/(?:mpn|part|sku)\s*[:#=]\s*([a-z0-9._\/-]+)/i)?.[1];
  if (!explicit) return null;
  const brand = inferManufacturer(query.replace(explicit, ""));
  return brand ? { brand, partCode: explicit } : null;
}

async function searchIcecat(query: string) {
  const gtin = extractGtin(query);
  const mpn = extractMpn(query);
  if (!gtin && !mpn) return [];

  const username = process.env.ICECAT_USERNAME || "openIcecat-live";
  const url = new URL(ICECAT_URL);
  url.searchParams.set("UserName", username);
  url.searchParams.set("Language", "en");
  if (gtin) {
    url.searchParams.set("GTIN", gtin);
  } else if (mpn) {
    url.searchParams.set("Brand", mpn.brand);
    url.searchParams.set("ProductCode", mpn.partCode);
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "DubboEwaste AssetFlow/0.1",
    },
    next: { revalidate: 86400 },
  });
  if (!response.ok) return [];

  const body = (await response.json()) as any;
  const info = body?.data?.GeneralInfo;
  if (!info) return [];

  const brand =
    info?.Brand || info?.BrandInfo?.BrandName || info?.BrandInfo?.Brand || "";
  const productName =
    info?.ProductName ||
    info?.TitleInfo?.GeneratedIntTitle ||
    info?.TitleInfo?.BrandLocalTitle?.Value ||
    "";
  const partCode = info?.BrandPartCode || info?.BrandProductCode || "";
  const icecatId = info?.IcecatId || body?.data?.GeneralInfo?.IcecatId || "";

  if (!productName && !partCode) return [];

  return [
    modelRecord({
      manufacturer: brand || mpn?.brand || "Unknown",
      model_name: productName || partCode,
      identifiers: [gtin, partCode].filter(Boolean),
      aliases: [partCode].filter(Boolean),
      category: inferCategory(
        `${productName} ${info?.Category?.Name?.Value ?? ""}`,
      ),
      support_summary:
        "Open Icecat product-data match. Verify the printed model/product code because Icecat is a product catalogue, not a unique-device identity source.",
      source_url: icecatId
        ? `https://icecat.biz/p/${icecatId}`
        : "https://icecat.com/content-subscription/",
      confidence: gtin ? "EXACT GTIN" : "EXACT BRAND + MPN",
      external_source: "Open Icecat",
      source_id: `icecat:${icecatId || gtin || partCode}`,
    }),
  ];
}

function extractFccId(query: string) {
  return query
    .match(/fcc\s*(?:id)?\s*[:#=]?\s*([a-z0-9-]{4,20})/i)?.[1]
    ?.toUpperCase() ?? "";
}

async function searchFcc(query: string) {
  const fccId = extractFccId(query);
  if (!fccId) return [];

  const url = new URL("https://apps.fcc.gov/OETLabServices/getFCCIDList");
  url.searchParams.set("fccId", fccId);
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "DubboEwaste AssetFlow/0.1",
    },
    next: { revalidate: 86400 },
  });
  if (!response.ok) return [];

  const body = (await response.json()) as FccRecord[] | { results?: FccRecord[] };
  const rows = Array.isArray(body) ? body : body.results ?? [];
  return rows.slice(0, 8).map((row) =>
    modelRecord({
      manufacturer: row.grantee || "Unknown",
      model_name: row.fccid || fccId,
      identifiers: [row.fccid || fccId],
      category: "other",
      support_summary:
        `FCC equipment-authorisation match. Grantee: ${row.grantee || "unknown"}; grant date: ${row.grantDate || "unknown"}; purpose: ${row.applicationPurpose || "unknown"}. An FCC ID identifies an authorised radio product, but may not equal the retail model name.`,
      source_url: `https://apps.fcc.gov/OETLabServices/getFCCIDList?fccId=${encodeURIComponent(row.fccid || fccId)}`,
      confidence: "EXACT FCC ID",
      external_source: "FCC Equipment Authorization System",
      source_id: `fcc:${row.fccid || fccId}`,
    }),
  );
}

async function fetchTextCached(
  url: string,
  slot: "pci" | "usb",
) {
  const existing = slot === "pci" ? pciIdsPromise : usbIdsPromise;
  if (existing) return existing;

  const promise = fetch(url, {
    headers: { "User-Agent": "DubboEwaste AssetFlow/0.1" },
    next: { revalidate: 86400 },
  }).then(async (response) => {
    if (!response.ok) throw new Error(`${slot} ids returned ${response.status}`);
    return response.text();
  });

  if (slot === "pci") pciIdsPromise = promise;
  else usbIdsPromise = promise;

  return promise;
}

function extractPci(query: string) {
  const windows = query.match(/VEN_([0-9a-f]{4}).*DEV_([0-9a-f]{4})/i);
  if (windows) return { vendor: windows[1].toLowerCase(), device: windows[2].toLowerCase() };
  const compact = query.match(/pci\s*[:#=]?\s*([0-9a-f]{4})[:\s-]+([0-9a-f]{4})/i);
  if (compact) return { vendor: compact[1].toLowerCase(), device: compact[2].toLowerCase() };
  return null;
}

function extractUsb(query: string) {
  const windows = query.match(/VID_([0-9a-f]{4}).*PID_([0-9a-f]{4})/i);
  if (windows) return { vendor: windows[1].toLowerCase(), device: windows[2].toLowerCase() };
  const compact = query.match(/usb\s*[:#=]?\s*([0-9a-f]{4})[:\s-]+([0-9a-f]{4})/i);
  if (compact) return { vendor: compact[1].toLowerCase(), device: compact[2].toLowerCase() };
  return null;
}

function lookupIdsFile(text: string, vendorId: string, deviceId: string) {
  const lines = text.split(/\r?\n/);
  let vendorName = "";
  let inVendor = false;

  for (const line of lines) {
    if (!line || line.startsWith("#")) continue;
    if (!/^\s/.test(line)) {
      const match = line.match(/^([0-9a-fA-F]{4})\s+(.+)$/);
      inVendor = Boolean(match && match[1].toLowerCase() === vendorId);
      if (inVendor && match) vendorName = match[2].trim();
      continue;
    }
    if (!inVendor) continue;

    const match = line.match(/^\t([0-9a-fA-F]{4})\s+(.+)$/);
    if (match && match[1].toLowerCase() === deviceId) {
      return { vendorName, deviceName: match[2].trim() };
    }
  }
  return vendorName ? { vendorName, deviceName: "" } : null;
}

async function searchPci(query: string) {
  const id = extractPci(query);
  if (!id) return [];
  const text = await fetchTextCached(PCI_IDS_URL, "pci");
  const found = lookupIdsFile(text, id.vendor, id.device);
  if (!found) return [];

  return [
    modelRecord({
      manufacturer: found.vendorName || `PCI vendor ${id.vendor}`,
      model_name: found.deviceName || `PCI device ${id.device}`,
      identifiers: [`PCI:${id.vendor}:${id.device}`],
      category: "parts",
      support_summary:
        "Exact PCI vendor/device ID match from the public PCI ID Repository. This identifies a component, not necessarily the whole computer.",
      source_url: "https://pci-ids.ucw.cz/",
      confidence: "EXACT PCI ID",
      external_source: "PCI ID Repository",
      source_id: `pci:${id.vendor}:${id.device}`,
    }),
  ];
}

async function searchUsb(query: string) {
  const id = extractUsb(query);
  if (!id) return [];
  const text = await fetchTextCached(USB_IDS_URL, "usb");
  const found = lookupIdsFile(text, id.vendor, id.device);
  if (!found) return [];

  return [
    modelRecord({
      manufacturer: found.vendorName || `USB vendor ${id.vendor}`,
      model_name: found.deviceName || `USB device ${id.device}`,
      identifiers: [`USB:${id.vendor}:${id.device}`],
      category: "parts",
      support_summary:
        "Exact USB VID/PID match from the public USB ID Repository. This identifies a USB component/peripheral, not necessarily the host computer.",
      source_url: "https://usb-ids.gowdy.us/",
      confidence: "EXACT USB ID",
      external_source: "USB ID Repository",
      source_id: `usb:${id.vendor}:${id.device}`,
    }),
  ];
}

function extractLvfsNeedle(query: string) {
  const explicit = query.match(/lvfs\s*[:#=]\s*(.+)$/i)?.[1]?.trim();
  if (explicit) return explicit;
  const guid = query.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0];
  return guid ?? "";
}

async function fetchLvfsXml() {
  if (!lvfsXmlPromise) {
    lvfsXmlPromise = (async () => {
      const response = await fetch(LVFS_METADATA_URL, {
        headers: { "User-Agent": "DubboEwaste AssetFlow/0.1" },
        next: { revalidate: 86400 },
      });
      if (!response.ok) throw new Error(`LVFS metadata returned ${response.status}`);
      const compressed = Buffer.from(await response.arrayBuffer());
      return gunzipSync(compressed).toString("utf8");
    })().catch((error) => {
      lvfsXmlPromise = null;
      throw error;
    });
  }
  return lvfsXmlPromise;
}

function xmlText(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match?.[1]
    ?.replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim() ?? "";
}

async function searchLvfs(query: string) {
  const needle = extractLvfsNeedle(query);
  if (!needle) return [];
  const xml = await fetchLvfsXml();
  const normalNeedle = needle.toLowerCase();

  const results: ModelRecord[] = [];
  for (const block of xml.match(/<component\b[\s\S]*?<\/component>/gi) ?? []) {
    if (!block.toLowerCase().includes(normalNeedle)) continue;
    const name = xmlText(block, "name") || xmlText(block, "id");
    const vendor = xmlText(block, "developer_name") || "Unknown";
    const summary = xmlText(block, "summary");
    const id = xmlText(block, "id") || needle;
    const guids = [...block.matchAll(/<firmware[^>]*>([^<]+)<\/firmware>/gi)]
      .map((match) => match[1].trim())
      .filter(Boolean)
      .slice(0, 8);

    results.push(
      modelRecord({
        manufacturer: vendor,
        model_name: name || needle,
        identifiers: guids,
        category: inferCategory(`${name} ${summary}`),
        support_summary:
          `LVFS/fwupd firmware metadata match: ${summary || "firmware-supported device"}. LVFS is useful as supporting hardware identity and firmware evidence, not as a retail catalogue.`,
        source_url: "https://fwupd.org/",
        confidence: "LVFS METADATA MATCH",
        external_source: "Linux Vendor Firmware Service",
        source_id: `lvfs:${id}`,
      }),
    );
    if (results.length >= 6) break;
  }
  return results;
}

function looksLenovo(query: string) {
  return /\blenovo\b|\bthinkpad\b|\bthinkcentre\b|\bthinkbook\b|\bideapad\b|\bthinkstation\b|\blegion\b/i.test(query);
}

function cleanLenovoModel(query: string) {
  return query
    .replace(/^lenovo\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function lenovoFolder(model: string) {
  if (/^thinkpad\b/i.test(model)) return "ThinkPad";
  if (/^thinkcentre\b/i.test(model)) return "ThinkCentre";
  if (/^thinkbook\b/i.test(model)) return "ThinkBook";
  if (/^thinkstation\b/i.test(model)) return "ThinkStation";
  if (/^ideapad\b/i.test(model)) return "IdeaPad";
  if (/^legion\b/i.test(model)) return "Legion";
  return "Lenovo";
}

async function searchLenovoPsref(query: string) {
  if (!looksLenovo(query)) return [];
  const model = cleanLenovoModel(query);
  const slug = model.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "");
  const folder = lenovoFolder(model);
  const candidates = [
    `https://psref.lenovo.com/Product/${folder}/${slug}`,
    `https://psref.lenovo.com/WDProduct/${folder}/${slug}`,
  ];

  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "DubboEwaste AssetFlow/0.1" },
        next: { revalidate: 86400 },
      });
      if (!response.ok) continue;
      const html = await response.text();
      if (!/PSREF|Product Specifications Reference/i.test(html)) continue;

      return [
        modelRecord({
          manufacturer: "Lenovo",
          model_name: model,
          aliases: [query],
          category: inferCategory(model),
          support_summary:
            "Lenovo PSREF official product page found for the entered model family. Confirm the exact machine type/model (MTM) on the device because PSREF product pages can cover multiple configurations.",
          source_url: url,
          confidence: "OFFICIAL PSREF PAGE",
          external_source: "Lenovo PSREF",
          source_id: `lenovo-psref:${slug}`,
        }),
      ];
    } catch {
      // Try the next official PSREF URL form.
    }
  }
  return [];
}

async function safeProvider(
  name: string,
  run: () => Promise<ModelRecord[]>,
) {
  try {
    return { name, status: "ok" as const, results: await run() };
  } catch (error) {
    console.warn(`Device reference provider ${name} failed`, error);
    return { name, status: "unavailable" as const, results: [] as ModelRecord[] };
  }
}

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 120);
  if (query.length < 2) {
    return NextResponse.json({ results: [], providers: [] });
  }

  const providerRuns = [
    safeProvider("Google Play supported devices", () => searchGooglePlay(query)),
    safeProvider("Open Icecat", () => searchIcecat(query)),
    safeProvider("FCC Equipment Authorization System", () => searchFcc(query)),
    safeProvider("PCI ID Repository", () => searchPci(query)),
    safeProvider("USB ID Repository", () => searchUsb(query)),
    safeProvider("Linux Vendor Firmware Service", () => searchLvfs(query)),
    safeProvider("Lenovo PSREF", () => searchLenovoPsref(query)),
  ];

  const settled = await Promise.all(providerRuns);
  const seen = new Set<string>();
  const results = settled
    .flatMap((provider) => provider.results)
    .filter((row) => {
      const key = normalise(
        `${row.external_source} ${row.manufacturer} ${row.model_name} ${(row.identifiers ?? []).join(" ")}`,
      );
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 20);

  return NextResponse.json(
    {
      results,
      providers: settled.map((provider) => ({
        name: provider.name,
        status: provider.status,
        matches: provider.results.length,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400",
      },
    },
  );
}
