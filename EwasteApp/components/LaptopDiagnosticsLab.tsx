"use client";
import {useState} from "react";

type Choice={label:string;feedback:string;score:number};
type Case={title:string;context:string;question:string;choices:Choice[];expert:string};
const cases:Case[]=[
 {title:"Black internal display",context:"HP laptop boots; HDMI works in BIOS and Windows. Internal screen remains black. A donor panel has the same diagonal size but unverified connector and voltage.",question:"What is the strongest next action?",choices:[
 {label:"Install the donor panel because the size matches.",score:0,feedback:"Unsafe assumption: size does not establish signalling, connector pinout, voltage or mounting compatibility."},
 {label:"Check model-specific service documentation, panel detection and cable path before any substitution.",score:2,feedback:"Correct. HDMI success narrows the problem but does not prove the internal panel is defective."},
 {label:"Reinstall Windows because the internal display is blank.",score:0,feedback:"HDMI works in BIOS too; an OS reinstall is destructive and poorly targeted."},
 {label:"Order a motherboard immediately.",score:0,feedback:"Premature. Cable, panel and backlight remain plausible."}],expert:"Evidence-supported fault tree: panel, internal cable/connector, backlight supply, firmware selection and board-side display circuitry."},
 {title:"No POST",context:"Charging LED lights, fan pulses briefly, no vendor logo. The owner reports no liquid damage. No vendor blink code has been recorded.",question:"Which diagnostic plan is best?",choices:[
 {label:"Record blink codes and use a verified compatible adapter, then follow vendor diagnostic guidance.",score:2,feedback:"Good sequencing: low-risk observations before invasive tests."},
 {label:"Replace the CPU first.",score:0,feedback:"No evidence isolates CPU failure."},
 {label:"Assume a working fan means successful POST.",score:0,feedback:"Fan movement is not proof of POST."},
 {label:"Flash firmware from an unknown download.",score:0,feedback:"High-risk intervention without evidence or provenance."}],expert:"Distinguish input power, POST, memory, firmware and display. Predict what each test would rule in or out."},
 {title:"Intermittent storage",context:"BIOS intermittently detects an NVMe drive; vendor diagnostics report a storage health warning. The owner needs irreplaceable files.",question:"What should happen before further testing?",choices:[
 {label:"Run a full stress test repeatedly.",score:0,feedback:"Further load may worsen failure and data loss."},
 {label:"Reinstall the OS.",score:0,feedback:"Destructive and not authorised."},
 {label:"Stop destructive testing, clarify data authority and arrange appropriate backup or recovery.",score:2,feedback:"Correct: data preservation and consent take priority."},
 {label:"Erase the drive to see whether it improves.",score:0,feedback:"Erasure would destroy the owner's data."}],expert:"A storage warning is evidence, not definitive component isolation; preserve data and assess drive, slot and firmware possibilities."},
 {title:"Overheating",context:"Laptop idles normally, spikes under sustained load, and has restricted exhaust airflow. The fan can be heard.",question:"Which result would best support a repair claim?",choices:[
 {label:"A single low idle temperature after cleaning.",score:0,feedback:"Idle alone does not reproduce the original failure."},
 {label:"A comparison of the same controlled load, temperatures, fan behaviour and throttling before and after safe maintenance.",score:2,feedback:"Correct. Repeatable before/after conditions support a defensible conclusion."},
 {label:"A new thermal paste purchase receipt.",score:0,feedback:"A part purchase is not diagnostic evidence."},
 {label:"The fan is audible, so cooling is fine.",score:0,feedback:"An audible fan may still be ineffective."}],expert:"Separate blocked airflow, fan problems, thermal interface and software load; document reproducible conditions."},
 {title:"Repair economics",context:"Parts $85; 1.5 hours at $60/hour; 20% chance of an $80 additional fault; consumables $15; expected resale $220.",question:"What is the expected direct margin before overhead and warranty?",choices:[
 {label:"$45",score:0,feedback:"This omits some direct costs."},
 {label:"$130",score:0,feedback:"Labour and risk must be counted."},
 {label:"$14",score:2,feedback:"Correct: 220 - (85 + 90 + 16 + 15) = $14. Overhead and warranty could make this uneconomic."},
 {label:"$30",score:0,feedback:"Include the expected $16 fault cost."}],expert:"Expected direct cost $206; margin $14 before overhead and warranty. Compare repair, reuse and recycling outcomes."}
];
export default function LaptopDiagnosticsLab(){
 const [index,setIndex]=useState(0),[selected,setSelected]=useState<number|null>(null),[answers,setAnswers]=useState<number[]>([]),[reason,setReason]=useState(""),[show,setShow]=useState(false);
 const c=cases[index],choice=selected===null?null:c.choices[selected],finished=index>=cases.length;
 if(finished){const total=answers.reduce((a,b)=>a+b,0);return <section aria-label="Laptop diagnostics mastery lab" style={{padding:20,border:"1px solid #777",borderRadius:12,marginBlock:24}}><h2>Diagnostics lab results</h2><p>Score: {total}/10 across five cases. This is a formative simulation, not proof of practical competence.</p><p>{total===10?"All decisions were evidence-aligned. Next: supervised practical demonstration and delayed transfer case.":"Review missed cases and retry with explanations. Passing requires practical observation as well."}</p><button type="button" onClick={()=>{setIndex(0);setSelected(null);setAnswers([]);setReason("");setShow(false)}}>Retry lab</button></section>}
 return <section aria-label="Laptop diagnostics mastery lab" style={{padding:20,border:"1px solid #777",borderRadius:12,marginBlock:24}}>
 <h2>Interactive Laptop Diagnostics Lab</h2><p>Case {index+1} of {cases.length} · Formative practice · No real hardware is controlled</p><progress aria-label="Case progress" value={index} max={cases.length}/>
 <h3>{c.title}</h3><p>{c.context}</p><p><strong>{c.question}</strong></p>
 <fieldset disabled={show}><legend>Choose the safest evidence-based decision</legend>{c.choices.map((v,i)=><label key={i} style={{display:"block",padding:"10px 0"}}><input type="radio" name={"diagnostic-"+index} checked={selected===i} onChange={()=>setSelected(i)}/> {v.label}</label>)}</fieldset>
 <label style={{display:"block",marginBlock:12}}>Explain which evidence supports your decision and what could disprove it.<textarea value={reason} onChange={e=>setReason(e.target.value)} rows={3} maxLength={1200} style={{display:"block",width:"100%",padding:8}}/></label>
 {!show?<button type="button" disabled={selected===null||reason.trim().length<35} onClick={()=>setShow(true)}>Check decision and reasoning</button>:<div role="status"><p><strong>{choice?.score===2?"Evidence-aligned decision":"Reconsider your diagnosis"}</strong> — {choice?.feedback}</p><p><strong>Expert reasoning:</strong> {c.expert}</p><p>Your written reasoning is for self-reflection and is not automatically graded or saved.</p><button type="button" onClick={()=>{setAnswers(a=>[...a,choice?.score??0]);setIndex(i=>i+1);setSelected(null);setReason("");setShow(false)}}>{index===cases.length-1?"See results":"Next case"}</button></div>}
 <p style={{fontSize:13,opacity:.8}}>Stop-work hazards and owner-data consent override any training score. Progress in this lab is session-only.</p>
 </section>
}
