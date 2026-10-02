#!/usr/bin/env python3
"""Validate the blank/real pilot tracker schema without exposing private data."""

import csv
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TRACKER = ROOT / "pilot-tracker.csv"
REJECTS = ROOT / "templates" / "triage-reject-log.csv"
MATRIX = ROOT / "docs" / "triage-matrix.csv"

REQUIRED_TRACKER = {
    "asset_id", "transfer_authority_recorded", "serial_imei", "battery_condition",
    "account_lock_mdm_status", "sanitisation_result", "triage_minutes",
    "triage_decision", "triage_reason", "reject_log_id", "final_route",
}
REQUIRED_REJECTS = {
    "reject_id", "date", "device_category", "reason_code", "reason_detail",
    "minutes_spent",
}
REQUIRED_MATRIX = {
    "category", "minimum_phase_0_gate", "required_checks", "preferred_route",
    "hold_or_reject_trigger", "required_evidence",
}


def header(path: Path) -> list[str]:
    with path.open(newline="") as handle:
        return next(csv.reader(handle))


def check_unique(name: str, fields: list[str]) -> list[str]:
    duplicates = sorted({field for field in fields if fields.count(field) > 1})
    return [f"{name}: duplicate fields: {', '.join(duplicates)}"] if duplicates else []


def main() -> int:
    errors: list[str] = []
    tracker = header(TRACKER)
    rejects = header(REJECTS)
    matrix = header(MATRIX)
    errors += check_unique("pilot-tracker.csv", tracker)
    errors += check_unique("triage-reject-log.csv", rejects)
    errors += check_unique("triage-matrix.csv", matrix)
    errors += [f"pilot-tracker.csv: missing {field}" for field in sorted(REQUIRED_TRACKER - set(tracker))]
    errors += [f"triage-reject-log.csv: missing {field}" for field in sorted(REQUIRED_REJECTS - set(rejects))]
    errors += [f"triage-matrix.csv: missing {field}" for field in sorted(REQUIRED_MATRIX - set(matrix))]

    with MATRIX.open(newline="") as handle:
        rows = list(csv.DictReader(handle))
    if not rows:
        errors.append("triage-matrix.csv: no category rows")
    for row in rows:
        if not row.get("category") or not row.get("preferred_route") or not row.get("required_evidence"):
            errors.append(f"triage-matrix.csv: incomplete category row: {row.get('category', '<blank>')}")

    if errors:
        print("Pilot tracker validation failed:")
        print("\n".join(f"- {error}" for error in errors))
        return 1
    print(f"Pilot tracker validation passed: {len(tracker)} tracker fields, {len(rows)} matrix categories.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
