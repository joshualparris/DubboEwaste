import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const validUuid = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  // Prevent spreadsheet formula injection from donor, recipient and note fields.
  const safe = /^[\s]*[=+\-@\t\r]/.test(text) ? "'" + text : text;
  return '"' + safe.replace(/"/g, '""') + '"';
}
export async function GET(request: Request) {
  const url = new URL(request.url);
  const batchId = url.searchParams.get("batch") || "";
  if (!validUuid.test(batchId)) return NextResponse.json({error:"Invalid batch"}, {status:400});
  const supabase = await createClient();
  const {data:{user}} = await supabase.auth.getUser();
  if (!user) return NextResponse.json({error:"Authentication required"}, {status:401});
  const [{data:profile},{data:member}] = await Promise.all([
    supabase.from("profiles").select("role,active").eq("id",user.id).maybeSingle(),
    supabase.from("program_access").select("programme_role").eq("user_id",user.id)
      .eq("program","dubbo_ewaste").eq("active",true).maybeSingle(),
  ]);
  const permitted = !!profile?.active &&
    (profile.role === "admin" || ["admin","manager","technician"].includes(member?.programme_role || ""));
  if (!permitted) return NextResponse.json({error:"Forbidden"}, {status:403});
  const {data:batch} = await supabase.from("council_pilot_batches")
    .select("id,job_id,status,council_reference,created_at,authorised_at").eq("id",batchId).maybeSingle();
  if (!batch) return NextResponse.json({error:"Batch not found"}, {status:404});
  const {data:items,error} = await supabase.from("council_pilot_readiness").select("*")
    .eq("batch_id",batchId).order("asset_code");
  if (error) return NextResponse.json({error:"Report generation failed"}, {status:500});
  const ids = (items||[]).map(x=>x.asset_id);
  const [{data:handoffs},{data:media},{data:dispositions},{data:custody}] = await Promise.all([
    ids.length ? supabase.from("donation_handoffs").select("asset_id,recipient_organisation,receipt_reference,acknowledged_at").in("asset_id",ids) : Promise.resolve({data:[]}),
    ids.length ? supabase.from("media").select("parent_asset_id,media_code,serial,data_state").in("parent_asset_id",ids) : Promise.resolve({data:[]}),
    ids.length ? supabase.from("dispositions").select("asset_id,disposition_type,destination,decided_at").in("asset_id",ids) : Promise.resolve({data:[]}),
    ids.length ? supabase.from("pilot_custody_events").select("asset_id,event_type,reference,occurred_at").in("asset_id",ids) : Promise.resolve({data:[]}),
  ]);
  const header = [
    "batch_id","job_id","council_reference","batch_status","asset_code","category","asset_status",
    "data_state","ready_to_donate","release_blockers","media_identifiers","custody_events",
    "final_disposition","recipient_organisation","receipt_reference","recipient_acknowledged_at",
  ];
  const lines = [header.map(csvCell).join(",")];
  for (const a of items||[]) {
    const disposition = (dispositions||[]).filter(d=>d.asset_id===a.asset_id)
      .sort((a,b)=>String(b.decided_at).localeCompare(String(a.decided_at)))[0];
    const handoff = (handoffs||[]).find(h=>h.asset_id===a.asset_id);
    const mediumList = (media||[]).filter(m=>m.parent_asset_id===a.asset_id).map(m=>
      [m.media_code,m.serial||"unknown",m.data_state].join("/"));
    const custodyList = (custody||[]).filter(e=>e.asset_id===a.asset_id)
      .map(e=>e.event_type+" "+e.reference);
    const values = [
      batch.id,batch.job_id,batch.council_reference,batch.status,a.asset_code,a.category,
      a.asset_status,a.data_state,a.ready_to_donate,a.blockers,mediumList,custodyList,
      disposition?.disposition_type||"",handoff?.recipient_organisation||"",
      handoff?.receipt_reference||"",handoff?.acknowledged_at||"",
    ];
    lines.push(values.map(csvCell).join(","));
  }
  const body = lines.join("\r\n")+"\r\n";
  return new NextResponse(body,{status:200,headers:{
    "Content-Type":"text/csv; charset=utf-8",
    "Content-Disposition":'attachment; filename="council-pilot-'+batch.id+'.csv"',
    "Cache-Control":"private, no-store",
    "X-Content-Type-Options":"nosniff",
  }});
}
