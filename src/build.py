#!/usr/bin/env python3
"""Build the Dubbo E-Waste study site from the DubboEwaste repo.

Reads every Markdown and CSV file in the repo, embeds them as JSON, and
inlines styles.css, content.js and app.js into one HTML page.

Usage: python3 build.py [path-to-DubboEwaste-repo] [output.html] [--standalone]
"""
import json
import os
import re
import subprocess
import sys
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
STANDALONE = "--standalone" in sys.argv  # full HTML document for GitHub Pages
REPO = os.path.abspath(ARGS[0] if len(ARGS) > 0 else os.path.join(HERE, "..", "DubboEwaste"))
OUT = os.path.abspath(ARGS[1] if len(ARGS) > 1 else os.path.join(HERE, "index.html"))

SKELETON_HEAD = (
    '<!doctype html><html lang="en-AU"><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
    '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
    'body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'
)

GROUPS = [
    ("start", "Start here"),
    ("flow", "Where e-waste goes"),
    ("rules", "Rules and licences"),
    ("bench", "Running the bench"),
    ("models", "Reuse and ITAD models"),
    ("money", "Money and market"),
    ("outreach", "Calls and emails"),
    ("learn", "Learning resources"),
    ("templates", "Templates and trackers"),
    ("gaps", "Gaps, indexes and sources"),
    ("side", "Side projects"),
]

RULES = [
    (r"^README\.md$|MASTER-FINDINGS|PROJECT-HISTORY|ALL-CHAT-RESEARCH|^GAPS\.md$|00-CORRECTIONS", "start"),
    (r"WHAT-HAPPENS|AMR-|MATTHEWS|REGIONAL-EWASTE|BACKLOG-06|BACKLOG-13|TECHCOLLECT|DUBBO-WELLINGTON|WHY-COUNCIL|NSW-EDUCATION", "flow"),
    (r"LEGAL-LICENSING|BACKLOG-01-05|BACKLOG-21-25", "rules"),
    (r"PHASE-0|INTAKE-POLICY|launch-checklist|RESEARCH-0[1568]|claudegaps-research/(0[123]|09|1[13])|Triage-Skills|ITAD-Operations|BACKLOG-30", "bench"),
    (r"SIRCEL|REUSE-MODELS|GOOD360|PONYUP|FLIPTECH|EXISTING-AUSTRALIAN|ITAD-STAFFING|DUBBO-ITAD|bendigo|RESEARCH-03", "models"),
    (r"COSTS|BACKLOG-17-20|NSW-Market|claudegaps-research/(04|10|12)|research\.md|RESEARCH-0[47]|PRICING|RESALE", "money"),
    (r"CALL-SCRIPTS|EMAIL-DRAFTS", "outreach"),
    (r"SPOTIFY|PODCAST|Education-Directory|RESEARCH-02|claudegaps-research/0[5678]", "learn"),
    (r"^templates/|pilot-tracker", "templates"),
    (r"GAPS|INDEX|SOURCES", "gaps"),
    (r"KRISTY|BACKLOG-26", "side"),
]


def group_for(path):
    for pattern, gid in RULES:
        if re.search(pattern, path):
            return gid
    return "gaps"


def doc_id(path):
    p = path[:-3] if path.endswith(".md") else path
    if p.startswith("docs/"):
        p = p[5:]
    return p.replace("/", "~")


def title_for(path, text):
    if path.endswith(".csv"):
        return os.path.basename(path)
    m = re.search(r"^#\s+(.+)$", text, re.M)
    return m.group(1).strip() if m else os.path.basename(path)


def git(*args):
    try:
        return subprocess.check_output(["git", "-C", REPO, *args], text=True).strip()
    except Exception:
        return ""


def main():
    tracked = set(git("ls-files").splitlines())
    docs = []
    for root, dirs, files in os.walk(REPO):
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        for name in files:
            if not (name.endswith(".md") or name.endswith(".csv")):
                continue
            full = os.path.join(root, name)
            rel = os.path.relpath(full, REPO).replace(os.sep, "/")
            with open(full, encoding="utf-8", errors="replace") as fh:
                text = fh.read()
            docs.append({
                "id": doc_id(rel),
                "path": rel,
                "title": title_for(rel, text),
                "group": group_for(rel),
                "words": len(text.split()),
                "local": rel not in tracked,
                "text": text,
            })
    docs.sort(key=lambda d: ([g for g, _ in GROUPS].index(d["group"]), d["path"]))
    meta = {
        "commit": git("rev-parse", "--short", "HEAD"),
        "commitDate": git("log", "-1", "--format=%cI"),
        "built": datetime.now().astimezone().isoformat(timespec="minutes"),
        "groups": [{"id": g, "label": l} for g, l in GROUPS],
        "repo": "https://github.com/joshualparris/DubboEwaste",
    }
    payload = json.dumps({"meta": meta, "docs": docs}, ensure_ascii=False)
    payload = payload.replace("</", "<\\/")

    def read(name):
        with open(os.path.join(HERE, name), encoding="utf-8") as fh:
            return fh.read()

    html = read("page.html")
    html = html.replace("/*__STYLES__*/", read("styles.css"))
    html = html.replace("/*__CONTENT__*/", read("content.js"))
    html = html.replace("/*__APP__*/", read("app.js"))
    html = html.replace("__DOCS_JSON__", payload)
    if STANDALONE:
        html = SKELETON_HEAD + html + "</body></html>"
    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(html)
    print(f"{len(docs)} docs, {len(html)/1024:.0f} KB -> {OUT}")


if __name__ == "__main__":
    main()
