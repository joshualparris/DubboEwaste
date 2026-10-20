# Council Pilot Risk Management — Implementation and Acceptance
**20 October 2026 · AssetFlow / DubboEwaste · proposed donation-only pilot of up to 20 computers**

## Source and claims

- Council publicly confirmed a revised Risk Management Policy was **adopted on 23 June 2026**, endorsed by ARIC 4 May 2026: https://www.dubbo.nsw.gov.au/news-and-media/news-and-resources/council-news/2026/outcomes-from-the-june-2026-ordinary-council-meeting
- The publicly linked Risk Management PDF returned a **2023 v3.0** document, not the June 2026 replacement: https://www.dubbo.nsw.gov.au/ArticleDocuments/241/Council%20Policy%20-%20Risk%20Management.pdf.aspx . It distinguishes operational, strategic and project risk; notably project risks cannot automatically use the corporate consequence matrix.
- SafeWork NSW outlines the process of identifying hazards, assessing risks, eliminating or controlling, consulting and reviewing: https://www.safework.nsw.gov.au/legal-obligations/employer-business-obligations/managing-hazards-and-risks
- The collection and transport of waste Code of Practice (March 2026) describes lithium-ion waste/battery fire hazards: https://www.safework.nsw.gov.au/__data/assets/pdf_file/0014/1404023/Collection_and_transport_of_waste-COP.pdf
- Approved NSW Codes have enhanced legal significance since 1 July 2026: https://www.safework.nsw.gov.au/resource-library/codes-of-practice
- **No Council-approved project risk matrix, agreed scoring rules or written authorisation for this pilot have been supplied.** No values are fabricated. Approval inside AssetFlow is not Council certification, and digital checks cannot substitute for physical assessment.

## Features implemented

1. Per-batch risk register with classification (project, operational, strategic), hazard, causes, consequence, affected people, legal basis and responsible owner. Starts with 12 **unassessed** example scenarios, with no fake ratings.
2. Source framework version records. The operator enters **actual supplied** likelihood and consequence codes and every matrix intersection manually; accepts source evidence and records whether it was Council-provided or an operator method expressly accepted by Council. Incomplete matrices cannot be verified.
3. Two-person framework verification. Draft author cannot self-verify. Approved framework versions cannot be edited silently; replacing a framework invalidates assessments based on older versions.
4. Inherent versus residual likelihood/consequence and severity **derived from the documented supplied matrix**, not a hardcoded (likelihood × consequence) formula. Every assessment includes a written risk rationale, treatment plan, consultation summary, evidence and scheduled review.
5. Independent assessment acceptance with separate assessor and approver, a named risk owner, verifiable controls and captured original evidence.
6. Hierarchy-of-control interventions: elimination, substitution, isolation, engineering, administrative and PPE. Distinct control owner, implementation deadline, status, evidence, independent verifier and next effectiveness review. Failed/overdue controls block operational release.
7. Corrective action register, named owner, due date, verified completion evidence and independent closure.
8. Actual incident reporting (injury, fire, battery, privacy, loss, environmental, near miss) with time, severity, first response and any legal notification reference. Serious/critical events **automatically PAUSE** an ACTIVE pilot. Reporting does not contact authorities or emergency services.
9. Append-only RLS-controlled audit trail of changes in risks, ratings, controls, actions, frameworks and incidents. Sensitive report access restricted to E-waste supervisors.
10. Runtime database gates on activation, new assets, custody, job progression and disposition. No stale "ACTIVE" batch flag can bypass overdue reviews or serious incidents. Emergency HOLD, QUARANTINE and RETURN remain allowed.
11. A private risk-register CSV export including assessment status, rating, control status, actions and review dates; CSV cells are escaped against formula injection.

## Acceptance gates and operating protocol

- Council's current adopted **project-specific** framework, approved matrix or written authorisation of a documented operator matrix must be independently obtained and uploaded. The original Council 2026 risk policy or Corporate Governance guidance should be attached to the submission.
- Assign risk owners and get worker/stakeholder consultation on actual tasks, equipment and facilities. Assess all 12 prompts and any hazards actually identified in a site inspection, keeping "OPEN" until suitable evidence exists.
- Choose the highest reasonably practicable risk elimination/minimisation hierarchy. A PPE-only response may be inadequate when a hazard can be eliminated or isolated.
- Photograph and assess the actual battery, electrical supply, loading route, storage, locked-device handling, retained-data devices and downstream waste route. Use appropriately competent workers; do not perform unlicensed electrical work.
- Independently verify actual control implementation, original evidence and review dates; then independently accept each residual risk against the **actual documented** risk appetite and procedure.
- Run actual emergency response, fire isolation, incident notification, evacuation, data-breach and spill-response tabletop exercises. Document attendees and corrective actions.
- Fail closed for serious open incidents, missing risk owner, open corrective action, unverified control or expired assessment. For serious incidents, stop work first, seek urgent help where needed and satisfy SafeWork/police/privacy legal notification requirements; the app does **not** notify them.
- Reconcile physical pilot intake, Council signed agreement, insurer's cover, disposal records, serials and waste tonnage before submitting the acceptance pack.
- Perform real signed-in browser role tests plus test a complete physical device journey. **Passing CI, database negative tests and recorded checkboxes do not establish compliance on their own.**

## Mandatory software checks

- [ ] Pilot **DRAFT** and no verified matrix: ACTIVE rejected; intake, custody and donation blocked.
- [ ] Attempt to verify incomplete framework: rejected. Source evidence must be genuine, stored job-linked and SHA-256 identified.
- [ ] Framework author tries to self-verify: rejected.
- [ ] Risk author tries to approve own assessment: rejected.
- [ ] Risk moves to MONITORING without valid assessment: rejected.
- [ ] Control verified without original job-linked evidence or different verifier: rejected.
- [ ] Control marked FAILED or review date expires: no further operational work.
- [ ] Corrective action remains open: risk clearance blocked.
- [ ] Serious incident while ACTIVE: pilot automatically PAUSED, with original incident record preserved; no automatic restart after incident close.
- [ ] Incident reporter attempts independent close: rejected.
- [ ] Non-authorised user reads risk records, alters status or exports CSV: denied.
- [ ] Matrix version superseded: old approved assessments no longer satisfy readiness.
- [ ] Time-zone date boundary uses Australia/Sydney consistently and no default/scored Council matrix is fabricated.
- [ ] Non-Council jobs/assets operate under their existing controls (no global interruption).
- [ ] All actual critical exceptions, WHS consultation and external notifications documented.

**Remaining before actual Council trial:** latest Council policy/framework, site risk walkthrough, genuine approved evidence, real equipment testing, worker consultation, emergency drills, independent external assessment and written Council approval.
