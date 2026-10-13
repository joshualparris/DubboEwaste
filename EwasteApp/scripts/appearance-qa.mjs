import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";
const root=process.cwd();
const load=(p)=>fs.readFileSync(path.join(root,p),"utf8");

const files=[
 "lib/appearance.ts","components/ThemeSync.tsx",
 "components/AppearanceSettings.tsx","app/(private)/settings/page.tsx",
 "app/layout.tsx","components/AppNav.tsx","lib/programmes.ts"
];
for(const file of files){
 const source=load(file);
 const node=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,file.endsWith(".tsx")?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(node.parseDiagnostics.length,0,file+" must parse as valid TS/TSX");
}
const util=load("lib/appearance.ts");
const transpiled=ts.transpileModule(util,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const mod=await import("data:text/javascript;base64,"+Buffer.from(transpiled).toString("base64"));
for(const value of ["light","dark","system"])assert.equal(mod.validAppearance(value),true,"Known themes accepted");
for(const value of ["",null,"purple","DARK","__proto__"])assert.equal(mod.validAppearance(value),false,"Unknown themes rejected");
assert.equal(mod.resolveTheme("light",true),"light","Light overrides device dark");
assert.equal(mod.resolveTheme("dark",false),"dark","Dark overrides device light");
assert.equal(mod.resolveTheme("system",false),"light","System follows light");
assert.equal(mod.resolveTheme("system",true),"dark","System follows dark");

const settings=load("components/AppearanceSettings.tsx");
const sync=load("components/ThemeSync.tsx");
const rootLayout=load("app/layout.tsx");
const nav=load("components/AppNav.tsx");
const guards=load("lib/programmes.ts");
const css=load("app/appearance.css");
const settingsPage=load("app/(private)/settings/page.tsx");
for(const required of ["aria-pressed","Use device","Light","Dark","localStorage.setItem","colorScheme","role=\"status\""])
 assert.ok(settings.includes(required),"Settings must include accessible control: "+required);
assert.ok(settings.includes("try{window.localStorage.setItem"),"Preference must work when storage is disabled");
assert.ok(sync.includes('window.addEventListener("storage"')&&sync.includes('addEventListener?.("change"'),"Other tabs and OS mode changes need to sync");
assert.ok(rootLayout.includes("<ThemeSync />")&&rootLayout.includes("appearance.css")&&rootLayout.includes("assetflow-appearance"),"Theme must start before paint and load across routes");
assert.ok(rootLayout.includes("suppressHydrationWarning"),"Pre-hydration theme cannot trigger React mismatch");
assert.ok(nav.includes('href="/settings"'),"Settings must be discoverable in the signed-in menu");
assert.ok(guards.includes('"settings"'),"Settings must be accessible across authorised programmes");
assert.ok(settingsPage.includes("<AppearanceSettings/>"),"Page must render the interactive preference");
assert.ok(css.includes(':root[data-theme="dark"]')&&css.includes('@media print')&&css.includes("--bg:#101914"),"Dark mode and print safeguards must exist");

/* The Volunteer Hub has CSS-module light surfaces, so global theme variables alone
   are insufficient. Check its dark-mode palette and contrast before each build. */
const volunteerCss=load("app/(private)/repair-cafe-volunteers/page.module.css");
assert.ok(volunteerCss.includes(':global(:root[data-theme="dark"]) .page{'),"Volunteer Hub must explicitly support dark mode");
for(const selector of [".hero",".section",".card",".warning",".checklist li",".links a",".card h3",".hero p"]){
 assert.ok(volunteerCss.includes(':global(:root[data-theme="dark"]) '+selector),"Missing Volunteer Hub dark-mode rule: "+selector);
}
const palette={
 ink:"#edf5ed",muted:"#bfd0c2",panel:"#1b2820",card:"#25362b",
 link:"#a1e9bd",warningInk:"#fbe7c8",warningBg:"#392d1b"
};
for(const value of Object.values(palette))assert.ok(volunteerCss.includes(value),"Volunteer Hub colour not found: "+value);
function volunteerLuminance(hex){
 const channels=hex.slice(1).match(/../g).map(part=>{
  const srgb=parseInt(part,16)/255;
  return srgb<=0.04045?srgb/12.92:((srgb+0.055)/1.055)**2.4;
 });
 return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
}
for(const [label,a,b] of [
 ["heading",palette.ink,palette.panel],["card heading",palette.ink,palette.card],
 ["card paragraph",palette.muted,palette.card],["muted copy",palette.muted,palette.panel],
 ["links",palette.link,palette.panel],["safety warning",palette.warningInk,palette.warningBg]
]){
 const l1=volunteerLuminance(a),l2=volunteerLuminance(b);
 const ratio=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
 assert.ok(ratio>=4.5,label+" fails normal-text WCAG AA: "+ratio.toFixed(2));
}

console.log("Appearance QA PASS: signed-in settings, light/dark/device persistence, cross-tab + device sync, SSR safe load, dark styles and white print output.");
