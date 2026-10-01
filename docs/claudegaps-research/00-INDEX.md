# claudeGAPS research — index and results

Systematic research pass on every gap in [`../claudeGAPS.md`](../claudeGAPS.md), done one section at a time on 2 Oct 2026 by Claude Code.

**Method.** Each gap was split into sub-questions, searched, then checked against primary sources (operator, vendor and regulator pages). Live tools were used where possible:
- `gh api` for open-source tool repos;
- the Apple Podcasts directory API for podcasts;
- the YouTube results page for videos;
- the public JavaScript bundle of Fliptech's site, to read its own page copy and terms.

The open-source "deep research agent" frameworks suggested (GPT Researcher, dzhng deep-research, Local Deep Research, Open Deep Research) were **not used**. Each needs a paid LLM API key (and usually a search API key), and none is set on this machine. The local-model option (Ollama) isn't installed, and there's no GPU, so it would be slow and weak. The same plan → search → read → follow citations loop was run directly instead.

**Confidence labels** used throughout: [Primary] · [Secondary] · [Derived] · [Open — CALL/TRY/LEARN].

| # | File | claudeGAPS § | Headline finding |
|---|---|---|---|
| 01 | [Triage decision system](01-TRIAGE-DECISION-SYSTEM.md) | §1 | Retail floor = Win11-eligible (Intel 8th gen+/Ryzen 2000+; WorkVentures' oldest live stock is 8th gen). Battery floor = 80% (Back Market/Reebelo). Lock-detection table (Activation Lock, ABM Remote Management, FRP, Autopilot, Chromebook enrolment, ThinkPad supervisor password = system-board replacement). Free AMTA IMEI check. Bendigo charges per kg only for batteries/media. Reject-log templates added |
| 02 | [Category knowledge](02-CATEGORY-KNOWLEDGE.md) | §2 | Business lines have free service manuals (PSREF/HP MSG/Dell). Chromebook 10-year AUE from 2021 platforms. **Activation Lock now locks Apple *parts* too.** 000-blocking is inconsistent across carriers. Used TVs only worth it if premium |
| 03 | [Bench toolkit](03-BENCH-TOOLKIT.md) | §3 | $0 GPL kit (Ventoy, ShredOS/nwipe v0.42 with PDF certs, nvme-cli, smartctl, stress-ng, MemTest86 Free). NIST 800-88 Rev. 2 → SSDs need native sanitize. Per-media verification procedure. About A$500–950 of bench hardware |
| 04 | [Pricing and valuation](04-PRICING-VALUATION.md) | §4 | eBay Product Research (Terapeak) is free with 3 years of AU sold data. 6-step pricing method with ceiling and floor. Buyback floor list. Back-to-school Jan–Feb; EOFY supply Jul–Sep |
| 05 | [Learning path](05-LEARNING-PATH.md) | §5 | Free: UNSW battery course + Professor Messer A+. Paid: test-and-tag A$284–500. **NSW test-and-tag-before-resale law is contested between sources (open)**. No Repair Café in the Central West (opportunity). Business Connect is changing in Feb 2027 |
| 06 | [YouTube watch list](06-YOUTUBE-WATCHLIST.md) | §6 | 35 vetted videos. eWaste Ben and Hugh Jeffreys are the closest AU analogues. No AU ITAD floor-process video exists |
| 07 | [Podcasts gap fill](07-PODCASTS-GAP-FILL.md) | §7 | New: *Masters of ITAD* (2026), *Ask The R2 Guru* (SERI), NSYS grading, ReCommerce, Resource Recycling (Lenovo, 1 Oct 2026), NSW repair café episode. Existing files duplicate episodes ×4–5 |
| 08 | [Communities and bodies](08-COMMUNITIES-AND-BODIES.md) | §8 | Whirlpool is the key AU forum. ACT sells 11th-gen Latitudes for about A$400–450 (**price ceiling**). Charitable Reuse Australia / WMRR / Business NSW |
| 09 | [Operator floor mechanics](09-OPERATOR-FLOOR-MECHANICS.md) | §9 | **Fliptech's own process and client terms extracted** (asset tag on entry → Blancco under CCTV → double verification → report in about 15 business days; title passes on collection; re-quote off-spec loads; certificates cost extra). ACT grade and reject criteria. **Reebelo requires a second-hand dealer registration**. Snipe-IT as the free step up from spreadsheets |
| 10 | [Sales channels and auction supply](10-SALES-CHANNELS-AND-AUCTION-SUPPLY.md) | §10 | eBay non-Pro 0% FVF ≤A$25k. Reebelo/Back Market gated. **Grays ex-government laptops about A$16–166/unit**: a legitimate cheap supply source. Battery and Win11 claims drive most complaints |
| 11 | [Parts, scrap, destruction](11-PARTS-SCRAP-DESTRUCTION.md) | §11 | **The Board Guy (Sydney): no-minimum, mail-in buyer for boards/CPUs/RAM.** 3-bin scrap sort. Shred-X NAID AAA, regional NSW |
| 12 | [Supply side](12-SUPPLY-SIDE.md) | §12 | 13+ Dubbo MSPs listed with a pitch and questions. Avance conflict must be resolved first. Catholic schools via Diocese of Bathurst/CEnet. Win10 wave |
| 13 | [Safety skills](13-SAFETY-SKILLS.md) | §13 | FRNSW: don't fight a Li-ion fire; evacuate, call 000, re-ignition risk. Written drill and kit. SafeWork PCBU duties |
| 14 | [Already-catalogued recheck](14-ALREADY-CATALOGUED-GAPS-RECHECK.md) | §14 | Legal and downstream gaps still closed only by calls. **New: Fair Trading has granted 14-day-hold exemptions to carrier trade-in programs**, so ask for a wipe-only hold exemption if a licence applies |

`claudeGAPS.md` §15 (repo hygiene) and §16 (next sprint) are actions, not research; their status is in the table below.

## What only a person can close now (consolidated)

| Type | Item | Section |
|---|---|---|
| CALL | Fair Trading: exemption scope **+ wipe-only 14-day-hold exemption** | 14 |
| CALL | Fair Trading / NSW electrical safety: test-and-tag or label before reselling mains items? | 05 §5.3 |
| CALL | Council planning classification; Council e-waste contractor | GAPS.md / 14 |
| CALL | Avance conflict-of-interest, before any MSP outreach | 12 |
| CALL | 13 Dubbo MSPs: three questions each | 12 |
| CALL | The Board Guy scrap prices; Shred-X regional drive destruction | 11 |
| CALL | Bendigo E-Waste / Reconnect bench-visit day | 05 §5.4 |
| CALL | Diocese of Bathurst ICT disposal | 12 |
| TRY | Build and time the USB kit on 3 machines; validate wipes | 03 |
| TRY | Track 10 models' AU sold prices monthly; floor and ceiling per device | 01 §1.2, 04 |
| TRY | Watch Grays ex-government lots for 4 weeks; landed cost per sellable unit | 10 |
| TRY | Use the reject log and triage addendum from the first enquiry | 01 |
| LEARN | UNSW battery course → Messer A+ Core 1/2 → test-and-tag course | 05 |
| LEARN | Starter watch list (5 videos, about 2.5 h) and podcast starter (5 eps, about 2.5 h) | 06, 07 |

## Repo-hygiene items (claudeGAPS §15), not actioned
Left for the repo owner, so as not to edit files other agents work on: renumber duplicate `GAPS.md` sections (I/J/L); merge the six podcast files; add `agyGAPS.md`, `codexGAPS.md`, `claudeGAPS.md` and this folder to the README table; add Fair Trading follow-up question 2 (see 14) to `CALL-SCRIPTS.md`.
