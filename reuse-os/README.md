# ReuseOS — an operating system family for giving old devices a second life

One product family, several hardware-specific images, the same simple set of offline apps.
This is not an FRP, Activation Lock or bootloader-bypass tool: only owned or authorised,
appropriately released equipment is eligible.

## Status at a glance

Every claim below uses one of these levels, lowest to highest. A matching processor
architecture is **never** treated as support.

`not started` → `source written` → `compiled` → `boot-tested in a VM` → `physically verified`

| Component | Level | Evidence |
|---|---|---|
| PC edition, 64-bit (Debian 13), legacy BIOS | see [latest CI run](../../actions/workflows/reuse-os.yml) | QEMU boot with no disk and no network; in-image self-test must report apps and desktop |
| PC edition, 64-bit (Debian 13), UEFI | see latest CI run | QEMU + OVMF boot, same self-test |
| PC edition, 32-bit (Debian 12) | see latest CI run | QEMU i386 BIOS boot, same self-test |
| Ventoy USB | compatible by design (hybrid ISO); **not yet physically verified** | Copy the ISO onto an existing Ventoy USB |
| Any real computer | **not yet physically verified** | Record results with the assistant (below) |
| Android reuse app (APK) | compiled + unit-tested in CI; **not yet emulator- or device-tested** | [Android workflow](../../actions/workflows/android-reuse-app.yml) |
| Mobile OS editions (postmarketOS, Mobian, Ubuntu Touch, LineageOS) | not started — upstream paths catalogued only | [compatibility database](../data/reuseos-hardware-compatibility.csv) |
| Apple silicon (Asahi Linux) | not started | compatibility database |

## Try it on an old laptop (Ventoy)

1. Download `reuseos-amd64.iso` (or `reuseos-i386.iso` for 32-bit-only PCs) and `SHA256SUMS`
   from the [latest release](../../releases/latest).
2. Copy the ISO onto your Ventoy USB, either by hand or with the assistant, which verifies the
   checksum first and never erases anything:
   ```sh
   python3 tools/reuseos-assistant/reuseos_assistant.py ventoy reuseos-amd64.iso SHA256SUMS /media/$USER/Ventoy --confirm /media/$USER/Ventoy
   ```
3. Boot the laptop from USB (often F12, F9 or Esc at power-on; Option on Intel Macs), pick
   ReuseOS in the Ventoy menu. Secure Boot may need to be off on some models.
4. It runs entirely from the USB: nothing is installed and the internal drive is not touched.
5. Record what worked:
   ```sh
   python3 tools/reuseos-assistant/reuseos_assistant.py record --asset-tag DE-0001 --model "Dell Latitude E6440" --edition amd64 --boot-mode uefi --result "desktop, wifi, audio ok; suspend failed"
   ```

## Applications (the same set on every PC edition)

| Need | App |
|---|---|
| Home dashboard | ReuseOS Home (Firefox start page) |
| Clock, alarms, timers | GNOME Clocks |
| Calculator | Galculator |
| Music | Audacious |
| Audiobooks | Cozy (64-bit); Audacious on 32-bit |
| Offline library | Kiwix server + browser: Wikipedia, books and lessons from `.zim` files, no internet |
| Read PDFs and ebooks | Atril, Foliate |
| Write documents | AbiWord; LibreOffice Writer on 64-bit |
| Photo frame | `reuseos-photo-frame` full-screen slideshow |
| Videos | VLC |
| Web browser | Firefox ESR |
| Games | Solitaire, Mines, Sudoku |
| Hardware diagnostics | Hardware Check (read-only report incl. battery capacity), HardInfo, GSmartControl |
| Files | Thunar |

The Android app ([../android-reuse-app](../android-reuse-app)) provides the same core set for
phones that keep their original Android: clock, calculator, stopwatch, photo frame and
music/audiobooks.

## Build

On any x86-64 Linux host with Docker (this is exactly what CI runs):
```sh
docker run --rm --privileged -v "$PWD/reuse-os:/source:ro" -v "$PWD/out:/output" debian:trixie bash -ec '
  apt-get update && apt-get install -y live-build debootstrap xorriso squashfs-tools isolinux syslinux-common grub-pc-bin grub-efi-amd64-bin grub-efi-ia32-bin mtools dosfstools ca-certificates
  bash /source/build-pc.sh /output amd64'   # or i386
```
The 32-bit edition is Debian 12, because Debian 13 dropped 32-bit PC kernels; it is supported
for as long as Debian 12 LTS (to mid 2028).

## Tests

- **CI (`.github/workflows/reuse-os.yml`)**: builds both editions; boots amd64 under legacy
  BIOS and UEFI and i386 under BIOS in QEMU with no disk and no network. The image's
  `reuseos-selftest` service reports over serial: `REUSEOS_BOOT_OK`, `REUSEOS_APPS_OK`
  (every bundled app present), `REUSEOS_DESKTOP_OK` (XFCE session started),
  `REUSEOS_NETWORK=offline` and memory in use. Any missing marker fails the job. Images are
  published as a release only after every boot test passes.
- **Compatibility database**: `python3 scripts/validate_reuseos_compat.py`; tests in
  `scripts/test_validate_reuseos_compat.py` (rejects support claimed without evidence).
- **Installer assistant**: `tools/reuseos-assistant/test_reuseos_assistant.py` (checksum
  tampering, refusing non-Ventoy targets, exact confirmation, no personal data in records).
- **Android**: unit tests in `android-reuse-app/app/src/test`.

## Safety

- Live images only: no installer, no disk writes, no wipe, no flashing.
- `reuseos-check` and `reuseos-selftest` are read-only.
- The assistant's only write is copying a checksum-verified ISO onto a Ventoy data partition
  after you repeat the exact target path. It cannot erase or partition disks.
- Never attempt to bypass a locked bootloader, FRP or Activation Lock. Locked devices are
  listed as `blocked`; they can still use the Android reuse app on their original system.

## Next

1. Physically verify on at least three authorised PCs (legacy BIOS, UEFI, Intel Mac) and
   record each model in the compatibility database.
2. First mobile edition: PINE64 PinePhone with postmarketOS or Mobian (no locked bootloader).
3. Emulator-test the Android APK.
4. AssetFlow: the assistant writes an `assetflow-import.jsonl` file. Direct upload needs the
   AssetFlow API, which is not in this repository.
