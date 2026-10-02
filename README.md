# DubboEwaste

Research, operating design and software for a reuse-first e-waste / IT asset disposition pilot in Dubbo, NSW.

> **Reuse first. Recycle second.**

## Start here

If you are new to the repository, open **[START-HERE.md](START-HERE.md)**.

The three current authority documents are:

1. **[Current state](docs/CURRENT-STATE.md)** — what is verified, designed, blocked or still unknown.
2. **[Phase 0 launch gates](docs/PHASE-0-LAUNCH-GATES.md)** — what must be closed before broader intake.
3. **[Research index](docs/RESEARCH-INDEX.md)** — where detailed evidence and historical research lives.

For the complete documentation map, use **[docs/README.md](docs/README.md)**.

## Software

### Production operations app

**[EwasteApp/](EwasteApp/)** is the current private AssetFlow application.

- Next.js
- Supabase Auth + PostgreSQL
- Row Level Security
- customers, jobs, lots and assets
- intake and model lookup
- evidence, testing, grading and sanitisation
- repairs, resale and recycling workflows
- certificates and reporting
- admin CRUD, roles and per-user permissions

Production: https://dubbo-ewaste-app.vercel.app/

### GitHub Pages

The published `gh-pages` branch contains the public gateway and GitHub Pages admin console.

The `main/DubboEwasteApp/` directory is an **older static prototype source** and should not be confused with the production Next.js application or the newer generated Pages admin console. See [DubboEwasteApp/README.md](DubboEwasteApp/README.md).

## Repository map

| Path | Purpose |
|---|---|
| [START-HERE.md](START-HERE.md) | Human-friendly front door |
| [docs/](docs/) | Research, policy, operational guidance and evidence |
| [EwasteApp/](EwasteApp/) | Production private operations application |
| [OpenSourceSoftware/](OpenSourceSoftware/) | AssetFlow product specification, workflow reconstruction and backlog |
| [templates/](templates/) | Operational forms and evidence templates |
| [data/](data/) | Structured research/pilot datasets |
| [scripts/](scripts/) | Validators, analysis and safety/link checks |
| [examples/](examples/) | Synthetic examples safe for testing |
| [agyDOCS/](agyDOCS/) | Historical agent research retained for provenance |
| [claudeDOCS/](claudeDOCS/) | Historical agent research retained for provenance |
| [DubboEwasteApp/](DubboEwasteApp/) | Older static prototype source; not the production app |
| [GAPS.md](GAPS.md) | Historical detailed gap register |
| [codexToDO.md](codexToDO.md) | Current external/pilot closure backlog |
| [chatgptTODO.md](chatgptTODO.md) | Completed ChatGPT execution log; historical |

## Current project status

The repository supports a **research-ready, tightly gated pilot**, not unrestricted public intake. Planning, insurance, premises, Fair Trading, safety/data validation and downstream evidence still contain external gates. Read [docs/CURRENT-STATE.md](docs/CURRENT-STATE.md) before treating any historical research as current operational authority.

## Evidence rule

Historical files are retained deliberately. A detailed or older file is not automatically current. When sources conflict:

1. use `docs/CURRENT-STATE.md` for current status;
2. use `docs/RESEARCH-INDEX.md` to find the current topic authority;
3. preserve older material as provenance rather than silently deleting it.

## Development checks

The repository has CI for:

- EwasteApp typecheck/build;
- evidence validation;
- pilot tracker validation;
- external link auditing.

See [.github/workflows/](.github/workflows/).

---

A snapshot of the former long-form root README is preserved at [docs/archive/README-SNAPSHOT-2026-10-02.md](docs/archive/README-SNAPSHOT-2026-10-02.md).
