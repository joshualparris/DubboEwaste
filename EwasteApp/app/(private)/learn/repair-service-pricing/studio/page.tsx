"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { analyseQuote, assessNumber, calculateFloor, calculateJob, money, scenarioBank } from "@/lib/learning/repair-pricing";
import type { RepairScenario, BudgetJudgement } from "@/lib/learning/repair-pricing";
import styles from "./studio.module.css";

type Stage="rate"|"case"|"handover"|"review";
type Choice="stop"|"continue"|"refer";
type Consent={data:boolean;parts:boolean;stop:boolean;scope:boolean};
type History=Record<string,{score:number;best:number;date:string;tries:number}>;
const assumptions=["Fictional Australian examples, not recommended local prices or an issued customer quote.","Costs are illustrative net inputs. Real GST credits, business structure, accounting and market demand affect real quotes.","The studio saves practice scores in this browser only; it does not certify competence or submit to AssetFlow."];
const resources=[
  {label:"Set a sustainable rate",provider:"business.gov.au",url:"https://business.gov.au/products-and-services/choose-a-pricing-strategy",kind:"Free Australian guide",why:"Compare cost-plus, hourly, competitors, price presentation and the distinction between expenses and selling price."},
  {label:"Repair shop labour rate calculation",provider:"Tech Care Association",url:"https://techcareassociation.org/2026/09/23/tech-repair-shop-labor-rate-formula/",kind:"Free worked practitioner lesson",why:"Advanced utilisation, overhead, target margin, a calculator, and real operational constraints. US figures are not Australian benchmarks."},
  {label:"Written repair notices",provider:"Australian Competition and Consumer Commission",url:"https://www.accc.gov.au/consumers/problem-with-a-product-or-service-you-bought/repair-notices",kind:"Australian regulatory guidance",why:"Know when the customer needs an individual written data-loss and refurbished-parts notice before accepting a repair."},
  {label:"Display a genuine total price",provider:"ACCC",url:"https://www.accc.gov.au/business/pricing/price-displays",kind:"Australian regulatory guidance",why:"Consumer-facing prices must clearly show the minimum total, including taxes and unavoidable fees."},
  {label:"Invoices and tax invoices",provider:"business.gov.au",url:"https://business.gov.au/finance/payments-and-invoicing/how-to-invoice",kind:"Free Australian guide",why:"Invoice type, GST registration distinctions, itemisation, dates and recordkeeping."},
  {label:"Watch a technician troubleshoot",provider:"Professor Messer",url:"https://www.youtube.com/watch?v=HgeURynWn_w",kind:"Free video",why:"Count the steps that a paid diagnostic actually includes before assuming an hourly price."},
  {label:"Hear repair shop pricing arguments",provider:"Podnutz",url:"https://podnutz.com/podnutz181/",kind:"Free practitioner podcast",why:"Compare historical hardware markup opinions with today's cost-based calculation; old US prices are not local evidence."},
  {label:"Long-form Australian field lesson",provider:"DubboEwaste research",url:"https://github.com/joshualparris/DubboEwaste/blob/main/docs/COMPUTER-REPAIR-SERVICE-PRICING-2026-10-11.md",kind:"Full source notes",why:"Includes model quotes, consent cap, local benchmarking method, consumer notices and practical template."}
];

/** Direct episode/video or dedicated course links, not search-result pages.
 * Original creators host playback. No embedded third-party trackers.
 * Costing decisions use Australian source guidance, not US repair rate claims.
 */
const featuredMedia = [
 {id:"video-side-repairs",type:"video",stage:"01 · Rate engineering",provider:"Electronics Repair School",title:"Don't Be Afraid to Charge Money for Side Repairs",url:"https://www.classcentral.com/course/youtube-don-t-be-afraid-to-charge-money-for-these-side-repairs-446448",duration:"19-minute free video course",description:"A technician's perspective on charging for time and expertise rather than treating side repairs as free work.",task:"After watching, identify two non-part costs the presenter overlooks or underestimates. Recalculate an Australian hourly floor using the studio.",caveat:"External Class Central listing links to YouTube. Practitioner advice, not an Australian price benchmark."},
 {id:"video-ssd-copy",type:"video",stage:"02 · Quote simulator",provider:"Crucial / Micron",title:"Installing a Crucial 2.5-inch SSD: Copy",url:"https://www.youtube.com/watch?v=pQw4E8ecL5c",duration:"Free instructional video",description:"Walk through preparing and copying an existing drive when quoting an SSD migration.",task:"List which operations require your hands-on time, which may run unattended, and two extra checks before touching a customer's original disk.",caveat:"Older vendor-specific migration example. Cloning is not an independently verified backup; confirm device and customer permission."},
 {id:"video-ssd-install",type:"video",stage:"02 · Quote simulator",provider:"Crucial / Micron",title:"Installing a Crucial 2.5-inch SSD: Install",url:"https://www.youtube.com/watch?v=dy7An1DkieQ",duration:"Free instructional video",description:"Observe the physical SSD fitting and verification tasks that a labour quote must allow for.",task:"Create an SSD quote checklist including isolation, drive identification, fitting, boot verification and a no-data-loss caveat.",caveat:"Generic vendor demonstration; not a model-specific repair procedure or proof of safe data migration."},
 {id:"video-troubleshoot",type:"video",stage:"02 · Quote simulator",provider:"Professor Messer",title:"Computer hardware troubleshooting: diagnostic reasoning",url:"https://www.youtube.com/watch?v=HgeURynWn_w",duration:"Free A+ teaching video",description:"Count the diagnostic steps behind an intermittent hardware symptom before promising a fixed-fee outcome.",task:"Draft a capped diagnostic quote with three inclusions, two exclusions and one stop-work trigger for an uncertain no-power complaint.",caveat:"Demonstration teaches diagnostic scope, not Australian labour prices; check the original video title and playback on YouTube."},
 {id:"podcast-new-shop",type:"podcast",stage:"01 · Rate engineering",provider:"Computer Repair Academy",title:"Repair Shop Pricing: How Much Should You Charge? — S3 Ep2",url:"https://music.amazon.com.au/podcasts/64e7a117-f5f2-4195-b63d-6ac99d620a81/episodes/2a5fa4d5-0811-489a-a6b4-a8e829a6fd41/computer-repair-academy-why-is-this-pc-so-slow-performance-problems-pc-hardware-repair-shop-pricing---s3-ep2",duration:"21-minute episode · 2 September 2026",description:"The Office Desk segment discusses what a new repair business should charge, alongside real troubleshooting and SSD tools.",task:"Listen to the pricing segment; write down one valid costing principle and one recommendation that needs checking for Australian GST, overhead or consumer rights.",caveat:"Mixed-topic podcast; pricing is one segment. US-style practitioner opinion, not a Dubbo rate card. Player availability varies."},
 {id:"podcast-hardware-markup",type:"podcast",stage:"03 · Customer handover",provider:"The Computer Repair Podcast / Podnutz",title:"Episode 181: Hardware Markup",url:"https://podnutz.com/podnutz181/",duration:"Free audio + MP3 page · 19 May 2016",description:"Technicians debate whether and how a repair business should mark up the replacement parts it supplies.",task:"Compare 20% markup against 20% gross margin on a $160 total cost. Explain the difference in plain English to a customer.",caveat:"Historical US discussion; parts markup is not the same as overall job margin and is not legal/tax advice."}
] as const;

const consentLabels:{key:keyof Consent;label:string;why:string}[]=[
  {key:"data",label:"Issue the required individual written data-loss warning before accepting a consumer data-bearing repair",why:"A sign in the shop is not the written notice required by ACCC guidance."},
  {key:"parts",label:"Address the required refurbished-parts notice where the repairer may use refurbished parts",why:"The legal notice depends on repairer practice; this simulation assumes a refurbishing repair business."},
  {key:"scope",label:"Describe inclusions, exclusions, a diagnostic fee if relevant, and the maximum amount authorised",why:"A price without a defined outcome leaves the customer's consent ambiguous."},
  {key:"stop",label:"Stop work and seek explicit new approval for unexpected costs or work outside the agreed scope",why:"A $75 hidden extra part is not permission to increase the final invoice."}
];
function useProgress(){
 const [history,setHistory]=useState<History>({});
 const [ready,setReady]=useState(false);
 useEffect(()=>{try{const stored=localStorage.getItem("assetflow:pricing-studio:v1");if(stored){const parsed=JSON.parse(stored);if(parsed&&typeof parsed==="object")setHistory(parsed);}}catch{}setReady(true);},[]);
 const save=(id:string,score:number)=>setHistory(current=>{
  const old=current[id],next={...current,[id]:{score,best:Math.max(score,old?.best??old?.score??0),date:new Date().toISOString(),tries:(old?.tries??0)+1}};
  try{localStorage.setItem("assetflow:pricing-studio:v1",JSON.stringify(next));}catch{}
  return next;
 });
 const clear=()=>{setHistory({});try{localStorage.removeItem("assetflow:pricing-studio:v1")}catch{}};
 return {history,save,clear,ready};
}
function NumberEntry({label,value,onChange,min=0,max=100000,step=1,help}:{
 label:string;value:number;onChange:(n:number)=>void;min?:number;max?:number;step?:number;help?:string
}){return <label className={styles.numberEntry}><span>{label}</span><input type="number" inputMode="decimal" min={min} max={max} step={step} value={Number.isFinite(value)?value:""} onChange={e=>{const n=Number(e.target.value);onChange(Number.isFinite(n)?Math.min(max,Math.max(min,n)):0)}}/>{help?<small>{help}</small>:null}</label>}
function Note({children}:{children:React.ReactNode}){return <p className={styles.note}>{children}</p>}
export default function PricingStudio(){
 const [stage,setStage]=useState<Stage>("rate");
 const [monthlyOverhead,setMonthlyOverhead]=useState(1800);
 const [monthlyLabour,setMonthlyLabour]=useState(3600);
 const [paidHours,setPaidHours]=useState(160);
 const [utilisation,setUtilisation]=useState(60);
 const [margin,setMargin]=useState(25);
 const [estimate,setEstimate]=useState(75);
 const [showRate,setShowRate]=useState(false);
 const [which,setWhich]=useState("ssd");
 const [gstRegistered,setGstRegistered]=useState(true);
 const [price,setPrice]=useState(0);
 const [priceTouched,setPriceTouched]=useState(false);
 const [scopeNote,setScopeNote]=useState("");
 const [consent,setConsent]=useState<Consent>({data:false,parts:false,stop:false,scope:false});
 const [choice,setChoice]=useState<Choice>("continue");
 const [budgetJudgement,setBudgetJudgement]=useState<BudgetJudgement|null>(null);
 const [checked,setChecked]=useState(false);
 const [feedback,setFeedback]=useState("");
 const [reflected,setReflected]=useState("");
 const [floorPassed,setFloorPassed]=useState(false);
 const {history,save,clear,ready}=useProgress();
 const caseInfo=scenarioBank.find(x=>x.id===which)??scenarioBank[0];
 const rate=useMemo(()=>calculateFloor(monthlyOverhead,monthlyLabour,paidHours,utilisation,margin),[monthlyOverhead,monthlyLabour,paidHours,utilisation,margin]);
 const quotation=useMemo(()=>calculateJob(caseInfo.labourCost,caseInfo.partCost,caseInfo.overhead,caseInfo.reworkReserve,caseInfo.targetMargin,gstRegistered),[caseInfo,gstRegistered]);
 const result=useMemo(()=>analyseQuote(caseInfo,price,gstRegistered,consent,choice,budgetJudgement),[caseInfo,price,gstRegistered,consent,choice,budgetJudgement]);
 const completed=Object.keys(history).filter(x=>history[x].score===100).length;
 const nextReview=Object.values(history).length>0?Object.values(history).map(h=>new Date(new Date(h.date).getTime()+3*86400000)).sort((a,b)=>a.getTime()-b.getTime())[0]:null;
 const navigate=(next:Stage)=>{setStage(next);document.getElementById("pricing-studio")?.scrollIntoView({behavior:"smooth",block:"start"})};
 const selectScenario=(id:string)=>{setWhich(id);setPriceTouched(false);setPrice(0);setConsent({data:false,parts:false,stop:false,scope:false});setChoice("continue");setBudgetJudgement(null);setChecked(false);setScopeNote("");setFeedback("");};
 const validInput=[monthlyOverhead,monthlyLabour,paidHours,utilisation,margin].every(Number.isFinite)&&paidHours>0&&utilisation>0&&margin<100&&Number.isFinite(rate.required);
 const floorCorrect=validInput&&assessNumber(estimate,rate.required,.015);
 const canSubmit=priceTouched&&scopeNote.trim().length>=50;
 function mark(){
  if(!canSubmit)return;
  setChecked(true);
  const score=result.points;
  save(caseInfo.id,score);
 }
 const quoteText=()=>{
   const act=caseInfo.acceptability==="reapproval"?"PAUSE pending revised authorisation":"REFER; don't promise work beyond competence/value";
   return [
    "TRAINING QUOTE ONLY — FICTIONAL CASE",caseInfo.title,caseInfo.device,
    "Scope: "+(scopeNote.trim()||"NOT YET DEFINED"),
    "Included: diagnostic and labour costs, part if applicable, allocated overhead and rework allowance.",
    "Excluded: unsanctioned extras, unverified data recovery, unexpected board-level or safety hazards.",
    "Proposed selling price ex GST: "+money(result.numbers.exGST),
    "GST: "+(gstRegistered?money(result.numbers.gst)+" (GST-registered example)":"Not charged (unregistered example)"),
    "Customer total: "+money(result.numbers.incGST),
    "Authorisation limit: "+money(caseInfo.approvalCap),
    "Written data-loss notice (simulated checklist): "+(consent.data?"Planned; real written notice must still be delivered":"NOT YET ADDRESSED"),
    "Refurbished-parts notice (simulated checklist): "+(consent.parts?"Planned where applicable; real written notice must still be delivered":"NOT YET ADDRESSED"),
    "Unexpected issue: "+caseInfo.hiddenConstraint,
    "Recommended response: "+act,
    "No consumer approval recorded. The simulation is not a legal repair notice, invoice or customer agreement."
   ].join("\n");
 };
 const [copied,setCopied]=useState(false);
 async function copyQuote(){try{await navigator.clipboard.writeText(quoteText());setCopied(true);}catch{setCopied(false);setFeedback("Copy was blocked by the browser. Use the printable quote summary instead.")}}
 function exportEvidence(){
   const report=[
     "ASSETFLOW LEARNING — REPAIR PRICING STUDIO EVIDENCE",
     "Self-assessment only, not a certificate, audit, consumer notice or service invoice.",
     "Date: "+new Date().toLocaleString("en-AU"),"",
     "RATE EXERCISE (FICTIONAL)", 
     "Monthly technician cost: "+money(monthlyLabour), "Monthly operating overhead: "+money(monthlyOverhead),
     "Paid hours: "+paidHours+"; billable utilisation: "+utilisation+"%; billable hours: "+rate.billableHours.toFixed(2),
     "Target operating margin: "+margin+"%; derived hourly rate: "+money(rate.required),
     "Student estimate: "+money(estimate)+"; checked correctly this session: "+(floorPassed?"yes":"no"),"",
     "SCENARIO PRACTICE HISTORY (SAVED ONLY IN THIS BROWSER)",
     ...scenarioBank.map(x=>{const h=history[x.id];return x.title+": "+(h?"latest "+h.score+"/100; best "+h.best+"/100; attempts "+h.tries+"; last "+new Date(h.date).toLocaleDateString("en-AU"):"not attempted");}),"",
     "CURRENT CASE — "+caseInfo.title,
     "Customer price entered: "+money(price)+"; correct example total: "+money(quotation.incGST),
     "Customer scope: "+(scopeNote.trim()||"Not written"),
     "Change-of-scope decision: "+choice,
    "Customer approval cap judgement: "+(budgetJudgement||"Not answered"),
    "Correct approval cap judgement: "+result.correctBudgetJudgement,
    "Approval cap judgement correct: "+result.budgetCorrect,
     "Data notice planned in simulation: "+consent.data,
     "Refurbished parts notice planned in simulation: "+consent.parts,
     "Maximum approval and scope clarified: "+consent.scope,
     "New costs will be paused before work: "+consent.stop,
     "Calculated outcome: "+result.points+"/100 (choices and arithmetic only; free text not graded)","",
     "DELAYED RECALL WRITING (NOT AUTOMATICALLY SCORED)",reflected.trim()||"No written recall yet.","",
     "Supervisor should observe: cost arithmetic, assumptions, customer communication, safe scope, repair/data notices, and the decision to stop or refer.",
     "This export is not evidence that a real customer received notices or approved a service."
   ].join("\n");
   const blob=new Blob([report],{type:"text/plain;charset=utf-8"});
   const url=URL.createObjectURL(blob);
   const a=document.createElement("a");a.href=url;a.download="repair-pricing-practice-evidence.txt";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
 }
 const scoreLabel=(n:number)=>n===100?"Complete simulation":n>=80?"Strong, but missing a required safeguard":n>=60?"Developing reasoning":"Return to the worked lessons";
 return <main className={styles.page} id="pricing-studio">
   <div className={styles.breadcrumb}><Link href="/learn/repair-service-pricing">← Computer Repair Pricing course</Link><span>Practice lab · AUD</span></div>
   <header className={styles.hero}>
    <div><div className={styles.kicker}>ASSETFLOW ACADEMY · INTERACTIVE CAPSTONE</div><h1>REPAIR PRICING<br/><em>STUDIO.</em></h1><p>Build a sustainable labour rate, price actual repair decisions, navigate authorisation and practise producing a transparent customer quote.</p>
      <div className={styles.heroButtons}><button onClick={()=>navigate("case")}>Start repair scenario ↗</button><button className={styles.lightButton} onClick={()=>navigate("rate")}>Calculate labour floor</button><a className={styles.mediaHeroLink} href="#pricing-media">Watch videos & listen to podcasts ↓</a></div>
    </div>
    <div className={styles.heroScore}><span>YOUR PRACTICE RECORD</span><strong>{ready?completed+" / "+scenarioBank.length:"—"}</strong><p>Scenario decisions fully correct. These are learning simulations, not competency certificates.</p><div className={styles.meter}><div style={{width:completed/scenarioBank.length*100+"%"}}/></div>{nextReview?<small>Suggested review: {nextReview.toLocaleDateString("en-AU")}</small>:<small>Complete a scenario to start three-day retrieval review.</small>}</div>
   </header>
   <nav className={styles.tabStrip} aria-label="Studio sections">
    {([["rate","01 · Rate engineering"],["case","02 · Quote simulator"],["handover","03 · Customer handover"],["review","04 · Mastery & sources"]] as const).map(([id,name])=><button key={id} aria-current={stage===id?"step":undefined} className={stage===id?styles.onTab:""} onClick={()=>navigate(id)}>{name}</button>)}
   </nav>
   <div className={styles.inner}>
    {stage==="rate"&&<section className={styles.module}>
      <div className={styles.eyebrow}>STEP 01 / COST ENGINEERING</div><h2>Your sustainable labour-rate floor</h2>
      <p className={styles.lead}>The hours a technician is paid for are not the same as hours that customers are billed for. These fictional figures demonstrate how utilisation changes the price that covers the business's costs.</p>
      <div className={styles.columns}>
        <div className={styles.panel}>
          <h3>Adjust the business assumptions</h3>
          <div className={styles.inputs}>
            <NumberEntry label="Monthly operating expenses (excluding technician pay) · $" value={monthlyOverhead} onChange={setMonthlyOverhead}/>
            <NumberEntry label="Monthly technician labour cost incl. owner pay · $" value={monthlyLabour} onChange={setMonthlyLabour}/>
            <NumberEntry label="Paid work hours per month" value={paidHours} min={1} max={500} onChange={setPaidHours}/>
            <NumberEntry label="Actual billable utilisation · %" value={utilisation} min={1} max={100} onChange={setUtilisation}/>
            <NumberEntry label="Target operating margin · %" value={margin} min={0} max={75} onChange={setMargin}/>
          </div>
          <details><summary>How this differs from markup</summary><p>Markup applies profit as a percentage of costs. Margin measures profit as a percentage of sales. To target 25% margin, divide costs by 0.75, not multiply by 1.25. Don't add overhead twice.</p></details>
        </div>
        <div className={styles.panel}>
          <h3>Visualise the billable-hours gap</h3>
          <div className={styles.timeViz} role="img" aria-label={rate.billableHours.toFixed(1)+" billable of "+paidHours+" paid hours"}><div style={{width:utilisation+"%"}}/><span>{utilisation}% billed</span></div>
          <div className={styles.keyFacts}><div><small>Paid hours</small><strong>{paidHours.toFixed(0)}</strong></div><div><small>Billable hours</small><strong>{rate.billableHours.toFixed(1)}</strong></div></div>
          <p className={styles.muted}>If utilisation halves, the labour revenue per billed hour needed to cover the same monthly costs increases substantially.</p>
          <div className={styles.guess}>
            <label>Before revealing the answer: what hourly charge meets this margin? (AUD)
              <input type="number" min="0" step=".01" value={estimate} onChange={e=>{setEstimate(Number(e.target.value));setShowRate(false)}}/>
            </label>
            <button disabled={!validInput} onClick={()=>{setShowRate(true);if(floorCorrect)setFloorPassed(true)}}>Check my calculation</button>
          </div>
          {showRate&&<div className={floorCorrect?styles.correct:styles.incorrect} role="status"><strong>{floorCorrect?"Correct calculation.":"Not yet: check billable hours and margin."}</strong><p>Monthly cost = {money(monthlyOverhead)} + {money(monthlyLabour)} = {money(monthlyOverhead+monthlyLabour)}. Billable hours = {paidHours} × {utilisation}% = {rate.billableHours.toFixed(1)}. Cost floor = {money(rate.costPerBillable)}/hour. With {margin}% target margin: <strong>{money(rate.required)}/billed hour</strong>.</p></div>}
          <p className={styles.muted}>These are teaching assumptions. Real business cost structures, taxes and utilisation vary.</p>
        </div>
      </div>
      <div className={styles.sourceBand}><a href={resources[0].url} target="_blank" rel="noopener noreferrer">Australian Government: choose a pricing strategy ↗</a><a href={resources[1].url} target="_blank" rel="noopener noreferrer">Tech Care Association: labour-rate calculation ↗</a></div>
      <div className={styles.actions}><button onClick={()=>navigate("case")}>Continue to realistic job quoting →</button></div>
    </section>}

    {stage==="case"&&<section className={styles.module}>
      <div className={styles.eyebrow}>STEP 02 / PRACTICAL JOB SIMULATOR</div><h2>Quote a repair. Defend the decision.</h2>
      <p className={styles.lead}>Pick a job, calculate a customer price, specify what you'll do, and decide what happens when unexpected work appears. <strong>Choose before revealing feedback.</strong></p>
      <div className={styles.scenarios}>{scenarioBank.map(x=><button key={x.id} className={which===x.id?styles.selectedCase:""} onClick={()=>selectScenario(x.id)}><span>{x.severity}</span><strong>{x.title}</strong><small>{history[x.id]?history[x.id].score+" / 100 best score":"Not attempted"}</small></button>)}</div>
      <div className={styles.caseContext}>
        <div><span className={styles.eyebrow}>CUSTOMER BRIEF</span><h3>{caseInfo.device}</h3><p><strong>Customer wants:</strong> {caseInfo.ownerNeed}</p><p><strong>Known:</strong> {caseInfo.known}</p><p><strong>Uncertain:</strong> {caseInfo.uncertainty}</p><p className={styles.casePrompt}>{caseInfo.prompt}</p></div>
        <div><span className={styles.eyebrow}>INTERNAL JOB COSTS · EX GST</span>
          <div className="table-wrap"><table><tbody>{[["Technician cost",caseInfo.labourCost],["Landed part cost",caseInfo.partCost],["Unrecovered overhead",caseInfo.overhead],["Expected rework provision",caseInfo.reworkReserve]].map(([name,amount])=><tr key={name}><th>{name}</th><td>{money(Number(amount))}</td></tr>)}
          <tr><th><strong>Total internal cost</strong></th><td><strong>{money(quotation.cost)}</strong></td></tr></tbody></table></div>
          <div className={styles.caseFacts}><div>Target job margin <strong>{caseInfo.targetMargin}%</strong></div><div>Current authorisation cap <strong>{money(caseInfo.approvalCap)}</strong></div><div>Comparable replacement <strong>{money(caseInfo.expectedReplacement)}</strong></div></div>
        </div>
      </div>
      <div className={styles.columns}>
        <div className={styles.panel}>
          <h3>1. Price it from costs, not from a guess</h3>
          <label className={styles.switchLine}><input type="checkbox" checked={gstRegistered} onChange={e=>{setGstRegistered(e.target.checked);setChecked(false)}}/> Example business is registered for GST</label>
          <label className={styles.guessLabel}>Enter a total customer price in AUD {gstRegistered?"including GST":"with no GST added"}
            <input type="number" inputMode="decimal" min="0" max="100000" step=".01" value={priceTouched?price:""} placeholder="Your calculated total" onChange={e=>{setPrice(Number(e.target.value));setPriceTouched(true);setChecked(false)}}/>
          </label>
          <p className={styles.muted}>Use cost ÷ (1 − target margin). Add GST only if the simulated business is registered. The quote is a fictional single total; do not present it as a local market rate.</p>
          <fieldset className={styles.decision}>
           <legend>Independent check: does the full customer price fit the existing authorisation cap?</legend>
           <p className={styles.muted}>Compare the TOTAL payable amount (including GST if registered) with the cap above. A mathematically correct quote is not automatically approved.</p>
           {([["within","Yes · at or below the approved total cap"],["over","No · the total exceeds existing authority"]] as const).map(([id,label])=>
            <label key={id}><input type="radio" name={"pricing-budget-"+which} checked={budgetJudgement===id} onChange={()=>{setBudgetJudgement(id);setChecked(false)}}/><span>{label}</span></label>)}
          </fieldset>
          <h3>2. Write the scope</h3>
          <label className={styles.textLabel}>What is included, excluded and uncertain? Write at least 50 characters.
            <textarea value={scopeNote} onChange={e=>{setScopeNote(e.target.value);setChecked(false)}} rows={4} maxLength={1200} placeholder="I will diagnose... Includes... Excludes... If unexpected work appears..."/>
          </label>
          <p className={styles.charCount}>{scopeNote.trim().length} characters · Write an honest, testable outcome.</p>
        </div>
        <div className={styles.panel}>
          <h3>3. Protect the customer</h3>
          <p className={styles.muted}>The scenario assumes the shop sometimes uses refurbished parts and accepts customer data-bearing devices. Check each action you will actually take in the simulated workflow.</p>
          <fieldset className={styles.checks}><legend>Required protections</legend>{consentLabels.map(item=><label key={item.key}><input type="checkbox" checked={consent[item.key]} onChange={e=>{setConsent(x=>({...x,[item.key]:e.target.checked}));setChecked(false)}}/><span>{item.label}<small>{item.why}</small></span></label>)}</fieldset>
          <h3>4. The fault changes</h3>
          <p className={styles.surprise}>{caseInfo.hiddenConstraint}</p>
          <fieldset className={styles.decision}><legend>Choose the next action</legend>
           {([["continue","Proceed and bill after repair; the extra cost can be explained later"],["stop","Pause and request new approval before any extra work"],["refer","Explain value/competency concerns and refer or recommend replacement"]] as const).map(([id,name])=><label key={id}><input type="radio" name={"price-decision-"+which} checked={choice===id} onChange={()=>{setChoice(id);setChecked(false)}}/><span>{name}</span></label>)}
          </fieldset>
        </div>
      </div>
      <div className={styles.actions}><button disabled={!canSubmit} onClick={mark}>Evaluate my quote and decision →</button><button className={styles.outline} onClick={()=>navigate("handover")}>Preview customer handover</button></div>
      {!canSubmit&&<Note>To evaluate: provide a numeric price and at least 50 characters explaining the scope. You can still explore the rest of the studio.</Note>}
      {checked&&<section className={result.points===100?styles.gradePass:styles.gradeFix} role="status" aria-live="polite">
         <div className={styles.gradeHead}><strong>{result.points} / 100</strong><div><h3>{scoreLabel(result.points)}</h3><p>{result.points===100?"Well defended in this fictional scenario. Now justify it in a real supervised assessment.":"Review the reasons below and attempt again; your earlier highest score is retained."}</p></div></div>
         <ul>
          <li>{result.priceCorrect?"✓ Price calculation is within tolerance.":"✕ Price calculation needs correcting."} Internal cost: {money(result.numbers.cost)}; at {caseInfo.targetMargin}% margin: {money(result.numbers.exGST)} ex GST, plus {gstRegistered?money(result.numbers.gst)+" GST":"no GST"} = <strong>{money(result.numbers.incGST)} customer total</strong>.</li>
          <li>{result.budgetCorrect?"✓ Correct check against the customer's approval cap.":"✕ Your comparison with the customer's approved maximum is incorrect or unanswered."} Customer-approved limit: {money(caseInfo.approvalCap)}; this example's total: {money(result.numbers.incGST)}. {result.capExceeded?"The total exceeds the cap and work is not currently authorised.":"The base quote is within the cap, but unforeseen costs still need approval."}</li>
          <li>{result.actionCorrect?"✓ Correct change-of-scope decision.":"✕ The chosen change-of-scope decision is not justified."} {caseInfo.acceptability==="reapproval"?"Pause and get explicit new approval before further work.":"Recommend referral or replacement because repair reliability, value or competence is in doubt."}</li>
          <li>{result.missing.length===0?"✓ All required simulated safeguards addressed.":"✕ Still missing: "+result.missing.join("; ")+". "}</li>
          <li>Cost ÷ price = {(100-result.numbers.actualMargin).toFixed(1)}% and gross margin = {result.numbers.actualMargin.toFixed(1)}%, subject to correct cost allocations. Reassess if scope changes.</li>
         </ul>
        </section>}
      <Note>Scores record calculations and choices, not the quality of your written scope or actual repair competency. A supervisor still needs to review the written reasoning and observe real work.</Note>
    </section>}

    {stage==="handover"&&<section className={styles.module}>
      <div className={styles.eyebrow}>STEP 03 / CLIENT COMMUNICATION</div><h2>Make a quote a customer could understand.</h2>
      <p className={styles.lead}>A sustainable internal calculation is not enough. The customer needs a single transparent total, a defined service, exclusions and informed consent before the work changes.</p>
      <div className={styles.columns}>
        <div className={styles.quoteSheet}>
          <div className={styles.quoteTop}><strong>TRAINING QUOTATION</strong><span>NOT A REAL INVOICE</span></div>
          <p className={styles.quoteTitle}>{caseInfo.title}</p><p>{caseInfo.device}</p>
          <dl><div><dt>Scope</dt><dd>{scopeNote.trim()||"Not defined yet. Return to the case to write an explicit scope."}</dd></div><div><dt>Internal cost (not a customer bill)</dt><dd>{money(quotation.cost)}</dd></div><div><dt>Service price (ex GST)</dt><dd>{money(quotation.exGST)}</dd></div><div><dt>{gstRegistered?"GST (10%)":"GST"}</dt><dd>{gstRegistered?money(quotation.gst):"Not charged"}</dd></div></dl>
          <div className={styles.quoteTotal}><span>Customer total</span><strong>{money(quotation.incGST)}</strong></div>
          <p><strong>Approval cap:</strong> {money(caseInfo.approvalCap)}. If the customer total exceeds this amount, the scope is <strong>not pre-approved</strong>.</p>
          <p><strong>Data safety:</strong> Issue the required individual written consumer repair notices as applicable before taking a device for repair. Obtain separate permission for any file access or erasure.</p>
          <p><strong>Unforeseen work:</strong> {caseInfo.hiddenConstraint} Stop and obtain revised approval; refer when skill, safety, cost or remaining useful life argues against repair.</p>
          <p className={styles.muted}>This is a generated educational draft. It is not the legally prescribed wording for a refurbished-parts notice, an invoice, or evidence of customer approval.</p>
        </div>
        <div className={styles.panel}>
          <h3>Does your quote protect both parties?</h3>
          <div className={styles.quoteChecklist}>
            <p><strong>Defined output</strong> — What will the device do when it is returned?</p>
            <p><strong>Constraints</strong> — Existing storage, account locks, licence and battery hazards.</p>
            <p><strong>Authorisation</strong> — The limit is a hard stop, not permission to add fees later.</p>
            <p><strong>Fair comparison</strong> — Consider comparable refurbished replacement value and expected life.</p>
            <p><strong>Rights</strong> — Never imply a repair disclaimer removes Australian Consumer Law guarantees.</p>
          </div>
          <div className={styles.actions}><button disabled={scopeNote.trim().length<50} onClick={copyQuote}>{copied?"Copied to clipboard ✓":"Copy fictional quote text"}</button><button className={styles.outline} onClick={()=>window.print()}>Print example</button></div>
          {feedback?<p className={styles.incorrect}>{feedback}</p>:null}
          <a href={resources[2].url} target="_blank" rel="noopener noreferrer">ACCC: mandatory repair notices and timing ↗</a>
          <a href={resources[3].url} target="_blank" rel="noopener noreferrer">ACCC: single total consumer price ↗</a>
        </div>
      </div>
    </section>}

    {stage==="review"&&<section className={styles.module}>
      <div className={styles.eyebrow}>STEP 04 / RECALL · TRANSFER · EVIDENCE</div><h2>Can you do it a week later?</h2>
      <p className={styles.lead}>Mastery requires repeated retrieval and transfer to unfamiliar situations. This page only tracks this browser's simulation attempts; LMS completion and supervisor observation are separate.</p>
      <div className={styles.reviewGrid}>{scenarioBank.map((c,i)=><div className={styles.reviewCard} key={c.id}><small>{String(i+1).padStart(2,"0")} · {c.severity}</small><h3>{c.title}</h3><strong>{history[c.id]?history[c.id].score+"/100 latest":"Not attempted"}</strong><p>{history[c.id]?history[c.id].score===100?"Simulated decisions fully correct; return in 3 days to test recall.":"Review the missing steps and retry without notes.":"Attempt the scenario to establish a baseline."} {history[c.id]?"Best: "+(history[c.id].best??history[c.id].score)+"/100 · "+history[c.id].tries+" attempt(s).":""}</p><button onClick={()=>{selectScenario(c.id);navigate("case")}}>Practise this case →</button></div>)}</div>
      <div className={styles.columns}>
       <div className={styles.panel}><h3>Spaced self-test · no hints</h3><p>Without looking back, explain: why can $160 cost require a $200 ex-GST quote at 20% target margin? What changes if the owner approves $200 but a required part pushes the total to $260?</p><label className={styles.textLabel}>Write your reasoning (private; not graded)
        <textarea value={reflected} onChange={e=>setReflected(e.target.value)} rows={5} placeholder="Show your formula; explain the stop-work decision and the documented authorisation steps..."/></label>
        <details><summary>Reveal the model answer after writing</summary><p>Margin is calculated on sales: ($200-$160)/$200 = 20%. A 20% markup produces only $192 revenue and a 16.7% margin. The new $260 scope exceeds a $200 cap: pause, re-quote the new scope, offer alternatives and secure new informed consent before continuing.</p></details>
       </div>
       <div className={styles.panel}><h3>External training: multiple ways to learn</h3><p>Read cost-rate formulas, watch a real diagnostic, listen to practitioners debate markup, and read the Australian legal basis. These sources are not interchangeable.</p><div className={styles.resources}>{resources.map((r,i)=><article key={r.url}><small>{r.kind} · {r.provider}</small><h4>{r.label}</h4><p>{r.why}</p><a target="_blank" rel="noopener noreferrer" href={r.url}>Open original resource ↗</a></article>)}</div></div>
      </div>
      <div className={styles.bottomLine}>
        <div><strong>{ready?completed:0} / {scenarioBank.length}</strong><span>perfect simulations on this browser</span></div>
        <p>{floorPassed?"Labour rate floor answered correctly in this session.":"Complete the labour-rate calculation without opening the answer first."} Recheck on another day and demonstrate a customer-safe quote with a qualified supervisor. No automatic certification is awarded.</p>
        <button onClick={exportEvidence} className={styles.outline}>Download practice evidence (.txt)</button><button className={styles.outline} onClick={()=>{if(window.confirm("Clear locally saved Pricing Studio practice scores on this browser?"))clear()}}>Reset local practice record</button>
      </div>
    </section>}
    
   <section className={styles.mediaSection} id="pricing-media" aria-labelledby="pricing-media-heading">
     <div className={styles.mediaIntro}>
       <div><span className={styles.eyebrow}>SIX FREE LEARNING RESOURCES · WATCH & LISTEN</span>
         <h2 id="pricing-media-heading">Watch the work. Hear the pricing decisions.</h2>
         <p>Use these creator-hosted videos and actual podcast episodes to test your quoting assumptions. Each resource has a task to complete in the studio; opening a link alone does not earn a mastery score.</p>
       </div>
       <a href="#pricing-studio" className={styles.mediaBack}>Back to simulator ↑</a>
     </div>
     <div className={styles.mediaGrid}>
       {featuredMedia.map(item=><article className={styles.mediaCard} key={item.id}>
         <div className={styles.mediaCardTop}><span className={styles.mediaKind}>{item.type==="video"?"▶ VIDEO":"♫ PODCAST"}</span><span className={styles.mediaStage}>{item.stage}</span></div>
         <h3>{item.title}</h3>
         <p className={styles.mediaProvider}>{item.provider} · {item.duration}</p>
         <p>{item.description}</p>
         <div className={styles.mediaTask}><strong>Try this:</strong> {item.task}</div>
         <p className={styles.mediaCaveat}>{item.caveat}</p>
         <a className={styles.mediaOpen} href={item.url} target="_blank" rel="noopener noreferrer"
           aria-label={"Open "+item.title+" on the original provider website (new tab)"}>
           {item.type==="video"?"Watch original video ↗":"Listen to original episode ↗"}
         </a>
       </article>)}
     </div>
     <p className={styles.mediaDisclaimer}>Links open on their providers' sites; captions, transcripts, availability and adverts are controlled by those providers. Audio and video are optional study formats alongside official Australian guidance, not proof of fair local pricing or a real-world repair qualification.</p>
   </section>
    <footer className={styles.footer}><div><strong>Source-led, not just a quiz</strong><p>{assumptions.join(" ")}</p></div><Link href="/learn/repair-service-pricing">Return to the LMS course →</Link></footer>
   </div>
  </main>;
}
