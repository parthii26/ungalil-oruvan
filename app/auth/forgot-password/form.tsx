"use client";

import { useActionState } from "react";
import { resetPasswordRequestAction } from "@/lib/actions/auth";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(resetPasswordRequestAction, null);

  if (state?.ok) {
    return (
      <div className="mt-6 border border-line bg-warmwhite p-5 text-sm">
        <p className="font-serif text-lg text-forest">Instructions sent</p>
        <p className="mt-1 text-ink-soft">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-6 space-y-3">
      {state && !state.ok && (
        <p className="text-xs text-red-600">{state.error}</p>
      )}
      <div>
        <label className="label" htmlFor="email">Your registered email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="input mt-1"
        />
      </div>
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Sending instructions…" : "Send reset instructions"}
      </button>
    </form>
  );
}
