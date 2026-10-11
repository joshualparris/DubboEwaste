/** Pure, repeatable repair-pricing calculations (fictional AUD ex-GST inputs).
 * Do not use as financial or tax advice. Charges must be consistent and may
 * differ with a particular business's GST credit and overhead treatment.
 */
export type RepairScenario = {
  id:string; title:string; severity:"Foundation"|"Practitioner"|"Expert";
  device:string; ownerNeed:string; known:string; uncertainty:string;
  labourCost:number; partCost:number; overhead:number; reworkReserve:number;
  targetMargin:number; approvalCap:number; surpriseCost:number;
  diagnosticOnly:boolean; expectedReplacement:number;
  acceptability:"repair"|"refer"|"reapproval";
  prompt:string; hiddenConstraint:string;
};
export const scenarioBank:RepairScenario[] = [
  {id:"ssd",title:"SSD upgrade and data risk",severity:"Foundation",device:"2017 laptop, slow original hard drive",
   ownerNeed:"Owner wants a faster machine while keeping important family photos.",
   known:"Compatible drive is available and the laptop passes memory and power checks.",
   uncertainty:"Old HDD shows weak health; copying may fail and is not a verified backup.",
   labourCost:70,partCost:80,overhead:20,reworkReserve:10,targetMargin:25,
   approvalCap:270,surpriseCost:75,diagnosticOnly:false,expectedReplacement:350,acceptability:"reapproval",
   prompt:"Cost the defined SSD install and testing. Explain what is excluded if the source disk fails.",
   hiddenConstraint:"A $75 recovery service becomes necessary. It was not part of the signed scope."},
  {id:"fan",title:"Noisy refurbished laptop",severity:"Practitioner",device:"2018 business laptop, intermittent high fan noise",
   ownerNeed:"Owner needs a reliable school laptop for at least one year.",
   known:"Fan is grinding and replaceable. CPU runs hot after dust removal.",
   uncertainty:"Battery health is untested, and a further board fault could change value.",
   labourCost:65,partCost:35,overhead:18,reworkReserve:12,targetMargin:20,
   approvalCap:190,surpriseCost:45,diagnosticOnly:false,expectedReplacement:240,acceptability:"reapproval",
   prompt:"Prepare a fixed-scope fan replacement quote and a documented extra-work threshold.",
   hiddenConstraint:"Battery testing reveals a further $45 replacement part; no approval for it yet."},
  {id:"no-power",title:"No-power diagnosis with unknown cause",severity:"Expert",device:"2020 laptop, no power LED, history of liquid spill",
   ownerNeed:"Owner primarily wants to know if repair is economically sensible.",
   known:"External power adapter rating can be checked safely; no board diagnosis yet.",
   uncertainty:"Could involve battery, DC input or board damage; no promise of repair is justified.",
   labourCost:55,partCost:0,overhead:20,reworkReserve:15,targetMargin:25,
   approvalCap:125,surpriseCost:120,diagnosticOnly:true,expectedReplacement:260,acceptability:"refer",
   prompt:"Quote diagnosis only with a maximum charge and an explicit no-repair outcome.",
   hiddenConstraint:"Testing indicates a likely board repair beyond your current skills, estimated another $120."},
  {id:"hinge",title:"Damaged hinge and uncertain display cable",severity:"Expert",device:"2019 laptop, cracked hinge mounts, display sometimes flickers",
   ownerNeed:"Owner wants it usable for travel but has a limited budget.",
   known:"Replacement hinge/chassis parts can be sourced; display cable condition unknown.",
   uncertainty:"Panel damage may emerge when opened, and hinge work may not restore durability.",
   labourCost:95,partCost:65,overhead:25,reworkReserve:20,targetMargin:30,
   approvalCap:310,surpriseCost:95,diagnosticOnly:false,expectedReplacement:290,acceptability:"refer",
   prompt:"Determine whether repair beats replacement, taking failure risk and authorisation into account.",
   hiddenConstraint:"A damaged display cable adds $95; combined repair would exceed a similar refurbished laptop."}
];
export function cents(value:number){return Math.round((Number.isFinite(value)?value:0)*100+Number.EPSILON);}
export function dollars(c:number){return c/100;}
export function money(n:number){return new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD",minimumFractionDigits:2,maximumFractionDigits:2}).format(Number.isFinite(n)?n:0);}
export function calculateFloor(overhead:number,labour:number,paidHours:number,utilisationPercent:number,marginPercent:number){
  const billableHours=paidHours*Math.max(0,Math.min(100,utilisationPercent))/100;
  const base=overhead+labour;
  const costPerBillable= billableHours>0?base/billableHours:NaN;
  const required=marginPercent>=0&&marginPercent<100?costPerBillable/(1-marginPercent/100):NaN;
  return {billableHours,costPerBillable,required};
}
export function calculateJob(labour:number,parts:number,overhead:number,provision:number,marginPercent:number,gstRegistered:boolean){
  const costCents=[labour,parts,overhead,provision].reduce((sum,n)=>sum+cents(Math.max(0,n)),0);
  const cost=dollars(costCents);
  const exGST=marginPercent>=0&&marginPercent<100?dollars(cents(cost/(1-marginPercent/100))):NaN;
  // consumer-facing single total. Examples treat costs as net business costs for conceptual training.
  const gst=gstRegistered?dollars(cents(exGST*.10)):0;
  const incGST=dollars(cents(exGST+gst));
  const actualMargin=exGST>0?(exGST-cost)/exGST*100:0;
  return {cost,exGST,gst,incGST,actualMargin};
}
export function assessNumber(actual:number,expected:number,variance=0.01){
 return Number.isFinite(actual) && Number.isFinite(expected) && Math.abs(actual-expected) <=Math.max(.03,Math.abs(expected)*variance);
}
export type BudgetJudgement = "within" | "over";
export function analyseQuote(s:RepairScenario,entered:number,gstRegistered:boolean,consent:{data:boolean;parts:boolean;stop:boolean;scope:boolean},decision:"stop"|"continue"|"refer",budgetJudgement:BudgetJudgement|null){
 const numbers=calculateJob(s.labourCost,s.partCost,s.overhead,s.reworkReserve,s.targetMargin,gstRegistered);
 const priceCorrect=assessNumber(entered,numbers.incGST);
 const missing=([
    [consent.data,"Written data-loss repair notice"],
    [consent.parts,"Refurbished-parts notice / confirmation (when applicable)"],
    [consent.stop,"Stop-work on new costs before obtaining authorisation"],
    [consent.scope,"Clearly scoped inclusions, exclusions and a maximum charge"]
 ] as const).filter(([ok])=>!ok).map(([,name])=>name);
 const correctAction = s.acceptability==="reapproval"?"stop":"refer";
 const actionCorrect=decision===correctAction;
 // Compare the GST-inclusive total (or ex-GST if unregistered) against the actual
 // customer approval cap. Incorrectly assuming a quote is authorised loses credit
 // even when the selling-price arithmetic is correct.
 const capExceeded=numbers.incGST>s.approvalCap+0.005;
 const correctBudgetJudgement:BudgetJudgement=capExceeded?"over":"within";
 const budgetCorrect=budgetJudgement===correctBudgetJudgement;
 const points=(priceCorrect?30:0)+((4-missing.length)*10)+(actionCorrect?20:0)+(budgetCorrect?10:0);
 return {numbers,points,priceCorrect,missing,actionCorrect,correctAction,capExceeded,budgetCorrect,correctBudgetJudgement};
}
