import { createClient } from "@/lib/supabase/server";
import { createEnvironmentalMethodology } from "../processing/actions";

export default async function ReportsPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const params=await searchParams;
  const supabase=await createClient();
  const [assets,dispositions,lots,tests,repairs,certs,methodologies] = await Promise.all([
    supabase.from("assets").select("id,status,data_state,created_at"),
    supabase.from("dispositions").select("disposition_type,decided_at"),
    supabase.from("lots").select("gross_weight_kg,tare_weight_kg,status"),
    supabase.from("asset_tests").select("result"),
    supabase.from("repairs").select("status"),
    supabase.from("certificates").select("certificate_type,status"),
    supabase.from("environmental_methodologies").select("*").order("created_at",{ascending:false}),
  ]);
  const assetRows=assets.data??[];
  const disp=dispositions.data??[];
  const lotRows=lots.data??[];
  const testRows=tests.data??[];
  const now=Date.now();
  const ageing=assetRows.filter((a:any)=>!["SOLD","DONATED","RECYCLED","REJECTED"].includes(a.status)).map((a:any)=>Math.floor((now-new Date(a.created_at).getTime())/86400000));
  const avgAge=ageing.length?Math.round(ageing.reduce((a:number,b:number)=>a+b,0)/ageing.length):0;
  const reuse=disp.filter((d:any)=>["REFURBISH","SELL","DONATE"].includes(d.disposition_type)).length;
  const recycled=disp.filter((d:any)=>d.disposition_type==="RECYCLE").length;
  const netKg=lotRows.reduce((n:number,l:any)=>n+Math.max(0,Number(l.gross_weight_kg??0)-Number(l.tare_weight_kg??0)),0);
  const passes=testRows.filter((t:any)=>t.result==="PASS").length;
  const tested=testRows.filter((t:any)=>["PASS","FAIL"].includes(t.result)).length;
  const stageCounts=assetRows.reduce((acc:Record<string,number>,a:any)=>{acc[a.status]=(acc[a.status]||0)+1;return acc;},{});
  return <div className="stack"><div><div className="badge">Reports</div><h1>Operational & environmental reporting</h1><p className="muted">Only measured operational data is shown. No emissions-avoidance claim is calculated unless an explicit versioned methodology is configured.</p></div>
    {params.error?<div className="error">{params.error}</div>:null}
    <div className="grid"><div className="card"><div className="muted">Assets</div><div className="metric">{assetRows.length}</div></div><div className="card"><div className="muted">Reuse-route decisions</div><div className="metric">{reuse}</div></div><div className="card"><div className="muted">Recycle decisions</div><div className="metric">{recycled}</div></div><div className="card"><div className="muted">Tracked lot net mass</div><div className="metric">{netKg.toFixed(1)} kg</div></div><div className="card"><div className="muted">Average open WIP age</div><div className="metric">{avgAge} d</div></div><div className="card"><div className="muted">Test pass rate</div><div className="metric">{tested?Math.round(passes/tested*100):0}%</div></div></div>
    <section className="card"><h2>Stage counts</h2><div className="tag-cloud">{Object.entries(stageCounts).map(([k,v])=><span className="badge" key={k}>{k}: {v}</span>)}</div></section>
    <form action={createEnvironmentalMethodology} className="card form"><h2>Register sustainability methodology</h2><p className="muted">This registry prevents invented or silently changing sustainability claims.</p><div className="two"><label>Name<input name="name" required/></label><label>Version<input name="version" required/></label></div><label>Description<textarea name="description" required/></label><label>Source URL<input name="source_url"/></label><button className="button">Register methodology</button></form>
    <section className="card"><h2>Methodologies</h2>{!(methodologies.data??[]).length?<p className="muted">None configured. AssetFlow will not estimate avoided emissions.</p>:<div className="table-wrap"><table><thead><tr><th>Name</th><th>Version</th><th>Description</th><th>Source</th></tr></thead><tbody>{(methodologies.data??[]).map((m:any)=><tr key={m.id}><td>{m.name}</td><td>{m.version}</td><td>{m.description}</td><td>{m.source_url?<a href={m.source_url} target="_blank" rel="noreferrer">Source</a>:"—"}</td></tr>)}</tbody></table></div>}</section>
    <section className="card"><h2>Evidence registers</h2><p>Repairs: {repairs.data?.length??0} · Certificates: {certs.data?.length??0}</p></section>
  </div>;
}
