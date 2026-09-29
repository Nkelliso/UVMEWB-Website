"use client";

import { useActionState } from "react";
import { submitSignup, type ContactState } from "@/app/actions";

const initial: ContactState = { ok: false };

export default function EmailSignupForm() {
  const [state, formAction, pending] = useActionState(submitSignup, initial);

  if (state.ok) {
    return (
      <div className="ewb-note" role="status" style={{ fontSize: "1.05rem" }}>
        You&apos;re on the list. We&apos;ll email you meeting times and news.
      </div>
    );
  }

  return (
    <form action={formAction} className="ewb-form">
      {/* Honeypot — hidden from users; bots that fill it are silently dropped. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="ewb-field">
        <label htmlFor="name">Your name</label>
        <input
          className="ewb-input"
          id="name"
          name="name"
          autoComplete="name"
          required
        />
      </div>
      <div className="ewb-field">
        <label htmlFor="email">Email</label>
        <input
          className="ewb-input"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      {state.error && (
        <p className="ewb-note" role="alert" style={{ color: "var(--gold-ink)" }}>
          {state.error}
        </p>
      )}
      <button
        type="submit"
        className="ewb-btn ewb-btn-primary"
        disabled={pending}
      >
        {pending ? "Signing up…" : "Sign me up"} <span aria-hidden>→</span>
      </button>
    </form>
  );
}
