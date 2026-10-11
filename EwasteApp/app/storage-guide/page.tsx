"use client";

import {useMemo,useRef,useState} from "react";
import Link from "next/link";
import {eras,items,storageSources,type StorageItem,type DriveKind} from "@/lib/storage-guide";
import {commonsFilePage,commonsThumb} from "@/lib/ram-gallery";
import styles from "../ram-guide/ram-guide.module.css";
import extra from "./storage-guide.module.css";

type Tab = "overview"|"timeline"|"catalogue"|"identify"|"anatomy"|"photos"|"quiz";
const tabs: {id:Tab;label:string}[] = [
 {id:"overview",label:"Start here"},{id:"timeline",label:"History"},{id:"catalogue",label:"Drive atlas"},
 {id:"identify",label:"Will it fit?"},{id:"anatomy",label:"Inside a drive"},{id:"photos",label:"Real photos"},{id:"quiz",label:"Bench scenarios"},
];
const kinds:("All"|DriveKind)[]=["All","HDD","SSD","Hybrid","Flash","Removable","Tape"];
const hostOptions=[
 {id:"sata25",title:"2.5-inch SATA laptop bay",accept:["sata"],why:"Uses SATA data/power in a laptop-size bay. Check drive thickness and the laptop's caddy or interposer."},
 {id:"sata35",title:"3.5-inch desktop SATA bay",accept:["sata","sata35"],why:"Supports SATA signalling; smaller 2.5-inch drives need appropriate mechanical mounting. A 3.5-inch HDD needs suitable power."},
 {id:"pata44",title:"44-pin laptop IDE/PATA bay",accept:["pata44"],why:"Requires laptop-size parallel ATA drive and often a manufacturer-specific caddy."},
 {id:"pata40",title:"40-pin desktop IDE/PATA bay",accept:["pata40"],why:"Requires a compatible desktop PATA device/controller and separate power. 44-pin laptop PATA needs a correctly wired adapter."},
 {id:"msata",title:"Confirmed mSATA socket",accept:["msata"],why:"A Mini PCIe-like connector does not imply it is electrically mSATA."},
 {id:"m2sata",title:"M.2 socket: SATA only",accept:["m2sata"],why:"M.2 is a shape. A SATA-only M.2 host cannot run a PCIe/NVMe SSD."},
 {id:"m2nvme",title:"M.2 socket: PCIe/NVMe only",accept:["m2nvme"],why:"A PCIe/NVMe-only M.2 host cannot run a SATA M.2 SSD."},
 {id:"m2both",title:"M.2 socket: confirmed SATA + NVMe",accept:["m2sata","m2nvme"],why:"Even dual-mode sockets have supported module sizes, lane limits and sometimes port sharing."},
 {id:"pcie",title:"PCIe expansion slot",accept:["pcie"],why:"Native PCIe SSD or properly matched M.2 adapter may work; boot support and lane wiring still require checking."},
 {id:"sas",title:"SAS controller/backplane",accept:["sas","sata","sata35"],why:"Many SAS host controllers also support SATA disks, but verify that exact controller and backplane. SAS disks do not work on SATA-only hosts."},
 {id:"u2",title:"U.2 NVMe-capable bay",accept:["u2"],why:"Requires the correct PCIe path, cable/backplane and host support."},
 {id:"scsi",title:"Matching parallel SCSI controller",accept:["scsi"],why:"Connector width, electrical signalling, drive ID and bus termination must all match."},
];
const realPhotos=[
 {title:"SATA desktop hard disk",file:"SATA-drive.jpg",group:"HDD",detail:"2007 Hitachi 3.5-inch SATA HDD. Source: Frettled."},
 {title:"SATA connector close-up",file:"Hard disk sata.JPG",group:"Connector",detail:"A real photograph of a SATA hard-drive connector."},
 {title:"Inside a magnetic hard drive",file:"Open hard-drive.jpg",group:"Anatomy",detail:"Exposed platter and actuator; historical disassembly photo, not a repair procedure."},
 {title:"mSATA solid-state drive",file:"MSATA SSD.jpg",group:"SSD",detail:"A compact mSATA module. Source: Useranonymoususer."},
 {title:"mSATA vs M.2 SATA/NVMe",file:"MSATA SATA M.2 NVMeSSD.jpg",group:"Comparison",detail:"Photograph of related, non-interchangeable compact SSD formats. Verify each part label."},
 {title:"HDD mounted using SATA",file:"HDD-SATA.jpg",group:"Installed",detail:"Contemporary photo of a SATA HDD installed in a computer case."},
];
const components = [
 {id:"platter",name:"HDD platter",short:"Magnetic recording surface",note:"Spins beneath a precisely positioned head. Impacts and contamination can destroy data; do not open serviceable HDDs on the bench."},
 {id:"head",name:"Actuator / read-write heads",short:"Positioning and signal transducer",note:"Moves across tracks without normally touching the surface. Clicking and repeated re-seeks may indicate failure; protect data first."},
 {id:"motor",name:"Spindle motor",short:"HDD rotational system",note:"Runs the platter stack at an engineered rotational speed. A seized motor is specialist recovery work."},
 {id:"pcb",name:"Drive PCB & connectors",short:"Controller and interface",note:"Contains interface and power circuitry. Swapping an HDD PCB rarely works without matching adaptive firmware / ROM data."},
 {id:"nand",name:"NAND flash packages",short:"Non-volatile SSD data storage",note:"Stores bits in flash cells. SLC, MLC, TLC and QLC describe bits per cell, not the drive's physical connector."},
 {id:"ssdcontroller",name:"SSD controller",short:"Mapping, wear levelling, error correction",note:"Translates logical blocks into physical NAND locations and manages flash health; abrupt power loss can complicate recovery."},
 {id:"dram",name:"DRAM cache / HMB",short:"SSD metadata acceleration",note:"Some SSDs use dedicated DRAM while DRAM-less NVMe models may use Host Memory Buffer. DRAM presence alone does not prove endurance."},
 {id:"capacitor",name:"Power-loss protection",short:"Optional enterprise SSD feature",note:"Enterprise designs can use capacitors to protect in-flight writes. A consumer SSD without them is not automatically faulty."},
];
const quiz=[
 {q:"A 2015 laptop has a 2.5-inch SATA HDD, 7 mm tall, that has become very slow. Which upgrade is the strongest first candidate?",o:["A 7 mm 2.5-inch SATA SSD","An M.2 PCIe NVMe 2280 card","A 3.5-inch 12V SATA HDD"],a:0,why:"A matching SATA SSD keeps the same interface and bay envelope; you still need to check caddy, OS imaging and drive health."},
 {q:"An M.2 drive slides into the slot without resistance, but the firmware cannot detect it. Which conclusion is safest?",o:["The drive is confirmed compatible","The SSD must be electrically dead","The host may support a different protocol"],a:2,why:"M.2 describes the card form; SATA versus PCIe/NVMe, firmware, lane support and length still matter."},
 {q:"You find a used 2.5-inch enterprise SAS hard drive and an ordinary desktop SATA port. What's the likely outcome?",o:["It negotiates SATA compatibility","It needs a SAS controller/backplane","It works if power is adapted"],a:1,why:"Ordinary SATA hosts do not speak SAS. A SAS host often accepts SATA disks, but not the reverse."},
 {q:"A drive is advertised as PCIe 4.0 x4, but the system supports PCIe 3.0 x4. How should you assess it?",o:["Likely negotiates a slower supported link","It necessarily overheats and fails","The M.2 connector always blocks it"],a:0,why:"PCIe generally negotiates a common link generation and lane count. Boot, socket and thermal support remain separate checks."},
 {q:"A second-hand NVMe SSD is to be resold after processing client data. What is the correct first planning question?",o:["Whether a quick format hides files","Whether SMART health shows zero errors","Which verified sanitisation method applies"],a:2,why:"Sanitisation policy, device-specific command support, verification and evidence matter; deleting files or quick formatting is insufficient."},
 {q:"A 3.5-inch HDD does not spin on a small USB-to-SATA cable used for laptop SSDs. What's the best first check?",o:["Whether the HDD is actually NVMe","Whether 12V power is being supplied","Whether the platter needs cleaning"],a:1,why:"Desktop HDDs typically require 12V in addition to 5V. Many simple USB-to-SATA leads power only 2.5-inch devices."},
 {q:"A 2.5-inch SSD has L-shaped SATA contacts, but the server expects 2.5-inch U.2 NVMe carriers. What do you verify?",o:["Backplane protocol and carrier compatibility","Only the two devices' outer dimensions","Only that the SSD capacity matches"],a:0,why:"2.5-inch specifies external dimensions, not protocol. SATA, SAS and U.2 may require different signal paths/backplanes."},
 {q:"A failing hard disk intermittently disappears and contains irreplaceable family photographs. What comes before repair experiments?",o:["Defragmenting the disk completely","Protecting data and planning recovery","Opening the lid to inspect the heads"],a:1,why:"Minimise further reads and writes. Image/recover appropriately or seek specialist help before repeated tests or destructive procedures."},
 {q:"A 2280 M.2 SATA module is replaced with an identically sized 2280 M.2 NVMe module. Which statement is correct?",o:["Equal width guarantees it works","Equal capacity guarantees it works","Host protocol support decides compatibility"],a:2,why:"The numbers denote dimensions: 22 mm wide by 80 mm long. They do not establish SATA versus NVMe support."},
 {q:"What is the most informative comparison when choosing a refurbished SSD for important everyday use?",o:["Only the drive's advertised peak speed","Health, workload, endurance and compatibility","Whether its NAND packages are visible"],a:1,why:"A reliable refurb choice depends on model and firmware, health, endurance, interface, fit, capacity and verified data erasure."},
];

function DriveGraphic({entry}:{entry:StorageItem}) {
 const thin=entry.format.includes("M.2")||entry.format.includes("mSATA");
 const flat=entry.kind==="Flash"||entry.kind==="Tape"||entry.kind==="Removable";
 return <div className={extra.graphicWrap}>
   <div className={thin?extra.stick:flat?extra.media:extra.disk}>
     <span className={extra.graphicLabel}>{entry.kind} / {entry.format}</span>
     {entry.kind==="HDD"||entry.kind==="Hybrid"?<span className={extra.platter} aria-hidden="true"/>:<span className={extra.memory} aria-hidden="true">▣ ▣ ▣</span>}
     <span className={extra.interface}>{entry.interface}</span>
   </div>
   <small>SCHEMATIC ONLY · NOT TO SCALE</small>
 </div>;
}
function RealPhoto({file,title}:{file:string;title:string}){
 const [broken,setBroken]=useState(false);
 return broken?<div className={extra.photoFailed}>Photograph unavailable. Open the original source below.</div>:
 // Commons is the photo host; direct source URL retained for licence and attribution.
 // eslint-disable-next-line @next/next/no-img-element
 <img className={extra.photo} src={commonsThumb(file)} loading="lazy" alt={"Real photograph: "+title} onError={()=>setBroken(true)}/>;
}
export default function StorageGuide(){
 const [tab,setTab]=useState<Tab>("overview");
 const contentRef=useRef<HTMLDivElement>(null);
 const tabsRef=useRef<HTMLElement>(null);
 const navigate=(next:Tab)=>{
  setTab(next);
  window.requestAnimationFrame(()=>{
   const strip=tabsRef.current;
   const active=strip?.querySelector<HTMLButtonElement>(`[data-storage-tab="${next}"]`);
   if(strip&&active)strip.scrollTo({left:active.offsetLeft-(strip.clientWidth-active.offsetWidth)/2,behavior:"smooth"});
   contentRef.current?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  });
 };
 const [term,setTerm]=useState("");
 const [kind,setKind]=useState<"All"|DriveKind>("All");
 const [era,setEra]=useState("All");
 const [selectedId,setSelectedId]=useState("sata-ssd");
 const [compare,setCompare]=useState<string[]>([]);
 const [host,setHost]=useState("sata25");
 const [activeComponent,setActiveComponent]=useState("platter");
 const [qIndex,setQIndex]=useState(0);
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const erasList=["All",...new Set(items.map(x=>x.era))];
 const visible=useMemo(()=>items.filter(x=>(kind==="All"||x.kind===kind)&&(era==="All"||x.era===era)&&[x.title,x.kind,x.era,x.format,x.interface,x.protocol,x.spot].join(" ").toLowerCase().includes(term.trim().toLowerCase())),[term,kind,era]);
 const chosen=items.find(x=>x.id===selectedId)??items[16];
 const chosenHost=hostOptions.find(x=>x.id===host)??hostOptions[0];
 const candidate=chosenHost.accept.includes(chosen.host);
 const picks=compare.map(id=>items.find(x=>x.id===id)).filter((x):x is StorageItem=>Boolean(x));
 const toggleCompare=(id:string)=>setCompare(prev=>prev.includes(id)?prev.filter(x=>x!==id):prev.length<3?[...prev,id]:[...prev.slice(1),id]);
 const answered=Object.keys(answers).length;
 const score=quiz.filter((q,i)=>answers[i]===q.a).length;
 const q=quiz[qIndex];

 return <main className={styles.page}><div className={styles.wrap}>
  <header className={styles.top}><Link href="/learn">← Circular Learning Hub</Link><span>FIELD GUIDE / COMPUTER STORAGE</span><Link href="/ram-guide">RAM Explorer ↗</Link></header>
  <section className={styles.hero}>
   <div><div className={styles.kicker}><span className={styles.dot}/> HARDWARE HISTORY / REPAIR BENCH</div>
    <h1>THE STORAGE<br/><em>EXPLORER.</em></h1>
    <p>From room-sized disks to M.2 NVMe, enterprise SSDs and removable media. Learn to recognise the drive, match the interface, and make safer refurbishment decisions.</p>
    <div className={styles.heroActions}><button onClick={()=>navigate("catalogue")}>Browse storage types ↗</button><button className={styles.ghost} onClick={()=>navigate("identify")}>Check a drive →</button></div>
   </div>
   <div className={extra.heroArt} aria-label="Illustrated old hard disk and modern SSD">
     <div className={extra.bigDisk}><div className={extra.bigPlatter}/><div className={extra.arm}/><span>HDD / MAGNETIC</span></div>
     <div className={extra.bigSSD}><span>M.2 / NVMe</span><div>▣　▣　▣</div><small>PCIe · FLASH</small></div>
     <div className={extra.heroArtFoot}>ILLUSTRATIONS ONLY · NOT TO SCALE</div>
   </div>
  </section>
  <div className={styles.stats}><span><strong>{eras.length}</strong> timeline periods</span><span><strong>{items.length}</strong> storage formats</span><span><strong>6</strong> technology families</span><span><strong>{realPhotos.length}</strong> checked real photos</span></div>
  <nav ref={tabsRef} className={styles.tabs} aria-label="Storage Explorer sections">{tabs.map(t=><button type="button" key={t.id} data-storage-tab={t.id} className={tab===t.id?styles.active:""} aria-current={tab===t.id?"page":undefined} onClick={()=>navigate(t.id)}>{t.label}</button>)}</nav>
  <div ref={contentRef} className={styles.content}>
   {tab==="overview"&&<section className={styles.section}>
    <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>THE FOUR-LAYER RULE</span><h2>A matching shape is not a matching drive.</h2><p>Storage names often mix up four distinct questions. Work through each before ordering a part or connecting an unknown donor drive.</p></div></div>
    <div className={extra.fourGrid}>{[
     ["01","Storage technology","Magnetic HDD, NAND SSD, hybrid, optical, tape or removable flash."],
     ["02","Physical form factor","3.5-inch or 2.5-inch drive; M.2 2230/2242/2280/22110; U.2/U.3; EDSFF."],
     ["03","Electrical connection","PATA/IDE, SATA, SAS, PCIe, SCSI, USB and other connector families."],
     ["04","Protocol and host support","ATA/AHCI, NVMe, SCSI, UFS or device-specific signalling; plus firmware and power."]
    ].map(([n,title,desc])=><article key={n} className={styles.card}><span className={styles.num}>{n}</span><h3>{title}</h3><p>{desc}</p></article>)}</div>
    <div className={styles.callout}><strong>Common trap:</strong> M.2 is a physical module format; NVMe is a command protocol usually running over PCIe. Some M.2 drives are SATA, some are NVMe. A 2.5-inch drive may be SATA, SAS or U.2 NVMe.</div>
    <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>LEARN BY DOING</span><h2>Use it at the workbench.</h2></div></div>
    <div className={styles.three}>{[
     ["01 / Recognise","Use the illustrated type atlas and historical timeline to classify the drive."],
     ["02 / Verify","Check connector, host protocol, size, firmware support and power before any connection."],
     ["03 / Preserve","For used drives, consider client data, health, sanitisation evidence and reuse or recycling."]
    ].map(([title,desc])=><article className={styles.card} key={title}><h3>{title}</h3><p>{desc}</p></article>)}</div>
    <div className={extra.actionRow}><button onClick={()=>navigate("timeline")}>Explore history →</button><button onClick={()=>navigate("quiz")}>Try bench scenarios →</button></div>
   </section>}
   {tab==="timeline"&&<section className={styles.section}>
    <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>FROM 1956 TO TODAY</span><h2>How storage evolved.</h2><p>Approximate eras overlap. Formats, interfaces, protocols and recording technologies do not all advance in lock-step.</p></div></div>
    <div className={styles.timeline}>{eras.map((e,i)=><article key={e.year} className={styles.era}><span className={styles.eraDot}/><span className={styles.eraNumber}>{String(i+1).padStart(2,"0")}</span><div><span className={styles.eraYears}>{e.year}</span><h3>{e.title}</h3><p>{e.description}</p></div></article>)}</div>
    <div className={styles.callout}><strong>Speed isn't the whole timeline:</strong> SATA 1.5/3/6 Gb/s are link rates, not guaranteed MB/s throughput. PCIe Gen3/4/5 speed depends on link width, SSD controller, cooling and workload. SATA-IO recommends naming drives by speed, not informal “SATA II/III” labels.</div>
   </section>}
   {tab==="catalogue"&&<section className={styles.section}>
    <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>SEARCHABLE TECHNICAL FIELD ATLAS</span><h2>Every major drive family, side by side.</h2><p>Use text and filters to narrow down hardware. Illustrated shapes are schematic; verified source photographs have their own tab.</p></div></div>
    <div className={styles.filters}><input type="search" aria-label="Search storage types" placeholder="Try 44-pin IDE, M.2 2280, U.2, floppy, SATA…" value={term} onChange={e=>setTerm(e.target.value)}/><select aria-label="Technology type" value={kind} onChange={e=>setKind(e.target.value as "All"|DriveKind)}>{kinds.map(k=><option key={k} value={k}>{k==="All"?"All technologies":k}</option>)}</select><select aria-label="Historical period" value={era} onChange={e=>setEra(e.target.value)}>{erasList.map(e=><option key={e}>{e}</option>)}</select></div>
    <p className={extra.results}>{visible.length} of {items.length} entries · Select a card to inspect or add up to three to compare</p>
    <div className={extra.atlas}>{visible.map(item=><article key={item.id} className={extra.driveCard}>
      <div className={extra.cardHeader}><span>{item.kind}</span><span>{item.era}</span></div>
      <button className={extra.itemButton} type="button" onClick={()=>setSelectedId(item.id)} aria-pressed={chosen.id===item.id}><DriveGraphic entry={item}/><h3>{item.title}</h3></button>
      <p>{item.format} · {item.interface}</p>
      <p className={extra.spot}>{item.spot}</p>
      <div className={extra.cardButtons}><button onClick={()=>{setSelectedId(item.id);setTab("identify");contentRef.current?.scrollIntoView({block:"start"})}}>Check connection ↗</button><button onClick={()=>toggleCompare(item.id)} aria-pressed={compare.includes(item.id)}>{compare.includes(item.id)?"✓ Selected":"+ Compare"}</button></div>
    </article>)}</div>
    {visible.length===0&&<div className={styles.callout}>No matches. Try a different search term or technology filter.</div>}
    {picks.length>0&&<div className={extra.comparison} id="storage-comparison"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>SELECTED HARDWARE</span><h2>Compare {picks.length} storage formats.</h2></div><button onClick={()=>setCompare([])}>Clear selection</button></div><div className={extra.compareGrid}>{picks.map(item=><article className={styles.card} key={item.id}><h3>{item.title}</h3><p><strong>Era:</strong> {item.era}</p><p><strong>Shape:</strong> {item.format}</p><p><strong>Electrical:</strong> {item.interface}</p><p><strong>Protocol:</strong> {item.protocol}</p><p><strong>Connection:</strong> {item.connection}</p><p><strong>Recognise:</strong> {item.spot}</p><p><strong>Warning:</strong> {item.caveat}</p></article>)}</div></div>}
   </section>}
   {tab==="identify"&&<section className={styles.section}>
    <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>COMPATIBILITY CROSS-CHECK</span><h2>Would this drive fit?</h2><p>Select a known host socket and a drive from the atlas. The result is only an initial interface check, never a final compatibility certificate.</p></div></div>
    <div className={styles.identify}><div className={styles.identifyForm}>
     <label>Computer / controller connection<select value={host} onChange={e=>setHost(e.target.value)}>{hostOptions.map(h=><option key={h.id} value={h.id}>{h.title}</option>)}</select></label>
     <label>Drive you want to install<select value={selectedId} onChange={e=>setSelectedId(e.target.value)}>{items.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
     <div className={extra.miniData}><strong>{chosen.format}</strong><span>{chosen.interface}</span><span>{chosen.protocol}</span></div>
     <DriveGraphic entry={chosen}/>
    </div><div className={styles.identifyResult}>
      <span className={styles.eyebrow}>INTERFACE ASSESSMENT</span>
      <span className={candidate?styles.resultRare:styles.resultNo}>{candidate?"POSSIBLE MATCH · VERIFY DETAILS":"NOT A DIRECT MATCH / SPECIALIST CHECK"}</span>
      <h3>{chosen.title}</h3><p><strong>Host:</strong> {chosenHost.title}</p><p>{candidate?"The drive family may match the selected host electrically, but this does not establish physical mounting, bootability or data access.":"This host is not established as a direct connection for that drive type. Do not force connectors or assume adapters will translate protocols."}</p>
      <p><strong>Check next:</strong> {chosenHost.why}</p><p><strong>Drive-specific warning:</strong> {chosen.caveat}</p>
     </div></div>
     <div className={styles.sectionHeading}><div><h2>Bench-side decision checklist.</h2></div></div>
     <ol className={styles.checks}><li><strong>Read the exact label:</strong> manufacturer part number, model and firmware.</li><li><strong>Check physical dimensions:</strong> width, length, thickness, mounting and connector orientation.</li><li><strong>Confirm electrical support:</strong> interface, protocol, power and controller/backplane.</li><li><strong>Protect the data:</strong> secure authorisation, health screening and recorded sanitisation or recovery plan.</li></ol>
     <div className={styles.callout}><strong>Reuse-first ITAD:</strong> Do not erase a customer drive without authority. HDD and SSD sanitisation methods differ: flash translation layers can make simple overwrite assumptions unsafe. Record method, verification and chain of custody.</div>
   </section>}
   {tab==="anatomy"&&<section className={styles.section}>
    <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>MECHANICAL VERSUS SOLID STATE</span><h2>What's actually inside?</h2><p>Explore parts from a traditional HDD and NAND flash SSD. The component descriptions are educational, not a guide to opening live drives.</p></div></div>
    <div className={styles.anatomy}>
     <div className={extra.anatomyPanels}><div className={extra.anatomyDisc}><span>HDD · MAGNETIC PLATTERS</span><div className={extra.largePlatter}/><button onClick={()=>setActiveComponent("platter")}>Platter</button><button onClick={()=>setActiveComponent("head")}>Heads / actuator</button><button onClick={()=>setActiveComponent("motor")}>Spindle motor</button><button onClick={()=>setActiveComponent("pcb")}>Controller PCB</button></div>
      <div className={extra.anatomyFlash}><span>SSD · NAND + CONTROLLER</span><div>▣　▣　▣　▣</div>{components.filter(c=>["nand","ssdcontroller","dram","capacitor"].includes(c.id)).map(c=><button key={c.id} onClick={()=>setActiveComponent(c.id)}>{c.name}</button>)}</div></div>
     <div className={styles.anatomyInfo}><span className={styles.eyebrow}>SELECTED COMPONENT</span><h3>{components.find(x=>x.id===activeComponent)?.name}</h3><strong>{components.find(x=>x.id===activeComponent)?.short}</strong><p>{components.find(x=>x.id===activeComponent)?.note}</p><div className={styles.chipButtons}>{components.map(c=><button key={c.id} className={activeComponent===c.id?styles.chosen:""} onClick={()=>setActiveComponent(c.id)}>{c.name}</button>)}</div></div>
    </div>
    <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>MORE THAN A LABEL</span><h2>Storage terminology that gets mixed up.</h2></div></div>
    <div className={styles.catalog}>{[
      ["CMR vs SMR","Magnetic recording layout, not the HDD interface. Shingled recording can change sustained rewrite behaviour."],
      ["SLC / MLC / TLC / QLC","Bits stored in each NAND cell. Real endurance and speed also depend on the entire SSD design."],
      ["NVMe vs PCIe","NVMe is a command protocol; PCIe transports it. Multiple PCIe lane counts and generations exist."],
      ["SMART / NVMe health","Useful diagnostic telemetry, not a guarantee that a used drive will keep working."],
      ["TRIM / deallocate","Host hints that some logical blocks are no longer used. It is not proof of sanitisation."],
      ["Encrypted vs sanitised","Encryption can support cryptographic erase when verified policy and implementation requirements are met."]
    ].map(([name,desc])=><article className={styles.card} key={name}><h3>{name}</h3><p>{desc}</p></article>)}</div>
   </section>}
   {tab==="photos"&&<section className={styles.section}>
    <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>GROUNDED VISUAL REFERENCE</span><h2>Real photos, with original sources.</h2><p>These example photos were located on individual Wikimedia Commons file pages. They are a starter archive, not photographs of every atlas entry.</p></div></div>
    <div className={extra.photoGrid}>{realPhotos.map(p=><article className={extra.photoCard} key={p.file}><RealPhoto file={p.file} title={p.title}/><div className={extra.photoDetails}><small>{p.group} / REAL PHOTOGRAPH</small><h3>{p.title}</h3><p>{p.detail}</p><a href={commonsFilePage(p.file)} target="_blank" rel="noopener noreferrer">Original photo, creator and licence ↗</a></div></article>)}</div>
    <div className={styles.callout}><strong>Source integrity:</strong> Each photo points to an exact file page, rather than a generic search. Check photographer and individual licence before republishing. Missing images show a fallback instead of a broken card.</div>
   </section>}
   {tab==="quiz"&&<section className={styles.section}>
    <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>APPLIED REPAIR THINKING</span><h2>What would you do at the bench?</h2><p>Case-based questions assess decisions rather than memorised connector names. Each answer explains the technical reasoning.</p></div></div>
    <div className={styles.quizShell}><div className={styles.quizProgress}><div style={{width:((answered/quiz.length)*100)+"%"}}/></div><div className={styles.quizCounter}>SCENARIO {qIndex+1} OF {quiz.length} · {score} CORRECT</div><h3>{q.q}</h3>
    <div className={styles.answers}>{q.o.map((opt,i)=><button type="button" key={opt} className={answers[qIndex]===i?styles.answerSelected:""} disabled={answers[qIndex]!==undefined} onClick={()=>setAnswers(prev=>({...prev,[qIndex]:i}))}><span>{String.fromCharCode(65+i)}</span>{opt}</button>)}</div>
    {answers[qIndex]!==undefined&&<p className={answers[qIndex]===q.a?styles.good:styles.wrong}><strong>{answers[qIndex]===q.a?"Correct.":"Not quite."}</strong> {q.why}</p>}
    <div className={styles.quizFooter}><span>{answered===quiz.length?"Finished: "+score+"/"+quiz.length+" correct":answered+" of "+quiz.length+" answered"}</span><div className={extra.quizButtons}><button disabled={qIndex===0} onClick={()=>setQIndex(i=>i-1)}>← Previous</button><button disabled={qIndex===quiz.length-1} onClick={()=>setQIndex(i=>i+1)}>Next →</button><button onClick={()=>{setAnswers({});setQIndex(0)}}>Restart</button></div></div></div>
   </section>}
  </div>
  <footer className={styles.footer}><div><strong>FIELD GUIDE / STORAGE EXPLORER</strong><p>Historical eras are approximate; each card describes a family rather than certifying interchangeability. Photograph references are examples. Never connect, open, erase or power an unknown client device without the right authority and safety checks.</p><Link href="/ram-guide">Compare with the RAM Explorer →</Link></div><div className={styles.sources}><span>TECHNICAL REFERENCES</span>{storageSources.map(x=><a href={x.url} target="_blank" rel="noopener noreferrer" key={x.url}>{x.title} ↗</a>)}<small>Sources cross-checked October 2026. Verify exact part and manufacturer service documentation before use.</small></div></footer>
 </div></main>;
}
