"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./RepairCafeInterestForm.module.css";

const participationOptions = [
  ["ATTEND", "I’d attend"],
  ["BRING_ITEM", "I have something I’d bring"],
  ["FIXER", "I could help repair things"],
  ["NON_FIXER", "I could help in another way"],
  ["PARTNER", "I represent a local organisation or business"],
  ["VENUE", "I may be able to offer a venue"],
];

const repairOptions = [
  "Computers & laptops",
  "Phones & electronics",
  "Bicycles",
  "Clothing & textiles",
  "Furniture & wood",
  "Tools & mechanical",
  "Small appliances",
  "Toys / other household items",
];

const timeOptions = ["Saturday morning", "Saturday afternoon", "Sunday", "Weekday evening", "Flexible"];

function checkedValues(form: FormData, key: string) {
  return form.getAll(key).map(String);
}

export function RepairCafeInterestForm() {
  const [startedAt, setStartedAt] = useState(0);
  const [status, setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => setStartedAt(Date.now()), []);

  function clearValidationError(event: FormEvent<HTMLFormElement>) {
    if (status !== "error") return;
    const data = new FormData(event.currentTarget);
    if (checkedValues(data, "participation").length > 0) {
      setStatus("idle");
      setMessage("");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!startedAt) return;

    const formEl = event.currentTarget;
    const data = new FormData(formEl);
    const participation = checkedValues(data, "participation");
    if (participation.length === 0) {
      setStatus("error");
      setMessage("Please choose at least one way you’d be interested.");
      return;
    }

    setStatus("sending");
    setMessage("");

    const payload = {
      participation,
      repair_interests: checkedValues(data, "repair_interests"),
      volunteer_roles: [],
      preferred_times: checkedValues(data, "preferred_times"),
      experience_level: null,
      preferred_venue: "",
      venue_suggestion: String(data.get("venue_suggestion") || ""),
      counterfactual: "",
      ideas: String(data.get("ideas") || ""),
      accessibility_notes: "",
      first_name: String(data.get("first_name") || ""),
      postcode: String(data.get("postcode") || ""),
      email: String(data.get("email") || ""),
      contact_consent: data.get("contact_consent") === "yes",
      privacy_acknowledged: data.get("privacy_acknowledged") === "yes",
      started_at: startedAt,
      website: String(data.get("website") || ""),
    };

    try {
      const response = await fetch("/api/repair-cafe-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save response.");
      setStatus("success");
      setMessage("Thanks. Your response is now part of the Repair Café Dubbo planning.");
      formEl.reset();
      setStartedAt(Date.now());
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not save response.");
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={submit}
      onChange={clearValidationError}
      data-no-pending="true"
    >
      <div className={styles.trap} aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <fieldset>
        <legend>What interests you? <span>*</span></legend>
        <div className={styles.checkGrid}>
          {participationOptions.map(([value,label]) => (
            <label className={styles.checkCard} key={value}>
              <input type="checkbox" name="participation" value={value} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>What kinds of things interest you?</legend>
        <div className={styles.checkGrid}>
          {repairOptions.map((label) => (
            <label className={styles.checkCard} key={label}>
              <input type="checkbox" name="repair_interests" value={label} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>When would suit you?</legend>
        <div className={styles.checkGrid}>
          {timeOptions.map((label) => (
            <label className={styles.checkCard} key={label}>
              <input type="checkbox" name="preferred_times" value={label} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Anything we should know?</legend>
        <label className={styles.field}>
          <span>Idea or venue suggestion (optional)</span>
          <textarea name="ideas" rows={3} maxLength={2000} placeholder="A repair type, venue, community partner or idea…" />
        </label>
        <input type="hidden" name="venue_suggestion" value="" />
      </fieldset>

      <fieldset>
        <legend>Contact (optional)</legend>
        <p className={styles.help}>Leave this blank if you only want to give anonymous feedback.</p>
        <div className={styles.twoCol}>
          <label className={styles.field}><span>First name</span><input name="first_name" maxLength={80} autoComplete="given-name" /></label>
          <label className={styles.field}><span>Postcode</span><input name="postcode" inputMode="numeric" maxLength={12} autoComplete="postal-code" /></label>
        </div>
        <label className={styles.field}><span>Email</span><input name="email" type="email" maxLength={254} autoComplete="email" /></label>
        <label className={styles.tickLine}>
          <input type="checkbox" name="contact_consent" value="yes" />
          <span>Contact me if a pilot or volunteer opportunity goes ahead.</span>
        </label>
      </fieldset>

      <label className={styles.tickLine}>
        <input type="checkbox" name="privacy_acknowledged" value="yes" required />
        <span>I understand this response is for Repair Café planning and my contact details will not be displayed publicly. <strong>*</strong></span>
      </label>

      <button className={styles.submit} type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send my response"}
      </button>

      <p className={status === "error" ? styles.error : styles.result} role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
