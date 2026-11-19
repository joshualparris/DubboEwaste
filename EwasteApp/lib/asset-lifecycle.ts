export type LifecycleStageState = "complete" | "pending" | "blocked" | "not_required";

export type LifecycleStageKey =
  | "RECEIVED"
  | "AUTHORITY"
  | "TRIAGE"
  | "QUARANTINE"
  | "MODEL"
  | "SANITISATION"
  | "DIAGNOSTICS"
  | "GRADE"
  | "REPAIR"
  | "DISPOSITION"
  | "FULFILMENT"
  | "CERTIFICATE";

export type LifecycleStage = {
  key: LifecycleStageKey;
  label: string;
  state: LifecycleStageState;
  summary: string;
  href: string;
};

type Row = Record<string, any>;

export type AssetLifecycleInput = {
  asset: Row;
  authorityRecords?: Row[];
  triageAssessments?: Row[];
  quarantines?: Row[];
  media?: Row[];
  tests?: Row[];
  grades?: Row[];
  repairs?: Row[];
  dispositions?: Row[];
  parts?: Row[];
  listings?: Row[];
  sales?: Row[];
  outbound?: Row[];
  certificates?: Row[];
  exceptions?: Row[];
};

const requiredByCategory: Record<string, string[]> = {
  LAPTOP: ["Boot / POST","Memory","Storage health","Battery","Display","Keyboard","Wi-Fi","Charging","Physical condition"],
  CHROMEBOOK: ["Boot / POST","Memory","Storage health","Battery","Display","Keyboard","Wi-Fi","Charging","Physical condition"],
  DESKTOP: ["Boot / POST","Memory","Storage health","Ethernet","Physical condition"],
  PHONE: ["Boot / POST","Battery","Display","Wi-Fi","Charging","Physical condition"],
  TABLET: ["Boot / POST","Battery","Display","Wi-Fi","Charging","Physical condition"],
  MONITOR: ["Display","Physical condition"],
  TV: ["Display","Physical condition"],
  NETWORKING: ["Boot / POST","Ethernet","Physical condition"],
  PRINTER: ["Boot / POST","Physical condition"],
  PARTS: ["Physical condition"],
  OTHER: ["Physical condition"],
};

export function requiredDiagnosticsForCategory(category: string): string[] {
  return requiredByCategory[category] ?? ["Physical condition"];
}

function latest(rows: Row[] | undefined, field: string): Row | null {
  if (!rows?.length) return null;
  return [...rows].sort((a,b)=>String(b[field] ?? "").localeCompare(String(a[field] ?? "")))[0] ?? null;
}

function stage(key: LifecycleStageKey, label: string, state: LifecycleStageState, summary: string, href: string): LifecycleStage {
  return { key, label, state, summary, href };
}

export function evaluateAssetLifecycle(input: AssetLifecycleInput) {
  const {
    asset,
    authorityRecords = [],
    triageAssessments = [],
    quarantines = [],
    media = [],
    tests = [],
    grades = [],
    repairs = [],
    dispositions = [],
    parts = [],
    listings = [],
    sales = [],
    outbound = [],
    certificates = [],
    exceptions = [],
  } = input;

  const latestTriage = latest(triageAssessments, "created_at");
  const latestGrade = latest(grades, "graded_at");
  const latestDisposition = latest(dispositions, "decided_at");
  const openQuarantine = quarantines.find((q)=>q.status === "OPEN") ?? null;
  const openExceptions = exceptions.filter((x)=>!["RESOLVED","CLOSED"].includes(String(x.status)));
  const authorityComplete = Boolean(asset.ownership_verified) && authorityRecords.length > 0;

  const stages: LifecycleStage[] = [];
  stages.push(stage("RECEIVED","Received","complete",`Asset ${asset.asset_code ?? ""} is recorded in custody.`,`/assets/${asset.id}`));

  stages.push(stage(
    "AUTHORITY",
    "Ownership / authority",
    authorityComplete ? "complete" : "blocked",
    authorityComplete
      ? `${authorityRecords.length} authority record${authorityRecords.length === 1 ? "" : "s"} attached.`
      : asset.ownership_verified
        ? "Legacy ownership flag exists, but no explicit authority record has been captured yet."
        : "Ownership / disposal authority has not been verified.",
    `/assets/${asset.id}#authority`,
  ));

  let triageState: LifecycleStageState = "pending";
  let triageSummary = "Run intake safety, battery, lock and physical-condition triage.";
  if (!authorityComplete) {
    triageState = "blocked";
    triageSummary = "Record ownership / authority first.";
  } else if (latestTriage?.decision === "ACCEPT") {
    triageState = "complete";
    triageSummary = "Latest triage decision: ACCEPT.";
  } else if (latestTriage?.decision === "HOLD") {
    triageState = "blocked";
    triageSummary = "Latest triage decision: HOLD.";
  } else if (latestTriage?.decision === "REJECT") {
    triageState = "complete";
    triageSummary = "Latest triage decision: REJECT (terminal route).";
  }
  stages.push(stage("TRIAGE","Intake triage",triageState,triageSummary,`/assets/${asset.id}#triage`));

  stages.push(stage(
    "QUARANTINE",
    "Quarantine",
    openQuarantine ? "blocked" : quarantines.length ? "complete" : "not_required",
    openQuarantine
      ? `Open quarantine: ${openQuarantine.reason_type ?? "OTHER"} — ${openQuarantine.reason ?? "review required"}`
      : quarantines.length
        ? "All quarantine holds are released."
        : "No quarantine hold is open.",
    `/assets/${asset.id}#quarantine`,
  ));

  const modelComplete = Boolean(String(asset.manufacturer ?? "").trim() && String(asset.model ?? "").trim());
  stages.push(stage(
    "MODEL",
    "Model identity",
    modelComplete ? "complete" : "pending",
    modelComplete ? `${asset.manufacturer} ${asset.model}` : "Manufacturer and exact model are not both recorded.",
    modelComplete ? `/assets/${asset.id}` : "/model-lookup",
  ));

  let sanitisationState: LifecycleStageState;
  let sanitisationSummary: string;
  if (!asset.data_bearing || asset.data_state === "NON_DATA_BEARING") {
    sanitisationState = "not_required";
    sanitisationSummary = "Asset is recorded as non-data-bearing.";
  } else if (!authorityComplete || latestTriage?.decision !== "ACCEPT" || openQuarantine) {
    sanitisationState = "blocked";
    sanitisationSummary = "Clear authority, triage and quarantine gates before sanitisation.";
  } else if (asset.data_state === "SANITISATION_FAILED" || media.some((m)=>m.data_state === "SANITISATION_FAILED")) {
    sanitisationState = "blocked";
    sanitisationSummary = "A sanitisation attempt failed and requires retry, destruction or supervisor review.";
  } else if (
    asset.data_state === "VERIFIED_CLEARED" &&
    (!media.length || media.every((m)=>["VERIFIED_CLEARED","NON_DATA_BEARING"].includes(String(m.data_state))))
  ) {
    sanitisationState = "complete";
    sanitisationSummary = media.length ? "All tracked media is cleared/non-data-bearing." : "Asset data state is VERIFIED_CLEARED.";
  } else {
    sanitisationState = "pending";
    sanitisationSummary = media.length
      ? "One or more tracked media records still require sanitisation."
      : "Add the data-bearing media and record a verified sanitisation outcome.";
  }
  stages.push(stage("SANITISATION","Data sanitisation",sanitisationState,sanitisationSummary,"/media"));

  const requiredTests = requiredDiagnosticsForCategory(String(asset.category));
  const terminalTestResults = new Set(["PASS","FAIL","NOT_PRESENT"]);
  const latestRepairCompletedAt = repairs
    .filter((r)=>r.status === "COMPLETED" && r.completed_at)
    .map((r)=>String(r.completed_at))
    .sort()
    .at(-1) ?? null;
  const diagnosticRows = latestRepairCompletedAt
    ? tests.filter((t)=>String(t.created_at ?? "") > latestRepairCompletedAt)
    : tests;
  const latestTests = new Map<string, Row>();
  for (const row of [...diagnosticRows].sort((a,b)=>String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")))) {
    if (!latestTests.has(String(row.test_type))) latestTests.set(String(row.test_type), row);
  }
  const missingTests = requiredTests.filter((name)=>{
    const row = latestTests.get(name);
    return !row || !terminalTestResults.has(String(row.result));
  });
  const failedTests = requiredTests.filter((name)=>latestTests.get(name)?.result === "FAIL");

  let diagnosticsState: LifecycleStageState = "pending";
  let diagnosticsSummary = missingTests.length
    ? `Missing: ${missingTests.join(", ")}`
    : failedTests.length
      ? `Complete; ${failedTests.length} required diagnostic${failedTests.length === 1 ? "" : "s"} failed.`
      : "Required diagnostics recorded.";
  if (!["complete","not_required"].includes(sanitisationState)) {
    diagnosticsState = "blocked";
    diagnosticsSummary = "Complete the sanitisation gate first.";
  } else if (!missingTests.length) {
    diagnosticsState = "complete";
  }
  stages.push(stage("DIAGNOSTICS","Diagnostics",diagnosticsState,diagnosticsSummary,`/assets/${asset.id}#diagnostics`));

  stages.push(stage(
    "GRADE",
    "Grade",
    diagnosticsState !== "complete" ? "blocked" : latestGrade?.final_grade ? "complete" : "pending",
    diagnosticsState !== "complete"
      ? "Complete required diagnostics first."
      : latestGrade?.final_grade
        ? `Final grade: ${latestGrade.final_grade}`
        : "Record the functional/cosmetic/battery/completeness grade.",
    `/assets/${asset.id}#grade`,
  ));

  const openRepairs = repairs.filter((r)=>!["COMPLETED","CANCELLED","DECLINED"].includes(String(r.status)));
  stages.push(stage(
    "REPAIR",
    "Repair",
    openRepairs.length ? "pending" : repairs.length ? "complete" : "not_required",
    openRepairs.length
      ? `${openRepairs.length} repair ticket${openRepairs.length === 1 ? "" : "s"} still open.`
      : repairs.length
        ? "Repair work is closed."
        : failedTests.length
          ? "No repair ticket is open despite failed diagnostics; choose repair or a non-reuse route."
          : "No repair required.",
    "/repairs",
  ));

  const finalDisposition = [...dispositions]
    .sort((a,b)=>String(b.decided_at ?? "").localeCompare(String(a.decided_at ?? "")))
    .find((d)=>!["HOLD","REFURBISH"].includes(String(d.disposition_type))) ?? null;

  const dispositionReady =
    latestTriage?.decision === "REJECT" ||
    Boolean(latestGrade?.final_grade) ||
    ["PARTS","REJECTED"].includes(String(asset.status));

  stages.push(stage(
    "DISPOSITION",
    "Final disposition",
    finalDisposition ? "complete" : dispositionReady ? "pending" : "blocked",
    finalDisposition
      ? `${finalDisposition.disposition_type}${finalDisposition.destination ? " → " + finalDisposition.destination : ""}`
      : dispositionReady
        ? "Choose SELL, DONATE, PARTS, RECYCLE, RETURN or REJECT."
        : "Finish the required processing gates before final disposition.",
    `/assets/${asset.id}#disposition`,
  ));

  const route = String(finalDisposition?.disposition_type ?? (latestTriage?.decision === "REJECT" ? "REJECT" : ""));
  let fulfilmentState: LifecycleStageState = route ? "pending" : "blocked";
  let fulfilmentSummary = route ? "Complete the selected final route." : "No final disposition exists.";

  if (route === "SELL") {
    if (sales.length) {
      fulfilmentState = "complete";
      fulfilmentSummary = "Sale recorded.";
    } else if (listings.length) {
      fulfilmentSummary = "Listing exists; sale not yet recorded.";
    } else {
      fulfilmentSummary = "Create a qualified listing, then record the sale.";
    }
  } else if (route === "DONATE") {
    fulfilmentState = finalDisposition?.destination ? "complete" : "pending";
    fulfilmentSummary = finalDisposition?.destination ? `Donation destination: ${finalDisposition.destination}` : "Record the receiving organisation/person.";
  } else if (route === "RECYCLE") {
    const received = asset.status === "RECYCLED" || outbound.some((o)=>["RECEIVED","COMPLETED"].includes(String(o.status)));
    const dispatched = asset.status === "OUTBOUND" || outbound.some((o)=>String(o.status) === "DISPATCHED");
    if (received) {
      fulfilmentState = "complete";
      fulfilmentSummary = "Downstream receipt/completion recorded.";
    } else if (dispatched) {
      fulfilmentSummary = "Asset is outbound; downstream receipt is still pending.";
    } else {
      fulfilmentSummary = "Attach the asset to an outbound order and record downstream receipt.";
    }
  } else if (route === "PARTS") {
    fulfilmentState = parts.length || asset.status === "PARTS" ? "complete" : "pending";
    fulfilmentSummary = parts.length ? `${parts.length} harvested part record${parts.length === 1 ? "" : "s"}.` : "Record harvested parts or close as parts stock.";
  } else if (["RETURN","REJECT"].includes(route)) {
    fulfilmentState = "complete";
    fulfilmentSummary = route === "RETURN" ? "Returned / held outside normal processing." : "Rejected from the normal workflow.";
  }

  stages.push(stage(
    "FULFILMENT",
    "Route completion",
    fulfilmentState,
    fulfilmentSummary,
    route === "SELL" ? "/resale" : route === "RECYCLE" ? "/recycling" : `/assets/${asset.id}`,
  ));

  const expectedCertificate =
    route === "RECYCLE" ? "RECYCLING" :
    route === "REJECT" ? "DISPOSITION" :
    route ? "DISPOSITION" :
    asset.data_bearing && sanitisationState === "complete" ? "SANITISATION" :
    "DEVICE_HISTORY";

  const closureCert = certificates.find((c)=>String(c.certificate_type) === expectedCertificate);
  stages.push(stage(
    "CERTIFICATE",
    "Certificate / evidence snapshot",
    fulfilmentState !== "complete" ? "blocked" : closureCert ? "complete" : "pending",
    fulfilmentState !== "complete"
      ? "Complete the final route first."
      : closureCert
        ? `${expectedCertificate} certificate issued.`
        : `Issue a ${expectedCertificate} certificate/evidence snapshot.`,
    `/assets/${asset.id}#certificates`,
  ));

  const countable = stages.filter((s)=>s.state !== "not_required");
  const completed = countable.filter((s)=>s.state === "complete").length;
  const progress = countable.length ? Math.round(completed / countable.length * 100) : 0;
  const next = stages.find((s)=>s.state === "blocked" || s.state === "pending") ?? null;

  const blockers = [
    ...stages.filter((s)=>s.state === "blocked").map((s)=>`${s.label}: ${s.summary}`),
    ...openExceptions.map((x)=>`Exception: ${x.exception_type ?? "OPEN"} — ${x.summary ?? "review required"}`),
  ];

  return {
    stages,
    progress,
    next,
    blockers,
    finalRoute: route || null,
    requiredTests,
    missingTests,
    failedTests,
  };
}
