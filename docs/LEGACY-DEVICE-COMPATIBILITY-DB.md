# Legacy-device compatibility database

A small, searchable database of legacy Android devices and what they can be
safely reused as. It supports reuse triage: given a model code, name or SoC, it
returns the hardware facts, alternative-OS status and recommended reuse roles.

- Data: [`data/legacy-device-compatibility.csv`](../data/legacy-device-compatibility.csv)
- Tool: [`scripts/query_device_compatibility.py`](../scripts/query_device_compatibility.py)
- Tests: [`scripts/test_query_device_compatibility.py`](../scripts/test_query_device_compatibility.py)

## Usage

```
python scripts/query_device_compatibility.py 2PST1           # by model code
python scripts/query_device_compatibility.py msm8909         # by SoC family
python scripts/query_device_compatibility.py --role clock --verified-only
python scripts/query_device_compatibility.py --min-ram 2000
python scripts/query_device_compatibility.py --validate      # schema check (CI-friendly)
```

Run the tests with:

```
cd scripts && python -m unittest test_query_device_compatibility
```

## Schema

| Column | Meaning |
|---|---|
| `model_code` | Manufacturer model code (e.g. `2PST1`) |
| `marketing_name` | Human name (e.g. HTC Desire 530) |
| `soc` / `soc_family` | Chipset and its port family (e.g. `msm8909`) |
| `release_year`, `shipped_android`, `max_official_android` | Era / OS ceiling |
| `ram_mb`, `storage_gb` | Memory / storage |
| `frp_capable` | Whether the device's era supports Factory Reset Protection. **A hardware-era fact, not a claim that a lock can be removed.** |
| `lineageos_official`, `postmarketos_status` | Alternative-OS reuse options |
| `recommended_roles` | `;`-separated reuse roles (clock, calculator, …) |
| `verification` | Evidence state (see below) |
| `source` | Where the row's facts came from |

## Evidence rule

Only rows whose `verification` is **not** `EXAMPLE-UNVERIFIED` or
`needs-confirmation` are authoritative. Seed examples are included so the
query/filter behaviour is demonstrable and testable; `--verified-only` excludes
them. The database deliberately **starts small and grows with verified
research** rather than shipping unchecked compatibility claims.

As at 2026-11-25 the only verified row is the HTC Desire 530 (2PST1), grounded
in this project's own research (DeviceAtlas/GSMArena specs; postmarketOS wiki
for the generic MSM8909 port status).

## Relationship to AssetFlow `model_support`

This CSV is a lightweight, **offline/public** reuse-triage lookup focused on
legacy-Android SoC families and alternative-OS roles. The **authoritative**
intake compatibility reference is the private `model_support` table in the
AssetFlow database (manufacturer, model, support summary, lock risks, battery
notes, likely route, confidence, aliases, identifiers). When curating device
facts for operational use, prefer `model_support`; this CSV is for offline/field
triage and public sharing, and deliberately carries no donor or per-asset data.

## Boundary

This database never bypasses, confirms or defeats an account/FRP lock. An
account-locked handset must be cleared through the owner or a manufacturer
process before any whole-device reuse — see `tools/ipad-legacy-assistant/`.
