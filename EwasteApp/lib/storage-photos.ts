/** Verified real-world photographic references for the public Storage Explorer.
 * Original Wikimedia Commons file pages and licences checked 11 October 2026.
 * These are remote Wikimedia images, not AI-generated or claimed local workshop photography.
 * No file is cropped/relicensed in our repository. Each displayed photo links to its source and licence.
 * Atlas mapping deliberately omits types for which a matching actual photo wasn't verified.
 */
export type StoragePhoto = {id:string;title:string;file:string;group:string;detail:string;credit:string;license:string;licenseUrl:string;atlasIds:string[]};
export const storagePhotos:StoragePhoto[] = [
  {
    "id": "desktop-sata",
    "title": "3.5-inch SATA hard drive",
    "file": "SATA-drive.jpg",
    "group": "HDD",
    "detail": "A real Hitachi Deskstar SATA HDD; the metal enclosure is not the inside platter.",
    "credit": "Frettled",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "atlasIds": [
      "sata35"
    ]
  },
  {
    "id": "sata-ssd",
    "title": "2.5-inch SATA solid-state drive",
    "file": "A SATA SSD.jpg",
    "group": "SSD",
    "detail": "Real Nextron 2.5-inch SATA SSD in its rectangular laptop-size enclosure.",
    "credit": "Contributers2020",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "atlasIds": [
      "sata-ssd"
    ]
  },
  {
    "id": "open-hdd",
    "title": "Inside an IDE hard disk",
    "file": "Open hard-drive.jpg",
    "group": "Anatomy",
    "detail": "Actual opened IDE HDD showing magnetic platter and actuator. Never open a working customer drive.",
    "credit": "Zzubnik",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Open_hard-drive.jpg",
    "atlasIds": [
      "pata35"
    ]
  },
  {
    "id": "sata-connectors",
    "title": "SATA power and data connectors",
    "file": "Hard disk sata.JPG",
    "group": "Connector",
    "detail": "Real close-up of an HDD's two L-shaped SATA connectors.",
    "credit": "Greekwikipedian",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Hard_disk_sata.JPG",
    "atlasIds": []
  },
  {
    "id": "sata-installed",
    "title": "Installed desktop SATA HDD",
    "file": "HDD-SATA.jpg",
    "group": "Installed",
    "detail": "Actual SATA hard drive mounted in a computer case with cabling.",
    "credit": "Whityya23",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "atlasIds": []
  },
  {
    "id": "msata",
    "title": "mSATA SSD module",
    "file": "MSATA SSD.jpg",
    "group": "SSD",
    "detail": "Real 256 GB mSATA SSD. Similar-looking Mini PCIe does not guarantee compatibility.",
    "credit": "Useranonymoususer",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "atlasIds": [
      "msata"
    ]
  },
  {
    "id": "compact-ssds",
    "title": "mSATA and M.2 module comparison",
    "file": "MSATA SATA M.2 NVMeSSD.jpg",
    "group": "Comparison",
    "detail": "One genuine photograph of four DIFFERENT compact cards, including mSATA, M.2 SATA and PCIe/NVMe. Not interchangeable.",
    "credit": "ガラパリ",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "atlasIds": [
      "m2-sata42",
      "m2-sata80"
    ]
  },
  {
    "id": "nvme-2230",
    "title": "2230 NVMe SSD beside microSD",
    "file": "M.2 2230 M-key SSD in comparison with Micro-SD card.jpg",
    "group": "SSD",
    "detail": "Real Kioxia/Toshiba BG4 2230 M-key NVMe SSD with a microSD card for scale.",
    "credit": "Phiarc",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "atlasIds": [
      "nvme2230"
    ]
  },
  {
    "id": "laptop-hdd",
    "title": "2.5-inch SATA HDD versus mSATA",
    "file": "Hitachi 2.5\" HDD and ADATA XM13 20120402.jpg",
    "group": "Comparison",
    "detail": "Real photo comparing an ADATA mSATA module against a Hitachi 2.5-inch SATA hard drive.",
    "credit": "Bdortiz1076",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "atlasIds": [
      "sata25h"
    ]
  },
  {
    "id": "usb",
    "title": "USB flash drive",
    "file": "UsbFlashDrive-052e.jpg",
    "group": "Flash",
    "detail": "Original photograph of a Lexar USB-A flash drive; a drive's USB shape does not determine its bootability.",
    "credit": "Loadmaster (David R. Tribble)",
    "license": "CC BY-SA",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "atlasIds": [
      "usb-stick"
    ]
  },
  {
    "id": "cards",
    "title": "CompactFlash, SD and microSD cards",
    "file": "Memory-card-comparison.jpg",
    "group": "Flash",
    "detail": "Actual photograph comparing three card sizes. They need different physical readers or adapters.",
    "credit": "Evan-Amos",
    "license": "See Commons licence",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Memory-card-comparison.jpg",
    "atlasIds": [
      "cf",
      "sd",
      "micro-sd"
    ]
  },
  {
    "id": "floppy",
    "title": "3.5-inch floppy disk",
    "file": "Frontside of a 3.5\" Floppy Disk.jpg",
    "group": "Removable",
    "detail": "Actual black 3.5-inch magnetic floppy disk in its protective plastic shell.",
    "credit": "DiscoA340",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "atlasIds": [
      "floppy"
    ]
  },
  {
    "id": "tape",
    "title": "LTO magnetic backup cartridge",
    "file": "LTX400G.jpg",
    "group": "Tape",
    "detail": "Photograph of an actual Sony LTO Ultrium 3 magnetic tape cartridge.",
    "credit": "See Commons creator",
    "license": "See Commons licence",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:LTX400G.jpg",
    "atlasIds": [
      "tape"
    ]
  },
  {
    "id": "external",
    "title": "DVD, USB drive and external HDD",
    "file": "DVD, USB flash drive and external hard drive.jpg",
    "group": "Removable",
    "detail": "Genuine photo comparing external storage objects: optical disc, USB flash and a USB-connected drive.",
    "credit": "Santeri Viinamäki",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "atlasIds": [
      "usb-hdd",
      "cd-dvd"
    ]
  },
  {
    "id": "m2-sata-adapter",
    "title": "SATA SSD adaptor with M.2 SATA module",
    "file": "Dual SSD SATA adapter with Samsung 860 EVO SSD and 2.5-inch enclosure.jpg",
    "group": "Connector",
    "detail": "SATA-only adapter containing an M.2 SATA drive; NVMe does not work in this adaptor.",
    "credit": "Siarhei Besarab",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "atlasIds": []
  }
];
export function storagePhotoForDrive(id:string):StoragePhoto|undefined {return storagePhotos.find(photo=>photo.atlasIds.includes(id));}
export function storagePhotoById(id:string):StoragePhoto {const found=storagePhotos.find(p=>p.id===id);if(!found) throw new Error("Unknown storage photograph: "+id);return found;}
