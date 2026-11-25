"use client";

import { ResponsiveTable } from "@/components/ResponsiveTable";

import { PROGRAMMES, type Programme } from "@/lib/programmes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { removeMistakenAssets } from "@/app/(private)/assets/actions";
import { QRCodeSVG } from "qrcode.react";
import { deviceFamily, families, matchesInventory, inventoryGroups, emptyFilters, type InventoryFilters } from "@/lib/inventory-filters";

type AssetRow = {
  id: string;
  programme?: Programme;
  asset_code: string;
  category: string;
  manufacturer: string | null;
  model: string | null;
  serial_imei: string | null;
  status: string;
  data_state: string;
  initial_route: string | null;
  location_id?:string|null;
  job_id?:string|null;
};

function productName(asset: AssetRow) {
  return [asset.manufacturer, asset.model].filter(Boolean).join(" ") || asset.category.replaceAll("_", " ");
}

export function AssetBatchTable({ assets, canRemove=false, locations=[], jobs=[] }: { assets: AssetRow[]; canRemove?:boolean; locations?:{id:string;name:string}[]; jobs?:{id:string;job_code:string;source_site:string|null}[] }) {
  const router=useRouter();
  const [removed,setRemoved]=useState<string[]>([]),[pending,setPending]=useState<AssetRow[]|null>(null),[reason,setReason]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState("");
  const [filters,setFilters]=useState<InventoryFilters>(emptyFilters),[grouped,setGrouped]=useState(true),[page,setPage]=useState(0),[sort,setSort]=useState("recent");
  const available=assets.filter(a=>!removed.includes(a.id));
  const matching=available.filter(a=>matchesInventory(a,filters));
  if(sort==="name")matching.sort((a,b)=>productName(a).localeCompare(productName(b))||a.asset_code.localeCompare(b.asset_code));
  if(sort==="code")matching.sort((a,b)=>a.asset_code.localeCompare(b.asset_code));
  const ordered=inventoryGroups(matching,grouped).flatMap(g=>g.rows);
  const pageSize=40, pageCount=Math.max(1,Math.ceil(ordered.length/pageSize)),activePage=Math.min(page,pageCount-1);
  const visible=ordered.slice(activePage*pageSize,(activePage+1)*pageSize);
  const groups=inventoryGroups(visible,grouped);
  function resetSelection(){setSelected([]);setPending(null);setError("");}
  function changeFilter(key:keyof InventoryFilters,value:string){setFilters(old=>({...old,[key]:value}));setPage(0);resetSelection();}
  function changePage(n:number){setPage(n);resetSelection();window.scrollTo({top:0,behavior:"smooth"});}
  const unique=(key:"category"|"status"|"data_state"|"initial_route")=>Array.from(new Set(available.map(a=>a[key]).filter((v):v is string=>!!v))).sort();
  const brands=Array.from(new Map(available.filter(a=>a.manufacturer).map(a=>[a.manufacturer!.toLowerCase(),a.manufacturer!])).entries()).sort((a,b)=>a[1].localeCompare(b[1]));

  const eligible=(a:AssetRow)=>a.programme==="dubbo_ewaste"&&["INTAKE","HOLD"].includes(a.status)&&["UNWIPED_RESTRICTED","NON_DATA_BEARING"].includes(a.data_state);
  function beginRemove(items:AssetRow[]){setPending(items);setReason("");setError("");setMessage("");}
  async function confirmRemove(){if(!pending||busy||reason.trim().length<3)return;setBusy(true);setError("");try{const ids=pending.map(a=>a.id);const result=await removeMistakenAssets(ids,reason);if(!result.ok){setError(result.error);return;}setRemoved(old=>[...old,...ids]);setSelected(old=>old.filter(id=>!ids.includes(id)));setPending(null);setMessage(`${result.count} asset record(s) removed. Audit history retained.`);router.refresh();}catch{setError("Removal could not be confirmed. Refresh inventory before retrying.");}finally{setBusy(false);}}
  const [selected, setSelected] = useState<string[]>([]);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const selectedAssets = visible.filter((asset) => selected.includes(asset.id));
  const allSelected = visible.length > 0 && selectedAssets.length === visible.length;

  function toggleAsset(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function toggleAll() {
    setSelected(allSelected ? [] : visible.map((asset) => asset.id));
  }

  function printSelected() {
    if (!selectedAssets.length) return;

    document.documentElement.classList.add("asset-batch-printing");
    const cleanup = () => {
      document.documentElement.classList.remove("asset-batch-printing");
    };

    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
  }

  return (
    <>
      <section className="card form no-print" aria-label="Inventory filters">
        <h2>Find assets</h2>
        <label>Search inventory<input value={filters.query} disabled={busy} placeholder="Model, brand, serial or asset ID" onChange={e=>changeFilter("query",e.target.value)}/></label>
        <div className="actions" aria-label="Quick device filters">
          {["","Macs","iPhones","iPads","Laptops","Desktops","Other phones","Other tablets"].map(f=><button key={f||"all"} className={filters.family===f?"button":"button secondary"} type="button" aria-pressed={filters.family===f} disabled={busy} onClick={()=>changeFilter("family",f)}>{f||"All assets"} ({f?available.filter(a=>deviceFamily(a)===f).length:available.length})</button>)}
        </div>
        <div className="two">
          <label>Device family<select value={filters.family} disabled={busy} onChange={e=>changeFilter("family",e.target.value)}><option value="">All families</option>{families.map(f=><option key={f}>{f}</option>)}</select></label>
          <label>Category<select value={filters.category} disabled={busy} onChange={e=>changeFilter("category",e.target.value)}><option value="">All categories</option>{unique("category").map(v=><option key={v}>{v}</option>)}</select></label>
        </div>
        <details><summary>More filters</summary><div className="form">
          <label>Manufacturer<select value={filters.brand} disabled={busy} onChange={e=>changeFilter("brand",e.target.value)}><option value="">All brands</option>{brands.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>
          {([["status","status","Status"],["data","data_state","Data state"],["route","initial_route","Route"]] as const).map(([k,col,label])=><label key={k}>{label}<select value={filters[k]} disabled={busy} onChange={e=>changeFilter(k,e.target.value)}><option value="">All</option>{unique(col).map(v=><option key={v}>{v}</option>)}</select></label>)}
          <label>Location<select value={filters.location} disabled={busy} onChange={e=>changeFilter("location",e.target.value)}><option value="">All locations</option><option value="__none">Unassigned</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
          <label>Inbound job<select value={filters.job} disabled={busy} onChange={e=>changeFilter("job",e.target.value)}><option value="">All jobs</option><option value="__none">Unassigned</option>{jobs.map(j=><option key={j.id} value={j.id}>{j.job_code} · {j.source_site||"Unknown source"}</option>)}</select></label>
        </div></details>
        <div className="two"><label>Sort by<select value={sort} disabled={busy} onChange={e=>{setSort(e.target.value);setPage(0);resetSelection();}}><option value="recent">Newest first</option><option value="name">Device name A–Z</option><option value="code">Asset ID</option></select></label><label><input type="checkbox" checked={grouped} disabled={busy} onChange={e=>{setGrouped(e.target.checked);setPage(0);resetSelection();}}/> Group by device family</label></div>
        <button type="button" className="button secondary" disabled={busy} onClick={()=>{setFilters(emptyFilters);setPage(0);resetSelection();}}>Clear filters</button>
        <p role="status">{matching.length} matching of {available.length} assets · {visible.length?activePage*pageSize+1:0}–{Math.min((activePage+1)*pageSize,matching.length)} shown</p>
      </section>
      <section className="card">
        <div className="batch-label-toolbar no-print">
          <div>
            <strong>Selected asset actions</strong>
            <div className="muted small">
              Select assets on this page to print labels or remove mistaken entries. Changing filters or page clears selection.
            </div>
          </div>
          <div className="actions">
            <button className="button secondary" type="button" disabled={busy||!visible.length} onClick={toggleAll}>
              {allSelected ? "Clear all" : "Select all shown"}
            </button>
            <button
              className="button"
              type="button"
              onClick={printSelected}
              disabled={busy||!selectedAssets.length}
            >
              Print selected labels ({selectedAssets.length})
            </button>
            {canRemove?<button type="button" className="button secondary" style={{borderColor:"#b85b5b"}} disabled={busy||!selectedAssets.length||!selectedAssets.every(eligible)} onClick={()=>beginRemove(selectedAssets)}>Delete selected assets ({selectedAssets.length})</button>:null}
          </div>
        </div>

        {message?<p className="success" role="status">{message}</p>:null}
        {canRemove&&pending?<section className="card form no-print" role="region" aria-label="Confirm asset deletion">
          <h2>Delete {pending.length} mistaken asset record(s)?</h2>
          <p>This removes inventory entries, not physical equipment. Linked operational records and Council custody are protected. An audit snapshot is retained. All selected entries must be eligible.</p>
          <p>{pending.map(a=>a.asset_code+" · "+productName(a)).join("; ")}</p>
          <label>Reason for removal<input value={reason} maxLength={500} placeholder="Duplicate or entered by mistake" disabled={busy} onChange={e=>setReason(e.target.value)}/></label>
          {error?<p className="error" role="alert">{error}</p>:null}
          <div className="actions"><button type="button" className="button" disabled={busy||reason.trim().length<3} onClick={()=>void confirmRemove()}>{busy?"Deleting…":"Confirm deletion"}</button><button type="button" className="button secondary" disabled={busy} onClick={()=>setPending(null)}>Cancel</button></div>
        </section>:null}
        {!visible.length?<p>No assets match these filters.</p>:null}
        {groups.map(group=><section key={group.name} className="stack">
        {grouped?<h2>{group.name} ({matching.filter(a=>deviceFamily(a)===group.name).length})</h2>:null}
        <div className="table-wrap">
          <ResponsiveTable>
            <thead>
              <tr>
                <th className="asset-select-cell">
                  <input
                    className="asset-select"
                    type="checkbox"
                    checked={group.rows.every(a=>selected.includes(a.id))}
                    disabled={busy}
                    onChange={()=>setSelected(old=>group.rows.every(a=>old.includes(a.id))?old.filter(id=>!group.rows.some(a=>a.id===id)):Array.from(new Set([...old,...group.rows.map(a=>a.id)])))}
                    aria-label={"Select shown "+group.name}
                  />
                </th>
                <th>Asset</th>
                <th>Programme</th>
                <th>Category</th>
                <th>Device</th>
                <th>Serial / IMEI</th>
                <th>Status</th>
                <th>Data</th>
                <th>Route</th>
                {canRemove?<th>Actions</th>:null}
              </tr>
            </thead>
            <tbody>
              {group.rows.map((asset) => (
                <tr key={asset.id}>
                  <td className="asset-select-cell">
                    <input
                      className="asset-select"
                      type="checkbox"
                      checked={selected.includes(asset.id)}
                      disabled={busy}
                      onChange={() => toggleAsset(asset.id)}
                      aria-label={`Select ${asset.asset_code} for batch actions`}
                    />
                  </td>
                  <td><Link href={`/assets/${asset.id}`}><strong>{asset.asset_code}</strong></Link></td>
                  <td>{asset.programme ? PROGRAMMES[asset.programme] : "Dubbo E-waste"}</td>
                  <td>{asset.category}</td>
                  <td>{productName(asset)}</td>
                  <td>{asset.serial_imei || "—"}</td>
                  <td><span className="badge">{asset.status}</span></td>
                  <td>{asset.data_state}</td>
                  <td>{asset.initial_route || "—"}</td>
                  {canRemove?<td>{eligible(asset)?<button className="button secondary" type="button" disabled={busy} onClick={()=>{beginRemove([asset]);window.scrollTo({top:0,behavior:"smooth"});}}>Delete asset</button>:<span className="muted small">Protected</span>}</td>:null}
                </tr>
              ))}
            </tbody>
          </ResponsiveTable>
        </div>
        </section>)}
        {pageCount>1?<div className="actions no-print"><button type="button" className="button secondary" disabled={busy||activePage===0} onClick={()=>changePage(activePage-1)}>Previous</button><span>Page {activePage+1} of {pageCount}</span><button type="button" className="button secondary" disabled={busy||activePage+1>=pageCount} onClick={()=>changePage(activePage+1)}>Next</button></div>:null}
      </section>

      <div className="asset-batch-print-area" aria-hidden="true">
        {selectedAssets.map((asset) => (
          <div className="asset-print-label" key={asset.id}>
            <QRCodeSVG
              value={origin ? `${origin}/assets/${asset.id}` : asset.asset_code}
              size={150}
              marginSize={1}
            />
            <strong>{asset.asset_code}</strong>
            <span className="asset-label-product">{productName(asset)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
