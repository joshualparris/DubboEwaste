import { courses } from "./catalog";
import type { Challenge, Difficulty } from "./adaptive";

/** Fictional, assessable decisions. Safety and training authorisation still require observed checks. */
const caseBank = [
  {
    "slug": "dubbo-ewaste-uncontacted-leads",
    "practitioner": {
      "question": "Five laptops have fleet manager release but unknown drive inventory. Next step?",
      "options": [
        "Collect and sort later",
        "Reconcile serials, storage and handling scope with releaser before custody",
        "Request no further details"
      ],
      "answer": 1,
      "explanation": "Uncontrolled storage and custody are unresolved."
    },
    "expert": {
      "question": "A leased batch includes customer files and your pilot cannot audit sanitisation. What do you offer?",
      "options": [
        "Promise certified erasure later",
        "Accept and resell without drives",
        "Decline data-bearing intake until authority and an equipped downstream path are agreed"
      ],
      "answer": 2,
      "explanation": "Leases and auditable data outcomes must be resolved."
    }
  },
  {
    "slug": "dubbo-business-field-guide",
    "practitioner": {
      "question": "A firm advertises 24/7 support but publishes no roster. Best evidence for employee workload?",
      "options": [
        "A current Dubbo employee or manager explaining rota, call-outs and allowances",
        "A customer rating",
        "The size of the building"
      ],
      "answer": 0,
      "explanation": "Service hours alone do not prove staff conditions."
    },
    "expert": {
      "question": "A 2006 director listing contradicts current company records and an undated staff biography. What can an org chart assert?",
      "options": [
        "The 2006 reporting lines are still valid",
        "Separate current legal officers and evidenced functional roles, mark reporting lines unknown",
        "Infer management hierarchy from salaries"
      ],
      "answer": 1,
      "explanation": "Evidence for ownership, operations and hierarchy differs."
    }
  },
  {
    "slug": "circular-thinking",
    "practitioner": {
      "question": "An old laptop needs an $85 battery while a refurbished alternative costs $200. What evidence decides reuse?",
      "options": [
        "Its age alone",
        "The scrap payment",
        "Safe repairability, useful remaining life, cost and local demand"
      ],
      "answer": 2,
      "explanation": "Compare real usable outcomes."
    },
    "expert": {
      "question": "A cheaper repair would make an inefficient device usable for only six months, while a more expensive refurb may last three years. Best evaluation?",
      "options": [
        "Estimate lifecycle cost and useful years with uncertainty, then compare",
        "Reuse must always win",
        "Recycle must always win"
      ],
      "answer": 0,
      "explanation": "A circular hierarchy is conditional, not absolute."
    }
  },
  {
    "slug": "volunteer-welcome",
    "practitioner": {
      "question": "A visitor wants file recovery from someone else's laptop. The lead is unavailable. What should a new volunteer do?",
      "options": [
        "Browse read-only to assess condition",
        "Pause, verify authority, scope and an approved supervisor",
        "Erase it to remove risk"
      ],
      "answer": 1,
      "explanation": "Physical possession is not data access permission."
    },
    "expert": {
      "question": "A fast volunteer skips serial recording; a slower one follows all checks. Who should run intake unsupervised?",
      "options": [
        "Fastest person",
        "Neither until role competence and authorisation are demonstrated",
        "Whichever owns the tools"
      ],
      "answer": 1,
      "explanation": "Speed is not controlled custody competence."
    }
  },
  {
    "slug": "workshop-safety",
    "practitioner": {
      "question": "A damaged lithium pack is warm but still powers up. Which intake action is justified?",
      "options": [
        "Quarantine per site procedure and escalate, without charging",
        "Run a benchmark first",
        "Put it in normal stock once off"
      ],
      "answer": 0,
      "explanation": "Hazard comes before function."
    },
    "expert": {
      "question": "A pack emits solvent odour and intermittent heat without swelling during a public event. What should the coordinator do?",
      "options": [
        "Charge it briefly to reproduce",
        "Move it to an ordinary storeroom",
        "Stop work, follow emergency isolation procedures and arrange competent safe handling"
      ],
      "answer": 2,
      "explanation": "No swelling does not rule out thermal risk."
    }
  },
  {
    "slug": "privacy-consent",
    "practitioner": {
      "question": "Consent permits a boot test; the volunteer notices private photos. Which action is authorised?",
      "options": [
        "Open the folder to confirm the SSD",
        "Only non-content checks within consent; ask separately before file access",
        "Copy images as a repair record"
      ],
      "answer": 1,
      "explanation": "Test permission is scope-limited."
    },
    "expert": {
      "question": "A customer wants a report containing passwords and all personal details. What report is defensible?",
      "options": [
        "Give only relevant test/asset evidence and omit reusable secrets",
        "Share the whole dataset with volunteers",
        "Publish it to prove transparency"
      ],
      "answer": 0,
      "explanation": "Proof does not require credentials."
    }
  },
  {
    "slug": "kind-communication",
    "practitioner": {
      "question": "A visitor with low vision cannot follow tiny diagrams. What preserves their agency?",
      "options": [
        "Finish silently for them",
        "Refuse because visual manuals are required",
        "Ask preferred format, offer verbal explanation and let them direct pace"
      ],
      "answer": 2,
      "explanation": "Accessible teaching starts with preference."
    },
    "expert": {
      "question": "Two repair visitors need different accessibility support and the roster is full. How should the lead decide?",
      "options": [
        "Serve only quick clients",
        "Use transparent safety/urgency criteria and arrange communication support or honest referral",
        "Refuse accessibility adjustments automatically"
      ],
      "answer": 1,
      "explanation": "Capacity and equitable access can both be considered."
    }
  },
  {
    "slug": "evidence-observation",
    "practitioner": {
      "question": "A cleaned laptop boots once, then fails twice after being moved. Best note?",
      "options": [
        "Fixed after cleaning",
        "Intermittent failure persists; record conditions and movement correlation",
        "RAM confirmed bad"
      ],
      "answer": 1,
      "explanation": "Observation is not root cause."
    },
    "expert": {
      "question": "Four of six machines booted, but half used different adapters. What can you conclude?",
      "options": [
        "Rerun controlled tests; report conditional observed outcomes",
        "Model failure rate is 33%",
        "Discard failed units from sample"
      ],
      "answer": 0,
      "explanation": "Different test conditions confound claims."
    }
  },
  {
    "slug": "repair-first",
    "practitioner": {
      "question": "A hinge repair is $80 but battery replacement is also needed. What should be offered?",
      "options": [
        "Immediate recycle",
        "A whole-device repair versus replacement comparison matched to intended use",
        "Repair hinge without mentioning battery"
      ],
      "answer": 1,
      "explanation": "Lifecycle and total cost matter."
    },
    "expert": {
      "question": "A locked device needs $30 in parts; an unlocked cleared device needs $90. Which should receive limited refurb time?",
      "options": [
        "Always repair cheapest",
        "Refurb locked first and bypass later",
        "Choose only where release, data evidence, labour and net utility justify it"
      ],
      "answer": 2,
      "explanation": "A cheap locked device may be unreleasable."
    }
  },
  {
    "slug": "ewaste-intake",
    "practitioner": {
      "question": "Twelve laptops arrive listed only by model. A driver demands an instant receipt. What is defensible?",
      "options": [
        "Provisional count and custody receipt, followed by serial-level reconciliation",
        "Claim all twelve sanitised",
        "Refuse to record discrepancies"
      ],
      "answer": 0,
      "explanation": "Receipt is not inspection proof."
    },
    "expert": {
      "question": "Two drives are missing from a batch; you only photographed the box exterior. What intake process corrects this?",
      "options": [
        "More overall photos",
        "Itemised serials, documented exceptions and signed handoff/reconciliation",
        "A single gross weight"
      ],
      "answer": 1,
      "explanation": "Custody evidence requires item-level records."
    }
  },
  {
    "slug": "device-triage",
    "practitioner": {
      "question": "A boots with unknown SSD status, B has broken LCD, C has hot swollen pack. Order?",
      "options": [
        "Benchmark all immediately",
        "Sell A, repair B, then store C",
        "Quarantine C; verify data/ownership of A; assess B safely"
      ],
      "answer": 2,
      "explanation": "Segregate safety and data risk first."
    },
    "expert": {
      "question": "A device passes RAM tests but has failing SMART and a deteriorated pack. Grade?",
      "options": [
        "Ready to sell because it boots",
        "Defects unresolved pending repair and verification",
        "Cosmetic grade only"
      ],
      "answer": 1,
      "explanation": "Passing one component does not offset known failures."
    }
  },
  {
    "slug": "storage-erasure",
    "practitioner": {
      "question": "An SSD tool reports success but lacks serial and verification result. What can you certify?",
      "options": [
        "A complete destruction certificate",
        "Only operation reported; audited sanitisation evidence incomplete",
        "That the SSD contains no recoverable data"
      ],
      "answer": 1,
      "explanation": "Tool status without traceability is limited."
    },
    "expert": {
      "question": "Power was lost during NVMe sanitize and logs are incomplete. Next action?",
      "options": [
        "Quarantine and perform approved verification/repeat or documented destruction",
        "Trust the command start message",
        "Reformat the filesystem and call it verified"
      ],
      "answer": 0,
      "explanation": "Incomplete execution cannot be treated as confirmed completion."
    }
  },
  {
    "slug": "diagnostic-bench",
    "practitioner": {
      "question": "External video works; internal display is black. What isolation is reasonable?",
      "options": [
        "Replace motherboard",
        "Investigate internal panel/backlight/cable path with compatible safe tests",
        "Replace SSD"
      ],
      "answer": 1,
      "explanation": "External video narrows, but doesn't prove a particular part."
    },
    "expert": {
      "question": "A replacement panel works until the hinge moves. Which hypothesis is most supported?",
      "options": [
        "Windows activation problem",
        "SSD voltage fault",
        "eDP cable or hinge routing defect, investigated unpowered"
      ],
      "answer": 2,
      "explanation": "Mechanical movement correlates with display signal."
    }
  },
  {
    "slug": "battery-safety",
    "practitioner": {
      "question": "A punctured battery arrives unlabelled. What handling should intake record?",
      "options": [
        "Standard test queue",
        "Specialist hazard isolation and safe referral with no charging",
        "Normal laptop accessories"
      ],
      "answer": 1,
      "explanation": "Damaged cells need specialised procedures."
    },
    "expert": {
      "question": "A full battery storage area receives another hot suspect pack. A driver suggests leaving it in a car overnight. What should happen?",
      "options": [
        "Decline uncontrolled intake and invoke approved incident/downstream controls",
        "Accept and reassess tomorrow",
        "Discharge using improvised resistors"
      ],
      "answer": 0,
      "explanation": "Capacity does not justify uncontrolled heat risk."
    }
  },
  {
    "slug": "refurb-upgrades",
    "practitioner": {
      "question": "A slow laptop has an HDD, damaged screen and a 20-minute battery. What is the repair plan based on?",
      "options": [
        "SSD alone",
        "All material defects, parts compatibility, budget and intended use",
        "Install Windows then sell"
      ],
      "answer": 1,
      "explanation": "Treat the whole device and its real use."
    },
    "expert": {
      "question": "A donor panel is the right diagonal size but uses a different connector/pinout. What should you do?",
      "options": [
        "Test hot to check compatibility",
        "Modify the connector",
        "Verify electrical pinout/backlight requirements first; refuse incompatible swaps"
      ],
      "answer": 2,
      "explanation": "Size alone cannot establish electrical safety."
    }
  },
  {
    "slug": "reuse-resale",
    "practitioner": {
      "question": "Boot tests pass but webcam and SD reader are untested. What can your listing say?",
      "options": [
        "Fully tested",
        "State tests and untested features accurately",
        "Mint condition"
      ],
      "answer": 1,
      "explanation": "Claims must reflect evidence."
    },
    "expert": {
      "question": "A refurb exhibits an intermittent fault after sale. What response aligns with Australian Consumer Law?",
      "options": [
        "Investigate, document and provide applicable remedy",
        "Used goods have no consumer guarantees",
        "Refuse because it booted before sale"
      ],
      "answer": 0,
      "explanation": "Business sales of second-hand goods can carry consumer guarantees."
    }
  },
  {
    "slug": "downstream-recycling",
    "practitioner": {
      "question": "A recycler gives a weighbridge ticket only. What does it establish?",
      "options": [
        "Every drive was destroyed",
        "Every component was recovered",
        "The transfer/weight event, not downstream final processing"
      ],
      "answer": 2,
      "explanation": "One stage's receipt isn't full chain evidence."
    },
    "expert": {
      "question": "A mixed batch has drives, lithium packs and PCBs. The processor issues one weight slip. What's missing?",
      "options": [
        "Nothing if total mass is right",
        "Separate data, hazard and downstream category/facility evidence",
        "A marketing sticker"
      ],
      "answer": 1,
      "explanation": "Different risk streams need distinct proofs."
    }
  },
  {
    "slug": "assetflow-basics",
    "practitioner": {
      "question": "Two identical models from different owners appear on one bench. How should records be kept?",
      "options": [
        "Separate assets, job-linked custody records and photos",
        "Combine by model",
        "Track by colour"
      ],
      "answer": 0,
      "explanation": "Identity follows ownership and serial, not retail model."
    },
    "expert": {
      "question": "An item is marked for recycling while its drive erasure has failed. What should AssetFlow require?",
      "options": [
        "An authorised exception/resolution and audit evidence before release",
        "Automatic deletion of the erasure failure",
        "A comment only"
      ],
      "answer": 0,
      "explanation": "Data exceptions require controlled disposition."
    }
  },
  {
    "slug": "repair-cafe-intro",
    "practitioner": {
      "question": "Two radios arrive; one has exposed mains circuitry. Which is the correct station decision?",
      "options": [
        "Let anyone try a quick test",
        "Screen separately and refer hazard to qualified electrical support",
        "Reject all radios"
      ],
      "answer": 1,
      "explanation": "Risk differs by condition, not product label."
    },
    "expert": {
      "question": "Visitor demand doubles mid-event but the supervisor team doesn't grow. What decision is safe?",
      "options": [
        "Increase unsupervised stations",
        "Ignore the queue",
        "Cap intake and offer clear wait/referral alternatives"
      ],
      "answer": 2,
      "explanation": "Demand can't override supervision capacity."
    }
  },
  {
    "slug": "repair-cafe-intake",
    "practitioner": {
      "question": "A toaster trips a power outlet and no electrical specialist is available. What next?",
      "options": [
        "Use a hand tool station",
        "Refer without bench energising, noting the suspected mains fault",
        "Try another socket"
      ],
      "answer": 1,
      "explanation": "Only competent authorised electrical service is appropriate."
    },
    "expert": {
      "question": "A visitor carries a device labelled with someone else's name and requests private file access. What should intake do?",
      "options": [
        "Hold until authority and consent can be established; record limits",
        "Assume possession proves ownership",
        "Copy files to the event laptop"
      ],
      "answer": 0,
      "explanation": "Ownership and consent must be explicit."
    }
  },
  {
    "slug": "repair-cafe-toolkit",
    "practitioner": {
      "question": "After cable adjustment a bicycle brake feels spongy; the owner wants to ride home. What now?",
      "options": [
        "Claim repaired if wheel spins",
        "Do more random tightening",
        "Stop and refer for competent brake assessment"
      ],
      "answer": 2,
      "explanation": "Safety-critical function is not yet verified."
    },
    "expert": {
      "question": "A seized fastener is next to a damaged lithium cell. Which technique is defensible?",
      "options": [
        "Apply heat",
        "Stop at battery hazard; do not use improvised force or heat",
        "Use an impact driver"
      ],
      "answer": 1,
      "explanation": "Hazard overrides repair attempts."
    }
  },
  {
    "slug": "repair-cafe-running",
    "practitioner": {
      "question": "Venue approves sewing and computers, not bikes; two bike volunteers sign up. How do you advertise?",
      "options": [
        "Include bikes anyway",
        "Only approved stations, confirmed capacity, request separate bike permission",
        "Tell people at the door"
      ],
      "answer": 1,
      "explanation": "Scope must match venue approval."
    },
    "expert": {
      "question": "The only approved coordinator cancels three hours before doors open. Substitute has skills but no delegated authority. Next step?",
      "options": [
        "Use continuity plan or postpone and contact attendees",
        "Run under substitute automatically",
        "Backdate an approval"
      ],
      "answer": 0,
      "explanation": "Competence does not invent event authority."
    }
  },
  {
    "slug": "repair-cafe-accessibility",
    "practitioner": {
      "question": "A visitor is deaf and prefers notes; volunteer insists on spoken demonstration. What supports participation?",
      "options": [
        "Speak louder",
        "Write and illustrate steps, confirm preferences, give agency",
        "Ask them to leave"
      ],
      "answer": 1,
      "explanation": "Communication accommodation should follow preference."
    },
    "expert": {
      "question": "A free venue has inaccessible stairs; a suitable venue costs more. What is the better planning judgement?",
      "options": [
        "Cheapest is always fairest",
        "Carry people upstairs",
        "Compare budget and accessibility obligations and seek equitable alternatives"
      ],
      "answer": 2,
      "explanation": "Price alone isn't an accessibility assessment."
    }
  },
  {
    "slug": "things-foundations",
    "practitioner": {
      "question": "The local library wants to lend drills but has no inspection/maintenance capability. Pilot option?",
      "options": [
        "Start manageable low-risk items and defer drills until systems exist",
        "Buy drills to attract signups",
        "Lend untested privately"
      ],
      "answer": 0,
      "explanation": "Interest without capacity is not sufficient."
    },
    "expert": {
      "question": "Item A has high demand and frequent failures; B has moderate demand and low upkeep. Which evaluation is most useful?",
      "options": [
        "Bookings only",
        "Expected utilisation, lifecycle cost, safety and maintenance time",
        "Shelf appearance"
      ],
      "answer": 1,
      "explanation": "Value depends on safe sustained service."
    }
  },
  {
    "slug": "things-catalogue",
    "practitioner": {
      "question": "A returned sewing kit looks complete but is missing a presser foot. Appropriate status?",
      "options": [
        "Returned and available",
        "Borrower problem only",
        "Incomplete pending component-level reconciliation"
      ],
      "answer": 2,
      "explanation": "Component status determines availability."
    },
    "expert": {
      "question": "Three kits share interchangeable parts with different wear. How preserve traceability?",
      "options": [
        "Record component transfers and inspection/test history",
        "Treat them as identical",
        "Delete history after swap"
      ],
      "answer": 0,
      "explanation": "Kit provenance needs component records."
    }
  },
  {
    "slug": "things-maintenance",
    "practitioner": {
      "question": "A functional drill has cracked power lead and loud bearing. Loan status?",
      "options": [
        "Available with warning",
        "Quarantine pending competent assessment",
        "Available to experienced people"
      ],
      "answer": 1,
      "explanation": "Functional outcome doesn't override hazards."
    },
    "expert": {
      "question": "Borrowed power tool comes back wet. Volunteer may not open/electrically test it. Next?",
      "options": [
        "Dry casing and lend immediately",
        "Ask borrower to test",
        "Quarantine and document exposure pending competent checks"
      ],
      "answer": 2,
      "explanation": "Wet electrical items can have hidden issues."
    }
  },
  {
    "slug": "things-service",
    "practitioner": {
      "question": "One item is booked for two weeks; another visitor needs it for tomorrow's fundraiser. Policy?",
      "options": [
        "Use published reservation rules, offer documented agreed exceptions",
        "Fundraiser always wins",
        "Whoever attends first wins"
      ],
      "answer": 0,
      "explanation": "Fair policies guide exceptions."
    },
    "expert": {
      "question": "A borrower is late because accessible transport repeatedly fails. How adapt fairly?",
      "options": [
        "Ban them",
        "Explore documented reasonable adjustments balancing other reservations",
        "Remove all deadlines permanently"
      ],
      "answer": 1,
      "explanation": "Equity, capacity and policy should be considered."
    }
  },
  {
    "slug": "things-launch",
    "practitioner": {
      "question": "Ten proposed items cost $500, only three show demand and two require specialists. Phase-one plan?",
      "options": [
        "Purchase all",
        "Wait indefinitely",
        "Start verified serviceable items and measure use before expansion"
      ],
      "answer": 2,
      "explanation": "Controlled pilot reduces operational exposure."
    },
    "expert": {
      "question": "Pilot has many signups but few loans and a growing repair backlog. Most useful measures?",
      "options": [
        "Completed loans, unmet demand, cancellations and maintenance effort",
        "Signup count only",
        "Number of shelves"
      ],
      "answer": 0,
      "explanation": "Real utilisation and costs predict sustainability."
    }
  },
  {
    "slug": "multimeter-low-voltage",
    "practitioner": {
      "question": "Powered-off circuit gives continuity through parallel components. Does the beep prove the named part is shorted?",
      "options": [
        "Yes always",
        "No; topology and isolation matter",
        "Only for laptops"
      ],
      "answer": 1,
      "explanation": "Parallel paths can create false confidence."
    },
    "expert": {
      "question": "19.5V adapter reads 19.6V unloaded but collapses to 6V under compatible load. Which hypothesis?",
      "options": [
        "Adapter/cable under-load failure to verify by substitution",
        "Screen cable short, proven",
        "Wall outlet needs live probing"
      ],
      "answer": 0,
      "explanation": "Load response suggests supply path but warrants control."
    }
  },
  {
    "slug": "device-identity-locks",
    "practitioner": {
      "question": "Donated laptop shows organisational enrollment during setup. The giver claims it was retired. Next?",
      "options": [
        "Use bypass software",
        "Require legitimate administrator release evidence before reuse",
        "Sell with a disclosure only"
      ],
      "answer": 1,
      "explanation": "Management association is not cleared by retirement claim."
    },
    "expert": {
      "question": "A valid donation includes still-managed encrypted devices. What disposition?",
      "options": [
        "Keep restricted, obtain authorised removal and documented data outcome, reject unresolved units",
        "Bypass management as a repair",
        "Sell for parts without checking embedded media"
      ],
      "answer": 0,
      "explanation": "Ownership and technical/data release are separate gates."
    }
  }
] as const;
export const challenges: Challenge[] = caseBank.flatMap(item => {
  const course = courses.find(c => c.id === item.slug);
  if (!course) throw new Error("Unknown course: " + item.slug);
  return [
    { ...item.practitioner, options: [...item.practitioner.options] as [string,string,string], id: item.slug + ":practitioner", level: 2 as Difficulty, topic: item.slug, programme: course.programme },
    { ...item.expert, options: [...item.expert.options] as [string,string,string], id: item.slug + ":expert", level: 3 as Difficulty, topic: item.slug, programme: course.programme },
    { id: item.slug + ":foundation", level: 1 as Difficulty, topic: item.slug, programme: course.programme,
      question: course.check.question, options: course.check.options, answer: course.check.answer as 0|1|2, explanation: course.check.explanation }
  ];
});
export function practiceBankFor(courseId: string): Challenge[] {
  const course = courses.find(c=>c.id===courseId);
  if (!course) return [];
  return challenges.filter(q => q.topic===courseId || q.programme===course.programme || q.programme==="all");
}
