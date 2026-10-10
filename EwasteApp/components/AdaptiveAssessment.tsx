"use client";
import { useEffect, useState } from "react";
import { adapt, initialAdaptiveState, levelLabel, parseAdaptiveState, pickChallenge, type AdaptiveState, type Challenge } from "@/lib/learning/adaptive";
import { practiceBankFor } from "@/lib/learning/challenges";

type Feedback = { item: Challenge; correct: boolean; selected: number; nextLevel: number };
const labels = ["Foundation","Practitioner","Expert"];
export default function AdaptiveAssessment({ courseId }: { courseId: string }) {
  const bank = practiceBankFor(courseId);
  const key = "dubbo-learning:adaptive:v1:" + courseId;
  const [state,setState] = useState<AdaptiveState>(initialAdaptiveState());
  const [ready,setReady] = useState(false);
  const [error,setError] = useState("");
  const [selected,setSelected] = useState<number|null>(null);
  const [reason,setReason] = useState("");
  const [offset,setOffset] = useState(0);
  const [feedback,setFeedback] = useState<Feedback|null>(null);
  const [answeredThisSession,setAnsweredThisSession] = useState(0);
  useEffect(()=>{
    try { setState(parseAdaptiveState(window.localStorage.getItem(key))); }
    catch { setError("Your browser cannot store progress. You can still practise, but results won't survive a refresh."); }
    setReady(true);
  },[key]);
  const current=pickChallenge(bank,state,courseId);
  function submit() {
    if(!current || selected===null || feedback)return;
    const correct=selected===current.answer;
    const updated=adapt(state,correct,current.id);
    try { window.localStorage.setItem(key,JSON.stringify(updated)); setError(""); }
    catch { setError("Could not save adaptive progress to this browser."); }
    setState(updated);
    setFeedback({item:current,correct,selected,nextLevel:updated.level});
    setAnsweredThisSession(x=>x+1);
  }
  const display = feedback?.item ?? current;
  // A fresh presentation order prevents any fixed-position answer-key shortcut.
  const visibleId=display?.id;
  useEffect(()=>{setOffset(Math.floor(Math.random()*3));},[visibleId]);
  const choices = display ? [0,1,2].map(i=>(i+offset)%3) : [];
  return <section id="adaptive-mastery" className="space-y-4 rounded-2xl border p-5" aria-label="Adaptive mastery practice">
    <header className="space-y-2">
      <h2 className="text-2xl font-semibold">Adaptive mastery challenge</h2>
      <p>Starts at Practitioner. Three correct in a row → harder; two mistakes in three → easier with targeted practice. Only assessed answers affect difficulty.</p>
      <p className="text-sm">Current level: <strong>{levelLabel(state.level)}</strong> · {state.correct}/{state.attempts} correct overall · {answeredThisSession} answered in this session.</p>
      <p className="text-sm">This is extra practice across relevant courses, not a substitute for safety induction or observed supervisor sign-off. Progress is saved only on this browser.</p>
      {error ? <p role="alert">{error}</p>:null}
    </header>
    {!ready ? <p>Loading your practice history…</p> : !display ?
      <p role="status">You have completed the available unseen cases in this pathway. Return after new challenges are added. No memorised questions will be reused to inflate your score.</p>:
      <div className="space-y-3">
        <p className="text-sm font-medium">Question level: {labels[display.level-1]} · Topic: {display.topic?.replaceAll("-"," ")}</p>
        <h3 className="text-lg font-semibold">{display.question}</h3>
        <label className="block space-y-2">
          <span>Optional reflection: explain your reasoning. It is not graded or saved; only the chosen decision affects difficulty.</span>
          <textarea rows={3} className="w-full rounded-lg border p-3" value={reason} onChange={e=>setReason(e.target.value)} disabled={Boolean(feedback)} placeholder="What evidence matters, what is uncertain, and why?" />
        </label>
        <fieldset className="space-y-2" disabled={Boolean(feedback)}>
          <legend className="font-medium">Choose the best-supported response</legend>
          {choices.map((originalIndex)=><label key={originalIndex} className="flex gap-3 rounded-lg border p-3">
            <input type="radio" name={"adaptive-"+courseId} checked={selected===originalIndex} onChange={()=>setSelected(originalIndex)}/>
            <span>{display.options[originalIndex]}</span>
          </label>)}
        </fieldset>
        {!feedback?<button type="button" onClick={submit} disabled={selected===null} className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white disabled:opacity-40">Check decision</button>:
        <div className="space-y-3" role="status">
          <p className="font-semibold">{feedback.correct?"Correct.":"Not yet."} {feedback.item.explanation}</p>
          <p>Best-supported option: {feedback.item.options[feedback.item.answer]}</p>
          <p>Difficulty is now <strong>{levelLabel(feedback.nextLevel as 1|2|3)}</strong>. {feedback.correct?"Keep going: the pathway increases challenge with consistent success.":"Review the relevant course and try the next case."}</p>
          <button type="button" className="rounded-lg border px-5 py-3" onClick={()=>{setFeedback(null);setSelected(null);setReason("");}}>Next adaptive challenge →</button>
        </div>}
      </div>}
  </section>;
}
