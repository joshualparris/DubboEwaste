import { createClient } from "@/lib/supabase/server";
import { createDefectTemplate, createWorkflowRule, createWorkstation } from "./actions";

export default async function ProcessingPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const params=await searchParams;
  const supabase=await createClient();
  const [{data:rules},{data:stations},{data:locations},{data:defectTemplates},{count:wipe},{count:diagnostics},{count:repair}] = await Promise.all([
    supabase.from("workflow_rules").select("*").order("priority"),
    supabase.from("workstations").select("*,locations(name)").order("name"),
    supabase.from("locations").select("id,name").eq("active",true).order("name"),
    supabase.from("defect_templates").select("*").eq("active",true).order("name"),
    supabase.from("media").select("*",{count:"exact",head:true}).in("data_state",["UNWIPED_RESTRICTED","SANITISATION_IN_PROGRESS","SANITISATION_FAILED"]),
    supabase.from("assets").select("*",{count:"exact",head:true}).eq("status","DIAGNOSTICS"),
    supabase.from("assets").select("*",{count:"exact",head:true}).eq("status","REPAIR"),
  ]);
  return <div className="stack">
    <div><div className="badge">Processing control</div><h1>Processing</h1><p className="muted">Queue overview plus first configurable workflow-rule and workstation profiles.</p></div>
    {params.error?<div className="error">{params.error}</div>:null}
    <div className="grid"><div className="card"><div className="muted">Media requiring attention</div><div className="metric">{wipe??0}</div></div><div className="card"><div className="muted">Diagnostics</div><div className="metric">{diagnostics??0}</div></div><div className="card"><div className="muted">Repair</div><div className="metric">{repair??0}</div></div></div>
    <div className="grid">
      <form action={createWorkflowRule} className="card form"><h2>Add workflow rule</h2><label>Name<input name="name" required/></label><label>Priority<input name="priority" type="number" defaultValue="100" required/></label><label>Conditions JSON<textarea name="conditions" defaultValue={'{"data_bearing":true}'}/></label><label>Action JSON<textarea name="action" defaultValue={'{"route":"SANITISATION"}'}/></label><button className="button">Save rule</button></form>
      <form action={createWorkstation} className="card form"><h2>Add workstation</h2><label>Name<input name="name" required placeholder="Wipe Bench 1"/></label><label>Profile<select name="profile_type"><option>RECEIVING</option><option>WIPE</option><option>DIAGNOSTICS</option><option>REPAIR</option><option>GRADING</option><option>PARTS</option><option>OTHER</option></select></label><label>Location<select name="location_id" defaultValue=""><option value="">Unassigned</option>{(locations??[]).map((l:any)=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label><button className="button">Save workstation</button></form>
    </div>
    <form action={createDefectTemplate} className="card form"><h2>Defect / devaluation template</h2><div className="two"><label>Name<input name="name" required/></label><label>Category<input name="category" placeholder="Blank = any"/></label></div><div className="two"><label>Severity<select name="severity" defaultValue="MINOR"><option>COSMETIC</option><option>MINOR</option><option>MAJOR</option><option>CRITICAL</option></select></label><label>Grade penalty<input name="grade_penalty" type="number" min="0" defaultValue="0"/></label></div><div className="two"><label>Fixed value penalty<input name="value_penalty_fixed" type="number" min="0" step="0.01" defaultValue="0"/></label><label>Percent penalty<input name="value_penalty_percent" type="number" min="0" max="100" step="0.1" defaultValue="0"/></label></div><label>Route override<input name="route_override" placeholder="REFURBISH / PARTS / RECYCLE / HOLD"/></label><button className="button secondary">Save defect template</button></form>
    <section className="card"><h2>Defect templates</h2><div className="table-wrap"><table><thead><tr><th>Name</th><th>Category</th><th>Severity</th><th>Grade penalty</th><th>Value penalty</th><th>Route</th></tr></thead><tbody>{(defectTemplates??[]).map((d:any)=><tr key={d.id}><td>{d.name}</td><td>{d.category||"Any"}</td><td>{d.severity}</td><td>{d.grade_penalty}</td><td>{"$"+Number(d.value_penalty_fixed||0).toFixed(2)} + {Number(d.value_penalty_percent||0)}%</td><td>{d.route_override||"—"}</td></tr>)}</tbody></table></div></section>
    <section className="card"><h2>Workflow rules</h2><div className="table-wrap"><table><thead><tr><th>Priority</th><th>Name</th><th>Conditions</th><th>Action</th></tr></thead><tbody>{(rules??[]).map((r:any)=><tr key={r.id}><td>{r.priority}</td><td>{r.name}</td><td className="small">{JSON.stringify(r.conditions)}</td><td className="small">{JSON.stringify(r.action)}</td></tr>)}</tbody></table></div></section>
    <section className="card"><h2>Workstations</h2><div className="table-wrap"><table><thead><tr><th>Name</th><th>Profile</th><th>Location</th></tr></thead><tbody>{(stations??[]).map((s:any)=><tr key={s.id}><td>{s.name}</td><td>{s.profile_type}</td><td>{s.locations?.name||"—"}</td></tr>)}</tbody></table></div></section>
  </div>;
}
