# 05 — Cybersecurity baseline for Dubbo ITAD and AssetFlow

**Questions answered:** 16–18  
**Research date:** 6 October 2026

## 16. What cyber baseline is appropriate?

ASD's small-business guidance begins with:

1. MFA;
2. software updates;
3. backups;

and recommends moving toward **Essential Eight Maturity Level One**.

Sources:
- https://www.cyber.gov.au/business-government/small-business-cyber-security/small-business-hub/small-business-cyber-security-guide
- https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/essential-eight

The Essential Eight covers:

- application patching;
- OS patching;
- MFA;
- restricted admin privileges;
- application control;
- Office macro restrictions;
- user application hardening;
- regular backups.

ASD is consulting in 2026 on evolution toward a broader “Essentials” series, so the baseline should be versioned rather than hard-coded forever.

Source:
https://www.cyber.gov.au/about-us/view-all-content/news/consultation-on-evolution-of-essential-eight

### Phase 0 cyber minimum

For Dubbo ITAD:

- MFA on GitHub, Supabase, Vercel, Render, email and password manager;
- unique password-manager-generated credentials;
- no shared accounts;
- separate admin and daily-use accounts where practical;
- supported OS + prompt critical security updates;
- encrypted operator laptop/phone;
- screen lock;
- protected recovery codes;
- minimal local copies of customer data;
- tested backups of business configuration/data;
- secrets only in managed environment variables/secret stores;
- access removed immediately when volunteer/staff role ends;
- quarterly access review;
- incident-response contact sheet.

## 17. Privacy Act / NDB implications

A small business with turnover under $3m is **generally** outside APP coverage, but important exceptions apply. OAIC identifies examples including:

- health service providers;
- credit providers/credit reporting bodies;
- businesses trading in personal information;
- TFN recipients in relevant circumstances;
- related entities and other specified cases.

Sources:
- https://www.oaic.gov.au/privacy/notifiable-data-breaches/quick-reference-guide-for-responding-to-data-breaches
- https://www.oaic.gov.au/privacy/notifiable-data-breaches/preventing-preparing-for-and-responding-to-data-breaches/data-breach-preparation-and-response/part-4-notifiable-data-breach-ndb-scheme

### ITAD-specific point

Even if the operator's own small business is exempt from some APP obligations, a **customer contract** may impose substantially stronger confidentiality/security duties.

A health practice, school, government agency or law firm should not be told:

> “We're small so privacy law doesn't matter.”

The operational standard should assume that an unwiped business device contains sensitive information and protect it accordingly.

## 18. What are AssetFlow's current security gaps?

### Already evidenced in repo

The production app documents:

- Supabase Auth;
- PostgreSQL;
- Row Level Security;
- private routes;
- role/CRUD controls;
- server-side actions;
- audit/event records;
- private evidence/photo storage boundary;
- no live customer/device data in public GitHub.

Those are strong foundations.

### Repo-wide audit on 6 October found weak/absent evidence for

**MFA enforcement**
- No substantive repository evidence that MFA is required for AssetFlow operators.

**Production backup/restore test**
- `codexToDO.md` still explicitly leaves real backup/restore and retention testing open.

**Secrets/key rotation**
- Environment-variable separation exists conceptually, but no documented rotation cadence / compromise procedure was found.

**Session/access review**
- Roles exist, but no operational quarterly review/offboarding checklist was located.

**Security monitoring**
- Audit trail exists; no explicit alerting/monitoring threshold for suspicious auth/admin events was found.

**Incident tabletop**
- privacy incident procedures exist in research, but no evidence of a completed AssetFlow breach-response tabletop.

**Dependency/vulnerability process**
- CI builds/typechecks; no documented dependency-update/vulnerability remediation SLA was found.

## Recommended P0 security backlog

1. Enforce MFA for admin/manager accounts if supported by the chosen Supabase configuration.
2. Run and record one real production backup + restore test.
3. Write a secrets/key compromise rotation procedure.
4. Create joiner/mover/leaver access checklist.
5. Quarterly role/account audit.
6. Add dependency vulnerability review cadence.
7. Preserve authentication/admin events long enough for incident investigation.
8. Run a synthetic lost-phone/password-compromise/data-exposure tabletop.
9. Document customer-device-data incident escalation.
10. Reassess against ASD's evolving Essentials guidance annually.

## Important distinction

AssetFlow security and **device sanitisation security** are separate.

A secure database does not prove an SSD was wiped, and a perfect wipe process does not protect a leaked customer manifest.
