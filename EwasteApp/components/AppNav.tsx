import Link from "next/link";
import { logout } from "@/app/login/actions";

export function AppNav({ fullName, role }: { fullName: string | null; role: string }) {
  return <header className="topbar">
    <div><div className="brand">DubboEwaste · AssetFlow</div><div className="userline">{fullName || "Staff"} · {role}</div></div>
    <nav className="nav" aria-label="Staff navigation">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/search">Search / Scan</Link>
      <Link href="/jobs">Jobs</Link>
      <Link href="/lots">Lots</Link>
      <Link href="/assets">Assets</Link>
      <Link href="/assets/new">Receive</Link>
      <Link href="/triage">Triage</Link>
      <Link href="/processing">Processing</Link>
      <Link href="/media">Sanitisation</Link>
      <Link href="/repairs">Repairs</Link>
      <Link href="/resale">Resale</Link>
      <Link href="/recycling">Recycling</Link>
      <Link href="/settlements">Settlements</Link>
      <Link href="/exceptions">Exceptions</Link>
      <Link href="/certificates">Certificates</Link>
      <Link href="/reports">Reports</Link>
      <Link href="/customers">Customers</Link>
      <Link href="/crm">CRM</Link>
      <Link href="/crm/opportunities">Pipeline</Link>
      <Link href="/crm/quotes">Quotes</Link>
      <Link href="/locations">Locations</Link>
      <Link href="/documents">Documents</Link>
      <Link href="/dubbo-repair-ewaste">Dubbo Repair Guide</Link>
      <Link href="/regional-computer-experts">Regional Experts</Link>
      {role === "admin" ? <Link href="/admin/data">Manage Data</Link> : null}
      {role === "admin" ? <Link href="/admin/permissions">Permissions</Link> : null}
    </nav>
    <form action={logout}><button className="button secondary" type="submit">Sign out</button></form>
  </header>;
}
