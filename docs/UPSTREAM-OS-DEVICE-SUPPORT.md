# Upstream alternative-OS device support (verified)

Verified device-support data extracted directly from upstream mobile-OS project
sources, for answering one reuse question: **does a donated device have a real
alternative-OS port, and how mature is it?**

- Data: [`data/postmarketos-devices.csv`](../data/postmarketos-devices.csv)
- Tool: [`scripts/query_postmarketos_devices.py`](../scripts/query_postmarketos_devices.py)
- Tests: [`scripts/test_query_postmarketos_devices.py`](../scripts/test_query_postmarketos_devices.py)

## postmarketOS

217 devices across the `main`, `community`, `testing` and `downstream` maturity
categories, extracted from the postmarketOS **pmaports** repository.

### Provenance & reproducibility

Every row carries a `source` tag pinning the exact pmaports commit it came from
(e.g. `postmarketos-pmaports@fa1fa51`, dated in `source_date`). To regenerate
from a fresh checkout:

```
git clone https://gitlab.postmarketos.org/postmarketOS/pmaports.git
# then run the extractor (reads each device/<category>/device-*/deviceinfo):
#   deviceinfo_name / _codename / _year / _arch / _chassis / _soc
```

The extractor walks `device/{main,community,testing,downstream}/device-*/deviceinfo`
and emits one row per port. `archived` ports are deliberately excluded.

### Usage

```
python scripts/query_postmarketos_devices.py msm8909          # SoC family
python scripts/query_postmarketos_devices.py samsung --arch armv7
python scripts/query_postmarketos_devices.py --category community
python scripts/query_postmarketos_devices.py --validate
```

## Maturity, honestly

`main` > `community` > `testing` > `downstream`. A listed port means upstream has
real code for the device; it does **not** mean a turn-key flash, that a given
unit is bootloader-unlockable, or that any account/FRP lock can be defeated.
`testing` ports are experimental and must be confirmed on authorised hardware.
This dataset answers "is there a pathway worth evaluating?", not "flash this now".

## Relationship to other compatibility data

- `data/legacy-device-compatibility.csv` — our small offline legacy-Android role
  triage (clock/calculator/etc.).
- AssetFlow `model_support` — the authoritative operational intake reference.
- This file — verified **upstream** alt-OS port coverage, cross-referenced by
  codename / SoC. Future work: LineageOS and Ubuntu Touch device lists in the
  same shape.
