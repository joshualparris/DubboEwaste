import Link from "next/link";
import { redirect } from "next/navigation";
import { requireProgrammeContext } from "@/lib/programme-context";
import {
  LOCAL_REPAIRERS, REPAIRER_CATEGORIES, REPAIRERS_CHECKED_AT,
  type LocalRepairer,
} from "@/lib/repair-cafe/local-repairers";
import styles from "./page.module.css";

type Filters = { q?: string; category?: string; evidence?: string; region?: string };
const all = LOCAL_REPAIRERS.slice().sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
function shortPhone(value: string) { return value.replace(/[^+\d]/g, ""); }
function filterRows({ q = "", category = "", evidence = "", region = "" }: Filters): LocalRepairer[] {
  const query = q.trim().slice(0, 120).toLocaleLowerCase("en-AU");
  return all.filter((row) => {
    if (category && row.category !== category) return false;
    if (evidence && row.evidence !== evidence) return false;
    if (region === "dubbo" && row.locality !== "Dubbo") return false;
    if (region === "nearby" && row.locality === "Dubbo") return false;
    if (!query) return true;
    return [row.name, row.services, row.category, row.locality, row.address || ""]
      .join(" ").toLocaleLowerCase("en-AU").includes(query);
  });
}
export const metadata = {
  title: "Local repairer referrals | Repair Café Dubbo",
  description: "Private, evidence-linked repair directory for Repair Café Dubbo volunteers.",
};
export default async function RepairReferralDirectory({ searchParams }: { searchParams: Promise<Filters> }) {
  const { context } = await requireProgrammeContext();
  if (!context.global_admin && context.selected !== "repair_cafe") redirect("/programmes");
  const filters = await searchParams;
  const q = (filters.q ?? "").slice(0, 120);
  const category = REPAIRER_CATEGORIES.includes(filters.category as (typeof REPAIRER_CATEGORIES)[number]) ? filters.category! : "";
  const evidence = filters.evidence === "official" || filters.evidence === "listing" ? filters.evidence : "";
  const region = filters.region === "dubbo" || filters.region === "nearby" ? filters.region : "";
  const rows = filterRows({ q, category, evidence, region });
  const officialCount = LOCAL_REPAIRERS.filter((r) => r.evidence === "official").length;
  return <main className={styles.page}>
    <nav className={styles.breadcrumb}><Link href="/repair-cafe-volunteers">← Volunteer Hub</Link> · <Link href="/repair-cafe-volunteers/knowledge">Repair knowledge</Link></nav>
    <header className={styles.hero}>
      <span className="badge">Repair Café · private volunteer resource</span>
      <h1>Find a local repairer</h1>
      <p>When we can't safely repair something at the Café, help the visitor find a professional who may be able to help. These are researched <strong>contact leads, not approved partners or endorsements</strong>.</p>
      <div className={styles.stats}>
        <span><strong>{LOCAL_REPAIRERS.length}</strong> repairer/service leads</span>
        <span><strong>{officialCount}</strong> with primary-source evidence</span>
        <span><strong>{REPAIRER_CATEGORIES.length}</strong> categories</span>
      </div>
    </header>
    <aside className={styles.notice}>
      <strong>Before referring anyone:</strong> phone the business to confirm they still trade, accept the item and have capacity. Ask about diagnosis fees, parts, warranty and data handling. We have <strong>not</strong> obtained referral agreements or verified contact details by phone. Last online research: {REPAIRERS_CHECKED_AT}.
    </aside>
    <form method="get" className={styles.filters} aria-label="Search local repairers">
      <label className={styles.wide}>Item, issue or business
        <input type="search" name="q" placeholder="e.g. coffee machine, laptop, zip, bike, mower" defaultValue={q} maxLength={120} />
      </label>
      <label>Category<select name="category" defaultValue={category}>
        <option value="">All repair types</option>{REPAIRER_CATEGORIES.map(c => <option value={c} key={c}>{c}</option>)}
      </select></label>
      <label>Area<select name="region" defaultValue={region}>
        <option value="">Dubbo + nearby</option><option value="dubbo">Dubbo only</option><option value="nearby">Nearby towns only</option>
      </select></label>
      <label>Evidence<select name="evidence" defaultValue={evidence}>
        <option value="">All evidence levels</option><option value="official">Business / primary source</option><option value="listing">Public listing only</option>
      </select></label>
      <div className={styles.actions}><button className="button" type="submit">Find repairers</button><Link className="button secondary" href="/repair-cafe-volunteers/referrals">Clear filters</Link></div>
    </form>
    <div className={styles.resultHeading}><h2>{rows.length} matching repairers</h2><p>Print-friendly · grouped by type</p></div>
    {rows.length === 0 ? <section className={styles.empty}><h3>No matches found</h3><p>Try a broader term or remove the category filter. If no local repairer is found, ask a coordinator before recommending a regional or mail-in service.</p></section> : null}
    {REPAIRER_CATEGORIES.map(group => {
      const found = rows.filter(r => r.category === group);
      if (!found.length) return null;
      return <section key={group} className={styles.section}>
        <h3>{group} <span>({found.length})</span></h3>
        <div className={styles.cards}>{found.map(row => <article key={row.id} className={styles.card}>
          <div className={styles.top}><h4>{row.name}</h4><span className={row.evidence === "official" ? styles.official : styles.listed}>{row.evidence === "official" ? "Primary source" : "Listing only"}</span></div>
          <p>{row.services}</p>
          <p className={styles.place}><strong>{row.locality}</strong>{row.address ? ` · ${row.address}` : ""}</p>
          <div className={styles.links}>
            {row.phone ? <a href={`tel:${shortPhone(row.phone)}`}>☎ {row.phone}</a> : null}
            {row.email ? <a href={`mailto:${row.email}`}>✉ Email</a> : null}
            <a href={row.source} rel="noopener noreferrer" target="_blank">{row.evidence === "official" ? "Service/source ↗" : "Business listing ↗"}</a>
          </div>
        </article>)}</div>
      </section>;
    })}
    <footer className={styles.footer}>
      <h2>Safe referral checklist</h2>
      <ol><li>Assess the issue without attempting unsafe work. Follow event safety procedures.</li>
      <li>Give the visitor two or more options where available; do not promise a repair or price.</li>
      <li>Confirm the business accepts the exact item and ask about quotes, diagnosis fees and warranties.</li>
      <li>For mains electricity, gas, refrigerant, structural work and hazardous lithium batteries, refer to properly qualified services.</li>
      <li>Do not send personal details or photographs to a business without the visitor's agreement.</li>
      </ol>
      <p>To add a repairer, correct a listing or register an actual referral partnership, speak to a Repair Café coordinator. Sources are linked in each listing; no contact or partnership status is implied by inclusion.</p>
    </footer>
  </main>;
}
