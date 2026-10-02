# Combined AssetFlow feature catalogue

Every row below is a proposed requirement. Domain benchmarks are inspiration, not feature-level vendor attribution. This catalogue deduplicates common workflows and adds original extensions; it is not an exhaustive enumeration of private vendor functionality.

Priority: P0 = control foundation; P1 = daily operations; P2 = commercial automation; P3 = broader lifecycle. Delivery means likely implementation boundary, not an installed dependency.

## CRM

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-CRM-001 | Customer hierarchy | Keep organisation, sites and contacts separate; a job resolves to its original customer/site. | P1 |
| AFB-CRM-002 | Lead pipeline | Move a lead through named stages with owner and next action. | P1 |
| AFB-CRM-003 | Quote versioning | Accepting a quote freezes its price and terms while later edits create a new version. | P1 |
| AFB-CRM-004 | Service price lists | Apply a dated customer price list and show the calculation. | P1 |
| AFB-CRM-005 | Electronic acceptance | Store signer identity, timestamp and accepted document hash. | P1 |
| AFB-CRM-006 | Contract instructions | Job inherits contractual route restrictions and processing requirements. | P1 |
| AFB-CRM-007 | Service-level tracking | Overdue work is flagged against a recorded contract deadline. | P1 |
| AFB-CRM-008 | Follow-up tasks | Assigned follow-up appears in an operator queue and can be completed. | P1 |
| AFB-CRM-009 | Consent-aware campaigns | An opted-out contact is excluded from sends with an auditable reason. | P1 |
| AFB-CRM-010 | Customer profitability | Show revenue, agreed deductions and recorded direct costs per customer. | P1 |
| AFB-CRM-011 | Customer document library | Only authorised users can read the correct customer documents. | P1 |
| AFB-CRM-012 | Sales commission rules | Recompute commission from a versioned rule and reconcile its basis. | P1 |

## LOG

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-LOG-001 | Collection booking | Customer request creates a pending job without silently confirming unavailable capacity. | P1 |
| AFB-LOG-002 | Expected manifests | Compare expected assets with actual received items and flag mismatches. | P1 |
| AFB-LOG-003 | Multi-pickup orders | Several pickup visits link to one order without duplicate assets. | P1 |
| AFB-LOG-004 | Driver/resource calendar | Reject conflicting vehicle or staff reservations. | P1 |
| AFB-LOG-005 | Vehicle capacity | Show planned load against configured mass/volume limits. | P1 |
| AFB-LOG-006 | Route optimisation | Compare suggested route with baseline using recorded distance and constraints. | P1 |
| AFB-LOG-007 | Digital custody signature | Record releasing and accepting parties against a manifest snapshot. | P1 |
| AFB-LOG-008 | Driver scan workflow | Scanned asset IDs reconcile to the visit manifest. | P1 |
| AFB-LOG-009 | Seal tracking | Each seal break or replacement records actor, time and reason. | P1 |
| AFB-LOG-010 | Carrier booking | A provider booking creates one tracking reference despite retries. | P1 |
| AFB-LOG-011 | Proof of delivery | Attach delivery evidence to the relevant shipment. | P1 |
| AFB-LOG-012 | Recurring collections | Generate dated jobs without duplicating an existing scheduled instance. | P1 |
| AFB-LOG-013 | Collection cancellation | Cancel a future visit without deleting its history. | P1 |
| AFB-LOG-014 | Return packaging | Track kits dispatched, returned and overdue by recovery request. | P1 |

## INV

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-INV-001 | Canonical asset identity | Duplicate serial/IMEI suggestions require reconciliation rather than automatic merging. | P0 |
| AFB-INV-002 | Independent media identity | A removed drive remains traceable to its original and current device. | P0 |
| AFB-INV-003 | Nested containers | Asset-to-box-to-pallet relationships preserve moves and prevent cycles. | P0 |
| AFB-INV-004 | Dynamic attributes | Value includes unit, source and observation time. | P0 |
| AFB-INV-005 | Barcode and QR labels | Scan printed identifier back to the exact record. | P0 |
| AFB-INV-006 | Bulk receiving | Receive quantity/weight lots without inventing serialised devices. | P0 |
| AFB-INV-007 | Bin transfers | A scan creates a location event and updates the current location atomically. | P0 |
| AFB-INV-008 | Multi-site stock | Cross-site movement has dispatch and receiving confirmation. | P0 |
| AFB-INV-009 | Customer segregation | Container rules reject mixing when the contract prohibits it. | P0 |
| AFB-INV-010 | Inventory reservations | Two orders cannot reserve the same serialised asset. | P0 |
| AFB-INV-011 | Cycle counting | Count discrepancies create reviewable adjustments, not silent overwrites. | P0 |
| AFB-INV-012 | Stock ageing | Age is computed from recorded receipt date and can drive a queue. | P0 |
| AFB-INV-013 | Scale capture | Retain raw reading, unit, tare and scale identity. | P0 |
| AFB-INV-014 | SKU classification | A stock SKU does not erase a unit serial identity. | P0 |
| AFB-INV-015 | Minimum stock replenishment | Low stock suggests a purchase order and requires configured approval. | P0 |
| AFB-INV-016 | Missing asset reconciliation | Missing status opens an exception without declaring destruction. | P0 |

## DATA

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-DATA-001 | Data-bearing assessment | Unknown media status blocks release until resolved. | P0 |
| AFB-DATA-002 | Versioned sanitisation policy | Job records sensitivity, selected standard/version and allowed technique. | P0 |
| AFB-DATA-003 | Clear/Purge/Destroy classification | Store outcome separately from the product name or certificate title. | P0 |
| AFB-DATA-004 | Engine-neutral jobs | Requested action records media ID, policy, engine/version and authorisation. | P0 |
| AFB-DATA-005 | Authentic report ingestion | Retain unmodified original bytes and reject an unmatched serial result. | P0 |
| AFB-DATA-006 | Signed report validation | Show valid/invalid/unverifiable signature states separately. | P0 |
| AFB-DATA-007 | Independent verification | Separate engine completion from verification evidence and reviewer validation. | P0 |
| AFB-DATA-008 | Failed wipe quarantine | A failed or incomplete wipe cannot unlock sale/donation. | P0 |
| AFB-DATA-009 | Retry lineage | New attempts retain all failed attempts and policy changes. | P0 |
| AFB-DATA-010 | Physical destruction evidence | Link media identity, method, operator/witness and downstream proof. | P0 |
| AFB-DATA-011 | Multi-drive accounting | Release requires a resolved outcome for every originally detected medium. | P0 |
| AFB-DATA-012 | SSD technique compatibility | Unsupported sanitisation capability produces review, not a success certificate. | P0 |
| AFB-DATA-013 | Cryptographic erase evidence | Record applicable prerequisites and method evidence; do not assume encryption is sufficient. | P0 |
| AFB-DATA-014 | RAID topology | Record members and media identity before dismantling. | P0 |
| AFB-DATA-015 | Parallel batch processing | Each drive gets an independent result even if the batch partly fails. | P0 |
| AFB-DATA-016 | Offline erasure workflow | Synchronise original result evidence without changing its execution timestamps. | P0 |
| AFB-DATA-017 | Certificate version/revocation | Superseding a certificate preserves old version and revocation reason. | P0 |
| AFB-DATA-018 | Certificate verification page | Expose limited verification status without private customer or device data. | P0 |
| AFB-DATA-019 | Licence consumption accounting | Track engine events/costs and reconcile vendor balance. | P0 |
| AFB-DATA-020 | Selective file-erasure distinction | A file-erasure result cannot satisfy a whole-media release policy. | P0 |

## DIAG

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-DIAG-001 | Hardware discovery | Import observed CPU/RAM/storage identities with discovery source/version. | P1 |
| AFB-DIAG-002 | SMART health | Retain raw health report and distinguish unsupported from healthy. | P1 |
| AFB-DIAG-003 | Battery health | Store design/full capacity, cycle count, date and test method. | P1 |
| AFB-DIAG-004 | Keyboard tests | Record per-key failures, layout and operator interaction. | P1 |
| AFB-DIAG-005 | Display tests | Record dead pixels, image faults and cosmetic observations separately. | P1 |
| AFB-DIAG-006 | Audio/microphone tests | Record each component result and supporting observations. | P1 |
| AFB-DIAG-007 | Camera tests | Store functional result without retaining customer images. | P1 |
| AFB-DIAG-008 | Port/network tests | Each required interface has pass/fail/not-tested state. | P1 |
| AFB-DIAG-009 | Memory/CPU stability | Retain duration, workload and measured results. | P1 |
| AFB-DIAG-010 | Thermal checks | Configured limits identify overheating with recorded conditions. | P1 |
| AFB-DIAG-011 | Before/after audit | Compare repair changes without overwriting original specifications. | P1 |
| AFB-DIAG-012 | Custom test profiles | Model/category profile defines mandatory checks. | P1 |
| AFB-DIAG-013 | Test evidence provenance | Automated and manual results identify their producer. | P1 |
| AFB-DIAG-014 | Independent final QA | A reviewer can fail a unit despite earlier successful tests. | P1 |

## MOBILE

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-MOBILE-001 | IMEI/serial discovery | Reconcile identifiers and retain source of each observation. | P2 |
| AFB-MOBILE-002 | Lost/stolen checks | Store provider, lookup time and regional coverage; unknown is not clear. | P2 |
| AFB-MOBILE-003 | Activation-lock checks | Locked or unverified result blocks resale. | P2 |
| AFB-MOBILE-004 | Owner release workflow | Store authorised deregistration request and later confirmation. | P2 |
| AFB-MOBILE-005 | SIM/network restrictions | Represent carrier unlock independently from activation/ownership locks. | P2 |
| AFB-MOBILE-006 | Removable card detection | Account for inserted SIM and memory cards without accessing customer content. | P2 |
| AFB-MOBILE-007 | Mobile functional tests | Profile covers touch, sensors, radios and charging with per-test evidence. | P2 |
| AFB-MOBILE-008 | Mobile battery grading | Retain battery reading and applicable threshold version. | P2 |
| AFB-MOBILE-009 | USB parallel processing | Each port maps to a stable device ID and separate operation outcome. | P2 |
| AFB-MOBILE-010 | Cosmetic AI assistance | Save model/version, source images and confidence; permit audited correction. | P2 |
| AFB-MOBILE-011 | Trade-in quote | Final verified grade changes offer only through visible customer acceptance. | P2 |
| AFB-MOBILE-012 | Buyback transaction | Record ownership authority, accepted offer and payment reference. | P2 |
| AFB-MOBILE-013 | Retail self-assessment | Self-reported condition is explicitly provisional. | P2 |
| AFB-MOBILE-014 | OEM part verification | Unsupported provenance is unknown rather than original. | P2 |
| AFB-MOBILE-015 | Smartwatch support | Enable a model only when its discovery/test/erasure adapter has coverage evidence. | P2 |
| AFB-MOBILE-016 | Authorised content transfer | Separate consent and transfer scope from sanitisation; avoid default migration. | P2 |

## REPAIR

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-REPAIR-001 | Repair work orders | Record fault, plan, assigned technician and parts/labour. | P1 |
| AFB-REPAIR-002 | Repair economics | Compare forecast uplift with labour, parts, fees and warranty allowance. | P1 |
| AFB-REPAIR-003 | Parts harvesting | Every harvested part links to source asset and any data-bearing assessment. | P1 |
| AFB-REPAIR-004 | Parts installation lineage | Track source part into destination and retain removal history. | P1 |
| AFB-REPAIR-005 | Parts compatibility | Unsupported substitution requires a visible review. | P1 |
| AFB-REPAIR-006 | Bench work queue | Order eligible tasks by priority without bypassing release controls. | P1 |
| AFB-REPAIR-007 | Functional/cosmetic grades | Grades are separate and refer to a versioned rubric. | P1 |
| AFB-REPAIR-008 | Completeness grading | Missing chargers/accessories visibly affect the listing. | P1 |
| AFB-REPAIR-009 | Repair outcome QA | Completed repair remains unsaleable until required retests pass. | P1 |
| AFB-REPAIR-010 | OS imaging | Record image hash/version and deployment result against device. | P1 |
| AFB-REPAIR-011 | Driver provisioning | Retain driver source/version and post-install test results. | P1 |
| AFB-REPAIR-012 | Refurbisher licence tracking | Apply keys only under valid programme entitlement; record private references. | P1 |
| AFB-REPAIR-013 | Chromebook support horizon | Store evidenced support-end date and disclose it in the sale. | P1 |
| AFB-REPAIR-014 | Autopilot/MDM detection | Registration unknown/locked blocks normal resale until authorised release. | P1 |

## RECYCLE

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-RECYCLE-001 | Lot splitting | Child weights/quantities reconcile to parent with explicit residuals. | P1 |
| AFB-RECYCLE-002 | Mass balance | Input, output and loss reconcile within a versioned tolerance. | P1 |
| AFB-RECYCLE-003 | Commodity classification | Material class and contamination notes accompany measured weight. | P1 |
| AFB-RECYCLE-004 | Teardown thresholds | Recommend processing batches using recorded capacity and commodity rules. | P1 |
| AFB-RECYCLE-005 | Baling/shredding records | Output batch refers back to the input lots and processing event. | P1 |
| AFB-RECYCLE-006 | Downstream vendor register | Capability and due-diligence evidence have owners and expiry dates. | P1 |
| AFB-RECYCLE-007 | Route eligibility | Expired/unsupported destination is excluded from automatic recommendation. | P1 |
| AFB-RECYCLE-008 | Outbound manifests | Freeze shipment contents/weights with a customer-safe copy. | P1 |
| AFB-RECYCLE-009 | Downstream receipt reconciliation | Compare received weight with shipped weight and open discrepancy. | P1 |
| AFB-RECYCLE-010 | Final outcome confirmation | Dispatch alone cannot establish final recycling or destruction. | P1 |
| AFB-RECYCLE-011 | Recycling certificates | State evidenced scope and exclude unresolved destinations. | P1 |
| AFB-RECYCLE-012 | Hazard segregation | Battery or other hazard flag restricts permitted handling/storage route. | P1 |

## SALE

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-SALE-001 | Evidence-based listings | Published specification, defects and grade match released unit. | P1 |
| AFB-SALE-002 | Retail/wholesale channels | Allocate inventory to channel with explicit reservation. | P1 |
| AFB-SALE-003 | Marketplace synchronisation | A sale removes availability elsewhere without double-selling. | P1 |
| AFB-SALE-004 | Own storefront | Customer sees availability and documented device condition. | P1 |
| AFB-SALE-005 | Bid list generation | Export selected eligible units without private donor details. | P1 |
| AFB-SALE-006 | Pricing/devaluation templates | Explain base value and each versioned deduction. | P1 |
| AFB-SALE-007 | Market valuation history | Store observed comps/date rather than inventing a live price. | P1 |
| AFB-SALE-008 | POS sales | Invoice and stock release record the sold serial. | P1 |
| AFB-SALE-009 | Consignment ownership | Track beneficial owner and agreed settlement rules. | P1 |
| AFB-SALE-010 | Pick/pack verification | Wrong serial scan blocks fulfilment. | P1 |
| AFB-SALE-011 | Shipping rates/labels | Label references actual package and recorded service choice. | P1 |
| AFB-SALE-012 | Delivery tracking | Provider updates retain event history. | P1 |
| AFB-SALE-013 | Returns/RMA | Returned serial reconciles to sale and gets a fresh processing assessment. | P1 |
| AFB-SALE-014 | Warranty claims | Track claim, outcome and cost without deleting sale history. | P1 |
| AFB-SALE-015 | Return substitution detection | Serial mismatch raises review with evidence. | P1 |
| AFB-SALE-016 | Donation/redeployment | Recipient eligibility and final release evidence are recorded. | P1 |

## FIN

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-FIN-001 | Service fee calculation | Invoice explains unit/weight/time fees and contractual basis. | P2 |
| AFB-FIN-002 | Profit-share settlements | Deduct only agreed cost types and reproduce each owner payout. | P2 |
| AFB-FIN-003 | Settlement approval | Versioned settlement cannot be paid before the required approval. | P2 |
| AFB-FIN-004 | Invoice accounting sync | Retry cannot create a duplicate accounting invoice. | P2 |
| AFB-FIN-005 | Payment reconciliation | Payment updates reference the correct invoice and currency. | P2 |
| AFB-FIN-006 | Purchase orders | Receipt and supplier invoice reconcile to approved order. | P2 |
| AFB-FIN-007 | Credit/refund records | Refund links to original invoice and return outcome. | P2 |
| AFB-FIN-008 | Multi-currency support | Record original currency, rate source/date and converted amount. | P2 |
| AFB-FIN-009 | Australian tax configuration | Accountant-approved tax rules are explicit and testable. | P2 |
| AFB-FIN-010 | Cost allocation | Shared logistics/labour costs use a visible versioned allocation method. | P2 |
| AFB-FIN-011 | Customer/asset profit reporting | Separate realised proceeds from forecast valuation. | P2 |
| AFB-FIN-012 | Aged receivables | Age unpaid balances and record follow-up actions. | P2 |

## ESG

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-ESG-001 | Outcome-based impact | Report reuse, donation and recycling separately using confirmed outcomes. | P2 |
| AFB-ESG-002 | Versioned factors | Factor value includes source, scope, unit and methodology date. | P2 |
| AFB-ESG-003 | Transport emissions | Keep logistics contribution visible rather than silently ignoring it. | P2 |
| AFB-ESG-004 | Avoided-emissions estimates | Label estimates and retain the counterfactual assumption. | P2 |
| AFB-ESG-005 | No double counting | An asset contributes once to the applicable confirmed impact metric. | P2 |
| AFB-ESG-006 | Customer impact dashboard | Customer sees only its own jobs and an explanation of calculations. | P2 |
| AFB-ESG-007 | Uncertainty reporting | Missing weights/factors appear as gaps instead of fabricated zeros. | P2 |
| AFB-ESG-008 | Repair/reuse lifespan | Record observed follow-up separately from assumed extended life. | P2 |

## PORT

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-PORT-001 | Tenant-isolated client access | Customer A cannot access customer B by altering URL or identifier. | P2 |
| AFB-PORT-002 | Role-specific reports | Hide operator margins and sensitive evidence from client views. | P2 |
| AFB-PORT-003 | Collection amendment cutoff | After pickup, amendments become auditable change requests. | P2 |
| AFB-PORT-004 | Live status timeline | Display actual recorded events, not estimated completion as fact. | P2 |
| AFB-PORT-005 | Document downloads | Download permission follows document/customer ownership. | P2 |
| AFB-PORT-006 | Client feedback/comments | Comment links to exact job and has a visible author. | P2 |
| AFB-PORT-007 | Knowledgebase/SOP versions | Operator acknowledgement references the published version. | P2 |
| AFB-PORT-008 | Accessible mobile portal | Core tasks work with keyboard and narrow screens. | P2 |

## LIFE

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-LIFE-001 | Employee recovery requests | Departure event creates a recoverable-device task with authority. | P3 |
| AFB-LIFE-002 | Retrieval escalation | Late return creates follow-up without declaring asset lost. | P3 |
| AFB-LIFE-003 | Device redeployment stock | Customer-owned stock remains distinct from resale-owned stock. | P3 |
| AFB-LIFE-004 | Procurement handoff | New equipment order relates to the replacement/retirement cycle. | P3 |
| AFB-LIFE-005 | HR/IdP event integration | Duplicate offboarding events create only one request. | P3 |
| AFB-LIFE-006 | MDM release coordination | Track authorised deregistration and confirmation; no lock bypass. | P3 |
| AFB-LIFE-007 | Equipment loans | Checkout and return preserve responsible person and due date. | P3 |
| AFB-LIFE-008 | Remote support handoff | Ticket relates to asset without making remote control an implicit default. | P3 |

## INT

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-INT-001 | Documented API | Versioned schema validates request/response fields. | P1 |
| AFB-INT-002 | Signed webhooks | Reject invalid signature and stale/replayed event. | P1 |
| AFB-INT-003 | Idempotent operations | Repeat imported operation produces one record/event. | P1 |
| AFB-INT-004 | Adapter capability registry | List supported versions/formats/models and explicit unsupported cases. | P1 |
| AFB-INT-005 | Raw evidence storage | Store original report hash and restricted immutable reference. | P1 |
| AFB-INT-006 | Import mapping previews | CSV preview reveals rejected rows before commit. | P1 |
| AFB-INT-007 | Schema conflict queue | Conflicting serial or outcomes require human review. | P1 |
| AFB-INT-008 | ServiceNow disposal bridge | Map customer asset ID and evidence before approved retirement update. | P1 |
| AFB-INT-009 | Jira Assets bridge | Configured schema/state mapping preserves external object identity. | P1 |
| AFB-INT-010 | Alloy bridge | Verified API mapping links retirement status to customer asset reference. | P1 |
| AFB-INT-011 | ERP/wipe vendor bridges | Use authentic samples and agreement-specific API permissions. | P1 |
| AFB-INT-012 | Printer/scale local bridge | Scoped workstation service connects hardware without browser-wide fleet control. | P1 |
| AFB-INT-013 | Offline scan synchronisation | Conflict resolution retains device-local event time and server receipt time. | P1 |
| AFB-INT-014 | Adapter health alerts | Failed external updates remain pending with visible retries. | P1 |
| AFB-INT-015 | Export and exit portability | Export entities, relationships and evidence references in documented formats. | P1 |

## PLUS

| ID | Requirement | Acceptance condition | Priority |
|---|---|---|---|
| AFB-PLUS-001 | Dubbo capacity-aware intake | Booking checks measured secure slots, staffed hours and approved categories. | P1 |
| AFB-PLUS-002 | Evidence-expiry launch gates | Expired required approval prevents new affected intake. | P1 |
| AFB-PLUS-003 | Refuse-and-route directory | Refused categories show an evidenced current safe pathway. | P1 |
| AFB-PLUS-004 | Repair-first decision explanation | Compare reuse, repair, parts, donation and recycling without hardware-age shortcuts. | P1 |
| AFB-PLUS-005 | Transport pooling | Show possible shared regional pickups with cost/capacity tradeoffs. | P1 |
| AFB-PLUS-006 | Public buyer device passport | Publish sanitised provenance, tests, condition and warranty with explicit privacy controls. | P1 |
| AFB-PLUS-007 | Outcome follow-up | Record recipient/buyer feedback and repeat failure history. | P1 |
| AFB-PLUS-008 | Human-reviewed AI assistance | AI draft cannot authorise wipe, release, payout or compliance claims. | P1 |
| AFB-PLUS-009 | Incident and recall traceability | Find affected sold/donated units from a part, batch or policy version. | P1 |
| AFB-PLUS-010 | Operational simplicity mode | Small operator can use one receiving/bench/release queue with advanced modules hidden. | P1 |
| AFB-PLUS-011 | Claim-to-evidence linting | Reject verified labels lacking valid evidence references. | P1 |
| AFB-PLUS-012 | Data retention enforcement | Apply approved retention/legal-hold rules to evidence without destroying required custody records. | P1 |
| AFB-PLUS-013 | Restore drills | Restore a backup and reconcile asset count and evidence hashes. | P1 |
| AFB-PLUS-014 | Least-privilege processing | A workstation token cannot read unrelated customer data. | P1 |
| AFB-PLUS-015 | Release race protection | Concurrent stock update cannot bypass an active hold. | P1 |
| AFB-PLUS-016 | Feature parity scorecard | Only tested eligible requirements count as delivered coverage. | P1 |

