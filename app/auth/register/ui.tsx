"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth";

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, { error: undefined as string | undefined });
  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label className="label" htmlFor="full_name">
          Name
        </label>
        <input id="full_name" name="full_name" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="phone">
          Phone
        </label>
        <input id="phone" name="phone" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input id="password" name="password" type="password" required minLength={8} className="input" />
      </div>
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}
