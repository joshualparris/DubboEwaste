import Link from "next/link";
import { redirect } from "next/navigation";
import { PROGRAMMES, PROGRAMME_ROLES } from "@/lib/programmes";
import { requireProgrammeContext } from "@/lib/programme-context";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { saveMembership, rotateSignupCode } from "./actions";

export default async function ProgrammeAdminPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const { supabase, context } = await requireProgrammeContext();
  const managed = Object.entries(PROGRAMMES).filter(([p]) => context.global_admin || context.memberships.some(m => m.program === p && m.role === "admin"));
  if (!managed.length) redirect("/programmes");
  const [{ data: staff }, { data: memberships }] = await Promise.all([supabase.from("profiles").select("id,full_name,email,active").eq("active",true).order("full_name"), supabase.from("program_access").select("user_id,program,programme_role,active")]);
  const { error, success } = await searchParams;
  return <div className="stack"><div><h1>Programme memberships</h1><p className="muted">Programme admins manage their own team. Global admins manage all three. A programme admin role never grants global administration.</p></div>
    {context.global_admin ? <p><Link href="/admin/permissions">Global account administration</Link> · Only the global account admin role grants access across all programmes.</p> : null}
    {error ? <div className="error">{error}</div> : null}{success ? <div className="success">{success}</div> : null}
    {managed.map(([programme,label]) => <section className="card stack" key={programme}><h2>{label}</h2>
      <form action={saveMembership} className="form"><input type="hidden" name="programme" value={programme}/>
        <label>Staff member<select name="user_id" required>{(staff || []).map(p => <option key={p.id} value={p.id}>{p.full_name || p.email || p.id}</option>)}</select></label>
        <label>Programme role<select name="programme_role" defaultValue="volunteer">{PROGRAMME_ROLES.map(r => <option key={r}>{r}</option>)}</select></label>
        <label className="checkbox-label"><input type="checkbox" name="enabled" defaultChecked/>Active membership</label><button className="button">Save membership</button>
      </form>
      <div className="table-wrap"><ResponsiveTable><thead><tr><th>Staff</th><th>Role</th><th>Access</th></tr></thead><tbody>{(memberships || []).filter(m => m.program === programme).map(m => <tr key={m.user_id}><td>{staff?.find(p => p.id === m.user_id)?.full_name || m.user_id}</td><td>{m.programme_role}</td><td>{m.active ? "Active" : "Disabled"}</td></tr>)}</tbody></ResponsiveTable></div>
      <details><summary>Set or rotate volunteer signup code</summary><form action={rotateSignupCode} className="form"><input type="hidden" name="programme" value={programme}/><p className="muted">New accounts using this code receive volunteer access to this programme only. Existing memberships are unaffected.</p><label>New access code<input type="password" name="new_code" minLength={10} required autoComplete="new-password"/></label><button className="button secondary">Save signup code</button></form></details>
    </section>)}
  </div>;
}
