"use client";
import {useEffect,useState} from "react";
type QuoteCase={name:string;detail:string;parts:number;hours:number;rate:number;overhead:number;risk:number;margin:number;cap:number;question:string;choices:[string,string,string];correct:number;why:string};
const cases:QuoteCase[]=[
{name:"SSD replacement, customer data and reused donor parts",detail:"Fictional HP laptop: an unverified donor SSD is available, while the customer's old HDD holds their only Windows files. The part cost below is a hypothetical testing/parts allowance, not a price for a real donor.",parts:55,hours:1.5,rate:42,overhead:16,risk:12,margin:25,cap:210,question:"What is the responsible next step before taking the laptop for repair?",choices:["Install donor SSD then explain the data risk when returning it.","Test donor, plan old-HDD preservation and provide written notices.","Copy the unrelated donor laptop's Windows installation instead."],correct:1,why:"A donor's image cannot preserve another person's files. Test capacity and SSD health, retain the original HDD and give the relevant ACL data-loss and refurbished-parts written notices before accepting the device for repair."},
{name:"Tea-damaged Lenovo with diagnostic-only approval",detail:"Fictional laptop stopped powering on after a spill. The customer has approved a $100 diagnostic cap, but a later diagnosis indicates a $95 extra component may be necessary.",parts:0,hours:1.2,rate:42,overhead:12,risk:10,margin:20,cap:100,question:"The extra part exceeds the approved scope. What do you do?",choices:["Fit the replacement to avoid charging a second diagnostic.","Keep energising the laptop to reproduce the failure reliably.","Stop, prepare alternatives and request new written authorisation."],correct:2,why:"Do not repeatedly power an exposed liquid-damaged board. The $100 cap is not permission to fit an additional $95 part; stop, explain risk and provide no-repair or referral options."},
{name:"Four-device refurbishment fleet",detail:"Four fictional laptops: two likely storage faults, one organisational management lock, one swollen lithium battery. Buyer requests a discounted all-devices-working promise.",parts:210,hours:4.5,rate:42,overhead:65,risk:38,margin:22,cap:0,question:"Which quote avoids an unsafe unconditional guarantee?",choices:["Quote per eligible device, explicitly excluding locked and unsafe units.","Promise every laptop will boot because the batch has a discount.","Use management-bypass software and treat battery risk as routine."],correct:0,why:"A discounted bundle is not authorisation to bypass locks, handle a hazardous swollen battery or guarantee unknown repairs. Specify per-unit limits, test evidence and referral."},
{name:"Unseen transfer: budget exceeds actual cost",detail:"A fictional customer requires a repair with a potentially refurbished part. Their TOTAL spend cap is $300 and they insist that photos cannot be lost. Internal costs must still be recovered.",parts:87,hours:2.25,rate:48,overhead:19,risk:17,margin:28,cap:300,question:"How should you respond to the unrealistic total cap?",choices:["Promise safe data retention and discount the invoice without checking.","Explain costs, risks and written notices; rescope or refer safely.","Fit an undocumented reused donor part without telling the owner."],correct:1,why:"The minimum costed selling price at 28% margin exceeds $300 even before GST. Explain the discrepancy, offer a revised scope or referral and never guarantee zero data risk."}
];
type Done={id:number;attempts:number;first:boolean};
const STORE="assetflow-pricing-practice-v1";
const money=(x:number)=>"$"+x.toFixed(2);
export const pricingTotals=(c:QuoteCase)=>{const cost=c.parts+c.hours*c.rate+c.overhead+c.risk;return {cost,ex:cost/(1-c.margin/100),inc:cost/(1-c.margin/100)*1.1};};
export default function RepairPricingStudio(){
 const [i,setI]=useState(0),[num,setNum]=useState(""),[selected,setSelected]=useState(-1),
 [words,setWords]=useState(""),[notice,setNotice]=useState(false),[gst,setGst]=useState(false),
 [trials,setTrials]=useState(0),[feedback,setFeedback]=useState<string[]>([]),[shown,setShown]=useState(false),
 [done,setDone]=useState<Done[]>([]);
 useEffect(()=>{try{const v=JSON.parse(localStorage.getItem(STORE)||"[]");if(Array.isArray(v))setDone(v);}catch{}},[]);
 const c=cases[i],t=pricingTotals(c),completed=done.some(x=>x.id===i),all=done.length===cases.length;
 function select(j:number){setI(j);setNum("");setSelected(-1);setWords("");setNotice(false);setGst(false);setTrials(0);setFeedback([]);setShown(false);}
 function check(){
  const wrong:string[]=[];
  if(!num.trim()||!Number.isFinite(Number(num))||Math.abs(Number(num)-t.ex)>.025)wrong.push("Pricing: add parts, active labour, overhead and risk, then divide by 1 minus the gross-margin fraction.");
  if(selected!==c.correct)wrong.push("Decision: reconsider the limits of consent, safety, data handling and authorisation.");
  if(words.trim().split(/\s+/).filter(Boolean).length<35)wrong.push("Customer communication: write at least 35 words on price, scope, risks, approvals and the stopping condition.");
  if(!notice)wrong.push("Written notices: acknowledge the applicable data-loss/refurbished-parts notice timing before accepting the repair.");
  const count=trials+1;setTrials(count);setFeedback(wrong);setShown(true);
  if(!wrong.length&&!completed){const next=[...done,{id:i,attempts:count,first:count===1}];setDone(next);try{localStorage.setItem(STORE,JSON.stringify(next));}catch{}}
 }
 function exportNotes(){
  const lines=["# Fictional Australian computer repair quote portfolio","Training only. Not a rate card, real client authority or observed qualification.","Exercises passed: "+done.length+"/4.",""];
  cases.forEach(c=>{const n=pricingTotals(c);lines.push("## "+c.name,c.detail,
  "Internal cost: "+money(n.cost),"Ex-GST quote at "+c.margin+"% gross margin: "+money(n.ex),
  "If GST registered, illustrative inclusive total: "+money(n.inc),"Scope, risks and legal notice: "+c.why,"");});
  const u=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/markdown"}));
  const a=document.createElement("a");a.href=u;a.download="repair-pricing-training-portfolio.md";a.click();window.setTimeout(()=>URL.revokeObjectURL(u),900);
 }
 return <section id="pricing-studio" aria-labelledby="pricing-studio-heading" style={{background:"#14263c",color:"#f2f7ff",borderRadius:16,border:"1px solid #577898",padding:"clamp(16px,3vw,28px)",margin:"24px 0"}}>
 <p style={{fontSize:13,color:"#acd8ff",fontWeight:750}}>APPLIED MASTERY LAB · FICTIONAL CASES</p>
 <h2 id="pricing-studio-heading">Repair Quote Studio: calculate, decide, explain</h2>
 <p>Four decisions, increasing in difficulty. Show your calculation, choose the safe next step, and explain an actual scope/cap to a fictional client. Data is local to this browser and contains no client identity.</p>
 <div role="group" aria-label="Practice case" style={{display:"flex",gap:8,flexWrap:"wrap",margin:"16px 0"}}>
 {cases.map((x,j)=><button key={x.name} type="button" aria-pressed={j===i} onClick={()=>select(j)} style={{padding:"10px 14px",borderRadius:9,color:"#fff",background:i===j?"#426e99":"#253d5a",border:"1px solid #8ba9c3"}}>{done.some(d=>d.id===j)?"✓ ":""}{j===3?"Transfer case":"Case "+(j+1)}</button>)}</div>
 <p><strong>{c.name}</strong> · {done.length}/4 calculated and reasoned · {done.filter(x=>x.first).length} first-attempt passes</p>
 <p>{c.detail}</p>
 <h3>1. Calculate the quote</h3>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8}}>
 {([["Parts",money(c.parts)],["Labour cost",c.hours+" h × "+money(c.rate)],["Overhead",money(c.overhead)],["Rework reserve",money(c.risk)],["Target margin",c.margin+"%"],["Authorisation cap",c.cap?money(c.cap):"Not approved"]] as [string,string][]).map(([label,value])=><div key={label} style={{background:"#233c57",borderRadius:10,padding:11}}><span style={{fontSize:13}}>{label}</span><div><strong>{value}</strong></div></div>)}
 </div>
 <div role="img" aria-label="Pricing flow diagram" style={{margin:"12px 0",padding:13,border:"1px solid #7ea0c0",borderRadius:10}}>
 Parts + active labour + overhead + rework → internal cost → divide by (1 − target gross margin) → ex-GST price
 </div>
 <label htmlFor="pricing-number">Your ex-GST quote in AUD (calculate, don't guess)</label>
 <input id="pricing-number" type="number" step=".01" min="0" value={num} onChange={e=>setNum(e.target.value)} style={{display:"block",background:"white",color:"#15243b",padding:11,borderRadius:8,margin:"9px 0",maxWidth:"100%",width:310}}/>
 <label style={{display:"flex",gap:8,margin:"10px 0"}}><input type="checkbox" checked={gst} onChange={e=>setGst(e.target.checked)}/> Compare registered-for-GST total after checking</label>
 <h3>2. Decide what to do</h3><p>{c.question}</p>
 <fieldset style={{border:0,padding:0,display:"grid",gap:8}}><legend style={{position:"absolute",width:1,height:1,overflow:"hidden"}}>Next action</legend>
 {c.choices.map((x,j)=><label key={x} style={{display:"flex",gap:10,padding:12,background:"#233c57",borderRadius:9}}><input type="radio" name={"pricing-choice-"+i} checked={selected===j} onChange={()=>setSelected(j)}/>{x}</label>)}</fieldset>
 <h3>3. Explain the risk and gain informed approval</h3>
 <p>Write at least 35 words with quote, scope, client cap, uncertainty and when you'd stop to seek approval. Never include a real customer's details.</p>
 <textarea rows={5} aria-label="Fictional customer quote explanation" value={words} onChange={e=>setWords(e.target.value)} style={{width:"100%",padding:12,borderRadius:9,background:"#fff",color:"#142236"}}/>
 <label style={{display:"flex",gap:8,margin:"12px 0"}}><input type="checkbox" checked={notice} onChange={e=>setNotice(e.target.checked)}/> I checked whether written repair notices are required BEFORE accepting this device for repair.</label>
 <div style={{display:"flex",gap:10,flexWrap:"wrap",margin:"17px 0"}}>
 <button type="button" onClick={check} style={{padding:"11px 15px",borderRadius:9,background:"#afd9ff",color:"#11233a",fontWeight:750}}>Check my work</button>
 <button type="button" onClick={()=>setShown(v=>!v)} style={{padding:"11px 15px",borderRadius:9,border:"1px solid #89add2",background:"transparent",color:"#fff"}}>{shown?"Hide":"Show"} worked solution</button>
 </div>
 {trials>0&&<div role="status" aria-live="polite" style={{background:"#233c57",borderLeft:"4px solid "+(feedback.length?"#eabb74":"#6ce3af"),borderRadius:9,padding:13}}>
 <strong>{feedback.length?"Not yet: revise then retry.":"All four practice checkpoints met."}</strong>
 {feedback.map(x=><p key={x}>{x}</p>)}
 {trials>=2&&feedback.length>0&&<p><strong>Adaptive foundation hint:</strong> use cost ÷ (1 − margin), not cost × (1 + margin). A repair cap never permits unapproved parts or unsafe power-on tests.</p>}
 <p style={{fontSize:13}}>Word count is not proof your message is legally or commercially adequate. Compare it against the rubric, then seek supervisor feedback.</p>
 {!feedback.length&&i<3&&<button type="button" onClick={()=>select(i+1)}>Next harder case →</button>}
 </div>}
 {shown&&<div style={{margin:"13px 0",padding:14,border:"1px solid #779cba",borderRadius:9,background:"#0f1d30"}}>
 <h3>Worked reasoning and comparator</h3>
 <p>Cost = {money(c.parts)} + {c.hours} × {money(c.rate)} + {money(c.overhead)} + {money(c.risk)} = <strong>{money(t.cost)}</strong>.</p>
 <p>Ex-GST = {money(t.cost)} ÷ {(1-c.margin/100).toFixed(2)} = <strong>{money(t.ex)}</strong>.</p>
 {gst&&<p>If registered for GST, the illustrative consumer total is <strong>{money(t.inc)}</strong>. An unregistered business must not add GST.</p>}
 <p>{c.why}</p>
 {c.cap>0&&t.ex>c.cap&&<p><strong>Conflict:</strong> the ex-GST estimate already exceeds the customer's cap. Stop, rescope or refer.</p>}
 <p><strong>Self-review rubric:</strong> mathematically correct cost/price, realistic scope and exclusions, applicable written notices, clear consent, stop-work threshold and repair-versus-refer options.</p>
 </div>}
 <h3>Review and evidence</h3><p>{all?"Four technical practice checks passed. Review these in 1, 3 and 7 days with changed numbers and a supervisor-observed case.":"Complete all four cases, including the unseen transfer case. Revisit on days 1, 3 and 7 using new figures."}</p>
 <p style={{fontSize:13}}>This is self-study, not a competency certificate or legally approved client quotation. Only synthetic attempt counts are saved locally.</p>
 <button type="button" onClick={exportNotes} style={{padding:11,borderRadius:9,color:"#fff",border:"1px solid #8ab4dc",background:"transparent"}}>Download fictional worked-case portfolio (.md)</button>
 </section>;
}
