"use client";

import { QRCodeSVG } from "qrcode.react";

export function AssetQr({
  assetCode,
  assetId,
  productName,
}: {
  assetCode: string;
  assetId: string;
  productName?: string | null;
}) {
  const value = typeof window === "undefined"
    ? assetCode
    : `${window.location.origin}/assets/${assetId}`;

  function printLabel() {
    document.documentElement.classList.add("asset-label-printing");

    const cleanup = () => {
      document.documentElement.classList.remove("asset-label-printing");
    };

    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
  }

  return (
    <div className="asset-label-tools">
      <div className="qr asset-label-print-area">
        <QRCodeSVG value={value} size={150} marginSize={1} />
        <strong>{assetCode}</strong>
        {productName ? <span className="asset-label-product">{productName}</span> : null}
      </div>
      <button
        className="button no-print"
        type="button"
        onClick={printLabel}
        aria-label={`Print label for ${assetCode}`}
      >
        Print label
      </button>
    </div>
  );
}
