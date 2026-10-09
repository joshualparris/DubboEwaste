import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

const venues = [
  {
    name: "Western Plains Cultural Centre / Community Arts Centre",
    rating: "9/10",
    fit: "Best all-round public venue lead",
    known: "Art Studio has sinks, preparation benches and a hands-on workshop setting.",
    confirm: "Tool use, soldering, bike work, community rate, power layout, public liability and recurring weekend availability.",
  },
  {
    name: "Dubbo Pipe Band Hall",
    rating: "8.5/10",
    fit: "Best low-cost hall lead",
    known: "Council lists it for not-for-profit workshops, training and meetings.",
    confirm: "2026/27 fee, accessibility, tables, power, tool permissions and whether a partner organisation needs to be the hirer.",
  },
  {
    name: "Connecting Community Services",
    rating: "8/10",
    fit: "Best inclusion/community-services partner",
    known: "Existing community reach across seniors, families, disability, Aboriginal and migrant communities.",
    confirm: "After-hours availability, workshop activities, power and whether a pilot could be co-hosted or sponsored.",
  },
  {
    name: "Dubbo Library",
    rating: "8/10 light repairs",
    fit: "Best computer / digital-learning venue",
    known: "Free meeting-room use for not-for-profit groups and an existing community tech-help role.",
    confirm: "Whether a separately approved laptop/textile repair session is allowed; soldering and mixed workshop activity may not suit the room.",
  },
  {
    name: "Dubbo Men's Sheds",
    rating: "7–7.5/10 partner",
    fit: "Best workshop/skills partner",
    known: "Current practical workshop/repair activity and potentially useful hands-on experience.",
    confirm: "All-gender/non-member event access, exact repair skills, workshop permissions, insurance and willingness to co-host or supply volunteers.",
  },
];

const repairScope = [
  ["Computers & laptops", "Diagnostics, SSD/RAM upgrades, software/reinstall help, cleaning, batteries/screens only where competence and parts allow."],
  ["Phones & electronics", "Basic diagnosis and selected repairs only with appropriate skills; no unsafe battery work."],
  ["Bikes", "Tyres, brakes, adjustments and basic servicing in a venue with suitable space."],
  ["Clothing & textiles", "Mending, buttons, seams, patches and teaching simple skills."],
  ["Furniture / wood", "Small portable jobs only; no large workshop projects at a pop-up venue."],
  ["Tools / mechanical", "Simple portable repairs where tools and competence match the job."],
  ["Small appliances", "Only where risk controls and competent volunteers are available; mains-electrical work needs strict boundaries."],
];

const roles = [
  ["Fixer", "Hands-on diagnosis or repair within your actual competence."],
  ["Apprentice / learner", "Work alongside someone experienced and learn safely."],
  ["Intake / triage", "Understand the item, route it to the right station and set expectations."],
  ["Welcome / hospitality", "Check-in, tea/coffee and making the room feel comfortable."],
  ["Setup / pack-down", "Tables, signage, tool zones, cords and safe circulation."],
  ["Safety support", "Battery isolation, trip hazards, first aid awareness and escalation."],
  ["Parts / referral", "Help identify parts or refer work to suitable local commercial repairers."],
  ["Comms / impact", "Photos with consent, local promotion and recording repair outcomes."],
];

import { requireProgrammeContext } from "@/lib/programme-context";

export default async function RepairCafeVolunteerHub() {
  const { context } = await requireProgrammeContext();
  const canSeeFeedback = context.global_admin || ["admin","manager"].includes(context.role || "");

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <div className="badge">Repair Café · internal</div>
          <h1>Volunteer Hub</h1>
          <p>
            Planning, venue research, repair scope and pilot guidance for the people helping build Repair Café Dubbo.
            This detail is intentionally kept off the public community page.
          </p>
        </div>
        <div className={styles.heroActions}>
          <Link className="button" href="/repair-cafe-dubbo">View public page</Link>
          {canSeeFeedback ? <Link className="button secondary" href="/repair-cafe-feedback">Review public feedback</Link> : null}
        </div>
      </header>

      <section className={styles.summary}>
        <article><strong>Public message</strong><span>Simple: bring something, learn together, volunteer if interested.</span></article>
        <article><strong>Volunteer job</strong><span>Make the event safe, welcoming, practical and honest about limits.</span></article>
        <article><strong>Current status</strong><span>No event confirmed yet. Venue and volunteer capacity still need validation.</span></article>
      </section>

      <section className={styles.section}>
        <h2>Venue shortlist</h2>
        <p className={styles.intro}>Current working hypothesis: start with a rotating pop-up model instead of committing to a permanent site.</p>
        <div className={styles.venueGrid}>
          {venues.map((venue, i) => (
            <article className={styles.card} key={venue.name}>
              <div className={styles.rank}>{i + 1}</div>
              <p className={styles.rating}>{venue.rating} · {venue.fit}</p>
              <h3>{venue.name}</h3>
              <p><strong>Known:</strong> {venue.known}</p>
              <p className={styles.confirm}><strong>Still confirm:</strong> {venue.confirm}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Repair scope for a first pilot</h2>
        <p className={styles.intro}>Offer only categories where the venue, volunteer competence and safety controls line up. “We can diagnose it” is a valid outcome.</p>
        <div className={styles.grid}>
          {repairScope.map(([name,body]) => <article className={styles.card} key={name}><h3>{name}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Volunteer roles</h2>
        <div className={styles.grid}>
          {roles.map(([name,body]) => <article className={styles.card} key={name}><h3>{name}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Safety boundaries</h2>
        <div className={styles.warning}>
          <strong>Volunteers can say no.</strong>
          <p>Do not attempt a repair because a visitor expects it. Unsafe, specialist or high-risk work should be referred elsewhere.</p>
        </div>
        <div className={styles.grid}>
          <article className={styles.card}><h3>Lithium batteries</h3><p>Quarantine visibly swollen, damaged, hot or compromised packs. Do not open or puncture cells at a pop-up event.</p></article>
          <article className={styles.card}><h3>Mains electricity</h3><p>Do not assume hobby repair skills are enough for mains-voltage work. The final pilot needs a clear approved electrical-safety rule.</p></article>
          <article className={styles.card}><h3>Data & privacy</h3><p>Visitors remain responsible for backups and passwords. Avoid unnecessary access to personal files and accounts.</p></article>
          <article className={styles.card}><h3>Children & public space</h3><p>Keep hot tools, batteries, sharp tools and cords controlled. The repair area must still work as a public community space.</p></article>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Suggested first pilot</h2>
        <div className={styles.pilot}>
          <article><strong>3 hours</strong><span>Short enough to control, long enough to learn.</span></article>
          <article><strong>8–12 items</strong><span>Cap the first session rather than creating a queue we cannot handle.</span></article>
          <article><strong>Owners stay</strong><span>Repair together rather than operating a drop-off workshop.</span></article>
          <article><strong>Measure outcomes</strong><span>Fixed, diagnosed, referred, reused or recycled.</span></article>
        </div>
      </section>

      <section className={styles.section}>
        <h2>What successful Repair Cafés teach us</h2>
        <div className={styles.grid}>
          <article className={styles.card}><h3>Low barrier to join</h3><p>Recruit learners, hosts and organisers as deliberately as skilled fixers.</p></article>
          <article className={styles.card}><h3>Pop-up venues work</h3><p>Libraries, community centres, museums and maker spaces can bring different audiences into repair.</p></article>
          <article className={styles.card}><h3>Honest outcomes</h3><p>A diagnosis or referral is useful even when the item is not fixed on the day.</p></article>
          <article className={styles.card}><h3>Social matters</h3><p>Tea, conversation and learning are part of the model, not extras after the “real” repair work.</p></article>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Before we announce an event</h2>
        <ol className={styles.checklist}>
          <li>Confirm venue permission, price, accessibility, power and insurance.</li>
          <li>Confirm the repair categories we genuinely have competent volunteers for.</li>
          <li>Write the event house rules and exclusions.</li>
          <li>Confirm lithium-battery and mains-electrical handling rules.</li>
          <li>Set item numbers / booking or queue approach.</li>
          <li>Prepare intake, consent and outcome tracking.</li>
          <li>Identify local commercial referral partners for jobs outside volunteer scope.</li>
          <li>Publish the event only after those controls are real.</li>
        </ol>
      </section>

      <section className={styles.section}>
        <h2>Monthly sessions, rosters and venues</h2>
        <p className={styles.intro}>Proposed operating plan for choosing a date each month, recording volunteer availability and skills, confirming venue bookings, filling shifts and only announcing events once they are ready. This is a planning specification; live rostering has not been built yet.</p>
        <div className={styles.links}>
          <a href="https://github.com/joshualparris/DubboEwaste/blob/main/docs/REPAIR-CAFE-MONTHLY-EVENTS-VOLUNTEER-ROSTER-VENUES-2026-10-09.md" target="_blank" rel="noreferrer">Read monthly events and rostering plan ↗</a>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Internal research</h2>
        <div className={styles.links}>
          <a href="https://github.com/joshualparris/DubboEwaste/blob/main/docs/DUBBO-REPAIR-CAFE-VENUE-RESEARCH-2026-10-08.md" target="_blank" rel="noreferrer">Venue deep research ↗</a>
          <a href="https://github.com/joshualparris/DubboEwaste/blob/main/docs/REPAIR-CAFE-WEBSITE-ENGAGEMENT-BENCHMARK-2026-10-08.md" target="_blank" rel="noreferrer">Website engagement benchmark ↗</a>
          <a href="https://github.com/joshualparris/DubboEwaste/blob/main/docs/DUBBO-CIRCULAR-ECONOMY-IN-PRACTICE-2026-10-08.md" target="_blank" rel="noreferrer">Dubbo circular-economy audit ↗</a>
        </div>
      </section>
    </div>
  );
}
