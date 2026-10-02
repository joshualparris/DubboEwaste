"use client";

import { useMemo, useState } from "react";

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
};

const categoryOptions = [
  ["LAPTOP", "Windows/Mac laptop"], ["DESKTOP", "Desktop"], ["PHONE", "Phone"],
  ["TABLET", "Tablet"], ["CHROMEBOOK", "Chromebook"], ["MONITOR", "Monitor"],
  ["TV", "TV"], ["NETWORKING", "Networking"], ["PRINTER", "Printer"],
  ["PARTS", "Parts"], ["OTHER", "Other"],
];

function categoryFor(record: ModelRecord): string {
  if (record.category === "mac") return "LAPTOP";
  if (record.category === "android") return "PHONE";
  return record.category.toUpperCase();
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

export function ModelAutofill({ models }: { models: ModelRecord[] }) {
  const [lookup, setLookup] = useState("");
  const [selected, setSelected] = useState<ModelRecord | null>(null);
  const matches = useMemo(() => {
    const value = lookup.trim().toLowerCase();
    if (!value) return models.slice(0, 8).map((model) => ({ model, score: 0, method: "text" as const }));
    return models
      .map((model) => ({ model, ...scoreModel(model, value) }))
      .filter(({ score }) => score >= 35)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [lookup, models]);

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
      <div className="lookup-panel">
        <label>
          Find model in catalogue
          <input
            id="model-lookup"
            value={lookup}
            onChange={(event) => { setLookup(event.target.value); setSelected(null); }}
            onKeyDown={(event) => { if (event.key === "Enter" && matches[0]) { event.preventDefault(); choose(matches[0].model); } }}
            placeholder="Try ThinkPad, iPhone, Chromebook — not just Intel Core i5"
            autoComplete="off"
          />
        </label>
        {lookup && !selected ? (
          <div className="lookup-results" role="listbox" aria-label="Model matches">
            {matches.length ? matches.map(({ model, method }) => (
              <button type="button" key={`${model.manufacturer}-${model.model_name}`} onClick={() => choose(model)}>
                <strong>{model.manufacturer} {model.model_name}</strong><span>{method === "exact" ? "Exact model" : method === "alias" ? "Known alias / identifier" : "Text candidate"} · {model.category} · {model.confidence}</span>
              </button>
            )) : <p className="muted small">No exact catalogue match. Enter the manufacturer and exact model manually.</p>}
          </div>
        ) : null}
        {selected ? <div className="lookup-result"><strong>Candidate selected — verify on the device</strong><span>Source checked {selected.source_checked} · catalogue confidence {selected.confidence}</span><small>{selected.support_summary}</small><a href={selected.source_url} target="_blank" rel="noreferrer">Open supporting source</a></div> : null}
      </div>

      <div className="two">
        <label>Manufacturer<input name="manufacturer" defaultValue={selected?.manufacturer || ""} placeholder="Dell" key={`manufacturer-${selected?.model_name || "blank"}`} /></label>
        <label>Exact model<input name="model" defaultValue={selected?.model_name || ""} placeholder="Latitude 5400" key={`model-${selected?.model_name || "blank"}`} required /></label>
      </div>
      {selected ? <div className="callout info"><strong>Verify before accepting:</strong> {selected.lock_risks} {selected.battery_notes}</div> : null}
    </>
  );
}
