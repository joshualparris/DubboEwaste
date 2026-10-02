"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const optionalUuid = z.preprocess((v) => v === "" || v == null ? undefined : v, z.string().uuid().optional());
const optionalNumber = z.preprocess((v) => v === "" || v == null ? undefined : Number(v), z.number().nonnegative().optional());

async function ctx() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

async function event(
  supabase: Awaited<ReturnType<typeof createClient>>,
  actorId: string,
  entityType: string,
  entityId: string,
  eventType: string,
  details: Record<string, unknown> = {},
) {
  await supabase.from("operational_events").insert({
    entity_type: entityType,
    entity_id: entityId,
    event_type: eventType,
    actor_id: actorId,
    details,
  });
}

function splitList(value: string | undefined) {
  return (value ?? "")
    .split(/[\n,]+/)
    .map((x)=>x.trim())
    .filter(Boolean);
}

export async function recordAuthority(formData: FormData) {
  const parsed = z.object({
    asset_id: z.string().uuid(),
    authority_type: z.enum([
      "OWNER_TRANSFER","DONATION","BUSINESS_DISPOSAL_AUTHORITY","REPAIR_CUSTODY","PERSONAL_PROPERTY","OTHER",
    ]),
    source_party: z.string().trim().max(240).optional(),
    reference: z.string().trim().max(240).optional(),
    evidence_id: optionalUuid,
    notes: z.string().trim().max(3000).optional(),
  }).safeParse(Object.fromEntries(formData));

  if (!parsed.success) redirect("/assets?error=Invalid%20authority%20record");
  const { supabase, user } = await ctx();

  const { error } = await supabase.from("asset_authority_records").insert({
    asset_id: parsed.data.asset_id,
    authority_type: parsed.data.authority_type,
    source_party: parsed.data.source_party || null,
    reference: parsed.data.reference || null,
    evidence_id: parsed.data.evidence_id || null,
    notes: parsed.data.notes || null,
    created_by: user.id,
  });
  if (error) redirect(`/assets/${parsed.data.asset_id}?error=${encodeURIComponent(error.message)}`);

  await supabase.from("assets").update({ ownership_verified: true }).eq("id", parsed.data.asset_id);
  await event(supabase,user.id,"asset",parsed.data.asset_id,"AUTHORITY_RECORDED",{
    authority_type: parsed.data.authority_type,
    source_party: parsed.data.source_party || null,
    reference: parsed.data.reference || null,
  });

  revalidatePath(`/assets/${parsed.data.asset_id}`);
  revalidatePath("/workflow");
}

export async function recordTriage(formData: FormData) {
  const parsed = z.object({
    asset_id: z.string().uuid(),
    safety_state: z.enum(["SAFE","HOLD","UNSAFE"]),
    battery_state: z.enum(["OK","UNKNOWN","DAMAGED","SWOLLEN","MISSING","NOT_APPLICABLE"]),
    lock_state: z.enum(["CLEAR","UNKNOWN","LOCKED","NOT_APPLICABLE"]),
    physical_state: z.enum(["GOOD","FAIR","POOR","UNSAFE"]),
    decision: z.enum(["ACCEPT","HOLD","REJECT"]),
    notes: z.string().trim().max(3000).optional(),
  }).safeParse(Object.fromEntries(formData));

  if (!parsed.success) redirect("/assets?error=Invalid%20triage%20record");
  const { supabase, user } = await ctx();
  const { data: asset } = await supabase
    .from("assets")
    .select("id,data_bearing,data_state,ownership_verified")
    .eq("id",parsed.data.asset_id)
    .single();

  if (!asset?.ownership_verified) {
    redirect(`/assets/${parsed.data.asset_id}?error=Record%20ownership%20authority%20before%20triage`);
  }

  const { error } = await supabase.from("asset_triage_assessments").insert({
    ...parsed.data,
    notes: parsed.data.notes || null,
    created_by: user.id,
  });
  if (error) redirect(`/assets/${parsed.data.asset_id}?error=${encodeURIComponent(error.message)}`);

  if (parsed.data.decision === "REJECT") {
    await supabase.from("assets").update({status:"REJECTED"}).eq("id",parsed.data.asset_id);
    await supabase.from("dispositions").insert({
      asset_id: parsed.data.asset_id,
      disposition_type: "REJECT",
      destination: null,
      notes: parsed.data.notes || "Rejected at intake triage",
      decided_by: user.id,
    });
  } else if (parsed.data.decision === "HOLD") {
    await supabase.from("assets").update({status:"HOLD"}).eq("id",parsed.data.asset_id);
    const { data: existing } = await supabase
      .from("asset_quarantines")
      .select("id")
      .eq("asset_id",parsed.data.asset_id)
      .eq("status","OPEN")
      .maybeSingle();

    if (!existing) {
      const reasonType =
        ["DAMAGED","SWOLLEN"].includes(parsed.data.battery_state) ? "BATTERY" :
        parsed.data.safety_state === "UNSAFE" ? "SAFETY" :
        parsed.data.physical_state === "UNSAFE" ? "PHYSICAL_DAMAGE" :
        ["LOCKED","UNKNOWN"].includes(parsed.data.lock_state) ? "LOCK" :
        "OTHER";
      await supabase.from("asset_quarantines").insert({
        asset_id: parsed.data.asset_id,
        reason_type: reasonType,
        reason: parsed.data.notes || `Triage HOLD: safety=${parsed.data.safety_state}, battery=${parsed.data.battery_state}, lock=${parsed.data.lock_state}, physical=${parsed.data.physical_state}`,
        opened_by: user.id,
        created_by: user.id,
      });
    }
  } else {
    const nextStatus =
      !asset.data_bearing || asset.data_state === "NON_DATA_BEARING" || asset.data_state === "VERIFIED_CLEARED"
        ? "DIAGNOSTICS"
        : "UNWIPED_RESTRICTED";
    await supabase.from("assets").update({status:nextStatus}).eq("id",parsed.data.asset_id);
  }

  await event(supabase,user.id,"asset",parsed.data.asset_id,"TRIAGE_RECORDED",{
    decision: parsed.data.decision,
    safety_state: parsed.data.safety_state,
    battery_state: parsed.data.battery_state,
    lock_state: parsed.data.lock_state,
    physical_state: parsed.data.physical_state,
  });

  revalidatePath(`/assets/${parsed.data.asset_id}`);
  revalidatePath("/workflow");
  revalidatePath("/dashboard");
}

export async function openQuarantine(formData: FormData) {
  const parsed = z.object({
    asset_id: z.string().uuid(),
    reason_type: z.enum(["BATTERY","DATA","OWNERSHIP","LOCK","PHYSICAL_DAMAGE","CONTAMINATION","SAFETY","OTHER"]),
    reason: z.string().trim().min(2).max(3000),
    location_id: optionalUuid,
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/assets?error=Invalid%20quarantine%20record");

  const { supabase, user } = await ctx();
  const { error } = await supabase.from("asset_quarantines").insert({
    asset_id: parsed.data.asset_id,
    reason_type: parsed.data.reason_type,
    reason: parsed.data.reason,
    location_id: parsed.data.location_id || null,
    opened_by: user.id,
    created_by: user.id,
  });
  if (error) redirect(`/assets/${parsed.data.asset_id}?error=${encodeURIComponent(error.message)}`);

  const update: Record<string,unknown> = {status:"HOLD"};
  if (parsed.data.location_id) update.location_id = parsed.data.location_id;
  await supabase.from("assets").update(update).eq("id",parsed.data.asset_id);
  await event(supabase,user.id,"asset",parsed.data.asset_id,"QUARANTINE_OPENED",{
    reason_type: parsed.data.reason_type,
    reason: parsed.data.reason,
  });

  revalidatePath(`/assets/${parsed.data.asset_id}`);
  revalidatePath("/workflow");
}

export async function releaseQuarantine(formData: FormData) {
  const parsed = z.object({
    quarantine_id: z.string().uuid(),
    asset_id: z.string().uuid(),
    release_notes: z.string().trim().min(2).max(3000),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/assets");

  const { supabase, user } = await ctx();
  const now = new Date().toISOString();
  const { error } = await supabase.from("asset_quarantines").update({
    status:"RELEASED",
    released_by:user.id,
    released_at:now,
    release_notes:parsed.data.release_notes,
  }).eq("id",parsed.data.quarantine_id).eq("status","OPEN");
  if (error) redirect(`/assets/${parsed.data.asset_id}?error=${encodeURIComponent(error.message)}`);

  const [{data:asset},{data:triage}] = await Promise.all([
    supabase.from("assets").select("data_bearing,data_state").eq("id",parsed.data.asset_id).single(),
    supabase.from("asset_triage_assessments").select("decision").eq("asset_id",parsed.data.asset_id).order("created_at",{ascending:false}).limit(1).maybeSingle(),
  ]);

  const nextStatus =
    triage?.decision !== "ACCEPT" ? "TRIAGE" :
    !asset?.data_bearing || ["NON_DATA_BEARING","VERIFIED_CLEARED"].includes(String(asset?.data_state))
      ? "DIAGNOSTICS"
      : "UNWIPED_RESTRICTED";

  await supabase.from("assets").update({status:nextStatus}).eq("id",parsed.data.asset_id);
  await event(supabase,user.id,"asset",parsed.data.asset_id,"QUARANTINE_RELEASED",{release_notes:parsed.data.release_notes});

  revalidatePath(`/assets/${parsed.data.asset_id}`);
  revalidatePath("/workflow");
}

export async function updateAssetIdentity(formData: FormData) {
  const parsed = z.object({
    asset_id: z.string().uuid(),
    manufacturer: z.string().trim().min(1).max(100),
    model: z.string().trim().min(1).max(160),
    serial_imei: z.string().trim().max(160).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/assets");

  const { supabase, user } = await ctx();
  const { error } = await supabase.from("assets").update({
    manufacturer:parsed.data.manufacturer,
    model:parsed.data.model,
    serial_imei:parsed.data.serial_imei || null,
  }).eq("id",parsed.data.asset_id);
  if (error) redirect(`/assets/${parsed.data.asset_id}?error=${encodeURIComponent(error.message)}`);

  await event(supabase,user.id,"asset",parsed.data.asset_id,"IDENTITY_UPDATED",{
    manufacturer:parsed.data.manufacturer,
    model:parsed.data.model,
  });
  revalidatePath(`/assets/${parsed.data.asset_id}`);
  revalidatePath("/workflow");
}

export async function completeRepair(formData: FormData) {
  const parsed = z.object({
    repair_id: z.string().uuid(),
    asset_id: z.string().uuid(),
    actual_labour_minutes: z.preprocess((v)=>Number(v),z.number().int().nonnegative()),
    actual_parts_cost: z.preprocess((v)=>Number(v),z.number().nonnegative()),
    actions: z.string().trim().min(2).max(5000),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/repairs?error=Invalid%20repair%20completion");

  const { supabase, user } = await ctx();
  const { error } = await supabase.from("repairs").update({
    status:"COMPLETED",
    actual_labour_minutes:parsed.data.actual_labour_minutes,
    actual_parts_cost:parsed.data.actual_parts_cost,
    actions:parsed.data.actions,
    technician_id:user.id,
    completed_at:new Date().toISOString(),
  }).eq("id",parsed.data.repair_id).eq("asset_id",parsed.data.asset_id);
  if (error) redirect(`/repairs?error=${encodeURIComponent(error.message)}`);

  await supabase.from("assets").update({status:"DIAGNOSTICS"}).eq("id",parsed.data.asset_id);
  await event(supabase,user.id,"asset",parsed.data.asset_id,"REPAIR_COMPLETED",{
    repair_id:parsed.data.repair_id,
    actual_labour_minutes:parsed.data.actual_labour_minutes,
    actual_parts_cost:parsed.data.actual_parts_cost,
  });
  revalidatePath("/repairs");
  revalidatePath(`/assets/${parsed.data.asset_id}`);
  revalidatePath("/workflow");
}

const providerSchema = z.object({
  name: z.string().trim().min(2).max(200),
  abn: z.string().trim().max(40).optional(),
  website: z.string().trim().url().optional().or(z.literal("")),
  provider_type: z.enum(["RECYCLER","ITAD","COUNCIL","STEWARDSHIP","SOCIAL_REUSE","BATTERY","OTHER"]),
  verification_status: z.enum(["RESEARCH_LEAD","CONTACTED","TERMS_RECEIVED","CONFIRMED","NOT_SUITABLE"]),
  contact_name: z.string().trim().max(160).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(80).optional(),
  address: z.string().trim().max(500).optional(),
  accepted_streams: z.string().trim().max(3000).optional(),
  commercial_terms: z.string().trim().max(3000).optional(),
  pricing_notes: z.string().trim().max(3000).optional(),
  minimum_quantity: z.string().trim().max(1000).optional(),
  lithium_policy: z.string().trim().max(3000).optional(),
  crt_policy: z.string().trim().max(3000).optional(),
  documentation_available: z.string().trim().max(3000).optional(),
  certifications: z.string().trim().max(3000).optional(),
  ntcrs_relationship: z.string().trim().max(3000).optional(),
  first_downstream_facility: z.string().trim().max(1000).optional(),
  confirmation_source: z.string().trim().max(2000).optional(),
  capabilities: z.string().trim().max(3000).optional(),
  evidence_requirements: z.string().trim().max(3000).optional(),
});

function providerPayload(data: z.infer<typeof providerSchema>) {
  return {
    ...data,
    website:data.website || null,
    contact_name:data.contact_name || null,
    email:data.email || null,
    phone:data.phone || null,
    address:data.address || null,
    accepted_streams:splitList(data.accepted_streams),
    commercial_terms:data.commercial_terms || null,
    pricing_notes:data.pricing_notes || null,
    minimum_quantity:data.minimum_quantity || null,
    lithium_policy:data.lithium_policy || null,
    crt_policy:data.crt_policy || null,
    documentation_available:data.documentation_available || null,
    certifications:data.certifications || null,
    ntcrs_relationship:data.ntcrs_relationship || null,
    first_downstream_facility:data.first_downstream_facility || null,
    confirmation_source:data.confirmation_source || null,
    capabilities:data.capabilities || null,
    evidence_requirements:data.evidence_requirements || null,
    last_confirmed_at:data.verification_status === "CONFIRMED" ? new Date().toISOString() : null,
  };
}

export async function createDownstreamProvider(formData: FormData) {
  const parsed=providerSchema.safeParse(Object.fromEntries(formData));
  if(!parsed.success) redirect("/recycling?error=Check%20downstream%20provider%20fields");
  const {supabase,user}=await ctx();
  const {error}=await supabase.from("downstream_vendors").insert({
    ...providerPayload(parsed.data),
    created_by:user.id,
  });
  if(error) redirect(`/recycling?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/recycling");
}

export async function updateDownstreamProvider(formData: FormData) {
  const vendorId=String(formData.get("vendor_id") ?? "");
  const parsed=providerSchema.safeParse(Object.fromEntries(formData));
  if(!z.string().uuid().safeParse(vendorId).success || !parsed.success) redirect("/recycling?error=Check%20downstream%20provider%20fields");
  const {supabase}=await ctx();
  const {error}=await supabase.from("downstream_vendors").update(providerPayload(parsed.data)).eq("id",vendorId);
  if(error) redirect(`/recycling?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/recycling");
}

export async function addAssetToPallet(formData: FormData) {
  const parsed=z.object({asset_id:z.string().uuid(),pallet_id:z.string().uuid()}).safeParse(Object.fromEntries(formData));
  if(!parsed.success) redirect("/recycling?error=Invalid%20asset%2Fpallet");
  const {supabase,user}=await ctx();
  const {error}=await supabase.from("pallet_contents").insert({
    pallet_id:parsed.data.pallet_id,entity_type:"ASSET",entity_id:parsed.data.asset_id,added_by:user.id,
  });
  if(error) redirect(`/recycling?error=${encodeURIComponent(error.message)}`);
  await event(supabase,user.id,"asset",parsed.data.asset_id,"ADDED_TO_PALLET",{pallet_id:parsed.data.pallet_id});
  revalidatePath("/recycling");
}

export async function addAssetToOutbound(formData: FormData) {
  const parsed=z.object({
    asset_id:z.string().uuid(),
    outbound_order_id:z.string().uuid(),
    weight_kg:optionalNumber,
  }).safeParse(Object.fromEntries(formData));
  if(!parsed.success) redirect("/recycling?error=Invalid%20outbound%20content");
  const {supabase,user}=await ctx();

  const {data:disp}=await supabase.from("dispositions")
    .select("disposition_type")
    .eq("asset_id",parsed.data.asset_id)
    .order("decided_at",{ascending:false})
    .limit(1)
    .maybeSingle();
  if(disp?.disposition_type!=="RECYCLE"){
    redirect("/recycling?error=Asset%20must%20have%20a%20RECYCLE%20disposition%20before%20outbound");
  }

  const {error}=await supabase.from("outbound_contents").insert({
    outbound_order_id:parsed.data.outbound_order_id,
    entity_type:"ASSET",
    entity_id:parsed.data.asset_id,
    weight_kg:parsed.data.weight_kg ?? null,
    created_by:user.id,
  });
  if(error) redirect(`/recycling?error=${encodeURIComponent(error.message)}`);

  await supabase.from("assets").update({status:"OUTBOUND"}).eq("id",parsed.data.asset_id);
  await event(supabase,user.id,"asset",parsed.data.asset_id,"OUTBOUND_ATTACHED",{outbound_order_id:parsed.data.outbound_order_id});
  revalidatePath("/recycling");
  revalidatePath(`/assets/${parsed.data.asset_id}`);
  revalidatePath("/workflow");
}

export async function addPalletToOutbound(formData: FormData) {
  const parsed=z.object({pallet_id:z.string().uuid(),outbound_order_id:z.string().uuid(),weight_kg:optionalNumber})
    .safeParse(Object.fromEntries(formData));
  if(!parsed.success) redirect("/recycling?error=Invalid%20pallet%20outbound");
  const {supabase,user}=await ctx();
  const {error}=await supabase.from("outbound_contents").insert({
    outbound_order_id:parsed.data.outbound_order_id,
    entity_type:"PALLET",
    entity_id:parsed.data.pallet_id,
    weight_kg:parsed.data.weight_kg ?? null,
    created_by:user.id,
  });
  if(error) redirect(`/recycling?error=${encodeURIComponent(error.message)}`);
  await supabase.from("pallets").update({status:"OUTBOUND"}).eq("id",parsed.data.pallet_id);
  revalidatePath("/recycling");
}

export async function completeOutbound(formData: FormData) {
  const parsed=z.object({
    outbound_order_id:z.string().uuid(),
    scale_weight_kg:optionalNumber,
    received_confirmation:z.string().trim().min(2).max(3000),
  }).safeParse(Object.fromEntries(formData));
  if(!parsed.success) redirect("/recycling?error=Invalid%20outbound%20completion");

  const {supabase,user}=await ctx();
  const now=new Date().toISOString();
  const {error}=await supabase.from("outbound_orders").update({
    status:"RECEIVED",
    pickup_at:now,
    scale_weight_kg:parsed.data.scale_weight_kg ?? null,
    received_confirmation:parsed.data.received_confirmation,
  }).eq("id",parsed.data.outbound_order_id);
  if(error) redirect(`/recycling?error=${encodeURIComponent(error.message)}`);

  const {data:contents}=await supabase.from("outbound_contents")
    .select("entity_type,entity_id")
    .eq("outbound_order_id",parsed.data.outbound_order_id);

  const assetIds=new Set<string>();
  const palletIds=(contents??[]).filter((x)=>x.entity_type==="PALLET").map((x)=>x.entity_id);
  for(const row of (contents??[])) if(row.entity_type==="ASSET") assetIds.add(row.entity_id);

  if(palletIds.length){
    const {data:palletContents}=await supabase.from("pallet_contents")
      .select("entity_type,entity_id")
      .in("pallet_id",palletIds)
      .is("removed_at",null);
    for(const row of (palletContents??[])) if(row.entity_type==="ASSET") assetIds.add(row.entity_id);
  }

  for(const assetId of assetIds){
    const {data:disp}=await supabase.from("dispositions")
      .select("disposition_type")
      .eq("asset_id",assetId)
      .order("decided_at",{ascending:false})
      .limit(1)
      .maybeSingle();
    if(disp?.disposition_type==="RECYCLE"){
      await supabase.from("assets").update({status:"RECYCLED"}).eq("id",assetId);
      await event(supabase,user.id,"asset",assetId,"RECYCLING_CONFIRMED",{
        outbound_order_id:parsed.data.outbound_order_id,
        confirmation:parsed.data.received_confirmation,
      });
      revalidatePath(`/assets/${assetId}`);
    }
  }

  revalidatePath("/recycling");
  revalidatePath("/workflow");
  revalidatePath("/dashboard");
}
