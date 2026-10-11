/**
 * Donor LCD decision lab for the existing laptop refurbishment course.
 * The case uses a real repair conversation, but all actions are simulated.
 * Panel identification is not a guarantee of connector, electrical or mechanical fit.
 */
export type Level = 1 | 2 | 3;
export type StageId = "symptoms" | "identity" | "compatibility" | "isolation" | "release";
export type Choice = { id:string; level:Level; prompt:string; options:[string,string,string]; answer:0|1|2; why:string; competing:string; evidence:string; stopWork?:boolean };
export type Mission = {
 id:StageId; name:string; objective:string; facts:string[];
 principle:string; boundary:string; questions:[Choice,Choice,Choice];
};
export const donor = {
 computer:"ASUS A541U",
 panel:"Innolux N156BGE-E32 Rev C1",
 known:"15.6-inch HD (1366 × 768), 30-pin eDP, typical 3.3 V",
 recipient:"HP 15-db0034au",
 monitorId:"DISPLAY\\CMN15DC",
 candidate:"Innolux N156BGA-EB2 is catalogued as CMN15DC",
 uncertainty:"The HP's fitted panel label, cable pinout/orientation, retaining tabs and LCD clearance have not been visually confirmed. N156BGA-EB2 catalogues describe a reverse interface configuration.",
} as const;
export const missions:Mission[]=[
 {id:"symptoms",name:"1 · Diagnose without disassembly",objective:"Separate observations, hypotheses and facts that are not yet proved.",
  facts:["The HP's LCD is visibly cracked, with black liquid-crystal bleed and vertical lines.","Windows works on an external ASUS VE278 monitor.","A read-only Windows WmiMonitorID check reports internal DISPLAY\\CMN15DC and external ACI27F6."],
  principle:"An external picture supports that the computer can generate video. Visible LCD fracture strongly supports a broken panel, but EDID identifies a responding electronic display identity rather than demonstrating full display function. A cable or mounting fault may coexist.",
  boundary:"Read EDID without touching cables. Do not remove the screen simply to discover a label while non-invasive evidence is still useful.",
  questions:[
   {id:"s1",level:1,prompt:"The HP's screen has obvious ink-like blotches and the external monitor displays Windows. What is the most useful provisional conclusion?",
    options:["There is physical LCD damage; inspect the screen path before choosing a part","The graphics processor must be replaced","Windows needs reinstalling to repair the blotches"],answer:0,why:"Physical LCD damage is visible. External output is useful supporting evidence, not proof of every internal display signal.",competing:"A cable can also be damaged, especially near a hinge.",evidence:"Photograph damage, confirm external video and record whether the internal screen works at all."},
   {id:"s2",level:2,prompt:"PowerShell returns DISPLAY\\CMN15DC for the internal panel. What has it actually established?",
    options:["Its size, mounting brackets and exact installed label are all confirmed","The display electronics reported an EDID manufacturer/product identifier","The LCD's pixels and backlight are functioning properly"],answer:1,why:"EDID is identification metadata, not a physical inspection or successful optical test.",competing:"The EDID may identify the intended panel while an earlier owner swapped the screen.",evidence:"Record the raw InstanceName alongside laptop model and visible damage."},
   {id:"s3",level:3,prompt:"Would EDID plus a working HDMI port justify ordering a donor LCD immediately?",
    options:["Yes; Windows identifies a unique connector pinout for every panel","Yes; the external monitor confirms eDP backlight voltage","Not yet; cross-check candidate specifications and cable/mounting requirements"],answer:2,why:"EDID narrows the search; it does not guarantee installed hardware, eDP pin assignment, connector placement or chassis clearances.",competing:"A matching-resolution panel may still have different cable or physical features.",evidence:"Manufacturer service manual, original LCD label when eventually exposed, donor exact revision and high-confidence parts cross-reference."}
  ]},
 {id:"identity",name:"2 · Read the donor's real label",objective:"Learn what exact panel labels establish, and where spec-sheet evidence ends.",
  facts:["ASUS donor panel sticker: Innolux N156BGE-E32 Rev C1.","Published specifications describe 15.6-inch 1366 × 768, 30-pin eDP, nominal 3.3 V.","The HP's CMN15DC identifier is catalogued against Innolux N156BGA-EB2; published listing flags 'Reverse I/F'."],
  principle:"A model and revision are substantially more useful than a laptop brand. Display technologies (eDP vs LVDS), signalling, connector placement, mechanical outline, backlight and mounting must be matched. 'Reverse I/F' is an unresolved integration detail, not permission to guess.",
  boundary:"Never align connectors by force or assume that '30-pin' alone proves identical pin assignment, location or ribbon routing.",
  questions:[
   {id:"i1",level:1,prompt:"What must you write on the donor-parts label?",
    options:["ASUS laptop display, looks fine","15.6-inch screen; any HP will accept it","Innolux N156BGE-E32 Rev C1, donor ASUS A541U, condition untested"],answer:2,why:"Record the exact panel part/revision, source and condition so a later repairer can independently verify it.",competing:"The ASUS laptop model only describes one possible fitted screen variant.",evidence:"Clear photo of donor panel label and stored asset ID."},
   {id:"i2",level:2,prompt:"Both are listed as 15.6-inch HD eDP. What remains to check?",
    options:["Pin arrangement, connector location, routing, screen thickness and mounting tabs","Only that the bezels are black","Only that their brand names match"],answer:0,why:"Similar display specs don't prove electrical or mechanical interchangeability.",competing:"Adapter cables sometimes exist, but introduce additional documented compatibility requirements.",evidence:"Exact panel datasheets/service parts, connector photographs and physical measurements."},
   {id:"i3",level:3,prompt:"A catalogue calls the HP panel 'Reverse I/F'. What is your next defensible step?",
    options:["Assume that means the pinout must be identical","Treat it as an unresolved connector-layout clue; establish orientation and compatible wiring before installation","Turn the screen upside-down so the plug reaches"],answer:1,why:"Interface orientation descriptions can affect where and how the host cable connects. Confirm before any energisation.",competing:"The phrase alone does not prove the transplant is impossible; it warrants further comparison.",evidence:"Datasheet connector diagrams, cable service part and in-person connector inspection once consent and safe isolation are in place."}
  ]},
 {id:"compatibility",name:"3 · Make the GO / HOLD decision",objective:"Avoid converting a plausible parts cross-reference into a damaging experiment.",
  facts:["The donor's known electrical format is 30-pin eDP, 1366 × 768.","The HP screen's original sticker and cable end have not been inspected.","No manufacturer statement has yet confirmed this specific donor and HP cable/revision as a supported combination."],
  principle:"Compatibility is a checklist, not a percentage based on appearances. Missing evidence should produce HOLD rather than a risky trial.",
  boundary:"A wrong or offset connector may damage LCD/backlight circuitry or the laptop board. Never hot-plug an internal eDP panel.",
  questions:[
   {id:"c1",level:1,prompt:"Can you install a panel just because the diagonal size matches?",
    options:["Yes, if both machines are from the same decade","No, compare the exact electrical and mechanical interface first","Yes, but only after removing the Wi-Fi antenna"],answer:1,why:"The diagonal measurement provides almost no information about electrical compatibility.",competing:"Even 30-pin eDP panels can differ in connector location and fit.",evidence:"Documented part specs and fit check."},
   {id:"c2",level:2,prompt:"A marketplace listing says 'compatible' but lacks donor revision and connector images. What is the repair status?",
    options:["APPROVED: retailer language is sufficient","APPROVED: a common 30-pin connector must work","HOLD: verify exact substitute/revision, fit and wiring from stronger evidence"],answer:2,why:"A sales claim without identifying the variant does not close critical compatibility gaps.",competing:"Retailer cross-references can be leads to verify, not definitive instructions.",evidence:"Panel revision, OEM cable/connector position, datasheet pin tables and bracket dimensions."},
   {id:"c3",level:3,prompt:"The HP original is catalogued as N156BGA-EB2 ('Reverse I/F') and the donor as N156BGE-E32. You have not compared mating connectors. What's your recorded decision?",
    options:["HOLD and escalate/check connector orientation, cabling and mounting before energising","GO because their EDID manufacturer is the same","GO because both show 1366 × 768"],answer:0,why:"Unknown orientation/pin compatibility is a critical gate, not something to test by plugging in.",competing:"They may prove interchangeable later; current evidence simply doesn't clear the gate.",evidence:"Signed compatibility comparison or fitting check by a competent repairer, not a speculative boot.",stopWork:true}
  ]},
 {id:"isolation",name:"4 · Plan the safe physical transplant",objective:"Rehearse safe sequencing without opening the working HP during training.",
  facts:["The ASUS donor panel has been removed from its front bezel, with a display lead exposed.","The recipient HP currently still runs Windows via an external display.","The recipient has an internal battery, and LCD cabling runs around the hinge."],
  principle:"The correct order is prepare, record condition, shut down and disconnect AC, disconnect/isolate the internal battery as specified in the service guide, verify loss of power, then release bezel/panel. Support the LCD face down on a clean nonabrasive surface while releasing tape and the keyed cable. Protect fragile connectors, glass and antennas.",
  boundary:"No work on a charging laptop, no live cable experiments, no forcing the panel into an unverified bracket or leaving exposed conductors where they can short.",
  questions:[
   {id:"p1",level:1,prompt:"What's the first physical-safety step before disconnecting the display cable?",
    options:["Put Windows into sleep mode","Remove the screen cable while the laptop is showing HDMI video","Shut down, unplug AC and isolate the internal battery per the HP service guide"],answer:2,why:"Sleep is not zero energy. LCD electronics and backlight circuitry must not be hot-plugged.",competing:"Holding the power button does not itself disconnect the internal battery.",evidence:"Service guide, isolation record and before-photo of cable routing.",stopWork:true},
   {id:"p2",level:2,prompt:"The replacement screen sits slightly crooked and the original cable is stretched over the hinge. What should you do?",
    options:["Stop; review brackets, cable route, connector side and strain relief","Tighten the hinge screws harder to flatten the display","Use stronger tape to force the cable into place"],answer:0,why:"Mechanical stress can tear a ribbon or panel and can crush antenna cabling.",competing:"A wrong display outline or mounting arrangement may make the substitution unsuitable.",evidence:"Photograph both hinge regions and check panel outline/tab positions against the original."},
   {id:"p3",level:3,prompt:"An exposed 30-pin plug seems to fit when slightly angled. Should you try powering on?",
    options:["Yes; LCD cables self-align under voltage","No; stop, verify connector keying, orientation, alignment and panel pinout","Yes, if an external screen can show the result"],answer:1,why:"A bent or offset connector is an electrical hazard for the display and mainboard.",competing:"Contact count alone doesn't establish compatible mating geometry.",evidence:"Clear photos of both mating connectors and verified documented wiring.",stopWork:true}
  ]},
 {id:"release",name:"5 · Verify, disclose and sign off",objective:"Specify the evidence needed for a refurbished HP to be called repaired.",
  facts:["A hypothetical supervised repair has passed the compatibility gate and the panel now displays a BIOS screen.","The original screen was physically broken and is removed for appropriate e-waste handling.","The HP's SSD/HDD and any personal files were not part of this repair."],
  principle:"A single boot is not proof of a durable fix. Check BIOS and OS video, full-screen brightness, backlight, colours/lines, repeated cold starts and lid movement, bezel/hinge cable routing, sleep/wake, webcam/antenna function as relevant, and customer-data boundaries. Record what wasn't tested.",
  boundary:"Simulator completion is not real-device observation. Do not claim a panel is ready to resell until actual measurements, authorisation and supervisor release are documented.",
  questions:[
   {id:"r1",level:1,prompt:"The new LCD displays a Windows login once. Is the repair completed?",
    options:["Yes, the panel lights up","Not yet: run full acceptance checks and document limitations","Yes, if the external monitor also still works"],answer:1,why:"Repeated operation, lid movement, backlight/edge defects and reassembly all need validation.",competing:"Other independent faults could remain, including a pinched webcam or Wi-Fi antenna.",evidence:"Completed acceptance sheet with pass/fail/not tested."},
   {id:"r2",level:2,prompt:"After reassembly, the display flickers when you move the lid. What's the disposition?",
    options:["Hand over with a warning label only","Change Windows resolution and declare pass","Fail/reopen: inspect the safely isolated display cable/hinge routing and retest"],answer:2,why:"Movement-correlated flicker suggests mechanical/cable issues; don't release an intermittent fault.",competing:"A defective panel is possible, but cable strain is a priority observation.",evidence:"Fault reproduction steps, cable inspection and stable repeated tests after correction."},
   {id:"r3",level:3,prompt:"You didn't test lid sleep, webcam or Wi-Fi after fitting the LCD. What may the certificate say?",
    options:["Panel displays an image; other tests NOT VERIFIED; not yet ready for full release","All checks passed, because screen output is the key goal","Certified refurb; sign with the date of the original donor removal"],answer:0,why:"Truthful records distinguish observed passes from missing tests.",competing:"Passing visual LCD tests does not prove adjacent cables and antenna functions survived handling.",evidence:"Check sheet with technician/supervisor, observations, unresolved items and final handover decision."}
  ]}
];
export const sources=[
 {title:"HP 15 Laptop PC Maintenance and Service Guide",provider:"HP",kind:"Official model-family service PDF",url:"https://kaas.hpcloud.hp.com/pdf-public/pdf_12632864_en-US-1.pdf",focus:"Find HD non-touch display cable L20443-001 and panel removal precautions."},
 {title:"N156BGE-E32 panel specifications",provider:"Panelook",kind:"Donor technical catalogue",url:"https://www.panelook.com/modelsearch.php/upload/201402/N156BGE-E32_Innolux_15.6_LCM_parameter_23411.html",focus:"Extract panel resolution, power, signal, connector, outline and uncertainty notes."},
 {title:"N156BGA-EB2 / CMN15DC panel entry",provider:"Panelook",kind:"Recipient panel identity reference",url:"https://www.panelook.com/N156BGA-EB2_Innolux_15.6_LCM_parameter_28556.html",focus:"Explain the meaning of CMN15DC and why 'Reverse I/F' needs further verification."},
 {title:"Replacing a defective display panel",provider:"iFixit",kind:"Step-by-step photo repair",url:"https://www.ifixit.com/Guide/Replacing+a+defective+display+panel/188375",focus:"Locate battery disconnect, bezel release and cable handling; procedure shown is not necessarily your exact HP model."}
] as const;
