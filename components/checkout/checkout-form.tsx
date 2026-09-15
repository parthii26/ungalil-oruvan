"use client";

import { useActionState, useMemo, useState } from "react";
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
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [onlineSimulated, setOnlineSimulated] = useState(true);

  return (
    <form action={action} className="mt-8 md:mt-10 space-y-8">
      <input type="hidden" name="idempotency_key" value={key} />
      <section>
        <h2 className="font-serif text-xl md:text-2xl">1 · Customer</h2>
        <label className="label mt-4" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={email}
          className="input"
          autoComplete="email"
          inputMode="email"
        />
      </section>

      <section>
        <h2 className="font-serif text-xl md:text-2xl">2 · Address</h2>
        {addresses.length > 0 && (
          <div className="mt-4 space-y-2">
            {addresses.map((a) => (
              <label key={a.id} className="flex min-h-12 items-center gap-3 border border-line bg-warmwhite p-3 text-sm">
                <input type="radio" name="address_id" value={a.id} defaultChecked={a.is_default} />
                <span>
                  {a.name}, {a.line1}, {a.city} {a.postal_code}
                </span>
              </label>
            ))}
            <p className="text-xs text-ink-soft">Or enter a new address below (used if no saved address is selected).</p>
          </div>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">
              Name
            </label>
            <input id="name" name="name" className="input" autoComplete="name" />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              Phone
            </label>
            <input id="phone" name="phone" className="input" autoComplete="tel" inputMode="tel" maxLength={15} />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="line1">
              Address line 1
            </label>
            <input id="line1" name="line1" className="input" autoComplete="address-line1" />
          </div>
          <div>
            <label className="label" htmlFor="line2">
              Line 2
            </label>
            <input id="line2" name="line2" className="input" autoComplete="address-line2" />
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
            <input id="city" name="city" className="input" autoComplete="address-level2" />
          </div>
          <div>
            <label className="label" htmlFor="state">
              State
            </label>
            <input id="state" name="state" className="input" autoComplete="address-level1" />
          </div>
          <div className="sm:col-span-2 sm:max-w-48">
            <label className="label" htmlFor="postal_code">
              PIN
            </label>
            <input
              id="postal_code"
              name="postal_code"
              className="input"
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength={6}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl md:text-2xl">3 · Notes</h2>
        <label className="label mt-4" htmlFor="coupon_code">
          Coupon
        </label>
        <input
          id="coupon_code"
          name="coupon_code"
          className="input uppercase"
          placeholder="WELCOME10"
          autoComplete="off"
          autoCapitalize="characters"
          enterKeyHint="next"
        />
        <label className="label mt-4" htmlFor="notes">
          Order notes
        </label>
        <textarea id="notes" name="notes" className="input" enterKeyHint="done" />
      </section>

      <section className="border border-line p-5 bg-warmwhite/50">
        <h2 className="font-serif text-xl md:text-2xl">4 · Payment Method</h2>
        <input type="hidden" name="payment_method" value={paymentMethod} />
        {paymentMethod === "online" && (
          <input type="hidden" name="online_paid" value={onlineSimulated ? "true" : "false"} />
        )}
        <div className="mt-4 space-y-3">
          <label className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-forest bg-cream" : "border-line bg-white"}`}>
            <input
              type="radio"
              name="_pay_choice"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="mt-1"
            />
            <div>
              <span className="font-medium text-forest text-sm">Cash on Delivery (COD)</span>
              <p className="text-xs text-ink-soft mt-0.5">Pay via cash or UPI QR at your doorstep upon delivery.</p>
            </div>
          </label>

          <label className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${paymentMethod === "online" ? "border-forest bg-cream" : "border-line bg-white"}`}>
            <input
              type="radio"
              name="_pay_choice"
              value="online"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
              className="mt-1"
            />
            <div className="flex-1">
              <span className="font-medium text-forest text-sm">Online Payment (Razorpay / UPI / Cards)</span>
              <p className="text-xs text-ink-soft mt-0.5">Instant checkout with UPI (Google Pay, PhonePe), NetBanking, or Credit/Debit Card.</p>
              {paymentMethod === "online" && (
                <div className="mt-3 pt-3 border-t border-line/60">
                  <label className="flex items-center gap-2 text-xs text-forest cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlineSimulated}
                      onChange={(e) => setOnlineSimulated(e.target.checked)}
                    />
                    <span>Authorize & confirm payment instantly (Sandbox / Test Mode)</span>
                  </label>
                </div>
              )}
            </div>
          </label>
        </div>
      </section>

      {state?.error && (
        <p className="text-danger text-sm" role="alert">
          {state.error}
        </p>
      )}

      <button className="btn btn-primary w-full md:w-auto text-sm" disabled={pending}>
        {pending
          ? "Processing order…"
          : paymentMethod === "cod"
          ? "Place Order (Cash on Delivery)"
          : onlineSimulated
          ? "Pay & Confirm Order"
          : "Proceed to Online Payment"}
      </button>
    </form>
  );
}
