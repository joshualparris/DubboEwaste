"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { logout } from "@/app/login/actions";

import { PROGRAMMES, canVisit, type ProgrammeContext } from "@/lib/programmes";

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

export function AppNav({ fullName, role, programme = null, globalAdmin = role === "admin" }: { fullName: string | null; role: string; programme?: ProgrammeContext["selected"]; globalAdmin?: boolean }) {
  const allowed = (path: string) => canVisit(path, programme, globalAdmin, role);
  const visibleGroups = groups.map(group => ({ ...group, links: group.links.filter(([href]) => allowed(href)) })).filter(group => group.links.length);
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => { if (menu.current) menu.current.open = false; }, [pathname]);
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    }
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && menu.current?.open && !menu.current.contains(event.target)) menu.current.open = false;
    }
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, []);
  return <header className="topbar">
    <div className="topbar-identity">
      <div className="brand">AssetFlow</div>
      <div className="userline">{fullName || "Staff"} · {role}<br />{programme && programme !== "__denied__" ? PROGRAMMES[programme] : globalAdmin ? "All programmes" : "Choose programme"}</div>
    </div>

    <nav className="nav-quick" aria-label="Quick navigation">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/search">Search / Scan</Link>
      <Link href="/assets/new">Receive</Link>
    </nav>

    <details className="nav-menu" ref={menu}>
      <summary>Menu</summary>
      <nav className="nav-panel" aria-label="All navigation" onClick={(event) => {
        if ((event.target as HTMLElement).closest("a") && menu.current) menu.current.open = false;
      }}>
        {visibleGroups.map((group) => <section className="nav-group" key={group.title}>
          <h2>{group.title}</h2>
          <div className="nav-group-links">
            {group.links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}
          </div>
        </section>)}

        {allowed("/repair-cafe-volunteers") ? <section className="nav-group">
          <h2>Repair Café</h2>
          <div className="nav-group-links">
            <Link href="/repair-cafe-volunteers">Volunteer Hub</Link>
            <Link href="/repair-cafe-volunteers/sessions">Sessions & rosters</Link>
            <Link href="/repair-cafe-volunteers/event-desk">Event Desk · repairs</Link>
            {(globalAdmin || role === "admin" || role === "manager") ? <Link href="/repair-cafe-volunteers/operations">Operations & safety</Link> : null}
            {(globalAdmin || role === "admin" || role === "manager") ? <Link href="/repair-cafe-volunteers/reports">Event reports</Link> : null}
            {(globalAdmin || role === "admin" || role === "manager") ? <Link href="/repair-cafe-volunteers/people">Volunteer directory</Link> : null}
            <Link href="/repair-cafe-dubbo">Public Page</Link>
            {role === "admin" || role === "manager" ? <Link href="/repair-cafe-feedback">Public Feedback</Link> : null}
          </div>
        </section> : null}

        {allowed("/learn") ? <section className="nav-group"><h2>Learning & development</h2><div className="nav-group-links"><Link href="/learn">Shared learning hub</Link><Link href="/learn/manage">Supervisor desk</Link><Link href="/circular-access">Circular economy research</Link>{programme === "library_of_things" ? <Link href="/learn?track=library_of_things">Library training pathway</Link> : null}</div></section> : null}
        {allowed("/projects") ? <section className="nav-group"><h2>Connected projects</h2><div className="nav-group-links"><Link href="/projects">Project network</Link></div></section> : null}
        {globalAdmin ? <section className="nav-group">
          <h2>Administration</h2>
          <div className="nav-group-links">
            <Link href="/admin/data">Manage Data</Link>
            <Link href="/admin/permissions">Permissions</Link>
          </div>
        </section> : null}
        <section className="nav-group"><h2>Programme</h2><div className="nav-group-links">
          <Link href="/programmes">Switch programme</Link>
          {allowed("/lending") ? <Link href="/lending">Loans & returns</Link> : null}
          {globalAdmin || role === "admin" ? <Link href="/admin/programmes">Programme memberships</Link> : null}
        </div></section>
        <form action={logout} className="topbar-signout">
          <button className="button secondary" type="submit">Sign out</button>
        </form>
      </nav>
    </details>
  </header>;
}
