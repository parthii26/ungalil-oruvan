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
      <input name="title" className="input" defaultValue={v.title} />
      <input name="sku" className="input" defaultValue={v.sku} />
      <input name="weight_grams" className="input" defaultValue={v.weight_grams} />
      <input name="price_paise" className="input" defaultValue={v.price_paise} />
      <input name="compare_at_paise" className="input" defaultValue={v.compare_at_paise ?? ""} placeholder="Compare paise" />
      <input name="cost_paise" className="input" defaultValue={v.cost_paise ?? ""} placeholder="Cost paise" />
      <input name="barcode" className="input" defaultValue={v.barcode ?? ""} placeholder="Barcode" />
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
      <p className="text-xs text-ink-soft mt-1">First variant is the default shown on cards. Prices are integer paise.</p>
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
        <input name="sku" className="input" placeholder="SKU" required />
        <input name="weight_grams" className="input" placeholder="Weight grams" required />
        <input name="price_paise" className="input" placeholder="Price (paise)" required />
        <input name="compare_at_paise" className="input" placeholder="Compare at (paise)" />
        <input name="cost_paise" className="input" placeholder="Cost (paise)" />
        <input name="barcode" className="input" placeholder="Barcode" />
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
