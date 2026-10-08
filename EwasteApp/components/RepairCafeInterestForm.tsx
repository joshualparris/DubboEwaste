"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./RepairCafeInterestForm.module.css";

const participationOptions = [
  ["ATTEND", "I’d attend a Repair Café"],
  ["BRING_ITEM", "I have something I’d bring"],
  ["FIXER", "I could volunteer as a fixer"],
  ["NON_FIXER", "I could help in another role"],
  ["PARTNER", "I represent a business or organisation"],
  ["VENUE", "I may be able to offer a venue"],
  ["TOOLS", "I could lend or donate tools/materials"],
];

const repairOptions = [
  "Computers & laptops",
  "Phones & tablets",
  "Electronics",
  "Small appliances",
  "Bicycles",
  "Clothing & textiles",
  "Furniture & wood",
  "Tools & mechanical",
  "Toys",
  "Jewellery",
];

const volunteerOptions = [
  "Computer / laptop fixer",
  "Electronics fixer",
  "Bike fixer",
  "Textile / sewing fixer",
  "Furniture / wood fixer",
  "Mechanical / tool fixer",
  "Small-appliance fixer",
  "Welcome & intake",
  "Setup & pack-down",
  "Tea / coffee",
  "Accessibility support",
  "Admin / bookings",
  "Photography / video",
  "Social media / promotion",
  "Data / impact tracking",
  "Venue host",
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!startedAt) return;
    setStatus("sending");
    setMessage("");

    const formEl = event.currentTarget;
    const data = new FormData(formEl);
    const payload = {
      participation: checkedValues(data, "participation"),
      repair_interests: checkedValues(data, "repair_interests"),
      volunteer_roles: checkedValues(data, "volunteer_roles"),
      preferred_times: checkedValues(data, "preferred_times"),
      experience_level: String(data.get("experience_level") || "") || null,
      preferred_venue: String(data.get("preferred_venue") || ""),
      venue_suggestion: String(data.get("venue_suggestion") || ""),
      counterfactual: String(data.get("counterfactual") || ""),
      ideas: String(data.get("ideas") || ""),
      accessibility_notes: String(data.get("accessibility_notes") || ""),
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
      setMessage("Thanks. Your ideas are now part of the Dubbo Repair Café planning.");
      formEl.reset();
      setStartedAt(Date.now());
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not save response.");
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.trap} aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <fieldset>
        <legend>How would you like to be involved? <span>*</span></legend>
        <p className={styles.help}>Choose as many as fit you.</p>
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
        <legend>What would you like to repair, learn or help with?</legend>
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
        <legend>If you volunteered, what could you help with?</legend>
        <p className={styles.help}>Fixing things is only one kind of volunteering.</p>
        <div className={styles.checkGrid}>
          {volunteerOptions.map((label) => (
            <label className={styles.checkCard} key={label}>
              <input type="checkbox" name="volunteer_roles" value={label} />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <label className={styles.field}>
          <span>Your repair confidence</span>
          <select name="experience_level" defaultValue="">
            <option value="">Not applicable / prefer not to say</option>
            <option value="LEARN">I want to learn</option>
            <option value="BEGINNER">Beginner</option>
            <option value="HOBBYIST">Hobbyist</option>
            <option value="EXPERIENCED">Experienced</option>
            <option value="TRADE_PRO">Trade / professional</option>
          </select>
        </label>
      </fieldset>

      <fieldset>
        <legend>Where should it happen?</legend>
        <label className={styles.field}>
          <span>Which idea sounds best?</span>
          <select name="preferred_venue" defaultValue="">
            <option value="">No preference yet</option>
            <option>Western Plains Cultural Centre / Community Arts Centre</option>
            <option>Dubbo Pipe Band Hall</option>
            <option>Connecting Community Services</option>
            <option>Dubbo Library</option>
            <option>Men's Shed partnership at a public event</option>
            <option>Rotating pop-up venues around Dubbo</option>
            <option>Somewhere else</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>Suggest a venue or tell us why</span>
          <textarea name="venue_suggestion" rows={3} maxLength={800} placeholder="A hall, school, community space, business, club or somewhere we have missed…" />
        </label>
      </fieldset>

      <fieldset>
        <legend>When would work for you?</legend>
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
        <legend>If there were no Repair Café, what would you most likely do with a broken item?</legend>
        <label className={styles.field}>
          <span>This helps us measure whether repair would actually prevent waste.</span>
          <select name="counterfactual" defaultValue="">
            <option value="">Choose one (optional)</option>
            <option>Pay a commercial repairer</option>
            <option>Try to fix it myself</option>
            <option>Ask family or a friend</option>
            <option>Keep it broken for now</option>
            <option>Give it away</option>
            <option>Replace it and recycle the old one</option>
            <option>Replace it and throw the old one out</option>
            <option>Not sure</option>
          </select>
        </label>
      </fieldset>

      <fieldset>
        <legend>What would make this useful and welcoming?</legend>
        <label className={styles.field}>
          <span>Your ideas</span>
          <textarea name="ideas" rows={4} maxLength={2000} placeholder="Repair types, partner organisations, workshop ideas, ways to make it family-friendly, anything else…" />
        </label>
        <label className={styles.field}>
          <span>Accessibility or participation needs (optional)</span>
          <textarea name="accessibility_notes" rows={3} maxLength={1000} placeholder="For example: step-free access, quieter times, seating, communication support…" />
        </label>
      </fieldset>

      <fieldset>
        <legend>About you</legend>
        <p className={styles.help}>You can give feedback anonymously. Add contact details only if you want follow-up.</p>
        <div className={styles.twoCol}>
          <label className={styles.field}><span>First name (optional)</span><input name="first_name" maxLength={80} autoComplete="given-name" /></label>
          <label className={styles.field}><span>Postcode (optional)</span><input name="postcode" inputMode="numeric" maxLength={12} autoComplete="postal-code" /></label>
        </div>
        <label className={styles.field}><span>Email (optional)</span><input name="email" type="email" maxLength={254} autoComplete="email" /></label>
        <label className={styles.tickLine}>
          <input type="checkbox" name="contact_consent" value="yes" />
          <span>You can contact me about Repair Café Dubbo planning or a future pilot.</span>
        </label>
      </fieldset>

      <label className={styles.tickLine}>
        <input type="checkbox" name="privacy_acknowledged" value="yes" required />
        <span>I understand this response is for Repair Café planning. It will not be published with my contact details. <strong>*</strong></span>
      </label>

      <button className={styles.submit} type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Add my ideas"}
      </button>

      <p className={status === "error" ? styles.error : styles.result} role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
