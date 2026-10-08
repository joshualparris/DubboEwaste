export const metadata = {
  title: "Dubbo Circular Economy in Practice",
  description: "Evidence-led audit of how repair, reuse, refurbishment, salvage and recycling actually work in Dubbo.",
};

const gaps = [
  ["1","Reuse intercept before waste","Critical","No operating public reuse shop or product-level triage is demonstrated before Whylandra/bulky disposal."],
  ["2","Inclusive Repair Café / repair learning","Major","Commercial repair exists, but no inclusive public repair-with-me venue was identified."],
  ["3","Building-material product salvage","Major","C&D is a very large stream; private salvage exists but broad product reuse infrastructure is thin."],
  ["4","Low-value appliance/electronics repair triage","Major","Technical repair may exist while labour/replacement economics push goods toward disposal."],
  ["5","Small-batch business IT reuse / ITAD","Major","Secure national services exist, but smaller Dubbo batches remain fragmented."],
  ["6","Repair/reuse measurement","Major","Waste tonnage is measured far better than product-level reuse and repair outcomes."],
];

const circularity = [
  ["Computers","4","3","3","3","5","3","3.5"],
  ["Phones/tablets","4","3","2","2","5","4","3.3"],
  ["TVs","2","1","1","1","5","3","2.2"],
  ["Whitegoods/appliances","4","2","2","2","4","2","2.7"],
  ["Furniture","4","4","3","3","2","2","3.0"],
  ["Clothing/textiles","5","4","3","2","4","3","3.5"],
  ["Bicycles","5","3","2","4","3","2","3.2"],
  ["Power tools/outdoor equipment","5","3","3","4","4","2","3.5"],
  ["Automotive","5","5","5","5","5","4","4.8"],
  ["Farm machinery","5","5","4","5","4","3","4.3"],
  ["Building materials","3","2","2","3","4","2","2.7"],
];

const strengths = [
  "Automotive dismantling, recycled and reconditioned parts",
  "Agricultural machinery repair, overhauls and parts",
  "Tool, mower and outdoor-equipment repair",
  "Bicycle repair",
  "Clothing repair and alterations",
  "Furniture restoration and upcycling",
  "Charity/social-enterprise resale and redistribution",
  "Computer and electronics repair",
  "FOGO compost returned to the community",
  "Separated material recovery: polystyrene, textiles, metals, e-waste and whitegoods",
];

export default function DubboCircularEconomyPage() {
  return (
    <main className="ce-page">
      <style>{`
        body { margin: 0; }
        .ce-page { max-width: 1180px; margin: 0 auto; padding: 34px 20px 80px; font-family: Arial, Helvetica, sans-serif; line-height: 1.55; }
        .ce-page h1 { font-size: clamp(2rem, 5vw, 3.3rem); line-height: 1.04; margin: 0 0 12px; }
        .ce-page h2 { margin-top: 42px; font-size: 1.65rem; }
        .eyebrow { font-size: .78rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; opacity: .68; }
        .lede { max-width: 900px; font-size: 1.12rem; }
        .callout { border: 1px solid color-mix(in srgb, CanvasText 24%, Canvas); border-radius: 14px; padding: 18px 20px; margin: 22px 0; }
        .key { border-left: 6px solid #2e7d32; }
        .warn { border-left: 6px solid #b26a00; }
        .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(245px,1fr)); gap:14px; }
        .card { border:1px solid color-mix(in srgb, CanvasText 22%, Canvas); border-radius:12px; padding:16px; }
        .card h3 { margin:0 0 6px; font-size:1rem; }
        .table-wrap { overflow-x:auto; margin:18px 0 30px; }
        table { border-collapse:collapse; width:100%; min-width:820px; font-size:.91rem; }
        th,td { border:1px solid color-mix(in srgb, CanvasText 24%, Canvas); padding:9px 10px; text-align:left; vertical-align:top; }
        th { background:color-mix(in srgb, CanvasText 8%, Canvas); }
        .muted { opacity:.72; }
        .button { display:inline-block; border:1px solid currentColor; border-radius:9px; padding:10px 14px; font-weight:700; text-decoration:none; margin:8px 8px 8px 0; color:#2870c7; }
        @media(max-width:760px){ .ce-page{padding:24px 14px 60px;} }
      `}</style>

      <div className="eyebrow">DubboEwaste research · 8 October 2026</div>
      <h1>Dubbo Circular Economy in Practice</h1>
      <p className="lede">What actually happens before an item becomes waste? This audit follows repair, reuse, refurbishment, resale, salvage and recycling across electronics, appliances, furniture, tools, bikes, textiles, construction, vehicles and farm machinery.</p>

      <div className="callout key">
        <strong>Main finding:</strong> Dubbo has a real circular economy, but it is fragmented. Repair is strongest where the item retains enough value to support parts and skilled labour. Once an item crosses into the formal waste system, the emphasis shifts to sorting and material recovery rather than proving repairability first.
      </div>

      <div className="callout warn">
        <strong>The biggest missing decision:</strong> “Can this still be a product?” There is no publicly demonstrated, universal reuse/repair triage step before Whylandra, bulky collection or normal e-waste recycling.
      </div>

      <h2>What Dubbo already does well</h2>
      <div className="grid">
        {strengths.map((item, i) => <article className="card" key={item}><h3>{i+1}. {item}</h3></article>)}
      </div>

      <h2>Biggest gaps</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Rank</th><th>Gap</th><th>Severity</th><th>Why it matters</th></tr></thead>
          <tbody>{gaps.map(([rank,gap,severity,why]) => <tr key={rank}><td>{rank}</td><td><strong>{gap}</strong></td><td>{severity}</td><td>{why}</td></tr>)}</tbody>
        </table>
      </div>

      <h2>Repair before recycling</h2>
      <p>The audit uses a simple evidence scale: <strong>A</strong> = formal repair/reuse triage is normal; <strong>B</strong> = strong informal/market reuse; <strong>C</strong> = repair is available only if the owner deliberately seeks it; <strong>D</strong> = disposal is largely direct to recycling; <strong>E</strong> = likely landfill.</p>
      <div className="grid">
        <article className="card"><h3>A / A–B</h3><p>Automotive and farm machinery: mature repair, parts and dismantling markets preserve product/component value.</p></article>
        <article className="card"><h3>B / B–C</h3><p>Clothing, furniture and quality tools: strong repair/reuse options, but no universal waste-system intercept.</p></article>
        <article className="card"><h3>C</h3><p>Computers, phones, whitegoods and bicycles: good repair options exist, but the owner generally has to find them before disposal.</p></article>
        <article className="card"><h3>D</h3><p>TVs: recycling access is much clearer than repair/refurbishment pathways.</p></article>
      </div>

      <h2>Qualitative circularity scorecard</h2>
      <p className="muted">0–5 evidence scores, not measured recovery percentages. They show relative strength of current Dubbo pathways and transparency.</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Stream</th><th>Repair</th><th>Reuse</th><th>Refurbish</th><th>Parts</th><th>Recycle</th><th>Transparency</th><th>Overall</th></tr></thead>
          <tbody>{circularity.map(row => <tr key={row[0]}>{row.map((v,i)=><td key={i}>{i===0?<strong>{v}</strong>:v}</td>)}</tr>)}</tbody>
        </table>
      </div>

      <h2>Whylandra: the key structural question</h2>
      <p>Whylandra has increasingly broad separated recycling and problem-waste pathways. Council also prohibits unauthorised scavenging. Current public material does not advertise a tip shop, repair workshop or systematic product-level reuse assessment. Council discussed reuse shops for Whylandra and Wellington, but this audit could not verify an operating reuse shop or final adoption/implementation of the Whylandra Master Plan.</p>

      <h2>What a Repair Café would actually solve</h2>
      <p>A Repair Café would not be Dubbo’s biggest tonnage intervention. Its value is different: repairability triage, teaching, simple repairs, commercial referrals, volunteer skills, and evidence about why residents would otherwise discard things. It fills the missing community layer between ownership and waste.</p>

      <h2>Best next experiment</h2>
      <div className="callout key">
        <strong>Run two measurements together:</strong> a three-month repair/triage pilot, and a Council-approved condition audit of bulky/self-haul goods before disposal. The first tests demand for repair help. The second tests whether reusable/repairable goods are actually leaking into the waste stream.
      </div>

      <p>
        <a className="button" href="https://github.com/joshualparris/DubboEwaste/blob/main/docs/DUBBO-CIRCULAR-ECONOMY-IN-PRACTICE-2026-10-08.md" target="_blank" rel="noreferrer">Read the full 38-section audit on GitHub ↗</a>
      </p>
      <p className="muted">The full report contains a Further investigation block wherever current public evidence did not reach the requested depth.</p>
    </main>
  );
}
