import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/+esm";

const SUPABASE_URL = "https://kukwydsfhlmwwxpgnbpn.supabase.co";
const SUPABASE_KEY = "sb_publishable_i7540lgd1StPXRbAASYT_g_UJxXg3az";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const roles = ["admin","manager","technician","volunteer","auditor"];
const actorColumns = {
  api_tokens:"created_by",asset_attributes:"created_by",asset_defects:"created_by",asset_tests:"created_by",assets:"created_by",customers:"created_by",defect_templates:"created_by",dispositions:"decided_by",downstream_vendors:"created_by",environmental_methodologies:"created_by",exceptions:"created_by",grades:"graded_by",jobs:"created_by",locations:"created_by",lot_adjustments:"created_by",lot_relationships:"created_by",lots:"created_by",market_observations:"created_by",media:"created_by",model_support:"created_by",outbound_contents:"created_by",outbound_orders:"created_by",pallet_contents:"added_by",pallets:"created_by",parts:"created_by",pricing_rules:"created_by",repairs:"created_by",resale_listings:"created_by",returns_rma:"created_by",sales:"created_by",sanitisation_policies:"created_by",settlements:"created_by",webhooks:"created_by",workflow_rules:"created_by",workstations:"created_by"
};
const protectedFields = new Set(["id","created_by","decided_by","graded_by","added_by","created_at","updated_at","captured_at","graded_at","decided_at"]);

let session = null, profile = null, targets = [], currentTab = "data", selectedTable = "customers", selectedUser = null;
const $ = id => document.getElementById(id);
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
const pretty = value => JSON.stringify(value, null, 2);

function notice(message, kind="success", target="app-message") {
  $(target).innerHTML = message ? `<div class="${kind}">${escapeHtml(message)}</div>` : "";
}
function editableCopy(row) {
  const copy = {...row};
  for (const key of protectedFields) delete copy[key];
  return copy;
}

async function ensureAdmin() {
  const { data: { session: activeSession } } = await supabase.auth.getSession();
  session = activeSession;
  if (!session) return false;
  const { data, error } = await supabase.from("profiles").select("id,full_name,email,role,active").eq("id", session.user.id).single();
  if (error || !data?.active) {
    notice(error?.message || "Account inactive.", "error", "login-message");
    return false;
  }
  profile = data;
  $("userline").textContent = `${data.full_name || data.email || "Staff"} · ${data.role}`;
  if (data.role !== "admin") {
    notice("This GitHub Pages console is admin-only. Your current role is " + data.role + ".", "error", "login-message");
    return false;
  }
  return true;
}

async function loadTargets() {
  const { data, error } = await supabase.from("permission_targets").select("table_name,label,category,mutable").order("category").order("label");
  if (error) throw error;
  targets = data || [];
  if (!targets.some(t => t.table_name === selectedTable && t.mutable)) selectedTable = targets.find(t => t.mutable)?.table_name || "";
}

async function boot() {
  try {
    const ok = await ensureAdmin();
    if (!ok) {
      $("login-panel").classList.remove("hidden"); $("admin-panel").classList.add("hidden"); $("signout").classList.add("hidden"); return;
    }
    $("login-panel").classList.add("hidden"); $("admin-panel").classList.remove("hidden"); $("signout").classList.remove("hidden");
    await loadTargets(); await render();
  } catch (error) {
    $("login-panel").classList.remove("hidden"); $("admin-panel").classList.add("hidden"); notice(error.message || String(error), "error", "login-message");
  }
}

$("login-form").addEventListener("submit", async event => {
  event.preventDefault(); notice("", "success", "login-message");
  const { error } = await supabase.auth.signInWithPassword({email: $("email").value.trim(), password: $("password").value});
  if (error) return notice(error.message, "error", "login-message");
  await boot();
});
$("signout").addEventListener("click", async () => { await supabase.auth.signOut(); session = null; profile = null; $("userline").textContent = "Not signed in"; await boot(); });
document.querySelectorAll("[data-tab]").forEach(btn => btn.addEventListener("click", async () => { currentTab = btn.dataset.tab; selectedUser = null; await render(); }));

async function render() {
  notice("");
  if (currentTab === "roles") return renderRoles();
  if (currentTab === "users") return renderUsers();
  return renderData();
}

async function renderData() {
  const mutable = targets.filter(t => t.mutable);
  const target = mutable.find(t => t.table_name === selectedTable) || mutable[0];
  if (!target) return void ($("view").innerHTML = '<div class="error">No mutable tables configured.</div>');
  selectedTable = target.table_name;
  $("view").innerHTML = `
    <section class="card stack"><div><h2>Admin Data</h2><p class="muted small">Direct CRUD for mutable operational tables. Audit/history tables are excluded.</p></div><label>Table<select id="table-select">${mutable.map(t => `<option value="${escapeHtml(t.table_name)}" ${t.table_name===selectedTable?"selected":""}>${escapeHtml(t.category)} · ${escapeHtml(t.label)}</option>`).join("")}</select></label></section>
    <section class="card stack"><h2>Create record</h2><p class="muted small">Enter a JSON object. Actor attribution fields are filled with your signed-in user ID.</p><textarea id="create-json" class="code">{}</textarea><div><button id="create-record" class="button" type="button">Create record</button></div></section>
    <section class="stack"><div><h2>Records</h2><p class="muted small">Showing up to 50 rows.</p></div><div id="records" class="stack"><div class="card muted">Loading…</div></div></section>`;
  $("table-select").addEventListener("change", async e => { selectedTable = e.target.value; await renderData(); });
  $("create-record").addEventListener("click", createRecord);
  await loadRecords();
}

async function loadRecords() {
  const box = $("records");
  const { data, error } = await supabase.from(selectedTable).select("*").limit(50);
  if (error) return void (box.innerHTML = `<div class="error">${escapeHtml(error.message)}</div>`);
  const rows = data || [];
  if (!rows.length) return void (box.innerHTML = '<div class="card muted">No records.</div>');
  box.innerHTML = rows.map((row,index) => {
    const id = row.id ?? "", key = escapeHtml(String(id || index));
    return `<details class="card record"><summary><strong>${escapeHtml(String(id || ("Row " + (index+1))))}</strong></summary><pre>${escapeHtml(pretty(row))}</pre>${id ? `<div class="form"><label>Editable fields<textarea class="code edit-json" data-id="${key}">${escapeHtml(pretty(editableCopy(row)))}</textarea></label><div class="actions"><button class="button small update-record" data-id="${key}" type="button">Update</button><button class="button danger small delete-record" data-id="${key}" type="button">Delete</button></div></div>` : ""}</details>`;
  }).join("");
  box.querySelectorAll(".update-record").forEach(btn => btn.addEventListener("click", () => updateRecord(btn.dataset.id)));
  box.querySelectorAll(".delete-record").forEach(btn => btn.addEventListener("click", () => deleteRecord(btn.dataset.id)));
}

async function createRecord() {
  try {
    const payload = JSON.parse($("create-json").value || "{}");
    if (!payload || Array.isArray(payload) || typeof payload !== "object") throw new Error("JSON must be an object.");
    delete payload.id; const actor = actorColumns[selectedTable]; if (actor) payload[actor] = session.user.id;
    const { error } = await supabase.from(selectedTable).insert(payload); if (error) throw error;
    notice("Record created."); $("create-json").value = "{}"; await loadRecords();
  } catch (error) { notice(error.message || String(error), "error"); }
}
async function updateRecord(id) {
  try {
    const area = [...document.querySelectorAll(".edit-json")].find(el => el.dataset.id === id);
    const parsed = JSON.parse(area.value || "{}"); const payload = Object.fromEntries(Object.entries(parsed).filter(([key]) => !protectedFields.has(key)));
    const { error } = await supabase.from(selectedTable).update(payload).eq("id", id); if (error) throw error;
    notice("Record updated."); await loadRecords();
  } catch (error) { notice(error.message || String(error), "error"); }
}
async function deleteRecord(id) {
  if (!confirm(`Delete this ${selectedTable} record? This cannot be undone.`)) return;
  const { error } = await supabase.from(selectedTable).delete().eq("id", id); if (error) return notice(error.message, "error");
  notice("Record deleted."); await loadRecords();
}

async function renderRoles() {
  const { data: perms, error } = await supabase.from("role_table_permissions").select("role,table_name,can_create,can_read,can_update,can_delete");
  if (error) return void ($("view").innerHTML = `<div class="error">${escapeHtml(error.message)}</div>`);
  const map = new Map((perms||[]).map(p => [`${p.role}:${p.table_name}`,p]));
  $("view").innerHTML = `<section class="stack"><div><h2>Role permission matrix</h2><p class="muted">Changes are enforced by Supabase RLS. Immutable audit/history targets expose Read only.</p></div>${roles.map(role => `<details class="card" ${role==="admin"?"open":""}><summary><strong>${escapeHtml(role)}</strong></summary><div class="table-wrap" style="margin-top:12px"><table><thead><tr><th>Target</th><th>C</th><th>R</th><th>U</th><th>D</th><th></th></tr></thead><tbody>${targets.map(t => { const p=map.get(`${role}:${t.table_name}`)||{}; return `<tr><td><strong>${escapeHtml(t.label)}</strong><div class="muted small">${escapeHtml(t.category)} · ${escapeHtml(t.table_name)}${t.mutable?"":" · immutable"}</div></td><td><input type="checkbox" data-k="create" ${p.can_create?"checked":""} ${t.mutable?"":"disabled"}></td><td><input type="checkbox" data-k="read" ${p.can_read?"checked":""}></td><td><input type="checkbox" data-k="update" ${p.can_update?"checked":""} ${t.mutable?"":"disabled"}></td><td><input type="checkbox" data-k="delete" ${p.can_delete?"checked":""} ${t.mutable?"":"disabled"}></td><td><button class="button secondary small save-role" data-role="${role}" data-table="${escapeHtml(t.table_name)}" type="button">Save</button></td></tr>`; }).join("")}</tbody></table></div></details>`).join("")}</section>`;
  document.querySelectorAll(".save-role").forEach(btn => btn.addEventListener("click", () => saveRolePermission(btn)));
}
async function saveRolePermission(btn) {
  const row = btn.closest("tr"), table = btn.dataset.table, target = targets.find(t => t.table_name === table), get = key => row.querySelector(`[data-k="${key}"]`)?.checked || false;
  const payload = {role:btn.dataset.role,table_name:table,can_create:target?.mutable?get("create"):false,can_read:get("read"),can_update:target?.mutable?get("update"):false,can_delete:target?.mutable?get("delete"):false,updated_at:new Date().toISOString()};
  const { error } = await supabase.from("role_table_permissions").upsert(payload); if (error) return notice(error.message,"error");
  notice(`Saved ${btn.dataset.role} permissions for ${table}.`);
}

async function renderUsers() {
  const { data, error } = await supabase.from("profiles").select("id,full_name,email,role,active,created_at").order("created_at");
  if (error) return void ($("view").innerHTML = `<div class="error">${escapeHtml(error.message)}</div>`);
  const users = data || [];
  $("view").innerHTML = `<section class="card stack"><div><h2>Staff accounts</h2><p class="muted">Change role/status or manage individual permission overrides.</p></div><div class="table-wrap"><table><thead><tr><th>Staff</th><th>Role</th><th>Active</th><th></th></tr></thead><tbody>${users.map(u => `<tr><td><strong>${escapeHtml(u.full_name||"Unnamed")}</strong><div class="muted small">${escapeHtml(u.email||u.id)}</div></td><td><select class="user-role">${roles.map(r => `<option value="${r}" ${r===u.role?"selected":""}>${r}</option>`).join("")}</select></td><td><input class="user-active" type="checkbox" ${u.active?"checked":""}></td><td><div class="actions"><button class="button secondary small save-user" data-id="${u.id}" type="button">Save staff</button><button class="button secondary small user-overrides" data-id="${u.id}" type="button">Overrides</button></div></td></tr>`).join("")}</tbody></table></div></section><div id="override-panel"></div>`;
  document.querySelectorAll(".save-user").forEach(btn => btn.addEventListener("click", () => saveUser(btn)));
  document.querySelectorAll(".user-overrides").forEach(btn => btn.addEventListener("click", () => renderOverrides(btn.dataset.id, users)));
  if (selectedUser) await renderOverrides(selectedUser, users);
}
async function saveUser(btn) {
  const row = btn.closest("tr"), role = row.querySelector(".user-role").value, active = row.querySelector(".user-active").checked;
  const { error } = await supabase.from("profiles").update({role,active,updated_at:new Date().toISOString()}).eq("id",btn.dataset.id);
  if (error) return notice(error.message,"error"); notice("Staff account updated."); await renderUsers();
}
function tri(value){ return value===true?"allow":value===false?"deny":"inherit"; }
function triSelect(name,value,disabled=false){ return `<select class="tri" data-k="${name}" ${disabled?"disabled":""}><option value="inherit" ${tri(value)==="inherit"?"selected":""}>Inherit</option><option value="allow" ${tri(value)==="allow"?"selected":""}>Allow</option><option value="deny" ${tri(value)==="deny"?"selected":""}>Deny</option></select>`; }

async function renderOverrides(userId, users) {
  selectedUser = userId; const user = users.find(u => u.id === userId);
  const [{data:overrides,error:oErr},{data:rolePerms,error:rErr}] = await Promise.all([supabase.from("user_table_permission_overrides").select("*").eq("user_id",userId),supabase.from("role_table_permissions").select("*").eq("role",user.role)]);
  if (oErr||rErr) return void ($("override-panel").innerHTML = `<div class="error">${escapeHtml((oErr||rErr).message)}</div>`);
  const om = new Map((overrides||[]).map(x => [x.table_name,x])), rm = new Map((rolePerms||[]).map(x => [x.table_name,x]));
  $("override-panel").innerHTML = `<section class="card stack"><div class="section-title"><div><h2>Overrides: ${escapeHtml(user.full_name||user.email||user.id)}</h2><p class="muted small">Individual override → role permission → deny.</p></div><button id="clear-overrides" class="button secondary small" type="button">Clear all overrides</button></div><div class="table-wrap"><table><thead><tr><th>Target</th><th>C</th><th>R</th><th>U</th><th>D</th><th>Effective</th><th></th></tr></thead><tbody>${targets.map(t => { const o=om.get(t.table_name)||{}, r=rm.get(t.table_name)||{}, eff=key=>o[key]??r[key]??false; return `<tr><td><strong>${escapeHtml(t.label)}</strong><div class="muted small">${escapeHtml(t.category)} · ${escapeHtml(t.table_name)}</div></td><td>${triSelect("can_create",o.can_create,!t.mutable)}</td><td>${triSelect("can_read",o.can_read,false)}</td><td>${triSelect("can_update",o.can_update,!t.mutable)}</td><td>${triSelect("can_delete",o.can_delete,!t.mutable)}</td><td class="small">C:${eff("can_create")?"✓":"×"} R:${eff("can_read")?"✓":"×"} U:${eff("can_update")?"✓":"×"} D:${eff("can_delete")?"✓":"×"}</td><td><button class="button secondary small save-override" data-table="${escapeHtml(t.table_name)}" type="button">Save</button></td></tr>`; }).join("")}</tbody></table></div></section>`;
  document.querySelectorAll(".save-override").forEach(btn => btn.addEventListener("click", () => saveOverride(btn,userId)));
  $("clear-overrides").addEventListener("click", () => clearOverrides(userId));
}
function parseTri(value){ return value==="allow"?true:value==="deny"?false:null; }
async function saveOverride(btn,userId) {
  const row=btn.closest("tr"), target=targets.find(t=>t.table_name===btn.dataset.table), value=key=>parseTri(row.querySelector(`[data-k="${key}"]`).value);
  const payload={user_id:userId,table_name:btn.dataset.table,can_create:target.mutable?value("can_create"):null,can_read:value("can_read"),can_update:target.mutable?value("can_update"):null,can_delete:target.mutable?value("can_delete"):null,updated_at:new Date().toISOString()};
  const allNull=["can_create","can_read","can_update","can_delete"].every(k=>payload[k]===null);
  const result=allNull?await supabase.from("user_table_permission_overrides").delete().eq("user_id",userId).eq("table_name",btn.dataset.table):await supabase.from("user_table_permission_overrides").upsert(payload);
  if(result.error) return notice(result.error.message,"error"); notice("Individual override updated."); await renderUsers();
}
async function clearOverrides(userId) {
  if(!confirm("Clear every individual permission override for this user?")) return;
  const {error}=await supabase.from("user_table_permission_overrides").delete().eq("user_id",userId); if(error) return notice(error.message,"error");
  notice("All individual overrides cleared."); await renderUsers();
}

supabase.auth.onAuthStateChange((_event,newSession)=>{ session=newSession; });
await boot();
