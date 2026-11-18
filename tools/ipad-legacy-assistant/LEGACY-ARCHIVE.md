# iPad Legacy Assistant (Windows) — ARCHIVED

> **Status: archived as a historical idea — not a recommended tool.**
> This was an experiment in repurposing an iPad 3 (iOS 9.3.6) handed over with an
> unknown ownership history. It is kept for the record, not for active use.
>
> **Why it's archived:** the device still has **Activation Lock / Find My ON** under
> the previous owner's Apple Account. A jailbreak cannot change that, so even if every
> step here succeeds you get a modded-but-never-safely-resettable iPad, not a reborn
> device. The honest ceiling made the whole approach low-value, and the unverified
> ownership makes it something to think twice about. Left here as a documented dead end.
>
> _Last patch (2026-11-18): broadened model/iOS detection to find `ideviceinfo` from
> common toolkits (libimobiledevice, 3uTools, scoop, chocolatey) and made the IPA
> download tolerate releases with zero or multiple `.ipa` assets instead of crashing._

A portable Windows GUI to detect old iPads, check Apple drivers, download official jailbreak IPA files, launch Sideloadly, and guide manual installation without modifying the device automatically.

Designed for an **iPad 3 (2012) running iOS 9.3.6**, with an unidentified former Apple Account and **Find My iPad ON**.

## Run

1. Download the app and launcher from this folder; keep both files together. Alternatively download the Windows ZIP from the successful GitHub Actions workflow.
2. Double-click Launch-iPad-Legacy-Assistant.cmd. Windows PowerShell 5.1 and WinForms are already included in Windows 10 and 11.
3. Connect the iPad using a working USB cable. Unlock and tap **Trust** on the iPad if prompted.
4. Select **Scan connected iPad** to check USB, Apple Mobile Device Service, iTunes and Sideloadly. If a helper (`ideviceinfo` from libimobiledevice/3uTools, found on PATH or in common install locations) is present it also reads the exact model and iOS version and names the iPad 3/4 variant; otherwise it says so plainly instead of showing a bare "Unknown".
5. Select **Download official IPA**. The app asks permission before downloading the latest official EverPwnage IPA from GitHub. It validates source URL, expected file size, ZIP signature and computes SHA-256. If the release has several `.ipa` assets it picks the largest and logs all of them; if it has none it tells you to pick manually from the releases page.
6. Select **Open Sideloadly**. If absent it opens https://sideloadly.io/ so you can install it. Follow https://ios.cfw.guide/installing-everpwnage/ and drag the IPA from the downloads folder into Sideloadly. Sign with **your own Apple Account** directly in Sideloadly.
7. On-device app trust, IPA installation, jailbreak action and verification remain **manual**. Perform them only if you are authorised to alter the device.

## Important limitations and safeguards

- **No Activation Lock bypass**. Jailbreaking will not remove the original owner's Apple Account or Find My.
- **No erase/restore/update**. Do not erase the iPad while Find My is on; it might become unusable after activation.
- **No user-data access**. The app never browses or backs up the previous owner's photos, messages, contacts, account names, serial number or files.
- No passwords are collected or stored. IPA downloads live in %LOCALAPPDATA%\iPadLegacyAssistant\Downloads.
- The application does not install a jailbreak automatically. Sideloadly provides no documented stable command-line interface for this workflow.
- The iPad's unknown ownership history means permission to change it is unverified. Physical possession alone isn't proof of ownership.
- Jailbreaking an obsolete iPad may expose it to instability, boot problems and additional security risks.
- Sideloadly on Windows currently requires **web-installed** iTunes and iCloud, not Microsoft Store versions. See the official Sideloadly site.

## Testing

Windows CI runs the PowerShell syntax and safety smoke tests and packages a ZIP artifact. These checks **do not** prove that the app was run against the physical iPad or that a jailbreak succeeded.

## Official sources

- https://github.com/LukeZGD/EverPwnage/releases
- https://ios.cfw.guide/installing-everpwnage/
- https://sideloadly.io/
- https://support.apple.com/en-au/108934
