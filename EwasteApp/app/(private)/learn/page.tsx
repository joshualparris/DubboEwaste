import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { courses, programmes, courseProgress, type Programme } from "@/lib/learning/catalog";
import { enrolInCourse } from "./actions";
import styles from "./learning.module.css";

export const metadata = { title: "Dubbo Circular Learning" };
export default async function LearningHome({
  searchParams,
}: { searchParams: Promise<{ track?: string; error?: string }> }) {
  const { track, error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [membership, enrolments, completions] = await Promise.all([
    supabase.from("program_access").select("program").eq("user_id", user!.id),
    supabase.from("learning_enrolments").select("course_slug").eq("user_id", user!.id),
    supabase.from("learning_progress").select("course_slug,lesson_slug").eq("user_id", user!.id),
  ]);
  const assigned = new Set((membership.data ?? []).map(x => x.program));
  const joined = new Set((enrolments.data ?? []).map(x => x.course_slug));
  const done = completions.data ?? [];
  const chosen = programmes.some(p => p.id === track) ? track as Programme : "all";
  const visible = courses.filter(c => !track || track === "all" || c.programme === chosen);
  const recommended = courses.filter(c => c.programme === "all" || assigned.has(c.programme));
  const activeCount = courses.filter(c => joined.has(c.id)).length;
  const finishedCount = courses.filter(c => joined.has(c.id) && courseProgress(c, done).percent === 100).length;
  const recommendedIds = new Set(recommended.map(c => c.id));
  return <div className={styles.shell}>
    <header className={styles.hero}>
      <div className={styles.eyebrow}>Dubbo Circular Learning · Volunteer academy</div>
      <h1>Grow your skills. Keep good things in use.</h1>
      <p>Choose a practical course, learn in short steps and come back whenever you like. All programmes share this learning space.</p>
      <div className={styles.stats}>
        <span><strong>{courses.length}</strong> courses</span>
        <span><strong>{activeCount}</strong> joined</span>
        <span><strong>{finishedCount}</strong> completed</span>
      </div>
    </header>
    {error ? <p role="alert" className={styles.notice}>{error}</p> : null}
    <section className={styles.section} aria-labelledby="pathways">
      <h2 id="pathways">Explore a learning pathway</h2>
      <nav aria-label="Filter courses by programme" className={styles.filters}>
        <Link className={!track || track === "all" ? styles.filterSelected : styles.filter} href="/learn">All courses</Link>
        {programmes.map(p => <Link key={p.id} className={chosen === p.id && Boolean(track) ? styles.filterSelected : styles.filter}
          href={"/learn?track=" + p.id}>{p.icon} {p.label}</Link>)}
      </nav>
      <p className={styles.hint}>Training can be explored across programmes. Operational permissions remain separate. Courses marked “Your team” match your assigned area.</p>
    </section>
    <section className={styles.catalogue} aria-label="Learning catalogue">
      {visible.map(c => {
        const isJoined = joined.has(c.id);
        const progress = courseProgress(c, done);
        return <article className={styles.courseCard} key={c.id}>
          <div className={styles.courseMeta}>
            <span className={styles.track}>{programmes.find(p => p.id === c.programme)?.icon} {programmes.find(p => p.id === c.programme)?.label}</span>
            {recommendedIds.has(c.id) ? <span className={styles.recommended}>Your team</span> : null}
          </div>
          <h3><Link href={"/learn/" + c.id}>{c.title}</Link></h3>
          <p>{c.summary}</p>
          <div className={styles.courseDetails}>{c.level} · {c.duration} min · {c.lessons.length} lessons</div>
          {isJoined ? <>
            <div className={styles.progressLabel}><span>{progress.complete} of {progress.total} lessons</span><span>{progress.percent}%</span></div>
            <progress aria-label={c.title + " progress"} value={progress.complete} max={progress.total} />
            <Link className={styles.primaryLink} href={"/learn/" + c.id}>{progress.percent === 100 ? "Review course" : "Continue learning"} →</Link>
          </> : <form action={enrolInCourse}>
            <input type="hidden" name="course" value={c.id}/>
            <button type="submit" className={styles.primaryButton}>Join this course →</button>
          </form>}
        </article>;
      })}
    </section>
    <aside className={styles.footerNote}>
      <h2>Learning, not licensing</h2>
      <p>These short courses are internal volunteer learning aids, not electrical licences, industry accreditation or proof that you are authorised for a high-risk task. Your coordinator determines your permitted work.</p>
    </aside>
  </div>;
}
