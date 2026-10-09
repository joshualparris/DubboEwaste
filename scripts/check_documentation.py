#!/usr/bin/env python3
"""Offline audit of the tracked documentation inventory and current entry points.

Does not certify external links, dated research facts, the deployment SHA,
browser behaviour, provider credentials, or live role/migration parity.
"""
from __future__ import annotations

import pathlib
import re
import subprocess
import sys
from urllib.parse import unquote

ROOT = pathlib.Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "docs/DOCUMENTATION-INVENTORY-AND-FRESHNESS-2026-10-09.md"
FEATURES = ROOT / "docs/LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md"

ENTRYPOINTS = [
    "README.md", "START-HERE.md", "docs/README.md", "docs/CURRENT-STATE.md",
    "EwasteApp/README.md", "EwasteApp/ARCHITECTURE.md",
    "EwasteApp/ROADMAP.md", "EwasteApp/SIGNUP.md",
    "EwasteApp/docs/programmes/README.md",
    "EwasteApp/docs/mobile/README.md",
    "EwasteApp/supabase/migrations/README.md",
]
REPAIR_ROUTES = [
    "repair-cafe-volunteers/page.tsx",
    "repair-cafe-volunteers/sessions/page.tsx",
    "repair-cafe-volunteers/people/page.tsx",
    "repair-cafe-volunteers/event-desk/page.tsx",
    "repair-cafe-volunteers/operations/page.tsx",
    "repair-cafe-volunteers/check-in/page.tsx",
    "repair-cafe-volunteers/my-shifts/page.tsx",
    "repair-cafe-volunteers/stations/page.tsx",
    "repair-cafe-volunteers/knowledge/page.tsx",
    "repair-cafe-volunteers/reports/page.tsx",
    "repair-cafe-volunteers/reports/annual/page.tsx",
]
MIGRATIONS = [
    "20261009163000_repair_cafe_event_desk.sql",
    "20261009170000_repair_cafe_event_operations.sql",
    "20261009174500_repair_cafe_ticket_canonical.sql",
]
LINK_RE = re.compile(r"(?<!!)\[[^\]\n]+\]\((<?[^\s)]+>?)\)")
TRACKED_RE = re.compile(
    r"^- \[\x60([^\x60]+)\x60\]\(https://github\.com/joshualparris/DubboEwaste/blob/main/[^)]*\)\s*$",
    re.MULTILINE,
)


def tracked_documents() -> set[str]:
    raw = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT)
    paths = [p.decode("utf-8") for p in raw.split(b"\x00") if p]
    return {p for p in paths if pathlib.PurePosixPath(p).suffix.lower() in {".md", ".mdx", ".txt"}}


def check_core_links(path: pathlib.Path) -> list[str]:
    """Only core entry points are gated; older research remains historical."""
    body = path.read_text(encoding="utf-8")
    errors: list[str] = []
    for target in LINK_RE.findall(body):
        target = unquote(target.strip("<>").split("#", 1)[0].split("?", 1)[0])
        if not target or target.startswith(("https://", "http://", "mailto:", "tel:", "//", "/")):
            continue
        resolved = (path.parent / target).resolve()
        if not resolved.is_relative_to(ROOT) or not resolved.exists():
            errors.append(f"{path.relative_to(ROOT)} -> {target} (missing)")
    return errors


def main() -> int:
    issues: list[str] = []
    paths = tracked_documents()
    if not MANIFEST.exists():
        issues.append("Missing documentation inventory")
        indexed: set[str] = set()
    else:
        indexed = set(TRACKED_RE.findall(MANIFEST.read_text(encoding="utf-8")))
    for missing in sorted(paths - indexed):
        issues.append(f"Not indexed: {missing}")
    for extra in sorted(indexed - paths):
        issues.append(f"Inventory refers to untracked document: {extra}")
    for relative in ENTRYPOINTS:
        doc = ROOT / relative
        if not doc.exists():
            issues.append(f"Missing current entry point: {relative}")
            continue
        issues.extend(check_core_links(doc))
        if relative not in {"README.md", "START-HERE.md", "docs/CURRENT-STATE.md"} and (
            "LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md" not in doc.read_text(encoding="utf-8")
        ):
            issues.append(f"Current guide missing product-truth link: {relative}")
    if not FEATURES.exists():
        issues.append("Current feature verification register missing")
    for route in REPAIR_ROUTES:
        if not (ROOT / "EwasteApp/app/(private)" / route).exists():
            issues.append(f"Documented Repair Café route missing: {route}")
    for file in MIGRATIONS:
        if not (ROOT / "EwasteApp/supabase/migrations" / file).exists():
            issues.append(f"Documented schema migration missing: {file}")
    if issues:
        print("Documentation audit FAILED")
        print("\n".join(f"- {issue}" for issue in issues))
        print(f"Indexed {len(indexed)} / {len(paths)} tracked documents")
        return 1
    print(
        f"Documentation audit PASS: {len(paths)} tracked markdown/text files indexed, "
        f"{len(ENTRYPOINTS)} current guides and {len(REPAIR_ROUTES)} Repair Café routes checked."
    )
    print("Historical research and live deployment must be verified separately.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
