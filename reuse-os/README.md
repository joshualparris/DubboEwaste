# ReuseOS — universal reuse operating system

One product family, multiple hardware-specific boot images. This is not an FRP or activation-lock recovery tool. Only owned/authorised and appropriately released equipment is eligible for installation.

## v0.1: x86-64 PC live image

The Debian 13 (trixie) builder produces a hybrid ISO with XFCE, browser, word processor, image viewer, media player, and read-only hardware inventory command `reuseos-check`. It uses upstream Linux drivers and standard Debian packages. No automated installer, persistence, wipe or flashing is configured. Live boot is not a forensic write blocker; disconnect sensitive media when practical and never open prior-owner files.

Build on a disposable Debian 13 x86-64 VM with networking, sufficient storage and root:
```sh
sudo apt update
sudo apt install live-build debootstrap xorriso squashfs-tools isolinux syslinux-common grub-pc-bin grub-efi-amd64-bin mtools
sudo bash reuse-os/build-pc.sh "$PWD/reuseos-output"
```
Verify SHA256SUMS, boot in a VM without a disk first, then copy the ISO to an existing Ventoy USB and test on authorised hardware. No existing drive should be erased or installed to as part of this test.

## Compatibility tracks

| Target | Plan | Status |
|---|---|---|
| Intel/AMD 64-bit laptops, desktops, mini PCs | Debian live ISO | Builder source; require successful ISO build and boot tests |
| Intel Macs | Same ISO where external boot is supported | Hardware-specific tests required |
| 32-bit PCs | Evaluate maintained lightweight i386 option | Not implemented |
| ARM64 PCs and SBCs | Board-specific Debian images | Not implemented |
| Android phones/tablets | Upstream postmarketOS ports with supported bootloaders; use the existing Android Reuse APK where appropriate | No mobile image yet |
| Apple silicon | Supported Asahi Linux devices, model-specific procedure | Not implemented |
| iPhones/iPads | No general-purpose supported Linux installation path established | Unsupported |
| Locked Huawei AMN-LX2 | Bootloader and FRP active; no supported boot path demonstrated | Blocked; do not attempt flashing |

## Release gates

1. Build succeeds and ISO checksum is generated.
2. QEMU boots with no attached writable hard disk and records REUSEOS_BOOT_OK.
3. Test at least three authorised real PCs: legacy BIOS, UEFI, and Intel Mac if available. Record network, audio, display, battery, suspend and storage detection.
4. Verify software maintenance and security updates before distribution. Test installed-use workflows separately; live ISO is not an installer.
5. Select the first explicitly supported postmarketOS model with a legitimately unlockable bootloader; verify display, touch, Wi-Fi, charging and suspend before calling it usable.

Sources: [Debian Live Manual](https://live-team.pages.debian.net/live-manual/html/live-manual.en.html), [postmarketOS devices](https://wiki.postmarketos.org/wiki/Devices), [Asahi Linux](https://asahilinux.org/), [existing Android app](../android-reuse-app/README.md).

The shared goal is consistent offline usability and hardware longevity, not identical firmware across incompatible hardware. The current code has not yet demonstrated a bootable ISO or any device installation.
