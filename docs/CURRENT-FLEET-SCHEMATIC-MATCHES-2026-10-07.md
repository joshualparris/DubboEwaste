# Current fleet board-level schematic match audit

_Last updated: 2026-10-07_

This audit takes the Action1/WMI identifiers, exact retail/MTM identifiers already recorded for Josh's current 15-laptop fleet, and board-level repair sources, then separates:

- **MATCHED PLATFORM** — the owned machine maps strongly to a specific board family and a schematic/BoardView source exists; still verify the silkscreen/revision before using it on a powered board.
- **BOARD ID RESOLVED, SCHEMATIC PENDING** — we can identify the board/FRU family, but no trustworthy circuit schematic was found.
- **CANDIDATE ONLY** — the retail model can ship with multiple boards/revisions and the evidence does not safely select one yet.
- **SERVICE MANUAL ONLY** — no trustworthy true circuit schematic/BoardView found.

Do not treat a retail model match alone as permission to use a schematic. The printed motherboard code and revision remain the final compatibility check.

## Current 15-laptop result

| Device | Owned identity | Board / schematic result | Status | Best source |
|---|---|---|---|---|
| HP ProBook x360 435 G8 | Ryzen 5 5600U, Action1 exact WMI model | Board family **6050A3243801-MB-A01** is independently associated with the 435 G8/5600U. No trustworthy circuit schematic/BoardView located yet. | BOARD ID RESOLVED, SCHEMATIC PENDING | https://www.indiafix.in/2025/12/hp-probook-x360-435-g8-6050a3243801-mb.html |
| Toshiba Satellite L50-A00M | **PSKLEA-00M001**, i5-3337U, GeForce GT 740M | Pegatron **VGFTG MB Rev 2.1**, Ivy Bridge + NVIDIA N14P, with 76-page schematic + BoardView. Platform match is very strong; verify printed VGFTG/revision before use. | MATCHED PLATFORM | https://realschematic.com/shop/10263/desc/toshiba-satellite-l50-a-series |
| Lenovo ThinkPad L480 | **20LTS0Q200 / Type 20LT**, i3-7130U | LCFC/Compal **EL480/EL580 NM-B461 Rev 0.1**; schematic + BoardView source explicitly covers L480 Types 20LS/20LT. | MATCHED PLATFORM | https://eletronicabr.com/en/files/file/38759-esquema-el%C3%A9trico-e-boardview-notebook-lenovo-thinkpad-l480-l580-nm-b461-rev-01-schematic/ |
| Toshiba Satellite L850D | **PSKECA-00W002**, A10-4600M, Radeon HD 7500/7600-series | Pegatron **PLAC/CSAC DSC Main Board Rev 2.1** BoardView exists for L850D, but public evidence does not prove PSKECA-00W002 uses that exact PCB. | CANDIDATE ONLY | https://realschematic.com/shop/10650/desc/toshiba-satellite-l850d-satellite-l870d-satellite-l875d |
| HP ProBook 11 G2 / EE G2 | i3-6100U, SMBIOS board **818F**, BIOS **N92** | Board family **DUNES_SKLU_MB**; public G2 material shows PCB **15249-1** and EE G2 material shows **15249-2**. 818F/N92 does not safely distinguish the physical PCB revision. No trustworthy full schematic located. | BOARD ID RESOLVED, REVISION PENDING | https://vinafix.com/threads/hp-probook-11-g2-bios-15249-1.31273/ |
| MacBook Air Early 2015 | Early-2015 unit; 11-inch vs 13-inch still not software-confirmed | **A1465 11-inch = 820-00164** schematic + BoardView; **A1466 13-inch = 820-00165** schematic + BoardView. Run a Model Identifier check to select the exact one. | EXACT CHOICE BLOCKED BY MODEL ID | https://schematics4u.com/product/macbook-air-11-early-2015-a1465-820-00164-schematics-and-boardview/ and https://schematics4u.com/product/macbook-air-13-early-2015-a1466-820-00165-schematics-and-boardview/ |
| HP ProBook 4230s | i3-2330M, Intel HD 3000 | Inventec **JOURNEY / 6050A2406601**; multiple revisions exist (A01/A02 etc). Full circuit schematic sources found. Verify the actual board revision before use. | MATCHED PLATFORM | https://www.laptopschematic.com/tag/hp-probook/ |
| Toshiba Tecra P11 | i7-620M, NVIDIA NVS 2100M | 462-page Toshiba maintenance manual includes board layout/wiring/system-unit material, but no trustworthy true motherboard circuit schematic/BoardView was found. | SERVICE MANUAL ONLY | https://www.manualslib.com/products/Toshiba-Tecra-P11-3014436.html |
| HP 15-db0034AU | exact retail model, A6-9225 / Radeon R4 | HP spare **L20478-601 / L20478-001** maps to Compal **EPV51 LA-G078P**. The compatibility list explicitly includes **15-db0034AU**. Schematic Rev 0.3 and BoardView Rev 1.0 sources found. | MATCHED PLATFORM — strongest current match | https://www.mypinnacleservice.com/l20478-601-l20478-001-a6-9225-motherboard-for-hp-laptop-15-db-15t-db-epv51-la-g078p/ and https://realschematic.com/shop/11854/desc/hp-255-g7-hp-15-db-15t-db-series-pcb-la-g078p |
| Lenovo ThinkPad T61 | **6457-BP2**, Core 2 Duo T7500 | Lenovo HMM maps **6457-BPx** to system-board FRU **42W7877**, NVIDIA **NB8P-GL with AMT**. Secondary board tables identify 42W7877 as the 15.4-inch widescreen FX570M 256 MB board. No reputable exact 42W7877 schematic source was found; survey-gated sites were rejected. | EXACT FRU, SCHEMATIC PENDING | https://thinkpads.com/support/hmm/hmm_pdf/42x3546_04.pdf |
| Toshiba Satellite L630 | Pentium P6100, Intel HD | UMA configuration strongly maps to Inventec **Bremen 10 / BM10 / 6050A2338402-MB-A01** rather than discrete BM10G. Circuit schematic exists; source lists Rev F. Verify printed board/revision. | MATCHED PLATFORM | https://eletronicabr.com/en/files/file/16577-electrical-schematic-notebook-toshiba-l630-bm10-and-6050a2338402-mb-a01-board-6050a2338402-mb-a01-rev-f-schematic/ |
| ASUS X553MA | Action1 WMI exact model, Pentium N3540 | X553MA BoardViews exist for **Rev 1.2** and **Rev 2.0**; Rev 2.0 PCB P/N **60NB04X0-MB1B00 (69N0RLM13A01)** is documented. A repair-community source explicitly states there is no full schematic for these newer ASUS boards. | BOARDVIEW AVAILABLE, REVISION PENDING | https://www.elvikom.pl/post183376.html |
| Toshiba Satellite C50D-A | **PSCFWA-03J00K**, E1-2100, Radeon HD 8210 | C50D-A family evidence points to at least two board families: Inventec **6050A2556901-MB-A03** and Pegatron **PT10AN DSC MB Rev 2.1**. Exact PSCFWA-03J00K-to-board mapping was not proven. | CANDIDATE ONLY | https://vinafix.com/threads/toshiba-c55d-6050a2556901.13619/ and https://realschematic.com/shop/10584/desc/toshiba-satellite-c50d-a-series-satellite-c55d-a-series |
| Compaq Presario CQ56 | Celeron T3500, Mobile Intel 4-Series | HP service manual maps the Intel UMA CQ56 board to spare **623909-001**; matching board identifiers are **DAAX3MB16A1 Rev A / AX3E-DDR2**. Exact circuit schematic source found. | MATCHED PLATFORM — strong | https://www.eserviceinfo.com/index.php?searchstring=CQ56+Pavilion+G56+DAAX3MB16A1+623909-001+rev-a+AX3E-DDR2&what=search2 |
| HP Compaq 610 | **VE908PA#ABG**, T5870, Intel 965/X3100 | Intel UMA Compaq 610 repair sources identify **VV09/W09 6050A2256501**. Exact revision varies (A03/A04 in public records), so verify silk before using the schematic. | MATCHED PLATFORM | https://www.chinafix.com/thread-776228-1-1.html |

## What this closed

The previous index said none of the 15 current laptops had an exact board schematic match. This audit materially improves that:

### Schematic or BoardView platform now matched strongly

1. Toshiba L50-A00M — **VGFTG Rev 2.1**
2. Lenovo L480 Type 20LT — **NM-B461 Rev 0.1**
3. HP ProBook 4230s — **JOURNEY / 6050A2406601**
4. HP 15-db0034AU — **EPV51 LA-G078P / L20478-601**
5. Toshiba L630 — **BM10 / 6050A2338402-MB-A01**
6. Compaq Presario CQ56 Intel — **623909-001 / DAAX3MB16A1 Rev A**
7. HP Compaq 610 Intel UMA — **VV09/W09 / 6050A2256501**

These are **not** permission to skip the final PCB-code/revision check before board-level work.

### Board family/FRU resolved but schematic still missing or revision ambiguous

- HP ProBook x360 435 G8 — **6050A3243801-MB-A01**
- HP ProBook 11 G2 — **DUNES_SKLU_MB / 15249-x**
- ThinkPad T61 6457-BP2 — **FRU 42W7877 / NVIDIA NB8P-GL**
- ASUS X553MA — BoardViews exist, exact physical revision needed

### Still genuinely blocked

- MacBook Air Early 2015 — one software Model Identifier command selects 820-00164 vs 820-00165.
- Toshiba L850D PSKECA-00W002 — PLAC/CSAC DSC is a strong candidate, not yet proven for this Australian suffix.
- Toshiba C50D-A PSCFWA-03J00K — at least two board families exist; physical PCB code is needed.
- Toshiba Tecra P11 — no trustworthy true circuit schematic found in this pass.

## Copyright / redistribution rule

The public repository and AssetFlow website **link to the source pages**. They do not republish third-party/copyrighted schematic PDFs, BoardView packages or leaked OEM files unless redistribution rights are explicit. Private Drive may keep research source cards and legitimately obtained/licensed files, but a source link is not represented as an owned file.

## Rejected sources

Recent survey-gated “free schematic” pages for boards such as ThinkPad 42W7877 were deliberately excluded because their provenance and download behaviour were not trustworthy enough for the library.
