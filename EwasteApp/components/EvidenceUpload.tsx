"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export function EvidenceUpload({
  entityType,
  entityId,
  label = "Attach file / photo",
}: {
  entityType: string;
  entityId: string;
  label?: string;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function upload(file: File | null) {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setMessage("File is larger than the 20 MB pilot limit.");
      return;
    }
    setBusy(true);
    setMessage("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("Session expired.");
      setBusy(false);
      return;
    }

    const bytes = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    const sha256 = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `${entityType}/${entityId}/${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabase.storage.from("evidence").upload(storageKey, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });
    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }

    const response = await fetch("/api/evidence", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        entity_type: entityType,
        entity_id: entityId,
        evidence_type: file.type.startsWith("image/") ? "PHOTO" : "ATTACHMENT",
        filename: file.name,
        mime_type: file.type || null,
        size_bytes: file.size,
        storage_key: storageKey,
        sha256,
        source: "STAFF_UPLOAD",
      }),
    });
    if (!response.ok) {
      await supabase.storage.from("evidence").remove([storageKey]);
      setMessage("Upload metadata could not be recorded.");
      setBusy(false);
      return;
    }
    setMessage("Uploaded and hashed.");
    setBusy(false);
    window.location.reload();
  }

  return (
    <label className="upload-control">
      <span>{label}</span>
      <input type="file" disabled={busy} onChange={(e) => upload(e.target.files?.[0] ?? null)} />
      {message ? <small className="muted">{message}</small> : null}
    </label>
  );
}
