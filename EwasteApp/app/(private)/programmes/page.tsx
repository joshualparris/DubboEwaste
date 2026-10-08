import Link from "next/link";
import { PROGRAMMES } from "@/lib/programmes";
import { requireProgrammeContext } from "@/lib/programme-context";
import { switchProgramme } from "./actions";

export default async function ProgrammesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { context } = await requireProgrammeContext();
  const { error } = await searchParams;
  return <div className="stack"><div><h1>Your programmes</h1><p className="muted">Choose which programme to work in. Your role and records follow that programme.</p></div>
    {error ? <div className="error">{error}</div> : null}
    <p><Link href="/learn">Open shared learning hub</Link></p>
    <div className="grid">{Object.entries(PROGRAMMES).filter(([key]) => context.global_admin || context.memberships.some(m => m.program === key)).map(([key, label]) => <form className="card form" action={switchProgramme} key={key}><h2>{label}</h2><p>Role: {context.global_admin ? "Global admin" : context.memberships.find(m => m.program === key)?.role}</p><input type="hidden" name="programme" value={key}/><button className="button">Open programme</button></form>)}
      {context.global_admin ? <form className="card form" action={switchProgramme}><h2>All programmes</h2><p>Review records across all three. Choose a programme before creating records.</p><input type="hidden" name="programme" value="all"/><button className="button secondary">View everything</button></form> : null}
    </div>
    {!context.global_admin && !context.memberships.length ? <section className="card">You have no active programme membership. Ask a programme admin to grant access.</section> : null}
  </div>;
}
