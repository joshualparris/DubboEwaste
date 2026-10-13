import { ResponsiveTable } from "@/components/ResponsiveTable";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { resolveException } from "../processing/actions";

export default async function ExceptionsPage({searchParams}:{searchParams:Promise<{view?:string}>}) {
  const params=await searchParams;
  const showOpen=params.view==="open";
  const supabase = await createClient();
  let exceptionQuery=supabase.from("exceptions").select("*");
  if(showOpen) exceptionQuery=exceptionQuery.in("status",["OPEN","IN_REVIEW"]);
  const { data: rows } = await exceptionQuery.order("status").order("severity",{ascending:false}).order("created_at",{ascending:false});
  const open = (rows ?? []).filter((r:any) => !["RESOLVED","WAIVED"].includes(r.status));
  return <div className="stack">
    <div><div className="badge">Exception queue</div><h1>{showOpen?"Open exceptions":"Exceptions"}</h1><p className="muted">Failures and conflicts stay visible until a human resolves or explicitly waives them.</p><p><Link href={showOpen?"/exceptions":"/exceptions?view=open"} className="button secondary">{showOpen?"Show all exceptions":"Show open exceptions"}</Link></p></div>
    <div className="grid"><div className="card"><div className="muted">Open</div><div className="metric">{open.length}</div></div><div className="card"><div className="muted">Critical / high</div><div className="metric">{open.filter((r:any)=>["CRITICAL","HIGH"].includes(r.severity)).length}</div></div></div>
    <section className="card table-wrap"><ResponsiveTable><thead><tr><th>Severity</th><th>Type</th><th>Entity</th><th>Summary</th><th>Status / resolution</th></tr></thead><tbody>
      {(rows??[]).map((r:any)=><tr key={r.id}><td><span className="badge">{r.severity}</span></td><td>{r.exception_type}</td><td>{r.entity_type}<br/><span className="small muted">{r.entity_id}</span></td><td>{r.summary}</td><td>{r.status === "RESOLVED" ? <><strong>RESOLVED</strong><br/><span className="small">{r.resolution}</span></> : <form action={resolveException} className="inline-form"><input type="hidden" name="exception_id" value={r.id}/><input name="resolution" required placeholder="Resolution / evidence note"/><button className="button secondary">Resolve</button></form>}</td></tr>)}
    </tbody></ResponsiveTable></section>
  </div>;
}
