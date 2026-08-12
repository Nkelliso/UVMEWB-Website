"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions";

const initial: ContactState = { ok: false };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);

  if (state.ok) {
    return (
      <div className="ewb-note" style={{ fontSize: "1.05rem" }}>
        ✅ Thanks — your message is on its way. We&apos;ll be in touch soon.
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
        <input className="ewb-input" id="name" name="name" required />
      </div>
      <div className="ewb-field">
        <label htmlFor="email">Email</label>
        <input
          className="ewb-input"
          id="email"
          name="email"
          type="email"
          required
        />
      </div>
      <div className="ewb-field">
        <label htmlFor="message">Message</label>
        <textarea
          className="ewb-textarea"
          id="message"
          name="message"
          rows={5}
          required
        />
      </div>
      {state.error && (
        <p className="ewb-note" style={{ color: "var(--gold-deep)" }}>
          {state.error}
        </p>
      )}
      <button
        type="submit"
        className="ewb-btn ewb-btn-primary"
        disabled={pending}
      >
        {pending ? "Sending…" : "Send message"} <span aria-hidden>→</span>
      </button>
    </form>
  );
}
