"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const optionalUuid = z.preprocess((v) => v === "" || v == null ? undefined : v, z.string().uuid().optional());

const intakeSchema = z.object({
  programme: z.enum(["dubbo_ewaste","library_of_things","repair_cafe"]),
  owner_kind: z.enum(["UNCONFIRMED","PROGRAMME","CUSTOMER","THIRD_PARTY"]),
  owner_name: z.string().trim().max(200).optional(),
  category: z.enum(["LAPTOP","DESKTOP","PHONE","TABLET","CHROMEBOOK","MONITOR","TV","NETWORKING","PRINTER","PARTS","OTHER"]),
  manufacturer: z.string().trim().max(100).optional(),
  model: z.string().trim().max(160).optional(),
  serial_imei: z.string().trim().max(160).optional(),
  product_barcode: z.string().trim().max(180).optional(),
  barcode_lookup_source: z.string().trim().max(120).optional(),
  barcode_lookup_url: z.string().trim().max(600).optional(),
  source_name: z.string().trim().max(200).optional(),
  customer_id: optionalUuid,
  job_id: optionalUuid,
  lot_id: optionalUuid,
  location_id: optionalUuid,
  ownership_verified: z.enum(["yes","no"]),
  data_bearing: z.enum(["yes","no"]),
  initial_route: z.enum(["REFURBISH","PARTS","DONATE","RECYCLE","HOLD"]),
  notes: z.string().trim().max(4000).optional(),
});

export async function createAsset(formData: FormData) {
  const parsed = intakeSchema.safeParse({
    programme: formData.get("programme"),
    owner_kind: formData.get("owner_kind"),
    owner_name: formData.get("owner_name") || undefined,
    category: formData.get("category"),
    manufacturer: formData.get("manufacturer") || undefined,
    model: formData.get("model") || undefined,
    serial_imei: formData.get("serial_imei") || undefined,
    product_barcode: formData.get("product_barcode") || undefined,
    barcode_lookup_source: formData.get("barcode_lookup_source") || undefined,
    barcode_lookup_url: formData.get("barcode_lookup_url") || undefined,
    source_name: formData.get("source_name") || undefined,
    customer_id: formData.get("customer_id"),
    job_id: formData.get("job_id"),
    lot_id: formData.get("lot_id"),
    location_id: formData.get("location_id"),
    ownership_verified: formData.get("ownership_verified"),
    data_bearing: formData.get("data_bearing"),
    initial_route: formData.get("initial_route"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) redirect("/assets/new?error=Please%20check%20the%20intake%20fields");
  if (parsed.data.ownership_verified !== "yes") redirect("/assets/new?error=Ownership%20must%20be%20verified%20before%20acceptance");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase.from("assets").insert({
    programme: parsed.data.programme,
    owner_kind: parsed.data.owner_kind,
    owner_name: parsed.data.owner_name || null,
    category: parsed.data.category,
    manufacturer: parsed.data.manufacturer || null,
    model: parsed.data.model || null,
    serial_imei: parsed.data.serial_imei || null,
    source_name: parsed.data.source_name || null,
    customer_id: parsed.data.customer_id || null,
    job_id: parsed.data.job_id || null,
    lot_id: parsed.data.lot_id || null,
    location_id: parsed.data.location_id || null,
    ownership_verified: true,
    data_bearing: parsed.data.data_bearing === "yes",
    data_state: parsed.data.data_bearing === "yes" ? "UNWIPED_RESTRICTED" : "NON_DATA_BEARING",
    initial_route: parsed.data.initial_route,
    status: "INTAKE",
    notes: parsed.data.notes || null,
    created_by: user.id,
  }).select("id,asset_code").single();

  if (error || !data) redirect("/assets/new?error="+encodeURIComponent(error?.message || "Could not create asset"));

  if (parsed.data.product_barcode) {
    const attributes = [
      {
        asset_id: data.id,
        attribute_key: "product_barcode",
        attribute_value: parsed.data.product_barcode,
        source: "LOOKUP",
        created_by: user.id,
      },
      ...(parsed.data.barcode_lookup_source ? [{
        asset_id: data.id,
        attribute_key: "barcode_lookup_source",
        attribute_value: parsed.data.barcode_lookup_source,
        source: "LOOKUP",
        created_by: user.id,
      }] : []),
      ...(parsed.data.barcode_lookup_url ? [{
        asset_id: data.id,
        attribute_key: "barcode_lookup_url",
        attribute_value: parsed.data.barcode_lookup_url,
        source: "LOOKUP",
        created_by: user.id,
      }] : []),
    ];
    await supabase.from("asset_attributes").insert(attributes);
  }

  await supabase.from("operational_events").insert({
    entity_type: "asset",
    entity_id: data.id,
    event_type: "ASSET_RECEIVED",
    actor_id: user.id,
    details: {
      asset_code: data.asset_code,
      job_id: parsed.data.job_id || null,
      lot_id: parsed.data.lot_id || null,
      product_barcode: parsed.data.product_barcode || null,
      barcode_lookup_source: parsed.data.barcode_lookup_source || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/assets");
  if (parsed.data.job_id) revalidatePath(`/jobs/${parsed.data.job_id}`);
  redirect(`/assets/${data.id}`);
}
