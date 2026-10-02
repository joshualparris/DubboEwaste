import { createClient } from "@/lib/supabase/server";

export default async function VerifyCertificatePage({params}:{params:Promise<{token:string}>}) {
  const {token}=await params;
  const supabase=await createClient();
  const {data:record}=await supabase.from("public_certificate_verification").select("*").eq("verification_token",token).maybeSingle();
  return <main className="login-wrap"><section className="login-card">
    <div className="badge">AssetFlow verification</div>
    <h1>{record?"Certificate verified":"Certificate not found"}</h1>
    {record?<><p><strong>{record.certificate_code}</strong></p><p>Type: {record.certificate_type}</p><p>Status: {record.status}</p><p>Issued: {new Date(record.issued_at).toLocaleString("en-AU")}</p><p className="small muted">Snapshot SHA-256: {record.snapshot_sha256||"Not recorded"}</p><p>{record.public_summary?.asset_code?<>Asset: <strong>{record.public_summary.asset_code}</strong></>:""}</p></>:<p className="muted">The token is invalid, revoked from publication, or was never issued by this AssetFlow instance.</p>}
  </section></main>;
}
