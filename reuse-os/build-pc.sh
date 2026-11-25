#!/usr/bin/env bash
# ReuseOS: build a Debian live image for authorised x86-64 PCs.
set -euo pipefail
if [[ $(id -u) != 0 ]]; then echo "Run as root on a Debian trixie build host." >&2; exit 1; fi
if [[ $(uname -m) != x86_64 ]]; then echo "This builder targets x86-64 only." >&2; exit 1; fi
for tool in lb sha256sum; do command -v "$tool" >/dev/null || { echo "Missing $tool (install live-build)" >&2; exit 1; }; done
out=$(realpath -m "${1:-./reuseos-output}")
mkdir -p "$out"
work=$(mktemp -d)
echo "Build directory: $work"
cd "$work"
lb config --distribution trixie --architectures amd64 --binary-images iso-hybrid --archive-areas "main contrib non-free-firmware" --debian-installer none --bootappend-live "boot=live components nopersistence noswap hostname=reuseos username=reuse console=tty0 console=ttyS0,115200n8"
mkdir -p config/package-lists config/includes.chroot/usr/local/bin config/includes.chroot/etc/systemd/system/multi-user.target.wants
cat > config/package-lists/reuseos.list.chroot <<'PACKAGES'
live-boot
live-config
linux-image-amd64
task-xfce-desktop
firefox-esr
mousepad
ristretto
vlc
libreoffice-writer
firmware-linux-free
firmware-iwlwifi
firmware-realtek
firmware-amd-graphics
pciutils
usbutils
smartmontools
nvme-cli
memtester
stress-ng
PACKAGES
cat > config/includes.chroot/usr/local/bin/reuseos-check <<'CHECK'
#!/bin/sh
set -eu
echo "ReuseOS read-only inventory — not proof of ownership, safety, or sanitisation"
uname -m
printf '\nCPU:\n'; lscpu | grep -E '^(Architecture|CPU\(s\)|Model name):' || true
printf '\nMemory:\n'; free -h
printf '\nStorage (no serials, no filesystem contents):\n'; lsblk -e 7 -o NAME,TYPE,SIZE,RO,TRAN
printf '\nPCI devices:\n'; lspci
printf '\nUSB devices:\n'; lsusb
printf '\nNo write, wipe or flash command was run. Review results privately.\n'
CHECK
chmod 0755 config/includes.chroot/usr/local/bin/reuseos-check
cat > config/includes.chroot/etc/systemd/system/reuseos-ready.service <<'SERVICE'
[Unit]
Description=ReuseOS live boot smoke-test marker
After=local-fs.target
[Service]
Type=oneshot
ExecStart=/bin/sh -c 'echo REUSEOS_BOOT_OK > /dev/ttyS0'
[Install]
WantedBy=multi-user.target
SERVICE
ln -s ../reuseos-ready.service config/includes.chroot/etc/systemd/system/multi-user.target.wants/reuseos-ready.service
lb build
test -s live-image-amd64.hybrid.iso
cp live-image-amd64.hybrid.iso "$out/reuseos-amd64.iso"
(cd "$out"; sha256sum reuseos-amd64.iso > SHA256SUMS; sha256sum -c SHA256SUMS)
echo "ISO and checksum: $out"
