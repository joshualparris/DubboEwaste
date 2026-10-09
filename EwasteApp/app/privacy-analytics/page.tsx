import Link from "next/link";
export const metadata = { title: "Analytics and privacy | DubboEwaste" };
export default function PrivacyAnalytics() {
  return <main className="container"><section className="card" style={{ maxWidth: 760, margin: "32px auto" }}>
    <h1>Website analytics and privacy</h1>
    <p>Our public websites and signed-in volunteer tools count visits, general navigation, button/link clicks,
    successful sign-ins and broad usage trends to help improve the service.</p>
    <p>We collect grouped page names, event time, device category, referring website domain,
    and approximate country/state supplied by our hosting provider. This is not GPS location.</p>
    <p>We do not record names, email addresses, account IDs, IP addresses, passwords, form inputs, URL query
    parameters, individual asset or client identifiers, search text, or the content of private pages in analytics.
    We do not fingerprint visitors or track them between sessions.</p>
    <p>Raw events are held in a restricted database for up to 90 days; only aggregate daily
    counts may be published to our GitHub reporting files. Small location groupings are suppressed.
    Browser Do Not Track and Global Privacy Control preferences are respected.</p>
    <p>Signed-in activity is counted by page group, not attributed to named volunteers.
    These numbers are approximate, and privacy settings or blockers may prevent counting.</p>
    <p><Link href="/repair-cafe-dubbo">Return to Repair Café Dubbo</Link></p>
  </section></main>;
}
