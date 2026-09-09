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
              className="mt-2 inline-flex min-h-11 items-center text-xs uppercase tracking-widest underline underline-offset-4"
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
        {(
          [
            ["name", "Name", "name", undefined],
            ["phone", "Phone", "tel", "tel"],
            ["line1", "Line 1", "address-line1", undefined],
            ["line2", "Line 2", "address-line2", undefined],
            ["landmark", "Landmark", undefined, undefined],
            ["city", "City", "address-level2", undefined],
            ["state", "State", "address-level1", undefined],
            ["postal_code", "PIN", "postal-code", "numeric"],
          ] as const
        ).map(([name, label, auto, mode]) => (
          <div key={name}>
            <label className="label" htmlFor={name}>
              {label}
            </label>
            <input
              id={name}
              name={name}
              className="input"
              autoComplete={auto}
              inputMode={mode}
              maxLength={name === "postal_code" ? 6 : name === "phone" ? 15 : undefined}
              required={["name", "phone", "line1", "city", "state", "postal_code"].includes(name)}
            />
          </div>
        ))}
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input type="checkbox" name="is_default" /> Default
        </label>
        {state && "error" in state && state.error && <p className="text-sm text-danger">{state.error}</p>}
        <button className="btn btn-primary w-full md:w-auto" disabled={pending}>
          Save
        </button>
      </form>
    </div>
  );
}
