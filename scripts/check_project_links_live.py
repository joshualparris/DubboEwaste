#!/usr/bin/env python3
"""Probe the live links on the authenticated Projects directory page.

Static route QA remains the build gate. HTTP probes cannot prove access to a
private screen without authentication and do not call a redirect to login broken.
"""
import concurrent.futures
import json
import pathlib
import re
import sys
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = (ROOT / "EwasteApp/app/(private)/projects/page.tsx").read_text(encoding="utf-8")
URLS = re.findall(r'\{\s*name:\s*"([^"]+)",\s*url:\s*"([^"]+)"', SOURCE)
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; DubboEwasteProjectLinkAudit/1.0)"}


def request(url, method):
    req = urllib.request.Request(url, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            return res.status, res.geturl(), ""
    except urllib.error.HTTPError as error:
        return error.code, error.geturl(), str(error.reason)
    except Exception as error:
        return None, url, str(error)[:130]


def check(item):
    name, url = item
    head, head_dest, head_error = request(url, "HEAD")
    # HEAD failures commonly arise from anti-bot rules; GET is definitive.
    if head is not None and 200 <= head < 400:
        status, destination, error = head, head_dest, ""
    else:
        status, destination, error = request(url, "GET")
        error = error or head_error
    if status in (404, 410):
        verdict = "candidate-dead"
    elif status in (401, 403, 429):
        verdict = "auth-or-blocked"
    elif status is None:
        verdict = "network-unknown"
    elif status >= 500:
        verdict = "server-error"
    elif status >= 400:
        verdict = "other-http-error"
    elif "/login" in destination:
        verdict = "login-required"
    else:
        verdict = "http-success"
    return {"name": name, "url": url, "http": status, "final_url": destination, "status": verdict, "error": error}


if not URLS:
    sys.exit("No project links found; review the link extractor.")
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    results = list(pool.map(check, URLS))
print(f"Checked {len(results)} Projects directory destinations:")
for result in results:
    print(f"[{result['status']}] {result['http'] or '?'} {result['name']}: {result['url']} -> {result['final_url']}")
    if result["error"]:
        print(f"   {result['error']}")
(ROOT / "projects-links-live.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
dead = [r for r in results if r["status"] == "candidate-dead"]
print(f"Potentially dead: {len(dead)}. Auth-required and temporary blocks are not treated as broken.")
# An HTTP status is evidence, not absolute proof; keep this report usable even with bot-blocked hosts.
# Build-time source/link-route QA is the hard gate.
