import Link from "next/link";
import { requireProgrammeContext } from "@/lib/programme-context";
import { SmartIntake } from "@/components/SmartIntake";
export default async function SmartIntakePage({searchParams}:{searchParams:Promise<{job?:string}>}){
  const {job}=await searchParams;
  const {supabase,context}=await requireProgrammeContext();
  if(!context.global_admin || (context.selected!==null && context.selected!=="dubbo_ewaste"))return <p>Smart Intake is available to E-waste administrators.</p>;
  const [{data:jobs,error:j},{data:locations,error:l}]=await Promise.all([
    supabase.from("jobs").select("id,job_code,source_site").eq("programme","dubbo_ewaste").not("status","in",'("CLOSED","CANCELLED")').order("created_at",{ascending:false}),
    supabase.from("locations").select("id,name").eq("programme","dubbo_ewaste").eq("active",true).order("name")
  ]);
  return <div className="stack"><h1>Smart Intake</h1><p className="muted">Turn equipment photos or dictated descriptions into reviewed inventory. Nothing is saved before you confirm.</p><div className="actions"><Link href="/jobs/new" className="button secondary">New inbound job</Link><Link href="/assets/new" className="button secondary">Manual intake</Link><Link href="/assets" className="button secondary">Inventory / QR labels</Link></div>{j||l?<p className="error">Could not load intake context. Refresh and try again.</p>:<SmartIntake jobs={jobs??[]} locations={locations??[]} initialJob={job||""}/>}</div>;
}
