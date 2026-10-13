"use client";

import {useMemo, useState} from "react";

type DonorAsset = {
  id: string;
  asset_code: string;
  manufacturer: string | null;
  model: string | null;
  serial_imei?: string | null;
};

const describe = (asset: DonorAsset) =>
  [asset.asset_code, [asset.manufacturer, asset.model].filter(Boolean).join(" ")].filter(Boolean).join(" · ");

export function DonorAssetPicker({assets}: {assets: DonorAsset[]}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [showResults, setShowResults] = useState(false);
  const trimmed = query.trim().toLocaleLowerCase();
  const matches = useMemo(() => {
    if (trimmed.length < 2) return [];
    const terms = trimmed.split(/\s+/).filter(Boolean);
    return assets.filter(asset => {
      const text = [asset.asset_code, asset.manufacturer, asset.model, asset.serial_imei]
        .filter(Boolean).join(" ").toLocaleLowerCase();
      return terms.every(term => text.includes(term));
    }).sort((a, b) => {
      const aStarts = a.asset_code.toLocaleLowerCase().startsWith(trimmed) ? 0 : 1;
      const bStarts = b.asset_code.toLocaleLowerCase().startsWith(trimmed) ? 0 : 1;
      return aStarts - bStarts || a.asset_code.localeCompare(b.asset_code);
    });
  }, [assets, trimmed]);
  const selected = assets.find(asset => asset.id === selectedId);
  const visible = showResults && !selected && trimmed.length >= 2;

  function choose(asset: DonorAsset) {
    setSelectedId(asset.id);
    setQuery(describe(asset));
    setShowResults(false);
  }

  return (
    <div style={{display:"grid", gap:8, width:"100%", maxWidth:680}}>
      <label htmlFor="donor-asset-search" style={{fontWeight:600}}>Donor asset</label>
      <input
        id="donor-asset-search"
        type="search"
        placeholder="Search by asset ID, brand, model or serial"
        autoComplete="off"
        value={query}
        aria-label="Search donor assets"
        aria-expanded={visible}
        aria-controls="donor-search-results"
        onChange={event => {
          setQuery(event.target.value);
          setSelectedId("");
          setShowResults(true);
        }}
        onFocus={() => {if (!selectedId) setShowResults(true);}}
        onKeyDown={event => {
          if (event.key === "Escape") setShowResults(false);
          if (event.key === "Enter" && !selectedId) {
            event.preventDefault();
            if (matches.length > 0) choose(matches[0]);
          }
        }}
        style={{width:"100%",maxWidth:"100%",minHeight:48,padding:"10px 12px",fontSize:16,boxSizing:"border-box"}}
      />
      <input type="hidden" name="origin_asset_id" value={selectedId}/>
      {selected ? (
        <div role="status" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,border:"1px solid #8888",borderRadius:8,padding:12}}>
          <span><strong>Selected:</strong> {describe(selected)}</span>
          <button type="button" onClick={() => {
            setSelectedId("");
            setQuery("");
            setShowResults(false);
            document.getElementById("donor-asset-search")?.focus();
          }}>Change</button>
        </div>
      ) : visible ? (
        <div id="donor-search-results" style={{border:"1px solid #8888",borderRadius:8,overflow:"hidden"}}>
          {matches.length === 0 ? (
            <p role="status" style={{padding:12,margin:0}}>No matching donor assets. Try another model or asset code.</p>
          ) : (
            <>
              <div style={{padding:"8px 12px",fontSize:13}}>
                {matches.length} match{matches.length === 1 ? "" : "es"}
                {matches.length > 8 ? " · showing the first 8; refine your search" : " · tap a device to select"}
              </div>
              <ul style={{listStyle:"none",margin:0,padding:0}}>
                {matches.slice(0,8).map(asset => (
                  <li key={asset.id}>
                    <button
                      type="button"
                      onClick={() => choose(asset)}
                      style={{display:"block",width:"100%",minHeight:48,padding:"12px 14px",textAlign:"left",fontSize:16,border:"0",borderTop:"1px solid #8885",borderRadius:0,whiteSpace:"normal",overflowWrap:"anywhere",background:"transparent",color:"inherit"}}
                    ><strong>{asset.asset_code}</strong> · {[asset.manufacturer,asset.model].filter(Boolean).join(" ")}</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <p style={{fontSize:13,margin:0}}>Type at least two characters, then tap the correct computer. Only your selection will be saved.</p>
      )}
      {assets.length >= 400 && <p style={{fontSize:13,margin:0}}>Showing search results from the most recent 400 assets. Older donors may need a separate lookup.</p>}
    </div>
  );
}
