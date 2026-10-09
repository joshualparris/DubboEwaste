import {NextRequest,NextResponse} from "next/server";
import {requireProgrammeContext} from "@/lib/programme-context";
const enc=(v:unknown)=>{const s=String(v??"");return '"'+(/^\s*[=+\-@\t\r]/.test(s)?"'"+s:s).replaceAll('"','""')+'"';};
const cols=["id","data_provider","country","partner_product_category","product_category","brand","year_of_manufacture","repair_status","group_identifier","event_date","problem","barrier_if_end_of_life"];
const status=(s:string|null)=>s==="fixed"?"Fixed":s==="partially_fixed"?"Repairable":s==="not_fixed"?"End of life":s==="referred"?"Repairable":"Unknown";
export async function GET(request:NextRequest){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="repair_cafe"||!["admin","manager"].includes(context.role??"")))
  return NextResponse.json({error:"Coordinator required"},{status:403});
 const year=new URL(request.url).searchParams.get("year")??"";
 if(year&&!/^20\d{2}$/.test(year))return NextResponse.json({error:"Invalid year"},{status:400});
 let ev=supabase.from("repair_cafe_sessions").select("id,event_date").limit(1000);
 if(year)ev=ev.gte("event_date",year+"-01-01").lte("event_date",year+"-12-31");
 const {data:events,error:eventError}=await ev;
 if(eventError)return NextResponse.json({error:eventError.message},{status:500});
 const dates=new Map((events??[]).map(e=>[e.id,e.event_date]));
 const output:string[][]=[];
 // Stable sorted paging. Refuse partial exports rather than silently truncate.
 let index=0,complete=false;
 while(!complete&&index<50000){
  const {data,error}=await supabase.from("repair_cafe_tickets")
   .select("id,event_id,item_category,status,outcome,barrier")
   .in("event_id",[...dates.keys()].length?[...dates.keys()]:["00000000-0000-0000-0000-000000000000"])
   .order("id").range(index,index+499);
  if(error)return NextResponse.json({error:error.message},{status:500});
  for(const t of data??[]){
   if(t.status==="void"||!["completed","referred","not_attempted"].includes(t.status))continue;
   output.push([t.id,"Repair Cafe Dubbo","AU",t.item_category,t.item_category,"","",status(t.outcome),t.event_id,dates.get(t.event_id)??"","",""]);
  }
  index+=(data??[]).length;
  complete=(data??[]).length<500;
 }
 if(!complete)return NextResponse.json({error:"Export exceeded supported range; narrow the year"},{status:413});
 const csv="\uFEFF"+cols.map(enc).join(",")+"\r\n"+output.map(r=>r.map(enc).join(",")).join("\r\n")+"\r\n";
 return new NextResponse(csv,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":'attachment; filename="repair-cafe-open-repair-draft-'+(year||"all")+'.csv"',"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
}
