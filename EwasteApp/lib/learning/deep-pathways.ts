/** External course comparisons checked against named provider pages, 11 Oct 2026.
 * Full provider programmes are not equivalent to 3-lesson internal orientations.
 * Access terms may change; verify enrolment details on each provider site.
 */
export type DeepPathway = {
 slug:string;benchmark:string;target:string;limits:string;
 resources: {title:string;provider:string;url:string;access:string;kind:string;why:string}[];
 cases:{prompt:string;workedAnswer:string;safety:string}[];
};
export const deepPathways: DeepPathway[] = [
  {
    "slug": "repair-cafe-running",
    "benchmark": "AssetFlow's three orientation lessons explain the monthly Repair Café concept but cannot demonstrate capacity decisions or incident handling. The connected JoshHub simulator now records irrevocable first decisions, operational consequences and a reviewable event portfolio, while regulator guidance provides a real risk-management framework.",
    "target": "Develop an approved and realistic event brief: documented venue/date and permitted activities, accepted roster with backups, accessible floor plan, consent/triage controls, emergency and exclusions plan, visitor flow, and a measurable next-event improvement. Demonstrate a complete simulated event, including defensible incident recovery and an evidence-based debrief.",
    "limits": "This is a fictional training exercise, not permission to hold an actual event. Local council/venue approvals, insurance, WHS, privacy, electrical competency and volunteer consent must be verified separately. The simulator and public resources do not grant qualifications.",
    "resources": [
      {
        "title": "Run Your Own Repair Café — interactive command desk",
        "provider": "JoshHub Learning Lab",
        "url": "https://josh-hub-96no.vercel.app/learn/repair-cafe-simulator",
        "access": "Free interactive simulation; progress kept on learner's browser; AI assessment requires the owner's configured Groq service",
        "kind": "Practical simulation",
        "why": "Make and log seven event-day choices, see effects on staffing, queue and trust, recover safely and export an auditable fictional learning portfolio."
      },
      {
        "title": "Event risk assessment and management",
        "provider": "NSW Government Event Starter Guide",
        "url": "https://www.nsw.gov.au/departments-and-agencies/premiers-department/community-engagement/event-starter-guide/risk-assessment-management",
        "access": "Free · Australian government primary guidance",
        "kind": "Official planning reference",
        "why": "Build a hazard register, controls, ownership and ongoing event monitoring. Use an actual venue-specific risk process before public events."
      },
      {
        "title": "Repair Café house rules",
        "provider": "Repair Café International",
        "url": "https://www.repaircafe.org/en/house-rules/",
        "access": "Free · primary guidance",
        "kind": "Volunteer and visitor charter",
        "why": "Establish what repair-together means, expectations about items, volunteers, no guaranteed repairs and one-item-first queue. Review any liability statements against applicable local law rather than assuming a waiver removes statutory obligations."
      },
      {
        "title": "Fifteen years of Repair Café — documentary",
        "provider": "Repair Café International",
        "url": "https://www.repaircafe.org/en/anniversary-documentary-on-15-years-of-repair-cafe/",
        "access": "Free · external video, English subtitles stated by publisher",
        "kind": "Video and analysis",
        "why": "Observe a community-repair learning culture, then note one feature you would adopt and one that needs local adaptation."
      },
      {
        "title": "Restart Radio — community repair conversations",
        "provider": "The Restart Project",
        "url": "https://therestartproject.org/podcast/",
        "access": "Free · podcast; individual episodes may vary",
        "kind": "Audio and reflection",
        "why": "Listen for evidence about volunteer retention, learning, repair outcomes and collaboration before writing your event plan."
      }
    ],
    "cases": [
      {
        "prompt": "Two days before the first advertised Saturday, your sewing and computer volunteers are confirmed but the event lead is unavailable. The library room has only provisional permission and bicycle fixes are not permitted. Explain whether you open, reduce scope, postpone or move, and show the exact confirmation and communication gates.",
        "workedAnswer": "Do not assume that a volunteer's skills confer event-lead accountability or that a tentative venue is approved. Confirm a responsible lead, a written venue/date/approved scope, suitable cover and any safety plan first. If those gates cannot be met, cancel/postpone and communicate clearly to volunteers/visitors; do not announce bike services. Evidence: roles, written venue permission, published messaging and decision timestamp. Compare the cost of disappointing an early small audience with the consequences of an unapproved event.",
        "safety": "Never treat an EOI, generic volunteer availability or verbal permission as consent to a specific shift, site or repair category."
      },
      {
        "prompt": "At 11:00 the welcome desk is unattended, five new visitors arrive, a kettle has a damaged mains lead and a laptop owner offers their password while leaving. Set a defensible queue, safeguarding and referral response, with realistic staffing trade-offs and near-miss records.",
        "workedAnswer": "Pause or limit new arrivals while allocating a confirmed competent welcome substitute; record any role change and provide realistic waits/referrals. Do not energise the kettle or accept it for unapproved electrical work; explain the safe qualified pathway. Do not take unattended laptop custody or passwords. Give visitors clear expectations, retain minimal necessary information and protect access routes. Record both choices and impacts on backlog and volunteer energy, not imaginary repair success.",
        "safety": "A waiver cannot establish competence or authorise work outside the agreed scope. Do not request or store real customer passwords in training."
      },
      {
        "prompt": "The event ends with 17 arrivals, four repairs, six diagnoses/referrals, three safety declines and four attendees still waiting. A volunteer proposes reporting 17 items as diverted from landfill. Draft a truthful outcome report and a single measurable next-month improvement with a named owner.",
        "workedAnswer": "Do not report 17 items as waste diverted: arrival, attempted repair and successful repair are different outcomes. Explain what happened to the four waiting visitors and confirm all items were returned to owners. Report the four repaired and six diagnosed/referred separately, with any consent and classification limitations. Prioritise one change (e.g. a 30-minute intake cut-off, additional accepted welcome coverage or category-specific capacity) owned by the event lead, then compare queue/wait records at the next event. Attribute all numbers to this fictional worked case, not actual Dubbo data.",
        "safety": "Do not overstate recycling diversion, publish personal attendance data or imply a volunteer owes ongoing shifts."
      }
    ]
  },
  {
    "slug": "repair-electrical-safety",
    "benchmark": "SafeWork NSW safety guidance and formal PAT training cover hazard assessment, de-energisation, testing competence and regulatory context; our existing lesson only names hazards.",
    "target": "Produce a reasoned risk assessment with energy-source map, isolation state, escalation threshold and record of who may authorise the work.",
    "limits": "Formal NSW competency/licensing rules still apply. An online course never authorises mains wiring work.",
    "resources": [
      {
        "title": "SafeWork NSW: Electrical Work",
        "provider": "SafeWork NSW",
        "url": "https://www.safework.nsw.gov.au/hazards-a-z/electrical-and-power/electrical-work",
        "access": "Free · regulator guidance",
        "kind": "Official safety standard/guidance",
        "why": "Why work on energised systems is restricted; the difference between isolate, test and authorise."
      },
      {
        "title": "Appliance Testing Fundamentals",
        "provider": "Alison",
        "url": "https://alison.com/course/appliance-testing-fundamentals",
        "access": "Free learning · optional paid certificate",
        "kind": "Structured 4–5 hour course",
        "why": "Examines appliance classes, risk and testing principles. Its jurisdiction-specific law is not NSW law."
      }
    ],
    "cases": [
      {
        "prompt": "A returned laptop and monitor are sitting beside a damaged mains power strip. Identify the three independent energy sources and rank which assets can be safely examined without energisation.",
        "workedAnswer": "Name the power-strip hazard, laptop battery and any stored energy; justify where the volunteer stops.",
        "safety": "Unsafe mains equipment is quarantined; opening a power supply or testing it live is excluded."
      },
      {
        "prompt": "A person insists an unplugged television is safe. Explain capacitor stored energy with E = ½CV² and why a 'plug out' check is insufficient.",
        "workedAnswer": "For a hypothetical 470 µF capacitor at 325 V, compute about 24.8 J of stored energy. This is a paper calculation ONLY.",
        "safety": "Correct numerical reasoning does not authorise capacitor discharge or power supply repair."
      },
      {
        "prompt": "Design a 1-page stop-work protocol for a Repair Café volunteer handling a damaged mains kettle.",
        "workedAnswer": "Specify visual indicators, competent-person referral, customer consent, quarantine and release sign-off.",
        "safety": "Explicitly reject a 'plug in and see' approach."
      }
    ]
  },
  {
    "slug": "repair-lithium-batteries",
    "benchmark": "Texas Instruments offers a multi-part battery management engineering series, well beyond a list of swollen-battery warning signs.",
    "target": "Explain charge regulation, protection FETs, fuel gauging and isolation decisions without attempting hazardous cell-level repair.",
    "limits": "No practice on swollen, leaking or unknown loose lithium cells; supervised specialist handling only.",
    "resources": [
      {
        "title": "Battery Management Deep Dive",
        "provider": "Texas Instruments",
        "url": "https://www.ti.com/video/series/battery-management-deep-dive-on-demand-technical-training.html",
        "access": "Free · expert video series",
        "kind": "Engineering training series",
        "why": "Explore lithium chemistry, charge controllers, protection, state-of-charge and monitoring."
      },
      {
        "title": "What to do with a swollen battery",
        "provider": "iFixit",
        "url": "https://www.ifixit.com/Wiki/What_to_do_with_a_swollen_battery",
        "access": "Free · repair safety guide",
        "kind": "Safety-specific reference",
        "why": "Recognise swelling and know when to shut down, isolate and refer."
      }
    ],
    "cases": [
      {
        "prompt": "A device with a 3-cell pack will charge but immediately shuts down without the adaptor. List credible causes without opening the pack.",
        "workedAnswer": "Separate weak cells, BMS state, connector fault and firmware reporting; propose only non-invasive checks.",
        "safety": "Do not short, bypass or solder cells. No practice on swollen, leaking or unknown loose lithium cells; supervised specialist handling only."
      },
      {
        "prompt": "A stored tablet is pushing its display outward. Record a quarantine decision and handoff plan.",
        "workedAnswer": "List why charging and exploratory prying must stop, who is contacted and where the record is kept.",
        "safety": "No DIY cell removal as an assessment. No practice on swollen, leaking or unknown loose lithium cells; supervised specialist handling only."
      },
      {
        "prompt": "Explain why measuring one battery terminal voltage does not prove lithium pack health.",
        "workedAnswer": "Discuss voltage versus capacity, internal resistance, balancing, protection and current delivery.",
        "safety": "Do not infer 'safe to use' from a voltage number."
      }
    ]
  },
  {
    "slug": "repair-circuit-fundamentals",
    "benchmark": "MIT 6.002 provides full lecture videos, problem sets and exams; OpenLearn offers a ten-hour interactive course. Both go well beyond three short lessons.",
    "target": "Solve resistor networks, Kirchhoff equations, RC time constants and realistic fault calculations, then validate them against simulated low-voltage circuits.",
    "limits": "Breadboards/simulations use current-limited extra-low-voltage sources only.",
    "resources": [
      {
        "title": "6.002 Circuits and Electronics",
        "provider": "MIT OpenCourseWare",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/",
        "access": "Free · university course",
        "kind": "Lectures, problems and exams",
        "why": "Rigorous network analysis, MOS devices, amplifiers and energy storage."
      },
      {
        "title": "An Introduction to Electronics",
        "provider": "The Open University — OpenLearn",
        "url": "https://www.open.edu/openlearn/science-maths-technology/an-introduction-electronics/content-section-0?intro=1",
        "access": "Free · 10-hour course",
        "kind": "Interactive course",
        "why": "Circuit rules, dividers, Wheatstone bridges and waveform processing."
      },
      {
        "title": "Introduction to Electronics",
        "provider": "Georgia Tech / Coursera",
        "url": "https://www.coursera.org/learn/electronics",
        "access": "Platform enrolment terms apply",
        "kind": "Seven-module assessed course",
        "why": "Diodes, transistors, op-amps and circuit modelling with about 70 assignments."
      }
    ],
    "cases": [
      {
        "prompt": "Design a 5 V LED circuit assuming LED Vf = 2 V and target 8 mA.  Show all equations, units, intermediate values and assumptions before comparing with the expected result.",
        "workedAnswer": "R ≈ 375 Ω, so 390 Ω standard resistor gives ≈ 7.7 mA; P resistor ≈ 0.023 W.",
        "safety": "Show calculation, component tolerance and resistor-rating margin."
      },
      {
        "prompt": "For a 10 kΩ/10 kΩ divider connected to 5 V, predict output both unloaded and after adding a 10 kΩ load.",
        "workedAnswer": "Unloaded 2.5 V; with load in parallel, lower leg ≈ 5 kΩ, output ≈ 1.67 V.",
        "safety": "Explain why real meter input resistance matters."
      },
      {
        "prompt": "Model a 10 kΩ resistor charging a 100 µF capacitor from a 5 V supply.  Show all equations, units, intermediate values and assumptions before comparing with the expected result.",
        "workedAnswer": "Time constant τ=1 s; after one τ ≈ 3.16 V; after three τ ≈ 4.75 V.",
        "safety": "Simulate it; don't experiment on large/high-voltage capacitors."
      }
    ]
  },
  {
    "slug": "repair-multimeter-diagnostics",
    "benchmark": "Professional measurement training asks for expected readings, uncertainties, category limits and troubleshooting hypotheses; our lesson only says which sockets to use.",
    "target": "Show a measurement plan, expected range and interpretation for multiple possible failure modes.",
    "limits": "Only safe, documented low-voltage circuits and powered-off resistance checks.",
    "resources": [
      {
        "title": "How to Use a Multimeter",
        "provider": "iFixit",
        "url": "https://www.ifixit.com/Guide/How+To+Use+A+Multimeter/25632",
        "access": "Free · illustrated guide",
        "kind": "Step-by-step learning",
        "why": "Strong visual introduction to controls and test modes."
      },
      {
        "title": "How to Use a Multimeter",
        "provider": "SparkFun",
        "url": "https://learn.sparkfun.com/tutorials/how-to-use-a-multimeter",
        "access": "Free · archived tutorial",
        "kind": "Technical reference",
        "why": "Covers voltage, current, resistance, continuity and fuse replacement; vendor marks this tutorial retired."
      },
      {
        "title": "6.002 Circuits and Electronics",
        "provider": "MIT OpenCourseWare",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/",
        "access": "Free · university course",
        "kind": "Depth beyond basic meter operation",
        "why": "Expected circuit values and measurement reasoning."
      }
    ],
    "cases": [
      {
        "prompt": "A known 3 V supply reads 2.7 V no-load and 1.5 V with an approved dummy load. Explain two plausible hypotheses.",
        "workedAnswer": "Source internal resistance and wiring/contact resistance; a single no-load reading is not diagnostic.",
        "safety": "Avoid battery shorting or unrestricted current tests."
      },
      {
        "prompt": "A powered-off 1 kΩ resistor measures 700 Ω in circuit. Can it be rejected?  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "Not without considering parallel components and circuit topology.",
        "safety": "Explain how an out-of-circuit comparison or schematic resolves the ambiguity."
      },
      {
        "prompt": "Create a reference-point plan for two hypothetical test nodes, 5 V and 3.3 V.  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "Specify DC mode, correct V/Ω jack, ground reference and expected reading uncertainty.",
        "safety": "Never move leads to the current jack to check voltage."
      }
    ]
  },
  {
    "slug": "repair-fault-finding",
    "benchmark": "IBM/CompTIA-style troubleshooting uses systematic cases, symptom trees and graded diagnostics; the present LMS has only generic reminders.",
    "target": "Write an evidence-based fault tree with separating tests, confidence levels and post-repair verification.",
    "limits": "Keep customer data untouched; do not use invasive power experiments.",
    "resources": [
      {
        "title": "Core 1: Hardware and Network Troubleshooting",
        "provider": "IBM / Coursera",
        "url": "https://www.coursera.org/learn/core1-hardware-and-network-troubleshooting",
        "access": "Platform enrolment terms apply",
        "kind": "Five-module course",
        "why": "Structured troubleshooting across laptops, displays, storage and components."
      },
      {
        "title": "SparkFun Troubleshooting Tips",
        "provider": "SparkFun Learn",
        "url": "https://learn.sparkfun.com/tutorials/sparkfun-troubleshooting-tips/all",
        "access": "Free · worked tutorial",
        "kind": "Hands-on troubleshooting guide",
        "why": "A repeatable progression from symptom to documentation and test."
      },
      {
        "title": "PC Laptop Repair and Troubleshooting",
        "provider": "iFixit",
        "url": "https://www.ifixit.com/Device/PC_Laptop",
        "access": "Free · reference and guides",
        "kind": "Model-specific repair library",
        "why": "Case-specific step-by-step teardown and symptom analysis."
      }
    ],
    "cases": [
      {
        "prompt": "Laptop LEDs light but the screen is black. Make a four-branch fault tree.  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "Include backlight, panel/cable, firmware/boot and video-output path with tests that distinguish them.",
        "safety": "Do not erase the drive or swap a motherboard first."
      },
      {
        "prompt": "A USB port is intermittent only when the cable moves. Propose competing explanations.",
        "workedAnswer": "Port contacts, solder joints, cable strain and software are not equally likely.",
        "safety": "Prefer visual/mechanical observations while unpowered."
      },
      {
        "prompt": "A repair passes once but fails after ten minutes. What evidence would you collect?",
        "workedAnswer": "Thermal behaviour, repeatability, timestamps, environmental conditions and expected-versus-actual outcomes.",
        "safety": "Record failed tests instead of declaring success."
      }
    ]
  },
  {
    "slug": "repair-esd-disassembly",
    "benchmark": "iFixit has thousands of model-specific photographic procedures, unlike a generic 3-step dismantling checklist.",
    "target": "Produce a connector map, model-matched disassembly record and evidence of safe handling and reassembly.",
    "limits": "Battery isolation and fragile adhesives require competence; no damaged battery removal as beginner practice.",
    "resources": [
      {
        "title": "Electronics Skills (repair techniques)",
        "provider": "iFixit",
        "url": "https://www.ifixit.com/Device/Electronics_Skills",
        "access": "Free · illustrated skill library",
        "kind": "Procedural learning",
        "why": "Tools, connectors, device repair and common mistakes."
      },
      {
        "title": "PC Laptop Repair",
        "provider": "iFixit",
        "url": "https://www.ifixit.com/Device/PC_Laptop",
        "access": "Free · model-specific guides",
        "kind": "Large repair library",
        "why": "Follow the exact device and motherboard revision rather than generic clips."
      },
      {
        "title": "iPad Repair Guides",
        "provider": "iFixit",
        "url": "https://www.ifixit.com/Device/iPad",
        "access": "Free · model-specific guides",
        "kind": "Advanced technique references",
        "why": "Adhesives, display cables and model identification, with battery safety limits."
      }
    ],
    "cases": [
      {
        "prompt": "Two nearly identical connectors use flip-lock and slide-lock mechanisms. Explain why your removal technique changes.",
        "workedAnswer": "State latch motion, cable insertion direction, force limits and visual evidence.",
        "safety": "Do not lever an unidentified latch. Battery isolation and fragile adhesives require competence; no damaged battery removal as beginner practice."
      },
      {
        "prompt": "A small laptop has 12 screws of three lengths. Design a tracking system.  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "Map positions to photos and containers; add a verification pass before power-up.",
        "safety": "Misplaced screws can puncture a battery or board."
      },
      {
        "prompt": "A previous repair may have disturbed a tablet adhesive seal. Record its condition and risks.",
        "workedAnswer": "Distinguish replaceable adhesive, dust sealing and cable-routing risks.",
        "safety": "Do not treat an opened tablet as factory water-resistant."
      }
    ]
  },
  {
    "slug": "repair-usbc-power",
    "benchmark": "Texas Instruments teaches an hour-long Type-C/PD engineering course, with roles, capability negotiation and power architectures.",
    "target": "Explain USB-C/PD CC logic, source/sink profiles, cable limits and charging-fault reasoning before board repair.",
    "limits": "No voltage injection, opened mains chargers or live damaged-port probing.",
    "resources": [
      {
        "title": "Introduction to USB Type-C and Power Delivery",
        "provider": "Texas Instruments",
        "url": "https://www.ti.com/video/5620180028001",
        "access": "Free · 67-minute engineering training",
        "kind": "Focused technical training",
        "why": "CC pins, roles, source/sink negotiation and PD power architectures."
      },
      {
        "title": "Battery Management Deep Dive",
        "provider": "Texas Instruments",
        "url": "https://www.ti.com/video/series/battery-management-deep-dive-on-demand-technical-training.html",
        "access": "Free · advanced video series",
        "kind": "Engineering series",
        "why": "Power-path, battery charging controllers and protection considerations."
      }
    ],
    "cases": [
      {
        "prompt": "A laptop accepts one 65 W USB-C charger but ignores a phone charger. What capability evidence is missing?",
        "workedAnswer": "Review supported PD voltage/current profiles, cable capabilities and laptop minimum power.",
        "safety": "Identical connector shape does not mean compatible power."
      },
      {
        "prompt": "A USB-C tester displays 5 V and low current after connection. What does that not prove?",
        "workedAnswer": "It does not prove a faulted charging IC; capability advertisement, CC and cable are alternatives.",
        "safety": "Do not start probing an exposed powered port."
      },
      {
        "prompt": "Design a safe external-only USB-C fault decision tree.  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "Separate adaptor, cable, charging port and host/controller without dismantling high-energy components.",
        "safety": "Define stop conditions for bent/shorted contacts."
      }
    ]
  },
  {
    "slug": "repair-schematics-pcbs",
    "benchmark": "MIT supplies formal nodal analysis; SparkFun teaches net labels and schematic reading. Our present course lacks either actual schematics or solved examples.",
    "target": "Trace nets, apply KCL and match component footprints to a board revision using documented test points.",
    "limits": "No unknown live board probing or assumption that near-identical revisions share pinouts.",
    "resources": [
      {
        "title": "How to Read a Schematic",
        "provider": "SparkFun Learn",
        "url": "https://learn.sparkfun.com/tutorials/how-to-read-a-schematic/all",
        "access": "Free · technical guide",
        "kind": "Illustrated tutorial",
        "why": "Symbols, nets, designators and wiring relationships."
      },
      {
        "title": "6.002 Circuits and Electronics",
        "provider": "MIT OpenCourseWare",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/",
        "access": "Free · university course",
        "kind": "Problem sets and examinations",
        "why": "Analyse actual networks using Kirchhoff laws, sources and elements."
      },
      {
        "title": "Introduction to Electronics",
        "provider": "Georgia Tech / Coursera",
        "url": "https://www.coursera.org/learn/electronics",
        "access": "Platform enrolment terms apply",
        "kind": "Structured assessed course",
        "why": "Diode, transistor and op-amp behaviour underpin schematic diagnosis."
      }
    ],
    "cases": [
      {
        "prompt": "A schematic has R1 = 1kΩ in series with R2 = 2kΩ across 9 V. Identify the voltage drops.",
        "workedAnswer": "Current = 3 mA; drops = 3 V and 6 V. Verify the series-current assumption and that the sum of voltage drops equals the supply voltage.",
        "safety": "Show KVL: 3 + 6 = 9 V, specify series assumptions."
      },
      {
        "prompt": "A boardview labels a net VDD_3V3 on one side of a fuse. What do you need before using it?",
        "workedAnswer": "Exact revision, fuse orientation, net identity and source reliability.",
        "safety": "A net name alone is not a safe live measurement plan."
      },
      {
        "prompt": "The board label is rev 2.1 but online boardview is rev 1.0. How should you proceed?",
        "workedAnswer": "Treat the boardview as unverified; collect exact reference and do not trust pin mapping.",
        "safety": "Document version mismatch as a technical risk."
      }
    ]
  },
  {
    "slug": "repair-through-hole-soldering",
    "benchmark": "IPC's electronics assembly operator training and acceptance standards cover workmanship, visual criteria and repeatable technique. SparkFun offers thorough illustrated practice.",
    "target": "Create and inspect multiple joints against measurable criteria, record rejects and demonstrate repeatability.",
    "limits": "Use unpowered, expendable low-voltage practice boards, ventilation and lead hygiene.",
    "resources": [
      {
        "title": "How to Solder: Through-Hole Soldering",
        "provider": "SparkFun Learn",
        "url": "https://learn.sparkfun.com/tutorials/how-to-solder-through-hole-soldering/all",
        "access": "Free · complete tutorial",
        "kind": "Video + step-by-step guide",
        "why": "Pad/lead heating, flux, component placement and rework."
      },
      {
        "title": "Electronics Assembly for Operators",
        "provider": "IPC",
        "url": "https://www.ipc.org/electronics-assembly-operators-faqs",
        "access": "Paid · structured industry course",
        "kind": "Professional operator training",
        "why": "IPC describes 18 hours of mandatory training and optional modules; not the same as an IPC specialist credential."
      },
      {
        "title": "Guide to Excellent Soldering",
        "provider": "Adafruit",
        "url": "https://learn.adafruit.com/adafruit-guide-excellent-soldering",
        "access": "Free · illustrated guide",
        "kind": "Quality reference",
        "why": "Defect recognition, tool preparation and wetting technique."
      }
    ],
    "cases": [
      {
        "prompt": "A practice board has 10 joints: two bridges, one pad with poor wetting, seven sound. Give an acceptance decision.",
        "workedAnswer": "Reject the three defective joints for rework; explain visual criteria and reinspection.",
        "safety": "No 'it boots therefore all joints are fine' shortcut."
      },
      {
        "prompt": "Compare two joints with the same solder alloy, one on a large ground plane.  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "Discuss heat sinking, suitable tip contact and pad-wetting rather than blindly raising setpoint.",
        "safety": "Avoid prolonged heat that delaminates PCB. Use unpowered, expendable low-voltage practice boards, ventilation and lead hygiene."
      },
      {
        "prompt": "Photograph five through-hole practice joints and score solder coverage, wetting and bridges.",
        "workedAnswer": "Include before/after remediation and explain any uncertainty.",
        "safety": "Only handle unpowered practice circuits. Use unpowered, expendable low-voltage practice boards, ventilation and lead hygiene."
      }
    ]
  },
  {
    "slug": "repair-desolder-replace",
    "benchmark": "IPC-7711/7721 is a professional rework standard for component removal, land preparation and copper repair, much deeper than a single desoldering lesson.",
    "target": "Choose removal techniques and document pad integrity, replacement compatibility and acceptance checks.",
    "limits": "Experienced supervision for board repair; no battery or mains PCB rework as a learner.",
    "resources": [
      {
        "title": "IPC-7711/7721 Endorsement",
        "provider": "IPC",
        "url": "https://www.ipc.org/ipc-7711-ipc-7721-endorsement-program",
        "access": "Paid · advanced programme",
        "kind": "Industry rework training",
        "why": "Procedures for through-hole, SMT, land and conductor repair; explicitly not introductory training."
      },
      {
        "title": "How to Solder: Rework",
        "provider": "SparkFun Learn",
        "url": "https://learn.sparkfun.com/tutorials/how-to-solder-through-hole-soldering/all",
        "access": "Free · illustrated tutorial",
        "kind": "Beginner technique before IPC",
        "why": "Use wick/pump, protect pads and avoid overworking joints."
      }
    ],
    "cases": [
      {
        "prompt": "A two-pin switch remains attached after solder has visibly melted. Why is force still unsafe?",
        "workedAnswer": "Hidden plated-through solder and mechanical retention can tear pads.",
        "safety": "Explain how to remove residual solder without pulling copper."
      },
      {
        "prompt": "A new USB socket matches footprint but not internal contacts. Decide what to do.",
        "workedAnswer": "Reject the substitute until pinout and mechanical electrical specifications are verified.",
        "safety": "A physical fit is not functional interchangeability."
      },
      {
        "prompt": "A harvested board has one lifted pad. Can the connector be released to a customer?",
        "workedAnswer": "Not without competent repair, inspection and functional verification.",
        "safety": "Document defect and refer if you cannot restore PCB continuity reliably."
      }
    ]
  },
  {
    "slug": "repair-smd-microsoldering",
    "benchmark": "iFixit's in-person Pro Repair Academy and IPC-7711/7721 provide real microsoldering instruction beyond our orientation lessons.",
    "target": "Develop inspection, temperature-control, footprint knowledge and acceptance judgement on disposable practice boards.",
    "limits": "Advanced rework; not an authorisation to transplant PMIC/SPD chips or rework battery circuits.",
    "resources": [
      {
        "title": "iFixit Pro Repair Academy",
        "provider": "iFixit",
        "url": "https://www.ifixit.com/ifixit-pro-repair-academy",
        "access": "Paid · in-person USA",
        "kind": "Professional repair bootcamp",
        "why": "Specialist hands-on micro-soldering and diagnostics. Location/travel makes it a future benchmark, not the local default."
      },
      {
        "title": "IPC-7711/7721 Endorsement",
        "provider": "IPC",
        "url": "https://www.ipc.org/ipc-7711-ipc-7721-endorsement-program",
        "access": "Paid · advanced training",
        "kind": "Industry rework certification",
        "why": "Rework procedure and printed-board repair acceptance."
      },
      {
        "title": "Surface Mount Components",
        "provider": "Adafruit",
        "url": "https://learn.adafruit.com/adafruit-guide-excellent-soldering/surface-mount",
        "access": "Free · illustrated lesson",
        "kind": "Accessible entry point",
        "why": "SMD components, positioning, wick and pad wetting."
      }
    ],
    "cases": [
      {
        "prompt": "A 0603 resistor is mounted skewed with a lifted pad. What must be assessed before rework?",
        "workedAnswer": "Footprint integrity, solder bridge, nearby parts, thermal history and whether rework is still justified.",
        "safety": "Don't assume every misalignment needs heat. Advanced rework; not an authorisation to transplant PMIC/SPD chips or rework battery circuits."
      },
      {
        "prompt": "A board with a shorted rail has a nearby PMIC. Outline competing causes.  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "Downstream capacitor, protection circuit, PMIC, connector contamination and board damage.",
        "safety": "No indiscriminate injection or donor-chip transplant."
      },
      {
        "prompt": "Compare through-hole versus QFN rework hazards.  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "Discuss hidden pads, thermal mass, X-ray inspection limitations and requirements for professional equipment.",
        "safety": "Use an inexpensive SMD test board for hands-on practice only."
      }
    ]
  },
  {
    "slug": "repair-laptop-refurb",
    "benchmark": "The existing three-lesson laptop introduction mentioned storage health but did not require repeatable HDD diagnosis, verified backup, exact-model 2.5-inch SATA compatibility, migration failure handling, post-repair data verification or accountable economics. This pathway pairs the HP 250 G3 service manual with practical video, verified references and an adaptive bench simulation.",
    "target": "Produce a redacted end-to-end HP 250 G3 repair plan: authorisation, two falsifiable hypotheses, independent backup verification, exact SATA/caddy compatibility, safe replacement, cold-boot/data-integrity checks, secure old-drive custody and an itemised customer handover; demonstrate safe work under competent supervision.",
    "limits": "An HDD marked slow is not automatically faulty. Stop on swollen battery, unresolved ownership, clicking/read-failing media or absent data consent. No copying unknown owners' files or wiping donors. A lesson, quiz or simulation is not evidence of a supervised physical repair.",
    "resources": [
      {
        "title": "HP 250 G3 / 256 G3 Maintenance and Service Guide",
        "provider": "HP official support",
        "url": "https://support.hp.com/au-en/product/setup-user-guides/hp-250-g3-notebook-pc/6732462",
        "access": "Free · official model manual PDF on support page",
        "kind": "Service and disassembly reference",
        "why": "Confirm the specific HP model, battery steps, hard-drive bracket, correct SATA form factor and the expected service workflow before buying parts."
      },
      {
        "title": "2.5-inch SSD install: copy and migrate",
        "provider": "Crucial / Micron",
        "url": "https://www.youtube.com/watch?v=pQw4E8ecL5c",
        "access": "Free · video, vendor demonstration",
        "kind": "Video practical demonstration",
        "why": "Observe cloning and migration sequencing, then identify why independent backup, encryption state, source health and partitions must be verified beyond this vendor demo."
      },
      {
        "title": "Windows recovery and reinstall options",
        "provider": "Microsoft Support",
        "url": "https://support.microsoft.com/en-us/windows/experience/backup-recovery/recovery-options-in-windows",
        "access": "Free · official guide",
        "kind": "Decision reference",
        "why": "Compare recovery, repair and clean install effects on programs and data; distinguish preserving files from preserving a complete bootable installation."
      },
      {
        "title": "SMART drive health: smartctl reference",
        "provider": "Debian / smartmontools",
        "url": "https://manpages.debian.org/testing/smartmontools/smartctl.8.en.html",
        "access": "Free · technical manual",
        "kind": "Diagnostic reference",
        "why": "Interpret overall-health flags alongside individual error logs, self-test failures and device limitations rather than treating a green indicator as proof."
      },
      {
        "title": "Repair economics and service boundaries: Fixing IT Right",
        "provider": "Podnutz Computer Repair Podcast",
        "url": "https://podnutz.com/podnutz228/",
        "access": "Free · 2017 podcast",
        "kind": "Audio case conversation",
        "why": "Apply customer-scope discussions when an authorised hardware fix reveals unrelated software problems. This recording is contextual, not a drive-replacement tutorial."
      }
    ],
    "cases": [
      {
        "prompt": "A real HP 250 G3 with i5-5200U has an HDD, Windows 10 and an owner requesting a cheaper speed-up. Health/RAM details are unknown. Build an evidence-led decision before ordering a 256 GB SATA SSD. Name two alternative causes of slowness, your first three low-risk observations, ownership/backup gate and one absolute stop-work trigger.",
        "workedAnswer": "First confirm authority and backup requirements; record three timed cold starts/app launches, storage identity and SMART/self-test summaries without stress, plus RAM pressure and available capacity. Compare HDD seek bottlenecks with RAM paging, startup software and storage failure. If clicking or failed sectors, stop ordinary cloning. Verify used partitions and drive bay from the HP 250 G3 service manual before selecting a compatible 2.5-inch SATA SSD.",
        "safety": "Do not access personal files merely because the Windows profile is available; an SSD upgrade without an independent verified backup can still lose family data."
      },
      {
        "prompt": "An ASUS A541U donor panel N156BGE-E32 and an HP 15-db0034au reporting CMN15DC both have approximately 15.6-inch diagonals. The HP displays reliably over HDMI but its internal LCD is damaged. Explain which electrical, firmware, mechanical and cable details must be verified before connection, and specify the GO/HOLD evidence, safe observation plan and limits of EDID identification.",
        "workedAnswer": "HOLD: diagonal, resolution and connector appearance alone do not establish compatibility. Obtain exact donor and recipient panel datasheets and revisions; cross-check LVDS versus eDP signal, connector pin numbering and orientation, display/panel supply voltage, backlight control and cable pinout, connector shape/position, mounting tabs, thickness, hinges and cable route. Read-only EDID helps identify the original display class but is not an electrical compatibility guarantee. Use a known-good manufacturer-compatible screen or appropriate replacement and repeat BIOS, OS, backlight, lid movement and sleep/wake tests before any release.",
        "safety": "Do not hot-plug or energise an unverified donor LCD. Never cut or repin live panel cables; isolate battery using model-specific guidance and stop if safety-critical compatibility evidence is missing."
      },
      {
        "prompt": "A replacement SSD is visible to UEFI and boots once, but no migrated file checks were done, a restart occasionally says 'no boot device', and the old HDD has no custody label. Build a pass/fail release test, including a boot-path hypothesis, at least three repeatable checks, a redacted evidence bundle and a customer-facing price/disposition note.",
        "workedAnswer": "Hold release. Check UEFI boot entry, EFI partition and firmware setting before assuming a bad SSD. Repeat cold boot and restart, SSD health/identity, authorised sample-file restoration checks against an independent backup, device/peripheral function and logs. Record old HDD asset identity privately, agreed retention/return/sanitisation process, and scope of unverified items. A fictional A$80 cost base at 20% gross margin gives A$100 ex-GST; backup/data recovery and tax must be separately quoted where relevant.",
        "safety": "A single successful boot, a SMART 'PASSED' flag or a progress tick cannot sign off integrity or data custody; submit observed evidence for human review."
      }
    ]
  },
  {
    "slug": "repair-pat-verification",
    "benchmark": "Alison's 4–5 hour structured theory course and SafeWork NSW competency guidance go beyond the current lesson; however online courses cannot independently qualify NSW testing.",
    "target": "Explain appliance class, required inspection/testing evidence and when competent testing or licensed work is necessary.",
    "limits": "Do not use UK PAT-course completion as proof of NSW legal competency; do not undertake live mains tests without qualification.",
    "resources": [
      {
        "title": "Appliance Testing Fundamentals",
        "provider": "Alison",
        "url": "https://alison.com/course/appliance-testing-fundamentals",
        "access": "Free learning · optional paid certificate",
        "kind": "4–5-hour online course",
        "why": "PAT theory, risk assessment and appliance classes; not NSW qualification."
      },
      {
        "title": "Electrical Inspection and Testing",
        "provider": "SafeWork NSW",
        "url": "https://www.safework.nsw.gov.au/hazards-a-z/electrical-and-power/electrical-inspection-and-testing",
        "access": "Free · NSW regulator guidance",
        "kind": "Mandatory local context",
        "why": "Defines competent testing requirements and record contents."
      },
      {
        "title": "A Practical Guide to PAT",
        "provider": "Alison",
        "url": "https://alison.com/course/a-practical-guide-to-portable-appliance-testing-pat",
        "access": "Free learning · optional paid certificate",
        "kind": "3–4-hour tutorial course",
        "why": "Additional theory and practical examples; local legal requirements differ."
      }
    ],
    "cases": [
      {
        "prompt": "A portable fan has a nicked mains cable but powers on. Can it be returned?  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "No: visible electrical damage requires competent assessment, irrespective of power-on.",
        "safety": "Don't use an unqualified live trial as a diagnostic."
      },
      {
        "prompt": "A newly donated kettle has no test record. What should be documented before public use?",
        "workedAnswer": "Condition, competent inspection/testing outcome if required, tester/date/next test and release decision.",
        "safety": "The legal test scope depends on use and workplace risks."
      },
      {
        "prompt": "A course learner claims online PAT credentials authorise plug replacement in NSW.",
        "workedAnswer": "Explain distinction between training and any required licence/competence.",
        "safety": "Document escalations and avoid scope creep. Do not use UK PAT-course completion as proof of NSW legal competency; do not undertake live mains tests without qualification."
      }
    ]
  },
  {
    "slug": "repair-itad-sanitisation",
    "benchmark": "NIST SP 800-88 Rev.2 is the authoritative 2025 final sanitisation standard; our LMS cannot replace media-specific technical validation or audited custody processes.",
    "target": "Create verified asset-to-media identity chain, sanitisation selection and exception trace with evidence.",
    "limits": "This is standards-based independent study rather than a publicly verified comprehensive free formal ITAD course.",
    "resources": [
      {
        "title": "NIST SP 800-88 Revision 2: Guidelines for Media Sanitization",
        "provider": "NIST",
        "url": "https://csrc.nist.gov/pubs/sp/800/88/r2/final",
        "access": "Free · official standard",
        "kind": "Primary authoritative standard",
        "why": "Build the sanitisation programme; choose and validate suitable media outcomes and record evidence."
      },
      {
        "title": "Dispose of your device securely",
        "provider": "Australian Cyber Security Centre",
        "url": "https://www.cyber.gov.au/protect-yourself/securing-your-devices/how-secure-your-device/how-dispose-your-device-securely",
        "access": "Free · Australian government guidance",
        "kind": "Consumer risk context",
        "why": "Contrast consumer data disposal with an ITAD audit trail."
      },
      {
        "title": "Circular Economy — Sustainable Materials Management",
        "provider": "Lund University / Coursera",
        "url": "https://www.coursera.org/learn/circular-economy",
        "access": "Platform enrolment terms apply",
        "kind": "Related academic course",
        "why": "Explains recovery systems and product material management, not technical sanitisation."
      }
    ],
    "cases": [
      {
        "prompt": "Five laptops arrive, but one NVMe drive serial differs from intake records. What is the disposition?",
        "workedAnswer": "Quarantine and reconcile identity before applying/releasing a sanitisation certificate.",
        "safety": "The correct report must bind to the physical media."
      },
      {
        "prompt": "A modern SSD reports successful OS overwrite. Does this prove sanitisation?  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "No: match controller-supported method, required assurance, error checks and validation.",
        "safety": "Record any exception rather than inventing confidence."
      },
      {
        "prompt": "A computer is erased but still registered in a school's management tenant.  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "Sanitisation does not remove ownership restrictions or Autopilot enrolment.",
        "safety": "Separate data release and legal/device-management release."
      }
    ]
  },
  {
    "slug": "repair-triage-economics",
    "benchmark": "Lund University's five-module, roughly 20-hour circular-economy course includes business model and material-flow assignments; our lesson only suggests comparing costs.",
    "target": "Make a transparent repair/parts/recycle decision using useful life, labour, component hazards, data obligations and uncertainty.",
    "limits": "Environmental accounting and carbon savings require defensible assumptions; don't invent impact numbers.",
    "resources": [
      {
        "title": "Circular Economy — Sustainable Materials Management",
        "provider": "Lund University / Coursera",
        "url": "https://www.coursera.org/learn/circular-economy",
        "access": "Platform enrolment terms apply",
        "kind": "Five-module assessed course",
        "why": "Product material flows, circular models, sourcing and recovery cases."
      },
      {
        "title": "Product Design for the Circular Economy",
        "provider": "Coursera",
        "url": "https://www.coursera.org/learn/product-design-for-circular-economy",
        "access": "Platform enrolment terms apply",
        "kind": "Five-module project course",
        "why": "Design for repair, remanufacture, reuse and recycling."
      },
      {
        "title": "Repair Café International: About",
        "provider": "Repair Café International",
        "url": "https://www.repaircafe.org/en/about/",
        "access": "Free · practice context",
        "kind": "Community operating approach",
        "why": "Practical expectations of helping owners repair rather than accepting every job."
      }
    ],
    "cases": [
      {
        "prompt": "A laptop repair costs $100 and lasts an estimated two years; refurb replacement is $200 and lasts four.",
        "workedAnswer": "Both equal $50/year before reliability/support differences; discuss uncertainty and owner needs.",
        "safety": "Use realistic probabilities rather than declaring repair automatically better."
      },
      {
        "prompt": "A 'free' laptop takes 5 hours of volunteer time and $60 in parts.  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "Compare staff opportunity cost, repeat failures, saleability and safer disposition.",
        "safety": "Include data sanitation and battery work as additional costs."
      },
      {
        "prompt": "A working donor machine includes usable RAM and an unverified data-bearing SSD.  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "Value RAM after compatibility testing; quarantine SSD until authorised sanitisation.",
        "safety": "Parts harvesting does not cancel chain of custody."
      }
    ]
  },
  {
    "slug": "repair-service-pricing",
    "benchmark": "Business.gov.au official pricing, GST and invoicing lessons plus the ACCC consumer guarantees explain financial and legal concepts that cannot fit into a three-lesson overview. A viable repair quote needs billable utilisation, direct parts costs, predictable rework, profitability, permission and reasonable customer expectations.",
    "target": "Produce a realistic written repair estimate that separates paid diagnostic time, technician labour, unattended machine time, parts margin, GST registration assumptions, revision limits and customer approval; defend it against two alternative offers.",
    "limits": "Do not claim verified Dubbo prices or that unpaid personal time must be charged. GST treatment depends on registration; legal rules and client consent apply and a training answer is not legal advice.",
    "resources": [
      {
        "title": "Choose a pricing strategy",
        "provider": "Australian Government",
        "url": "https://business.gov.au/products-and-services/choose-a-pricing-strategy",
        "access": "Free official business lesson",
        "kind": "Pricing and business framework",
        "why": "Shows cost-based and value-based pricing approaches; benchmark repair labour economics rather than guessing a percentage."
      },
      {
        "title": "Consumer rights and guarantees",
        "provider": "ACCC",
        "url": "https://www.accc.gov.au/consumers/buying-products-and-services/consumer-rights-and-guarantees",
        "access": "Free regulator reference",
        "kind": "Australian repair-service obligations",
        "why": "Explain the service quality and legal duties that remain even when giving a generous discount to a friend."
      }
    ],
    "cases": [
      {
        "prompt": "An SSD upgrade needs a $20 drive, $5 paste, 40 minutes technician attention and 3 hours unattended cloning. The client is a friend. Create and justify both a transparent normal labour quote and a voluntary discounted invoice.",
        "workedAnswer": "Choose an explicit hypothetical hourly rate, bill only defensible technician time, disclose purchased parts at actual agreed charge, and list any diagnostic/backup/verification time separately. Explain the voluntary discount and keep terms and permissions documented.",
        "safety": "Never represent all unattended clone time as hands-on labour automatically; protect and verify the original drive and obtain data-handling consent before work."
      },
      {
        "prompt": "A repair has loaded costs of $180 before tax, and you want 25% gross margin. A trainee recommends adding 25% markup. Calculate both prices and the actual margins, then explain the customer-facing total assuming GST registration.",
        "workedAnswer": "25% target gross margin yields $180/(1-.25)=$240 excluding GST and $264 including 10% GST. A 25% markup yields $225 excluding GST, with a 20% gross margin. If not GST registered, do not charge GST.",
        "safety": "Use correct margin/markup algebra, check current GST obligations and include returns, consumer guarantees, agreed scope and possible quote variation."
      },
      {
        "prompt": "The diagnostic shows a swollen battery and intermittent charging; the $150 initially discussed could increase to $320 if parts are needed. A customer requests an immediate fix but has only authorised $150. Build the stop-work and revised quote response.",
        "workedAnswer": "Stop unsafe battery work and charging, record evidence, provide a revised itemised quote with uncertainty and alternatives, seek express approval before exceeding the spending limit, and refer hazardous battery work to competent specialists.",
        "safety": "Customer urgency never permits charging a damaged pack or work beyond competence, consent or authorisation; consumer guarantees continue to apply."
      }
    ]
  },
  {
    "slug": "repair-cafe-intake",
    "benchmark": "Repair Café International provides house rules, volunteer and customer expectations, refusal discretion and documented consent concepts; an introductory three-lesson check is insufficient for a busy mixed-risk intake queue and evidence-safe handoffs.",
    "target": "Run three simulated intakes, determine which person has authority, ask permission without coercion, capture minimum necessary facts, stop on hazards and route each item to a competent station without promising a repair.",
    "limits": "Repair Café's house rules are an overseas organisational model. They do not remove Australian statutory rights; actual venue, insurance and hazard procedures must be approved locally.",
    "resources": [
      {
        "title": "Repair Café house rules",
        "provider": "Repair Café International",
        "url": "https://www.repaircafe.org/en/house-rules/",
        "access": "Free official rules",
        "kind": "Visitor/repairer expectations",
        "why": "Shows how responsibility, refusing items, visitor involvement and liability limits can be communicated transparently."
      },
      {
        "title": "Consent to handling personal information",
        "provider": "OAIC",
        "url": "https://www.oaic.gov.au/privacy/your-privacy-rights/your-personal-information/consent-to-the-handling-of-personal-information",
        "access": "Free Australian privacy guidance",
        "kind": "Informed consent framework",
        "why": "Distinguishes specific informed consent from assuming that possession of a device or attendance grants unlimited access."
      }
    ],
    "cases": [
      {
        "prompt": "A teenager brings a locked family laptop asking for a repair, but is unsure who owns it. Another volunteer wants to open the personal documents directory to test functionality. Decide what intake can record and what must be deferred.",
        "workedAnswer": "Record device type, stated fault, whether ownership is established and the required next permission step. Do not browse personal data or bypass a lock. Offer non-invasive external checks only after appropriate authority and consent are verified.",
        "safety": "An item handed over at a Repair Café is not blanket permission to access accounts, files or credentials; respect minors' circumstances and local policy."
      },
      {
        "prompt": "Three visitors arrive together: a swollen power bank, a sewing machine missing a foot pedal and a lamp with exposed mains wiring. Design the initial queues and explain your safe-first decisions.",
        "workedAnswer": "Isolate the suspect battery under site procedure without charging or opening; assess sewing-machine completeness and refer to a competent station; quarantine the lamp and refer mains work to appropriately qualified personnel. Record the reason and owner for each outcome.",
        "safety": "Do not energise exposed mains or damaged lithium packs, and do not imply a general repair volunteer is legally authorised for electrical wiring."
      },
      {
        "prompt": "A visitor arrives after waiting an hour, is upset about a failed previous repair and refuses the intake consent statement. A volunteer offers to accept the item privately to keep the queue moving. Draft the response and handoff record.",
        "workedAnswer": "Listen and acknowledge the wait, explain the specific reason for the intake agreement, offer accessible ways to review it, and decline work if necessary consent or safety conditions remain missing. Record only necessary facts and offer appropriate external referral.",
        "safety": "Avoid coercive consent and informal off-book repairs; follow site complaints, safety, recordkeeping and insurance procedures."
      }
    ]
  },
  {
    "slug": "things-maintenance",
    "benchmark": "Operational Library of Things services document kit completeness and return condition; a viable lending pilot additionally needs actual safety checks, quarantine authority, maintenance evidence and impartial red-flag decisions, not merely an inspection tick box.",
    "target": "Build and test a repeatable before-lending/after-return inspection record with accessory serials, fault indicators, maintenance ownership, quarantine thresholds, traceable repair decisions and defensible re-release sign-off.",
    "limits": "UK commercial borrowing terms are examples only; NSW law, local insurer, equipment manuals and competent inspection procedures control the real-world pilot.",
    "resources": [
      {
        "title": "Library of Things borrowing terms",
        "provider": "Library of Things",
        "url": "https://libraryofthings.co.uk/terms-of-borrowing",
        "access": "Free operational example",
        "kind": "Borrowing and return obligations",
        "why": "Analyse how staff and borrowers report damage, missing accessories, cleaning needs and return conditions."
      },
      {
        "title": "NSW event risk assessment",
        "provider": "NSW Government",
        "url": "https://www.nsw.gov.au/departments-and-agencies/premiers-department/community-engagement/event-starter-guide/risk-assessment-management",
        "access": "Free official risk-management reference",
        "kind": "Risk controls and governance",
        "why": "Adapt the documented identify-assess-mitigate approach to hazardous stock, quarantine and responsible escalation."
      }
    ],
    "cases": [
      {
        "prompt": "A shared drill returns with a cracked power adaptor, missing battery cap and photos showing it still powered up yesterday. The next booking starts tomorrow. Decide whether to relend, what evidence to capture and who may release it.",
        "workedAnswer": "Quarantine the drill and damaged adaptor, record missing accessory and condition, contact the borrower if needed, check supplier guidance and require competent inspection or safe replacement before any authorised re-release. Reschedule the next borrower and record communication.",
        "safety": "Previous successful operation is not proof of current safety. No charging, adaptation or bypass of damaged electrical components to meet a booking deadline."
      },
      {
        "prompt": "A sewing-machine kit is listed as complete but the borrower reports that two presser feet were missing on pickup. A returning volunteer suspects the previous borrower. Design an evidence-first kit audit.",
        "workedAnswer": "Compare timestamped intake photos, the baseline kit list, check-in/check-out notes and storage location. Mark evidence as confirmed or unknown; update the master list only after reconciling what was originally issued.",
        "safety": "Do not assert theft or charge a user based on an incomplete inventory record; preserve privacy and follow a documented dispute process."
      },
      {
        "prompt": "A monthly pilot stores 20 high-demand items. In three months, a stepladder has two reports of wobbling but no confirmed incident. Create a maintenance threshold and a quarantine/release process.",
        "workedAnswer": "Remove the item from circulation on repeated safety complaints, record inspection and manufacturer guidance, identify a competent reviewer and decide repair, withdrawal or re-release only after documented evidence. Report trends and update preventive checks.",
        "safety": "Do not ask a novice to load-test or use an unstable ladder; observations, competent assessment and written release records matter more than demand."
      }
    ]
  },
  {
    "slug": "device-identity-locks",
    "benchmark": "Official OAIC guidance requires context-sensitive informed consent, while e-waste and ITAD operations need clear chain of custody and ownership. An orientation on device locks alone does not teach the difference between resetting a donated computer and bypassing somebody else's account.",
    "target": "Make and defend an intake decision for three locked devices that separates lawful ownership evidence, recovery consent, account/device management restrictions, technical possibilities, data preservation and stop-work/referral.",
    "limits": "Do not teach bypassing activation, MDM, enterprise security or theft-prevention locks. Follow actual property-release proof and data-erasure authorisation; a device's physical possession does not establish legal authority.",
    "resources": [
      {
        "title": "Consent to handling personal information",
        "provider": "OAIC",
        "url": "https://www.oaic.gov.au/privacy/your-privacy-rights/your-personal-information/consent-to-the-handling-of-personal-information",
        "access": "Free official Australian guidance",
        "kind": "Permission and information handling",
        "why": "Distinguish clear, voluntary, specific instructions from a blanket assertion of ownership or a technician's curiosity."
      },
      {
        "title": "NSW EPA e-waste reuse options",
        "provider": "NSW EPA",
        "url": "https://www.epa.nsw.gov.au/Your-environment/Recycling-and-reuse/warr-strategy/product-stewardship-schemes/ewaste",
        "access": "Free state government guidance",
        "kind": "Device reuse and compliant routing",
        "why": "Explains reuse and recycling paths while highlighting that devices must have responsible collection and disposal decisions."
      }
    ],
    "cases": [
      {
        "prompt": "A donor brings a Windows laptop from a workplace that has shut down. It boots to an organisation-managed sign-in and the donor says they bought it in a clearance sale. Decide what documentary evidence and next steps are appropriate.",
        "workedAnswer": "Ask for proof of legitimate release and whether the organisation's device-management owner can remove enrollment, avoid personal or corporate data access, record custody restrictions and offer authorised owner-led release or downstream recycling.",
        "safety": "Never interpret a clearance claim as permission to defeat enterprise enrolment, encryption, activation or device ownership controls."
      },
      {
        "prompt": "A relative hands you a deceased person's locked phone and asks you to retrieve family photos. They have the unlock PIN written on a sticky note but cannot establish the estate's instructions. Explain what you can document and why.",
        "workedAnswer": "Record the request without accessing the device, explain that credentials alone do not prove legal data-access permission, request appropriate estate/owner authorisation and refer them to approved account-recovery or legal processes.",
        "safety": "Respect privacy and property rights. Do not try bypass methods, guessed recovery questions or any action that could delete irreplaceable content."
      },
      {
        "prompt": "A school offers ten apparently unwanted Chromebooks with asset stickers but provides only a verbal handover and no device-management release. Decide whether to take the machines, remove storage or advertise resale.",
        "workedAnswer": "Seek documented asset release and authorised management unenrolment, record serial and custody details, keep any data-bearing components secure, decline resale pending release and sanitisation evidence, and escalate discrepancies.",
        "safety": "Keep managed devices and data out of public use until legitimate owner release, authorised wipe and policy-compliant disposal are documented."
      }
    ]
  }
];
export function deepPathwayFor(id:string){return deepPathways.find(x=>x.slug===id);}
