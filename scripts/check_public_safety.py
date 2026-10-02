#!/usr/bin/env python3
"""Find likely private identifiers and unsafe publication claims in tracked text."""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path


PATTERNS = {
    "email": re.compile(r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}"),
    "phone": re.compile(r"(?<!\d)(?:0[2-9]\d{8}|04\d{8})(?!\d)"),
    "private-key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "unsupported-certification-claim": re.compile(r"\b(?:certified|certification)\b.{0,40}\b(?:secure|wipe|recycl|downstream)", re.I),
}

ALLOW = ("example.com", "example.org", "users.noreply.github.com")


def files_from_git(root: Path) -> list[Path]:
    result = subprocess.run(["git", "ls-files", "-z"], cwd=root, check=True, capture_output=True, text=False)
    return [root / part for part in result.stdout.decode().split("\0") if part]


def scan(paths: list[Path]) -> list[str]:
    findings: list[str] = []
    for path in paths:
        if not path.is_file() or path.stat().st_size > 2_000_000:
            continue
        try:
            text = path.read_text(errors="ignore")
        except OSError:
            continue
        for name, pattern in PATTERNS.items():
            for match in pattern.finditer(text):
                value = match.group(0)
                if name == "email" and any(domain in value for domain in ALLOW):
                    continue
                line = text.count("\n", 0, match.start()) + 1
                findings.append(f"{path}:{line}: {name}: {value[:80]}")
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--git", action="store_true", help="scan tracked files")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    paths = files_from_git(root) if args.git else [root / "codexToDO.md"]
    findings = scan(paths)
    if findings:
        print("Public-safety review findings:")
        print("\n".join(f"- {finding}" for finding in findings))
        return 1
    print("Public-safety scan passed for selected files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
