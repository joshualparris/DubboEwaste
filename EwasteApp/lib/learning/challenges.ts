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
        "Confirm drive identities, release scope and custody controls before collection",
        "Get manager approval for a later storage audit after the devices arrive"
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
        "Compare battery cost with its estimated scrap value before deciding repair",
        "Choose the refurbished unit because its upfront price is easier to verify",
        "Compare expected useful life, safe repair cost and the owner's actual needs"
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
        "Document the request and pause until authority and supervision are verified",
        "Attempt non-destructive recovery while the coordinator is unavailable",
        "Ask the carrier to confirm consent verbally before accessing file names"
      ],
      "answer": 0,
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
        "Perform the authorised boot check without opening any personal file folders",
        "Review only a small image sample to confirm disk access without copying",
        "Make a temporary encrypted backup and obtain further consent afterwards"
      ],
      "answer": 0,
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
        "Switch to verbal descriptions only, since printed diagrams are inaccessible",
        "Invite a support person to make all decisions while repairs are explained",
        "Ask for preferred format, explain verbally and let the visitor set the pace"
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
        "Record an intermittent failure, test conditions and the movement association",
        "Record the successful cleaning and treat later failures as a new fault",
        "Classify the RAM connection as the likely cause before repeatable testing"
      ],
      "answer": 0,
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
        "Issue a provisional counted receipt and reconcile serials before full acceptance",
        "Issue an accepted-item receipt using the driver-provided model spreadsheet",
        "Hold all items and record nothing until every serial has been verified"
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
        "Test device A's SSD first, store device C separately and queue B for parts",
        "Segregate hot device C, resolve A's data status and assess B's repair safely",
        "Grade B for reuse, quarantine C after arrival and list A as awaiting wipe"
      ],
      "answer": 1,
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
        "Record that the tool ran; sanitisation proof is incomplete without audit evidence",
        "Treat the tool's success flag as evidence of completed erasure for the batch",
        "Issue a conditional certificate using the transfer date instead of the serial"
      ],
      "answer": 0,
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
        "Keep the pack in normal intake until the battery safety lead has assessed it",
        "Photograph the puncture first, then test whether capacity has fallen",
        "Isolate under the battery incident procedure and arrange specialist referral"
      ],
      "answer": 2,
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
        "Start with an SSD because boot time is the most measurable performance defect",
        "Assess all major defects, part costs and intended use before selecting repairs",
        "Replace the LCD and battery first because visible defects affect resale value"
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
        "List all successful tests and clearly identify webcam and reader as untested",
        "Mark the machine fully tested if the camera app and desktop both start",
        "Exclude untested features entirely, since only marketed features count"
      ],
      "answer": 0,
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
        "Evidence of accepted weight/transfer, not confirmed final material processing",
        "Confirmation that all units reached the end recycler named by the driver",
        "A destruction record for the drives if its paperwork lists total kilograms"
      ],
      "answer": 0,
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
        "Assign each radio to a general repairer after a short owner questionnaire",
        "Refuse both radios because the same model has exposed mains in one unit",
        "Screen both separately and refer exposed mains work to qualified services"
      ],
      "answer": 2,
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
        "Have the owner demonstrate the fault using the same outlet but no new tests",
        "Record the mains symptom and refer, without energising it at the repair bench",
        "Allow a visual-only tear-down before referring it to electrical repair staff"
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
        "Pause use and refer for competent brake assessment before claiming success",
        "Request a short test ride to see whether braking pressure improves in use",
        "Tighten the cable within tool limits and record that work as provisional"
      ],
      "answer": 0,
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
        "Begin with manageable low-risk stock and build inspections before adding drills",
        "Offer drill loans with a signed risk waiver until a maintenance role exists",
        "Buy the drills but allow bookings only when borrowed items appear undamaged"
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
        "Mark returned with a note asking borrowers to supply the missing component",
        "Set kit to incomplete until the specialist foot is reconciled and documented",
        "Keep available, but include a warning at checkout that the foot is missing"
      ],
      "answer": 1,
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
        "Apply published booking priority and discuss any recorded, agreed exception",
        "Prioritise the fundraiser if it has a larger predicted community benefit",
        "Keep the earliest booking unless the second borrower can collect sooner"
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
