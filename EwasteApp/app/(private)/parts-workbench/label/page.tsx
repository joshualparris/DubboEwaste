import Link from "next/link";
import {redirect} from "next/navigation";
import {requireProgrammeContext} from "@/lib/programme-context";
export default async function PartLabel({searchParams}:{searchParams:Promise<{part?:string}>}){
 const {supabase,context}=await requireProgrammeContext();
 if(!context.global_admin&&(context.selected!=="dubbo_ewaste"||!["admin","manager","technician"].includes(context.role||"")))redirect("/dashboard");
 const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const {part}=await searchParams;
 if(!part||!/^[0-9a-f-]{36}$/i.test(part))return <main>Missing part identifier.</main>;
 const {data:p}=await supabase.from("parts").select("id,part_code,part_type,specification,serial,storage_label").eq("id",part).eq("programme","dubbo_ewaste").maybeSingle();
 if(!p)return <main>Part not found or inaccessible.</main>;
 return <main style={{margin:24}}><nav><Link href="/parts-workbench">Back to parts inventory</Link></nav><h1>Printable part identifier</h1><article style={{border:"2px solid",padding:20,display:"inline-block",marginTop:20}}><strong style={{fontSize:24}}>{p.part_code}</strong><p>{p.part_type} · {p.specification}</p><p>Storage: {p.storage_label||"Unassigned"}</p><p>Serial: {p.serial||"Unlabelled"}</p></article><p>Print this page and attach the label to the component bag. Code scanning is not enabled in this version.</p></main>;
}