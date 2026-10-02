# Intake and Data Paperwork Pack

Use existing templates in `/templates`; this file defines the canonical pack and missing fields.

## Intake record
Required:
- intake ID;
- date/time;
- source type/name;
- supplier contact;
- transfer basis (donation/purchase/collection/consignment);
- declaration that supplier owns or is authorised to transfer;
- serial/service tag/IMEI;
- make/model/category;
- accessories;
- photos at intake;
- visible condition;
- battery hazard screen;
- data-bearing yes/no;
- lock/MDM state;
- chosen initial route;
- operator signature.

## Business fleet authority
For organisations:
- legal entity;
- authorised contact + role;
- statement that the organisation owns/controls the assets;
- permission to erase data;
- permission to refurbish/resell/recycle as agreed;
- asset list attachment;
- exceptions/retention requirements.

## Data-bearing chain of custody
Status values:
1. UNWIPED — RESTRICTED
2. SANITISATION IN PROGRESS
3. VERIFIED CLEARED
4. SANITISATION FAILED — DESTRUCTION/DOWNSTREAM
5. NON-DATA-BEARING

Record every custody/location change for client fleets.

## Sanitisation record
- asset ID + drive serial;
- media type/interface;
- sanitisation method;
- tool + version;
- start/end;
- result;
- verification method/result;
- operator;
- log/report hash/path where used;
- exception/failure;
- final media disposition.

## Rejection record
Use `templates/triage-reject-log.csv`.
Reasons are controlled by `data/reject-reasons.csv`.

## Sale/recall record
Use `templates/sale-and-recall-record.md`; link sold serial to intake ID, repair parts and buyer contact.

## Retention
Follow `docs/DOCUMENT-RETENTION-POLICY.md` once created. Until legal retention periods are confirmed, do not destroy provenance, sanitisation, downstream or sale records.
