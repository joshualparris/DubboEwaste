# AssetFlow erasure, diagnostics and deployment capability boundary

Updated 6 October 2026.

AssetFlow now records the control plane for these capabilities. It does not claim that a browser can safely overwrite a disk, alter firmware, execute a vendor MSI, boot a PXE fleet, or produce a legally binding digital signature without a separately approved workstation or enterprise integration.

| Capability | Status in AssetFlow | Evidence / next integration |
|---|---|---|
| SATA, SCSI, SAS, USB and NVMe media inventory | Integrated | Media records plus the sanitisation capability matrix; confirm the actual interface on the bench. |
| NIST SP 800-88 Clear/Purge and legacy DoD method selection | Integrated as controlled recording | Select the standard and operation, record tool/version, verification and raw report evidence. The operator must use an approved tool. |
| OPAL, HPA, DCO and freeze-lock preflight | Integrated as structured preflight fields | The app records the observed state and escalation. It does not unlock or remove protected areas. |
| Firmware-level erase / hidden-sector access | Not executable by the web app | Requires a certified local wipe agent, boot medium and documented fallback-to-destruction procedure. |
| Blancco MSI / Windows PE package | Integration hook only | Deployment profile stores package, command and environment references. Package creation, licensing and execution remain external. |
| ServiceNow / Microsoft Endpoint Manager / PXE / netboot | Integration hook only | Deployment runs can be planned and linked to an external run ID/report. Webhook/API credentials and a pilot connector are still required. |
| 12+ automated hardware tests | Integrated as diagnostic runs and test records | Runs can be recorded from manual, local-agent, boot-media or external-report execution. A local agent is still needed for automatic measurement. |
| PDF/XML certificate evidence | Integrated as evidence metadata | Upload the vendor report and record its hash/format. PDF/XML generation and vendor certificate authenticity remain external until a tested adapter exists. |
| Tamper-evident audit vault | Integrated | Certificate snapshots are hash-chained in `certificate_vault_records`, with public verification and evidence links. This is not an asymmetric signature or immutable third-party archive. |

## Sanitisation release gate

AssetFlow now fails safe when an operator attempts to record **PASSED**:

- the operation must be **CLEAR** or **PURGE**;
- NIST-labelled records must explicitly identify **NIST SP 800-88 Rev. 2**;
- the selected standard and Clear/Purge operation must agree;
- tool name, tool version and method/profile must be recorded;
- verification must explicitly be **PASS**;
- hashed raw evidence must already exist for the media record;
- the media interface must match an active sanitisation capability record;
- the selected Clear/Purge operation must be supported for that interface;
- required HPA/DCO checks must be resolved where the capability requires them;
- blocking freeze-lock or OPAL states prevent release.

The UI defaults a new record to **QUEUED**, never **PASSED**. A **DESTROYED** result also requires a destruction operation, recorded method and hashed destruction evidence.

This gate controls AssetFlow's release decision only. It does not turn the browser into an erasure engine and does not by itself prove that an external tool's implementation is conformant.

## Safe rollout order

1. Approve one wipe tool and one diagnostic tool for a named workstation.
2. Create a sanitisation policy and workstation record in AssetFlow.
3. Run synthetic media first; attach the raw report and record the preflight states.
4. Pilot the diagnostic profile on known-good and known-bad devices.
5. Only then build a local-agent adapter or enterprise connector, with least-privilege credentials and an external run ID on every execution.
6. Do not market a certificate as NIST, Blancco, DoD, GDPR or HIPAA compliant merely because a record exists in AssetFlow; retain the underlying tool evidence and have the applicable policy reviewed.
