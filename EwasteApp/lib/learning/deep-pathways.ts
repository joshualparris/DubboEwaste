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
    "benchmark": "IBM's A+ hardware troubleshooting course includes device-level cases and assessments, and iFixit supports exact-model procedures.",
    "target": "Demonstrate documented hardware diagnostics, storage authorisation, compatible replacements and repeatable release tests.",
    "limits": "No access to previous owners' files; respect firmware locks and lithium risks.",
    "resources": [
      {
        "title": "Core 1: Hardware and Network Troubleshooting",
        "provider": "IBM / Coursera",
        "url": "https://www.coursera.org/learn/core1-hardware-and-network-troubleshooting",
        "access": "Platform enrolment terms apply",
        "kind": "Five-module assessed course",
        "why": "Boot, motherboard, RAM, mobile displays and storage fault diagnostics."
      },
      {
        "title": "PC Laptop Repair Guides",
        "provider": "iFixit",
        "url": "https://www.ifixit.com/Device/PC_Laptop",
        "access": "Free · model-specific guides",
        "kind": "Practical repair reference",
        "why": "Detailed component disassembly, troubleshooting and photographic procedures."
      }
    ],
    "cases": [
      {
        "prompt": "A donated laptop boots to BIOS but an NVMe drive is not detected. Create a plan.",
        "workedAnswer": "Check ownership, slot capabilities, BIOS setting, drive seating if safe, and known-good comparison.",
        "safety": "Never treat storage as yours to wipe without authorisation."
      },
      {
        "prompt": "A candidate donor display has matching 15.6-inch diagonal but unknown eDP pinout.",
        "workedAnswer": "List connector, panel revision, signalling, backlight and mounting checks.",
        "safety": "Diagonal size does not establish transplant compatibility."
      },
      {
        "prompt": "Define a refurbishment pass/fail acceptance record.  State two alternative explanations, a safe discriminating test and the evidence needed for your final decision.",
        "workedAnswer": "Battery health, charging, thermal stability, ports, screen, keyboard, memory and verified erasure.",
        "safety": "A single successful boot is not release evidence."
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
  }
];
export function deepPathwayFor(id:string){return deepPathways.find(x=>x.slug===id);}
