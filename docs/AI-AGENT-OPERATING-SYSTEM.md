# AI agent operating system

This repository is designed to let Codex and other research/coding agents help with Dubbo E-Waste without confusing generated work with real-world evidence.

## What an agent may do autonomously

- Read and cross-link the repository, identify duplicate or contradictory claims, and maintain a prioritised research backlog.
- Draft procedures, forms, scripts, calculators, data schemas, listing text, outreach drafts and grant material.
- Run deterministic checks on evidence, CSV schemas, public-safe exports and synthetic pilot data.
- Analyse supplied pilot data for labour, margin, sell-through, rejection and route patterns.
- Prepare source-grounded research with claim-level citations and explicit confidence labels.
- Review proposed changes for privacy, unsafe battery handling, unsupported downstream claims and accidental publication of identifiers.

## What requires operator or external confirmation

An agent must mark these as pending rather than infer success:

- Council, Fair Trading, insurer, landlord, fire/WHS or other regulator decisions.
- Physical condition, ownership, lock state, battery safety, sanitisation success or electrical safety.
- Marketplace prices, buyer demand, quotes, partner acceptance and real sale outcomes unless supplied as evidence.
- Interviews, emails, calls, course enrolment, premises inspections and collection/handoff events.

## Evidence labels

| Label | Meaning |
|---|---|
| VERIFIED | Supported by a dated primary source, direct response or recorded test. |
| PROPOSED | An operating rule or draft procedure awaiting local validation. |
| INFERRED | A reasoned interpretation; never present it as a fact. |
| RESEARCH LEAD | A useful direction or contact that still needs checking. |
| BLOCKED | Cannot progress without a person, device, account, approval or external response. |

## Recommended agent loop

1. Read `codexToDO.md`, the relevant research file and the applicable template.
2. State the evidence boundary and avoid private identifiers.
3. Make the smallest complete repository change.
4. Run validators and synthetic examples.
5. Record what is checked, unverified, blocked and next.
6. Preserve unrelated work and never force-push or overwrite a newer remote branch.

## Useful commands

```bash
python3 scripts/triage_intake.py examples/synthetic-intake.json
python3 scripts/analyse_pilot.py pilot-tracker.csv
python3 scripts/check_public_safety.py --git
python3 scripts/validate_pilot_tracker.py
```

The intake and analysis tools are decision-support only. They do not certify a device, create a legal exemption, prove a data wipe or approve public intake.
