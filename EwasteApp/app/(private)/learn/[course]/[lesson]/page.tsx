import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourse } from "@/lib/learning/catalog";
import { completeLearningLesson } from "../../actions";
import styles from "../../learning.module.css";
import ActiveRecallPanel from "@/components/ActiveRecallPanel";
import { deepPathwayFor } from "@/lib/learning/deep-pathways";

export default async function LessonPage({ params, searchParams }: {
  params: Promise<{ course: string; lesson: string }>;
  searchParams: Promise<{ result?: string }>;
}) {
  const { course: id, lesson: lessonId } = await params;
  const { result } = await searchParams;
  const course = getCourse(id);
  const index = course?.lessons.findIndex(l => l.id === lessonId) ?? -1;
  if (!course || index < 0) notFound();
  const lesson = course.lessons[index];
  const isLast = index === course.lessons.length - 1;
  const deep=deepPathwayFor(id);
  const studyCase=deep?.cases[index];
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [enrolment, progress] = await Promise.all([
    supabase.from("learning_enrolments").select("course_slug").eq("user_id",user!.id).eq("course_slug",id).maybeSingle(),
    supabase.from("learning_progress").select("lesson_slug").eq("user_id",user!.id).eq("course_slug",id),
  ]);
  if (!enrolment.data) redirect("/learn/" + id + "?error=Enrol%20before%20opening%20lessons");
  const complete = (progress.data ?? []).some(p => p.lesson_slug === lessonId);
  const next = course.lessons[index+1];
  return <article className={styles.shell}>
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/learn">Learning hub</Link><span aria-hidden="true">/</span><Link href={"/learn/" + id}>{course.title}</Link><span aria-hidden="true">/</span><span>Lesson {index+1}</span></nav>
    <div className={styles.lessonHero}>
      <span className={styles.eyebrow}>Lesson {index+1} of {course.lessons.length} · {course.level}</span>
      <h1>{lesson.title}</h1>
      <p>{lesson.idea}</p>
    </div>
    <section className={styles.lessonBody} aria-labelledby="explore">
      <h2 id="explore">What to remember</h2>
      <ol className={styles.learningSteps}>{lesson.steps.map((step,i) => <li key={i}>{step}</li>)}</ol>
      <div className={styles.practice}>
        <h2>Try it yourself</h2>
        <p>{lesson.practice}</p>
        <p className={styles.hint}>Choose an imaginary example if you are not working in a supervised setting. Do not practise on a real hazard or private device without permission.</p>
      </div>
      {deep&&studyCase?<section className={styles.deepLesson} aria-labelledby="advanced-problem">
        <span className={styles.deepEyebrow}>Applied technical exercise · {index+1} / 3</span>
        <h2 id="advanced-problem">Work through a real decision</h2>
        <p className={styles.deepProblem}>{studyCase.prompt}</p>
        <p><strong>Your evidence:</strong> Before revealing the model reasoning, calculate values where relevant, state assumptions and list what observation would change your conclusion. For physical work, practise only within your competency.</p>
        <details className={styles.deepAnswer}>
          <summary>Reveal worked reasoning and compare your solution</summary>
          <p>{studyCase.workedAnswer}</p>
          <p><strong>Boundary or failure mode:</strong> {studyCase.safety}</p>
        </details>
        <div className={styles.deepNext}>
          <strong>External teaching for this course</strong>
          <p>{deep.resources[0].why}</p>
          <a href={deep.resources[0].url} target="_blank" rel="noopener noreferrer">Study {deep.resources[0].title} · {deep.resources[0].provider} ↗</a>
          {deep.resources.length>1?<a href={deep.resources[Math.min(index+1,deep.resources.length-1)].url} target="_blank" rel="noopener noreferrer">Alternative: {deep.resources[Math.min(index+1,deep.resources.length-1)].title} ↗</a>:null}
        </div>
      </section>:null}
      <ActiveRecallPanel courseTitle={course.title} lessonTitle={lesson.title} summary={lesson.idea} practice={lesson.practice} />
      <h2>Full background and reference</h2>
      <p>{deep?"These in-site lessons are orientation and practical decision prompts. The linked provider materials teach the fuller theory, worked examples and limitations. Completing a tick-box is not a competency sign-off.":"This lesson is a starting point, not a complete operating procedure. The source material explains the wider context, limits and unresolved questions."}</p>
      <a className={styles.sourceLink} href={"https://github.com/joshualparris/DubboEwaste/blob/main/" + course.source}
        target="_blank" rel="noreferrer">Open the full source guide ↗</a>
    </section>
    <section className={styles.checkPanel} aria-labelledby="check">
      <h2 id="check">{isLast ? "Knowledge check" : deep ? "Record orientation, not certification" : "Ready to move on?"}</h2>
      {result === "retry" ? <p role="alert" className={styles.notice}>Not quite. Review the lesson and try a different answer.</p> : null}
      {result === "practice" ? <p role="alert" className={styles.notice}>Tick the practice acknowledgement before completing this lesson.</p> : null}
      {result === "save-error" ? <p role="alert" className={styles.notice}>We could not save your progress. Please ask your coordinator to check the learning database.</p> : null}
      {result === "complete" || complete ? <p role="status" className={styles.success}>✓ Lesson completed and saved to your account.</p> : null}
      <form action={completeLearningLesson} className={styles.checkForm}>
        <input type="hidden" name="course" value={course.id}/>
        <input type="hidden" name="lesson" value={lesson.id}/>
        {isLast ? <fieldset className={styles.quiz}>
          <legend>{course.check.question}</legend>
          {course.check.options.map((option,i) =>
            <label key={i}><input required type="radio" name="answer" value={i}/><span>{option}</span></label>)}
        </fieldset> : <label className={styles.acknowledgement}>
          <input type="checkbox" name="practice_done" value="yes" required/>
          <span>{deep?"I have worked through the applied problem and reflected on the worked reasoning. This records orientation only.":"I have read this lesson and considered the practice task."}</span>
        </label>}
        <button type="submit" className={styles.primaryButton}>{complete ? "Save again" : "Complete lesson"} →</button>
      </form>
      {complete && isLast ? <p className={styles.hint}>{course.check.explanation}</p> : null}
      <div className={styles.lessonActions}>
        {index > 0 ? <Link href={"/learn/" + id + "/" + course.lessons[index-1].id}>← Previous lesson</Link> : <Link href={"/learn/" + id}>← Course overview</Link>}
        {next && complete ? <Link className={styles.secondaryLink} href={"/learn/" + id + "/" + next.id}>Next lesson →</Link> : null}
        {isLast && complete ? <Link className={styles.secondaryLink} href={"/learn/" + id}>See course progress →</Link> : null}
      </div>
    </section>
  </article>;
}
