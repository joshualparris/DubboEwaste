"use client";

import { ResponsiveTable } from "@/components/ResponsiveTable";

import { PROGRAMMES, type Programme } from "@/lib/programmes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { removeMistakenAssets } from "@/app/(private)/assets/actions";
import { QRCodeSVG } from "qrcode.react";

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
};

function productName(asset: AssetRow) {
  return [asset.manufacturer, asset.model].filter(Boolean).join(" ") || asset.category.replaceAll("_", " ");
}

export function AssetBatchTable({ assets, canRemove=false }: { assets: AssetRow[]; canRemove?:boolean }) {
  const router=useRouter();
  const [removed,setRemoved]=useState<string[]>([]),[pending,setPending]=useState<AssetRow[]|null>(null),[reason,setReason]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState("");
  const visible=assets.filter(a=>!removed.includes(a.id));
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
      <section className="card">
        <div className="batch-label-toolbar no-print">
          <div>
            <strong>Selected asset actions</strong>
            <div className="muted small">
              Select assets below to print labels or remove mistaken entries.
            </div>
          </div>
          <div className="actions">
            <button className="button secondary" type="button" onClick={toggleAll}>
              {allSelected ? "Clear all" : "Select all shown"}
            </button>
            <button
              className="button"
              type="button"
              onClick={printSelected}
              disabled={!selectedAssets.length}
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
        <div className="table-wrap">
          <ResponsiveTable>
            <thead>
              <tr>
                <th className="asset-select-cell">
                  <input
                    className="asset-select"
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all shown assets"
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
              {visible.map((asset) => (
                <tr key={asset.id}>
                  <td className="asset-select-cell">
                    <input
                      className="asset-select"
                      type="checkbox"
                      checked={selected.includes(asset.id)}
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
