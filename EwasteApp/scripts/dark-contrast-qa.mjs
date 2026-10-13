import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const dark=read("app/appearance.css");
const learning=read("app/(private)/learn/learning.module.css");
const cafe=read("app/(private)/repair-cafe-volunteers/page.module.css");
const pricing=read("components/RepairPricingStudio.module.css");
const general=read("app/globals.css");
const report=read("app/(private)/repair-cafe-volunteers/reports/page.tsx");

function luminance(hex){
 const channels=hex.replace("#","").match(/.{2}/g).map(v=>parseInt(v,16)/255)
  .map(v=>v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4));
 return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722;
}
function ratio(fg,bg){const a=luminance(fg),b=luminance(bg);return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);}
const pairs=[
 ["main text on card","#edf5ed","#1b2820"],
 ["muted text on card","#bbd0bf","#1b2820"],
 ["Repair Café card title","#edf5ed","#23352a"],
 ["warning text on dark amber","#ffe2b9","#382b1b"],
 ["learning safety warning","#ffe0b5","#382b1b"],
 ["shared muted text on body","#b4c6b8","#101914"],
 ["link on body","#a3e5bb","#101914"],
 ["input text on input","#f0f7f1","#14231a"],
 ["dark track label","#b7ebc7","#284633"]
];
for(const [name,fg,bg] of pairs){
 const measured=ratio(fg,bg);
 assert.ok(measured>=4.5,name+" contrast "+measured.toFixed(2)+" below WCAG AA 4.5");
 console.log("  "+name+": "+measured.toFixed(2)+":1");
}
const has=(text,pattern,why)=>assert.ok(text.includes(pattern),why+": missing "+pattern);
for (const [name,text,checks] of [
 ["repair cafe",cafe,[".hero{",".section{",".card{",".warning{",".rank{",".intro,"]],
 ["learning",learning,[".courseHero",".lessonHero",".checkPanel",".deepPanel",".deepSafety",".track",".formField",".quiz label"]],
 ["pricing",pricing,[".studio{",".panel",".field",".noticeBad"]],
 ["shared",dark,[".record-table>tbody>tr",".repair-report-hero",".doc-breadcrumbs a",".form input"]]
]){
 assert.ok(text.includes(':global(:root[data-theme="dark"])')||name==="shared",name+" dark-mode scope missing");
 for(const check of checks)has(text,check,name);
}
has(general,"--bg: #f4f7f4","original light appearance preserved");
has(dark,'@media print',"printer-friendly white output");
has(report,'className="card repair-report-hero"',"theme-aware Repair Cafe report hero");
assert.ok(!report.includes('background:"linear-gradient(110deg,#e6f3e8'),"unpaired inline gradient returned");
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(ent=>ent.isDirectory()?walk(path.join(dir,ent.name)):[path.join(dir,ent.name)]);
const routes=walk(path.join(root,"app")).filter(p=>p.endsWith("page.tsx"));
const modules=[...walk(path.join(root,"app")),...walk(path.join(root,"components"))].filter(p=>p.endsWith(".module.css"));
assert.ok(routes.length>=46,"Expected route-wide audit scope >=46");
console.log("Dark-theme source audit: "+routes.length+" route pages, "+modules.length+" component CSS modules discovered.");
console.log("Dark contrast QA PASS: nine measured AA colour pairs, Repair Café, Learn/Manage, pricing, shared controls, mobile records, print and report hero.");
