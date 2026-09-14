"use client";

import { useActionState } from "react";
import { submitContactAction } from "@/lib/actions/contact";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactAction, null);
  if (state && "ok" in state && (state as { ok: boolean }).ok) {
    return (
      <div className="mt-10 border border-line bg-warmwhite p-6">
        <p className="font-serif text-xl">Message sent!</p>
        <p className="mt-2 text-ink-soft text-sm">We’ll get back to you soon.</p>
      </div>
    );
  }
  return (
    <form action={action} className="mt-10 space-y-4">
      {state && "error" in (state ?? {}) && (
        <p className="text-sm text-red-600">{(state as { error: string }).error}</p>
      )}
      <div>
        <label className="label" htmlFor="name">
          Name
        </label>
        <input id="name" name="name" className="input mt-1" required placeholder="Your name" />
      </div>
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="input mt-1"
          required
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="label" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          className="input min-h-28 mt-1"
          required
          placeholder="How can we help?"
        />
      </div>
      <button className="btn btn-primary" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
