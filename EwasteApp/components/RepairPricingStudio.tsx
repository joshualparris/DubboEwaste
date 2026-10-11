"use client";

import {useEffect,useState} from "react";
import styles from "./RepairPricingStudio.module.css";
import {breakEvenRate,calculateQuote,fictionalCases,markPricingCase,type PricingInputs} from "@/lib/learning/pricing-model";

const money=(n:number)=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(n);
const examples:PricingInputs={parts:80,labour:70,overhead:20,risk:10,marginPercent:25,gstRegistered:true,authorisedMaximum:275};
type Answers={cost:string;beforeGst:string;customerTotal:string;decision:""|"proceed"|"stop"};
type Result=NonNullable<ReturnType<typeof markPricingCase>>;
const blank=():Answers=>({cost:"",beforeGst:"",customerTotal:"",decision:""});
const storageKey="pricing-studio:repair-service-pricing:v1";
export default function RepairPricingStudio(){
  const [inputs,setInputs]=useState<PricingInputs>(examples);
  const [monthly,setMonthly]=useState({overhead:600,remuneration:2400,hours:40});
  const [caseIndex,setCaseIndex]=useState(0);
  const [answers,setAnswers]=useState<Answers>(blank);
  const [assessment,setAssessment]=useState<Result|null>(null);
  const [attempts,setAttempts]=useState<{caseId:string;score:number}[]>([]);
  const [reason,setReason]=useState("");
  const [clientMessage,setClientMessage]=useState("");
  const [copyResult,setCopyResult]=useState("");
  const [ready,setReady]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{
    try{
      const saved=JSON.parse(localStorage.getItem(storageKey)??"null") as {attempts?:{caseId:string;score:number}[]}|null;
      if(saved?.attempts && Array.isArray(saved.attempts))setAttempts(saved.attempts.filter(x=>fictionalCases.some(c=>c.id===x.caseId)&&Number.isInteger(x.score)&&x.score>=0&&x.score<=4).slice(-3));
    }catch{setError("Your browser cannot read saved practice history.");}
    setReady(true);
  },[]);
  function setField(key:keyof PricingInputs,value:number|boolean){setInputs(old=>({...old,[key]:value}));setCopyResult("");}
  let quote:ReturnType<typeof calculateQuote>|null=null;
  try{quote=calculateQuote(inputs);}catch{}
  let hourly:number|null=null;
  try{hourly=breakEvenRate(monthly.overhead,monthly.remuneration,monthly.hours);}catch{}
  const lab=fictionalCases[caseIndex]??null;
  function grade(){
    if(!lab||assessment||!answers.cost.trim()||!answers.beforeGst.trim()||!answers.customerTotal.trim()||!answers.decision)return;
    const result=markPricingCase(lab.id,{
      cost:Number(answers.cost),beforeGst:Number(answers.beforeGst),customerTotal:Number(answers.customerTotal),decision:answers.decision
    });
    if(!result)return;
    setAssessment(result);
    const next=[...attempts.filter(x=>x.caseId!==lab.id),{caseId:lab.id,score:result.score}];
    setAttempts(next);
    try{localStorage.setItem(storageKey,JSON.stringify({attempts:next}));setError("");}
    catch{setError("Could not persist your results locally. The exercise still works.");}
  }
  function next(){setCaseIndex(i=>i+1);setAssessment(null);setAnswers(blank());setReason("");setClientMessage("");setCopyResult("");}
  function restart(){setCaseIndex(0);setAssessment(null);setAnswers(blank());setReason("");setClientMessage("");setCopyResult("");setAttempts([]);try{localStorage.removeItem(storageKey);}catch{}}
  const fullReport=()=>{
    if(!quote)return "";
    return [
      "ILLUSTRATIVE REPAIR ESTIMATE — NOT AN INVOICE OR WORK AUTHORISATION",
      "Scope: [record device, serial/reference, requested outcome and exclusions; do not include passwords]",
      `Internal parts cost: ${money(inputs.parts)}`,
      `Internal labour cost: ${money(inputs.labour)}`,
      `Allocated overhead: ${money(inputs.overhead)}`,
      `Expected rework reserve: ${money(inputs.risk)}`,
      `Internal total cost: ${money(quote.cost)}`,
      `Target job margin: ${inputs.marginPercent}% (not markup)`,
      `Selling price before GST: ${money(quote.beforeGst)}`,
      inputs.gstRegistered?`GST 10%: ${money(quote.gst)}`:"GST not charged — example of non-GST-registered supplier",
      `Customer-facing estimated total: ${money(quote.customerTotal)}`,
      `Customer-approved maximum: ${money(inputs.authorisedMaximum)}`,
      quote.withinCap?"Within estimated approval cap — still confirm scope and necessary notices":"STOP: estimated total exceeds approval cap; seek written revised approval",
      "Uncertainties: [test conditions, part compatibility, actual data risk, additional diagnostic work]",
      "Owner options: [repair / no repair / refer / return]",
      "Before accepting covered goods for repair, provide applicable written Australian Consumer Law repair notice; document consent and data-handling permissions.",
      "Actual final terms, genuine costs, GST status, consumer rights and applicable notices must be verified before issue."
    ].join("\n");
  };
  const update=(key:keyof Answers,value:string)=>setAnswers(old=>({...old,[key]:value}));
  return <section id="pricing-studio" aria-label="Repair pricing mastery studio" className={styles.studio}>
    <header className={styles.stack2}>
      <p className={styles.eyebrow}>Applied pricing laboratory · Australian examples</p>
      <h2 className={styles.title}>Repair Quote Studio</h2>
      <p>Work out what a job really costs, model a fair quote, practise the customer's approval boundary and test your answer on three unseen cases. These are fictional figures, not recommended Dubbo market prices.</p>
    </header>
    <div className={styles.columns}>
      <div className={styles.panel}>
        <h3 className={styles.heading}>1. What does an hour actually cost?</h3>
        <p className={styles.small}>Use expected <strong>billable</strong> hours, not hours available at work. This is a separate break-even rate exercise, not a second overhead charge to add to the job below.</p>
        <div className={styles.inputGridThree}>
          {([{field:"overhead",name:"Monthly business overhead ($)"},{field:"remuneration",name:"Monthly labour remuneration ($)"},{field:"hours",name:"Billable hours per month"}] as const).map(item=><label key={item.field} className={styles.fieldLabel}>{item.name}
            <input type="number" min={item.field==="hours"?"0.1":"0"} step="0.25" inputMode="decimal" className={styles.field} value={monthly[item.field]} onChange={e=>setMonthly(old=>({...old,[item.field]:e.target.valueAsNumber}))}/>
          </label>)}
        </div>
        <p className={styles.stat} aria-live="polite"><strong>Break-even recovery rate: {hourly===null?"Enter valid figures":money(hourly)+"/billable hour"}</strong></p>
        <p className={styles.tiny}>Wages, super, leave and tax treatment need business-specific budgeting; this simplified example does not calculate your personal salary or quote an actual customer.</p>
      </div>
      <div className={styles.panel}>
        <h3 className={styles.heading}>2. Build an itemised quote</h3>
        <p className={styles.small}>Enter consistent cost-basis figures. For GST-registered businesses, use costs excluding creditable GST; otherwise use actual unrecoverable cost. The labour field is <strong>internal cost</strong>, not a retail selling rate.</p>
        <div className={styles.inputGrid}>
          {([{field:"parts",name:"Delivered parts cost ($)"},{field:"labour",name:"Internal labour cost ($)"},{field:"overhead",name:"Additional overhead ($)"},{field:"risk",name:"Rework risk reserve ($)"},{field:"marginPercent",name:"Target gross margin (%)"},{field:"authorisedMaximum",name:"Approved maximum ($)"}] as const).map(item=><label key={item.field} className={styles.fieldLabel}>{item.name}
            <input type="number" min="0" max={item.field==="marginPercent"?"70":undefined} step="0.01" inputMode="decimal" className={styles.field} value={inputs[item.field]} onChange={e=>setField(item.field,e.target.valueAsNumber)}/>
          </label>)}
        </div>
        <label className={styles.checkbox}><input type="checkbox" checked={inputs.gstRegistered} onChange={e=>setField("gstRegistered",e.target.checked)}/> GST-registered supplier (10% taxable sale example)</label>
      </div>
    </div>
    {quote?<div className={styles.breakdown} aria-live="polite">
      <h3 className={styles.heading}>3. See exactly where the price goes</h3>
      <div className={styles.chart} role="img" aria-label={`Of the ${money(quote.beforeGst)} before-GST quote, ${money(quote.cost)} covers costs and ${money(quote.contribution)} is the target job contribution before unallocated expenses.`}>
        {([{v:inputs.parts,color:"#2563eb"},{v:inputs.labour,color:"#0d9488"},{v:inputs.overhead,color:"#a16207"},{v:inputs.risk,color:"#9333ea"},{v:quote.contribution,color:"#15803d"}]).map((x,i)=><span key={i} style={{width:`${quote!.beforeGst?x.v/quote!.beforeGst*100:0}%`,background:x.color}}/>)}
      </div>
      <div className={styles.chartLegend}>
        <span>Parts {money(inputs.parts)}</span><span>Labour {money(inputs.labour)}</span><span>Overhead {money(inputs.overhead)}</span><span>Risk {money(inputs.risk)}</span><span>Contribution {money(quote.contribution)}</span>
      </div>
      <div className={styles.totals}>
        <p>Cost base <strong className={styles.money}>{money(quote.cost)}</strong></p>
        <p>Ex GST <strong className={styles.money}>{money(quote.beforeGst)}</strong></p>
        <p>GST <strong className={styles.money}>{money(quote.gst)}</strong></p>
        <p>Customer total <strong className={styles.money}>{money(quote.customerTotal)}</strong></p>
      </div>
      <p className={quote.withinCap?styles.noticeGood:styles.noticeBadSmall}><strong>{quote.withinCap?"Under the numerical approval cap.":"STOP: estimate exceeds the customer's authorisation."}</strong> {quote.withinCap?"That is not automatic permission to begin: confirm scope, risks and required notices.":"Do not order extra parts or perform unauthorised work; explain the revised complete customer price first."}</p>
      <button type="button" className={styles.primaryButton} onClick={async()=>{try{await navigator.clipboard.writeText(fullReport());setCopyResult("Illustrative estimate copied. Review every detail before using it.");}catch{setCopyResult("Copy blocked; you can select the report text below.");}}}>Copy draft quote worksheet</button>
      {copyResult?<p role="status" className={styles.small}>{copyResult}</p>:null}
      <details><summary className={styles.summary}>Show a selectable plain-text estimate</summary><textarea readOnly value={fullReport()} rows={12} className={styles.report} aria-label="Selectable draft repair quote"/></details>
    </div>:<p role="alert" className={styles.noticeBad}>Enter valid non-negative costs and a target margin from 0% to 70% to calculate the estimate.</p>}
    <div className={styles.exercise}>
      <h3 className={styles.subheading}>4. Unseen application: three different customer decisions</h3>
      <p className={styles.small}>Predict the numbers <em>before</em> checking your working. You may use the calculator as a tool, but genuine competence also needs evidence, clear communication and supervisor-reviewed work. The automatic score covers numbers and approval logic only.</p>
      {error?<p role="alert" className={styles.small}>{error}</p>:null}
      {ready?<p className={styles.small}>Recorded cases: {attempts.length}/3 · Perfect auto-scored cases: {attempts.filter(x=>x.score===4).length}/3. Results remain in this browser, not your Academy record.</p>:null}
      {lab?<div className={styles.stack3} key={lab.id}>
        <p className={styles.caseIndex}>Case {caseIndex+1} of 3 · {lab.level}</p>
        <h4 className={styles.heading}>{lab.title}</h4><p>{lab.description}</p>
        <div className={styles.inputGridThree}>
          {([{key:"cost",label:"Internal total cost ($)"},{key:"beforeGst",label:"Price before GST ($)"},{key:"customerTotal",label:"Total customer price ($)"}] as const).map(field=><label className={styles.fieldLabel} key={field.key}>{field.label}
            <input type="number" step="0.01" inputMode="decimal" required disabled={Boolean(assessment)} className={styles.field} value={answers[field.key]} onChange={e=>update(field.key,e.target.value)}/>
          </label>)}
        </div>
        <fieldset disabled={Boolean(assessment)} className={styles.stack2}>
          <legend className={styles.strong}>Does the quoted total fit the existing authorisation?</legend>
          <label className={styles.block}><input type="radio" checked={answers.decision==="proceed"} onChange={()=>update("decision","proceed")}/> Within cap, subject to scope and consent</label>
          <label className={styles.block}><input type="radio" checked={answers.decision==="stop"} onChange={()=>update("decision","stop")}/> Exceeds cap: stop and seek revised approval</label>
        </fieldset>
        <label className={styles.fieldLabel}>What evidence could change your recommendation? <span className={styles.hintInline}>(reflection for a reviewer; not auto-scored)</span>
          <textarea rows={3} className={styles.field} value={reason} onChange={e=>setReason(e.target.value)}/>
        </label>
        <label className={styles.fieldLabel}>Write a two-sentence message explaining the quote and approval boundary to the customer <span className={styles.hintInline}>(supervisor-reviewed only)</span>
          <textarea rows={3} className={styles.field} value={clientMessage} onChange={e=>setClientMessage(e.target.value)}/>
        </label>
        {!assessment?<button type="button" className={styles.actionButton} disabled={!answers.cost||!answers.beforeGst||!answers.customerTotal||!answers.decision} onClick={grade}>Check calculation and stop-work judgement</button>:<div className={styles.feedback} role="status">
          <h5 className={styles.scoreTitle}>Automatically checked: {assessment.score}/4</h5>
          <ul className={styles.scoreList}>
            <li>Cost base: {assessment.correctness.cost?"correct":"review"} · expected {money(assessment.result.cost)}</li>
            <li>Ex-GST price: {assessment.correctness.beforeGst?"correct":"review"} · expected {money(assessment.result.beforeGst)}</li>
            <li>Customer total: {assessment.correctness.customerTotal?"correct":"review"} · expected {money(assessment.result.customerTotal)}</li>
            <li>Approval boundary: {assessment.correctness.decision?"correct":"review"} · {assessment.result.withinCap?"within cap":"stop and seek new approval"}</li>
          </ul>
          <p className={styles.small}>{lab.analysis}</p>
          <p className={styles.small}><strong>Reviewer's checklist:</strong> Are the scope, parts quality, data risks, alternatives, customer consent and uncertainties defensible? The free text has not been graded automatically.</p>
          <button className={styles.outlineButton} type="button" onClick={next}>Next scenario →</button>
        </div>}
      </div>:<div className={styles.stack3} role="status">
        <h4 className={styles.heading}>All three cases attempted</h4>
        <p>You have {attempts.filter(x=>x.score===4).length} perfect automatic results out of 3. That is formative evidence, not an observed competency sign-off.</p>
        <p>For independent assessment, submit your quote worksheet and written customer message using the course's existing <strong>Practical assessment</strong> form once your lessons are complete. The supervisor must verify the reasoning, real costs and communication.</p>
        <button type="button" className={styles.outlineButton} onClick={restart}>Restart transfer practice</button>
      </div>}
    </div>
    <footer className={styles.footer}>
      <p><strong>Read the rules:</strong> <a href="https://business.gov.au/products-and-services/choose-a-pricing-strategy" className={styles.underline} target="_blank" rel="noreferrer">Government pricing guidance</a> · <a href="https://www.accc.gov.au/consumers/problem-with-a-product-or-service-you-bought/repair-notices" className={styles.underline} target="_blank" rel="noreferrer">ACCC repair notices</a> · <a href="https://business.gov.au/registrations/register-for-taxes/register-for-goods-and-services-tax-gst" className={styles.underline} target="_blank" rel="noreferrer">GST guide</a>.</p>
      <p>Safety and quality boundary: no real equipment is accessed. Legal notices, data consent, warranty/consumer guarantees and the customer's actual authorisation remain separate from completing this exercise.</p>
    </footer>
  </section>;
}
