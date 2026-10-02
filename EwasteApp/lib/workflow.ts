export type WorkflowContext = Record<string, unknown>;

function compare(actual: unknown, condition: unknown): boolean {
  if (condition === null || typeof condition !== "object" || Array.isArray(condition)) {
    return actual === condition;
  }

  const c = condition as Record<string, unknown>;
  if ("in" in c && Array.isArray(c.in)) return c.in.includes(actual);
  if ("not" in c) return !compare(actual, c.not);
  if ("exists" in c) return c.exists ? actual !== null && actual !== undefined && actual !== "" : actual === null || actual === undefined || actual === "";
  if ("gte" in c) return Number(actual) >= Number(c.gte);
  if ("lte" in c) return Number(actual) <= Number(c.lte);
  if ("gt" in c) return Number(actual) > Number(c.gt);
  if ("lt" in c) return Number(actual) < Number(c.lt);
  if ("contains" in c) return String(actual ?? "").toLowerCase().includes(String(c.contains).toLowerCase());
  return false;
}

export function workflowMatches(conditions: unknown, context: WorkflowContext): boolean {
  if (!conditions || typeof conditions !== "object" || Array.isArray(conditions)) return false;
  const c = conditions as Record<string, unknown>;

  if (Array.isArray(c.all)) return c.all.every((x) => workflowMatches(x, context));
  if (Array.isArray(c.any)) return c.any.some((x) => workflowMatches(x, context));

  return Object.entries(c).every(([key, value]) => compare(context[key], value));
}

export function buildAssetWorkflowContext(asset: Record<string, unknown>, grade?: Record<string, unknown> | null): WorkflowContext {
  return {
    category: asset.category,
    status: asset.status,
    data_state: asset.data_state,
    data_bearing: asset.data_bearing,
    ownership_verified: asset.ownership_verified,
    initial_route: asset.initial_route,
    manufacturer: asset.manufacturer,
    model: asset.model,
    final_grade: grade?.final_grade ?? null,
    functional_grade: grade?.functional_grade ?? null,
    cosmetic_grade: grade?.cosmetic_grade ?? null,
  };
}
