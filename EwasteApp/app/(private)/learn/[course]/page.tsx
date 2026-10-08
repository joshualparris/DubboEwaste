import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourse, courseProgress, programmes } from "@/lib/learning/catalog";
import { enrolInCourse } from "../actions";
import styles from "../learning.module.css";

export default async function CourseOverview({
  params, searchParams,
}: { params: Promise<{ course: string }>; searchParams: Promise<{ error?: string; message?: string }> }) {
  const { course: id } = await params;
  const { error, message } = await searchParams;
  const course = getCourse(id);
  if (!course) notFound();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [enrolment, doneResult] = await Promise.all([
    supabase.from("learning_enrolments").select("course_slug").eq("user_id",user!.id).eq("course_slug",id).maybeSingle(),
    supabase.from("learning_progress").select("course_slug,lesson_slug").eq("user_id",user!.id).eq("course_slug",id),
  ]);
  const joined = Boolean(enrolment.data);
  const done = doneResult.data ?? [];
  const progress = courseProgress(course, done);
  return <div className={styles.shell}>
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/learn">Learning hub</Link><span aria-hidden="true">/</span><span>{course.title}</span></nav>
    <header className={styles.courseHero}>
      <span className={styles.track}>{programmes.find(x => x.id === course.programme)?.icon} {programmes.find(x => x.id === course.programme)?.label}</span>
      <h1>{course.title}</h1>
      <p>{course.summary}</p>
      <p className={styles.hint}>{course.level} · Around {course.duration} minutes · {course.lessons.length} short lessons</p>
      {joined ? <>
        <div className={styles.progressLabel}><strong>Your progress</strong><strong>{progress.percent}%</strong></div>
        <progress aria-label="Course completion" value={progress.complete} max={progress.total}/>
      </> : <form action={enrolInCourse}><input type="hidden" name="course" value={id}/><button className={styles.primaryButton}>Join course and start →</button></form>}
    </header>
    {error ? <p role="alert" className={styles.notice}>{error}</p> : null}
    {message === "enrolled" ? <p role="status" className={styles.success}>You are enrolled. Choose your first lesson below.</p> : null}
    <section className={styles.section} aria-labelledby="lessons">
      <h2 id="lessons">Your lessons</h2>
      <div className={styles.lessonList}>
        {course.lessons.map((lesson, index) => {
          const completed = done.some(x => x.lesson_slug === lesson.id);
          const href = "/learn/" + id + "/" + lesson.id;
          return <div className={styles.lessonRow} key={lesson.id}>
            <span className={styles.lessonIndex} aria-hidden="true">{completed ? "✓" : index+1}</span>
            <div><h3>{lesson.title}</h3><p>{lesson.idea}</p><span className={styles.hint}>{completed ? "Completed" : "Ready when you are"}</span></div>
            {joined ? <Link className={styles.secondaryLink} href={href}>{completed ? "Review" : "Start"} →</Link> : <span className={styles.hint}>Enrol to start</span>}
          </div>;
        })}
      </div>
    </section>
    <aside className={styles.sourcePanel}>
      <h2>Go deeper</h2>
      <p>Adapted from project research. Follow the primary notes for more detail and check the relevant procedures before any real-world work.</p>
      {course.id === "multimeter-low-voltage" ? <p><a href="https://joshualparris.github.io/DubboEwaste/multimeter-training.html" target="_blank" rel="noreferrer">Explore the curated video tutorials ↗</a></p> : null}
      <a href={"https://github.com/joshualparris/DubboEwaste/blob/main/" + course.source}
        target="_blank" rel="noreferrer">Read the original project guide ↗</a>
    </aside>
  </div>;
}
