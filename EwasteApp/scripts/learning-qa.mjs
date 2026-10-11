import fs from "node:fs";
import assert from "node:assert/strict";
import path from "node:path";
import ts from "typescript";
const root=process.cwd();
const load=p=>fs.readFileSync(path.join(root,p),"utf8");
const readTS=p=>ts.createSourceFile(p,load(p),ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
const catalogue=readTS("lib/learning/catalog.ts");
const media=readTS("lib/learning/media.ts");
const calls=[];
function visit(node){
 if(ts.isCallExpression(node)&&node.expression.getText(catalogue)==="course"){
  const a=node.arguments;
  if(a.length===12&&ts.isStringLiteral(a[0])&&ts.isStringLiteral(a[1])){
   calls.push({id:a[0].text,programme:a[1].text,lessons:ts.isArrayLiteralExpression(a[7])?a[7].elements.length:0});
  }
 }
 ts.forEachChild(node,visit);
}
visit(catalogue);
assert.ok(calls.length>=28,"Expected the full LMS course catalogue");
assert.equal(new Set(calls.map(c=>c.id)).size,calls.length,"Duplicate course ID");
assert.ok(calls.every(c=>c.lessons===3),"Every starter course needs three lessons");
assert.ok(calls.every(c=>["all","dubbo_ewaste","repair_cafe","library_of_things"].includes(c.programme)),"Unknown programme");
const contents=load("lib/learning/media.ts");
const entries=[...contents.matchAll(/\{id:"([^"]+)",course:"([^"]+)",type:"([^"]+)"/g)]
 .map((m)=>({id:m[1],course:m[2],type:m[3]}));
assert.ok(entries.length>=12,"Expected the curated media library");
assert.equal(new Set(entries.map(x=>x.id)).size,entries.length,"Duplicate media ID");
assert.ok(entries.every(x=>calls.some(c=>c.id===x.course)),"Media linked to a missing course");
assert.ok(entries.every(x=>["video","podcast","guide"].includes(x.type)),"Unknown media type");
const urls=[...contents.matchAll(/url:"([^"]+)"/g)].map(x=>x[1]);
assert.equal(urls.length,entries.length,"Each media item needs a direct provider URL");
assert.ok(urls.every(url=>new URL(url).protocol==="https:"),"Media must use HTTPS");
const programmeGate=load("lib/programmes.ts");
assert.ok(programmeGate.includes('"circular-access"'),"Shared research route must be allowed in all programmes");
for(const p of ["app/(private)/learn/manage/page.tsx","app/(private)/learn/learning-activities.ts","app/circular-access/page.tsx"]){
 assert.ok(fs.existsSync(path.join(root,p)),"Missing required route: "+p);
}
console.log("Learning QA PASS: "+calls.length+" courses, "+calls.reduce((n,c)=>n+c.lessons,0)+" lessons, "+entries.length+" media items, research route guarded.");

const challengeSource=load("lib/learning/challenges.ts");
assert.ok(challengeSource.includes("const caseBank = "),"Adaptive challenge bank must be statically auditable");
const caseBank=JSON.parse(challengeSource.split("const caseBank = ")[1].split(" as const;")[0]);
assert.equal(caseBank.length,calls.length,"Every course needs a matched adaptive challenge set");
assert.ok(caseBank.every(item=>calls.some(c=>c.id===item.slug)),"No challenge may point to an unknown course");
const assessed=caseBank.flatMap(item=>[item.practitioner,item.expert]);
assert.equal(assessed.length,calls.length*2);
const largest=assessed.filter(q=>q.options[q.answer].length===Math.max(...q.options.map(o=>o.length))).length;
const smallest=assessed.filter(q=>q.options[q.answer].length===Math.min(...q.options.map(o=>o.length))).length;
for (const q of assessed){
  assert.equal(q.options.length,3,"Questions need three answer choices");
  assert.ok(Number.isInteger(q.answer) && q.answer>=0 && q.answer<q.options.length,"Invalid correct answer index");
  assert.equal(new Set(q.options).size,q.options.length,"Answer choices must be distinct");
  const lengths=q.options.map(o=>o.length);
  assert.ok(Math.min(...lengths)>15,"Avoid absurdly terse alternative answers");
  assert.ok(Math.max(...lengths)/Math.min(...lengths)<1.3,"Answer-length cue found in: "+q.question);
}
assert.ok(largest/assessed.length<=0.45,"Picking the longest answer must not dominate");
assert.ok(smallest/assessed.length<=0.45,"Picking the shortest answer must not dominate");
console.log("Answer-bias QA PASS: "+assessed.length+" adaptive questions; longest "+largest+", shortest "+smallest+".");


const deepContent=load("lib/learning/deep-pathways.ts");
const matchDeep=deepContent.match(/export const deepPathways: DeepPathway\[\] = (\[[\s\S]*?\]);\nexport function deepPathwayFor/);
assert.ok(matchDeep,"Deep learning pathway JSON must be statically parseable");
const deeper=JSON.parse(matchDeep[1]);
assert.equal(deeper.length,15,"Electronics and repair field school must benchmark all fifteen courses");
assert.equal(new Set(deeper.map(p=>p.slug)).size,deeper.length,"Duplicate advanced pathway");
for(const item of deeper) {
 assert.ok(calls.some(c=>c.id===item.slug),"Missing parent course: "+item.slug);
 assert.ok(item.benchmark.length>=80 && item.target.length>=70,"Depth comparison not specific enough for "+item.slug);
 assert.ok(item.resources.length>=2,"Every field course needs at least two external sources");
 assert.equal(item.cases.length,3,"Each of three lessons needs a course-specific applied exercise");
 for(const r of item.resources){
  const u=new URL(r.url);
  assert.equal(u.protocol,"https:","External resource must be HTTPS");
  assert.ok(!/search=|\/results\?/i.test(r.url),"Do not use broad search links in place of real courses");
  assert.ok(r.title.length>=10&&r.why.length>=40,"Resource must describe its educational value");
 }
 for(const q of item.cases){
  assert.ok(q.prompt.length>=80&&q.workedAnswer.length>=60&&q.safety.length>=45,
   "Applied questions require prompt, worked solution and boundary");
 }
}
assert.ok(load("app/(private)/learn/[course]/page.tsx").includes("deepPathwayFor"),"Course page must show external learning links");
assert.ok(load("app/(private)/learn/[course]/[lesson]/page.tsx").includes("studyCase"),"Lesson must show technical applied exercise");
console.log("External learning benchmark QA PASS: "+deeper.length+" courses, "+
 deeper.reduce((n,x)=>n+x.resources.length,0)+" targeted references, "+
 deeper.reduce((n,x)=>n+x.cases.length,0)+" worked applied exercises.");


// Applied HDD-to-SSD course must be more than a new label or a generic three-choice quiz.
// These checks defend the research, multiple modalities and supervised skill boundary.
const ssdGuide=load("../docs/SSD-UPGRADE-MASTERY-HP250G3-2026-10-11.md");
const ssdCourse=load("lib/learning/catalog.ts");
const ssdMedia=load("lib/learning/media.ts");
const ssdLab=load("components/StorageUpgradeLab.tsx");
const ssdPage=load("app/(private)/learn/[course]/page.tsx");
const ssdDeep=deeper.find(x=>x.slug==="repair-laptop-refurb");
assert.ok(ssdDeep,"Storage training must upgrade the existing laptop course");
assert.ok(ssdDeep.resources.length>=5,"SSD mastery needs model manual, diagnostics, video and audio");
assert.ok(ssdDeep.cases.every(x=>x.prompt.length>200&&x.workedAnswer.length>250),"Applied cases need real evidence and worked explanations");
assert.ok(ssdCourse.includes('docs/SSD-UPGRADE-MASTERY-HP250G3-2026-10-11.md'),"Course must link detailed procedures");
assert.ok(/independent verified backup/i.test(ssdGuide)&&/stop-work/i.test(ssdGuide),"Course must teach data protection and stop conditions");
assert.ok(/failing HDD/i.test(ssdGuide)&&/old-drive custody/i.test(ssdGuide),"Course must cover data recovery and disposal");
assert.ok(/gross margin/i.test(ssdGuide)&&/15\/18/.test(ssdGuide),"Course must include economics and observed mastery rubric");
const ssdMediaTypes=["video","podcast","guide"];
for(const type of ssdMediaTypes) assert.ok(new RegExp('course:"repair-laptop-refurb",type:"'+type+'"').test(ssdMedia),"Missing "+type+" in laptop course media");
assert.ok((ssdMedia.match(/id:"ssd-/g)||[]).length>=4,"Expect curated SSD learning media");
assert.ok(ssdPage.includes('id==="repair-laptop-refurb"?<StorageUpgradeLab/>'),"Simulator must be visible on existing course route");
assert.ok(ssdPage.includes('href="/storage-guide"'),"Course must link storage visual atlas");
assert.ok(ssdLab.includes('const scenarios:Scenario[]=[') && (ssdLab.match(/id:"[fpe][1-3]",level:/g)||[]).length===9,"SSD simulation needs nine scenario branches");
assert.ok(ssdLab.includes("const limit=7")&&ssdLab.includes("Math.min(3,scenario.level+1)")&&ssdLab.includes("Math.max(1,scenario.level-1)"),"Difficulty must adapt to actual answers");
assert.ok(ssdLab.includes("not evidence of a physical repair"),"Online practice must not be described as observed competence");
console.log("SSD mastery QA PASS: existing course, three lessons, adaptive simulator, model-specific references, mixed media and observed-skills boundary.");
