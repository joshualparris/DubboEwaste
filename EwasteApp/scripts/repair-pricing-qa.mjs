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
const liquidCase=calc.scenarioBank.find(x=>x.id==="no-power");
assert.ok(liquidCase);
const withGST=calc.calculateJob(liquidCase.labourCost,liquidCase.partCost,liquidCase.overhead,liquidCase.reworkReserve,liquidCase.targetMargin,true);
const withoutGST=calc.calculateJob(liquidCase.labourCost,liquidCase.partCost,liquidCase.overhead,liquidCase.reworkReserve,liquidCase.targetMargin,false);
assert.ok(withGST.incGST>liquidCase.approvalCap && withoutGST.incGST<liquidCase.approvalCap,
 "No-power case must test changing cap status depending on GST registration");
const protections={data:true,parts:true,stop:true,scope:true};
assert.equal(calc.analyseQuote(liquidCase,withGST.incGST,true,protections,"refer","over").points,100);
assert.equal(calc.analyseQuote(liquidCase,withoutGST.incGST,false,protections,"refer","within").points,100);
assert.equal(calc.scenarioBank.length,4);
assert.equal(new Set(calc.scenarioBank.map(x=>x.id)).size,4);
for(const item of calc.scenarioBank){
 const amounts=[item.labourCost,item.partCost,item.overhead,item.reworkReserve,item.targetMargin,item.approvalCap,item.surpriseCost];
 assert.ok(amounts.every(x=>Number.isFinite(x)&&x>=0),"No negative or invalid cost inputs");
 assert.ok(item.targetMargin<80 && item.targetMargin>0,"Meaningful test margin required");
 const target=calc.calculateJob(item.labourCost,item.partCost,item.overhead,item.reworkReserve,item.targetMargin,true);
 const consent={data:true,parts:true,stop:true,scope:true};
 const action=item.acceptability==="reapproval"?"stop":"refer";
 const budget=target.incGST>item.approvalCap?"over":"within";
 const accepted=calc.analyseQuote(item,target.incGST,true,consent,action,budget);
 assert.equal(accepted.budgetCorrect,true,"Learner must identify approval-cap status: "+item.id);
 const wrongBudget=calc.analyseQuote(item,target.incGST,true,consent,action,budget==="over"?"within":"over");
 assert.ok(wrongBudget.points<100,"Incorrect approval-cap judgement must block full marks: "+item.id);
 assert.equal(wrongBudget.budgetCorrect,false);
 const unansweredBudget=calc.analyseQuote(item,target.incGST,true,consent,action,null);
 assert.ok(unansweredBudget.points<100,"Unanswered budget status must block full marks: "+item.id);
 assert.equal(accepted.points,100,"Correct, fully protected quote must pass: "+item.id);
 const wrong=calc.analyseQuote(item,target.incGST+100,true,{...consent,stop:false},"continue",budget);
 assert.ok(wrong.points<100,"Unsafe/incorrect quote must fail: "+item.id);
 assert.ok(item.hiddenConstraint.length>=50,"Each case must include a non-trivial surprise");
}
const page=read("app/(private)/learn/repair-service-pricing/studio/page.tsx");
assert.ok(page.includes('name={"pricing-budget-"+which}') && page.includes("result.budgetCorrect"),
 "Practical studio must independently ask and explain customer authorisation cap");
const css=read("app/(private)/learn/repair-service-pricing/studio/studio.module.css");
const classes=new Set([...page.matchAll(/styles\.([a-zA-Z][a-zA-Z0-9]*)/g)].map(x=>x[1]));
for(const name of classes) assert.ok(new RegExp("\\."+name+"(?=\\s*[,\\{])").test(css),"Missing scoped style: "+name);
const course=read("app/(private)/learn/[course]/page.tsx");
const lesson=read("app/(private)/learn/[course]/[lesson]/page.tsx");
for(const source of [course,lesson]){
 assert.ok(source.includes("repair-service-pricing/studio"),"Studio must be linked directly from the learning route");
}
assert.ok(page.includes("written data-loss")&&page.includes("refurbished")&&page.includes("GST"),"Consumer safeguards must be visible");
assert.ok(page.includes("localStorage")&&page.includes("Suggested review"),"Spaced, browser-only learning record must be visible");
assert.ok(page.includes("exportEvidence")&&page.includes("new Blob")&&page.includes("last "),"Learners must be able to export honest dated evidence");
assert.ok(page.includes("latest ")&&page.includes("best:"),"Latest score must be differentiated from best score");
assert.ok(page.includes("real written notice must still be delivered"),"Simulation must not misrepresent repair notices as delivered");

/** Quality gate: six real provider URLs, with prompts that turn passive media
 * consumption into pricing transfer. These are links, not uploaded copies.
 */
const studioAst=ts.createSourceFile("pricing-studio.tsx",page,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let featured=null;
function inspectMedia(node){
 if(ts.isVariableDeclaration(node)&&node.name.getText(studioAst)==="featuredMedia"){
   const expr=ts.isAsExpression(node.initializer)?node.initializer.expression:node.initializer;
   assert.ok(ts.isArrayLiteralExpression(expr),"Featured media must be a literal auditable catalogue");
   featured=expr.elements.map(item=>{
     assert.ok(ts.isObjectLiteralExpression(item),"Media record must be static");
     return Object.fromEntries(item.properties.map(p=>{
       assert.ok(ts.isPropertyAssignment(p)&&ts.isStringLiteral(p.initializer),
         "Media metadata must be fixed strings");
       return [p.name.getText(studioAst),p.initializer.text];
     }));
   });
 }
 ts.forEachChild(node,inspectMedia);
}
inspectMedia(studioAst);
assert.ok(featured,"Pricing studio must have a featured media library");
assert.equal(featured.length,6,"Six curated study resources (4 video, 2 podcasts) required");
assert.equal(featured.filter(x=>x.type==="video").length,4);
assert.equal(featured.filter(x=>x.type==="podcast").length,2);
assert.equal(new Set(featured.map(x=>x.id)).size,6,"Duplicate media record");
assert.equal(new Set(featured.map(x=>x.url)).size,6,"Duplicate media link");
const allowedHosts=new Set(["www.youtube.com","www.classcentral.com","music.amazon.com.au","podnutz.com"]);
for(const item of featured){
 const url=new URL(item.url);
 assert.equal(url.protocol,"https:","Media needs HTTPS");
 assert.ok(allowedHosts.has(url.hostname),"Media must link to checked provider content");
 assert.ok(!/\/(search|results)\b|[?&](q|query|search)=/i.test(item.url),"Do not substitute search queries for actual video/podcast pages");
 assert.ok(item.task.length>=70&&item.description.length>=65&&item.caveat.length>=65,
   "Every linked media item must explain application and source limitations");
 assert.ok(item.stage.startsWith("0")&&item.provider.length>5,
   "Each media resource must map to one stage and name its provider");
}
assert.ok(page.includes('id="pricing-media"')&&page.includes("featuredMedia.map")&&
 page.includes('rel="noopener noreferrer"')&&page.includes('href="#pricing-media"'),
 "Media library must have direct accessible links from the studio hero");
console.log("Repair pricing media QA PASS: 4 videos, 2 podcasts, real HTTPS provider links and applied tasks.");

console.log("Repair pricing QA PASS: four risk-aware scenarios; arithmetic, GST, approvals, mobile style coverage and integration links.");
