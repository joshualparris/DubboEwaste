/**
 * Financial literacy model for fictional Australian repair quotes.
 * All costs are expressed on a consistent recoverable-cost basis:
 * GST-registered: ex-creditable GST; unregistered: actual unrecoverable input cost.
 * Never add a loaded SELLING labour rate to overhead and profit again.
 */
export type PricingInputs={
  parts:number; labour:number; overhead:number; risk:number; marginPercent:number;
  gstRegistered:boolean; authorisedMaximum:number;
};
export const aud=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;
export function calculateQuote(input:PricingInputs){
  const vals=[input.parts,input.labour,input.overhead,input.risk,input.authorisedMaximum];
  if(vals.some(v=>!Number.isFinite(v)||v<0)||!Number.isFinite(input.marginPercent)||input.marginPercent<0||input.marginPercent>70)
    throw new Error("Enter non-negative finite costs and a margin between 0% and 70%.");
  const cost=aud(input.parts+input.labour+input.overhead+input.risk);
  const beforeGst=aud(cost/(1-input.marginPercent/100));
  const gst=input.gstRegistered?aud(beforeGst*0.1):0;
  const customerTotal=aud(beforeGst+gst);
  const contribution=aud(beforeGst-cost);
  return {cost,beforeGst,gst,customerTotal,contribution,
    withinCap:customerTotal<=aud(input.authorisedMaximum),
    actualMargin:beforeGst>0?aud(100*contribution/beforeGst):0};
}
export function breakEvenRate(monthlyOverhead:number,labourRemuneration:number,billableHours:number){
  if(!Number.isFinite(monthlyOverhead)||!Number.isFinite(labourRemuneration)||!Number.isFinite(billableHours)
    ||monthlyOverhead<0||labourRemuneration<0||billableHours<=0)throw new Error("Enter positive billable hours and non-negative expenses.");
  return aud((monthlyOverhead+labourRemuneration)/billableHours);
}
export const fictionalCases=[
  {id:"ssd",title:"SSD upgrade: fixed-scope job",level:"Foundation",description:"An owner authorises up to $275 for an SSD upgrade. A GST-registered repairer uses $80 delivered parts, $70 internal labour cost, $20 allocated overhead and $10 risk reserve. Target margin: 25%.",parts:80,labour:70,overhead:20,risk:10,marginPercent:25,gstRegistered:true,authorisedMaximum:275,action:"proceed",
    analysis:"$180 cost ÷ 0.75 = $240 ex GST, plus $24 GST = $264? Check the quote arithmetic rather than relying on a memorised example. Include file handling and repair-notice checks before accepting covered work."},
  {id:"diagnosis",title:"No-power repair: changing the approval cap",level:"Practitioner",description:"After diagnosing a no-power fault, a GST-registered repairer estimates $95 parts, $85 costed labour, $25 overhead and $15 rework risk. Required job margin 20%. The customer's existing total authorisation is $210.",parts:95,labour:85,overhead:25,risk:15,marginPercent:20,gstRegistered:true,authorisedMaximum:210,action:"stop",
    analysis:"Part price is not the revised total. The estimated customer price exceeds the approved maximum, so stop and seek approval for the complete revised scope. Do not waive statutory rights."},
  {id:"resale",title:"Marginal refurb: repair, replace or refer?",level:"Expert",description:"A GST-registered refurbisher estimates $85 parts, $90 internal labour, $15 other cost and $16 expected fault provision. Target margin 20%. The buyer's all-in ceiling is $250, and a verified suitable alternative is available at that price.",parts:85,labour:90,overhead:15,risk:16,marginPercent:20,gstRegistered:true,authorisedMaximum:250,action:"stop",
    analysis:"Expected cost includes $16 = 20% chance × $80. Quote all known costs, compare the $250 alternative and do not promise a repair or resale margin that is unsupported by observed reliability."}
] as const;
export function markPricingCase(
  id:string, answers:{cost:number;beforeGst:number;customerTotal:number;decision:"proceed"|"stop"}
){
  const sample=fictionalCases.find(x=>x.id===id);
  if(!sample)return null;
  const result=calculateQuote(sample);
  const close=(a:number,b:number)=>Number.isFinite(a)&&Math.abs(a-b)<=0.02;
  const correctness={
    cost:close(answers.cost,result.cost),
    beforeGst:close(answers.beforeGst,result.beforeGst),
    customerTotal:close(answers.customerTotal,result.customerTotal),
    decision:answers.decision===(result.withinCap?"proceed":"stop")
  };
  return {result,correctness,score:Object.values(correctness).filter(Boolean).length};
}
