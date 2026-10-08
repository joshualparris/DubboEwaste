const groups = [
  {
    title: "Core internal workspaces",
    intro: "Authenticated places for day-to-day ITAD, circular-economy and Repair Café work.",
    links: [
      { name: "Dubbo Circular Learning · All courses", url: "https://dubbo-ewaste-app.vercel.app/learn", note: "Enrolments, progress and 26 short courses for volunteers across three programmes." },
      { name: "DubboEwaste · AssetFlow", url: "https://dubbo-ewaste-app.vercel.app/dashboard", note: "ITAD operations, assets, media, sanitisation, repair, resale, recycling and records." },
      { name: "DubboEwaste · Field Validation", url: "https://dubbo-ewaste-app.vercel.app/validation", note: "Private evidence records for contracts, organisations, demand and pilot economics." },
      { name: "DubboEwaste · Repair Café Volunteer Hub", url: "https://dubbo-ewaste-app.vercel.app/repair-cafe-volunteers", note: "Repair Café operational material inside the AssetFlow staff system." },
      { name: "Dubbo Circular Economy · Internal", url: "https://circular-economy-dubbo.vercel.app/internal", note: "Research, Repair First, Repair Café, Library of Things, partners and field validation." },
      { name: "Repair Café Dubbo · Internal", url: "https://circular-economy-dubbo.vercel.app/internal/repair-cafe", note: "Volunteer roles, safety boundaries, intake and pilot measurements." },
      { name: "Library of Things · Internal", url: "https://circular-economy-dubbo.vercel.app/internal/library-of-things", note: "Demand testing, starter inventory, controls and lending metrics." },
      { name: "Repair First Dubbo · Internal", url: "https://circular-economy-dubbo.vercel.app/internal/repair-first", note: "Deep research on repair economics, behaviour and making repair the default." },
      { name: "Circular Economy · Field Validation", url: "https://circular-economy-dubbo.vercel.app/internal/fieldwork", note: "Audits, interviews, records requests and measured pilots." },
    ],
  },
  {
    title: "Resident-facing reference sites",
    intro: "These links are listed here so volunteers and staff can check what residents are currently being shown. This directory itself stays behind login.",
    links: [
      { name: "Dubbo Circular Economy", url: "https://circular-economy-dubbo.vercel.app/", note: "Public resident guide to repair, reuse, borrowing and recycling." },
      { name: "Repair Café Dubbo", url: "https://circular-economy-dubbo.vercel.app/repair-cafe", note: "Public explanation of the Repair Café concept." },
      { name: "Library of Things Dubbo", url: "https://circular-economy-dubbo.vercel.app/library-of-things", note: "Public explanation of the proposed sharing service." },
      { name: "DubboEwaste application", url: "https://dubbo-ewaste-app.vercel.app/", note: "Current DubboEwaste application entry point." },
      { name: "Cheap PCs & Laptops", url: "https://joshualparris.github.io/Cheappcslaptops/", note: "Refurbished-computer market and pricing research." },
      { name: "DadLAN rollout snapshot", url: "https://parris-tech-services.github.io/DadlanControlCentre/", note: "DadLAN device rollout and donation/refurbishment snapshot." },
    ],
  },
  {
    title: "Core GitHub repositories",
    intro: "Canonical source, research history and implementation work.",
    links: [
      { name: "DubboEwaste", url: "https://github.com/joshualparris/DubboEwaste", note: "AssetFlow, ITAD/e-waste operations and the canonical Dubbo research corpus." },
      { name: "CircularEconomyDubbo", url: "https://github.com/joshualparris/CircularEconomyDubbo", note: "Public circular-economy site plus gated volunteer/staff workspace." },
      { name: "Cheappcslaptops", url: "https://github.com/joshualparris/Cheappcslaptops", note: "Dubbo refurb market, pricing and repair-economics research." },
      { name: "DadlanControlCentre", url: "https://github.com/Parris-Tech-Services/DadlanControlCentre", note: "Device sourcing, donation and rollout research." },
      { name: "Windows Doctor", url: "https://github.com/Parris-Tech-Services/hprobooktroubleshoot", note: "Windows/network diagnostics and technician tooling for repair/refurb workflows." },
      { name: "FieldNotes", url: "https://github.com/Parris-Tech-Services/FieldNotes", note: "Structured notes for audits, interviews and technical observations." },
      { name: "ResearchAtlas", url: "https://github.com/Parris-Tech-Services/ResearchAtlas", note: "Research navigation and evidence-discovery tooling. Repository access may require GitHub authorisation." },
    ],
  },
  {
    title: "Supporting live tools",
    intro: "Useful tools when doing repair, evidence gathering or research.",
    links: [
      { name: "FieldNotes", url: "https://field-notes-two.vercel.app/", note: "Structured field/incident notes. Do not store passwords or sensitive personal information." },
      { name: "ResearchAtlas", url: "https://research-atlas-phi.vercel.app/", note: "Research library/navigation tool." },
      { name: "Windows Doctor latest release", url: "https://github.com/Parris-Tech-Services/hprobooktroubleshoot/releases/tag/windows-crash-doctor-desktop-latest", note: "Current Windows Doctor desktop preview release." },
    ],
  },
] as const;

export default function ProjectsPage() {
  return <div className="stack">
    <div>
      <div className="badge">Project network</div>
      <h1>Connected projects</h1>
      <p className="muted">One internal map of the websites, workspaces and repositories supporting Dubbo's repair, reuse, e-waste and circular-economy work.</p>
    </div>

    <div className="card">
      <strong>Internal directory only.</strong>
      <p className="muted">Public resident pages remain focused on resident actions rather than our project infrastructure.</p>
    </div>

    {groups.map((group) => <section className="card stack" key={group.title}>
      <div>
        <h2>{group.title}</h2>
        <p className="muted">{group.intro}</p>
      </div>
      <div className="grid">
        {group.links.map((link) => <a className="card doc-card" href={link.url} target="_blank" rel="noreferrer" key={link.url}>
          <h3>{link.name}</h3>
          <p className="muted">{link.note}</p>
          <strong>Open ↗</strong>
        </a>)}
      </div>
    </section>)}
  </div>;
}
