#!/usr/bin/env python3
"""Deterministic Phase 0 intake decision support.

Input is a JSON object or a JSON array of intake records. The tool deliberately
defaults to HOLD when a safety, ownership, lock, sanitisation or route fact is
missing. It does not inspect hardware and does not certify a wipe.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MATRIX = ROOT / "docs" / "triage-matrix.csv"

PHASE_0 = {"laptop", "desktop/mini-pc", "phone/tablet", "monitor"}
APPROVAL_ONLY = {"tv", "printer", "mixed_business_lot"}
ALWAYS_REJECT = {"loose_battery"}


def load_matrix() -> dict[str, dict[str, str]]:
    import csv

    with MATRIX.open(newline="") as handle:
        return {row["category"]: row for row in csv.DictReader(handle)}


def decide(record: dict[str, object], matrix: dict[str, dict[str, str]]) -> dict[str, object]:
    category = str(record.get("device_category", "")).strip()
    reasons: list[str] = []
    required: list[str] = []
    decision = "ACCEPT"

    if category not in matrix:
        decision = "HOLD"
        reasons.append("unknown device category")
    if category in ALWAYS_REJECT:
        decision = "REJECT"
        reasons.append("loose batteries are outside Phase 0 intake")
    if category in APPROVAL_ONLY:
        decision = "HOLD"
        reasons.append("category requires prior approval in Phase 0")
    if category not in PHASE_0 and category not in APPROVAL_ONLY and category not in ALWAYS_REJECT:
        decision = "HOLD"
        reasons.append("category is not in the Phase 0 acceptance set")

    if record.get("transfer_authority_recorded") is not True:
        decision = "HOLD" if decision != "REJECT" else decision
        reasons.append("transfer authority is not recorded")
        required.append("ownership/authority record")

    battery = str(record.get("battery_condition", "unknown")).lower()
    if any(word in battery for word in ("swollen", "damaged", "hot", "leaking", "punctured")):
        decision = "REJECT"
        reasons.append("battery condition indicates a safety escalation")
        required.append("quarantine and incident record")
    elif battery in {"", "unknown"}:
        decision = "HOLD" if decision != "REJECT" else decision
        reasons.append("battery condition is unknown")
        required.append("battery safety screen")

    lock = str(record.get("account_lock_mdm_status", "unknown")).lower()
    if lock in {"locked", "activation lock", "frp", "mdm", "autopilot"}:
        decision = "REJECT"
        reasons.append("account or management lock is present")
    elif lock in {"", "unknown", "not checked"}:
        decision = "HOLD" if decision != "REJECT" else decision
        reasons.append("account/management lock is not cleared")
        required.append("lock check")

    if record.get("data_bearing") is True and str(record.get("sanitisation_result", "")).upper() != "PASS":
        decision = "HOLD" if decision != "REJECT" else decision
        reasons.append("data-bearing device lacks a recorded sanitisation PASS")
        required.append("sanitisation record and verification")

    if not record.get("final_route"):
        decision = "HOLD" if decision != "REJECT" else decision
        reasons.append("no final route is recorded")
        required.append("buyer, social-reuse or downstream route")

    if not record.get("asset_id"):
        required.append("asset ID")

    return {
        "asset_id": record.get("asset_id", ""),
        "decision": decision,
        "reasons": list(dict.fromkeys(reasons)),
        "required_evidence": list(dict.fromkeys(required)),
        "disclaimer": "Decision support only; not a physical safety, legal or sanitisation certification.",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="JSON record or array of records")
    args = parser.parse_args()
    try:
        data = json.loads(args.input.read_text())
        records = data if isinstance(data, list) else [data]
        if not all(isinstance(record, dict) for record in records):
            raise ValueError("input must be an object or array of objects")
        matrix = load_matrix()
        print(json.dumps([decide(record, matrix) for record in records], indent=2))
        return 0
    except (OSError, json.JSONDecodeError, ValueError) as error:
        print(f"triage_intake: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
