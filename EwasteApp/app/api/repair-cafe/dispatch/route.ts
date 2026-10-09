import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
export const runtime="nodejs";
export const dynamic="force-dynamic";

type Job={id:string;channel:"email"|"sms";destination:string;subject:string;message:string;attempt_count:number};
async function deliver(job:Job){
 if(job.channel==="email"){
  const key=process.env.RESEND_API_KEY,from=process.env.REPAIR_CAFE_FROM_EMAIL;
  if(!key||!from)throw Error("Email provider is not configured");
  const r=await fetch("https://api.resend.com/emails",{
   method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json",
    "Idempotency-Key":"repair-cafe-"+job.id},
   body:JSON.stringify({from,to:[job.destination],subject:job.subject||"Repair Café Dubbo",
    text:job.message})
  });
  if(!r.ok)throw Error("Email provider HTTP "+r.status+": "+(await r.text()).slice(0,140));
 }else{
  const account=process.env.TWILIO_ACCOUNT_SID,token=process.env.TWILIO_AUTH_TOKEN,from=process.env.TWILIO_FROM_NUMBER;
  if(!account||!token||!from)throw Error("SMS provider is not configured");
  const body=new URLSearchParams({From:from,To:job.destination,Body:job.message});
  const r=await fetch("https://api.twilio.com/2010-04-01/Accounts/"+encodeURIComponent(account)+"/Messages.json",{
   method:"POST",headers:{"Authorization":"Basic "+Buffer.from(account+":"+token).toString("base64"),
    "Content-Type":"application/x-www-form-urlencoded"},body:body.toString()
  });
  if(!r.ok)throw Error("SMS provider HTTP "+r.status+": "+(await r.text()).slice(0,140));
 }
}
export async function GET(request:NextRequest){
 const secret=process.env.CRON_SECRET;
 // Fail closed until the organiser configures a cron secret.
 if(!secret)return NextResponse.json({error:"Dispatcher secret is not configured"},{status:503});
 if(request.headers.get("authorization")!=="Bearer "+secret)
  return NextResponse.json({error:"Unauthorised"},{status:401});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL||process.env.SUPABASE_URL;
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return NextResponse.json({error:"Service role not configured"},{status:503});
 const channels:string[]=[];
 if(process.env.RESEND_API_KEY&&process.env.REPAIR_CAFE_FROM_EMAIL)channels.push("email");
 if(process.env.TWILIO_ACCOUNT_SID&&process.env.TWILIO_AUTH_TOKEN&&process.env.TWILIO_FROM_NUMBER)channels.push("sms");
 if(!channels.length)return NextResponse.json({error:"No mail or SMS provider configured; no messages sent"},{status:503});
 const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:jobs,error:claimError}=await db.rpc("repair_cafe_claim_notifications",{p_limit:20,p_channels:channels});
 if(claimError)return NextResponse.json({error:"Unable to claim queued notifications"},{status:500});
 let sent=0,failed=0;
 for(const job of (jobs??[]) as Job[]){
  try{
   await deliver(job);
   const {error}=await db.from("repair_cafe_notifications").update({
    state:"sent",last_error:"",sent_at:new Date().toISOString()
   }).eq("id",job.id).eq("state","sending");
   if(error)throw Error("Delivery succeeded but status update failed; check provider before retrying");
   sent++;
  }catch(e){
   failed++;
   const reason=e instanceof Error?e.message:"Delivery failed";
   // Three attempts then stop. A failed row requires deliberate coordinator review.
   await db.from("repair_cafe_notifications").update({
    state:job.attempt_count>=3?"failed":"pending",
    last_error:reason.slice(0,300),
    scheduled_for:new Date(Date.now()+60*60*1000).toISOString()
   }).eq("id",job.id).eq("state","sending");
  }
 }
 return NextResponse.json({processed:(jobs??[]).length,sent,failed,providers:channels},{
  headers:{"Cache-Control":"no-store"}});
}