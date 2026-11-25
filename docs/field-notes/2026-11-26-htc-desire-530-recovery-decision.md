# HTC Desire 530: recovery decision and bench handoff
**Date:** 26 November 2026 AEDT. **Disposition:** HOLD / ownership release required. No device recovered or flashed.

## New evidence since 25 November
The operator reached HTCDev's official workflow and confirmed USB Fastboot communication. The handset returned the following (serial deliberately omitted):
```text
fastboot oem get_identifier_token
[KillSwitch] Last Byte is 0X00, disable unlock
[KillSwitch] oem unlock Turn Off!
OKAY
```
No identifier token was returned. OKAY acknowledges command completion, not unlock success. This proves the OEM-unlock permission is disabled; the prior account-lock observation is operator-reported. Exact variant, bootloader state, firmware build, carrier, ownership documentation and full hardware health have not been independently verified. Model 2PST1 / a16ul remains provisional pending private label verification.

## Ranked actions
1. **Supplier/owner release**: record provenance and transfer authority privately; ask the supplier to arrange the previous owner's private sign-in or Google account recovery. Do not collect their password or copy personal data. After authorised access, remove all accounts through Settings; confirm transfer consent and perform HTC's documented reset. Validate clean setup.
2. **HTC Australia**: request a written decision on support for this legacy handset, accepted ownership/transfer evidence, authorised service process and quote. No public evidence found that a donation receipt alone qualifies. Use the official support portal; no contact has been submitted.
3. **Stock restoration**: not an FRP remedy. Only consider for a genuine firmware fault after ownership clearance and exact variant/carrier/ROM confirmation. The old HTC Desire RUU list on HTCDev is not for Desire 530. Do not install it. HTC itself warns that factory reset may not permanently erase all personal data.
4. **Alternative OS**: the existing 741 MB generic MSM8909 build is not a Desire 530 port or physical boot proof. Retain the build and use a separate authorised, compatible handset for the first boot test. This HTC remains blocked until account release and supported unlock eligibility are established. No lock-circumvention methods are included.
5. **Parts**: if no supported release is available within a proposed 14-day hold, assess screen, enclosure and other compatible non-storage components. Battery only if inspected and safe; maintain custody of the data-bearing board for approved sanitisation or destruction. Replacement board must be clean, legitimately sourced and variant-compatible. Compare cost against a known working device; proposed initial technician cap 30 minutes, spend cap A$20 before approval (planning limits, not market prices).

## Release acceptance
Document authority, successful clean setup, sanitisation evidence appropriate to the old device, charging/battery, touch/display, audio, Wi-Fi, cameras and stability. Android 6 is obsolete; no sensitive accounts or general-purpose secure smartphone recommendation without supported updates. For Australian cellular reuse obtain carrier confirmation of network and emergency-call compatibility after 3G closure; never test by calling 000. If cleared but unsuitable for cellular, consider offline clock, audio player or display; do not count as whole-device reuse until physically tested.

## Supplier workflow
Require donor account removal before reset, enterprise administrator release when applicable, clean setup verification and private transfer records. Track lock-related hold, release, parts and recycling yields separately. AMTA Project Phoenix demonstrates a practical Australian refurbishment pathway, not an FRP release scheme.

## Sources checked 26 November
- [HTCDev eligibility](https://www.htcdev.com/bootloader) — some models/operator variants cannot unlock.
- [HTC Australia support](https://www.htc.com/au/support/) — support entry point; service availability unverified.
- [HTC Desire 530 hard reset](https://www.htc.com/au/support/htc-desire-530/howto/763503.html) — reset and data-erasure caveat.
- [Google device protection](https://support.google.com/pixelphone/answer/6172890?hl=en-au) — general FRP mechanism, not model-specific service policy.
- [Google old-device reset](https://support.google.com/accounts/answer/17299872) — remove accounts before reset.
- [AOSP verified boot device state](https://source.android.com/docs/security/features/verifiedboot/device-state) — distinct bootloader trust state.
- [postmarketOS testing ports](https://gitlab.com/postmarketOS/pmaports/-/tree/master/device/testing) — generic MSM8909 port.
- [AMTA 3G closure](https://amta.org.au/for-consumers/3g-closure/) — network and emergency-call suitability.
- [AMTA Project Phoenix](https://amta.org.au/latest-news/reviving-underutilised-phones-through-refurbishment-pilot-outcomes/) — industry refurbishment evidence.
- [Productivity Commission right to repair](https://www.pc.gov.au/inquiries-and-research/repair/report/) — repair and reuse policy recommendations, not a release entitlement.

## Existing repository research
This is a device-specific addendum to [FRP ownership transfer](../FRP-OWNERSHIP-TRANSFER-AND-MOBILE-REUSE-2026-11-25.md), [MSM8909 build](../POSTMARKETOS-MSM8909-BUILD.md) and [legacy compatibility](../LEGACY-DEVICE-COMPATIBILITY-DB.md). No duplicate OS build or software change. No private device identifiers published.
