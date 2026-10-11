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
assert.ok(entries.length>=62,"Every course should have a curated external resource and substantial pathways should add independent sources");
assert.ok(calls.every(course=>entries.some(item=>item.course===course.id)),"All courses must link at least one directly relevant source");
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

const qualitySource=load("lib/learning/quality.ts");
assert.ok(qualitySource.includes("masteryReady")&&qualitySource.includes("Individual observed skills sign-off"),"Course quality must not be equated with completion");
assert.ok(load("app/(private)/learn/[course]/page.tsx").includes("qualityStageLabel"),"Show quality status and gaps for each course");
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
assert.ok(deeper.length>=19,"Critical learning courses must have nineteen or more reviewed advanced pathways");
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
assert.ok(["repair-service-pricing","repair-cafe-intake","things-maintenance","device-identity-locks"].every(id=>deeper.some(p=>p.slug===id)),"Critical new field exercises must remain");
console.log("External learning benchmark QA PASS: "+deeper.length+" courses, "+
 deeper.reduce((n,x)=>n+x.resources.length,0)+" targeted references, "+
 deeper.reduce((n,x)=>n+x.cases.length,0)+" worked applied exercises.");


const labSource=load("components/LaptopDiagnosticsLab.tsx");
const labFile=ts.createSourceFile("LaptopDiagnosticsLab.tsx",labSource,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
assert.equal(labFile.parseDiagnostics.length,0,"Diagnostics lab TSX syntax must parse cleanly");
assert.ok(load("app/(private)/learn/[course]/page.tsx").includes('<LaptopDiagnosticsLab />'),"Laptop lab must be mounted in course");
for(const required of ["Predict, then investigate","setPredictions","Evidence budget","Critical stop-work","localStorage","diagnostic decision"]){
 assert.ok(labSource.toLowerCase().includes(required.toLowerCase()),"Missing diagnostics lab feature: "+required);
}
assert.equal((labSource.match(/title:".*Case [ABC]"/g)||[]).length,3,"Three diagnostic cases must remain");
assert.ok(labSource.includes("unsafe?0:"),"Critical safety errors must zero the case score");
assert.ok(labSource.includes("predictionCoverage&&spent<=10"),"Efficiency points must require decisive evidence and predictions");
console.log("Diagnostics workbench QA PASS: TSX parsed; three cases, safety, predictions and integration present.");

/* Clone field lab: challenging alternatives, no answer-length shortcut, and actual practice evidence. */
const labData=load("lib/learning/storage-clone-lab.ts");
const labPage=load("app/(private)/learn/repair-laptop-refurb/field-lab/page.tsx");
const labCourse=load("app/(private)/learn/[course]/page.tsx");
const labMatches=[...labData.matchAll(/choices:\[(("(?:\\.|[^"\\])*",?){3})\],correct:([012])/g)];
assert.equal(labMatches.length,15,"Five clone missions must offer three adaptive levels each");
const labCheck=labMatches.map(m=>{
 const opts=[...m[1].matchAll(/"((?:\\.|[^"\\])*)"/g)].map(x=>x[1]);
 assert.equal(opts.length,3,"Every clone decision requires three meaningful choices");
 assert.equal(new Set(opts).size,3,"Clone decision choices must differ");
 const lengths=opts.map(x=>x.length);
 assert.ok(Math.min(...lengths)>=50,"Avoid short giveaway choices in "+opts[0]);
 assert.ok(Math.max(...lengths)/Math.min(...lengths)<1.3,"Answer-length giveaway in "+opts[0]);
 return {answer:Number(m[3]),lengths};
});
const labLongest=labCheck.filter(x=>x.answer===x.lengths.indexOf(Math.max(...x.lengths))).length;
const labShortest=labCheck.filter(x=>x.answer===x.lengths.indexOf(Math.min(...x.lengths))).length;
assert.ok(labLongest<=7&&labShortest<=7,"Picking the longest/shortest answer cannot be a strong strategy");
assert.deepEqual([0,1,2].map(i=>labCheck.filter(x=>x.answer===i).length),[5,5,5],"Balance correct-choice positions");
for(const id of ["custody","compatibility","slowdown","verification","handover"]){
 assert.ok(labData.includes('id:"'+id+'"'),"Missing clone field lab mission "+id);
}
assert.ok(labCourse.includes('href="/learn/repair-laptop-refurb/field-lab"'),"LMS must link the practical field lab");
for(const fragment of ["SpeechSynthesisUtterance","evidenceMinimum","summary(notes,answers)","curatedResources","observationLog","navigator.clipboard","window.print()"]){
 assert.ok(labPage.includes(fragment),"Clone lab missing active learning feature: "+fragment);
}
for(const url of ["https://www.youtube.com/watch?v=lSdSNAjmdDg","https://csrc.nist.gov/pubs/sp/800/88/r2/final"]){
 assert.ok(labData.includes(url),"Missing first-party research source "+url);
}
console.log("Clone field lab QA PASS: 5 missions, 15 adaptive decisions, balanced alternatives, narrated reasoning and evidence export.");


/* Donor LCD transplant: 15 evidence-based decisions, balanced distractors, real safety gates. */
const screenData=load("lib/learning/screen-transplant-lab.ts");
const screenPage=load("app/(private)/learn/repair-laptop-refurb/screen-transplant/page.tsx");
const screenSource=ts.createSourceFile("screen-transplant-lab.ts",screenData,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
const screenView=ts.createSourceFile("screen-transplant/page.tsx",screenPage,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
assert.equal(screenSource.parseDiagnostics.length,0,"Screen transplant lesson data must parse as TypeScript");
assert.equal(screenView.parseDiagnostics.length,0,"Screen transplant page must parse as TSX");
const screenQs=[...screenData.matchAll(/options:\[(("(?:\\.|[^"\\])*",?){3})\],answer:([012])/g)].map(m=>{
 const options=[...m[1].matchAll(/"((?:\\.|[^"\\])*)"/g)].map(x=>x[1]);
 assert.equal(options.length,3,"Three real decision options required");
 assert.equal(new Set(options).size,3,"No duplicate choices in donor screen assessment");
 const lengths=options.map(s=>s.length);
 assert.ok(Math.min(...lengths)>=40,"Screen lab distractors too short to be credible");
 assert.ok(Math.max(...lengths)/Math.min(...lengths)<=1.35,"Screen assessment gives away an answer by length");
 return {correct:Number(m[3]),lengths};
});
assert.equal(screenQs.length,15,"Five screen missions must have three adaptive levels each");
assert.deepEqual([0,1,2].map(i=>screenQs.filter(q=>q.correct===i).length),[5,5,5],"Avoid correct-answer position bias in screen lab");
const screenLongest=screenQs.filter(q=>q.correct===q.lengths.indexOf(Math.max(...q.lengths))).length;
const screenShortest=screenQs.filter(q=>q.correct===q.lengths.indexOf(Math.min(...q.lengths))).length;
assert.ok(screenLongest<=7&&screenShortest<=7,"Screen lab answers must resist longest/shortest shortcut");
for(const id of ["symptoms","identity","compatibility","isolation","release"]){
 assert.ok(screenData.includes('id:"'+id+'"'),"Missing screen transplant stage "+id);
}
for(const essential of ["N156BGE-E32","N156BGA-EB2","CMN15DC","Reverse I/F","stopWork?:boolean"]){
 assert.ok(screenData.includes(essential),"Missing real-case evidence or stop-work contract: "+essential);
}
assert.ok(labCourse.includes('href="/learn/repair-laptop-refurb/screen-transplant"'),"Course detail must link the screen transplant lab");
for(const essential of ["SpeechSynthesisUtterance","safeGates","recorded===5","navigator.clipboard","window.print()","sources.map","HOLD"]){
 assert.ok(screenPage.includes(essential),"Screen transplant field lab missing essential feature: "+essential);
}
assert.ok(screenPage.includes("answers.compatibility?.correct&&answers.isolation?.correct"),"Safety-critical compatibility and isolation decisions must be required");
console.log("Donor screen field lab QA PASS: 5 stages, 15 unbiased adaptive decisions, STOP gates, written evidence and export.");


// Integration guard for the HP 250 G3 HDD-to-SSD learning masterclass.
// Preserve the existing SSD clone, diagnostics, and screen-transplant field labs.
const ssdGuide=load("../docs/SSD-UPGRADE-MASTERY-HP250G3-2026-10-11.md");
const ssdMedia=load("lib/learning/media.ts");
const ssdOverview=load("app/(private)/learn/[course]/page.tsx");
const ssdDeep=deeper.find(x=>x.slug==="repair-laptop-refurb");
assert.ok(ssdDeep&&ssdDeep.resources.length>=5,"SSD masterclass needs model manual and diverse references");
assert.ok(ssdDeep.cases.length===3&&ssdDeep.cases.every(x=>x.prompt.length>200&&x.workedAnswer.length>250),"Laptop cases must include detailed reasoning");
assert.ok(/independent backup/i.test(ssdGuide)&&/stop-work/i.test(ssdGuide),"SSD guide needs backup and stop-work gates");
assert.ok(/gross margin/i.test(ssdGuide)&&/15\/18/.test(ssdGuide),"SSD masterclass needs economics and a supervisor rubric");
for(const kind of ["video","guide","podcast"])assert.ok(new RegExp('course:"repair-laptop-refurb",type:"'+kind+'"').test(ssdMedia),"Missing SSD media type: "+kind);
for(const id of ["ssd-crucial-copy","ssd-crucial-install","ssd-hp-ifixit","ssd-scope-podcast"])assert.ok(ssdMedia.includes('id:"'+id+'"'),"SSD medium missing: "+id);
assert.ok(ssdOverview.includes("/storage-guide")&&ssdOverview.includes("SSD-UPGRADE-MASTERY")&&ssdOverview.includes("/field-lab"),"SSD guide, atlas and field lab links needed");
assert.ok(ssdOverview.includes("/screen-transplant"),"Preserve LCD screen transplant course");
console.log("Integrated SSD masterclass QA PASS: model-specific guide, source media, deep cases, supervisor rubric and both labs.");


// Audio and real-world assessment are separate learning outcomes.
// A published podcast and simulated cases cannot manufacture a supervised pass.
const audioSource=load("lib/learning/refurb-audio.ts");
const audioPlayer=load("components/RefurbAudioCompanion.tsx");
const audioTs=readTS("lib/learning/refurb-audio.ts");
const audioView=ts.createSourceFile("RefurbAudioCompanion.tsx",audioPlayer,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
assert.equal(audioTs.parseDiagnostics.length,0,"Audio chapter scripts must parse");
assert.equal(audioView.parseDiagnostics.length,0,"Audio UI must be parseable TSX");
for(const id of ["consent","fit","prove"])assert.ok(audioSource.includes('id:"'+id+'"'),"Missing authentic narrated chapter "+id);
assert.ok((audioSource.match(/duration:"About 3 minutes"/g)||[]).length===3,"The narration needs three full chapters");
for(const required of ["speechSynthesis","SpeechSynthesisUtterance","Pause","Stop","transcript","role=\"status\"","en-AU"]){
 assert.ok(audioPlayer.includes(required),"Audio player must implement: "+required);
}
assert.ok(ssdMedia.includes('id:"ssd-drive-recovery-podcast"'),"Missing directly relevant failing-storage podcast");
assert.ok(load("app/(private)/learn/[course]/page.tsx").includes("<RefurbAudioCompanion/>"),"Learner must be able to hear the actual teaching");

const signoffModel=load("lib/learning/mastery.ts");
const signoffTs=readTS("lib/learning/mastery.ts");
assert.equal(signoffTs.parseDiagnostics.length,0,"Sign-off derivation must parse");
const masteryJS=ts.transpileModule(signoffModel,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const mastery=await import("data:text/javascript;base64,"+Buffer.from(masteryJS).toString("base64"));
const scores={skill_consent:3,skill_diagnosis:3,skill_compatibility:2,skill_safety:3,skill_verification:2,skill_handover:2};
const observed={
 id:"test",submitted_at:"2026-10-11",status:"approved",reviewer_id:"assessor",reviewed_at:"2026-10-11",
 feedback:"Actual direct observation notes recorded",directly_observed:true,observed_on:"2026-10-11",
 observation_method:"in_person",evidence_reference:"DEW-TRAINING-0007",assessor_attested:true,...scores
};
assert.equal(mastery.rubricTotal(observed),15,"Rubric must total six skills");
assert.equal(mastery.independentlyObservedSignoff(observed,"learner"),true,"Properly observed demonstration is recordable");
for(const altered of [{reviewer_id:"learner"},{directly_observed:false},{assessor_attested:false},
 {skill_safety:1},{skill_diagnosis:null},{status:"submitted"},{observed_on:null},{reviewed_at:null}]){
 assert.equal(mastery.independentlyObservedSignoff({...observed,...altered},"learner"),false,"Never certify unobserved, unsafe or incomplete work");
}
const reviewAction=load("app/(private)/learn/manage/actions.ts");
const reviewScreen=load("app/(private)/learn/manage/page.tsx");
const courseDetail=load("app/(private)/learn/[course]/page.tsx");
const migration=load("supabase/migrations/20261011090000_learning_observed_mastery_rubric.sql");
for(const field of ["skill_consent","skill_diagnosis","skill_compatibility","skill_safety","skill_verification","skill_handover",
 "assessor_attested","observed_on","observation_method","evidence_reference"]){
 assert.ok(reviewAction.includes(field)&&reviewScreen.includes(field)&&migration.includes(field),"Score/evidence must be stored and validated: "+field);
}
assert.ok(migration.includes("learning_refurb_observed_mastery_guard")&&migration.includes("learning_practical_review_immutable"),"Database must enforce rubric and immutable review");
assert.ok(reviewAction.includes("record.user_id===actor.user.id"),"A learner cannot approve their own evidence");
assert.ok(reviewScreen.includes("Independently observed laptop practical sign-offs"),"Supervisor must have a real review register");
assert.ok(courseDetail.includes("independentlyObservedSignoff")&&courseDetail.includes("No independently observed practical sign-off"),"Learner must see their actual outcome or honest absence of one");
console.log("Observed mastery QA PASS: audio scripts and UI parse, targeted podcast, six skills, independent-assessor gate and DB audit controls.");


const storageGallerySource=load("lib/storage-photos.ts");
const storageGalleryData=storageGallerySource.split("export const storagePhotos:StoragePhoto[] = ")[1]?.split(";\nexport function")[0];
assert.ok(storageGalleryData,"Storage Explorer must retain its verified photo catalogue");
const storageGallery=JSON.parse(storageGalleryData);
assert.ok(storageGallery.length>=16,"Storage Explorer should feature at least sixteen real photo references");
assert.equal(new Set(storageGallery.map(p=>p.id)).size,storageGallery.length,"Storage photographs need distinct IDs");
assert.equal(new Set(storageGallery.map(p=>p.file)).size,storageGallery.length,"Do not add duplicate photograph files");
const validDriveIds=new Set([...load("lib/storage-guide.ts").matchAll(/\{id:"([^"]+)",title:/g)].map(m=>m[1]));
for(const p of storageGallery){
 assert.ok(p.file && p.credit && p.license && p.licenseUrl.startsWith("https://"),"Photo must credit actual source and license: "+p.id);
 assert.ok(p.atlasIds.every(id=>validDriveIds.has(id)),"Photo must map to an actual atlas entry: "+p.id);
}
assert.ok(storageGallery.some(p=>p.file==="1TB 2280 NVME SSD.jpg"&&p.atlasIds.includes("nvme2280")),"Never substitute a 2230 SSD photo for a 2280 SSD");
assert.ok(storageGallery.every(p=>!p.atlasIds.includes("pata-ssd")||p.id!=="msata"),"mSATA is not PATA");
const storagePage=load("app/storage-guide/page.tsx");
assert.ok(storagePage.includes("storagePhotos.map") && storagePage.includes("photoForItem(item)"),"Storage photos must be visible in gallery and drive atlas");
assert.ok(storagePage.includes("heroPhotos") && storagePage.includes("photoHighlights"),"Real photos must appear in main site sections, not only a hidden tab");
const storageTSX=ts.createSourceFile("storage-guide/page.tsx",storagePage,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
assert.equal(storageTSX.parseDiagnostics.length,0,"Storage Explorer JSX must parse after photo edits");
console.log("Storage photo QA PASS: real Commons sources, sixteen photo entries, correct drive sizes, header/atlas/anatomy/gallery rendering.");


// Provider-backed inline playback: no misleading "watch/listen here" buttons that
// just navigate away, and no untrusted raw link may enter an iframe.
const playSource=load("lib/learning/playback.ts");
const playerSource=load("components/LearningMediaPlayer.tsx");
const mediaHub=load("app/(private)/learn/media/page.tsx");
const mediaHome=load("app/(private)/learn/page.tsx");
const courseMedia=load("app/(private)/learn/[course]/page.tsx");
const playTS=readTS("lib/learning/playback.ts");
const playerTS=ts.createSourceFile("LearningMediaPlayer.tsx",playerSource,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
assert.equal(playTS.parseDiagnostics.length,0,"Provider embed resolver must parse TypeScript");
assert.equal(playerTS.parseDiagnostics.length,0,"Shared audio and video player must parse TSX");
const transpiled=ts.transpileModule(playSource,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const {mediaPlayback}=await import("data:text/javascript;base64,"+Buffer.from(transpiled).toString("base64"));
const playbackLines=contents.split("\n").filter(line=>/type:"(?:video|podcast)"/.test(line));
let testedVideos=0, testedPodcasts=0;
for(const line of playbackLines){
 const type=line.match(/type:"(video|podcast)"/)?.[1];
 const url=line.match(/url:"([^"]+)"/)?.[1];
 const audioUrl=line.match(/audioUrl:"([^"]+)"/)?.[1];
 const embedUrl=line.match(/embedUrl:"([^"]+)"/)?.[1];
 const id=line.match(/id:"([^"]+)"/)?.[1];
 assert.ok(type&&url&&id,"Every media row must expose explicit trusted playback metadata");
 const result=mediaPlayback({type,url,audioUrl,embedUrl});
 assert.ok(result, "Non-playable provider metadata: "+id);
 assert.ok(result.src.startsWith("https://"),"Only HTTPS in providers");
 if(type==="video"){testedVideos++;assert.ok(["youtube","vimeo"].includes(result.kind),"All videos must use approved inline player: "+id);}
 else{testedPodcasts++;assert.ok(["audio","apple"].includes(result.kind),"All podcasts need direct audio or native podcast player: "+id);}
}
assert.ok(testedVideos>=27&&testedPodcasts>=11,"Do not lose restored podcast and video inventory");
assert.equal(mediaPlayback({type:"video",url:"https://evil.example/watch?v=pQw4E8ecL5c"}),null,"Block arbitrary iframe targets");
assert.equal(mediaPlayback({type:"podcast",url:"javascript:alert(1)"}),null,"Block Javascript source");
assert.ok(playerSource.includes("<audio controls")&&playerSource.includes("<iframe"),"Native HTML5 audio and provider iframe are required");
assert.ok(playerSource.includes("onClick={()=>{setOpen(true)")&&playerSource.includes("Open original"),"Privacy click-to-load and honest external fallback");
assert.ok(mediaHub.includes("mediaItems.filter")&&mediaHub.includes("<LearningMediaPlayer item={item}/>"),"Media hub must play providers in-page");
assert.ok(courseMedia.includes("<LearningMediaPlayer item={item}/>"),"Learning modules must play providers in-page");
assert.ok(mediaHome.includes('href="/learn/media#podcasts"'),"Learning home must link central listening library");
console.log("Inline media QA PASS: "+testedPodcasts+" podcasts and "+testedVideos+" videos have in-page players, original links and trusted URL allowlists.");
