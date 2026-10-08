"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProgrammeContext } from "@/lib/programme-context";
import { validProgramme } from "@/lib/programmes";
function assetId(form: FormData) { const id=z.string().uuid().safeParse(form.get("asset_id")); if(!id.success) redirect("/assets"); return id.data; }
export async function updateAssetOwner(form: FormData) {
  const id=assetId(form); const {supabase}=await requireProgrammeContext();
  const kind=z.enum(["UNCONFIRMED","PROGRAMME","CUSTOMER","THIRD_PARTY"]).safeParse(form.get("owner_kind"));
  const name=String(form.get("owner_name")||"").trim();
  if(!kind.success||name.length>200) redirect(`/assets/${id}?error=Invalid%20ownership%20details`);
  const {data,error}=await supabase.from("assets").update({owner_kind:kind.data,owner_name:name||null}).eq("id",id).select("id").single();
  if(error||!data) redirect(`/assets/${id}?error=Could%20not%20update%20ownership`);
  revalidatePath(`/assets/${id}`); redirect(`/assets/${id}`);
}
export async function transferAsset(form: FormData) {
  const id=assetId(form); const target=String(form.get("target_programme")||"");
  const reason=String(form.get("reason")||"").trim();
  if(!validProgramme(target)||reason.length<5||reason.length>2000) redirect(`/assets/${id}?error=Choose%20a%20programme%20and%20record%20the%20reason`);
  const {supabase}=await requireProgrammeContext();
  const {error}=await supabase.rpc("transfer_asset_programme",{target_asset:id,target_programme:target,transfer_reason:reason});
  if(error) redirect(`/assets/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/assets");revalidatePath(`/assets/${id}`);redirect("/programmes?error=Transfer%20recorded.%20Choose%20the%20destination%20programme%20to%20open%20the%20item.");
}
