// Synthetic layout records only. Never imported by the production app or sent to a real database.
export let empty = false;
export function setEmpty(value) { empty = value; }
const stamp = "2026-10-08T10:00:00Z";
export const assets = [
  { id: "asset-1", asset_code: "DEW-2026-000004", category: "LAPTOP", manufacturer: "HP", model: "ProBook x360 435 G8", serial_imei: "SERIAL-EXAMPLE-123456789", status: "INTAKE", data_state: "UNWIPED_RESTRICTED", initial_route: "PARTS" },
  { id: "asset-2", asset_code: "DEW-2026-000003", category: "LAPTOP", manufacturer: "Lenovo", model: "ThinkPad L480", serial_imei: "SERIAL-EXAMPLE-987654321", status: "READY_FOR_SALE", data_state: "SANITISED", initial_route: "HOLD" },
];
const common = {
  created_at: stamp, updated_at: stamp, received_at: stamp, issued_at: stamp,
  completed_at: stamp, captured_at: stamp, decided_at: stamp, graded_at: stamp, next_action_at: stamp,
  name: "Synthetic customer and processing record", title: "Synthetic device processing", label: "Customer records",
  description: "A long operational description with enough detail to exercise readable wrapping on a small phone.",
  notes: "Synthetic test evidence only; not a real result.", summary: "Requires an operator review before release.",
  role: "admin", active: true, enabled: true, email: "fixture@example.invalid",
  full_name: "Synthetic Operator", organisation: "Synthetic regional organisation", source_name: "Synthetic source",
  source_site: "Synthetic regional office", contact_name: "Synthetic Contact", contact_email: "test@example.invalid", contact_phone: "0400 000 000",
  ...assets[0], id: "fixture-1", status: "OPEN",
  job_code: "DEW-J-2026-00001", lot_code: "DEW-L-000001", media_code: "DEW-M-000001",
  part_code: "DEW-P-000001", outbound_code: "DEW-O-000001", certificate_code: "DEW-C-000001",
  certificate_type: "DEVICE_HISTORY", snapshot_sha256: "a".repeat(64), verification_token: "fixture-token",
  commodity: "Mixed laptops and desktops", gross_weight_kg: 23.5, tare_weight_kg: 1.5, item_count: 4,
  media_type: "NVME", capacity_bytes: 256000000000, serial: "EXAMPLE-01234567890123456789",
  severity: "MAJOR", exception_type: "SANITISATION_REVIEW", entity_type: "asset", entity_id: "fixture-1",
  conditions: { data_bearing: true }, action: { route: "SANITISATION" }, priority: 10,
  table_name: "customers", category: "LAPTOP", mutable: true, can_create: true, can_read: true, can_update: true, can_delete: false,
  profile_type: "DIAGNOSTICS", provider: "ServiceNow", interface: "NVMe", media_families: ["SSD", "NVMe"],
  clear_supported: true, purge_supported: true, opal_supported: false, hpa_dco_check_supported: false,
  result: "PASS", test_type: "BATTERY_HEALTH", functional_grade: "B", cosmetic_grade: "C", final_grade: "B",
  tool_name: "Synthetic erasure engine", method: "NIST_PURGE", raw_report_hash: "b".repeat(64),
  part_type: "RAM", stage: "QUALIFIED", marketing_consent: true, next_action: "Review synthetic fixture",
  valid_until: "2026-11-01", quote_number: "DEW-Q-000001", current_version: 1,
  amount: 100, asking_price: 180, sold_price: 160, total: 180, version: "1.0", source_url: "https://example.invalid/evidence",
};
const relation = { name: common.name, asset_code: assets[0].asset_code, job_code: common.job_code, lot_code: common.lot_code, id: "fixture-1", role: "admin", active: true, contact_name: common.contact_name, contact_email: common.contact_email, contact_phone: common.contact_phone };
const row = {
  ...common,
  customers: relation, assets: relation, jobs: relation, lots: relation, locations: relation, profiles: relation,
  crm_leads: { ...relation, organisation: common.organisation, email: common.email },
  deployment_profiles: { ...relation, provider: common.provider }, defect_templates: { ...relation, severity: "MINOR" },
  downstream_vendors: relation, sanitisation_policies: relation,
  sanitisation_tasks: [{ ...common, status: "FAILED", verification_passed: false }],
  crm_quote_versions: [{ id: "version-1", version_number: 1, scope: common.description, notes: common.notes, subtotal: 150, tax: 15, total: 165, crm_quote_items: [{ id: "item-1", description: common.description, quantity: 2, unit_price: 75, line_total: 150 }] }],
  crm_campaign_recipients: [{ status: "DRAFT" }],
  certificate_vault_records: { chain_sha256: "c".repeat(64), vault_status: "SEALED", signature_status: "NOT_SIGNED" },
  snapshot: { asset: { ...common }, tests: [{ test_type: "BATTERY_HEALTH", result: "FAIL", notes: common.notes }], media: [{ ...common, sanitisation_tasks: [{ status: "FAILED", tool_name: common.tool_name }] }] },
  public_summary: { asset_code: common.asset_code },
};
function records(table) {
  if (table === "profiles") return [row];
  if (table === "operational_document_overrides") return [];
  if (empty) return [];
  if (table === "assets") return assets.map((a) => ({ ...row, ...a }));
  return [{ ...row, id: `${table}-1` }];
}
function query(table) {
  let single = false;
  const proxy = new Proxy({}, {
    get(_, key) {
      if (key === "then") return (resolve, reject) => Promise.resolve({ data: single ? records(table)[0] ?? null : records(table), count: records(table).length, error: null }).then(resolve, reject);
      if (key === "single" || key === "maybeSingle") return () => { single = true; return proxy; };
      return () => proxy;
    },
  });
  return proxy;
}
export const client = {
  from: query,
  auth: { getUser: async () => ({ data: { user: { id: "fixture-user" } }, error: null }) },
  storage: { from: () => ({ createSignedUrl: async () => ({ data: { signedUrl: "https://example.invalid/fixture.jpg" }, error: null }) }) },
};
export function createClient() { return client; }
