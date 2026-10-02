# Parts Harvest Matrix

Use whole-device reuse first where safe/economic. Harvest only when whole-device route loses.

| Part | Reuse/resale value check | Scrap-floor note |
|---|---|---|
| DDR4/DDR5 RAM | test capacity/speed; bundle matching modules | The Board Guy publishes bare-RAM kg floor |
| NVMe/SATA SSD | sanitise + health test before resale | damaged/failed data media needs secure route |
| CPU | exact model sold-value lookup | CPU scrap grades have published floor |
| LCD/OLED panel | exact part number; test for pressure/dead pixels | low scrap value, fragile storage |
| OEM charger | voltage/wattage/connector; electrical safety | low material value, high usefulness |
| keyboard/palmrest | model-specific demand | usually low scrap |
| Wi-Fi card | compatibility/FRU locks | Board Guy Wi-Fi/SSD card floor published |
| motherboard | repairable/sellable exact board first | Board Guy laptop/motherboard grades |
| GPU | exact model/test | clean/fan-on board scrap floors published |
| copper cable | reusable cables first | copper/material stream |
| HDD | reuse only after sanitisation + health if policy permits | logic board/metal or secure destruction route |

## Decision
Harvest when:
```
expected parts proceeds - harvest labour - listing/shipping risk
>
whole-device net value
```

Record harvested part IDs against donor asset ID for traceability.
