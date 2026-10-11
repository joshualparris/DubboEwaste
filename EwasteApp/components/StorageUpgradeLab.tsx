"use client";

import {useState} from "react";
import styles from "./StorageUpgradeLab.module.css";

type Level = 1|2|3;
type Scenario = {id:string;level:Level;title:string;caseFile:string;question:string;options:[string,string,string];answer:0|1|2;feedback:string;danger:string;};
type Attempt = {id:string;right:boolean;level:Level};

const scenarios:Scenario[]=[
 {id:"f1",level:1,title:"Your HP 250 G3",caseFile:"A 2015-era i5 laptop runs Windows 10 from a mechanical HDD. Its owner wants quicker start-up, but its current drive health has not been assessed.",question:"What is your best first diagnostic action?",options:["Measure a boot baseline and read drive health","Format the old HDD to remove startup overhead","Order the largest NVMe stick sold locally"],answer:0,feedback:"A timed baseline, read-only drive identification, SMART results and RAM-pressure observations establish whether the HDD is the main bottleneck. SSDs help random I/O but do not fix every slow system.",danger:"Do not treat a drive upgrade as diagnosis by itself."},
 {id:"f2",level:1,title:"Drive shape versus signalling",caseFile:"The present drive is a 2.5-inch SATA HDD with its original bracket. A seller offers an M.2 NVMe card at a discount.",question:"Which claim about fit is most defensible?",options:["An M.2 card fits if it is thinner than the HDD","An NVMe card is fine using the old HDD plug","Choose SATA with verified bay height and caddy"],answer:2,feedback:"Match SATA signalling, 2.5-inch form factor, drive thickness, caddy and the exact service procedure. Shape alone does not prove compatibility.",danger:"Do not force electrical connectors or assume an M.2 slot exists."},
 {id:"f3",level:1,title:"Boot and data are separate",caseFile:"A former organisation's laptop boots to a Windows profile. No signed transfer or storage disposal authority accompanies it.",question:"Which intake decision respects data rights?",options:["Hold the drive; obtain data-handling authority","Inspect recent files for the owner's contact","Reset Windows before accepting the device"],answer:0,feedback:"The chassis may have been donated without its stored data being released. Log privately and restrict the HDD until permissions and approved processes are established.",danger:"Opening files, imaging or wiping an unknown-owner drive is not an intake test."},
 {id:"p1",level:2,title:"Capacity mismatch",caseFile:"A 500 GB HDD has 300 GB of allocated user and system data. The customer has approved cloning to a 256 GB SSD.",question:"What must happen before any cloning step?",options:["Shrink partitions with no backup and retry","Agree a verified backup and a target that fits","Clone partitions at original size then compress"],answer:1,feedback:"The data and partitions do not fit. Confirm actual usage and EFI/recovery partition requirements, then agree a larger drive or authorised reduction plus verified backup.",danger:"A clone tool cannot safely make 300 GB fit in 256 GB by optimism."},
 {id:"p2",level:2,title:"A weak HDD",caseFile:"The drive sometimes clicks; SMART logs show pending sectors and failed self-tests. The owner asks for the fastest upgrade.",question:"Which response protects the highest-value asset?",options:["Run a full surface scan before any backup","Attempt repeated clones until it completes","Stop routine reads; discuss data recovery first"],answer:2,feedback:"A deteriorating HDD may suffer from additional reads. Do not stress it with repeated cloning or surface scans. Establish data value and professional recovery options.",danger:"The owner's photos may be worth far more than the laptop."},
 {id:"p3",level:2,title:"First boot after replacement",caseFile:"A new SATA SSD appears at its full capacity in UEFI setup. Windows still reports 'no boot device'.",question:"What observation best splits the possible causes?",options:["Check whether the SSD has a valid EFI boot path","Replace the SSD because the BIOS already sees it","Erase the original HDD to reset the boot order"],answer:0,feedback:"Firmware detection proves only that the device is visible. Check whether installation or cloning created a bootloader, UEFI/legacy mode and EFI entry.",danger:"A boot error is not proof of SSD hardware failure."},
 {id:"e1",level:3,title:"A complete sign-off",caseFile:"A swapped SSD boots in 19 seconds once. The technician marked the job as fully tested; the old HDD is in an unlabelled box.",question:"Which additional evidence is most important?",options:["Repeat boots and verify the authorised files and old-drive custody","Capture a speed screenshot and put the HDD in mixed recycling","Leave the case open so the owner can inspect the SATA plug"],answer:0,feedback:"Repeat cold boots, check drive identity and health, verify authorised file transfer against independent backup, test restart/sleep, and record secure old-drive disposition.",danger:"One fast boot is a symptom improvement, not an audited handover."},
 {id:"e2",level:3,title:"A fair repair quote",caseFile:"Fictional cost base: SSD A$30 + 45 minutes labour at A$60/h + A$5 testing. You want 20% gross margin, not 20% markup.",question:"Which ex-GST price meets the margin target?",options:["A$96 because total cost multiplied by 1.20","A$100 because A$80 divided by 0.80","A$110 because A$80 plus fixed A$30"],answer:1,feedback:"Labour is A$45; total cost A$80. Margin = (price - cost) / price. A$80 / (1 - .20) = A$100 ex-GST. Quote separate data work and apply GST rules only if applicable.",danger:"Mark-up and margin are not interchangeable, and estimates are not a Dubbo market quote."},
 {id:"e3",level:3,title:"When 'upgrade' is wrong",caseFile:"The HP's battery is swollen, the HDD has unreadable sectors and the owner has no backup. A volunteer proposes fitting a fresh SSD immediately.",question:"Which decision is safest to communicate?",options:["Install an SSD first and revisit the faults next week","Quarantine battery risk; arrange data triage before work","Replace the case and continue without recording faults"],answer:1,feedback:"Stop at the damaged lithium battery, preserve data-recovery choices and explain sequencing. A storage upgrade can wait until safety and the irreplaceable data are addressed.",danger:"A fast new drive cannot make hazardous equipment or lost files acceptable."}
];
const limit=7;
const levelName=(level:Level)=>({1:"Foundation",2:"Practitioner",3:"Expert"}[level]);

export default function StorageUpgradeLab(){
 const [attempts,setAttempts]=useState<Attempt[]>([]);
 const [active,setActive]=useState<string>("f1");
 const [selected,setSelected]=useState<number|null>(null);
 const [nextLevel,setNextLevel]=useState<Level>(1);
 const [note,setNote]=useState("");
 const [checks,setChecks]=useState([false,false,false]);
 const scenario=scenarios.find(s=>s.id===active)??scenarios[0];
 const finished=attempts.length>=limit;
 const right=attempts.filter(a=>a.right).length;
 const expert=attempts.filter(a=>a.level===3&&a.right).length;
 const attemptAnswer=(choice:number)=>{
  if(selected!==null||finished)return;
  setSelected(choice);
 };
 const advance=()=>{
  if(selected===null)return;
  const success=selected===scenario.answer;
  const newAttempts=[...attempts,{id:scenario.id,right:success,level:scenario.level}];
  setAttempts(newAttempts);
  setSelected(null);
  if(newAttempts.length>=limit)return;
  const next=success?Math.min(3,scenario.level+1):Math.max(1,scenario.level-1);
  const level=next as Level;
  setNextLevel(level);
  const used=new Set(newAttempts.map(a=>a.id));
  const other=scenarios.find(s=>s.level===level&&!used.has(s.id))??scenarios.find(s=>!used.has(s.id));
  if(other)setActive(other.id);
 };
 const reset=()=>{setAttempts([]);setActive("f1");setSelected(null);setNextLevel(1);setNote("");setChecks([false,false,false]);};
 const completeRubric=checks.every(Boolean)&&note.trim().length>=100;
 return <section className={styles.lab} aria-labelledby="ssd-lab-title">
  <div className={styles.hero}>
   <span className={styles.kicker}>Applied bench simulation · adaptive</span>
   <h2 id="ssd-lab-title">HDD → SSD: make the repair decision</h2>
   <p>Seven different evidence-led decisions. Correct reasoning raises difficulty; an error returns you to more supported practice. No real device or customer files are touched.</p>
   <div className={styles.diagram} role="img" aria-label="Workflow: identify and protect data, diagnose, select matching SATA SSD, replace under safe instructions, verify and hand over">
    <span>Consent &amp; health</span><b aria-hidden="true">→</b><span>Compatibility</span><b aria-hidden="true">→</b><span>Replace</span><b aria-hidden="true">→</b><span>Verify &amp; hand over</span>
   </div>
  </div>
  {!finished?<div className={styles.caseCard}>
   <div className={styles.top}><span>Case {attempts.length+1} of {limit}</span><span>Current challenge: {levelName(scenario.level)}</span></div>
   <progress value={attempts.length} max={limit} aria-label="Simulation progress"/>
   <h3>{scenario.title}</h3>
   <p>{scenario.caseFile}</p>
   <fieldset disabled={selected!==null} className={styles.fieldset}>
    <legend>{scenario.question}</legend>
    {scenario.options.map((opt,i)=><button type="button" key={opt} className={styles.choice} onClick={()=>attemptAnswer(i)} aria-pressed={selected===i}>{String.fromCharCode(65+i)}. {opt}</button>)}
   </fieldset>
   {selected!==null?<div className={styles.feedback} role="status">
    <strong>{selected===scenario.answer?"Sound decision.":"Not yet. Examine the evidence."}</strong>
    <p>{scenario.feedback}</p>
    <p><strong>Stop-work boundary:</strong> {scenario.danger}</p>
    <button className={styles.primary} type="button" onClick={advance}>{attempts.length===limit-1?"See assessment":"Next case →"}</button>
   </div>:<p className={styles.muted}>Choose the safest defensible next decision, not the cheapest or quickest action.</p>}
  </div>:<div className={styles.caseCard}>
    <h3>Decision practice completed</h3>
    <p><strong>{right} / {limit}</strong> defensible first decisions · <strong>{expert}</strong> correct expert-level cases. This is an unproctored practice score, not evidence of a physical repair.</p>
    <p>{right>=6&&expert>=1?"Strong online reasoning. Now demonstrate your evidence in a supervised practical.":"Review the missed decisions and repeat with a written evidence plan before hands-on work."}</p>
    <h3>Make your reasoning visible</h3>
    <label htmlFor="ssd-notes">Write at least 100 characters: how would you handle consent, a failing HDD, SATA fit and final data verification on this HP?</label>
    <textarea id="ssd-notes" value={note} onChange={e=>setNote(e.target.value)} rows={5} placeholder="I would first establish permission and backup requirements, then..."/>
    <div className={styles.checklist}>{["I named a specific stop-work condition.","I distinguished cloning from a verified independent backup.","I identified three post-repair checks and old-drive custody."].map((v,i)=><label key={v}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(old=>old.map((b,j)=>j===i?e.target.checked:b))}/>{v}</label>)}</div>
    {completeRubric?<p className={styles.good} role="status">Reflection checklist complete. Save your notes privately and submit redacted evidence via the practical assessment below when eligible.</p>:<p className={styles.muted}>Tick every evidence check and write your explanation. This reflection stays in your browser session.</p>}
    <button className={styles.primary} type="button" onClick={reset}>Practise again with adaptive difficulty</button>
   </div>}
   <p className={styles.disclaimer}>For real repairs: use the exact device service manual; work only on authorised data, with appropriate battery isolation and supervision. Passing this simulation cannot certify practical competence.</p>
 </section>;
}
