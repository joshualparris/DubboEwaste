export const metadata = {
  title: "Dubbo Computer Repair & E-Waste Guide",
  description: "Current Dubbo NSW options for computer repair, free digital help, affordable replacement, reuse and e-waste recycling.",
};

const repairers = [
  ["CBM Computers", "111 Talbragar St", "02 6884 4600", "Repairs, servicing, RAM/disk/graphics and software upgrades", "https://cbmcomputers.com.au/"],
  ["Right Click Go", "Dubbo region", "0466 051 852", "Desktop/laptop support, hardware/software, malware, backup/recovery", "https://www.rightclickgo.com.au/desktops-and-laptops"],
  ["Custom Computer Creations", "Shop 10, 36 Darling St", "0427 738 999", "General repairs, data recovery, upgrades, virus removal; appointment only", "https://www.customcomputercreations.com.au/"],
  ["Computer Research & Technology", "128 Darling St", "02 6884 5922", "Home IT, Windows, backup/recovery, performance, SSD/memory advice", "https://crt.net.au/home-it/"],
  ["Leading Edge Computers Dubbo", "33 Macquarie St", "02 6881 6880", "Repairs, IT services, training, new and refurbished computers", "https://dubbochamber.com.au/chamber-members/leading-edge-computers-dubbo"],
  ["Orana Business Solutions", "122-124 Fitzroy St", "0477 946 651", "Device maintenance/repair and refurbished pre-loved devices", "https://obsolutions.com.au/services"],
];

const directory = [
  ["Laptop repair", "Compare local repair quotes", "Commercial", "Ask the diagnostic fee, quote fee, parts policy and repair warranty first."],
  ["Learn to fix my own laptop", "No verified inclusive Dubbo service", "—", "Library Tech Help does not repair PCs; Men's Shed computer support/access is unverified."],
  ["Free computer help", "Dubbo Library Tech Help / Connecting Community Services", "Free", "Digital skills and access, not hardware repair."],
  ["Replacement on a tight budget", "Refurbished seller; HopeStreet NILS if eligible", "Market price / no-interest loan", "NILS can finance eligible computer purchases; it is not a repair subsidy."],
  ["Donate a working laptop for refurbishment", "No universal verified walk-in pathway found", "Usually free if accepted", "Ask before drop-off; direct reuse or eligible trade-in may preserve value."],
  ["Recycle a dead laptop", "Whylandra / Officeworks / JB Hi-Fi", "Free household/consumer pathways", "Wipe personal data first where possible."],
  ["Dispose of a PC or monitor", "Whylandra / Officeworks / JB Hi-Fi / participating NTCRS outlet", "Free household/consumer pathways", "Business quantities need a business/commercial pathway."],
  ["Dispose of a phone", "Whylandra / MobileMuster / eligible retailer", "Free", "MobileMuster is for the mobile stream, not laptops/computers."],
  ["Business IT disposal", "Qualified ITAD provider", "Quote", "Require chain of custody, sanitisation evidence, reuse/remarketing and final disposition."],
];

const sources = [
  ["Whylandra Waste and Recycling Centre", "https://www.dubbo.nsw.gov.au/Households-Residents/Rubbish-Recycling-and-Sustainability/whylandra-waste-recycling-centre"],
  ["Macquarie Regional Library Tech Help", "https://www.mrl.nsw.gov.au/programs-and-events/programs-for-adults/tech-help"],
  ["Dubbo Community Men's Shed (AMSA)", "https://mensshed.org/sheds/dubbo-community-mens-shed-inc/"],
  ["South Dubbo Veterans & Community Men's Shed (AMSA)", "https://mensshed.org/sheds/south-dubbo-veterans-community-mens-shed/"],
  ["AMSA: What is a Men's Shed?", "https://mensshed.org/about-mens-sheds/what-is-a-mens-shed/"],
  ["BaptistCare HopeStreet Dubbo", "https://baptistcare.org.au/hopestreet/locations/dubbo/"],
  ["Good Shepherd No Interest Loans", "https://goodshep.org.au/services/nils/"],
  ["NSW Device Bank pilot", "https://www.nsw.gov.au/ministerial-releases/nsw-device-bank-to-help-people-and-communities-get-online"],
  ["National Device Bank", "https://nationaldevicebank.org.au/access-devices/"],
  ["Officeworks recycling", "https://www.officeworks.com.au/information/about-us/recycling"],
  ["JB Hi-Fi e-waste recycling", "https://www.jbhifi.com.au/pages/e-waste-recycling"],
  ["Harvey Norman e-waste", "https://www.harveynorman.com.au/e-waste"],
  ["MobileMuster FAQ", "https://www.mobilemuster.com.au/frequently-asked-questions/"],
  ["Dubbo Regional Council 2025-2035 Waste Strategy", "https://www.dubbo.nsw.gov.au/ArticleDocuments/242/Waste_Strategy_2025_Adopted.pdf.aspx"],
  ["NIST SP 800-88 Rev.2", "https://csrc.nist.gov/pubs/sp/800/88/r2/final"],
];

export default function DubboRepairEwasteGuide() {
  return (
    <main className="guide">
      <style>{`
        :root { color-scheme: light dark; }
        body { margin: 0; }
        .guide { max-width: 1160px; margin: 0 auto; padding: 34px 20px 80px; font-family: Arial, Helvetica, sans-serif; line-height: 1.55; }
        .guide h1 { font-size: clamp(2rem, 5vw, 3.5rem); margin: 0 0 8px; line-height: 1.05; }
        .guide h2 { margin-top: 42px; font-size: 1.6rem; }
        .guide h3 { margin-top: 24px; }
        .eyebrow { font-weight: 700; letter-spacing: .08em; text-transform: uppercase; font-size: .78rem; opacity: .68; }
        .lede { font-size: 1.14rem; max-width: 850px; }
        .callout { border: 1px solid currentColor; border-radius: 14px; padding: 20px; margin: 24px 0; background: color-mix(in srgb, CanvasText 5%, Canvas); }
        .good { border-left: 6px solid #2e7d32; }
        .gap { border-left: 6px solid #b26a00; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(245px, 1fr)); gap: 14px; }
        .card { border: 1px solid color-mix(in srgb, CanvasText 24%, Canvas); border-radius: 12px; padding: 16px; }
        .card h3 { margin: 0 0 6px; font-size: 1.05rem; }
        .muted { opacity: .72; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0 28px; font-size: .94rem; }
        th, td { border: 1px solid color-mix(in srgb, CanvasText 28%, Canvas); padding: 10px; vertical-align: top; text-align: left; }
        th { background: color-mix(in srgb, CanvasText 8%, Canvas); }
        a { color: #2870c7; }
        .pill { display: inline-block; border: 1px solid currentColor; border-radius: 999px; padding: 3px 9px; font-size: .78rem; font-weight: 700; margin-right: 8px; }
        .actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
        .button { display: inline-block; padding: 10px 14px; border-radius: 9px; border: 1px solid currentColor; text-decoration: none; font-weight: 700; }
        .source-list li { margin-bottom: 8px; }
        .small { font-size: .88rem; }
        @media (max-width: 760px) { table { display: block; overflow-x: auto; white-space: normal; } .guide { padding: 24px 14px 60px; } }
      `}</style>

      <div className="eyebrow">DubboEwaste research guide · verified 6 October 2026</div>
      <h1>Dubbo Computer Repair &amp; E-Waste Guide</h1>
      <p className="lede">
        What can someone in Dubbo actually do when a laptop or desktop is broken, too expensive to repair, still usable but unwanted, or genuinely end-of-life?
      </p>

      <div className="callout good">
        <strong>What the research found:</strong> Dubbo already has several commercial repairers, local refurbished-device supply, No Interest Loans for eligible computer purchases, and multiple free household e-waste pathways. The clearest missing piece is an <strong>inclusive low-cost learn-to-repair / Repair Café-style service</strong> and a simple reuse-before-recycling pathway for working or repairable computers.
      </div>

      <div className="callout gap">
        <strong>Important:</strong> there is no local dataset proving that large numbers of repairable Dubbo computers are being recycled prematurely. The current system creates a plausible reuse gap, but a pilot should measure that rather than assume it.
      </div>

      <h2>If your computer is broken</h2>
      <p>No reliable public dollar-price table was found for ordinary Dubbo laptop repairs. Call first and ask the diagnostic fee, quote fee, labour, parts policy and repair warranty.</p>
      <div className="grid">
        {repairers.map(([name, address, phone, scope, url]) => (
          <article className="card" key={name}>
            <span className="pill">Current</span>
            <h3>{name}</h3>
            <div className="small muted">{address} · {phone}</div>
            <p>{scope}.</p>
            <a href={url} target="_blank" rel="noreferrer">Check current details ↗</a>
          </article>
        ))}
      </div>

      <h2>Free help is available, but it is not repair</h2>
      <p><strong>Dubbo Library Tech Help</strong> provides free one-on-one digital skills help, but explicitly excludes PC repairs, virus removal and device setup. That makes it useful for digital confidence, not for a failed charging port, dead drive or broken screen.</p>
      <p><strong>Connecting Community Services</strong> advertises free computer/internet access and basic help; no hardware-repair workshop was verified.</p>

      <h2>What if money is the problem?</h2>
      <p><strong>BaptistCare HopeStreet Dubbo</strong> can connect eligible people with Good Shepherd <strong>No Interest Loans (NILS)</strong> for essential technology such as a computer or laptop. NILS has no interest or fees, but it is purchase finance rather than a free repair subsidy.</p>
      <p>The NSW / National Device Bank is also a promising digital-inclusion pathway, but devices are distributed through eligible organisations rather than direct walk-in individual applications.</p>

      <h2>Men's Sheds: relevant, but computer repair is not verified</h2>
      <div className="grid">
        <article className="card">
          <h3>Dubbo Community Men's Shed</h3>
          <p>AMSA currently lists wood/metal work and a garage sale. Historical material shows repair/restoration culture, but current laptop/electronics repair, data sanitisation and computer-donation intake are <strong>not verified</strong>.</p>
        </article>
        <article className="card">
          <h3>South Dubbo Veterans &amp; Community Men's Shed</h3>
          <p>AMSA currently lists “Workshop &amp; Repair Activities”, gardening and aquaponics. The listing does not say the repair activity includes computers.</p>
        </article>
      </div>
      <p>AMSA says female membership is a local decision, so neither shed should be presented as a guaranteed repair option for women or non-members without direct confirmation.</p>

      <h2>Is there a Repair Café in Dubbo?</h2>
      <p><strong>No current formal Repair Café was identified.</strong> No current maker space, hackspace, tool library or public computer-repair teaching program was found either. This is the strongest verified service gap.</p>

      <h2>If the computer still works</h2>
      <p>Prioritise reuse before recycling: keep it in use, securely wipe it and give/sell it directly, use an eligible trade-in, or ask a local refurbisher whether it wants the exact model. Dubbo does have refurbished-device sellers, but no universal walk-in donation-to-refurbishment pathway was identified.</p>

      <h2>If it is genuine e-waste</h2>
      <div className="grid">
        <article className="card">
          <h3>Whylandra</h3>
          <p>Clean separated domestic e-waste is accepted free. The embedded-battery stream includes whole phones, tablets and laptops; do not remove an embedded battery. Council says unauthorised scavenging is strictly prohibited.</p>
        </article>
        <article className="card">
          <h3>Officeworks</h3>
          <p>Current Bring It Back categories include technology/data-storage streams. There is also a separate trade-in pathway for some eligible usable technology.</p>
        </article>
        <article className="card">
          <h3>JB Hi-Fi</h3>
          <p>National free in-store e-waste program includes small consumer electronics such as laptops, tablets and monitors.</p>
        </article>
        <article className="card">
          <h3>MobileMuster</h3>
          <p>Useful for eligible mobile products, but it explicitly does not accept computers, laptops, tablets or TVs.</p>
        </article>
      </div>

      <h2>Quick directory</h2>
      <table>
        <thead><tr><th>I need to…</th><th>Best current option</th><th>Cost</th><th>What to know</th></tr></thead>
        <tbody>
          {directory.map(([need, option, cost, note]) => (
            <tr key={need}><td><strong>{need}</strong></td><td>{option}</td><td>{cost}</td><td>{note}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Business computers</h2>
      <p>For a business, school or organisation retiring a batch of computers, use a formal ITAD process rather than assuming household drop-off rules apply. For roughly 20+ data-bearing devices, request multiple quotes and require serialised chain of custody, media-appropriate sanitisation evidence, failed-wipe handling, reuse/remarketing terms and final disposition reporting.</p>
      <p>National providers with current NSW/regional offerings include PonyUp for Good, Greenbox and ITC Asset Management. NIST SP 800-88 Rev.2 (2025) is the current NIST media-sanitisation publication.</p>

      <h2>Five current gaps</h2>
      <ol>
        <li><strong>Inclusive Repair Café / DIY computer repair</strong> — high confidence.</li>
        <li><strong>Subsidised community hardware repair</strong> — high confidence.</li>
        <li><strong>Clear consumer donation-to-refurbishment pathway</strong> — medium-high confidence.</li>
        <li><strong>Publicly visible reuse-before-recycling triage at Whylandra</strong> — medium-high confidence.</li>
        <li><strong>Local small-batch ITAD bridge</strong> — medium confidence.</li>
      </ol>

      <h2>Best first pilot</h2>
      <p>The lowest-risk test is a <strong>single, pre-booked, inclusive diagnosis and owner-assisted repair session</strong>: 6–8 devices, 30 minutes each, owners stay with their devices, no overnight custody, no damaged/swollen batteries, no exposed mains/board-level work, explicit consent for software changes, owner-supplied parts, and a commercial-referral/recycling pathway.</p>
      <p>Measure what happened to each device and whether the owner otherwise would have replaced or recycled it. That produces the local evidence the internet cannot.</p>

      <h2>Council plans</h2>
      <p>Council has previously developed reuse-shop and Whylandra circular-economy/resource-recovery concepts, but the current Whylandra page still describes disposal/recycling rather than an operating computer reuse service. Treat reuse-shop/circular-hub concepts as <strong>proposed/future</strong> until Council publishes an operating service.</p>

      <h2>Research sources</h2>
      <p className="muted">Primary and authoritative sources were prioritised. Commercial repair details can change, so call before travel.</p>
      <ul className="source-list">
        {sources.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label} ↗</a></li>)}
      </ul>

      <div className="actions">
        <a className="button" href="https://github.com/joshualparris/DubboEwaste/blob/main/docs/DUBBO-COMPUTER-REPAIR-REUSE-EWASTE-DIRECTORY-2026-10-06.md" target="_blank" rel="noreferrer">Full research note on GitHub ↗</a>
      </div>

      <p className="small muted">Research snapshot: 6 October 2026. Web-based service research, not telephone mystery-shopping. Where a fee, eligibility condition or service capability was not published, it is treated as unverified rather than guessed.</p>
    </main>
  );
}
