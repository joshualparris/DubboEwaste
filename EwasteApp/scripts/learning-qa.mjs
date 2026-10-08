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
