import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
const isUUID=/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
function quote(value:unknown){
 const str=String(value??"");
 const safe=/^[\s]*[=+\-@\t\r]/.test(str)?"'"+str:str;
 return '"'+safe.replace(/"/g,'""')+'"';
}
export async function GET(request:Request){
 const batch=new URL(request.url).searchParams.get("batch")||"";
 if(!isUUID.test(batch))return NextResponse.json({error:"Invalid batch"},{status:400});
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"Sign-in required"},{status:401});
 const [{data:p},{data:m}]=await Promise.all([
  supabase.from("profiles").select("role,active").eq("id",user.id).maybeSingle(),
  supabase.from("program_access").select("programme_role").eq("user_id",user.id)
    .eq("program","dubbo_ewaste").eq("active",true).maybeSingle(),
 ]);
 if(!p?.active || !(p.role==="admin"||["admin","manager"].includes(m?.programme_role||""))){
  return NextResponse.json({error:"Supervisor authorisation required"},{status:403});
 }
 const {data:b}=await supabase.from("council_pilot_batches").select("id,job_id,status")
  .eq("id",batch).maybeSingle();
 if(!b)return NextResponse.json({error:"Batch not found"},{status:404});
 const [{data:risks,error},{data:dashboard},{data:incidents}]=await Promise.all([
  supabase.from("council_risks").select("id,reference,category,classification,hazard,cause,consequence,affected_people,owner_id,status,legal_or_policy_basis")
   .eq("batch_id",batch).order("reference"),
  supabase.from("council_risk_dashboard").select("*").eq("batch_id",batch).maybeSingle(),
  supabase.from("council_risk_incidents").select("id,severity,status").eq("batch_id",batch),
 ]);
 if(error)return NextResponse.json({error:"Risk export failed"},{status:500});
 const ids=(risks||[]).map(r=>r.id);
 const [{data:controls},{data:assessments},{data:actions}]=await Promise.all([
  ids.length?supabase.from("council_risk_controls").select("risk_id,hierarchy,status,critical,due_on,next_review_on,description").in("risk_id",ids):Promise.resolve({data:[]}),
  ids.length?supabase.from("council_risk_assessments").select("risk_id,status,version,inherent_rating,residual_rating,review_due,approved_at").in("risk_id",ids):Promise.resolve({data:[]}),
  ids.length?supabase.from("council_risk_actions").select("risk_id,status,due_on").in("risk_id",ids):Promise.resolve({data:[]}),
 ]);
 const keys=["batch_id","batch_status","risk_reference","category","classification","status","hazard","causes","potential_consequence",
  "affected_people","policy_basis","risk_owner_id","assessment_status","assessment_version",
  "inherent_rating","residual_rating","next_assessment_review",
  "controls_total","controls_verified","critical_controls_not_verified","control_evidence_summary",
  "open_actions","overdue_actions","incident_count","serious_open_incidents","pilot_risk_ready"];
 const lines=[keys.map(quote).join(",")];
 for(const r of risks||[]){
  const c=(controls||[]).filter(x=>x.risk_id===r.id);
  const a=(assessments||[]).filter(x=>x.risk_id===r.id && x.status==="APPROVED")
    .sort((x,y)=>y.version-x.version)[0];
  const acts=(actions||[]).filter(x=>x.risk_id===r.id);
  const date=new Date().toLocaleDateString("en-CA",{timeZone:"Australia/Sydney"});
  const values=[
   batch,b.status,r.reference,r.category,r.classification,r.status,r.hazard,r.cause,r.consequence,r.affected_people,
   r.legal_or_policy_basis,r.owner_id,a?.status||"UNAPPROVED",a?.version||"",a?.inherent_rating||"UNRATED",
   a?.residual_rating||"UNRATED",a?.review_due||"",
   c.length,c.filter(x=>x.status==="VERIFIED").length,c.filter(x=>x.critical&&x.status!=="VERIFIED").length,
   c.map(x=>x.hierarchy+":"+x.status+"("+x.description+")").join("; "),
   acts.filter(x=>x.status!=="VERIFIED").length,
   acts.filter(x=>x.status!=="VERIFIED"&&x.due_on<date).length,
   (incidents||[]).length,(incidents||[]).filter(x=>x.status!=="CLOSED"&&["SERIOUS","CRITICAL"].includes(x.severity)).length,
   dashboard?.ready===true?"YES":"NO"
  ];
  lines.push(values.map(quote).join(","));
 }
 return new NextResponse(lines.join("\r\n")+"\r\n",{headers:{
  "Content-Type":"text/csv; charset=utf-8",
  "Content-Disposition":'attachment; filename="council-risk-register-'+batch+'.csv"',
  "Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"
 }});
}
