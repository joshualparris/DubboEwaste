export const metadata = {
  title: "Dubbo & Central West Computer Experts",
  description: "Public-evidence directory of computer repair, IT, electronics and refurbishment expertise around Dubbo and the Central West.",
};

const experts = [
  ["Nasser Sedghi","Dubbo","CBM Computers","Owner; CBM operating since 1996; computer-service business leadership","A"],
  ["Farzaneh (Faye) Sedghi","Dubbo","CBM Computers","Owner/manager; individual bench-repair scope not publicly documented","B"],
  ["Brendan Riley","Dubbo","Custom Computer Creations","Hands-on PC/laptop repair, gaming builds, upgrades, phone hardware, virus removal, data recovery","A"],
  ["Rhett Stockdale","Dubbo","Manage IT / Leading Edge Computers","IT leadership since at least 1998; repair/refurb business context","A"],
  ["Gail Hayden","Dubbo","Computer Research & Technology","Operations leadership; CR&T Windows, backup/recovery and upgrade context","B"],
  ["Matt Hoyle","Dubbo","Orana Business Solutions","Office-device installations, maintenance and vendor technical training","B"],
  ["Trent Hocking","Dubbo","Orana Business Solutions","Technical/service work; PC repair depth not individually published","B"],
  ["Andrew Johnston","Dubbo","Avance Business Technology","Managed IT, cloud and business systems leadership","A"],
  ["James Newby","Dubbo","Avance Business Technology","Head Technician; broad business-computing support","A"],
  ["Josh Parris","Dubbo","Avance Business Technology","Technician; client IT support publicly verified","B"],
  ["Edwin Schmidt","Dubbo","Avance Business Technology","AI, automation and web development","B"],
  ["Xavier Johnston","Dubbo","Avance Business Technology","Systems, infrastructure, automation and scripting","A"],
  ["Justin Root","Dubbo","Gravity IT Solutions","L2 systems engineer; computer repair, networking and telecommunications","A"],
  ["Edward Johnson","Dubbo","Revelation I.T. Solutions","Computer repair, home networking and network support","A"],
  ["Mark Anton Putland","Dubbo","Gorilla IT","20+ years local computer-business history; Apple Centre Dubbo historical trading name","A"],
  ["Daniel Poulter","Dubbo","Desspos Solutions","25 years POS/business-equipment field service by 2025","A"],
  ["David Walters","Dubbo","David Walters Electronic Services","Electronic systems/equipment repair and licensed telephone cabling","A"],
  ["Brett Barbary","Dubbo","Orana Region Amateur Radio Club","President/training coordinator; RF/repeater and technical teaching context","B"],
  ["Andrew Tucker","Dubbo","Orana Region Amateur Radio Club","Secretary; technical community lead","C"],
  ["Peter Cluff","Dubbo","Dubbo Community Men's Shed","Community workshop/restoration lead; computer repair unverified","D"],
  ["Eric Chamberlain","Dubbo","South Dubbo Veterans & Community Men's Shed","Workshop/repair community contact; computer repair unverified","D"],
  ["Branden Christiansen","Dubbo","Formerly Synntrix IT","Historical hardware, Raspberry Pi, Docker, Python, Power BI and VBA experience","B"],
  ["Graham Ridgway","Wellington","Wellington Computer Services","Named local computer-services owner; exact specialist scope needs direct verification","B"],
  ["Steven Palmer","Trangie","Steven Palmer Computing","Named computer-repair sole-trader lead; qualifications not published","D"],
  ["Bradley Pincott","Parkes (historical)","HIT Computers / Alpha Computing","Historical computer/electronics repair founder; Cert III Engineering (Fabrication)","A"],
  ["Kamran Malik","Mudgee / regional","Hi Tech ITworX","Diploma IT Network Engineering; Bachelor IT; Bachelor Computer Science","A"],
  ["James Allen","Orange / Mudgee","Hi Tech ITworX","Azure Fundamentals, M365 Fundamentals, Rewst automation; MSP/cloud leadership","A"],
  ["David Cooper","Mudgee / regional","Hi Tech ITworX","Founder/business partner; regional MSP since 2009","A"],
  ["Tyler Digiacomo","Central West","Hi Tech ITworX","Technical Alignment Engineer; MSP and networking context","B"],
  ["Ben Woodside","Orange","Hi Tech ITworX","IT support; public recommendation cites strong technical/network troubleshooting","B"],
  ["Ben Parker","Orange","Hi Tech ITworX","Junior IT technician; CSU study publicly visible","C"],
  ["William Lawler","Central West","Hi Tech ITworX","Current team association; exact role/qualification requires confirmation","C"],
  ["Scott Latimore","Mudgee","Wicked IT","Managing Director; repair, data recovery, networking, cyber and M365 business context","A"],
  ["Curtis (Kirby)","Mudgee","Wicked IT","Lead Technician / Senior IT Support","B"],
  ["Anthony (surname not published)","Mudgee","Wicked IT","IT Support Technician","C"],
  ["Cobi (surname not published)","Mudgee","Wicked IT","IT Apprentice","C"],
  ["Mitch Colton","Orange / services Dubbo","Colton Computer Technologies","Started fixing computers in 2005; regional IT founder","A"],
  ["Adam Willoughby","Orange / regional","Colton Computer Technologies","Technical Director","A"],
  ["Tom Bennett","Orange / regional","Colton Computer Technologies","Professional Services Director; enterprise systems context","B"],
  ["Michael Carlisle","Orange / regional","Colton Computer Technologies","Service Delivery Manager","B"],
  ["Mick Mainwaring","Orange / regional","Colton Computer Technologies","Project Technical Lead","B"],
  ["Fahad Hussain","Orange / regional","Colton Computer Technologies","Master of IT; M365 Fundamentals; historical CCNA/Azure/Palo Alto credentials","A"],
  ["Faisal Farooqi","Orange / regional","Colton Computer Technologies","Support Technician","B"],
  ["Kishan Kumaratheesan","Orange / regional","Colton Computer Technologies","Project Technician","B"],
  ["Casey Neff","Orange / regional","Colton Computer Technologies","Team Lead (Level 1)","B"],
  ["Alex McIntosh-Willoughby","Orange / regional","Colton Computer Technologies","Support Technician","B"],
  ["Justin McKay","Orange / regional","Colton Computer Technologies","Support Technician","B"],
  ["Asher Bateson","Orange / regional","Colton Computer Technologies","Support Technician","B"],
  ["Adam Thompson","Orange / regional","Colton Computer Technologies","Support Technician","B"],
  ["Makaelia Hoyle","Orange / regional","Colton Computer Technologies","Support Technician","B"],
  ["Scott Sharp","Orange / regional","Colton Computer Technologies","Project Technician","B"],
  ["Ethan Bateson","Orange / regional","Colton Computer Technologies","Support Technician","B"],
  ["Daniel Turner","Orange","Reliable I.T","20 years in tech by 2025; Odoo 19 Functional; ITIL v3 Foundation","A"],
  ["Timothy Notley","Kelso / Orange regional","Reliable I.T","20+ years full-stack IT; former ACS/BCS professional credentials","A"],
  ["Ben Robson","Orange","Reliable I.T","PC Maintenance, networking and IT-security training credentials","B"],
  ["John Leabeater","Orange","Need A Nerd","Electronic engineering background; PC, data recovery and network services","A"],
  ["Michelle Leabeater","Orange","Need A Nerd","Co-founder/team leader; no personal repair specialty published","C"],
  ["Jamie Boss","Orange","Boss IT Solutions","25+ years; Grad Cert Industry Computing; repair, data recovery, M365, Linux, networking","A"],
  ["Greg Flannery","Orange","Orange Computer Doctors","Fixing computers since 2007; diagnosis, tune-ups, upgrades, plain-English support","A"],
  ["Tim Duggan","Orange / Central West","My Tech Mate / Optus Business Centre","Phone/computer repair, custom PCs and connectivity/networking","A"],
  ["Trevor Keene","Orange","Midwest Multimedia","Long-running Central West IT/vendor service; Cisco Certified Technician issued 2012","A"],
  ["James Keene","Orange","Midwest Multimedia","RetailManager professional / technical contact","B"],
  ["Nathan Steele","Forbes","Steele Technology","IT services since 2007; PC/laptop repair, custom builds, networking and WISP","A"],
  ["Liam Borger","Forbes","Steele Technology","Current team member; exact specialty not published","C"],
  ["Josh Gavin","Forbes","Small Space IT","Cert IV Cyber Security; electrical safety testing; PC/laptop/mobile repair, Mac, recovery, networking","A"],
] as const;

const gaps = [
  "Microsoldering and laptop motherboard-level repair",
  "Specialist failed-HDD/SSD/NAND or clean-room data recovery",
  "Current Apple-certified / Apple-authorised repair",
  "Chromebook and school-fleet hardware repair",
  "Formal ITAD chain-of-custody and enterprise data-sanitisation credentials",
];

const topDubbo = [
  ["Brendan Riley","Hands-on PC/laptop/gaming repair and customer explanations."],
  ["Nasser Sedghi","Around three decades of regional computer-business experience."],
  ["Justin Root","Current L2 systems engineer with explicit repair/network support."],
  ["Edward Johnson","Computer repair and networking personally advertised."],
  ["David Walters","Strongest named Dubbo electronics-repair lead found."],
  ["Mark Putland","20+ years of local computer-business history; verify current Apple credentials."],
  ["James Newby","Head technician with broad business-computing depth."],
  ["Andrew Johnston","Regional managed-IT leadership and business relationships."],
  ["Daniel Poulter","25 years of field hardware/POS service."],
  ["Brett Barbary","Technical volunteer network plus training/assessment experience."],
] as const;

export default function RegionalComputerExpertsPage() {
  return (
    <main className="experts-page">
      <style>{`
        body { margin: 0; }
        .experts-page { max-width: 1240px; margin: 0 auto; padding: 34px 20px 80px; font-family: Arial, Helvetica, sans-serif; line-height: 1.55; }
        .experts-page h1 { font-size: clamp(2rem, 5vw, 3.4rem); line-height: 1.05; margin: 0 0 10px; }
        .experts-page h2 { margin-top: 42px; font-size: 1.65rem; }
        .experts-page h3 { margin-top: 24px; }
        .eyebrow { font-size: .78rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; opacity: .65; }
        .lede { max-width: 900px; font-size: 1.1rem; }
        .callout { border: 1px solid currentColor; border-radius: 14px; padding: 18px 20px; margin: 22px 0; background: color-mix(in srgb, CanvasText 5%, Canvas); }
        .strong { border-left: 6px solid #2e7d32; }
        .gap { border-left: 6px solid #b26a00; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(250px,1fr)); gap: 14px; }
        .card { border: 1px solid color-mix(in srgb, CanvasText 22%, Canvas); border-radius: 12px; padding: 16px; }
        .card h3 { margin: 0 0 4px; font-size: 1.03rem; }
        .muted { opacity: .72; }
        .table-wrap { overflow-x: auto; margin: 18px 0 30px; }
        table { border-collapse: collapse; width: 100%; min-width: 930px; font-size: .91rem; }
        th, td { border: 1px solid color-mix(in srgb, CanvasText 25%, Canvas); padding: 9px 10px; text-align: left; vertical-align: top; }
        th { background: color-mix(in srgb, CanvasText 8%, Canvas); }
        .grade { display:inline-block; min-width: 1.7em; text-align:center; font-weight:800; border:1px solid currentColor; border-radius:999px; padding:1px 6px; }
        a { color: #2870c7; }
        .button { display:inline-block; border:1px solid currentColor; border-radius:9px; padding:10px 14px; font-weight:700; text-decoration:none; margin: 8px 8px 8px 0; }
        .small { font-size: .86rem; }
        @media(max-width:760px){ .experts-page{padding:24px 14px 60px} }
      `}</style>

      <div className="eyebrow">DubboEwaste research · 6 October 2026</div>
      <h1>Dubbo &amp; Central West Computer Experts</h1>
      <p className="lede">A person-by-person public-evidence map of computer repair, IT, networking, electronics and refurbishment capability in Dubbo and surrounding Central West / Orana towns.</p>

      <div className="callout strong">
        <strong>Main finding:</strong> this research identified <strong>{experts.length} named people</strong>. Dubbo already has enough ordinary PC, Windows, networking and general IT capability to support a small community repair pilot without importing ordinary technical skills from Sydney.
      </div>
      <div className="callout gap">
        <strong>Where the evidence is thin:</strong> specialist motherboard microsoldering, clean-room/NAND recovery, current Apple-authorised repair, Chromebook fleet hardware repair and formal ITAD/data-sanitisation credentials.
      </div>

      <h2>Best Dubbo conversations to start with</h2>
      <div className="grid">
        {topDubbo.map(([name,why]) => <article className="card" key={name}><h3>{name}</h3><p>{why}</p></article>)}
      </div>

      <h2>All named people found</h2>
      <p className="muted">Evidence grade A is strongest. A company capability is not automatically assigned to every employee; where personal hands-on skills are not published, the entry says so.</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Person</th><th>Town</th><th>Organisation</th><th>Publicly evidenced relevance</th><th>Grade</th></tr></thead>
          <tbody>
            {experts.map(([name,town,org,focus,grade]) => (
              <tr key={name}><td><strong>{name}</strong></td><td>{town}</td><td>{org}</td><td>{focus}</td><td><span className="grade">{grade}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Specialist gaps to verify rather than assume</h2>
      <ul>{gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul>

      <h2>Repair Café capability</h2>
      <p><strong>Strong:</strong> general laptop/desktop diagnosis, SSD/RAM upgrades, custom PCs, Windows/software support, networking and managed IT.</p>
      <p><strong>Moderate:</strong> general electronics diagnosis and practical technical mentoring.</p>
      <p><strong>Needs named verification:</strong> microsoldering/board repair, specialist data recovery, Apple-authorised repair, Chromebook fleet repair, batch refurbishment at scale and enterprise ITAD/data sanitisation.</p>

      <h2>Town-by-town picture</h2>
      <div className="grid">
        <article className="card"><h3>Dubbo</h3><p>Strong general repair/IT depth plus electronics, business systems and technical community networks.</p></article>
        <article className="card"><h3>Orange</h3><p>Deepest nearby pool: repair, MSP, infrastructure, networks, consumer support and electronics backgrounds.</p></article>
        <article className="card"><h3>Mudgee</h3><p>Strong regional MSP and repair capability through Hi Tech ITworX and Wicked IT.</p></article>
        <article className="card"><h3>Forbes</h3><p>Strong for town size through Steele Technology and Small Space IT.</p></article>
        <article className="card"><h3>Wellington / Trangie</h3><p>Named local leads exist, but qualification and specialty evidence is much thinner.</p></article>
        <article className="card"><h3>Narromine / Gilgandra / Coonamble / Nyngan / Warren</h3><p>Providers service these areas, but named local individual expertise is poorly discoverable online.</p></article>
      </div>

      <h2>What this means</h2>
      <p>Dubbo's problem is better described as <strong>fragmentation rather than absence of expertise</strong>. Skills sit across commercial repair shops, MSPs, electronics businesses, long-running sole traders, POS specialists and volunteer technical communities. There is no single inclusive venue where ordinary residents can access those skills cheaply while learning.</p>

      <p><a className="button" href="https://github.com/joshualparris/DubboEwaste/blob/main/docs/DUBBO-CENTRAL-WEST-COMPUTER-EXPERTS-2026-10-06.md" target="_blank" rel="noreferrer">Read the full evidence note on GitHub ↗</a></p>

      <p className="small muted">Public professional research only. Missing qualifications mean not publicly verified, not that the person lacks them. Nobody listed is assumed to be willing to volunteer or partner.</p>
    </main>
  );
}
