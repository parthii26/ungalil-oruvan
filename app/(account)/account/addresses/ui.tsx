"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Address } from "@/lib/db/types";
import { createAddressAction, deleteAddressAction } from "@/lib/actions/account";

export function AddressManager({ addresses }: { addresses: Address[] }) {
  const [state, action, pending] = useActionState(createAddressAction, null);
  const [, start] = useTransition();
  const router = useRouter();

  return (
    <div className="mt-8 grid md:grid-cols-2 gap-8">
      <ul className="space-y-3">
        {addresses.map((a) => (
          <li key={a.id} className="border border-line p-4">
            <p className="font-medium">
              {a.name} {a.is_default && <span className="text-xs uppercase tracking-widest">Default</span>}
            </p>
            <p className="text-sm text-ink-soft">
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ""}
              <br />
              {a.city}, {a.state} {a.postal_code}
              <br />
              {a.phone}
            </p>
            <button
              className="mt-3 text-xs uppercase tracking-widest"
              onClick={() =>
                start(async () => {
                  await deleteAddressAction(a.id);
                  router.refresh();
                })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form action={action} className="space-y-3">
        <h2 className="font-serif text-2xl">Add address</h2>
        {[
          ["name", "Name"],
          ["phone", "Phone"],
          ["line1", "Line 1"],
          ["line2", "Line 2"],
          ["landmark", "Landmark"],
          ["city", "City"],
          ["state", "State"],
          ["postal_code", "PIN"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="label" htmlFor={name}>
              {label}
            </label>
            <input id={name} name={name} className="input" required={["name", "phone", "line1", "city", "state", "postal_code"].includes(name)} />
          </div>
        ))}
        <label className="flex gap-2 text-sm">
          <input type="checkbox" name="is_default" /> Default
        </label>
        {state && "error" in state && state.error && <p className="text-sm text-danger">{state.error}</p>}
        <button className="btn btn-primary" disabled={pending}>
          Save
        </button>
      </form>
    </div>
  );
}
