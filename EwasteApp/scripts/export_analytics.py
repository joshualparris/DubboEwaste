"""Publish a single day's aggregated analytics, never individual visitor events."""
import datetime as dt
import json
import os
from pathlib import Path
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

site = os.environ["ANALYTICS_SITE"]
url = os.environ["ANALYTICS_SUPABASE_URL"].rstrip("/")
token = os.environ["ANALYTICS_SUPABASE_SERVICE_ROLE_KEY"]
if url != "https://kukwydsfhlmwwxpgnbpn.supabase.co":
    raise SystemExit("Unexpected Supabase project")
if site not in ("dubbo_ewaste", "circular_economy"):
    raise SystemExit("Unexpected site")
day = (dt.datetime.now(ZoneInfo("Australia/Sydney")).date() - dt.timedelta(days=1)).isoformat()
request = Request(url + "/rest/v1/rpc/analytics_daily_report",
                  data=json.dumps({"p_day": day}).encode(),
                  headers={"apikey": token, "Authorization": "Bearer " + token,
                           "Content-Type": "application/json"}, method="POST")
with urlopen(request, timeout=20) as response:
    data = json.load(response)
if data.get("day_sydney") != day:
    raise SystemExit("Report date mismatch")

fields = ("by_site", "pages", "clicks", "locations", "devices", "referrers")
report = {"day_sydney": day, "site": site}
for field in fields:
    report[field] = [row for row in data.get(field, []) if row.get("site") == site]
out = Path("reports/analytics")
out.mkdir(parents=True, exist_ok=True)
(out / (day + ".json")).write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
lines = ["# Daily anonymous analytics: " + day, "",
         "Site: **" + site + "** · Australia/Sydney day", "",
         "> Aggregated counts only. No IP, email, user ID, form data or raw visitor logs.",
         "> Region names are withheld for low-volume location groups.", ""]
for field, cols in (
    ("by_site", ("event_name", "total")),
    ("pages", ("page_group", "total")),
    ("clicks", ("target_group", "total")),
    ("locations", ("country", "region", "total")),
    ("devices", ("device_class", "total")),
    ("referrers", ("referrer_domain", "total")),
):
    lines.extend(("## " + field.replace("_", " ").title(), "",
                  "| " + " | ".join(cols) + " |", "| " + " | ".join("---" for _ in cols) + " |"))
    for row in report[field]:
        lines.append("| " + " | ".join(str(row.get(col) or "unknown").replace("|", "") for col in cols) + " |")
    if not report[field]:
        lines.append("| " + " | ".join(("No events",) + ("",) * (len(cols)-1)) + " |")
    lines.append("")
(out / (day + ".md")).write_text("\n".join(lines) + "\n", encoding="utf-8")
print("Daily aggregate written:", site, day)
