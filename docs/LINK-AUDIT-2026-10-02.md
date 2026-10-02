# External Link Audit — 2 Oct 2026

The automated repo-wide audit scanned **155 text files** and **1,127 unique external URLs**.

## First-pass results
- 784: HTTP-success via HEAD
- 2: success after GET retry
- 222: blocked by anti-bot/auth/rate-limit behaviour
- 51: network/time-out style errors
- 11: other HTTP errors
- 57: returned HTTP 404/410 and therefore need review

## Important limitation
A 404 from this automated scanner is **not automatically proof that a link is dead**. Several known-live official services return misleading 404s to automated/non-browser requests, including:
- ABN Lookup;
- Google Support pages;
- some eBay Seller Centre pages.

For that reason the checker now labels these results **candidate-dead** and does not fail CI solely on a 404/410.

## Clear stale/dead candidates identified
The first pass found several URLs that are genuinely likely to be stale and should not be relied on as canonical sources:
- old AcquireIT Blancco product page (410);
- old FitGap KillDisk page (410);
- old FitGap Parted Magic page (410);
- old LinkedIn/company-directory paths;
- legacy local-business/directory pages;
- old WMRR PDF/application paths;
- old InfraBuild Matthews branch URL;
- old Orana Arts small-grants path;
- an old Podbean share link.

Canonical current-state documents should prefer current primary sources and do not depend on these pages for their core conclusions.

## Ongoing audit
`.github/workflows/link-audit.yml` now runs the checker on Markdown/CSV/text changes and uploads:
- `link-audit.md`
- `link-audit.json`

as a GitHub Actions artifact.

## Rule
Do not silently delete historical citations just because they are now offline. If a dead historical source materially supports a current claim:
1. find a current replacement or archived copy;
2. update the canonical document;
3. preserve the historical citation only as provenance if useful.
