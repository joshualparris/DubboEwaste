"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {donor,missions,sources,type Level,type StageId} from "@/lib/learning/screen-transplant-lab";
import styles from "../field-lab/field-lab.module.css";

type Answer={id:string;choice:number;correct:boolean;level:Level};
type Answers=Partial<Record<StageId,Answer>>;
type Notes=Partial<Record<StageId,string>>;
const minimum=80;
const levelName=(l:Level)=>l===1?"Foundation":l===2?"Technician":"Expert judgement";
const nextLevel=(l:Level,good:boolean):Level=>Math.min(3,Math.max(1,l+(good?1:-1))) as Level;
function report(answers:Answers,notes:Notes){
 const lines=["LCD DONOR TRANSPLANT — SIMULATED EVIDENCE RECORD","Training exercise, not a compatibility certificate or observed practical sign-off.","Do not add names, passwords, owner files or identifying serial numbers.","",
 "Donor: "+donor.panel+" (ASUS A541U)","Recipient: HP 15-db0034au; EDID DISPLAY\\CMN15DC",
 "Status: NOT VERIFIED FOR TRANSPLANT; connector orientation, physical fit and cable electrical compatibility still require confirmation.",""];
 for(const m of missions){
  const a=answers[m.id],q=m.questions.find(q=>q.id===a?.id);
  lines.push(m.name,"Decision: "+(q&&a?q.options[a.choice]:"Not attempted"),"Assessment: "+(a?(a.correct?"Defensible":"Needs review"):"Not attempted"),"Evidence / alternatives / stopping point: "+(notes[m.id]?.trim()||"Not recorded"),"Required verification: "+(q?.evidence??m.objective),"");
 }
 lines.push("Go/no-go: Unresolved reverse interface / physical and wiring checks = HOLD.","Even successful simulation results cannot certify a real screen swap. A supervisor must observe isolation and inspect actual hardware.");
 return lines.join("\n");
}
export default function ScreenTransplantLab(){
 const [starting,setStarting]=useState<Level>(2);
 const [level,setLevel]=useState<Level>(2);
 const [at,setAt]=useState(0);
 const [answers,setAnswers]=useState<Answers>({});
 const [notes,setNotes]=useState<Notes>({});
 const [showWorked,setShowWorked]=useState<Partial<Record<StageId,boolean>>>({});
 const [copied,setCopied]=useState(false);
 const [speaking,setSpeaking]=useState(false);
 const mission=missions[at],picked=answers[mission.id];
 const question=mission.questions.find(q=>q.id===picked?.id)??mission.questions[level-1];
 const count=Object.keys(answers).length;
 const correct=missions.filter(m=>answers[m.id]?.correct).length;
 const recorded=missions.filter(m=>(notes[m.id]??"").trim().length>=minimum).length;
 const missed=missions.filter(m=>answers[m.id]&&!answers[m.id]?.correct);
 const safeGates=Boolean(answers.compatibility?.correct&&answers.isolation?.correct);
 const ready=count===5&&correct>=4&&recorded===5&&safeGates;
 const progress=useMemo(()=>missions.map(m=>({id:m.id,title:m.name,right:answers[m.id]?.correct,hasNote:(notes[m.id]??"").trim().length>=minimum})),[answers,notes]);
 const stopAudio=()=>{if(typeof window!=="undefined")window.speechSynthesis?.cancel();setSpeaking(false);};
 const reset=(l:Level)=>{stopAudio();setStarting(l);setLevel(l);setAt(0);setAnswers({});setNotes({});setShowWorked({});setCopied(false);};
 const answer=(choice:number)=>{
  if(picked)return;
  const good=choice===question.answer;
  setAnswers(p=>({...p,[mission.id]:{id:question.id,choice,correct:good,level:question.level}}));
  setLevel(l=>nextLevel(l,good));
 };
 const move=(i:number)=>{stopAudio();setAt(Math.max(0,Math.min(4,i)));};
 const listen=()=>{
  if(!("speechSynthesis" in window))return;
  if(speaking){stopAudio();return;}
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(mission.name+". "+mission.principle+". Safety boundary: "+mission.boundary);
  u.lang="en-AU";u.rate=0.94;u.onend=()=>setSpeaking(false);u.onerror=()=>setSpeaking(false);
  setSpeaking(true);window.speechSynthesis.speak(u);
 };
 const copy=async()=>{
  try{await navigator.clipboard.writeText(report(answers,notes));setCopied(true);}
  catch{setCopied(false);}
 };
 return <main className={styles.page}><div className={styles.shell}>
  <nav className={styles.breadcrumb} aria-label="Breadcrumb">
   <Link href="/learn">Learning hub</Link><span>›</span>
   <Link href="/learn/repair-laptop-refurb">Laptop refurbishment</Link><span>›</span><strong>Screen transplant field lab</strong>
  </nav>
  <header className={styles.hero}>
   <div className={styles.heroText}>
    <span className={styles.kicker}>APPLIED REPAIR LAB · 5 MISSIONS · ADAPTIVE PRACTICE</span>
    <h1>A donor screen.<br/><em>A compatibility decision.</em></h1>
    <p>Investigate a real ASUS A541U donor LCD and an HP 15-db0034au with a cracked screen. Diagnose without opening the HP, challenge plausible but unsafe assumptions, and decide when a transplant can proceed.</p>
    <div className={styles.heroLinks}><a href="#mission">Start the missions ↓</a><a href="#sources">Research the original sources ↗</a></div>
    <p className={styles.subtle}>Scenario uses real panel identifiers with simplified teaching decisions. No hardware is connected or controlled here. Your writing stays on this page until you copy or print it; do not enter customer information.</p>
   </div>
   <div className={styles.heroDiagram}>
    <p><strong>ASUS donor</strong><br/>{donor.panel}</p>
    <p>{donor.known}</p>
    <p aria-label="Matching diagonals and pin counts do not establish compatibility"><strong>15.6″ + 30-pin ≠ approved transplant</strong></p>
    <p><strong>HP recipient</strong><br/>{donor.monitorId}<br/>{donor.candidate}</p>
    <div className={styles.diagramFoot}>CURRENT GATE <span>→</span> HOLD PENDING PHYSICAL + ELECTRICAL CHECKS</div>
   </div>
  </header>
  <section className={styles.evidenceStrip} aria-labelledby="evidence-title">
   <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>THE EVIDENCE WALL</span><h2 id="evidence-title">What is known, and what is not</h2><p>Good repair decisions distinguish observations from catalogue claims and unresolved integration risks.</p></div></div>
   <div className={styles.twoCol}>
    <article className={styles.facts}><h3>Recorded observations</h3>
     <ul><li>HP LCD shows clear impact/crack patterns but outputs video to an external monitor.</li>
     <li>Windows internal EDID: <code>CMN15DC</code>. An external ASUS monitor reports <code>ACI27F6</code>.</li>
     <li>ASUS donor sticker: <code>N156BGE-E32 Rev C1</code>; published spec: {donor.known}.</li></ul>
    </article>
    <article className={styles.worked}><h3>Still unresolved</h3><ul>
     <li>Whether the HP still contains its factory-fitted LCD.</li>
     <li>Whether a connector marked as a reverse interface fits the existing HP ribbon safely.</li>
     <li>Exact cable routing, tab positions, hinge and lid clearance.</li>
     <li>Whether the donor screen itself works following disassembly.</li></ul></article>
   </div>
   <p><strong>Non-destructive identification:</strong> On the HP, run read-only PowerShell <code>Get-CimInstance -Namespace root\wmi -ClassName WmiMonitorID</code> to inspect the panel EDID. This is an identifier, not confirmation of connector compatibility.</p>
  </section>
  <section className={styles.selection} aria-labelledby="level-title">
   <div><span className={styles.eyebrow}>DIFFICULTY THAT ADAPTS</span><h2 id="level-title">Choose a starting level</h2><p>Correct decisions increase difficulty. Missed decisions reveal explanations and lower the next question's level. Try Expert again after reviewing your mistakes.</p></div>
   <div className={styles.levelButtons}>{([1,2,3] as Level[]).map(l=><button type="button" key={l} className={starting===l?styles.activeTier:styles.tierButton} aria-pressed={starting===l} onClick={()=>reset(l)}>{levelName(l)}</button>)}</div>
  </section>
  <section className={styles.sim} id="mission" aria-labelledby="mission-title">
   <div className={styles.simTop}><span className={styles.eyebrow}>MISSION {at+1} OF {missions.length}</span><span>{count} decisions · {correct} defensible · current level {levelName(level)}</span></div>
   <div className={styles.stageStrip} role="group" aria-label="Mission navigation">{missions.map((m,i)=><button type="button" key={m.id} className={at===i?styles.stageActive:answers[m.id]?styles.stageDone:styles.stage} aria-current={at===i?"step":undefined} aria-label={m.name+(answers[m.id]?(answers[m.id]?.correct?", matched":", revise"):", not completed")} onClick={()=>move(i)}>{i+1}{answers[m.id]?(answers[m.id]?.correct?" ✓":" !"):""}</button>)}</div>
   <div className={styles.caseHead}><div><h2 id="mission-title">{mission.name}</h2><p>{mission.objective}</p></div><span className={styles.levelPill}>{levelName(question.level)}</span></div>
   <div className={styles.twoCol}>
    <article className={styles.facts}><h3>Case evidence</h3><ul>{mission.facts.map(f=><li key={f}>{f}</li>)}</ul></article>
    <article className={styles.worked}><h3>Understand the underlying principle</h3>
     <p>Make a prediction first; then reveal the worked reasoning to compare your explanation.</p>
     <div className={styles.audioActions}>
      <button type="button" aria-expanded={Boolean(showWorked[mission.id])} onClick={()=>setShowWorked(p=>({...p,[mission.id]:!p[mission.id]}))}>{showWorked[mission.id]?"Hide reasoning −":"Reveal worked reasoning +"}</button>
      <button type="button" onClick={listen}>{speaking?"Stop audio":"Listen to explanation ▶"}</button>
     </div>
     {showWorked[mission.id]&&<div className={styles.revealed}><p>{mission.principle}</p><p><strong>Safety boundary:</strong> {mission.boundary}</p><p>Audio uses your device's speech synthesis where supported; the full written version is available here.</p></div>}
    </article>
   </div>
   <article className={styles.question}><span className={styles.eyebrow}>DECISION · CHOOSE THE BEST EVIDENCE-BASED ACTION</span>
    <h3>{question.prompt}</h3>
    <div className={styles.options}>{question.options.map((option,i)=><button type="button" key={i} disabled={Boolean(picked)} className={picked?.choice===i?(picked.correct?styles.optionCorrect:styles.optionIncorrect):styles.option} onClick={()=>answer(i)}><span className={styles.optionLetter}>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>
    {picked&&<div role="status" className={styles.feedback}><strong>{picked.correct?"Defensible decision.":"This needs another look."}</strong>
     <p>{question.why}</p><p><strong>Alternative explanation:</strong> {question.competing}</p><p><strong>Evidence to document:</strong> {question.evidence}</p>
     {!picked.correct&&<p>Review the worked explanation. Restart when ready to practise the decision without seeing the answer.</p>}
    </div>}
   </article>
   <div className={styles.reflection}>
    <label htmlFor="mission-record"><strong>Your practical reasoning and stop-work threshold</strong><span>Include one alternative explanation, evidence needed, what you'd write on the job card and the condition that would stop the work. Use hypothetical details only.</span></label>
    <textarea id="mission-record" rows={5} maxLength={2500} placeholder="Observation… Hypothesis… Competing explanation… Verification… I would stop if…" value={notes[mission.id]??""} onChange={e=>setNotes(p=>({...p,[mission.id]:e.target.value}))}/>
    <small>{(notes[mission.id]??"").trim().length} / {minimum} minimum characters for a full simulation record.</small>
   </div>
   <div className={styles.controls}><button type="button" onClick={()=>move(at-1)} disabled={at===0}>← Previous</button>{at<4?<button type="button" className={styles.primary} onClick={()=>move(at+1)} disabled={!picked}>Next mission →</button>:<a href="#debrief" className={styles.primary}>Review your results ↓</a>}</div>
  </section>
  <section className={styles.debrief} id="debrief">
   <span className={styles.eyebrow}>KNOWLEDGE + EVIDENCE ≠ AUTOMATIC CERTIFICATION</span><h2>Your diagnostic record</h2>
   <div className={styles.stats}><div><strong>{correct}/5</strong><span>Sound decisions</span></div><div><strong>{recorded}/5</strong><span>Evidence notes</span></div><div><strong>{missed.length}</strong><span>Review needed</span></div></div>
   <div className={styles.rubric}>{progress.map((m,i)=><div key={m.id}><span>{i+1}</span><div><strong>{m.title}</strong><p>{m.right===undefined?"Not attempted":m.right?"Reasoning matched model":"Needs further practice"} · {m.hasNote?"Evidence draft present":"Evidence draft incomplete"}</p></div></div>)}</div>
   <p className={ready?styles.readiness:styles.needsReview}>{ready?"Your simulation meets the practice threshold: 4 of 5 defensible decisions, both critical safety gates correct, and five written evidence notes. This is not real-device authorisation.":"To reach the practice threshold: complete all five missions, get at least 4/5, correctly pass both compatibility and isolation safety gates, and write 80+ characters of evidence per mission. You may still export an incomplete record."}</p>
   <div className={styles.controls}><button type="button" onClick={copy}>Copy your evidence report</button><button type="button" onClick={()=>window.print()}>Print practice record</button><button type="button" onClick={()=>reset(3)}>Retry at Expert level ↻</button></div>
   {copied&&<p className={styles.copied} role="status">Copied. You can paste this into the existing Laptop Refurbishment course's practical assessment after completing the lessons.</p>}
   <div className={styles.supervisor}><h3>Actual supervisor sign-off requires</h3><ul>
    <li>Donor and installed-panel identifiers independently compared with current service documentation.</li>
    <li>Electrically correct connector/pinout and orientation; safe cable route and mounting fit confirmed.</li>
    <li>AC and battery isolated, with delicate display connectors handled without force.</li>
    <li>Cold start, BIOS and OS image, backlight, lid movement, webcam and wireless function actually tested.</li>
    <li>Job card: results, limitations, owner data boundary and release decision signed off.</li>
   </ul><p><strong>Current real-world disposition: HOLD.</strong> We have not inspected the HP's actual cable/connector or energised this donor in the HP.</p>
    <Link href="/learn/repair-laptop-refurb#practical">Go to the supervised LMS practical →</Link>
   </div>
  </section>
  <section className={styles.resources} id="sources"><span className={styles.eyebrow}>READ · COMPARE · REASON · APPLY</span><h2>Primary and practitioner references</h2>
   <p>Use manufacturer service instructions for the exact device variant. Some panel catalogues may require access verification; never substitute a seller's generic claim for an exact electrical comparison.</p>
   <div className={styles.resourceGrid}>{sources.map((s,i)=><article key={s.url}><span>{String(i+1).padStart(2,"0")} · {s.kind}</span><h3>{s.title}</h3><p className={styles.provider}>{s.provider}</p><p><strong>Active reading:</strong> {s.focus}</p><a href={s.url} target="_blank" rel="noopener noreferrer">Open original source ↗</a></article>)}</div>
  </section>
  <footer className={styles.footer}><p>Built into the existing DubboEwaste Academy laptop repair course. This simulator records reasoning, not an observed transplant or a qualified repair sign-off.</p><div><Link href="/learn/repair-laptop-refurb">Back to the full course →</Link><Link href="/learn/repair-laptop-refurb/field-lab">Try the SSD clone lab →</Link></div></footer>
 </div></main>;
}
