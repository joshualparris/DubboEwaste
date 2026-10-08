import { ResponsiveTable } from "@/components/ResponsiveTable";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { clearUserPermissionOverrides, updateUserPermissionOverride } from "../../actions";

type Target = {
  table_name: string;
  label: string;
  category: string;
  mutable: boolean;
};

type Permission = {
  table_name: string;
  can_create: boolean | null;
  can_read: boolean | null;
  can_update: boolean | null;
  can_delete: boolean | null;
};

function choice(value: boolean | null | undefined) {
  return value === true ? "allow" : value === false ? "deny" : "inherit";
}

function Effective({ override, inherited }: { override: boolean | null | undefined; inherited: boolean }) {
  const value = override ?? inherited;
  return <span className="badge">{value ? "Allowed" : "Denied"}</span>;
}

export default async function UserPermissionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { id } = await params;
  const notices = await searchParams;
  const { supabase } = await requireAdmin();

  const { data: person } = await supabase
    .from("profiles")
    .select("id,full_name,email,role,active")
    .eq("id", id)
    .single();

  if (!person) {
    return <div className="error">Staff account not found.</div>;
  }

  const [{ data: targetData }, { data: roleData }, { data: overrideData }] = await Promise.all([
    supabase.from("permission_targets").select("table_name,label,category,mutable").order("category").order("label"),
    supabase
      .from("role_table_permissions")
      .select("table_name,can_create,can_read,can_update,can_delete")
      .eq("role", person.role),
    supabase
      .from("user_table_permission_overrides")
      .select("table_name,can_create,can_read,can_update,can_delete")
      .eq("user_id", id),
  ]);

  const targets = (targetData ?? []) as Target[];
  const rolePermissions = new Map(((roleData ?? []) as Permission[]).map((p) => [p.table_name, p]));
  const overrides = new Map(((overrideData ?? []) as Permission[]).map((p) => [p.table_name, p]));

  return (
    <div className="stack">
      <div>
        <div className="badge">Admin · individual overrides</div>
        <h1>{person.full_name || "Staff member"}</h1>
        <p className="muted">{person.email || person.id} · role: {person.role} · {person.active ? "active" : "inactive"}</p>
        <div className="actions">
          <Link className="button secondary" href="/admin/permissions">Back to role permissions</Link>
          <form action={clearUserPermissionOverrides}>
            <input type="hidden" name="user_id" value={id} />
            <button className="button secondary" type="submit">Clear all overrides</button>
          </form>
        </div>
      </div>

      {notices.error ? <div className="error">{notices.error}</div> : null}
      {notices.success ? <div className="success">{notices.success}</div> : null}

      <section className="card table-wrap">
        <ResponsiveTable>
          <thead>
            <tr><th>Target</th><th>Create</th><th>Read</th><th>Update</th><th>Delete</th><th>Effective</th><th></th></tr>
          </thead>
          <tbody>
            {targets.map((target) => {
              const inherited = rolePermissions.get(target.table_name);
              const override = overrides.get(target.table_name);
              return (
                <tr key={target.table_name}>
                  <td>
                    <strong>{target.label}</strong>
                    <div className="muted small">{target.category} · {target.table_name}{target.mutable ? "" : " · immutable"}</div>
                  </td>
                  <td colSpan={6}>
                    <form action={updateUserPermissionOverride} className="inline-form">
                      <input type="hidden" name="user_id" value={id} />
                      <input type="hidden" name="table_name" value={target.table_name} />
                      {(["create","read","update","delete"] as const).map((action) => {
                        const key = `can_${action}` as keyof Permission;
                        const disabled = !target.mutable && action !== "read";
                        const current = disabled ? "inherit" : choice(override?.[key] as boolean | null | undefined);
                        return (
                          <label key={action} className="small">
                            {action.charAt(0).toUpperCase()}
                            <select name={key} defaultValue={current} disabled={disabled}>
                              <option value="inherit">Inherit</option>
                              <option value="allow">Allow</option>
                              <option value="deny">Deny</option>
                            </select>
                          </label>
                        );
                      })}
                      <span className="small">
                        C <Effective override={override?.can_create} inherited={inherited?.can_create ?? false} />{" "}
                        R <Effective override={override?.can_read} inherited={inherited?.can_read ?? false} />{" "}
                        U <Effective override={override?.can_update} inherited={inherited?.can_update ?? false} />{" "}
                        D <Effective override={override?.can_delete} inherited={inherited?.can_delete ?? false} />
                      </span>
                      <button className="button secondary" type="submit">Save</button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </ResponsiveTable>
      </section>
    </div>
  );
}
