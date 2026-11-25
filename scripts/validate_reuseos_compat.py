#!/usr/bin/env python3
"""Validate data/reuseos-hardware-compatibility.csv.

Rules (from the ReuseOS brief): a device is never "supported" because its architecture
matches. reuseos_status records what ReuseOS has actually demonstrated, in increasing order:
  not-started < source-written < compiled < boot-tested-vm < physically-verified
plus the terminal states unsupported and blocked. Anything at compiled or above must cite
evidence; physically-verified must cite a recorded test of that exact model.
"""
import csv, sys
from pathlib import Path
DB = Path(__file__).resolve().parents[1] / "data" / "reuseos-hardware-compatibility.csv"
STATUSES = ["not-started", "source-written", "compiled", "boot-tested-vm", "physically-verified", "unsupported", "blocked"]
CATEGORIES = {"computer", "mac", "chromebook", "phone", "tablet"}
REQUIRED = ["id", "category", "family_or_model", "architecture", "reuseos_edition", "install_path",
            "bootloader_requirement", "prerequisites", "upstream_project", "upstream_status",
            "reuseos_status", "evidence", "source_url", "notes"]

def validate(path=DB):
    rows = list(csv.DictReader(path.open(newline="", encoding="utf-8")))
    errors = []
    if not rows or list(rows[0].keys()) != REQUIRED:
        return ["header must be exactly: " + ",".join(REQUIRED)]
    ids = set()
    for n, r in enumerate(rows, 2):
        where = f"line {n} ({r['id']})"
        if r["id"] in ids: errors.append(f"{where}: duplicate id")
        ids.add(r["id"])
        if r["category"] not in CATEGORIES: errors.append(f"{where}: unknown category {r['category']!r}")
        if r["reuseos_status"] not in STATUSES: errors.append(f"{where}: unknown reuseos_status {r['reuseos_status']!r}")
        if r["reuseos_status"] in ("compiled", "boot-tested-vm", "physically-verified") and not r["evidence"].strip():
            errors.append(f"{where}: {r['reuseos_status']} requires evidence")
        if r["reuseos_status"] == "physically-verified" and "model" not in r["evidence"].lower():
            errors.append(f"{where}: physically-verified evidence must name the exact model tested")
        if r["reuseos_status"] not in ("unsupported", "blocked") and not r["install_path"].strip():
            errors.append(f"{where}: an install path is required unless unsupported/blocked")
    return errors

if __name__ == "__main__":
    errs = validate(Path(sys.argv[1]) if len(sys.argv) > 1 else DB)
    for e in errs: print("ERROR:", e)
    print("OK" if not errs else f"{len(errs)} error(s)")
    sys.exit(1 if errs else 0)
