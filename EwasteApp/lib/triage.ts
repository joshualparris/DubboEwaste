export type TriageInput = {
  deviceCategory: string;
  transferAuthorityRecorded: boolean;
  batteryCondition: string;
  accountLockStatus: string;
  dataBearing: boolean;
  sanitisationResult: string;
  finalRoute: string;
  physicalState: string;
};

export type TriageDecision = {
  decision: "ACCEPT" | "HOLD" | "REJECT";
  reasons: string[];
  requiredEvidence: string[];
};

const PHASE_0 = new Set(["laptop", "desktop/mini-pc", "phone/tablet", "monitor"]);
const APPROVAL_ONLY = new Set(["tv", "printer", "mixed_business_lot"]);
const ALWAYS_REJECT = new Set(["loose_battery"]);
const KNOWN = new Set([...PHASE_0, ...APPROVAL_ONLY, ...ALWAYS_REJECT]);

export function decideTriage(input: TriageInput): TriageDecision {
  let decision: TriageDecision["decision"] = "ACCEPT";
  const reasons: string[] = [];
  const requiredEvidence: string[] = [];

  const hold = (reason: string, evidence?: string) => {
    if (decision !== "REJECT") decision = "HOLD";
    reasons.push(reason);
    if (evidence) requiredEvidence.push(evidence);
  };
  const reject = (reason: string, evidence?: string) => {
    decision = "REJECT";
    reasons.push(reason);
    if (evidence) requiredEvidence.push(evidence);
  };

  if (!KNOWN.has(input.deviceCategory)) hold("Unknown device category.");
  if (ALWAYS_REJECT.has(input.deviceCategory)) reject("Loose batteries are outside Phase 0 intake.");
  if (APPROVAL_ONLY.has(input.deviceCategory)) hold("Category requires prior approval in Phase 0.");
  if (!PHASE_0.has(input.deviceCategory) && !APPROVAL_ONLY.has(input.deviceCategory) && !ALWAYS_REJECT.has(input.deviceCategory)) {
    hold("Category is not in the Phase 0 acceptance set.");
  }

  if (!input.transferAuthorityRecorded) hold("Transfer authority is not recorded.", "Ownership / authority record");

  const battery = input.batteryCondition.toLowerCase();
  if (["swollen","damaged","hot","leaking","punctured"].includes(battery)) {
    reject("Battery condition indicates a safety escalation.", "Safe refusal / incident record");
  } else if (!battery || battery === "unknown") {
    hold("Battery condition is unknown.", "Battery safety screen");
  }

  if (input.physicalState === "UNSAFE") reject("Physical condition is unsafe.", "Safe refusal / hazard record");

  const lock = input.accountLockStatus.toLowerCase();
  if (["locked","activation lock","frp","mdm","autopilot"].includes(lock)) {
    reject("Account or management lock is present.");
  } else if (!lock || ["unknown","not checked"].includes(lock)) {
    hold("Account / management lock is not cleared.", "Lock check");
  }

  if (input.dataBearing && input.sanitisationResult.toUpperCase() !== "PASS") {
    hold("Data-bearing device lacks a recorded sanitisation PASS.", "Sanitisation record and verification");
  }

  if (!input.finalRoute || input.finalRoute === "NONE") {
    hold("No final route is recorded.", "Buyer, social-reuse or downstream route");
  }

  return {
    decision,
    reasons: Array.from(new Set(reasons)),
    requiredEvidence: Array.from(new Set(requiredEvidence)),
  };
}
