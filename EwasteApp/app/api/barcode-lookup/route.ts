import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ProductMatch = {
  manufacturer: string;
  model_name: string;
  category: string;
  source: string;
  source_url: string;
  barcode: string;
  image_url?: string;
  confidence: "EXACT BARCODE" | "PUBLIC BARCODE MATCH";
};

type UpcItem = {
  ean?: string;
  upc?: string;
  title?: string;
  brand?: string;
  model?: string;
  category?: string;
  images?: string[];
};

type OpenProduct = {
  code?: string;
  product_name?: string;
  product_name_en?: string;
  generic_name?: string;
  brands?: string;
  categories?: string;
  categories_tags?: string[];
  image_front_url?: string;
};

type WikidataBinding = {
  item?: { value?: string };
  itemLabel?: { value?: string };
  manufacturerLabel?: { value?: string };
};

const EXTERNAL_GTIN_LENGTHS = new Set([8, 12, 13, 14]);

function cleanCode(value: string) {
  return value.trim().replace(/\s+/g, "").slice(0, 180);
}

function digitsOnly(value: string) {
  return /^\d+$/.test(value);
}

function validGtin(value: string) {
  if (!digitsOnly(value) || !EXTERNAL_GTIN_LENGTHS.has(value.length)) return false;
  const digits = value.split("").map(Number);
  const check = digits.pop();
  if (check === undefined) return false;

  let sum = 0;
  for (let i = digits.length - 1, position = 0; i >= 0; i -= 1, position += 1) {
    sum += digits[i] * (position % 2 === 0 ? 3 : 1);
  }
  return (10 - (sum % 10)) % 10 === check;
}

function categoryFromText(value: string) {
  const text = value.toLowerCase();
  if (/chromebook/.test(text)) return "chromebook";
  if (/smartphone|mobile phone|cell phone|iphone|android phone|galaxy|pixel/.test(text)) return "phone";
  if (/tablet|ipad/.test(text)) return "tablet";
  if (/laptop|notebook|macbook|latitude|thinkpad|elitebook|probook|surface laptop/.test(text)) return "laptop";
  if (/desktop|workstation|imac|optiplex|thinkcentre|elitedesk|prodesk|computer/.test(text)) return "desktop";
  if (/monitor|display/.test(text)) return "monitor";
  if (/router|switch|access point|network/.test(text)) return "networking";
  if (/printer|multifunction/.test(text)) return "printer";
  if (/television|\btv\b/.test(text)) return "tv";
  return "other";
}

function stripBrand(title: string, brand: string) {
  if (!brand) return title.trim();
  const escaped = brand.replace(/[.*+?^$()|[\]\\]/g, "\\$&");
  return title.replace(new RegExp("^" + escaped + "\\s+", "i"), "").trim() || title.trim();
}

function productKey(product: ProductMatch) {
  return [
    product.manufacturer.toLowerCase(),
    product.model_name.toLowerCase(),
    product.barcode,
  ].join("|");
}

async function safeLookup(
  provider: string,
  lookup: () => Promise<ProductMatch[]>,
): Promise<ProductMatch[]> {
  try {
    return await lookup();
  } catch (error) {
    console.warn(`Barcode provider ${provider} unavailable`, error);
    return [];
  }
}

async function lookupOpenProductsFacts(code: string): Promise<ProductMatch[]> {
  const url = new URL(`https://world.openfoodfacts.org/api/v3/product/${encodeURIComponent(code)}`);
  url.searchParams.set("product_type", "all");
  url.searchParams.set(
    "fields",
    "code,product_name,product_name_en,generic_name,brands,categories,categories_tags,image_front_url",
  );

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "DubboEwaste AssetFlow/0.1 - barcode intake - https://github.com/joshualparris/DubboEwaste",
    },
    redirect: "follow",
    next: { revalidate: 86400 },
  });
  if (!response.ok) return [];

  const body = (await response.json()) as { status?: number | string; product?: OpenProduct };
  if (!body.product) return [];

  const product = body.product;
  const title =
    product.product_name_en ||
    product.product_name ||
    product.generic_name ||
    "";
  if (!title.trim()) return [];

  const brand = product.brands?.split(",")[0]?.trim() || "Unknown";
  const categoryText = [
    product.categories ?? "",
    ...(product.categories_tags ?? []),
    title,
  ].join(" ");

  return [{
    manufacturer: brand,
    model_name: stripBrand(title, brand),
    category: categoryFromText(categoryText),
    source: "Open Products Facts",
    source_url: `https://world.openproductsfacts.org/product/${encodeURIComponent(code)}`,
    barcode: code,
    image_url: product.image_front_url || undefined,
    confidence: "EXACT BARCODE",
  }];
}

async function lookupUpcItemDb(code: string): Promise<ProductMatch[]> {
  const url = new URL("https://api.upcitemdb.com/prod/trial/lookup");
  url.searchParams.set("upc", code);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "DubboEwaste AssetFlow/0.1",
    },
    next: { revalidate: 86400 },
  });
  if (!response.ok) return [];

  const body = (await response.json()) as { items?: UpcItem[] };
  return (body.items ?? []).slice(0, 5).flatMap((item) => {
    const title = item.title?.trim() || "";
    if (!title) return [];
    const brand = item.brand?.trim() || "Unknown";
    const model = item.model?.trim() || stripBrand(title, brand);
    return [{
      manufacturer: brand,
      model_name: model,
      category: categoryFromText(`${item.category ?? ""} ${title}`),
      source: "UPCitemdb",
      source_url: `https://www.upcitemdb.com/upc/${encodeURIComponent(code)}`,
      barcode: code,
      image_url: item.images?.[0],
      confidence: "EXACT BARCODE" as const,
    }];
  });
}

async function lookupWikidataGtin(code: string): Promise<ProductMatch[]> {
  const sparql = `
SELECT ?item ?itemLabel ?manufacturerLabel WHERE {
  ?item wdt:P3962 "${code}".
  OPTIONAL { ?item wdt:P176 ?manufacturer. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 5`.trim();

  const url = new URL("https://query.wikidata.org/sparql");
  url.searchParams.set("query", sparql);
  url.searchParams.set("format", "json");

  const response = await fetch(url, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": "DubboEwaste AssetFlow/0.1 (https://github.com/joshualparris/DubboEwaste)",
    },
    next: { revalidate: 86400 },
  });
  if (!response.ok) return [];

  const body = (await response.json()) as {
    results?: { bindings?: WikidataBinding[] };
  };

  return (body.results?.bindings ?? []).flatMap((binding) => {
    const title = binding.itemLabel?.value?.trim() || "";
    if (!title) return [];
    const manufacturer = binding.manufacturerLabel?.value?.trim() || "Unknown";
    const itemUrl = binding.item?.value || "";
    return [{
      manufacturer,
      model_name: stripBrand(title, manufacturer),
      category: categoryFromText(title),
      source: "Wikidata GTIN",
      source_url: itemUrl.replace("http://www.wikidata.org/entity/", "https://www.wikidata.org/wiki/"),
      barcode: code,
      confidence: "PUBLIC BARCODE MATCH" as const,
    }];
  });
}

function parseAssetUrl(raw: string) {
  try {
    const url = new URL(raw);
    const match = url.pathname.match(/^\/assets\/([0-9a-f-]{36})\/?$/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("code") ?? "";
  const code = cleanCode(raw);
  if (code.length < 3) {
    return NextResponse.json({ error: "Scan or enter a barcode first." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to use barcode lookup." }, { status: 401 });
  }

  const assetIdFromUrl = parseAssetUrl(raw);
  if (assetIdFromUrl) {
    const { data: asset } = await supabase
      .from("assets")
      .select("id,asset_code,manufacturer,model,serial_imei")
      .eq("id", assetIdFromUrl)
      .maybeSingle();

    if (asset) {
      return NextResponse.json({
        kind: "existing_asset",
        scanned: code,
        asset,
        href: `/assets/${asset.id}`,
      });
    }
  }

  const [assetByCode, assetBySerial, modelLookup] = await Promise.all([
    supabase
      .from("assets")
      .select("id,asset_code,manufacturer,model,serial_imei")
      .eq("asset_code", code)
      .maybeSingle(),
    supabase
      .from("assets")
      .select("id,asset_code,manufacturer,model,serial_imei")
      .eq("serial_imei", code)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("model_support")
      .select("manufacturer,model_name,category,source_url")
      .contains("identifiers", [code])
      .eq("active", true)
      .limit(5),
  ]);

  const existing = assetByCode.data || assetBySerial.data;
  if (existing) {
    return NextResponse.json({
      kind: "existing_asset",
      scanned: code,
      asset: existing,
      href: `/assets/${existing.id}`,
    });
  }

  const internalProducts: ProductMatch[] = (modelLookup.data ?? []).map((row) => ({
    manufacturer: row.manufacturer,
    model_name: row.model_name,
    category: row.category,
    source: "DubboEwaste catalogue",
    source_url: row.source_url,
    barcode: code,
    confidence: "EXACT BARCODE",
  }));

  if (internalProducts.length) {
    return NextResponse.json({
      kind: "product",
      scanned: code,
      valid_gtin: validGtin(code),
      products: internalProducts,
      providers_checked: ["DubboEwaste catalogue"],
    });
  }

  if (!validGtin(code)) {
    return NextResponse.json({
      kind: "unmatched",
      scanned: code,
      valid_gtin: false,
      products: [],
      providers_checked: ["DubboEwaste catalogue"],
      message: "No exact AssetFlow match. This does not look like a valid GTIN/UPC/EAN, so it may be a serial number, service tag or internal asset label.",
    });
  }

  const [openFacts, wikidata] = await Promise.all([
    safeLookup("Open Products Facts", () => lookupOpenProductsFacts(code)),
    safeLookup("Wikidata GTIN", () => lookupWikidataGtin(code)),
  ]);

  let upcItemDb: ProductMatch[] = [];
  if (!openFacts.length) {
    upcItemDb = await safeLookup("UPCitemdb", () => lookupUpcItemDb(code));
  }
  const products = [...openFacts, ...upcItemDb, ...wikidata];
  const seen = new Set<string>();
  const uniqueProducts = products.filter((product) => {
    const key = productKey(product);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (!uniqueProducts.length) {
    return NextResponse.json({
      kind: "unmatched",
      scanned: code,
      valid_gtin: true,
      products: [],
      providers_checked: [
        "DubboEwaste catalogue",
        "Open Products Facts",
        "UPCitemdb",
        "Wikidata GTIN",
      ],
      message: "The barcode is valid, but no linked public product record was found. You can still record the code and identify the model manually.",
    });
  }

  return NextResponse.json({
    kind: "product",
    scanned: code,
    valid_gtin: true,
    products: uniqueProducts,
    providers_checked: [
      "DubboEwaste catalogue",
      "Open Products Facts",
      ...(openFacts.length ? [] : ["UPCitemdb"]),
      "Wikidata GTIN",
    ],
  });
}
