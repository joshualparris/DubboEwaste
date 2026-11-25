#!/usr/bin/env python3
"""ReuseOS installation assistant (Windows and Linux, Python 3.9+, standard library only).

Companion to the Universal Device Recovery Toolkit (tools/ipad-legacy-assistant). It:
  detect     list connected storage, USB and Android (adb) devices, read-only
  check      look a device up in data/reuseos-hardware-compatibility.csv and explain status
  fetch      download a ReuseOS image and its SHA256SUMS from a GitHub release, then verify
  verify     verify an image against a SHA256SUMS file
  ventoy     copy a verified image onto an existing Ventoy USB (non-destructive: no erasing)
  record     append a privacy-safe install/diagnostic result to an AssetFlow import file (JSONL)

It never erases, partitions, flashes or unlocks anything. Writing an ISO to a Ventoy USB only
adds one file to its data partition, after the user confirms the exact target.
"""
import argparse, csv, hashlib, json, os, platform, shutil, subprocess, sys, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DB = ROOT / "data" / "reuseos-hardware-compatibility.csv"
REPO = "joshualparris/DubboEwaste"
EDITIONS = {"amd64": "reuseos-amd64.iso", "i386": "reuseos-i386.iso"}
STATUS_TEXT = {
    "not-started": "An upstream install path exists, but ReuseOS has not been built or tested for it yet.",
    "source-written": "ReuseOS code exists for this hardware but has not yet been built and tested.",
    "compiled": "ReuseOS builds for this hardware but has not been boot-tested.",
    "boot-tested-vm": "ReuseOS boots in a virtual machine. Real hardware of this type still needs testing.",
    "physically-verified": "ReuseOS has been tested on this exact model.",
    "unsupported": "There is no supported way to run ReuseOS on this hardware.",
    "blocked": "Replacing the operating system is blocked (for example a locked bootloader). Do not attempt to bypass it.",
}


def run(cmd):
    try:
        return subprocess.run(cmd, capture_output=True, text=True, timeout=20).stdout
    except (OSError, subprocess.SubprocessError):
        return ""


# ---------------------------------------------------------------- detect
def detect():
    out = {"host": {"os": platform.system(), "release": platform.release(), "machine": platform.machine()},
           "storage": [], "usb": [], "android": []}
    if platform.system() == "Linux":
        data = run(["lsblk", "-J", "-d", "-o", "NAME,SIZE,TYPE,TRAN,RM,RO,MODEL"])
        if data:
            for d in json.loads(data).get("blockdevices", []):
                if d.get("type") == "disk":
                    out["storage"].append({"device": "/dev/" + d["name"], "size": d.get("size"), "bus": d.get("tran"),
                                           "removable": d.get("rm") in (True, "1", 1), "model": (d.get("model") or "").strip()})
        out["usb"] = [line.split(" ", 6)[-1] for line in run(["lsusb"]).splitlines() if line]
    elif platform.system() == "Windows":
        ps = ("Get-Disk | Select-Object Number,FriendlyName,BusType,Size,IsSystem,IsBoot | ConvertTo-Json -Compress")
        data = run(["powershell", "-NoProfile", "-Command", ps])
        if data.strip():
            disks = json.loads(data); disks = disks if isinstance(disks, list) else [disks]
            for d in disks:
                out["storage"].append({"device": f"Disk {d['Number']}", "size": d.get("Size"), "bus": d.get("BusType"),
                                       "removable": d.get("BusType") == "USB" and not d.get("IsSystem"), "model": d.get("FriendlyName")})
    adb = shutil.which("adb")
    if adb:
        for line in run([adb, "devices", "-l"]).splitlines()[1:]:
            parts = line.split()
            if len(parts) >= 2:
                model = next((p.split(":", 1)[1] for p in parts if p.startswith("model:")), "unknown")
                out["android"].append({"state": parts[1], "model": model})  # serial deliberately omitted
    return out


# ---------------------------------------------------------------- check
def load_db(path=DB):
    return list(csv.DictReader(Path(path).open(newline="", encoding="utf-8")))


def check(term, rows=None):
    rows = rows if rows is not None else load_db()
    t = term.lower()
    return [r for r in rows if t in r["family_or_model"].lower() or t in r["id"].lower() or t in r["category"].lower()]


def explain(row):
    return (f"{row['family_or_model']} [{row['architecture']}]\n"
            f"  Status: {row['reuseos_status']} - {STATUS_TEXT.get(row['reuseos_status'], '')}\n"
            f"  Edition: {row['reuseos_edition']}\n  How: {row['install_path']}\n"
            f"  Bootloader: {row['bootloader_requirement'] or '-'}\n  Before you start: {row['prerequisites'] or '-'}\n"
            f"  Notes: {row['notes'] or '-'}\n  Source: {row['source_url'] or '-'}")


# ---------------------------------------------------------------- images
def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def verify(image, sums):
    name = Path(image).name
    for line in Path(sums).read_text().splitlines():
        parts = line.split()
        if len(parts) == 2 and parts[1].lstrip("*") == name:
            actual = sha256(image)
            return actual == parts[0].lower(), parts[0].lower(), actual
    raise ValueError(f"{name} is not listed in {sums}")


def fetch(edition, dest, tag="latest"):
    if edition not in EDITIONS:
        raise ValueError(f"Unknown edition {edition}; choose from {', '.join(EDITIONS)}")
    base = (f"https://github.com/{REPO}/releases/latest/download" if tag == "latest"
            else f"https://github.com/{REPO}/releases/download/{tag}")
    dest = Path(dest); dest.mkdir(parents=True, exist_ok=True)
    for name in ("SHA256SUMS", EDITIONS[edition]):
        print(f"Downloading {name} ...", file=sys.stderr)
        urllib.request.urlretrieve(f"{base}/{name}", dest / name)
    ok, expected, actual = verify(dest / EDITIONS[edition], dest / "SHA256SUMS")
    if not ok:
        (dest / EDITIONS[edition]).unlink()
        raise ValueError(f"Checksum mismatch (expected {expected}, got {actual}); the download was deleted.")
    return dest / EDITIONS[edition]


# ---------------------------------------------------------------- ventoy
def is_ventoy_partition(mount):
    """A Ventoy data partition is labelled 'Ventoy' and usually has a 'ventoy' config folder or ISO files."""
    mount = Path(mount)
    if not mount.is_dir():
        return False
    label_ok = mount.name.lower() == "ventoy"
    if platform.system() == "Windows":
        label = run(["powershell", "-NoProfile", "-Command", f"(Get-Volume -DriveLetter '{str(mount)[0]}').FileSystemLabel"])
        label_ok = label.strip().lower() == "ventoy"
    return label_ok or (mount / "ventoy").is_dir()


def ventoy_copy(image, sums, mount, confirm):
    image, mount = Path(image), Path(mount)
    ok, *_ = verify(image, sums)
    if not ok:
        raise ValueError("Image failed checksum verification; nothing was copied.")
    if not is_ventoy_partition(mount):
        raise ValueError(f"{mount} does not look like a Ventoy USB (label 'Ventoy' or a 'ventoy' folder). Nothing was copied.")
    if confirm != str(mount):
        raise ValueError(f"Confirmation did not match. Re-run with --confirm \"{mount}\" to copy to that exact target.")
    free = shutil.disk_usage(mount).free
    if free < image.stat().st_size:
        raise ValueError(f"Not enough space on {mount}. Nothing was copied.")
    target = mount / image.name
    shutil.copyfile(image, target)
    if sha256(target) != sha256(image):
        target.unlink()
        raise ValueError("The copy on the USB did not match the verified image and was removed.")
    return target


# ---------------------------------------------------------------- record
def record(out_file, **fields):
    allowed = {"asset_tag", "device_category", "model", "edition", "result", "boot_mode", "notes", "tester"}
    bad = set(fields) - allowed
    if bad:
        raise ValueError(f"Not recorded: unsupported fields {sorted(bad)} (serials and personal data are excluded)")
    entry = {"recorded_at": datetime.now(timezone.utc).isoformat(timespec="seconds"), "source": "reuseos-assistant",
             "schema": "assetflow-import/v1", **{k: v for k, v in fields.items() if v}}
    with open(out_file, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
    return entry


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    s = p.add_subparsers(dest="cmd", required=True)
    s.add_parser("detect")
    c = s.add_parser("check"); c.add_argument("term")
    c = s.add_parser("fetch"); c.add_argument("--edition", default="amd64"); c.add_argument("--dest", default="reuseos-download"); c.add_argument("--tag", default="latest")
    c = s.add_parser("verify"); c.add_argument("image"); c.add_argument("sums")
    c = s.add_parser("ventoy"); c.add_argument("image"); c.add_argument("sums"); c.add_argument("mount")
    c.add_argument("--confirm", default="", help="repeat the exact Ventoy mount path to authorise the copy")
    c = s.add_parser("record"); c.add_argument("--out", default="assetflow-import.jsonl")
    for f in ("asset_tag", "device_category", "model", "edition", "result", "boot_mode", "notes", "tester"):
        c.add_argument("--" + f.replace("_", "-"), dest=f)
    a = p.parse_args(argv)
    try:
        if a.cmd == "detect":
            print(json.dumps(detect(), indent=2))
        elif a.cmd == "check":
            rows = check(a.term)
            print("\n\n".join(explain(r) for r in rows) if rows else
                  f"'{a.term}' is not in the compatibility database. Treat it as untested; do not assume it works because the processor type matches.")
        elif a.cmd == "fetch":
            print(f"Verified: {fetch(a.edition, a.dest, a.tag)}")
        elif a.cmd == "verify":
            ok, expected, actual = verify(a.image, a.sums)
            print("Checksum OK" if ok else f"MISMATCH expected {expected} got {actual}"); return 0 if ok else 1
        elif a.cmd == "ventoy":
            print(f"Copied and verified: {ventoy_copy(a.image, a.sums, a.mount, a.confirm)}\nBoot the old computer from this USB and choose the ReuseOS image in the Ventoy menu.")
        elif a.cmd == "record":
            print(json.dumps(record(a.out, **{k: getattr(a, k) for k in ("asset_tag", "device_category", "model", "edition", "result", "boot_mode", "notes", "tester")})))
    except (ValueError, OSError) as e:
        print(f"error: {e}", file=sys.stderr); return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
