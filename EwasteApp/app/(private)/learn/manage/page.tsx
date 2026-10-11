import Link from "next/link";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {courses,programmes} from "@/lib/learning/catalog";
import {assignCourse,reviewPractical} from "./actions";
import {LibraryCodeControl} from "./LibraryCodeControl";
import {AssignmentForm} from "./AssignmentForm";
import styles from "../learning.module.css";

export default async function LearningManagement({searchParams}:{
 searchParams:Promise<{error?:string,message?:string}>
}){
 const {error,message}=await searchParams;
 const db=await createClient();
 const {data:{user}}=await db.auth.getUser();
 if(!user) redirect("/login");
 const [{data:profile},{data:ownMemberships}]=await Promise.all([
   db.from("profiles").select("role,active").eq("id",user.id).maybeSingle(),
   db.from("program_access").select("program,programme_role").eq("user_id",user.id).eq("active",true),
 ]);
 const global=profile?.active&&profile.role==="admin";
 const leading=new Set((ownMemberships??[]).filter(m=>m.programme_role==="admin").map(m=>m.program));
 if(!global&&!leading.size) redirect("/learn");
 const allowed=programmes.filter(p=>p.id!=="all"&&(global||leading.has(p.id)));
 const [accessResult,studentsResult,assignmentResult,reviewResult]=await Promise.all([
   db.from("program_access").select("user_id,program,active").eq("active",true),
   db.from("profiles").select("id,full_name,email,active").eq("active",true),
   db.from("learning_assignments").select("user_id,course_slug,programme,due_date,assigned_at").order("assigned_at",{ascending:false}).limit(30),
   db.from("learning_practical_submissions").select("id,user_id,course_slug,programme,reflection,submitted_at,status").eq("status","submitted").order("submitted_at",{ascending:true}).limit(40)
 ]);
 const membership=new Set((accessResult.data??[]).filter(x=>allowed.some(p=>p.id===x.program)).map(x=>x.user_id));
 const people=(studentsResult.data??[]).filter(p=>membership.has(p.id));
 const byId=new Map(people.map(p=>[p.id,p.full_name||p.email||"Volunteer"]));
 const pending=(reviewResult.data??[]).filter(x=>allowed.some(p=>p.id===x.programme));
 const assignments=(assignmentResult.data??[]).filter(x=>allowed.some(p=>p.id===x.programme));
 return <div className={styles.shell}>
  <nav className={styles.breadcrumbs}><Link href="/learn">Learning hub</Link><span>/</span><span>Supervisor desk</span></nav>
  <header className={styles.courseHero}><span className={styles.track}>Coordinator workspace</span><h1>Support your learners</h1>
  <p>Assign courses, review submitted work and record direct observation. This is not a substitute for independent qualifications or safety approvals.</p>
  <p className={styles.hint}>You can manage: {allowed.map(p=>p.label).join(", ")}</p></header>
  {error?<p className={styles.notice} role="alert">{error}</p>:null}
  {message?<p className={styles.success} role="status">{message==="assigned"?"Course assigned.":message==="reviewed"?"Review saved.":message}</p>:null}
  <section className={styles.checkPanel}><h2>Assign a course</h2>
   <AssignmentForm
    people={people.map(p=>({id:p.id,name:p.full_name||p.email||p.id,programmes:(accessResult.data??[]).filter(m=>m.user_id===p.id).map(m=>m.program)}))}
    programmes={allowed.map(p=>({id:p.id,label:p.label}))}
    courses={courses.map(c=>({id:c.id,title:c.title,programme:c.programme}))}
   />
  </section>
  <section className={styles.section}><h2>Practical work awaiting review ({pending.length})</h2>
    {pending.length===0?<p className={styles.hint}>No pending submissions in your programmes.</p>:pending.map(p=><article key={p.id} className={styles.checkPanel}>
      <div className={styles.courseMeta}><strong>{byId.get(p.user_id)??"Programme volunteer"}</strong><span className={styles.track}>{p.programme.replaceAll("_"," ")}</span></div>
      <h3>{courses.find(c=>c.id===p.course_slug)?.title||p.course_slug}</h3>
      <p><strong>What the learner reported:</strong> {p.reflection}</p>
      <p className={styles.hint}>Submitted {new Date(p.submitted_at).toLocaleDateString("en-AU")}</p>
      <form action={reviewPractical} className={styles.checkForm}>
       <input type="hidden" name="submission" value={p.id}/>
       <fieldset className={styles.quiz}><legend>Review outcome</legend>
         <label><input type="radio" name="decision" value="changes_requested" required/>Request improvements</label>
         <label><input type="radio" name="decision" value="approved" required/>Approve observed activity</label>
       </fieldset>
       {p.course_slug==="repair-laptop-refurb"?<>
        <p className={styles.hint}>For approval, personally observe a supervised repair or authorised training-device demonstration. Score every criterion. If the learner is not ready, select Request improvements; do not claim the rubric was passed.</p>
        <fieldset className={styles.quiz}><legend>Observed skills rubric · 0–3 per skill</legend>
         <p className={styles.hint}>0 = not demonstrated; 1 = developing; 2 = competent with limited prompts; 3 = reliable and explained. Approval requires 15/18 overall and at least 2/3 in consent and safety.</p>
         {([
          ["skill_consent","Owner permission, data privacy and custody"],
          ["skill_diagnosis","Evidence-based diagnosis and stop-work judgement"],
          ["skill_compatibility","Part, caddy and migration compatibility"],
          ["skill_safety","Battery isolation, ESD and source/target safety"],
          ["skill_verification","Boot, media and authorised file verification"],
          ["skill_handover","Handover, quote and old-drive disposition"]
         ] as const).map(([name,title])=><label key={name} className={styles.formField}>{title}
           <select name={name} defaultValue="" aria-label={title+" score"}>
             <option value="">Choose observed score</option>
             <option value="0">0 — Not shown</option>
             <option value="1">1 — Developing</option>
             <option value="2">2 — Competent</option>
             <option value="3">3 — Reliable and explained</option>
           </select>
         </label>)}
        </fieldset>
        <label className={styles.formField}>Observed on (actual day of demonstration)
         <input type="date" name="observed_on" />
        </label>
        <label className={styles.formField}>How you personally observed it
         <select name="observation_method" defaultValue="">
          <option value="">Choose observation method</option>
          <option value="in_person">In person</option>
          <option value="live_remote">Live video / remote</option>
         </select>
        </label>
        <label className={styles.formField}>Redacted evidence reference only (no names or serials)
         <input name="evidence_reference" minLength={8} maxLength={160} placeholder="DEW-TRAINING-2026-0042"/>
        </label>
        <label className={styles.acknowledgement}>
         <input type="checkbox" name="assessor_attested" value="yes"/>
         I personally observed the stated practical skills, verified the evidence reference, and certify these six scores were not inferred from quiz results.
        </label>
       </>:null}
       <label className={styles.acknowledgement}><input type="checkbox" name="observed" value="yes"/>{p.course_slug==="repair-laptop-refurb"?"I directly watched the learner demonstrate the actual procedures safely.":"I directly observed the practical demonstration."}</label>
       <label className={styles.formField}>Specific feedback to learner
        <textarea name="feedback" minLength={10} maxLength={2000} rows={3} required placeholder="What did you observe? Which safety boundaries or techniques were demonstrated?"/>
       </label>
       <button className={styles.primaryButton}>Record review →</button>
      </form>
    </article>)}
  </section>
  <section className={styles.section}><h2>Recently assigned courses</h2>
   {assignments.length===0?<p className={styles.hint}>No assignments yet.</p>:<div className={styles.lessonList}>
    {assignments.map((a,i)=><div className={styles.lessonRow} key={a.user_id+a.course_slug+a.programme+i}>
       <span className={styles.lessonIndex}>✓</span>
       <div><strong>{byId.get(a.user_id)??"Volunteer"}</strong><p>{courses.find(c=>c.id===a.course_slug)?.title||a.course_slug}</p><p className={styles.hint}>{a.programme.replaceAll("_"," ")}{a.due_date?" · Target "+a.due_date:""}</p></div>
    </div>)}
   </div>}
  </section>
  {global?<LibraryCodeControl/>:null}
 </div>;
}
