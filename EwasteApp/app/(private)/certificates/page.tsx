import { ResponsiveTable } from "@/components/ResponsiveTable";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function CertificatesPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const params=await searchParams;
  const supabase=await createClient();
  const {data:certs}=await supabase.from("certificates").select("id,certificate_code,certificate_type,issued_at,assets(asset_code,manufacturer,model)").order("issued_at",{ascending:false});
  return <div className="stack"><div><div className="badge">P0</div><h1>Certificates</h1><p className="muted">Immutable snapshots generated from live operational records.</p></div>
    {params.error?<div className="error">{params.error}</div>:null}
    <section className="card table-wrap"><ResponsiveTable><thead><tr><th>Certificate</th><th>Type</th><th>Asset</th><th>Issued</th></tr></thead><tbody>{(certs??[]).map((c:any)=><tr key={c.id}><td><Link href={`/certificates/${c.id}`}><strong>{c.certificate_code}</strong></Link></td><td>{c.certificate_type}</td><td>{c.assets?.asset_code||"—"} {c.assets ? [c.assets.manufacturer,c.assets.model].filter(Boolean).join(" ") : ""}</td><td>{new Date(c.issued_at).toLocaleString("en-AU")}</td></tr>)}</tbody></ResponsiveTable></section>
  </div>;
}
