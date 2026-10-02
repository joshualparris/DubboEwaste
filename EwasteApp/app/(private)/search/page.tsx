import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const term = q.trim().replace(/[,%()]/g, "").slice(0, 120);
  const supabase = await createClient();

  let results: any = null;
  if (term) {
    const like = `%${term}%`;
    const [assets, media, jobs, lots, certs, customers, parts, outbound, capabilities] = await Promise.all([
      supabase.from("assets").select("id,asset_code,serial_imei,manufacturer,model,status").or(`asset_code.ilike.${like},serial_imei.ilike.${like},manufacturer.ilike.${like},model.ilike.${like}`).limit(25),
      supabase.from("media").select("id,media_code,serial,manufacturer,model,data_state,parent_asset_id").or(`media_code.ilike.${like},serial.ilike.${like},manufacturer.ilike.${like},model.ilike.${like}`).limit(25),
      supabase.from("jobs").select("id,job_code,source_site,status").or(`job_code.ilike.${like},source_site.ilike.${like}`).limit(25),
      supabase.from("lots").select("id,lot_code,commodity,status").or(`lot_code.ilike.${like},commodity.ilike.${like}`).limit(25),
      supabase.from("certificates").select("id,certificate_code,certificate_type,status").ilike("certificate_code", like).limit(25),
      supabase.from("customers").select("id,name,contact_name").or(`name.ilike.${like},contact_name.ilike.${like}`).limit(25),
      supabase.from("parts").select("id,part_code,part_type,serial").or(`part_code.ilike.${like},part_type.ilike.${like},serial.ilike.${like}`).limit(25),
      supabase.from("outbound_orders").select("id,outbound_code,bol_reference,status").or(`outbound_code.ilike.${like},bol_reference.ilike.${like}`).limit(25),
      supabase.from("sanitisation_capabilities").select("id,interface,media_families,clear_supported,purge_supported,opal_supported,hpa_dco_check_supported,notes").or(`interface.ilike.${like},notes.ilike.${like}`).limit(25),
    ]);
    results = {
      assets: assets.data ?? [], media: media.data ?? [], jobs: jobs.data ?? [], lots: lots.data ?? [],
      certs: certs.data ?? [], customers: customers.data ?? [], parts: parts.data ?? [], outbound: outbound.data ?? [], capabilities: capabilities.data ?? [],
    };
  }

  const total = results ? Object.values(results).reduce((n: number, rows: any) => n + rows.length, 0) : 0;
  return <div className="stack">
    <div><div className="badge">Global search</div><h1>Find anything</h1><p className="muted">Asset IDs, serials, media, sanitisation capabilities, jobs, lots, certificates, customers, parts, BOLs and outbound orders.</p></div>
    <form className="card search-form"><input name="q" defaultValue={q} autoFocus placeholder="Scan or type an ID, serial, job, lot..." /><button className="button">Search</button></form>
    {term ? <p className="muted">{total} result{total === 1 ? "" : "s"} for <strong>{term}</strong></p> : null}
    {results ? <>
      <Result title="Assets">{results.assets.map((r:any)=><Link className="result-row" key={r.id} href={`/assets/${r.id}`}><strong>{r.asset_code}</strong><span>{[r.manufacturer,r.model].filter(Boolean).join(" ")||"Asset"} · {r.serial_imei||"no serial"} · {r.status}</span></Link>)}</Result>
      <Result title="Media">{results.media.map((r:any)=><Link className="result-row" key={r.id} href="/media"><strong>{r.media_code}</strong><span>{r.serial||"no serial"} · {r.data_state}</span></Link>)}</Result>
      <Result title="Jobs">{results.jobs.map((r:any)=><Link className="result-row" key={r.id} href={`/jobs/${r.id}`}><strong>{r.job_code}</strong><span>{r.source_site||"—"} · {r.status}</span></Link>)}</Result>
      <Result title="Lots">{results.lots.map((r:any)=><Link className="result-row" key={r.id} href="/lots"><strong>{r.lot_code}</strong><span>{r.commodity} · {r.status}</span></Link>)}</Result>
      <Result title="Certificates">{results.certs.map((r:any)=><Link className="result-row" key={r.id} href={`/certificates/${r.id}`}><strong>{r.certificate_code}</strong><span>{r.certificate_type} · {r.status}</span></Link>)}</Result>
      <Result title="Customers">{results.customers.map((r:any)=><Link className="result-row" key={r.id} href="/customers"><strong>{r.name}</strong><span>{r.contact_name||"—"}</span></Link>)}</Result>
      <Result title="Parts">{results.parts.map((r:any)=><Link className="result-row" key={r.id} href="/repairs"><strong>{r.part_code}</strong><span>{r.part_type} · {r.serial||"no serial"}</span></Link>)}</Result>
      <Result title="Outbound">{results.outbound.map((r:any)=><Link className="result-row" key={r.id} href="/recycling"><strong>{r.outbound_code}</strong><span>{r.bol_reference||"no BOL"} · {r.status}</span></Link>)}</Result>
      <Result title="Sanitisation capabilities">{results.capabilities.map((r:any)=><Link className="result-row" key={r.id} href="/processing"><strong>{r.interface}</strong><span>{(r.media_families??[]).join(", ")} · {r.clear_supported?"Clear":"No clear"} · {r.purge_supported?"Purge":"No purge"} · {r.opal_supported?"OPAL":"No OPAL"} · {r.hpa_dco_check_supported?"HPA/DCO checks":"Escalate HPA/DCO"}</span></Link>)}</Result>
    </> : null}
  </div>;
}

function Result({ title, children }: { title: string; children: React.ReactNode[] }) {
  if (!children.length) return null;
  return <section className="card"><h2>{title}</h2><div className="result-list">{children}</div></section>;
}
