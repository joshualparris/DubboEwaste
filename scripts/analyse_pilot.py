#!/usr/bin/env python3
"""Analyse non-private pilot tracker CSV data without external dependencies."""

from __future__ import annotations

import argparse
import csv
import json
import statistics
from pathlib import Path


def number(row: dict[str, str], key: str) -> float:
    try:
        return float(row.get(key, ""))
    except (TypeError, ValueError):
        return 0.0


def analyse(path: Path) -> dict[str, object]:
    with path.open(newline="") as handle:
        rows = list(csv.DictReader(handle))
    decisions: dict[str, int] = {}
    routes: dict[str, int] = {}
    margins: list[float] = []
    labour: list[float] = []
    sold = 0
    for row in rows:
        decision = row.get("triage_decision") or "UNRECORDED"
        route = row.get("final_route") or "UNRECORDED"
        decisions[decision] = decisions.get(decision, 0) + 1
        routes[route] = routes.get(route, 0) + 1
        margins.append(number(row, "gross_margin"))
        labour.append(number(row, "total_labour_minutes"))
        if row.get("sale_date"):
            sold += 1
    return {
        "items": len(rows),
        "sold_items": sold,
        "sell_through_rate": round(sold / len(rows), 4) if rows else 0,
        "decision_counts": decisions,
        "route_counts": routes,
        "recorded_gross_margin_total": round(sum(margins), 2),
        "recorded_gross_margin_median": round(statistics.median(margins), 2) if margins else 0,
        "recorded_labour_minutes_total": round(sum(labour), 2),
        "note": "Blank fields are treated as zero or UNRECORDED; this is not an accounting report.",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv", type=Path)
    args = parser.parse_args()
    print(json.dumps(analyse(args.csv), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
