import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root=process.cwd();
const source=fs.readFileSync(path.join(root,"lib/learning/pricing-model.ts"),"utf8");
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const module={exports:{}};
vm.runInNewContext(compiled,{module,exports:module.exports,Math,Number,Error});
const {calculateQuote,breakEvenRate,fictionalCases,markPricingCase}=module.exports;
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<0.005,`Expected ${expected}, got ${actual}`);
close(breakEvenRate(600,2400,40),75);
assert.throws(()=>breakEvenRate(600,2400,0),/billable hours/);

const standard=calculateQuote({parts:80,labour:70,overhead:20,risk:10,marginPercent:25,gstRegistered:true,authorisedMaximum:275});
close(standard.cost,180);
close(standard.beforeGst,240);
close(standard.gst,24);
close(standard.customerTotal,264);
close(standard.contribution,60);
assert.equal(standard.withinCap,true);
close(standard.actualMargin,25);
const unregistered=calculateQuote({parts:80,labour:70,overhead:20,risk:10,marginPercent:25,gstRegistered:false,authorisedMaximum:275});
close(unregistered.gst,0);
close(unregistered.customerTotal,240);
const capped=calculateQuote({parts:95,labour:85,overhead:25,risk:15,marginPercent:20,gstRegistered:true,authorisedMaximum:210});
close(capped.cost,220);
close(capped.beforeGst,275);
close(capped.customerTotal,302.5);
assert.equal(capped.withinCap,false);
const uncertain=calculateQuote({parts:85,labour:90,overhead:15,risk:16,marginPercent:20,gstRegistered:true,authorisedMaximum:250});
close(uncertain.cost,206);
close(uncertain.beforeGst,257.5);
close(uncertain.customerTotal,283.25);
assert.equal(uncertain.withinCap,false);
assert.throws(()=>calculateQuote({...fictionalCases[0],marginPercent:95}),/margin/);

assert.equal(fictionalCases.length,3);
assert.equal(new Set(fictionalCases.map(x=>x.id)).size,3);
for(const sample of fictionalCases){
 const result=calculateQuote(sample);
 const graded=markPricingCase(sample.id,{cost:result.cost,beforeGst:result.beforeGst,customerTotal:result.customerTotal,decision:result.withinCap?"proceed":"stop"});
 assert.equal(graded.score,4,`Correct numerical work and approval decision failed for ${sample.id}`);
 const gamed=markPricingCase(sample.id,{cost:result.customerTotal,beforeGst:result.cost,customerTotal:result.beforeGst,decision:result.withinCap?"stop":"proceed"});
 assert.ok(gamed.score<4,`Incorrect work shouldn't receive full credit: ${sample.id}`);
}
const coursePage=fs.readFileSync(path.join(root,"app/(private)/learn/[course]/page.tsx"),"utf8");
assert.ok(coursePage.includes('id==="repair-service-pricing" ? <RepairPricingStudio />'),"Pricing studio must be enrolled-course-gated");
const app=fs.readFileSync(path.join(root,"components/RepairPricingStudio.tsx"),"utf8");
assert.ok(app.includes("markPricingCase")&&app.includes("customerTotal")&&app.includes("navigator.clipboard"));
assert.ok(app.includes("This is")||app.includes("not an observed competency sign-off"));
console.log("Repair-pricing mastery QA PASS: break-even, GST, margins, stop-work ceilings, 3 graded cases and enrolled UI integration.");
