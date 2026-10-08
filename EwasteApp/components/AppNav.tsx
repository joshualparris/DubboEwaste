"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
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

export function AppNav({ fullName, role }: { fullName: string | null; role: string }) {
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
      <div className="brand">DubboEwaste · AssetFlow</div>
      <div className="userline">{fullName || "Staff"} · {role}</div>
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
        {groups.map((group) => <section className="nav-group" key={group.title}>
          <h2>{group.title}</h2>
          <div className="nav-group-links">
            {group.links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}
          </div>
        </section>)}

        {["admin","manager","technician","volunteer"].includes(role) ? <section className="nav-group">
          <h2>Repair Café</h2>
          <div className="nav-group-links">
            <Link href="/repair-cafe-volunteers">Volunteer Hub</Link>
            <Link href="/repair-cafe-dubbo">Public Page</Link>
            {role === "admin" || role === "manager" ? <Link href="/repair-cafe-feedback">Public Feedback</Link> : null}
          </div>
        </section> : null}

        {role === "admin" ? <section className="nav-group">
          <h2>Administration</h2>
          <div className="nav-group-links">
            <Link href="/admin/data">Manage Data</Link>
            <Link href="/admin/permissions">Permissions</Link>
          </div>
        </section> : null}
        <form action={logout} className="topbar-signout">
          <button className="button secondary" type="submit">Sign out</button>
        </form>
      </nav>
    </details>
  </header>;
}
