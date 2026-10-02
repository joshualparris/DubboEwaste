"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, STAFF_ROLES } from "@/lib/admin";

const roleSchema = z.enum(STAFF_ROLES);
const overrideSchema = z.enum(["inherit", "allow", "deny"]);

function checked(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function overrideValue(value: FormDataEntryValue | null): boolean | null {
  const parsed = overrideSchema.safeParse(String(value ?? "inherit"));
  if (!parsed.success || parsed.data === "inherit") return null;
  return parsed.data === "allow";
}

function message(path: string, kind: "error" | "success", value: string): never {
  redirect(`${path}?${kind}=${encodeURIComponent(value)}`);
}

export async function updateStaffAccount(formData: FormData) {
  const userId = String(formData.get("user_id") ?? "");
  const parsedRole = roleSchema.safeParse(String(formData.get("role") ?? ""));
  const active = checked(formData, "active");
  if (!z.string().uuid().safeParse(userId).success || !parsedRole.success) {
    message("/admin/permissions", "error", "Invalid staff update.");
  }

  const { supabase, user } = await requireAdmin();
  const { data: target } = await supabase
    .from("profiles")
    .select("id,role,active")
    .eq("id", userId)
    .single();

  if (!target) message("/admin/permissions", "error", "Staff account not found.");

  const removingActiveAdmin =
    target.role === "admin" &&
    target.active &&
    (parsedRole.data !== "admin" || !active);

  if (removingActiveAdmin) {
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin")
      .eq("active", true)
      .neq("id", userId);

    if ((count ?? 0) === 0) {
      message("/admin/permissions", "error", "At least one active admin must remain.");
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: parsedRole.data, active, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) message("/admin/permissions", "error", error.message);

  revalidatePath("/admin/permissions");
  revalidatePath("/dashboard");

  const suffix = userId === user.id ? " Your current session may need a refresh." : "";
  message("/admin/permissions", "success", `Staff account updated.${suffix}`);
}

export async function updateRolePermission(formData: FormData) {
  const parsedRole = roleSchema.safeParse(String(formData.get("role") ?? ""));
  const tableName = String(formData.get("table_name") ?? "");
  if (!parsedRole.success || !tableName) {
    message("/admin/permissions", "error", "Invalid role permission.");
  }

  const { supabase } = await requireAdmin();
  const { data: target } = await supabase
    .from("permission_targets")
    .select("table_name,mutable")
    .eq("table_name", tableName)
    .single();

  if (!target) message("/admin/permissions", "error", "Permission target not found.");

  const { error } = await supabase.from("role_table_permissions").upsert({
    role: parsedRole.data,
    table_name: tableName,
    can_create: target.mutable ? checked(formData, "can_create") : false,
    can_read: checked(formData, "can_read"),
    can_update: target.mutable ? checked(formData, "can_update") : false,
    can_delete: target.mutable ? checked(formData, "can_delete") : false,
    updated_at: new Date().toISOString(),
  });

  if (error) message("/admin/permissions", "error", error.message);
  revalidatePath("/admin/permissions");
  message("/admin/permissions", "success", "Role permission updated.");
}

export async function updateUserPermissionOverride(formData: FormData) {
  const userId = String(formData.get("user_id") ?? "");
  const tableName = String(formData.get("table_name") ?? "");
  const path = `/admin/permissions/users/${userId}`;

  if (!z.string().uuid().safeParse(userId).success || !tableName) {
    message("/admin/permissions", "error", "Invalid individual permission override.");
  }

  const { supabase } = await requireAdmin();
  const [{ data: profile }, { data: target }] = await Promise.all([
    supabase.from("profiles").select("id").eq("id", userId).single(),
    supabase.from("permission_targets").select("table_name,mutable").eq("table_name", tableName).single(),
  ]);

  if (!profile || !target) message(path, "error", "Staff account or permission target not found.");

  const values = {
    can_create: target.mutable ? overrideValue(formData.get("can_create")) : null,
    can_read: overrideValue(formData.get("can_read")),
    can_update: target.mutable ? overrideValue(formData.get("can_update")) : null,
    can_delete: target.mutable ? overrideValue(formData.get("can_delete")) : null,
  };

  if (Object.values(values).every((value) => value === null)) {
    const { error } = await supabase
      .from("user_table_permission_overrides")
      .delete()
      .eq("user_id", userId)
      .eq("table_name", tableName);
    if (error) message(path, "error", error.message);
  } else {
    const { error } = await supabase.from("user_table_permission_overrides").upsert({
      user_id: userId,
      table_name: tableName,
      ...values,
      updated_at: new Date().toISOString(),
    });
    if (error) message(path, "error", error.message);
  }

  revalidatePath(path);
  message(path, "success", "Individual permission override updated.");
}

export async function clearUserPermissionOverrides(formData: FormData) {
  const userId = String(formData.get("user_id") ?? "");
  const path = `/admin/permissions/users/${userId}`;
  if (!z.string().uuid().safeParse(userId).success) {
    message("/admin/permissions", "error", "Invalid staff account.");
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("user_table_permission_overrides")
    .delete()
    .eq("user_id", userId);

  if (error) message(path, "error", error.message);
  revalidatePath(path);
  message(path, "success", "All individual overrides cleared; role permissions now apply.");
}
