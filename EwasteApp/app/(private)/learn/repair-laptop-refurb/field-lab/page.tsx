"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {curatedResources,missions,observationLog,type Tier,type MissionId} from "@/lib/learning/storage-clone-lab";
import styles from "./field-lab.module.css";

type Answer={id:string;choice:number;correct:boolean;level:Tier;};
type Answers=Partial<Record<MissionId,Answer>>;
type Notes=Partial<Record<MissionId,string>>;
const evidenceMinimum=80;
const tierLabel=(n:Tier)=>n===1?"Foundation":n===2?"Technician":"Expert judgement";
const nextTier=(n:Tier,correct:boolean):Tier=>Math.max(1,Math.min(3,n+(correct?1:-1))) as Tier;
const summary=(notes:Notes,answers:Answers)=>{
 const lines=["STORAGE CLONE FIELD LAB — PRACTICE RECORD","Training simulation only; NOT a professional repair certificate.", "Do not include a real owner's name, password, recovery key or sensitive files.",""];
 missions.forEach(m=>{
  const a=answers[m.id];const question=m.questions.find(q=>q.id===a?.id);
  lines.push(m.heading, "Decision: "+(question&&a?question.choices[a.choice]:"Not attempted"),"Outcome: "+(a?(a.correct?"Matched model reasoning":"Needs review"):"Not attempted"),"Observed/test evidence: "+(notes[m.id]?.trim()||"Not recorded"),"What to verify: "+(question?.evidence||m.objective),"");
 });
 lines.push("Release requires real-device testing, client consent and separate supervisor observation/sign-off.");
 return lines.join("\n");
};
export default function CloneFieldLab(){
 const [startTier,setStartTier]=useState<Tier>(2);
 const [tier,setTier]=useState<Tier>(2);
 const [index,setIndex]=useState(0);
 const [answers,setAnswers]=useState<Answers>({});
 const [notes,setNotes]=useState<Notes>({});
 const [reveals,setReveals]=useState<Partial<Record<MissionId,boolean>>>({});
 const [copied,setCopied]=useState(false);
 const [speaking,setSpeaking]=useState(false);
 const mission=missions[index];
 const answer=answers[mission.id];
 const question=mission.questions.find(q=>q.id===answer?.id)??mission.questions[tier-1];
 const score=missions.filter(m=>answers[m.id]?.correct).length;
 const answeredCount=Object.keys(answers).length;
 const allDone=answeredCount===missions.length;
 const completeNotes=missions.filter(m=>(notes[m.id]??"").trim().length>=evidenceMinimum).length;
 const draftReady=allDone&&score>=4&&completeNotes===missions.length;
 const missed=missions.filter(m=>answers[m.id]&&!answers[m.id]?.correct);
 const progress=useMemo(()=>missions.map(m=>({name:m.heading,correct:answers[m.id]?.correct,filled:(notes[m.id]??"").trim().length>=evidenceMinimum})),[answers,notes]);
 const choose=(choice:number)=>{
  if(answers[mission.id])return;
  const correct=choice===question.correct;
  setAnswers(prev=>({...prev,[mission.id]:{id:question.id,choice,correct,level:question.level}}));
  setTier(prev=>nextTier(prev,correct));
 };
 const reset=(level:Tier)=>{
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
  setSpeaking(false);setStartTier(level);setTier(level);setIndex(0);setAnswers({});setNotes({});setReveals({});setCopied(false);
 };
 const readAloud=()=>{
  if(!("speechSynthesis" in window))return;
  window.speechSynthesis.cancel();
  if(speaking){setSpeaking(false);return;}
  const utter=new SpeechSynthesisUtterance(mission.heading+". "+mission.worked.question+". "+mission.worked.reasoning+". Caution: "+mission.worked.limits);
  utter.lang="en-AU";utter.rate=0.94;utter.onend=()=>setSpeaking(false);utter.onerror=()=>setSpeaking(false);
  setSpeaking(true);window.speechSynthesis.speak(utter);
 };
 const move=(step:number)=>{
  window.speechSynthesis?.cancel();setSpeaking(false);
  setIndex(Math.max(0,Math.min(missions.length-1,step)));
  document.getElementById("mission")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});
 };
 const copy=async()=>{
  if(!navigator.clipboard){setCopied(false);return;}
  try{await navigator.clipboard.writeText(summary(notes,answers));setCopied(true);}catch{setCopied(false);}
 };
 return <main className={styles.page}>
 <div className={styles.shell}>
  <nav className={styles.breadcrumb} aria-label="Breadcrumb">
   <Link href="/learn">Learning hub</Link><span>›</span>
   <Link href="/learn/repair-laptop-refurb">Laptop refurbishment</Link><span>›</span><strong>SSD clone field lab</strong>
  </nav>
  <header className={styles.hero}>
   <div className={styles.heroText}>
    <span className={styles.kicker}>APPLIED FIELD LAB · 5 MISSIONS · ADAPTIVE DECISIONS</span>
    <h1>When the clone<br/><em>hits 95%.</em></h1>
    <p>Turn a real HDD-to-SSD upgrade into a complete repair judgement: authorise the work, match hardware, interpret a stall, prove independent boot and decide when the machine is safe to hand over.</p>
    <div className={styles.heroLinks}><a href="#mission">Start the simulation ↓</a><a href="#sources">Watch and study ↗</a></div>
    <p className={styles.subtle}>Case is fictionalised and contains no customer files. Everything you enter remains in this browser session until you choose to copy or print it; it is not submitted automatically.</p>
   </div>
   <div className={styles.heroDiagram} role="img" aria-label="Schematic flow showing hard disk source copied by Macrium to solid-state disk, followed by a separate boot verification step">
    <div className={styles.diagramFlow}><div className={styles.hdd}><span className={styles.platter}/><strong>500 GB HDD</strong><small>Original · protected</small></div><span className={styles.arrow} aria-hidden="true">→</span><div className={styles.software}><span>Macrium</span><strong>100%</strong><small>Copy reported</small></div><span className={styles.arrow} aria-hidden="true">→</span><div className={styles.ssd}><div className={styles.chips}>▣ ▣ ▣</div><strong>SATA SSD</strong><small>Boot unverified</small></div></div>
    <div className={styles.diagramFoot}>COPY SUCCESS <span>≠</span> INDEPENDENT BOOT <span>≠</span> RELEASE APPROVAL</div>
   </div>
  </header>

  <section className={styles.evidenceStrip} aria-labelledby="case-log">
    <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>OBSERVATION VS HYPOTHESIS</span><h2 id="case-log">The actual clone timeline</h2><p>Only measured progress. Intermediate percentages are not invented, and a successful log does not diagnose drive health.</p></div></div>
    <div className={styles.graph}>
     {observationLog.map(p=><div className={styles.graphRow} key={p.time}><strong>{p.time}</strong><div className={styles.barTrack} title={p.detail}><div className={styles.bar} style={{width:p.percent+"%"}}/></div><span>{p.percent}%</span></div>)}
    </div>
    <details className={styles.details}><summary>View observations and what they do (not) prove</summary><ul>{observationLog.map(p=><li key={p.time}><strong>{p.time} · {p.percent}%:</strong> {p.detail}</li>)}</ul><p><strong>Key distinction:</strong> 100% disk active time at a low transfer rate suggests an I/O bottleneck, not a confirmed bad sector. Confirm with the clone log and drive diagnostics.</p></details>
  </section>

  <section className={styles.selection} aria-labelledby="choose-level">
   <div><span className={styles.eyebrow}>ADAPTIVE LEARNING</span><h2 id="choose-level">Choose your starting level</h2><p>Correct decisions raise the difficulty; missed decisions lower it and reveal a worked explanation. Restart at Expert for a harder second attempt.</p></div>
   <div className={styles.levelButtons}>{([1,2,3] as Tier[]).map(x=><button key={x} className={startTier===x?styles.activeTier:styles.tierButton} onClick={()=>reset(x)} aria-pressed={startTier===x}>{tierLabel(x)}</button>)}</div>
  </section>

  <section className={styles.sim} id="mission" aria-labelledby="mission-heading">
    <div className={styles.simTop}><span className={styles.eyebrow}>MISSION {index+1} / {missions.length}</span><span>{answeredCount} decisions · {score} matched reasoning · current difficulty {tierLabel(tier)}</span></div>
    <div className={styles.stageStrip} role="group" aria-label="Mission navigation">{missions.map((m,i)=><button key={m.id} type="button" className={i===index?styles.stageActive:answers[m.id]?styles.stageDone:styles.stage} onClick={()=>move(i)} aria-label={m.heading+(answers[m.id]?(answers[m.id]?.correct?", correct":", review needed"):", not answered")} aria-current={i===index?"step":undefined}>{i+1}{answers[m.id]?(answers[m.id]?.correct?" ✓":" !"):""}</button>)}</div>
    <div className={styles.caseHead}><div><h2 id="mission-heading">{mission.heading}</h2><p>{mission.objective}</p></div><span className={styles.levelPill}>{tierLabel(question.level)}</span></div>
    <div className={styles.twoCol}>
     <article className={styles.facts}><h3>What you know</h3><ul>{mission.facts.map(f=><li key={f}>{f}</li>)}</ul><p>All details are available to the learner; no hidden answer is assumed.</p></article>
     <article className={styles.worked}>
      <h3>Learn the underlying principle</h3><p>{mission.worked.question}</p>
      <div className={styles.audioActions}><button onClick={()=>setReveals(p=>({...p,[mission.id]:!p[mission.id]}))} aria-expanded={Boolean(reveals[mission.id])}>{reveals[mission.id]?"Hide worked reasoning −":"Reveal worked reasoning +"}</button><button onClick={readAloud} disabled={typeof window!=="undefined"&&!window.speechSynthesis}>{speaking?"Stop audio":"Listen to explanation ▶"}</button></div>
      {reveals[mission.id]&&<div className={styles.revealed}><p>{mission.worked.reasoning}</p><p><strong>Boundary:</strong> {mission.worked.limits}</p><p>Audio uses your device's built-in speech engine if available. The full transcript is this written explanation.</p></div>}
     </article>
    </div>
    <article className={styles.question}>
     <span className={styles.eyebrow}>DECISION · SELECT THE BEST DEFENSIBLE NEXT STEP</span>
     <h3>{question.prompt}</h3>
     <div className={styles.options}>{question.choices.map((option,i)=><button type="button" key={i} disabled={Boolean(answer)} className={answer?.choice===i?(answer.correct?styles.optionCorrect:styles.optionIncorrect):styles.option} onClick={()=>choose(i)}><span className={styles.optionLetter}>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>
     {answer&&<div className={styles.feedback} role="status"><strong>{answer.correct?"Sound judgement.":"Not the strongest next step."}</strong><p>{question.reasoning}</p><p><strong>Competing explanation:</strong> {question.alternative}</p><p><strong>Evidence that would resolve it:</strong> {question.evidence}</p><small>{answer.correct?"Your next mission may be more difficult.":"The next mission will use more scaffolding; review the worked example if needed."}</small></div>}
    </article>
    <div className={styles.reflection}><label htmlFor="mission-note"><strong>Your evidence / decision record</strong><span>Describe at least one alternative explanation, what you would check, what could change your mind and how you would document the outcome. Use fictional examples only.</span></label><textarea id="mission-note" rows={4} maxLength={2500} placeholder="I would first verify… Another possibility is… Evidence required is… I would stop if…" value={notes[mission.id]??""} onChange={e=>setNotes(p=>({...p,[mission.id]:e.target.value}))}/><small>{(notes[mission.id]??"").trim().length}/{evidenceMinimum} characters for a complete practice record · Never include passwords or real client details.</small></div>
    <div className={styles.controls}><button onClick={()=>move(index-1)} disabled={index===0}>← Previous mission</button>{index<missions.length-1?<button className={styles.primary} onClick={()=>move(index+1)} disabled={!answer}>Next mission →</button>:<a href="#debrief" className={styles.primary}>Review your debrief ↓</a>}</div>
  </section>

  <section id="debrief" className={styles.debrief}><span className={styles.eyebrow}>MEASURE THE LEARNING, NOT THE TICK BOX</span><h2>Debrief & competence evidence</h2>
   <p>Answering questions is a knowledge check; the notes below are your draft evidence, not an observed practical sign-off. Real release requires a competent supervisor's separate verification.</p>
   <div className={styles.stats}><div><strong>{score}/5</strong><span>Best-step decisions</span></div><div><strong>{completeNotes}/5</strong><span>Evidence records</span></div><div><strong>{missed.length}</strong><span>Decisions to revisit</span></div></div>
   <div className={styles.rubric}>
    {progress.map((r,i)=><div key={r.name}><span>{i+1}</span><div><strong>{r.name}</strong><p>{r.correct===undefined?"Not attempted":r.correct?"Judgement matched model reasoning":"Needs new attempt"} · {r.filled?"Written evidence drafted":"Written evidence incomplete"}</p></div></div>)}
   </div>
   <p className={draftReady?styles.readiness:styles.needsReview}>{draftReady?"Your simulation draft meets the practice thresholds (at least 4/5 decisions and all five written records). Supervisor observation and actual hardware verification are still required.":"Practice target: complete all five decisions, select at least four defensible actions, and write at least 80 characters of evidence for every mission. You can still export an incomplete record."}</p>
   <div className={styles.controls}><button type="button" onClick={copy}>Copy evidence report</button><button type="button" onClick={()=>window.print()}>Print field record</button><button onClick={()=>reset(3)}>Retry at expert level ↻</button></div>
   {copied&&<p role="status" className={styles.copied}>Evidence text copied. Paste into the course's Practical assessment when you have completed your three orientation lessons.</p>}
   <div className={styles.supervisor}><h3>Supervisor sign-off still requires real observation</h3><ul><li>Client consent and disk identity recorded before changing hardware</li><li>Exact service manual, safe power isolation and compatible parts checked</li><li>Macrium log reviewed; original media preserved according to the agreement</li><li>SSD independently boots and required data, functions and recovery are checked</li><li>Known faults, battery/RAM limits and media custody disclosed on handover</li></ul><Link href="/learn/repair-laptop-refurb#practical">Go to the actual LMS practical assessment →</Link></div>
  </section>

  <section id="sources" className={styles.resources}><span className={styles.eyebrow}>WATCH · READ · COMPARE · APPLY</span><h2>Curated external teaching</h2><p>Each link goes directly to the named resource. The Macrium video is a demonstration, not a substitute for checking your installed software version and exact laptop service manual.</p>
   <div className={styles.resourceGrid}>{curatedResources.map((r,i)=><article key={r.url}><span>{String(i+1).padStart(2,"0")} · {r.format}</span><h3>{r.title}</h3><p className={styles.provider}>{r.provider}</p><p><strong>Active-learning prompt:</strong> {r.focus}</p><a href={r.url} target="_blank" rel="noopener noreferrer">Study the original resource ↗</a></article>)}</div>
  </section>
  <footer className={styles.footer}><p>Built for the DubboEwaste Academy's existing Laptop repair, testing and refurbishment module. Simulated decisions and audio are supplementary; this activity does not issue electrical qualifications or certify erasure.</p><div><Link href="/storage-guide">Storage Explorer ↗</Link><Link href="/learn/repair-laptop-refurb">Course overview ↗</Link></div></footer>
 </div></main>;
}
