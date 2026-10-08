import type { Metadata } from "next";
import { RepairCafeInterestForm } from "@/components/RepairCafeInterestForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Help Shape Repair Café Dubbo",
  description: "Help shape a welcoming Repair Café for Dubbo. Tell us what you would bring, whether you would attend or volunteer, and what would make it useful.",
  openGraph: {
    title: "Help Shape Repair Café Dubbo",
    description: "Fix it. Learn it. Keep it in use.",
    type: "website",
  },
};

const categories = [
  ["💻", "Computers & electronics", "Laptops, phones and small electronics."],
  ["🚲", "Bikes & mechanical", "Bikes, tools and small mechanical items."],
  ["🧵", "Clothing & textiles", "Mending, buttons, seams and simple sewing."],
  ["🪑", "Household items", "Small furniture, toys and other portable things."],
];

export default function RepairCafeDubboPage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero} id="top">
        <nav className={styles.nav} aria-label="Repair Café Dubbo">
          <a className={styles.brand} href="#top">Repair Café Dubbo</a>
          <a className={styles.navCta} href="#have-your-say">Have your say</a>
        </nav>

        <div className={styles.heroInner}>
          <p className={styles.status}>Community idea being tested · no event is operating yet</p>
          <h1>Fix it. Learn it.<br />Keep it in use.</h1>
          <p className={styles.lede}>
            We&apos;re exploring a friendly Repair Café for Dubbo where people can bring broken everyday items,
            sit with volunteers and try to repair them together.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#have-your-say">I&apos;m interested</a>
            <a className={styles.secondary} href="#how-it-works">How would it work?</a>
          </div>
          <p className={styles.micro}>You do not need repair skills to take part or volunteer.</p>
        </div>
      </header>

      <section className={styles.section} id="how-it-works">
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>Simple idea</p>
          <h2>Bring something broken. Work on it together.</h2>
        </div>
        <div className={styles.steps}>
          <article><strong>1</strong><h3>Bring it</h3><p>Bring a portable item that needs a repair or a second look.</p></article>
          <article><strong>2</strong><h3>Learn together</h3><p>Sit with a volunteer and understand what might be wrong.</p></article>
          <article><strong>3</strong><h3>Repair or get a next step</h3><p>If it cannot be fixed there, you still leave knowing more about what to do next.</p></article>
        </div>
      </section>

      <section className={styles.altSection}>
        <div className={styles.inner}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>What might we repair?</p>
            <h2>Useful everyday things.</h2>
            <p>The first event would only offer categories we have suitable volunteers and a safe setup for.</p>
          </div>
          <div className={styles.categories}>
            {categories.map(([icon,title,body]) => (
              <article key={title}>
                <span aria-hidden="true">{icon}</span>
                <div><h3>{title}</h3><p>{body}</p></div>
              </article>
            ))}
          </div>
          <p className={styles.safety}>
            <strong>It would not be a free drop-off repair shop.</strong> Owners would stay and participate where possible,
            and unsafe or specialist jobs could be referred elsewhere.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.split}>
          <div>
            <p className={styles.kicker}>Want to help?</p>
            <h2>You don&apos;t have to be a fixer.</h2>
            <p>
              Repair skills are useful, but so are people who can welcome visitors, make tea, set up tables,
              organise an event, help with promotion, offer a venue or simply learn alongside someone experienced.
            </p>
          </div>
          <div className={styles.callout}>
            <strong>Could you help?</strong>
            <p>Tell us in the short form below. If a pilot goes ahead, people who ask to be contacted can receive the detailed volunteer information then.</p>
          </div>
        </div>
      </section>

      <section className={styles.formSection} id="have-your-say">
        <div className={styles.formIntro}>
          <p className={styles.kicker}>Have your say</p>
          <h2>Would you use or help with a Repair Café in Dubbo?</h2>
          <p>This should take about a minute. You can respond anonymously.</p>
        </div>
        <RepairCafeInterestForm />
      </section>

      <section className={styles.section}>
        <div className={styles.faq}>
          <details>
            <summary>Is Repair Café Dubbo already running?</summary>
            <p>No. We are measuring interest before committing to a venue or event.</p>
          </details>
          <details>
            <summary>Would I have to pay?</summary>
            <p>The usual Repair Café model uses volunteer help, with visitors covering any parts they choose to use. Exact Dubbo arrangements would be confirmed before a pilot.</p>
          </details>
          <details>
            <summary>Can I volunteer if I&apos;m a beginner?</summary>
            <p>Yes. Learners and non-repair volunteers are part of the idea.</p>
          </details>
        </div>
      </section>

      <footer className={styles.footer}>
        <strong>Repair Café Dubbo</strong>
        <span>Community interest page · Dubbo, NSW</span>
        <a href="/repair-cafe-volunteers">Volunteer team login</a>
      </footer>
    </main>
  );
}
