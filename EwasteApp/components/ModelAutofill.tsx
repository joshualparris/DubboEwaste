"use client";

import { useEffect, useMemo, useState } from "react";
import { BarcodeLookup, type BarcodeProduct } from "@/components/BarcodeLookup";

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
  external_source?: string;
  source_id?: string;
};

type Match = {
  model: ModelRecord;
  score: number;
  method: "exact" | "alias" | "text" | "live";
};

function categoryFor(record: ModelRecord): string {
  if (record.category === "mac") return "LAPTOP";
  if (record.category === "android") return "PHONE";
  const value = record.category.toUpperCase();
  return ["LAPTOP","DESKTOP","PHONE","TABLET","CHROMEBOOK","MONITOR","TV","NETWORKING","PRINTER","PARTS","OTHER"].includes(value)
    ? value
    : "OTHER";
}

function routeFor(route: string): string {
  const value = route.toLowerCase();
  if (value.includes("part")) return "PARTS";
  if (value.includes("recycl")) return "RECYCLE";
  if (value.includes("social") || value.includes("donat")) return "DONATE";
  if (value.includes("reuse") || value.includes("refurb")) return "REFURBISH";
  return "HOLD";
}

function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function scoreModel(model: ModelRecord, query: string): { score: number; method: "exact" | "alias" | "text" } {
  const needle = normalise(query);
  const name = normalise(`${model.manufacturer} ${model.model_name}`);
  const aliases = (model.aliases ?? []).map(normalise);
  const identifiers = (model.identifiers ?? []).map(normalise);
  if (needle === name || needle === normalise(model.model_name)) return { score: 100, method: "exact" };
  if (aliases.some((alias) => alias === needle)) return { score: 95, method: "alias" };
  if (identifiers.some((identifier) => identifier === needle)) return { score: 93, method: "alias" };
  const tokens = needle.split(" ").filter(Boolean);
  const haystack = [name, ...aliases, ...identifiers].join(" ");
  const hits = tokens.filter((token) => haystack.includes(token)).length;
  return { score: tokens.length ? Math.round((hits / tokens.length) * 80) : 0, method: "text" };
}

function keyFor(model: ModelRecord) {
  return normalise(`${model.manufacturer} ${model.model_name}`);
}

function modelFromBarcode(product: BarcodeProduct): ModelRecord {
  return {
    manufacturer: product.manufacturer,
    model_name: product.model_name,
    identifiers: [product.barcode],
    category: product.category,
    support_summary:
      `Barcode ${product.barcode} matched via ${product.source}. Verify the exact printed model, serial/IMEI, ownership and support status before accepting the device.`,
    lock_risks:
      "A retail barcode identifies a product model, not ownership or lock state. Check BIOS/MDM/Activation Lock/FRP as applicable.",
    battery_notes:
      "Inspect battery, power, charging and physical condition as applicable before reuse.",
    likely_route: "Hold / further triage until exact model and condition are verified.",
    source_url: product.source_url,
    source_checked: new Date().toISOString().slice(0, 10),
    confidence: product.confidence,
    external_source: product.source,
    source_id: `barcode:${product.source}:${product.barcode}`,
  };
}

export function ModelAutofill({ models }: { models: ModelRecord[] }) {
  const [lookup, setLookup] = useState("");
  const [selected, setSelected] = useState<ModelRecord | null>(null);
  const [liveModels, setLiveModels] = useState<ModelRecord[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState("");

  const localMatches = useMemo<Match[]>(() => {
    const value = lookup.trim().toLowerCase();
    if (!value) return models.slice(0, 8).map((model) => ({ model, score: 0, method: "text" as const }));
    return models
      .map((model) => ({ model, ...scoreModel(model, value) }))
      .filter(({ score }) => score >= 35)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [lookup, models]);

  useEffect(() => {
    const q = lookup.trim();
    if (q.length < 2 || selected) {
      setLiveModels([]);
      setLiveLoading(false);
      setLiveError("");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLiveLoading(true);
      setLiveError("");
      try {
        const response = await fetch(`/api/model-search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Lookup failed (${response.status})`);
        const body = (await response.json()) as { results?: ModelRecord[] };
        setLiveModels(body.results ?? []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setLiveModels([]);
          setLiveError("Live lookup temporarily unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) setLiveLoading(false);
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [lookup, selected]);

  const matches = useMemo<Match[]>(() => {
    const localKeys = new Set(localMatches.map(({ model }) => keyFor(model)));
    const remote = liveModels
      .filter((model) => !localKeys.has(keyFor(model)))
      .map((model) => ({ model, score: 30, method: "live" as const }));
    return [...localMatches, ...remote].slice(0, 12);
  }, [localMatches, liveModels]);

  function choose(model: ModelRecord) {
    setLookup(`${model.manufacturer} ${model.model_name}`);
    setSelected(model);
    const category = document.querySelector<HTMLSelectElement>("select[name=category]");
    const route = document.querySelector<HTMLSelectElement>("select[name=initial_route]");
    if (category) category.value = categoryFor(model);
    if (route) route.value = routeFor(model.likely_route);
  }

  return (
    <>
      <BarcodeLookup onProduct={(product) => choose(modelFromBarcode(product))} />

      <div className="lookup-panel">
        <label>
          Find model
          <input
            id="model-lookup"
            value={lookup}
            onChange={(event) => { setLookup(event.target.value); setSelected(null); }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && matches[0]) {
                event.preventDefault();
                choose(matches[0].model);
              }
            }}
            placeholder="Try realme, Latitude 5420, ThinkPad T14, iPhone 11"
            autoComplete="off"
          />
        </label>

        <p className="muted small">
          Type a model name to search the DubboEwaste catalogue and multiple free public device sources, or scan a manufacturer barcode above.
        </p>

        {lookup && !selected ? (
          <div className="lookup-results" role="listbox" aria-label="Model matches">
            {matches.map(({ model, method }) => (
              <button
                type="button"
                key={model.source_id ?? `${model.manufacturer}-${model.model_name}`}
                onClick={() => choose(model)}
              >
                <strong>{model.manufacturer} {model.model_name}</strong>
                <span>
                  {method === "exact"
                    ? "Exact local model"
                    : method === "alias"
                      ? "Known local alias / identifier"
                      : method === "live"
                        ? `Live ${model.external_source ?? "public catalogue"} result`
                        : "Local text candidate"}
                  {" · "}{model.category}{" · "}{model.confidence}
                </span>
              </button>
            ))}
            {liveLoading ? <p className="muted small">Searching public device databases…</p> : null}
            {!liveLoading && !matches.length && !liveError ? (
              <p className="muted small">No model found in the local or public catalogues. Enter the manufacturer and exact model manually.</p>
            ) : null}
            {liveError ? <p className="error small">{liveError}</p> : null}
          </div>
        ) : null}

        {selected ? (
          <div className="lookup-result">
            <strong>Candidate selected — verify on the device</strong>
            <span>
              Source: {selected.external_source ?? "DubboEwaste catalogue"} · checked {selected.source_checked} · {selected.confidence}
            </span>
            <small>{selected.support_summary}</small>
            <a href={selected.source_url} target="_blank" rel="noreferrer">Open supporting source ↗</a>
          </div>
        ) : null}
      </div>

      <div className="two">
        <label>
          Manufacturer
          <input
            name="manufacturer"
            defaultValue={selected?.manufacturer || ""}
            placeholder="Dell"
            key={`manufacturer-${selected?.source_id ?? selected?.model_name ?? "blank"}`}
          />
        </label>
        <label>
          Exact model
          <input
            name="model"
            defaultValue={selected?.model_name || ""}
            placeholder="Latitude 5400"
            key={`model-${selected?.source_id ?? selected?.model_name ?? "blank"}`}
            required
          />
        </label>
      </div>
      {selected ? (
        <div className="callout info">
          <strong>Verify before accepting:</strong> {selected.lock_risks} {selected.battery_notes}
        </div>
      ) : null}
    </>
  );
}
