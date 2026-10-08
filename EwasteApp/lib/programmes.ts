export const PROGRAMMES = {
  dubbo_ewaste: "Dubbo E-waste",
  library_of_things: "Dubbo Library of Things",
  repair_cafe: "Dubbo Repair Café",
} as const;
export type Programme = keyof typeof PROGRAMMES;
export const PROGRAMME_ROLES = ["admin", "manager", "technician", "volunteer", "auditor"] as const;
export type ProgrammeRole = typeof PROGRAMME_ROLES[number];
export type ProgrammeContext = {
  id: string; full_name: string | null; global_admin: boolean;
  selected: Programme | null | "__denied__"; role: ProgrammeRole | null;
  memberships: { program: Programme; role: ProgrammeRole }[];
};
export const PROGRAMME_COOKIE = "assetflow-programme";
export function validProgramme(value: string): value is Programme { return Object.hasOwn(PROGRAMMES, value); }
export function programmeHeader(value: string | undefined): Record<string,string> {
  return value && (value === "all" || validProgramme(value)) ? { "x-assetflow-programme": value } : {};
}
export function canVisit(path: string, programme: ProgrammeContext["selected"], globalAdmin: boolean, role: string | null): boolean {
  const section = path.split("/").filter(Boolean)[0] || "dashboard";
  if (["programmes","access","circular-access"].includes(section)) return true;
  if (section === "admin") return path.startsWith("/admin/programmes") ? globalAdmin || role === "admin" : globalAdmin;
  if (programme === "__denied__") return false;
  if (globalAdmin && programme === null) return true;
  if (programme === null && !globalAdmin) return false;
  if (["dashboard","search","assets","customers","locations","repairs","exceptions","device-library","model-lookup","learn"].includes(section)) return true;
  if (programme === "dubbo_ewaste") return !["lending","repair-cafe-volunteers","repair-cafe-feedback"].includes(section);
  if (programme === "library_of_things") return section === "lending";
  if (programme === "repair_cafe") return section === "repair-cafe-volunteers" || (section === "repair-cafe-feedback" && ["admin","manager"].includes(role || ""));
  return false;
}
