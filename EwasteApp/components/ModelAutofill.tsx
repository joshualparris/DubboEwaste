"use client";

import { useMemo, useState } from "react";

type ModelRecord = {
  manufacturer: string;
  model_name: string;
  category: string;
  support_summary: string;
  lock_risks: string;
  battery_notes: string;
  likely_route: string;
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

export function ModelAutofill({ models }: { models: ModelRecord[] }) {
  const [lookup, setLookup] = useState("");
  const [selected, setSelected] = useState<ModelRecord | null>(null);
  const matches = useMemo(() => {
    const value = lookup.trim().toLowerCase();
    if (!value) return models.slice(0, 8);
    return models.filter((model) => `${model.manufacturer} ${model.model_name} ${model.category}`.toLowerCase().includes(value)).slice(0, 8);
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
            onKeyDown={(event) => { if (event.key === "Enter" && matches[0]) { event.preventDefault(); choose(matches[0]); } }}
            placeholder="Try ThinkPad, iPhone, Chromebook — not just Intel Core i5"
            autoComplete="off"
          />
        </label>
        {lookup && !selected ? (
          <div className="lookup-results" role="listbox" aria-label="Model matches">
            {matches.length ? matches.map((model) => (
              <button type="button" key={`${model.manufacturer}-${model.model_name}`} onClick={() => choose(model)}>
                <strong>{model.manufacturer} {model.model_name}</strong><span>{model.category} · {model.confidence}</span>
              </button>
            )) : <p className="muted small">No exact catalogue match. Enter the manufacturer and exact model manually.</p>}
          </div>
        ) : null}
        {selected ? <div className="lookup-result"><strong>Catalogue record selected</strong><span>Checked {selected.source_checked} · {selected.confidence}</span><small>{selected.support_summary}</small></div> : null}
      </div>

      <div className="two">
        <label>Manufacturer<input name="manufacturer" defaultValue={selected?.manufacturer || ""} placeholder="Dell" key={`manufacturer-${selected?.model_name || "blank"}`} /></label>
        <label>Exact model<input name="model" defaultValue={selected?.model_name || ""} placeholder="Latitude 5400" key={`model-${selected?.model_name || "blank"}`} required /></label>
      </div>
      {selected ? <div className="callout info"><strong>Verify before accepting:</strong> {selected.lock_risks} {selected.battery_notes}</div> : null}
    </>
  );
}
