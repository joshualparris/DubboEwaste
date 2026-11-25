#!/usr/bin/env python3
"""Searchable legacy-device compatibility database for reuse triage.

Loads data/legacy-device-compatibility.csv and answers questions such as:
  * what is known about a model code / name / SoC?
  * which catalogued devices suit a given reuse role?
  * which rows are actually verified vs. placeholder examples?

Evidence rule (matches the repository): only rows whose `verification` is not
`EXAMPLE-UNVERIFIED` / `needs-confirmation` should be treated as authoritative.
The tool never bypasses, confirms or defeats any account/FRP lock; `frp_capable`
is a hardware-era fact, not a statement that a device can be unlocked.
"""

import argparse
import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / "data" / "legacy-device-compatibility.csv"

REQUIRED_COLUMNS = {
    "model_code", "marketing_name", "soc", "soc_family", "release_year",
    "shipped_android", "max_official_android", "ram_mb", "storage_gb",
    "frp_capable", "lineageos_official", "postmarketos_status",
    "recommended_roles", "verification", "source",
}

UNVERIFIED = {"EXAMPLE-UNVERIFIED", "needs-confirmation", ""}


def load(path: Path = DB) -> list[dict]:
    with path.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    if not rows:
        return rows
    missing = REQUIRED_COLUMNS - set(rows[0].keys())
    if missing:
        raise ValueError(f"Missing columns: {sorted(missing)}")
    return rows


def is_verified(row: dict) -> bool:
    return row.get("verification", "") not in UNVERIFIED


def roles(row: dict) -> list[str]:
    return [r for r in row.get("recommended_roles", "").split(";") if r]


def search(rows: list[dict], term: str) -> list[dict]:
    t = term.lower()
    return [
        r for r in rows
        if t in r["model_code"].lower()
        or t in r["marketing_name"].lower()
        or t in r["soc"].lower()
        or t in r["soc_family"].lower()
    ]


def by_role(rows: list[dict], role: str) -> list[dict]:
    return [r for r in rows if role.lower() in [x.lower() for x in roles(r)]]


def filter_rows(rows, verified_only=False, min_ram=None):
    out = rows
    if verified_only:
        out = [r for r in out if is_verified(r)]
    if min_ram is not None:
        out = [r for r in out if r["ram_mb"].isdigit() and int(r["ram_mb"]) >= min_ram]
    return out


def format_row(row: dict) -> str:
    flag = "" if is_verified(row) else "  [UNVERIFIED]"
    return (
        f"{row['marketing_name']} ({row['model_code']}){flag}\n"
        f"  SoC          : {row['soc']}  [{row['soc_family']}]\n"
        f"  Android       : shipped {row['shipped_android']}, max official {row['max_official_android']}\n"
        f"  RAM / storage : {row['ram_mb']} MB / {row['storage_gb']} GB\n"
        f"  FRP-capable   : {row['frp_capable']} (hardware era; not an unlock claim)\n"
        f"  LineageOS     : {row['lineageos_official']}\n"
        f"  postmarketOS  : {row['postmarketos_status']}\n"
        f"  Reuse roles   : {', '.join(roles(row)) or 'none catalogued'}\n"
        f"  Verification  : {row['verification']}  (source: {row['source']})"
    )


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description="Query the legacy-device compatibility database.")
    p.add_argument("query", nargs="?", help="model code, name or SoC substring")
    p.add_argument("--role", help="filter to devices suited to a reuse role (e.g. clock)")
    p.add_argument("--verified-only", action="store_true", help="exclude placeholder/unverified rows")
    p.add_argument("--min-ram", type=int, help="minimum RAM in MB")
    p.add_argument("--validate", action="store_true", help="validate the CSV schema and exit")
    args = p.parse_args(argv)

    try:
        rows = load()
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    if args.validate:
        print(f"OK: {len(rows)} rows, schema valid "
              f"({sum(is_verified(r) for r in rows)} verified).")
        return 0

    result = rows
    if args.query:
        result = search(result, args.query)
    if args.role:
        result = by_role(result, args.role)
    result = filter_rows(result, verified_only=args.verified_only, min_ram=args.min_ram)

    if not result:
        print("No matching devices catalogued. (The database starts small and grows "
              "with verified research.)")
        return 1

    for row in result:
        print(format_row(row))
        print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
