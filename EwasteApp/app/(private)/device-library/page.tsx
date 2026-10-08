import { ResponsiveTable } from "@/components/ResponsiveTable";
type Match = {
  device: string;
  identity: string;
  board: string;
  status: string;
  source?: string;
};

const currentFleet: Match[] = [
  {
    device: "HP ProBook x360 435 G8",
    identity: "Ryzen 5 5600U; Action1 exact WMI model",
    board: "6050A3243801-MB-A01",
    status: "Board identified; circuit schematic still pending",
    source: "https://www.indiafix.in/2025/12/hp-probook-x360-435-g8-6050a3243801-mb.html",
  },
  {
    device: "Toshiba Satellite L50-A00M",
    identity: "PSKLEA-00M001; i5-3337U; GeForce GT 740M",
    board: "Pegatron VGFTG MB Rev 2.1",
    status: "Matched platform: schematic + BoardView found",
    source: "https://realschematic.com/shop/10263/desc/toshiba-satellite-l50-a-series",
  },
  {
    device: "Lenovo ThinkPad L480",
    identity: "20LTS0Q200 / Type 20LT; i3-7130U",
    board: "EL480/EL580 NM-B461 Rev 0.1",
    status: "Matched platform: schematic + BoardView found",
    source: "https://eletronicabr.com/en/files/file/38759-esquema-el%C3%A9trico-e-boardview-notebook-lenovo-thinkpad-l480-l580-nm-b461-rev-01-schematic/",
  },
  {
    device: "Toshiba Satellite L850D",
    identity: "PSKECA-00W002; A10-4600M; Radeon 7500/7600-series",
    board: "PLAC/CSAC DSC Rev 2.1 candidate",
    status: "Candidate only; exact PCB still needs physical match",
    source: "https://realschematic.com/shop/10650/desc/toshiba-satellite-l850d-satellite-l870d-satellite-l875d",
  },
  {
    device: "HP ProBook 11 G2 / EE G2",
    identity: "i3-6100U; SMBIOS board 818F; N92 BIOS",
    board: "DUNES_SKLU_MB / 15249-1 or 15249-2",
    status: "Board family identified; physical revision still unresolved",
    source: "https://vinafix.com/threads/hp-probook-11-g2-bios-15249-1.31273/",
  },
  {
    device: "MacBook Air 13-inch Early 2015",
    identity: "MacBookAir7,2 / A1466 / EMC 2925; i5-5250U; 8 GB",
    board: "J113 / 820-00165; schematic drawing 051-00385",
    status: "Matched exact model: schematic + BoardView source found",
    source: "https://schematics4u.com/product/macbook-air-13-early-2015-a1466-820-00165-schematics-and-boardview/",
  },
  {
    device: "HP ProBook 4230s",
    identity: "i3-2330M; Intel HD 3000",
    board: "Inventec JOURNEY / 6050A2406601",
    status: "Matched platform: circuit schematic found; verify PCB revision",
    source: "https://www.laptopschematic.com/tag/hp-probook/",
  },
  {
    device: "Toshiba Tecra P11",
    identity: "i7-620M; NVIDIA NVS 2100M",
    board: "P11/FHNSY service documentation",
    status: "Service manual only; no trustworthy true circuit schematic found",
    source: "https://www.manualslib.com/products/Toshiba-Tecra-P11-3014436.html",
  },
  {
    device: "HP 15-db0034AU",
    identity: "A6-9225 / Radeon R4",
    board: "HP L20478-601 / EPV51 LA-G078P",
    status: "Strongest match: exact-model board compatibility + schematic + BoardView",
    source: "https://realschematic.com/shop/11854/desc/hp-255-g7-hp-15-db-15t-db-series-pcb-la-g078p",
  },
  {
    device: "Lenovo ThinkPad T61",
    identity: "6457-BP2; Core 2 Duo T7500",
    board: "FRU 42W7877; NVIDIA NB8P-GL with AMT",
    status: "Exact FRU resolved; reputable exact 42W7877 circuit schematic still pending",
    source: "https://thinkpads.com/support/hmm/hmm_pdf/42x3546_04.pdf",
  },
  {
    device: "Toshiba Satellite L630",
    identity: "Pentium P6100; Intel UMA",
    board: "BM10 / 6050A2338402-MB-A01",
    status: "Matched platform: circuit schematic found; verify revision",
    source: "https://eletronicabr.com/en/files/file/16577-electrical-schematic-notebook-toshiba-l630-bm10-and-6050a2338402-mb-a01-board-6050a2338402-mb-a01-rev-f-schematic/",
  },
  {
    device: "ASUS X553MA",
    identity: "Action1 exact WMI model; Pentium N3540",
    board: "X553MA Rev 1.2 / Rev 2.0; 60NB04X0-MB1B00 documented for Rev 2.0",
    status: "BoardView available; physical revision needed; no full schematic verified",
    source: "https://www.elvikom.pl/post183376.html",
  },
  {
    device: "Toshiba Satellite C50D-A",
    identity: "PSCFWA-03J00K; E1-2100; Radeon HD 8210",
    board: "6050A2556901-MB-A03 or PT10AN DSC Rev 2.1",
    status: "Multiple board families exist; physical PCB code required",
    source: "https://realschematic.com/shop/10584/desc/toshiba-satellite-c50d-a-series-satellite-c55d-a-series",
  },
  {
    device: "Compaq Presario CQ56",
    identity: "Celeron T3500; Mobile Intel 4-Series",
    board: "HP 623909-001 / DAAX3MB16A1 Rev A / AX3E-DDR2",
    status: "Matched platform: exact Intel UMA board spare + circuit schematic found",
    source: "https://www.eserviceinfo.com/index.php?searchstring=CQ56+Pavilion+G56+DAAX3MB16A1+623909-001+rev-a+AX3E-DDR2&what=search2",
  },
  {
    device: "HP Compaq 610",
    identity: "VE908PA#ABG; T5870; Intel 965/X3100",
    board: "VV09/W09 / 6050A2256501",
    status: "Matched platform: circuit schematic found; verify A03/A04 revision",
    source: "https://www.chinafix.com/thread-776228-1-1.html",
  },
];

const matched = currentFleet.filter((item) => item.status.startsWith("Matched") || item.status.startsWith("Strongest"));

export default function DeviceLibraryPage() {
  return <div className="stack">
    <div>
      <div className="badge">Repair intelligence</div>
      <h1>Device schematics & repair library</h1>
      <p className="muted">Board-level research for the current DadLAN fleet, refreshed 7 October 2026 using Action1/WMI identity data and model-specific repair sources.</p>
    </div>

    <section className="card">
      <h2>Current result</h2>
      <p><strong>{matched.length} of {currentFleet.length}</strong> current laptops now have a strong motherboard-platform match with a schematic or BoardView source. Several others now have the board family or FRU identified even though an exact circuit schematic is still missing.</p>
      <p className="muted">A platform match is not the final electrical-repair check. Confirm the motherboard silkscreen and PCB revision before using a schematic on a powered board.</p>
    </section>

    <section className="card">
      <h2>Current 15-laptop fleet</h2>
      <div className="table-wrap">
        <ResponsiveTable>
          <thead>
            <tr>
              <th>Device</th>
              <th>Known identity</th>
              <th>Board / schematic</th>
              <th>Status</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {currentFleet.map((item) => <tr key={item.device}>
              <td><strong>{item.device}</strong></td>
              <td>{item.identity}</td>
              <td>{item.board}</td>
              <td>{item.status}</td>
              <td>{item.source ? <a href={item.source} target="_blank" rel="noreferrer">Open ↗</a> : "—"}</td>
            </tr>)}
          </tbody>
        </ResponsiveTable>
      </div>
    </section>

    <section className="card">
      <h2>Strongest newly matched boards</h2>
      <ul>
        <li>Toshiba L50-A00M — <strong>VGFTG Rev 2.1</strong>.</li>
        <li>Lenovo ThinkPad L480 Type 20LT — <strong>NM-B461 Rev 0.1</strong>.</li>
        <li>HP ProBook 4230s — <strong>JOURNEY / 6050A2406601</strong>.</li>
        <li>HP 15-db0034AU — <strong>EPV51 LA-G078P / L20478-601</strong>.</li>
        <li>Toshiba L630 — <strong>BM10 / 6050A2338402-MB-A01</strong>.</li>
        <li>Compaq CQ56 Intel — <strong>623909-001 / DAAX3MB16A1 Rev A</strong>.</li>
        <li>HP Compaq 610 Intel UMA — <strong>VV09/W09 / 6050A2256501</strong>.</li>
        <li>MacBook Air 13-inch Early 2015 — <strong>MacBookAir7,2 / A1466 / EMC 2925 / J113 820-00165</strong>.</li>
      </ul>
    </section>

    <section className="card">
      <h2>Still blocked from an exact file</h2>
      <ul>
        <li><strong>Toshiba L850D:</strong> PLAC/CSAC DSC Rev 2.1 is a strong candidate, but the Australian PSKECA-00W002 suffix has not been tied conclusively to that PCB.</li>
        <li><strong>HP ProBook 11 G2:</strong> 818F/N92 resolves the family, but 15249-1 versus 15249-2 still needs the printed PCB code.</li>
        <li><strong>ThinkPad T61 6457-BP2:</strong> Lenovo maps it to FRU 42W7877 / NVIDIA NB8P-GL, but no reputable exact 42W7877 circuit schematic was found.</li>
        <li><strong>ASUS X553MA:</strong> BoardViews exist for multiple revisions; the printed revision decides which one.</li>
        <li><strong>Toshiba C50D-A:</strong> at least two board families exist; the printed PCB code is required.</li>
        <li><strong>Tecra P11:</strong> excellent maintenance documentation exists, but no trustworthy true motherboard circuit schematic was found.</li>
      </ul>
    </section>

    <section className="card">
      <h2>Library policy</h2>
      <p>Third-party or copyrighted schematic/BoardView packages are linked to their source rather than mirrored publicly unless redistribution rights are clear. The private Drive library keeps the research index and source cards.</p>
    </section>
  </div>;
}
