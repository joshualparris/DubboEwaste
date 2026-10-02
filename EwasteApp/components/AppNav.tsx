import Link from "next/link";
import { logout } from "@/app/login/actions";

export function AppNav({
  fullName,
  role,
}: {
  fullName: string | null;
  role: string;
}) {
  return (
    <header className="topbar">
      <div>
        <div className="brand">DubboEwaste Operations</div>
        <div className="userline">{fullName || "Staff"} · {role}</div>
      </div>
      <nav className="nav" aria-label="Staff navigation">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/assets">Assets</Link>
        <Link href="/assets/new">New intake</Link>
      </nav>
      <form action={logout}>
        <button className="button secondary" type="submit">Sign out</button>
      </form>
    </header>
  );
}
