#!/usr/bin/env bash
# ReuseOS: build a Debian live image for authorised PCs.
#
#   sudo bash reuse-os/build-pc.sh OUTPUT_DIR [amd64|i386]
#
# amd64  Debian 13 (trixie). Hybrid ISO: boots legacy BIOS and UEFI, from USB, CD or Ventoy.
# i386   Debian 12 (bookworm). Debian 13 has no 32-bit PC kernel, so the 32-bit edition
#        follows Debian 12 and its LTS support (to mid 2028). Legacy BIOS boot.
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
arch=${2:-amd64}
case "$arch" in
  amd64) dist=trixie;   kernel=linux-image-amd64; extra_pkgs="libreoffice-writer" ;;
  i386)  dist=bookworm; kernel=linux-image-686;   extra_pkgs="" ;;
  *) echo "Unknown architecture '$arch' (use amd64 or i386)" >&2; exit 1 ;;
esac
if [[ $(id -u) != 0 ]]; then echo "Run as root on a Debian build host or container." >&2; exit 1; fi
if [[ $(uname -m) != x86_64 ]]; then echo "Build on an x86-64 host." >&2; exit 1; fi
for tool in lb sha256sum; do command -v "$tool" >/dev/null || { echo "Missing $tool (install live-build)" >&2; exit 1; }; done
out=$(realpath -m "${1:-./reuseos-output}")
mkdir -p "$out"
work=$(mktemp -d)
echo "Building ReuseOS $arch ($dist) in $work"
cd "$work"
lb config --distribution "$dist" --architectures "$arch" --binary-images iso-hybrid \
  --archive-areas "main contrib non-free-firmware" --debian-installer none \
  --iso-application "ReuseOS" --iso-volume "ReuseOS $arch" --iso-publisher "DubboEwaste ReuseOS" \
  --bootappend-live "boot=live components nopersistence noswap hostname=reuseos username=reuse locales=en_AU.UTF-8 keyboard-layouts=us console=tty0 console=ttyS0,115200n8"
mkdir -p config/package-lists config/includes.chroot config/hooks/normal

# One app set for every PC edition: see reuse-os/README.md "Applications".
cat > config/package-lists/reuseos.list.chroot <<PACKAGES
live-boot
live-config
live-config-systemd
$kernel
task-xfce-desktop
firefox-esr
gnome-clocks
galculator
audacious
cozy
atril
foliate
abiword
mousepad
ristretto
feh
zenity
vlc
kiwix-tools
aisleriot
gnome-mines
gnome-sudoku
hardinfo2
gsmartcontrol
pciutils
usbutils
smartmontools
nvme-cli
memtester
stress-ng
firmware-linux-free
firmware-iwlwifi
firmware-realtek
firmware-atheros
firmware-amd-graphics
firmware-misc-nonfree
$extra_pkgs
PACKAGES
# Debian 12 has hardinfo instead of hardinfo2 and no cozy (Audacious plays audiobooks there).
if [[ $dist == bookworm ]]; then sed -i -e 's/^hardinfo2$/hardinfo/' -e '/^cozy$/d' config/package-lists/reuseos.list.chroot; fi

# Shared files: launchers, dashboard, browser start page, self-test.
cp -a "$here/overlay/." config/includes.chroot/
install -D -m 0755 "$here/reuseos-check" config/includes.chroot/usr/local/bin/reuseos-check
cat > config/hooks/normal/9000-reuseos.hook.chroot <<'HOOK'
#!/bin/sh
set -e
systemctl enable reuseos-selftest.service
# Desktop launchers in the live user's home must be marked trusted to open with one click.
chmod 0755 /etc/skel/Desktop/*.desktop
HOOK
chmod 0755 config/hooks/normal/9000-reuseos.hook.chroot

lb build
iso=$(ls live-image-*.hybrid.iso)
test -s "$iso"
cp "$iso" "$out/reuseos-$arch.iso"
(cd "$out"; sha256sum "reuseos-$arch.iso" > "SHA256SUMS-$arch"; sha256sum -c "SHA256SUMS-$arch")
echo "ISO and checksum: $out/reuseos-$arch.iso"
