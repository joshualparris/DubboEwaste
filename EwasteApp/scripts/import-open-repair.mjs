/**
 * ORA 2025-07 aggregate importer (CC BY-SA 4.0).
 * Run from EwasteApp: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/import-open-repair.mjs
 * Optional MAX_ROWS=25000; BATCH_SIZE=300. Never bundle the service-role key into the web app.
 * Streams CSV, correctly handling quotes and embedded newlines, and upserts by dataset ID.
 */
import {createClient} from "@supabase/supabase-js";
const url=process.env.SUPABASE_URL;
const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key)throw Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on a trusted machine");
const source="https://raw.githubusercontent.com/openrepair/data/master/aggregated/202507/OpenRepairData_v0.3_aggregate_202507.csv";
const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const max=Math.max(1,Math.min(350000,Number(process.env.MAX_ROWS??"25000")));
const batchSize=Math.max(10,Math.min(500,Number(process.env.BATCH_SIZE??"300")));
const response=await fetch(source,{headers:{"User-Agent":"Dubbo-Repair-Cafe-research-import/1.0"}});
if(!response.ok||!response.body)throw Error("CSV source unavailable: "+response.status);
let count=0,seen=0,batch=[],head=null,line=[],field="",quoted=false,afterQuote=false;
const first=(obj,...names)=>{for(const n of names){const v=obj[n];if(typeof v==="string"&&v.trim())return v.trim().slice(0,1000);}return "";};
async function flush(){
 if(!batch.length)return;
 const {error}=await db.from("repair_cafe_open_repair_data").upsert(batch,{onConflict:"source_id"});
 if(error)throw Error("Import stopped at "+seen+": "+error.message);
 count+=batch.length;batch=[];process.stdout.write("Imported "+count+"\n");
}
async function processRow(row){
 if(!head){head=row.map(x=>x.trim().toLowerCase().replace(/[^a-z0-9]+/g,"_"));return;}
 seen++;
 if(seen>max)return;
 const o=Object.fromEntries(head.map((k,i)=>[k,row[i]??""]));
 const record={
  source_id:"ora-202507-"+first(o,"id","record_id","repair_id").slice(0,120),
  dataset_version:"202507",
  category:first(o,"product_category","category").slice(0,150),
  product:first(o,"product","product_description","product_category").slice(0,180),
  brand:first(o,"brand","manufacturer").slice(0,150),
  model:first(o,"model").slice(0,180),
  problem:first(o,"problem","fault").slice(0,500),
  repair_status:first(o,"repair_status","repair_outcome").slice(0,120),
  country:first(o,"country").slice(0,80),
  event_date:first(o,"event_date","date").slice(0,40)
 };
 if(record.source_id==="ora-202507-")record.source_id="ora-202507-row-"+seen;
 batch.push(record);if(batch.length>=batchSize)await flush();
}
const decoder=new TextDecoder();
async function consume(chunk){
 for(const ch of chunk){
  if(ch==='"'){
   if(quoted){afterQuote=true;quoted=false;}else if(afterQuote){field+='"';quoted=true;afterQuote=false;}else if(field===""){quoted=true;}else{field+='"';}
  }else{
   if(afterQuote)afterQuote=false;
   if(ch===","&&!quoted){line.push(field);field="";}
   else if(ch==="\n"&&!quoted){line.push(field.replace(/\r$/,""));await processRow(line);line=[];field="";}
   else field+=ch;
  }
 }
}
for await(const chunk of response.body){
 await consume(decoder.decode(chunk,{stream:true}));
 if(seen>=max)break;
}
if(field||line.length){line.push(field);await processRow(line);}
await flush();
console.log("Complete. Records imported: "+count+"; source: "+source+"; license: CC BY-SA 4.0");
