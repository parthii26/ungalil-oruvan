"use client";

import { useActionState } from "react";
import { saveProfileAction } from "@/lib/actions/account";

export function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string }) {
  const [state, action, pending] = useActionState(saveProfileAction, null);
  return (
    <form action={action} className="mt-8 max-w-md space-y-4">
      <div>
        <label className="label">Email</label>
        <input className="input" value={email} disabled />
      </div>
      <div>
        <label className="label" htmlFor="full_name">
          Name
        </label>
        <input id="full_name" name="full_name" defaultValue={name} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="phone">
          Phone
        </label>
        <input id="phone" name="phone" defaultValue={phone} className="input" />
      </div>
      {state && "error" in state && state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && state.ok && <p className="text-sm">Saved.</p>}
      <button className="btn btn-primary" disabled={pending}>
        Save
      </button>
    </form>
  );
}
