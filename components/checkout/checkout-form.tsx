"use client";

import { useActionState, useMemo } from "react";
import { placeOrderAction } from "@/lib/actions/checkout";
import type { Address } from "@/lib/db/types";

const initial = { error: undefined as string | undefined };

export function CheckoutForm({
  email,
  addresses,
}: {
  email: string;
  addresses: Address[];
  couponCode: string | null;
}) {
  const [state, action, pending] = useActionState(placeOrderAction, initial);
  const key = useMemo(() => crypto.randomUUID(), []);

  return (
    <form action={action} className="mt-10 space-y-8">
      <input type="hidden" name="idempotency_key" value={key} />
      <section>
        <h2 className="font-serif text-2xl">1 · Customer</h2>
        <label className="label mt-4" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required defaultValue={email} className="input" />
      </section>

      <section>
        <h2 className="font-serif text-2xl">2 · Address</h2>
        {addresses.length > 0 && (
          <div className="mt-4 space-y-2">
            {addresses.map((a) => (
              <label key={a.id} className="flex gap-3 border border-line p-3">
                <input type="radio" name="address_id" value={a.id} defaultChecked={a.is_default} />
                <span>
                  {a.name}, {a.line1}, {a.city} {a.postal_code}
                </span>
              </label>
            ))}
            <p className="text-xs text-ink-soft">Or enter a new address below (used if no saved address is selected).</p>
          </div>
        )}
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="name">
              Name
            </label>
            <input id="name" name="name" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              Phone
            </label>
            <input id="phone" name="phone" className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="line1">
              Address line 1
            </label>
            <input id="line1" name="line1" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="line2">
              Line 2
            </label>
            <input id="line2" name="line2" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="landmark">
              Landmark
            </label>
            <input id="landmark" name="landmark" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="city">
              City
            </label>
            <input id="city" name="city" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="state">
              State
            </label>
            <input id="state" name="state" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="postal_code">
              PIN
            </label>
            <input id="postal_code" name="postal_code" className="input" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl">3 · Notes</h2>
        <label className="label mt-4" htmlFor="coupon_code">
          Coupon
        </label>
        <input id="coupon_code" name="coupon_code" className="input" placeholder="WELCOME10" />
        <label className="label mt-4" htmlFor="notes">
          Order notes
        </label>
        <textarea id="notes" name="notes" className="input min-h-24" />
      </section>

      <section className="border border-dashed border-line p-5">
        <h2 className="font-serif text-2xl">4 · Payment</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Razorpay is not configured. Placing the order will <strong>not</strong> charge a card and will leave the order in{" "}
          <em>payment pending</em>.
        </p>
      </section>

      {state?.error && <p className="text-danger text-sm">{state.error}</p>}

      <button className="btn btn-primary" disabled={pending}>
        {pending ? "Creating order…" : "Place pending order"}
      </button>
    </form>
  );
}
