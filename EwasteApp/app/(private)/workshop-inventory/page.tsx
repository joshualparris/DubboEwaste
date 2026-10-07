const groups = [
  {
    title: "Electrical & power diagnostics",
    items: [
      ["SCA Hobbyist Digital Multimeter", "Collected · owner-confirmed 8 Oct 2026", "Picked up from SCA Dubbo · current storage not confirmed"],
      ["Lenovo 90W AC adapter", "Confirmed", "Current repair job / home work area"],
      ["Universal laptop PSU + interchangeable barrel tips", "Confirmed", "Home office · adapter box"],
      ["Laptop power bricks / chargers", "Multiple confirmed", "Home office · power tubs / media basket"],
      ["Apple-style white laptop power adapter", "Confirmed", "Home office · power tub"],
      ["Mains power leads", "Multiple confirmed", "Home office · cable/power tubs"],
      ["DC barrel tips/adapters", "Multiple confirmed", "Home office · adapter box"],
      ["AA / AAA / button-cell batteries", "Multiple confirmed", "Home office · small-tools/battery area"],
    ],
  },
  {
    title: "Storage & drive access",
    items: [
      ["USB-to-SATA adapter (exposed PCB)", "Confirmed", "Home office · adapter/storage box"],
      ["2.5-inch SATA HDD/SSDs", "Multiple confirmed", "Home office · drive tray / anti-static bags"],
      ["Anti-static bags", "Multiple confirmed", "Home office · drive/spares tray"],
      ["USB flash drives", "Multiple confirmed", "Home office · accessories box"],
      ["Foam-lined hard equipment case", "Confirmed", "Home office · under desk"],
      ["Historical 10-laptop refurb batch", "Previously identified; current exact location not re-confirmed", "Historical device stock"],
    ],
  },
  {
    title: "Networking / MSP lab",
    items: [
      ["Ethernet patch cables", "Many confirmed", "Home office · blue cable bin / network shelf"],
      ["Mixed data / AV / network cables", "Many confirmed", "Home office · mixed cable bins"],
      ["D-Link Ethernet switch", "Confirmed", "Home office · networking shelf/rack"],
      ["Alloy Ethernet switch", "Confirmed", "Home office · networking shelf/rack"],
      ["Cisco Ethernet switches", "At least two confirmed", "Home office · networking shelf/rack"],
      ["Routers / modems / AP-style devices", "Multiple confirmed", "Home office · cardboard box / crates"],
    ],
  },
  {
    title: "Peripheral & test gear",
    items: [
      ["Keyboards", "Multiple confirmed", "Home office · peripheral box"],
      ["Computer mice", "Multiple confirmed", "Home office · clear tub / peripheral areas"],
      ["Xbox 360 wired controllers", "At least two confirmed", "Home office · media basket"],
      ["Additional game controller", "Confirmed", "Home office · peripheral box"],
      ["Tablet / small-laptop / mobile-sized devices", "Multiple confirmed category", "Home office · organiser / hard case"],
      ["Laptop stack", "Several confirmed category", "Home office · piano/desk area"],
      ["Display / video cables and adapters", "Multiple confirmed category", "Home office · cable bins"],
    ],
  },
  {
    title: "Hand tools",
    items: [
      ["Stanley precision screwdriver set", "Confirmed", "Home office · small-tools area"],
      ["General screwdrivers", "Multiple confirmed", "Shed · general toolbox"],
      ["Workzone MPT-1 multi-tool", "Confirmed", "Home office shelf"],
      ["Allen / hex keys", "Confirmed", "Shed · general toolbox"],
      ["Ratchet / socket tools", "Confirmed", "Shed · general toolbox"],
      ["Spanners", "Multiple confirmed", "Shed · general toolbox"],
      ["Pliers / cutters", "Confirmed category", "Shed · general toolbox"],
      ["Scissors / cutting tools", "Confirmed", "Shed toolboxes / accessories"],
      ["Makita cordless drill/drivers", "At least two confirmed", "Shed · Makita case"],
      ["Large black rugged toolbox/equipment case", "Confirmed; contents not yet audited", "Home office · under desk"],
    ],
  },
  {
    title: "Hardware & storage",
    items: [
      ["Screws / bolts / nuts / washers", "Large mixed stock confirmed", "Shed · fastener toolbox"],
      ["Wall plugs / anchors / general fixings", "Multiple confirmed", "Shed · fastener toolbox"],
      ["Storage tubs / fabric cubes / crates", "Many confirmed", "Home office and shed"],
      ["Cardboard / Australia Post sorting boxes", "Multiple confirmed", "Home office"],
      ["Foam dividers / protective case foam", "Confirmed", "Home office · hard case"],
    ],
  },
];

const zones = [
  ["HOME-OFFICE-NETWORK-SHELF", "D-Link, Alloy and Cisco switches; patch leads; laptop/test machine"],
  ["HOME-OFFICE-CABLE-BIN-BLUE", "Blue and white Ethernet/data cables"],
  ["HOME-OFFICE-CABLE-BIN-MIXED", "USB, display/AV, legacy and assorted adapters"],
  ["HOME-OFFICE-POWER-TUB", "Laptop chargers, power bricks, mains leads, Apple-style PSU"],
  ["HOME-OFFICE-ADAPTER-BOX", "Universal PSU, barrel tips, USB leads, SATA-to-USB and flash drives"],
  ["HOME-OFFICE-PERIPHERAL-BOX", "Keyboards, controllers, mice and cables"],
  ["HOME-OFFICE-MEDIA-BASKET", "Xbox controllers, power bricks and mixed electronics"],
  ["HOME-OFFICE-HARD-CASE", "Several laptops/devices separated by foam"],
  ["HOME-OFFICE-DEVICE-STACK", "Several laptops and small devices in crates/tubs"],
  ["SHED-MAKITA-CASE", "At least two Makita cordless drill/drivers"],
  ["SHED-GENERAL-TOOLBOX", "Hex keys, ratchet/socket tools, spanners, screwdrivers, pliers/cutters and hand tools"],
  ["SHED-FASTENER-TOOLBOX", "Screws, bolts, nuts, washers and general fixings"],
];

const unconfirmed = [
  "Torx / security-Torx precision bit set",
  "Plastic spudgers / opening picks",
  "ESD wrist strap or mat",
  "90%+ isopropyl alcohol",
  "Thermal paste",
  "RJ45 cable tester",
  "Powered 3.5-inch SATA dock",
  "USB-C PD meter",
  "Soldering station / hot air / microscope",
];

export default function WorkshopInventoryPage() {
  return <div className="stack">
    <div>
      <div className="badge">Photo-derived baseline · updated 8 Oct 2026</div>
      <h1>Workshop inventory</h1>
      <p className="muted">Tools, test gear and workshop equipment actually observed in supplied photos. Counts are deliberately conservative; mixed tubs are not guessed.</p>
    </div>

    <section className="card">
      <h2>What this page means</h2>
      <p>This is an observed inventory, not a shopping list. Exact home address, serial numbers and account details are intentionally excluded. The main gap is organisation and known-good status, not basic equipment.</p>
      <p className="muted small">The current conversation contained 29 images. Historical ChatGPT Library contains more than 2,000 retained images, so older standalone photos that cannot be semantically searched are not falsely claimed as manually re-opened here.</p>
    </section>

    {groups.map(group => <section className="card table-wrap" key={group.title}>
      <h2>{group.title}</h2>
      <table>
        <thead><tr><th>Item</th><th>Status</th><th>Observed location</th></tr></thead>
        <tbody>{group.items.map(([item,status,location]) => <tr key={item}><td><strong>{item}</strong></td><td>{status}</td><td>{location}</td></tr>)}</tbody>
      </table>
    </section>)}

    <section className="card table-wrap">
      <h2>Working storage map</h2>
      <table>
        <thead><tr><th>Zone</th><th>Observed contents</th></tr></thead>
        <tbody>{zones.map(([zone,contents]) => <tr key={zone}><td><strong>{zone}</strong></td><td>{contents}</td></tr>)}</tbody>
      </table>
    </section>

    <section className="card">
      <h2>Do not buy until checked</h2>
      <ul>{unconfirmed.map(item => <li key={item}>{item}</li>)}</ul>
      <p className="muted">Some of these may already be in unopened cases or mixed storage. Audit first, then buy only proven gaps.</p>
    </section>

    <section className="card">
      <h2>Learn to use the multimeter</h2>
      <p>The SCA multimeter has been collected. Start with low-voltage charger measurement and continuity, then desktop ATX power rails and laptop board-level diagnostics.</p>
      <p><a href="https://github.com/joshualparris/DubboEwaste/blob/main/docs/MULTIMETER-REPAIR-TRAINING-VIDEOS.md" target="_blank" rel="noopener noreferrer">Open curated multimeter training videos and safety notes ↗</a></p>
    </section>

    <section className="card">
      <h2>Next no-spend actions</h2>
      <ol>
        <li>Label the storage zones above.</li>
        <li>Test and label every laptop charger: voltage, amps, watts, connector and PASS date.</li>
        <li>Sort cables into NETWORK / USB / VIDEO / POWER / LEGACY / UNKNOWN.</li>
        <li>Separate media into UNTESTED / TESTED / SANITISED / FAILED.</li>
        <li>Record exact switch/router models and open the unaudited black case.</li>
      </ol>
      <p className="muted small">Safety: the hobby multimeter is for low-voltage DC/continuity work. It is not a reason to probe live exposed 240V mains circuitry or opened switch-mode PSUs.</p>
    </section>
  </div>;
}
