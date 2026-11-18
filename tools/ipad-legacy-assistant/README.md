# Universal Device Recovery Toolkit (Windows)

Portable **Windows PowerShell 5.1 + WinForms** toolkit for read-only assessment and responsible reuse of old Apple, Android, Windows and Mac devices. No additional runtime is required for the Windows GUI.

The original **iPad Legacy Assistant** remains available as a separate, manual tool for owner-authorised iOS devices. This project is part of DubboEwaste's reuse-first electronics program.

## Download and launch

1. Open a successful **Device Recovery Toolkit - Windows checks** GitHub Actions run and download the **Universal-Device-Recovery-Toolkit-Windows** artifact. Extract all files together.
2. On Windows 10 or 11, double-click **Start-Device-Recovery-Toolkit.cmd**.
3. Leave authorisation as **Unknown / unverified** unless you can establish that you own the device or have permission to change it.
4. Click **Scan connected hardware** and review Devices and Battery & health.
5. Generate reuse recommendations, or save a **privacy-safe JSON/TXT** report. You can scan even when modification is not authorised.

## What works

| Feature | Current level |
| --- | --- |
| Apple USB connection / driver check | Windows PnP interfaces, optional Apple Mobile Device Service and tools |
| Apple model and iOS | Read-only ideviceinfo keys if installed and trusted; otherwise Unknown |
| Android USB detection | Windows USB metadata; optional ADB device list, authorised getprop, battery charge |
| Windows PC inventory | Host Windows OS, architecture, physical disk count, battery charge if reported |
| macOS diagnostic helper | Run sh DeviceRecovery-Mac.sh directly **on a Mac** to read model, OS, battery cycles, condition and charge when available |
| Battery health | Explicitly **not measurable** in ordinary Windows / iPad / Android scans; charge % is shown separately |
| Multi-device dashboard | Displays USB interfaces and available ADB sessions; USB entries are **not** proven to be unique physical devices |
| Activation Lock | Explains limitations and links to Apple's official ownership verification process; does not test or bypass the lock |
| Jailbreak / older iOS app preparation | Owner-authorised button opens the separate iPad Legacy Assistant and Sideloadly site; installation is manual |
| Firmware | Safety guidance, no unsigned firmware claims and no restore/flash controls |
| Repurposing assistant | Device- and version-aware offline reader, media, gaming, home dashboard and light-work suggestions |
| Reports | Explicitly selected local JSON / TXT export of minimal diagnostic metadata |

**Android requirement:** The ADB executable must already be available on PATH or in a standard Android SDK folder. USB debugging must be enabled and authorised on the device. [Android documentation](https://developer.android.com/tools/adb).

**Mac requirement:** Windows cannot read Mac internal battery and firmware details through an ordinary USB connection. Run the included shell helper locally on a Mac **you own or are authorised to inspect**.

## Privacy, authorisation and safety

- With ownership **Unknown / unverified** or **Organisation-managed**, buttons for jailbreak/app-install preparation remain disabled.
- Any software alteration requires explicit, valid permission. Having an iPad in hand does not establish ownership.
- USB device ID, serial, IMEI, Apple Account, photos, files, location and passwords are not collected into the report. USB PnP friendly names are intentionally omitted (they may contain a former owner's name).
- Windows scanning does not install drivers, enable ADB debugging, reboot, erase, update, flash, restore, back up or jailbreak anything.
- No Activation Lock bypass. The previous owner's Find My account is not removed.
- The tool **cannot** establish signed firmware status from local PnP data.
- External official sites are launched only after a button click, not silently.
- The original iPadLegacyAssistant.ps1 can download an IPA after explicit confirmation, but does not install or run it automatically. It is a separate owner-authorised workflow.
- The application has not been tested with the user's physical iPad or on a real Mac. Windows CI tests parsers, classifiers, gating, report privacy and packaging. Field tests remain necessary.

## Suggested safe workflow for the unknown-owner iPad 3 / iOS 9.3.6

1. **Keep the device un-erased** while Find My iPad is on.
2. Select **Unknown / unverified** and run USB diagnostic scans only.
3. Use [Apple's Activation Lock support process](https://support.apple.com/en-au/108934) if acceptable proof of purchase can be provided.
4. Do not access or transfer the previous owner's content, and do not use a jailbreak as an Activation Lock workaround.
5. If ownership is legitimately established, use the **Owned and authorised** setting and follow documented legacy software preparation if desired.

## Tests and future field validation

PowerShell smoke tests are in tests/Smoke.Tests.ps1 (legacy) and tests/Universal.Tests.ps1 (new). CI runs on windows-latest, then produces a portable ZIP artifact.

Remaining limitations include USB-interface deduplication, deeper device-specific battery metrics (which require dedicated drivers/platform support and permission), Android manufacturer firmware mapping, real Mac and iOS field testing, and a true cross-device remote enrolment workflow. These are **not** claimed as working.

## Sources

- [Apple Activation Lock support](https://support.apple.com/en-au/108934)
- [Android ADB documentation](https://developer.android.com/tools/adb)
- [Windows PnP documentation](https://learn.microsoft.com/en-us/powershell/module/pnpdevice/get-pnpdevice)
- [Windows battery WMI](https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-battery)
- [EverPwnage releases](https://github.com/LukeZGD/EverPwnage/releases)
- [Sideloadly](https://sideloadly.io/)
