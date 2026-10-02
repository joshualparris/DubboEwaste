"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const intakeSchema = z.object({
  category: z.enum(["LAPTOP","DESKTOP","PHONE","TABLET","CHROMEBOOK","MONITOR","TV","NETWORKING","PRINTER","PARTS","OTHER"]),
  manufacturer: z.string().trim().max(100).optional(),
  model: z.string().trim().max(160).optional(),
  serial_imei: z.string().trim().max(160).optional(),
  source_name: z.string().trim().max(200).optional(),
  ownership_verified: z.enum(["yes","no"]),
  data_bearing: z.enum(["yes","no"]),
  initial_route: z.enum(["REFURBISH","PARTS","DONATE","RECYCLE","HOLD"]),
  notes: z.string().trim().max(4000).optional(),
});

export async function createAsset(formData: FormData) {
  const parsed = intakeSchema.safeParse({
    category: formData.get("category"),
    manufacturer: formData.get("manufacturer") || undefined,
    model: formData.get("model") || undefined,
    serial_imei: formData.get("serial_imei") || undefined,
    source_name: formData.get("source_name") || undefined,
    ownership_verified: formData.get("ownership_verified"),
    data_bearing: formData.get("data_bearing"),
    initial_route: formData.get("initial_route"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    redirect("/assets/new?error=Please%20check%20the%20intake%20fields");
  }

  if (parsed.data.ownership_verified !== "yes") {
    redirect("/assets/new?error=Ownership%20must%20be%20verified%20before%20acceptance");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("assets")
    .insert({
      category: parsed.data.category,
      manufacturer: parsed.data.manufacturer || null,
      model: parsed.data.model || null,
      serial_imei: parsed.data.serial_imei || null,
      source_name: parsed.data.source_name || null,
      ownership_verified: true,
      data_bearing: parsed.data.data_bearing === "yes",
      data_state: parsed.data.data_bearing === "yes" ? "UNWIPED_RESTRICTED" : "NON_DATA_BEARING",
      initial_route: parsed.data.initial_route,
      status: "INTAKE",
      notes: parsed.data.notes || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/assets/new?error=Could%20not%20create%20asset");
  }

  revalidatePath("/dashboard");
  revalidatePath("/assets");
  redirect(`/assets/${data.id}`);
}
