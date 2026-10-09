import {NextRequest,NextResponse} from "next/server";
import {requireProgrammeContext} from "@/lib/programme-context";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const safe=(value:unknown)=>{const s=String(value??"");
 const protectedValue=/^[\s]*[=+\-@\t\r]/.test(s)?"'"+s:s;
 return '"'+protectedValue.replaceAll('"','""')+'"';
};
function csv(headers:string[],rows:(string|number|boolean|null|undefined)[][]){
 return "\uFEFF"+headers.map(safe).join(",")+"\r\n"+rows.map(r=>r.map(safe).join(",")).join("\r\n")+"\r\n";
}
export async function GET(request:NextRequest){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role||"")))
  return NextResponse.json({error:"Coordinator access required"},{status:403});
 const u=new URL(request.url),event=u.searchParams.get("event")||"";
 const kind=u.searchParams.get("kind")||"tickets";
 if(event&&!uuid.test(event))return NextResponse.json({error:"Invalid event"},{status:400});
 if(!["tickets","hours","incidents","audit","venue_contacts"].includes(kind))
  return NextResponse.json({error:"Invalid dataset"},{status:400});
 const rows:(string|number|boolean|null|undefined)[][]=[];
 let headers:string[]=[];
 let queryError:string|undefined;
 if(kind==="tickets"){
  headers=["event_id","ticket_number","item_category","item_description","status","outcome","barrier","measured_weight_kg","owner_kept_item","arrived_at","closed_at"];
  let q=supabase.from("repair_cafe_tickets").select(headers.join(",")).order("arrived_at",{ascending:false}).limit(4000);
  if(event)q=q.eq("event_id",event);
  const {data,error}=await q;queryError=error?.message;
  for(const x of (data??[]) as unknown as Record<string,unknown>[])rows.push(headers.map(h=>x[h] as string|number|boolean|null));
 }else if(kind==="hours"){
  headers=["event_id","volunteer_type","volunteer_record_id","check_in_at","check_out_at","completed_hours"];
  let q=supabase.from("repair_cafe_attendance").select("event_id,user_id,manual_volunteer_id,check_in_at,check_out_at").limit(4000);
  if(event)q=q.eq("event_id",event);
  const {data,error}=await q;queryError=error?.message;
  for(const a of data??[]){
   const h=a.check_in_at&&a.check_out_at?Math.max(0,(new Date(a.check_out_at).getTime()-new Date(a.check_in_at).getTime())/3600000):null;
   rows.push([a.event_id,a.manual_volunteer_id?"manual":"account",a.manual_volunteer_id??a.user_id,a.check_in_at,a.check_out_at,h===null?"":h.toFixed(2)]);
  }
 }else if(kind==="incidents"){
  headers=["event_id","severity","state","recorded_at"];
  let q=supabase.from("repair_cafe_incidents").select(headers.join(",")).limit(3000);
  if(event)q=q.eq("event_id",event);
  const {data,error}=await q;queryError=error?.message;
  for(const x of (data??[]) as unknown as Record<string,unknown>[])rows.push(headers.map(h=>x[h] as string|null));
 }else if(kind==="venue_contacts"){
  headers=["event_id","venue_id","contacted_at","method","result","evidence_reference"];
  let q=supabase.from("repair_cafe_venue_contacts").select(headers.join(",")).limit(3000);
  if(event)q=q.eq("event_id",event);
  const {data,error}=await q;queryError=error?.message;
  for(const x of (data??[]) as unknown as Record<string,unknown>[])rows.push(headers.map(h=>x[h] as string|null));
 }else{
  headers=["occurred_at","entity","entity_id","operation","changed_fields"];
  let q=supabase.from("repair_cafe_audit").select("occurred_at,entity,entity_id,operation,changed_fields").order("occurred_at",{ascending:false}).limit(4000);
  if(event)q=q.eq("event_id",event);
  const {data,error}=await q;queryError=error?.message;
  for(const x of data??[])rows.push([x.occurred_at,x.entity,x.entity_id,x.operation,(x.changed_fields||[]).join(";")]);
 }
 if(queryError)return NextResponse.json({error:queryError},{status:500});
 const stamp=new Date().toISOString().slice(0,10);
 return new NextResponse(csv(headers,rows),{headers:{
  "Content-Type":"text/csv; charset=utf-8",
  "Content-Disposition":'attachment; filename="repair-cafe-'+kind+'-'+stamp+'.csv"',
  "Cache-Control":"private, no-store",
  "X-Content-Type-Options":"nosniff"
 }});
}