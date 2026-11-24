import { NextResponse } from "next/server";
import { getProgrammeContext } from "@/lib/programme-context";
import { parseDrafts, prompt, rowSchema, duplicateSerials } from "@/lib/smart-intake";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const maxDuration = 60;
const fail = (error: string, status=400) => NextResponse.json({error},{status});
const analyseSchema = z.object({action:z.literal("analyse"),image:z.string().max(3_000_000).optional(),description:z.string().trim().max(4000).optional(),consent:z.literal(true)});
const importSchema = z.object({action:z.literal("import"),job:z.string().uuid(),location:z.string().uuid().or(z.literal("")),confirmed:z.literal(true),automatic:z.boolean().optional(),kind:z.enum(["asset","lot"]),rows:z.array(rowSchema).min(1).max(80)});

export async function POST(request: Request) {
  // Same-origin only; no cross-site requests using the owner's session.
  if (request.headers.get("origin") !== new URL(request.url).origin) return fail("Invalid origin",403);
  const {supabase,context}=await getProgrammeContext();
  if (!context?.global_admin || (context.selected!==null && context.selected!=="dubbo_ewaste")) return fail("E-waste administrator access required",403);
  const length=Number(request.headers.get("content-length") || 0);
  if(length>3_200_000) return fail("Image too large",413);
  let raw: unknown;
  try { const body=await request.text(); if(body.length>3_200_000)return fail("Image too large",413); raw=JSON.parse(body); } catch {return fail("Invalid request");}
  const analysis=analyseSchema.safeParse(raw);
  if(analysis.success){
    const {image,description}=analysis.data;
    if(!image && !description) return fail("Add a photo or description.");
    if(image && !/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(image)) return fail("Invalid photo format.");
    const token=process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
    if(!token) return fail("AI Gateway is not configured here. Paste ChatGPT JSON instead.",503);
    try {
      const content: ({type:"text";text:string}|{type:"image_url";image_url:{url:string}})[]=[{type:"text",text:description || "Identify visible equipment."}];
      if(image)content.push({type:"image_url",image_url:{url:image}});
      const response=await fetch("https://ai-gateway.vercel.sh/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.SMART_INTAKE_MODEL || "google/gemini-3.5-flash",messages:[{role:"system",content:prompt},{role:"user",content}],max_tokens:6000}),signal:AbortSignal.timeout(45000),cache:"no-store"});
      if(!response.ok)return fail("AI analysis unavailable ("+response.status+"). Try again or paste ChatGPT JSON.",502);
      const result=await response.json();
      return NextResponse.json({rows:parseDrafts(result.choices?.[0]?.message?.content || "")});
    }catch{return fail("AI could not return a valid inventory. Try a clearer photo or paste JSON.",502);}
  }
  const parsed=importSchema.safeParse(raw);
  if(!parsed.success)return fail("Check intake fields and confirm ownership.");
  const {job,location,kind,rows,automatic}=parsed.data;
  if(automatic&&(kind!=="asset"||rows.length!==1||!rows[0].manufacturer||!rows[0].model||rows[0].category==="OTHER"||! /^[A-Za-z0-9-]{5,80}$/.test(rows[0].serial)))return fail("Automatic registration requires one identified device with a readable serial.");
  if(rows.some(r=>r.kind!==kind)||new Set(rows.map(r=>r.id)).size!==rows.length||duplicateSerials(rows))return fail("Remove duplicate serials or invalid rows.");
  if(kind==="lot"&&rows.some(r=>r.commodity.length<2))return fail("Give every lot a commodity name.");
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return fail("Sign in again.",401);
  const [{data:source,error:sourceError},{data:council,error:councilError}]=await Promise.all([
    supabase.from("jobs").select("id,source_site,customer_id,status").eq("id",job).eq("programme","dubbo_ewaste").single(),
    supabase.from("council_pilot_batches").select("id").eq("job_id",job).maybeSingle()
  ]);
  if(sourceError||councilError||!source)return fail("Cannot verify the selected job.");
  if(council)return fail("Council custody requires the dedicated manual intake workflow.");
  if(["CLOSED","CANCELLED"].includes(source.status))return fail("Choose an open inbound job.");
  if(location){
    const {data,error}=await supabase.from("locations").select("id").eq("id",location).eq("programme","dubbo_ewaste").eq("active",true).single();
    if(error||!data)return fail("Choose a valid active location.");
  }
  // Stable client-generated IDs prevent a repeated request from creating the same rows twice.
  const table=kind==="asset"?"assets":"lots";
  const {data:prior,error:priorError}=await supabase.from(table).select("id").in("id",rows.map(r=>r.id));
  if(priorError)return fail("Could not check previous imports.",500);
  if(prior?.length)return fail("Some rows already exist. Check inventory before importing again.",409);
  const serials=rows.filter(r=>r.serial&&kind==="asset").map(r=>r.serial);
  if(serials.length){
    const {data:existing,error}=automatic ? await supabase.from("assets").select("id").ilike("serial_imei",serials[0]) : await supabase.from("assets").select("id").in("serial_imei",serials);
    if(error)return fail("Could not check existing serials.",500);
    if(existing?.length)return fail("A serial already exists in inventory. Check duplicates before importing.",409);
  }
  const marker=automatic?"Smart Intake — automatically registered with batch ownership authorisation; AI model and serial UNVERIFIED; physical inspection required. ":"Smart Intake — operator-reviewed; model/condition still require physical verification. ";
  const entries=rows.map(r=>kind==="asset"?{
    id:r.id,programme:"dubbo_ewaste",owner_kind:"PROGRAMME",owner_name:null,ownership_verified:true,
    job_id:job,customer_id:source.customer_id||null,source_name:source.source_site||null,location_id:location||null,
    category:r.category,manufacturer:r.manufacturer||null,model:r.model||null,serial_imei:r.serial||null,
    data_bearing:true,data_state:"UNWIPED_RESTRICTED",initial_route:"HOLD",status:"INTAKE",notes:marker+r.notes,created_by:user.id,
  }:{
    id:r.id,programme:"dubbo_ewaste",job_id:job,location_id:location||null,commodity:r.commodity,item_count:r.count,
    notes:marker+r.notes,created_by:user.id,
  });
  const {data:inserted,error}=await supabase.from(table).insert(entries).select("id");
  if(error||!inserted)return fail("Import failed. Check inventory before retrying.",409);
  const {error:auditError}=await supabase.from("operational_events").insert(inserted.map(r=>({programme:"dubbo_ewaste",entity_type:kind,entity_id:r.id,event_type:kind==="asset"?"ASSET_RECEIVED":"LOT_CREATED",actor_id:user.id,details:{job_id:job,method:automatic?"SMART_INTAKE_AUTO":"SMART_INTAKE"}})));
  revalidatePath("/assets");revalidatePath("/lots");revalidatePath("/dashboard");revalidatePath("/jobs/"+job);
  return NextResponse.json({created:inserted.length,auditWarning:!!auditError});
}
