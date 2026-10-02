"use client";

import { QRCodeSVG } from "qrcode.react";

export function AssetQr({ assetCode, assetId }: { assetCode: string; assetId: string }) {
  const value = typeof window === "undefined"
    ? assetCode
    : `${window.location.origin}/assets/${assetId}`;

  return (
    <div className="qr">
      <QRCodeSVG value={value} size={150} marginSize={1} />
      <strong>{assetCode}</strong>
    </div>
  );
}
