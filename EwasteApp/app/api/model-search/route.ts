import { NextRequest, NextResponse } from "next/server";

type WikidataSearchItem = {
  id: string;
  label?: string;
  description?: string;
};

type WikidataSearchResponse = {
  search?: WikidataSearchItem[];
};

type WikipediaSearchPage = {
  id?: number;
  key?: string;
  title?: string;
  excerpt?: string;
  description?: string | null;
};

type WikipediaSearchResponse = {
  pages?: WikipediaSearchPage[];
};

type ModelResult = {
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

const DEVICE_WORDS =
  /smartphone|mobile phone|cell phone|tablet|laptop|notebook|chromebook|personal computer|desktop computer|workstation|computer model|electronic device|router|wireless access point|network switch|monitor|display|printer|iphone|ipad|imac|macbook|latitude|thinkpad|elitebook|probook|zbook|surface|galaxy|pixel|optiplex|precision|xps/i;

const BRANDS = [
  "Apple", "Samsung", "Google", "Dell", "Lenovo", "HP", "Hewlett-Packard",
  "Acer", "ASUS", "Microsoft", "Realme", "OPPO", "OnePlus", "Xiaomi",
  "Motorola", "Nokia", "Huawei", "Toshiba", "Sony", "LG", "Ubiquiti", "Cisco",
];

const BRAND_TOKENS = new Set([
  "apple", "samsung", "google", "dell", "lenovo", "ibm", "hp", "hewlett",
  "packard", "acer", "asus", "microsoft", "realme", "oppo", "oneplus",
  "xiaomi", "motorola", "nokia", "huawei", "toshiba", "sony", "lg",
  "ubiquiti", "cisco",
]);

const GENERIC_TOKENS = new Set([
  "laptop", "notebook", "desktop", "computer", "pc", "phone", "smartphone",
  "tablet", "monitor", "printer", "router", "device",
]);

const FAMILY_BRANDS: Array<[RegExp, string]> = [
  [/\bimac\b|\bmacbook\b|\biphone\b|\bipad\b/i, "Apple"],
  [/\blatitude\b|\boptiplex\b|\bprecision\b|\bxps\b/i, "Dell"],
  [/\bthinkpad\b|\bthinkcentre\b|\bideapad\b/i, "Lenovo"],
  [/\belitebook\b|\bprobook\b|\bzbook\b|\belitedesk\b|\bprodesk\b/i, "HP"],
  [/\bsurface\b/i, "Microsoft"],
  [/\bgalaxy\b/i, "Samsung"],
  [/\bpixel\b/i, "Google"],
];

const CURATED_MODELS: ModelResult[] = [
  {
    manufacturer: "HP",
    model_name: "ProBook x360 435 G8",
    aliases: [
      "HP ProBook x360 435 G8",
      "ProBook x360 435 G8",
      "HP ProBook 435 G8",
      "ProBook 435 G8",
      "28M88AV",
      "28M90AV",
      "28M91AV",
      "28M93AV",
    ],
    identifiers: ["28M88AV", "28M90AV", "28M91AV", "28M93AV"],
    category: "laptop",
    support_summary:
      "HP identifies this as the ProBook x360 435 G8 Notebook PC. Verify the exact product number and installed configuration from the device label or HP system information.",
    lock_risks:
      "Check BIOS/power-on password, organisation ownership, Windows Autopilot/MDM and enterprise management state.",
    battery_notes:
      "Inspect battery health and swelling, charging, hinges, touch display and keyboard.",
    likely_route:
      "Reuse/refurbish if unlocked, supportable and fully tested; otherwise repair, parts or recycling according to condition.",
    source_url:
      "https://support.hp.com/au-en/product/product-specs/hp-probook-x360-435-g8-notebook-pc/38492692",
    source_checked: "2026-10-05",
    confidence: "VERIFIED",
    external_source: "HP Support",
    source_id: "curated:hp-probook-x360-435-g8",
  },
  {
    manufacturer: "Lenovo",
    model_name: "ThinkPad T61",
    aliases: [
      "Lenovo T61",
      "ThinkPad T61",
      "Lenovo ThinkPad T61",
      "IBM T61",
      "IBM ThinkPad T61",
      "T61",
    ],
    category: "laptop",
    support_summary:
      "Lenovo support documentation identifies the ThinkPad T61/T61p family. Verify the machine type/model label and installed configuration because the T61 was sold in multiple variants.",
    lock_risks:
      "Check supervisor/BIOS passwords and confirm legitimate ownership before reuse.",
    battery_notes:
      "Inspect the removable battery for age, swelling and runtime; verify the correct AC adapter and charging.",
    likely_route:
      "Reuse/refurbish only if condition and intended use justify an older Core 2-era platform; otherwise parts or recycling.",
    source_url:
      "https://support.lenovo.com/au/en/downloads/ds003943-access-help-online-users-guide-thinkpad-r61-r61e-r61i-t61-t61p",
    source_checked: "2026-10-05",
    confidence: "VERIFIED",
    external_source: "Lenovo Support",
    source_id: "curated:lenovo-thinkpad-t61",
  },
  {
    manufacturer: "Dell",
    model_name: "Latitude 5400",
    aliases: ["Dell Latitude 5400", "Latitude 5400", "Dell 5400"],
    category: "laptop",
    support_summary:
      "DubboEwaste documents the Latitude 5400 as an 8th-generation Latitude 5000 reuse candidate. Verify the installed CPU, TPM/Secure Boot and actual condition before routing.",
    lock_risks:
      "Check BIOS password, Autopilot/MDM and organisation ownership.",
    battery_notes:
      "Inspect battery health, swelling, charger and USB-C charging.",
    likely_route:
      "Reuse/refurbish if unlocked and tested; parts or recycling if repair economics fail.",
    source_url:
      "https://www.dell.com/support/product-details/en-au/product/latitude-14-5400-laptop/resources/manuals",
    source_checked: "2026-10-05",
    confidence: "RESEARCH LEAD",
    external_source: "DubboEwaste curated catalogue",
    source_id: "curated:dell-latitude-5400",
  },
  {
    manufacturer: "Apple",
    model_name: "iMac Retina 5K 27-inch 2017",
    aliases: [
      "iMac 2017",
      "2017 iMac",
      "iMac 27 2017",
      "iMac Retina 5K 2017",
    ],
    category: "desktop",
    support_summary:
      "DubboEwaste has this exact 2017 27-inch Retina 5K iMac in its documented equipment history. Verify the serial, exact configuration and current macOS support before reuse.",
    lock_risks:
      "Check Activation Lock/Find My status and confirm legitimate ownership.",
    battery_notes:
      "No main battery; inspect display, storage, thermals, ports and power supply.",
    likely_route:
      "Reuse/refurbish if unlocked and tested; otherwise parts or verified recycling.",
    source_url:
      "https://github.com/joshualparris/DubboEwaste/blob/main/pilot-tracker.csv",
    source_checked: "2026-10-05",
    confidence: "RESEARCH LEAD",
    external_source: "DubboEwaste curated catalogue",
    source_id: "curated:apple-imac-27-2017",
  },
];

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function modelTokens(value: string) {
  return normalise(value)
    .split(" ")
    .filter(Boolean)
    .filter((token) => !BRAND_TOKENS.has(token))
    .filter((token) => !GENERIC_TOKENS.has(token));
}

function publicMatchScore(label: string, description: string, query: string) {
  const queryNormal = normalise(query);
  const labelNormal = normalise(label);
  if (labelNormal === queryNormal) return 100;

  const tokens = modelTokens(query);
  if (!tokens.length) return 0;
  const haystack = normalise(`${label} ${description}`);
  const hits = tokens.filter((token) => haystack.includes(token)).length;
  const coverage = Math.round((hits / tokens.length) * 100);

  if (coverage === 100 && labelNormal.includes(tokens.join(" "))) return 98;
  return coverage;
}

function queryVariants(query: string) {
  const variants = new Set<string>();
  const compact = query.trim().replace(/\s+/g, " ");
  variants.add(compact);

  const withoutBrand = compact
    .replace(
      /^(lenovo|ibm|dell|hp|hewlett[- ]packard|acer|asus|apple|toshiba|sony|samsung|microsoft)\s+/i,
      "",
    )
    .trim();
  if (withoutBrand.length >= 2) variants.add(withoutBrand);

  const lenovoCode = withoutBrand.match(/^([txwlr])\s*([0-9]{2,4}[a-z]?)$/i);
  if (/^(lenovo|ibm)\b/i.test(compact) && lenovoCode) {
    variants.add("ThinkPad " + lenovoCode[1].toUpperCase() + lenovoCode[2]);
    variants.add("Lenovo ThinkPad " + lenovoCode[1].toUpperCase() + lenovoCode[2]);
  }

  const dellCode = withoutBrand.match(/^(?:latitude\s+)?([0-9]{4})$/i);
  if (/^dell\b/i.test(compact) && dellCode) {
    variants.add("Dell Latitude " + dellCode[1]);
    variants.add("Latitude " + dellCode[1]);
  }

  return [...variants].filter((value) => value.length >= 2).slice(0, 8);
}

async function searchWikipedia(term: string) {
  const url = new URL("https://en.wikipedia.org/w/rest.php/v1/search/page");
  url.searchParams.set("q", term);
  url.searchParams.set("limit", "10");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "DubboEwaste/0.1 (https://github.com/joshualparris/DubboEwaste)",
    },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Wikipedia returned ${response.status}`);
  return (await response.json()) as WikipediaSearchResponse;
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferManufacturer(label: string, query: string) {
  const family = FAMILY_BRANDS.find(([pattern]) =>
    pattern.test(`${label} ${query}`),
  )?.[1];
  if (family) return family;

  const brand = BRANDS.find(
    (item) =>
      label.toLowerCase().startsWith(item.toLowerCase() + " ") ||
      label.toLowerCase() === item.toLowerCase(),
  );
  if (brand) return brand === "Hewlett-Packard" ? "HP" : brand;

  const firstQueryToken = query.trim().split(/\s+/)[0] ?? "";
  if (
    firstQueryToken.length >= 2 &&
    BRANDS.some(
      (item) => item.toLowerCase() === firstQueryToken.toLowerCase(),
    )
  ) {
    return firstQueryToken.toLowerCase() === "hewlett-packard"
      ? "HP"
      : titleCase(firstQueryToken);
  }
  return "";
}

function inferCategory(label: string, description: string) {
  const text = `${label} ${description}`.toLowerCase();
  if (/chromebook/.test(text)) return "chromebook";
  if (/smartphone|mobile phone|cell phone|iphone|galaxy|pixel/.test(text))
    return "phone";
  if (/tablet|ipad/.test(text)) return "tablet";
  if (
    /laptop|notebook|macbook|latitude|thinkpad|elitebook|probook|zbook|surface laptop|ideapad|xps/.test(
      text,
    )
  )
    return "laptop";
  if (
    /desktop|workstation|personal computer|computer model|imac|optiplex|thinkcentre|elitedesk|prodesk/.test(
      text,
    )
  )
    return "desktop";
  if (/router|wireless access point|network switch/.test(text))
    return "networking";
  if (/monitor|display/.test(text)) return "monitor";
  if (/printer/.test(text)) return "printer";
  return "other";
}

function modelName(label: string, manufacturer: string) {
  if (!manufacturer) return label;
  const escaped = manufacturer.replace(/[.*+?^$()|[\]\\]/g, "\\$&");
  const stripped = label.replace(new RegExp(`^${escaped}\\s+`, "i"), "").trim();
  return stripped || label;
}

function enteredTextCandidate(query: string): ModelResult {
  const manufacturer = inferManufacturer(query, query);
  let model = query.trim().replace(/\s+/g, " ");
  if (manufacturer) {
    const escaped = manufacturer.replace(/[.*+?^$()|[\]\\]/g, "\\$&");
    model = model.replace(new RegExp(`^${escaped}\\s+`, "i"), "").trim();
    if (manufacturer === "HP") {
      model = model
        .replace(/^hewlett[- ]packard\s+/i, "")
        .replace(/^hp\s+/i, "")
        .trim();
    }
  }

  return {
    manufacturer: manufacturer || "Unknown",
    model_name: model || query.trim(),
    category: inferCategory(query, ""),
    support_summary:
      "This is the exact model text you entered. It has not been verified by an external catalogue yet; confirm it against the device label before accepting.",
    lock_risks:
      "Verify ownership and any firmware, activation or organisation-management locks before reuse.",
    battery_notes:
      "Inspect battery/power condition as applicable to the device category.",
    likely_route:
      "Hold / further triage until the exact model and condition are verified.",
    source_url: "",
    source_checked: new Date().toISOString().slice(0, 10),
    confidence: "UNVERIFIED INPUT",
    external_source: "Entered model text",
    source_id: `entered:${normalise(query)}`,
  };
}

type RealmeData = Record<string, Record<string, string>>;

async function searchRealmeOpenData(query: string): Promise<ModelResult[]> {
  const response = await fetch(
    "https://raw.githubusercontent.com/agam778/realmebot-api/main/data.json",
    {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "DubboEwaste/0.1 (https://github.com/joshualparris/DubboEwaste)",
      },
      next: { revalidate: 86400 },
    },
  );
  if (!response.ok)
    throw new Error(`Realme open dataset returned ${response.status}`);

  const data = (await response.json()) as RealmeData;
  const tokens = modelTokens(query);
  const rows: ModelResult[] = [];

  for (const [series, devices] of Object.entries(data)) {
    for (const [identifiersRaw, fullModel] of Object.entries(devices)) {
      const haystack = normalise(`${series} ${identifiersRaw} ${fullModel}`);
      if (!tokens.every((token) => haystack.includes(token))) continue;

      const identifiers = identifiersRaw
        .split("/")
        .map((value) => value.trim())
        .filter(Boolean);

      rows.push({
        manufacturer: "Realme",
        model_name: fullModel.replace(/^realme\s+/i, "").trim(),
        category: "phone",
        support_summary:
          `Open Realme device database match from ${series}. Verify the printed RMX model/codename and current OS/security support before reuse.`,
        lock_risks:
          "Check Google/FRP lock, screen lock, MDM, carrier/blacklist state and ownership.",
        battery_notes:
          "Inspect battery health, swelling, heat and charging before reuse.",
        likely_route:
          "Hold / further triage until exact model, lock state and condition are verified.",
        source_url: "https://github.com/agam778/realmebot-api",
        source_checked: new Date().toISOString().slice(0, 10),
        confidence: "RESEARCH LEAD",
        external_source: "RealmeBot open device DB",
        source_id: `realme:${identifiersRaw}:${fullModel}`,
        identifiers,
      });
    }
  }

  return rows.slice(0, 20);
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
      "User-Agent":
        "DubboEwaste/0.1 (https://github.com/joshualparris/DubboEwaste)",
    },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Wikidata returned ${response.status}`);
  const body = (await response.json()) as WikidataSearchResponse;
  return body.search ?? [];
}

function keyFor(row: Pick<ModelResult, "manufacturer" | "model_name">) {
  return normalise(`${row.manufacturer} ${row.model_name}`);
}

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 100);
  if (query.length < 2) return NextResponse.json({ results: [] });

  const terms = new Set<string>(queryVariants(query));
  const familyBrand =
    FAMILY_BRANDS.find(([pattern]) => pattern.test(query))?.[1] ?? "";
  if (
    familyBrand &&
    !query.toLowerCase().includes(familyBrand.toLowerCase())
  ) {
    terms.add(familyBrand + " " + query);
  }

  const withoutYear = query
    .replace(/\b(?:19|20)\d{2}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (withoutYear.length >= 2 && withoutYear !== query) {
    terms.add(withoutYear);
  }

  const [wikidataSettled, wikipediaSettled, realmeSettled] =
    await Promise.all([
      Promise.allSettled([...terms].map(searchWikidata)),
      Promise.allSettled([...terms].map(searchWikipedia)),
      /realme|rmx\d+/i.test(query)
        ? searchRealmeOpenData(query).then(
            (value) => ({ status: "fulfilled" as const, value }),
            (reason) => ({ status: "rejected" as const, reason }),
          )
        : Promise.resolve({
            status: "fulfilled" as const,
            value: [] as ModelResult[],
          }),
    ]);

  const realmeRows =
    realmeSettled.status === "fulfilled" ? realmeSettled.value : [];

  const curatedRows = CURATED_MODELS.filter((row) => {
    const haystack = normalise(
      [row.manufacturer, row.model_name, ...(row.aliases ?? []), ...(row.identifiers ?? [])].join(" "),
    );
    const tokens = modelTokens(query);
    return tokens.length > 0 && tokens.every((token) => haystack.includes(token));
  });

  const exactInput = enteredTextCandidate(query);
  const exactInputAlreadyVerified = curatedRows.some(
    (row) => keyFor(row) === keyFor(exactInput),
  );

  const wikidataItems = wikidataSettled
    .filter(
      (item): item is PromiseFulfilledResult<WikidataSearchItem[]> =>
        item.status === "fulfilled",
    )
    .flatMap((item) => item.value)
    .map((item) => ({
      item,
      score: publicMatchScore(
        item.label ?? "",
        item.description ?? "",
        query,
      ),
    }))
    .filter(({ item, score }) => {
      if (!item.id || score < 60) return false;
      const text = `${item.label ?? ""} ${item.description ?? ""}`;
      return DEVICE_WORDS.test(text);
    })
    .sort((a, b) => b.score - a.score);

  const wikipediaItems = wikipediaSettled
    .filter(
      (item): item is PromiseFulfilledResult<WikipediaSearchResponse> =>
        item.status === "fulfilled",
    )
    .flatMap((item) => item.value.pages ?? [])
    .map((item) => {
      const title = item.title ?? "";
      const description =
        item.description ?? stripHtml(item.excerpt ?? "");
      return {
        item,
        score: publicMatchScore(title, description, query),
      };
    })
    .filter(({ item, score }) => {
      if (score < 60) return false;
      const title = item.title ?? "";
      const description = item.description ?? "";
      const excerpt = stripHtml(item.excerpt ?? "");
      return DEVICE_WORDS.test(`${title} ${description} ${excerpt}`);
    })
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>(
    [...curatedRows, ...realmeRows].map((row) => keyFor(row)),
  );

  const wikidataRows: ModelResult[] = wikidataItems
    .map(({ item }) => {
      const label = item.label ?? item.id;
      const description = item.description ?? "Wikidata device record";
      const manufacturer = inferManufacturer(label, query);
      const category = inferCategory(label, description);
      return {
        manufacturer: manufacturer || "Unknown",
        model_name: modelName(label, manufacturer),
        category,
        support_summary:
          `Live Wikidata match: ${description}. Verify the exact model and current vendor support before routing.`,
        lock_risks:
          category === "phone" || category === "tablet"
            ? "Check activation/account lock, MDM and blacklist/carrier status."
            : "Check firmware/BIOS password, MDM/Autopilot and organisation ownership.",
        battery_notes:
          ["phone", "tablet", "laptop", "chromebook"].includes(category)
            ? "Inspect battery health, swelling, heat and charging before reuse."
            : "Check power supply, ports and electrical condition.",
        likely_route:
          "Hold / further triage until exact model and condition are verified.",
        source_url: `https://www.wikidata.org/wiki/${item.id}`,
        source_checked: new Date().toISOString().slice(0, 10),
        confidence: "RESEARCH LEAD",
        external_source: "Wikidata",
        source_id: item.id,
      };
    })
    .filter((row) => {
      const key = keyFor(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  const wikipediaRows: ModelResult[] = wikipediaItems
    .map(({ item }) => {
      const label = item.title ?? item.key ?? "Wikipedia device";
      const description =
        item.description ||
        stripHtml(item.excerpt ?? "") ||
        "Wikipedia device record";
      const manufacturer = inferManufacturer(label, query);
      const category = inferCategory(label, description);
      const key = item.key || encodeURIComponent(label.replace(/ /g, "_"));
      return {
        manufacturer: manufacturer || "Unknown",
        model_name: modelName(label, manufacturer),
        category,
        support_summary:
          `Wikipedia match: ${description}. Verify the exact machine label, type/model code and installed hardware before routing.`,
        lock_risks:
          category === "phone" || category === "tablet"
            ? "Check activation/account lock, MDM and blacklist/carrier status."
            : "Check firmware/BIOS password, MDM/Autopilot and organisation ownership.",
        battery_notes:
          ["phone", "tablet", "laptop", "chromebook"].includes(category)
            ? "Inspect battery health, swelling, heat and charging before reuse."
            : "Check power supply, ports and electrical condition.",
        likely_route:
          "Hold / further triage until exact model and condition are verified.",
        source_url: `https://en.wikipedia.org/wiki/${key}`,
        source_checked: new Date().toISOString().slice(0, 10),
        confidence: "RESEARCH LEAD",
        external_source: "Wikipedia",
        source_id: `wikipedia:${item.id ?? key}`,
      };
    })
    .filter((row) => {
      const key = keyFor(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  const rows = [
    ...curatedRows,
    ...realmeRows,
    ...(exactInputAlreadyVerified ? [] : [exactInput]),
    ...wikidataRows,
    ...wikipediaRows,
  ].slice(0, 20);

  return NextResponse.json(
    {
      results: rows,
      providers: [
        "DubboEwaste curated catalogue",
        "RealmeBot open device DB",
        "Wikidata",
        "Wikipedia",
      ],
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400",
      },
    },
  );
}
