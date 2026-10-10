"use client";

import { useState } from "react";

type Props = {
  courseTitle: string;
  lessonTitle: string;
  summary: string;
  practice: string;
};

export default function ActiveRecallPanel({ courseTitle, lessonTitle, summary, practice }: Props) {
  const [attempt, setAttempt] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [rating, setRating] = useState<"again" | "got-it" | null>(null);

  return (
    <section className="rounded-xl border p-5 space-y-4" aria-labelledby="active-recall-title">
      <p className="text-sm font-medium">Active study · Recall → reveal → compare → practise</p>
      <h2 id="active-recall-title" className="text-xl font-semibold">What can you remember?</h2>
      <p>Without looking back at the notes, explain the main idea of <strong>{lessonTitle}</strong> in your own words.</p>
      <label className="block space-y-2">
        <span className="font-medium">Your explanation (stays on this page, not submitted)</span>
        <textarea rows={3} value={attempt} onChange={(event) => { setAttempt(event.target.value); setRating(null); }}
          placeholder="Try to retrieve the idea from memory before revealing the reference." className="w-full rounded-lg border p-3" />
      </label>
      <button type="button" className="rounded-lg border px-4 py-2" aria-expanded={revealed}
        onClick={() => setRevealed((previous) => !previous)}>
        {revealed ? "Hide reference" : "Reveal reference and compare"}
      </button>
      {revealed ? <div className="space-y-3" role="region" aria-label="Recall comparison">
        <p><strong>Reference:</strong> {summary}</p>
        <p><strong>Use it:</strong> {practice}</p>
        <p>How accurately did you explain it without the notes?</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={rating === "again"} className="rounded-lg border px-4 py-2" onClick={() => setRating("again")}>Need more practice</button>
          <button type="button" aria-pressed={rating === "got-it"} className="rounded-lg border px-4 py-2" onClick={() => setRating("got-it")}>Remembered it</button>
        </div>
        {rating ? <p role="status" className="text-sm">{rating === "again"
          ? "Revisit this lesson tomorrow and practise with a new example."
          : "Good. Check your understanding again in a few days using a different example."}</p> : null}
      </div> : null}
      <p className="text-sm">This is a private practice exercise, not an assessment or an authorisation to handle devices. Formal progress and supervisor reviews remain in your learning account under {courseTitle}.</p>
    </section>
  );
}
