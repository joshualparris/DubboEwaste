# Sources and Further Research

Collected as starting points for the ITAD/open-source-software research.

## Commercial ITAD / recycling systems

### MAKOR ERP
- Website: https://www.makorerp.com/
- Software overview: https://www.makorerp.com/the-software/

Useful as a reference for full lifecycle ITAD/electronics-recycling workflow design.

### RazorERP
- https://www.razorerp.com/

Useful as a reference for ITAD inventory, resale, grading, customer settlements and marketplace integrations.

### Phonecheck
- ITAD: https://www.phonecheck.com/industries/itad

Useful reference for connecting device identity, diagnostics, sanitisation, chain of custody and certification.

### Blancco
- https://www.blancco.com/

Commercial data-erasure platform commonly seen in enterprise ITAD.

Australian examples identified during research:
- eWaste Sydney FAQ: https://www.ewaste.sydney/frequently-asked-questions-ewaste-recycling-in-sydney/
- G1 Asset Management data-erasure page: https://g1.com.au/solutions/data-erasure-solutions/
- Blancco / Industry Trading case study: https://blancco.com/case-studies/cs-remote-erasure-supports-itad-efficiency-innovation-and-growth-for-industry-trading/

These examples are useful evidence that commercial validated data-erasure tooling forms part of the Australian ITAD landscape.

---

# Open-source projects

## Snipe-IT
- https://snipeitapp.com/
- Documentation: https://snipe-it.readme.io/docs/introduction
- GitHub: https://github.com/snipe/snipe-it

## GLPI
- https://glpi-project.org/
- GitHub: https://github.com/glpi-project/glpi

## OCS Inventory NG
- https://ocsinventory-ng.org/
- GitHub organisation: https://github.com/OCSInventory-NG

## smartmontools
- https://www.smartmontools.org/
- GitHub: https://github.com/smartmontools/smartmontools

## Memtest86+
- https://memtest.org/
- GitHub: https://github.com/memtest86plus/memtest86plus

## FOG Project
- https://fogproject.org/
- Documentation: https://docs.fogproject.org/

## nwipe
- GitHub: https://github.com/martijnvanbrummelen/nwipe

## ShredOS
- GitHub: https://github.com/PartialVolume/shredos.x86_64

## ERPNext
- https://erpnext.com/
- GitHub: https://github.com/frappe/erpnext

---

# Questions for deeper research

1. Which erasure standards/methods are appropriate for different Australian customer classes?
2. What evidence would NSW Government, schools, health organisations and businesses expect from an ITAD provider?
3. Which nwipe/ShredOS outputs can be captured automatically and transformed into useful certificates?
4. Can FOG and nwipe share a practical PXE processing environment?
5. How well can Snipe-IT represent consumable/harvested components and one-to-many drive relationships?
6. Would using Snipe-IT as the backing asset system save time or create constraints compared with a dedicated AssetFlow schema?
7. Which OCS Inventory fields are useful enough to import automatically?
8. What is the safest way to preserve raw diagnostic/sanitisation evidence and prove it has not been modified?
9. How should assets, drives, parts, pallets and downstream consignments relate in the database?
10. What Australian e-waste/ITAD certification, privacy, audit and record-retention requirements should shape the software from day one?

Research captured 2 October 2026.
