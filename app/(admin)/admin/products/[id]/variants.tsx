"use client";

import { useActionState } from "react";
import {
  deleteVariantAction,
  moveVariantAction,
  saveVariantAction,
  setDefaultVariantAction,
} from "@/lib/actions/admin";
import type { ProductVariant } from "@/lib/db/types";
import { formatPrice } from "@/lib/formatters";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";

type ActionState = { error?: string; ok?: boolean } | null;

function useVariantAction(productId: string) {
  return useActionState(
    async (_prev: ActionState, fd: FormData): Promise<ActionState> => saveVariantAction(productId, fd),
    null as ActionState,
  );
}

function VariantEditForm({ productId, v }: { productId: string; v: ProductVariant }) {
  const [state, action, pending] = useVariantAction(productId);
  return (
    <form action={action} className="mt-2 grid md:grid-cols-4 gap-2">
      <input type="hidden" name="id" value={v.id} />
      <input name="title" className="input" defaultValue={v.title} placeholder="Title (e.g. 500 g)" title="Title" />
      <input name="sku" className="input" defaultValue={v.sku} placeholder="SKU" title="SKU" />
      <input name="weight_grams" type="number" className="input" defaultValue={v.weight_grams} placeholder="Weight (g)" title="Weight (grams)" />
      <input name="price_inr" type="number" step="0.01" className="input" defaultValue={(v.price_paise / 100).toFixed(2).replace(/\.00$/, "")} placeholder="Price (₹)" title="Price in ₹" required />
      <input name="compare_at_inr" type="number" step="0.01" className="input" defaultValue={v.compare_at_paise ? (v.compare_at_paise / 100).toFixed(2).replace(/\.00$/, "") : ""} placeholder="Compare at (₹)" title="Compare at in ₹" />
      <input name="cost_inr" type="number" step="0.01" className="input" defaultValue={v.cost_paise ? (v.cost_paise / 100).toFixed(2).replace(/\.00$/, "") : ""} placeholder="Cost (₹)" title="Cost in ₹" />
      <input name="barcode" className="input" defaultValue={v.barcode ?? ""} placeholder="Barcode" title="Barcode" />
      <select name="status" className="input" defaultValue={v.status}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <button className="btn btn-ghost ink" disabled={pending}>
        Save variant
      </button>
      {state?.error && <p className="text-xs text-danger md:col-span-4">{state.error}</p>}
    </form>
  );
}

export function VariantPanel({ productId, variants }: { productId: string; variants: ProductVariant[] }) {
  const [addState, addAction, addPending] = useVariantAction(productId);
  return (
    <section className="mt-16">
      <h2 className="text-lg font-semibold">Variants</h2>
      <p className="text-xs text-ink-soft mt-1">First variant is the default shown on cards. Prices are in Indian Rupees (₹).</p>
      <ul className="mt-4 divide-y divide-line">
        {variants.map((v, i) => (
          <li key={v.id} className="py-3 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <span>
                {i === 0 && <span className="mr-2 text-[0.6rem] uppercase tracking-widest text-earth">Default</span>}
                {v.title} · {v.sku} · {formatPrice(v.price_paise)} · {v.weight_grams} g · {v.status}
              </span>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-widest">
                <form action={moveVariantAction.bind(null, v.id, productId, "up")}>
                  <button>Up</button>
                </form>
                <form action={moveVariantAction.bind(null, v.id, productId, "down")}>
                  <button>Down</button>
                </form>
                {i !== 0 && (
                  <form action={setDefaultVariantAction.bind(null, v.id, productId)}>
                    <button>Set default</button>
                  </form>
                )}
                <ConfirmSubmit
                  action={deleteVariantAction.bind(null, v.id, productId)}
                  label="Delete"
                  message="Delete this variant?"
                />
              </div>
            </div>
            <VariantEditForm productId={productId} v={v} />
          </li>
        ))}
      </ul>
      <form action={addAction} className="mt-6 grid md:grid-cols-3 gap-3 max-w-3xl">
        <input name="title" className="input" placeholder="Title (e.g. 250 g)" required />
        <input name="sku" className="input" placeholder="SKU (optional)" />
        <input name="weight_grams" type="number" className="input" placeholder="Weight grams (e.g. 250)" required />
        <input name="price_inr" type="number" step="0.01" className="input" placeholder="Price in ₹ (e.g. 299)" required />
        <input name="compare_at_inr" type="number" step="0.01" className="input" placeholder="Compare at in ₹ (e.g. 349)" />
        <input name="cost_inr" type="number" step="0.01" className="input" placeholder="Cost in ₹ (e.g. 180)" />
        <input name="barcode" className="input" placeholder="Barcode (optional)" />
        <select name="status" className="input" defaultValue="active">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="btn btn-primary" disabled={addPending}>
          Add variant
        </button>
        {addState?.error && <p className="text-xs text-danger md:col-span-3">{addState.error}</p>}
      </form>
    </section>
  );
}
