# Business Laptop Failure-Risk Guide

**Purpose:** triage prompts, not a claim that every model has these faults.

## Lenovo ThinkPad T480/T480s and related generation
Lenovo published a **critical Intel Thunderbolt firmware/software update** for affected ThinkPads including T480-family systems. Documented symptoms include:
- USB-C port not working;
- Thunderbolt controller disappearing;
- dock/HDMI problems;
- battery not charging via USB-C;
- BIOS Thunderbolt communication errors.

Source: https://pcsupport.lenovo.com/us/en/products/laptops-and-netbooks/thinkpad-t-series-laptops/thinkpad-t480-type-20l5-20l6/solutions/ht508988-critical-intel-thunderbolt-software-and-firmware-updates-thinkpad

**Triage:** test both USB-C ports, charging, dock/video output where possible, and confirm firmware history/update state.

## Dell Latitude 5400 / similar serviceable Latitudes
Dell provides a full service manual with replaceable battery, storage, memory and other FRUs. No single official source establishes one universal endemic Latitude 5400 defect.

Source: https://www.dell.com/support/product-details/en-au/product/latitude-14-5400-laptop/resources/manuals

**Triage emphasis:** USB-C/charging, battery health, storage SMART, hinges/chassis, keyboard/trackpad, ports, BIOS/admin/Absolute state. Treat any “common fault” claim from forums as secondary unless corroborated.

## HP EliteBook 840 G5/G6
HP's current model support/troubleshooting index specifically covers:
- battery charging/non-detection/swelling;
- keyboard/touchpad;
- blank screen/display;
- USB connections;
- thermal/fan issues;
- storage boot errors;
- fingerprint reader.

Source: https://support.hp.com/au-en/product/troubleshooting/hp-elitebook-840-g5-notebook-pc/18491271

These are **diagnostic categories**, not proof the 840 G5 has a uniquely high failure rate in each category.

## Microsoft Surface Pro 6 / older Surface
Microsoft's current service-guide centre covers self-repair guides mainly for newer Surface generations; Pro 6 is not in the current self-repair guide list. Microsoft offers service pathways and battery replacement, but older glued Surface devices remain economically riskier to refurbish because screen/battery service is more difficult than typical business laptops.

Sources:
- https://learn.microsoft.com/en-au/surface/service-guides/surface-service-guides
- https://support.microsoft.com/en-au/surface/service-repair/how-to-get-service-or-repair-for-surface

**Triage:** battery condition, touchscreen/display, Type Cover connector/keyboard, kickstand, USB/charging, SSD/storage limitations and repair economics.

## Universal business-laptop triage
For every family:
1. model/CPU support;
2. BIOS/supervisor/Absolute;
3. USB-C charging/dock;
4. battery;
5. display/hinges;
6. keyboard/trackpad;
7. storage health;
8. RAM test;
9. camera/audio/Wi-Fi;
10. thermal/fan;
11. MDM/Autopilot.
