# Practical Training Sheets

## SMART / storage
- identify drive model/serial;
- capture SMART before wipe if readable;
- flag reallocated/pending sectors, critical NVMe warnings, very high wear;
- sanitise with media-appropriate method;
- retest health before resale.

## MemTest86
- boot trusted USB;
- record version;
- run at least one complete pass for ordinary triage; extend for suspicious/intermittent faults;
- any error = do not retail as passed until faulty DIMM/system issue is resolved.

## Windows battery report
Run:
`powercfg /batteryreport`
Record design capacity, full-charge capacity, cycle count where available, and date. Calculate health as full-charge/design capacity.

## Windows activation
- identify edition;
- firmware OEM key may reactivate matching edition;
- do not transfer organisation volume-licence entitlement;
- final activation must be legitimate.

## BIOS / supervisor
- check BIOS setup;
- record admin/supervisor password state;
- check Absolute/Computrace status where exposed;
- do not bypass ownership/security controls using dubious methods.

## Apple Activation Lock
Owner removes Find My/Activation Lock legitimately. A device that presents unresolved Activation Lock is not a normal resale candidate.

## Android FRP
Ensure legitimate account/device protection is removed before reset/transfer. Do not ask for or retain donor passwords.

## Autopilot
At Windows OOBE, unexpected organisation-branded enrolment is a red flag. Supplier/client must remove device from their tenant/Autopilot registration.

## Chromebook enrolment
Powerwash/OOBE enterprise enrolment or forced organisation sign-in indicates managed status. Require legitimate deprovisioning.

## Sanitisation verification
Record:
- tool/version;
- media serial;
- method;
- success/failure;
- post-operation verification/log;
- exception.
A generated PDF alone is not proof if the underlying operation failed.
