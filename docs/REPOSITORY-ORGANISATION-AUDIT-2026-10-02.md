# Repository organisation audit — 2 October 2026

## Scope

Full-tree review of the `main` branch of `joshualparris/DubboEwaste`.

At review time the repository contained:

- **273 files**
- **136 files under `docs/`**
- **75 files under `EwasteApp/`**
- **16 systematic `RESEARCH-01` through `RESEARCH-16` reports**
- **9 BACKLOG documents**
- **9 podcast/Spotify documents**
- multiple historical agent-specific research trees

## Overall finding

The repository has strong content but weak information architecture.

The central problem is **not missing research**. It is that five different kinds of material have accumulated side by side:

1. current operational authority;
2. systematic research;
3. historical/backlog/provenance material;
4. application/product source;
5. agent-generated work logs.

That makes it difficult to answer a simple question such as “where should I start?” without already knowing the project history.

## Problems found

### 1. Root README had become a second database

The former root README was about 30 KB and linked dozens of individual files. It mixed:

- current status;
- market research;
- historical findings;
- app links;
- backlog files;
- podcasts;
- legal findings;
- downstream research.

That made the root page useful as a dump but poor as a front door.

**First-pass fix:** archive the long README snapshot and replace the root README with a short map.

### 2. There was no single human-friendly start page

`CURRENT-STATE.md` and `RESEARCH-INDEX.md` are good authority files, but they assume the reader already understands the repository.

**First-pass fix:** add `START-HERE.md` and `docs/README.md` organised around “I want to…” tasks.

### 3. Current and historical files are physically mixed

Examples:

- `GAPS.md`
- `docs/agyGAPS.md`
- `docs/claudeGAPS.md`
- `docs/codexGAPS.md`
- `BACKLOG-*.md`
- `agyDOCS/`
- `claudeDOCS/`
- `docs/claudegaps-research/`
- completed `chatgptTODO.md`

Some are valuable provenance, but their placement makes them look as current as the canonical files.

**First-pass fix:** explicit historical banners and an archive policy.

**Second-pass recommendation:** physically relocate them only after inbound links are rewritten and the repo-wide link audit passes.

### 4. Two app directories are confusing

- `EwasteApp/` is the production Next.js/Supabase application.
- `main/DubboEwasteApp/` is an old static prototype.
- `gh-pages/DubboEwasteApp/` has drifted and now contains the live Pages gateway/admin console.

The same path name therefore means different things on different branches.

**First-pass fix:** document the distinction prominently.

**Second-pass recommendation:** make `main` the source of truth for the Pages admin/gateway and generate `gh-pages` from CI. Once that is done, rename/archive the old static prototype.

### 5. GitHub Pages has source drift

The published `gh-pages` branch contains `admin.html` / `admin.js` that do not exist in the equivalent location on `main`.

This means the live Pages admin cannot be reliably reconstructed from the canonical branch.

**Recommendation:** add the Pages admin source to `main` under a clearly named folder, then make a deployment workflow build/copy it to `gh-pages`. Treat `gh-pages` as generated output only.

### 6. Production app README was stale

It still said:

- there was no public signup page;
- only the first few migrations existed;
- early roadmap items were still future work even though AssetFlow P0/P1 had expanded substantially.

**First-pass fix:** rewrite the app README around the actual current production app.

### 7. Migration numbering is ambiguous

Current files include duplicate prefixes:

- `002_access_code_signup.sql`
- `002_model_support.sql`
- `007_admin_permissions.sql`
- `007_assetflow_internal_automation.sql`

That makes filename order unsafe as a migration plan.

**First-pass fix:** add `EwasteApp/supabase/migrations/README.md` explaining the intended logical order and warning that the directory is development history.

**Second-pass recommendation:** generate and test a clean current-schema baseline, archive development-era SQL, then use timestamped or strictly monotonic future migrations.

### 8. Direct database changes have happened outside migration files

During rapid development, some production Supabase changes were applied directly and later canonicalised, while others may not yet be represented perfectly by the SQL history.

**Recommendation:** perform a schema diff against the live project and make “production schema equals repository migrations” a CI invariant.

### 9. Environment configuration is tracked in Git

`EwasteApp/.env.production` is committed. The currently committed values are a Supabase URL and publishable key, not a service-role secret, but checked-in production configuration still encourages drift.

**Recommendation:** after confirming Vercel holds the production values, remove `.env.production` from Git and ignore `.env.production*`. Keep only `.env.example`.

### 10. Podcast research is over-fragmented

There are nine podcast/Spotify files. A canonical file already exists, but the supporting lists remain visually equal peers.

**Recommendation:** retain:

- `PODCASTS-CANONICAL.md`
- company-specific appearances if they add unique evidence

Move superseded discovery lists into an archive/listening-history area after link rewriting.

### 11. TODO / GAPS concepts overlap

There are several different “what is left?” systems:

- `GAPS.md`
- `chatgptTODO.md`
- `codexToDO.md`
- agent-specific GAPS files
- `RESEARCH-16-CLOSURE-EVIDENCE-REGISTER.md`
- `PHASE-0-LAUNCH-GATES.md`

**Recommended authority rule:**

- current status → `CURRENT-STATE.md`
- launch blockers → `PHASE-0-LAUNCH-GATES.md`
- evidence closure → `RESEARCH-16-CLOSURE-EVIDENCE-REGISTER.md`
- active external/pilot tasks → `codexToDO.md`
- everything else → historical/provenance

### 12. Naming style is inconsistent

Examples include:

- uppercase canonical docs;
- lowercase historical docs;
- `ToDO`, `TODO`, `GAPS`;
- mixed directory conventions.

**Recommendation:** do not rename everything at once. For new canonical docs use uppercase kebab-case. Rename old files only as part of an archive move with automated link rewriting.

## Recommended target structure

A future physical reorganisation could converge toward:

```text
/
├── README.md
├── START-HERE.md
├── EwasteApp/
├── OpenSourceSoftware/
├── docs/
│   ├── README.md
│   ├── current/
│   ├── operations/
│   ├── research/
│   ├── market/
│   ├── regional/
│   └── archive/
├── templates/
├── data/
├── scripts/
├── examples/
└── archive/
    ├── agent-research/
    ├── old-backlogs/
    ├── old-podcasts/
    └── prototypes/
```

This is a **target**, not a recommendation to move everything immediately.

## Safe cleanup order

### Pass 1 — navigation, no mass moves

- short root README;
- `START-HERE.md`;
- `docs/README.md`;
- archive policy;
- historical banners;
- accurate app READMEs;
- migration guide.

### Pass 2 — source-of-truth cleanup

- bring GitHub Pages admin source back into `main`;
- make `gh-pages` generated-only;
- create current Supabase baseline/schema-diff check;
- remove tracked production env config after environment verification.

### Pass 3 — physical archive

Move:

- Agy/Claude historical research;
- superseded GAPS files;
- completed ChatGPT TODO;
- old BACKLOG handoffs;
- superseded podcast discovery files;
- old static prototype.

Update all links in the same commit and require link-audit success.

### Pass 4 — ongoing discipline

For every new document:

- choose one canonical home;
- state status/date;
- link it from `docs/README.md` only if it is a current entry point;
- avoid creating a new GAPS/TODO/index file when an authority already exists;
- update `CURRENT-STATE.md` when the actual project state changes.

## Definition of tidy

The goal is not “few files.”

The goal is:

- a new reader can find the right current document in under 30 seconds;
- historical research remains traceable;
- the production app has one obvious source directory;
- deployment branches are reproducible;
- database migrations have one unambiguous sequence;
- no secret or environment drift is encouraged;
- every topic has one obvious current authority.
