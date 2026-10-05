"use client";

import { useEffect, useRef, useState } from "react";

type DetectedBarcode = { rawValue?: string };

type BarcodeDetectorLike = {
  detect(source: HTMLVideoElement): Promise<DetectedBarcode[]>;
};

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetectorLike;

export function AssetQrScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function stopScanner() {
    if (scanTimerRef.current !== null) {
      window.clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setScanning(false);
  }

  useEffect(() => {
    return () => {
      if (scanTimerRef.current !== null) window.clearTimeout(scanTimerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function openScannedValue(rawValue: string) {
    stopScanner();

    const raw = rawValue.trim();
    try {
      const parsed = new URL(raw);
      const assetPath = parsed.pathname.match(/^\/assets\/([0-9a-f-]{20,})$/i);
      if (assetPath) {
        window.location.assign(`/assets/${assetPath[1]}`);
        return;
      }
    } catch {
      // Not a URL. Treat the QR contents as a searchable identifier.
    }

    window.location.assign(`/search?q=${encodeURIComponent(raw)}`);
  }

  async function startScanner() {
    setMessage(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage("Camera access is not available in this browser. You can still type or use a handheld scanner below.");
      return;
    }

    const Detector = (window as Window & { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector;
    if (!Detector) {
      setMessage("Camera QR scanning is not supported by this browser. Open AssetFlow in Chrome on Android, or type/scan the asset ID below.");
      return;
    }

    try {
      const detector = new Detector({ formats: ["qr_code"] });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      video.srcObject = stream;
      await video.play();
      setScanning(true);

      const scan = async () => {
        if (!streamRef.current || !videoRef.current) return;

        try {
          const codes = await detector.detect(videoRef.current);
          const value = codes.find((code) => code.rawValue)?.rawValue;
          if (value) {
            openScannedValue(value);
            return;
          }
        } catch {
          // A frame can fail while the camera is warming up. Keep scanning.
        }

        scanTimerRef.current = window.setTimeout(scan, 180);
      };

      scan();
    } catch (error) {
      stopScanner();
      const name = error instanceof DOMException ? error.name : "";
      setMessage(
        name === "NotAllowedError"
          ? "Camera permission was denied. Allow camera access for AssetFlow, then try again."
          : "I could not start the camera. You can still type or use a handheld scanner below."
      );
    }
  }

  return (
    <section className="card qr-scanner-card">
      <div className="qr-scanner-heading">
        <div>
          <h2>Scan QR code</h2>
          <p className="muted">Point your phone camera at an AssetFlow label to open that asset immediately.</p>
        </div>
        <div className="actions">
          {!scanning ? (
            <button className="button" type="button" onClick={startScanner}>Open camera scanner</button>
          ) : (
            <button className="button secondary" type="button" onClick={stopScanner}>Stop camera</button>
          )}
        </div>
      </div>

      <div className={`qr-camera-frame ${scanning ? "is-active" : ""}`}>
        <video ref={videoRef} playsInline muted aria-label="QR code camera preview" />
        {scanning ? <div className="qr-scan-guide" aria-hidden="true" /> : null}
      </div>

      {message ? <div className="error">{message}</div> : null}
    </section>
  );
}
