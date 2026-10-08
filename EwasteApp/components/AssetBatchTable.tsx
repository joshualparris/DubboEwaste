"use client";

import { ResponsiveTable } from "@/components/ResponsiveTable";

import { PROGRAMMES, type Programme } from "@/lib/programmes";
import Link from "next/link";
import { useEffect, useState } from "react";
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

export function AssetBatchTable({ assets }: { assets: AssetRow[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const selectedAssets = assets.filter((asset) => selected.includes(asset.id));
  const allSelected = assets.length > 0 && selected.length === assets.length;

  function toggleAsset(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function toggleAll() {
    setSelected(allSelected ? [] : assets.map((asset) => asset.id));
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
            <strong>Batch label printing</strong>
            <div className="muted small">
              Select assets below, then print all selected labels in one print job.
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
          </div>
        </div>

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
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td className="asset-select-cell">
                    <input
                      className="asset-select"
                      type="checkbox"
                      checked={selected.includes(asset.id)}
                      onChange={() => toggleAsset(asset.id)}
                      aria-label={`Select ${asset.asset_code} for label printing`}
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
