"use client";

import { useActionState } from "react";
import { saveCouponAction } from "@/lib/actions/admin";
import type { Coupon } from "@/lib/db/types";

export function CouponForm({ coupon }: { coupon?: Coupon }) {
  const [state, action, pending] = useActionState(saveCouponAction, null);
  const isEdit = Boolean(coupon);
  return (
    <form action={action} className="mt-8 max-w-xl space-y-4">
      {isEdit && <input type="hidden" name="id" value={coupon!.id} />}
      {state && "error" in (state ?? {}) && (
        <p className="text-sm text-red-600">{(state as { error: string }).error}</p>
      )}

      <div>
        <label className="label" htmlFor="code">Code</label>
        <input
          id="code" name="code" className="input mt-1" required
          defaultValue={coupon?.code}
          placeholder="e.g. WELCOME10"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="type">Type</label>
          <select id="type" name="type" className="input mt-1" defaultValue={coupon?.type ?? "percentage"}>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed amount (₹)</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="value">Value</label>
          <input
            id="value" name="value" type="number" step="0.01" className="input mt-1" required
            defaultValue={coupon ? (coupon.type === "fixed" ? coupon.value / 100 : coupon.value) : ""}
            placeholder="e.g. 10 for 10%"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="min_subtotal">Min order (₹)</label>
          <input
            id="min_subtotal" name="min_subtotal" type="number" step="0.01" className="input mt-1"
            defaultValue={coupon ? coupon.min_subtotal_paise / 100 : "0"}
          />
        </div>
        <div>
          <label className="label" htmlFor="max_discount">Max discount (₹, optional)</label>
          <input
            id="max_discount" name="max_discount" type="number" step="0.01" className="input mt-1"
            defaultValue={coupon?.max_discount_paise != null ? coupon.max_discount_paise / 100 : ""}
            placeholder="Leave blank for no cap"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="starts_at">Starts at</label>
          <input
            id="starts_at" name="starts_at" type="datetime-local" className="input mt-1"
            defaultValue={coupon ? new Date(coupon.starts_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
          />
        </div>
        <div>
          <label className="label" htmlFor="ends_at">Expires at</label>
          <input
            id="ends_at" name="ends_at" type="datetime-local" className="input mt-1"
            defaultValue={coupon ? new Date(coupon.ends_at).toISOString().slice(0, 16) : ""}
            required
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="usage_limit">Total usage limit (optional)</label>
          <input
            id="usage_limit" name="usage_limit" type="number" className="input mt-1"
            defaultValue={coupon?.usage_limit ?? ""}
            placeholder="Leave blank for unlimited"
          />
        </div>
        <div>
          <label className="label" htmlFor="per_customer_limit">Per customer limit (optional)</label>
          <input
            id="per_customer_limit" name="per_customer_limit" type="number" className="input mt-1"
            defaultValue={coupon?.per_customer_limit ?? ""}
            placeholder="Leave blank for unlimited"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="is_active" name="is_active" type="checkbox"
          defaultChecked={coupon?.is_active ?? true}
        />
        <label htmlFor="is_active">Active</label>
      </div>

      <button className="btn btn-primary w-full md:w-auto" disabled={pending}>
        {pending ? "Saving…" : isEdit ? "Save changes" : "Create coupon"}
      </button>
    </form>
  );
}
