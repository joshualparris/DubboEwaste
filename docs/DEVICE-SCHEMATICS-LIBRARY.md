# Device schematics, service manuals and repair library

_Last updated: 2026-10-07_

This is the privacy-safe public index joining the DadLAN fleet with verified tech-purchase evidence. Home addresses, payment details and order numbers are intentionally excluded.

## Rules

- A service/maintenance manual is not the same thing as a motherboard electrical schematic.
- Board schematics and BoardView files must be matched to the physical PCB code/revision, not just a retail laptop name.
- This public repo and the AssetFlow site link to copyrighted manufacturer/third-party manuals rather than republishing them unless redistribution rights are clear.
- Openly licensed files may be mirrored with the licence and attribution preserved.


## 7 October current-fleet board match audit

A dedicated board-level pass has now cross-matched Action1/WMI data, exact retail/MTM identifiers and repair-community board documentation:

**[Current fleet schematic match audit — 7 October 2026](CURRENT-FLEET-SCHEMATIC-MATCHES-2026-10-07.md)**

Strong board-platform matches now exist for:

- Toshiba L50-A00M PSKLEA-00M001 → **Pegatron VGFTG Rev 2.1** schematic + BoardView.
- Lenovo ThinkPad L480 20LTS0Q200 / Type 20LT → **NM-B461 Rev 0.1** schematic + BoardView.
- HP ProBook 4230s → **Inventec JOURNEY / 6050A2406601** schematic family.
- HP 15-db0034AU → **EPV51 LA-G078P / HP L20478-601** schematic + BoardView.
- Toshiba L630 UMA → **BM10 / 6050A2338402-MB-A01** schematic family.
- Compaq Presario CQ56 Intel/T3500 → **623909-001 / DAAX3MB16A1 Rev A / AX3E-DDR2** schematic.
- HP Compaq 610 VE908PA#ABG Intel UMA → **VV09/W09 / 6050A2256501** schematic family.

Board/FRU identity is also substantially resolved for the HP 435 G8 (**6050A3243801-MB-A01**), HP ProBook 11 G2 (**DUNES_SKLU_MB / 15249-x**) and ThinkPad T61 6457-BP2 (**FRU 42W7877 / NVIDIA NB8P-GL**), but a trustworthy exact circuit schematic has not yet been verified for those boards.

**Final safety rule remains:** verify the printed PCB code and revision before measuring or powering a board using a schematic. "Matched platform" is stronger than a retail-model guess, but it is not a substitute for the final silkscreen check.

## Collated device inventory

| Rank | Device | Model / part | Best source found | Board-level next step |
|---|---|---|---|---|
| 1 | Gaming PC (2019) | i5-9400 / GTX 1660 / 16GB | — | Record motherboard model + PCB revision |
| 2 | Dell Latitude 5430 | Standard 5430 assumed | — | Confirm service tag; do not use 5430 Rugged docs |
| 3 | iMac 27-inch Retina 5K (2017) | 27-inch 2017 | [iFixit family](https://www.ifixit.com/Device/iMac_Intel_27%22_Retina_5K_Display) | Record EMC + logic-board ID |
| 4 | Lenovo ThinkPad L480 | 20LTS0Q200 / Type 20LT | [Lenovo HMM page](https://pcsupport.lenovo.com/ag/en/products/laptops-and-netbooks/thinkpad-l-series-laptops/thinkpad-l480-type-20ls-20lt/document-userguide) · [NM-B461 schematic + BoardView](https://eletronicabr.com/en/files/file/38759-esquema-el%C3%A9trico-e-boardview-notebook-lenovo-thinkpad-l480-l580-nm-b461-rev-01-schematic/) | Verify physical NM-B461 revision before use |
| 5 | HP EliteBook 840 G3 | 840 G3 | [HP manuals](https://support.hp.com/au-en/product/setup-user-guides/notebook-hp-elitebook-840-g3/7815294) | Official Maintenance and Service Guide |
| 6 | MacBook Air Early 2015 | 13-inch assumed | [iFixit guides](https://www.ifixit.com/Device/MacBook_Air_13%22_Early_2015) | Confirm A1466/A1465 + board number |
| 7 | Toshiba Satellite P750 | P750 | [schematic index](https://www.s-manuals.com/notebook/toshiba_satellite_p750) | LA-6831P/LA-6832P variants; verify PCB |
| 7.5 | Dell Latitude E6510 | E6510 | [Dell service manual](https://www.dell.com/support/product-details/en-au/product/latitude-e6510/resources/manuals) · [schematics](https://www.s-manuals.com/notebook/dell_latitude_e6510) | Verify LA-5571P vs LA-5573P |
| 8 | ASUS N53Jq | N53Jq | [ASUS manuals](https://www.asus.com/supportonly/n53jq/helpdesk_manual/) | Read PCB code |
| 9 | HP Pavilion dv7-2206TX | dv7-2206TX | — | Record product number + PCB/spare |
| 10 | HP ProBook 4230s | 4230s / i3-2330M | [HP manuals](https://support.hp.com/au-en/product/setup-user-guides/hp-probook-4230s-notebook-pc/5045209) · [JOURNEY schematic family](https://www.laptopschematic.com/tag/hp-probook/) | Verify 6050A2406601 revision |
| 11 | Toshiba Satellite L850D | PSKECA-00W002 | — | Photograph PCB code |
| 12 | Toshiba Tecra A11/P11 x4 | family | [maintenance manual](https://www.manualslib.com/manual/798381/Toshiba-Tecra-A11-Series.html) | Record each full part number |
| 12.5 | HP EliteBook 2740p | 2740p | [HP manuals](https://support.hp.com/au-en/product/setup-user-guides/hp-elitebook-2740p-tablet-pc/model/4145452) | Official Maintenance and Service Guide |
| 13 | ASUS N52/N52D/N52DA/N61 | family only | — | Exact underside model + PCB required |
| 14 | Toshiba Satellite L630 | L630 / P6100 / Intel UMA | [L630/L635 manual](https://manualmachine.com/toshiba/satellitel630/204980-service-manual/) · [BM10 schematic](https://eletronicabr.com/en/files/file/16577-electrical-schematic-notebook-toshiba-l630-bm10-and-6050a2338402-mb-a01-board-6050a2338402-mb-a01-rev-f-schematic/) | Verify 6050A2338402-MB-A01 revision |
| 14.5 | Gateway NE56R06a-B9604G50Mnks | exact retail model | — | Read motherboard code |
| 15 | Toshiba Satellite L650D | L650D | — | Record full PSK number + PCB |
| 16 | Toshiba Satellite L635 | L635 | [L630/L635 manual](https://manualmachine.com/toshiba/satellitel630/204980-service-manual/) | Confirm PSK code |
| 17 | HP Compaq 610 | VE908PA#ABG / T5870 / Intel UMA | [6050A2256501 schematic evidence](https://www.chinafix.com/thread-776228-1-1.html) | Verify VV09/W09 PCB revision |
| 17.5 | Compaq Presario CQ56 | Intel T3500 / Mobile Intel 4-Series | [623909-001 / DAAX3MB16A1 schematic](https://www.eserviceinfo.com/index.php?searchstring=CQ56+Pavilion+G56+DAAX3MB16A1+623909-001+rev-a+AX3E-DDR2&what=search2) | Verify DAAX3MB16A1 Rev A silkscreen |
| 18 | Toshiba Satellite L450 | L450 | [family maintenance manual](https://manuals.plus/m/4b0b13e73677483b0b3db2c3c032e9d76a76add11ee521e25a9746905d00187f) | Record PSL number |
| 19 | HP 15-db0034AU | 15-db0034AU / A6-9225 | [L20478-601 exact-model compatibility](https://www.mypinnacleservice.com/l20478-601-l20478-001-a6-9225-motherboard-for-hp-laptop-15-db-15t-db-epv51-la-g078p/) · [LA-G078P schematic + BoardView](https://realschematic.com/shop/11854/desc/hp-255-g7-hp-15-db-15t-db-series-pcb-la-g078p) | Verify EPV51 LA-G078P revision |
| 20 | Toshiba Satellite C50D-A | PSCFWA-03J00K | — | Photograph PCB code |
| 21 | ASUS X553MA | Action1 WMI exact model / N3540 | [X553MA BoardView/revision evidence](https://www.elvikom.pl/post183376.html) | Verify Rev 1.2 vs 2.0 and PCB P/N |
| 22 | Toshiba Satellite C50-B | PSCMLA-03200S | [LA-B301P schematic index](https://www.s-manuals.com/notebook/toshiba_satellite_c50-b) | Verify PCB is LA-B301P |
| 23 | Toshiba Satellite Pro C50 | family only | — | Full PSC number + PCB required |
| 24 | Lenovo IdeaPad 100S | 100S-11IBY likely | [Lenovo manual page](https://support.lenovo.com/au/en/solutions/pd104048/) | Confirm Type 80R2 |
| 24.5 | ASUS X205T/X205TA | X205TA family | [schematic + BoardView source](https://laptop-schematics.com/view/9746/) | Verify board revision |
| 25 | Dell Inspiron 1525 | 1525 | [Dell service manual](https://www.dell.com/support/product-details/en-au/product/inspiron-1525/resources/manuals) | Confirm Intel vs AMD board |
| 26 | Acer Extensa 5630 | 5630 | [service guide](https://www.manualslib.com/manual/232616/Acer-Extensa-5630.html) | Record board ID |
| 26.5 | Acer TravelMate 6593 x2 | 6593 series | [service guide](https://www.manualslib.com/manual/232772/Acer-Travelmate-6593-Series.html) | Record each suffix |
| 27 | HP Compaq 6730b | 6730b | [HP support](https://support.hp.com/us-en/product/setup-user-guides/hp/3687777) | Record product number |
| 28 | HP Compaq 6710b | 6710b | [HP support](https://support.hp.com/au-en/product/setup-user-guides/hp-compaq-6710b-notebook-pc/model/3356635) | Record product number |
| 29 | Dell Latitude D630 | D630 | [Dell manuals](https://www.dell.com/support/product-details/en-au/product/latitude-d630/resources/manuals) · [schematics](https://www.s-manuals.com/notebook/dell_latitude_d630) | Verify LA-3301P vs LA-3302P |
| 29.5 | HP 550 | 550 | — | Record product number/PCB |
| 30 | Toshiba Satellite A200 | family | — | Record full PSA number |
| 31 | Toshiba Satellite A300 | family | — | Record full PSA number |
| 32 | Toshiba Satellite L300 | family | — | Record full PSL number |
| 33 | Toshiba Satellite L350 | family | — | Record full PSL number |
| 34 | Toshiba Satellite A100 | PSAA2A-05301N | [A100/A105 maintenance manual](https://www.manualslib.com/manual/709287/Toshiba-Satellite-A100.html) | Check PSAA2A compatibility |
| 35 | Toshiba Tecra A8 | family | — | Record full PTA number |
| 36 | Dell Inspiron 6400 | 6400/E1505 | [Dell manuals](https://www.dell.com/support/product-details/en-ap/product/inspiron-6400x/resources/manuals) | Read PCB code |
| 36.5 | ASUS F5R | F5R | [Rev 2.0 schematic](https://eletronicabr.com/en/topic/402877-asus-f5r-notebook-electrical-schematic-rev-20-schematic/) | Confirm board is Rev 2.0 |
| 36.7 | HP 530 | 530 | — | Record product number/PCB |
| 37 | HP Pavilion dv2000 | broad family | — | Exact dv2xxx/product number required |
| 37.5 | HP Pavilion dv6000 | broad family | — | Exact dv6xxx/product number required |
| 38 | Dell Inspiron 6000 | 6000 | [Dell service manual](https://www.dell.com/support/product-details/en-au/product/inspiron-6000/resources/manuals) | Read PCB code |
| 39 | Dell Inspiron 2200 | 2200 | [Dell service manual](https://www.dell.com/support/product-details/en-us/product/inspiron-2200/resources/manuals) | Read PCB code |
| 40 | Toshiba Satellite M55-S329 | PSM50U-05X01V | — | Photograph PCB |
| 41 | Compaq Presario V2000 | V2157AP | — | Record board ID |
| 42 | IBM ThinkPad Type 2656 | 2656-EM7 | — | Map machine type to marketing model/HMM |
| 43 | Dell Dimension 3100 | 3100/E310 | [Dell service manual](https://www.dell.com/support/product-details/en-ca/product/dimension-3100/resources/manuals) | Record motherboard DP/N if retained |

## Other currently evidenced home tech\n\n- **Samsung Galaxy A55 5G** — Samsung and Google device sign-in records from August 2024 establish an A55 5G in use. Samsung publishes an English repair guide for the SM-A556B family, and iFixit lists A55 models including SM-A556E. Confirm the exact model number in Settings > About phone before treating a regional repair guide as an exact match: https://www.ifixit.com/Device/Samsung_Galaxy_A55 and https://www.samsung.com/nl/support/model/SM-A556BLVAEUB/\n\n## Purchase-derived devices/accessories

- **HP laptop sold as “HP PROBOOK 11 G2”** — eBay order confirmation, 9 Sep 2026; i3-6100U, 4GB, 128GB. The listing name needs physical verification before a schematic is assigned.
- **Fitbit Inspire 3** — two eBay charging-cable orders in Jul 2026. [Fitbit user manuals](https://support.google.com/googlehealth/answer/14253977?hl=en-AU).
- **HP ProBook 4230s** — eBay charger delivered Nov 2024 supports the existing DadLAN entry.
- **TP-Link Archer AX53 AX3000** — Officeworks order 4 Dec 2025, product code TPARCHAX53. [Official AU downloads](https://www.tp-link.com/au/support/download/archer-ax53/); verify V1/V2.
- **TP-Link Archer VR2100 AC2100** — self-described as an old owned router/modem in Aug 2026 email. [TP-Link AU download centre](https://www.tp-link.com/au/support/download/); verify hardware version.
- **Toshiba 1TB Canvio USB 3.0 portable HDD** — Officeworks order 9 Jul 2018, product TB110AK3BA. Check enclosure label for exact Canvio family.
- **Logitech H110 headset** — Officeworks invoice 17 Mar 2020; private receipt copied to Drive.
- **Nintendo Wii power/sensor accessories + Avatar game** — eBay order 15 Jul 2024. This proves accessory ownership, not a Wii console.

## Strongest electrical-schematic leads already found

1. Dell Latitude E6510 — Compal **LA-5571P / LA-5573P**: https://www.s-manuals.com/notebook/dell_latitude_e6510
2. Dell Latitude D630 — Compal **LA-3301P / LA-3302P**: https://www.s-manuals.com/notebook/dell_latitude_d630
3. Toshiba Satellite P750 — Compal **LA-6831P / LA-6832P**: https://www.s-manuals.com/notebook/toshiba_satellite_p750
4. Toshiba Satellite C50-B — Compal **LA-B301P Rev 1.0**: https://www.s-manuals.com/notebook/toshiba_satellite_c50-b
5. ASUS F5R — **Rev 2.0** electrical schematic: https://eletronicabr.com/en/topic/402877-asus-f5r-notebook-electrical-schematic-rev-20-schematic/
6. ASUS X205TA — schematic + BoardView package: https://laptop-schematics.com/view/9746/

## Openly licensed repair PDF

- MacBook Air 13-inch Early 2015 teardown, iFixit **CC BY-NC-SA**: https://documents.cdn.ifixit.com/pdf/ifixit/guide_38266_en.pdf

## Physical identification pass

For every unresolved unit, photograph the underside label and, when opened safely, the motherboard silkscreen/revision. Also capture HP spare numbers, Dell DP/Ns and full Toshiba PS*/PT* part numbers. That is the fastest path from “family-level manual” to an exact electrical schematic.
