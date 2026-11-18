#!/bin/sh
# macOS read-only, privacy-safe hardware report; run locally on a Mac you own.
set -eu
if [ "$(uname -s)" != "Darwin" ]; then
  echo "Run this helper on macOS, not Windows or Linux." >&2
  exit 2
fi
model="$(sysctl -n hw.model 2>/dev/null || printf 'Unavailable')"
version="$(sw_vers -productVersion 2>/dev/null || printf 'Unavailable')"
power="$(system_profiler SPPowerDataType 2>/dev/null || true)"
cycle="$(printf '%s\n' "$power" | awk -F: '/^[[:space:]]*Cycle Count:/{gsub(/^[[:space:]]+/, "", $2);print $2;exit}')"
condition="$(printf '%s\n' "$power" | awk -F: '/^[[:space:]]*Condition:/{gsub(/^[[:space:]]+/, "", $2);print $2;exit}')"
charge="$(pmset -g batt 2>/dev/null | awk 'match($0,/[0-9]+%/){print substr($0,RSTART,RLENGTH);exit}' || true)"
if [ -z "$charge" ]; then charge=Unavailable; fi
if [ -z "$cycle" ]; then cycle=Unavailable; fi
if [ -z "$condition" ]; then condition=Unavailable; fi
printf '%s\n' 'Device Recovery Toolkit - macOS local report'
printf 'Model: %s\n' "$model"
printf 'macOS: %s\n' "$version"
printf 'Current charge: %s\n' "$charge"
printf 'Battery cycles: %s\n' "$cycle"
printf 'Battery condition: %s\n' "$condition"
printf '%s\n' 'No serial number, accounts, files or passwords were collected.'
printf '%s\n' 'No device modifications were made.'
