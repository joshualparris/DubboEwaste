/**
 * RAM Explorer photographic reference catalogue.
 * Source: publicly listed files on Wikimedia Commons category/file pages,
 * manually matched to displayed module types (10 October 2026).
 * Each file page is the canonical attribution, copyright and licence record.
 * Linking to the Commons source does not transfer any reuse rights.
 */
export type RAMPhoto = {
  id: string; title: string; generation: string; shape: string;
  usage: string; pins: string; identify: string; file: string;
  rarity: "Common" | "Uncommon" | "Rare"; direct: boolean;
};
type Row = [string, string, string, string, string, string, string, "Common" | "Uncommon" | "Rare"?];
const rows: Row[] = [
  // Early chips, sockets, SIMM, SIPP and pre-SDR variants.
  ["Pre-SDR","DIP","Vintage DRAM DIP chip","Ram chip.jpg","DIP pins vary","Early socketed and through-hole RAM ICs; package is not a plug-in RAM stick.","Legacy boards","Rare"],
  ["Pre-SDR","SIPP","SIPP module, pin-legged design","SIPP-Modul.jpg","30 pins typical","The exposed metal pins are fragile and very different from SIMM gold edge fingers.","286/386 era","Rare"],
  ["Pre-SDR","SIPP","Early SIPP module, alternative photo","SIPP.jpg","Usually 30 pins","A real SIPP board with a row of individual connector pins.","Vintage PCs","Rare"],
  ["Pre-SDR","SIMM","30-pin SIMM (Goldstar)","30 pin goldstar memory modules.jpg","30 contacts","Short 8-bit-era module; check whether parity is required.","286/386 and 486-era PCs","Rare"],
  ["Pre-SDR","SIMM","30-pin Atari STE SIMM","30 pin SIMM - 1Mo - taken from an Atari STE.jpg","30 contacts","Another genuine 30-pin SIMM; different chip layout, same module family.","Atari / vintage","Rare"],
  ["Pre-SDR","SIMM","FPM DRAM 4 MB SIMM","SIMM FPM 4 MB - C0448721-7229.jpg","SIMM, verify contacts","Fast Page Mode module; technology and connector are separate attributes.","Legacy computers","Rare"],
  ["Pre-SDR","SIMM","72-pin SIMM (Alliance)","Platinen-001 hg (cropped) 72Pin SIMM Alliance.jpg","72 contacts","Longer 32-bit-era SIMM than the 30-pin version.","486 / Pentium","Rare"],
  ["Pre-SDR","SIMM","72-pin SIMM (Siemens)","Siemens SIMM memory module.jpg","72 contacts; check part","Compare chips, label and gold contacts.","90s computers","Rare"],
  ["Pre-SDR","SIMM","EDO DRAM SIMMs in a pair","Pair32mbEDO-DRAMdimms.jpg","SIMM: check part","EDO is a DRAM timing technology, not a new physical socket.","Pentium-era PCs","Rare"],
  ["Pre-SDR","SIMM","EDO memory close-up","SEC EDO memory.jpg","Depends on module","Read the EDO label and compare package style.","Legacy PCs","Rare"],
  ["Pre-SDR","DIMM","168-pin EDO DIMM","IBM 54H8599 16MB 168 pin EDO RAM - front view-4530.jpg","168 contacts","Important: some pre-SDR EDO modules used DIMM connectors, not just SIMMs.","Legacy workstation","Rare"],
  ["Pre-SDR","SO-DIMM","72-pin SO-DIMM","SO-DIMM 72pin.jpg","72 contacts","Early notebook module; the SO-DIMM form predates DDR.","Vintage laptops","Rare"],
  ["Pre-SDR","SO-DIMM","72-pin compact SO-DIMM","Platinen-001 hg (cropped) Kingstpn 72-pin SO-DIMM.jpg","72 contacts","Compact early laptop-style removable RAM.","Vintage laptops","Rare"],
  // SDR
  ["SDR","DIMM","SDR SDRAM 168-pin DIMM","SDR SDRAM 133MHz.jpg","168 contacts","Usually two notches; single-data-rate synchronous RAM.","Late 1990s PC","Uncommon"],
  ["SDR","DIMM","PC133 SDRAM DIMM","PC133-322 128MB.jpg","168 contacts","PC133 indicates the SDRAM speed class, not DDR.","Pentium II/III","Uncommon"],
  ["SDR","DIMM","SDRAM 128 MB DIMM","SDRAM 128MB 133MHz.jpg","168 contacts","Traditional full-height green DIMM PCB.","Old desktops","Uncommon"],
  ["SDR","SO-DIMM","144-pin SDR SO-DIMM","IBM SO-DIMM ram 128mb.jpg","144 contacts","Early removable laptop SDR module.","Vintage laptops","Uncommon"],
  ["SDR","SO-DIMM","64MB SDR laptop SO-DIMM","SODIMM 64MB SDRAM.JPG","144 contacts","Earlier low-capacity SO-DIMM; smaller than desktop RAM.","Vintage laptops","Uncommon"],
  ["SDR","MicroDIMM","SDR MicroDIMM 256 MB","Nanonote 03 2.jpg","Small proprietary compact connector","Actual PC133 MicroDIMM photographed with nano-laptop hardware.","Ultra-compact systems","Rare"],
  // DDR1
  ["DDR","DIMM","DDR1 400 MT/s desktop DIMM","1GB DDR1 400Mhz (5).jpg","184 contacts","Early double-data-rate SDRAM; keyed differently from DDR2.","Early 2000s desktops","Uncommon"],
  ["DDR","DIMM","DDR1 256MB PC2100","256MB PC2100 DDR.JPG","184 contacts","Older DDR-266 era desktop stick.","Legacy PCs","Uncommon"],
  ["DDR","DIMM","DDR1 Kingston 1GB module","Kingston KVR400X64C3A-1G 20051111.jpg","184 contacts","Example of Kingston DDR1 unbuffered RAM.","Early desktops","Uncommon"],
  ["DDR","DIMM","DDR1 with heat spreader","Corsair CMX512-3200C2PT 20080602.jpg","184 contacts","Metal heat spreader covers chips; DDR type is still defined by module spec.","Gaming/enthusiast","Rare"],
  ["DDR","RDIMM","DDR1 ECC registered module","Micron PC2700 DDR ECC REG.JPG","184 contacts","Server buffering and ECC are additional attributes; not universally compatible.","Early servers","Rare"],
  ["DDR","SO-DIMM","DDR1 200-pin laptop RAM","SO-DIMM-200pin-256MB-DDR-SDRAM.jpg","200 contacts","First DDR SO-DIMM generation. DDR2 also uses 200, differently keyed.","Laptop","Uncommon"],
  ["DDR","SO-DIMM","DDR1 Buffalo SO-DIMM","Buffalo SO-DIMM 512 MB PC2700 - BT-DN333-512M-T327-2718.jpg","200 contacts","Another identifiable first-generation DDR laptop stick.","Laptop","Uncommon"],
  ["DDR","SO-DIMM","DDR1 Hynix PC2700 module","Hynix HYMD564M646A6-JAA 512MB DDR 333MHZ CL2.5-2769.jpg","200 contacts","Shows chip and label layout on period laptop memory.","Laptop","Uncommon"],
  // DDR2
  ["DDR2","DIMM","DDR2 512 MB full DIMM","512 MB DDR2 DIMM RAM Module.jpg","240 contacts","Standard unbuffered DDR2 desktop size.","Desktop","Uncommon"],
  ["DDR2","DIMM","DDR2 Kingston value RAM","Kingston KVR667D2N5-1G 20120419.jpg","240 contacts","Low-profile PCB on a standard DIMM-sized connector.","Desktop","Uncommon"],
  ["DDR2","DIMM","DDR2 PC2-5300 desktop memory","DDR2 RAM PC5300 IMGP1059.jpg","240 contacts","PC2 label signals DDR2 generation.","Desktop","Uncommon"],
  ["DDR2","DIMM","DDR2 with tall heatsink","Corsair CM2X1024-6400C5DHX 20080221.jpg","240 contacts","Enthusiast heat-spreader design.","Gaming","Rare"],
  ["DDR2","DIMM","DDR2 Corsair XMS2","Corsair xms2 DDR2.jpg","240 contacts","Another heat-spreader variant; height matters in compact builds.","Gaming","Uncommon"],
  ["DDR2","SO-DIMM","DDR2 SO-DIMM 1GB","1GB DDR2 SO-DIMM.png","200 contacts","DDR2 shares laptop pin count with DDR1 but uses another notch position.","Laptop","Uncommon"],
  ["DDR2","SO-DIMM","DDR2 laptop module in context","DDR2 Laptop RAM.jpg","200 contacts","More real-world module photography.","Laptop","Uncommon"],
  ["DDR2","SO-DIMM","DDR2 Hynix 2GB SO-DIMM","Hynix 2GB DDR2 SO-DIMM.jpg","200 contacts","Period laptop upgrade component.","Laptop","Uncommon"],
  ["DDR2","SO-DIMM","DDR2 Crucial 2GB laptop","Crucial CT25664AC667.M16FH 2GB 200-PIN DDR2 SODIMM 256Mx6 WP 20220922 22 28 29 Rich.jpg","200 contacts","Detailed example with exact part number.","Laptop","Uncommon"],
  ["DDR2","FB-DIMM","DDR2 FB-DIMM (fully buffered)","FB-DIMM.JPG","240 contacts, distinct keying","Fully buffered Apple/server-era module using AMB buffer.","Server","Rare"],
  ["DDR2","FB-DIMM","FB-DIMM vs DDR2 notch comparison","FB-DIMM DDR2 vs. DDR2 photo with pin count.jpg","DDR2-era modules","A particularly useful real photograph for identifying incompatible server DIMMs.","Server","Rare"],
  ["DDR2","FB-DIMM","FB-DIMM heatspreader / riser","FB-DIMM riser A.jpg","Server-specific","Server riser with fully buffered modules; mounting and cooling differ.","Server","Rare"],
  ["DDR2","Low profile","DDR2 shorter-height DIMM","Kingston KVR667D2N5-1G 20120419.jpg","240 contacts","Low PCB height is a mechanical feature, not a separate generation.","Slim desktops","Uncommon"],
  // DDR3
  ["DDR3","DIMM","DDR3 standard desktop DIMM","2GB DDR3 Desktop RAM 1333Mhz.jpg","240 contacts","DDR3-1333 desktop unbuffered RAM.","Desktop","Common"],
  ["DDR3","DIMM","DDR3 Corsair Value Select","CORSAIR Memory - CMV4GX3M1A1333C9 - 4GB DDR3 Memory-6523.jpg","240 contacts","Common unbuffered DDR3 module.","Desktop","Common"],
  ["DDR3","DIMM","DDR3 Corsair Vengeance heat spreader","2014 Corsair Vengeance 4GB, 1600MHz.jpg","240 contacts","Taller heat spreader; not a different slot.","Gaming","Common"],
  ["DDR3","DIMM","DDR3 Dominator Platinum heatsink","2014 Corsair Dominator Platinum 2x4GB, 1866MHz.JPG","240 contacts","Premium heatsink used on enthusiast DDR3.","Gaming","Uncommon"],
  ["DDR3","DIMM","DDR3 illuminated/enthusiast Avexir","2014 Avexir Core 2x4GB, 1600MHz.jpg","240 contacts","Decorative enthusiast kit; RGB/lighting is a feature, not an electrical standard.","Gaming","Uncommon"],
  ["DDR3","DIMM","DDR3 compact profile DIMM","Kingston KVR1333D3S8N9-2G 20160205.jpg","240 contacts","Lower-height DDR3 desktop module.","Compact desktops","Uncommon"],
  ["DDR3","SO-DIMM","DDR3 SO-DIMM 4GB","4GB DDR3 SO-DIMM.jpg","204 contacts","Laptop DDR3 uses a unique 204-contact format.","Laptop","Common"],
  ["DDR3","SO-DIMM","DDR3 Samsung 1GB notebook module","Samsung 1GB 1Rx8 PC3-8500S SoDimm Memory Module-2720.jpg","204 contacts","Rank and PC3 labelling visible.","Laptop","Uncommon"],
  ["DDR3","SO-DIMM","DDR3L 4GB low-voltage laptop stick","DDR3L laptop RAM 4 GB.jpg","204 contacts","DDR3L generally operates at 1.35V; verify laptop voltage support.","Laptop","Common"],
  ["DDR3","SO-DIMM","DDR3L Kingston 8GB","Kingston KVR16LS11-8 20140323.jpg","204 contacts","Low-voltage PC3L SODIMM.","Laptop","Common"],
  ["DDR3","ECC / RDIMM","DDR3 ECC registered server module","2013 Transcend TS512MLK72V6N-(straightened).jpg","240 contacts","Typical extra memory chips and server-oriented product label. Confirm exact registered specification from part data.","Server","Uncommon"],
  ["DDR3","Low profile","DDR3 small-height DIMM","Kingston KVR1333D3S8N9-2G 2pcs 20170909.jpg","240 contacts","Shorter height in a standard DDR3 slot.","SFF / OEM","Uncommon"],
  // DDR4
  ["DDR4","DIMM","DDR4 plain desktop DIMM","DDR4 DIMM 4GB -2133 IMGP5813 smial wp.jpg","288 contacts","Notch differs from DDR5, despite shared contact count.","Desktop","Common"],
  ["DDR4","DIMM","DDR4 plain memory chips closeup","DDR4 Ram IMGP5854 smial wp.jpg","288 contacts","Useful for inspecting memory-chip layout.","Desktop","Common"],
  ["DDR4","DIMM","DDR4 two Corsair sticks","2*8Go DDR4 Corsair - 2018-05-08.jpg","288 contacts","Common matched kit configuration, still individual modules.","Desktop","Common"],
  ["DDR4","DIMM","DDR4 Klevv 8GB module","Klevv DDR4-2400 CL 15-15-15 8GB 1.2V.jpg","288 contacts","DDR4-2400 label and voltage example.","Desktop","Common"],
  ["DDR4","DIMM","DDR4 RGB heat spreader","HyperX HX432C16FB4AK2 32 Dsc00420 RAW 202107230552crop cens.jpg","288 contacts","LED/RGB cover, unchanged DDR4 electrical generation.","Gaming","Common"],
  ["DDR4","SO-DIMM","DDR4 16GB Micron laptop RAM","DDR 4 RAM SO-DIMM 16GB by Micron-top front PNr°0840.jpg","260 contacts","DDR4 laptop module, different from DDR5's 262 contacts.","Laptop","Common"],
  ["DDR4","SO-DIMM","DDR4 8GB Samsung SO-DIMM","DDR 4 RAM SO-DIMM 8GB by Samsung-top front PNr°0838.jpg","260 contacts","Typical unbuffered notebook RAM.","Laptop","Common"],
  ["DDR4","SO-DIMM","DDR4 laptop rear-side chips","DDR 4 RAM SO-DIMM 16GB by Micron-top back PNr°0841.jpg","260 contacts","Compare rear side for two-sided chip population.","Laptop","Common"],
  ["DDR4","SO-DIMM","DDR4 installed in ThinkPad","KVR24S17D8-16 x2 on ThinkPad T470p 20170724.jpg","260 contacts","Installed laptop module shows real slot arrangement.","Laptop","Common"],
  ["DDR4","RDIMM / ECC","DDR4 ECC RDIMM server pair","Two 8 GB DDR4-2133 ECC 1.2 V RDIMMs (straightened).jpg","288 contacts","DDR4 registered ECC server modules; not for ordinary desktop UDIMM slots.","Server","Uncommon"],
  ["DDR4","RDIMM / ECC","DDR4 Micron server ECC memory","Micron mt36asf4g72lz-2g6d1qg-side1 azonenberg mit1x.jpg","288 contacts","High-density server module; check register/buffer from exact label.","Server","Uncommon"],
  ["DDR4","LRDIMM","DDR4 Micron 32GB LRDIMM front","Micron Crucial 32GB DDR4-2666 LRDIMM ECC MTA36ASF4G72LZ-2G6D1SG - front view.jpg","288 contacts","Load-reduced memory with buffering, not interchangeable with UDIMM.","Server","Rare"],
  ["DDR4","LRDIMM","DDR4 Samsung 32GB LRDIMM front","Samsung 32GB DDR4-2133 ECC LRDIMM M386A4G40DM0-CPB - front view.jpg","288 contacts","Alternative manufacturer load-reduced server module.","Server","Rare"],
  ["DDR4","LRDIMM","DDR4 Samsung LRDIMM reverse","Samsung 32GB DDR4-2133 ECC LRDIMM M386A4G40DM0-CPB - rear view.jpg","288 contacts","Rear-chip layout view.","Server","Rare"],
  // DDR5
  ["DDR5","UDIMM","DDR5 unbuffered desktop module","DDR5 SDRAM IMGP6295 smial wp.jpg","288 contacts","Modern DDR5 with different notch from DDR4; common on-module PMIC.","Desktop","Common"],
  ["DDR5","UDIMM","DDR5 unbuffered DIMM close-up","DDR5 SDRAM IMGP6304 smial wp.jpg","288 contacts","Detailed DIMM chip layout.","Desktop","Common"],
  ["DDR5","UDIMM","DDR5 RGB desktop memory","2023 Pamięci Corsair Vengeance RGB.jpg","288 contacts","Enthusiast RGB kit, still DDR5 UDIMM electrically.","Gaming","Common"],
  ["DDR5","SO-DIMM","DDR5 Ramaxel 16GB SO-DIMM","Ramaxel 16 GB DDR5-5600 SO-DIMM memory module.jpg","262 contacts","Modern DDR5 laptop memory.","Laptop","Common"],
  ["DDR5","SO-DIMM","DDR5 Micron 32GB SO-DIMM front","Micron 32 GB DDR5-5600 SO-DIMM - front view.jpg","262 contacts","Close-up current-gen laptop module.","Laptop","Common"],
  ["DDR5","SO-DIMM","DDR5 Kingston FURY 32GB laptop front","Kingston FURY Impact DDR5 SO-DIMM Laptop Memory 32GB Module - front view.jpg","262 contacts","Performance DDR5 SO-DIMM; not CUDIMM.","Laptop","Common"],
  ["DDR5","SO-DIMM","DDR5 Kingston FURY reverse","Kingston FURY Impact DDR5 SO-DIMM Laptop Memory 32GB Module - rear view.jpg","262 contacts","Rear side for comparison.","Laptop","Common"],
  ["DDR5","SO-DIMM","DDR5 SK hynix 8GB SO-DIMM","SK hynix 8 GB DDR5-4800 SO-DIMM HMCG66MEBSA092N.jpg","262 contacts","Current common OEM laptop module.","Laptop","Common"],
  ["DDR5","SO-DIMM","DDR5 CXMT SO-DIMM","CXMT DDR5 SODIMM.png","262 contacts","Another IC manufacturer's actual DDR5 laptop module.","Laptop","Uncommon"],
  ["DDR5","MRDIMM","DDR5 SK hynix Tall MRDIMM","SK Hynix DDR5 Tall MRDIMM.jpg","Platform-specific","Multiplexed-rank high-bandwidth server memory. Tall form needs suitable chassis clearance.","Server","Rare"],
  ["DDR5","CUDIMM","DDR5 clocked DIMM on display","Eindrücke von der COMPUTEX 2024 ( 极客湾Geekerwan) 12.png","288 contacts","Clock driver distinguishes CUDIMM; exhibition photo, may show multiple objects.","New desktop","Rare"],
  ["DDR5","CSODIMM","DDR5 clocked SO-DIMM showcase","Eindrücke von der COMPUTEX 2024 ( 极客湾Geekerwan) 16.png","262 contacts","Client clock driver (CKD) used at faster speeds. Exhibition photo.","New laptop","Rare"],
  ["DDR5","CAMM2","DDR5 CAMM2 motherboard display","Teamgroup CAMM2 memory modules and SSD Computex 2025.jpg","Compression connector","Flat screw-down next-generation module; DDR5 and LPDDR designs must not be interchanged.","Workstation / laptop","Rare"],
  ["DDR5","CAMM2","CAMM2 memory module display","Amphenol CAMM2 RAM display.jpg","Compression connector","Flat memory standard, not a regular DIMM slot.","Laptop / concept","Rare"],
  ["DDR5","SOCAMM","SK hynix SOCAMM showcase","SK Hynix SOCAMM module Computex 2025.jpg","Specialist connector","Specialist compact server/accelerator memory.","AI / server","Rare"],
  // Rambus
  ["Rambus","RIMM","Rambus RIMM module","Samsung RIMM Memory.jpg","Commonly 184 contacts","RDRAM architecture: NOT DDR, despite similar appearance.","Pentium 4 / workstation","Rare"],
  ["Rambus","RIMM","RIMM with metal cover","RAMBUS-Memory.jpg","Varies","Typical Rambus heat-spreader assembly.","Pentium 4","Rare"],
  ["Rambus","RIMM","Opened RIMM assembly","HYR186420G-653 opened.jpg","RIMM-specific","The cover removed reveals IC placement.","Vintage enthusiast","Rare"],
  ["Rambus","CRIMM","CRIMM continuity filler module","RDRAM-und-sein-CRIMM.jpg","RIMM socket","A CRIMM is a continuity module, not usable RAM.","Rambus boards","Rare"],
  // removable low-power + soldered
  ["LPDDR","LPCAMM2","Essencore LPCAMM2 removable module","Essencore LPCAMM2 module on display at Computex 2025.jpg","Compression connector","LPDDR5/5X in removable module form: contrary to the usual soldered LPDDR arrangement.","New laptop","Rare"],
  ["LPDDR","LPDDR IC","LPDDR mobile memory chip","Lpddr.png","Soldered package","DRAM packages on embedded/mobile boards rather than removable DIMMs.","Mobile / embedded","Uncommon"],
  ["LPDDR","LPDDR IC","Nintendo Switch LPDDR packages","Nintendo Switch RAM klmbg2jenb(cropped).png","Soldered package","Actual Nintendo Switch PCB RAM ICs.","Console","Uncommon"],
  ["GDDR","GDDR6","RTX 3060 GDDR6 memory package","RTX 3060 12GB GDDR6 with GA104.png","Soldered BGA","Graphics RAM beside GPU; not a DIMM and not upgradeable like PC RAM.","Graphics card","Common"],
  ["HBM","HBM stack","Vega GPU HBM die/stack","AMD@14nm@GCN 5th gen@Vega10@Radeon RX Vega 64@HBM DRAM Die@ Stack-DSC08838-DSC08973 - ZS-retouched.jpg","Stacked on-package memory","High Bandwidth Memory is stacked near the GPU/accelerator.","GPU / AI","Rare"]
];
export const ramPhotos: RAMPhoto[] = rows.map(([generation,shape,title,file,pins,identify,usage,rarity],i)=>({
  id:"ram-photo-"+String(i+1).padStart(3,"0"),generation,shape,title,file,pins,identify,usage,
  rarity:rarity ?? "Uncommon",direct:true,
}));
/** Variants without a suitably exact, reusable photographic file in the vetted batch.
 * No unrelated photo is substituted just to fill space. */
export const awaitingPhotos = [
  ["Pre-SDR","DIP","FPM / EDO / BEDO individual IC package variants"],
  ["Pre-SDR","DIMM","Very early proprietary 72/100-pin DIMM formats"],
  ["SDR","RDIMM","SDR-era registered DIMM"],
  ["DDR","MicroDIMM","DDR1 MicroDIMM"],
  ["DDR2","MicroDIMM","DDR2 MicroDIMM"],
  ["DDR2","Mini-DIMM","DDR2 compact Mini-DIMM"],
  ["DDR3","MicroDIMM","DDR3 MicroDIMM (existence/model requires verification)"],
  ["DDR3","LRDIMM","DDR3 load-reduced DIMM"],
  ["DDR3","NVDIMM","DDR3 persistent/NVDIMM variants"],
  ["DDR4","NVDIMM","DDR4 NVDIMM-N with capacitor backup"],
  ["DDR4","VLP","DDR4 very-low-profile server DIMM"],
  ["DDR5","RDIMM","DDR5 registered server RDIMM"],
  ["DDR5","VLP","DDR5 VLP RDIMM"],
  ["DDR5","CSODIMM","CSODIMM isolated retail-product photograph"],
  ["DDR5","CUDIMM","CUDIMM isolated retail-product photograph"],
  ["DDR5","LRDIMM","DDR5 LRDIMM limited/specialist variants"],
  ["DDR5","CAMM2","DDR5 CAMM2 isolated module (not just display boards)"],
  ["LPDDR","LPDDR2/3/4/4X/5/5X/6","Individual identifiable soldered memory generations"],
  ["GDDR","GDDR1/2/3/4/5/5X/6X/7","Individually labelled BGA chips across all generations"],
  ["HBM","HBM1/2/2E/3/3E/4","Each stacked-memory generation and package photos"],
  ["Special","ECC UDIMM","Unbuffered ECC in SDR/DDR2/DDR3/DDR4/DDR5"],
  ["Special","SOCAMM2","SOCAMM2 package-specific photograph"],
] as const;

export function commonsFilePage(name:string) {
  return "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(name.replaceAll(" ","_"));
}
export function commonsThumb(name:string){
  return "https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(name.replaceAll(" ","_"))+"?width=700";
}
export function commonsSearch(term:string){
  return "https://commons.wikimedia.org/w/index.php?search="+encodeURIComponent(term)+"&title=Special:MediaSearch&type=image";
}
