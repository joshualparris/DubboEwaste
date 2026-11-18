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
> _Even archived, the code was kept honest. See **Changelog** below._

A portable Windows GUI to detect old iPads, check Apple drivers, download official jailbreak IPA files, launch Sideloadly, and guide manual installation (via **EverPwnage** or **Phoenix**) without modifying the device automatically.

Designed for an **iPad 3 (2012) running iOS 9.3.6**, with an unidentified former Apple Account and **Find My iPad ON**.

## Changelog

- **v2 (2026-11-18)**
  - **Readiness summary + action gating.** A `Scan` now reports a `score/5` of prerequisites met and **disables the IPA download, Sideloadly and Phoenix buttons until a real `iPad3,x` on iOS 9.3.6 is detected** (an *Advanced* checkbox overrides this at your own risk).
  - **Phoenix path** added alongside EverPwnage (guide + official download site), since Phoenix is the other tool supporting iPad 3 / 9.3.6.
  - **Get device-info helper** button: finds an existing `ideviceinfo` (3uTools, iMazing, MSYS2, scoop, chocolatey) or guides you to a trusted source. It **never silently downloads or runs a third-party binary**; an advanced `IPADLEGACY_HELPER_REPO` env var documents an opt-in path.
  - **IPA integrity check**: the SHA-256 is compared to the hash GitHub publishes for the asset (when present) and the download is refused on mismatch; otherwise you are told to compare it yourself.
  - **Resilient GitHub calls**: clear messages for rate-limit (HTTP 403) and offline instead of raw errors.
  - **Headless mode** (`-Scan`): runs the diagnostic with no GUI, prints and saves a report — used by CI and scripting.
  - Auto session logging to `%LOCALAPPDATA%\iPadLegacyAssistant`, HiDPI-aware UI, accessible control names, and Pester unit tests.
- **v1.1 (2026-11-18)** broadened `ideviceinfo` discovery and made the IPA download tolerate zero/multiple `.ipa` assets.

## Run

1. Download the app and launcher from this folder; keep both files together. Alternatively download the Windows ZIP from the successful GitHub Actions workflow.
2. Double-click Launch-iPad-Legacy-Assistant.cmd. Windows PowerShell 5.1 and WinForms are already included in Windows 10 and 11.
3. Connect the iPad using a working USB cable. Unlock and tap **Trust** on the iPad if prompted.
4. Select **Scan connected iPad** to check USB, Apple Mobile Device Service, iTunes and Sideloadly, and to compute a **readiness score**. If a helper (`ideviceinfo`) is found it reads the exact model and iOS and names the iPad 3/4 variant; otherwise it says so plainly. Use **Get device-info helper** if you want that detail and have no helper yet.
5. Once a supported device (`iPad3,x` on iOS 9.3.6) is confirmed, the prep buttons unlock. Select **Download EverPwnage IPA** (or use the **Phoenix** buttons). The app asks permission, then downloads the latest official EverPwnage IPA from GitHub, validating source URL, file size, ZIP signature, and the publisher SHA-256; multiple assets -> largest (all logged), none -> pick manually.
6. Select **Open Sideloadly**. If absent it opens https://sideloadly.io/. Follow the EverPwnage or Phoenix guide and drag the IPA from the downloads folder into Sideloadly. Sign with **your own Apple Account** directly in Sideloadly.
7. On-device app trust, IPA installation, jailbreak action and verification remain **manual**. Perform them only if you are authorised to alter the device.

### Headless use

Run `powershell -ExecutionPolicy Bypass -File .\iPadLegacyAssistant.ps1 -Scan` to print and save a privacy-safe diagnostic report with no window — handy for scripting and used by CI.

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

Windows CI runs the syntax/safety smoke test, a headless `-Scan` self-check, and (non-blocking) Pester unit tests, then packages a ZIP artifact. These checks **do not** prove the app was run against the physical iPad or that a jailbreak succeeded.

## Official sources

- https://github.com/LukeZGD/EverPwnage/releases
- https://ios.cfw.guide/installing-everpwnage/
- https://phoenixpwn.com/ and https://ios.cfw.guide/installing-phoenix/
- https://libimobiledevice.org/
- https://sideloadly.io/
- https://support.apple.com/en-au/108934
