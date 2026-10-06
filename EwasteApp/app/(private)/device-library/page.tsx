const schematicLeads = [
  "Dell Latitude E6510 — LA-5571P / LA-5573P variants",
  "Dell Latitude D630 — LA-3301P / LA-3302P variants",
  "Toshiba Satellite P750 — LA-6831P / LA-6832P variants",
  "Toshiba Satellite C50-B PSCMLA-03200S — LA-B301P Rev 1.0",
  "ASUS F5R — Rev 2.0 electrical schematic",
  "ASUS X205TA — schematic plus BoardView package",\n  "Samsung Galaxy A55 5G — Samsung repair guide found; confirm exact SM-A556 regional submodel",
] as const;

const officialManuals = [
  "Lenovo ThinkPad L480",
  "HP EliteBook 840 G3",
  "HP ProBook 4230s",
  "HP EliteBook 2740p",
  "Dell Latitude E6510",
  "Dell Latitude D630",
  "Dell Inspiron 1525",
  "Dell Inspiron 6400",
  "Dell Inspiron 6000",
  "Dell Inspiron 2200",
  "Dell Dimension 3100",
  "ASUS N53Jq",
] as const;

const needsId = [
  "Gaming PC — motherboard model and PCB revision",
  "Dell Latitude 5430 — service tag and standard-versus-Rugged check",
  "HP Pavilion dv7-2206TX — product number and motherboard spare/PCB",
  "Toshiba L850D PSKECA-00W002 — motherboard PCB code",
  "ASUS N52/N52D/N52DA/N61 — exact underside model and PCB",
  "Gateway NE56R06a-B9604G50Mnks — motherboard code",
  "ASUS F553M — exact suffix and PCB",
  "HP CQ56, dv2000 and dv6000 families — exact product number and board ID",
] as const;

export default function DeviceLibraryPage() {
  return <div className="stack">
    <div>
      <div className="badge">Repair intelligence</div>
      <h1>Device schematics & repair library</h1>
      <p className="muted">DadLAN fleet research, service-manual coverage, board-schematic leads and the identifiers still needed for exact board matching.</p>
    </div>
    <section className="card">
      <h2>Board-matching rule</h2>
      <p>Match the physical motherboard silkscreen and revision before using an electrical schematic or BoardView. A retail laptop model alone is often not specific enough.</p>
      <p className="muted">Copyrighted manufacturer and third-party manuals are referenced rather than republished unless redistribution rights are clear.</p>
    </section>
    <section className="card">
      <h2>Strongest electrical-schematic leads</h2>
      <ul>{schematicLeads.map((item)=><li key={item}>{item}</li>)}</ul>
    </section>
    <section className="card">
      <h2>Official service-manual coverage found</h2>
      <div className="tag-cloud">{officialManuals.map((item)=><span className="badge" key={item}>{item}</span>)}</div>
    </section>
    <section className="card">
      <h2>Needs exact model or board code</h2>
      <ul>{needsId.map((item)=><li key={item}>{item}</li>)}</ul>
      <p className="muted">Capture the underside model/product label, motherboard silkscreen, PCB revision, HP spare number or Dell DP/N, and full Toshiba PS*/PT* part number.</p>
    </section>
    <section className="card">
      <h2>Purchase-derived tech added</h2>
      <p>Evidence adds a Samsung Galaxy A55 5G in use, an eBay HP laptop listing, Fitbit Inspire 3, TP-Link Archer AX53, TP-Link Archer VR2100, Toshiba Canvio 1TB drive, Logitech H110 headset and Nintendo Wii accessories. Private receipt details are not published here.</p>
    </section>
  </div>;
}
