"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "./ram-guide.module.css";

type Tab = "explore" | "timeline" | "modules" | "anatomy" | "identify" | "quiz";
type Status = "yes" | "rare" | "no";
type Generation = { id: string; name: string; years: string; desktop: string; laptop: string; voltage: string; rates: string; note: string; category?: string };
type Module = { name: string; description: string; family: string; code: string; hint: string };

const generations: Generation[] = [
  { id: "pre", name: "Pre-SDR", years: "1970s–1990s", desktop: "DIP, SIPP, 30/72-pin SIMM; early DIMM", laptop: "Proprietary, SIMM and early SO-DIMM", voltage: "Often 5V, later 3.3V", rates: "Asynchronous; not rated in MT/s like DDR", note: "DIP chips and SIPP/SIMM modules; FPM, EDO and rare BEDO DRAM. These are different generations of technology and package, not one standard." },
  { id: "sdr", name: "SDR SDRAM", years: "~1996–2003", desktop: "168-pin DIMM", laptop: "144-pin SO-DIMM", voltage: "3.3V typically", rates: "66–133 MT/s typical", note: "Synchronous single data rate. Distinct from Rambus RDRAM, which used RIMM modules." },
  { id: "ddr", name: "DDR (DDR1)", years: "~2000–2007", desktop: "184-pin DIMM", laptop: "200-pin SO-DIMM", voltage: "2.5V nominal", rates: "200–400 MT/s common", note: "Double Data Rate SDRAM; data transfers on both clock edges." },
  { id: "ddr2", name: "DDR2", years: "~2003–2011", desktop: "240-pin DIMM", laptop: "200-pin SO-DIMM", voltage: "1.8V nominal", rates: "400–1066 MT/s common", note: "Same desktop pin count as DDR3, but different electrical design and key position." },
  { id: "ddr3", name: "DDR3", years: "~2007–2018", desktop: "240-pin DIMM", laptop: "204-pin SO-DIMM", voltage: "1.5V; DDR3L 1.35V", rates: "800–2133 MT/s typical", note: "DDR3L is a lower-voltage variant; compatibility depends on the system and module." },
  { id: "ddr4", name: "DDR4", years: "~2014–present legacy", desktop: "288-pin DIMM", laptop: "260-pin SO-DIMM", voltage: "1.2V nominal", rates: "1600–3200 MT/s JEDEC common", note: "DDR4 and DDR5 both have 288 desktop contacts but cannot be interchanged." },
  { id: "ddr5", name: "DDR5", years: "~2021–present", desktop: "288-pin DIMM / CUDIMM / DDR5 CAMM2", laptop: "262-pin SO-DIMM / CSODIMM / DDR5 CAMM2", voltage: "1.1V nominal core; on-module PMIC", rates: "4800–6400+ MT/s standard and faster enthusiast kits", note: "Introduces on-module power management and an SPD hub. DDR5 uses two independent 32-bit subchannels per standard non-ECC UDIMM." },
  { id: "ddr6", name: "DDR6", years: "Future / developing as at Oct 2026", desktop: "No mainstream retail module specification to rely on", laptop: "Not an upgrade route to plan around", voltage: "Not established for this guide", rates: "Not established for this guide", note: "Included on the roadmap, not treated as a shipping everyday PC RAM generation." },
];

const families = [
  { name: "FPM DRAM", era: "1990s", kind: "Early PC", desc: "Fast Page Mode, common in 386/486-era PCs. Asynchronous DRAM, often on SIMMs." },
  { name: "EDO DRAM", era: "mid-1990s", kind: "Early PC", desc: "Extended Data Out improved access timing. Often 72-pin SIMMs; also early DIMMs." },
  { name: "BEDO DRAM", era: "1990s", kind: "Early PC", desc: "Burst EDO: a rare evolutionary branch, overshadowed by SDRAM." },
  { name: "Rambus RDRAM", era: "~1999–2004", kind: "Alternative PC", desc: "RIMM modules used in some Pentium 4 systems. Not DDR SDRAM, despite the similar era." },
  { name: "LPDDR1–LPDDR6", era: "2000s–2020s", kind: "Low-power", desc: "Low-power DDR for mobiles and thin computers. Usually soldered, but LPDDR5/5X can also be removable via LPCAMM2." },
  { name: "GDDR1–GDDR7", era: "2000s–2020s", kind: "Graphics", desc: "Graphics-oriented DRAM on GPUs. Generations do not mean plug-compatible system DDR generations." },
  { name: "HBM1–HBM4", era: "2010s–2020s", kind: "High bandwidth", desc: "Stacked High Bandwidth Memory placed close to accelerators; not user-replaceable DIMM sticks." },
  { name: "DDR6", era: "Future", kind: "Roadmap", desc: "Proposed successor to DDR5; do not infer current pin counts, compatibility or availability." },
];

const keys = ["pre","sdr","ddr","ddr2","ddr3","ddr4","ddr5","lpddr"] as const;
const columns = ["Pre-SDR","SDR","DDR","DDR2","DDR3","DDR4","DDR5","LPDDR5/X"];
const modules: Module[] = [
  { name:"DIP / DIPP chips", family:"Early", code:"y-------", description:"Individual through-hole DRAM ICs, sometimes socketed on the motherboard.",hint:"Chips, not DIMM-style sticks." },
  { name:"SIPP", family:"Early", code:"y-------", description:"Single In-line Pin Package: module with protruding pins, predecessor to SIMM.",hint:"Fragile wire-like pins on the bottom." },
  { name:"30-pin SIMM", family:"Early", code:"y-------", description:"Early narrow SIMM used in 286/386/early 486 machines.",hint:"30 edge contacts; not DDR." },
  { name:"72-pin SIMM", family:"Early", code:"y-------", description:"Common 1990s FPM/EDO era modules, 32-bit data bus.",hint:"Longer than the 30-pin SIMM." },
  { name:"RIMM (Rambus)", family:"Alternative", code:"-r------", description:"RDRAM module from a competing architecture. Amber marks era, NOT SDR compatibility.",hint:"RIMM socket; often heat-spreader; distinct keyed slots." },
  { name:"UDIMM / full DIMM", family:"Desktop", code:"yyyyyyy-", description:"Unbuffered desktop-size DIMMs. Early EDO DIMMs existed before SDR; modern DDR versions differ each generation.",hint:"Regular-length desktop stick; check label and notch." },
  { name:"SO-DIMM", family:"Laptop", code:"yyyyyyy-", description:"Small-outline removable laptop RAM; also pre-SDR EDO variants.",hint:"Shorter than UDIMM; each generation has its own contact count." },
  { name:"MicroDIMM", family:"Compact", code:"-yyyy---", description:"Very small removable module made in SDR, DDR, DDR2 and DDR3 versions. DDR3 214-pin models are confirmed by Sunmax manufacturer listings; always check the exact part.",hint:"Smaller than SO-DIMM; specialised and often obsolete." },
  { name:"Mini-DIMM", family:"Compact", code:"---yr---", description:"Special-purpose compact module for embedded/networking systems, notably DDR2; other versions vary by vendor.",hint:"Not interchangeable with a conventional SO-DIMM." },
  { name:"FB-DIMM", family:"Server", code:"---y----", description:"Fully Buffered DIMM using an Advanced Memory Buffer; commercially prominent with DDR2.",hint:"Server-era memory with a buffer chip; DDR3 follow-on was not broadly adopted." },
  { name:"RDIMM", family:"Server", code:"-yyyyyy-", description:"Registered/buffered address and command lines; distinct from ECC, though server RDIMMs commonly have ECC.",hint:"Motherboard and CPU must explicitly support RDIMMs." },
  { name:"LRDIMM", family:"Server", code:"----yyr-", description:"Load-reduced server DIMM with data buffering, used widely on DDR3/DDR4; DDR5 deployments are niche or platform-specific.",hint:"Do not assume RDIMM and LRDIMM mix." },
  { name:"NVDIMM", family:"Specialist", code:"----yy r-", description:"Non-volatile memory modules with DRAM/flash backup or other persistence technologies; terminology covers multiple architectures.",hint:"Check model, battery/supercap and platform support." },
  { name:"VLP DIMM", family:"Shape", code:"---yyyy-", description:"Very Low Profile is a height variant of UDIMM or RDIMM, not a new DRAM generation.",hint:"Same length, noticeably shorter PCB height; DDR5 exists." },
  { name:"CUDIMM", family:"DDR5 new", code:"------y-", description:"Clocked Unbuffered DIMM with CKD; physically DDR5 DIMM, but platform compatibility varies.",hint:"CKD clock driver; desktop form." },
  { name:"CSODIMM", family:"DDR5 new", code:"------y-", description:"Clocked SO-DIMM with CKD for DDR5 mobile/compact platforms.",hint:"SO-DIMM size, DDR5 era." },
  { name:"CAMM2 (DDR5)", family:"DDR5 new", code:"------y-", description:"Flat compression-attached replaceable memory using DDR5 chips.",hint:"Screw-down flat module; not slot-compatible with LPCAMM2." },
  { name:"LPCAMM2 (LPDDR5X)", family:"DDR5 new", code:"-------y", description:"Removable LPDDR5/5X-based CAMM2; an important exception to 'LPDDR is always soldered'.",hint:"Flat compression contacts and screws, low-power DRAM." },
  { name:"SOCAMM / SOCAMM2", family:"Specialist", code:"-------r", description:"Compact LPDDR-oriented modules seen in specialised AI/server designs; not consumer interchangeable RAM.",hint:"Ecosystem- and platform-specific; verify actual module." },
];
const cleanCode = (s:string) => s.replace(/\s/g,"");
const statusOf = (m:Module, index:number):Status => { const c=cleanCode(m.code)[index]; return c==="y"?"yes":c==="r"||c==="?"?"rare":"no"; };

const features = [
  { title:"ECC (module/system)", badge:"Reliability", description:"Extra data bits and controller support can detect/correct some memory errors. ECC can be unbuffered or registered; it is not itself a module shape." },
  { title:"On-die ECC", badge:"Inside chip", description:"DDR5 DRAM's internal error correction helps protect the silicon die, but is NOT a substitute for system-level end-to-end ECC RAM." },
  { title:"Registered / buffered", badge:"Server", description:"An RDIMM has a register for command/address signals to ease memory-controller load. Requires compatible hardware." },
  { title:"Load-reduced / fully buffered", badge:"Server", description:"LRDIMM adds data buffering; FB-DIMM uses a different AMB architecture. Neither is the same thing as ordinary ECC." },
  { title:"VLP / low-profile", badge:"Shape", description:"VLP means a shorter PCB height. It can be combined with multiple RAM generations and buffering types." },
  { title:"Low voltage", badge:"Power", description:"DDR3L (1.35V), DDR4L variants and different power grades exist. Voltage support is a platform question." },
  { title:"XMP / EXPO", badge:"Profiles", description:"Optional overclocking timing/voltage profiles stored in SPD. XMP originated in DDR3-era products; DDR2-era vendor profiles need qualification." },
  { title:"Heat spreader / RGB", badge:"Cosmetic & thermal", description:"Added metal covers and lighting, common in enthusiast DDR3–DDR5 kits; do not alter the underlying module generation." },
  { title:"Rank and channels", badge:"Layout", description:"Rank is a group of DRAM chips accessed together. Dual-channel refers to system memory architecture, not merely a two-sided stick." },
  { title:"Non-volatile backup", badge:"Persistence", description:"Certain NVDIMMs use flash and backup energy to preserve contents after power loss; not ordinary consumer DDR." },
];

const chips = [
  { id:"dram", title:"DRAM IC", subtitle:"Memory chips", detail:"Integrated Circuits containing the memory cells. Their density and organisation help determine capacity and rank. IC = Integrated Circuit." },
  { id:"pmic", title:"PMIC", subtitle:"Power Management Integrated Circuit", detail:"On many DDR5 DIMMs, the PMIC regulates incoming module power into the required rails. A failed PMIC or short can prevent a module from working; diagnosis requires safe, measured electrical testing." },
  { id:"spd", title:"SPD hub", subtitle:"Serial Presence Detect", detail:"Stores module identification, supported timings and profiles. DDR5 commonly uses an SPD hub with management functions and temperature-related capabilities. Corruption may cause boot issues, but it is not the only explanation." },
  { id:"ckd", title:"CKD", subtitle:"Client Clock Driver", detail:"On CUDIMM/CSODIMM, a clock driver re-drives the clock signal for higher data rates; using the same physical socket does not guarantee motherboard support." },
  { id:"rcd", title:"RCD / buffer", subtitle:"Registering clock driver", detail:"Server RDIMMs use registering circuitry for command/address signals; LRDIMMs add data-buffer functionality." },
  { id:"pins", title:"Contacts + notch", subtitle:"Mechanical keying", detail:"Gold fingers carry signals and power. Pin count AND notch position matter: DDR2/DDR3 each use 240 desktop pins; DDR4/DDR5 each use 288, yet are incompatible." },
];
const quizzes = [
  { q:"DDR4 and DDR5 desktop modules both have 288 contacts. Can you swap them?", options:["Yes, if capacity matches","No, the keying and electrical design differ","Yes, but only on servers"], correct:1, why:"Contact count alone does not establish compatibility; notches, signalling and platform support differ." },
  { q:"What does PMIC stand for?", options:["Power Management Integrated Circuit","Primary Memory Interface Controller","Processor Memory Interconnect Cable"], correct:0, why:"PMIC is a Power Management Integrated Circuit that handles power conversion and regulation." },
  { q:"Which statement about ECC is right?", options:["ECC is a DIMM form factor","All DDR5 on-die ECC equals system ECC","ECC is a reliability feature, not a physical shape"], correct:2, why:"ECC addresses error correction; RDIMM describes buffering, and UDIMM/SO-DIMM describe module types." },
  { q:"What makes LPCAMM2 unusual?", options:["It always means soldered RAM","It makes LPDDR5/5X available on a replaceable module","It fits any DDR5 DIMM slot"], correct:1, why:"LPCAMM2 uses detachable compression-attached LPDDR modules, in their own platform-specific socket." },
  { q:"Which module belonged to a rival RAM architecture?", options:["RIMM","CUDIMM","SO-DIMM"], correct:0, why:"RIMM carried Rambus RDRAM rather than DDR SDRAM." },
  { q:"A stick is labelled 240-pin DIMM. Which generations might it be?", options:["DDR2 or DDR3","DDR4 or DDR5","Only DDR2"], correct:0, why:"DDR2 and DDR3 desktop DIMMs share 240 pins but have different notch positions." },
  { q:"What does SPD store?", options:["Only the computer's passwords","Module information and timing profiles","A backup copy of every RAM cell"], correct:1, why:"Serial Presence Detect identifies the module and communicates supported parameters to the platform." },
];
const sources = [
  { label:"Kingston: DDR5 CUDIMM, CSODIMM, CAMM2 and MRDIMM", url:"https://www.kingston.com/en/blog/system-builder/understanding-memory-modules-cudimm-csodimm-camm2-mrdimm-video" },
  { label:"Samsung: removable LPCAMM2 explained", url:"https://semiconductor.samsung.com/dram/module/lpcamm2/" },
  { label:"Innodisk: confirmed DDR5 VLP RDIMM", url:"https://www.innodisk.com/en/products/dram-modules/ddr5/ddr5-rdimm-vlp" },
  { label:"Micron: DDR5 module families", url:"https://www.micron.com/products/memory/dram-modules" },
  { label:"Rambus: PMIC, SPD hub and clock drivers", url:"https://www.rambus.com/rambus-delivers-industry-leading-client-chipsets-for-next-generation-ai-pc-memory-modules/" },
];

function boardShape(name:string) {
  if (/CAMM|SOCAMM/.test(name)) return "flat";
  if (/SO-DIMM|CSODIMM|MicroDIMM|Mini-DIMM/.test(name)) return "short";
  if (/SIPP|SIMM/.test(name)) return "vintage";
  if (/VLP/.test(name)) return "vlp";
  if (/DIP/.test(name)) return "chip";
  return "long";
}

export default function RamGuide() {
  const [tab,setTab] = useState<Tab>("explore");
  const sectionRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLElement>(null);
  // Navigate AND show the selected section, rather than only updating off-screen content.
  const navigateTo = (next: Tab) => {
    setTab(next);
    window.requestAnimationFrame(() => {
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      const strip = tabsRef.current;
      const activeButton = strip?.querySelector<HTMLButtonElement>(`[data-ram-section="${next}"]`);
      if (strip && activeButton) {
        strip.scrollTo({ left: activeButton.offsetLeft - (strip.clientWidth - activeButton.offsetWidth) / 2, behavior });
      }
      sectionRef.current?.scrollIntoView({ behavior, block: "start" });
    });
  };
  const [term,setTerm] = useState("");
  const [filter,setFilter] = useState("All");
  const [gen,setGen] = useState("ddr5");
  const [compare,setCompare] = useState("ddr");
  const [picked,setPicked] = useState<Module|null>(modules[5]);
  const [cell,setCell] = useState<number>(6);
  const [activeChip,setActiveChip] = useState("pmic");
  const [checkGen,setCheckGen] = useState("ddr5");
  const [checkType,setCheckType] = useState("SO-DIMM");
  const [checkSupport,setCheckSupport] = useState("unknown");
  const [quizIndex,setQuizIndex] = useState(0);
  const [answers,setAnswers] = useState<Record<number,number>>({});
  const visible = useMemo(()=>modules.filter(m=>(filter==="All"||m.family===filter)&&(m.name+" "+m.description+" "+m.hint).toLowerCase().includes(term.toLowerCase())),[filter,term]);
  const selected = generations.find(g=>g.id===gen)??generations[6];
  const compared = generations.find(g=>g.id===compare)??generations[2];
  const [checkColumn] = [keys.indexOf(checkGen as typeof keys[number])];
  const chosenModule = modules.find(m=>m.name===checkType);
  const status = chosenModule && checkColumn>=0?statusOf(chosenModule,checkColumn):"no";
  const chosenQuestion = quizzes[quizIndex];
  const score = quizzes.filter((q,i)=>answers[i]===q.correct).length;
  const complete = Object.keys(answers).length===quizzes.length;

  return <main className={styles.page}>
    <div className={styles.wrap}>
      <header className={styles.top}><Link href="/learn">← Circular Learning Hub</Link><span>FIELD GUIDE / COMPUTER HARDWARE</span><Link href="/storage-guide">Storage Explorer ↗</Link><Link href="/ram-guide/gallery">Photo Gallery ↗</Link></header>
      <section className={styles.hero}>
        <div><div className={styles.kicker}><span className={styles.dot}/> AN INTERACTIVE FIELD REFERENCE</div><h1>THE RAM<br/><em>EXPLORER.</em></h1><p>From 30-pin SIMMs to DDR5, LPCAMM2 and the chips on a modern memory stick. Explore what existed, what fits and how to identify it safely.</p><div className={styles.heroActions}><button onClick={()=>navigateTo("modules")}>Explore module grid <span aria-hidden="true">↗</span></button><button className={styles.ghost} onClick={()=>navigateTo("quiz")}>Test your knowledge →</button></div></div>
        <div className={styles.art} aria-label="Illustrated RAM module, with memory chips, SPD hub, PMIC and gold edge contacts">
          <div className={styles.board}><div className={styles.boardLabel}>DDR5 · 288 PIN</div><div className={styles.chipLine}>{Array.from({length:8},(_,i)=><span key={i}>{i===3?"DRAM":"IC"}</span>)}</div><div className={styles.smallChips}><span>PMIC</span><span>SPD</span><span>CKD*</span></div><div className={styles.fingers}/></div>
          <div className={styles.artFoot}><span>01 / HARDWARE ANATOMY</span><span>DIAGRAM · NOT TO SCALE</span></div>
        </div>
      </section>
      <div className={styles.stats}><span><strong>8</strong> memory eras on the grid</span><span><strong>{modules.length}</strong> physical module types</span><span><strong>{features.length}</strong> cross-cutting features</span><span><strong>{quizzes.length}</strong> practice questions</span></div>
      <div className={styles.galleryBanner}><Link href="/ram-guide/gallery">📷 <strong>NEW: Real RAM Photo Gallery</strong><span>Browse 90+ sourced photographs from vintage SIMMs to DDR5 and specialised memory →</span></Link></div>
      <nav ref={tabsRef} className={styles.tabs} aria-label="RAM Explorer sections">
        {([["explore","01 Overview"],["timeline","02 Timeline"],["modules","03 Module grid"],["anatomy","04 Anatomy & features"],["identify","05 Identify a stick"],["quiz","06 Quiz"]] as const).map(([id,title])=><button key={id} data-ram-section={id} aria-current={tab===id?"page":undefined} className={tab===id?styles.active:""} onClick={()=>navigateTo(id)}>{title}</button>)}
      </nav>

      <p className={styles.tabHint}>Swipe sideways for more sections →</p>
      <div ref={sectionRef} id="ram-content" className={styles.content}>
      {tab==="explore" && <section className={styles.section}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>START HERE</span><h2>One word, three questions.</h2><p>“DDR4 RAM” is not enough information to order a replacement.</p></div></div>
        <div className={styles.three}><article className={styles.card}><span className={styles.num}>01</span><h3>Generation</h3><p>DDR, DDR2, DDR3, DDR4, DDR5 … governs electrical protocol, voltage and timings.</p></article><article className={styles.card}><span className={styles.num}>02</span><h3>Form factor</h3><p>UDIMM, SO-DIMM, CAMM2, MicroDIMM and others govern the physical socket.</p></article><article className={styles.card}><span className={styles.num}>03</span><h3>Platform features</h3><p>ECC, RDIMM, ranks, capacity, speed, SPD profiles and firmware all affect whether it works.</p></article></div>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>GENERATION SPOTLIGHT</span><h2>Pick an era to compare.</h2></div></div>
        <div className={styles.selectRow}><label>First generation<select value={gen} onChange={e=>setGen(e.target.value)}>{generations.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></label><label>Compare with<select value={compare} onChange={e=>setCompare(e.target.value)}>{generations.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></label></div>
        <div className={styles.compare}><div className={styles.compareHead}><span>SPECIFICATION</span><strong>{selected.name}</strong><strong>{compared.name}</strong></div>{([["Era","years"],["Desktop module","desktop"],["Laptop module","laptop"],["Nominal voltage","voltage"],["Approx. speeds","rates"]] as const).map(([label,key])=><div className={styles.compareRow} key={key}><span>{label}</span><span>{selected[key]}</span><span>{compared[key]}</span></div>)}<div className={styles.compareNotes}><p><strong>{selected.name}:</strong> {selected.note}</p><p><strong>{compared.name}:</strong> {compared.note}</p></div></div>
        <div className={styles.callout}><strong>DDR = Double Data Rate.</strong> DDR SDRAM transfers data on both rising and falling edges of a clock. IC = Integrated Circuit. A RAM “generation” is not a shape, and a matching pin count does not prove compatibility.</div>
      </section>}

      {tab==="timeline" && <section className={styles.section}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>THEN → NOW</span><h2>The memory family tree.</h2><p>Approximate adoption eras, not hard release or retirement dates. Old and new systems overlapped for years.</p></div></div><div className={styles.timeline}>{generations.map((g,i)=><article key={g.id} className={styles.era}><span className={styles.eraNumber}>{String(i+1).padStart(2,"0")}</span><div><span className={styles.eraYears}>{g.years}</span><h3>{g.name}</h3><p>{g.note}</p><small>{g.desktop}</small></div><span className={styles.eraDot}/></article>)}</div><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>PARALLEL BRANCHES</span><h2>Not all RAM lives in a DIMM.</h2></div></div><div className={styles.catalog}>{families.map(f=><article className={styles.card} key={f.name}><div className={styles.cardTop}><span>{f.kind}</span><span>{f.era}</span></div><h3>{f.name}</h3><p>{f.desc}</p></article>)}</div><p className={styles.finePrint}>Most graphics (GDDR) and HBM memory is fixed to a board/package. LPDDR is often soldered, but LPCAMM2 is removable. DDR6 is included as a forward-looking label, not as an established PC upgrade option.</p></section>}

      {tab==="modules" && <section className={styles.section}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>PHYSICAL TYPES × GENERATION</span><h2>The compatibility history grid.</h2><p>Tap any cell for context. A blue cell only means a type existed in that era; it does <strong>not</strong> promise compatibility between particular sticks and computers.</p></div></div>
        <div className={styles.legend}><span><i className={styles.yes}/> Documented historical use</span><span><i className={styles.rare}/> Rare / limited / needs verification</span><span><i className={styles.no}/> Not used / different architecture</span></div>
        <div className={styles.filters}><input type="search" placeholder="Search module types…" aria-label="Search modules" value={term} onChange={e=>setTerm(e.target.value)}/><select aria-label="Filter modules" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option>{Array.from(new Set(modules.map(m=>m.family))).map(f=><option key={f}>{f}</option>)}</select></div>
        <p className={styles.gridHint}>← Swipe the grid sideways to explore SDR through DDR5 and LPDDR →</p>
        <div className={"table-wrap "+styles.matrixScroller}><table className={styles.matrix}><thead><tr><th scope="col">MODULE TYPE</th>{columns.map(c=><th scope="col" key={c}>{c}</th>)}</tr></thead><tbody>{visible.map(m=><tr key={m.name}><th scope="row"><button onClick={()=>{setPicked(m);setCell(6)}} title={"Details: "+m.name}>{m.name}</button></th>{keys.map((k,i)=>{const s=statusOf(m,i);return <td key={k}><button aria-label={m.name+" "+columns[i]+": "+(s==="yes"?"documented":s==="rare"?"rare or unsure":"not used")} onClick={()=>{setPicked(m);setCell(i)}} className={s=== "yes"?styles.cellYes:s==="rare"?styles.cellRare:styles.cellNo}>{s==="yes"?"✓":s==="rare"?"?":"·"}</button></td>})}</tr>)}</tbody></table></div>
        {visible.length===0 && <p>No module types matched your search.</p>}
        {picked && <div className={styles.detailPanel}><div className={styles.illustration}><div className={styles.moduleGraphic+" "+styles[boardShape(picked.name)]}><span className={styles.simChips}>▣ ▣ ▣ ▣</span><span className={styles.simLabel}>{picked.name}</span><span className={styles.simPins}/></div><small>SCHEMATIC ONLY · NOT TO SCALE</small></div><div><span className={styles.eyebrow}>{columns[cell]} / {statusOf(picked,cell)==="yes"?"DOCUMENTED":statusOf(picked,cell)==="rare"?"RARE OR UNSURE":"NOT ESTABLISHED"}</span><h3>{picked.name}</h3><p>{picked.description}</p><p><strong>Spot it:</strong> {picked.hint}</p><p className={styles.finePrint}>The cell is a historical reference. Confirm exact manufacturer part number, motherboard, CPU and service manual before replacement.</p></div></div>}
      </section>}

      {tab==="anatomy" && <section className={styles.section}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>UNDER THE HEAT SPREADER</span><h2>What's on a RAM stick?</h2><p>Tap a component to see what it does. The arrangement is illustrative: not every module carries all these ICs.</p></div></div>
        <div className={styles.anatomy}><div className={styles.anatomyBoard}><div className={styles.anatomyHead}>DDR5 MODULE · SIMPLIFIED FRONT VIEW</div><div className={styles.anatomyChips}>{["dram","dram","dram","dram","pmic","spd","ckd","dram"].map((c,i)=><button className={activeChip===c?styles.chipActive:""} key={i} onClick={()=>setActiveChip(c)}>{c.toUpperCase()}</button>)}</div><button className={styles.pinStrip} onClick={()=>setActiveChip("pins")}>GOLD CONTACTS / KEYING · SELECT FOR DETAIL</button><div className={styles.anatomyTip}>CKD is found on clocked module variants (CUDIMM/CSODIMM), not all DDR5 UDIMMs.</div></div><div className={styles.anatomyInfo}><span className={styles.eyebrow}>SELECTED PART</span><h3>{chips.find(c=>c.id===activeChip)?.title}</h3><strong>{chips.find(c=>c.id===activeChip)?.subtitle}</strong><p>{chips.find(c=>c.id===activeChip)?.detail}</p><div className={styles.chipButtons}>{chips.map(c=><button className={activeChip===c.id?styles.chosen:""} onClick={()=>setActiveChip(c.id)} key={c.id}>{c.title}</button>)}</div></div></div>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>THE OTHER HALF OF COMPATIBILITY</span><h2>Features ≠ form factors.</h2><p>These characteristics may span generations and shapes.</p></div></div><div className={styles.catalog}>{features.map(f=><article className={styles.card} key={f.title}><span className={styles.tag}>{f.badge}</span><h3>{f.title}</h3><p>{f.description}</p></article>)}</div><div className={styles.callout}><strong>Repair note:</strong> a bad PMIC or invalid SPD can cause boot failures, but transplanting chips is specialised component-level repair. Diagnose safely before using donor parts; an electrical short or incorrect replacement can destroy a board.</div></section>}

      {tab==="identify" && <section className={styles.section}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>BENCH-SIDE ASSISTANT</span><h2>Identify before you install.</h2><p>This is a historical cross-check, not an automatic part-compatibility guarantee.</p></div></div>
        <div className={styles.identify}><div className={styles.identifyForm}><label>Generation shown on label<select value={checkGen} onChange={e=>setCheckGen(e.target.value)}>{keys.map((k,i)=><option value={k} key={k}>{columns[i]}</option>)}</select></label><label>Physical module type<select value={checkType} onChange={e=>setCheckType(e.target.value)}>{modules.map(m=><option key={m.name}>{m.name}</option>)}</select></label><label>Do you know the exact system supports this configuration?<select value={checkSupport} onChange={e=>setCheckSupport(e.target.value)}><option value="unknown">Not yet / unsure</option><option value="yes">Yes, confirmed from service manual / QVL</option><option value="no">No / incompatible platform</option></select></label></div><div className={styles.identifyResult}><span className={styles.eyebrow}>REFERENCE RESULT</span><span className={status==="yes"?styles.resultYes:status==="rare"?styles.resultRare:styles.resultNo}>{status==="yes"?"Historically documented":status==="rare"?"Rare or verify":"Not a documented combination"}</span><h3>{checkType} + {columns[checkColumn]}</h3><p>{chosenModule?.description}</p><p>{checkSupport==="no"?"Do not install: the target platform is not confirmed to support it.":checkSupport==="yes"&&status==="yes"?"Good starting point, but recheck maximum capacity, speed, rank, ECC/buffering, firmware and exact part before fitting.":"Do not order or install based on this chart. Check the device model, chipset/CPU memory controller and service documentation."}</p></div></div>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>PRACTICAL CHECKLIST</span><h2>Five checks at the workbench.</h2></div></div><ol className={styles.checks}><li><strong>Read the label.</strong> Capture maker, part number, capacity, rank and speed.</li><li><strong>Check physical form and notch.</strong> Don't force any stick into a slot.</li><li><strong>Match generation and electrical support.</strong> DDR4 and DDR5 are not interchangeable.</li><li><strong>Check ECC and buffering.</strong> UDIMM, RDIMM, LRDIMM, CAMM2 and LPCAMM2 need specifically supported hardware.</li><li><strong>Consult a manual or QVL.</strong> Confirm maximum capacity, BIOS/UEFI requirements and permitted slots; test with MemTest after installation.</li></ol><div className={styles.callout}>For DDR5 troubleshooting: look for power damage and measure appropriately only if trained; inspect PMIC, SPD hub and solder joints, but do not assume these chips are the fault.</div>
      </section>}

      {tab==="quiz" && <section className={styles.section}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>PRACTICE / {quizIndex+1} OF {quizzes.length}</span><h2>Can you identify the difference?</h2><p>No account needed. Your answers remain in this browser session, and do not count as a formal training assessment.</p></div></div>
        <div className={styles.quizShell}><div className={styles.quizProgress}><div style={{width:(Object.keys(answers).length/quizzes.length*100)+"%"}}/></div><span className={styles.quizCounter}>QUESTION {String(quizIndex+1).padStart(2,"0")}</span><h3>{chosenQuestion.q}</h3><div className={styles.answers}>{chosenQuestion.options.map((opt,i)=><button key={i} className={answers[quizIndex]===i?styles.answerSelected:""} onClick={()=>setAnswers(a=>({...a,[quizIndex]:i}))}><span>{String.fromCharCode(65+i)}</span>{opt}</button>)}</div>{answers[quizIndex]!==undefined&&<p className={answers[quizIndex]===chosenQuestion.correct?styles.good:styles.wrong}><strong>{answers[quizIndex]===chosenQuestion.correct?"Correct.":"Not quite."}</strong> {chosenQuestion.why}</p>}<div className={styles.quizFooter}><button disabled={quizIndex===0} onClick={()=>setQuizIndex(i=>Math.max(0,i-1))}>← Previous</button><span>{complete?"Score: "+score+" / "+quizzes.length:Object.keys(answers).length+" answered"}</span>{quizIndex<quizzes.length-1?<button onClick={()=>setQuizIndex(i=>Math.min(quizzes.length-1,i+1))}>Next →</button>:<button onClick={()=>{setQuizIndex(0);setAnswers({})}}>Restart ↻</button>}</div></div>
      </section>}

      </div>
      <footer className={styles.footer}><div><strong>RAM EXPLORER</strong><p>Part of the DubboEwaste repair and reuse field school. Information reference only, not proof of system compatibility or repair competency.</p><small>Content reviewed 10 October 2026 · Dates and performance ranges approximate · Amber means verify.</small></div><div className={styles.sources}><span>SOURCES & CROSS-CHECKS</span>{sources.map(s=><a target="_blank" rel="noreferrer" key={s.url} href={s.url}>{s.label} ↗</a>)}<a href="https://github.com/joshualparris/DubboEwaste">Source repository ↗</a></div></footer>
    </div>
  </main>;
}
