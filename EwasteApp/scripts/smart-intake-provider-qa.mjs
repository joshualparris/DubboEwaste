import {build} from "esbuild";
import assert from "node:assert/strict";
if(!process.env.SMART_INTAKE_WORKER_SECRET||!process.env.SMART_INTAKE_WORKER_URL){
  if(process.env.VERCEL==="1")throw Error("Vercel Smart Intake provider variables missing");
  console.log("Smart Intake live provider QA skipped (no server credentials in local/CI environment)");
  process.exit(0);
}
const bundled=await build({entryPoints:["lib/smart-intake-provider.ts"],bundle:true,platform:"node",format:"esm",write:false});
const {analyseEquipment}=await import("data:text/javascript;base64,"+Buffer.from(bundled.outputFiles[0].text).toString("base64"));
const photo="data:image/jpeg;base64,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";
let rows;try{rows=await analyseEquipment(photo,"Read this single laptop manufacturer's label; return one asset.");}catch(error){console.error(error.message);process.exit(1);}
assert.equal(rows.length,1);
assert.equal(rows[0].kind,"asset");
assert.equal(rows[0].serial,"TEST123");
assert.match(rows[0].manufacturer,/dell/i);
assert.match(rows[0].model,/5400/);
console.log("SMART INTAKE LIVE VISION PASS: synthetic Dell Latitude 5400 serial TEST123, valid inventory schema.");
