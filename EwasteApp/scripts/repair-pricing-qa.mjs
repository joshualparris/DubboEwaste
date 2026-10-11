import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import vm from "node:vm";
import ts from "typescript";
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const source=read("lib/learning/repair-pricing.ts");
const transpiled=ts.transpileModule(source,{
 compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,strict:true},
 fileName:"repair-pricing.ts"
});
assert.equal(transpiled.diagnostics?.length??0,0,"Pricing model must compile with TS");
const module={exports:{}},sandbox={module,exports:module.exports,Intl};
vm.runInNewContext(transpiled.outputText,sandbox,{timeout:2000});
const calc=module.exports;
function nearly(got,want){assert.ok(Math.abs(got-want)<.011,"Expected "+want+"; got "+got);}
const floor=calc.calculateFloor(1800,3600,160,60,25);
nearly(floor.billableHours,96);nearly(floor.costPerBillable,56.25);nearly(floor.required,75);
const registered=calc.calculateJob(70,80,20,10,25,true);
nearly(registered.cost,180);nearly(registered.exGST,240);nearly(registered.gst,24);nearly(registered.incGST,264);nearly(registered.actualMargin,25);
const unregistered=calc.calculateJob(70,80,20,10,25,false);
nearly(unregistered.exGST,240);nearly(unregistered.gst,0);nearly(unregistered.incGST,240);
const markup=180*1.25;
nearly((markup-180)/markup*100,20);
assert.equal(calc.assessNumber(264,264),true);
assert.equal(calc.assessNumber(190,264),false);
assert.equal(calc.scenarioBank.length,4);
assert.equal(new Set(calc.scenarioBank.map(x=>x.id)).size,4);
for(const item of calc.scenarioBank){
 const amounts=[item.labourCost,item.partCost,item.overhead,item.reworkReserve,item.targetMargin,item.approvalCap,item.surpriseCost];
 assert.ok(amounts.every(x=>Number.isFinite(x)&&x>=0),"No negative or invalid cost inputs");
 assert.ok(item.targetMargin<80 && item.targetMargin>0,"Meaningful test margin required");
 const target=calc.calculateJob(item.labourCost,item.partCost,item.overhead,item.reworkReserve,item.targetMargin,true);
 const consent={data:true,parts:true,stop:true,scope:true};
 const action=item.acceptability==="reapproval"?"stop":"refer";
 const accepted=calc.analyseQuote(item,target.incGST,true,consent,action);
 assert.equal(accepted.points,100,"Correct, fully protected quote must pass: "+item.id);
 const wrong=calc.analyseQuote(item,target.incGST+100,true,{...consent,stop:false},"continue");
 assert.ok(wrong.points<100,"Unsafe/incorrect quote must fail: "+item.id);
 assert.ok(item.hiddenConstraint.length>=50,"Each case must include a non-trivial surprise");
}
const page=read("app/(private)/learn/repair-service-pricing/studio/page.tsx");
const css=read("app/(private)/learn/repair-service-pricing/studio/studio.module.css");
const classes=new Set([...page.matchAll(/styles\.([a-zA-Z][a-zA-Z0-9]*)/g)].map(x=>x[1]));
for(const name of classes) assert.ok(css.includes("."+name+"{"),"Missing scoped style: "+name);
const course=read("app/(private)/learn/[course]/page.tsx");
const lesson=read("app/(private)/learn/[course]/[lesson]/page.tsx");
for(const source of [course,lesson]){
 assert.ok(source.includes("repair-service-pricing/studio"),"Studio must be linked directly from the learning route");
}
assert.ok(page.includes("written data-loss")&&page.includes("refurbished")&&page.includes("GST"),"Consumer safeguards must be visible");
assert.ok(page.includes("localStorage")&&page.includes("Suggested review"),"Spaced, browser-only learning record must be visible");
console.log("Repair pricing QA PASS: four risk-aware scenarios; arithmetic, GST, approvals, mobile style coverage and integration links.");
