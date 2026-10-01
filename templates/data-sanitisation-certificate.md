# Data sanitisation certificate

**Status:** operational record template. This is not a claim of third-party certification or accreditation.

**Certificate / job number:** ____________________  
**Client / organisation:** ____________________  
**ABN (if applicable):** ____________________  
**Authorised contact:** ____________________  
**Date:** ____________________

## Asset and media record

| Asset ID | Device | Device serial / IMEI | Media type | Media serial | Capacity | Data instruction / classification |
|---|---|---|---|---|---:|---|

## Sanitisation record

| Asset ID | Policy / standard referenced | Method / command | Tool + version | Started | Completed | Verification / validation | Result |
|---|---|---|---|---|---|---|---|

Result values:
- **PASS** — the selected sanitisation process and verification completed successfully.
- **FAIL** — sanitisation could not be completed or verified; media must not proceed to reuse/resale.
- **DESTROY** — media escalated to an approved physical-destruction pathway.

## Failure / exception record

Asset ID: ____________________  
Reason: ____________________________________________________________  
Action taken: ______________________________________________________  
Final disposition: __________________________________________________

## Technician declaration

I confirm that the sanitisation actions recorded above were performed and the recorded results are accurate to the best of my knowledge.

**Technician:** ____________________  
**Signature:** ____________________  
**Date:** ____________________

## Client-facing wording

Recommended language:

> **Documented media sanitisation / secure data erasure**

Do not describe this record as independent certification unless the business actually holds the relevant certification/accreditation.

## Reference framework

- NIST SP 800-88 Rev. 2: https://csrc.nist.gov/pubs/sp/800/88/r2/final
- ASD/ACSC ISM media guidance: https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/ism/cyber-security-guidelines/guidelines-for-media
- Apple platform erasure guidance where applicable: https://support.apple.com/en-au/guide/deployment/dep0a819891e/web

The exact technique must match the media/device and the client's risk requirements. A failed sanitisation must not be silently treated as a pass.
