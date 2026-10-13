import type { Metadata } from "next";
import Link from "next/link";
import { requireProgrammeContext } from "@/lib/programme-context";
import { GO_SHORTCUTS, visibleHelpSections } from "@/lib/help-navigation";

export const metadata: Metadata = { title: "Help & keyboard shortcuts | AssetFlow", description: "Find features, learn AssetFlow workflows and move around faster." };

export default async function HelpPage() {
  const { context } = await requireProgrammeContext();
  const sections = visibleHelpSections(context);
  const allowed = new Set(sections.flatMap(section => section.links.map(link => link.href)));
  const shortcuts = GO_SHORTCUTS.filter(item => allowed.has(item.href));

  const step = (href: string, title: string, details: string) => <li key={title}>
    {allowed.has(href) ? <Link href={href}><strong>{title}</strong></Link> : <strong>{title}</strong>}
    <span className="muted"> — {details}</span>
  </li>;

  return <div className="stack assetflow-help">
    <section className="card">
      <div className="badge">Help centre</div>
      <h1>Get around AssetFlow</h1>
      <p>Find the right screen, learn the basic workflows and spend less time navigating menus. This guide shows routes available to your currently selected programme and role.</p>
      <p className="muted">Tip: press <kbd>Ctrl</kbd> + <kbd>K</kbd> (Windows) or <kbd>⌘</kbd> + <kbd>K</kbd> (Mac) anywhere in the signed-in app to search pages by name or purpose. On phones, use <strong>Find a page</strong> in the top bar.</p>
      <div className="actions">
        <Link className="button" href="/dashboard">Open dashboard</Link>
        <Link className="button secondary" href="/programmes">Switch programme</Link>
        {allowed.has("/search") ? <Link className="button secondary" href="/search">Search an asset or record</Link> : null}
      </div>
    </section>

    <section className="card" id="shortcuts">
      <h2>Keyboard shortcuts</h2>
      <p>These shortcuts work outside text fields and forms. Use the quick navigator to find a page by name, or press <strong>G</strong>, release it, then press a destination key.</p>
      <div className="table-wrap"><table><thead><tr><th>What you want to do</th><th>Keys</th></tr></thead><tbody>
        <tr><td>Open quick page search</td><td><kbd>Ctrl / ⌘</kbd> + <kbd>K</kbd></td></tr>
        <tr><td>See shortcut cheat sheet</td><td><kbd>?</kbd></td></tr>
        {allowed.has("/search") ? <tr><td>Search / barcode scan</td><td><kbd>/</kbd></td></tr> : null}
        {shortcuts.map(item => <tr key={item.href}><td><Link href={item.href}>{item.label}</Link></td><td><kbd>G</kbd> then <kbd>{item.key.toUpperCase()}</kbd></td></tr>)}
        <tr><td>Close the quick navigator</td><td><kbd>Esc</kbd></td></tr>
      </tbody></table></div>
      <p className="muted small">Single-letter shortcuts are disabled while you're typing or selecting text in a form. Ctrl/⌘ K is an intentional shortcut even while a form has focus. Shortcuts only navigate; they never submit, edit, delete or automatically save records.</p>
    </section>

    {allowed.has("/jobs") ? <section className="card" id="asset-workflow">
      <h2>How to process a received computer</h2>
      <p>Use your organisation's approved intake, privacy, safety and sanitisation processes. These screens help record the evidence; opening a screen is not a safety approval.</p>
      <ol>
        {step("/jobs", "Create or find a job", "record who authorised the collection or work")}
        {step("/lots", "Choose its lot", "group devices received together")}
        {step("/assets/new", "Receive the asset", "assign an internal ID, model and storage-media status")}
        {step("/triage", "Triage", "record condition, hazards and the appropriate next track")}
        {step("/media", "Sanitisation", "record actual media and verified outcomes before any data-bearing item changes hands")}
        {step("/repairs", "Repair", "record the work, parts and testing")}
        {step("/resale", "Resale", "only release equipment that has passed the appropriate checks")}
        {step("/recycling", "Recycling", "trace non-reusable items to the approved recycler")}
      </ol>
      <p className="muted small">Media missing at intake is not the same thing as a verified data sanitisation. Unsafe lithium batteries or hazardous equipment need separate handling.</p>
    </section> : null}

    {allowed.has("/repair-cafe-volunteers") ? <section className="card" id="repair-cafe-workflow">
      <h2>How to run a Repair Café session</h2>
      <p>Owner-present volunteer repairs are separate from donated-device intake and resale. Always complete the actual venue, insurance and safety checks first.</p>
      <ol>
        {step("/repair-cafe-volunteers/sessions", "Prepare the session", "confirm date, venue, stations and roster")}
        {step("/repair-cafe-volunteers/preflight", "Review safety preflight", "for authorised organisers; do not open an unsafe event")}
        {step("/repair-cafe-volunteers/event-desk", "Use Event Desk", "register each visitor and item, manage the queue and assignment")}
        {step("/repair-cafe-volunteers/knowledge", "Consult repair knowledge", "check relevant procedures, competence and safety limits")}
        {step("/repair-cafe-volunteers/event-desk", "Record outcome and return", "document what was and wasn't fixed and hand the item to its owner")}
        {step("/repair-cafe-volunteers/reports", "Review results", "track repairs, referrals, measured item weight and volunteer effort")}
      </ol>
      <p className="muted small">Repair Café correspondence and insurance research is restricted to authorised coordinators in the <Link href="/repair-cafe-volunteers">Volunteer Hub</Link>.</p>
    </section> : null}

    {allowed.has("/lending") ? <section className="card" id="lending-workflow">
      <h2>Library of Things: where to start</h2>
      <p><Link href="/lending"><strong>Loans & returns</strong></Link> is the main place to manage borrowing and returns. Use <Link href="/assets">Assets</Link> to find your programme's items, and <Link href="/search">Search / Scan</Link> to locate them quickly. Check condition and any lending policy before handing over an item.</p>
    </section> : null}

    <section className="card" id="all-sections">
      <h2>Browse all available sections</h2>
      <p className="muted">Can't remember the exact name? Open <strong>Find a page</strong> and try the action or item you're looking for, such as “invoice”, “serial”, “donor”, “repair”, “queue” or “report”.</p>
      <div className="grid">{sections.map(section => <section className="card" key={section.title}>
        <h3>{section.title}</h3><p className="muted small">{section.description}</p>
        <ul>{section.links.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link><div className="muted small">{link.description}</div></li>)}</ul>
      </section>)}</div>
    </section>

    <section className="card" id="troubleshooting">
      <h2>Common questions</h2>
      <details><summary><strong>Why can't I see a module or a shortcut?</strong></summary><p>AssetFlow has separate programme access and roles. Open <Link href="/programmes">Switch programme</Link> and choose an account-approved programme. Admin-only screens are intentionally hidden from other users. Ask an authorised programme administrator if you need a different role.</p></details>
      <details><summary><strong>How do I find something when I only know the serial number?</strong></summary><p>Open <Link href="/search">Search / Scan</Link> or press <kbd>/</kbd> outside a text field. Enter the serial, internal asset ID, job, lot or other record reference. A QR/barcode scanner is available on the search screen.</p></details>
      <details><summary><strong>Did pressing a shortcut change or save my work?</strong></summary><p>No. Quick navigation moves between screens only. Save a form before leaving it; a shortcut does not automatically submit a form or preserve unsaved fields.</p></details>
      <details><summary><strong>Why is a repair or sanitisation record still restricted?</strong></summary><p>Records must be completed with actual evidence and approval. An unverified wipe, missing drive, hazardous battery or incomplete test does not automatically become a successful, safe or ready-to-transfer outcome.</p></details>
      <details><summary><strong>How do I change light or dark mode?</strong></summary><p>Use <Link href="/settings">Settings</Link>, then Appearance. The preference can follow your device or be set manually.</p></details>
    </section>
  </div>;
}
