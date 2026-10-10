import { courses } from "./catalog";
import type { Challenge, Difficulty } from "./adaptive";

/** Fictional, assessable decisions. Safety and training authorisation still require observed checks. */
const caseBank = [
  {
    "slug": "dubbo-ewaste-uncontacted-leads",
    "practitioner": {
      "question": "Five laptops have fleet manager release but unknown drive inventory. Next step?",
      "options": [
        "Collect only machines listed by model, then reconcile missing drive details",
        "Confirm drives, release scope and custody controls before collection",
        "Get manager approval for a later storage audit after the devices arrive"
      ],
      "answer": 1,
      "explanation": "Uncontrolled storage and custody are unresolved."
    },
    "expert": {
      "question": "A leased batch includes customer files and your pilot cannot audit sanitisation. What do you offer?",
      "options": [
        "Offer a temporary intake agreement and revisit storage controls at first processing",
        "Agree only to inventoried chassis while leaving drives with the current holder",
        "Defer transfer until lease authority and audited data handling are confirmed"
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
        "Ask the current local team about roster, call-outs and actual allowances",
        "Compare the regional job advert with another provider's advertised hours",
        "Infer on-call hours from the company's published 24/7 customer support"
      ],
      "answer": 0,
      "explanation": "Service hours alone do not prove staff conditions."
    },
    "expert": {
      "question": "A 2006 director listing contradicts current company records and an undated staff biography. What can an org chart assert?",
      "options": [
        "Distinguish dated legal officers from staff roles; keep reporting lines unverified",
        "Use current registered officers as a proxy for internal line-reporting relationships",
        "Follow the newest biography for operational roles without validating dates"
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
        "Compare battery cost with its estimated scrap value before deciding repair",
        "Choose the refurbished unit because its upfront price is easier to verify",
        "Compare useful life, safe repair cost and the owner's needs"
      ],
      "answer": 2,
      "explanation": "Compare real usable outcomes."
    },
    "expert": {
      "question": "A cheaper repair would make an inefficient device usable for only six months, while a more expensive refurb may last three years. Best evaluation?",
      "options": [
        "Compare service years, reliability, lifecycle cost and likely impacts",
        "Choose repair when its upfront cost is less than half the refurbished option",
        "Choose refurb when expected lifespan is greater, without checking suitability"
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
        "Record the request and pause until consent and supervision are verified",
        "Attempt non-destructive recovery while the coordinator is unavailable",
        "Ask the carrier to confirm consent verbally before accessing file names"
      ],
      "answer": 0,
      "explanation": "Physical possession is not data access permission."
    },
    "expert": {
      "question": "A fast volunteer skips serial recording; a slower one follows all checks. Who should run intake unsupervised?",
      "options": [
        "Let the fast technician receive stock while another volunteer audits every tenth item",
        "Authorise solo intake only after checking process competence and delegation",
        "Roster the slower volunteer alone because following procedures proves all skills"
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
        "Use a charging test to determine whether the warm pack remains serviceable",
        "Isolate the hazard under site procedure and request qualified handling",
        "Store it in regular stock but label the known pack damage for later review"
      ],
      "answer": 1,
      "explanation": "Hazard comes before function."
    },
    "expert": {
      "question": "A pack emits solvent odour and intermittent heat without swelling during a public event. What should the coordinator do?",
      "options": [
        "Isolate in a monitored area, defer formal incident handling until after the event",
        "Follow the site incident controls now and refer for competent battery handling",
        "Record temperature changes and resume work if heat and odour disappear"
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
        "Perform the consented boot test without opening private folders",
        "Review only a small image sample to confirm disk access without copying",
        "Make a temporary encrypted backup and obtain further consent afterwards"
      ],
      "answer": 0,
      "explanation": "Test permission is scope-limited."
    },
    "expert": {
      "question": "A customer wants a report containing passwords and all personal details. What report is defensible?",
      "options": [
        "Include a full local copy but encrypt the file and give access only to the owner",
        "Issue an asset-linked report without secrets; agree a safe evidence channel",
        "Use a summary with no identifiers or test details to minimise future retention"
      ],
      "answer": 1,
      "explanation": "Proof does not require credentials."
    }
  },
  {
    "slug": "kind-communication",
    "practitioner": {
      "question": "A visitor with low vision cannot follow tiny diagrams. What preserves their agency?",
      "options": [
        "Switch to verbal descriptions only, since printed diagrams are inaccessible",
        "Invite a support person to make all decisions while repairs are explained",
        "Ask preferred format, describe steps and let the visitor guide pace"
      ],
      "answer": 2,
      "explanation": "Accessible teaching starts with preference."
    },
    "expert": {
      "question": "Two repair visitors need different accessibility support and the roster is full. How should the lead decide?",
      "options": [
        "Give priority to the urgent repair while offering a later accessible time slot",
        "Use fair capacity rules and accessible communication or referral",
        "Give each visitor equal bench time regardless of differing support requirements"
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
        "Record intermittent failure and movement-related test conditions",
        "Record the successful cleaning and treat later failures as a new fault",
        "Classify the RAM connection as the likely cause before repeatable testing"
      ],
      "answer": 0,
      "explanation": "Observation is not root cause."
    },
    "expert": {
      "question": "Four of six machines booted, but half used different adapters. What can you conclude?",
      "options": [
        "Report test conditions and rerun with standard power before claiming reliability",
        "Use the four successful devices to estimate model reliability with a wide confidence band",
        "Report success separately by adapter type and treat each small group as conclusive"
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
        "Quote the hinge alone and review battery performance only after completing it",
        "Compare total repair cost and useful life against alternatives for the owner",
        "Assume the battery must be replaced and defer the hinge quote until then"
      ],
      "answer": 1,
      "explanation": "Lifecycle and total cost matter."
    },
    "expert": {
      "question": "A locked device needs $30 in parts; an unlocked cleared device needs $90. Which should receive limited refurb time?",
      "options": [
        "Refurb the cheapest device first and seek enterprise unlock before listing it",
        "Prioritise the released unit if expected value justifies cost",
        "Split time across both devices to reduce the chance of missing valuable parts"
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
        "Issue provisional receipt; reconcile serials before accepting the lot",
        "Issue an accepted-item receipt using the driver-provided model spreadsheet",
        "Hold all items and record nothing until every serial has been verified"
      ],
      "answer": 0,
      "explanation": "Receipt is not inspection proof."
    },
    "expert": {
      "question": "Two drives are missing from a batch; you only photographed the box exterior. What intake process corrects this?",
      "options": [
        "Add transfer weights and batch-level drive totals, then investigate discrepancies later",
        "Record drive serials and handoff signatures; reconcile missing drives immediately",
        "Retain exterior box photos and verify component inventories at final disposal"
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
        "Test device A's SSD first, store device C separately and queue B for parts",
        "Isolate hot C, verify A's data status and assess B's repair",
        "Grade B for reuse, quarantine C after arrival and list A as awaiting wipe"
      ],
      "answer": 1,
      "explanation": "Segregate safety and data risk first."
    },
    "expert": {
      "question": "A device passes RAM tests but has failing SMART and a deteriorated pack. Grade?",
      "options": [
        "Classify ready-to-repair if the SMART warning hasn't caused user-visible failure",
        "Hold for disposition until SSD and battery defects are assessed and resolved",
        "Grade parts-only now because a failing storage device makes reuse uneconomic"
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
        "Record tool operation only; audited sanitisation remains unproven",
        "Treat the tool's success flag as evidence of completed erasure for the batch",
        "Issue a conditional certificate using the transfer date instead of the serial"
      ],
      "answer": 0,
      "explanation": "Tool status without traceability is limited."
    },
    "expert": {
      "question": "Power was lost during NVMe sanitize and logs are incomplete. Next action?",
      "options": [
        "Reissue sanitize once and treat a successful tool message as the missing audit proof",
        "Quarantine, verify a valid approved outcome or arrange evidenced destruction",
        "Remove old partitions and retain the incomplete command log as corroboration"
      ],
      "answer": 1,
      "explanation": "Incomplete execution cannot be treated as confirmed completion."
    }
  },
  {
    "slug": "diagnostic-bench",
    "practitioner": {
      "question": "External video works; internal display is black. What isolation is reasonable?",
      "options": [
        "Replace the LCD first because the external display has confirmed video output",
        "Check the internal panel, power/backlight and cable using compatible tests",
        "Reinstall the graphics driver to exclude a software-controlled display blank"
      ],
      "answer": 1,
      "explanation": "External video narrows, but doesn't prove a particular part."
    },
    "expert": {
      "question": "A replacement panel works until the hinge moves. Which hypothesis is most supported?",
      "options": [
        "Use another matched panel first; a movement-related cable fault is still unproven",
        "Inspect the eDP/hinge route with power isolated, then verify matched components",
        "Reinstall drivers and compare brightness values during hinge movement"
      ],
      "answer": 1,
      "explanation": "Mechanical movement correlates with display signal."
    }
  },
  {
    "slug": "battery-safety",
    "practitioner": {
      "question": "A punctured battery arrives unlabelled. What handling should intake record?",
      "options": [
        "Keep the pack in normal intake until the battery safety lead has assessed it",
        "Photograph the puncture first, then test whether capacity has fallen",
        "Use the battery incident procedure and arrange specialist referral"
      ],
      "answer": 2,
      "explanation": "Damaged cells need specialised procedures."
    },
    "expert": {
      "question": "A full battery storage area receives another hot suspect pack. A driver suggests leaving it in a car overnight. What should happen?",
      "options": [
        "Hold intake outside the crowded bay until the storage temperature is checked",
        "Decline uncontrolled handoff and invoke approved specialist controls",
        "Accept temporarily if a driver stays onsite until storage space is cleared"
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
        "Start with an SSD because boot time is the most measurable performance defect",
        "Assess defects, costs and intended use before approving repairs",
        "Replace the LCD and battery first because visible defects affect resale value"
      ],
      "answer": 1,
      "explanation": "Treat the whole device and its real use."
    },
    "expert": {
      "question": "A donor panel is the right diagonal size but uses a different connector/pinout. What should you do?",
      "options": [
        "Verify exact cable and backlight electrical compatibility; reject unproven swaps",
        "Source a mechanical adapter first, then evaluate signal compatibility in software",
        "Use matching screen size and mounting points to minimise connector mismatch"
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
        "List verified tests; identify webcam and reader as untested",
        "Mark the machine fully tested if the camera app and desktop both start",
        "Exclude untested features entirely, since only marketed features count"
      ],
      "answer": 0,
      "explanation": "Claims must reflect evidence."
    },
    "expert": {
      "question": "A refurb exhibits an intermittent fault after sale. What response aligns with Australian Consumer Law?",
      "options": [
        "Offer a goodwill credit after the buyer confirms no formal remedy is requested",
        "Investigate the reported fault and provide applicable ACL remedy with records",
        "Require independent fault evidence before reviewing any consumer entitlement"
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
        "Proof of transfer and weight, not full downstream material processing",
        "Confirmation that all units reached the end recycler named by the driver",
        "A destruction record for the drives if its paperwork lists total kilograms"
      ],
      "answer": 0,
      "explanation": "One stage's receipt isn't full chain evidence."
    },
    "expert": {
      "question": "A mixed batch has drives, lithium packs and PCBs. The processor issues one weight slip. What's missing?",
      "options": [
        "Require separate signed evidence for drives, batteries and final destinations",
        "Accept a certified recycler's gross weight slip for all specialist waste streams",
        "Track material-category weights but obtain receiving-facility evidence later"
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
        "Combine the two models in a batch record but keep the owner notes separately",
        "Create distinct asset IDs linked to each owner, job and custody evidence",
        "Keep one asset ID but distinguish both units by their photograph timestamps"
      ],
      "answer": 1,
      "explanation": "Identity follows ownership and serial, not retail model."
    },
    "expert": {
      "question": "An item is marked for recycling while its drive erasure has failed. What should AssetFlow require?",
      "options": [
        "Allow a supervisor to overwrite the erasure status with an attached comment",
        "Block release until erasure is verified or an authorised exception is logged",
        "Release to recycler pending its destruction certificate and reconcile afterward"
      ],
      "answer": 1,
      "explanation": "Data exceptions require controlled disposition."
    }
  },
  {
    "slug": "repair-cafe-intro",
    "practitioner": {
      "question": "Two radios arrive; one has exposed mains circuitry. Which is the correct station decision?",
      "options": [
        "Assign each radio to a general repairer after a short owner questionnaire",
        "Refuse both radios because the same model has exposed mains in one unit",
        "Screen separately; refer exposed mains to qualified services"
      ],
      "answer": 2,
      "explanation": "Risk differs by condition, not product label."
    },
    "expert": {
      "question": "Visitor demand doubles mid-event but the supervisor team doesn't grow. What decision is safe?",
      "options": [
        "Cap walk-ins first but continue confirmed work even beyond approved staffing levels",
        "Set capacity by staffed stations; communicate deferred bookings and referrals",
        "Open a separate visual triage queue without the full intake procedure"
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
        "Have the owner demonstrate the fault using the same outlet but no new tests",
        "Record mains hazard and refer without powering it at the bench",
        "Allow a visual-only tear-down before referring it to electrical repair staff"
      ],
      "answer": 1,
      "explanation": "Only competent authorised electrical service is appropriate."
    },
    "expert": {
      "question": "A visitor carries a device labelled with someone else's name and requests private file access. What should intake do?",
      "options": [
        "Record unresolved ownership; restrict access until consent is verified",
        "Perform external-only health checks while consent is being established",
        "Proceed with recovered data if the visitor signs a broad on-arrival waiver"
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
        "Pause use and refer for a qualified brake assessment",
        "Request a short test ride to see whether braking pressure improves in use",
        "Tighten the cable within tool limits and record that work as provisional"
      ],
      "answer": 0,
      "explanation": "Safety-critical function is not yet verified."
    },
    "expert": {
      "question": "A seized fastener is next to a damaged lithium cell. Which technique is defensible?",
      "options": [
        "Use a hand driver and cold penetrant only, leaving the pack undisturbed nearby",
        "Stop at the battery hazard and refer before considering any fastener repair",
        "Remove the suspect battery at a general hand-tool station before proceeding"
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
        "Advertise bikes as subject to approval while confirming numbers on the day",
        "Publish only permitted stations and seek separate venue approval for bikes",
        "Ask bike volunteers to work outdoors, where venue restrictions may not apply"
      ],
      "answer": 1,
      "explanation": "Scope must match venue approval."
    },
    "expert": {
      "question": "The only approved coordinator cancels three hours before doors open. Substitute has skills but no delegated authority. Next step?",
      "options": [
        "Proceed with the qualified substitute and request delegated authority afterward",
        "Use the approved continuity plan or postpone when coordinator authority is absent",
        "Move the event to another public room while venue approval is clarified"
      ],
      "answer": 1,
      "explanation": "Competence does not invent event authority."
    }
  },
  {
    "slug": "repair-cafe-accessibility",
    "practitioner": {
      "question": "A visitor is deaf and prefers notes; volunteer insists on spoken demonstration. What supports participation?",
      "options": [
        "Offer only written instructions and let the visitor adapt them independently",
        "Ask the visitor's preference and use suitable written or visual explanation",
        "Have another attendee translate the spoken demonstration without asking"
      ],
      "answer": 1,
      "explanation": "Communication accommodation should follow preference."
    },
    "expert": {
      "question": "A free venue has inaccessible stairs; a suitable venue costs more. What is the better planning judgement?",
      "options": [
        "Use the low-cost venue but create an appointment-only alternative for some visitors",
        "Compare access duties, realistic costs and inclusive alternatives before choosing",
        "Book the accessible venue only if a sponsorship target is reached beforehand"
      ],
      "answer": 1,
      "explanation": "Price alone isn't an accessibility assessment."
    }
  },
  {
    "slug": "things-foundations",
    "practitioner": {
      "question": "The local library wants to lend drills but has no inspection/maintenance capability. Pilot option?",
      "options": [
        "Start with lower-risk stock; build inspections before lending drills",
        "Offer drill loans with a signed risk waiver until a maintenance role exists",
        "Buy the drills but allow bookings only when borrowed items appear undamaged"
      ],
      "answer": 0,
      "explanation": "Interest without capacity is not sufficient."
    },
    "expert": {
      "question": "Item A has high demand and frequent failures; B has moderate demand and low upkeep. Which evaluation is most useful?",
      "options": [
        "Compare acquisition price and bookings, then estimate breakdown costs later",
        "Measure safe completed loans, downtime, lifecycle cost and equitable access",
        "Prioritise the highly booked item if repairs can be outsourced at short notice"
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
        "Mark returned with a note asking borrowers to supply the missing component",
        "Mark the kit incomplete until the missing foot is reconciled",
        "Keep available, but include a warning at checkout that the foot is missing"
      ],
      "answer": 1,
      "explanation": "Component status determines availability."
    },
    "expert": {
      "question": "Three kits share interchangeable parts with different wear. How preserve traceability?",
      "options": [
        "Log each component transfer, condition check and kit membership change",
        "Track exchanges by kit only and audit individual parts at annual stocktake",
        "Photograph exchanged components and overwrite the previous component list"
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
        "Keep available to experienced borrowers, with faults recorded at handoff",
        "Inspect visually at intake and loan after the housing passes a wipe-down",
        "Quarantine the drill pending competent assessment of lead and bearing"
      ],
      "answer": 2,
      "explanation": "Functional outcome doesn't override hazards."
    },
    "expert": {
      "question": "Borrowed power tool comes back wet. Volunteer may not open/electrically test it. Next?",
      "options": [
        "Wait until dry externally, then allow a supervised functional test at handoff",
        "Quarantine wet equipment pending competent return-to-loan checks",
        "Loan with a wet-use advisory after the battery or power cord is removed"
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
        "Apply published priorities and discuss documented exceptions",
        "Prioritise the fundraiser if it has a larger predicted community benefit",
        "Keep the earliest booking unless the second borrower can collect sooner"
      ],
      "answer": 0,
      "explanation": "Fair policies guide exceptions."
    },
    "expert": {
      "question": "A borrower is late because accessible transport repeatedly fails. How adapt fairly?",
      "options": [
        "Agree a documented adjustment within fair booking rules and assess impact",
        "Extend all loan periods by default so the same rule applies to everyone",
        "Keep the usual fees but offer a discretionary exception after three delays"
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
        "Order the ten items but offer only the three with verified demand initially",
        "Pilot serviceable demand-backed stock and define expansion thresholds",
        "Purchase the cheapest items to increase variety with the available budget"
      ],
      "answer": 1,
      "explanation": "Controlled pilot reduces operational exposure."
    },
    "expert": {
      "question": "Pilot has many signups but few loans and a growing repair backlog. Most useful measures?",
      "options": [
        "Track loans, unmet demand, cancellations and maintenance burden",
        "Use registrations and positive feedback as the early signal for expansion",
        "Track stock value and maintenance backlog before buying more equipment"
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
        "A beep is suggestive; test continuity again with a different meter range",
        "No: parallel paths require schematic context and controlled isolation",
        "A beep proves a zero-ohm fault only when the board is disconnected"
      ],
      "answer": 1,
      "explanation": "Parallel paths can create false confidence."
    },
    "expert": {
      "question": "19.5V adapter reads 19.6V unloaded but collapses to 6V under compatible load. Which hypothesis?",
      "options": [
        "Test the adapter under compatible load and compare a known-good unit",
        "Replace the laptop battery first and remeasure unloaded adapter voltage",
        "Conclude the laptop DC input stage has failed because its load is too high"
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
        "Require verified authorised tenant/device release before promising reuse",
        "Treat a written donation as enough and note the enrolment for the new user",
        "Use recovery mode to erase user files and check whether enrolment returns"
      ],
      "answer": 0,
      "explanation": "Management association is not cleared by retirement claim."
    },
    "expert": {
      "question": "A valid donation includes still-managed encrypted devices. What disposition?",
      "options": [
        "Hold in custody pending tenant release and verified data outcomes",
        "Treat the donation letter as release but remove encrypted drives at resale",
        "Resell for parts if MDM remains and record the account lock in the listing"
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
