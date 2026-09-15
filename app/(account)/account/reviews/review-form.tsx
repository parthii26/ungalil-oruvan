"use client";

import { useActionState, useState } from "react";
import { submitReviewAction } from "@/lib/actions/reviews";
import type { Product } from "@/lib/db/types";

export function ReviewForm({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(submitReviewAction, null);

  const isSuccess = state && "ok" in state && (state as { ok: boolean }).ok;

  if (isSuccess && open) {
    return (
      <div className="border border-line bg-warmwhite p-5 mb-8">
        <p className="font-serif text-lg text-forest font-medium">✓ Review submitted!</p>
        <p className="text-sm text-ink-soft mt-1">Thank you for sharing your experience.</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn btn-ghost text-xs mt-4"
        >
          Write another review
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="mb-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn btn-primary text-xs py-2 px-4"
        >
          + Write a Product Review
        </button>
      </div>
    );
  }

  return (
    <div className="border border-line bg-warmwhite p-6 mb-8 max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-xl">Write a Review</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-ink-soft hover:text-ink"
        >
          Cancel
        </button>
      </div>

      <form action={action} className="space-y-4">
        {state && "error" in (state ?? {}) && (
          <p className="text-sm text-red-600">{(state as { error: string }).error}</p>
        )}

        <div>
          <label className="label" htmlFor="product_id">Select Product</label>
          <select id="product_id" name="product_id" className="input mt-1" required>
            <option value="">Choose a product...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="rating">Rating</label>
          <select id="rating" name="rating" className="input mt-1" defaultValue="5">
            <option value="5">★★★★★ (5/5) Excellent</option>
            <option value="4">★★★★☆ (4/5) Very Good</option>
            <option value="3">★★★☆☆ (3/5) Average</option>
            <option value="2">★★☆☆☆ (2/5) Below Expectations</option>
            <option value="1">★☆☆☆☆ (1/5) Poor</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="title">Headline</label>
          <input
            id="title"
            name="title"
            className="input mt-1"
            placeholder="e.g. Pure authentic aroma, highly recommend!"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="body">Your Review</label>
          <textarea
            id="body"
            name="body"
            className="input mt-1 min-h-28 text-sm"
            placeholder="Tell other food lovers what you liked about taste, freshness, and packaging..."
            required
          />
        </div>

        <button className="btn btn-primary w-full sm:w-auto" disabled={pending}>
          {pending ? "Submitting…" : "Post Review"}
        </button>
      </form>
    </div>
  );
}
