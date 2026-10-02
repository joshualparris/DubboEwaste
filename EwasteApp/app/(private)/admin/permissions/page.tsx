import Link from "next/link";
import { requireAdmin, STAFF_ROLES } from "@/lib/admin";
import { updateRolePermission, updateStaffAccount } from "./actions";

type Staff = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  active: boolean;
};

type Target = {
  table_name: string;
  label: string;
  category: string;
  mutable: boolean;
};

type RolePermission = {
  role: string;
  table_name: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
};

export default async function PermissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();

  const [{ data: staffData }, { data: targetData }, { data: permissionData }] = await Promise.all([
    supabase.from("profiles").select("id,full_name,email,role,active").order("created_at"),
    supabase.from("permission_targets").select("table_name,label,category,mutable").order("category").order("label"),
    supabase.from("role_table_permissions").select("role,table_name,can_create,can_read,can_update,can_delete"),
  ]);

  const staff = (staffData ?? []) as Staff[];
  const targets = (targetData ?? []) as Target[];
  const permissions = (permissionData ?? []) as RolePermission[];
  const byKey = new Map(permissions.map((item) => [`${item.role}:${item.table_name}`, item]));

  return (
    <div className="stack">
      <div>
        <div className="badge">Admin</div>
        <h1>Roles & permissions</h1>
        <p className="muted">
          Role permissions are enforced by Supabase RLS. Individual overrides take precedence over the role.
        </p>
        <div className="actions">
          <Link className="button secondary" href="/admin/data">Open Admin Data</Link>
        </div>
      </div>

      {params.error ? <div className="error">{params.error}</div> : null}
      {params.success ? <div className="success">{params.success}</div> : null}

      <section className="card stack">
        <div>
          <h2>Staff accounts</h2>
          <p className="muted small">Change role, activate/deactivate an account, or set individual permission overrides.</p>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Staff</th><th>Role / status</th><th>Individual permissions</th></tr></thead>
            <tbody>
              {staff.map((person) => (
                <tr key={person.id}>
                  <td>
                    <strong>{person.full_name || "Unnamed staff"}</strong>
                    <div className="muted small">{person.email || person.id}</div>
                  </td>
                  <td>
                    <form action={updateStaffAccount} className="inline-form">
                      <input type="hidden" name="user_id" value={person.id} />
                      <select name="role" defaultValue={person.role}>
                        {STAFF_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                      </select>
                      <label className="small">
                        <input name="active" type="checkbox" defaultChecked={person.active} /> Active
                      </label>
                      <button className="button secondary" type="submit">Save</button>
                    </form>
                  </td>
                  <td>
                    <Link className="button secondary" href={`/admin/permissions/users/${person.id}`}>
                      Edit overrides
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="stack">
        <div>
          <h2>Role permission matrix</h2>
          <p className="muted small">
            Immutable audit/history targets expose Read only. Permission-management tables themselves remain admin-only as a lockout safeguard.
          </p>
        </div>

        {STAFF_ROLES.map((role) => (
          <details className="card" key={role} open={role === "admin"}>
            <summary><strong>{role}</strong></summary>
            <div className="table-wrap" style={{ marginTop: "12px" }}>
              <table>
                <thead>
                  <tr><th>Target</th><th>Create</th><th>Read</th><th>Update</th><th>Delete</th><th></th></tr>
                </thead>
                <tbody>
                  {targets.map((target) => {
                    const permission = byKey.get(`${role}:${target.table_name}`);
                    return (
                      <tr key={target.table_name}>
                        <td>
                          <strong>{target.label}</strong>
                          <div className="muted small">{target.category} · {target.table_name}{target.mutable ? "" : " · immutable"}</div>
                        </td>
                        <td colSpan={5}>
                          <form action={updateRolePermission} className="inline-form">
                            <input type="hidden" name="role" value={role} />
                            <input type="hidden" name="table_name" value={target.table_name} />
                            <label className="small"><input name="can_create" type="checkbox" defaultChecked={permission?.can_create ?? false} disabled={!target.mutable} /> C</label>
                            <label className="small"><input name="can_read" type="checkbox" defaultChecked={permission?.can_read ?? false} /> R</label>
                            <label className="small"><input name="can_update" type="checkbox" defaultChecked={permission?.can_update ?? false} disabled={!target.mutable} /> U</label>
                            <label className="small"><input name="can_delete" type="checkbox" defaultChecked={permission?.can_delete ?? false} disabled={!target.mutable} /> D</label>
                            <button className="button secondary" type="submit">Save</button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}
