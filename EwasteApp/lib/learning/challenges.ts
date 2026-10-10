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
        "Propose an interim inventory-only custody agreement and decide sanitisation after acceptance",
        "Arrange a contingent agreement for any devices a releaser says it owns, pending data checks",
        "Decline transfer until lease authority and verified sanitisation/downstream responsibilities are agreed"
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
        "Document legal officers and current functional staff separately, marking reporting lines unverified",
        "Treat the latest legal register as a verified employee reporting chart",
        "Use the current biography for functional leadership but omit date and source limitations"
      ],
      "answer": 0,
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
        "Estimate remaining service years, reliability, total lifecycle cost and environmental assumptions across both options",
        "Prefer the lower initial repair cost if measured energy consumption is similar",
        "Prefer the longer expected lifespan before checking accessibility, software suitability or repair waste"
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
        "Give the faster technician temporary intake ownership while the coordinator audits at day's end",
        "Require observed compliance and specific delegation for either person before solo intake",
        "Give both equal unsupervised access but review only discrepant serials"
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
        "Move the laptop into a monitored temporary holding area, then arrange qualified handling after the event",
        "Stop work, implement the site incident/isolation response now and arrange competent downstream handling",
        "Document the odour and restart investigation once surface temperature returns to normal"
      ],
      "answer": 1,
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
        "Provide an asset-referenced test report, redact reusable secrets and agree a secure separate evidence channel if strictly needed",
        "Give the owner the entire report but retain no internal copy",
        "Produce a summary without serials, defects or test methods to avoid any identifying records"
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
        "Use the accessible venue but reduce available sessions proportionally to pay for it, without community input",
        "Book the cheap venue and offer remote repair advice to anyone unable to use the stairs",
        "Compare access, demand, obligations, available grants and alternate locations, then document a justifiable venue choice"
      ],
      "answer": 2,
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
        "Describe the observed 4/6 boot result with test conditions, standardise power/adapters and repeat before estimating reliability",
        "Stratify the 4/6 success rate by adapter and publish it as a model reliability rate",
        "Retest only previously failed units under identical adapters and exclude earlier successes"
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
        "Refurb the locked device for parts value before obtaining authorisation to release it",
        "Prioritise the authorised cleared unit if resale/use value justifies parts and labour, and keep the locked one on hold",
        "Spend equal time on both because donor receipts are sufficient for data release"
      ],
      "answer": 1,
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
        "Add weight checks at transfer and accept drive counts at supplier level without serials",
        "Use source-linked drive serial reconciliation, signed sealed custody transfers and an immediate mismatch exception",
        "Have staff photograph every box and reconcile serials only at final disposal"
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
        "Grade as tested and usable but disclose SMART and battery as expected age-related wear",
        "Hold as defective until storage/battery decisions and required retests establish safe disposition",
        "Grade as parts-only without checking whether approved repairs would restore utility"
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
        "Quarantine and independently verify an approved sanitisation outcome or arrange traceable destruction",
        "Treat the interrupted sanitize as completed if BIOS no longer identifies the drive",
        "Run a file-level wipe and add a note that the initial command was interrupted"
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
        "Swap a second known-good compatible panel first to confirm the LCD is not faulty",
        "Reinstall graphics software and then measure cable voltage under hinge movement",
        "Investigate the hinge/eDP cable route with power isolated, then verify using exact compatible parts"
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
        "Accept into a separately marked area if the site has no confirmed heat management controls",
        "Decline uncontrolled handoff and activate the site hazard response with qualified collection routing",
        "Ask the driver to wait until the storage area can be rearranged and cooled"
      ],
      "answer": 1,
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
        "Verify panel electrical/pinout compatibility with exact model evidence and decline or source a proper replacement",
        "Order an adapter cable that matches connector shape, then measure compatibility after installation",
        "Swap only if physical connector and mounting holes match, while warning the buyer"
      ],
      "answer": 0,
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
        "Offer an informal partial credit if they agree not to make a warranty claim",
        "Investigate and document an appropriate ACL-compliant remedy without assuming all used goods lack guarantees",
        "Require independent proof of the fault before discussing consumer rights, regardless of circumstances"
      ],
      "answer": 1,
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
        "Track item-level drives, battery hazards and separate category/facility processing evidence tied to signed transfers",
        "Retain the gross slip plus recycler accreditation as complete data destruction and hazard evidence",
        "Use one separate weight total for each material stream without needing final receiving-facility records"
      ],
      "answer": 0,
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
        "Escalate to a lead who can manually overwrite the erasure status while leaving a comment",
        "Permit release on a supervisor's provisional approval, pending certificate after dispatch",
        "Block disposition until an authorised exception or verified sanitisation outcome is recorded with audit trail"
      ],
      "answer": 2,
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
        "Stop taking walk-ins but allow confirmed bookings to use any vacant tools with volunteer oversight",
        "Cap intake based on approved stations and skills, clearly communicate deferrals and referrals",
        "Open an informal assessment-only lane without any check-in to reduce pressure"
      ],
      "answer": 1,
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
        "Hold or refer pending ownership/consent evidence, limit access and document the specific request",
        "Allow device health checks while ownership is verified, but avoid opening the photo library",
        "Record the carrier's verbal assurance and continue only with deleted-files recovery"
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
        "Use cold penetrant and a hand driver with the battery still close to the fastener",
        "Stop near the battery hazard; isolate and refer the device before any fastener-force plan",
        "Remove the nearby lithium pack without further inspection, then resume fastener extraction"
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
        "Follow documented delegation/approval and incident process, otherwise postpone and notify visitors",
        "Have a skilled substitute run a reduced event while seeking retrospective venue authority",
        "Move only the approved stations to another site without recording amended event details"
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
        "Use a larger accessible venue after checking affordability, obligations and inclusive community consultation",
        "Select the stair-only venue but offer advance home visits if sufficient volunteers agree",
        "Choose whichever site fits the current volunteer roster and revisit accessibility after launch"
      ],
      "answer": 0,
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
        "Compare acquisition prices and average shelf demand for both items, leaving servicing estimates for after launch",
        "Compare safe completed loans, downtime, lifecycle cost and equitable access before prioritising investment",
        "Prioritise A's booking backlog if its repairs can be outsourced, without assessing total outsourcing cost"
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
        "Retain component identifiers, transfer links, condition checks and kit history through each swap",
        "Use kit identifiers and record a maintenance event only if the replacement component fails",
        "Photograph exchanged components, and treat the newest kit checklist as sufficient provenance"
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
        "Allow a visual check and a 24-hour dry period, then return to loan if it powers on",
        "Quarantine, record moisture exposure and refer for an approved inspection/test before resuming circulation",
        "Return to service under a borrower warning if the outer housing looks dry"
      ],
      "answer": 1,
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
        "Offer documented, reasonable adjustments within fair booking rules and consider impacts on other borrowers",
        "Grant the same extended period automatically to all borrowers, without reviewing stock turnover",
        "Continue normal penalties but arrange a volunteer pick-up only if the borrower pays an added fee"
      ],
      "answer": 0,
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
        "Track fulfilled loans, unmet demand, cancellation reasons, maintenance time, costs and borrower outcomes",
        "Track registrations and positive feedback, then compare those with monthly stock availability",
        "Track items acquired, donated and under repair separately, and expand if stock value grows"
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
        "Treat the adapter/cable path as suspect and confirm using safe controlled substitution under compatible loading",
        "Prefer replacing the battery first because unloaded voltage is within tolerance",
        "Conclude the laptop input stage is shorted because the load voltage collapses"
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
        "Keep assets restricted, request authorised tenant release and data outcome evidence, and reject unresolved exceptions",
        "Accept the donation as sufficient but defer Microsoft enrolment removal until the eventual buyer registers",
        "Keep the encrypted drives for recycling while reusing the rest without resolving enterprise controls"
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
