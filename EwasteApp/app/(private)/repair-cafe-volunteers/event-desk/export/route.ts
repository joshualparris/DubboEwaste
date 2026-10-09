import {NextResponse} from "next/server";
import {requireProgrammeContext} from "@/lib/programme-context";

// De-identified ticket outcomes only; no visitor labels, contact details,
// fault narratives, free-text repair notes or volunteer names leave in exports.
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const csv=(value:unknown)=>{
 const str=value===null||value===undefined?"":String(value);
 const escaped=/^\s*[=+\-@\t\r]/.test(str)?"'"+str:str;
 return '"'+escaped.replace(/"/g,'""')+'"';
};

export async function GET(request:Request){
 const {context,supabase}=await requireProgrammeContext();
 if(!context.global_admin&&
   (context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role??"")))
  return new NextResponse("Repair Café coordinator access required",{status:403});
 const raw=new URL(request.url).searchParams.get("event")??"";
 if(!uuid.test(raw))return new NextResponse("Choose a valid event",{status:400});
 const {data:event,error:eventError}=await supabase.from("repair_cafe_sessions")
  .select("id,event_date,title,deleted_at").eq("id",raw).maybeSingle();
 if(eventError)return new NextResponse("Unable to load event",{status:500});
 if(!event||event.deleted_at)return new NextResponse("Event not found",{status:404});
 const all:Record<string,unknown>[]=[];
 for(let offset=0;offset<5000;offset+=500){
  const {data,error,count}=await supabase.from("repair_cafe_tickets")
   .select("ticket_number,item_category,risk_level,status,outcome,barrier,measured_weight_kg,owner_kept_item,arrived_at,closed_at",{count:offset===0?"exact":undefined})
   .eq("event_id",raw).order("ticket_number",{ascending:true}).range(offset,offset+499);
  if(error)return new NextResponse("Could not export verified event data",{status:500});
  if(offset===0&&(count??0)>5000)return new NextResponse("More than 5000 tickets. Use a paged export.",{status:409});
  all.push(...(data??[]));
  if((data??[]).length<500)break;
 }
 const header=["Session date","Queue number","Item category","Safety classification","Repair status",
  "Outcome","Repair barrier","Measured weight kg (only if recorded)","Item remained with owner","Arrived UTC","Closed UTC"];
 const rows=all.map(t=>[
  event.event_date,t.ticket_number,t.item_category,t.risk_level,t.status,
  t.outcome,t.barrier,t.measured_weight_kg,t.owner_kept_item,t.arrived_at,t.closed_at
 ].map(csv).join(","));
 const body="\ufeff"+[header.map(csv).join(","),...rows].join("\r\n")+"\r\n";
 return new NextResponse(body,{
  headers:{
   "Content-Type":"text/csv; charset=utf-8",
   "Content-Disposition":"attachment; filename=repair-cafe-"+event.event_date+"-outcomes.csv",
   "Cache-Control":"private, no-store",
   "X-Content-Type-Options":"nosniff"
  }
 });
}
