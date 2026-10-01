# DubboEwaste Evidence Standard

All factual claims, operational rules, and external relationships in this repository MUST be documented in `data/evidence.yaml` according to this schema before being promoted to `[VERIFIED]` status in operational documents.

## Schema Requirements (YAML)
Every evidence record must be an object in a YAML list with the following exact keys:
- `id`: Unique identifier (e.g., `EVD-001`)
- `claim`: The specific, auditable statement.
- `type`: `Verified Fact`, `Proposed Policy`, `Hypothesis`, or `Research Lead`.
- `source`: Name of the source.
- `url`: Link to the primary source or document.
- `date_checked`: ISO 8601 date (YYYY-MM-DD).
- `verification_method`: `Primary source`, `Direct contact`, `Public registry`, `Independent secondary source`, or `Industry inference`.
- `confidence`: `High`, `Medium`, or `Low`.
- `notes`: Any context, caveats, or limitations.

## Agent Instructions
1. **Never** mark a claim as `[VERIFIED]` in any markdown document unless a corresponding, validated entry exists in `data/evidence.yaml`.
2. **Never** make completion-style git commits (e.g., "complete e-waste research") without attaching or referencing the validated evidence records.
3. Before committing changes to evidence, agents MUST run `python3 scripts/validate_evidence.py` and ensure a 0 exit code.
