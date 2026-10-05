"use client";

import { useEffect } from "react";

function pendingLabel(label: string) {
  const value = label.trim().toLowerCase();
  if (value.includes("delete") || value.includes("remove") || value.includes("clear")) return "Deleting…";
  if (value.includes("create") || value.includes("accept and create") || value.includes("new version")) return "Creating…";
  if (value.includes("save") || value.includes("update") || value.includes("restore")) return "Saving…";
  if (value.includes("convert")) return "Converting…";
  if (value.includes("issue")) return "Issuing…";
  if (value.includes("run") || value.includes("search")) return "Working…";
  if (value.includes("sign in")) return "Signing in…";
  if (value.includes("sign out")) return "Signing out…";
  if (value.includes("snapshot")) return "Creating…";
  if (value.includes("log")) return "Saving…";
  return "Working…";
}

function restoreForm(form: HTMLFormElement) {
  delete form.dataset.pending;
  form.removeAttribute("aria-busy");

  form.querySelectorAll<HTMLButtonElement>("button[type='submit']").forEach((button) => {
    button.disabled = button.dataset.wasDisabled === "true";
    delete button.dataset.wasDisabled;
    if (button.dataset.originalLabel !== undefined) {
      button.textContent = button.dataset.originalLabel;
      delete button.dataset.originalLabel;
    }
    button.classList.remove("is-pending");
  });

  form.querySelectorAll<HTMLInputElement>("input[type='submit']").forEach((input) => {
    input.disabled = input.dataset.wasDisabled === "true";
    delete input.dataset.wasDisabled;
    if (input.dataset.originalLabel !== undefined) {
      input.value = input.dataset.originalLabel;
      delete input.dataset.originalLabel;
    }
    input.classList.remove("is-pending");
  });

  form.querySelector("[data-form-pending-message]")?.remove();
}

export function FormSubmitFeedback() {
  useEffect(() => {
    const onSubmit = (event: SubmitEvent) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || form.dataset.noPending === "true") return;

      if (form.dataset.pending === "true") {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      form.dataset.pending = "true";
      form.setAttribute("aria-busy", "true");

      const submitter = event.submitter;
      const buttons = Array.from(
        form.querySelectorAll<HTMLButtonElement | HTMLInputElement>(
          "button[type='submit'], input[type='submit']",
        ),
      );

      buttons.forEach((button) => {
        button.dataset.wasDisabled = button.disabled ? "true" : "false";
        button.disabled = true;
      });

      if (submitter instanceof HTMLButtonElement) {
        const original = submitter.textContent?.trim() || "Submit";
        submitter.dataset.originalLabel = original;
        submitter.textContent = submitter.dataset.pendingLabel || pendingLabel(original);
        submitter.classList.add("is-pending");
      } else if (submitter instanceof HTMLInputElement) {
        const original = submitter.value || "Submit";
        submitter.dataset.originalLabel = original;
        submitter.value = submitter.dataset.pendingLabel || pendingLabel(original);
        submitter.classList.add("is-pending");
      }

      const status = document.createElement("div");
      status.dataset.formPendingMessage = "true";
      status.className = "form-pending-message";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.textContent = "Please wait. Your action is being processed.";
      form.appendChild(status);

      window.setTimeout(() => {
        if (form.isConnected && form.dataset.pending === "true") {
          status.textContent = "This is taking longer than expected. Please wait rather than pressing the button again.";
        }
      }, 10000);
    };

    const onPageShow = () => {
      document.querySelectorAll<HTMLFormElement>("form[data-pending='true']").forEach(restoreForm);
    };

    document.addEventListener("submit", onSubmit, true);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      document.removeEventListener("submit", onSubmit, true);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
