# AssetFlow device intelligence sources

Updated: 5 October 2026

AssetFlow now uses a layered lookup rather than relying on one public search engine. Exact identifiers and official/vendor data rank above broad encyclopaedia matches.

## Sources

1. DubboEwaste verified catalogue / AssetFlow local records — first choice for known models, aliases and identifiers.
2. Open Icecat — free product data for sponsoring brands; best for GTIN/EAN/UPC and explicit brand + manufacturer part number. AssetFlow supports GTIN and explicit MPN:/SKU:/PART: searches. Uses ICECAT_USERNAME when configured, otherwise the public openIcecat-live identity for compatible Open Icecat requests.
3. Google Play supported-device catalogue — public Google device CSV; useful for Android retail branding, marketing names, device codenames and model codes.
4. Lenovo PSREF — official Lenovo Product Specifications Reference; AssetFlow resolves official PSREF product pages for Lenovo family verification.
5. FCC Equipment Authorization System — explicit FCC ID lookups through the official OET Laboratory API.
6. PCI ID Repository — explicit PCI vendor/device ID lookup for components.
7. USB ID Repository — explicit USB VID/PID lookup for peripherals/components.
8. Linux Vendor Firmware Service / fwupd metadata — explicit LVFS/GUID lookup for firmware-supported hardware evidence.
9. Wikidata — structured public fallback.
10. Wikipedia — last-resort research lead only.

## Useful search forms

- GTIN 0194253405605
- MPN: 28M88AV with a manufacturer name in the same query
- FCC ID BCG-E8431A
- PCI:8086:15be or VEN_8086&DEV_15BE
- USB:046d:c534 or VID_046D&PID_C534
- LVFS:<GUID>

## Ranking rules

- Exact local model / alias / identifier: highest.
- Exact GTIN, brand+MPN, Google model/device code, FCC ID, PCI ID or USB ID: high.
- Official Lenovo PSREF page: high for family identity.
- LVFS metadata: strong supporting hardware/firmware evidence.
- Wikidata: secondary research lead.
- Wikipedia: lowest public-data priority.
- Entered text remains available as an explicitly unverified fallback rather than silently substituting a generic family.

## Autofill safety

A selected candidate can autofill manufacturer, model and category, but does not prove ownership, serial identity, lock state, condition, support status or sanitisation suitability.

Retail GTIN/EAN/UPC codes identify a product/SKU, not a unique physical device. Serial/IMEI remains separate.

PCI/USB IDs usually identify components rather than the host computer. Operators should only choose them as the asset model when receiving that component as the asset itself.

## External dependencies and limits

- Open Icecat works best with a dedicated free Open Icecat account supplied through ICECAT_USERNAME; no paid subscription is required for Open Icecat-covered brands.
- PSREF has no documented general-purpose public search API, so AssetFlow uses official product-page resolution rather than an undocumented private endpoint.
- Google's public supported-device CSV is excellent for identity, but richer RAM/SoC/GPU/display/SDK columns come from Play Console exports. A future import can add those fields if such an export is supplied.
- LVFS metadata is queried only for explicit LVFS/GUID searches because the firmware catalogue is large.

## Sources

- Open Icecat: https://icecat.com/content-subscription/
- Google Play devices: https://support.google.com/googleplay/android-developer/answer/9859371
- Lenovo PSREF: https://psref.lenovo.com/
- FCC OET API: https://apps.fcc.gov/OETLabServices/getFCCIDList
- PCI IDs: https://pci-ids.ucw.cz/
- USB IDs: https://usb-ids.gowdy.us/
- LVFS/fwupd: https://fwupd.org/
