# postmarketOS MSM8909 — reproducible build report

A record of building a generic postmarketOS image for the Qualcomm MSM8909
SoC family (the pilot HTC Desire 530's chipset), so the result is auditable and
reproducible. It also states clearly what has and has **not** been verified.

## What was built

A postmarketOS disk image for the generic `qcom-msm8909` port.

| Property | Value |
|---|---|
| Image | `qcom-msm8909.img` |
| Type | DOS/MBR disk image, 2 partitions |
| Size | 741 MB |
| sha256 | `3b1074e4e4342dc98398c7b99768be24d4f41f75ade7ef60d8a82df459754dc1` |
| Partition 1 | boot, 487 MB, Linux (ID 0x83) |
| Partition 2 | root, 253 MB, Linux (ID 0x83) |
| Boot artifacts | `vmlinuz` (kernel), `initramfs`, `dtbs` (device-tree blobs) |

> The checksum is specific to this build (timestamps/keys make images not
> bit-identical between runs); treat it as evidence this build produced a
> structurally complete image, not as a value to diff against future builds.

## Environment

- Windows 10 host, **WSL2 Ubuntu** (no reboot required to enable; WSL2 was
  already present).
- `pmbootstrap` **3.12.1**, installed from
  `https://gitlab.postmarketos.org/postmarketOS/pmbootstrap.git` (all PyPI
  releases are yanked — the git checkout is the supported install).
- Runs as a non-root user with passwordless sudo (pmbootstrap refuses root).
- Host packages: `git python3 kpartx android-tools-fsutils openssl`.

## Exact recipe

```sh
# 1. toolchain
git clone https://gitlab.postmarketos.org/postmarketOS/pmbootstrap.git
# 2. pmaports (device tree) — this build used commit fa1fa51 (2026-11-25)
git clone https://gitlab.postmarketos.org/postmarketOS/pmaports.git \
    ~/.local/var/pmbootstrap/cache_git/pmaports
# 3. config: ~/.config/pmbootstrap_v3.cfg
#    [pmbootstrap]
#    device = qcom-msm8909
#    ui = none
# 4. build the image (dummy password automates the install)
./pmbootstrap.py -y install --password <dummy>
# 5. export kernel/initramfs/dtbs alongside the image
./pmbootstrap.py export /tmp/pmex
```

Build time was ~6 minutes: most armv7 packages were pulled prebuilt from the
postmarketOS mirror rather than compiled locally.

## Verified vs NOT verified (read this)

**Verified**
- The generic `qcom-msm8909` port exists in current pmaports
  (`device/testing/device-qcom-msm8909`, `testing` maturity).
- The build completes and produces a structurally valid disk image with a
  kernel, initramfs and device-tree blobs.

**NOT verified**
- That the image **boots** on real hardware. A completed build is an artifact,
  not a running OS.
- Any specific device. `qcom-msm8909` is a *generic* armv7 port for
  MSM8905/8909/8916 devices; there is **no** Desire 530-specific port, so this
  is not a turn-key Desire 530 flash.
- `testing` is experimental and may regress without notice.

## Next step (hardware-gated)

Boot-test on an **authorised, bootloader-unlockable** MSM8909 device. This does
**not** include the pilot HTC Desire 530, which is FRP/account-locked, on
refurbishment hold, and must not have any lock bypassed. Ownership clearance and
bootloader-unlock support are prerequisites before any flashing.
