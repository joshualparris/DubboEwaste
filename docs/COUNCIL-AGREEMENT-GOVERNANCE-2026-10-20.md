# Council signed-agreement governance — technical and operator acceptance

As at **20 October 2026**. Implementation for DubboEwaste/AssetFlow only. **An app approval is not a Council approval.** Council must separately approve and sign the trial; no collection is permitted without it.

## Scope of improvement 1/10

- Immutable numbered agreement versions, referenced against a single Council 20-device batch.
- Recorded Council and operator signatories, positions, legal delegation basis, dual original signed-document evidence hashes, signed dates.
- Local Sydney effective and expiry dates, exact approved collection sites, specific laptop/desktop/Chromebook scope, activity whitelist, quantity limit (up to 20), point of ownership transfer and conditions for the existing contractor.
- An independent reviewer distinct from draft author; final approver distinct from reviewer. Both must have active Dubbo E-waste manager/admin access. Person-level independence must be confirmed offline; different accounts alone are not proof.
- Approval state machine: DRAFT → REVIEWED → APPROVED; APPROVED → REVOKED or SUPERSEDED. Approved versions cannot have terms silently changed; revised conditions require a new numbered draft.
- Linked approved agreement required *in addition to* five already-required job documents and supervisor approval before batch ACTIVE.
- Mandatory runtime checks for current approval, date validity, site, activity, device category and quantity. These run in the database even if the batch's stored state remains ACTIVE after expiry or revocation.
- Intake calls identify their approved collection site via the asset's Source / exact collection site field. Capture the same site in COLLECTED custody events; mismatch blocks both.
- Quarantine, HOLD and RETURN remain available after revocation/expiry to allow incident containment and returning property safely.
- Private RLS tables for agreements and append-only audit events. No public anonymous access.
- Dashboard shows effective vs merely nominal authorisation; a warning highlights expired/revoked approvals.

## Evidence and attestation boundaries

- A SHA-256 evidence hash does not establish the actual legal validity of a signature or Council delegation. The supervisor must independently verify signed originals with Council's authorised team before recording them.
- 'Reviewed' and 'Approved' record staff assertions in AssetFlow, not a government approval or legal certification.
- Exact site names/addresses must match Council documentation; the system deliberately does not invent facilities or contract permissions.
- No agreement has been entered or approved for the live Council draft `DEW-J-2026-00004`. It remains blocked.
- Legal title terms remain subject to the actual written agreement; an asset-level transfer authority document is still required before donation.

## Verification matrix

| Scenario | Expected |
|---|---|
| Draft batch without approved agreement → ACTIVE | Reject |
| One operator authors and reviews the same agreement | Reject |
| Reviewed agreement approved by same reviewer | Reject |
| Reviewed agreement with missing signed documents/delegation/sites/dates | Reject |
| Approved agreement terms edited in-place | Reject; create new revision |
| Two simultaneously APPROVED versions | Reject until previous version superseded |
| Expired/future-dated/REVOKED agreement with stale batch ACTIVE | Reject all new operational work |
| Category or collection site absent from written scope | Reject intake |
| Activity DONATE/RECYCLE absent from written scope | Reject disposition |
| Device count at signed agreement limit | Reject further intake |
| Correctly linked approval + five governance evidence documents | Allow pilot activation (subject to all other guards) |
| Signed agreement revoked during operations | Immediately blocks collection/donation/recycling; permits HOLD/RETURN |

Physical authorisation and signed-in browser end-to-end QA remain separate before actual collection. Run the matrix with synthetic records in a transaction on a disposable test database or carefully use rollback-only negative tests on production; never fabricate signed agreement data to display a false ACTIVE pilot.

Reference: [Council policy directory](https://www.dubbo.nsw.gov.au/about-council/meetings-and-documents/policies) and [2025–2035 Waste Strategy](https://www.dubbo.nsw.gov.au/about-council/meetings-and-documents/plans-strategies). These describe Council's general governance and resource recovery policies; they are **not** a signed acceptance of this proposed pilot.

## Council retains title until separate release

The `ON_SIGNED_RELEASE` contract option is operationally enforced. New Council devices under that option are received **into custody only**, with `owner_kind=THIRD_PARTY`, an actual owner name and `ownership_verified=false`. Changing to verified ownership requires a signed, hashed, asset-linked `OWNER_TRANSFER` authority record. Standard intake still requires verified ownership outside authorised Council custody. The formal title transfer must match the actual agreement, not simply a staff assertion.
