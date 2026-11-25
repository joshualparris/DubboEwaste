#!/usr/bin/env python3
"""Query the verified postmarketOS upstream device-support list.

Data source: data/postmarketos-devices.csv, extracted directly from a pinned
postmarketOS pmaports checkout (the `source` / `source_date` columns record the
exact commit). This is upstream-verified reuse evidence: if a donated device's
codename or SoC family appears here in `main`/`community`/`testing`, postmarketOS
has an actual port (maturity varies by category), which is a real alternative-OS
reuse pathway once ownership is cleared.

Boundary: a listed port does NOT mean a turn-key flash, that a specific unit is
unlockable, or that any account/FRP lock can be defeated. Port maturity
(especially `testing`) is experimental and must be confirmed on authorised
hardware before relying on it.
"""

import argparse
import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / "data" / "postmarketos-devices.csv"

REQUIRED_COLUMNS = {
    "category", "codename", "name", "year", "arch", "chassis", "soc",
    "source", "source_date",
}

# pmaports maturity categories, most mature first.
CATEGORY_ORDER = {"main": 0, "community": 1, "testing": 2, "downstream": 3}


def load(path: Path = DB) -> list[dict]:
    with path.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    if rows:
        missing = REQUIRED_COLUMNS - set(rows[0].keys())
        if missing:
            raise ValueError(f"Missing columns: {sorted(missing)}")
    return rows


def search(rows: list[dict], term: str) -> list[dict]:
    t = term.lower()
    return [
        r for r in rows
        if t in r["name"].lower()
        or t in r["codename"].lower()
        or t in r["soc"].lower()
    ]


def filter_rows(rows, category=None, arch=None, chassis=None):
    out = rows
    if category:
        out = [r for r in out if r["category"] == category]
    if arch:
        out = [r for r in out if r["arch"] == arch]
    if chassis:
        out = [r for r in out if r["chassis"].lower() == chassis.lower()]
    return out


def sort_by_maturity(rows: list[dict]) -> list[dict]:
    return sorted(rows, key=lambda r: (CATEGORY_ORDER.get(r["category"], 9), r["name"].lower()))


def format_row(row: dict) -> str:
    return (
        f"{row['name']} ({row['codename']})\n"
        f"  Port maturity : {row['category']}\n"
        f"  Arch / chassis: {row['arch']}  {row['chassis'] or ''}".rstrip() + "\n"
        f"  Year / SoC    : {row['year'] or '?'}  {row['soc'] or ''}".rstrip() + "\n"
        f"  Upstream      : {row['source']} ({row['source_date']})"
    )


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description="Query the verified postmarketOS upstream device list.")
    p.add_argument("query", nargs="?", help="name, codename or SoC substring")
    p.add_argument("--category", choices=sorted(CATEGORY_ORDER), help="filter by pmaports maturity")
    p.add_argument("--arch", help="filter by CPU arch (e.g. armv7, aarch64)")
    p.add_argument("--chassis", help="filter by chassis (e.g. handset, tablet)")
    p.add_argument("--validate", action="store_true", help="validate the CSV schema and exit")
    args = p.parse_args(argv)

    try:
        rows = load()
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    if args.validate:
        print(f"OK: {len(rows)} postmarketOS devices, schema valid.")
        return 0

    result = rows
    if args.query:
        result = search(result, args.query)
    result = filter_rows(result, category=args.category, arch=args.arch, chassis=args.chassis)
    result = sort_by_maturity(result)

    if not result:
        print("No matching postmarketOS port catalogued in this snapshot.")
        return 1

    for row in result:
        print(format_row(row))
        print()
    print(f"{len(result)} device(s). Port maturity: main > community > testing > downstream (experimental).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
