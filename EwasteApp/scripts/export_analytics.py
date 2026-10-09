"""Publish only the public, thresholded daily analytics report to GitHub.

No database credentials are needed. Raw records, small buckets (<5) and
private route/action names are never available from the export endpoint.
"""
import datetime as dt
import json
from pathlib import Path
from urllib.request import urlopen
from zoneinfo import ZoneInfo

URL = "https://dubbo-ewaste-app.vercel.app/api/analytics/daily-export"
SITES = ("dubbo_ewaste", "github_pages", "render_backup",)
day = (dt.datetime.now(ZoneInfo("Australia/Sydney")).date() - dt.timedelta(days=1)).isoformat()

with urlopen(URL + "?day=" + day, timeout=30) as response:
    if response.status != 200:
        raise RuntimeError("Daily aggregate endpoint did not respond successfully")
    payload = json.load(response)

if payload.get("day_sydney") != day:
    raise ValueError("Report returned an unexpected Sydney date")
fields = {
    "by_site": {"site", "event_name", "total"},
    "pages": {"site", "page_group", "total"},
    "clicks": {"site", "target_group", "total"},
    "locations": {"site", "country", "region", "total"},
    "devices": {"site", "device_class", "total"},
    "referrers": {"site", "referrer_domain", "total"},
}
if not set(payload).issubset({"day_sydney", "privacy", *fields}):
    raise ValueError("Unexpected fields in aggregate report")

def clean_item(item, keys):
    if not set(item).issubset(keys) or not isinstance(item.get("total"), int):
        raise ValueError("Unexpected analytics field/type")
    if item["total"] < 5:
        raise ValueError("Unsuppressed small analytics bucket")
    for k, v in item.items():
        if k == "total":
            continue
        if not isinstance(v, str) or len(v) > 140 or any(c in v for c in ("\n", "\r", "|", "<", ">")):
            raise ValueError("Unrecognised aggregate text")
    return item

def clean_text(value):
    return str(value if value is not None else "unknown").replace("|", "").replace("\n", " ")

for site in SITES:
    report = {"date_sydney": day, "site": site,
              "notice": "Public aggregate only. Buckets under 5 withheld; private routes/actions generalized."}
    for key, columns in fields.items():
        report[key] = [clean_item(item, columns) for item in payload.get(key, [])
                       if item.get("site") == site]
    target = Path("reports/analytics") / site
    target.mkdir(parents=True, exist_ok=True)
    (target / (day + ".json")).write_text(json.dumps(report, indent=2, sort_keys=True) + "\n")
    lines = ["# " + site.replace("_", " ").title() + " — " + day, "",
             "Sydney-local date. These are **events, not unique visitors**.",
             "Fewer than five matching events are withheld, not shown as zero.",
             "Private page and action names are redacted; there are no identifiers, IPs, or exact locations.", ""]
    tables = [
        ("Events", "by_site", ("event_name", "total")),
        ("Pages", "pages", ("page_group", "total")),
        ("Clicks", "clicks", ("target_group", "total")),
        ("Country / coarse region", "locations", ("country", "region", "total")),
        ("Device types", "devices", ("device_class", "total")),
        ("Referrers", "referrers", ("referrer_domain", "total")),
    ]
    for title, key, columns in tables:
        lines += ["## " + title, "", "| " + " | ".join(columns) + " |",
                  "| " + " | ".join("---" for _ in columns) + " |"]
        lines += ["| " + " | ".join(clean_text(row.get(column)) for column in columns) + " |"
                  for row in report[key]]
        if not report[key]:
            lines += ["| Withheld or no data" + (" | " * len(columns))]
        lines.append("")
    (target / (day + ".md")).write_text("\n".join(lines) + "\n")
    print("Created daily safe aggregate for", site, day)
