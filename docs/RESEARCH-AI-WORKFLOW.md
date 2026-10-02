# AI-assisted research workflow

## Query decomposition

For each gap, create:

1. the decision the evidence must support;
2. the exact claim to verify;
3. primary sources to prefer;
4. local or Australian context required;
5. contradictory evidence to look for;
6. the operator action if confirmed;
7. the person or organisation who must confirm it.

## Source hierarchy

Prefer legislation, regulator guidance, official registers, written partner terms, dated supplier quotes and recorded test results. Use company pages and interviews for operating-model clues, not proof of local availability. Label podcasts, videos, forums and search snippets as leads until independently confirmed.

## Claim record

Every material finding should capture:

```text
claim:
type: Verified Fact | Proposed Policy | Hypothesis | Research Lead
source:
url:
date_checked:
verification_method:
confidence:
notes:
next_action:
owner:
```

## Agent review questions

- Is this current for NSW and the proposed premises?
- Does it describe household recycling, commercial ITAD, resale or a different activity?
- Is the source describing the organisation's own process or an industry benchmark?
- Have we confused a capability with an acceptance commitment?
- Does the claim expose personal data, a street address or a device identifier?
- What would falsify the claim?

## Handoff format

Agents should report four states separately: `CHECKED`, `UNVERIFIED`, `BLOCKED` and `EXTERNAL ACTION REQUIRED`. A successful document build, HTTP response, or generated draft is not evidence that an external partner, regulator, buyer or device has accepted anything.
