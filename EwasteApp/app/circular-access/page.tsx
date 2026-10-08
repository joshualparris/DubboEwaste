import {redirect} from "next/navigation";
import Link from "next/link";
import {createClient} from "@/lib/supabase/server";

export const metadata={title:"Open Circular Economy Research"};
export const dynamic="force-dynamic";

export default async function CircularResearchAccess(){
 const db=await createClient();
 const {data:{user}}=await db.auth.getUser();
 if(!user) redirect("/login?next=%2Fcircular-access");
 const [{data:profile},{data:membership}]=await Promise.all([
  db.from("profiles").select("active").eq("id",user.id).maybeSingle(),
  db.from("program_access").select("program").eq("user_id",user.id).eq("active",true).limit(1),
 ]);
 if(!profile?.active || !membership?.length) redirect("/login?error=No%20active%20volunteer%20access");
 const {data:ticket,error}=await db.rpc("issue_circular_handoff");
 return <main className="container" style={{maxWidth:"690px",minHeight:"75vh"}}>
  <section className="card stack">
   <div className="badge">Connected community workspaces</div>
   <h1>Circular Economy Research</h1>
   <p>Use your existing volunteer account to open the internal circular-economy research website. There's no second password or research access code to enter.</p>
   {error||typeof ticket!=="string"?
     <div className="error" role="alert">We couldn't make a secure hand-off. Your account may need updated access. <Link href="/learn">Back to Learning Hub</Link></div>:
     <form action="https://circular-economy-dubbo.vercel.app/auth/bridge" method="post" style={{display:"grid",gap:"12px"}}>
       <input type="hidden" name="ticket" value={ticket} autoComplete="off"/>
       <button type="submit" className="button">Continue securely to research →</button>
     </form>}
   <p className="muted small">The hand-off expires after two minutes and works only once. It only creates a research session; it does not give additional operational permissions.</p>
   <Link href="/learn" className="button secondary">Return to learning</Link>
  </section>
 </main>;
}
