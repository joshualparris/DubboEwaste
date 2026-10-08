# Circular Learning — repository-to-LMS coverage audit
Checked: 8 October 2026
Repositories inspected: joshualparris/DubboEwaste (575 tracked files in main tree) and joshualparris/CircularEconomyDubbo (42 tracked files in main tree).
Comparison baseline: internal pages checked by source, particularly CircularEconomyDubbo/app/internal/* and DubboEwaste/EwasteApp/app/(private)/repair-cafe-volunteers, /documents, /projects. This is not a browser click-through or claim that every file was read in full.

## Answer to "Is more material on GitHub than internal learning pages?"
Yes. The main repo has a documented curriculum and extensive source research. Some internal pages contain summaries, links or operational documents, but neither main-tree web app had an enrolment-based LMS with saved learner progress, short lessons and learning checks before this change.

## Implemented starter catalogue
EwasteApp/lib/learning/catalog.ts: 28 version-controlled starter courses across four pathways, each with three short lessons, practice and a knowledge check at the end.
They use source links and self-paced completion; they do not credential a person for unsafe work.

- Shared: circular economy, volunteer welcome, workshop safety, privacy/consent, accessible communication, evidence and field notes, repair-first decisions.
- DubboEwaste: receiving/chain-of-custody, triage, sanitisation, diagnostics, battery safety, refurbishment, responsible resale, downstream traceability, AssetFlow orientation.
- Repair Café: introduction, intake, tools, running a pilot, accessible hands-on learning.
- Library of Things: why borrow and demand-test, cataloguing, maintenance, fair lending, pilot planning.

The catalogue is not a transcription of every source. It is a curated introductory lesson layer linking back to deeper repo material.

## Especially valuable source-to-course relationships
| Repository material | What existed in repo | LMS path |
|---|---|---|
| docs/LEARNING-CURRICULUM.md | staged pre-pilot technical learning priorities | launch order & future skill gates |
| docs/RESEARCH-02-SKILLS-LEARNING-PATH.md | Tier 0–3 competency levels, Australian training pathways | foundation / advanced separation |
| docs/RESEARCH-01-FRONT-DOOR-TRIAGE.md | intake decisions, hazards, risk boundary | Repair Café intake |
| docs/RESEARCH-05-DATA-IDENTITY-PRIVACY-SOP.md | data release gates, ownership, identity locks | privacy & e-waste access |
| docs/RESEARCH-06-BATTERY-ELECTRICAL-WORKSHOP-SAFETY.md | lithium hazards, electrical limits, stop rules | safety foundations and battery handling |
| docs/ASSETFLOW-ERASURE-DIAGNOSTICS-INTEGRATIONS.md | media capability and erasure verification | storage sanitisation |
| agyDOCS/Triage-Skills-Guide.md | legacy triage learning material | device triage; compare to newer documents |
| docs/PRACTICAL-TRAINING-SHEETS.md | practical computer learning sheets | bench and tool modules |
| docs/DUBBO-REPAIR-CAFE-VENUE-RESEARCH-2026-10-08.md | venue shortlist and unanswered questions | running an event |
| docs/REPAIR-FIRST-DUBBO-PILOT.md | volunteer event design and evidence measures | intro and event measurement |
| docs/RESEARCH-14-COMMUNITY-ACCESSIBILITY-IMPACT.md | inclusion and evidence-based access design | communication and fair lending |
| docs/RESEARCH-09-INVENTORY-SYSTEM-OF-RECORD.md | inventory source-of-truth boundaries | borrowing, kit checks |
| docs/RESEARCH-11-DOWNSTREAM-ENVIRONMENTAL-CHAIN-OF-CUSTODY.md | downstream audit expectations | recycling & proof |
| docs/LISTING-WARRANTY-CHECKLIST.md | item disclosure and resale | honest listings |
| docs/MULTIMETER-REPAIR-TRAINING-VIDEOS.md | curated language-qualified videos and safety corrections | STILL needs a dedicated video lesson |
| docs/DEEP-RESEARCH-2026-10-05-MEDIA-CURRICULUM.md | podcasts, videos, 30-day learning sequence | STILL needs media playlist and progress by media |
| ITAD-Feature-Benchmark/* | vendor capability, commercial workflows, gaps | advanced technician/business track not yet converted |
| docs/LEGAL-LICENSING.md & docs/COMPLIANCE-REGISTER.md | legal/compliance research | needs professional review before mandatory training |
| docs/RECALL-TRACEABILITY-SYSTEM.md | recall controls and traceability | future advanced course |
| docs/CATEGORY-INTAKE-CARDS.md | category-specific intake cards | future interactive scenario library |
| docs/RESEARCH-07-REPAIR-ECONOMICS-PARTS-STRATEGY.md | bounded repair economics | refurbish & repair-first modules |
| docs/REUSE-MODELS-PONYUP-RECONNECT-LAPTOP-INITIATIVE.md | Australian operator models | future community impact/industry course |

## Not yet delivered in this LMS iteration
- Verified in-browser playback and caption checks for every video; never assume a YouTube embed works.
- In-app media playlists, supervisor-attested practical skills, observed assessments, incident/safety competency approvals.
- Course author/editor UI, translation, certificates/badges and PDF resources.
- Competency prerequisite gates and manager learning assignments.
- Library of Things loan circulation system (learning != lending software).
- Cross-domain single sign-on between the Circular Economy research-code portal and Supabase staff accounts.

## Security and rollout notes
- Enrolment and progress records live in Supabase and are per-user using RLS.
- All authenticated active programme members may learn across tracks, while e-waste operations still require dubbo_ewaste membership and Repair Café operations require repair_cafe.
- Library programme membership must be added via the migration; a coordinator-set signup code hash is needed before issuing Library-only accounts.
- Production Vercel deploy is manual according to EwasteApp/README.md; updating GitHub is NOT proof that /learn is live.
- Existing private.signup_config and private.signup_access_codes tables appear in Supabase's RLS advisory as disabled; review actual exposed-schema grants and impact before changing these. This change does not silently alter RLS on existing signup tables.
