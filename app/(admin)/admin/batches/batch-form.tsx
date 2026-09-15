"use client";

import { useActionState, useState } from "react";
import { createBatchAction } from "@/lib/actions/admin";
import type { Product } from "@/lib/db/types";

export function BatchForm({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createBatchAction, null);

  const isSuccess = state && "ok" in state && (state as { ok: boolean }).ok;

  if (isSuccess && open) {
    return (
      <div className="border border-line bg-warmwhite p-5 mb-8">
        <p className="font-serif text-lg text-forest font-medium">✓ New batch lot created!</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn btn-ghost text-xs mt-3"
        >
          Add another batch
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn btn-primary text-xs py-2 px-4"
        >
          + Record New Batch
        </button>
      </div>
    );
  }

  return (
    <div className="border border-line bg-warmwhite p-6 mb-8 max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-xl">Create New Harvest / Lot Batch</h2>
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

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="batch_number">Batch / Lot Number</label>
            <input
              id="batch_number"
              name="batch_number"
              className="input mt-1 font-mono uppercase"
              placeholder="e.g. HON-2026-B02"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="product_id">Product</label>
            <select id="product_id" name="product_id" className="input mt-1" required>
              <option value="">Choose product...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="label" htmlFor="harvest_date">Harvest Date (opt)</label>
            <input id="harvest_date" name="harvest_date" type="date" className="input mt-1" />
          </div>
          <div>
            <label className="label" htmlFor="packaging_date">Packaging Date</label>
            <input
              id="packaging_date"
              name="packaging_date"
              type="date"
              className="input mt-1"
              defaultValue={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="expiry_date">Expiry Date</label>
            <input id="expiry_date" name="expiry_date" type="date" className="input mt-1" required />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="initial_quantity">Initial Quantity (Units)</label>
          <input
            id="initial_quantity"
            name="initial_quantity"
            type="number"
            min="1"
            className="input mt-1"
            placeholder="e.g. 100"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="notes">Quality / Source Notes</label>
          <input
            id="notes"
            name="notes"
            className="input mt-1"
            placeholder="e.g. Verified organic farm lot, tested zero chemical residue"
          />
        </div>

        <button className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : "Save Batch"}
        </button>
      </form>
    </div>
  );
}
