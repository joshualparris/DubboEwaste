import Link from "next/link";
import { logout } from "@/app/login/actions";

const groups = [
  {
    title: "Operations",
    links: [
      ["/jobs", "Jobs"],
      ["/lots", "Lots"],
      ["/assets", "Assets"],
      ["/triage", "Triage"],
      ["/processing", "Processing"],
      ["/media", "Sanitisation"],
      ["/repairs", "Repairs"],
      ["/resale", "Resale"],
      ["/recycling", "Recycling"],
    ],
  },
  {
    title: "Customers & commercial",
    links: [
      ["/customers", "Customers"],
      ["/crm", "CRM"],
      ["/crm/opportunities", "Pipeline"],
      ["/crm/quotes", "Quotes"],
      ["/settlements", "Settlements"],
    ],
  },
  {
    title: "Records & workshop",
    links: [
      ["/certificates", "Certificates"],
      ["/reports", "Reports"],
      ["/exceptions", "Exceptions"],
      ["/locations", "Locations"],
      ["/workshop-inventory", "Workshop Inventory"],
      ["/device-library", "Device Library"],
      ["/documents", "Documents"],
    ],
  },
  {
    title: "Research & validation",
    links: [
      ["/validation", "Field Validation"],
      ["/dubbo-repair-ewaste", "Dubbo Repair Guide"],
      ["/dubbo-circular-economy", "Circular Economy"],
      ["/regional-computer-experts", "Regional Experts"],
    ],
  },
] as const;

function roleLabel(role: string) {
  if (role === "repair_volunteer") return "Repair Café volunteer";
  if (role === "volunteer") return "DubboEwaste volunteer";
  return role;
}

export function AppNav({
  fullName,
  role,
  programs,
}: {
  fullName: string | null;
  role: string;
  programs: string[];
}) {
  const hasEwaste = programs.includes("dubbo_ewaste");
  const hasRepairCafe = programs.includes("repair_cafe");
  const hasLibrary = programs.includes("library_of_things");
  const both = hasEwaste && hasRepairCafe;

  const brand = both
    ? "DubboEwaste & Repair Café"
    : hasRepairCafe
      ? "Repair Café Dubbo"
      : hasEwaste ? "DubboEwaste · AssetFlow" : hasLibrary ? "Library of Things" : "Volunteer workspace";

  return <header className="topbar">
    <div className="topbar-identity">
      <div className="brand">{brand}</div>
      <div className="userline">{fullName || "Volunteer"} · {roleLabel(role)}</div>
    </div>

    <nav className="nav-quick" aria-label="Quick navigation">
      {both ? <Link href="/access">Areas</Link> : null}
      <Link href="/learn">Learning hub</Link>
      {hasEwaste ? <Link href="/dashboard">Dashboard</Link> : null}
      {hasEwaste ? <Link href="/search">Search / Scan</Link> : null}
      {hasEwaste ? <Link href="/assets/new">Receive</Link> : null}
      {hasRepairCafe ? <Link href="/repair-cafe-volunteers">Volunteer Hub</Link> : null}
      {!hasEwaste && hasRepairCafe ? <Link href="/repair-cafe-dubbo">Public Page</Link> : null}
    </nav>

    <details className="nav-menu">
      <summary>Menu</summary>
      <div className="nav-panel">
        <section className="nav-group"><h2>Learning & development</h2><div className="nav-group-links"><Link href="/learn">My learning · All courses</Link><Link href="/learn/manage">Supervisor desk (authorised accounts)</Link></div></section>
        {hasEwaste ? groups.map((group) => <section className="nav-group" key={group.title}>
          <h2>{group.title}</h2>
          <div className="nav-group-links">
            {group.links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}
          </div>
        </section>) : null}

        {hasLibrary ? <section className="nav-group"><h2>Library of Things</h2><div className="nav-group-links"><Link href="/learn?track=library_of_things">Learning pathway</Link><a href="https://circular-economy-dubbo.vercel.app/internal/library-of-things">Pilot workspace ↗</a></div></section> : null}

        {hasRepairCafe ? <section className="nav-group">
          <h2>Repair Café</h2>
          <div className="nav-group-links">
            <Link href="/repair-cafe-volunteers">Volunteer Hub</Link>
            <Link href="/repair-cafe-dubbo">Public Page</Link>
            {role === "admin" || role === "manager" ? <Link href="/repair-cafe-feedback">Public Feedback</Link> : null}
          </div>
        </section> : null}

        <section className="nav-group">
          <h2>Connected projects</h2>
          <div className="nav-group-links">
            <Link href="/projects">Project network</Link>
          </div>
        </section>

        {role === "admin" && hasEwaste ? <section className="nav-group">
          <h2>Administration</h2>
          <div className="nav-group-links">
            <Link href="/admin/data">Manage Data</Link>
            <Link href="/admin/permissions">Permissions</Link>
          </div>
        </section> : null}
      </div>
    </details>

    <form action={logout} className="topbar-signout">
      <button className="button secondary" type="submit">Sign out</button>
    </form>
  </header>;
}
