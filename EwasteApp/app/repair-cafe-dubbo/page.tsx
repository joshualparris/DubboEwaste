import type { Metadata } from "next";
import { RepairCafeInterestForm } from "@/components/RepairCafeInterestForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Help Shape Repair Café Dubbo",
  description: "A community idea for Dubbo: repair things together, learn practical skills, meet people and keep useful items in use. Share your ideas, volunteer skills and venue suggestions.",
  openGraph: {
    title: "Help Shape Repair Café Dubbo",
    description: "Fix it. Learn it. Keep it in use. Help shape a welcoming community Repair Café for Dubbo.",
    type: "website",
  },
};

const repairCards = [
  ["💻","Computers & laptops","Diagnosis, upgrades, software help and simple hardware jobs."],
  ["📱","Phones & tablets","Basic diagnosis and repairability advice, depending on volunteer skills."],
  ["🚲","Bikes","Tyres, brakes, adjustments and simple maintenance."],
  ["🧵","Clothing & textiles","Mending, patches, buttons, seams and learning simple repair skills."],
  ["🪑","Furniture & wood","Small, portable items and simple fixes."],
  ["🔧","Tools & mechanical","Small mechanical items where the right volunteer and safe setup are available."],
  ["🧸","Toys & household items","The odd, useful things that are too good to throw away."],
  ["☕","Small appliances","Only where the right skills, safety controls and venue permissions exist."],
];

const venues = [
  {
    name:"Western Plains Cultural Centre / Community Arts Centre",
    fit:"Strongest all-round lead",
    why:"The Art Studio has sinks, preparation benches and a workshop-friendly setting. Central, public-facing and already built around learning and creativity.",
    unknown:"Tool, soldering and repair activities still need explicit venue approval and a current community hire quote.",
  },
  {
    name:"Dubbo Pipe Band Hall",
    fit:"Strong low-cost hall lead",
    why:"Council explicitly makes it available to not-for-profit community groups for workshops, training and meetings. It has hosted inclusive community workshops.",
    unknown:"We still need a site inspection, 2026/27 fee, accessibility details, power layout and repair-tool approval.",
  },
  {
    name:"Connecting Community Services",
    fit:"Strong inclusion partner",
    why:"A community organisation already working with seniors, young people, families, disability, Aboriginal and migrant communities. Meeting rooms include tables, Wi-Fi and presentation facilities.",
    unknown:"Normal room hire is weekday-focused and the room is best suited to a smaller, lighter repair pilot.",
  },
  {
    name:"Dubbo Library",
    fit:"Excellent for computers, learning and planning",
    why:"Free meeting-room use is available to not-for-profit groups, and the library already has a strong community digital-help role.",
    unknown:"A mixed Repair Café with bikes, tools or soldering may not suit a library meeting room without specific approval.",
  },
  {
    name:"Men's Shed partnership",
    fit:"Strong skills/workshop partner",
    why:"Dubbo has two current Men's Shed organisations with practical workshop or repair activity and valuable hands-on knowledge.",
    unknown:"For this project, any event would need to be clearly open to the whole community. All-gender/non-member access and exact repair scope must be confirmed.",
  },
];

const roles = [
  ["Fix things","Computers, bikes, sewing, wood, tools, electronics or other practical skills."],
  ["Learn alongside someone","No expertise required. Apprentice-style helpers are valuable too."],
  ["Welcome people","Check-in, explain how the day works and help people find the right table."],
  ["Set up & pack down","Tables, signs, tool stations, queues and keeping the room organised."],
  ["Make it friendly","Tea, coffee, conversation and helping people feel comfortable asking for help."],
  ["Tell the story","Photography, social media, local promotion and community outreach."],
  ["Measure the impact","Record what was fixed, diagnosed, referred, reused or recycled."],
  ["Host or partner","Community groups, businesses, halls, schools and organisations can help without becoming repairers."],
];

export default function RepairCafeDubboPage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <nav className={styles.topnav} aria-label="Page navigation">
          <a className={styles.brand} href="#top">Repair Café Dubbo?</a>
          <div>
            <a href="#venues">Venue ideas</a>
            <a href="#volunteer">Volunteer</a>
            <a className={styles.navCta} href="#have-your-say">Have your say</a>
          </div>
        </nav>

        <div className={styles.heroGrid} id="top">
          <div>
            <p className={styles.status}>Community idea being tested · no event is operating yet</p>
            <h1>Fix it. Learn it.<br />Keep it in use.</h1>
            <p className={styles.lede}>
              We&apos;re exploring a welcoming Repair Café for Dubbo: a place where people bring broken everyday items,
              sit alongside volunteers and try to repair them together.
            </p>
            <div className={styles.actions}>
              <a className={styles.primary} href="#have-your-say">Help shape the first one</a>
              <a className={styles.secondary} href="#volunteer">I could volunteer</a>
            </div>
            <p className={styles.micro}>You do not need to know how to repair anything to be part of it.</p>
          </div>

          <div className={styles.heroPanel} aria-label="Repair Café idea in three steps">
            <div><strong>1</strong><span>Bring something portable that&apos;s broken.</span></div>
            <div><strong>2</strong><span>Sit with someone who can help you understand it.</span></div>
            <div><strong>3</strong><span>Repair it if we can, or leave with a clearer next step.</span></div>
          </div>
        </div>
      </header>

      <section className={styles.statStrip} aria-label="What the research found">
        <div><strong>No formal inclusive Repair Café found</strong><span>in current Dubbo research</span></div>
        <div><strong>Repair skills already exist locally</strong><span>across businesses, sheds and community networks</span></div>
        <div><strong>The missing link is before waste</strong><span>repair or reuse needs to happen before recycling</span></div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>What could people bring?</p>
          <h2>Start with useful, portable things.</h2>
          <p>The exact categories would depend on the volunteers, venue and safety setup available on the day.</p>
        </div>
        <div className={styles.repairGrid}>
          {repairCards.map(([icon,title,body]) => (
            <article className={styles.repairCard} key={title}>
              <span className={styles.icon} aria-hidden="true">{icon}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <aside className={styles.note}>
          <strong>Repair together, not a free drop-off service.</strong>
          <span>Owners stay with their item where possible. Some jobs need a commercial repairer, licensed specialist or safer facility, and volunteers can refuse unsafe work.</span>
        </aside>
      </section>

      <section className={styles.altSection} id="volunteer">
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>You don&apos;t have to be a fixer</p>
          <h2>There is a job for nearly everyone.</h2>
          <p>Successful Repair Cafés mix practical skills with hospitality, organising, teaching, learning and community connection.</p>
        </div>
        <div className={styles.roleGrid}>
          {roles.map(([title,body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className={styles.section} id="venues">
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>Where could it happen?</p>
          <h2>Five strong Dubbo leads. No venue is decided.</h2>
          <p>
            Research suggests a rotating pop-up model may be better than locking into one permanent building.
            It lets different community organisations host and helps us learn what actually works.
          </p>
        </div>
        <div className={styles.venueGrid}>
          {venues.map((venue, index) => (
            <article className={styles.venueCard} key={venue.name}>
              <div className={styles.venueNumber}>{index + 1}</div>
              <p className={styles.venueFit}>{venue.fit}</p>
              <h3>{venue.name}</h3>
              <p>{venue.why}</p>
              <p className={styles.unknown}><strong>Still to confirm:</strong> {venue.unknown}</p>
            </article>
          ))}
        </div>
        <div className={styles.sourceLinks}>
          <a href="https://www.westernplainsculturalcentre.org/hireaspace" target="_blank" rel="noreferrer">WPCC venue information ↗</a>
          <a href="https://www.dubbo.nsw.gov.au/community-groups/community-awards-and-tours/book-a-space" target="_blank" rel="noreferrer">Council community spaces ↗</a>
          <a href="https://www.mrl.nsw.gov.au/about-us/using-the-library/library-facilities" target="_blank" rel="noreferrer">Library meeting rooms ↗</a>
          <a href="https://ccsd.org.au/community/room-hire" target="_blank" rel="noreferrer">Connecting Community Services ↗</a>
        </div>
      </section>

      <section className={styles.altSection}>
        <div className={styles.split}>
          <div>
            <p className={styles.kicker}>Why try it?</p>
            <h2>Dubbo is already good at repairing some things. The system is just fragmented.</h2>
            <p>
              Cars, farm machinery, tools, bikes, clothing, furniture and computers already have real repair pathways here.
              Recycling is also well established. What is much less visible is a friendly public place where someone can
              ask <em>“Can this be fixed?”</em> before they give up on it.
            </p>
          </div>
          <div className={styles.quoteCard}>
            <p>“Can this still be a product?”</p>
            <span>That is the decision we want to move earlier, before useful things become waste.</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>What other Repair Cafés teach us</p>
          <h2>Make it practical, social and easy to join.</h2>
        </div>
        <div className={styles.learningGrid}>
          <article><h3>Show the action</h3><p>Successful sites say what people can bring and what happens when they arrive.</p></article>
          <article><h3>Welcome learners</h3><p>Strong programs recruit apprentice fixers and non-repair volunteers, not only experts.</p></article>
          <article><h3>Use host venues</h3><p>Pop-up events at libraries, museums and community spaces bring different audiences into repair.</p></article>
          <article><h3>Be honest</h3><p>Sometimes an item is fixed. Sometimes it is diagnosed. Sometimes recycling really is the right next step.</p></article>
        </div>
        <p className={styles.evidence}>
          Repair Café Silicon Valley&apos;s pop-up model commonly attracts around 30–40 volunteers and about 150 visitors per event,
          according to Repair Café International.
        </p>
      </section>

      <section className={styles.formSection} id="have-your-say">
        <div className={styles.formIntro}>
          <p className={styles.kicker}>Have your say</p>
          <h2>What should Repair Café Dubbo look like?</h2>
          <p>
            Tell us what you&apos;d bring, what you could help with, where it should happen and what would make it welcoming.
            You can answer anonymously.
          </p>
          <div className={styles.privacy}>
            <strong>Privacy:</strong> contact details are optional. Responses are stored privately for Repair Café planning and are not shown publicly.
          </div>
        </div>
        <RepairCafeInterestForm />
      </section>

      <section className={styles.altSection}>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>A sensible first test</p>
          <h2>One small event. Measure what actually happens.</h2>
        </div>
        <div className={styles.pilot}>
          <div><strong>3 hours</strong><span>Long enough to learn, short enough to manage.</span></div>
          <div><strong>8–12 items</strong><span>Keep the first session intentionally small.</span></div>
          <div><strong>Owners stay</strong><span>Repair and learning happen together.</span></div>
          <div><strong>Track outcomes</strong><span>Fixed, diagnosed, referred, reused or recycled.</span></div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>Questions people will reasonably ask</p>
          <h2>What this is — and what it isn&apos;t.</h2>
        </div>
        <div className={styles.faq}>
          <details><summary>Is Repair Café Dubbo already running?</summary><p>No. This page is gathering community interest, volunteers, venue ideas and repair priorities before a pilot is committed.</p></details>
          <details><summary>Would repairs be free?</summary><p>The Repair Café model normally provides volunteer help free of charge, with visitors paying for any parts they choose to use and voluntary donations possible. A Dubbo pilot would confirm its own house rules before launch.</p></details>
          <details><summary>Do I need repair skills to volunteer?</summary><p>No. Hosts, setup helpers, learners, photographers, tea/coffee helpers, organisers and venue partners are all useful.</p></details>
          <details><summary>Would this compete with local repair businesses?</summary><p>It should not. The aim is simple repair, learning and triage. Proper commercial jobs should be referred to local specialists rather than replaced by volunteer labour.</p></details>
          <details><summary>Can I bring anything?</summary><p>No. The first pilot would set clear categories and safety exclusions. Damaged lithium batteries, unsafe mains work and other specialist jobs may be refused.</p></details>
          <details><summary>Could this move around Dubbo?</summary><p>Yes. A rotating pop-up model is one of the strongest ideas from the venue and engagement research.</p></details>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>Repair Café Dubbo?</strong>
          <p>A community idea informed by local repair, reuse and circular-economy research.</p>
        </div>
        <div className={styles.footerLinks}>
          <a href="https://www.repaircafe.org/en/about/" target="_blank" rel="noreferrer">What is a Repair Café? ↗</a>
          <a href="https://github.com/joshualparris/DubboEwaste/blob/main/docs/DUBBO-REPAIR-CAFE-VENUE-RESEARCH-2026-10-08.md" target="_blank" rel="noreferrer">Venue research ↗</a>
          <a href="https://github.com/joshualparris/DubboEwaste/blob/main/docs/DUBBO-CIRCULAR-ECONOMY-IN-PRACTICE-2026-10-08.md" target="_blank" rel="noreferrer">Dubbo circular-economy research ↗</a>
        </div>
      </footer>
    </main>
  );
}
