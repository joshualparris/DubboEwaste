import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
const isUUID=/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
function cell(v:unknown){
 const s=String(v??"");
 return '"'+(/^[\s]*[=+\-@\t\r]/.test(s)?"'"+s:s).replace(/"/g,'""')+'"';
}
export async function GET(request:Request){
 const batch=new URL(request.url).searchParams.get("batch")||"";
 if(!isUUID.test(batch))return NextResponse.json({error:"Invalid batch"},{status:400});
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"Sign-in required"},{status:401});
 const [{data:profile},{data:membership}]=await Promise.all([
  supabase.from("profiles").select("role,active").eq("id",user.id).maybeSingle(),
  supabase.from("program_access").select("programme_role").eq("user_id",user.id)
   .eq("program","dubbo_ewaste").eq("active",true).maybeSingle(),
 ]);
 if(!profile?.active||!(profile.role==="admin"||["admin","manager"].includes(membership?.programme_role||"")))
 return NextResponse.json({error:"E-waste supervisor access required"},{status:403});
 const {data:b}=await supabase.from("council_pilot_batches").select("id,job_id,status").eq("id",batch).maybeSingle();
 if(!b)return NextResponse.json({error:"Unknown pilot"},{status:404});
 const [{data:assets},{data:transfers,error},{data:locations},{data:discrepancies},{data:counts}]=await Promise.all([
  supabase.from("assets").select("id,asset_code,serial_imei").eq("job_id",b.job_id),
  supabase.from("council_custody_transfers").select("*").eq("batch_id",batch).order("requested_at",{ascending:true}),
  supabase.from("council_custody_locations").select("id,name,kind,status").eq("batch_id",batch),
  supabase.from("council_custody_discrepancies").select("asset_id,status,discrepancy_type,opened_at").eq("batch_id",batch),
  supabase.from("council_custody_reconciliations").select("location_id,status,checked_at,expected_codes,observed_codes,missing_codes,unexpected_codes").eq("batch_id",batch),
 ]);
 if(error)return NextResponse.json({error:"Custody export failed"},{status:500});
 const names=new Map((locations||[]).map(l=>[l.id,l.name]));
 const byAsset=new Map((assets||[]).map(a=>[a.id,a]));
 const headings=["batch_id","asset_code","asset_serial","transfer_id","transfer_state","event_type","route",
 "original_source","verified_destination","releasing_operator_user_id","receiving_operator_user_id",
 "external_signatory","receipt_reference","requested_at","confirmed_at","evidence_document_id",
 "hash_previous","hash_current","open_discrepancies","physical_counts_for_destination"];
 const rows=[headings.map(cell).join(",")];
 for(const t of transfers||[]){
  const a=byAsset.get(t.asset_id);
  const d=(discrepancies||[]).filter(x=>x.status==="OPEN"&&(!x.asset_id||x.asset_id===t.asset_id)).length;
  const localCounts=(counts||[]).filter(x=>x.location_id===t.to_location_id)
   .map(x=>x.status+"@"+x.checked_at+"["+x.observed_codes?.length+"/"+x.expected_codes?.length+"]").join("; ");
  rows.push([
   batch,a?.asset_code||"UNKNOWN",a?.serial_imei||"",t.id,t.status,t.event_type,t.handover_route||"",
   t.from_location,names.get(t.to_location_id)||"UNKNOWN",t.releasing_user,t.receiving_user,
   t.external_party||"",t.document_reference,t.requested_at,t.confirmed_at||"",t.evidence_id,
   t.prev_hash||"",t.entry_hash||"",d,localCounts,
  ].map(cell).join(","));
 }
 const note=["PILOT-RECONCILIATION-SUMMARY",batch,"OPEN DISCREPANCIES",(discrepancies||[]).filter(x=>x.status==="OPEN").length,
 "RECENT PHYSICAL COUNTS",(counts||[]).length].map(cell).join(",");
 rows.push(note);
 return new NextResponse(rows.join("\r\n")+"\r\n",{headers:{
  "Content-Type":"text/csv; charset=utf-8",
  "Content-Disposition":'attachment; filename="council-custody-'+batch+'.csv"',
  "Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff",
 }});
}
