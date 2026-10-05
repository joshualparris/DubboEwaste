"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type BarcodeProduct = {
  manufacturer: string;
  model_name: string;
  category: string;
  source: string;
  source_url: string;
  barcode: string;
  image_url?: string;
  confidence: string;
};

type ExistingAsset = {
  id: string;
  asset_code: string;
  manufacturer?: string | null;
  model?: string | null;
  serial_imei?: string | null;
};

type LookupResponse = {
  kind?: "product" | "existing_asset" | "unmatched";
  scanned?: string;
  valid_gtin?: boolean;
  products?: BarcodeProduct[];
  providers_checked?: string[];
  message?: string;
  asset?: ExistingAsset;
  href?: string;
  error?: string;
};

type DetectedBarcode = {
  rawValue: string;
  format?: string;
};

type DetectorInstance = {
  detect(source: HTMLVideoElement): Promise<DetectedBarcode[]>;
};

type DetectorConstructor = {
  new (options?: { formats?: string[] }): DetectorInstance;
  getSupportedFormats?: () => Promise<string[]>;
};

const PREFERRED_FORMATS = [
  "ean_13",
  "ean_8",
  "upc_a",
  "upc_e",
  "code_128",
  "code_39",
  "code_93",
  "itf",
  "codabar",
  "data_matrix",
  "qr_code",
  "pdf417",
  "aztec",
];

function setSerialField(value: string) {
  const field = document.querySelector<HTMLInputElement>('input[name="serial_imei"]');
  if (!field) return false;
  field.value = value;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.focus();
  return true;
}

export function BarcodeLookup({
  onProduct,
}: {
  onProduct: (product: BarcodeProduct) => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [openingCamera, setOpeningCamera] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [response, setResponse] = useState<LookupResponse | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<BarcodeProduct | null>(null);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTokenRef = useRef(0);

  function stopCamera() {
    scanTokenRef.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOpen(false);
    setOpeningCamera(false);
  }

  useEffect(() => () => {
    scanTokenRef.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  async function lookupBarcode(value = code) {
    const scanned = value.trim();
    if (!scanned) {
      setError("Scan or enter a barcode first.");
      return;
    }

    stopCamera();
    setCode(scanned);
    setLoading(true);
    setError("");
    setResponse(null);
    setSelectedProduct(null);

    try {
      const result = await fetch(`/api/barcode-lookup?code=${encodeURIComponent(scanned)}`, {
        cache: "no-store",
      });
      const body = (await result.json()) as LookupResponse;
      if (!result.ok) throw new Error(body.error || `Lookup failed (${result.status})`);
      setResponse(body);

      if (body.kind === "product" && body.products?.length === 1) {
        setSelectedProduct(body.products[0]);
        onProduct(body.products[0]);
      }
    } catch (lookupError) {
      setError(
        lookupError instanceof Error
          ? lookupError.message
          : "Barcode lookup is temporarily unavailable.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function startCamera() {
    setError("");
    setResponse(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera scanning is not available in this browser. Enter the barcode below or use a USB/Bluetooth scanner.");
      return;
    }

    const Detector = (window as typeof window & { BarcodeDetector?: DetectorConstructor })
      .BarcodeDetector;
    if (!Detector) {
      setError("This browser does not support camera barcode detection. Enter the code below or use a USB/Bluetooth scanner.");
      return;
    }

    setOpeningCamera(true);
    const token = scanTokenRef.current + 1;
    scanTokenRef.current = token;

    try {
      let formats: string[] | undefined;
      if (Detector.getSupportedFormats) {
        const supported = await Detector.getSupportedFormats();
        const preferred = PREFERRED_FORMATS.filter((format) => supported.includes(format));
        if (preferred.length) formats = preferred;
      }

      const detector = formats?.length ? new Detector({ formats }) : new Detector();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (scanTokenRef.current !== token) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      setCameraOpen(true);
      setOpeningCamera(false);

      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      });

      const video = videoRef.current;
      if (!video) {
        stopCamera();
        return;
      }

      video.srcObject = stream;
      await video.play();

      const detectLoop = async () => {
        if (scanTokenRef.current !== token || !streamRef.current || !videoRef.current) return;
        try {
          const found = await detector.detect(videoRef.current);
          const rawValue = found.find((item) => item.rawValue?.trim())?.rawValue?.trim();
          if (rawValue) {
            navigator.vibrate?.(60);
            await lookupBarcode(rawValue);
            return;
          }
        } catch {
          // A frame can fail while the camera is starting; keep scanning.
        }
        if (scanTokenRef.current === token) {
          window.setTimeout(detectLoop, 180);
        }
      };

      window.setTimeout(detectLoop, 180);
    } catch (cameraError) {
      stopCamera();
      const name = cameraError instanceof DOMException ? cameraError.name : "";
      if (name === "NotAllowedError") {
        setError("Camera permission was blocked. Allow camera access, or enter the barcode manually.");
      } else {
        setError("Could not start the barcode scanner. Enter the barcode manually or use a USB/Bluetooth scanner.");
      }
    } finally {
      setOpeningCamera(false);
    }
  }

  function selectProduct(product: BarcodeProduct) {
    setSelectedProduct(product);
    onProduct(product);
  }

  function useAsSerial() {
    const value = response?.scanned || code.trim();
    if (!value) return;
    if (!setSerialField(value)) {
      setError("Could not find the Serial / IMEI field.");
    }
  }

  return (
    <div className="barcode-panel">
      <input type="hidden" name="product_barcode" value={selectedProduct?.barcode ?? ""} />
      <input type="hidden" name="barcode_lookup_source" value={selectedProduct?.source ?? ""} />
      <input type="hidden" name="barcode_lookup_url" value={selectedProduct?.source_url ?? ""} />
      <div className="barcode-heading">
        <div>
          <strong>Scan manufacturer barcode</strong>
          <p className="muted small">
            Scan UPC/EAN/GTIN, a service tag, serial barcode, or an existing AssetFlow label.
          </p>
        </div>
        <button
          className="button"
          type="button"
          onClick={cameraOpen ? stopCamera : startCamera}
          disabled={loading || openingCamera}
        >
          {openingCamera ? "Opening camera…" : cameraOpen ? "Stop camera" : "Scan barcode"}
        </button>
      </div>

      {cameraOpen ? (
        <div className="barcode-camera">
          <video ref={videoRef} playsInline muted aria-label="Barcode camera preview" />
          <span>Hold the barcode inside the camera view</span>
        </div>
      ) : null}

      <div className="barcode-entry">
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void lookupBarcode();
            }
          }}
          placeholder="Scan or type UPC / EAN / GTIN / serial / asset tag"
          inputMode="text"
          autoComplete="off"
          aria-label="Barcode or serial number"
        />
        <button
          className="button secondary"
          type="button"
          onClick={() => void lookupBarcode()}
          disabled={loading || !code.trim()}
        >
          {loading ? "Looking up…" : "Look up"}
        </button>
      </div>

      <p className="muted small">
        Lookup order: AssetFlow first, then Open Products Facts, UPCitemdb and Wikidata GTIN.
        USB/Bluetooth barcode scanners also work here like a keyboard.
      </p>

      {error ? <div className="error small">{error}</div> : null}

      {response?.kind === "existing_asset" && response.asset && response.href ? (
        <div className="lookup-result barcode-existing">
          <strong>Already in AssetFlow — do not create a duplicate</strong>
          <span>
            {response.asset.asset_code}
            {response.asset.manufacturer || response.asset.model
              ? ` · ${[response.asset.manufacturer, response.asset.model].filter(Boolean).join(" ")}`
              : ""}
          </span>
          <Link className="button secondary" href={response.href}>
            Open existing asset
          </Link>
        </div>
      ) : null}

      {response?.kind === "product" && response.products?.length ? (
        <div className="lookup-results" role="listbox" aria-label="Barcode product matches">
          {response.products.map((product, index) => (
            <button
              type="button"
              key={`${product.source}-${product.barcode}-${index}`}
              onClick={() => selectProduct(product)}
            >
              <strong>{product.manufacturer} {product.model_name}</strong>
              <span>
                {product.source} · {product.category} · {product.confidence}
              </span>
            </button>
          ))}
          <p className="muted small">
            Product databases identify the retail product, not the unique device. Still record the device serial/IMEI separately.
          </p>
        </div>
      ) : null}

      {response?.kind === "unmatched" ? (
        <div className="lookup-result">
          <strong>No product match found</strong>
          <span>{response.message}</span>
          <div className="actions">
            <button className="button secondary" type="button" onClick={useAsSerial}>
              Use scanned code as Serial / IMEI
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
