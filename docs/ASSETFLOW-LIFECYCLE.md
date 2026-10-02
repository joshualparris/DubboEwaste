# AssetFlow lifecycle model

**Implemented:** 2 October 2026

AssetFlow now treats the asset lifecycle as evidence-driven rather than as a manually edited status field.

## Canonical lifecycle

```text
receive
  ↓
ownership / authority
  ↓
intake triage
  ↓
quarantine clearance (when required)
  ↓
exact model identity
  ↓
data sanitisation (when data-bearing)
  ↓
diagnostics
  ↓
grade
  ↓
repair / parts work (when required)
  ↓
final disposition
  ↓
route completion
  ↓
certificate / evidence snapshot
  ↓
reporting
```

The lifecycle evaluator lives in:

- `EwasteApp/lib/asset-lifecycle.ts`

The staff queue is:

- `/workflow`

Each asset page renders the same lifecycle evaluation so the operator can see the next action and any blockers.

## Evidence sources by stage

| Stage | Source of truth |
|---|---|
| Receipt | `assets` + asset audit event |
| Ownership / authority | `asset_authority_records` |
| Intake triage | `asset_triage_assessments` |
| Quarantine | `asset_quarantines` |
| Model identity | `assets.manufacturer/model/serial_imei` |
| Sanitisation | `media` + `sanitisation_tasks` + evidence |
| Diagnostics | `asset_tests` |
| Grade | `grades` |
| Repair | `repairs` |
| Parts | `parts` |
| Final route | `dispositions` |
| Resale completion | `resale_listings` + `sales` |
| Recycling completion | `outbound_contents` + `outbound_orders` + downstream receipt |
| Certificate | `certificates` |
| Exceptions | `exceptions` |
| Reporting | measured operational records only |

## Important invariants

### Authority is explicit

The old boolean `ownership_verified` remains as a fast gate, but a lifecycle-complete asset also needs an explicit authority record.

New intake creates this record immediately.

Authority records are append-only by default.

### HOLD is not a hidden state

A triage HOLD creates or preserves a quarantine record. An open quarantine blocks the lifecycle until someone explicitly records the release and reason.

### Recycling is not a decision label

Selecting `RECYCLE` now means:

```text
RECYCLE disposition
→ READY_FOR_RECYCLING
→ attach asset/pallet to outbound order
→ OUTBOUND
→ downstream receipt/confirmation
→ RECYCLED
```

A Recycling Certificate cannot be issued before the completed downstream handoff.

### Repair requires retest

Completing a repair returns the asset to `DIAGNOSTICS`.

The lifecycle evaluator ignores pre-repair diagnostics when determining whether required post-repair diagnostics are complete.

### Sanitisation/destruction evidence is separate

Each data-bearing medium remains independently tracked.

- `PASSED` → media data state becomes `VERIFIED_CLEARED`
- `DESTROYED` → media is terminal, final route records destruction
- `NOT_REQUIRED` → media becomes `NON_DATA_BEARING`
- `FAILED` → media becomes `SANITISATION_FAILED` and an exception is opened

### Certificate type has meaning

Certificate template v2 applies type-specific gates:

- **RECEIPT / RECEIVING** require authority evidence
- **SANITISATION** requires tracked media and a verified-cleared asset data state
- **DESTRUCTION** requires a recorded destroyed-media outcome
- **DISPOSITION** requires a final disposition
- **RECYCLING** requires a RECYCLE disposition plus completed downstream receipt
- **ENVIRONMENTAL** requires an active versioned methodology
- **DEVICE_HISTORY** remains the broad lifecycle snapshot

The SHA-256 is a tamper-evident snapshot hash, not a digital signature.

## Diagnostic completeness

The workflow uses category-specific required test sets.

For example, a laptop currently expects:

- Boot / POST
- Memory
- Storage health
- Battery
- Display
- Keyboard
- Wi-Fi
- Charging
- Physical condition

A FAIL still counts as a completed diagnostic. The failure influences repair/disposition; it is not treated as “test never performed”.

## Downstream provider register

`downstream_vendors` now tracks operational due diligence instead of a single free-text capability field.

Important fields include:

- provider type
- verification status
- accepted streams
- commercial terms
- pricing / fees
- minimum quantities
- lithium policy
- CRT policy
- documentation available
- certifications
- NTCRS relationship
- first downstream facility
- confirmation source
- last confirmed date

Use the verification states conservatively:

- `RESEARCH_LEAD` — useful public research only
- `CONTACTED` — contact made but terms unresolved
- `TERMS_RECEIVED` — terms were supplied but not fully accepted/verified
- `CONFIRMED` — current operating terms have been directly verified
- `NOT_SUITABLE` — not an appropriate route

## Testing

The lifecycle evaluator has deterministic unit tests in:

- `EwasteApp/lib/asset-lifecycle.test.ts`

CI runs:

```bash
npm run typecheck
npm run test:workflow
npm run build
```

## Deliberate limitations

This workflow does not pretend that software proves a physical act happened.

AssetFlow can record:

- an operator's inspection;
- a wipe result;
- an attached report;
- a recycler receipt;
- a test result;
- a sale;
- a disposition.

The actual physical work still has to occur and the evidence should be captured honestly.
