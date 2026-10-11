import Link from "next/link";
import {notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {getCourse,courseProgress,programmes} from "@/lib/learning/catalog";
import {mediaForCourse} from "@/lib/learning/media";
import {CourseMediaPlayer} from "@/components/learning/CourseMediaPlayer";
import {enrolInCourse} from "../actions";
import {finishMedia,submitPractical} from "../learning-activities";
import styles from "../learning.module.css";
import AdaptiveAssessment from "@/components/AdaptiveAssessment";
import RepairPricingStudio from "@/components/RepairPricingStudio";
import LaptopDiagnosticsLab from "@/components/LaptopDiagnosticsLab";
import RefurbAudioCompanion from "@/components/RefurbAudioCompanion";
import {independentlyObservedSignoff,rubricTotal,refurbSkillNames} from "@/lib/learning/mastery";
import { deepPathwayFor } from "@/lib/learning/deep-pathways";
import {assessLearningQuality,qualityStageLabel} from "@/lib/learning/quality";

export default async function CourseOverview({params,searchParams}:{
 params:Promise<{course:string}>,searchParams:Promise<{error?:string,message?:string}>
}){
 const {course:id}=await params;
 const {error,message}=await searchParams;
 const course=getCourse(id);
 if(!course) notFound();
 const deep=deepPathwayFor(id);
 const quality=assessLearningQuality(course);
 const db=await createClient();
 const {data:{user}}=await db.auth.getUser();
 if(!user) return null;
 const [enrolment,doneResult,mediaDone,submissions,memberships,assignments]=await Promise.all([
  db.from("learning_enrolments").select("course_slug").eq("user_id",user.id).eq("course_slug",id).maybeSingle(),
  db.from("learning_progress").select("course_slug,lesson_slug").eq("user_id",user.id).eq("course_slug",id),
  db.from("learning_media_progress").select("resource_slug").eq("user_id",user.id).eq("course_slug",id),
  db.from("learning_practical_submissions").select("id,submitted_at,status,reviewer_id,reviewed_at,feedback,directly_observed,observed_on,observation_method,evidence_reference,assessor_attested,skill_consent,skill_diagnosis,skill_compatibility,skill_safety,skill_verification,skill_handover").eq("user_id",user.id).eq("course_slug",id).order("submitted_at",{ascending:false}).limit(100),
  db.from("program_access").select("program").eq("user_id",user.id).eq("active",true),
  db.from("learning_assignments").select("programme,due_date").eq("user_id",user.id).eq("course_slug",id),
 ]);
 const joined=Boolean(enrolment.data);
 const done=doneResult.data??[];
 const progress=courseProgress(course,done);
 const media=mediaForCourse(id);
 const watched=new Set((mediaDone.data??[]).map(r=>r.resource_slug));
 const areas=(memberships.data??[]).map(m=>m.program).filter(p=>["dubbo_ewaste","repair_cafe","library_of_things"].includes(p));
 const practicalAreas=course.programme==="all"?areas:areas.filter(a=>a===course.programme);
 const reviews=submissions.data??[];
 const signedOff=id==="repair-laptop-refurb"?reviews.filter(r=>independentlyObservedSignoff(r,user.id)):[];
 return <div className={styles.shell}>
  <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/learn">Learning hub</Link><span>/</span><span>{course.title}</span></nav>
  <header className={styles.courseHero}>
   <span className={styles.track}>{programmes.find(x=>x.id===course.programme)?.icon} {programmes.find(x=>x.id===course.programme)?.label}</span>
   <h1>{course.title}</h1><p>{course.summary}</p>
   <p className={styles.hint}>{course.level} · {deep?"Three orientation lessons; external in-depth study and a supervised application recommended":`Around ${course.duration} minutes · ${course.lessons.length} lessons`}</p>
   <p className={styles.hint}><strong>Content quality:</strong> {qualityStageLabel(quality.stage)}. This rating describes teaching materials, not your competence or permission to perform repairs.</p>
   {(assignments.data??[]).length>0 ? <p className={styles.notice}>Assigned to you for {(assignments.data??[]).map(a=>a.programme.replaceAll("_"," ")).join(", ")}. {(assignments.data??[]).filter(a=>a.due_date).map(a=>"Target date: "+a.due_date).join("; ")}</p>:null}
   {joined ? <><div className={styles.progressLabel}><strong>Lesson progress</strong><strong>{progress.percent}%</strong></div><progress aria-label="Course completion" value={progress.complete} max={progress.total}/></>
    : <form action={enrolInCourse}><input type="hidden" name="course" value={id}/><button className={styles.primaryButton}>Join this course →</button></form>}
  </header>
  {error?<p role="alert" className={styles.notice}>{error}</p>:null}
  {message==="enrolled"?<p role="status" className={styles.success}>You're enrolled. Choose a lesson to begin.</p>:null}
  {message==="media"?<p role="status" className={styles.success}>Media reflection saved to your progress.</p>:null}
  {message==="submitted"?<p role="status" className={styles.success}>Your practical reflection was sent for review.</p>:null}
  <section className={styles.sourcePanel} aria-label="Learning quality and gaps">
    <h2>What this course actually teaches</h2>
    <p>{quality.evidence.join(" · ")}</p>
    <details><summary>View what is still missing before professional mastery</summary>
      <ul>{quality.gaps.map(g=><li key={g}>{g}</li>)}</ul>
      <p>Passing a quiz or ticking off a lesson is not supervised competency evidence.</p>
    </details>
  </section>
  {id==="repair-laptop-refurb"?<section className={styles.sourcePanel} aria-label="Advanced practical storage upgrade field lab">
   <strong>Featured practical · HDD-to-SSD cloning and acceptance</strong>
   <p>Work through five adaptive repair decisions based on an actual Macrium clone that crawled at 94–96% and then completed. Includes visual timeline, narrated explanations, real manufacturer training, an evidence record and a supervisor verification checklist.</p>
   <p className={styles.hint}>Complete the orientation lessons too. A simulation score is not a practical sign-off; use your finished notes in the supervised assessment below.</p>
   <Link className={styles.secondaryLink} href="/learn/repair-laptop-refurb/field-lab">Open the advanced SSD clone field lab →</Link>
   <p>Model-specific study: HP 250 G3 2.5-inch SATA replacement, data preservation and post-repair verification.</p>
   <p><Link href="https://github.com/joshualparris/DubboEwaste/blob/main/docs/SSD-UPGRADE-MASTERY-HP250G3-2026-10-11.md" target="_blank" rel="noopener noreferrer">Read the full SSD upgrade masterclass ↗</Link></p>
   <p><Link href="/storage-guide">Explore the visual drive interface and compatibility atlas →</Link></p>
  </section>:null}
  {deep?<section className={styles.deepPanel} aria-label="In-depth courses and comparison">
    <span className={styles.deepEyebrow}>Course benchmark and further study</span>
    <h2>This is a starting point, not the whole course.</h2>
    <p>{deep.benchmark}</p>
    <p><strong>What mastery looks like:</strong> {deep.target}</p>
    <p className={styles.deepSafety}><strong>Boundary:</strong> {deep.limits}</p>
    <h3>Follow a substantial external course or training programme</h3>
    <div className={styles.deepResources}>
      {deep.resources.map((r,i)=><article key={r.url}>
        <span className={styles.deepType}>{i===0?"Recommended first":"Further depth"} · {r.kind}</span>
        <h4>{r.title}</h4>
        <p><strong>{r.provider}</strong> · {r.access}</p>
        <p>{r.why}</p>
        <a href={r.url} target="_blank" rel="noopener noreferrer">Open the original course or reference ↗</a>
      </article>)}
    </div>
    <p className={styles.deepFoot}>Provider learning is hosted externally. Pricing, entry requirements and certificates are controlled by the provider. We don't claim that internal orientation equals professional competence or external course completion.</p>
   </section>:null}
  {id==="repair-service-pricing"?<section className={styles.pricingHero}>
    <span>INTERACTIVE CAPSTONE · WORKED SIMULATIONS</span>
    <h2>Repair Pricing Studio</h2>
    <p>Make decisions with fictional costs: calculate a billable-hour floor, build GST-aware quotes, respond to scope changes, then compare escalating cases. Includes feedback, worked answers, customer handover and spaced review.</p>
    <div className={styles.pricingCalloutStats}><strong>4 scenarios</strong><strong>4 practice stages</strong><strong>Video, audio and official sources</strong></div>
    <Link className={styles.pricingStart} href="/learn/repair-service-pricing/studio">Open the interactive Pricing Studio →</Link>
    <p className={styles.hint}>Practice stays in this browser; the studio does not create a real invoice or certify business competence.</p>
  </section>:null}
  <section className={styles.section}>
   <h2>{deep?"Orientation lessons + applied problems":"Your lessons"}</h2>
   <div className={styles.lessonList}>
    {course.lessons.map((lesson,index)=>{
      const completed=done.some(x=>x.lesson_slug===lesson.id);
      return <div className={styles.lessonRow} key={lesson.id}>
       <span className={styles.lessonIndex} aria-hidden="true">{completed?"✓":index+1}</span>
       <div><h3>{lesson.title}</h3><p>{lesson.idea}</p><span className={styles.hint}>{completed?"Completed":"Ready when you are"}</span></div>
       {joined?<Link className={styles.secondaryLink} href={"/learn/"+id+"/"+lesson.id}>{completed?"Review":"Start"} →</Link>:<span className={styles.hint}>Join to open</span>}
      </div>;
    })}
   </div>
  </section>
  {id==="repair-laptop-refurb"?<RefurbAudioCompanion/>:null}
  {id==="repair-laptop-refurb" ? <section className={styles.sourcePanel} aria-label="Extended laptop refurbishment field labs">
   <h2>Apply it: diagnose, transplant, verify</h2>
   <p><strong>New · LCD donor-screen transplant lab:</strong> five adaptive missions grounded in a real ASUS A541U donor and HP 15-db0034au with cracked LCD. Work with PowerShell EDID evidence, panel labels, connector and mounting checks, safety stop-work gates, and a copyable supervisor evidence record.</p>
   <p>The real transplant is still unverified: matching 15.6-inch displays and 30-pin eDP are not enough to approve connection. Treat an unresolved connector orientation or pinout as <strong>HOLD</strong>.</p>
   <p><Link className={styles.primaryLink} href="/learn/repair-laptop-refurb/screen-transplant">Start the screen-transplant field lab →</Link></p>
   <p className={styles.hint}>Also available: <Link href="/learn/repair-laptop-refurb/field-lab">five-mission HDD-to-SSD clone field lab →</Link>. Both support the existing course rather than adding another shallow module.</p>
  </section>:null}
  {joined && id==="repair-laptop-refurb" ? <LaptopDiagnosticsLab /> : null}
  {joined && id==="repair-service-pricing" ? <RepairPricingStudio /> : null}
  {joined ? <AdaptiveAssessment courseId={id} /> : null}
  {media.length>0?<section className={styles.section} id="media">
   <h2>Watch, listen and reflect</h2>
   <p className={styles.hint}>Source-linked learning. Videos open on their provider's website, so a blocked embed cannot prevent learning. Captions and playback vary; written notes and primary reading remain available.</p>
   <div className={styles.catalogue}>
   {media.map(item=><article className={styles.courseCard} key={item.id}>
    <div className={styles.courseMeta}><span className={styles.track}>{item.type==="video"?"▶ Video":item.type==="podcast"?"♫ Podcast":"▤ Guide"}</span><span className={styles.hint}>{item.provenance}</span></div>
    <h3>{item.title}</h3><p>{item.summary}</p><p className={styles.hint}>{item.provider}</p>
    <p><strong>Think about:</strong> {item.focus}</p>
    <p className={styles.hint}>{item.accessibility}</p>
    <CourseMediaPlayer item={item}/>
    <a className={styles.secondaryLink} href={item.url} target="_blank" rel="noopener noreferrer">Open original {item.type} ↗</a>
    {joined?(watched.has(item.id)?<p className={styles.success}>✓ Your reflection is recorded</p>:
    <form action={finishMedia} className={styles.checkForm}>
      <input type="hidden" name="media" value={item.id}/>
      <label className={styles.acknowledgement}><input required type="checkbox" name="reflection_ack" value="yes"/><span>I've explored this resource and considered the question above.</span></label>
      <button className={styles.primaryButton}>Record learning</button>
    </form>):<p className={styles.hint}>Join the course to save your media learning.</p>}
   </article>)}
   </div>
  </section>:null}
  {id==="repair-laptop-refurb"?<section className={styles.sourcePanel} aria-label="Independent observed practical sign-off">
    <h2>Observed practical competence</h2>
    <p>Passing lessons, simulations or listening exercises is not a sign-off. An independent authorised supervisor must personally watch a safe repair demonstration, score six practical abilities and file the evidence record.</p>
    {signedOff.length>0?signedOff.slice(0,1).map(s=><div key={s.id}>
      <p className={styles.success}><strong>Supervisor-observed practical signed off</strong> · {rubricTotal(s)}/18 · observed {new Date((s.observed_on??"")+"T12:00:00").toLocaleDateString("en-AU")}</p>
      <p><strong>Observation method:</strong> {s.observation_method==="in_person"?"In person":"Live remote"} · <strong>Evidence reference:</strong> {s.evidence_reference} · <strong>Assessor recorded:</strong> {new Date(s.reviewed_at??s.submitted_at).toLocaleDateString("en-AU")}.</p>
      <ul>{refurbSkillNames.map(([key,label])=><li key={key}>{label}: {s[key]}/3</li>)}</ul>
      <p>{s.feedback}</p><p className={styles.hint}>This is a recorded local practical assessment, not an external trade qualification, licence or authorisation for regulated electrical work.</p>
    </div>):<p className={styles.notice}>No independently observed practical sign-off is recorded for your account yet. Complete the course and arrange a real supervised demonstration; a checkbox or catalogue entry alone cannot grant mastery.</p>}
    <p><a href="https://github.com/joshualparris/DubboEwaste/blob/main/docs/LAPTOP-REFURB-OBSERVED-SKILLS-ASSESSMENT-2026-10-11.md" target="_blank" rel="noopener noreferrer">Read the six-criterion assessor rubric ↗</a></p>
   </section>:null}
  <section className={styles.section} id="practical">
   <h2>Practical assessment</h2>
   <p className={styles.hint}>After completing the lessons, describe a safe activity or simulated scenario. A programme supervisor can review your explanation. Approval requires a separate recorded direct observation; it does not create professional qualifications or electrical authorisation.</p>
   {(reviews).map(x=><div className={styles.sourcePanel} key={x.id}><strong>Submitted {new Date(x.submitted_at).toLocaleDateString("en-AU")} · {x.status.replaceAll("_"," ")}</strong>{id==="repair-laptop-refurb"&&x.status==="approved"&&!independentlyObservedSignoff(x,user.id)?<p className={styles.notice}>Approval recorded, but the six-skill evidence is incomplete; this does not count as an independently observed sign-off.</p>:null}{x.feedback?<p>Supervisor feedback: {x.feedback}</p>:<p className={styles.hint}>Awaiting review</p>}</div>)}
   {joined&&progress.percent===100&&practicalAreas.length>0?
     <form action={submitPractical} className={styles.checkPanel}>
      <input type="hidden" name="course" value={id}/>
      <label className={styles.formField}>Your programme
       <select name="programme" required defaultValue={practicalAreas[0]}>
        {practicalAreas.map(p=><option key={p} value={p}>{programmes.find(x=>x.id===p)?.label??p}</option>)}
       </select>
      </label>
      <label className={styles.formField}>Explain what you practised, what you observed, any limits and what you would do next.
       <textarea name="reflection" required minLength={30} maxLength={3000} rows={5} placeholder={course.lessons[0].practice}/>
      </label>
      <button className={styles.primaryButton}>Send for supervisor review →</button>
     </form>:<p className={styles.hint}>{!joined?"Enrol first.":progress.percent!==100?"Complete the lessons to unlock the practical reflection.":"A programme membership is required to submit."}</p>}
  </section>
  <aside className={styles.sourcePanel}><h2>Source research</h2><p>Guidance is adapted for volunteers. Always follow approved current safety procedures.</p>
   <a href={"https://github.com/joshualparris/DubboEwaste/blob/main/"+course.source} target="_blank" rel="noopener noreferrer">Read the full source guide ↗</a>
  </aside>
 </div>;
}
